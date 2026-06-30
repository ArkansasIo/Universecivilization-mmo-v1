// ═══════════════════════════════════════════════════════════════════
// STELLARIS VIEW — Universe Data & Types
// ═══════════════════════════════════════════════════════════════════

export type StarClass = 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M' | 'neutron' | 'pulsar' | 'black_hole';
export type SystemStatus = 'controlled' | 'contested' | 'frontier' | 'uncharted' | 'war_zone';
export type DiplomacyStatus = 'ally' | 'federation' | 'nap' | 'rival' | 'war' | 'neutral' | 'subject';
export type FleetType = 'military' | 'civilian' | 'science' | 'colony';
export type AnomalyType = 'nebula' | 'black_hole' | 'pulsar' | 'wormhole' | 'precursor_ruins' | 'asteroid_field';

export interface Empire {
  id: string;
  name: string;
  tag: string;
  color: string;
  secondaryColor: string;
  flag: string;
  capital: string;
  systems: number;
  fleets: number;
  power: number;
  tech: number;
  diplomacy: Record<string, DiplomacyStatus>;
  species: string;
  ethics: string[];
  government: string;
}

export interface StarSystem {
  id: string;
  name: string;
  x: number;
  y: number;
  starClass: StarClass;
  starSize: number;
  planets: number;
  habitablePlanets: number;
  controller: string | null;
  occupier?: string | null;
  status: SystemStatus;
  population: number;
  fleet: boolean;
  starbase?: 'outpost' | 'starport' | 'starhold' | 'star_fortress' | 'citadel';
  anomaly?: AnomalyType;
  hyperlanes: string[];
  isCapital?: boolean;
  isGateway?: boolean;
  resources: { energy: number; minerals: number; food: number; alloys: number; };
  discovered: boolean;
  warFront?: boolean;
}

export interface Fleet {
  id: string;
  name: string;
  empire: string;
  type: FleetType;
  ships: number;
  power: number;
  fromSystem: string;
  toSystem: string | null;
  progress: number;
  x: number;
  y: number;
}

export interface GalacticEvent {
  id: string;
  type: 'war' | 'peace' | 'alliance' | 'crisis' | 'anomaly' | 'discovery';
  title: string;
  description: string;
  time: string;
  empire?: string;
  empireColor?: string;
}

// ─────────────────────────────────────────────────
// EMPIRES
// ─────────────────────────────────────────────────
export const EMPIRES: Record<string, Empire> = {
  player: {
    id: 'player',
    name: 'Nexus Dominion',
    tag: 'NDM',
    color: '#00d4ff',
    secondaryColor: '#007aff',
    flag: 'ri-earth-line',
    capital: 'sol',
    systems: 14,
    fleets: 3,
    power: 85000,
    tech: 92,
    diplomacy: { stellaric: 'ally', iron_pact: 'nap', void_empire: 'war', merchant_guild: 'neutral', nomad_clans: 'neutral' },
    species: 'Humans',
    ethics: ['Militarist', 'Materialist'],
    government: 'Galactic Republic',
  },
  stellaric: {
    id: 'stellaric',
    name: 'Stellaric Conclave',
    tag: 'STC',
    color: '#a78bfa',
    secondaryColor: '#7c3aed',
    flag: 'ri-star-line',
    capital: 'stellara_prime',
    systems: 11,
    fleets: 4,
    power: 110000,
    tech: 105,
    diplomacy: { player: 'ally', iron_pact: 'rival', void_empire: 'nap', merchant_guild: 'neutral', nomad_clans: 'ally' },
    species: 'Stellarans',
    ethics: ['Pacifist', 'Xenophile'],
    government: 'Oligarchic Senate',
  },
  iron_pact: {
    id: 'iron_pact',
    name: 'Iron Pact',
    tag: 'IRP',
    color: '#f87171',
    secondaryColor: '#dc2626',
    flag: 'ri-shield-line',
    capital: 'ferrum',
    systems: 18,
    fleets: 7,
    power: 195000,
    tech: 78,
    diplomacy: { player: 'neutral', stellaric: 'rival', void_empire: 'war', merchant_guild: 'war', nomad_clans: 'neutral' },
    species: 'Ferrans',
    ethics: ['Militarist', 'Authoritarian'],
    government: 'Military Dictatorship',
  },
  void_empire: {
    id: 'void_empire',
    name: 'Void Collective',
    tag: 'VCL',
    color: '#f59e0b',
    secondaryColor: '#d97706',
    flag: 'ri-eye-line',
    capital: 'void_nexus',
    systems: 9,
    fleets: 5,
    power: 140000,
    tech: 130,
    diplomacy: { player: 'war', stellaric: 'nap', iron_pact: 'war', merchant_guild: 'neutral', nomad_clans: 'neutral' },
    species: 'Void Entities',
    ethics: ['Xenophobe', 'Materialist'],
    government: 'Hive Mind',
  },
  merchant_guild: {
    id: 'merchant_guild',
    name: 'Merchant Syndicate',
    tag: 'MSY',
    color: '#34d399',
    secondaryColor: '#059669',
    flag: 'ri-store-2-line',
    capital: 'tradewind',
    systems: 7,
    fleets: 2,
    power: 45000,
    tech: 88,
    diplomacy: { player: 'neutral', stellaric: 'neutral', iron_pact: 'war', void_empire: 'neutral', nomad_clans: 'ally' },
    species: 'Mercantiles',
    ethics: ['Egalitarian', 'Pacifist'],
    government: 'Merchant Republic',
  },
  nomad_clans: {
    id: 'nomad_clans',
    name: 'Nomad Clans',
    tag: 'NMD',
    color: '#fb923c',
    secondaryColor: '#ea580c',
    flag: 'ri-compass-3-line',
    capital: 'wanderer',
    systems: 5,
    fleets: 6,
    power: 60000,
    tech: 65,
    diplomacy: { player: 'neutral', stellaric: 'ally', iron_pact: 'neutral', void_empire: 'neutral', merchant_guild: 'ally' },
    species: 'Wanderers',
    ethics: ['Spiritualist', 'Egalitarian'],
    government: 'Clan Council',
  },
};

