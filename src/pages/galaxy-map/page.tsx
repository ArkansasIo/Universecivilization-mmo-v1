import { useState, useEffect, useMemo, useCallback } from 'react';
import { useUniverseGenerator } from '../../hooks/useUniverseGenerator';
import SpaceCanvas from '../../components/feature/SpaceCanvas';
import { Planet3D, Star3D, Moon3D, Galaxy3D } from '../../components/feature/Planet3D';
import StarMapViewport from '../../components/feature/StarMapViewport';
import type { StarNode, FleetMarker } from '../../components/feature/StarMapViewport';
import type { PlanetType, StarType, MoonType } from '../../components/feature/Planet3D';
import { useFleetManager } from '../../hooks/useFleetManager';
import { useGameTime, computeCompactArrivalStardate } from '../../hooks/useGameTime';
import { useAuth } from '@/contexts/AuthContext';

/* ─────────────────────────────────────────────
   TYPE HELPERS
───────────────────────────────────────────── */
function toPlanetType(raw: string): PlanetType {
  const map: Record<string, PlanetType> = {
    'Terrestrial': 'terrestrial', 'Ocean World': 'ocean', 'Desert World': 'desert',
    'Ice World': 'ice', 'Volcanic World': 'volcanic', 'Gas Giant': 'gas_giant',
    'Ice Giant': 'ice_giant', 'Lava Planet': 'lava', 'Toxic World': 'toxic',
    'Crystal World': 'crystal', 'Metal World': 'barren', 'Jungle World': 'jungle',
    'Barren World': 'barren', 'Continental': 'continental', 'Arid': 'arid',
    'Savanna': 'savanna', 'Tundra': 'tundra', 'Arctic': 'arctic',
  };
  return map[raw] ?? 'barren';
}

function toStarType(raw: string): StarType {
  const map: Record<string, StarType> = {
    'O': 'O', 'B': 'B', 'A': 'A', 'F': 'F', 'G': 'G', 'K': 'K', 'M': 'M',
    'Neutron Star': 'neutron', 'Pulsar': 'pulsar', 'White Dwarf': 'white_dwarf',
    'Red Giant': 'red_giant', 'Blue Giant': 'blue_giant',
  };
  return map[raw] ?? 'G';
}

function toMoonType(idx: number): MoonType {
  const types: MoonType[] = ['rocky', 'icy', 'volcanic', 'barren', 'metallic'];
  return types[idx % types.length];
}

function toGalaxyType(raw: string): 'spiral' | 'elliptical' | 'irregular' | 'barred-spiral' | 'lenticular' {
  const map: Record<string, any> = {
    'spiral': 'spiral', 'elliptical': 'elliptical', 'irregular': 'irregular',
    'barred-spiral': 'barred-spiral', 'lenticular': 'lenticular',
  };
  return map[raw?.toLowerCase()] ?? 'spiral';
}

/* ─────────────────────────────────────────────
   FACTION DATA
───────────────────────────────────────────── */
const FACTIONS = [
  { name: 'Stellar Empire', color: '#f87171', icon: 'ri-sword-line' },
  { name: 'Void Collective', color: '#a78bfa', icon: 'ri-eye-line' },
  { name: 'Iron Federation', color: '#60a5fa', icon: 'ri-shield-line' },
  { name: 'Merchant Guild', color: '#fbbf24', icon: 'ri-store-2-line' },
  { name: 'Nomad Clans', color: '#34d399', icon: 'ri-compass-3-line' },
];

