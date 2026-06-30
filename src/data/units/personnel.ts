import type { PersonnelPool, TrainingTrack } from './types';

// ═══════════════════════════════════════════════════════════
// PERSONNEL POOLS — Untrained & Training Populations
// ═══════════════════════════════════════════════════════════

export const personnelPools: PersonnelPool[] = [
  {
    id: 'pool-civilian-untrained',
    name: 'Untrained Civilian Population',
    description: 'Citizens who have not yet been assigned to any work role. Available for all civilian training tracks.',
    category: 'civilian',
    currentCount: 3200,
    maxCount: 10000,
    growthRate: 50,
    status: 'untrained',
    availableForTraining: 3200
  },
  {
    id: 'pool-military-untrained',
    name: 'Military Conscripts',
    description: 'Citizens drafted or volunteering for military service. Awaiting basic training assignment.',
    category: 'military',
    currentCount: 5000,
    maxCount: 20000,
    growthRate: 30,
    status: 'untrained',
    availableForTraining: 5000
  },
  {
    id: 'pool-government-untrained',
    name: 'Government Candidates',
    description: 'Citizens with aptitude for governmental work. Awaiting departmental assignment.',
    category: 'government',
    currentCount: 1500,
    maxCount: 6000,
    growthRate: 15,
    status: 'untrained',
    availableForTraining: 1500
  },
  {
    id: 'pool-civilian-basic',
    name: 'Basic Labor Training',
    description: 'Civilians in their initial 5-day basic labor orientation and skill assessment.',
    category: 'civilian',
    currentCount: 850,
    maxCount: 5000,
    growthRate: 0,
    status: 'in-training',
    availableForTraining: 0
  },
  {
    id: 'pool-military-basic',
    name: 'Basic Military Training',
    description: 'Recruits undergoing the 6-week basic combat and discipline course.',
    category: 'military',
    currentCount: 1200,
    maxCount: 10000,
    growthRate: 0,
    status: 'in-training',
    availableForTraining: 0
  },
  {
    id: 'pool-government-basic',
    name: 'Government Induction Program',
    description: 'Candidates learning imperial law, procedure, and administrative protocols.',
    category: 'government',
    currentCount: 420,
    maxCount: 3000,
    growthRate: 0,
    status: 'in-training',
    availableForTraining: 0
  }
];

// ═══════════════════════════════════════════════════════════
// TRAINING TRACKS — Full Training Pathways
// ═══════════════════════════════════════════════════════════

