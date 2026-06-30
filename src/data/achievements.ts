import { Achievement, Rank, Rarity } from '../types/gameTypes';

export const achievements: Achievement[] = [
  // Combat Achievements
  {
    id: 'first-blood',
    name: 'First Blood',
    description: 'Win your first combat engagement and prove you have what it takes to survive in the hostile galaxy.',
    lore: 'Every warrior remembers their first victory. It\'s the moment when theory becomes reality, when training meets the chaos of actual combat. This is where legends begin.',
    category: 'Combat',
    rank: 'E' as Rank,
    rarity: 'Common' as Rarity,
    tier: 1,
    requirements: {
      combatVictories: 1
    },
    progress: 0,
    maxProgress: 1,
    rewards: {
      credits: 5000,
      experience: 100,
      title: 'Rookie Fighter'
    },
    icon: 'ri-sword-line',
    hidden: false,
    completedAt: null,
    flavorText: 'The first step on a long journey.',
    tips: 'Complete any combat mission or attack another player to earn this achievement.'
  },
  {
    id: 'veteran-warrior',
    name: 'Veteran Warrior',
    description: 'Achieve 100 combat victories and establish yourself as a formidable force in the galaxy.',
    lore: 'A hundred battles survived means you\'ve learned the hard lessons. You know when to fight, when to flee, and how to turn defeat into victory. Enemies now think twice before engaging you.',
    category: 'Combat',
    rank: 'D' as Rank,
    rarity: 'Uncommon' as Rarity,
    tier: 2,
    requirements: {
      combatVictories: 100
    },
    progress: 0,
    maxProgress: 100,
    rewards: {
      credits: 25000,
      experience: 1000,
      title: 'Veteran Warrior',
      item: 'plasma-cannon'
    },
    icon: 'ri-sword-fill',
    hidden: false,
    completedAt: null,
    flavorText: 'Battle-tested and proven.',
    tips: 'Win 100 combat engagements through missions, PvP, or fleet battles.'
  },
  {
    id: 'elite-combatant',
    name: 'Elite Combatant',
    description: 'Dominate the battlefield with 500 victories. Your tactical prowess is recognized across multiple sectors.',
    lore: 'Five hundred victories is no accident. It requires skill, strategy, and an intimate understanding of warfare. Military academies study your tactics. Admirals seek your counsel.',
    category: 'Combat',
    rank: 'C' as Rank,
    rarity: 'Rare' as Rarity,
    tier: 3,
    requirements: {
      combatVictories: 500
    },
    progress: 0,
    maxProgress: 500,
    rewards: {
      credits: 100000,
      experience: 5000,
      title: 'Elite Combatant',
      item: 'ion-disruptor',
      officer: 'basic-commander'
    },
    icon: 'ri-shield-star-line',
    hidden: false,
    completedAt: null,
    flavorText: 'A master of warfare.',
    tips: 'Continue winning battles. Focus on efficient fleet compositions and tactical advantages.'
  },
  {
    id: 'legendary-champion',
    name: 'Legendary Champion',
    description: 'Achieve 2000 victories and become a living legend. Songs are sung of your conquests across the galaxy.',
    lore: 'Two thousand victories. Entire civilizations have risen and fallen in less time. You are no longer just a warrior—you are a force of nature, an inevitable tide that sweeps away all opposition.',
    category: 'Combat',
    rank: 'B' as Rank,
    rarity: 'Epic' as Rarity,
    tier: 4,
    requirements: {
      combatVictories: 2000
    },
    progress: 0,
    maxProgress: 2000,
    rewards: {
      credits: 500000,
      experience: 25000,
      title: 'Legendary Champion',
      item: 'graviton-beam',
      officer: 'elite-commander',
      ship: 'assault-frigate'
    },
    icon: 'ri-shield-star-fill',
    hidden: false,
    completedAt: null,
    flavorText: 'Your legend echoes through the stars.',
    tips: 'Participate in alliance wars and world boss battles for faster progress.'
  },
  {
    id: 'eternal-warrior',
    name: 'Eternal Warrior',
    description: 'Achieve an impossible 10,000 victories. You are the embodiment of war itself, unstoppable and eternal.',
    lore: 'Ten thousand victories. Historians will debate whether you are mortal or myth. Entire star systems surrender at the mere mention of your name. You have transcended combat—you have become war incarnate.',
    category: 'Combat',
    rank: 'SSS' as Rank,
    rarity: 'Universal' as Rarity,
    tier: 8,
    requirements: {
      combatVictories: 10000
    },
    progress: 0,
    maxProgress: 10000,
    rewards: {
      credits: 10000000,
      experience: 500000,
      title: 'Eternal Warrior',
      item: 'eternal-devastator',
      officer: 'eternal-fleet-master',
      ship: 'eternal-mothership'
    },
    icon: 'ri-vip-crown-fill',
    hidden: false,
    completedAt: null,
    flavorText: 'War eternal.',
    tips: 'This is the ultimate combat achievement. Dedicate yourself to mastering all aspects of warfare.'
  },

  // Fleet Achievements
  {
    id: 'fleet-builder',
    name: 'Fleet Builder',
    description: 'Construct your first fleet of 10 ships and begin your journey to galactic dominance.',
    lore: 'A single ship is a vessel. Ten ships is a fleet. With a fleet, you can project power, defend territory, and make your mark on the galaxy.',
    category: 'Fleet',
    rank: 'E' as Rank,
    rarity: 'Common' as Rarity,
    tier: 1,
    requirements: {
      totalShips: 10
    },
    progress: 0,
    maxProgress: 10,
    rewards: {
      credits: 10000,
      experience: 200,
      title: 'Fleet Commander'
    },
    icon: 'ri-rocket-line',
    hidden: false,
    completedAt: null,
    flavorText: 'Every armada starts somewhere.',
    tips: 'Build ships at your shipyard. Start with fighters and corvettes for cost efficiency.'
  },
  {
    id: 'armada-commander',
    name: 'Armada Commander',
    description: 'Command a massive armada of 100 ships. Your fleet is a force to be reckoned with.',
    lore: 'A hundred ships under your command means you control real power. You can defend systems, launch invasions, and enforce your will across multiple sectors.',
    category: 'Fleet',
    rank: 'C' as Rank,
    rarity: 'Rare' as Rarity,
    tier: 3,
    requirements: {
      totalShips: 100
    },
    progress: 0,
    maxProgress: 100,
    rewards: {
      credits: 150000,
      experience: 8000,
      title: 'Armada Commander',
      item: 'adaptive-shield'
    },
    icon: 'ri-rocket-2-line',
    hidden: false,
    completedAt: null,
    flavorText: 'Command the void.',
    tips: 'Expand your shipyards and optimize production. Balance your fleet composition.'
  },
  {
    id: 'fleet-master',
    name: 'Fleet Master',
    description: 'Control an overwhelming force of 500 ships. Few can match your naval supremacy.',
    lore: 'Five hundred warships. The logistics alone would break lesser commanders. But you have mastered the art of fleet management, turning hundreds of individual vessels into a single, devastating weapon.',
    category: 'Fleet',
    rank: 'A' as Rank,
    rarity: 'Legendary' as Rarity,
    tier: 5,
    requirements: {
      totalShips: 500
    },
    progress: 0,
    maxProgress: 500,
    rewards: {
      credits: 1000000,
      experience: 50000,
      title: 'Fleet Master',
      item: 'quantum-barrier',
      officer: 'legendary-admiral',
      ship: 'battle-cruiser'
    },
    icon: 'ri-rocket-2-fill',
    hidden: false,
    completedAt: null,
    flavorText: 'The galaxy trembles.',
    tips: 'Maximize shipyard efficiency, research advanced ship technologies, and manage resources carefully.'
  },

  // Research Achievements
  {
    id: 'researcher',
    name: 'Researcher',
    description: 'Complete your first research project and unlock the path to technological advancement.',
    lore: 'Knowledge is power. Your first research project opens doors to possibilities you never imagined. The universe is full of secrets waiting to be discovered.',
    category: 'Research',
    rank: 'E' as Rank,
    rarity: 'Common' as Rarity,
    tier: 1,
    requirements: {
      researchCompleted: 1
    },
    progress: 0,
    maxProgress: 1,
    rewards: {
      credits: 5000,
      experience: 150,
      researchPoints: 1000
    },
    icon: 'ri-flask-line',
    hidden: false,
    completedAt: null,
    flavorText: 'The first discovery.',
    tips: 'Start with basic technologies like Energy Technology or Computer Technology.'
  },
  {
    id: 'tech-pioneer',
    name: 'Tech Pioneer',
    description: 'Complete 50 research projects and establish yourself as a technological innovator.',
    lore: 'Fifty breakthroughs. Each one builds upon the last, creating a foundation of knowledge that sets you apart from your peers. Your scientists are the envy of the galaxy.',
    category: 'Research',
    rank: 'C' as Rank,
    rarity: 'Rare' as Rarity,
    tier: 3,
    requirements: {
      researchCompleted: 50
    },
    progress: 0,
    maxProgress: 50,
    rewards: {
      credits: 200000,
      experience: 10000,
      researchPoints: 50000,
      title: 'Tech Pioneer'
    },
    icon: 'ri-flask-fill',
    hidden: false,
    completedAt: null,
    flavorText: 'Innovation drives progress.',
    tips: 'Build multiple research labs and recruit scientist officers to speed up research.'
  },
  {
    id: 'knowledge-master',
    name: 'Knowledge Master',
    description: 'Complete 200 research projects and achieve mastery over multiple scientific disciplines.',
    lore: 'Two hundred completed projects represents decades of dedicated research. You have pushed the boundaries of known science and ventured into realms others fear to explore.',
    category: 'Research',
    rank: 'S' as Rank,
    rarity: 'Mythic' as Rarity,
    tier: 6,
    requirements: {
      researchCompleted: 200
    },
    progress: 0,
    maxProgress: 200,
    rewards: {
      credits: 3000000,
      experience: 100000,
      researchPoints: 500000,
      title: 'Knowledge Master',
      officer: 'genius-scientist'
    },
    icon: 'ri-lightbulb-fill',
    hidden: false,
    completedAt: null,
    flavorText: 'Master of all sciences.',
    tips: 'Focus on completing research trees. Exotic technologies provide the greatest benefits.'
  },

  // Economic Achievements
  {
    id: 'miner',
    name: 'Miner',
    description: 'Mine 100,000 metal and begin building your economic foundation.',
    lore: 'Metal is the backbone of any empire. Without it, ships cannot be built, stations cannot be constructed, and expansion grinds to a halt.',
    category: 'Economic',
    rank: 'E' as Rank,
    rarity: 'Common' as Rarity,
    tier: 1,
    requirements: {
      metalMined: 100000
    },
    progress: 0,
    maxProgress: 100000,
    rewards: {
      credits: 8000,
      experience: 200,
      metal: 10000
    },
    icon: 'ri-copper-coin-line',
    hidden: false,
    completedAt: null,
    flavorText: 'Dig deep.',
    tips: 'Upgrade metal mines and research mining technologies for faster production.'
  },
  {
    id: 'resource-tycoon',
    name: 'Resource Tycoon',
    description: 'Accumulate 10 million total resources and establish yourself as an economic powerhouse.',
    lore: 'Ten million resources. You control wealth that rivals entire star systems. Your economic power allows you to fund massive fleets, conduct extensive research, and influence galactic markets.',
    category: 'Economic',
    rank: 'B' as Rank,
    rarity: 'Epic' as Rarity,
    tier: 4,
    requirements: {
      totalResources: 10000000
    },
    progress: 0,
    maxProgress: 10000000,
    rewards: {
      credits: 750000,
      experience: 30000,
      title: 'Resource Tycoon',
      officer: 'trade-tycoon'
    },
    icon: 'ri-coins-fill',
    hidden: false,
    completedAt: null,
    flavorText: 'Wealth beyond measure.',
    tips: 'Establish trade routes, upgrade all resource production buildings, and trade efficiently.'
  },
  {
    id: 'economic-emperor',
    name: 'Economic Emperor',
    description: 'Control 100 million total resources. Your economic empire spans the galaxy.',
    lore: 'One hundred million resources. You don\'t just participate in the galactic economy—you control it. Markets shift at your whim. Entire sectors depend on your trade networks.',
    category: 'Economic',
    rank: 'A' as Rank,
    rarity: 'Legendary' as Rarity,
    tier: 5,
    requirements: {
      totalResources: 100000000
    },
    progress: 0,
    maxProgress: 100000000,
    rewards: {
      credits: 5000000,
      experience: 150000,
      title: 'Economic Emperor',
      metal: 1000000,
      crystal: 500000,
      deuterium: 250000
    },
    icon: 'ri-vip-diamond-fill',
    hidden: false,
    completedAt: null,
    flavorText: 'The galaxy is your market.',
    tips: 'Maximize all production, dominate trade routes, and invest in economic technologies.'
  },

  // Exploration Achievements
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Discover 10 new systems and begin mapping the unknown reaches of space.',
    lore: 'The galaxy is vast and full of mysteries. Every new system discovered could hold riches, dangers, or secrets that change everything.',
    category: 'Exploration',
    rank: 'E' as Rank,
    rarity: 'Common' as Rarity,
    tier: 1,
    requirements: {
      systemsDiscovered: 10
    },
    progress: 0,
    maxProgress: 10,
    rewards: {
      credits: 15000,
      experience: 300,
      title: 'Explorer'
    },
    icon: 'ri-compass-3-line',
    hidden: false,
    completedAt: null,
    flavorText: 'Chart the unknown.',
    tips: 'Send scout ships to unexplored systems. Each discovery grants rewards.'
  },
  {
    id: 'sector-surveyor',
    name: 'Sector Surveyor',
    description: 'Map 100 systems and become an expert in galactic geography.',
    lore: 'A hundred systems mapped means you understand the layout of entire sectors. You know the shortcuts, the dangers, and the opportunities that others miss.',
    category: 'Exploration',
    rank: 'C' as Rank,
    rarity: 'Rare' as Rarity,
    tier: 3,
    requirements: {
      systemsDiscovered: 100
    },
    progress: 0,
    maxProgress: 100,
    rewards: {
      credits: 250000,
      experience: 12000,
      title: 'Sector Surveyor',
      ship: 'scout-fighter'
    },
    icon: 'ri-compass-3-fill',
    hidden: false,
    completedAt: null,
    flavorText: 'Know the galaxy.',
    tips: 'Systematic exploration yields the best results. Don\'t skip systems.'
  },
  {
    id: 'universe-mapper',
    name: 'Universe Mapper',
    description: 'Discover 1000 systems and achieve legendary status as a master explorer.',
    lore: 'One thousand systems. You have ventured further than most dare to dream. Your maps are priceless, your knowledge of the galaxy unmatched. Entire expeditions are planned using your data.',
    category: 'Exploration',
    rank: 'S' as Rank,
    rarity: 'Mythic' as Rarity,
    tier: 6,
    requirements: {
      systemsDiscovered: 1000
    },
    progress: 0,
    maxProgress: 1000,
    rewards: {
      credits: 4000000,
      experience: 120000,
      title: 'Universe Mapper',
      ship: 'fleet-carrier',
      item: 'dimensional-drive'
    },
    icon: 'ri-global-fill',
    hidden: false,
    completedAt: null,
    flavorText: 'The galaxy holds no secrets.',
    tips: 'Use advanced propulsion systems to explore distant regions faster.'
  },

  // Conquest Achievements
  {
    id: 'conqueror',
    name: 'Conqueror',
    description: 'Capture 5 enemy planets and begin building your empire through conquest.',
    lore: 'Conquest is the oldest path to power. Taking what others have built and making it your own. Five planets is just the beginning.',
    category: 'Conquest',
    rank: 'D' as Rank,
    rarity: 'Uncommon' as Rarity,
    tier: 2,
    requirements: {
      planetsCaptured: 5
    },
    progress: 0,
    maxProgress: 5,
    rewards: {
      credits: 50000,
      experience: 2000,
      title: 'Conqueror'
    },
    icon: 'ri-flag-line',
    hidden: false,
    completedAt: null,
    flavorText: 'Claim what is yours.',
    tips: 'Attack weaker players or NPC planets. Ensure your fleet is strong enough before attacking.'
  },
  {
    id: 'sector-dominator',
    name: 'Sector Dominator',
    description: 'Conquer 50 planets and establish dominance over entire sectors.',
    lore: 'Fifty conquered worlds. You are no longer just a conqueror—you are a warlord, a force that reshapes the political landscape of the galaxy.',
    category: 'Conquest',
    rank: 'B' as Rank,
    rarity: 'Epic' as Rarity,
    tier: 4,
    requirements: {
      planetsCaptured: 50
    },
    progress: 0,
    maxProgress: 50,
    rewards: {
      credits: 1000000,
      experience: 40000,
      title: 'Sector Dominator',
      officer: 'veteran-admiral',
      ship: 'tactical-destroyer'
    },
    icon: 'ri-flag-fill',
    hidden: false,
    completedAt: null,
    flavorText: 'Bend sectors to your will.',
    tips: 'Coordinate with your alliance for large-scale conquests. Defend captured planets well.'
  },
  {
    id: 'universal-dominator',
    name: 'Universal Dominator',
    description: 'Conquer 500 planets and achieve absolute dominance. The galaxy bows before you.',
    lore: 'Five hundred worlds under your banner. You have built an empire that spans the galaxy. Your name is synonymous with conquest, your will is law across countless systems.',
    category: 'Conquest',
    rank: 'SS' as Rank,
    rarity: 'Cosmic' as Rarity,
    tier: 7,
    requirements: {
      planetsCaptured: 500
    },
    progress: 0,
    maxProgress: 500,
    rewards: {
      credits: 15000000,
      experience: 300000,
      title: 'Universal Dominator',
      ship: 'supreme-titan',
      officer: 'supreme-strategist',
      item: 'cosmic-annihilator'
    },
    icon: 'ri-vip-crown-2-fill',
    hidden: false,
    completedAt: null,
    flavorText: 'The galaxy is yours.',
    tips: 'This requires sustained military superiority and excellent resource management.'
  },

  // Special Achievements
  {
    id: 'alliance-founder',
    name: 'Alliance Founder',
    description: 'Create an alliance and unite players under your banner.',
    lore: 'Alone we are strong. Together we are unstoppable. By founding an alliance, you create something greater than yourself—a legacy that will outlive any single player.',
    category: 'Special',
    rank: 'C' as Rank,
    rarity: 'Rare' as Rarity,
    tier: 3,
    requirements: {
      allianceCreated: 1
    },
    progress: 0,
    maxProgress: 1,
    rewards: {
      credits: 100000,
      experience: 5000,
      title: 'Alliance Founder'
    },
    icon: 'ri-team-fill',
    hidden: false,
    completedAt: null,
    flavorText: 'Unity is strength.',
    tips: 'Build a strong alliance by recruiting active players and establishing clear goals.'
  },
  {
    id: 'master-trader',
    name: 'Master Trader',
    description: 'Complete 1000 successful trades and become a legend in galactic commerce.',
    lore: 'A thousand deals closed. You understand markets, people, and the art of negotiation. Your trade network spans the galaxy, and your profit margins are the stuff of legend.',
    category: 'Special',
    rank: 'A' as Rank,
    rarity: 'Legendary' as Rarity,
    tier: 5,
    requirements: {
      tradesCompleted: 1000
    },
    progress: 0,
    maxProgress: 1000,
    rewards: {
      credits: 2000000,
      experience: 60000,
      title: 'Master Trader',
      officer: 'trade-tycoon'
    },
    icon: 'ri-exchange-fill',
    hidden: false,
    completedAt: null,
    flavorText: 'Profit in all things.',
    tips: 'Use the marketplace frequently, establish trade routes, and monitor market prices.'
  },
  {
    id: 'artifact-hunter',
    name: 'Artifact Hunter',
    description: 'Collect 50 ancient artifacts and uncover the secrets of lost civilizations.',
    lore: 'Ancient artifacts hold power and knowledge from civilizations long dead. Each one is a piece of a larger puzzle, a glimpse into what came before.',
    category: 'Special',
    rank: 'B' as Rank,
    rarity: 'Epic' as Rarity,
    tier: 4,
    requirements: {
      artifactsCollected: 50
    },
    progress: 0,
    maxProgress: 50,
    rewards: {
      credits: 800000,
      experience: 35000,
      title: 'Artifact Hunter',
      researchPoints: 100000
    },
    icon: 'ri-ancient-gate-fill',
    hidden: false,
    completedAt: null,
    flavorText: 'Uncover the past.',
    tips: 'Explore dangerous sectors, complete special missions, and participate in events.'
  },
  {
    id: 'world-boss-slayer',
    name: 'World Boss Slayer',
    description: 'Defeat 10 world bosses and prove your strength against the galaxy\'s greatest threats.',
    lore: 'World bosses are legendary entities that threaten entire sectors. Defeating even one requires coordination, power, and courage. Ten victories marks you as a true hero.',
    category: 'Special',
    rank: 'A' as Rank,
    rarity: 'Legendary' as Rarity,
    tier: 5,
    requirements: {
      worldBossesDefeated: 10
    },
    progress: 0,
    maxProgress: 10,
    rewards: {
      credits: 3000000,
      experience: 100000,
      title: 'World Boss Slayer',
      item: 'reality-ripper',
      ship: 'titan-dreadnought'
    },
    icon: 'ri-skull-2-fill',
    hidden: false,
    completedAt: null,
    flavorText: 'Slay the unkillable.',
    tips: 'Coordinate with your alliance. World bosses require multiple players to defeat.'
  },
  {
    id: 'perfect-empire',
    name: 'Perfect Empire',
    description: 'Achieve maximum level in all building types and create the perfect empire.',
    lore: 'A perfect empire is one where every system operates at peak efficiency. Every building maximized, every resource optimized, every citizen productive. It is the dream of every ruler.',
    category: 'Special',
    rank: 'S' as Rank,
    rarity: 'Mythic' as Rarity,
    tier: 6,
    requirements: {
      allBuildingsMaxLevel: 1
    },
    progress: 0,
    maxProgress: 1,
    rewards: {
      credits: 10000000,
      experience: 250000,
      title: 'Perfect Emperor',
      metal: 5000000,
      crystal: 3000000,
      deuterium: 1000000
    },
    icon: 'ri-building-4-fill',
    hidden: false,
    completedAt: null,
    flavorText: 'Perfection achieved.',
    tips: 'This requires massive resources and time. Focus on one planet at a time.'
  },
  {
    id: 'ultimate-power',
    name: 'Ultimate Power',
    description: 'Reach level 150 and achieve the pinnacle of personal power.',
    lore: 'Level 150. You have transcended mortal limitations. Your power is absolute, your knowledge complete, your influence universal. You stand among the immortals.',
    category: 'Special',
    rank: 'SSS' as Rank,
    rarity: 'Universal' as Rarity,
    tier: 8,
    requirements: {
      playerLevel: 150
    },
    progress: 0,
    maxProgress: 150,
    rewards: {
      credits: 50000000,
      experience: 1000000,
      title: 'Eternal Legend',
      ship: 'eternal-mothership',
      officer: 'eternal-fleet-master',
      item: 'eternal-devastator'
    },
    icon: 'ri-vip-crown-2-fill',
    hidden: false,
    completedAt: null,
    flavorText: 'Transcend mortality.',
    tips: 'Complete all content, maximize all systems, and dedicate yourself to perfection.'
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Unlock all other achievements and prove you have mastered every aspect of the game.',
    lore: 'To complete everything is to truly understand the game. You have explored every corner, mastered every system, and achieved every goal. You are the ultimate player.',
    category: 'Special',
    rank: 'SSS' as Rank,
    rarity: 'Universal' as Rarity,
    tier: 8,
    requirements: {
      achievementsCompleted: 34
    },
    progress: 0,
    maxProgress: 34,
    rewards: {
      credits: 100000000,
      experience: 5000000,
      title: 'The Completionist',
      metal: 10000000,
      crystal: 10000000,
      deuterium: 10000000
    },
    icon: 'ri-trophy-fill',
    hidden: false,
    completedAt: null,
    flavorText: 'Master of all.',
    tips: 'Complete every other achievement in the game. This is the ultimate challenge.'
  }
];
