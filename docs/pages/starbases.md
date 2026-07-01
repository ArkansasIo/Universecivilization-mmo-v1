# Starbases

- **Route:** `/starbases`
- **Purpose:** Starbase management — construction, upgrades, and defense configuration.

## Key Features

- Fetches starbase data from `supabase`
- Starbase types: trade, military, diplomatic, research, industrial
- Statuses: operational, construction, upgrading, under attack
- Module and service system for customization
- Defense rating, trade volume, docking bays, population tracking
- Hourly income in credits and reputation

## UI Sections

| Section | Description |
|---|---|
| **Starbase Overview Cards** | Summary of total starbases, their levels, defense ratings, and trade income. |
| **Starbase List** | Cards for each starbase showing name, location, coordinates, type badge, level, status, docking bays, defense rating, trade volume, population, and hourly income. |
| **Detail/Management Panel** | Expanded view of a selected starbase with: installed modules, active services, upgrade cost breakdown, and income details. |
| **Build Modal** | Interface to construct a new starbase: select type (with base stats preview), choose build location (with sector bonuses and difficulty), confirm cost. |
| **Upgrade Controls** | Upgrade button with resource cost display and build time. |
