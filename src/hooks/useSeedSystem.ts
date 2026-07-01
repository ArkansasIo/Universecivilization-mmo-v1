import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

/* ─────────────────────────────────────────────
   NMS-STYLE PORTAL GLYPH SYSTEM
   Every glyph maps to a value 0-15
───────────────────────────────────────────── */

export interface PortalGlyph {
  value: number;
  name: string;
  icon: string;
  color: string;
}

export const PORTAL_GLYPHS: PortalGlyph[] = [
  { value: 0, name: 'Starfall', icon: 'ri-sun-line', color: '#FFD700' },
  { value: 1, name: 'Bird', icon: 'ri-flight-takeoff-line', color: '#4ADE80' },
  { value: 2, name: 'Face', icon: 'ri-user-3-line', color: '#FB923C' },
  { value: 3, name: 'Diplo', icon: 'ri-bear-smile-line', color: '#A78BFA' },
  { value: 4, name: 'Eclipse', icon: 'ri-moon-line', color: '#F472B6' },
  { value: 5, name: 'Baloon', icon: 'ri-contrast-drop-line', color: '#38BDF8' },
  { value: 6, name: 'Boat', icon: 'ri-ship-line', color: '#F87171' },
  { value: 7, name: 'Bug', icon: 'ri-bug-line', color: '#34D399' },
  { value: 8, name: 'Dragonfly', icon: 'ri-flight-takeoff-fill', color: '#FB923C' },
  { value: 9, name: 'Galaxy', icon: 'ri-global-line', color: '#EC4899' },
  { value: 10, name: 'Hunter', icon: 'ri-crosshair-line', color: '#FBBF24' },
  { value: 11, name: 'Atlas', icon: 'ri-focus-3-line', color: '#EF4444' },
  { value: 12, name: 'Void', icon: 'ri-contrast-2-line', color: '#6B21A8' },
  { value: 13, name: 'Crescent', icon: 'ri-moon-foggy-line', color: '#60A5FA' },
  { value: 14, name: 'Spiral', icon: 'ri-infinity-line', color: '#A3E635' },
  { value: 15, name: 'Korvax', icon: 'ri-robot-2-line', color: '#F97316' },
];

export type SeedType = 'planet' | 'ship' | 'creature' | 'multitool' | 'base';

export type PlanetBiome =
  | 'Lush' | 'Barren' | 'Frozen' | 'Scorched' | 'Radioactive'
  | 'Toxic' | 'Dead' | 'Exotic' | 'Mega-Exotic' | 'Paradise';

export type ShipArchetype =
  | 'Fighter' | 'Hauler' | 'Explorer' | 'Shuttle' | 'Exotic'
  | 'Living Ship' | 'Solar' | 'Interceptor' | 'Sentinel';

export type CreatureType =
  | 'Diplo' | 'T-Rex' | 'Blob' | 'Flying Lizard' | 'Crab'
  | 'Rodent' | 'Cow' | 'Antelope' | 'Mole' | 'Strider'
  | 'Fish' | 'Jellyfish' | 'Beetle' | 'Rare Fauna' | 'Robot';

export type MultitoolClass = 'C' | 'B' | 'A' | 'S';
export type MultitoolType = 'Pistol' | 'Rifle' | 'Experimental' | 'Alien' | 'Royal' | 'Sentinel' | 'Staff';

export interface PlanetSeed {
  seedValue: number;
  glyphs: string;
  planetName: string;
  biome: PlanetBiome;
  weather: string;
  sentinelLevel: 'None' | 'Low' | 'Regular' | 'Aggressive' | 'Corrupted';
  resources: string[];
  flora: 'None' | 'Scarce' | 'Regular' | 'Abundant' | 'Bountiful';
  fauna: 'None' | 'Scarce' | 'Regular' | 'Abundant' | 'Bountiful';
  economyType: string;
  conflictLevel: 'Peaceful' | 'Low' | 'Medium' | 'High' | 'War';
  hasWater: boolean;
  hasPortal: boolean;
  terrainVariance: 'Flat' | 'Hilly' | 'Mountainous' | 'Extreme';
  skyColor: string;
  groundColor: string;
  exoticFeatures: string[];
  galacticCoords: { x: string; y: string; z: string; system: number };
}

