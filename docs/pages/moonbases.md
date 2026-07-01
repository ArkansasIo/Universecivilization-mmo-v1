# Moonbases

- **Route:** `/moonbases`
- **Purpose:** Lunar base management — moon-specific buildings and production.

## Key Features

- Fetches moon base data from `supabase`
- Base types: mining, military, research, industrial, defensive
- Statuses: operational, construction, upgrading, damaged
- Production tracking for metal, crystal, deuterium, and energy
- Defense stats: shields, armor, weapons
- Capacity and population management

## UI Sections

| Section | Description |
|---|---|
| **Overview Stats** | Summary cards showing total moon bases, total production rates, and average defense ratings. |
| **Filter Tabs** | Type filter to show all or specific base types (mining, military, research, industrial, defensive). |
| **Moon Base Cards** | Cards for each base showing name, moon name, type badge, level, status, population/capacity, production rates per hour (metal, crystal, deuterium, energy), and defense stats. |
| **Detail Panel** | Expanded view of a selected moon base with: production breakdown, defense configuration, installed facilities list, population details, and upgrade cost. |
| **Build Modal** | Interface for constructing new moon bases with type selection. |
| **Upgrade Controls** | Upgrade action with resource costs and build time. |
