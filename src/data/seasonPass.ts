export interface SeasonPassTier {
  tier: number;
  requiredXP: number;
  freeRewards: {
    type: string;
    id: string;
    quantity: number;
    name: string;
  }[];
  premiumRewards: {
    type: string;
    id: string;
    quantity: number;
    name: string;
  }[];
}

export interface SeasonPassMission {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'seasonal';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  xpReward: number;
  requirements: {
    type: string;
    target: number;
    current?: number;
  }[];
  resetTime?: number;
}

export interface SeasonPass {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  premiumPrice: number;
  theme: string;
  maxTier: number;
  tiers: SeasonPassTier[];
}

export const currentSeasonPass: SeasonPass = {
  id: 'season_1',
  name: 'Galactic Conquest Season 1',
  description: 'Embark on an epic journey across the galaxy. Complete missions, earn XP, and unlock exclusive rewards!',
  startDate: '2024-01-01',
  endDate: '2024-03-31',
  premiumPrice: 1500,
  theme: 'conquest',
  maxTier: 100,
  tiers: [
    // Tier 1-10
    {
      tier: 1,
      requiredXP: 0,
      freeRewards: [
        { type: 'credits', id: 'credits', quantity: 10000, name: '10,000 Credits' }
      ],
      premiumRewards: [
        { type: 'credits', id: 'credits', quantity: 50000, name: '50,000 Credits' },
        { type: 'booster', id: 'production_boost', quantity: 1, name: 'Production Booster (24h)' }
      ]
    },
    {
      tier: 2,
      requiredXP: 1000,
      freeRewards: [
        { type: 'metal', id: 'metal', quantity: 50000, name: '50,000 Metal' }
      ],
      premiumRewards: [
        { type: 'metal', id: 'metal', quantity: 200000, name: '200,000 Metal' },
        { type: 'crystal', id: 'crystal', quantity: 100000, name: '100,000 Crystal' }
      ]
    },
    {
      tier: 3,
      requiredXP: 2500,
      freeRewards: [
        { type: 'crystal', id: 'crystal', quantity: 25000, name: '25,000 Crystal' }
      ],
      premiumRewards: [
        { type: 'darkMatter', id: 'darkMatter', quantity: 500, name: '500 Dark Matter' },
        { type: 'booster', id: 'research_boost', quantity: 1, name: 'Research Accelerator (24h)' }
      ]
    },
    {
      tier: 4,
      requiredXP: 4500,
      freeRewards: [
        { type: 'deuterium', id: 'deuterium', quantity: 15000, name: '15,000 Deuterium' }
      ],
      premiumRewards: [
        { type: 'ship', id: 'season_fighter', quantity: 5, name: '5x Season Fighter' },
        { type: 'credits', id: 'credits', quantity: 100000, name: '100,000 Credits' }
      ]
    },
    {
      tier: 5,
      requiredXP: 7000,
      freeRewards: [
        { type: 'booster', id: 'production_boost', quantity: 1, name: 'Production Booster (24h)' }
      ],
      premiumRewards: [
        { type: 'cosmetic', id: 'season_skin_1', quantity: 1, name: 'Conquest Ship Skin' },
        { type: 'darkMatter', id: 'darkMatter', quantity: 1000, name: '1,000 Dark Matter' }
      ]
    },
    {
      tier: 6,
      requiredXP: 10000,
      freeRewards: [
        { type: 'credits', id: 'credits', quantity: 25000, name: '25,000 Credits' }
      ],
      premiumRewards: [
        { type: 'metal', id: 'metal', quantity: 500000, name: '500,000 Metal' },
        { type: 'crystal', id: 'crystal', quantity: 250000, name: '250,000 Crystal' }
      ]
    },
    {
      tier: 7,
      requiredXP: 13500,
      freeRewards: [
        { type: 'metal', id: 'metal', quantity: 75000, name: '75,000 Metal' }
      ],
      premiumRewards: [
        { type: 'blueprint', id: 'season_blueprint_1', quantity: 1, name: 'Conquest Destroyer Blueprint' },
        { type: 'booster', id: 'combat_boost', quantity: 2, name: '2x Combat Enhancer (24h)' }
      ]
    },
    {
      tier: 8,
      requiredXP: 17500,
      freeRewards: [
        { type: 'crystal', id: 'crystal', quantity: 40000, name: '40,000 Crystal' }
      ],
      premiumRewards: [
        { type: 'darkMatter', id: 'darkMatter', quantity: 1500, name: '1,500 Dark Matter' },
        { type: 'credits', id: 'credits', quantity: 150000, name: '150,000 Credits' }
      ]
    },
    {
      tier: 9,
      requiredXP: 22000,
      freeRewards: [
        { type: 'deuterium', id: 'deuterium', quantity: 25000, name: '25,000 Deuterium' }
      ],
      premiumRewards: [
        { type: 'officer', id: 'season_officer_1', quantity: 1, name: 'Commander Zara (Epic)' },
        { type: 'booster', id: 'xp_boost', quantity: 1, name: 'XP Multiplier (48h)' }
      ]
    },
    {
      tier: 10,
      requiredXP: 27000,
      freeRewards: [
        { type: 'booster', id: 'research_boost', quantity: 1, name: 'Research Accelerator (24h)' }
      ],
      premiumRewards: [
        { type: 'ship', id: 'season_cruiser', quantity: 1, name: 'Conquest Cruiser (Legendary)' },
        { type: 'cosmetic', id: 'season_avatar', quantity: 1, name: 'Conquest Avatar Frame' }
      ]
    },
    // Tier 11-25
    {
      tier: 15,
      requiredXP: 45000,
      freeRewards: [
        { type: 'credits', id: 'credits', quantity: 50000, name: '50,000 Credits' }
      ],
      premiumRewards: [
        { type: 'darkMatter', id: 'darkMatter', quantity: 2500, name: '2,500 Dark Matter' },
        { type: 'booster', id: 'production_boost', quantity: 3, name: '3x Production Booster (24h)' }
      ]
    },
    {
      tier: 20,
      requiredXP: 70000,
      freeRewards: [
        { type: 'metal', id: 'metal', quantity: 150000, name: '150,000 Metal' }
      ],
      premiumRewards: [
        { type: 'ship', id: 'season_battleship', quantity: 1, name: 'Conquest Battleship (Legendary)' },
        { type: 'cosmetic', id: 'season_effect', quantity: 1, name: 'Conquest Trail Effect' }
      ]
    },
    {
      tier: 25,
      requiredXP: 100000,
      freeRewards: [
        { type: 'booster', id: 'combat_boost', quantity: 1, name: 'Combat Enhancer (24h)' }
      ],
      premiumRewards: [
        { type: 'blueprint', id: 'season_blueprint_2', quantity: 1, name: 'Conquest Titan Blueprint' },
        { type: 'darkMatter', id: 'darkMatter', quantity: 5000, name: '5,000 Dark Matter' }
      ]
    },
    // Tier 30-50
    {
      tier: 30,
      requiredXP: 135000,
      freeRewards: [
        { type: 'crystal', id: 'crystal', quantity: 100000, name: '100,000 Crystal' }
      ],
      premiumRewards: [
        { type: 'officer', id: 'season_officer_2', quantity: 1, name: 'Admiral Kross (Legendary)' },
        { type: 'booster', id: 'xp_boost', quantity: 2, name: '2x XP Multiplier (48h)' }
      ]
    },
    {
      tier: 40,
      requiredXP: 220000,
      freeRewards: [
        { type: 'deuterium', id: 'deuterium', quantity: 75000, name: '75,000 Deuterium' }
      ],
      premiumRewards: [
        { type: 'ship', id: 'season_carrier', quantity: 1, name: 'Conquest Carrier (Mythic)' },
        { type: 'cosmetic', id: 'season_skin_2', quantity: 1, name: 'Elite Conquest Skin' }
      ]
    },
    {
      tier: 50,
      requiredXP: 325000,
      freeRewards: [
        { type: 'darkMatter', id: 'darkMatter', quantity: 1000, name: '1,000 Dark Matter' }
      ],
      premiumRewards: [
        { type: 'ship', id: 'season_flagship', quantity: 1, name: 'Conquest Flagship (Mythic)' },
        { type: 'cosmetic', id: 'season_title', quantity: 1, name: 'Galactic Conqueror Title' },
        { type: 'darkMatter', id: 'darkMatter', quantity: 10000, name: '10,000 Dark Matter' }
      ]
    },
    // Tier 75
    {
      tier: 75,
      requiredXP: 600000,
      freeRewards: [
        { type: 'credits', id: 'credits', quantity: 250000, name: '250,000 Credits' }
      ],
      premiumRewards: [
        { type: 'officer', id: 'season_officer_3', quantity: 1, name: 'Supreme Commander (Mythic)' },
        { type: 'cosmetic', id: 'season_avatar_2', quantity: 1, name: 'Legendary Avatar Frame' },
        { type: 'darkMatter', id: 'darkMatter', quantity: 15000, name: '15,000 Dark Matter' }
      ]
    },
    // Tier 100 - Final Reward
    {
      tier: 100,
      requiredXP: 1000000,
      freeRewards: [
        { type: 'darkMatter', id: 'darkMatter', quantity: 5000, name: '5,000 Dark Matter' },
        { type: 'cosmetic', id: 'season_badge', quantity: 1, name: 'Season 1 Completion Badge' }
      ],
      premiumRewards: [
        { type: 'ship', id: 'season_ultimate', quantity: 1, name: 'Ultimate Conquest Dreadnought (Universal)' },
        { type: 'cosmetic', id: 'season_ultimate_skin', quantity: 1, name: 'Ultimate Conquest Skin Collection' },
        { type: 'cosmetic', id: 'season_ultimate_title', quantity: 1, name: 'Supreme Galactic Emperor Title' },
        { type: 'darkMatter', id: 'darkMatter', quantity: 50000, name: '50,000 Dark Matter' },
        { type: 'exoticMatter', id: 'exoticMatter', quantity: 10000, name: '10,000 Exotic Matter' }
      ]
    }
  ]
};