export interface ShipSeed {
  seedValue: number;
  glyphs: string;
  shipName: string;
  archetype: ShipArchetype;
  className: string;
  slots: number;
  class: 'C' | 'B' | 'A' | 'S';
  techSlots: number;
  baseDamage: number;
  baseShield: number;
  baseHyperdrive: number;
  baseManeuverability: number;
  primaryColor: string;
  secondaryColor: string;
  parts: string[];
  exoticFeatures: string[];
}

export interface CreatureSeed {
  seedValue: number;
  glyphs: string;
  creatureName: string;
  creatureType: CreatureType;
  height: number;
  weight: number;
  temperament: string;
  diet: string;
  notes: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Ultra-Rare';
  hasWings: boolean;
  isAquatic: boolean;
  isPredator: boolean;
  color: string;
  exoticFeatures: string[];
}

export interface MultitoolSeed {
  seedValue: number;
  glyphs: string;
  toolName: string;
  toolType: MultitoolType;
  class: MultitoolClass;
  slots: number;
  baseDamage: number;
  baseMining: number;
  baseScan: number;
  primaryColor: string;
  secondaryColor: string;
  exoticFeatures: string[];
}

export interface SeedDiscovery {
  id: string;
  seed_value: number;
  seed_type: SeedType;
  name: string;
  glyphs: string;
  discovered_at: string;
  seed_properties: any;
}

/* ─────────────────────────────────────────────
   SEED → GLYPHS CONVERSION (NMS-style)
───────────────────────────────────────────── */

// Convert a 64-bit seed to 12 portal glyphs
export function seedToGlyphs(seed: number): string {
  const glyphValues: number[] = [];
  let remaining = Math.abs(seed);

  for (let i = 0; i < 12; i++) {
    glyphValues.push(remaining % 16);
    remaining = Math.floor(remaining / 16);
  }

  return glyphValues.map(v => getGlyphByValue(v).name).join(' · ');
}

// Convert 12 glyph values back to seed
export function glyphsToSeed(glyphValues: number[]): number {
  let seed = 0;
  for (let i = glyphValues.length - 1; i >= 0; i--) {
    seed = seed * 16 + (glyphValues[i] % 16);
  }
  return seed;
}

export function getGlyphByValue(value: number): PortalGlyph {
  return PORTAL_GLYPHS[Math.abs(value) % 16] || PORTAL_GLYPHS[0];
}

export function getGlyphByName(name: string): PortalGlyph | undefined {
  return PORTAL_GLYPHS.find(g => g.name.toLowerCase() === name.toLowerCase());
}

/* ─────────────────────────────────────────────
   SEEDED PSEUDO-RANDOM GENERATOR (mulberry32)
───────────────────────────────────────────── */

function mulberry32(a: number): () => number {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function pickSeeded<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pickWeighted<T>(items: T[], weights: number[], rng: () => number): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = rng() * total;
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return items[i];
  }
  return items[items.length - 1];
}

/* ─────────────────────────────────────────────
   GENERATION FUNCTIONS
───────────────────────────────────────────── */

const PLANET_NAME_PREFIXES = ['New', 'Old', 'Alpha', 'Beta', 'Omega', 'Prime', 'Nova', 'Ultima', 'Eden', 'Atlas', 'Korvax', 'Vykeen', 'Gek', 'Zeta', 'Sigma', 'Theta'];
const PLANET_NAME_SUFFIXES = ['Prime', 'Major', 'Minor', 'I', 'II', 'III', 'IV', 'Alpha', 'Beta', 'Omega', 'Zeta'];

const SHIP_NAME_PREFIXES = ['Radiant', 'Blazing', 'Frozen', 'Silent', 'Boundless', 'Eternal', 'Stellar', 'Cosmic', 'Quantum', 'Void'];
const SHIP_NAME_SUFFIXES = ['Pillar', 'Dancer', 'Horizon', 'Wings', 'Dream', 'Nemesis', 'Guardian', 'Seeker', 'Pathfinder', 'Voyager'];

