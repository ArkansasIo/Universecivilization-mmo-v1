# useInterstellarObjects

## Manages
Procedurally generated interstellar objects (asteroids, nebulae, black holes, etc.), cosmic phenomena (supernova remnants, gamma bursts, etc.), space anomalies (time dilation, rifts, etc.), and exploration missions. All data generated client-side.

## Returns
- `objects`, `phenomena`, `missions`, `anomalies` — data arrays
- `loading`, `currentUniverse`, `setCurrentUniverse` — state
- `startExplorationMission(targetId, targetType, missionType, fleetId)` — launch a mission
- `scanObject(objectId)`, `harvestResources(objectId, fleetId)`, `investigateAnomaly(anomalyId)` — interaction actions
- `getObjectsByType`, `getObjectsByGalaxy`, `getActivePhenomena`, `getUninvestigatedAnomalies`, `getHarvestableObjects` — query helpers

## Used by
- Universe exploration map
- Object detail and harvest panels
