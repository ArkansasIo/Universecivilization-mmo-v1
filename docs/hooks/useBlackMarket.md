# useBlackMarket

## Manages
Black market item listings: browse active items, create anonymous or public listings, buy items (resource deductions + inventory delivery), and cancel own listings.

## Returns
- `items` — active black market listings sorted by newest
- `myListings` — current user's own listings
- `loading` — loading state
- `createListing(itemType, itemName, itemData, prices, quantity, rarity, anonymous, duration)` — create a new listing
- `buyItem(itemId)` — purchase an item (checks resources, transfers credits, adds artifact if applicable)
- `cancelListing(itemId)` — delete own listing
- `refreshItems` — re-fetch all items

## Used by
- Black market tab/screen