export function generatePlanetFromSeed(seed: number): PlanetSeed {
  const rng = mulberry32(seed);

  const biomes: PlanetBiome[] = ['Lush', 'Barren', 'Frozen', 'Scorched', 'Radioactive', 'Toxic', 'Dead', 'Exotic', 'Mega-Exotic', 'Paradise'];
  const biomeWeights = [14, 12, 12, 12, 10, 10, 8, 5, 3, 4];
  const biome = pickWeighted(biomes, biomeWeights, rng);

  const biomeData: Record<PlanetBiome, { weather: string[]; resources: string[]; skyColors: string[]; groundColors: string[] }> = {
    'Lush': { weather: ['Pleasant', 'Mild Rain', 'Refreshing Breeze', 'Tropical Storms', 'Boiling Puddles'], resources: ['Star Bulb', 'Paraffinium', 'Nitrogen'], skyColors: ['#87CEEB', '#98FB98', '#F0E68C'], groundColors: ['#228B22', '#556B2F', '#8FBC8F'] },
    'Barren': { weather: ['Dusty', 'Sandstorms', 'Searing', 'Invisible Mist', 'Wind-Swept'], resources: ['Cactus Flesh', 'Pyrite', 'Sulphurine'], skyColors: ['#F4A460', '#DEB887', '#D2691E'], groundColors: ['#C4A882', '#D2B48C', '#A0522D'] },
    'Frozen': { weather: ['Freezing', 'Blizzards', 'Icy Winds', 'Cryo Storms', 'Whiteout'], resources: ['Frost Crystal', 'Dioxite', 'Radon'], skyColors: ['#B0E0E6', '#E0FFFF', '#87CEEB'], groundColors: ['#F0F8FF', '#E6E6FA', '#B0C4DE'] },
    'Scorched': { weather: ['Incendiary', 'Fire Storms', 'Burning Air', 'Atmospheric Heat'], resources: ['Solanium', 'Phosphorus', 'Sulphurine'], skyColors: ['#FF6347', '#FF4500', '#FF8C00'], groundColors: ['#8B4513', '#A0522D', '#D2691E'] },
    'Radioactive': { weather: ['Irradiated', 'Rad Storms', 'Gamma Winds', 'Nuclear Fog'], resources: ['Gamma Root', 'Uranium', 'Radon'], skyColors: ['#7FFF00', '#ADFF2F', '#9ACD32'], groundColors: ['#556B2F', '#6B8E23', '#808000'] },
    'Toxic': { weather: ['Toxic Rain', 'Acid Storms', 'Poison Fog', 'Corrosive Mist'], resources: ['Fungal Mould', 'Ammonia', 'Nitrogen'], skyColors: ['#9ACD32', '#6B8E23', '#8FBC8F'], groundColors: ['#3CB371', '#2E8B57', '#006400'] },
    'Dead': { weather: ['Silent', 'Airless', 'Lifeless', 'Eerie Calm'], resources: ['Rusted Metal', 'Magnetised Ferrite'], skyColors: ['#696969', '#808080', '#A9A9A9'], groundColors: ['#808080', '#696969', '#778899'] },
    'Exotic': { weather: ['Anomalous', 'Bizarre', 'Unstable', 'Reality Glitch'], resources: ['Gold', 'Silver', 'Hexaberry'], skyColors: ['#FF1493', '#00FF7F', '#FFD700'], groundColors: ['#FF69B4', '#7B68EE', '#00FFFF'] },
    'Mega-Exotic': { weather: ['Crimson Haze', 'Chromatic Fog', 'Warping Reality', 'Inverted Storms'], resources: ['Activated Indium', 'Activated Cadmium', 'Hexite'], skyColors: ['#FF0000', '#FF1493', '#9400D3'], groundColors: ['#8B008B', '#4B0082', '#800080'] },
    'Paradise': { weather: ['Beautiful', 'Pleasant', 'Mild', 'Temperate'], resources: ['Star Bulb', 'Paraffinium', 'Nitrogen', 'Mordite'], skyColors: ['#87CEEB', '#00BFFF', '#1E90FF'], groundColors: ['#32CD32', '#7CFC00', '#00FF7F'] },
  };

  const data = biomeData[biome];
  const prefix = pickSeeded(PLANET_NAME_PREFIXES, rng);
  const suffix = pickSeeded(PLANET_NAME_SUFFIXES, rng);

  const sentinelLevels: PlanetSeed['sentinelLevel'][] = ['None', 'Low', 'Regular', 'Aggressive', 'Corrupted'];
  const sentinelWeights = [10, 25, 30, 25, 10];
  const floraLevels: PlanetSeed['flora'][] = ['None', 'Scarce', 'Regular', 'Abundant', 'Bountiful'];
  const faunaLevels: PlanetSeed['fauna'][] = ['None', 'Scarce', 'Regular', 'Abundant', 'Bountiful'];
  const conflictLevels: PlanetSeed['conflictLevel'][] = ['Peaceful', 'Low', 'Medium', 'High', 'War'];
  const terrainTypes: PlanetSeed['terrainVariance'][] = ['Flat', 'Hilly', 'Mountainous', 'Extreme'];

  const economyTypes = ['Mining', 'Manufacturing', 'Technology', 'Power Generation', 'Trading', 'Scientific', 'Alchemical', 'Construction', 'Mass Production', 'Research'];

  const exoticFeatures: string[] = [];
  if (biome === 'Exotic' || biome === 'Mega-Exotic') {
    const exotics = ['Bubbles', 'Hexagonal Terrain', 'Beams of Light', 'Chromatic Aberration', 'Floating Crystals', 'Inverted Worlds', 'Monochrome Flora'];
    for (let i = 0; i < Math.floor(rng() * 3) + 1; i++) {
      exoticFeatures.push(pickSeeded(exotics, rng));
    }
  }

  return {
    seedValue: seed,
    glyphs: seedToGlyphs(seed),
    planetName: `${prefix} ${pickSeeded(['Aether', 'Zion', 'Elysium', 'Arcadia', 'Nova', 'Terra', 'Gaia', 'Helios', 'Lumina', 'Drakos'], rng)} ${suffix}`,
    biome,
    weather: pickSeeded(data.weather, rng),
    sentinelLevel: pickWeighted(sentinelLevels, sentinelWeights, rng),
    resources: data.resources.slice(0, Math.floor(rng() * 3) + 2),
    flora: pickWeighted(floraLevels, [5, 15, 35, 30, 15], rng),
    fauna: pickWeighted(faunaLevels, [5, 15, 35, 30, 15], rng),
    economyType: pickSeeded(economyTypes, rng),
    conflictLevel: pickWeighted(conflictLevels, [15, 25, 30, 20, 10], rng),
    hasWater: rng() > 0.3,
    hasPortal: rng() > 0.25,
    terrainVariance: pickWeighted(terrainTypes, [15, 35, 35, 15], rng),
    skyColor: pickSeeded(data.skyColors, rng),
    groundColor: pickSeeded(data.groundColors, rng),
    exoticFeatures,
    galacticCoords: {
      x: String.fromCharCode(65 + Math.floor(rng() * 26)) + String.fromCharCode(65 + Math.floor(rng() * 26)) + String.fromCharCode(65 + Math.floor(rng() * 26)),
      y: String.fromCharCode(65 + Math.floor(rng() * 26)) + String.fromCharCode(65 + Math.floor(rng() * 26)) + String.fromCharCode(65 + Math.floor(rng() * 26)),
      z: String.fromCharCode(65 + Math.floor(rng() * 26)) + String.fromCharCode(65 + Math.floor(rng() * 26)) + String.fromCharCode(65 + Math.floor(rng() * 26)),
      system: Math.floor(rng() * 499) + 1,
    },
  };
}