/* ─────────────────────────────────────────────
   SYSTEM DETAIL PANEL
───────────────────────────────────────────── */
function SystemDetailPanel({
  system,
  onClose,
  onEnterSystem,
}: {
  system: any;
  onClose: () => void;
  onEnterSystem: (system: any) => void;
}) {
  const [selectedPlanet, setSelectedPlanet] = useState<any>(null);

  return (
    <div
      className="absolute top-0 right-0 bottom-0 z-20 flex flex-col overflow-hidden"
      style={{
        width: 340,
        background: 'rgba(2,4,12,0.97)',
        borderLeft: '1px solid rgba(0,212,255,0.15)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <Star3D type={toStarType(system.star.type)} size={44} animate useImage />
          <div>
            <h3 className="text-sm font-bold text-white">{system.name}</h3>
            <p className="text-xs text-gray-400">{system.star.type} Star · {system.star.temperature.toLocaleString()}K</p>
          </div>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer">
          <i className="ri-close-line text-sm"></i>
        </button>
      </div>

      {/* Star stats */}
      <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { label: 'Mass', val: `${system.star.mass.toFixed(2)} M☉`, color: 'text-white' },
            { label: 'Luminosity', val: `${system.star.luminosity.toFixed(2)} L☉`, color: 'text-amber-400' },
            { label: 'Planets', val: system.planets.length, color: 'text-cyan-400' },
            { label: 'Anomalies', val: system.anomalies.length, color: 'text-pink-400' },
          ].map((r) => (
            <div key={r.label} className="flex justify-between">
              <span className="text-gray-500">{r.label}</span>
              <span className={`font-semibold ${r.color}`}>{r.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Planets list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Planets</p>
        {system.planets.map((planet: any) => {
          const pType = toPlanetType(planet.type);
          const isSelected = selectedPlanet?.id === planet.id;
          return (
            <div key={planet.id}>
              <button
                onClick={() => setSelectedPlanet(isSelected ? null : planet)}
                className="w-full flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all text-left"
                style={{
                  background: isSelected ? 'rgba(0,180,216,0.08)' : 'rgba(255,255,255,0.02)',
                  border: isSelected ? '1px solid rgba(0,180,216,0.3)' : '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <Planet3D type={pType} size={36} animate={false} useImage />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{planet.name}</p>
                  <p className="text-xs text-cyan-400">{planet.type}</p>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">{planet.temperature}°C</span>
                    <span className={`text-xs ${planet.habitability > 0.5 ? 'text-green-400' : 'text-gray-500'}`}>
                      {(planet.habitability * 100).toFixed(0)}% hab
                    </span>
                  </div>
                </div>
                <i className={`${isSelected ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-gray-500 text-sm`}></i>
              </button>

              {/* Expanded planet detail */}
              {isSelected && (
                <div className="mt-1 ml-2 p-3 rounded-lg space-y-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className="flex justify-between"><span className="text-gray-500">Size</span><span className="text-white">{planet.size.toFixed(2)} R⊕</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Gravity</span><span className="text-white">{planet.gravity.toFixed(2)} g</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Moons</span><span className="text-cyan-400">{planet.moons.length}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Metal</span><span className="text-gray-300">{(planet.resources.metal / 1000).toFixed(0)}K</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Crystal</span><span className="text-cyan-400">{(planet.resources.crystal / 1000).toFixed(0)}K</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Deuterium</span><span className="text-green-400">{(planet.resources.deuterium / 1000).toFixed(0)}K</span></div>
                  </div>
                  {planet.moons.length > 0 && (
                    <div className="flex gap-2 flex-wrap pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      {planet.moons.slice(0, 4).map((_: any, mi: number) => (
                        <Moon3D key={mi} type={toMoonType(mi)} size={20} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Anomalies */}
        {system.anomalies.length > 0 && (
          <>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-4 mb-2">Anomalies</p>
            {system.anomalies.map((anomaly: any) => (
              <div key={anomaly.id} className="p-2 rounded-lg" style={{ background: 'rgba(247,37,133,0.04)', border: '1px solid rgba(247,37,133,0.12)' }}>
                <p className="text-xs font-semibold text-white">{anomaly.name}</p>
                <p className="text-xs text-pink-400">{anomaly.type} · Danger {anomaly.danger}/10</p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 flex-shrink-0 space-y-2" style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}>
        <button
          onClick={() => onEnterSystem(system)}
          className="w-full py-2 rounded-lg text-sm font-bold text-white whitespace-nowrap cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #00b4d8, #7209b7)' }}
        >
          <i className="ri-planet-line mr-2"></i>Enter System
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button className="py-1.5 rounded text-xs font-semibold text-amber-400 whitespace-nowrap cursor-pointer" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <i className="ri-user-search-line mr-1"></i>Spy
          </button>
          <button className="py-1.5 rounded text-xs font-semibold text-red-400 whitespace-nowrap cursor-pointer" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>
            <i className="ri-sword-line mr-1"></i>Attack
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ORRERY VIEW (Solar System)
───────────────────────────────────────────── */
function OrreryView({ system, onBack }: { system: any; onBack: () => void }) {
  const [selectedPlanet, setSelectedPlanet] = useState<any>(null);
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setTime((t) => t + 0.005), 16);
    return () => clearInterval(id);
  }, [paused]);

  const starType = toStarType(system.star.type);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#020408' }}>
      <SpaceCanvas starCount={300} showNebulae />

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer"
        style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(0,212,255,0.2)' }}
      >
        <i className="ri-arrow-left-line"></i>Galaxy Map
      </button>

      {/* System name */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 text-center">
        <h2 className="text-xl font-black text-white tracking-wider">{system.name}</h2>
        <p className="text-xs text-gray-400">{system.star.type} Star · {system.planets.length} planets</p>
      </div>

      {/* Pause button */}
      <button
        onClick={() => setPaused((p) => !p)}
        className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer"
        style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}
      >
        <i className={`${paused ? 'ri-play-line' : 'ri-pause-line'} text-sm`}></i>
      </button>

      {/* Orrery */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="relative" style={{ width: 700, height: 700 }}>
          {/* Orbit rings */}
          {system.planets.slice(0, 9).map((_: any, i: number) => {
            const orbitR = 60 + i * 62;
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: orbitR * 2,
                  height: orbitR * 2,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              />
            );
          })}

          {/* Central star */}
          <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 20 }}>
            <Star3D type={starType} size={80} animate useImage />
          </div>

          {/* Orbiting planets */}
          {system.planets.slice(0, 9).map((planet: any, i: number) => {
            const orbitR = 60 + i * 62;
            const speed = 0.3 / (i + 1);
            const angle = time * speed + (i * 137.5 * Math.PI) / 180;
            const px = Math.cos(angle) * orbitR;
            const py = Math.sin(angle) * orbitR;
            const pType = toPlanetType(planet.type);
            const pSize = planet.type === 'Gas Giant' || planet.type === 'Ice Giant' ? 32 : 22;
            const isSelected = selectedPlanet?.id === planet.id;

            return (
              <div
                key={planet.id}
                className="absolute cursor-pointer"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`,
                  zIndex: 30,
                }}
                onClick={() => setSelectedPlanet(isSelected ? null : planet)}
              >
                <Planet3D type={pType} size={pSize} animate={false} useImage selected={isSelected} />
                {/* Planet label */}
                <div
                  className="absolute text-center whitespace-nowrap"
                  style={{ top: pSize + 4, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: isSelected ? '#00d4ff' : 'rgba(200,210,230,0.6)' }}
                >
                  {planet.name.split(' ').slice(-1)[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Planet detail panel */}
      {selectedPlanet && (
        <div
          className="absolute right-4 top-16 z-30 w-72 rounded-xl overflow-hidden"
          style={{ background: 'rgba(2,4,12,0.95)', border: '1px solid rgba(0,180,216,0.3)', backdropFilter: 'blur(12px)' }}
        >
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-sm font-bold text-white">{selectedPlanet.name}</h3>
            <button onClick={() => setSelectedPlanet(null)} className="text-gray-500 hover:text-white cursor-pointer">
              <i className="ri-close-line text-sm"></i>
            </button>
          </div>
          <div className="p-4">
            <div className="flex justify-center mb-4">
              <Planet3D type={toPlanetType(selectedPlanet.type)} size={90} animate useImage />
            </div>
            <p className="text-xs text-cyan-400 text-center mb-4">{selectedPlanet.type}</p>
            <div className="space-y-1.5 text-xs mb-4">
              {[
                { label: 'Size', val: `${selectedPlanet.size.toFixed(2)} R⊕`, color: 'text-white' },
                { label: 'Gravity', val: `${selectedPlanet.gravity.toFixed(2)} g`, color: 'text-white' },
                { label: 'Temperature', val: `${selectedPlanet.temperature}°C`, color: 'text-orange-400' },
                { label: 'Habitability', val: `${(selectedPlanet.habitability * 100).toFixed(0)}%`, color: selectedPlanet.habitability > 0.6 ? 'text-green-400' : selectedPlanet.habitability > 0.3 ? 'text-amber-400' : 'text-red-400' },
                { label: 'Moons', val: selectedPlanet.moons.length, color: 'text-cyan-400' },
              ].map((r) => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-gray-500">{r.label}</span>
                  <span className={`font-semibold ${r.color}`}>{r.val}</span>
                </div>
              ))}
            </div>
            {selectedPlanet.moons.length > 0 && (
              <div className="flex gap-2 flex-wrap pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {selectedPlanet.moons.slice(0, 4).map((_: any, mi: number) => (
                  <Moon3D key={mi} type={toMoonType(mi)} size={24} label={`Moon ${mi + 1}`} />
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button className="py-1.5 rounded text-xs font-semibold text-green-400 whitespace-nowrap cursor-pointer" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <i className="ri-planet-line mr-1"></i>Colonize
              </button>
              <button className="py-1.5 rounded text-xs font-semibold text-amber-400 whitespace-nowrap cursor-pointer" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
                <i className="ri-scan-line mr-1"></i>Scan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Planet list sidebar */}
      <div
        className="absolute left-4 top-16 bottom-16 z-20 w-48 overflow-y-auto rounded-xl"
        style={{ background: 'rgba(2,4,12,0.85)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}
      >
        <div className="p-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Planets</p>
          <div className="space-y-1">
            {system.planets.slice(0, 9).map((planet: any, i: number) => {
              const pType = toPlanetType(planet.type);
              const isSelected = selectedPlanet?.id === planet.id;
              return (
                <button
                  key={planet.id}
                  onClick={() => setSelectedPlanet(isSelected ? null : planet)}
                  className="w-full flex items-center gap-2 p-1.5 rounded cursor-pointer transition-all text-left"
                  style={{
                    background: isSelected ? 'rgba(0,180,216,0.1)' : 'transparent',
                    border: isSelected ? '1px solid rgba(0,180,216,0.2)' : '1px solid transparent',
                  }}
                >
                  <Planet3D type={pType} size={24} animate={false} useImage />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">{i + 1}. {planet.name.split(' ').slice(-1)[0]}</p>
                    <p className="text-xs text-gray-500 truncate">{planet.type.split(' ')[0]}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function GalaxyMapPage() {
  const {
    selectedUniverse,
    generatedGalaxies,
    isGenerating,
    generationProgress,
    universeStats,
    generateUniverse,
    availableUniverses,
    searchStarSystems,
  } = useUniverseGenerator();

  const { user } = useAuth();
  const { activeFleets } = useFleetManager();
  const gameTime = useGameTime();

  const [selectedGalaxy, setSelectedGalaxy] = useState<any>(null);
  const [selectedSystem, setSelectedSystem] = useState<any>(null);
  const [selectedStarId, setSelectedStarId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'starmap' | 'orrery' | 'list'>('starmap');
  const [orrerySystem, setOrrerySystem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showGalaxyList, setShowGalaxyList] = useState(true);

  useEffect(() => {
    if (!selectedUniverse && availableUniverses.length > 0) {
      generateUniverse(availableUniverses[0], 8);
    }
  }, []);

  // Build StarNode list from selected galaxy
  const { stars, hyperlanes } = useMemo(() => {
    if (!selectedGalaxy) return { stars: [], hyperlanes: [] };

    const factionAssign = (idx: number) => {
      const f = FACTIONS[idx % FACTIONS.length];
      return { faction: f.name, factionColor: f.color };
    };

    const starNodes: StarNode[] = selectedGalaxy.starSystems.map((sys: any, i: number) => {
      const controlled = (i * 7 + 3) % 5 !== 0;
      const fa = factionAssign(i);
      return {
        id: sys.id,
        name: sys.name,
        x: sys.coordinates.x / 10,
        y: sys.coordinates.y / 10,
        type: sys.star.type as any,
        planets: sys.planets.length,
        habitablePlanets: sys.planets.filter((p: any) => p.habitability > 0.5).length,
        controlled,
        faction: controlled ? fa.faction : null,
        factionColor: controlled ? fa.factionColor : '#ffffff',
        hasFleet: (i * 13) % 7 === 0,
        hasStation: (i * 11) % 9 === 0,
        anomaly: sys.anomalies.length > 0,
        explored: (i * 3 + 1) % 4 !== 0,
      };
    });

    // Generate hyperlanes (connect nearby stars)
    const lanes: { from: string; to: string }[] = [];
    const added = new Set<string>();
    starNodes.forEach((s, i) => {
      // Connect to 2-3 nearest neighbors
      const distances = starNodes
        .map((t, j) => ({ j, dist: Math.hypot(t.x - s.x, t.y - s.y) }))
        .filter((d) => d.j !== i)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3);

      distances.forEach(({ j }) => {
        const key = [Math.min(i, j), Math.max(i, j)].join('-');
        if (!added.has(key)) {
          added.add(key);
          lanes.push({ from: s.id, to: starNodes[j].id });
        }
      });
    });

    return { stars: starNodes, hyperlanes: lanes };
  }, [selectedGalaxy]);

  // Real-time fleet markers mapped from active DB fleets to star positions
  const fleets: FleetMarker[] = useMemo(() => {
    if (stars.length < 2 || activeFleets.length === 0) return [];

    const now = Date.now();
    const result: FleetMarker[] = [];

    // Mission color map
    const missionColors: Record<string, string> = {
      attack: '#f87171', raid: '#fb923c', spy: '#e2c044',
      transport: '#7bc67e', deploy: '#5bc0be', colonize: '#38bdf8',
      harvest: '#d4a853', recycle: '#d4a853', acs: '#60a5fa',
    };

    activeFleets.forEach((fleet) => {
      // Parse origin coordinates
      const originMatch = fleet.origin?.match(/\[?(\d+):(\d+):(\d+)\]?/);
      const destMatch = fleet.destination?.match(/\[?(\d+):(\d+):(\d+)\]?/);

      if (!destMatch) return;

      // Map coordinate system numbers to star indices (deterministic modulo)
      const originSys = originMatch ? parseInt(originMatch[2]) : 1;
      const destSys = parseInt(destMatch[2]);

      const originIdx = (originSys * 7 + 13) % stars.length;
      const destIdx = (destSys * 7 + 13) % stars.length;

      // Don't show if origin and destination are the same star
      if (originIdx === destIdx) return;

      const originStar = stars[originIdx];
      const destStar = stars[destIdx];

      const mission = (fleet.mission || 'attack').toLowerCase();
      const color = missionColors[mission] || '#60a5fa';
      const factionLabel = fleet.mission ? fleet.mission.charAt(0).toUpperCase() + fleet.mission.slice(1) : 'Unknown';

      // Calculate real-time progress
      const departureTime = new Date(fleet.departure_time).getTime();
      const arrivalTime = new Date(fleet.arrival_time).getTime();
      const totalDuration = arrivalTime - departureTime;

      let progress = 0;
      let timeRemaining = 0;

      if (fleet.status === 'moving' && totalDuration > 0) {
        const elapsed = now - departureTime;
        progress = Math.min(Math.max(elapsed / totalDuration, 0), 0.99);
        timeRemaining = Math.max(0, Math.floor((arrivalTime - now) / 1000));
      } else if (fleet.status === 'returning' && fleet.return_time) {
        const returnTime = new Date(fleet.return_time).getTime();
        const returnElapsed = now - arrivalTime;
        const returnDuration = returnTime - arrivalTime;
        if (returnDuration > 0) {
          progress = 1 - Math.min(Math.max(returnElapsed / returnDuration, 0), 0.99);
          timeRemaining = Math.max(0, Math.floor((returnTime - now) / 1000));
        }
      }

      // Calculate total ships
      const ships = fleet.ships || {};
      const shipBreakdown: Record<string, number> = {};
      let totalShips = 0;
      Object.entries(ships as Record<string, number>).forEach(([type, count]) => {
        if (count > 0) {
          shipBreakdown[type] = count;
          totalShips += count;
        }
      });
      if (totalShips === 0) totalShips = 1;

      const etaStardate = timeRemaining > 0 ? computeCompactArrivalStardate(timeRemaining) : undefined;

      result.push({
        id: fleet.id,
        x: originStar.x,
        y: originStar.y,
        destX: destStar.x,
        destY: destStar.y,
        faction: factionLabel,
        color,
        ships: totalShips,
        progress,
        mission,
        shipBreakdown: Object.keys(shipBreakdown).length > 0 ? shipBreakdown : undefined,
        etaStardate,
        timeRemaining,
        fleetName: `${factionLabel} Fleet #${fleet.id?.toString().slice(-4) || '0'}`,
      });
    });

    return result;
  }, [stars, activeFleets]);

  const handleSelectStar = useCallback((star: any) => {
    setSelectedStarId(star?.id ?? null);
    if (star) {
      const sys = selectedGalaxy?.starSystems.find((s: any) => s.id === star.id);
      setSelectedSystem(sys ?? null);
    } else {
      setSelectedSystem(null);
    }
  }, [selectedGalaxy]);

  const handleEnterSystem = useCallback((system: any) => {
    setOrrerySystem(system);
    setViewMode('orrery');
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const results = searchStarSystems(searchQuery);
    if (results.length > 0) {
      const sys = results[0];
      const galaxy = generatedGalaxies.find((g) => g.starSystems.some((s: any) => s.id === sys.id));
      if (galaxy) {
        setSelectedGalaxy(galaxy);
        setSelectedStarId(sys.id);
        setSelectedSystem(sys);
      }
    }
  };

  if (isGenerating) {
    return (
      <div className="relative flex items-center justify-center min-h-screen overflow-hidden" style={{ background: '#020408' }}>
        <SpaceCanvas starCount={400} showNebulae />
        <div className="relative z-10 text-center">
          <div className="inline-block w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Generating Universe...</h2>
          <p className="text-gray-400 mb-4">Mapping galaxies and star systems</p>
          <div className="w-64 rounded-full h-2 mx-auto" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-2 rounded-full transition-all" style={{ width: `${generationProgress}%`, background: 'linear-gradient(90deg, #00b4d8, #7209b7)' }} />
          </div>
          <p className="text-cyan-400 mt-2 font-semibold">{Math.round(generationProgress)}%</p>
        </div>
      </div>
    );
  }

  // Orrery mode
  if (viewMode === 'orrery' && orrerySystem) {
    return (
      <div className="fixed inset-0" style={{ zIndex: 10 }}>
        <OrreryView system={orrerySystem} onBack={() => { setViewMode('starmap'); setOrrerySystem(null); }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 96px)', background: '#020408' }}>
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-2 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,212,255,0.1)', background: 'rgba(2,4,12,0.95)' }}>
        {/* Universe stats */}
        {universeStats && (
          <div className="flex gap-4 text-xs">
            {[
              { label: 'Galaxies', val: universeStats.galaxies, color: 'text-cyan-400' },
              { label: 'Systems', val: universeStats.starSystems.toLocaleString(), color: 'text-purple-400' },
              { label: 'Planets', val: universeStats.planets.toLocaleString(), color: 'text-green-400' },
              { label: 'Habitable', val: universeStats.habitablePlanets.toLocaleString(), color: 'text-emerald-400' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span className="text-gray-500">{s.label}:</span>
                <span className={`font-bold ${s.color}`}>{s.val}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex-1"></div>

        {/* Search */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search star systems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="px-3 py-1.5 rounded text-xs text-white focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', width: 200 }}
          />
          <button onClick={handleSearch} className="px-3 py-1.5 rounded text-xs font-semibold text-white whitespace-nowrap cursor-pointer" style={{ background: 'rgba(0,180,216,0.2)', border: '1px solid rgba(0,180,216,0.3)' }}>
            <i className="ri-search-line"></i>
          </button>
        </div>

        {/* View mode */}
        <div className="flex gap-1 p-0.5 rounded" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {[
            { id: 'starmap', icon: 'ri-global-line', label: 'Star Map' },
            { id: 'list', icon: 'ri-list-check', label: 'List' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setViewMode(m.id as any)}
              className="px-3 py-1 rounded text-xs font-semibold whitespace-nowrap cursor-pointer transition-all"
              style={viewMode === m.id ? { background: 'linear-gradient(135deg, #00b4d8, #7209b7)', color: '#fff' } : { color: '#6b7a95' }}
            >
              <i className={`${m.icon} mr-1`}></i>{m.label}
            </button>
          ))}
        </div>

        {/* Galaxy list toggle */}
        <button
          onClick={() => setShowGalaxyList((v) => !v)}
          className="px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7a95' }}
        >
          <i className={`ri-${showGalaxyList ? 'layout-left-2' : 'layout-left-2'}-line mr-1`}></i>
          Galaxies
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Galaxy sidebar */}
        {showGalaxyList && (
          <div className="w-56 flex-shrink-0 overflow-y-auto" style={{ borderRight: '1px solid rgba(255,255,255,0.05)', background: 'rgba(2,4,12,0.9)' }}>
            <div className="p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Galaxies</p>
              <div className="mb-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-2 py-1 rounded text-xs text-white focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <option value="all">All Types</option>
                  <option value="spiral">Spiral</option>
                  <option value="elliptical">Elliptical</option>
                  <option value="irregular">Irregular</option>
                  <option value="barred-spiral">Barred Spiral</option>
                </select>
              </div>
              <div className="space-y-1.5">
                {generatedGalaxies
                  .filter((g) => filterType === 'all' || g.type === filterType)
                  .map((galaxy, gi) => (
                    <button
                      key={galaxy.id}
                      onClick={() => { setSelectedGalaxy(galaxy); setSelectedSystem(null); setSelectedStarId(null); }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all text-left"
                      style={{
                        background: selectedGalaxy?.id === galaxy.id ? 'rgba(150,100,255,0.12)' : 'rgba(255,255,255,0.02)',
                        border: selectedGalaxy?.id === galaxy.id ? '1px solid rgba(150,100,255,0.4)' : '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      <Galaxy3D type={toGalaxyType(galaxy.type)} size={36} imageSeq={4060 + gi * 10} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{galaxy.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{galaxy.type}</p>
                        <p className="text-xs text-cyan-400">{galaxy.starSystems.length} systems</p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Main viewport area */}
        <div className="flex-1 relative overflow-hidden">
          {!selectedGalaxy ? (
            /* No galaxy selected — show universe overview */
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <SpaceCanvas starCount={400} showNebulae />
              <div className="relative z-10 text-center">
                <h2 className="text-3xl font-black text-white mb-3">Select a Galaxy</h2>
                <p className="text-gray-400 mb-8">Choose a galaxy from the sidebar to explore its star systems</p>
                <div className="flex gap-6 justify-center flex-wrap">
                  {generatedGalaxies.slice(0, 4).map((g, gi) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGalaxy(g)}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer transition-all hover:scale-105"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <Galaxy3D type={toGalaxyType(g.type)} size={80} imageSeq={4060 + gi * 10} />
                      <p className="text-sm font-bold text-white">{g.name}</p>
                      <p className="text-xs text-gray-400">{g.starSystems.length} systems</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : viewMode === 'starmap' ? (
            /* Star Map Viewport */
            <div className="relative w-full h-full">
              <StarMapViewport
                stars={stars}
                hyperlanes={hyperlanes}
                fleets={fleets}
                selectedStarId={selectedStarId}
                onSelectStar={handleSelectStar}
                onDoubleClickStar={(star) => {
                  const sys = selectedGalaxy?.starSystems.find((s: any) => s.id === star.id);
                  if (sys) handleEnterSystem(sys);
                }}
              />

              {/* System detail panel */}
              {selectedSystem && (
                <SystemDetailPanel
                  system={selectedSystem}
                  onClose={() => { setSelectedSystem(null); setSelectedStarId(null); }}
                  onEnterSystem={handleEnterSystem}
                />
              )}

              {/* Faction legend */}
              <div
                className="absolute bottom-14 left-4 z-20 p-3 rounded-lg"
                style={{ background: 'rgba(2,4,12,0.85)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Factions</p>
                <div className="space-y-1">
                  {FACTIONS.map((f) => (
                    <div key={f.name} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: f.color }}></div>
                      <span className="text-gray-300">{f.name}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-xs mt-1 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0 bg-gray-600"></div>
                    <span className="text-gray-500">Unexplored</span>
                  </div>
                </div>
                {/* Live fleets counter */}
                {fleets.length > 0 && (
                  <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(0,212,255,0.12)' }}>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full flex-shrink-0 bg-cyan-400 animate-pulse"></div>
                      <span className="text-cyan-400 font-semibold">{fleets.length} Live Fleet{fleets.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* List view */
            <div className="overflow-y-auto h-full p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {selectedGalaxy.starSystems.map((system: any) => {
                  const starType = toStarType(system.star.type);
                  return (
                    <div
                      key={system.id}
                      className="rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.01]"
                      style={{
                        background: selectedSystem?.id === system.id ? 'rgba(0,180,216,0.06)' : 'rgba(255,255,255,0.02)',
                        border: selectedSystem?.id === system.id ? '1px solid rgba(0,180,216,0.3)' : '1px solid rgba(255,255,255,0.06)',
                      }}
                      onClick={() => { setSelectedSystem(system); setSelectedStarId(system.id); }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Star3D type={starType} size={48} animate={false} useImage />
                        <div>
                          <h4 className="text-sm font-bold text-white">{system.name}</h4>
                          <p className="text-xs text-gray-400">{system.star.type} · {system.star.temperature.toLocaleString()}K</p>
                          <p className="text-xs text-cyan-400">{system.planets.length} planets · {system.anomalies.length} anomalies</p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {system.planets.slice(0, 5).map((p: any, pi: number) => (
                          <Planet3D key={pi} type={toPlanetType(p.type)} size={24} animate={false} useImage />
                        ))}
                        {system.planets.length > 5 && (
                          <span className="text-xs text-gray-500 self-center">+{system.planets.length - 5}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEnterSystem(system); }}
                        className="mt-3 w-full py-1.5 rounded text-xs font-semibold text-white whitespace-nowrap cursor-pointer"
                        style={{ background: 'linear-gradient(135deg, #00b4d8, #7209b7)' }}
                      >
                        Enter System
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
