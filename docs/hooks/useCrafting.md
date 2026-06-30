# useCrafting

## Manages
Recipe-based item crafting: loads recipes and player materials, manages a crafting queue with progress polling (5s), handles material/resource deduction, success-rate checks on claim, cancellations with 50% refund, and dark-matter speed-ups.

## Returns
- `recipes`, `craftingQueue`, `materials` — data arrays
- `loading` — loading state
- `startCrafting(recipeId, quantity)` — start crafting (deducts materials & resources)
- `claimCraftedItem(queueId)` — claim finished item (checks success rate)
- `cancelCrafting(queueId)` — cancel with 50% material/resource refund
- `speedUpCrafting(queueId, darkMatterCost)` — complete instantly with dark matter
- `canCraft(recipeId, quantity)` — check if player has required materials
- `reload` — re-fetch all crafting data

## Used by
- Crafting workshop UI
- Recipe browser and material inventory
