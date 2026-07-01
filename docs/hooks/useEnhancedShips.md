# useEnhancedShips

## Manages
Enhanced ship system with hull/shields, upgrades, leveling, and combat power calculations. Loads from Supabase with real-time subscriptions, supports building, repairing, upgrading, and leveling ships.

## Returns
- `ships` — player's ship list
- `loading` — loading state
- `buildShip(shipTemplate)` — construct a new ship
- `repairShip(shipId)` — restore hull and shields
- `upgradeShip(shipId, upgradeType)` — increment a ship upgrade level
- `levelUpShip(shipId)` — increase ship level using `ShipGameLogic.levelUp`
- `calculateShipPower(ship)` — compute combat power
- `loadShips` — re-fetch ships

## Used by
- Shipyard/building UI
- Ship management and detail screens
