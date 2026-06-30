# usePowerConsumption

Tracks building power connections and demand snapshots for a planet's power grid.

## Returns

- `connections` — building-to-grid connections with power draw, priority, connection status
- `snapshot` — demand summary: `{ totalDemand, totalSupply, surplus, deficit, demandPct, status, criticalLoad, highLoad, normalLoad, lowLoad, buildingCount, connectedCount }`
- `isLoading` / `error` — state indicators
- `connectBuilding(buildingId, nodeX, nodeY, priority?)` — connects a building to the grid
- `disconnectBuilding(buildingId)` — removes a building from the grid
- `setBuildingPowerDraw(buildingId, draw)` — updates power draw
- `setBuildingPriority(buildingId, priority)` — updates priority level
- `emergencyShedLoad(priority)` — disconnects all buildings at a given priority tier
- `refresh` — reloads and recalculates

## Demand Statuses

`surplus` → `balanced` → `strained` → `critical` → `blackout`

## Features

- Power grid management UI
- Load shedding / priority management
- Real-time demand monitoring (polls every 5s)
