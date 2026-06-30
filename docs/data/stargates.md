# Stargates

**File:** `src/data/stargates.ts`

## Purpose
Stargate network definitions — instantaneous travel nodes connecting star systems across the galaxy.

## Key Exports
- `Stargate` interface — id, name, type (stargate | jump_gate | hyperspace_beacon), tier, rank, rarity, system coordinates, status (active | inactive | damaged | under_construction), connections, stats (maxJumpRange, energyCost, cooldown, massLimit, stabilityRating, securityLevel), requirements, and upgrades.
- `STARGATES: Stargate[]` — Array of stargate definitions spanning the 9-universe network.
- `getStargateById`, `getStargatesBySystem`, `getStargatesByType`, `getConnectedGates`, `getReachableSystems`, `calculateJumpCost`, `isGateAccessible`, `getGateNetwork` — Network utility functions.
