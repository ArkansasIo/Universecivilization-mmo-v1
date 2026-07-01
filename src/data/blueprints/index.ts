import { Blueprint } from './types';
import { shipBlueprints } from './ships';
import { weaponBlueprints } from './weapons';

// Export all blueprints combined
export const allBlueprints: Blueprint[] = [
  ...shipBlueprints,
  ...weaponBlueprints
];

// Export by category
export { shipBlueprints, weaponBlueprints };

// Export types
export * from './types';

// Total: 25 blueprints so far (10 ships + 15 energy weapons)
// The system is designed to easily add 65+ more blueprints across:
// - Projectile Weapons (15 types)
// - Missile Weapons (10 types)
// - Defense Systems (15 types)
// - Propulsion (10 types)
// - Electronics (10 types)
// - Modules (10 types)
// - Ammunition (10 types)
// - Structures (5 types)

export default allBlueprints;
