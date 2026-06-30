export * from './types';
export * from './civilian';
export * from './military';
export * from './government';
export * from './personnel';

import { civilianUnits } from './civilian';
import { militaryUnits } from './military';
import { governmentUnits } from './government';
import type { UnitDefinition } from './types';

export const ALL_UNITS: UnitDefinition[] = [
  ...civilianUnits,
  ...militaryUnits,
  ...governmentUnits
];

export function getUnitsByCategory(category: 'civilian' | 'military' | 'government'): UnitDefinition[] {
  return ALL_UNITS.filter(u => u.category === category);
}

export function getUnitsBySector(sector: string): UnitDefinition[] {
  return ALL_UNITS.filter(u => u.sector === sector);
}

export function getUnitById(id: string): UnitDefinition | undefined {
  return ALL_UNITS.find(u => u.id === id);
}

export function getUntrainedUnits(): UnitDefinition[] {
  return ALL_UNITS.filter(u => u.status === 'untrained' || u.status === 'basic-training' || u.status === 'advanced-training');
}

export function getUnitsByRarity(rarity: string): UnitDefinition[] {
  return ALL_UNITS.filter(u => u.rarity === rarity);
}
