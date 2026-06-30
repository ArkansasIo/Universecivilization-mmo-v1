# useUniverseGenerator

Procedurally generates galaxies and star systems from universe seeds for exploration.

## Returns

- `selectedUniverse` — the currently selected universe seed
- `generatedGalaxies` — array of generated galaxies with star systems
- `isGenerating` / `generationProgress` — generation state (0–100%)
- `universeStats` — computed totals (galaxies, systems, planets, moons, anomalies, habitable planets)
- `generateUniverse(universe, galaxyCount?)` — generates the full universe
- `setSelectedUniverse` — changes the selected universe seed
- `getStarSystemByCoordinates(x, y, z)` — finds a system at exact coordinates
- `getNearbyStarSystems(x, y, z, radius)` — returns systems within a radius (sorted by distance)
- `searchStarSystems(query)` — searches by system name
- `getRandomStarSystem()` — picks a random system
- `availableUniverses` — all available universe seeds

## Features

- Procedural universe/galaxy generation
- Seeded randomness for reproducibility
- Star system search and navigation
- Universe statistics display
