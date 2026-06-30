import { useState, useCallback } from 'react';

export type InvasionPhase = 'planning' | 'orbital-bombardment' | 'landing' | 'assault' | 'occupation' | 'victory' | 'defeat' | 'retreat';

export type MissionType =
  | 'full-invasion'
  | 'raid'
  | 'sabotage'
  | 'liberation'
  | 'capture-facility'
  | 'assassination'
  | 'guerrilla';

export type TerrainType = 'urban' | 'jungle' | 'desert' | 'arctic' | 'orbital-station' | 'underground' | 'volcanic';

export interface TargetPlanet {
  id: string;
  name: string;
  system: string;
  coordinates: string;
  terrain: TerrainType;
  population: number;
  defenseRating: number;
  fortificationLevel: number;
  garrisonStrength: number;
  airDefenseLevel: number;
  shieldStrength: number;
  strategicValue: number;
  resources: { metal: number; crystal: number; credits: number };
  image: string;
  faction: string;
  defenseModifiers: string[];
}

export interface AssignedUnit {
  unitId: string;
  unitName: string;
  unitClass: string;
  sector: string;
  count: number;
  combatPower: number;
  specialAbility: string;
  role: GroundRole;
  icon: string;
  rarity: string;
}

export type GroundRole =
  | 'vanguard'
  | 'shock-assault'
  | 'special-ops'
  | 'fire-support'
  | 'command'
  | 'medic'
  | 'engineer'
  | 'reserve';

export interface InvasionMission {
  id: string;
  targetPlanet: TargetPlanet;
  missionType: MissionType;
  assignedUnits: AssignedUnit[];
  phase: InvasionPhase;
  totalCombatPower: number;
  orbitalSupport: boolean;
  bombStarted: boolean;
  startedAt?: Date;
  estimatedDuration: string;
  successChance: number;
  status: 'preparing' | 'active' | 'completed' | 'failed';
}

export interface BattleEvent {
  id: string;
  timestamp: string;
  phase: InvasionPhase;
  type: 'advance' | 'assault' | 'ability' | 'casualty' | 'capture' | 'info' | 'warning' | 'victory' | 'defeat';
  message: string;
  unitInvolved?: string;
}

export interface BattleReport {
  missionId: string;
  outcome: 'victory' | 'defeat' | 'partial';
  duration: string;
  enemyKilled: number;
  ownCasualties: number;
  facilitiesCaptured: string[];
  resourcesLooted: { metal: number; crystal: number; credits: number };
  experienceGained: number;
  planetCaptured: boolean;
  events: BattleEvent[];
}

export const TERRAIN_MODIFIERS: Record<TerrainType, { label: string; attackMod: number; defenseMod: number; icon: string }> = {
  urban:           { label: 'Urban',         attackMod: -0.15, defenseMod: 0.20,  icon: 'ri-building-4-line' },
  jungle:          { label: 'Jungle',         attackMod: -0.20, defenseMod: 0.10,  icon: 'ri-plant-line' },
  desert:          { label: 'Desert',         attackMod: 0.05,  defenseMod: -0.05, icon: 'ri-sun-line' },
  arctic:          { label: 'Arctic',         attackMod: -0.10, defenseMod: 0.05,  icon: 'ri-temp-cold-line' },
  'orbital-station':{ label: 'Orbital Stn',  attackMod: 0.0,   defenseMod: 0.30,  icon: 'ri-space-ship-line' },
  underground:     { label: 'Underground',   attackMod: -0.25, defenseMod: 0.25,  icon: 'ri-map-pin-line' },
  volcanic:        { label: 'Volcanic',       attackMod: -0.05, defenseMod: -0.10, icon: 'ri-fire-line' },
};

export const MISSION_TYPE_LABELS: Record<MissionType, string> = {
  'full-invasion':    'Full Planetary Invasion',
  'raid':             'Hit-and-Run Raid',
  'sabotage':         'Sabotage Operation',
  'liberation':       'Liberation Mission',
  'capture-facility': 'Facility Capture',
  'assassination':    'Targeted Elimination',
  'guerrilla':        'Guerrilla Campaign',
};

