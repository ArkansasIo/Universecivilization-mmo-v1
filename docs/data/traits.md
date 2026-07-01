# Traits

**File:** `src/data/traits.ts`

## Purpose
Character and ship traits — passive bonuses that modify gameplay.

## Key Exports
- `TRAITS: Trait[]` — Array of traits with id, name, type (character, ship, fleet, combat, social, trade, exploration, crafting), rarity, description, effects (stat modifiers), and synergy requirements.
- `getTraitsByType`, `getTraitsByRarity`, `getTraitById`, `getTraitSynergies` — Query utilities.
