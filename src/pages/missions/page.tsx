import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import MissionCampaign from './components/MissionCampaign';

interface Ship {
  id: string;
  name: string;
  count: number;
  attack: number;
  shield: number;
  hull: number;
  speed: number;
  cargo: number;
  fuel: number;
}

interface Mission {
  id: string;
  type: 'attack' | 'transport' | 'deploy' | 'spy' | 'colonize' | 'recycle' | 'destroy' | 'expedition' | 'trade' | 'acs-attack' | 'acs-defend';
  name: string;
  description: string;
  icon: string;
  color: string;
  requirements: string[];
  fuelCost: number;
  duration: number;
}

export default function MissionsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('fleet-missions');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [targetCoordinates, setTargetCoordinates] = useState({ galaxy: 1, system: 1, position: 1 });
  const [selectedShips, setSelectedShips] = useState<Record<string, number>>({});
  const [missionSpeed, setMissionSpeed] = useState(100);
  const [activeMissions, setActiveMissions] = useState<any[]>([]);
  const [availableShips, setAvailableShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(false);

  const missionTypes: Mission[] = [
    {
      id: 'attack',
      type: 'attack',
      name: 'Attack',
      description: 'Launch an assault on enemy planets to plunder resources and destroy defenses',
      icon: 'ri-sword-line',
      color: 'from-red-600 to-orange-600',
      requirements: ['Combat ships required', 'Target must have resources'],
      fuelCost: 1.0,
      duration: 3600
    },
    {
      id: 'acs-attack',
      type: 'acs-attack',
      name: 'ACS Attack',
      description: 'Coordinate a joint attack with alliance members for massive strikes',
      icon: 'ri-team-line',
      color: 'from-red-700 to-red-500',
      requirements: ['Alliance membership', 'Multiple players', 'Combat ships'],
      fuelCost: 1.0,
      duration: 3600
    },
    {
      id: 'transport',
      type: 'transport',
      name: 'Transport',
      description: 'Send resources between your colonies or to allied players',
      icon: 'ri-truck-line',
      color: 'from-blue-600 to-cyan-600',
      requirements: ['Cargo ships required', 'Resources to transport'],
      fuelCost: 0.5,
      duration: 2400
    },
    {
      id: 'deploy',
      type: 'deploy',
      name: 'Deploy',
      description: 'Station your fleet at another planet for defense or strategic positioning',
      icon: 'ri-shield-star-line',
      color: 'from-purple-600 to-indigo-600',
      requirements: ['Any ships', 'Target must be friendly'],
      fuelCost: 0.5,
      duration: 1800
    },
    {
      id: 'spy',
      type: 'spy',
      name: 'Espionage',
      description: 'Send espionage probes to gather intelligence on enemy planets',
      icon: 'ri-user-search-line',
      color: 'from-gray-700 to-gray-500',
      requirements: ['Espionage probes', 'Espionage technology'],
      fuelCost: 0.1,
      duration: 600
    },
    {
      id: 'colonize',
      type: 'colonize',
      name: 'Colonize',
      description: 'Establish a new colony on an uninhabited planet',
      icon: 'ri-planet-line',
      color: 'from-green-600 to-emerald-600',
      requirements: ['Colony ship', 'Empty planet slot'],
      fuelCost: 2.0,
      duration: 7200
    },
    {
      id: 'recycle',
      type: 'recycle',
      name: 'Recycle',
      description: 'Collect debris fields from destroyed ships after battles',
      icon: 'ri-recycle-line',
      color: 'from-amber-600 to-yellow-600',
      requirements: ['Recycler ships', 'Debris field present'],
      fuelCost: 0.3,
      duration: 1200
    },
    {
      id: 'destroy',
      type: 'destroy',
      name: 'Destroy',
      description: 'Target and destroy enemy moons with specialized weapons',
      icon: 'ri-sword-line',
      color: 'from-red-900 to-red-700',
      requirements: ['Deathstar', 'Target moon', 'High risk'],
      fuelCost: 5.0,
      duration: 5400
    },
    {
      id: 'expedition',
      type: 'expedition',
      name: 'Expedition',
      description: 'Explore deep space for resources, ships, and dark matter',
      icon: 'ri-compass-3-line',
      color: 'from-cyan-600 to-blue-600',
      requirements: ['Mixed fleet', 'Expedition technology'],
      fuelCost: 1.5,
      duration: 10800
    },
    {
      id: 'trade',
      type: 'trade',
      name: 'Trade',
      description: 'Exchange resources with merchants at trading posts',
      icon: 'ri-exchange-line',
      color: 'from-emerald-600 to-green-600',
      requirements: ['Cargo ships', 'Trading post access'],
      fuelCost: 0.4,
      duration: 1800
    },
    {
      id: 'acs-defend',
      type: 'acs-defend',
      name: 'ACS Defend',
      description: 'Join alliance members to defend a planet from incoming attacks',
      icon: 'ri-shield-user-line',
      color: 'from-blue-700 to-blue-500',
      requirements: ['Alliance membership', 'Combat ships'],
      fuelCost: 0.5,
      duration: 2400
    }
  ];

  useEffect(() => {
    if (user) {
      loadActiveMissions();
      loadAvailableShips();
    }
  }, [user]);

  const loadActiveMissions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('fleets')
        .select('*')
        .eq('user_id', user.id)
        .not('status', 'eq', 'stationed')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setActiveMissions(data.map(fleet => ({
          id: fleet.id,
          type: fleet.mission || 'attack',
          target: fleet.dest_coords || `[${fleet.dest_galaxy}:${fleet.dest_system}:${fleet.dest_planet}]`,
          ships: fleet.total_ships || 0,
          status: fleet.status,
          progress: fleet.departure_time && fleet.arrival_time ? calculateProgress(fleet.departure_time, fleet.arrival_time) : 0,
          eta: fleet.arrival_time ? calculateETA(fleet.arrival_time) : '—',
          resources: Number(fleet.cargo_metal || 0) + Number(fleet.cargo_crystal || 0) + Number(fleet.cargo_deuterium || 0)
        })));
      }
    } catch (error) {
      console.error('Error loading active missions:', error);
    }
  };

  const loadAvailableShips = async () => {
    if (!user) return;

    try {
      const { data: planets } = await supabase
        .from('planets')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (!planets) return;

      const { data: ships, error } = await supabase
        .from('ships')
        .select('*')
        .eq('planet_id', planets.id);

      if (error) throw error;

      if (ships) {
        const shipData: Ship[] = ships.map(ship => ({
          id: ship.ship_type,
          name: ship.ship_type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          count: ship.quantity || 0,
          attack: ship.attack || 50,
          shield: ship.shield || 10,
          hull: ship.hull || 400,
          speed: ship.speed || 10000,
          cargo: ship.cargo_capacity || 100,
          fuel: ship.fuel_consumption || 20
        }));
        setAvailableShips(shipData);
      }
    } catch (error) {
      console.error('Error loading ships:', error);
    }
  };

  const calculateProgress = (departureTime: string, arrivalTime: string) => {
    const now = new Date().getTime();
    const departure = new Date(departureTime).getTime();
    const arrival = new Date(arrivalTime).getTime();
    const total = arrival - departure;
    const elapsed = now - departure;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const calculateETA = (arrivalTime: string) => {
    const now = new Date().getTime();
    const arrival = new Date(arrivalTime).getTime();
    const diff = Math.max(0, arrival - now);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const launchMission = async () => {
    if (!user || !selectedMission) {
      alert('Please select a mission type');
      return;
    }

    const stats = calculateMissionStats();
    if (stats.totalShips === 0) {
      alert('Please select at least one ship');
      return;
    }

    setLoading(true);

    try {
      const { data: planet } = await supabase
        .from('planets')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (!planet) {
        alert('No planet found');
        return;
      }

      const departureTime = new Date();
      const arrivalTime = new Date(departureTime.getTime() + stats.duration * 1000);

      const destCoords = `[${targetCoordinates.galaxy}:${targetCoordinates.system}:${targetCoordinates.position}]`;

      const { data: fleet, error: fleetError } = await supabase
        .from('fleets')
        .insert({
          user_id: user.id,
          player_id: user.id,
          name: `${selectedMission.name} Fleet → ${destCoords}`,
          mission: selectedMission.type,
          status: 'active',
          origin_planet_id: planet.id,
          dest_galaxy: targetCoordinates.galaxy,
          dest_system: targetCoordinates.system,
          dest_planet: targetCoordinates.position,
          dest_coords: destCoords,
          ships: selectedShips,
          total_ships: stats.totalShips,
          cargo_metal: 0,
          cargo_crystal: 0,
          cargo_deuterium: 0,
          departure_time: departureTime.toISOString(),
          arrival_time: arrivalTime.toISOString()
        })
        .select()
        .single();

      if (fleetError) throw fleetError;

      for (const [shipId, count] of Object.entries(selectedShips)) {
        if (count > 0) {
          const { data: shipRow } = await supabase
            .from('ships')
            .select('quantity')
            .eq('user_id', user.id)
            .eq('ship_type', shipId)
            .maybeSingle();
          if (shipRow && shipRow.quantity >= count) {
            await supabase
              .from('ships')
              .update({ quantity: shipRow.quantity - count })
              .eq('user_id', user.id)
              .eq('ship_type', shipId);
          }
        }
      }

      alert(`Mission launched successfully! ETA: ${formatDuration(stats.duration)}`);
      setSelectedMission(null);
      setSelectedShips({});
      loadActiveMissions();
      loadAvailableShips();
    } catch (error) {
      console.error('Error launching mission:', error);
      alert('Failed to launch mission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const recallFleet = async (fleetId: string) => {
    if (!window.confirm('Are you sure you want to recall this fleet?')) return;

    try {
      const { error } = await supabase
        .from('fleets')
        .update({ status: 'returning' })
        .eq('id', fleetId);

      if (error) throw error;

      alert('Fleet recalled successfully!');
      loadActiveMissions();
    } catch (error) {
      console.error('Error recalling fleet:', error);
      alert('Failed to recall fleet');
    }
  };

  const updateShipCount = (shipId: string, count: number) => {
    const ship = availableShips.find(s => s.id === shipId);
    if (ship) {
      setSelectedShips(prev => ({ 
        ...prev, 
        [shipId]: Math.max(0, Math.min(count, ship.count)) 
      }));
    }
  };

  const calculateMissionStats = () => {
    let totalShips = 0;
    let totalCargo = 0;
    let totalFuel = 0;
    let slowestSpeed = Infinity;

    Object.entries(selectedShips).forEach(([shipId, count]) => {
      const ship = availableShips.find(s => s.id === shipId);
      if (ship && count > 0) {
        totalShips += count;
        totalCargo += ship.cargo * count;
        totalFuel += ship.fuel * count * (selectedMission?.fuelCost || 1);
        if (ship.speed > 0 && ship.speed < slowestSpeed) {
          slowestSpeed = ship.speed;
        }
      }
    });

    const distance = Math.sqrt(
      Math.pow(targetCoordinates.galaxy * 1000, 2) +
      Math.pow(targetCoordinates.system * 100, 2) +
      Math.pow(targetCoordinates.position * 10, 2)
    );

    const duration = slowestSpeed !== Infinity 
      ? (distance / (slowestSpeed * (missionSpeed / 100))) * 3600 
      : 0;

    return { totalShips, totalCargo, totalFuel, duration };
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const getMissionIcon = (type: string) => {
    const mission = missionTypes.find(m => m.type === type);
    return mission?.icon || 'ri-rocket-line';
  };

  const getMissionColor = (type: string) => {
    const colors: Record<string, string> = {
      attack: 'text-red-400',
      spy: 'text-gray-400',
      transport: 'text-blue-400',
      expedition: 'text-cyan-400',
      recycle: 'text-amber-400'
    };
    return colors[type] || 'text-white';
  };

  return (
    <div className="text-white">
      {/* Developer Info Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-900/20 to-purple-900/20 border-b border-cyan-500/20 py-2 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center space-x-6">
            <span className="text-gray-400">
              <span className="text-cyan-400 font-semibold">Stellar Games Studio</span> | Lead Designer: <span className="text-cyan-400">Stephen</span>
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400">Version: <span className="text-cyan-400 font-semibold">v20.0.0 Alpha</span></span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Terms of Service</a>
            <span className="text-gray-600">|</span>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Privacy Policy</a>
            <span className="text-gray-600">|</span>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Support</a>
            <span className="text-gray-600">|</span>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Changelog</a>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Fleet Missions
          </h1>
          <p className="text-gray-400 text-lg">Deploy your fleet across the galaxy for various strategic operations</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-cyan-500/30 rounded-t-xl">
          <div className="flex items-center space-x-1 px-6">
            {[
              { id: 'fleet-missions', label: 'Fleet Missions', icon: 'ri-rocket-line' },
              { id: 'active-missions', label: 'Active Missions', icon: 'ri-time-line' },
              { id: 'campaign', label: 'Campaign', icon: 'ri-map-line' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-slate-900/50 text-cyan-400 border-t-2 border-cyan-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Missions Tab */}
        {activeTab === 'fleet-missions' && (
          <div className="bg-slate-800/30 backdrop-blur-sm border border-cyan-500/30 border-t-0 rounded-b-xl p-6">
            {!selectedMission ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {missionTypes.map((mission) => (
                  <div
                    key={mission.id}
                    onClick={() => setSelectedMission(mission)}
                    className="bg-slate-900/50 border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-400 transition-all cursor-pointer group"
                  >
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${mission.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <i className={`${mission.icon} text-3xl text-white`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{mission.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{mission.description}</p>
                    <div className="space-y-2">
                      {mission.requirements.map((req, idx) => (
                        <div key={idx} className="flex items-center text-xs text-gray-500">
                          <i className="ri-checkbox-circle-line text-cyan-400 mr-2"></i>
                          {req}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Mission Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${selectedMission.color} flex items-center justify-center`}>
                      <i className={`${selectedMission.icon} text-3xl text-white`}></i>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{selectedMission.name}</h2>
                      <p className="text-gray-400">{selectedMission.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMission(null)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-arrow-left-line mr-2"></i>Back
                  </button>
                </div>

                {/* Target Coordinates */}
                <div className="bg-slate-900/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Target Coordinates</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Galaxy</label>
                      <input
                        type="number"
                        min="1"
                        max="9"
                        value={targetCoordinates.galaxy}
                        onChange={(e) => setTargetCoordinates(prev => ({ ...prev, galaxy: parseInt(e.target.value) || 1 }))}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">System</label>
                      <input
                        type="number"
                        min="1"
                        max="499"
                        value={targetCoordinates.system}
                        onChange={(e) => setTargetCoordinates(prev => ({ ...prev, system: parseInt(e.target.value) || 1 }))}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Position</label>
                      <input
                        type="number"
                        min="1"
                        max="15"
                        value={targetCoordinates.position}
                        onChange={(e) => setTargetCoordinates(prev => ({ ...prev, position: parseInt(e.target.value) || 1 }))}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Ship Selection */}
                <div className="bg-slate-900/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Select Ships</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                    {availableShips.map((ship) => (
                      <div key={ship.id} className="bg-slate-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-bold text-white">{ship.name}</h4>
                            <div className="flex gap-3 text-xs text-gray-400 mt-1">
                              <span>⚔️ {ship.attack}</span>
                              <span>🛡️ {ship.shield}</span>
                              <span>📦 {ship.cargo}</span>
                              <span>⚡ {ship.speed}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="0"
                              max={ship.count}
                              value={selectedShips[ship.id] || 0}
                              onChange={(e) => updateShipCount(ship.id, parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm text-center focus:outline-none focus:border-cyan-400"
                            />
                            <span className="text-xs text-gray-500">/ {ship.count}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mission Speed */}
                <div className="bg-slate-900/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Mission Speed: {missionSpeed}%</h3>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="10"
                    value={missionSpeed}
                    onChange={(e) => setMissionSpeed(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>10%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Mission Summary */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Mission Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Total Ships</p>
                      <p className="text-xl font-bold text-white">{calculateMissionStats().totalShips}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Cargo Capacity</p>
                      <p className="text-xl font-bold text-cyan-400">{calculateMissionStats().totalCargo.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Fuel Cost</p>
                      <p className="text-xl font-bold text-amber-400">{Math.floor(calculateMissionStats().totalFuel).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Duration</p>
                      <p className="text-xl font-bold text-purple-400">{formatDuration(calculateMissionStats().duration)}</p>
                    </div>
                  </div>
                </div>

                {/* Launch Button */}
                <button 
                  onClick={launchMission}
                  disabled={loading || calculateMissionStats().totalShips === 0}
                  className="w-full px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-lg rounded-xl transition-all shadow-lg whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Launching...
                    </>
                  ) : (
                    <>
                      <i className="ri-rocket-line mr-2"></i>
                      Launch Mission
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Active Missions Tab */}
        {activeTab === 'active-missions' && (
          <div className="bg-slate-800/30 backdrop-blur-sm border border-cyan-500/30 border-t-0 rounded-b-xl p-6">
            {activeMissions.length === 0 ? (
              <div className="text-center py-12">
                <i className="ri-rocket-line text-6xl text-gray-600 mb-4"></i>
                <p className="text-gray-400 text-lg">No active missions</p>
                <p className="text-gray-500 text-sm">Launch a fleet mission to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeMissions.map((mission) => (
                  <div key={mission.id} className="bg-slate-900/50 border border-cyan-500/20 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <i className={`${getMissionIcon(mission.type)} text-3xl ${getMissionColor(mission.type)}`}></i>
                        <div>
                          <h3 className="text-xl font-bold text-white capitalize">{mission.type}</h3>
                          <p className="text-sm text-gray-400">Target: {mission.target} • {mission.ships} ships</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Status</p>
                        <p className="text-lg font-bold text-cyan-400 capitalize">{mission.status}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white font-semibold">{mission.progress}% • ETA: {mission.eta}</span>
                      </div>
                      <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all"
                          style={{ width: `${mission.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    {mission.resources > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <p className="text-sm text-gray-400">Resources: <span className="text-emerald-400 font-semibold">{mission.resources.toLocaleString()}</span></p>
                      </div>
                    )}
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => recallFleet(mission.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-arrow-go-back-line mr-2"></i>
                        Recall Fleet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Campaign Tab */}
        {activeTab === 'campaign' && (
          <div className="bg-slate-800/30 backdrop-blur-sm border border-cyan-500/30 border-t-0 rounded-b-xl p-6">
            <MissionCampaign />
          </div>
        )}
      </div>
    </div>
  );
}
