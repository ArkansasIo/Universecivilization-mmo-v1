# Units — Personnel

**File:** `src/data/units/personnel.ts`

## Purpose
Personnel pool management — tracks untrained populations and training tracks for each unit category.

## Key Exports
- `personnelPools: PersonnelPool[]` — 3 pools (civilian, military, government) with currentCount, maxCount, growthRate, and availableForTraining.
- `TRAINING_TRACKS: TrainingTrack[]` — 70+ training track definitions mapping unit progression paths (e.g. raw-conscript → trained-conscript → private → private-first-class → ...). Each track has stages with source/target unit IDs, duration, cost, requirements, and stat improvements.
- `getTrackById`, `getTracksForUnit`, `getTracksByCategory`, `getTracksBySector`, `getNextEvolution`, `getEvolutionPath`, `canTrain`, `calculateTrainingTime`, `calculateTrainingCost` — Training system utilities.
