import { Rank, Rarity } from '../../types/gameTypes';

export interface BlueprintStats {
  // Primary Stats
  attack?: number;
  defense?: number;
  speed?: number;
  accuracy?: number;
  evasion?: number;
  criticalChance?: number;
  criticalDamage?: number;
  
  // Secondary Stats
  penetration?: number;
  shieldPenetration?: number;
  armorPenetration?: number;
  damageReduction?: number;
  shieldStrength?: number;
  armorStrength?: number;
  hullStrength?: number;
  
  // Tertiary Stats
  energyEfficiency?: number;
  cooldownReduction?: number;
  rangeBonus?: number;
  areaOfEffect?: number;
  statusEffectChance?: number;
  statusEffectDuration?: number;
  
  // Special Stats
  quantumResonance?: number;
  dimensionalStability?: number;
  cosmicPower?: number;
  realityManipulation?: number;
  temporalDistortion?: number;
  voidEnergy?: number;
}

export interface BlueprintMaterial {
  name: string;
  quantity: number;
  tier: number;
}

export interface Blueprint {
  id: string;
  name: string;
  description: string;
  lore: string;
  
  // Classification
  type: 'BPO' | 'BPC';
  category: string;
  subCategory: string;
  class: string;
  
  // Rarity & Rank
  rarity: Rarity;
  rank: Rank;
  tier: number;
  
  // Research Levels
  materialEfficiency: number;
  timeEfficiency: number;
  maxME: number;
  maxTE: number;
  
  // Production
  runs: number | 'Unlimited';
  maxRuns?: number;
  productionTime: number;
  outputQuantity: number;
  
  // Requirements
  requiredLevel: number;
  requiredTechnologies: string[];
  requiredSkills: { name: string; level: number }[];
  
  // Materials
  materials: BlueprintMaterial[];
  
  // Stats
  baseStats: BlueprintStats;
  bonusStats: BlueprintStats;
  
  // Capabilities
  canResearch: boolean;
  canCopy: boolean;
  canInvent: boolean;
  inventionChance?: number;
  
  // Value
  baseValue: number;
  marketValue: number;
  
  // Visual
  image: string;
  icon: string;
}

export const blueprintCategories = {
  ships: ['Fighters', 'Bombers', 'Corvettes', 'Frigates', 'Destroyers', 'Cruisers', 'Battleships', 'Carriers', 'Capitals'],
  weapons: ['Energy Weapons', 'Projectile Weapons', 'Missile Weapons', 'Exotic Weapons', 'Special Weapons'],
  defense: ['Shields', 'Armor', 'Point Defense', 'Countermeasures'],
  propulsion: ['Sublight Drives', 'FTL Drives', 'Maneuvering Systems'],
  electronics: ['Sensors', 'Computers', 'Communication'],
  modules: ['Power Systems', 'Utility Modules', 'Tactical Modules'],
  ammunition: ['Energy Ammunition', 'Projectile Ammunition', 'Missile Ammunition'],
  structures: ['Stations', 'Facilities']
};