export const seasonPassMissions: SeasonPassMission[] = [
  // Daily Missions
  {
    id: 'daily_1',
    name: 'Resource Collector',
    description: 'Collect 100,000 metal from your mines',
    type: 'daily',
    difficulty: 'easy',
    xpReward: 500,
    requirements: [
      { type: 'collect_metal', target: 100000 }
    ]
  },
  {
    id: 'daily_2',
    name: 'Fleet Commander',
    description: 'Send a fleet on any mission',
    type: 'daily',
    difficulty: 'easy',
    xpReward: 500,
    requirements: [
      { type: 'send_fleet', target: 1 }
    ]
  },
  {
    id: 'daily_3',
    name: 'Research Progress',
    description: 'Complete or advance any research',
    type: 'daily',
    difficulty: 'easy',
    xpReward: 500,
    requirements: [
      { type: 'research_progress', target: 1 }
    ]
  },
  {
    id: 'daily_4',
    name: 'Builder',
    description: 'Start construction of any building',
    type: 'daily',
    difficulty: 'easy',
    xpReward: 500,
    requirements: [
      { type: 'build_structure', target: 1 }
    ]
  },
  {
    id: 'daily_5',
    name: 'Ship Production',
    description: 'Build 10 ships of any type',
    type: 'daily',
    difficulty: 'medium',
    xpReward: 750,
    requirements: [
      { type: 'build_ships', target: 10 }
    ]
  },
  {
    id: 'daily_6',
    name: 'Combat Ready',
    description: 'Win 3 battles',
    type: 'daily',
    difficulty: 'medium',
    xpReward: 1000,
    requirements: [
      { type: 'win_battles', target: 3 }
    ]
  },

  // Weekly Missions
  {
    id: 'weekly_1',
    name: 'Empire Expansion',
    description: 'Upgrade 5 buildings to any level',
    type: 'weekly',
    difficulty: 'medium',
    xpReward: 3000,
    requirements: [
      { type: 'upgrade_buildings', target: 5 }
    ]
  },
  {
    id: 'weekly_2',
    name: 'Fleet Admiral',
    description: 'Complete 20 fleet missions',
    type: 'weekly',
    difficulty: 'medium',
    xpReward: 3500,
    requirements: [
      { type: 'complete_missions', target: 20 }
    ]
  },
  {
    id: 'weekly_3',
    name: 'Technology Advancement',
    description: 'Complete 3 research projects',
    type: 'weekly',
    difficulty: 'hard',
    xpReward: 5000,
    requirements: [
      { type: 'complete_research', target: 3 }
    ]
  },
  {
    id: 'weekly_4',
    name: 'Resource Tycoon',
    description: 'Collect 5,000,000 total resources',
    type: 'weekly',
    difficulty: 'hard',
    xpReward: 4000,
    requirements: [
      { type: 'collect_resources', target: 5000000 }
    ]
  },
  {
    id: 'weekly_5',
    name: 'Warrior',
    description: 'Win 25 battles',
    type: 'weekly',
    difficulty: 'hard',
    xpReward: 5000,
    requirements: [
      { type: 'win_battles', target: 25 }
    ]
  },
  {
    id: 'weekly_6',
    name: 'Shipyard Master',
    description: 'Build 100 ships',
    type: 'weekly',
    difficulty: 'extreme',
    xpReward: 6000,
    requirements: [
      { type: 'build_ships', target: 100 }
    ]
  },

  // Seasonal Missions
  {
    id: 'seasonal_1',
    name: 'Galactic Domination',
    description: 'Win 500 battles this season',
    type: 'seasonal',
    difficulty: 'extreme',
    xpReward: 25000,
    requirements: [
      { type: 'win_battles', target: 500 }
    ]
  },
  {
    id: 'seasonal_2',
    name: 'Master Builder',
    description: 'Upgrade 50 buildings this season',
    type: 'seasonal',
    difficulty: 'extreme',
    xpReward: 20000,
    requirements: [
      { type: 'upgrade_buildings', target: 50 }
    ]
  },
  {
    id: 'seasonal_3',
    name: 'Research Genius',
    description: 'Complete 25 research projects this season',
    type: 'seasonal',
    difficulty: 'extreme',
    xpReward: 30000,
    requirements: [
      { type: 'complete_research', target: 25 }
    ]
  },
  {
    id: 'seasonal_4',
    name: 'Fleet Commander Supreme',
    description: 'Complete 1,000 fleet missions this season',
    type: 'seasonal',
    difficulty: 'extreme',
    xpReward: 35000,
    requirements: [
      { type: 'complete_missions', target: 1000 }
    ]
  },
  {
    id: 'seasonal_5',
    name: 'Resource Empire',
    description: 'Collect 100,000,000 total resources this season',
    type: 'seasonal',
    difficulty: 'extreme',
    xpReward: 40000,
    requirements: [
      { type: 'collect_resources', target: 100000000 }
    ]
  }
];
