# Ship Weapons

**File:** `src/data/shipWeapons.ts`

## Purpose
Ship weapon system — weapons across multiple types (laser, plasma, kinetic, missile, railgun, ion, tachyon, etc.).

## Key Exports
- `SHIP_WEAPONS: ShipWeapon[]` — Weapon definitions with id, name, type, class, tier, rarity, damage type (kinetic, energy, explosive, corrosive, electromagnetic, thermal, radiation, quantum), stats (damage, range, fire rate, accuracy, critical), special effects, and requirements.
- `getWeaponsByType`, `getWeaponsByClass`, `getWeaponsByDamageType`, `getWeaponsByTier` — Filter helpers.
- `calculateDPS`, `calculateEffectiveRange`, `getDamageMultiplier` — Calculation utilities.
