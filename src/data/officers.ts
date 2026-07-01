import { Officer, OfficerClass, Rank, Rarity } from '../types/gameTypes';

export const officers: Officer[] = [
  {
    id: 'novice-admiral',
    name: 'Novice Admiral',
    description: 'A fresh graduate from the Naval Academy with basic fleet command training. Shows promise but lacks battlefield experience.',
    lore: 'Every legendary admiral starts somewhere. These young officers are eager to prove themselves, armed with theoretical knowledge and burning ambition. Their inexperience is offset by their enthusiasm and fresh perspectives on warfare.',
    class: 'Admiral' as OfficerClass,
    rank: 'E' as Rank,
    rarity: 'Common' as Rarity,
    tier: 1,
    level: 1,
    maxLevel: 50,
    baseStats: {
      leadership: 20,
      tactics: 15,
      combat: 10,
      intelligence: 12,
      charisma: 18,
      luck: 10
    },
    skills: [
      {
        id: 'basic-command',
        name: 'Basic Command',
        description: 'Fundamental fleet command training provides a small boost to fleet effectiveness.',
        effect: '+5% fleet attack',
        maxLevel: 5,
        currentLevel: 1
      }
    ],
    bonuses: {
      fleetAttack: 5,
      fleetDefense: 3,
      fleetSpeed: 2
    },
    cost: {
      credits: 10000
    },
    requirements: {
      level: 1,
      technologies: [],
      buildings: []
    },
    specialAbility: {
      name: 'Inspiring Speech',
      description: 'Delivers a rousing speech that temporarily boosts crew morale, increasing all fleet stats by 10% for 5 minutes.',
      cooldown: 3600,
      effect: '+10% all fleet stats for 5 minutes'
    },
    personality: 'Eager and ambitious, sometimes overconfident',
    background: 'Recent academy graduate with top marks in theoretical warfare'
  },
  {
    id: 'veteran-admiral',
    name: 'Veteran Admiral',
    description: 'A seasoned fleet commander with years of combat experience. Known for tactical brilliance and calm under pressure.',
    lore: 'Forged in the crucible of countless battles, Veteran Admirals have seen it all. Their tactical acumen and ability to read the battlefield make them invaluable assets. Many have turned the tide of seemingly hopeless battles through sheer skill and determination.',
    class: 'Admiral' as OfficerClass,
    rank: 'C' as Rank,
    rarity: 'Rare' as Rarity,
    tier: 3,
    level: 1,
    maxLevel: 75,
    baseStats: {
      leadership: 60,
      tactics: 55,
      combat: 40,
      intelligence: 50,
      charisma: 58,
      luck: 35
    },
    skills: [
      {
        id: 'tactical-mastery',
        name: 'Tactical Mastery',
        description: 'Years of experience allow for superior tactical decisions, significantly improving fleet performance.',
        effect: '+15% fleet attack and defense',
        maxLevel: 10,
        currentLevel: 1
      },
      {
        id: 'battle-hardened',
        name: 'Battle Hardened',
        description: 'Extensive combat experience reduces fleet casualties and improves survival rates.',
        effect: '+10% fleet health',
        maxLevel: 8,
        currentLevel: 1
      }
    ],
    bonuses: {
      fleetAttack: 15,
      fleetDefense: 15,
      fleetSpeed: 8,
      fleetHealth: 10
    },
    cost: {
      credits: 100000
    },
    requirements: {
      level: 20,
      technologies: ['military_tactics_2'],
      buildings: ['command_center_3']
    },
    specialAbility: {
      name: 'Tactical Retreat',
      description: 'Orders a strategic withdrawal when outmatched, allowing the fleet to escape with minimal losses and preserving 80% of ships.',
      cooldown: 7200,
      effect: 'Escape from losing battle, preserve 80% of fleet'
    },
    personality: 'Calm, calculated, and respected by subordinates',
    background: 'Veteran of the Sector Wars with 15 years of command experience'
  },
  {
    id: 'legendary-admiral',
    name: 'Legendary Admiral',
    description: 'A living legend whose name strikes fear into enemies and inspires unwavering loyalty. Master of grand strategy and fleet operations.',
    lore: 'Songs are sung of their victories across a hundred worlds. Legendary Admirals are rare individuals who possess an almost supernatural ability to predict enemy movements and orchestrate complex fleet maneuvers. Their presence alone can shift the balance of power in entire sectors.',
    class: 'Admiral' as OfficerClass,
    rank: 'A' as Rank,
    rarity: 'Legendary' as Rarity,
    tier: 5,
    level: 1,
    maxLevel: 100,
    baseStats: {
      leadership: 120,
      tactics: 110,
      combat: 80,
      intelligence: 105,
      charisma: 125,
      luck: 70
    },
    skills: [
      {
        id: 'grand-strategy',
        name: 'Grand Strategy',
        description: 'Masterful understanding of warfare on a galactic scale, dramatically improving all fleet operations.',
        effect: '+30% fleet attack, defense, and speed',
        maxLevel: 15,
        currentLevel: 1
      },
      {
        id: 'legendary-presence',
        name: 'Legendary Presence',
        description: 'Inspires absolute loyalty and peak performance from all crew members.',
        effect: '+25% all fleet stats',
        maxLevel: 12,
        currentLevel: 1
      },
      {
        id: 'perfect-timing',
        name: 'Perfect Timing',
        description: 'Uncanny ability to strike at the perfect moment, increasing critical hit chance.',
        effect: '+20% fleet critical chance',
        maxLevel: 10,
        currentLevel: 1
      }
    ],
    bonuses: {
      fleetAttack: 30,
      fleetDefense: 30,
      fleetSpeed: 25,
      fleetHealth: 20,
      fleetCriticalChance: 20
    },
    cost: {
      credits: 1000000
    },
    requirements: {
      level: 60,
      technologies: ['advanced_tactics_3', 'fleet_coordination_3'],
      buildings: ['command_center_7']
    },
    specialAbility: {
      name: 'Legendary Maneuver',
      description: 'Executes a brilliant tactical maneuver that catches enemies completely off-guard, dealing 200% damage and stunning all enemy fleets for 10 seconds.',
      cooldown: 10800,
      effect: 'Deal 200% damage and stun all enemies for 10 seconds'
    },
    personality: 'Charismatic, brilliant, and feared by enemies',
    background: 'Hero of the Great War, credited with saving three entire star systems'
  },
  {
    id: 'basic-commander',
    name: 'Basic Commander',
    description: 'A competent officer trained in combat operations and ship-to-ship tactics. Reliable in standard engagements.',
    lore: 'The backbone of any military force, Basic Commanders handle the day-to-day operations that keep fleets running. While they may not be legendary heroes, their steady competence is invaluable.',
    class: 'Commander' as OfficerClass,
    rank: 'D' as Rank,
    rarity: 'Uncommon' as Rarity,
    tier: 2,
    level: 1,
    maxLevel: 60,
    baseStats: {
      leadership: 35,
      tactics: 40,
      combat: 45,
      intelligence: 30,
      charisma: 28,
      luck: 20
    },
    skills: [
      {
        id: 'combat-coordination',
        name: 'Combat Coordination',
        description: 'Coordinates ship movements during combat for improved effectiveness.',
        effect: '+10% fleet attack',
        maxLevel: 7,
        currentLevel: 1
      },
      {
        id: 'defensive-protocols',
        name: 'Defensive Protocols',
        description: 'Implements defensive strategies to reduce incoming damage.',
        effect: '+8% fleet defense',
        maxLevel: 6,
        currentLevel: 1
      }
    ],
    bonuses: {
      fleetAttack: 10,
      fleetDefense: 8,
      combatEfficiency: 5
    },
    cost: {
      credits: 25000
    },
    requirements: {
      level: 5,
      technologies: ['military_training_1'],
      buildings: ['barracks_2']
    },
    specialAbility: {
      name: 'Focus Fire',
      description: 'Concentrates all firepower on a single target, dealing 150% damage to one enemy ship.',
      cooldown: 1800,
      effect: 'Deal 150% damage to single target'
    },
    personality: 'Professional and by-the-book',
    background: 'Career military officer with solid combat record'
  },
  {
    id: 'elite-commander',
    name: 'Elite Commander',
    description: 'A highly skilled tactical officer specializing in complex combat scenarios. Expert in coordinated strikes and defensive maneuvers.',
    lore: 'Elite Commanders are selected from the top 1% of military personnel. Their training includes advanced combat simulations, psychological warfare, and multi-fleet coordination. They excel in turning chaotic battles into organized victories.',
    class: 'Commander' as OfficerClass,
    rank: 'B' as Rank,
    rarity: 'Epic' as Rarity,
    tier: 4,
    level: 1,
    maxLevel: 85,
    baseStats: {
      leadership: 75,
      tactics: 85,
      combat: 90,
      intelligence: 70,
      charisma: 65,
      luck: 50
    },
    skills: [
      {
        id: 'tactical-excellence',
        name: 'Tactical Excellence',
        description: 'Superior tactical training allows for devastating coordinated attacks.',
        effect: '+20% fleet attack and critical damage',
        maxLevel: 12,
        currentLevel: 1
      },
      {
        id: 'adaptive-defense',
        name: 'Adaptive Defense',
        description: 'Quickly adapts defensive strategies to counter enemy tactics.',
        effect: '+18% fleet defense and evasion',
        maxLevel: 10,
        currentLevel: 1
      },
      {
        id: 'combat-veteran',
        name: 'Combat Veteran',
        description: 'Extensive combat experience improves overall fleet performance.',
        effect: '+15% all combat stats',
        maxLevel: 8,
        currentLevel: 1
      }
    ],
    bonuses: {
      fleetAttack: 20,
      fleetDefense: 18,
      fleetCriticalDamage: 20,
      fleetEvasion: 10,
      combatEfficiency: 15
    },
    cost: {
      credits: 250000
    },
    requirements: {
      level: 35,
      technologies: ['advanced_tactics_2', 'combat_training_3'],
      buildings: ['command_center_5']
    },
    specialAbility: {
      name: 'Coordinated Strike',
      description: 'Orchestrates a perfectly timed multi-ship attack, dealing 250% damage with guaranteed critical hits.',
      cooldown: 5400,
      effect: 'Deal 250% damage with 100% critical chance'
    },
    personality: 'Intense, focused, and demanding excellence',
    background: 'Elite special forces commander with classified operations experience'
  },
  {
    id: 'skilled-captain',
    name: 'Skilled Captain',
    description: 'An experienced ship captain with excellent crew management and combat skills. Known for getting the most out of any vessel.',
    lore: 'Skilled Captains are the heart of any fleet. They know their ships inside and out, can coax maximum performance from aging vessels, and inspire fierce loyalty from their crews. Many legendary admirals started as skilled captains.',
    class: 'Captain' as OfficerClass,
    rank: 'C' as Rank,
    rarity: 'Rare' as Rarity,
    tier: 3,
    level: 1,
    maxLevel: 70,
    baseStats: {
      leadership: 55,
      tactics: 50,
      combat: 60,
      intelligence: 45,
      charisma: 52,
      luck: 40
    },
    skills: [
      {
        id: 'ship-mastery',
        name: 'Ship Mastery',
        description: 'Deep understanding of ship systems improves overall performance.',
        effect: '+12% ship stats',
        maxLevel: 10,
        currentLevel: 1
      },
      {
        id: 'crew-efficiency',
        name: 'Crew Efficiency',
        description: 'Excellent crew management increases operational efficiency.',
        effect: '+10% resource efficiency and repair speed',
        maxLevel: 8,
        currentLevel: 1
      }
    ],
    bonuses: {
      shipAttack: 12,
      shipDefense: 12,
      shipSpeed: 10,
      resourceEfficiency: 10,
      repairSpeed: 15
    },
    cost: {
      credits: 75000
    },
    requirements: {
      level: 15,
      technologies: ['ship_operations_2'],
      buildings: ['shipyard_3']
    },
    specialAbility: {
      name: 'Emergency Repairs',
      description: 'Directs crew to perform emergency repairs, restoring 30% of ship health instantly.',
      cooldown: 3600,
      effect: 'Restore 30% ship health instantly'
    },
    personality: 'Practical, resourceful, and respected by crew',
    background: 'Rose through the ranks from enlisted crew to captain'
  },
  {
    id: 'ace-pilot',
    name: 'Ace Pilot',
    description: 'An exceptional fighter pilot with lightning reflexes and unmatched flying skills. Dominates in dogfights and high-speed combat.',
    lore: 'Ace Pilots are born, not made. Their natural talent combined with intensive training makes them nearly unstoppable in small craft. They see patterns in chaos and can thread their ships through impossible spaces at impossible speeds.',
    class: 'Pilot' as OfficerClass,
    rank: 'B' as Rank,
    rarity: 'Epic' as Rarity,
    tier: 4,
    level: 1,
    maxLevel: 80,
    baseStats: {
      leadership: 45,
      tactics: 70,
      combat: 95,
      intelligence: 60,
      charisma: 55,
      luck: 65
    },
    skills: [
      {
        id: 'superior-reflexes',
        name: 'Superior Reflexes',
        description: 'Lightning-fast reactions dramatically improve evasion and accuracy.',
        effect: '+25% evasion and accuracy',
        maxLevel: 12,
        currentLevel: 1
      },
      {
        id: 'dogfighting-master',
        name: 'Dogfighting Master',
        description: 'Unmatched skill in close-quarters combat with small craft.',
        effect: '+30% fighter and interceptor effectiveness',
        maxLevel: 10,
        currentLevel: 1
      },
      {
        id: 'high-speed-maneuvers',
        name: 'High-Speed Maneuvers',
        description: 'Can perform impossible maneuvers at high speeds.',
        effect: '+20% speed and critical chance',
        maxLevel: 8,
        currentLevel: 1
      }
    ],
    bonuses: {
      fighterEffectiveness: 30,
      evasion: 25,
      accuracy: 25,
      speed: 20,
      criticalChance: 20
    },
    cost: {
      credits: 200000
    },
    requirements: {
      level: 30,
      technologies: ['advanced_piloting_3', 'fighter_tactics_2'],
      buildings: ['flight_academy_4']
    },
    specialAbility: {
      name: 'Ace Maneuver',
      description: 'Performs an impossible maneuver that dodges all incoming attacks for 5 seconds while dealing 200% damage.',
      cooldown: 4500,
      effect: 'Invulnerable for 5 seconds, deal 200% damage'
    },
    personality: 'Confident, daring, and slightly reckless',
    background: 'Tournament champion turned military pilot with 200+ confirmed kills'
  },
  {
    id: 'master-engineer',
    name: 'Master Engineer',
    description: 'A brilliant engineer capable of optimizing ship systems and performing miraculous repairs. Can keep any ship running beyond its limits.',
    lore: 'Master Engineers are wizards of technology. They understand ships on a fundamental level that borders on the supernatural. Stories tell of Master Engineers keeping destroyed ships fighting long enough to win battles, or coaxing 200% performance from standard engines.',
    class: 'Engineer' as OfficerClass,
    rank: 'A' as Rank,
    rarity: 'Legendary' as Rarity,
    tier: 5,
    level: 1,
    maxLevel: 95,
    baseStats: {
      leadership: 70,
      tactics: 60,
      combat: 50,
      intelligence: 130,
      charisma: 65,
      luck: 55
    },
    skills: [
      {
        id: 'system-optimization',
        name: 'System Optimization',
        description: 'Optimizes all ship systems for peak performance beyond design specifications.',
        effect: '+25% all ship stats',
        maxLevel: 15,
        currentLevel: 1
      },
      {
        id: 'rapid-repairs',
        name: 'Rapid Repairs',
        description: 'Can perform repairs at incredible speed with minimal resources.',
        effect: '+50% repair speed, -30% repair costs',
        maxLevel: 12,
        currentLevel: 1
      },
      {
        id: 'emergency-power',
        name: 'Emergency Power',
        description: 'Can redirect power systems to provide emergency boosts when needed.',
        effect: 'Can overcharge systems for +50% performance temporarily',
        maxLevel: 10,
        currentLevel: 1
      }
    ],
    bonuses: {
      shipStats: 25,
      repairSpeed: 50,
      repairCostReduction: 30,
      resourceEfficiency: 20,
      buildSpeed: 15
    },
    cost: {
      credits: 500000
    },
    requirements: {
      level: 50,
      technologies: ['advanced_engineering_3', 'nanite_technology_2'],
      buildings: ['research_lab_6']
    },
    specialAbility: {
      name: 'Miracle Repair',
      description: 'Performs an impossible repair, instantly restoring a destroyed ship to 50% health and full functionality.',
      cooldown: 7200,
      effect: 'Restore destroyed ship to 50% health'
    },
    personality: 'Brilliant, eccentric, and obsessed with technology',
    background: 'Prodigy who revolutionized ship design at age 25'
  },
  {
    id: 'genius-scientist',
    name: 'Genius Scientist',
    description: 'A visionary researcher pushing the boundaries of known science. Their discoveries can change the course of civilizations.',
    lore: 'Genius Scientists are rare individuals who see connections others miss. They work on the bleeding edge of technology, often making breakthroughs that seem like magic to others. Their research has led to technological revolutions that reshaped galactic society.',
    class: 'Scientist' as OfficerClass,
    rank: 'S' as Rank,
    rarity: 'Mythic' as Rarity,
    tier: 6,
    level: 1,
    maxLevel: 110,
    baseStats: {
      leadership: 60,
      tactics: 55,
      combat: 30,
      intelligence: 150,
      charisma: 70,
      luck: 45
    },
    skills: [
      {
        id: 'breakthrough-research',
        name: 'Breakthrough Research',
        description: 'Revolutionary research methods dramatically accelerate technological advancement.',
        effect: '+40% research speed, -20% research costs',
        maxLevel: 20,
        currentLevel: 1
      },
      {
        id: 'theoretical-mastery',
        name: 'Theoretical Mastery',
        description: 'Deep understanding of fundamental physics unlocks new possibilities.',
        effect: 'Unlock advanced technologies earlier',
        maxLevel: 15,
        currentLevel: 1
      },
      {
        id: 'innovation',
        name: 'Innovation',
        description: 'Constant innovation provides random technological bonuses.',
        effect: 'Chance to gain bonus research points daily',
        maxLevel: 12,
        currentLevel: 1
      }
    ],
    bonuses: {
      researchSpeed: 40,
      researchCostReduction: 20,
      technologyEfficiency: 25,
      innovationChance: 15
    },
    cost: {
      credits: 1500000
    },
    requirements: {
      level: 70,
      technologies: ['quantum_physics_3', 'theoretical_science_3'],
      buildings: ['research_lab_8']
    },
    specialAbility: {
      name: 'Eureka Moment',
      description: 'Has a sudden breakthrough that instantly completes current research project or grants massive research points.',
      cooldown: 14400,
      effect: 'Complete current research or gain 50,000 research points'
    },
    personality: 'Brilliant, absent-minded, and obsessed with discovery',
    background: 'Nobel Prize winner at 30, revolutionized three fields of science'
  },
  {
    id: 'master-diplomat',
    name: 'Master Diplomat',
    description: 'A silver-tongued negotiator who can broker peace between warring factions or secure advantageous trade deals. Words are their weapon.',
    lore: 'Master Diplomats have prevented more wars than most generals have won. Their ability to find common ground, read people, and craft win-win scenarios makes them invaluable. Some say a Master Diplomat is worth ten fleets.',
    class: 'Diplomat' as OfficerClass,
    rank: 'A' as Rank,
    rarity: 'Legendary' as Rarity,
    tier: 5,
    level: 1,
    maxLevel: 90,
    baseStats: {
      leadership: 85,
      tactics: 70,
      combat: 25,
      intelligence: 110,
      charisma: 140,
      luck: 60
    },
    skills: [
      {
        id: 'master-negotiator',
        name: 'Master Negotiator',
        description: 'Exceptional negotiation skills secure better deals in all transactions.',
        effect: '+30% trade profits, -20% diplomatic costs',
        maxLevel: 15,
        currentLevel: 1
      },
      {
        id: 'alliance-builder',
        name: 'Alliance Builder',
        description: 'Natural talent for building and maintaining alliances.',
        effect: '+25% alliance benefits, faster reputation gain',
        maxLevel: 12,
        currentLevel: 1
      },
      {
        id: 'conflict-resolution',
        name: 'Conflict Resolution',
        description: 'Can de-escalate conflicts and prevent wars.',
        effect: 'Reduce war penalties, increase peace treaty benefits',
        maxLevel: 10,
        currentLevel: 1
      }
    ],
    bonuses: {
      tradeProfits: 30,
      diplomaticCostReduction: 20,
      allianceBenefits: 25,
      reputationGain: 40
    },
    cost: {
      credits: 750000
    },
    requirements: {
      level: 55,
      technologies: ['diplomacy_3', 'cultural_studies_2'],
      buildings: ['embassy_6']
    },
    specialAbility: {
      name: 'Peace Treaty',
      description: 'Negotiates an immediate ceasefire with any faction, ending hostilities and establishing trade relations.',
      cooldown: 10800,
      effect: 'End war with any faction, establish trade relations'
    },
    personality: 'Charming, persuasive, and politically savvy',
    background: 'Brokered the Treaty of Three Suns, ending a 50-year war'
  },
  {
    id: 'shadow-operative',
    name: 'Shadow Operative',
    description: 'A master spy and covert operations specialist. Invisible, deadly, and always one step ahead of the enemy.',
    lore: 'Shadow Operatives don\'t officially exist. They operate in the darkness between nations, gathering intelligence, sabotaging enemy operations, and eliminating high-value targets. Their successes are never celebrated, their failures never acknowledged.',
    class: 'Spy' as OfficerClass,
    rank: 'S' as Rank,
    rarity: 'Mythic' as Rarity,
    tier: 6,
    level: 1,
    maxLevel: 105,
    baseStats: {
      leadership: 65,
      tactics: 90,
      combat: 85,
      intelligence: 120,
      charisma: 75,
      luck: 80
    },
    skills: [
      {
        id: 'master-infiltrator',
        name: 'Master Infiltrator',
        description: 'Can infiltrate any facility and extract any information.',
        effect: '+50% espionage success rate, +40% intelligence gathered',
        maxLevel: 18,
        currentLevel: 1
      },
      {
        id: 'sabotage-expert',
        name: 'Sabotage Expert',
        description: 'Expert at sabotaging enemy operations and infrastructure.',
        effect: '+45% sabotage effectiveness, enemy production -25%',
        maxLevel: 15,
        currentLevel: 1
      },
      {
        id: 'ghost',
        name: 'Ghost',
        description: 'Nearly impossible to detect or track.',
        effect: '90% chance to avoid detection, cannot be counter-spied',
        maxLevel: 12,
        currentLevel: 1
      }
    ],
    bonuses: {
      espionageSuccess: 50,
      intelligenceGathered: 40,
      sabotageEffectiveness: 45,
      detectionAvoidance: 90
    },
    cost: {
      credits: 2000000
    },
    requirements: {
      level: 75,
      technologies: ['advanced_espionage_3', 'cloaking_technology_3'],
      buildings: ['intelligence_center_7']
    },
    specialAbility: {
      name: 'Black Ops',
      description: 'Executes a covert operation that can steal technology, sabotage production, or eliminate enemy officers.',
      cooldown: 10800,
      effect: 'Steal tech, sabotage enemy, or eliminate officer'
    },
    personality: 'Mysterious, calculating, and utterly ruthless',
    background: 'Classified - highest security clearance required'
  },
  {
    id: 'trade-tycoon',
    name: 'Trade Tycoon',
    description: 'A business genius who can turn any resource into profit. Master of markets, trade routes, and economic warfare.',
    lore: 'Trade Tycoons understand that credits are the lifeblood of empires. They can manipulate markets, establish monopolies, and generate wealth that rivals entire nations. Some say they\'re more powerful than admirals because they control the resources that fuel wars.',
    class: 'Merchant' as OfficerClass,
    rank: 'A' as Rank,
    rarity: 'Legendary' as Rarity,
    tier: 5,
    level: 1,
    maxLevel: 95,
    baseStats: {
      leadership: 80,
      tactics: 65,
      combat: 35,
      intelligence: 115,
      charisma: 105,
      luck: 90
    },
    skills: [
      {
        id: 'market-manipulation',
        name: 'Market Manipulation',
        description: 'Can influence market prices to maximize profits.',
        effect: '+35% trade profits, can manipulate market prices',
        maxLevel: 15,
        currentLevel: 1
      },
      {
        id: 'trade-empire',
        name: 'Trade Empire',
        description: 'Establishes vast trade networks that generate passive income.',
        effect: '+50% trade route income, +3 trade route slots',
        maxLevel: 12,
        currentLevel: 1
      },
      {
        id: 'resource-efficiency',
        name: 'Resource Efficiency',
        description: 'Optimizes resource usage across all operations.',
        effect: '-25% all costs, +20% resource production',
        maxLevel: 10,
        currentLevel: 1
      }
    ],
    bonuses: {
      tradeProfits: 35,
      tradeRouteIncome: 50,
      resourceProduction: 20,
      costReduction: 25,
      tradeRouteSlots: 3
    },
    cost: {
      credits: 1000000
    },
    requirements: {
      level: 60,
      technologies: ['advanced_economics_3', 'trade_networks_3'],
      buildings: ['trading_post_7']
    },
    specialAbility: {
      name: 'Market Crash',
      description: 'Manipulates markets to crash enemy economy while boosting your own, causing massive economic damage.',
      cooldown: 14400,
      effect: 'Enemy loses 30% resources, you gain 20% resources'
    },
    personality: 'Shrewd, ambitious, and always calculating profit',
    background: 'Built a trade empire from a single cargo ship'
  },
  {
    id: 'supreme-strategist',
    name: 'Supreme Strategist',
    description: 'A cosmic-level tactical genius who can predict enemy movements weeks in advance. Their strategies are studied in academies across the galaxy.',
    lore: 'Supreme Strategists are said to play chess while others play checkers. They see the entire board, predict moves dozens of turns ahead, and orchestrate victories that seem inevitable in hindsight. Their battle plans are works of art.',
    class: 'Strategist' as OfficerClass,
    rank: 'SS' as Rank,
    rarity: 'Cosmic' as Rarity,
    tier: 7,
    level: 1,
    maxLevel: 130,
    baseStats: {
      leadership: 140,
      tactics: 160,
      combat: 100,
      intelligence: 155,
      charisma: 135,
      luck: 85
    },
    skills: [
      {
        id: 'perfect-strategy',
        name: 'Perfect Strategy',
        description: 'Creates flawless battle plans that maximize victory chances.',
        effect: '+50% all fleet stats, +30% victory chance',
        maxLevel: 20,
        currentLevel: 1
      },
      {
        id: 'predictive-analysis',
        name: 'Predictive Analysis',
        description: 'Can predict enemy movements with uncanny accuracy.',
        effect: 'Reveal enemy fleet positions, predict enemy actions',
        maxLevel: 18,
        currentLevel: 1
      },
      {
        id: 'master-tactician',
        name: 'Master Tactician',
        description: 'Supreme tactical ability allows for impossible victories.',
        effect: 'Can win battles against superior forces',
        maxLevel: 15,
        currentLevel: 1
      },
      {
        id: 'strategic-dominance',
        name: 'Strategic Dominance',
        description: 'Dominates the strategic layer of warfare.',
        effect: '+40% all operations efficiency',
        maxLevel: 12,
        currentLevel: 1
      }
    ],
    bonuses: {
      allFleetStats: 50,
      victoryChance: 30,
      operationsEfficiency: 40,
      tacticalAdvantage: 45
    },
    cost: {
      credits: 5000000
    },
    requirements: {
      level: 100,
      technologies: ['supreme_tactics_3', 'strategic_mastery_3'],
      buildings: ['war_room_9']
    },
    specialAbility: {
      name: 'Perfect Victory',
      description: 'Executes a perfect strategy that guarantees victory with minimal losses, destroying enemy fleet while preserving your own.',
      cooldown: 21600,
      effect: 'Guaranteed victory, 90% fleet preservation'
    },
    personality: 'Calm, calculating, and always three steps ahead',
    background: 'Undefeated in 500 battles, author of "The Art of Cosmic War"'
  },
  {
    id: 'eternal-fleet-master',
    name: 'Eternal Fleet Master',
    description: 'A transcendent being who has mastered every aspect of warfare across multiple lifetimes. Their legend spans galaxies and epochs.',
    lore: 'The Eternal Fleet Master is more myth than person. Said to have commanded fleets for thousands of years, they possess knowledge of warfare that predates recorded history. Some believe they are immortal, others that the title passes to worthy successors. Either way, their mastery is absolute.',
    class: 'Admiral' as OfficerClass,
    rank: 'SSS' as Rank,
    rarity: 'Universal' as Rarity,
    tier: 8,
    level: 1,
    maxLevel: 150,
    baseStats: {
      leadership: 200,
      tactics: 200,
      combat: 150,
      intelligence: 180,
      charisma: 200,
      luck: 120
    },
    skills: [
      {
        id: 'eternal-mastery',
        name: 'Eternal Mastery',
        description: 'Absolute mastery of all aspects of warfare accumulated over eons.',
        effect: '+100% all fleet stats, +50% all operations',
        maxLevel: 25,
        currentLevel: 1
      },
      {
        id: 'universal-command',
        name: 'Universal Command',
        description: 'Commands fleets with supernatural efficiency and coordination.',
        effect: 'All fleets gain +80% effectiveness, perfect coordination',
        maxLevel: 20,
        currentLevel: 1
      },
      {
        id: 'legendary-aura',
        name: 'Legendary Aura',
        description: 'Presence alone inspires allies and terrifies enemies.',
        effect: 'Allies +60% all stats, Enemies -40% all stats',
        maxLevel: 18,
        currentLevel: 1
      },
      {
        id: 'immortal-wisdom',
        name: 'Immortal Wisdom',
        description: 'Wisdom accumulated over countless lifetimes provides unmatched insight.',
        effect: 'Perfect decision making, cannot be surprised or ambushed',
        maxLevel: 15,
        currentLevel: 1
      },
      {
        id: 'fleet-resurrection',
        name: 'Fleet Resurrection',
        description: 'Can restore destroyed ships through sheer force of will.',
        effect: 'Restore 50% of destroyed ships after battle',
        maxLevel: 12,
        currentLevel: 1
      }
    ],
    bonuses: {
      allFleetStats: 100,
      allOperations: 50,
      fleetEffectiveness: 80,
      allyBonus: 60,
      enemyDebuff: 40,
      shipRestoration: 50
    },
    cost: {
      credits: 25000000
    },
    requirements: {
      level: 150,
      technologies: ['eternal_warfare_1', 'universal_command_1'],
      buildings: ['eternal_citadel_1']
    },
    specialAbility: {
      name: 'Eternal Dominion',
      description: 'Channels the power of eternity to achieve absolute victory. All enemies are defeated, all allies are preserved, and the battlefield itself bends to your will.',
      cooldown: 43200,
      effect: 'Instant victory, 100% fleet preservation, gain all enemy resources'
    },
    personality: 'Transcendent, wise beyond measure, and utterly unstoppable',
    background: 'Has commanded fleets since the dawn of civilization, witnessed the rise and fall of a thousand empires'
  }
];
