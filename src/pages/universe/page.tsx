import { useState } from 'react';
import { useInterstellarObjects } from '../../hooks/useInterstellarObjects';
import SpaceCanvas from '../../components/feature/SpaceCanvas';
import { Galaxy3D, Planet3D, Star3D } from '../../components/feature/Planet3D';
import type { PlanetType, StarType } from '../../components/feature/Planet3D';
import PageLoading from '@/components/PageLoading';

export default function UniversePage() {
  const {
    objects,
    phenomena,
    anomalies,
    missions,
    loading,
    currentUniverse,
    setCurrentUniverse,
    scanObject,
    harvestResources,
    investigateAnomaly,
  } = useInterstellarObjects();

  const [activeTab, setActiveTab] = useState<'universes' | 'galaxies' | 'objects' | 'phenomena' | 'anomalies' | 'missions'>('universes');

  const [objectFilter, setObjectFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniverse, setSelectedUniverse] = useState<any>(null);
  const [selectedGalaxy, setSelectedGalaxy] = useState<any>(null);
  const [, setSelectedObject] = useState<any>(null);

  const universes = [
    { id: 'universe-alpha', name: 'Universe Alpha', type: 'Standard', status: 'discovered', players: 15420, galaxies: 8, description: 'A balanced universe with standard physics and moderate resources.', characteristics: ['Balanced resources', 'Moderate NPC activity', 'Standard physics'], dangerLevel: 5, galaxyType: 'spiral' as const, imageSeq: 4001 },
    { id: 'universe-beta', name: 'Universe Beta', type: 'Hostile', status: 'discovered', players: 8930, galaxies: 8, description: 'A dangerous universe with increased pirate activity and scarce resources.', characteristics: ['Scarce resources', 'High pirate activity', 'Frequent cosmic storms'], dangerLevel: 8, galaxyType: 'barred-spiral' as const, imageSeq: 4011 },
    { id: 'universe-gamma', name: 'Universe Gamma', type: 'Peaceful', status: 'discovered', players: 12100, galaxies: 8, description: 'A peaceful universe with abundant resources and no hostile NPCs.', characteristics: ['Abundant resources', 'No hostile NPCs', 'Enhanced trade'], dangerLevel: 2, galaxyType: 'elliptical' as const, imageSeq: 4021 },
    { id: 'universe-delta', name: 'Universe Delta', type: 'Ancient', status: 'locked', players: 0, galaxies: 8, description: 'An ancient universe filled with mysterious artifacts and powerful relics.', characteristics: ['Ancient artifacts', 'Mysterious anomalies', 'Powerful relics'], dangerLevel: 7, galaxyType: 'lenticular' as const, imageSeq: 4031 },
    { id: 'universe-epsilon', name: 'Universe Epsilon', type: 'Void', status: 'locked', players: 0, galaxies: 8, description: 'A void universe with extreme danger and rare exotic materials.', characteristics: ['Extreme danger', 'Rare exotic materials', 'Unstable space-time'], dangerLevel: 10, galaxyType: 'irregular' as const, imageSeq: 4041 },
    { id: 'universe-zeta', name: 'Universe Zeta', type: 'Experimental', status: 'locked', players: 0, galaxies: 8, description: 'An experimental universe with altered physics and unique phenomena.', characteristics: ['Altered physics', 'Unique phenomena', 'Unpredictable events'], dangerLevel: 6, galaxyType: 'spiral' as const, imageSeq: 4051 },
  ];

  const galaxies = [
    { id: 'g1', name: 'Andromeda Prime', type: 'spiral' as const, sectors: 500, systems: 5000, planets: 25000, explored: 45, dangerLevel: 4, resources: ['Metal', 'Crystal', 'Deuterium'], starType: 'G' as StarType, imageSeq: 4061 },
    { id: 'g2', name: 'Milky Way Nexus', type: 'barred-spiral' as const, sectors: 450, systems: 4500, planets: 22500, explored: 62, dangerLevel: 3, resources: ['Metal', 'Crystal', 'Dark Matter'], starType: 'F' as StarType, imageSeq: 4071 },
    { id: 'g3', name: 'Triangulum Expanse', type: 'spiral' as const, sectors: 380, systems: 3800, planets: 19000, explored: 38, dangerLevel: 6, resources: ['Crystal', 'Antimatter', 'Exotic Matter'], starType: 'B' as StarType, imageSeq: 4081 },
    { id: 'g4', name: 'Centaurus Cluster', type: 'elliptical' as const, sectors: 520, systems: 5200, planets: 26000, explored: 28, dangerLevel: 7, resources: ['Deuterium', 'Dark Matter', 'Antimatter'], starType: 'K' as StarType, imageSeq: 4091 },
    { id: 'g5', name: 'Phoenix Nebula', type: 'irregular' as const, sectors: 290, systems: 2900, planets: 14500, explored: 71, dangerLevel: 5, resources: ['Metal', 'Deuterium', 'Exotic Matter'], starType: 'M' as StarType, imageSeq: 4101 },
    { id: 'g6', name: 'Draco Void', type: 'spiral' as const, sectors: 410, systems: 4100, planets: 20500, explored: 19, dangerLevel: 9, resources: ['Dark Matter', 'Antimatter', 'Void Crystals'], starType: 'O' as StarType, imageSeq: 4111 },
    { id: 'g7', name: 'Orion Frontier', type: 'barred-spiral' as const, sectors: 470, systems: 4700, planets: 23500, explored: 54, dangerLevel: 4, resources: ['Metal', 'Crystal', 'Deuterium'], starType: 'A' as StarType, imageSeq: 4121 },
    { id: 'g8', name: 'Pegasus Reach', type: 'spiral' as const, sectors: 330, systems: 3300, planets: 16500, explored: 42, dangerLevel: 6, resources: ['Crystal', 'Dark Matter', 'Exotic Matter'], starType: 'red_giant' as StarType, imageSeq: 4131 },
  ];

  // Featured celestial bodies for the showcase
  const featuredPlanets: { type: PlanetType; name: string; class: string }[] = [
    { type: 'terrestrial', name: 'Kerath IV', class: 'Continental' },
    { type: 'gas_giant', name: 'Vora Prime', class: 'Gas Giant' },
    { type: 'volcanic', name: 'Ignis Rex', class: 'Volcanic' },
    { type: 'ocean', name: 'Aqua Mundi', class: 'Ocean World' },
    { type: 'ice', name: 'Glacius VII', class: 'Ice World' },
    { type: 'crystal', name: 'Prisma', class: 'Crystal World' },
    { type: 'jungle', name: 'Verdania', class: 'Jungle World' },
    { type: 'desert', name: 'Desh Minor', class: 'Desert World' },
  ];

  const featuredStars: { type: StarType; name: string; class: string }[] = [
    { type: 'G', name: 'Sol Prime', class: 'Yellow Dwarf' },
    { type: 'red_giant', name: 'Aldebaran X', class: 'Red Giant' },
    { type: 'blue_giant', name: 'Rigel Alpha', class: 'Blue Giant' },
    { type: 'black_hole', name: 'Void Nexus', class: 'Black Hole' },
    { type: 'pulsar', name: 'PSR-7742', class: 'Pulsar' },
    { type: 'O', name: 'Zeta Orionis', class: 'Blue Supergiant' },
  ];

  const handleScanObject = async (objectId: string) => {
    try { await scanObject(objectId); } catch { /* ignore */ }
  };

  const handleHarvestObject = async (objectId: string) => {
    try { await harvestResources(objectId, 'fleet-1'); } catch { /* ignore */ }
  };

  const handleInvestigateAnomaly = async (anomalyId: string) => {
    try {
      await investigateAnomaly(anomalyId);
    } catch { /* ignore */ }
  };

  const getObjectIcon = (type: string) => {
    switch (type) {
      case 'asteroid':
        return 'ri-meteor-line';
      case 'nebula':
        return 'ri-cloud-line';
      case 'black_hole':
        return 'ri-focus-3-line';
      case 'wormhole':
        return 'ri-loop-left-line';
      case 'pulsar':
        return 'ri-radio-button-line';
      case 'quasar':
        return 'ri-sun-foggy-line';
      case 'supernova':
        return 'ri-fire-line';
      case 'comet':
        return 'ri-rocket-line';
      default:
        return 'ri-star-line';
    }
  };

  const filteredObjects = objects.filter(obj => {
    const matchesFilter = objectFilter === 'all' || obj.type === objectFilter;
    const matchesSearch = obj.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden" style={{ background: '#020408' }}>
        <SpaceCanvas starCount={400} showNebulae />
        <div className="absolute inset-0 z-10">
          <PageLoading message="Initializing Universe Explorer..." className="h-full text-cyan-300" messageClassName="font-semibold" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#020408' }}>
      {/* Hero with animated starfield */}
      <div className="relative h-64 overflow-hidden">
        <SpaceCanvas starCount={500} showNebulae />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <h1 className="text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-400 mb-3">
            MULTI-UNIVERSE EXPLORER
          </h1>
          <p className="text-gray-400 text-lg tracking-wide">Navigate infinite universes, galaxies, and stellar phenomena</p>
          <div className="flex gap-8 mt-6">
            <div className="text-center">
              <div className="text-3xl font-black text-cyan-400">{objects.length}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Objects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-purple-400">{phenomena.length}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Phenomena</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-pink-400">{anomalies.length}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Anomalies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-amber-400">{missions.length}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Missions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 pt-4 pb-0 border-b border-white/5">
        {[
          { id: 'universes', label: 'Universes', icon: 'ri-global-line' },
          { id: 'galaxies', label: 'Galaxies', icon: 'ri-planet-line' },
          { id: 'objects', label: 'Interstellar Objects', icon: 'ri-meteor-line' },
          { id: 'phenomena', label: 'Cosmic Phenomena', icon: 'ri-fire-line' },
          { id: 'anomalies', label: 'Anomalies', icon: 'ri-focus-3-line' },
          { id: 'missions', label: 'Missions', icon: 'ri-rocket-line' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <i className={`${tab.icon} mr-2`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">

        {/* ── UNIVERSES TAB ── */}
        {activeTab === 'universes' && (
          <div>
            {/* Featured Planets Showcase */}
            <div className="relative rounded-2xl overflow-hidden mb-8 p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="absolute inset-0 overflow-hidden">
                <SpaceCanvas starCount={200} showNebulae animated />
              </div>
              <div className="relative z-10">
                <h2 className="text-xl font-bold text-white mb-1">Celestial Bodies</h2>
                <p className="text-gray-500 text-sm mb-6">Known planet classes across all universes</p>
                <div className="flex flex-wrap gap-8 justify-center">
                  {featuredPlanets.map((p, i) => (
                    <Planet3D key={i} type={p.type} size={72} label={p.name} sublabel={p.class} animate />
                  ))}
                </div>
              </div>
            </div>

            {/* Featured Stars Showcase */}
            <div className="relative rounded-2xl overflow-hidden mb-8 p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="absolute inset-0 overflow-hidden">
                <SpaceCanvas starCount={150} showNebulae={false} animated />
              </div>
              <div className="relative z-10">
                <h2 className="text-xl font-bold text-white mb-1">Star Classifications</h2>
                <p className="text-gray-500 text-sm mb-6">Stellar types catalogued across the multiverse</p>
                <div className="flex flex-wrap gap-8 justify-center items-end">
                  {featuredStars.map((s, i) => (
                    <Star3D key={i} type={s.type} size={70} label={s.name} sublabel={s.class} animate />
                  ))}
                </div>
              </div>
            </div>

            {/* Universe Cards */}
            <h2 className="text-xl font-bold text-white mb-4">Known Universes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {universes.map(universe => (
                <div
                  key={universe.id}
                  className="relative rounded-xl overflow-hidden cursor-pointer group"
                  style={{ border: selectedUniverse?.id === universe.id ? '1px solid rgba(100,200,255,0.5)' : '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
                  onClick={() => setSelectedUniverse(universe)}
                >
                  {/* Mini starfield bg */}
                  <div className="absolute inset-0 overflow-hidden opacity-40">
                    <SpaceCanvas starCount={80} showNebulae animated={false} />
                  </div>

                  <div className="relative z-10 p-5">
                    <div className="flex items-start gap-4 mb-4">
                      <Galaxy3D type={universe.galaxyType} size={80} imageSeq={universe.imageSeq} />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-bold text-white">{universe.name}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            universe.status === 'discovered' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {universe.status === 'discovered' ? 'Discovered' : 'Locked'}
                          </span>
                        </div>
                        <p className="text-xs text-cyan-400 mb-2">{universe.type} Universe</p>
                        <p className="text-xs text-gray-400 leading-relaxed">{universe.description}</p>
                      </div>
                    </div>

                    <div className="space-y-1 mb-4">
                      {universe.characteristics.map((c, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                          <i className="ri-checkbox-circle-line text-cyan-400 text-xs"></i>
                          {c}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="text-xs text-gray-400">
                        <span className="text-white font-semibold">{universe.players.toLocaleString()}</span> players
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < universe.dangerLevel ? 'bg-red-500' : 'bg-gray-700'}`} />
                        ))}
                        <span className="text-xs text-red-400 ml-1">{universe.dangerLevel}/10</span>
                      </div>
                    </div>

                    {universe.status === 'locked' && (
                      <button className="w-full mt-3 px-4 py-2 rounded-lg text-xs font-bold text-white whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #00b4d8, #7209b7)' }}>
                        Discover — 10,000 Dark Matter
                      </button>
                    )}
                    {universe.status === 'discovered' && universe.id !== currentUniverse && (
                      <button
                        onClick={e => { e.stopPropagation(); setCurrentUniverse(universe.id); }}
                        className="w-full mt-3 px-4 py-2 rounded-lg text-xs font-bold text-cyan-400 whitespace-nowrap"
                        style={{ border: '1px solid rgba(0,180,216,0.4)', background: 'rgba(0,180,216,0.08)' }}
                      >
                        <i className="ri-rocket-line mr-1"></i>Travel Here
                      </button>
                    )}
                    {universe.id === currentUniverse && (
                      <div className="w-full mt-3 px-4 py-2 rounded-lg text-xs font-bold text-green-400 text-center" style={{ border: '1px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.06)' }}>
                        <i className="ri-map-pin-line mr-1"></i>Current Location
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── GALAXIES TAB ── */}
        {activeTab === 'galaxies' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {galaxies.map(galaxy => (
                <div
                  key={galaxy.id}
                  className="relative rounded-xl overflow-hidden cursor-pointer"
                  style={{
                    border: selectedGalaxy?.id === galaxy.id ? '1px solid rgba(150,100,255,0.6)' : '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(255,255,255,0.02)',
                  }}
                  onClick={() => setSelectedGalaxy(galaxy)}
                >
                  <div className="absolute inset-0 overflow-hidden opacity-30">
                    <SpaceCanvas starCount={60} showNebulae animated={false} />
                  </div>
                  <div className="relative z-10 p-5">
                    <div className="flex justify-center mb-4">
                      <Galaxy3D type={galaxy.type} size={100} imageSeq={galaxy.imageSeq} selected={selectedGalaxy?.id === galaxy.id} />
                    </div>
                    <h3 className="text-base font-bold text-white text-center mb-1">{galaxy.name}</h3>
                    <p className="text-xs text-purple-400 text-center mb-4 capitalize">{galaxy.type.replace('-', ' ')} Galaxy</p>

                    <div className="space-y-2 mb-4">
                      {[
                        { label: 'Sectors', val: galaxy.sectors, color: 'text-white' },
                        { label: 'Systems', val: galaxy.systems.toLocaleString(), color: 'text-cyan-400' },
                        { label: 'Planets', val: galaxy.planets.toLocaleString(), color: 'text-green-400' },
                      ].map(r => (
                        <div key={r.label} className="flex justify-between text-xs">
                          <span className="text-gray-500">{r.label}</span>
                          <span className={`font-semibold ${r.color}`}>{r.val}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Explored</span>
                        <span className="text-cyan-400 font-semibold">{galaxy.explored}%</span>
                      </div>
                      <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${galaxy.explored}%`, background: 'linear-gradient(90deg, #00b4d8, #7209b7)' }} />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {galaxy.resources.map((r, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full text-gray-300" style={{ background: 'rgba(255,255,255,0.06)' }}>{r}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── OBJECTS TAB ── */}
        {activeTab === 'objects' && (
          <div>
            <div className="flex flex-wrap gap-4 mb-6 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <input
                type="text"
                placeholder="Search objects..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-1 min-w-48 px-4 py-2 rounded-lg text-sm text-white focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <select
                value={objectFilter}
                onChange={e => setObjectFilter(e.target.value)}
                className="px-4 py-2 rounded-lg text-sm text-white focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <option value="all">All Types</option>
                <option value="asteroid">Asteroids</option>
                <option value="nebula">Nebulae</option>
                <option value="black_hole">Black Holes</option>
                <option value="wormhole">Wormholes</option>
                <option value="pulsar">Pulsars</option>
                <option value="quasar">Quasars</option>
                <option value="supernova">Supernovas</option>
                <option value="comet">Comets</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredObjects.map(object => (
                <div
                  key={object.id}
                  className="rounded-xl p-4 cursor-pointer transition-all hover:scale-105"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                  onClick={() => setSelectedObject(object)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ background: 'rgba(0,180,216,0.1)' }}>
                      <i className={`${getObjectIcon(object.type)} text-cyan-400 text-lg`}></i>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{object.name}</h4>
                      <p className="text-xs text-gray-500 capitalize">{object.type.replace('_', ' ')}</p>
                    </div>
                    {!object.discovered && (
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full text-amber-400" style={{ background: 'rgba(251,191,36,0.1)' }}>New</span>
                    )}
                  </div>

                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Size</span>
                      <span className="text-white capitalize">{object.size}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Danger</span>
                      <span className="text-red-400">{object.dangerLevel}/10</span>
                    </div>
                    {object.harvestable && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Resources</span>
                        <span className="text-green-400">{object.remainingResources}%</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {!object.scanned && (
                      <button
                        onClick={e => { e.stopPropagation(); handleScanObject(object.id); }}
                        className="flex-1 py-1.5 rounded text-xs font-semibold text-cyan-400 whitespace-nowrap"
                        style={{ background: 'rgba(0,180,216,0.1)', border: '1px solid rgba(0,180,216,0.3)' }}
                      >Scan</button>
                    )}
                    {object.harvestable && object.remainingResources > 0 && (
                      <button
                        onClick={e => { e.stopPropagation(); handleHarvestObject(object.id); }}
                        className="flex-1 py-1.5 rounded text-xs font-semibold text-green-400 whitespace-nowrap"
                        style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)' }}
                      >Harvest</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PHENOMENA TAB ── */}
        {activeTab === 'phenomena' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {phenomena.map(phenomenon => (
              <div key={phenomenon.id} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">{phenomenon.name}</h3>
                    <p className="text-xs text-purple-400 capitalize">{phenomenon.type.replace('_', ' ')}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${phenomenon.active ? 'text-green-400 bg-green-500/10' : 'text-gray-500 bg-gray-500/10'}`}>
                    {phenomenon.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Intensity</span><span className="text-orange-400 font-semibold">{phenomenon.intensity}%</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Radius</span><span className="text-white">{phenomenon.radius} units</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Duration</span><span className="text-cyan-400">{Math.floor(phenomenon.duration / 60)}h {phenomenon.duration % 60}m</span></div>
                </div>
                <div className="space-y-1">
                  {phenomenon.effects.map((effect: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        effect.type === 'damage' ? 'bg-red-500/10 text-red-400' :
                        effect.type === 'boost' ? 'bg-green-500/10 text-green-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>{effect.type}</span>
                      <span className="text-gray-400">{effect.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ANOMALIES TAB ── */}
        {activeTab === 'anomalies' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {anomalies.map(anomaly => (
              <div key={anomaly.id} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">{anomaly.name}</h3>
                    <p className="text-xs text-pink-400 capitalize">{anomaly.type.replace('_', ' ')}</p>
                  </div>
                  {anomaly.investigated && (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold text-green-400 bg-green-500/10">Investigated</span>
                  )}
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Stability</span><span className="text-cyan-400 font-semibold">{anomaly.stability}%</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Research Value</span><span className="text-purple-400 font-semibold">{anomaly.researchValue.toLocaleString()}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Coordinates</span><span className="text-white font-mono text-xs">{anomaly.coordinates.x}:{anomaly.coordinates.y}:{anomaly.coordinates.z}</span></div>
                </div>
                {!anomaly.investigated && (
                  <button
                    onClick={() => handleInvestigateAnomaly(anomaly.id)}
                    className="w-full py-2 rounded-lg text-xs font-bold text-white whitespace-nowrap"
                    style={{ background: 'linear-gradient(135deg, #f72585, #7209b7)' }}
                  >
                    Investigate — 2,000 Dark Matter
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── MISSIONS TAB ── */}
        {activeTab === 'missions' && (
          <div>
            {missions.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-20 h-20 flex items-center justify-center rounded-full mx-auto mb-4" style={{ background: 'rgba(0,180,216,0.1)' }}>
                  <i className="ri-rocket-line text-4xl text-cyan-400"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No Active Missions</h3>
                <p className="text-gray-500 mb-6">Start exploring objects, phenomena, or anomalies to begin missions</p>
                <button onClick={() => setActiveTab('objects')} className="px-6 py-3 rounded-lg font-semibold text-white whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #00b4d8, #7209b7)' }}>
                  Explore Objects
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {missions.map(mission => (
                  <div key={mission.id} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-white mb-1 capitalize">{mission.missionType} Mission</h3>
                        <p className="text-xs text-gray-500">Target: {mission.targetId}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        mission.status === 'completed' ? 'text-green-400 bg-green-500/10' :
                        mission.status === 'failed' ? 'text-red-400 bg-red-500/10' :
                        'text-cyan-400 bg-cyan-500/10'
                      }`}>{mission.status}</span>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="text-cyan-400 font-semibold">{mission.progress}%</span>
                      </div>
                      <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${mission.progress}%`, background: 'linear-gradient(90deg, #00b4d8, #7209b7)' }} />
                      </div>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between"><span className="text-gray-500">Started</span><span className="text-white">{new Date(mission.startedAt).toLocaleTimeString()}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">ETA</span><span className="text-cyan-400">{new Date(mission.estimatedCompletion).toLocaleTimeString()}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