export function generateShipFromSeed(seed: number): ShipSeed {
  const rng = mulberry32(seed);

  const archetypes: ShipArchetype[] = ['Fighter', 'Hauler', 'Explorer', 'Shuttle', 'Exotic', 'Solar', 'Interceptor'];
  const archWeights = [22, 18, 18, 16, 5, 10, 11];
  const archetype = pickWeighted(archetypes, archWeights, rng);

  const archData: Record<ShipArchetype, { classChances: number[]; slotRange: [number, number]; techRange: [number, number]; dmgRange: [number, number]; shieldRange: [number, number]; hyperRange: [number, number]; manRange: [number, number] }> = {
    'Fighter': { classChances: [30, 35, 25, 10], slotRange: [19, 38], techRange: [4, 12], dmgRange: [50, 80], shieldRange: [30, 55], hyperRange: [100, 150], manRange: [55, 75] },
    'Hauler': { classChances: [30, 35, 25, 10], slotRange: [25, 48], techRange: [4, 12], dmgRange: [20, 35], shieldRange: [50, 75], hyperRange: [80, 130], manRange: [25, 45] },
    'Explorer': { classChances: [25, 35, 28, 12], slotRange: [19, 38], techRange: [4, 12], dmgRange: [25, 40], shieldRange: [40, 60], hyperRange: [140, 180], manRange: [45, 65] },
    'Shuttle': { classChances: [40, 35, 20, 5], slotRange: [18, 28], techRange: [3, 8], dmgRange: [25, 45], shieldRange: [35, 55], hyperRange: [90, 140], manRange: [40, 60] },
    'Exotic': { classChances: [0, 0, 35, 65], slotRange: [15, 25], techRange: [4, 12], dmgRange: [40, 65], shieldRange: [45, 70], hyperRange: [130, 165], manRange: [60, 80] },
    'Solar': { classChances: [28, 35, 25, 12], slotRange: [19, 38], techRange: [5, 13], dmgRange: [45, 70], shieldRange: [35, 60], hyperRange: [120, 160], manRange: [50, 70] },
    'Interceptor': { classChances: [20, 32, 30, 18], slotRange: [20, 40], techRange: [5, 15], dmgRange: [55, 85], shieldRange: [55, 75], hyperRange: [110, 155], manRange: [50, 75] },
  };

  const ad = archData[archetype];
  const classRoll = rng() * 100;
  const classIdx = classRoll < ad.classChances[0] ? 0 : classRoll < (ad.classChances[0] + ad.classChances[1]) ? 1 : classRoll < (ad.classChances[0] + ad.classChances[1] + ad.classChances[2]) ? 2 : 3;
  const classes: ('C' | 'B' | 'A' | 'S')[] = ['C', 'B', 'A', 'S'];

  const colors = ['#FF4500', '#FFD700', '#00FF7F', '#FF1493', '#00BFFF', '#FF6347', '#7B68EE', '#32CD32', '#F0E68C', '#FFFFFF', '#C0C0C0', '#FF8C00'];
  const parts = ['Dorsal Fin', 'Tie Wings', 'Heavy Nose', 'Box Thruster', 'Triple Thruster', 'Round Cockpit', 'Fighter Cockpit', 'Hauler Wings', 'Explorer Solar Panels', 'Needle Nose'];

  const prefix = pickSeeded(SHIP_NAME_PREFIXES, rng);
  const suffix = pickSeeded(SHIP_NAME_SUFFIXES, rng);

  const exoticFeatures: string[] = [];
  if (archetype === 'Exotic' || classIdx >= 3) {
    exoticFeatures.push(pickSeeded(['Royal Finish', 'Gilded Accents', 'Holographic Decals', 'Crystalline Canopy', 'Ethereal Trail'], rng));
  }

  return {
    seedValue: seed,
    glyphs: seedToGlyphs(seed),
    shipName: `${prefix} ${suffix}`,
    archetype,
    className: classes[classIdx],
    slots: Math.floor(rng() * (ad.slotRange[1] - ad.slotRange[0])) + ad.slotRange[0],
    class: classes[classIdx],
    techSlots: Math.floor(rng() * (ad.techRange[1] - ad.techRange[0])) + ad.techRange[0],
    baseDamage: Math.floor(rng() * (ad.dmgRange[1] - ad.dmgRange[0])) + ad.dmgRange[0],
    baseShield: Math.floor(rng() * (ad.shieldRange[1] - ad.shieldRange[0])) + ad.shieldRange[0],
    baseHyperdrive: Math.floor(rng() * (ad.hyperRange[1] - ad.hyperRange[0])) + ad.hyperRange[0],
    baseManeuverability: Math.floor(rng() * (ad.manRange[1] - ad.manRange[0])) + ad.manRange[0],
    primaryColor: pickSeeded(colors, rng),
    secondaryColor: pickSeeded(colors, rng),
    parts: Array.from({ length: Math.floor(rng() * 4) + 2 }, () => pickSeeded(parts, rng)),
    exoticFeatures,
  };
}

