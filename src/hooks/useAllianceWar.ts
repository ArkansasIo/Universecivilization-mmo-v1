import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AllianceWar {
  id: string;
  attacker_alliance_id: string;
  defender_alliance_id: string;
  status: 'declared' | 'active' | 'ended';
  attacker_points: number;
  defender_points: number;
  start_time: string;
  end_time: string | null;
  winner_alliance_id: string | null;
  attacker_alliance?: any;
  defender_alliance?: any;
}

interface WarBattle {
  id: string;
  war_id: string;
  attacker_player_id: string;
  defender_player_id: string;
  attacker_won: boolean;
  points_awarded: number;
  battle_time: string;
}

export const useAllianceWar = (allianceId: string | null) => {
  const [currentWar, setCurrentWar] = useState<AllianceWar | null>(null);
  const [warHistory, setWarHistory] = useState<AllianceWar[]>([]);
  const [battles, setBattles] = useState<WarBattle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (allianceId) {
      loadWarData();
    }
  }, [allianceId]);

  const loadWarData = async () => {
    try {
      // Load current active war
      const { data: activeWar } = await supabase
        .from('alliance_wars')
        .select(`
          *,
          attacker_alliance:alliances!alliance_wars_attacker_alliance_id_fkey(id, name, tag),
          defender_alliance:alliances!alliance_wars_defender_alliance_id_fkey(id, name, tag)
        `)
        .or(`attacker_alliance_id.eq.${allianceId},defender_alliance_id.eq.${allianceId}`)
        .in('status', ['declared', 'active'])
        .order('start_time', { ascending: false })
        .limit(1)
        .single();

      setCurrentWar(activeWar || null);

      // Load war history
      const { data: history } = await supabase
        .from('alliance_wars')
        .select(`
          *,
          attacker_alliance:alliances!alliance_wars_attacker_alliance_id_fkey(id, name, tag),
          defender_alliance:alliances!alliance_wars_defender_alliance_id_fkey(id, name, tag)
        `)
        .or(`attacker_alliance_id.eq.${allianceId},defender_alliance_id.eq.${allianceId}`)
        .eq('status', 'ended')
        .order('end_time', { ascending: false })
        .limit(10);

      setWarHistory(history || []);

      // Load battles for current war
      if (activeWar) {
        const { data: warBattles } = await supabase
          .from('war_battles')
          .select('*')
          .eq('war_id', activeWar.id)
          .order('battle_time', { ascending: false });

        setBattles(warBattles || []);
      }
    } catch (error) {
      console.error('Error loading war data:', error);
    } finally {
      setLoading(false);
    }
  };

  const declareWar = async (targetAllianceId: string) => {
    try {
      if (!allianceId) return { success: false, error: 'No alliance' };

      const { error } = await supabase
        .from('alliance_wars')
        .insert({
          attacker_alliance_id: allianceId,
          defender_alliance_id: targetAllianceId,
          status: 'declared',
          attacker_points: 0,
          defender_points: 0,
          start_time: new Date().toISOString()
        });

      if (error) throw error;

      await loadWarData();
      return { success: true };
    } catch (error) {
      console.error('Error declaring war:', error);
      return { success: false, error };
    }
  };

  const acceptWar = async (warId: string) => {
    try {
      const { error } = await supabase
        .from('alliance_wars')
        .update({ status: 'active' })
        .eq('id', warId);

      if (error) throw error;

      await loadWarData();
      return { success: true };
    } catch (error) {
      console.error('Error accepting war:', error);
      return { success: false, error };
    }
  };

  const recordBattle = async (
    warId: string,
    attackerPlayerId: string,
    defenderPlayerId: string,
    attackerWon: boolean,
    pointsAwarded: number
  ) => {
    try {
      // Record battle
      await supabase
        .from('war_battles')
        .insert({
          war_id: warId,
          attacker_player_id: attackerPlayerId,
          defender_player_id: defenderPlayerId,
          attacker_won: attackerWon,
          points_awarded: pointsAwarded,
          battle_time: new Date().toISOString()
        });

      // Update war points
      const war = currentWar;
      if (!war) return { success: false };

      const isAttackerSide = war.attacker_alliance_id === allianceId;
      const pointsField = (isAttackerSide && attackerWon) || (!isAttackerSide && !attackerWon)
        ? (isAttackerSide ? 'attacker_points' : 'defender_points')
        : (isAttackerSide ? 'defender_points' : 'attacker_points');

      await supabase
        .from('alliance_wars')
        .update({
          [pointsField]: war[pointsField as keyof AllianceWar] as number + pointsAwarded
        })
        .eq('id', warId);

      await loadWarData();
      return { success: true };
    } catch (error) {
      console.error('Error recording battle:', error);
      return { success: false, error };
    }
  };

  const endWar = async (warId: string) => {
    try {
      const war = currentWar;
      if (!war) return { success: false };

      const winnerId = war.attacker_points > war.defender_points
        ? war.attacker_alliance_id
        : war.defender_alliance_id;

      const { error } = await supabase
        .from('alliance_wars')
        .update({
          status: 'ended',
          end_time: new Date().toISOString(),
          winner_alliance_id: winnerId
        })
        .eq('id', warId);

      if (error) throw error;

      await loadWarData();
      return { success: true };
    } catch (error) {
      console.error('Error ending war:', error);
      return { success: false, error };
    }
  };

  return {
    currentWar,
    warHistory,
    battles,
    loading,
    declareWar,
    acceptWar,
    recordBattle,
    endWar,
    reload: loadWarData
  };
};