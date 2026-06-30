export interface TravelSystem {
  id: string;
  name: string;
  type: 'jumpgate' | 'stargate' | 'hyperspace';
  tier: number;
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS' | 'Universal';
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Transcendent' | 'Universal';
  description: string;
  lore: string;
  
  // Travel Properties
  maxRange: number; // in light years
  travelSpeed: number; // multiplier (1x = normal, 10x = 10 times faster)
  cooldown: number; // in seconds
  energyCost: number; // per light year
  fuelCost: number; // deuterium per light year
  
  // Capacity
  maxFleetSize: number; // max ships per jump
  maxMass: number; // max total mass
  
  // Special Properties
  instantTravel: boolean;
  canBypassDefenses: boolean;
  stealthTravel: boolean;
  massTransport: boolean;
  
  // Requirements
  requirements: {
    level: number;
    technologies: string[];
    buildings?: { [key: string]: number };
    resources: {
      metal: number;
      crystal: number;
      deuterium: number;
      darkMatter?: number;
      exoticMatter?: number;
    };
  };
  
  // Maintenance
  maintenanceCost: {
    energy: number; // per hour
    deuterium: number; // per hour
  };
  
  // Abilities
  abilities: {
    name: string;
    description: string;
    cooldown: number;
    effect: string;
  }[];
  
  // Special Effects
  specialEffects: string[];
}

