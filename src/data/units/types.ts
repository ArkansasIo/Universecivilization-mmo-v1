// ═══════════════════════════════════════════════════════════
// UNIT SYSTEM — COMPLETE TYPE HIERARCHY
// ═══════════════════════════════════════════════════════════

// ─── Top-Level Unit Category ───────────────────────────────
export type UnitCategory = 'civilian' | 'military' | 'government';

// ─── Unit Classes by Category ──────────────────────────────
export type CivilianClass =
  | 'untrained'
  | 'laborer'
  | 'technician'
  | 'specialist'
  | 'expert'
  | 'master'
  | 'grandmaster';

export type MilitaryClass =
  | 'untrained'
  | 'recruit'
  | 'soldier'
  | 'veteran'
  | 'elite'
  | 'special-ops'
  | 'officer'
  | 'commander'
  | 'hero';

export type GovernmentClass =
  | 'untrained'
  | 'clerk'
  | 'official'
  | 'director'
  | 'minister'
  | 'chancellor'
  | 'emperor';

export type UnitClass = CivilianClass | MilitaryClass | GovernmentClass;

// ─── Unit Sub-Classes ──────────────────────────────────────
export type UnitSubClass =
  // Civilian sub-classes
  | 'raw-recruit' | 'apprentice' | 'journeyman' | 'craftsman' | 'artisan' | 'virtuoso'
  // Military sub-classes
  | 'militia' | 'regular' | 'commando' | 'ranger' | 'guardian' | 'warlord' | 'champion'
  // Government sub-classes
  | 'intern' | 'attache' | 'delegate' | 'advisor' | 'secretary' | 'counselor' | 'regent';

// ─── Job Sectors ───────────────────────────────────────────
export type CivilianSector =
  | 'Labor'
  | 'Mining'
  | 'Construction'
  | 'Engineering'
  | 'Science'
  | 'Medical'
  | 'Agriculture'
  | 'Commerce'
  | 'Education'
  | 'Transport'
  | 'Energy'
  | 'Communications'
  | 'Manufacturing'
  | 'Entertainment';

export type MilitarySector =
  | 'Ground Forces'
  | 'Space Forces'
  | 'Naval Command'
  | 'Special Operations'
  | 'Intelligence'
  | 'Logistics'
  | 'Combat Support'
  | 'Heavy Assault'
  | 'Cyber Warfare'
  | 'Psi Corps'
  | 'Heroes';

export type GovernmentSector =
  | 'Administration'
  | 'Diplomacy'
  | 'Law Enforcement'
  | 'Intelligence Agency'
  | 'Treasury'
  | 'Justice'
  | 'Infrastructure'
  | 'Foreign Affairs'
  | 'Imperial Guard'
  | 'Strategic Command';

export type UnitSector = CivilianSector | MilitarySector | GovernmentSector;

// ─── Job Types ─────────────────────────────────────────────
export type CivilianJobType =
  | 'General Labor' | 'Resource Extraction' | 'Ore Processing' | 'Construction'
  | 'Structural Engineering' | 'Mechanical Engineering' | 'Software Engineering'
  | 'Physics Research' | 'Biology Research' | 'Chemistry Research' | 'Weapons Research'
  | 'Medical Practice' | 'Surgery' | 'Pharmacology' | 'Psychiatry'
  | 'Farming' | 'Hydroponics' | 'Aquaculture'
  | 'Trade Logistics' | 'Market Analysis' | 'Accounting'
  | 'Teaching' | 'Training Instruction'
  | 'Cargo Transport' | 'Shuttle Operations'
  | 'Reactor Operations' | 'Solar Engineering'
  | 'Communications Tech' | 'Signal Analysis'
  | 'Heavy Manufacturing' | 'Nano-Assembly'
  | 'Arts & Culture' | 'Holographic Design';

export type MilitaryJobType =
  | 'Basic Infantry' | 'Heavy Infantry' | 'Light Infantry' | 'Motorized Infantry'
  | 'Assault Trooper' | 'Shock Trooper' | 'Siege Specialist' | 'Breacher'
  | 'Fighter Pilot' | 'Bomber Pilot' | 'Interceptor Pilot' | 'Dropship Pilot'
  | 'Fleet Officer' | 'Tactical Officer' | 'Navigation Officer' | 'Weapons Officer'
  | 'Commando' | 'Ranger' | 'Assassin' | 'Saboteur' | 'Infiltrator'
  | 'Combat Medic' | 'Field Engineer' | 'Combat Drone Operator'
  | 'Cyber Specialist' | 'Hacker' | 'EW Technician'
  | 'Psi Soldier' | 'Psi Commander' | 'Psi Assassin'
  | 'Supply Officer' | 'Logistics Expert'
  | 'General' | 'High Admiral' | 'Grand Marshal';

