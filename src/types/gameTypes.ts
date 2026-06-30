// Game Classification and Ranking System

// Rank System (SSS to E)
export type Rank = 'SSS' | 'SS' | 'S' | 'A' | 'B' | 'C' | 'D' | 'E';

// Rarity Tiers
export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Cosmic' | 'Universal';

// Quality Levels
export type Quality = 'Poor' | 'Normal' | 'Superior' | 'Excellent' | 'Masterwork' | 'Perfect' | 'Divine';

// Item Types
export type ItemType = 
  | 'Weapon' 
  | 'Armor' 
  | 'Shield' 
  | 'Engine' 
  | 'Reactor' 
  | 'Sensor' 
  | 'Computer' 
  | 'Module' 
  | 'Consumable' 
  | 'Material' 
  | 'Blueprint' 
  | 'Artifact';

// Ship Classes
export type ShipClass = 
  | 'Fighter' 
  | 'Interceptor' 
  | 'Bomber' 
  | 'Corvette' 
  | 'Frigate' 
  | 'Destroyer' 
  | 'Cruiser' 
  | 'Battlecruiser' 
  | 'Battleship' 
  | 'Dreadnought' 
  | 'Carrier' 
  | 'Titan' 
  | 'Mothership' 
  | 'Flagship';

// Officer Classes
export type OfficerClass = 
  | 'Admiral' 
  | 'Commander' 
  | 'Captain' 
  | 'Pilot' 
  | 'Engineer' 
  | 'Scientist' 
  | 'Diplomat' 
  | 'Spy' 
  | 'Merchant' 
  | 'Strategist';

// Player Titles
export type PlayerTitle = 
  | 'Novice Explorer'
  | 'Space Cadet'
  | 'Stellar Navigator'
  | 'Fleet Commander'
  | 'War Hero'
  | 'Grand Admiral'
  | 'System Lord'
  | 'Sector Overlord'
  | 'Galactic Conqueror'
  | 'Universal Emperor'
  | 'Cosmic Sovereign'
  | 'Dimensional Master'
  | 'Reality Shaper'
  | 'Eternal Legend';

// Building Tiers
export type BuildingTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// Technology Tiers
export type TechnologyTier = 1 | 2 | 3 | 4 | 5 | 6;

// Primary Stats
export interface PrimaryStats {
  attack: number;
  defense: number;
  speed: number;
  health: number;
  energy: number;
  cargo: number;
}

export type ShipStats = PrimaryStats;

// Secondary Stats
export interface SecondaryStats {
  criticalChance: number;
  criticalDamage: number;
  evasion: number;
  accuracy: number;
  armor: number;
  shieldStrength: number;
  shieldRegeneration: number;
  healthRegeneration: number;
  energyRegeneration: number;
}

// Tertiary Stats (Advanced)
export interface TertiaryStats {
  penetration: number;
  resistance: number;
  lifesteal: number;
  damageReflection: number;
  cooldownReduction: number;
  resourceEfficiency: number;
  experienceBonus: number;
  lootBonus: number;
}

// Complete Stats Interface
export interface CompleteStats extends PrimaryStats, SecondaryStats, TertiaryStats {}

// Item Attributes
export interface ItemAttributes {
  id: string;
  name: string;
  type: ItemType;
  rank: Rank;
  rarity: Rarity;
  quality: Quality;
  tier: number;
  level: number;
  maxLevel: number;
  stats: Partial<CompleteStats>;
  bonuses: ItemBonus[];
  requirements: ItemRequirements;
  description: string;
  icon: string;
  stackable: boolean;
  maxStack: number;
  tradeable: boolean;
  sellValue: number;
}

// Item Bonuses
export interface ItemBonus {
  type: 'flat' | 'percentage';
  stat: keyof CompleteStats;
  value: number;
  condition?: string;
}

// Item Requirements
export interface ItemRequirements {
  level?: number;
  rank?: Rank;
  technologies?: string[];
  resources?: Record<string, number>;
}

// Ship Attributes
export interface ShipAttributes {
  id: string;
  name: string;
  class: ShipClass;
  rank: Rank;
  rarity: Rarity;
  tier: number;
  level: number;
  maxLevel: number;
  experience: number;
  experienceToNext: number;
  stats: CompleteStats;
  baseStats: PrimaryStats;
  equipmentSlots: EquipmentSlot[];
  abilities: ShipAbility[];
  specialization: string;
  crew: number;
  maxCrew: number;
}

// Equipment Slots
export interface EquipmentSlot {
  id: string;
  type: ItemType;
  equipped: ItemAttributes | null;
  locked: boolean;
  unlockLevel: number;
}

// Ship Abilities
export interface ShipAbility {
  id: string;
  name: string;
  rank: Rank;
  type: 'Active' | 'Passive';
  cooldown: number;
  energyCost: number;
  description: string;
  effects: AbilityEffect[];
}

// Ability Effects
export interface AbilityEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'control';
  target: 'self' | 'ally' | 'enemy' | 'all';
  value: number;
  duration: number;
  stat?: keyof CompleteStats;
}

// Officer Attributes
export interface OfficerAttributes {
  id: string;
  name: string;
  class: OfficerClass;
  rank: Rank;
  rarity: Rarity;
  level: number;
  maxLevel: number;
  experience: number;
  experienceToNext: number;
  stats: Partial<CompleteStats>;
  skills: OfficerSkill[];
  specialization: string;
  loyalty: number;
  morale: number;
}

// Officer Skills
export interface OfficerSkill {
  id: string;
  name: string;
  rank: Rank;
  level: number;
  maxLevel: number;
  type: 'Combat' | 'Economic' | 'Diplomatic' | 'Research' | 'Exploration';
  effect: string;
  bonus: number;
}

// Player Profile Extended
export interface PlayerProfile {
  id: string;
  username: string;
  title: PlayerTitle;
  rank: Rank;
  level: number;
  experience: number;
  experienceToNext: number;
  prestige: number;
  reputation: number;
  stats: PlayerStats;
  achievements: Achievement[];
  titles: UnlockedTitle[];
}

// Player Stats
export interface PlayerStats {
  totalPower: number;
  fleetPower: number;
  economicPower: number;
  researchPower: number;
  militaryRank: number;
  economicRank: number;
  researchRank: number;
  overallRank: number;
  battlesWon: number;
  battlesLost: number;
  planetsConquered: number;
  resourcesGathered: number;
  shipsBuilt: number;
  technologiesResearched: number;
}

// Achievement System
export interface Achievement {
  id: string;
  name: string;
  rank: Rank;
  tier: number;
  description: string;
  requirement: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  rewards: AchievementReward[];
}

// Achievement Rewards
export interface AchievementReward {
  type: 'resource' | 'item' | 'title' | 'stat' | 'unlock';
  value: string | number;
  amount?: number;
}

// Unlocked Titles
export interface UnlockedTitle {
  title: PlayerTitle;
  unlockedAt: Date;
  active: boolean;
  bonuses: TitleBonus[];
}

// Title Bonuses
export interface TitleBonus {
  stat: keyof CompleteStats | 'production' | 'research' | 'combat';
  value: number;
  type: 'flat' | 'percentage';
}

// Building Attributes
export interface BuildingAttributes {
  id: string;
  name: string;
  type: string;
  tier: BuildingTier;
  level: number;
  maxLevel: number;
  rank: Rank;
  stats: BuildingStats;
  production: ResourceProduction;
  bonuses: BuildingBonus[];
  requirements: BuildingRequirements;
}

// Building Stats
export interface BuildingStats {
  health: number;
  defense: number;
  capacity: number;
  efficiency: number;
  powerConsumption: number;
  maintenanceCost: number;
}

// Resource Production
export interface ResourceProduction {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
  darkMatter: number;
  imperial_credits?: number; // Imperial Galactic Credits income
  republic_credits?: number; // Galactic Republic Credits income
}

// Building Bonuses
export interface BuildingBonus {
  type: 'production' | 'capacity' | 'efficiency' | 'defense' | 'research';
  value: number;
  scope: 'local' | 'planet' | 'system' | 'empire';
}

// Building Requirements
export interface BuildingRequirements {
  level?: number;
  technologies?: string[];
  buildings?: Record<string, number>;
  resources: Record<string, number>;
}

// Technology Attributes
export interface TechnologyAttributes {
  id: string;
  name: string;
  tier: TechnologyTier;
  level: number;
  maxLevel: number;
  rank: Rank;
  category: string;
  effects: TechnologyEffect[];
  requirements: TechnologyRequirements;
  researchTime: number;
  researchCost: Record<string, number>;
}

// Technology Effects
export interface TechnologyEffect {
  type: 'stat' | 'unlock' | 'production' | 'combat' | 'special';
  target: string;
  value: number;
  scaling: 'linear' | 'exponential' | 'logarithmic';
}

// Technology Requirements
export interface TechnologyRequirements {
  technologies?: string[];
  buildings?: Record<string, number>;
  researchLab?: number;
}

// Material Attributes
export interface MaterialAttributes {
  id: string;
  name: string;
  type: 'Basic' | 'Advanced' | 'Component' | 'Exotic' | 'Fragment';
  rarity: Rarity;
  tier: number;
  stackable: boolean;
  maxStack: number;
  value: number;
  description: string;
  sources: string[];
  uses: string[];
}

// Rank Multipliers
export const RANK_MULTIPLIERS: Record<Rank, number> = {
  'SSS': 10.0,
  'SS': 7.5,
  'S': 5.0,
  'A': 3.5,
  'B': 2.5,
  'C': 1.8,
  'D': 1.3,
  'E': 1.0
};

// Rarity Multipliers
export const RARITY_MULTIPLIERS: Record<Rarity, number> = {
  'Common': 1.0,
  'Uncommon': 1.5,
  'Rare': 2.5,
  'Epic': 4.0,
  'Legendary': 7.0,
  'Mythic': 12.0,
  'Cosmic': 20.0,
  'Universal': 35.0
};

// Quality Multipliers
export const QUALITY_MULTIPLIERS: Record<Quality, number> = {
  'Poor': 0.7,
  'Normal': 1.0,
  'Superior': 1.3,
  'Excellent': 1.7,
  'Masterwork': 2.2,
  'Perfect': 3.0,
  'Divine': 5.0
};

// Rank Colors
export const RANK_COLORS: Record<Rank, string> = {
  'SSS': '#FF0000',
  'SS': '#FF4500',
  'S': '#FFD700',
  'A': '#9370DB',
  'B': '#4169E1',
  'C': '#32CD32',
  'D': '#808080',
  'E': '#A9A9A9'
};

// Rarity Colors
export const RARITY_COLORS: Record<Rarity, string> = {
  'Common': '#9CA3AF',
  'Uncommon': '#10B981',
  'Rare': '#3B82F6',
  'Epic': '#8B5CF6',
  'Legendary': '#F59E0B',
  'Mythic': '#EF4444',
  'Cosmic': '#EC4899',
  'Universal': '#F97316'
};

// Title Requirements
export const TITLE_REQUIREMENTS: Record<PlayerTitle, { level: number; prestige: number; achievements: number }> = {
  'Novice Explorer': { level: 1, prestige: 0, achievements: 0 },
  'Space Cadet': { level: 5, prestige: 0, achievements: 5 },
  'Stellar Navigator': { level: 10, prestige: 100, achievements: 10 },
  'Fleet Commander': { level: 20, prestige: 500, achievements: 20 },
  'War Hero': { level: 30, prestige: 1500, achievements: 35 },
  'Grand Admiral': { level: 40, prestige: 3500, achievements: 50 },
  'System Lord': { level: 50, prestige: 7500, achievements: 75 },
  'Sector Overlord': { level: 60, prestige: 15000, achievements: 100 },
  'Galactic Conqueror': { level: 70, prestige: 30000, achievements: 150 },
  'Universal Emperor': { level: 80, prestige: 60000, achievements: 200 },
  'Cosmic Sovereign': { level: 90, prestige: 120000, achievements: 300 },
  'Dimensional Master': { level: 100, prestige: 250000, achievements: 500 },
  'Reality Shaper': { level: 120, prestige: 500000, achievements: 750 },
  'Eternal Legend': { level: 150, prestige: 1000000, achievements: 1000 }
};

