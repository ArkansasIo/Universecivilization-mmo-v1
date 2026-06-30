# Achievements

**File:** `src/data/achievements.ts`

## Purpose
Defines all player achievements across categories: Combat, Fleet, Research, Economic, Exploration, Conquest, and Special.

## Key Exports
- `achievements: Achievement[]` — Array of achievement definitions with IDs, names, descriptions, lore, category, rank (E–SSS), rarity, tier, progress thresholds, rewards (credits, XP, items, officers, ships), and completion tracking.

## Data Shape
Each entry includes `requirements` (e.g. `combatVictories`, `totalShips`), `rewards`, `flavorText`, and `tips` for the player.
