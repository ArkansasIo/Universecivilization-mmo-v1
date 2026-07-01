# Units (Overview)

**File:** `src/data/units/index.ts`

## Purpose
Central unit registry — aggregates all unit definitions from civilian, military, and government submodules.

## Key Exports
- `ALL_UNITS: UnitDefinition[]` — Combined array of all unit definitions.
- `getUnitsByCategory(category)` — Filter units by 'civilian' | 'military' | 'government'.
- Re-exports all types from `./types`, and all unit arrays from `./civilian`, `./military`, `./government`, `./personnel`.
