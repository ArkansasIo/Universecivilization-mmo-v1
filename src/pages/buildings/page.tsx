import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useBuildingQueue } from '@/hooks/useBuildingQueue';
import { calculateBuildingCost, calculateBuildTime, formatTime, formatNumber } from '@/utils/gameCalculations';
import { getBuildingArt } from '@/data/gameArtwork';
import ColonySelector, { Planet } from '@/pages/buildings/components/ColonySelector';
import PageLoading from '@/components/PageLoading';

interface Building {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: string;
  level: number;
}

const buildingsList: Building[] = [
  { id: 'metal_mine', name: 'Metal Mine', type: 'resource', description: 'Produces metal resources each hour', icon: 'ri-hammer-line', level: 0 },
  { id: 'crystal_mine', name: 'Crystal Mine', type: 'resource', description: 'Produces crystal resources each hour', icon: 'ri-sparkling-line', level: 0 },
  { id: 'deuterium_synthesizer', name: 'Deuterium Synthesizer', type: 'resource', description: 'Produces deuterium fuel from water', icon: 'ri-flask-line', level: 0 },
  { id: 'solar_plant', name: 'Solar Plant', type: 'energy', description: 'Generates baseline solar energy', icon: 'ri-sun-line', level: 0 },
  { id: 'fusion_reactor', name: 'Fusion Reactor', type: 'energy', description: 'Advanced high-output energy generation', icon: 'ri-flashlight-line', level: 0 },
  { id: 'robotics_factory', name: 'Robotics Factory', type: 'facility', description: 'Speeds up all construction on planet', icon: 'ri-robot-line', level: 0 },
  { id: 'shipyard', name: 'Shipyard', type: 'facility', description: 'Unlocks ship and defense construction', icon: 'ri-rocket-line', level: 0 },
  { id: 'research_lab', name: 'Research Lab', type: 'facility', description: 'Research and unlock new technologies', icon: 'ri-test-tube-line', level: 0 },
  { id: 'metal_storage', name: 'Metal Storage', type: 'storage', description: 'Increases maximum metal capacity', icon: 'ri-database-2-line', level: 0 },
  { id: 'crystal_storage', name: 'Crystal Storage', type: 'storage', description: 'Increases maximum crystal capacity', icon: 'ri-database-2-line', level: 0 },
  { id: 'deuterium_tank', name: 'Deuterium Tank', type: 'storage', description: 'Increases deuterium storage capacity', icon: 'ri-database-2-line', level: 0 },
  { id: 'nanite_factory', name: 'Nanite Factory', type: 'facility', description: 'Drastically reduces all build times', icon: 'ri-cpu-line', level: 0 },
];

const typeColors: Record<string, string> = {
  resource: '#d4a853',
  energy: '#e2c044',
  facility: '#5bc0be',
  storage: '#a78bfa',
};
const typeIcons: Record<string, string> = {
  resource: 'ri-hammer-line',
  energy: 'ri-flashlight-line',
  facility: 'ri-building-2-line',
  storage: 'ri-database-2-line',
};
const typeBarGradients: Record<string, string> = {
  resource: 'linear-gradient(90deg, #d4a853, #e2c044)',
  energy: 'linear-gradient(90deg, #e2c044, #fbbf24)',
  facility: 'linear-gradient(90deg, #5bc0be, #7bc67e)',
  storage: 'linear-gradient(90deg, #a78bfa, #b98cd6)',
};