export const travelSystems: TravelSystem[] = [
  // JUMP GATES - Short to medium range, network-based
  {
    id: 'basic_jumpgate',
    name: 'Basic Jump Gate',
    type: 'jumpgate',
    tier: 1,
    rank: 'D',
    rarity: 'Common',
    description: 'A basic jump gate that allows instant travel between connected gates within a limited range.',
    lore: 'The first breakthrough in faster-than-light travel, jump gates create stable wormholes between two fixed points in space.',
    
    maxRange: 50,
    travelSpeed: 1,
    cooldown: 300,
    energyCost: 100,
    fuelCost: 50,
    
    maxFleetSize: 50,
    maxMass: 100000,
    
    instantTravel: true,
    canBypassDefenses: false,
    stealthTravel: false,
    massTransport: false,
    
    requirements: {
      level: 10,
      technologies: ['hyperspace_technology_1'],
      buildings: { 'research_lab': 3 },
      resources: {
        metal: 500000,
        crystal: 250000,
        deuterium: 100000
      }
    },
    
    maintenanceCost: {
      energy: 1000,
      deuterium: 500
    },
    
    abilities: [
      {
        name: 'Emergency Jump',
        description: 'Instantly transport a fleet to safety, ignoring cooldown',
        cooldown: 3600,
        effect: 'Bypass cooldown once per hour'
      }
    ],
    
    specialEffects: [
      'Instant travel between gates',
      'Network connectivity required',
      'Limited range'
    ]
  },
  {
    id: 'advanced_jumpgate',
    name: 'Advanced Jump Gate',
    type: 'jumpgate',
    tier: 3,
    rank: 'B',
    rarity: 'Rare',
    description: 'An improved jump gate with extended range and capacity, capable of transporting larger fleets.',
    lore: 'Advanced quantum stabilizers allow for larger wormholes and more stable connections across greater distances.',
    
    maxRange: 150,
    travelSpeed: 1,
    cooldown: 180,
    energyCost: 75,
    fuelCost: 35,
    
    maxFleetSize: 200,
    maxMass: 500000,
    
    instantTravel: true,
    canBypassDefenses: false,
    stealthTravel: false,
    massTransport: true,
    
    requirements: {
      level: 25,
      technologies: ['hyperspace_technology_3', 'quantum_mechanics_2'],
      buildings: { 'research_lab': 6 },
      resources: {
        metal: 2000000,
        crystal: 1000000,
        deuterium: 500000,
        darkMatter: 100
      }
    },
    
    maintenanceCost: {
      energy: 2500,
      deuterium: 1000
    },
    
    abilities: [
      {
        name: 'Mass Transport',
        description: 'Transport entire fleets instantly',
        cooldown: 600,
        effect: 'No mass limit for 1 jump'
      },
      {
        name: 'Network Boost',
        description: 'Reduce cooldown for all connected gates',
        cooldown: 1800,
        effect: '-50% cooldown for 30 minutes'
      }
    ],
    
    specialEffects: [
      'Extended range',
      'Faster cooldown',
      'Mass transport capable',
      'Network efficiency boost'
    ]
  },
  {
    id: 'quantum_jumpgate',
    name: 'Quantum Jump Gate',
    type: 'jumpgate',
    tier: 5,
    rank: 'A',
    rarity: 'Epic',
    description: 'A quantum-enhanced jump gate that can create multiple simultaneous connections.',
    lore: 'Utilizing quantum entanglement, these gates can maintain multiple stable wormholes simultaneously.',
    
    maxRange: 300,
    travelSpeed: 1,
    cooldown: 60,
    energyCost: 50,
    fuelCost: 20,
    
    maxFleetSize: 500,
    maxMass: 2000000,
    
    instantTravel: true,
    canBypassDefenses: false,
    stealthTravel: false,
    massTransport: true,
    
    requirements: {
      level: 50,
      technologies: ['hyperspace_technology_5', 'quantum_mechanics_4'],
      buildings: { 'research_lab': 10 },
      resources: {
        metal: 10000000,
        crystal: 5000000,
        deuterium: 2500000,
        darkMatter: 500,
        exoticMatter: 100
      }
    },
    
    maintenanceCost: {
      energy: 5000,
      deuterium: 2000
    },
    
    abilities: [
      {
        name: 'Multi-Jump',
        description: 'Create multiple simultaneous connections',
        cooldown: 300,
        effect: 'Transport 3 fleets at once'
      },
      {
        name: 'Quantum Tunnel',
        description: 'Create a temporary gate to any location',
        cooldown: 7200,
        effect: 'One-time gate to any coordinates'
      }
    ],
    
    specialEffects: [
      'Multiple simultaneous jumps',
      'Very fast cooldown',
      'Massive capacity',
      'Temporary gate creation'
    ]
  },
  
  // STARGATES - Long range, powerful, strategic
  {
    id: 'basic_stargate',
    name: 'Basic Stargate',
    type: 'stargate',
    tier: 2,
    rank: 'C',
    rarity: 'Uncommon',
    description: 'A powerful stargate capable of long-range travel across vast distances.',
    lore: 'Stargates harness the power of stars themselves to tear open massive rifts in spacetime.',
    
    maxRange: 500,
    travelSpeed: 5,
    cooldown: 600,
    energyCost: 200,
    fuelCost: 100,
    
    maxFleetSize: 100,
    maxMass: 250000,
    
    instantTravel: false,
    canBypassDefenses: false,
    stealthTravel: false,
    massTransport: false,
    
    requirements: {
      level: 20,
      technologies: ['hyperspace_technology_2', 'energy_technology_3'],
      buildings: { 'research_lab': 5, 'fusion_reactor': 5 },
      resources: {
        metal: 1000000,
        crystal: 750000,
        deuterium: 250000
      }
    },
    
    maintenanceCost: {
      energy: 3000,
      deuterium: 1500
    },
    
    abilities: [
      {
        name: 'Long Range Jump',
        description: 'Travel to distant systems',
        cooldown: 1200,
        effect: 'Double max range for one jump'
      }
    ],
    
    specialEffects: [
      'Long range travel',
      'Fast travel speed',
      'Star-powered'
    ]
  },
  {
    id: 'advanced_stargate',
    name: 'Advanced Stargate',
    type: 'stargate',
    tier: 4,
    rank: 'A',
    rarity: 'Epic',
    description: 'An advanced stargate with enhanced range and the ability to bypass some defensive systems.',
    lore: 'Advanced stargates can manipulate spacetime to emerge inside enemy territory.',
    
    maxRange: 1000,
    travelSpeed: 10,
    cooldown: 300,
    energyCost: 150,
    fuelCost: 75,
    
    maxFleetSize: 300,
    maxMass: 1000000,
    
    instantTravel: false,
    canBypassDefenses: true,
    stealthTravel: false,
    massTransport: true,
    
    requirements: {
      level: 40,
      technologies: ['hyperspace_technology_4', 'energy_technology_5'],
      buildings: { 'research_lab': 8, 'fusion_reactor': 8 },
      resources: {
        metal: 5000000,
        crystal: 3000000,
        deuterium: 1500000,
        darkMatter: 250
      }
    },
    
    maintenanceCost: {
      energy: 7500,
      deuterium: 3000
    },
    
    abilities: [
      {
        name: 'Tactical Jump',
        description: 'Bypass planetary defenses',
        cooldown: 1800,
        effect: 'Ignore 50% of defenses'
      },
      {
        name: 'Rapid Deployment',
        description: 'Instant fleet deployment',
        cooldown: 3600,
        effect: 'Zero travel time for one jump'
      }
    ],
    
    specialEffects: [
      'Very long range',
      'Defense bypass capability',
      'Fast deployment',
      'Mass transport'
    ]
  },
  {
    id: 'titan_stargate',
    name: 'Titan Stargate',
    type: 'stargate',
    tier: 6,
    rank: 'S',
    rarity: 'Legendary',
    description: 'A massive stargate capable of transporting entire armadas across the galaxy.',
    lore: 'Built around dying stars, Titan Stargates can open rifts large enough to transport moon-sized vessels.',
    
    maxRange: 2500,
    travelSpeed: 25,
    cooldown: 120,
    energyCost: 100,
    fuelCost: 50,
    
    maxFleetSize: 1000,
    maxMass: 10000000,
    
    instantTravel: false,
    canBypassDefenses: true,
    stealthTravel: false,
    massTransport: true,
    
    requirements: {
      level: 70,
      technologies: ['hyperspace_technology_6', 'energy_technology_7'],
      buildings: { 'research_lab': 12, 'fusion_reactor': 12 },
      resources: {
        metal: 25000000,
        crystal: 15000000,
        deuterium: 7500000,
        darkMatter: 1000,
        exoticMatter: 500
      }
    },
    
    maintenanceCost: {
      energy: 15000,
      deuterium: 7500
    },
    
    abilities: [
      {
        name: 'Armada Jump',
        description: 'Transport unlimited fleets',
        cooldown: 3600,
        effect: 'No fleet size limit'
      },
      {
        name: 'Galaxy Breach',
        description: 'Jump to any galaxy',
        cooldown: 7200,
        effect: 'Unlimited range for one jump'
      },
      {
        name: 'Siege Portal',
        description: 'Create a permanent gate for invasion',
        cooldown: 14400,
        effect: 'Maintain gate for 1 hour'
      }
    ],
    
    specialEffects: [
      'Extreme range',
      'Massive capacity',
      'Armada transport',
      'Permanent portals',
      'Galaxy-wide reach'
    ]
  },
  
  // HYPERSPACE - Ship-based, flexible, no infrastructure needed
  {
    id: 'basic_hyperdrive',
    name: 'Basic Hyperdrive',
    type: 'hyperspace',
    tier: 1,
    rank: 'D',
    rarity: 'Common',
    description: 'A ship-mounted hyperdrive that allows travel through hyperspace.',
    lore: 'The most common form of FTL travel, hyperdrives allow ships to enter an alternate dimension where distances are compressed.',
    
    maxRange: 100,
    travelSpeed: 2,
    cooldown: 60,
    energyCost: 10,
    fuelCost: 20,
    
    maxFleetSize: 999999,
    maxMass: 999999999,
    
    instantTravel: false,
    canBypassDefenses: false,
    stealthTravel: false,
    massTransport: false,
    
    requirements: {
      level: 5,
      technologies: ['hyperspace_technology_1'],
      resources: {
        metal: 100000,
        crystal: 50000,
        deuterium: 25000
      }
    },
    
    maintenanceCost: {
      energy: 100,
      deuterium: 50
    },
    
    abilities: [
      {
        name: 'Emergency Warp',
        description: 'Quick escape from combat',
        cooldown: 300,
        effect: 'Instant hyperspace entry'
      }
    ],
    
    specialEffects: [
      'Ship-based travel',
      'No infrastructure needed',
      'Flexible routing'
    ]
  },
  {
    id: 'advanced_hyperdrive',
    name: 'Advanced Hyperdrive',
    type: 'hyperspace',
    tier: 3,
    rank: 'B',
    rarity: 'Rare',
    description: 'An improved hyperdrive with faster travel speed and longer range.',
    lore: 'Advanced hyperdrives can navigate deeper layers of hyperspace, achieving greater speeds.',
    
    maxRange: 300,
    travelSpeed: 5,
    cooldown: 30,
    energyCost: 8,
    fuelCost: 15,
    
    maxFleetSize: 999999,
    maxMass: 999999999,
    
    instantTravel: false,
    canBypassDefenses: false,
    stealthTravel: false,
    massTransport: false,
    
    requirements: {
      level: 25,
      technologies: ['hyperspace_technology_3'],
      resources: {
        metal: 500000,
        crystal: 250000,
        deuterium: 125000
      }
    },
    
    maintenanceCost: {
      energy: 250,
      deuterium: 100
    },
    
    abilities: [
      {
        name: 'Precision Jump',
        description: 'Accurate hyperspace exit',
        cooldown: 600,
        effect: 'Exit at exact coordinates'
      },
      {
        name: 'Boost Jump',
        description: 'Temporary speed increase',
        cooldown: 1800,
        effect: '2x speed for 10 minutes'
      }
    ],
    
    specialEffects: [
      'Fast travel',
      'Extended range',
      'Precise navigation',
      'Speed boost capability'
    ]
  },
  {
    id: 'quantum_hyperdrive',
    name: 'Quantum Hyperdrive',
    type: 'hyperspace',
    tier: 5,
    rank: 'A',
    rarity: 'Epic',
    description: 'A quantum-enhanced hyperdrive that can phase through obstacles.',
    lore: 'Quantum hyperdrives exist in multiple dimensions simultaneously, allowing them to bypass physical barriers.',
    
    maxRange: 750,
    travelSpeed: 15,
    cooldown: 15,
    energyCost: 5,
    fuelCost: 10,
    
    maxFleetSize: 999999,
    maxMass: 999999999,
    
    instantTravel: false,
    canBypassDefenses: true,
    stealthTravel: true,
    massTransport: false,
    
    requirements: {
      level: 50,
      technologies: ['hyperspace_technology_5', 'quantum_mechanics_4'],
      resources: {
        metal: 2500000,
        crystal: 1500000,
        deuterium: 750000,
        darkMatter: 250
      }
    },
    
    maintenanceCost: {
      energy: 500,
      deuterium: 250
    },
    
    abilities: [
      {
        name: 'Phase Jump',
        description: 'Pass through obstacles',
        cooldown: 900,
        effect: 'Ignore all obstacles'
      },
      {
        name: 'Stealth Warp',
        description: 'Undetectable travel',
        cooldown: 1800,
        effect: 'Invisible during travel'
      },
      {
        name: 'Quantum Tunnel',
        description: 'Instant short-range jump',
        cooldown: 300,
        effect: 'Instant travel up to 50 LY'
      }
    ],
    
    specialEffects: [
      'Very fast travel',
      'Stealth capability',
      'Phase through obstacles',
      'Quantum tunneling'
    ]
  },
  {
    id: 'warp_drive',
    name: 'Warp Drive',
    type: 'hyperspace',
    tier: 4,
    rank: 'A',
    rarity: 'Epic',
    description: 'A warp drive that bends spacetime around the ship for faster-than-light travel.',
    lore: 'Unlike hyperdrives, warp drives remain in normal space, creating a bubble of compressed spacetime.',
    
    maxRange: 500,
    travelSpeed: 10,
    cooldown: 20,
    energyCost: 6,
    fuelCost: 12,
    
    maxFleetSize: 999999,
    maxMass: 999999999,
    
    instantTravel: false,
    canBypassDefenses: false,
    stealthTravel: false,
    massTransport: false,
    
    requirements: {
      level: 35,
      technologies: ['hyperspace_technology_4', 'graviton_technology_3'],
      resources: {
        metal: 1500000,
        crystal: 1000000,
        deuterium: 500000,
        darkMatter: 100
      }
    },
    
    maintenanceCost: {
      energy: 350,
      deuterium: 150
    },
    
    abilities: [
      {
        name: 'Warp Bubble',
        description: 'Protected travel',
        cooldown: 1200,
        effect: 'Immune to interdiction'
      },
      {
        name: 'Maximum Warp',
        description: 'Emergency speed boost',
        cooldown: 3600,
        effect: '5x speed for 5 minutes'
      }
    ],
    
    specialEffects: [
      'Spacetime manipulation',
      'Protected travel',
      'No hyperspace entry needed',
      'Emergency speed boost'
    ]
  },
  {
    id: 'slipspace_drive',
    name: 'Slipspace Drive',
    type: 'hyperspace',
    tier: 6,
    rank: 'S',
    rarity: 'Legendary',
    description: 'An advanced drive that travels through slipspace, a dimension beneath normal space.',
    lore: 'Slipspace exists beneath the fabric of reality, where time and distance have no meaning.',
    
    maxRange: 1500,
    travelSpeed: 30,
    cooldown: 10,
    energyCost: 3,
    fuelCost: 5,
    
    maxFleetSize: 999999,
    maxMass: 999999999,
    
    instantTravel: false,
    canBypassDefenses: true,
    stealthTravel: true,
    massTransport: false,
    
    requirements: {
      level: 60,
      technologies: ['hyperspace_technology_6', 'quantum_mechanics_5'],
      resources: {
        metal: 5000000,
        crystal: 3000000,
        deuterium: 1500000,
        darkMatter: 500,
        exoticMatter: 250
      }
    },
    
    maintenanceCost: {
      energy: 750,
      deuterium: 350
    },
    
    abilities: [
      {
        name: 'Slipspace Rupture',
        description: 'Create temporary portal',
        cooldown: 1800,
        effect: 'Instant travel for fleet'
      },
      {
        name: 'Dimensional Shift',
        description: 'Become untargetable',
        cooldown: 3600,
        effect: 'Invulnerable for 30 seconds'
      },
      {
        name: 'Time Dilation',
        description: 'Slow time around ship',
        cooldown: 7200,
        effect: 'Appear to move 10x faster'
      }
    ],
    
    specialEffects: [
      'Extreme speed',
      'Dimensional travel',
      'Time manipulation',
      'Portal creation',
      'Invulnerability phases'
    ]
  },
  {
    id: 'fold_space_drive',
    name: 'Fold Space Drive',
    type: 'hyperspace',
    tier: 7,
    rank: 'SS',
    rarity: 'Mythic',
    description: 'A reality-bending drive that folds space itself, bringing destinations to you.',
    lore: 'The pinnacle of travel technology, fold space drives manipulate the very fabric of spacetime.',
    
    maxRange: 5000,
    travelSpeed: 100,
    cooldown: 5,
    energyCost: 1,
    fuelCost: 2,
    
    maxFleetSize: 999999,
    maxMass: 999999999,
    
    instantTravel: true,
    canBypassDefenses: true,
    stealthTravel: true,
    massTransport: true,
    
    requirements: {
      level: 80,
      technologies: ['hyperspace_technology_8', 'quantum_mechanics_7'],
      resources: {
        metal: 15000000,
        crystal: 10000000,
        deuterium: 5000000,
        darkMatter: 2000,
        exoticMatter: 1000
      }
    },
    
    maintenanceCost: {
      energy: 1500,
      deuterium: 750
    },
    
    abilities: [
      {
        name: 'Space Fold',
        description: 'Instant travel anywhere',
        cooldown: 600,
        effect: 'Zero travel time'
      },
      {
        name: 'Reality Anchor',
        description: 'Prevent enemy escapes',
        cooldown: 1800,
        effect: 'Block all FTL in area'
      },
      {
        name: 'Dimensional Cascade',
        description: 'Multiple simultaneous jumps',
        cooldown: 3600,
        effect: 'Jump entire fleet to different locations'
      }
    ],
    
    specialEffects: [
      'Instant travel',
      'Unlimited range',
      'Reality manipulation',
      'FTL interdiction',
      'Multi-destination jumps'
    ]
  },
  {
    id: 'infinite_improbability_drive',
    name: 'Infinite Improbability Drive',
    type: 'hyperspace',
    tier: 8,
    rank: 'SSS',
    rarity: 'Universal',
    description: 'A drive that passes through every point in the universe simultaneously.',
    lore: 'By calculating the infinite improbability of arriving at any destination, this drive makes the impossible routine.',
    
    maxRange: 999999,
    travelSpeed: 999999,
    cooldown: 1,
    energyCost: 0,
    fuelCost: 1,
    
    maxFleetSize: 999999,
    maxMass: 999999999,
    
    instantTravel: true,
    canBypassDefenses: true,
    stealthTravel: true,
    massTransport: true,
    
    requirements: {
      level: 100,
      technologies: ['hyperspace_technology_10', 'quantum_mechanics_10'],
      resources: {
        metal: 50000000,
        crystal: 30000000,
        deuterium: 15000000,
        darkMatter: 5000,
        exoticMatter: 5000
      }
    },
    
    maintenanceCost: {
      energy: 3000,
      deuterium: 1000
    },
    
    abilities: [
      {
        name: 'Improbable Jump',
        description: 'Arrive anywhere instantly',
        cooldown: 60,
        effect: 'Instant travel to any universe'
      },
      {
        name: 'Probability Manipulation',
        description: 'Make the impossible possible',
        cooldown: 300,
        effect: 'Ignore all restrictions'
      },
      {
        name: 'Omnipresence',
        description: 'Be everywhere at once',
        cooldown: 3600,
        effect: 'Fleet exists in all locations for 1 minute'
      }
    ],
    
    specialEffects: [
      'Infinite range',
      'Instant travel',
      'Probability manipulation',
      'Omnipresence',
      'Universe traversal',
      'Reality breaking'
    ]
  }
];

