// ═══════════════════════════════════════════════════════════════════════
// FOOD, WATER & DISEASE SYSTEM DATA
// Sci-Fi Colony Survival / Management Layer
// ═══════════════════════════════════════════════════════════════════════

export interface FoodSource {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: 'farm' | 'hydroponic' | 'synthetic' | 'imported' | 'algae';
  outputPerHour: number; // food units
  energyCost: number;
  waterCost: number;
  level: number;
  maxLevel: number;
  description: string;
  image: string;
  unlockResearch?: string;
}

export interface WaterSource {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: 'extractor' | 'recycler' | 'ice_miner' | 'atmospheric' | 'fusion';
  outputPerHour: number; // water units
  energyCost: number;
  level: number;
  maxLevel: number;
  description: string;
  image: string;
}

export interface Disease {
  id: string;
  name: string;
  icon: string;
  severity: 'minor' | 'moderate' | 'severe' | 'critical' | 'pandemic';
  color: string;
  glowColor: string;
  category: 'bacterial' | 'viral' | 'fungal' | 'parasitic' | 'radiation' | 'alien';
  spreadRate: number;   // 0–1, how fast it spreads between colonies
  mortalityRate: number;// 0–1, mortality per day if untreated
  productivityLoss: number; // 0–1, efficiency reduction
  foodConsumptionMod: number; // multiplier on food consumption
  waterConsumptionMod: number;
  symptoms: string[];
  treatment: string;
  treatmentCost: { metal: number; crystal: number; deuterium: number; imperial_credits: number };
  researchCure?: string; // Research tech that provides immunity
  description: string;
  infectedPlanet?: string;
  daysActive?: number;
  affectedPop?: number;
}

export interface NutritionStatus {
  foodLevel: number;       // 0–100, current food supply %
  waterLevel: number;      // 0–100, current water supply %
  foodTrend: 'surplus' | 'stable' | 'deficit' | 'critical';
  waterTrend: 'surplus' | 'stable' | 'deficit' | 'critical';
  populationNourished: number; // %
  populationHungry: number;
  populationDehydrated: number;
  moraleModifier: number;     // -50 to +20
  productivityModifier: number; // -50 to +20
  militaryReadiness: number;   // 0–100
}

export interface ColonyHealth {
  colonyId: string;
  colonyName: string;
  population: number;
  foodSurplus: number;   // per hour, can be negative
  waterSurplus: number;
  healthScore: number;   // 0–100
  diseases: string[];    // active disease IDs
  quarantined: boolean;
  sanitationLevel: number; // 0–100
  medicalCapacity: number; // 0–100
  image: string;
  type: string;
  coordinates: string;
}

// ─── FOOD SOURCES ────────────────────────────────────────────────────────────

export const FOOD_SOURCES: FoodSource[] = [
  {
    id: 'hydroponic_bay',
    name: 'Hydroponic Bay',
    icon: 'ri-plant-line',
    color: '#4ade80',
    category: 'hydroponic',
    outputPerHour: 420,
    energyCost: 85,
    waterCost: 120,
    level: 12,
    maxLevel: 30,
    description: 'Vertical farming towers growing engineered crops in nutrient solution. No soil required — operates on any colony type.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20hydroponic%20farming%20facility%20interior%20sci-fi%20space%20station%20glowing%20LED%20grow%20lights%20vertical%20green%20plant%20towers%20lush%20vegetation%20space%20colony%20artificial%20sunlight%20clean%20white%20metallic%20interior%20highly%20detailed%20concept%20art&width=400&height=240&seq=food_hydro_01&orientation=landscape',
    unlockResearch: 'advanced_agriculture',
  },
  {
    id: 'algae_reactor',
    name: 'Algae Bioreactor',
    icon: 'ri-leaf-line',
    color: '#86efac',
    category: 'algae',
    outputPerHour: 680,
    energyCost: 120,
    waterCost: 80,
    level: 8,
    maxLevel: 25,
    description: 'Massive closed-loop bioreactor tanks fermenting high-protein spirulina and chlorella strains. Extremely efficient per square meter.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20algae%20bioreactor%20facility%20sci-fi%20large%20glowing%20green%20cylindrical%20tanks%20bioluminescent%20fluid%20pipework%20industrial%20space%20station%20interior%20highly%20detailed%20concept%20art&width=400&height=240&seq=food_algae_02&orientation=landscape',
  },
  {
    id: 'nano_fabricator',
    name: 'Nano Food Fabricator',
    icon: 'ri-cpu-line',
    color: '#67e8f9',
    category: 'synthetic',
    outputPerHour: 950,
    energyCost: 300,
    waterCost: 50,
    level: 6,
    maxLevel: 20,
    description: 'Molecular assembly units synthesize any food type from base atomic compounds. High energy cost but zero waste.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20food%20replicator%20nanofabrication%20machine%20sci-fi%20sleek%20metallic%20white%20chamber%20molecular%20assembly%20beams%20synthesizing%20glowing%20meal%20advanced%20technology%20space%20colony%20highly%20detailed%20concept%20art&width=400&height=240&seq=food_nano_03&orientation=landscape',
    unlockResearch: 'molecular_assembly',
  },
  {
    id: 'orbital_farm',
    name: 'Orbital Greenhouse',
    icon: 'ri-sun-line',
    color: '#fde68a',
    category: 'farm',
    outputPerHour: 560,
    energyCost: 40,
    waterCost: 160,
    level: 4,
    maxLevel: 15,
    description: 'Rotating orbital station with transparent domes capturing full-spectrum stellar light. Produces premium quality food with high morale bonus.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20orbital%20greenhouse%20space%20station%20rotating%20habitat%20transparent%20dome%20full%20of%20lush%20green%20plants%20crops%20flowers%20stellar%20light%20shining%20through%20glass%20sci-fi%20concept%20art%20highly%20detailed&width=400&height=240&seq=food_orbital_04&orientation=landscape',
  },
  {
    id: 'protein_vats',
    name: 'Protein Synthesis Vats',
    icon: 'ri-test-tube-line',
    color: '#c084fc',
    category: 'synthetic',
    outputPerHour: 1200,
    energyCost: 220,
    waterCost: 40,
    level: 15,
    maxLevel: 40,
    description: 'Industrial-scale cellular agriculture growing muscle tissue and protein matrices without animal suffering. Max-efficiency caloric output.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20protein%20synthesis%20laboratory%20large%20industrial%20vats%20growing%20cultured%20meat%20cellular%20agriculture%20space%20colony%20sci-fi%20bioluminescent%20tubes%20pipework%20highly%20detailed%20concept%20art&width=400&height=240&seq=food_protein_05&orientation=landscape',
    unlockResearch: 'bioengineering',
  },
  {
    id: 'trade_imports',
    name: 'Food Import Terminal',
    icon: 'ri-ship-line',
    color: '#fb923c',
    category: 'imported',
    outputPerHour: 800,
    energyCost: 10,
    waterCost: 0,
    level: 1,
    maxLevel: 10,
    description: 'Automated cargo terminals receiving food shipments from allied colonies and trade partners. Reliable but dependent on trade routes.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20space%20cargo%20terminal%20docking%20port%20massive%20containers%20being%20unloaded%20from%20freighter%20ships%20space%20colony%20food%20import%20facility%20highly%20detailed%20sci-fi%20concept%20art&width=400&height=240&seq=food_import_06&orientation=landscape',
  },
];

// ─── WATER SOURCES ───────────────────────────────────────────────────────────

