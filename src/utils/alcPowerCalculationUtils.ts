import type { ReactorDefinition, ConnectionType } from '@/data/powerReactors';
import {
  SUB_CLASS_MULTIPLIERS,
  CONNECTION_TYPES,
  calculateEffectiveEfficiency,
} from '@/data/powerReactors';
import type { AlcEffects } from '@/hooks/useAlcSystemEffects';

export function calcAlcReactorOutput(
  def: ReactorDefinition,
  level: number,
  efficiency: number,
  durabilityPct: number | undefined,
  alc: AlcEffects,
): number {
  const eff = durabilityPct !== undefined
    ? calculateEffectiveEfficiency(efficiency, durabilityPct)
    : efficiency;

  const baseOutput = def.base_power_output + (def.power_output_per_level * (level - 1));
  const classMultiplier = SUB_CLASS_MULTIPLIERS[def.sub_class];

  const outputBonus = alc.reactorOutputMultiplier[def.sub_class] / 100;
  const effBonus = alc.reactorEfficiencyBonus[def.sub_class] / 100;

  const finalEff = eff * (1 + effBonus);
  const finalMultiplier = classMultiplier * (1 + outputBonus);

  return Math.floor(baseOutput * finalMultiplier * (finalEff / 100));
}

export function calcAlcTransmissionLoss(
  fromX: number, fromY: number,
  toX: number, toY: number,
  lossPerUnit: number,
  connectionType: ConnectionType,
  alc: AlcEffects,
): number {
  const distance = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
  const baseConnEff = CONNECTION_TYPES[connectionType].efficiency / 100;
  const bonusEff = (alc.connectionEfficiencyBonus[connectionType] + alc.transmissionEfficiencyBonus) / 100;
  const connEff = Math.min(1, baseConnEff + bonusEff);
  return distance * lossPerUnit * (2 - connEff);
}

export function calcAlcGridEfficiency(baseEfficiency: number, alc: AlcEffects): number {
  return Math.min(100, baseEfficiency + alc.gridEfficiencyBonus);
}

export function calcAlcMeltdownRisk(
  baseRisk: number,
  stability: number,
  loadRatio: number,
  efficiencyPct: number,
  alc: AlcEffects,
): number {
  const stabilityWithBonus = stability + alc.reactorDurabilityBonus / 2;
  const riskReduction = alc.meltdownRiskReduction / 100;
  const tolerance = alc.overloadTolerance / 100;

  let risk = baseRisk * Math.pow(loadRatio, 3) * (100 / (stabilityWithBonus + 10));
  risk = risk * (1 - riskReduction);

  if (efficiencyPct < 80) {
    const penalty = (80 - efficiencyPct) / 40;
    risk *= Math.max(1, 1 + penalty - tolerance);
  }

  return Math.min(100, Math.max(0, Math.floor(risk)));
}

export function calcAlcStorageCapacity(baseCapacity: number, alc: AlcEffects): number {
  return Math.floor(baseCapacity * (1 + alc.storageCapacityMultiplier / 100));
}

export function calcAlcSurgeProtection(alc: AlcEffects): number {
  return Math.min(100, alc.surgeProtection);
}

export function calcAlcEffectiveDurability(baseDurability: number, alc: AlcEffects): number {
  return Math.min(100, baseDurability + alc.reactorDurabilityBonus);
}

export function calcAlcMaintenanceCost(baseCost: number, alc: AlcEffects): number {
  return Math.max(1, Math.floor(baseCost * (1 - alc.maintenanceCostReduction / 100)));
}

export function calcAlcSelfRepairAmount(damage: number, alc: AlcEffects): number {
  return Math.floor(damage * (alc.selfRepair / 100));
}

export function calcAlcDischargeMultiplier(alc: AlcEffects): number {
  return 1 + alc.dischargeRate / 100;
}

export function calcAlcQuantumEfficiency(baseEfficiency: number, alc: AlcEffects): number {
  return Math.min(100, baseEfficiency + alc.quantumEfficiency);
}

export function calcAlcAllEnergyMultiplier(alc: AlcEffects): number {
  return 1 + alc.allEnergyMultiplier / 100;
}
