import { useCraftingRank, CRAFTING_TITLES } from '@/hooks/useCraftingRank';

/* ─── Recipe Unlock Definitions ──────────────────────────────────────
 *  Each entry maps: minRank (1–10) → array of recipe IDs unlocked
 *  Recipe IDs must match the `id` fields in the page data arrays.
 *  Pages: crafting-forge (RECIPES), crafting-augmentations (AUGMENTATIONS),
 *         crafting-artifacts (ARTIFACTS)
 * ─────────────────────────────────────────────────────────────────── */

export interface RecipeUnlockEntry {
  recipeId: string;
  recipeName: string;
  page: 'forge' | 'laboratory' | 'artifacts';
  pageLabel: string;
  rarity: string;
  tier: number;
  minRank: number;        // Crafting Rank required
  icon: string;
  description: string;
  category: string;
}

export const RECIPE_UNLOCK_TABLE: RecipeUnlockEntry[] = [
  /* ── FORGE — Rank-gated recipes ─────────────────────────────────── */
  // Rank 1 — all base recipes are always available (ew1, pw1, ha1, pr1)
  // Rank 2
  {
    recipeId: 'ew2',
    recipeName: 'Plasma Cannon Mk II',
    page: 'forge',
    pageLabel: 'Crafting Forge',
    rarity: 'Uncommon',
    tier: 2,
    minRank: 2,
    icon: 'ri-fire-line',
    description: 'High-heat plasma discharge cannon — unlocked at Journeyman rank.',
    category: 'Energy Weapons',
  },
  {
    recipeId: 'ss1',
    recipeName: 'Deflector Shield Mk III',
    page: 'forge',
    pageLabel: 'Crafting Forge',
    rarity: 'Uncommon',
    tier: 2,
    minRank: 2,
    icon: 'ri-shield-cross-line',
    description: 'Advanced deflector shield generator.',
    category: 'Shield Systems',
  },
  {
    recipeId: 'pr1',
    recipeName: 'Impulse Drive Mk IV',
    page: 'forge',
    pageLabel: 'Crafting Forge',
    rarity: 'Uncommon',
    tier: 2,
    minRank: 2,
    icon: 'ri-rocket-line',
    description: 'High-efficiency sublight drive.',
    category: 'Propulsion',
  },
  // Rank 3
  {
    recipeId: 'ew3',
    recipeName: 'Ion Disruptor Cannon',
    page: 'forge',
    pageLabel: 'Crafting Forge',
    rarity: 'Rare',
    tier: 3,
    minRank: 3,
    icon: 'ri-thunderstorms-line',
    description: 'Ionized beam that bypasses shields entirely.',
    category: 'Energy Weapons',
  },
  {
    recipeId: 'ha2',
    recipeName: 'Reactive Nanoplate',
    page: 'forge',
    pageLabel: 'Crafting Forge',
    rarity: 'Rare',
    tier: 3,
    minRank: 3,
    icon: 'ri-shield-fill',
    description: 'Nano-reactive plates that absorb and redistribute impact.',
    category: 'Hull Armor',
  },
  // Rank 4
  {
    recipeId: 'pw2',
    recipeName: 'Quantum Torpedo Battery',
    page: 'forge',
    pageLabel: 'Crafting Forge',
    rarity: 'Epic',
    tier: 4,
    minRank: 4,
    icon: 'ri-send-plane-fill',
    description: 'Quantum-tipped torpedo launcher array.',
    category: 'Projectile Weapons',
  },
  {
    recipeId: 'ss2',
    recipeName: 'Quantum Barrier Matrix',
    page: 'forge',
    pageLabel: 'Crafting Forge',
    rarity: 'Epic',
    tier: 4,
    minRank: 4,
    icon: 'ri-shield-star-line',
    description: 'Quantum-entangled defensive barrier.',
    category: 'Shield Systems',
  },
  {
    recipeId: 'ps1',
    recipeName: 'Antimatter Reactor Core',
    page: 'forge',
    pageLabel: 'Crafting Forge',
    rarity: 'Epic',
    tier: 4,
    minRank: 4,
    icon: 'ri-battery-fill',
    description: 'Ultra-dense antimatter energy reactor.',
    category: 'Power Systems',
  },
  {
    recipeId: 'sc2',
    recipeName: 'Tactical AI Core',
    page: 'forge',
    pageLabel: 'Crafting Forge',
    rarity: 'Epic',
    tier: 4,
    minRank: 4,
    icon: 'ri-cpu-fill',
    description: 'Advanced AI tactical decision system.',
    category: 'Computing',
  },
  // Rank 6
  {
    recipeId: 'ew4',
    recipeName: 'Singularity Lance',
    page: 'forge',
    pageLabel: 'Crafting Forge',
    rarity: 'Legendary',
    tier: 5,
    minRank: 6,
    icon: 'ri-contrast-drop-fill',
    description: 'Fires concentrated micro-singularities.',
    category: 'Exotic Weapons',
  },
  {
    recipeId: 'pr2',
    recipeName: 'Dark Matter Hyperdrive',
    page: 'forge',
    pageLabel: 'Crafting Forge',
    rarity: 'Legendary',
    tier: 5,
    minRank: 6,
    icon: 'ri-space-ship-line',
    description: 'Warps local spacetime using dark matter.',
    category: 'Propulsion',
  },
  {
    recipeId: 'sc1',
    recipeName: 'Phase Cloak Generator',
    page: 'forge',
    pageLabel: 'Crafting Forge',
    rarity: 'Legendary',
    tier: 5,
    minRank: 8,
    icon: 'ri-eye-off-line',
    description: 'Shifts ship partially out of phase with reality.',
    category: 'Stealth',
  },

  /* ── LABORATORY — Augmentations ──────────────────────────────────── */
  // Rank 2
  {
    recipeId: 'aug3',
    recipeName: 'Combat Reflex Enhancer',
    page: 'laboratory',
    pageLabel: 'Augmentations Lab',
    rarity: 'Rare',
    tier: 3,
    minRank: 2,
    icon: 'ri-flashlight-line',
    description: 'Muscle-memory accelerator for faster weapons operation.',
    category: 'Combat',
  },
  {
    recipeId: 'aug7',
    recipeName: 'Resource Optimizer Chip',
    page: 'laboratory',
    pageLabel: 'Augmentations Lab',
    rarity: 'Uncommon',
    tier: 2,
    minRank: 2,
    icon: 'ri-money-cny-circle-line',
    description: 'Optimizes resource consumption across all ship systems.',
    category: 'Utility',
  },
  // Rank 3
  {
    recipeId: 'aug1',
    recipeName: 'Command Synapse Array',
    page: 'laboratory',
    pageLabel: 'Augmentations Lab',
    rarity: 'Uncommon',
    tier: 2,
    minRank: 3,
    icon: 'ri-brain-line',
    description: 'Neural implant that expands fleet command capacity.',
    category: 'Neural',
  },
  {
    recipeId: 'aug5',
    recipeName: 'Personal Shield Matrix',
    page: 'laboratory',
    pageLabel: 'Augmentations Lab',
    rarity: 'Rare',
    tier: 3,
    minRank: 3,
    icon: 'ri-shield-line',
    description: 'Projects a personal energy shield around the vessel.',
    category: 'Defense',
  },
  // Rank 4
  {
    recipeId: 'aug4',
    recipeName: 'Weapons Damage Amplifier',
    page: 'laboratory',
    pageLabel: 'Augmentations Lab',
    rarity: 'Epic',
    tier: 4,
    minRank: 4,
    icon: 'ri-sword-line',
    description: 'Amplifies all weapon systems by feeding raw energy into power conduits.',
    category: 'Combat',
  },
  {
    recipeId: 'aug6',
    recipeName: 'Nanite Regeneration Network',
    page: 'laboratory',
    pageLabel: 'Augmentations Lab',
    rarity: 'Epic',
    tier: 4,
    minRank: 4,
    icon: 'ri-heart-pulse-line',
    description: 'Self-replicating nanites continuously repair hull damage.',
    category: 'Defense',
  },
  {
    recipeId: 'aug8',
    recipeName: 'Dimensional Cargo Expander',
    page: 'laboratory',
    pageLabel: 'Augmentations Lab',
    rarity: 'Epic',
    tier: 4,
    minRank: 4,
    icon: 'ri-inbox-2-line',
    description: 'Folds extra-dimensional space into cargo holds.',
    category: 'Utility',
  },
  // Rank 5
  {
    recipeId: 'aug2',
    recipeName: 'Tactical Prediction Engine',
    page: 'laboratory',
    pageLabel: 'Augmentations Lab',
    rarity: 'Epic',
    tier: 4,
    minRank: 5,
    icon: 'ri-focus-3-line',
    description: 'Predicts enemy movements up to 2 seconds in the future.',
    category: 'Neural',
  },
  // Rank 7
  {
    recipeId: 'aug9',
    recipeName: 'Zero-Point Tap',
    page: 'laboratory',
    pageLabel: 'Augmentations Lab',
    rarity: 'Legendary',
    tier: 5,
    minRank: 7,
    icon: 'ri-battery-fill',
    description: 'Taps into quantum vacuum energy for near-infinite power.',
    category: 'Power',
  },
  // Rank 9
  {
    recipeId: 'aug10',
    recipeName: 'Cosmic Attunement Matrix',
    page: 'laboratory',
    pageLabel: 'Augmentations Lab',
    rarity: 'Mythic',
    tier: 5,
    minRank: 9,
    icon: 'ri-star-fill',
    description: 'Harmonizes the vessel with cosmic background energies. All stats doubled.',
    category: 'Power',
  },

  /* ── ARTIFACTS ───────────────────────────────────────────────────── */
  // Rank 3
  {
    recipeId: 'art2',
    recipeName: 'Precursor Key Fragment',
    page: 'artifacts',
    pageLabel: 'Artifact Workshop',
    rarity: 'Epic',
    tier: 4,
    minRank: 3,
    icon: 'ri-lock-unlock-line',
    description: 'A fragment of a larger precursor key that unlocks sealed vaults.',
    category: 'Relics',
  },
  // Rank 4
  {
    recipeId: 'art3',
    recipeName: 'Temporal Time Crystal',
    page: 'artifacts',
    pageLabel: 'Artifact Workshop',
    rarity: 'Legendary',
    tier: 5,
    minRank: 4,
    icon: 'ri-time-fill',
    description: 'Allows limited temporal manipulation.',
    category: 'Temporal',
  },
  {
    recipeId: 'art6',
    recipeName: 'Reality Shard',
    page: 'artifacts',
    pageLabel: 'Artifact Workshop',
    rarity: 'Legendary',
    tier: 5,
    minRank: 4,
    icon: 'ri-shuffle-line',
    description: 'Bends probability in your favor.',
    category: 'Cosmic',
  },
  // Rank 5
  {
    recipeId: 'art4',
    recipeName: 'Void Stone',
    page: 'artifacts',
    pageLabel: 'Artifact Workshop',
    rarity: 'Legendary',
    tier: 5,
    minRank: 5,
    icon: 'ri-drop-line',
    description: 'A stone from the void between dimensions. Absorbs incoming damage.',
    category: 'Void',
  },
  {
    recipeId: 'art5',
    recipeName: 'Heart of a Dying Star',
    page: 'artifacts',
    pageLabel: 'Artifact Workshop',
    rarity: 'Legendary',
    tier: 5,
    minRank: 5,
    icon: 'ri-sun-fill',
    description: 'Contains inexhaustible stellar energy.',
    category: 'Cosmic',
  },
  // Rank 6
  {
    recipeId: 'art7',
    recipeName: 'Omega Key',
    page: 'artifacts',
    pageLabel: 'Artifact Workshop',
    rarity: 'Legendary',
    tier: 5,
    minRank: 6,
    icon: 'ri-door-open-line',
    description: 'Unlocks any door, vault, sealed area, or dimension.',
    category: 'Dimensional',
  },
  // Rank 8
  {
    recipeId: 'art8',
    recipeName: 'Genesis Seed',
    page: 'artifacts',
    pageLabel: 'Artifact Workshop',
    rarity: 'Mythic',
    tier: 5,
    minRank: 8,
    icon: 'ri-seedling-line',
    description: 'Contains the blueprint for creating new life and terraforming worlds.',
    category: 'Mythic',
  },
  // Rank 10
  {
    recipeId: 'art9',
    recipeName: 'Infinity Gauntlet',
    page: 'artifacts',
    pageLabel: 'Artifact Workshop',
    rarity: 'Universal',
    tier: 5,
    minRank: 10,
    icon: 'ri-star-fill',
    description: 'The ultimate power artifact. Doubles all stats. One of a kind.',
    category: 'Mythic',
  },
];

