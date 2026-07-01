import { useState, useEffect, useCallback } from 'react';

/* ─── Rank Definitions ──────────────────────────────────────────────── */
export interface CraftingTitle {
  rank: number;
  title: string;
  subtitle: string;
  spRequired: number;           // cumulative SP across all trees
  color: string;
  glowColor: string;
  icon: string;
  badge: string;                // short badge label
  perks: string[];              // flavour perks shown on rank-up
  bonusDesc: string;            // short passive bonus description
  bonusPct: number;             // numeric bonus percentage
}

export const CRAFTING_TITLES: CraftingTitle[] = [
  {
    rank: 1,
    title: 'Apprentice Crafter',
    subtitle: 'First steps at the workbench',
    spRequired: 0,
    color: '#9ca3af',
    glowColor: '#9ca3af40',
    icon: 'ri-hammer-line',
    badge: 'APPRENTICE',
    perks: ['Access to Tier 1 skill nodes', 'Basic crafting recipes unlocked'],
    bonusDesc: 'No passive bonus yet',
    bonusPct: 0,
  },
  {
    rank: 2,
    title: 'Journeyman Craftsman',
    subtitle: 'Competent across multiple disciplines',
    spRequired: 15,
    color: '#4ade80',
    glowColor: '#4ade8040',
    icon: 'ri-tools-line',
    badge: 'JOURNEYMAN',
    perks: ['+5% crafting speed across all categories', 'Tier 2 nodes unlocked for invested trees'],
    bonusDesc: '+5% crafting speed',
    bonusPct: 5,
  },
  {
    rank: 3,
    title: 'Skilled Fabricator',
    subtitle: 'A reliable hand in any workshop',
    spRequired: 40,
    color: '#34d399',
    glowColor: '#34d39940',
    icon: 'ri-settings-3-line',
    badge: 'SKILLED',
    perks: ['+10% material efficiency', '+5% crafting speed', 'Dual-tree recipes accessible'],
    bonusDesc: '+10% material efficiency',
    bonusPct: 10,
  },
  {
    rank: 4,
    title: 'Expert Artisan',
    subtitle: 'Mastery of advanced techniques',
    spRequired: 75,
    color: '#60a5fa',
    glowColor: '#60a5fa40',
    icon: 'ri-star-line',
    badge: 'EXPERT',
    perks: ['+15% item quality chance', '+10% material efficiency', 'Exotic recipes available'],
    bonusDesc: '+15% item quality chance',
    bonusPct: 15,
  },
  {
    rank: 5,
    title: 'Master Craftsman',
    subtitle: 'Renowned across the empire',
    spRequired: 120,
    color: '#a78bfa',
    glowColor: '#a78bfa40',
    icon: 'ri-medal-line',
    badge: 'MASTER',
    perks: ['+20% rare material drop chance', '+15% quality', 'Cross-discipline synergy bonuses'],
    bonusDesc: '+20% rare material drop chance',
    bonusPct: 20,
  },
  {
    rank: 6,
    title: 'Grand Fabricator',
    subtitle: 'A legend in the making',
    spRequired: 175,
    color: '#f97316',
    glowColor: '#f9731640',
    icon: 'ri-award-line',
    badge: 'GRAND',
    perks: ['+25% legendary craft chance', '+20% rare drops', 'Grandmaster tier nodes accessible'],
    bonusDesc: '+25% legendary craft chance',
    bonusPct: 25,
  },
  {
    rank: 7,
    title: 'Arcane Smith',
    subtitle: 'Weaver of exotic and void materials',
    spRequired: 240,
    color: '#c084fc',
    glowColor: '#c084fc40',
    icon: 'ri-magic-line',
    badge: 'ARCANE',
    perks: ['+30% void material potency', '+25% legendary chance', 'Arcane forge unlocked'],
    bonusDesc: '+30% void material potency',
    bonusPct: 30,
  },
  {
    rank: 8,
    title: 'Celestial Artisan',
    subtitle: 'Touched by cosmic forces',
    spRequired: 315,
    color: '#38bdf8',
    glowColor: '#38bdf840',
    icon: 'ri-sparkling-line',
    badge: 'CELESTIAL',
    perks: ['+35% cosmic material yield', 'Celestial blueprint tier unlocked', '+30% all passive bonuses'],
    bonusDesc: '+35% cosmic material yield',
    bonusPct: 35,
  },
  {
    rank: 9,
    title: 'Void Artisan',
    subtitle: 'Commands the fabric of space-time',
    spRequired: 400,
    color: '#f472b6',
    glowColor: '#f472b640',
    icon: 'ri-focus-2-line',
    badge: 'VOID',
    perks: ['+40% void essence harvest', 'Dimensional forging unlocked', 'Temporal crafting nodes available'],
    bonusDesc: '+40% void essence harvest',
    bonusPct: 40,
  },
  {
    rank: 10,
    title: 'Grandmaster Artisan',
    subtitle: 'The pinnacle of all crafting knowledge',
    spRequired: 500,
    color: '#fbbf24',
    glowColor: '#fbbf2440',
    icon: 'ri-vip-crown-line',
    badge: 'GRANDMASTER',
    perks: [
      '+50% bonus to ALL passive crafting bonuses',
      'Omega Crafting Tier unlocked',
      'Unique "Grandmaster" title displayed universally',
      'Access to the exclusive Grandmaster Blueprint Vault',
    ],
    bonusDesc: '+50% to ALL crafting passives',
    bonusPct: 50,
  },
];

