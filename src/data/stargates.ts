export interface Stargate {
  id: string;
  name: string;
  type: 'stargate' | 'jump_gate' | 'hyperspace_beacon';
  tier: number;
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Cosmic' | 'Universal';
  systemId: string;
  systemName: string;
  coordinates: {
    x: number;
    y: number;
    z: number;
  };
  status: 'active' | 'inactive' | 'damaged' | 'under_construction';
  connections: string[]; // Connected stargate IDs
  stats: {
    maxJumpRange: number; // Light years
    energyCost: number; // Energy per jump
    cooldown: number; // Seconds
    massLimit: number; // Maximum ship mass
    stabilityRating: number; // 0-100%
    securityLevel: number; // 0-10
  };
  requirements: {
    level: number;
    technology: string[];
    igc: number;
    grc: number;
  };
  features: {
    instantTravel: boolean;
    massTransit: boolean;
    militaryAccess: boolean;
    commercialAccess: boolean;
    privateAccess: boolean;
    tollRequired: boolean;
    tollAmount?: number;
  };
  ownership: {
    ownerId?: string;
    ownerName?: string;
    allianceId?: string;
    allianceName?: string;
    faction?: string;
  };
  traffic: {
    dailyJumps: number;
    weeklyJumps: number;
    totalJumps: number;
  };
  description: string;
  image: string;
}

