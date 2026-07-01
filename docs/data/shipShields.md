# Ship Shields

**File:** `src/data/shipShields.ts`

## Purpose
Ship shield system — shield generators, types, stats, and mechanics.

## Key Exports
- `SHIP_SHIELDS: ShipShield[]` — Shield definitions with id, name, type (standard, adaptive, regenerative, phase, quantum, void), tier, capacity, recharge rate, damage resistance, and special properties.
- `SHIELD_TYPES` — Enum of shield categories.
- `calculateEffectiveShields`, `calculateShieldRegen`, `getShieldEffectiveness` — Mechanics calculators.
