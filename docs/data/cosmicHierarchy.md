# Cosmic Hierarchy

**File:** `src/data/cosmicHierarchy.ts`

## Purpose
Procedural generation system for the 9-universe, 90-galaxy cosmic hierarchy. Generates deterministic infinite worlds via seeded RNG.

## Key Exports
- `NINE_UNIVERSES: UniverseData[]` — 9 universe definitions (Prime Dominion, Void Reaches, Genesis Fields, Eternal Nexus, Quantum Sea, Temporal Expanse, Iron Crucible, Crystalline Lattice, Obsidian Depths).
- `CosmicRNG` — Seeded random number generator class.
- `generateGalaxiesForUniverse(universe)` — Generates 90 galaxies per universe.
- `generateSectorsForGalaxy(galaxy)` — Generates sectors with types per quadrant.
- `generateSolarSystemsForSector(sector)` — Generates solar systems with star classes.
- `getGalaxyById`, `getUniverseById`, `getQuadrantInfo`, `getGalaxyClassInfo`, `getCosmicSummary` — Lookup helpers.
