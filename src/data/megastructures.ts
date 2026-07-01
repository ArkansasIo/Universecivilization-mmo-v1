import { Megastructure, MegastructureType, Rank, Rarity } from '../types/gameTypes';

export const MEGASTRUCTURE_DATA: Megastructure[] = [
  {
    id: 'mega_1',
    name: 'Dyson Sphere',
    type: 'Dyson Sphere',
    tier: 1,
    maxTier: 10,
    rank: 'SSS',
    rarity: 'Universal',
    constructionProgress: 0,
    isComplete: false,
    effects: {
      energyProduction: 1000000,
      researchBonus: 100,
      productionBonus: 200,
      specialEffect: 'Unlimited energy for the entire star system'
    },
    requirements: {
      technologies: ['Advanced Energy', 'Megastructure Engineering', 'Stellar Manipulation'],
      resources: {
        metal: 1000000000,
        crystal: 800000000,
        deuterium: 500000000,
        darkMatter: 100000
      },
      time: 31536000,
      planetClass: [5, 9]
    },
    description: 'A colossal sphere that completely encloses a star, capturing 100% of its energy output for use by your civilization.',
    lore: 'The Dyson Sphere represents the ultimate achievement in energy harvesting. By enclosing an entire star, your civilization gains access to virtually unlimited power. Construction requires the coordinated effort of billions of workers and automated systems over decades. Once complete, it transforms your empire into a Type II civilization on the Kardashev scale.',
    benefits: [
      'Unlimited Energy Production',
      'Massive Research Speed Boost',
      'Extreme Production Efficiency',
      'System-Wide Power Grid',
      'Energy Weapon Capabilities',
      'Climate Control for All Planets'
    ],
    constructionStages: [
      {
        stage: 1,
        name: 'Foundation Ring',
        progress: 0,
        requirements: {
          metal: 100000000,
          crystal: 80000000,
          deuterium: 50000000,
          darkMatter: 10000
        }
      },
      {
        stage: 2,
        name: 'Primary Framework',
        progress: 0,
        requirements: {
          metal: 200000000,
          crystal: 160000000,
          deuterium: 100000000,
          darkMatter: 20000
        }
      },
      {
        stage: 3,
        name: 'Energy Collectors',
        progress: 0,
        requirements: {
          metal: 300000000,
          crystal: 240000000,
          deuterium: 150000000,
          darkMatter: 30000
        }
      },
      {
        stage: 4,
        name: 'Sphere Completion',
        progress: 0,
        requirements: {
          metal: 400000000,
          crystal: 320000000,
          deuterium: 200000000,
          darkMatter: 40000
        }
      }
    ],
    maintenanceCost: {
      metal: 1000000,
      crystal: 800000,
      deuterium: 500000,
      darkMatter: 1000
    },
    powerRating: 10000000
  },
  {
    id: 'mega_2',
    name: 'Ring World',
    type: 'Ring World',
    tier: 1,
    maxTier: 8,
    rank: 'SSS',
    rarity: 'Universal',
    constructionProgress: 0,
    isComplete: false,
    effects: {
      populationCapacity: 100000000000,
      productionBonus: 500,
      researchBonus: 300,
      specialEffect: 'Habitable surface area equivalent to millions of Earth-like planets'
    },
    requirements: {
      technologies: ['Megastructure Engineering', 'Artificial Gravity', 'Planetary Engineering'],
      resources: {
        metal: 2000000000,
        crystal: 1500000000,
        deuterium: 1000000000,
        darkMatter: 200000
      },
      time: 47304000,
      planetClass: [5, 9]
    },
    description: 'A massive ring-shaped habitat orbiting a star, providing living space for trillions of beings with Earth-like conditions.',
    lore: 'The Ring World is the ultimate solution to overpopulation. This artificial world encircles an entire star, with a habitable inner surface area millions of times larger than Earth. Its construction represents the pinnacle of engineering, creating a paradise where entire civilizations can thrive in perfect harmony.',
    benefits: [
      'Unlimited Population Capacity',
      'Perfect Living Conditions',
      'Massive Agricultural Output',
      'Industrial Superpower',
      'Cultural Renaissance',
      'Scientific Golden Age'
    ],
    constructionStages: [
      {
        stage: 1,
        name: 'Structural Foundation',
        progress: 0,
        requirements: {
          metal: 500000000,
          crystal: 375000000,
          deuterium: 250000000,
          darkMatter: 50000
        }
      },
      {
        stage: 2,
        name: 'Habitable Surface',
        progress: 0,
        requirements: {
          metal: 700000000,
          crystal: 525000000,
          deuterium: 350000000,
          darkMatter: 70000
        }
      },
      {
        stage: 3,
        name: 'Atmosphere Generation',
        progress: 0,
        requirements: {
          metal: 800000000,
          crystal: 600000000,
          deuterium: 400000000,
          darkMatter: 80000
        }
      }
    ],
    maintenanceCost: {
      metal: 2000000,
      crystal: 1500000,
      deuterium: 1000000,
      darkMatter: 2000
    },
    powerRating: 15000000
  },
  {
    id: 'mega_3',
    name: 'Orbital Habitat Network',
    type: 'Orbital Habitat',
    tier: 1,
    maxTier: 15,
    rank: 'S',
    rarity: 'Mythic',
    constructionProgress: 0,
    isComplete: false,
    effects: {
      populationCapacity: 10000000,
      productionBonus: 50,
      researchBonus: 40,
      storageBonus: 100,
      specialEffect: 'Provides additional living space without requiring a new planet'
    },
    requirements: {
      technologies: ['Space Stations', 'Life Support Systems', 'Orbital Engineering'],
      resources: {
        metal: 50000000,
        crystal: 30000000,
        deuterium: 20000000,
        darkMatter: 5000
      },
      time: 2592000
    },
    description: 'A network of interconnected orbital habitats providing living space, research facilities, and industrial capacity.',
    lore: 'Orbital Habitat Networks represent the first step toward megastructure construction. These massive space stations orbit planets, providing additional capacity for population, industry, and research without the need for planetary colonization.',
    benefits: [
      'Increased Population Capacity',
      'Orbital Manufacturing',
      'Zero-Gravity Research',
      'Strategic Defense Platform',
      'Trade Hub'
    ],
    constructionStages: [
      {
        stage: 1,
        name: 'Core Modules',
        progress: 0,
        requirements: {
          metal: 25000000,
          crystal: 15000000,
          deuterium: 10000000,
          darkMatter: 2500
        }
      },
      {
        stage: 2,
        name: 'Expansion Wings',
        progress: 0,
        requirements: {
          metal: 25000000,
          crystal: 15000000,
          deuterium: 10000000,
          darkMatter: 2500
        }
      }
    ],
    maintenanceCost: {
      metal: 50000,
      crystal: 30000,
      deuterium: 20000,
      darkMatter: 50
    },
    powerRating: 500000
  },
  {
    id: 'mega_4',
    name: 'Planetary Space Elevator',
    type: 'Space Elevator',
    tier: 1,
    maxTier: 20,
    rank: 'A',
    rarity: 'Legendary',
    constructionProgress: 0,
    isComplete: false,
    effects: {
      productionBonus: 100,
      tradeBonus: 150,
      specialEffect: 'Reduces ship construction costs by 30% and build time by 25%'
    },
    requirements: {
      technologies: ['Advanced Materials', 'Orbital Engineering', 'Nanotechnology'],
      resources: {
        metal: 10000000,
        crystal: 8000000,
        deuterium: 5000000,
        darkMatter: 1000
      },
      time: 1296000,
      planetClass: [2, 3, 4, 5, 6]
    },
    description: 'A massive elevator extending from the planet\'s surface to orbital space, dramatically reducing the cost of space launches.',
    lore: 'The Space Elevator revolutionizes space logistics by eliminating the need for expensive rocket launches. Materials and personnel can be transported to orbit at a fraction of the traditional cost, making space construction projects far more economical.',
    benefits: [
      'Reduced Launch Costs',
      'Faster Ship Construction',
      'Increased Trade Efficiency',
      'Orbital Access for All',
      'Tourism Revenue'
    ],
    constructionStages: [
      {
        stage: 1,
        name: 'Ground Station',
        progress: 0,
        requirements: {
          metal: 3000000,
          crystal: 2400000,
          deuterium: 1500000,
          darkMatter: 300
        }
      },
      {
        stage: 2,
        name: 'Cable Construction',
        progress: 0,
        requirements: {
          metal: 4000000,
          crystal: 3200000,
          deuterium: 2000000,
          darkMatter: 400
        }
      },
      {
        stage: 3,
        name: 'Orbital Platform',
        progress: 0,
        requirements: {
          metal: 3000000,
          crystal: 2400000,
          deuterium: 1500000,
          darkMatter: 300
        }
      }
    ],
    maintenanceCost: {
      metal: 10000,
      crystal: 8000,
      deuterium: 5000,
      darkMatter: 10
    },
    powerRating: 200000
  },
  {
    id: 'mega_5',
    name: 'Stellar Engine',
    type: 'Stellar Engine',
    tier: 1,
    maxTier: 5,
    rank: 'SSS',
    rarity: 'Universal',
    constructionProgress: 0,
    isComplete: false,
    effects: {
      specialEffect: 'Allows the entire star system to be moved through space at 0.01c'
    },
    requirements: {
      technologies: ['Stellar Manipulation', 'Gravitational Engineering', 'Megastructure Engineering'],
      resources: {
        metal: 5000000000,
        crystal: 4000000000,
        deuterium: 3000000000,
        darkMatter: 500000
      },
      time: 63072000
    },
    description: 'An unimaginable megastructure that uses a star\'s own energy to propel the entire star system through space.',
    lore: 'The Stellar Engine is the ultimate expression of stellar engineering. By harnessing the star\'s radiation pressure and magnetic fields, this megastructure can slowly accelerate the entire star system, allowing your civilization to escape cosmic threats or migrate to more favorable regions of the galaxy.',
    benefits: [
      'System Mobility',
      'Escape Cosmic Threats',
      'Galactic Migration',
      'Strategic Repositioning',
      'Ultimate Defense'
    ],
    constructionStages: [
      {
        stage: 1,
        name: 'Mirror Array',
        progress: 0,
        requirements: {
          metal: 2500000000,
          crystal: 2000000000,
          deuterium: 1500000000,
          darkMatter: 250000
        }
      },
      {
        stage: 2,
        name: 'Propulsion System',
        progress: 0,
        requirements: {
          metal: 2500000000,
          crystal: 2000000000,
          deuterium: 1500000000,
          darkMatter: 250000
        }
      }
    ],
    maintenanceCost: {
      metal: 5000000,
      crystal: 4000000,
      deuterium: 3000000,
      darkMatter: 5000
    },
    powerRating: 50000000
  },
  {
    id: 'mega_6',
    name: 'Matrioshka Brain',
    type: 'Matrioshka Brain',
    tier: 1,
    maxTier: 7,
    rank: 'SSS',
    rarity: 'Universal',
    constructionProgress: 0,
    isComplete: false,
    effects: {
      researchBonus: 10000,
      specialEffect: 'Provides computational power equivalent to 10^42 operations per second'
    },
    requirements: {
      technologies: ['Quantum Computing', 'Stellar Manipulation', 'Artificial Intelligence'],
      resources: {
        metal: 3000000000,
        crystal: 5000000000,
        deuterium: 2000000000,
        darkMatter: 300000
      },
      time: 47304000
    },
    description: 'A megacomputer built from nested Dyson spheres, providing unimaginable computational power for research and AI.',
    lore: 'The Matrioshka Brain is a computer of such vast power that it can simulate entire universes. Built as a series of nested shells around a star, each layer captures waste heat from the inner layers, creating the most efficient computer possible. With it, your civilization can solve problems that would take conventional computers billions of years.',
    benefits: [
      'Unlimited Research Speed',
      'Perfect Simulations',
      'Artificial Intelligence',
      'Predictive Modeling',
      'Universe Simulation',
      'Instant Problem Solving'
    ],
    constructionStages: [
      {
        stage: 1,
        name: 'Inner Shell',
        progress: 0,
        requirements: {
          metal: 1000000000,
          crystal: 1666666667,
          deuterium: 666666667,
          darkMatter: 100000
        }
      },
      {
        stage: 2,
        name: 'Middle Shells',
        progress: 0,
        requirements: {
          metal: 1000000000,
          crystal: 1666666667,
          deuterium: 666666667,
          darkMatter: 100000
        }
      },
      {
        stage: 3,
        name: 'Outer Shell',
        progress: 0,
        requirements: {
          metal: 1000000000,
          crystal: 1666666666,
          deuterium: 666666666,
          darkMatter: 100000
        }
      }
    ],
    maintenanceCost: {
      metal: 3000000,
      crystal: 5000000,
      deuterium: 2000000,
      darkMatter: 3000
    },
    powerRating: 100000000
  },
  {
    id: 'mega_7',
    name: 'Alderson Disk',
    type: 'Alderson Disk',
    tier: 1,
    maxTier: 6,
    rank: 'SSS',
    rarity: 'Universal',
    constructionProgress: 0,
    isComplete: false,
    effects: {
      populationCapacity: 1000000000000,
      productionBonus: 1000,
      researchBonus: 500,
      specialEffect: 'Provides habitable surface area equivalent to billions of Earths'
    },
    requirements: {
      technologies: ['Megastructure Engineering', 'Artificial Gravity', 'Stellar Manipulation'],
      resources: {
        metal: 10000000000,
        crystal: 8000000000,
        deuterium: 5000000000,
        darkMatter: 1000000
      },
      time: 94608000
    },
    description: 'A massive disk of habitable material orbiting a star, providing living space for quadrillions of beings.',
    lore: 'The Alderson Disk is even more ambitious than a Ring World. This colossal disk extends outward from a star, with both sides habitable. Its surface area is so vast that it could house the entire population of a galaxy. Construction requires the matter from thousands of planets and represents the ultimate achievement in habitat engineering.',
    benefits: [
      'Unlimited Population',
      'Galactic Superpower',
      'Perfect Living Conditions',
      'Industrial Dominance',
      'Cultural Center of Galaxy',
      'Scientific Paradise'
    ],
    constructionStages: [
      {
        stage: 1,
        name: 'Central Hub',
        progress: 0,
        requirements: {
          metal: 3333333333,
          crystal: 2666666667,
          deuterium: 1666666667,
          darkMatter: 333333
        }
      },
      {
        stage: 2,
        name: 'Disk Expansion',
        progress: 0,
        requirements: {
          metal: 3333333333,
          crystal: 2666666667,
          deuterium: 1666666667,
          darkMatter: 333333
        }
      },
      {
        stage: 3,
        name: 'Habitability Systems',
        progress: 0,
        requirements: {
          metal: 3333333334,
          crystal: 2666666666,
          deuterium: 1666666666,
          darkMatter: 333334
        }
      }
    ],
    maintenanceCost: {
      metal: 10000000,
      crystal: 8000000,
      deuterium: 5000000,
      darkMatter: 10000
    },
    powerRating: 200000000
  },
  {
    id: 'mega_8',
    name: 'Shkadov Thruster',
    type: 'Shkadov Thruster',
    tier: 1,
    maxTier: 5,
    rank: 'SS',
    rarity: 'Cosmic',
    constructionProgress: 0,
    isComplete: false,
    effects: {
      specialEffect: 'Moves the star system at 0.001c using stellar radiation pressure'
    },
    requirements: {
      technologies: ['Stellar Manipulation', 'Megastructure Engineering'],
      resources: {
        metal: 1000000000,
        crystal: 800000000,
        deuterium: 500000000,
        darkMatter: 50000
      },
      time: 31536000
    },
    description: 'A giant mirror that reflects a star\'s radiation to slowly propel the entire star system through space.',
    lore: 'The Shkadov Thruster is a simpler alternative to a full Stellar Engine. By constructing a massive mirror on one side of a star, the reflected radiation creates thrust, slowly accelerating the entire system. While slower than a Stellar Engine, it requires far fewer resources.',
    benefits: [
      'System Mobility',
      'Threat Avoidance',
      'Strategic Migration',
      'Lower Cost than Stellar Engine'
    ],
    constructionStages: [
      {
        stage: 1,
        name: 'Mirror Construction',
        progress: 0,
        requirements: {
          metal: 500000000,
          crystal: 400000000,
          deuterium: 250000000,
          darkMatter: 25000
        }
      },
      {
        stage: 2,
        name: 'Positioning System',
        progress: 0,
        requirements: {
          metal: 500000000,
          crystal: 400000000,
          deuterium: 250000000,
          darkMatter: 25000
        }
      }
    ],
    maintenanceCost: {
      metal: 1000000,
      crystal: 800000,
      deuterium: 500000,
      darkMatter: 500
    },
    powerRating: 10000000
  },
  {
    id: 'mega_9',
    name: 'Nicoll-Dyson Beam',
    type: 'Nicoll-Dyson Beam',
    tier: 1,
    maxTier: 8,
    rank: 'SSS',
    rarity: 'Universal',
    constructionProgress: 0,
    isComplete: false,
    effects: {
      defenseBonus: 1000,
      specialEffect: 'Can destroy planets and fleets across interstellar distances'
    },
    requirements: {
      technologies: ['Stellar Manipulation', 'Directed Energy Weapons', 'Megastructure Engineering'],
      resources: {
        metal: 4000000000,
        crystal: 6000000000,
        deuterium: 3000000000,
        darkMatter: 400000
      },
      time: 47304000
    },
    description: 'A weaponized Dyson sphere that focuses a star\'s entire energy output into a devastating beam weapon.',
    lore: 'The Nicoll-Dyson Beam is the ultimate weapon. By focusing the entire energy output of a star into a single beam, it can obliterate planets, fleets, and even other stars across light-years of space. No defense can withstand such power. Its mere existence serves as the ultimate deterrent.',
    benefits: [
      'Ultimate Weapon',
      'Interstellar Range',
      'Planet Destruction',
      'Fleet Annihilation',
      'Absolute Deterrent',
      'Galactic Dominance'
    ],
    constructionStages: [
      {
        stage: 1,
        name: 'Dyson Sphere Base',
        progress: 0,
        requirements: {
          metal: 1333333333,
          crystal: 2000000000,
          deuterium: 1000000000,
          darkMatter: 133333
        }
      },
      {
        stage: 2,
        name: 'Focusing Array',
        progress: 0,
        requirements: {
          metal: 1333333333,
          crystal: 2000000000,
          deuterium: 1000000000,
          darkMatter: 133333
        }
      },
      {
        stage: 3,
        name: 'Targeting System',
        progress: 0,
        requirements: {
          metal: 1333333334,
          crystal: 2000000000,
          deuterium: 1000000000,
          darkMatter: 133334
        }
      }
    ],
    maintenanceCost: {
      metal: 4000000,
      crystal: 6000000,
      deuterium: 3000000,
      darkMatter: 4000
    },
    powerRating: 500000000
  },
  {
    id: 'mega_10',
    name: 'Star Lifter',
    type: 'Star Lifter',
    tier: 1,
    maxTier: 10,
    rank: 'S',
    rarity: 'Mythic',
    constructionProgress: 0,
    isComplete: false,
    effects: {
      productionBonus: 500,
      specialEffect: 'Extracts matter directly from the star for construction projects'
    },
    requirements: {
      technologies: ['Stellar Manipulation', 'Magnetic Field Control', 'Megastructure Engineering'],
      resources: {
        metal: 500000000,
        crystal: 400000000,
        deuterium: 300000000,
        darkMatter: 50000
      },
      time: 15768000
    },
    description: 'A megastructure that uses powerful magnetic fields to extract matter from a star\'s corona for industrial use.',
    lore: 'The Star Lifter solves the ultimate resource problem by mining the star itself. Using powerful magnetic fields, it lifts matter from the star\'s surface, providing an essentially unlimited supply of hydrogen, helium, and heavier elements for construction projects.',
    benefits: [
      'Unlimited Resources',
      'Star Mining',
      'Fusion Fuel Production',
      'Heavy Element Extraction',
      'Self-Sustaining Industry'
    ],
    constructionStages: [
      {
        stage: 1,
        name: 'Magnetic Array',
        progress: 0,
        requirements: {
          metal: 250000000,
          crystal: 200000000,
          deuterium: 150000000,
          darkMatter: 25000
        }
      },
      {
        stage: 2,
        name: 'Collection System',
        progress: 0,
        requirements: {
          metal: 250000000,
          crystal: 200000000,
          deuterium: 150000000,
          darkMatter: 25000
        }
      }
    ],
    maintenanceCost: {
      metal: 500000,
      crystal: 400000,
      deuterium: 300000,
      darkMatter: 500
    },
    powerRating: 5000000
  }
];

export const getMegastructureByType = (type: MegastructureType): Megastructure | undefined => {
  return MEGASTRUCTURE_DATA.find(ms => ms.type === type);
};

export const getMegastructuresByRank = (rank: Rank): Megastructure[] => {
  return MEGASTRUCTURE_DATA.filter(ms => ms.rank === rank);
};

export const calculateMegastructureProgress = (megastructure: Megastructure): number => {
  const totalStages = megastructure.constructionStages.length;
  const completedProgress = megastructure.constructionStages.reduce((sum, stage) => sum + stage.progress, 0);
  return (completedProgress / totalStages) * 100;
};

export const getNextConstructionStage = (megastructure: Megastructure): typeof megastructure.constructionStages[0] | null => {
  return megastructure.constructionStages.find(stage => stage.progress < 100) || null;
};