export const TARGET_PLANETS: TargetPlanet[] = [
  {
    id: 'kerath-4',
    name: 'Kerath IV',
    system: 'Kerath System',
    coordinates: '[4:182:8]',
    terrain: 'urban',
    population: 8400000,
    defenseRating: 72,
    fortificationLevel: 5,
    garrisonStrength: 15000,
    airDefenseLevel: 4,
    shieldStrength: 60,
    strategicValue: 88,
    resources: { metal: 24000, crystal: 18000, credits: 95000 },
    faction: 'Drevari Confederacy',
    defenseModifiers: ['Urban Fortifications', 'AA Batteries', 'Civilian Population'],
    image: 'https://readdy.ai/api/search-image?query=massive%20futuristic%20urban%20planet%20covered%20in%20sprawling%20neon%20megacity%20from%20orbit%20orbital%20view%20sci-fi%20city%20planet%20dark%20atmosphere%20dramatic&width=600&height=340&seq=planet-kerath4&orientation=landscape',
  },
  {
    id: 'vora-prime',
    name: 'Vora Prime',
    system: 'Vora System',
    coordinates: '[7:209:3]',
    terrain: 'jungle',
    population: 2100000,
    defenseRating: 55,
    fortificationLevel: 3,
    garrisonStrength: 8000,
    airDefenseLevel: 2,
    shieldStrength: 30,
    strategicValue: 65,
    resources: { metal: 12000, crystal: 28000, credits: 42000 },
    faction: 'Vora Hegemony',
    defenseModifiers: ['Dense Jungle', 'Guerrilla Forces', 'Toxic Flora'],
    image: 'https://readdy.ai/api/search-image?query=lush%20alien%20jungle%20planet%20from%20orbit%20with%20thick%20green%20canopy%20and%20swirling%20storms%20sci-fi%20exotic%20planet%20orbital%20view%20deep%20greens%20and%20blues&width=600&height=340&seq=planet-voraprime&orientation=landscape',
  },
  {
    id: 'talos-station',
    name: 'Talos Station',
    system: 'Talos System',
    coordinates: '[2:88:12]',
    terrain: 'orbital-station',
    population: 125000,
    defenseRating: 90,
    fortificationLevel: 8,
    garrisonStrength: 5000,
    airDefenseLevel: 9,
    shieldStrength: 85,
    strategicValue: 96,
    resources: { metal: 8000, crystal: 45000, credits: 180000 },
    faction: 'Talos Corporation',
    defenseModifiers: ['Full Shield Grid', 'Vacuum Hazard', 'Reinforced Bulkheads', 'Automated Turrets'],
    image: 'https://readdy.ai/api/search-image?query=massive%20orbital%20battle%20station%20with%20rotating%20rings%20cannon%20emplacements%20shield%20generators%20dramatic%20space%20background%20sci-fi%20military%20fortress&width=600&height=340&seq=planet-talos&orientation=landscape',
  },
  {
    id: 'desh-minor',
    name: 'Desh Minor',
    system: 'Desh System',
    coordinates: '[9:44:6]',
    terrain: 'desert',
    population: 980000,
    defenseRating: 38,
    fortificationLevel: 2,
    garrisonStrength: 3500,
    airDefenseLevel: 1,
    shieldStrength: 15,
    strategicValue: 40,
    resources: { metal: 38000, crystal: 5000, credits: 22000 },
    faction: 'Desh Raiders',
    defenseModifiers: ['Sandstorms', 'Scattered Outposts'],
    image: 'https://readdy.ai/api/search-image?query=barren%20desert%20planet%20from%20orbit%20with%20vast%20sand%20dunes%20cracked%20terrain%20no%20vegetation%20harsh%20arid%20world%20sci-fi%20orange%20red%20planet%20orbital%20view&width=600&height=340&seq=planet-desh&orientation=landscape',
  },
  {
    id: 'glacius-7',
    name: 'Glacius VII',
    system: 'Glacius System',
    coordinates: '[11:320:2]',
    terrain: 'arctic',
    population: 540000,
    defenseRating: 48,
    fortificationLevel: 3,
    garrisonStrength: 6200,
    airDefenseLevel: 3,
    shieldStrength: 40,
    strategicValue: 58,
    resources: { metal: 15000, crystal: 32000, credits: 31000 },
    faction: 'Glacius Dominion',
    defenseModifiers: ['Blizzard Conditions', 'Subterranean Bunkers', 'Ice Fortifications'],
    image: 'https://readdy.ai/api/search-image?query=frozen%20ice%20planet%20from%20orbit%20with%20swirling%20white%20blizzard%20storms%20polar%20surface%20cracked%20glaciers%20sci-fi%20blue%20white%20icy%20world%20distant%20star&width=600&height=340&seq=planet-glacius&orientation=landscape',
  },
];

