import { useState } from 'react';
import { useRecipeUnlocks } from '@/hooks/useRecipeUnlocks';
import RecipeUnlockBadge from '@/components/feature/RecipeUnlockBadge';
import { CRAFTING_TITLES, useCraftingRank } from '@/hooks/useCraftingRank';
import { Link } from 'react-router-dom';
import RecipeUnlockRankUpToast from '@/components/feature/RecipeUnlockRankUpToast';
import { useMaterialWishlist } from '@/hooks/useMaterialWishlist';

interface ForgeRecipe {
  id: string;
  name: string;
  subCategory: 'energy-weapons' | 'projectile-weapons' | 'exotic-weapons' | 'hull-armor' | 'shield-systems' | 'propulsion' | 'power-systems' | 'stealth' | 'computing';
  type: 'weapon' | 'armor' | 'module';
  tier: number;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  description: string;
  lore: string;
  craftTime: number;
  reqLevel: number;
  reqSkill: string;
  reqSkillLvl: number;
  materials: { name: string; amount: number; icon: string; owned: number }[];
  stats: Record<string, number | string>;
  effects: string[];
  icon: string;
}

const RECIPES: ForgeRecipe[] = [
  // Energy Weapons
  { id: 'ew1', name: 'Pulse Laser Array', subCategory: 'energy-weapons', type: 'weapon', tier: 1, rarity: 'Common', description: 'Rapid-fire laser array for light fighters', lore: 'Standard issue across most colonial defense forces.', craftTime: 240, reqLevel: 5, reqSkill: 'Weaponsmithing', reqSkillLvl: 2, materials: [{ name: 'Steel Alloy', amount: 200, icon: 'ri-hammer-line', owned: 450 }, { name: 'Energy Crystal', amount: 80, icon: 'ri-flashlight-line', owned: 120 }], stats: { Damage: 120, 'Fire Rate': '2.5/s', Range: 450 }, effects: ['Rapid fire', 'Low energy cost'], icon: 'ri-flashlight-line' },
  { id: 'ew2', name: 'Plasma Cannon Mk II', subCategory: 'energy-weapons', type: 'weapon', tier: 2, rarity: 'Uncommon', description: 'High-heat plasma discharge cannon', lore: 'Plasma technology perfected over decades of interstellar conflict.', craftTime: 720, reqLevel: 15, reqSkill: 'Weaponsmithing', reqSkillLvl: 5, materials: [{ name: 'Titanium Alloy', amount: 500, icon: 'ri-hammer-line', owned: 280 }, { name: 'Plasma Core', amount: 8, icon: 'ri-fire-line', owned: 3 }, { name: 'Fusion Matrix', amount: 3, icon: 'ri-contrast-drop-line', owned: 1 }], stats: { Damage: 380, 'Armor Pierce': '35%', Range: 620 }, effects: ['Armor penetration', 'Burns on hit'], icon: 'ri-fire-line' },
  { id: 'ew3', name: 'Ion Disruptor Cannon', subCategory: 'energy-weapons', type: 'weapon', tier: 3, rarity: 'Rare', description: 'Ionized beam that bypasses shields', lore: 'Reverse-engineered from alien wreckage found in the Outer Rim.', craftTime: 1440, reqLevel: 28, reqSkill: 'Weaponsmithing', reqSkillLvl: 8, materials: [{ name: 'Durasteel', amount: 1200, icon: 'ri-building-line', owned: 800 }, { name: 'Ion Cell', amount: 15, icon: 'ri-thunderstorms-line', owned: 6 }, { name: 'Quantum Crystal', amount: 5, icon: 'ri-flashlight-line', owned: 2 }], stats: { Damage: 550, 'Shield Bypass': '60%', Range: 800 }, effects: ['Ignores shields', 'EMP burst', 'Shield disable 5s'], icon: 'ri-thunderstorms-line' },
  { id: 'ew4', name: 'Singularity Lance', subCategory: 'exotic-weapons', type: 'weapon', tier: 5, rarity: 'Legendary', description: 'Fires concentrated micro-singularities', lore: 'Only seven known to exist. Each one forged from the remnants of a collapsed star.', craftTime: 7200, reqLevel: 65, reqSkill: 'Weaponsmithing', reqSkillLvl: 15, materials: [{ name: 'Dark Matter Core', amount: 50, icon: 'ri-contrast-drop-fill', owned: 12 }, { name: 'Cosmic Alloy', amount: 2000, icon: 'ri-star-line', owned: 500 }, { name: 'Exotic Matter', amount: 200, icon: 'ri-star-fill', owned: 45 }], stats: { Damage: 2800, 'Gravity Pull': 300, Range: 1400 }, effects: ['Pulls enemies', 'Ignores all defenses', 'Creates gravity well'], icon: 'ri-contrast-drop-fill' },
  // Projectile Weapons
  { id: 'pw1', name: 'Rail Accelerator', subCategory: 'projectile-weapons', type: 'weapon', tier: 2, rarity: 'Uncommon', description: 'Electromagnetic projectile accelerator', lore: 'Kinetic impact at near-relativistic velocities.', craftTime: 600, reqLevel: 12, reqSkill: 'Weaponsmithing', reqSkillLvl: 4, materials: [{ name: 'Steel Alloy', amount: 600, icon: 'ri-hammer-line', owned: 900 }, { name: 'Copper Wire', amount: 100, icon: 'ri-cpu-line', owned: 220 }, { name: 'Titanium Alloy', amount: 200, icon: 'ri-hammer-fill', owned: 75 }], stats: { Damage: 290, Velocity: '15km/s', Range: 900 }, effects: ['Pierces hulls', 'No energy cost', 'Long range'], icon: 'ri-arrow-right-line' },
  { id: 'pw2', name: 'Quantum Torpedo Battery', subCategory: 'projectile-weapons', type: 'weapon', tier: 4, rarity: 'Epic', description: 'Quantum-tipped torpedo launcher array', lore: 'Each torpedo carries a payload that destabilizes local spacetime.', craftTime: 3600, reqLevel: 45, reqSkill: 'Weaponsmithing', reqSkillLvl: 12, materials: [{ name: 'Quantum Steel', amount: 1500, icon: 'ri-box-3-line', owned: 400 }, { name: 'Antimatter Cell', amount: 25, icon: 'ri-flashlight-fill', owned: 8 }, { name: 'Fusion Core', amount: 10, icon: 'ri-fire-fill', owned: 3 }], stats: { Damage: 1200, AoE: 180, Range: 1100 }, effects: ['Area damage', 'Quantum detonation', 'Shield strip'], icon: 'ri-send-plane-fill' },
  // Hull Armor
  { id: 'ha1', name: 'Composite Hull Plating', subCategory: 'hull-armor', type: 'armor', tier: 1, rarity: 'Common', description: 'Multi-layer composite armor plating', lore: 'The backbone of any well-defended vessel.', craftTime: 300, reqLevel: 5, reqSkill: 'Armorsmithing', reqSkillLvl: 1, materials: [{ name: 'Steel Alloy', amount: 400, icon: 'ri-hammer-line', owned: 900 }, { name: 'Titanium Alloy', amount: 100, icon: 'ri-hammer-fill', owned: 210 }], stats: { Armor: 800, Hull: 1500, 'Thermal Resist': '10%' }, effects: ['Heat resistance', 'Durability'], icon: 'ri-shield-line' },
  { id: 'ha2', name: 'Reactive Nanoplate', subCategory: 'hull-armor', type: 'armor', tier: 3, rarity: 'Rare', description: 'Nano-reactive plates that absorb and redistribute impact', lore: 'Inspired by organisms that survive deep-space radiation.', craftTime: 1800, reqLevel: 32, reqSkill: 'Armorsmithing', reqSkillLvl: 7, materials: [{ name: 'Durasteel', amount: 1000, icon: 'ri-building-line', owned: 520 }, { name: 'Raw Nanites', amount: 200, icon: 'ri-cpu-line', owned: 80 }, { name: 'Reactive Compound', amount: 60, icon: 'ri-test-tube-line', owned: 15 }], stats: { Armor: 3500, 'Damage Absorb': '20%', 'Self Repair': '15/s' }, effects: ['Absorbs 20% damage', 'Auto-repairs over time', 'Adapts to damage type'], icon: 'ri-shield-fill' },
  // Shield Systems
  { id: 'ss1', name: 'Deflector Shield Mk III', subCategory: 'shield-systems', type: 'armor', tier: 2, rarity: 'Uncommon', description: 'Advanced deflector shield generator', lore: 'Deflects incoming fire before it reaches the hull.', craftTime: 900, reqLevel: 18, reqSkill: 'Armorsmithing', reqSkillLvl: 5, materials: [{ name: 'Energy Crystal', amount: 300, icon: 'ri-flashlight-line', owned: 200 }, { name: 'Shield Emitter', amount: 10, icon: 'ri-wifi-line', owned: 4 }, { name: 'Titanium Alloy', amount: 400, icon: 'ri-hammer-fill', owned: 180 }], stats: { Shield: 3000, 'Regen Rate': '75/s', 'Energy Draw': 200 }, effects: ['Fast regeneration', 'Blocks plasma'], icon: 'ri-shield-cross-line' },
  { id: 'ss2', name: 'Quantum Barrier Matrix', subCategory: 'shield-systems', type: 'armor', tier: 4, rarity: 'Epic', description: 'Quantum-entangled defensive barrier', lore: 'The shield and the ship become one at the quantum level.', craftTime: 3600, reqLevel: 52, reqSkill: 'Armorsmithing', reqSkillLvl: 11, materials: [{ name: 'Quantum Crystal', amount: 80, icon: 'ri-flashlight-line', owned: 20 }, { name: 'Exotic Matter', amount: 30, icon: 'ri-star-line', owned: 8 }, { name: 'Nanite Assembly', amount: 40, icon: 'ri-cpu-line', owned: 10 }], stats: { Shield: 12000, Absorption: '25%', Reflection: '15%' }, effects: ['Absorbs 25% as energy', 'Reflects 15% back', 'Immune to EMP'], icon: 'ri-shield-star-line' },
  // Propulsion
  { id: 'pr1', name: 'Impulse Drive Mk IV', subCategory: 'propulsion', type: 'module', tier: 2, rarity: 'Uncommon', description: 'High-efficiency sublight drive', lore: 'Gets you where you\'re going — eventually.', craftTime: 720, reqLevel: 14, reqSkill: 'Engineering', reqSkillLvl: 4, materials: [{ name: 'Steel Alloy', amount: 500, icon: 'ri-hammer-line', owned: 900 }, { name: 'Warp Coil', amount: 5, icon: 'ri-git-branch-line', owned: 2 }, { name: 'Fuel Cell', amount: 20, icon: 'ri-battery-charge-line', owned: 35 }], stats: { Speed: '+35%', Efficiency: '+20%', Acceleration: 180 }, effects: ['Fuel efficient', 'Smooth acceleration'], icon: 'ri-rocket-line' },
  { id: 'pr2', name: 'Dark Matter Hyperdrive', subCategory: 'propulsion', type: 'module', tier: 5, rarity: 'Legendary', description: 'Warps local spacetime using dark matter', lore: 'Travel between galaxies in seconds. The physics are... classified.', craftTime: 7200, reqLevel: 60, reqSkill: 'Engineering', reqSkillLvl: 14, materials: [{ name: 'Dark Matter Core', amount: 40, icon: 'ri-contrast-drop-fill', owned: 10 }, { name: 'Cosmic Alloy', amount: 1500, icon: 'ri-star-line', owned: 350 }, { name: 'Quantum Processor', amount: 15, icon: 'ri-cpu-fill', owned: 4 }], stats: { Speed: '+180%', 'Jump Range': '50 LY', 'Warp Factor': 9.9 }, effects: ['FTL capable', 'Interdimensional jump', 'Cloaks during warp'], icon: 'ri-space-ship-line' },
  // Power Systems
  { id: 'ps1', name: 'Antimatter Reactor Core', subCategory: 'power-systems', type: 'module', tier: 4, rarity: 'Epic', description: 'Ultra-dense antimatter energy reactor', lore: 'Handle with extreme care. Containment failure is... not advisable.', craftTime: 4200, reqLevel: 48, reqSkill: 'Engineering', reqSkillLvl: 11, materials: [{ name: 'Durasteel', amount: 2000, icon: 'ri-building-line', owned: 600 }, { name: 'Antimatter Cell', amount: 30, icon: 'ri-flashlight-fill', owned: 7 }, { name: 'Quantum Processor', amount: 8, icon: 'ri-cpu-fill', owned: 2 }], stats: { 'Power Output': 15000, Stability: '99.7%', Duration: '∞' }, effects: ['+60% weapon power', 'Shields never deplete during combat', 'Powers 12 systems'], icon: 'ri-battery-fill' },
  // Stealth & Computing
  { id: 'sc1', name: 'Phase Cloak Generator', subCategory: 'stealth', type: 'module', tier: 5, rarity: 'Legendary', description: 'Shifts ship partially out of phase with reality', lore: 'Even your own crew can barely see you. Navigation becomes an art.', craftTime: 8400, reqLevel: 68, reqSkill: 'Engineering', reqSkillLvl: 15, materials: [{ name: 'Phase Crystal', amount: 60, icon: 'ri-contrast-2-line', owned: 14 }, { name: 'Dark Matter Core', amount: 25, icon: 'ri-contrast-drop-fill', owned: 6 }, { name: 'Exotic Matter', amount: 80, icon: 'ri-star-line', owned: 20 }], stats: { Stealth: 98, Duration: '8 min', Detection: '-95%' }, effects: ['Invisible to sensors', 'Phase shift combat', 'First strike +150%'], icon: 'ri-eye-off-line' },
  { id: 'sc2', name: 'Tactical AI Core', subCategory: 'computing', type: 'module', tier: 4, rarity: 'Epic', description: 'Advanced AI tactical decision system', lore: 'Sometimes the AI knows what you should do before you do.', craftTime: 3600, reqLevel: 44, reqSkill: 'Engineering', reqSkillLvl: 10, materials: [{ name: 'Quantum Processor', amount: 25, icon: 'ri-cpu-fill', owned: 5 }, { name: 'Raw Nanites', amount: 500, icon: 'ri-cpu-line', owned: 120 }, { name: 'Exotic Matter', amount: 15, icon: 'ri-star-line', owned: 4 }], stats: { Accuracy: '+40%', 'Crit Chance': '+25%', Evasion: '+15%' }, effects: ['Auto-target priority', 'Predictive targeting', 'Fleet coordination +50%'], icon: 'ri-cpu-fill' },
];

