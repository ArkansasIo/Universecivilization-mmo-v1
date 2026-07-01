# Player Stats

**File:** `src/data/playerStats.ts`

## Purpose
Player statistics definitions — core attributes, derived stats, and progression formulas.

## Key Exports
- `BASE_STATS` — Core attributes (strength, perception, endurance, charisma, intelligence, agility, luck).
- `DERIVED_STATS` — Computed stats (health, shields, armor, speed, cargo, etc.).
- `StatModifier` interface — Modifier structure for buffs/equipment.
- `calculateDerivedStats`, `getStatBonus`, `applyModifiers` — Calculation functions.
- `STAT_XP_TABLE` — XP required per level (1–100).
