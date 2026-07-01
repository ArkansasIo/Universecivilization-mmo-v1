import { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
type OutcomeType = 'resources' | 'fleet' | 'dark_matter' | 'pirates' | 'asteroid' | 'nothing' | 'lost' | 'artifact';

interface ExpeditionOutcome {
  type: OutcomeType;
  title: string;
  description: string;
  rewards?: { metal?: number; crystal?: number; deuterium?: number; dark_matter?: number; ships?: string };
  color: string;
  icon: string;
}

interface ActiveExpedition {
  id: string;
  coordinates: string;
  ships: number;
  departure: string;
  returnTime: string;
  progress: number;
  status: 'traveling' | 'exploring' | 'returning';
}

interface ExpeditionLog {
  id: string;
  date: string;
  coordinates: string;
  outcome: ExpeditionOutcome;
}

// ── Mock outcomes ──────────────────────────────────────────────────────────
const OUTCOMES: ExpeditionOutcome[] = [
  {
    type: 'resources',
    title: 'Resource Cache Found',
    description: 'Your fleet discovered an abandoned mining operation with vast resources.',
    rewards: { metal: 1_250_000, crystal: 680_000, deuterium: 240_000 },
    color: '#fcd34d',
    icon: 'ri-copper-coin-line',
  },
  {
    type: 'dark_matter',
    title: 'Dark Matter Anomaly',
    description: 'A rare dark matter concentration — your scientists extracted significant amounts.',
    rewards: { dark_matter: 2_500 },
    color: '#c084fc',
    icon: 'ri-focus-2-line',
  },
  {
    type: 'fleet',
    title: 'Derelict Fleet Salvaged',
    description: 'The crew found and repaired abandoned warships drifting in the void.',
    rewards: { ships: '12x Fighter, 4x Cruiser, 1x Battleship' },
    color: '#4ade80',
    icon: 'ri-rocket-2-line',
  },
  {
    type: 'pirates',
    title: 'Pirate Encounter',
    description: 'Your fleet was ambushed by pirates. They fought them off but sustained losses.',
    rewards: { metal: 150_000, crystal: 80_000 },
    color: '#f87171',
    icon: 'ri-sword-line',
  },
  {
    type: 'asteroid',
    title: 'Rare Mineral Asteroid',
    description: 'A dense asteroid rich in rare minerals was captured and mined.',
    rewards: { metal: 3_000_000, crystal: 500_000 },
    color: '#fb923c',
    icon: 'ri-meteor-line',
  },
  {
    type: 'artifact',
    title: 'Ancient Artifact',
    description: 'An ancient alien device was recovered — scientists are studying its properties.',
    rewards: { dark_matter: 5_000, metal: 250_000 },
    color: '#38bdf8',
    icon: 'ri-ancient-gate-line',
  },
  {
    type: 'nothing',
    title: 'Nothing Found',
    description: 'The expedition explored a vast empty sector. Nothing of interest was found.',
    color: '#6b7280',
    icon: 'ri-star-line',
  },
  {
    type: 'lost',
    title: 'Fleet Lost in Void',
    description: 'Contact was lost with the fleet. The ships were swallowed by a gravitational anomaly.',
    color: '#dc2626',
    icon: 'ri-alert-line',
  },
];

const ACTIVE_EXPS: ActiveExpedition[] = [
  { id: 'e1', coordinates: '[4:122:16]', ships: 85, departure: '08:30', returnTime: '14:45', progress: 62, status: 'exploring' },
  { id: 'e2', coordinates: '[6:299:16]', ships: 200, departure: '10:15', returnTime: '18:00', progress: 30, status: 'traveling' },
];

const LOG: ExpeditionLog[] = [
  { id: 'l1', date: '2h ago',  coordinates: '[2:87:16]',  outcome: OUTCOMES[0] },
  { id: 'l2', date: '5h ago',  coordinates: '[5:344:16]', outcome: OUTCOMES[1] },
  { id: 'l3', date: '8h ago',  coordinates: '[3:178:16]', outcome: OUTCOMES[6] },
  { id: 'l4', date: '12h ago', coordinates: '[7:55:16]',  outcome: OUTCOMES[3] },
  { id: 'l5', date: '1d ago',  coordinates: '[1:412:16]', outcome: OUTCOMES[2] },
  { id: 'l6', date: '1d ago',  coordinates: '[9:30:16]',  outcome: OUTCOMES[4] },
  { id: 'l7', date: '2d ago',  coordinates: '[4:200:16]', outcome: OUTCOMES[5] },
  { id: 'l8', date: '2d ago',  coordinates: '[8:88:16]',  outcome: OUTCOMES[7] },
];

// ── Send expedition modal ──────────────────────────────────────────────────
function SendModal({ onClose, onSend }: { onClose: () => void; onSend: () => void }) {
  const [ships, setShips] = useState<Record<string, number>>({
    fighter: 0, cruiser: 0, battleship: 0, transport: 0,
  });
  const [galaxyPos, setGalaxyPos] = useState('');
  const total = Object.values(ships).reduce((a, b) => a + b, 0);

  const handleSend = () => {
    if (total === 0 || !galaxyPos) return;
    onSend();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl overflow-hidden" style={{ background: '#0a0f1e', border: '1px solid rgba(251,146,60,0.4)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-orange-400/20">
          <h2 className="text-sm font-bold text-orange-400">Send Expedition</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer">
            <i className="ri-close-line"></i>
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Galaxy Position (e.g. 4)</p>
            <input
              value={galaxyPos}
              onChange={e => setGalaxyPos(e.target.value)}
              placeholder="Enter galaxy 1-9"
              className="w-full bg-white/8 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-400/50"
            />
            <p className="text-xs text-gray-500 mt-1">Position 16 = deep space expedition slot</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">Fleet Composition</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(ships).map(([type, count]) => (
                <div key={type} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                  <span className="text-xs text-gray-300 flex-1 capitalize">{type}</span>
                  <input
                    type="number" min={0} value={count}
                    onChange={e => setShips(s => ({ ...s, [type]: Math.max(0, parseInt(e.target.value) || 0) }))}
                    className="w-16 bg-white/10 rounded px-2 py-0.5 text-xs text-white text-right border border-white/10 focus:outline-none focus:border-orange-400/50"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg p-3" style={{ background: 'rgba(251,146,60,0.06)', border: '1px solid rgba(251,146,60,0.2)' }}>
            <p className="text-xs text-orange-300 font-semibold mb-1">Expedition Tip</p>
            <p className="text-xs text-gray-400">Larger fleets have higher chances of finding resources and ships. Minimum 1 ship required. Expeditions take 4-16h depending on galaxy distance.</p>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-white/5 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-1.5 text-xs rounded border border-white/10 text-gray-400 hover:bg-white/5 cursor-pointer whitespace-nowrap">Cancel</button>
          <button
            onClick={handleSend}
            disabled={total === 0 || !galaxyPos}
            className="px-5 py-1.5 text-xs rounded font-bold bg-orange-500/20 border border-orange-500/40 text-orange-400 hover:bg-orange-500/30 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <i className="ri-rocket-line mr-1"></i>Send Expedition ({total} ships)
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function ExpeditionsPage() {
  const [showSend, setShowSend] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'log' | 'guide'>('active');
  const [activeExps, setActiveExps] = useState<ActiveExpedition[]>(ACTIVE_EXPS);
  const [logs] = useState<ExpeditionLog[]>(LOG);
  const [toast, setToast] = useState('');

  const handleSend = () => {
    setToast('Expedition fleet dispatched into deep space!');
    setTimeout(() => setToast(''), 3000);
  };

  const handleRecall = (id: string) => {
    setActiveExps(prev => prev.filter(e => e.id !== id));
    setToast('Fleet recalled — returning to home planet.');
    setTimeout(() => setToast(''), 3000);
  };

  const statusLabel = (s: ActiveExpedition['status']) => {
    const map = { traveling: { c: '#60a5fa', l: 'Traveling' }, exploring: { c: '#4ade80', l: 'Exploring' }, returning: { c: '#fbbf24', l: 'Returning' } };
    return map[s];
  };

  const outcomeStats = logs.reduce((acc, l) => {
    acc[l.outcome.type] = (acc[l.outcome.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="text-white px-6 py-5">
      {showSend && <SendModal onClose={() => setShowSend(false)} onSend={handleSend} />}

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-lg text-sm font-medium text-white"
          style={{ background: '#0d1526', border: '1px solid rgba(251,146,60,0.4)' }}>
          <i className="ri-check-line text-green-400 mr-2"></i>{toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-orange-400">Expeditions</h1>
          <p className="text-xs text-gray-400 mt-1">Send fleets to position 16 to explore deep space for resources, ships, and dark matter</p>
        </div>
        <button
          onClick={() => setShowSend(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 hover:bg-orange-500/30 transition-all cursor-pointer whitespace-nowrap text-sm font-semibold"
        >
          <i className="ri-rocket-2-line"></i>Send Expedition
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Slots Used', val: `${activeExps.length}/3`, icon: 'ri-time-line', color: '#fb923c' },
          { label: 'Total Sent',  val: '128',   icon: 'ri-rocket-line',      color: '#60a5fa' },
          { label: 'Resources',  val: '4.2B',   icon: 'ri-copper-coin-line', color: '#fcd34d' },
          { label: 'Dark Matter',val: '38,500', icon: 'ri-focus-2-line',     color: '#c084fc' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 flex items-center gap-3" style={{ background: `${s.color}0a`, border: `1px solid ${s.color}20` }}>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${s.color}15` }}>
              <i className={`${s.icon} text-lg`} style={{ color: s.color }}></i>
            </div>
            <div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-lg font-black" style={{ color: s.color }}>{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-white/5 rounded-lg p-1 w-fit">
        {(['active', 'log', 'guide'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer capitalize whitespace-nowrap"
            style={activeTab === tab
              ? { background: 'rgba(251,146,60,0.2)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.3)' }
              : { color: '#6b7280' }
            }
          >{tab === 'active' ? `Active (${activeExps.length})` : tab === 'log' ? 'History' : 'Guide'}</button>
        ))}
      </div>

      {/* Active tab */}
      {activeTab === 'active' && (
        <div className="space-y-3">
          {activeExps.length === 0 && (
            <div className="rounded-xl p-10 text-center" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <i className="ri-rocket-2-line text-4xl text-gray-600 block mb-2"></i>
              <p className="text-gray-400 text-sm">No active expeditions</p>
              <button onClick={() => setShowSend(true)} className="mt-3 text-xs text-orange-400 hover:underline cursor-pointer">Send one now</button>
            </div>
          )}
          {activeExps.map(exp => {
            const st = statusLabel(exp.status);
            return (
              <div key={exp.id} className="rounded-xl p-4" style={{ background: '#0d1526', border: '1px solid rgba(251,146,60,0.15)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Expedition → {exp.coordinates}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${st.c}15`, color: st.c, border: `1px solid ${st.c}30` }}>{st.l}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{exp.ships} ships · Departed {exp.departure} · Returns {exp.returnTime}</p>
                  </div>
                  <button
                    onClick={() => handleRecall(exp.id)}
                    className="text-xs px-3 py-1 rounded border border-red-400/30 text-red-400 hover:bg-red-400/10 cursor-pointer transition-all whitespace-nowrap"
                  >Recall</button>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Progress</span>
                    <span style={{ color: st.c }}>{exp.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/8 rounded-full overflow-hidden">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${exp.progress}%`, background: `linear-gradient(90deg, ${st.c}99, ${st.c})` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Log tab */}
      {activeTab === 'log' && (
        <div>
          {/* Outcome breakdown */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {OUTCOMES.slice(0, 4).map(o => (
              <div key={o.type} className="rounded-lg p-3 text-center" style={{ background: `${o.color}0a`, border: `1px solid ${o.color}20` }}>
                <i className={`${o.icon} text-lg block mb-1`} style={{ color: o.color }}></i>
                <p className="text-lg font-black" style={{ color: o.color }}>{outcomeStats[o.type] || 0}</p>
                <p className="text-xs text-gray-500 truncate">{o.title.split(' ')[0]}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {logs.map(log => (
              <div key={log.id} className="flex items-start gap-3 rounded-xl p-4" style={{ background: '#0d1526', border: `1px solid ${log.outcome.color}20` }}>
                <div className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${log.outcome.color}15` }}>
                  <i className={`${log.outcome.icon} text-base`} style={{ color: log.outcome.color }}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold" style={{ color: log.outcome.color }}>{log.outcome.title}</span>
                    <span className="text-xs text-gray-500">{log.date}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Expedition to {log.coordinates}</p>
                  {log.outcome.rewards && (
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                      {log.outcome.rewards.metal && <span className="text-xs text-yellow-400">+{(log.outcome.rewards.metal / 1000).toFixed(0)}K Metal</span>}
                      {log.outcome.rewards.crystal && <span className="text-xs text-cyan-400">+{(log.outcome.rewards.crystal / 1000).toFixed(0)}K Crystal</span>}
                      {log.outcome.rewards.deuterium && <span className="text-xs text-green-400">+{(log.outcome.rewards.deuterium / 1000).toFixed(0)}K Deuterium</span>}
                      {log.outcome.rewards.dark_matter && <span className="text-xs text-purple-400">+{log.outcome.rewards.dark_matter.toLocaleString()} DM</span>}
                      {log.outcome.rewards.ships && <span className="text-xs text-blue-400">Ships: {log.outcome.rewards.ships}</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guide tab */}
      {activeTab === 'guide' && (
        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{ background: '#0d1526', border: '1px solid rgba(251,146,60,0.2)' }}>
            <h3 className="text-sm font-bold text-orange-400 mb-3">How Expeditions Work</h3>
            <div className="space-y-2.5 text-xs text-gray-300 leading-relaxed">
              <p>Expeditions are missions sent to position <span className="text-orange-400 font-semibold">16</span> in any solar system — the deep space slot. Your fleet explores for several hours and returns with a random outcome.</p>
              <p>The <span className="text-white font-semibold">fleet size</span> influences the type and amount of finds. Larger fleets have higher chances of finding ships and bigger resource caches.</p>
              <p>You have a limited number of expedition slots based on your <span className="text-white font-semibold">Astrophysics technology</span> level. Research it to unlock more simultaneous expeditions.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {OUTCOMES.map(o => (
              <div key={o.type} className="rounded-xl p-4" style={{ background: `${o.color}08`, border: `1px solid ${o.color}25` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <i className={`${o.icon} text-base`} style={{ color: o.color }}></i>
                  <span className="text-xs font-bold" style={{ color: o.color }}>{o.title}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{o.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
