import { useState } from 'react';
import MaterialWishlistPanel from '@/components/feature/MaterialWishlistPanel';

interface Material {
  id: string;
  name: string;
  tier: number;
  type: 'ore' | 'refined' | 'component' | 'exotic' | 'quantum' | 'cosmic' | 'essence';
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Transcendent';
  description: string;
  owned: number;
  maxStack: number;
  sources: string[];
  usedIn: string[];
  icon: string;
  color: string;
}

const MATERIALS: Material[] = [
  // Tier 1 - Ores
  { id: 'steel_alloy', name: 'Steel Alloy', tier: 1, type: 'refined', rarity: 'Common', description: 'Standard construction steel, the backbone of any shipyard.', owned: 18500, maxStack: 99999, sources: ['Metal Mines', 'Asteroid Belts', 'Salvage'], usedIn: ['Basic Weapons', 'Hull Plating', 'Modules'], icon: 'ri-hammer-line', color: 'text-slate-400' },
  { id: 'copper_wire', name: 'Copper Wire', tier: 1, type: 'component', rarity: 'Common', description: 'Flexible conductive wire for electronics.', owned: 4200, maxStack: 50000, sources: ['Mining', 'Salvage', 'Trading'], usedIn: ['Circuits', 'Electronics', 'Sensors'], icon: 'ri-cpu-line', color: 'text-slate-400' },
  { id: 'silicon_wafer', name: 'Silicon Wafer', tier: 1, type: 'component', rarity: 'Common', description: 'Semiconductor base for all electronics.', owned: 2800, maxStack: 50000, sources: ['Asteroid Mining', 'Processing Facilities'], usedIn: ['Processors', 'Computers', 'Navigation'], icon: 'ri-subtract-line', color: 'text-slate-400' },
  { id: 'energy_crystal', name: 'Energy Crystal', tier: 1, type: 'ore', rarity: 'Common', description: 'Naturally occurring energy storage crystal.', owned: 6700, maxStack: 99999, sources: ['Crystal Caves', 'Asteroids', 'Comet Tails'], usedIn: ['Shields', 'Weapons', 'Power Cells'], icon: 'ri-flashlight-line', color: 'text-slate-400' },
  { id: 'fuel_cell', name: 'Fuel Cell', tier: 1, type: 'component', rarity: 'Common', description: 'Standard hydrogen fuel cell for ship engines.', owned: 890, maxStack: 10000, sources: ['Refinery', 'Gas Giants', 'Station Supply'], usedIn: ['Engines', 'Reactors', 'Drones'], icon: 'ri-battery-line', color: 'text-slate-400' },
  // Tier 2 - Advanced
  { id: 'titanium_alloy', name: 'Titanium Alloy', tier: 2, type: 'refined', rarity: 'Uncommon', description: 'High-strength lightweight alloy for advanced construction.', owned: 3200, maxStack: 50000, sources: ['Deep Mining', 'Planetary Crust', 'Refining'], usedIn: ['Advanced Armor', 'Heavy Ships', 'Cannons'], icon: 'ri-hammer-fill', color: 'text-green-400' },
  { id: 'plasma_core', name: 'Plasma Core', tier: 2, type: 'component', rarity: 'Uncommon', description: 'Contained plasma for weapons and reactors.', owned: 156, maxStack: 5000, sources: ['Gas Giant Harvesting', 'Plasma Storms', 'Crafting'], usedIn: ['Plasma Weapons', 'Reactors', 'Drones'], icon: 'ri-fire-line', color: 'text-green-400' },
  { id: 'shield_emitter', name: 'Shield Emitter', tier: 2, type: 'component', rarity: 'Uncommon', description: 'Directed energy emitter for shield projection.', owned: 45, maxStack: 2000, sources: ['Crafting', 'Salvage', 'Trading Post'], usedIn: ['Shield Systems', 'Defensive Modules', 'Drones'], icon: 'ri-wifi-line', color: 'text-green-400' },
  { id: 'warp_coil', name: 'Warp Coil', tier: 2, type: 'component', rarity: 'Uncommon', description: 'Superconducting coil for warp field generation.', owned: 28, maxStack: 1000, sources: ['Advanced Crafting', 'Research Labs', 'Trading'], usedIn: ['FTL Drives', 'Jump Gates', 'Stargate Tech'], icon: 'ri-git-branch-line', color: 'text-green-400' },
  { id: 'rare_earth', name: 'Rare Earth Elements', tier: 2, type: 'ore', rarity: 'Uncommon', description: 'Rare mineral compounds essential for advanced tech.', owned: 780, maxStack: 20000, sources: ['Rare Mining', 'Planetary Extraction', 'Volcanic Sites'], usedIn: ['Advanced Electronics', 'Processors', 'Optics'], icon: 'ri-landscape-line', color: 'text-green-400' },
  // Tier 3 - Elite
  { id: 'durasteel', name: 'Durasteel', tier: 3, type: 'refined', rarity: 'Rare', description: 'Ultra-dense composite alloy, nearly indestructible.', owned: 1450, maxStack: 30000, sources: ['Advanced Refinery', 'Deep Space Mining', 'Forges'], usedIn: ['Battleship Hulls', 'Heavy Armor', 'Megastructures'], icon: 'ri-building-line', color: 'text-cyan-400' },
  { id: 'ion_cell', name: 'Ion Cell', tier: 3, type: 'component', rarity: 'Rare', description: 'Ionized energy storage with extreme discharge rate.', owned: 87, maxStack: 3000, sources: ['Ion Harvesting', 'Nebula Mining', 'Advanced Crafting'], usedIn: ['Ion Weapons', 'EMP Devices', 'Disruptors'], icon: 'ri-thunderstorms-line', color: 'text-cyan-400' },
  { id: 'fusion_core', name: 'Fusion Core', tier: 3, type: 'component', rarity: 'Rare', description: 'Miniaturized fusion reactor module.', owned: 34, maxStack: 1000, sources: ['Research Facility', 'Trading Hub', 'Missions'], usedIn: ['Fusion Reactors', 'Drones', 'Weapons'], icon: 'ri-fire-fill', color: 'text-cyan-400' },
  { id: 'reactive_compound', name: 'Reactive Compound', tier: 3, type: 'essence', rarity: 'Rare', description: 'Smart material that adapts to incoming forces.', owned: 22, maxStack: 500, sources: ['Chemical Synthesis', 'Alchemy Lab', 'Research'], usedIn: ['Reactive Armor', 'Adaptive Shields', 'Smart Weapons'], icon: 'ri-test-tube-line', color: 'text-cyan-400' },
  { id: 'raw_nanites', name: 'Raw Nanites', tier: 3, type: 'component', rarity: 'Rare', description: 'Unstructured self-replicating nanoscale machines.', owned: 345, maxStack: 10000, sources: ['Nanotech Lab', 'Salvage', 'Deep Ruins'], usedIn: ['Self-Repair', 'Nanite Swarms', 'Augmentations'], icon: 'ri-cpu-line', color: 'text-cyan-400' },
  // Tier 4 - Master
  { id: 'quantum_steel', name: 'Quantum Steel', tier: 4, type: 'refined', rarity: 'Epic', description: 'Steel woven with quantum-locked molecules. Impossibly strong.', owned: 620, maxStack: 10000, sources: ['Quantum Forge', 'Exotic Mining', 'Ancient Factories'], usedIn: ['Capital Ships', 'Quantum Weapons', 'Titan Construction'], icon: 'ri-box-3-line', color: 'text-fuchsia-400' },
  { id: 'antimatter_cell', name: 'Antimatter Cell', tier: 4, type: 'exotic', rarity: 'Epic', description: 'Magnetically contained antimatter particles.', owned: 18, maxStack: 200, sources: ['Antimatter Reactors', 'Black Holes', 'Research Yield'], usedIn: ['Antimatter Weapons', 'Exotic Reactors', 'Torpedoes'], icon: 'ri-flashlight-fill', color: 'text-fuchsia-400' },
  { id: 'quantum_crystal', name: 'Quantum Crystal', tier: 4, type: 'exotic', rarity: 'Epic', description: 'Entangled crystal pair with instantaneous information transfer.', owned: 35, maxStack: 500, sources: ['Quantum Mining', 'Dimensional Rifts', 'Psionic Caves'], usedIn: ['Quantum Shields', 'Computing', 'Communications'], icon: 'ri-hexagon-line', color: 'text-fuchsia-400' },
  { id: 'quantum_processor', name: 'Quantum Processor', tier: 4, type: 'component', rarity: 'Epic', description: 'Computing unit using superposition for parallel processing.', owned: 12, maxStack: 200, sources: ['Advanced Manufacturing', 'Research Labs', 'Ruins'], usedIn: ['AI Systems', 'Tactical Computers', 'Automation'], icon: 'ri-cpu-fill', color: 'text-fuchsia-400' },
  { id: 'exotic_alloy', name: 'Exotic Alloy', tier: 4, type: 'exotic', rarity: 'Epic', description: 'Multi-dimensional metal blend from alien technology.', owned: 89, maxStack: 2000, sources: ['Alien Tech Salvage', 'Dimensional Pockets', 'Boss Drops'], usedIn: ['Legendary Ships', 'Advanced Modules', 'Portals'], icon: 'ri-star-line', color: 'text-fuchsia-400' },
  // Tier 5 - Legendary
  { id: 'dark_matter_core', name: 'Dark Matter Core', tier: 5, type: 'cosmic', rarity: 'Legendary', description: 'Stabilized dark matter in a magnetic containment field.', owned: 24, maxStack: 100, sources: ['Dark Matter Harvesting', 'Galactic Events', 'Boss Kills'], usedIn: ['Singularity Weapons', 'Hyperdrive', 'Artifacts'], icon: 'ri-contrast-drop-fill', color: 'text-amber-400' },
  { id: 'phase_crystal', name: 'Phase Crystal', tier: 5, type: 'cosmic', rarity: 'Legendary', description: 'Crystal that exists in multiple dimensions simultaneously.', owned: 16, maxStack: 100, sources: ['Dimensional Anomalies', 'Ancient Sites', 'Void Events'], usedIn: ['Cloaking Devices', 'Phase Weapons', 'Portal Tech'], icon: 'ri-contrast-2-line', color: 'text-amber-400' },
  { id: 'cosmic_essence', name: 'Cosmic Essence', tier: 5, type: 'essence', rarity: 'Legendary', description: 'Pure distillation of cosmic energy from stellar events.', owned: 8, maxStack: 50, sources: ['Supernova Events', 'Stellar Forges', 'Cosmic Storms'], usedIn: ['Ultimate Shields', 'Cosmic Weapons', 'Artifacts'], icon: 'ri-sun-line', color: 'text-amber-400' },
  { id: 'cosmic_alloy', name: 'Cosmic Alloy', tier: 5, type: 'cosmic', rarity: 'Legendary', description: 'The ultimate construction material, forged in dying stars.', owned: 180, maxStack: 5000, sources: ['Cosmic Forging', 'Ancient Factories', 'Universe Events'], usedIn: ['Titan Ships', 'Megastructures', 'World Bosses'], icon: 'ri-star-fill', color: 'text-amber-400' },
  { id: 'temporal_fragment', name: 'Temporal Fragment', tier: 5, type: 'essence', rarity: 'Mythic', description: 'Crystallized fragments of time itself. Handle with extreme care.', owned: 5, maxStack: 20, sources: ['Time Anomalies', 'Ancient Ruins', 'Universe Rifts'], usedIn: ['Time Devices', 'Artifacts', 'Ultimate Tech'], icon: 'ri-time-fill', color: 'text-rose-400' },
  // Tier 6 - Transcendent
  { id: 'void_essence', name: 'Void Essence', tier: 6, type: 'cosmic', rarity: 'Transcendent', description: 'The essence of nothingness, extracted from inter-dimensional voids.', owned: 2, maxStack: 10, sources: ['Void Rifts', 'Dimensional Tears', 'End-Game Events'], usedIn: ['Ultimate Artifacts', 'Transcendent Weapons', 'God-Tier Tech'], icon: 'ri-circle-line', color: 'text-rose-400' },
  { id: 'psionic_crystal', name: 'Psionic Crystal', tier: 6, type: 'essence', rarity: 'Transcendent', description: 'Crystallized psychic resonance from ancient hive minds.', owned: 1, maxStack: 5, sources: ['Psionic Entities', 'Mind Temples', 'Consciousness Wells'], usedIn: ['Neural Interfaces', 'Mind Weapons', 'Hive Mind Tech'], icon: 'ri-focus-3-line', color: 'text-rose-400' },
];