export const WATER_SOURCES: WaterSource[] = [
  {
    id: 'deep_extractor',
    name: 'Deep Core Extractor',
    icon: 'ri-drop-line',
    color: '#38bdf8',
    category: 'extractor',
    outputPerHour: 540,
    energyCost: 70,
    level: 14,
    maxLevel: 30,
    description: 'Drilling kilometers into the mantle, tapping subsurface aquifers and releasing bound water molecules from deep rock formations.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20deep%20drilling%20planetary%20water%20extractor%20massive%20industrial%20machine%20boring%20into%20alien%20planet%20surface%20mineral%20water%20extraction%20sci-fi%20highly%20detailed%20concept%20art%20dark%20rocky%20landscape&width=400&height=240&seq=water_extract_01&orientation=landscape',
  },
  {
    id: 'atmospheric_condenser',
    name: 'Atmospheric Condenser',
    icon: 'ri-cloud-line',
    color: '#7dd3fc',
    category: 'atmospheric',
    outputPerHour: 320,
    energyCost: 45,
    level: 9,
    maxLevel: 25,
    description: 'Enormous cooling arrays that condense water vapor from planetary atmospheres. Extremely efficient on humid or ocean worlds.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20atmospheric%20water%20condenser%20massive%20cooling%20towers%20collecting%20condensation%20from%20alien%20planet%20atmosphere%20sci-fi%20humidity%20extraction%20facility%20misty%20cloud%20landscape%20highly%20detailed%20concept%20art&width=400&height=240&seq=water_atm_02&orientation=landscape',
  },
  {
    id: 'ice_asteroid_miner',
    name: 'Ice Asteroid Miner',
    icon: 'ri-snowflake-line',
    color: '#bae6fd',
    category: 'ice_miner',
    outputPerHour: 900,
    energyCost: 150,
    level: 5,
    maxLevel: 20,
    description: 'Fleet of automated mining drones harvesting water-ice from nearby asteroid belts. High yield but vulnerable to solar flares.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20asteroid%20mining%20drones%20harvesting%20ice%20comet%20water%20extraction%20fleet%20sci-fi%20space%20operation%20ice%20rocks%20glowing%20robot%20machines%20cosmic%20debris%20highly%20detailed%20concept%20art&width=400&height=240&seq=water_ice_03&orientation=landscape',
  },
  {
    id: 'fusion_water_gen',
    name: 'Hydrogen Fusion Water Gen',
    icon: 'ri-flashlight-line',
    color: '#e0f2fe',
    category: 'fusion',
    outputPerHour: 1400,
    energyCost: 380,
    level: 3,
    maxLevel: 15,
    description: 'Transmutes hydrogen fuel into H₂O via controlled fusion reactions. Most expensive per unit but produces ultra-pure water.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20hydrogen%20fusion%20water%20generation%20plant%20plasma%20containment%20chamber%20producing%20pure%20water%20vapor%20steam%20reaction%20sci-fi%20energy%20facility%20space%20colony%20highly%20detailed%20concept%20art%20glowing%20blue&width=400&height=240&seq=water_fusion_04&orientation=landscape',
  },
  {
    id: 'water_recycler',
    name: 'Grey Water Recycler',
    icon: 'ri-recycle-line',
    color: '#0ea5e9',
    category: 'recycler',
    outputPerHour: 480,
    energyCost: 30,
    level: 18,
    maxLevel: 35,
    description: 'Closed-loop biological water recycling system. Reclaims 97% of all waste water for re-use. Low cost, high sustainability.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20water%20recycling%20purification%20plant%20space%20colony%20closed%20loop%20bioreactor%20filtration%20system%20clean%20water%20treatment%20facility%20sci-fi%20interior%20blue%20light%20pipework%20highly%20detailed%20concept%20art&width=400&height=240&seq=water_recycle_05&orientation=landscape',
  },
];

// ─── DISEASES ────────────────────────────────────────────────────────────────

export const DISEASES: Disease[] = [
  {
    id: 'void_fever',
    name: 'Void Fever',
    icon: 'ri-virus-line',
    severity: 'severe',
    color: '#f87171',
    glowColor: 'rgba(248,113,113,0.3)',
    category: 'viral',
    spreadRate: 0.35,
    mortalityRate: 0.04,
    productivityLoss: 0.30,
    foodConsumptionMod: 1.5,
    waterConsumptionMod: 1.8,
    symptoms: ['High fever', 'Neural disruption', 'Gravitational sensitivity', 'Memory gaps'],
    treatment: 'Quantum-Antiviral Compound + Isolation Protocol',
    treatmentCost: { metal: 0, crystal: 15000, deuterium: 8000, imperial_credits: 75000 },
    description: 'A retroviral pathogen native to deep-space environments. Believed to originate from ancient alien ruin excavations. Causes severe neurological disruption and intense fever cycles.',
    infectedPlanet: 'Mining Colony Beta',
    daysActive: 7,
    affectedPop: 1240,
  },
  {
    id: 'crystal_blight',
    name: 'Crystal Blight',
    icon: 'ri-bug-line',
    severity: 'moderate',
    color: '#a78bfa',
    glowColor: 'rgba(167,139,250,0.3)',
    category: 'fungal',
    spreadRate: 0.18,
    mortalityRate: 0.01,
    productivityLoss: 0.20,
    foodConsumptionMod: 1.2,
    waterConsumptionMod: 1.1,
    symptoms: ['Crystalline skin deposits', 'Respiratory restriction', 'Slowed cognition'],
    treatment: 'Myco-Suppressor Spray + UV Decontamination',
    treatmentCost: { metal: 5000, crystal: 20000, deuterium: 0, imperial_credits: 40000 },
    description: 'A fungal pathogen that thrives in crystal-rich mineral environments. Spreads through spore inhalation. Causes unsightly but rarely fatal crystalline growths on skin and lung tissue.',
    infectedPlanet: 'Research Station Gamma',
    daysActive: 14,
    affectedPop: 380,
  },
  {
    id: 'nano_plague',
    name: 'Nano Plague',
    icon: 'ri-cpu-line',
    severity: 'critical',
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.3)',
    category: 'alien',
    spreadRate: 0.55,
    mortalityRate: 0.09,
    productivityLoss: 0.55,
    foodConsumptionMod: 2.0,
    waterConsumptionMod: 1.6,
    symptoms: ['Cybernetic implant malfunction', 'Neural hijacking', 'Erratic behavior', 'Internal bleeding'],
    treatment: 'EM Pulse Treatment + Neural Flush Protocol + Quarantine Level 4',
    treatmentCost: { metal: 25000, crystal: 30000, deuterium: 15000, imperial_credits: 200000 },
    researchCure: 'nano_immunity',
    description: 'A weaponized nano-pathogen of suspected alien wartime origin. Hijacks cybernetic implants and uses them to replicate, spreading electrically between connected networks. Extremely dangerous.',
    infectedPlanet: 'Outer Rim Post Delta',
    daysActive: 3,
    affectedPop: 5600,
  },
  {
    id: 'desert_fever',
    name: 'Sand Fever',
    icon: 'ri-temp-hot-line',
    severity: 'minor',
    color: '#fb923c',
    glowColor: 'rgba(251,146,60,0.3)',
    category: 'bacterial',
    spreadRate: 0.12,
    mortalityRate: 0.005,
    productivityLoss: 0.10,
    foodConsumptionMod: 1.1,
    waterConsumptionMod: 2.2,
    symptoms: ['Extreme dehydration', 'Heat exhaustion', 'Skin cracking', 'Electrolyte imbalance'],
    treatment: 'Electrolyte Rehydration + Antibacterial Serum',
    treatmentCost: { metal: 0, crystal: 5000, deuterium: 2000, imperial_credits: 15000 },
    description: 'A bacterial infection adapted to arid, high-temperature environments. Causes severe dehydration and dramatically increases water consumption. Common on desert and volcanic colony types.',
    daysActive: 21,
    affectedPop: 720,
  },
  {
    id: 'void_parasite',
    name: 'Void Parasite',
    icon: 'ri-sword-line',
    severity: 'pandemic',
    color: '#f43f5e',
    glowColor: 'rgba(244,63,94,0.4)',
    category: 'parasitic',
    spreadRate: 0.72,
    mortalityRate: 0.15,
    productivityLoss: 0.70,
    foodConsumptionMod: 3.0,
    waterConsumptionMod: 2.5,
    symptoms: ['Total organ failure cascade', 'External exoskeletal growth', 'Consciousness loss', 'Metabolic explosion'],
    treatment: 'EMERGENCY: Full Colony Quarantine + Quantum Purge Bomb + Evacuation Protocol',
    treatmentCost: { metal: 100000, crystal: 80000, deuterium: 50000, imperial_credits: 1000000 },
    researchCure: 'parasite_immunity_shield',
    description: 'The most feared pathogen in known space. A parasitic alien lifeform that rewrites the host\'s DNA to use them as a breeding vessel. Spreads rapidly between worlds via fleet travel. PANDEMIC level threat requiring immediate response.',
    infectedPlanet: 'Unknown Origin — SPREADING',
    daysActive: 1,
    affectedPop: 18500,
  },
  {
    id: 'radiation_sickness',
    name: 'Stellar Radiation Syndrome',
    icon: 'ri-radio-line',
    severity: 'moderate',
    color: '#34d399',
    glowColor: 'rgba(52,211,153,0.3)',
    category: 'radiation',
    spreadRate: 0.05,
    mortalityRate: 0.02,
    productivityLoss: 0.25,
    foodConsumptionMod: 1.3,
    waterConsumptionMod: 1.4,
    symptoms: ['Hair loss', 'Bone marrow suppression', 'Immune collapse', 'Cellular mutation'],
    treatment: 'Rad-Purge Injections + Lead-Lined Habitat Shielding',
    treatmentCost: { metal: 30000, crystal: 8000, deuterium: 5000, imperial_credits: 50000 },
    description: 'Caused by prolonged exposure to high-energy stellar radiation without adequate shielding. Common after solar flares or near neutron star systems. Not contagious but affects entire exposed populations simultaneously.',
    daysActive: 45,
    affectedPop: 2100,
  },
];

