import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useFleetManager } from '../../hooks/useFleetManager';
import { useInsuranceSystem } from '../../hooks/useInsuranceSystem';
import { useGameTime, computeCompactArrivalStardate } from '../../hooks/useGameTime';
import { supabase } from '../../lib/supabase';
import CrewAssignment from './components/CrewAssignment';
import { getShipArt } from '@/data/gameArtwork';

export default function FleetPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    fleets, activeFleets, loading,
    sendFleet, recallFleet, getFleetProgress, getTimeRemaining,
    calculateTravelTime, calculateFuelCost
  } = useFleetManager();

  const {
    policies, activePolicies, stats: insuranceStats,
    loading: insuranceLoading, processingClaim,
    fileClaim, cancelPolicy, refreshPolicies,
  } = useInsuranceSystem();
  const gameTime = useGameTime();

  const [selectedShips, setSelectedShips] = useState<{[key: string]: number}>({});
  const [targetCoordinates, setTargetCoordinates] = useState('');
  const [selectedMission, setSelectedMission] = useState('');
  const [activeTab, setActiveTab] = useState<'send' | 'active' | 'logs' | 'crew' | 'insurance'>('send');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [showCombatLog, setShowCombatLog] = useState(false);
  const [availableShips, setAvailableShips] = useState<any[]>([]);
  const [currentPlanet, setCurrentPlanet] = useState('1:1:3');
  const [combatLogs, setCombatLogs] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [missionError, setMissionError] = useState<string | null>(null);

  const ships = [
    { id: 'light_fighter', name: 'Light Fighter', available: 0, speed: 12500, cargo: 50, fuel: 20, attack: 50, shield: 10, icon: 'ri-plane-line' },
    { id: 'heavy_fighter', name: 'Heavy Fighter', available: 0, speed: 10000, cargo: 100, fuel: 75, attack: 150, shield: 25, icon: 'ri-flight-takeoff-line' },
    { id: 'cruiser', name: 'Cruiser', available: 0, speed: 15000, cargo: 800, fuel: 300, attack: 400, shield: 50, icon: 'ri-rocket-2-line' },
    { id: 'battleship', name: 'Battleship', available: 0, speed: 10000, cargo: 1500, fuel: 500, attack: 1000, shield: 200, icon: 'ri-ship-2-line' },
    { id: 'destroyer', name: 'Destroyer', available: 0, speed: 5000, cargo: 2000, fuel: 1000, attack: 2000, shield: 500, icon: 'ri-rocket-line' },
    { id: 'small_cargo', name: 'Small Cargo', available: 0, speed: 5000, cargo: 5000, fuel: 30, attack: 5, shield: 10, icon: 'ri-truck-line' },
    { id: 'large_cargo', name: 'Large Cargo', available: 0, speed: 7500, cargo: 25000, fuel: 50, attack: 5, shield: 25, icon: 'ri-truck-line' },
    { id: 'colony_ship', name: 'Colony Ship', available: 0, speed: 2500, cargo: 7500, fuel: 1000, attack: 50, shield: 100, icon: 'ri-space-ship-line' },
    { id: 'recycler', name: 'Recycler', available: 0, speed: 2000, cargo: 20000, fuel: 300, attack: 1, shield: 10, icon: 'ri-recycle-line' },
    { id: 'espionage_probe', name: 'Espionage Probe', available: 0, speed: 100000, cargo: 5, fuel: 1, attack: 0, shield: 0, icon: 'ri-radar-line' },
    { id: 'interplanetary_missile', name: 'Interplanetary Missile', available: 0, speed: 8000, cargo: 0, fuel: 0, attack: 12000, shield: 0, icon: 'ri-meteor-line' },
  ];

  useEffect(() => {
    const loadShips = async () => {
      if (!user) return;
      const { data } = await supabase.from('ships').select('*').eq('user_id', user.id);
      if (data) {
        const shipMap: any = {};
        data.forEach((ship: any) => { shipMap[ship.ship_type] = ship.quantity; });
        setAvailableShips(ships.map(s => ({ ...s, available: shipMap[s.id] || 0 })));
      } else { setAvailableShips(ships); }
    };
    loadShips();
    const interval = setInterval(loadShips, 5000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const loadCombatLogs = async () => {
      if (!user) return;
      const { data } = await supabase.from('combat_logs').select('*').eq('attacker_id', user.id).order('timestamp', { ascending: false }).limit(20);
      if (data) {
        setCombatLogs(data.map((log: any) => ({
          id: log.id, date: new Date(log.timestamp), mission: 'Attack', target: log.location, targetPlayer: 'Enemy Base',
          result: log.result, rounds: 3, attackerLosses: log.attacker_losses, defenderLosses: log.defender_losses,
          loot: log.loot, debris: { metal: 10000, crystal: 5000 },
          experience: log.result === 'victory' ? 15000 : 5000, detailedLog: []
        })));
      }
    };
    loadCombatLogs();
  }, [user]);

  useEffect(() => {
    const loadCurrentPlanet = async () => {
      if (!user) return;
      const { data } = await supabase.from('planets').select('position_galaxy, position_system, position_planet').eq('user_id', user.id).eq('is_homeworld', true).maybeSingle();
      if (data) { setCurrentPlanet(`${data.position_galaxy}:${data.position_system}:${data.position_planet}`); }
    };
    loadCurrentPlanet();
  }, [user]);

  const handleShipSelect = (shipId: string, count: number) => {
    const ship = availableShips.find(s => s.id === shipId);
    if (!ship) return;
    if (count <= 0) { const ns = { ...selectedShips }; delete ns[shipId]; setSelectedShips(ns); }
    else { const maxCount = Math.min(count, ship.available); setSelectedShips({ ...selectedShips, [shipId]: maxCount }); }
  };

  const handleLaunchFleet = async () => {
    setMissionError(null);
    if (totalShips === 0) { setMissionError('Please select ships for your fleet!'); return; }
    if (!targetCoordinates) { setMissionError('Please enter target coordinates!'); return; }
    if (!selectedMission) { setMissionError('Please select a mission type!'); return; }
    const coordsMatch = targetCoordinates.match(/(\d+):(\d+):(\d+)/);
    if (!coordsMatch) { setMissionError('Invalid coordinates! Use format: G:S:P (e.g. 1:234:5)'); return; }
    const { data: userFleets } = await supabase.from('fleets').select('id').eq('user_id', user?.id).eq('status', 'idle').limit(1);
    let fleetId = userFleets && userFleets.length > 0 ? userFleets[0].id : null;
    if (!fleetId) {
      const { data: newFleet } = await supabase.from('fleets').insert({ user_id: user?.id, player_id: user?.id, name: 'Dispatch Fleet', mission: 'stationed', status: 'idle', origin_planet_id: null, ships: {}, cargo_metal: 0, cargo_crystal: 0, cargo_deuterium: 0, total_ships: 0 }).select().single();
      fleetId = newFleet?.id;
    }
    if (!fleetId) { setMissionError('Failed to create fleet entry'); return; }
    await supabase.from('fleets').update({ ships: selectedShips, total_ships: totalShips, status: 'idle' }).eq('id', fleetId);
    setSending(true);
    try {
      const targetCoords = { galaxy: parseInt(coordsMatch[1]), system: parseInt(coordsMatch[2]), planet: parseInt(coordsMatch[3]) };
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/process-fleet-mission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token || ''}`, 'apikey': (import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || '').replace(/^["']|["']$/g, '') },
        body: JSON.stringify({ fleet_id: fleetId, mission_type: selectedMission.toLowerCase().replace(' ', '_'), target_coords: targetCoords, cargo: { metal: 0, crystal: 0, deuterium: 0 }, hold_time: 0 }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to dispatch fleet');
      setSelectedShips({}); setTargetCoordinates(''); setSelectedMission(''); setActiveTab('active');
    } catch (error: any) { setMissionError(`Failed to launch fleet: ${error.message}`); }
    finally { setSending(false); }
  };

  const handleSaveTemplate = () => {
    if (totalShips === 0) { setMissionError('Please select ships before saving template!'); return; }
    const templateName = prompt('Enter template name:');
    if (templateName) { localStorage.setItem(`fleet_template_${templateName}`, JSON.stringify(selectedShips)); alert(`Fleet template "${templateName}" saved!`); }
  };

  const handleMissionSelect = (missionType: string) => { setSelectedMission(missionType); };

  const handleRecallFleet = async (fleetId: string) => {
    try { await recallFleet(fleetId); alert('Fleet recalled! Returning to base.'); }
    catch (error) { setMissionError('Failed to recall fleet'); }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600), minutes = Math.floor((seconds % 3600) / 60), secs = Math.floor(seconds % 60);
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const totalShips = Object.values(selectedShips).reduce((a, b) => a + b, 0);
  const totalCargo = Object.entries(selectedShips).reduce((total, [id, count]) => { const ship = availableShips.find(s => s.id === id); return total + (ship ? ship.cargo * count : 0); }, 0);
  const totalAttack = Object.entries(selectedShips).reduce((total, [id, count]) => { const ship = availableShips.find(s => s.id === id); return total + (ship ? ship.attack * count : 0); }, 0);
  const totalShield = Object.entries(selectedShips).reduce((total, [id, count]) => { const ship = availableShips.find(s => s.id === id); return total + (ship ? ship.shield * count : 0); }, 0);
  const estimatedTravelTime = targetCoordinates ? calculateTravelTime(selectedShips, currentPlanet, targetCoordinates) : 0;

  /* ── Mission colors ── */
  const missionColors: Record<string, string> = {
    'Attack': 'red', 'Raid': 'orange', 'Spy': 'yellow', 'Transport': 'emerald', 'Deploy': 'teal', 'Colonize': 'cyan', 'Harvest': 'amber', 'ACS': 'blue'
  };
  const missionHex: Record<string, string> = {
    'Attack': '#f87171', 'Raid': '#fb923c', 'Spy': '#e2c044', 'Transport': '#7bc67e', 'Deploy': '#5bc0be', 'Colonize': '#38bdf8', 'Harvest': '#d4a853', 'ACS': '#60a5fa'
  };

  return (
    <div style={{ color: '#8892aa' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <img src="https://readdy.ai/api/search-image?query=massive%20space%20armada%20formation%20hundreds%20of%20starships%20battleships%20cruisers%20in%20tactical%20formation%20against%20deep%20space%20nebula%20dark%20moody%20dramatic%20lighting%20cinematic%20aerial%20view%20sci-fi%20game%20art%20epic%20scale&width=1920&height=600&seq=fleet_hero_v3&orientation=landscape"
          alt="Fleet" className="absolute inset-0 w-full h-full object-cover object-top" style={{ filter: 'brightness(0.4)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(7,10,16,0.95) 100%)' }} />
        <div className="relative z-10 h-full flex items-end px-6 pb-5">
          <div className="flex items-end justify-between w-full">
            <div>
              <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Fleet Command</h1>
              <p className="text-sm" style={{ color: '#5a6577' }}>Deploy your armada across the galaxy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {missionError && (
        <div className="mx-5 mt-4">
          <div className="rounded-lg px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
            <i className="ri-error-warning-line w-5 h-5 flex items-center justify-center" style={{ color: '#f87171' }}></i>
            <p className="text-xs" style={{ color: '#f87171' }}>{missionError}</p>
            <button onClick={() => setMissionError(null)} className="ml-auto cursor-pointer">
              <i className="ri-close-line w-4 h-4 flex items-center justify-center" style={{ color: '#f87171' }}></i>
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mx-5 my-4">
        <div className="flex gap-1.5 rounded-lg p-1.5" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
          {[
            ['send', 'ri-rocket-line', 'Send Fleet'],
            ['active', 'ri-ship-line', `Active (${activeFleets.length})`],
            ['logs', 'ri-file-list-3-line', `Logs (${combatLogs.length})`],
            ['crew', 'ri-team-line', 'Crew'],
            ['insurance', 'ri-shield-check-line', `Insurance (${activePolicies.length})`],
          ].map(([tab, icon, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2.5 px-3 rounded-lg font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab ? 'text-white' : ''
              }`}
              style={activeTab === tab ? { background: 'linear-gradient(90deg, #d4a853, #e2c044)' } : { color: '#5a6577' }}>
              <i className={`${icon} mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center`}></i>{label}
            </button>
          ))}
        </div>
      </div>

      {/* Send Fleet Tab */}
      {activeTab === 'send' && (
        <div className="px-5 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Ship Selection */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-xl" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
                <div className="flex items-center px-4 py-2.5" style={{ borderBottom: '1px solid #1e2a36' }}>
                  <i className="ri-rocket-line mr-2.5 w-4 h-4 flex items-center justify-center" style={{ color: '#d4a853' }}></i>
                  <h2 className="text-xs font-bold tracking-wider" style={{ color: '#8892aa' }}>AVAILABLE SHIPS</h2>
                </div>
                <div className="p-2.5 grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {availableShips.map((ship) => {
                    const art = getShipArt(ship.name);
                    return (
                      <div key={ship.id} className="rounded-lg overflow-hidden border transition-all hover:brightness-110" style={{ background: '#080b0f', borderColor: '#1e2a36' }}>
                        <div className="relative h-24 overflow-hidden">
                          <img src={art.url} alt={art.alt} className="w-full h-full object-cover object-center"
                            style={{ filter: ship.available === 0 ? 'grayscale(70%) brightness(0.4)' : 'brightness(0.65) saturate(1.15)' }} />
                          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(8,11,15,0.88) 100%)' }} />
                          <div className="absolute top-1.5 right-1.5 text-xs px-2 py-0.5 rounded-full font-bold text-white" style={{ background: 'rgba(0,0,0,0.7)' }}>{ship.available} avail</div>
                          <div className="absolute bottom-1.5 left-2.5"><h3 className="text-xs font-black text-white drop-shadow-lg">{ship.name}</h3></div>
                        </div>
                        <div className="p-3">
                          <div className="grid grid-cols-2 gap-1.5 text-xs mb-3">
                            <div className="flex items-center gap-1"><i className="ri-speed-line w-3.5 h-3.5 flex items-center justify-center" style={{ color: '#5bc0be' }}></i><span style={{ color: '#5a6577' }}>{ship.speed.toLocaleString()}</span></div>
                            <div className="flex items-center gap-1"><i className="ri-box-3-line w-3.5 h-3.5 flex items-center justify-center" style={{ color: '#5bc0be' }}></i><span style={{ color: '#5a6577' }}>{ship.cargo.toLocaleString()}</span></div>
                            <div className="flex items-center gap-1"><i className="ri-sword-line w-3.5 h-3.5 flex items-center justify-center" style={{ color: '#f87171' }}></i><span style={{ color: '#5a6577' }}>{ship.attack}</span></div>
                            <div className="flex items-center gap-1"><i className="ri-shield-line w-3.5 h-3.5 flex items-center justify-center" style={{ color: '#5bc0be' }}></i><span style={{ color: '#5a6577' }}>{ship.shield}</span></div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input type="number" min="0" max={ship.available} value={selectedShips[ship.id] || 0}
                              onChange={(e) => handleShipSelect(ship.id, parseInt(e.target.value) || 0)}
                              className="flex-1 px-2.5 py-1.5 rounded text-xs font-semibold text-white focus:outline-none"
                              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1e2a36' }}
                              placeholder="0" disabled={ship.available === 0} />
                            <button onClick={() => handleShipSelect(ship.id, ship.available)} disabled={ship.available === 0}
                              className={`px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                                ship.available > 0 ? 'text-white hover:opacity-90' : 'cursor-not-allowed'
                              }`}
                              style={ship.available > 0 ? { background: 'linear-gradient(90deg, #d4a853, #e2c044)' } : { background: 'rgba(255,255,255,0.02)', color: '#3a4557' }}>
                              Max
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mission Selection */}
              <div className="rounded-xl" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
                <div className="flex items-center px-4 py-2.5" style={{ borderBottom: '1px solid #1e2a36' }}>
                  <i className="ri-compass-line mr-2.5 w-4 h-4 flex items-center justify-center" style={{ color: '#d4a853' }}></i>
                  <h2 className="text-xs font-bold tracking-wider" style={{ color: '#8892aa' }}>MISSION TYPE</h2>
                </div>
                <div className="p-2.5 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { name: 'Attack', icon: 'ri-sword-line', desc: 'Destroy enemy forces' },
                    { name: 'Raid', icon: 'ri-fire-line', desc: 'Quick resource grab' },
                    { name: 'Spy', icon: 'ri-user-search-line', desc: 'Gather intelligence' },
                    { name: 'Transport', icon: 'ri-truck-line', desc: 'Move resources' },
                    { name: 'Deploy', icon: 'ri-shield-line', desc: 'Station defense' },
                    { name: 'Colonize', icon: 'ri-planet-line', desc: 'Settle new world' },
                    { name: 'Harvest', icon: 'ri-recycle-line', desc: 'Collect debris' },
                    { name: 'ACS', icon: 'ri-team-line', desc: 'Alliance combat' },
                  ].map((mission) => {
                    const mc = missionHex[mission.name] || '#d4a853';
                    const isSelected = selectedMission === mission.name;
                    return (
                      <button key={mission.name} onClick={() => handleMissionSelect(mission.name)}
                        className="p-3 rounded-lg transition-all cursor-pointer text-center"
                        style={{
                          background: isSelected ? `${mc}10` : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${isSelected ? mc + '40' : '#1e2a36'}`,
                        }}>
                        <i className={`${mission.icon} text-lg w-5 h-5 mx-auto mb-1 flex items-center justify-center`} style={{ color: mc }}></i>
                        <p className="text-xs font-bold text-white mb-0.5">{mission.name}</p>
                        <p className="text-xs" style={{ color: '#5a6577', fontSize: 10 }}>{mission.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Fleet Summary Sidebar */}
            <div className="space-y-4">
              <div className="rounded-xl sticky top-6" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
                <div className="flex items-center px-4 py-2.5" style={{ borderBottom: '1px solid #1e2a36' }}>
                  <i className="ri-file-list-line mr-2.5 w-4 h-4 flex items-center justify-center" style={{ color: '#d4a853' }}></i>
                  <h2 className="text-xs font-bold tracking-wider" style={{ color: '#8892aa' }}>FLEET SUMMARY</h2>
                </div>
                <div className="p-3">
                  <div className="space-y-2.5 mb-3">
                    {[
                      ['Total Ships', totalShips, '#8892aa'],
                      ['Attack Power', totalAttack.toLocaleString(), '#f87171'],
                      ['Shield Power', totalShield.toLocaleString(), '#5bc0be'],
                      ['Cargo Capacity', totalCargo.toLocaleString(), '#d4a853'],
                      ...(estimatedTravelTime > 0 ? [
                        ['Travel Time', formatTime(estimatedTravelTime), '#7bc67e'],
                        ['ETA (Stardate)', computeCompactArrivalStardate(estimatedTravelTime), '#e2c044'],
                      ] : []),
                    ].map(([label, val, color]) => (
                      <div key={label as string} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span className="text-xs" style={{ color: '#5a6577' }}>{label as string}</span>
                        <span className="text-sm font-bold text-white">{val}</span>
                      </div>
                    ))}
                  </div>
                  {Object.keys(selectedShips).length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-bold tracking-wider mb-2" style={{ color: '#5a6577' }}>SELECTED SHIPS</p>
                      <div className="space-y-1">
                        {Object.entries(selectedShips).map(([id, count]) => {
                          const ship = availableShips.find(s => s.id === id);
                          return ship ? (
                            <div key={id} className="flex items-center justify-between text-xs">
                              <span className="text-white">{ship.name}</span>
                              <span className="font-bold" style={{ color: '#d4a853' }}>{count}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <input type="text" placeholder="Target Coordinates [X:XXX:X]"
                      value={targetCoordinates} onChange={(e) => setTargetCoordinates(e.target.value)}
                      className="w-full px-3 py-2 rounded text-xs font-semibold text-white focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1e2a36' }} />
                    <button onClick={handleLaunchFleet} disabled={totalShips === 0 || sending}
                      className={`w-full px-5 py-3 rounded-lg font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
                        totalShips > 0 && !sending ? 'text-white hover:opacity-90' : 'cursor-not-allowed'
                      }`}
                      style={totalShips > 0 && !sending ? { background: 'linear-gradient(90deg, #d4a853, #e2c044)' } : { background: 'rgba(255,255,255,0.02)', color: '#3a4557' }}>
                      <i className="ri-rocket-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center"></i>
                      {sending ? 'Launching...' : 'Launch Fleet'}
                    </button>
                    <button onClick={handleSaveTemplate}
                      className="w-full px-5 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1e2a36', color: '#8892aa' }}>
                      <i className="ri-save-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Save as Template
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Fleets Tab */}
      {activeTab === 'active' && (
        <div className="px-5 pb-6">
          {activeFleets.length === 0 ? (
            <div className="rounded-xl p-10 text-center" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
              <i className="ri-rocket-line text-4xl mb-3 w-10 h-10 mx-auto flex items-center justify-center" style={{ color: '#3a4557' }}></i>
              <h3 className="text-base font-bold text-white mb-1.5">No Active Fleets</h3>
              <p className="text-xs mb-4" style={{ color: '#5a6577' }}>Launch a fleet to see it here</p>
              <button onClick={() => setActiveTab('send')} className="px-5 py-2.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(90deg, #d4a853, #e2c044)' }}>
                Send Fleet
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeFleets.map((fleet) => {
                const progress = getFleetProgress(fleet);
                const timeRemaining = getTimeRemaining(fleet);
                const isMoving = fleet.status === 'moving';
                return (
                  <div key={fleet.id} className="rounded-xl" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-base font-bold text-white">{fleet.mission || 'Unknown'} Mission</h3>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{
                              background: isMoving ? 'rgba(91,192,190,0.1)' : 'rgba(123,198,126,0.1)',
                              border: `1px solid ${isMoving ? 'rgba(91,192,190,0.25)' : 'rgba(123,198,126,0.25)'}`,
                              color: isMoving ? '#5bc0be' : '#7bc67e'
                            }}>
                              {isMoving ? 'Traveling' : 'Returning'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs" style={{ color: '#5a6577' }}>
                            <span><i className="ri-map-pin-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center" style={{ color: '#5bc0be' }}></i>Target: {fleet.destination}</span>
                            <span><i className="ri-time-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center" style={{ color: '#e2c044' }}></i>{isMoving ? 'Arrival' : 'Return'}: {formatTime(timeRemaining / 1000)}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs mt-1">
                            <span className="font-mono" style={{ color: '#e2c044', fontSize: 10 }}>
                              <i className="ri-calendar-2-line mr-1 w-3 h-3 inline-flex items-center justify-center" style={{ color: '#d4a853' }}></i>
                              ETA: {computeCompactArrivalStardate(timeRemaining / 1000)}
                            </span>
                          </div>
                        </div>
                        {isMoving && (
                          <button onClick={() => handleRecallFleet(fleet.id)}
                            className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all"
                            style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}>
                            <i className="ri-arrow-go-back-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Recall
                          </button>
                        )}
                      </div>
                      <div className="rounded-lg p-3 mb-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <p className="text-xs font-bold tracking-wider mb-2" style={{ color: '#5a6577' }}>COMPOSITION</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {Object.entries(fleet.ships || {}).map(([shipId, count]) => {
                            const ship = availableShips.find(s => s.id === shipId);
                            return ship ? (
                              <div key={shipId} className="flex items-center gap-1.5">
                                <i className={`${ship.icon} w-3.5 h-3.5 flex items-center justify-center`} style={{ color: '#5bc0be' }}></i>
                                <span className="text-xs text-white">{ship.name}</span>
                                <span className="text-xs font-bold ml-auto" style={{ color: '#d4a853' }}>{count as number}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: '#5a6577' }}>Progress</span>
                          <span style={{ color: '#d4a853' }}>{Math.floor(progress)}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #d4a853, #e2c044)' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Combat Logs Tab */}
      {activeTab === 'logs' && (
        <div className="px-5 pb-6">
          {combatLogs.length === 0 ? (
            <div className="rounded-xl p-10 text-center" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
              <i className="ri-file-list-3-line text-4xl mb-3 w-10 h-10 mx-auto flex items-center justify-center" style={{ color: '#3a4557' }}></i>
              <h3 className="text-base font-bold text-white mb-1.5">No Combat Logs</h3>
              <p className="text-xs" style={{ color: '#5a6577' }}>Your battle history will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {combatLogs.map((log) => (
                <div key={log.id} className="rounded-xl p-4 transition-all" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-bold text-white">{log.mission} vs {log.targetPlayer}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{
                          background: log.result === 'victory' ? 'rgba(123,198,126,0.1)' : 'rgba(248,113,113,0.1)',
                          border: `1px solid ${log.result === 'victory' ? 'rgba(123,198,126,0.25)' : 'rgba(248,113,113,0.25)'}`,
                          color: log.result === 'victory' ? '#7bc67e' : '#f87171'
                        }}>
                          {log.result === 'victory' ? '✓ Victory' : '✗ Defeat'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs" style={{ color: '#5a6577' }}>
                        <span><i className="ri-map-pin-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center" style={{ color: '#5bc0be' }}></i>{log.target}</span>
                        <span><i className="ri-time-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center" style={{ color: '#5a6577' }}></i>{log.date.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    <div className="rounded-lg p-3" style={{ background: 'rgba(248,113,113,0.04)', border: '1px solid rgba(248,113,113,0.12)' }}>
                      <p className="text-xs font-bold tracking-wider mb-2" style={{ color: '#f87171' }}>YOUR LOSSES</p>
                      {Object.entries(log.attackerLosses).map(([shipType, count]) => (
                        <div key={shipType} className="flex justify-between text-xs"><span style={{ color: '#5a6577' }} className="capitalize">{shipType}:</span><span className="font-bold text-white">-{count as number}</span></div>
                      ))}
                    </div>
                    <div className="rounded-lg p-3" style={{ background: 'rgba(212,168,83,0.04)', border: '1px solid rgba(212,168,83,0.12)' }}>
                      <p className="text-xs font-bold tracking-wider mb-2" style={{ color: '#d4a853' }}>RESOURCES LOOTED</p>
                      <div className="flex justify-between text-xs"><span style={{ color: '#5a6577' }}>Metal:</span><span className="font-bold text-white">{log.loot.metal.toLocaleString()}</span></div>
                      <div className="flex justify-between text-xs"><span style={{ color: '#5a6577' }}>Crystal:</span><span className="font-bold text-white">{log.loot.crystal.toLocaleString()}</span></div>
                      <div className="flex justify-between text-xs"><span style={{ color: '#5a6577' }}>Deuterium:</span><span className="font-bold text-white">{log.loot.deuterium.toLocaleString()}</span></div>
                    </div>
                    <div className="rounded-lg p-3" style={{ background: 'rgba(91,192,190,0.04)', border: '1px solid rgba(91,192,190,0.12)' }}>
                      <p className="text-xs font-bold tracking-wider mb-2" style={{ color: '#5bc0be' }}>REWARDS</p>
                      <div className="flex justify-between text-xs"><span style={{ color: '#5a6577' }}>Experience:</span><span className="font-bold text-white">+{log.experience.toLocaleString()}</span></div>
                      <div className="flex justify-between text-xs"><span style={{ color: '#5a6577' }}>Result:</span><span className="font-bold" style={{ color: log.result === 'victory' ? '#7bc67e' : '#f87171' }}>{log.result.toUpperCase()}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Crew Tab */}
      {activeTab === 'crew' && <CrewAssignment />}

      {/* Insurance Tab */}
      {activeTab === 'insurance' && (
        <div className="px-5 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
            {[
              ['Active Policies', insuranceStats.active_policies, `of ${insuranceStats.total_policies} total`, '#7bc67e', 'ri-shield-check-line'],
              ['Premiums Paid', insuranceStats.total_premiums_paid >= 1e6 ? `${(insuranceStats.total_premiums_paid / 1e6).toFixed(1)}M` : insuranceStats.total_premiums_paid.toLocaleString(), '', '#e2c044', 'ri-money-dollar-circle-line'],
              ['Claims Filed', insuranceStats.claims_filed, `${insuranceStats.claims_approved} approved`, '#5bc0be', 'ri-file-list-3-line'],
              ['Payouts Received', insuranceStats.total_payouts_received >= 1e6 ? `${(insuranceStats.total_payouts_received / 1e6).toFixed(1)}M` : insuranceStats.total_payouts_received.toLocaleString(), '', '#34d399', 'ri-hand-coin-line'],
            ].map(([label, val, sub, color, icon]) => (
              <div key={label as string} className="rounded-lg p-4" style={{ background: `${color}06`, border: `1px solid ${(color as string) + '20'}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs" style={{ color: '#5a6577' }}>{label as string}</span>
                  <i className={`${icon} w-5 h-5 flex items-center justify-center`} style={{ color: color as string }}></i>
                </div>
                <p className="text-2xl font-black text-white">{val}</p>
                {(sub as string) && <p className="text-xs mt-0.5" style={{ color: '#3a4557' }}>{sub as string}</p>}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold tracking-wider flex items-center gap-2" style={{ color: '#8892aa' }}>
              <i className="ri-shield-star-line w-4 h-4 flex items-center justify-center" style={{ color: '#7bc67e' }}></i>INSURED FLEET SHIPS
              <span className="font-normal" style={{ color: '#5a6577' }}>{activePolicies.length} active · {policies.filter(p => p.status === 'claimed').length} claimed</span>
            </h2>
            <Link to="/insurance" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all"
              style={{ background: 'rgba(123,198,126,0.1)', border: '1px solid rgba(123,198,126,0.2)', color: '#7bc67e' }}>
              <i className="ri-external-link-line w-3.5 h-3.5 flex items-center justify-center"></i>Full Insurance Broker
            </Link>
          </div>

          {policies.length === 0 ? (
            <div className="rounded-xl p-10 text-center" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(123,198,126,0.06)', border: '1px solid rgba(123,198,126,0.15)' }}>
                <i className="ri-shield-check-line text-2xl w-8 h-8 flex items-center justify-center" style={{ color: '#7bc67e' }}></i>
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">No Insurance Policies</h3>
              <p className="text-xs mb-4 max-w-md mx-auto" style={{ color: '#5a6577' }}>Protect your fleet from combat losses. Insure your ships and get payouts when they&apos;re destroyed in battle.</p>
              <Link to="/insurance" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(90deg, #7bc67e, #34d399)' }}>
                <i className="ri-add-line w-3.5 h-3.5 flex items-center justify-center"></i>Purchase Insurance
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {policies.map((policy) => {
                const isActive = policy.status === 'active';
                const isClaimed = policy.status === 'claimed';
                const daysLeft = isActive ? Math.max(0, Math.ceil((new Date(policy.expires_at).getTime() - Date.now()) / 86400000)) : 0;
                return (
                  <div key={policy.id} className="rounded-xl p-4 border transition-all"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.006)',
                      borderColor: isActive ? '#1e2a36' : 'rgba(255,255,255,0.04)',
                      opacity: isActive ? 1 : 0.6,
                    }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white truncate">{policy.ship_name}</h3>
                        <p className="text-xs" style={{ color: '#5a6577' }}>{policy.ship_type}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ml-2 flex-shrink-0 ${isActive ? 'bg-green-400/10 text-green-400 border border-green-400/20' : isClaimed ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' : 'bg-red-400/8 text-red-400/60 border border-red-400/15'}`}>
                        {policy.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-1.5 mb-3">
                      {[
                        ['Ship Value', policy.ship_value >= 1e6 ? `${(policy.ship_value / 1e6).toFixed(1)}M` : policy.ship_value.toLocaleString()],
                        ['Coverage', `${policy.coverage_percentage}%`],
                        ['Payout Value', policy.payout_amount >= 1e6 ? `${(policy.payout_amount / 1e6).toFixed(1)}M` : policy.payout_amount.toLocaleString()],
                        ['Premium', policy.premium_paid.toLocaleString()],
                      ].map(([label, val]) => (
                        <div key={label as string} className="flex justify-between text-xs">
                          <span style={{ color: '#5a6577' }}>{label as string}</span>
                          <span className="text-white font-semibold">{val}</span>
                        </div>
                      ))}
                    </div>
                    <div className="w-full h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full" style={{
                        width: `${policy.coverage_percentage}%`,
                        background: policy.coverage_percentage >= 90 ? 'linear-gradient(90deg,#7bc67e,#34d399)' : policy.coverage_percentage >= 70 ? 'linear-gradient(90deg,#e2c044,#7bc67e)' : 'linear-gradient(90deg,#fb923c,#e2c044)'
                      }} />
                    </div>
                    <div className="flex items-center gap-2 text-xs mb-3">
                      {isActive ? (
                        <><i className={`w-3.5 h-3.5 flex items-center justify-center ${daysLeft <= 3 ? 'ri-alert-line' : 'ri-time-line'}`} style={{ color: daysLeft <= 3 ? '#f87171' : '#5a6577' }}></i>
                        <span style={{ color: daysLeft <= 3 ? '#f87171' : '#5a6577' }}>{daysLeft}d remaining</span></>
                      ) : <span style={{ color: '#3a4557' }}>{isClaimed ? 'Claim paid' : 'Expired'}</span>}
                      <span style={{ color: '#3a4557' }}>·</span>
                      <span style={{ color: '#5a6577' }}>{policy.duration_days}d policy</span>
                    </div>
                    {isActive && (
                      <div className="flex gap-1.5">
                        <button onClick={async () => { const result = await fileClaim(policy.id); if (result.success) refreshPolicies(); }}
                          disabled={processingClaim}
                          className="flex-1 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all disabled:opacity-50"
                          style={{ background: 'rgba(123,198,126,0.1)', border: '1px solid rgba(123,198,126,0.2)', color: '#7bc67e' }}>
                          <i className="ri-hand-coin-line mr-1 w-3.5 h-3.5 inline-flex items-center justify-center"></i>{processingClaim ? 'Processing...' : 'File Claim'}
                        </button>
                        <button onClick={async () => { const result = await cancelPolicy(policy.id); if (result.success) refreshPolicies(); }}
                          className="px-3 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all"
                          style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.1)', color: '#f87171' }}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}