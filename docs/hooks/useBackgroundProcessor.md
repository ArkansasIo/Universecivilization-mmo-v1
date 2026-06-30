# useBackgroundProcessor

## Manages
Ticks every 15 seconds to run background game logic: auto-execute trade routes, complete espionage missions, process stargate jumps, generate planetary events, expire old content, and process fleet arrivals.

## Returns
- `processTradeRoutes` — auto-executes active trade routes
- `processEspionageMissions` — completes/fails active espionage missions
- `processStargateJumps` — marks completed stargate transits
- `generatePlanetaryEvents` — randomly spawns meteor/solar flare/alien artifact events
- `cleanupExpiredContent` — expires old planetary events and market listings
- `processFleetArrivals` — checks and processes returning fleets

## Used by
- Top-level game component (runs automatically on mount)