export type GovernmentJobType =
  | 'Data Entry' | 'Records Manager' | 'Bureaucrat' | 'Archivist'
  | 'Ambassador' | 'Diplomat' | 'Cultural Attache' | 'Trade Envoy'
  | 'Police Officer' | 'Detective' | 'Marshal' | 'Warden'
  | 'Intelligence Analyst' | 'Field Agent' | 'Operative' | 'Spymaster'
  | 'Treasury Clerk' | 'Economist' | 'Tax Assessor' | 'Finance Minister'
  | 'Judge' | 'Prosecutor' | 'Magistrate'
  | 'Infrastructure Planner' | 'Urban Administrator'
  | 'Foreign Affairs Officer' | 'Consul'
  | 'Imperial Guard' | 'Praetorian' | 'Royal Champion'
  | 'Chief of Staff' | 'Supreme Commander';

export type UnitJobType = CivilianJobType | MilitaryJobType | GovernmentJobType;

// ─── Unit Function & Sub-Function ─────────────────────────
export type UnitFunction =
  | 'Production' | 'Combat' | 'Support' | 'Research'
  | 'Governance' | 'Espionage' | 'Logistics' | 'Healing'
  | 'Training' | 'Defense' | 'Exploration' | 'Command';

export type UnitSubFunction =
  // Production sub-functions
  | 'Resource Gathering' | 'Resource Processing' | 'Manufacturing' | 'Construction' | 'Repair'
  // Combat sub-functions
  | 'Direct Combat' | 'Ranged Combat' | 'Melee Combat' | 'Area Denial' | 'Siege Warfare'
  | 'Aerial Combat' | 'Naval Combat' | 'Boarding Operations'
  // Support sub-functions
  | 'Fleet Support' | 'Ground Support' | 'Air Support' | 'Morale Boost' | 'Shield Projection'
  // Research sub-functions
  | 'Tech Research' | 'Weapons Development' | 'Medical Research' | 'Cultural Research'
  // Governance sub-functions
  | 'Law Enforcement' | 'Tax Collection' | 'Public Order' | 'Policy Making' | 'Diplomacy'
  // Espionage sub-functions
  | 'Intelligence Gathering' | 'Counter-Intelligence' | 'Sabotage' | 'Assassination'
  // Logistics sub-functions
  | 'Supply Chain' | 'Cargo Transport' | 'Fleet Logistics' | 'Fuel Management'
  // Healing sub-functions
  | 'Field Medicine' | 'Surgery' | 'Psych Operations' | 'Combat Stimulants'
  // Training sub-functions
  | 'Recruit Training' | 'Advanced Training' | 'Specialist Training' | 'Officer Education'
  // Defense sub-functions
  | 'Planetary Defense' | 'Point Defense' | 'Orbital Defense' | 'Bunker Operations'
  // Exploration sub-functions
  | 'Survey' | 'Colonization' | 'Xenobiology' | 'Archaeology'
  // Command sub-functions
  | 'Tactical Command' | 'Strategic Planning' | 'Fleet Command' | 'Army Command';

// ─── Training Status ───────────────────────────────────────
export type TrainingStatus =
  | 'untrained'
  | 'enrolled'
  | 'basic-training'
  | 'advanced-training'
  | 'specialist-training'
  | 'trained'
  | 'veteran'
  | 'elite'
  | 'deployed'
  | 'resting'
  | 'injured'
  | 'retired';

// ─── Training Track ────────────────────────────────────────
export interface TrainingTrack {
  id: string;
  name: string;
  category: UnitCategory;
  sector: UnitSector;
  jobType: UnitJobType;
  phases: TrainingPhase[];
  totalDuration: string;
  finalClass: UnitClass;
  finalSubClass: UnitSubClass;
  requirements: UnitRequirements;
}

export interface TrainingPhase {
  phase: number;
  name: string;
  duration: string;
  statGains: Partial<UnitStats>;
  unlockedSkills: string[];
  passRate: number;
}

// ─── Core Stats ────────────────────────────────────────────
export interface UnitStats {
  // Primary
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  morale: number;
  maxMorale: number;
  // Work
  efficiency: number;
  productivity: number;
  // Combat
  combat: number;
  defense: number;
  speed: number;
  // Mental
  intelligence: number;
  loyalty: number;
  discipline: number;
}

// ─── Sub-Stats (RPG attributes) ────────────────────────────
export interface UnitSubStats {
  strength: number;
  agility: number;
  endurance: number;
  perception: number;
  charisma: number;
  luck: number;
  leadership: number;
  technical: number;
  willpower: number;
  adaptability: number;
}

// ─── Unit Effects ──────────────────────────────────────────
export interface UnitEffects {
  primary: string[];
  secondary: string[];
  special: string[];
  passive: string[];
}

// ─── Requirements ──────────────────────────────────────────
export interface UnitRequirements {
  metal: number;
  crystal: number;
  deuterium: number;
  food: number;
  credits: number;
  time: string;
  buildings?: string[];
  technologies?: string[];
  minLevel?: number;
}

