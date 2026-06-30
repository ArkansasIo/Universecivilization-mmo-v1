// ═══════════════════════════════════════════════════════════════════════════
// STARSHIP TECHNOLOGIES — Full Definitions
// 50+ technologies organized by TechClass with effects, costs, prerequisites
// ═══════════════════════════════════════════════════════════════════════════

import { TechClass, TechCategory, TechType, TECH_SUB_CLASSES, TECH_SUB_CATEGORIES, TECH_SUB_TYPES, TECH_SUB_STATS, BUFF_SUB_TYPES, DEBUFF_SUB_TYPES } from '../config/starshipTechTree';

// ─────────────────────────────────────────────────────────────────────────────
// Tech Effect — modifies a specific substat on a ship
// ─────────────────────────────────────────────────────────────────────────────
export interface StarshipTechEffect {
  stat:        string;   // Which substat this affects (from TECH_SUB_STATS)
  target:      string;   // 'self', 'fleet', 'allied', 'enemy', or specific ship class
  valuePerLevel: number; // additive or multiplicative per level
  unit:        string;   // '%', 'flat', 'seconds', etc.
  operation:   'add' | 'multiply' | 'override';
}

// ─────────────────────────────────────────────────────────────────────────────
// Cost structure
// ─────────────────────────────────────────────────────────────────────────────
export interface StarshipTechCost {
  metal?:      number;
  crystal?:    number;
  deuterium?:  number;
  antimatter?: number;
  darkMatter?: number;
  credits?:    number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Buff / Debuff applications from tech
// ─────────────────────────────────────────────────────────────────────────────
export interface TechBuffApplication {
  buffType:      string;  // key from BUFF_SUB_TYPES
  subBuff:       string;  // specific sub-buff
  strength:      number;  // per-level strength
  duration:      number;  // seconds
  target:        string;  // 'self' | 'fleet' | 'allied' | 'enemy'
  stackable?:    boolean;
  maxStacks?:    number;
}

export interface TechDebuffApplication {
  debuffType:    string;  // key from DEBUFF_SUB_TYPES
  subDebuff:     string;
  strength:      number;
  duration:      number;
  target:        string;
  stackable?:    boolean;
  maxStacks?:    number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Full Technology Definition
// ─────────────────────────────────────────────────────────────────────────────
export interface StarshipTechDef {
  id:              string;
  name:            string;
  techClass:       TechClass;
  subClass:        string;
  category:        TechCategory;
  subCategory:     string;
  techType:        TechType;
  subType:         string;
  tier:            number;
  maxLevel:        number;
  description:     string;
  effects:         StarshipTechEffect[];
  buffs?:          TechBuffApplication[];
  debuffs?:        TechDebuffApplication[];
  baseCost:        StarshipTechCost;
  costFactor:      number;
  baseTime:        number;  // seconds
  timeFactor:      number;
  prerequisites?:  { tech?: Record<string, number>; shipClass?: string[]; tier?: number };
  unlocks?:        string[];
  mutuallyExclusive?: string[];  // tech IDs this conflicts with
  shipClassBonus?: Record<string, number>;  // ship class → multiplier
  icon:            string;
  color?:          string;
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL TECHNOLOGY DATABASE
// ─────────────────────────────────────────────────────────────────────────────

export const STARSHIP_TECHNOLOGIES: Record<string, StarshipTechDef> = {

  // ═══════════════════════════════════════════════════════════════════════════
  // HULL SYSTEMS TECHNOLOGIES
  // ═══════════════════════════════════════════════════════════════════════════

  light_hull_composite: {
    id: 'light_hull_composite', name: 'Light Composite Hull',
    techClass: 'Hull Systems', subClass: 'Composite-Hull',
    category: 'Defensive', subCategory: 'Hull-Reinforcement',
    techType: 'Passive', subType: 'Stat-Boost',
    tier: 1, maxLevel: 20,
    description: 'Reinforces light ship hulls with composite materials for increased durability.',
    effects: [
      { stat: 'Max-Hull', target: 'Fighter', valuePerLevel: 0.08, unit: '%', operation: 'multiply' },
      { stat: 'Collision-Resistance', target: 'Fighter', valuePerLevel: 0.03, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 500, crystal: 200 }, costFactor: 1.6,
    baseTime: 120, timeFactor: 1.5,
    prerequisites: { tier: 1 },
    shipClassBonus: { Fighter: 1.2, Interceptor: 1.1 },
    icon: 'ri-shield-fill', color: '#60A5FA',
  },

  regenerative_hull: {
    id: 'regenerative_hull', name: 'Regenerative Hull Plating',
    techClass: 'Hull Systems', subClass: 'Regenerative-Hull',
    category: 'Defensive', subCategory: 'Repair-Systems',
    techType: 'Passive', subType: 'Regeneration',
    tier: 3, maxLevel: 15,
    description: 'Nanite-infused hull that slowly regenerates damage during combat.',
    effects: [
      { stat: 'Self-Repair', target: 'self', valuePerLevel: 0.04, unit: '%', operation: 'add' },
      { stat: 'Hull-Integrity', target: 'self', valuePerLevel: 0.03, unit: '%', operation: 'multiply' },
    ],
    buffs: [{ buffType: 'Recovery', subBuff: 'Hull-Regen-Up', strength: 0.04, duration: 0, target: 'self', stackable: true, maxStacks: 5 }],
    baseCost: { metal: 5000, crystal: 3000, deuterium: 1000 }, costFactor: 1.8,
    baseTime: 600, timeFactor: 1.7,
    prerequisites: { tech: { light_hull_composite: 8 }, tier: 3 },
    unlocks: ['nanite_hull_matrix'],
    icon: 'ri-heart-pulse-line', color: '#34D399',
  },

  heavy_capital_frame: {
    id: 'heavy_capital_frame', name: 'Capital-Grade Superframe',
    techClass: 'Hull Systems', subClass: 'Capital-Frame',
    category: 'Defensive', subCategory: 'Hull-Reinforcement',
    techType: 'Passive', subType: 'Stat-Boost',
    tier: 4, maxLevel: 25,
    description: 'Massive structural frame for capital ships, providing exceptional durability.',
    effects: [
      { stat: 'Max-Hull', target: 'self', valuePerLevel: 0.1, unit: '%', operation: 'multiply' },
      { stat: 'Structural-Redundancy', target: 'self', valuePerLevel: 0.05, unit: '%', operation: 'multiply' },
      { stat: 'Breach-Resistance', target: 'self', valuePerLevel: 0.04, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 25000, crystal: 10000, deuterium: 5000 }, costFactor: 2.0,
    baseTime: 3600, timeFactor: 1.8,
    prerequisites: { tier: 4, shipClass: ['Battleship', 'Dreadnought', 'Titan', 'Carrier'] },
    shipClassBonus: { Dreadnought: 1.3, Titan: 1.4, Battleship: 1.2 },
    icon: 'ri-building-line', color: '#F59E0B',
  },

  modular_hull_system: {
    id: 'modular_hull_system', name: 'Modular Hull Framework',
    techClass: 'Hull Systems', subClass: 'Modular-Hull',
    category: 'Utility', subCategory: 'Manufacturing-Efficiency',
    techType: 'Toggle', subType: 'Economy-Mode',
    tier: 2, maxLevel: 15,
    description: 'Swap hull configurations for different mission profiles.',
    effects: [
      { stat: 'Self-Repair', target: 'self', valuePerLevel: 0.02, unit: '%', operation: 'add' },
      { stat: 'Damage-Stabilization', target: 'self', valuePerLevel: 0.02, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 2000, crystal: 1500, deuterium: 500 }, costFactor: 1.7,
    baseTime: 300, timeFactor: 1.6,
    prerequisites: { tier: 2 },
    icon: 'ri-grid-line', color: '#8B5CF6',
  },

  stealth_hull_coating: {
    id: 'stealth_hull_coating', name: 'Stealth Hull Coating',
    techClass: 'Hull Systems', subClass: 'Stealth-Hull',
    category: 'Stealth', subCategory: 'Signature-Reduction',
    techType: 'Passive', subType: 'Stat-Boost',
    tier: 3, maxLevel: 15,
    description: 'Radar-absorbent hull coating that reduces ship signature.',
    effects: [
      { stat: 'Self-Repair', target: 'self', valuePerLevel: 0.01, unit: '%', operation: 'add' },
    ],
    buffs: [{ buffType: 'Stealth', subBuff: 'Signature-Reduction', strength: 0.06, duration: 0, target: 'self', stackable: true, maxStacks: 10 }],
    baseCost: { metal: 4000, crystal: 6000, deuterium: 2000 }, costFactor: 1.9,
    baseTime: 900, timeFactor: 1.8,
    prerequisites: { tech: { light_hull_composite: 5 }, tier: 3, shipClass: ['Frigate', 'Destroyer', 'Cruiser'] },
    unlocks: ['phase_shift_armor'],
    icon: 'ri-eye-off-line', color: '#6B7280',
  },

  nanite_hull_matrix: {
    id: 'nanite_hull_matrix', name: 'Nanite Hull Matrix',
    techClass: 'Hull Systems', subClass: 'Regenerative-Hull',
    category: 'Defensive', subCategory: 'Repair-Systems',
    techType: 'Passive', subType: 'Regeneration',
    tier: 5, maxLevel: 10,
    description: 'Advanced nanite swarm that repairs hull damage in real-time.',
    effects: [
      { stat: 'Self-Repair', target: 'self', valuePerLevel: 0.08, unit: '%', operation: 'add' },
      { stat: 'Hull-Regen', target: 'self', valuePerLevel: 0.06, unit: '%', operation: 'multiply' },
    ],
    buffs: [
      { buffType: 'Recovery', subBuff: 'Hull-Regen-Up', strength: 0.08, duration: 0, target: 'self', stackable: true, maxStacks: 3 },
      { buffType: 'Recovery', subBuff: 'Nanite-Repair', strength: 0.05, duration: 0, target: 'self' },
    ],
    baseCost: { metal: 50000, crystal: 30000, deuterium: 15000 }, costFactor: 2.5,
    baseTime: 14400, timeFactor: 2.0,
    prerequisites: { tech: { regenerative_hull: 10 }, tier: 5 },
    icon: 'ri-bubble-chart-line', color: '#10B981',
  },

  reinforced_internal_bulkheads: {
    id: 'reinforced_internal_bulkheads', name: 'Reinforced Bulkheads',
    techClass: 'Hull Systems', subClass: 'Reinforced-Hull',
    category: 'Defensive', subCategory: 'Damage-Reduction',
    techType: 'Passive', subType: 'Threshold',
    tier: 2, maxLevel: 20,
    description: 'Internal bulkheads prevent chain reactions from hits.',
    effects: [
      { stat: 'Internal-Compartmentalization', target: 'self', valuePerLevel: 0.05, unit: '%', operation: 'multiply' },
      { stat: 'Breach-Resistance', target: 'self', valuePerLevel: 0.04, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 1500, crystal: 500 }, costFactor: 1.6,
    baseTime: 180, timeFactor: 1.5,
    prerequisites: { tier: 2 },
    icon: 'ri-door-lock-line', color: '#EF4444',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SHIELD SYSTEMS TECHNOLOGIES
  // ═══════════════════════════════════════════════════════════════════════════

  deflector_shield_matrix: {
    id: 'deflector_shield_matrix', name: 'Deflector Shield Matrix',
    techClass: 'Shield Systems', subClass: 'Deflector-Shields',
    category: 'Defensive', subCategory: 'Shield-Amplification',
    techType: 'Passive', subType: 'Stat-Boost',
    tier: 1, maxLevel: 25,
    description: 'Standard deflector shields that absorb energy damage.',
    effects: [
      { stat: 'Max-Shield', target: 'self', valuePerLevel: 0.08, unit: '%', operation: 'multiply' },
      { stat: 'Shield-Regen', target: 'self', valuePerLevel: 0.03, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 300, crystal: 800 }, costFactor: 1.6,
    baseTime: 90, timeFactor: 1.5,
    prerequisites: { tier: 1 },
    icon: 'ri-shield-line', color: '#3B82F6',
  },

  phase_shift_shields: {
    id: 'phase_shift_shields', name: 'Phase-Shift Shields',
    techClass: 'Shield Systems', subClass: 'Phase-Shields',
    category: 'Defensive', subCategory: 'Adaptive-Defenses',
    techType: 'Triggered', subType: 'On-Damage',
    tier: 3, maxLevel: 15,
    description: 'Shields that phase-shift to match incoming damage type.',
    effects: [
      { stat: 'Adaptive-Resonance', target: 'self', valuePerLevel: 0.05, unit: '%', operation: 'multiply' },
      { stat: 'Shield-Hardness', target: 'self', valuePerLevel: 0.04, unit: '%', operation: 'multiply' },
    ],
    buffs: [{ buffType: 'Defensive', subBuff: 'Absorption-Up', strength: 0.05, duration: 10, target: 'self', stackable: true, maxStacks: 3 }],
    baseCost: { metal: 6000, crystal: 12000, deuterium: 3000 }, costFactor: 2.0,
    baseTime: 1200, timeFactor: 1.8,
    prerequisites: { tech: { deflector_shield_matrix: 8 }, tier: 3 },
    unlocks: ['quantum_barrier_matrix'],
    icon: 'ri-shield-keyhole-line', color: '#818CF8',
  },

  void_shield_generator: {
    id: 'void_shield_generator', name: 'Void Shield Generator',
    techClass: 'Shield Systems', subClass: 'Void-Shields',
    category: 'Defensive', subCategory: 'Shield-Amplification',
    techType: 'Active', subType: 'Shield',
    tier: 4, maxLevel: 12,
    description: 'Shields that shunt damage into pocket dimensions.',
    effects: [
      { stat: 'Shield-Absorption', target: 'self', valuePerLevel: 0.08, unit: '%', operation: 'multiply' },
      { stat: 'Max-Shield', target: 'self', valuePerLevel: 0.1, unit: '%', operation: 'multiply' },
    ],
    buffs: [{ buffType: 'Defensive', subBuff: 'Shield-Up', strength: 0.1, duration: 30, target: 'self' }],
    baseCost: { metal: 20000, crystal: 40000, deuterium: 15000, antimatter: 500 }, costFactor: 2.2,
    baseTime: 7200, timeFactor: 2.0,
    prerequisites: { tech: { phase_shift_shields: 8, heavy_capital_frame: 5 }, tier: 4 },
    unlocks: ['temporal_shield_array'],
    icon: 'ri-shield-star-line', color: '#7C3AED',
  },

  temporal_shield_array: {
    id: 'temporal_shield_array', name: 'Temporal Shield Array',
    techClass: 'Shield Systems', subClass: 'Temporal-Shields',
    category: 'Defensive', subCategory: 'Adaptive-Defenses',
    techType: 'Triggered', subType: 'On-Damage',
    tier: 6, maxLevel: 8,
    description: 'Shields that briefly revert damage by rewinding local time.',
    effects: [
      { stat: 'Shield-Absorption', target: 'self', valuePerLevel: 0.12, unit: '%', operation: 'multiply' },
      { stat: 'Shield-Matrix-Stability', target: 'self', valuePerLevel: 0.06, unit: '%', operation: 'multiply' },
    ],
    buffs: [
      { buffType: 'Special', subBuff: 'Temporal-Phase', strength: 0.1, duration: 5, target: 'self' },
      { buffType: 'Defensive', subBuff: 'Damage-Reduction', strength: 0.08, duration: 5, target: 'self' },
    ],
    baseCost: { metal: 100000, crystal: 150000, deuterium: 75000, antimatter: 10000 }, costFactor: 3.0,
    baseTime: 86400, timeFactor: 2.5,
    prerequisites: { tech: { void_shield_generator: 8, nanite_hull_matrix: 5 }, tier: 6 },
    icon: 'ri-shield-flash-line', color: '#C084FC',
  },

  adaptive_resonance_shields: {
    id: 'adaptive_resonance_shields', name: 'Adaptive Resonance Shielding',
    techClass: 'Shield Systems', subClass: 'Adaptive-Shields',
    category: 'Defensive', subCategory: 'Adaptive-Defenses',
    techType: 'Toggle', subType: 'Shield-Mode',
    tier: 3, maxLevel: 15,
    description: 'Shields that adapt frequency to counter enemy weapons.',
    effects: [
      { stat: 'Adaptive-Resonance', target: 'self', valuePerLevel: 0.06, unit: '%', operation: 'multiply' },
      { stat: 'Shield-Penetration-Resist', target: 'self', valuePerLevel: 0.05, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 4000, crystal: 8000, deuterium: 2000 }, costFactor: 1.9,
    baseTime: 900, timeFactor: 1.7,
    prerequisites: { tech: { deflector_shield_matrix: 6 }, tier: 3 },
    icon: 'ri-shield-check-line', color: '#6366F1',
  },

  gravitic_shield_projector: {
    id: 'gravitic_shield_projector', name: 'Gravitic Shield Projector',
    techClass: 'Shield Systems', subClass: 'Gravitic-Shields',
    category: 'Defensive', subCategory: 'Shield-Amplification',
    techType: 'Aura', subType: 'Defense-Aura',
    tier: 4, maxLevel: 10,
    description: 'Gravity-based shield that protects nearby allied ships.',
    effects: [
      { stat: 'Max-Shield', target: 'self', valuePerLevel: 0.06, unit: '%', operation: 'multiply' },
    ],
    buffs: [{ buffType: 'Defensive', subBuff: 'Shield-Up', strength: 0.04, duration: 0, target: 'fleet', stackable: true, maxStacks: 5 }],
    baseCost: { metal: 15000, crystal: 25000, deuterium: 8000 }, costFactor: 2.1,
    baseTime: 5400, timeFactor: 1.9,
    prerequisites: { tech: { phase_shift_shields: 5, heavy_capital_frame: 3 }, tier: 4, shipClass: ['Cruiser', 'Battleship', 'Carrier'] },
    icon: 'ri-earth-line', color: '#A78BFA',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WEAPON SYSTEMS TECHNOLOGIES
  // ═══════════════════════════════════════════════════════════════════════════

  laser_weapon_calibration: {
    id: 'laser_weapon_calibration', name: 'Laser Weapon Calibration',
    techClass: 'Weapon Systems', subClass: 'Laser-Weapons',
    category: 'Offensive', subCategory: 'Direct-Damage',
    techType: 'Passive', subType: 'Stat-Boost',
    tier: 1, maxLevel: 25,
    description: 'Precision calibration improves laser weapon damage and accuracy.',
    effects: [
      { stat: 'Weapon-Damage', target: 'self', valuePerLevel: 0.06, unit: '%', operation: 'multiply' },
      { stat: 'Accuracy', target: 'self', valuePerLevel: 0.02, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 400, crystal: 200 }, costFactor: 1.5,
    baseTime: 60, timeFactor: 1.5,
    prerequisites: { tier: 1 },
    icon: 'ri-flashlight-line', color: '#EF4444',
  },

  plasma_cannon_infusion: {
    id: 'plasma_cannon_infusion', name: 'Plasma Cannon Infusion',
    techClass: 'Weapon Systems', subClass: 'Plasma-Weapons',
    category: 'Offensive', subCategory: 'Armor-Piercing',
    techType: 'Passive', subType: 'Stat-Boost',
    tier: 3, maxLevel: 20,
    description: 'High-energy plasma that burns through armor.',
    effects: [
      { stat: 'Weapon-Damage', target: 'self', valuePerLevel: 0.08, unit: '%', operation: 'multiply' },
      { stat: 'Armor-Piercing', target: 'self', valuePerLevel: 0.05, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 5000, crystal: 8000, deuterium: 2000 }, costFactor: 1.8,
    baseTime: 600, timeFactor: 1.7,
    prerequisites: { tech: { laser_weapon_calibration: 10 }, tier: 3 },
    unlocks: ['gravitic_lance'],
    icon: 'ri-fire-line', color: '#F97316',
  },

  ion_cannon_disruptor: {
    id: 'ion_cannon_disruptor', name: 'Ion Cannon Disruptor',
    techClass: 'Weapon Systems', subClass: 'Ion-Weapons',
    category: 'Offensive', subCategory: 'Shield-Penetration',
    techType: 'Active', subType: 'Debuff-Enemies',
    tier: 2, maxLevel: 15,
    description: 'Ion weapons that disrupt enemy shields and systems.',
    effects: [
      { stat: 'Shield-Penetration', target: 'self', valuePerLevel: 0.06, unit: '%', operation: 'multiply' },
      { stat: 'Weapon-Damage', target: 'self', valuePerLevel: 0.04, unit: '%', operation: 'multiply' },
    ],
    debuffs: [{ debuffType: 'Disruption', subDebuff: 'Shield-Interference', strength: 0.05, duration: 8, target: 'enemy', stackable: true, maxStacks: 5 }],
    baseCost: { metal: 2000, crystal: 4000, deuterium: 1000 }, costFactor: 1.7,
    baseTime: 300, timeFactor: 1.6,
    prerequisites: { tech: { laser_weapon_calibration: 5 }, tier: 2 },
    icon: 'ri-bolt-line', color: '#818CF8',
  },

  kinetic_battery_assault: {
    id: 'kinetic_battery_assault', name: 'Kinetic Battery Assault',
    techClass: 'Weapon Systems', subClass: 'Kinetic-Weapons',
    category: 'Offensive', subCategory: 'Direct-Damage',
    techType: 'Passive', subType: 'Stat-Boost',
    tier: 2, maxLevel: 20,
    description: 'High-velocity kinetic rounds for devastating hull damage.',
    effects: [
      { stat: 'Weapon-Damage', target: 'self', valuePerLevel: 0.07, unit: '%', operation: 'multiply' },
      { stat: 'Critical-Chance', target: 'self', valuePerLevel: 0.02, unit: '%', operation: 'add' },
      { stat: 'Fire-Rate', target: 'self', valuePerLevel: 0.03, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 3000, crystal: 1000, deuterium: 500 }, costFactor: 1.7,
    baseTime: 240, timeFactor: 1.6,
    prerequisites: { tier: 2 },
    unlocks: ['missile_swarm_launcher'],
    icon: 'ri-crosshair-line', color: '#FCD34D',
  },

  missile_swarm_launcher: {
    id: 'missile_swarm_launcher', name: 'Missile Swarm Launcher',
    techClass: 'Weapon Systems', subClass: 'Missile-Weapons',
    category: 'Offensive', subCategory: 'Area-Effect',
    techType: 'Active', subType: 'AoE',
    tier: 3, maxLevel: 15,
    description: 'Launches swarms of missiles that overwhelm point defense.',
    effects: [
      { stat: 'Weapon-Damage', target: 'self', valuePerLevel: 0.06, unit: '%', operation: 'multiply' },
      { stat: 'Fire-Rate', target: 'self', valuePerLevel: 0.05, unit: '%', operation: 'multiply' },
    ],
    debuffs: [{ debuffType: 'Overload', subDebuff: 'Weapon-Overheat', strength: 0.03, duration: 5, target: 'enemy' }],
    baseCost: { metal: 6000, crystal: 4000, deuterium: 3000 }, costFactor: 1.9,
    baseTime: 900, timeFactor: 1.8,
    prerequisites: { tech: { kinetic_battery_assault: 8 }, tier: 3 },
    icon: 'ri-rocket-2-fill', color: '#FB923C',
  },

  gravitic_lance: {
    id: 'gravitic_lance', name: 'Gravitic Lance',
    techClass: 'Weapon Systems', subClass: 'Gravitic-Weapons',
    category: 'Offensive', subCategory: 'Alpha-Strike',
    techType: 'Charged', subType: 'Cannon-Shot',
    tier: 5, maxLevel: 10,
    description: 'Focused gravitational beam that tears through any defense.',
    effects: [
      { stat: 'Weapon-Damage', target: 'self', valuePerLevel: 0.15, unit: '%', operation: 'multiply' },
      { stat: 'Armor-Piercing', target: 'self', valuePerLevel: 0.08, unit: '%', operation: 'multiply' },
      { stat: 'Shield-Penetration', target: 'self', valuePerLevel: 0.08, unit: '%', operation: 'multiply' },
    ],
    debuffs: [{ debuffType: 'Breach', subDebuff: 'Hull-Breach', strength: 0.1, duration: 10, target: 'enemy' }],
    baseCost: { metal: 40000, crystal: 60000, deuterium: 30000, antimatter: 2000 }, costFactor: 2.5,
    baseTime: 21600, timeFactor: 2.0,
    prerequisites: { tech: { plasma_cannon_infusion: 10, ion_cannon_disruptor: 8 }, tier: 5 },
    unlocks: ['singularity_cannon'],
    icon: 'ri-space-ship-line', color: '#A855F7',
  },

  quantum_weapon_matrix: {
    id: 'quantum_weapon_matrix', name: 'Quantum Weapon Matrix',
    techClass: 'Weapon Systems', subClass: 'Quantum-Weapons',
    category: 'Offensive', subCategory: 'Critical-Strike',
    techType: 'Triggered', subType: 'On-Critical',
    tier: 5, maxLevel: 10,
    description: 'Quantum-entangled weapons that guarantee critical hits.',
    effects: [
      { stat: 'Critical-Chance', target: 'self', valuePerLevel: 0.04, unit: '%', operation: 'add' },
      { stat: 'Critical-Damage', target: 'self', valuePerLevel: 0.1, unit: '%', operation: 'multiply' },
    ],
    buffs: [{ buffType: 'Offensive', subBuff: 'Crit-Chance-Up', strength: 0.04, duration: 0, target: 'self' }],
    baseCost: { metal: 30000, crystal: 50000, deuterium: 20000, darkMatter: 1000 }, costFactor: 2.4,
    baseTime: 14400, timeFactor: 2.0,
    prerequisites: { tech: { laser_weapon_calibration: 15, plasma_cannon_infusion: 8 }, tier: 5 },
    icon: 'ri-atom-line', color: '#D946EF',
  },

  temporal_weapon_array: {
    id: 'temporal_weapon_array', name: 'Temporal Weapon Array',
    techClass: 'Weapon Systems', subClass: 'Temporal-Weapons',
    category: 'Offensive', subCategory: 'Damage-Over-Time',
    techType: 'Channeled', subType: 'Beam-Focus',
    tier: 6, maxLevel: 8,
    description: 'Weapons that age enemy ships rapidly, causing structural decay.',
    effects: [
      { stat: 'Weapon-Damage', target: 'self', valuePerLevel: 0.1, unit: '%', operation: 'multiply' },
    ],
    debuffs: [
      { debuffType: 'Systemic', subDebuff: 'Structural-Fatigue', strength: 0.08, duration: 15, target: 'enemy', stackable: true, maxStacks: 10 },
      { debuffType: 'Systemic', subDebuff: 'System-Aging', strength: 0.05, duration: 15, target: 'enemy', stackable: true, maxStacks: 5 },
    ],
    baseCost: { metal: 150000, crystal: 200000, deuterium: 100000, antimatter: 15000 }, costFactor: 3.0,
    baseTime: 129600, timeFactor: 2.5,
    prerequisites: { tech: { quantum_weapon_matrix: 8, temporal_shield_array: 5 }, tier: 6 },
    icon: 'ri-timer-flash-line', color: '#E879F9',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROPULSION TECHNOLOGIES
  // ═══════════════════════════════════════════════════════════════════════════

  impulse_engine_tuning: {
    id: 'impulse_engine_tuning', name: 'Impulse Engine Tuning',
    techClass: 'Propulsion', subClass: 'Impulse-Engines',
    category: 'Propulsion', subCategory: 'Sublight-Optimization',
    techType: 'Passive', subType: 'Stat-Boost',
    tier: 1, maxLevel: 25,
    description: 'Fine-tunes impulse engines for better sublight performance.',
    effects: [
      { stat: 'Max-Speed', target: 'self', valuePerLevel: 0.06, unit: '%', operation: 'multiply' },
      { stat: 'Acceleration', target: 'self', valuePerLevel: 0.04, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 400, crystal: 200, deuterium: 600 }, costFactor: 1.6,
    baseTime: 90, timeFactor: 1.5,
    prerequisites: { tier: 1 },
    icon: 'ri-rocket-2-line', color: '#10B981',
  },

  warp_drive_efficiency: {
    id: 'warp_drive_efficiency', name: 'Warp Drive Efficiency',
    techClass: 'Propulsion', subClass: 'Warp-Drives',
    category: 'Propulsion', subCategory: 'FTL-Calibration',
    techType: 'Passive', subType: 'Efficiency',
    tier: 3, maxLevel: 20,
    description: 'Improves warp drive efficiency for faster FTL travel.',
    effects: [
      { stat: 'Warp-Speed', target: 'self', valuePerLevel: 0.08, unit: '%', operation: 'multiply' },
      { stat: 'Jump-Range', target: 'self', valuePerLevel: 0.05, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 8000, crystal: 12000, deuterium: 6000 }, costFactor: 1.9,
    baseTime: 1200, timeFactor: 1.7,
    prerequisites: { tech: { impulse_engine_tuning: 10 }, tier: 3 },
    unlocks: ['dimensional_drive'],
    icon: 'ri-space-ship-line', color: '#34D399',
  },

  jump_drive_accuracy: {
    id: 'jump_drive_accuracy', name: 'Jump Drive Precision',
    techClass: 'Propulsion', subClass: 'Jump-Drives',
    category: 'Propulsion', subCategory: 'Jump-Accuracy',
    techType: 'Passive', subType: 'Efficiency',
    tier: 4, maxLevel: 15,
    description: 'Precision jump calculations for accurate fleet positioning.',
    effects: [
      { stat: 'Jump-Range', target: 'self', valuePerLevel: 0.07, unit: '%', operation: 'multiply' },
      { stat: 'Turn-Rate', target: 'self', valuePerLevel: 0.04, unit: '%', operation: 'multiply' },
    ],
    buffs: [{ buffType: 'Mobility', subBuff: 'Jump-Range-Up', strength: 0.07, duration: 0, target: 'self' }],
    baseCost: { metal: 15000, crystal: 25000, deuterium: 12000 }, costFactor: 2.0,
    baseTime: 3600, timeFactor: 1.8,
    prerequisites: { tech: { warp_drive_efficiency: 8 }, tier: 4 },
    icon: 'ri-door-open-line', color: '#6EE7B7',
  },

  dimensional_drive: {
    id: 'dimensional_drive', name: 'Dimensional Drive',
    techClass: 'Propulsion', subClass: 'Dimensional-Drives',
    category: 'Propulsion', subCategory: 'Slipstream-Navigation',
    techType: 'Active', subType: 'Teleport',
    tier: 5, maxLevel: 10,
    description: 'Travel through alternate dimensions for instant fleet movement.',
    effects: [
      { stat: 'Warp-Speed', target: 'self', valuePerLevel: 0.15, unit: '%', operation: 'multiply' },
      { stat: 'Max-Speed', target: 'self', valuePerLevel: 0.1, unit: '%', operation: 'multiply' },
    ],
    debuffs: [{ debuffType: 'Impairment', subDebuff: 'Slow', strength: -0.05, duration: 10, target: 'self' }],
    baseCost: { metal: 50000, crystal: 80000, deuterium: 40000, antimatter: 5000 }, costFactor: 2.5,
    baseTime: 43200, timeFactor: 2.0,
    prerequisites: { tech: { jump_drive_accuracy: 8, warp_drive_efficiency: 10 }, tier: 5 },
    unlocks: ['tachyon_drive'],
    icon: 'ri-vip-crown-line', color: '#A3E635',
  },

  tachyon_drive: {
    id: 'tachyon_drive', name: 'Tachyon Drive',
    techClass: 'Propulsion', subClass: 'Tachyon-Drives',
    category: 'Propulsion', subCategory: 'Emergency-Speed',
    techType: 'Charged', subType: 'Speed-Boost',
    tier: 6, maxLevel: 8,
    description: 'Tachyon-based propulsion that exceeds light speed limits.',
    effects: [
      { stat: 'Warp-Speed', target: 'self', valuePerLevel: 0.2, unit: '%', operation: 'multiply' },
      { stat: 'Emergency-Boost', target: 'self', valuePerLevel: 0.12, unit: '%', operation: 'multiply' },
    ],
    buffs: [{ buffType: 'Mobility', subBuff: 'Speed-Up', strength: 0.15, duration: 20, target: 'self' }],
    baseCost: { metal: 200000, crystal: 300000, deuterium: 150000, antimatter: 20000 }, costFactor: 3.0,
    baseTime: 172800, timeFactor: 2.5,
    prerequisites: { tech: { dimensional_drive: 8, temporal_weapon_array: 3 }, tier: 6 },
    icon: 'ri-speed-up-line', color: '#4ADE80',
  },

  formation_flight_network: {
    id: 'formation_flight_network', name: 'Formation Flight Network',
    techClass: 'Propulsion', subClass: 'Impulse-Engines',
    category: 'Logistics', subCategory: 'Formation-Control',
    techType: 'Aura', subType: 'Speed-Aura',
    tier: 3, maxLevel: 15,
    description: 'Coordinated formation flying for fleet-wide speed bonus.',
    effects: [
      { stat: 'Max-Speed', target: 'self', valuePerLevel: 0.03, unit: '%', operation: 'multiply' },
    ],
    buffs: [{ buffType: 'Mobility', subBuff: 'Formation-Bonus', strength: 0.04, duration: 0, target: 'fleet', stackable: true, maxStacks: 3 }],
    baseCost: { metal: 5000, crystal: 4000, deuterium: 3000 }, costFactor: 1.8,
    baseTime: 600, timeFactor: 1.7,
    prerequisites: { tech: { impulse_engine_tuning: 8 }, tier: 3 },
    icon: 'ri-group-line', color: '#2DD4BF',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // POWER CORE TECHNOLOGIES
  // ═══════════════════════════════════════════════════════════════════════════

  fusion_reactor_optimization: {
    id: 'fusion_reactor_optimization', name: 'Fusion Reactor Optimization',
    techClass: 'Power Core', subClass: 'Fusion-Reactors',
    category: 'Industrial', subCategory: 'Resource-Efficiency',
    techType: 'Passive', subType: 'Efficiency',
    tier: 1, maxLevel: 25,
    description: 'Improves fusion reactor output and fuel efficiency.',
    effects: [
      { stat: 'Power-Output', target: 'self', valuePerLevel: 0.06, unit: '%', operation: 'multiply' },
      { stat: 'Power-Efficiency', target: 'self', valuePerLevel: 0.04, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 600, crystal: 400, deuterium: 200 }, costFactor: 1.6,
    baseTime: 90, timeFactor: 1.5,
    prerequisites: { tier: 1 },
    icon: 'ri-sun-line', color: '#F59E0B',
  },

  antimatter_reactor_core: {
    id: 'antimatter_reactor_core', name: 'Antimatter Reactor Core',
    techClass: 'Power Core', subClass: 'Antimatter-Reactors',
    category: 'Energy', subCategory: 'Power-Generation',
    techType: 'Toggle', subType: 'Power-Mode',
    tier: 3, maxLevel: 15,
    description: 'High-output antimatter reactor for capital ships.',
    effects: [
      { stat: 'Power-Output', target: 'self', valuePerLevel: 0.1, unit: '%', operation: 'multiply' },
      { stat: 'Power-Storage', target: 'self', valuePerLevel: 0.06, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 12000, crystal: 20000, deuterium: 8000, antimatter: 1000 }, costFactor: 2.0,
    baseTime: 2400, timeFactor: 1.8,
    prerequisites: { tech: { fusion_reactor_optimization: 12 }, tier: 3 },
    unlocks: ['zero_point_reactor', 'singularity_core'],
    icon: 'ri-fire-line', color: '#F97316',
  },

  zero_point_reactor: {
    id: 'zero_point_reactor', name: 'Zero-Point Reactor',
    techClass: 'Power Core', subClass: 'Zero-Point-Reactors',
    category: 'Energy', subCategory: 'Power-Generation',
    techType: 'Passive', subType: 'Regeneration',
    tier: 5, maxLevel: 10,
    description: 'Harnesses vacuum energy for limitless power generation.',
    effects: [
      { stat: 'Power-Output', target: 'self', valuePerLevel: 0.15, unit: '%', operation: 'multiply' },
      { stat: 'Power-Efficiency', target: 'self', valuePerLevel: 0.08, unit: '%', operation: 'multiply' },
      { stat: 'Recharge-Rate', target: 'self', valuePerLevel: 0.06, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 60000, crystal: 100000, deuterium: 50000, antimatter: 10000 }, costFactor: 2.5,
    baseTime: 28800, timeFactor: 2.0,
    prerequisites: { tech: { antimatter_reactor_core: 10 }, tier: 5 },
    icon: 'ri-infinity-line', color: '#FCD34D',
  },

  singularity_core: {
    id: 'singularity_core', name: 'Singularity Core',
    techClass: 'Power Core', subClass: 'Singularity-Cores',
    category: 'Energy', subCategory: 'Power-Generation',
    techType: 'Transformation', subType: 'Combat-Form',
    tier: 6, maxLevel: 8,
    description: 'Micro-singularity that generates phenomenal power output.',
    effects: [
      { stat: 'Power-Output', target: 'self', valuePerLevel: 0.2, unit: '%', operation: 'multiply' },
      { stat: 'Overload-Capacity', target: 'self', valuePerLevel: 0.1, unit: '%', operation: 'multiply' },
    ],
    buffs: [{ buffType: 'Special', subBuff: 'Overcharge', strength: 0.15, duration: 30, target: 'self', stackable: true, maxStacks: 3 }],
    debuffs: [{ debuffType: 'Overload', subDebuff: 'Reactor-Meltdown-Threat', strength: 0.02, duration: 0, target: 'self' }],
    baseCost: { metal: 250000, crystal: 400000, deuterium: 200000, antimatter: 50000, darkMatter: 10000 }, costFactor: 3.5,
    baseTime: 259200, timeFactor: 2.5,
    prerequisites: { tech: { zero_point_reactor: 8, dimensional_drive: 5 }, tier: 6 },
    icon: 'ri-planet-line', color: '#FBBF24',
  },

  emergency_power_distribution: {
    id: 'emergency_power_distribution', name: 'Emergency Power Distribution',
    techClass: 'Power Core', subClass: 'Quantum-Cores',
    category: 'Defensive', subCategory: 'Emergency-Protocols',
    techType: 'Triggered', subType: 'On-Shield-Down',
    tier: 3, maxLevel: 12,
    description: 'Redirects all power to critical systems when shields fail.',
    effects: [
      { stat: 'Emergency-Power', target: 'self', valuePerLevel: 0.08, unit: '%', operation: 'multiply' },
      { stat: 'Power-Stability', target: 'self', valuePerLevel: 0.05, unit: '%', operation: 'multiply' },
    ],
    buffs: [{ buffType: 'Defensive', subBuff: 'Damage-Reduction', strength: 0.06, duration: 15, target: 'self' }],
    baseCost: { metal: 8000, crystal: 6000, deuterium: 4000 }, costFactor: 1.8,
    baseTime: 1200, timeFactor: 1.7,
    prerequisites: { tech: { fusion_reactor_optimization: 8 }, tier: 3 },
    icon: 'ri-flashlight-fill', color: '#FBBF24',
  },

  heat_dissipation_matrix: {
    id: 'heat_dissipation_matrix', name: 'Heat Dissipation Matrix',
    techClass: 'Power Core', subClass: 'Fusion-Reactors',
    category: 'Industrial', subCategory: 'Resource-Efficiency',
    techType: 'Passive', subType: 'Efficiency',
    tier: 2, maxLevel: 20,
    description: 'Advanced cooling systems for sustained high-power operation.',
    effects: [
      { stat: 'Heat-Dissipation', target: 'self', valuePerLevel: 0.06, unit: '%', operation: 'multiply' },
      { stat: 'Power-Stability', target: 'self', valuePerLevel: 0.03, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 2000, crystal: 3000, deuterium: 1000 }, costFactor: 1.7,
    baseTime: 300, timeFactor: 1.6,
    prerequisites: { tech: { fusion_reactor_optimization: 5 }, tier: 2 },
    icon: 'ri-snowflake-line', color: '#38BDF8',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SENSOR ARRAY TECHNOLOGIES
  // ═══════════════════════════════════════════════════════════════════════════

  long_range_sensor_array: {
    id: 'long_range_sensor_array', name: 'Long-Range Sensor Array',
    techClass: 'Sensor Array', subClass: 'Optical-Sensors',
    category: 'Scientific', subCategory: 'Anomaly-Analysis',
    techType: 'Passive', subType: 'Stat-Boost',
    tier: 1, maxLevel: 20,
    description: 'Extended sensor range for early threat detection.',
    effects: [
      { stat: 'Sensor-Range', target: 'self', valuePerLevel: 0.08, unit: '%', operation: 'multiply' },
      { stat: 'Sensor-Strength', target: 'self', valuePerLevel: 0.04, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 400, crystal: 800, deuterium: 200 }, costFactor: 1.6,
    baseTime: 120, timeFactor: 1.5,
    prerequisites: { tier: 1 },
    icon: 'ri-radar-line', color: '#06B6D4',
  },

  tactical_targeting_suite: {
    id: 'tactical_targeting_suite', name: 'Tactical Targeting Suite',
    techClass: 'Sensor Array', subClass: 'Gravitic-Sensors',
    category: 'Electronic', subCategory: 'Signal-Enhancement',
    techType: 'Active', subType: 'Scan',
    tier: 2, maxLevel: 15,
    description: 'Advanced targeting sensors for improved combat accuracy.',
    effects: [
      { stat: 'Target-Lock-Speed', target: 'self', valuePerLevel: 0.06, unit: '%', operation: 'multiply' },
      { stat: 'Accuracy', target: 'self', valuePerLevel: 0.04, unit: '%', operation: 'multiply' },
    ],
    buffs: [{ buffType: 'Tactical', subBuff: 'Targeting-Up', strength: 0.05, duration: 15, target: 'self' }],
    baseCost: { metal: 2000, crystal: 4000, deuterium: 1000 }, costFactor: 1.7,
    baseTime: 300, timeFactor: 1.6,
    prerequisites: { tech: { long_range_sensor_array: 5 }, tier: 2 },
    icon: 'ri-focus-3-line', color: '#22D3EE',
  },

  cloak_detection_system: {
    id: 'cloak_detection_system', name: 'Cloak Detection System',
    techClass: 'Sensor Array', subClass: 'Quantum-Sensors',
    category: 'Stealth', subCategory: 'Sensor-Spoofing',
    techType: 'Passive', subType: 'Resistance',
    tier: 3, maxLevel: 12,
    description: 'Quantum sensors that detect cloaked vessels.',
    effects: [
      { stat: 'Cloak-Detection', target: 'self', valuePerLevel: 0.08, unit: '%', operation: 'multiply' },
      { stat: 'Signature-Detection', target: 'self', valuePerLevel: 0.06, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 5000, crystal: 10000, deuterium: 3000 }, costFactor: 2.0,
    baseTime: 1200, timeFactor: 1.8,
    prerequisites: { tech: { tactical_targeting_suite: 8 }, tier: 3 },
    icon: 'ri-eye-2-line', color: '#67E8F9',
  },

  subspace_penetration_array: {
    id: 'subspace_penetration_array', name: 'Subspace Penetration Array',
    techClass: 'Sensor Array', subClass: 'Tachyon-Sensors',
    category: 'Scientific', subCategory: 'Anomaly-Analysis',
    techType: 'Active', subType: 'Overcharge',
    tier: 4, maxLevel: 10,
    description: 'Peers into subspace to detect hidden threats and resources.',
    effects: [
      { stat: 'Subspace-Penetration', target: 'self', valuePerLevel: 0.1, unit: '%', operation: 'multiply' },
      { stat: 'Sensor-Range', target: 'self', valuePerLevel: 0.08, unit: '%', operation: 'multiply' },
      { stat: 'Data-Bandwidth', target: 'self', valuePerLevel: 0.05, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 20000, crystal: 35000, deuterium: 15000, antimatter: 2000 }, costFactor: 2.2,
    baseTime: 7200, timeFactor: 1.9,
    prerequisites: { tech: { cloak_detection_system: 6 }, tier: 4 },
    icon: 'ri-wifi-line', color: '#2DD4BF',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ELECTRONIC WARFARE TECHNOLOGIES
  // ═══════════════════════════════════════════════════════════════════════════

  ecm_package: {
    id: 'ecm_package', name: 'ECM Package',
    techClass: 'Electronic Warfare', subClass: 'ECM-Packages',
    category: 'Electronic', subCategory: 'Signal-Jamming',
    techType: 'Toggle', subType: 'Combat-Mode',
    tier: 2, maxLevel: 20,
    description: 'Electronic countermeasures that jam enemy targeting.',
    effects: [
      { stat: 'Signal-Enhancement', target: 'self', valuePerLevel: 0.05, unit: '%', operation: 'multiply' },
    ],
    debuffs: [
      { debuffType: 'Disruption', subDebuff: 'Sensor-Blind', strength: 0.04, duration: 8, target: 'enemy', stackable: true, maxStacks: 5 },
      { debuffType: 'Disruption', subDebuff: 'Targeting-Fail', strength: 0.03, duration: 8, target: 'enemy', stackable: true, maxStacks: 5 },
    ],
    baseCost: { metal: 3000, crystal: 6000, deuterium: 2000 }, costFactor: 1.7,
    baseTime: 300, timeFactor: 1.6,
    prerequisites: { tech: { long_range_sensor_array: 5 }, tier: 2 },
    icon: 'ri-signal-wifi-error-line', color: '#6B7280',
  },

  ai_core: {
    id: 'ai_core', name: 'AI Combat Core',
    techClass: 'Electronic Warfare', subClass: 'AI-Cores',
    category: 'Electronic', subCategory: 'AI-Integration',
    techType: 'Passive', subType: 'Synergy',
    tier: 4, maxLevel: 15,
    description: 'AI core that optimizes all ship subsystems in real-time.',
    effects: [
      { stat: 'Weapon-Damage', target: 'self', valuePerLevel: 0.04, unit: '%', operation: 'multiply' },
      { stat: 'Evasion', target: 'self', valuePerLevel: 0.03, unit: '%', operation: 'multiply' },
      { stat: 'Target-Lock-Speed', target: 'self', valuePerLevel: 0.05, unit: '%', operation: 'multiply' },
    ],
    buffs: [{ buffType: 'Tactical', subBuff: 'Coordination-Up', strength: 0.05, duration: 0, target: 'self' }],
    baseCost: { metal: 25000, crystal: 40000, deuterium: 15000, darkMatter: 2000 }, costFactor: 2.2,
    baseTime: 7200, timeFactor: 1.9,
    prerequisites: { tech: { ecm_package: 10, tactical_targeting_suite: 8 }, tier: 4 },
    icon: 'ri-cpu-line', color: '#8B5CF6',
  },

  quantum_encryption_network: {
    id: 'quantum_encryption_network', name: 'Quantum Encryption Network',
    techClass: 'Electronic Warfare', subClass: 'Quantum-Encryption',
    category: 'Electronic', subCategory: 'Encryption',
    techType: 'Passive', subType: 'Resistance',
    tier: 4, maxLevel: 12,
    description: 'Unbreakable quantum encryption for fleet communications.',
    effects: [
      { stat: 'Data-Processing', target: 'self', valuePerLevel: 0.06, unit: '%', operation: 'multiply' },
    ],
    buffs: [{ buffType: 'Resistance', subBuff: 'EM-Resist', strength: 0.05, duration: 0, target: 'self' }],
    debuffs: [{ debuffType: 'Disruption', subDebuff: 'Comm-Break', strength: -0.08, duration: 0, target: 'enemy' }],
    baseCost: { metal: 15000, crystal: 30000, deuterium: 10000, darkMatter: 1000 }, costFactor: 2.1,
    baseTime: 5400, timeFactor: 1.9,
    prerequisites: { tech: { ecm_package: 8, ai_core: 5 }, tier: 4 },
    icon: 'ri-lock-line', color: '#A78BFA',
  },

  cyber_attack_suite: {
    id: 'cyber_attack_suite', name: 'Cyber Attack Suite',
    techClass: 'Electronic Warfare', subClass: 'Cyber-Attack-Suites',
    category: 'Electronic', subCategory: 'Cyber-Attack',
    techType: 'Active', subType: 'Debuff-Enemies',
    tier: 3, maxLevel: 12,
    description: 'Hack enemy ship systems to cause malfunctions.',
    effects: [],
    debuffs: [
      { debuffType: 'Control', subDebuff: 'Hijack-Attempt', strength: 0.03, duration: 5, target: 'enemy', stackable: true, maxStacks: 3 },
      { debuffType: 'Control', subDebuff: 'AI-Corruption', strength: 0.04, duration: 5, target: 'enemy', stackable: true, maxStacks: 3 },
      { debuffType: 'Disruption', subDebuff: 'Weapon-Jam', strength: 0.05, duration: 5, target: 'enemy', stackable: true, maxStacks: 5 },
    ],
    baseCost: { metal: 8000, crystal: 15000, deuterium: 5000 }, costFactor: 2.0,
    baseTime: 1800, timeFactor: 1.8,
    prerequisites: { tech: { ecm_package: 8 }, tier: 3 },
    icon: 'ri-bug-line', color: '#EF4444',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LIFE SUPPORT TECHNOLOGIES
  // ═══════════════════════════════════════════════════════════════════════════

  advanced_life_support: {
    id: 'advanced_life_support', name: 'Advanced Life Support',
    techClass: 'Life Support', subClass: 'Advanced-Life-Support',
    category: 'Support', subCategory: 'Life-Support',
    techType: 'Passive', subType: 'Stat-Boost',
    tier: 1, maxLevel: 20,
    description: 'Improved life support systems for larger crews.',
    effects: [
      { stat: 'Crew-Capacity', target: 'self', valuePerLevel: 0.06, unit: '%', operation: 'multiply' },
      { stat: 'Crew-Survival', target: 'self', valuePerLevel: 0.04, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 500, crystal: 300, deuterium: 100 }, costFactor: 1.5,
    baseTime: 60, timeFactor: 1.5,
    prerequisites: { tier: 1 },
    icon: 'ri-heart-pulse-line', color: '#EC4899',
  },

  medical_bay_enhancements: {
    id: 'medical_bay_enhancements', name: 'Medical Bay Enhancements',
    techClass: 'Life Support', subClass: 'Medical-Bays',
    category: 'Support', subCategory: 'Medical',
    techType: 'Passive', subType: 'Regeneration',
    tier: 2, maxLevel: 15,
    description: 'Advanced medical facilities that reduce crew casualties.',
    effects: [
      { stat: 'Medical-Capacity', target: 'self', valuePerLevel: 0.08, unit: '%', operation: 'multiply' },
      { stat: 'Crew-Survival', target: 'self', valuePerLevel: 0.06, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 2000, crystal: 3000, deuterium: 1000 }, costFactor: 1.7,
    baseTime: 240, timeFactor: 1.6,
    prerequisites: { tech: { advanced_life_support: 5 }, tier: 2 },
    icon: 'ri-hospital-line', color: '#F472B6',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CARGO & UTILITY TECHNOLOGIES
  // ═══════════════════════════════════════════════════════════════════════════

  cargo_expansion_modules: {
    id: 'cargo_expansion_modules', name: 'Cargo Expansion Modules',
    techClass: 'Cargo & Utility', subClass: 'Standard-Cargo',
    category: 'Logistics', subCategory: 'Supply-Chain',
    techType: 'Passive', subType: 'Capacity',
    tier: 1, maxLevel: 20,
    description: 'Modular cargo expansions for increased carrying capacity.',
    effects: [
      { stat: 'Cargo-Capacity', target: 'self', valuePerLevel: 0.1, unit: '%', operation: 'multiply' },
      { stat: 'Resource-Capacity', target: 'self', valuePerLevel: 0.06, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 300, crystal: 200 }, costFactor: 1.5,
    baseTime: 60, timeFactor: 1.5,
    prerequisites: { tier: 1 },
    icon: 'ri-box-3-line', color: '#A1A1AA',
  },

  salvage_optimization: {
    id: 'salvage_optimization', name: 'Salvage Optimization Suite',
    techClass: 'Cargo & Utility', subClass: 'Salvage-Bays',
    category: 'Utility', subCategory: 'Salvage-Optimization',
    techType: 'Passive', subType: 'Efficiency',
    tier: 2, maxLevel: 15,
    description: 'Improved salvage equipment for better resource recovery.',
    effects: [
      { stat: 'Salvage-Efficiency', target: 'self', valuePerLevel: 0.08, unit: '%', operation: 'multiply' },
      { stat: 'Cargo-Capacity', target: 'self', valuePerLevel: 0.04, unit: '%', operation: 'multiply' },
    ],
    baseCost: { metal: 2000, crystal: 1000, deuterium: 500 }, costFactor: 1.7,
    baseTime: 180, timeFactor: 1.6,
    prerequisites: { tech: { cargo_expansion_modules: 5 }, tier: 2 },
    icon: 'ri-recycle-line', color: '#84CC16',
  },

  repair_bay_automation: {
    id: 'repair_bay_automation', name: 'Repair Bay Automation',
    techClass: 'Cargo & Utility', subClass: 'Repair-Bays',
    category: 'Utility', subCategory: 'Repair-Speed',
    techType: 'Passive', subType: 'Regeneration',
    tier: 3, maxLevel: 15,
    description: 'Automated repair systems for faster battle damage recovery.',
    effects: [
      { stat: 'Repair-Efficiency', target: 'self', valuePerLevel: 0.08, unit: '%', operation: 'multiply' },
      { stat: 'Salvage-Efficiency', target: 'self', valuePerLevel: 0.04, unit: '%', operation: 'multiply' },
    ],
    buffs: [{ buffType: 'Recovery', subBuff: 'Repair-Speed-Up', strength: 0.06, duration: 0, target: 'self' }],
    baseCost: { metal: 5000, crystal: 4000, deuterium: 2000 }, costFactor: 1.8,
    baseTime: 600, timeFactor: 1.7,
    prerequisites: { tech: { cargo_expansion_modules: 8 }, tier: 3 },
    icon: 'ri-tools-line', color: '#22C55E',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SPECIAL SYSTEMS
  // ═══════════════════════════════════════════════════════════════════════════

  cloak_device: {
    id: 'cloak_device', name: 'Cloaking Device',
    techClass: 'Special Systems', subClass: 'Cloaking-Devices',
    category: 'Stealth', subCategory: 'Cloak-Stability',
    techType: 'Toggle', subType: 'Stealth-Mode',
    tier: 4, maxLevel: 15,
    description: 'Render ship invisible to most sensor systems.',
    effects: [
      { stat: 'Signature-Detection', target: 'self', valuePerLevel: -0.06, unit: '%', operation: 'multiply' },
    ],
    buffs: [
      { buffType: 'Stealth', subBuff: 'Cloak-Strength', strength: 0.08, duration: 0, target: 'self' },
      { buffType: 'Stealth', subBuff: 'Cloak-Stability', strength: 0.04, duration: 0, target: 'self' },
    ],
    mutuallyExclusive: ['phase_shift_armor'],
    baseCost: { metal: 20000, crystal: 40000, deuterium: 15000, darkMatter: 2000 }, costFactor: 2.2,
    baseTime: 7200, timeFactor: 1.9,
    prerequisites: { tech: { stealth_hull_coating: 8, ecm_package: 6 }, tier: 4 },
    icon: 'ri-moon-clear-line', color: '#4B5563',
  },

  phase_shift_armor: {
    id: 'phase_shift_armor', name: 'Phase-Shift Armor',
    techClass: 'Special Systems', subClass: 'Phase-Shifters',
    category: 'Defensive', subCategory: 'Adaptive-Defenses',
    techType: 'Triggered', subType: 'On-Damage',
    tier: 4, maxLevel: 12,
    description: 'Armor that phases to another dimension on impact, avoiding damage.',
    effects: [
      { stat: 'Damage-Stabilization', target: 'self', valuePerLevel: 0.06, unit: '%', operation: 'multiply' },
    ],
    buffs: [{ buffType: 'Defensive', subBuff: 'Damage-Reduction', strength: 0.07, duration: 8, target: 'self', stackable: true, maxStacks: 3 }],
    mutuallyExclusive: ['cloak_device'],
    baseCost: { metal: 25000, crystal: 35000, deuterium: 12000, antimatter: 3000 }, costFactor: 2.2,
    baseTime: 7200, timeFactor: 1.9,
    prerequisites: { tech: { stealth_hull_coating: 10, phase_shift_shields: 5 }, tier: 4 },
    icon: 'ri-shield-line', color: '#818CF8',
  },

  gravity_well_projector: {
    id: 'gravity_well_projector', name: 'Gravity Well Projector',
    techClass: 'Special Systems', subClass: 'Gravity-Wells',
    category: 'Offensive', subCategory: 'Area-Effect',
    techType: 'Channeled', subType: 'Gravity-Tether',
    tier: 5, maxLevel: 10,
    description: 'Creates a gravity well that traps and damages enemy ships.',
    effects: [
      { stat: 'Weapon-Damage', target: 'self', valuePerLevel: 0.06, unit: '%', operation: 'multiply' },
    ],
    debuffs: [
      { debuffType: 'Impairment', subDebuff: 'Slow', strength: 0.08, duration: 10, target: 'enemy', stackable: true, maxStacks: 5 },
      { debuffType: 'Impairment', subDebuff: 'Root', strength: 0.04, duration: 5, target: 'enemy' },
    ],
    baseCost: { metal: 40000, crystal: 60000, deuterium: 25000, antimatter: 5000 }, costFactor: 2.5,
    baseTime: 21600, timeFactor: 2.0,
    prerequisites: { tech: { gravitic_lance: 5, formation_flight_network: 8 }, tier: 5 },
    icon: 'ri-planet-line', color: '#A855F7',
  },

  teleportation_array: {
    id: 'teleportation_array', name: 'Teleportation Array',
    techClass: 'Special Systems', subClass: 'Teleportation-Arrays',
    category: 'Logistics', subCategory: 'Reinforcement-Dispatch',
    techType: 'Active', subType: 'Teleport',
    tier: 5, maxLevel: 10,
    description: 'Quantum teleportation for instantaneous troop deployment.',
    effects: [
      { stat: 'Evacuation-Speed', target: 'self', valuePerLevel: 0.1, unit: '%', operation: 'multiply' },
    ],
    buffs: [{ buffType: 'Mobility', subBuff: 'Evasion-Up', strength: 0.05, duration: 0, target: 'self' }],
    baseCost: { metal: 50000, crystal: 80000, deuterium: 40000, antimatter: 8000, darkMatter: 3000 }, costFactor: 2.5,
    baseTime: 43200, timeFactor: 2.0,
    prerequisites: { tech: { jump_drive_accuracy: 10, ai_core: 8 }, tier: 5 },
    icon: 'ri-door-open-line', color: '#D946EF',
  },

  singularity_cannon: {
    id: 'singularity_cannon', name: 'Singularity Cannon',
    techClass: 'Special Systems', subClass: 'Singularity-Cannons',
    category: 'Offensive', subCategory: 'Alpha-Strike',
    techType: 'Charged', subType: 'Singularity-Bomb',
    tier: 6, maxLevel: 6,
    description: 'Creates a micro-singularity that annihilates targets.',
    effects: [
      { stat: 'Weapon-Damage', target: 'self', valuePerLevel: 0.25, unit: '%', operation: 'multiply' },
      { stat: 'Range', target: 'self', valuePerLevel: 0.1, unit: '%', operation: 'multiply' },
    ],
    debuffs: [
      { debuffType: 'Breach', subDebuff: 'Dimensional-Breach', strength: 0.15, duration: 30, target: 'enemy' },
      { debuffType: 'Breach', subDebuff: 'Hull-Breach', strength: 0.12, duration: 30, target: 'enemy' },
    ],
    baseCost: { metal: 500000, crystal: 750000, deuterium: 500000, antimatter: 100000, darkMatter: 25000 }, costFactor: 4.0,
    baseTime: 604800, timeFactor: 3.0,
    prerequisites: { tech: { gravitic_lance: 8, singularity_core: 5 }, tier: 6 },
    icon: 'ri-star-s-line', color: '#F97316',
  },

  nanite_cloud_generator: {
    id: 'nanite_cloud_generator', name: 'Nanite Cloud Generator',
    techClass: 'Special Systems', subClass: 'Nanite-Clouds',
    category: 'Defensive', subCategory: 'Repair-Systems',
    techType: 'Aura', subType: 'Repair-Aura',
    tier: 4, maxLevel: 10,
    description: 'Releases a cloud of repair nanites that heal allied ships.',
    effects: [
      { stat: 'Self-Repair', target: 'self', valuePerLevel: 0.05, unit: '%', operation: 'add' },
    ],
    buffs: [
      { buffType: 'Recovery', subBuff: 'Hull-Regen-Up', strength: 0.04, duration: 0, target: 'fleet', stackable: true, maxStacks: 3 },
      { buffType: 'Recovery', subBuff: 'Nanite-Repair', strength: 0.03, duration: 0, target: 'fleet' },
    ],
    baseCost: { metal: 30000, crystal: 50000, deuterium: 20000, antimatter: 3000 }, costFactor: 2.2,
    baseTime: 14400, timeFactor: 1.9,
    prerequisites: { tech: { nanite_hull_matrix: 5, repair_bay_automation: 8 }, tier: 4 },
    icon: 'ri-bubble-chart-line', color: '#34D399',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

export type StarshipTechId = keyof typeof STARSHIP_TECHNOLOGIES;

/** Get technologies filtered by tech class */
export function getTechsByClass(techClass: TechClass): StarshipTechDef[] {
  return Object.values(STARSHIP_TECHNOLOGIES).filter(t => t.techClass === techClass);
}

/** Get technologies filtered by category */
export function getTechsByCategory(category: TechCategory): StarshipTechDef[] {
  return Object.values(STARSHIP_TECHNOLOGIES).filter(t => t.category === category);
}

/** Get technologies accessible to a given ship class */
export function getTechsForShipClass(shipClass: string): StarshipTechDef[] {
  const { SHIP_TECH_ACCESS } = require('../config/starshipTechTree');
  const allowedClasses = SHIP_TECH_ACCESS[shipClass] ?? [];
  return Object.values(STARSHIP_TECHNOLOGIES).filter(t =>
    allowedClasses.includes(t.techClass)
  );
}

/** Calculate tech cost for a given level */
export function getStarshipTechCost(techId: string, level: number): StarshipTechCost {
  const def = STARSHIP_TECHNOLOGIES[techId];
  if (!def) return {};
  const factor = Math.pow(def.costFactor, level - 1);
  const cost: StarshipTechCost = {};
  if (def.baseCost.metal) cost.metal = Math.floor(def.baseCost.metal * factor);
  if (def.baseCost.crystal) cost.crystal = Math.floor(def.baseCost.crystal * factor);
  if (def.baseCost.deuterium) cost.deuterium = Math.floor(def.baseCost.deuterium * factor);
  if (def.baseCost.antimatter) cost.antimatter = Math.floor(def.baseCost.antimatter * factor);
  if (def.baseCost.darkMatter) cost.darkMatter = Math.floor(def.baseCost.darkMatter * factor);
  if (def.baseCost.credits) cost.credits = Math.floor(def.baseCost.credits * factor);
  return cost;
}

/** Calculate research time for a given level */
export function getStarshipTechTime(techId: string, level: number, labLevel: number = 1): number {
  const def = STARSHIP_TECHNOLOGIES[techId];
  if (!def) return 0;
  return Math.max(1, Math.floor(def.baseTime * Math.pow(def.timeFactor, level - 1) / (1 + labLevel)));
}
