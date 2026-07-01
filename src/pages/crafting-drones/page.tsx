import { useState } from 'react';

interface DroneBlueprint {
  id: string;
  name: string;
  role: 'combat' | 'mining' | 'repair' | 'scout' | 'support' | 'carrier';
  class: 'Light' | 'Medium' | 'Heavy' | 'Titan';
  tier: number;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  description: string;
  lore: string;
  stats: Record<string, string | number>;
  abilities: string[];
  materials: { name: string; amount: number; owned: number; icon: string }[];
  craftTime: number;
  reqLevel: number;
  icon: string;
  image: string;
}

const DRONES: DroneBlueprint[] = [
  // Combat
  { id: 'd1', name: 'Wasp Interceptor Drone', role: 'combat', class: 'Light', tier: 1, rarity: 'Common', description: 'Fast light combat drone with rapid-fire lasers.', lore: 'Designed in the Terran shipyards for rapid harassment tactics.', stats: { Attack: 450, HP: 800, Speed: 480, 'Max Count': 12 }, abilities: ['Rapid Fire', 'Evasive Flight', 'Swarm Formation'], materials: [{ name: 'Steel Alloy', amount: 120, owned: 900, icon: 'ri-hammer-line' }, { name: 'Energy Crystal', amount: 40, owned: 350, icon: 'ri-flashlight-line' }, { name: 'Fuel Cell', amount: 5, owned: 45, icon: 'ri-battery-line' }], craftTime: 600, reqLevel: 5, icon: 'ri-bug-2-line', image: 'https://readdy.ai/api/search-image?query=sleek%20lightweight%20combat%20drone%20with%20rapid%20fire%20laser%20cannons%20metallic%20silver%20finish%20glowing%20blue%20thruster%20trails%20sci-fi%20game%20art%20dark%20space%20background&width=400&height=300&seq=drone-wasp-1&orientation=landscape' },
  { id: 'd2', name: 'Hornet Combat Drone', role: 'combat', class: 'Medium', tier: 2, rarity: 'Uncommon', description: 'Balanced combat drone with missiles and energy cannons.', lore: 'The workhorse of colonial defense forces across six sectors.', stats: { Attack: 1200, HP: 2500, Speed: 320, 'Max Count': 8 }, abilities: ['Missile Salvo', 'Shield Disrupt', 'Target Lock'], materials: [{ name: 'Titanium Alloy', amount: 200, owned: 180, icon: 'ri-hammer-fill' }, { name: 'Plasma Core', amount: 3, owned: 8, icon: 'ri-fire-line' }, { name: 'Shield Emitter', amount: 2, owned: 5, icon: 'ri-wifi-line' }], craftTime: 1200, reqLevel: 12, icon: 'ri-compass-3-line', image: 'https://readdy.ai/api/search-image?query=medium%20combat%20drone%20with%20twin%20missile%20launchers%20and%20energy%20cannons%20titanium%20casing%20dual%20thrusters%20hovering%20in%20space%20sci-fi%20game&width=400&height=300&seq=drone-hornet-1&orientation=landscape' },
  { id: 'd3', name: 'Reaper Heavy Gunship', role: 'combat', class: 'Heavy', tier: 4, rarity: 'Epic', description: 'Massive gunship drone with railguns and torpedo launchers.', lore: 'When you absolutely need something to stop existing.', stats: { Attack: 5500, HP: 12000, Speed: 180, 'Max Count': 3 }, abilities: ['Railgun Barrage', 'Quantum Torpedoes', 'Fortress Mode', 'Point Defense'], materials: [{ name: 'Quantum Steel', amount: 800, owned: 320, icon: 'ri-box-3-line' }, { name: 'Antimatter Cell', amount: 12, owned: 5, icon: 'ri-flashlight-fill' }, { name: 'Fusion Core', amount: 8, owned: 2, icon: 'ri-fire-fill' }], craftTime: 4800, reqLevel: 45, icon: 'ri-sword-line', image: 'https://readdy.ai/api/search-image?query=massive%20heavy%20gunship%20drone%20with%20huge%20railguns%20torpedo%20tubes%20heavy%20armor%20plating%20dark%20grey%20menacing%20hovering%20in%20asteroid%20field%20sci-fi%20game&width=400&height=300&seq=drone-reaper-1&orientation=landscape' },
  // Mining
  { id: 'd4', name: 'Digger Mining Drone', role: 'mining', class: 'Medium', tier: 1, rarity: 'Common', description: 'Autonomous mining drone with high-efficiency drills.', lore: 'Keeps the empire running one asteroid at a time.', stats: { 'Mining Rate': '250/hr', HP: 1200, Speed: 200, Capacity: 5000 }, abilities: ['Deep Drill', 'Auto-Sort', 'Cargo Expand'], materials: [{ name: 'Steel Alloy', amount: 200, owned: 900, icon: 'ri-hammer-line' }, { name: 'Copper Wire', amount: 80, owned: 420, icon: 'ri-cpu-line' }, { name: 'Fuel Cell', amount: 8, owned: 45, icon: 'ri-battery-line' }], craftTime: 900, reqLevel: 3, icon: 'ri-tools-line', image: 'https://readdy.ai/api/search-image?query=industrial%20mining%20drone%20with%20large%20drill%20arms%20ore%20collection%20containers%20asteroid%20mining%20operation%20space%20sci-fi%20game%20concept%20art&width=400&height=300&seq=drone-digger-1&orientation=landscape' },
  { id: 'd5', name: 'Harvester Swarm Drone', role: 'mining', class: 'Light', tier: 2, rarity: 'Uncommon', description: 'Swarm of micro-drones that extract multiple minerals simultaneously.', lore: 'Inspired by insect colony behavior from pre-space era biology.', stats: { 'Mining Rate': '500/hr', HP: 400, Speed: 650, 'Swarm Size': 20 }, abilities: ['Multi-Mineral', 'Swarm Tactics', 'Rapid Transport'], materials: [{ name: 'Silicon Wafer', amount: 150, owned: 620, icon: 'ri-subtract-line' }, { name: 'Rare Earth', amount: 30, owned: 95, icon: 'ri-landscape-line' }, { name: 'Energy Crystal', amount: 60, owned: 350, icon: 'ri-flashlight-line' }], craftTime: 1500, reqLevel: 10, icon: 'ri-bug-line', image: 'https://readdy.ai/api/search-image?query=swarm%20of%20tiny%20mining%20drones%20collecting%20minerals%20from%20crystal%20asteroid%20formation%20glowing%20sci-fi%20concept%20art&width=400&height=300&seq=drone-swarm-1&orientation=landscape' },
  // Repair
  { id: 'd6', name: 'Medic Repair Drone', role: 'repair', class: 'Light', tier: 1, rarity: 'Common', description: 'Deploys nanites to repair hull damage on allied ships.', lore: 'Saving ships since 2287. Literally saving ships.', stats: { 'Heal Rate': '150 HP/s', HP: 600, Speed: 400, Range: 800 }, abilities: ['Nanite Repair', 'Emergency Patch', 'Triage Protocol'], materials: [{ name: 'Raw Nanites', amount: 80, owned: 120, icon: 'ri-cpu-line' }, { name: 'Steel Alloy', amount: 100, owned: 900, icon: 'ri-hammer-line' }, { name: 'Fuel Cell', amount: 3, owned: 45, icon: 'ri-battery-line' }], craftTime: 600, reqLevel: 4, icon: 'ri-heart-pulse-line', image: 'https://readdy.ai/api/search-image?query=small%20white%20repair%20drone%20spraying%20blue%20nanite%20clouds%20on%20damaged%20spaceship%20hull%20sci-fi%20concept%20art%20clean%20aesthetic&width=400&height=300&seq=drone-medic-1&orientation=landscape' },
  { id: 'd7', name: 'Constructor Drone', role: 'repair', class: 'Heavy', tier: 3, rarity: 'Rare', description: 'Advanced construction drone that builds and repairs structures.', lore: 'Built the first colony on Kepler-22b. Still running.', stats: { 'Build Speed': '-25%', 'Repair Rate': '500 HP/s', HP: 3000, 'Carry Weight': 10000 }, abilities: ['Auto-Build', 'Rapid Repair', 'Structure Upgrade', 'Blueprint Analysis'], materials: [{ name: 'Durasteel', amount: 400, owned: 600, icon: 'ri-building-line' }, { name: 'Raw Nanites', amount: 200, owned: 120, icon: 'ri-cpu-line' }, { name: 'Quantum Processor', amount: 2, owned: 5, icon: 'ri-cpu-fill' }], craftTime: 2700, reqLevel: 28, icon: 'ri-building-3-line', image: 'https://readdy.ai/api/search-image?query=large%20construction%20drone%20with%20robotic%20arms%20welding%20tools%20and%20building%20equipment%20constructing%20space%20station%20module%20sci-fi&width=400&height=300&seq=drone-const-1&orientation=landscape' },
  // Scout
  { id: 'd8', name: 'Ghost Scout Drone', role: 'scout', class: 'Light', tier: 2, rarity: 'Uncommon', description: 'Ultra-fast stealth drone for reconnaissance missions.', lore: 'Sees everything. Never seen by anyone.', stats: { 'Scan Range': '5000 AU', HP: 200, Speed: 1200, Stealth: '95%' }, abilities: ['Phase Cloak', 'Deep Scan', 'Signal Tap', 'Rapid Escape'], materials: [{ name: 'Phase Crystal', amount: 2, owned: 8, icon: 'ri-contrast-2-line' }, { name: 'Titanium Alloy', amount: 80, owned: 180, icon: 'ri-hammer-fill' }, { name: 'Quantum Processor', amount: 1, owned: 5, icon: 'ri-cpu-fill' }], craftTime: 1800, reqLevel: 18, icon: 'ri-eye-line', image: 'https://readdy.ai/api/search-image?query=sleek%20translucent%20stealth%20scout%20drone%20with%20cloaking%20field%20barely%20visible%20sensor%20arrays%20glowing%20soft%20blue%20sci-fi%20recon%20vehicle&width=400&height=300&seq=drone-ghost-1&orientation=landscape' },
  // Support & Carrier
  { id: 'd9', name: 'Shield Bearer Drone', role: 'support', class: 'Medium', tier: 3, rarity: 'Rare', description: 'Projects a shield bubble over nearby allied ships.', lore: 'Worth more than a battleship. Until it gets hit.', stats: { 'Shield Bonus': '+2500', HP: 1800, Speed: 280, Range: 600 }, abilities: ['Shield Projection', 'Shield Relay', 'Emergency Overcharge'], materials: [{ name: 'Shield Emitter', amount: 8, owned: 5, icon: 'ri-wifi-line' }, { name: 'Durasteel', amount: 300, owned: 600, icon: 'ri-building-line' }, { name: 'Energy Crystal', amount: 200, owned: 350, icon: 'ri-flashlight-line' }], craftTime: 2400, reqLevel: 25, icon: 'ri-shield-star-line', image: 'https://readdy.ai/api/search-image?query=support%20drone%20projecting%20glowing%20blue%20shield%20bubble%20over%20fleet%20ships%20protection%20field%20sci-fi%20battle%20scene&width=400&height=300&seq=drone-shield-1&orientation=landscape' },
  { id: 'd10', name: 'Nexus Carrier Drone', role: 'carrier', class: 'Titan', tier: 5, rarity: 'Legendary', description: 'Massive carrier that deploys up to 24 combat drones.', lore: 'A war unto itself. Fifteen years to build. Fifteen minutes to make a point.', stats: { 'Drone Bays': 24, HP: 85000, Speed: 80, 'Command Range': 3000 }, abilities: ['Mass Deploy', 'Drone Recall', 'Tactical Network', 'Fortress Configuration', 'Repair Bay'], materials: [{ name: 'Cosmic Alloy', amount: 2000, owned: 180, icon: 'ri-star-fill' }, { name: 'Quantum Steel', amount: 5000, owned: 320, icon: 'ri-box-3-line' }, { name: 'Dark Matter Core', amount: 20, owned: 12, icon: 'ri-contrast-drop-fill' }], craftTime: 14400, reqLevel: 65, icon: 'ri-ship-2-line', image: 'https://readdy.ai/api/search-image?query=colossal%20carrier%20drone%20vessel%20with%20multiple%20launch%20bays%20deploying%20swarm%20of%20fighter%20drones%20in%20space%20epic%20scale%20sci-fi%20battle%20flagship&width=400&height=300&seq=drone-nexus-1&orientation=landscape' },
];

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  combat: { label: 'Combat', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: 'ri-sword-line' },
  mining: { label: 'Mining', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: 'ri-tools-line' },
  repair: { label: 'Repair', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', icon: 'ri-heart-pulse-line' },
  scout: { label: 'Scout', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', icon: 'ri-eye-line' },
  support: { label: 'Support', color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10 border-fuchsia-500/20', icon: 'ri-shield-star-line' },
  carrier: { label: 'Carrier', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: 'ri-ship-2-line' },
};

const RARITY_COLORS: Record<string, string> = {
  Common: 'text-slate-400', Uncommon: 'text-green-400', Rare: 'text-cyan-400', Epic: 'text-fuchsia-400', Legendary: 'text-amber-400',
};

export default function CraftingDronesPage() {
  const [activeRole, setActiveRole] = useState('all');
  const [selectedDrone, setSelectedDrone] = useState<DroneBlueprint | null>(null);
  const [qty, setQty] = useState(1);
  const [activeQueue] = useState([
    { name: 'Wasp Interceptor Drone', qty: 5, progress: 60, timeLeft: '4m 0s' },
    { name: 'Digger Mining Drone', qty: 2, progress: 25, timeLeft: '11m 15s' },
  ]);

  const filtered = activeRole === 'all' ? DRONES : DRONES.filter(d => d.role === activeRole);
  const canCraft = (d: DroneBlueprint) => d.materials.every(m => m.owned >= m.amount * qty);
  const formatTime = (s: number) => s >= 3600 ? `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m` : `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div className="min-h-screen bg-[#080b0f] text-white">
      {/* Hero */}
      <div className="relative h-52 overflow-hidden">
        <img src="https://readdy.ai/api/search-image?query=futuristic%20drone%20manufacturing%20facility%20with%20multiple%20drone%20assembly%20lines%20robotic%20arms%20attaching%20components%20glowing%20screens%20showing%20drone%20schematics%20sci-fi%20factory%20atmosphere%20dark%20blue%20tones&width=1920&height=380&seq=drones-hero-1&orientation=landscape" alt="Drone Workshop" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-slate-950"></div>
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <h1 className="text-4xl font-black text-white flex items-center gap-3 mb-1"><i className="ri-robot-2-line text-3xl text-cyan-400"></i> Drone Workshop</h1>
            <p className="text-slate-300">Build autonomous drones for combat, mining, repair, and more</p>
            <div className="flex gap-5 mt-3">
              {Object.entries(ROLE_CONFIG).map(([role, cfg]) => {
                const count = DRONES.filter(d => d.role === role).length;
                return <div key={role} className="text-center"><p className={`text-lg font-bold ${cfg.color}`}>{count}</p><p className="text-xs text-slate-400 capitalize">{cfg.label}</p></div>;
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Active Queue */}
      {activeQueue.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pt-5">
          <div className="bg-[#080b0f] rounded-xl p-4 border border-cyan-500/20">
            <h3 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2"><i className="ri-time-line"></i> Build Queue ({activeQueue.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeQueue.map((j, i) => (
                <div key={i} className="bg-slate-900/60 rounded-lg p-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-white">{j.qty}x {j.name}</span>
                    <span className="text-xs text-cyan-400">{j.timeLeft}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="h-2 bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full" style={{ width: `${j.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Role Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setActiveRole('all')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeRole === 'all' ? 'bg-[#d4a853]/15 text-[#d4a853] border border-[#1e2a36]' : 'bg-[#080b0f] text-[#8892aa] hover:text-white border border-[#1e2a36]'}`}>
            <i className="ri-apps-line mr-1"></i>All Drones
          </button>
          {Object.entries(ROLE_CONFIG).map(([role, cfg]) => (
            <button key={role} onClick={() => setActiveRole(role)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap border ${activeRole === role ? `${cfg.bg} ${cfg.color}` : 'bg-[#080b0f] text-[#8892aa] hover:text-white border-[#1e2a36]'}`}>
              <i className={`${cfg.icon} mr-1`}></i>{cfg.label}
            </button>
          ))}
        </div>

        {/* Drone Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(drone => {
            const cfg = ROLE_CONFIG[drone.role];
            return (
              <div key={drone.id} className="bg-[#080b0f] rounded-xl border border-[#1e2a36] hover:border-cyan-400/40 overflow-hidden transition-all cursor-pointer group" onClick={() => setSelectedDrone(drone)}>
                <div className="relative h-40 overflow-hidden">
                  <img src={drone.image} alt={drone.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                  <div className="absolute top-2 left-2 flex gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}><i className={`${cfg.icon} mr-1`}></i>{cfg.label}</span>
                    <span className="text-xs bg-slate-900/80 text-slate-300 px-2 py-1 rounded-full">T{drone.tier} {drone.class}</span>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <span className={`text-xs font-bold ${RARITY_COLORS[drone.rarity]}`}>{drone.rarity}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white mb-1">{drone.name}</h3>
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2">{drone.description}</p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {Object.entries(drone.stats).slice(0, 4).map(([k, v]) => (
                      <div key={k} className="bg-slate-900/50 rounded-lg p-2">
                        <p className="text-xs text-slate-500">{k}</p>
                        <p className="text-sm font-bold text-cyan-400">{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500"><i className="ri-time-line mr-1"></i>{formatTime(drone.craftTime)}</span>
                    <span className={canCraft(drone) ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{canCraft(drone) ? 'Craftable' : 'Needs Materials'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedDrone && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedDrone(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative h-48 overflow-hidden rounded-t-2xl">
              <img src={selectedDrone.image} alt={selectedDrone.name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
              <button onClick={() => setSelectedDrone(null)} className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 cursor-pointer"><i className="ri-close-line"></i></button>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-black text-white mb-1">{selectedDrone.name}</h2>
              <p className={`text-sm font-bold mb-1 ${RARITY_COLORS[selectedDrone.rarity]}`}>{selectedDrone.rarity} · T{selectedDrone.tier} {selectedDrone.class}</p>
              <p className="text-slate-400 text-sm italic mb-2">"{selectedDrone.lore}"</p>
              <p className="text-slate-300 text-sm mb-5">{selectedDrone.description}</p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {Object.entries(selectedDrone.stats).map(([k, v]) => (
                  <div key={k} className="bg-slate-800/60 rounded-xl p-3">
                    <p className="text-xs text-slate-500">{k}</p>
                    <p className="text-lg font-black text-cyan-400">{v}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {selectedDrone.abilities.map((a, i) => <span key={i} className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs font-medium">{a}</span>)}
              </div>

              <div className="bg-slate-800/60 rounded-xl p-4 mb-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Materials × {qty}</h4>
                {selectedDrone.materials.map(m => {
                  const needed = m.amount * qty;
                  const ok = m.owned >= needed;
                  return (
                    <div key={m.name} className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2"><i className={`${m.icon} text-slate-400`}></i><span className="text-sm text-white">{m.name}</span></div>
                      <span className={`text-sm font-bold ${ok ? 'text-green-400' : 'text-red-400'}`}>{m.owned}/{needed}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 items-center mb-5">
                <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded-lg hover:bg-slate-600 cursor-pointer"><i className="ri-subtract-line"></i></button>
                  <input type="number" value={qty} min={1} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} className="w-14 text-center bg-transparent text-white font-bold focus:outline-none" />
                  <button onClick={() => setQty(q => q + 1)} className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded-lg hover:bg-slate-600 cursor-pointer"><i className="ri-add-line"></i></button>
                </div>
                <div className="bg-slate-800 rounded-xl px-4 py-3">
                  <span className="text-white font-bold"><i className="ri-time-line mr-2 text-cyan-400"></i>{formatTime(selectedDrone.craftTime * qty)}</span>
                </div>
              </div>

              <button disabled={!canCraft(selectedDrone)}
                className={`w-full py-4 rounded-xl font-black text-lg transition-all whitespace-nowrap ${canCraft(selectedDrone) ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-400 cursor-pointer' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
                <i className="ri-robot-2-line mr-2"></i>
                {canCraft(selectedDrone) ? `Build ${qty}x ${selectedDrone.name}` : 'Insufficient Materials'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}