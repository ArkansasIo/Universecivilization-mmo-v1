# Technologies

**File:** `src/data/technologies.ts`

## Purpose
Technology tree spanning 9 categories with 200+ tech nodes across 10 tiers.

## Key Exports
- `TECHNOLOGIES: Technology[]` — Array of tech nodes with id, name, category (Weapons, Shields, Propulsion, Power, Sensors, Manufacturing, Biology, Espionage, Xenotech), tier, description, cost (research points, credits, resources), duration, prerequisites, unlocks, effects, and lore.
- `getTechsByCategory`, `getTechByTier`, `getTechPrerequisites`, `getTechUnlocks` — Query helpers.
