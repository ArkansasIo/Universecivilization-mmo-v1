// Cosmic Hierarchy — 9 Universes × 90 Galaxies × 1-499 Sectors × 1-15 Planets
// Procedural generation using seeded RNG for deterministic infinite worlds

import type {
  UniverseData, GalaxyData, SectorData, SolarSystemData,
  UniverseClassType, GalaxyClassLetter, GalaxyType, GalaxyCategory,
  QuadrantType, SectorType, SecurityLevel, SolarSystemType, StarClassType,
  CosmicCoordinates,
} from '@/types/gameTypes';
import {
  QUADRANT_TYPE_DEFINITIONS, GALAXY_CLASS_NAMES, GALAXY_SUB_CLASSES,
  GALAXY_TYPES, GALAXY_SUB_CATEGORIES, GALAXY_CLASS_COLORS,
  GALAXY_CLASS_TO_TYPE, GALAXY_TYPE_TO_QUADRANTS,
  SECTOR_TYPE_DEFINITIONS, SECURITY_LEVEL_COLORS,
  SOLAR_SYSTEM_DEFINITIONS, STAR_CLASS_DEFINITIONS,
  GALAXY_PREFIXES, GALAXY_SUFFIXES, GALAXY_DESCRIPTORS,
  SPECIES_NAMES, FACTION_NAMES,
} from '@/types/gameTypes';

// Seeded Random Number Generator
export class CosmicRNG {
  private seed: number;
  constructor(seed: number) { this.seed = seed; }
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
  choice<T>(arr: T[]): T { return arr[this.nextInt(0, arr.length - 1)]; }
  weightedChoice<T extends { rarity: number }>(items: T[]): T {
    const total = items.reduce((s, i) => s + i.rarity, 0);
    let r = this.next() * total;
    for (const item of items) { r -= item.rarity; if (r <= 0) return item; }
    return items[items.length - 1];
  }
}

// All class letters A-Z
const CLASS_LETTERS: GalaxyClassLetter[] = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

// Galaxy class rarities
const GALAXY_CLASS_RARITIES = CLASS_LETTERS.map((l): { letter: GalaxyClassLetter; rarity: number } => {
  const type = GALAXY_CLASS_TO_TYPE[l];
  const rarities: Record<GalaxyType, number> = {
    'Spiral': 0.30, 'Elliptical': 0.18, 'Irregular': 0.12, 'Lenticular': 0.08,
    'Dwarf': 0.12, 'Ring': 0.05, 'Starburst': 0.06, 'Active': 0.05, 'Ultra-Diffuse': 0.04
  };
  return { letter: l, rarity: rarities[type] || 0.04 };
});

// Galaxy name generator
function generateGalaxyName(rng: CosmicRNG, idx: number): string {
  const fmt = rng.nextInt(1, 5);
  const prefix = rng.choice(GALAXY_PREFIXES);
  const suffix = rng.choice(GALAXY_SUFFIXES);
  const descriptor = rng.choice(GALAXY_DESCRIPTORS);
  const num = rng.nextInt(1, 99999);

  switch (fmt) {
    case 1: return `${descriptor} ${prefix} ${suffix}`;
    case 2: return `${prefix} ${suffix} ${num}`;
    case 3: return `${descriptor} ${prefix}`;
    case 4: return `${prefix}-${num}`;
    default: return `${prefix} ${suffix}`;
  }
}

