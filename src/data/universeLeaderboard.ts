// ─────────────────────────────────────────────────────────────────────────────
// Universe-Empire-Dominions — Universe Leaderboard Mock Data
// ─────────────────────────────────────────────────────────────────────────────

export type EmpireRank = 'Iron' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Mythic' | 'Cosmic';

export interface EmpireEntry {
  rank: number;
  empireId: string;
  empireName: string;
  commanderName: string;
  avatar: string;
  conquestPoints: number;
  territorySystems: number;
  totalPlanets: number;
  fleetPower: number;
  allianceName: string | null;
  allianceTag: string | null;
  empireRank: EmpireRank;
  weeklyGain: number;
  weeklyChange: number; // positive = moved up, negative = moved down
  isOnline: boolean;
  lastSeen: string;
  specialTitle: string | null;
  color: string;
  realmId: string;
  realmName: string;
}

export interface UniverseLeaderboardEntry {
  universeId: string;
  universeName: string;
  universeClass: string;
  universeColor: string;
  totalEmpires: number;
  totalConquestPoints: number;
  topAlliance: string;
  topAllianceTag: string;
  topAlliancePoints: number;
  topAllianceMembers: number;
  dominantFaction: string;
  controlledSystems: number;
  totalSystems: number;
  lastUpdated: string;
  empires: EmpireEntry[];
}

const EMPIRE_NAMES = [
  'Iron Vanguard', 'Void Eternal', 'Solar Ascendancy', 'Crystal Dominion', 'Nebula Throne',
  'Quantum Imperium', 'Stellar Covenant', 'Dark Nexus', 'Crimson Fleet', 'Nova Sovereignty',
  'Omega Collective', 'Titan Hegemony', 'Phantom Empire', 'Celestial Order', 'Rogue Dominion',
  'Emerald Sovereignty', 'Plasma Throne', 'Frozen Imperium', 'Antimatter Pact', 'Sapphire Realm',
  'Chaos Dominion', 'Ancient Covenant', 'Temporal Empire', 'Mythic Ascendancy', 'Forge Imperium',
  'Singularity Pact', 'Crimson Nexus', 'Void Sovereignty', 'Nova Collective', 'Stellar Throne',
  'Iron Covenant', 'Crystal Hegemony', 'Nebula Dominion', 'Quantum Throne', 'Solar Pact',
  'Dark Sovereignty', 'Titan Collective', 'Phantom Dominion', 'Celestial Imperium', 'Rogue Pact',
  'Emerald Throne', 'Plasma Dominion', 'Frozen Sovereignty', 'Antimatter Realm', 'Sapphire Pact',
  'Chaos Imperium', 'Ancient Dominion', 'Temporal Sovereignty', 'Mythic Collective', 'Forge Throne',
];

const COMMANDER_NAMES = [
  'Zephyr Voss', 'Kira Solaris', 'Dax Ironheart', 'Lyra Voidwalker', 'Orion Blackstar',
  'Nova Stormcrest', 'Cael Darkbane', 'Sera Lightforge', 'Rex Titanfall', 'Mira Nebulae',
  'Vex Quantumshift', 'Aria Stellarwind', 'Drax Voidborn', 'Zara Crystalmind', 'Kael Solarflare',
  'Nyx Shadowblade', 'Rion Ironclad', 'Lysa Cosmicrift', 'Dex Plasmaburst', 'Vera Frostbane',
  'Axel Chaosweaver', 'Mira Ancientborn', 'Zion Timerift', 'Kira Mythicborn', 'Rex Forgemaster',
  'Nova Singularity', 'Cael Crimsonblade', 'Sera Voidmind', 'Dax Novaborn', 'Lyra Stellarborn',
  'Orion Ironveil', 'Aria Crystalborn', 'Vex Nebulaborn', 'Zara Quantumborn', 'Kael Solarborn',
  'Nyx Darkborn', 'Rion Titanborn', 'Lysa Phantomborn', 'Dex Celestialborn', 'Vera Rogueborn',
  'Axel Emeraldborn', 'Mira Plasmaborn', 'Zion Frozenborn', 'Kira Antimatterborn', 'Rex Sapphireborn',
  'Nova Chaosborn', 'Cael Ancientborn', 'Sera Temporalborn', 'Dax Mythicborn', 'Lyra Forgeborn',
];

