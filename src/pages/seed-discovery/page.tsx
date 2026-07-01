import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSeedSystem, PORTAL_GLYPHS } from '@/hooks/useSeedSystem';
import type { SeedType, PlanetSeed, ShipSeed, CreatureSeed, MultitoolSeed, PortalGlyph } from '@/hooks/useSeedSystem';

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

function formatNumber(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}

function getBiomeColor(biome: string): string {
  const map: Record<string, string> = {
    'Lush': '#4ADE80', 'Barren': '#F59E0B', 'Frozen': '#38BDF8', 'Scorched': '#EF4444',
    'Radioactive': '#A3E635', 'Toxic': '#84CC16', 'Dead': '#6B7280', 'Exotic': '#EC4899',
    'Mega-Exotic': '#D946EF', 'Paradise': '#22D3EE',
  };
  return map[biome] || '#9CA3AF';
}

function getSentinelColor(level: string): string {
  const map: Record<string, string> = {
    'None': '#4ADE80', 'Low': '#A3E635', 'Regular': '#F59E0B', 'Aggressive': '#EF4444', 'Corrupted': '#A855F7',
  };
  return map[level] || '#9CA3AF';
}

function getShipClassColor(cls: string): string {
  const map: Record<string, string> = { 'C': '#9CA3AF', 'B': '#4ADE80', 'A': '#A855F7', 'S': '#F59E0B' };
  return map[cls] || '#9CA3AF';
}

function getRarityColor(rarity: string): string {
  const map: Record<string, string> = { 'Common': '#9CA3AF', 'Uncommon': '#4ADE80', 'Rare': '#38BDF8', 'Ultra-Rare': '#F59E0B' };
  return map[rarity] || '#9CA3AF';
}

/* ─────────────────────────────────────────────
   GLYPH SELECTOR MODAL
───────────────────────────────────────────── */

