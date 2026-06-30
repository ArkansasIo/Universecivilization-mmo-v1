import { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
interface ACSFleet {
  id: string;
  owner: string;
  alliance: string;
  ships: number;
  shipTypes: { type: string; count: number }[];
  status: 'confirmed' | 'pending' | 'recalled';
  origin: string;
}

interface ACSMission {
  id: string;
  target: string;
  targetPlayer: string;
  targetAlliance: string;
  arrivalTime: string;
  missionType: 'attack' | 'defend';
  fleets: ACSFleet[];
  initiator: string;
  status: 'forming' | 'traveling' | 'returning';
  progress: number;
}

// ── Mock data ──────────────────────────────────────────────────────────────
const MOCK_MISSIONS: ACSMission[] = [
  {
    id: 'acs1',
    target: '[3:421:9]',
    targetPlayer: 'Emperor Stellar',
    targetAlliance: '[VOID]',
    arrivalTime: '00:45:22',
    missionType: 'attack',
    initiator: 'Commander Nexus',
    status: 'forming',
    progress: 0,
    fleets: [
      { id: 'f1', owner: 'Commander Nexus (You)', alliance: '[NOVA]', ships: 850, shipTypes: [{ type: 'Battleship', count: 200 }, { type: 'Cruiser', count: 350 }, { type: 'Destroyer', count: 300 }], status: 'confirmed', origin: '[1:234:8]' },
      { id: 'f2', owner: 'Admiral Vortex', alliance: '[NOVA]', ships: 500, shipTypes: [{ type: 'Battleship', count: 150 }, { type: 'Fighter', count: 350 }], status: 'confirmed', origin: '[1:234:5]' },
      { id: 'f3', owner: 'Captain Zenith', alliance: '[NOVA]', ships: 300, shipTypes: [{ type: 'Cruiser', count: 180 }, { type: 'Fighter', count: 120 }], status: 'pending', origin: '[1:235:3]' },
    ],
  },
  {
    id: 'acs2',
    target: '[2:156:8]',
    targetPlayer: 'Lord Quantum',
    targetAlliance: '[TITAN]',
    arrivalTime: '02:10:08',
    missionType: 'defend',
    initiator: 'General Nova',
    status: 'traveling',
    progress: 35,
    fleets: [
      { id: 'f4', owner: 'General Nova', alliance: '[NOVA]', ships: 1200, shipTypes: [{ type: 'Battleship', count: 400 }, { type: 'Destroyer', count: 800 }], status: 'confirmed', origin: '[2:100:12]' },
      { id: 'f5', owner: 'Commander Nexus (You)', alliance: '[NOVA]', ships: 600, shipTypes: [{ type: 'Cruiser', count: 300 }, { type: 'Battleship', count: 300 }], status: 'confirmed', origin: '[1:234:8]' },
    ],
  },
];

// ── Component helpers ──────────────────────────────────────────────────────
function FleetStatusBadge({ status }: { status: ACSFleet['status'] }) {
  const map: Record<ACSFleet['status'], { bg: string; color: string; label: string }> = {
    confirmed: { bg: 'bg-green-400/10', color: 'text-green-400', label: 'Confirmed' },
    pending:   { bg: 'bg-amber-400/10', color: 'text-amber-400', label: 'Pending' },
    recalled:  { bg: 'bg-red-400/10',   color: 'text-red-400',   label: 'Recalled' },
  };
  const s = map[status];
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.color}`}>{s.label}</span>;
}

function MissionStatusBadge({ status }: { status: ACSMission['status'] }) {
  const map: Record<ACSMission['status'], { color: string; label: string }> = {
    forming:   { color: '#fbbf24', label: 'Forming' },
    traveling: { color: '#60a5fa', label: 'Traveling' },
    returning: { color: '#4ade80', label: 'Returning' },
  };
  const s = map[status];
  return <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30` }}>{s.label}</span>;
}

