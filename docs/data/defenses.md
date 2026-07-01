# Defenses

**File:** `src/data/defenses.ts`

## Purpose
Defense systems database covering shields, armor, point defense, barriers, regeneration, stealth, and countermeasures.

## Key Exports
- `defenses: Defense[]` — Array of defense definitions with ids, names, types (shield, armor, point_defense, barrier, regeneration, stealth, countermeasure), class (light–ultimate), rank, tier, level, rarity, stats (protection, capacity, regeneration, coverage, resistances), abilities, special effects, requirements, and costs.
- `getDefensesByType`, `getDefensesByClass`, `getDefensesByRank`, `getDefensesByTier` — Filter helpers.
- `calculateDefenseEffectiveness`, `getDefensePowerRating` — Calculation utilities.
