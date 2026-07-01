# Planet Resources

**File:** `src/data/planetResources.ts`

## Purpose
Planet-specific resource data — resources available per planet with yield, rarity, and extraction difficulty.

## Key Exports
- `PLANET_RESOURCES: PlanetResource[]` — Resource deposits on planets with resourceId, planetId, abundance (low–infinite), yield, purity, extraction difficulty, and depletion rate.
- `getResourcesForPlanet`, `getPlanetsWithResource`, `getResourceYield` — Query utilities.
