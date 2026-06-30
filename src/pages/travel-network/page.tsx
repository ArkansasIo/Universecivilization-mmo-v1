import { useState } from 'react';
import { useTravelSystem } from '../../hooks/useTravelSystem';
import { TravelSystem, calculateTravelTime, calculateTravelCost } from '../../data/travelSystems';

export default function TravelNetworkPage() {
  const playerId = localStorage.getItem('userId') || '';
  const {
    ownedSystems,
    activeRoutes,
    loading,
    playerResources,
    buildTravelSystem,
    initiateTravel,
    connectJumpGates,
    getAvailableSystems,
    allTravelSystems
  } = useTravelSystem(playerId);

  const [activeTab, setActiveTab] = useState<'systems' | 'owned' | 'routes' | 'travel'>('systems');
  const [selectedSystem, setSelectedSystem] = useState<TravelSystem | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'jumpgate' | 'stargate' | 'hyperspace'>('all');
  
  // Build system form
  const [buildCoordinates, setBuildCoordinates] = useState({ x: 0, y: 0, z: 0 });
  const [building, setBuilding] = useState(false);
  
  // Travel form
  const [travelForm, setTravelForm] = useState({
    fleetId: '',
    systemId: '',
    fromX: 0,
    fromY: 0,
    fromZ: 0,
    toX: 0,
    toY: 0,
    toZ: 0,
    fleetSize: 1
  });
  const [traveling, setTraveling] = useState(false);
  
  // Connect gates form
  const [connectForm, setConnectForm] = useState({ gate1: '', gate2: '' });
  const [connecting, setConnecting] = useState(false);

  const availableSystems = getAvailableSystems();
  const filteredSystems = filterType === 'all' 
    ? availableSystems 
    : availableSystems.filter(s => s.system.type === filterType);

  const handleBuildSystem = async () => {
    if (!selectedSystem) return;
    
    setBuilding(true);
    try {
      await buildTravelSystem(selectedSystem.id, buildCoordinates);
      alert(`${selectedSystem.name} built successfully!`);
      setSelectedSystem(null);
      setBuildCoordinates({ x: 0, y: 0, z: 0 });
    } catch (error: any) {
      alert(`Failed to build: ${error.message}`);
    } finally {
      setBuilding(false);
    }
  };

  const handleInitiateTravel = async () => {
    setTraveling(true);
    try {
      const route = await initiateTravel(
        travelForm.fleetId,
        travelForm.systemId,
        { x: travelForm.fromX, y: travelForm.fromY, z: travelForm.fromZ },
        { x: travelForm.toX, y: travelForm.toY, z: travelForm.toZ },
        travelForm.fleetSize
      );
      alert(`Travel initiated! Arrival in ${Math.ceil(route.travelTime / 60)} minutes`);
      setTravelForm({
        fleetId: '',
        systemId: '',
        fromX: 0,
        fromY: 0,
        fromZ: 0,
        toX: 0,
        toY: 0,
        toZ: 0,
        fleetSize: 1
      });
    } catch (error: any) {
      alert(`Failed to initiate travel: ${error.message}`);
    } finally {
      setTraveling(false);
    }
  };

  const handleConnectGates = async () => {
    setConnecting(true);
    try {
      const result = await connectJumpGates(connectForm.gate1, connectForm.gate2);
      alert(`Gates connected! Distance: ${result.distance.toFixed(1)} LY`);
      setConnectForm({ gate1: '', gate2: '' });
    } catch (error: any) {
      alert(`Failed to connect gates: ${error.message}`);
    } finally {
      setConnecting(false);
    }
  };

  const getRankColor = (rank: string) => {
    const colors: { [key: string]: string } = {
      'E': 'text-gray-400',
      'D': 'text-green-400',
      'C': 'text-blue-400',
      'B': 'text-purple-400',
      'A': 'text-yellow-400',
      'S': 'text-orange-400',
      'SS': 'text-red-400',
      'SSS': 'text-pink-400',
      'Universal': 'text-cyan-400'
    };
    return colors[rank] || 'text-gray-400';
  };

  const getRarityColor = (rarity: string) => {
    const colors: { [key: string]: string } = {
      'Common': 'bg-gray-500',
      'Uncommon': 'bg-green-500',
      'Rare': 'bg-blue-500',
      'Epic': 'bg-purple-500',
      'Legendary': 'bg-yellow-500',
      'Mythic': 'bg-orange-500',
      'Transcendent': 'bg-red-500',
      'Universal': 'bg-cyan-500'
    };
    return colors[rarity] || 'bg-gray-500';
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'jumpgate': 'ri-door-open-line',
      'stargate': 'ri-planet-line',
      'hyperspace': 'ri-rocket-2-line'
    };
    return icons[type] || 'ri-space-ship-line';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Travel Network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <i className="ri-space-ship-line"></i>
            Travel Network
          </h1>
          <p className="text-purple-200">Manage jump gates, stargates, and hyperspace travel systems</p>
        </div>

        {/* Resources Display */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30">
            <div className="text-gray-400 text-sm mb-1">Metal</div>
            <div className="text-white font-bold text-lg">{playerResources.metal.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30">
            <div className="text-gray-400 text-sm mb-1">Crystal</div>
            <div className="text-white font-bold text-lg">{playerResources.crystal.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30">
            <div className="text-gray-400 text-sm mb-1">Deuterium</div>
            <div className="text-white font-bold text-lg">{playerResources.deuterium.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30">
            <div className="text-gray-400 text-sm mb-1">Dark Matter</div>
            <div className="text-white font-bold text-lg">{playerResources.darkMatter.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30">
            <div className="text-gray-400 text-sm mb-1">Exotic Matter</div>
            <div className="text-white font-bold text-lg">{playerResources.exoticMatter.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30">
            <div className="text-gray-400 text-sm mb-1">Energy</div>
            <div className="text-white font-bold text-lg">{playerResources.energy.toLocaleString()}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('systems')}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeTab === 'systems'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
            }`}
          >
            <i className="ri-list-check mr-2"></i>
            Available Systems
          </button>
          <button
            onClick={() => setActiveTab('owned')}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeTab === 'owned'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
            }`}
          >
            <i className="ri-building-line mr-2"></i>
            My Systems ({ownedSystems.length})
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeTab === 'routes'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
            }`}
          >
            <i className="ri-route-line mr-2"></i>
            Active Routes ({activeRoutes.filter(r => r.status === 'traveling').length})
          </button>
          <button
            onClick={() => setActiveTab('travel')}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeTab === 'travel'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
            }`}
          >
            <i className="ri-rocket-line mr-2"></i>
            Initiate Travel
          </button>
        </div>

        {/* Available Systems Tab */}
        {activeTab === 'systems' && (
          <div>
            {/* Filter */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filterType === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
                }`}
              >
                All Systems
              </button>
              <button
                onClick={() => setFilterType('jumpgate')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filterType === 'jumpgate'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
                }`}
              >
                <i className="ri-door-open-line mr-2"></i>
                Jump Gates
              </button>
              <button
                onClick={() => setFilterType('stargate')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filterType === 'stargate'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
                }`}
              >
                <i className="ri-planet-line mr-2"></i>
                Stargates
              </button>
              <button
                onClick={() => setFilterType('hyperspace')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filterType === 'hyperspace'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
                }`}
              >
                <i className="ri-rocket-2-line mr-2"></i>
                Hyperspace
              </button>
            </div>

            {/* Systems Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSystems.map(({ system, canUse, missingRequirements }) => (
                <div
                  key={system.id}
                  className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all ${
                    canUse
                      ? 'border-purple-500/50 hover:border-purple-400 cursor-pointer'
                      : 'border-red-500/30 opacity-75'
                  }`}
                  onClick={() => canUse && setSelectedSystem(system)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                        <i className={`${getTypeIcon(system.type)} text-2xl text-white`}></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{system.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-sm font-bold ${getRankColor(system.rank)}`}>
                            {system.rank}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full text-white ${getRarityColor(system.rarity)}`}>
                            {system.rarity}
                          </span>
                          <span className="text-xs text-gray-400">Tier {system.tier}</span>
                        </div>
                      </div>
                    </div>
                    {canUse ? (
                      <i className="ri-check-line text-2xl text-green-400"></i>
                    ) : (
                      <i className="ri-lock-line text-2xl text-red-400"></i>
                    )}
                  </div>

                  <p className="text-gray-300 text-sm mb-4">{system.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <div className="text-gray-400 text-xs mb-1">Max Range</div>
                      <div className="text-white font-bold">{system.maxRange} LY</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <div className="text-gray-400 text-xs mb-1">Travel Speed</div>
                      <div className="text-white font-bold">{system.travelSpeed}x</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <div className="text-gray-400 text-xs mb-1">Cooldown</div>
                      <div className="text-white font-bold">{system.cooldown}s</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <div className="text-gray-400 text-xs mb-1">Max Fleet</div>
                      <div className="text-white font-bold">{system.maxFleetSize}</div>
                    </div>
                  </div>

                  {/* Special Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {system.instantTravel && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                        Instant Travel
                      </span>
                    )}
                    {system.canBypassDefenses && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                        Bypass Defenses
                      </span>
                    )}
                    {system.stealthTravel && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                        Stealth
                      </span>
                    )}
                    {system.massTransport && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                        Mass Transport
                      </span>
                    )}
                  </div>

                  {/* Requirements */}
                  {!canUse && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <div className="text-red-400 text-sm font-semibold mb-2">Missing Requirements:</div>
                      <ul className="text-red-300 text-xs space-y-1">
                        {missingRequirements.map((req, idx) => (
                          <li key={idx}>• {req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Build Cost */}
                  {canUse && (
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                      <div className="text-purple-400 text-sm font-semibold mb-2">Build Cost:</div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-gray-300">
                          <i className="ri-copper-coin-line text-yellow-400 mr-1"></i>
                          {system.requirements.resources.metal.toLocaleString()}
                        </div>
                        <div className="text-gray-300">
                          <i className="ri-vip-diamond-line text-blue-400 mr-1"></i>
                          {system.requirements.resources.crystal.toLocaleString()}
                        </div>
                        <div className="text-gray-300">
                          <i className="ri-drop-line text-cyan-400 mr-1"></i>
                          {system.requirements.resources.deuterium.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Owned Systems Tab */}
        {activeTab === 'owned' && (
          <div>
            {ownedSystems.length === 0 ? (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-12 text-center border border-purple-500/30">
                <i className="ri-building-line text-6xl text-gray-600 mb-4"></i>
                <h3 className="text-xl font-bold text-white mb-2">No Travel Systems Built</h3>
                <p className="text-gray-400 mb-6">Build your first travel system to start exploring the galaxy</p>
                <button
                  onClick={() => setActiveTab('systems')}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
                >
                  Browse Available Systems
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {ownedSystems.map((owned) => {
                  const system = allTravelSystems.find(s => s.id === owned.systemId);
                  if (!system) return null;

                  return (
                    <div
                      key={owned.id}
                      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/50"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <i className={`${getTypeIcon(system.type)} text-2xl text-white`}></i>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{system.name}</h3>
                            <div className="text-sm text-gray-400">Level {owned.level}</div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          owned.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {owned.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>

                      <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                        <div className="text-gray-400 text-sm mb-2">Coordinates</div>
                        <div className="text-white font-mono">
                          X: {owned.coordinates.x} | Y: {owned.coordinates.y} | Z: {owned.coordinates.z}
                        </div>
                      </div>

                      {system.type === 'jumpgate' && owned.connectedGates && owned.connectedGates.length > 0 && (
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                          <div className="text-blue-400 text-sm font-semibold mb-2">
                            Connected Gates: {owned.connectedGates.length}
                          </div>
                          <div className="text-gray-300 text-xs">
                            Network connectivity established
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all whitespace-nowrap">
                          <i className="ri-settings-3-line mr-2"></i>
                          Configure
                        </button>
                        <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all whitespace-nowrap">
                          <i className="ri-information-line mr-2"></i>
                          Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Connect Jump Gates Section */}
            {ownedSystems.some(s => {
              const sys = allTravelSystems.find(t => t.id === s.systemId);
              return sys?.type === 'jumpgate';
            }) && (
              <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/50">
                <h3 className="text-xl font-bold text-white mb-4">
                  <i className="ri-links-line mr-2"></i>
                  Connect Jump Gates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Gate 1</label>
                    <select
                      value={connectForm.gate1}
                      onChange={(e) => setConnectForm({ ...connectForm, gate1: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white"
                    >
                      <option value="">Select Gate</option>
                      {ownedSystems
                        .filter(s => {
                          const sys = allTravelSystems.find(t => t.id === s.systemId);
                          return sys?.type === 'jumpgate';
                        })
                        .map(s => (
                          <option key={s.id} value={s.id}>
                            {allTravelSystems.find(t => t.id === s.systemId)?.name} - ({s.coordinates.x}, {s.coordinates.y}, {s.coordinates.z})
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Gate 2</label>
                    <select
                      value={connectForm.gate2}
                      onChange={(e) => setConnectForm({ ...connectForm, gate2: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white"
                    >
                      <option value="">Select Gate</option>
                      {ownedSystems
                        .filter(s => {
                          const sys = allTravelSystems.find(t => t.id === s.systemId);
                          return sys?.type === 'jumpgate' && s.id !== connectForm.gate1;
                        })
                        .map(s => (
                          <option key={s.id} value={s.id}>
                            {allTravelSystems.find(t => t.id === s.systemId)?.name} - ({s.coordinates.x}, {s.coordinates.y}, {s.coordinates.z})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleConnectGates}
                  disabled={!connectForm.gate1 || !connectForm.gate2 || connecting}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all whitespace-nowrap"
                >
                  {connecting ? 'Connecting...' : 'Connect Gates'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Active Routes Tab */}
        {activeTab === 'routes' && (
          <div>
            {activeRoutes.length === 0 ? (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-12 text-center border border-purple-500/30">
                <i className="ri-route-line text-6xl text-gray-600 mb-4"></i>
                <h3 className="text-xl font-bold text-white mb-2">No Active Routes</h3>
                <p className="text-gray-400 mb-6">Initiate travel to see active routes</p>
                <button
                  onClick={() => setActiveTab('travel')}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all whitespace-nowrap"
                >
                  Initiate Travel
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeRoutes.map((route) => {
                  const system = allTravelSystems.find(s => s.id === route.systemId);
                  const timeRemaining = Math.max(0, route.arrivalTime.getTime() - Date.now());
                  const progress = route.status === 'arrived' ? 100 : ((route.travelTime * 1000 - timeRemaining) / (route.travelTime * 1000)) * 100;

                  return (
                    <div
                      key={route.id}
                      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/50"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {system?.name || 'Unknown System'}
                          </h3>
                          <div className="text-sm text-gray-400">Fleet ID: {route.fleetId}</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          route.status === 'traveling' ? 'bg-blue-500/20 text-blue-400' :
                          route.status === 'arrived' ? 'bg-green-500/20 text-green-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {route.status === 'traveling' ? 'In Transit' :
                           route.status === 'arrived' ? 'Arrived' : 'Cancelled'}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-slate-900/50 rounded-lg p-3">
                          <div className="text-gray-400 text-xs mb-1">From</div>
                          <div className="text-white text-sm font-mono">
                            {route.fromCoordinates.x}, {route.fromCoordinates.y}, {route.fromCoordinates.z}
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-3">
                          <div className="text-gray-400 text-xs mb-1">To</div>
                          <div className="text-white text-sm font-mono">
                            {route.toCoordinates.x}, {route.toCoordinates.y}, {route.toCoordinates.z}
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Distance: {route.distance.toFixed(1)} LY</span>
                          {route.status === 'traveling' && (
                            <span className="text-white">
                              ETA: {Math.ceil(timeRemaining / 1000 / 60)} min
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {route.status === 'arrived' && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                          <i className="ri-check-line text-green-400 text-2xl mb-1"></i>
                          <div className="text-green-400 font-semibold">Fleet has arrived at destination</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Initiate Travel Tab */}
        {activeTab === 'travel' && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/50">
            <h3 className="text-2xl font-bold text-white mb-6">
              <i className="ri-rocket-line mr-2"></i>
              Initiate Travel
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Fleet ID</label>
                <input
                  type="text"
                  value={travelForm.fleetId}
                  onChange={(e) => setTravelForm({ ...travelForm, fleetId: e.target.value })}
                  placeholder="Enter fleet ID"
                  className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Travel System</label>
                <select
                  value={travelForm.systemId}
                  onChange={(e) => setTravelForm({ ...travelForm, systemId: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white"
                >
                  <option value="">Select System</option>
                  {ownedSystems.map(s => {
                    const sys = allTravelSystems.find(t => t.id === s.systemId);
                    return (
                      <option key={s.id} value={s.systemId}>
                        {sys?.name} - Level {s.level}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Fleet Size</label>
                <input
                  type="number"
                  value={travelForm.fleetSize}
                  onChange={(e) => setTravelForm({ ...travelForm, fleetSize: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-white font-semibold mb-3">From Coordinates</h4>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={travelForm.fromX}
                    onChange={(e) => setTravelForm({ ...travelForm, fromX: parseFloat(e.target.value) || 0 })}
                    placeholder="X"
                    className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white"
                  />
                  <input
                    type="number"
                    value={travelForm.fromY}
                    onChange={(e) => setTravelForm({ ...travelForm, fromY: parseFloat(e.target.value) || 0 })}
                    placeholder="Y"
                    className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white"
                  />
                  <input
                    type="number"
                    value={travelForm.fromZ}
                    onChange={(e) => setTravelForm({ ...travelForm, fromZ: parseFloat(e.target.value) || 0 })}
                    placeholder="Z"
                    className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3">To Coordinates</h4>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={travelForm.toX}
                    onChange={(e) => setTravelForm({ ...travelForm, toX: parseFloat(e.target.value) || 0 })}
                    placeholder="X"
                    className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white"
                  />
                  <input
                    type="number"
                    value={travelForm.toY}
                    onChange={(e) => setTravelForm({ ...travelForm, toY: parseFloat(e.target.value) || 0 })}
                    placeholder="Y"
                    className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white"
                  />
                  <input
                    type="number"
                    value={travelForm.toZ}
                    onChange={(e) => setTravelForm({ ...travelForm, toZ: parseFloat(e.target.value) || 0 })}
                    placeholder="Z"
                    className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>

            {travelForm.systemId && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-6">
                <h4 className="text-purple-400 font-semibold mb-3">Travel Calculation</h4>
                {(() => {
                  const system = allTravelSystems.find(s => s.id === travelForm.systemId);
                  if (!system) return null;

                  const distance = Math.sqrt(
                    Math.pow(travelForm.toX - travelForm.fromX, 2) +
                    Math.pow(travelForm.toY - travelForm.fromY, 2) +
                    Math.pow(travelForm.toZ - travelForm.fromZ, 2)
                  );

                  const travelTime = calculateTravelTime(distance, system);
                  const costs = calculateTravelCost(distance, system, travelForm.fleetSize);

                  return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <div className="text-gray-400 mb-1">Distance</div>
                        <div className="text-white font-bold">{distance.toFixed(1)} LY</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1">Travel Time</div>
                        <div className="text-white font-bold">
                          {system.instantTravel ? 'Instant' : `${Math.ceil(travelTime / 60)} min`}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1">Energy Cost</div>
                        <div className="text-white font-bold">{costs.energy.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1">Fuel Cost</div>
                        <div className="text-white font-bold">{costs.deuterium.toLocaleString()}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            <button
              onClick={handleInitiateTravel}
              disabled={!travelForm.fleetId || !travelForm.systemId || traveling}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-bold text-lg transition-all whitespace-nowrap"
            >
              {traveling ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Initiating Travel...
                </>
              ) : (
                <>
                  <i className="ri-rocket-line mr-2"></i>
                  Initiate Travel
                </>
              )}
            </button>
          </div>
        )}

        {/* Build System Modal */}
        {selectedSystem && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/50">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedSystem.name}</h2>
                    <p className="text-gray-400">{selectedSystem.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedSystem(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <i className="ri-close-line text-2xl"></i>
                  </button>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-semibold mb-3">Build Location</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">X</label>
                      <input
                        type="number"
                        value={buildCoordinates.x}
                        onChange={(e) => setBuildCoordinates({ ...buildCoordinates, x: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Y</label>
                      <input
                        type="number"
                        value={buildCoordinates.y}
                        onChange={(e) => setBuildCoordinates({ ...buildCoordinates, y: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Z</label>
                      <input
                        type="number"
                        value={buildCoordinates.z}
                        onChange={(e) => setBuildCoordinates({ ...buildCoordinates, z: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-6">
                  <h3 className="text-purple-400 font-semibold mb-3">Build Cost</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Metal:</span>
                      <span className="text-white font-bold">{selectedSystem.requirements.resources.metal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Crystal:</span>
                      <span className="text-white font-bold">{selectedSystem.requirements.resources.crystal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Deuterium:</span>
                      <span className="text-white font-bold">{selectedSystem.requirements.resources.deuterium.toLocaleString()}</span>
                    </div>
                    {selectedSystem.requirements.resources.darkMatter && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Dark Matter:</span>
                        <span className="text-white font-bold">{selectedSystem.requirements.resources.darkMatter.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedSystem.requirements.resources.exoticMatter && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Exotic Matter:</span>
                        <span className="text-white font-bold">{selectedSystem.requirements.resources.exoticMatter.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedSystem(null)}
                    className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all whitespace-nowrap"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBuildSystem}
                    disabled={building}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all whitespace-nowrap"
                  >
                    {building ? 'Building...' : 'Build System'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