export default function BuildingsPage() {
  const { user } = useAuth();
  const { resources, canAfford, deductResources } = useResources();

  const [planets, setPlanets] = useState<Planet[]>([]);
  const [planetId, setPlanetId] = useState<number | undefined>(undefined);
  const [buildings, setBuildings] = useState<Building[]>(buildingsList.map(b => ({ ...b })));
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [, setTick] = useState(0);

  const { queue, addToQueue, cancelBuilding } = useBuildingQueue(planetId);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  }, []);

  useEffect(() => {
    if (!user) { setLoadingPage(false); return; }
    const fetchPlanets = async () => {
      const { data, error: pErr } = await supabase
        .from('planets')
        .select('id, name, planet_type, position_galaxy, position_system, position_planet, is_capital, is_homeworld, fields_used, fields_max, diameter, temperature, image_url, coordinates')
        .eq('player_id', user.id)
        .order('is_capital', { ascending: false })
        .order('is_homeworld', { ascending: false })
        .order('created_at', { ascending: true });
      if (pErr) { setError('Failed to load planet data'); setLoadingPage(false); return; }
      if (!data || data.length === 0) { setError('No planets found. Complete empire creation first.'); setLoadingPage(false); return; }
      const mapped: Planet[] = data.map(row => ({
        id: row.id, name: row.name ?? `Planet ${row.id}`, planet_type: row.planet_type ?? 'barren',
        position_galaxy: row.position_galaxy ?? 1, position_system: row.position_system ?? 1, position_planet: row.position_planet ?? 1,
        is_capital: row.is_capital ?? false, is_homeworld: row.is_homeworld ?? false,
        fields_used: row.fields_used ?? 0, fields_max: row.fields_max ?? 163,
        diameter: row.diameter ?? 0, temperature: row.temperature ?? 0, image_url: row.image_url ?? null, coordinates: row.coordinates ?? null,
      }));
      setPlanets(mapped);
      const capital = mapped.find(p => p.is_capital);
      const homeworld = mapped.find(p => p.is_homeworld);
      setPlanetId((capital ?? homeworld ?? mapped[0]).id);
      setLoadingPage(false);
    };
    fetchPlanets();
  }, [user]);

  useEffect(() => {
    if (!user || planetId === undefined) return;
    setLoadingBuildings(true);
    const fetchBuildings = async () => {
      const { data, error: bErr } = await supabase
        .from('buildings')
        .select('building_type, level')
        .eq('player_id', user.id)
        .eq('planet_id', planetId);
      if (bErr) { setLoadingBuildings(false); return; }
      const map: Record<string, number> = {};
      (data || []).forEach(row => { map[row.building_type] = row.level; });
      setBuildings(buildingsList.map(b => ({ ...b, level: map[b.id] ?? 0 })));
      setLoadingBuildings(false);
    };
    fetchBuildings();
    const channel = supabase
      .channel(`bld-levels-${planetId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'buildings', filter: `player_id=eq.${user.id}` }, (payload) => {
        const row = payload.new as any;
        if (!row || row.planet_id !== planetId) return;
        setBuildings(prev => prev.map(b => b.id === row.building_type ? { ...b, level: row.level } : b));
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, planetId]);

  const buildingsMap = useMemo(() => {
    const m: Record<string, number> = {};
    buildings.forEach(b => { m[b.id] = b.level; });
    return m;
  }, [buildings]);

  const selectedPlanet = useMemo(() => planets.find(p => p.id === planetId), [planets, planetId]);

  const handleUpgrade = useCallback(async (building: Building) => {
    if (!user || planetId === undefined) return;
    const nextLevel = building.level + 1;
    const cost = calculateBuildingCost(building.id, nextLevel);
    const buildTime = calculateBuildTime(building.id, nextLevel, buildingsMap.robotics_factory ?? 0, buildingsMap.nanite_factory ?? 0);
    if (!canAfford(cost)) { showToast('Insufficient resources!'); return; }
    const alreadyUpgrading = queue.some(q => q.building_type === building.id);
    if (alreadyUpgrading) { showToast('Already upgrading this building!'); return; }
    if (queue.length > 0) { showToast('Build queue is full — wait for current upgrade to finish.'); return; }
    setUpgrading(building.id);
    try {
      await deductResources(cost);
      const result = await addToQueue(building.id, nextLevel, cost, buildTime);
      if (result.success) {
        showToast(`Upgrading ${building.name} to Level ${nextLevel} (${formatTime(buildTime)})`);
      } else {
        showToast(result.message ?? 'Failed to start upgrade');
      }
    } finally { setUpgrading(null); }
  }, [user, planetId, queue, buildingsMap, canAfford, deductResources, addToQueue, showToast]);

  if (loadingPage) {
    return <PageLoading message="Loading buildings..." className="h-64 text-[#d4a853]" />;
  }

  if (error) {
    return (
      <div className="px-5 py-8">
        <div className="rounded-lg p-6 text-center" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
          <i className="ri-error-warning-line text-3xl mb-3 block w-8 h-8 mx-auto flex items-center justify-center" style={{ color: '#f87171' }}></i>
          <h2 className="text-lg font-bold mb-2 text-white">Error Loading Buildings</h2>
          <p className="text-xs mb-4" style={{ color: '#6b7a95' }}>{error}</p>
          <button onClick={() => window.location.reload()} className="px-5 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all hover:brightness-110 text-white" style={{ background: 'linear-gradient(90deg, #d4a853, #e2c044)' }}>Retry</button>
        </div>
      </div>
    );
  }

  const typeStats = ['resource', 'energy', 'facility', 'storage'].map(t => {
    const group = buildings.filter(b => b.type === t);
    return { type: t, count: group.length, avgLevel: Math.round(group.reduce((s, b) => s + b.level, 0) / Math.max(group.length, 1)) };
  });

  const totalBuildingLevel = buildings.reduce((s, b) => s + b.level, 0);
  const constructionSystems = [
    {
      id: 'robotics_factory',
      label: 'Robotics Factory',
      route: '/buildings',
      level: buildingsMap.robotics_factory ?? 0,
      icon: 'ri-robot-line',
      color: '#34d399',
      detail: 'Planetary construction speed',
    },
    {
      id: 'shipyard',
      label: 'Shipyard',
      route: '/shipyard',
      level: buildingsMap.shipyard ?? 0,
      icon: 'ri-rocket-2-line',
      color: '#5bc0be',
      detail: 'Starship construction yard',
    },
    {
      id: 'nanite_factory',
      label: 'Nanite Factory',
      route: '/buildings',
      level: buildingsMap.nanite_factory ?? 0,
      icon: 'ri-cpu-line',
      color: '#a78bfa',
      detail: 'Advanced assembly acceleration',
    },
    {
      id: 'power_grid',
      label: 'Power Grid',
      route: '/power-grid',
      level: (buildingsMap.solar_plant ?? 0) + (buildingsMap.fusion_reactor ?? 0),
      icon: 'ri-flashlight-line',
      color: '#e2c044',
      detail: 'Energy supply for build systems',
    },
  ];

  return (
    <div style={{ color: '#8892aa' }}>
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-xs font-semibold shadow-lg transition-all max-w-sm"
          style={{ background: 'linear-gradient(135deg, #111922, #1a2035)', border: '1px solid rgba(212,168,83,0.4)', color: '#d4a853' }}>
          <i className="ri-information-line mr-2 w-3.5 h-3.5 inline-flex items-center justify-center"></i>{toastMsg}
        </div>
      )}

      {/* HERO */}
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <img
          src="https://readdy.ai/api/search-image?query=futuristic%20planetary%20construction%20site%20massive%20industrial%20structures%20robotic%20arms%20building%20mining%20facilities%20energy%20plants%20dark%20moody%20atmosphere%20sci-fi%20game%20art%20cinematic%20wide%20angle%20aerial%20view%20dramatic%20low%20lighting&width=1920&height=400&seq=buildings_hero_v3&orientation=landscape"
          alt="Buildings"
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ filter: 'brightness(0.4)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(7,10,16,0.95) 100%)' }} />
        <div className="relative z-10 h-full flex items-end px-6 pb-5">
          <div className="flex items-end justify-between w-full">
            <div>
              <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Planetary Buildings</h1>
              <p className="text-sm" style={{ color: '#5a6577' }}>Construct and upgrade your infrastructure</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs" style={{ color: '#5a6577' }}>Infrastructure Power</p>
                <p className="text-2xl font-black" style={{ color: '#d4a853' }}>{totalBuildingLevel.toLocaleString()}</p>
              </div>
              <div className="w-px h-10" style={{ background: 'rgba(255,255,255,0.06)' }}></div>
              {typeStats.map(ts => (
                <div key={ts.type} className="text-right hidden lg:block">
                  <p className="text-xs capitalize" style={{ color: '#3a4557' }}>{ts.type}</p>
                  <p className="text-sm font-bold" style={{ color: typeColors[ts.type] }}>Avg Lv.{ts.avgLevel}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        {/* Colony Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 p-4 rounded-xl" style={{ background: 'rgba(212,168,83,0.03)', border: '1px solid rgba(212,168,83,0.12)' }}>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 flex items-center justify-center">
              <i className="ri-planet-line text-lg w-5 h-5 flex items-center justify-center" style={{ color: '#d4a853' }}></i>
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider" style={{ color: '#8892aa' }}>ACTIVE COLONY</p>
              <p className="text-xs" style={{ color: '#5a6577', fontSize: 10 }}>Switch to manage another planet&apos;s buildings</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <ColonySelector planets={planets} selectedPlanetId={planetId} onSelect={(id) => { if (id !== planetId) { setPlanetId(id); setBuildings(buildingsList.map(b => ({ ...b }))); } }} />
            {selectedPlanet && (
              <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: '#5a6577' }}>
                <span className="flex items-center gap-1"><i className="ri-map-pin-line w-3.5 h-3.5 flex items-center justify-center" style={{ color: '#5bc0be' }}></i>[{selectedPlanet.position_galaxy}:{selectedPlanet.position_system}:{selectedPlanet.position_planet}]</span>
                <span className="flex items-center gap-1"><i className="ri-grid-line w-3.5 h-3.5 flex items-center justify-center" style={{ color: '#e2c044' }}></i>{selectedPlanet.fields_used ?? 0}/{selectedPlanet.fields_max ?? 163}</span>
                {selectedPlanet.diameter > 0 && <span className="flex items-center gap-1"><i className="ri-pie-chart-line w-3.5 h-3.5 flex items-center justify-center" style={{ color: '#7bc67e' }}></i>{selectedPlanet.diameter.toLocaleString()} km</span>}
                {selectedPlanet.temperature !== 0 && <span className="flex items-center gap-1"><i className="ri-temp-hot-line w-3.5 h-3.5 flex items-center justify-center" style={{ color: '#f87171' }}></i>{selectedPlanet.temperature > 0 ? `+${selectedPlanet.temperature}` : selectedPlanet.temperature}°C</span>}
                {planets.length > 1 && <span style={{ color: '#3a4557' }}>({planets.length} colonies total)</span>}
              </div>
            )}
          </div>
        </div>

        {loadingBuildings && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 mb-3" style={{ borderColor: '#d4a853' }}></div>
              <p className="text-xs" style={{ color: '#8892aa' }}>Loading planet buildings...</p>
            </div>
          </div>
        )}

        {!loadingBuildings && (
          <>
            <div className="mb-4 rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid #1e2a36' }}>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#d4a853' }}>Construction Systems</p>
                  <h2 className="text-xl font-black text-white">Factories, Shipyards, and Build Lanes</h2>
                </div>
                <div className="rounded-lg px-3 py-2 text-xs font-bold" style={{ background: 'rgba(212,168,83,0.08)', color: '#d4a853', border: '1px solid rgba(212,168,83,0.2)' }}>
                  Infrastructure Power {totalBuildingLevel.toLocaleString()}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                {constructionSystems.map(system => (
                  <Link
                    key={system.id}
                    to={system.route}
                    className="rounded-lg p-3 transition hover:brightness-125"
                    style={{ background: `${system.color}08`, border: `1px solid ${system.color}20` }}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${system.color}14` }}>
                        <i className={`${system.icon} text-lg`} style={{ color: system.color }} />
                      </div>
                      <span className="text-xs font-black" style={{ color: system.color }}>Lv.{system.level}</span>
                    </div>
                    <p className="text-sm font-bold text-white">{system.label}</p>
                    <p className="mt-1 text-xs leading-5" style={{ color: '#5a6577' }}>{system.detail}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* ALC Power Systems Context Bar */}
            <div className="mb-4 p-3 rounded-xl flex items-center gap-3" style={{ background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.15)' }}>
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
                    Solar Lv.{buildingsMap.solar_plant ?? 0}
                  </span>
                  <span className="text-xs" style={{ color: '#5a6577' }}>
                    Fusion Lv.{buildingsMap.fusion_reactor ?? 0}
                  </span>
                  <span className="text-xs text-transparent bg-clip-text font-semibold" style={{ backgroundImage: 'linear-gradient(90deg, #06b6d4, #22d3ee)' }}>
                    {(buildingsMap.solar_plant ?? 0) * 75 + (buildingsMap.fusion_reactor ?? 0) * 250} MW
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

            {/* Active Build Queue */}
            {queue.length > 0 && (
              <div className="mb-4 p-4 rounded-xl" style={{ background: 'rgba(212,168,83,0.03)', border: '1px solid rgba(212,168,83,0.15)' }}>
                <h2 className="text-xs font-bold tracking-wider mb-3 flex items-center gap-2" style={{ color: '#8892aa' }}>
                  <i className="ri-time-line w-4 h-4 flex items-center justify-center" style={{ color: '#d4a853' }}></i>BUILD QUEUE
                  <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(212,168,83,0.12)', color: '#d4a853' }}>{queue.length}</span>
                </h2>
                <div className="space-y-2">
                  {queue.map((item, index) => {
                    const finish = item.upgrade_finish ? new Date(item.upgrade_finish).getTime() : Date.now();
                    const approxStart = finish - item.build_time * 1000;
                    const totalMs = finish - approxStart;
                    const elapsed = Date.now() - approxStart;
                    const progress = Math.min(100, Math.max(0, (elapsed / totalMs) * 100));
                    const secLeft = Math.max(0, Math.floor((finish - Date.now()) / 1000));
                    return (
                      <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <span className="text-xs font-bold w-4" style={{ color: '#d4a853' }}>#{index + 1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-white font-semibold capitalize">{item.building_type.replace(/_/g, ' ')} → Lv.{item.target_level}</span>
                            <span className="font-mono" style={{ color: '#e2c044' }}>{Math.floor(secLeft / 3600) > 0 ? `${Math.floor(secLeft / 3600)}h ` : ''}{Math.floor((secLeft % 3600) / 60)}m {secLeft % 60}s</span>
                          </div>
                          <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-1.5 rounded-full transition-all" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #d4a853, #e2c044)' }} />
                          </div>
                        </div>
                        <button onClick={() => cancelBuilding(item.id)} className="text-xs cursor-pointer whitespace-nowrap px-2 py-1 rounded transition-all" style={{ background: 'rgba(248,113,113,0.08)', color: '#f87171' }}>Cancel</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Type overview cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {typeStats.map(ts => (
                <div key={ts.type} className="rounded-lg p-3.5" style={{ background: `${typeColors[ts.type]}06`, border: `1px solid ${typeColors[ts.type]}18` }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${typeColors[ts.type]}12` }}>
                      <i className={`${typeIcons[ts.type]} text-base w-4 h-4 flex items-center justify-center`} style={{ color: typeColors[ts.type] }}></i>
                    </div>
                    <div>
                      <p className="text-xs capitalize" style={{ color: '#5a6577' }}>{ts.type}</p>
                      <p className="text-base font-black text-white">{ts.count} <span className="text-xs" style={{ color: '#3a4557' }}>buildings</span></p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs" style={{ color: '#5a6577' }}>
                    Avg Level: <span className="font-bold" style={{ color: typeColors[ts.type] }}>{ts.avgLevel}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Buildings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {buildings.map((building) => {
                const nextLevel = building.level + 1;
                const cost = calculateBuildingCost(building.id, nextLevel);
                const buildTime = calculateBuildTime(building.id, nextLevel, buildingsMap.robotics_factory ?? 0, buildingsMap.nanite_factory ?? 0);
                const affordable = canAfford(cost);
                const isInQueue = queue.some(q => q.building_type === building.id);
                const isQueueFull = queue.length > 0;
                const art = getBuildingArt(building.id);
                const tc = typeColors[building.type] ?? typeColors.facility;
                const tbg = typeBarGradients[building.type] ?? typeBarGradients.facility;

                return (
                  <div key={building.id} className="rounded-xl overflow-hidden border transition-all hover:brightness-110"
                    style={{ background: '#080b0f', borderColor: isInQueue ? 'rgba(212,168,83,0.3)' : '#1e2a36' }}>
                    <div className="relative h-32 overflow-hidden">
                      <img src={art.url} alt={art.alt} className="w-full h-full object-cover object-top"
                        style={{ filter: building.level === 0 ? 'grayscale(50%) brightness(0.5)' : 'brightness(0.7) saturate(1.1)' }} />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(8,11,15,0.9) 100%)' }} />
                      {isInQueue && (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(212,168,83,0.08)' }}>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(212,168,83,0.4)', color: '#d4a853' }}>
                            <i className="ri-loader-4-line animate-spin w-3.5 h-3.5 flex items-center justify-center"></i>Upgrading
                          </div>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-black text-white" style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(212,168,83,0.3)' }}>Lv.{building.level}</div>
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold capitalize" style={{ background: `${tc}15`, color: tc, border: `1px solid ${tc}30` }}>{building.type}</div>
                      <div className="absolute bottom-2 left-3 right-3"><h3 className="text-sm font-black text-white drop-shadow-lg">{building.name}</h3></div>
                    </div>
                    <div className="p-3.5">
                      <p className="text-xs mb-3 leading-relaxed" style={{ color: '#6b7a95' }}>{building.description}</p>
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: '#5a6577' }}>Level Progress</span>
                          <span style={{ color: tc }}>{building.level} → {nextLevel}</span>
                        </div>
                        <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${Math.min((building.level / 30) * 100, 100)}%`, background: tbg }} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 mb-3">
                        <div className="flex items-center justify-between px-2 py-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.02)' }}>
                          <span style={{ color: '#5a6577' }}>Metal</span>
                          <span className={cost.metal <= resources.metal ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>{formatNumber(cost.metal)}</span>
                        </div>
                        <div className="flex items-center justify-between px-2 py-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.02)' }}>
                          <span style={{ color: '#5a6577' }}>Crystal</span>
                          <span className={cost.crystal <= resources.crystal ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>{formatNumber(cost.crystal)}</span>
                        </div>
                        {cost.deuterium > 0 && (
                          <div className="flex items-center justify-between px-2 py-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <span style={{ color: '#5a6577' }}>Deuterium</span>
                            <span className={cost.deuterium <= resources.deuterium ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>{formatNumber(cost.deuterium)}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between px-2 py-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.02)' }}>
                          <span style={{ color: '#5a6577' }}>Time</span>
                          <span className="font-semibold" style={{ color: '#e2c044' }}>{formatTime(buildTime)}</span>
                        </div>
                      </div>
                      <button onClick={() => handleUpgrade(building)}
                        disabled={!affordable || isInQueue || isQueueFull || upgrading === building.id}
                        className={`w-full py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${affordable && !isInQueue && !isQueueFull ? 'text-white cursor-pointer hover:opacity-90' : 'text-gray-500 cursor-not-allowed'}`}
                        style={affordable && !isInQueue && !isQueueFull ? { background: 'linear-gradient(90deg, #d4a853, #e2c044)' } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        {upgrading === building.id ? (<><i className="ri-loader-4-line mr-1 animate-spin w-3.5 h-3.5 inline-flex items-center justify-center"></i>Starting...</>)
                          : isInQueue ? (<><i className="ri-loader-4-line mr-1 animate-spin w-3.5 h-3.5 inline-flex items-center justify-center"></i>Upgrading...</>)
                            : isQueueFull ? (<><i className="ri-time-line mr-1 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Queue Full</>)
                              : !affordable ? (<><i className="ri-close-circle-line mr-1 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Insufficient</>)
                                : (<><i className="ri-arrow-up-line mr-1 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Upgrade to Lv.{nextLevel}</>)}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
