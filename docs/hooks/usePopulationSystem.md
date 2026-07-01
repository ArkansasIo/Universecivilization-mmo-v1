# usePopulationSystem

Manages colony/planet populations with simulated growth, infrastructure, happiness, and specializations.

## Returns

- `populations` — array of location population data (size, growth, happiness, resources, etc.)
- `events` — population event log (births, deaths, migrations, disasters)
- `loading` — boolean for initial load
- `locationTypes` / `specializations` — available types and their bonuses
- `addLocation(name, type, initialPopulation)` — establishes a new settlement
- `upgradeInfrastructure(locationId, type)` — upgrades housing/food/water/oxygen/energy
- `transferPopulation(fromId, toId, amount)` — moves citizens between locations
- `addResources(locationId, type, amount)` — injects food/water/oxygen/energy
- `setSpecialization(locationId, spec)` — assigns planetary specialization
- `upgradeSpecialization(locationId)` — levels up specialization (+10 bonus per level)
- `reducePollution` / `improveSecurity` / `boostCulture` — quality-of-life actions
- `getTotalPopulation` / `getAverageHappiness` — convenience getters

## Features

- Colony management
- Population simulation (growth, happiness, resources)
- Specialization system (mining, research, military, agriculture, etc.)