// Experience Calculation
export function calculateExperienceToNext(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Power Rating Calculation
export function calculatePowerRating(stats: Partial<CompleteStats>, rank: Rank, rarity: Rarity): number {
  const baseStats = (stats.attack || 0) + (stats.defense || 0) + (stats.health || 0) + (stats.speed || 0);
  const secondaryStats = (stats.criticalChance || 0) * 10 + (stats.criticalDamage || 0) * 5 + (stats.evasion || 0) * 8;
  const tertiaryStats = (stats.penetration || 0) * 6 + (stats.resistance || 0) * 6 + (stats.lifesteal || 0) * 7;
  
  const totalStats = baseStats + secondaryStats + tertiaryStats;
  const rankMultiplier = RANK_MULTIPLIERS[rank];
  const rarityMultiplier = RARITY_MULTIPLIERS[rarity];
  
  return Math.floor(totalStats * rankMultiplier * rarityMultiplier);
}

// Stat Scaling by Level
export function scaleStatByLevel(baseStat: number, level: number, rank: Rank): number {
  const rankMultiplier = RANK_MULTIPLIERS[rank];
  const levelMultiplier = 1 + (level - 1) * 0.1;
  return Math.floor(baseStat * levelMultiplier * rankMultiplier);
}

// Get Rank from Power Rating
export function getRankFromPower(power: number): Rank {
  if (power >= 100000) return 'SSS';
  if (power >= 50000) return 'SS';
  if (power >= 25000) return 'S';
  if (power >= 10000) return 'A';
  if (power >= 5000) return 'B';
  if (power >= 2000) return 'C';
  if (power >= 500) return 'D';
  return 'E';
}

// Get Title from Level and Prestige
export function getTitleFromProgress(level: number, prestige: number, achievements: number): PlayerTitle {
  const titles: PlayerTitle[] = [
    'Eternal Legend',
    'Reality Shaper',
    'Dimensional Master',
    'Cosmic Sovereign',
    'Universal Emperor',
    'Galactic Conqueror',
    'Sector Overlord',
    'System Lord',
    'Grand Admiral',
    'War Hero',
    'Fleet Commander',
    'Stellar Navigator',
    'Space Cadet',
    'Novice Explorer'
  ];
  
  for (const title of titles) {
    const req = TITLE_REQUIREMENTS[title];
    if (level >= req.level && prestige >= req.prestige && achievements >= req.achievements) {
      return title;
    }
  }
  
  return 'Novice Explorer';
}

// Planet Size Types (1-9)
export type PlanetSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const PLANET_SIZE_NAMES: Record<PlanetSize, string> = {
  1: 'Tiny',
  2: 'Small',
  3: 'Medium-Small',
  4: 'Medium',
  5: 'Medium-Large',
  6: 'Large',
  7: 'Very Large',
  8: 'Massive',
  9: 'Colossal'
};

export const PLANET_SIZE_MULTIPLIERS: Record<PlanetSize, number> = {
  1: 0.5,
  2: 0.75,
  3: 1.0,
  4: 1.25,
  5: 1.5,
  6: 2.0,
  7: 2.5,
  8: 3.5,
  9: 5.0
};

// Planet Class Types (1-9)
export type PlanetClass = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const PLANET_CLASS_NAMES: Record<PlanetClass, string> = {
  1: 'Barren',
  2: 'Desert',
  3: 'Tundra',
  4: 'Ocean',
  5: 'Terran',
  6: 'Jungle',
  7: 'Volcanic',
  8: 'Gas Giant',
  9: 'Exotic'
};

export const PLANET_CLASS_COLORS: Record<PlanetClass, string> = {
  1: '#8B7355',
  2: '#D4A574',
  3: '#B8D4E8',
  4: '#4A90E2',
  5: '#5FB878',
  6: '#2D5016',
  7: '#FF4500',
  8: '#9B59B6',
  9: '#FF1493'
};

// ============================================================
// PLANET A-Z CLASSIFICATION SYSTEM
// ============================================================

// Planet Class Letters A-Z
export type PlanetClassLetter = 'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'I'|'J'|'K'|'L'|'M'|'N'|'O'|'P'|'Q'|'R'|'S'|'T'|'U'|'V'|'W'|'X'|'Y'|'Z';

export const PLANET_CLASS_LETTER_NAMES: Record<PlanetClassLetter, string> = {
  'A': 'Arid World', 'B': 'Barren World', 'C': 'Continental World', 'D': 'Desert World',
  'E': 'Exotic World', 'F': 'Frozen World', 'G': 'Gas Giant', 'H': 'Hell World',
  'I': 'Ice World', 'J': 'Jungle World', 'K': 'Cavernous World', 'L': 'Lava World',
  'M': 'Marine World', 'N': 'Nebular World', 'O': 'Ocean World', 'P': 'Paradise World',
  'Q': 'Quantum World', 'R': 'Rocky World', 'S': 'Swamp World', 'T': 'Terran World',
  'U': 'Urban World', 'V': 'Volcanic World', 'W': 'Water World', 'X': 'Xenobiological World',
  'Y': 'Crystal World', 'Z': 'Zero-Atmosphere World'
};

export const PLANET_SUB_CLASSES: Record<PlanetClassLetter, string[]> = {
  'A': ['Sandy', 'Rocky-Arid', 'Wind-Swept'],
  'B': ['Metallic', 'Silicate', 'Carbonaceous'],
  'C': ['Temperate', 'Subtropical', 'Mediterranean'],
  'D': ['Dune', 'Scorched', 'Salt-Flat'],
  'E': ['Temporal', 'Dimensional', 'Reality-Warped', 'Dark-Matter'],
  'F': ['Tundra', 'Glacial', 'Permafrost', 'Snowball'],
  'G': ['Hydrogen-Rich', 'Helium-Rich', 'Methane', 'Ammonia', 'Super-Jupiter'],
  'H': ['Magma-Ocean', 'Sulfuric', 'Radiation-Blasted', 'Toxic-Atmosphere'],
  'I': ['Cryogenic', 'Frozen-Ocean', 'Ice-Crystal', 'Slush'],
  'J': ['Tropical', 'Rainforest', 'Fungal', 'Carnivorous'],
  'K': ['Underground-Ocean', 'Crystal-Caverns', 'Lava-Tubes', 'Subterranean'],
  'L': ['Magma-Rivers', 'Volcanic-Plains', 'Obsidian', 'Ash-World'],
  'M': ['Coral', 'Kelp-Forest', 'Shallow-Seas', 'Deep-Trenches'],
  'N': ['Nebula-Born', 'Plasma-Storms', 'Ionized', 'Nebula-Edge'],
  'O': ['Deep-Ocean', 'Hydrothermal', 'Abyssal', 'Pelagic'],
  'P': ['Garden', 'Gaia', 'Eden-Class', 'Sanctuary'],
  'Q': ['Phase-Shifted', 'Probability-Weird', 'Superposition', 'Entangled'],
  'R': ['Basaltic', 'Granitic', 'Metallic-Core', 'Cratered'],
  'S': ['Mangrove', 'Marsh', 'Bog', 'Wetland'],
  'T': ['Temperate', 'Earth-like', 'Standard', 'Prime'],
  'U': ['Ecumenopolis', 'Hive-City', 'Arcologies', 'Industrial-Megaplex'],
  'V': ['Shield-Volcano', 'Caldera', 'Fissure', 'Geothermal'],
  'W': ['Freshwater', 'Saline', 'Steam', 'Submerged'],
  'X': ['Chimeric', 'Bio-Luminescent', 'Sentient-Ecosystem', 'Nanite-Infested'],
  'Y': ['Diamond-Core', 'Crystalline-Structures', 'Gem-Fields', 'Prismatic'],
  'Z': ['Vacuum', 'Airless', 'Exposed-Mantle', 'Stripped']
};

export const PLANET_CLASS_LETTER_COLORS: Record<PlanetClassLetter, string> = {
  'A': '#D4A574', 'B': '#8B7355', 'C': '#5FB878', 'D': '#E8C170',
  'E': '#FF1493', 'F': '#B8D4E8', 'G': '#9B59B6', 'H': '#FF4500',
  'I': '#87CEEB', 'J': '#2D5016', 'K': '#A0522D', 'L': '#FF6347',
  'M': '#20B2AA', 'N': '#7B68EE', 'O': '#4169E1', 'P': '#00FF7F',
  'Q': '#00CED1', 'R': '#A9A9A9', 'S': '#556B2F', 'T': '#32CD32',
  'U': '#C0C0C0', 'V': '#FF8C00', 'W': '#1E90FF', 'X': '#BA55D3',
  'Y': '#E6E6FA', 'Z': '#696969'
};

export const PLANET_CLASS_DESCRIPTIONS: Record<PlanetClassLetter, string> = {
  'A': 'Dry worlds with minimal surface water, harsh but colonizable with proper water management.',
  'B': 'Lifeless rocky worlds with no atmosphere. Rich in minerals, ideal for mining operations.',
  'C': 'Diverse landmasses with moderate oceans. Balanced resources and climate zones.',
  'D': 'Extremely hot worlds dominated by vast sand dunes. Water is scarce but solar energy abundant.',
  'E': 'Worlds that defy conventional physics. Exotic matter and reality distortions make them unpredictable.',
  'F': 'Perpetually frozen worlds. Ice sheets hide rich deposits of crystals and deuterium.',
  'G': 'Massive gaseous planets. Atmospheric mining platforms extract valuable gases from orbit.',
  'H': 'Extremely hostile worlds with magma oceans, toxic atmospheres, and lethal radiation.',
  'I': 'Frozen worlds with thick ice and subsurface oceans. Rich in deuterium.',
  'J': 'Dense vegetation covers every landmass. Incredible biodiversity with unique biological resources.',
  'K': 'Worlds honeycombed with vast underground cave networks providing natural protection.',
  'L': 'Seismic activity dominates. Rivers of molten rock make surface operations extremely hazardous.',
  'M': 'Shallow seas and archipelagos. Abundant marine life and moderate climate.',
  'N': 'Worlds located within nebula formations. Ionized atmospheres enable unique energy harvesting.',
  'O': 'Planets completely covered by deep oceans. Floating cities extract resources from the depths.',
  'P': 'Perfect worlds with ideal conditions. The most coveted planets in the galaxy.',
  'Q': 'Worlds in quantum superposition. Resources exist in multiple states simultaneously.',
  'R': 'Solid rock worlds with minimal atmospheres. Reliable mining outposts and military bases.',
  'S': 'Wetlands and marshes dominate. Rich in organic compounds but challenging terrain.',
  'T': 'Earth-like worlds with balanced ecosystems. The gold standard for colonization.',
  'U': 'Planets covered by city structures. Hubs of trade, culture, and manufacturing.',
  'V': 'Geologically active worlds dominated by volcanoes. Abundant geothermal energy.',
  'W': 'Water-dominated worlds. Freshwater lakes to saline seas, vital sources of life.',
  'X': 'Alien ecosystems unlike anything known. Revolutionary research opportunities and dangers.',
  'Y': 'Planets rich in crystalline structures. Crystals possess unique energy properties.',
  'Z': 'Worlds with no atmosphere. The void of space touches the surface directly.'
};

export type PlanetCategory = 'Terrestrial' | 'Gas Giant' | 'Ice World' | 'Lava World' | 'Exotic' | 'Artificial';

export const PLANET_CATEGORIES: PlanetCategory[] = ['Terrestrial', 'Gas Giant', 'Ice World', 'Lava World', 'Exotic', 'Artificial'];

export const PLANET_SUB_CATEGORIES: Record<PlanetCategory, string[]> = {
  'Terrestrial': ['Rocky', 'Continental', 'Oceanic', 'Desert', 'Jungle', 'Swamp', 'Arid', 'Prairie'],
  'Gas Giant': ['Hydrogen Giant', 'Helium Giant', 'Ice Giant', 'Hot Jupiter', 'Brown Dwarf'],
  'Ice World': ['Cryogenic', 'Subsurface Ocean', 'Ice Sheet', 'Glacial', 'Snowball'],
  'Lava World': ['Magma Ocean', 'Volcanic', 'Sulfuric', 'Obsidian', 'Geothermal'],
  'Exotic': ['Quantum', 'Xenobiological', 'Crystalline', 'Dimensional', 'Temporal', 'Dark Matter', 'Nebular'],
  'Artificial': ['Ringworld', 'Dyson Shell', 'Orbital Habitat', 'Megastructure', 'Relic World']
};

export type HabitabilityRating = 'Deadly' | 'Hostile' | 'Harsh' | 'Challenging' | 'Moderate' | 'Comfortable' | 'Ideal' | 'Paradise';

export const HABITABILITY_THRESHOLDS: { min: number; rating: HabitabilityRating }[] = [
  { min: 0, rating: 'Deadly' }, { min: 10, rating: 'Hostile' }, { min: 25, rating: 'Harsh' },
  { min: 40, rating: 'Challenging' }, { min: 55, rating: 'Moderate' }, { min: 70, rating: 'Comfortable' },
  { min: 85, rating: 'Ideal' }, { min: 95, rating: 'Paradise' }
];

// ============================================================
// MOON A-Z CLASSIFICATION SYSTEM
// ============================================================

export type MoonSizeNumeric = 1 | 2 | 3 | 4 | 5 | 6;

export const MOON_SIZE_NAMES: Record<MoonSizeNumeric, string> = {
  1: 'Dwarf', 2: 'Small', 3: 'Medium', 4: 'Large', 5: 'Massive', 6: 'Planetoid'
};

export const MOON_SIZE_MULTIPLIERS: Record<MoonSizeNumeric, number> = {
  1: 0.4, 2: 0.65, 3: 1.0, 4: 1.5, 5: 2.2, 6: 3.5
};

export type MoonClassLetter = 'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'I'|'J'|'K'|'L'|'M'|'N'|'O'|'P'|'Q'|'R'|'S'|'T'|'U'|'V'|'W'|'X'|'Y'|'Z';

export const MOON_CLASS_NAMES: Record<MoonClassLetter, string> = {
  'A': 'Anomalous Moon', 'B': 'Barren Moon', 'C': 'Cratered Moon', 'D': 'Dust Moon',
  'E': 'Exotic Moon', 'F': 'Frozen Moon', 'G': 'Geologically Active', 'H': 'Hollow Moon',
  'I': 'Ice Moon', 'J': 'Jungle Moon', 'K': 'Cavernous Moon', 'L': 'Lava Moon',
  'M': 'Metallic Moon', 'N': 'Nitrogen Moon', 'O': 'Ocean Moon', 'P': 'Primordial Moon',
  'Q': 'Quantum Moon', 'R': 'Rocky Moon', 'S': 'Sulfur Moon', 'T': 'Tidal-Locked Moon',
  'U': 'Underground Ocean Moon', 'V': 'Volcanic Moon', 'W': 'Water-Ice Moon',
  'X': 'Xenobiological Moon', 'Y': 'Crystal Moon', 'Z': 'Zero-Gravity Moon'
};

export const MOON_SUB_CLASSES: Record<MoonClassLetter, string[]> = {
  'A': ['Gravitational-Anomaly', 'Magnetic-Weird', 'Temporal-Distortion'],
  'B': ['Silicate', 'Metallic-Deposit', 'Carbonaceous'],
  'C': ['Ancient-Impact', 'Basin-Dominated', 'Crater-Lake'],
  'D': ['Regolith', 'Fine-Dust', 'Electrostatic'],
  'E': ['Phase-Shifted', 'Dimensional-Rift', 'Dark-Matter-Core'],
  'F': ['Permafrost', 'Nitrogen-Ice', 'Cryo-Volcanic'],
  'G': ['Plate-Tectonics', 'Cryovolcanic', 'Seismic'],
  'H': ['Lava-Tube-Network', 'Geode-Interior', 'Artificial-Hollow'],
  'I': ['Frozen-Ocean', 'Ice-Crust', 'Slush-Mantle'],
  'J': ['Tropical-Microclimate', 'Fungal-Forest', 'Canopy-World'],
  'K': ['Crystal-Caverns', 'Underground-Seas', 'Magma-Chambers'],
  'L': ['Magma-Rivers', 'Volcanic-Plains', 'Obsidian-Crust'],
  'M': ['Iron-Rich', 'Platinum-Group', 'Heavy-Metal'],
  'N': ['Nitrogen-Seas', 'Ammonia-Ice', 'Tholin-Covered'],
  'O': ['Subsurface-Ocean', 'Hydrothermal-Vents', 'Deep-Trench'],
  'P': ['Organic-Rich', 'Amino-Acid-Seas', 'Prebiotic'],
  'Q': ['Superposition', 'Entangled-Surface', 'Probability-Wave'],
  'R': ['Basaltic', 'Granitic', 'Breccia'],
  'S': ['Sulfur-Seas', 'Volcanic-Sulfur', 'Acidic'],
  'T': ['Permanently-Dark', 'Permanently-Lit', 'Terminator-Zone'],
  'U': ['Deep-Ocean', 'Ice-Ceiling', 'Hydrothermal-Ecosystem'],
  'V': ['Active-Eruptions', 'Lava-Lakes', 'Pyroclastic'],
  'W': ['Ice-Shell', 'Liquid-Interior', 'Cryo-Geyser'],
  'X': ['Alien-Microbes', 'Exotic-Flora', 'Sentient-Spores'],
  'Y': ['Diamond-Mantle', 'Quartz-Deposits', 'Gem-Geodes'],
  'Z': ['Microgravity', 'Captured-Asteroid', 'Debris-Field']
};

export type MoonCategory = 'Natural Satellite' | 'Captured Asteroid' | 'Binary Companion' | 'Artificial' | 'Exotic';

export const MOON_SUB_CATEGORIES: Record<MoonCategory, string[]> = {
  'Natural Satellite': ['Inner Moon', 'Outer Moon', 'Irregular Moon', 'Regular Moon', 'Shepherd Moon'],
  'Captured Asteroid': ['C-Type', 'S-Type', 'M-Type', 'Trojan', 'Centaur'],
  'Binary Companion': ['Co-Orbital', 'Contact Binary', 'Orbital Dance', 'Mass-Exchange'],
  'Artificial': ['Orbital Platform', 'Death Star Type', 'Generation Ship', 'Ancient Construct'],
  'Exotic': ['Quantum-Entangled', 'Phase-Shifted', 'Dimensional-Anchored', 'Temporal-Loop']
};

// ============================================================
// STARBASE A-Z CLASSIFICATION SYSTEM
// ============================================================

export type StarbaseClassLetter = 'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'I'|'J'|'K'|'L'|'M'|'N'|'O'|'P'|'Q'|'R'|'S'|'T'|'U'|'V'|'W'|'X'|'Y'|'Z';

export const STARBASE_CLASS_NAMES: Record<StarbaseClassLetter, string> = {
  'A': 'Anchorage', 'B': 'Battle Station', 'C': 'Citadel', 'D': 'Defense Platform',
  'E': 'Economic Hub', 'F': 'Fortress', 'G': 'Gateway Station', 'H': 'Hyperspace Relay',
  'I': 'Industrial Complex', 'J': 'Junction Station', 'K': 'Command Center', 'L': 'Logistics Depot',
  'M': 'Military Base', 'N': 'Nexus', 'O': 'Outpost', 'P': 'Production Center',
  'Q': 'Quantum Relay', 'R': 'Research Station', 'S': 'Shipyard', 'T': 'Trade Hub',
  'U': 'University Station', 'V': 'Void Citadel', 'W': 'Warp Gate', 'X': 'Experimental Base',
  'Y': 'Construction Yard', 'Z': 'Zenith Platform'
};

export const STARBASE_SUB_CLASSES: Record<StarbaseClassLetter, string[]> = {
  'A': ['Deep-Space', 'Planetary-Orbit', 'Asteroid-Belt', 'Nebula'],
  'B': ['Heavy-Weapons', 'Missile-Platform', 'Beam-Array', 'Point-Defense'],
  'C': ['Capital', 'Sector', 'Border', 'Core'],
  'D': ['Orbital', 'Lagrange-Point', 'Moon-Based', 'Asteroid-Mounted'],
  'E': ['Trade-Exchange', 'Banking-Hub', 'Market-Center', 'Insurance-Hub'],
  'F': ['Impregnable', 'Shield-Bastion', 'Armored', 'Layered-Defense'],
  'G': ['Warp-Gate', 'Jump-Gate', 'Star-Gate', 'Dimensional-Portal'],
  'H': ['Communications', 'Navigation-Beacon', 'Sensor-Array', 'Data-Relay'],
  'I': ['Manufacturing', 'Processing', 'Assembly-Line', 'Refinery'],
  'J': ['Crossroads', 'Transit-Hub', 'Waystation', 'Terminal'],
  'K': ['Fleet-Command', 'Sector-HQ', 'War-Room', 'Strategic'],
  'L': ['Supply-Depot', 'Fuel-Depot', 'Ammunition-Dump', 'Repair-Bay'],
  'M': ['Training-Facility', 'Barracks', 'Armory', 'Deployment-Center'],
  'N': ['Galactic-Nexus', 'Sector-Nexus', 'System-Nexus', 'Trade-Nexus'],
  'O': ['Frontier', 'Listening-Post', 'Observation', 'Scout-Base'],
  'P': ['Automated-Factory', 'Mass-Production', 'Custom-Workshop', 'Prototype-Lab'],
  'Q': ['Entangled-Relay', 'Quantum-Computer', 'Probability-Engine', 'Superposition-Node'],
  'R': ['Physics-Lab', 'Biology-Lab', 'Engineering-Lab', 'Xeno-Studies'],
  'S': ['Capital-Shipyard', 'Fighter-Factory', 'Civilian-Drydock', 'Repair-Yard'],
  'T': ['Commodity-Exchange', 'Luxury-Market', 'Black-Market', 'Auction-House'],
  'U': ['Naval-Academy', 'Science-Institute', 'Diplomatic-School', 'Trade-College'],
  'V': ['Deep-Void', 'Dark-Space', 'Intergalactic', 'Abyssal'],
  'W': ['Instant-Transit', 'Mass-Relay', 'Network-Hub', 'Gateway-Nexus'],
  'X': ['Weapons-Testing', 'Technology-Proving', 'Forbidden-Research', 'Dimensional-Lab'],
  'Y': ['Mega-Shipyard', 'Infrastructure-Builder', 'Orbital-Constructor', 'Assembly-Yard'],
  'Z': ['Supreme-Command', 'Imperial-Throne', 'Ultimate-Fortress', 'Endgame']
};

export type StarbaseCategory = 'Orbital Station' | 'Deep Space Station' | 'Military Installation' | 'Trade Post' | 'Research Facility' | 'Production Center';

export const STARBASE_SUB_CATEGORIES: Record<StarbaseCategory, string[]> = {
  'Orbital Station': ['Low Orbit', 'Geosynchronous', 'Polar Orbit', 'Lagrange Point'],
  'Deep Space Station': ['Interstellar', 'Nebula-Bound', 'Void', 'Rogue-Planet'],
  'Military Installation': ['Forward Base', 'Defensive Perimeter', 'Fleet Anchorage', 'Training Academy'],
  'Trade Post': ['Free Port', 'Customs Station', 'Market Hub', 'Banking Center'],
  'Research Facility': ['Observatory', 'Laboratory Complex', 'Prototype Center', 'Think Tank'],
  'Production Center': ['Shipyard Complex', 'Manufacturing Hub', 'Refinery Station', 'Assembly Plant']
};

// ============================================================
// BUILDING & UPGRADE SYSTEM
// ============================================================

export type BuildingCategory = 'Production' | 'Energy' | 'Infrastructure' | 'Defense' | 'Research' | 'Storage' | 'Special';

export interface BuildingDefinition {
  id: string;
  name: string;
  category: BuildingCategory;
  description: string;
  maxLevel: number;
  baseCost: ResourceCost;
  costMultiplier: number;
  baseProduction?: Partial<ResourceProduction>;
  baseBonus?: Record<string, number>;
  requirements?: { buildingId: string; level: number }[];
  applicableTo: ('planet' | 'moon' | 'starbase')[];
  icon: string;
}

export interface BuildingInstance {
  buildingId: string;
  level: number;
  constructionProgress?: number;
  constructionTotal?: number;
  isUpgrading: boolean;
}

export type UpgradeTier = 'Basic' | 'Advanced' | 'Superior' | 'Exceptional' | 'Masterwork' | 'Legendary' | 'Mythic';

export const UPGRADE_TIER_MULTIPLIERS: Record<UpgradeTier, number> = {
  'Basic': 1.0, 'Advanced': 1.5, 'Superior': 2.2, 'Exceptional': 3.0,
  'Masterwork': 4.0, 'Legendary': 6.0, 'Mythic': 10.0
};

export interface UpgradeDefinition {
  id: string;
  name: string;
  tier: UpgradeTier;
  description: string;
  effects: UpgradeEffect[];
  cost: ResourceCost;
  requirements?: { upgradeId?: string; buildingId?: string; level?: number }[];
  applicableTo: ('planet' | 'moon' | 'starbase')[];
  icon: string;
}

export interface UpgradeEffect {
  type: 'production' | 'capacity' | 'defense' | 'research' | 'trade' | 'habitability' | 'population' | 'storage' | 'special';
  target?: string;
  value: number;
  isPercentage: boolean;
}

// ============================================================
// CLASSIFICATION HELPERS
// ============================================================

export function getPlanetClassNameByLetter(letter: PlanetClassLetter): string {
  return PLANET_CLASS_LETTER_NAMES[letter];
}

export function getPlanetClassColorByLetter(letter: PlanetClassLetter): string {
  return PLANET_CLASS_LETTER_COLORS[letter];
}

export function getPlanetClassDescriptionByLetter(letter: PlanetClassLetter): string {
  return PLANET_CLASS_DESCRIPTIONS[letter];
}

export function getMoonClassNameByLetter(letter: MoonClassLetter): string {
  return MOON_CLASS_NAMES[letter];
}

export function getStarbaseClassNameByLetter(letter: StarbaseClassLetter): string {
  return STARBASE_CLASS_NAMES[letter];
}

export function getHabitabilityRating(score: number): HabitabilityRating {
  for (let i = HABITABILITY_THRESHOLDS.length - 1; i >= 0; i--) {
    if (score >= HABITABILITY_THRESHOLDS[i].min) return HABITABILITY_THRESHOLDS[i].rating;
  }
  return 'Deadly';
}

// Moon Types (keep old for backward compat)
export type MoonSize = 'Small' | 'Medium' | 'Large' | 'Massive';

export interface Moon {
  id: string;
  name: string;
  size: MoonSizeNumeric;
  sizeText: MoonSize;
  class: MoonClassLetter;
  subClass?: string;
  category: MoonCategory;
  subCategory?: string;
  type: 'Rocky' | 'Ice' | 'Volcanic' | 'Metallic' | 'Exotic';
  atmosphere?: string;
  gravity: number;
  habitability: number;
  resourceRichness: number;
  resources: {
    metal: number;
    crystal: number;
    deuterium: number;
    darkMatter?: number;
  };
  hasBase: boolean;
  baseLevel?: number;
  upgradeLevel: number;
  buildings?: Record<string, BuildingInstance>;
  description: string;
  lore: string;
  info?: string;
  specialFeatures: string[];
  defenseBonus: number;
  storageBonus: number;
  productionBonus: number;
}

// Starbase Types
export type StarbaseClass = 'Outpost' | 'Station' | 'Citadel' | 'Fortress' | 'Nexus';

export interface Starbase {
  id: string;
  name: string;
  class: StarbaseClassLetter;
  classText: StarbaseClass;
  subClass?: string;
  category: StarbaseCategory;
  subCategory?: string;
  level: number;
  maxLevel: number;
  upgradeLevel: number;
  buildings?: Record<string, BuildingInstance>;
  rank: Rank;
  rarity: Rarity;
  health: number;
  maxHealth: number;
  shield: number;
  maxShield: number;
  armor: number;
  weapons: {
    type: string;
    damage: number;
    range: number;
    cooldown: number;
  }[];
  defenseModules: {
    type: string;
    bonus: number;
  }[];
  dockingBays: number;
  storageCapacity: number;
  productionBonus: number;
  researchBonus: number;
  tradeBonus: number;
  description: string;
  lore: string;
  info?: string;
  specialAbilities: string[];
  maintenanceCost: ResourceCost;
  buildCost: ResourceCost;
  buildTime: number;
}

// Moonbase Types
export interface Moonbase {
  id: string;
  name: string;
  moonId: string;
  level: number;
  maxLevel: number;
  upgradeLevel: number;
  buildings?: Record<string, BuildingInstance>;
  facilities: {
    miningStation: number;
    researchLab: number;
    defenseGrid: number;
    storageDepot: number;
    launchPad: number;
  };
  garrison: {
    ships: number;
    defenses: number;
  };
  production: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  description: string;
  lore: string;
  info?: string;
  specialFeatures: string[];
  upgradeCost: ResourceCost;
}

// Mothership Types (Enhanced)
export interface Mothership {
  id: string;
  name: string;
  class: 'Carrier' | 'Command' | 'Titan' | 'Leviathan' | 'Eternal';
  level: number;
  maxLevel: number;
  rank: Rank;
  rarity: Rarity;
  stats: ShipStats;
  hangarCapacity: number;
  commandBonus: number;
  fleetCapacityBonus: number;
  abilities: {
    name: string;
    description: string;
    cooldown: number;
    effect: string;
  }[];
  modules: {
    weapons: number;
    shields: number;
    engines: number;
    special: number;
  };
  crew: number;
  description: string;
  lore: string;
  specialFeatures: string[];
  buildCost: ResourceCost;
  buildTime: number;
  maintenanceCost: ResourceCost;
}

// Megastructure Types
export type MegastructureType = 
  | 'Dyson Sphere'
  | 'Ring World'
  | 'Orbital Habitat'
  | 'Space Elevator'
  | 'Stellar Engine'
  | 'Matrioshka Brain'
  | 'Alderson Disk'
  | 'Shkadov Thruster'
  | 'Nicoll-Dyson Beam'
  | 'Star Lifter';

export interface Megastructure {
  id: string;
  name: string;
  type: MegastructureType;
  tier: number;
  maxTier: number;
  rank: Rank;
  rarity: Rarity;
  constructionProgress: number;
  isComplete: boolean;
  effects: {
    energyProduction?: number;
    researchBonus?: number;
    populationCapacity?: number;
    productionBonus?: number;
    defenseBonus?: number;
    specialEffect?: string;
  };
  requirements: {
    technologies: string[];
    resources: ResourceCost;
    time: number;
    planetClass?: PlanetClass[];
  };
  description: string;
  lore: string;
  benefits: string[];
  constructionStages: {
    stage: number;
    name: string;
    progress: number;
    requirements: ResourceCost;
  }[];
  maintenanceCost: ResourceCost;
  powerRating: number;
}

// Planet Interface (Enhanced)
export interface Planet {
  id: string;
  name: string;
  size: PlanetSize;
  class: PlanetClassLetter;
  subClass?: string;
  category: PlanetCategory;
  subCategory?: string;
  atmosphere: string;
  gravity: number;
  habitability: number;
  resourceRichness: number;
  position: {
    galaxy: number;
    system: number;
    planet: number;
  };
  owner?: string;
  population: number;
  maxPopulation: number;
  temperature: number;
  resources: {
    metal: number;
    crystal: number;
    deuterium: number;
    darkMatter?: number;
  };
  production: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  upgradeLevel: number;
  buildings: Record<string, BuildingInstance>;
  legacyBuildings: {
    [key: string]: number;
  };
  moons: Moon[];
  hasStarbase: boolean;
  starbase?: Starbase;
  megastructures: Megastructure[];
  description: string;
  lore: string;
  info?: string;
  specialFeatures: string[];
  discoveredAt?: Date;
  colonizedAt?: Date;
}

// Resource Cost Interface
export interface ResourceCost {
  metal?: number;
  crystal?: number;
  deuterium?: number;
  energy?: number;
  darkMatter?: number;
  imperial_credits?: number; // Imperial Galactic Credits cost
  republic_credits?: number; // Galactic Republic Credits cost
}

// Currency Transaction Types
export type CurrencyTransactionType = 
  | 'mission_reward'
  | 'bounty'
  | 'trade'
  | 'market_sale'
  | 'market_purchase'
  | 'contract'
  | 'insurance'
  | 'tax'
  | 'fee'
  | 'donation'
  | 'alliance_payment'
  | 'blueprint_sale'
  | 'salvage'
  | 'mining'
  | 'manufacturing'
  | 'research'
  | 'planetary_interaction'
  | 'exploration'
  | 'pvp_loot'
  | 'npc_loot'
  | 'quest_reward'
  | 'achievement_reward'
  | 'daily_reward'
  | 'season_pass_reward'
  | 'store_purchase'
  | 'refund'
  | 'penalty'
  | 'maintenance'
  | 'currency_exchange'; // Exchange between Imperial and Republic credits

// Currency Transaction Interface
export interface CurrencyTransaction {
  id: string;
  userId: string;
  type: CurrencyTransactionType;
  currencyType: 'imperial' | 'republic';
  amount: number; // Positive for income, negative for expense
  balance: number; // Balance after transaction
  description: string;
  metadata?: {
    itemId?: string;
    itemName?: string;
    quantity?: number;
    targetUserId?: string;
    targetUserName?: string;
    locationId?: string;
    locationName?: string;
    exchangeRate?: number; // For currency exchange
    [key: string]: any;
  };
  timestamp: Date;
}

// Currency Wallet Interface
export interface CurrencyWallet {
  userId: string;
  imperialBalance: number;
  republicBalance: number;
  totalImperialEarned: number;
  totalRepublicEarned: number;
  totalImperialSpent: number;
  totalRepublicSpent: number;
  transactions: CurrencyTransaction[];
  dailyImperialIncome: number;
  dailyRepublicIncome: number;
  weeklyImperialIncome: number;
  weeklyRepublicIncome: number;
  monthlyImperialIncome: number;
  monthlyRepublicIncome: number;
}

// Market Order Interface
export interface MarketOrder {
  id: string;
  userId: string;
  userName: string;
  itemId: string;
  itemName: string;
  itemType: ItemType;
  orderType: 'buy' | 'sell';
  quantity: number;
  remainingQuantity: number;
  pricePerUnit: number; // In Imperial or Republic Credits
  currencyType: 'imperial' | 'republic';
  totalValue: number;
  minVolume: number;
  duration: number; // Days
  expiresAt: Date;
  locationId: string;
  locationName: string;
  range: 'station' | 'system' | 'region' | 'universe';
  status: 'active' | 'fulfilled' | 'cancelled' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

// Contract Interface
export interface Contract {
  id: string;
  issuerId: string;
  issuerName: string;
  acceptorId?: string;
  acceptorName?: string;
  type: 'item_exchange' | 'courier' | 'auction' | 'loan';
  status: 'outstanding' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
  title: string;
  description: string;
  reward: number; // Credits
  rewardCurrency: 'imperial' | 'republic';
  collateral?: number; // Credits
  collateralCurrency?: 'imperial' | 'republic';
  price?: number; // Credits for item exchange
  priceCurrency?: 'imperial' | 'republic';
  items: {
    itemId: string;
    itemName: string;
    quantity: number;
    included: boolean; // true if included in contract, false if requested
  }[];
  startLocation?: string;
  endLocation?: string;
  volume?: number;
  duration: number; // Days
  expiresAt: Date;
  completedAt?: Date;
  createdAt: Date;
}

// Bounty System Interface
export interface Bounty {
  id: string;
  targetId: string;
  targetName: string;
  targetType: 'player' | 'alliance' | 'corporation' | 'npc';
  amount: number; // Credits
  currencyType: 'imperial' | 'republic';
  placedBy: string;
  placedByName: string;
  reason?: string;
  status: 'active' | 'claimed' | 'expired';
  claimedBy?: string;
  claimedByName?: string;
  claimedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
}

// Insurance Policy Interface
export interface InsurancePolicy {
  id: string;
  userId: string;
  shipId: string;
  shipName: string;
  shipClass: ShipClass;
  shipValue: number; // Credits
  valueCurrency: 'imperial' | 'republic';
  premiumPaid: number; // Credits
  premiumCurrency: 'imperial' | 'republic';
  coveragePercentage: number; // 0-100
  payoutAmount: number; // Credits
  payoutCurrency: 'imperial' | 'republic';
  duration: number; // Days
  expiresAt: Date;
  status: 'active' | 'expired' | 'claimed';
  claimedAt?: Date;
  createdAt: Date;
}

// Currency Income Sources
export const CURRENCY_INCOME_SOURCES = {
  // PvE Activities
  MISSION_REWARD: { imperial: 50000, republic: 25000, multiplier: 1.5 },
  BOUNTY_KILL: { imperial: 10000, republic: 5000, multiplier: 2.0 },
  EXPLORATION_SITE: { imperial: 100000, republic: 50000, multiplier: 1.8 },
  ANOMALY_COMPLETION: { imperial: 75000, republic: 35000, multiplier: 1.6 },
  
  // Trading & Market
  MARKET_TRADE: { imperial: 0, republic: 0, multiplier: 0.05 }, // 5% profit margin
  CONTRACT_COMPLETION: { imperial: 25000, republic: 15000, multiplier: 1.3 },
  COURIER_DELIVERY: { imperial: 15000, republic: 10000, multiplier: 1.2 },
  
  // Production
  MANUFACTURING: { imperial: 0, republic: 0, multiplier: 0.15 }, // 15% profit margin
  RESEARCH: { imperial: 5000, republic: 3000, multiplier: 1.1 },
  INVENTION: { imperial: 50000, republic: 30000, multiplier: 1.4 },
  
  // Mining & Resources
  MINING: { imperial: 5000, republic: 3000, multiplier: 1.0 },
  SALVAGING: { imperial: 8000, republic: 5000, multiplier: 1.2 },
  PLANETARY_INTERACTION: { imperial: 20000, republic: 12000, multiplier: 1.3 },
  
  // Combat
  PVP_KILL: { imperial: 100000, republic: 60000, multiplier: 2.5 },
  PIRATE_KILL: { imperial: 25000, republic: 15000, multiplier: 1.8 },
  BOSS_KILL: { imperial: 500000, republic: 300000, multiplier: 3.0 },
  
  // Passive Income
  DAILY_REWARD: { imperial: 10000, republic: 5000, multiplier: 1.0 },
  ALLIANCE_DIVIDEND: { imperial: 50000, republic: 30000, multiplier: 1.0 },
  STATION_TAXES: { imperial: 5000, republic: 3000, multiplier: 1.0 },
  
  // Special Events
  QUEST_COMPLETION: { imperial: 30000, republic: 18000, multiplier: 1.5 },
  ACHIEVEMENT_UNLOCK: { imperial: 25000, republic: 15000, multiplier: 1.0 },
  SEASONAL_EVENT: { imperial: 100000, republic: 60000, multiplier: 2.0 },
  WORLD_BOSS: { imperial: 1000000, republic: 600000, multiplier: 4.0 }
};

// Currency Expense Categories
export const CURRENCY_EXPENSE_CATEGORIES = {
  // Ship & Equipment
  SHIP_PURCHASE: 'Ship Purchase',
  SHIP_UPGRADE: 'Ship Upgrade',
  EQUIPMENT_PURCHASE: 'Equipment Purchase',
  AMMUNITION: 'Ammunition',
  FUEL: 'Fuel',
  
  // Services
  REPAIR: 'Repair',
  INSURANCE: 'Insurance Premium',
  CLONE_UPGRADE: 'Clone Upgrade',
  SKILL_TRAINING: 'Skill Training',
  
  // Market & Trading
  MARKET_TAX: 'Market Tax',
  BROKER_FEE: 'Broker Fee',
  CONTRACT_COLLATERAL: 'Contract Collateral',
  
  // Construction
  BUILDING_CONSTRUCTION: 'Building Construction',
  BUILDING_UPGRADE: 'Building Upgrade',
  RESEARCH_COST: 'Research Cost',
  MANUFACTURING_COST: 'Manufacturing Cost',
  
  // Alliance & Corporation
  ALLIANCE_FEE: 'Alliance Fee',
  CORPORATION_TAX: 'Corporation Tax',
  DONATION: 'Donation',
  
  // Penalties
  BOUNTY_PAYMENT: 'Bounty Payment',
  FINE: 'Fine',
  PENALTY: 'Penalty',
  
  // Maintenance
  STATION_MAINTENANCE: 'Station Maintenance',
  STRUCTURE_FUEL: 'Structure Fuel',
  UPKEEP: 'Upkeep',
  
  // Currency Exchange
  CURRENCY_EXCHANGE: 'Currency Exchange'
};

// Currency Formatting Helpers
export function formatImperialCredits(amount: number, decimals: number = 2): string {
  if (amount >= 1000000000000) return `${(amount / 1000000000000).toFixed(decimals)}T IGC`;
  if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(decimals)}B IGC`;
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(decimals)}M IGC`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(decimals)}K IGC`;
  return `${amount.toLocaleString()} IGC`;
}

export function formatRepublicCredits(amount: number, decimals: number = 2): string {
  if (amount >= 1000000000000) return `${(amount / 1000000000000).toFixed(decimals)}T GRC`;
  if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(decimals)}B GRC`;
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(decimals)}M GRC`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(decimals)}K GRC`;
  return `${amount.toLocaleString()} GRC`;
}

