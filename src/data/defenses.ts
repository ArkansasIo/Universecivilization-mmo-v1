// Defense Systems Database
export type DefenseType = 'shield' | 'armor' | 'point_defense' | 'barrier' | 'regeneration' | 'stealth' | 'countermeasure';
export type DefenseClass = 'light' | 'medium' | 'heavy' | 'capital' | 'titan' | 'ultimate';

export interface DefenseStats {
  protection: number; // damage reduction
  capacity: number; // total hit points
  regeneration: number; // per second
  coverage: number; // percentage of ship covered
  resistance: {
    kinetic: number;
    energy: number;
    explosive: number;
    quantum: number;
  };
  energyCost: number; // per second to maintain
}

export interface DefenseAbility {
  name: string;
  description: string;
  effect: string;
  cooldown: number;
  energyCost: number;
}

export interface Defense {
  id: string;
  name: string;
  type: DefenseType;
  class: DefenseClass;
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';
  tier: number;
  level: number;
  maxLevel: number;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Cosmic' | 'Universal';
  description: string;
  lore: string;
  stats: DefenseStats;
  bonusStats: {
    protectionBonus?: number;
    capacityBonus?: number;
    regenerationBonus?: number;
    resistanceBonus?: number;
  };
  abilities: DefenseAbility[];
  specialEffects: string[];
  requirements: {
    level: number;
    technology?: string;
    techLevel?: number;
  };
  cost: {
    metal: number;
    crystal: number;
    deuterium: number;
    darkMatter?: number;
  };
  powerRating: number;
}

