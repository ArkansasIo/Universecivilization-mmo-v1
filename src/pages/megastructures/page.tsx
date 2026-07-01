import { useState, useEffect } from 'react';
import { useResources } from '../../hooks/useResources';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface MegaStructure {
  id: string;
  name: string;
  type: 'energy' | 'military' | 'research' | 'economic' | 'special';
  tier: 'Legendary' | 'Epic' | 'Rare';
  level: number;
  maxLevel: number;
  status: 'operational' | 'construction' | 'upgrading' | 'damaged' | 'locked';
  constructionProgress?: number;
  description: string;
  effects: string[];
  requirements: {
    metal: number;
    crystal: number;
    deuterium: number;
    darkMatter: number;
    antimatter: number;
    time: string;
  };
  unlockRequirements?: string[];
  modules: {
    name: string;
    installed: boolean;
    effect: string;
    cost: {
      metal: number;
      crystal: number;
      deuterium: number;
    };
  }[];
  stats: {
    powerOutput?: string;
    defenseRating?: string;
    researchBonus?: string;
    productionBonus?: string;
    capacity?: string;
  };
}

export default function MegaStructuresPage() {
  const { user } = useAuth();
  const { resources, deductResources, updateResources } = useResources();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStructure, setSelectedStructure] = useState<MegaStructure | null>(null);
  const [showModules, setShowModules] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showConstructModal, setShowConstructModal] = useState(false);
  const [showRepairModal, setShowRepairModal] = useState(false);
  const [constructionQueue, setConstructionQueue] = useState<any[]>([]);
  const [playerStructures, setPlayerStructures] = useState<any[]>([]);
  const [antimatter, setAntimatter] = useState(10000);

  const megaStructures: MegaStructure[] = [
    {
      id: 'dyson-sphere',
      name: 'Dyson Sphere',
      type: 'energy',
      tier: 'Legendary',
      level: 3,
      maxLevel: 10,
      status: 'operational',
      description: 'A colossal megastructure that encompasses an entire star, harvesting its total energy output. Provides unlimited energy to your entire empire.',
      effects: [
        '+500,000 Energy Production per level',
        '+25% Energy efficiency empire-wide',
        'Unlocks Stellar Manipulation technologies',
        'Reduces all building energy costs by 30%'
      ],
      requirements: {
        metal: 50000000,
        crystal: 30000000,
        deuterium: 15000000,
        darkMatter: 5000,
        antimatter: 2000,
        time: '45 days'
      },
      unlockRequirements: [
        'Energy Technology Level 20',
        'Astrophysics Level 15',
        'Plasma Technology Level 18'
      ],
      modules: [
        {
          name: 'Stellar Collector Array',
          installed: true,
          effect: '+100,000 Energy/level',
          cost: { metal: 5000000, crystal: 3000000, deuterium: 1000000 }
        },
        {
          name: 'Quantum Energy Converter',
          installed: true,
          effect: '+50% Energy efficiency',
          cost: { metal: 8000000, crystal: 5000000, deuterium: 2000000 }
        },
        {
          name: 'Antimatter Reactor Core',
          installed: false,
          effect: '+200% Energy output',
          cost: { metal: 15000000, crystal: 10000000, deuterium: 5000000 }
        }
      ],
      stats: {
        powerOutput: '1,500,000 MW',
        capacity: 'Unlimited'
      }
    },
    {
      id: 'ring-world',
      name: 'Ring World',
      type: 'economic',
      tier: 'Legendary',
      level: 2,
      maxLevel: 5,
      status: 'operational',
      description: 'An artificial ring-shaped world orbiting a star, providing massive habitable surface area and resource production capabilities.',
      effects: [
        '+1,000,000 Population capacity per level',
        '+100% Resource production empire-wide',
        '+50% Building construction speed',
        'Unlocks Terraforming technologies'
      ],
      requirements: {
        metal: 100000000,
        crystal: 50000000,
        deuterium: 25000000,
        darkMatter: 10000,
        antimatter: 5000,
        time: '60 days'
      },
      unlockRequirements: [
        'Terraforming Level 20',
        'Astrophysics Level 18',
        'Computer Technology Level 20'
      ],
      modules: [
        {
          name: 'Biosphere Generator',
          installed: true,
          effect: '+500,000 Population',
          cost: { metal: 10000000, crystal: 5000000, deuterium: 2000000 }
        },
        {
          name: 'Automated Mining Complex',
          installed: true,
          effect: '+75% Metal production',
          cost: { metal: 12000000, crystal: 8000000, deuterium: 3000000 }
        },
        {
          name: 'Crystal Synthesis Plant',
          installed: false,
          effect: '+75% Crystal production',
          cost: { metal: 12000000, crystal: 8000000, deuterium: 3000000 }
        }
      ],
      stats: {
        capacity: '2,000,000 Population',
        productionBonus: '+200%'
      }
    },
    {
      id: 'star-fortress',
      name: 'Star Fortress',
      type: 'military',
      tier: 'Legendary',
      level: 4,
      maxLevel: 10,
      status: 'operational',
      description: 'An impregnable military installation capable of defending entire star systems. Houses massive fleets and devastating weapon systems.',
      effects: [
        '+500,000 Defense power per level',
        '+100% Fleet capacity empire-wide',
        'Immune to conventional attacks',
        'Can deploy instant reinforcements'
      ],
      requirements: {
        metal: 75000000,
        crystal: 40000000,
        deuterium: 20000000,
        darkMatter: 8000,
        antimatter: 4000,
        time: '50 days'
      },
      unlockRequirements: [
        'Weapons Technology Level 20',
        'Shielding Technology Level 18',
        'Hyperspace Technology Level 15'
      ],
      modules: [
        {
          name: 'Graviton Cannon Array',
          installed: true,
          effect: '+200,000 Attack power',
          cost: { metal: 15000000, crystal: 10000000, deuterium: 5000000 }
        },
        {
          name: 'Quantum Shield Matrix',
          installed: true,
          effect: '+300,000 Shield strength',
          cost: { metal: 12000000, crystal: 8000000, deuterium: 4000000 }
        },
        {
          name: 'Fleet Hangar Bay',
          installed: true,
          effect: '+50,000 Ship capacity',
          cost: { metal: 10000000, crystal: 6000000, deuterium: 3000000 }
        }
      ],
      stats: {
        defenseRating: '2,000,000',
        capacity: '50,000 Ships'
      }
    },
    {
      id: 'research-nexus',
      name: 'Galactic Research Nexus',
      type: 'research',
      tier: 'Epic',
      level: 5,
      maxLevel: 15,
      status: 'operational',
      description: 'A network of interconnected research facilities spanning multiple star systems, accelerating technological advancement.',
      effects: [
        '+50% Research speed per level',
        'Can research 3 technologies simultaneously',
        '+25% Technology effectiveness',
        'Unlocks Exotic technologies'
      ],
      requirements: {
        metal: 40000000,
        crystal: 60000000,
        deuterium: 30000000,
        darkMatter: 6000,
        antimatter: 3000,
        time: '40 days'
      },
      unlockRequirements: [
        'Research Lab Level 20',
        'Computer Technology Level 18',
        'Intergalactic Research Network Level 10'
      ],
      modules: [
        {
          name: 'Quantum Computer Core',
          installed: true,
          effect: '+100% Research speed',
          cost: { metal: 8000000, crystal: 12000000, deuterium: 5000000 }
        },
        {
          name: 'Neural Network Hub',
          installed: true,
          effect: '+1 Simultaneous research',
          cost: { metal: 10000000, crystal: 15000000, deuterium: 6000000 }
        },
        {
          name: 'Temporal Accelerator',
          installed: false,
          effect: '+200% Research speed',
          cost: { metal: 20000000, crystal: 30000000, deuterium: 12000000 }
        }
      ],
      stats: {
        researchBonus: '+250%',
        capacity: '3 Simultaneous'
      }
    },
    {
      id: 'matter-decompressor',
      name: 'Stellar Matter Decompressor',
      type: 'economic',
      tier: 'Epic',
      level: 3,
      maxLevel: 12,
      status: 'operational',
      description: 'Extracts raw materials directly from stellar cores, providing unlimited resource generation.',
      effects: [
        '+100,000 Metal per hour per level',
        '+75,000 Crystal per hour per level',
        '+50,000 Deuterium per hour per level',
        'Never depletes'
      ],
      requirements: {
        metal: 60000000,
        crystal: 45000000,
        deuterium: 30000000,
        darkMatter: 7000,
        antimatter: 3500,
        time: '45 days'
      },
      unlockRequirements: [
        'Plasma Technology Level 18',
        'Astrophysics Level 16',
        'Energy Technology Level 18'
      ],
      modules: [
        {
          name: 'Deep Core Drill',
          installed: true,
          effect: '+50,000 Metal/hour',
          cost: { metal: 10000000, crystal: 7000000, deuterium: 4000000 }
        },
        {
          name: 'Fusion Extractor',
          installed: true,
          effect: '+30,000 Deuterium/hour',
          cost: { metal: 8000000, crystal: 10000000, deuterium: 6000000 }
        },
        {
          name: 'Matter Synthesizer',
          installed: false,
          effect: '+100% All resources',
          cost: { metal: 15000000, crystal: 15000000, deuterium: 10000000 }
        }
      ],
      stats: {
        productionBonus: '+300%',
        capacity: 'Unlimited'
      }
    },
    {
      id: 'gateway-network',
      name: 'Hyperspace Gateway Network',
      type: 'special',
      tier: 'Epic',
      level: 2,
      maxLevel: 8,
      status: 'operational',
      description: 'A network of hyperspace gateways enabling instant fleet travel across the galaxy.',
      effects: [
        'Instant fleet travel between gateways',
        '+5 Gateway nodes per level',
        'Zero fuel consumption for gate travel',
        'Can transport unlimited fleet size'
      ],
      requirements: {
        metal: 35000000,
        crystal: 35000000,
        deuterium: 35000000,
        darkMatter: 5000,
        antimatter: 2500,
        time: '35 days'
      },
      unlockRequirements: [
        'Hyperspace Technology Level 18',
        'Astrophysics Level 15',
        'Computer Technology Level 16'
      ],
      modules: [
        {
          name: 'Gateway Stabilizer',
          installed: true,
          effect: '+3 Gateway nodes',
          cost: { metal: 5000000, crystal: 5000000, deuterium: 5000000 }
        },
        {
          name: 'Quantum Entanglement Core',
          installed: true,
          effect: 'Instant travel',
          cost: { metal: 8000000, crystal: 8000000, deuterium: 8000000 }
        },
        {
          name: 'Mass Amplifier',
          installed: false,
          effect: '+500% Fleet capacity',
          cost: { metal: 12000000, crystal: 12000000, deuterium: 12000000 }
        }
      ],
      stats: {
        capacity: '10 Gateway Nodes'
      }
    },
    {
      id: 'science-habitat',
      name: 'Orbital Science Habitat',
      type: 'research',
      tier: 'Rare',
      level: 7,
      maxLevel: 20,
      status: 'operational',
      description: 'A massive orbital research station housing thousands of scientists and advanced laboratories.',
      effects: [
        '+20% Research speed per level',
        '+10% Technology effectiveness',
        'Unlocks Advanced research projects',
        '+5,000 Scientist capacity per level'
      ],
      requirements: {
        metal: 15000000,
        crystal: 25000000,
        deuterium: 12000000,
        darkMatter: 3000,
        antimatter: 1500,
        time: '25 days'
      },
      unlockRequirements: [
        'Research Lab Level 15',
        'Astrophysics Level 12',
        'Computer Technology Level 14'
      ],
      modules: [
        {
          name: 'Advanced Laboratory Wing',
          installed: true,
          effect: '+30% Research speed',
          cost: { metal: 3000000, crystal: 5000000, deuterium: 2000000 }
        },
        {
          name: 'Scientist Quarters',
          installed: true,
          effect: '+10,000 Scientists',
          cost: { metal: 2000000, crystal: 3000000, deuterium: 1500000 }
        },
        {
          name: 'Experimental Chamber',
          installed: true,
          effect: 'Unlock Exotic tech',
          cost: { metal: 5000000, crystal: 8000000, deuterium: 3000000 }
        }
      ],
      stats: {
        researchBonus: '+140%',
        capacity: '35,000 Scientists'
      }
    },
    {
      id: 'antimatter-reactor',
      name: 'Antimatter Reactor Complex',
      type: 'energy',
      tier: 'Epic',
      level: 4,
      maxLevel: 12,
      status: 'operational',
      description: 'Harnesses matter-antimatter annihilation to produce massive amounts of energy.',
      effects: [
        '+250,000 Energy per level',
        '+40% Energy efficiency',
        'Produces Antimatter fuel',
        'Powers Exotic technologies'
      ],
      requirements: {
        metal: 45000000,
        crystal: 35000000,
        deuterium: 25000000,
        darkMatter: 6000,
        antimatter: 3000,
        time: '38 days'
      },
      unlockRequirements: [
        'Energy Technology Level 18',
        'Plasma Technology Level 16',
        'Hyperspace Technology Level 14'
      ],
      modules: [
        {
          name: 'Containment Field',
          installed: true,
          effect: '+100,000 Energy',
          cost: { metal: 8000000, crystal: 6000000, deuterium: 4000000 }
        },
        {
          name: 'Antimatter Generator',
          installed: true,
          effect: '+1,000 Antimatter/day',
          cost: { metal: 10000000, crystal: 8000000, deuterium: 6000000 }
        },
        {
          name: 'Quantum Stabilizer',
          installed: false,
          effect: '+200% Safety rating',
          cost: { metal: 12000000, crystal: 10000000, deuterium: 8000000 }
        }
      ],
      stats: {
        powerOutput: '1,000,000 MW',
        capacity: '4,000 Antimatter'
      }
    },
    {
      id: 'mega-shipyard',
      name: 'Titan-Class Mega Shipyard',
      type: 'military',
      tier: 'Epic',
      level: 3,
      maxLevel: 10,
      status: 'construction',
      constructionProgress: 67,
      description: 'A colossal shipyard capable of constructing capital ships and super-weapons.',
      effects: [
        '+500% Ship construction speed',
        'Can build Titan-class ships',
        '+10 Simultaneous construction queues',
        '-30% Ship construction costs'
      ],
      requirements: {
        metal: 55000000,
        crystal: 40000000,
        deuterium: 28000000,
        darkMatter: 7000,
        antimatter: 3500,
        time: '42 days'
      },
      unlockRequirements: [
        'Shipyard Level 18',
        'Nanite Technology Level 15',
        'Computer Technology Level 17'
      ],
      modules: [
        {
          name: 'Nanite Assembly Bay',
          installed: true,
          effect: '+200% Build speed',
          cost: { metal: 10000000, crystal: 7000000, deuterium: 5000000 }
        },
        {
          name: 'Quantum Forge',
          installed: false,
          effect: '+5 Build queues',
          cost: { metal: 12000000, crystal: 9000000, deuterium: 6000000 }
        },
        {
          name: 'Resource Optimizer',
          installed: false,
          effect: '-50% Build costs',
          cost: { metal: 15000000, crystal: 12000000, deuterium: 8000000 }
        }
      ],
      stats: {
        capacity: '10 Queues',
        defenseRating: '500,000'
      }
    },
    {
      id: 'sensor-array',
      name: 'Deep Space Sensor Array',
      type: 'special',
      tier: 'Rare',
      level: 6,
      maxLevel: 15,
      status: 'operational',
      description: 'A vast network of sensors providing complete intelligence on surrounding galaxies.',
      effects: [
        '+10 Galaxy scan range per level',
        'Detect all fleet movements',
        '+50% Espionage effectiveness',
        'Early warning system'
      ],
      requirements: {
        metal: 20000000,
        crystal: 30000000,
        deuterium: 15000000,
        darkMatter: 4000,
        antimatter: 2000,
        time: '28 days'
      },
      unlockRequirements: [
        'Espionage Technology Level 15',
        'Computer Technology Level 16',
        'Astrophysics Level 14'
      ],
      modules: [
        {
          name: 'Quantum Sensor Grid',
          installed: true,
          effect: '+20 Scan range',
          cost: { metal: 4000000, crystal: 6000000, deuterium: 3000000 }
        },
        {
          name: 'AI Analysis Core',
          installed: true,
          effect: '+100% Detection',
          cost: { metal: 5000000, crystal: 7000000, deuterium: 3500000 }
        },
        {
          name: 'Stealth Detector',
          installed: true,
          effect: 'Detect cloaked ships',
          cost: { metal: 6000000, crystal: 9000000, deuterium: 4000000 }
        }
      ],
      stats: {
        capacity: '60 Galaxy range'
      }
    },
    {
      id: 'dark-matter-harvester',
      name: 'Dark Matter Harvester',
      type: 'special',
      tier: 'Legendary',
      level: 1,
      maxLevel: 5,
      status: 'locked',
      description: 'Extracts dark matter from the fabric of space-time itself, the most valuable resource in the universe.',
      effects: [
        '+500 Dark Matter per day per level',
        '+100 Antimatter per day per level',
        'Unlocks Reality Manipulation',
        'Access to Exotic technologies'
      ],
      requirements: {
        metal: 150000000,
        crystal: 100000000,
        deuterium: 75000000,
        darkMatter: 20000,
        antimatter: 10000,
        time: '90 days'
      },
      unlockRequirements: [
        'Hyperspace Technology Level 20',
        'Graviton Technology Level 18',
        'Astrophysics Level 20',
        'Complete all other Mega Structures'
      ],
      modules: [
        {
          name: 'Void Extractor',
          installed: false,
          effect: '+1,000 Dark Matter/day',
          cost: { metal: 30000000, crystal: 20000000, deuterium: 15000000 }
        },
        {
          name: 'Reality Anchor',
          installed: false,
          effect: 'Stabilize extraction',
          cost: { metal: 25000000, crystal: 18000000, deuterium: 12000000 }
        },
        {
          name: 'Dimensional Rift Generator',
          installed: false,
          effect: '+500% Efficiency',
          cost: { metal: 40000000, crystal: 30000000, deuterium: 20000000 }
        }
      ],
      stats: {
        capacity: 'Unlimited'
      }
    }
  ];

  const categories = [
    { id: 'all', name: 'All Structures', icon: 'ri-apps-line' },
    { id: 'energy', name: 'Energy', icon: 'ri-flashlight-line' },
    { id: 'military', name: 'Military', icon: 'ri-shield-star-line' },
    { id: 'research', name: 'Research', icon: 'ri-flask-line' },
    { id: 'economic', name: 'Economic', icon: 'ri-coins-line' },
    { id: 'special', name: 'Special', icon: 'ri-star-line' }
  ];

  const filteredStructures = selectedCategory === 'all' 
    ? megaStructures 
    : megaStructures.filter(s => s.type === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-emerald-400';
      case 'construction': return 'text-amber-400';
      case 'upgrading': return 'text-blue-400';
      case 'damaged': return 'text-red-400';
      case 'locked': return 'text-gray-500';
      default: return 'text-gray-400';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Legendary': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Epic': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'Rare': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'energy': return 'ri-flashlight-line';
      case 'military': return 'ri-shield-star-line';
      case 'research': return 'ri-flask-line';
      case 'economic': return 'ri-coins-line';
      case 'special': return 'ri-star-line';
      default: return 'ri-building-line';
    }
  };

  useEffect(() => {
    if (user) {
      loadPlayerStructures();
      loadConstructionQueue();
    }
  }, [user]);

  const loadPlayerStructures = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('player_megastructures')
      .select('*')
      .eq('player_id', user.id);
    
    if (data) {
      setPlayerStructures(data);
    }
  };

  const loadConstructionQueue = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('megastructure_queue')
      .select('*')
      .eq('player_id', user.id)
      .order('created_at', { ascending: true });
    
    if (data) {
      setConstructionQueue(data);
    }
  };

  const startConstruction = async (structure: MegaStructure) => {
    if (!user) return;

    const cost = {
      metal: structure.requirements.metal,
      crystal: structure.requirements.crystal,
      deuterium: structure.requirements.deuterium,
      dark_matter: structure.requirements.darkMatter
    };

    if (!resources || resources.metal < cost.metal || resources.crystal < cost.crystal || 
        resources.deuterium < cost.deuterium || resources.dark_matter < cost.dark_matter) {
      alert('Insufficient resources!');
      return;
    }

    if (antimatter < structure.requirements.antimatter) {
      alert('Insufficient Antimatter!');
      return;
    }

    const success = await deductResources(cost);
    if (!success) return;

    setAntimatter(prev => prev - structure.requirements.antimatter);

    const completionTime = new Date();
    const timeInSeconds = parseTimeString(structure.requirements.time);
    completionTime.setSeconds(completionTime.getSeconds() + timeInSeconds);

    await supabase.from('megastructure_queue').insert({
      player_id: user.id,
      structure_id: structure.id,
      structure_name: structure.name,
      completion_time: completionTime.toISOString(),
      progress: 0
    });

    await supabase.from('player_megastructures').insert({
      player_id: user.id,
      structure_id: structure.id,
      structure_name: structure.name,
      level: 1,
      status: 'construction'
    });

    loadConstructionQueue();
    loadPlayerStructures();
    setShowConstructModal(false);
    alert(`Construction of ${structure.name} has begun!`);
  };

  const upgradeStructure = async (structure: MegaStructure) => {
    if (!user) return;

    const cost = {
      metal: Math.floor(structure.requirements.metal * 1.5),
      crystal: Math.floor(structure.requirements.crystal * 1.5),
      deuterium: Math.floor(structure.requirements.deuterium * 1.5),
      dark_matter: Math.floor(structure.requirements.darkMatter * 1.2)
    };

    if (!resources || resources.metal < cost.metal || resources.crystal < cost.crystal || 
        resources.deuterium < cost.deuterium || resources.dark_matter < cost.dark_matter) {
      alert('Insufficient resources for upgrade!');
      return;
    }

    const success = await deductResources(cost);
    if (!success) return;

    const completionTime = new Date();
    const timeInSeconds = parseTimeString(structure.requirements.time);
    completionTime.setSeconds(completionTime.getSeconds() + timeInSeconds);

    await supabase.from('megastructure_queue').insert({
      player_id: user.id,
      structure_id: structure.id,
      structure_name: structure.name,
      completion_time: completionTime.toISOString(),
      progress: 0,
      is_upgrade: true
    });

    await supabase
      .from('player_megastructures')
      .update({ status: 'upgrading' })
      .eq('player_id', user.id)
      .eq('structure_id', structure.id);

    loadConstructionQueue();
    loadPlayerStructures();
    setShowUpgradeModal(false);
    alert(`Upgrade of ${structure.name} has begun!`);
  };

  const speedUpConstruction = async (queueItem: any) => {
    if (!user) return;

    const darkMatterCost = 1000;
    
    if (!resources || resources.dark_matter < darkMatterCost) {
      alert('Insufficient Dark Matter!');
      return;
    }

    const success = await deductResources({ dark_matter: darkMatterCost });
    if (!success) return;

    await supabase
      .from('megastructure_queue')
      .delete()
      .eq('id', queueItem.id);

    await supabase
      .from('player_megastructures')
      .update({ 
        status: 'operational',
        level: queueItem.is_upgrade ? supabase.sql`level + 1` : 1
      })
      .eq('player_id', user.id)
      .eq('structure_id', queueItem.structure_id);

    loadConstructionQueue();
    loadPlayerStructures();
    alert('Construction completed instantly!');
  };

  const cancelConstruction = async (queueItem: any) => {
    if (!user) return;

    if (!confirm('Cancel construction? You will receive 50% of resources back.')) return;

    const structure = megaStructures.find(s => s.id === queueItem.structure_id);
    if (!structure) return;

    const refund = {
      metal: Math.floor(structure.requirements.metal * 0.5),
      crystal: Math.floor(structure.requirements.crystal * 0.5),
      deuterium: Math.floor(structure.requirements.deuterium * 0.5),
      dark_matter: Math.floor(structure.requirements.darkMatter * 0.5)
    };

    await updateResources({
      metal: resources.metal + refund.metal,
      crystal: resources.crystal + refund.crystal,
      deuterium: resources.deuterium + refund.deuterium,
      dark_matter: resources.dark_matter + refund.dark_matter
    });

    await supabase
      .from('megastructure_queue')
      .delete()
      .eq('id', queueItem.id);

    if (!queueItem.is_upgrade) {
      await supabase
        .from('player_megastructures')
        .delete()
        .eq('player_id', user.id)
        .eq('structure_id', queueItem.structure_id);
    } else {
      await supabase
        .from('player_megastructures')
        .update({ status: 'operational' })
        .eq('player_id', user.id)
        .eq('structure_id', queueItem.structure_id);
    }

    loadConstructionQueue();
    loadPlayerStructures();
    alert('Construction cancelled. Resources refunded.');
  };

  const repairStructure = async (structure: MegaStructure) => {
    if (!user) return;

    const repairCost = {
      metal: Math.floor(structure.requirements.metal * 0.3),
      crystal: Math.floor(structure.requirements.crystal * 0.3),
      deuterium: Math.floor(structure.requirements.deuterium * 0.3),
      dark_matter: Math.floor(structure.requirements.darkMatter * 0.2)
    };

    if (!resources || resources.metal < repairCost.metal || resources.crystal < repairCost.crystal || 
        resources.deuterium < repairCost.deuterium || resources.dark_matter < repairCost.dark_matter) {
      alert('Insufficient resources for repair!');
      return;
    }

    const success = await deductResources(repairCost);
    if (!success) return;

    await supabase
      .from('player_megastructures')
      .update({ status: 'operational' })
      .eq('player_id', user.id)
      .eq('structure_id', structure.id);

    loadPlayerStructures();
    setShowRepairModal(false);
    alert(`${structure.name} has been repaired!`);
  };

  const installModule = async (structure: MegaStructure, module: any) => {
    if (!user) return;

    const cost = {
      metal: module.cost.metal,
      crystal: module.cost.crystal,
      deuterium: module.cost.deuterium
    };

    if (!resources || resources.metal < cost.metal || resources.crystal < cost.crystal || 
        resources.deuterium < cost.deuterium) {
      alert('Insufficient resources to install module!');
      return;
    }

    const success = await deductResources(cost);
    if (!success) return;

    await supabase
      .from('player_structure_modules')
      .insert({
        player_id: user.id,
        structure_id: structure.id,
        module_name: module.name,
        installed: true
      });

    alert(`${module.name} installed successfully!`);
    setShowModules(false);
  };

  const dismantleStructure = async (structure: MegaStructure) => {
    if (!user) return;

    if (!confirm(`Dismantle ${structure.name}? You will receive 30% of resources back.`)) return;

    const refund = {
      metal: Math.floor(structure.requirements.metal * 0.3 * structure.level),
      crystal: Math.floor(structure.requirements.crystal * 0.3 * structure.level),
      deuterium: Math.floor(structure.requirements.deuterium * 0.3 * structure.level),
      dark_matter: Math.floor(structure.requirements.darkMatter * 0.3 * structure.level)
    };

    await updateResources({
      metal: resources.metal + refund.metal,
      crystal: resources.crystal + refund.crystal,
      deuterium: resources.deuterium + refund.deuterium,
      dark_matter: resources.dark_matter + refund.dark_matter
    });

    await supabase
      .from('player_megastructures')
      .delete()
      .eq('player_id', user.id)
      .eq('structure_id', structure.id);

    loadPlayerStructures();
    alert(`${structure.name} dismantled. Resources recovered.`);
  };

  const parseTimeString = (timeStr: string): number => {
    const match = timeStr.match(/(\d+)\s*(day|hour|minute)s?/);
    if (!match) return 3600;
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 'day': return value * 86400;
      case 'hour': return value * 3600;
      case 'minute': return value * 60;
      default: return 3600;
    }
  };

  const getPlayerStructure = (structureId: string) => {
    return playerStructures.find(ps => ps.structure_id === structureId);
  };

  const isInQueue = (structureId: string) => {
    return constructionQueue.some(q => q.structure_id === structureId);
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Mega Structures
            </h1>
            <p className="text-gray-400">Legendary constructions that shape the galaxy</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg px-4 py-2">
              <div className="text-xs text-gray-400 mb-1">Active Structures</div>
              <div className="text-xl font-bold text-cyan-400">{playerStructures.filter(ps => ps.status === 'operational').length} / 12</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-amber-500/30 rounded-lg px-4 py-2">
              <div className="text-xs text-gray-400 mb-1">Antimatter</div>
              <div className="text-xl font-bold text-pink-400">{antimatter.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg px-4 py-2">
              <div className="text-xs text-gray-400 mb-1">In Construction</div>
              <div className="text-xl font-bold text-purple-400">{constructionQueue.length}</div>
            </div>
          </div>
        </div>

        {/* Construction Queue */}
        {constructionQueue.length > 0 && (
          <div className="mb-6 bg-slate-800/30 backdrop-blur-sm border border-amber-500/30 rounded-xl p-4">
            <h3 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
              <i className="ri-hammer-line w-5 h-5 flex items-center justify-center"></i>
              Construction Queue
            </h3>
            <div className="space-y-2">
              {constructionQueue.map((item, idx) => (
                <div key={item.id} className="bg-slate-900/50 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-bold text-white mb-1">{item.structure_name}</div>
                    <div className="text-xs text-gray-400">
                      Completes: {new Date(item.completion_time).toLocaleString()}
                    </div>
                    <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => speedUpConstruction(item)}
                      className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
                    >
                      <i className="ri-flashlight-line mr-1 w-4 h-4 inline-flex items-center justify-center"></i>
                      Speed Up (1000 DM)
                    </button>
                    <button
                      onClick={() => cancelConstruction(item)}
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
                    >
                      <i className="ri-close-line w-4 h-4 inline-flex items-center justify-center"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400'
                  : 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:border-cyan-500/50'
              }`}
            >
              <i className={`${cat.icon} w-5 h-5 flex items-center justify-center`}></i>
              <span className="font-medium">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Structures Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 pb-12">
        {filteredStructures.map(structure => {
          const playerStructure = getPlayerStructure(structure.id);
          const inQueue = isInQueue(structure.id);
          const actualStatus = playerStructure?.status || structure.status;
          const actualLevel = playerStructure?.level || structure.level;

          return (
            <div
              key={structure.id}
              className={`bg-slate-800/30 backdrop-blur-sm border rounded-xl p-6 transition-all hover:scale-[1.02] cursor-pointer ${
                actualStatus === 'locked' 
                  ? 'border-gray-700 opacity-60' 
                  : 'border-cyan-500/30 hover:border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-500/20'
              }`}
              onClick={() => setSelectedStructure(structure)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${
                    structure.type === 'energy' ? 'from-yellow-500 to-orange-500' :
                    structure.type === 'military' ? 'from-red-500 to-pink-500' :
                    structure.type === 'research' ? 'from-blue-500 to-cyan-500' :
                    structure.type === 'economic' ? 'from-green-500 to-emerald-500' :
                    'from-purple-500 to-indigo-500'
                  } flex items-center justify-center`}>
                    <i className={`${getTypeIcon(structure.type)} text-2xl text-white w-8 h-8 flex items-center justify-center`}></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{structure.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded border ${getTierColor(structure.tier)}`}>
                        {structure.tier}
                      </span>
                      <span className={`text-sm font-medium ${getStatusColor(structure.status)}`}>
                        {structure.status.charAt(0).toUpperCase() + structure.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                {structure.status !== 'locked' && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-400">Lv.{structure.level}</div>
                    <div className="text-xs text-gray-400">Max: {structure.maxLevel}</div>
                  </div>
                )}
              </div>

              {/* Construction Progress */}
              {structure.status === 'construction' && structure.constructionProgress && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Construction Progress</span>
                    <span>{structure.constructionProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                      style={{ width: `${structure.constructionProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{structure.description}</p>

              {/* Stats */}
              {structure.status !== 'locked' && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {Object.entries(structure.stats).map(([key, value]) => (
                    <div key={key} className="bg-slate-900/50 rounded-lg p-2">
                      <div className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="text-sm font-bold text-cyan-400">{value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Effects Preview */}
              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-2">Key Effects:</div>
                <div className="space-y-1">
                  {structure.effects.slice(0, 2).map((effect, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <i className="ri-checkbox-circle-fill text-emerald-400 mt-0.5 w-4 h-4 flex items-center justify-center"></i>
                      <span className="text-gray-300">{effect}</span>
                    </div>
                  ))}
                  {structure.effects.length > 2 && (
                    <div className="text-xs text-cyan-400">+{structure.effects.length - 2} more effects...</div>
                  )}
                </div>
              </div>

              {/* Unlock Requirements */}
              {structure.status === 'locked' && structure.unlockRequirements && (
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-2">Unlock Requirements:</div>
                  <div className="space-y-1">
                    {structure.unlockRequirements.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <i className="ri-lock-line text-red-400 mt-0.5 w-4 h-4 flex items-center justify-center"></i>
                        <span className="text-gray-400">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {actualStatus === 'operational' && (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStructure(structure);
                        setShowUpgradeModal(true);
                      }}
                      className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap"
                    >
                      <i className="ri-arrow-up-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                      Upgrade
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowModules(!showModules);
                        setSelectedStructure(structure);
                      }}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap"
                    >
                      <i className="ri-settings-3-line w-4 h-4 inline-flex items-center justify-center"></i>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        dismantleStructure(structure);
                      }}
                      className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap"
                    >
                      <i className="ri-delete-bin-line w-4 h-4 inline-flex items-center justify-center"></i>
                    </button>
                  </>
                )}
                {actualStatus === 'locked' && !playerStructure && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStructure(structure);
                      setShowConstructModal(true);
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap"
                  >
                    <i className="ri-hammer-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                    Construct
                  </button>
                )}
                {actualStatus === 'construction' && inQueue && (
                  <button className="flex-1 bg-amber-600 text-white px-4 py-2 rounded-lg font-medium cursor-default whitespace-nowrap">
                    <i className="ri-time-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                    Under Construction
                  </button>
                )}
                {actualStatus === 'damaged' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStructure(structure);
                      setShowRepairModal(true);
                    }}
                    className="flex-1 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap"
                  >
                    <i className="ri-tools-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                    Repair
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && selectedStructure && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={() => setShowUpgradeModal(false)}>
          <div className="bg-slate-900 border border-cyan-500/30 rounded-xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Upgrade {selectedStructure.name}</h2>
            <p className="text-gray-400 mb-6">Upgrade to Level {selectedStructure.level + 1}</p>
            
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-white mb-3">Upgrade Cost:</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Metal:</span>
                  <span className="text-blue-400 font-bold">{Math.floor(selectedStructure.requirements.metal * 1.5).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Crystal:</span>
                  <span className="text-purple-400 font-bold">{Math.floor(selectedStructure.requirements.crystal * 1.5).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Deuterium:</span>
                  <span className="text-emerald-400 font-bold">{Math.floor(selectedStructure.requirements.deuterium * 1.5).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Dark Matter:</span>
                  <span className="text-indigo-400 font-bold">{Math.floor(selectedStructure.requirements.darkMatter * 1.2).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => upgradeStructure(selectedStructure)}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap"
              >
                Confirm Upgrade
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Construct Modal */}
      {showConstructModal && selectedStructure && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={() => setShowConstructModal(false)}>
          <div className="bg-slate-900 border border-cyan-500/30 rounded-xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Construct {selectedStructure.name}</h2>
            <p className="text-gray-400 mb-6">{selectedStructure.description}</p>
            
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-white mb-3">Construction Cost:</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Metal:</span>
                  <span className="text-blue-400 font-bold">{selectedStructure.requirements.metal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Crystal:</span>
                  <span className="text-purple-400 font-bold">{selectedStructure.requirements.crystal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Deuterium:</span>
                  <span className="text-emerald-400 font-bold">{selectedStructure.requirements.deuterium.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Dark Matter:</span>
                  <span className="text-indigo-400 font-bold">{selectedStructure.requirements.darkMatter.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Antimatter:</span>
                  <span className="text-pink-400 font-bold">{selectedStructure.requirements.antimatter.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time:</span>
                  <span className="text-amber-400 font-bold">{selectedStructure.requirements.time}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => startConstruction(selectedStructure)}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap"
              >
                Start Construction
              </button>
              <button
                onClick={() => setShowConstructModal(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Repair Modal */}
      {showRepairModal && selectedStructure && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={() => setShowRepairModal(false)}>
          <div className="bg-slate-900 border border-orange-500/30 rounded-xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-orange-400 mb-4">Repair {selectedStructure.name}</h2>
            <p className="text-gray-400 mb-6">This structure has been damaged and requires repairs.</p>
            
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-white mb-3">Repair Cost (30% of original):</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Metal:</span>
                  <span className="text-blue-400 font-bold">{Math.floor(selectedStructure.requirements.metal * 0.3).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Crystal:</span>
                  <span className="text-purple-400 font-bold">{Math.floor(selectedStructure.requirements.crystal * 0.3).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Deuterium:</span>
                  <span className="text-emerald-400 font-bold">{Math.floor(selectedStructure.requirements.deuterium * 0.3).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Dark Matter:</span>
                  <span className="text-indigo-400 font-bold">{Math.floor(selectedStructure.requirements.darkMatter * 0.2).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => repairStructure(selectedStructure)}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap"
              >
                Repair Now
              </button>
              <button
                onClick={() => setShowRepairModal(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Module Details Modal */}
      {showModules && selectedStructure && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={() => setShowModules(false)}>
          <div className="bg-slate-900 border border-cyan-500/30 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-cyan-500/30 p-6 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedStructure.name}</h2>
                  <p className="text-gray-400">{selectedStructure.description}</p>
                </div>
                <button 
                  onClick={() => setShowModules(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="ri-close-line text-2xl w-8 h-8 flex items-center justify-center"></i>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* All Effects */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-3">Structure Effects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedStructure.effects.map((effect, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-800/50 rounded-lg p-3">
                      <i className="ri-checkbox-circle-fill text-emerald-400 mt-0.5 w-5 h-5 flex items-center justify-center"></i>
                      <span className="text-sm text-gray-300">{effect}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upgrade Requirements */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-3">Next Level Requirements</h3>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Metal</div>
                      <div className="text-lg font-bold text-blue-400">{selectedStructure.requirements.metal.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Crystal</div>
                      <div className="text-lg font-bold text-purple-400">{selectedStructure.requirements.crystal.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Deuterium</div>
                      <div className="text-lg font-bold text-emerald-400">{selectedStructure.requirements.deuterium.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Dark Matter</div>
                      <div className="text-lg font-bold text-indigo-400">{selectedStructure.requirements.darkMatter.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Antimatter</div>
                      <div className="text-lg font-bold text-pink-400">{selectedStructure.requirements.antimatter.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <i className="ri-time-line w-4 h-4 flex items-center justify-center"></i>
                    <span>Construction Time: {selectedStructure.requirements.time}</span>
                  </div>
                </div>
              </div>

              {/* Modules */}
              <div>
                <h3 className="text-lg font-bold text-cyan-400 mb-3">Available Modules</h3>
                <div className="space-y-3">
                  {selectedStructure.modules.map((module, idx) => (
                    <div key={idx} className={`bg-slate-800/50 border rounded-lg p-4 ${
                      module.installed ? 'border-emerald-500/30' : 'border-slate-700'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-white">{module.name}</h4>
                            {module.installed && (
                              <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
                                Installed
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{module.effect}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4 text-sm">
                          <span className="text-blue-400">{module.cost.metal.toLocaleString()} Metal</span>
                          <span className="text-purple-400">{module.cost.crystal.toLocaleString()} Crystal</span>
                          <span className="text-emerald-400">{module.cost.deuterium.toLocaleString()} Deuterium</span>
                        </div>
                        {!module.installed && (
                          <button 
                            onClick={() => installModule(selectedStructure, module)}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-1 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
                          >
                            Install Module
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