// ─────────────────────────────────────────────────
// STAR SYSTEMS — 64 systems across the galaxy
// ─────────────────────────────────────────────────
export const STAR_SYSTEMS: StarSystem[] = [
  // ── Player (Nexus Dominion) systems ──
  { id: 'sol', name: 'Sol', x: 420, y: 380, starClass: 'G', starSize: 14, planets: 8, habitablePlanets: 3, controller: 'player', status: 'controlled', population: 12500000, fleet: true, starbase: 'citadel', hyperlanes: ['alpha_centauri', 'barnards_star', 'nova_prime', 'kepler_5'], isCapital: true, resources: { energy: 120, minerals: 85, food: 95, alloys: 45 }, discovered: true },
  { id: 'alpha_centauri', name: 'Alpha Centauri', x: 360, y: 320, starClass: 'G', starSize: 12, planets: 5, habitablePlanets: 2, controller: 'player', status: 'controlled', population: 4200000, fleet: false, starbase: 'starhold', hyperlanes: ['sol', 'proxima', 'nova_prime'], resources: { energy: 80, minerals: 60, food: 70, alloys: 30 }, discovered: true },
  { id: 'proxima', name: 'Proxima', x: 300, y: 270, starClass: 'M', starSize: 9, planets: 3, habitablePlanets: 1, controller: 'player', status: 'controlled', population: 1800000, fleet: false, starbase: 'starport', hyperlanes: ['alpha_centauri', 'forge_world', 'frontier_7'], resources: { energy: 40, minerals: 90, food: 30, alloys: 15 }, discovered: true },
  { id: 'barnards_star', name: "Barnard's Star", x: 490, y: 310, starClass: 'M', starSize: 9, planets: 4, habitablePlanets: 1, controller: 'player', status: 'controlled', population: 2100000, fleet: true, starbase: 'starhold', hyperlanes: ['sol', 'tau_ceti', 'nexus_gate'], resources: { energy: 55, minerals: 75, food: 45, alloys: 20 }, discovered: true },
  { id: 'tau_ceti', name: 'Tau Ceti', x: 555, y: 350, starClass: 'G', starSize: 11, planets: 6, habitablePlanets: 2, controller: 'player', status: 'controlled', population: 3400000, fleet: false, starbase: 'starhold', hyperlanes: ['barnards_star', 'epsilon_indi', 'kepler_5'], resources: { energy: 95, minerals: 65, food: 85, alloys: 35 }, discovered: true },
  { id: 'nova_prime', name: 'Nova Prime', x: 395, y: 445, starClass: 'F', starSize: 13, planets: 7, habitablePlanets: 3, controller: 'player', status: 'controlled', population: 5600000, fleet: false, starbase: 'star_fortress', hyperlanes: ['sol', 'alpha_centauri', 'deep_reach', 'verdant'], resources: { energy: 105, minerals: 70, food: 115, alloys: 40 }, discovered: true },
  { id: 'kepler_5', name: 'Kepler-5', x: 480, y: 445, starClass: 'K', starSize: 10, planets: 4, habitablePlanets: 1, controller: 'player', status: 'controlled', population: 1500000, fleet: false, starbase: 'outpost', hyperlanes: ['sol', 'tau_ceti', 'borderland_2'], resources: { energy: 50, minerals: 45, food: 40, alloys: 25 }, discovered: true },
  { id: 'epsilon_indi', name: 'Epsilon Indi', x: 620, y: 330, starClass: 'K', starSize: 10, planets: 5, habitablePlanets: 2, controller: 'player', status: 'controlled', population: 2800000, fleet: false, starbase: 'starport', hyperlanes: ['tau_ceti', 'iron_gate_1', 'frontier_e1'], resources: { energy: 70, minerals: 80, food: 60, alloys: 30 }, discovered: true },
  { id: 'nexus_gate', name: 'Nexus Gate', x: 530, y: 280, starClass: 'A', starSize: 13, planets: 3, habitablePlanets: 0, controller: 'player', status: 'controlled', population: 800000, fleet: false, starbase: 'starhold', hyperlanes: ['barnards_star', 'gateway_bridge', 'stellara_approach'], isGateway: true, resources: { energy: 180, minerals: 30, food: 10, alloys: 90 }, discovered: true },
  { id: 'forge_world', name: 'Forge World', x: 260, y: 330, starClass: 'K', starSize: 11, planets: 4, habitablePlanets: 0, controller: 'player', status: 'controlled', population: 3200000, fleet: true, starbase: 'star_fortress', hyperlanes: ['proxima', 'frontier_7', 'dust_cloud'], resources: { energy: 60, minerals: 200, food: 15, alloys: 180 }, discovered: true },
  { id: 'verdant', name: 'Verdant', x: 350, y: 510, starClass: 'G', starSize: 12, planets: 6, habitablePlanets: 4, controller: 'player', status: 'controlled', population: 6800000, fleet: false, starbase: 'starport', hyperlanes: ['nova_prime', 'deep_reach', 'border_south_1'], resources: { energy: 80, minerals: 55, food: 220, alloys: 20 }, discovered: true },
  { id: 'deep_reach', name: 'Deep Reach', x: 420, y: 530, starClass: 'F', starSize: 12, planets: 5, habitablePlanets: 2, controller: 'player', status: 'frontier', population: 900000, fleet: false, starbase: 'outpost', hyperlanes: ['nova_prime', 'verdant', 'nomad_1', 'border_south_2'], resources: { energy: 65, minerals: 70, food: 55, alloys: 35 }, discovered: true },
  { id: 'borderland_2', name: 'Borderland-2', x: 560, y: 440, starClass: 'M', starSize: 9, planets: 3, habitablePlanets: 0, controller: 'player', status: 'frontier', population: 400000, fleet: false, starbase: 'outpost', hyperlanes: ['kepler_5', 'iron_gate_1', 'contested_3'], resources: { energy: 35, minerals: 55, food: 20, alloys: 15 }, discovered: true },
  { id: 'frontier_e1', name: 'Frontier E1', x: 680, y: 310, starClass: 'M', starSize: 8, planets: 2, habitablePlanets: 0, controller: 'player', status: 'frontier', population: 200000, fleet: false, starbase: 'outpost', hyperlanes: ['epsilon_indi', 'iron_front_1'], resources: { energy: 30, minerals: 40, food: 15, alloys: 10 }, discovered: true },

  // ── Stellaric Conclave systems ──
  { id: 'stellara_prime', name: 'Stellara Prime', x: 230, y: 180, starClass: 'A', starSize: 14, planets: 9, habitablePlanets: 4, controller: 'stellaric', status: 'controlled', population: 18000000, fleet: true, starbase: 'citadel', hyperlanes: ['lyra_2', 'stellara_3', 'stellara_reach', 'gateway_bridge'], isCapital: true, resources: { energy: 200, minerals: 90, food: 160, alloys: 70 }, discovered: true },
  { id: 'lyra_2', name: 'Lyra-2', x: 180, y: 240, starClass: 'F', starSize: 12, planets: 6, habitablePlanets: 3, controller: 'stellaric', status: 'controlled', population: 7200000, fleet: false, starbase: 'star_fortress', hyperlanes: ['stellara_prime', 'lyra_deep', 'azure'], resources: { energy: 110, minerals: 75, food: 130, alloys: 45 }, discovered: true },
  { id: 'stellara_3', name: 'Stellara-3', x: 290, y: 160, starClass: 'G', starSize: 11, planets: 5, habitablePlanets: 2, controller: 'stellaric', status: 'controlled', population: 5100000, fleet: false, starbase: 'starhold', hyperlanes: ['stellara_prime', 'stellara_reach', 'crystal_field'], resources: { energy: 90, minerals: 80, food: 100, alloys: 35 }, discovered: true },
  { id: 'lyra_deep', name: 'Lyra Deep', x: 130, y: 280, starClass: 'K', starSize: 10, planets: 4, habitablePlanets: 1, controller: 'stellaric', status: 'controlled', population: 2400000, fleet: false, starbase: 'starport', hyperlanes: ['lyra_2', 'frontier_7', 'nomad_3'], resources: { energy: 60, minerals: 65, food: 50, alloys: 25 }, discovered: true },
  { id: 'azure', name: 'Azure', x: 160, y: 350, starClass: 'A', starSize: 13, planets: 7, habitablePlanets: 3, controller: 'stellaric', status: 'controlled', population: 8900000, fleet: true, starbase: 'star_fortress', hyperlanes: ['lyra_2', 'frontier_7', 'dust_cloud'], resources: { energy: 140, minerals: 85, food: 120, alloys: 55 }, discovered: true },
  { id: 'stellara_reach', name: 'Stellara Reach', x: 340, y: 130, starClass: 'F', starSize: 12, planets: 5, habitablePlanets: 2, controller: 'stellaric', status: 'controlled', population: 3800000, fleet: false, starbase: 'starhold', hyperlanes: ['stellara_3', 'stellara_prime', 'crystal_field', 'iron_border_1'], resources: { energy: 85, minerals: 70, food: 90, alloys: 40 }, discovered: true },
  { id: 'gateway_bridge', name: 'Gateway Bridge', x: 450, y: 200, starClass: 'A', starSize: 13, planets: 2, habitablePlanets: 0, controller: 'stellaric', status: 'controlled', population: 1200000, fleet: false, starbase: 'star_fortress', hyperlanes: ['stellara_prime', 'nexus_gate', 'stellara_approach'], isGateway: true, resources: { energy: 160, minerals: 40, food: 15, alloys: 80 }, discovered: true },
  { id: 'crystal_field', name: 'Crystal Field', x: 360, y: 80, starClass: 'B', starSize: 15, planets: 3, habitablePlanets: 0, controller: 'stellaric', status: 'controlled', population: 600000, fleet: false, starbase: 'outpost', anomaly: 'nebula', hyperlanes: ['stellara_3', 'stellara_reach', 'iron_border_1'], resources: { energy: 200, minerals: 150, food: 5, alloys: 30 }, discovered: true },
  { id: 'stellara_approach', name: 'Stellara Approach', x: 490, y: 230, starClass: 'G', starSize: 10, planets: 4, habitablePlanets: 1, controller: 'stellaric', status: 'controlled', population: 1900000, fleet: false, starbase: 'starport', hyperlanes: ['gateway_bridge', 'nexus_gate', 'stellara_prime'], resources: { energy: 70, minerals: 60, food: 65, alloys: 30 }, discovered: true },
  { id: 'nomad_3', name: 'Nomad-3', x: 110, y: 350, starClass: 'K', starSize: 9, planets: 3, habitablePlanets: 1, controller: 'stellaric', status: 'frontier', population: 700000, fleet: false, starbase: 'outpost', hyperlanes: ['lyra_deep', 'nomad_4', 'frontier_7'], resources: { energy: 45, minerals: 50, food: 60, alloys: 15 }, discovered: true },

  // ── Iron Pact systems ──
  { id: 'ferrum', name: 'Ferrum', x: 780, y: 200, starClass: 'K', starSize: 13, planets: 7, habitablePlanets: 2, controller: 'iron_pact', status: 'controlled', population: 22000000, fleet: true, starbase: 'citadel', hyperlanes: ['iron_forge', 'iron_front_1', 'anvil', 'iron_reach'], isCapital: true, resources: { energy: 85, minerals: 280, food: 60, alloys: 240 }, discovered: true },
  { id: 'iron_forge', name: 'Iron Forge', x: 720, y: 160, starClass: 'F', starSize: 12, planets: 5, habitablePlanets: 1, controller: 'iron_pact', status: 'controlled', population: 8500000, fleet: true, starbase: 'star_fortress', hyperlanes: ['ferrum', 'anvil', 'iron_border_1'], resources: { energy: 70, minerals: 200, food: 40, alloys: 180 }, discovered: true },
  { id: 'anvil', name: 'Anvil', x: 700, y: 240, starClass: 'G', starSize: 11, planets: 6, habitablePlanets: 2, controller: 'iron_pact', status: 'controlled', population: 6200000, fleet: false, starbase: 'starhold', hyperlanes: ['ferrum', 'iron_forge', 'iron_gate_1', 'contested_2'], resources: { energy: 75, minerals: 160, food: 55, alloys: 140 }, discovered: true },
  { id: 'iron_front_1', name: 'Iron Front-1', x: 740, y: 310, starClass: 'K', starSize: 10, planets: 4, habitablePlanets: 0, controller: 'iron_pact', status: 'war_zone', population: 1800000, fleet: true, starbase: 'star_fortress', hyperlanes: ['ferrum', 'frontier_e1', 'contested_3', 'iron_gate_1'], warFront: true, resources: { energy: 50, minerals: 120, food: 20, alloys: 100 }, discovered: true },
  { id: 'iron_gate_1', name: 'Iron Gate-1', x: 655, y: 390, starClass: 'M', starSize: 10, planets: 3, habitablePlanets: 0, controller: 'iron_pact', status: 'war_zone', population: 900000, fleet: true, starbase: 'starhold', hyperlanes: ['epsilon_indi', 'borderland_2', 'iron_front_1', 'anvil'], warFront: true, resources: { energy: 40, minerals: 90, food: 15, alloys: 75 }, discovered: true },
  { id: 'iron_reach', name: 'Iron Reach', x: 820, y: 280, starClass: 'F', starSize: 12, planets: 5, habitablePlanets: 2, controller: 'iron_pact', status: 'controlled', population: 4100000, fleet: false, starbase: 'starhold', hyperlanes: ['ferrum', 'iron_south_1', 'contested_1'], resources: { energy: 80, minerals: 110, food: 70, alloys: 90 }, discovered: true },
  { id: 'iron_south_1', name: 'Iron South-1', x: 850, y: 370, starClass: 'K', starSize: 10, planets: 4, habitablePlanets: 1, controller: 'iron_pact', status: 'controlled', population: 2800000, fleet: false, starbase: 'starport', hyperlanes: ['iron_reach', 'void_border_1', 'contested_1'], resources: { energy: 60, minerals: 130, food: 50, alloys: 110 }, discovered: true },
  { id: 'iron_border_1', name: 'Iron Border-1', x: 640, y: 140, starClass: 'M', starSize: 9, planets: 3, habitablePlanets: 0, controller: 'iron_pact', status: 'frontier', population: 500000, fleet: false, starbase: 'outpost', hyperlanes: ['iron_forge', 'stellara_reach', 'crystal_field'], resources: { energy: 35, minerals: 70, food: 10, alloys: 60 }, discovered: true },
  { id: 'contested_2', name: 'Contested-2', x: 680, y: 270, starClass: 'M', starSize: 9, planets: 3, habitablePlanets: 0, controller: 'iron_pact', status: 'contested', population: 300000, fleet: false, starbase: 'outpost', hyperlanes: ['anvil', 'void_front_1'], resources: { energy: 30, minerals: 65, food: 10, alloys: 50 }, discovered: true },

  // ── Void Collective systems ──
  { id: 'void_nexus', name: 'Void Nexus', x: 820, y: 480, starClass: 'neutron', starSize: 12, planets: 4, habitablePlanets: 0, controller: 'void_empire', status: 'controlled', population: 14000000, fleet: true, starbase: 'citadel', hyperlanes: ['void_reach', 'void_east', 'void_border_1', 'void_south_1'], isCapital: true, anomaly: 'pulsar', resources: { energy: 300, minerals: 120, food: 10, alloys: 150 }, discovered: true },
  { id: 'void_reach', name: 'Void Reach', x: 760, y: 440, starClass: 'K', starSize: 10, planets: 3, habitablePlanets: 0, controller: 'void_empire', status: 'war_zone', population: 3200000, fleet: true, starbase: 'star_fortress', hyperlanes: ['void_nexus', 'contested_3', 'iron_front_1'], warFront: true, resources: { energy: 120, minerals: 80, food: 5, alloys: 90 }, discovered: true },
  { id: 'void_east', name: 'Void East', x: 880, y: 460, starClass: 'F', starSize: 11, planets: 5, habitablePlanets: 0, controller: 'void_empire', status: 'controlled', population: 5500000, fleet: false, starbase: 'star_fortress', hyperlanes: ['void_nexus', 'void_south_1', 'iron_south_1'], resources: { energy: 180, minerals: 100, food: 15, alloys: 120 }, discovered: true },
  { id: 'void_border_1', name: 'Void Border-1', x: 820, y: 380, starClass: 'M', starSize: 9, planets: 2, habitablePlanets: 0, controller: 'void_empire', status: 'war_zone', population: 600000, fleet: true, starbase: 'starhold', hyperlanes: ['void_nexus', 'iron_south_1', 'contested_1'], warFront: true, resources: { energy: 90, minerals: 60, food: 5, alloys: 70 }, discovered: true },
  { id: 'void_south_1', name: 'Void South-1', x: 870, y: 540, starClass: 'K', starSize: 10, planets: 3, habitablePlanets: 0, controller: 'void_empire', status: 'controlled', population: 2100000, fleet: false, starbase: 'starport', hyperlanes: ['void_nexus', 'void_east', 'merchant_3'], resources: { energy: 140, minerals: 70, food: 8, alloys: 80 }, discovered: true },
  { id: 'void_front_1', name: 'Void Front-1', x: 720, y: 380, starClass: 'M', starSize: 9, planets: 2, habitablePlanets: 0, controller: 'void_empire', status: 'war_zone', population: 400000, fleet: false, starbase: 'outpost', hyperlanes: ['contested_2', 'contested_3', 'void_reach'], warFront: true, resources: { energy: 80, minerals: 50, food: 5, alloys: 60 }, discovered: true },

  // ── Merchant Syndicate systems ──
  { id: 'tradewind', name: 'Tradewind', x: 520, y: 600, starClass: 'G', starSize: 12, planets: 7, habitablePlanets: 4, controller: 'merchant_guild', status: 'controlled', population: 9500000, fleet: true, starbase: 'citadel', hyperlanes: ['market_hub', 'merchant_2', 'merchant_3', 'border_south_1'], isCapital: true, isGateway: true, resources: { energy: 130, minerals: 90, food: 180, alloys: 60 }, discovered: true },
  { id: 'market_hub', name: 'Market Hub', x: 460, y: 620, starClass: 'F', starSize: 12, planets: 5, habitablePlanets: 2, controller: 'merchant_guild', status: 'controlled', population: 4800000, fleet: false, starbase: 'star_fortress', hyperlanes: ['tradewind', 'merchant_2', 'border_south_2'], resources: { energy: 100, minerals: 70, food: 130, alloys: 45 }, discovered: true },
  { id: 'merchant_2', name: 'Merchant-2', x: 580, y: 560, starClass: 'K', starSize: 10, planets: 4, habitablePlanets: 2, controller: 'merchant_guild', status: 'controlled', population: 3200000, fleet: false, starbase: 'starhold', hyperlanes: ['tradewind', 'market_hub', 'merchant_3', 'border_south_2'], resources: { energy: 85, minerals: 65, food: 110, alloys: 35 }, discovered: true },
  { id: 'merchant_3', name: 'Merchant-3', x: 650, y: 580, starClass: 'K', starSize: 10, planets: 4, habitablePlanets: 1, controller: 'merchant_guild', status: 'controlled', population: 1800000, fleet: false, starbase: 'starport', hyperlanes: ['merchant_2', 'tradewind', 'void_south_1', 'nomad_1'], resources: { energy: 70, minerals: 55, food: 90, alloys: 25 }, discovered: true },
  { id: 'border_south_1', name: 'Border South-1', x: 440, y: 570, starClass: 'M', starSize: 9, planets: 3, habitablePlanets: 1, controller: 'merchant_guild', status: 'frontier', population: 700000, fleet: false, starbase: 'outpost', hyperlanes: ['verdant', 'tradewind', 'border_south_2'], resources: { energy: 45, minerals: 50, food: 75, alloys: 15 }, discovered: true },
  { id: 'border_south_2', name: 'Border South-2', x: 510, y: 545, starClass: 'M', starSize: 8, planets: 2, habitablePlanets: 0, controller: 'merchant_guild', status: 'frontier', population: 300000, fleet: false, starbase: 'outpost', hyperlanes: ['deep_reach', 'market_hub', 'merchant_2', 'border_south_1', 'nomad_1'], resources: { energy: 35, minerals: 40, food: 30, alloys: 10 }, discovered: true },

  // ── Nomad Clans systems ──
  { id: 'wanderer', name: 'Wanderer', x: 170, y: 480, starClass: 'M', starSize: 11, planets: 5, habitablePlanets: 2, controller: 'nomad_clans', status: 'controlled', population: 4200000, fleet: true, starbase: 'starhold', hyperlanes: ['nomad_2', 'nomad_4', 'frontier_7', 'nomad_1'], isCapital: true, resources: { energy: 60, minerals: 80, food: 120, alloys: 30 }, discovered: true },
  { id: 'nomad_2', name: 'Nomad-2', x: 120, y: 430, starClass: 'K', starSize: 10, planets: 4, habitablePlanets: 2, controller: 'nomad_clans', status: 'controlled', population: 2100000, fleet: false, starbase: 'starport', hyperlanes: ['wanderer', 'nomad_4', 'dust_cloud'], resources: { energy: 50, minerals: 65, food: 95, alloys: 20 }, discovered: true },
  { id: 'nomad_4', name: 'Nomad-4', x: 145, y: 400, starClass: 'M', starSize: 9, planets: 3, habitablePlanets: 1, controller: 'nomad_clans', status: 'controlled', population: 1400000, fleet: false, starbase: 'outpost', hyperlanes: ['wanderer', 'nomad_2', 'nomad_3', 'lyra_deep'], resources: { energy: 40, minerals: 55, food: 80, alloys: 15 }, discovered: true },
  { id: 'nomad_1', name: 'Nomad-1', x: 300, y: 560, starClass: 'G', starSize: 11, planets: 5, habitablePlanets: 3, controller: 'nomad_clans', status: 'controlled', population: 3100000, fleet: false, starbase: 'starport', hyperlanes: ['deep_reach', 'merchant_3', 'border_south_2', 'wanderer'], resources: { energy: 70, minerals: 60, food: 140, alloys: 25 }, discovered: true },
  { id: 'frontier_7', name: 'Frontier-7', x: 215, y: 340, starClass: 'F', starSize: 11, planets: 4, habitablePlanets: 1, controller: 'nomad_clans', status: 'frontier', population: 500000, fleet: false, starbase: 'outpost', hyperlanes: ['proxima', 'forge_world', 'lyra_deep', 'azure', 'wanderer', 'nomad_3'], resources: { energy: 55, minerals: 70, food: 60, alloys: 20 }, discovered: true },

  // ── Uncharted / Neutral systems ──
  { id: 'contested_1', name: 'Contested-1', x: 810, y: 330, starClass: 'M', starSize: 9, planets: 2, habitablePlanets: 0, controller: null, status: 'contested', population: 0, fleet: false, hyperlanes: ['iron_reach', 'iron_south_1', 'void_border_1'], resources: { energy: 25, minerals: 45, food: 5, alloys: 30 }, discovered: true },
  { id: 'contested_3', name: 'Contested-3', x: 700, y: 440, starClass: 'M', starSize: 9, planets: 2, habitablePlanets: 0, controller: null, status: 'contested', population: 0, fleet: false, hyperlanes: ['borderland_2', 'iron_front_1', 'void_reach', 'void_front_1'], resources: { energy: 20, minerals: 40, food: 5, alloys: 25 }, discovered: true },
  { id: 'dust_cloud', name: 'Dust Cloud', x: 195, y: 390, starClass: 'black_hole', starSize: 16, planets: 0, habitablePlanets: 0, controller: null, status: 'uncharted', population: 0, fleet: false, anomaly: 'black_hole', hyperlanes: ['forge_world', 'azure', 'nomad_2'], resources: { energy: 500, minerals: 10, food: 0, alloys: 5 }, discovered: false },
];

