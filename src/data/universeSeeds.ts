
// Universe Seed System - Procedural Generation for Multi-Universe
export interface UniverseSeed {
  id: string;
  name: string;
  seed: number;
  createdAt: number;
  galaxyCount: number;
  starSystemCount: number;
  planetCount: number;
  characteristics: {
    density: 'sparse' | 'normal' | 'dense' | 'packed';
    age: 'young' | 'mature' | 'ancient' | 'primordial';
    hostility: 'peaceful' | 'moderate' | 'dangerous' | 'extreme';
    resources: 'scarce' | 'normal' | 'abundant' | 'infinite';
  };
  specialFeatures: string[];
}

export const universeSeeds: UniverseSeed[] = [
  {
    id: 'alpha-prime',
    name: 'Alpha Prime Universe',
    seed: 42069,
    createdAt: Date.now(),
    galaxyCount: 100,
    starSystemCount: 10000,
    planetCount: 50000,
    characteristics: {
      density: 'normal',
      age: 'mature',
      hostility: 'moderate',
      resources: 'normal'
    },
    specialFeatures: ['Balanced gameplay', 'Standard progression', 'All features available']
  },
  {
    id: 'omega-void',
    name: 'Omega Void Universe',
    seed: 13337,
    createdAt: Date.now(),
    galaxyCount: 50,
    starSystemCount: 5000,
    planetCount: 20000,
    characteristics: {
      density: 'sparse',
      age: 'ancient',
      hostility: 'extreme',
      resources: 'scarce'
    },
    specialFeatures: ['High difficulty', 'Rare resources', 'Ancient artifacts', 'Void anomalies']
  },
  {
    id: 'genesis-cluster',
    name: 'Genesis Cluster Universe',
    seed: 77777,
    createdAt: Date.now(),
    galaxyCount: 200,
    starSystemCount: 25000,
    planetCount: 150000,
    characteristics: {
      density: 'packed',
      age: 'young',
      hostility: 'peaceful',
      resources: 'abundant'
    },
    specialFeatures: ['Easy start', 'Rich resources', 'Rapid expansion', 'New star formation']
  },
  {
    id: 'eternal-nexus',
    name: 'Eternal Nexus Universe',
    seed: 99999,
    createdAt: Date.now(),
    galaxyCount: 500,
    starSystemCount: 100000,
    planetCount: 1000000,
    characteristics: {
      density: 'dense',
      age: 'primordial',
      hostility: 'dangerous',
      resources: 'infinite'
    },
    specialFeatures: ['Endgame content', 'Unlimited resources', 'Cosmic entities', 'Reality rifts']
  }
];

// Seeded Random Number Generator
export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  choice<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
}

// Name generation components
export const starPrefixes = [
  'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa',
  'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon',
  'Phi', 'Chi', 'Psi', 'Omega', 'Nova', 'Stellar', 'Cosmic', 'Celestial', 'Astral',
  'Nebula', 'Pulsar', 'Quasar', 'Vega', 'Sirius', 'Rigel', 'Betelgeuse', 'Antares',
  'Aldebaran', 'Arcturus', 'Capella', 'Deneb', 'Fomalhaut', 'Pollux', 'Regulus',
  'Spica', 'Altair', 'Castor', 'Procyon', 'Achernar', 'Hadar', 'Acrux', 'Mimosa'
];

export const starSuffixes = [
  'Prime', 'Major', 'Minor', 'Secundus', 'Tertius', 'Quartus', 'Quintus',
  'Proxima', 'Ultima', 'Maxima', 'Minima', 'Centralis', 'Australis', 'Borealis',
  'Orientalis', 'Occidentalis', 'Superior', 'Inferior', 'Anterior', 'Posterior'
];

