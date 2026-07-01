import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useAchievementSystem } from '@/hooks/useAchievementSystem';
import {
  ALC_POWER_TECH_TREE,
  isAlcTechUnlockable,
  ALC_TECH_IDS,
  type AlcTechDef,
} from '@/config/alcPowerTechTree';

export interface AlcResearchItem {
  id: number;
  player_id: string;
  tech_id: string;
  level: number;
  is_researching: boolean;
  research_finish: string | null;
}

export const useAlcPowerResearch = () => {
  const { user } = useAuth();
  const { trackEvent } = useAchievementSystem();
  const [research, setResearch] = useState<AlcResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridLevel, setGridLevel] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAlcResearch = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('research')
        .select('id, player_id, technology_name as tech_id, level, is_researching, research_finish')
        .eq('player_id', user.id)
        .in('technology_name', ALC_TECH_IDS);

      if (error) throw error;
      const mapped = (data || []).map(r => ({
        id: r.id,
        player_id: r.player_id,
        tech_id: r.tech_id,
        level: r.level,
        is_researching: r.is_researching,
        research_finish: r.research_finish,
      }));
      setResearch(mapped);
    } catch (err) {
      console.error('Error fetching ALC research:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const activeResearch = research.find(r => r.is_researching) ?? null;

  const getTechLevel = useCallback((techId: string): number => {
    const tech = research.find(r => r.tech_id === techId);
    if (!tech) return 0;
    return tech.is_researching ? tech.level - 1 : tech.level;
  }, [research]);

  const getTechDef = useCallback((techId: string): AlcTechDef | undefined => {
    return ALC_POWER_TECH_TREE[techId];
  }, []);

  const startAlcResearch = useCallback(async (
    techId: string,
    currentLevel: number,
    researchTime: number,
    _cost: { metal: number; crystal: number; deuterium: number }
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };
    if (activeResearch) return { success: false, error: 'Already researching another ALC technology' };

    try {
      const finish = new Date(Date.now() + researchTime * 1000).toISOString();
      const nextLevel = currentLevel + 1;

      const { error } = await supabase.from('research').upsert(
        {
          player_id: user.id,
          technology_name: techId,
          level: nextLevel,
          is_researching: true,
          research_finish: finish,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'player_id,technology_name', ignoreDuplicates: false }
      );

      if (error) throw error;
      await fetchAlcResearch();
      return { success: true };
    } catch (err: any) {
      console.error('Error starting ALC research:', err);
      return { success: false, error: err.message ?? 'Failed to start research' };
    }
  }, [user, activeResearch, fetchAlcResearch]);

  const cancelAlcResearch = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!user || !activeResearch) return { success: false, error: 'No active ALC research' };

    try {
      const { error } = await supabase
        .from('research')
        .update({
          is_researching: false,
          research_finish: null,
          level: Math.max(0, activeResearch.level - 1),
          updated_at: new Date().toISOString(),
        })
        .eq('id', activeResearch.id)
        .eq('player_id', user.id);

      if (error) throw error;
      await fetchAlcResearch();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, [user, activeResearch, fetchAlcResearch]);

  const completeAlcResearch = useCallback(async (item: AlcResearchItem) => {
    if (!user) return;
    try {
      await supabase
        .from('research')
        .update({
          is_researching: false,
          research_finish: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.id)
        .eq('player_id', user.id);

      await trackEvent('research_complete');
      await fetchAlcResearch();
    } catch (err) {
      console.error('Error completing ALC research:', err);
    }
  }, [user, fetchAlcResearch, trackEvent]);

  const getTimeRemaining = useCallback((): number => {
    if (!activeResearch?.research_finish) return 0;
    return Math.max(0, Math.floor((new Date(activeResearch.research_finish).getTime() - Date.now()) / 1000));
  }, [activeResearch]);

  const getProgress = useCallback((): number => {
    if (!activeResearch?.research_finish) return 0;
    const now = Date.now();
    const finish = new Date(activeResearch.research_finish).getTime();
    const remaining = finish - now;
    if (remaining <= 0) return 100;
    return Math.max(5, 100 - Math.min(95, (remaining / 3600000) * 100));
  }, [activeResearch]);

  const isTechUnlockable = useCallback((techId: string): { unlockable: boolean; reason?: string } => {
    const levels: Record<string, number> = {};
    ALC_TECH_IDS.forEach(id => { levels[id] = getTechLevel(id); });
    return isAlcTechUnlockable(techId, levels, gridLevel);
  }, [getTechLevel, gridLevel]);

  const checkCompletions = useCallback(async () => {
    if (!user) return;
    const now = new Date();
    const finished = research.filter(r => r.is_researching && r.research_finish && new Date(r.research_finish) <= now);
    for (const item of finished) {
      await completeAlcResearch(item);
    }
  }, [user, research, completeAlcResearch]);

  useEffect(() => {
    fetchAlcResearch();
  }, [fetchAlcResearch]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`alc-research-${user.id}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'research',
        filter: `player_id=eq.${user.id}`,
      }, () => fetchAlcResearch())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, fetchAlcResearch]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(checkCompletions, 3000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [checkCompletions]);

  return {
    research,
    activeResearch,
    loading,
    gridLevel,
    setGridLevel,
    getTechLevel,
    getTechDef,
    startAlcResearch,
    cancelAlcResearch,
    getTimeRemaining,
    getProgress,
    isTechUnlockable,
    refreshAlcResearch: fetchAlcResearch,
  };
};