// ── Create ACS Modal ──────────────────────────────────────────────────────
function CreateACSModal({ onClose, onCreate }: { onClose: () => void; onCreate: () => void }) {
  const [target, setTarget] = useState('');
  const [type, setType] = useState<'attack' | 'defend'>('attack');
  const [message, setMessage] = useState('');

  const handleCreate = () => {
    if (!target) return;
    onCreate();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl" style={{ background: '#0a0f1e', border: '1px solid rgba(251,191,36,0.3)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-amber-400/15">
          <h2 className="text-sm font-bold text-amber-400">Create ACS Mission</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"><i className="ri-close-line"></i></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Mission Type</label>
            <div className="flex gap-2">
              {(['attack', 'defend'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer capitalize whitespace-nowrap"
                  style={type === t
                    ? { background: t === 'attack' ? 'rgba(248,113,113,0.2)' : 'rgba(96,165,250,0.2)', color: t === 'attack' ? '#f87171' : '#60a5fa', border: `1px solid ${t === 'attack' ? '#f87171' : '#60a5fa'}40` }
                    : { background: 'rgba(255,255,255,0.05)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)' }}
                ><i className={`${t === 'attack' ? 'ri-sword-line' : 'ri-shield-line'} mr-1`}></i>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Target Coordinates</label>
            <input
              value={target}
              onChange={e => setTarget(e.target.value)}
              placeholder="[G:S:P]"
              className="w-full bg-white/8 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400/50"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Message to Alliance (optional)</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value.slice(0, 500))}
              placeholder="Coordination message..."
              rows={3}
              maxLength={500}
              className="w-full bg-white/8 border border-white/10 rounded-lg px-3 py-2 text-xs text-white resize-none focus:outline-none focus:border-amber-400/50"
            />
            <p className="text-xs text-gray-600 text-right mt-0.5">{message.length}/500</p>
          </div>
          <div className="rounded-lg p-3" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}>
            <p className="text-xs text-amber-300 font-semibold mb-1">ACS Rules</p>
            <p className="text-xs text-gray-400">Alliance members can join within 30 min of creation. All fleets must arrive simultaneously. If one fleet recalls, others may adjust timing.</p>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-white/5 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-1.5 text-xs rounded border border-white/10 text-gray-400 hover:bg-white/5 cursor-pointer whitespace-nowrap">Cancel</button>
          <button
            onClick={handleCreate}
            disabled={!target}
            className="px-5 py-1.5 text-xs rounded font-bold bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30 transition-all cursor-pointer disabled:opacity-40 whitespace-nowrap"
          ><i className="ri-group-line mr-1"></i>Create ACS</button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function ACSPage() {
  const [missions, setMissions] = useState<ACSMission[]>(MOCK_MISSIONS);
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleRecall = (missionId: string, fleetId: string) => {
    setMissions(prev => prev.map(m => m.id === missionId
      ? { ...m, fleets: m.fleets.map(f => f.id === fleetId ? { ...f, status: 'recalled' as const } : f) }
      : m
    ));
    showToast('Your fleet has been recalled from the ACS mission.');
  };

  const handleJoin = () => {
    showToast('Fleet dispatch window opened — select ships to join ACS mission.');
  };

  const handleCreate = () => {
    showToast('ACS mission created! Alliance members have been notified.');
  };

  const totalMissions = missions.length;
  const totalFleets = missions.reduce((a, m) => a + m.fleets.length, 0);
  const totalShips = missions.reduce((a, m) => a + m.fleets.reduce((b, f) => b + f.ships, 0), 0);

  return (
    <div className="text-white px-6 py-5">
      {showCreate && <CreateACSModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-lg text-sm font-medium text-white"
          style={{ background: '#0d1526', border: '1px solid rgba(251,191,36,0.4)' }}>
          <i className="ri-check-line text-green-400 mr-2"></i>{toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-amber-400">Alliance Combat System</h1>
          <p className="text-xs text-gray-400 mt-1">Coordinate combined fleet attacks and defenses with alliance members</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30 transition-all cursor-pointer whitespace-nowrap text-sm font-semibold"
        >
          <i className="ri-add-line"></i>Create ACS Mission
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Active Missions', val: totalMissions, icon: 'ri-compass-3-line', color: '#fbbf24' },
          { label: 'Combined Fleets', val: totalFleets, icon: 'ri-group-line', color: '#60a5fa' },
          { label: 'Total Ships',     val: totalShips.toLocaleString(), icon: 'ri-rocket-2-line', color: '#f87171' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 flex items-center gap-3" style={{ background: `${s.color}0a`, border: `1px solid ${s.color}20` }}>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ background: `${s.color}15` }}>
              <i className={`${s.icon} text-lg`} style={{ color: s.color }}></i>
            </div>
            <div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-xl font-black" style={{ color: s.color }}>{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mission list */}
      <div className="space-y-4">
        {missions.map(mission => {
          const totalMissionShips = mission.fleets.reduce((a, f) => a + f.ships, 0);
          const confirmedFleets = mission.fleets.filter(f => f.status === 'confirmed').length;
          const missionColor = mission.missionType === 'attack' ? '#f87171' : '#60a5fa';

          return (
            <div key={mission.id} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${missionColor}25` }}>
              {/* Mission header */}
              <div className="flex items-center justify-between px-5 py-3" style={{ background: `${missionColor}08` }}>
                <div className="flex items-center gap-3">
                  <i className={`${mission.missionType === 'attack' ? 'ri-sword-fill' : 'ri-shield-fill'} text-lg`} style={{ color: missionColor }}></i>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: missionColor }}>
                        {mission.missionType === 'attack' ? 'ACS Attack' : 'ACS Defend'} → {mission.target}
                      </span>
                      <MissionStatusBadge status={mission.status} />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Target: {mission.targetPlayer} {mission.targetAlliance} · Initiated by {mission.initiator}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Arrival</p>
                  <p className="text-sm font-bold text-white">{mission.arrivalTime}</p>
                </div>
              </div>

              {/* Progress bar (if traveling) */}
              {mission.status === 'traveling' && (
                <div className="px-5 py-2" style={{ background: `${missionColor}05` }}>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Fleet progress</span>
                    <span style={{ color: missionColor }}>{mission.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div className="h-1.5 rounded-full" style={{ width: `${mission.progress}%`, background: `linear-gradient(90deg, ${missionColor}80, ${missionColor})` }}></div>
                  </div>
                </div>
              )}

              {/* Fleet breakdown */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Participating Fleets ({confirmedFleets}/{mission.fleets.length} confirmed)
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <i className="ri-rocket-line text-gray-500"></i>
                    <span>{totalMissionShips.toLocaleString()} total ships</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {mission.fleets.map(fleet => (
                    <div key={fleet.id} className="flex items-center gap-3 rounded-lg px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">{fleet.owner}</span>
                          <span className="text-xs text-purple-400">{fleet.alliance}</span>
                          <FleetStatusBadge status={fleet.status} />
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-400">From {fleet.origin}</span>
                          <span className="text-xs text-cyan-400">{fleet.ships.toLocaleString()} ships</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          {fleet.shipTypes.map(st => (
                            <span key={st.type} className="text-xs text-gray-500">{st.count}x {st.type}</span>
                          ))}
                        </div>
                      </div>
                      {fleet.owner.includes('You') && fleet.status !== 'recalled' && (
                        <button
                          onClick={() => handleRecall(mission.id, fleet.id)}
                          className="text-xs px-3 py-1 rounded border border-red-400/25 text-red-400 hover:bg-red-400/10 cursor-pointer transition-all whitespace-nowrap flex-shrink-0"
                        >Recall</button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Join button for forming missions */}
                {mission.status === 'forming' && (
                  <button
                    onClick={() => handleJoin()}
                    className="mt-3 w-full py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                    style={{ background: `${missionColor}12`, color: missionColor, border: `1px solid ${missionColor}30` }}
                  ><i className="ri-add-circle-line mr-1"></i>Join This Mission</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {missions.length === 0 && (
        <div className="rounded-xl p-12 text-center" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <i className="ri-group-line text-4xl text-gray-600 block mb-2"></i>
          <p className="text-gray-400 text-sm">No active ACS missions</p>
          <button onClick={() => setShowCreate(true)} className="mt-3 text-xs text-amber-400 hover:underline cursor-pointer">Create one now</button>
        </div>
      )}
    </div>
  );
}
