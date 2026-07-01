import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ACHIEVEMENT_DEFINITIONS, ACHIEVEMENT_MAP } from '@/config/achievementDefinitions';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AchievementRow {
  id: number;
  user_id: string;
  achievement_id: string;
  achievement_name: string;
  category: string;
  progress: number;
  max_progress: number;
  is_completed: boolean;
  unlocked_at: string | null;
}

export interface UnlockToast {
  id: string;
  achievementName: string;
  achievementId: string;
  category: string;
  icon: string;
}

// ─── Event types mapped to achievement IDs ───────────────────────────────────
// Each event increments a cumulative counter in the DB, then checks thresholds.
const EVENT_ACHIEVEMENT_IDS: Record<string, string[]> = {
  building_complete:  ['first_building', 'building_upgrades_10', 'building_upgrades_50', 'building_upgrades_200'],
  research_complete:  ['first_research', 'research_5', 'research_20', 'research_50'],
  combat_victory:     ['first_blood', 'combat_wins_10', 'combat_wins_50', 'combat_wins_200'],
  fleet_sent:         ['first_fleet', 'fleet_missions_10', 'fleet_missions_50'],
  resources_plundered: ['plunder_100k', 'plunder_1m'],
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAchievementSystem = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<AchievementRow[]>([]);
  const [loading, setLoading]           = useState(true);
  const [toasts, setToasts]             = useState<UnlockToast[]>([]);
  // Ref used by external callers (building/research/fleet hooks) to avoid stale closures
  const userRef = useRef(user);
  useEffect(() => { userRef.current = user; }, [user]);

  // ── Fetch all achievement rows for this user ──────────────────────────────
  const fetchAchievements = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('is_completed', { ascending: true });
      if (error) throw error;
      setAchievements(data ?? []);
    } catch (err) {
      console.error('Error fetching achievements:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ── Combined init: fetch + seed in one go ──────────────────────────────
  useEffect(() => {
    if (!user) { setLoading(false); return; }

    let cancelled = false;

    async function initAchievements() {
      try {
        // Fetch existing rows
        const { data: existing, error: fetchErr } = await supabase
          .from('achievements')
          .select('*')
          .eq('user_id', user.id)
          .order('is_completed', { ascending: true });

        if (fetchErr) throw fetchErr;

        // Determine which definitions are missing
        const existingIds = new Set((existing ?? []).map(r => r.achievement_id));
        const missing = ACHIEVEMENT_DEFINITIONS
          .filter(def => !existingIds.has(def.id))
          .map(def => ({
            user_id: user.id,
            achievement_id: def.id,
            achievement_name: def.name,
            category: def.category,
            progress: 0,
            max_progress: def.tiers[def.tiers.length - 1],
            is_completed: false,
          }));

        // Insert missing rows if any
        if (missing.length > 0) {
          const { error: insertErr } = await supabase.from('achievements').insert(missing);
          if (insertErr) console.error('Error seeding achievements:', insertErr);
        }

        // Refetch to get everything (including newly seeded rows)
        if (!cancelled) {
          const { data: all } = await supabase
            .from('achievements')
            .select('*')
            .eq('user_id', user.id)
            .order('is_completed', { ascending: true });
          setAchievements(all ?? []);
        }
      } catch (err) {
        console.error('Achievement init error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    initAchievements();

    return () => { cancelled = true; };
  }, [user]);

  // ── Dismiss a toast ───────────────────────────────────────────────────────
  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── Core: upsert progress and check if threshold crossed ─────────────────
  const upsertAchievement = useCallback(async (
    uid: string,
    achievementId: string,
    newProgress: number,
  ): Promise<boolean> => {
    const def = ACHIEVEMENT_MAP[achievementId];
    if (!def) return false;

    const maxProgress = def.tiers[def.tiers.length - 1];

    // Fetch existing row
    const { data: existing } = await supabase
      .from('achievements')
      .select('id, progress, is_completed')
      .eq('user_id', uid)
      .eq('achievement_id', achievementId)
      .maybeSingle();

    // Already fully completed — skip
    if (existing?.is_completed) return false;

    const clampedProgress = Math.min(newProgress, maxProgress);
    const nowCompleted = clampedProgress >= maxProgress;
    const justUnlocked = nowCompleted && !existing?.is_completed;

    const row: Record<string, unknown> = {
      user_id: uid,
      achievement_id: achievementId,
      achievement_name: def.name,
      category: def.category,
      progress: clampedProgress,
      max_progress: maxProgress,
      is_completed: nowCompleted,
    };
    if (nowCompleted) {
      row.unlocked_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('achievements')
      .upsert(row, { onConflict: 'user_id,achievement_id', ignoreDuplicates: false });

    if (error) {
      console.error('Achievement upsert error:', error);
      return false;
    }

    return justUnlocked;
  }, []);

  // ── Public API: call this from building/research/fleet hooks ─────────────
  // eventType: 'building_complete' | 'research_complete' | 'combat_victory' | 'fleet_sent' | 'resources_plundered'
  // delta: how much to add to the counter (default 1)
  const trackEvent = useCallback(async (
    eventType: string,
    delta: number = 1,
  ) => {
    const uid = userRef.current?.id;
    if (!uid) return;

    const ids = EVENT_ACHIEVEMENT_IDS[eventType];
    if (!ids) return;

    // Fetch current totals for relevant counters from DB
    const { data: rows } = await supabase
      .from('achievements')
      .select('achievement_id, progress')
      .eq('user_id', uid)
      .in('achievement_id', ids);

    const progressMap: Record<string, number> = {};
    (rows ?? []).forEach(r => { progressMap[r.achievement_id] = r.progress; });

    const newlyUnlocked: UnlockToast[] = [];

    for (const achievementId of ids) {
      const currentProgress = progressMap[achievementId] ?? 0;
      const def = ACHIEVEMENT_MAP[achievementId];
      if (!def) continue;

      const maxProgress = def.tiers[def.tiers.length - 1];
      // Only increment if not already at max
      if (currentProgress >= maxProgress) continue;

      const newProgress = currentProgress + delta;
      const justUnlocked = await upsertAchievement(uid, achievementId, newProgress);

      if (justUnlocked) {
        newlyUnlocked.push({
          id: `${achievementId}-${Date.now()}`,
          achievementName: def.name,
          achievementId,
          category: def.category,
          icon: def.icon,
        });
      }
    }

    if (newlyUnlocked.length > 0) {
      setToasts(prev => [...prev, ...newlyUnlocked]);
      // Auto-dismiss after 6s
      newlyUnlocked.forEach(t => {
        setTimeout(() => dismissToast(t.id), 6000);
      });
      // Refresh achievement list
      await fetchAchievements();
    }
  }, [upsertAchievement, dismissToast, fetchAchievements]);

  return {
    achievements,
    loading,
    toasts,
    trackEvent,
    dismissToast,
    refreshAchievements: fetchAchievements,
  };
};