// ─── COLONY HEALTH DATA ───────────────────────────────────────────────────────

export const COLONY_HEALTH_DATA: ColonyHealth[] = [
  {
    colonyId: 'homeworld',
    colonyName: 'Homeworld Alpha',
    population: 4500000,
    foodSurplus: 1240,
    waterSurplus: 890,
    healthScore: 92,
    diseases: [],
    quarantined: false,
    sanitationLevel: 88,
    medicalCapacity: 95,
    image: 'https://readdy.ai/api/search-image?query=futuristic%20homeworld%20planet%20blue%20green%20thriving%20civilization%20advanced%20city%20lights%20atmosphere%20from%20space%20sci-fi%20concept%20art%20highly%20detailed%20beautiful%20lush&width=200&height=120&seq=ch_home&orientation=landscape',
    type: 'Terrestrial',
    coordinates: '[1:234:8]',
  },
  {
    colonyId: 'mining_beta',
    colonyName: 'Mining Colony Beta',
    population: 820000,
    foodSurplus: -180,
    waterSurplus: 220,
    healthScore: 54,
    diseases: ['void_fever'],
    quarantined: false,
    sanitationLevel: 45,
    medicalCapacity: 40,
    image: 'https://readdy.ai/api/search-image?query=futuristic%20desert%20mining%20colony%20planet%20orange%20dusty%20surface%20industrial%20structures%20cranes%20equipment%20sci-fi%20barren%20landscape%20from%20orbit%20highly%20detailed&width=200&height=120&seq=ch_mining&orientation=landscape',
    type: 'Desert',
    coordinates: '[1:234:12]',
  },
  {
    colonyId: 'research_gamma',
    colonyName: 'Research Station Gamma',
    population: 280000,
    foodSurplus: 340,
    waterSurplus: -90,
    healthScore: 68,
    diseases: ['crystal_blight'],
    quarantined: true,
    sanitationLevel: 72,
    medicalCapacity: 80,
    image: 'https://readdy.ai/api/search-image?query=futuristic%20volcanic%20research%20station%20colony%20lava%20rivers%20glowing%20magma%20dark%20rocky%20planet%20surface%20sci-fi%20space%20colony%20concept%20art%20highly%20detailed&width=200&height=120&seq=ch_research&orientation=landscape',
    type: 'Volcanic',
    coordinates: '[2:156:5]',
  },
  {
    colonyId: 'outer_rim_delta',
    colonyName: 'Outer Rim Post Delta',
    population: 120000,
    foodSurplus: -540,
    waterSurplus: -320,
    healthScore: 18,
    diseases: ['nano_plague'],
    quarantined: true,
    sanitationLevel: 20,
    medicalCapacity: 15,
    image: 'https://readdy.ai/api/search-image?query=futuristic%20abandoned%20outer%20rim%20space%20station%20dark%20cold%20icy%20barren%20asteroid%20desolate%20sci-fi%20highly%20detailed%20eerie%20atmosphere&width=200&height=120&seq=ch_outer&orientation=landscape',
    type: 'Barren',
    coordinates: '[7:891:3]',
  },
];

// ─── FOOD & WATER TREATMENT EVENTS ───────────────────────────────────────────

export interface SupplyEvent {
  id: string;
  type: 'food_crisis' | 'water_crisis' | 'disease_outbreak' | 'contamination' | 'windfall' | 'trade_disruption';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'danger' | 'critical';
  colony: string;
  timeAgo: string;
  icon: string;
  color: string;
  resolved: boolean;
}

export const SUPPLY_EVENTS: SupplyEvent[] = [
  {
    id: 'evt_001',
    type: 'disease_outbreak',
    title: 'Void Fever Outbreak Detected',
    description: 'Mining Colony Beta reports 1,240 workers infected with Void Fever. Productivity down 30%. Medical teams dispatched.',
    severity: 'danger',
    colony: 'Mining Colony Beta',
    timeAgo: '2 hours ago',
    icon: 'ri-virus-line',
    color: '#f87171',
    resolved: false,
  },
  {
    id: 'evt_002',
    type: 'food_crisis',
    title: 'Food Deficit Warning',
    description: 'Mining Colony Beta consuming 180 food units more per hour than current production. Reserves at 34%.',
    severity: 'warning',
    colony: 'Mining Colony Beta',
    timeAgo: '5 hours ago',
    icon: 'ri-restaurant-line',
    color: '#fbbf24',
    resolved: false,
  },
  {
    id: 'evt_003',
    type: 'contamination',
    title: 'Water Supply Contamination',
    description: 'Research Station Gamma water recyclers contaminated with crystal fungal spores. Purification systems online.',
    severity: 'warning',
    colony: 'Research Station Gamma',
    timeAgo: '1 day ago',
    icon: 'ri-drop-line',
    color: '#fb923c',
    resolved: false,
  },
  {
    id: 'evt_004',
    type: 'disease_outbreak',
    title: 'CRITICAL: Nano Plague Active',
    description: 'Outer Rim Post Delta in full Nano Plague crisis. 5,600+ infected. All traffic quarantined. Evacuation ordered.',
    severity: 'critical',
    colony: 'Outer Rim Post Delta',
    timeAgo: '3 hours ago',
    icon: 'ri-cpu-line',
    color: '#f43f5e',
    resolved: false,
  },
  {
    id: 'evt_005',
    type: 'windfall',
    title: 'Bumper Algae Harvest',
    description: 'Homeworld Alpha\'s algae bioreactors exceeded yield by 340% after quantum nutrient injection. 12h food surplus secured.',
    severity: 'info',
    colony: 'Homeworld Alpha',
    timeAgo: '6 hours ago',
    icon: 'ri-leaf-line',
    color: '#4ade80',
    resolved: true,
  },
  {
    id: 'evt_006',
    type: 'trade_disruption',
    title: 'Food Import Route Disrupted',
    description: 'Pirate activity near [7:891:3] has blocked two trade route convoys carrying food to Outer Rim Post Delta.',
    severity: 'danger',
    colony: 'Outer Rim Post Delta',
    timeAgo: '12 hours ago',
    icon: 'ri-ship-line',
    color: '#f87171',
    resolved: false,
  },
];

