import {
  BuildingDefinition,
  UpgradeDefinition,
  PlanetClassLetter,
  PlanetCategory,
  MoonClassLetter,
  MoonCategory,
  StarbaseClassLetter,
  StarbaseCategory,
} from '@/types/gameTypes';

// ============================================================
// BUILDING DEFINITIONS
// ============================================================

export const BUILDING_DEFINITIONS: BuildingDefinition[] = [
  // ---- PRODUCTION ----
  {
    id: 'metal_mine',
    name: 'Metal Mine',
    category: 'Production',
    description: 'Extracts raw metal ores from planetary crust.',
    maxLevel: 50,
    baseCost: { metal: 60, crystal: 15 },
    costMultiplier: 1.5,
    baseProduction: { metal: 30 },
    applicableTo: ['planet', 'moon'],
    icon: 'ri-hammer-line',
  },
  {
    id: 'crystal_mine',
    name: 'Crystal Mine',
    category: 'Production',
    description: 'Harvests rare crystal formations from deep deposits.',
    maxLevel: 50,
    baseCost: { metal: 48, crystal: 24 },
    costMultiplier: 1.6,
    baseProduction: { crystal: 20 },
    applicableTo: ['planet', 'moon'],
    icon: 'ri-contrast-drop-2-line',
  },
  {
    id: 'deuterium_synthesizer',
    name: 'Deuterium Synthesizer',
    category: 'Production',
    description: 'Extracts and refines deuterium from planetary water sources.',
    maxLevel: 40,
    baseCost: { metal: 225, crystal: 75 },
    costMultiplier: 1.5,
    baseProduction: { deuterium: 10 },
    applicableTo: ['planet', 'moon'],
    icon: 'ri-flask-line',
  },
  {
    id: 'gas_harvester',
    name: 'Gas Harvester',
    category: 'Production',
    description: 'Collects valuable gases from planetary atmospheres.',
    maxLevel: 35,
    baseCost: { metal: 400, crystal: 200, deuterium: 100 },
    costMultiplier: 1.4,
    baseProduction: { deuterium: 25 },
    applicableTo: ['planet'],
    icon: 'ri-windy-line',
  },
  {
    id: 'orbital_mining_station',
    name: 'Orbital Mining Station',
    category: 'Production',
    description: 'Space-based mining facility extracting resources from orbit.',
    maxLevel: 30,
    baseCost: { metal: 2000, crystal: 1000, deuterium: 500 },
    costMultiplier: 1.7,
    baseProduction: { metal: 100, crystal: 60 },
    applicableTo: ['moon', 'starbase'],
    icon: 'ri-space-ship-line',
  },

  // ---- ENERGY ----
  {
    id: 'solar_plant',
    name: 'Solar Plant',
    category: 'Energy',
    description: 'Converts stellar radiation into usable energy.',
    maxLevel: 40,
    baseCost: { metal: 75, crystal: 30 },
    costMultiplier: 1.5,
    baseProduction: { energy: 20 },
    applicableTo: ['planet', 'moon'],
    icon: 'ri-sun-line',
  },
  {
    id: 'fusion_reactor',
    name: 'Fusion Reactor',
    category: 'Energy',
    description: 'Generates massive energy through deuterium fusion.',
    maxLevel: 30,
    baseCost: { metal: 900, crystal: 360, deuterium: 180 },
    costMultiplier: 1.8,
    baseProduction: { energy: 50 },
    applicableTo: ['planet', 'moon', 'starbase'],
    icon: 'ri-flashlight-line',
  },
  {
    id: 'dark_matter_reactor',
    name: 'Dark Matter Reactor',
    category: 'Energy',
    description: 'Harnesses dark matter for nearly limitless energy.',
    maxLevel: 20,
    baseCost: { metal: 5000, crystal: 3000, deuterium: 2000, darkMatter: 50 },
    costMultiplier: 2.0,
    baseProduction: { energy: 200 },
    applicableTo: ['starbase'],
    icon: 'ri-meteor-line',
  },
  {
    id: 'geothermal_plant',
    name: 'Geothermal Plant',
    category: 'Energy',
    description: 'Taps planetary heat for geothermal energy production.',
    maxLevel: 25,
    baseCost: { metal: 200, crystal: 100 },
    costMultiplier: 1.4,
    baseProduction: { energy: 35 },
    applicableTo: ['planet'],
    icon: 'ri-fire-line',
  },

  // ---- INFRASTRUCTURE ----
  {
    id: 'robotics_factory',
    name: 'Robotics Factory',
    category: 'Infrastructure',
    description: 'Produces robots that speed up all construction projects.',
    maxLevel: 20,
    baseCost: { metal: 400, crystal: 120, deuterium: 200 },
    costMultiplier: 2.0,
    baseBonus: { constructionSpeed: 10 },
    applicableTo: ['planet', 'moon'],
    icon: 'ri-robot-2-line',
  },
  {
    id: 'nanite_factory',
    name: 'Nanite Factory',
    category: 'Infrastructure',
    description: 'Advanced nanite production halves construction time.',
    maxLevel: 10,
    baseCost: { metal: 1000000, crystal: 500000, deuterium: 200000 },
    costMultiplier: 2.0,
    baseBonus: { constructionSpeed: 50 },
    requirements: [{ buildingId: 'robotics_factory', level: 10 }],
    applicableTo: ['planet'],
    icon: 'ri-cpu-line',
  },
  {
    id: 'spaceport',
    name: 'Spaceport',
    category: 'Infrastructure',
    description: 'Handles cargo and ship traffic. Increases trade and docking capacity.',
    maxLevel: 25,
    baseCost: { metal: 300, crystal: 200, deuterium: 100 },
    costMultiplier: 1.6,
    baseBonus: { dockCapacity: 5, tradeSpeed: 8 },
    applicableTo: ['planet', 'moon', 'starbase'],
    icon: 'ri-rocket-line',
  },
  {
    id: 'terraforming_station',
    name: 'Terraforming Station',
    category: 'Infrastructure',
    description: 'Gradually improves planetary habitability and expands usable fields.',
    maxLevel: 15,
    baseCost: { metal: 50000, crystal: 30000, deuterium: 15000, darkMatter: 100 },
    costMultiplier: 2.0,
    baseBonus: { habitability: 5, fieldsBonus: 3 },
    applicableTo: ['planet'],
    icon: 'ri-earth-line',
  },

  // ---- DEFENSE ----
  {
    id: 'laser_turret',
    name: 'Laser Turret',
    category: 'Defense',
    description: 'Basic defensive laser emplacement for surface-to-orbit combat.',
    maxLevel: 30,
    baseCost: { metal: 1500, crystal: 500 },
    costMultiplier: 1.5,
    baseBonus: { defenseRating: 15 },
    applicableTo: ['planet', 'moon', 'starbase'],
    icon: 'ri-flashlight-fill',
  },
  {
    id: 'plasma_cannon',
    name: 'Plasma Cannon',
    category: 'Defense',
    description: 'Heavy plasma weapon capable of damaging capital ships.',
    maxLevel: 25,
    baseCost: { metal: 5000, crystal: 3000, deuterium: 1000 },
    costMultiplier: 1.7,
    baseBonus: { defenseRating: 35 },
    applicableTo: ['planet', 'moon', 'starbase'],
    icon: 'ri-fire-fill',
  },
  {
    id: 'shield_generator',
    name: 'Shield Generator',
    category: 'Defense',
    description: 'Projects a protective energy shield around the installation.',
    maxLevel: 25,
    baseCost: { metal: 3000, crystal: 5000, deuterium: 3000 },
    costMultiplier: 1.7,
    baseBonus: { shieldStrength: 50 },
    applicableTo: ['planet', 'moon', 'starbase'],
    icon: 'ri-shield-line',
  },
  {
    id: 'missile_silo',
    name: 'Missile Silo',
    category: 'Defense',
    description: 'Stores and launches interplanetary missiles for defense.',
    maxLevel: 20,
    baseCost: { metal: 20000, crystal: 2000, deuterium: 1000 },
    costMultiplier: 1.5,
    baseBonus: { missileCapacity: 10, defenseRating: 60 },
    applicableTo: ['planet', 'moon'],
    icon: 'ri-rocket-2-line',
  },

  // ---- RESEARCH ----
  {
    id: 'research_lab',
    name: 'Research Lab',
    category: 'Research',
    description: 'Core facility for scientific research and technology development.',
    maxLevel: 30,
    baseCost: { metal: 200, crystal: 400, deuterium: 200 },
    costMultiplier: 1.5,
    baseBonus: { researchSpeed: 10 },
    applicableTo: ['planet', 'moon', 'starbase'],
    icon: 'ri-microscope-line',
  },
  {
    id: 'observatory',
    name: 'Observatory',
    category: 'Research',
    description: 'Deep space observation array for astronomical research.',
    maxLevel: 15,
    baseCost: { metal: 5000, crystal: 10000, deuterium: 2000 },
    costMultiplier: 1.4,
    baseBonus: { researchSpeed: 15, sensorRange: 20 },
    applicableTo: ['moon'],
    icon: 'ri-radar-line',
  },
  {
    id: 'ai_core',
    name: 'AI Core',
    category: 'Research',
    description: 'Advanced artificial intelligence accelerating all research.',
    maxLevel: 10,
    baseCost: { metal: 50000, crystal: 100000, deuterium: 50000 },
    costMultiplier: 2.5,
    baseBonus: { researchSpeed: 25 },
    applicableTo: ['starbase'],
    icon: 'ri-brain-line',
  },

  // ---- STORAGE ----
  {
    id: 'metal_storage',
    name: 'Metal Storage',
    category: 'Storage',
    description: 'Expands metal storage capacity.',
    maxLevel: 30,
    baseCost: { metal: 1000 },
    costMultiplier: 1.4,
    baseBonus: { metalCapacity: 10000 },
    applicableTo: ['planet', 'moon'],
    icon: 'ri-archive-line',
  },
  {
    id: 'crystal_storage',
    name: 'Crystal Storage',
    category: 'Storage',
    description: 'Expands crystal storage capacity.',
    maxLevel: 30,
    baseCost: { metal: 1000, crystal: 500 },
    costMultiplier: 1.4,
    baseBonus: { crystalCapacity: 10000 },
    applicableTo: ['planet', 'moon'],
    icon: 'ri-contrast-drop-line',
  },
  {
    id: 'deuterium_storage',
    name: 'Deuterium Storage',
    category: 'Storage',
    description: 'Expands deuterium storage capacity.',
    maxLevel: 30,
    baseCost: { metal: 2000, crystal: 2000 },
    costMultiplier: 1.4,
    baseBonus: { deuteriumCapacity: 10000 },
    applicableTo: ['planet', 'moon'],
    icon: 'ri-flask-fill',
  },
  {
    id: 'cargo_bay',
    name: 'Cargo Bay',
    category: 'Storage',
    description: 'Massive storage facility for trade goods and resources.',
    maxLevel: 25,
    baseCost: { metal: 3000, crystal: 2000 },
    costMultiplier: 1.5,
    baseBonus: { storageCapacity: 50000 },
    applicableTo: ['starbase'],
    icon: 'ri-archive-drawer-line',
  },

  // ---- SPECIAL ----
  {
    id: 'repair_dock',
    name: 'Repair Dock',
    category: 'Special',
    description: 'Services and repairs docked ships automatically over time.',
    maxLevel: 15,
    baseCost: { metal: 20000, crystal: 15000, deuterium: 10000 },
    costMultiplier: 1.8,
    baseBonus: { repairRate: 5 },
    applicableTo: ['starbase'],
    icon: 'ri-tools-line',
  },
  {
    id: 'trade_center',
    name: 'Trade Center',
    category: 'Special',
    description: 'Facilitates commerce and increases trade income.',
    maxLevel: 20,
    baseCost: { metal: 10000, crystal: 20000, deuterium: 5000 },
    costMultiplier: 1.6,
    baseBonus: { tradeBonus: 15 },
    applicableTo: ['starbase'],
    icon: 'ri-exchange-funds-line',
  },
];

