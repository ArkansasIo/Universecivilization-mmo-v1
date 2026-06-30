import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Alliance {
  id: string;
  name: string;
  tag: string;
  description: string;
  leader_id: string;
  member_count: number;
  power: number;
  level: number;
  created_at: string;
}

interface AllianceMember {
  id: string;
  player_id: string;
  player_name: string;
  role: string;
  contribution: number;
  joined_at: string;
}

export function useAllianceSystem() {
  const { user } = useAuth();
  const [alliance, setAlliance] = useState<Alliance | null>(null);
  const [members, setMembers] = useState<AllianceMember[]>([]);
  const [allAlliances, setAllAlliances] = useState<Alliance[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAlliance = useCallback(async () => {
    if (!user) return;

    try {
      // Check if player is in an alliance
      const { data: membership, error: memberError } = await supabase
        .from('alliance_members')
        .select('alliance_id, role, contribution, joined_at')
        .eq('player_id', user.id)
        .maybeSingle();

      if (memberError && memberError.code !== 'PGRST116') throw memberError;

      if (membership) {
        // Load alliance details
        const { data: allianceData, error: allianceError } = await supabase
          .from('alliances')
          .select('*')
          .eq('id', membership.alliance_id)
          .single();

        if (allianceError) throw allianceError;

        // Count members
        const { count } = await supabase
          .from('alliance_members')
          .select('*', { count: 'exact', head: true })
          .eq('alliance_id', membership.alliance_id);

        setAlliance({
          ...allianceData,
          member_count: count || 0
        });

        // Load members
        await loadMembers(membership.alliance_id);
      } else {
        setAlliance(null);
        setMembers([]);
      }
    } catch (error) {
      console.error('Error loading alliance:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadMembers = async (allianceId: string) => {
    try {
      const { data, error } = await supabase
        .from('alliance_members')
        .select(`
          *,
          profiles:player_id (username)
        `)
        .eq('alliance_id', allianceId)
        .order('contribution', { ascending: false });

      if (error) throw error;

      const membersList: AllianceMember[] = (data || []).map(m => ({
        id: m.id,
        player_id: m.player_id,
        player_name: (m.profiles as any)?.username || 'Unknown',
        role: m.role,
        contribution: m.contribution || 0,
        joined_at: m.joined_at
      }));

      setMembers(membersList);
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  const loadAllAlliances = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('alliances')
        .select('*')
        .order('power', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Get member counts
      const alliancesWithCounts = await Promise.all(
        (data || []).map(async (alliance) => {
          const { count } = await supabase
            .from('alliance_members')
            .select('*', { count: 'exact', head: true })
            .eq('alliance_id', alliance.id);

          return {
            ...alliance,
            member_count: count || 0
          };
        })
      );

      setAllAlliances(alliancesWithCounts);
    } catch (error) {
      console.error('Error loading all alliances:', error);
    }
  }, []);

  useEffect(() => {
    loadAlliance();
    loadAllAlliances();
  }, [loadAlliance, loadAllAlliances]);

  const createAlliance = async (name: string, tag: string, description: string) => {
    if (!user) return false;

    try {
      // Create alliance
      const { data: newAlliance, error: createError } = await supabase
        .from('alliances')
        .insert({
          name,
          tag,
          description,
          leader_id: user.id,
          power: 0,
          level: 1
        })
        .select()
        .single();

      if (createError) throw createError;

      // Add creator as leader
      await supabase.from('alliance_members').insert({
        alliance_id: newAlliance.id,
        player_id: user.id,
        role: 'leader',
        contribution: 0
      });

      await loadAlliance();
      await loadAllAlliances();
      return true;
    } catch (error) {
      console.error('Error creating alliance:', error);
      return false;
    }
  };

  const joinAlliance = async (allianceId: string) => {
    if (!user) return false;

    try {
      await supabase.from('alliance_members').insert({
        alliance_id: allianceId,
        player_id: user.id,
        role: 'member',
        contribution: 0
      });

      await loadAlliance();
      return true;
    } catch (error) {
      console.error('Error joining alliance:', error);
      return false;
    }
  };

  const leaveAlliance = async () => {
    if (!user || !alliance) return false;

    try {
      await supabase
        .from('alliance_members')
        .delete()
        .eq('player_id', user.id)
        .eq('alliance_id', alliance.id);

      await loadAlliance();
      return true;
    } catch (error) {
      console.error('Error leaving alliance:', error);
      return false;
    }
  };

  const kickMember = async (playerId: string) => {
    if (!user || !alliance) return false;

    try {
      await supabase
        .from('alliance_members')
        .delete()
        .eq('player_id', playerId)
        .eq('alliance_id', alliance.id);

      await loadMembers(alliance.id);
      return true;
    } catch (error) {
      console.error('Error kicking member:', error);
      return false;
    }
  };

  const promoteToOfficer = async (playerId: string) => {
    if (!user || !alliance) return false;

    try {
      await supabase
        .from('alliance_members')
        .update({ role: 'officer' })
        .eq('player_id', playerId)
        .eq('alliance_id', alliance.id);

      await loadMembers(alliance.id);
      return true;
    } catch (error) {
      console.error('Error promoting member:', error);
      return false;
    }
  };

  const addContribution = async (amount: number) => {
    if (!user || !alliance) return;

    try {
      const { data: member } = await supabase
        .from('alliance_members')
        .select('contribution')
        .eq('player_id', user.id)
        .eq('alliance_id', alliance.id)
        .single();

      if (member) {
        await supabase
          .from('alliance_members')
          .update({
            contribution: (member.contribution || 0) + amount
          })
          .eq('player_id', user.id)
          .eq('alliance_id', alliance.id);

        await loadMembers(alliance.id);
      }
    } catch (error) {
      console.error('Error adding contribution:', error);
    }
  };

  return {
    alliance,
    members,
    allAlliances,
    loading,
    createAlliance,
    joinAlliance,
    leaveAlliance,
    kickMember,
    promoteToOfficer,
    addContribution,
    reload: loadAlliance
  };
}
