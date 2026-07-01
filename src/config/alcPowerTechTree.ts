export type AlcTechCategory = 'grid' | 'reactors' | 'transmission' | 'stability' | 'storage';

export interface AlcTechDef {
  id: string;
  name: string;
  category: AlcTechCategory;
  tier: number;
  maxLevel: number;
  description: string;
  lore: string;
  effects: { type: string; target: string; valuePerLevel: number; unit: string }[];
  baseCost: { metal: number; crystal: number; deuterium: number };
  costFactor: number;
  baseTime: number;
  timeFactor: number;
  requirements: { research?: string[]; gridLevel?: number };
  unlocks: string[];
  icon: string;
  color: string;
}

export const ALC_CATEGORIES: Record<AlcTechCategory, { name: string; icon: string; color: string; description: string }> = {
  grid: { name: 'Grid Operations', icon: 'ri-grid-line', color: '#06b6d4', description: 'Power grid topology, efficiency, and automation' },
  reactors: { name: 'Reactor Enhancement', icon: 'ri-flashlight-fill', color: '#a855f7', description: 'Advanced reactor output and class specialization' },
  transmission: { name: 'Transmission Tech', icon: 'ri-route-line', color: '#22d3ee', description: 'Power connection types and loss reduction' },
  stability: { name: 'Stability & Safety', icon: 'ri-shield-check-line', color: '#34d399', description: 'Meltdown prevention and system hardening' },
  storage: { name: 'Energy Storage', icon: 'ri-battery-line', color: '#fbbf24', description: 'Reserve capacity and surge protection' },
};

