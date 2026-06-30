import { useState } from 'react';

interface InventoryItem {
  id: string;
  name: string;
  type: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  tier: number;
  quantity: number;
  salvageYield: { name: string; amount: number; min: number; max: number; icon: string }[];
  icon: string;
  locked: boolean;
}

const INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'Basic Laser Cannon', type: 'Weapon', rarity: 'Common', tier: 1, quantity: 7, salvageYield: [{ name: 'Steel Alloy', amount: 40, min: 30, max: 50, icon: 'ri-hammer-line' }, { name: 'Energy Crystal', amount: 15, min: 10, max: 20, icon: 'ri-flashlight-line' }], icon: 'ri-flashlight-line', locked: false },
  { id: 'i2', name: 'Plasma Cannon Mk II', type: 'Weapon', rarity: 'Uncommon', tier: 2, quantity: 3, salvageYield: [{ name: 'Titanium Alloy', amount: 80, min: 60, max: 100, icon: 'ri-hammer-fill' }, { name: 'Plasma Core', amount: 2, min: 1, max: 3, icon: 'ri-fire-line' }], icon: 'ri-fire-line', locked: false },
  { id: 'i3', name: 'Composite Hull Plating', type: 'Armor', rarity: 'Common', tier: 1, quantity: 12, salvageYield: [{ name: 'Steel Alloy', amount: 80, min: 60, max: 100, icon: 'ri-hammer-line' }, { name: 'Titanium Alloy', amount: 20, min: 15, max: 25, icon: 'ri-hammer-fill' }], icon: 'ri-shield-line', locked: false },
  { id: 'i4', name: 'Deflector Shield Mk III', type: 'Armor', rarity: 'Uncommon', tier: 2, quantity: 2, salvageYield: [{ name: 'Energy Crystal', amount: 60, min: 40, max: 80, icon: 'ri-flashlight-line' }, { name: 'Shield Emitter', amount: 2, min: 1, max: 3, icon: 'ri-wifi-line' }], icon: 'ri-shield-cross-line', locked: false },
  { id: 'i5', name: 'Ion Disruptor Cannon', type: 'Weapon', rarity: 'Rare', tier: 3, quantity: 1, salvageYield: [{ name: 'Durasteel', amount: 200, min: 150, max: 250, icon: 'ri-building-line' }, { name: 'Ion Cell', amount: 3, min: 2, max: 4, icon: 'ri-thunderstorms-line' }], icon: 'ri-thunderstorms-line', locked: true },
  { id: 'i6', name: 'Impulse Drive Mk IV', type: 'Module', rarity: 'Uncommon', tier: 2, quantity: 4, salvageYield: [{ name: 'Steel Alloy', amount: 100, min: 80, max: 120, icon: 'ri-hammer-line' }, { name: 'Warp Coil', amount: 1, min: 0, max: 2, icon: 'ri-git-branch-line' }], icon: 'ri-rocket-line', locked: false },
  { id: 'i7', name: 'Wasp Interceptor Drone', type: 'Drone', rarity: 'Common', tier: 1, quantity: 15, salvageYield: [{ name: 'Steel Alloy', amount: 25, min: 20, max: 30, icon: 'ri-hammer-line' }, { name: 'Energy Crystal', amount: 8, min: 5, max: 10, icon: 'ri-flashlight-line' }], icon: 'ri-bug-2-line', locked: false },
  { id: 'i8', name: 'Reactive Nanoplate', type: 'Armor', rarity: 'Rare', tier: 3, quantity: 1, salvageYield: [{ name: 'Durasteel', amount: 180, min: 140, max: 220, icon: 'ri-building-line' }, { name: 'Raw Nanites', amount: 35, min: 25, max: 45, icon: 'ri-cpu-line' }, { name: 'Reactive Compound', amount: 8, min: 5, max: 10, icon: 'ri-test-tube-line' }], icon: 'ri-shield-fill', locked: false },
  { id: 'i9', name: 'Quantum Barrier Matrix', type: 'Armor', rarity: 'Epic', tier: 4, quantity: 1, salvageYield: [{ name: 'Quantum Crystal', amount: 12, min: 8, max: 16, icon: 'ri-hexagon-line' }, { name: 'Exotic Alloy', amount: 15, min: 10, max: 20, icon: 'ri-star-line' }, { name: 'Raw Nanites', amount: 60, min: 40, max: 80, icon: 'ri-cpu-line' }], icon: 'ri-shield-star-line', locked: true },
  { id: 'i10', name: 'Hornet Combat Drone', type: 'Drone', rarity: 'Uncommon', tier: 2, quantity: 6, salvageYield: [{ name: 'Titanium Alloy', amount: 40, min: 30, max: 50, icon: 'ri-hammer-fill' }, { name: 'Plasma Core', amount: 1, min: 0, max: 1, icon: 'ri-fire-line' }], icon: 'ri-compass-3-line', locked: false },
];

