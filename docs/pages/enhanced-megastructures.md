# Enhanced Megastructures

- **Route:** `/enhanced-megastructures`
- **Purpose:** Advanced megastructure construction with enhanced stats and upgrade paths.

## Key Features

- Uses `useMegastructureManager` hook
- 10 megastructure types: Dyson Sphere, Ring World, Stellar Engine, Matrioshka Brain, Nicoll-Dyson Beam, Stellar Forge, Quantum Computer, Wormhole Nexus, Matter Decompressor, Mega Shipyard
- Tier-based upgrade system with progress tracking
- Status states: completed, under construction, planning, paused
- `canStartConstruction`, `canContinueConstruction`, `canUpgradeTier` guard functions
- Large-number formatting (K, M, B, T, Q)

## UI Sections

| Section | Description |
|---|---|
| **Header** | Gradient title "Megastructure Engineering" with subtitle. |
| **Type Selector** | Grid of available megastructure types with icons and color themes. |
| **Construction Dashboard** | Shows each megastructure's current status, tier level, construction progress percentage, and time remaining. |
| **Detail View** | Expanded stats for a selected megastructure including power output, special effects, and tier upgrade requirements. |
| **Management Controls** | Buttons for start construction, continue construction, and upgrade tier — each gated by the respective `canX` function. |
