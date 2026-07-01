# Empires at War

**File:** `src/data/empiresAtWar.ts`

## Purpose
Empire war state data — 10 major empires with military power, war history, compositions, and active war declarations.

## Key Exports
- `EMPIRES_AT_WAR: EmpireAtWar[]` — Empire definitions with commanders, race types, homeworlds, government types, ideologies, territory counts, fleet details, war history, and military compositions.
- `ACTIVE_WAR_DECLARATIONS: WarDeclaration[]` — 8 active war declarations with progress, key battles, and descriptions.
- `getEmpireById`, `formatMilitaryPower`, `formatPopulation`, `formatCasualties` — Utility helpers.
