# useAutoSave

## Manages
Automatic periodic saving of game state (resources, player data, buildings, research, ships, fleets) to Supabase at a configurable interval with a beforeunload fallback.

## Returns
- `lastSaved` — Date of last successful save
- `isSaving` — boolean flag
- `saveError` — error message string or null
- `manualSave` — trigger a save immediately

## Used by
- Game root component to persist player progress
