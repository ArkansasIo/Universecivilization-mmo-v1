# useColonyManagement

## Manages
Planet colony lifecycle: loading colonies with building levels and population, colonizing new planets, abandoning colonies, renaming, and selecting the active colony.

## Returns
- `colonies` — full list of player's colonies with production stats
- `selectedColony` — currently selected colony
- `loading` — loading state
- `colonizePlanet(name, coordinates, type)` — establish a new colony (creates planet + starter buildings + population)
- `abandonColony(colonyId)` — delete colony and all related data
- `selectColony(colony)` — switch active colony
- `updateColonyName(colonyId, newName)` — rename a colony
- `reload` — re-fetch all colonies

## Used by
- Colony overview and management screens
- Planet selection dropdown
