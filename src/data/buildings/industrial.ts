import { Building } from './types';

export const industrialBuildings: Building[] = [
  // MINING & EXTRACTION
  {
    id: 'ind_min_001',
    name: 'Automated Mining Complex',
    description: 'Advanced mining facility extracting raw materials from the planet',
    lore: 'Tireless machines dig deep into the planet, extracting the resources that fuel your empire.',
    type: 'BPO',
    category: 'Industrial',
    subCategory: 'Mining',
    class: 'Resource Extraction',
    rank: 'D',
    rarity: 'Uncommon',
    tier: 2,
    zone: 'Industrial',
    zoneSize: 8,
    adjacencyBonus: [
      { buildingType: 'Refinery', bonus: '+15% Processing Speed' },
      { buildingType: 'Storage Depot', bonus: '+20% Storage Capacity' }
    ],
    baseStats: {
      capacity: 500,
      efficiency: 82,
      powerConsumption: 200,
      maintenanceCost: 5000,
      productionRate: 500,
      storageCapacity: 10000,
      employmentCapacity: 300,
      pollution: 30
    },
    requirements: {
      level: 8,
      technologies: ['Automated Mining'],
      buildings: []
    },
    constructionCosts: {
      igc: 300000,
      grc: 90000,
      materials: [
        { name: 'Tritanium', amount: 4000, tier: 1 },
        { name: 'Pyerite', amount: 3000, tier: 1 },
        { name: 'Mexallon', amount: 1500, tier: 2 }
      ],
      energy: 30000,
      buildTime: 1500
    },
    maxLevel: 15,
    upgrades: [],
    produces: [
      { resource: 'Tritanium', amount: 300, interval: 3600 },
      { resource: 'Pyerite', amount: 200, interval: 3600 },
      { resource: 'Mexallon', amount: 100, interval: 3600 }
    ],
    consumes: [
      { resource: 'IGC', amount: 8000, interval: 3600 }
    ],
    specialAbilities: ['Automated Extraction', 'Deep Mining', 'Resource Scanning'],
    image: 'https://readdy.ai/api/search-image?query=futuristic%20automated%20mining%20complex%20industrial%20facility%20robotic%20excavators%20ore%20extraction%20machinery%20conveyor%20systems%20processing%20equipment%20massive%20scale%20mining%20operations%20industrial%20landscape&width=800&height=600&seq=ind001&orientation=landscape',
    icon: 'ri-hammer-line',
    baseValue: 300000,
    marketValue: 330000,
    isUnique: false
  },
  {
    id: 'ind_min_002',
    name: 'Deep Core Excavator',
    description: 'Massive drilling facility reaching deep into the planetary core',
    lore: 'Piercing through kilometers of rock to reach the richest deposits, these excavators are engineering marvels.',
    type: 'BPO',
    category: 'Industrial',
    subCategory: 'Mining',
    class: 'Deep Mining',
    rank: 'B',
    rarity: 'Epic',
    tier: 10,
    zone: 'Industrial',
    zoneSize: 12,
    adjacencyBonus: [
      { buildingType: 'Geothermal Plant', bonus: '+20% Energy Efficiency' },
      { buildingType: 'Advanced Refinery', bonus: '+25% Yield' }
    ],
    baseStats: {
      capacity: 1000,
      efficiency: 90,
      powerConsumption: 500,
      maintenanceCost: 20000,
      productionRate: 2000,
      storageCapacity: 50000,
      employmentCapacity: 800,
      pollution: 50
    },
    requirements: {
      level: 30,
      technologies: ['Deep Core Mining', 'Advanced Drilling', 'Seismic Analysis'],
      buildings: ['Automated Mining Complex'],
      population: 15000
    },
    constructionCosts: {
      igc: 3500000,
      grc: 1050000,
      materials: [
        { name: 'Isogen', amount: 15000, tier: 3 },
        { name: 'Nocxium', amount: 10000, tier: 4 },
        { name: 'Zydrine', amount: 5000, tier: 4 }
      ],
      energy: 250000,
      buildTime: 5400
    },
    maxLevel: 20,
    upgrades: [],
    produces: [
      { resource: 'Isogen', amount: 500, interval: 3600 },
      { resource: 'Nocxium', amount: 300, interval: 3600 },
      { resource: 'Zydrine', amount: 150, interval: 3600 }
    ],
    consumes: [
      { resource: 'IGC', amount: 30000, interval: 3600 }
    ],
    specialAbilities: ['Deep Core Access', 'Rare Material Extraction', 'Seismic Stabilization'],
    uniqueEffects: ['Unlocks rare material deposits'],
    image: 'https://readdy.ai/api/search-image?query=massive%20deep%20core%20excavator%20enormous%20drilling%20facility%20planetary%20mining%20operation%20gigantic%20machinery%20reaching%20into%20planet%20core%20industrial%20marvel%20engineering%20achievement%20extreme%20depth%20mining&width=800&height=600&seq=ind002&orientation=landscape',
    icon: 'ri-tools-line',
    baseValue: 3500000,
    marketValue: 3850000,
    isUnique: false,
    maxPerPlanet: 3
  },

  // MANUFACTURING & PRODUCTION
  {
    id: 'ind_man_001',
    name: 'Component Factory',
    description: 'Manufacturing facility producing basic components and parts',
    lore: 'The building blocks of your industrial empire are assembled here with precision.',
    type: 'BPO',
    category: 'Industrial',
    subCategory: 'Manufacturing',
    class: 'Basic Production',
    rank: 'D',
    rarity: 'Uncommon',
    tier: 3,
    zone: 'Industrial',
    zoneSize: 6,
    adjacencyBonus: [
      { buildingType: 'Warehouse', bonus: '+15% Storage' },
      { buildingType: 'Assembly Plant', bonus: '+10% Production Speed' }
    ],
    baseStats: {
      capacity: 400,
      efficiency: 80,
      powerConsumption: 150,
      maintenanceCost: 4000,
      productionRate: 300,
      processingSpeed: 100,
      employmentCapacity: 600
    },
    requirements: {
      level: 10,
      technologies: ['Manufacturing'],
      buildings: []
    },
    constructionCosts: {
      igc: 400000,
      grc: 120000,
      materials: [
        { name: 'Tritanium', amount: 5000, tier: 1 },
        { name: 'Mexallon', amount: 3000, tier: 2 }
      ],
      energy: 40000,
      buildTime: 1800
    },
    maxLevel: 15,
    upgrades: [],
    produces: [
      { resource: 'Components', amount: 300, interval: 3600 }
    ],
    consumes: [
      { resource: 'Tritanium', amount: 200, interval: 3600 },
      { resource: 'IGC', amount: 6000, interval: 3600 }
    ],
    specialAbilities: ['Component Production', 'Quality Control', 'Batch Processing'],
    image: 'https://readdy.ai/api/search-image?query=futuristic%20component%20factory%20manufacturing%20facility%20assembly%20lines%20robotic%20arms%20production%20machinery%20automated%20systems%20industrial%20interior%20clean%20organized%20efficient%20operations&width=800&height=600&seq=ind003&orientation=landscape',
    icon: 'ri-settings-3-line',
    baseValue: 400000,
    marketValue: 440000,
    isUnique: false
  },
  {
    id: 'ind_man_002',
    name: 'Advanced Assembly Plant',
    description: 'High-tech facility assembling complex machinery and equipment',
    lore: 'Where raw materials become sophisticated technology through advanced manufacturing processes.',
    type: 'BPO',
    category: 'Industrial',
    subCategory: 'Manufacturing',
    class: 'Advanced Production',
    rank: 'C',
    rarity: 'Rare',
    tier: 8,
    zone: 'Industrial',
    zoneSize: 10,
    adjacencyBonus: [
      { buildingType: 'Research Lab', bonus: '+20% Innovation' },
      { buildingType: 'Quality Control Center', bonus: '+15% Product Quality' }
    ],
    baseStats: {
      capacity: 600,
      efficiency: 88,
      powerConsumption: 300,
      maintenanceCost: 12000,
      productionRate: 800,
      processingSpeed: 150,
      employmentCapacity: 1200
    },
    requirements: {
      level: 22,
      technologies: ['Advanced Manufacturing', 'Robotics', 'Precision Engineering'],
      buildings: ['Component Factory'],
      population: 8000
    },
    constructionCosts: {
      igc: 1500000,
      grc: 450000,
      materials: [
        { name: 'Mexallon', amount: 10000, tier: 2 },
        { name: 'Isogen', amount: 7000, tier: 3 },
        { name: 'Nocxium', amount: 3000, tier: 4 }
      ],
      energy: 120000,
      buildTime: 3600
    },
    maxLevel: 18,
    upgrades: [],
    produces: [
      { resource: 'Advanced Components', amount: 200, interval: 3600 },
      { resource: 'Equipment', amount: 100, interval: 3600 }
    ],
    consumes: [
      { resource: 'Components', amount: 300, interval: 3600 },
      { resource: 'IGC', amount: 18000, interval: 3600 }
    ],
    specialAbilities: ['Complex Assembly', 'Automated Production', 'Quality Assurance'],
    image: 'https://readdy.ai/api/search-image?query=advanced%20assembly%20plant%20high-tech%20manufacturing%20facility%20sophisticated%20robotics%20precision%20machinery%20automated%20assembly%20lines%20clean%20room%20environment%20advanced%20technology%20production%20complex&width=800&height=600&seq=ind004&orientation=landscape',
    icon: 'ri-cpu-line',
    baseValue: 1500000,
    marketValue: 1650000,
    isUnique: false
  },
  {
    id: 'ind_man_003',
    name: 'Nano-Fabrication Plant',
    description: 'Cutting-edge facility using nanotechnology for molecular-level manufacturing',
    lore: 'Building from atoms up, this plant represents the pinnacle of manufacturing technology.',
    type: 'BPO',
    category: 'Industrial',
    subCategory: 'Manufacturing',
    class: 'Nano Production',
    rank: 'A',
    rarity: 'Legendary',
    tier: 16,
    zone: 'Industrial',
    zoneSize: 14,
    adjacencyBonus: [
      { buildingType: 'Quantum Lab', bonus: '+30% Precision' },
      { buildingType: 'Clean Room', bonus: '+25% Quality' }
    ],
    baseStats: {
      capacity: 1000,
      efficiency: 96,
      powerConsumption: 600,
      maintenanceCost: 40000,
      productionRate: 2000,
      processingSpeed: 300,
      employmentCapacity: 1500
    },
    requirements: {
      level: 45,
      technologies: ['Nanotechnology', 'Molecular Engineering', 'Quantum Manufacturing'],
      buildings: ['Advanced Assembly Plant'],
      population: 30000
    },
    constructionCosts: {
      igc: 8000000,
      grc: 2400000,
      materials: [
        { name: 'Nocxium', amount: 20000, tier: 4 },
        { name: 'Zydrine', amount: 15000, tier: 4 },
        { name: 'Megacyte', amount: 10000, tier: 5 },
        { name: 'Morphite', amount: 5000, tier: 5 }
      ],
      energy: 500000,
      buildTime: 7200
    },
    maxLevel: 20,
    upgrades: [],
    produces: [
      { resource: 'Nano-Materials', amount: 500, interval: 3600 },
      { resource: 'Advanced Equipment', amount: 200, interval: 3600 }
    ],
    consumes: [
      { resource: 'Advanced Components', amount: 400, interval: 3600 },
      { resource: 'IGC', amount: 60000, interval: 3600 }
    ],
    specialAbilities: ['Molecular Assembly', 'Nano-Precision', 'Perfect Quality Control'],
    uniqueEffects: ['Produces highest quality items', '+50% production efficiency empire-wide'],
    image: 'https://readdy.ai/api/search-image?query=nano-fabrication%20plant%20molecular%20manufacturing%20facility%20quantum%20precision%20technology%20microscopic%20assembly%20clean%20sterile%20environment%20advanced%20nanotechnology%20futuristic%20production%20cutting-edge%20science&width=800&height=600&seq=ind005&orientation=landscape',
    icon: 'ri-microscope-line',
    baseValue: 8000000,
    marketValue: 8800000,
    isUnique: false,
    maxPerPlanet: 2
  },

  // REFINING & PROCESSING
  {
    id: 'ind_ref_001',
    name: 'Material Refinery',
    description: 'Processing facility refining raw materials into usable resources',
    lore: 'Transforming crude ore into refined materials, the foundation of all production.',
    type: 'BPO',
    category: 'Industrial',
    subCategory: 'Refining',
    class: 'Basic Processing',
    rank: 'D',
    rarity: 'Uncommon',
    tier: 2,
    zone: 'Industrial',
    zoneSize: 8,
    adjacencyBonus: [
      { buildingType: 'Mining Complex', bonus: '+15% Processing Speed' },
      { buildingType: 'Storage Facility', bonus: '+20% Throughput' }
    ],
    baseStats: {
      capacity: 600,
      efficiency: 85,
      powerConsumption: 180,
      maintenanceCost: 4500,
      processingSpeed: 200,
      storageCapacity: 15000,
      employmentCapacity: 400,
      pollution: 40
    },
    requirements: {
      level: 7,
      technologies: ['Refining'],
      buildings: []
    },
    constructionCosts: {
      igc: 350000,
      grc: 105000,
      materials: [
        { name: 'Tritanium', amount: 4500, tier: 1 },
        { name: 'Pyerite', amount: 3500, tier: 1 }
      ],
      energy: 35000,
      buildTime: 1350
    },
    maxLevel: 15,
    upgrades: [],
    produces: [
      { resource: 'Refined Materials', amount: 400, interval: 3600 }
    ],
    consumes: [
      { resource: 'Raw Ore', amount: 600, interval: 3600 },
      { resource: 'IGC', amount: 7000, interval: 3600 }
    ],
    specialAbilities: ['Material Refining', 'Waste Reduction', 'Quality Enhancement'],
    image: 'https://readdy.ai/api/search-image?query=futuristic%20material%20refinery%20industrial%20processing%20facility%20smelting%20operations%20chemical%20processing%20pipes%20tanks%20machinery%20refining%20equipment%20industrial%20complex%20metal%20processing&width=800&height=600&seq=ind006&orientation=landscape',
    icon: 'ri-fire-line',
    baseValue: 350000,
    marketValue: 385000,
    isUnique: false
  },
  {
    id: 'ind_ref_002',
    name: 'Chemical Processing Plant',
    description: 'Advanced facility producing chemicals and synthetic materials',
    lore: 'Where chemistry meets industry, creating the exotic materials needed for advanced technology.',
    type: 'BPO',
    category: 'Industrial',
    subCategory: 'Refining',
    class: 'Chemical Production',
    rank: 'C',
    rarity: 'Rare',
    tier: 9,
    zone: 'Industrial',
    zoneSize: 10,
    adjacencyBonus: [
      { buildingType: 'Research Lab', bonus: '+20% Formula Efficiency' },
      { buildingType: 'Waste Treatment', bonus: '-30% Pollution' }
    ],
    baseStats: {
      capacity: 800,
      efficiency: 87,
      powerConsumption: 350,
      maintenanceCost: 15000,
      processingSpeed: 300,
      productionRate: 500,
      employmentCapacity: 700,
      pollution: 60
    },
    requirements: {
      level: 24,
      technologies: ['Chemical Engineering', 'Synthetic Materials', 'Industrial Chemistry'],
      buildings: ['Material Refinery'],
      population: 10000
    },
    constructionCosts: {
      igc: 2000000,
      grc: 600000,
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
      { resource: 'Chemicals', amount: 300, interval: 3600 },
      { resource: 'Synthetic Materials', amount: 200, interval: 3600 }
    ],
    consumes: [
      { resource: 'Refined Materials', amount: 400, interval: 3600 },
      { resource: 'IGC', amount: 22000, interval: 3600 }
    ],
    specialAbilities: ['Chemical Synthesis', 'Material Creation', 'Pollution Control'],
    image: 'https://readdy.ai/api/search-image?query=chemical%20processing%20plant%20industrial%20facility%20complex%20piping%20systems%20reaction%20chambers%20distillation%20towers%20chemical%20production%20synthetic%20materials%20manufacturing%20industrial%20chemistry&width=800&height=600&seq=ind007&orientation=landscape',
    icon: 'ri-test-tube-line',
    baseValue: 2000000,
    marketValue: 2200000,
    isUnique: false
  },

  // ENERGY PRODUCTION
  {
    id: 'ind_ene_001',
    name: 'Fusion Power Plant',
    description: 'Clean fusion reactor providing massive amounts of energy',
    lore: 'Harnessing the power of stars, these reactors light up your cities and power your industry.',
    type: 'BPO',
    category: 'Industrial',
    subCategory: 'Energy',
    class: 'Power Generation',
    rank: 'C',
    rarity: 'Rare',
    tier: 6,
    zone: 'Industrial',
    zoneSize: 10,
    adjacencyBonus: [
      { buildingType: 'Research Lab', bonus: '+15% Efficiency' },
      { buildingType: 'Cooling Tower', bonus: '+10% Output' }
    ],
    baseStats: {
      capacity: 1000,
      efficiency: 92,
      powerConsumption: 100,
      powerGeneration: 5000,
      maintenanceCost: 10000,
      employmentCapacity: 500,
      pollution: 5
    },
    requirements: {
      level: 18,
      technologies: ['Fusion Power', 'Plasma Containment', 'Energy Systems'],
      buildings: []
    },
    constructionCosts: {
      igc: 1800000,
      grc: 540000,
      materials: [
        { name: 'Mexallon', amount: 10000, tier: 2 },
        { name: 'Isogen', amount: 8000, tier: 3 },
        { name: 'Nocxium', amount: 5000, tier: 4 }
      ],
      energy: 100000,
      buildTime: 3900
    },
    maxLevel: 20,
    upgrades: [],
    produces: [
      { resource: 'Energy', amount: 5000, interval: 3600 }
    ],
    consumes: [
      { resource: 'Fuel', amount: 100, interval: 3600 },
      { resource: 'IGC', amount: 15000, interval: 3600 }
    ],
    specialAbilities: ['Clean Energy', 'High Output', 'Stable Power'],
    uniqueEffects: ['Provides power to entire industrial zone'],
    image: 'https://readdy.ai/api/search-image?query=fusion%20power%20plant%20futuristic%20energy%20facility%20glowing%20reactor%20core%20plasma%20containment%20clean%20energy%20production%20advanced%20technology%20power%20generation%20industrial%20complex&width=800&height=600&seq=ind008&orientation=landscape',
    icon: 'ri-flashlight-line',
    baseValue: 1800000,
    marketValue: 1980000,
    isUnique: false
  },
  {
    id: 'ind_ene_002',
    name: 'Antimatter Reactor',
    description: 'Ultimate power source using matter-antimatter annihilation',
    lore: 'The most powerful energy source known, carefully containing the fury of annihilation.',
    type: 'BPO',
    category: 'Industrial',
    subCategory: 'Energy',
    class: 'Advanced Power',
    rank: 'S',
    rarity: 'Mythic',
    tier: 18,
    zone: 'Industrial',
    zoneSize: 16,
    adjacencyBonus: [
      { buildingType: 'Containment Field', bonus: '+25% Safety' },
      { buildingType: 'Power Grid', bonus: '+30% Distribution' }
    ],
    baseStats: {
      capacity: 5000,
      efficiency: 98,
      powerConsumption: 500,
      powerGeneration: 50000,
      maintenanceCost: 100000,
      employmentCapacity: 1000,
      pollution: 0
    },
    requirements: {
      level: 55,
      technologies: ['Antimatter Technology', 'Containment Fields', 'Advanced Physics'],
      buildings: ['Fusion Power Plant'],
      population: 40000
    },
    constructionCosts: {
      igc: 20000000,
      grc: 6000000,
      materials: [
        { name: 'Zydrine', amount: 40000, tier: 4 },
        { name: 'Megacyte', amount: 25000, tier: 5 },
        { name: 'Morphite', amount: 15000, tier: 5 }
      ],
      energy: 800000,
      buildTime: 9000
    },
    maxLevel: 25,
    upgrades: [],
    produces: [
      { resource: 'Energy', amount: 50000, interval: 3600 }
    ],
    consumes: [
      { resource: 'Antimatter', amount: 10, interval: 3600 },
      { resource: 'IGC', amount: 150000, interval: 3600 }
    ],
    specialAbilities: ['Massive Power Output', 'Zero Emissions', 'Emergency Shutdown'],
    uniqueEffects: ['Powers entire planet', 'Enables mega-structure construction'],
    image: 'https://readdy.ai/api/search-image?query=antimatter%20reactor%20ultimate%20power%20facility%20glowing%20energy%20core%20containment%20fields%20advanced%20technology%20massive%20scale%20futuristic%20energy%20production%20scientific%20marvel%20dangerous%20beauty&width=800&height=600&seq=ind009&orientation=landscape',
    icon: 'ri-lightbulb-line',
    baseValue: 20000000,
    marketValue: 22000000,
    isUnique: false,
    maxPerPlanet: 2
  },

  // STORAGE & LOGISTICS
  {
    id: 'ind_log_001',
    name: 'Cargo Hub',
    description: 'Central logistics facility managing resource distribution',
    lore: 'The beating heart of your supply chain, ensuring resources flow where needed.',
    type: 'BPO',
    category: 'Industrial',
    subCategory: 'Logistics',
    class: 'Distribution',
    rank: 'D',
    rarity: 'Uncommon',
    tier: 3,
    zone: 'Industrial',
    zoneSize: 8,
    adjacencyBonus: [
      { buildingType: 'Spaceport', bonus: '+20% Throughput' },
      { buildingType: 'Warehouse', bonus: '+25% Capacity' }
    ],
    baseStats: {
      capacity: 1000,
      efficiency: 85,
      powerConsumption: 120,
      maintenanceCost: 3500,
      storageCapacity: 50000,
      processingSpeed: 500,
      employmentCapacity: 800
    },
    requirements: {
      level: 12,
      technologies: ['Logistics'],
      buildings: []
    },
    constructionCosts: {
      igc: 450000,
      grc: 135000,
      materials: [
        { name: 'Tritanium', amount: 6000, tier: 1 },
        { name: 'Mexallon', amount: 3000, tier: 2 }
      ],
      energy: 45000,
      buildTime: 2100
    },
    maxLevel: 15,
    upgrades: [],
    specialAbilities: ['Resource Distribution', 'Automated Sorting', 'Fast Loading'],
    image: 'https://readdy.ai/api/search-image?query=futuristic%20cargo%20hub%20logistics%20center%20automated%20sorting%20systems%20conveyor%20belts%20warehouse%20facility%20distribution%20center%20organized%20storage%20industrial%20efficiency&width=800&height=600&seq=ind010&orientation=landscape',
    icon: 'ri-truck-line',
    baseValue: 450000,
    marketValue: 495000,
    isUnique: false
  }
];