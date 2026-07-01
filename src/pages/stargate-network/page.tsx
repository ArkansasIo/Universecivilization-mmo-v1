import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useResources } from '../../hooks/useResources';

interface Stargate {
  id: string;
  name: string;
  location: string;
  coordinates: string;
  level: number;
  status: 'active' | 'inactive' | 'under_construction';
  connections: number;
  maxConnections: number;
  energyCost: number;
  image: string;
}

export default function StargateNetworkPage() {
  useAuth();
  const { deductResources } = useResources();
  const [activeTab, setActiveTab] = useState('network');
  const [selectedGate, setSelectedGate] = useState<Stargate | null>(null);
  const [showBuildModal, setShowBuildModal] = useState(false);

  const [stargates] = useState<Stargate[]>([
    {
      id: '1',
      name: 'Alpha Gate',
      location: 'Homeworld',
      coordinates: '[1:234:8]',
      level: 5,
      status: 'active',
      connections: 8,
      maxConnections: 10,
      energyCost: 5000,
      image: 'https://readdy.ai/api/search-image?query=massive%20circular%20stargate%20portal%20with%20glowing%20blue%20energy%20ring%20ancient%20alien%20technology%20sci-fi%20space%20station%20futuristic%20architecture&width=800&height=600&seq=gate1&orientation=landscape'
    },
    {
      id: '2',
      name: 'Beta Gate',
      location: 'Mining Colony',
      coordinates: '[1:234:12]',
      level: 3,
      status: 'active',
      connections: 4,
      maxConnections: 6,
      energyCost: 3000,
      image: 'https://readdy.ai/api/search-image?query=stargate%20portal%20with%20orange%20energy%20field%20desert%20planet%20background%20ancient%20technology%20sci-fi%20gateway%20futuristic%20structure&width=800&height=600&seq=gate2&orientation=landscape'
    },
    {
      id: '3',
      name: 'Gamma Gate',
      location: 'Research Station',
      coordinates: '[2:156:5]',
      level: 4,
      status: 'active',
      connections: 6,
      maxConnections: 8,
      energyCost: 4000,
      image: 'https://readdy.ai/api/search-image?query=advanced%20stargate%20with%20purple%20energy%20vortex%20space%20station%20platform%20high-tech%20alien%20portal%20sci-fi%20architecture%20glowing%20symbols&width=800&height=600&seq=gate3&orientation=landscape'
    },
    {
      id: '4',
      name: 'Delta Gate',
      location: 'Frontier Outpost',
      coordinates: '[3:421:9]',
      level: 2,
      status: 'under_construction',
      connections: 0,
      maxConnections: 4,
      energyCost: 2000,
      image: 'https://readdy.ai/api/search-image?query=stargate%20under%20construction%20scaffolding%20energy%20field%20forming%20frontier%20planet%20background%20sci-fi%20portal%20building%20process&width=800&height=600&seq=gate4&orientation=landscape'
    }
  ]);

  const [travelHistory] = useState([
    { from: 'Alpha Gate', to: 'Beta Gate', time: '2 min ago', cost: 5000 },
    { from: 'Beta Gate', to: 'Gamma Gate', time: '15 min ago', cost: 3000 },
    { from: 'Alpha Gate', to: 'Gamma Gate', time: '1 hour ago', cost: 5000 },
    { from: 'Gamma Gate', to: 'Alpha Gate', time: '3 hours ago', cost: 4000 }
  ]);

  const handleTravel = (gate: Stargate) => {
    if (gate.status !== 'active') {
      alert('⚠️ This stargate is not operational!');
      return;
    }

    const confirm = window.confirm(
      `Travel through ${gate.name}?\n\n` +
      `Destination: ${gate.location}\n` +
      `Coordinates: ${gate.coordinates}\n` +
      `Energy Cost: ${gate.energyCost.toLocaleString()}\n\n` +
      `Travel is instantaneous!`
    );

    if (confirm) {
      alert(`✅ Traveled to ${gate.location}!\n\nYou have arrived at ${gate.coordinates}`);
    }
  };

  const handleUpgradeGate = async (gate: Stargate) => {
    const cost = {
      metal: gate.level * 100000,
      crystal: gate.level * 50000,
      deuterium: gate.level * 25000
    };

    const confirm = window.confirm(
      `Upgrade ${gate.name} to Level ${gate.level + 1}?\n\n` +
      `Cost:\n` +
      `Metal: ${cost.metal.toLocaleString()}\n` +
      `Crystal: ${cost.crystal.toLocaleString()}\n` +
      `Deuterium: ${cost.deuterium.toLocaleString()}\n\n` +
      `Benefits:\n` +
      `+2 Max Connections\n` +
      `-10% Energy Cost\n` +
      `+50% Travel Speed`
    );

    if (confirm) {
      const success = await deductResources(cost);
      if (success) {
        alert(`✅ ${gate.name} upgrade started!\n\nCompletion time: 6 hours`);
      } else {
        alert('❌ Insufficient resources!');
      }
    }
  };

  const handleBuildNewGate = () => {
    setShowBuildModal(true);
  };

  const confirmBuildGate = async () => {
    const cost = {
      metal: 500000,
      crystal: 250000,
      deuterium: 100000
    };

    const success = await deductResources(cost);
    if (success) {
      alert('✅ New Stargate construction started!\n\nCompletion time: 24 hours');
      setShowBuildModal(false);
    } else {
      alert('❌ Insufficient resources!');
    }
  };

  return (
    <div className="text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <i className="ri-door-open-line text-cyan-400 mr-4"></i>
            Stargate Network
          </h1>
          <p className="text-gray-400">Instant travel across the galaxy through ancient portals</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 bg-slate-800/50 backdrop-blur-md rounded-xl p-2 border border-cyan-400/30">
          <button
            onClick={() => setActiveTab('network')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'network'
                ? 'bg-cyan-400 text-slate-900'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <i className="ri-node-tree mr-2"></i>
            Network Map
          </button>
          <button
            onClick={() => setActiveTab('gates')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'gates'
                ? 'bg-cyan-400 text-slate-900'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <i className="ri-door-open-line mr-2"></i>
            Your Gates
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'bg-cyan-400 text-slate-900'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <i className="ri-history-line mr-2"></i>
            Travel History
          </button>
        </div>

        {/* Network Map Tab */}
        {activeTab === 'network' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 border border-cyan-400/30">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Galaxy Stargate Network</h2>
                <p className="text-gray-400">Connected gates: {stargates.filter(g => g.status === 'active').length}/{stargates.length}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stargates.map((gate) => (
                  <div
                    key={gate.id}
                    className="bg-slate-900/50 rounded-xl overflow-hidden border border-cyan-400/20 hover:border-cyan-400 transition-all"
                  >
                    <div className="w-full h-48">
                      <img src={gate.image} alt={gate.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white">{gate.name}</h3>
                          <p className="text-sm text-gray-400">{gate.location} {gate.coordinates}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          gate.status === 'active' ? 'bg-green-400/20 text-green-400' :
                          gate.status === 'inactive' ? 'bg-red-400/20 text-red-400' :
                          'bg-amber-400/20 text-amber-400'
                        }`}>
                          {gate.status.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <p className="text-xs text-gray-400 mb-1">Level</p>
                          <p className="text-lg font-bold text-cyan-400">{gate.level}</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <p className="text-xs text-gray-400 mb-1">Connections</p>
                          <p className="text-lg font-bold text-purple-400">{gate.connections}/{gate.maxConnections}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleTravel(gate)}
                          disabled={gate.status !== 'active'}
                          className={`flex-1 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                            gate.status === 'active'
                              ? 'bg-cyan-400 text-slate-900 hover:bg-cyan-300 cursor-pointer'
                              : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <i className="ri-rocket-line mr-2"></i>
                          Travel
                        </button>
                        <button
                          onClick={() => setSelectedGate(gate)}
                          className="px-4 py-2 bg-purple-400/20 text-purple-400 rounded-lg hover:bg-purple-400 hover:text-white transition-all whitespace-nowrap cursor-pointer"
                        >
                          <i className="ri-information-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Your Gates Tab */}
        {activeTab === 'gates' && (
          <div className="space-y-6">
            <div className="flex justify-end mb-4">
              <button
                onClick={handleBuildNewGate}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer"
              >
                <i className="ri-add-line mr-2"></i>
                Build New Gate
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {stargates.map((gate) => (
                <div
                  key={gate.id}
                  className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-cyan-400/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <h3 className="text-2xl font-bold text-white">{gate.name}</h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          gate.status === 'active' ? 'bg-green-400/20 text-green-400' :
                          gate.status === 'inactive' ? 'bg-red-400/20 text-red-400' :
                          'bg-amber-400/20 text-amber-400'
                        }`}>
                          {gate.status.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-slate-900/50 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-1">Location</p>
                          <p className="text-white font-semibold">{gate.location}</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-1">Level</p>
                          <p className="text-cyan-400 font-bold text-xl">{gate.level}</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-1">Connections</p>
                          <p className="text-purple-400 font-bold text-xl">{gate.connections}/{gate.maxConnections}</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-1">Energy Cost</p>
                          <p className="text-amber-400 font-bold text-xl">{gate.energyCost.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleUpgradeGate(gate)}
                          disabled={gate.status !== 'active'}
                          className={`px-6 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                            gate.status === 'active'
                              ? 'bg-purple-400/20 text-purple-400 hover:bg-purple-400 hover:text-white cursor-pointer'
                              : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <i className="ri-arrow-up-line mr-2"></i>
                          Upgrade
                        </button>
                        <button
                          onClick={() => handleTravel(gate)}
                          disabled={gate.status !== 'active'}
                          className={`px-6 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                            gate.status === 'active'
                              ? 'bg-cyan-400 text-slate-900 hover:bg-cyan-300 cursor-pointer'
                              : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <i className="ri-rocket-line mr-2"></i>
                          Travel
                        </button>
                      </div>
                    </div>

                    <div className="w-48 h-32 rounded-lg overflow-hidden ml-6">
                      <img src={gate.image} alt={gate.name} className="w-full h-full object-cover object-top" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Travel History Tab */}
        {activeTab === 'history' && (
          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-cyan-400/30">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Travels</h2>
            <div className="space-y-3">
              {travelHistory.map((travel, index) => (
                <div
                  key={index}
                  className="bg-slate-900/50 rounded-lg p-4 border border-cyan-400/20 hover:border-cyan-400 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <i className="ri-arrow-right-line text-cyan-400 text-xl"></i>
                      <div>
                        <p className="text-white font-semibold">{travel.from} → {travel.to}</p>
                        <p className="text-sm text-gray-400">{travel.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-400 font-semibold">{travel.cost.toLocaleString()} Energy</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Build Modal */}
      {showBuildModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-400 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Build New Stargate</h2>
            
            <div className="space-y-4 mb-6">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Construction Cost:</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Metal:</span>
                    <span className="text-yellow-400 font-bold">500,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Crystal:</span>
                    <span className="text-blue-400 font-bold">250,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Deuterium:</span>
                    <span className="text-green-400 font-bold">100,000</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Construction Time:</p>
                <p className="text-white font-bold">24 hours</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowBuildModal(false)}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmBuildGate}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer"
              >
                Build
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gate Details Modal */}
      {selectedGate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-400 rounded-2xl p-8 max-w-2xl w-full">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">{selectedGate.name}</h2>
              <button
                onClick={() => setSelectedGate(null)}
                className="text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="w-full h-64 rounded-xl overflow-hidden mb-6">
              <img src={selectedGate.image} alt={selectedGate.name} className="w-full h-full object-cover object-top" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Location</p>
                <p className="text-white font-semibold">{selectedGate.location}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Coordinates</p>
                <p className="text-cyan-400 font-semibold">{selectedGate.coordinates}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Gate Level</p>
                <p className="text-purple-400 font-bold text-xl">{selectedGate.level}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Status</p>
                <p className={`font-semibold ${
                  selectedGate.status === 'active' ? 'text-green-400' :
                  selectedGate.status === 'inactive' ? 'text-red-400' :
                  'text-amber-400'
                }`}>
                  {selectedGate.status.replace('_', ' ').toUpperCase()}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedGate(null)}
              className="w-full px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-900 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