const ALLIANCE_NAMES = [
  { name: 'Eternal Vanguard', tag: 'EVG' },
  { name: 'Void Collective', tag: 'VCL' },
  { name: 'Solar Pact', tag: 'SPC' },
  { name: 'Crystal Alliance', tag: 'CRA' },
  { name: 'Nebula Coalition', tag: 'NBC' },
  { name: 'Quantum Union', tag: 'QUN' },
  { name: 'Iron Brotherhood', tag: 'IRB' },
  { name: 'Dark Covenant', tag: 'DCV' },
  { name: 'Nova Federation', tag: 'NVF' },
  { name: 'Titan League', tag: 'TTL' },
  { name: 'Phantom Order', tag: 'PHO' },
  { name: 'Celestial Pact', tag: 'CEP' },
  { name: 'Rogue Syndicate', tag: 'RGS' },
  { name: 'Emerald Empire', tag: 'EME' },
  { name: 'Plasma Guild', tag: 'PLG' },
];

const SPECIAL_TITLES = [
  'Galactic Conqueror', 'Void Master', 'Solar Emperor', 'Crystal Sovereign', 'Nebula Lord',
  'Quantum Overlord', 'Iron Warlord', 'Dark Sovereign', 'Nova Champion', 'Titan Ruler',
  null, null, null, null, null, null, null, null, null, null,
];

const EMPIRE_COLORS = [
  '#00d4ff', '#ef4444', '#4ade80', '#f59e0b', '#a78bfa',
  '#f472b6', '#34d399', '#fb923c', '#60a5fa', '#e879f9',
];

function getRankByPoints(points: number): EmpireRank {
  if (points >= 10000000) return 'Cosmic';
  if (points >= 5000000) return 'Mythic';
  if (points >= 2000000) return 'Diamond';
  if (points >= 1000000) return 'Platinum';
  if (points >= 500000) return 'Gold';
  if (points >= 200000) return 'Silver';
  if (points >= 50000) return 'Bronze';
  return 'Iron';
}

function generateEmpires(universeId: string, count: number, basePoints: number, seed: number): EmpireEntry[] {
  const empires: EmpireEntry[] = [];
  const realmNames = [
    'Core Nexus', 'Frontier Expanse', 'Contested Badlands', 'Crystal Sanctuary',
    'Void Rift Alpha', 'Warzone Sigma', 'Ancient Ruins Sector', 'Resource Hub Omega',
    'Nexus Gate Prime', 'Dimensional Gate Zero',
  ];

  for (let i = 0; i < count; i++) {
    const idx = (seed + i * 7) % EMPIRE_NAMES.length;
    const cmdIdx = (seed + i * 11) % COMMANDER_NAMES.length;
    const allianceIdx = i < count * 0.8 ? (seed + i * 3) % ALLIANCE_NAMES.length : -1;
    const colorIdx = (seed + i * 5) % EMPIRE_COLORS.length;
    const titleIdx = (seed + i * 13) % SPECIAL_TITLES.length;
    const realmIdx = (seed + i * 2) % 10;

    const conquestPoints = Math.max(1000, Math.floor(basePoints * Math.pow(0.82, i) * (0.9 + Math.random() * 0.2)));
    const weeklyGain = Math.floor(conquestPoints * (0.02 + Math.random() * 0.08));
    const weeklyChange = i === 0 ? 0 : Math.floor((Math.random() - 0.4) * 5);

    empires.push({
      rank: i + 1,
      empireId: `${universeId}-emp-${i + 1}`,
      empireName: EMPIRE_NAMES[idx % EMPIRE_NAMES.length],
      commanderName: COMMANDER_NAMES[cmdIdx % COMMANDER_NAMES.length],
      avatar: `https://readdy.ai/api/search-image?query=space%20commander%20portrait%20sci-fi%20armor%20helmet%20futuristic%20warrior%20$%7B%5Bmale%2C%20female%5D%5Bi%20%25%202%5D%7D%20digital%20art&width=64&height=64&seq=avatar-${universeId}-${i}&orientation=squarish`,
      conquestPoints,
      territorySystems: Math.floor(conquestPoints / 1200 + 10 + Math.random() * 50),
      totalPlanets: Math.floor(conquestPoints / 400 + 30 + Math.random() * 100),
      fleetPower: Math.floor(conquestPoints * (1.5 + Math.random())),
      allianceName: allianceIdx >= 0 ? ALLIANCE_NAMES[allianceIdx].name : null,
      allianceTag: allianceIdx >= 0 ? ALLIANCE_NAMES[allianceIdx].tag : null,
      empireRank: getRankByPoints(conquestPoints),
      weeklyGain,
      weeklyChange,
      isOnline: Math.random() > 0.6,
      lastSeen: Math.random() > 0.6 ? 'Online' : `${Math.floor(Math.random() * 24)}h ago`,
      specialTitle: SPECIAL_TITLES[titleIdx],
      color: EMPIRE_COLORS[colorIdx],
      realmId: `${universeId}-r${realmIdx + 1}`,
      realmName: realmNames[realmIdx],
    });
  }

  return empires;
}