export const ALC_POWER_TECH_TREE: Record<string, AlcTechDef> = {
  // ═══════════════════════════════════════════════
  // TIER 1 — Foundation
  // ═══════════════════════════════════════════════
  alc_grid_basics: {
    id: 'alc_grid_basics',
    name: 'Basic Grid Management',
    category: 'grid',
    tier: 1,
    maxLevel: 15,
    description: 'Establishes fundamental power grid operations. Reduces transmission loss and improves baseline efficiency.',
    lore: 'The ALC power grid protocol was first developed by Arknights Limited Company to standardize energy distribution across off-world colonies.',
    effects: [
      { type: 'transmission_efficiency', target: 'all', valuePerLevel: 2, unit: '%' },
      { type: 'grid_efficiency', target: 'all', valuePerLevel: 1, unit: '%' },
    ],
    baseCost: { metal: 1000, crystal: 500, deuterium: 200 },
    costFactor: 1.5,
    baseTime: 120,
    timeFactor: 1.5,
    requirements: {},
    unlocks: ['alc_grid_topology', 'alc_stability_basics', 'alc_reactor_standard'],
    icon: 'ri-grid-line',
    color: '#06b6d4',
  },

  alc_stability_basics: {
    id: 'alc_stability_basics',
    name: 'Reactor Safety Protocols',
    category: 'stability',
    tier: 1,
    maxLevel: 15,
    description: 'Implements basic safety systems for all reactor types. Reduces meltdown risk and improves wear resistance.',
    lore: 'After several catastrophic grid failures, ALC mandated universal safety protocols for all reactor installations.',
    effects: [
      { type: 'meltdown_risk', target: 'all', valuePerLevel: -3, unit: '%' },
      { type: 'reactor_durability', target: 'all', valuePerLevel: 3, unit: '%' },
    ],
    baseCost: { metal: 800, crystal: 600, deuterium: 300 },
    costFactor: 1.5,
    baseTime: 100,
    timeFactor: 1.5,
    requirements: { research: ['alc_grid_basics'] },
    unlocks: ['alc_stability_hardening', 'alc_transmission_hv'],
    icon: 'ri-shield-check-line',
    color: '#34d399',
  },

  alc_reactor_standard: {
    id: 'alc_reactor_standard',
    name: 'Standard Reactor Calibration',
    category: 'reactors',
    tier: 1,
    maxLevel: 20,
    description: 'Optimizes standard-class reactor output through precision calibration and fuel mixture tuning.',
    lore: 'Standard reactors form the backbone of colonial power grids. ALC calibration techniques unlock an extra 40% output from existing hardware.',
    effects: [
      { type: 'reactor_output', target: 'Standard', valuePerLevel: 3, unit: '%' },
      { type: 'reactor_efficiency', target: 'Standard', valuePerLevel: 1, unit: '%' },
    ],
    baseCost: { metal: 1500, crystal: 800, deuterium: 400 },
    costFactor: 1.6,
    baseTime: 180,
    timeFactor: 1.6,
    requirements: { research: ['alc_grid_basics'] },
    unlocks: ['alc_reactor_advanced', 'alc_storage_cell'],
    icon: 'ri-flashlight-line',
    color: '#a855f7',
  },

  // ═══════════════════════════════════════════════
  // TIER 2 — Intermediate
  // ═══════════════════════════════════════════════
  alc_grid_topology: {
    id: 'alc_grid_topology',
    name: 'Grid Topology Optimization',
    category: 'grid',
    tier: 2,
    maxLevel: 10,
    description: 'Reconfigures grid architecture for higher reactor density and improved power flow.',
    lore: 'ALC grid topology uses fractal distribution patterns first observed in Endfield power networks.',
    effects: [
      { type: 'grid_size', target: 'all', valuePerLevel: 1, unit: 'cells' },
      { type: 'transmission_efficiency', target: 'all', valuePerLevel: 3, unit: '%' },
    ],
    baseCost: { metal: 4000, crystal: 2000, deuterium: 800 },
    costFactor: 1.7,
    baseTime: 300,
    timeFactor: 1.7,
    requirements: { research: ['alc_grid_basics'], gridLevel: 3 },
    unlocks: ['alc_grid_automation', 'alc_transmission_hv'],
    icon: 'ri-layout-grid-line',
    color: '#06b6d4',
  },

  alc_reactor_advanced: {
    id: 'alc_reactor_advanced',
    name: 'Advanced Reactor Tuning',
    category: 'reactors',
    tier: 2,
    maxLevel: 20,
    description: 'Advanced tuning protocols for improved-class reactors. Increases output and reduces fuel consumption.',
    lore: 'Advanced reactors use composite fuel rods developed through ALC materials science.',
    effects: [
      { type: 'reactor_output', target: 'Advanced', valuePerLevel: 4, unit: '%' },
      { type: 'reactor_efficiency', target: 'Advanced', valuePerLevel: 2, unit: '%' },
    ],
    baseCost: { metal: 5000, crystal: 3000, deuterium: 1500 },
    costFactor: 1.7,
    baseTime: 400,
    timeFactor: 1.7,
    requirements: { research: ['alc_reactor_standard'] },
    unlocks: ['alc_reactor_elite', 'alc_transmission_hv'],
    icon: 'ri-flashlight-fill',
    color: '#a855f7',
  },

  alc_transmission_hv: {
    id: 'alc_transmission_hv',
    name: 'High-Voltage Transmission',
    category: 'transmission',
    tier: 2,
    maxLevel: 10,
    description: 'Unlocks high-voltage connection type. Significantly increases max capacity per connection.',
    lore: 'ALC high-voltage standards became the galactic benchmark for inter-colony power transfer.',
    effects: [
      { type: 'unlock_connection', target: 'high_voltage', valuePerLevel: 1, unit: 'tier' },
      { type: 'hv_efficiency', target: 'high_voltage', valuePerLevel: 2, unit: '%' },
    ],
    baseCost: { metal: 3000, crystal: 4000, deuterium: 2000 },
    costFactor: 1.6,
    baseTime: 360,
    timeFactor: 1.6,
    requirements: { research: ['alc_grid_topology', 'alc_stability_basics'] },
    unlocks: ['alc_transmission_sc'],
    icon: 'ri-flashlight-line',
    color: '#22d3ee',
  },

  alc_storage_cell: {
    id: 'alc_storage_cell',
    name: 'Energy Cell Technology',
    category: 'storage',
    tier: 2,
    maxLevel: 15,
    description: 'Develops high-density energy cells for grid buffering and surge protection.',
    lore: 'ALC energy cells use crystalline lattice structures to store power with minimal leakage.',
    effects: [
      { type: 'storage_capacity', target: 'all', valuePerLevel: 5, unit: '%' },
      { type: 'surge_protection', target: 'all', valuePerLevel: 4, unit: '%' },
    ],
    baseCost: { metal: 2000, crystal: 4000, deuterium: 1000 },
    costFactor: 1.5,
    baseTime: 240,
    timeFactor: 1.5,
    requirements: { research: ['alc_reactor_standard'] },
    unlocks: ['alc_storage_capacitor'],
    icon: 'ri-battery-line',
    color: '#fbbf24',
  },

  alc_stability_hardening: {
    id: 'alc_stability_hardening',
    name: 'Reactor Hardening',
    category: 'stability',
    tier: 2,
    maxLevel: 15,
    description: 'Reinforces reactor housing and cooling systems against wear and thermal stress.',
    lore: 'Endfield-grade hardening allows reactors to operate at 120% rated capacity without structural degradation.',
    effects: [
      { type: 'reactor_durability', target: 'all', valuePerLevel: 4, unit: '%' },
      { type: 'overload_tolerance', target: 'all', valuePerLevel: 3, unit: '%' },
    ],
    baseCost: { metal: 3000, crystal: 2000, deuterium: 1500 },
    costFactor: 1.6,
    baseTime: 300,
    timeFactor: 1.6,
    requirements: { research: ['alc_stability_basics'] },
    unlocks: ['alc_stability_emergency', 'alc_reactor_elite'],
    icon: 'ri-shield-line',
    color: '#34d399',
  },

  // ═══════════════════════════════════════════════
  // TIER 3 — Advanced
  // ═══════════════════════════════════════════════
  alc_grid_automation: {
    id: 'alc_grid_automation',
    name: 'Grid Automation Systems',
    category: 'grid',
    tier: 3,
    maxLevel: 10,
    description: 'Automates grid load balancing and reactor cycling. Reduces maintenance costs and improves uptime.',
    lore: 'Fully autonomous grid management was an ALC breakthrough that eliminated the need for human grid operators.',
    effects: [
      { type: 'maintenance_cost', target: 'all', valuePerLevel: -8, unit: '%' },
      { type: 'grid_uptime', target: 'all', valuePerLevel: 3, unit: '%' },
    ],
    baseCost: { metal: 12000, crystal: 8000, deuterium: 4000 },
    costFactor: 1.8,
    baseTime: 600,
    timeFactor: 1.8,
    requirements: { research: ['alc_grid_topology'], gridLevel: 5 },
    unlocks: ['alc_storage_capacitor', 'alc_transmission_sc'],
    icon: 'ri-robot-line',
    color: '#06b6d4',
  },

  alc_reactor_elite: {
    id: 'alc_reactor_elite',
    name: 'Elite Reactor Optimization',
    category: 'reactors',
    tier: 3,
    maxLevel: 20,
    description: 'Unlocks the full potential of elite-class reactors through advanced magnetic confinement.',
    lore: 'Elite reactors feature ALC-patented magnetic confinement fields that dramatically increase plasma temperatures.',
    effects: [
      { type: 'reactor_output', target: 'Elite', valuePerLevel: 5, unit: '%' },
      { type: 'reactor_efficiency', target: 'Elite', valuePerLevel: 2, unit: '%' },
    ],
    baseCost: { metal: 15000, crystal: 10000, deuterium: 6000 },
    costFactor: 1.8,
    baseTime: 800,
    timeFactor: 1.8,
    requirements: { research: ['alc_reactor_advanced', 'alc_stability_hardening'] },
    unlocks: ['alc_reactor_master', 'alc_stability_emergency'],
    icon: 'ri-fire-line',
    color: '#a855f7',
  },

  alc_transmission_sc: {
    id: 'alc_transmission_sc',
    name: 'Superconductor Networks',
    category: 'transmission',
    tier: 3,
    maxLevel: 10,
    description: 'Unlocks superconductor connection type. Near-lossless power transfer across the grid.',
    lore: 'Room-temperature superconductors revolutionized power distribution, making long-range grid connections viable.',
    effects: [
      { type: 'unlock_connection', target: 'superconductor', valuePerLevel: 1, unit: 'tier' },
      { type: 'sc_efficiency', target: 'superconductor', valuePerLevel: 1, unit: '%' },
    ],
    baseCost: { metal: 10000, crystal: 15000, deuterium: 8000 },
    costFactor: 1.7,
    baseTime: 720,
    timeFactor: 1.7,
    requirements: { research: ['alc_transmission_hv', 'alc_grid_automation'] },
    unlocks: ['alc_transmission_qr'],
    icon: 'ri-lightning-line',
    color: '#22d3ee',
  },

  alc_stability_emergency: {
    id: 'alc_stability_emergency',
    name: 'Emergency Shutdown Matrix',
    category: 'stability',
    tier: 3,
    maxLevel: 10,
    description: 'Implements cascading emergency shutdown protocols. Prevents meltdown propagation across the grid.',
    lore: 'The ALC Emergency Shutdown Matrix can isolate and contain a failing reactor in under 200 milliseconds.',
    effects: [
      { type: 'meltdown_risk', target: 'all', valuePerLevel: -5, unit: '%' },
      { type: 'containment_speed', target: 'all', valuePerLevel: 10, unit: '%' },
    ],
    baseCost: { metal: 8000, crystal: 6000, deuterium: 5000 },
    costFactor: 1.7,
    baseTime: 500,
    timeFactor: 1.7,
    requirements: { research: ['alc_stability_hardening', 'alc_reactor_elite'] },
    unlocks: ['alc_stability_mastery'],
    icon: 'ri-alarm-warning-line',
    color: '#34d399',
  },

  alc_storage_capacitor: {
    id: 'alc_storage_capacitor',
    name: 'Capacitor Bank Arrays',
    category: 'storage',
    tier: 3,
    maxLevel: 12,
    description: 'Massive capacitor banks that absorb grid spikes and provide emergency reserve power.',
    lore: 'Capacitor arrays can discharge their entire stored energy in under a second — enough to restart a dead grid.',
    effects: [
      { type: 'storage_capacity', target: 'all', valuePerLevel: 8, unit: '%' },
      { type: 'discharge_rate', target: 'all', valuePerLevel: 5, unit: '%' },
    ],
    baseCost: { metal: 8000, crystal: 12000, deuterium: 4000 },
    costFactor: 1.6,
    baseTime: 480,
    timeFactor: 1.6,
    requirements: { research: ['alc_storage_cell', 'alc_grid_automation'] },
    unlocks: ['alc_storage_quantum'],
    icon: 'ri-battery-2-line',
    color: '#fbbf24',
  },

  // ═══════════════════════════════════════════════
  // TIER 4 — Expert
  // ═══════════════════════════════════════════════
  alc_reactor_master: {
    id: 'alc_reactor_master',
    name: 'Master Reactor Synthesis',
    category: 'reactors',
    tier: 4,
    maxLevel: 15,
    description: 'Master-class reactors with synthetic fuel cores. Dramatically increases power density.',
    lore: 'Master reactors use ALC synthetic fuel — a meta-stable compound that releases energy through controlled quantum decay.',
    effects: [
      { type: 'reactor_output', target: 'Master', valuePerLevel: 6, unit: '%' },
      { type: 'reactor_efficiency', target: 'Master', valuePerLevel: 3, unit: '%' },
    ],
    baseCost: { metal: 40000, crystal: 30000, deuterium: 20000 },
    costFactor: 1.9,
    baseTime: 1500,
    timeFactor: 1.9,
    requirements: { research: ['alc_reactor_elite'] },
    unlocks: ['alc_reactor_grandmaster', 'alc_stability_mastery'],
    icon: 'ri-fire-fill',
    color: '#a855f7',
  },

  alc_transmission_qr: {
    id: 'alc_transmission_qr',
    name: 'Quantum Relay Network',
    category: 'transmission',
    tier: 4,
    maxLevel: 8,
    description: 'Unlocks quantum relay connection type. Instantaneous power transfer with zero loss.',
    lore: 'Quantum entanglement relays allow power to be transmitted instantaneously across any distance — an ALC-exclusive breakthrough.',
    effects: [
      { type: 'unlock_connection', target: 'quantum_relay', valuePerLevel: 1, unit: 'tier' },
      { type: 'qr_efficiency', target: 'quantum_relay', valuePerLevel: 0.5, unit: '%' },
    ],
    baseCost: { metal: 30000, crystal: 50000, deuterium: 25000 },
    costFactor: 1.8,
    baseTime: 1200,
    timeFactor: 1.8,
    requirements: { research: ['alc_transmission_sc'], gridLevel: 8 },
    unlocks: [],
    icon: 'ri-focus-2-line',
    color: '#22d3ee',
  },

  alc_stability_mastery: {
    id: 'alc_stability_mastery',
    name: 'Stability Field Mastery',
    category: 'stability',
    tier: 4,
    maxLevel: 10,
    description: 'Creates a stability field across the entire grid. All reactors gain passive damage resistance and self-repair capability.',
    lore: 'The pinnacle of ALC safety engineering — a grid-wide stability field that passively reinforces all connected reactors.',
    effects: [
      { type: 'meltdown_risk', target: 'all', valuePerLevel: -4, unit: '%' },
      { type: 'self_repair', target: 'all', valuePerLevel: 5, unit: '%' },
      { type: 'reactor_durability', target: 'all', valuePerLevel: 5, unit: '%' },
    ],
    baseCost: { metal: 25000, crystal: 20000, deuterium: 15000 },
    costFactor: 1.8,
    baseTime: 1000,
    timeFactor: 1.8,
    requirements: { research: ['alc_stability_emergency', 'alc_reactor_master'] },
    unlocks: ['alc_storage_quantum'],
    icon: 'ri-shield-star-line',
    color: '#34d399',
  },

  alc_storage_quantum: {
    id: 'alc_storage_quantum',
    name: 'Quantum Energy Storage',
    category: 'storage',
    tier: 4,
    maxLevel: 10,
    description: 'Quantum-state energy storage that can hold vast amounts of power in a compact dimensional pocket.',
    lore: 'ALC quantum storage cells fold energy into subspace dimensions, achieving storage densities thought impossible.',
    effects: [
      { type: 'storage_capacity', target: 'all', valuePerLevel: 12, unit: '%' },
      { type: 'quantum_efficiency', target: 'all', valuePerLevel: 3, unit: '%' },
    ],
    baseCost: { metal: 20000, crystal: 35000, deuterium: 15000 },
    costFactor: 1.7,
    baseTime: 900,
    timeFactor: 1.7,
    requirements: { research: ['alc_storage_capacitor', 'alc_stability_mastery'] },
    unlocks: [],
    icon: 'ri-infinity-line',
    color: '#fbbf24',
  },

  // ═══════════════════════════════════════════════
  // TIER 5 — Master
  // ═══════════════════════════════════════════════
  alc_reactor_grandmaster: {
    id: 'alc_reactor_grandmaster',
    name: 'Grandmaster Singularity Core',
    category: 'reactors',
    tier: 5,
    maxLevel: 12,
    description: 'Grandmaster reactors harness micro-singularities for virtually unlimited power output.',
    lore: 'Creating and containing a microscopic black hole requires the pinnacle of ALC technology. The energy yield is astronomical.',
    effects: [
      { type: 'reactor_output', target: 'Grandmaster', valuePerLevel: 8, unit: '%' },
      { type: 'reactor_efficiency', target: 'Grandmaster', valuePerLevel: 4, unit: '%' },
      { type: 'grid_efficiency', target: 'all', valuePerLevel: 2, unit: '%' },
    ],
    baseCost: { metal: 100000, crystal: 80000, deuterium: 60000, darkMatter: 500 },
    costFactor: 2.0,
    baseTime: 3600,
    timeFactor: 2.0,
    requirements: { research: ['alc_reactor_master'], gridLevel: 10 },
    unlocks: ['alc_reactor_mythic'],
    icon: 'ri-sun-fill',
    color: '#a855f7',
  },

  // ═══════════════════════════════════════════════
  // TIER 6 — Transcendent
  // ═══════════════════════════════════════════════
  alc_reactor_mythic: {
    id: 'alc_reactor_mythic',
    name: 'Mythic Dimensional Reactor',
    category: 'reactors',
    tier: 6,
    maxLevel: 10,
    description: 'Mythic-class reactors tap into alternate dimensions for infinite energy. The ultimate ALC achievement.',
    lore: 'Beyond even singularities, mythic reactors draw power from the quantum foam of alternate realities — a feat of engineering that borders on magic.',
    effects: [
      { type: 'reactor_output', target: 'Mythic', valuePerLevel: 10, unit: '%' },
      { type: 'reactor_efficiency', target: 'Mythic', valuePerLevel: 5, unit: '%' },
      { type: 'all_energy', target: 'all', valuePerLevel: 3, unit: '%' },
    ],
    baseCost: { metal: 500000, crystal: 400000, deuterium: 300000, darkMatter: 5000 },
    costFactor: 2.2,
    baseTime: 7200,
    timeFactor: 2.2,
    requirements: { research: ['alc_reactor_grandmaster'], gridLevel: 15 },
    unlocks: [],
    icon: 'ri-planet-fill',
    color: '#ef4444',
  },
};