const TIER_CONFIG = [
  { tier: 1, label: 'Basic', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
  { tier: 2, label: 'Advanced', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  { tier: 3, label: 'Elite', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  { tier: 4, label: 'Master', color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10 border-fuchsia-500/20' },
  { tier: 5, label: 'Legendary', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { tier: 6, label: 'Transcendent', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
];

const TYPE_TABS = ['all', 'ore', 'refined', 'component', 'exotic', 'essence', 'cosmic'];

export default function CraftingMaterialsPage() {
  const [selectedTier, setSelectedTier] = useState(0);
  const [selectedType, setSelectedType] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Material | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = MATERIALS.filter(m => {
    if (selectedTier !== 0 && m.tier !== selectedTier) return false;
    if (selectedType !== 'all' && m.type !== selectedType) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  MATERIALS.reduce((a, m) => a + m.owned, 0);

  const getTierConfig = (tier: number) => TIER_CONFIG.find(t => t.tier === tier) || TIER_CONFIG[0];

  return (
    <div className="min-h-screen bg-[#080b0f] text-white">
      {/* Hero */}
      <div className="relative h-48 overflow-hidden">
        <img src="https://readdy.ai/api/search-image?query=vast%20alien%20materials%20warehouse%20with%20glowing%20exotic%20ore%20samples%20quantum%20crystals%20dark%20matter%20containers%20arranged%20on%20crystalline%20shelves%20futuristic%20laboratory%20environment%20cold%20blue%20and%20purple%20lighting&width=1920&height=350&seq=materials-hero-1&orientation=landscape" alt="Materials Lab" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-slate-950"></div>
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <h1 className="text-4xl font-black text-white mb-1 flex items-center gap-3"><i className="ri-inbox-2-line text-3xl text-fuchsia-400"></i> Materials Laboratory</h1>
            <p className="text-slate-300">Raw · Refined · Exotic · Cosmic Materials</p>
          </div>
          <div className="ml-auto flex gap-6">
            {TIER_CONFIG.slice(0, 3).map(tc => {
              const count = MATERIALS.filter(m => m.tier === tc.tier).reduce((a, m) => a + m.owned, 0);
              return <div key={tc.tier} className="text-center"><p className={`text-xl font-bold ${tc.color}`}>{count.toLocaleString()}</p><p className="text-xs text-slate-400">T{tc.tier} Stock</p></div>;
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Wishlist Panel */}
        <div className="mb-6">
          <MaterialWishlistPanel />
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          {TIER_CONFIG.map(tc => {
            const mats = MATERIALS.filter(m => m.tier === tc.tier);
            const total = mats.reduce((a, m) => a + m.owned, 0);
            return (
              <button key={tc.tier} onClick={() => setSelectedTier(selectedTier === tc.tier ? 0 : tc.tier)}
                className={`rounded-xl p-3 border text-center transition-all cursor-pointer ${selectedTier === tc.tier ? tc.bg + ' ring-1 ring-current' : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70'}`}>
                <p className={`text-xs font-bold uppercase tracking-widest ${tc.color}`}>{tc.label}</p>
                <p className="text-2xl font-black text-white mt-1">{mats.length}</p>
                <p className="text-xs text-slate-500">{total.toLocaleString()} units</p>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex-1 min-w-48 relative">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search materials..." className="w-full pl-9 pr-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500" />
          </div>
          <div className="flex gap-2">
            {TYPE_TABS.map(t => (
              <button key={t} onClick={() => setSelectedType(t)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${selectedType === t ? 'bg-[#d4a853]/15 text-[#d4a853] border border-[#d4a853]/30' : 'bg-[#080b0f] text-[#8892aa] border border-[#1e2a36] hover:text-white'}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-1 bg-[#080b0f] border border-[#1e2a36] rounded-xl p-1">
            <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-lg cursor-pointer ${viewMode === 'grid' ? 'bg-[#1e2a36] text-white' : 'text-[#8892aa]'}`}><i className="ri-grid-line"></i></button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-lg cursor-pointer ${viewMode === 'list' ? 'bg-[#1e2a36] text-white' : 'text-[#8892aa]'}`}><i className="ri-list-check"></i></button>
          </div>
        </div>

        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {filtered.map(mat => {
            const tc = getTierConfig(mat.tier);
            const stockPct = Math.min(100, (mat.owned / mat.maxStack) * 100);
            return (
              <div key={mat.id} onClick={() => setSelected(mat)}
                className={`bg-[#080b0f] rounded-xl border border-[#1e2a36] hover:border-[#d4a853]/30 transition-all cursor-pointer group ${viewMode === 'list' ? 'flex items-center gap-4 p-4' : 'p-4'}`}>
                {viewMode === 'grid' ? (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 flex items-center justify-center rounded-xl border ${tc.bg}`}>
                        <i className={`${mat.icon} text-xl ${mat.color}`}></i>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full border ${tc.bg} ${tc.color}`}>T{mat.tier}</span>
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1">{mat.name}</h3>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{mat.description}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">In Stock</span>
                      <span className="text-sm font-black text-white">{mat.owned.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-[#1e2a36] rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${mat.tier >= 5 ? 'bg-[#d4a853]' : mat.tier >= 4 ? 'bg-fuchsia-400' : mat.tier >= 3 ? 'bg-cyan-400' : mat.tier >= 2 ? 'bg-green-400' : 'bg-slate-400'}`} style={{ width: `${stockPct}%` }}></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl border ${tc.bg}`}>
                      <i className={`${mat.icon} text-lg ${mat.color}`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white text-sm">{mat.name}</h3>
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${tc.bg} ${tc.color}`}>T{mat.tier}</span>
                        <span className="text-xs text-slate-500 capitalize">{mat.type}</span>
                      </div>
                      <p className="text-xs text-slate-500">{mat.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-black text-white">{mat.owned.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">In stock</p>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-slate-900 border border-[#1e2a36] rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-16 flex items-center justify-center rounded-xl border ${getTierConfig(selected.tier).bg}`}>
                    <i className={`${selected.icon} text-3xl ${selected.color}`}></i>
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">{selected.name}</h2>
                    <p className={`text-sm font-bold ${getTierConfig(selected.tier).color}`}>{getTierConfig(selected.tier).label} · {selected.rarity} · {selected.type}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"><i className="ri-close-line text-xl"></i></button>
              </div>
              <p className="text-slate-300 text-sm mb-5">{selected.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-[#080b0f] rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">In Stock</p>
                  <p className="text-3xl font-black text-white">{selected.owned.toLocaleString()}</p>
                  <div className="mt-2 w-full bg-[#1e2a36] rounded-full h-2">
                    <div className={`h-2 rounded-full ${selected.tier >= 5 ? 'bg-[#d4a853]' : 'bg-fuchsia-400'}`} style={{ width: `${Math.min(100, (selected.owned / selected.maxStack) * 100)}%` }}></div>
                  </div>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Max Stack</p>
                  <p className="text-3xl font-black text-white">{selected.maxStack.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 mt-1">Tier {selected.tier} material</p>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Sources</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.sources.map(s => <span key={s} className="bg-slate-800 text-slate-300 px-2 py-1 rounded-lg text-xs">{s}</span>)}
                </div>
              </div>
              <div className="mb-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Used In</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.usedIn.map(u => <span key={u} className="bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 px-2 py-1 rounded-lg text-xs">{u}</span>)}
                </div>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-[#d4a853] to-[#e2c044] text-[#080b0f] rounded-xl font-bold cursor-pointer hover:from-amber-400 hover:to-amber-300 transition-all whitespace-nowrap">
                <i className="ri-shopping-cart-line mr-2"></i>Purchase More
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}