// ─── SANITATION UPGRADE SYSTEM ──────────────────────────────────────────────

export interface SanitationTier {
  tier: number;
  name: string;
  description: string;
  sanitationBonus: number;
  diseaseVulnerabilityMod: number;
  spreadRateReduction: number;
  mortalityReduction: number;
  costMetal: number;
  costCrystal: number;
  costCredits: number;
  icon: string;
  color: string;
}

export interface SanitationUpgrade {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: 'infrastructure' | 'biological' | 'nano' | 'environmental' | 'ai';
  description: string;
  longDesc: string;
  tiers: SanitationTier[];
  image: string;
  requiresUpgradeId?: string;
}

export interface ColonySanitationState {
  colonyId: string;
  upgradeLevel: Record<string, number>;
}

export const SANITATION_UPGRADES: SanitationUpgrade[] = [
  {
    id: 'waste_management',
    name: 'Waste Processing Grid',
    icon: 'ri-recycle-line',
    color: '#4ade80',
    category: 'infrastructure',
    description: 'Advanced waste neutralization and recycling infrastructure',
    longDesc: "Upgrades the colony's waste disposal network with high-capacity biological processors and plasma-torch incineration. Dramatically reduces the breeding ground for pathogens by eliminating organic waste buildup.",
    image: 'https://readdy.ai/api/search-image?query=futuristic%20waste%20processing%20facility%20space%20colony%20clean%20sterile%20environment%20robots%20automated%20recycling%20tubes%20pipework%20industrial%20sanitation%20interior%20highly%20detailed%20sci-fi%20concept%20art&width=480&height=260&seq=san_waste_01&orientation=landscape',
    tiers: [
      { tier: 1, name: 'Basic Filtration', description: 'Standard bio-filters installed colony-wide', sanitationBonus: 10, diseaseVulnerabilityMod: 0.92, spreadRateReduction: 0.03, mortalityReduction: 0.01, costMetal: 8000, costCrystal: 2000, costCredits: 20000, icon: 'ri-filter-line', color: '#86efac' },
      { tier: 2, name: 'Plasma Incineration', description: 'High-temp waste destruction with zero organic residue', sanitationBonus: 22, diseaseVulnerabilityMod: 0.82, spreadRateReduction: 0.07, mortalityReduction: 0.02, costMetal: 18000, costCrystal: 6000, costCredits: 55000, icon: 'ri-fire-line', color: '#fde68a' },
      { tier: 3, name: 'Quantum Purge Array', description: 'Molecular-level pathogen elimination across all waste streams', sanitationBonus: 40, diseaseVulnerabilityMod: 0.68, spreadRateReduction: 0.14, mortalityReduction: 0.04, costMetal: 40000, costCrystal: 18000, costCredits: 150000, icon: 'ri-flashlight-line', color: '#67e8f9' },
    ],
  },
  {
    id: 'water_purification',
    name: 'Water Purification Network',
    icon: 'ri-drop-line',
    color: '#38bdf8',
    category: 'infrastructure',
    description: 'Multi-stage water decontamination preventing waterborne diseases',
    longDesc: 'Installs a colony-wide tiered purification system: mechanical filters, UV sterilization chambers, and finally nano-membrane reverse osmosis. Eliminates over 99.9% of known waterborne pathogens at max tier.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20water%20purification%20plant%20space%20colony%20glowing%20blue%20tanks%20UV%20sterilization%20chambers%20clean%20water%20flowing%20pipework%20pristine%20sterile%20interior%20sci-fi%20highly%20detailed%20concept%20art&width=480&height=260&seq=san_water_02&orientation=landscape',
    tiers: [
      { tier: 1, name: 'UV Sterilization', description: 'Ultraviolet light treatment across main water channels', sanitationBonus: 8, diseaseVulnerabilityMod: 0.93, spreadRateReduction: 0.04, mortalityReduction: 0.01, costMetal: 5000, costCrystal: 4000, costCredits: 18000, icon: 'ri-sun-line', color: '#7dd3fc' },
      { tier: 2, name: 'Chemical Treatment', description: 'Advanced biochemical agents neutralize pathogens', sanitationBonus: 18, diseaseVulnerabilityMod: 0.83, spreadRateReduction: 0.08, mortalityReduction: 0.02, costMetal: 12000, costCrystal: 10000, costCredits: 45000, icon: 'ri-test-tube-line', color: '#38bdf8' },
      { tier: 3, name: 'Nano-Membrane RO', description: 'Atomic-scale reverse osmosis removing all biological contaminants', sanitationBonus: 35, diseaseVulnerabilityMod: 0.70, spreadRateReduction: 0.12, mortalityReduction: 0.035, costMetal: 30000, costCrystal: 25000, costCredits: 120000, icon: 'ri-drop-fill', color: '#0ea5e9' },
    ],
  },
  {
    id: 'quarantine_zones',
    name: 'Automated Quarantine Bays',
    icon: 'ri-shield-cross-line',
    color: '#fb923c',
    category: 'infrastructure',
    description: 'Sealed containment facilities that auto-detect and isolate infected individuals',
    longDesc: 'Constructs a network of smart biocontainment bays throughout the colony. Equipped with pathogen-sniffing sensors and airtight automated isolation chambers, they detect and quarantine infected individuals before outbreak spreads.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20quarantine%20isolation%20bay%20medical%20containment%20pods%20glowing%20orange%20barriers%20decontamination%20chambers%20space%20colony%20hospital%20interior%20sci-fi%20highly%20detailed%20concept%20art%20sterile%20white&width=480&height=260&seq=san_quarantine_03&orientation=landscape',
    tiers: [
      { tier: 1, name: 'Isolation Wards', description: 'Dedicated infected-patient isolation zones', sanitationBonus: 6, diseaseVulnerabilityMod: 0.95, spreadRateReduction: 0.05, mortalityReduction: 0.015, costMetal: 10000, costCrystal: 3000, costCredits: 25000, icon: 'ri-lock-line', color: '#fdba74' },
      { tier: 2, name: 'Biometric Scanners', description: 'AI-driven health scanners at all colony entry points', sanitationBonus: 16, diseaseVulnerabilityMod: 0.85, spreadRateReduction: 0.10, mortalityReduction: 0.025, costMetal: 22000, costCrystal: 12000, costCredits: 70000, icon: 'ri-eye-line', color: '#fb923c' },
      { tier: 3, name: 'Smart Containment Grid', description: 'Full-colony automated pathogen detection and room-by-room lockdown capability', sanitationBonus: 30, diseaseVulnerabilityMod: 0.72, spreadRateReduction: 0.18, mortalityReduction: 0.05, costMetal: 50000, costCrystal: 28000, costCredits: 200000, icon: 'ri-shield-check-line', color: '#f97316' },
    ],
  },
  {
    id: 'nano_cleaners',
    name: 'Nano-Cleaner Swarms',
    icon: 'ri-cpu-line',
    color: '#c084fc',
    category: 'nano',
    description: 'Microscopic robot swarms that continuously sanitize surfaces and air',
    longDesc: 'Deploys billions of nanoscale robotic sanitation units throughout the colony. These swarms continuously break down biological contaminants on surfaces, in air ducts, and in water supplies. Provides a passive continuous sanitation bonus.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20nano%20robot%20swarm%20cleaner%20microscopic%20machines%20sanitizing%20space%20station%20corridor%20glowing%20particles%20pathogen%20destruction%20advanced%20technology%20sci-fi%20concept%20art%20highly%20detailed%20purple%20energy&width=480&height=260&seq=san_nano_04&orientation=landscape',
    requiresUpgradeId: 'waste_management',
    tiers: [
      { tier: 1, name: 'Surface Cleaners', description: 'Nano-bots sanitize high-traffic surfaces and public areas', sanitationBonus: 12, diseaseVulnerabilityMod: 0.90, spreadRateReduction: 0.06, mortalityReduction: 0.012, costMetal: 15000, costCrystal: 20000, costCredits: 80000, icon: 'ri-robot-line', color: '#d8b4fe' },
      { tier: 2, name: 'Atmospheric Purge', description: 'Airborne nano-swarms eliminate floating pathogen particles', sanitationBonus: 26, diseaseVulnerabilityMod: 0.78, spreadRateReduction: 0.13, mortalityReduction: 0.03, costMetal: 35000, costCrystal: 45000, costCredits: 200000, icon: 'ri-tornado-line', color: '#c084fc' },
      { tier: 3, name: 'Bio-Matrix Integration', description: 'Nano-bots integrated into colony biology for zero-lag pathogen elimination', sanitationBonus: 45, diseaseVulnerabilityMod: 0.58, spreadRateReduction: 0.22, mortalityReduction: 0.06, costMetal: 80000, costCrystal: 100000, costCredits: 500000, icon: 'ri-dna-line', color: '#a855f7' },
    ],
  },
  {
    id: 'bio_shields',
    name: 'Biological Defense Shield',
    icon: 'ri-shield-flash-line',
    color: '#34d399',
    category: 'biological',
    description: 'Genetically engineered microbiome that actively repels invading pathogens',
    longDesc: "Introduces a carefully engineered synthetic microbiome into the colony's ecosystem. These friendly microorganisms outcompete and chemically repel invading pathogens, providing a living biological defense layer that grows stronger over time.",
    image: 'https://readdy.ai/api/search-image?query=futuristic%20biological%20defense%20shield%20force%20field%20organic%20glowing%20green%20barrier%20colony%20protection%20sci-fi%20microbiome%20energy%20concept%20art%20highly%20detailed%20emerald%20tones&width=480&height=260&seq=san_bio_05&orientation=landscape',
    requiresUpgradeId: 'water_purification',
    tiers: [
      { tier: 1, name: 'Probiotic Layer', description: 'Colony-wide probiotic microbiome seeding', sanitationBonus: 9, diseaseVulnerabilityMod: 0.91, spreadRateReduction: 0.05, mortalityReduction: 0.015, costMetal: 6000, costCrystal: 15000, costCredits: 60000, icon: 'ri-leaf-line', color: '#86efac' },
      { tier: 2, name: 'Adaptive Organisms', description: 'Engineered microbes that mutate to counter new pathogens', sanitationBonus: 22, diseaseVulnerabilityMod: 0.79, spreadRateReduction: 0.11, mortalityReduction: 0.03, costMetal: 15000, costCrystal: 35000, costCredits: 140000, icon: 'ri-flask-line', color: '#34d399' },
      { tier: 3, name: 'Living Aegis', description: 'Self-evolving defense microbiome with quantum-enhanced pathogen targeting', sanitationBonus: 42, diseaseVulnerabilityMod: 0.60, spreadRateReduction: 0.20, mortalityReduction: 0.055, costMetal: 40000, costCrystal: 80000, costCredits: 400000, icon: 'ri-shield-star-line', color: '#10b981' },
    ],
  },
  {
    id: 'ai_monitoring',
    name: 'AI Epidemiology Network',
    icon: 'ri-brain-line',
    color: '#67e8f9',
    category: 'ai',
    description: 'Predictive AI that forecasts outbreaks before they occur',
    longDesc: 'A colony-wide distributed AI system continuously analyzes biometric data, environmental readings, and population behavior to predict disease outbreaks up to 72 hours before they manifest. Enables pre-emptive response protocols.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20AI%20epidemiology%20monitoring%20network%20holographic%20displays%20medical%20data%20health%20analytics%20space%20colony%20command%20center%20sci-fi%20glowing%20cyan%20screens%20highly%20detailed%20concept%20art&width=480&height=260&seq=san_ai_06&orientation=landscape',
    tiers: [
      { tier: 1, name: 'Health Monitors', description: 'Real-time biometric tracking across colony population', sanitationBonus: 5, diseaseVulnerabilityMod: 0.94, spreadRateReduction: 0.04, mortalityReduction: 0.02, costMetal: 8000, costCrystal: 12000, costCredits: 45000, icon: 'ri-heart-pulse-line', color: '#a5f3fc' },
      { tier: 2, name: 'Predictive Analytics', description: '48-hour outbreak forecasting with automated alerts', sanitationBonus: 15, diseaseVulnerabilityMod: 0.84, spreadRateReduction: 0.09, mortalityReduction: 0.04, costMetal: 20000, costCrystal: 28000, costCredits: 110000, icon: 'ri-line-chart-line', color: '#22d3ee' },
      { tier: 3, name: 'Quantum Precognition', description: '72-hour pre-epidemic forecasting with auto-containment protocols', sanitationBonus: 32, diseaseVulnerabilityMod: 0.65, spreadRateReduction: 0.17, mortalityReduction: 0.065, costMetal: 50000, costCrystal: 65000, costCredits: 300000, icon: 'ri-radar-line', color: '#06b6d4' },
    ],
  },
];

