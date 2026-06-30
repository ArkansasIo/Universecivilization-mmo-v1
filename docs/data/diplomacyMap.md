# Diplomacy Map

**File:** `src/data/diplomacyMap.ts`

## Purpose
Galactic diplomacy map data including alliances, territories, active wars, and diplomatic events.

## Key Exports
- `ALLIANCES: Alliance[]` — 6 alliance definitions (Galactic Federation, Dark Legion, Solar Collective, Nova Collective, Void Hunters, Stellar Empire) with members, power, territories, diplomacy relations.
- `DIPLOMACY_ZONES: DiplomacyZone[]` — 9×99 galaxy/system grid of zones with alliance control and type (territory, contested, warzone, neutral, nap_border, ally_border).
- `ACTIVE_WARS: ActiveWar[]` — 2 active wars with intensity, battles, casualties, front lines.
- `DIPLOMACY_EVENTS: DiplomacyEvent[]` — Recent diplomacy event feed.