const SUB_CATEGORIES = [
  { id: 'all', label: 'All Items', icon: 'ri-apps-line', group: 'all' },
  { id: 'energy-weapons', label: 'Energy Weapons', icon: 'ri-flashlight-line', group: 'weapon' },
  { id: 'projectile-weapons', label: 'Projectile', icon: 'ri-arrow-right-line', group: 'weapon' },
  { id: 'exotic-weapons', label: 'Exotic Weapons', icon: 'ri-contrast-drop-fill', group: 'weapon' },
  { id: 'hull-armor', label: 'Hull Armor', icon: 'ri-shield-line', group: 'armor' },
  { id: 'shield-systems', label: 'Shield Systems', icon: 'ri-shield-cross-line', group: 'armor' },
  { id: 'propulsion', label: 'Propulsion', icon: 'ri-rocket-line', group: 'module' },
  { id: 'power-systems', label: 'Power Systems', icon: 'ri-battery-fill', group: 'module' },
  { id: 'stealth', label: 'Stealth', icon: 'ri-eye-off-line', group: 'module' },
  { id: 'computing', label: 'Computing', icon: 'ri-cpu-fill', group: 'module' },
];

const RARITY_COLORS: Record<string, string> = {
  Common: 'text-slate-400', Uncommon: 'text-green-400', Rare: 'text-cyan-400',
  Epic: 'text-fuchsia-400', Legendary: 'text-amber-400', Mythic: 'text-rose-400',
};

