import { useState } from 'react';
import { useRecipeUnlocks } from '@/hooks/useRecipeUnlocks';
import RecipeUnlockBadge from '@/components/feature/RecipeUnlockBadge';
import { CRAFTING_TITLES, useCraftingRank } from '@/hooks/useCraftingRank';
import { Link } from 'react-router-dom';
import RecipeUnlockRankUpToast from '@/components/feature/RecipeUnlockRankUpToast';
import { useMaterialWishlist } from '@/hooks/useMaterialWishlist';

interface Augmentation {
  id: string;
  name: string;
  slot: 'neural' | 'combat' | 'utility' | 'defense' | 'power';
  tier: number;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  description: string;
  lore: string;
  bonuses: { stat: string; value: string; icon: string }[];
  tradeoffs: string[];
  materials: { name: string; amount: number; owned: number; icon: string }[];
  craftTime: number;
  reqLevel: number;
  installed: boolean;
  stackable: boolean;
  maxStacks: number;
  currentStacks: number;
}

const AUGMENTATIONS: Augmentation[] = [
  // Neural
  { id: 'aug1', name: 'Command Synapse Array', slot: 'neural', tier: 2, rarity: 'Uncommon', description: 'Neural implant that expands fleet command capacity and reaction times.', lore: 'Brain-computer interfaces. Not for the faint of heart.', bonuses: [{ stat: 'Fleet Command', value: '+20%', icon: 'ri-user-star-line' }, { stat: 'Reaction Time', value: '-30%', icon: 'ri-timer-line' }], tradeoffs: ['Causes mild headaches'], materials: [{ name: 'Quantum Processor', amount: 2, owned: 5, icon: 'ri-cpu-fill' }, { name: 'Raw Nanites', amount: 80, owned: 345, icon: 'ri-cpu-line' }], craftTime: 1800, reqLevel: 15, installed: true, stackable: false, maxStacks: 1, currentStacks: 1 },
  { id: 'aug2', name: 'Tactical Prediction Engine', slot: 'neural', tier: 4, rarity: 'Epic', description: 'Predicts enemy movements up to 2 seconds in the future using quantum calculation.', lore: 'Two seconds is an eternity in space combat.', bonuses: [{ stat: 'Hit Chance', value: '+35%', icon: 'ri-focus-3-line' }, { stat: 'Dodge Chance', value: '+20%', icon: 'ri-run-line' }, { stat: 'Crit Multiplier', value: '+50%', icon: 'ri-sword-line' }], tradeoffs: ['Slight cognitive overload', 'Reduced non-combat focus'], materials: [{ name: 'Quantum Processor', amount: 8, owned: 5, icon: 'ri-cpu-fill' }, { name: 'Exotic Matter', amount: 10, owned: 25, icon: 'ri-star-line' }, { name: 'Psionic Crystal', amount: 1, owned: 1, icon: 'ri-focus-3-line' }], craftTime: 4200, reqLevel: 48, installed: false, stackable: false, maxStacks: 1, currentStacks: 0 },
  // Combat
  { id: 'aug3', name: 'Combat Reflex Enhancer', slot: 'combat', tier: 3, rarity: 'Rare', description: 'Muscle-memory accelerator for faster weapons operation.', lore: 'Pull the trigger before you even think to pull it.', bonuses: [{ stat: 'Attack Speed', value: '+30%', icon: 'ri-flashlight-line' }, { stat: 'Reload Speed', value: '+25%', icon: 'ri-refresh-line' }], tradeoffs: ['Uses 5% more energy'], materials: [{ name: 'Ion Cell', amount: 5, owned: 87, icon: 'ri-thunderstorms-line' }, { name: 'Quantum Processor', amount: 3, owned: 5, icon: 'ri-cpu-fill' }], craftTime: 2400, reqLevel: 28, installed: true, stackable: true, maxStacks: 3, currentStacks: 2 },
  { id: 'aug4', name: 'Weapons Damage Amplifier', slot: 'combat', tier: 4, rarity: 'Epic', description: 'Amplifies all weapon systems by feeding raw energy directly into power conduits.', lore: 'More power. Always more power.', bonuses: [{ stat: 'All Weapon Damage', value: '+40%', icon: 'ri-sword-line' }, { stat: 'Energy Weapons', value: '+55%', icon: 'ri-fire-line' }], tradeoffs: ['10% chance of power surge', '+15% energy consumption'], materials: [{ name: 'Antimatter Cell', amount: 5, owned: 18, icon: 'ri-flashlight-fill' }, { name: 'Quantum Crystal', amount: 3, owned: 35, icon: 'ri-hexagon-line' }], craftTime: 3300, reqLevel: 40, installed: false, stackable: false, maxStacks: 1, currentStacks: 0 },
  // Defense
  { id: 'aug5', name: 'Personal Shield Matrix', slot: 'defense', tier: 3, rarity: 'Rare', description: 'Projects a personal energy shield around the vessel.', lore: 'Every commander deserves their own shield.', bonuses: [{ stat: 'Personal Shield', value: '+3000', icon: 'ri-shield-line' }, { stat: 'Shield Regen', value: '+50/s', icon: 'ri-heart-line' }], tradeoffs: ['Reduces speed by 5%'], materials: [{ name: 'Shield Emitter', amount: 8, owned: 45, icon: 'ri-wifi-line' }, { name: 'Exotic Alloy', amount: 10, owned: 89, icon: 'ri-star-line' }], craftTime: 2700, reqLevel: 25, installed: false, stackable: true, maxStacks: 2, currentStacks: 0 },
  { id: 'aug6', name: 'Nanite Regeneration Network', slot: 'defense', tier: 4, rarity: 'Epic', description: 'Self-replicating nanites continuously repair hull damage.', lore: 'Your ship is now partially alive. Treat it accordingly.', bonuses: [{ stat: 'Hull Regen', value: '200/s', icon: 'ri-heart-pulse-line' }, { stat: 'Armor', value: '+2000', icon: 'ri-shield-fill' }, { stat: 'Max HP', value: '+25%', icon: 'ri-add-line' }], tradeoffs: ['Nanites consume 2% metal/day'], materials: [{ name: 'Raw Nanites', amount: 500, owned: 345, icon: 'ri-cpu-line' }, { name: 'Quantum Processor', amount: 5, owned: 5, icon: 'ri-cpu-fill' }, { name: 'Dark Matter Core', amount: 3, owned: 24, icon: 'ri-contrast-drop-fill' }], craftTime: 4800, reqLevel: 45, installed: false, stackable: false, maxStacks: 1, currentStacks: 0 },
  // Utility
  { id: 'aug7', name: 'Resource Optimizer Chip', slot: 'utility', tier: 2, rarity: 'Uncommon', description: 'Optimizes resource consumption across all ship systems.', lore: 'Efficiency is a virtue. Waste is sin.', bonuses: [{ stat: 'Resource Cost', value: '-20%', icon: 'ri-money-cny-circle-line' }, { stat: 'Fuel Efficiency', value: '+25%', icon: 'ri-drop-line' }], tradeoffs: ['None'], materials: [{ name: 'Silicon Wafer', amount: 200, owned: 2800, icon: 'ri-subtract-line' }, { name: 'Rare Earth', amount: 30, owned: 780, icon: 'ri-landscape-line' }], craftTime: 1500, reqLevel: 12, installed: true, stackable: true, maxStacks: 3, currentStacks: 1 },
  { id: 'aug8', name: 'Dimensional Cargo Expander', slot: 'utility', tier: 4, rarity: 'Epic', description: 'Folds extra-dimensional space into cargo holds.', lore: 'The inside is bigger than the outside. Don\'t think too hard about it.', bonuses: [{ stat: 'Cargo Capacity', value: '+300%', icon: 'ri-inbox-2-line' }, { stat: 'Resource Stack', value: '+200%', icon: 'ri-stack-line' }], tradeoffs: ['Quantum instability risk 1%/day'], materials: [{ name: 'Exotic Alloy', amount: 30, owned: 89, icon: 'ri-star-line' }, { name: 'Phase Crystal', amount: 3, owned: 16, icon: 'ri-contrast-2-line' }], craftTime: 3600, reqLevel: 40, installed: false, stackable: false, maxStacks: 1, currentStacks: 0 },
  // Power
  { id: 'aug9', name: 'Zero-Point Tap', slot: 'power', tier: 5, rarity: 'Legendary', description: 'Taps into quantum vacuum energy for near-infinite power.', lore: 'Physics professors still argue this shouldn\'t work.', bonuses: [{ stat: 'Energy Output', value: '+150%', icon: 'ri-battery-fill' }, { stat: 'Power Efficiency', value: '+80%', icon: 'ri-flashlight-line' }, { stat: 'Cooldown Reduction', value: '-40%', icon: 'ri-timer-line' }], tradeoffs: ['Occasional reality fluctuations'], materials: [{ name: 'Cosmic Essence', amount: 5, owned: 8, icon: 'ri-sun-line' }, { name: 'Quantum Crystal', amount: 8, owned: 35, icon: 'ri-hexagon-line' }, { name: 'Temporal Fragment', amount: 2, owned: 5, icon: 'ri-time-fill' }], craftTime: 7200, reqLevel: 60, installed: false, stackable: false, maxStacks: 1, currentStacks: 0 },
  { id: 'aug10', name: 'Cosmic Attunement Matrix', slot: 'power', tier: 5, rarity: 'Mythic', description: 'Harmonizes the vessel with cosmic background energies. All stats doubled.', lore: 'The ship and the universe become one. Mostly.', bonuses: [{ stat: 'ALL STATS', value: '+100%', icon: 'ri-star-fill' }, { stat: 'Cosmic Immunity', value: 'Full', icon: 'ri-shield-star-line' }], tradeoffs: ['Requires ritual alignment every 30 days', 'Side effects unknown'], materials: [{ name: 'Cosmic Essence', amount: 15, owned: 8, icon: 'ri-sun-line' }, { name: 'Temporal Fragment', amount: 8, owned: 5, icon: 'ri-time-fill' }, { name: 'Dark Matter Core', amount: 10, owned: 24, icon: 'ri-contrast-drop-fill' }], craftTime: 14400, reqLevel: 75, installed: false, stackable: false, maxStacks: 1, currentStacks: 0 },
];