export const planetPrefixes = [
  'Terra', 'Gaia', 'Oceanus', 'Vulcan', 'Glacius', 'Aridus', 'Verdant', 'Crimson',
  'Azure', 'Amber', 'Obsidian', 'Crystal', 'Iron', 'Titanium', 'Platinum', 'Gold',
  'Silver', 'Copper', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus',
  'Neptune', 'Pluto', 'Ceres', 'Eris', 'Haumea', 'Makemake', 'Sedna', 'Orcus',
  'Quaoar', 'Varuna', 'Ixion', 'Chaos', 'Nyx', 'Hydra', 'Charon', 'Styx', 'Kerberos',
  'Prometheus', 'Pandora', 'Epimetheus', 'Janus', 'Mimas', 'Enceladus', 'Tethys',
  'Dione', 'Rhea', 'Titan', 'Hyperion', 'Iapetus', 'Phoebe', 'Miranda', 'Ariel',
  'Umbriel', 'Titania', 'Oberon', 'Triton', 'Nereid', 'Proteus', 'Larissa'
];

export const planetSuffixes = [
  'Prime', 'Alpha', 'Beta', 'Gamma', 'Delta', 'I', 'II', 'III', 'IV', 'V',
  'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV',
  'Major', 'Minor', 'Primus', 'Secundus', 'Tertius', 'Quartus', 'Quintus'
];

export const moonPrefixes = [
  'Luna', 'Selene', 'Phobos', 'Deimos', 'Io', 'Europa', 'Ganymede', 'Callisto',
  'Amalthea', 'Thebe', 'Adrastea', 'Metis', 'Elara', 'Pasiphae', 'Sinope',
  'Lysithea', 'Carme', 'Ananke', 'Leda', 'Himalia', 'Titan', 'Rhea', 'Iapetus',
  'Dione', 'Tethys', 'Enceladus', 'Mimas', 'Hyperion', 'Phoebe', 'Janus',
  'Epimetheus', 'Helene', 'Telesto', 'Calypso', 'Atlas', 'Prometheus', 'Pandora',
  'Pan', 'Daphnis', 'Anthe', 'Methone', 'Pallene', 'Polydeuces', 'Kiviuq'
];

export const asteroidPrefixes = [
  'Asteroid', 'Comet', 'Meteor', 'Bolide', 'Planetoid', 'Dwarf', 'Fragment',
  'Shard', 'Chunk', 'Rock', 'Boulder', 'Stone', 'Pebble', 'Grain', 'Dust'
];

export const nebulaPrefixes = [
  'Orion', 'Eagle', 'Crab', 'Horsehead', 'Pillars', 'Helix', 'Ring', 'Dumbbell',
  'Butterfly', 'Cat\'s Eye', 'Eskimo', 'Owl', 'Tarantula', 'Carina', 'Lagoon',
  'Trifid', 'Rosette', 'Veil', 'North America', 'Pelican', 'Flame', 'Cone',
  'Fox Fur', 'Witch Head', 'California', 'Soul', 'Heart', 'Bubble', 'Crescent',
  'Iris', 'Flaming Star', 'Pacman', 'Wizard', 'Cave', 'Cocoon', 'Elephant Trunk'
];

export const nebulaSuffixes = [
  'Nebula', 'Cloud', 'Expanse', 'Field', 'Region', 'Complex', 'Formation',
  'Cluster', 'Nursery', 'Remnant', 'Supernova', 'Planetary', 'Emission',
  'Reflection', 'Dark', 'Molecular', 'Diffuse', 'HII Region'
];

export const blackHolePrefixes = [
  'Void', 'Abyss', 'Singularity', 'Event Horizon', 'Schwarzschild', 'Kerr',
  'Hawking', 'Penrose', 'Chandrasekhar', 'Sagittarius', 'Cygnus', 'M87',
  'TON 618', 'Phoenix', 'Holmberg', 'NGC', 'Messier', 'Andromeda'
];

