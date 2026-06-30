# Food · Water · Disease

- **Route:** `/food-water-disease`
- **Purpose:** Colony life-support simulation — food/water production, disease tracking, colony health management.

## Key Features

- Tab-based interface across four panels
- Data sourced from `@/data/foodWaterDisease` (FOOD_SOURCES, WATER_SOURCES, DISEASES, COLONY_HEALTH_DATA, SUPPLY_EVENTS, etc.)
- Quarantine system with confirmation modal, effects (fleet traffic, trade routes, spread risk)
- Disease treatment system with resource costs and simulation delay
- Sanitation upgrades with vulnerability reduction
- PRP (Plague Response Protocol) emergency trigger
- Sub-components: `SupplyEmergencyResponse`, `DiseaseSpreadMap`, `ColonyHealthDashboard`, `BioResearchLab`

## UI Sections

| Section | Description |
|---|---|
| **Overview Panel** | Hero banner with "Colony Life-Support Systems" title, PRP emergency trigger button, and outbreak alert strip. Empire-wide stat badges: Food/hr, Water/hr, Global Health %, Outbreaks, Quarantined, Total Infected. Colony Health Status grid with per-colony health cards (health score bar, food/water surplus, active diseases, sanitation %, medical capacity). Supply & Health Alerts event feed. |
| **Food Panel** | Food Production Systems grid with source cards (hydroponics, algae vats, etc.). Each card shows category, level, output/hr, energy cost, water cost. Detail panel with full stats and upgrade button. |
| **Water Panel** | Water Supply Systems grid with source cards (ice mining, atmospheric processors, etc.). Same card/detail layout as Food panel. |
| **Disease Panel** | Disease & Outbreak Control grid with threat cards. Each card shows: severity badge (endemic/epidemic/pandemic), spread rate, productivity loss, mortality rate, symptoms, infected population, active days, treatment requirements. Expanded detail shows food/water consumption modifiers, research cure availability. Treatment modal with resource costs and deployment simulation. |
| **Bio Research Lab** | Research tree for disease cures and biological upgrades. |
| **Disease Spread Map** | Visual map of disease propagation across colonies. |
| **Supply Emergency Response** | Interface for managing supply disruptions and emergency resource allocation. |
| **Colony Health Dashboard** | Per-colony detailed health metrics and management. |