// Generate single galaxy
function generateGalaxy(rng: CosmicRNG, universeId: string, gIdx: number): GalaxyData {
  const classDef = rng.weightedChoice(GALAXY_CLASS_RARITIES);
  const galaxyClass = classDef.letter;
  const galaxyType = GALAXY_CLASS_TO_TYPE[galaxyClass];
  const subClass = rng.choice(GALAXY_SUB_CLASSES[galaxyClass]);
  const possibleQuadrants = GALAXY_TYPE_TO_QUADRANTS[galaxyType];
  const quadrantType = rng.choice(possibleQuadrants);
  const quadrantDef = QUADRANT_TYPE_DEFINITIONS[quadrantType];
  const quadrantSubType = rng.choice(quadrantDef.subTypes);

  // Determine category
  let category: GalaxyCategory;
  if (galaxyType === 'Dwarf' || galaxyType === 'Ultra-Diffuse') {
    category = rng.next() < 0.5 ? 'Dwarf Galaxy' : 'Satellite Galaxy';
  } else if (galaxyType === 'Active' || galaxyType === 'Starburst') {
    category = rng.next() < 0.6 ? 'Giant Galaxy' : 'Intermediate Galaxy';
  } else if (quadrantType === 'Intergalactic Void') {
    category = 'Field Galaxy';
  } else if (rng.next() < 0.15) {
    category = 'Cluster Galaxy';
  } else if (rng.next() < 0.25) {
    category = 'Giant Galaxy';
  } else {
    category = 'Intermediate Galaxy';
  }

  const subCategory = rng.choice(GALAXY_SUB_CATEGORIES[category]);
  const name = generateGalaxyName(rng, gIdx);
  const diameterLy = rng.nextInt(15000, 450000);
  const starCount = Math.floor(diameterLy * rng.nextInt(500, 5000));
  const ageBillionYears = rng.nextFloat(0.5, 13.8);
  const maxSectors = rng.nextInt(50, 499);
  const sectorCount = rng.nextInt(10, maxSectors);
  const discoveredSectors = rng.nextInt(0, Math.floor(sectorCount * 0.3));
  const habitableZoneRatio = rng.nextFloat(0.05, 0.35);
  const richnessRoll = rng.next();
  const resourceRichness = richnessRoll > 0.8 ? 'Abundant' : richnessRoll > 0.55 ? 'Rich' : richnessRoll > 0.25 ? 'Normal' : richnessRoll > 0.08 ? 'Low' : 'Scarce';
  const threatLevel = rng.nextInt(1, 10);
  const dominantSpecies = rng.choice(SPECIES_NAMES);
  const controllingFaction = rng.choice(FACTION_NAMES);

  // Special features based on class
  const featurePool = [
    'Ancient Ruins', 'Wormhole Nexus', 'Dark Matter Concentration', 'Exotic Matter Deposits',
    'Cosmic Anomaly', 'Temporal Distortion', 'Quantum Entanglement Zone', 'Reality Rift',
    'Hyperlane Junction', 'Trade Route Hub', 'Military Stronghold', 'Research Outpost Network',
    'Pirate Stronghold', 'Xeno-Archeological Site', 'Dimensional Gateway', 'Celestial Forge',
    'Nebula Nursery', 'Stellar Graveyard', 'Plasma Storm Region', 'Crystal Formation Field'
  ];
  const featureCount = rng.nextInt(1, 5);
  const specialFeatures: string[] = [];
  for (let i = 0; i < featureCount; i++) {
    const f = rng.choice(featurePool);
    if (!specialFeatures.includes(f)) specialFeatures.push(f);
  }

  const coords: CosmicCoordinates = {
    x: rng.nextInt(-50000, 50000),
    y: rng.nextInt(-50000, 50000),
    z: rng.nextInt(-10000, 10000),
  };

  return {
    id: `${universeId}-g${String(gIdx + 1).padStart(3, '0')}`,
    universeId,
    name,
    galaxyClass,
    subClass,
    galaxyType,
    category,
    subCategory,
    quadrantType,
    quadrantSubType,
    coordinates: coords,
    starCount,
    diameterLy,
    ageBillionYears,
    dominantSpecies,
    controllingFaction,
    sectorCount,
    maxSectors,
    discoveredSectors,
    habitableZoneRatio: parseFloat(habitableZoneRatio.toFixed(3)),
    resourceRichness,
    threatLevel,
    isActive: rng.next() > 0.05,
    specialFeatures,
    description: `${GALAXY_CLASS_NAMES[galaxyClass]} (${subClass}) located in the ${quadrantSubType} of ${quadrantType}. ${category} category, ${diameterLy.toLocaleString()} ly diameter with ${starCount.toLocaleString()} stars.`,
    lore: `The ${name} has existed for ${ageBillionYears.toFixed(1)} billion years. The ${dominantSpecies} species dominates this region under the banner of the ${controllingFaction}. ${specialFeatures.length > 0 ? `Notable features include: ${specialFeatures.join(', ')}.` : ''}`,
    color: GALAXY_CLASS_COLORS[galaxyClass],
    image: `https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28name.toLowerCase%28%29.replace%28%2F%5Cs%20%2Fg%2C%20-%29%29%7D-$%7BgalaxyType.toLowerCase%28%29%7D-galaxy-class-$%7BgalaxyClass%7D-cosmic-deep-space-ultra-detailed&width=800&height=450&seq=${universeId}-g${gIdx}&orientation=landscape`,
  };
}