export const AVAILABLE_UNITS_FOR_GROUND = [
  {
    unitId: 'infantry-soldier',
    unitName: 'Infantry Soldier',
    unitClass: 'soldier',
    sector: 'Ground Forces',
    count: 1800,
    combatPower: 80,
    specialAbility: 'Fortify Position',
    role: 'vanguard' as GroundRole,
    icon: 'ri-sword-line',
    rarity: 'Common',
  },
  {
    unitId: 'shock-trooper',
    unitName: 'Shock Trooper',
    unitClass: 'veteran',
    sector: 'Heavy Assault',
    count: 520,
    combatPower: 160,
    specialAbility: 'Breach and Clear',
    role: 'shock-assault' as GroundRole,
    icon: 'ri-shield-flash-line',
    rarity: 'Rare',
  },
  {
    unitId: 'commando',
    unitName: 'Special Forces Commando',
    unitClass: 'elite',
    sector: 'Special Operations',
    count: 180,
    combatPower: 185,
    specialAbility: 'Ghost Mode',
    role: 'special-ops' as GroundRole,
    icon: 'ri-user-search-line',
    rarity: 'Rare',
  },
  {
    unitId: 'elite-marine',
    unitName: 'Elite Marine',
    unitClass: 'special-ops',
    sector: 'Special Operations',
    count: 85,
    combatPower: 210,
    specialAbility: 'Tactical Strike',
    role: 'special-ops' as GroundRole,
    icon: 'ri-sword-line',
    rarity: 'Epic',
  },
  {
    unitId: 'tactical-officer',
    unitName: 'Tactical Officer',
    unitClass: 'officer',
    sector: 'Naval Command',
    count: 42,
    combatPower: 105,
    specialAbility: 'Flanking Maneuver',
    role: 'command' as GroundRole,
    icon: 'ri-map-2-line',
    rarity: 'Rare',
  },
  {
    unitId: 'psi-operative',
    unitName: 'Psi Operative',
    unitClass: 'special-ops',
    sector: 'Psi Corps',
    count: 12,
    combatPower: 220,
    specialAbility: 'Mind Blast',
    role: 'fire-support' as GroundRole,
    icon: 'ri-mental-health-line',
    rarity: 'Epic',
  },
  {
    unitId: 'basic-recruit',
    unitName: 'Basic Recruit',
    unitClass: 'recruit',
    sector: 'Ground Forces',
    count: 2500,
    combatPower: 40,
    specialAbility: 'Last Stand',
    role: 'reserve' as GroundRole,
    icon: 'ri-shield-user-line',
    rarity: 'Common',
  },
  {
    unitId: 'field-agent',
    unitName: 'Field Agent',
    unitClass: 'elite',
    sector: 'Intelligence',
    count: 65,
    combatPower: 145,
    specialAbility: 'Sabotage Mission',
    role: 'special-ops' as GroundRole,
    icon: 'ri-user-search-line',
    rarity: 'Rare',
  },
];