export const ALC_TECH_IDS = Object.keys(ALC_POWER_TECH_TREE);

export function getAlcTechCost(techId: string, level: number): { metal: number; crystal: number; deuterium: number; darkMatter?: number } {
  const def = ALC_POWER_TECH_TREE[techId];
  if (!def) return { metal: 0, crystal: 0, deuterium: 0 };
  const factor = Math.pow(def.costFactor, level);
  return {
    metal: Math.floor(def.baseCost.metal * factor),
    crystal: Math.floor(def.baseCost.crystal * factor),
    deuterium: Math.floor(def.baseCost.deuterium * factor),
    ...(def.baseCost as any).darkMatter ? { darkMatter: Math.floor((def.baseCost as any).darkMatter * factor) } : {},
  };
}

export function getAlcTechTime(techId: string, level: number): number {
  const def = ALC_POWER_TECH_TREE[techId];
  if (!def) return 0;
  return Math.floor(def.baseTime * Math.pow(def.timeFactor, level));
}

export function isAlcTechUnlockable(techId: string, currentLevels: Record<string, number>, gridLevel: number): { unlockable: boolean; reason?: string } {
  const def = ALC_POWER_TECH_TREE[techId];
  if (!def) return { unlockable: false, reason: 'Unknown technology' };

  if (def.requirements.research) {
    for (const req of def.requirements.research) {
      const reqLevel = currentLevels[req] ?? 0;
      if (reqLevel < 1) {
        const reqName = ALC_POWER_TECH_TREE[req]?.name ?? req;
        return { unlockable: false, reason: `Requires ${reqName}` };
      }
    }
  }

  if (def.requirements.gridLevel && gridLevel < def.requirements.gridLevel) {
    return { unlockable: false, reason: `Grid level ${def.requirements.gridLevel} required (current: ${gridLevel})` };
  }

  return { unlockable: true };
}

export function getAlcTechsByTier(tier: number): AlcTechDef[] {
  return ALC_TECH_IDS
    .map(id => ALC_POWER_TECH_TREE[id])
    .filter(t => t.tier === tier)
    .sort((a, b) => a.category.localeCompare(b.category));
}

export const ALC_TIER_RANGES = [
  { tier: 1, label: 'Foundation', color: '#9ca3af' },
  { tier: 2, label: 'Intermediate', color: '#22c55e' },
  { tier: 3, label: 'Advanced', color: '#3b82f6' },
  { tier: 4, label: 'Expert', color: '#a855f7' },
  { tier: 5, label: 'Master', color: '#f59e0b' },
  { tier: 6, label: 'Transcendent', color: '#ef4444' },
];