// Building lookup helper
export const getBuildingDefinition = (id: string): BuildingDefinition | undefined => {
  return BUILDING_DEFINITIONS.find(b => b.id === id);
};

export const getBuildingsByCategory = (category: BuildingDefinition['category']): BuildingDefinition[] => {
  return BUILDING_DEFINITIONS.filter(b => b.category === category);
};

export const getBuildingsForType = (type: 'planet' | 'moon' | 'starbase'): BuildingDefinition[] => {
  return BUILDING_DEFINITIONS.filter(b => b.applicableTo.includes(type));
};

// Calculate building cost for a given level
export const calculateBuildingCost = (def: BuildingDefinition, level: number): { metal: number; crystal: number; deuterium: number; darkMatter?: number } => {
  const multiplier = Math.pow(def.costMultiplier, level - 1);
  return {
    metal: Math.floor((def.baseCost.metal || 0) * multiplier),
    crystal: Math.floor((def.baseCost.crystal || 0) * multiplier),
    deuterium: Math.floor((def.baseCost.deuterium || 0) * multiplier),
    darkMatter: def.baseCost.darkMatter ? Math.floor(def.baseCost.darkMatter * multiplier) : undefined,
  };
};

// ============================================================
// UPGRADE DEFINITIONS
// ============================================================

