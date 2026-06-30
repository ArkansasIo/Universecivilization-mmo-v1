# useMasterCrafting

## Manages
Master crafting system with skill trees (Weaponsmithing, Armorsmithing, Engineering, Alchemy, Enchanting), material inventory, crafting queue with progress (ticked every 1s), item claiming, dismantling for 25% material return, and skill experience gain.

## Returns
- `craftingQueue`, `materials`, `craftingSkills` — data arrays
- `loading` — loading state
- `startCrafting(itemId, quantity)` — craft an item (checks skill + material requirements)
- `speedUpCrafting(queueId, darkMatterCost)` — instant complete
- `claimCraftedItem(queueId)` — claim item and gain skill XP
- `cancelCrafting(queueId)` — cancel with 50% material refund
- `addMaterial(materialId, amount)` — add materials to inventory
- `getCraftableItems()` — items player can currently craft
- `dismantleItem(itemId)` — dismantle for 25% material return
- `craftingItems`, `craftingMaterials` — static data references

## Used by
- Master crafting UI
- Skill tree and material management screens
