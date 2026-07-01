// 90+ Crafting Items with Types, Classes, and Blueprints
export interface CraftingItem {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'module' | 'component' | 'blueprint' | 'technology' | 'consumable' | 'material' | 'equipment' | 'starship';
  class: 'basic' | 'advanced' | 'elite' | 'master' | 'legendary' | 'mythic' | 'quantum' | 'cosmic' | 'universal';
  category: string;
  tier: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'universal';
  requiredLevel: number;
  requiredSkill?: string;
  requiredSkillLevel?: number;
  craftingTime: number; // seconds
  materials: { id: string; name: string; amount: number }[];
  resources: { metal?: number; crystal?: number; deuterium?: number; darkMatter?: number; exoticMatter?: number; antimatter?: number; nanites?: number; plasma?: number };
  stats?: any;
  effects?: string[];
  description: string;
}

export const craftingItems: CraftingItem[] = [
  // === WEAPONS (15 items) ===
  {
    id: 'weapon_laser_1',
    name: 'Basic Laser Cannon',
    type: 'weapon',
    class: 'basic',
    category: 'Energy Weapons',
    tier: 1,
    rarity: 'common',
    requiredLevel: 1,
    requiredSkill: 'weaponsmithing',
    requiredSkillLevel: 1,
    craftingTime: 300,
    materials: [
      { id: 'mat_steel', name: 'Steel Alloy', amount: 50 },
      { id: 'mat_crystal', name: 'Energy Crystal', amount: 20 }
    ],
    resources: { metal: 1000, crystal: 500 },
    stats: { damage: 100, range: 500, fireRate: 2 },
    description: 'Standard laser weapon for light combat'
  },
  {
    id: 'weapon_plasma_2',
    name: 'Plasma Cannon',
    type: 'weapon',
    class: 'advanced',
    category: 'Energy Weapons',
    tier: 2,
    rarity: 'uncommon',
    requiredLevel: 10,
    requiredSkill: 'weaponsmithing',
    requiredSkillLevel: 3,
    craftingTime: 600,
    materials: [
      { id: 'mat_titanium', name: 'Titanium Alloy', amount: 100 },
      { id: 'mat_plasma_core', name: 'Plasma Core', amount: 5 }
    ],
    resources: { metal: 5000, crystal: 2000, plasma: 100 },
    stats: { damage: 250, range: 600, fireRate: 1.5, armorPenetration: 20 },
    description: 'Advanced plasma weapon with armor penetration'
  },
  {
    id: 'weapon_ion_3',
    name: 'Ion Disruptor',
    type: 'weapon',
    class: 'elite',
    category: 'Energy Weapons',
    tier: 3,
    rarity: 'rare',
    requiredLevel: 25,
    requiredSkill: 'weaponsmithing',
    requiredSkillLevel: 5,
    craftingTime: 1200,
    materials: [
      { id: 'mat_durasteel', name: 'Durasteel', amount: 200 },
      { id: 'mat_ion_cell', name: 'Ion Cell', amount: 10 }
    ],
    resources: { metal: 15000, crystal: 8000, deuterium: 2000 },
    stats: { damage: 400, range: 700, fireRate: 1.8, shieldDamage: 150 },
    effects: ['Disables shields', 'EMP effect'],
    description: 'Specialized weapon for disabling enemy shields'
  },
  {
    id: 'weapon_quantum_4',
    name: 'Quantum Torpedo Launcher',
    type: 'weapon',
    class: 'master',
    category: 'Projectile Weapons',
    tier: 4,
    rarity: 'epic',
    requiredLevel: 40,
    requiredSkill: 'weaponsmithing',
    requiredSkillLevel: 7,
    craftingTime: 2400,
    materials: [
      { id: 'mat_quantum_steel', name: 'Quantum Steel', amount: 300 },
      { id: 'mat_antimatter', name: 'Antimatter Cell', amount: 20 }
    ],
    resources: { metal: 50000, crystal: 25000, antimatter: 500 },
    stats: { damage: 800, range: 1000, fireRate: 0.5, aoe: 100 },
    effects: ['Area damage', 'Quantum instability'],
    description: 'Devastating torpedo with quantum warheads'
  },
  {
    id: 'weapon_singularity_5',
    name: 'Singularity Cannon',
    type: 'weapon',
    class: 'legendary',
    category: 'Exotic Weapons',
    tier: 5,
    rarity: 'legendary',
    requiredLevel: 60,
    requiredSkill: 'weaponsmithing',
    requiredSkillLevel: 9,
    craftingTime: 4800,
    materials: [
      { id: 'mat_dark_matter', name: 'Dark Matter Core', amount: 50 },
      { id: 'mat_exotic_alloy', name: 'Exotic Alloy', amount: 100 }
    ],
    resources: { metal: 100000, crystal: 75000, darkMatter: 1000, exoticMatter: 500 },
    stats: { damage: 1500, range: 1200, fireRate: 0.3, gravityWell: 200 },
    effects: ['Creates micro black hole', 'Pulls enemies', 'Ignores armor'],
    description: 'Ultimate weapon harnessing singularity power'
  },

  // === ARMOR (10 items) ===
  {
    id: 'armor_hull_1',
    name: 'Reinforced Hull Plating',
    type: 'armor',
    class: 'basic',
    category: 'Hull Armor',
    tier: 1,
    rarity: 'common',
    requiredLevel: 1,
    requiredSkill: 'armorsmithing',
    requiredSkillLevel: 1,
    craftingTime: 300,
    materials: [
      { id: 'mat_steel', name: 'Steel Alloy', amount: 100 }
    ],
    resources: { metal: 2000 },
    stats: { armor: 500, hullPoints: 1000 },
    description: 'Basic hull reinforcement'
  },
  {
    id: 'armor_shield_2',
    name: 'Energy Shield Generator',
    type: 'armor',
    class: 'advanced',
    category: 'Shield Systems',
    tier: 2,
    rarity: 'uncommon',
    requiredLevel: 15,
    requiredSkill: 'armorsmithing',
    requiredSkillLevel: 3,
    craftingTime: 900,
    materials: [
      { id: 'mat_crystal', name: 'Energy Crystal', amount: 50 },
      { id: 'mat_shield_emitter', name: 'Shield Emitter', amount: 5 }
    ],
    resources: { metal: 5000, crystal: 5000 },
    stats: { shield: 2000, regenRate: 50 },
    description: 'Advanced energy shield system'
  },
  {
    id: 'armor_reactive_3',
    name: 'Reactive Armor Plating',
    type: 'armor',
    class: 'elite',
    category: 'Hull Armor',
    tier: 3,
    rarity: 'rare',
    requiredLevel: 30,
    requiredSkill: 'armorsmithing',
    requiredSkillLevel: 5,
    craftingTime: 1800,
    materials: [
      { id: 'mat_durasteel', name: 'Durasteel', amount: 200 },
      { id: 'mat_reactive_compound', name: 'Reactive Compound', amount: 50 }
    ],
    resources: { metal: 20000, crystal: 10000 },
    stats: { armor: 2000, hullPoints: 5000, damageReduction: 15 },
    effects: ['Reduces incoming damage by 15%'],
    description: 'Reactive armor that adapts to damage'
  },
  {
    id: 'armor_quantum_4',
    name: 'Quantum Shield Matrix',
    type: 'armor',
    class: 'master',
    category: 'Shield Systems',
    tier: 4,
    rarity: 'epic',
    requiredLevel: 50,
    requiredSkill: 'armorsmithing',
    requiredSkillLevel: 7,
    craftingTime: 3600,
    materials: [
      { id: 'mat_quantum_crystal', name: 'Quantum Crystal', amount: 100 },
      { id: 'mat_nanites', name: 'Nanite Cluster', amount: 50 }
    ],
    resources: { metal: 50000, crystal: 50000, nanites: 1000 },
    stats: { shield: 10000, regenRate: 200, absorption: 20 },
    effects: ['Absorbs 20% damage as energy', 'Self-repairing'],
    description: 'Advanced quantum shield with energy absorption'
  },
  {
    id: 'armor_cosmic_5',
    name: 'Cosmic Barrier System',
    type: 'armor',
    class: 'legendary',
    category: 'Shield Systems',
    tier: 5,
    rarity: 'legendary',
    requiredLevel: 70,
    requiredSkill: 'armorsmithing',
    requiredSkillLevel: 9,
    craftingTime: 7200,
    materials: [
      { id: 'mat_cosmic_essence', name: 'Cosmic Essence', amount: 50 },
      { id: 'mat_exotic_alloy', name: 'Exotic Alloy', amount: 100 }
    ],
    resources: { metal: 100000, crystal: 100000, exoticMatter: 1000 },
    stats: { shield: 25000, regenRate: 500, reflection: 30 },
    effects: ['Reflects 30% damage', 'Immune to EMP', 'Phase shifting'],
    description: 'Ultimate defensive system from cosmic technology'
  },

  // === MODULES (15 items) ===
  {
    id: 'module_engine_1',
    name: 'Ion Thruster',
    type: 'module',
    class: 'basic',
    category: 'Propulsion',
    tier: 1,
    rarity: 'common',
    requiredLevel: 1,
    requiredSkill: 'engineering',
    requiredSkillLevel: 1,
    craftingTime: 400,
    materials: [
      { id: 'mat_steel', name: 'Steel Alloy', amount: 75 },
      { id: 'mat_fuel_cell', name: 'Fuel Cell', amount: 10 }
    ],
    resources: { metal: 3000, deuterium: 500 },
    stats: { speed: 100, acceleration: 50 },
    description: 'Basic propulsion system'
  },
  {
    id: 'module_warp_2',
    name: 'Warp Drive',
    type: 'module',
    class: 'advanced',
    category: 'Propulsion',
    tier: 2,
    rarity: 'uncommon',
    requiredLevel: 20,
    requiredSkill: 'engineering',
    requiredSkillLevel: 4,
    craftingTime: 1200,
    materials: [
      { id: 'mat_titanium', name: 'Titanium Alloy', amount: 150 },
      { id: 'mat_warp_coil', name: 'Warp Coil', amount: 5 }
    ],
    resources: { metal: 15000, crystal: 10000, deuterium: 2000 },
    stats: { speed: 300, warpSpeed: 1000, fuelEfficiency: 20 },
    effects: ['FTL travel', 'Reduced fuel consumption'],
    description: 'Faster-than-light propulsion system'
  },
  {
    id: 'module_reactor_3',
    name: 'Fusion Reactor',
    type: 'module',
    class: 'elite',
    category: 'Power Systems',
    tier: 3,
    rarity: 'rare',
    requiredLevel: 35,
    requiredSkill: 'engineering',
    requiredSkillLevel: 6,
    craftingTime: 2400,
    materials: [
      { id: 'mat_durasteel', name: 'Durasteel', amount: 200 },
      { id: 'mat_fusion_core', name: 'Fusion Core', amount: 10 }
    ],
    resources: { metal: 30000, crystal: 20000, deuterium: 5000 },
    stats: { powerOutput: 5000, efficiency: 85 },
    effects: ['Powers all ship systems', '+50% weapon damage'],
    description: 'High-output fusion power reactor'
  },
  {
    id: 'module_quantum_computer',
    name: 'Quantum Computer Core',
    type: 'module',
    class: 'master',
    category: 'Computing',
    tier: 4,
    rarity: 'epic',
    requiredLevel: 45,
    requiredSkill: 'engineering',
    requiredSkillLevel: 7,
    craftingTime: 3600,
    materials: [
      { id: 'mat_quantum_processor', name: 'Quantum Processor', amount: 20 },
      { id: 'mat_nanites', name: 'Nanite Cluster', amount: 30 }
    ],
    resources: { metal: 40000, crystal: 40000, nanites: 500 },
    stats: { computingPower: 10000, accuracy: 95 },
    effects: ['+25% accuracy', 'Advanced targeting', 'AI assistance'],
    description: 'Quantum computing system for ship operations'
  },
  {
    id: 'module_cloaking',
    name: 'Cloaking Device',
    type: 'module',
    class: 'legendary',
    category: 'Stealth Systems',
    tier: 5,
    rarity: 'legendary',
    requiredLevel: 65,
    requiredSkill: 'engineering',
    requiredSkillLevel: 9,
    craftingTime: 6000,
    materials: [
      { id: 'mat_dark_matter', name: 'Dark Matter Core', amount: 30 },
      { id: 'mat_phase_crystal', name: 'Phase Crystal', amount: 50 }
    ],
    resources: { metal: 80000, crystal: 80000, darkMatter: 2000 },
    stats: { stealthRating: 95, duration: 300 },
    effects: ['Invisible to sensors', 'First strike bonus', 'Reduced detection'],
    description: 'Advanced cloaking technology for stealth operations'
  },

  // === COMPONENTS (10 items) ===
  {
    id: 'comp_circuit_1',
    name: 'Basic Circuit Board',
    type: 'component',
    class: 'basic',
    category: 'Electronics',
    tier: 1,
    rarity: 'common',
    requiredLevel: 1,
    requiredSkill: 'electronics',
    requiredSkillLevel: 1,
    craftingTime: 120,
    materials: [
      { id: 'mat_copper', name: 'Copper Wire', amount: 20 },
      { id: 'mat_silicon', name: 'Silicon Wafer', amount: 10 }
    ],
    resources: { metal: 500, crystal: 200 },
    description: 'Basic electronic component for crafting'
  },
  {
    id: 'comp_processor_2',
    name: 'Advanced Processor',
    type: 'component',
    class: 'advanced',
    category: 'Electronics',
    tier: 2,
    rarity: 'uncommon',
    requiredLevel: 15,
    requiredSkill: 'electronics',
    requiredSkillLevel: 3,
    craftingTime: 300,
    materials: [
      { id: 'mat_silicon', name: 'Silicon Wafer', amount: 50 },
      { id: 'mat_rare_earth', name: 'Rare Earth Elements', amount: 20 }
    ],
    resources: { metal: 2000, crystal: 2000 },
    description: 'High-performance processor component'
  },
  {
    id: 'comp_nanite_3',
    name: 'Nanite Assembly',
    type: 'component',
    class: 'elite',
    category: 'Nanotechnology',
    tier: 3,
    rarity: 'rare',
    requiredLevel: 30,
    requiredSkill: 'nanotechnology',
    requiredSkillLevel: 5,
    craftingTime: 900,
    materials: [
      { id: 'mat_nanites', name: 'Raw Nanites', amount: 100 },
      { id: 'mat_quantum_processor', name: 'Quantum Processor', amount: 5 }
    ],
    resources: { metal: 10000, crystal: 10000, nanites: 200 },
    description: 'Self-replicating nanite component'
  },

  // === BLUEPRINTS (15 items) ===
  {
    id: 'bp_fighter_1',
    name: 'Fighter Blueprint',
    type: 'blueprint',
    class: 'basic',
    category: 'Ship Blueprints',
    tier: 1,
    rarity: 'common',
    requiredLevel: 5,
    requiredSkill: 'shipbuilding',
    requiredSkillLevel: 1,
    craftingTime: 600,
    materials: [
      { id: 'mat_steel', name: 'Steel Alloy', amount: 200 },
      { id: 'comp_circuit_1', name: 'Basic Circuit Board', amount: 10 }
    ],
    resources: { metal: 5000, crystal: 2000 },
    description: 'Blueprint for constructing light fighters'
  },
  {
    id: 'bp_cruiser_2',
    name: 'Cruiser Blueprint',
    type: 'blueprint',
    class: 'advanced',
    category: 'Ship Blueprints',
    tier: 2,
    rarity: 'uncommon',
    requiredLevel: 20,
    requiredSkill: 'shipbuilding',
    requiredSkillLevel: 4,
    craftingTime: 1800,
    materials: [
      { id: 'mat_titanium', name: 'Titanium Alloy', amount: 500 },
      { id: 'comp_processor_2', name: 'Advanced Processor', amount: 20 }
    ],
    resources: { metal: 25000, crystal: 15000, deuterium: 5000 },
    description: 'Blueprint for medium cruiser construction'
  },
  {
    id: 'bp_battleship_3',
    name: 'Battleship Blueprint',
    type: 'blueprint',
    class: 'elite',
    category: 'Ship Blueprints',
    tier: 3,
    rarity: 'rare',
    requiredLevel: 40,
    requiredSkill: 'shipbuilding',
    requiredSkillLevel: 6,
    craftingTime: 3600,
    materials: [
      { id: 'mat_durasteel', name: 'Durasteel', amount: 1000 },
      { id: 'mat_quantum_steel', name: 'Quantum Steel', amount: 200 }
    ],
    resources: { metal: 100000, crystal: 50000, deuterium: 25000 },
    description: 'Blueprint for heavy battleship construction'
  },
  {
    id: 'bp_carrier_4',
    name: 'Carrier Blueprint',
    type: 'blueprint',
    class: 'master',
    category: 'Ship Blueprints',
    tier: 4,
    rarity: 'epic',
    requiredLevel: 55,
    requiredSkill: 'shipbuilding',
    requiredSkillLevel: 8,
    craftingTime: 7200,
    materials: [
      { id: 'mat_quantum_steel', name: 'Quantum Steel', amount: 2000 },
      { id: 'mat_exotic_alloy', name: 'Exotic Alloy', amount: 500 }
    ],
    resources: { metal: 250000, crystal: 150000, deuterium: 75000, darkMatter: 1000 },
    description: 'Blueprint for massive carrier construction'
  },
  {
    id: 'bp_titan_5',
    name: 'Titan Dreadnought Blueprint',
    type: 'blueprint',
    class: 'legendary',
    category: 'Ship Blueprints',
    tier: 5,
    rarity: 'legendary',
    requiredLevel: 75,
    requiredSkill: 'shipbuilding',
    requiredSkillLevel: 10,
    craftingTime: 14400,
    materials: [
      { id: 'mat_cosmic_alloy', name: 'Cosmic Alloy', amount: 1000 },
      { id: 'mat_dark_matter', name: 'Dark Matter Core', amount: 100 }
    ],
    resources: { metal: 1000000, crystal: 500000, deuterium: 250000, darkMatter: 5000, exoticMatter: 2000 },
    description: 'Blueprint for ultimate titan-class dreadnought'
  },

  // === TECHNOLOGY (10 items) ===
  {
    id: 'tech_energy_1',
    name: 'Energy Efficiency I',
    type: 'technology',
    class: 'basic',
    category: 'Energy Technology',
    tier: 1,
    rarity: 'common',
    requiredLevel: 5,
    requiredSkill: 'research',
    requiredSkillLevel: 1,
    craftingTime: 1800,
    materials: [
      { id: 'mat_crystal', name: 'Energy Crystal', amount: 100 }
    ],
    resources: { crystal: 10000 },
    effects: ['-10% energy consumption'],
    description: 'Improves energy efficiency across all systems'
  },
  {
    id: 'tech_weapons_2',
    name: 'Weapon Systems II',
    type: 'technology',
    class: 'advanced',
    category: 'Weapons Technology',
    tier: 2,
    rarity: 'uncommon',
    requiredLevel: 15,
    requiredSkill: 'research',
    requiredSkillLevel: 3,
    craftingTime: 3600,
    materials: [
      { id: 'mat_plasma_core', name: 'Plasma Core', amount: 50 }
    ],
    resources: { metal: 20000, crystal: 20000 },
    effects: ['+15% weapon damage', '+10% fire rate'],
    description: 'Advanced weapons technology research'
  },
  {
    id: 'tech_shields_3',
    name: 'Shield Technology III',
    type: 'technology',
    class: 'elite',
    category: 'Defense Technology',
    tier: 3,
    rarity: 'rare',
    requiredLevel: 30,
    requiredSkill: 'research',
    requiredSkillLevel: 5,
    craftingTime: 7200,
    materials: [
      { id: 'mat_shield_emitter', name: 'Shield Emitter', amount: 100 }
    ],
    resources: { metal: 50000, crystal: 50000 },
    effects: ['+25% shield strength', '+50% regen rate'],
    description: 'Enhanced shield technology'
  },

  // === EQUIPMENT (10 items) ===
  {
    id: 'equip_scanner_1',
    name: 'Basic Scanner',
    type: 'equipment',
    class: 'basic',
    category: 'Sensors',
    tier: 1,
    rarity: 'common',
    requiredLevel: 1,
    requiredSkill: 'electronics',
    requiredSkillLevel: 1,
    craftingTime: 300,
    materials: [
      { id: 'comp_circuit_1', name: 'Basic Circuit Board', amount: 5 }
    ],
    resources: { metal: 1000, crystal: 1000 },
    stats: { scanRange: 1000, accuracy: 70 },
    description: 'Basic scanning equipment'
  },
  {
    id: 'equip_mining_2',
    name: 'Mining Laser',
    type: 'equipment',
    class: 'advanced',
    category: 'Mining',
    tier: 2,
    rarity: 'uncommon',
    requiredLevel: 10,
    requiredSkill: 'mining',
    requiredSkillLevel: 2,
    craftingTime: 600,
    materials: [
      { id: 'mat_crystal', name: 'Energy Crystal', amount: 30 }
    ],
    resources: { metal: 5000, crystal: 3000 },
    stats: { miningSpeed: 150, efficiency: 80 },
    effects: ['+50% mining speed'],
    description: 'Advanced mining equipment'
  },

  // === STARSHIPS (5 items) ===
  {
    id: 'ship_interceptor',
    name: 'Quantum Interceptor',
    type: 'starship',
    class: 'elite',
    category: 'Light Ships',
    tier: 3,
    rarity: 'rare',
    requiredLevel: 35,
    requiredSkill: 'shipbuilding',
    requiredSkillLevel: 6,
    craftingTime: 5400,
    materials: [
      { id: 'bp_fighter_1', name: 'Fighter Blueprint', amount: 1 },
      { id: 'mat_quantum_steel', name: 'Quantum Steel', amount: 300 }
    ],
    resources: { metal: 50000, crystal: 30000, deuterium: 15000 },
    stats: { hull: 5000, shield: 3000, speed: 500, weapons: 4 },
    description: 'Fast interceptor with quantum engines'
  },
  {
    id: 'ship_destroyer',
    name: 'Plasma Destroyer',
    type: 'starship',
    class: 'master',
    category: 'Heavy Ships',
    tier: 4,
    rarity: 'epic',
    requiredLevel: 50,
    requiredSkill: 'shipbuilding',
    requiredSkillLevel: 8,
    craftingTime: 10800,
    materials: [
      { id: 'bp_battleship_3', name: 'Battleship Blueprint', amount: 1 },
      { id: 'mat_exotic_alloy', name: 'Exotic Alloy', amount: 500 }
    ],
    resources: { metal: 200000, crystal: 100000, deuterium: 50000, darkMatter: 500 },
    stats: { hull: 25000, shield: 15000, speed: 250, weapons: 12 },
    description: 'Heavy destroyer with plasma weaponry'
  },

  // NEW CATEGORY: Consumables (15 items)
  {
    id: 'consumable_repair_kit',
    name: 'Emergency Repair Kit',
    category: 'consumables',
    tier: 1,
    rarity: 'common',
    class: 'basic',
    description: 'Instantly repairs 25% hull damage',
    materials: [
      { id: 'steel_alloy', amount: 50 },
      { id: 'copper_wire', amount: 30 }
    ],
    craftTime: 300,
    skillRequired: { skill: 'engineering', level: 1 },
    stats: { healing: 25 },
    image: 'https://readdy.ai/api/search-image?query=futuristic%20emergency%20repair%20kit%20with%20glowing%20tools%20and%20nanite%20spray%20canisters%20in%20clean%20white%20medical%20case%20sci-fi%20game%20icon&width=400&height=400&seq=craft_repair1&orientation=squarish'
  },
  {
    id: 'consumable_shield_booster',
    name: 'Shield Capacitor',
    category: 'consumables',
    tier: 2,
    rarity: 'uncommon',
    class: 'advanced',
    description: 'Instantly restores 50% shield capacity',
    materials: [
      { id: 'shield_emitter', amount: 2 },
      { id: 'energy_crystal', amount: 10 }
    ],
    craftTime: 600,
    skillRequired: { skill: 'engineering', level: 3 },
    stats: { shieldRestore: 50 },
    image: 'https://readdy.ai/api/search-image?query=glowing%20blue%20energy%20shield%20capacitor%20device%20with%20electric%20arcs%20and%20power%20cells%20sci-fi%20technology%20game%20icon&width=400&height=400&seq=craft_shield1&orientation=squarish'
  },
  {
    id: 'consumable_fuel_cell',
    name: 'Hyperfuel Cell',
    category: 'consumables',
    tier: 2,
    rarity: 'uncommon',
    class: 'advanced',
    description: 'Provides instant energy boost for 1 jump',
    materials: [
      { id: 'fuel_cell', amount: 5 },
      { id: 'plasma_core', amount: 1 }
    ],
    craftTime: 450,
    skillRequired: { skill: 'engineering', level: 2 },
    stats: { energyBoost: 1000 },
    image: 'https://readdy.ai/api/search-image?query=glowing%20orange%20hyperfuel%20energy%20cell%20with%20plasma%20core%20and%20power%20indicators%20sci-fi%20game%20consumable%20icon&width=400&height=400&seq=craft_fuel1&orientation=squarish'
  },
  {
    id: 'consumable_nanite_swarm',
    name: 'Nanite Repair Swarm',
    category: 'consumables',
    tier: 3,
    rarity: 'rare',
    class: 'elite',
    description: 'Deploys nanites to repair 75% hull damage over time',
    materials: [
      { id: 'raw_nanites', amount: 100 },
      { id: 'quantum_processor', amount: 1 }
    ],
    craftTime: 1200,
    skillRequired: { skill: 'nanotechnology', level: 5 },
    stats: { healing: 75, duration: 60 },
    image: 'https://readdy.ai/api/search-image?query=swarm%20of%20glowing%20microscopic%20nanite%20robots%20repairing%20metal%20surface%20with%20blue%20energy%20trails%20sci-fi%20game%20icon&width=400&height=400&seq=craft_nanite1&orientation=squarish'
  },
  {
    id: 'consumable_stealth_field',
    name: 'Stealth Field Generator',
    category: 'consumables',
    tier: 3,
    rarity: 'rare',
    class: 'elite',
    description: 'Temporary invisibility for 30 seconds',
    materials: [
      { id: 'phase_crystal', amount: 2 },
      { id: 'exotic_alloy', amount: 5 }
    ],
    craftTime: 1800,
    skillRequired: { skill: 'engineering', level: 6 },
    stats: { stealthDuration: 30 },
    image: 'https://readdy.ai/api/search-image?query=shimmering%20stealth%20field%20generator%20device%20with%20phase%20crystals%20and%20cloaking%20energy%20waves%20sci-fi%20game%20icon&width=400&height=400&seq=craft_stealth1&orientation=squarish'
  },
  {
    id: 'consumable_damage_amp',
    name: 'Damage Amplifier',
    category: 'consumables',
    tier: 4,
    rarity: 'epic',
    class: 'master',
    description: 'Increases weapon damage by 100% for 60 seconds',
    materials: [
      { id: 'antimatter_cell', amount: 3 },
      { id: 'quantum_crystal', amount: 2 }
    ],
    craftTime: 2400,
    skillRequired: { skill: 'weaponsmithing', level: 7 },
    stats: { damageBoost: 100, duration: 60 },
    image: 'https://readdy.ai/api/search-image?query=glowing%20red%20damage%20amplifier%20device%20with%20energy%20cores%20and%20power%20surge%20effects%20sci-fi%20game%20icon&width=400&height=400&seq=craft_damage1&orientation=squarish'
  },
  {
    id: 'consumable_warp_beacon',
    name: 'Emergency Warp Beacon',
    category: 'consumables',
    tier: 2,
    rarity: 'uncommon',
    class: 'advanced',
    description: 'Instantly teleport back to home base',
    materials: [
      { id: 'warp_coil', amount: 3 },
      { id: 'energy_crystal', amount: 20 }
    ],
    craftTime: 900,
    skillRequired: { skill: 'engineering', level: 4 },
    stats: { teleport: true },
    image: 'https://readdy.ai/api/search-image?query=glowing%20blue%20warp%20beacon%20device%20with%20teleportation%20rings%20and%20energy%20field%20sci-fi%20game%20icon&width=400&height=400&seq=craft_warp1&orientation=squarish'
  },
  {
    id: 'consumable_scanner_probe',
    name: 'Advanced Scanner Probe',
    category: 'consumables',
    tier: 3,
    rarity: 'rare',
    class: 'elite',
    description: 'Reveals hidden enemies and resources in area',
    materials: [
      { id: 'quantum_processor', amount: 2 },
      { id: 'rare_earth_elements', amount: 10 }
    ],
    craftTime: 1500,
    skillRequired: { skill: 'electronics', level: 5 },
    stats: { scanRange: 5000 },
    image: 'https://readdy.ai/api/search-image?query=advanced%20scanner%20probe%20device%20with%20sensor%20arrays%20and%20holographic%20display%20sci-fi%20game%20icon&width=400&height=400&seq=craft_scanner1&orientation=squarish'
  },
  {
    id: 'consumable_emp_grenade',
    name: 'EMP Disruption Grenade',
    category: 'consumables',
    tier: 3,
    rarity: 'rare',
    class: 'elite',
    description: 'Disables enemy shields for 20 seconds',
    materials: [
      { id: 'ion_cell', amount: 5 },
      { id: 'reactive_compound', amount: 3 }
    ],
    craftTime: 1200,
    skillRequired: { skill: 'weaponsmithing', level: 5 },
    stats: { disableDuration: 20 },
    image: 'https://readdy.ai/api/search-image?query=electromagnetic%20pulse%20grenade%20with%20blue%20electric%20arcs%20and%20disruption%20field%20sci-fi%20weapon%20game%20icon&width=400&height=400&seq=craft_emp1&orientation=squarish'
  },
  {
    id: 'consumable_quantum_battery',
    name: 'Quantum Power Battery',
    category: 'consumables',
    tier: 4,
    rarity: 'epic',
    class: 'master',
    description: 'Provides unlimited energy for 5 minutes',
    materials: [
      { id: 'quantum_crystal', amount: 5 },
      { id: 'antimatter_cell', amount: 2 }
    ],
    craftTime: 3000,
    skillRequired: { skill: 'engineering', level: 8 },
    stats: { energyBoost: 999999, duration: 300 },
    image: 'https://readdy.ai/api/search-image?query=glowing%20quantum%20power%20battery%20with%20infinite%20energy%20symbol%20and%20blue%20plasma%20core%20sci-fi%20game%20icon&width=400&height=400&seq=craft_battery1&orientation=squarish'
  },
  {
    id: 'consumable_time_dilation',
    name: 'Time Dilation Field',
    category: 'consumables',
    tier: 5,
    rarity: 'legendary',
    class: 'legendary',
    description: 'Slows time for enemies by 50% for 30 seconds',
    materials: [
      { id: 'temporal_fragment', amount: 3 },
      { id: 'cosmic_essence', amount: 2 }
    ],
    craftTime: 4800,
    skillRequired: { skill: 'nanotechnology', level: 9 },
    stats: { timeSlowPercent: 50, duration: 30 },
    image: 'https://readdy.ai/api/search-image?query=time%20dilation%20field%20generator%20with%20temporal%20distortion%20waves%20and%20clock%20symbols%20sci-fi%20game%20icon&width=400&height=400&seq=craft_time1&orientation=squarish'
  },
  {
    id: 'consumable_resurrection',
    name: 'Phoenix Protocol',
    category: 'consumables',
    tier: 5,
    rarity: 'legendary',
    class: 'legendary',
    description: 'Automatically revives ship at 50% health on destruction',
    materials: [
      { id: 'cosmic_essence', amount: 5 },
      { id: 'dark_matter_core', amount: 3 }
    ],
    craftTime: 6000,
    skillRequired: { skill: 'nanotechnology', level: 10 },
    stats: { reviveHealth: 50 },
    image: 'https://readdy.ai/api/search-image?query=phoenix%20protocol%20resurrection%20device%20with%20golden%20flames%20and%20rebirth%20energy%20sci-fi%20game%20icon&width=400&height=400&seq=craft_phoenix1&orientation=squarish'
  },
  {
    id: 'consumable_resource_magnet',
    name: 'Resource Magnet',
    category: 'consumables',
    tier: 2,
    rarity: 'uncommon',
    class: 'advanced',
    description: 'Automatically collects nearby resources for 10 minutes',
    materials: [
      { id: 'rare_earth_elements', amount: 15 },
      { id: 'energy_crystal', amount: 10 }
    ],
    craftTime: 900,
    skillRequired: { skill: 'mining', level: 3 },
    stats: { collectionRange: 1000, duration: 600 },
    image: 'https://readdy.ai/api/search-image?query=resource%20magnet%20device%20with%20magnetic%20field%20lines%20attracting%20minerals%20and%20crystals%20sci-fi%20game%20icon&width=400&height=400&seq=craft_magnet1&orientation=squarish'
  },
  {
    id: 'consumable_experience_boost',
    name: 'Neural Accelerator',
    category: 'consumables',
    tier: 3,
    rarity: 'rare',
    class: 'elite',
    description: 'Doubles experience gain for 1 hour',
    materials: [
      { id: 'quantum_processor', amount: 3 },
      { id: 'raw_nanites', amount: 50 }
    ],
    craftTime: 1800,
    skillRequired: { skill: 'electronics', level: 5 },
    stats: { xpMultiplier: 2, duration: 3600 },
    image: 'https://readdy.ai/api/search-image?query=neural%20accelerator%20brain%20enhancement%20device%20with%20glowing%20circuits%20and%20knowledge%20symbols%20sci-fi%20game%20icon&width=400&height=400&seq=craft_neural1&orientation=squarish'
  },
  {
    id: 'consumable_luck_charm',
    name: 'Quantum Luck Enhancer',
    category: 'consumables',
    tier: 4,
    rarity: 'epic',
    class: 'master',
    description: 'Increases loot quality by 50% for 30 minutes',
    materials: [
      { id: 'quantum_crystal', amount: 3 },
      { id: 'cosmic_alloy', amount: 2 }
    ],
    craftTime: 2400,
    skillRequired: { skill: 'alchemy', level: 7 },
    stats: { luckBoost: 50, duration: 1800 },
    image: 'https://readdy.ai/api/search-image?query=quantum%20luck%20enhancer%20charm%20with%20probability%20waves%20and%20golden%20glow%20sci-fi%20game%20icon&width=400&height=400&seq=craft_luck1&orientation=squarish'
  },

  // NEW CATEGORY: Drones (12 items)
  {
    id: 'drone_mining',
    name: 'Mining Drone',
    category: 'drones',
    tier: 1,
    rarity: 'common',
    class: 'basic',
    description: 'Autonomous mining drone, collects 100 metal/hour',
    materials: [
      { id: 'steel_alloy', amount: 100 },
      { id: 'silicon_wafer', amount: 50 }
    ],
    craftTime: 1200,
    skillRequired: { skill: 'engineering', level: 2 },
    stats: { miningRate: 100 },
    image: 'https://readdy.ai/api/search-image?query=autonomous%20mining%20drone%20robot%20with%20drilling%20arms%20and%20ore%20collection%20bay%20sci-fi%20game%20icon&width=400&height=400&seq=craft_drone1&orientation=squarish'
  },
  {
    id: 'drone_combat',
    name: 'Combat Drone',
    category: 'drones',
    tier: 2,
    rarity: 'uncommon',
    class: 'advanced',
    description: 'Attack drone with laser weapons, 500 damage',
    materials: [
      { id: 'titanium_alloy', amount: 80 },
      { id: 'plasma_core', amount: 2 }
    ],
    craftTime: 1800,
    skillRequired: { skill: 'weaponsmithing', level: 3 },
    stats: { attack: 500, health: 1000 },
    image: 'https://readdy.ai/api/search-image?query=combat%20attack%20drone%20with%20laser%20weapons%20and%20armor%20plating%20sci-fi%20military%20game%20icon&width=400&height=400&seq=craft_drone2&orientation=squarish'
  },
  {
    id: 'drone_repair',
    name: 'Repair Drone',
    category: 'drones',
    tier: 2,
    rarity: 'uncommon',
    class: 'advanced',
    description: 'Repairs allied ships, 200 HP/second',
    materials: [
      { id: 'titanium_alloy', amount: 60 },
      { id: 'raw_nanites', amount: 30 }
    ],
    craftTime: 1500,
    skillRequired: { skill: 'engineering', level: 4 },
    stats: { healRate: 200 },
    image: 'https://readdy.ai/api/search-image?query=repair%20drone%20with%20welding%20tools%20and%20nanite%20spray%20arms%20fixing%20spaceship%20sci-fi%20game%20icon&width=400&height=400&seq=craft_drone3&orientation=squarish'
  },
  {
    id: 'drone_scout',
    name: 'Scout Drone',
    category: 'drones',
    tier: 1,
    rarity: 'common',
    class: 'basic',
    description: 'Fast reconnaissance drone, reveals map areas',
    materials: [
      { id: 'steel_alloy', amount: 50 },
      { id: 'energy_crystal', amount: 10 }
    ],
    craftTime: 900,
    skillRequired: { skill: 'electronics', level: 2 },
    stats: { speed: 1000, scanRange: 3000 },
    image: 'https://readdy.ai/api/search-image?query=fast%20scout%20reconnaissance%20drone%20with%20sensor%20arrays%20and%20camera%20systems%20sci-fi%20game%20icon&width=400&height=400&seq=craft_drone4&orientation=squarish'
  },
  {
    id: 'drone_shield',
    name: 'Shield Drone',
    category: 'drones',
    tier: 3,
    rarity: 'rare',
    class: 'elite',
    description: 'Projects shield over allies, +1000 shield points',
    materials: [
      { id: 'durasteel', amount: 100 },
      { id: 'shield_emitter', amount: 5 }
    ],
    craftTime: 2400,
    skillRequired: { skill: 'armorsmithing', level: 5 },
    stats: { shieldBonus: 1000 },
    image: 'https://readdy.ai/api/search-image?query=shield%20projector%20drone%20with%20blue%20energy%20barrier%20and%20protective%20field%20sci-fi%20game%20icon&width=400&height=400&seq=craft_drone5&orientation=squarish'
  },
  {
    id: 'drone_harvester',
    name: 'Resource Harvester Drone',
    category: 'drones',
    tier: 2,
    rarity: 'uncommon',
    class: 'advanced',
    description: 'Collects all resource types, 50/hour each',
    materials: [
      { id: 'titanium_alloy', amount: 120 },
      { id: 'rare_earth_elements', amount: 20 }
    ],
    craftTime: 2100,
    skillRequired: { skill: 'mining', level: 4 },
    stats: { harvestRate: 50 },
    image: 'https://readdy.ai/api/search-image?query=resource%20harvester%20drone%20with%20multiple%20collection%20arms%20and%20storage%20containers%20sci-fi%20game%20icon&width=400&height=400&seq=craft_drone6&orientation=squarish'
  },
  {
    id: 'drone_stealth',
    name: 'Stealth Infiltration Drone',
    category: 'drones',
    tier: 4,
    rarity: 'epic',
    class: 'master',
    description: 'Invisible spy drone for espionage missions',
    materials: [
      { id: 'quantum_steel', amount: 80 },
      { id: 'phase_crystal', amount: 3 }
    ],
    craftTime: 3600,
    skillRequired: { skill: 'nanotechnology', level: 7 },
    stats: { stealth: 100, scanRange: 5000 },
    image: 'https://readdy.ai/api/search-image?query=stealth%20infiltration%20drone%20with%20cloaking%20field%20and%20spy%20equipment%20sci-fi%20game%20icon&width=400&height=400&seq=craft_drone7&orientation=squarish'
  },
  {
    id: 'drone_bomber',
    name: 'Bomber Drone',
    category: 'drones',
    tier: 3,
    rarity: 'rare',
    class: 'elite',
    description: 'Heavy attack drone with missiles, 2000 damage',
    materials: [
      { id: 'durasteel', amount: 150 },
      { id: 'fusion_core', amount: 3 }
    ],
    craftTime: 2700,
    skillRequired: { skill: 'weaponsmithing', level: 6 },
    stats: { attack: 2000, health: 1500 },
    image: 'https://readdy.ai/api/search-image?query=heavy%20bomber%20drone%20with%20missile%20launchers%20and%20explosive%20payload%20sci-fi%20military%20game%20icon&width=400&height=400&seq=craft_drone8&orientation=squarish'
  },
  {
    id: 'drone_constructor',
    name: 'Constructor Drone',
    category: 'drones',
    tier: 3,
    rarity: 'rare',
    class: 'elite',
    description: 'Builds structures automatically, reduces build time 25%',
    materials: [
      { id: 'durasteel', amount: 200 },
      { id: 'raw_nanites', amount: 100 }
    ],
    craftTime: 3000,
    skillRequired: { skill: 'engineering', level: 6 },
    stats: { buildSpeedBonus: 25 },
    image: 'https://readdy.ai/api/search-image?query=constructor%20drone%20with%20building%20tools%20and%20assembly%20arms%20creating%20structures%20sci-fi%20game%20icon&width=400&height=400&seq=craft_drone9&orientation=squarish'
  },
  {
    id: 'drone_carrier',
    name: 'Drone Carrier Module',
    category: 'drones',
    tier: 4,
    rarity: 'epic',
    class: 'master',
    description: 'Launches 10 mini-drones in combat',
    materials: [
      { id: 'quantum_steel', amount: 300 },
      { id: 'quantum_processor', amount: 5 }
    ],
    craftTime: 4200,
    skillRequired: { skill: 'shipbuilding', level: 7 },
    stats: { droneCount: 10, droneAttack: 300 },
    image: 'https://readdy.ai/api/search-image?query=drone%20carrier%20module%20launching%20swarm%20of%20small%20combat%20drones%20sci-fi%20game%20icon&width=400&height=400&seq=craft_drone10&orientation=squarish'
  },
  {
    id: 'drone_quantum',
    name: 'Quantum Drone',
    category: 'drones',
    tier: 5,
    rarity: 'legendary',
    class: 'legendary',
    description: 'Advanced AI drone with quantum computing, adapts to combat',
    materials: [
      { id: 'cosmic_alloy', amount: 200 },
      { id: 'quantum_crystal', amount: 10 }
    ],
    craftTime: 6000,
    skillRequired: { skill: 'nanotechnology', level: 9 },
    stats: { attack: 5000, health: 5000, adaptiveAI: true },
    image: 'https://readdy.ai/api/search-image?query=quantum%20AI%20drone%20with%20glowing%20neural%20network%20and%20advanced%20weapons%20sci-fi%20game%20icon&width=400&height=400&seq=craft_drone11&orientation=squarish'
  },
  {
    id: 'drone_salvage',
    name: 'Salvage Drone',
    category: 'drones',
    tier: 2,
    rarity: 'uncommon',
    class: 'advanced',
    description: 'Collects loot from destroyed ships automatically',
    materials: [
      { id: 'titanium_alloy', amount: 80 },
      { id: 'rare_earth_elements', amount: 15 }
    ],
    craftTime: 1500,
    skillRequired: { skill: 'mining', level: 3 },
    stats: { salvageBonus: 50 },
    image: 'https://readdy.ai/api/search-image?query=salvage%20drone%20collecting%20debris%20and%20materials%20from%20destroyed%20spaceships%20sci-fi%20game%20icon&width=400&height=400&seq=craft_drone12&orientation=squarish'
  },

  // NEW CATEGORY: Augmentations (10 items)
  {
    id: 'aug_neural_link',
    name: 'Neural Command Link',
    category: 'augmentations',
    tier: 2,
    rarity: 'uncommon',
    class: 'advanced',
    description: 'Increases command capacity by 20%',
    materials: [
      { id: 'quantum_processor', amount: 2 },
      { id: 'raw_nanites', amount: 50 }
    ],
    craftTime: 1800,
    skillRequired: { skill: 'electronics', level: 4 },
    stats: { commandBonus: 20 },
    image: 'https://readdy.ai/api/search-image?query=neural%20command%20link%20implant%20with%20glowing%20circuits%20and%20brain%20interface%20sci-fi%20game%20icon&width=400&height=400&seq=craft_aug1&orientation=squarish'
  },
  {
    id: 'aug_combat_reflexes',
    name: 'Combat Reflex Enhancer',
    category: 'augmentations',
    tier: 3,
    rarity: 'rare',
    class: 'elite',
    description: 'Increases attack speed by 30%',
    materials: [
      { id: 'ion_cell', amount: 5 },
      { id: 'quantum_processor', amount: 3 }
    ],
    craftTime: 2400,
    skillRequired: { skill: 'nanotechnology', level: 5 },
    stats: { attackSpeedBonus: 30 },
    image: 'https://readdy.ai/api/search-image?query=combat%20reflex%20enhancer%20with%20speed%20boost%20circuits%20and%20reaction%20time%20display%20sci-fi%20game%20icon&width=400&height=400&seq=craft_aug2&orientation=squarish'
  },
  {
    id: 'aug_shield_matrix',
    name: 'Personal Shield Matrix',
    category: 'augmentations',
    tier: 3,
    rarity: 'rare',
    class: 'elite',
    description: 'Adds 2000 personal shield points',
    materials: [
      { id: 'shield_emitter', amount: 8 },
      { id: 'exotic_alloy', amount: 10 }
    ],
    craftTime: 2700,
    skillRequired: { skill: 'armorsmithing', level: 6 },
    stats: { shieldBonus: 2000 },
    image: 'https://readdy.ai/api/search-image?query=personal%20shield%20matrix%20generator%20with%20blue%20energy%20field%20and%20protection%20aura%20sci-fi%20game%20icon&width=400&height=400&seq=craft_aug3&orientation=squarish'
  },
  {
    id: 'aug_resource_optimizer',
    name: 'Resource Optimization Chip',
    category: 'augmentations',
    tier: 2,
    rarity: 'uncommon',
    class: 'advanced',
    description: 'Reduces resource costs by 15%',
    materials: [
      { id: 'silicon_wafer', amount: 100 },
      { id: 'rare_earth_elements', amount: 20 }
    ],
    craftTime: 1500,
    skillRequired: { skill: 'electronics', level: 3 },
    stats: { resourceEfficiency: 15 },
    image: 'https://readdy.ai/api/search-image?query=resource%20optimization%20chip%20with%20efficiency%20graphs%20and%20cost%20reduction%20display%20sci-fi%20game%20icon&width=400&height=400&seq=craft_aug4&orientation=squarish'
  },
  {
    id: 'aug_tactical_computer',
    name: 'Tactical Analysis Computer',
    category: 'augmentations',
    tier: 4,
    rarity: 'epic',
    class: 'master',
    description: 'Increases critical hit chance by 25%',
    materials: [
      { id: 'quantum_processor', amount: 5 },
      { id: 'antimatter_cell', amount: 2 }
    ],
    craftTime: 3000,
    skillRequired: { skill: 'electronics', level: 7 },
    stats: { critChanceBonus: 25 },
    image: 'https://readdy.ai/api/search-image?query=tactical%20analysis%20computer%20with%20holographic%20battle%20simulations%20and%20targeting%20systems%20sci-fi%20game%20icon&width=400&height=400&seq=craft_aug5&orientation=squarish'
  },
  {
    id: 'aug_energy_recycler',
    name: 'Energy Recycling System',
    category: 'augmentations',
    tier: 3,
    rarity: 'rare',
    class: 'elite',
    description: 'Regenerates 5% energy per second',
    materials: [
      { id: 'fusion_core', amount: 3 },
      { id: 'exotic_alloy', amount: 8 }
    ],
    craftTime: 2400,
    skillRequired: { skill: 'engineering', level: 6 },
    stats: { energyRegen: 5 },
    image: 'https://readdy.ai/api/search-image?query=energy%20recycling%20system%20with%20power%20flow%20circuits%20and%20regeneration%20display%20sci-fi%20game%20icon&width=400&height=400&seq=craft_aug6&orientation=squarish'
  },
  {
    id: 'aug_stealth_cloak',
    name: 'Stealth Cloak Generator',
    category: 'augmentations',
    tier: 4,
    rarity: 'epic',
    class: 'master',
    description: 'Reduces detection range by 50%',
    materials: [
      { id: 'phase_crystal', amount: 5 },
      { id: 'quantum_steel', amount: 100 }
    ],
    craftTime: 3600,
    skillRequired: { skill: 'nanotechnology', level: 7 },
    stats: { stealthBonus: 50 },
    image: 'https://readdy.ai/api/search-image?query=stealth%20cloak%20generator%20with%20invisibility%20field%20and%20phase%20shift%20technology%20sci-fi%20game%20icon&width=400&height=400&seq=craft_aug7&orientation=squarish'
  },
  {
    id: 'aug_damage_amplifier',
    name: 'Weapon Damage Amplifier',
    category: 'augmentations',
    tier: 4,
    rarity: 'epic',
    class: 'master',
    description: 'Increases all weapon damage by 40%',
    materials: [
      { id: 'antimatter_cell', amount: 5 },
      { id: 'quantum_crystal', amount: 3 }
    ],
    craftTime: 3300,
    skillRequired: { skill: 'weaponsmithing', level: 8 },
    stats: { damageBonus: 40 },
    image: 'https://readdy.ai/api/search-image?query=weapon%20damage%20amplifier%20with%20red%20energy%20cores%20and%20power%20boost%20display%20sci-fi%20game%20icon&width=400&height=400&seq=craft_aug8&orientation=squarish'
  },
  {
    id: 'aug_quantum_core',
    name: 'Quantum Processing Core',
    category: 'augmentations',
    tier: 5,
    rarity: 'legendary',
    class: 'legendary',
    description: 'Reduces all cooldowns by 50%',
    materials: [
      { id: 'quantum_crystal', amount: 10 },
      { id: 'cosmic_essence', amount: 3 }
    ],
    craftTime: 5400,
    skillRequired: { skill: 'electronics', level: 9 },
    stats: { cooldownReduction: 50 },
    image: 'https://readdy.ai/api/search-image?query=quantum%20processing%20core%20with%20infinite%20computation%20power%20and%20time%20acceleration%20sci-fi%20game%20icon&width=400&height=400&seq=craft_aug9&orientation=squarish'
  },
  {
    id: 'aug_cosmic_attunement',
    name: 'Cosmic Attunement Matrix',
    category: 'augmentations',
    tier: 5,
    rarity: 'legendary',
    class: 'legendary',
    description: 'Grants immunity to cosmic hazards and +100% all stats',
    materials: [
      { id: 'cosmic_essence', amount: 10 },
      { id: 'temporal_fragment', amount: 5 }
    ],
    craftTime: 7200,
    skillRequired: { skill: 'nanotechnology', level: 10 },
    stats: { allStatsBonus: 100, cosmicImmunity: true },
    image: 'https://readdy.ai/api/search-image?query=cosmic%20attunement%20matrix%20with%20universe%20energy%20and%20transcendent%20power%20sci-fi%20game%20icon&width=400&height=400&seq=craft_aug10&orientation=squarish'
  },

  // NEW CATEGORY: Artifacts (8 items)
  {
    id: 'artifact_ancient_relic',
    name: 'Ancient Precursor Relic',
    category: 'artifacts',
    tier: 4,
    rarity: 'epic',
    class: 'master',
    description: 'Mysterious artifact with unknown power, +500 to all stats',
    materials: [
      { id: 'cosmic_alloy', amount: 50 },
      { id: 'temporal_fragment', amount: 2 }
    ],
    craftTime: 4800,
    skillRequired: { skill: 'alchemy', level: 8 },
    stats: { allStats: 500 },
    image: 'https://readdy.ai/api/search-image?query=ancient%20alien%20precursor%20relic%20with%20glowing%20symbols%20and%20mysterious%20energy%20sci-fi%20game%20icon&width=400&height=400&seq=craft_art1&orientation=squarish'
  },
  {
    id: 'artifact_time_crystal',
    name: 'Temporal Time Crystal',
    category: 'artifacts',
    tier: 5,
    rarity: 'legendary',
    class: 'legendary',
    description: 'Allows time manipulation, rewind 60 seconds once per day',
    materials: [
      { id: 'temporal_fragment', amount: 10 },
      { id: 'cosmic_essence', amount: 5 }
    ],
    craftTime: 7200,
    skillRequired: { skill: 'alchemy', level: 10 },
    stats: { timeRewind: 60 },
    image: 'https://readdy.ai/api/search-image?query=temporal%20time%20crystal%20with%20clock%20symbols%20and%20time%20distortion%20effects%20sci-fi%20game%20icon&width=400&height=400&seq=craft_art2&orientation=squarish'
  },
  {
    id: 'artifact_void_stone',
    name: 'Void Stone',
    category: 'artifacts',
    tier: 4,
    rarity: 'epic',
    class: 'master',
    description: 'Absorbs 30% of incoming damage',
    materials: [
      { id: 'dark_matter_core', amount: 5 },
      { id: 'phase_crystal', amount: 5 }
    ],
    craftTime: 4200,
    skillRequired: { skill: 'alchemy', level: 7 },
    stats: { damageAbsorption: 30 },
    image: 'https://readdy.ai/api/search-image?query=void%20stone%20artifact%20with%20black%20hole%20energy%20and%20damage%20absorption%20field%20sci-fi%20game%20icon&width=400&height=400&seq=craft_art3&orientation=squarish'
  },
  {
    id: 'artifact_star_heart',
    name: 'Heart of a Dying Star',
    category: 'artifacts',
    tier: 5,
    rarity: 'legendary',
    class: 'legendary',
    description: 'Infinite energy source, never run out of power',
    materials: [
      { id: 'cosmic_essence', amount: 8 },
      { id: 'antimatter_cell', amount: 10 }
    ],
    craftTime: 6600,
    skillRequired: { skill: 'alchemy', level: 9 },
    stats: { infiniteEnergy: true },
    image: 'https://readdy.ai/api/search-image?query=heart%20of%20dying%20star%20artifact%20with%20stellar%20core%20energy%20and%20infinite%20power%20sci-fi%20game%20icon&width=400&height=400&seq=craft_art4&orientation=squarish'
  },
  {
    id: 'artifact_reality_shard',
    name: 'Reality Shard',
    category: 'artifacts',
    tier: 5,
    rarity: 'legendary',
    class: 'legendary',
    description: 'Bends reality, 10% chance to dodge any attack',
    materials: [
      { id: 'cosmic_essence', amount: 6 },
      { id: 'quantum_crystal', amount: 8 }
    ],
    craftTime: 6000,
    skillRequired: { skill: 'alchemy', level: 9 },
    stats: { dodgeChance: 10 },
    image: 'https://readdy.ai/api/search-image?query=reality%20shard%20artifact%20with%20dimensional%20fractures%20and%20probability%20manipulation%20sci-fi%20game%20icon&width=400&height=400&seq=craft_art5&orientation=squarish'
  },
  {
    id: 'artifact_genesis_seed',
    name: 'Genesis Seed',
    category: 'artifacts',
    tier: 5,
    rarity: 'legendary',
    class: 'legendary',
    description: 'Can terraform planets instantly',
    materials: [
      { id: 'cosmic_essence', amount: 15 },
      { id: 'temporal_fragment', amount: 8 }
    ],
    craftTime: 9000,
    skillRequired: { skill: 'alchemy', level: 10 },
    stats: { terraformInstant: true },
    image: 'https://readdy.ai/api/search-image?query=genesis%20seed%20artifact%20with%20planet%20creation%20energy%20and%20life%20force%20sci-fi%20game%20icon&width=400&height=400&seq=craft_art6&orientation=squarish'
  },
  {
    id: 'artifact_omega_key',
    name: 'Omega Key',
    category: 'artifacts',
    tier: 5,
    rarity: 'legendary',
    class: 'legendary',
    description: 'Unlocks hidden dimensions and secret areas',
    materials: [
      { id: 'cosmic_alloy', amount: 100 },
      { id: 'phase_crystal', amount: 10 }
    ],
    craftTime: 7800,
    skillRequired: { skill: 'alchemy', level: 10 },
    stats: { dimensionAccess: true },
    image: 'https://readdy.ai/api/search-image?query=omega%20key%20artifact%20with%20dimensional%20portal%20and%20universe%20unlocking%20power%20sci-fi%20game%20icon&width=400&height=400&seq=craft_art7&orientation=squarish'
  },
  {
    id: 'artifact_infinity_gauntlet',
    name: 'Infinity Gauntlet',
    category: 'artifacts',
    tier: 5,
    rarity: 'mythic',
    class: 'universal',
    description: 'Ultimate power artifact, doubles all stats and abilities',
    materials: [
      { id: 'cosmic_essence', amount: 20 },
      { id: 'temporal_fragment', amount: 15 },
      { id: 'dark_matter_core', amount: 10 }
    ],
    craftTime: 12000,
    skillRequired: { skill: 'alchemy', level: 10 },
    stats: { allStatsMultiplier: 2 },
    image: 'https://readdy.ai/api/search-image?query=infinity%20gauntlet%20with%20cosmic%20gems%20and%20ultimate%20power%20energy%20sci-fi%20game%20icon&width=400&height=400&seq=craft_art8&orientation=squarish'
  }
];

// Update categories
export const craftingCategories = [
  'all',
  'weapons',
  'armor',
  'modules',
  'components',
  'blueprints',
  'technology',
  'equipment',
  'starships',
  'consumables',
  'drones',
  'augmentations',
  'artifacts'
] as const;