// Calculate Credits from activity
export function calculateCurrencyReward(
  activityType: keyof typeof CURRENCY_INCOME_SOURCES,
  currencyType: 'imperial' | 'republic',
  level: number,
  rank: Rank,
  bonusMultiplier: number = 1.0
): number {
  const source = CURRENCY_INCOME_SOURCES[activityType];
  const baseAmount = currencyType === 'imperial' ? source.imperial : source.republic;
  const rankMultiplier = RANK_MULTIPLIERS[rank];
  const levelMultiplier = 1 + (level * 0.1);
  
  return Math.floor(
    baseAmount * 
    source.multiplier * 
    levelMultiplier * 
    rankMultiplier * 
    bonusMultiplier
  );
}

// Currency Exchange Rate (Imperial to Republic)
export const CURRENCY_EXCHANGE_RATE = {
  IMPERIAL_TO_REPUBLIC: 0.6, // 1 IGC = 0.6 GRC
  REPUBLIC_TO_IMPERIAL: 1.5, // 1 GRC = 1.5 IGC
  EXCHANGE_FEE: 0.02 // 2% exchange fee
};

// Exchange Currency Function
export function exchangeCurrency(
  amount: number,
  fromCurrency: 'imperial' | 'republic',
  toCurrency: 'imperial' | 'republic'
): { convertedAmount: number; fee: number; total: number } {
  if (fromCurrency === toCurrency) {
    return { convertedAmount: amount, fee: 0, total: amount };
  }
  
  const rate = fromCurrency === 'imperial' 
    ? CURRENCY_EXCHANGE_RATE.IMPERIAL_TO_REPUBLIC 
    : CURRENCY_EXCHANGE_RATE.REPUBLIC_TO_IMPERIAL;
  
  const convertedAmount = Math.floor(amount * rate);
  const fee = Math.floor(convertedAmount * CURRENCY_EXCHANGE_RATE.EXCHANGE_FEE);
  const total = convertedAmount - fee;
  
  return { convertedAmount, fee, total };
}