// ─── Upkeep ────────────────────────────────────────────────
export interface UnitUpkeep {
  food: number;
  credits: number;
  energy?: number;
  deuterium?: number;
}

// ─── Full Unit Definition ──────────────────────────────────
export interface UnitDefinition {
  id: string;
  name: string;
  category: UnitCategory;
  class: UnitClass;
  subClass: UnitSubClass;
  sector: UnitSector;
  jobType: UnitJobType;
  subJobType?: string;
  unitFunction: UnitFunction;
  subFunction: UnitSubFunction;
  tier: number;           // 1–99
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Transcendent';
  level: number;
  maxLevel: number;
  experience: number;
  maxExperience: number;
  status: TrainingStatus;
  trainingProgress?: number;
  trainingTimeLeft?: string;
  description: string;
  lore: string;
  stats: UnitStats;
  subStats: UnitSubStats;
  effects: UnitEffects;
  requirements: UnitRequirements;
  upkeep: UnitUpkeep;
  equipment: string[];
  skills: string[];
  abilities: string[];
  available: number;
  maxCapacity: number;
  icon: string;
  image?: string;
}

// ─── Training Queue Entry ──────────────────────────────────
export interface TrainingQueueEntry {
  unitId: string;
  unitName: string;
  count: number;
  startedAt: Date;
  completesAt: Date;
  progress: number;
  phase: number;
}

// ─── Personnel Pool ────────────────────────────────────────
export interface PersonnelPool {
  id: string;
  name: string;
  description: string;
  category: UnitCategory;
  currentCount: number;
  maxCount: number;
  growthRate: number;
  status: 'untrained' | 'available' | 'in-training';
  availableForTraining: number;
}

// ─── Empire Personnel Summary ──────────────────────────────
export interface EmpirePersonnel {
  total: number;
  civilian: number;
  military: number;
  government: number;
  untrained: number;
  inTraining: number;
  deployed: number;
  injured: number;
  totalCombatPower: number;
  totalProductivity: number;
  dailyFoodUpkeep: number;
  dailyCreditUpkeep: number;
  moraleAverage: number;
}

// ─── Rarity Colors ────────────────────────────────────────
export const UNIT_RARITY_COLORS: Record<string, string> = {
  Common: '#9CA3AF',
  Uncommon: '#10B981',
  Rare: '#3B82F6',
  Epic: '#8B5CF6',
  Legendary: '#F59E0B',
  Mythic: '#EF4444',
  Transcendent: '#EC4899'
};

export const UNIT_RARITY_GRADIENTS: Record<string, string> = {
  Common: 'from-gray-500 to-slate-600',
  Uncommon: 'from-emerald-500 to-teal-600',
  Rare: 'from-sky-500 to-blue-600',
  Epic: 'from-violet-500 to-purple-700',
  Legendary: 'from-amber-500 to-orange-600',
  Mythic: 'from-red-500 to-rose-700',
  Transcendent: 'from-pink-500 to-fuchsia-700'
};

// ─── Class Gradients ──────────────────────────────────────
export const UNIT_CLASS_GRADIENTS: Record<string, string> = {
  // Civilian
  untrained: 'from-gray-500 to-slate-600',
  laborer: 'from-stone-500 to-amber-700',
  technician: 'from-cyan-600 to-blue-700',
  specialist: 'from-teal-500 to-emerald-700',
  expert: 'from-indigo-500 to-violet-600',
  master: 'from-amber-500 to-orange-600',
  grandmaster: 'from-yellow-400 to-amber-600',
  // Military
  recruit: 'from-slate-500 to-gray-600',
  soldier: 'from-green-600 to-teal-700',
  veteran: 'from-blue-600 to-cyan-700',
  elite: 'from-violet-600 to-purple-700',
  'special-ops': 'from-red-600 to-rose-700',
  officer: 'from-sky-500 to-blue-700',
  commander: 'from-indigo-600 to-blue-800',
  hero: 'from-amber-500 to-orange-600',
  // Government
  clerk: 'from-slate-400 to-gray-600',
  official: 'from-blue-500 to-indigo-600',
  director: 'from-indigo-500 to-blue-700',
  minister: 'from-violet-500 to-purple-700',
  chancellor: 'from-amber-500 to-yellow-600',
  emperor: 'from-yellow-400 to-orange-500'
};

// ─── Status Colors ────────────────────────────────────────
export const UNIT_STATUS_COLORS: Record<TrainingStatus, string> = {
  untrained: 'text-gray-400',
  enrolled: 'text-sky-400',
  'basic-training': 'text-amber-400',
  'advanced-training': 'text-orange-400',
  'specialist-training': 'text-purple-400',
  trained: 'text-emerald-400',
  veteran: 'text-cyan-400',
  elite: 'text-yellow-400',
  deployed: 'text-blue-400',
  resting: 'text-teal-400',
  injured: 'text-red-400',
  retired: 'text-gray-500'
};
