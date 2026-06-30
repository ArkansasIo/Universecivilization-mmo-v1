// Weapon Systems Database
export type WeaponType = 'laser' | 'ion' | 'plasma' | 'missile' | 'railgun' | 'graviton' | 'quantum' | 'antimatter';
export type WeaponClass = 'light' | 'medium' | 'heavy' | 'capital' | 'titan' | 'ultimate';

export interface WeaponStats {
  damage: number;
  fireRate: number; // shots per minute
  range: number; // in kilometers
  accuracy: number; // percentage
  criticalChance: number;
  criticalDamage: number;
  penetration: number;
  energyCost: number;
  cooldown: number; // seconds
}

export interface WeaponAbility {
  name: string;
  description: string;
  effect: string;
  cooldown: number;
  energyCost: number;
}

export interface Weapon {
  id: string;
  name: string;
  type: WeaponType;
  class: WeaponClass;
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';
  tier: number;
  level: number;
  maxLevel: number;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Cosmic' | 'Universal';
  description: string;
  lore: string;
  stats: WeaponStats;
  bonusStats: {
    damageBonus?: number;
    fireRateBonus?: number;
    rangeBonus?: number;
    accuracyBonus?: number;
    criticalBonus?: number;
    penetrationBonus?: number;
  };
  abilities: WeaponAbility[];
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
  mountPoints: number; // how many weapon slots it takes
  powerRating: number;
}

