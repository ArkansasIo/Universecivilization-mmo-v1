# useFleetFormations

## Manages
Fleet formation presets with stat bonuses. Supports 6 formation templates (aggressive, defensive, balanced, flanking, turtle, swarm). Players can create, update, set default, and delete formations.

## Returns
- `formations` — player's saved formations
- `loading` — loading state
- `formationTemplates` — the 6 predefined templates
- `createFormation(type, customName?)` — create from template
- `setDefaultFormation(formationId)` — set as active default
- `deleteFormation(formationId)` — remove a formation
- `updateFormation(formationId, updates)` — modify formation properties
- `refreshFormations` — re-fetch formations

## Used by
- Fleet formation editor
- Combat preparation screen
