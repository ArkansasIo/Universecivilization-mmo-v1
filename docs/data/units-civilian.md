# Units — Civilian

**File:** `src/data/units/civilian.ts`

## Purpose
Full civilian unit roster — over 60 civilian unit definitions across sector categories: Labor, Industrial, Scientific, Medical, Trade, Agriculture, and Service.

## Key Exports
- `civilianUnits: UnitDefinition[]` — Array of civilian unit definitions progressing from untrained (Raw Laborer, Unskilled Assistant) through grandmaster tiers (Grandmaster Artificer, Grandmaster Archon).

## Progression
Each sector has units at tiers 1–9 with classes: untrained → laborer → technician → specialist → expert → master → grandmaster. Units within each tier have defined training tracks and stat scaling.