export const anomalyTypes = [
  'Wormhole', 'Quantum Rift', 'Temporal Anomaly', 'Spatial Distortion',
  'Gravity Well', 'Dark Matter Cluster', 'Antimatter Pocket', 'Void Tear',
  'Reality Fracture', 'Dimensional Gateway', 'Cosmic String', 'Exotic Matter Field',
  'Tachyon Stream', 'Subspace Vortex', 'Hyperspace Tunnel', 'Null Zone'
];

// Star types and classifications
export const starTypes = [
  { type: 'O', color: '#9BB0FF', temp: 30000, mass: 16, luminosity: 30000, lifespan: 1, rarity: 0.00003 },
  { type: 'B', color: '#AABFFF', temp: 10000, mass: 2.1, luminosity: 25, lifespan: 11, rarity: 0.13 },
  { type: 'A', color: '#CAD7FF', temp: 7500, mass: 1.4, luminosity: 5, lifespan: 440, rarity: 0.6 },
  { type: 'F', color: '#F8F7FF', temp: 6000, mass: 1.04, luminosity: 1.5, lifespan: 3000, rarity: 3 },
  { type: 'G', color: '#FFF4EA', temp: 5200, mass: 0.8, luminosity: 0.6, lifespan: 10000, rarity: 7.6 },
  { type: 'K', color: '#FFD2A1', temp: 3700, mass: 0.45, luminosity: 0.08, lifespan: 17000, rarity: 12.1 },
  { type: 'M', color: '#FFCC6F', temp: 2400, mass: 0.08, luminosity: 0.001, lifespan: 100000, rarity: 76.45 },
  { type: 'L', color: '#8B4513', temp: 1300, mass: 0.075, luminosity: 0.0001, lifespan: 1000000, rarity: 0.1 },
  { type: 'T', color: '#654321', temp: 700, mass: 0.07, luminosity: 0.00001, lifespan: 10000000, rarity: 0.05 },
  { type: 'Y', color: '#3E2723', temp: 300, mass: 0.065, luminosity: 0.000001, lifespan: 100000000, rarity: 0.01 }
];

export const specialStarTypes = [
  { type: 'Neutron Star', color: '#E0E0E0', mass: 1.4, radius: 10, rarity: 0.001 },
  { type: 'Pulsar', color: '#00FFFF', mass: 1.4, radius: 10, rarity: 0.0005 },
  { type: 'Magnetar', color: '#FF00FF', mass: 1.4, radius: 10, rarity: 0.0001 },
  { type: 'White Dwarf', color: '#FFFFFF', mass: 0.6, radius: 0.01, rarity: 0.01 },
  { type: 'Red Giant', color: '#FF4500', mass: 0.8, radius: 100, rarity: 0.005 },
  { type: 'Blue Giant', color: '#4169E1', mass: 20, radius: 25, rarity: 0.001 },
  { type: 'Supergiant', color: '#FFD700', mass: 40, radius: 1000, rarity: 0.0001 },
  { type: 'Hypergiant', color: '#FF1493', mass: 100, radius: 2000, rarity: 0.00001 },
  { type: 'Wolf-Rayet', color: '#9370DB', mass: 20, radius: 10, rarity: 0.0002 },
  { type: 'Carbon Star', color: '#8B0000', mass: 1, radius: 100, rarity: 0.001 }
];