export const weapons: Weapon[] = [
  // LASER WEAPONS
  {
    id: 'laser_1',
    name: 'Basic Laser Cannon',
    type: 'laser',
    class: 'light',
    rank: 'E',
    tier: 1,
    level: 1,
    maxLevel: 20,
    rarity: 'Common',
    description: 'A standard laser weapon system using focused light energy to damage enemy vessels. Reliable and energy-efficient.',
    lore: 'The foundation of all energy weapons, laser technology has been refined over millennia. These basic cannons are the workhorse of any fleet.',
    stats: {
      damage: 100,
      fireRate: 60,
      range: 5000,
      accuracy: 85,
      criticalChance: 5,
      criticalDamage: 150,
      penetration: 10,
      energyCost: 10,
      cooldown: 1
    },
    bonusStats: {
      damageBonus: 5,
      accuracyBonus: 2
    },
    abilities: [
      {
        name: 'Focused Beam',
        description: 'Concentrate laser energy for increased damage',
        effect: '+25% damage for 5 seconds',
        cooldown: 30,
        energyCost: 50
      }
    ],
    specialEffects: ['Ignores 10% of shields', 'No ammunition required'],
    requirements: {
      level: 1,
      technology: 'laser_technology',
      techLevel: 1
    },
    cost: {
      metal: 1000,
      crystal: 500,
      deuterium: 100
    },
    mountPoints: 1,
    powerRating: 150
  },
  {
    id: 'laser_2',
    name: 'Heavy Laser Battery',
    type: 'laser',
    class: 'medium',
    rank: 'D',
    tier: 2,
    level: 1,
    maxLevel: 30,
    rarity: 'Uncommon',
    description: 'An upgraded laser system with multiple emitters for sustained fire. Excellent against lightly armored targets.',
    lore: 'By combining multiple laser emitters into a single battery, engineers created a weapon capable of overwhelming enemy defenses through sheer volume of fire.',
    stats: {
      damage: 250,
      fireRate: 90,
      range: 7500,
      accuracy: 88,
      criticalChance: 8,
      criticalDamage: 160,
      penetration: 15,
      energyCost: 25,
      cooldown: 0.8
    },
    bonusStats: {
      damageBonus: 10,
      fireRateBonus: 5,
      accuracyBonus: 3
    },
    abilities: [
      {
        name: 'Rapid Fire',
        description: 'Increase fire rate dramatically',
        effect: '+50% fire rate for 8 seconds',
        cooldown: 45,
        energyCost: 100
      },
      {
        name: 'Overcharge',
        description: 'Boost damage output',
        effect: '+40% damage for 6 seconds',
        cooldown: 60,
        energyCost: 150
      }
    ],
    specialEffects: ['Ignores 15% of shields', 'Reduced energy consumption', '+10% damage vs fighters'],
    requirements: {
      level: 10,
      technology: 'laser_technology',
      techLevel: 5
    },
    cost: {
      metal: 5000,
      crystal: 2500,
      deuterium: 500
    },
    mountPoints: 2,
    powerRating: 450
  },
  {
    id: 'laser_3',
    name: 'Pulse Laser Destroyer',
    type: 'laser',
    class: 'heavy',
    rank: 'C',
    tier: 3,
    level: 1,
    maxLevel: 40,
    rarity: 'Rare',
    description: 'Advanced pulsed laser technology delivers devastating bursts of energy. Capable of melting through heavy armor.',
    lore: 'The pulse laser represents a breakthrough in energy weapon design. By releasing energy in controlled bursts, it achieves damage levels previously thought impossible.',
    stats: {
      damage: 600,
      fireRate: 75,
      range: 10000,
      accuracy: 90,
      criticalChance: 12,
      criticalDamage: 175,
      penetration: 25,
      energyCost: 50,
      cooldown: 1.2
    },
    bonusStats: {
      damageBonus: 20,
      criticalBonus: 5,
      penetrationBonus: 10
    },
    abilities: [
      {
        name: 'Pulse Burst',
        description: 'Release a devastating burst of laser pulses',
        effect: 'Fire 5 shots instantly, +30% damage each',
        cooldown: 60,
        energyCost: 250
      },
      {
        name: 'Shield Breaker',
        description: 'Specialized pulse designed to disrupt shields',
        effect: 'Ignores 50% of shields for 10 seconds',
        cooldown: 90,
        energyCost: 300
      }
    ],
    specialEffects: ['Ignores 25% of shields', 'Bonus damage to shields', '+15% critical chance vs capital ships'],
    requirements: {
      level: 25,
      technology: 'laser_technology',
      techLevel: 10
    },
    cost: {
      metal: 15000,
      crystal: 10000,
      deuterium: 2000
    },
    mountPoints: 3,
    powerRating: 1200
  },

  // ION WEAPONS
  {
    id: 'ion_1',
    name: 'Ion Disruptor',
    type: 'ion',
    class: 'light',
    rank: 'D',
    tier: 2,
    level: 1,
    maxLevel: 25,
    rarity: 'Uncommon',
    description: 'Fires charged ion particles that disrupt electronic systems and shields. Excellent against shielded targets.',
    lore: 'Ion weapons were developed specifically to counter the rise of energy shield technology. They excel at disrupting electronic systems.',
    stats: {
      damage: 180,
      fireRate: 50,
      range: 6000,
      accuracy: 82,
      criticalChance: 10,
      criticalDamage: 165,
      penetration: 30,
      energyCost: 35,
      cooldown: 1.5
    },
    bonusStats: {
      penetrationBonus: 15,
      damageBonus: 8
    },
    abilities: [
      {
        name: 'System Disruption',
        description: 'Disable enemy systems temporarily',
        effect: 'Reduce enemy fire rate by 30% for 8 seconds',
        cooldown: 45,
        energyCost: 120
      }
    ],
    specialEffects: ['Ignores 40% of shields', 'Chance to disable systems', '+25% damage to shields'],
    requirements: {
      level: 15,
      technology: 'ion_technology',
      techLevel: 3
    },
    cost: {
      metal: 8000,
      crystal: 6000,
      deuterium: 1000
    },
    mountPoints: 2,
    powerRating: 550
  },
  {
    id: 'ion_2',
    name: 'Heavy Ion Cannon',
    type: 'ion',
    class: 'medium',
    rank: 'C',
    tier: 3,
    level: 1,
    maxLevel: 35,
    rarity: 'Rare',
    description: 'A powerful ion weapon that can cripple enemy vessels by overloading their systems with charged particles.',
    lore: 'Heavy ion cannons are feared throughout the galaxy for their ability to leave enemy ships dead in space, systems fried and shields collapsed.',
    stats: {
      damage: 450,
      fireRate: 40,
      range: 8500,
      accuracy: 85,
      criticalChance: 15,
      criticalDamage: 180,
      penetration: 45,
      energyCost: 75,
      cooldown: 2
    },
    bonusStats: {
      penetrationBonus: 25,
      criticalBonus: 8,
      damageBonus: 15
    },
    abilities: [
      {
        name: 'EMP Burst',
        description: 'Release an electromagnetic pulse',
        effect: 'Disable all enemy systems for 5 seconds',
        cooldown: 120,
        energyCost: 400
      },
      {
        name: 'Shield Overload',
        description: 'Overload enemy shield generators',
        effect: 'Reduce enemy shields by 40% instantly',
        cooldown: 90,
        energyCost: 300
      }
    ],
    specialEffects: ['Ignores 50% of shields', 'High chance to disable systems', '+35% damage to shields', 'Reduces enemy accuracy'],
    requirements: {
      level: 30,
      technology: 'ion_technology',
      techLevel: 8
    },
    cost: {
      metal: 25000,
      crystal: 20000,
      deuterium: 5000
    },
    mountPoints: 3,
    powerRating: 1500
  },

  // PLASMA WEAPONS
  {
    id: 'plasma_1',
    name: 'Plasma Cannon',
    type: 'plasma',
    class: 'medium',
    rank: 'C',
    tier: 3,
    level: 1,
    maxLevel: 35,
    rarity: 'Rare',
    description: 'Fires superheated plasma bolts that burn through armor and shields alike. Devastating at close range.',
    lore: 'Plasma weapons harness the power of stars, containing superheated matter in magnetic fields before launching it at enemies.',
    stats: {
      damage: 800,
      fireRate: 30,
      range: 7000,
      accuracy: 78,
      criticalChance: 18,
      criticalDamage: 200,
      penetration: 35,
      energyCost: 100,
      cooldown: 2.5
    },
    bonusStats: {
      damageBonus: 30,
      criticalDamage: 20,
      penetrationBonus: 15
    },
    abilities: [
      {
        name: 'Plasma Inferno',
        description: 'Release a wave of superheated plasma',
        effect: '+50% damage, burns for 500 damage over 10 seconds',
        cooldown: 60,
        energyCost: 350
      }
    ],
    specialEffects: ['Ignores 30% of armor', 'Applies burning effect', '+40% damage at close range'],
    requirements: {
      level: 35,
      technology: 'plasma_technology',
      techLevel: 6
    },
    cost: {
      metal: 35000,
      crystal: 30000,
      deuterium: 8000
    },
    mountPoints: 3,
    powerRating: 2000
  },
  {
    id: 'plasma_2',
    name: 'Mega Plasma Destructor',
    type: 'plasma',
    class: 'heavy',
    rank: 'B',
    tier: 4,
    level: 1,
    maxLevel: 45,
    rarity: 'Epic',
    description: 'The ultimate plasma weapon, capable of vaporizing entire sections of enemy capital ships in a single shot.',
    lore: 'Mega plasma destructors are so powerful that special cooling systems and reinforced containment fields are required to prevent them from melting their own mounting points.',
    stats: {
      damage: 1800,
      fireRate: 20,
      range: 9000,
      accuracy: 80,
      criticalChance: 22,
      criticalDamage: 225,
      penetration: 50,
      energyCost: 200,
      cooldown: 3
    },
    bonusStats: {
      damageBonus: 50,
      criticalDamage: 35,
      penetrationBonus: 25
    },
    abilities: [
      {
        name: 'Plasma Storm',
        description: 'Create a storm of plasma projectiles',
        effect: 'Fire 8 plasma bolts, each dealing 60% damage',
        cooldown: 90,
        energyCost: 600
      },
      {
        name: 'Meltdown',
        description: 'Overload the plasma containment',
        effect: '+100% damage, +50% critical chance for one shot',
        cooldown: 120,
        energyCost: 800
      }
    ],
    specialEffects: ['Ignores 40% of armor', 'Severe burning effect', '+60% damage at close range', 'Splash damage to nearby targets'],
    requirements: {
      level: 50,
      technology: 'plasma_technology',
      techLevel: 12
    },
    cost: {
      metal: 80000,
      crystal: 70000,
      deuterium: 20000,
      darkMatter: 100
    },
    mountPoints: 5,
    powerRating: 4500
  },

  // MISSILE WEAPONS
  {
    id: 'missile_1',
    name: 'Interceptor Missiles',
    type: 'missile',
    class: 'light',
    rank: 'D',
    tier: 2,
    level: 1,
    maxLevel: 30,
    rarity: 'Uncommon',
    description: 'Fast-tracking missiles designed to intercept fighters and small craft. High accuracy and fire rate.',
    lore: 'Interceptor missiles use advanced tracking algorithms to pursue even the most agile targets across the battlefield.',
    stats: {
      damage: 300,
      fireRate: 45,
      range: 12000,
      accuracy: 95,
      criticalChance: 12,
      criticalDamage: 170,
      penetration: 20,
      energyCost: 40,
      cooldown: 1.8
    },
    bonusStats: {
      accuracyBonus: 10,
      rangeBonus: 2000,
      damageBonus: 12
    },
    abilities: [
      {
        name: 'Swarm Launch',
        description: 'Launch multiple missiles simultaneously',
        effect: 'Fire 6 missiles at once',
        cooldown: 60,
        energyCost: 240
      }
    ],
    specialEffects: ['Perfect tracking', '+50% damage vs fighters', 'Cannot be evaded'],
    requirements: {
      level: 20,
      technology: 'missile_technology',
      techLevel: 4
    },
    cost: {
      metal: 12000,
      crystal: 8000,
      deuterium: 3000
    },
    mountPoints: 2,
    powerRating: 800
  },
  {
    id: 'missile_2',
    name: 'Heavy Torpedo Launcher',
    type: 'missile',
    class: 'heavy',
    rank: 'B',
    tier: 4,
    level: 1,
    maxLevel: 40,
    rarity: 'Epic',
    description: 'Launches massive torpedoes capable of crippling capital ships. Slow but devastating impact.',
    lore: 'Heavy torpedoes are essentially small spacecraft packed with explosives and propulsion systems. A single hit can decide the outcome of a battle.',
    stats: {
      damage: 2500,
      fireRate: 15,
      range: 15000,
      accuracy: 88,
      criticalChance: 25,
      criticalDamage: 250,
      penetration: 60,
      energyCost: 150,
      cooldown: 4
    },
    bonusStats: {
      damageBonus: 80,
      criticalDamage: 40,
      penetrationBonus: 30
    },
    abilities: [
      {
        name: 'Armor Piercing',
        description: 'Launch specialized armor-piercing torpedoes',
        effect: 'Ignores 80% of armor for 3 shots',
        cooldown: 90,
        energyCost: 450
      },
      {
        name: 'Nuclear Warhead',
        description: 'Equip torpedoes with nuclear warheads',
        effect: '+150% damage, massive splash damage',
        cooldown: 180,
        energyCost: 1000
      }
    ],
    specialEffects: ['Massive damage', 'Ignores 50% of armor', 'Splash damage', '+100% damage vs capital ships'],
    requirements: {
      level: 45,
      technology: 'missile_technology',
      techLevel: 10
    },
    cost: {
      metal: 60000,
      crystal: 50000,
      deuterium: 15000,
      darkMatter: 50
    },
    mountPoints: 4,
    powerRating: 5000
  },

  // RAILGUN WEAPONS
  {
    id: 'railgun_1',
    name: 'Magnetic Accelerator',
    type: 'railgun',
    class: 'medium',
    rank: 'C',
    tier: 3,
    level: 1,
    maxLevel: 35,
    rarity: 'Rare',
    description: 'Uses electromagnetic rails to accelerate projectiles to hypersonic speeds. Excellent armor penetration.',
    lore: 'Railgun technology represents the pinnacle of kinetic weaponry, using magnetic fields to achieve velocities that make conventional guns look like toys.',
    stats: {
      damage: 700,
      fireRate: 40,
      range: 11000,
      accuracy: 92,
      criticalChance: 20,
      criticalDamage: 190,
      penetration: 70,
      energyCost: 80,
      cooldown: 2
    },
    bonusStats: {
      penetrationBonus: 35,
      accuracyBonus: 8,
      damageBonus: 25
    },
    abilities: [
      {
        name: 'Hypervelocity Round',
        description: 'Fire a round at extreme velocity',
        effect: '+80% damage, ignores 90% of armor',
        cooldown: 75,
        energyCost: 320
      }
    ],
    specialEffects: ['Ignores 60% of armor', 'Perfect accuracy at long range', 'No damage falloff'],
    requirements: {
      level: 40,
      technology: 'railgun_technology',
      techLevel: 7
    },
    cost: {
      metal: 45000,
      crystal: 35000,
      deuterium: 10000
    },
    mountPoints: 3,
    powerRating: 2500
  },
  {
    id: 'railgun_2',
    name: 'Titan Railgun',
    type: 'railgun',
    class: 'capital',
    rank: 'A',
    tier: 5,
    level: 1,
    maxLevel: 50,
    rarity: 'Legendary',
    description: 'A massive railgun that fires projectiles the size of small vehicles. Can punch through multiple ships.',
    lore: 'Titan railguns are so powerful that their recoil can destabilize smaller ships. Only the largest capital vessels can mount these devastating weapons.',
    stats: {
      damage: 3500,
      fireRate: 12,
      range: 20000,
      accuracy: 95,
      criticalChance: 30,
      criticalDamage: 280,
      penetration: 90,
      energyCost: 250,
      cooldown: 5
    },
    bonusStats: {
      damageBonus: 120,
      penetrationBonus: 50,
      criticalDamage: 60
    },
    abilities: [
      {
        name: 'Piercing Shot',
        description: 'Fire a round that pierces through multiple targets',
        effect: 'Hits up to 5 targets in a line, full damage to each',
        cooldown: 120,
        energyCost: 750
      },
      {
        name: 'Devastator Round',
        description: 'Load a specialized high-explosive round',
        effect: '+200% damage, massive splash damage',
        cooldown: 180,
        energyCost: 1200
      }
    ],
    specialEffects: ['Ignores 80% of armor', 'Pierces through targets', 'Extreme range', '+150% damage vs capital ships'],
    requirements: {
      level: 60,
      technology: 'railgun_technology',
      techLevel: 15
    },
    cost: {
      metal: 150000,
      crystal: 120000,
      deuterium: 40000,
      darkMatter: 200
    },
    mountPoints: 6,
    powerRating: 8500
  },

  // GRAVITON WEAPONS
  {
    id: 'graviton_1',
    name: 'Graviton Beam',
    type: 'graviton',
    class: 'heavy',
    rank: 'A',
    tier: 5,
    level: 1,
    maxLevel: 50,
    rarity: 'Legendary',
    description: 'Manipulates gravity itself to crush enemy vessels. Ignores conventional defenses.',
    lore: 'Graviton weapons represent a breakthrough in physics, allowing commanders to weaponize one of the fundamental forces of the universe.',
    stats: {
      damage: 2800,
      fireRate: 25,
      range: 13000,
      accuracy: 90,
      criticalChance: 28,
      criticalDamage: 240,
      penetration: 85,
      energyCost: 300,
      cooldown: 3.5
    },
    bonusStats: {
      damageBonus: 100,
      penetrationBonus: 45,
      criticalBonus: 12
    },
    abilities: [
      {
        name: 'Gravity Well',
        description: 'Create a localized gravity well',
        effect: 'Pulls enemies together, +40% damage to grouped targets',
        cooldown: 90,
        energyCost: 600
      },
      {
        name: 'Singularity',
        description: 'Create a micro black hole',
        effect: 'Massive damage over time, disables shields',
        cooldown: 180,
        energyCost: 1500
      }
    ],
    specialEffects: ['Ignores shields and armor', 'Slows enemy movement', 'Cannot be blocked', 'Affects multiple targets'],
    requirements: {
      level: 70,
      technology: 'graviton_technology',
      techLevel: 12
    },
    cost: {
      metal: 200000,
      crystal: 180000,
      deuterium: 60000,
      darkMatter: 500
    },
    mountPoints: 5,
    powerRating: 10000
  },

  // QUANTUM WEAPONS
  {
    id: 'quantum_1',
    name: 'Quantum Disruptor',
    type: 'quantum',
    class: 'capital',
    rank: 'S',
    tier: 6,
    level: 1,
    maxLevel: 60,
    rarity: 'Mythic',
    description: 'Disrupts matter at the quantum level, causing catastrophic molecular breakdown. Bypasses all conventional defenses.',
    lore: 'Quantum weapons operate on principles that defy classical physics, attacking targets at the subatomic level where shields and armor are meaningless.',
    stats: {
      damage: 5000,
      fireRate: 20,
      range: 16000,
      accuracy: 93,
      criticalChance: 35,
      criticalDamage: 300,
      penetration: 95,
      energyCost: 500,
      cooldown: 4
    },
    bonusStats: {
      damageBonus: 180,
      criticalDamage: 80,
      penetrationBonus: 60
    },
    abilities: [
      {
        name: 'Quantum Cascade',
        description: 'Trigger a quantum cascade reaction',
        effect: 'Damage spreads to nearby targets, +60% damage',
        cooldown: 120,
        energyCost: 1000
      },
      {
        name: 'Molecular Disintegration',
        description: 'Completely disintegrate target molecules',
        effect: '+250% damage, ignores all defenses',
        cooldown: 240,
        energyCost: 2500
      }
    ],
    specialEffects: ['Ignores 90% of all defenses', 'Quantum damage spreads', 'Bypasses shields', 'Molecular breakdown effect'],
    requirements: {
      level: 85,
      technology: 'quantum_technology',
      techLevel: 15
    },
    cost: {
      metal: 400000,
      crystal: 350000,
      deuterium: 120000,
      darkMatter: 1500
    },
    mountPoints: 7,
    powerRating: 15000
  },

  // ANTIMATTER WEAPONS
  {
    id: 'antimatter_1',
    name: 'Antimatter Annihilator',
    type: 'antimatter',
    class: 'titan',
    rank: 'SS',
    tier: 7,
    level: 1,
    maxLevel: 75,
    rarity: 'Cosmic',
    description: 'Fires concentrated antimatter that annihilates anything it touches. The most destructive weapon known to exist.',
    lore: 'Antimatter weapons harness the most powerful reaction in the universe - matter-antimatter annihilation. A single gram releases energy equivalent to a nuclear bomb.',
    stats: {
      damage: 8500,
      fireRate: 15,
      range: 18000,
      accuracy: 95,
      criticalChance: 40,
      criticalDamage: 350,
      penetration: 98,
      energyCost: 800,
      cooldown: 5
    },
    bonusStats: {
      damageBonus: 300,
      criticalDamage: 120,
      penetrationBonus: 80
    },
    abilities: [
      {
        name: 'Annihilation Wave',
        description: 'Release a wave of antimatter',
        effect: 'Massive area damage, +100% damage',
        cooldown: 150,
        energyCost: 2000
      },
      {
        name: 'Total Destruction',
        description: 'Unleash maximum antimatter payload',
        effect: '+400% damage, destroys everything in area',
        cooldown: 300,
        energyCost: 5000
      }
    ],
    specialEffects: ['Ignores 95% of all defenses', 'Massive splash damage', 'Instant kill on critical hit', 'Reality-warping damage'],
    requirements: {
      level: 100,
      technology: 'antimatter_technology',
      techLevel: 18
    },
    cost: {
      metal: 800000,
      crystal: 700000,
      deuterium: 250000,
      darkMatter: 5000
    },
    mountPoints: 10,
    powerRating: 25000
  },
  {
    id: 'antimatter_2',
    name: 'Omega Antimatter Cannon',
    type: 'antimatter',
    class: 'ultimate',
    rank: 'SSS',
    tier: 8,
    level: 1,
    maxLevel: 100,
    rarity: 'Universal',
    description: 'The ultimate weapon. Capable of destroying entire fleets with a single shot. Reality itself trembles before its power.',
    lore: 'The Omega Cannon represents the pinnacle of destructive technology. Civilizations have risen and fallen in pursuit of this weapon. Those who possess it hold the power to reshape the galaxy.',
    stats: {
      damage: 15000,
      fireRate: 10,
      range: 25000,
      accuracy: 98,
      criticalChance: 50,
      criticalDamage: 500,
      penetration: 100,
      energyCost: 1500,
      cooldown: 8
    },
    bonusStats: {
      damageBonus: 600,
      criticalDamage: 250,
      penetrationBonus: 100
    },
    abilities: [
      {
        name: 'Galaxy Breaker',
        description: 'Unleash the full power of the Omega Cannon',
        effect: '+500% damage, destroys all targets in range',
        cooldown: 300,
        energyCost: 10000
      },
      {
        name: 'Apocalypse',
        description: 'End everything',
        effect: 'Instant kill all enemies, +1000% damage',
        cooldown: 600,
        energyCost: 25000
      },
      {
        name: 'Reality Tear',
        description: 'Tear through the fabric of reality',
        effect: 'Ignores all defenses, bypasses all resistances',
        cooldown: 180,
        energyCost: 5000
      }
    ],
    specialEffects: [
      'Ignores 100% of all defenses',
      'Guaranteed critical hits',
      'Destroys multiple targets',
      'Reality-warping damage',
      'Instant kill on hit',
      'Unlimited range',
      'Cannot be blocked or evaded',
      'Transcendent power'
    ],
    requirements: {
      level: 150,
      technology: 'antimatter_technology',
      techLevel: 25
    },
    cost: {
      metal: 2000000,
      crystal: 1800000,
      deuterium: 600000,
      darkMatter: 20000
    },
    mountPoints: 15,
    powerRating: 50000
  }
];

// Helper functions
export const getWeaponsByType = (type: WeaponType) => weapons.filter(w => w.type === type);
export const getWeaponsByClass = (weaponClass: WeaponClass) => weapons.filter(w => w.class === weaponClass);
export const getWeaponsByRank = (rank: string) => weapons.filter(w => w.rank === rank);
export const getWeaponsByTier = (tier: number) => weapons.filter(w => w.tier === tier);

export const calculateWeaponDPS = (weapon: Weapon): number => {
  const shotsPerSecond = weapon.stats.fireRate / 60;
  const avgDamage = weapon.stats.damage * (1 + (weapon.stats.criticalChance / 100) * (weapon.stats.criticalDamage / 100 - 1));
  return avgDamage * shotsPerSecond;
};

export const getWeaponPowerRating = (weapon: Weapon, level: number): number => {
  const basePower = weapon.powerRating;
  const levelMultiplier = 1 + (level - 1) * 0.1;
  return Math.floor(basePower * levelMultiplier);
};