/* ─── Hook ────────────────────────────────────────────────────────── */
export interface RecipeUnlockStatus extends RecipeUnlockEntry {
  unlocked: boolean;
  unlockedByTitle: string;
  unlockedByColor: string;
}

export function useRecipeUnlocks() {
  const { currentRank } = useCraftingRank();

  const getStatus = (recipeId: string): RecipeUnlockStatus | undefined => {
    const entry = RECIPE_UNLOCK_TABLE.find(r => r.recipeId === recipeId);
    if (!entry) return undefined;
    const rankDef = CRAFTING_TITLES[entry.minRank - 1];
    return {
      ...entry,
      unlocked: currentRank.rank >= entry.minRank,
      unlockedByTitle: rankDef.title,
      unlockedByColor: rankDef.color,
    };
  };

  const isUnlocked = (recipeId: string): boolean => {
    const entry = RECIPE_UNLOCK_TABLE.find(r => r.recipeId === recipeId);
    if (!entry) return true; // not rank-gated → always available
    return currentRank.rank >= entry.minRank;
  };

  /** All entries with their current unlock status */
  const allWithStatus: RecipeUnlockStatus[] = RECIPE_UNLOCK_TABLE.map(entry => {
    const rankDef = CRAFTING_TITLES[entry.minRank - 1];
    return {
      ...entry,
      unlocked: currentRank.rank >= entry.minRank,
      unlockedByTitle: rankDef.title,
      unlockedByColor: rankDef.color,
    };
  });

  /** Recipes unlocked at exactly the current rank (new unlocks) */
  const newAtCurrentRank = allWithStatus.filter(r => r.minRank === currentRank.rank);

  /** Next rank's upcoming unlocks */
  const upcomingAtNextRank = allWithStatus.filter(r => r.minRank === currentRank.rank + 1);

  /** All locked recipes */
  const locked = allWithStatus.filter(r => !r.unlocked);

  /** All unlocked recipes */
  const unlocked = allWithStatus.filter(r => r.unlocked);

  return {
    isUnlocked,
    getStatus,
    allWithStatus,
    newAtCurrentRank,
    upcomingAtNextRank,
    locked,
    unlocked,
    currentRank,
  };
}