import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { getShipArt } from '../../data/gameArtwork';

interface Ship {
  id: string;
  name: string;
  type: string;
  description: string;
  metal_cost: number;
  crystal_cost: number;
  deuterium_cost: number;
  build_time: number;
  attack: number;
  defense: number;
  speed: number;
  cargo: number;
  fuel_consumption: number;
}

interface BuildQueue {
  id: string;
  ship_type: string;
  quantity: number;
  progress: number;
  completion_time: string;
}

const GOLD = '#d4a853';
const GOLD_GRADIENT = 'linear-gradient(90deg, #d4a853, #e2c044)';
const CARD_BG = '#080b0f';
const BORDER = '#1e2a36';

export default function ShipyardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ships, setShips] = useState<Ship[]>([]);
  const [buildQueue, setBuildQueue] = useState<BuildQueue[]>([]);
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [resources, setResources] = useState({ metal: 0, crystal: 0, deuterium: 0 });

  useEffect(() => {
    loadResources();
    loadBuildQueue();
  }, [user]);

  const loadResources = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('player_resources')
      .select('metal, crystal, deuterium')
      .eq('player_id', user.id)
      .maybeSingle();
    if (data) setResources({ metal: Number(data.metal) || 0, crystal: Number(data.crystal) || 0, deuterium: Number(data.deuterium) || 0 });
  };

  const loadBuildQueue = async () => {
    if (!user) return;
    const stored = localStorage.getItem(`shipyard_queue_${user?.id}`);
    if (stored) {
      try { setBuildQueue(JSON.parse(stored)); } catch { setBuildQueue([]); }
    } else {
      setBuildQueue([]);
    }
  };

  const canBuild = (ship: Ship) => {
    const totalMetal = ship.metal_cost * quantity;
    const totalCrystal = ship.crystal_cost * quantity;
    const totalDeuterium = ship.deuterium_cost * quantity;
    return (
      resources.metal >= totalMetal &&
      resources.crystal >= totalCrystal &&
      resources.deuterium >= totalDeuterium
    );
  };

  const buildShip = async () => {
    if (!selectedShip || !user || !canBuild(selectedShip)) return;

    const totalMetal = selectedShip.metal_cost * quantity;
    const totalCrystal = selectedShip.crystal_cost * quantity;
    const totalDeuterium = selectedShip.deuterium_cost * quantity;
    const totalTime = selectedShip.build_time * quantity * 60;
    const completionTime = new Date(Date.now() + totalTime * 1000).toISOString();

    await supabase
      .from('player_resources')
      .update({
        metal: resources.metal - totalMetal,
        crystal: resources.crystal - totalCrystal,
        deuterium: resources.deuterium - totalDeuterium,
      })
      .eq('player_id', user.id);

    setResources(prev => ({
      metal: prev.metal - totalMetal,
      crystal: prev.crystal - totalCrystal,
      deuterium: prev.deuterium - totalDeuterium,
    }));

    const newItem: BuildQueue = {
      id: `bq_${Date.now()}`,
      ship_type: selectedShip.name,
      quantity,
      progress: 0,
      completion_time: completionTime,
    };
    const newQueue = [...buildQueue, newItem];
    setBuildQueue(newQueue);
    localStorage.setItem(`shipyard_queue_${user.id}`, JSON.stringify(newQueue));

    const delay = totalTime * 1000;
    setTimeout(async () => {
      if (!user) return;
      const { data: existing } = await supabase
        .from('ships')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('ship_type', selectedShip.name)
        .maybeSingle();

      if (existing) {
        await supabase.from('ships').update({ quantity: existing.quantity + quantity }).eq('id', existing.id);
      } else {
        await supabase.from('ships').insert({ user_id: user.id, ship_type: selectedShip.name, quantity });
      }

      setBuildQueue(prev => {
        const updated = prev.filter(q => q.id !== newItem.id);
        localStorage.setItem(`shipyard_queue_${user.id}`, JSON.stringify(updated));
        return updated;
      });
    }, delay);

    setQuantity(1);
  };

  const cancelBuild = (queueId: string) => {
    if (!user) return;
    setBuildQueue(prev => {
      const updated = prev.filter(item => item.id !== queueId);
      localStorage.setItem(`shipyard_queue_${user.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const setMaxQuantity = () => {
    if (!selectedShip) return;
    const safeDiv = (a: number, b: number) => b > 0 ? Math.floor(a / b) : 9999;
    const maxMetal = safeDiv(resources.metal, selectedShip.metal_cost);
    const maxCrystal = safeDiv(resources.crystal, selectedShip.crystal_cost);
    const maxDeuterium = safeDiv(resources.deuterium, selectedShip.deuterium_cost);
    const max = Math.min(maxMetal, maxCrystal, maxDeuterium, 1000);
    setQuantity(Math.max(1, max));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBuildQueue(prev => prev.map(item => {
        const now = Date.now();
        const finish = new Date(item.completion_time).getTime();
        const total = finish - (now - (item.progress / 100) * (finish - now));
        const progress = Math.min(99, Math.max(0, ((total - (finish - now)) / total) * 100));
        return { ...item, progress };
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const mockShips = [
    { id: 'lf', name: 'Light Fighter', type: 'Combat', description: 'Fast and agile combat vessel, ideal for raids and escort missions.', attack: 50, defense: 25, speed: 12500, cargo: 50, metal_cost: 3000, crystal_cost: 1000, deuterium_cost: 0, build_time: 5 },
    { id: 'hf', name: 'Heavy Fighter', type: 'Combat', description: 'Armored fighter with superior firepower for frontline combat.', attack: 150, defense: 75, speed: 10000, cargo: 100, metal_cost: 6000, crystal_cost: 4000, deuterium_cost: 0, build_time: 10 },
    { id: 'cr', name: 'Cruiser', type: 'Combat', description: 'Mid-range warship with balanced offense and defense capabilities.', attack: 400, defense: 200, speed: 15000, cargo: 800, metal_cost: 20000, crystal_cost: 7000, deuterium_cost: 2000, build_time: 30 },
    { id: 'bs', name: 'Battleship', type: 'Combat', description: 'Massive warship with devastating firepower and heavy armor.', attack: 1000, defense: 500, speed: 10000, cargo: 1500, metal_cost: 45000, crystal_cost: 15000, deuterium_cost: 0, build_time: 60 },
    { id: 'sc', name: 'Small Cargo', type: 'Transport', description: 'Compact transport ship for quick resource deliveries.', attack: 5, defense: 20, speed: 5000, cargo: 5000, metal_cost: 2000, crystal_cost: 2000, deuterium_cost: 0, build_time: 8 },
    { id: 'lc', name: 'Large Cargo', type: 'Transport', description: 'Heavy freighter capable of transporting massive resource loads.', attack: 5, defense: 25, speed: 7500, cargo: 25000, metal_cost: 6000, crystal_cost: 6000, deuterium_cost: 0, build_time: 15 },
    { id: 'col', name: 'Colony Ship', type: 'Special', description: 'Carries colonists to establish new planetary settlements.', attack: 50, defense: 100, speed: 2500, cargo: 7500, metal_cost: 10000, crystal_cost: 20000, deuterium_cost: 10000, build_time: 120 },
    { id: 'rec', name: 'Recycler', type: 'Special', description: 'Salvage vessel that collects debris fields after battles.', attack: 1, defense: 10, speed: 2000, cargo: 20000, metal_cost: 10000, crystal_cost: 6000, deuterium_cost: 2000, build_time: 25 },
  ];

  return (
    <div className="text-white">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: 220 }}>
        <img
          src="https://readdy.ai/api/search-image?query=futuristic%20space%20shipyard%20orbital%20dry%20dock%20massive%20starships%20under%20construction%20robotic%20assembly%20arms%20glowing%20welding%20sparks%20vast%20space%20station%20interior%20cinematic%20sci-fi%20wide%20dramatic%20lighting%20epic%20scale&width=1920&height=440&seq=shipyard_hero_v3&orientation=landscape"
          alt="Shipyard"
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ filter: 'brightness(0.45) saturate(1.3)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(7,10,16,0.95) 100%)' }} />
        <div className="relative z-10 h-full flex items-end px-6 pb-5">
          <div className="flex items-end justify-between w-full">
            <div>
              <h1 className="text-4xl font-black mb-1" style={{ color: GOLD }}>Shipyard</h1>
              <p className="text-sm text-ogame-muted">Construct and commission your war fleet</p>
            </div>
            <div className="flex items-center gap-6">
              {[
                { label: 'Combat Ships', val: '4 types', color: '#f87171', icon: 'ri-sword-line' },
                { label: 'Transport Ships', val: '2 types', color: '#34d399', icon: 'ri-truck-line' },
                { label: 'Special Ships', val: '2 types', color: '#a78bfa', icon: 'ri-space-ship-line' },
              ].map(s => (
                <div key={s.label} className="text-right">
                  <div className="flex items-center gap-1.5 justify-end mb-0.5">
                    <i className={`${s.icon} text-sm`} style={{ color: s.color }}></i>
                    <p className="text-xs text-ogame-muted">{s.label}</p>
                  </div>
                  <p className="text-lg font-black" style={{ color: s.color }}>{s.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Ship type overview */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { type: 'Combat', desc: 'Attack and defend your empire', icon: 'ri-sword-line', color: '#f87171', ships: ['Light Fighter', 'Heavy Fighter', 'Cruiser', 'Battleship'] },
            { type: 'Transport', desc: 'Move resources across the galaxy', icon: 'ri-truck-line', color: '#34d399', ships: ['Small Cargo', 'Large Cargo'] },
            { type: 'Special', desc: 'Unique mission-critical vessels', icon: 'ri-space-ship-line', color: '#a78bfa', ships: ['Colony Ship', 'Recycler'] },
          ].map(cat => (
            <div key={cat.type} className="rounded-xl p-4" style={{ background: `${cat.color}08`, border: `1px solid ${cat.color}25` }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${cat.color}18` }}>
                  <i className={`${cat.icon} text-lg`} style={{ color: cat.color }}></i>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{cat.type}</p>
                  <p className="text-xs text-ogame-muted">{cat.desc}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {cat.ships.map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${cat.color}12`, color: cat.color }}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Build Queue */}
        {buildQueue.length > 0 && (
          <div className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(212,168,83,0.04)', border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="ri-time-line" style={{ color: GOLD }}></i>
                Build Queue ({buildQueue.length})
              </h2>
              <button
                onClick={() => { if (confirm('Clear entire build queue?')) setBuildQueue([]); }}
                className="text-xs text-red-400 px-3 py-1 rounded cursor-pointer whitespace-nowrap"
                style={{ background: 'rgba(248,113,113,0.1)' }}
              >
                <i className="ri-delete-bin-line mr-1"></i>Clear
              </button>
            </div>
            <div className="space-y-2">
              {buildQueue.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={getShipArt(item.ship_type).url} alt={item.ship_type} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white font-semibold">{item.quantity}x {item.ship_type}</span>
                      <span className="font-mono" style={{ color: GOLD }}>{Math.floor((new Date(item.completion_time).getTime() - Date.now()) / 60000)} min</span>
                    </div>
                    <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-2 rounded-full" style={{ width: `${item.progress}%`, background: GOLD_GRADIENT }} />
                    </div>
                  </div>
                  <button onClick={() => cancelBuild(item.id)} className="text-xs text-red-400 px-2 py-1 rounded cursor-pointer whitespace-nowrap" style={{ background: 'rgba(248,113,113,0.1)' }}>
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {/* Ship List */}
          <div className="col-span-8">
            <h2 className="text-base font-bold text-white mb-4">Available Ships</h2>
            <div className="grid grid-cols-2 gap-4">
              {(ships.length > 0 ? ships : mockShips).map((ship) => {
                const art = getShipArt(ship.name);
                const isSelected = selectedShip?.id === ship.id;
                const typeColor = ship.type === 'Combat' ? 'text-red-400 bg-red-500/10' : ship.type === 'Transport' ? 'text-green-400 bg-green-500/10' : 'text-purple-400 bg-purple-500/10';
                return (
                  <div
                    key={ship.id}
                    onClick={() => setSelectedShip(ship as any)}
                    className="rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02]"
                    style={{
                      background: isSelected ? 'rgba(212,168,83,0.06)' : CARD_BG,
                      border: isSelected ? `1px solid ${GOLD}80` : `1px solid ${BORDER}`,
                    }}
                  >
                    <div className="relative h-32 overflow-hidden">
                      <img src={art.url} alt={art.alt} className="w-full h-full object-cover object-center" style={{ filter: 'brightness(0.85) saturate(1.2)' }} />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(8,11,15,0.9) 100%)' }} />
                      <div className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-semibold ${typeColor}`}>{ship.type}</div>
                      <div className="absolute bottom-2 left-3 right-3">
                        <h3 className="text-sm font-black text-white drop-shadow-lg">{ship.name}</h3>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-ogame-muted mb-3 leading-relaxed">{ship.description}</p>
                      <div className="grid grid-cols-2 gap-1 mb-3">
                        {[
                          { icon: 'ri-sword-line', color: 'text-red-400', label: 'ATK', val: ship.attack },
                          { icon: 'ri-shield-line', color: 'text-teal-400', label: 'DEF', val: ship.defense },
                          { icon: 'ri-speed-line', color: 'text-green-400', label: 'SPD', val: ship.speed.toLocaleString() },
                          { icon: 'ri-archive-line', color: 'text-amber-400', label: 'CARGO', val: ship.cargo.toLocaleString() },
                        ].map(s => (
                          <div key={s.label} className="flex items-center gap-1.5 text-xs px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <i className={`${s.icon} ${s.color} text-xs`}></i>
                            <span className="text-ogame-dim">{s.label}</span>
                            <span className="text-white font-semibold ml-auto">{s.val}</span>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-xs">
                        <div className="text-center px-1 py-1 rounded" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <div className="text-ogame-dim">Metal</div>
                          <div className="text-amber-400 font-semibold">{(ship.metal_cost / 1000).toFixed(0)}K</div>
                        </div>
                        <div className="text-center px-1 py-1 rounded" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <div className="text-ogame-dim">Crystal</div>
                          <div className="text-teal-400 font-semibold">{(ship.crystal_cost / 1000).toFixed(0)}K</div>
                        </div>
                        <div className="text-center px-1 py-1 rounded" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <div className="text-ogame-dim">Time</div>
                          <div className="text-purple-400 font-semibold">{ship.build_time}m</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Build Panel */}
          <div className="col-span-4">
            <div className="rounded-xl overflow-hidden sticky top-24" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
              {selectedShip ? (
                <>
                  <div className="relative h-40 overflow-hidden">
                    <img src={getShipArt(selectedShip.name).url} alt={selectedShip.name} className="w-full h-full object-cover" style={{ filter: 'brightness(0.8) saturate(1.3)' }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(8,11,15,0.95) 100%)' }} />
                    <div className="absolute bottom-3 left-4 right-4">
                      <h2 className="text-lg font-black text-white">{selectedShip.name}</h2>
                      <p className="text-xs text-ogame-muted">{selectedShip.type}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-ogame-muted">Quantity</label>
                        <button onClick={setMaxQuantity} className="text-xs px-2 py-0.5 rounded cursor-pointer whitespace-nowrap" style={{ color: GOLD, background: 'rgba(212,168,83,0.1)' }}>
                          Max
                        </button>
                      </div>
                      <input
                        type="number" min="1" max="1000" value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none"
                        style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}` }}
                      />
                    </div>
                    <div className="space-y-2 mb-4">
                      {[
                        { label: 'Metal', val: selectedShip.metal_cost * quantity, have: resources.metal, color: 'text-amber-400' },
                        { label: 'Crystal', val: selectedShip.crystal_cost * quantity, have: resources.crystal, color: 'text-teal-400' },
                        { label: 'Deuterium', val: selectedShip.deuterium_cost * quantity, have: resources.deuterium, color: 'text-green-400' },
                      ].map(r => (
                        <div key={r.label} className="flex justify-between items-center text-xs px-3 py-2 rounded" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <span className="text-ogame-dim">{r.label}</span>
                          <span className={`font-semibold ${r.have >= r.val ? r.color : 'text-red-400'}`}>
                            {r.val.toLocaleString()}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center text-xs px-3 py-2 rounded" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <span className="text-ogame-dim">Build Time</span>
                        <span className="text-purple-400 font-semibold">{selectedShip.build_time * quantity} min</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={buildShip}
                        disabled={!canBuild(selectedShip)}
                        className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${canBuild(selectedShip) ? 'text-black cursor-pointer' : 'text-ogame-dim cursor-not-allowed'}`}
                        style={canBuild(selectedShip) ? { background: GOLD_GRADIENT } : { background: 'rgba(255,255,255,0.05)' }}
                      >
                        <i className="ri-hammer-line mr-1.5"></i>
                        Build {quantity}x {selectedShip.name}
                      </button>
                      <button
                        onClick={() => navigate('/buildings')}
                        className="w-full py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
                        style={{ color: GOLD, background: 'rgba(212,168,83,0.08)', border: `1px solid rgba(212,168,83,0.2)` }}
                      >
                        <i className="ri-building-line mr-1"></i>Upgrade Shipyard
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-16 px-6">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4" style={{ background: 'rgba(212,168,83,0.08)' }}>
                    <i className="ri-rocket-line text-3xl" style={{ color: `${GOLD}40` }}></i>
                  </div>
                  <p className="text-ogame-dim text-sm">Select a ship to build</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}