function generateBattleEvents(
  mission: Partial<InvasionMission>,
  outcome: 'victory' | 'defeat' | 'partial'
): BattleEvent[] {
  const events: BattleEvent[] = [];
  const target = mission.targetPlanet!;
  const units = mission.assignedUnits || [];
  let idx = 0;

  const add = (
    phase: InvasionPhase,
    type: BattleEvent['type'],
    message: string,
    unit?: string
  ) => {
    events.push({ id: `evt-${idx++}`, timestamp: `T+${idx * 4}min`, phase, type, message, unitInvolved: unit });
  };

  add('orbital-bombardment', 'info', `Fleet begins orbital bombardment of ${target.name}. Shield systems at ${target.shieldStrength}%.`);
  if (mission.orbitalSupport) {
    add('orbital-bombardment', 'advance', `Orbital strike neutralizes ${Math.floor(target.garrisonStrength * 0.12)} enemy garrison units.`);
    add('orbital-bombardment', 'advance', `AA batteries in Sector 4 destroyed by naval barrage.`);
  }
  add('landing', 'info', `Dropships begin planetary descent. Terrain: ${TERRAIN_MODIFIERS[target.terrain].label}.`);

  const vanguard = units.find(u => u.role === 'vanguard');
  const shockUnit = units.find(u => u.role === 'shock-assault');
  const specOps = units.find(u => u.role === 'special-ops');
  const cmdUnit = units.find(u => u.role === 'command');

  if (vanguard) add('landing', 'advance', `${vanguard.unitName} establish beachhead at LZ-Alpha. Minor resistance.`, vanguard.unitName);
  if (specOps) add('landing', 'ability', `${specOps.unitName} deploy via HALO insertion to disable enemy communications.`, specOps.unitName);

  add('assault', 'assault', `Main assault wave pushes forward. Enemy fortification level: ${target.fortificationLevel}/10.`);
  if (shockUnit) add('assault', 'ability', `${shockUnit.unitName} activate BREACH AND CLEAR on fortified position — enemy line buckles!`, shockUnit.unitName);
  if (cmdUnit) add('assault', 'advance', `${cmdUnit.unitName} execute flanking maneuver — enemy flank collapses.`, cmdUnit.unitName);

  const psiUnit = units.find(u => u.unitId === 'psi-operative');
  if (psiUnit) add('assault', 'ability', `Psi Operative unleashes MIND BLAST — 200 enemy soldiers incapacitated instantly!`, psiUnit.unitName);

  add('assault', 'casualty', `Heavy fighting at the ${target.terrain === 'urban' ? 'city center' : 'main compound'}. Casualties reported.`);

  if (outcome === 'victory') {
    add('occupation', 'capture', `Enemy commander surrenders. ${target.name} is under Imperial control!`);
    add('occupation', 'victory', `Planetary garrison destroyed. Resources secured. Mission accomplished.`);
  } else if (outcome === 'defeat') {
    add('assault', 'warning', `Enemy reinforcements arrive. Combat power advantage lost.`);
    add('assault', 'defeat', `Imperial forces overwhelmed. Emergency retreat ordered. Units pulling back to orbit.`);
  } else {
    add('occupation', 'capture', `Partial victory — primary objective secured but outer zones remain contested.`);
    add('occupation', 'warning', `Guerrilla resistance continues in ${Math.floor(target.fortificationLevel * 12)}% of territory.`);
  }

  return events;
}

function calcSuccessChance(units: AssignedUnit[], target: TargetPlanet, missionType: MissionType, orbital: boolean): number {
  const totalPower = units.reduce((sum, u) => sum + u.combatPower * Math.min(u.count, 500), 0);
  const enemyPower = target.garrisonStrength * (target.defenseRating / 10);
  const terrain = TERRAIN_MODIFIERS[target.terrain];
  let base = Math.min(95, Math.max(5, (totalPower / (enemyPower + 1)) * 50));

  // terrain modifier
  base += terrain.attackMod * 100;
  // orbital support
  if (orbital) base += 12;
  // mission type modifiers
  if (missionType === 'sabotage' || missionType === 'assassination') base += 10;
  if (missionType === 'full-invasion') base -= 5;

  // role bonuses
  if (units.some(u => u.role === 'command')) base += 8;
  if (units.some(u => u.role === 'special-ops')) base += 6;
  if (units.some(u => u.role === 'shock-assault')) base += 5;

  return Math.min(97, Math.max(3, Math.round(base)));
}

