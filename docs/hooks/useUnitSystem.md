# useUnitSystem

Manages ground/crew units — training, deployment, leveling, healing, and empire-wide personnel tracking.

## Returns

- `units` — all unit definitions with current availability, stats, level, status
- `filteredUnits` — units filtered by category, sector, and search query
- `pools` — untrained and in-training personnel pools
- `trainingQueue` — units currently in training with progress
- `empirePersonnel` — computed summary (total, civilian, military, government, combat power, productivity, upkeep)
- `notifications` — training/deployment alerts
- `allSectors` — unique sector names
- `selectedCategory` / `selectedSector` / `searchQuery` — filter state and setters
- `trainUnits({ unitId, count })` — starts training (consumes from untrained pool)
- `cancelTraining(queueIndex)` — cancels training, returns personnel
- `deployUnit({ unitId, count, destination })` / `recallUnit(unitId, count)` — unit movement
- `levelUpUnit(unitId)` — levels up (increases stats with formula)
- `addExperience(unitId, xp)` / `healUnits(unitId)` / `boostMorale(unitId, amount)` — unit management
- `getTrainingTrack(unitId)` / `getUnitPower(unitId)` / `getEmpireTotalPower()` — helpers
- `getTrainingQueueProgress(entry)` / `getTimeRemaining(entry)` — progress display

## Features

- Ground/crew unit system
- Personnel pool with population growth (every 60s)
- Training queue with real-time progress (checks every 2s)
- Stat level-up formulas with tier and rarity multipliers
- Unit power rating calculation
