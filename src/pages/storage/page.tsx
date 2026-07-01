import { useState } from 'react';

interface StorageModule {
  id: string;
  name: string;
  type: 'metal' | 'crystal' | 'deuterium' | 'universal' | 'special';
  level: number;
  capacity: number;
  maxCapacity: number;
  currentStorage: number;
  upgradeTime: string;
  upgradeCost: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  class: 'basic' | 'advanced' | 'elite' | 'quantum';
  modules: string[];
  efficiency: number;
  protection: number;
  icon: string;
}

export default function StoragePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedStorage, setExpandedStorage] = useState<string | null>(null);

  const storageStructures: StorageModule[] = [
    {
      id: 'metal-silo',
      name: 'Metal Storage Silo',
      type: 'metal',
      level: 18,
      capacity: 450000,
      maxCapacity: 500000,
      currentStorage: 425840,
      upgradeTime: '02:45:30',
      upgradeCost: { metal: 80000, crystal: 40000, deuterium: 0 },
      class: 'advanced',
      modules: ['Compression Module', 'Security System', 'Auto-Sorting'],
      efficiency: 92,
      protection: 75,
      icon: 'ri-database-2-line'
    },
    {
      id: 'crystal-vault',
      name: 'Crystal Vault',
      type: 'crystal',
      level: 16,
      capacity: 320000,
      maxCapacity: 400000,
      currentStorage: 268920,
      upgradeTime: '03:12:45',
      upgradeCost: { metal: 60000, crystal: 90000, deuterium: 0 },
      class: 'advanced',
      modules: ['Stasis Field', 'Temperature Control', 'Radiation Shield'],
      efficiency: 88,
      protection: 80,
      icon: 'ri-vip-diamond-line'
    },
    {
      id: 'deuterium-tank',
      name: 'Deuterium Tank Complex',
      type: 'deuterium',
      level: 14,
      capacity: 280000,
      maxCapacity: 350000,
      currentStorage: 242150,
      upgradeTime: '02:58:20',
      upgradeCost: { metal: 50000, crystal: 50000, deuterium: 25000 },
      class: 'advanced',
      modules: ['Cryogenic System', 'Pressure Regulator', 'Leak Detection'],
      efficiency: 85,
      protection: 70,
      icon: 'ri-drop-line'
    },
    {
      id: 'universal-depot',
      name: 'Universal Depot',
      type: 'universal',
      level: 12,
      capacity: 500000,
      maxCapacity: 600000,
      currentStorage: 380000,
      upgradeTime: '04:30:00',
      upgradeCost: { metal: 120000, crystal: 120000, deuterium: 60000 },
      class: 'elite',
      modules: ['Multi-Resource Storage', 'Smart Allocation', 'Quantum Compression', 'Defense Grid'],
      efficiency: 95,
      protection: 90,
      icon: 'ri-archive-line'
    },
    {
      id: 'quantum-vault',
      name: 'Quantum Storage Vault',
      type: 'special',
      level: 8,
      capacity: 1000000,
      maxCapacity: 1200000,
      currentStorage: 650000,
      upgradeTime: '08:45:30',
      upgradeCost: { metal: 250000, crystal: 250000, deuterium: 150000 },
      class: 'quantum',
      modules: ['Dimensional Pocket', 'Quantum Entanglement', 'Temporal Stasis', 'Void Shield', 'Matter Compression'],
      efficiency: 98,
      protection: 99,
      icon: 'ri-infinity-line'
    },
    {
      id: 'ammunition-depot',
      name: 'Ammunition Depot',
      type: 'special',
      level: 10,
      capacity: 150000,
      maxCapacity: 200000,
      currentStorage: 98500,
      upgradeTime: '03:20:15',
      upgradeCost: { metal: 75000, crystal: 50000, deuterium: 25000 },
      class: 'advanced',
      modules: ['Explosive Containment', 'Automated Loading', 'Security Lockdown'],
      efficiency: 90,
      protection: 85,
      icon: 'ri-rocket-2-line'
    },
    {
      id: 'supply-warehouse',
      name: 'Supply Warehouse',
      type: 'universal',
      level: 15,
      capacity: 400000,
      maxCapacity: 450000,
      currentStorage: 325000,
      upgradeTime: '03:45:00',
      upgradeCost: { metal: 90000, crystal: 70000, deuterium: 30000 },
      class: 'advanced',
      modules: ['Climate Control', 'Inventory System', 'Quick Access'],
      efficiency: 87,
      protection: 72,
      icon: 'ri-building-4-line'
    },
    {
      id: 'dark-matter-container',
      name: 'Dark Matter Container',
      type: 'special',
      level: 5,
      capacity: 50000,
      maxCapacity: 100000,
      currentStorage: 12500,
      upgradeTime: '12:00:00',
      upgradeCost: { metal: 500000, crystal: 500000, deuterium: 300000 },
      class: 'quantum',
      modules: ['Antimatter Containment', 'Singularity Core', 'Reality Anchor'],
      efficiency: 99,
      protection: 100,
      icon: 'ri-contrast-drop-line'
    }
  ];

  const storageClasses = [
    {
      name: 'Basic Class',
      color: 'gray',
      description: 'Standard storage structures with basic capacity and minimal protection.',
      features: ['Standard Capacity', 'Basic Security', 'Manual Management'],
      maxLevel: 20,
      icon: 'ri-box-3-line'
    },
    {
      name: 'Advanced Class',
      color: 'blue',
      description: 'Enhanced storage with improved capacity, automated systems, and better protection.',
      features: ['Enhanced Capacity', 'Automated Systems', 'Advanced Security', 'Module Support'],
      maxLevel: 30,
      icon: 'ri-archive-drawer-line'
    },
    {
      name: 'Elite Class',
      color: 'purple',
      description: 'High-tech storage with massive capacity, smart allocation, and superior defense.',
      features: ['Massive Capacity', 'AI Management', 'Superior Defense', 'Multi-Module Support'],
      maxLevel: 40,
      icon: 'ri-safe-2-line'
    },
    {
      name: 'Quantum Class',
      color: 'cyan',
      description: 'Cutting-edge dimensional storage with near-infinite capacity and impenetrable security.',
      features: ['Dimensional Storage', 'Quantum Security', 'Reality Manipulation', 'Unlimited Modules'],
      maxLevel: 50,
      icon: 'ri-infinity-line'
    }
  ];

  const moduleTypes = [
    {
      category: 'Capacity Enhancement',
      modules: [
        { name: 'Compression Module', effect: '+15% Capacity', cost: 'Metal: 25k, Crystal: 15k' },
        { name: 'Dimensional Pocket', effect: '+50% Capacity', cost: 'Metal: 150k, Crystal: 150k, Deuterium: 75k' },
        { name: 'Matter Compression', effect: '+25% Capacity', cost: 'Metal: 50k, Crystal: 40k' },
        { name: 'Quantum Entanglement', effect: '+100% Capacity', cost: 'Metal: 300k, Crystal: 300k, Deuterium: 200k' }
      ]
    },
    {
      category: 'Security Systems',
      modules: [
        { name: 'Security System', effect: '+20% Protection', cost: 'Metal: 30k, Crystal: 20k' },
        { name: 'Defense Grid', effect: '+40% Protection', cost: 'Metal: 80k, Crystal: 60k, Deuterium: 30k' },
        { name: 'Void Shield', effect: '+60% Protection', cost: 'Metal: 200k, Crystal: 150k, Deuterium: 100k' },
        { name: 'Reality Anchor', effect: '+80% Protection', cost: 'Metal: 400k, Crystal: 400k, Deuterium: 250k' }
      ]
    },
    {
      category: 'Efficiency Modules',
      modules: [
        { name: 'Auto-Sorting', effect: '+10% Efficiency', cost: 'Metal: 20k, Crystal: 25k' },
        { name: 'Smart Allocation', effect: '+20% Efficiency', cost: 'Metal: 60k, Crystal: 70k, Deuterium: 20k' },
        { name: 'AI Management', effect: '+30% Efficiency', cost: 'Metal: 120k, Crystal: 140k, Deuterium: 50k' },
        { name: 'Quantum Processing', effect: '+50% Efficiency', cost: 'Metal: 250k, Crystal: 300k, Deuterium: 150k' }
      ]
    },
    {
      category: 'Specialized Systems',
      modules: [
        { name: 'Temperature Control', effect: 'Crystal Preservation', cost: 'Metal: 35k, Crystal: 45k' },
        { name: 'Cryogenic System', effect: 'Deuterium Stability', cost: 'Metal: 40k, Crystal: 30k, Deuterium: 20k' },
        { name: 'Stasis Field', effect: 'Resource Preservation', cost: 'Metal: 100k, Crystal: 120k, Deuterium: 60k' },
        { name: 'Temporal Stasis', effect: 'Time-Lock Storage', cost: 'Metal: 300k, Crystal: 350k, Deuterium: 200k' }
      ]
    }
  ];

  const filteredStorage = activeCategory === 'all' 
    ? storageStructures 
    : storageStructures.filter(s => s.type === activeCategory);

  const totalCapacity = storageStructures.reduce((sum, s) => sum + s.maxCapacity, 0);
  const totalUsed = storageStructures.reduce((sum, s) => sum + s.currentStorage, 0);
  const averageEfficiency = Math.round(storageStructures.reduce((sum, s) => sum + s.efficiency, 0) / storageStructures.length);

  return (
    <div className="text-white">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://readdy.ai/api/search-image?query=massive%20futuristic%20storage%20facility%20warehouse%20complex%20with%20glowing%20containers%20metal%20silos%20crystal%20vaults%20deuterium%20tanks%20industrial%20sci-fi%20architecture%20neon%20lights%20cyan%20purple%20glow%20space%20station%20interior%20high%20tech&width=1920&height=600&seq=storage-hero&orientation=landscape" alt="Storage Facility" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <h1 className="text-6xl font-black uppercase text-white mb-4">Storage Management</h1>
          <p className="text-xl text-gray-300">Manage your empire's resource storage infrastructure</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* ALC Power Systems Context Bar */}
        <div className="mb-6 p-3 rounded-xl flex items-center gap-3" style={{ background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.15)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(6,182,212,0.12)' }}>
            <i className="ri-flashlight-fill text-sm" style={{ color: '#06b6d4' }}></i>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider" style={{ color: '#06b6d4' }}>ALC POWER SYSTEMS</span>
              <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(6,182,212,0.12)', color: '#06b6d4', fontSize: 9 }}>ENDFIELD</span>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs" style={{ color: '#5a6577' }}>
                Total Capacity: <span className="font-semibold" style={{ color: '#22d3ee' }}>{(totalCapacity / 1000000).toFixed(1)}M</span>
              </span>
              <span className="text-xs" style={{ color: '#5a6577' }}>
                Avg Efficiency: <span className="font-semibold" style={{ color: '#22d3ee' }}>{averageEfficiency}%</span>
              </span>
            </div>
          </div>
          <Link
            to="/power-grid"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all hover:brightness-110"
            style={{ background: 'rgba(6,182,212,0.1)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.25)' }}
          >
            <i className="ri-flashlight-line"></i>
            Power Grid
          </Link>
          <Link
            to="/reactor-research"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all hover:brightness-110"
            style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.25)' }}
          >
            <i className="ri-file-code-line"></i>
            Reactors
          </Link>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-400/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <i className="ri-database-2-line text-4xl text-cyan-400"></i>
              <span className="text-sm text-gray-400">Total</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{(totalCapacity / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-gray-400">Total Capacity</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-400/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <i className="ri-archive-line text-4xl text-green-400"></i>
              <span className="text-sm text-gray-400">Used</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{(totalUsed / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-gray-400">{Math.round((totalUsed / totalCapacity) * 100)}% Utilized</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <i className="ri-speed-line text-4xl text-purple-400"></i>
              <span className="text-sm text-gray-400">Avg</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{averageEfficiency}%</p>
            <p className="text-sm text-gray-400">Efficiency</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <i className="ri-building-line text-4xl text-yellow-400"></i>
              <span className="text-sm text-gray-400">Active</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{storageStructures.length}</p>
            <p className="text-sm text-gray-400">Structures</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-[#0F1F3A] border border-cyan-400/30 rounded-2xl p-6 mb-8">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setActiveCategory('all')} className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${activeCategory === 'all' ? 'bg-cyan-400 text-black' : 'bg-[#0A1628] text-gray-400 hover:text-white'}`}>
              <i className="ri-apps-line mr-2"></i>All Storage
            </button>
            <button onClick={() => setActiveCategory('metal')} className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${activeCategory === 'metal' ? 'bg-yellow-400 text-black' : 'bg-[#0A1628] text-gray-400 hover:text-white'}`}>
              <i className="ri-copper-coin-line mr-2"></i>Metal
            </button>
            <button onClick={() => setActiveCategory('crystal')} className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${activeCategory === 'crystal' ? 'bg-blue-400 text-black' : 'bg-[#0A1628] text-gray-400 hover:text-white'}`}>
              <i className="ri-vip-diamond-line mr-2"></i>Crystal
            </button>
            <button onClick={() => setActiveCategory('deuterium')} className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${activeCategory === 'deuterium' ? 'bg-green-400 text-black' : 'bg-[#0A1628] text-gray-400 hover:text-white'}`}>
              <i className="ri-drop-line mr-2"></i>Deuterium
            </button>
            <button onClick={() => setActiveCategory('universal')} className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${activeCategory === 'universal' ? 'bg-purple-400 text-black' : 'bg-[#0A1628] text-gray-400 hover:text-white'}`}>
              <i className="ri-archive-line mr-2"></i>Universal
            </button>
            <button onClick={() => setActiveCategory('special')} className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${activeCategory === 'special' ? 'bg-cyan-400 text-black' : 'bg-[#0A1628] text-gray-400 hover:text-white'}`}>
              <i className="ri-infinity-line mr-2"></i>Special
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Storage Structures */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0F1F3A] border border-cyan-400/30 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <i className="ri-building-4-line text-cyan-400 mr-3"></i>
                Storage Structures
              </h2>
              <div className="space-y-4">
                {filteredStorage.map((storage) => (
                  <div key={storage.id} className="bg-[#0A1628] border border-cyan-400/20 rounded-xl overflow-hidden hover:border-cyan-400 transition-all">
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-16 h-16 bg-${storage.class === 'quantum' ? 'cyan' : storage.class === 'elite' ? 'purple' : storage.class === 'advanced' ? 'blue' : 'gray'}-400/20 rounded-lg flex items-center justify-center`}>
                            <i className={`${storage.icon} text-3xl text-${storage.class === 'quantum' ? 'cyan' : storage.class === 'elite' ? 'purple' : storage.class === 'advanced' ? 'blue' : 'gray'}-400`}></i>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{storage.name}</h3>
                            <div className="flex items-center space-x-3 mt-1">
                              <span className={`px-3 py-1 bg-${storage.class === 'quantum' ? 'cyan' : storage.class === 'elite' ? 'purple' : storage.class === 'advanced' ? 'blue' : 'gray'}-400/20 text-${storage.class === 'quantum' ? 'cyan' : storage.class === 'elite' ? 'purple' : storage.class === 'advanced' ? 'blue' : 'gray'}-400 text-xs rounded-full uppercase font-semibold`}>
                                {storage.class}
                              </span>
                              <span className="text-sm text-gray-400">Level {storage.level}</span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => setExpandedStorage(expandedStorage === storage.id ? null : storage.id)} className="w-10 h-10 bg-cyan-400/20 rounded-lg flex items-center justify-center hover:bg-cyan-400 hover:text-black transition-all cursor-pointer">
                          <i className={`text-xl ${expandedStorage === storage.id ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`}></i>
                        </button>
                      </div>

                      {/* Capacity Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Capacity</span>
                          <span className="text-white font-semibold">{storage.currentStorage.toLocaleString()} / {storage.maxCapacity.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-3 bg-[#0F1F3A] rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all`} style={{width: `${(storage.currentStorage / storage.maxCapacity) * 100}%`}}></div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-xs text-gray-400 mb-1">Efficiency</p>
                          <p className="text-lg font-bold text-green-400">{storage.efficiency}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400 mb-1">Protection</p>
                          <p className="text-lg font-bold text-blue-400">{storage.protection}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400 mb-1">Modules</p>
                          <p className="text-lg font-bold text-purple-400">{storage.modules.length}</p>
                        </div>
                      </div>

                      {/* Upgrade Button */}
                      <button className="w-full px-4 py-3 bg-cyan-400/20 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-all whitespace-nowrap cursor-pointer font-semibold flex items-center justify-center space-x-2">
                        <i className="ri-arrow-up-line"></i>
                        <span>Upgrade to Level {storage.level + 1}</span>
                        <span className="text-xs">({storage.upgradeTime})</span>
                      </button>
                    </div>

                    {/* Expanded Details */}
                    {expandedStorage === storage.id && (
                      <div className="border-t border-cyan-400/20 p-5 bg-[#050A14]">
                        <h4 className="text-sm font-semibold text-white mb-3">Installed Modules:</h4>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {storage.modules.map((module, idx) => (
                            <div key={idx} className="px-3 py-2 bg-[#0A1628] border border-cyan-400/20 rounded-lg text-sm text-gray-300 flex items-center">
                              <i className="ri-checkbox-circle-fill text-cyan-400 mr-2"></i>
                              {module}
                            </div>
                          ))}
                        </div>
                        <h4 className="text-sm font-semibold text-white mb-3">Upgrade Cost:</h4>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <i className="ri-copper-coin-line text-yellow-400"></i>
                            <span className="text-white">{storage.upgradeCost.metal.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <i className="ri-vip-diamond-line text-blue-400"></i>
                            <span className="text-white">{storage.upgradeCost.crystal.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <i className="ri-drop-line text-green-400"></i>
                            <span className="text-white">{storage.upgradeCost.deuterium.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Storage Classes */}
            <div className="bg-[#0F1F3A] border border-cyan-400/30 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <i className="ri-medal-line text-cyan-400 mr-3"></i>
                Storage Classes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {storageClasses.map((sClass, index) => (
                  <div key={index} className={`bg-[#0A1628] border border-${sClass.color}-400/30 rounded-xl p-5 hover:border-${sClass.color}-400 transition-all cursor-pointer`}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-12 h-12 bg-${sClass.color}-400/20 rounded-lg flex items-center justify-center`}>
                        <i className={`${sClass.icon} text-2xl text-${sClass.color}-400`}></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{sClass.name}</h3>
                        <p className="text-xs text-gray-400">Max Level: {sClass.maxLevel}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">{sClass.description}</p>
                    <div className="space-y-2">
                      {sClass.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <i className={`ri-checkbox-circle-fill text-${sClass.color}-400 mr-2`}></i>
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modules Panel */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-400/30 rounded-2xl p-6 sticky top-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <i className="ri-puzzle-line text-cyan-400 mr-3"></i>
                Available Modules
              </h2>
              <div className="space-y-6">
                {moduleTypes.map((category, index) => (
                  <div key={index}>
                    <h3 className="text-sm font-semibold text-cyan-400 mb-3 uppercase tracking-wider">{category.category}</h3>
                    <div className="space-y-3">
                      {category.modules.map((module, idx) => (
                        <div key={idx} className="bg-[#0A1628] border border-cyan-400/20 rounded-lg p-4 hover:border-cyan-400 transition-all cursor-pointer">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-sm font-semibold text-white">{module.name}</h4>
                            <i className="ri-add-circle-line text-cyan-400 cursor-pointer hover:text-cyan-300"></i>
                          </div>
                          <p className="text-xs text-green-400 mb-2">{module.effect}</p>
                          <p className="text-xs text-gray-400">{module.cost}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