// ============================================================
// COSMIC HIERARCHY — UNIVERSE / GALAXY / QUADRANT / SECTOR / SYSTEM
// ============================================================

// Quadrant Types (9 main types, each with sub-types)
export type QuadrantType =
  | 'Inner Core'
  | 'Outer Core'
  | 'Spiral Arm'
  | 'Galactic Bar'
  | 'Halo'
  | 'Dark Matter Halo'
  | 'Satellite Region'
  | 'Intergalactic Void'
  | 'Galactic Bulge';

export const QUADRANT_TYPE_DEFINITIONS: Record<QuadrantType, {
  subTypes: string[];
  description: string;
  starDensity: 'Low' | 'Medium' | 'High' | 'Extreme';
  color: string;
  rarity: number;
}> = {
  'Inner Core': {
    subTypes: ['Supermassive Zone', 'Stellar Nursery', 'Gravitational Well', 'High-Radiation Zone', 'Ancient Core'],
    description: 'The dense inner region surrounding the supermassive black hole. Extreme star density and ancient civilizations.',
    starDensity: 'Extreme',
    color: '#FFD700',
    rarity: 0.05
  },
  'Outer Core': {
    subTypes: ['Metropolitan Zone', 'Trade Nexus', 'Industrial Belt', 'Administrative Sector', 'Cultural Hub'],
    description: 'Densely populated region with established trade routes and powerful empires. The heart of galactic civilization.',
    starDensity: 'High',
    color: '#F59E0B',
    rarity: 0.10
  },
  'Spiral Arm': {
    subTypes: ['Trailing Arm', 'Leading Arm', 'Arm Gap', 'Arm Bridge', 'Arm Spur'],
    description: 'The majestic spiral arms rich in young stars and resources. Frontier territories ripe for expansion.',
    starDensity: 'Medium',
    color: '#4ADE80',
    rarity: 0.30
  },
  'Galactic Bar': {
    subTypes: ['Central Bar', 'Bar-End Region', 'Bar-Orbit Resonance', 'Nuclear Ring', 'Inner Lindblad'],
    description: 'The elongated stellar bar structure. Unique orbital mechanics create rare resource configurations.',
    starDensity: 'High',
    color: '#FB923C',
    rarity: 0.10
  },
  'Halo': {
    subTypes: ['Inner Halo', 'Outer Halo', 'Globular Cluster', 'Stellar Stream', 'Tidal Debris'],
    description: 'Ancient stars orbiting in the galactic halo. Home to globular clusters and primordial artifacts.',
    starDensity: 'Low',
    color: '#A78BFA',
    rarity: 0.15
  },
  'Dark Matter Halo': {
    subTypes: ['Dense Dark Zone', 'Dark Matter Filament', 'Weakly Interacting Zone', 'Gravitational Anomaly', 'Hidden Mass Region'],
    description: 'Invisible dark matter structures. Exotic physics enable unique technologies unavailable elsewhere.',
    starDensity: 'Low',
    color: '#7C3AED',
    rarity: 0.08
  },
  'Satellite Region': {
    subTypes: ['Magellanic-Type', 'Dwarf Satellite', 'Tidal Dwarf', 'Ultra-Faint Dwarf', 'Compact Elliptical'],
    description: 'Small satellite galaxies and star clusters orbiting the main galaxy. Independent ecosystems with unique species.',
    starDensity: 'Low',
    color: '#38BDF8',
    rarity: 0.12
  },
  'Intergalactic Void': {
    subTypes: ['Deep Void', 'Void Bridge', 'Isolated Pocket', 'Cosmic Web Node', 'Filament Edge'],
    description: 'The vast empty spaces between galaxies. Dark matter concentration points and rogue star clusters.',
    starDensity: 'Low',
    color: '#1E1B4B',
    rarity: 0.05
  },
  'Galactic Bulge': {
    subTypes: ['Nuclear Bulge', 'Classical Bulge', 'Pseudobulge', 'Barlens', 'Boxy Bulge'],
    description: 'The central spheroidal component of the galaxy. Dense with ancient stars and immense political power.',
    starDensity: 'Extreme',
    color: '#EF4444',
    rarity: 0.05
  }
};