// Sector type distribution by galaxy quadrant
const SECTOR_TYPE_BY_QUADRANT: Record<QuadrantType, SectorType[]> = {
  'Inner Core': ['Core Sector', 'Inner Sector', 'Anomalous Sector'],
  'Outer Core': ['Inner Sector', 'Mid Sector', 'Core Sector'],
  'Spiral Arm': ['Mid Sector', 'Outer Sector', 'Frontier Sector', 'Nebula Sector'],
  'Galactic Bar': ['Mid Sector', 'Outer Sector', 'Inner Sector'],
  'Halo': ['Outer Sector', 'Frontier Sector', 'Void Sector'],
  'Dark Matter Halo': ['Void Sector', 'Anomalous Sector', 'Frontier Sector'],
  'Satellite Region': ['Frontier Sector', 'Wild Space', 'Outer Sector'],
  'Intergalactic Void': ['Void Sector', 'Wild Space', 'Anomalous Sector'],
  'Galactic Bulge': ['Core Sector', 'Inner Sector', 'Anomalous Sector'],
};

// Generate sectors for a galaxy
export function generateSectorsForGalaxy(galaxy: GalaxyData, sectorNumbers?: number[]): SectorData[] {
  const rng = new CosmicRNG(parseInt(galaxy.id.replace(/\D/g, '')) || galaxy.name.length * 31);
  const possibleTypes = SECTOR_TYPE_BY_QUADRANT[galaxy.quadrantType] || ['Mid Sector', 'Outer Sector'];
  const nums = sectorNumbers || Array.from({ length: galaxy.sectorCount }, (_, i) => i + 1);
  const sectors: SectorData[] = [];

  for (const sn of nums) {
    const sectorType = rng.choice(possibleTypes);
    const def = SECTOR_TYPE_DEFINITIONS[sectorType];
    const securityLevel = ['Maximum','High','Medium','Low','Minimal','None','Anomalous'][rng.nextInt(0, 6)] as SecurityLevel;
    const starSystemCount = rng.nextInt(def.starSystemRange[0], def.starSystemRange[1]);
    const discoveredSystems = rng.nextInt(0, Math.floor(starSystemCount * 0.2));
    const colonizedSystems = rng.nextInt(0, Math.floor(discoveredSystems * 0.3));
    const resourceLevel = ['Scarce','Low','Normal','Rich','Abundant'][rng.nextInt(0, 4)] as SectorData['resourceLevel'];
    const threatLevel = rng.nextInt(def.securityRange[0] > 5 ? 1 : def.securityRange[0], 10);

    sectors.push({
      id: `${galaxy.id}-s${String(sn).padStart(3, '0')}`,
      galaxyId: galaxy.id,
      name: `${galaxy.name} Sector ${sn}`,
      sectorNumber: sn,
      sectorType,
      subType: Object.keys(SECTOR_TYPE_DEFINITIONS)[rng.nextInt(0, 8)],
      securityLevel,
      coordinates: { x: galaxy.coordinates.x + rng.nextInt(-5000, 5000), y: galaxy.coordinates.y + rng.nextInt(-5000, 5000), z: galaxy.coordinates.z + rng.nextInt(-2000, 2000) },
      starSystemCount,
      maxStarSystems: def.starSystemRange[1],
      discoveredSystems,
      colonizedSystems,
      dominantFaction: rng.choice(FACTION_NAMES),
      resourceLevel,
      threatLevel,
      isDiscovered: discoveredSystems > 0,
      isAccessible: rng.next() > 0.1,
      specialFeatures: [],
      description: `${sectorType} — ${def.description}`,
    });
  }
  return sectors;
}

