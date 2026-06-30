# useMothershipManager

Manages player motherships — building, upgrading, repairing, hangar deployment, and abilities.

## Returns

- `motherships` — array of player motherships with level, health, shields, energy, hangar
- `loading` — boolean for initial load
- `buildMothership(mothershipId)` — constructs a new mothership from template
- `upgradeMothership(mothershipId)` — increases level, multiplies stats by 1.05×
- `activateAbility(mothershipId, abilityName)` — adds an ability to the mothership
- `repairMothership(mothershipId)` — restores health/shields/energy to full, sets status to repairing
- `deployFighters(mothershipId, count)` — adds fighters to hangar (checks capacity)
- `loadMotherships()` — refreshes data from Supabase

## Features

- Mothership system
- Capital ship management
- Hangar / fleet deployment