// Galaxy Class Letters A-Z
export type GalaxyClassLetter = 'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'I'|'J'|'K'|'L'|'M'|'N'|'O'|'P'|'Q'|'R'|'S'|'T'|'U'|'V'|'W'|'X'|'Y'|'Z';

export const GALAXY_CLASS_NAMES: Record<GalaxyClassLetter, string> = {
  'A': 'Active Galaxy', 'B': 'Barred Spiral', 'C': 'Compact Elliptical', 'D': 'Dwarf Galaxy',
  'E': 'Elliptical Galaxy', 'F': 'Flocculent Spiral', 'G': 'Grand Design Spiral', 'H': 'Hyper-Luminous',
  'I': 'Irregular Galaxy', 'J': 'Jet-Emitting Galaxy', 'K': 'Quark-Nova Remnant', 'L': 'Lenticular Galaxy',
  'M': 'Magellanic Spiral', 'N': 'Nebula-Rich Galaxy', 'O': 'Obscured Galaxy', 'P': 'Polar Ring Galaxy',
  'Q': 'Quasar Host Galaxy', 'R': 'Ring Galaxy', 'S': 'Spiral Galaxy', 'T': 'Tidal Distorted',
  'U': 'Ultra-Diffuse Galaxy', 'V': 'Void Galaxy', 'W': 'Wolf-Rayet Galaxy', 'X': 'X-Ray Luminous',
  'Y': 'Young Starburst', 'Z': 'Zwicky Compact'
};

export const GALAXY_SUB_CLASSES: Record<GalaxyClassLetter, string[]> = {
  'A': ['Seyfert', 'Radio-Loud', 'Blazar-Host'],
  'B': ['Long-Bar', 'Short-Bar', 'Ansae-Bar'],
  'C': ['M32-Type', 'M59-Type', 'Ultra-Compact'],
  'D': ['Dwarf Spheroidal', 'Dwarf Irregular', 'Blue Compact Dwarf'],
  'E': ['Giant Elliptical', 'Boxy', 'Disky', 'cD-Type'],
  'F': ['Patchy-Arm', 'Feathery', 'Multi-Arm'],
  'G': ['Two-Arm', 'Multi-Arm', 'Symmetric'],
  'H': ['ULIRG', 'HLIRG', 'ELIRG'],
  'I': ['Sm-Type', 'Im-Type', 'dIrr'],
  'J': ['One-Sided Jet', 'Two-Sided Jet', 'Microquasar'],
  'K': ['Quark-Star Core', 'Strange-Matter', 'Exotic Remnant'],
  'L': ['Barred-Lenticular', 'Unbarred-Lenticular', 'Dusty-Lenticular'],
  'M': ['Single-Arm', 'Asymmetric', 'Transitional'],
  'N': ['Emission Nebula Rich', 'Reflection Nebula Rich', 'Dark Nebula Dominant'],
  'O': ['Dust-Lane', 'Edge-On-Obscured', 'Hidden-Nucleus'],
  'P': ['Orthogonal Ring', 'Inclined Ring', 'Multiple Ring'],
  'Q': ['Radio-Loud Quasar', 'Radio-Quiet Quasar', 'Broad-Absorption-Line'],
  'R': ['Collisional Ring', 'Resonance Ring', 'Polar Ring'],
  'S': ['Sa-Type', 'Sb-Type', 'Sc-Type', 'Sd-Type'],
  'T': ['Merger-Remnant', 'Tidal-Tail', 'Interacting-Pair'],
  'U': ['UDG-Dark', 'UDG-Star-Rich', 'Failed-Galaxy'],
  'V': ['Void-Dwelling', 'Isolated', 'Field-Dominant'],
  'W': ['WR-Star-Burst', 'WR-Rich', 'Nitrogen-Rich'],
  'X': ['X-Ray Binary Rich', 'Hot-Gas-Halo', 'Cooling-Flow'],
  'Y': ['Blue-Compact', 'Green-Pea', 'Lyman-Break'],
  'Z': ['Zwicky-Compact', 'Post-Starburst', 'E+A Galaxy']
};

export type GalaxyType = 'Spiral' | 'Elliptical' | 'Irregular' | 'Lenticular' | 'Dwarf' | 'Ring' | 'Starburst' | 'Active' | 'Ultra-Diffuse';

export const GALAXY_TYPES: GalaxyType[] = ['Spiral', 'Elliptical', 'Irregular', 'Lenticular', 'Dwarf', 'Ring', 'Starburst', 'Active', 'Ultra-Diffuse'];

