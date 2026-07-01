export const technologyCategories = [
  { id: 'all', name: 'All Technologies', icon: 'ri-apps-line', color: 'cyan' },
  { id: 'basic', name: 'Basic Research', icon: 'ri-flask-line', color: 'blue' },
  { id: 'combat', name: 'Combat Systems', icon: 'ri-sword-line', color: 'red' },
  { id: 'drive', name: 'Propulsion', icon: 'ri-rocket-line', color: 'purple' },
  { id: 'research', name: 'Advanced Research', icon: 'ri-microscope-line', color: 'green' },
  { id: 'defense', name: 'Defense Systems', icon: 'ri-shield-line', color: 'emerald' },
  { id: 'production', name: 'Production', icon: 'ri-building-4-line', color: 'amber' },
  { id: 'exotic', name: 'Exotic Technologies', icon: 'ri-star-line', color: 'pink' }
];

export const allTechnologies = [
  // BASIC RESEARCH (Tier 1-5)
  {
    id: 'energy_technology',
    name: 'Energy Technology',
    category: 'basic',
    tier: 1,
    maxLevel: 50,
    description: 'Improves energy production efficiency and unlocks advanced power systems',
    baseCost: { metal: 0, crystal: 800, deuterium: 400, antimatter: 0 },
    baseTime: 2730,
    unlocks: ['Laser Technology', 'Ion Technology', 'Plasma Technology'],
    icon: 'ri-flashlight-line',
    color: 'yellow',
    bonuses: ['+10% Energy Production per level', '+5% Power Efficiency']
  },
  {
    id: 'computer_technology',
    name: 'Computer Technology',
    category: 'basic',
    tier: 2,
    maxLevel: 50,
    description: 'Increases maximum fleet slots and improves targeting systems',
    baseCost: { metal: 0, crystal: 400, deuterium: 600, antimatter: 0 },
    baseTime: 3160,
    unlocks: ['Astrophysics', 'Espionage Technology'],
    icon: 'ri-cpu-line',
    color: 'cyan',
    bonuses: ['+1 Fleet Slot per level', '+2% Targeting Accuracy']
  },
  {
    id: 'fusion_technology',
    name: 'Fusion Technology',
    category: 'basic',
    tier: 3,
    maxLevel: 40,
    description: 'Advanced fusion reactors for massive energy generation',
    baseCost: { metal: 0, crystal: 1600, deuterium: 800, antimatter: 0 },
    baseTime: 4200,
    unlocks: ['Antimatter Technology', 'Zero-Point Energy'],
    icon: 'ri-fire-line',
    color: 'orange',
    bonuses: ['+15% Fusion Reactor Output', '+8% Energy Efficiency']
  },
  {
    id: 'antimatter_technology',
    name: 'Antimatter Technology',
    category: 'basic',
    tier: 4,
    maxLevel: 30,
    description: 'Harness the power of antimatter for incredible energy output',
    baseCost: { metal: 0, crystal: 5000, deuterium: 3000, antimatter: 100 },
    baseTime: 7200,
    unlocks: ['Dark Matter Technology', 'Quantum Technology'],
    icon: 'ri-contrast-2-line',
    color: 'purple',
    bonuses: ['+25% Antimatter Production', '+10% Reactor Efficiency']
  },
  {
    id: 'dark_matter_technology',
    name: 'Dark Matter Technology',
    category: 'exotic',
    tier: 5,
    maxLevel: 25,
    description: 'Manipulate dark matter for exotic applications',
    baseCost: { metal: 0, crystal: 10000, deuterium: 8000, antimatter: 500 },
    baseTime: 14400,
    unlocks: ['Dimensional Technology', 'Reality Bending'],
    icon: 'ri-contrast-drop-line',
    color: 'violet',
    bonuses: ['+30% Dark Matter Collection', '+15% Exotic Research Speed']
  },

  // COMBAT SYSTEMS (Tier 1-5)
  {
    id: 'laser_technology',
    name: 'Laser Technology',
    category: 'combat',
    tier: 1,
    maxLevel: 50,
    description: 'Enhances laser weapon systems and defensive capabilities',
    baseCost: { metal: 200, crystal: 100, deuterium: 0, antimatter: 0 },
    baseTime: 1935,
    unlocks: ['Plasma Technology', 'Ion Technology'],
    icon: 'ri-flashlight-fill',
    color: 'red',
    bonuses: ['+10% Laser Damage', '+5% Laser Accuracy']
  },
  {
    id: 'ion_technology',
    name: 'Ion Technology',
    category: 'combat',
    tier: 2,
    maxLevel: 50,
    description: 'Develops ion-based weapons with shield-penetrating capabilities',
    baseCost: { metal: 1000, crystal: 300, deuterium: 100, antimatter: 0 },
    baseTime: 4365,
    unlocks: ['Plasma Technology', 'Graviton Technology'],
    icon: 'ri-thunderstorms-line',
    color: 'blue',
    bonuses: ['+12% Ion Damage', '+20% Shield Penetration']
  },
  {
    id: 'plasma_technology',
    name: 'Plasma Technology',
    category: 'combat',
    tier: 3,
    maxLevel: 40,
    description: 'Advanced plasma weapons dealing massive damage',
    baseCost: { metal: 2000, crystal: 4000, deuterium: 1000, antimatter: 0 },
    baseTime: 6300,
    unlocks: ['Graviton Technology', 'Quantum Weapons'],
    icon: 'ri-fire-fill',
    color: 'orange',
    bonuses: ['+15% Plasma Damage', '+10% Armor Penetration']
  },
  {
    id: 'graviton_technology',
    name: 'Graviton Technology',
    category: 'combat',
    tier: 4,
    maxLevel: 30,
    description: 'Manipulate gravity for devastating weapons and defenses',
    baseCost: { metal: 0, crystal: 20000, deuterium: 15000, antimatter: 1000 },
    baseTime: 10800,
    unlocks: ['Quantum Weapons', 'Reality Weapons'],
    icon: 'ri-planet-fill',
    color: 'purple',
    bonuses: ['+20% Graviton Damage', '+15% Area Effect']
  },
  {
    id: 'quantum_weapons',
    name: 'Quantum Weapons',
    category: 'combat',
    tier: 5,
    maxLevel: 25,
    description: 'Quantum-based weapons that ignore conventional defenses',
    baseCost: { metal: 0, crystal: 50000, deuterium: 40000, antimatter: 5000 },
    baseTime: 21600,
    unlocks: ['Reality Weapons', 'Dimensional Weapons'],
    icon: 'ri-flashlight-fill',
    color: 'cyan',
    bonuses: ['+30% Quantum Damage', '+25% Defense Bypass']
  },
  {
    id: 'weapons_technology',
    name: 'Weapons Technology',
    category: 'combat',
    tier: 1,
    maxLevel: 50,
    description: 'Increases damage output of all offensive weapons',
    baseCost: { metal: 800, crystal: 200, deuterium: 0, antimatter: 0 },
    baseTime: 3920,
    unlocks: ['Advanced Weapons', 'Precision Targeting'],
    icon: 'ri-sword-line',
    color: 'red',
    bonuses: ['+10% All Weapon Damage', '+5% Critical Chance']
  },

  // DEFENSE SYSTEMS (Tier 1-4)
  {
    id: 'shielding_technology',
    name: 'Shielding Technology',
    category: 'defense',
    tier: 1,
    maxLevel: 50,
    description: 'Strengthens defensive shields on ships and structures',
    baseCost: { metal: 200, crystal: 600, deuterium: 0, antimatter: 0 },
    baseTime: 2895,
    unlocks: ['Advanced Shields', 'Regenerative Shields'],
    icon: 'ri-shield-line',
    color: 'blue',
    bonuses: ['+10% Shield Strength', '+5% Shield Regeneration']
  },
  {
    id: 'armor_technology',
    name: 'Armor Technology',
    category: 'defense',
    tier: 1,
    maxLevel: 50,
    description: 'Improves hull integrity and damage resistance',
    baseCost: { metal: 1000, crystal: 0, deuterium: 0, antimatter: 0 },
    baseTime: 3330,
    unlocks: ['Advanced Armor', 'Reactive Armor'],
    icon: 'ri-shield-check-line',
    color: 'gray',
    bonuses: ['+10% Armor Rating', '+5% Damage Reduction']
  },
  {
    id: 'regeneration_technology',
    name: 'Regeneration Technology',
    category: 'defense',
    tier: 3,
    maxLevel: 30,
    description: 'Nanite-based systems that repair damage in real-time',
    baseCost: { metal: 5000, crystal: 8000, deuterium: 2000, antimatter: 500 },
    baseTime: 9000,
    unlocks: ['Nanite Technology', 'Self-Repair Systems'],
    icon: 'ri-heart-pulse-line',
    color: 'green',
    bonuses: ['+15% Hull Regeneration', '+10% Shield Regeneration']
  },
  {
    id: 'cloaking_technology',
    name: 'Cloaking Technology',
    category: 'defense',
    tier: 4,
    maxLevel: 25,
    description: 'Advanced stealth systems making ships nearly invisible',
    baseCost: { metal: 10000, crystal: 15000, deuterium: 8000, antimatter: 2000 },
    baseTime: 12600,
    unlocks: ['Perfect Cloak', 'Phase Shifting'],
    icon: 'ri-eye-off-line',
    color: 'purple',
    bonuses: ['+20% Stealth Rating', '+15% Evasion']
  },

  // PROPULSION (Tier 1-5)
  {
    id: 'combustion_drive',
    name: 'Combustion Drive',
    category: 'drive',
    tier: 1,
    maxLevel: 50,
    description: 'Increases speed of ships using combustion engines',
    baseCost: { metal: 400, crystal: 0, deuterium: 600, antimatter: 0 },
    baseTime: 3500,
    unlocks: ['Impulse Drive', 'Advanced Propulsion'],
    icon: 'ri-rocket-line',
    color: 'orange',
    bonuses: ['+10% Combustion Ship Speed', '+5% Fuel Efficiency']
  },
  {
    id: 'impulse_drive',
    name: 'Impulse Drive',
    category: 'drive',
    tier: 2,
    maxLevel: 50,
    description: 'Improves impulse engine efficiency for medium ships',
    baseCost: { metal: 2000, crystal: 4000, deuterium: 600, antimatter: 0 },
    baseTime: 6300,
    unlocks: ['Hyperspace Drive', 'Warp Drive'],
    icon: 'ri-rocket-2-line',
    color: 'cyan',
    bonuses: ['+12% Impulse Ship Speed', '+8% Maneuverability']
  },
  {
    id: 'hyperspace_technology',
    name: 'Hyperspace Technology',
    category: 'drive',
    tier: 3,
    maxLevel: 40,
    description: 'Enables faster-than-light travel and reduces fleet travel time',
    baseCost: { metal: 0, crystal: 4000, deuterium: 2000, antimatter: 0 },
    baseTime: 9000,
    unlocks: ['Hyperspace Drive', 'Wormhole Technology'],
    icon: 'ri-space-ship-line',
    color: 'purple',
    bonuses: ['+15% Hyperspace Ship Speed', '+10% Travel Time Reduction']
  },
  {
    id: 'wormhole_technology',
    name: 'Wormhole Technology',
    category: 'drive',
    tier: 4,
    maxLevel: 30,
    description: 'Create stable wormholes for instant travel across vast distances',
    baseCost: { metal: 0, crystal: 30000, deuterium: 25000, antimatter: 3000 },
    baseTime: 18000,
    unlocks: ['Dimensional Travel', 'Quantum Tunneling'],
    icon: 'ri-contrast-drop-line',
    color: 'violet',
    bonuses: ['+25% Wormhole Stability', '+20% Travel Range']
  },
  {
    id: 'dimensional_technology',
    name: 'Dimensional Technology',
    category: 'exotic',
    tier: 5,
    maxLevel: 20,
    description: 'Travel through alternate dimensions for unprecedented speed',
    baseCost: { metal: 0, crystal: 100000, deuterium: 80000, antimatter: 10000 },
    baseTime: 36000,
    unlocks: ['Reality Bending', 'Time Manipulation'],
    icon: 'ri-space-ship-line',
    color: 'pink',
    bonuses: ['+40% Dimensional Ship Speed', '+30% Phase Shift Ability']
  },

  // ADVANCED RESEARCH (Tier 1-5)
  {
    id: 'espionage_technology',
    name: 'Espionage Technology',
    category: 'research',
    tier: 1,
    maxLevel: 50,
    description: 'Enhances spy probe capabilities and counter-intelligence',
    baseCost: { metal: 200, crystal: 1000, deuterium: 200, antimatter: 0 },
    baseTime: 2430,
    unlocks: ['Advanced Sensors', 'Infiltration Systems'],
    icon: 'ri-user-search-line',
    color: 'green',
    bonuses: ['+10% Spy Success Rate', '+5% Counter-Intelligence']
  },
  {
    id: 'astrophysics',
    name: 'Astrophysics',
    category: 'research',
    tier: 2,
    maxLevel: 40,
    description: 'Allows colonization of additional planets and expeditions',
    baseCost: { metal: 4000, crystal: 8000, deuterium: 4000, antimatter: 0 },
    baseTime: 11700,
    unlocks: ['Colonization Technology', 'Expedition Technology'],
    icon: 'ri-planet-line',
    color: 'purple',
    bonuses: ['+1 Colony Slot per 2 levels', '+10% Expedition Success']
  },
  {
    id: 'colonization_technology',
    name: 'Colonization Technology',
    category: 'research',
    tier: 3,
    maxLevel: 30,
    description: 'Advanced colonization techniques for hostile environments',
    baseCost: { metal: 10000, crystal: 15000, deuterium: 8000, antimatter: 500 },
    baseTime: 15000,
    unlocks: ['Terraforming Technology', 'Planetary Engineering'],
    icon: 'ri-earth-line',
    color: 'green',
    bonuses: ['+15% Colony Growth Rate', '+10% Resource Production']
  },
  {
    id: 'terraforming_technology',
    name: 'Terraforming Technology',
    category: 'research',
    tier: 4,
    maxLevel: 25,
    description: 'Transform uninhabitable planets into thriving worlds',
    baseCost: { metal: 20000, crystal: 30000, deuterium: 15000, antimatter: 2000 },
    baseTime: 21600,
    unlocks: ['Planetary Engineering', 'Megastructures'],
    icon: 'ri-global-line',
    color: 'emerald',
    bonuses: ['+20% Terraforming Speed', '+15% Planet Quality']
  },
  {
    id: 'intergalactic_research',
    name: 'Intergalactic Research Network',
    category: 'research',
    tier: 5,
    maxLevel: 20,
    description: 'Connect research facilities across galaxies for exponential progress',
    baseCost: { metal: 50000, crystal: 80000, deuterium: 40000, antimatter: 5000 },
    baseTime: 43200,
    unlocks: ['Universal Knowledge', 'Omniscience'],
    icon: 'ri-global-line',
    color: 'cyan',
    bonuses: ['+30% All Research Speed', '+20% Technology Efficiency']
  },

  // PRODUCTION (Tier 1-4)
  {
    id: 'mining_technology',
    name: 'Mining Technology',
    category: 'production',
    tier: 1,
    maxLevel: 50,
    description: 'Improves mining efficiency and resource extraction',
    baseCost: { metal: 1000, crystal: 500, deuterium: 0, antimatter: 0 },
    baseTime: 3000,
    unlocks: ['Advanced Mining', 'Deep Core Extraction'],
    icon: 'ri-hammer-line',
    color: 'amber',
    bonuses: ['+10% Mining Output', '+5% Resource Quality']
  },
  {
    id: 'production_technology',
    name: 'Production Technology',
    category: 'production',
    tier: 2,
    maxLevel: 50,
    description: 'Enhances factory output and construction speed',
    baseCost: { metal: 2000, crystal: 1000, deuterium: 500, antimatter: 0 },
    baseTime: 4500,
    unlocks: ['Mass Production', 'Automated Factories'],
    icon: 'ri-building-4-line',
    color: 'orange',
    bonuses: ['+12% Production Speed', '+8% Construction Efficiency']
  },
  {
    id: 'nanite_technology',
    name: 'Nanite Technology',
    category: 'production',
    tier: 3,
    maxLevel: 30,
    description: 'Microscopic robots that revolutionize construction and repair',
    baseCost: { metal: 15000, crystal: 20000, deuterium: 10000, antimatter: 1000 },
    baseTime: 18000,
    unlocks: ['Self-Replicating Nanites', 'Molecular Assembly'],
    icon: 'ri-bug-line',
    color: 'purple',
    bonuses: ['+20% Construction Speed', '+15% Repair Rate']
  },
  {
    id: 'logistics_technology',
    name: 'Logistics Technology',
    category: 'production',
    tier: 4,
    maxLevel: 25,
    description: 'Optimize resource distribution and fleet coordination',
    baseCost: { metal: 25000, crystal: 30000, deuterium: 15000, antimatter: 2000 },
    baseTime: 25200,
    unlocks: ['Quantum Logistics', 'Instant Transfer'],
    icon: 'ri-truck-line',
    color: 'cyan',
    bonuses: ['+25% Resource Transfer Speed', '+20% Fleet Efficiency']
  },

  // EXOTIC TECHNOLOGIES (Tier 5-6)
  {
    id: 'quantum_technology',
    name: 'Quantum Technology',
    category: 'exotic',
    tier: 5,
    maxLevel: 20,
    description: 'Harness quantum mechanics for incredible technological advances',
    baseCost: { metal: 0, crystal: 60000, deuterium: 50000, antimatter: 8000 },
    baseTime: 28800,
    unlocks: ['Quantum Computing', 'Quantum Entanglement'],
    icon: 'ri-contrast-2-line',
    color: 'cyan',
    bonuses: ['+35% Quantum Research Speed', '+25% Computing Power']
  },
  {
    id: 'time_manipulation',
    name: 'Time Manipulation',
    category: 'exotic',
    tier: 6,
    maxLevel: 15,
    description: 'Bend the fabric of time itself for strategic advantages',
    baseCost: { metal: 0, crystal: 200000, deuterium: 150000, antimatter: 20000 },
    baseTime: 72000,
    unlocks: ['Time Dilation', 'Temporal Shields'],
    icon: 'ri-time-line',
    color: 'purple',
    bonuses: ['+50% Time Dilation Effect', '+30% Temporal Stability']
  },
  {
    id: 'reality_bending',
    name: 'Reality Bending',
    category: 'exotic',
    tier: 6,
    maxLevel: 10,
    description: 'Manipulate the very fabric of reality for godlike power',
    baseCost: { metal: 0, crystal: 500000, deuterium: 400000, antimatter: 50000 },
    baseTime: 144000,
    unlocks: ['Reality Manipulation', 'Universal Control'],
    icon: 'ri-magic-line',
    color: 'pink',
    bonuses: ['+100% Reality Manipulation', '+50% Universal Power']
  },
  {
    id: 'expedition_technology',
    name: 'Expedition Technology',
    category: 'research',
    tier: 3,
    maxLevel: 35,
    description: 'Improve expedition success rates and rewards',
    baseCost: { metal: 5000, crystal: 10000, deuterium: 5000, antimatter: 200 },
    baseTime: 12000,
    unlocks: ['Deep Space Exploration', 'Artifact Discovery'],
    icon: 'ri-compass-3-line',
    color: 'amber',
    bonuses: ['+15% Expedition Success', '+20% Expedition Rewards']
  }
];

export const getTechnologyByCategory = (category: string) => {
  if (category === 'all') return allTechnologies;
  return allTechnologies.filter(tech => tech.category === category);
};

export const getTechnologyById = (id: string) => {
  return allTechnologies.find(tech => tech.id === id);
};

export const calculateTechCost = (baseCost: any, level: number) => {
  const multiplier = Math.pow(2, level);
  return {
    metal: Math.floor(baseCost.metal * multiplier),
    crystal: Math.floor(baseCost.crystal * multiplier),
    deuterium: Math.floor(baseCost.deuterium * multiplier),
    antimatter: Math.floor(baseCost.antimatter * multiplier)
  };
};

export const calculateTechTime = (baseTime: number, level: number, labLevel: number = 1) => {
  const multiplier = Math.pow(2, level);
  const timeReduction = 1 - (labLevel * 0.02); // 2% reduction per lab level
  return Math.floor(baseTime * multiplier * timeReduction);
};