const TIER_GLOW: Record<number, string> = {
  1: 'border-slate-600', 2: 'border-green-600/50', 3: 'border-cyan-600/50',
  4: 'border-fuchsia-600/50', 5: 'border-amber-500/60',
};

export default function CraftingForgePage() {
  const { isUnlocked, getStatus, upcomingAtNextRank } = useRecipeUnlocks();
  const { recentUnlock } = useCraftingRank();
  const { addToWishlist, items: wishlistItems } = useMaterialWishlist();
  const [activeSub, setActiveSub] = useState('all');
  const [selected, setSelected] = useState<ForgeRecipe | null>(null);
  const [qty, setQty] = useState(1);
  const [activeQueue, setActiveQueue] = useState<{ id: string; name: string; progress: number; timeLeft: string; qty: number }[]>([
    { id: 'q1', name: 'Pulse Laser Array', progress: 72, timeLeft: '1m 8s', qty: 3 },
    { id: 'q2', name: 'Composite Hull Plating', progress: 34, timeLeft: '3m 20s', qty: 1 },
  ]);
  const [craftModal, setCraftModal] = useState(false);
  const [pinnedToast, setPinnedToast] = useState<string | null>(null);

  const filtered = activeSub === 'all' ? RECIPES : RECIPES.filter(r => r.subCategory === activeSub);
  const upcoming = upcomingAtNextRank.filter(r => r.page === 'forge');
  const weapons = SUB_CATEGORIES.filter(s => s.group === 'weapon');
  const armors = SUB_CATEGORIES.filter(s => s.group === 'armor');
  const modules = SUB_CATEGORIES.filter(s => s.group === 'module');

  const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  const canCraft = (r: ForgeRecipe) => r.materials.every(m => m.owned >= m.amount * qty);

  const handleRecipeClick = (recipe: ForgeRecipe) => {
    if (!isUnlocked(recipe.id)) return;
    setSelected(recipe);
    setCraftModal(true);
  };

  const handleStartCraft = () => {
    if (!selected) return;
    setActiveQueue(prev => [...prev, { id: Date.now().toString(), name: selected.name, progress: 0, timeLeft: formatTime(selected.craftTime * qty), qty }]);
    setCraftModal(false);
    setSelected(null);
    setQty(1);
  };

  const handlePinWishlist = () => {
    if (!selected) return;
    addToWishlist(
      selected.materials.map(m => ({ name: m.name, icon: m.icon, amount: m.amount * qty, owned: m.owned })),
      selected.name,
      selected.id,
      'forge'
    );
    setPinnedToast(`${selected.name} pinned!`);
    setTimeout(() => setPinnedToast(null), 2000);
  };

  const isPinned = (recipeId: string) => wishlistItems.some(i => i.recipeId === recipeId);

  return (
    <div className="min-h-screen bg-[#080b0f] text-white">
      {/* Rank-up recipe unlock toast */}
      <RecipeUnlockRankUpToast newRank={recentUnlock} pageFilter={['forge']} />

      {/* Pin toast */}
      {pinnedToast && (
        <div className="fixed top-4 right-4 z-[60] bg-slate-900 border border-cyan-500/40 rounded-xl px-4 py-3 flex items-center gap-2 shadow-lg">
          <i className="ri-bookmark-fill text-cyan-400"></i>
          <span className="text-sm font-bold text-white">{pinnedToast}</span>
        </div>
      )}

      {/* Hero */}
      <div className="relative h-56 overflow-hidden">
        <img src="https://readdy.ai/api/search-image?query=massive%20futuristic%20weapons%20forge%20facility%20with%20glowing%20plasma%20furnaces%20robotic%20assembly%20arms%20and%20metal%20casting%20bays%20dark%20industrial%20atmosphere%20orange%20and%20red%20glow%20sci-fi%20game%20environment&width=1920&height=400&seq=forge-hero-1&orientation=landscape" alt="Forge" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-slate-950"></div>
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <i className="ri-fire-fill text-3xl text-orange-400"></i>
              <h1 className="text-4xl font-black text-white tracking-tight">Crafting Forge</h1>
            </div>
            <p className="text-slate-300 text-lg">Weapons · Armor · Ship Modules</p>
            <div className="flex gap-6 mt-3">
              <div className="text-center"><p className="text-2xl font-bold text-orange-400">3</p><p className="text-xs text-slate-400">Active Jobs</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-green-400">1,247</p><p className="text-xs text-slate-400">Total Forged</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-cyan-400">Lv.18</p><p className="text-xs text-slate-400">Forge Level</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-0">
        {/* Left: Sub-category Sidebar */}
        <aside className="w-52 flex-shrink-0 border-r border-slate-800 min-h-screen">
          <div className="p-3 pt-4">
            <button onClick={() => setActiveSub('all')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold mb-4 transition-all cursor-pointer ${activeSub === 'all' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <i className="ri-apps-line"></i> All Items
            </button>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2 px-1">Weapons</p>
            {weapons.map(s => (
              <button key={s.id} onClick={() => setActiveSub(s.id)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer mb-1 ${activeSub === s.id ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
                <i className={s.icon}></i> {s.label}
              </button>
            ))}
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2 px-1 mt-4">Armor</p>
            {armors.map(s => (
              <button key={s.id} onClick={() => setActiveSub(s.id)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer mb-1 ${activeSub === s.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
                <i className={s.icon}></i> {s.label}
              </button>
            ))}
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2 px-1 mt-4">Modules</p>
            {modules.map(s => (
              <button key={s.id} onClick={() => setActiveSub(s.id)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer mb-1 ${activeSub === s.id ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
                <i className={s.icon}></i> {s.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Center: Recipe Grid */}
        <main className="flex-1 p-6">
          {/* Active Queue */}
          {activeQueue.length > 0 && (
            <div className="bg-[#080b0f] rounded-xl p-4 mb-6 border border-[#d4a853]/15">
              <h3 className="text-sm font-bold text-orange-400 mb-3 flex items-center gap-2"><i className="ri-fire-line"></i> Forge Queue ({activeQueue.length} jobs)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeQueue.map(j => (
                  <div key={j.id} className="bg-slate-900/70 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-white">{j.qty}x {j.name}</span>
                      <span className="text-xs text-orange-400">{j.timeLeft}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all" style={{ width: `${j.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming unlocks banner */}
          {upcoming.length > 0 && (
            <div className="bg-slate-800/40 border border-amber-500/20 rounded-xl p-4 mb-5">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <i className="ri-lock-line"></i> Unlock at Next Rank
              </h4>
              <div className="flex flex-wrap gap-2">
                {upcoming.map(r => {
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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(recipe => {
              const locked = !isUnlocked(recipe.id);
              const status = getStatus(recipe.id);
              const lockRank = status ? CRAFTING_TITLES[status.minRank - 1] : null;
              const pinned = isPinned(recipe.id);
              return (
                <div key={recipe.id} onClick={() => handleRecipeClick(recipe)}
                  className={`bg-[#080b0f] rounded-xl border ${TIER_GLOW[recipe.tier]} transition-all overflow-hidden relative
                    ${locked ? 'cursor-not-allowed opacity-75' : 'hover:border-orange-400/50 cursor-pointer group'}`}>

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
                      <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-amber-500/10 rounded-xl border border-orange-500/30 group-hover:from-orange-500/30 transition-all">
                        <i className={`${recipe.icon} text-2xl text-orange-400`}></i>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${RARITY_COLORS[recipe.rarity]}`}>{recipe.rarity}</p>
                        <p className="text-xs text-slate-500">Tier {recipe.tier}</p>
                        {status && <RecipeUnlockBadge minRank={status.minRank} unlocked={!locked} compact />}
                        {pinned && !locked && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded-full mt-1">
                            <i className="ri-bookmark-fill"></i>Pinned
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">{recipe.name}</h3>
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">{recipe.description}</p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {Object.entries(recipe.stats).slice(0, 4).map(([k, v]) => (
                        <div key={k} className="bg-slate-900/50 rounded-lg p-2">
                          <p className="text-xs text-slate-500">{k}</p>
                          <p className="text-sm font-bold text-cyan-400">{v}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span><i className="ri-time-line mr-1"></i>{formatTime(recipe.craftTime)}</span>
                      <span><i className="ri-user-line mr-1"></i>Lv.{recipe.reqLevel}</span>
                    </div>
                  </div>
                  <div className={`px-5 py-3 border-t border-[#1e2a36] flex items-center justify-between ${canCraft(recipe) ? 'bg-orange-500/5' : 'bg-red-500/5'}`}>
                    <div className="flex gap-1">
                      {recipe.effects.slice(0, 2).map((e, i) => (
                        <span key={i} className="text-xs bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded-full">{e.split(' ').slice(0, 2).join(' ')}</span>
                      ))}
                    </div>
                    <span className={`text-xs font-bold ${locked ? 'text-slate-500' : canCraft(recipe) ? 'text-green-400' : 'text-red-400'}`}>
                      {locked ? 'Locked' : canCraft(recipe) ? 'Ready' : 'Materials'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Craft Modal */}
      {craftModal && selected && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setCraftModal(false)}>
          <div className="bg-slate-900 border border-[#1e2a36] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-black text-white">{selected.name}</h2>
                  <p className={`font-bold ${RARITY_COLORS[selected.rarity]}`}>{selected.rarity} · Tier {selected.tier}</p>
                </div>
                <button onClick={() => setCraftModal(false)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer">
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              <p className="text-slate-400 text-sm italic mb-2">"{selected.lore}"</p>
              <p className="text-slate-300 text-sm mb-5">{selected.description}</p>

              {/* Stats */}
              <div className="bg-[#080b0f] rounded-xl p-4 mb-4">
                <h4 className="text-xs font-bold text-[#8892aa] uppercase tracking-widest mb-3">Combat Statistics</h4>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(selected.stats).map(([k, v]) => (
                    <div key={k} className="text-center">
                      <p className="text-xs text-slate-500">{k}</p>
                      <p className="text-lg font-black text-cyan-400">{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Effects */}
              <div className="flex flex-wrap gap-2 mb-5">
                {selected.effects.map((e, i) => (
                  <span key={i} className="bg-orange-500/10 text-orange-300 border border-orange-500/20 px-3 py-1 rounded-full text-xs font-medium">{e}</span>
                ))}
              </div>

              {/* Materials */}
              <div className="bg-[#080b0f] rounded-xl p-4 mb-5">
                <h4 className="text-xs font-bold text-[#8892aa] uppercase tracking-widest mb-3">Materials Required × {qty}</h4>
                <div className="space-y-2">
                  {selected.materials.map(m => {
                    const needed = m.amount * qty;
                    const ok = m.owned >= needed;
                    return (
                      <div key={m.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <i className={`${m.icon} text-slate-400`}></i>
                          <span className="text-sm text-white">{m.name}</span>
                        </div>
                        <div className={`text-sm font-bold ${ok ? 'text-green-400' : 'text-red-400'}`}>
                          {m.owned.toLocaleString()} / {needed.toLocaleString()}
                          {ok ? <i className="ri-check-line ml-1"></i> : <i className="ri-close-line ml-1"></i>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Qty + time */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded-lg hover:bg-slate-600 cursor-pointer"><i className="ri-subtract-line"></i></button>
                  <input type="number" value={qty} min={1} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} className="w-16 text-center bg-transparent text-white font-bold text-lg focus:outline-none" />
                  <button onClick={() => setQty(q => q + 1)} className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded-lg hover:bg-slate-600 cursor-pointer"><i className="ri-add-line"></i></button>
                </div>
                <div className="bg-[#080b0f] rounded-xl px-4 py-3 flex items-center gap-2">
                  <i className="ri-time-line text-[#d4a853]"></i>
                  <span className="text-white font-bold">{formatTime(selected.craftTime * qty)}</span>
                </div>
                <div className="bg-[#080b0f] rounded-xl px-4 py-3 flex items-center gap-2">
                  <i className="ri-medal-line text-fuchsia-400"></i>
                  <span className="text-white font-bold">Lv.{selected.reqLevel} · {selected.reqSkill} {selected.reqSkillLvl}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={handlePinWishlist}
                  className="py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <i className="ri-bookmark-line"></i>
                  Pin to Wishlist
                </button>
                <button onClick={handleStartCraft} disabled={!canCraft(selected)}
                  className={`py-3 rounded-xl font-black text-sm transition-all whitespace-nowrap ${canCraft(selected) ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-400 hover:to-amber-400 cursor-pointer' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
                  <i className="ri-fire-line mr-2"></i>
                  {canCraft(selected) ? `Forge ${qty}x` : 'Insufficient Materials'}
                </button>
              </div>

              <button onClick={handleStartCraft} disabled={!canCraft(selected)}
                className={`w-full py-4 rounded-xl font-black text-lg transition-all whitespace-nowrap ${canCraft(selected) ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-400 hover:to-amber-400 cursor-pointer' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
                <i className="ri-fire-line mr-2"></i>
                {canCraft(selected) ? `Forge ${qty}x ${selected.name}` : 'Insufficient Materials'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}