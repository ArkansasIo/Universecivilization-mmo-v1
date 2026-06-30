import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Guild {
  id: string;
  name: string;
  tag: string;
  description: string;
  leader_id: string;
  leader_name: string;
  level: number;
  experience: number;
  member_count: number;
  max_members: number;
  total_power: number;
  territory_count: number;
  treasury: {
    metal: number;
    crystal: number;
    deuterium: number;
    dark_matter: number;
  };
  perks: Array<{
    id: string;
    name: string;
    level: number;
    bonus: number;
  }>;
  requirements: {
    min_level: number;
    min_power: number;
    application_required: boolean;
  };
  created_at: string;
  status: 'active' | 'recruiting' | 'closed';
}

export interface GuildMember {
  id: string;
  player_id: string;
  player_name: string;
  guild_id: string;
  rank: 'leader' | 'officer' | 'veteran' | 'member' | 'recruit';
  contribution_points: number;
  joined_at: string;
  last_active: string;
  permissions: {
    invite: boolean;
    kick: boolean;
    promote: boolean;
    manage_treasury: boolean;
    declare_war: boolean;
  };
}

export interface GuildApplication {
  id: string;
  player_id: string;
  player_name: string;
  guild_id: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface GuildEvent {
  id: string;
  guild_id: string;
  event_type: 'raid' | 'war' | 'territory' | 'boss' | 'tournament';
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  participants: number;
  max_participants: number;
  rewards: {
    experience: number;
    credits: number;
    guild_points: number;
  };
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
}

export const useGuildSystem = (playerId: string) => {
  const [myGuild, setMyGuild] = useState<Guild | null>(null);
  const [guildMembers, setGuildMembers] = useState<GuildMember[]>([]);
  const [availableGuilds, setAvailableGuilds] = useState<Guild[]>([]);
  const [applications, setApplications] = useState<GuildApplication[]>([]);
  const [guildEvents, setGuildEvents] = useState<GuildEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (playerId) {
      loadGuildData();
    }
  }, [playerId, loadGuildData]);

  const loadGuildData = useCallback(async () => {
    try {
      setLoading(true);

      // Check if player is in a guild
      const { data: memberData, error: memberError } = await supabase
        .from('alliance_members')
        .select('*, alliances(*)')
        .eq('player_id', playerId)
        .maybeSingle();

      if (memberError && memberError.code !== 'PGRST116') throw memberError;

      if (memberData && memberData.alliances) {
        setMyGuild(memberData.alliances as Guild);

        // Load guild members
        const { data: membersData, error: membersError } = await supabase
          .from('alliance_members')
          .select('*')
          .eq('alliance_id', memberData.alliance_id)
          .order('contribution_points', { ascending: false });

        if (membersError) throw membersError;
        setGuildMembers(membersData || []);

        // Load guild events
        const { data: eventsData, error: eventsError } = await supabase
          .from('guild_events')
          .select('*')
          .eq('guild_id', memberData.alliance_id)
          .in('status', ['scheduled', 'active'])
          .order('start_time', { ascending: true });

        if (eventsError) throw eventsError;
        setGuildEvents(eventsData || []);

        // Load applications (if player has permission)
        if (memberData.rank === 'leader' || memberData.rank === 'officer') {
          const { data: appsData, error: appsError } = await supabase
            .from('guild_applications')
            .select('*')
            .eq('guild_id', memberData.alliance_id)
            .eq('status', 'pending');

          if (appsError) throw appsError;
          setApplications(appsData || []);
        }
      } else {
        // Load available guilds to join
        const { data: guildsData, error: guildsError } = await supabase
          .from('alliances')
          .select('*')
          .in('status', ['active', 'recruiting'])
          .order('level', { ascending: false })
          .limit(50);

        if (guildsError) throw guildsError;
        setAvailableGuilds(guildsData || []);
      }
    } catch (error) {
      console.error('Error loading guild data:', error);
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  const createGuild = async (name: string, tag: string, description: string) => {
    try {
      // Check if player already in a guild
      if (myGuild) {
        return { success: false, error: 'Already in a guild' };
      }

      // Create guild
      const { data: guildData, error: guildError } = await supabase
        .from('alliances')
        .insert({
          name,
          tag,
          description,
          leader_id: playerId,
          level: 1,
          experience: 0,
          member_count: 1,
          max_members: 50,
          total_power: 0,
          territory_count: 0,
          status: 'active'
        })
        .select()
        .single();

      if (guildError) throw guildError;

      // Add player as leader
      const { error: memberError } = await supabase
        .from('alliance_members')
        .insert({
          player_id: playerId,
          alliance_id: guildData.id,
          rank: 'leader',
          contribution_points: 0,
          permissions: {
            invite: true,
            kick: true,
            promote: true,
            manage_treasury: true,
            declare_war: true
          }
        });

      if (memberError) throw memberError;

      await loadGuildData();
      return { success: true };
    } catch (error) {
      console.error('Error creating guild:', error);
      return { success: false, error };
    }
  };

  const applyToGuild = async (guildId: string, message: string) => {
    try {
      const guild = availableGuilds.find(g => g.id === guildId);
      if (!guild) return { success: false, error: 'Guild not found' };

      if (guild.requirements.application_required) {
        // Submit application
        const { error } = await supabase
          .from('guild_applications')
          .insert({
            player_id: playerId,
            guild_id: guildId,
            message,
            status: 'pending'
          });

        if (error) throw error;
        return { success: true, message: 'Application submitted' };
      } else {
        // Join directly
        return await joinGuild(guildId);
      }
    } catch (error) {
      console.error('Error applying to guild:', error);
      return { success: false, error };
    }
  };

  const joinGuild = async (guildId: string) => {
    try {
      const { error } = await supabase
        .from('alliance_members')
        .insert({
          player_id: playerId,
          alliance_id: guildId,
          rank: 'recruit',
          contribution_points: 0,
          permissions: {
            invite: false,
            kick: false,
            promote: false,
            manage_treasury: false,
            declare_war: false
          }
        });

      if (error) throw error;

      // Update guild member count
      const guild = availableGuilds.find(g => g.id === guildId);
      if (guild) {
        await supabase
          .from('alliances')
          .update({ member_count: guild.member_count + 1 })
          .eq('id', guildId);
      }

      await loadGuildData();
      return { success: true };
    } catch (error) {
      console.error('Error joining guild:', error);
      return { success: false, error };
    }
  };

  const leaveGuild = async () => {
    try {
      if (!myGuild) return { success: false, error: 'Not in a guild' };

      const member = guildMembers.find(m => m.player_id === playerId);
      if (!member) return { success: false, error: 'Member not found' };

      if (member.rank === 'leader') {
        return { success: false, error: 'Leader cannot leave. Transfer leadership first.' };
      }

      // Remove member
      const { error } = await supabase
        .from('alliance_members')
        .delete()
        .eq('player_id', playerId)
        .eq('alliance_id', myGuild.id);

      if (error) throw error;

      // Update guild member count
      await supabase
        .from('alliances')
        .update({ member_count: myGuild.member_count - 1 })
        .eq('id', myGuild.id);

      await loadGuildData();
      return { success: true };
    } catch (error) {
      console.error('Error leaving guild:', error);
      return { success: false, error };
    }
  };

  const kickMember = async (memberId: string) => {
    try {
      const member = guildMembers.find(m => m.player_id === playerId);
      if (!member?.permissions.kick) {
        return { success: false, error: 'No permission to kick members' };
      }

      const targetMember = guildMembers.find(m => m.id === memberId);
      if (!targetMember) return { success: false, error: 'Member not found' };

      if (targetMember.rank === 'leader') {
        return { success: false, error: 'Cannot kick the leader' };
      }

      const { error } = await supabase
        .from('alliance_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      // Update guild member count
      if (myGuild) {
        await supabase
          .from('alliances')
          .update({ member_count: myGuild.member_count - 1 })
          .eq('id', myGuild.id);
      }

      await loadGuildData();
      return { success: true };
    } catch (error) {
      console.error('Error kicking member:', error);
      return { success: false, error };
    }
  };

  const promoteMember = async (memberId: string, newRank: GuildMember['rank']) => {
    try {
      const member = guildMembers.find(m => m.player_id === playerId);
      if (!member?.permissions.promote) {
        return { success: false, error: 'No permission to promote members' };
      }

      const { error } = await supabase
        .from('alliance_members')
        .update({ rank: newRank })
        .eq('id', memberId);

      if (error) throw error;

      await loadGuildData();
      return { success: true };
    } catch (error) {
      console.error('Error promoting member:', error);
      return { success: false, error };
    }
  };

  const contributeToTreasury = async (resources: { metal?: number; crystal?: number; deuterium?: number; dark_matter?: number }) => {
    try {
      if (!myGuild) return { success: false, error: 'Not in a guild' };

      // Check player resources
      const { data: playerResources, error: resourceError } = await supabase
        .from('player_resources')
        .select('*')
        .eq('player_id', playerId)
        .maybeSingle();

      if (resourceError) throw resourceError;

      const res = playerResources || { metal: 0, crystal: 0, deuterium: 0, dark_matter: 0 };
      if (
        (resources.metal && res.metal < resources.metal) ||
        (resources.crystal && res.crystal < resources.crystal) ||
        (resources.deuterium && res.deuterium < resources.deuterium) ||
        (resources.dark_matter && (res.dark_matter || 0) < resources.dark_matter)
      ) {
        return { success: false, error: 'Insufficient resources' };
      }

      // Deduct from player
      await supabase
        .from('player_resources')
        .update({
          metal: res.metal - (resources.metal || 0),
          crystal: res.crystal - (resources.crystal || 0),
          deuterium: res.deuterium - (resources.deuterium || 0),
          dark_matter: (res.dark_matter || 0) - (resources.dark_matter || 0)
        })
        .eq('player_id', playerId);

      // Add to guild treasury
      if (myGuild && myGuild.treasury) {
        await supabase
          .from('alliances')
          .update({
            treasury: {
              metal: (myGuild.treasury.metal || 0) + (resources.metal || 0),
              crystal: (myGuild.treasury.crystal || 0) + (resources.crystal || 0),
              deuterium: (myGuild.treasury.deuterium || 0) + (resources.deuterium || 0),
              dark_matter: (myGuild.treasury.dark_matter || 0) + (resources.dark_matter || 0)
            }
          })
          .eq('id', myGuild.id);
      }

      // Add contribution points
      const contributionPoints = 
        (resources.metal || 0) * 1 +
        (resources.crystal || 0) * 2 +
        (resources.deuterium || 0) * 3 +
        (resources.dark_matter || 0) * 10;

      const member = guildMembers.find(m => m.player_id === playerId);
      if (member) {
        await supabase
          .from('alliance_members')
          .update({ contribution_points: member.contribution_points + contributionPoints })
          .eq('id', member.id);
      }

      await loadGuildData();
      return { success: true };
    } catch (error) {
      console.error('Error contributing to treasury:', error);
      return { success: false, error };
    }
  };

  const respondToApplication = async (applicationId: string, accept: boolean) => {
    try {
      const application = applications.find(a => a.id === applicationId);
      if (!application) return { success: false, error: 'Application not found' };

      if (accept) {
        // Add player to guild
        await joinGuild(application.guild_id);
      }

      // Update application status
      await supabase
        .from('guild_applications')
        .update({ status: accept ? 'accepted' : 'rejected' })
        .eq('id', applicationId);

      await loadGuildData();
      return { success: true };
    } catch (error) {
      console.error('Error responding to application:', error);
      return { success: false, error };
    }
  };

  return {
    myGuild,
    guildMembers,
    availableGuilds,
    applications,
    guildEvents,
    loading,
    createGuild,
    applyToGuild,
    joinGuild,
    leaveGuild,
    kickMember,
    promoteMember,
    contributeToTreasury,
    respondToApplication,
    reload: loadGuildData
  };
};
