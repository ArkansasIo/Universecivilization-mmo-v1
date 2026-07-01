# Crafting Materials

**File:** `src/data/craftingMaterials.ts`

## Purpose
Comprehensive crafting materials system with types, tiers, sources, and usage mapping.

## Key Exports
- `craftingMaterials: CraftingMaterial[]` — Material definitions across 7 tiers (Basic through Ascendant), each with id, name, type (ore, refined, component, essence, rare, exotic, quantum, cosmic), tier, rarity, description, sources, and usedIn.
- `materialTiers` — Tier metadata with names and colors.
- `resourceTypes: ResourceType[]` — Resource definitions (metal, crystal, deuterium, dark matter, exotic matter, antimatter, nanites, plasma, food, water, oxygen, energy).
