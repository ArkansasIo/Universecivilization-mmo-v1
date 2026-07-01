import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useAchievementSystem } from '@/hooks/useAchievementSystem';

export interface ResearchItem {
  id: number;
  player_id: string;
  technology_name: string;
  level: number;
  is_researching: boolean;
  research_finish: string | null;
}

export const useResearchManager = () => {
  const { user } = useAuth();
  const { trackEvent } = useAchievementSystem();
  const [research, setResearch] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchResearch = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('research')
        .select('id, player_id, technology_name, level, is_researching, research_finish')
        .eq('player_id', user.id)
        .order('technology_name', { ascending: true });

      if (error) throw error;
      setResearch(data || []);
    } catch (err) {
      console.error('Error fetching research:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const activeResearch = research.find(r => r.is_researching) ?? null;

  // Start research — upserts the row with is_researching=true and research_finish timestamp
  const startResearch = async (
    technologyName: string,
    currentLevel: number,
    researchTime: number,
    _cost: { metal: number; crystal: number; deuterium?: number }
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };
    if (activeResearch) return { success: false, error: 'Already researching another technology' };

    try {
      const finish = new Date(Date.now() + researchTime * 1000).toISOString();
      const nextLevel = currentLevel + 1;

      const { error } = await supabase.from('research').upsert(
        {
          player_id: user.id,
          technology_name: technologyName,
          level: nextLevel,
          is_researching: true,
          research_finish: finish,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'player_id,technology_name', ignoreDuplicates: false }
      );

      if (error) throw error;
      await fetchResearch();
      return { success: true };
    } catch (err: any) {
      console.error('Error starting research:', err);
      return { success: false, error: err.message ?? 'Failed to start research' };
    }
  };

  // Cancel active research — clears is_researching without decrementing level
  const cancelResearch = async (): Promise<{ success: boolean; error?: string }> => {
    if (!user || !activeResearch) return { success: false, error: 'No active research' };

    try {
      const { error } = await supabase
        .from('research')
        .update({
          is_researching: false,
          research_finish: null,
          // Roll back level since it was pre-incremented at start
          level: Math.max(0, activeResearch.level - 1),
          updated_at: new Date().toISOString(),
        })
        .eq('id', activeResearch.id)
        .eq('player_id', user.id);

      if (error) throw error;
      await fetchResearch();
      return { success: true };
    } catch (err: any) {
      console.error('Error canceling research:', err);
      return { success: false, error: err.message };
    }
  };

  // Complete research — clears is_researching flag (level was already set at start)
  const completeResearch = useCallback(async (item: ResearchItem) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('research')
        .update({
          is_researching: false,
          research_finish: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.id)
        .eq('player_id', user.id);

      if (error) throw error;
      // Fire achievement tracking on research completion
      await trackEvent('research_complete');
      await fetchResearch();
    } catch (err) {
      console.error('Error completing research:', err);
    }
  }, [user, fetchResearch, trackEvent]);

  const getResearchLevel = (technologyName: string): number => {
    const tech = research.find(r => r.technology_name === technologyName);
    if (!tech) return 0;
    // If currently researching, the level in DB is already incremented — show previous level
    return tech.is_researching ? tech.level - 1 : tech.level;
  };

  const getTimeRemaining = (): number => {
    if (!activeResearch?.research_finish) return 0;
    return Math.max(0, Math.floor((new Date(activeResearch.research_finish).getTime() - Date.now()) / 1000));
  };

  const getProgress = (): number => {
    if (!activeResearch?.research_finish) return 0;
    // Estimate total time (we don't store start, so we use a 1h default if finish is far out)
    const now = Date.now();
    const finish = new Date(activeResearch.research_finish).getTime();
    const remaining = finish - now;
    if (remaining <= 0) return 100;
    // We don't have start time in DB, so show approximate based on remaining vs unknown total
    // Show a minimum 5% so the bar is visible
    return Math.max(5, 100 - Math.min(95, (remaining / 3600000) * 100));
  };

  // Check completions every 3 seconds
  const checkCompletions = useCallback(async () => {
    if (!user) return;
    const now = new Date();
    const finished = research.filter(r => r.is_researching && r.research_finish && new Date(r.research_finish) <= now);
    for (const item of finished) {
      await completeResearch(item);
    }
  }, [user, research, completeResearch]);

  useEffect(() => {
    fetchResearch();
  }, [fetchResearch]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`research-${user.id}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'research',
        filter: `player_id=eq.${user.id}`,
      }, () => fetchResearch())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, fetchResearch]);

  // Completion check timer
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(checkCompletions, 3000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [checkCompletions]);

  return {
    research,
    activeResearch,
    loading,
    startResearch,
    cancelResearch,
    getResearchLevel,
    getTimeRemaining,
    getProgress,
    refreshResearch: fetchResearch,
  };
};