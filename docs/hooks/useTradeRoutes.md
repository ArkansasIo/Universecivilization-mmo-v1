# useTradeRoutes

Manages automated trade routes between locations — creation, execution, pause/resume, and profit tracking.

## Returns

- `routes` — all trade routes
- `activeRoutes` — routes with status `active`
- `loading` — boolean for initial load
- `createRoute(origin, destination, cargoType, cargoAmount, frequency)` — creates a new trade route
- `executeRoute(routeId)` — manually executes a route trip (adds profit to resources)
- `pauseRoute(routeId)` / `resumeRoute(routeId)` — toggles route status
- `deleteRoute(routeId)` — removes a route
- `reload` — refreshes from Supabase

## Profit Calculation

`profit = cargoAmount * basePrice * 0.2`. Base prices: metal=1, crystal=2, deuterium=3.

## Features

- Automated economy / trade route system
- Profit-per-trip tracking
- Transaction history logging