/* ─── SP Storage Key ────────────────────────────────────────────────── */
const STORAGE_KEY = 'crafting_global_sp';

export interface TreeSpentEntry {
  treeId: string;
  spent: number;
}

interface CraftingRankState {
  totalSpent: number;
  treeBreakdown: Record<string, number>;  // treeId → SP spent
  currentRank: CraftingTitle;
  nextRank: CraftingTitle | null;
  progressPct: number;           // progress to next rank 0-100
  spToNext: number;              // SP still needed for next rank
  recentUnlock: CraftingTitle | null;   // shown in toast-style notification
}

function computeRankState(totalSpent: number): Omit<CraftingRankState, 'treeBreakdown' | 'recentUnlock'> {
  let currentRank = CRAFTING_TITLES[0];
  for (let i = CRAFTING_TITLES.length - 1; i >= 0; i--) {
    if (totalSpent >= CRAFTING_TITLES[i].spRequired) {
      currentRank = CRAFTING_TITLES[i];
      break;
    }
  }
  const nextIdx = currentRank.rank < CRAFTING_TITLES.length ? currentRank.rank : null;
  const nextRank = nextIdx !== null ? CRAFTING_TITLES[nextIdx] : null;

  const spIntoThisRank = totalSpent - currentRank.spRequired;
  const spBetween = nextRank ? nextRank.spRequired - currentRank.spRequired : 1;
  const progressPct = nextRank ? Math.min(100, Math.round((spIntoThisRank / spBetween) * 100)) : 100;
  const spToNext = nextRank ? Math.max(0, nextRank.spRequired - totalSpent) : 0;

  return { totalSpent, currentRank, nextRank, progressPct, spToNext };
}

/* ─── Hook ──────────────────────────────────────────────────────────── */
export function useCraftingRank() {
  const loadFromStorage = (): { total: number; breakdown: Record<string, number> } => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (err) {
      console.error('Failed to load crafting rank from storage', err);
    }
    return { total: 0, breakdown: {} };
  };

  const [stored, setStored] = useState(loadFromStorage);
  const [recentUnlock, setRecentUnlock] = useState<CraftingTitle | null>(null);

  const save = useCallback((total: number, breakdown: Record<string, number>) => {
    const payload = { total, breakdown };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setStored(payload);
  }, []);

  // Called by SkillTreeLayout whenever a node is upgraded
  const recordSpend = useCallback(
    (treeId: string, spDelta: number) => {
      setStored((prev) => {
        const oldTotal = prev.total;
        const newBreakdown = { ...prev.breakdown, [treeId]: (prev.breakdown[treeId] || 0) + spDelta };
        const newTotal = oldTotal + spDelta;

        // Check rank-up
        const oldRank = computeRankState(oldTotal).currentRank;
        const newRank = computeRankState(newTotal).currentRank;
        if (newRank.rank > oldRank.rank) {
          setRecentUnlock(newRank);
          setTimeout(() => setRecentUnlock(null), 6000);
        }

        const payload = { total: newTotal, breakdown: newBreakdown };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        return payload;
      });
    },
    []
  );

  const resetAll = useCallback(() => {
    save(0, {});
    setRecentUnlock(null);
  }, [save]);

  // Listen for cross-tab updates
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setStored(loadFromStorage());
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const rankState = computeRankState(stored.total);

  return {
    ...rankState,
    treeBreakdown: stored.breakdown,
    recentUnlock,
    recordSpend,
    resetAll,
    allTitles: CRAFTING_TITLES,
  };
}