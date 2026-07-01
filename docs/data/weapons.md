# Weapons

**File:** `src/data/weapons.ts`

## Purpose
Weapon systems database — defines all weapon types, classes, stats, abilities, and balance parameters.

## Key Exports
- `WeaponType` — `'laser' | 'ion' | 'plasma' | 'missile' | 'railgun' | 'graviton' | 'quantum' | 'antimatter'`
- `WeaponClass` — `'light' | 'medium' | 'heavy' | 'capital' | 'titan' | 'ultimate'`
- `Weapon` interface — id, name, type, class, rank, tier, level, quality, stats (damage, fireRate, range, accuracy, criticalChance, penetration, energyCost, cooldown), abilities, targetType, specialEffects, cost, requirements.
- `weapons: Weapon[]` — Array of weapon definitions spanning Basic Laser Cannon through Omega Annihilator.
