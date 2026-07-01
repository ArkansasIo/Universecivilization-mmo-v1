# useGameLoop

## Manages
Core game tick loop running every 10s: resource production (via `process-resource-tick` edge function), fleet movement execution (attack, transport, colonize, harvest, spy, etc.), building queue completion, and research queue completion. Sends notifications on completion.

## Returns
- `calculateProduction` — trigger resource tick
- `processFleetMovements` — process fleet arrivals
- `processBuildingQueue` — complete finished building upgrades
- `processResearchQueue` — complete finished research projects

## Used by
- Top-level `App` or game layout component (auto-starts on mount)
