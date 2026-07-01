# Factions

**File:** `src/data/factions.ts`

## Purpose
Faction definitions for the 15 playable and NPC factions in the galaxy.

## Key Exports
- `FACTIONS: Faction[]` — Array of factions with id, name, type (major/minor/independent/hostile), description, lore, homeworld, territory, government, ideology, reputation, traits, relations, economyStats, militaryStats, technology, and bonuses.
- `FACTION_RELATIONS: RelationMatrix` — Faction-to-faction standing matrix.
- `getFactionById`, `getFactionsByType`, `getFactionsByAlignment`, `getFactionRelations`, `getPlayerFactionReputation`, `getTopFactions` — Lookup helpers.
