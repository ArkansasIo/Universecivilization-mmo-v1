// Advanced Research & Technology Systems
export type TechnologyCategory = 
  | 'weapons' 
  | 'defense' 
  | 'propulsion' 
  | 'energy' 
  | 'production' 
  | 'military' 
  | 'espionage' 
  | 'exotic';

export type ResearchTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface TechnologyEffect {
  type: 'damage' | 'defense' | 'speed' | 'production' | 'efficiency' | 'capacity' | 'special';
  value: number;
  description: string;
}

export interface ResearchTechnology {
  id: string;
  name: string;
  category: TechnologyCategory;
  tier: ResearchTier;
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';
  maxLevel: number;
  description: string;
  lore: string;
  effects: TechnologyEffect[];
  baseCost: {
    metal: number;
    crystal: number;
    deuterium: number;
    darkMatter?: number;
  };
  baseTime: number; // in seconds
  requirements: {
    level?: number;
    technologies?: { id: string; level: number }[];
    buildings?: { id: string; level: number }[];
  };
  unlocks: string[]; // IDs of technologies this unlocks
  bonuses: {
    perLevel: string[];
  };
  specialAbilities?: {
    name: string;
    description: string;
    unlocksAt: number; // level
  }[];
}

export const researchTechnologies: ResearchTechnology[] = [
  // WEAPONS TECHNOLOGIES
  {
    id: 'laser_weapons_tech',
    name: 'Laser Weapons Technology',
    category: 'weapons',
    tier: 1,
    rank: 'D',
    maxLevel: 20,
    description: 'Research into focused energy beam weapons. Increases laser weapon damage and efficiency.',
    lore: 'Laser technology forms the foundation of all energy weapons. Mastering the manipulation of coherent light is the first step toward galactic dominance.',
    effects: [
      { type: 'damage', value: 10, description: '+10% laser weapon damage per level' },
      { type: 'efficiency', value: 5, description: '-5% energy cost per level' }
    ],
    baseCost: {
      metal: 5000,
      crystal: 10000,
      deuterium: 2000
    },
    baseTime: 1800,
    requirements: {
      level: 5
    },
    unlocks: ['pulse_laser_tech', 'ion_weapons_tech'],
    bonuses: {
      perLevel: [
        '+10% laser weapon damage',
        '-5% laser weapon energy cost',
        '+2% laser weapon accuracy',
        'Unlock advanced laser weapons at level 10'
      ]
    },
    specialAbilities: [
      {
        name: 'Focused Beam Mastery',
        description: 'Laser weapons can penetrate shields more effectively',
        unlocksAt: 10
      },
      {
        name: 'Laser Supremacy',
        description: 'All laser weapons gain +50% critical damage',
        unlocksAt: 20
      }
    ]
  },
  {
    id: 'pulse_laser_tech',
    name: 'Pulse Laser Technology',
    category: 'weapons',
    tier: 2,
    rank: 'C',
    maxLevel: 25,
    description: 'Advanced pulsed laser systems that deliver devastating bursts of energy.',
    lore: 'By releasing laser energy in controlled pulses, scientists discovered they could achieve damage levels far beyond continuous beams.',
    effects: [
      { type: 'damage', value: 15, description: '+15% pulse laser damage per level' },
      { type: 'special', value: 5, description: '+5% critical chance per level' }
    ],
    baseCost: {
      metal: 15000,
      crystal: 30000,
      deuterium: 8000
    },
    baseTime: 3600,
    requirements: {
      level: 15,
      technologies: [{ id: 'laser_weapons_tech', level: 8 }]
    },
    unlocks: ['plasma_weapons_tech'],
    bonuses: {
      perLevel: [
        '+15% pulse laser damage',
        '+5% critical chance',
        '+3% armor penetration',
        'Unlock heavy pulse lasers at level 15'
      ]
    },
    specialAbilities: [
      {
        name: 'Burst Fire Protocol',
        description: 'Pulse lasers can fire rapid bursts',
        unlocksAt: 12
      },
      {
        name: 'Shield Disruption',
        description: 'Pulse lasers ignore 30% of shields',
        unlocksAt: 25
      }
    ]
  },
  {
    id: 'ion_weapons_tech',
    name: 'Ion Weapons Technology',
    category: 'weapons',
    tier: 2,
    rank: 'C',
    maxLevel: 25,
    description: 'Charged particle weapons that excel at disrupting shields and electronic systems.',
    lore: 'Ion weapons were developed specifically to counter energy shield technology, firing streams of charged particles that overload defensive systems.',
    effects: [
      { type: 'damage', value: 12, description: '+12% ion weapon damage per level' },
      { type: 'special', value: 8, description: '+8% shield penetration per level' }
    ],
    baseCost: {
      metal: 12000,
      crystal: 25000,
      deuterium: 6000
    },
    baseTime: 3000,
    requirements: {
      level: 12,
      technologies: [{ id: 'laser_weapons_tech', level: 6 }]
    },
    unlocks: ['plasma_weapons_tech', 'emp_tech'],
    bonuses: {
      perLevel: [
        '+12% ion weapon damage',
        '+8% shield penetration',
        '+5% system disruption chance',
        'Unlock heavy ion cannons at level 15'
      ]
    },
    specialAbilities: [
      {
        name: 'System Overload',
        description: 'Ion weapons can disable enemy systems',
        unlocksAt: 10
      },
      {
        name: 'EMP Burst',
        description: 'Ion weapons create electromagnetic pulses',
        unlocksAt: 25
      }
    ]
  },
  {
    id: 'plasma_weapons_tech',
    name: 'Plasma Weapons Technology',
    category: 'weapons',
    tier: 3,
    rank: 'B',
    maxLevel: 30,
    description: 'Harness the power of superheated plasma to create devastating weapons.',
    lore: 'Plasma weapons contain the fury of stars, launching bolts of matter heated to millions of degrees at enemy vessels.',
    effects: [
      { type: 'damage', value: 20, description: '+20% plasma weapon damage per level' },
      { type: 'special', value: 10, description: '+10% armor penetration per level' }
    ],
    baseCost: {
      metal: 40000,
      crystal: 80000,
      deuterium: 20000
    },
    baseTime: 7200,
    requirements: {
      level: 30,
      technologies: [
        { id: 'pulse_laser_tech', level: 12 },
        { id: 'ion_weapons_tech', level: 10 }
      ]
    },
    unlocks: ['graviton_weapons_tech'],
    bonuses: {
      perLevel: [
        '+20% plasma weapon damage',
        '+10% armor penetration',
        '+5% burning damage over time',
        'Unlock mega plasma weapons at level 20'
      ]
    },
    specialAbilities: [
      {
        name: 'Plasma Inferno',
        description: 'Plasma weapons apply burning effects',
        unlocksAt: 15
      },
      {
        name: 'Superheated Plasma',
        description: 'Plasma weapons deal splash damage',
        unlocksAt: 30
      }
    ]
  },
  {
    id: 'graviton_weapons_tech',
    name: 'Graviton Weapons Technology',
    category: 'weapons',
    tier: 5,
    rank: 'A',
    maxLevel: 40,
    description: 'Weaponize gravity itself to crush enemy vessels from within.',
    lore: 'Graviton weapons represent a breakthrough in physics, allowing commanders to manipulate one of the fundamental forces of the universe as a weapon.',
    effects: [
      { type: 'damage', value: 25, description: '+25% graviton weapon damage per level' },
      { type: 'special', value: 15, description: 'Ignores +15% of all defenses per level' }
    ],
    baseCost: {
      metal: 150000,
      crystal: 300000,
      deuterium: 80000,
      darkMatter: 500
    },
    baseTime: 18000,
    requirements: {
      level: 60,
      technologies: [
        { id: 'plasma_weapons_tech', level: 20 },
        { id: 'quantum_physics_tech', level: 15 }
      ]
    },
    unlocks: ['quantum_weapons_tech'],
    bonuses: {
      perLevel: [
        '+25% graviton weapon damage',
        'Ignores +15% of all defenses',
        '+8% area of effect',
        'Unlock singularity weapons at level 30'
      ]
    },
    specialAbilities: [
      {
        name: 'Gravity Well',
        description: 'Create localized gravity wells that pull enemies together',
        unlocksAt: 20
      },
      {
        name: 'Singularity Strike',
        description: 'Create micro black holes that devastate everything nearby',
        unlocksAt: 40
      }
    ]
  },
  {
    id: 'quantum_weapons_tech',
    name: 'Quantum Weapons Technology',
    category: 'weapons',
    tier: 6,
    rank: 'S',
    maxLevel: 50,
    description: 'Attack matter at the quantum level, bypassing conventional defenses entirely.',
    lore: 'Quantum weapons operate on principles that defy classical physics, disrupting matter at the subatomic level where shields and armor are meaningless.',
    effects: [
      { type: 'damage', value: 35, description: '+35% quantum weapon damage per level' },
      { type: 'special', value: 20, description: 'Ignores +20% of all defenses per level' }
    ],
    baseCost: {
      metal: 500000,
      crystal: 1000000,
      deuterium: 300000,
      darkMatter: 2000
    },
    baseTime: 36000,
    requirements: {
      level: 85,
      technologies: [
        { id: 'graviton_weapons_tech', level: 30 },
        { id: 'quantum_physics_tech', level: 25 }
      ]
    },
    unlocks: ['antimatter_weapons_tech'],
    bonuses: {
      perLevel: [
        '+35% quantum weapon damage',
        'Ignores +20% of all defenses',
        '+10% quantum cascade chance',
        'Unlock reality-bending weapons at level 40'
      ]
    },
    specialAbilities: [
      {
        name: 'Quantum Cascade',
        description: 'Damage spreads to nearby targets through quantum entanglement',
        unlocksAt: 25
      },
      {
        name: 'Molecular Disintegration',
        description: 'Completely disintegrate target molecules',
        unlocksAt: 50
      }
    ]
  },
  {
    id: 'antimatter_weapons_tech',
    name: 'Antimatter Weapons Technology',
    category: 'weapons',
    tier: 8,
    rank: 'SSS',
    maxLevel: 100,
    description: 'The ultimate weapon technology. Harness matter-antimatter annihilation for unimaginable destruction.',
    lore: 'Antimatter weapons represent the pinnacle of destructive capability. A single gram of antimatter releases energy equivalent to a nuclear bomb. Civilizations have fallen in pursuit of this power.',
    effects: [
      { type: 'damage', value: 50, description: '+50% antimatter weapon damage per level' },
      { type: 'special', value: 30, description: 'Ignores +30% of all defenses per level' }
    ],
    baseCost: {
      metal: 2000000,
      crystal: 4000000,
      deuterium: 1000000,
      darkMatter: 10000
    },
    baseTime: 72000,
    requirements: {
      level: 120,
      technologies: [
        { id: 'quantum_weapons_tech', level: 40 },
        { id: 'antimatter_physics_tech', level: 30 }
      ]
    },
    unlocks: [],
    bonuses: {
      perLevel: [
        '+50% antimatter weapon damage',
        'Ignores +30% of all defenses',
        '+15% annihilation radius',
        '+20% critical damage',
        'Unlock Omega weapons at level 75'
      ]
    },
    specialAbilities: [
      {
        name: 'Annihilation Wave',
        description: 'Release waves of antimatter that destroy everything in their path',
        unlocksAt: 50
      },
      {
        name: 'Total Destruction',
        description: 'Unleash maximum antimatter payload for apocalyptic damage',
        unlocksAt: 100
      }
    ]
  },

  // DEFENSE TECHNOLOGIES
  {
    id: 'shielding_tech',
    name: 'Shielding Technology',
    category: 'defense',
    tier: 1,
    rank: 'D',
    maxLevel: 20,
    description: 'Energy shield systems that absorb incoming damage.',
    lore: 'Energy shields revolutionized space combat by providing a renewable defense layer that regenerates between battles.',
    effects: [
      { type: 'defense', value: 10, description: '+10% shield strength per level' },
      { type: 'special', value: 5, description: '+5% shield regeneration per level' }
    ],
    baseCost: {
      metal: 4000,
      crystal: 12000,
      deuterium: 2000
    },
    baseTime: 2000,
    requirements: {
      level: 5
    },
    unlocks: ['advanced_shielding_tech', 'barrier_tech'],
    bonuses: {
      perLevel: [
        '+10% shield capacity',
        '+5% shield regeneration',
        '+3% energy efficiency',
        'Unlock advanced shields at level 10'
      ]
    },
    specialAbilities: [
      {
        name: 'Rapid Recharge',
        description: 'Shields regenerate faster when not taking damage',
        unlocksAt: 10
      },
      {
        name: 'Shield Hardening',
        description: 'Shields resist penetration effects',
        unlocksAt: 20
      }
    ]
  },
  {
    id: 'advanced_shielding_tech',
    name: 'Advanced Shielding Technology',
    category: 'defense',
    tier: 3,
    rank: 'B',
    maxLevel: 30,
    description: 'Multi-layered shield systems with adaptive properties.',
    lore: 'Advanced shields use multiple overlapping fields that adapt to incoming damage types, providing superior protection.',
    effects: [
      { type: 'defense', value: 15, description: '+15% shield strength per level' },
      { type: 'special', value: 8, description: '+8% adaptive resistance per level' }
    ],
    baseCost: {
      metal: 50000,
      crystal: 100000,
      deuterium: 25000
    },
    baseTime: 8000,
    requirements: {
      level: 35,
      technologies: [{ id: 'shielding_tech', level: 12 }]
    },
    unlocks: ['quantum_shielding_tech'],
    bonuses: {
      perLevel: [
        '+15% shield capacity',
        '+8% adaptive resistance',
        '+5% regeneration rate',
        'Unlock quantum shields at level 20'
      ]
    },
    specialAbilities: [
      {
        name: 'Adaptive Shielding',
        description: 'Shields adapt to resist the last damage type received',
        unlocksAt: 15
      },
      {
        name: 'Shield Overcharge',
        description: 'Temporarily boost shield capacity by 100%',
        unlocksAt: 30
      }
    ]
  },
  {
    id: 'quantum_shielding_tech',
    name: 'Quantum Shielding Technology',
    category: 'defense',
    tier: 6,
    rank: 'S',
    maxLevel: 50,
    description: 'Shields that exist across multiple quantum states simultaneously.',
    lore: 'Quantum shields use entangled particles to distribute damage across multiple dimensions, making them nearly impenetrable.',
    effects: [
      { type: 'defense', value: 25, description: '+25% shield strength per level' },
      { type: 'special', value: 15, description: '+15% quantum resistance per level' }
    ],
    baseCost: {
      metal: 400000,
      crystal: 800000,
      deuterium: 200000,
      darkMatter: 1500
    },
    baseTime: 30000,
    requirements: {
      level: 80,
      technologies: [
        { id: 'advanced_shielding_tech', level: 25 },
        { id: 'quantum_physics_tech', level: 20 }
      ]
    },
    unlocks: ['reality_shielding_tech'],
    bonuses: {
      perLevel: [
        '+25% shield capacity',
        '+15% quantum resistance',
        '+10% regeneration rate',
        'Shields reflect 5% of damage per level'
      ]
    },
    specialAbilities: [
      {
        name: 'Quantum Barrier',
        description: 'Become immune to all damage for 5 seconds',
        unlocksAt: 30
      },
      {
        name: 'Dimensional Phasing',
        description: 'Phase shields into another dimension to avoid damage',
        unlocksAt: 50
      }
    ]
  },
  {
    id: 'armor_tech',
    name: 'Armor Technology',
    category: 'defense',
    tier: 1,
    rank: 'D',
    maxLevel: 20,
    description: 'Advanced hull materials and armor plating.',
    lore: 'Armor technology focuses on creating materials that can withstand the incredible forces of space combat.',
    effects: [
      { type: 'defense', value: 12, description: '+12% armor strength per level' },
      { type: 'special', value: 5, description: '+5% damage reduction per level' }
    ],
    baseCost: {
      metal: 8000,
      crystal: 4000,
      deuterium: 1000
    },
    baseTime: 1800,
    requirements: {
      level: 3
    },
    unlocks: ['composite_armor_tech', 'reactive_armor_tech'],
    bonuses: {
      perLevel: [
        '+12% armor capacity',
        '+5% damage reduction',
        '+3% kinetic resistance',
        'Unlock heavy armor at level 10'
      ]
    },
    specialAbilities: [
      {
        name: 'Reinforced Hull',
        description: 'Armor provides additional structural integrity',
        unlocksAt: 10
      },
      {
        name: 'Ablative Plating',
        description: 'Armor sacrifices outer layers to absorb damage',
        unlocksAt: 20
      }
    ]
  },
  {
    id: 'composite_armor_tech',
    name: 'Composite Armor Technology',
    category: 'defense',
    tier: 3,
    rank: 'B',
    maxLevel: 30,
    description: 'Multi-layered composite armor with self-repair capabilities.',
    lore: 'Composite armor combines multiple materials in layered structures, each optimized for different threats.',
    effects: [
      { type: 'defense', value: 18, description: '+18% armor strength per level' },
      { type: 'special', value: 8, description: '+8% self-repair rate per level' }
    ],
    baseCost: {
      metal: 60000,
      crystal: 30000,
      deuterium: 15000
    },
    baseTime: 9000,
    requirements: {
      level: 40,
      technologies: [{ id: 'armor_tech', level: 15 }]
    },
    unlocks: ['neutronium_armor_tech'],
    bonuses: {
      perLevel: [
        '+18% armor capacity',
        '+8% self-repair rate',
        '+5% all resistances',
        'Unlock reactive armor at level 20'
      ]
    },
    specialAbilities: [
      {
        name: 'Reactive Armor',
        description: 'Armor reacts to incoming damage to reduce impact',
        unlocksAt: 15
      },
      {
        name: 'Emergency Repair',
        description: 'Instantly restore 30% of armor',
        unlocksAt: 30
      }
    ]
  },
  {
    id: 'neutronium_armor_tech',
    name: 'Neutronium Armor Technology',
    category: 'defense',
    tier: 6,
    rank: 'S',
    maxLevel: 50,
    description: 'Armor forged from neutronium, one of the densest materials in the universe.',
    lore: 'Neutronium armor is harvested from neutron stars at tremendous cost. Nearly impervious to conventional weapons.',
    effects: [
      { type: 'defense', value: 30, description: '+30% armor strength per level' },
      { type: 'special', value: 12, description: '+12% damage reflection per level' }
    ],
    baseCost: {
      metal: 600000,
      crystal: 300000,
      deuterium: 150000,
      darkMatter: 2000
    },
    baseTime: 40000,
    requirements: {
      level: 90,
      technologies: [{ id: 'composite_armor_tech', level: 25 }]
    },
    unlocks: [],
    bonuses: {
      perLevel: [
        '+30% armor capacity',
        '+12% damage reflection',
        '+10% all resistances',
        'Cannot be penetrated by conventional weapons'
      ]
    },
    specialAbilities: [
      {
        name: 'Impenetrable Defense',
        description: 'Immune to armor penetration effects',
        unlocksAt: 30
      },
      {
        name: 'Kinetic Reflection',
        description: 'Reflect 50% of kinetic damage back to attacker',
        unlocksAt: 50
      }
    ]
  },

  // PROPULSION TECHNOLOGIES
  {
    id: 'impulse_drive_tech',
    name: 'Impulse Drive Technology',
    category: 'propulsion',
    tier: 1,
    rank: 'D',
    maxLevel: 20,
    description: 'Basic faster-than-light propulsion systems.',
    lore: 'Impulse drives allow ships to travel between star systems in reasonable timeframes.',
    effects: [
      { type: 'speed', value: 10, description: '+10% ship speed per level' },
      { type: 'efficiency', value: 5, description: '-5% fuel consumption per level' }
    ],
    baseCost: {
      metal: 3000,
      crystal: 6000,
      deuterium: 4000
    },
    baseTime: 1500,
    requirements: {
      level: 3
    },
    unlocks: ['hyperspace_drive_tech'],
    bonuses: {
      perLevel: [
        '+10% ship speed',
        '-5% fuel consumption',
        '+3% maneuverability',
        'Unlock advanced drives at level 10'
      ]
    }
  },
  {
    id: 'hyperspace_drive_tech',
    name: 'Hyperspace Drive Technology',
    category: 'propulsion',
    tier: 3,
    rank: 'B',
    maxLevel: 30,
    description: 'Travel through hyperspace for dramatically increased speed.',
    lore: 'Hyperspace drives allow ships to enter an alternate dimension where the laws of physics permit faster-than-light travel.',
    effects: [
      { type: 'speed', value: 20, description: '+20% ship speed per level' },
      { type: 'efficiency', value: 8, description: '-8% fuel consumption per level' }
    ],
    baseCost: {
      metal: 50000,
      crystal: 100000,
      deuterium: 80000
    },
    baseTime: 10000,
    requirements: {
      level: 35,
      technologies: [{ id: 'impulse_drive_tech', level: 12 }]
    },
    unlocks: ['wormhole_drive_tech'],
    bonuses: {
      perLevel: [
        '+20% ship speed',
        '-8% fuel consumption',
        '+5% evasion',
        'Unlock wormhole drives at level 20'
      ]
    },
    specialAbilities: [
      {
        name: 'Hyperspace Jump',
        description: 'Instantly travel to any location in the same galaxy',
        unlocksAt: 15
      },
      {
        name: 'Emergency Warp',
        description: 'Escape from combat instantly',
        unlocksAt: 30
      }
    ]
  },
  {
    id: 'wormhole_drive_tech',
    name: 'Wormhole Drive Technology',
    category: 'propulsion',
    tier: 6,
    rank: 'S',
    maxLevel: 50,
    description: 'Create artificial wormholes for instant travel across vast distances.',
    lore: 'Wormhole technology allows ships to fold space-time itself, creating shortcuts through the fabric of reality.',
    effects: [
      { type: 'speed', value: 40, description: '+40% ship speed per level' },
      { type: 'special', value: 10, description: '+10% instant travel range per level' }
    ],
    baseCost: {
      metal: 800000,
      crystal: 1600000,
      deuterium: 1200000,
      darkMatter: 3000
    },
    baseTime: 50000,
    requirements: {
      level: 95,
      technologies: [
        { id: 'hyperspace_drive_tech', level: 25 },
        { id: 'quantum_physics_tech', level: 20 }
      ]
    },
    unlocks: [],
    bonuses: {
      perLevel: [
        '+40% ship speed',
        '+10% instant travel range',
        'No fuel consumption for wormhole travel',
        'Can travel between galaxies'
      ]
    },
    specialAbilities: [
      {
        name: 'Wormhole Network',
        description: 'Create permanent wormhole gates between systems',
        unlocksAt: 30
      },
      {
        name: 'Dimensional Shift',
        description: 'Phase through obstacles and enemy fleets',
        unlocksAt: 50
      }
    ]
  },

  // ENERGY TECHNOLOGIES
  {
    id: 'fusion_reactor_tech',
    name: 'Fusion Reactor Technology',
    category: 'energy',
    tier: 2,
    rank: 'C',
    maxLevel: 25,
    description: 'Advanced fusion reactors that provide massive energy output.',
    lore: 'Fusion reactors harness the power of stars, fusing hydrogen atoms to release tremendous energy.',
    effects: [
      { type: 'production', value: 15, description: '+15% energy production per level' },
      { type: 'efficiency', value: 8, description: '+8% energy efficiency per level' }
    ],
    baseCost: {
      metal: 20000,
      crystal: 40000,
      deuterium: 30000
    },
    baseTime: 5000,
    requirements: {
      level: 20
    },
    unlocks: ['antimatter_reactor_tech'],
    bonuses: {
      perLevel: [
        '+15% energy production',
        '+8% energy efficiency',
        '-5% reactor fuel consumption',
        'Unlock antimatter reactors at level 20'
      ]
    }
  },
  {
    id: 'antimatter_reactor_tech',
    name: 'Antimatter Reactor Technology',
    category: 'energy',
    tier: 5,
    rank: 'A',
    maxLevel: 40,
    description: 'Harness matter-antimatter annihilation for unlimited energy.',
    lore: 'Antimatter reactors produce energy through controlled matter-antimatter reactions, the most efficient energy source known.',
    effects: [
      { type: 'production', value: 30, description: '+30% energy production per level' },
      { type: 'capacity', value: 20, description: '+20% energy storage per level' }
    ],
    baseCost: {
      metal: 300000,
      crystal: 600000,
      deuterium: 400000,
      darkMatter: 1000
    },
    baseTime: 25000,
    requirements: {
      level: 70,
      technologies: [{ id: 'fusion_reactor_tech', level: 20 }]
    },
    unlocks: ['zero_point_energy_tech'],
    bonuses: {
      perLevel: [
        '+30% energy production',
        '+20% energy storage',
        'Unlimited energy at level 40',
        'Powers all ship systems'
      ]
    }
  },

  // PRODUCTION TECHNOLOGIES
  {
    id: 'mining_tech',
    name: 'Mining Technology',
    category: 'production',
    tier: 1,
    rank: 'D',
    maxLevel: 25,
    description: 'Advanced mining techniques and equipment.',
    lore: 'Efficient resource extraction is the foundation of any galactic empire.',
    effects: [
      { type: 'production', value: 10, description: '+10% mining output per level' },
      { type: 'efficiency', value: 5, description: '+5% mining efficiency per level' }
    ],
    baseCost: {
      metal: 5000,
      crystal: 3000,
      deuterium: 1000
    },
    baseTime: 1200,
    requirements: {
      level: 1
    },
    unlocks: ['advanced_mining_tech'],
    bonuses: {
      perLevel: [
        '+10% metal production',
        '+10% crystal production',
        '+10% deuterium production',
        'Unlock asteroid mining at level 15'
      ]
    }
  },
  {
    id: 'nanite_tech',
    name: 'Nanite Technology',
    category: 'production',
    tier: 5,
    rank: 'A',
    maxLevel: 40,
    description: 'Self-replicating nanites that revolutionize production and repair.',
    lore: 'Nanite swarms can construct anything from raw materials, building ships and structures at incredible speed.',
    effects: [
      { type: 'production', value: 25, description: '+25% production speed per level' },
      { type: 'special', value: 15, description: '+15% repair rate per level' }
    ],
    baseCost: {
      metal: 400000,
      crystal: 800000,
      deuterium: 300000,
      darkMatter: 1500
    },
    baseTime: 30000,
    requirements: {
      level: 75,
      technologies: [{ id: 'advanced_mining_tech', level: 20 }]
    },
    unlocks: [],
    bonuses: {
      perLevel: [
        '+25% production speed',
        '+15% repair rate',
        '-10% construction costs',
        'Instant repairs at level 40'
      ]
    },
    specialAbilities: [
      {
        name: 'Nanite Swarm',
        description: 'Deploy nanites to rapidly construct buildings',
        unlocksAt: 20
      },
      {
        name: 'Self-Replication',
        description: 'Nanites replicate themselves for exponential growth',
        unlocksAt: 40
      }
    ]
  },

  // EXOTIC TECHNOLOGIES
  {
    id: 'quantum_physics_tech',
    name: 'Quantum Physics',
    category: 'exotic',
    tier: 4,
    rank: 'B',
    maxLevel: 35,
    description: 'Understanding of quantum mechanics and subatomic particles.',
    lore: 'Quantum physics unlocks the secrets of reality at the smallest scales, enabling technologies that seem like magic.',
    effects: [
      { type: 'special', value: 10, description: '+10% to all quantum technologies per level' }
    ],
    baseCost: {
      metal: 100000,
      crystal: 200000,
      deuterium: 100000,
      darkMatter: 500
    },
    baseTime: 15000,
    requirements: {
      level: 50
    },
    unlocks: ['quantum_weapons_tech', 'quantum_shielding_tech', 'quantum_computing_tech'],
    bonuses: {
      perLevel: [
        '+10% quantum technology effectiveness',
        'Unlock quantum weapons',
        'Unlock quantum shields',
        'Unlock quantum computing'
      ]
    }
  },
  {
    id: 'antimatter_physics_tech',
    name: 'Antimatter Physics',
    category: 'exotic',
    tier: 6,
    rank: 'S',
    maxLevel: 45,
    description: 'Mastery of antimatter and its applications.',
    lore: 'Antimatter represents the ultimate power source and weapon. Understanding its properties is the key to galactic supremacy.',
    effects: [
      { type: 'special', value: 15, description: '+15% to all antimatter technologies per level' }
    ],
    baseCost: {
      metal: 600000,
      crystal: 1200000,
      deuterium: 800000,
      darkMatter: 3000
    },
    baseTime: 40000,
    requirements: {
      level: 100,
      technologies: [{ id: 'quantum_physics_tech', level: 25 }]
    },
    unlocks: ['antimatter_weapons_tech', 'antimatter_reactor_tech'],
    bonuses: {
      perLevel: [
        '+15% antimatter technology effectiveness',
        'Unlock antimatter weapons',
        'Unlock antimatter reactors',
        'Unlock reality manipulation'
      ]
    }
  },
  {
    id: 'time_manipulation_tech',
    name: 'Time Manipulation Technology',
    category: 'exotic',
    tier: 7,
    rank: 'SS',
    maxLevel: 60,
    description: 'Bend time itself to your will.',
    lore: 'Time manipulation represents the ultimate power - the ability to rewrite history and see the future.',
    effects: [
      { type: 'special', value: 20, description: '+20% time dilation effects per level' }
    ],
    baseCost: {
      metal: 1500000,
      crystal: 3000000,
      deuterium: 2000000,
      darkMatter: 8000
    },
    baseTime: 60000,
    requirements: {
      level: 130,
      technologies: [
        { id: 'antimatter_physics_tech', level: 35 },
        { id: 'quantum_physics_tech', level: 30 }
      ]
    },
    unlocks: ['reality_bending_tech'],
    bonuses: {
      perLevel: [
        '+20% time dilation',
        'Slow enemy ships',
        'Speed up production',
        'Rewind time in combat'
      ]
    },
    specialAbilities: [
      {
        name: 'Time Stop',
        description: 'Freeze time for all enemies',
        unlocksAt: 30
      },
      {
        name: 'Temporal Rewind',
        description: 'Undo the last 10 seconds of combat',
        unlocksAt: 60
      }
    ]
  },
  {
    id: 'reality_bending_tech',
    name: 'Reality Bending Technology',
    category: 'exotic',
    tier: 8,
    rank: 'SSS',
    maxLevel: 100,
    description: 'Manipulate the fabric of reality itself.',
    lore: 'Reality bending is the ultimate technology. Those who master it become gods, able to reshape the universe according to their will.',
    effects: [
      { type: 'special', value: 50, description: '+50% to all technologies per level' }
    ],
    baseCost: {
      metal: 5000000,
      crystal: 10000000,
      deuterium: 5000000,
      darkMatter: 25000
    },
    baseTime: 100000,
    requirements: {
      level: 150,
      technologies: [
        { id: 'time_manipulation_tech', level: 50 },
        { id: 'antimatter_physics_tech', level: 40 }
      ]
    },
    unlocks: [],
    bonuses: {
      perLevel: [
        '+50% to all technologies',
        'Rewrite the laws of physics',
        'Create matter from nothing',
        'Become omnipotent at level 100'
      ]
    },
    specialAbilities: [
      {
        name: 'Reality Warp',
        description: 'Reshape reality to your advantage',
        unlocksAt: 50
      },
      {
        name: 'Omnipotence',
        description: 'Gain absolute power over the universe',
        unlocksAt: 100
      }
    ]
  }
];

