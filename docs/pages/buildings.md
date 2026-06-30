# Buildings

- **Route:** `/buildings`
- **Purpose:** Construction and upgrade of planetary infrastructure buildings.

## Key Features

- Uses `useBuildingQueue` hook for managing the construction queue
- Uses `ColonySelector` component (`src/pages/buildings/components/ColonySelector.tsx`) to switch between planets
- Real-time queue progress via 1-second tick interval
- Supabase real-time subscription (`postgres_changes`) for building level updates
- Cost calculation via `calculateBuildingCost`, build time via `calculateBuildTime`
- Resource affordability checked with `canAfford` from `useResources`

## UI Sections

| Section | Description |
|---|---|
| **Hero Banner** | Cinematic header showing "Planetary Buildings" title, total infrastructure power, and per-type average level stats (resource, energy, facility, storage). |
| **Colony Selector** | Dropdown to switch active colony with planet details: coordinates, field usage, diameter, temperature. |
| **Build Queue** | Active construction queue with progress bars, item position, target level, countdown timer, and cancel button. |
| **Type Overview Cards** | Four summary cards (Resource, Energy, Facility, Storage) showing count and average level per type. |
| **Buildings Grid** | Card grid of 12 building types (Metal Mine, Crystal Mine, Deuterium Synthesizer, Solar Plant, Fusion Reactor, Robotics Factory, Shipyard, Research Lab, Metal Storage, Crystal Storage, Deuterium Tank, Nanite Factory). Each card shows artwork, current level, level progress bar, upgrade costs, and build time. Upgrade button with affordability state. |
