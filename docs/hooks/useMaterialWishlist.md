# useMaterialWishlist

## Manages
Client-side material wishlist for crafting recipes. Persisted to localStorage. Groups materials by recipe, tracks owned vs. needed amounts, and computes overall/recipe progress.

## Returns
- `items` — flat list of `WishlistItem`
- `isOpen`, `setIsOpen` — wishlist panel visibility
- `addToWishlist(materials, recipeName, recipeId, workshop)` — add materials for a recipe
- `removeFromWishlist(id)` — remove single material entry
- `removeRecipeFromWishlist(recipeId)` — remove all materials for a recipe
- `clearWishlist` — reset everything
- `updateOwned(materialName, newOwned)` — update owned amount
- `overallProgress` — 0–1 fraction across all items
- `readyCount` — count of materials where owned >= needed
- `byRecipe` — materials grouped by recipe ID
- `recipeProgress` — per-recipe progress summary
- `totalCount` — total wishlist entries

## Used by
- Crafting recipe detail panels
- Material wishlist sidebar/modal
