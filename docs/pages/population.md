# Population

- **Route:** `/population`
- **Purpose:** Population management across empire locations — distribution, growth, happiness, and specialization.

## Key Features

- Uses `usePopulationSystem` hook for population data and actions
- Location types and specializations system
- Actions: add location, upgrade production, transfer population, set/upgrade specialization, reduce pollution, improve security, boost culture
- Population growth rates and happiness tracking
- Event system for population-related occurrences

## UI Sections

| Section | Description |
|---|---|
| **Population Overview** | Summary stats showing total population, growth rate, happiness average, and population distribution by location type. |
| **Location Cards** | List of population centers with name, type, population count, growth rate, happiness level, specialization, production output, pollution level, and security rating. |
| **Specialization Panel** | Modal for assigning and upgrading location specializations with tier-based bonuses. |
| **Population Controls** | Actions for transferring population between locations, boosting culture, improving security, and reducing pollution (cost: credits per point). |
| **Events Feed** | List of population-related events and notifications. |