function GlyphSelector({
  open,
  onSelect,
  onClose,
}: {
  open: boolean;
  onSelect: (glyph: PortalGlyph) => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <div
        className="relative bg-slate-800 border border-slate-600/50 rounded-xl p-6 max-w-md w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-cyan-400 mb-4 text-center">Select Portal Glyph</h3>
        <div className="grid grid-cols-4 gap-3">
          {PORTAL_GLYPHS.map((g) => (
            <button
              key={g.value}
              onClick={() => onSelect(g)}
              className="flex flex-col items-center p-3 rounded-lg border border-slate-600/50 hover:border-cyan-400/50 hover:bg-slate-700/50 transition-all cursor-pointer"
              style={{ borderColor: `${g.color}30` }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1" style={{ background: `${g.color}20`, border: `2px solid ${g.color}` }}>
                <i className={`${g.icon} text-lg`} style={{ color: g.color }}></i>
              </div>
              <span className="text-xs text-gray-300">{g.name}</span>
              <span className="text-[10px] text-gray-500">{g.value}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PLANET CARD
───────────────────────────────────────────── */

function PlanetCard({ planet }: { planet: PlanetSeed }) {
  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/80 border border-slate-600/50 rounded-xl overflow-hidden hover:border-cyan-500/40 transition-all">
      {/* Header image area */}
      <div className="relative h-32 w-full" style={{ background: `linear-gradient(180deg, ${planet.skyColor}40 0%, ${planet.groundColor}60 100%)` }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: `radial-gradient(circle, ${planet.groundColor}80, transparent)` }}>
            <i className="ri-global-line text-4xl" style={{ color: planet.groundColor }}></i>
          </div>
        </div>
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-900/70" style={{ color: getBiomeColor(planet.biome) }}>
            {planet.biome}
          </span>
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          {planet.hasWater && (
            <span className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-500/30" title="Has Water">
              <i className="ri-drop-line text-sm text-blue-400"></i>
            </span>
          )}
          {planet.hasPortal && (
            <span className="w-6 h-6 rounded-full flex items-center justify-center bg-purple-500/30" title="Has Portal">
              <i className="ri-focus-3-line text-sm text-purple-400"></i>
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <h4 className="text-base font-bold text-white mb-1 truncate">{planet.planetName}</h4>
        <p className="text-xs text-gray-400 mb-3">
          {planet.galacticCoords.x}:{planet.galacticCoords.y}:{planet.galacticCoords.z} · System {planet.galacticCoords.system}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-slate-900/50 rounded p-2">
            <p className="text-[10px] text-gray-500">Weather</p>
            <p className="text-xs text-gray-200 truncate">{planet.weather}</p>
          </div>
          <div className="bg-slate-900/50 rounded p-2">
            <p className="text-[10px] text-gray-500">Sentinels</p>
            <p className="text-xs font-medium" style={{ color: getSentinelColor(planet.sentinelLevel) }}>{planet.sentinelLevel}</p>
          </div>
          <div className="bg-slate-900/50 rounded p-2">
            <p className="text-[10px] text-gray-500">Flora</p>
            <p className="text-xs text-gray-200">{planet.flora}</p>
          </div>
          <div className="bg-slate-900/50 rounded p-2">
            <p className="text-[10px] text-gray-500">Fauna</p>
            <p className="text-xs text-gray-200">{planet.fauna}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {planet.resources.map((r, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{r}</span>
          ))}
        </div>

        {/* Glyphs */}
        <div className="bg-slate-900/50 rounded-lg p-2">
          <p className="text-[10px] text-gray-500 mb-1">Portal Address</p>
          <p className="text-xs text-cyan-400 font-mono truncate">{planet.glyphs}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SHIP CARD
───────────────────────────────────────────── */

function ShipCard({ ship }: { ship: ShipSeed }) {
  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/80 border border-slate-600/50 rounded-xl overflow-hidden hover:border-cyan-500/40 transition-all">
      <div className="relative h-32 w-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${ship.primaryColor}15, ${ship.secondaryColor}25)` }}>
        <i className="ri-rocket-2-line text-5xl" style={{ color: ship.primaryColor, filter: `drop-shadow(0 0 15px ${ship.primaryColor}40)` }}></i>
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-900/70" style={{ color: getShipClassColor(ship.class) }}>
            {ship.class}-Class
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-900/70 text-gray-300">
            {ship.archetype}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h4 className="text-base font-bold text-white mb-1 truncate">{ship.shipName}</h4>
        <p className="text-xs text-gray-400 mb-3">{ship.archetype} · {ship.slots} Slots</p>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-slate-900/50 rounded p-2"><p className="text-[10px] text-gray-500">Damage</p><p className="text-xs text-red-400 font-bold">{ship.baseDamage}</p></div>
          <div className="bg-slate-900/50 rounded p-2"><p className="text-[10px] text-gray-500">Shield</p><p className="text-xs text-cyan-400 font-bold">{ship.baseShield}</p></div>
          <div className="bg-slate-900/50 rounded p-2"><p className="text-[10px] text-gray-500">Hyperdrive</p><p className="text-xs text-purple-400 font-bold">{ship.baseHyperdrive}</p></div>
          <div className="bg-slate-900/50 rounded p-2"><p className="text-[10px] text-gray-500">Maneuver</p><p className="text-xs text-emerald-400 font-bold">{ship.baseManeuverability}</p></div>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-2">
          <p className="text-[10px] text-gray-500 mb-1">Seed Glyphs</p>
          <p className="text-xs text-cyan-400 font-mono truncate">{ship.glyphs}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CREATURE CARD
───────────────────────────────────────────────────────────── */

function CreatureCard({ creature }: { creature: CreatureSeed }) {
  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/80 border border-slate-600/50 rounded-xl overflow-hidden hover:border-cyan-500/40 transition-all">
      <div className="relative h-32 w-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${creature.color}10, #0f172a)` }}>
        <div className="flex items-center gap-4">
          <i className="ri-bear-smile-line text-5xl" style={{ color: creature.color, filter: `drop-shadow(0 0 12px ${creature.color}50)` }}></i>
          {creature.hasWings && <i className="ri-flight-takeoff-line text-3xl" style={{ color: `${creature.color}80` }}></i>}
        </div>
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-900/70" style={{ color: getRarityColor(creature.rarity) }}>
            {creature.rarity}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-900/70 text-gray-300">
            {creature.creatureType}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h4 className="text-base font-bold text-white mb-1 truncate">{creature.creatureName}</h4>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-slate-900/50 rounded p-2"><p className="text-[10px] text-gray-500">Height</p><p className="text-xs text-white">{creature.height}m</p></div>
          <div className="bg-slate-900/50 rounded p-2"><p className="text-[10px] text-gray-500">Weight</p><p className="text-xs text-white">{creature.weight}kg</p></div>
        </div>
        <p className="text-xs text-gray-400 mb-1"><span className="text-gray-500">Temperament:</span> {creature.temperament}</p>
        <p className="text-xs text-gray-400 mb-1"><span className="text-gray-500">Diet:</span> {creature.diet}</p>
        <p className="text-xs text-gray-500 italic mb-3">{creature.notes}</p>
        <div className="bg-slate-900/50 rounded-lg p-2">
          <p className="text-[10px] text-gray-500 mb-1">Gene Sequence</p>
          <p className="text-xs text-cyan-400 font-mono truncate">{creature.glyphs}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */

export default function SeedDiscoveryPage() {
  const navigate = useNavigate();
  const playerId = 'demo-player';

  const {
    discoveries,
    loading,
    FEATURED_SEEDS,
    generateFromSeed,
    discoverSeed,
    deleteDiscovery,
    generateRandomSeed,
    seedToGlyphs,
    glyphsToSeed,
    getGlyphByValue,
  } = useSeedSystem(playerId);

  const [activeTab, setActiveTab] = useState<'explore' | 'catalog'>('explore');
  const [seedType, setSeedType] = useState<SeedType>('planet');
  const [seedInput, setSeedInput] = useState('');
  const [glyphValues, setGlyphValues] = useState<number[]>(Array(12).fill(0));
  const [glyphSelectorIdx, setGlyphSelectorIdx] = useState<number | null>(null);
  const [preview, setPreview] = useState<PlanetSeed | ShipSeed | CreatureSeed | MultitoolSeed | null>(null);
  const [discoveryName, setDiscoveryName] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [catalogFilter, setCatalogFilter] = useState<SeedType | 'all'>('all');

  // Generate preview when seed changes
  useEffect(() => {
    const num = Number(seedInput);
    if (!isNaN(num) && num !== 0) {
      try {
        setPreview(generateFromSeed(num, seedType));
      } catch {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  }, [seedInput, seedType, generateFromSeed]);

  // Update glyphs from seed input
  useEffect(() => {
    const num = Number(seedInput);
    if (!isNaN(num) && num !== 0) {
      const glyphStr = seedToGlyphs(num);
      const names = glyphStr.split(' · ');
      const values = names.map(n => {
        const g = PORTAL_GLYPHS.find(pg => pg.name === n);
        return g ? g.value : 0;
      });
      setGlyphValues(values);
    }
  }, [seedInput]);

  // Update seed from glyphs
  const updateGlyph = (idx: number, glyph: PortalGlyph) => {
    const next = [...glyphValues];
    next[idx] = glyph.value;
    setGlyphValues(next);
    setGlyphSelectorIdx(null);

    const seed = glyphsToSeed(next);
    setSeedInput(seed.toString());
  };

  const handleRandomSeed = () => {
    const seed = generateRandomSeed();
    setSeedInput(seed.toString());
    setDiscoveryName('');
    setMessage(null);
  };

  const handleDiscover = async () => {
    const num = Number(seedInput);
    if (isNaN(num) || num === 0) {
      setMessage({ text: 'Please enter a valid seed value', type: 'error' });
      return;
    }
    const name = discoveryName.trim() || `Discovery #${formatNumber(num)}`;
    const result = await discoverSeed(num, seedType, name);
    setMessage(result.success
      ? { text: 'Seed discovered and added to catalog!', type: 'success' }
      : { text: result.error || 'Failed to discover seed', type: 'error' }
    );
    if (result.success) {
      setDiscoveryName('');
      setSeedInput('');
    }
  };

  const filteredDiscoveries = catalogFilter === 'all'
    ? discoveries
    : discoveries.filter(d => d.seed_type === catalogFilter);

  const handleDeleteDiscovery = async (id: string) => {
    await deleteDiscovery(id);
  };

  const handleQuickDiscover = async (seed: number, type: SeedType, name: string) => {
    const result = await discoverSeed(seed, type, name);
    setMessage(result.success
      ? { text: `"${name}" added to catalog!`, type: 'success' }
      : { text: result.error || 'Already discovered', type: 'error' }
    );
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-400 bg-clip-text text-transparent mb-2">
              Atlas Seed Nexus
            </h1>
            <p className="text-gray-400">Explore procedural worlds, ships, creatures, and multitools through the ancient portal network</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 bg-slate-700/80 hover:bg-slate-600/80 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer border border-slate-600/50"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Dashboard
          </button>
        </div>

        {/* Message toast */}
        {message && (
          <div className={`mb-6 px-4 py-3 rounded-lg flex items-center justify-between text-sm ${
            message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="cursor-pointer"><i className="ri-close-line"></i></button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['explore', 'catalog'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
              }`}
            >
              <i className={`${tab === 'explore' ? 'ri-compass-3-line' : 'ri-archive-line'} mr-2`}></i>
              {tab === 'explore' ? 'Seed Explorer' : 'Discovery Catalog'}
            </button>
          ))}
        </div>

        {/* EXPLORE TAB */}
        {activeTab === 'explore' && (
          <div className="space-y-6">
            {/* Seed Type Selector */}
            <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-600/30">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">What are you searching for?</h3>
              <div className="flex flex-wrap gap-3">
                {([
                  { type: 'planet' as SeedType, label: 'Planet', icon: 'ri-global-line', color: '#4ADE80' },
                  { type: 'ship' as SeedType, label: 'Starship', icon: 'ri-rocket-2-line', color: '#38BDF8' },
                  { type: 'creature' as SeedType, label: 'Creature', icon: 'ri-bear-smile-line', color: '#F59E0B' },
                  { type: 'multitool' as SeedType, label: 'Multitool', icon: 'ri-tools-line', color: '#A855F7' },
                ]).map(({ type, label, icon, color }) => (
                  <button
                    key={type}
                    onClick={() => { setSeedType(type); setPreview(null); setSeedInput(''); }}
                    className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer border ${
                      seedType === type
                        ? 'text-white'
                        : 'border-slate-600/30 text-gray-400 hover:border-slate-500/50'
                    }`}
                    style={seedType === type ? { background: `${color}20`, borderColor: `${color}60` } : {}}
                  >
                    <i className={icon} style={{ color: seedType === type ? color : undefined }}></i>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Portal Glyphs + Seed Input */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 rounded-xl p-6 border border-slate-600/30">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-cyan-400">
                  <i className="ri-focus-3-line mr-2"></i>
                  Portal Interface
                </h3>
                <button
                  onClick={handleRandomSeed}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600/80 to-amber-600/80 hover:from-purple-500/80 hover:to-amber-500/80 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-shuffle-line mr-2"></i>
                  Random Seed
                </button>
              </div>

              {/* 12 Glyph Slots */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {glyphValues.map((val, idx) => {
                  const glyph = getGlyphByValue(val);
                  return (
                    <button
                      key={idx}
                      onClick={() => setGlyphSelectorIdx(idx)}
                      className="w-12 h-12 rounded-lg flex items-center justify-center transition-all cursor-pointer border-2"
                      style={{
                        background: `${glyph.color}15`,
                        borderColor: `${glyph.color}40`,
                      }}
                    >
                      <i className={`${glyph.icon} text-xl`} style={{ color: glyph.color }}></i>
                    </button>
                  );
                })}
              </div>

              {/* Seed Number Input */}
              <div className="flex gap-4 items-center max-w-lg mx-auto mb-4">
                <input
                  type="text"
                  value={seedInput}
                  onChange={(e) => setSeedInput(e.target.value)}
                  placeholder="Enter seed value (e.g. 28901816673654784)"
                  className="flex-1 px-4 py-3 bg-slate-900/60 border border-slate-600/50 rounded-lg text-white text-sm font-mono placeholder-gray-500 outline-none focus:border-cyan-500/50"
                />
              </div>
              <p className="text-xs text-gray-500 text-center">
                Enter a seed value or click glyphs above to build a portal address
              </p>
            </div>

            {/* Preview */}
            {preview && seedType === 'planet' && <PlanetCard planet={preview as PlanetSeed} />}
            {preview && seedType === 'ship' && <ShipCard ship={preview as ShipSeed} />}
            {preview && seedType === 'creature' && <CreatureCard creature={preview as CreatureSeed} />}
            {preview && seedType === 'multitool' && (
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/80 border border-slate-600/50 rounded-xl p-6">
                {(preview as MultitoolSeed).class === 'S' && (
                  <div className="text-center mb-3">
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold border border-amber-500/30">S-CLASS FOUND</span>
                  </div>
                )}
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center" style={{ background: `${(preview as MultitoolSeed).primaryColor}15` }}>
                    <i className="ri-tools-line text-4xl" style={{ color: (preview as MultitoolSeed).primaryColor }}></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-1">{(preview as MultitoolSeed).toolName}</h4>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ color: getShipClassColor((preview as MultitoolSeed).class), background: `${getShipClassColor((preview as MultitoolSeed).class)}15` }}>{(preview as MultitoolSeed).class}-Class</span>
                      <span className="text-xs text-gray-400">{(preview as MultitoolSeed).toolType}</span>
                      <span className="text-xs text-gray-400">{(preview as MultitoolSeed).slots} Slots</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div><p className="text-[10px] text-gray-500">Damage</p><p className="text-sm text-red-400 font-bold">{(preview as MultitoolSeed).baseDamage}</p></div>
                      <div><p className="text-[10px] text-gray-500">Mining</p><p className="text-sm text-cyan-400 font-bold">{(preview as MultitoolSeed).baseMining}</p></div>
                      <div><p className="text-[10px] text-gray-500">Scan</p><p className="text-sm text-purple-400 font-bold">{(preview as MultitoolSeed).baseScan}</p></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Discover Button */}
            {preview && (
              <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-600/30">
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Save to Catalog</h4>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={discoveryName}
                    onChange={(e) => setDiscoveryName(e.target.value)}
                    placeholder="Name this discovery (optional)"
                    className="flex-1 px-4 py-3 bg-slate-900/60 border border-slate-600/50 rounded-lg text-white text-sm placeholder-gray-500 outline-none focus:border-cyan-500/50"
                  />
                  <button
                    onClick={handleDiscover}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg font-bold text-white transition-all whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-upload-2-line mr-2"></i>
                    Register Discovery
                  </button>
                </div>
              </div>
            )}

            {/* Featured Seeds */}
            <div>
              <h3 className="text-lg font-bold text-gray-300 mb-4">
                <i className="ri-star-line mr-2 text-amber-400"></i>
                Featured Seeds
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {FEATURED_SEEDS.map((fs, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/40 border border-slate-600/30 rounded-lg p-4 hover:border-cyan-500/30 transition-all cursor-pointer"
                    onClick={() => {
                      setSeedType(fs.type);
                      setSeedInput(fs.seed.toString());
                      setDiscoveryName(fs.name);
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${fs.type === 'planet' ? '#4ADE80' : fs.type === 'ship' ? '#38BDF8' : fs.type === 'creature' ? '#F59E0B' : '#A855F7'}20` }}>
                        <i className={`${fs.type === 'planet' ? 'ri-global-line' : fs.type === 'ship' ? 'ri-rocket-2-line' : fs.type === 'creature' ? 'ri-bear-smile-line' : 'ri-tools-line'} text-lg`}
                          style={{ color: fs.type === 'planet' ? '#4ADE80' : fs.type === 'ship' ? '#38BDF8' : fs.type === 'creature' ? '#F59E0B' : '#A855F7' }}
                        ></i>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{fs.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{fs.type} · 0x{fs.seed.toString(16).toUpperCase()}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickDiscover(fs.seed, fs.type, fs.name);
                      }}
                      className="w-full mt-2 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/30 whitespace-nowrap"
                    >
                      <i className="ri-download-line mr-1"></i>
                      Add to Catalog
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CATALOG TAB */}
        {activeTab === 'catalog' && (
          <div>
            {/* Catalog filter */}
            <div className="flex flex-wrap items-center justify-between mb-6">
              <div className="flex gap-2">
                {(['all', 'planet', 'ship', 'creature', 'multitool'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setCatalogFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                      catalogFilter === f
                        ? 'bg-cyan-600/30 text-cyan-400 border border-cyan-500/30'
                        : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50 border border-slate-600/20'
                    }`}
                  >
                    {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}s
                    {f === 'all' ? ` (${discoveries.length})` : ` (${discoveries.filter(d => d.seed_type === f).length})`}
                  </button>
                ))}
              </div>
              <span className="text-xs text-gray-500">{discoveries.length} total discoveries</span>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <i className="ri-loader-4-line text-4xl text-gray-600 animate-spin"></i>
                <p className="text-gray-500 mt-4">Loading catalog...</p>
              </div>
            ) : filteredDiscoveries.length === 0 ? (
              <div className="text-center py-20">
                <i className="ri-compass-3-line text-6xl text-gray-600 mb-4"></i>
                <p className="text-gray-400 text-lg">No discoveries yet</p>
                <p className="text-sm text-gray-500 mb-6">Use the Explorer tab to discover new seeds</p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg font-medium hover:from-cyan-500 hover:to-purple-500 transition-all whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-compass-3-line mr-2"></i>
                  Start Exploring
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDiscoveries.map((d) => {
                  const props = d.seed_properties;
                  const typeIcons: Record<string, string> = { planet: 'ri-global-line', ship: 'ri-rocket-2-line', creature: 'ri-bear-smile-line', multitool: 'ri-tools-line' };
                  const typeColors: Record<string, string> = { planet: '#4ADE80', ship: '#38BDF8', creature: '#F59E0B', multitool: '#A855F7' };

                  return (
                    <div key={d.id} className="bg-gradient-to-br from-slate-800/90 to-slate-700/80 border border-slate-600/50 rounded-xl overflow-hidden hover:border-cyan-500/40 transition-all">
                      {/* Header */}
                      <div className="relative h-24 w-full flex items-center justify-center" style={{ background: `${typeColors[d.seed_type] || '#4ADE80'}08` }}>
                        <i className={`${typeIcons[d.seed_type] || 'ri-global-line'} text-4xl`} style={{ color: typeColors[d.seed_type], opacity: 0.6 }}></i>
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-900/70 capitalize" style={{ color: typeColors[d.seed_type] }}>
                            {d.seed_type}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteDiscovery(d.id)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center bg-red-500/10 hover:bg-red-500/30 transition-all cursor-pointer border border-red-500/20"
                          title="Delete discovery"
                        >
                          <i className="ri-delete-bin-line text-xs text-red-400"></i>
                        </button>
                      </div>

                      <div className="p-4">
                        <h4 className="text-base font-bold text-white mb-1 truncate">{d.name}</h4>
                        <p className="text-xs text-gray-400 mb-3 font-mono">0x{d.seed_value.toString(16).toUpperCase()}</p>

                        {/* Type-specific preview */}
                        {d.seed_type === 'planet' && props && (
                          <div className="space-y-1 mb-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Biome:</span>
                              <span style={{ color: getBiomeColor(props.biome) }}>{props.biome}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Sentinels:</span>
                              <span style={{ color: getSentinelColor(props.sentinelLevel) }}>{props.sentinelLevel}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Economy:</span>
                              <span className="text-gray-300">{props.economyType}</span>
                            </div>
                          </div>
                        )}

                        {d.seed_type === 'ship' && props && (
                          <div className="space-y-1 mb-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Type:</span>
                              <span className="text-gray-300">{props.archetype}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Class:</span>
                              <span style={{ color: getShipClassColor(props.class) }}>{props.class}-Class</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Slots:</span>
                              <span className="text-gray-300">{props.slots}</span>
                            </div>
                          </div>
                        )}

                        {d.seed_type === 'creature' && props && (
                          <div className="space-y-1 mb-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Type:</span>
                              <span className="text-gray-300">{props.creatureType}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Rarity:</span>
                              <span style={{ color: getRarityColor(props.rarity) }}>{props.rarity}</span>
                            </div>
                          </div>
                        )}

                        {d.seed_type === 'multitool' && props && (
                          <div className="space-y-1 mb-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Type:</span>
                              <span className="text-gray-300">{props.toolType}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Class:</span>
                              <span style={{ color: getShipClassColor(props.class) }}>{props.class}-Class</span>
                            </div>
                          </div>
                        )}

                        <div className="bg-slate-900/50 rounded p-2">
                          <p className="text-[10px] text-gray-500 mb-1">Portal Address</p>
                          <p className="text-xs text-cyan-400 font-mono truncate">{d.glyphs}</p>
                        </div>

                        <p className="text-[10px] text-gray-600 mt-2">
                          Discovered {new Date(d.discovered_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Glyph Selector Modal */}
      <GlyphSelector
        open={glyphSelectorIdx !== null}
        onSelect={(glyph) => {
          if (glyphSelectorIdx !== null) updateGlyph(glyphSelectorIdx, glyph);
        }}
        onClose={() => setGlyphSelectorIdx(null)}
      />
    </div>
  );
}