// Planet types and classifications
export const planetTypes = [
  { type: 'Terrestrial', habitability: 0.7, resources: 'high', size: 'small', rarity: 0.3 },
  { type: 'Ocean World', habitability: 0.9, resources: 'medium', size: 'medium', rarity: 0.1 },
  { type: 'Desert World', habitability: 0.4, resources: 'low', size: 'medium', rarity: 0.15 },
  { type: 'Ice World', habitability: 0.3, resources: 'medium', size: 'medium', rarity: 0.15 },
  { type: 'Volcanic World', habitability: 0.1, resources: 'very high', size: 'medium', rarity: 0.1 },
  { type: 'Gas Giant', habitability: 0, resources: 'gas', size: 'huge', rarity: 0.1 },
  { type: 'Ice Giant', habitability: 0, resources: 'gas', size: 'large', rarity: 0.05 },
  { type: 'Rocky Planet', habitability: 0.5, resources: 'high', size: 'small', rarity: 0.2 },
  { type: 'Lava Planet', habitability: 0, resources: 'extreme', size: 'small', rarity: 0.05 },
  { type: 'Toxic World', habitability: 0, resources: 'rare', size: 'medium', rarity: 0.08 },
  { type: 'Crystal World', habitability: 0.2, resources: 'exotic', size: 'small', rarity: 0.02 },
  { type: 'Metal World', habitability: 0, resources: 'metal', size: 'small', rarity: 0.05 },
  { type: 'Jungle World', habitability: 0.8, resources: 'organic', size: 'medium', rarity: 0.08 },
  { type: 'Tundra World', habitability: 0.6, resources: 'medium', size: 'medium', rarity: 0.1 },
  { type: 'Swamp World', habitability: 0.5, resources: 'organic', size: 'medium', rarity: 0.07 },
  { type: 'Barren World', habitability: 0, resources: 'low', size: 'small', rarity: 0.25 },
  { type: 'Radioactive World', habitability: 0, resources: 'radioactive', size: 'medium', rarity: 0.03 },
  { type: 'Exotic Matter World', habitability: 0, resources: 'exotic', size: 'small', rarity: 0.01 },
  { type: 'Dark Matter World', habitability: 0, resources: 'dark matter', size: 'medium', rarity: 0.005 },
  { type: 'Antimatter World', habitability: 0, resources: 'antimatter', size: 'small', rarity: 0.001 }
];

// Generate unique name based on seed
export function generateStarName(seed: number, index: number): string {
  const rng = new SeededRandom(seed + index);
  const prefix = rng.choice(starPrefixes);
  const suffix = rng.choice(starSuffixes);
  const number = rng.nextInt(1, 9999);
  
  const format = rng.nextInt(1, 4);
  switch (format) {
    case 1: return `${prefix} ${suffix}`;
    case 2: return `${prefix}-${number}`;
    case 3: return `${prefix} ${suffix} ${number}`;
    default: return `${prefix} ${number}`;
  }
}

export function generatePlanetName(seed: number, starIndex: number, planetIndex: number): string {
  const rng = new SeededRandom(seed + starIndex * 1000 + planetIndex);
  const prefix = rng.choice(planetPrefixes);
  const suffix = rng.choice(planetSuffixes);
  
  const format = rng.nextInt(1, 3);
  switch (format) {
    case 1: return `${prefix} ${suffix}`;
    case 2: return `${prefix}-${planetIndex + 1}`;
    default: return `${prefix} ${romanNumeral(planetIndex + 1)}`;
  }
}

export function generateMoonName(seed: number, starIndex: number, planetIndex: number, moonIndex: number): string {
  const rng = new SeededRandom(seed + starIndex * 1000 + planetIndex * 100 + moonIndex);
  const prefix = rng.choice(moonPrefixes);
  
  const format = rng.nextInt(1, 3);
  switch (format) {
    case 1: return `${prefix}`;
    case 2: return `${prefix}-${moonIndex + 1}`;
    default: return `${prefix} ${String.fromCharCode(65 + moonIndex)}`;
  }
}

export function generateAsteroidName(seed: number, index: number): string {
  const rng = new SeededRandom(seed + index);
  const prefix = rng.choice(asteroidPrefixes);
  const number = rng.nextInt(1, 999999);
  return `${prefix} ${number}`;
}

export function generateNebulaName(seed: number, index: number): string {
  const rng = new SeededRandom(seed + index);
  const prefix = rng.choice(nebulaPrefixes);
  const suffix = rng.choice(nebulaSuffixes);
  return `${prefix} ${suffix}`;
}