const SLOT_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  neural: { label: 'Neural', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30', icon: 'ri-brain-line' },
  combat: { label: 'Combat', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: 'ri-sword-line' },
  defense: { label: 'Defense', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', icon: 'ri-shield-line' },
  utility: { label: 'Utility', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: 'ri-settings-3-line' },
  power: { label: 'Power', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', icon: 'ri-battery-fill' },
};

const RARITY_STYLES: Record<string, string> = {
  Common: 'text-slate-400 border-slate-500/30 bg-slate-500/10',
  Uncommon: 'text-green-400 border-green-500/30 bg-green-500/10',
  Rare: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  Epic: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10',
  Legendary: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  Mythic: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
};

export default function CraftingAugmentationsPage() {
  const { isUnlocked, getStatus, upcomingAtNextRank } = useRecipeUnlocks();
  const { recentUnlock } = useCraftingRank();
  const { addToWishlist, items: wishlistItems } = useMaterialWishlist();
  const [activeSlot, setActiveSlot] = useState('all');
  const [selected, setSelected] = useState<Augmentation | null>(null);
  const [qty, setQty] = useState(1);
  const [pinnedToast, setPinnedToast] = useState<string | null>(null);

  const filtered = activeSlot === 'all' ? AUGMENTATIONS : AUGMENTATIONS.filter(a => a.slot === activeSlot);
  const installed = AUGMENTATIONS.filter(a => a.installed);
  const upcomingAugs = upcomingAtNextRank.filter(r => r.page === 'laboratory');
  const canCraft = (a: Augmentation) => a.materials.every(m => m.owned >= m.amount * qty);
  const formatTime = (s: number) => s >= 3600 ? `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m` : `${Math.floor(s / 60)}m`;

  const isPinned = (recipeId: string) => wishlistItems.some(i => i.recipeId === recipeId);

  const handlePinWishlist = () => {
    if (!selected) return;
    addToWishlist(
      selected.materials.map(m => ({ name: m.name, icon: m.icon, amount: m.amount * qty, owned: m.owned })),
      selected.name,
      selected.id,
      'laboratory'
    );
    setPinnedToast(`${selected.name} pinned!`);
    setTimeout(() => setPinnedToast(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080b0f] text-white">
      {/* Rank-up recipe unlock toast */}
      <RecipeUnlockRankUpToast newRank={recentUnlock} pageFilter={['laboratory']} />

      {/* Pin toast */}
      {pinnedToast && (
        <div className="fixed top-4 right-4 z-[60] bg-slate-900 border border-cyan-500/40 rounded-xl px-4 py-3 flex items-center gap-2 shadow-lg">
          <i className="ri-bookmark-fill text-cyan-400"></i>
          <span className="text-sm font-bold text-white">{pinnedToast}</span>
        </div>
      )}

      {/* Hero */}
      <div className="relative h-52 overflow-hidden">
        <img src="https://readdy.ai/api/search-image?query=futuristic%20cybernetic%20augmentation%20lab%20with%20glowing%20implants%20in%20display%20cases%20holographic%20body%20scans%20neural%20interface%20equipment%20clean%20white%20and%20blue%20sci-fi%20medical%20facility&width=1920&height=380&seq=aug-hero-1&orientation=landscape" alt="Augmentations" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-slate-950"></div>
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <h1 className="text-4xl font-black text-white flex items-center gap-3 mb-1"><i className="ri-body-scan-line text-3xl text-fuchsia-400"></i> Augmentations Lab</h1>
            <p className="text-slate-300">Enhance your ship and commander with cybernetic augmentations</p>
            <p className="text-fuchsia-400 text-sm mt-1 font-bold"><i className="ri-check-line mr-1"></i>{installed.length} augmentations currently installed</p>
          </div>
        </div>
      </div>

      {/* Installed Slots Overview */}
      <div className="max-w-7xl mx-auto px-6 pt-5 pb-3">
        <div className="bg-[#080b0f] rounded-xl p-4 border border-fuchsia-500/20">
          <h3 className="text-sm font-bold text-fuchsia-400 mb-3">Installed Augmentations</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(SLOT_CONFIG).map(([slot, cfg]) => {
              const installedInSlot = AUGMENTATIONS.filter(a => a.installed && a.slot === slot);
              return (
                <div key={slot} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${cfg.bg}`}>
                  <i className={`${cfg.icon} ${cfg.color}`}></i>
                  <span className={`text-sm font-bold ${cfg.color}`}>{cfg.label}</span>
                  <span className="text-white font-bold">{installedInSlot.length}</span>
                  {installedInSlot.map(a => <span key={a.id} className="text-xs text-slate-300 bg-slate-700 px-2 py-0.5 rounded-full">{a.name.split(' ')[0]}</span>)}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Slot Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => setActiveSlot('all')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeSlot === 'all' ? 'bg-slate-600 text-white' : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:text-white'}`}>
            All Types
          </button>
          {Object.entries(SLOT_CONFIG).map(([slot, cfg]) => (
            <button key={slot} onClick={() => setActiveSlot(slot)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap border ${activeSlot === slot ? `${cfg.bg} ${cfg.color}` : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'}`}>
              <i className={`${cfg.icon} mr-1`}></i>{cfg.label}
            </button>
          ))}
        </div>

        {/* Upcoming unlocks banner */}
        {upcomingAugs.length > 0 && (
          <div className="bg-slate-800/40 border border-fuchsia-500/20 rounded-xl p-4 mb-5">
            <h4 className="text-xs font-bold text-fuchsia-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <i className="ri-lock-line"></i> Unlock at Next Rank
            </h4>
            <div className="flex flex-wrap gap-2">
              {upcomingAugs.map(r => {
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

        {/* Augmentation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(aug => {
            const slotCfg = SLOT_CONFIG[aug.slot];
            const locked = !isUnlocked(aug.id);
            const status = getStatus(aug.id);
            const lockRank = status ? CRAFTING_TITLES[status.minRank - 1] : null;
            const pinned = isPinned(aug.id);
            return (
              <div key={aug.id} onClick={() => { if (!locked) setSelected(aug); }}
                className={`bg-slate-800/50 rounded-xl border transition-all relative overflow-hidden
                  ${locked ? 'cursor-not-allowed opacity-75 border-slate-800/60' : `hover:border-fuchsia-400/40 cursor-pointer ${aug.installed ? 'border-green-500/40 ring-1 ring-green-500/20' : 'border-slate-700/50'}`}`}>

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

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 flex items-center justify-center rounded-xl border ${slotCfg.bg}`}>
                        <i className={`${slotCfg.icon} text-xl ${slotCfg.color}`}></i>
                      </div>
                      <div>
                        <span className={`text-xs font-bold ${slotCfg.color}`}>{slotCfg.label}</span>
                        {aug.installed && <span className="ml-2 text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">Installed</span>}
                        <br />
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${RARITY_STYLES[aug.rarity]}`}>{aug.rarity}</span>
                        {status && <span className="ml-1"><RecipeUnlockBadge minRank={status.minRank} unlocked={!locked} compact /></span>}
                      </div>
                    </div>
                    <div className="text-right">
                      {pinned && !locked && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded-full">
                          <i className="ri-bookmark-fill"></i>Pinned
                        </span>
                      )}
                      {aug.stackable && <div><p className="text-xs text-slate-500">Stacks</p><p className="text-sm font-bold text-white">{aug.currentStacks}/{aug.maxStacks}</p></div>}
                    </div>
                  </div>
                  <h3 className="font-bold text-white mb-1">{aug.name}</h3>
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2">{aug.description}</p>
                  <div className="space-y-1.5 mb-3">
                    {aug.bonuses.map((b, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400"><i className={`${b.icon}`}></i>{b.stat}</div>
                        <span className="text-sm font-bold text-green-400">{b.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span><i className="ri-time-line mr-1"></i>{formatTime(aug.craftTime)}</span>
                    <span><i className="ri-user-line mr-1"></i>Lv.{aug.reqLevel}</span>
                    <span className={locked ? 'text-slate-500 font-bold' : canCraft(aug) ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                      {locked ? 'Locked' : canCraft(aug) ? 'Craftable' : 'Needs Mats'}
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
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">{selected.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${SLOT_CONFIG[selected.slot].bg} ${SLOT_CONFIG[selected.slot].color}`}>{SLOT_CONFIG[selected.slot].label}</span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${RARITY_STYLES[selected.rarity]}`}>{selected.rarity}</span>
                    {selected.installed && <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full">Installed</span>}
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"><i className="ri-close-line text-xl"></i></button>
              </div>
              <p className="text-slate-400 italic text-sm mb-1">"{selected.lore}"</p>
              <p className="text-slate-300 text-sm mb-5">{selected.description}</p>

              <div className="bg-slate-800/60 rounded-xl p-4 mb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Bonuses</h4>
                {selected.bonuses.map((b, i) => (
                  <div key={i} className="flex justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm text-slate-300"><i className={b.icon}></i>{b.stat}</div>
                    <span className="text-sm font-black text-green-400">{b.value}</span>
                  </div>
                ))}
              </div>

              {selected.tradeoffs.filter(t => t !== 'None').length > 0 && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-4">
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Trade-offs</h4>
                  {selected.tradeoffs.map((t, i) => <p key={i} className="text-sm text-red-300">• {t}</p>)}
                </div>
              )}

              <div className="bg-slate-800/60 rounded-xl p-4 mb-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Materials × {qty}</h4>
                {selected.materials.map(m => {
                  const needed = m.amount * qty;
                  const ok = m.owned >= needed;
                  return (
                    <div key={m.name} className="flex justify-between mb-2">
                      <div className="flex items-center gap-2"><i className={`${m.icon} text-slate-400`}></i><span className="text-sm text-white">{m.name}</span></div>
                      <span className={`text-sm font-bold ${ok ? 'text-green-400' : 'text-red-400'}`}>{m.owned}/{needed}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 items-center mb-5">
                <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded-lg hover:bg-slate-600 cursor-pointer"><i className="ri-subtract-line"></i></button>
                  <input type="number" value={qty} min={1} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} className="w-12 text-center bg-transparent text-white font-bold focus:outline-none" />
                  <button onClick={() => setQty(q => q + 1)} className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded-lg hover:bg-slate-600 cursor-pointer"><i className="ri-add-line"></i></button>
                </div>
                <div className="flex-1 bg-slate-800 rounded-xl px-4 py-3 text-center">
                  <span className="text-white font-bold"><i className="ri-time-line mr-2 text-fuchsia-400"></i>{formatTime(selected.craftTime * qty)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handlePinWishlist}
                  className="py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <i className="ri-bookmark-line"></i>
                  Pin to Wishlist
                </button>
                <button disabled={!canCraft(selected)}
                  className={`py-3 rounded-xl font-black text-base transition-all whitespace-nowrap ${canCraft(selected) ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white hover:from-fuchsia-500 cursor-pointer' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
                  <i className="ri-hammer-line mr-2"></i>Craft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}