export const defenses: Defense[] = [
  // SHIELD SYSTEMS
  {
    id: 'shield_1',
    name: 'Basic Energy Shield',
    type: 'shield',
    class: 'light',
    rank: 'E',
    tier: 1,
    level: 1,
    maxLevel: 20,
    rarity: 'Common',
    description: 'A standard energy shield that absorbs incoming damage. Regenerates slowly over time.',
    lore: 'Energy shields revolutionized space combat by providing a renewable defense layer. These basic models are found on nearly every vessel.',
    stats: {
      protection: 500,
      capacity: 5000,
      regeneration: 50,
      coverage: 80,
      resistance: {
        kinetic: 20,
        energy: 40,
        explosive: 15,
        quantum: 5
      },
      energyCost: 10
    },
    bonusStats: {
      capacityBonus: 500,
      regenerationBonus: 5
    },
    abilities: [
      {
        name: 'Shield Boost',
        description: 'Temporarily increase shield strength',
        effect: '+50% shield capacity for 10 seconds',
        cooldown: 60,
        energyCost: 100
      }
    ],
    specialEffects: ['Regenerates when not taking damage', 'Absorbs energy weapons better'],
    requirements: {
      level: 1,
      technology: 'shielding_technology',
      techLevel: 1
    },
    cost: {
      metal: 800,
      crystal: 1200,
      deuterium: 200
    },
    powerRating: 200
  },
  {
    id: 'shield_2',
    name: 'Advanced Shield Generator',
    type: 'shield',
    class: 'medium',
    rank: 'D',
    tier: 2,
    level: 1,
    maxLevel: 30,
    rarity: 'Uncommon',
    description: 'An improved shield system with faster regeneration and higher capacity. Provides better protection against energy weapons.',
    lore: 'Advanced shield generators use multiple emitters to create overlapping fields, providing superior protection and faster recovery.',
    stats: {
      protection: 1200,
      capacity: 12000,
      regeneration: 120,
      coverage: 85,
      resistance: {
        kinetic: 25,
        energy: 50,
        explosive: 20,
        quantum: 10
      },
      energyCost: 25
    },
    bonusStats: {
      capacityBonus: 1000,
      regenerationBonus: 10,
      resistanceBonus: 5
    },
    abilities: [
      {
        name: 'Rapid Recharge',
        description: 'Dramatically increase regeneration rate',
        effect: '+200% regeneration for 15 seconds',
        cooldown: 90,
        energyCost: 200
      },
      {
        name: 'Shield Hardening',
        description: 'Temporarily harden shields',
        effect: '+40% resistance to all damage for 12 seconds',
        cooldown: 120,
        energyCost: 300
      }
    ],
    specialEffects: ['Fast regeneration', 'High energy resistance', 'Reduced energy cost'],
    requirements: {
      level: 10,
      technology: 'shielding_technology',
      techLevel: 5
    },
    cost: {
      metal: 4000,
      crystal: 6000,
      deuterium: 1000
    },
    powerRating: 600
  },
  {
    id: 'shield_3',
    name: 'Quantum Shield Matrix',
    type: 'shield',
    class: 'heavy',
    rank: 'B',
    tier: 4,
    level: 1,
    maxLevel: 45,
    rarity: 'Epic',
    description: 'A quantum-enhanced shield system that adapts to incoming damage types. Nearly impenetrable when fully charged.',
    lore: 'Quantum shield matrices use entangled particles to distribute damage across multiple dimensions, making them extraordinarily resilient.',
    stats: {
      protection: 3500,
      capacity: 35000,
      regeneration: 350,
      coverage: 95,
      resistance: {
        kinetic: 45,
        energy: 70,
        explosive: 40,
        quantum: 30
      },
      energyCost: 75
    },
    bonusStats: {
      capacityBonus: 3000,
      regenerationBonus: 30,
      resistanceBonus: 15
    },
    abilities: [
      {
        name: 'Adaptive Shielding',
        description: 'Shields adapt to damage type',
        effect: '+60% resistance to last damage type received',
        cooldown: 60,
        energyCost: 400
      },
      {
        name: 'Quantum Barrier',
        description: 'Create an impenetrable quantum barrier',
        effect: 'Immune to all damage for 5 seconds',
        cooldown: 180,
        energyCost: 1000
      }
    ],
    specialEffects: ['Adapts to damage types', 'Quantum resistance', 'Near-instant regeneration', 'Full coverage'],
    requirements: {
      level: 50,
      technology: 'shielding_technology',
      techLevel: 12
    },
    cost: {
      metal: 60000,
      crystal: 80000,
      deuterium: 20000,
      darkMatter: 200
    },
    powerRating: 5000
  },
  {
    id: 'shield_4',
    name: 'Eternal Aegis Field',
    type: 'shield',
    class: 'ultimate',
    rank: 'SSS',
    tier: 8,
    level: 1,
    maxLevel: 100,
    rarity: 'Universal',
    description: 'The ultimate shield system. Creates a reality-bending barrier that exists across multiple dimensions. Nearly indestructible.',
    lore: 'The Eternal Aegis represents the pinnacle of defensive technology. It doesn\'t just block damage - it erases attacks from existence before they can connect.',
    stats: {
      protection: 15000,
      capacity: 150000,
      regeneration: 1500,
      coverage: 100,
      resistance: {
        kinetic: 90,
        energy: 95,
        explosive: 85,
        quantum: 80
      },
      energyCost: 300
    },
    bonusStats: {
      capacityBonus: 15000,
      regenerationBonus: 150,
      resistanceBonus: 50
    },
    abilities: [
      {
        name: 'Reality Shield',
        description: 'Bend reality to prevent damage',
        effect: 'Negate all incoming damage for 10 seconds',
        cooldown: 240,
        energyCost: 5000
      },
      {
        name: 'Dimensional Barrier',
        description: 'Phase shields into another dimension',
        effect: 'Become untargetable, shields regenerate at 500% rate',
        cooldown: 300,
        energyCost: 8000
      },
      {
        name: 'Eternal Protection',
        description: 'Activate ultimate defense',
        effect: 'Shields cannot drop below 1%, +200% regeneration',
        cooldown: 600,
        energyCost: 15000
      }
    ],
    specialEffects: [
      'Regenerates instantly',
      'Immune to shield penetration',
      'Reflects 50% of damage',
      'Cannot be disabled',
      'Protects entire fleet',
      'Reality-warping defense',
      'Transcendent protection'
    ],
    requirements: {
      level: 150,
      technology: 'shielding_technology',
      techLevel: 25
    },
    cost: {
      metal: 1500000,
      crystal: 2000000,
      deuterium: 500000,
      darkMatter: 15000
    },
    powerRating: 45000
  },

  // ARMOR SYSTEMS
  {
    id: 'armor_1',
    name: 'Titanium Plating',
    type: 'armor',
    class: 'light',
    rank: 'E',
    tier: 1,
    level: 1,
    maxLevel: 20,
    rarity: 'Common',
    description: 'Basic armor plating made from titanium alloy. Provides modest protection against kinetic weapons.',
    lore: 'Titanium has been the standard hull material for centuries due to its excellent strength-to-weight ratio.',
    stats: {
      protection: 800,
      capacity: 8000,
      regeneration: 0,
      coverage: 100,
      resistance: {
        kinetic: 40,
        energy: 15,
        explosive: 25,
        quantum: 5
      },
      energyCost: 0
    },
    bonusStats: {
      protectionBonus: 80,
      capacityBonus: 800
    },
    abilities: [
      {
        name: 'Reinforced Hull',
        description: 'Temporarily strengthen armor',
        effect: '+30% armor for 15 seconds',
        cooldown: 90,
        energyCost: 50
      }
    ],
    specialEffects: ['High kinetic resistance', 'No energy cost', 'Permanent protection'],
    requirements: {
      level: 1,
      technology: 'armor_technology',
      techLevel: 1
    },
    cost: {
      metal: 1500,
      crystal: 500,
      deuterium: 100
    },
    powerRating: 250
  },
  {
    id: 'armor_2',
    name: 'Durasteel Composite',
    type: 'armor',
    class: 'medium',
    rank: 'C',
    tier: 3,
    level: 1,
    maxLevel: 35,
    rarity: 'Rare',
    description: 'Advanced composite armor that provides excellent protection against multiple damage types. Self-sealing against breaches.',
    lore: 'Durasteel composites combine multiple materials in a layered structure, each layer optimized for different threats.',
    stats: {
      protection: 2500,
      capacity: 25000,
      regeneration: 25,
      coverage: 100,
      resistance: {
        kinetic: 55,
        energy: 35,
        explosive: 45,
        quantum: 15
      },
      energyCost: 5
    },
    bonusStats: {
      protectionBonus: 250,
      capacityBonus: 2500,
      resistanceBonus: 10
    },
    abilities: [
      {
        name: 'Reactive Armor',
        description: 'Armor reacts to incoming damage',
        effect: '+50% resistance to next damage type for 20 seconds',
        cooldown: 120,
        energyCost: 150
      },
      {
        name: 'Emergency Repair',
        description: 'Activate self-repair systems',
        effect: 'Restore 30% of armor instantly',
        cooldown: 180,
        energyCost: 300
      }
    ],
    specialEffects: ['Self-repairing', 'Balanced resistances', 'Explosive reactive armor'],
    requirements: {
      level: 35,
      technology: 'armor_technology',
      techLevel: 8
    },
    cost: {
      metal: 35000,
      crystal: 15000,
      deuterium: 5000
    },
    powerRating: 2800
  },
  {
    id: 'armor_3',
    name: 'Neutronium Battleplate',
    type: 'armor',
    class: 'capital',
    rank: 'A',
    tier: 5,
    level: 1,
    maxLevel: 50,
    rarity: 'Legendary',
    description: 'Armor forged from neutronium, one of the densest materials in the universe. Nearly impervious to conventional weapons.',
    lore: 'Neutronium armor is harvested from neutron stars at tremendous cost. A single plate weighs more than a small moon but provides unparalleled protection.',
    stats: {
      protection: 6000,
      capacity: 60000,
      regeneration: 60,
      coverage: 100,
      resistance: {
        kinetic: 75,
        energy: 55,
        explosive: 70,
        quantum: 40
      },
      energyCost: 20
    },
    bonusStats: {
      protectionBonus: 600,
      capacityBonus: 6000,
      resistanceBonus: 25
    },
    abilities: [
      {
        name: 'Impenetrable Defense',
        description: 'Activate maximum armor density',
        effect: '+100% armor, immune to penetration for 15 seconds',
        cooldown: 150,
        energyCost: 800
      },
      {
        name: 'Ablative Plating',
        description: 'Sacrifice outer layers for protection',
        effect: 'Negate next 5 attacks completely',
        cooldown: 240,
        energyCost: 1500
      }
    ],
    specialEffects: ['Extreme kinetic resistance', 'Cannot be penetrated', 'Regenerates slowly', 'Reflects kinetic damage'],
    requirements: {
      level: 70,
      technology: 'armor_technology',
      techLevel: 15
    },
    cost: {
      metal: 200000,
      crystal: 80000,
      deuterium: 30000,
      darkMatter: 800
    },
    powerRating: 12000
  },

  // POINT DEFENSE SYSTEMS
  {
    id: 'point_defense_1',
    name: 'Automated Defense Turrets',
    type: 'point_defense',
    class: 'light',
    rank: 'D',
    tier: 2,
    level: 1,
    maxLevel: 30,
    rarity: 'Uncommon',
    description: 'Rapid-fire turrets that automatically engage incoming missiles and fighters. Essential for fleet defense.',
    lore: 'Point defense systems use advanced targeting computers to track and destroy threats before they reach the ship.',
    stats: {
      protection: 0,
      capacity: 0,
      regeneration: 0,
      coverage: 360,
      resistance: {
        kinetic: 0,
        energy: 0,
        explosive: 80,
        quantum: 0
      },
      energyCost: 15
    },
    bonusStats: {
      resistanceBonus: 20
    },
    abilities: [
      {
        name: 'Flak Barrage',
        description: 'Create a wall of flak',
        effect: 'Destroy all incoming missiles for 10 seconds',
        cooldown: 60,
        energyCost: 200
      }
    ],
    specialEffects: ['Intercepts missiles', 'Shoots down fighters', '360-degree coverage', 'Automatic targeting'],
    requirements: {
      level: 15,
      technology: 'point_defense_technology',
      techLevel: 4
    },
    cost: {
      metal: 8000,
      crystal: 12000,
      deuterium: 2000
    },
    powerRating: 800
  },
  {
    id: 'point_defense_2',
    name: 'Laser Defense Grid',
    type: 'point_defense',
    class: 'heavy',
    rank: 'B',
    tier: 4,
    level: 1,
    maxLevel: 40,
    rarity: 'Epic',
    description: 'A network of high-powered lasers that create an impenetrable defensive grid. Destroys incoming threats instantly.',
    lore: 'Laser defense grids represent the pinnacle of point defense technology, capable of engaging hundreds of targets simultaneously.',
    stats: {
      protection: 0,
      capacity: 0,
      regeneration: 0,
      coverage: 360,
      resistance: {
        kinetic: 0,
        energy: 0,
        explosive: 95,
        quantum: 20
      },
      energyCost: 50
    },
    bonusStats: {
      resistanceBonus: 40
    },
    abilities: [
      {
        name: 'Defense Matrix',
        description: 'Activate full defensive grid',
        effect: 'Intercept 100% of projectiles for 15 seconds',
        cooldown: 120,
        energyCost: 600
      },
      {
        name: 'Counter Battery',
        description: 'Target enemy weapon systems',
        effect: 'Disable enemy weapons for 8 seconds',
        cooldown: 180,
        energyCost: 1000
      }
    ],
    specialEffects: ['Perfect interception', 'Unlimited targets', 'Instant response', 'Can damage enemy fighters'],
    requirements: {
      level: 55,
      technology: 'point_defense_technology',
      techLevel: 11
    },
    cost: {
      metal: 80000,
      crystal: 120000,
      deuterium: 25000,
      darkMatter: 300
    },
    powerRating: 6000
  },

  // BARRIER SYSTEMS
  {
    id: 'barrier_1',
    name: 'Kinetic Barrier',
    type: 'barrier',
    class: 'medium',
    rank: 'C',
    tier: 3,
    level: 1,
    maxLevel: 35,
    rarity: 'Rare',
    description: 'Creates a mass effect field that deflects kinetic projectiles. Highly effective against railguns and missiles.',
    lore: 'Kinetic barriers use mass effect technology to create fields that deflect solid projectiles, making them essential against kinetic weapons.',
    stats: {
      protection: 2000,
      capacity: 20000,
      regeneration: 200,
      coverage: 90,
      resistance: {
        kinetic: 80,
        energy: 10,
        explosive: 50,
        quantum: 15
      },
      energyCost: 40
    },
    bonusStats: {
      capacityBonus: 2000,
      regenerationBonus: 20,
      resistanceBonus: 15
    },
    abilities: [
      {
        name: 'Deflection Field',
        description: 'Maximize deflection power',
        effect: 'Reflect 50% of kinetic damage back to attacker',
        cooldown: 90,
        energyCost: 400
      }
    ],
    specialEffects: ['Deflects kinetic weapons', 'Reflects projectiles', 'Fast regeneration'],
    requirements: {
      level: 40,
      technology: 'barrier_technology',
      techLevel: 7
    },
    cost: {
      metal: 40000,
      crystal: 50000,
      deuterium: 12000
    },
    powerRating: 3500
  },

  // REGENERATION SYSTEMS
  {
    id: 'regen_1',
    name: 'Nanite Repair System',
    type: 'regeneration',
    class: 'medium',
    rank: 'B',
    tier: 4,
    level: 1,
    maxLevel: 40,
    rarity: 'Epic',
    description: 'Deploys swarms of nanites that continuously repair damage to hull and systems. Provides passive regeneration.',
    lore: 'Nanite technology allows ships to heal themselves in the midst of battle, repairing damage faster than it can accumulate.',
    stats: {
      protection: 0,
      capacity: 0,
      regeneration: 500,
      coverage: 100,
      resistance: {
        kinetic: 0,
        energy: 0,
        explosive: 0,
        quantum: 0
      },
      energyCost: 60
    },
    bonusStats: {
      regenerationBonus: 50
    },
    abilities: [
      {
        name: 'Emergency Repair',
        description: 'Deploy all nanites at once',
        effect: 'Restore 50% of all damage instantly',
        cooldown: 180,
        energyCost: 1000
      },
      {
        name: 'Adaptive Repair',
        description: 'Nanites prioritize critical systems',
        effect: '+300% regeneration for 20 seconds',
        cooldown: 120,
        energyCost: 600
      }
    ],
    specialEffects: ['Continuous healing', 'Repairs all systems', 'Increases over time', 'Cannot be disabled'],
    requirements: {
      level: 60,
      technology: 'nanite_technology',
      techLevel: 10
    },
    cost: {
      metal: 100000,
      crystal: 120000,
      deuterium: 40000,
      darkMatter: 500
    },
    powerRating: 7000
  },

  // STEALTH SYSTEMS
  {
    id: 'stealth_1',
    name: 'Cloaking Device',
    type: 'stealth',
    class: 'heavy',
    rank: 'A',
    tier: 5,
    level: 1,
    maxLevel: 45,
    rarity: 'Legendary',
    description: 'Bends light and sensor waves around the ship, making it invisible to enemy detection. Perfect for ambushes.',
    lore: 'Cloaking technology has turned the tide of countless battles, allowing fleets to strike from nowhere and vanish before retaliation.',
    stats: {
      protection: 0,
      capacity: 0,
      regeneration: 0,
      coverage: 100,
      resistance: {
        kinetic: 0,
        energy: 0,
        explosive: 0,
        quantum: 0
      },
      energyCost: 100
    },
    bonusStats: {},
    abilities: [
      {
        name: 'Full Cloak',
        description: 'Become completely invisible',
        effect: 'Cannot be targeted for 30 seconds',
        cooldown: 180,
        energyCost: 1500
      },
      {
        name: 'Ambush',
        description: 'Strike from stealth',
        effect: '+200% damage on first attack from cloak',
        cooldown: 240,
        energyCost: 2000
      }
    ],
    specialEffects: ['Invisible to sensors', 'Cannot be targeted', 'First strike bonus', 'Evade all attacks'],
    requirements: {
      level: 75,
      technology: 'cloaking_technology',
      techLevel: 13
    },
    cost: {
      metal: 150000,
      crystal: 200000,
      deuterium: 60000,
      darkMatter: 1000
    },
    powerRating: 10000
  },

  // COUNTERMEASURE SYSTEMS
  {
    id: 'countermeasure_1',
    name: 'ECM Suite',
    type: 'countermeasure',
    class: 'medium',
    rank: 'C',
    tier: 3,
    level: 1,
    maxLevel: 35,
    rarity: 'Rare',
    description: 'Electronic countermeasures that jam enemy targeting systems and disrupt their sensors.',
    lore: 'ECM suites wage invisible warfare in the electromagnetic spectrum, blinding enemy sensors and confusing their weapons.',
    stats: {
      protection: 0,
      capacity: 0,
      regeneration: 0,
      coverage: 100,
      resistance: {
        kinetic: 0,
        energy: 0,
        explosive: 0,
        quantum: 0
      },
      energyCost: 30
    },
    bonusStats: {},
    abilities: [
      {
        name: 'Sensor Jamming',
        description: 'Jam all enemy sensors',
        effect: 'Reduce enemy accuracy by 50% for 15 seconds',
        cooldown: 90,
        energyCost: 300
      },
      {
        name: 'Decoy Launch',
        description: 'Launch holographic decoys',
        effect: 'Enemy attacks target decoys instead',
        cooldown: 120,
        energyCost: 500
      }
    ],
    specialEffects: ['Reduces enemy accuracy', 'Breaks target locks', 'Deploys decoys', 'Jams missiles'],
    requirements: {
      level: 45,
      technology: 'countermeasure_technology',
      techLevel: 8
    },
    cost: {
      metal: 50000,
      crystal: 60000,
      deuterium: 15000
    },
    powerRating: 4000
  }
];

// Helper functions
export const getDefensesByType = (type: DefenseType) => defenses.filter(d => d.type === type);
export const getDefensesByClass = (defenseClass: DefenseClass) => defenses.filter(d => d.class === defenseClass);
export const getDefensesByRank = (rank: string) => defenses.filter(d => d.rank === rank);
export const getDefensesByTier = (tier: number) => defenses.filter(d => d.tier === tier);

export const calculateDefenseEffectiveness = (defense: Defense, damageType: keyof DefenseStats['resistance']): number => {
  const baseProtection = defense.stats.protection;
  const resistance = defense.stats.resistance[damageType];
  return baseProtection * (1 + resistance / 100);
};

export const getDefensePowerRating = (defense: Defense, level: number): number => {
  const basePower = defense.powerRating;
  const levelMultiplier = 1 + (level - 1) * 0.12;
  return Math.floor(basePower * levelMultiplier);
};