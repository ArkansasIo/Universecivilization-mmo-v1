# Empire

- **Route:** `/empire`
- **Purpose:** Empire overview/summary page — total stats, race traits, government, and colony management.

## Key Features

- Player race data from `@/data/playerRaces` via `getRaceById` and `useAuth`
- 12 government types across 4 tiers with unique bonuses/penalties/special abilities
- Race change modal (`RaceChangeModal` component)
- Government selection modal with requirements and unlock status
- RPG-style genetic trait bars (strength, intelligence, agility, endurance, charisma, perception)
- Colony list with filter (all/planet/moon/station) and sort (population/development/name)
- Colony artwork via `getColonyArt`

## UI Sections

| Section | Description |
|---|---|
| **Hero Section** | "Empire Management" title with action buttons: Explore Galaxy, Diplomacy, Rankings. |
| **Empire Stats Grid** | 8 stat cards: Total Colonies, Planets, Moons, Stations, Population, Development, Buildings, Defense. |
| **Current Government** | Active government display with name, tier, class badge, description, and six attribute bonuses (production, research, military, diplomacy, expansion, stability). Change Government button opens modal with all 12 government types (Democracy, Autocracy, Technocracy, Monarchy, Hive Mind, Mega Corp, Theocracy, Military Junta, Federation, Synthetic Ascendancy, Shadow Council, Egalitarian Commune). |
| **Racial Traits** | Three-column layout: Species Identity (lore, homeworld, lifespan, reproduction, adaptability), Genetic Attributes (6 RPG trait bars with average rating), Active Empire Bonuses (racial bonus description, empire-wide modifiers bar chart, special starting trait). Explore All Races and Change Race buttons. |
| **Colony Management** | Filtered/sorted colony grid with cards showing image, type badge, status badge, name, coordinates, population, buildings count, development progress bar, Manage and Fleet action buttons. |
