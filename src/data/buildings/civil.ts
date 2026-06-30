import { Building } from './types';

export const civilBuildings: Building[] = [
  // RESIDENTIAL ZONE BUILDINGS
  {
    id: 'civil_res_001',
    name: 'Basic Housing Complex',
    description: 'Standard residential building providing housing for workers and families',
    lore: 'The foundation of any thriving colony, these complexes house the workforce that drives your empire forward.',
    type: 'BPO',
    category: 'Civil',
    subCategory: 'Residential',
    class: 'Housing',
    rank: 'E',
    rarity: 'Common',
    tier: 1,
    zone: 'Residential',
    zoneSize: 4,
    adjacencyBonus: [
      { buildingType: 'Park', bonus: '+10% Morale' },
      { buildingType: 'Medical Center', bonus: '+5% Health' }
    ],
    baseStats: {
      capacity: 100,
      efficiency: 80,
      powerConsumption: 50,
      maintenanceCost: 1000,
      housingCapacity: 500,
      populationGrowth: 5,
      morale: 60
    },
    requirements: {
      level: 1,
      technologies: [],
      buildings: []
    },
    constructionCosts: {
      igc: 50000,
      grc: 15000,
      materials: [
        { name: 'Tritanium', amount: 1000, tier: 1 },
        { name: 'Pyerite', amount: 500, tier: 1 }
      ],
      energy: 5000,
      buildTime: 300
    },
    maxLevel: 10,
    upgrades: [
      {
        level: 2,
        costs: {
          igc: 75000,
          grc: 22500,
          materials: [
            { name: 'Tritanium', amount: 1500, tier: 1 },
            { name: 'Mexallon', amount: 750, tier: 2 }
          ],
          energy: 7500,
          buildTime: 450
        },
        statsIncrease: {
          housingCapacity: 100,
          morale: 5,
          efficiency: 5
        }
      }
    ],
    specialAbilities: ['Population Growth Boost'],
    image: 'https://readdy.ai/api/search-image?query=futuristic%20residential%20housing%20complex%20with%20modern%20architecture%20sleek%20design%20glass%20facades%20green%20spaces%20integrated%20parks%20sustainable%20living%20quarters%20sci-fi%20cityscape%20urban%20development%20clean%20minimalist%20aesthetic&width=800&height=600&seq=civil001&orientation=landscape',
    icon: 'ri-home-4-line',
    baseValue: 50000,
    marketValue: 55000,
    isUnique: false
  },
  {
    id: 'civil_res_002',
    name: 'Luxury Apartments',
    description: 'High-end residential towers for wealthy citizens and executives',
    lore: 'Where the elite of your empire reside, these towers symbolize prosperity and attract high-value citizens.',
    type: 'BPO',
    category: 'Civil',
    subCategory: 'Residential',
    class: 'Premium Housing',
    rank: 'C',
    rarity: 'Rare',
    tier: 5,
    zone: 'Residential',
    zoneSize: 6,
    adjacencyBonus: [
      { buildingType: 'Shopping Mall', bonus: '+15% Tax Revenue' },
      { buildingType: 'Entertainment District', bonus: '+20% Morale' }
    ],
    baseStats: {
      capacity: 150,
      efficiency: 95,
      powerConsumption: 120,
      maintenanceCost: 5000,
      housingCapacity: 300,
      populationGrowth: 3,
      morale: 85,
      taxRevenue: 10000
    },
    requirements: {
      level: 15,
      technologies: ['Advanced Architecture', 'Luxury Materials'],
      buildings: ['Basic Housing Complex']
    },
    constructionCosts: {
      igc: 500000,
      grc: 150000,
      materials: [
        { name: 'Mexallon', amount: 5000, tier: 2 },
        { name: 'Isogen', amount: 2500, tier: 3 },
        { name: 'Nocxium', amount: 1000, tier: 4 }
      ],
      energy: 50000,
      buildTime: 1800
    },
    maxLevel: 15,
    upgrades: [],
    specialAbilities: ['Attracts Wealthy Citizens', 'High Tax Revenue'],
    image: 'https://readdy.ai/api/search-image?query=luxury%20futuristic%20apartment%20towers%20elegant%20design%20premium%20materials%20golden%20accents%20sophisticated%20architecture%20high-rise%20buildings%20wealthy%20district%20opulent%20living%20spaces%20advanced%20technology%20integration&width=800&height=600&seq=civil002&orientation=landscape',
    icon: 'ri-building-2-line',
    baseValue: 500000,
    marketValue: 550000,
    isUnique: false
  },
  {
    id: 'civil_res_003',
    name: 'Arcology Mega Tower',
    description: 'Self-contained vertical city housing thousands of residents',
    lore: 'A marvel of engineering, these mega structures are cities unto themselves, complete with all necessary amenities.',
    type: 'BPO',
    category: 'Civil',
    subCategory: 'Residential',
    class: 'Mega Structure',
    rank: 'S',
    rarity: 'Mythic',
    tier: 15,
    zone: 'Residential',
    zoneSize: 16,
    adjacencyBonus: [
      { buildingType: 'Transit Hub', bonus: '+25% Efficiency' },
      { buildingType: 'Power Plant', bonus: '-20% Power Consumption' }
    ],
    baseStats: {
      capacity: 500,
      efficiency: 98,
      powerConsumption: 500,
      maintenanceCost: 50000,
      housingCapacity: 10000,
      populationGrowth: 20,
      morale: 90,
      taxRevenue: 100000
    },
    requirements: {
      level: 50,
      technologies: ['Mega Structures', 'Advanced Life Support', 'Vertical Farming'],
      buildings: ['Luxury Apartments'],
      population: 50000
    },
    constructionCosts: {
      igc: 10000000,
      grc: 3000000,
      materials: [
        { name: 'Zydrine', amount: 50000, tier: 4 },
        { name: 'Megacyte', amount: 25000, tier: 5 },
        { name: 'Morphite', amount: 10000, tier: 5 }
      ],
      energy: 500000,
      buildTime: 7200
    },
    maxLevel: 20,
    upgrades: [],
    specialAbilities: ['Self-Sustaining', 'Massive Population Capacity', 'Internal Economy'],
    uniqueEffects: ['Reduces planet-wide housing shortage by 50%'],
    image: 'https://readdy.ai/api/search-image?query=massive%20arcology%20mega%20tower%20futuristic%20vertical%20city%20self-contained%20structure%20enormous%20scale%20thousands%20of%20levels%20integrated%20systems%20sky-piercing%20architecture%20advanced%20civilization%20monument%20to%20engineering&width=800&height=600&seq=civil003&orientation=landscape',
    icon: 'ri-building-4-line',
    baseValue: 10000000,
    marketValue: 11000000,
    isUnique: false,
    maxPerPlanet: 5
  },

  // COMMERCIAL ZONE BUILDINGS
  {
    id: 'civil_com_001',
    name: 'Shopping District',
    description: 'Commercial area with shops, restaurants, and services',
    lore: 'The economic heart of your colony, where citizens spend their credits and businesses thrive.',
    type: 'BPO',
    category: 'Civil',
    subCategory: 'Commercial',
    class: 'Retail',
    rank: 'D',
    rarity: 'Uncommon',
    tier: 2,
    zone: 'Commercial',
    zoneSize: 6,
    adjacencyBonus: [
      { buildingType: 'Residential', bonus: '+15% Tax Revenue' },
      { buildingType: 'Transit Hub', bonus: '+10% Customer Traffic' }
    ],
    baseStats: {
      capacity: 200,
      efficiency: 85,
      powerConsumption: 80,
      maintenanceCost: 2000,
      employmentCapacity: 500,
      taxRevenue: 5000,
      incomeGeneration: 15000,
      morale: 10
    },
    requirements: {
      level: 5,
      technologies: ['Commerce'],
      buildings: [],
      population: 1000
    },
    constructionCosts: {
      igc: 150000,
      grc: 45000,
      materials: [
        { name: 'Tritanium', amount: 2000, tier: 1 },
        { name: 'Pyerite', amount: 1500, tier: 1 },
        { name: 'Mexallon', amount: 500, tier: 2 }
      ],
      energy: 15000,
      buildTime: 600
    },
    maxLevel: 12,
    upgrades: [],
    produces: [
      { resource: 'IGC', amount: 15000, interval: 3600 }
    ],
    specialAbilities: ['Generates Tax Revenue', 'Boosts Morale'],
    image: 'https://readdy.ai/api/search-image?query=futuristic%20shopping%20district%20commercial%20zone%20bustling%20marketplace%20holographic%20advertisements%20neon%20signs%20retail%20stores%20restaurants%20entertainment%20venues%20vibrant%20atmosphere%20busy%20streets%20pedestrian%20areas&width=800&height=600&seq=civil004&orientation=landscape',
    icon: 'ri-store-2-line',
    baseValue: 150000,
    marketValue: 165000,
    isUnique: false
  },
  {
    id: 'civil_com_002',
    name: 'Galactic Trade Center',
    description: 'Major trading hub connecting your colony to interstellar markets',
    lore: 'Where fortunes are made and lost, this center handles billions in transactions daily.',
    type: 'BPO',
    category: 'Civil',
    subCategory: 'Commercial',
    class: 'Trade Hub',
    rank: 'B',
    rarity: 'Epic',
    tier: 10,
    zone: 'Commercial',
    zoneSize: 9,
    adjacencyBonus: [
      { buildingType: 'Starport', bonus: '+20% Trade Volume' },
      { buildingType: 'Banking Complex', bonus: '+15% Transaction Speed' }
    ],
    baseStats: {
      capacity: 500,
      efficiency: 92,
      powerConsumption: 200,
      maintenanceCost: 10000,
      employmentCapacity: 2000,
      taxRevenue: 50000,
      incomeGeneration: 150000,
      tradeBonus: 25
    },
    requirements: {
      level: 25,
      technologies: ['Interstellar Commerce', 'Advanced Trading Systems'],
      buildings: ['Shopping District', 'Starport'],
      population: 10000
    },
    constructionCosts: {
      igc: 2000000,
      grc: 600000,
      materials: [
        { name: 'Isogen', amount: 10000, tier: 3 },
        { name: 'Nocxium', amount: 5000, tier: 4 },
        { name: 'Zydrine', amount: 2000, tier: 4 }
      ],
      energy: 100000,
      buildTime: 3600
    },
    maxLevel: 18,
    upgrades: [],
    produces: [
      { resource: 'IGC', amount: 150000, interval: 3600 },
      { resource: 'GRC', amount: 50000, interval: 3600 }
    ],
    specialAbilities: ['Interstellar Trading', 'Market Access', 'Trade Route Hub'],
    uniqueEffects: ['Reduces all trade taxes by 10%'],
    image: 'https://readdy.ai/api/search-image?query=massive%20galactic%20trade%20center%20futuristic%20stock%20exchange%20holographic%20displays%20trading%20floors%20interstellar%20commerce%20hub%20financial%20district%20towering%20architecture%20data%20streams%20market%20activity&width=800&height=600&seq=civil005&orientation=landscape',
    icon: 'ri-exchange-line',
    baseValue: 2000000,
    marketValue: 2200000,
    isUnique: false,
    maxPerPlanet: 3
  },

  // ENTERTAINMENT ZONE BUILDINGS
  {
    id: 'civil_ent_001',
    name: 'Recreation Center',
    description: 'Sports facilities, gyms, and leisure activities for citizens',
    lore: 'Healthy citizens are productive citizens. These centers keep your population fit and happy.',
    type: 'BPO',
    category: 'Civil',
    subCategory: 'Entertainment',
    class: 'Recreation',
    rank: 'D',
    rarity: 'Uncommon',
    tier: 3,
    zone: 'Entertainment',
    zoneSize: 4,
    adjacencyBonus: [
      { buildingType: 'Residential', bonus: '+15% Morale' },
      { buildingType: 'Medical Center', bonus: '+10% Health' }
    ],
    baseStats: {
      capacity: 300,
      efficiency: 80,
      powerConsumption: 60,
      maintenanceCost: 1500,
      morale: 20,
      healthBonus: 10,
      crimeReduction: 5
    },
    requirements: {
      level: 8,
      technologies: ['Recreation Technology'],
      buildings: [],
      population: 2000
    },
    constructionCosts: {
      igc: 100000,
      grc: 30000,
      materials: [
        { name: 'Tritanium', amount: 1500, tier: 1 },
        { name: 'Mexallon', amount: 1000, tier: 2 }
      ],
      energy: 10000,
      buildTime: 450
    },
    maxLevel: 10,
    upgrades: [],
    specialAbilities: ['Morale Boost', 'Health Improvement', 'Crime Reduction'],
    image: 'https://readdy.ai/api/search-image?query=futuristic%20recreation%20center%20sports%20facilities%20advanced%20gym%20equipment%20holographic%20training%20areas%20swimming%20pools%20athletic%20fields%20leisure%20activities%20modern%20design%20healthy%20lifestyle&width=800&height=600&seq=civil006&orientation=landscape',
    icon: 'ri-basketball-line',
    baseValue: 100000,
    marketValue: 110000,
    isUnique: false
  },
  {
    id: 'civil_ent_002',
    name: 'Holographic Theater',
    description: 'Advanced entertainment venue with immersive holographic performances',
    lore: 'Experience art and entertainment like never before with full sensory holographic technology.',
    type: 'BPO',
    category: 'Civil',
    subCategory: 'Entertainment',
    class: 'Cultural',
    rank: 'C',
    rarity: 'Rare',
    tier: 7,
    zone: 'Entertainment',
    zoneSize: 6,
    adjacencyBonus: [
      { buildingType: 'Shopping District', bonus: '+10% Revenue' },
      { buildingType: 'Luxury Apartments', bonus: '+15% Morale' }
    ],
    baseStats: {
      capacity: 500,
      efficiency: 88,
      powerConsumption: 150,
      maintenanceCost: 5000,
      morale: 30,
      incomeGeneration: 20000,
      taxRevenue: 8000
    },
    requirements: {
      level: 18,
      technologies: ['Holographic Technology', 'Entertainment Systems'],
      buildings: ['Recreation Center'],
      population: 5000
    },
    constructionCosts: {
      igc: 750000,
      grc: 225000,
      materials: [
        { name: 'Mexallon', amount: 5000, tier: 2 },
        { name: 'Isogen', amount: 3000, tier: 3 },
        { name: 'Nocxium', amount: 1500, tier: 4 }
      ],
      energy: 75000,
      buildTime: 2400
    },
    maxLevel: 15,
    upgrades: [],
    produces: [
      { resource: 'IGC', amount: 20000, interval: 3600 }
    ],
    specialAbilities: ['Cultural Events', 'Tourism Attraction', 'Morale Boost'],
    image: 'https://readdy.ai/api/search-image?query=futuristic%20holographic%20theater%20immersive%20entertainment%20venue%20advanced%20projection%20technology%20cultural%20performances%20art%20displays%20sci-fi%20auditorium%20spectacular%20light%20shows%20holographic%20stage&width=800&height=600&seq=civil007&orientation=landscape',
    icon: 'ri-movie-2-line',
    baseValue: 750000,
    marketValue: 825000,
    isUnique: false
  },

  // GOVERNMENT ZONE BUILDINGS
  {
    id: 'civil_gov_001',
    name: 'Administrative Center',
    description: 'Central government building managing colony operations',
    lore: 'The bureaucratic heart of your colony, where policies are made and enforced.',
    type: 'BPO',
    category: 'Civil',
    subCategory: 'Government',
    class: 'Administration',
    rank: 'C',
    rarity: 'Rare',
    tier: 5,
    zone: 'Government',
    zoneSize: 8,
    adjacencyBonus: [
      { buildingType: 'Security Station', bonus: '+10% Crime Reduction' },
      { buildingType: 'Data Center', bonus: '+15% Efficiency' }
    ],
    baseStats: {
      capacity: 200,
      efficiency: 90,
      powerConsumption: 100,
      maintenanceCost: 5000,
      employmentCapacity: 500,
      taxRevenue: 10000,
      crimeReduction: 10
    },
    requirements: {
      level: 10,
      technologies: ['Government Systems'],
      buildings: [],
      population: 5000
    },
    constructionCosts: {
      igc: 500000,
      grc: 150000,
      materials: [
        { name: 'Mexallon', amount: 3000, tier: 2 },
        { name: 'Isogen', amount: 2000, tier: 3 }
      ],
      energy: 50000,
      buildTime: 1800
    },
    maxLevel: 15,
    upgrades: [],
    specialAbilities: ['Policy Management', 'Tax Collection', 'Law Enforcement'],
    uniqueEffects: ['Unlocks advanced government policies'],
    image: 'https://readdy.ai/api/search-image?query=futuristic%20government%20administrative%20center%20official%20building%20modern%20architecture%20authority%20symbol%20data%20management%20systems%20bureaucratic%20hub%20clean%20professional%20design%20imposing%20structure&width=800&height=600&seq=civil008&orientation=landscape',
    icon: 'ri-government-line',
    baseValue: 500000,
    marketValue: 550000,
    isUnique: true,
    maxPerPlanet: 1
  },

  // AGRICULTURAL ZONE BUILDINGS
  {
    id: 'civil_agr_001',
    name: 'Hydroponic Farm',
    description: 'Advanced farming facility producing food using hydroponic technology',
    lore: 'Feeding your empire with efficient, space-saving agricultural technology.',
    type: 'BPO',
    category: 'Civil',
    subCategory: 'Agricultural',
    class: 'Food Production',
    rank: 'D',
    rarity: 'Uncommon',
    tier: 2,
    zone: 'Agricultural',
    zoneSize: 6,
    adjacencyBonus: [
      { buildingType: 'Water Treatment', bonus: '+15% Production' },
      { buildingType: 'Power Plant', bonus: '-10% Energy Cost' }
    ],
    baseStats: {
      capacity: 400,
      efficiency: 85,
      powerConsumption: 100,
      maintenanceCost: 2000,
      productionRate: 1000,
      employmentCapacity: 200
    },
    requirements: {
      level: 5,
      technologies: ['Hydroponics'],
      buildings: []
    },
    constructionCosts: {
      igc: 200000,
      grc: 60000,
      materials: [
        { name: 'Tritanium', amount: 2500, tier: 1 },
        { name: 'Pyerite', amount: 2000, tier: 1 }
      ],
      energy: 20000,
      buildTime: 900
    },
    maxLevel: 12,
    upgrades: [],
    produces: [
      { resource: 'Food', amount: 1000, interval: 3600 }
    ],
    consumes: [
      { resource: 'Water', amount: 500, interval: 3600 }
    ],
    specialAbilities: ['Food Production', 'Efficient Farming'],
    image: 'https://readdy.ai/api/search-image?query=futuristic%20hydroponic%20farm%20vertical%20farming%20facility%20advanced%20agriculture%20technology%20green%20plants%20growing%20systems%20automated%20cultivation%20clean%20environment%20sustainable%20food%20production&width=800&height=600&seq=civil009&orientation=landscape',
    icon: 'ri-plant-line',
    baseValue: 200000,
    marketValue: 220000,
    isUnique: false
  },
  {
    id: 'civil_agr_002',
    name: 'Vertical Farm Tower',
    description: 'Massive vertical farming structure maximizing food production',
    lore: 'Reaching for the sky to feed millions, these towers are agricultural marvels.',
    type: 'BPO',
    category: 'Civil',
    subCategory: 'Agricultural',
    class: 'Mega Farm',
    rank: 'A',
    rarity: 'Legendary',
    tier: 12,
    zone: 'Agricultural',
    zoneSize: 12,
    adjacencyBonus: [
      { buildingType: 'Research Lab', bonus: '+20% Yield' },
      { buildingType: 'Distribution Center', bonus: '+15% Efficiency' }
    ],
    baseStats: {
      capacity: 2000,
      efficiency: 95,
      powerConsumption: 400,
      maintenanceCost: 20000,
      productionRate: 10000,
      employmentCapacity: 1000
    },
    requirements: {
      level: 35,
      technologies: ['Vertical Farming', 'Advanced Agriculture', 'Automated Systems'],
      buildings: ['Hydroponic Farm'],
      population: 20000
    },
    constructionCosts: {
      igc: 5000000,
      grc: 1500000,
      materials: [
        { name: 'Isogen', amount: 20000, tier: 3 },
        { name: 'Nocxium', amount: 10000, tier: 4 },
        { name: 'Zydrine', amount: 5000, tier: 4 }
      ],
      energy: 250000,
      buildTime: 5400
    },
    maxLevel: 20,
    upgrades: [],
    produces: [
      { resource: 'Food', amount: 10000, interval: 3600 }
    ],
    consumes: [
      { resource: 'Water', amount: 3000, interval: 3600 }
    ],
    specialAbilities: ['Mass Food Production', 'Automated Harvesting', 'Climate Control'],
    uniqueEffects: ['Eliminates food shortage for 50,000 population'],
    image: 'https://readdy.ai/api/search-image?query=massive%20vertical%20farm%20tower%20futuristic%20agriculture%20skyscraper%20automated%20farming%20systems%20green%20vegetation%20levels%20high-tech%20cultivation%20enormous%20scale%20food%20production%20marvel%20engineering%20achievement&width=800&height=600&seq=civil010&orientation=landscape',
    icon: 'ri-seedling-line',
    baseValue: 5000000,
    marketValue: 5500000,
    isUnique: false,
    maxPerPlanet: 5
  }
];