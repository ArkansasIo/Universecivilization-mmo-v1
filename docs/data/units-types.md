# Units — Type System

**File:** `src/data/units/types.ts`

## Purpose
Complete type hierarchy for the unit system — categories, classes, stats, and evolution data.

## Key Exports
- `UnitCategory` — `'civilian' | 'military' | 'government'`
- `CivilianClass` — `untrained | laborer | technician | specialist | expert | master | grandmaster`
- `MilitaryClass` — `untrained | recruit | soldier | veteran | elite | special-ops | officer | commander | hero`
- `GovernmentClass` — `untrained | clerk | administrator | diplomat | executive | minister | director | chancellor`
- `UnitClass` — Union of all class types.
- `UnitDefinition` — Full unit interface with id, name, category, class, subClass, sector, jobType, unitFunction, subFunction, tier, rarity, stats (UnitStats), abilities, requirements, training, and morale effects.
- `PersonnelPool`, `TrainingTrack`, `UnitStats`, `UnitAbilities`, `UnitRequirements`, `ExperienceData`, `MoraleEffects`, `EvolutionStageData` — Supporting interfaces.
