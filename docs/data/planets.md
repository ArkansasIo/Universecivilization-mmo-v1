# Planets

**File:** `src/data/planets.ts`

## Purpose
Planet database with 100+ planets across multiple galaxies, each with detailed attributes.

## Key Exports
- `PLANETS: Planet[]` — Array of planet definitions with id, name, galaxyId, galaxyName, coordinates, type (terrestrial, gas_giant, ice_world, desert_world, ocean_world, jungle_world, volcanic_world, barren, artificial, paradise), class (M–L), atmosphere, gravity, temperature, population, faction, resources, hazards, features, moons, and description.
- `getPlanetById`, `getPlanetsByGalaxy`, `getPlanetsByFaction`, `getPlanetsByType` — Filter helpers.
