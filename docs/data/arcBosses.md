# Arc Bosses

**File:** `src/data/arcBosses.ts`

## Purpose
Defines story-arc bosses across 6 narrative arcs (The Awakening, Crimson War, Digital Plague, Void Call, Celestial Schism, Forge of Gods).

## Key Exports
- `arcBosses: ArcBossData[]` — 18 boss definitions with IDs, names, titles, lore, combat stats (health, shield, armor, damage), status, location, rewards, abilities, weaknesses.
- `arcBossLeaderboard` — Top 10 player damage leaderboard for arc bosses.

## Data Shape
Each boss has `tier`, `level`, `health`, `shield`, `armor`, `damage`, `status` (`locked` | `active` | `defeated` | `upcoming`), `rewards`, `abilities`, `weaknesses`, and `arcProgress`.
