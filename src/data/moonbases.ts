import {
  Moonbase,
  BuildingInstance,
} from '../types/gameTypes';

export const MOONBASE_DATA: Moonbase[] = [
  {
    id: 'moonbase_titan',
    name: 'Lunar Mining Outpost',
    moonId: 'moon_titan',
    level: 5,
    maxLevel: 20,
    upgradeLevel: 2,
    buildings: {
      'metal_mine': { buildingId: 'metal_mine', level: 3, isUpgrading: false },
      'crystal_mine': { buildingId: 'crystal_mine', level: 5, isUpgrading: false },
      'deuterium_synthesizer': { buildingId: 'deuterium_synthesizer', level: 8, isUpgrading: false },
      'research_lab': { buildingId: 'research_lab', level: 6, isUpgrading: false },
      'solar_plant': { buildingId: 'solar_plant', level: 4, isUpgrading: false },
      'laser_turret': { buildingId: 'laser_turret', level: 2, isUpgrading: false },
    },
    facilities: {
      miningStation: 5,
      researchLab: 2,
      defenseGrid: 3,
      storageDepot: 4,
      launchPad: 2,
    },
    garrison: { ships: 10, defenses: 50 },
    production: { metal: 500, crystal: 300, deuterium: 1000 },
    description: 'A basic mining outpost established on a resource-rich moon, focusing on deuterium extraction.',
    lore: 'The first moonbases were simple mining operations, but they quickly evolved into strategic military positions.',
    info: 'Established: 2154. Primary export: Deuterium (82% of output). 24 automated mining drones operational. Crew complement: 180.',
    specialFeatures: ['Automated Mining Drones', 'Ice Processing Facility', 'Emergency Shelter', 'Communication Relay'],
    upgradeCost: { metal: 10000, crystal: 5000, deuterium: 2000 },
  },
  {
    id: 'moonbase_phobos',
    name: 'Phobos Military Base',
    moonId: 'moon_phobos',
    level: 8,
    maxLevel: 25,
    upgradeLevel: 2,
    buildings: {
      'metal_mine': { buildingId: 'metal_mine', level: 8, isUpgrading: false },
      'solar_plant': { buildingId: 'solar_plant', level: 4, isUpgrading: false },
      'laser_turret': { buildingId: 'laser_turret', level: 10, isUpgrading: false },
      'plasma_cannon': { buildingId: 'plasma_cannon', level: 6, isUpgrading: false },
      'shield_generator': { buildingId: 'shield_generator', level: 5, isUpgrading: false },
      'missile_silo': { buildingId: 'missile_silo', level: 4, isUpgrading: false },
      'spaceport': { buildingId: 'spaceport', level: 3, isUpgrading: false },
    },
    facilities: {
      miningStation: 3,
      researchLab: 1,
      defenseGrid: 10,
      storageDepot: 5,
      launchPad: 8,
    },
    garrison: { ships: 50, defenses: 200 },
    production: { metal: 2000, crystal: 200, deuterium: 100 },
    description: 'A heavily fortified military base serving as a rapid deployment center for defensive operations.',
    lore: 'Phobos Military Base is the first line of defense for the inner system. Its strategic position allows for quick response to any threat.',
    info: 'Defense rating: Class-4. Response time: under 90 seconds. 12 missile silos. Orbital defense network linked to 3 neighboring systems.',
    specialFeatures: ['Rapid Deployment System', 'Advanced Radar Array', 'Missile Defense Network', 'Fighter Squadron Hangar', 'Tactical Command Center'],
    upgradeCost: { metal: 50000, crystal: 30000, deuterium: 10000 },
  },
  {
    id: 'moonbase_io',
    name: 'Io Research Station',
    moonId: 'moon_io',
    level: 10,
    maxLevel: 30,
    upgradeLevel: 3,
    buildings: {
      'metal_mine': { buildingId: 'metal_mine', level: 5, isUpgrading: false },
      'crystal_mine': { buildingId: 'crystal_mine', level: 7, isUpgrading: false },
      'geothermal_plant': { buildingId: 'geothermal_plant', level: 8, isUpgrading: false },
      'research_lab': { buildingId: 'research_lab', level: 15, isUpgrading: false },
      'robotics_factory': { buildingId: 'robotics_factory', level: 3, isUpgrading: false },
    },
    facilities: {
      miningStation: 8,
      researchLab: 15,
      defenseGrid: 5,
      storageDepot: 10,
      launchPad: 4,
    },
    garrison: { ships: 20, defenses: 100 },
    production: { metal: 1500, crystal: 3000, deuterium: 500 },
    description: 'An advanced research facility utilizing volcanic activity for energy and crystal production.',
    lore: 'Io Research Station is where the empire\'s greatest scientific minds work on breakthrough technologies.',
    info: 'Research output: Top 3 in empire. Geothermal power: 850 MW. Crystal synthesis capacity: 2,400 units/day. Staff: 1,250 scientists.',
    specialFeatures: ['Geothermal Power Plant', 'Crystal Synthesis Lab', 'Advanced Materials Research', 'Prototype Testing Facility', 'Quantum Computing Center'],
    upgradeCost: { metal: 80000, crystal: 100000, deuterium: 30000 },
  },
  {
    id: 'moonbase_europa',
    name: 'Europa Deep Station',
    moonId: 'moon_europa',
    level: 12,
    maxLevel: 35,
    upgradeLevel: 4,
    buildings: {
      'deuterium_synthesizer': { buildingId: 'deuterium_synthesizer', level: 15, isUpgrading: false },
      'research_lab': { buildingId: 'research_lab', level: 20, isUpgrading: false },
      'fusion_reactor': { buildingId: 'fusion_reactor', level: 8, isUpgrading: false },
      'metal_mine': { buildingId: 'metal_mine', level: 3, isUpgrading: false },
      'shield_generator': { buildingId: 'shield_generator', level: 6, isUpgrading: false },
    },
    facilities: {
      miningStation: 10,
      researchLab: 20,
      defenseGrid: 8,
      storageDepot: 15,
      launchPad: 6,
    },
    garrison: { ships: 30, defenses: 150 },
    production: { metal: 500, crystal: 1500, deuterium: 5000 },
    description: 'A cutting-edge facility dedicated to dark matter research and exotic energy extraction from the subsurface ocean.',
    lore: 'Europa Deep Station delves into the mysteries beneath the ice. Its scientists have made groundbreaking discoveries about dark matter.',
    info: 'Depth: 85 km below ice surface. Dark matter collection rate: 3.2 units/day. Research papers published: 847. Security clearance: Omega-Level.',
    specialFeatures: ['Dark Matter Collector', 'Subsurface Ocean Access', 'Exotic Energy Lab', 'Cryogenic Storage', 'Deep Space Communication Array', 'Xenobiology Research Center'],
    upgradeCost: { metal: 100000, crystal: 80000, deuterium: 120000, darkMatter: 50 },
  },
  {
    id: 'moonbase_callisto',
    name: 'Callisto Industrial Complex',
    moonId: 'moon_callisto',
    level: 15,
    maxLevel: 40,
    upgradeLevel: 4,
    buildings: {
      'metal_mine': { buildingId: 'metal_mine', level: 20, isUpgrading: false },
      'crystal_mine': { buildingId: 'crystal_mine', level: 8, isUpgrading: false },
      'spaceport': { buildingId: 'spaceport', level: 15, isUpgrading: false },
      'robotics_factory': { buildingId: 'robotics_factory', level: 8, isUpgrading: false },
      'fusion_reactor': { buildingId: 'fusion_reactor', level: 5, isUpgrading: false },
      'plasma_cannon': { buildingId: 'plasma_cannon', level: 7, isUpgrading: false },
    },
    facilities: {
      miningStation: 20,
      researchLab: 8,
      defenseGrid: 12,
      storageDepot: 25,
      launchPad: 15,
    },
    garrison: { ships: 100, defenses: 300 },
    production: { metal: 8000, crystal: 2000, deuterium: 1500 },
    description: 'A massive industrial complex serving as the primary shipbuilding and manufacturing center for the outer system.',
    lore: 'Callisto Industrial Complex is the beating heart of the empire\'s war machine, working around the clock.',
    info: 'Annual output: 47 frigates, 12 destroyers, 3 cruisers. 23 automated assembly lines. Workforce: 48,000. Energy consumption: 1.2 GW.',
    specialFeatures: ['Automated Shipyard', 'Mass Production Facilities', 'Advanced Robotics Factory', 'Nanite Assembly Plant', 'Heavy Industry Zone', 'Logistics Hub'],
    upgradeCost: { metal: 200000, crystal: 100000, deuterium: 80000, darkMatter: 100 },
  },
  {
    id: 'moonbase_ganymede',
    name: 'Ganymede Nexus',
    moonId: 'moon_ganymede',
    level: 18,
    maxLevel: 50,
    upgradeLevel: 5,
    buildings: {
      'metal_mine': { buildingId: 'metal_mine', level: 10, isUpgrading: false },
      'crystal_mine': { buildingId: 'crystal_mine', level: 10, isUpgrading: false },
      'deuterium_synthesizer': { buildingId: 'deuterium_synthesizer', level: 12, isUpgrading: false },
      'research_lab': { buildingId: 'research_lab', level: 25, isUpgrading: false },
      'fusion_reactor': { buildingId: 'fusion_reactor', level: 15, isUpgrading: false },
      'shield_generator': { buildingId: 'shield_generator', level: 12, isUpgrading: false },
      'plasma_cannon': { buildingId: 'plasma_cannon', level: 10, isUpgrading: false },
      'spaceport': { buildingId: 'spaceport', level: 8, isUpgrading: false },
    },
    facilities: {
      miningStation: 15,
      researchLab: 25,
      defenseGrid: 20,
      storageDepot: 30,
      launchPad: 20,
    },
    garrison: { ships: 200, defenses: 500 },
    production: { metal: 5000, crystal: 5000, deuterium: 5000 },
    description: 'The crown jewel of lunar installations - a nexus of research, industry, and military power built around exotic matter deposits.',
    lore: 'Ganymede Nexus is more than a moonbase; it\'s a self-sufficient city in space. Its exotic matter core provides nearly unlimited energy.',
    info: 'Population: 125,000 permanent residents. Self-sufficiency rating: 94%. Exotic matter output: Classified. Defensive capability: Fleet-equivalent. Emergency evacuation capacity: 500,000.',
    specialFeatures: ['Exotic Matter Reactor', 'Gravitational Research Lab', 'Temporal Studies Center', 'Ancient Artifact Vault', 'Precursor Technology Archive', 'Dimensional Gateway', 'Supreme Command Center'],
    upgradeCost: { metal: 500000, crystal: 500000, deuterium: 500000, darkMatter: 500 },
  },
];

