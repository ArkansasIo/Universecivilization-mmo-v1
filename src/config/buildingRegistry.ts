// ═══════════════════════════════════════════════════════════════════════════
// BUILDING REGISTRY — Full Classification System
// Categories → Subcategories → Types → Subtypes → Modules
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: BUILDING CATEGORY DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export const BUILDING_CATEGORIES = {
  // ── RESOURCE PRODUCTION ────────────────────────────────────────────────────
  Resource: {
    id:          'Resource',
    name:        'Resource Production',
    icon:        'ri-database-2-line',
    color:       '#F59E0B',
    description: 'Buildings that produce raw materials and energy',
    subcategories: {
      Mining: {
        id: 'Mining', name: 'Mining',
        buildings: ['metal_mine', 'crystal_mine', 'deuterium_synthesizer', 'dark_matter_extractor', 'antimatter_collector']
      },
      Energy: {
        id: 'Energy', name: 'Energy',
        buildings: ['solar_plant', 'fusion_reactor', 'solar_satellite', 'dark_energy_tap', 'antimatter_reactor']
      },
      Advanced: {
        id: 'Advanced', name: 'Advanced Resources',
        buildings: ['nanite_factory', 'quantum_processor', 'exotic_matter_lab']
      },
    },
  },

  // ── STORAGE ────────────────────────────────────────────────────────────────
  Storage: {
    id:          'Storage',
    name:        'Storage',
    icon:        'ri-archive-2-line',
    color:       '#10B981',
    description: 'Buildings that store resources and overflow protection',
    subcategories: {
      Basic: {
        id: 'Basic', name: 'Basic Storage',
        buildings: ['metal_storage', 'crystal_storage', 'deuterium_tank', 'energy_cell']
      },
      Advanced: {
        id: 'Advanced', name: 'Advanced Vaults',
        buildings: ['dark_matter_vault', 'antimatter_container', 'quantum_vault', 'secure_bunker']
      },
    },
  },

  // ── SHIPYARD & MILITARY PRODUCTION ────────────────────────────────────────
  Military: {
    id:          'Military',
    name:        'Military',
    icon:        'ri-sword-line',
    color:       '#EF4444',
    description: 'Shipyards, barracks, and military production',
    subcategories: {
      Shipyard: {
        id: 'Shipyard', name: 'Shipyard',
        buildings: ['shipyard', 'nano_shipyard', 'orbital_shipyard', 'titan_dock', 'mothership_bay']
      },
      RoboticsFactory: {
        id: 'RoboticsFactory', name: 'Robotics & Factory',
        buildings: ['robotics_factory', 'nanite_factory', 'advanced_factory', 'automation_hub']
      },
      MissileBase: {
        id: 'MissileBase', name: 'Missile Systems',
        buildings: ['missile_silo', 'orbital_battery', 'planetary_defense_hub']
      },
    },
  },

  // ── RESEARCH & TECHNOLOGY ─────────────────────────────────────────────────
  Research: {
    id:          'Research',
    name:        'Research',
    icon:        'ri-flask-line',
    color:       '#8B5CF6',
    description: 'Research labs and technology development',
    subcategories: {
      Labs: {
        id: 'Labs', name: 'Research Labs',
        buildings: ['research_lab', 'advanced_lab', 'quantum_research_center', 'think_tank', 'ai_core']
      },
      Specialized: {
        id: 'Specialized', name: 'Specialized Research',
        buildings: ['weapons_lab', 'propulsion_lab', 'bio_lab', 'xenotech_lab', 'temporal_research']
      },
    },
  },

  // ── CIVIL & INFRASTRUCTURE ─────────────────────────────────────────────────
  Civil: {
    id:          'Civil',
    name:        'Civil & Infrastructure',
    icon:        'ri-building-2-line',
    color:       '#6B7280',
    description: 'Population, economics, and planetary infrastructure',
    subcategories: {
      Population: {
        id: 'Population', name: 'Population',
        buildings: ['residential_dome', 'habitat_complex', 'mega_arcology', 'bio_dome', 'orbital_habitat']
      },
      Economic: {
        id: 'Economic', name: 'Economic',
        buildings: ['trading_post', 'interstellar_market', 'stock_exchange', 'credit_bank', 'imperial_mint']
      },
      Infrastructure: {
        id: 'Infrastructure', name: 'Infrastructure',
        buildings: ['command_center', 'logistics_hub', 'transit_network', 'spaceport', 'jump_gate']
      },
      Administrative: {
        id: 'Administrative', name: 'Administrative',
        buildings: ['governor_palace', 'senate', 'imperial_court', 'propaganda_center', 'academy']
      },
    },
  },

  // ── DEFENSE STRUCTURES ────────────────────────────────────────────────────
  Defense: {
    id:          'Defense',
    name:        'Defense',
    icon:        'ri-shield-line',
    color:       '#3B82F6',
    description: 'Planetary shields, turrets, and fortifications',
    subcategories: {
      Turrets: {
        id: 'Turrets', name: 'Weapon Turrets',
        buildings: ['rocket_launcher', 'light_laser', 'heavy_laser', 'gauss_cannon', 'ion_cannon', 'plasma_turret']
      },
      Shields: {
        id: 'Shields', name: 'Shield Systems',
        buildings: ['small_shield_dome', 'large_shield_dome', 'planetary_shield', 'force_field_generator']
      },
      Fortifications: {
        id: 'Fortifications', name: 'Fortifications',
        buildings: ['bunker', 'reinforced_silo', 'underground_complex', 'planetary_fortress']
      },
      SpecialWeapons: {
        id: 'SpecialWeapons', name: 'Special Weapons',
        buildings: ['interplanetary_missile', 'anti_ballistic_missile', 'death_star_cannon', 'phalanx_sensor']
      },
    },
  },

  // ── SPECIAL & ADVANCED ────────────────────────────────────────────────────
  Special: {
    id:          'Special',
    name:        'Special Structures',
    icon:        'ri-star-line',
    color:       '#F97316',
    description: 'Unique and powerful special structures',
    subcategories: {
      Unique: {
        id: 'Unique', name: 'Unique Structures',
        buildings: ['terraformer', 'lunar_base', 'sensor_phalanx', 'hyperspace_gate', 'space_dock']
      },
      Starbase: {
        id: 'Starbase', name: 'Starbases',
        buildings: ['outpost', 'trading_station', 'military_station', 'nexus_station', 'orbital_fortress']
      },
      Megastructure: {
        id: 'Megastructure', name: 'Megastructures',
        buildings: ['dyson_sphere', 'ring_world', 'orbital_habitat', 'stellar_engine', 'matrioshka_brain']
      },
    },
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: FULL BUILDING DEFINITIONS (key buildings)
// ─────────────────────────────────────────────────────────────────────────────

export interface BuildingDef {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  tier: number;
  maxLevel: number;
  description: string;
  // Cost at level N = baseCost * costFactor^(level-1)
  baseCost: { metal: number; crystal: number; deuterium: number; energy?: number };
  costFactor: number;
  // Time at level N = baseTime * timeFactor^(level-1) seconds
  baseTime: number;
  timeFactor: number;
  // Production per level (if applicable)
  productionPerLevel?: Partial<Record<string, number>>;
  // Energy consumption per level
  energyConsumption?: number;
  // Requirements
  requirements?: { buildings?: Record<string, number>; research?: Record<string, number> };
  // Module system
  modules?: string[];
  unique?: boolean;
}

export const BUILDING_REGISTRY: Record<string, BuildingDef> = {
  // ── MINES ────────────────────────────────────────────────────────────────
  metal_mine: {
    id: 'metal_mine', name: 'Metal Mine', category: 'Resource', subcategory: 'Mining',
    tier: 1, maxLevel: 40, description: 'Extracts metal ore from the planet crust.',
    baseCost: { metal: 60, crystal: 15, deuterium: 0 }, costFactor: 1.5,
    baseTime: 10, timeFactor: 1.5,
    productionPerLevel: { metal: 30 },
    energyConsumption: 10,
    modules: ['efficiency_booster', 'deep_drill', 'quantum_extractor'],
  },
  crystal_mine: {
    id: 'crystal_mine', name: 'Crystal Mine', category: 'Resource', subcategory: 'Mining',
    tier: 1, maxLevel: 40, description: 'Harvests crystal formations.',
    baseCost: { metal: 48, crystal: 24, deuterium: 0 }, costFactor: 1.6,
    baseTime: 12, timeFactor: 1.6,
    productionPerLevel: { crystal: 20 },
    energyConsumption: 10,
    modules: ['efficiency_booster', 'resonance_crystal', 'photon_drill'],
  },
  deuterium_synthesizer: {
    id: 'deuterium_synthesizer', name: 'Deuterium Synthesizer', category: 'Resource', subcategory: 'Mining',
    tier: 1, maxLevel: 40, description: 'Extracts deuterium from the atmosphere.',
    baseCost: { metal: 225, crystal: 75, deuterium: 0 }, costFactor: 1.5,
    baseTime: 20, timeFactor: 1.5,
    productionPerLevel: { deuterium: 10 },
    energyConsumption: 20,
    modules: ['efficiency_booster', 'cold_fusion', 'isotope_separator'],
  },
  dark_matter_extractor: {
    id: 'dark_matter_extractor', name: 'Dark Matter Extractor', category: 'Resource', subcategory: 'Mining',
    tier: 5, maxLevel: 20, description: 'Extracts trace dark matter from space.',
    baseCost: { metal: 10000, crystal: 8000, deuterium: 5000 }, costFactor: 2.0,
    baseTime: 3600, timeFactor: 2.0,
    productionPerLevel: { dark_matter: 1 },
    energyConsumption: 100,
    requirements: { research: { astrophysics: 5, dark_matter_research: 1 } },
    modules: ['quantum_lens', 'void_tap'],
  },

  // ── ENERGY ────────────────────────────────────────────────────────────────
  solar_plant: {
    id: 'solar_plant', name: 'Solar Plant', category: 'Resource', subcategory: 'Energy',
    tier: 1, maxLevel: 40, description: 'Converts sunlight into energy.',
    baseCost: { metal: 75, crystal: 30, deuterium: 0 }, costFactor: 1.5,
    baseTime: 10, timeFactor: 1.5,
    productionPerLevel: { energy: 22 },
    energyConsumption: 0,
    modules: ['solar_collector', 'reflector_array'],
  },
  fusion_reactor: {
    id: 'fusion_reactor', name: 'Fusion Reactor', category: 'Resource', subcategory: 'Energy',
    tier: 3, maxLevel: 30, description: 'Generates energy via nuclear fusion.',
    baseCost: { metal: 900, crystal: 360, deuterium: 180 }, costFactor: 1.8,
    baseTime: 180, timeFactor: 1.8,
    productionPerLevel: { energy: 50 },
    energyConsumption: 0,
    requirements: { research: { energy_technology: 3, physics: 6 } },
    modules: ['containment_field', 'plasma_injector', 'heat_sink'],
  },
  antimatter_reactor: {
    id: 'antimatter_reactor', name: 'Antimatter Reactor', category: 'Resource', subcategory: 'Energy',
    tier: 8, maxLevel: 15, description: 'Harnesses antimatter annihilation for vast energy.',
    baseCost: { metal: 500000, crystal: 250000, deuterium: 100000 }, costFactor: 2.5,
    baseTime: 86400, timeFactor: 2.0,
    productionPerLevel: { energy: 500 },
    energyConsumption: 0,
    requirements: { research: { energy_technology: 12, antimatter_research: 3 } },
    unique: false,
    modules: ['containment_matrix', 'quantum_stabilizer'],
  },

  // ── STORAGE ────────────────────────────────────────────────────────────────
  metal_storage: {
    id: 'metal_storage', name: 'Metal Storage', category: 'Storage', subcategory: 'Basic',
    tier: 1, maxLevel: 15, description: 'Increases metal storage capacity.',
    baseCost: { metal: 1000, crystal: 0, deuterium: 0 }, costFactor: 2.0,
    baseTime: 30, timeFactor: 2.0,
    productionPerLevel: { metal_capacity: 100000 },
    modules: ['overflow_protection', 'compression_module'],
  },
  crystal_storage: {
    id: 'crystal_storage', name: 'Crystal Storage', category: 'Storage', subcategory: 'Basic',
    tier: 1, maxLevel: 15, description: 'Increases crystal storage capacity.',
    baseCost: { metal: 1000, crystal: 500, deuterium: 0 }, costFactor: 2.0,
    baseTime: 30, timeFactor: 2.0,
    productionPerLevel: { crystal_capacity: 100000 },
    modules: ['overflow_protection', 'compression_module'],
  },
  deuterium_tank: {
    id: 'deuterium_tank', name: 'Deuterium Tank', category: 'Storage', subcategory: 'Basic',
    tier: 1, maxLevel: 15, description: 'Stores deuterium fuel.',
    baseCost: { metal: 1000, crystal: 1000, deuterium: 0 }, costFactor: 2.0,
    baseTime: 40, timeFactor: 2.0,
    productionPerLevel: { deuterium_capacity: 100000 },
    modules: ['overflow_protection', 'cryo_stabilizer'],
  },

  // ── SHIPYARD ───────────────────────────────────────────────────────────────
  shipyard: {
    id: 'shipyard', name: 'Shipyard', category: 'Military', subcategory: 'Shipyard',
    tier: 1, maxLevel: 12, description: 'Builds ships and defense structures.',
    baseCost: { metal: 400, crystal: 200, deuterium: 100 }, costFactor: 2.0,
    baseTime: 60, timeFactor: 2.0,
    requirements: { buildings: { robotics_factory: 2 } },
    modules: ['rapid_assembly', 'quality_control', 'automated_welder', 'dry_dock_ext'],
  },
  nano_shipyard: {
    id: 'nano_shipyard', name: 'Nano Shipyard', category: 'Military', subcategory: 'Shipyard',
    tier: 5, maxLevel: 10, description: 'Nano-assembly for faster ship construction.',
    baseCost: { metal: 1000000, crystal: 500000, deuterium: 100000 }, costFactor: 3.0,
    baseTime: 172800, timeFactor: 1.5,
    requirements: { buildings: { shipyard: 12, robotics_factory: 10, nanite_factory: 1 }, research: { nanotechnology: 10 } },
    modules: ['nano_assembler', 'molecular_forge', 'quantum_printer'],
    unique: true,
  },
  orbital_shipyard: {
    id: 'orbital_shipyard', name: 'Orbital Shipyard', category: 'Military', subcategory: 'Shipyard',
    tier: 7, maxLevel: 8, description: 'Orbital construction platform for capital ships.',
    baseCost: { metal: 5000000, crystal: 2000000, deuterium: 500000 }, costFactor: 3.5,
    baseTime: 604800, timeFactor: 2.0,
    requirements: { buildings: { shipyard: 12, nano_shipyard: 5 }, research: { hyperspace_technology: 8 } },
    modules: ['orbital_crane', 'zero_g_assembly', 'mag_track_launcher'],
    unique: true,
  },

  // ── ROBOTICS & FACTORIES ──────────────────────────────────────────────────
  robotics_factory: {
    id: 'robotics_factory', name: 'Robotics Factory', category: 'Military', subcategory: 'RoboticsFactory',
    tier: 1, maxLevel: 15, description: 'Reduces build times for all structures.',
    baseCost: { metal: 400, crystal: 120, deuterium: 200 }, costFactor: 2.0,
    baseTime: 60, timeFactor: 2.0,
    productionPerLevel: { build_speed_bonus: 0.1 },
    modules: ['automation_upgrade', 'precision_arm', 'assembly_line'],
  },
  nanite_factory: {
    id: 'nanite_factory', name: 'Nanite Factory', category: 'Military', subcategory: 'RoboticsFactory',
    tier: 4, maxLevel: 10, description: 'Nano-robots drastically speed up construction.',
    baseCost: { metal: 1000000, crystal: 500000, deuterium: 100000 }, costFactor: 3.0,
    baseTime: 172800, timeFactor: 1.5,
    requirements: { buildings: { robotics_factory: 10, computer_tech: 10 } },
    productionPerLevel: { build_speed_bonus: 0.5 },
    unique: true,
    modules: ['nano_swarm', 'self_replication'],
  },

  // ── RESEARCH LABS ─────────────────────────────────────────────────────────
  research_lab: {
    id: 'research_lab', name: 'Research Laboratory', category: 'Research', subcategory: 'Labs',
    tier: 1, maxLevel: 20, description: 'Required for all research; higher level speeds research.',
    baseCost: { metal: 200, crystal: 400, deuterium: 200 }, costFactor: 2.0,
    baseTime: 60, timeFactor: 2.0,
    productionPerLevel: { research_speed_bonus: 0.1 },
    modules: ['quantum_computer', 'ai_assistant', 'data_network'],
  },
  advanced_lab: {
    id: 'advanced_lab', name: 'Advanced Research Center', category: 'Research', subcategory: 'Labs',
    tier: 4, maxLevel: 15, description: 'Required for tier-2 technologies.',
    baseCost: { metal: 10000, crystal: 20000, deuterium: 10000 }, costFactor: 2.0,
    baseTime: 3600, timeFactor: 1.8,
    requirements: { buildings: { research_lab: 12 }, research: { intergalactic_research_network: 3 } },
    modules: ['quantum_entanglement', 'neural_interface', 'xenotech_lab'],
  },

  // ── CIVIL ─────────────────────────────────────────────────────────────────
  command_center: {
    id: 'command_center', name: 'Command Center', category: 'Civil', subcategory: 'Infrastructure',
    tier: 2, maxLevel: 10, description: 'Reduces fleet response time and increases command capacity.',
    baseCost: { metal: 5000, crystal: 3000, deuterium: 1000 }, costFactor: 2.0,
    baseTime: 300, timeFactor: 2.0,
    modules: ['tactical_AI', 'comms_relay', 'battle_computer'],
    unique: true,
  },
  terraformer: {
    id: 'terraformer', name: 'Terraformer', category: 'Special', subcategory: 'Unique',
    tier: 5, maxLevel: 10, description: 'Increases planet field count by 5 per level.',
    baseCost: { metal: 0, crystal: 50000, deuterium: 100000 }, costFactor: 2.0,
    baseTime: 86400, timeFactor: 1.5,
    requirements: { research: { energy_technology: 12, nanotechnology: 10 } },
    productionPerLevel: { build_slots: 5 },
    unique: true,
    modules: [],
  },

  // ── DEFENSE ───────────────────────────────────────────────────────────────
  rocket_launcher: {
    id: 'rocket_launcher', name: 'Rocket Launcher', category: 'Defense', subcategory: 'Turrets',
    tier: 1, maxLevel: 999, description: 'Basic anti-ship rocket battery.',
    baseCost: { metal: 2000, crystal: 0, deuterium: 0 }, costFactor: 1.0,
    baseTime: 4, timeFactor: 1.0,
    modules: ['autoloader', 'guidance_system'],
  },
  light_laser: {
    id: 'light_laser', name: 'Light Laser', category: 'Defense', subcategory: 'Turrets',
    tier: 1, maxLevel: 999, description: 'Fast-firing laser battery.',
    baseCost: { metal: 1500, crystal: 500, deuterium: 0 }, costFactor: 1.0,
    baseTime: 5, timeFactor: 1.0,
    requirements: { research: { laser_technology: 3 } },
    modules: ['focusing_lens', 'cooling_system'],
  },
  plasma_turret: {
    id: 'plasma_turret', name: 'Plasma Turret', category: 'Defense', subcategory: 'Turrets',
    tier: 4, maxLevel: 999, description: 'Devastating plasma weapons against capital ships.',
    baseCost: { metal: 50000, crystal: 50000, deuterium: 30000 }, costFactor: 1.0,
    baseTime: 360, timeFactor: 1.0,
    requirements: { research: { plasma_technology: 7 } },
    modules: ['plasma_injector', 'heat_dissipator'],
  },
  small_shield_dome: {
    id: 'small_shield_dome', name: 'Small Shield Dome', category: 'Defense', subcategory: 'Shields',
    tier: 2, maxLevel: 1, description: 'Planetary shield - only one can be active.',
    baseCost: { metal: 10000, crystal: 10000, deuterium: 0 }, costFactor: 1.0,
    baseTime: 150, timeFactor: 1.0,
    requirements: { research: { shielding_technology: 2 } },
    unique: true,
    modules: [],
  },
  large_shield_dome: {
    id: 'large_shield_dome', name: 'Large Shield Dome', category: 'Defense', subcategory: 'Shields',
    tier: 3, maxLevel: 1, description: 'Powerful planetary shield covering all defenses.',
    baseCost: { metal: 50000, crystal: 50000, deuterium: 0 }, costFactor: 1.0,
    baseTime: 1500, timeFactor: 1.0,
    requirements: { research: { shielding_technology: 6 } },
    unique: true,
    modules: [],
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: BUILDING MODULE SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

export const BUILDING_MODULES = {
  // Production modules
  efficiency_booster:    { id: 'efficiency_booster',  name: 'Efficiency Booster',   effect: 'production', bonus: 0.1,  maxSlots: 3 },
  deep_drill:            { id: 'deep_drill',           name: 'Deep Drill',           effect: 'production', bonus: 0.2,  maxSlots: 1 },
  quantum_extractor:     { id: 'quantum_extractor',    name: 'Quantum Extractor',    effect: 'production', bonus: 0.35, maxSlots: 1 },
  // Energy modules
  solar_collector:       { id: 'solar_collector',      name: 'Solar Collector',      effect: 'energy',     bonus: 0.15, maxSlots: 2 },
  containment_field:     { id: 'containment_field',    name: 'Containment Field',    effect: 'energy',     bonus: 0.2,  maxSlots: 2 },
  // Speed modules
  automation_upgrade:    { id: 'automation_upgrade',   name: 'Automation Upgrade',   effect: 'speed',      bonus: 0.15, maxSlots: 2 },
  assembly_line:         { id: 'assembly_line',        name: 'Assembly Line',        effect: 'speed',      bonus: 0.25, maxSlots: 1 },
  rapid_assembly:        { id: 'rapid_assembly',       name: 'Rapid Assembly',       effect: 'speed',      bonus: 0.3,  maxSlots: 1 },
  // Research modules
  quantum_computer:      { id: 'quantum_computer',     name: 'Quantum Computer',     effect: 'research',   bonus: 0.2,  maxSlots: 2 },
  ai_assistant:          { id: 'ai_assistant',         name: 'AI Assistant',         effect: 'research',   bonus: 0.15, maxSlots: 2 },
  // Defense modules
  autoloader:            { id: 'autoloader',           name: 'Autoloader',           effect: 'fire_rate',  bonus: 0.2,  maxSlots: 1 },
  guidance_system:       { id: 'guidance_system',      name: 'Guidance System',      effect: 'accuracy',   bonus: 0.15, maxSlots: 1 },
  focusing_lens:         { id: 'focusing_lens',        name: 'Focusing Lens',        effect: 'damage',     bonus: 0.2,  maxSlots: 1 },
  // Storage modules
  overflow_protection:   { id: 'overflow_protection',  name: 'Overflow Protection',  effect: 'storage',    bonus: 0.5,  maxSlots: 1 },
  compression_module:    { id: 'compression_module',   name: 'Compression Module',   effect: 'storage',    bonus: 0.25, maxSlots: 2 },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: BUILD COST FORMULA HELPER
// ─────────────────────────────────────────────────────────────────────────────

export function getBuildingCost(buildingId: string, level: number): { metal: number; crystal: number; deuterium: number } {
  const def = BUILDING_REGISTRY[buildingId];
  if (!def) return { metal: 0, crystal: 0, deuterium: 0 };
  const factor = Math.pow(def.costFactor, level - 1);
  return {
    metal:      Math.floor(def.baseCost.metal * factor),
    crystal:    Math.floor(def.baseCost.crystal * factor),
    deuterium:  Math.floor(def.baseCost.deuterium * factor),
  };
}

export function getBuildingTime(buildingId: string, level: number, roboticsLevel: number = 0, naniteLevel: number = 0): number {
  const def = BUILDING_REGISTRY[buildingId];
  if (!def) return 0;
  const base = def.baseTime * Math.pow(def.timeFactor, level - 1);
  const roboticsDiv = 1 + roboticsLevel;
  const naniteDiv = naniteLevel > 0 ? Math.pow(2, naniteLevel) : 1;
  return Math.max(1, Math.floor(base / roboticsDiv / naniteDiv));
}
