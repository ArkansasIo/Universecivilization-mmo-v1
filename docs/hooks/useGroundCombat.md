# useGroundCombat

## Manages
Planetary ground invasion system: target selection (5 pre-defined planets), unit assignment (8 unit types with roles), mission configuration (7 mission types), success chance calculation (terrain/role/type modifiers), battle simulation (3s delay), and battle report generation.

## Returns
- `activeTab`, `selectedPlanet`, `selectedMission`, `assignedUnits`, `unitCounts`, `orbitalSupport` — UI state
- `activeMissions`, `battleReports`, `simulating`, `showReport` — mission/report state
- `terrainMods`, `totalCombatPower`, `successChance` — computed values
- `assignUnit`, `removeUnit` — unit management
- `launchMission` — execute invasion (simulates outcome after 3s)
- `TARGET_PLANETS`, `AVAILABLE_UNITS`, `TERRAIN_MODIFIERS`, `MISSION_TYPE_LABELS` — static data

## Used by
- Ground combat planning interface
- Battle report viewer
