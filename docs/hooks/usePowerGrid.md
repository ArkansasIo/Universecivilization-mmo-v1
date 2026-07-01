# usePowerGrid

Manages a planet/moon power grid — reactor placement, connections, maintenance, and energy harvesting.

## Returns

- `grid` — the power grid entity (size, efficiency, status)
- `reactors` — reactors on the grid with definitions, level, durability, status
- `definitions` — all reactor blueprints
- `connections` — grid connections between cells
- `gridCells` — 2D grid cell matrix for rendering
- `selectedReactor` / `selectedDefinition` — selection state
- `isLoading` / `error` / `loadDurationMs` — state indicators
- `placeReactor(definitionId, x, y)` — places a reactor on a grid cell
- `removeReactor(reactorId)` — removes a reactor
- `upgradeReactor(reactorId)` — increases reactor level
- `toggleReactorStatus(reactorId, status)` — online/offline/maintenance
- `maintainReactor(reactorId)` — restores durability (costs resources, 3s cooldown)
- `repairReactor(reactorId)` — repairs damaged/meltdown reactors (higher cost)
- `addConnection(fromX, fromY, toX, toY, type)` — wires cells together
- `removeConnection(connectionId)` — removes a connection
- `harvestEnergy()` — converts surplus power into energy resource
- `recalculateGrid` / `refreshGrid` — compute and reload

## Features

- Grid-based reactor placement mini-game
- Reactor durability/wear simulation
- Transmission loss calculation
- Energy harvesting economy
