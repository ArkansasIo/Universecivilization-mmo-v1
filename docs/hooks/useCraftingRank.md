# useCraftingRank

## Manages
10-rank crafting progression system (Apprentice → Grandmaster Artisan) based on cumulative skill points (SP) spent across crafting trees. Persisted to localStorage.

## Returns
- `totalSpent` — cumulative SP across all trees
- `treeBreakdown` — SP per tree ID
- `currentRank`, `nextRank` — current and next `CraftingTitle`
- `progressPct`, `spToNext` — progress to next rank
- `recentUnlock` — last-unlocked rank (toast-worthy)
- `recordSpend(treeId, spDelta)` — called on node upgrade to track SP
- `resetAll` — reset all SP
- `allTitles` — full `CRAFTING_TITLES` array

## Used by
- Crafting skill tree UI
- Rank badge/display components