export const trainingTracks: TrainingTrack[] = [
  // ─── CIVILIAN TRACKS ────────────────────────────────────
  {
    id: 'track-basic-labor',
    name: 'Basic Labor Program',
    category: 'civilian',
    sector: 'Labor',
    jobType: 'General Labor',
    finalClass: 'laborer',
    finalSubClass: 'apprentice',
    totalDuration: '5 days',
    phases: [
      {
        phase: 1,
        name: 'Orientation',
        duration: '1 day',
        statGains: { efficiency: 10, productivity: 12, stamina: 8 },
        unlockedSkills: ['Basic Safety', 'Tool Usage'],
        passRate: 95
      },
      {
        phase: 2,
        name: 'Practical Skills',
        duration: '3 days',
        statGains: { efficiency: 15, productivity: 18, strength: 10, endurance: 12 },
        unlockedSkills: ['Basic Construction', 'Resource Sorting'],
        passRate: 88
      },
      {
        phase: 3,
        name: 'Field Assignment',
        duration: '1 day',
        statGains: { efficiency: 5, productivity: 10, morale: 8 },
        unlockedSkills: ['Overtime Push'],
        passRate: 92
      }
    ],
    requirements: { metal: 50, crystal: 20, deuterium: 10, food: 100, credits: 5, time: '5 days' }
  },
  {
    id: 'track-mining-specialist',
    name: 'Mining Specialization Program',
    category: 'civilian',
    sector: 'Mining',
    jobType: 'Resource Extraction',
    finalClass: 'specialist',
    finalSubClass: 'journeyman',
    totalDuration: '3 months',
    phases: [
      {
        phase: 1,
        name: 'Geological Studies',
        duration: '1 month',
        statGains: { intelligence: 20, perception: 25, technical: 30 },
        unlockedSkills: ['Ore Identification', 'Geological Survey'],
        passRate: 80
      },
      {
        phase: 2,
        name: 'Equipment Certification',
        duration: '1 month',
        statGains: { technical: 35, endurance: 25, strength: 20 },
        unlockedSkills: ['Mining Laser Operation', 'Equipment Maintenance'],
        passRate: 75
      },
      {
        phase: 3,
        name: 'Field Internship',
        duration: '1 month',
        statGains: { efficiency: 30, productivity: 40, luck: 15 },
        unlockedSkills: ['Deep Mining', 'Vein Strike'],
        passRate: 85
      }
    ],
    requirements: { metal: 500, crystal: 300, deuterium: 100, food: 500, credits: 50, time: '3 months', buildings: ['Mine Level 3'] }
  },
  {
    id: 'track-science',
    name: 'Scientific Research Track',
    category: 'civilian',
    sector: 'Science',
    jobType: 'Physics Research',
    finalClass: 'expert',
    finalSubClass: 'craftsman',
    totalDuration: '6 months',
    phases: [
      {
        phase: 1,
        name: 'Scientific Fundamentals',
        duration: '2 months',
        statGains: { intelligence: 40, perception: 30, technical: 35 },
        unlockedSkills: ['Scientific Method', 'Lab Safety', 'Data Analysis'],
        passRate: 70
      },
      {
        phase: 2,
        name: 'Advanced Theory',
        duration: '2 months',
        statGains: { intelligence: 55, technical: 50, willpower: 20 },
        unlockedSkills: ['Advanced Physics', 'Quantum Mechanics'],
        passRate: 60
      },
      {
        phase: 3,
        name: 'Research Project',
        duration: '2 months',
        statGains: { intelligence: 45, leadership: 25, adaptability: 30 },
        unlockedSkills: ['Experimental Design', 'Breakthrough Research'],
        passRate: 72
      }
    ],
    requirements: { metal: 1000, crystal: 2000, deuterium: 500, food: 1000, credits: 200, time: '6 months', buildings: ['Research Lab Level 4'] }
  },
  // ─── MILITARY TRACKS ────────────────────────────────────
  {
    id: 'track-basic-military',
    name: 'Basic Military Training',
    category: 'military',
    sector: 'Ground Forces',
    jobType: 'Basic Infantry',
    finalClass: 'recruit',
    finalSubClass: 'militia',
    totalDuration: '6 weeks',
    phases: [
      {
        phase: 1,
        name: 'Physical Conditioning',
        duration: '2 weeks',
        statGains: { stamina: 25, endurance: 20, strength: 15, health: 30 },
        unlockedSkills: ['Physical Fitness', 'Drill Formation'],
        passRate: 85
      },
      {
        phase: 2,
        name: 'Weapons Training',
        duration: '2 weeks',
        statGains: { combat: 22, accuracy: 18, perception: 15 },
        unlockedSkills: ['Basic Combat', 'Weapon Handling'],
        passRate: 78
      },
      {
        phase: 3,
        name: 'Squad Tactics',
        duration: '2 weeks',
        statGains: { combat: 18, defense: 15, leadership: 10, discipline: 20 },
        unlockedSkills: ['Squad Tactics', 'Last Stand'],
        passRate: 82
      }
    ],
    requirements: { metal: 100, crystal: 50, deuterium: 25, food: 200, credits: 20, time: '6 weeks', buildings: ['Barracks Level 1'] }
  },
  {
    id: 'track-special-ops',
    name: 'Special Operations Selection',
    category: 'military',
    sector: 'Special Operations',
    jobType: 'Commando',
    finalClass: 'elite',
    finalSubClass: 'commando',
    totalDuration: '2 years',
    phases: [
      {
        phase: 1,
        name: 'Selection & Attrition',
        duration: '6 months',
        statGains: { endurance: 60, willpower: 50, agility: 40, combat: 35 },
        unlockedSkills: ['Advanced Combat', 'Survival'],
        passRate: 25
      },
      {
        phase: 2,
        name: 'Advanced Combat School',
        duration: '6 months',
        statGains: { combat: 65, agility: 55, technical: 40, perception: 50 },
        unlockedSkills: ['Stealth Operations', 'Demolitions', 'Hand-to-Hand'],
        passRate: 40
      },
      {
        phase: 3,
        name: 'Infiltration & Intelligence',
        duration: '6 months',
        statGains: { agility: 45, perception: 55, intelligence: 40, adaptability: 45 },
        unlockedSkills: ['Infiltration', 'Code Breaking', 'Surveillance'],
        passRate: 50
      },
      {
        phase: 4,
        name: 'Live Operations',
        duration: '6 months',
        statGains: { combat: 50, defense: 45, leadership: 40, willpower: 50 },
        unlockedSkills: ['Phantom Strike', 'Ghost Mode', 'Sabotage'],
        passRate: 65
      }
    ],
    requirements: { metal: 4000, crystal: 3000, deuterium: 2000, food: 4000, credits: 500, time: '2 years', buildings: ['Special Ops Center Level 1', 'Training Ground Level 3'] }
  },
  {
    id: 'track-pilot',
    name: 'Starfighter Pilot Program',
    category: 'military',
    sector: 'Space Forces',
    jobType: 'Fighter Pilot',
    finalClass: 'veteran',
    finalSubClass: 'regular',
    totalDuration: '18 months',
    phases: [
      {
        phase: 1,
        name: 'Flight Theory & Simulator',
        duration: '6 months',
        statGains: { intelligence: 30, perception: 40, technical: 35, agility: 20 },
        unlockedSkills: ['Navigation', 'Ship Systems'],
        passRate: 60
      },
      {
        phase: 2,
        name: 'Basic Flight Certification',
        duration: '6 months',
        statGains: { agility: 60, perception: 45, speed: 50, combat: 30 },
        unlockedSkills: ['Advanced Piloting', 'Emergency Protocols'],
        passRate: 55
      },
      {
        phase: 3,
        name: 'Combat Flight Training',
        duration: '6 months',
        statGains: { combat: 55, agility: 45, speed: 40, willpower: 35 },
        unlockedSkills: ['Combat Maneuvers', 'Ace Maneuver', 'Boom and Zoom'],
        passRate: 62
      }
    ],
    requirements: { metal: 3000, crystal: 2500, deuterium: 1500, food: 3000, credits: 300, time: '18 months', buildings: ['Hangar Level 2', 'Simulator Bay Level 1'] }
  },
  // ─── GOVERNMENT TRACKS ─────────────────────────────────
  {
    id: 'track-admin',
    name: 'Government Administration Track',
    category: 'government',
    sector: 'Administration',
    jobType: 'Bureaucrat',
    finalClass: 'official',
    finalSubClass: 'attache',
    totalDuration: '2 months',
    phases: [
      {
        phase: 1,
        name: 'Imperial Law & Protocol',
        duration: '1 month',
        statGains: { intelligence: 25, charisma: 15, perception: 20, discipline: 18 },
        unlockedSkills: ['Tax Law', 'Record Keeping'],
        passRate: 82
      },
      {
        phase: 2,
        name: 'Administrative Practicum',
        duration: '1 month',
        statGains: { efficiency: 22, productivity: 28, leadership: 18, charisma: 20 },
        unlockedSkills: ['Administration', 'Public Relations'],
        passRate: 78
      }
    ],
    requirements: { metal: 100, crystal: 200, deuterium: 50, food: 300, credits: 100, time: '2 months', buildings: ['Command Center Level 1'] }
  },
  {
    id: 'track-diplomacy',
    name: 'Diplomatic Service Academy',
    category: 'government',
    sector: 'Diplomacy',
    jobType: 'Ambassador',
    finalClass: 'minister',
    finalSubClass: 'counselor',
    totalDuration: '5 years',
    phases: [
      {
        phase: 1,
        name: 'Languages & Cultures',
        duration: '1 year',
        statGains: { intelligence: 40, charisma: 45, adaptability: 40, perception: 35 },
        unlockedSkills: ['Translation', 'Cultural Studies'],
        passRate: 72
      },
      {
        phase: 2,
        name: 'International Law',
        duration: '1 year',
        statGains: { intelligence: 45, leadership: 35, willpower: 30, charisma: 40 },
        unlockedSkills: ['Diplomacy Basics', 'Protocol'],
        passRate: 65
      },
      {
        phase: 3,
        name: 'Negotiation Mastery',
        duration: '2 years',
        statGains: { charisma: 80, leadership: 60, perception: 55, adaptability: 55 },
        unlockedSkills: ['Advanced Diplomacy', 'Treaty Negotiation', 'Crisis De-escalation'],
        passRate: 55
      },
      {
        phase: 4,
        name: 'Field Assignment',
        duration: '1 year',
        statGains: { charisma: 45, leadership: 40, adaptability: 35, luck: 25 },
        unlockedSkills: ['Alliance Management', 'Peace Treaty', 'Trade Route Discovery'],
        passRate: 68
      }
    ],
    requirements: { metal: 3000, crystal: 5000, deuterium: 2000, food: 5000, credits: 2000, time: '5 years', buildings: ['Diplomatic Center Level 5'] }
  }
];