export type GalaxyCategory = 'Giant Galaxy' | 'Intermediate Galaxy' | 'Dwarf Galaxy' | 'Satellite Galaxy' | 'Field Galaxy' | 'Cluster Galaxy';

export const GALAXY_SUB_CATEGORIES: Record<GalaxyCategory, string[]> = {
  'Giant Galaxy': ['cD-Giant', 'Brightest Cluster', 'Supergiant Elliptical', 'Giant Spiral'],
  'Intermediate Galaxy': ['Standard Spiral', 'Standard Elliptical', 'Standard Lenticular', 'Standard Irregular'],
  'Dwarf Galaxy': ['Dwarf Elliptical', 'Dwarf Spheroidal', 'Blue Compact Dwarf', 'Ultra-Faint Dwarf'],
  'Satellite Galaxy': ['Major Satellite', 'Minor Satellite', 'Tidal Satellite', 'Captured Dwarf'],
  'Field Galaxy': ['Isolated Spiral', 'Void Galaxy', 'Field Elliptical', 'Wandering Galaxy'],
  'Cluster Galaxy': ['Cluster Core', 'Cluster Outskirts', 'Infall Region', 'Backsplash Galaxy']
};

export const GALAXY_CLASS_COLORS: Record<GalaxyClassLetter, string> = {
  'A': '#FF6347', 'B': '#FFD700', 'C': '#87CEEB', 'D': '#98FB98',
  'E': '#DDA0DD', 'F': '#F0E68C', 'G': '#00CED1', 'H': '#FF4500',
  'I': '#DEB887', 'J': '#00FF7F', 'K': '#8B0000', 'L': '#C0C0C0',
  'M': '#4169E1', 'N': '#FF69B4', 'O': '#696969', 'P': '#FF1493',
  'Q': '#7FFF00', 'R': '#FF8C00', 'S': '#32CD32', 'T': '#BA55D3',
  'U': '#B0C4DE', 'V': '#191970', 'W': '#00BFFF', 'X': '#DC143C',
  'Y': '#ADFF2F', 'Z': '#708090'
};

// Sector Types
export type SectorType = 
  | 'Core Sector' | 'Inner Sector' | 'Mid Sector' | 'Outer Sector' | 'Frontier Sector'
  | 'Wild Space' | 'Nebula Sector' | 'Void Sector' | 'Anomalous Sector';

export const SECTOR_TYPE_DEFINITIONS: Record<SectorType, {
  securityRange: [number, number];
  resourceMultiplier: number;
  starSystemRange: [number, number];
  description: string;
  color: string;
}> = {
  'Core Sector': { securityRange: [8, 10], resourceMultiplier: 1.5, starSystemRange: [30, 50], description: 'Heavily defended inner sectors. Maximum security, abundant infrastructure.', color: '#FFD700' },
  'Inner Sector': { securityRange: [6, 8], resourceMultiplier: 1.2, starSystemRange: [20, 40], description: 'Well-established sectors with strong military presence and trade networks.', color: '#4ADE80' },
  'Mid Sector': { securityRange: [4, 7], resourceMultiplier: 1.0, starSystemRange: [15, 35], description: 'Balanced sectors with moderate security and diverse opportunities.', color: '#38BDF8' },
  'Outer Sector': { securityRange: [2, 5], resourceMultiplier: 0.9, starSystemRange: [10, 25], description: 'Less patrolled sectors. Independent colonies and emerging powers.', color: '#FB923C' },
  'Frontier Sector': { securityRange: [1, 3], resourceMultiplier: 1.3, starSystemRange: [5, 20], description: 'Unexplored territories ripe for colonization. High risk, high reward.', color: '#A78BFA' },
  'Wild Space': { securityRange: [0, 2], resourceMultiplier: 1.6, starSystemRange: [3, 15], description: 'Lawless regions beyond imperial control. Pirates and rogue factions dominate.', color: '#EF4444' },
  'Nebula Sector': { securityRange: [1, 4], resourceMultiplier: 1.8, starSystemRange: [5, 20], description: 'Sectors shrouded in nebulae. Sensors unreliable, rich in exotic gases.', color: '#EC4899' },
  'Void Sector': { securityRange: [0, 1], resourceMultiplier: 0.5, starSystemRange: [1, 10], description: 'Nearly empty sectors in the galactic void. Dark matter and ancient secrets await.', color: '#1E1B4B' },
  'Anomalous Sector': { securityRange: [0, 5], resourceMultiplier: 2.0, starSystemRange: [1, 15], description: 'Reality-bending sectors. Physics operates differently here.', color: '#00CED1' }
};

export type SecurityLevel = 'Maximum' | 'High' | 'Medium' | 'Low' | 'Minimal' | 'None' | 'Anomalous';

export const SECURITY_LEVEL_COLORS: Record<SecurityLevel, string> = {
  'Maximum': '#FFD700', 'High': '#4ADE80', 'Medium': '#38BDF8',
  'Low': '#FB923C', 'Minimal': '#EF4444', 'None': '#6B7280', 'Anomalous': '#EC4899'
};

// Solar System Types
export type SolarSystemType = 'Single Star' | 'Binary Star' | 'Trinary Star' | 'Quadruple Star' | 'Neutron Star System' | 'Black Hole System' | 'Nebula-Bound System';

export const SOLAR_SYSTEM_DEFINITIONS: Record<SolarSystemType, {
  planetRange: [number, number];
  habitabilityBonus: number;
  rarity: number;
  description: string;
}> = {
  'Single Star': { planetRange: [3, 15], habitabilityBonus: 0, rarity: 0.55, description: 'Standard single-star system. Most common and predictable.' },
  'Binary Star': { planetRange: [2, 12], habitabilityBonus: -5, rarity: 0.25, description: 'Two stars in orbit. Complex orbital mechanics create unique planetary conditions.' },
  'Trinary Star': { planetRange: [1, 8], habitabilityBonus: -10, rarity: 0.10, description: 'Three suns dance in gravitational harmony. Rare and spectacular.' },
  'Quadruple Star': { planetRange: [1, 5], habitabilityBonus: -15, rarity: 0.03, description: 'Four stars locked in orbital resonance. Extremely rare and chaotic.' },
  'Neutron Star System': { planetRange: [1, 4], habitabilityBonus: -20, rarity: 0.04, description: 'A collapsed stellar core. Intense radiation but unique exotic matter deposits.' },
  'Black Hole System': { planetRange: [0, 3], habitabilityBonus: -30, rarity: 0.02, description: 'A black hole dominates. Time dilation and gravitational anomalies abound.' },
  'Nebula-Bound System': { planetRange: [2, 10], habitabilityBonus: 5, rarity: 0.01, description: 'Star system embedded in a nebula. Ionized gases shield planets from external threats.' }
};

// Star Type (expanded OBAFGKMLTY classification)
export type StarClassType = 'O'|'B'|'A'|'F'|'G'|'K'|'M'|'L'|'T'|'Y'|'Neutron'|'BlackHole'|'WhiteDwarf'|'RedGiant'|'Supergiant';

export const STAR_CLASS_DEFINITIONS: Record<StarClassType, {
  name: string;
  color: string;
  tempRange: [number, number];
  massRange: [number, number];
  lifespanBillionYears: number;
  planetProbability: number;
  rarity: number;
}> = {
  'O': { name: 'Blue Supergiant', color: '#9BB0FF', tempRange: [30000, 50000], massRange: [16, 100], lifespanBillionYears: 0.01, planetProbability: 0.1, rarity: 0.00003 },
  'B': { name: 'Blue-White Giant', color: '#AABFFF', tempRange: [10000, 30000], massRange: [2.1, 16], lifespanBillionYears: 0.1, planetProbability: 0.3, rarity: 0.13 },
  'A': { name: 'White Star', color: '#CAD7FF', tempRange: [7500, 10000], massRange: [1.4, 2.1], lifespanBillionYears: 1, planetProbability: 0.5, rarity: 0.6 },
  'F': { name: 'Yellow-White Star', color: '#F8F7FF', tempRange: [6000, 7500], massRange: [1.04, 1.4], lifespanBillionYears: 5, planetProbability: 0.7, rarity: 3 },
  'G': { name: 'Yellow Dwarf', color: '#FFF4EA', tempRange: [5200, 6000], massRange: [0.8, 1.04], lifespanBillionYears: 10, planetProbability: 0.85, rarity: 7.6 },
  'K': { name: 'Orange Dwarf', color: '#FFD2A1', tempRange: [3700, 5200], massRange: [0.45, 0.8], lifespanBillionYears: 50, planetProbability: 0.9, rarity: 12.1 },
  'M': { name: 'Red Dwarf', color: '#FFCC6F', tempRange: [2400, 3700], massRange: [0.08, 0.45], lifespanBillionYears: 1000, planetProbability: 0.95, rarity: 76.45 },
  'L': { name: 'Brown Dwarf', color: '#8B4513', tempRange: [1300, 2400], massRange: [0.075, 0.08], lifespanBillionYears: 10000, planetProbability: 0.1, rarity: 0.1 },
  'T': { name: 'Methane Dwarf', color: '#654321', tempRange: [700, 1300], massRange: [0.07, 0.075], lifespanBillionYears: 100000, planetProbability: 0.05, rarity: 0.05 },
  'Y': { name: 'Sub-Brown Dwarf', color: '#3E2723', tempRange: [300, 700], massRange: [0.01, 0.07], lifespanBillionYears: 1000000, planetProbability: 0.01, rarity: 0.03 },
  'Neutron': { name: 'Neutron Star', color: '#E0E0E0', tempRange: [100000, 1000000], massRange: [1.4, 2.1], lifespanBillionYears: 100, planetProbability: 0.05, rarity: 0.001 },
  'BlackHole': { name: 'Black Hole', color: '#000000', tempRange: [0, 0], massRange: [3, 100000000], lifespanBillionYears: 999999, planetProbability: 0.02, rarity: 0.0005 },
  'WhiteDwarf': { name: 'White Dwarf', color: '#FFFFFF', tempRange: [8000, 100000], massRange: [0.5, 1.4], lifespanBillionYears: 1000, planetProbability: 0.15, rarity: 0.01 },
  'RedGiant': { name: 'Red Giant', color: '#FF4500', tempRange: [3000, 5000], massRange: [0.8, 8], lifespanBillionYears: 0.1, planetProbability: 0.4, rarity: 0.005 },
  'Supergiant': { name: 'Supergiant', color: '#FFD700', tempRange: [3400, 40000], massRange: [8, 100], lifespanBillionYears: 0.01, planetProbability: 0.05, rarity: 0.00001 }
};

// Universe Class (expanded)
export type UniverseClassType = 'Standard' | 'Hardcore' | 'Peaceful' | 'Chaos' | 'Ancient' | 'Void' | 'Primordial' | 'Quantum' | 'Mythic';

// Cosmic Coordinate System
export interface CosmicCoordinates {
  x: number;
  y: number;
  z: number;
}

// Universe Interface
export interface UniverseData {
  id: string;
  name: string;
  class: UniverseClassType;
  seed: number;
  description: string;
  color: string;
  accentColor: string;
  image: string;
  totalGalaxies: number;
  galaxyCount: number;
  totalPlayers: number;
  maxPlayers: number;
  isActive: boolean;
  launchDate: string;
  age: 'New' | 'Young' | 'Mature' | 'Ancient' | 'Primordial';
  density: 'Sparse' | 'Normal' | 'Dense' | 'Packed';
  hostility: 'Peaceful' | 'Moderate' | 'Dangerous' | 'Extreme';
  resources: 'Scarce' | 'Normal' | 'Abundant' | 'Infinite';
  technology: 'Primitive' | 'Standard' | 'Advanced' | 'Transcendent';
  specialFeatures: string[];
}

// Galaxy Interface (extended from simple DB version)
export interface GalaxyData {
  id: string;
  universeId: string;
  name: string;
  galaxyClass: GalaxyClassLetter;
  subClass: string;
  galaxyType: GalaxyType;
  category: GalaxyCategory;
  subCategory: string;
  quadrantType: QuadrantType;
  quadrantSubType: string;
  coordinates: CosmicCoordinates;
  starCount: number;
  diameterLy: number;
  ageBillionYears: number;
  dominantSpecies: string;
  controllingFaction: string;
  sectorCount: number;
  maxSectors: number;
  discoveredSectors: number;
  habitableZoneRatio: number;
  resourceRichness: 'Scarce' | 'Low' | 'Normal' | 'Rich' | 'Abundant';
  threatLevel: number;
  isActive: boolean;
  specialFeatures: string[];
  description: string;
  lore: string;
  color: string;
  image: string;
}

// Sector Interface
export interface SectorData {
  id: string;
  galaxyId: string;
  name: string;
  sectorNumber: number;
  sectorType: SectorType;
  subType: string;
  securityLevel: SecurityLevel;
  coordinates: CosmicCoordinates;
  starSystemCount: number;
  maxStarSystems: number;
  discoveredSystems: number;
  colonizedSystems: number;
  dominantFaction: string;
  resourceLevel: 'Scarce' | 'Low' | 'Normal' | 'Rich' | 'Abundant';
  threatLevel: number;
  isDiscovered: boolean;
  isAccessible: boolean;
  specialFeatures: string[];
  description: string;
}

