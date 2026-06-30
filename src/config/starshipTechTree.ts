// ═══════════════════════════════════════════════════════════════════════════
// STARSHIP TECHNOLOGY TREE — Full Taxonomy
// Classes → Sub-Classes | Categories → Sub-Categories | Types → Sub-Types
// Stats → Sub-Stats | Buffs → Sub-Buffs | Debuffs → Sub-Debuffs
// Each axis provides 90 (parent × child) discrete entries
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: TECHNOLOGY CLASSES (10 classes × 9 sub-classes = 90)
// ─────────────────────────────────────────────────────────────────────────────

export const TECH_CLASSES = {
  HullSystems: 'Hull Systems',
  ShieldSystems: 'Shield Systems',
  WeaponSystems: 'Weapon Systems',
  Propulsion: 'Propulsion',
  PowerCore: 'Power Core',
  SensorArray: 'Sensor Array',
  ElectronicWarfare: 'Electronic Warfare',
  LifeSupport: 'Life Support',
  CargoUtility: 'Cargo & Utility',
  SpecialSystems: 'Special Systems',
} as const;

export type TechClass = (typeof TECH_CLASSES)[keyof typeof TECH_CLASSES];

export const TECH_SUB_CLASSES: Record<TechClass, string[]> = {
  'Hull Systems': ['Light-Frame', 'Medium-Frame', 'Heavy-Frame', 'Capital-Frame', 'Regenerative-Hull', 'Composite-Hull', 'Reinforced-Hull', 'Stealth-Hull', 'Modular-Hull'],
  'Shield Systems': ['Deflector-Shields', 'Energy-Barriers', 'Phase-Shields', 'Quantum-Barriers', 'Void-Shields', 'Plasma-Shields', 'Gravitic-Shields', 'Adaptive-Shields', 'Temporal-Shields'],
  'Weapon Systems': ['Laser-Weapons', 'Ion-Weapons', 'Plasma-Weapons', 'Kinetic-Weapons', 'Missile-Weapons', 'Beam-Weapons', 'Gravitic-Weapons', 'Quantum-Weapons', 'Temporal-Weapons'],
  Propulsion: ['Impulse-Engines', 'Fusion-Drives', 'Ion-Drives', 'Warp-Drives', 'Jump-Drives', 'Hyper-Drives', 'Dimensional-Drives', 'Zero-Point-Drives', 'Tachyon-Drives'],
  'Power Core': ['Fusion-Reactors', 'Antimatter-Reactors', 'Zero-Point-Reactors', 'Quantum-Cores', 'Dark-Energy-Cores', 'Singularity-Cores', 'Dimensional-Cores', 'Temporal-Cores', 'Cosmic-Cores'],
  'Sensor Array': ['Optical-Sensors', 'Thermal-Sensors', 'Gravitic-Sensors', 'Quantum-Sensors', 'Tachyon-Sensors', 'Dimensional-Sensors', 'Psionic-Sensors', 'Temporal-Sensors', 'Omni-Sensors'],
  'Electronic Warfare': ['ECM-Packages', 'ECCM-Packages', 'Comm-Encryption', 'Data-Jamming', 'Holo-Projection', 'Cyber-Attack-Suites', 'AI-Cores', 'Neural-Interfaces', 'Quantum-Encryption'],
  'Life Support': ['Basic-Life-Support', 'Advanced-Life-Support', 'Emergency-Systems', 'Medical-Bays', 'Recreation-Decks', 'Hydroponics', 'Cryogenics', 'Cloning-Facilities', 'Habitat-Decks'],
  'Cargo & Utility': ['Standard-Cargo', 'Refrigerated-Cargo', 'Hazardous-Cargo', 'Manufacturing-Bays', 'Refineries', 'Assembly-Lines', 'Hangar-Bays', 'Repair-Bays', 'Salvage-Bays'],
  'Special Systems': ['Cloaking-Devices', 'Teleportation-Arrays', 'Gravity-Wells', 'Stasis-Fields', 'Nanite-Clouds', 'Phase-Shifters', 'Reality-Alterers', 'Dimension-Gates', 'Singularity-Cannons'],
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: TECHNOLOGY CATEGORIES (10 categories × 9 sub-categories = 90)
// ─────────────────────────────────────────────────────────────────────────────

export const TECH_CATEGORIES = {
  Offensive: 'Offensive',
  Defensive: 'Defensive',
  Propulsion: 'Propulsion',
  Utility: 'Utility',
  Electronic: 'Electronic',
  Scientific: 'Scientific',
  Industrial: 'Industrial',
  Logistics: 'Logistics',
  Stealth: 'Stealth',
  Ultimate: 'Ultimate',
} as const;

export type TechCategory = (typeof TECH_CATEGORIES)[keyof typeof TECH_CATEGORIES];

export const TECH_SUB_CATEGORIES: Record<TechCategory, string[]> = {
  Offensive: ['Direct-Damage', 'Armor-Piercing', 'Shield-Penetration', 'Critical-Strike', 'Area-Effect', 'Damage-Over-Time', 'Alpha-Strike', 'Suppression', 'Neutralizing'],
  Defensive: ['Hull-Reinforcement', 'Shield-Amplification', 'Armor-Hardening', 'Damage-Reduction', 'Repair-Systems', 'Auto-Destruct-Prevention', 'Emergency-Protocols', 'Adaptive-Defenses', 'Reflective-Coating'],
  Propulsion: ['Sublight-Optimization', 'FTL-Calibration', 'Warp-Efficiency', 'Jump-Accuracy', 'Fuel-Economy', 'Emergency-Speed', 'Maneuverability', 'Formation-Flying', 'Slipstream-Navigation'],
  Utility: ['Cargo-Expansion', 'Crew-Comfort', 'Manufacturing-Efficiency', 'Resource-Processing', 'Fuel-Refinement', 'Salvage-Optimization', 'Repair-Speed', 'Medical-Capacity', 'Scanner-Range'],
  Electronic: ['Signal-Enhancement', 'Signal-Jamming', 'Data-Processing', 'Encryption', 'Decryption', 'Cyber-Defense', 'Cyber-Attack', 'AI-Integration', 'Network-Resilience'],
  Scientific: ['Xeno-Research', 'Anomaly-Analysis', 'Quantum-Experiments', 'Temporal-Studies', 'Dimensional-Research', 'Psionic-Investigation', 'Bio-Engineering', 'Material-Science', 'Energy-Physics'],
  Industrial: ['Mass-Production', 'Assembly-Optimization', 'Resource-Efficiency', 'Construction-Speed', 'Nanite-Assembly', 'Modular-Construction', 'Quality-Assurance', 'Waste-Reduction', 'Automation'],
  Logistics: ['Supply-Chain', 'Fleet-Coordination', 'Formation-Control', 'Communication-Relay', 'Fuel-Distribution', 'Ammunition-Resupply', 'Troop-Transport', 'Evacuation-Protocols', 'Reinforcement-Dispatch'],
  Stealth: ['Signature-Reduction', 'Sensor-Spoofing', 'Cloak-Stability', 'Phase-Shifting', 'Thermal-Masking', 'EM-Suppression', 'Gravitic-Nullification', 'Visual-Camouflage', 'Quantum-Obscurity'],
  Ultimate: ['Reality-Manipulation', 'Temporal-Control', 'Dimensional-Breach', 'Cosmic-Harnessing', 'Singularity-Creation', 'Star-Forging', 'Void-Manipulation', 'Exotic-Matter', 'Omni-Integration'],
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: TECHNOLOGY TYPES (10 types × 9 sub-types = 90)
// ─────────────────────────────────────────────────────────────────────────────

export const TECH_TYPES = {
  Passive: 'Passive',
  Active: 'Active',
  Toggle: 'Toggle',
  Aura: 'Aura',
  Triggered: 'Triggered',
  Equipped: 'Equipped',
  Consumable: 'Consumable',
  Charged: 'Charged',
  Channeled: 'Channeled',
  Transformation: 'Transformation',
} as const;

export type TechType = (typeof TECH_TYPES)[keyof typeof TECH_TYPES];

export const TECH_SUB_TYPES: Record<TechType, string[]> = {
  Passive: ['Stat-Boost', 'Resistance', 'Regeneration', 'Efficiency', 'Capacity', 'Threshold', 'Scaling', 'Synergy', 'Mastery'],
  Active: ['Single-Target', 'AoE', 'Buff-Allies', 'Debuff-Enemies', 'Heal', 'Shield', 'Teleport', 'Scan', 'Overcharge'],
  Toggle: ['Weapon-Mode', 'Shield-Mode', 'Engine-Mode', 'Sensor-Mode', 'Stealth-Mode', 'Power-Mode', 'Combat-Mode', 'Economy-Mode', 'Emergency-Mode'],
  Aura: ['Damage-Aura', 'Defense-Aura', 'Speed-Aura', 'Repair-Aura', 'Morale-Aura', 'Stealth-Aura', 'Detection-Aura', 'Hazard-Aura', 'Command-Aura'],
  Triggered: ['On-Hit', 'On-Kill', 'On-Damage', 'On-Shield-Down', 'On-Hull-Breach', 'On-Enemy-Death', 'On-Critical', 'On-Dodge', 'On-Jump'],
  Equipped: ['Weapon-Mod', 'Shield-Mod', 'Engine-Mod', 'Armor-Mod', 'Sensor-Mod', 'Utility-Mod', 'Reactor-Mod', 'Computer-Mod', 'Cargo-Mod'],
  Consumable: ['Nanite-Pack', 'Shield-Booster', 'Hull-Repair-Kit', 'Fuel-Pod', 'Ammo-Crate', 'Energy-Cell', 'Coolant-Flush', 'Overdrive-Injector', 'Cloak-Charge'],
  Charged: ['Cannon-Shot', 'Shield-Burst', 'Speed-Boost', 'Scan-Pulse', 'EMP-Blast', 'Nova-Strike', 'Phantom-Shift', 'Repair-Wave', 'Singularity-Bomb'],
  Channeled: ['Beam-Focus', 'Shield-Channel', 'Warp-Charge', 'Scan-Array', 'Repair-Beam', 'Data-Stream', 'Power-Drain', 'Nanite-Spray', 'Gravity-Tether'],
  Transformation: ['Combat-Form', 'Siege-Form', 'Stealth-Form', 'Speed-Form', 'Support-Form', 'Defense-Form', 'Carrier-Form', 'Mining-Form', 'Recon-Form'],
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: TECHNOLOGY STATS (10 stats × 9 sub-stats = 90)
// ─────────────────────────────────────────────────────────────────────────────

export const TECH_STATS = {
  Hull: 'Hull',
  Shield: 'Shield',
  Armor: 'Armor',
  Weapon: 'Weapon',
  Speed: 'Speed',
  Sensor: 'Sensor',
  Power: 'Power',
  Capacity: 'Capacity',
  Crew: 'Crew',
  Utility: 'Utility',
} as const;

export type TechStat = (typeof TECH_STATS)[keyof typeof TECH_STATS];

export const TECH_SUB_STATS: Record<TechStat, string[]> = {
  Hull: ['Max-Hull', 'Hull-Regen', 'Hull-Integrity', 'Collision-Resistance', 'Structural-Redundancy', 'Internal-Compartmentalization', 'Damage-Stabilization', 'Breach-Resistance', 'Self-Repair'],
  Shield: ['Max-Shield', 'Shield-Regen', 'Shield-Capacity', 'Shield-Hardness', 'Shield-Reflect', 'Shield-Penetration-Resist', 'Shield-Absorption', 'Shield-Matrix-Stability', 'Adaptive-Resonance'],
  Armor: ['Armor-Rating', 'Armor-Hardness', 'Ablative-Layers', 'Reactive-Plating', 'Armor-Thickness', 'Thermal-Resistance', 'Kinetic-Resistance', 'Energy-Resistance', 'Explosive-Resistance'],
  Weapon: ['Weapon-Damage', 'Fire-Rate', 'Range', 'Accuracy', 'Critical-Chance', 'Critical-Damage', 'Armor-Piercing', 'Shield-Penetration', 'Tracking-Speed'],
  Speed: ['Max-Speed', 'Acceleration', 'Turn-Rate', 'Warp-Speed', 'Jump-Range', 'Slipstream-Speed', 'Emergency-Boost', 'Combat-Speed', 'Cruising-Speed'],
  Sensor: ['Sensor-Range', 'Sensor-Strength', 'Sensor-Resolution', 'Signature-Detection', 'Cloak-Detection', 'Jamming-Resistance', 'Data-Bandwidth', 'Target-Lock-Speed', 'Subspace-Penetration'],
  Power: ['Power-Output', 'Power-Efficiency', 'Power-Storage', 'Power-Stability', 'Emergency-Power', 'Recharge-Rate', 'Heat-Dissipation', 'Overload-Capacity', 'Waste-Heat-Recovery'],
  Capacity: ['Cargo-Capacity', 'Fuel-Capacity', 'Ammo-Capacity', 'Crew-Capacity', 'Troop-Capacity', 'Fighter-Capacity', 'Drone-Capacity', 'Resource-Capacity', 'Container-Capacity'],
  Crew: ['Crew-Efficiency', 'Crew-Survival', 'Crew-Morale', 'Crew-Training', 'Medical-Capacity', 'Quarters-Quality', 'Fatigue-Resistance', 'Board-Defense', 'Evacuation-Speed'],
  Utility: ['Mining-Efficiency', 'Salvage-Efficiency', 'Repair-Efficiency', 'Construction-Speed', 'Research-Speed', 'Trade-Efficiency', 'Production-Efficiency', 'Refinement-Efficiency', 'Deuterium-Saving'],
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: BUFF TYPES (10 buffs × 9 sub-buffs = 90)
// ─────────────────────────────────────────────────────────────────────────────

export const BUFF_TYPES = {
  Offensive: 'Offensive',
  Defensive: 'Defensive',
  Mobility: 'Mobility',
  Recovery: 'Recovery',
  Utility: 'Utility',
  Tactical: 'Tactical',
  Command: 'Command',
  Stealth: 'Stealth',
  Resistance: 'Resistance',
  Special: 'Special',
} as const;

export type BuffType = (typeof BUFF_TYPES)[keyof typeof BUFF_TYPES];

export const BUFF_SUB_TYPES: Record<BuffType, string[]> = {
  Offensive: ['Damage-Up', 'Fire-Rate-Up', 'Crit-Chance-Up', 'Crit-Damage-Up', 'Range-Up', 'Tracking-Up', 'Armor-Piercing-Up', 'Shield-Piercing-Up', 'Alpha-Strike-Up'],
  Defensive: ['Hull-Up', 'Shield-Up', 'Armor-Up', 'Damage-Reduction', 'Repair-Boost', 'Shield-Regen-Up', 'Deflection-Chance', 'Absorption-Up', 'Reflective-Up'],
  Mobility: ['Speed-Up', 'Acceleration-Up', 'Turn-Rate-Up', 'Warp-Speed-Up', 'Jump-Range-Up', 'Evasion-Up', 'Maneuverability-Up', 'Boost-Duration-Up', 'Formation-Bonus'],
  Recovery: ['Hull-Regen-Up', 'Shield-Regen-Up', 'Repair-Speed-Up', 'Energy-Regen-Up', 'Cooling-Rate-Up', 'Fuel-Recovery', 'Ammo-Recovery', 'Crew-Recovery', 'Nanite-Repair'],
  Utility: ['Cargo-Up', 'Mining-Up', 'Salvage-Up', 'Research-Up', 'Production-Up', 'Trade-Up', 'Refining-Up', 'Construction-Up', 'Scan-Range-Up'],
  Tactical: ['Targeting-Up', 'Lock-On-Speed-Up', 'Weakness-Scan', 'Precision-Strike', 'Volley-Fire', 'Formation-Attack', 'Flanking-Bonus', 'Rear-Bonus', 'Focus-Fire'],
  Command: ['Fleet-Damage-Up', 'Fleet-Defense-Up', 'Fleet-Speed-Up', 'Fleet-Regen-Up', 'Coordination-Up', 'Communication-Range', 'Morale-Up', 'Discipline-Up', 'Tactical-Intel'],
  Stealth: ['Cloak-Strength', 'Cloak-Stability', 'Signature-Reduction', 'Detection-Resist', 'Phase-Stability', 'Thermal-Masking', 'EM-Suppression', 'Visual-Camo', 'Sensor-Spoof'],
  Resistance: ['Thermal-Resist', 'Kinetic-Resist', 'Energy-Resist', 'Explosive-Resist', 'EM-Resist', 'Psionic-Resist', 'Temporal-Resist', 'Void-Resist', 'Cosmic-Resist'],
  Special: ['Nanite-Boost', 'Quantum-Empower', 'Temporal-Phase', 'Dimensional-Shift', 'Reality-Anchor', 'Gravity-Stabilize', 'Overcharge', 'Synergy-Link', 'Evolution-Trigger'],
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6: DEBUFF TYPES (10 debuffs × 9 sub-debuffs = 90)
// ─────────────────────────────────────────────────────────────────────────────

export const DEBUFF_TYPES = {
  Damage: 'Damage',
  Weakening: 'Weakening',
  Disruption: 'Disruption',
  Impairment: 'Impairment',
  Overload: 'Overload',
  Drain: 'Drain',
  Breach: 'Breach',
  Control: 'Control',
  Exposure: 'Exposure',
  Systemic: 'Systemic',
} as const;

export type DebuffType = (typeof DEBUFF_TYPES)[keyof typeof DEBUFF_TYPES];

export const DEBUFF_SUB_TYPES: Record<DebuffType, string[]> = {
  Damage: ['Direct-Damage-Over-Time', 'Shield-Damage-Over-Time', 'Hull-Damage-Over-Time', 'Armor-Degradation', 'Structure-Weakening', 'Internal-Damage', 'Crew-Damage', 'System-Damage', 'Critical-Damage'],
  Weakening: ['Attack-Down', 'Defense-Down', 'Speed-Down', 'Accuracy-Down', 'Evasion-Down', 'Shield-Down', 'Armor-Down', 'Power-Down', 'Range-Down'],
  Disruption: ['Weapon-Jam', 'Shield-Interference', 'Engine-Stutter', 'Sensor-Blind', 'Comm-Break', 'Targeting-Fail', 'Power-Fluctuation', 'System-Freeze', 'Network-Disconnect'],
  Impairment: ['Slow', 'Stun', 'Root', 'Silence', 'Blind', 'Disarm', 'Confuse', 'Taunt', 'Fear'],
  Overload: ['Heat-Build-Up', 'Power-Spike', 'Shield-Collapse', 'Weapon-Overheat', 'Engine-Stall', 'Reactor-Meltdown-Threat', 'System-Burnout', 'Fuse-Blow', 'Circuit-Fry'],
  Drain: ['Energy-Drain', 'Shield-Drain', 'Fuel-Drain', 'Ammo-Drain', 'Crew-Exhaustion', 'Oxygen-Drain', 'Coolant-Drain', 'Nanite-Drain', 'Power-Drain'],
  Breach: ['Hull-Breach', 'Shield-Breach', 'Armor-Breach', 'Window-Breach', 'Containment-Breach', 'Reactor-Breach', 'Data-Breach', 'Bio-Breach', 'Dimensional-Breach'],
  Control: ['Hijack-Attempt', 'AI-Corruption', 'Crew-Mutiny', 'Navigation-Hijack', 'Weapon-Redirect', 'Sensor-Misdirect', 'System-Lockout', 'Access-Denied', 'Override-Fail'],
  Exposure: ['Radiation-Leak', 'Toxin-Spread', 'Fire-Outbreak', 'Vacuum-Exposure', 'Cosmic-Ray', 'Plasma-Vent', 'Gas-Leak', 'Bio-Contamination', 'Nanite-Corruption'],
  Systemic: ['Structural-Fatigue', 'System-Aging', 'Software-Corruption', 'Calibration-Drift', 'Synchronization-Error', 'Memory-Leak', 'Resource-Fragmentation', 'Efficiency-Loss', 'Entropy-Increase'],
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7: SHIP → TECH CLASS MAPPING
// Which tech classes are available for each ship class
// ─────────────────────────────────────────────────────────────────────────────

export const SHIP_TECH_ACCESS: Record<string, TechClass[]> = {
  // Light ships — limited tech classes
  Fighter:       ['Hull Systems', 'Weapon Systems', 'Propulsion', 'Power Core', 'Sensor Array'],
  Interceptor:   ['Hull Systems', 'Weapon Systems', 'Propulsion', 'Power Core', 'Electronic Warfare'],
  Bomber:        ['Hull Systems', 'Weapon Systems', 'Propulsion', 'Power Core', 'Cargo & Utility'],
  Corvette:      ['Hull Systems', 'Weapon Systems', 'Propulsion', 'Power Core', 'Sensor Array', 'Electronic Warfare'],
  // Medium ships — moderate access
  Frigate:       ['Hull Systems', 'Shield Systems', 'Weapon Systems', 'Propulsion', 'Power Core', 'Sensor Array', 'Life Support'],
  Destroyer:     ['Hull Systems', 'Shield Systems', 'Weapon Systems', 'Propulsion', 'Power Core', 'Sensor Array', 'Electronic Warfare'],
  // Heavy/Capital ships — broad access
  Cruiser:       ['Hull Systems', 'Shield Systems', 'Weapon Systems', 'Propulsion', 'Power Core', 'Sensor Array', 'Electronic Warfare', 'Life Support'],
  Battlecruiser: ['Hull Systems', 'Shield Systems', 'Weapon Systems', 'Propulsion', 'Power Core', 'Sensor Array', 'Electronic Warfare', 'Life Support', 'Cargo & Utility'],
  Battleship:    ['Hull Systems', 'Shield Systems', 'Weapon Systems', 'Propulsion', 'Power Core', 'Sensor Array', 'Electronic Warfare', 'Life Support', 'Cargo & Utility'],
  Carrier:       ['Hull Systems', 'Shield Systems', 'Weapon Systems', 'Propulsion', 'Power Core', 'Sensor Array', 'Electronic Warfare', 'Life Support', 'Cargo & Utility'],
  // Super-heavy — full access
  Dreadnought:   ['Hull Systems', 'Shield Systems', 'Weapon Systems', 'Propulsion', 'Power Core', 'Sensor Array', 'Electronic Warfare', 'Life Support', 'Cargo & Utility', 'Special Systems'],
  Titan:         ['Hull Systems', 'Shield Systems', 'Weapon Systems', 'Propulsion', 'Power Core', 'Sensor Array', 'Electronic Warfare', 'Life Support', 'Cargo & Utility', 'Special Systems'],
  Mothership:    ['Hull Systems', 'Shield Systems', 'Weapon Systems', 'Propulsion', 'Power Core', 'Sensor Array', 'Electronic Warfare', 'Life Support', 'Cargo & Utility', 'Special Systems'],
  Flagship:      ['Hull Systems', 'Shield Systems', 'Weapon Systems', 'Propulsion', 'Power Core', 'Sensor Array', 'Electronic Warfare', 'Life Support', 'Cargo & Utility', 'Special Systems'],
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8: AGGREGATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export const ALL_TECH_CLASSIFICATIONS = {
  classes: Object.keys(TECH_SUB_CLASSES) as TechClass[],
  categories: Object.keys(TECH_SUB_CATEGORIES) as TechCategory[],
  types: Object.keys(TECH_SUB_TYPES) as TechType[],
  stats: Object.keys(TECH_SUB_STATS) as TechStat[],
  buffs: Object.keys(BUFF_SUB_TYPES) as BuffType[],
  debuffs: Object.keys(DEBUFF_SUB_TYPES) as DebuffType[],
};

export const TECH_CLASSIFICATION_COUNTS = {
  techClasses: Object.keys(TECH_CLASSES).length,
  techCategories: Object.keys(TECH_CATEGORIES).length,
  techTypes: Object.keys(TECH_TYPES).length,
  techStats: Object.keys(TECH_STATS).length,
  buffTypes: Object.keys(BUFF_TYPES).length,
  debuffTypes: Object.keys(DEBUFF_TYPES).length,
};

export const TOTAL_TECH_CLASSIFICATION_GROUPS =
  Object.keys(TECH_CLASSIFICATION_COUNTS).length;

// Get sub-items for a given parent
export function getTechSubClasses(parent: TechClass): string[] {
  return TECH_SUB_CLASSES[parent] ?? [];
}

export function getTechSubCategories(parent: TechCategory): string[] {
  return TECH_SUB_CATEGORIES[parent] ?? [];
}

export function getTechSubTypes(parent: TechType): string[] {
  return TECH_SUB_TYPES[parent] ?? [];
}

export function getTechSubStats(parent: TechStat): string[] {
  return TECH_SUB_STATS[parent] ?? [];
}

export function getBuffSubTypes(parent: BuffType): string[] {
  return BUFF_SUB_TYPES[parent] ?? [];
}

export function getDebuffSubTypes(parent: DebuffType): string[] {
  return DEBUFF_SUB_TYPES[parent] ?? [];
}

// Compute total entries across all axes (parent × child)
export function getTotalTechEntries(): number {
  let total = 0;
  for (const subs of Object.values(TECH_SUB_CLASSES)) total += subs.length;
  for (const subs of Object.values(TECH_SUB_CATEGORIES)) total += subs.length;
  for (const subs of Object.values(TECH_SUB_TYPES)) total += subs.length;
  for (const subs of Object.values(TECH_SUB_STATS)) total += subs.length;
  for (const subs of Object.values(BUFF_SUB_TYPES)) total += subs.length;
  for (const subs of Object.values(DEBUFF_SUB_TYPES)) total += subs.length;
  return total;
}
