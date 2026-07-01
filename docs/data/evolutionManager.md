# Evolution Manager

**File:** `src/data/evolutionManager.ts`

## Purpose
Manages the 9-stage ship/unit evolution system from Proto-Stage to Omega Stage.

## Key Exports
- `UNIT_EVOLUTIONS: EvolutionDefinition[]` — 9 evolution stages with requirements, stat multipliers, unlockable abilities, model/image changes, lore.
- `getEvolutionAtStage`, `getPossibleEvolutions`, `canEvolve`, `applyEvolution` — Evolution calculation and application logic.