// ─── Job Category Descriptions ────────────────────────────
export const JOB_CATEGORY_DESCRIPTIONS = {
  // Civilian
  Labor: 'Manual workers and general laborers. Foundation of resource gathering.',
  Mining: 'Extraction specialists for metal, crystal, and rare minerals.',
  Construction: 'Builders and architects who expand your empire\'s infrastructure.',
  Engineering: 'Technical experts who design and repair complex systems.',
  Science: 'Researchers who advance technology and unlock new possibilities.',
  Medical: 'Healthcare workers who keep your population healthy and productive.',
  Agriculture: 'Food production specialists ensuring colony sustainability.',
  Commerce: 'Traders and merchants who optimize the economic engine.',
  Education: 'Instructors who improve training speeds and efficiency.',
  Transport: 'Logistics workers managing cargo and supply lines.',
  Energy: 'Power plant operators ensuring consistent energy supply.',
  Communications: 'Signal technicians managing information networks.',
  Manufacturing: 'Factory workers producing equipment and goods.',
  Entertainment: 'Cultural workers who boost morale across the empire.',
  // Military
  'Ground Forces': 'Frontline infantry and armored units for planetary warfare.',
  'Space Forces': 'Naval personnel operating warships and fighters.',
  'Naval Command': 'Officers directing fleet strategy and coordination.',
  'Special Operations': 'Elite forces for covert missions and high-value targets.',
  Intelligence: 'Covert agents gathering and analyzing enemy intelligence.',
  Logistics: 'Supply chain managers ensuring forces are always equipped.',
  'Combat Support': 'Specialists providing fire support and technical backup.',
  'Heavy Assault': 'Armored assault units for breaking enemy fortifications.',
  'Cyber Warfare': 'Digital warfare experts hacking enemy systems.',
  'Psi Corps': 'Rare psychic warriors with mental combat capabilities.',
  Heroes: 'Legendary figures whose power shapes the destiny of worlds.',
  // Government
  Administration: 'Bureaucrats managing day-to-day colonial operations.',
  Diplomacy: 'Representatives building alliances and maintaining peace.',
  'Law Enforcement': 'Officers maintaining order and security on colonies.',
  'Intelligence Agency': 'Civilian analysts processing intelligence data.',
  Treasury: 'Financial experts optimizing imperial economics.',
  Justice: 'Legal authorities interpreting and enforcing imperial law.',
  Infrastructure: 'Planners managing colony development and expansion.',
  'Foreign Affairs': 'Specialists handling inter-faction relationships.',
  'Imperial Guard': 'Elite protectors of imperial leadership and assets.',
  'Strategic Command': 'Highest-level advisors shaping imperial grand strategy.'
};

// ─── Training Status Labels ────────────────────────────────
export const TRAINING_STATUS_LABELS: Record<string, string> = {
  untrained: 'Untrained',
  enrolled: 'Enrolled',
  'basic-training': 'Basic Training',
  'advanced-training': 'Advanced Training',
  'specialist-training': 'Specialist Training',
  trained: 'Trained',
  veteran: 'Veteran',
  elite: 'Elite',
  deployed: 'Deployed',
  resting: 'Off Duty',
  injured: 'Injured',
  retired: 'Retired'
};