export const UPGRADE_DEFINITIONS: UpgradeDefinition[] = [
  {
    id: 'upgrade_basic_infrastructure',
    name: 'Basic Infrastructure Overhaul',
    tier: 'Basic',
    description: 'Upgrades roads, power grids, and basic utilities.',
    effects: [
      { type: 'production', value: 10, isPercentage: true },
      { type: 'capacity', target: 'population', value: 5000, isPercentage: false },
    ],
    cost: { metal: 10000, crystal: 5000, deuterium: 2000 },
    applicableTo: ['planet'],
    icon: 'ri-building-line',
  },
  {
    id: 'upgrade_advanced_power_grid',
    name: 'Advanced Power Grid',
    tier: 'Advanced',
    description: 'Installs a smart power distribution network.',
    effects: [
      { type: 'production', value: 20, isPercentage: true },
      { type: 'special', target: 'energy_efficiency', value: 15, isPercentage: true },
    ],
    cost: { metal: 50000, crystal: 30000, deuterium: 15000 },
    applicableTo: ['planet', 'moon'],
    icon: 'ri-plug-line',
  },
  {
    id: 'upgrade_defense_fortifications',
    name: 'Defense Fortifications',
    tier: 'Advanced',
    description: 'Reinforces defensive structures and adds layered defenses.',
    effects: [
      { type: 'defense', value: 30, isPercentage: true },
      { type: 'capacity', target: 'shield', value: 10000, isPercentage: false },
    ],
    cost: { metal: 80000, crystal: 50000, deuterium: 30000 },
    applicableTo: ['planet', 'moon', 'starbase'],
    icon: 'ri-shield-star-line',
  },
  {
    id: 'upgrade_superior_labs',
    name: 'Superior Research Complex',
    tier: 'Superior',
    description: 'State-of-the-art research facilities with quantum computing.',
    effects: [
      { type: 'research', value: 40, isPercentage: true },
      { type: 'special', target: 'discovery_rate', value: 25, isPercentage: true },
    ],
    cost: { metal: 150000, crystal: 200000, deuterium: 80000 },
    applicableTo: ['planet', 'moon', 'starbase'],
    icon: 'ri-flask-fill',
  },
  {
    id: 'upgrade_exceptional_shipyard',
    name: 'Exceptional Shipyard Expansion',
    tier: 'Exceptional',
    description: 'Massive shipyard capable of constructing capital vessels.',
    effects: [
      { type: 'production', target: 'ship_build_speed', value: 50, isPercentage: true },
      { type: 'capacity', target: 'dock_capacity', value: 20, isPercentage: false },
    ],
    cost: { metal: 500000, crystal: 300000, deuterium: 200000 },
    applicableTo: ['starbase'],
    icon: 'ri-anchor-line',
  },
  {
    id: 'upgrade_masterwork_habitat',
    name: 'Masterwork Habitat Enhancement',
    tier: 'Masterwork',
    description: 'Perfectly engineered living spaces maximizing population capacity.',
    effects: [
      { type: 'population', value: 50, isPercentage: true },
      { type: 'habitability', value: 15, isPercentage: false },
      { type: 'production', value: 30, isPercentage: true },
    ],
    cost: { metal: 1000000, crystal: 800000, deuterium: 500000, darkMatter: 200 },
    applicableTo: ['planet'],
    icon: 'ri-home-heart-line',
  },
  {
    id: 'upgrade_legendary_fortress',
    name: 'Legendary Fortress Conversion',
    tier: 'Legendary',
    description: 'Transforms the installation into an impregnable legendary fortress.',
    effects: [
      { type: 'defense', value: 100, isPercentage: true },
      { type: 'capacity', target: 'shield', value: 100000, isPercentage: false },
      { type: 'special', target: 'warp_interdiction', value: 1, isPercentage: false },
    ],
    cost: { metal: 5000000, crystal: 4000000, deuterium: 2000000, darkMatter: 1000 },
    applicableTo: ['starbase'],
    icon: 'ri-shield-cross-line',
  },
  {
    id: 'upgrade_mythic_nexus',
    name: 'Mythic Nexus Transcendence',
    tier: 'Mythic',
    description: 'The ultimate upgrade. Bends reality to maximize all capabilities beyond known limits.',
    effects: [
      { type: 'production', value: 200, isPercentage: true },
      { type: 'defense', value: 200, isPercentage: true },
      { type: 'research', value: 200, isPercentage: true },
      { type: 'population', value: 200, isPercentage: true },
      { type: 'habitability', value: 50, isPercentage: false },
      { type: 'special', target: 'reality_manipulation', value: 1, isPercentage: false },
    ],
    cost: { metal: 50000000, crystal: 40000000, deuterium: 20000000, darkMatter: 10000 },
    applicableTo: ['planet', 'moon', 'starbase'],
    icon: 'ri-star-smile-line',
  },
];

