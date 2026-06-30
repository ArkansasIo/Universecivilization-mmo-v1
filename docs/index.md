# Project Documentation

## Structure

```
docs/
  index.md              ← You are here
  data/
    index.md            ← Data layer module index
    index.json          ← Machine-readable data index
    abilitiesData.md    — Active & passive ability definitions
    achievements.md     — Player achievement system
    arcBosses.md        — Story-arc boss encounters
    cosmicHierarchy.md  — Universe/galaxy procedural generation
    craftingItems.md    — Craftable item definitions
    craftingMaterials.md— Material types and sources
    defenses.md         — Shield/armor/defense systems
    diplomacyMap.md     — Galactic diplomacy & alliances
    empiresAtWar.md     — Empire war states
    enemyRaces.md       — Hostile race definitions
    enemyUnits.md       — Enemy unit definitions
    enhancedShips.md    — Advanced ship system
    events.md           — Galactic events
    evolutionManager.md — 9-stage evolution system
    factions.md         — 15 faction definitions
    fleetManager.md     — Fleet management & combat
    galaxyGuide.md      — 90-entry location guide
    galaxyMaps.md       — 90 galaxy map entries
    govPolitics.md      — Government & political systems
    lore.md             — 100+ lore entries
    missions.md         — Mission definitions
    npcs.md             — NPC definitions
    planets.md          — 100+ planet database
    planetaryNpcs.md    — Planet-specific characters
    planetResources.md  — Planet resource deposits
    playerSkills.md     — Skill tree definitions
    playerStats.md      — Core & derived statistics
    productionChains.md — Manufacturing chains
    races.md            — 20 race definitions
    resourceMap.md      — Resource distribution map
    ships.md            — 30+ ship definitions
    shipEquipment.md    — Equipment database
    shipShields.md      — Shield generators
    shipWeapons.md      — Weapon system
    solarSystems.md     — Star system definitions
    spaceStations.md    — Station definitions
    specializations.md  — 6 class specializations
    technologies.md     — Technology tree (200+ nodes)
    traits.md           — Passive trait definitions
    units-index.md      — Central unit registry
    units-types.md      — Unit type hierarchy
    units-civilian.md   — Civilian unit roster
    units-military.md   — Military unit roster
    units-government.md — Government unit roster
    units-personnel.md  — Personnel pools & training
  config/
    index.md            ← Config module index
    index.json          ← Machine-readable config index
    dataLayer.md        — Data layer configuration
    debug.md            — Debug configuration
    defaults.md         — Default game settings
    gameConfig.md       — Central game configuration
    paths.md            — Asset path configuration
    ui.md               — UI theme & layout configuration
```

## File Pattern
Each `.md` file documents one source module and follows this structure:

- **Title** — Module name
- **File** — Source path relative to project root
- **Purpose** — What the module does
- **Key Exports** — Primary exported constants, types, and functions
- **Data Shape** — Description of key interfaces and data structures
