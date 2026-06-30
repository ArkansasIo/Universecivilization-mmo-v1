// ═══════════════════════════════════════════════════════════════════════════
// STARSHIP BUFF / DEBUFF DEFINITIONS
// Runtime-usable effect definitions mapped to ship stat modifications
// ═══════════════════════════════════════════════════════════════════════════

import {
  BuffType, DebuffType,
  BUFF_SUB_TYPES, DEBUFF_SUB_TYPES,
  TECH_SUB_STATS, TechStat,
} from '../config/starshipTechTree';

// ─────────────────────────────────────────────────────────────────────────────
// SHIP STAT MODIFIER — links a buff/debuff to a specific ship stat
// ─────────────────────────────────────────────────────────────────────────────
export interface ShipStatModifier {
  stat:       string;   // Sub-stat name from TECH_SUB_STATS
  operation:  'add' | 'multiply' | 'override';
  value:      number;
}

// ─────────────────────────────────────────────────────────────────────────────
// RUNTIME BUFF INSTANCE
// ─────────────────────────────────────────────────────────────────────────────
export interface BuffInstance {
  id:            string;
  name:          string;
  buffType:      BuffType;
  subBuff:       string;
  source:        string;           // Tech ID or item that granted this
  modifiers:     ShipStatModifier[];
  duration:      number;           // Remaining seconds (0 = permanent)
  maxDuration:   number;
  stackable:     boolean;
  currentStacks: number;
  maxStacks:     number;
  target:        'self' | 'fleet' | 'allied' | 'enemy';
  icon:          string;
}

// ─────────────────────────────────────────────────────────────────────────────
// RUNTIME DEBUFF INSTANCE
// ─────────────────────────────────────────────────────────────────────────────
export interface DebuffInstance {
  id:            string;
  name:          string;
  debuffType:    DebuffType;
  subDebuff:     string;
  source:        string;
  modifiers:     ShipStatModifier[];
  duration:      number;
  maxDuration:   number;
  stackable:     boolean;
  currentStacks: number;
  maxStacks:     number;
  target:        'self' | 'fleet' | 'allied' | 'enemy';
  icon:          string;
}

// ─────────────────────────────────────────────────────────────────────────────
// BUFF TEMPLATES — defines what each buff does to ship stats
// Each sub-buff maps to one or more stat modifiers
// ─────────────────────────────────────────────────────────────────────────────

export type BuffTemplateMap = Record<string, Record<string, ShipStatModifier[]>>;

