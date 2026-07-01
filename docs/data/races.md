# Races

**File:** `src/data/races.ts`

## Purpose
Playable and NPC race definitions (20 races) with attributes, bonuses, and lore.

## Key Exports
- `RACES: Race[]` — Array of races (Humans, Zoran, Vexari, Krynn, Xylith, Solari, Draken, Sylvari, Mechanus, et al.) with id, name, description, homeworld, type (humanoid, robotic, aquatic, insectoid, energy, crystalline, reptilian, avian), attributes, bonuses, racial traits, special abilities, reputation penalties, and lore.
- `getRaceByName`, `getRacesByType`, `getRaceBonuses` — Lookup helpers.