export function generateBlackHoleName(seed: number, index: number): string {
  const rng = new SeededRandom(seed + index);
  const prefix = rng.choice(blackHolePrefixes);
  const number = rng.nextInt(1, 9999);
  return `${prefix} ${number}`;
}

export function generateAnomalyName(seed: number, index: number): string {
  const rng = new SeededRandom(seed + index);
  const type = rng.choice(anomalyTypes);
  const number = rng.nextInt(1, 9999);
  return `${type} ${number}`;
}

// Helper function for Roman numerals
function romanNumeral(num: number): string {
  const romanNumerals: { [key: number]: string } = {
    1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
    6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X',
    11: 'XI', 12: 'XII', 13: 'XIII', 14: 'XIV', 15: 'XV',
    16: 'XVI', 17: 'XVII', 18: 'XVIII', 19: 'XIX', 20: 'XX'
  };
  return romanNumerals[num] || num.toString();
}

// Generate star system
export interface StarSystem {
  id: string;
  name: string;
  coordinates: { x: number; y: number; z: number };
  star: {
    name: string;
    type: string;
    color: string;
    temperature: number;
    mass: number;
    luminosity: number;
    age: number;
  };
  planets: Planet[];
  asteroidBelts: number;
  anomalies: Anomaly[];
}

export interface Planet {
  id: string;
  name: string;
  type: string;
  size: number;
  mass: number;
  gravity: number;
  temperature: number;
  atmosphere: string;
  habitability: number;
  resources: {
    metal: number;
    crystal: number;
    deuterium: number;
    darkMatter: number;
    exoticMatter: number;
  };
  moons: Moon[];
  orbitDistance: number;
  orbitPeriod: number;
}

export interface Moon {
  id: string;
  name: string;
  size: number;
  mass: number;
  resources: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
}

export interface Anomaly {
  id: string;
  name: string;
  type: string;
  danger: number;
  rewards: string[];
}

export function generateStarSystem(universeSeed: number, systemIndex: number): StarSystem {
  const rng = new SeededRandom(universeSeed + systemIndex);
  
  // Generate star
  const starTypeData = rng.next() < 0.001 
    ? rng.choice(specialStarTypes)
    : weightedChoice(starTypes, rng);
  
  const starName = generateStarName(universeSeed, systemIndex);
  
  // Generate coordinates
  const coordinates = {
    x: rng.nextInt(-10000, 10000),
    y: rng.nextInt(-10000, 10000),
    z: rng.nextInt(-1000, 1000)
  };
  
  // Generate planets
  const planetCount = rng.nextInt(0, 12);
  const planets: Planet[] = [];
  
  for (let i = 0; i < planetCount; i++) {
    const planetTypeData = weightedChoice(planetTypes, rng);
    const planetName = generatePlanetName(universeSeed, systemIndex, i);
    
    // Generate moons
    const moonCount = rng.nextInt(0, 5);
    const moons: Moon[] = [];
    
    for (let j = 0; j < moonCount; j++) {
      moons.push({
        id: `${systemIndex}-${i}-${j}`,
        name: generateMoonName(universeSeed, systemIndex, i, j),
        size: rng.nextFloat(0.1, 0.5),
        mass: rng.nextFloat(0.01, 0.1),
        resources: {
          metal: rng.nextInt(1000, 50000),
          crystal: rng.nextInt(500, 25000),
          deuterium: rng.nextInt(100, 10000)
        }
      });
    }
    
    planets.push({
      id: `${systemIndex}-${i}`,
      name: planetName,
      type: planetTypeData.type,
      size: getSizeValue(planetTypeData.size, rng),
      mass: rng.nextFloat(0.1, 100),
      gravity: rng.nextFloat(0.1, 3),
      temperature: rng.nextInt(-200, 500),
      atmosphere: getAtmosphere(planetTypeData.type, rng),
      habitability: planetTypeData.habitability,
      resources: {
        metal: rng.nextInt(10000, 500000),
        crystal: rng.nextInt(5000, 250000),
        deuterium: rng.nextInt(1000, 100000),
        darkMatter: rng.nextInt(0, 10000),
        exoticMatter: rng.nextInt(0, 5000)
      },
      moons,
      orbitDistance: (i + 1) * rng.nextFloat(0.5, 2),
      orbitPeriod: Math.sqrt(Math.pow((i + 1) * rng.nextFloat(0.5, 2), 3))
    });
  }
  
  // Generate anomalies
  const anomalyCount = rng.nextInt(0, 3);
  const anomalies: Anomaly[] = [];
  
  for (let i = 0; i < anomalyCount; i++) {
    anomalies.push({
      id: `${systemIndex}-anomaly-${i}`,
      name: generateAnomalyName(universeSeed, systemIndex * 100 + i),
      type: rng.choice(anomalyTypes),
      danger: rng.nextInt(1, 10),
      rewards: generateAnomalyRewards(rng)
    });
  }
  
  return {
    id: `system-${systemIndex}`,
    name: starName,
    coordinates,
    star: {
      name: starName,
      type: starTypeData.type,
      color: starTypeData.color,
      temperature: starTypeData.temp || rng.nextInt(2000, 40000),
      mass: starTypeData.mass,
      luminosity: starTypeData.luminosity || rng.nextFloat(0.001, 1000),
      age: rng.nextInt(1, 13000)
    },
    planets,
    asteroidBelts: rng.nextInt(0, 3),
    anomalies
  };
}