// ─────────────────────────────────────────────────
// FLEET MARKERS
// ─────────────────────────────────────────────────
export const FLEETS: Fleet[] = [
  { id: 'f1', name: '1st Strike Fleet', empire: 'player', type: 'military', ships: 85, power: 42000, fromSystem: 'sol', toSystem: 'iron_gate_1', progress: 0.45, x: 540, y: 380 },
  { id: 'f2', name: 'Science Vessel Atlas', empire: 'player', type: 'science', ships: 1, power: 500, fromSystem: 'barnards_star', toSystem: 'dust_cloud', progress: 0.65, x: 370, y: 330 },
  { id: 'f3', name: 'Iron Hammer Fleet', empire: 'iron_pact', type: 'military', ships: 240, power: 160000, fromSystem: 'ferrum', toSystem: 'void_reach', progress: 0.3, x: 790, y: 430 },
  { id: 'f4', name: 'Void Swarm Alpha', empire: 'void_empire', type: 'military', ships: 180, power: 120000, fromSystem: 'void_nexus', toSystem: 'iron_south_1', progress: 0.55, x: 850, y: 425 },
  { id: 'f5', name: 'Stellara Guardian', empire: 'stellaric', type: 'military', ships: 95, power: 68000, fromSystem: 'stellara_prime', toSystem: 'gateway_bridge', progress: 0.2, x: 340, y: 190 },
  { id: 'f6', name: 'Trade Convoy Omega', empire: 'merchant_guild', type: 'civilian', ships: 12, power: 1200, fromSystem: 'tradewind', toSystem: 'sol', progress: 0.7, x: 470, y: 490 },
  { id: 'f7', name: 'Nomad Raider Pack', empire: 'nomad_clans', type: 'military', ships: 45, power: 28000, fromSystem: 'wanderer', toSystem: 'frontier_7', progress: 0.4, x: 190, y: 420 },
  { id: 'f8', name: 'Forge Defense Fleet', empire: 'player', type: 'military', ships: 60, power: 35000, fromSystem: 'forge_world', toSystem: null, progress: 0, x: 260, y: 330 },
];

