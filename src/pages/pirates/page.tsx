import { useState } from 'react';
import { usePirateSystem } from '../../hooks/usePirateSystem';
import { useAuth } from '../../contexts/AuthContext';

/* ── Static bounty board data ──────────────────────────────────────── */
type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme' | 'legendary';

interface PirateFleet {
  id: string;
  name: string;
  captain: string;
  difficulty: Difficulty;
  level: number;
  power: number;
  bounty: number;
  location: { galaxy: number; system: number; position: number };
  ships: Record<string, number>;
  loot: { metal: number; crystal: number; deuterium: number; dark_matter: number };
  specialDrop?: string;
  lore: string;
  expiresIn: string;
}

const PIRATE_FLEETS: PirateFleet[] = [
  {
    id: 'pf1', name: 'Razor Wind Squadron', captain: 'Iron Maw', difficulty: 'easy', level: 8, power: 12000, bounty: 150000,
    location: { galaxy: 2, system: 145, position: 6 },
    ships: { 'Fighter': 25, 'Corvette': 8, 'Raider Frigate': 3 },
    loot: { metal: 280000, crystal: 140000, deuterium: 55000, dark_matter: 0 },
    lore: 'A band of low-level raiders that harass trade routes in the outer rim.',
    expiresIn: '4h 22m',
  },
  {
    id: 'pf2', name: 'Void Stalkers', captain: 'Nyx the Cruel', difficulty: 'medium', level: 15, power: 38000, bounty: 500000,
    location: { galaxy: 3, system: 287, position: 9 },
    ships: { 'Assault Fighter': 40, 'Heavy Corvette': 15, 'Cruiser': 6, 'Void Specter': 2 },
    loot: { metal: 680000, crystal: 380000, deuterium: 150000, dark_matter: 800 },
    specialDrop: 'Void Cloak Module',
    lore: 'Nyx the Cruel has terrorized sector 7 for two years. A bounty of 500K credits awaits her capture.',
    expiresIn: '2h 11m',
  },
  {
    id: 'pf3', name: 'Crimson Tide Armada', captain: 'Admiral Bloodsail', difficulty: 'hard', level: 22, power: 95000, bounty: 1800000,
    location: { galaxy: 1, system: 89, position: 12 },
    ships: { 'Elite Fighter': 60, 'War Cruiser': 20, 'Battleship': 8, 'Command Frigate': 3, 'Blockade Runner': 2 },
    loot: { metal: 1800000, crystal: 900000, deuterium: 420000, dark_matter: 3500 },
    specialDrop: 'Crimson Fleet Blueprint',
    lore: 'The most feared pirate armada in the galaxy. Admiral Bloodsail destroyed 200 colony ships last cycle.',
    expiresIn: '6h 45m',
  },
  {
    id: 'pf4', name: 'Shadow Legion', captain: 'The Phantom', difficulty: 'extreme', level: 35, power: 220000, bounty: 6000000,
    location: { galaxy: 4, system: 512, position: 3 },
    ships: { 'Shadow Fighter': 100, 'Ghost Cruiser': 35, 'Phantom Dreadnought': 5, 'Stealth Carrier': 2, 'Leviathan': 1 },
    loot: { metal: 5000000, crystal: 2800000, deuterium: 1200000, dark_matter: 18000 },
    specialDrop: 'Stealth Drive Mk.V',
    lore: '"The Phantom" has never been seen in person. No survivor has ever confirmed they exist. Only death as evidence.',
    expiresIn: '11h 30m',
  },
  {
    id: 'pf5', name: 'Eternal Scourge', captain: 'Warlord Xerath', difficulty: 'legendary', level: 50, power: 650000, bounty: 25000000,
    location: { galaxy: 7, system: 777, position: 7 },
    ships: { 'Immortal Vanguard': 150, 'Eternal Warship': 60, 'Doomsday Carrier': 10, 'Titan Destroyer': 5, 'God-Killer Fortress': 1 },
    loot: { metal: 15000000, crystal: 8000000, deuterium: 4000000, dark_matter: 75000 },
    specialDrop: 'Legendary Titan Blueprint',
    lore: 'Warlord Xerath conquered seven galaxies before vanishing for 50 years. He has returned. And he is angry.',
    expiresIn: '23h 59m',
  },
  {
    id: 'pf6', name: 'Rust Bucket Clan', captain: 'Old Scrap', difficulty: 'easy', level: 5, power: 6000, bounty: 60000,
    location: { galaxy: 1, system: 34, position: 8 },
    ships: { 'Scrap Fighter': 15, 'Old Corvette': 5 },
    loot: { metal: 120000, crystal: 60000, deuterium: 20000, dark_matter: 0 },
    lore: 'A comically under-equipped pirate crew. Even they seem embarrassed about it.',
    expiresIn: '1h 08m',
  },
  {
    id: 'pf7', name: 'Nebula Raiders', captain: 'Captain Stardust', difficulty: 'medium', level: 18, power: 52000, bounty: 750000,
    location: { galaxy: 5, system: 321, position: 4 },
    ships: { 'Nebula Glider': 50, 'Storm Cruiser': 18, 'Pulse Frigate': 7, 'Field Carrier': 2 },
    loot: { metal: 950000, crystal: 520000, deuterium: 210000, dark_matter: 1200 },
    specialDrop: 'Nebula Drive System',
    lore: 'They drift through the nebulae, ambushing miners and traders who venture too far from trade lanes.',
    expiresIn: '3h 55m',
  },
];

