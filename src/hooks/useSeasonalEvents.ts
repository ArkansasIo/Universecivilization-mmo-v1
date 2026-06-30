import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  event_type: 'holiday' | 'competition' | 'invasion' | 'discovery' | 'cosmic_phenomenon';
  start_time: string;
  end_time: string;
  status: 'upcoming' | 'active' | 'ended';
  rewards: {
    type: string;
    amount: number;
  }[];
  requirements: {
    min_level?: number;
    min_power?: number;
    alliance_required?: boolean;
  };
  leaderboard?: {
    player_id: string;
    player_name: string;
    score: number;
    rank: number;
  }[];
  special_bonuses: {
    resource_multiplier?: number;
    experience_multiplier?: number;
    combat_bonus?: number;
  };
}

interface PlayerEventProgress {
  event_id: string;
  player_id: string;
  score: number;
  tasks_completed: number;
  rewards_claimed: string[];
  participation_time: string;
}

export const useSeasonalEvents = (playerId: string) => {
  const [events, setEvents] = useState<SeasonalEvent[]>([]);
  const [activeEvent, setActiveEvent] = useState<SeasonalEvent | null>(null);
  const [playerProgress, setPlayerProgress] = useState<PlayerEventProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (playerId) {
      loadEvents();
      loadPlayerProgress();
    }
  }, [playerId, loadEvents, loadPlayerProgress]);

  const loadEvents = useCallback(async () => {
    try {
      // Generate seasonal events
      const now = new Date();
      const generatedEvents: SeasonalEvent[] = [
        {
          id: 'winter_invasion',
          name: 'Winter Invasion',
          description: 'Defend against the frozen armada from the ice nebula!',
          event_type: 'invasion',
          start_time: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          rewards: [
            { type: 'dark_matter', amount: 1000 },
            { type: 'exclusive_ship', amount: 1 },
            { type: 'title', amount: 1 },
          ],
          requirements: {
            min_level: 10,
            min_power: 50000,
          },
          special_bonuses: {
            resource_multiplier: 1.5,
            experience_multiplier: 2.0,
            combat_bonus: 20,
          },
        },
        {
          id: 'cosmic_discovery',
          name: 'Cosmic Discovery Week',
          description: 'Explore uncharted systems and discover ancient artifacts!',
          event_type: 'discovery',
          start_time: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'upcoming',
          rewards: [
            { type: 'artifacts', amount: 5 },
            { type: 'dark_matter', amount: 500 },
            { type: 'research_points', amount: 10000 },
          ],
          requirements: {
            min_level: 5,
          },
          special_bonuses: {
            resource_multiplier: 2.0,
            experience_multiplier: 1.5,
          },
        },
        {
          id: 'alliance_tournament',
          name: 'Alliance Championship',
          description: 'Compete with your alliance for ultimate glory!',
          event_type: 'competition',
          start_time: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'upcoming',
          rewards: [
            { type: 'dark_matter', amount: 5000 },
            { type: 'legendary_officer', amount: 1 },
            { type: 'alliance_banner', amount: 1 },
          ],
          requirements: {
            min_level: 20,
            min_power: 100000,
            alliance_required: true,
          },
          special_bonuses: {
            combat_bonus: 50,
            experience_multiplier: 3.0,
          },
        },
        {
          id: 'black_hole_phenomenon',
          name: 'Black Hole Anomaly',
          description: 'A massive black hole has appeared, bringing danger and opportunity!',
          event_type: 'cosmic_phenomenon',
          start_time: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          rewards: [
            { type: 'exotic_matter', amount: 10000 },
            { type: 'dark_matter', amount: 2000 },
            { type: 'unique_technology', amount: 1 },
          ],
          requirements: {
            min_level: 30,
            min_power: 500000,
          },
          special_bonuses: {
            resource_multiplier: 3.0,
            combat_bonus: 100,
          },
        },
      ];

      setEvents(generatedEvents);
      
      // Set active event
      const active = generatedEvents.find(e => e.status === 'active');
      setActiveEvent(active || null);

      setLoading(false);
    } catch (error) {
      console.error('Error loading events:', error);
      setLoading(false);
    }
  }, [playerId]);

  const loadPlayerProgress = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('events_participation')
        .select('*')
        .eq('player_id', playerId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setPlayerProgress({
          event_id: data.event_id,
          player_id: data.player_id,
          score: data.score || 0,
          tasks_completed: data.tasks_completed || 0,
          rewards_claimed: data.rewards_claimed || [],
          participation_time: data.created_at,
        });
      }
    } catch (error) {
      console.error('Error loading player progress:', error);
    }
  }, [playerId]);

  const joinEvent = async (eventId: string) => {
    try {
      const event = events.find(e => e.id === eventId);
      if (!event) return { success: false, error: 'Event not found' };

      // Check requirements
      const { data: profile } = await supabase
        .from('profiles')
        .select('level, total_power, alliance_id')
        .eq('id', playerId)
        .maybeSingle();

      if (!profile) return { success: false, error: 'Profile not found' };

      if (event.requirements.min_level && (profile.level || 0) < event.requirements.min_level) {
        return { success: false, error: `Minimum level ${event.requirements.min_level} required` };
      }

      if (event.requirements.min_power && (profile.total_power || 0) < event.requirements.min_power) {
        return { success: false, error: `Minimum power ${event.requirements.min_power} required` };
      }

      if (event.requirements.alliance_required && !profile.alliance_id) {
        return { success: false, error: 'Alliance membership required' };
      }

      // Create participation record
      const { error } = await supabase
        .from('events_participation')
        .insert({
          event_id: eventId,
          player_id: playerId,
          score: 0,
          tasks_completed: 0,
          rewards_claimed: [],
        });

      if (error) throw error;

      await loadPlayerProgress();
      return { success: true };
    } catch (error) {
      console.error('Error joining event:', error);
      return { success: false, error };
    }
  };

  const completeEventTask = async (eventId: string, taskType: string, points: number) => {
    try {
      const { data: participation } = await supabase
        .from('events_participation')
        .select('*')
        .eq('event_id', eventId)
        .eq('player_id', playerId)
        .maybeSingle();

      if (!participation) {
        return { success: false, error: 'Not participating in this event' };
      }

      const newScore = (participation.score || 0) + points;
      const newTasksCompleted = (participation.tasks_completed || 0) + 1;

      const { error } = await supabase
        .from('events_participation')
        .update({
          score: newScore,
          tasks_completed: newTasksCompleted,
        })
        .eq('event_id', eventId)
        .eq('player_id', playerId);

      if (error) throw error;

      await loadPlayerProgress();
      return { success: true, newScore, newTasksCompleted };
    } catch (error) {
      console.error('Error completing event task:', error);
      return { success: false, error };
    }
  };

  const claimEventReward = async (eventId: string, rewardType: string) => {
    try {
      const { data: participation } = await supabase
        .from('events_participation')
        .select('*')
        .eq('event_id', eventId)
        .eq('player_id', playerId)
        .maybeSingle();

      if (!participation) {
        return { success: false, error: 'Not participating in this event' };
      }

      const rewardsClaimed = participation.rewards_claimed || [];
      if (rewardsClaimed.includes(rewardType)) {
        return { success: false, error: 'Reward already claimed' };
      }

      const event = events.find(e => e.id === eventId);
      if (!event) return { success: false, error: 'Event not found' };

      const reward = event.rewards.find(r => r.type === rewardType);
      if (!reward) return { success: false, error: 'Reward not found' };

      // Award reward based on type
      const { data: resources } = await supabase
        .from('player_resources')
        .select('*')
        .eq('player_id', playerId)
        .maybeSingle();

      if (resources) {
        const updates: any = {};
        
        if (rewardType === 'dark_matter') {
          updates.dark_matter = (resources.dark_matter || 0) + reward.amount;
        } else if (rewardType === 'metal') {
          updates.metal = (resources.metal || 0) + reward.amount;
        } else if (rewardType === 'crystal') {
          updates.crystal = (resources.crystal || 0) + reward.amount;
        } else if (rewardType === 'deuterium') {
          updates.deuterium = (resources.deuterium || 0) + reward.amount;
        }

        if (Object.keys(updates).length > 0) {
          await supabase
            .from('player_resources')
            .update(updates)
            .eq('player_id', playerId);
        }
      }

      // Update claimed rewards
      rewardsClaimed.push(rewardType);
      await supabase
        .from('events_participation')
        .update({ rewards_claimed: rewardsClaimed })
        .eq('event_id', eventId)
        .eq('player_id', playerId);

      await loadPlayerProgress();
      return { success: true, reward };
    } catch (error) {
      console.error('Error claiming event reward:', error);
      return { success: false, error };
    }
  };

  const getEventLeaderboard = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('events_participation')
        .select(`
          player_id,
          score,
          profiles!inner(username)
        `)
        .eq('event_id', eventId)
        .order('score', { ascending: false })
        .limit(100);

      if (error) throw error;

      const leaderboard = (data || []).map((entry: any, index: number) => ({
        player_id: entry.player_id,
        player_name: entry.profiles?.username || 'Unknown',
        score: entry.score || 0,
        rank: index + 1,
      }));

      return { success: true, leaderboard };
    } catch (error) {
      console.error('Error getting event leaderboard:', error);
      return { success: false, error };
    }
  };

  return {
    events,
    activeEvent,
    playerProgress,
    loading,
    joinEvent,
    completeEventTask,
    claimEventReward,
    getEventLeaderboard,
    refreshEvents: loadEvents,
    refreshProgress: loadPlayerProgress,
  };
};