export const stargates: Stargate[] = [
  // Tier 1 - Basic Stargates (E-D Rank)
  {
    id: 'sg_001',
    name: 'Sol Gateway Alpha',
    type: 'stargate',
    tier: 1,
    rank: 'E',
    rarity: 'Common',
    systemId: 'sys_sol',
    systemName: 'Sol System',
    coordinates: { x: 0, y: 0, z: 0 },
    status: 'active',
    connections: ['sg_002', 'sg_003'],
    stats: {
      maxJumpRange: 10,
      energyCost: 1000,
      cooldown: 60,
      massLimit: 10000,
      stabilityRating: 85,
      securityLevel: 8
    },
    requirements: {
      level: 1,
      technology: ['basic_ftl'],
      igc: 0,
      grc: 0
    },
    features: {
      instantTravel: true,
      massTransit: true,
      militaryAccess: true,
      commercialAccess: true,
      privateAccess: true,
      tollRequired: false
    },
    ownership: {
      faction: 'United Earth Federation'
    },
    traffic: {
      dailyJumps: 15420,
      weeklyJumps: 108940,
      totalJumps: 5847392
    },
    description: 'The primary stargate of the Sol System, connecting humanity to the stars. This ancient gate has served as the gateway to human expansion for centuries.',
    image: 'https://readdy.ai/api/search-image?query=massive%20ancient%20stargate%20portal%20in%20space%20with%20glowing%20blue%20energy%20ring%20surrounded%20by%20orbital%20platforms%20and%20defense%20stations%20in%20deep%20space%20science%20fiction%20style&width=800&height=600&seq=sg001&orientation=landscape'
  },
  {
    id: 'sg_002',
    name: 'Alpha Centauri Hub',
    type: 'stargate',
    tier: 1,
    rank: 'D',
    rarity: 'Uncommon',
    systemId: 'sys_alpha_centauri',
    systemName: 'Alpha Centauri',
    coordinates: { x: 4.37, y: 0, z: 0 },
    status: 'active',
    connections: ['sg_001', 'sg_004', 'sg_005'],
    stats: {
      maxJumpRange: 15,
      energyCost: 1500,
      cooldown: 50,
      massLimit: 15000,
      stabilityRating: 88,
      securityLevel: 7
    },
    requirements: {
      level: 5,
      technology: ['basic_ftl', 'gate_navigation_i'],
      igc: 500000,
      grc: 250000
    },
    features: {
      instantTravel: true,
      massTransit: true,
      militaryAccess: true,
      commercialAccess: true,
      privateAccess: true,
      tollRequired: true,
      tollAmount: 1000
    },
    ownership: {
      faction: 'Colonial Alliance'
    },
    traffic: {
      dailyJumps: 23840,
      weeklyJumps: 166880,
      totalJumps: 8934721
    },
    description: 'A major transit hub connecting the core worlds. This gate sees heavy commercial and military traffic daily.',
    image: 'https://readdy.ai/api/search-image?query=advanced%20stargate%20hub%20with%20multiple%20energy%20rings%20and%20docking%20bays%20in%20orbit%20around%20binary%20star%20system%20with%20heavy%20ship%20traffic%20science%20fiction&width=800&height=600&seq=sg002&orientation=landscape'
  },

  // Tier 2 - Advanced Stargates (C-B Rank)
  {
    id: 'sg_003',
    name: 'Sirius Nexus Prime',
    type: 'stargate',
    tier: 2,
    rank: 'C',
    rarity: 'Rare',
    systemId: 'sys_sirius',
    systemName: 'Sirius System',
    coordinates: { x: 8.6, y: 0, z: 0 },
    status: 'active',
    connections: ['sg_001', 'sg_006', 'sg_007', 'sg_008'],
    stats: {
      maxJumpRange: 25,
      energyCost: 2500,
      cooldown: 40,
      massLimit: 25000,
      stabilityRating: 92,
      securityLevel: 6
    },
    requirements: {
      level: 15,
      technology: ['advanced_ftl', 'gate_navigation_ii', 'quantum_stabilization'],
      igc: 2000000,
      grc: 1000000
    },
    features: {
      instantTravel: true,
      massTransit: true,
      militaryAccess: true,
      commercialAccess: true,
      privateAccess: true,
      tollRequired: true,
      tollAmount: 5000
    },
    ownership: {
      faction: 'Sirius Trade Consortium'
    },
    traffic: {
      dailyJumps: 45230,
      weeklyJumps: 316610,
      totalJumps: 16942837
    },
    description: 'A critical nexus point connecting multiple trade routes. Features advanced quantum stabilization for safer jumps.',
    image: 'https://readdy.ai/api/search-image?query=massive%20quantum%20stabilized%20stargate%20nexus%20with%20four%20energy%20rings%20and%20advanced%20technology%20platforms%20in%20bright%20star%20system%20science%20fiction&width=800&height=600&seq=sg003&orientation=landscape'
  },
  {
    id: 'sg_004',
    name: 'Vega Fortress Gate',
    type: 'stargate',
    tier: 2,
    rank: 'B',
    rarity: 'Epic',
    systemId: 'sys_vega',
    systemName: 'Vega System',
    coordinates: { x: 25, y: 0, z: 0 },
    status: 'active',
    connections: ['sg_002', 'sg_009', 'sg_010'],
    stats: {
      maxJumpRange: 35,
      energyCost: 3500,
      cooldown: 35,
      massLimit: 40000,
      stabilityRating: 94,
      securityLevel: 9
    },
    requirements: {
      level: 25,
      technology: ['military_ftl', 'gate_navigation_iii', 'fortress_protocols'],
      igc: 5000000,
      grc: 2500000
    },
    features: {
      instantTravel: true,
      massTransit: true,
      militaryAccess: true,
      commercialAccess: true,
      privateAccess: false,
      tollRequired: true,
      tollAmount: 10000
    },
    ownership: {
      faction: 'Imperial Defense Force'
    },
    traffic: {
      dailyJumps: 32140,
      weeklyJumps: 224980,
      totalJumps: 12048392
    },
    description: 'A heavily fortified military stargate protecting the frontier. Equipped with advanced defense systems and military-grade stabilizers.',
    image: 'https://readdy.ai/api/search-image?query=fortified%20military%20stargate%20with%20heavy%20armor%20plating%20defensive%20turrets%20and%20shield%20generators%20in%20strategic%20position%20science%20fiction&width=800&height=600&seq=sg004&orientation=landscape'
  },

  // Tier 3 - Jump Gates (A-S Rank)
  {
    id: 'jg_001',
    name: 'Arcturus Jump Gate',
    type: 'jump_gate',
    tier: 3,
    rank: 'A',
    rarity: 'Legendary',
    systemId: 'sys_arcturus',
    systemName: 'Arcturus System',
    coordinates: { x: 36.7, y: 0, z: 0 },
    status: 'active',
    connections: ['sg_003', 'jg_002', 'jg_003', 'jg_004'],
    stats: {
      maxJumpRange: 50,
      energyCost: 5000,
      cooldown: 30,
      massLimit: 60000,
      stabilityRating: 96,
      securityLevel: 5
    },
    requirements: {
      level: 40,
      technology: ['jump_drive_tech', 'gate_navigation_iv', 'spatial_compression'],
      igc: 15000000,
      grc: 7500000
    },
    features: {
      instantTravel: true,
      massTransit: true,
      militaryAccess: true,
      commercialAccess: true,
      privateAccess: true,
      tollRequired: true,
      tollAmount: 25000
    },
    ownership: {
      faction: 'Arcturus Conglomerate'
    },
    traffic: {
      dailyJumps: 67890,
      weeklyJumps: 475230,
      totalJumps: 25438921
    },
    description: 'An advanced jump gate utilizing spatial compression technology for longer range jumps. A marvel of engineering connecting distant sectors.',
    image: 'https://readdy.ai/api/search-image?query=advanced%20jump%20gate%20with%20spatial%20compression%20field%20generators%20and%20massive%20energy%20rings%20creating%20wormhole%20portal%20in%20deep%20space%20science%20fiction&width=800&height=600&seq=jg001&orientation=landscape'
  },
  {
    id: 'jg_002',
    name: 'Betelgeuse Mega Gate',
    type: 'jump_gate',
    tier: 3,
    rank: 'S',
    rarity: 'Mythic',
    systemId: 'sys_betelgeuse',
    systemName: 'Betelgeuse System',
    coordinates: { x: 642.5, y: 0, z: 0 },
    status: 'active',
    connections: ['jg_001', 'jg_005', 'jg_006', 'hb_001'],
    stats: {
      maxJumpRange: 100,
      energyCost: 10000,
      cooldown: 25,
      massLimit: 100000,
      stabilityRating: 98,
      securityLevel: 4
    },
    requirements: {
      level: 60,
      technology: ['mega_jump_drive', 'gate_navigation_v', 'dimensional_anchoring'],
      igc: 50000000,
      grc: 25000000
    },
    features: {
      instantTravel: true,
      massTransit: true,
      militaryAccess: true,
      commercialAccess: true,
      privateAccess: true,
      tollRequired: true,
      tollAmount: 50000
    },
    ownership: {
      faction: 'Galactic Transit Authority'
    },
    traffic: {
      dailyJumps: 124560,
      weeklyJumps: 871920,
      totalJumps: 46683472
    },
    description: 'A colossal mega gate capable of transporting entire fleets across vast distances. Features dimensional anchoring for unprecedented stability.',
    image: 'https://readdy.ai/api/search-image?query=colossal%20mega%20jump%20gate%20with%20dimensional%20anchors%20and%20massive%20energy%20field%20near%20red%20supergiant%20star%20with%20fleet%20of%20ships%20science%20fiction&width=800&height=600&seq=jg002&orientation=landscape'
  },

  // Tier 4 - Hyperspace Beacons (SS-SSS Rank)
  {
    id: 'hb_001',
    name: 'Andromeda Hyperspace Beacon',
    type: 'hyperspace_beacon',
    tier: 4,
    rank: 'SS',
    rarity: 'Cosmic',
    systemId: 'sys_andromeda_gate',
    systemName: 'Andromeda Gateway',
    coordinates: { x: 2537000, y: 0, z: 0 },
    status: 'active',
    connections: ['jg_002', 'hb_002', 'hb_003'],
    stats: {
      maxJumpRange: 500,
      energyCost: 50000,
      cooldown: 20,
      massLimit: 250000,
      stabilityRating: 99,
      securityLevel: 3
    },
    requirements: {
      level: 80,
      technology: ['hyperspace_navigation', 'gate_navigation_vi', 'reality_stabilization', 'exotic_matter_control'],
      igc: 200000000,
      grc: 100000000
    },
    features: {
      instantTravel: true,
      massTransit: true,
      militaryAccess: true,
      commercialAccess: true,
      privateAccess: true,
      tollRequired: true,
      tollAmount: 100000
    },
    ownership: {
      faction: 'Intergalactic Exploration Corps'
    },
    traffic: {
      dailyJumps: 8940,
      weeklyJumps: 62580,
      totalJumps: 3351204
    },
    description: 'A hyperspace beacon enabling intergalactic travel to Andromeda. Utilizes exotic matter and reality stabilization to pierce the void between galaxies.',
    image: 'https://readdy.ai/api/search-image?query=massive%20hyperspace%20beacon%20with%20exotic%20matter%20generators%20and%20reality%20stabilization%20field%20creating%20intergalactic%20portal%20to%20distant%20galaxy%20science%20fiction&width=800&height=600&seq=hb001&orientation=landscape'
  },
  {
    id: 'hb_002',
    name: 'Triangulum Void Gate',
    type: 'hyperspace_beacon',
    tier: 4,
    rank: 'SSS',
    rarity: 'Universal',
    systemId: 'sys_triangulum_gate',
    systemName: 'Triangulum Gateway',
    coordinates: { x: 3000000, y: 0, z: 0 },
    status: 'active',
    connections: ['hb_001', 'hb_003'],
    stats: {
      maxJumpRange: 1000,
      energyCost: 100000,
      cooldown: 15,
      massLimit: 500000,
      stabilityRating: 99.9,
      securityLevel: 2
    },
    requirements: {
      level: 100,
      technology: ['void_navigation', 'gate_navigation_vii', 'quantum_reality_manipulation', 'dark_energy_harnessing'],
      igc: 500000000,
      grc: 250000000
    },
    features: {
      instantTravel: true,
      massTransit: true,
      militaryAccess: true,
      commercialAccess: true,
      privateAccess: true,
      tollRequired: true,
      tollAmount: 250000
    },
    ownership: {
      faction: 'Universal Collective'
    },
    traffic: {
      dailyJumps: 3420,
      weeklyJumps: 23940,
      totalJumps: 1281456
    },
    description: 'The pinnacle of gate technology, capable of traversing the void between galaxy clusters. Harnesses dark energy and manipulates quantum reality itself.',
    image: 'https://readdy.ai/api/search-image?query=ultimate%20void%20gate%20with%20dark%20energy%20harness%20and%20quantum%20reality%20manipulation%20creating%20massive%20portal%20through%20cosmic%20void%20science%20fiction&width=800&height=600&seq=hb002&orientation=landscape'
  },

  // Additional Strategic Gates
  {
    id: 'sg_005',
    name: 'Procyon Trade Gate',
    type: 'stargate',
    tier: 1,
    rank: 'D',
    rarity: 'Uncommon',
    systemId: 'sys_procyon',
    systemName: 'Procyon System',
    coordinates: { x: 11.46, y: 0, z: 0 },
    status: 'active',
    connections: ['sg_002', 'sg_006'],
    stats: {
      maxJumpRange: 15,
      energyCost: 1500,
      cooldown: 50,
      massLimit: 20000,
      stabilityRating: 87,
      securityLevel: 5
    },
    requirements: {
      level: 8,
      technology: ['basic_ftl', 'gate_navigation_i'],
      igc: 750000,
      grc: 375000
    },
    features: {
      instantTravel: true,
      massTransit: true,
      militaryAccess: false,
      commercialAccess: true,
      privateAccess: true,
      tollRequired: true,
      tollAmount: 2000
    },
    ownership: {
      faction: 'Merchant Guild'
    },
    traffic: {
      dailyJumps: 56780,
      weeklyJumps: 397460,
      totalJumps: 21283947
    },
    description: 'A commercial-focused stargate with reduced military access. Popular among traders and merchants for its low tolls and high traffic.',
    image: 'https://readdy.ai/api/search-image?query=commercial%20stargate%20with%20cargo%20ship%20docking%20facilities%20and%20trade%20platforms%20in%20busy%20star%20system%20science%20fiction&width=800&height=600&seq=sg005&orientation=landscape'
  },
  {
    id: 'sg_006',
    name: 'Altair Research Gate',
    type: 'stargate',
    tier: 2,
    rank: 'C',
    rarity: 'Rare',
    systemId: 'sys_altair',
    systemName: 'Altair System',
    coordinates: { x: 16.73, y: 0, z: 0 },
    status: 'active',
    connections: ['sg_003', 'sg_005', 'jg_001'],
    stats: {
      maxJumpRange: 25,
      energyCost: 2000,
      cooldown: 45,
      massLimit: 30000,
      stabilityRating: 91,
      securityLevel: 7
    },
    requirements: {
      level: 20,
      technology: ['advanced_ftl', 'gate_navigation_ii', 'research_protocols'],
      igc: 3000000,
      grc: 1500000
    },
    features: {
      instantTravel: true,
      massTransit: true,
      militaryAccess: true,
      commercialAccess: true,
      privateAccess: true,
      tollRequired: true,
      tollAmount: 7500
    },
    ownership: {
      faction: 'Scientific Directorate'
    },
    traffic: {
      dailyJumps: 18920,
      weeklyJumps: 132440,
      totalJumps: 7092384
    },
    description: 'A stargate dedicated to scientific research and exploration. Features experimental stabilization technology.',
    image: 'https://readdy.ai/api/search-image?query=research%20stargate%20with%20scientific%20equipment%20and%20experimental%20technology%20platforms%20in%20star%20system%20science%20fiction&width=800&height=600&seq=sg006&orientation=landscape'
  },
  {
    id: 'jg_003',
    name: 'Polaris Military Jump Gate',
    type: 'jump_gate',
    tier: 3,
    rank: 'A',
    rarity: 'Legendary',
    systemId: 'sys_polaris',
    systemName: 'Polaris System',
    coordinates: { x: 433, y: 0, z: 0 },
    status: 'active',
    connections: ['jg_001', 'jg_004'],
    stats: {
      maxJumpRange: 60,
      energyCost: 6000,
      cooldown: 28,
      massLimit: 80000,
      stabilityRating: 97,
      securityLevel: 10
    },
    requirements: {
      level: 50,
      technology: ['military_jump_drive', 'gate_navigation_iv', 'tactical_deployment'],
      igc: 25000000,
      grc: 12500000
    },
    features: {
      instantTravel: true,
      massTransit: true,
      militaryAccess: true,
      commercialAccess: false,
      privateAccess: false,
      tollRequired: false
    },
    ownership: {
      faction: 'Imperial Navy'
    },
    traffic: {
      dailyJumps: 12340,
      weeklyJumps: 86380,
      totalJumps: 4625892
    },
    description: 'A military-exclusive jump gate for rapid fleet deployment. Features tactical deployment systems for coordinated jumps.',
    image: 'https://readdy.ai/api/search-image?query=military%20jump%20gate%20with%20tactical%20deployment%20systems%20and%20heavy%20fortifications%20in%20strategic%20position%20science%20fiction&width=800&height=600&seq=jg003&orientation=landscape'
  },
  {
    id: 'jg_004',
    name: 'Rigel Expedition Gate',
    type: 'jump_gate',
    tier: 3,
    rank: 'S',
    rarity: 'Mythic',
    systemId: 'sys_rigel',
    systemName: 'Rigel System',
    coordinates: { x: 860, y: 0, z: 0 },
    status: 'active',
    connections: ['jg_001', 'jg_003', 'jg_005'],
    stats: {
      maxJumpRange: 120,
      energyCost: 12000,
      cooldown: 22,
      massLimit: 120000,
      stabilityRating: 98,
      securityLevel: 3
    },
    requirements: {
      level: 70,
      technology: ['expedition_jump_drive', 'gate_navigation_v', 'deep_space_navigation'],
      igc: 75000000,
      grc: 37500000
    },
    features: {
      instantTravel: true,
      massTransit: true,
      militaryAccess: true,
      commercialAccess: true,
      privateAccess: true,
      tollRequired: true,
      tollAmount: 75000
    },
    ownership: {
      faction: 'Exploration Guild'
    },
    traffic: {
      dailyJumps: 34560,
      weeklyJumps: 241920,
      totalJumps: 12952847
    },
    description: 'A jump gate designed for deep space expeditions. Equipped with advanced navigation systems for uncharted territories.',
    image: 'https://readdy.ai/api/search-image?query=expedition%20jump%20gate%20with%20deep%20space%20navigation%20systems%20and%20exploration%20equipment%20in%20distant%20star%20system%20science%20fiction&width=800&height=600&seq=jg004&orientation=landscape'
  },
  {
    id: 'hb_003',
    name: 'Magellanic Cloud Beacon',
    type: 'hyperspace_beacon',
    tier: 4,
    rank: 'SS',
    rarity: 'Cosmic',
    systemId: 'sys_magellanic',
    systemName: 'Magellanic Gateway',
    coordinates: { x: 163000, y: 0, z: 0 },
    status: 'active',
    connections: ['jg_002', 'hb_001', 'hb_002'],
    stats: {
      maxJumpRange: 600,
      energyCost: 60000,
      cooldown: 18,
      massLimit: 300000,
      stabilityRating: 99.5,
      securityLevel: 2
    },
    requirements: {
      level: 90,
      technology: ['hyperspace_navigation', 'gate_navigation_vi', 'cosmic_stabilization', 'gravitational_lensing'],
      igc: 300000000,
      grc: 150000000
    },
    features: {
      instantTravel: true,
      massTransit: true,
      militaryAccess: true,
      commercialAccess: true,
      privateAccess: true,
      tollRequired: true,
      tollAmount: 150000
    },
    ownership: {
      faction: 'Cosmic Pathfinders'
    },
    traffic: {
      dailyJumps: 5670,
      weeklyJumps: 39690,
      totalJumps: 2125839
    },
    description: 'A hyperspace beacon connecting to the Magellanic Clouds. Uses gravitational lensing to stabilize the massive jump distance.',
    image: 'https://readdy.ai/api/search-image?query=hyperspace%20beacon%20with%20gravitational%20lensing%20technology%20creating%20portal%20to%20satellite%20galaxy%20with%20cosmic%20energy%20science%20fiction&width=800&height=600&seq=hb003&orientation=landscape'
  }
];