// Solar system type weights
const SYSTEM_TYPE_WEIGHTS = Object.entries(SOLAR_SYSTEM_DEFINITIONS).map(([type, def]) => ({
  type: type as SolarSystemType,
  rarity: def.rarity,
}));

const STAR_CLASS_WEIGHTS = Object.entries(STAR_CLASS_DEFINITIONS).map(([type, def]) => ({
  type: type as StarClassType,
  rarity: def.rarity,
}));

// Generate solar systems for a sector
export function generateSolarSystemsForSector(sector: SectorData, systemNumbers?: number[]): SolarSystemData[] {
  const rng = new CosmicRNG(parseInt(sector.id.replace(/\D/g, '')) || sector.name.length * 17);
  const nums = systemNumbers || Array.from({ length: Math.min(sector.starSystemCount, sector.maxStarSystems) }, (_, i) => i + 1);
  const systems: SolarSystemData[] = [];

  for (const sn of nums) {
    const systemType = rng.weightedChoice(SYSTEM_TYPE_WEIGHTS);
    const sysDef = SOLAR_SYSTEM_DEFINITIONS[systemType];
    const starType = rng.weightedChoice(STAR_CLASS_WEIGHTS);
    const starDef = STAR_CLASS_DEFINITIONS[starType];

    const planetCount = rng.nextInt(sysDef.planetRange[0], sysDef.planetRange[1]);
    const asteroidBelts = rng.nextInt(0, 5);
    const habitabilityZonePlanets = rng.nextInt(0, Math.min(planetCount, 4));
    const hasBlackHole = starType === 'BlackHole' || rng.next() < 0.005;
    const hasNebula = sector.sectorType === 'Nebula Sector' || rng.next() < 0.02;
    const hasAnomaly = sector.sectorType === 'Anomalous Sector' || rng.next() < 0.03;
    const isDiscovered = rng.next() < 0.15;
    const isColonized = isDiscovered && rng.next() < 0.2;

    const resourceOutput = {
      metal: rng.nextInt(1000, 500000),
      crystal: rng.nextInt(500, 250000),
      deuterium: rng.nextInt(100, 100000),
      darkMatter: hasAnomaly || hasBlackHole ? rng.nextInt(1000, 50000) : 0,
    };

    // Generate star name
    const starPrefixes = ['Alpha','Beta','Gamma','Delta','Epsilon','Zeta','Eta','Theta','Iota','Kappa','Lambda','Mu','Nu','Xi','Omicron','Pi','Rho','Sigma','Tau','Upsilon','Phi','Chi','Psi','Omega'];
    const starName = `${rng.choice(starPrefixes)} ${sector.name.split(' ').pop()}-${sn}`;

    systems.push({
      id: `${sector.id}-sys${String(sn).padStart(2, '0')}`,
      sectorId: sector.id,
      name: starName,
      systemNumber: sn,
      systemType,
      starType,
      starColor: starDef.color,
      starTemperature: rng.nextInt(starDef.tempRange[0], starDef.tempRange[1]),
      starMass: parseFloat(rng.nextFloat(starDef.massRange[0], starDef.massRange[1]).toFixed(2)),
      starLuminosity: parseFloat(rng.nextFloat(0.001, 100000).toFixed(4)),
      planetCount,
      asteroidBelts,
      hasBlackHole,
      hasNebula,
      hasAnomaly,
      coordinates: { x: sector.coordinates.x + rng.nextInt(-500, 500), y: sector.coordinates.y + rng.nextInt(-500, 500), z: sector.coordinates.z + rng.nextInt(-200, 200) },
      habitabilityZonePlanets,
      resourceOutput,
      isDiscovered,
      isColonized,
      ownerId: isColonized ? `empire-${rng.nextInt(1, 9999)}` : null,
      threatLevel: rng.nextInt(1, 10),
      specialFeatures: hasAnomaly ? [rng.choice(['Wormhole','Quantum Rift','Temporal Anomaly','Spatial Distortion','Dark Matter Cluster','Antimatter Pocket','Void Tear','Reality Fracture'])] : [],
      description: `${starDef.name} star system with ${planetCount} planets. ${sysDef.description}`,
    });
  }
  return systems;
}