export function computeSanitationStats(state: ColonySanitationState): {
  totalSanitationBonus: number;
  effectiveVulnerabilityMod: number;
  totalSpreadReduction: number;
  totalMortalityReduction: number;
  completedUpgrades: number;
  totalUpgrades: number;
} {
  let totalSanitationBonus = 0;
  let effectiveVulnerabilityMod = 1.0;
  let totalSpreadReduction = 0;
  let totalMortalityReduction = 0;
  let completedUpgrades = 0;
  const totalUpgrades = SANITATION_UPGRADES.length * 3;

  for (const upgrade of SANITATION_UPGRADES) {
    const level = state.upgradeLevel[upgrade.id] ?? 0;
    if (level > 0) {
      const tier = upgrade.tiers[level - 1];
      totalSanitationBonus += tier.sanitationBonus;
      effectiveVulnerabilityMod *= tier.diseaseVulnerabilityMod;
      totalSpreadReduction += tier.spreadRateReduction;
      totalMortalityReduction += tier.mortalityReduction;
      completedUpgrades += level;
    }
  }

  return { totalSanitationBonus, effectiveVulnerabilityMod, totalSpreadReduction, totalMortalityReduction, completedUpgrades, totalUpgrades };
}

// ─── BIO-RESEARCH LAB ────────────────────────────────────────────────────────