export function generateCreatureFromSeed(seed: number): CreatureSeed {
  const rng = mulberry32(seed);

  const creatureTypes: CreatureType[] = ['Diplo', 'T-Rex', 'Blob', 'Flying Lizard', 'Crab', 'Rodent', 'Cow', 'Antelope', 'Mole', 'Strider', 'Fish', 'Jellyfish', 'Beetle', 'Rare Fauna', 'Robot'];
  const creatureType = pickWeighted(creatureTypes, [6, 5, 10, 7, 8, 10, 9, 7, 6, 6, 7, 5, 6, 3, 2], rng);

  const temperaments = ['Docile', 'Skittish', 'Calm', 'Bold', 'Aggressive', 'Hunter', 'Unpredictable', 'Playful', 'Territorial', 'Passive'];
  const diets = ['Herbivore', 'Carnivore', 'Omnivore', 'Scavenger', 'Absorbs Nutrients', 'Consumes Minerals', 'Detritivore', 'Photosynthetic'];
  const colors = ['#FF6347', '#FFD700', '#00FF7F', '#FF1493', '#00BFFF', '#FF8C00', '#7B68EE', '#32CD32', '#8B4513', '#F0E68C'];
  const rarities: CreatureSeed['rarity'][] = ['Common', 'Uncommon', 'Rare', 'Ultra-Rare'];
  const rarityWeights = [40, 30, 20, 10];

  const exoticFeatures: string[] = [];
  if (creatureType === 'Rare Fauna' || creatureType === 'Robot') {
    exoticFeatures.push(pickSeeded(['Bioluminescent', 'Crystalline Skin', 'Mechanical Components', 'Energy Aura', 'Phases In/Out', 'Multi-Headed'], rng));
  }

  return {
    seedValue: seed,
    glyphs: seedToGlyphs(seed),
    creatureName: pickSeeded(['G. Moontrolica', 'X. Radiantquae', 'Z. Cloudwingu', 'O. Stridersea', 'U. Beetlecae', 'R. Oningidica', 'F. Felinumeum', 'Y. Dracoretica', 'K. Elephantiq', 'T. Stardrae'], rng),
    creatureType,
    height: Math.round((rng() * 6 + 0.3) * 10) / 10,
    weight: Math.round((rng() * 200 + 3) * 10) / 10,
    temperament: pickSeeded(temperaments, rng),
    diet: pickSeeded(diets, rng),
    notes: pickSeeded(['Dislikes being scanned', 'Can feel love', 'Has no internal organs', 'Makes art with its tail', 'Communicates through bioluminescence', 'Hibernates for decades', 'Always found in groups', 'Sheds skin annually', 'Underwater cave dweller', 'Produces valuable enzymes'], rng),
    rarity: pickWeighted(rarities, rarityWeights, rng),
    hasWings: creatureType === 'Flying Lizard' || (creatureType !== 'Fish' && creatureType !== 'Jellyfish' && rng() > 0.8),
    isAquatic: creatureType === 'Fish' || creatureType === 'Jellyfish',
    isPredator: ['Carnivore', 'Hunter'].includes(pickSeeded(diets, rng)),
    color: pickSeeded(colors, rng),
    exoticFeatures,
  };
}

