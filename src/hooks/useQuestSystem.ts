import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Quest {
  id: string;
  quest_id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
  reward_credits?: number;
  reward_experience?: number;
  reward_items?: string;
  completed_at?: string;
}

export const useQuestSystem = () => {
  const { user } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch quests
  const fetchQuests = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .eq('player_id', user.id)
        .order('completed', { ascending: true });

      if (error) throw error;
      setQuests(data || []);
    } catch (error) {
      console.error('Error fetching quests:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Update quest progress
  const updateProgress = async (questId: string, progress: number) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const quest = quests.find((q) => q.quest_id === questId);

      if (!quest) {
        // Create new quest
        const { data, error } = await supabase
          .from('quests')
          .insert({
            player_id: user.id,
            quest_id: questId,
            progress: progress,
            completed: false,
            claimed: false,
          })
          .select()
          .single();

        if (error) throw error;
        await fetchQuests();
        return { success: true, data };
      }

      if (quest.completed) {
        return { success: false, error: 'Quest already completed' };
      }

      const newProgress = Math.min(progress, quest.target);
      const completed = newProgress >= quest.target;

      const { data, error } = await supabase
        .from('quests')
        .update({
          progress: newProgress,
          completed: completed,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq('id', quest.id)
        .select()
        .single();

      if (error) throw error;

      await fetchQuests();
      return { success: true, data, completed };
    } catch (error: any) {
      console.error('Error updating quest:', error);
      return { success: false, error: error.message };
    }
  };

  // Claim quest rewards
  const claimRewards = async (questId: string) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const quest = quests.find((q) => q.id === questId);

      if (!quest) {
        return { success: false, error: 'Quest not found' };
      }

      if (!quest.completed) {
        return { success: false, error: 'Quest not completed yet' };
      }

      if (quest.claimed) {
        return { success: false, error: 'Rewards already claimed' };
      }

      // Grant rewards
      const { data: player } = await supabase
        .from('players')
        .select('credits, level, experience')
        .eq('id', user.id)
        .maybeSingle();

      if (!player) return { success: false, error: 'Player not found' };

      const updates: any = {};

      if (quest.reward_credits) {
        updates.credits = player.credits + quest.reward_credits;
      }

      if (quest.reward_experience) {
        updates.experience = (player.experience || 0) + quest.reward_experience;
      }

      if (Object.keys(updates).length > 0) {
        await supabase
          .from('players')
          .update(updates)
          .eq('id', user.id);
      }

      // Mark as claimed
      await supabase
        .from('quests')
        .update({ claimed: true })
        .eq('id', questId);

      console.log(`✅ Quest completed: ${quest.title}`);
      console.log(`💰 Rewards: ${quest.reward_credits || 0} credits, ${quest.reward_experience || 0} XP`);

      await fetchQuests();
      return { success: true };
    } catch (error: any) {
      console.error('Error claiming rewards:', error);
      return { success: false, error: error.message };
    }
  };

  // Track quest progress by type
  const trackQuest = async (type: string, value: number) => {
    const questMap: Record<string, string> = {
      'build_ships': 'first_fleet',
      'complete_research': 'tech_pioneer',
      'win_battles': 'conqueror',
      'collect_resources': 'resource_master',
      'build_structures': 'empire_builder',
    };

    const questId = questMap[type];
    if (questId) {
      await updateProgress(questId, value);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  return {
    quests,
    loading,
    updateProgress,
    claimRewards,
    trackQuest,
    refreshQuests: fetchQuests,
  };
};