export const universeLeaderboards: UniverseLeaderboardEntry[] = [
  {
    universeId: 'u1',
    universeName: 'Alpha Prime',
    universeClass: 'Standard',
    universeColor: '#00d4ff',
    totalEmpires: 48291,
    totalConquestPoints: 2847392000,
    topAlliance: 'Eternal Vanguard',
    topAllianceTag: 'EVG',
    topAlliancePoints: 284739200,
    topAllianceMembers: 48,
    dominantFaction: 'Terran Dominion',
    controlledSystems: 8420,
    totalSystems: 14400,
    lastUpdated: '2 min ago',
    empires: generateEmpires('u1', 50, 12400000, 42),
  },
  {
    universeId: 'u2',
    universeName: 'Omega Void',
    universeClass: 'Hardcore',
    universeColor: '#7c3aed',
    totalEmpires: 12847,
    totalConquestPoints: 987234000,
    topAlliance: 'Void Collective',
    topAllianceTag: 'VCL',
    topAlliancePoints: 98723400,
    topAllianceMembers: 32,
    dominantFaction: 'Void Collective',
    controlledSystems: 3200,
    totalSystems: 5900,
    lastUpdated: '5 min ago',
    empires: generateEmpires('u2', 50, 9800000, 13),
  },
  {
    universeId: 'u3',
    universeName: 'Genesis Cluster',
    universeClass: 'Peaceful',
    universeColor: '#4ade80',
    totalEmpires: 67432,
    totalConquestPoints: 3921847000,
    topAlliance: 'Solar Pact',
    topAllianceTag: 'SPC',
    topAlliancePoints: 392184700,
    topAllianceMembers: 60,
    dominantFaction: 'Nebula Consortium',
    controlledSystems: 12800,
    totalSystems: 22500,
    lastUpdated: '1 min ago',
    empires: generateEmpires('u3', 50, 15200000, 77),
  },
  {
    universeId: 'u4',
    universeName: 'Eternal Nexus',
    universeClass: 'Mythic',
    universeColor: '#f59e0b',
    totalEmpires: 8934,
    totalConquestPoints: 1284739000,
    topAlliance: 'Crystal Alliance',
    topAllianceTag: 'CRA',
    topAlliancePoints: 128473900,
    topAllianceMembers: 25,
    dominantFaction: 'Eternal Empire',
    controlledSystems: 5600,
    totalSystems: 8000,
    lastUpdated: '8 min ago',
    empires: generateEmpires('u4', 50, 18900000, 99),
  },
  {
    universeId: 'u5',
    universeName: 'Quantum Flux',
    universeClass: 'Quantum',
    universeColor: '#06b6d4',
    totalEmpires: 31200,
    totalConquestPoints: 1847392000,
    topAlliance: 'Quantum Union',
    topAllianceTag: 'QUN',
    topAlliancePoints: 184739200,
    topAllianceMembers: 40,
    dominantFaction: 'Quantum Conclave',
    controlledSystems: 6800,
    totalSystems: 11400,
    lastUpdated: '3 min ago',
    empires: generateEmpires('u5', 50, 11200000, 55),
  },
  {
    universeId: 'u6',
    universeName: 'Temporal Rift',
    universeClass: 'Temporal',
    universeColor: '#a78bfa',
    totalEmpires: 19800,
    totalConquestPoints: 1234567000,
    topAlliance: 'Iron Brotherhood',
    topAllianceTag: 'IRB',
    topAlliancePoints: 123456700,
    topAllianceMembers: 35,
    dominantFaction: 'Temporal Guardians',
    controlledSystems: 4200,
    totalSystems: 8400,
    lastUpdated: '12 min ago',
    empires: generateEmpires('u6', 50, 8700000, 66),
  },
  {
    universeId: 'u7',
    universeName: 'Iron Dominion',
    universeClass: 'Hardcore',
    universeColor: '#f87171',
    totalEmpires: 24600,
    totalConquestPoints: 1567890000,
    topAlliance: 'Dark Covenant',
    topAllianceTag: 'DCV',
    topAlliancePoints: 156789000,
    topAllianceMembers: 42,
    dominantFaction: 'Iron Legion',
    controlledSystems: 7200,
    totalSystems: 12000,
    lastUpdated: '4 min ago',
    empires: generateEmpires('u7', 50, 13400000, 11),
  },
  {
    universeId: 'u8',
    universeName: 'Crystal Expanse',
    universeClass: 'Peaceful',
    universeColor: '#c084fc',
    totalEmpires: 42100,
    totalConquestPoints: 2134567000,
    topAlliance: 'Nova Federation',
    topAllianceTag: 'NVF',
    topAlliancePoints: 213456700,
    topAllianceMembers: 55,
    dominantFaction: 'Crystal Covenant',
    controlledSystems: 9800,
    totalSystems: 16800,
    lastUpdated: '6 min ago',
    empires: generateEmpires('u8', 50, 14100000, 88),
  },
  {
    universeId: 'u9',
    universeName: 'Void Nexus',
    universeClass: 'Void',
    universeColor: '#1e1b4b',
    totalEmpires: 7800,
    totalConquestPoints: 876543000,
    topAlliance: 'Titan League',
    topAllianceTag: 'TTL',
    topAlliancePoints: 87654300,
    topAllianceMembers: 20,
    dominantFaction: 'Void Collective',
    controlledSystems: 2100,
    totalSystems: 4800,
    lastUpdated: '15 min ago',
    empires: generateEmpires('u9', 50, 7600000, 22),
  },
  {
    universeId: 'u10',
    universeName: 'Solar Dominion',
    universeClass: 'Standard',
    universeColor: '#fbbf24',
    totalEmpires: 38900,
    totalConquestPoints: 2456789000,
    topAlliance: 'Phantom Order',
    topAllianceTag: 'PHO',
    topAlliancePoints: 245678900,
    topAllianceMembers: 50,
    dominantFaction: 'Solar Alliance',
    controlledSystems: 10200,
    totalSystems: 16800,
    lastUpdated: '2 min ago',
    empires: generateEmpires('u10', 50, 13800000, 33),
  },
];

export const rankColors: Record<EmpireRank, string> = {
  Iron: '#9ca3af',
  Bronze: '#cd7f32',
  Silver: '#c0c0c0',
  Gold: '#fbbf24',
  Platinum: '#e5e7eb',
  Diamond: '#60a5fa',
  Mythic: '#a78bfa',
  Cosmic: '#f59e0b',
};

export const rankGlows: Record<EmpireRank, string> = {
  Iron: 'rgba(156,163,175,0.2)',
  Bronze: 'rgba(205,127,50,0.2)',
  Silver: 'rgba(192,192,192,0.2)',
  Gold: 'rgba(251,191,36,0.25)',
  Platinum: 'rgba(229,231,235,0.2)',
  Diamond: 'rgba(96,165,250,0.25)',
  Mythic: 'rgba(167,139,250,0.3)',
  Cosmic: 'rgba(245,158,11,0.35)',
};

export function formatConquestPoints(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}
