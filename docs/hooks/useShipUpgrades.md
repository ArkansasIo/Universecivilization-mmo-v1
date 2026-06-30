# useShipUpgrades

Manages ship equipment upgrades — installing, removing, and leveling up ship systems.

## Returns

- `ships` — fleet ships with their installed upgrades and bonus totals
- `loading` — boolean for initial load
- `upgradeTypes` — available upgrade categories (weapon, armor, engine, shield, targeting, reactor)
- `installUpgrade(fleetShipId, upgradeType, level?)` — installs an upgrade (costs resources, checks slots)
- `removeUpgrade(upgradeId)` — removes an upgrade
- `upgradeShipLevel(fleetShipId)` — levels up a ship (costs experience and resources)
- `refresh` — reloads ships with upgrades

## Upgrade Slots

Ships have limited upgrade slots. Leveling up a ship increases slot count by 1.

## Features

- Ship customization / equipment system
- Per-ship experience and leveling
- Resource-based upgrade costs
- Attack/defense/speed bonus stacking
