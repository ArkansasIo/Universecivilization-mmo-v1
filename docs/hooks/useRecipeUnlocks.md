# useRecipeUnlocks

Tracks crafting recipe/augmentation/artifact unlock status based on the player's crafting rank.

## Returns

- `isUnlocked(recipeId)` — checks if a recipe is available at current rank
- `getStatus(recipeId)` — returns full `RecipeUnlockStatus` with unlock state, title, and color
- `allWithStatus` — every rank-gated entry with computed unlock state
- `newAtCurrentRank` — recipes unlocked at the current rank
- `upcomingAtNextRank` — recipes that will unlock at the next rank
- `locked` / `unlocked` — filtered lists
- `currentRank` — the player's current crafting rank from `useCraftingRank`

## Features

- Crafting Forge recipes (weapons, shields, propulsion)
- Augmentations Lab (neural, combat, utility, power)
- Artifact Workshop (relics, temporal, cosmic, void, dimensional, mythic)
- Rank-gated progression (10 ranks, Common → Universal rarity)
