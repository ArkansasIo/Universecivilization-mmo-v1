import { Mothership, Rank, Rarity } from '../types/gameTypes';

export const MOTHERSHIP_DATA: Mothership[] = [
  {
    id: 'mothership_1',
    name: 'Vanguard Carrier',
    class: 'Carrier',
    level: 1,
    maxLevel: 50,
    rank: 'A',
    rarity: 'Legendary',
    stats: {
      attack: 15000,
      defense: 20000,
      speed: 5000,
      health: 500000,
      maxHealth: 500000,
      energy: 100000,
      maxEnergy: 100000,
      cargo: 100000,
      shield: 80000,
      maxShield: 80000,
      criticalChance: 15,
      criticalDamage: 200,
      evasion: 5,
      accuracy: 85,
      armor: 5000,
      shieldStrength: 100,
      shieldRegeneration: 500,
      healthRegeneration: 200,
      energyRegeneration: 1000
    },
    hangarCapacity: 200,
    commandBonus: 25,
    fleetCapacityBonus: 50,
    abilities: [
      {
        name: 'Launch Fighter Wing',
        description: 'Deploy a squadron of 50 fighters to engage enemy forces',
        cooldown: 60,
        effect: 'Summons 50 fighters for 120 seconds'
      },
      {
        name: 'Fleet Coordination',
        description: 'Increase all allied ships attack and defense by 20% for 60 seconds',
        cooldown: 120,
        effect: '+20% Attack/Defense to all allies'
      },
      {
        name: 'Emergency Repairs',
        description: 'Repair 25% of maximum health to all ships in the fleet',
        cooldown: 180,
        effect: 'Heal 25% HP to all allies'
      }
    ],
    modules: {
      weapons: 8,
      shields: 6,
      engines: 4,
      special: 4
    },
    crew: 5000,
    description: 'A massive carrier-class mothership designed to deploy and support large fighter squadrons while coordinating fleet operations.',
    lore: 'The Vanguard Carrier represents a new era in space warfare. Its vast hangars can house entire fighter wings, while its advanced command systems allow admirals to coordinate complex fleet maneuvers with unprecedented precision.',
    specialFeatures: [
      'Massive Hangar Bays',
      'Advanced Fleet Coordination',
      'Rapid Fighter Deployment',
      'Repair and Resupply Facilities',
      'Long-Range Communications',
      'Tactical Command Center'
    ],
    buildCost: {
      metal: 5000000,
      crystal: 3000000,
      deuterium: 2000000,
      darkMatter: 500
    },
    buildTime: 604800,
    maintenanceCost: {
      metal: 10000,
      crystal: 8000,
      deuterium: 5000,
      darkMatter: 10
    }
  },
  {
    id: 'mothership_2',
    name: 'Sovereign Command Ship',
    class: 'Command',
    level: 1,
    maxLevel: 60,
    rank: 'S',
    rarity: 'Mythic',
    stats: {
      attack: 25000,
      defense: 35000,
      speed: 4000,
      health: 1000000,
      maxHealth: 1000000,
      energy: 200000,
      maxEnergy: 200000,
      cargo: 150000,
      shield: 150000,
      maxShield: 150000,
      criticalChance: 20,
      criticalDamage: 250,
      evasion: 8,
      accuracy: 90,
      armor: 10000,
      shieldStrength: 150,
      shieldRegeneration: 1000,
      healthRegeneration: 500,
      energyRegeneration: 2000
    },
    hangarCapacity: 300,
    commandBonus: 50,
    fleetCapacityBonus: 100,
    abilities: [
      {
        name: 'Supreme Command',
        description: 'Increase all fleet capabilities by 30% and grant immunity to debuffs for 90 seconds',
        cooldown: 180,
        effect: '+30% All Stats, Debuff Immunity'
      },
      {
        name: 'Tactical Warp',
        description: 'Instantly teleport the entire fleet to a target location within 50,000 units',
        cooldown: 300,
        effect: 'Fleet Teleportation'
      },
      {
        name: 'Shield Overcharge',
        description: 'Grant all allied ships a massive shield boost equal to 50% of their maximum shields',
        cooldown: 240,
        effect: '+50% Max Shield to all allies'
      },
      {
        name: 'Devastating Barrage',
        description: 'Fire all weapons simultaneously dealing 500% damage to all enemies in range',
        cooldown: 360,
        effect: '500% AoE Damage'
      }
    ],
    modules: {
      weapons: 12,
      shields: 10,
      engines: 6,
      special: 8
    },
    crew: 10000,
    description: 'The ultimate command vessel, capable of coordinating entire armadas while possessing devastating firepower of its own.',
    lore: 'Sovereign Command Ships are the flagships of grand admirals. From their bridge, entire campaigns are orchestrated, and the fate of star systems is decided. Their presence on the battlefield inspires allies and strikes fear into enemies.',
    specialFeatures: [
      'Supreme Fleet Command',
      'Galactic Communication Array',
      'Advanced Tactical AI',
      'Quantum Computing Core',
      'Reality Stabilization Field',
      'Emergency Warp Drive',
      'Automated Defense Systems',
      'Capital Ship Construction Bay'
    ],
    buildCost: {
      metal: 15000000,
      crystal: 10000000,
      deuterium: 8000000,
      darkMatter: 2000
    },
    buildTime: 1209600,
    maintenanceCost: {
      metal: 30000,
      crystal: 25000,
      deuterium: 15000,
      darkMatter: 50
    }
  },
  {
    id: 'mothership_3',
    name: 'Titan Worldship',
    class: 'Titan',
    level: 1,
    maxLevel: 75,
    rank: 'SS',
    rarity: 'Cosmic',
    stats: {
      attack: 50000,
      defense: 60000,
      speed: 3000,
      health: 3000000,
      maxHealth: 3000000,
      energy: 500000,
      maxEnergy: 500000,
      cargo: 500000,
      shield: 400000,
      maxShield: 400000,
      criticalChance: 25,
      criticalDamage: 300,
      evasion: 10,
      accuracy: 95,
      armor: 30000,
      shieldStrength: 250,
      shieldRegeneration: 3000,
      healthRegeneration: 1500,
      energyRegeneration: 5000
    },
    hangarCapacity: 500,
    commandBonus: 100,
    fleetCapacityBonus: 200,
    abilities: [
      {
        name: 'Titan\'s Wrath',
        description: 'Unleash devastating firepower dealing 1000% damage to all enemies and reducing their defense by 50% for 120 seconds',
        cooldown: 300,
        effect: '1000% AoE Damage, -50% Enemy Defense'
      },
      {
        name: 'Dimensional Fortress',
        description: 'Phase the entire fleet into a parallel dimension, becoming invulnerable for 30 seconds',
        cooldown: 600,
        effect: 'Fleet Invulnerability'
      },
      {
        name: 'Mass Resurrection',
        description: 'Revive all destroyed allied ships at 50% health and shields',
        cooldown: 900,
        effect: 'Revive All Destroyed Allies'
      },
      {
        name: 'Gravity Well',
        description: 'Create a massive gravitational field that prevents all enemy ships from warping for 180 seconds',
        cooldown: 480,
        effect: 'Warp Interdiction Field'
      },
      {
        name: 'Quantum Reconstruction',
        description: 'Fully repair and restore all allied ships to maximum health, shields, and energy',
        cooldown: 720,
        effect: 'Full Fleet Restoration'
      }
    ],
    modules: {
      weapons: 20,
      shields: 16,
      engines: 10,
      special: 12
    },
    crew: 50000,
    description: 'A mobile fortress the size of a small moon, capable of housing entire populations and serving as a self-sufficient war machine.',
    lore: 'Titan Worldships are engineering marvels that blur the line between ship and planet. These colossal vessels can sustain entire civilizations while projecting military power across multiple star systems. Only the wealthiest empires can afford to construct such magnificent vessels.',
    specialFeatures: [
      'Self-Sustaining Ecosystem',
      'Planetary-Scale Shields',
      'Mega Weapon Systems',
      'Internal Shipyards',
      'Population Housing',
      'Agricultural Zones',
      'Industrial Complexes',
      'Research Facilities',
      'Dimensional Phase Drive',
      'Gravitational Manipulation'
    ],
    buildCost: {
      metal: 50000000,
      crystal: 40000000,
      deuterium: 30000000,
      darkMatter: 10000
    },
    buildTime: 2592000,
    maintenanceCost: {
      metal: 100000,
      crystal: 80000,
      deuterium: 50000,
      darkMatter: 200
    }
  },
  {
    id: 'mothership_4',
    name: 'Leviathan Dreadnought',
    class: 'Leviathan',
    level: 1,
    maxLevel: 100,
    rank: 'SSS',
    rarity: 'Universal',
    stats: {
      attack: 150000,
      defense: 200000,
      speed: 2000,
      health: 10000000,
      maxHealth: 10000000,
      energy: 2000000,
      maxEnergy: 2000000,
      cargo: 2000000,
      shield: 1500000,
      maxShield: 1500000,
      criticalChance: 35,
      criticalDamage: 500,
      evasion: 15,
      accuracy: 99,
      armor: 100000,
      shieldStrength: 500,
      shieldRegeneration: 10000,
      healthRegeneration: 5000,
      energyRegeneration: 20000
    },
    hangarCapacity: 1000,
    commandBonus: 250,
    fleetCapacityBonus: 500,
    abilities: [
      {
        name: 'Apocalypse Cannon',
        description: 'Fire a reality-shattering beam that deals 5000% damage and destroys all shields in its path',
        cooldown: 600,
        effect: '5000% Damage, Shield Destruction'
      },
      {
        name: 'Temporal Rewind',
        description: 'Reverse time by 60 seconds, restoring all allied ships to their previous state',
        cooldown: 1200,
        effect: 'Time Reversal'
      },
      {
        name: 'Singularity Bomb',
        description: 'Create a black hole that pulls in and crushes all enemy ships within 100,000 units',
        cooldown: 900,
        effect: 'Instant Kill AoE'
      },
      {
        name: 'Reality Manipulation',
        description: 'Alter reality to grant the fleet 100% critical chance and 1000% critical damage for 60 seconds',
        cooldown: 720,
        effect: 'Guaranteed Critical Hits'
      },
      {
        name: 'Dimensional Armada',
        description: 'Summon mirror copies of the entire fleet from parallel dimensions for 180 seconds',
        cooldown: 1800,
        effect: 'Double Fleet Size'
      },
      {
        name: 'Eternal Fortress',
        description: 'Make the entire fleet completely invulnerable and immune to all effects for 60 seconds',
        cooldown: 1500,
        effect: 'Total Invulnerability'
      }
    ],
    modules: {
      weapons: 32,
      shields: 24,
      engines: 16,
      special: 20
    },
    crew: 200000,
    description: 'The ultimate expression of military might - a Leviathan-class mothership that can single-handedly conquer entire galaxies.',
    lore: 'Leviathan Dreadnoughts are the stuff of myths and legends. Only a handful have ever been constructed, each one requiring the combined resources of multiple star systems and decades of construction. They are not merely ships but mobile empires, capable of reshaping reality itself and commanding forces that can overwhelm any opposition. To face a Leviathan is to face inevitable defeat.',
    specialFeatures: [
      'Reality Manipulation Core',
      'Temporal Displacement Engine',
      'Singularity Weapon System',
      'Dimensional Gateway Network',
      'Self-Replicating Nanites',
      'Quantum Entanglement Communication',
      'Precursor Technology Integration',
      'Exotic Matter Reactor',
      'Infinite Resource Generation',
      'Galactic Conquest Systems',
      'Automated Titan Production',
      'Universal Translator',
      'Omniscient Scanner Array'
    ],
    buildCost: {
      metal: 500000000,
      crystal: 400000000,
      deuterium: 300000000,
      darkMatter: 100000
    },
    buildTime: 7776000,
    maintenanceCost: {
      metal: 1000000,
      crystal: 800000,
      deuterium: 500000,
      darkMatter: 2000
    }
  },
  {
    id: 'mothership_5',
    name: 'Eternal Ark',
    class: 'Eternal',
    level: 1,
    maxLevel: 150,
    rank: 'SSS',
    rarity: 'Universal',
    stats: {
      attack: 500000,
      defense: 750000,
      speed: 1000,
      health: 50000000,
      maxHealth: 50000000,
      energy: 10000000,
      maxEnergy: 10000000,
      cargo: 10000000,
      shield: 10000000,
      maxShield: 10000000,
      criticalChance: 50,
      criticalDamage: 1000,
      evasion: 25,
      accuracy: 100,
      armor: 500000,
      shieldStrength: 1000,
      shieldRegeneration: 50000,
      healthRegeneration: 25000,
      energyRegeneration: 100000
    },
    hangarCapacity: 5000,
    commandBonus: 1000,
    fleetCapacityBonus: 2000,
    abilities: [
      {
        name: 'Genesis Wave',
        description: 'Unleash a wave of creation energy that instantly constructs a new fleet and fully heals all allies',
        cooldown: 1800,
        effect: 'Create New Fleet + Full Heal'
      },
      {
        name: 'Omega Protocol',
        description: 'Activate ultimate defense mode, becoming completely invincible and reflecting all damage back to attackers',
        cooldown: 2400,
        effect: 'Invincibility + Damage Reflection'
      },
      {
        name: 'Cosmic Annihilation',
        description: 'Erase all enemy forces from existence across the entire star system',
        cooldown: 3600,
        effect: 'System-Wide Enemy Elimination'
      },
      {
        name: 'Infinite Regeneration',
        description: 'Grant the entire fleet continuous regeneration of 10% health, shields, and energy per second',
        cooldown: 1200,
        effect: 'Permanent Regeneration Buff'
      },
      {
        name: 'Universal Dominion',
        description: 'Take control of all enemy ships and add them to your fleet permanently',
        cooldown: 4800,
        effect: 'Mass Mind Control'
      },
      {
        name: 'Eternal Ascension',
        description: 'Transcend physical limitations, making the entire fleet immune to all damage and effects permanently',
        cooldown: 7200,
        effect: 'Permanent Invulnerability'
      }
    ],
    modules: {
      weapons: 50,
      shields: 40,
      engines: 30,
      special: 40
    },
    crew: 1000000,
    description: 'A transcendent vessel that exists beyond normal space-time, representing the pinnacle of all technological and mystical achievement.',
    lore: 'The Eternal Ark is not merely a ship - it is a living testament to the ultimate potential of civilization. Built using knowledge from ancient precursor races and powered by the fundamental forces of the universe itself, it exists partially outside of normal reality. Those who command an Eternal Ark command the very fabric of existence. It is said that only one can exist in the universe at any given time, and its construction marks the ascension of a civilization to godhood.',
    specialFeatures: [
      'Transcendent Existence',
      'Reality Creation Engine',
      'Universal Consciousness Interface',
      'Infinite Energy Source',
      'Omnipotent Weapon Systems',
      'Multiversal Gateway',
      'Time Manipulation Core',
      'Matter Creation Matrix',
      'Consciousness Upload Facility',
      'Dimensional Fortress Mode',
      'Precursor AI Integration',
      'Cosmic Awareness Network',
      'Eternal Life Support',
      'Universal Translation',
      'Galactic Terraforming Systems'
    ],
    buildCost: {
      metal: 5000000000,
      crystal: 4000000000,
      deuterium: 3000000000,
      darkMatter: 1000000
    },
    buildTime: 31536000,
    maintenanceCost: {
      metal: 10000000,
      crystal: 8000000,
      deuterium: 5000000,
      darkMatter: 10000
    }
  }
];

export const getMothershipByClass = (mothershipClass: 'Carrier' | 'Command' | 'Titan' | 'Leviathan' | 'Eternal'): Mothership | undefined => {
  return MOTHERSHIP_DATA.find(ms => ms.class === mothershipClass);
};

export const getMothershipsByRank = (rank: Rank): Mothership[] => {
  return MOTHERSHIP_DATA.filter(ms => ms.rank === rank);
};

export const calculateMothershipUpgradeCost = (mothership: Mothership, targetLevel: number): {
  metal: number;
  crystal: number;
  deuterium: number;
  darkMatter: number;
} => {
  const levelDiff = targetLevel - mothership.level;
  const multiplier = Math.pow(1.6, levelDiff);
  
  return {
    metal: Math.floor(mothership.buildCost.metal * multiplier * 0.2),
    crystal: Math.floor(mothership.buildCost.crystal * multiplier * 0.2),
    deuterium: Math.floor(mothership.buildCost.deuterium * multiplier * 0.2),
    darkMatter: Math.floor((mothership.buildCost.darkMatter || 0) * multiplier * 0.2)
  };
};
