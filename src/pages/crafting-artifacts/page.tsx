import { useState } from 'react';
import { useRecipeUnlocks } from '@/hooks/useRecipeUnlocks';
import RecipeUnlockBadge from '@/components/feature/RecipeUnlockBadge';
import { CRAFTING_TITLES, useCraftingRank } from '@/hooks/useCraftingRank';
import { Link } from 'react-router-dom';
import RecipeUnlockRankUpToast from '@/components/feature/RecipeUnlockRankUpToast';
import { useMaterialWishlist } from '@/hooks/useMaterialWishlist';

interface Artifact {
  id: string;
  name: string;
  category: 'relics' | 'time' | 'void' | 'cosmic' | 'dimensional' | 'mythic';
  tier: number;
  rarity: 'Epic' | 'Legendary' | 'Mythic' | 'Universal';
  origin: string;
  description: string;
  lore: string;
  powers: { name: string; description: string; icon: string }[];
  materials: { name: string; amount: number; owned: number; icon: string }[];
  craftTime: number;
  reqLevel: number;
  reqSkill: string;
  reqSkillLvl: number;
  owned: boolean;
}

const ARTIFACTS: Artifact[] = [
  // Relics
  { id: 'art1', name: 'Ancient Precursor Relic', category: 'relics', tier: 4, rarity: 'Epic', origin: 'Unknown Precursor Civilization', description: 'A mysterious device from a long-extinct civilization. Still functional, purpose unknown.', lore: 'Found floating in the ruins of Kepler Station. The precursors vanished 8 million years ago, yet this hums with power.', powers: [{ name: 'All Stats +500', description: 'Mysterious energy boosts all ship parameters', icon: 'ri-star-line' }, { name: 'Anomaly Sense', description: 'Detects hidden anomalies within 10,000 AU', icon: 'ri-radar-line' }], materials: [{ name: 'Cosmic Alloy', amount: 500, owned: 180, icon: 'ri-star-fill' }, { name: 'Temporal Fragment', amount: 3, owned: 5, icon: 'ri-time-fill' }, { name: 'Exotic Matter', amount: 50, owned: 25, icon: 'ri-star-line' }], craftTime: 7200, reqLevel: 50, reqSkill: 'Alchemy', reqSkillLvl: 8, owned: true },
  { id: 'art2', name: 'Precursor Key Fragment', category: 'relics', tier: 4, rarity: 'Epic', origin: 'Precursor Archive Site', description: 'A fragment of a larger precursor key that unlocks sealed vaults.', lore: 'Three fragments make a whole. You found one. Where are the others?', powers: [{ name: 'Vault Access', description: 'Unlocks minor precursor vaults', icon: 'ri-lock-unlock-line' }, { name: 'Translation Protocol', description: 'Deciphers 30% of precursor language', icon: 'ri-translate' }], materials: [{ name: 'Cosmic Alloy', amount: 200, owned: 180, icon: 'ri-star-fill' }, { name: 'Quantum Crystal', amount: 15, owned: 35, icon: 'ri-hexagon-line' }], craftTime: 4200, reqLevel: 40, reqSkill: 'Alchemy', reqSkillLvl: 7, owned: false },
  // Time
  { id: 'art3', name: 'Temporal Time Crystal', category: 'time', tier: 5, rarity: 'Legendary', origin: 'Time Anomaly Zone Sigma-7', description: 'A crystal that crystallizes time itself. Allows limited temporal manipulation.', lore: 'The universe keeps very careful track of who borrows time. You will pay it back. With interest.', powers: [{ name: 'Time Rewind', description: 'Rewind 60 seconds of combat once per day', icon: 'ri-refresh-line' }, { name: 'Temporal Stasis', description: 'Freeze enemies for 10 seconds', icon: 'ri-pause-circle-line' }, { name: 'Fast Forward', description: 'Skip all production timers by 2 hours', icon: 'ri-skip-forward-line' }], materials: [{ name: 'Temporal Fragment', amount: 10, owned: 5, icon: 'ri-time-fill' }, { name: 'Cosmic Essence', amount: 5, owned: 8, icon: 'ri-sun-line' }, { name: 'Void Essence', amount: 1, owned: 2, icon: 'ri-circle-line' }], craftTime: 10800, reqLevel: 60, reqSkill: 'Alchemy', reqSkillLvl: 10, owned: false },
  // Void
  { id: 'art4', name: 'Void Stone', category: 'void', tier: 5, rarity: 'Legendary', origin: 'Outer Void Dimension', description: 'A stone from the void between dimensions. Absorbs incoming damage.', lore: 'The void doesn\'t want you there. But it doesn\'t mind if you carry a piece of it.', powers: [{ name: 'Void Absorption', description: 'Absorbs 35% of all incoming damage', icon: 'ri-drop-line' }, { name: 'Void Shroud', description: 'Becomes invisible in void zones', icon: 'ri-eye-off-line' }, { name: 'Dimension Bleed', description: 'Attacks deal +200% damage in void zones', icon: 'ri-flashlight-fill' }], materials: [{ name: 'Dark Matter Core', amount: 15, owned: 24, icon: 'ri-contrast-drop-fill' }, { name: 'Phase Crystal', amount: 8, owned: 16, icon: 'ri-contrast-2-line' }, { name: 'Void Essence', amount: 2, owned: 2, icon: 'ri-circle-line' }], craftTime: 9600, reqLevel: 65, reqSkill: 'Alchemy', reqSkillLvl: 9, owned: false },
  // Cosmic
  { id: 'art5', name: 'Heart of a Dying Star', category: 'cosmic', tier: 5, rarity: 'Legendary', origin: 'Collapsing Supergiant NGC-7492', description: 'The crystallized core of a dying star. Contains inexhaustible stellar energy.', lore: 'A trillion years of stellar fusion compressed into a crystal you can hold. Handle it carefully.', powers: [{ name: 'Infinite Energy', description: 'Never run out of power in combat', icon: 'ri-battery-fill' }, { name: 'Solar Flare', description: 'Emit massive energy wave once per battle', icon: 'ri-sun-fill' }, { name: 'Stellar Resonance', description: '+75% to all energy weapon damage', icon: 'ri-fire-fill' }], materials: [{ name: 'Cosmic Essence', amount: 10, owned: 8, icon: 'ri-sun-line' }, { name: 'Antimatter Cell', amount: 15, owned: 18, icon: 'ri-flashlight-fill' }, { name: 'Temporal Fragment', amount: 5, owned: 5, icon: 'ri-time-fill' }], craftTime: 12000, reqLevel: 68, reqSkill: 'Alchemy', reqSkillLvl: 10, owned: false },
  { id: 'art6', name: 'Reality Shard', category: 'cosmic', tier: 5, rarity: 'Legendary', origin: 'Reality Fracture Point Omega', description: 'A fragment of reality itself. Bends probability in your favor.', lore: 'Reality is more suggestion than rule, for those bold enough to ignore it.', powers: [{ name: 'Probability Bend', description: '15% chance to dodge any attack completely', icon: 'ri-shuffle-line' }, { name: 'Reality Rewrite', description: 'Reroll any combat result once per battle', icon: 'ri-dice-line' }, { name: 'Lucky Break', description: '+50% loot quality from all sources', icon: 'ri-gift-line' }], materials: [{ name: 'Cosmic Essence', amount: 8, owned: 8, icon: 'ri-sun-line' }, { name: 'Quantum Crystal', amount: 12, owned: 35, icon: 'ri-hexagon-line' }, { name: 'Exotic Alloy', amount: 100, owned: 89, icon: 'ri-star-line' }], craftTime: 9000, reqLevel: 62, reqSkill: 'Alchemy', reqSkillLvl: 9, owned: false },
  // Dimensional
  { id: 'art7', name: 'Omega Key', category: 'dimensional', tier: 5, rarity: 'Legendary', origin: 'The Archive of All Doors', description: 'Unlocks any door, vault, sealed area, or dimension in the known universe.', lore: 'Made by the first beings. Stolen by the second. Lost by the third. You found it.', powers: [{ name: 'Universal Access', description: 'Unlocks all vaults and sealed areas', icon: 'ri-lock-unlock-line' }, { name: 'Dimension Door', description: 'Open portals to any visited system', icon: 'ri-door-open-line' }, { name: 'Hidden Passage', description: 'Reveals secret areas on any map', icon: 'ri-map-2-line' }], materials: [{ name: 'Cosmic Alloy', amount: 1000, owned: 180, icon: 'ri-star-fill' }, { name: 'Phase Crystal', amount: 12, owned: 16, icon: 'ri-contrast-2-line' }, { name: 'Temporal Fragment', amount: 8, owned: 5, icon: 'ri-time-fill' }], craftTime: 12600, reqLevel: 70, reqSkill: 'Alchemy', reqSkillLvl: 10, owned: false },
  // Mythic
  { id: 'art8', name: 'Genesis Seed', category: 'mythic', tier: 5, rarity: 'Mythic', origin: 'Creation Point Zero', description: 'Contains the blueprint for creating new life and terraforming worlds instantly.', lore: 'God dropped this. No, literally. We found it in the ruins of Creation Point Zero.', powers: [{ name: 'Instant Terraform', description: 'Transform any planet instantly', icon: 'ri-earth-line' }, { name: 'Life Spark', description: 'Spawn a planet full of life', icon: 'ri-seedling-line' }, { name: 'Genesis Nova', description: 'Ultimate weapon: creates new star', icon: 'ri-sun-fill' }], materials: [{ name: 'Cosmic Essence', amount: 20, owned: 8, icon: 'ri-sun-line' }, { name: 'Temporal Fragment', amount: 15, owned: 5, icon: 'ri-time-fill' }, { name: 'Void Essence', amount: 5, owned: 2, icon: 'ri-circle-line' }], craftTime: 18000, reqLevel: 80, reqSkill: 'Alchemy', reqSkillLvl: 10, owned: false },
  { id: 'art9', name: 'Infinity Gauntlet', category: 'mythic', tier: 5, rarity: 'Universal', origin: 'Beyond Known Reality', description: 'The ultimate power artifact. Doubles all stats and abilities. One of a kind.', lore: 'Snap carefully. We mean that.', powers: [{ name: 'Double All Stats', description: 'Every stat and ability is multiplied by 2', icon: 'ri-star-fill' }, { name: 'Reality Snap', description: 'Eliminate 50% of enemy fleet instantly', icon: 'ri-flashlight-fill' }, { name: 'Infinite Power', description: 'All abilities have no cooldown', icon: 'ri-timer-fill' }, { name: 'Cosmic Immunity', description: 'Immune to all status effects', icon: 'ri-shield-star-line' }], materials: [{ name: 'Cosmic Essence', amount: 30, owned: 8, icon: 'ri-sun-line' }, { name: 'Temporal Fragment', amount: 20, owned: 5, icon: 'ri-time-fill' }, { name: 'Dark Matter Core', amount: 15, owned: 24, icon: 'ri-contrast-drop-fill' }, { name: 'Void Essence', amount: 8, owned: 2, icon: 'ri-circle-line' }], craftTime: 28800, reqLevel: 99, reqSkill: 'Alchemy', reqSkillLvl: 10, owned: false },
];

