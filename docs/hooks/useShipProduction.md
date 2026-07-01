# useShipProduction

Manages the ship building queue — adding orders, production progress, and inventory delivery.

## Returns

- `queue` — active ship production items with timing and count
- `loading` — boolean for initial load
- `addToQueue(shipType, quantity, timePerShip)` — enqueues a production order
- `cancelProduction(productionId)` — removes an order from the queue
- `getTimeRemaining(item)` — seconds until completion
- `getProgress(item)` — percentage complete (0–100)
- `refreshQueue` — reloads from localStorage

## Features

- Shipyard / construction queue
- Time-based production simulation (checks every 5s)
- Automatic inventory delivery on completion
- LocalStorage persistence