const DIFF_STYLE: Record<Difficulty, { color: string; bg: string; glow: string; label: string }> = {
  easy: { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', glow: '0 0 10px rgba(74,222,128,0.2)', label: 'EASY' },
  medium: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', glow: '0 0 10px rgba(251,191,36,0.2)', label: 'MEDIUM' },
  hard: { color: '#fb923c', bg: 'rgba(251,146,60,0.1)', glow: '0 0 10px rgba(251,146,60,0.2)', label: 'HARD' },
  extreme: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', glow: '0 0 10px rgba(248,113,113,0.25)', label: 'EXTREME' },
  legendary: { color: '#c084fc', bg: 'rgba(192,132,252,0.1)', glow: '0 0 15px rgba(192,132,252,0.3)', label: 'LEGENDARY' },
};

/* ── Combat result panel ──────────────────────────────────────────── */
interface CombatResult { victory: boolean; target: string; loot: PirateFleet['loot']; bounty: number; specialDrop?: string; shipsLost: number }

function CombatResultPanel({ result, onClose }: { result: CombatResult; onClose: () => void }) {
  const color = result.victory ? '#4ade80' : '#f87171';
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl overflow-hidden" style={{ background: '#0a0f1e', border: `1px solid ${color}35` }} onClick={e => e.stopPropagation()}>
        <div className="text-center py-8 px-5">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${color}15`, border: `2px solid ${color}40` }}>
            <i className={`${result.victory ? 'ri-trophy-fill' : 'ri-skull-2-fill'} text-4xl`} style={{ color }}></i>
          </div>
          <h2 className="text-2xl font-black mb-1" style={{ color }}>{result.victory ? 'VICTORY!' : 'DEFEATED'}</h2>
          <p className="text-sm text-gray-400 mb-6">vs {result.target}</p>
        </div>

        {result.victory ? (
          <div className="px-5 pb-5 space-y-3">
            <div className="rounded-lg p-4" style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)' }}>
              <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-3">Rewards</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-400">Bounty Claim</span><span className="font-bold text-amber-400">{result.bounty.toLocaleString()} Credits</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Metal Looted</span><span className="font-bold text-yellow-400">{result.loot.metal.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Crystal Looted</span><span className="font-bold text-sky-400">{result.loot.crystal.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Deuterium Looted</span><span className="font-bold text-green-400">{result.loot.deuterium.toLocaleString()}</span></div>
                {result.loot.dark_matter > 0 && <div className="flex justify-between text-sm"><span className="text-gray-400">Dark Matter</span><span className="font-bold text-purple-400">{result.loot.dark_matter.toLocaleString()}</span></div>}
                {result.specialDrop && <div className="flex justify-between text-sm"><span className="text-gray-400">Special Drop</span><span className="font-bold text-cyan-400">{result.specialDrop}</span></div>}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-1">
              <span>Ships Lost: <span className="text-red-400">{result.shipsLost}</span></span>
              <span>Reputation: <span className="text-green-400">+{Math.floor(result.bounty / 1000)}</span></span>
            </div>
          </div>
        ) : (
          <div className="px-5 pb-5">
            <div className="rounded-lg p-4 mb-3" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
              <p className="text-sm text-gray-300">Your fleet was overwhelmed. Strengthen your ships and research before retrying.</p>
              <p className="text-xs text-red-400 mt-2">Ships Lost: <span className="font-bold">{result.shipsLost}</span></p>
            </div>
          </div>
        )}

        <div className="px-5 pb-5">
          <button onClick={onClose} className="w-full py-2.5 rounded-lg text-sm font-bold cursor-pointer transition-all whitespace-nowrap" style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}>
            {result.victory ? <><i className="ri-check-line mr-1"></i>Collect Rewards</> : <><i className="ri-refresh-line mr-1"></i>Return to Bounty Board</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────────── */
export default function PiratesPage() {
  const { user } = useAuth();
  const { reputation, loading, pirateFleets, activeHunts } = usePirateSystem(user?.id || '');

  const [activeTab, setActiveTab] = useState<'board' | 'active' | 'history' | 'rewards'>('board');
  const [filterDiff, setFilterDiff] = useState<string>('all');
  const [selected, setSelected] = useState<PirateFleet | null>(null);
  const [launching, setLaunching] = useState<string | null>(null);
  const [combatResult, setCombatResult] = useState<CombatResult | null>(null);
  const [completedHunts, setCompletedHunts] = useState<{ fleet: PirateFleet; result: CombatResult }[]>([]);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const displayFleets = PIRATE_FLEETS;
  const filtered = filterDiff === 'all' ? displayFleets : displayFleets.filter(f => f.difficulty === filterDiff);

  const handleHunt = async (fleet: PirateFleet) => {
    setLaunching(fleet.id);
    await new Promise(r => setTimeout(r, 1500));
    setLaunching(null);
    const victory = Math.random() > 0.3;
    const shipsLost = victory
      ? Math.floor(Math.random() * 20) + 2
      : Math.floor(Math.random() * 80) + 30;
    const result: CombatResult = { victory, target: fleet.name, loot: fleet.loot, bounty: fleet.bounty, specialDrop: fleet.specialDrop, shipsLost };
    setCombatResult(result);
    if (victory) {
      setCompletedHunts(prev => [{ fleet, result }, ...prev]);
      showToast(`${fleet.name} eliminated! Bounty collected.`);
    }
  };

  const stats = {
    kills: completedHunts.filter(h => h.result.victory).length + 47,
    bountyTotal: completedHunts.reduce((a, h) => a + (h.result.victory ? h.result.bounty : 0), 0) + 8400000,
    rank: 'Pirate Hunter',
    repPoints: completedHunts.length * 150 + 4800,
  };

  return (
    <div className="text-white px-6 py-5">
      {combatResult && <CombatResultPanel result={combatResult} onClose={() => setCombatResult(null)} />}

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-lg text-sm font-medium text-white" style={{ background: '#0d1526', border: '1px solid rgba(248,113,113,0.4)' }}>
          <i className="ri-skull-2-fill text-red-400 mr-2"></i>{toast}
        </div>
      )}

      {/* Hero header */}
      <div className="relative rounded-xl overflow-hidden mb-6" style={{ height: 140 }}>
        <img
          src="https://readdy.ai/api/search-image?query=dark%20space%20bounty%20hunter%20scene%20with%20pirate%20spaceships%20skull%20flags%20dramatic%20red%20and%20purple%20lighting%20skull%20and%20crossbones%20cosmic%20horror%20fleet%20dangerous%20looking%20sci-fi%20vessels&width=1200&height=280&seq=pirate-hero-001&orientation=landscape"
          alt="Pirate Hunting"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 px-6 flex items-center">
          <div>
            <h1 className="text-3xl font-black text-white">Pirate Hunter</h1>
            <p className="text-sm text-gray-300 mt-1">Hunt notorious space pirates across the galaxy and collect their bounties</p>
          </div>
          <div className="ml-auto flex gap-4">
            {[
              { label: 'Rank', val: stats.rank, color: '#f87171' },
              { label: 'Kills', val: stats.kills, color: '#fb923c' },
              { label: 'Bounties', val: `${(stats.bountyTotal / 1000000).toFixed(1)}M`, color: '#fbbf24' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-xs text-gray-400">{s.label}</p>
                <p className="text-lg font-black" style={{ color: s.color }}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-white/5 rounded-lg p-1 w-fit">
        {([['board', `Bounty Board (${displayFleets.length})`], ['active', 'Active Hunts'], ['history', 'History'], ['rewards', 'Bounty Rewards']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap"
            style={activeTab === id
              ? { background: 'rgba(248,113,113,0.2)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }
              : { color: '#6b7280' }
            }
          >{label}</button>
        ))}
      </div>

      {/* Bounty Board */}
      {activeTab === 'board' && (
        <div>
          {/* Difficulty filter */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {['all', 'easy', 'medium', 'hard', 'extreme', 'legendary'].map(d => (
                <button
                  key={d}
                  onClick={() => setFilterDiff(d)}
                  className="px-3 py-1 text-xs font-semibold rounded capitalize cursor-pointer transition-all whitespace-nowrap"
                  style={filterDiff === d
                    ? (d === 'all' ? { background: 'rgba(248,113,113,0.2)', color: '#f87171' } : { background: DIFF_STYLE[d as Difficulty].bg, color: DIFF_STYLE[d as Difficulty].color })
                    : { color: '#6b7280' }
                  }
                >{d}</button>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-auto">{filtered.length} targets available</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(fleet => {
              const ds = DIFF_STYLE[fleet.difficulty];
              const isLaunching = launching === fleet.id;

              return (
                <div
                  key={fleet.id}
                  className="rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.01]"
                  style={{ background: '#0d1526', border: `1px solid ${ds.color}20`, boxShadow: selected?.id === fleet.id ? ds.glow : 'none' }}
                  onClick={() => setSelected(selected?.id === fleet.id ? null : fleet)}
                >
                  {/* Card header */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: ds.bg, color: ds.color, border: `1px solid ${ds.color}30` }}>{ds.label}</span>
                          <span className="text-xs text-gray-500">Lv.{fleet.level} · Power: {fleet.power.toLocaleString()}</span>
                        </div>
                        <h3 className="text-sm font-bold text-white">{fleet.name}</h3>
                        <p className="text-xs" style={{ color: ds.color }}>Capt. {fleet.captain}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-400">Bounty</p>
                        <p className="text-lg font-black text-amber-400">{(fleet.bounty / 1000).toFixed(0)}K</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">{fleet.lore}</p>

                    {/* Location */}
                    <div className="flex items-center gap-3 text-xs mb-3">
                      <span className="text-gray-500"><i className="ri-map-pin-line mr-1"></i>[{fleet.location.galaxy}:{fleet.location.system}:{fleet.location.position}]</span>
                      <span style={{ color: '#f87171' }}><i className="ri-time-line mr-1"></i>Expires: {fleet.expiresIn}</span>
                    </div>

                    {/* Ships */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {Object.entries(fleet.ships).map(([ship, count]) => (
                        <span key={ship} className="text-xs px-2 py-0.5 rounded" style={{ background: `${ds.color}10`, color: ds.color, border: `1px solid ${ds.color}20` }}>
                          {count}× {ship}
                        </span>
                      ))}
                    </div>

                    {/* Loot preview */}
                    {selected?.id === fleet.id && (
                      <div className="rounded-lg p-3 mb-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-xs text-gray-500 mb-2">Estimated Loot</p>
                        <div className="grid grid-cols-2 gap-1.5 text-xs">
                          <span style={{ color: '#fcd34d' }}>Metal: {fleet.loot.metal.toLocaleString()}</span>
                          <span style={{ color: '#60a5fa' }}>Crystal: {fleet.loot.crystal.toLocaleString()}</span>
                          <span style={{ color: '#4ade80' }}>Deuterium: {fleet.loot.deuterium.toLocaleString()}</span>
                          {fleet.loot.dark_matter > 0 && <span style={{ color: '#c084fc' }}>Dark Matter: {fleet.loot.dark_matter.toLocaleString()}</span>}
                        </div>
                        {fleet.specialDrop && (
                          <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: '#00d4ff' }}>
                            <i className="ri-star-fill"></i>
                            <span>Special Drop: <span className="font-semibold">{fleet.specialDrop}</span></span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Hunt button */}
                    <button
                      onClick={e => { e.stopPropagation(); handleHunt(fleet); }}
                      disabled={isLaunching}
                      className="w-full py-2 rounded-lg text-xs font-bold cursor-pointer transition-all disabled:opacity-60 whitespace-nowrap"
                      style={{ background: `${ds.color}20`, border: `1px solid ${ds.color}35`, color: ds.color }}
                    >
                      {isLaunching
                        ? <><i className="ri-loader-4-line animate-spin mr-1"></i>Launching Hunt...</>
                        : <><i className="ri-rocket-2-line mr-1"></i>Hunt This Target</>
                      }
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Hunts */}
      {activeTab === 'active' && (
        <div>
          {activeHunts.length === 0 && completedHunts.length === 0 ? (
            <div className="rounded-xl p-12 text-center" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <i className="ri-rocket-2-line text-4xl text-gray-600 block mb-2"></i>
              <p className="text-gray-400 text-sm">No active hunts. Start hunting from the Bounty Board!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedHunts.map((h, i) => (
                <div key={i} className="rounded-xl p-4" style={{ background: '#0d1526', border: `1px solid ${h.result.victory ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: h.result.victory ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)' }}>
                      <i className={`${h.result.victory ? 'ri-trophy-fill text-green-400' : 'ri-close-circle-fill text-red-400'} text-lg`}></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{h.fleet.name} — Capt. {h.fleet.captain}</p>
                      <p className="text-xs text-gray-400">{h.result.victory ? 'Eliminated' : 'Escaped'} · Ships lost: {h.result.shipsLost}</p>
                    </div>
                    {h.result.victory && (
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Bounty Collected</p>
                        <p className="text-sm font-bold text-amber-400">{h.result.bounty.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History */}
      {activeTab === 'history' && (
        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-xl p-5" style={{ background: '#0d1526', border: '1px solid rgba(248,113,113,0.2)' }}>
            <h3 className="text-sm font-bold text-red-400 mb-4">Hunter Statistics</h3>
            <div className="space-y-3">
              {[
                { label: 'Total Kills', val: stats.kills, color: '#f87171' },
                { label: 'Bounties Collected', val: `${(stats.bountyTotal / 1000000).toFixed(1)}M Credits`, color: '#fbbf24' },
                { label: 'Reputation Points', val: stats.repPoints.toLocaleString(), color: '#a78bfa' },
                { label: 'Current Rank', val: stats.rank, color: '#4ade80' },
                { label: 'Easy Cleared', val: 28, color: '#4ade80' },
                { label: 'Medium Cleared', val: 12, color: '#fbbf24' },
                { label: 'Hard Cleared', val: 5, color: '#fb923c' },
                { label: 'Extreme Cleared', val: 2, color: '#f87171' },
                { label: 'Legendary Cleared', val: 0, color: '#c084fc' },
              ].map(s => (
                <div key={s.label} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span className="text-xs text-gray-400">{s.label}</span>
                  <span className="text-xs font-bold" style={{ color: s.color }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl p-5" style={{ background: '#0d1526', border: '1px solid rgba(251,191,36,0.2)' }}>
            <h3 className="text-sm font-bold text-amber-400 mb-4">Resources Plundered</h3>
            <div className="space-y-4">
              {[
                { label: 'Metal', val: '48.2M', pct: 82, color: '#fcd34d' },
                { label: 'Crystal', val: '24.1M', pct: 64, color: '#60a5fa' },
                { label: 'Deuterium', val: '10.5M', pct: 46, color: '#4ade80' },
                { label: 'Dark Matter', val: '94,800', pct: 28, color: '#c084fc' },
              ].map(r => (
                <div key={r.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: r.color }}>{r.label}</span>
                    <span className="font-bold text-white">{r.val}</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-2 rounded-full transition-all" style={{ width: `${r.pct}%`, background: r.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bounty Rewards */}
      {activeTab === 'rewards' && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { title: 'Novice Hunter', req: 'Kill 10 Easy targets', reward: 'Hunter Badge + 100K Credits', unlocked: true, color: '#4ade80' },
            { title: 'Bounty Seeker', req: 'Earn 1M in bounties', reward: 'Speed Booster (3 days)', unlocked: true, color: '#4ade80' },
            { title: 'Pirate Scourge', req: 'Kill 5 Hard targets', reward: 'Rare Ship Blueprint', unlocked: false, color: '#fb923c' },
            { title: 'Fear Incarnate', req: 'Kill 1 Extreme target', reward: '5,000 Dark Matter', unlocked: false, color: '#f87171' },
            { title: 'Legendary Hunter', req: 'Kill 1 Legendary target', reward: 'Legendary Officer + 50K DM', unlocked: false, color: '#c084fc' },
            { title: 'Exterminator', req: 'Kill 100 total pirates', reward: 'Exterminator Title + Unique Ship', unlocked: false, color: '#00d4ff' },
          ].map((reward, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: '#0d1526', border: `1px solid ${reward.color}${reward.unlocked ? '30' : '15'}`, opacity: reward.unlocked ? 1 : 0.7 }}>
              <div className="flex items-start justify-between mb-2">
                <i className={`${reward.unlocked ? 'ri-checkbox-circle-fill' : 'ri-lock-2-line'} text-lg`} style={{ color: reward.unlocked ? reward.color : '#4b5563' }}></i>
                {reward.unlocked && <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: `${reward.color}15`, color: reward.color }}>CLAIMED</span>}
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{reward.title}</h4>
              <p className="text-xs text-gray-400 mb-2">{reward.req}</p>
              <p className="text-xs font-semibold" style={{ color: reward.color }}>{reward.reward}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}