// The 9 Universe definitions
export const NINE_UNIVERSES: UniverseData[] = [
  {
    id: 'u1', name: 'Prime Dominion', class: 'Standard', seed: 42069001,
    description: 'The central universe of the cosmic hierarchy. Balanced in all aspects — the perfect starting ground for new empires and the eternal battleground for veterans.',
    color: '#F59E0B', accentColor: '#D97706',
    image: 'https://readdy.ai/api/search-image?query=majestic%20golden%20spiral%20galaxy%20universe%20warm%20amber%20tones%20balanced%20cosmic%20scale%20standard%20universe%20prime%20dominion&width=800&height=450&seq=u1cosmic&orientation=landscape',
    totalGalaxies: 90, galaxyCount: 90, totalPlayers: 48291, maxPlayers: 100000, isActive: true,
    launchDate: '2024-01-15', age: 'Mature', density: 'Normal', hostility: 'Moderate', resources: 'Normal', technology: 'Standard',
    specialFeatures: ['Balanced Gameplay', 'All Galaxy Classes', 'Trade Hub Central'],
  },
  {
    id: 'u2', name: 'Void Reaches', class: 'Void', seed: 13337002,
    description: 'Dark matter dominates this sparse universe. Ancient void entities drift between the few galaxies, hunting those brave enough to traverse the emptiness.',
    color: '#7C3AED', accentColor: '#5B21B6',
    image: 'https://readdy.ai/api/search-image?query=dark%20void%20universe%20with%20sparse%20galaxies%20purple%20black%20cosmic%20emptiness%20ancient%20entities%20deep%20space%20horror&width=800&height=450&seq=u2cosmic&orientation=landscape',
    totalGalaxies: 90, galaxyCount: 90, totalPlayers: 12847, maxPlayers: 50000, isActive: true,
    launchDate: '2024-03-01', age: 'Ancient', density: 'Sparse', hostility: 'Extreme', resources: 'Scarce', technology: 'Advanced',
    specialFeatures: ['Dark Matter Abundance', 'Void Entities', 'Ancient Artifacts', 'High Difficulty'],
  },
  {
    id: 'u3', name: 'Genesis Fields', class: 'Peaceful', seed: 77777003,
    description: 'A young universe bursting with star formation. Resources overflow, life flourishes, and conflict is minimal. The builder\'s paradise.',
    color: '#4ADE80', accentColor: '#16A34A',
    image: 'https://readdy.ai/api/search-image?query=young%20vibrant%20green%20teal%20universe%20abundant%20star%20formation%20lush%20cosmic%20environment%20peaceful%20genesis%20fields&width=800&height=450&seq=u3cosmic&orientation=landscape',
    totalGalaxies: 90, galaxyCount: 90, totalPlayers: 67432, maxPlayers: 150000, isActive: true,
    launchDate: '2024-02-01', age: 'Young', density: 'Packed', hostility: 'Peaceful', resources: 'Abundant', technology: 'Standard',
    specialFeatures: ['Rapid Growth', 'Resource Abundance', 'New Star Formation', 'Safe Zones'],
  },
  {
    id: 'u4', name: 'Eternal Nexus', class: 'Mythic', seed: 99999004,
    description: 'The endgame universe where cosmic entities shape reality. Unlimited resources, transcendent technology, and battles that reshape existence itself.',
    color: '#F59E0B', accentColor: '#D97706',
    image: 'https://readdy.ai/api/search-image?query=mythic%20golden%20cosmic%20universe%20reality%20rifts%20dimensional%20tears%20ancient%20entities%20swirling%20energy%20vortex%20epic%20scale%20eternal%20nexus&width=800&height=450&seq=u4cosmic&orientation=landscape',
    totalGalaxies: 90, galaxyCount: 90, totalPlayers: 8934, maxPlayers: 30000, isActive: true,
    launchDate: '2024-04-15', age: 'Primordial', density: 'Dense', hostility: 'Extreme', resources: 'Infinite', technology: 'Transcendent',
    specialFeatures: ['Cosmic Entities', 'Reality Rifts', 'Mythic Items', 'Transcendent Tech'],
  },
  {
    id: 'u5', name: 'Quantum Sea', class: 'Quantum', seed: 55555005,
    description: 'Physics operates in superposition here. Quantum mechanics govern combat, resource generation, and even the passage of time.',
    color: '#06B6D4', accentColor: '#0891B2',
    image: 'https://readdy.ai/api/search-image?query=quantum%20universe%20probability%20waves%20particle%20interference%20cyan%20teal%20energy%20fields%20physics%20visualization%20superposition&width=800&height=450&seq=u5cosmic&orientation=landscape',
    totalGalaxies: 90, galaxyCount: 90, totalPlayers: 31200, maxPlayers: 80000, isActive: true,
    launchDate: '2024-05-20', age: 'Mature', density: 'Normal', hostility: 'Moderate', resources: 'Normal', technology: 'Advanced',
    specialFeatures: ['Quantum Mechanics', 'Probability Events', 'Superposition Resources', 'Entangled Travel'],
  },
  {
    id: 'u6', name: 'Temporal Expanse', class: 'Ancient', seed: 66666006,
    description: 'Time flows at different rates across this ancient universe. Some regions experience centuries in hours, others barely age at all.',
    color: '#A78BFA', accentColor: '#7C3AED',
    image: 'https://readdy.ai/api/search-image?query=temporal%20universe%20time%20distortion%20clock%20spirals%20purple%20violet%20dimensional%20tears%20ancient%20cosmos%20time%20streams&width=800&height=450&seq=u6cosmic&orientation=landscape',
    totalGalaxies: 90, galaxyCount: 90, totalPlayers: 19800, maxPlayers: 60000, isActive: true,
    launchDate: '2024-06-10', age: 'Ancient', density: 'Normal', hostility: 'Dangerous', resources: 'Normal', technology: 'Transcendent',
    specialFeatures: ['Time Dilation', 'Temporal Rifts', 'Ancient Technology', 'Chronal Resources'],
  },
  {
    id: 'u7', name: 'Iron Crucible', class: 'Chaos', seed: 11111007,
    description: 'A universe of constant warfare. Fleets clash daily, alliances form and shatter, and only the strongest empires survive the eternal crucible.',
    color: '#EF4444', accentColor: '#DC2626',
    image: 'https://readdy.ai/api/search-image?query=chaos%20war%20universe%20red%20orange%20battle%20zones%20constant%20combat%20warship%20formations%20space%20warfare%20crucible%20iron&width=800&height=450&seq=u7cosmic&orientation=landscape',
    totalGalaxies: 90, galaxyCount: 90, totalPlayers: 24600, maxPlayers: 70000, isActive: true,
    launchDate: '2024-07-05', age: 'Mature', density: 'Dense', hostility: 'Extreme', resources: 'Normal', technology: 'Advanced',
    specialFeatures: ['Permanent War Zones', 'Combat Bonuses', 'War Spoils', 'Conquest Rewards'],
  },
  {
    id: 'u8', name: 'Crystalline Lattice', class: 'Peaceful', seed: 88888008,
    description: 'Crystal formations dominate the galaxies of this serene universe. Research and crafting bonuses are unmatched, drawing scientists from across the cosmos.',
    color: '#C084FC', accentColor: '#9333EA',
    image: 'https://readdy.ai/api/search-image?query=crystalline%20universe%20purple%20violet%20crystal%20formations%20planets%20gem%20structures%20peaceful%20serene%20cosmic%20environment&width=800&height=450&seq=u8cosmic&orientation=landscape',
    totalGalaxies: 90, galaxyCount: 90, totalPlayers: 42100, maxPlayers: 120000, isActive: true,
    launchDate: '2024-08-15', age: 'Young', density: 'Normal', hostility: 'Peaceful', resources: 'Abundant', technology: 'Advanced',
    specialFeatures: ['Crystal Abundance', 'Research Bonus', 'Crafting Mastery', 'Peaceful Coexistence'],
  },
  {
    id: 'u9', name: 'Obsidian Depths', class: 'Hardcore', seed: 22222009,
    description: 'The darkest universe in the cosmic hierarchy. Resources are scarce, dangers are everywhere, and every decision carries permanent consequences.',
    color: '#1E1B4B', accentColor: '#312E81',
    image: 'https://readdy.ai/api/search-image?query=obsidian%20dark%20universe%20black%20hole%20dominated%20void%20space%20scarce%20resources%20extreme%20danger%20hardcore%20survival%20cosmic%20horror&width=800&height=450&seq=u9cosmic&orientation=landscape',
    totalGalaxies: 90, galaxyCount: 90, totalPlayers: 5600, maxPlayers: 20000, isActive: true,
    launchDate: '2024-09-01', age: 'Primordial', density: 'Sparse', hostility: 'Extreme', resources: 'Scarce', technology: 'Advanced',
    specialFeatures: ['Permadeath Zones', 'Extreme Difficulty', 'Rare Resources', 'Legendary Worlds'],
  },
];

