import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Technology {
  id: string;
  name: string;
  category: 'basic' | 'combat' | 'propulsion' | 'defense' | 'economy' | 'exotic' | 'quantum' | 'temporal' | 'dimensional';
  tier: number; // 1-999
  class: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Transcendent' | 'Cosmic' | 'Universal';
  level: number; // 1-999
  maxLevel: number; // 999
  type: 'passive' | 'active' | 'hybrid';
  status: 'available' | 'researching' | 'completed' | 'locked';
  researchProgress?: number;
  description: string;
  effects: {
    primary: string[];
    secondary: string[];
    special: string[];
  };
  stats: {
    powerRating: number;
    efficiency: number;
    complexity: number;
    stability: number;
    scalability: number;
  };
  subStats: {
    energyConsumption: number;
    processingSpeed: number;
    dataCapacity: number;
    quantumCoherence?: number;
    temporalStability?: number;
    dimensionalIntegrity?: number;
  };
  requirements: {
    metal: number;
    crystal: number;
    deuterium: number;
    darkMatter: number;
    antimatter: number;
    exoticMatter: number;
    time: string;
    researchPoints: number;
  };
  prerequisites: string[];
  unlocks: string[];
  synergies: {
    tech: string;
    bonus: string;
  }[];
  milestones: {
    level: number;
    reward: string;
  }[];
}

