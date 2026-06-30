import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface WorldBoss {
  id: string;
  name: string;
  level: number;
  health: number;
  max_health: number;
  attack: number;
  defense: number;
  rewards: {
    experience: number;
    credits: number;
    items: string[];
  };
  status: 'active' | 'defeated';
  spawn_time: string;
  defeat_time?: string;
}

interface BossParticipant {
  player_id: string;
  player_name: string;
  damage_dealt: number;
  rank: number;
}

export function useWorldBosses() {
  const { user } = useAuth();
  const [bosses, setBosses] = useState<WorldBoss[]>([]);
  const [activeBoss, setActiveBoss] = useState<WorldBoss | null>(null);
  const [participants, setParticipants] = useState<BossParticipant[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBosses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('world_bosses')
        .select('*')
        .order('spawn_time', { ascending: false })
        .limit(10);

      if (error && error.code !== 'PGRST116') throw error;

      const bossList: WorldBoss[] = (data || []).map(boss => ({
        id: boss.id,
        name: boss.name,
        level: boss.level,
        health: boss.current_health,
        max_health: boss.max_health,
        attack: boss.attack,
        defense: boss.defense,
        rewards: boss.rewards || { experience: 0, credits: 0, items: [] },
        status: boss.status,
        spawn_time: boss.spawn_time,
        defeat_time: boss.defeat_time
      }));

      setBosses(bossList);

      const active = bossList.find(b => b.status === 'active');
      if (active) {
        setActiveBoss(active);
        await loadParticipants(active.id);
      }
    } catch (error) {
      console.error('Error loading world bosses:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadParticipants = async (bossId: string) => {
    try {
      const { data, error } = await supabase
        .from('world_boss_participants')
        .select(`
          *,
          profiles:player_id (username)
        `)
        .eq('boss_id', bossId)
        .order('damage_dealt', { ascending: false });

      if (error && error.code !== 'PGRST116') throw error;

      const participantsList: BossParticipant[] = (data || []).map((p, index) => ({
        player_id: p.player_id,
        player_name: (p.profiles as any)?.username || 'Unknown',
        damage_dealt: p.damage_dealt,
        rank: index + 1
      }));

      setParticipants(participantsList);
    } catch (error) {
      console.error('Error loading participants:', error);
    }
  };

  useEffect(() => {
    loadBosses();

    // Subscribe to boss updates
    const channel = supabase
      .channel('world-boss-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'world_bosses'
        },
        () => {
          loadBosses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadBosses]);

  const attackBoss = async (bossId: string, damage: number) => {
    if (!user) return false;

    try {
      const boss = bosses.find(b => b.id === bossId);
      if (!boss || boss.status !== 'active') return false;

      const newHealth = Math.max(0, boss.health - damage);

      // Update boss health
      await supabase
        .from('world_bosses')
        .update({
          current_health: newHealth,
          status: newHealth <= 0 ? 'defeated' : 'active',
          defeat_time: newHealth <= 0 ? new Date().toISOString() : null
        })
        .eq('id', bossId);

      // Update participant damage
      const { data: existing } = await supabase
        .from('world_boss_participants')
        .select('*')
        .eq('boss_id', bossId)
        .eq('player_id', user.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('world_boss_participants')
          .update({
            damage_dealt: existing.damage_dealt + damage
          })
          .eq('id', existing.id);
      } else {
        await supabase.from('world_boss_participants').insert({
          boss_id: bossId,
          player_id: user.id,
          damage_dealt: damage
        });
      }

      // If boss defeated, distribute rewards
      if (newHealth <= 0) {
        await distributeRewards(bossId);
      }

      await loadBosses();
      return true;
    } catch (error) {
      console.error('Error attacking boss:', error);
      return false;
    }
  };

  const distributeRewards = async (bossId: string) => {
    try {
      const boss = bosses.find(b => b.id === bossId);
      if (!boss) return;

      const { data: participants } = await supabase
        .from('world_boss_participants')
        .select('*')
        .eq('boss_id', bossId)
        .order('damage_dealt', { ascending: false });

      if (!participants) return;

      // Distribute rewards based on damage contribution
      for (let i = 0; i < participants.length; i++) {
        const participant = participants[i];
        const rewardMultiplier = i === 0 ? 2 : i < 3 ? 1.5 : 1;

        // Add experience
        const { data: profile } = await supabase
          .from('profiles')
          .select('experience')
          .eq('id', participant.player_id)
          .maybeSingle();

        if (profile) {
          await supabase
            .from('profiles')
            .update({
              experience: (profile.experience || 0) + Math.floor(boss.rewards.experience * rewardMultiplier)
            })
            .eq('id', participant.player_id);
        }

        // Add resources
        const { data: resources } = await supabase
          .from('player_resources')
          .select('*')
          .eq('user_id', participant.player_id)
          .maybeSingle();

        if (resources) {
          await supabase
            .from('player_resources')
            .update({
              metal: (resources.metal || 0) + Math.floor(boss.rewards.credits * rewardMultiplier)
            })
            .eq('user_id', participant.player_id);
        }

        // Add items for top 3
        if (i < 3 && boss.rewards.items.length > 0) {
          const itemInserts = boss.rewards.items.map(itemId => ({
            player_id: participant.player_id,
            item_id: itemId,
            quantity: 1
          }));

          await supabase.from('player_inventory').insert(itemInserts);
        }
      }
    } catch (error) {
      console.error('Error distributing rewards:', error);
    }
  };

  const spawnBoss = async (
    name: string,
    level: number,
    maxHealth: number,
    attack: number,
    defense: number,
    rewards: WorldBoss['rewards']
  ) => {
    if (!user) return false;

    try {
      await supabase.from('world_bosses').insert({
        name,
        level,
        max_health: maxHealth,
        current_health: maxHealth,
        attack,
        defense,
        rewards,
        status: 'active',
        spawn_time: new Date().toISOString()
      });

      await loadBosses();
      return true;
    } catch (error) {
      console.error('Error spawning boss:', error);
      return false;
    }
  };

  return {
    bosses,
    activeBoss,
    participants,
    loading,
    attackBoss,
    spawnBoss,
    reload: loadBosses
  };
}
