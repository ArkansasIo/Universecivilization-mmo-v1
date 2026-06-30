# Blueprints

**File:** `src/data/blueprints/`

## Purpose
Blueprint system for ship and weapon manufacturing — defines craftable designs with resource costs, build time, and tier requirements.

## Files
- `types.ts` — Blueprint interface with id, name, category, type, tier, rank, rarity, materials, cost, build time, and output item/ship.
- `index.ts` — Aggregates all blueprint arrays (25 base blueprints, extensible to 90+).
- `ships.ts` — Ship blueprints (frigate, destroyer, cruiser, carrier, battleship, etc.).
- `weapons.ts` — Weapon blueprints (laser, ion, plasma, railgun, missile, graviton, etc.).

## Key Exports
- `allBlueprints: Blueprint[]` — Combined array of all blueprint definitions.
- `shipBlueprints`, `weaponBlueprints` — Category-specific arrays.