// Solar System Interface
export interface SolarSystemData {
  id: string;
  sectorId: string;
  name: string;
  systemNumber: number;
  systemType: SolarSystemType;
  starType: StarClassType;
  starColor: string;
  starTemperature: number;
  starMass: number;
  starLuminosity: number;
  planetCount: number;
  asteroidBelts: number;
  hasBlackHole: boolean;
  hasNebula: boolean;
  hasAnomaly: boolean;
  coordinates: CosmicCoordinates;
  habitabilityZonePlanets: number;
  resourceOutput: { metal: number; crystal: number; deuterium: number; darkMatter: number };
  isDiscovered: boolean;
  isColonized: boolean;
  ownerId: string | null;
  threatLevel: number;
  specialFeatures: string[];
  description: string;
}

// Mapping: Class letter to Galaxy Type
export const GALAXY_CLASS_TO_TYPE: Record<GalaxyClassLetter, GalaxyType> = {
  'A': 'Active', 'B': 'Spiral', 'C': 'Elliptical', 'D': 'Dwarf',
  'E': 'Elliptical', 'F': 'Spiral', 'G': 'Spiral', 'H': 'Active',
  'I': 'Irregular', 'J': 'Active', 'K': 'Irregular', 'L': 'Lenticular',
  'M': 'Spiral', 'N': 'Spiral', 'O': 'Spiral', 'P': 'Ring',
  'Q': 'Active', 'R': 'Ring', 'S': 'Spiral', 'T': 'Irregular',
  'U': 'Ultra-Diffuse', 'V': 'Ultra-Diffuse', 'W': 'Starburst', 'X': 'Active',
  'Y': 'Starburst', 'Z': 'Dwarf'
};

// Mapping: Galaxy Type to default quadrant types
export const GALAXY_TYPE_TO_QUADRANTS: Record<GalaxyType, QuadrantType[]> = {
  'Spiral': ['Spiral Arm', 'Galactic Bulge', 'Outer Core', 'Halo', 'Satellite Region'],
  'Elliptical': ['Inner Core', 'Outer Core', 'Halo', 'Dark Matter Halo', 'Satellite Region'],
  'Irregular': ['Outer Core', 'Galactic Bar', 'Halo', 'Satellite Region', 'Intergalactic Void'],
  'Lenticular': ['Galactic Bulge', 'Outer Core', 'Halo', 'Dark Matter Halo'],
  'Dwarf': ['Outer Core', 'Halo', 'Satellite Region', 'Intergalactic Void'],
  'Ring': ['Inner Core', 'Outer Core', 'Spiral Arm', 'Galactic Bar'],
  'Starburst': ['Inner Core', 'Galactic Bulge', 'Spiral Arm', 'Outer Core'],
  'Active': ['Inner Core', 'Galactic Bulge', 'Dark Matter Halo', 'Intergalactic Void'],
  'Ultra-Diffuse': ['Halo', 'Dark Matter Halo', 'Satellite Region', 'Intergalactic Void']
};

// Galaxy name generation components
export const GALAXY_PREFIXES = [
  'Andromeda', 'Triangulum', 'Centaurus', 'Sculptor', 'Fornax', 'Virgo', 'Leo', 'Coma',
  'Pegasus', 'Phoenix', 'Hydra', 'Draco', 'Orion', 'Cygnus', 'Lyra', 'Aquila',
  'Carina', 'Vela', 'Puppis', 'Crux', 'Ara', 'Pavo', 'Grus', 'Tucana',
  'Eridanus', 'Cetus', 'Perseus', 'Auriga', 'Cassiopeia', 'Ursa', 'Bootes', 'Hercules',
  'Corona', 'Ophiuchus', 'Scorpius', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Libra', 'Vulpecula', 'Sextans', 'Crater',
  'Corvus', 'Canis', 'Lepus', 'Columba', 'Dorado', 'Volans', 'Chamaeleon', 'Apus',
  'Circinus', 'Norma', 'Telescopium', 'Microscopium', 'Horologium', 'Reticulum', 'Pictor',
  'Antlia', 'Pyxis', 'Monoceros', 'Lynx', 'Camelopardalis', 'Lacerta', 'Delphinus',
  'Equuleus', 'Scutum', 'Musca', 'Triangulum Australe', 'Indus', 'Octans', 'Mensa',
  'Caelum', 'Felis', 'Rangifer', 'Cerberus', 'Turdus', 'Noctua', 'Robur', 'Argo',
  'Sombrero', 'Whirlpool', 'Blackeye', 'Pinwheel', 'Cartwheel', 'Tadpole', 'Mice',
  'Antennae', 'Stephans', 'Hoags', 'Mayalls', 'Markarian', 'Seyferts', 'Centaurus A',
  'Messier', 'NGC', 'IC', 'UGC', 'PGC', 'MCG', 'ESO', '2MASS'
];

export const GALAXY_SUFFIXES = [
  'Galaxy', 'Cluster', 'Group', 'Supercluster', 'Nebula', 'Expanse', 'Deep Field',
  'Ultra Deep', 'Void', 'Wall', 'Filament', 'Great Wall', 'Attractor', 'Complex',
  'Cloud', 'Stream', 'Bridge', 'Ring', 'Arc', 'Shell', 'Wake', 'Trail',
  'Remnant', 'Merger', 'Collision', 'Formation', 'Structure', 'System', 'Aggregate'
];

export const GALAXY_DESCRIPTORS = [
  'Great', 'Lesser', 'Greater', 'Northern', 'Southern', 'Eastern', 'Western',
  'Golden', 'Silver', 'Crimson', 'Azure', 'Emerald', 'Amethyst', 'Obsidian',
  'Radiant', 'Shadow', 'Ancient', 'Eternal', 'Celestial', 'Cosmic', 'Stellar',
  'Lost', 'Hidden', 'Forgotten', 'Sacred', 'Cursed', 'Blessed', 'Dark',
  'Luminous', 'Brilliant', 'Majestic', 'Imperial', 'Royal', 'Mythic', 'Primordial'
];

export const SPECIES_NAMES = [
  'Terrans', 'Zenthari', 'Quorax', 'Nephilim', 'Vexari', 'Draken', 'Aetherians',
  'Krynn', 'Xalvadori', 'Ophidians', 'Celestials', 'Myconids', 'Lithoids', 'Aquarians',
  'Pyronites', 'Cryonians', 'Electroids', 'Necroids', 'Psions', 'Chronari',
  'Voidborn', 'Starborn', 'Nebulites', 'Quantari', 'Dimensionalites', 'Gravitons',
  'Plasmoids', 'Photonic', 'Siliconids', 'Carbonites', 'Metalloids', 'Crystalline'
];

export const FACTION_NAMES = [
  'Imperial Dominion', 'Galactic Republic', 'Void Syndicate', 'Stellar Imperium',
  'Nexus Alliance', 'Shadow Collective', 'Iron Legion', 'Crystal Covenant',
  'Solar Federation', 'Nebula Consortium', 'Eternal Empire', 'Chaos Brotherhood',
  'Quantum Conclave', 'Temporal Order', 'Antimatter Cult', 'Cosmic Wardens',
  'Rogue Fleet', 'Pirate Coalition', 'Trade Federation', 'Scientific Union',
  'Military Junta', 'Theocratic Empire', 'Technocratic Union', 'Democratic Alliance',
  'Monarchist League', 'Anarchist Collective', 'Corporate Dominion', 'Religious Order'
];

// ============================================================
// RACE CLASSIFICATION SYSTEM — NPC / ENEMY / FRIENDLY RACES
// ============================================================

// Race Class Letters A-Z (shared across all three race types)
export type RaceClassLetter = 'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'I'|'J'|'K'|'L'|'M'|'N'|'O'|'P'|'Q'|'R'|'S'|'T'|'U'|'V'|'W'|'X'|'Y'|'Z';

export const RACE_CLASS_LETTER_NAMES: Record<RaceClassLetter, string> = {
  'A': 'Ancients', 'B': 'Barbarians', 'C': 'Cybernetic', 'D': 'Dimensional',
  'E': 'Exotic', 'F': 'Fungal', 'G': 'Gaseous', 'H': 'Hive-Mind',
  'I': 'Insectoid', 'J': 'Juggernauts', 'K': 'Kinetic', 'L': 'Lithoid',
  'M': 'Mammalian', 'N': 'Necrotic', 'O': 'Oceanic', 'P': 'Psionic',
  'Q': 'Quantum', 'R': 'Reptilian', 'S': 'Synthetic', 'T': 'Terran',
  'U': 'Umbral', 'V': 'Void-Born', 'W': 'Warp-Touched', 'X': 'Xenomorph',
  'Y': 'Crystalline', 'Z': 'Zero-Form'
};

export const RACE_CLASS_COLORS: Record<RaceClassLetter, string> = {
  'A': '#FFD700', 'B': '#CD853F', 'C': '#00CED1', 'D': '#9400D3',
  'E': '#FF1493', 'F': '#8FBC8F', 'G': '#B0E0E6', 'H': '#FF6347',
  'I': '#556B2F', 'J': '#8B0000', 'K': '#4682B4', 'L': '#A9A9A9',
  'M': '#D2B48C', 'N': '#2F4F4F', 'O': '#1E90FF', 'P': '#BA55D3',
  'Q': '#00FA9A', 'R': '#228B22', 'S': '#C0C0C0', 'T': '#32CD32',
  'U': '#191970', 'V': '#000000', 'W': '#FF4500', 'X': '#6B8E23',
  'Y': '#E6E6FA', 'Z': '#F5F5DC'
};

export const RACE_CLASS_DESCRIPTIONS: Record<RaceClassLetter, string> = {
  'A': 'Ancient civilizations that predate most known galactic history. Possess relics and knowledge lost to modern races.',
  'B': 'Warrior cultures focused on martial prowess. Aggressive expansionists with powerful combat traditions.',
  'C': 'Races that have integrated technology into their biology. Masters of artificial intelligence and augmentation.',
  'D': 'Beings from alternate dimensions or capable of dimensional manipulation. Reality-bending abilities.',
  'E': 'Truly alien lifeforms that defy standard biological classification. Unpredictable and fascinating.',
  'F': 'Fungal-based intelligent species. Spore networks, decomposition mastery, and unique biochemistry.',
  'G': 'Beings composed of or living within gaseous environments. Atmospheric manipulation and cloud cities.',
  'H': 'Collective consciousness species sharing a single mind. Perfect coordination but vulnerable to psychic attacks.',
  'I': 'Insect-derived sentient species. Hive structures, chitin armor, rapid reproduction rates.',
  'J': 'Massive, physically imposing races. Titans of the galaxy with immense strength and durability.',
  'K': 'Energy-manipulating races. Kinetic force control, plasma weaponry, and propulsion mastery.',
  'L': 'Silicon and mineral-based lifeforms. Crystalline bodies, extreme durability, slow metabolisms.',
  'M': 'Warm-blooded, fur-bearing humanoids. Most similar to Terran biology and psychology.',
  'N': 'Races touched by death and entropy. Necromancy, life-drain, and dark energy manipulation.',
  'O': 'Aquatic species evolved in deep oceans. Water-breathing, pressure resistance, hydrokinetic abilities.',
  'P': 'Races with powerful mental abilities. Telepathy, telekinesis, precognition, mind control.',
  'Q': 'Beings existing in quantum states. Probability manipulation, superposition, quantum entanglement.',
  'R': 'Cold-blooded reptilian humanoids. Scales, thermal sensitivity, ancient evolutionary lineages.',
  'S': 'Fully artificial or heavily mechanized races. Robots, androids, uploaded consciousnesses.',
  'T': 'Earth-like humanoid races. Most compatible with standard Terran environments and psychology.',
  'U': 'Shadow-dwelling races from dark worlds or dimensions. Stealth, light-absorption, nocturnal mastery.',
  'V': 'Beings native to the void of space. Zero-gravity adaptation, vacuum survival, cosmic energy feeding.',
  'W': 'Races mutated or evolved due to exposure to warp/hyperspace energies. Unstable but powerful.',
  'X': 'Alien races with bizarre and often terrifying biology. Acid blood, parasitism, rapid adaptation.',
  'Y': 'Crystalline sentient species. Gem-based consciousness, energy storage, light refraction.',
  'Z': 'Non-corporeal beings without physical form. Pure energy, thought constructs, data entities.'
};

