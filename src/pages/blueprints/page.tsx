import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { allBlueprints, shipBlueprints, weaponBlueprints } from '../../data/blueprints';
import type { Blueprint } from '../../data/blueprints/types';

export default function BlueprintsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'inventory' | 'manufacturing' | 'research' | 'copying' | 'invention' | 'market'>('inventory');
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [filterType, setFilterType] = useState<'All' | 'BPO' | 'BPC'>('All');
  const [filterCategory, setFilterCategory] = useState<'All' | 'Ships' | 'Energy Weapons'>('All');
  const [filterRank, setFilterRank] = useState<'All' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS'>('All');
  const [manufacturingQuantity, setManufacturingQuantity] = useState(1);
  const [researchType, setResearchType] = useState<'ME' | 'TE'>('ME');
  const [copyRuns, setCopyRuns] = useState(10);

  const filteredBlueprints = allBlueprints.filter(bp => {
    if (filterType !== 'All' && bp.type !== filterType) return false;
    if (filterCategory !== 'All' && bp.category !== filterCategory) return false;
    if (filterRank !== 'All' && bp.rank !== filterRank) return false;
    return true;
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const calculateMaterialCost = (materials: { name: string; quantity: number; tier: number }[], quantity: number) => {
    return materials.reduce((total, mat) => total + (mat.quantity * quantity * mat.tier * 1000), 0);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400';
      case 'Uncommon': return 'text-green-400';
      case 'Rare': return 'text-cyan-400';
      case 'Epic': return 'text-purple-400';
      case 'Legendary': return 'text-amber-400';
      case 'Mythic': return 'text-rose-400';
      case 'Cosmic': return 'text-indigo-400';
      case 'Universal': return 'text-fuchsia-400';
      default: return 'text-gray-400';
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'E': return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
      case 'D': return 'bg-green-600/20 text-green-400 border-green-500/30';
      case 'C': return 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30';
      case 'B': return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      case 'A': return 'bg-purple-600/20 text-purple-400 border-purple-500/30';
      case 'S': return 'bg-amber-600/20 text-amber-400 border-amber-500/30';
      case 'SS': return 'bg-rose-600/20 text-rose-400 border-rose-500/30';
      case 'SSS': return 'bg-fuchsia-600/20 text-fuchsia-400 border-fuchsia-500/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mb-2">
              Blueprint Laboratory
            </h1>
            <p className="text-gray-400">Research, manufacture, and invent advanced technology</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg hover:from-slate-600 hover:to-slate-500 transition-all whitespace-nowrap cursor-pointer"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Dashboard
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 border border-cyan-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-400 text-sm mb-1">Total Blueprints</p>
                <p className="text-2xl font-bold">{allBlueprints.length}</p>
              </div>
              <i className="ri-file-list-3-line text-4xl text-cyan-400/50"></i>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border border-emerald-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-400 text-sm mb-1">Ship Blueprints</p>
                <p className="text-2xl font-bold">{shipBlueprints.length}</p>
              </div>
              <i className="ri-rocket-line text-4xl text-emerald-400/50"></i>
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 border border-amber-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-400 text-sm mb-1">Weapon Blueprints</p>
                <p className="text-2xl font-bold">{weaponBlueprints.length}</p>
              </div>
              <i className="ri-sword-line text-4xl text-amber-400/50"></i>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm mb-1">Active Jobs</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <i className="ri-settings-3-line text-4xl text-purple-400/50 animate-spin" style={{ animationDuration: '3s' }}></i>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['inventory', 'manufacturing', 'research', 'copying', 'invention', 'market'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
              }`}
            >
              {tab === 'inventory' && <i className="ri-archive-line mr-2"></i>}
              {tab === 'manufacturing' && <i className="ri-hammer-line mr-2"></i>}
              {tab === 'research' && <i className="ri-flask-line mr-2"></i>}
              {tab === 'copying' && <i className="ri-file-copy-line mr-2"></i>}
              {tab === 'invention' && <i className="ri-lightbulb-line mr-2"></i>}
              {tab === 'market' && <i className="ri-store-line mr-2"></i>}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div>
            {/* Filters */}
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white cursor-pointer"
                  >
                    <option value="All">All Types</option>
                    <option value="BPO">BPO (Original)</option>
                    <option value="BPC">BPC (Copy)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as any)}
                    className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Ships">Ships</option>
                    <option value="Energy Weapons">Energy Weapons</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Rank</label>
                  <select
                    value={filterRank}
                    onChange={(e) => setFilterRank(e.target.value as any)}
                    className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white cursor-pointer"
                  >
                    <option value="All">All Ranks</option>
                    <option value="E">E-Rank</option>
                    <option value="D">D-Rank</option>
                    <option value="C">C-Rank</option>
                    <option value="B">B-Rank</option>
                    <option value="A">A-Rank</option>
                    <option value="S">S-Rank</option>
                    <option value="SS">SS-Rank</option>
                    <option value="SSS">SSS-Rank</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Blueprint Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlueprints.map((bp) => (
                <div
                  key={bp.id}
                  className="bg-gradient-to-br from-slate-800/80 to-slate-700/50 border border-slate-600/50 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-all cursor-pointer"
                  onClick={() => setSelectedBlueprint(bp)}
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={bp.image}
                      alt={bp.name}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-2 left-2 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        bp.type === 'BPO' 
                          ? 'bg-emerald-500/90 text-white' 
                          : 'bg-amber-500/90 text-white'
                      }`}>
                        {bp.type}
                      </span>
                      <span className="px-3 py-1 bg-slate-900/90 rounded-full text-xs font-bold text-white">
                        Tier {bp.tier}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRankColor(bp.rank)}`}>
                        {bp.rank}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRarityColor(bp.rarity)} bg-slate-900/90`}>
                        {bp.rarity}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-1">{bp.name}</h3>
                    <p className="text-xs text-gray-400 mb-3">{bp.class}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400">{bp.category}</span>
                      <span className="text-sm text-cyan-400">
                        {bp.runs === 'Unlimited' ? '∞ Runs' : `${bp.runs} Runs`}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-slate-900/50 rounded p-2">
                        <p className="text-xs text-gray-400">ME Level</p>
                        <p className="text-sm font-bold text-emerald-400">{bp.materialEfficiency}%</p>
                      </div>
                      <div className="bg-slate-900/50 rounded p-2">
                        <p className="text-xs text-gray-400">TE Level</p>
                        <p className="text-sm font-bold text-cyan-400">{bp.timeEfficiency}%</p>
                      </div>
                    </div>
                    
                    {/* Key Stats */}
                    <div className="bg-slate-900/50 rounded p-2 mb-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {bp.baseStats.attack && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Attack:</span>
                            <span className="text-red-400 font-bold">{bp.baseStats.attack}</span>
                          </div>
                        )}
                        {bp.baseStats.defense && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Defense:</span>
                            <span className="text-blue-400 font-bold">{bp.baseStats.defense}</span>
                          </div>
                        )}
                        {bp.baseStats.speed && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Speed:</span>
                            <span className="text-green-400 font-bold">{bp.baseStats.speed}</span>
                          </div>
                        )}
                        {bp.baseStats.accuracy && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Accuracy:</span>
                            <span className="text-cyan-400 font-bold">{bp.baseStats.accuracy}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">Production:</span>
                      <span className="text-white font-medium">{formatTime(bp.productionTime)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Value:</span>
                      <span className="text-amber-400 font-bold">{formatNumber(bp.baseValue)} IGC</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manufacturing Tab */}
        {activeTab === 'manufacturing' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Blueprint Selection */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-cyan-400 mb-4">
                  <i className="ri-file-list-3-line mr-2"></i>
                  Select Blueprint
                </h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {allBlueprints.map((bp) => (
                    <div
                      key={bp.id}
                      onClick={() => setSelectedBlueprint(bp)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedBlueprint?.id === bp.id
                          ? 'bg-cyan-600/30 border border-cyan-500/50'
                          : 'bg-slate-700/30 border border-slate-600/30 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{bp.name}</span>
                        <span className={`text-xs px-2 py-1 rounded border ${getRankColor(bp.rank)}`}>
                          {bp.rank}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{bp.category}</span>
                        <span>{formatTime(bp.productionTime)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Manufacturing Details */}
            <div className="lg:col-span-2">
              {selectedBlueprint ? (
                <div className="space-y-6">
                  {/* Blueprint Info */}
                  <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/50 border border-slate-600/50 rounded-lg p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <img
                        src={selectedBlueprint.image}
                        alt={selectedBlueprint.name}
                        className="w-32 h-24 object-cover object-top rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">{selectedBlueprint.name}</h3>
                        <p className="text-sm text-gray-400 mb-3">{selectedBlueprint.description}</p>
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            selectedBlueprint.type === 'BPO' 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {selectedBlueprint.type}
                          </span>
                          <span className="px-3 py-1 bg-slate-700/50 rounded-full text-xs font-bold text-white">
                            Tier {selectedBlueprint.tier}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRankColor(selectedBlueprint.rank)}`}>
                            {selectedBlueprint.rank}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRarityColor(selectedBlueprint.rarity)} bg-slate-900/50`}>
                            {selectedBlueprint.rarity}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <p className="text-xs text-gray-400">ME Level</p>
                            <p className="text-lg font-bold text-emerald-400">{selectedBlueprint.materialEfficiency}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">TE Level</p>
                            <p className="text-lg font-bold text-cyan-400">{selectedBlueprint.timeEfficiency}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Runs Left</p>
                            <p className="text-lg font-bold text-white">
                              {selectedBlueprint.runs === 'Unlimited' ? '∞' : selectedBlueprint.runs}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Display */}
                    <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
                      <h4 className="text-lg font-bold text-cyan-400 mb-3">
                        <i className="ri-bar-chart-box-line mr-2"></i>
                        Blueprint Stats
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(selectedBlueprint.baseStats).map(([key, value]) => {
                          if (!value) return null;
                          return (
                            <div key={key} className="bg-slate-800/50 rounded p-2">
                              <p className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                              <p className="text-sm font-bold text-cyan-400">{value}{key.includes('Chance') || key.includes('Efficiency') ? '%' : ''}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="mb-6">
                      <label className="block text-sm text-gray-400 mb-2">Production Quantity</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="1"
                          max="100"
                          value={manufacturingQuantity}
                          onChange={(e) => setManufacturingQuantity(parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={manufacturingQuantity}
                          onChange={(e) => setManufacturingQuantity(parseInt(e.target.value))}
                          className="w-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-center"
                        />
                      </div>
                    </div>

                    {/* Materials Required */}
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-cyan-400 mb-3">
                        <i className="ri-box-3-line mr-2"></i>
                        Materials Required
                      </h4>
                      <div className="space-y-2">
                        {selectedBlueprint.materials.map((mat, idx) => {
                          const required = mat.quantity * manufacturingQuantity;
                          const available = Math.floor(Math.random() * required * 2);
                          const hasEnough = available >= required;
                          return (
                            <div key={idx} className="bg-slate-900/50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{mat.name}</span>
                                  <span className="text-xs px-2 py-1 bg-slate-700 rounded text-gray-400">
                                    Tier {mat.tier}
                                  </span>
                                </div>
                                <span className={hasEnough ? 'text-emerald-400' : 'text-red-400'}>
                                  {formatNumber(required)} / {formatNumber(available)}
                                </span>
                              </div>
                              <div className="w-full bg-slate-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${
                                    hasEnough ? 'bg-emerald-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min((available / required) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Production Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Total Time</p>
                        <p className="text-lg font-bold text-cyan-400">
                          {formatTime(selectedBlueprint.productionTime * manufacturingQuantity)}
                        </p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Output</p>
                        <p className="text-lg font-bold text-emerald-400">
                          {selectedBlueprint.outputQuantity * manufacturingQuantity}
                        </p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Est. Cost</p>
                        <p className="text-lg font-bold text-amber-400">
                          {formatNumber(calculateMaterialCost(selectedBlueprint.materials, manufacturingQuantity))} IGC
                        </p>
                      </div>
                    </div>

                    {/* Start Manufacturing Button */}
                    <button
                      className="w-full py-4 rounded-lg font-bold text-lg transition-all whitespace-nowrap bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white cursor-pointer"
                    >
                      <i className="ri-hammer-line mr-2"></i>
                      Start Manufacturing
                    </button>
                  </div>

                  {/* Active Manufacturing Jobs */}
                  <div className="bg-slate-800/50 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-cyan-400 mb-4">
                      <i className="ri-settings-3-line mr-2"></i>
                      Active Manufacturing Jobs
                    </h4>
                    <div className="space-y-3">
                      {[
                        { name: 'Sparrow Light Fighter', quantity: 5, progress: 75, timeLeft: '1h 15m' },
                        { name: 'Basic Laser Cannon', quantity: 10, progress: 45, timeLeft: '2h 30m' },
                        { name: 'Pulse Laser Array', quantity: 8, progress: 90, timeLeft: '25m' }
                      ].map((job, idx) => (
                        <div key={idx} className="bg-slate-900/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{job.name} x{job.quantity}</span>
                            <span className="text-cyan-400">{job.timeLeft}</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
                            <div
                              className="h-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all"
                              style={{ width: `${job.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Progress: {job.progress}%</span>
                            <button className="text-red-400 hover:text-red-300 cursor-pointer">
                              <i className="ri-close-circle-line mr-1"></i>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/50 rounded-lg p-12 text-center">
                  <i className="ri-file-list-3-line text-6xl text-gray-600 mb-4"></i>
                  <p className="text-gray-400 text-lg">Select a blueprint to start manufacturing</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Research Tab */}
        {activeTab === 'research' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Research Setup */}
            <div className="bg-slate-800/50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-cyan-400 mb-4">
                <i className="ri-flask-line mr-2"></i>
                Blueprint Research
              </h3>
              
              {selectedBlueprint && selectedBlueprint.type === 'BPO' ? (
                <div className="space-y-6">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-3">{selectedBlueprint.name}</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Material Efficiency</p>
                        <p className="text-2xl font-bold text-emerald-400">{selectedBlueprint.meLevel}%</p>
                        <p className="text-xs text-gray-400">Max: {selectedBlueprint.maxMELevel}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Time Efficiency</p>
                        <p className="text-2xl font-bold text-cyan-400">{selectedBlueprint.teLevel}%</p>
                        <p className="text-xs text-gray-400">Max: {selectedBlueprint.maxTELevel}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Research Type Selection */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Research Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setResearchType('ME')}
                        className={`py-3 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                          researchType === 'ME'
                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white'
                            : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700'
                        }`}
                      >
                        <i className="ri-box-3-line mr-2"></i>
                        Material Efficiency
                      </button>
                      <button
                        onClick={() => setResearchType('TE')}
                        className={`py-3 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                          researchType === 'TE'
                            ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white'
                            : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700'
                        }`}
                      >
                        <i className="ri-time-line mr-2"></i>
                        Time Efficiency
                      </button>
                    </div>
                  </div>

                  {/* Research Info */}
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h5 className="font-bold text-white mb-3">
                      {researchType === 'ME' ? 'Material Efficiency Research' : 'Time Efficiency Research'}
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Current Level:</span>
                        <span className="text-white font-medium">
                          {researchType === 'ME' ? selectedBlueprint.meLevel : selectedBlueprint.teLevel}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Next Level:</span>
                        <span className="text-cyan-400 font-medium">
                          {researchType === 'ME' 
                            ? Math.min(selectedBlueprint.meLevel + 1, selectedBlueprint.maxMELevel)
                            : Math.min(selectedBlueprint.teLevel + 2, selectedBlueprint.maxTELevel)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Research Time:</span>
                        <span className="text-white font-medium">
                          {formatTime(7200 * (researchType === 'ME' ? selectedBlueprint.meLevel + 1 : selectedBlueprint.teLevel + 1))}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Cost:</span>
                        <span className="text-amber-400 font-medium">
                          {formatNumber(500000 * (researchType === 'ME' ? selectedBlueprint.meLevel + 1 : selectedBlueprint.teLevel + 1))} ISK
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Start Research Button */}
                  <button
                    disabled={
                      (researchType === 'ME' && selectedBlueprint.meLevel >= selectedBlueprint.maxMELevel) ||
                      (researchType === 'TE' && selectedBlueprint.teLevel >= selectedBlueprint.maxTELevel)
                    }
                    className={`w-full py-4 rounded-lg font-bold transition-all whitespace-nowrap ${
                      (researchType === 'ME' && selectedBlueprint.meLevel >= selectedBlueprint.maxMELevel) ||
                      (researchType === 'TE' && selectedBlueprint.teLevel >= selectedBlueprint.maxTELevel)
                        ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white cursor-pointer'
                    }`}
                  >
                    <i className="ri-flask-line mr-2"></i>
                    {(researchType === 'ME' && selectedBlueprint.meLevel >= selectedBlueprint.maxMELevel) ||
                     (researchType === 'TE' && selectedBlueprint.teLevel >= selectedBlueprint.maxTELevel)
                      ? 'Max Level Reached'
                      : 'Start Research'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <i className="ri-file-list-3-line text-6xl text-gray-600 mb-4"></i>
                  <p className="text-gray-400">Select a BPO to research</p>
                  <p className="text-sm text-gray-500 mt-2">Only Blueprint Originals can be researched</p>
                </div>
              )}
            </div>

            {/* Active Research Jobs */}
            <div className="bg-slate-800/50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-cyan-400 mb-4">
                <i className="ri-settings-3-line mr-2"></i>
                Active Research Jobs
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Viper Strike Fighter Blueprint', type: 'ME', level: 8, progress: 65, timeLeft: '4h 20m' },
                  { name: 'Guardian Frigate Blueprint', type: 'TE', level: 12, progress: 30, timeLeft: '8h 45m' },
                  { name: 'Plasma Cannon II Blueprint', type: 'ME', level: 8, progress: 85, timeLeft: '1h 10m' }
                ].map((job, idx) => (
                  <div key={idx} className="bg-slate-900/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-white">{job.name}</p>
                        <p className="text-sm text-gray-400">
                          {job.type === 'ME' ? 'Material Efficiency' : 'Time Efficiency'} → Level {job.level + 1}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        job.type === 'ME' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        {job.type}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          job.type === 'ME' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-cyan-500 to-cyan-400'
                        }`}
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{job.progress}% - {job.timeLeft}</span>
                      <button className="text-red-400 hover:text-red-300 cursor-pointer">
                        <i className="ri-close-circle-line mr-1"></i>
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Copying Tab */}
        {activeTab === 'copying' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Copy Setup */}
            <div className="bg-slate-800/50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-cyan-400 mb-4">
                <i className="ri-file-copy-line mr-2"></i>
                Blueprint Copying
              </h3>
              
              {selectedBlueprint && selectedBlueprint.type === 'BPO' && selectedBlueprint.canCopy ? (
                <div className="space-y-6">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">{selectedBlueprint.name}</h4>
                    <p className="text-sm text-gray-400">Create Blueprint Copies (BPC) from this Original</p>
                  </div>

                  {/* Runs Selection */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Runs per Copy</label>
                    <div className="flex items-center gap-4 mb-2">
                      <input
                        type="range"
                        min="1"
                        max={selectedBlueprint.maxCopyRuns || 100}
                        value={copyRuns}
                        onChange={(e) => setCopyRuns(parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <input
                        type="number"
                        min="1"
                        max={selectedBlueprint.maxCopyRuns || 100}
                        value={copyRuns}
                        onChange={(e) => setCopyRuns(parseInt(e.target.value))}
                        className="w-24 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-center"
                      />
                    </div>
                    <p className="text-xs text-gray-400">Max runs per copy: {selectedBlueprint.maxCopyRuns}</p>
                  </div>

                  {/* Copy Stats */}
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h5 className="font-bold text-white mb-3">Copy Details</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Runs per Copy:</span>
                        <span className="text-white font-medium">{copyRuns}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Copy Time:</span>
                        <span className="text-white font-medium">
                          {formatTime((selectedBlueprint.copyTime || 1800) * (copyRuns / 10))}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">ME/TE Inherited:</span>
                        <span className="text-emerald-400 font-medium">
                          {selectedBlueprint.meLevel}% / {selectedBlueprint.teLevel}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Cost:</span>
                        <span className="text-amber-400 font-medium">
                          {formatNumber(100000 * (copyRuns / 10))} ISK
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Start Copy Button */}
                  <button className="w-full py-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 rounded-lg font-bold text-white transition-all whitespace-nowrap cursor-pointer">
                    <i className="ri-file-copy-line mr-2"></i>
                    Start Copying
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <i className="ri-file-list-3-line text-6xl text-gray-600 mb-4"></i>
                  <p className="text-gray-400">Select a BPO to copy</p>
                  <p className="text-sm text-gray-500 mt-2">Only Blueprint Originals can be copied</p>
                </div>
              )}
            </div>

            {/* Active Copy Jobs */}
            <div className="bg-slate-800/50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-cyan-400 mb-4">
                <i className="ri-settings-3-line mr-2"></i>
                Active Copy Jobs
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Sparrow Interceptor Blueprint', runs: 300, progress: 55, timeLeft: '2h 30m' },
                  { name: 'Shield Booster I Blueprint', runs: 1000, progress: 20, timeLeft: '6h 15m' }
                ].map((job, idx) => (
                  <div key={idx} className="bg-slate-900/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-white">{job.name}</p>
                        <p className="text-sm text-gray-400">Creating BPC with {job.runs} runs</p>
                      </div>
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold">
                        COPYING
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
                      <div
                        className="h-3 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all"
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{job.progress}% - {job.timeLeft}</span>
                      <button className="text-red-400 hover:text-red-300 cursor-pointer">
                        <i className="ri-close-circle-line mr-1"></i>
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Invention Tab */}
        {activeTab === 'invention' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Invention Setup */}
            <div className="bg-slate-800/50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-cyan-400 mb-4">
                <i className="ri-lightbulb-line mr-2"></i>
                Tech II Invention
              </h3>
              
              {selectedBlueprint && selectedBlueprint.type === 'BPC' && selectedBlueprint.canInvent ? (
                <div className="space-y-6">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">{selectedBlueprint.name}</h4>
                    <p className="text-sm text-gray-400">Invent Tech II version from this blueprint copy</p>
                  </div>

                  {/* Invention Chance */}
                  <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-400 font-medium">Success Chance</span>
                      <span className="text-2xl font-bold text-purple-400">{selectedBlueprint.inventionChance}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className="h-3 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                        style={{ width: `${selectedBlueprint.inventionChance}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Required Materials */}
                  {selectedBlueprint.inventionMaterials && (
                    <div>
                      <h5 className="font-bold text-white mb-3">Required Materials</h5>
                      <div className="space-y-2">
                        {selectedBlueprint.inventionMaterials.map((mat, idx) => (
                          <div key={idx} className="bg-slate-900/50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{mat.name}</span>
                              <span className="text-cyan-400 font-medium">{mat.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Invention Info */}
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h5 className="font-bold text-white mb-3">Invention Details</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Invention Time:</span>
                        <span className="text-white font-medium">2h 30m</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Output Runs:</span>
                        <span className="text-white font-medium">10</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Cost:</span>
                        <span className="text-amber-400 font-medium">5,000,000 ISK</span>
                      </div>
                    </div>
                  </div>

                  {/* Start Invention Button */}
                  <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 rounded-lg font-bold text-white transition-all whitespace-nowrap cursor-pointer">
                    <i className="ri-lightbulb-line mr-2"></i>
                    Start Invention
                  </button>

                  {/* Warning */}
                  <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <i className="ri-alert-line text-amber-400 mt-1"></i>
                      <div className="text-sm text-amber-400">
                        <p className="font-bold mb-1">Invention Risk</p>
                        <p className="text-amber-400/80">
                          Invention can fail. Materials will be consumed regardless of success.
                          Use decryptors to improve chances.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <i className="ri-file-list-3-line text-6xl text-gray-600 mb-4"></i>
                  <p className="text-gray-400">Select a Tech I BPC to invent</p>
                  <p className="text-sm text-gray-500 mt-2">Only certain Blueprint Copies can be used for invention</p>
                </div>
              )}
            </div>

            {/* Active Invention Jobs */}
            <div className="bg-slate-800/50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-cyan-400 mb-4">
                <i className="ri-settings-3-line mr-2"></i>
                Active Invention Jobs
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Phoenix Assault Fighter', chance: 35, progress: 70, timeLeft: '45m', status: 'running' },
                  { name: 'Lancer Strike Frigate', chance: 28, progress: 100, timeLeft: 'Complete', status: 'success' },
                  { name: 'Plasma Cannon II', chance: 42, progress: 100, timeLeft: 'Complete', status: 'failed' }
                ].map((job, idx) => (
                  <div key={idx} className="bg-slate-900/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-white">{job.name}</p>
                        <p className="text-sm text-gray-400">Success Chance: {job.chance}%</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        job.status === 'running' ? 'bg-purple-500/20 text-purple-400' :
                        job.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {job.status === 'running' ? 'INVENTING' : job.status === 'success' ? 'SUCCESS' : 'FAILED'}
                      </span>
                    </div>
                    {job.status === 'running' && (
                      <>
                        <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
                          <div
                            className="h-3 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all"
                            style={{ width: `${job.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">{job.progress}% - {job.timeLeft}</span>
                          <button className="text-red-400 hover:text-red-300 cursor-pointer">
                            <i className="ri-close-circle-line mr-1"></i>
                            Cancel
                          </button>
                        </div>
                      </>
                    )}
                    {job.status === 'success' && (
                      <button className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium transition-all whitespace-nowrap cursor-pointer">
                        <i className="ri-download-line mr-2"></i>
                        Claim Tech II BPC
                      </button>
                    )}
                    {job.status === 'failed' && (
                      <p className="text-sm text-red-400 mt-2">Invention failed. Materials consumed.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Market Tab */}
        {activeTab === 'market' && (
          <div>
            <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-cyan-400 mb-4">
                <i className="ri-store-line mr-2"></i>
                Blueprint Contracts Market
              </h3>
              <p className="text-gray-400 mb-4">Buy and sell blueprints with other players</p>
              
              {/* Market Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <select className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white cursor-pointer">
                  <option>All Types</option>
                  <option>BPO Only</option>
                  <option>BPC Only</option>
                </select>
                <select className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white cursor-pointer">
                  <option>All Categories</option>
                  <option>Ships</option>
                  <option>Modules</option>
                  <option>Ammunition</option>
                  <option>Structures</option>
                  <option>Components</option>
                </select>
                <select className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white cursor-pointer">
                  <option>Sort: Price Low to High</option>
                  <option>Sort: Price High to Low</option>
                  <option>Sort: Newest First</option>
                  <option>Sort: ME/TE Level</option>
                </select>
              </div>
            </div>

            {/* Market Listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBlueprints.slice(0, 6).map((bp) => (
                <div key={bp.id} className="bg-gradient-to-br from-slate-800/80 to-slate-700/50 border border-slate-600/50 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-all">
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={bp.image}
                      alt={bp.name}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-2 left-2 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        bp.type === 'BPO' 
                          ? 'bg-emerald-500/90 text-white' 
                          : 'bg-amber-500/90 text-white'
                      }`}>
                        {bp.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{bp.name}</h3>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-slate-900/50 rounded p-2">
                        <p className="text-xs text-gray-400">ME</p>
                        <p className="text-sm font-bold text-emerald-400">{bp.materialEfficiency}%</p>
                      </div>
                      <div className="bg-slate-900/50 rounded p-2">
                        <p className="text-xs text-gray-400">TE</p>
                        <p className="text-sm font-bold text-cyan-400">{bp.timeEfficiency}%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400">Seller:</span>
                      <span className="text-sm text-white">Commander_X</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-amber-400">{formatNumber(bp.baseValue * 1.2)} ISK</span>
                      <span className="text-xs text-gray-400">Market Price</span>
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 rounded-lg font-bold text-white transition-all whitespace-nowrap cursor-pointer">
                      <i className="ri-shopping-cart-line mr-2"></i>
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}