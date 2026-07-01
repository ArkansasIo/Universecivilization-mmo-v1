# useFleetManager

## Manages
Full fleet lifecycle: sending fleets with ship/cargo deduction, coordinate-based travel time calculation, real-time movement checking (5s interval), mission execution (attack, transport, spy, colonize, harvest), recall, and return handling with loot collection. Fires achievement events for combat victories and plundering.

## Returns
- `fleets` — all player fleets
- `activeFleets` — moving/returning fleets
- `loading` — loading state
- `sendFleet(missionType, ships, origin, destination, cargo?)` — dispatch a fleet
- `recallFleet(fleetId)` — recall a fleet mid-mission
- `loadFleets` — re-fetch fleets
- `getFleetProgress(fleet)`, `getTimeRemaining(fleet)` — progress helpers
- `calculateTravelTime(ships, origin, destination)` — travel time estimation
- `calculateFuelCost(ships, distance)` — fuel cost calculation

## Used by
- Fleet dispatch interface
- Fleet overview and mission status panels
