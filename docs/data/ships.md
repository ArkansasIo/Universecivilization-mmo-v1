# Ships

**File:** `src/data/ships.ts`

## Purpose
Complete ship database with 30+ ship definitions across classes (Frigate through Titan).

## Key Exports
- `SHIPS: Ship[]` — Array of ship definitions with id, name, class (Frigate, Destroyer, Cruiser, Battlecruiser, Carrier, Battleship, Dreadnought, Titan), faction, tier, role, stats (hull, shields, armor, speed, etc.), weapons, systems, hangar capacity, crew, cost, and requirements.
- `getShipsByClass`, `getShipsByFaction`, `getShipById`, `getShipsByRole`, `getShipsByTier` — Query utilities.
- `generateShipId`, `generateHullNumber` — Identifier generators.
