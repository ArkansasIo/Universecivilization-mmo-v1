export interface Alliance {
  id: string;
  name: string;
  tag: string;
  color: string;
  glowColor: string;
  members: number;
  power: number;
  territories: number;
  status: 'dominant' | 'strong' | 'growing' | 'contested';
  controlledSectors: string[];
  homeWorld: { galaxy: number; system: number };
  diplomacy: {
    allies: string[];
    nap: string[];
    war: string[];
  };
}

export interface DiplomacyZone {
  sectorId: string;
  galaxy: number;
  system: number;
  allianceId: string | null;
  type: 'territory' | 'contested' | 'warzone' | 'neutral' | 'nap_border' | 'ally_border';
  intensity: number; // 0–1 for color opacity
  battleCount?: number;
  resources: 'high' | 'medium' | 'low';
}

export interface ActiveWar {
  id: string;
  attackerId: string;
  defenderId: string;
  startTime: string;
  intensity: 'extreme' | 'critical' | 'high' | 'medium';
  battlesFought: number;
  casualties: number;
  frontLine: { galaxy: number; system: number }[];
}

export interface DiplomacyEvent {
  id: string;
  timestamp: string;
  type: 'war_declared' | 'peace_signed' | 'nap_signed' | 'alliance_formed' | 'territory_captured' | 'blockade';
  allianceIds: string[];
  description: string;
  location?: string;
}

export const ALLIANCES: Alliance[] = [
  {
    id: 'gf',
    name: 'Galactic Federation',
    tag: '[GF]',
    color: '#00d4ff',
    glowColor: 'rgba(0,212,255,0.35)',
    members: 450,
    power: 125000000,
    territories: 48,
    status: 'dominant',
    controlledSectors: [],
    homeWorld: { galaxy: 1, system: 50 },
    diplomacy: { allies: ['sc'], nap: ['nc'], war: ['dl'] },
  },
  {
    id: 'dl',
    name: 'Dark Legion',
    tag: '[DL]',
    color: '#f87171',
    glowColor: 'rgba(248,113,113,0.35)',
    members: 520,
    power: 145000000,
    territories: 52,
    status: 'dominant',
    controlledSectors: [],
    homeWorld: { galaxy: 9, system: 50 },
    diplomacy: { allies: ['vh'], nap: [], war: ['gf', 'sc'] },
  },
  {
    id: 'sc',
    name: 'Solar Collective',
    tag: '[SC]',
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.35)',
    members: 380,
    power: 98000000,
    territories: 35,
    status: 'strong',
    controlledSectors: [],
    homeWorld: { galaxy: 5, system: 50 },
    diplomacy: { allies: ['gf'], nap: ['nc'], war: ['dl'] },
  },
  {
    id: 'nc',
    name: 'Nova Collective',
    tag: '[NC]',
    color: '#34d399',
    glowColor: 'rgba(52,211,153,0.35)',
    members: 280,
    power: 72000000,
    territories: 28,
    status: 'growing',
    controlledSectors: [],
    homeWorld: { galaxy: 3, system: 50 },
    diplomacy: { allies: [], nap: ['gf', 'sc'], war: [] },
  },
  {
    id: 'vh',
    name: 'Void Hunters',
    tag: '[VH]',
    color: '#a78bfa',
    glowColor: 'rgba(167,139,250,0.35)',
    members: 195,
    power: 58000000,
    territories: 22,
    status: 'contested',
    controlledSectors: [],
    homeWorld: { galaxy: 7, system: 50 },
    diplomacy: { allies: ['dl'], nap: [], war: [] },
  },
  {
    id: 'se',
    name: 'Stellar Empire',
    tag: '[SE]',
    color: '#fb923c',
    glowColor: 'rgba(251,146,60,0.35)',
    members: 320,
    power: 85000000,
    territories: 31,
    status: 'strong',
    controlledSectors: [],
    homeWorld: { galaxy: 2, system: 50 },
    diplomacy: { allies: [], nap: ['nc'], war: [] },
  },
];