export type ResearchStatus = 'locked' | 'available' | 'researching' | 'completed';
export type ResearchCategory = 'immunity' | 'sanitation_tech' | 'genetics' | 'nano' | 'epidemiology' | 'pharmacology';

export interface BioResearch {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: ResearchCategory;
  tier: number; // 1 = foundation, 2 = advanced, 3 = elite
  description: string;
  longDesc: string;
  image: string;
  // Effects
  immunityAgainst?: string[];     // disease IDs that become immune
  sanitationBonus?: number;       // flat empire-wide sanitation
  spreadRateMod?: number;         // multiplier on all spread rates e.g. 0.8 = -20%
  mortalityMod?: number;          // multiplier on all mortality rates
  productivityBonus?: number;     // +% empire productivity
  unlocksSanitationUpgrade?: string; // unlocks a locked sanitation upgrade
  unlocksResearch?: string[];     // IDs of research this unlocks
  // Costs
  costMetal: number;
  costCrystal: number;
  costDeuterium: number;
  costCredits: number;
  researchTimeSecs: number;       // simulated research duration
  // Prerequisite
  requiresResearch?: string[];    // research IDs that must be completed first
  // Flavor
  discoveredBy?: string;
  labRequired?: string;
}

export interface BioResearchState {
  completedIds: string[];
  researchingId: string | null;
  researchStartTime: number | null; // ms timestamp
}