export function generateMultitoolFromSeed(seed: number): MultitoolSeed {
  const rng = mulberry32(seed);

  const types: MultitoolType[] = ['Pistol', 'Rifle', 'Experimental', 'Alien', 'Royal', 'Sentinel', 'Staff'];
  const typeWeights = [20, 30, 15, 12, 8, 10, 5];
  const toolType = pickWeighted(types, typeWeights, rng);

  const classes: MultitoolClass[] = ['C', 'B', 'A', 'S'];
  const classWeights = [35, 32, 23, 10];
  const cls = pickWeighted(classes, classWeights, rng);

  const colors = ['#FF4500', '#FFD700', '#00FF7F', '#FF1493', '#00BFFF', '#7B68EE', '#32CD32', '#FFFFFF', '#C0C0C0'];

  const slotsByClass: Record<string, [number, number]> = { 'C': [10, 16], 'B': [14, 20], 'A': [18, 24], 'S': [24, 30] };

  return {
    seedValue: seed,
    glyphs: seedToGlyphs(seed),
    toolName: pickSeeded(['Pillar of Light', 'Omen of Destruction', 'Dreams of the Void', 'Whisper of Atlas', 'Gift of the Ancients', 'Song of Eternity', 'Echo of Dawn', 'Fist of Korvax', 'Shadow of the Past', 'Hand of Fate'], rng),
    toolType,
    class: cls,
    slots: Math.floor(rng() * (slotsByClass[cls][1] - slotsByClass[cls][0])) + slotsByClass[cls][0],
    baseDamage: Math.floor(rng() * 2000 + 300),
    baseMining: Math.floor(rng() * 400 + 50),
    baseScan: Math.floor(rng() * 600 + 100),
    primaryColor: pickSeeded(colors, rng),
    secondaryColor: pickSeeded(colors, rng),
    exoticFeatures: toolType === 'Alien' || toolType === 'Royal' ? ['Crystalline Core', 'Pulsing Veins', 'Organic Components', 'Animated Surface'] : [],
  };
}

