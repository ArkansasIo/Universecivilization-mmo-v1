import { Building } from './types';

export const militaryBuildings: Building[] = [
  // MILITARY BASE BUILDINGS
  {
    id: 'mil_base_001',
    name: 'Infantry Barracks',
    description: 'Training facility for ground troops and infantry units',
    lore: 'Where soldiers are forged into warriors, ready to defend your empire.',
    type: 'BPO',
    category: 'Military',
    subCategory: 'Ground Forces',
    class: 'Training Facility',
    rank: 'D',
    rarity: 'Uncommon',
    tier: 2,
    zone: 'Military',
    zoneSize: 6,
    adjacencyBonus: [
      { buildingType: 'Command Center', bonus: '+10% Training Speed' },
      { buildingType: 'Armory', bonus: '+15% Unit Strength' }
    ],
    baseStats: {
      capacity: 500,
      efficiency: 80,
      powerConsumption: 80,
      maintenanceCost: 3000,
      defenseRating: 50,
      employmentCapacity: 1000
    },
    requirements: {
      level: 5,
      technologies: ['Military Training'],
      buildings: []
    },
    constructionCosts: {
      igc: 250000,
      grc: 75000,
      materials: [
        { name: 'Tritanium', amount: 3000, tier: 1 },
        { name: 'Pyerite', amount: 2000, tier: 1 },
        { name: 'Mexallon', amount: 1000, tier: 2 }
      ],
      energy: 25000,
      buildTime: 1200
    },
    maxLevel: 15,
    upgrades: [],
    produces: [
      { resource: 'Infantry Units', amount: 50, interval: 3600 }
    ],
    consumes: [
      { resource: 'IGC', amount: 5000, interval: 3600 }
    ],
    specialAbilities: ['Train Infantry', 'Garrison Troops', 'Rapid Deployment'],
    image: 'https://readdy.ai/api/search-image?query=futuristic%20military%20barracks%20training%20facility%20soldiers%20marching%20grounds%20advanced%20equipment%20storage%20tactical%20operations%20center%20fortified%20structure%20military%20discipline%20organized%20layout&width=800&height=600&seq=mil001&orientation=landscape',
    icon: 'ri-shield-user-line',
    baseValue: 250000,
    marketValue: 275000,
    isUnique: false
  },
  {
    id: 'mil_base_002',
    name: 'Armored Vehicle Depot',
    description: 'Production and maintenance facility for tanks and armored vehicles',
    lore: 'Heavy armor rolls out from these depots, ready to crush any ground opposition.',
    type: 'BPO',
    category: 'Military',
    subCategory: 'Ground Forces',
    class: 'Vehicle Production',
    rank: 'C',
    rarity: 'Rare',
    tier: 5,
    zone: 'Military',
    zoneSize: 9,
    adjacencyBonus: [
      { buildingType: 'Repair Bay', bonus: '+20% Maintenance Speed' },
      { buildingType: 'Fuel Depot', bonus: '-15% Fuel Consumption' }
    ],
    baseStats: {
      capacity: 300,
      efficiency: 85,
      powerConsumption: 150,
      maintenanceCost: 8000,
      defenseRating: 100,
      productionRate: 50,
      storageCapacity: 200
    },
    requirements: {
      level: 15,
      technologies: ['Armored Warfare', 'Vehicle Engineering'],
      buildings: ['Infantry Barracks'],
      population: 5000
    },
    constructionCosts: {
      igc: 800000,
      grc: 240000,
      materials: [
        { name: 'Mexallon', amount: 8000, tier: 2 },
        { name: 'Isogen', amount: 5000, tier: 3 },
        { name: 'Nocxium', amount: 2000, tier: 4 }
      ],
      energy: 80000,
      buildTime: 2700
    },
    maxLevel: 18,
    upgrades: [],
    produces: [
      { resource: 'Tanks', amount: 10, interval: 7200 },
      { resource: 'APCs', amount: 20, interval: 7200 }
    ],
    consumes: [
      { resource: 'IGC', amount: 15000, interval: 3600 }
    ],
    specialAbilities: ['Vehicle Production', 'Armor Upgrades', 'Rapid Repair'],
    image: 'https://readdy.ai/api/search-image?query=futuristic%20armored%20vehicle%20depot%20military%20garage%20tanks%20production%20facility%20heavy%20machinery%20maintenance%20bays%20fortified%20hangar%20advanced%20combat%20vehicles%20assembly%20line%20military%20industrial%20complex&width=800&height=600&seq=mil002&orientation=landscape',
    icon: 'ri-truck-line',
    baseValue: 800000,
    marketValue: 880000,
    isUnique: false
  },
  {
    id: 'mil_base_003',
    name: 'Aerospace Command Center',
    description: 'Central hub for air and space force operations',
    lore: 'From here, you command the skies and the void beyond, coordinating aerial superiority.',
    type: 'BPO',
    category: 'Military',
    subCategory: 'Air Force',
    class: 'Command Facility',
    rank: 'B',
    rarity: 'Epic',
    tier: 10,
    zone: 'Military',
    zoneSize: 12,
    adjacencyBonus: [
      { buildingType: 'Radar Station', bonus: '+25% Detection Range' },
      { buildingType: 'Fighter Hangar', bonus: '+20% Sortie Rate' }
    ],
    baseStats: {
      capacity: 800,
      efficiency: 92,
      powerConsumption: 300,
      maintenanceCost: 25000,
      defenseRating: 200,
      shieldStrength: 5000,
      employmentCapacity: 2000
    },
    requirements: {
      level: 30,
      technologies: ['Aerospace Command', 'Advanced Radar', 'Fighter Tactics'],
      buildings: ['Armored Vehicle Depot'],
      population: 15000
    },
    constructionCosts: {
      igc: 3000000,
      grc: 900000,
      materials: [
        { name: 'Isogen', amount: 15000, tier: 3 },
        { name: 'Nocxium', amount: 10000, tier: 4 },
        { name: 'Zydrine', amount: 5000, tier: 4 },
        { name: 'Megacyte', amount: 2000, tier: 5 }
      ],
      energy: 200000,
      buildTime: 4800
    },
    maxLevel: 20,
    upgrades: [],
    specialAbilities: ['Air Superiority', 'Space Operations', 'Strategic Bombing', 'Intercept Missions'],
    uniqueEffects: ['Provides planet-wide air defense coverage'],
    image: 'https://readdy.ai/api/search-image?query=futuristic%20aerospace%20command%20center%20military%20control%20room%20holographic%20displays%20tactical%20screens%20air%20traffic%20control%20space%20operations%20hub%20advanced%20technology%20command%20staff%20strategic%20facility&width=800&height=600&seq=mil003&orientation=landscape',
    icon: 'ri-plane-line',
    baseValue: 3000000,
    marketValue: 3300000,
    isUnique: false,
    maxPerPlanet: 3
  },
  {
    id: 'mil_base_004',
    name: 'Naval Shipyard',
    description: 'Massive facility for constructing and maintaining naval vessels',
    lore: 'Where the great warships of your fleet are born, ready to rule the seas and oceans.',
    type: 'BPO',
    category: 'Military',
    subCategory: 'Naval Forces',
    class: 'Shipyard',
    rank: 'B',
    rarity: 'Epic',
    tier: 12,
    zone: 'Military',
    zoneSize: 16,
    adjacencyBonus: [
      { buildingType: 'Port', bonus: '+15% Construction Speed' },
      { buildingType: 'Dry Dock', bonus: '+20% Repair Efficiency' }
    ],
    baseStats: {
      capacity: 500,
      efficiency: 88,
      powerConsumption: 400,
      maintenanceCost: 30000,
      defenseRating: 150,
      productionRate: 30,
      storageCapacity: 100
    },
    requirements: {
      level: 28,
      technologies: ['Naval Engineering', 'Advanced Shipbuilding', 'Ocean Warfare'],
      buildings: ['Armored Vehicle Depot'],
      population: 12000
    },
    constructionCosts: {
      igc: 4000000,
      grc: 1200000,
      materials: [
        { name: 'Mexallon', amount: 20000, tier: 2 },
        { name: 'Isogen', amount: 15000, tier: 3 },
        { name: 'Nocxium', amount: 10000, tier: 4 },
        { name: 'Zydrine', amount: 5000, tier: 4 }
      ],
      energy: 300000,
      buildTime: 5400
    },
    maxLevel: 20,
    upgrades: [],
    produces: [
      { resource: 'Destroyers', amount: 2, interval: 14400 },
      { resource: 'Cruisers', amount: 1, interval: 21600 }
    ],
    consumes: [
      { resource: 'IGC', amount: 50000, interval: 3600 }
    ],
    specialAbilities: ['Ship Construction', 'Naval Repairs', 'Fleet Support'],
    image: 'https://readdy.ai/api/search-image?query=massive%20futuristic%20naval%20shipyard%20military%20docks%20warship%20construction%20facility%20enormous%20cranes%20dry%20docks%20ocean%20port%20advanced%20engineering%20complex%20ships%20under%20construction%20industrial%20maritime&width=800&height=600&seq=mil004&orientation=landscape',
    icon: 'ri-ship-2-line',
    baseValue: 4000000,
    marketValue: 4400000,
    isUnique: false,
    maxPerPlanet: 2
  },
  {
    id: 'mil_base_005',
    name: 'Missile Defense Battery',
    description: 'Advanced anti-missile and anti-aircraft defense system',
    lore: 'A shield against the sky, intercepting threats before they reach your cities.',
    type: 'BPO',
    category: 'Military',
    subCategory: 'Defense Systems',
    class: 'Air Defense',
    rank: 'C',
    rarity: 'Rare',
    tier: 8,
    zone: 'Military',
    zoneSize: 6,
    adjacencyBonus: [
      { buildingType: 'Radar Station', bonus: '+30% Intercept Rate' },
      { buildingType: 'Command Center', bonus: '+15% Response Time' }
    ],
    baseStats: {
      capacity: 200,
      efficiency: 90,
      powerConsumption: 200,
      maintenanceCost: 10000,
      defenseRating: 300,
      shieldStrength: 3000
    },
    requirements: {
      level: 20,
      technologies: ['Missile Defense', 'Tracking Systems', 'Interceptor Missiles'],
      buildings: ['Infantry Barracks']
    },
    constructionCosts: {
      igc: 1200000,
      grc: 360000,
      materials: [
        { name: 'Mexallon', amount: 10000, tier: 2 },
        { name: 'Isogen', amount: 7000, tier: 3 },
        { name: 'Nocxium', amount: 3000, tier: 4 }
      ],
      energy: 120000,
      buildTime: 3000
    },
    maxLevel: 18,
    upgrades: [],
    consumes: [
      { resource: 'Missiles', amount: 10, interval: 3600 },
      { resource: 'IGC', amount: 8000, interval: 3600 }
    ],
    specialAbilities: ['Missile Interception', 'Aircraft Defense', 'Area Protection'],
    uniqueEffects: ['Provides 5km radius air defense coverage'],
    image: 'https://readdy.ai/api/search-image?query=futuristic%20missile%20defense%20battery%20anti-aircraft%20system%20launch%20silos%20radar%20arrays%20defensive%20installation%20military%20fortification%20interceptor%20missiles%20advanced%20targeting%20systems%20protective%20shield&width=800&height=600&seq=mil005&orientation=landscape',
    icon: 'ri-rocket-line',
    baseValue: 1200000,
    marketValue: 1320000,
    isUnique: false
  },
  {
    id: 'mil_base_006',
    name: 'Special Forces Compound',
    description: 'Elite training facility for special operations units',
    lore: 'Where legends are made. Only the best of the best emerge from these halls.',
    type: 'BPO',
    category: 'Military',
    subCategory: 'Special Operations',
    class: 'Elite Training',
    rank: 'A',
    rarity: 'Legendary',
    tier: 15,
    zone: 'Military',
    zoneSize: 8,
    adjacencyBonus: [
      { buildingType: 'Intelligence Center', bonus: '+20% Mission Success' },
      { buildingType: 'Advanced Armory', bonus: '+25% Unit Effectiveness' }
    ],
    baseStats: {
      capacity: 200,
      efficiency: 95,
      powerConsumption: 150,
      maintenanceCost: 20000,
      defenseRating: 250,
      employmentCapacity: 500
    },
    requirements: {
      level: 40,
      technologies: ['Special Operations', 'Advanced Combat Training', 'Stealth Technology'],
      buildings: ['Infantry Barracks', 'Intelligence Center'],
      population: 25000
    },
    constructionCosts: {
      igc: 5000000,
      grc: 1500000,
      materials: [
        { name: 'Nocxium', amount: 15000, tier: 4 },
        { name: 'Zydrine', amount: 10000, tier: 4 },
        { name: 'Megacyte', amount: 5000, tier: 5 },
        { name: 'Morphite', amount: 2000, tier: 5 }
      ],
      energy: 250000,
      buildTime: 6000
    },
    maxLevel: 20,
    upgrades: [],
    produces: [
      { resource: 'Special Forces', amount: 10, interval: 10800 }
    ],
    consumes: [
      { resource: 'IGC', amount: 30000, interval: 3600 }
    ],
    specialAbilities: ['Elite Unit Training', 'Covert Operations', 'Sabotage Missions', 'Assassination'],
    uniqueEffects: ['Unlocks special operations missions'],
    image: 'https://readdy.ai/api/search-image?query=elite%20special%20forces%20compound%20military%20training%20facility%20covert%20operations%20center%20advanced%20combat%20training%20grounds%20stealth%20technology%20secure%20perimeter%20tactical%20excellence%20professional%20soldiers&width=800&height=600&seq=mil006&orientation=landscape',
    icon: 'ri-user-search-line',
    baseValue: 5000000,
    marketValue: 5500000,
    isUnique: false,
    maxPerPlanet: 2
  },
  {
    id: 'mil_base_007',
    name: 'Orbital Defense Platform',
    description: 'Space-based defense system protecting the planet from orbital threats',
    lore: 'The ultimate shield, standing guard in the void to protect your world from above.',
    type: 'BPO',
    category: 'Military',
    subCategory: 'Space Defense',
    class: 'Orbital Station',
    rank: 'S',
    rarity: 'Mythic',
    tier: 20,
    zone: 'Military',
    zoneSize: 20,
    adjacencyBonus: [
      { buildingType: 'Spaceport', bonus: '+15% Launch Efficiency' },
      { buildingType: 'Radar Station', bonus: '+30% Detection Range' }
    ],
    baseStats: {
      capacity: 1000,
      efficiency: 98,
      powerConsumption: 800,
      maintenanceCost: 100000,
      defenseRating: 1000,
      shieldStrength: 50000,
      armorRating: 10000
    },
    requirements: {
      level: 60,
      technologies: ['Orbital Defense', 'Space Warfare', 'Advanced Shields', 'Plasma Weapons'],
      buildings: ['Aerospace Command Center', 'Missile Defense Battery'],
      population: 50000
    },
    constructionCosts: {
      igc: 25000000,
      grc: 7500000,
      materials: [
        { name: 'Zydrine', amount: 50000, tier: 4 },
        { name: 'Megacyte', amount: 30000, tier: 5 },
        { name: 'Morphite', amount: 15000, tier: 5 }
      ],
      energy: 1000000,
      buildTime: 10800
    },
    maxLevel: 25,
    upgrades: [],
    consumes: [
      { resource: 'IGC', amount: 150000, interval: 3600 },
      { resource: 'GRC', amount: 50000, interval: 3600 }
    ],
    specialAbilities: ['Orbital Strike', 'Planet Shield', 'Space Superiority', 'Anti-Ship Weapons'],
    uniqueEffects: ['Provides complete orbital defense coverage', 'Can engage enemy fleets in orbit'],
    image: 'https://readdy.ai/api/search-image?query=massive%20orbital%20defense%20platform%20space%20station%20weapons%20array%20planet%20protection%20system%20advanced%20technology%20floating%20fortress%20energy%20shields%20weapon%20batteries%20space%20warfare%20installation&width=800&height=600&seq=mil007&orientation=landscape',
    icon: 'ri-space-ship-line',
    baseValue: 25000000,
    marketValue: 27500000,
    isUnique: false,
    maxPerPlanet: 3
  },
  {
    id: 'mil_base_008',
    name: 'Strategic Command Bunker',
    description: 'Heavily fortified underground command center for military operations',
    lore: 'Deep beneath the surface, protected from any attack, your military leadership commands the war.',
    type: 'BPO',
    category: 'Military',
    subCategory: 'Command',
    class: 'Command Bunker',
    rank: 'A',
    rarity: 'Legendary',
    tier: 18,
    zone: 'Military',
    zoneSize: 10,
    adjacencyBonus: [
      { buildingType: 'Communications Array', bonus: '+25% Command Range' },
      { buildingType: 'Power Plant', bonus: '+20% Uptime' }
    ],
    baseStats: {
      capacity: 500,
      efficiency: 96,
      powerConsumption: 250,
      maintenanceCost: 40000,
      defenseRating: 800,
      armorRating: 5000,
      employmentCapacity: 1000
    },
    requirements: {
      level: 45,
      technologies: ['Underground Construction', 'Strategic Command', 'Hardened Facilities'],
      buildings: ['Aerospace Command Center'],
      population: 30000
    },
    constructionCosts: {
      igc: 8000000,
      grc: 2400000,
      materials: [
        { name: 'Isogen', amount: 25000, tier: 3 },
        { name: 'Nocxium', amount: 20000, tier: 4 },
        { name: 'Zydrine', amount: 15000, tier: 4 },
        { name: 'Megacyte', amount: 8000, tier: 5 }
      ],
      energy: 400000,
      buildTime: 7200
    },
    maxLevel: 20,
    upgrades: [],
    specialAbilities: ['Strategic Planning', 'Military Coordination', 'Nuclear Hardened', 'Emergency Command'],
    uniqueEffects: ['Survives any attack', 'Provides +50% to all military unit effectiveness'],
    image: 'https://readdy.ai/api/search-image?query=underground%20strategic%20command%20bunker%20fortified%20military%20headquarters%20reinforced%20concrete%20blast%20doors%20command%20center%20war%20room%20tactical%20displays%20secure%20facility%20hardened%20structure&width=800&height=600&seq=mil008&orientation=landscape',
    icon: 'ri-shield-star-line',
    baseValue: 8000000,
    marketValue: 8800000,
    isUnique: true,
    maxPerPlanet: 1
  },
  {
    id: 'mil_base_009',
    name: 'Military Academy',
    description: 'Premier institution for training military officers and leaders',
    lore: 'Where strategy is taught and leaders are born. The finest military minds graduate from here.',
    type: 'BPO',
    category: 'Military',
    subCategory: 'Education',
    class: 'Training Academy',
    rank: 'B',
    rarity: 'Epic',
    tier: 12,
    zone: 'Military',
    zoneSize: 10,
    adjacencyBonus: [
      { buildingType: 'Library', bonus: '+15% Training Speed' },
      { buildingType: 'Simulation Center', bonus: '+20% Officer Quality' }
    ],
    baseStats: {
      capacity: 1000,
      efficiency: 90,
      powerConsumption: 180,
      maintenanceCost: 15000,
      employmentCapacity: 500
    },
    requirements: {
      level: 25,
      technologies: ['Military Education', 'Leadership Training', 'Tactical Studies'],
      buildings: ['Infantry Barracks'],
      population: 10000
    },
    constructionCosts: {
      igc: 2500000,
      grc: 750000,
      materials: [
        { name: 'Mexallon', amount: 12000, tier: 2 },
        { name: 'Isogen', amount: 8000, tier: 3 },
        { name: 'Nocxium', amount: 4000, tier: 4 }
      ],
      energy: 150000,
      buildTime: 4200
    },
    maxLevel: 18,
    upgrades: [],
    produces: [
      { resource: 'Officers', amount: 20, interval: 7200 }
    ],
    consumes: [
      { resource: 'IGC', amount: 20000, interval: 3600 }
    ],
    specialAbilities: ['Officer Training', 'Leadership Development', 'Tactical Education'],
    uniqueEffects: ['Improves all military unit performance by 15%'],
    image: 'https://readdy.ai/api/search-image?query=prestigious%20military%20academy%20training%20institution%20officer%20education%20facility%20parade%20grounds%20lecture%20halls%20tactical%20classrooms%20professional%20military%20education%20leadership%20development%20campus&width=800&height=600&seq=mil009&orientation=landscape',
    icon: 'ri-medal-line',
    baseValue: 2500000,
    marketValue: 2750000,
    isUnique: false,
    maxPerPlanet: 2
  },
  {
    id: 'mil_base_010',
    name: 'Weapons Research Facility',
    description: 'Advanced laboratory developing next-generation military technology',
    lore: 'Where the weapons of tomorrow are created today. Innovation meets destruction.',
    type: 'BPO',
    category: 'Military',
    subCategory: 'Research',
    class: 'R&D Facility',
    rank: 'A',
    rarity: 'Legendary',
    tier: 16,
    zone: 'Military',
    zoneSize: 12,
    adjacencyBonus: [
      { buildingType: 'Science Lab', bonus: '+25% Research Speed' },
      { buildingType: 'Testing Range', bonus: '+20% Development Efficiency' }
    ],
    baseStats: {
      capacity: 400,
      efficiency: 94,
      powerConsumption: 350,
      maintenanceCost: 35000,
      researchPoints: 500,
      technologyBonus: 30,
      employmentCapacity: 800
    },
    requirements: {
      level: 38,
      technologies: ['Weapons Research', 'Advanced Physics', 'Materials Science'],
      buildings: ['Military Academy'],
      population: 20000
    },
    constructionCosts: {
      igc: 6000000,
      grc: 1800000,
      materials: [
        { name: 'Isogen', amount: 20000, tier: 3 },
        { name: 'Nocxium', amount: 15000, tier: 4 },
        { name: 'Zydrine', amount: 10000, tier: 4 },
        { name: 'Megacyte', amount: 5000, tier: 5 }
      ],
      energy: 300000,
      buildTime: 6600
    },
    maxLevel: 20,
    upgrades: [],
    produces: [
      { resource: 'Research Points', amount: 500, interval: 3600 }
    ],
    consumes: [
      { resource: 'IGC', amount: 40000, interval: 3600 },
      { resource: 'GRC', amount: 15000, interval: 3600 }
    ],
    specialAbilities: ['Weapons Development', 'Technology Research', 'Prototype Testing'],
    uniqueEffects: ['Unlocks advanced military technologies', '+20% weapon damage empire-wide'],
    image: 'https://readdy.ai/api/search-image?query=advanced%20weapons%20research%20facility%20military%20laboratory%20experimental%20technology%20development%20testing%20chambers%20scientists%20working%20prototype%20weapons%20high-tech%20equipment%20secure%20research%20complex&width=800&height=600&seq=mil010&orientation=landscape',
    icon: 'ri-flask-line',
    baseValue: 6000000,
    marketValue: 6600000,
    isUnique: false,
    maxPerPlanet: 2
  }
];