export const RACE_SUB_CLASSES: Record<RaceClassLetter, string[]> = {
  'A': ['Precursor', 'Guardian', 'Sleeping-Giant', 'Ascended'],
  'B': ['Clan-Based', 'Honor-Code', 'Warlord-Led', 'Mercenary'],
  'C': ['Full-Conversion', 'Partial-Augment', 'Network-Consciousness', 'Drone-Swarm'],
  'D': ['Phase-Walker', 'Rift-Caller', 'Plane-Shifter', 'Reality-Weaver'],
  'E': ['Energy-Based', 'Geometric', 'Amorphous', 'Multi-Dimensional'],
  'F': ['Mycelial-Network', 'Spore-Spreader', 'Parasitic-Fungus', 'Decomposer-Symbiont'],
  'G': ['Nebula-Dweller', 'Atmospheric-Floater', 'Gas-Giant-Native', 'Plasma-Cloud'],
  'H': ['Single-Mind', 'Sub-Minds', 'Queen-Controlled', 'Democratic-Hive'],
  'I': ['Colony-Builder', 'Swarm-Hunter', 'Parasitic-Wasp', 'Beetle-Armored'],
  'J': ['Stone-Giant', 'Metal-Colossus', 'Crystal-Behemoth', 'Gravity-Crusher'],
  'K': ['Shockwave-Generator', 'Kinetic-Absorber', 'Momentum-Shifter', 'Impact-Warrior'],
  'L': ['Granite-Formed', 'Obsidian-Carved', 'Crystal-Grown', 'Mineral-Fused'],
  'M': ['Primate-Descended', 'Canine-Evolved', 'Feline-Humanoid', 'Ursine-Kin'],
  'N': ['Undead-Horde', 'Life-Stealer', 'Soul-Collector', 'Entropy-Weaver'],
  'O': ['Deep-Trench', 'Coral-Reef', 'Hydrothermal-Adapted', 'Bioluminescent'],
  'P': ['Telepath-Prime', 'Precog-Seer', 'Telekine-Warrior', 'Empath-Healer'],
  'Q': ['Probability-Shifter', 'Entangled-Twin', 'Waveform-Collapser', 'Superposition-Being'],
  'R': ['Serpentine', 'Draconic', 'Saurian', 'Chelonian'],
  'S': ['Android-Type', 'Nanite-Swarm', 'Upload-Consciousness', 'Self-Replicating'],
  'T': ['Standard-Humanoid', 'Adaptive-Colonist', 'Genetic-Variant', 'Biome-Specialist'],
  'U': ['Deep-Shadow', 'Light-Thief', 'Eclipse-Born', 'Umbra-Kin'],
  'V': ['Star-Whale', 'Void-Jelly', 'Cosmic-Drifter', 'Dark-Space-Dweller'],
  'W': ['Chaos-Mutate', 'Stable-Warped', 'Hyperspace-Ghost', 'Reality-Tear'],
  'X': ['Acid-Blood', 'Parasitic-Brood', 'Rapid-Adapter', 'Mimic-Predator'],
  'Y': ['Diamond-Consciousness', 'Quartz-Matrix', 'Prism-Being', 'Gem-Cluster'],
  'Z': ['Pure-Energy', 'Thought-Form', 'Data-Ghost', 'Frequency-Being']
};

// Race Categories
export type RaceCategory = 
  | 'Humanoid' | 'Reptilian' | 'Insectoid' | 'Aquatic' | 'Avian'
  | 'Plant-Based' | 'Energy-Based' | 'Crystalline' | 'Mechanical' 
  | 'Gaseous' | 'Fungal' | 'Exotic' | 'Mammalian' | 'Lithoid'
  | 'Necrotic' | 'Psionic' | 'Dimensional';

export const RACE_CATEGORIES: RaceCategory[] = [
  'Humanoid', 'Reptilian', 'Insectoid', 'Aquatic', 'Avian',
  'Plant-Based', 'Energy-Based', 'Crystalline', 'Mechanical',
  'Gaseous', 'Fungal', 'Exotic', 'Mammalian', 'Lithoid',
  'Necrotic', 'Psionic', 'Dimensional'
];

export const RACE_SUB_CATEGORIES: Record<RaceCategory, string[]> = {
  'Humanoid': ['Bipedal', 'Multi-Armed', 'Giant', 'Dwarf', 'Elongated', 'Stocky'],
  'Reptilian': ['Serpentine', 'Draconic', 'Saurian', 'Chelonian', 'Amphibian'],
  'Insectoid': ['Hive-Builder', 'Solitary-Hunter', 'Swarm-Form', 'Colony-Dweller', 'Parasitic'],
  'Aquatic': ['Deep-Dweller', 'Surface-Dweller', 'Amphibious', 'Pressure-Adapted', 'Bioluminescent'],
  'Avian': ['Raptor-Type', 'Songbird-Type', 'Flightless', 'Aerial-Predator', 'Migratory'],
  'Plant-Based': ['Photosynthetic', 'Carnivorous-Flora', 'Symbiotic', 'Sentient-Forest', 'Spore-Bearer'],
  'Energy-Based': ['Plasma-Form', 'Electromagnetic', 'Gravitational', 'Radiant', 'Neutrino-Based'],
  'Crystalline': ['Silicon-Lattice', 'Carbon-Crystal', 'Mineral-Matrix', 'Gem-Core', 'Prismatic'],
  'Mechanical': ['Android', 'Nanite-Swarm', 'Upload-Consciousness', 'Self-Aware-AI', 'Cyborg-Collective'],
  'Gaseous': ['Nebula-Entity', 'Atmospheric-Colony', 'Plasma-Cloud', 'Gas-Giant-Native', 'Diffuse-Consciousness'],
  'Fungal': ['Mycelial-Network', 'Spore-Cloud', 'Decomposer', 'Parasitic-Fungus', 'Lichen-Symbiont'],
  'Exotic': ['Temporal', 'Dimensional-Rift', 'Quantum-State', 'Reality-Bender', 'Hyper-Geometric'],
  'Mammalian': ['Primate-Derived', 'Feline', 'Canine', 'Ursine', 'Cetacean-Descended'],
  'Lithoid': ['Silicate-Based', 'Metallic-Core', 'Crystal-Growth', 'Obsidian-Form', 'Mineral-Fused'],
  'Necrotic': ['Undead', 'Life-Drainer', 'Soul-Binder', 'Entropy-Entity', 'Death-Touched'],
  'Psionic': ['Telepathic', 'Telekinetic', 'Empathic', 'Precognitive', 'Mind-Controller'],
  'Dimensional': ['Phase-Shifter', 'Rift-Walker', 'Plane-Hopper', 'Reality-Weaver', 'Pocket-Dimension Dweller']
};

// Government Types for Races
export type RaceGovernmentType = 
  | 'Imperial Monarchy' | 'Republic' | 'Hive Mind' | 'Technocracy'
  | 'Theocracy' | 'Military Junta' | 'Corporate Oligarchy' | 'Anarchist Collective'
  | 'Matriarchy' | 'Patriarchy' | 'AI Overlord' | 'Council of Elders'
  | 'Meritocracy' | 'Genetic Caste' | 'Psychic Gestalt' | 'Tribal Confederation'
  | 'Direct Democracy' | 'Feudal System' | 'Absolutism' | 'Consensus-Based';

// Economy Types for Races
export type RaceEconomyType = 
  | 'Capitalist' | 'Communist' | 'Resource-Based' | 'Energy-Credit'
  | 'Trade-Network' | 'Gift-Economy' | 'Barter-System' | 'Post-Scarcity'
  | 'War-Economy' | 'Subsistence' | 'Planned-Economy' | 'Data-Currency';

// Habitat Preferences
export type RaceHabitat = 
  | 'Terran' | 'Desert' | 'Ocean' | 'Arctic' | 'Volcanic'
  | 'Jungle' | 'Gas Giant' | 'Void' | 'Underground' | 'Artificial'
  | 'Crystalline' | 'Nebula' | 'Energy-Rich' | 'Multi-Environment';

// Threat Rating
export type ThreatRating = 'None' | 'Minimal' | 'Low' | 'Moderate' | 'High' | 'Extreme' | 'Apocalyptic';

// Diplomatic Stance
export type DiplomaticStance = 'Hostile' | 'Wary' | 'Neutral' | 'Cordial' | 'Friendly' | 'Allied' | 'Subjugated';

// Faction Types (for enemies)
export type EnemyFactionType =
  | 'Pirate Clan' | 'Rogue Military' | 'Religious Cult' | 'Genocidal Swarm'
  | 'Xenophobic Empire' | 'Corporate Raiders' | 'Dark Cult' | 'Rebel Alliance'
  | 'AI Uprising' | 'Extradimensional Invaders' | 'Cosmic Horror' | 'Plague Spreaders'
  | 'Resource Strip-Miners' | 'Slave Empire' | 'World Devourers' | 'Chaos Warband';

// Alliance Types (for friendly races)
export type AllianceType = 
  | 'Trade Federation' | 'Mutual Defense Pact' | 'Research Cooperative' | 'Cultural Exchange'
  | 'Military Alliance' | 'Economic Union' | 'Technological Partnership' | 'Diplomatic Coalition'
  | 'Refugee Haven' | 'Peacekeeping Force' | 'Galactic Council' | 'Resource Sharing Network';

// Loot Quality
export type LootQuality = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

// ─── NPC Race Interface ────────────────────────────────────────
export interface NPCRace {
  id: string;
  name: string;
  raceClass: RaceClassLetter;
  subClass: string;
  category: RaceCategory;
  subCategory: string;
  homeworldClass: PlanetClassLetter;
  homeworldName: string;
  governmentType: RaceGovernmentType;
  economyType: RaceEconomyType;
  aggressionLevel: number;
  diplomacyLevel: number;
  technologyLevel: number;
  economyStrength: number;
  militaryPower: number;
  populationGrowth: number;
  intelligenceLevel: number;
  lifespanYears: number;
  averageHeightCm: number;
  habitatPreference: RaceHabitat;
  specialAbilities: string[];
  traits: string[];
  weaknesses: string[];
  alliances: string[];
  enemies: string[];
  controlledSystems: number;
  totalPopulation: number;
  threatRating: ThreatRating;
  diplomaticStance: DiplomaticStance;
  tradeWillingness: number;
  lore: string;
  description: string;
  info: string;
  visualDescription: string;
  color: string;
  rank: Rank;
  rarity: Rarity;
}

// ─── Enemy Race Interface ──────────────────────────────────────
export interface EnemyRace {
  id: string;
  name: string;
  raceClass: RaceClassLetter;
  subClass: string;
  category: RaceCategory;
  subCategory: string;
  homeworldClass: PlanetClassLetter;
  homeworldName: string;
  factionType: EnemyFactionType;
  hostilityCause: string;
  aggressionLevel: number;
  diplomacyLevel: number;
  technologyLevel: number;
  economyStrength: number;
  militaryPower: number;
  populationGrowth: number;
  intelligenceLevel: number;
  combatBonus: number;
  lootQuality: LootQuality;
  lootTypes: string[];
  spawnRegions: string[];
  fleetComposition: { shipType: string; count: number; power: number }[];
  bossVariants: boolean;
  isRaidBoss: boolean;
  specialAbilities: string[];
  traits: string[];
  weaknesses: string[];
  controlledSystems: number;
  totalPopulation: number;
  threatRating: ThreatRating;
  diplomaticStance: DiplomaticStance;
  isDiplomacyPossible: boolean;
  lore: string;
  description: string;
  info: string;
  visualDescription: string;
  color: string;
  rank: Rank;
  rarity: Rarity;
}

// ─── Friendly Race Interface ──────────────────────────────────────
export interface FriendlyRace {
  id: string;
  name: string;
  raceClass: RaceClassLetter;
  subClass: string;
  category: RaceCategory;
  subCategory: string;
  homeworldClass: PlanetClassLetter;
  homeworldName: string;
  governmentType: RaceGovernmentType;
  economyType: RaceEconomyType;
  allianceType: AllianceType;
  aggressionLevel: number;
  diplomacyLevel: number;
  technologyLevel: number;
  economyStrength: number;
  militaryPower: number;
  populationGrowth: number;
  intelligenceLevel: number;
  tradeBonus: number;
  researchBonus: number;
  diplomaticBonus: number;
  specialAbilities: string[];
  traits: string[];
  weaknesses: string[];
  alliances: string[];
  controlledSystems: number;
  totalPopulation: number;
  threatRating: ThreatRating;
  diplomaticStance: DiplomaticStance;
  tradeWillingness: number;
  allianceRequirements: string[];
  mutualDefensePact: boolean;
  technologySharing: boolean;
  lore: string;
  description: string;
  info: string;
  visualDescription: string;
  color: string;
  rank: Rank;
  rarity: Rarity;
}

// ─── Helper functions ─────────────────────────────────────────
export function getRaceClassNameByLetter(letter: RaceClassLetter): string {
  return RACE_CLASS_LETTER_NAMES[letter];
}

export function getRaceClassColorByLetter(letter: RaceClassLetter): string {
  return RACE_CLASS_COLORS[letter];
}

export function getRaceClassDescriptionByLetter(letter: RaceClassLetter): string {
  return RACE_CLASS_DESCRIPTIONS[letter];
}