export default function AdvancedResearchPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [sortBy, setSortBy] = useState<'tier' | 'level' | 'power' | 'name'>('tier');

  const technologies: Technology[] = [
    {
      id: 'quantum-computing-core',
      name: 'Quantum Computing Core',
      category: 'quantum',
      tier: 150,
      class: 'Legendary',
      level: 87,
      maxLevel: 999,
      type: 'passive',
      status: 'completed',
      description: 'Harnesses quantum superposition and entanglement to perform calculations at unprecedented speeds, revolutionizing computational capabilities across all systems.',
      effects: {
        primary: ['+500% Research speed per level', '+300% Computer efficiency', '+1000 Fleet command slots per 10 levels'],
        secondary: ['+200% Data processing', '+150% AI effectiveness', '+100% Automation efficiency'],
        special: ['Unlocks Quantum Encryption', 'Enables Quantum Teleportation', 'Quantum Prediction algorithms']
      },
      stats: {
        powerRating: 8750,
        efficiency: 92,
        complexity: 88,
        stability: 95,
        scalability: 98
      },
      subStats: {
        energyConsumption: 45000,
        processingSpeed: 950000,
        dataCapacity: 8500000,
        quantumCoherence: 94
      },
      requirements: {
        metal: 85000000,
        crystal: 120000000,
        deuterium: 65000000,
        darkMatter: 15000,
        antimatter: 8500,
        exoticMatter: 2500,
        time: '87 days',
        researchPoints: 450000
      },
      prerequisites: ['Computer Technology Level 50', 'Quantum Physics Level 75', 'Advanced Mathematics Level 60'],
      unlocks: ['Quantum Encryption', 'Quantum Teleportation', 'Quantum AI'],
      synergies: [
        { tech: 'Neural Network Hub', bonus: '+50% Combined processing power' },
        { tech: 'Temporal Computing', bonus: '+100% Calculation speed' }
      ],
      milestones: [
        { level: 100, reward: 'Unlock Quantum Supercomputer' },
        { level: 250, reward: '+1000% Research speed bonus' },
        { level: 500, reward: 'Quantum Singularity Core' },
        { level: 999, reward: 'Universal Computing Matrix' }
      ]
    },
    {
      id: 'temporal-manipulation',
      name: 'Temporal Manipulation',
      category: 'temporal',
      tier: 500,
      class: 'Transcendent',
      level: 234,
      maxLevel: 999,
      type: 'active',
      status: 'completed',
      description: 'Bends the fabric of space-time itself, allowing manipulation of temporal flows for strategic advantages in construction, research, and combat.',
      effects: {
        primary: ['+1000% Time acceleration for all processes', '-90% Construction time', '-90% Research time'],
        secondary: ['+500% Fleet speed', 'Time dilation fields', 'Temporal shields'],
        special: ['Reverse time for repairs', 'Future sight predictions', 'Temporal paradox immunity']
      },
      stats: {
        powerRating: 23400,
        efficiency: 88,
        complexity: 99,
        stability: 75,
        scalability: 85
      },
      subStats: {
        energyConsumption: 250000,
        processingSpeed: 500000,
        dataCapacity: 2000000,
        temporalStability: 78
      },
      requirements: {
        metal: 500000000,
        crystal: 750000000,
        deuterium: 400000000,
        darkMatter: 100000,
        antimatter: 50000,
        exoticMatter: 25000,
        time: '234 days',
        researchPoints: 2500000
      },
      prerequisites: ['Hyperspace Technology Level 100', 'Quantum Physics Level 150', 'Astrophysics Level 200'],
      unlocks: ['Time Dilation Generators', 'Temporal Weapons', 'Chrono Shields'],
      synergies: [
        { tech: 'Dimensional Engineering', bonus: '+200% Temporal stability' },
        { tech: 'Quantum Computing Core', bonus: '+500% Prediction accuracy' }
      ],
      milestones: [
        { level: 250, reward: 'Time Reversal capability' },
        { level: 500, reward: 'Temporal Nexus access' },
        { level: 750, reward: 'Causality manipulation' },
        { level: 999, reward: 'Master of Time' }
      ]
    },
    {
      id: 'dimensional-engineering',
      name: 'Dimensional Engineering',
      category: 'dimensional',
      tier: 450,
      class: 'Transcendent',
      level: 189,
      maxLevel: 999,
      type: 'hybrid',
      status: 'completed',
      description: 'Manipulates higher dimensional spaces to create pocket dimensions, wormholes, and dimensional storage systems that defy conventional physics.',
      effects: {
        primary: ['+5000% Storage capacity', '+2000% Fleet cargo space', 'Dimensional pocket access'],
        secondary: ['Instant travel via dimensional rifts', '+1000% Resource production', 'Dimensional shields'],
        special: ['Create pocket universes', 'Dimensional weapons', 'Reality anchoring']
      },
      stats: {
        powerRating: 18900,
        efficiency: 95,
        complexity: 97,
        stability: 82,
        scalability: 94
      },
      subStats: {
        energyConsumption: 180000,
        processingSpeed: 450000,
        dataCapacity: 5000000,
        dimensionalIntegrity: 85
      },
      requirements: {
        metal: 400000000,
        crystal: 600000000,
        deuterium: 350000000,
        darkMatter: 80000,
        antimatter: 40000,
        exoticMatter: 20000,
        time: '189 days',
        researchPoints: 2000000
      },
      prerequisites: ['Hyperspace Technology Level 120', 'Quantum Physics Level 140', 'Advanced Mathematics Level 100'],
      unlocks: ['Dimensional Portals', 'Pocket Dimensions', 'Dimensional Weapons'],
      synergies: [
        { tech: 'Temporal Manipulation', bonus: '+300% Dimensional stability' },
        { tech: 'Wormhole Technology', bonus: '+500% Portal efficiency' }
      ],
      milestones: [
        { level: 200, reward: 'Stable pocket dimensions' },
        { level: 400, reward: 'Dimensional fortress' },
        { level: 600, reward: 'Reality manipulation' },
        { level: 999, reward: 'Dimensional Sovereign' }
      ]
    },
    {
      id: 'dark-energy-harnessing',
      name: 'Dark Energy Harnessing',
      category: 'exotic',
      tier: 380,
      class: 'Mythic',
      level: 156,
      maxLevel: 999,
      type: 'passive',
      status: 'completed',
      description: 'Taps into the mysterious dark energy that permeates the universe, providing virtually unlimited power for all empire operations.',
      effects: {
        primary: ['+10000 Energy per level', '+500% Energy efficiency', 'Unlimited energy potential'],
        secondary: ['+300% All production', 'Zero energy costs', '+200% Shield strength'],
        special: ['Dark energy weapons', 'Energy manipulation', 'Universal power grid']
      },
      stats: {
        powerRating: 15600,
        efficiency: 99,
        complexity: 92,
        stability: 88,
        scalability: 97
      },
      subStats: {
        energyConsumption: -500000,
        processingSpeed: 300000,
        dataCapacity: 1500000
      },
      requirements: {
        metal: 300000000,
        crystal: 450000000,
        deuterium: 250000000,
        darkMatter: 60000,
        antimatter: 30000,
        exoticMatter: 15000,
        time: '156 days',
        researchPoints: 1500000
      },
      prerequisites: ['Energy Technology Level 100', 'Astrophysics Level 150', 'Plasma Technology Level 120'],
      unlocks: ['Dark Energy Reactors', 'Dark Energy Weapons', 'Energy Transcendence'],
      synergies: [
        { tech: 'Antimatter Synthesis', bonus: '+400% Energy output' },
        { tech: 'Fusion Technology', bonus: '+300% Efficiency' }
      ],
      milestones: [
        { level: 200, reward: 'Infinite energy source' },
        { level: 400, reward: 'Dark energy manipulation' },
        { level: 600, reward: 'Energy godhood' },
        { level: 999, reward: 'Universal Energy Master' }
      ]
    },
    {
      id: 'graviton-mastery',
      name: 'Graviton Mastery',
      category: 'exotic',
      tier: 420,
      class: 'Mythic',
      level: 178,
      maxLevel: 999,
      type: 'active',
      status: 'researching',
      researchProgress: 67,
      description: 'Complete mastery over gravitational forces, enabling creation of artificial gravity wells, graviton weapons, and gravity-based propulsion systems.',
      effects: {
        primary: ['+5000% Weapon damage', '+3000% Defense power', 'Gravity manipulation'],
        secondary: ['Artificial gravity wells', '+500% Ship speed', 'Graviton shields'],
        special: ['Black hole creation', 'Gravity weapons', 'Singularity bombs']
      },
      stats: {
        powerRating: 17800,
        efficiency: 90,
        complexity: 95,
        stability: 80,
        scalability: 88
      },
      subStats: {
        energyConsumption: 220000,
        processingSpeed: 400000,
        dataCapacity: 3000000
      },
      requirements: {
        metal: 350000000,
        crystal: 500000000,
        deuterium: 300000000,
        darkMatter: 70000,
        antimatter: 35000,
        exoticMatter: 18000,
        time: '178 days',
        researchPoints: 1800000
      },
      prerequisites: ['Weapons Technology Level 120', 'Astrophysics Level 160', 'Quantum Physics Level 130'],
      unlocks: ['Graviton Cannons', 'Gravity Wells', 'Singularity Weapons'],
      synergies: [
        { tech: 'Temporal Manipulation', bonus: '+400% Gravitational control' },
        { tech: 'Dark Energy Harnessing', bonus: '+300% Power output' }
      ],
      milestones: [
        { level: 200, reward: 'Artificial black holes' },
        { level: 400, reward: 'Gravity manipulation mastery' },
        { level: 600, reward: 'Singularity control' },
        { level: 999, reward: 'Gravity God' }
      ]
    },
    {
      id: 'neural-network-integration',
      name: 'Neural Network Integration',
      category: 'quantum',
      tier: 280,
      class: 'Epic',
      level: 145,
      maxLevel: 999,
      type: 'passive',
      status: 'completed',
      description: 'Integrates advanced neural networks with quantum computing to create self-learning AI systems that optimize all empire operations.',
      effects: {
        primary: ['+800% AI efficiency', '+600% Automation', '+400% Decision making'],
        secondary: ['+300% Research speed', '+250% Production', '+200% Fleet coordination'],
        special: ['Self-learning systems', 'Predictive analytics', 'Autonomous operations']
      },
      stats: {
        powerRating: 14500,
        efficiency: 94,
        complexity: 85,
        stability: 92,
        scalability: 96
      },
      subStats: {
        energyConsumption: 85000,
        processingSpeed: 850000,
        dataCapacity: 7500000,
        quantumCoherence: 88
      },
      requirements: {
        metal: 180000000,
        crystal: 250000000,
        deuterium: 140000000,
        darkMatter: 35000,
        antimatter: 18000,
        exoticMatter: 8000,
        time: '145 days',
        researchPoints: 900000
      },
      prerequisites: ['Computer Technology Level 80', 'Quantum Computing Core Level 50', 'AI Research Level 60'],
      unlocks: ['Advanced AI', 'Neural Interfaces', 'Cognitive Enhancement'],
      synergies: [
        { tech: 'Quantum Computing Core', bonus: '+500% Processing power' },
        { tech: 'Cybernetic Enhancement', bonus: '+300% Integration efficiency' }
      ],
      milestones: [
        { level: 150, reward: 'Sentient AI assistants' },
        { level: 300, reward: 'Hive mind network' },
        { level: 500, reward: 'Transcendent intelligence' },
        { level: 999, reward: 'Digital godhood' }
      ]
    },
    {
      id: 'antimatter-synthesis',
      name: 'Antimatter Synthesis',
      category: 'economy',
      tier: 320,
      class: 'Legendary',
      level: 167,
      maxLevel: 999,
      type: 'passive',
      status: 'completed',
      description: 'Enables efficient production of antimatter through advanced particle acceleration and containment, providing the most powerful fuel source known.',
      effects: {
        primary: ['+1000 Antimatter per hour per level', '+400% Energy output', '+300% Fuel efficiency'],
        secondary: ['+500% Ship speed', '+400% Weapon power', '+200% Shield strength'],
        special: ['Antimatter weapons', 'Antimatter reactors', 'Matter-antimatter annihilation']
      },
      stats: {
        powerRating: 16700,
        efficiency: 87,
        complexity: 90,
        stability: 85,
        scalability: 92
      },
      subStats: {
        energyConsumption: 150000,
        processingSpeed: 250000,
        dataCapacity: 1000000
      },
      requirements: {
        metal: 250000000,
        crystal: 350000000,
        deuterium: 200000000,
        darkMatter: 50000,
        antimatter: 25000,
        exoticMatter: 12000,
        time: '167 days',
        researchPoints: 1200000
      },
      prerequisites: ['Plasma Technology Level 100', 'Energy Technology Level 110', 'Particle Physics Level 90'],
      unlocks: ['Antimatter Reactors', 'Antimatter Weapons', 'Antimatter Drives'],
      synergies: [
        { tech: 'Dark Energy Harnessing', bonus: '+600% Production rate' },
        { tech: 'Fusion Technology', bonus: '+400% Efficiency' }
      ],
      milestones: [
        { level: 200, reward: 'Mass antimatter production' },
        { level: 400, reward: 'Antimatter mastery' },
        { level: 600, reward: 'Unlimited antimatter' },
        { level: 999, reward: 'Antimatter Sovereign' }
      ]
    },
    {
      id: 'nanite-technology',
      name: 'Nanite Technology',
      category: 'economy',
      tier: 240,
      class: 'Epic',
      level: 198,
      maxLevel: 999,
      type: 'hybrid',
      status: 'completed',
      description: 'Microscopic self-replicating machines that can construct, repair, and optimize structures at the molecular level with unprecedented speed.',
      effects: {
        primary: ['+2000% Construction speed', '+1500% Repair rate', '+1000% Resource efficiency'],
        secondary: ['+800% Production', 'Instant repairs', 'Self-replicating builders'],
        special: ['Molecular assembly', 'Nano-repair swarms', 'Adaptive construction']
      },
      stats: {
        powerRating: 19800,
        efficiency: 98,
        complexity: 88,
        stability: 94,
        scalability: 99
      },
      subStats: {
        energyConsumption: 95000,
        processingSpeed: 650000,
        dataCapacity: 4500000
      },
      requirements: {
        metal: 200000000,
        crystal: 280000000,
        deuterium: 160000000,
        darkMatter: 40000,
        antimatter: 20000,
        exoticMatter: 10000,
        time: '198 days',
        researchPoints: 1100000
      },
      prerequisites: ['Robotics Level 80', 'Computer Technology Level 90', 'Nanotechnology Level 70'],
      unlocks: ['Nanite Factories', 'Nano-Repair Systems', 'Molecular Forges'],
      synergies: [
        { tech: 'Quantum Computing Core', bonus: '+500% Nanite coordination' },
        { tech: 'AI Research', bonus: '+400% Efficiency' }
      ],
      milestones: [
        { level: 200, reward: 'Self-replicating nanites' },
        { level: 400, reward: 'Molecular mastery' },
        { level: 600, reward: 'Instant construction' },
        { level: 999, reward: 'Nanite Overlord' }
      ]
    },
    {
      id: 'plasma-weaponry-advanced',
      name: 'Advanced Plasma Weaponry',
      category: 'combat',
      tier: 310,
      class: 'Legendary',
      level: 172,
      maxLevel: 999,
      type: 'active',
      status: 'completed',
      description: 'Harnesses superheated plasma at temperatures exceeding stellar cores to create devastating weapons that can melt through any defense.',
      effects: {
        primary: ['+3000% Weapon damage', '+2000% Armor penetration', '+1500% Shield bypass'],
        secondary: ['+1000% Critical hit chance', '+800% Area damage', '+500% Range'],
        special: ['Plasma storms', 'Stellar fire', 'Fusion detonation']
      },
      stats: {
        powerRating: 17200,
        efficiency: 85,
        complexity: 87,
        stability: 83,
        scalability: 89
      },
      subStats: {
        energyConsumption: 180000,
        processingSpeed: 350000,
        dataCapacity: 2500000
      },
      requirements: {
        metal: 280000000,
        crystal: 380000000,
        deuterium: 220000000,
        darkMatter: 55000,
        antimatter: 28000,
        exoticMatter: 14000,
        time: '172 days',
        researchPoints: 1300000
      },
      prerequisites: ['Weapons Technology Level 110', 'Plasma Technology Level 100', 'Energy Technology Level 105'],
      unlocks: ['Plasma Cannons', 'Plasma Torpedoes', 'Plasma Shields'],
      synergies: [
        { tech: 'Fusion Technology', bonus: '+500% Plasma temperature' },
        { tech: 'Energy Weapons', bonus: '+400% Damage output' }
      ],
      milestones: [
        { level: 200, reward: 'Stellar plasma weapons' },
        { level: 400, reward: 'Plasma mastery' },
        { level: 600, reward: 'Sun-level firepower' },
        { level: 999, reward: 'Plasma God' }
      ]
    },
    {
      id: 'quantum-shielding',
      name: 'Quantum Shielding',
      category: 'defense',
      tier: 340,
      class: 'Legendary',
      level: 163,
      maxLevel: 999,
      type: 'passive',
      status: 'completed',
      description: 'Creates shields that exist in quantum superposition, making them nearly impenetrable by phasing between dimensions to avoid damage.',
      effects: {
        primary: ['+4000% Shield strength', '+3000% Shield regeneration', '+2000% Damage absorption'],
        secondary: ['+1500% Phase shifting', '+1000% Energy reflection', '+800% Adaptive defense'],
        special: ['Quantum phase shields', 'Dimensional barriers', 'Reality anchoring']
      },
      stats: {
        powerRating: 16300,
        efficiency: 93,
        complexity: 91,
        stability: 89,
        scalability: 94
      },
      subStats: {
        energyConsumption: 140000,
        processingSpeed: 550000,
        dataCapacity: 3500000,
        quantumCoherence: 91
      },
      requirements: {
        metal: 260000000,
        crystal: 360000000,
        deuterium: 210000000,
        darkMatter: 52000,
        antimatter: 26000,
        exoticMatter: 13000,
        time: '163 days',
        researchPoints: 1250000
      },
      prerequisites: ['Shielding Technology Level 100', 'Quantum Physics Level 120', 'Energy Technology Level 100'],
      unlocks: ['Quantum Shields', 'Phase Barriers', 'Dimensional Defense'],
      synergies: [
        { tech: 'Dimensional Engineering', bonus: '+600% Shield effectiveness' },
        { tech: 'Energy Shields', bonus: '+500% Regeneration' }
      ],
      milestones: [
        { level: 200, reward: 'Impenetrable shields' },
        { level: 400, reward: 'Quantum defense mastery' },
        { level: 600, reward: 'Invulnerability' },
        { level: 999, reward: 'Shield Sovereign' }
      ]
    },
    {
      id: 'wormhole-technology',
      name: 'Wormhole Technology',
      category: 'propulsion',
      tier: 390,
      class: 'Mythic',
      level: 151,
      maxLevel: 999,
      type: 'active',
      status: 'completed',
      description: 'Creates stable wormholes for instant travel across vast distances, connecting distant parts of the universe through folded space-time.',
      effects: {
        primary: ['Instant travel anywhere', 'Zero fuel consumption', '+10 Wormhole gates per 10 levels'],
        secondary: ['+5000% Fleet deployment speed', 'Unlimited range', 'Multi-destination routing'],
        special: ['Wormhole network', 'Instant reinforcements', 'Strategic positioning']
      },
      stats: {
        powerRating: 15100,
        efficiency: 96,
        complexity: 98,
        stability: 78,
        scalability: 91
      },
      subStats: {
        energyConsumption: 200000,
        processingSpeed: 480000,
        dataCapacity: 4000000,
        dimensionalIntegrity: 82
      },
      requirements: {
        metal: 320000000,
        crystal: 480000000,
        deuterium: 280000000,
        darkMatter: 65000,
        antimatter: 32000,
        exoticMatter: 16000,
        time: '151 days',
        researchPoints: 1600000
      },
      prerequisites: ['Hyperspace Technology Level 130', 'Astrophysics Level 140', 'Quantum Physics Level 125'],
      unlocks: ['Wormhole Generators', 'Instant Travel', 'Space-Time Bridges'],
      synergies: [
        { tech: 'Dimensional Engineering', bonus: '+700% Wormhole stability' },
        { tech: 'Temporal Manipulation', bonus: '+500% Travel efficiency' }
      ],
      milestones: [
        { level: 200, reward: 'Universal wormhole network' },
        { level: 400, reward: 'Multi-dimensional travel' },
        { level: 600, reward: 'Instant universe traversal' },
        { level: 999, reward: 'Space-Time Master' }
      ]
    },
    {
      id: 'stellar-engineering',
      name: 'Stellar Engineering',
      category: 'exotic',
      tier: 480,
      class: 'Transcendent',
      level: 142,
      maxLevel: 999,
      type: 'hybrid',
      status: 'available',
      description: 'Enables manipulation and construction of stars themselves, creating artificial suns, controlling stellar output, and harvesting stellar matter.',
      effects: {
        primary: ['+50000 Energy per level', '+10000% Resource production', 'Star creation capability'],
        secondary: ['Stellar manipulation', '+5000% Energy efficiency', 'Dyson sphere construction'],
        special: ['Create artificial stars', 'Control stellar output', 'Harvest stellar cores']
      },
      stats: {
        powerRating: 14200,
        efficiency: 91,
        complexity: 99,
        stability: 76,
        scalability: 87
      },
      subStats: {
        energyConsumption: 300000,
        processingSpeed: 420000,
        dataCapacity: 6000000
      },
      requirements: {
        metal: 450000000,
        crystal: 650000000,
        deuterium: 380000000,
        darkMatter: 90000,
        antimatter: 45000,
        exoticMatter: 22000,
        time: '142 days',
        researchPoints: 2200000
      },
      prerequisites: ['Astrophysics Level 180', 'Energy Technology Level 150', 'Plasma Technology Level 140'],
      unlocks: ['Star Forges', 'Stellar Manipulation', 'Artificial Suns'],
      synergies: [
        { tech: 'Dark Energy Harnessing', bonus: '+800% Energy output' },
        { tech: 'Fusion Technology', bonus: '+600% Stellar control' }
      ],
      milestones: [
        { level: 150, reward: 'Create artificial stars' },
        { level: 300, reward: 'Control stellar lifecycles' },
        { level: 500, reward: 'Stellar mastery' },
        { level: 999, reward: 'Star God' }
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Technologies', icon: 'ri-apps-line', color: 'cyan' },
    { id: 'basic', name: 'Basic Research', icon: 'ri-flask-line', color: 'blue' },
    { id: 'combat', name: 'Combat Systems', icon: 'ri-sword-line', color: 'red' },
    { id: 'propulsion', name: 'Propulsion', icon: 'ri-rocket-line', color: 'orange' },
    { id: 'defense', name: 'Defense Systems', icon: 'ri-shield-line', color: 'green' },
    { id: 'economy', name: 'Economy', icon: 'ri-coins-line', color: 'yellow' },
    { id: 'exotic', name: 'Exotic Physics', icon: 'ri-star-line', color: 'purple' },
    { id: 'quantum', name: 'Quantum Tech', icon: 'ri-focus-2-line', color: 'indigo' },
    { id: 'temporal', name: 'Temporal Science', icon: 'ri-time-line', color: 'pink' },
    { id: 'dimensional', name: 'Dimensional', icon: 'ri-space-ship-line', color: 'violet' }
  ];

  const tierRanges = [
    { id: 'all', name: 'All Tiers', range: '1-999' },
    { id: 1, name: 'Tier 1-100', range: '1-100' },
    { id: 2, name: 'Tier 101-200', range: '101-200' },
    { id: 3, name: 'Tier 201-300', range: '201-300' },
    { id: 4, name: 'Tier 301-400', range: '301-400' },
    { id: 5, name: 'Tier 401-500', range: '401-500' },
    { id: 6, name: 'Tier 501-999', range: '501-999' }
  ];

  const classTypes = [
    { id: 'all', name: 'All Classes' },
    { id: 'Common', name: 'Common', color: 'gray' },
    { id: 'Uncommon', name: 'Uncommon', color: 'green' },
    { id: 'Rare', name: 'Rare', color: 'blue' },
    { id: 'Epic', name: 'Epic', color: 'purple' },
    { id: 'Legendary', name: 'Legendary', color: 'amber' },
    { id: 'Mythic', name: 'Mythic', color: 'pink' },
    { id: 'Transcendent', name: 'Transcendent', color: 'cyan' },
    { id: 'Cosmic', name: 'Cosmic', color: 'indigo' },
    { id: 'Universal', name: 'Universal', color: 'violet' }
  ];

  const getClassColor = (className: string) => {
    const classInfo = classTypes.find(c => c.id === className);
    return classInfo?.color || 'gray';
  };

  const getTierColor = (tier: number) => {
    if (tier <= 100) return 'blue';
    if (tier <= 200) return 'green';
    if (tier <= 300) return 'purple';
    if (tier <= 400) return 'amber';
    if (tier <= 500) return 'pink';
    return 'cyan';
  };

  const filteredTechs = technologies
    .filter(tech => selectedCategory === 'all' || tech.category === selectedCategory)
    .filter(tech => {
      if (selectedTier === 'all') return true;
      const tierNum = Number(selectedTier);
      const rangeStart = (tierNum - 1) * 100 + 1;
      const rangeEnd = tierNum === 6 ? 999 : tierNum * 100;
      return tech.tier >= rangeStart && tech.tier <= rangeEnd;
    })
    .filter(tech => selectedClass === 'all' || tech.class === selectedClass)
    .sort((a, b) => {
      switch (sortBy) {
        case 'tier': return b.tier - a.tier;
        case 'level': return b.level - a.level;
        case 'power': return b.stats.powerRating - a.stats.powerRating;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  return (
    <div className="text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Advanced Research Laboratory
            </h1>
            <p className="text-gray-400 text-lg">Unlock the secrets of the universe through advanced technologies</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg px-4 py-2">
              <div className="text-xs text-gray-400 mb-1">Research Points</div>
              <div className="text-xl font-bold text-cyan-400">8.5M</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg px-4 py-2">
              <div className="text-xs text-gray-400 mb-1">Active Research</div>
              <div className="text-xl font-bold text-purple-400">1 / 5</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-6">
          {/* Category Filter */}
          <div>
            <div className="text-sm text-gray-400 mb-2">Category:</div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? `bg-${cat.color}-500/20 border-2 border-${cat.color}-500 text-${cat.color}-400`
                      : 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:border-cyan-500/50'
                  }`}
                >
                  <i className={`${cat.icon} w-5 h-5 flex items-center justify-center`}></i>
                  <span className="font-medium">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tier and Class Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-400 mb-2">Tier Range:</div>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                {tierRanges.map(tier => (
                  <option key={tier.id} value={tier.id}>{tier.name} ({tier.range})</option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-2">Class:</div>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                {classTypes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-2">Sort By:</div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="tier">Tier (High to Low)</option>
                <option value="level">Level (High to Low)</option>
                <option value="power">Power Rating (High to Low)</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Technologies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTechs.map(tech => (
            <div
              key={tech.id}
              className={`bg-slate-800/30 backdrop-blur-sm border rounded-xl p-6 transition-all hover:scale-[1.02] cursor-pointer ${
                tech.status === 'locked'
                  ? 'border-gray-700 opacity-60'
                  : `border-${getTierColor(tech.tier)}-500/30 hover:border-${getTierColor(tech.tier)}-500/60 hover:shadow-lg hover:shadow-${getTierColor(tech.tier)}-500/20`
              }`}
              onClick={() => {
                setSelectedTech(tech);
                setShowDetails(true);
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white">{tech.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded border bg-${getClassColor(tech.class)}-500/20 border-${getClassColor(tech.class)}-500/50 text-${getClassColor(tech.class)}-400 font-bold`}>
                      {tech.class}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded bg-${getTierColor(tech.tier)}-500/20 text-${getTierColor(tech.tier)}-400 font-medium`}>
                      Tier {tech.tier}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-slate-700/50 text-gray-300 capitalize">
                      {tech.type}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-slate-700/50 text-gray-300 capitalize">
                      {tech.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-cyan-400">{tech.level}</div>
                  <div className="text-xs text-gray-400">/ {tech.maxLevel}</div>
                </div>
              </div>

              {/* Research Progress */}
              {tech.status === 'researching' && tech.researchProgress && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Research Progress</span>
                    <span>{tech.researchProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${tech.researchProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{tech.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                <div className="bg-slate-900/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-400 mb-1">Power</div>
                  <div className="text-sm font-bold text-cyan-400">{tech.stats.powerRating}</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-400 mb-1">Efficiency</div>
                  <div className="text-sm font-bold text-emerald-400">{tech.stats.efficiency}%</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-400 mb-1">Complex</div>
                  <div className="text-sm font-bold text-purple-400">{tech.stats.complexity}%</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-400 mb-1">Stability</div>
                  <div className="text-sm font-bold text-blue-400">{tech.stats.stability}%</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-400 mb-1">Scale</div>
                  <div className="text-sm font-bold text-amber-400">{tech.stats.scalability}%</div>
                </div>
              </div>

              {/* Primary Effects */}
              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-2">Primary Effects:</div>
                <div className="space-y-1">
                  {tech.effects.primary.slice(0, 2).map((effect, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <i className="ri-checkbox-circle-fill text-cyan-400 mt-0.5 w-4 h-4 flex items-center justify-center"></i>
                      <span className="text-gray-300">{effect}</span>
                    </div>
                  ))}
                  {tech.effects.primary.length > 2 && (
                    <div className="text-xs text-cyan-400">+{tech.effects.primary.length - 2} more effects...</div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {tech.status === 'completed' && (
                  <button className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap">
                    <i className="ri-arrow-up-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                    Upgrade to Lv.{tech.level + 1}
                  </button>
                )}
                {tech.status === 'available' && (
                  <button className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap">
                    <i className="ri-play-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                    Start Research
                  </button>
                )}
                {tech.status === 'researching' && (
                  <button className="flex-1 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap">
                    <i className="ri-time-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                    Speed Up
                  </button>
                )}
                {tech.status === 'locked' && (
                  <button className="flex-1 bg-slate-700 text-gray-400 px-4 py-2 rounded-lg font-medium cursor-not-allowed whitespace-nowrap">
                    <i className="ri-lock-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                    Locked
                  </button>
                )}
                <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap">
                  <i className="ri-information-line w-4 h-4 inline-flex items-center justify-center"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedTech && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={() => setShowDetails(false)}>
          <div className="bg-slate-900 border border-cyan-500/30 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-cyan-500/30 p-6 z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-white">{selectedTech.name}</h2>
                    <span className={`text-sm px-3 py-1 rounded border bg-${getClassColor(selectedTech.class)}-500/20 border-${getClassColor(selectedTech.class)}-500/50 text-${getClassColor(selectedTech.class)}-400 font-bold`}>
                      {selectedTech.class}
                    </span>
                    <span className={`text-sm px-3 py-1 rounded bg-${getTierColor(selectedTech.tier)}-500/20 text-${getTierColor(selectedTech.tier)}-400 font-bold`}>
                      Tier {selectedTech.tier}
                    </span>
                  </div>
                  <p className="text-gray-400">{selectedTech.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div>
                      <span className="text-gray-400 text-sm">Current Level: </span>
                      <span className="text-cyan-400 font-bold text-lg">{selectedTech.level}</span>
                      <span className="text-gray-500"> / {selectedTech.maxLevel}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Type: </span>
                      <span className="text-purple-400 font-medium capitalize">{selectedTech.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Category: </span>
                      <span className="text-emerald-400 font-medium capitalize">{selectedTech.category}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="ri-close-line text-2xl w-8 h-8 flex items-center justify-center"></i>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Stats */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-3">Technology Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Power Rating</div>
                    <div className="text-2xl font-bold text-cyan-400">{selectedTech.stats.powerRating.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Efficiency</div>
                    <div className="text-2xl font-bold text-emerald-400">{selectedTech.stats.efficiency}%</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Complexity</div>
                    <div className="text-2xl font-bold text-purple-400">{selectedTech.stats.complexity}%</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Stability</div>
                    <div className="text-2xl font-bold text-blue-400">{selectedTech.stats.stability}%</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Scalability</div>
                    <div className="text-2xl font-bold text-amber-400">{selectedTech.stats.scalability}%</div>
                  </div>
                </div>
              </div>

              {/* Sub Stats */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-3">Advanced Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Energy Consumption</div>
                    <div className="text-lg font-bold text-yellow-400">{selectedTech.subStats.energyConsumption.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Processing Speed</div>
                    <div className="text-lg font-bold text-cyan-400">{selectedTech.subStats.processingSpeed.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Data Capacity</div>
                    <div className="text-lg font-bold text-purple-400">{selectedTech.subStats.dataCapacity.toLocaleString()}</div>
                  </div>
                  {selectedTech.subStats.quantumCoherence && (
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Quantum Coherence</div>
                      <div className="text-lg font-bold text-indigo-400">{selectedTech.subStats.quantumCoherence}%</div>
                    </div>
                  )}
                  {selectedTech.subStats.temporalStability && (
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Temporal Stability</div>
                      <div className="text-lg font-bold text-pink-400">{selectedTech.subStats.temporalStability}%</div>
                    </div>
                  )}
                  {selectedTech.subStats.dimensionalIntegrity && (
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Dimensional Integrity</div>
                      <div className="text-lg font-bold text-violet-400">{selectedTech.subStats.dimensionalIntegrity}%</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Effects */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-cyan-400 mb-3">Primary Effects</h3>
                  <div className="space-y-2">
                    {selectedTech.effects.primary.map((effect, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-slate-800/50 rounded-lg p-3">
                        <i className="ri-checkbox-circle-fill text-cyan-400 mt-0.5 w-5 h-5 flex items-center justify-center"></i>
                        <span className="text-sm text-gray-300">{effect}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-purple-400 mb-3">Secondary Effects</h3>
                  <div className="space-y-2">
                    {selectedTech.effects.secondary.map((effect, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-slate-800/50 rounded-lg p-3">
                        <i className="ri-star-fill text-purple-400 mt-0.5 w-5 h-5 flex items-center justify-center"></i>
                        <span className="text-sm text-gray-300">{effect}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-400 mb-3">Special Effects</h3>
                  <div className="space-y-2">
                    {selectedTech.effects.special.map((effect, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-slate-800/50 rounded-lg p-3">
                        <i className="ri-flashlight-fill text-amber-400 mt-0.5 w-5 h-5 flex items-center justify-center"></i>
                        <span className="text-sm text-gray-300">{effect}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-3">Next Level Requirements</h3>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Metal</div>
                      <div className="text-lg font-bold text-blue-400">{selectedTech.requirements.metal.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Crystal</div>
                      <div className="text-lg font-bold text-purple-400">{selectedTech.requirements.crystal.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Deuterium</div>
                      <div className="text-lg font-bold text-emerald-400">{selectedTech.requirements.deuterium.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Dark Matter</div>
                      <div className="text-lg font-bold text-indigo-400">{selectedTech.requirements.darkMatter.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Antimatter</div>
                      <div className="text-lg font-bold text-pink-400">{selectedTech.requirements.antimatter.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Exotic Matter</div>
                      <div className="text-lg font-bold text-amber-400">{selectedTech.requirements.exoticMatter.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Research Points</div>
                      <div className="text-lg font-bold text-cyan-400">{selectedTech.requirements.researchPoints.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <i className="ri-time-line w-4 h-4 flex items-center justify-center"></i>
                    <span>Research Time: {selectedTech.requirements.time}</span>
                  </div>
                </div>
              </div>

              {/* Prerequisites */}
              {selectedTech.prerequisites.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-cyan-400 mb-3">Prerequisites</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTech.prerequisites.map((prereq, idx) => (
                      <span key={idx} className="px-3 py-2 bg-slate-800/50 border border-cyan-500/30 text-cyan-400 text-sm rounded-lg">
                        {prereq}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Unlocks */}
              {selectedTech.unlocks.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-cyan-400 mb-3">Unlocks</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTech.unlocks.map((unlock, idx) => (
                      <span key={idx} className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg">
                        {unlock}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Synergies */}
              {selectedTech.synergies.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-cyan-400 mb-3">Technology Synergies</h3>
                  <div className="space-y-2">
                    {selectedTech.synergies.map((synergy, idx) => (
                      <div key={idx} className="bg-slate-800/50 rounded-lg p-3 flex items-center justify-between">
                        <span className="text-purple-400 font-medium">{synergy.tech}</span>
                        <span className="text-emerald-400 text-sm">{synergy.bonus}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Milestones */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-3">Level Milestones</h3>
                <div className="space-y-2">
                  {selectedTech.milestones.map((milestone, idx) => (
                    <div
                      key={idx}
                      className={`bg-slate-800/50 rounded-lg p-3 flex items-center justify-between ${
                        selectedTech.level >= milestone.level ? 'border-l-4 border-emerald-500' : 'border-l-4 border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold ${selectedTech.level >= milestone.level ? 'text-emerald-400' : 'text-gray-500'}`}>
                          Lv.{milestone.level}
                        </span>
                        <span className={selectedTech.level >= milestone.level ? 'text-white' : 'text-gray-400'}>
                          {milestone.reward}
                        </span>
                      </div>
                      {selectedTech.level >= milestone.level && (
                        <i className="ri-checkbox-circle-fill text-emerald-400 text-xl w-6 h-6 flex items-center justify-center"></i>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {selectedTech.status === 'completed' && (
                  <button className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap">
                    <i className="ri-arrow-up-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>
                    Upgrade to Level {selectedTech.level + 1}
                  </button>
                )}
                {selectedTech.status === 'available' && (
                  <button className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap">
                    <i className="ri-play-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>
                    Start Research
                  </button>
                )}
                {selectedTech.status === 'researching' && (
                  <>
                    <button className="flex-1 bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap">
                      <i className="ri-flashlight-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>
                      Speed Up Research
                    </button>
                    <button className="flex-1 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap">
                      <i className="ri-stop-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>
                      Cancel Research
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
