import { useState } from 'react';
import { useMegastructureManager } from '../../hooks/useMegastructureManager';

export default function EnhancedMegastructuresPage() {
  const {
    megastructures,
    selectedMegastructure,
    selectMegastructure,
    startConstruction,
    continueConstruction,
    upgradeTier,
    canStartConstruction,
    canContinueConstruction,
    canUpgradeTier
  } = useMegastructureManager();

  const [selectedType, setSelectedType] = useState<string>('');

  const availableTypes = [
    { id: 'dyson_sphere', name: 'Dyson Sphere', icon: 'ri-sun-line', color: 'from-yellow-500 to-orange-500' },
    { id: 'ring_world', name: 'Ring World', icon: 'ri-global-line', color: 'from-blue-500 to-cyan-500' },
    { id: 'stellar_engine', name: 'Stellar Engine', icon: 'ri-rocket-line', color: 'from-purple-500 to-pink-500' },
    { id: 'matrioshka_brain', name: 'Matrioshka Brain', icon: 'ri-brain-line', color: 'from-green-500 to-emerald-500' },
    { id: 'nicoll_dyson_beam', name: 'Nicoll-Dyson Beam', icon: 'ri-flashlight-line', color: 'from-red-500 to-orange-500' },
    { id: 'stellar_forge', name: 'Stellar Forge', icon: 'ri-fire-line', color: 'from-orange-500 to-red-500' },
    { id: 'quantum_computer', name: 'Quantum Computer', icon: 'ri-cpu-line', color: 'from-indigo-500 to-purple-500' },
    { id: 'wormhole_nexus', name: 'Wormhole Nexus', icon: 'ri-space-ship-line', color: 'from-violet-500 to-purple-500' },
    { id: 'matter_decompressor', name: 'Matter Decompressor', icon: 'ri-database-line', color: 'from-teal-500 to-cyan-500' },
    { id: 'mega_shipyard', name: 'Mega Shipyard', icon: 'ri-ship-line', color: 'from-slate-500 to-gray-500' }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1e15) return `${(num / 1e15).toFixed(2)}Q`;
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'under_construction': return 'text-yellow-400';
      case 'planning': return 'text-blue-400';
      case 'paused': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-2">
            Megastructure Engineering
          </h1>
          <p className="text-gray-400 text-lg">Construct civilization-defining megastructures</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Megastructure List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <i className="ri-building-line"></i>
                Your Megastructures
              </h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {megastructures.map((structure) => {
                  const typeInfo = availableTypes.find(t => t.id === structure.type);
                  return (
                    <button
                      key={structure.id}
                      onClick={() => selectMegastructure(structure.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedMegastructure?.id === structure.id
                          ? 'border-yellow-500 bg-yellow-500/20'
                          : 'border-slate-700 bg-slate-800/50 hover:border-yellow-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <i className={`${typeInfo?.icon} text-2xl bg-gradient-to-r ${typeInfo?.color} bg-clip-text text-transparent`}></i>
                        <div className="flex-1">
                          <div className="text-lg font-bold text-white">{structure.name}</div>
                          <div className="text-sm text-gray-400">{typeInfo?.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={getStatusColor(structure.status)}>{structure.status.replace('_', ' ').toUpperCase()}</span>
                        <span className="text-purple-400">Tier {structure.tier}</span>
                      </div>
                      {structure.status === 'under_construction' && (
                        <div className="mt-2">
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all"
                              style={{ width: `${structure.constructionProgress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1 text-center">{structure.constructionProgress.toFixed(1)}%</div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Start New Construction</h3>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white mb-3"
                >
                  <option value="">Select Type...</option>
                  {availableTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => selectedType && startConstruction(selectedType as any)}
                  disabled={!selectedType || !canStartConstruction(selectedType as any)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg font-semibold hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <i className="ri-add-line mr-2"></i>
                  Begin Construction
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {selectedMegastructure ? (
              <div className="space-y-6">
                {/* Structure Header */}
                <div className={`bg-gradient-to-r ${availableTypes.find(t => t.id === selectedMegastructure.type)?.color} p-1 rounded-xl`}>
                  <div className="bg-slate-900 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <i className={`${availableTypes.find(t => t.id === selectedMegastructure.type)?.icon} text-5xl bg-gradient-to-r ${availableTypes.find(t => t.id === selectedMegastructure.type)?.color} bg-clip-text text-transparent`}></i>
                        <div>
                          <h2 className="text-4xl font-bold text-white mb-2">{selectedMegastructure.name}</h2>
                          <p className="text-gray-400 text-lg">{availableTypes.find(t => t.id === selectedMegastructure.type)?.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-purple-400">Tier {selectedMegastructure.tier}</div>
                        <div className={`text-sm font-semibold ${getStatusColor(selectedMegastructure.status)}`}>
                          {selectedMegastructure.status.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-4">{selectedMegastructure.description}</p>

                    {/* Construction Progress */}
                    {selectedMegastructure.status === 'under_construction' && (
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Construction Progress</span>
                          <span className="text-yellow-400 font-bold">{selectedMegastructure.constructionProgress.toFixed(2)}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-4 mb-2">
                          <div 
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-4 rounded-full transition-all"
                            style={{ width: `${selectedMegastructure.constructionProgress}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-400">
                          Phase {selectedMegastructure.currentPhase} of {selectedMegastructure.constructionPhases.length}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Construction Phases */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">Construction Phases</h3>
                  <div className="space-y-3">
                    {selectedMegastructure.constructionPhases.map((phase, idx) => (
                      <div 
                        key={idx}
                        className={`p-4 rounded-lg border-2 ${
                          idx + 1 < selectedMegastructure.currentPhase ? 'border-green-500 bg-green-500/10' :
                          idx + 1 === selectedMegastructure.currentPhase ? 'border-yellow-500 bg-yellow-500/10' :
                          'border-slate-700 bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              idx + 1 < selectedMegastructure.currentPhase ? 'bg-green-500 text-white' :
                              idx + 1 === selectedMegastructure.currentPhase ? 'bg-yellow-500 text-black' :
                              'bg-slate-700 text-gray-400'
                            }`}>
                              {idx + 1 < selectedMegastructure.currentPhase ? '✓' : idx + 1}
                            </div>
                            <div>
                              <div className="font-semibold text-white">{phase.name}</div>
                              <div className="text-sm text-gray-400">{phase.description}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Duration</div>
                            <div className="font-semibold text-white">{(phase.duration / 86400).toFixed(1)} days</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                          <div className="bg-slate-900/50 rounded p-2">
                            <div className="text-gray-400">Metal</div>
                            <div className="text-blue-400 font-semibold">{formatNumber(phase.cost.metal)}</div>
                          </div>
                          <div className="bg-slate-900/50 rounded p-2">
                            <div className="text-gray-400">Crystal</div>
                            <div className="text-purple-400 font-semibold">{formatNumber(phase.cost.crystal)}</div>
                          </div>
                          <div className="bg-slate-900/50 rounded p-2">
                            <div className="text-gray-400">Deuterium</div>
                            <div className="text-green-400 font-semibold">{formatNumber(phase.cost.deuterium)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Effects */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">Megastructure Effects</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedMegastructure.effects).map(([key, value]) => (
                      <div key={key} className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-2xl font-bold text-green-400">
                          {typeof value === 'number' ? (
                            value >= 1000 ? formatNumber(value) : value
                          ) : (
                            value ? 'Yes' : 'No'
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Maintenance */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">Maintenance Requirements</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">{formatNumber(selectedMegastructure.maintenance.metal)}</div>
                      <div className="text-sm text-gray-400">Metal/hour</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400">{formatNumber(selectedMegastructure.maintenance.crystal)}</div>
                      <div className="text-sm text-gray-400">Crystal/hour</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">{formatNumber(selectedMegastructure.maintenance.deuterium)}</div>
                      <div className="text-sm text-gray-400">Deuterium/hour</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-400">{formatNumber(selectedMegastructure.maintenance.energy)}</div>
                      <div className="text-sm text-gray-400">Energy/hour</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {selectedMegastructure.status === 'under_construction' && (
                    <button
                      onClick={() => continueConstruction(selectedMegastructure.id)}
                      disabled={!canContinueConstruction(selectedMegastructure.id)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg font-semibold hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <i className="ri-hammer-line mr-2"></i>
                      Continue Construction
                    </button>
                  )}
                  {selectedMegastructure.status === 'completed' && (
                    <button
                      onClick={() => upgradeTier(selectedMegastructure.id)}
                      disabled={!canUpgradeTier(selectedMegastructure.id)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <i className="ri-arrow-up-line mr-2"></i>
                      Upgrade Tier
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-12 text-center">
                <i className="ri-building-line text-6xl text-gray-600 mb-4"></i>
                <h3 className="text-2xl font-bold text-gray-400 mb-2">No Megastructure Selected</h3>
                <p className="text-gray-500">Select a megastructure from the list or start a new construction</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