export const getTravelSystemsByType = (type: 'jumpgate' | 'stargate' | 'hyperspace') => {
  return travelSystems.filter(system => system.type === type);
};

export const getTravelSystemById = (id: string) => {
  return travelSystems.find(system => system.id === id);
};

export const calculateTravelTime = (distance: number, system: TravelSystem): number => {
  if (system.instantTravel) return 0;
  
  // Base travel time in seconds (1 light year = 60 seconds at 1x speed)
  const baseTime = distance * 60;
  return baseTime / system.travelSpeed;
};

export const calculateTravelCost = (distance: number, system: TravelSystem, fleetSize: number) => {
  const energyCost = distance * system.energyCost * (fleetSize / 100);
  const fuelCost = distance * system.fuelCost * (fleetSize / 100);
  
  return {
    energy: Math.ceil(energyCost),
    deuterium: Math.ceil(fuelCost)
  };
};

export const canUseSystem = (
  system: TravelSystem,
  playerLevel: number,
  playerTechnologies: string[],
  playerBuildings: { [key: string]: number } | undefined,
  playerResources: { metal: number; crystal: number; deuterium: number; darkMatter: number; exoticMatter: number }
): { canUse: boolean; missingRequirements: string[] } => {
  const missing: string[] = [];
  
  if (playerLevel < system.requirements.level) {
    missing.push(`Level ${system.requirements.level} required`);
  }
  
  system.requirements.technologies.forEach(tech => {
    if (!playerTechnologies.includes(tech)) {
      missing.push(`Technology: ${tech}`);
    }
  });
  
  if (system.requirements.buildings && playerBuildings) {
    Object.entries(system.requirements.buildings).forEach(([building, level]) => {
      if (!playerBuildings[building] || playerBuildings[building] < level) {
        missing.push(`${building} level ${level}`);
      }
    });
  } else if (system.requirements.buildings && !playerBuildings) {
    // If buildings are required but player has none loaded yet
    Object.entries(system.requirements.buildings).forEach(([building, level]) => {
      missing.push(`${building} level ${level}`);
    });
  }
  
  if (playerResources.metal < system.requirements.resources.metal) {
    missing.push(`${system.requirements.resources.metal.toLocaleString()} Metal`);
  }
  if (playerResources.crystal < system.requirements.resources.crystal) {
    missing.push(`${system.requirements.resources.crystal.toLocaleString()} Crystal`);
  }
  if (playerResources.deuterium < system.requirements.resources.deuterium) {
    missing.push(`${system.requirements.resources.deuterium.toLocaleString()} Deuterium`);
  }
  if (system.requirements.resources.darkMatter && playerResources.darkMatter < system.requirements.resources.darkMatter) {
    missing.push(`${system.requirements.resources.darkMatter.toLocaleString()} Dark Matter`);
  }
  if (system.requirements.resources.exoticMatter && playerResources.exoticMatter < system.requirements.resources.exoticMatter) {
    missing.push(`${system.requirements.resources.exoticMatter.toLocaleString()} Exotic Matter`);
  }
  
  return {
    canUse: missing.length === 0,
    missingRequirements: missing
  };
};