export const BIO_RESEARCH_TREE: BioResearch[] = [
  // ── TIER 1: Foundation ───────────────────────────────────────────────────
  {
    id: 'basic_immunology',
    name: 'Basic Immunology',
    icon: 'ri-shield-line',
    color: '#4ade80',
    category: 'immunity',
    tier: 1,
    description: 'Foundational study of empire-wide immune response enhancement',
    longDesc: 'Maps the immune system profiles of all colony populations and synthesizes a base-level immunity booster that reduces susceptibility to all known diseases. Required for all advanced immunity research.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20immunology%20laboratory%20sci-fi%20medical%20research%20glowing%20green%20vials%20DNA%20analysis%20holographic%20body%20scan%20space%20colony%20sterile%20white%20interior%20concept%20art%20highly%20detailed&width=480&height=260&seq=br_immuno_01&orientation=landscape',
    sanitationBonus: 5,
    spreadRateMod: 0.92,
    mortalityMod: 0.90,
    costMetal: 10000,
    costCrystal: 15000,
    costDeuterium: 5000,
    costCredits: 80000,
    researchTimeSecs: 12,
    discoveredBy: 'Dr. Yara Vex, Chief Xenobiologist',
  },
  {
    id: 'pathogen_database',
    name: 'Pathogen Genomic Database',
    icon: 'ri-database-2-line',
    color: '#38bdf8',
    category: 'epidemiology',
    tier: 1,
    description: 'Complete genetic mapping of all known pathogens in empire space',
    longDesc: 'Compiles a living database of all disease genomes, mutation vectors, and environmental triggers across empire space. Accelerates identification of new outbreaks and enables targeted treatments in 72% less time.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20genomic%20database%20holographic%20DNA%20sequences%20pathogen%20mapping%20sci-fi%20research%20laboratory%20data%20screens%20glowing%20cyan%20highly%20detailed%20concept%20art%20space%20colony&width=480&height=260&seq=br_db_02&orientation=landscape',
    spreadRateMod: 0.88,
    mortalityMod: 0.85,
    productivityBonus: 3,
    costMetal: 8000,
    costCrystal: 20000,
    costDeuterium: 8000,
    costCredits: 60000,
    researchTimeSecs: 10,
    unlocksResearch: ['nano_immunity', 'parasite_immunity_shield', 'viral_countermeasures'],
    discoveredBy: 'Xenobiology Division, Homeworld Alpha',
  },
  {
    id: 'advanced_pharmacology',
    name: 'Advanced Pharmacology',
    icon: 'ri-medicine-bottle-line',
    color: '#c084fc',
    category: 'pharmacology',
    tier: 1,
    description: 'Synthesize more effective treatments for existing diseases',
    longDesc: 'Develops next-generation pharmaceutical compounds that are 3x more effective at treating active outbreaks, cutting treatment costs by 40% and recovery time by half. Reduces mortality empire-wide.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20pharmaceutical%20laboratory%20sci-fi%20space%20colony%20synthesizing%20advanced%20medicine%20glowing%20purple%20vials%20robotic%20arms%20clean%20sterile%20room%20concept%20art%20highly%20detailed&width=480&height=260&seq=br_pharma_03&orientation=landscape',
    mortalityMod: 0.75,
    productivityBonus: 5,
    costMetal: 5000,
    costCrystal: 25000,
    costDeuterium: 10000,
    costCredits: 100000,
    researchTimeSecs: 14,
    unlocksResearch: ['bacterial_cure_all', 'fungal_eradication', 'radiation_therapy_v2'],
    discoveredBy: 'Imperial Pharmaceutical Institute',
  },
  {
    id: 'genetic_resilience',
    name: 'Genetic Resilience Program',
    icon: 'ri-dna-line',
    color: '#fb923c',
    category: 'genetics',
    tier: 1,
    description: 'Population-wide genetic optimization for environmental adaptability',
    longDesc: 'A voluntary colony-wide program that uses CRISPR-derived techniques to strengthen genetic resilience against radiation, toxins, and pathogen invasion. Long-term generational immunity enhancement.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20genetic%20engineering%20laboratory%20CRISPR%20DNA%20editing%20holographic%20strands%20glowing%20orange%20amber%20sci-fi%20space%20colony%20research%20facility%20concept%20art%20highly%20detailed&width=480&height=260&seq=br_gene_04&orientation=landscape',
    mortalityMod: 0.80,
    spreadRateMod: 0.90,
    sanitationBonus: 8,
    costMetal: 12000,
    costCrystal: 18000,
    costDeuterium: 12000,
    costCredits: 120000,
    researchTimeSecs: 16,
    unlocksResearch: ['superior_genome', 'alien_biology_adaptation'],
    discoveredBy: 'Xenogenetics Lab, Research Station Gamma',
  },

  // ── TIER 2: Advanced ─────────────────────────────────────────────────────
  {
    id: 'nano_immunity',
    name: 'Nano-Immunity Protocol',
    icon: 'ri-cpu-line',
    color: '#fbbf24',
    category: 'nano',
    tier: 2,
    description: 'Permanent nano-scale immunity against Nano Plague and cybernetic pathogens',
    longDesc: 'Engineers a self-replicating nano-antibody network that permanently integrates into colony infrastructure and cybernetic implants empire-wide. Provides complete immunity against Nano Plague and similar machine-borne pathogens.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20nano%20immunity%20network%20glowing%20golden%20nanobots%20circulating%20in%20bloodstream%20cybernetic%20implants%20protection%20sci-fi%20highly%20detailed%20concept%20art%20space%20colony%20medical&width=480&height=260&seq=br_nano_05&orientation=landscape',
    immunityAgainst: ['nano_plague'],
    sanitationBonus: 12,
    spreadRateMod: 0.85,
    costMetal: 30000,
    costCrystal: 40000,
    costDeuterium: 20000,
    costCredits: 300000,
    researchTimeSecs: 20,
    requiresResearch: ['pathogen_database'],
    discoveredBy: 'Dr. Kira Sholt, Nano-Biology Division',
  },
  {
    id: 'parasite_immunity_shield',
    name: 'Parasite Immunity Shield',
    icon: 'ri-shield-star-line',
    color: '#f43f5e',
    category: 'immunity',
    tier: 2,
    description: 'Permanent empire-wide immunity against Void Parasite — the deadliest known pathogen',
    longDesc: 'Develops a specialized bio-quantum shield that recognizes and immediately destroys Void Parasite genetic material on contact. Permanently immunizes all current and future colony populations against the Void Parasite — ending the pandemic threat once and for all.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20parasite%20immunity%20bio-quantum%20shield%20glowing%20crimson%20red%20protective%20barrier%20space%20colony%20DNA%20destruction%20pathogen%20elimination%20sci-fi%20highly%20detailed%20concept%20art%20cinematic&width=480&height=260&seq=br_para_06&orientation=landscape',
    immunityAgainst: ['void_parasite'],
    mortalityMod: 0.70,
    spreadRateMod: 0.80,
    costMetal: 80000,
    costCrystal: 60000,
    costDeuterium: 40000,
    costCredits: 800000,
    researchTimeSecs: 30,
    requiresResearch: ['pathogen_database', 'basic_immunology'],
    discoveredBy: 'Emergency Bio-Defense Council',
  },
  {
    id: 'viral_countermeasures',
    name: 'Viral Countermeasure Suite',
    icon: 'ri-virus-line',
    color: '#f87171',
    category: 'immunity',
    tier: 2,
    description: 'Broad-spectrum antiviral immunity including Void Fever',
    longDesc: 'A comprehensive antiviral research program producing a suite of RNA-interference vaccines and neural-protection compounds. Grants permanent immunity to Void Fever and Sand Fever, and dramatically reduces all viral spread rates.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20antiviral%20countermeasures%20lab%20glowing%20red%20orange%20vaccines%20neural%20protection%20compounds%20space%20colony%20sci-fi%20medical%20research%20facility%20concept%20art%20highly%20detailed&width=480&height=260&seq=br_viral_07&orientation=landscape',
    immunityAgainst: ['void_fever', 'desert_fever'],
    spreadRateMod: 0.75,
    mortalityMod: 0.80,
    costMetal: 25000,
    costCrystal: 35000,
    costDeuterium: 15000,
    costCredits: 250000,
    researchTimeSecs: 22,
    requiresResearch: ['pathogen_database'],
    unlocksResearch: ['pandemic_prevention_matrix'],
    discoveredBy: 'Viral Research Institute, Homeworld Alpha',
  },
  {
    id: 'bacterial_cure_all',
    name: 'Bacterial Cure-All Serum',
    icon: 'ri-test-tube-line',
    color: '#34d399',
    category: 'pharmacology',
    tier: 2,
    description: 'Universal antibacterial compound effective against all known bacterial strains',
    longDesc: 'Synthesizes a broad-spectrum antibacterial compound using quantum resonance chemistry. Effective against all known bacterial pathogens in empire space. Reduces bacterial disease severity to negligible levels.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20antibacterial%20serum%20universal%20cure%20glowing%20emerald%20green%20laboratory%20vials%20synthesizing%20sci-fi%20space%20colony%20medical%20research%20highly%20detailed%20concept%20art&width=480&height=260&seq=br_bact_08&orientation=landscape',
    immunityAgainst: ['desert_fever'],
    mortalityMod: 0.65,
    productivityBonus: 8,
    costMetal: 15000,
    costCrystal: 30000,
    costDeuterium: 12000,
    costCredits: 180000,
    researchTimeSecs: 18,
    requiresResearch: ['advanced_pharmacology'],
    discoveredBy: 'Dr. Maro Tesh, Biochemistry Lab',
  },
  {
    id: 'fungal_eradication',
    name: 'Fungal Eradication Protocol',
    icon: 'ri-bug-line',
    color: '#a78bfa',
    category: 'pharmacology',
    tier: 2,
    description: 'Total eradication of fungal pathogens including Crystal Blight',
    longDesc: 'Develops a potent myco-elimination enzyme that specifically targets and destroys all known fungal pathogens without harming beneficial microorganisms. Grants permanent immunity to Crystal Blight and similar fungal threats.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20fungal%20eradication%20laboratory%20purple%20violet%20glow%20enzyme%20synthesis%20anti-fungal%20compounds%20space%20colony%20sci-fi%20research%20concept%20art%20highly%20detailed&width=480&height=260&seq=br_fung_09&orientation=landscape',
    immunityAgainst: ['crystal_blight'],
    sanitationBonus: 10,
    spreadRateMod: 0.88,
    costMetal: 18000,
    costCrystal: 28000,
    costDeuterium: 8000,
    costCredits: 160000,
    researchTimeSecs: 16,
    requiresResearch: ['advanced_pharmacology'],
    discoveredBy: 'Research Station Gamma Mycology Lab',
  },
  {
    id: 'radiation_therapy_v2',
    name: 'Quantum Radiation Therapy',
    icon: 'ri-radio-line',
    color: '#34d399',
    category: 'pharmacology',
    tier: 2,
    description: 'Advanced radiation treatment and permanent shielding immunization',
    longDesc: 'Combines quantum-resonance radiation therapy with genetically-engineered cellular repair mechanisms. Provides permanent immunity to Stellar Radiation Syndrome and accelerates recovery from radiation events by 90%.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20radiation%20therapy%20chamber%20quantum%20healing%20green%20glow%20cellular%20regeneration%20space%20colony%20medical%20bay%20sci-fi%20concept%20art%20highly%20detailed&width=480&height=260&seq=br_rad_10&orientation=landscape',
    immunityAgainst: ['radiation_sickness'],
    mortalityMod: 0.72,
    sanitationBonus: 6,
    costMetal: 20000,
    costCrystal: 22000,
    costDeuterium: 18000,
    costCredits: 140000,
    researchTimeSecs: 15,
    requiresResearch: ['advanced_pharmacology'],
    discoveredBy: 'Imperial Radiation Safety Board',
  },
  {
    id: 'superior_genome',
    name: 'Superior Genome Project',
    icon: 'ri-hearts-line',
    color: '#f9a8d4',
    category: 'genetics',
    tier: 2,
    description: 'Population-wide genetic upgrade granting 40% disease resistance bonus',
    longDesc: 'A bold empire-wide voluntary genome enhancement initiative. Participating colonists receive targeted gene edits that boost immune response, cellular repair, and environmental tolerance across all disease categories.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20superior%20genome%20project%20genetic%20enhancement%20laboratory%20pink%20rose%20glowing%20DNA%20strands%20editing%20colonist%20enhancement%20space%20colony%20sci-fi%20concept%20art%20highly%20detailed&width=480&height=260&seq=br_sup_11&orientation=landscape',
    mortalityMod: 0.60,
    spreadRateMod: 0.78,
    sanitationBonus: 15,
    productivityBonus: 10,
    costMetal: 40000,
    costCrystal: 55000,
    costDeuterium: 25000,
    costCredits: 500000,
    researchTimeSecs: 28,
    requiresResearch: ['genetic_resilience'],
    unlocksResearch: ['transcendent_immunity'],
    discoveredBy: 'Imperial Genetics Commission',
  },
  {
    id: 'alien_biology_adaptation',
    name: 'Alien Biology Adaptation',
    icon: 'ri-aliens-line',
    color: '#67e8f9',
    category: 'genetics',
    tier: 2,
    description: 'Adapts colony biology against alien-origin pathogens',
    longDesc: 'Studies recovered alien biological samples to reverse-engineer pathogen attack vectors. Introduces alien-adapted gene sequences into colony populations, dramatically reducing susceptibility to alien-category diseases like Nano Plague and Void Parasite.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20alien%20biology%20adaptation%20laboratory%20exotic%20organisms%20glass%20containers%20glowing%20cyan%20alien%20DNA%20research%20xenobiology%20sci-fi%20space%20colony%20concept%20art%20highly%20detailed&width=480&height=260&seq=br_alien_12&orientation=landscape',
    spreadRateMod: 0.72,
    mortalityMod: 0.68,
    sanitationBonus: 12,
    costMetal: 35000,
    costCrystal: 50000,
    costDeuterium: 30000,
    costCredits: 450000,
    researchTimeSecs: 25,
    requiresResearch: ['genetic_resilience'],
    discoveredBy: 'Xenobiology Expedition Team Alpha-9',
  },

  // ── TIER 3: Elite ────────────────────────────────────────────────────────
  {
    id: 'pandemic_prevention_matrix',
    name: 'Pandemic Prevention Matrix',
    icon: 'ri-global-line',
    color: '#fbbf24',
    category: 'epidemiology',
    tier: 3,
    description: 'Empire-wide early warning system preventing any disease from reaching pandemic level',
    longDesc: 'A galaxy-spanning biomonitoring network combined with automated response protocols. Any emerging pathogen is detected within 6 hours of first contact and immediate containment is deployed — ensuring no disease ever reaches pandemic status again.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20pandemic%20prevention%20matrix%20global%20monitoring%20network%20galaxy-scale%20biosentinel%20stations%20glowing%20amber%20warning%20systems%20space%20colony%20command%20center%20sci-fi%20highly%20detailed%20concept%20art&width=480&height=260&seq=br_pand_13&orientation=landscape',
    spreadRateMod: 0.60,
    mortalityMod: 0.65,
    sanitationBonus: 20,
    productivityBonus: 12,
    costMetal: 100000,
    costCrystal: 120000,
    costDeuterium: 60000,
    costCredits: 1200000,
    researchTimeSecs: 40,
    requiresResearch: ['viral_countermeasures', 'nano_immunity'],
    discoveredBy: 'Imperial Pandemic Response Division',
  },
  {
    id: 'transcendent_immunity',
    name: 'Transcendent Immunity',
    icon: 'ri-award-line',
    color: '#fde68a',
    category: 'immunity',
    tier: 3,
    description: 'Near-total immunity to all known diseases — the pinnacle of bio-research',
    longDesc: 'The crown achievement of bio-research. Combines advanced genetics, nano-immunity, and pharmaceutical synthesis into a unified biological defense layer. Colony populations become virtually immune to all catalogued diseases with near-zero mortality rates.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20transcendent%20immunity%20golden%20light%20emanating%20from%20colonist%20divine%20health%20enhancement%20space%20colony%20ultimate%20medical%20achievement%20sci-fi%20dramatic%20golden%20glow%20concept%20art%20highly%20detailed%20cinematic&width=480&height=260&seq=br_trans_14&orientation=landscape',
    immunityAgainst: ['void_fever', 'crystal_blight', 'desert_fever', 'radiation_sickness'],
    spreadRateMod: 0.50,
    mortalityMod: 0.40,
    sanitationBonus: 30,
    productivityBonus: 20,
    costMetal: 200000,
    costCrystal: 250000,
    costDeuterium: 120000,
    costCredits: 3000000,
    researchTimeSecs: 60,
    requiresResearch: ['superior_genome', 'parasite_immunity_shield'],
    discoveredBy: 'Grand Academy of Imperial Sciences',
    labRequired: 'Tier-5 Research Complex',
  },
  {
    id: 'bio_ascendancy',
    name: 'Bio-Ascendancy Protocol',
    icon: 'ri-star-line',
    color: '#f9a8d4',
    category: 'genetics',
    tier: 3,
    description: 'The ultimate genetic evolution — colonists transcend biological vulnerability',
    longDesc: 'A visionary program that rewrites the fundamental biological architecture of empire populations. Colonists achieve a post-human level of disease resistance through synthetic biology, nano-integration, and quantum cellular repair — effectively ending natural disease death.',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20bio-ascendancy%20protocol%20ultimate%20human%20evolution%20glowing%20pink%20rose%20gold%20transcendence%20colonist%20transformation%20advanced%20biology%20space%20colony%20sci-fi%20cinematic%20concept%20art%20highly%20detailed%20epic&width=480&height=260&seq=br_asc_15&orientation=landscape',
    immunityAgainst: ['void_fever', 'crystal_blight', 'nano_plague', 'desert_fever', 'void_parasite', 'radiation_sickness'],
    spreadRateMod: 0.30,
    mortalityMod: 0.20,
    sanitationBonus: 40,
    productivityBonus: 25,
    costMetal: 500000,
    costCrystal: 400000,
    costDeuterium: 200000,
    costCredits: 5000000,
    researchTimeSecs: 90,
    requiresResearch: ['transcendent_immunity', 'alien_biology_adaptation', 'pandemic_prevention_matrix'],
    discoveredBy: 'The Ascendancy Council',
    labRequired: 'Grand Research Citadel',
  },
];

