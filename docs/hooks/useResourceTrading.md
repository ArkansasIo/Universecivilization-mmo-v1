# useResourceTrading

Manages a player-driven resource marketplace — offers, purchases, history, and price tracking.

## Returns

- `myOffers` — active sell offers by the current player
- `marketOffers` — all active offers from other players (sorted by price)
- `tradeHistory` — completed trades involving the player
- `marketPrices` — calculated average/lowest/highest prices per resource
- `tradableResources` — full list of tradable resource types
- `loading` — boolean for initial load
- `createOffer(resourceType, amount, pricePerUnit, currency, durationHours?)` — lists a sell offer
- `buyOffer(offerId)` — purchases an offer, transfers resources and currency
- `cancelOffer(offerId)` — cancels own offer, returns resources
- `getMarketPrice(resourceType)` — price lookup helper
- `getResourceOffers(resourceType)` — market offers filter
- `refreshMarket` — reloads all market data

## Features

- Player-driven economy
- Resource trading with multiple currency types
- 24h price history and change tracking
- Market refresh every 30s