export const getUpgradeDefinition = (id: string): UpgradeDefinition | undefined => {
  return UPGRADE_DEFINITIONS.find(u => u.id === id);
};

export const getUpgradesForType = (type: 'planet' | 'moon' | 'starbase'): UpgradeDefinition[] => {
  return UPGRADE_DEFINITIONS.filter(u => u.applicableTo.includes(type));
};

// ============================================================
// PLANET CLASS-CATEGORY MAPPING
// ============================================================

export const PLANET_CLASS_TO_CATEGORY: Record<PlanetClassLetter, PlanetCategory> = {
  'A': 'Terrestrial', 'B': 'Terrestrial', 'C': 'Terrestrial', 'D': 'Terrestrial',
  'E': 'Exotic', 'F': 'Ice World', 'G': 'Gas Giant', 'H': 'Lava World',
  'I': 'Ice World', 'J': 'Terrestrial', 'K': 'Terrestrial', 'L': 'Lava World',
  'M': 'Terrestrial', 'N': 'Exotic', 'O': 'Terrestrial', 'P': 'Terrestrial',
  'Q': 'Exotic', 'R': 'Terrestrial', 'S': 'Terrestrial', 'T': 'Terrestrial',
  'U': 'Artificial', 'V': 'Lava World', 'W': 'Terrestrial', 'X': 'Exotic',
  'Y': 'Exotic', 'Z': 'Terrestrial',
};