export function useGroundCombat() {
  const [activeTab, setActiveTab] = useState<'briefing' | 'deploy' | 'active' | 'history'>('briefing');
  const [selectedPlanet, setSelectedPlanet] = useState<TargetPlanet | null>(null);
  const [selectedMission, setSelectedMission] = useState<MissionType>('full-invasion');
  const [assignedUnits, setAssignedUnits] = useState<AssignedUnit[]>([]);
  const [unitCounts, setUnitCounts] = useState<Record<string, number>>({});
  const [orbitalSupport, setOrbitalSupport] = useState(false);
  const [activeMissions, setActiveMissions] = useState<InvasionMission[]>([]);
  const [battleReports, setBattleReports] = useState<BattleReport[]>([]);
  const [simulating, setSimulating] = useState(false);
  const [showReport, setShowReport] = useState<BattleReport | null>(null);

  const terrainMods = selectedPlanet ? TERRAIN_MODIFIERS[selectedPlanet.terrain] : null;

  const assignUnit = useCallback((unit: typeof AVAILABLE_UNITS_FOR_GROUND[0], count: number) => {
    setAssignedUnits(prev => {
      const existing = prev.find(u => u.unitId === unit.unitId);
      if (existing) {
        return prev.map(u => u.unitId === unit.unitId ? { ...u, count } : u);
      }
      return [...prev, { ...unit, count }];
    });
    setUnitCounts(prev => ({ ...prev, [unit.unitId]: count }));
  }, []);

  const removeUnit = useCallback((unitId: string) => {
    setAssignedUnits(prev => prev.filter(u => u.unitId !== unitId));
    setUnitCounts(prev => { const n = { ...prev }; delete n[unitId]; return n; });
  }, []);

  const totalCombatPower = assignedUnits.reduce((sum, u) => sum + u.combatPower * Math.min(u.count, 500), 0);
  const successChance = selectedPlanet
    ? calcSuccessChance(assignedUnits, selectedPlanet, selectedMission, orbitalSupport)
    : 0;

  const launchMission = useCallback(() => {
    if (!selectedPlanet || assignedUnits.length === 0) return;
    const mission: InvasionMission = {
      id: `inv-${Date.now()}`,
      targetPlanet: selectedPlanet,
      missionType: selectedMission,
      assignedUnits: [...assignedUnits],
      phase: 'orbital-bombardment',
      totalCombatPower,
      orbitalSupport,
      bombStarted: false,
      startedAt: new Date(),
      estimatedDuration: selectedMission === 'full-invasion' ? '45 min' : '20 min',
      successChance,
      status: 'active',
    };
    setActiveMissions(prev => [...prev, mission]);
    setSimulating(true);

    // Simulate battle resolution after delay
    setTimeout(() => {
      const roll = Math.random() * 100;
      const outcome: 'victory' | 'defeat' | 'partial' =
        roll < mission.successChance * 0.85
          ? 'victory'
          : roll < mission.successChance
          ? 'partial'
          : 'defeat';

      const casualties = outcome === 'victory'
        ? Math.floor(assignedUnits.reduce((s, u) => s + u.count, 0) * 0.08)
        : outcome === 'partial'
        ? Math.floor(assignedUnits.reduce((s, u) => s + u.count, 0) * 0.22)
        : Math.floor(assignedUnits.reduce((s, u) => s + u.count, 0) * 0.45);

      const report: BattleReport = {
        missionId: mission.id,
        outcome,
        duration: mission.estimatedDuration,
        enemyKilled: outcome === 'victory'
          ? Math.floor(selectedPlanet.garrisonStrength * 0.95)
          : Math.floor(selectedPlanet.garrisonStrength * 0.4),
        ownCasualties: casualties,
        facilitiesCaptured: outcome !== 'defeat'
          ? ['Command Bunker', 'Fuel Depot', 'Power Station']
          : [],
        resourcesLooted: outcome === 'victory'
          ? selectedPlanet.resources
          : outcome === 'partial'
          ? { metal: Math.floor(selectedPlanet.resources.metal * 0.4), crystal: Math.floor(selectedPlanet.resources.crystal * 0.4), credits: Math.floor(selectedPlanet.resources.credits * 0.3) }
          : { metal: 0, crystal: 0, credits: 0 },
        experienceGained: outcome === 'victory' ? 5000 : outcome === 'partial' ? 2500 : 1000,
        planetCaptured: outcome === 'victory' && selectedMission === 'full-invasion',
        events: generateBattleEvents(mission, outcome),
      };

      setActiveMissions(prev => prev.map(m => m.id === mission.id ? { ...m, status: outcome === 'defeat' ? 'failed' : 'completed', phase: outcome === 'defeat' ? 'defeat' : 'victory' } : m));
      setBattleReports(prev => [report, ...prev]);
      setSimulating(false);
      setShowReport(report);
      setActiveTab('active');
    }, 3000);

    setActiveTab('active');
    setAssignedUnits([]);
    setUnitCounts({});
    setSelectedPlanet(null);
  }, [selectedPlanet, assignedUnits, selectedMission, orbitalSupport, successChance, totalCombatPower]);

  return {
    activeTab, setActiveTab,
    selectedPlanet, setSelectedPlanet,
    selectedMission, setSelectedMission,
    assignedUnits,
    unitCounts,
    orbitalSupport, setOrbitalSupport,
    activeMissions,
    battleReports,
    simulating,
    showReport, setShowReport,
    terrainMods,
    totalCombatPower,
    successChance,
    assignUnit,
    removeUnit,
    launchMission,
    TARGET_PLANETS,
    AVAILABLE_UNITS: AVAILABLE_UNITS_FOR_GROUND,
    TERRAIN_MODIFIERS,
    MISSION_TYPE_LABELS,
  };
}