export const BUFF_TEMPLATES: BuffTemplateMap = {

  // ── Offensive Buffs ────────────────────────────────────────────────────────
  Offensive: {
    'Damage-Up':            [{ stat: 'Weapon-Damage',      operation: 'multiply', value: 0.05 }],
    'Fire-Rate-Up':         [{ stat: 'Fire-Rate',          operation: 'multiply', value: 0.04 }],
    'Crit-Chance-Up':       [{ stat: 'Critical-Chance',    operation: 'add',      value: 0.02 }],
    'Crit-Damage-Up':       [{ stat: 'Critical-Damage',    operation: 'multiply', value: 0.06 }],
    'Range-Up':             [{ stat: 'Range',              operation: 'multiply', value: 0.05 }],
    'Tracking-Up':          [{ stat: 'Tracking-Speed',     operation: 'multiply', value: 0.05 }],
    'Armor-Piercing-Up':    [{ stat: 'Armor-Piercing',     operation: 'multiply', value: 0.04 }],
    'Shield-Piercing-Up':   [{ stat: 'Shield-Penetration', operation: 'multiply', value: 0.04 }],
    'Alpha-Strike-Up':      [{ stat: 'Weapon-Damage',      operation: 'multiply', value: 0.1 }, { stat: 'Fire-Rate', operation: 'multiply', value: -0.05 }],
  },

  // ── Defensive Buffs ────────────────────────────────────────────────────────
  Defensive: {
    'Hull-Up':              [{ stat: 'Max-Hull',           operation: 'multiply', value: 0.06 }],
    'Shield-Up':            [{ stat: 'Max-Shield',         operation: 'multiply', value: 0.06 }],
    'Armor-Up':             [{ stat: 'Armor-Rating',       operation: 'multiply', value: 0.05 }],
    'Damage-Reduction':     [{ stat: 'Structural-Redundancy', operation: 'multiply', value: 0.04 }],
    'Repair-Boost':         [{ stat: 'Self-Repair',        operation: 'add',      value: 0.03 }],
    'Shield-Regen-Up':      [{ stat: 'Shield-Regen',       operation: 'multiply', value: 0.05 }],
    'Deflection-Chance':    [{ stat: 'Collision-Resistance', operation: 'multiply', value: 0.03 }],
    'Absorption-Up':        [{ stat: 'Shield-Absorption',  operation: 'multiply', value: 0.04 }],
    'Reflective-Up':        [{ stat: 'Shield-Reflect',     operation: 'multiply', value: 0.03 }],
  },

  // ── Mobility Buffs ─────────────────────────────────────────────────────────
  Mobility: {
    'Speed-Up':             [{ stat: 'Max-Speed',          operation: 'multiply', value: 0.06 }],
    'Acceleration-Up':      [{ stat: 'Acceleration',       operation: 'multiply', value: 0.05 }],
    'Turn-Rate-Up':         [{ stat: 'Turn-Rate',          operation: 'multiply', value: 0.05 }],
    'Warp-Speed-Up':        [{ stat: 'Warp-Speed',         operation: 'multiply', value: 0.07 }],
    'Jump-Range-Up':        [{ stat: 'Jump-Range',         operation: 'multiply', value: 0.06 }],
    'Evasion-Up':           [{ stat: 'Breach-Resistance',  operation: 'multiply', value: 0.03 }],
    'Maneuverability-Up':   [{ stat: 'Turn-Rate',          operation: 'multiply', value: 0.04 }, { stat: 'Acceleration', operation: 'multiply', value: 0.04 }],
    'Boost-Duration-Up':    [{ stat: 'Emergency-Boost',    operation: 'multiply', value: 0.06 }],
    'Formation-Bonus':      [{ stat: 'Max-Speed',          operation: 'multiply', value: 0.03 }, { stat: 'Acceleration', operation: 'multiply', value: 0.03 }],
  },

  // ── Recovery Buffs ─────────────────────────────────────────────────────────
  Recovery: {
    'Hull-Regen-Up':        [{ stat: 'Hull-Regen',         operation: 'multiply', value: 0.05 }],
    'Shield-Regen-Up':      [{ stat: 'Shield-Regen',       operation: 'multiply', value: 0.05 }],
    'Repair-Speed-Up':      [{ stat: 'Repair-Efficiency',  operation: 'multiply', value: 0.06 }],
    'Energy-Regen-Up':      [{ stat: 'Recharge-Rate',      operation: 'multiply', value: 0.05 }],
    'Cooling-Rate-Up':      [{ stat: 'Heat-Dissipation',   operation: 'multiply', value: 0.05 }],
    'Fuel-Recovery':        [{ stat: 'Deuterium-Saving',   operation: 'multiply', value: 0.04 }],
    'Ammo-Recovery':        [{ stat: 'Ammo-Capacity',      operation: 'multiply', value: 0.04 }],
    'Crew-Recovery':        [{ stat: 'Crew-Survival',      operation: 'multiply', value: 0.04 }],
    'Nanite-Repair':        [{ stat: 'Self-Repair',        operation: 'add',      value: 0.05 }],
  },

  // ── Utility Buffs ──────────────────────────────────────────────────────────
  Utility: {
    'Cargo-Up':             [{ stat: 'Cargo-Capacity',     operation: 'multiply', value: 0.08 }],
    'Mining-Up':            [{ stat: 'Mining-Efficiency',  operation: 'multiply', value: 0.07 }],
    'Salvage-Up':           [{ stat: 'Salvage-Efficiency', operation: 'multiply', value: 0.07 }],
    'Research-Up':          [{ stat: 'Research-Speed',     operation: 'multiply', value: 0.05 }],
    'Production-Up':        [{ stat: 'Production-Efficiency', operation: 'multiply', value: 0.05 }],
    'Trade-Up':             [{ stat: 'Trade-Efficiency',   operation: 'multiply', value: 0.05 }],
    'Refining-Up':          [{ stat: 'Refinement-Efficiency', operation: 'multiply', value: 0.05 }],
    'Construction-Up':      [{ stat: 'Construction-Speed', operation: 'multiply', value: 0.05 }],
    'Scan-Range-Up':        [{ stat: 'Sensor-Range',       operation: 'multiply', value: 0.06 }],
  },

  // ── Tactical Buffs ─────────────────────────────────────────────────────────
  Tactical: {
    'Targeting-Up':         [{ stat: 'Accuracy',           operation: 'multiply', value: 0.04 }],
    'Lock-On-Speed-Up':     [{ stat: 'Target-Lock-Speed',  operation: 'multiply', value: 0.06 }],
    'Weakness-Scan':        [{ stat: 'Shield-Penetration', operation: 'multiply', value: 0.03 }, { stat: 'Armor-Piercing', operation: 'multiply', value: 0.03 }],
    'Precision-Strike':     [{ stat: 'Critical-Chance',    operation: 'add',      value: 0.03 }, { stat: 'Critical-Damage', operation: 'multiply', value: 0.05 }],
    'Volley-Fire':          [{ stat: 'Fire-Rate',          operation: 'multiply', value: 0.06 }, { stat: 'Accuracy', operation: 'multiply', value: -0.02 }],
    'Formation-Attack':     [{ stat: 'Weapon-Damage',      operation: 'multiply', value: 0.03 }, { stat: 'Accuracy', operation: 'multiply', value: 0.02 }],
    'Flanking-Bonus':       [{ stat: 'Weapon-Damage',      operation: 'multiply', value: 0.07 }],
    'Rear-Bonus':           [{ stat: 'Weapon-Damage',      operation: 'multiply', value: 0.1 }],
    'Focus-Fire':           [{ stat: 'Weapon-Damage',      operation: 'multiply', value: 0.04 }, { stat: 'Accuracy', operation: 'multiply', value: 0.04 }],
  },

  // ── Command Buffs ──────────────────────────────────────────────────────────
  Command: {
    'Fleet-Damage-Up':      [{ stat: 'Weapon-Damage',      operation: 'multiply', value: 0.03 }],
    'Fleet-Defense-Up':     [{ stat: 'Max-Shield',         operation: 'multiply', value: 0.03 }, { stat: 'Armor-Rating', operation: 'multiply', value: 0.02 }],
    'Fleet-Speed-Up':       [{ stat: 'Max-Speed',          operation: 'multiply', value: 0.03 }],
    'Fleet-Regen-Up':       [{ stat: 'Shield-Regen',       operation: 'multiply', value: 0.03 }, { stat: 'Hull-Regen', operation: 'multiply', value: 0.02 }],
    'Coordination-Up':      [{ stat: 'Target-Lock-Speed',  operation: 'multiply', value: 0.05 }],
    'Communication-Range':  [{ stat: 'Sensor-Range',       operation: 'multiply', value: 0.05 }],
    'Morale-Up':            [{ stat: 'Crew-Efficiency',    operation: 'multiply', value: 0.05 }],
    'Discipline-Up':        [{ stat: 'Crew-Survival',      operation: 'multiply', value: 0.04 }],
    'Tactical-Intel':       [{ stat: 'Accuracy',           operation: 'multiply', value: 0.04 }, { stat: 'Critical-Chance', operation: 'add', value: 0.01 }],
  },

  // ── Stealth Buffs ──────────────────────────────────────────────────────────
  Stealth: {
    'Cloak-Strength':       [{ stat: 'Sensor-Strength',    operation: 'multiply', value: -0.06 }],
    'Cloak-Stability':      [{ stat: 'Signature-Detection', operation: 'multiply', value: -0.05 }],
    'Signature-Reduction':  [{ stat: 'Signature-Detection', operation: 'multiply', value: -0.06 }],
    'Detection-Resist':     [{ stat: 'Cloak-Detection',    operation: 'multiply', value: -0.05 }],
    'Phase-Stability':      [{ stat: 'Jamming-Resistance', operation: 'multiply', value: 0.05 }],
    'Thermal-Masking':      [{ stat: 'Signature-Detection', operation: 'multiply', value: -0.04 }],
    'EM-Suppression':       [{ stat: 'EM-Suppression',     operation: 'multiply', value: 0.05 }],
    'Visual-Camo':          [{ stat: 'Signature-Detection', operation: 'multiply', value: -0.03 }],
    'Sensor-Spoof':         [{ stat: 'Data-Bandwidth',     operation: 'multiply', value: -0.04 }],
  },

  // ── Resistance Buffs ───────────────────────────────────────────────────────
  Resistance: {
    'Thermal-Resist':       [{ stat: 'Thermal-Resistance', operation: 'multiply', value: 0.06 }],
    'Kinetic-Resist':       [{ stat: 'Kinetic-Resistance', operation: 'multiply', value: 0.06 }],
    'Energy-Resist':        [{ stat: 'Energy-Resistance',  operation: 'multiply', value: 0.06 }],
    'Explosive-Resist':     [{ stat: 'Explosive-Resistance', operation: 'multiply', value: 0.06 }],
    'EM-Resist':            [{ stat: 'EM-Resistance',      operation: 'multiply', value: 0.05 }],
    'Psionic-Resist':       [{ stat: 'Psionic-Resistance', operation: 'multiply', value: 0.05 }],
    'Temporal-Resist':      [{ stat: 'Temporal-Resistance', operation: 'multiply', value: 0.04 }],
    'Void-Resist':          [{ stat: 'Void-Resistance',    operation: 'multiply', value: 0.04 }],
    'Cosmic-Resist':        [{ stat: 'Cosmic-Resistance',  operation: 'multiply', value: 0.03 }],
  },

  // ── Special Buffs ─────────────────────────────────────────────────────────
  Special: {
    'Nanite-Boost':         [{ stat: 'Self-Repair',        operation: 'add',      value: 0.08 }, { stat: 'Repair-Efficiency', operation: 'multiply', value: 0.06 }],
    'Quantum-Empower':      [{ stat: 'Power-Output',       operation: 'multiply', value: 0.08 }, { stat: 'Power-Efficiency', operation: 'multiply', value: 0.05 }],
    'Temporal-Phase':       [{ stat: 'Damage-Stabilization', operation: 'multiply', value: 0.07 }],
    'Dimensional-Shift':    [{ stat: 'Evacuation-Speed',   operation: 'multiply', value: 0.1 }, { stat: 'Emergency-Boost', operation: 'multiply', value: 0.08 }],
    'Reality-Anchor':       [{ stat: 'Structural-Redundancy', operation: 'multiply', value: 0.08 }, { stat: 'Internal-Compartmentalization', operation: 'multiply', value: 0.06 }],
    'Gravity-Stabilize':    [{ stat: 'Collision-Resistance', operation: 'multiply', value: 0.06 }, { stat: 'Turn-Rate', operation: 'multiply', value: 0.05 }],
    'Overcharge':           [{ stat: 'Weapon-Damage',      operation: 'multiply', value: 0.1 }, { stat: 'Shield-Strength', operation: 'multiply', value: -0.05 }],
    'Synergy-Link':         [{ stat: 'Crew-Efficiency',    operation: 'multiply', value: 0.06 }, { stat: 'Data-Processing', operation: 'multiply', value: 0.06 }],
    'Evolution-Trigger':    [{ stat: 'All-Stats',          operation: 'multiply', value: 0.08 }],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DEBUFF TEMPLATES
// Each debuff sub-type maps to stat penalties on the target
// ─────────────────────────────────────────────────────────────────────────────

export const DEBUFF_TEMPLATES: BuffTemplateMap = {

  // ── Damage Debuffs (DoTs) ──────────────────────────────────────────────────
  Damage: {
    'Direct-Damage-Over-Time':      [{ stat: 'Max-Hull',      operation: 'add',      value: -0.02 }],
    'Shield-Damage-Over-Time':      [{ stat: 'Max-Shield',    operation: 'add',      value: -0.02 }],
    'Hull-Damage-Over-Time':        [{ stat: 'Max-Hull',      operation: 'add',      value: -0.03 }],
    'Armor-Degradation':            [{ stat: 'Armor-Rating',  operation: 'multiply', value: -0.04 }],
    'Structure-Weakening':          [{ stat: 'Structural-Redundancy', operation: 'multiply', value: -0.05 }],
    'Internal-Damage':              [{ stat: 'Internal-Compartmentalization', operation: 'multiply', value: -0.04 }],
    'Crew-Damage':                  [{ stat: 'Crew-Survival', operation: 'multiply', value: -0.04 }],
    'System-Damage':                [{ stat: 'Power-Output',  operation: 'multiply', value: -0.04 }],
    'Critical-Damage':              [{ stat: 'Critical-Damage', operation: 'multiply', value: -0.05 }],
  },

  // ── Weakening Debuffs ──────────────────────────────────────────────────────
  Weakening: {
    'Attack-Down':                  [{ stat: 'Weapon-Damage', operation: 'multiply', value: -0.05 }],
    'Defense-Down':                 [{ stat: 'Max-Shield',    operation: 'multiply', value: -0.05 }, { stat: 'Armor-Rating', operation: 'multiply', value: -0.03 }],
    'Speed-Down':                   [{ stat: 'Max-Speed',     operation: 'multiply', value: -0.05 }],
    'Accuracy-Down':                [{ stat: 'Accuracy',      operation: 'multiply', value: -0.05 }],
    'Evasion-Down':                 [{ stat: 'Breach-Resistance', operation: 'multiply', value: -0.04 }],
    'Shield-Down':                  [{ stat: 'Max-Shield',    operation: 'multiply', value: -0.06 }],
    'Armor-Down':                   [{ stat: 'Armor-Rating',  operation: 'multiply', value: -0.05 }],
    'Power-Down':                   [{ stat: 'Power-Output',  operation: 'multiply', value: -0.04 }],
    'Range-Down':                   [{ stat: 'Range',         operation: 'multiply', value: -0.04 }],
  },

  // ── Disruption Debuffs ─────────────────────────────────────────────────────
  Disruption: {
    'Weapon-Jam':                   [{ stat: 'Fire-Rate',     operation: 'multiply', value: -0.06 }],
    'Shield-Interference':          [{ stat: 'Shield-Regen',  operation: 'multiply', value: -0.06 }],
    'Engine-Stutter':               [{ stat: 'Max-Speed',     operation: 'multiply', value: -0.05 }, { stat: 'Acceleration', operation: 'multiply', value: -0.05 }],
    'Sensor-Blind':                 [{ stat: 'Sensor-Range',  operation: 'multiply', value: -0.07 }, { stat: 'Accuracy', operation: 'multiply', value: -0.04 }],
    'Comm-Break':                   [{ stat: 'Data-Bandwidth',operation: 'multiply', value: -0.06 }],
    'Targeting-Fail':               [{ stat: 'Target-Lock-Speed', operation: 'multiply', value: -0.06 }],
    'Power-Fluctuation':            [{ stat: 'Power-Stability', operation: 'multiply', value: -0.05 }],
    'System-Freeze':                [{ stat: 'Crew-Efficiency', operation: 'multiply', value: -0.05 }],
    'Network-Disconnect':           [{ stat: 'Data-Processing', operation: 'multiply', value: -0.06 }],
  },

  // ── Impairment Debuffs (Crowd Control) ─────────────────────────────────────
  Impairment: {
    'Slow':                         [{ stat: 'Max-Speed',     operation: 'multiply', value: -0.1 }, { stat: 'Turn-Rate', operation: 'multiply', value: -0.05 }],
    'Stun':                         [{ stat: 'All-Stats',     operation: 'multiply', value: -0.15 }],
    'Root':                         [{ stat: 'Max-Speed',     operation: 'multiply', value: -0.5 }, { stat: 'Turn-Rate', operation: 'multiply', value: -0.5 }],
    'Silence':                      [{ stat: 'Data-Bandwidth',operation: 'multiply', value: -0.3 }],
    'Blind':                        [{ stat: 'Accuracy',      operation: 'multiply', value: -0.2 }, { stat: 'Sensor-Range', operation: 'multiply', value: -0.3 }],
    'Disarm':                       [{ stat: 'Fire-Rate',     operation: 'multiply', value: -0.5 }],
    'Confuse':                      [{ stat: 'Accuracy',      operation: 'multiply', value: -0.15 }, { stat: 'Turn-Rate', operation: 'multiply', value: 0.1 }],
    'Taunt':                        [{ stat: 'Critical-Chance', operation: 'add', value: -0.05 }],
    'Fear':                         [{ stat: 'Crew-Efficiency', operation: 'multiply', value: -0.1 }],
  },

  // ── Overload Debuffs ───────────────────────────────────────────────────────
  Overload: {
    'Heat-Build-Up':                [{ stat: 'Heat-Dissipation', operation: 'multiply', value: -0.06 }],
    'Power-Spike':                  [{ stat: 'Power-Stability', operation: 'multiply', value: -0.06 }],
    'Shield-Collapse':              [{ stat: 'Max-Shield',    operation: 'multiply', value: -0.1 }],
    'Weapon-Overheat':              [{ stat: 'Fire-Rate',     operation: 'multiply', value: -0.08 }],
    'Engine-Stall':                 [{ stat: 'Max-Speed',     operation: 'multiply', value: -0.12 }],
    'Reactor-Meltdown-Threat':      [{ stat: 'Power-Output',  operation: 'multiply', value: -0.08 }, { stat: 'Overload-Capacity', operation: 'multiply', value: -0.06 }],
    'System-Burnout':               [{ stat: 'Data-Processing', operation: 'multiply', value: -0.08 }],
    'Fuse-Blow':                    [{ stat: 'Power-Storage', operation: 'multiply', value: -0.06 }],
    'Circuit-Fry':                  [{ stat: 'Target-Lock-Speed', operation: 'multiply', value: -0.08 }],
  },

  // ── Drain Debuffs ──────────────────────────────────────────────────────────
  Drain: {
    'Energy-Drain':                 [{ stat: 'Power-Output',  operation: 'multiply', value: -0.07 }],
    'Shield-Drain':                 [{ stat: 'Max-Shield',    operation: 'multiply', value: -0.07 }, { stat: 'Shield-Regen', operation: 'multiply', value: -0.07 }],
    'Fuel-Drain':                   [{ stat: 'Deuterium-Saving', operation: 'multiply', value: -0.08 }],
    'Ammo-Drain':                   [{ stat: 'Ammo-Capacity', operation: 'multiply', value: -0.06 }],
    'Crew-Exhaustion':              [{ stat: 'Crew-Efficiency', operation: 'multiply', value: -0.06 }],
    'Oxygen-Drain':                 [{ stat: 'Crew-Survival', operation: 'multiply', value: -0.05 }],
    'Coolant-Drain':                [{ stat: 'Heat-Dissipation', operation: 'multiply', value: -0.06 }],
    'Nanite-Drain':                 [{ stat: 'Self-Repair',   operation: 'add',      value: -0.04 }],
    'Power-Drain':                  [{ stat: 'Power-Output',  operation: 'multiply', value: -0.05 }, { stat: 'Power-Storage', operation: 'multiply', value: -0.05 }],
  },

  // ── Breach Debuffs ─────────────────────────────────────────────────────────
  Breach: {
    'Hull-Breach':                  [{ stat: 'Breach-Resistance', operation: 'multiply', value: -0.08 }],
    'Shield-Breach':                [{ stat: 'Shield-Matrix-Stability', operation: 'multiply', value: -0.08 }],
    'Armor-Breach':                 [{ stat: 'Armor-Hardness', operation: 'multiply', value: -0.06 }],
    'Window-Breach':                [{ stat: 'Crew-Survival', operation: 'multiply', value: -0.1 }],
    'Containment-Breach':           [{ stat: 'Structural-Redundancy', operation: 'multiply', value: -0.06 }],
    'Reactor-Breach':               [{ stat: 'Power-Stability', operation: 'multiply', value: -0.12 }],
    'Data-Breach':                  [{ stat: 'Data-Bandwidth', operation: 'multiply', value: -0.06 }, { stat: 'Encryption', operation: 'multiply', value: -0.08 }],
    'Bio-Breach':                   [{ stat: 'Medical-Capacity', operation: 'multiply', value: -0.08 }],
    'Dimensional-Breach':           [{ stat: 'All-Stats',     operation: 'multiply', value: -0.05 }],
  },

  // ── Control Debuffs ────────────────────────────────────────────────────────
  Control: {
    'Hijack-Attempt':               [{ stat: 'Data-Processing', operation: 'multiply', value: -0.06 }],
    'AI-Corruption':                [{ stat: 'Target-Lock-Speed', operation: 'multiply', value: -0.07 }, { stat: 'Accuracy', operation: 'multiply', value: -0.05 }],
    'Crew-Mutiny':                  [{ stat: 'Crew-Efficiency', operation: 'multiply', value: -0.12 }],
    'Navigation-Hijack':            [{ stat: 'Max-Speed',     operation: 'multiply', value: -0.08 }, { stat: 'Turn-Rate', operation: 'multiply', value: 0.1 }],
    'Weapon-Redirect':              [{ stat: 'Weapon-Damage', operation: 'multiply', value: -0.06 }],
    'Sensor-Misdirect':             [{ stat: 'Accuracy',      operation: 'multiply', value: -0.08 }],
    'System-Lockout':               [{ stat: 'Power-Output',  operation: 'multiply', value: -0.06 }],
    'Access-Denied':                [{ stat: 'Data-Bandwidth',operation: 'multiply', value: -0.05 }],
    'Override-Fail':                [{ stat: 'Crew-Efficiency', operation: 'multiply', value: -0.04 }],
  },

  // ── Exposure Debuffs ───────────────────────────────────────────────────────
  Exposure: {
    'Radiation-Leak':               [{ stat: 'Crew-Survival', operation: 'multiply', value: -0.06 }],
    'Toxin-Spread':                 [{ stat: 'Crew-Efficiency', operation: 'multiply', value: -0.06 }],
    'Fire-Outbreak':                [{ stat: 'Max-Hull',      operation: 'add',      value: -0.03 }],
    'Vacuum-Exposure':              [{ stat: 'Crew-Survival', operation: 'multiply', value: -0.08 }],
    'Cosmic-Ray':                   [{ stat: 'Damage-Stabilization', operation: 'multiply', value: -0.04 }],
    'Plasma-Vent':                  [{ stat: 'Heat-Dissipation', operation: 'multiply', value: -0.06 }],
    'Gas-Leak':                     [{ stat: 'Crew-Survival', operation: 'multiply', value: -0.04 }],
    'Bio-Contamination':            [{ stat: 'Medical-Capacity', operation: 'multiply', value: -0.06 }],
    'Nanite-Corruption':            [{ stat: 'Self-Repair',   operation: 'add',      value: -0.05 }],
  },

  // ── Systemic Debuffs ───────────────────────────────────────────────────────
  Systemic: {
    'Structural-Fatigue':           [{ stat: 'Max-Hull',      operation: 'multiply', value: -0.04 }],
    'System-Aging':                 [{ stat: 'All-Stats',     operation: 'multiply', value: -0.02 }],
    'Software-Corruption':          [{ stat: 'Data-Processing', operation: 'multiply', value: -0.06 }],
    'Calibration-Drift':            [{ stat: 'Accuracy',      operation: 'multiply', value: -0.05 }],
    'Synchronization-Error':        [{ stat: 'Fire-Rate',     operation: 'multiply', value: -0.04 }],
    'Memory-Leak':                  [{ stat: 'Data-Bandwidth',operation: 'multiply', value: -0.05 }],
    'Resource-Fragmentation':       [{ stat: 'Production-Efficiency', operation: 'multiply', value: -0.04 }],
    'Efficiency-Loss':              [{ stat: 'Power-Efficiency', operation: 'multiply', value: -0.04 }],
    'Entropy-Increase':             [{ stat: 'All-Stats',     operation: 'multiply', value: -0.03 }],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// BUILDER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/** Create a BuffInstance from a buff type, sub-buff, and source */
export function createBuff(
  buffType: BuffType,
  subBuff: string,
  source: string,
  duration: number = 0,
  stackable: boolean = false,
  maxStacks: number = 1,
  stacks: number = 1,
  target: 'self' | 'fleet' | 'allied' | 'enemy' = 'self',
): BuffInstance | null {
  const templates = BUFF_TEMPLATES[buffType];
  if (!templates) return null;
  const modifiers = templates[subBuff];
  if (!modifiers) return null;

  return {
    id: `${source}-${buffType}-${subBuff}-${Date.now()}`,
    name: subBuff,
    buffType,
    subBuff,
    source,
    modifiers: modifiers.map(m => ({ ...m })),
    duration,
    maxDuration: duration,
    stackable,
    currentStacks: stacks,
    maxStacks,
    target,
    icon: getBuffIcon(buffType, subBuff),
  };
}

/** Create a DebuffInstance from a debuff type, sub-debuff, and source */
export function createDebuff(
  debuffType: DebuffType,
  subDebuff: string,
  source: string,
  duration: number = 10,
  stackable: boolean = false,
  maxStacks: number = 1,
  stacks: number = 1,
  target: 'self' | 'fleet' | 'allied' | 'enemy' = 'enemy',
): DebuffInstance | null {
  const templates = DEBUFF_TEMPLATES[debuffType];
  if (!templates) return null;
  const modifiers = templates[subDebuff];
  if (!modifiers) return null;

  return {
    id: `${source}-${debuffType}-${subDebuff}-${Date.now()}`,
    name: subDebuff,
    debuffType,
    subDebuff,
    source,
    modifiers: modifiers.map(m => ({ ...m })),
    duration,
    maxDuration: duration,
    stackable,
    currentStacks: stacks,
    maxStacks,
    target,
    icon: getDebuffIcon(debuffType, subDebuff),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — resolve a net stat value after all buffs/debuffs
// ─────────────────────────────────────────────────────────────────────────────

/** Stat aggregation result */
export interface AggregatedStats {
  additive:   number;
  multiplier: number;
  override:   number | null;
}

/** Aggregate all buff/debuff modifiers for a given stat */
export function aggregateModifiers(
  statName: string,
  instances: Array<BuffInstance | DebuffInstance>,
): AggregatedStats {
  let additive = 0;
  let multiplier = 1;
  let override: number | null = null;

  for (const inst of instances) {
    for (const mod of inst.modifiers) {
      if (mod.stat !== statName && mod.stat !== 'All-Stats') continue;

      const effectiveValue = mod.value * inst.currentStacks;

      switch (mod.operation) {
        case 'add':
          additive += effectiveValue;
          break;
        case 'multiply':
          multiplier *= (1 + effectiveValue);
          break;
        case 'override':
          override = effectiveValue;
          break;
      }
    }
  }

  return { additive, multiplier, override };
}

/** Apply buff/debuff modifiers to a base stat value */
export function applyModifiers(
  baseValue: number,
  instances: Array<BuffInstance | DebuffInstance>,
  statName: string,
): number {
  const { additive, multiplier, override } = aggregateModifiers(statName, instances);
  if (override !== null) return override;
  return (baseValue + additive) * multiplier;
}

// ─────────────────────────────────────────────────────────────────────────────
// ICON MAPS
// ─────────────────────────────────────────────────────────────────────────────

const BUFF_ICONS: Record<string, string> = {
  'Damage-Up': 'ri-sword-line',
  'Fire-Rate-Up': 'ri-speed-line',
  'Crit-Chance-Up': 'ri-crosshair-2-line',
  'Hull-Up': 'ri-shield-fill',
  'Shield-Up': 'ri-shield-star-line',
  'Speed-Up': 'ri-rocket-line',
  'Hull-Regen-Up': 'ri-heart-pulse-line',
  'Repair-Speed-Up': 'ri-tools-line',
  'Cloak-Strength': 'ri-moon-clear-line',
  'Signature-Reduction': 'ri-eye-off-line',
};

function getBuffIcon(buffType: string, subBuff: string): string {
  return BUFF_ICONS[subBuff] ?? 'ri-add-circle-line';
}

const DEBUFF_ICONS: Record<string, string> = {
  'Attack-Down': 'ri-arrow-down-circle-line',
  'Defense-Down': 'ri-shield-cross-line',
  'Speed-Down': 'ri-arrow-down-line',
  'Slow': 'ri-snowflake-line',
  'Stun': 'ri-flashlight-line',
  'Hull-Breach': 'ri-door-open-line',
  'Energy-Drain': 'ri-battery-low-line',
  'Weapon-Jam': 'ri-forbid-line',
  'Sensor-Blind': 'ri-eye-close-line',
};

function getDebuffIcon(debuffType: string, subDebuff: string): string {
  return DEBUFF_ICONS[subDebuff] ?? 'ri-close-circle-line';
}