// ─────────────────────────────────────────────────
// GALACTIC EVENTS TICKER
// ─────────────────────────────────────────────────
export const GALACTIC_EVENTS: GalacticEvent[] = [
  { id: 'e1', type: 'war', title: 'WAR DECLARED', description: 'Iron Pact declares war on Void Collective', time: '00:12:34', empire: 'iron_pact', empireColor: '#f87171' },
  { id: 'e2', type: 'crisis', title: 'CRISIS ALERT', description: 'The Contingency awakens in the outer rim', time: '00:45:12', empire: undefined, empireColor: '#ff4444' },
  { id: 'e3', type: 'alliance', title: 'ALLIANCE FORMED', description: 'Nexus Dominion and Stellaric Conclave sign Federation pact', time: '01:02:15', empire: 'player', empireColor: '#00d4ff' },
  { id: 'e4', type: 'discovery', title: 'PRECURSOR RUINS', description: 'Ancient ruins discovered in Crystal Field system', time: '02:14:58', empire: 'stellaric', empireColor: '#a78bfa' },
  { id: 'e5', type: 'peace', title: 'PEACE TREATY', description: 'Merchant Syndicate brokers peace in border conflict', time: '03:22:41', empire: 'merchant_guild', empireColor: '#34d399' },
  { id: 'e6', type: 'anomaly', title: 'ANOMALY DETECTED', description: 'Pulsar storm disrupts hyperlane travel near Void Nexus', time: '04:01:30', empire: 'void_empire', empireColor: '#f59e0b' },
];