/* ─────────────────────────────────────────────
   HOOK
───────────────────────────────────────────── */

export function useSeedSystem(playerId: string) {
  const [discoveries, setDiscoveries] = useState<SeedDiscovery[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDiscoveries = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('seed_discoveries')
        .select('*')
        .eq('player_id', playerId)
        .order('discovered_at', { ascending: false });

      if (error) throw error;
      setDiscoveries(data || []);
    } catch (err) {
      console.error('Error loading seed discoveries:', err);
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    if (playerId) loadDiscoveries();
  }, [playerId, loadDiscoveries]);

  const generateFromSeed = useCallback((seed: number, type: SeedType) => {
    switch (type) {
      case 'planet': return generatePlanetFromSeed(seed);
      case 'ship': return generateShipFromSeed(seed);
      case 'creature': return generateCreatureFromSeed(seed);
      case 'multitool': return generateMultitoolFromSeed(seed);
      default: return generatePlanetFromSeed(seed);
    }
  }, []);

  const discoverSeed = useCallback(async (seed: number, type: SeedType, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const glyphs = seedToGlyphs(seed);
      let properties: any = {};

      switch (type) {
        case 'planet': properties = generatePlanetFromSeed(seed); break;
        case 'ship': properties = generateShipFromSeed(seed); break;
        case 'creature': properties = generateCreatureFromSeed(seed); break;
        case 'multitool': properties = generateMultitoolFromSeed(seed); break;
      }

      const { error } = await supabase
        .from('seed_discoveries')
        .insert({
          player_id: playerId,
          seed_value: seed,
          seed_type: type,
          name,
          glyphs,
          seed_properties: properties,
        });

      if (error) {
        if (error.code === '23505') return { success: false, error: 'This seed has already been discovered' };
        throw error;
      }

      await loadDiscoveries();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, [playerId, loadDiscoveries]);

  const deleteDiscovery = useCallback(async (discoveryId: string): Promise<{ success: boolean }> => {
    try {
      await supabase.from('seed_discoveries').delete().eq('id', discoveryId);
      await loadDiscoveries();
      return { success: true };
    } catch {
      return { success: false };
    }
  }, [loadDiscoveries]);

  // Generate a random seed
  const generateRandomSeed = useCallback((): number => {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }, []);

  // Seed popular pre-discovered seeds
  const FEATURED_SEEDS: { seed: number; type: SeedType; name: string }[] = [
    { seed: 0x42, type: 'planet', name: 'New Eden Prime' },
    { seed: 0x7A3F9C1B, type: 'planet', name: 'Atlas Station Zero' },
    { seed: 0xDEADBEEF, type: 'ship', name: 'The Golden Vector' },
    { seed: 0xCAFEBABE, type: 'creature', name: 'Diplo Rex Major' },
    { seed: 0xB16B00B5, type: 'multitool', name: 'Pillar of Korvax' },
    { seed: 0x5EEDC0DE, type: 'planet', name: 'Teyaypilny Galaxy Core' },
    { seed: 0x1337C0DE, type: 'ship', name: 'Squidship Eternal' },
    { seed: 0xFEEDFACE, type: 'creature', name: 'Void Jellyfish' },
    { seed: 0x8BADF00D, type: 'multitool', name: 'Alien S-Class Rifle' },
    { seed: 0xABADCAFE, type: 'planet', name: 'Eissentam Hub Capital' },
    { seed: 0x1CEB00DA, type: 'ship', name: 'Radiant Pillar BC1' },
    { seed: 0xD15EA5ED, type: 'planet', name: 'Xenobiome Zero-One' },
  ];

  return {
    discoveries,
    loading,
    FEATURED_SEEDS,
    generateFromSeed,
    discoverSeed,
    deleteDiscovery,
    generateRandomSeed,
    seedToGlyphs,
    glyphsToSeed,
    getGlyphByValue,
    getGlyphByName,
    PORTAL_GLYPHS,
    reload: loadDiscoveries,
  };
}