const RARITY_STYLES: Record<string, { text: string; border: string; bg: string }> = {
  Common: { text: 'text-slate-400', border: 'border-slate-500/30', bg: 'bg-slate-500/10' },
  Uncommon: { text: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-500/10' },
  Rare: { text: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' },
  Epic: { text: 'text-fuchsia-400', border: 'border-fuchsia-500/30', bg: 'bg-fuchsia-500/10' },
  Legendary: { text: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
};

interface SalvageResult { name: string; amount: number; icon: string }

export default function CraftingDismantlePage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState('all');
  const [result, setResult] = useState<SalvageResult[] | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [dismantleQty, setDismantleQty] = useState<Record<string, number>>({});
  const [locked, setLocked] = useState<Set<string>>(new Set(['i5', 'i9']));

  const filteredItems = filter === 'all' ? INVENTORY : INVENTORY.filter(i => i.type.toLowerCase() === filter);

  const toggleSelect = (id: string) => {
    if (locked.has(id)) return;
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleLock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    const unlocked = filteredItems.filter(i => !locked.has(i.id)).map(i => i.id);
    setSelected(new Set(unlocked));
  };

  const calculateSalvage = (): SalvageResult[] => {
    const totals: Record<string, { amount: number; icon: string }> = {};
    selected.forEach(id => {
      const item = INVENTORY.find(i => i.id === id);
      if (!item) return;
      const qty = dismantleQty[id] || 1;
      item.salvageYield.forEach(y => {
        const roll = Math.floor(Math.random() * (y.max - y.min + 1)) + y.min;
        if (!totals[y.name]) totals[y.name] = { amount: 0, icon: y.icon };
        totals[y.name].amount += roll * qty;
      });
    });
    return Object.entries(totals).map(([name, v]) => ({ name, amount: v.amount, icon: v.icon }));
  };

  const handleDismantle = () => {
    if (selected.size === 0) return;
    setConfirming(true);
  };

  const confirmDismantle = () => {
    const salvage = calculateSalvage();
    setResult(salvage);
    setConfirming(false);
    setSelected(new Set());
  };

  const selectedItems = INVENTORY.filter(i => selected.has(i.id));

  return (
    <div className="min-h-screen bg-[#080b0f] text-white">
      {/* Hero */}
      <div className="relative h-48 overflow-hidden">
        <img src="https://readdy.ai/api/search-image?query=futuristic%20salvage%20and%20disassembly%20facility%20with%20robotic%20arms%20breaking%20down%20spacecraft%20components%20glowing%20energy%20reclamation%20tanks%20blue%20sparks%20flying%20industrial%20sci-fi%20environment&width=1920&height=350&seq=dismantle-hero-1&orientation=landscape" alt="Dismantle" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-slate-950"></div>
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <h1 className="text-4xl font-black text-white flex items-center gap-3 mb-1"><i className="ri-delete-bin-2-line text-3xl text-red-400"></i> Dismantle & Salvage</h1>
            <p className="text-slate-300">Break down items into raw materials. Locked items are protected.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left: Inventory List */}
        <div className="flex-1">
          {/* Controls */}
          <div className="flex flex-wrap gap-3 mb-4 items-center">
            <div className="flex gap-2">
              {['all', 'weapon', 'armor', 'module', 'drone'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${filter === f ? 'bg-[#d4a853]/15 text-[#d4a853] border border-[#1e2a36]' : 'bg-[#080b0f] text-[#8892aa] border border-[#1e2a36] hover:text-white'}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <button onClick={selectAll} className="ml-auto px-3 py-1.5 rounded-xl text-sm text-slate-400 border border-slate-700 hover:text-white hover:border-slate-500 cursor-pointer whitespace-nowrap transition-all">
              Select All Unlocked
            </button>
            {selected.size > 0 && <button onClick={() => setSelected(new Set())} className="px-3 py-1.5 rounded-xl text-sm text-slate-400 border border-slate-700 hover:text-white cursor-pointer whitespace-nowrap">Clear</button>}
          </div>

          <div className="space-y-3">
            {filteredItems.map(item => {
              const isSelected = selected.has(item.id);
              const isLocked = locked.has(item.id);
              const rs = RARITY_STYLES[item.rarity];
              const qty = dismantleQty[item.id] || 1;
              return (
                <div key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={`rounded-xl border transition-all ${isLocked ? 'opacity-60 cursor-not-allowed border-slate-700/50 bg-slate-800/30' : `cursor-pointer ${isSelected ? 'border-red-400/60 bg-red-500/5 ring-1 ring-red-400/20' : 'border-slate-700/50 bg-slate-800/40 hover:border-slate-600'}`}`}>
                  <div className="p-4 flex items-center gap-4">
                    {/* Checkbox */}
                    <div className={`w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center ${isSelected ? 'bg-red-500 border-red-500' : 'border-slate-600'}`}>
                      {isSelected && <i className="ri-check-line text-xs text-white"></i>}
                    </div>

                    {/* Icon */}
                    <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl border ${rs.bg} ${rs.border}`}>
                      <i className={`${item.icon} text-lg ${rs.text}`}></i>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                        <span className={`text-xs flex-shrink-0 px-2 py-0.5 rounded-full border ${rs.bg} ${rs.border} ${rs.text}`}>{item.rarity}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{item.type}</span>
                        <span>T{item.tier}</span>
                        <span className="text-slate-300">×{item.quantity} in stock</span>
                      </div>
                    </div>

                    {/* Qty to dismantle */}
                    {isSelected && !isLocked && (
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <span className="text-xs text-slate-400">Qty:</span>
                        <div className="flex items-center gap-1 bg-slate-800 rounded-lg px-2 py-1">
                          <button onClick={() => setDismantleQty(prev => ({ ...prev, [item.id]: Math.max(1, (prev[item.id] || 1) - 1) }))} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"><i className="ri-subtract-line text-xs"></i></button>
                          <span className="text-white font-bold w-6 text-center text-sm">{qty}</span>
                          <button onClick={() => setDismantleQty(prev => ({ ...prev, [item.id]: Math.min(item.quantity, (prev[item.id] || 1) + 1) }))} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"><i className="ri-add-line text-xs"></i></button>
                        </div>
                      </div>
                    )}

                    {/* Lock button */}
                    <button onClick={e => toggleLock(item.id, e)} className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg transition-all cursor-pointer ${isLocked ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700/50 text-slate-500 hover:text-amber-400'}`}>
                      <i className={isLocked ? 'ri-lock-fill' : 'ri-lock-unlock-line'}></i>
                    </button>

                    {/* Yield preview */}
                    <div className="hidden md:flex flex-col gap-1 flex-shrink-0 w-36">
                      {item.salvageYield.slice(0, 2).map(y => (
                        <div key={y.name} className="flex items-center gap-1 text-xs text-slate-500">
                          <i className={`${y.icon} text-slate-400`}></i>
                          <span>{y.name}:</span>
                          <span className="text-slate-300">{y.min}–{y.max}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Salvage Summary */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 p-5 sticky top-6">
            <h3 className="text-lg font-black text-white mb-1">Salvage Summary</h3>
            <p className="text-xs text-slate-400 mb-4">{selected.size} item(s) selected</p>

            {selectedItems.length > 0 ? (
              <>
                <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                  {selectedItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-slate-300 truncate flex-1">{item.name}</span>
                      <span className="text-slate-500 flex-shrink-0 ml-2">×{dismantleQty[item.id] || 1}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-700 pt-4 mb-4">
                  <p className="text-xs text-slate-400 mb-3">Estimated Yield:</p>
                  {selectedItems.flatMap(item => item.salvageYield).reduce<{ name: string; min: number; max: number; icon: string }[]>((acc, y) => {
                    const existing = acc.find(a => a.name === y.name);
                    const qty = dismantleQty[selectedItems.find(i => i.salvageYield.includes(y))?.id || ''] || 1;
                    if (existing) { existing.min += y.min * qty; existing.max += y.max * qty; } 
                    else acc.push({ name: y.name, min: y.min * qty, max: y.max * qty, icon: y.icon });
                    return acc;
                  }, []).map(y => (
                    <div key={y.name} className="flex justify-between text-sm mb-1">
                      <div className="flex items-center gap-1.5 text-slate-300"><i className={`${y.icon} text-slate-400`}></i>{y.name}</div>
                      <span className="text-green-400 font-bold">{y.min}–{y.max}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3 mb-4">
                  <p className="text-xs text-red-400"><i className="ri-alert-line mr-1"></i>Items will be permanently destroyed. This cannot be undone.</p>
                </div>
                <button onClick={handleDismantle}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-black hover:from-red-500 cursor-pointer transition-all whitespace-nowrap">
                  <i className="ri-delete-bin-2-line mr-2"></i>Dismantle {selected.size} Item(s)
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <i className="ri-inbox-line text-5xl text-slate-600 mb-3"></i>
                <p className="text-slate-500 text-sm">Select items to dismantle</p>
                <p className="text-xs text-slate-600 mt-1">Lock items to protect them</p>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-slate-800/40 rounded-xl border border-slate-700/30 p-4 mt-4">
            <h4 className="text-sm font-bold text-slate-400 mb-3"><i className="ri-lightbulb-line mr-1 text-amber-400"></i>Salvage Tips</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>• Higher rarity = better material yield</li>
              <li>• Lock valuable items to prevent accidents</li>
              <li>• Epic+ items yield rare components</li>
              <li>• Yield is randomized within a range</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirming && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-black text-white mb-2"><i className="ri-alert-line text-red-400 mr-2"></i>Confirm Dismantle</h2>
            <p className="text-slate-400 text-sm mb-4">You are about to destroy <strong className="text-white">{selected.size} item(s)</strong>. This is permanent and cannot be reversed.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirming(false)} className="flex-1 py-3 bg-slate-700 text-white rounded-xl font-bold cursor-pointer hover:bg-slate-600 transition-all whitespace-nowrap">Cancel</button>
              <button onClick={confirmDismantle} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold cursor-pointer hover:bg-red-500 transition-all whitespace-nowrap"><i className="ri-delete-bin-2-line mr-1"></i>Dismantle</button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {result && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-green-500/40 rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-black text-white mb-1"><i className="ri-check-line text-green-400 mr-2"></i>Salvage Complete!</h2>
            <p className="text-slate-400 text-sm mb-5">Materials have been added to your inventory.</p>
            <div className="space-y-3 mb-5">
              {result.map(r => (
                <div key={r.name} className="flex items-center justify-between bg-slate-800/60 rounded-xl p-3">
                  <div className="flex items-center gap-2"><i className={`${r.icon} text-slate-300`}></i><span className="text-white">{r.name}</span></div>
                  <span className="text-green-400 font-black text-lg">+{r.amount}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setResult(null)} className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold cursor-pointer hover:from-green-500 transition-all whitespace-nowrap">
              <i className="ri-check-line mr-2"></i>Collect Materials
            </button>
          </div>
        </div>
      )}
    </div>
  );
}