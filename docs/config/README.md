# Config Files

10 game configuration modules that define game mechanics, balance parameters, and structure.

| File | Purpose |
|---|---|
| [gameConfig.md](gameConfig.md) | Global game constants, speed settings, time scaling |
| [researchTree.md](researchTree.md) | Research technology tree definitions and helpers |
| [researchClassification.md](researchClassification.md) | Research classification taxonomy |
| [shipClasses.md](shipClasses.md) | Ship class hierarchy, formations, stat formulas |
| [starshipTechTree.md](starshipTechTree.md) | Starship technology taxonomy (90 entries per axis) |
| [classificationSystem.md](classificationSystem.md) | Master classification taxonomy (ships, military, civilian, government) |
| [buildingDefinitions.md](buildingDefinitions.md) | Building type definitions and effects |
| [buildingRegistry.md](buildingRegistry.md) | Building registry and lookup |
| [achievementDefinitions.md](achievementDefinitions.md) | Achievement definitions and criteria |
| [databaseSchema.md](databaseSchema.md) | Supabase database schema reference |

## Conventions

- Config files use `as const` for literal types
- Config files export both values and TypeScript types
- Balance parameters are concentrated here for easy tuning
- Import pattern: `import { ... } from '@/config/<name>'`
