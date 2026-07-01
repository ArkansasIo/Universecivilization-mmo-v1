# useBuildingQueue

## Manages
Building upgrade queue for a specific planet. Supports one active upgrade at a time, polls for completions every 2s, uses Supabase real-time subscriptions, and fires achievement tracking.

## Returns
- `queue` — in-progress building upgrades
- `loading` — loading state
- `addToQueue(buildingType, targetLevel, cost, buildTime)` — start an upgrade
- `cancelBuilding(buildingId)` — cancel an in-progress upgrade
- `refreshQueue` — re-fetch queue

## Used by
- Planet building interface
- Construction queue panel
