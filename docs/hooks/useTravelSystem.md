# useTravelSystem

Manages interstellar travel — building travel systems, initiating fleet movement, and connecting jump gates.

## Returns

- `ownedSystems` — travel systems owned by the player
- `activeRoutes` — fleet movements in transit
- `loading` — boolean for initial load
- `playerResources` / `playerLevel` / `playerTechnologies` / `playerBuildings` — player state for requirement checks
- `buildTravelSystem(systemId, coordinates)` — constructs a travel system (checks requirements, deducts resources)
- `initiateTravel(fleetId, systemId, from, to, fleetSize)` — starts fleet movement (checks range, size, costs)
- `connectJumpGates(gate1Id, gate2Id)` — links two jump gates within range
- `getAvailableSystems()` — all travel systems with availability info
- `allTravelSystems` — full system definitions

## Travel System Types

Defined in `data/travelSystems` — warp drives, jump gates, wormholes, etc., each with range, fleet capacity, and resource costs.

## Features

- Interstellar fleet movement
- Jump gate network building
- Requirement-gated travel tech (level, research, buildings, resources)
- Auto-arrival detection (checks every 1s)
