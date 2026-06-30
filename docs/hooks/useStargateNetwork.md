# useStargateNetwork

Manages the stargate travel network — gate discovery, route finding, jump execution, and active transit tracking.

## Returns

- `availableGates` / `discoveredGates` / `activeJumps` / `jumpHistory` — network state
- `loading` — boolean for initial load
- `findRoute(fromGateId, toGateId, shipMass)` — Dijkstra shortest-path routing
- `executeJump(fleetId, fromGateId, toGateId, shipMass)` — initiates a jump (deducts costs, creates transit record)
- `discoverGate(gateId)` — unlocks a new gate (checks level, tech, resource requirements)
- `allGates` — all stargate definitions from data
- `getStargateById` / `getConnectedStargates` — data lookups

## Routing

Uses Dijkstra's algorithm on the discovered gate network. Costs include energy, IGC, and GRC per jump. Transit time equals the source gate's cooldown.

## Features

- Stargate network navigation
- Resource-based travel costs
- Gate discovery progression
- Active jump tracking with auto-completion (checks every 5s)
