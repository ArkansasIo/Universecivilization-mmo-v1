import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useAchievementSystem } from '@/hooks/useAchievementSystem';

export interface BuildingQueueItem {
  id: number;
  player_id: string;
  planet_id: number;
  building_type: string;
  level: number;
  is_upgrading: boolean;
  upgrade_finish: string | null;
  started_at?: string;
  build_time: number;
  target_level: number;
  status: 'building' | 'queued';
}

export interface AddToQueueParams {
  buildingType: string;
  targetLevel: number;
  cost: { metal: number; crystal: number; deuterium?: number };
  buildTime: number;
  planetId: number;
}

export const useBuildingQueue = (planetId?: number) => {
  const { user } = useAuth();
  const { trackEvent } = useAchievementSystem();
  const [queue, setQueue] = useState<BuildingQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Derive queue from buildings with is_upgrading = true
  const fetchQueue = useCallback(async () => {
    if (!user || !planetId) return;

    try {
      const { data, error } = await supabase
        .from('buildings')
        .select('id, player_id, planet_id, building_type, level, is_upgrading, upgrade_finish')
        .eq('player_id', user.id)
        .eq('planet_id', planetId)
        .eq('is_upgrading', true)
        .order('upgrade_finish', { ascending: true });

      if (error) throw error;

      const items: BuildingQueueItem[] = (data || []).map((row) => {
        const now = Date.now();
        const finish = row.upgrade_finish ? new Date(row.upgrade_finish).getTime() : now;
        const buildTime = Math.max(0, Math.floor((finish - now) / 1000));
        return {
          ...row,
          started_at: undefined,
          build_time: buildTime,
          target_level: row.level + 1,
          status: 'building' as const,
        };
      });

      setQueue(items);
    } catch (err) {
      console.error('Error fetching building queue:', err);
    } finally {
      setLoading(false);
    }
  }, [user, planetId]);

  // Start an upgrade: upsert the row setting is_upgrading=true and upgrade_finish
  const addToQueue = useCallback(
    async (
      buildingType: string,
      targetLevel: number,
      cost: { metal: number; crystal: number; deuterium?: number },
      buildTime: number
    ): Promise<{ success: boolean; message?: string }> => {
      if (!user || !planetId) return { success: false, message: 'No planet selected' };

      // Check if already upgrading anything on this planet (one at a time)
      const activeUpgrade = queue.find((q) => q.is_upgrading);
      if (activeUpgrade) {
        return { success: false, message: 'Another building is already upgrading' };
      }

      try {
        const finish = new Date(Date.now() + buildTime * 1000).toISOString();

        // Upsert: if row exists update it, else insert it
        const { error } = await supabase.from('buildings').upsert(
          {
            player_id: user.id,
            planet_id: planetId,
            building_type: buildingType,
            // level stays the same until upgrade finishes — we only bump it on completion
            is_upgrading: true,
            upgrade_finish: finish,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'planet_id,building_type',
            ignoreDuplicates: false,
          }
        );

        if (error) throw error;

        await fetchQueue();
        return { success: true };
      } catch (err: any) {
        console.error('Error adding building to queue:', err);
        return { success: false, message: err.message ?? 'Failed to start upgrade' };
      }
    },
    [user, planetId, queue, fetchQueue]
  );

  // Cancel an in-progress upgrade (resets is_upgrading without changing level)
  const cancelBuilding = useCallback(
    async (buildingId: number) => {
      if (!user) return { success: false, message: 'Not authenticated' };

      try {
        const { error } = await supabase
          .from('buildings')
          .update({ is_upgrading: false, upgrade_finish: null, updated_at: new Date().toISOString() })
          .eq('id', buildingId)
          .eq('player_id', user.id);

        if (error) throw error;

        await fetchQueue();
        return { success: true };
      } catch (err: any) {
        console.error('Error canceling building:', err);
        return { success: false, message: err.message };
      }
    },
    [user, fetchQueue]
  );

  // Poll every 2s: complete any finished upgrades by calling DB function
  const checkCompletions = useCallback(async () => {
    if (!user || !planetId || queue.length === 0) return;

    const now = new Date();
    const finished = queue.filter(
      (item) => item.upgrade_finish && new Date(item.upgrade_finish) <= now
    );

    for (const item of finished) {
      try {
        // Call the DB function that increments level and clears is_upgrading
        const { error } = await supabase.rpc('complete_building_upgrade', {
          p_player_id: user.id,
          p_planet_id: planetId,
          p_building_type: item.building_type,
        });
        if (error) throw error;
        // Fire achievement tracking on successful completion
        await trackEvent('building_complete');
      } catch (err) {
        console.error('Error completing upgrade:', err);
      }
    }

    if (finished.length > 0) {
      await fetchQueue();
    }
  }, [user, planetId, queue, fetchQueue, trackEvent]);

  // Initial fetch
  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  // Real-time subscription on buildings for this player+planet
  useEffect(() => {
    if (!user || !planetId) return;

    const channel = supabase
      .channel(`buildings-queue-${planetId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'buildings',
          filter: `player_id=eq.${user.id}`,
        },
        () => {
          fetchQueue();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, planetId, fetchQueue]);

  // Timer to check completions every 2 seconds
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(checkCompletions, 2000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [checkCompletions]);

  return {
    queue,
    loading,
    addToQueue,
    cancelBuilding,
    refreshQueue: fetchQueue,
  };
};