# Ship Equipment

**File:** `src/data/shipEquipment.ts`

## Purpose
Ship equipment database — weapons, shields, engines, sensors, and special modules across multiple tiers.

## Key Exports
- `SHIP_EQUIPMENT: ShipEquipment[]` — Equipment items with id, name, type (weapon, shield, engine, sensor, module, armor, special), class, tier, rarity, stats, requirements, cost, and special effects.
- `getEquipmentByType`, `getEquipmentByTier`, `getEquipmentByClass` — Filter helpers.
