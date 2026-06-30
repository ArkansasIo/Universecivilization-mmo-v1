# Power Grid

- **Route:** `/power-grid`
- **Purpose:** Power grid management — reactor placement, connections, power flow, and grid stability.

## Key Features

- Uses `usePowerGrid`, `usePowerConsumption`, and `useGridOverload` hooks
- Grid-based reactor placement system (configurable grid size)
- Four connection types: standard, high voltage, superconductor, quantum relay
- Reactor classes: Civilian, Industrial, Military, Research, Exotic
- Sub-class system: Standard, Advanced, Elite, Master, Grandmaster, Mythic (with multipliers)
- Durability/wear system with maintenance mechanics
- Energy harvest — surplus grid power converted to player energy resources
- Crisis system with cascade probability and emergency stabilization
- Cinema-grade boot sequence (`GridBootSequence` component, minimum 2.5s display)
- Animated power flow lines (SVG with `<animateMotion>`)

## UI Sections

| Section | Description |
|---|---|
| **System Status Overview** | Five stat cards: Grid Status (with color-coded alert state), Total Output, Grid Demand (with capacity %), Energy Yield, Stability Risk (with cascade probability). Red crisis alert strip when unstable/critical. |
| **Grid View** | Interactive grid of cells. Place reactors by clicking, connect nodes with link mode. Each cell shows reactor icon, name, level, durability bar, and status. Animated SVG power flow lines between connected nodes. |
| **Catalog View** | Reactor catalog with class/sub-class filters. Grouped by reactor type with tier, base power output, sub-class multiplier, wear rate, and placement count. Click to select and deploy. |
| **Reactor Diagnostics (Right Panel)** | Selected reactor detail: output gauge, efficiency %, durability bar with wear rate, level/tier/uptime/status, and action buttons (Upgrade, Maintain, Activate/SCRAM, Dismantle). |
| **Maintenance Center** | Modal showing damaged/meltdown reactors (with repair costs), reactors requiring maintenance (with durability bars and efficiency penalties), and healthy reactors summary. Energy harvest control to convert surplus to resources. |
| **Overload Panel** | Grid crisis management: overload events list, resolve event controls, emergency stabilization, and reactor scram functions. |
