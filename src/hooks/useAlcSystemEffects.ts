import { useMemo } from 'react';
import { ALC_POWER_TECH_TREE, ALC_TECH_IDS } from '@/config/alcPowerTechTree';
import type { SubClass, ConnectionType } from '@/data/powerReactors';

export interface AlcEffects {
  reactorOutputMultiplier: Record<SubClass, number>;
  reactorEfficiencyBonus: Record<SubClass, number>;
  gridEfficiencyBonus: number;
  transmissionEfficiencyBonus: number;
  meltdownRiskReduction: number;
  reactorDurabilityBonus: number;
  overloadTolerance: number;
  containmentSpeed: number;
  selfRepair: number;
  storageCapacityMultiplier: number;
  surgeProtection: number;
  dischargeRate: number;
  quantumEfficiency: number;
  maintenanceCostReduction: number;
  gridUptime: number;
  allEnergyMultiplier: number;
  connectionEfficiencyBonus: Record<ConnectionType, number>;
}

const DEFAULT_SUBCLASS_RECORD: Record<SubClass, number> = {
  Standard: 0,
  Advanced: 0,
  Elite: 0,
  Master: 0,
  Grandmaster: 0,
  Mythic: 0,
};

const DEFAULT_CONNECTION_RECORD: Record<ConnectionType, number> = {
  standard: 0,
  high_voltage: 0,
  superconductor: 0,
  quantum_relay: 0,
};

const SUB_CLASSES: SubClass[] = ['Standard', 'Advanced', 'Elite', 'Master', 'Grandmaster', 'Mythic'];

export function computeAlcEffects(techLevels: Record<string, number>): AlcEffects {
  const effects: AlcEffects = {
    reactorOutputMultiplier: { ...DEFAULT_SUBCLASS_RECORD },
    reactorEfficiencyBonus: { ...DEFAULT_SUBCLASS_RECORD },
    gridEfficiencyBonus: 0,
    transmissionEfficiencyBonus: 0,
    meltdownRiskReduction: 0,
    reactorDurabilityBonus: 0,
    overloadTolerance: 0,
    containmentSpeed: 0,
    selfRepair: 0,
    storageCapacityMultiplier: 0,
    surgeProtection: 0,
    dischargeRate: 0,
    quantumEfficiency: 0,
    maintenanceCostReduction: 0,
    gridUptime: 0,
    allEnergyMultiplier: 0,
    connectionEfficiencyBonus: { ...DEFAULT_CONNECTION_RECORD },
  };

  for (const techId of ALC_TECH_IDS) {
    const level = techLevels[techId] ?? 0;
    if (level <= 0) continue;

    const def = ALC_POWER_TECH_TREE[techId];
    for (const effect of def.effects) {
      const value = effect.valuePerLevel * level;

      switch (effect.type) {
        case 'reactor_output': {
          for (const sc of SUB_CLASSES) {
            if (effect.target === 'all' || effect.target === sc) {
              effects.reactorOutputMultiplier[sc] += value;
            }
          }
          break;
        }
        case 'reactor_efficiency': {
          for (const sc of SUB_CLASSES) {
            if (effect.target === 'all' || effect.target === sc) {
              effects.reactorEfficiencyBonus[sc] += value;
            }
          }
          break;
        }
        case 'grid_efficiency':
          effects.gridEfficiencyBonus += value;
          break;
        case 'transmission_efficiency':
          effects.transmissionEfficiencyBonus += value;
          break;
        case 'meltdown_risk':
          effects.meltdownRiskReduction += value;
          break;
        case 'reactor_durability':
          effects.reactorDurabilityBonus += value;
          break;
        case 'overload_tolerance':
          effects.overloadTolerance += value;
          break;
        case 'containment_speed':
          effects.containmentSpeed += value;
          break;
        case 'self_repair':
          effects.selfRepair += value;
          break;
        case 'storage_capacity':
          effects.storageCapacityMultiplier += value;
          break;
        case 'surge_protection':
          effects.surgeProtection += value;
          break;
        case 'discharge_rate':
          effects.dischargeRate += value;
          break;
        case 'quantum_efficiency':
          effects.quantumEfficiency += value;
          break;
        case 'maintenance_cost':
          effects.maintenanceCostReduction += value;
          break;
        case 'grid_uptime':
          effects.gridUptime += value;
          break;
        case 'all_energy':
          effects.allEnergyMultiplier += value;
          break;
        case 'hv_efficiency':
          effects.connectionEfficiencyBonus['high_voltage'] += value;
          break;
        case 'sc_efficiency':
          effects.connectionEfficiencyBonus['superconductor'] += value;
          break;
        case 'qr_efficiency':
          effects.connectionEfficiencyBonus['quantum_relay'] += value;
          break;
      }
    }
  }

  return effects;
}

export function useAlcSystemEffects(getTechLevel: (techId: string) => number): AlcEffects {
  return useMemo(() => {
    const techLevels: Record<string, number> = {};
    for (const id of ALC_TECH_IDS) {
      techLevels[id] = getTechLevel(id);
    }
    return computeAlcEffects(techLevels);
  }, [getTechLevel]);
}
