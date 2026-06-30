# useMarketplace

## Manages
Resource marketplace listings: create/buy/cancel listings. Purchases are processed via a server-side edge function (`process-marketplace-trade`). Tracks user's own listings separately.

## Returns
- `listings` — all active marketplace listings
- `myListings` — current user's own listings
- `loading`, `processingTrade` — state
- `createListing(resourceType, quantity, pricePerUnit, currency, expiresInDays)` — create a new sell offer
- `buyItem(listingId, quantity?)` — buy from a listing via edge function
- `cancelListing(listingId)` — cancel own listing (sets status to cancelled)
- `refreshListings` — re-fetch

## Used by
- Marketplace trading interface
- My listings management panel
