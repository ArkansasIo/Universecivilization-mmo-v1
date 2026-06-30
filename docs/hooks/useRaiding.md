# useRaiding

Manages PvP raiding — target discovery, combat resolution, loot transfer, and raid history.

## Returns

- `loading` — boolean during operations
- `raidHistory` — past raids with participants, losses, loot
- `findTargets(minResources?, maxDefense?)` — scans planets for viable raid targets
- `launchRaid(targetPlanetId, fleetId, attackerShips)` — resolves combat, transfers loot, records history
- `fetchRaidHistory()` — loads raid history with joined profile/planet data

## Combat Resolution

Compares attacker vs defender power (ships + defenses), calculates win chance, loss percentages, and stolen resources (50% of defender's resources on victory).

## Features

- PvP raiding system
- Target scanning with filters
- Combat simulation and loot transfer