export const RESEARCH_CATEGORY_CONFIG: Record<ResearchCategory, { label: string; color: string; icon: string }> = {
  immunity:       { label: 'Immunity',      color: '#4ade80', icon: 'ri-shield-check-line' },
  sanitation_tech:{ label: 'Sanitation Tech',color: '#38bdf8', icon: 'ri-sparkling-2-line' },
  genetics:       { label: 'Genetics',      color: '#fb923c', icon: 'ri-dna-line' },
  nano:           { label: 'Nano-Biology',  color: '#c084fc', icon: 'ri-cpu-line' },
  epidemiology:   { label: 'Epidemiology',  color: '#fbbf24', icon: 'ri-radar-line' },
  pharmacology:   { label: 'Pharmacology',  color: '#a78bfa', icon: 'ri-medicine-bottle-line' },
};

export function computeBioResearchEffects(completedIds: string[]): {
  immuneDiseasIds: string[];
  spreadRateMod: number;
  mortalityMod: number;
  sanitationBonus: number;
  productivityBonus: number;
} {
  const immuneSet = new Set<string>();
  let spreadRateMod = 1.0;
  let mortalityMod = 1.0;
  let sanitationBonus = 0;
  let productivityBonus = 0;

  for (const id of completedIds) {
    const r = BIO_RESEARCH_TREE.find(x => x.id === id);
    if (!r) continue;
    if (r.immunityAgainst) r.immunityAgainst.forEach(d => immuneSet.add(d));
    if (r.spreadRateMod) spreadRateMod *= r.spreadRateMod;
    if (r.mortalityMod) mortalityMod *= r.mortalityMod;
    if (r.sanitationBonus) sanitationBonus += r.sanitationBonus;
    if (r.productivityBonus) productivityBonus += r.productivityBonus;
  }

  return {
    immuneDiseasIds: [...immuneSet],
    spreadRateMod,
    mortalityMod,
    sanitationBonus,
    productivityBonus,
  };
}

export const SEVERITY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  minor: { label: 'Minor', color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.3)', icon: 'ri-checkbox-circle-line' },
  moderate: { label: 'Moderate', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)', icon: 'ri-alert-line' },
  severe: { label: 'Severe', color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)', icon: 'ri-error-warning-line' },
  critical: { label: 'Critical', color: '#f43f5e', bg: 'rgba(244,63,94,0.12)', border: 'rgba(244,63,94,0.4)', icon: 'ri-alarm-warning-line' },
  pandemic: { label: 'PANDEMIC', color: '#ff0000', bg: 'rgba(255,0,0,0.1)', border: 'rgba(255,0,0,0.5)', icon: 'ri-sword-line' },
};