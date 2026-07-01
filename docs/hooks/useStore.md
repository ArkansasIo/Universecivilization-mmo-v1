# useStore

Manages the premium store — inventory, purchases, boosters, and premium currency.

## Returns

- `inventory` — `{ premium_currency, purchased_items, active_boosters }`
- `loading` / `purchasing` — state indicators
- `purchaseItem(item)` — buys an item (checks currency, requirements, grants resources/boosters)
- `purchasePremiumCurrency(amount, price)` — adds premium currency (mock payment)
- `getActiveBoosters()` — returns currently active boosters (not expired)
- `reloadInventory` — refreshes from Supabase

## Purchase Handling

- Deducts premium currency, adds to purchased_items
- Resource packs: credits metal/crystal/deuterium/darkMatter/exoticMatter
- Boosters: activates with expiry timestamp (duration in seconds)
- Checks level requirements if defined on the item

## Features

- In-game premium store
- Booster system with expiration
- Resource pack purchases
- Level-based purchase gating
