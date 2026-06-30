import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface Starbase {
  id: string;
  name: string;
  location: string;
  coordinates: string;
  level: number;
  maxLevel: number;
  type: 'trade' | 'military' | 'diplomatic' | 'research' | 'industrial';
  status: 'operational' | 'construction' | 'upgrading' | 'under-attack';
  dockingBays: number;
  maxDockingBays: number;
  modules: string[];
  services: string[];
  defenseRating: number;
  tradeVolume: number;
  population: number;
  upgradeCost: {
    metal: number;
    crystal: number;
    deuterium: number;
    darkMatter: number;
    time: string;
  };
  income: {
    credits: number;
    reputation: number;
  };
  icon: string;
}

interface BuildLocation {
  id: string;
  name: string;
  sector: string;
  coordinates: string;
  description: string;
  bonuses: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

interface StarbaseType {
  id: 'trade' | 'military' | 'diplomatic' | 'research' | 'industrial';
  name: string;
  description: string;
  icon: string;
  color: string;
  buildCost: {
    metal: number;
    crystal: number;
    deuterium: number;
    darkMatter: number;
    credits: number;
    time: string;
  };
  baseStats: {
    dockingBays: number;
    defenseRating: number;
    population: number;
  };
  specialties: string[];
}

export default function StarbasesPage() {
  useAuth();
  const [starbases, setStarbases] = useState<Starbase[]>([]);
  const [selectedBase, setSelectedBase] = useState<Starbase | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [buildStep, setBuildStep] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<BuildLocation | null>(null);
  const [selectedType, setSelectedType] = useState<StarbaseType | null>(null);
  const [starbaseName, setStarbaseName] = useState('');

  const availableLocations: BuildLocation[] = [
    {
      id: '1',
      name: 'Nebula Frontier',
      sector: 'Outer Rim',
      coordinates: '8:234:5',
      description: 'Rich in resources but exposed to pirate activity',
      bonuses: ['+20% Resource Production', '+15% Trade Volume'],
      difficulty: 'hard'
    },
    {
      id: '2',
      name: 'Core Worlds Junction',
      sector: 'Inner Core',
      coordinates: '2:567:3',
      description: 'Safe and well-connected trade hub location',
      bonuses: ['+30% Trade Volume', '+10% Reputation Gain'],
      difficulty: 'easy'
    },
    {
      id: '3',
      name: 'Border Defense Line',
      sector: 'Border Zone',
      coordinates: '5:890:7',
      description: 'Strategic military position near hostile territory',
      bonuses: ['+25% Defense Rating', '+15% Military Production'],
      difficulty: 'medium'
    },
    {
      id: '4',
      name: 'Science Cluster',
      sector: 'Research Sector',
      coordinates: '7:123:9',
      description: 'Near anomalies and research opportunities',
      bonuses: ['+20% Research Speed', '+10% Technology Discovery'],
      difficulty: 'medium'
    },
    {
      id: '5',
      name: 'Industrial Belt',
      sector: 'Manufacturing Zone',
      coordinates: '4:456:2',
      description: 'Asteroid-rich area perfect for mining and production',
      bonuses: ['+25% Production Speed', '+15% Resource Efficiency'],
      difficulty: 'easy'
    },
    {
      id: '6',
      name: 'Diplomatic Nexus',
      sector: 'Neutral Zone',
      coordinates: '3:789:4',
      description: 'Central location for alliance coordination',
      bonuses: ['+30% Reputation Gain', '+20% Alliance Benefits'],
      difficulty: 'medium'
    }
  ];

  const starbaseTypes: StarbaseType[] = [
    {
      id: 'trade',
      name: 'Trade Hub',
      description: 'Maximize profits through commerce and resource trading',
      icon: 'ri-store-3-line',
      color: 'emerald',
      buildCost: {
        metal: 250000,
        crystal: 200000,
        deuterium: 150000,
        darkMatter: 500,
        credits: 1000000,
        time: '12 hours'
      },
      baseStats: {
        dockingBays: 40,
        defenseRating: 50,
        population: 10000
      },
      specialties: ['Trading Hub', 'Market Exchange', 'Cargo Storage', 'Banking Facilities']
    },
    {
      id: 'military',
      name: 'Military Fortress',
      description: 'Defend your territory with superior firepower',
      icon: 'ri-shield-star-line',
      color: 'red',
      buildCost: {
        metal: 400000,
        crystal: 350000,
        deuterium: 300000,
        darkMatter: 1000,
        credits: 1500000,
        time: '18 hours'
      },
      baseStats: {
        dockingBays: 50,
        defenseRating: 90,
        population: 15000
      },
      specialties: ['Command Center', 'Weapons Array', 'Shield Generators', 'Barracks']
    },
    {
      id: 'diplomatic',
      name: 'Diplomatic Station',
      description: 'Foster alliances and negotiate peace treaties',
      icon: 'ri-government-line',
      color: 'blue',
      buildCost: {
        metal: 200000,
        crystal: 250000,
        deuterium: 150000,
        darkMatter: 600,
        credits: 1200000,
        time: '10 hours'
      },
      baseStats: {
        dockingBays: 30,
        defenseRating: 55,
        population: 8000
      },
      specialties: ['Embassy Halls', 'Conference Rooms', 'Treaty Archives', 'Cultural Center']
    },
    {
      id: 'research',
      name: 'Research Nexus',
      description: 'Unlock advanced technologies and innovations',
      icon: 'ri-flask-line',
      color: 'purple',
      buildCost: {
        metal: 300000,
        crystal: 400000,
        deuterium: 250000,
        darkMatter: 1200,
        credits: 1800000,
        time: '16 hours'
      },
      baseStats: {
        dockingBays: 25,
        defenseRating: 60,
        population: 12000
      },
      specialties: ['Quantum Labs', 'Particle Accelerator', 'Observatory', 'Data Centers']
    },
    {
      id: 'industrial',
      name: 'Industrial Complex',
      description: 'Mass produce ships and equipment efficiently',
      icon: 'ri-building-4-line',
      color: 'orange',
      buildCost: {
        metal: 350000,
        crystal: 300000,
        deuterium: 280000,
        darkMatter: 800,
        credits: 1400000,
        time: '14 hours'
      },
      baseStats: {
        dockingBays: 45,
        defenseRating: 65,
        population: 18000
      },
      specialties: ['Shipyard', 'Manufacturing Plants', 'Assembly Lines', 'Refineries']
    }
  ];

  useEffect(() => {
    loadStarbases();
  }, []);

  const loadStarbases = async () => {
    const mockBases: Starbase[] = [
      {
        id: '1',
        name: 'Deep Space Nine',
        location: 'Bajoran Sector',
        coordinates: '2:458:7',
        level: 28,
        maxLevel: 50,
        type: 'trade',
        status: 'operational',
        dockingBays: 45,
        maxDockingBays: 50,
        modules: ['Trading Hub', 'Market Exchange', 'Cargo Storage', 'Customs Office', 'Banking Facilities'],
        services: ['Ship Repair', 'Refueling', 'Crew Quarters', 'Medical Bay', 'Entertainment District'],
        defenseRating: 75,
        tradeVolume: 2500000,
        population: 15000,
        upgradeCost: {
          metal: 500000,
          crystal: 400000,
          deuterium: 250000,
          darkMatter: 1000,
          time: '24 hours'
        },
        income: {
          credits: 150000,
          reputation: 500
        },
        icon: 'ri-store-3-line'
      },
      {
        id: '2',
        name: 'Fortress Omega',
        location: 'Border Zone Alpha',
        coordinates: '5:123:9',
        level: 35,
        maxLevel: 50,
        type: 'military',
        status: 'operational',
        dockingBays: 60,
        maxDockingBays: 80,
        modules: ['Command Center', 'Weapons Array', 'Shield Generators', 'Barracks', 'War Room', 'Armory'],
        services: ['Fleet Coordination', 'Tactical Planning', 'Training Facilities', 'Weapon Upgrades'],
        defenseRating: 98,
        tradeVolume: 500000,
        population: 25000,
        upgradeCost: {
          metal: 800000,
          crystal: 700000,
          deuterium: 500000,
          darkMatter: 2000,
          time: '36 hours'
        },
        income: {
          credits: 80000,
          reputation: 1000
        },
        icon: 'ri-shield-star-line'
      },
      {
        id: '3',
        name: 'Diplomatic Station Unity',
        location: 'Neutral Zone',
        coordinates: '3:789:5',
        level: 22,
        maxLevel: 50,
        type: 'diplomatic',
        status: 'operational',
        dockingBays: 30,
        maxDockingBays: 40,
        modules: ['Embassy Halls', 'Conference Rooms', 'Treaty Archives', 'Cultural Center', 'Meditation Gardens'],
        services: ['Alliance Meetings', 'Peace Negotiations', 'Cultural Exchange', 'Diplomatic Immunity'],
        defenseRating: 60,
        tradeVolume: 800000,
        population: 8000,
        upgradeCost: {
          metal: 350000,
          crystal: 450000,
          deuterium: 200000,
          darkMatter: 800,
          time: '18 hours'
        },
        income: {
          credits: 100000,
          reputation: 2000
        },
        icon: 'ri-government-line'
      },
      {
        id: '4',
        name: 'Research Nexus',
        location: 'Science Sector',
        coordinates: '7:456:3',
        level: 30,
        maxLevel: 50,
        type: 'research',
        status: 'operational',
        dockingBays: 25,
        maxDockingBays: 35,
        modules: ['Quantum Labs', 'Particle Accelerator', 'Observatory', 'Data Centers', 'Experimental Wing', 'Library'],
        services: ['Technology Research', 'Blueprint Analysis', 'Scientific Collaboration', 'Data Sharing'],
        defenseRating: 65,
        tradeVolume: 600000,
        population: 12000,
        upgradeCost: {
          metal: 400000,
          crystal: 600000,
          deuterium: 300000,
          darkMatter: 1500,
          time: '30 hours'
        },
        income: {
          credits: 120000,
          reputation: 800
        },
        icon: 'ri-flask-line'
      },
      {
        id: '5',
        name: 'Industrial Complex Titan',
        location: 'Manufacturing Zone',
        coordinates: '4:234:8',
        level: 26,
        maxLevel: 50,
        type: 'industrial',
        status: 'upgrading',
        dockingBays: 55,
        maxDockingBays: 70,
        modules: ['Shipyard', 'Manufacturing Plants', 'Assembly Lines', 'Refineries', 'Quality Control', 'Logistics Hub'],
        services: ['Ship Construction', 'Component Manufacturing', 'Resource Processing', 'Equipment Production'],
        defenseRating: 70,
        tradeVolume: 1800000,
        population: 20000,
        upgradeCost: {
          metal: 600000,
          crystal: 500000,
          deuterium: 400000,
          darkMatter: 1200,
          time: '28 hours'
        },
        income: {
          credits: 200000,
          reputation: 600
        },
        icon: 'ri-building-4-line'
      }
    ];

    setStarbases(mockBases);
  };

  const handleUpgrade = async (baseId: string) => {
    const base = starbases.find(b => b.id === baseId);
    if (!base) return;

    if (confirm(`Upgrade ${base.name} to Level ${base.level + 1}?\n\nCost:\nMetal: ${base.upgradeCost.metal.toLocaleString()}\nCrystal: ${base.upgradeCost.crystal.toLocaleString()}\nDeuterium: ${base.upgradeCost.deuterium.toLocaleString()}\nDark Matter: ${base.upgradeCost.darkMatter.toLocaleString()}\nTime: ${base.upgradeCost.time}`)) {
      setStarbases(prev => prev.map(b => 
        b.id === baseId 
          ? { ...b, status: 'upgrading' as const }
          : b
      ));
    }
  };

  const handleAddModule = async (baseId: string) => {
    alert('Module installation feature coming soon!');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trade': return 'emerald';
      case 'military': return 'red';
      case 'diplomatic': return 'blue';
      case 'research': return 'purple';
      case 'industrial': return 'orange';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-emerald-400';
      case 'construction': return 'text-blue-400';
      case 'upgrading': return 'text-amber-400';
      case 'under-attack': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const filteredBases = activeFilter === 'all' 
    ? starbases 
    : starbases.filter(b => b.type === activeFilter);

  const totalIncome = starbases.reduce((sum, b) => ({
    credits: sum.credits + b.income.credits,
    reputation: sum.reputation + b.income.reputation
  }), { credits: 0, reputation: 0 });

  const handleBuildStarbase = async () => {
    if (!selectedLocation || !selectedType || !starbaseName.trim()) {
      alert('Please complete all steps before building!');
      return;
    }

    if (confirm(`Build ${starbaseName}?\n\nType: ${selectedType.name}\nLocation: ${selectedLocation.name}\n\nCost:\nMetal: ${selectedType.buildCost.metal.toLocaleString()}\nCrystal: ${selectedType.buildCost.crystal.toLocaleString()}\nDeuterium: ${selectedType.buildCost.deuterium.toLocaleString()}\nDark Matter: ${selectedType.buildCost.darkMatter.toLocaleString()}\nCredits: ${selectedType.buildCost.credits.toLocaleString()}\nTime: ${selectedType.buildCost.time}`)) {
      const newBase: Starbase = {
        id: Date.now().toString(),
        name: starbaseName,
        location: selectedLocation.name,
        coordinates: selectedLocation.coordinates,
        level: 1,
        maxLevel: 50,
        type: selectedType.id,
        status: 'construction',
        dockingBays: selectedType.baseStats.dockingBays,
        maxDockingBays: selectedType.baseStats.dockingBays + 10,
        modules: selectedType.specialties,
        services: ['Ship Repair', 'Refueling', 'Crew Quarters'],
        defenseRating: selectedType.baseStats.defenseRating,
        tradeVolume: 100000,
        population: selectedType.baseStats.population,
        upgradeCost: {
          metal: 100000,
          crystal: 80000,
          deuterium: 60000,
          darkMatter: 300,
          time: '6 hours'
        },
        income: {
          credits: 50000,
          reputation: 200
        },
        icon: selectedType.icon
      };

      setStarbases(prev => [...prev, newBase]);
      setShowBuildModal(false);
      setBuildStep(1);
      setSelectedLocation(null);
      setSelectedType(null);
      setStarbaseName('');
      
      alert(`${starbaseName} construction started! It will be operational in ${selectedType.buildCost.time}.`);
    }
  };

  const resetBuildModal = () => {
    setShowBuildModal(false);
    setBuildStep(1);
    setSelectedLocation(null);
    setSelectedType(null);
    setStarbaseName('');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-emerald-400';
      case 'medium': return 'text-amber-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="text-white">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://readdy.ai/api/search-image?query=massive%20futuristic%20space%20station%20starbase%20orbital%20platform%20with%20docking%20bays%20modules%20structures%20glowing%20lights%20ships%20docked%20sci-fi%20architecture%20deep%20space%20stars%20nebula%20background&width=1920&height=600&seq=starbase-hero&orientation=landscape" alt="Starbase" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <h1 className="text-6xl font-black uppercase text-white mb-4">Starbase Command</h1>
          <p className="text-xl text-gray-300">Manage your orbital stations and deep space outposts</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-[#0F1F3A] border border-cyan-400/30 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Total Starbases</div>
            <div className="text-3xl font-bold text-cyan-400">{starbases.length}</div>
          </div>
          <div className="bg-[#0F1F3A] border border-emerald-400/30 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Credits/Day</div>
            <div className="text-3xl font-bold text-emerald-400">{totalIncome.credits.toLocaleString()}</div>
          </div>
          <div className="bg-[#0F1F3A] border border-purple-400/30 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Reputation/Day</div>
            <div className="text-3xl font-bold text-purple-400">{totalIncome.reputation.toLocaleString()}</div>
          </div>
          <div className="bg-[#0F1F3A] border border-blue-400/30 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Total Population</div>
            <div className="text-3xl font-bold text-blue-400">{starbases.reduce((sum, b) => sum + b.population, 0).toLocaleString()}</div>
          </div>
          <div className="bg-[#0F1F3A] border border-amber-400/30 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Docking Bays</div>
            <div className="text-3xl font-bold text-amber-400">{starbases.reduce((sum, b) => sum + b.dockingBays, 0)}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'all', name: 'All Starbases', icon: 'ri-space-ship-line' },
            { id: 'trade', name: 'Trade', icon: 'ri-store-3-line' },
            { id: 'military', name: 'Military', icon: 'ri-shield-star-line' },
            { id: 'diplomatic', name: 'Diplomatic', icon: 'ri-government-line' },
            { id: 'research', name: 'Research', icon: 'ri-flask-line' },
            { id: 'industrial', name: 'Industrial', icon: 'ri-building-4-line' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeFilter === filter.id
                  ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400'
                  : 'bg-[#0F1F3A] border border-cyan-400/30 text-gray-400 hover:border-cyan-500/50'
              }`}
            >
              <i className={`${filter.icon} w-5 h-5 flex items-center justify-center`}></i>
              <span>{filter.name}</span>
            </button>
          ))}
        </div>

        {/* Starbases Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBases.map(base => (
            <div
              key={base.id}
              className="bg-[#0F1F3A] border border-cyan-400/30 rounded-xl overflow-hidden hover:border-cyan-400/60 transition-all"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-lg bg-${getTypeColor(base.type)}-400/20 flex items-center justify-center flex-shrink-0`}>
                    <i className={`${base.icon} text-3xl text-${getTypeColor(base.type)}-400 w-10 h-10 flex items-center justify-center`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white mb-1">{base.name}</h3>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`text-xs px-2 py-1 rounded bg-${getTypeColor(base.type)}-400/20 text-${getTypeColor(base.type)}-400 font-bold capitalize`}>
                        {base.type}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-slate-700 text-gray-300">
                        Level {base.level}
                      </span>
                      <span className={`text-xs font-medium ${getStatusColor(base.status)} capitalize`}>
                        {base.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">{base.location} • {base.coordinates}</div>
                  </div>
                </div>

                {/* Docking Bays */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Docking Bays</span>
                    <span>{base.dockingBays} / {base.maxDockingBays}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all"
                      style={{ width: `${(base.dockingBays / base.maxDockingBays) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <div className="text-xs text-gray-400">Defense</div>
                    <div className="text-sm font-bold text-red-400">{base.defenseRating}%</div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <div className="text-xs text-gray-400">Trade Vol.</div>
                    <div className="text-sm font-bold text-emerald-400">{(base.tradeVolume / 1000).toFixed(0)}K</div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <div className="text-xs text-gray-400">Population</div>
                    <div className="text-sm font-bold text-blue-400">{(base.population / 1000).toFixed(0)}K</div>
                  </div>
                </div>

                {/* Income */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-slate-800/50 rounded p-2">
                    <div className="text-xs text-gray-400">Credits/Day</div>
                    <div className="text-lg font-bold text-emerald-400">{base.income.credits.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2">
                    <div className="text-xs text-gray-400">Reputation/Day</div>
                    <div className="text-lg font-bold text-purple-400">{base.income.reputation.toLocaleString()}</div>
                  </div>
                </div>

                {/* Modules */}
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-2">Modules ({base.modules.length}):</div>
                  <div className="flex flex-wrap gap-1">
                    {base.modules.slice(0, 3).map((module, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-slate-800/50 rounded text-gray-300">
                        {module}
                      </span>
                    ))}
                    {base.modules.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-slate-800/50 rounded text-cyan-400">
                        +{base.modules.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {base.status === 'operational' && (
                    <>
                      <button
                        onClick={() => handleUpgrade(base.id)}
                        className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-arrow-up-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                        Upgrade
                      </button>
                      <button
                        onClick={() => handleAddModule(base.id)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-add-line w-4 h-4 inline-flex items-center justify-center"></i>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedBase(base)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-eye-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Build New Starbase Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowBuildModal(true)}
            className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold text-lg rounded-lg hover:scale-105 transition-all whitespace-nowrap cursor-pointer shadow-lg shadow-cyan-400/50"
          >
            <i className="ri-add-circle-line mr-2"></i>
            Build New Starbase
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {selectedBase && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={() => setSelectedBase(null)}>
          <div className="bg-[#0F1F3A] border border-cyan-400/30 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedBase.name}</h2>
                  <p className="text-gray-400">{selectedBase.location} • Level {selectedBase.level}</p>
                </div>
                <button
                  onClick={() => setSelectedBase(null)}
                  className="w-10 h-10 bg-black/50 hover:bg-black/70 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                >
                  <i className="ri-close-line text-2xl text-white w-6 h-6 flex items-center justify-center"></i>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-cyan-400 mb-3">All Modules</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedBase.modules.map((module, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-800/50 rounded p-3">
                        <i className="ri-checkbox-circle-fill text-cyan-400 w-5 h-5 flex items-center justify-center"></i>
                        <span className="text-gray-300">{module}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-cyan-400 mb-3">Available Services</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedBase.services.map((service, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-800/50 rounded p-3">
                        <i className="ri-star-fill text-purple-400 w-5 h-5 flex items-center justify-center"></i>
                        <span className="text-gray-300">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-cyan-400 mb-3">Upgrade Cost</h3>
                  <div className="grid grid-cols-5 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Metal</div>
                      <div className="text-xl font-bold text-yellow-400">{selectedBase.upgradeCost.metal.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Crystal</div>
                      <div className="text-xl font-bold text-blue-400">{selectedBase.upgradeCost.crystal.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Deuterium</div>
                      <div className="text-xl font-bold text-green-400">{selectedBase.upgradeCost.deuterium.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Dark Matter</div>
                      <div className="text-xl font-bold text-purple-400">{selectedBase.upgradeCost.darkMatter.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Time</div>
                      <div className="text-xl font-bold text-cyan-400">{selectedBase.upgradeCost.time}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Build Modal */}
      {showBuildModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={resetBuildModal}>
          <div className="bg-[#0F1F3A] border border-cyan-400/30 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Build New Starbase</h2>
                  <p className="text-gray-400">Establish a new orbital station to expand your empire</p>
                </div>
                <button
                  onClick={resetBuildModal}
                  className="w-10 h-10 bg-black/50 hover:bg-black/70 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                >
                  <i className="ri-close-line text-2xl text-white w-6 h-6 flex items-center justify-center"></i>
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-4 mb-8">
                {[
                  { step: 1, label: 'Location', icon: 'ri-map-pin-line' },
                  { step: 2, label: 'Type', icon: 'ri-building-line' },
                  { step: 3, label: 'Confirm', icon: 'ri-checkbox-circle-line' }
                ].map((item, idx) => (
                  <div key={item.step} className="flex items-center">
                    <div className={`flex items-center gap-3 ${buildStep >= item.step ? 'opacity-100' : 'opacity-40'}`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        buildStep >= item.step
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-700 text-gray-400'
                      }`}>
                        <i className={`${item.icon} w-6 h-6 flex items-center justify-center`}></i>
                      </div>
                      <span className="text-sm font-medium text-white">{item.label}</span>
                    </div>
                    {idx < 2 && (
                      <div className={`w-16 h-1 mx-4 rounded ${buildStep > item.step ? 'bg-cyan-500' : 'bg-slate-700'}`}></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Location Selection */}
              {buildStep === 1 && (
                <div>
                  <h3 className="text-xl font-bold text-cyan-400 mb-4">Choose Construction Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {availableLocations.map(location => (
                      <div
                        key={location.id}
                        onClick={() => setSelectedLocation(location)}
                        className={`bg-slate-800/50 border-2 rounded-xl p-4 transition-all cursor-pointer ${
                          selectedLocation?.id === location.id
                            ? 'border-cyan-500 bg-cyan-500/10'
                            : 'border-slate-700 hover:border-cyan-500/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-lg font-bold text-white mb-1">{location.name}</h4>
                            <p className="text-sm text-gray-400">{location.sector} • {location.coordinates}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded font-bold capitalize ${getDifficultyColor(location.difficulty)}`}>
                            {location.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mb-3">{location.description}</p>
                        <div className="space-y-1">
                          {location.bonuses.map((bonus, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-emerald-400">
                              <i className="ri-add-circle-fill w-4 h-4 flex items-center justify-center"></i>
                              <span>{bonus}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => selectedLocation && setBuildStep(2)}
                      disabled={!selectedLocation}
                      className={`px-8 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${
                        selectedLocation
                          ? 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer'
                          : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Next: Choose Type
                      <i className="ri-arrow-right-line ml-2 w-5 h-5 inline-flex items-center justify-center"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Type Selection */}
              {buildStep === 2 && (
                <div>
                  <h3 className="text-xl font-bold text-cyan-400 mb-4">Select Starbase Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {starbaseTypes.map(type => (
                      <div
                        key={type.id}
                        onClick={() => setSelectedType(type)}
                        className={`bg-slate-800/50 border-2 rounded-xl p-4 transition-all cursor-pointer ${
                          selectedType?.id === type.id
                            ? 'border-cyan-500 bg-cyan-500/10'
                            : 'border-slate-700 hover:border-cyan-500/50'
                        }`}
                      >
                        <div className="flex items-start gap-4 mb-3">
                          <div className={`w-14 h-14 rounded-lg bg-${type.color}-400/20 flex items-center justify-center flex-shrink-0`}>
                            <i className={`${type.icon} text-3xl text-${type.color}-400 w-8 h-8 flex items-center justify-center`}></i>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-white mb-1">{type.name}</h4>
                            <p className="text-sm text-gray-400">{type.description}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="bg-slate-900/50 rounded p-2 text-center">
                            <div className="text-xs text-gray-400">Docking</div>
                            <div className="text-sm font-bold text-cyan-400">{type.baseStats.dockingBays}</div>
                          </div>
                          <div className="bg-slate-900/50 rounded p-2 text-center">
                            <div className="text-xs text-gray-400">Defense</div>
                            <div className="text-sm font-bold text-red-400">{type.baseStats.defenseRating}%</div>
                          </div>
                          <div className="bg-slate-900/50 rounded p-2 text-center">
                            <div className="text-xs text-gray-400">Pop.</div>
                            <div className="text-sm font-bold text-blue-400">{(type.baseStats.population / 1000).toFixed(0)}K</div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="text-xs text-gray-400 mb-2">Build Cost:</div>
                          <div className="grid grid-cols-3 gap-1 text-xs">
                            <div className="text-yellow-400">⚙️ {(type.buildCost.metal / 1000).toFixed(0)}K</div>
                            <div className="text-blue-400">💎 {(type.buildCost.crystal / 1000).toFixed(0)}K</div>
                            <div className="text-green-400">⚗️ {(type.buildCost.deuterium / 1000).toFixed(0)}K</div>
                            <div className="text-purple-400">✨ {type.buildCost.darkMatter}</div>
                            <div className="text-emerald-400">💰 {(type.buildCost.credits / 1000).toFixed(0)}K</div>
                            <div className="text-cyan-400">⏱️ {type.buildCost.time}</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {type.specialties.slice(0, 2).map((spec, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-slate-900/50 rounded text-gray-300">
                              {spec}
                            </span>
                          ))}
                          {type.specialties.length > 2 && (
                            <span className="text-xs px-2 py-1 bg-slate-900/50 rounded text-cyan-400">
                              +{type.specialties.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => setBuildStep(1)}
                      className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-arrow-left-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>
                      Back
                    </button>
                    <button
                      onClick={() => selectedType && setBuildStep(3)}
                      disabled={!selectedType}
                      className={`px-8 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${
                        selectedType
                          ? 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer'
                          : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Next: Confirm
                      <i className="ri-arrow-right-line ml-2 w-5 h-5 inline-flex items-center justify-center"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {buildStep === 3 && selectedLocation && selectedType && (
                <div>
                  <h3 className="text-xl font-bold text-cyan-400 mb-4">Confirm Construction</h3>
                  
                  {/* Name Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Starbase Name</label>
                    <input
                      type="text"
                      value={starbaseName}
                      onChange={(e) => setStarbaseName(e.target.value)}
                      placeholder="Enter starbase name..."
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all"
                      maxLength={50}
                    />
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Location Summary */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                      <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <i className="ri-map-pin-line text-cyan-400 w-5 h-5 flex items-center justify-center"></i>
                        Location
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Name:</span>
                          <span className="text-white font-medium">{selectedLocation.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Sector:</span>
                          <span className="text-white font-medium">{selectedLocation.sector}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Coordinates:</span>
                          <span className="text-white font-medium">{selectedLocation.coordinates}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Difficulty:</span>
                          <span className={`font-bold capitalize ${getDifficultyColor(selectedLocation.difficulty)}`}>
                            {selectedLocation.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <div className="text-xs text-gray-400 mb-2">Bonuses:</div>
                        {selectedLocation.bonuses.map((bonus, idx) => (
                          <div key={idx} className="text-sm text-emerald-400 mb-1">
                            • {bonus}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Type Summary */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                      <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <i className={`${selectedType.icon} text-${selectedType.color}-400 w-5 h-5 flex items-center justify-center`}></i>
                        Type
                      </h4>
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-white font-medium">{selectedType.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Docking Bays:</span>
                          <span className="text-cyan-400 font-medium">{selectedType.baseStats.dockingBays}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Defense:</span>
                          <span className="text-red-400 font-medium">{selectedType.baseStats.defenseRating}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Population:</span>
                          <span className="text-blue-400 font-medium">{selectedType.baseStats.population.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-700">
                        <div className="text-xs text-gray-400 mb-2">Modules:</div>
                        <div className="flex flex-wrap gap-1">
                          {selectedType.specialties.map((spec, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-slate-900/50 rounded text-gray-300">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Build Cost */}
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
                    <h4 className="text-lg font-bold text-white mb-3">Total Construction Cost</h4>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                      <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-400 mb-1">Metal</div>
                        <div className="text-lg font-bold text-yellow-400">{selectedType.buildCost.metal.toLocaleString()}</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-400 mb-1">Crystal</div>
                        <div className="text-lg font-bold text-blue-400">{selectedType.buildCost.crystal.toLocaleString()}</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-400 mb-1">Deuterium</div>
                        <div className="text-lg font-bold text-green-400">{selectedType.buildCost.deuterium.toLocaleString()}</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-400 mb-1">Dark Matter</div>
                        <div className="text-lg font-bold text-purple-400">{selectedType.buildCost.darkMatter.toLocaleString()}</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-400 mb-1">Credits</div>
                        <div className="text-lg font-bold text-emerald-400">{selectedType.buildCost.credits.toLocaleString()}</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-400 mb-1">Build Time</div>
                        <div className="text-lg font-bold text-cyan-400">{selectedType.buildCost.time}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => setBuildStep(2)}
                      className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-arrow-left-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>
                      Back
                    </button>
                    <button
                      onClick={handleBuildStarbase}
                      disabled={!starbaseName.trim()}
                      className={`px-8 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${
                        starbaseName.trim()
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:scale-105 text-white cursor-pointer shadow-lg shadow-cyan-400/50'
                          : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <i className="ri-rocket-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>
                      Start Construction
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}