// ═══════════════════════════════════════════════════════════════════════════
// RESEARCH TECH TREE — Full Classification System
// Categories → Subcategories → Technologies → Subtypes → Levels
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: RESEARCH CATEGORIES & SUBCATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

export const RESEARCH_CATEGORIES = {
  Combat: {
    id: 'Combat', name: 'Combat Technologies', icon: 'ri-sword-line', color: '#EF4444',
    description: 'Offensive and combat improvement technologies',
    subcategories: ['Weapons', 'Targeting', 'Tactics', 'Special Weapons'],
  },
  Defense: {
    id: 'Defense', name: 'Defense Technologies', icon: 'ri-shield-line', color: '#3B82F6',
    description: 'Armor, shielding, and defensive capabilities',
    subcategories: ['Armor', 'Shielding', 'Fortification', 'Counter-Measures'],
  },
  Propulsion: {
    id: 'Propulsion', name: 'Propulsion Technologies', icon: 'ri-rocket-line', color: '#10B981',
    description: 'Speed, range, and fleet mobility improvements',
    subcategories: ['Sub-light', 'FTL', 'Hyperspace', 'Dimensional'],
  },
  Energy: {
    id: 'Energy', name: 'Energy Technologies', icon: 'ri-flashlight-line', color: '#F59E0B',
    description: 'Power generation and energy efficiency',
    subcategories: ['Generation', 'Efficiency', 'Storage', 'Exotic Energy'],
  },
  Economic: {
    id: 'Economic', name: 'Economic Technologies', icon: 'ri-coins-line', color: '#8B5CF6',
    description: 'Production, trade, and economic improvements',
    subcategories: ['Mining', 'Production', 'Trade', 'Finance'],
  },
  Espionage: {
    id: 'Espionage', name: 'Espionage Technologies', icon: 'ri-user-search-line', color: '#6B7280',
    description: 'Intelligence gathering and counter-espionage',
    subcategories: ['Surveillance', 'Counter-Intel', 'Stealth'],
  },
  Advanced: {
    id: 'Advanced', name: 'Advanced Technologies', icon: 'ri-flask-line', color: '#EC4899',
    description: 'Cutting-edge research unlocking powerful capabilities',
    subcategories: ['Nanotechnology', 'Quantum', 'Xenotech', 'Cosmic'],
  },
  Astrophysics: {
    id: 'Astrophysics', name: 'Astrophysics', icon: 'ri-planet-line', color: '#14B8A6',
    description: 'Universe exploration and colonization research',
    subcategories: ['Exploration', 'Colonization', 'Planetary', 'Stellar'],
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: FULL TECHNOLOGY DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export interface TechDef {
  id:           string;
  name:         string;
  category:     string;
  subcategory:  string;
  tier:         number;
  maxLevel:     number;
  description:  string;
  // Effects per level
  effects:      { type: string; target: string; valuePerLevel: number; unit: string }[];
  // Cost at level N = baseCost * costFactor^(level-1)
  baseCost:     { metal: number; crystal: number; deuterium: number };
  costFactor:   number;
  // Research time in seconds at level N = baseTime * timeFactor^(level-1)
  baseTime:     number;
  timeFactor:   number;
  // Prerequisites
  requirements: { research?: Record<string, number>; buildings?: Record<string, number> };
  // What this unlocks
  unlocks?:     string[];
  icon:         string;
}

export const RESEARCH_TREE: Record<string, TechDef> = {

  // ═══════════════════════════════════════════════════════════════════════════
  // COMBAT TECHNOLOGIES
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Weapons ────────────────────────────────────────────────────────────────
  laser_technology: {
    id: 'laser_technology', name: 'Laser Technology', category: 'Combat', subcategory: 'Weapons',
    tier: 1, maxLevel: 25,
    description: 'Develops laser weapons for ships and defense structures.',
    effects: [{ type: 'weapon_damage', target: 'laser_weapons', valuePerLevel: 0.05, unit: '%' }],
    baseCost: { metal: 200, crystal: 100, deuterium: 0 }, costFactor: 1.5,
    baseTime: 60, timeFactor: 1.5,
    requirements: { buildings: { research_lab: 1 } },
    unlocks: ['light_laser', 'heavy_laser', 'ion_technology'],
    icon: 'ri-flashlight-line',
  },
  ion_technology: {
    id: 'ion_technology', name: 'Ion Technology', category: 'Combat', subcategory: 'Weapons',
    tier: 2, maxLevel: 25,
    description: 'Develops ion cannons that disable enemy shields.',
    effects: [
      { type: 'weapon_damage', target: 'ion_weapons', valuePerLevel: 0.05, unit: '%' },
      { type: 'shield_bypass', target: 'all', valuePerLevel: 0.02, unit: '%' },
    ],
    baseCost: { metal: 1000, crystal: 300, deuterium: 100 }, costFactor: 1.6,
    baseTime: 240, timeFactor: 1.6,
    requirements: { research: { laser_technology: 5 }, buildings: { research_lab: 4 } },
    unlocks: ['ion_cannon', 'ion_engine'],
    icon: 'ri-flashlight-fill',
  },
  plasma_technology: {
    id: 'plasma_technology', name: 'Plasma Technology', category: 'Combat', subcategory: 'Weapons',
    tier: 3, maxLevel: 20,
    description: 'Plasma weapons deal massive hull damage.',
    effects: [{ type: 'weapon_damage', target: 'plasma_weapons', valuePerLevel: 0.1, unit: '%' }],
    baseCost: { metal: 2000, crystal: 4000, deuterium: 1000 }, costFactor: 1.8,
    baseTime: 600, timeFactor: 1.8,
    requirements: { research: { laser_technology: 10, ion_technology: 5, energy_technology: 8 }, buildings: { research_lab: 6 } },
    unlocks: ['plasma_turret', 'plasma_cannon', 'plasma_drive'],
    icon: 'ri-fire-line',
  },
  weapons_technology: {
    id: 'weapons_technology', name: 'Weapons Technology', category: 'Combat', subcategory: 'Weapons',
    tier: 1, maxLevel: 30,
    description: 'General weapons improvement for all ship weapons.',
    effects: [{ type: 'weapon_damage', target: 'all', valuePerLevel: 0.1, unit: '%' }],
    baseCost: { metal: 800, crystal: 200, deuterium: 0 }, costFactor: 2.0,
    baseTime: 120, timeFactor: 2.0,
    requirements: { buildings: { research_lab: 4 } },
    unlocks: ['hyperspace_cannon', 'graviton_cannon'],
    icon: 'ri-sword-line',
  },

  // ── Targeting ──────────────────────────────────────────────────────────────
  targeting_systems: {
    id: 'targeting_systems', name: 'Targeting Systems', category: 'Combat', subcategory: 'Targeting',
    tier: 2, maxLevel: 20,
    description: 'Improves ship targeting accuracy and critical chance.',
    effects: [
      { type: 'accuracy',        target: 'all', valuePerLevel: 0.03, unit: '%' },
      { type: 'critical_chance', target: 'all', valuePerLevel: 0.01, unit: '%' },
    ],
    baseCost: { metal: 500, crystal: 1000, deuterium: 200 }, costFactor: 1.7,
    baseTime: 180, timeFactor: 1.7,
    requirements: { research: { computer_technology: 3 }, buildings: { research_lab: 5 } },
    unlocks: ['advanced_targeting', 'predictive_targeting'],
    icon: 'ri-focus-3-line',
  },
  advanced_targeting: {
    id: 'advanced_targeting', name: 'Advanced Targeting', category: 'Combat', subcategory: 'Targeting',
    tier: 3, maxLevel: 15,
    description: 'Advanced AI-driven targeting systems.',
    effects: [
      { type: 'accuracy',        target: 'all', valuePerLevel: 0.05, unit: '%' },
      { type: 'critical_damage', target: 'all', valuePerLevel: 0.05, unit: '%' },
    ],
    baseCost: { metal: 5000, crystal: 8000, deuterium: 2000 }, costFactor: 2.0,
    baseTime: 900, timeFactor: 2.0,
    requirements: { research: { targeting_systems: 10, ai_research: 3 } },
    icon: 'ri-crosshair-line',
  },

  // ── Special Weapons ────────────────────────────────────────────────────────
  graviton_technology: {
    id: 'graviton_technology', name: 'Graviton Technology', category: 'Combat', subcategory: 'Special Weapons',
    tier: 5, maxLevel: 10,
    description: 'Graviton weapons that manipulate gravity to destroy enemies.',
    effects: [{ type: 'weapon_damage', target: 'graviton_weapons', valuePerLevel: 0.2, unit: '%' }],
    baseCost: { metal: 0, crystal: 0, deuterium: 0 }, costFactor: 1.0,
    baseTime: 0, timeFactor: 1.0, // Costs energy to research
    requirements: { research: { energy_technology: 12 }, buildings: { research_lab: 12 } },
    unlocks: ['deathstar'],
    icon: 'ri-space-ship-line',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEFENSE TECHNOLOGIES
  // ═══════════════════════════════════════════════════════════════════════════

  shielding_technology: {
    id: 'shielding_technology', name: 'Shielding Technology', category: 'Defense', subcategory: 'Shielding',
    tier: 1, maxLevel: 30,
    description: 'Improves all ship and defense structure shields.',
    effects: [{ type: 'shield_strength', target: 'all', valuePerLevel: 0.1, unit: '%' }],
    baseCost: { metal: 200, crystal: 600, deuterium: 0 }, costFactor: 2.0,
    baseTime: 120, timeFactor: 2.0,
    requirements: { research: { energy_technology: 3 }, buildings: { research_lab: 6 } },
    unlocks: ['small_shield_dome', 'large_shield_dome', 'shield_tech_advanced'],
    icon: 'ri-shield-line',
  },
  armor_technology: {
    id: 'armor_technology', name: 'Armor Technology', category: 'Defense', subcategory: 'Armor',
    tier: 1, maxLevel: 30,
    description: 'Improves hull strength of all ships and structures.',
    effects: [{ type: 'hull_strength', target: 'all', valuePerLevel: 0.1, unit: '%' }],
    baseCost: { metal: 1000, crystal: 0, deuterium: 0 }, costFactor: 2.0,
    baseTime: 120, timeFactor: 2.0,
    requirements: { buildings: { research_lab: 2 } },
    unlocks: ['advanced_armor', 'nano_armor'],
    icon: 'ri-shield-fill',
  },
  advanced_armor: {
    id: 'advanced_armor', name: 'Advanced Armor Systems', category: 'Defense', subcategory: 'Armor',
    tier: 3, maxLevel: 20,
    description: 'Next-generation hull plating with self-repair properties.',
    effects: [
      { type: 'hull_strength',  target: 'all', valuePerLevel: 0.15, unit: '%' },
      { type: 'repair_rate',    target: 'all', valuePerLevel: 0.05, unit: '%' },
    ],
    baseCost: { metal: 10000, crystal: 5000, deuterium: 1000 }, costFactor: 2.0,
    baseTime: 1800, timeFactor: 2.0,
    requirements: { research: { armor_technology: 10, nanotechnology: 3 } },
    icon: 'ri-shield-star-line',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROPULSION TECHNOLOGIES
  // ═══════════════════════════════════════════════════════════════════════════

  combustion_drive: {
    id: 'combustion_drive', name: 'Combustion Drive', category: 'Propulsion', subcategory: 'Sub-light',
    tier: 1, maxLevel: 30,
    description: 'Basic propulsion for light combat ships.',
    effects: [{ type: 'speed', target: 'fighter|small_transport', valuePerLevel: 0.1, unit: '%' }],
    baseCost: { metal: 400, crystal: 0, deuterium: 600 }, costFactor: 2.0,
    baseTime: 60, timeFactor: 2.0,
    requirements: { research: { energy_technology: 1 }, buildings: { research_lab: 1 } },
    unlocks: ['small_transport', 'light_fighter'],
    icon: 'ri-rocket-2-line',
  },
  impulse_drive: {
    id: 'impulse_drive', name: 'Impulse Drive', category: 'Propulsion', subcategory: 'Sub-light',
    tier: 2, maxLevel: 30,
    description: 'Improved drive for medium and heavy ships.',
    effects: [{ type: 'speed', target: 'cruiser|heavy_fighter|bomber', valuePerLevel: 0.2, unit: '%' }],
    baseCost: { metal: 2000, crystal: 4000, deuterium: 600 }, costFactor: 2.0,
    baseTime: 240, timeFactor: 2.0,
    requirements: { research: { energy_technology: 1 }, buildings: { research_lab: 2 } },
    unlocks: ['cruiser', 'bomber', 'recycler'],
    icon: 'ri-rocket-line',
  },
  hyperspace_drive: {
    id: 'hyperspace_drive', name: 'Hyperspace Drive', category: 'Propulsion', subcategory: 'Hyperspace',
    tier: 3, maxLevel: 25,
    description: 'FTL travel for capital ships.',
    effects: [
      { type: 'speed',          target: 'capital_ships', valuePerLevel: 0.3,  unit: '%' },
      { type: 'jump_range',     target: 'all',           valuePerLevel: 1,    unit: 'ly' },
    ],
    baseCost: { metal: 10000, crystal: 20000, deuterium: 6000 }, costFactor: 2.0,
    baseTime: 900, timeFactor: 2.0,
    requirements: { research: { hyperspace_technology: 3, shielding_technology: 5, energy_technology: 5 }, buildings: { research_lab: 7 } },
    unlocks: ['battleship', 'battlecruiser', 'destroyer', 'hyperspace_gate'],
    icon: 'ri-space-ship-line',
  },
  hyperspace_technology: {
    id: 'hyperspace_technology', name: 'Hyperspace Technology', category: 'Propulsion', subcategory: 'Hyperspace',
    tier: 3, maxLevel: 20,
    description: 'Enables faster-than-light travel and expands jump range.',
    effects: [
      { type: 'cargo_capacity', target: 'all', valuePerLevel: 0.05, unit: '%' },
      { type: 'jump_range',     target: 'all', valuePerLevel: 2,    unit: 'ly' },
    ],
    baseCost: { metal: 0, crystal: 4000, deuterium: 2000 }, costFactor: 2.2,
    baseTime: 720, timeFactor: 2.0,
    requirements: { research: { shielding_technology: 5, energy_technology: 5 }, buildings: { research_lab: 7 } },
    unlocks: ['hyperspace_drive', 'hyperspace_gate', 'phalanx_sensor'],
    icon: 'ri-planet-line',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ENERGY TECHNOLOGIES
  // ═══════════════════════════════════════════════════════════════════════════

  energy_technology: {
    id: 'energy_technology', name: 'Energy Technology', category: 'Energy', subcategory: 'Generation',
    tier: 1, maxLevel: 20,
    description: 'Fundamental energy research unlocking advanced buildings and ships.',
    effects: [{ type: 'energy_production', target: 'all', valuePerLevel: 0.02, unit: '%' }],
    baseCost: { metal: 0, crystal: 800, deuterium: 400 }, costFactor: 2.0,
    baseTime: 90, timeFactor: 2.0,
    requirements: { buildings: { research_lab: 1 } },
    unlocks: ['shielding_technology', 'plasma_technology', 'hyperspace_technology', 'laser_technology'],
    icon: 'ri-flashlight-line',
  },
  fusion_technology: {
    id: 'fusion_technology', name: 'Fusion Technology', category: 'Energy', subcategory: 'Generation',
    tier: 2, maxLevel: 25,
    description: 'Improves fusion reactor output and deuterium efficiency.',
    effects: [
      { type: 'fusion_energy',       target: 'fusion_reactor', valuePerLevel: 0.1,  unit: '%' },
      { type: 'deuterium_efficiency',target: 'fusion_reactor', valuePerLevel: 0.04, unit: '%' },
    ],
    baseCost: { metal: 900, crystal: 400, deuterium: 300 }, costFactor: 1.8,
    baseTime: 300, timeFactor: 1.8,
    requirements: { research: { energy_technology: 3 }, buildings: { research_lab: 6 } },
    unlocks: ['fusion_reactor'],
    icon: 'ri-sun-line',
  },
  dark_energy_research: {
    id: 'dark_energy_research', name: 'Dark Energy Research', category: 'Energy', subcategory: 'Exotic Energy',
    tier: 5, maxLevel: 15,
    description: 'Harnesses dark energy for massive power generation.',
    effects: [
      { type: 'dark_matter_production', target: 'dark_matter_extractor', valuePerLevel: 0.1, unit: '%' },
      { type: 'all_energy',             target: 'all',                   valuePerLevel: 0.05, unit: '%' },
    ],
    baseCost: { metal: 50000, crystal: 50000, deuterium: 25000 }, costFactor: 3.0,
    baseTime: 86400, timeFactor: 2.0,
    requirements: { research: { energy_technology: 12, astrophysics: 8 }, buildings: { research_lab: 12 } },
    unlocks: ['dark_matter_extractor', 'dark_energy_tap'],
    icon: 'ri-moon-line',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ECONOMIC TECHNOLOGIES
  // ═══════════════════════════════════════════════════════════════════════════

  computer_technology: {
    id: 'computer_technology', name: 'Computer Technology', category: 'Economic', subcategory: 'Production',
    tier: 1, maxLevel: 25,
    description: 'Allows deploying more simultaneous fleet missions.',
    effects: [{ type: 'fleet_slots', target: 'player', valuePerLevel: 1, unit: 'slot' }],
    baseCost: { metal: 0, crystal: 400, deuterium: 600 }, costFactor: 2.0,
    baseTime: 60, timeFactor: 2.0,
    requirements: { buildings: { research_lab: 1 } },
    unlocks: ['targeting_systems', 'intergalactic_research_network', 'nanite_factory'],
    icon: 'ri-cpu-line',
  },
  intergalactic_research_network: {
    id: 'intergalactic_research_network', name: 'Intergalactic Research Network', category: 'Economic', subcategory: 'Production',
    tier: 4, maxLevel: 15,
    description: 'Links research labs across planets for faster research.',
    effects: [{ type: 'research_speed', target: 'all', valuePerLevel: 0.1, unit: '%' }],
    baseCost: { metal: 240000, crystal: 400000, deuterium: 160000 }, costFactor: 2.0,
    baseTime: 172800, timeFactor: 1.5,
    requirements: { research: { computer_technology: 8, hyperspace_technology: 8, astrophysics: 8 }, buildings: { research_lab: 12 } },
    icon: 'ri-global-line',
  },
  resource_extraction: {
    id: 'resource_extraction', name: 'Resource Extraction', category: 'Economic', subcategory: 'Mining',
    tier: 1, maxLevel: 20,
    description: 'Improves efficiency of all resource extraction operations.',
    effects: [{ type: 'production', target: 'all_mines', valuePerLevel: 0.05, unit: '%' }],
    baseCost: { metal: 500, crystal: 200, deuterium: 0 }, costFactor: 1.8,
    baseTime: 90, timeFactor: 1.8,
    requirements: { buildings: { research_lab: 2 } },
    icon: 'ri-database-2-line',
  },
  trade_economics: {
    id: 'trade_economics', name: 'Trade Economics', category: 'Economic', subcategory: 'Trade',
    tier: 2, maxLevel: 15,
    description: 'Reduces market taxes and improves trade route profits.',
    effects: [
      { type: 'market_tax',      target: 'player', valuePerLevel: -0.002, unit: '%' },
      { type: 'trade_profit',    target: 'player', valuePerLevel: 0.05,   unit: '%' },
    ],
    baseCost: { metal: 1000, crystal: 2000, deuterium: 500 }, costFactor: 1.8,
    baseTime: 300, timeFactor: 1.8,
    requirements: { research: { computer_technology: 3 }, buildings: { research_lab: 4 } },
    icon: 'ri-stock-line',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ESPIONAGE TECHNOLOGIES
  // ═══════════════════════════════════════════════════════════════════════════

  espionage_technology: {
    id: 'espionage_technology', name: 'Espionage Technology', category: 'Espionage', subcategory: 'Surveillance',
    tier: 1, maxLevel: 20,
    description: 'Improves spy probe capability and counter-espionage.',
    effects: [
      { type: 'spy_depth',         target: 'espionage', valuePerLevel: 1,    unit: 'level' },
      { type: 'counter_spy_bonus', target: 'player',    valuePerLevel: 0.05, unit: '%' },
    ],
    baseCost: { metal: 200, crystal: 1000, deuterium: 200 }, costFactor: 1.8,
    baseTime: 120, timeFactor: 1.8,
    requirements: { buildings: { research_lab: 3 } },
    unlocks: ['espionage_probe'],
    icon: 'ri-user-search-line',
  },
  stealth_technology: {
    id: 'stealth_technology', name: 'Stealth Technology', category: 'Espionage', subcategory: 'Stealth',
    tier: 3, maxLevel: 15,
    description: 'Reduces fleet detection radius and improves cloaking.',
    effects: [
      { type: 'detection_radius',  target: 'stealth_ships', valuePerLevel: -0.1, unit: '%' },
      { type: 'evasion',           target: 'stealth_ships', valuePerLevel: 0.05, unit: '%' },
    ],
    baseCost: { metal: 5000, crystal: 10000, deuterium: 3000 }, costFactor: 2.0,
    baseTime: 1800, timeFactor: 2.0,
    requirements: { research: { espionage_technology: 8 }, buildings: { research_lab: 8 } },
    icon: 'ri-eye-off-line',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADVANCED TECHNOLOGIES
  // ═══════════════════════════════════════════════════════════════════════════

  nanotechnology: {
    id: 'nanotechnology', name: 'Nanotechnology', category: 'Advanced', subcategory: 'Nanotechnology',
    tier: 4, maxLevel: 20,
    description: 'Nano-scale engineering enabling self-repair and enhanced construction.',
    effects: [
      { type: 'repair_rate',     target: 'all',   valuePerLevel: 0.05, unit: '%' },
      { type: 'build_speed',     target: 'all',   valuePerLevel: 0.05, unit: '%' },
    ],
    baseCost: { metal: 5000, crystal: 10000, deuterium: 5000 }, costFactor: 2.5,
    baseTime: 7200, timeFactor: 2.0,
    requirements: { research: { computer_technology: 10, energy_technology: 10 }, buildings: { research_lab: 10 } },
    unlocks: ['nano_shipyard', 'nanite_factory', 'nano_armor'],
    icon: 'ri-microscope-line',
  },
  quantum_research: {
    id: 'quantum_research', name: 'Quantum Research', category: 'Advanced', subcategory: 'Quantum',
    tier: 5, maxLevel: 15,
    description: 'Quantum mechanics for teleportation and reality manipulation.',
    effects: [
      { type: 'research_speed',  target: 'all',   valuePerLevel: 0.1,  unit: '%' },
      { type: 'special_ability', target: 'capital_ships', valuePerLevel: 0.05, unit: '%' },
    ],
    baseCost: { metal: 50000, crystal: 100000, deuterium: 50000 }, costFactor: 3.0,
    baseTime: 86400, timeFactor: 2.0,
    requirements: { research: { nanotechnology: 10, energy_technology: 15 }, buildings: { research_lab: 15 } },
    unlocks: ['quantum_processor', 'quantum_vault', 'quantum_drive'],
    icon: 'ri-cpu-line',
  },
  xenotech_research: {
    id: 'xenotech_research', name: 'Xenotech Research', category: 'Advanced', subcategory: 'Xenotech',
    tier: 5, maxLevel: 10,
    description: 'Alien technology integration for unprecedented capabilities.',
    effects: [{ type: 'all_stats', target: 'all', valuePerLevel: 0.08, unit: '%' }],
    baseCost: { metal: 100000, crystal: 150000, deuterium: 80000 }, costFactor: 3.5,
    baseTime: 172800, timeFactor: 2.5,
    requirements: { research: { quantum_research: 5, astrophysics: 15 } },
    icon: 'ri-question-mark',
  },
  temporal_research: {
    id: 'temporal_research', name: 'Temporal Research', category: 'Advanced', subcategory: 'Cosmic',
    tier: 6, maxLevel: 5,
    description: 'Time manipulation research - reduces all timers.',
    effects: [{ type: 'all_timers', target: 'all', valuePerLevel: -0.1, unit: '%' }],
    baseCost: { metal: 1000000, crystal: 1000000, deuterium: 500000 }, costFactor: 5.0,
    baseTime: 604800, timeFactor: 3.0,
    requirements: { research: { xenotech_research: 10, quantum_research: 15 } },
    icon: 'ri-time-line',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ASTROPHYSICS
  // ═══════════════════════════════════════════════════════════════════════════

  astrophysics: {
    id: 'astrophysics', name: 'Astrophysics', category: 'Astrophysics', subcategory: 'Exploration',
    tier: 2, maxLevel: 30,
    description: 'Enables expedition missions and additional planet colonization.',
    effects: [
      { type: 'expedition_slots', target: 'player', valuePerLevel: 0.5, unit: 'slot' },
      { type: 'colony_slots',     target: 'player', valuePerLevel: 0.5, unit: 'slot' },
    ],
    baseCost: { metal: 4000, crystal: 8000, deuterium: 4000 }, costFactor: 1.75,
    baseTime: 600, timeFactor: 1.75,
    requirements: { research: { espionage_technology: 4, impulse_drive: 3 }, buildings: { research_lab: 3 } },
    unlocks: ['colony_ship', 'dark_energy_research', 'intergalactic_research_network'],
    icon: 'ri-planet-line',
  },
  terraforming: {
    id: 'terraforming', name: 'Terraforming Technology', category: 'Astrophysics', subcategory: 'Planetary',
    tier: 4, maxLevel: 10,
    description: 'Ability to terraform planets, increasing build fields.',
    effects: [{ type: 'build_slots', target: 'planet', valuePerLevel: 5, unit: 'slots' }],
    baseCost: { metal: 0, crystal: 50000, deuterium: 100000 }, costFactor: 2.0,
    baseTime: 43200, timeFactor: 2.0,
    requirements: { research: { nanotechnology: 10, energy_technology: 12 } },
    unlocks: ['terraformer'],
    icon: 'ri-global-line',
  },
  wormhole_research: {
    id: 'wormhole_research', name: 'Wormhole Research', category: 'Astrophysics', subcategory: 'Stellar',
    tier: 5, maxLevel: 10,
    description: 'Creates stable wormholes for instantaneous fleet travel.',
    effects: [{ type: 'jump_gate_range', target: 'hyperspace_gate', valuePerLevel: 1, unit: 'galaxy' }],
    baseCost: { metal: 500000, crystal: 250000, deuterium: 100000 }, costFactor: 2.5,
    baseTime: 259200, timeFactor: 2.0,
    requirements: { research: { hyperspace_technology: 15, astrophysics: 20 } },
    unlocks: ['hyperspace_gate', 'stargate_network'],
    icon: 'ri-door-open-line',
  },
  ai_research: {
    id: 'ai_research', name: 'AI Research', category: 'Economic', subcategory: 'Production',
    tier: 3, maxLevel: 15,
    description: 'Artificial intelligence to automate operations.',
    effects: [
      { type: 'fleet_ai_speed', target: 'fleet', valuePerLevel: 0.05, unit: '%' },
      { type: 'build_speed',    target: 'all',   valuePerLevel: 0.03, unit: '%' },
    ],
    baseCost: { metal: 3000, crystal: 6000, deuterium: 1500 }, costFactor: 2.0,
    baseTime: 1800, timeFactor: 1.8,
    requirements: { research: { computer_technology: 8 }, buildings: { research_lab: 8 } },
    unlocks: ['ai_core', 'advanced_targeting'],
    icon: 'ri-robot-line',
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: RESEARCH TREE GRAPH (prerequisite map)
// ─────────────────────────────────────────────────────────────────────────────

export type ResearchId = keyof typeof RESEARCH_TREE;

export function getResearchCost(techId: string, level: number): { metal: number; crystal: number; deuterium: number } {
  const def = RESEARCH_TREE[techId as ResearchId];
  if (!def) return { metal: 0, crystal: 0, deuterium: 0 };
  const factor = Math.pow(def.costFactor, level - 1);
  return {
    metal:     Math.floor(def.baseCost.metal * factor),
    crystal:   Math.floor(def.baseCost.crystal * factor),
    deuterium: Math.floor(def.baseCost.deuterium * factor),
  };
}

export function getResearchTime(techId: string, level: number, labLevel: number = 1, networkBonus: number = 0): number {
  const def = RESEARCH_TREE[techId as ResearchId];
  if (!def) return 0;
  const base = def.baseTime * Math.pow(def.timeFactor, level - 1);
  const labDiv = 1 + labLevel;
  const networkDiv = 1 + networkBonus;
  return Math.max(1, Math.floor(base / labDiv / networkDiv));
}

// All technologies a player can research at a given state
export function getAvailableTech(
  currentResearch: Record<string, number>,
  currentBuildings: Record<string, number>
): ResearchId[] {
  return (Object.keys(RESEARCH_TREE) as ResearchId[]).filter((id) => {
    const def = RESEARCH_TREE[id];
    const reqs = def.requirements;
    if (reqs.research) {
      for (const [reqId, reqLevel] of Object.entries(reqs.research)) {
        if ((currentResearch[reqId] ?? 0) < reqLevel) return false;
      }
    }
    if (reqs.buildings) {
      for (const [bldId, bldLevel] of Object.entries(reqs.buildings)) {
        if ((currentBuildings[bldId] ?? 0) < bldLevel) return false;
      }
    }
    return true;
  });
}