export const getStargateById = (id: string): Stargate | undefined => {
  return stargates.find(gate => gate.id === id);
};

export const getStargatesByType = (type: Stargate['type']): Stargate[] => {
  return stargates.filter(gate => gate.type === type);
};

export const getStargatesBySystem = (systemId: string): Stargate[] => {
  return stargates.filter(gate => gate.systemId === systemId);
};

export const getConnectedStargates = (stargateId: string): Stargate[] => {
  const stargate = getStargateById(stargateId);
  if (!stargate) return [];
  
  return stargate.connections
    .map(id => getStargateById(id))
    .filter((gate): gate is Stargate => gate !== undefined);
};

export const calculateJumpCost = (
  stargate: Stargate,
  shipMass: number,
  distance: number
): { energyCost: number; igcCost: number; grcCost: number; canJump: boolean; reason?: string } => {
  if (shipMass > stargate.stats.massLimit) {
    return {
      energyCost: 0,
      igcCost: 0,
      grcCost: 0,
      canJump: false,
      reason: 'Ship mass exceeds gate limit'
    };
  }

  if (distance > stargate.stats.maxJumpRange) {
    return {
      energyCost: 0,
      igcCost: 0,
      grcCost: 0,
      canJump: false,
      reason: 'Distance exceeds maximum jump range'
    };
  }

  const energyCost = Math.floor(stargate.stats.energyCost * (shipMass / 1000) * (distance / 10));
  const igcCost = stargate.features.tollRequired ? (stargate.features.tollAmount || 0) : 0;
  const grcCost = Math.floor(igcCost * 0.3);

  return {
    energyCost,
    igcCost,
    grcCost,
    canJump: true
  };
};