// Helper functions
export const getTechnologiesByCategory = (category: TechnologyCategory) => 
  researchTechnologies.filter(t => t.category === category);

export const getTechnologiesByTier = (tier: ResearchTier) => 
  researchTechnologies.filter(t => t.tier === tier);

export const getTechnologiesByRank = (rank: string) => 
  researchTechnologies.filter(t => t.rank === rank);

export const calculateResearchCost = (tech: ResearchTechnology, level: number) => {
  const multiplier = Math.pow(1.5, level - 1);
  return {
    metal: Math.floor(tech.baseCost.metal * multiplier),
    crystal: Math.floor(tech.baseCost.crystal * multiplier),
    deuterium: Math.floor(tech.baseCost.deuterium * multiplier),
    darkMatter: tech.baseCost.darkMatter ? Math.floor(tech.baseCost.darkMatter * multiplier) : 0
  };
};

export const calculateResearchTime = (tech: ResearchTechnology, level: number, labLevel: number = 1) => {
  const multiplier = Math.pow(1.4, level - 1);
  const baseTime = tech.baseTime * multiplier;
  const labBonus = 1 - (labLevel * 0.02); // 2% reduction per lab level
  return Math.floor(baseTime * Math.max(0.1, labBonus));
};

export const canResearch = (
  tech: ResearchTechnology,
  playerLevel: number,
  completedTechs: { id: string; level: number }[]
): boolean => {
  // Check player level
  if (tech.requirements.level && playerLevel < tech.requirements.level) {
    return false;
  }

  // Check technology requirements
  if (tech.requirements.technologies) {
    for (const req of tech.requirements.technologies) {
      const completed = completedTechs.find(t => t.id === req.id);
      if (!completed || completed.level < req.level) {
        return false;
      }
    }
  }

  return true;
};