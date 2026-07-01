# useEspionage

## Manages
Espionage missions (spy, sabotage, steal) against other players. Handles mission creation with type-based durations, completion/failure resolution with success detection chance, and target notification on detection.

## Returns
- `missions` — all espionage missions
- `activeMissions` — missions currently in progress
- `loading` — loading state
- `startMission(targetId, missionType)` — launch a spy/sabotage/steal mission
- `completeMission(missionId)` — resolve a mission (rolls success/detection)
- `cancelMission(missionId)` — abort a mission
- `reload` — re-fetch missions

## Used by
- Espionage operations center
- Intel report viewer