export const MOON_CLASS_TO_CATEGORY: Record<MoonClassLetter, MoonCategory> = {
  'A': 'Exotic', 'B': 'Natural Satellite', 'C': 'Natural Satellite', 'D': 'Natural Satellite',
  'E': 'Exotic', 'F': 'Natural Satellite', 'G': 'Natural Satellite', 'H': 'Natural Satellite',
  'I': 'Natural Satellite', 'J': 'Natural Satellite', 'K': 'Natural Satellite', 'L': 'Natural Satellite',
  'M': 'Captured Asteroid', 'N': 'Natural Satellite', 'O': 'Natural Satellite', 'P': 'Natural Satellite',
  'Q': 'Exotic', 'R': 'Natural Satellite', 'S': 'Natural Satellite', 'T': 'Natural Satellite',
  'U': 'Natural Satellite', 'V': 'Natural Satellite', 'W': 'Natural Satellite',
  'X': 'Exotic', 'Y': 'Exotic', 'Z': 'Artificial',
};

export const STARBASE_CLASS_TO_CATEGORY: Record<StarbaseClassLetter, StarbaseCategory> = {
  'A': 'Orbital Station', 'B': 'Military Installation', 'C': 'Military Installation', 'D': 'Military Installation',
  'E': 'Trade Post', 'F': 'Military Installation', 'G': 'Orbital Station', 'H': 'Deep Space Station',
  'I': 'Production Center', 'J': 'Trade Post', 'K': 'Military Installation', 'L': 'Orbital Station',
  'M': 'Military Installation', 'N': 'Orbital Station', 'O': 'Orbital Station', 'P': 'Production Center',
  'Q': 'Deep Space Station', 'R': 'Research Facility', 'S': 'Production Center', 'T': 'Trade Post',
  'U': 'Research Facility', 'V': 'Deep Space Station', 'W': 'Orbital Station', 'X': 'Research Facility',
  'Y': 'Production Center', 'Z': 'Orbital Station',
};