// Generate ALL 90 galaxies for a given universe
export function generateGalaxiesForUniverse(universe: UniverseData): GalaxyData[] {
  const rng = new CosmicRNG(universe.seed);
  const galaxies: GalaxyData[] = [];
  for (let i = 0; i < universe.galaxyCount; i++) {
    galaxies.push(generateGalaxy(rng, universe.id, i));
  }
  return galaxies;
}

// Get galaxy by ID from any universe
export function getGalaxyById(universeId: string, galaxyId: string): GalaxyData | null {
  const universe = NINE_UNIVERSES.find(u => u.id === universeId);
  if (!universe) return null;
  const galaxies = generateGalaxiesForUniverse(universe);
  return galaxies.find(g => g.id === galaxyId) || null;
}

// Get universe by ID
export function getUniverseById(id: string): UniverseData | undefined {
  return NINE_UNIVERSES.find(u => u.id === id);
}

// Generate a single sector
export function generateSector(galaxy: GalaxyData, sectorNumber: number): SectorData {
  const sectors = generateSectorsForGalaxy(galaxy, [sectorNumber]);
  return sectors[0];
}

// Generate a single solar system
export function generateSolarSystem(sector: SectorData, systemNumber: number): SolarSystemData {
  const systems = generateSolarSystemsForSector(sector, [systemNumber]);
  return systems[0];
}

