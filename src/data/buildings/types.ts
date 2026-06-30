export type BuildingType = 'BPO' | 'BPC';
export type BuildingCategory = 'Civil' | 'Military' | 'Industrial' | 'Infrastructure' | 'Research' | 'Defense';
export type BuildingRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';
export type BuildingRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Cosmic' | 'Universal';
export type ZoneType = 'Residential' | 'Commercial' | 'Industrial' | 'Military' | 'Agricultural' | 'Research' | 'Entertainment' | 'Government';

export interface BuildingStats {
  // Primary Stats
  capacity: number;
  efficiency: number;
  powerConsumption: number;
  powerGeneration?: number;
  maintenanceCost: number;
  
  // Production Stats
  productionRate?: number;
  storageCapacity?: number;
  processingSpeed?: number;
  
  // Population Stats
  housingCapacity?: number;
  employmentCapacity?: number;
  populationGrowth?: number;
  
  // Defense Stats
  defenseRating?: number;
  shieldStrength?: number;
  armorRating?: number;
  
  // Economic Stats
  incomeGeneration?: number;
  taxRevenue?: number;
  tradeBonus?: number;
  
  // Research Stats
  researchPoints?: number;
  technologyBonus?: number;
  
  // Special Stats
  morale?: number;
  pollution?: number;
  crimeReduction?: number;
  healthBonus?: number;
}

export interface BuildingRequirements {
  level: number;
  technologies: string[];
  buildings: string[];
  population?: number;
  zone?: ZoneType;
}

export interface BuildingCosts {
  igc: number;
  grc: number;
  materials: {
    name: string;
    amount: number;
    tier: number;
  }[];
  energy: number;
  buildTime: number; // in seconds
}

export interface BuildingUpgrade {
  level: number;
  costs: BuildingCosts;
  statsIncrease: Partial<BuildingStats>;
  unlocks?: string[];
}

export interface Building {
  id: string;
  name: string;
  description: string;
  lore: string;
  
  // Classification
  type: BuildingType;
  category: BuildingCategory;
  subCategory: string;
  class: string;
  rank: BuildingRank;
  rarity: BuildingRarity;
  tier: number;
  
  // Zone Information
  zone: ZoneType;
  zoneSize: number; // grid units
  adjacencyBonus?: {
    buildingType: string;
    bonus: string;
  }[];
  
  // Stats
  baseStats: BuildingStats;
  
  // Requirements
  requirements: BuildingRequirements;
  
  // Costs
  constructionCosts: BuildingCosts;
  
  // Upgrades
  maxLevel: number;
  upgrades: BuildingUpgrade[];
  
  // Production
  produces?: {
    resource: string;
    amount: number;
    interval: number; // seconds
  }[];
  
  consumes?: {
    resource: string;
    amount: number;
    interval: number;
  }[];
  
  // Special Features
  specialAbilities?: string[];
  uniqueEffects?: string[];
  
  // Visual
  image: string;
  icon: string;
  
  // Market
  baseValue: number;
  marketValue: number;
  
  // Meta
  isUnique: boolean;
  maxPerPlanet?: number;
  unlockCondition?: string;
}