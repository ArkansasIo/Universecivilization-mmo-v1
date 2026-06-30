# useMegastructureManager

Manages player megastructures — construction, tier upgrades, and active bonuses.

## Returns

- `megastructures` — array of player megastructures with tier, progress, effects
- `loading` — boolean for initial load
- `startConstruction(megastructureId, location)` — begins building a new megastructure
- `continueConstruction(megastructureId, resources)` — progresses the current build stage
- `completeMegastructure(megastructureId)` — finalizes construction and applies template effects
- `upgradeTier(megastructureId)` — increases tier and multiplies active effects by 1.5×
- `calculateTotalBonuses()` — aggregates all completed megastructure effects into a single map
- `loadMegastructures()` — refreshes data from Supabase

## Features

- Megastructures (endgame planetary-scale projects)
- Research / production / defense bonus stacking