export const getMoonbaseByMoonId = (moonId: string): Moonbase | undefined => {
  return MOONBASE_DATA.find(mb => mb.moonId === moonId);
};

export const calculateMoonbaseUpgradeCost = (moonbase: Moonbase, targetLevel: number): {
  metal: number;
  crystal: number;
  deuterium: number;
  darkMatter?: number;
} => {
  const levelDiff = targetLevel - moonbase.level;
  const multiplier = Math.pow(1.4, levelDiff);
  return {
    metal: Math.floor(moonbase.upgradeCost.metal * multiplier),
    crystal: Math.floor(moonbase.upgradeCost.crystal * multiplier),
    deuterium: Math.floor(moonbase.upgradeCost.deuterium * multiplier),
    darkMatter: moonbase.upgradeCost.darkMatter ? Math.floor(moonbase.upgradeCost.darkMatter * multiplier) : undefined,
  };
};

export const calculateMoonbaseProduction = (moonbase: Moonbase): {
  metal: number;
  crystal: number;
  deuterium: number;
} => {
  const levelBonus = 1 + (moonbase.level * 0.1);
  const miningBonus = 1 + (moonbase.facilities.miningStation * 0.05);
  return {
    metal: Math.floor(moonbase.production.metal * levelBonus * miningBonus),
    crystal: Math.floor(moonbase.production.crystal * levelBonus * miningBonus),
    deuterium: Math.floor(moonbase.production.deuterium * levelBonus * miningBonus),
  };
};