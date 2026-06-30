# Buildings

**File:** `src/data/buildings/`

## Purpose
Building definitions for colony and station construction — civil, military, and industrial categories.

## Files
- `types.ts` — Building interface with id, name, type, class, tier, build cost/time, resource production, defense stats, and requirements.
- `index.ts` — Aggregates all building arrays and re-exports types.
- `civil.ts` — Civilian buildings (housing, farms, markets, hospitals, research labs, cultural centers, etc.).
- `military.ts` — Military buildings (barracks, shipyard, missile silos, defense platforms, training grounds, etc.).
- `industrial.ts` — Industrial buildings (refineries, factories, mines, power plants, foundries, assembly plants, etc.).

## Key Exports
- `allBuildings: Building[]` — Combined array of all building definitions.
- `civilBuildings`, `militaryBuildings`, `industrialBuildings` — Category-specific arrays.
