// Power Reactor System - Stellar Dominion inspired power grid mechanics
// 9 Reactor Types × 6 Sub-Classes each = 54 unique reactor variants

export type ReactorClass = 'Civilian' | 'Industrial' | 'Military' | 'Research' | 'Exotic';
export type SubClass = 'Standard' | 'Advanced' | 'Elite' | 'Master' | 'Grandmaster' | 'Mythic';
export type ReactorStatus = 'online' | 'offline' | 'overloaded' | 'damaged' | 'maintenance' | 'meltdown';
export type ConnectionType = 'standard' | 'high_voltage' | 'superconductor' | 'quantum_relay';
export type GridStatus = 'active' | 'overloaded' | 'offline' | 'maintenance';

export interface ReactorDefinition {
  id: number;
  reactor_type: string;
  reactor_name: string;
  reactor_class: ReactorClass;
  sub_class: SubClass;
  tier: number;
  base_power_output: number;
  power_output_per_level: number;
  max_level: number;
  grid_size: number;
  transmission_range: number;
  transmission_loss_pct: number;
  build_cost_metal: number;
  build_cost_crystal: number;
  build_cost_deuterium: number;
  build_time_seconds: number;
  maintenance_energy: number;
  stability_rating: number;
  meltdown_risk_pct: number;
  wear_rate_per_hour: number;
  maintenance_cost_metal: number;
  maintenance_cost_crystal: number;
  maintenance_cost_deuterium: number;
  maintenance_time_seconds: number;
  special_effects: string[];
  required_tech: string | null;
  description: string;
  lore: string;
  image: string;
}

export interface PowerGrid {
  id: number;
  planet_id: string | null;
  moon_id: string | null;
  owner_id: string;
  grid_name: string;
  grid_size_x: number;
  grid_size_y: number;
  total_power_generated: number;
  total_power_consumed: number;
  total_power_loss: number;
  grid_efficiency_pct: number;
  status: GridStatus;
}

export interface PowerReactor {
  id: number;
  grid_id: number;
  definition_id: number;
  reactor_level: number;
  grid_position_x: number;
  grid_position_y: number;
  current_output: number;
  efficiency_pct: number;
  status: ReactorStatus;
  fuel_remaining_pct: number;
  uptime_seconds: number;
  durability_pct: number;
  last_maintenance_at: string;
  total_uptime_hours: number;
  definition?: ReactorDefinition;
}

export interface GridConnection {
  id: number;
  grid_id: number;
  from_node_x: number;
  from_node_y: number;
  to_node_x: number;
  to_node_y: number;
  connection_type: ConnectionType;
  power_flow: number;
  max_capacity: number;
  efficiency_pct: number;
  status: string;
}

export interface GridCell {
  x: number;
  y: number;
  hasReactor: boolean;
  reactor?: PowerReactor;
  isConnected: boolean;
  powerLoad: number;
  isSource: boolean;
}

// Reactor class color mapping
export const REACTOR_CLASS_COLORS: Record<ReactorClass, string> = {
  Civilian: '#34d399',
  Industrial: '#f59e0b',
  Military: '#ef4444',
  Research: '#60a5fa',
  Exotic: '#a78bfa',
};

// Sub-class tier multipliers
export const SUB_CLASS_MULTIPLIERS: Record<SubClass, number> = {
  Standard: 1.0,
  Advanced: 1.4,
  Elite: 2.0,
  Master: 3.0,
  Grandmaster: 4.5,
  Mythic: 7.0,
};

// Sub-class rarity colors
export const SUB_CLASS_COLORS: Record<SubClass, string> = {
  Standard: '#9ca3af',
  Advanced: '#22c55e',
  Elite: '#3b82f6',
  Master: '#a855f7',
  Grandmaster: '#f59e0b',
  Mythic: '#ef4444',
};

// Connection type specifications
export const CONNECTION_TYPES: Record<ConnectionType, { max_capacity: number; efficiency: number; cost: number }> = {
  standard: { max_capacity: 1000, efficiency: 95, cost: 100 },
  high_voltage: { max_capacity: 5000, efficiency: 92, cost: 500 },
  superconductor: { max_capacity: 20000, efficiency: 98, cost: 2000 },
  quantum_relay: { max_capacity: 100000, efficiency: 99.5, cost: 10000 },
};

// Calculate effective efficiency based on durability
export function calculateEffectiveEfficiency(baseEfficiency: number, durabilityPct: number): number {
  if (durabilityPct >= 80) return baseEfficiency;
  if (durabilityPct >= 60) return baseEfficiency * 0.95;
  if (durabilityPct >= 40) return baseEfficiency * 0.85;
  if (durabilityPct >= 20) return baseEfficiency * 0.70;
  return baseEfficiency * 0.50;
}

// Calculate durability penalty description
export function getDurabilityStatus(durabilityPct: number): { label: string; color: string } {
  if (durabilityPct >= 90) return { label: 'Pristine', color: '#34d399' };
  if (durabilityPct >= 70) return { label: 'Worn', color: '#5bc0be' };
  if (durabilityPct >= 50) return { label: 'Degraded', color: '#fbbf24' };
  if (durabilityPct >= 30) return { label: 'Critical', color: '#fb923c' };
  if (durabilityPct > 0) return { label: 'Failing', color: '#ef4444' };
  return { label: 'Destroyed', color: '#7f1d1d' };
}

// Calculate power output for a reactor at a given level
export function calculateReactorOutput(def: ReactorDefinition, level: number, efficiency: number, durabilityPct?: number): number {
  const eff = durabilityPct !== undefined ? calculateEffectiveEfficiency(efficiency, durabilityPct) : efficiency;
  const baseOutput = def.base_power_output + (def.power_output_per_level * (level - 1));
  const classMultiplier = SUB_CLASS_MULTIPLIERS[def.sub_class];
  return Math.floor(baseOutput * classMultiplier * (eff / 100));
}

// Calculate transmission loss between two grid positions
export function calculateTransmissionLoss(
  fromX: number, fromY: number,
  toX: number, toY: number,
  lossPerUnit: number,
  connectionType: ConnectionType
): number {
  const distance = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
  const connEfficiency = CONNECTION_TYPES[connectionType].efficiency / 100;
  return distance * lossPerUnit * (2 - connEfficiency);
}

// Get reactor type icon
export function getReactorIcon(reactorType: string): string {
  const icons: Record<string, string> = {
    'Fusion Reactor': 'ri-sun-line',
    'Antimatter Reactor': 'ri-contrast-drop-line',
    'Solar Collector': 'ri-sun-fill',
    'Dark Matter Reactor': 'ri-moon-clear-line',
    'Zero-Point Reactor': 'ri-bubble-chart-line',
    'Geothermal Tap': 'ri-earth-line',
    'Plasma Reactor': 'ri-flashlight-line',
    'Bio-Reactor': 'ri-leaf-line',
    'Dimensional Reactor': 'ri-door-open-line',
  };
  return icons[reactorType] || 'ri-flashlight-fill';
}