function weightedChoice<T extends { rarity: number }>(items: T[], rng: SeededRandom): T {
  const totalWeight = items.reduce((sum, item) => sum + item.rarity, 0);
  let random = rng.next() * totalWeight;
  
  for (const item of items) {
    random -= item.rarity;
    if (random <= 0) return item;
  }
  
  return items[items.length - 1];
}

function getSizeValue(size: string, rng: SeededRandom): number {
  switch (size) {
    case 'small': return rng.nextFloat(0.3, 0.8);
    case 'medium': return rng.nextFloat(0.8, 1.5);
    case 'large': return rng.nextFloat(1.5, 3);
    case 'huge': return rng.nextFloat(3, 15);
    default: return 1;
  }
}

function getAtmosphere(planetType: string, rng: SeededRandom): string {
  const atmospheres: { [key: string]: string[] } = {
    'Terrestrial': ['Nitrogen-Oxygen', 'Carbon Dioxide', 'Thin'],
    'Ocean World': ['Nitrogen-Oxygen', 'Water Vapor'],
    'Desert World': ['Thin', 'Carbon Dioxide', 'None'],
    'Ice World': ['Thin', 'Methane', 'Nitrogen'],
    'Volcanic World': ['Sulfur Dioxide', 'Carbon Dioxide', 'Toxic'],
    'Gas Giant': ['Hydrogen-Helium', 'Methane', 'Ammonia'],
    'Ice Giant': ['Hydrogen-Helium', 'Methane', 'Water'],
    'default': ['None', 'Thin', 'Toxic']
  };
  
  const options = atmospheres[planetType] || atmospheres.default;
  return rng.choice(options);
}

function generateAnomalyRewards(rng: SeededRandom): string[] {
  const possibleRewards = [
    'Dark Matter', 'Exotic Matter', 'Ancient Artifacts', 'Technology Blueprints',
    'Rare Resources', 'Energy Crystals', 'Quantum Particles', 'Antimatter',
    'Temporal Fragments', 'Dimensional Shards', 'Cosmic Essence', 'Void Energy'
  ];
  
  const rewardCount = rng.nextInt(1, 3);
  const rewards: string[] = [];
  
  for (let i = 0; i < rewardCount; i++) {
    rewards.push(rng.choice(possibleRewards));
  }
  
  return rewards;
}