const CAT_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  relics: { label: 'Ancient Relics', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: 'ri-ancient-gate-line' },
  time: { label: 'Temporal', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', icon: 'ri-time-fill' },
  void: { label: 'Void', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20', icon: 'ri-circle-line' },
  cosmic: { label: 'Cosmic', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: 'ri-sun-line' },
  dimensional: { label: 'Dimensional', color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10 border-fuchsia-500/20', icon: 'ri-door-open-line' },
  mythic: { label: 'Mythic', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', icon: 'ri-sword-fill' },
};

const RARITY_STYLES: Record<string, string> = {
  Epic: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10',
  Legendary: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  Mythic: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
  Universal: 'text-cyan-300 border-cyan-400/40 bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10',
};

export default function CraftingArtifactsPage() {
  const { isUnlocked, getStatus, upcomingAtNextRank } = useRecipeUnlocks();
  const { recentUnlock } = useCraftingRank();
  const { addToWishlist, items: wishlistItems } = useMaterialWishlist();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selected, setSelected] = useState<Artifact | null>(null);
  const [pinnedToast, setPinnedToast] = useState<string | null>(null);

  const filtered = activeCategory === 'all' ? ARTIFACTS : ARTIFACTS.filter(a => a.category === activeCategory);
  const owned = ARTIFACTS.filter(a => a.owned).length;
  const upcomingArts = upcomingAtNextRank.filter(r => r.page === 'artifacts');
  const canCraft = (a: Artifact) => a.materials.every(m => m.owned >= m.amount);
  const formatTime = (s: number) => s >= 3600 ? `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m` : `${Math.floor(s / 60)}m`;

  const isPinned = (recipeId: string) => wishlistItems.some(i => i.recipeId === recipeId);

  const handlePinWishlist = () => {
    if (!selected) return;
    addToWishlist(
      selected.materials.map(m => ({ name: m.name, icon: m.icon, amount: m.amount, owned: m.owned })),
      selected.name,
      selected.id,
      'artifacts'
    );
    setPinnedToast(`${selected.name} pinned!`);
    setTimeout(() => setPinnedToast(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080b0f] text-white">
      {/* Rank-up recipe unlock toast */}
      <RecipeUnlockRankUpToast newRank={recentUnlock} pageFilter={['artifacts']} />

      {/* Pin toast */}
      {pinnedToast && (
        <div className="fixed top-4 right-4 z-[60] bg-slate-900 border border-cyan-500/40 rounded-xl px-4 py-3 flex items-center gap-2 shadow-lg">
          <i className="ri-bookmark-fill text-cyan-400"></i>
          <span className="text-sm font-bold text-white">{pinnedToast}</span>
        </div>
      )}

      {/* Hero */}
      <div className="relative h-56 overflow-hidden">
        <img src="https://readdy.ai/api/search-image?query=mystical%20alien%20artifact%20museum%20with%20glowing%20ancient%20relics%20floating%20in%20stasis%20fields%20cosmic%20energy%20swirling%20around%20mysterious%20objects%20dark%20atmospheric%20sci-fi%20gallery%20environment%20orange%20gold%20and%20purple%20lighting&width=1920&height=400&seq=artifacts-hero-1&orientation=landscape" alt="Artifacts" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-slate-950"></div>
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <h1 className="text-4xl font-black text-white flex items-center gap-3 mb-1"><i className="ri-ancient-pavilion-line text-3xl text-amber-400"></i> Artifact Workshop</h1>
            <p className="text-slate-300">Forge legendary artifacts of immense power</p>
            <div className="flex gap-5 mt-3">
              <div><p className="text-2xl font-bold text-amber-400">{owned}</p><p className="text-xs text-slate-400">Owned</p></div>
              <div><p className="text-2xl font-bold text-fuchsia-400">{ARTIFACTS.length - owned}</p><p className="text-xs text-slate-400">Available</p></div>
              <div><p className="text-2xl font-bold text-rose-400">3</p><p className="text-xs text-slate-400">Mythic Tier</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => setActiveCategory('all')} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${activeCategory === 'all' ? 'bg-[#d4a853]/15 text-[#d4a853] border border-[#d4a853]/30' : 'bg-[#080b0f] text-[#8892aa] border border-[#1e2a36] hover:text-white'}`}>
            All Artifacts
          </button>
          {Object.entries(CAT_CONFIG).map(([cat, cfg]) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer border ${activeCategory === cat ? `${cfg.bg} ${cfg.color}` : 'bg-[#080b0f] text-[#8892aa] border-[#1e2a36] hover:text-white'}`}>
              <i className={`${cfg.icon} mr-1`}></i>{cfg.label}
            </button>
          ))}
        </div>

        {/* Upcoming unlocks banner */}
        {upcomingArts.length > 0 && (
          <div className="bg-slate-800/40 border border-amber-500/20 rounded-xl p-4 mb-5">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <i className="ri-lock-line"></i> Unlock at Next Rank
            </h4>
            <div className="flex flex-wrap gap-2">
              {upcomingArts.map(r => {
                const rd = CRAFTING_TITLES[r.minRank - 1];
                return (
                  <span key={r.recipeId} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-900/60 border" style={{ borderColor: `${rd.color}35` }}>
                    <i className={`${r.icon} text-sm`} style={{ color: rd.color }}></i>
                    <span className="text-slate-300 font-medium">{r.recipeName}</span>
                    <span className="text-slate-500">· {rd.badge}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Artifact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(art => {
            const catCfg = CAT_CONFIG[art.category];
            const locked = !isUnlocked(art.id);
            const status = getStatus(art.id);
            const lockRank = status ? CRAFTING_TITLES[status.minRank - 1] : null;
            const pinned = isPinned(art.id);
            return (
              <div key={art.id} onClick={() => { if (!locked) setSelected(art); }}
                className={`relative bg-slate-800/50 rounded-xl border transition-all overflow-hidden
                  ${locked ? 'cursor-not-allowed opacity-75 border-slate-800/60' : `cursor-pointer group hover:border-amber-400/40 ${art.owned ? 'border-amber-500/40 ring-1 ring-amber-500/20' : 'border-slate-700/50'} ${art.rarity === 'Universal' ? 'ring-1 ring-fuchsia-400/30' : ''}`}`}>

                {(art.rarity === 'Mythic' || art.rarity === 'Universal') && !locked ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-900/5 via-transparent to-amber-900/5 pointer-events-none"></div>
                ) : null}

                {locked && lockRank && (
                  <div className="absolute inset-0 z-10 bg-slate-950/75 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                    <div className="text-center px-4">
                      <div className="w-12 h-12 flex items-center justify-center mx-auto bg-slate-800 rounded-full border border-slate-700 mb-2">
                        <i className="ri-lock-line text-xl text-slate-400"></i>
                      </div>
                      <p className="text-xs text-slate-400 font-bold">Requires</p>
                      <p className="text-sm font-black" style={{ color: lockRank.color }}>{lockRank.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{lockRank.spRequired} SP Total</p>
                      <Link to="/crafting-rank" onClick={e => e.stopPropagation()} className="mt-2 inline-block text-[10px] text-emerald-400 hover:underline cursor-pointer">Increase Rank &rarr;</Link>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 flex items-center justify-center rounded-xl border ${catCfg.bg}`}>
                      <i className={`${catCfg.icon} text-2xl ${catCfg.color}`}></i>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full border ${RARITY_STYLES[art.rarity]}`}>{art.rarity}</span>
                      {art.owned && <div className="text-xs text-amber-400 font-bold mt-1"><i className="ri-check-line"></i> Owned</div>}
                      {status && <div className="mt-1"><RecipeUnlockBadge minRank={status.minRank} unlocked={!locked} compact /></div>}
                      {pinned && !locked && (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded-full">
                            <i className="ri-bookmark-fill"></i>Pinned
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-white mb-1">{art.name}</h3>
                  <p className="text-xs text-slate-500 mb-2">{art.origin}</p>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">{art.description}</p>
                  <div className="space-y-2 mb-4">
                    {art.powers.slice(0, 2).map((p, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <i className={`${p.icon} text-amber-400 text-sm`}></i>
                        <span className="text-xs text-amber-300 font-bold">{p.name}</span>
                      </div>
                    ))}
                    {art.powers.length > 2 && <p className="text-xs text-slate-500">+{art.powers.length - 2} more powers</p>}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-700/50 pt-3">
                    <span><i className="ri-time-line mr-1"></i>{formatTime(art.craftTime)}</span>
                    <span><i className="ri-user-line mr-1"></i>Lv.{art.reqLevel}</span>
                    <span className={locked ? 'text-slate-500 font-bold' : canCraft(art) ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                      {locked ? 'Locked' : canCraft(art) ? 'Craftable' : 'Needs Mats'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">{selected.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${RARITY_STYLES[selected.rarity]}`}>{selected.rarity}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${CAT_CONFIG[selected.category].bg} ${CAT_CONFIG[selected.category].color}`}>{CAT_CONFIG[selected.category].label}</span>
                    {selected.owned && <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-1 rounded-full">Owned</span>}
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"><i className="ri-close-line text-xl"></i></button>
              </div>

              <p className="text-xs text-slate-500 mb-1">Origin: {selected.origin}</p>
              <p className="text-slate-400 italic text-sm mb-2">"{selected.lore}"</p>
              <p className="text-slate-300 text-sm mb-5">{selected.description}</p>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-5">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">Artifact Powers</h4>
                {selected.powers.map((p, i) => (
                  <div key={i} className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-amber-500/10 rounded-lg border border-amber-500/20">
                      <i className={`${p.icon} text-amber-400`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amber-300">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-800/60 rounded-xl p-4 mb-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Materials Required</h4>
                {selected.materials.map(m => {
                  const ok = m.owned >= m.amount;
                  return (
                    <div key={m.name} className="flex justify-between mb-2">
                      <div className="flex items-center gap-2"><i className={`${m.icon} text-slate-400`}></i><span className="text-sm text-white">{m.name}</span></div>
                      <span className={`text-sm font-bold ${ok ? 'text-green-400' : 'text-red-400'}`}>{m.owned}/{m.amount}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 mb-5 text-sm text-slate-400">
                <div className="bg-slate-800 rounded-xl px-4 py-3"><i className="ri-time-line mr-2 text-amber-400"></i><span className="text-white font-bold">{formatTime(selected.craftTime)}</span></div>
                <div className="bg-slate-800 rounded-xl px-4 py-3"><i className="ri-user-line mr-2 text-amber-400"></i><span className="text-white font-bold">Lv.{selected.reqLevel}</span></div>
                <div className="bg-slate-800 rounded-xl px-4 py-3"><i className="ri-flask-line mr-2 text-amber-400"></i><span className="text-white font-bold">{selected.reqSkill} {selected.reqSkillLvl}</span></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handlePinWishlist}
                  className="py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <i className="ri-bookmark-line"></i>
                  Pin to Wishlist
                </button>
                <button disabled={!canCraft(selected) || selected.owned}
                  className={`py-3 rounded-xl font-black text-sm transition-all whitespace-nowrap ${selected.owned ? 'bg-amber-500/20 text-amber-400 cursor-default' : canCraft(selected) ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 cursor-pointer' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
                  {selected.owned ? <><i className="ri-check-line mr-2"></i>Already Owned</> : canCraft(selected) ? <><i className="ri-ancient-pavilion-line mr-2"></i>Forge Artifact</> : <><i className="ri-close-line mr-2"></i>Insufficient Materials</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}