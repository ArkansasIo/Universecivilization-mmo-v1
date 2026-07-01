# useResources

Core resource management — fetch, deduct, add, and real-time sync for all player currencies.

## Returns

- `resources` — `{ metal, crystal, deuterium, energy, dark_matter, imperial_credits, republic_credits }`
- `loading` / `error` — state indicators
- `canAfford(cost)` — checks if player has enough metal/crystal/deuterium
- `deductResources(cost)` — deducts resources with validation (returns success boolean)
- `addResources(amount)` — adds resources (partial costs supported)
- `refetch` — reloads from Supabase

## Features

- Universal resource/currency data source
- Real-time updates via Postgres subscription
- Auto-initialization with starting resources (500/300/100)
- Dual-key lookup (user_id / player_id) for RLS compatibility