// Build 9×10 galaxy grid (galaxies 1-9, systems 1-10 = 90 cells)
function buildZones(): DiplomacyZone[] {
  const zones: DiplomacyZone[] = [];

  // Assignment map: galaxy -> system range -> alliance id
  const assignments: Array<{ g: number; sMin: number; sMax: number; alliance: string; type: DiplomacyZone['type'] }> = [
    // Galaxy 1 — GF dominant
    { g: 1, sMin: 1,  sMax: 60, alliance: 'gf', type: 'territory' },
    { g: 1, sMin: 61, sMax: 80, alliance: 'se', type: 'territory' },
    { g: 1, sMin: 81, sMax: 95, alliance: 'gf', type: 'nap_border' },
    { g: 1, sMin: 96, sMax: 99, alliance: 'gf', type: 'territory' },
    // Galaxy 2 — SE + GF
    { g: 2, sMin: 1,  sMax: 55, alliance: 'se', type: 'territory' },
    { g: 2, sMin: 56, sMax: 75, alliance: 'gf', type: 'ally_border' },
    { g: 2, sMin: 76, sMax: 90, alliance: 'nc', type: 'territory' },
    { g: 2, sMin: 91, sMax: 99, alliance: 'nc', type: 'territory' },
    // Galaxy 3 — NC dominant
    { g: 3, sMin: 1,  sMax: 65, alliance: 'nc', type: 'territory' },
    { g: 3, sMin: 66, sMax: 80, alliance: 'sc', type: 'nap_border' },
    { g: 3, sMin: 81, sMax: 99, alliance: 'nc', type: 'territory' },
    // Galaxy 4 — contested GF vs DL (war zone)
    { g: 4, sMin: 1,  sMax: 40, alliance: 'gf', type: 'warzone' },
    { g: 4, sMin: 41, sMax: 60, alliance: null, type: 'contested' },
    { g: 4, sMin: 61, sMax: 99, alliance: 'dl', type: 'warzone' },
    // Galaxy 5 — SC dominant
    { g: 5, sMin: 1,  sMax: 70, alliance: 'sc', type: 'territory' },
    { g: 5, sMin: 71, sMax: 85, alliance: 'vh', type: 'territory' },
    { g: 5, sMin: 86, sMax: 99, alliance: 'sc', type: 'ally_border' },
    // Galaxy 6 — contested SC vs DL (war zone)
    { g: 6, sMin: 1,  sMax: 45, alliance: 'sc', type: 'warzone' },
    { g: 6, sMin: 46, sMax: 55, alliance: null, type: 'contested' },
    { g: 6, sMin: 56, sMax: 99, alliance: 'dl', type: 'warzone' },
    // Galaxy 7 — VH + neutral
    { g: 7, sMin: 1,  sMax: 50, alliance: 'vh', type: 'territory' },
    { g: 7, sMin: 51, sMax: 70, alliance: null, type: 'neutral' },
    { g: 7, sMin: 71, sMax: 99, alliance: 'dl', type: 'territory' },
    // Galaxy 8 — DL
    { g: 8, sMin: 1,  sMax: 30, alliance: null, type: 'neutral' },
    { g: 8, sMin: 31, sMax: 99, alliance: 'dl', type: 'territory' },
    // Galaxy 9 — DL dominant
    { g: 9, sMin: 1,  sMax: 99, alliance: 'dl', type: 'territory' },
  ];

  for (let g = 1; g <= 9; g++) {
    for (let sys = 1; sys <= 99; sys++) {
      const match = assignments.find(a => a.g === g && sys >= a.sMin && sys <= a.sMax);
      const resources: DiplomacyZone['resources'] =
        sys < 20 ? 'high' : sys < 60 ? 'medium' : 'low';
      zones.push({
        sectorId: `${g}-${sys}`,
        galaxy: g,
        system: sys,
        allianceId: match?.alliance ?? null,
        type: match?.type ?? 'neutral',
        intensity: match?.type === 'contested' ? 0.9 : match?.type === 'warzone' ? 1 : 0.6,
        battleCount: match?.type === 'warzone' ? Math.floor(Math.random() * 20 + 5) : undefined,
        resources,
      });
    }
  }

  return zones;
}

export const DIPLOMACY_ZONES: DiplomacyZone[] = buildZones();

export const ACTIVE_WARS: ActiveWar[] = [
  {
    id: 'w1',
    attackerId: 'dl',
    defenderId: 'gf',
    startTime: '14 days ago',
    intensity: 'extreme',
    battlesFought: 284,
    casualties: 1820000,
    frontLine: [
      { galaxy: 4, system: 45 },
      { galaxy: 4, system: 50 },
      { galaxy: 4, system: 55 },
    ],
  },
  {
    id: 'w2',
    attackerId: 'dl',
    defenderId: 'sc',
    startTime: '7 days ago',
    intensity: 'critical',
    battlesFought: 148,
    casualties: 920000,
    frontLine: [
      { galaxy: 6, system: 48 },
      { galaxy: 6, system: 52 },
    ],
  },
];

export const DIPLOMACY_EVENTS: DiplomacyEvent[] = [
  {
    id: 'ev1',
    timestamp: '2m ago',
    type: 'territory_captured',
    allianceIds: ['dl'],
    description: 'Dark Legion captured System [4:58:16] from Galactic Federation',
    location: '[4:58:16]',
  },
  {
    id: 'ev2',
    timestamp: '12m ago',
    type: 'war_declared',
    allianceIds: ['sc', 'dl'],
    description: 'Solar Collective declared war on Dark Legion',
    location: 'Galaxy 6',
  },
  {
    id: 'ev3',
    timestamp: '34m ago',
    type: 'territory_captured',
    allianceIds: ['gf'],
    description: 'Galactic Federation retook System [4:42:16] after fierce battle',
    location: '[4:42:16]',
  },
  {
    id: 'ev4',
    timestamp: '1h ago',
    type: 'blockade',
    allianceIds: ['dl'],
    description: 'Dark Legion blockade established at Nexus Gate Prime in Galaxy 4',
    location: 'Galaxy 4',
  },
  {
    id: 'ev5',
    timestamp: '2h ago',
    type: 'nap_signed',
    allianceIds: ['sc', 'nc'],
    description: 'Solar Collective and Nova Collective renewed Non-Aggression Pact',
    location: 'Galaxy 3',
  },
  {
    id: 'ev6',
    timestamp: '4h ago',
    type: 'alliance_formed',
    allianceIds: ['gf', 'sc'],
    description: 'Galactic Federation and Solar Collective strengthened Mutual Defense Treaty',
    location: 'Galaxy 5',
  },
  {
    id: 'ev7',
    timestamp: '6h ago',
    type: 'peace_signed',
    allianceIds: ['vh', 'nc'],
    description: 'Void Hunters and Nova Collective signed ceasefire agreement',
    location: 'Galaxy 7',
  },
  {
    id: 'ev8',
    timestamp: '8h ago',
    type: 'territory_captured',
    allianceIds: ['dl'],
    description: 'Dark Legion seized the Quantum Corridor in Galaxy 6',
    location: 'Galaxy 6',
  },
];