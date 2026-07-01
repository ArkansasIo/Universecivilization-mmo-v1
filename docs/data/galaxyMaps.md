# Galaxy Maps

**File:** `src/data/galaxyMaps.ts`

## Purpose
Galaxy map data — 90 named galaxies with descriptions, coordinates, and metadata.

## Key Exports
- `GALAXY_MAP_DATA: GalaxyMapEntry[]` — 90 galaxies (Andromeda Prime through Nexus of Realms) each with id, name, description, coordinate (x, y, z), class (Spiral, Elliptical, Irregular, Lenticular, Ring, Dwarf), size, region, notableFeatures, and resources.
- `getGalaxyAtCoordinates`, `searchGalaxies`, `getGalaxiesByClass`, `getGalaxiesInRegion` — Search/filter utilities.
