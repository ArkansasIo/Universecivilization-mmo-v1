# Travel Network

- **Route:** `/travel-network`
- **Purpose:** Interstellar travel infrastructure — wormholes, jump gates, stargates, and hyperspace routes.

## Key Features

- Uses `useTravelSystem` hook for travel system data and actions
- Travel system types: jumpgate, stargate, hyperspace
- Travel time and cost calculation via `calculateTravelTime` and `calculateTravelCost`
- Build, connect, and initiate travel operations
- Coordinate-based system (x, y, z)

## UI Sections

| Section | Description |
|---|---|
| **Tab Navigation** | Four tabs: Browse Systems (available travel networks), Owned Systems, Routes, Travel. |
| **System Browser** | List/filter of all available travel systems with filter by type. Each system shows type, name, tier, and stats. |
| **Owned Systems** | Player's owned travel systems with status, connections, and management controls. |
| **Routes Panel** | Active routes between jump gates/stargates with connection status. |
| **Travel Interface** | Form to initiate fleet travel: select fleet, source coordinates, destination coordinates, fleet size. Calculates ETA and cost. |
| **Build Controls** | Form to build a new travel system at specified coordinates. |
| **Connect Gates** | Interface to connect two owned jump gates. |