// Get galaxy quadrant info
export function getQuadrantInfo(quadrantType: QuadrantType) {
  return QUADRANT_TYPE_DEFINITIONS[quadrantType];
}

// Get galaxy class info
export function getGalaxyClassInfo(letter: GalaxyClassLetter) {
  return {
    name: GALAXY_CLASS_NAMES[letter],
    subClasses: GALAXY_SUB_CLASSES[letter],
    color: GALAXY_CLASS_COLORS[letter],
    type: GALAXY_CLASS_TO_TYPE[letter],
  };
}

// Summarize the cosmic hierarchy
export function getCosmicSummary() {
  return {
    totalUniverses: NINE_UNIVERSES.length,
    totalGalaxies: NINE_UNIVERSES.reduce((sum, u) => sum + u.galaxyCount, 0),
    universesByClass: NINE_UNIVERSES.reduce((acc, u) => {
      acc[u.class] = (acc[u.class] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    totalPlayers: NINE_UNIVERSES.reduce((sum, u) => sum + u.totalPlayers, 0),
    maxPlayers: NINE_UNIVERSES.reduce((sum, u) => sum + u.maxPlayers, 0),
    quadrantTypes: Object.keys(QUADRANT_TYPE_DEFINITIONS).length,
    galaxyClasses: CLASS_LETTERS.length,
    sectorTypes: Object.keys(SECTOR_TYPE_DEFINITIONS).length,
    systemTypes: Object.keys(SOLAR_SYSTEM_DEFINITIONS).length,
    starTypes: Object.keys(STAR_CLASS_DEFINITIONS).length,
  };
}