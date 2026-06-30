import { useState } from 'react';

/* ── Types ─────────────────────────────────────────────────────────────── */
type WarStatus = 'active' | 'pending' | 'ended';
type BattleResult = 'victory' | 'defeat' | 'draw';

interface War {
  id: string;
  name: string;
  attacker: string;
  attackerTag: string;
  defender: string;
  defenderTag: string;
  status: WarStatus;
  startDate: string;
  endDate?: string;
  daysLeft?: number;
  attackerScore: number;
  defenderScore: number;
  participants: number;
  battles: number;
  battleHistory: BattleReport[];
  warBonuses: string[];
}

interface BattleReport {
  id: string;
  attacker: string;
  defender: string;
  result: BattleResult;
  loot: { metal: number; crystal: number; deuterium: number };
  attackerShipsLost: number;
  defenderShipsLost: number;
  time: string;
  coordinates: string;
  scoreGained: number;
}

interface DeclareWarForm {
  targetAlliance: string;
  targetTag: string;
  reason: string;
  warType: 'offensive' | 'defensive' | 'economic';
}

/* ── Mock Data ─────────────────────────────────────────────────────────── */
const MOCK_WARS: War[] = [
  {
    id: 'w1',
    name: 'Battle for Sector 7',
    attacker: 'Dark Empire Alliance',
    attackerTag: '[DARK]',
    defender: 'Federation Forces',
    defenderTag: '[FED]',
    status: 'active',
    startDate: '2026-05-10',
    daysLeft: 5,
    attackerScore: 15420,
    defenderScore: 12890,
    participants: 156,
    battles: 89,
    warBonuses: ['+20% Fleet Speed', '+15% Weapon Damage', 'War Contribution Points'],
    battleHistory: [
      { id: 'b1', attacker: 'Commander Nexus [DARK]', defender: 'Admiral Orion [FED]', result: 'victory', loot: { metal: 450000, crystal: 220000, deuterium: 85000 }, attackerShipsLost: 12, defenderShipsLost: 287, time: '8 min ago', coordinates: '[3:421:7]', scoreGained: 340 },
      { id: 'b2', attacker: 'General Vortex [FED]', defender: 'Commander Nexus [DARK]', result: 'defeat', loot: { metal: 0, crystal: 0, deuterium: 0 }, attackerShipsLost: 95, defenderShipsLost: 3, time: '1h ago', coordinates: '[1:234:8]', scoreGained: -45 },
      { id: 'b3', attacker: 'Lord Quantum [DARK]', defender: 'Captain Storm [FED]', result: 'victory', loot: { metal: 780000, crystal: 390000, deuterium: 120000 }, attackerShipsLost: 28, defenderShipsLost: 412, time: '2h ago', coordinates: '[4:156:3]', scoreGained: 520 },
      { id: 'b4', attacker: 'Admiral Stellar [FED]', defender: 'General Nova [DARK]', result: 'victory', loot: { metal: 280000, crystal: 145000, deuterium: 60000 }, attackerShipsLost: 44, defenderShipsLost: 156, time: '4h ago', coordinates: '[2:87:11]', scoreGained: 210 },
    ],
  },
  {
    id: 'w2',
    name: 'Nebula Conflict',
    attacker: 'Void Raiders',
    attackerTag: '[VOID]',
    defender: 'Star Guardians',
    defenderTag: '[STAR]',
    status: 'active',
    startDate: '2026-05-14',
    daysLeft: 9,
    attackerScore: 8750,
    defenderScore: 9200,
    participants: 98,
    battles: 45,
    warBonuses: ['+10% Defense Power', 'Territory Bonuses'],
    battleHistory: [],
  },
  {
    id: 'w3',
    name: 'Resource Wars',
    attacker: 'Mining Consortium',
    attackerTag: '[MINE]',
    defender: 'Trade Federation',
    defenderTag: '[TF]',
    status: 'pending',
    startDate: '2026-05-21',
    attackerScore: 0,
    defenderScore: 0,
    participants: 67,
    battles: 0,
    warBonuses: ['+25% Resource Plunder'],
    battleHistory: [],
  },
  {
    id: 'w4',
    name: 'Great Solar War',
    attacker: 'Stellar Empire',
    attackerTag: '[SE]',
    defender: 'Void Collective',
    defenderTag: '[VC]',
    status: 'ended',
    startDate: '2026-04-01',
    endDate: '2026-04-21',
    attackerScore: 42100,
    defenderScore: 38600,
    participants: 280,
    battles: 312,
    warBonuses: [],
    battleHistory: [],
  },
];

/* ── Sub-components ────────────────────────────────────────────────────── */
function WarScoreBar({ attackerScore, defenderScore, attacker, defender }: {
  attackerScore: number; defenderScore: number; attacker: string; defender: string;
}) {
  const total = attackerScore + defenderScore || 1;
  const attackerPct = (attackerScore / total) * 100;
  const attackerWinning = attackerScore >= defenderScore;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="font-bold" style={{ color: '#f87171' }}>{attacker.split(' ')[0]}: {attackerScore.toLocaleString()}</span>
        <span className="font-bold" style={{ color: '#60a5fa' }}>{defender.split(' ')[0]}: {defenderScore.toLocaleString()}</span>
      </div>
      <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'rgba(96,165,250,0.25)' }}>
        <div className="h-3 rounded-full transition-all" style={{ width: `${attackerPct}%`, background: 'linear-gradient(90deg,#f87171,#fb923c)' }}></div>
      </div>
      <div className="flex justify-between text-xs mt-1" style={{ color: '#6b7a95' }}>
        <span>{attackerPct.toFixed(0)}%</span>
        <span className={`font-semibold ${attackerWinning ? 'text-red-400' : 'text-sky-400'}`}>
          {Math.abs(attackerScore - defenderScore).toLocaleString()} pts ahead
        </span>
        <span>{(100 - attackerPct).toFixed(0)}%</span>
      </div>
    </div>
  );
}

function BattleReportRow({ report }: { report: BattleReport }) {
  const [expanded, setExpanded] = useState(false);
  const isVictory = report.result === 'victory';
  const color = isVictory ? '#4ade80' : report.result === 'defeat' ? '#f87171' : '#fbbf24';
  const totalLoot = report.loot.metal + report.loot.crystal + report.loot.deuterium;

  return (
    <div className="rounded-xl overflow-hidden cursor-pointer" style={{ border: `1px solid ${color}25`, background: 'rgba(255,255,255,0.02)' }} onClick={() => setExpanded(!expanded)}>
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${color}15` }}>
          <i className={`${isVictory ? 'ri-trophy-line' : report.result === 'defeat' ? 'ri-close-circle-line' : 'ri-scales-line'} text-sm`} style={{ color }}></i>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">{report.attacker} <span className="text-gray-500">vs</span> {report.defender}</p>
          <p className="text-xs" style={{ color: '#6b7a95' }}>{report.coordinates} · {report.time}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs font-bold" style={{ color }}>{report.result.toUpperCase()}</p>
          {totalLoot > 0 && <p className="text-xs" style={{ color: '#fbbf24' }}>+{(totalLoot / 1000).toFixed(0)}K res</p>}
        </div>
        <div className="text-right flex-shrink-0 ml-2">
          <p className="text-xs font-bold" style={{ color: report.scoreGained >= 0 ? '#4ade80' : '#f87171' }}>
            {report.scoreGained >= 0 ? '+' : ''}{report.scoreGained} pts
          </p>
        </div>
        <i className={expanded ? 'ri-arrow-up-s-line text-gray-500 text-sm' : 'ri-arrow-down-s-line text-gray-500 text-sm'}></i>
      </div>
      {expanded && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: `${color}15` }}>
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-xs" style={{ color: '#6b7a95' }}>Ships Lost (Attacker)</p>
              <p className="text-sm font-bold text-red-400">{report.attackerShipsLost.toLocaleString()}</p>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-xs" style={{ color: '#6b7a95' }}>Ships Lost (Defender)</p>
              <p className="text-sm font-bold text-orange-400">{report.defenderShipsLost.toLocaleString()}</p>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-xs" style={{ color: '#6b7a95' }}>Total Loot</p>
              <p className="text-sm font-bold text-yellow-400">{totalLoot.toLocaleString()}</p>
            </div>
          </div>
          {totalLoot > 0 && (
            <div className="flex gap-3 mt-2 text-xs">
              <span style={{ color: '#fcd34d' }}>Metal: {report.loot.metal.toLocaleString()}</span>
              <span style={{ color: '#60a5fa' }}>Crystal: {report.loot.crystal.toLocaleString()}</span>
              <span style={{ color: '#4ade80' }}>Deut: {report.loot.deuterium.toLocaleString()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DeclareWarModal({ onClose, onDeclare }: { onClose: () => void; onDeclare: (form: DeclareWarForm) => void }) {
  const [form, setForm] = useState<DeclareWarForm>({ targetAlliance: '', targetTag: '', reason: '', warType: 'offensive' });
  const isValid = form.targetAlliance.trim().length > 0 && form.reason.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl overflow-hidden" style={{ background: '#0a0f1e', border: '1px solid rgba(248,113,113,0.4)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid rgba(248,113,113,0.15)', background: 'rgba(248,113,113,0.05)' }}>
          <div className="flex items-center gap-2">
            <i className="ri-sword-fill text-red-400 text-lg"></i>
            <h2 className="text-sm font-bold text-red-400">Declare War</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer">
            <i className="ri-close-line text-sm"></i>
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {(['offensive', 'defensive', 'economic'] as const).map(t => (
              <button
                key={t}
                onClick={() => setForm(f => ({ ...f, warType: t }))}
                className="py-2 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-all whitespace-nowrap"
                style={form.warType === t
                  ? { background: 'rgba(248,113,113,0.2)', color: '#f87171', border: '1px solid rgba(248,113,113,0.4)' }
                  : { background: 'rgba(255,255,255,0.04)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)' }}
              >{t}</button>
            ))}
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Target Alliance Name</label>
            <input
              value={form.targetAlliance}
              onChange={e => setForm(f => ({ ...f, targetAlliance: e.target.value }))}
              placeholder="e.g. Stellar Empire"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-400/50"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Alliance Tag (optional)</label>
            <input
              value={form.targetTag}
              onChange={e => setForm(f => ({ ...f, targetTag: e.target.value }))}
              placeholder="e.g. [SE]"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-400/50"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Declaration of War (Reason)</label>
            <textarea
              value={form.reason}
              onChange={e => setForm(f => ({ ...f, reason: e.target.value.slice(0, 500) }))}
              placeholder="State your reasons for declaring war..."
              rows={3}
              maxLength={500}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white resize-none focus:outline-none focus:border-red-400/50"
            />
            <p className="text-xs text-gray-600 text-right">{form.reason.length}/500</p>
          </div>
          <div className="rounded-lg p-3 text-xs space-y-1" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
            <p className="font-semibold text-red-400">War Declaration Rules</p>
            <p className="text-gray-400">· War lasts 14 days by default, extendable if active combat continues</p>
            <p className="text-gray-400">· All alliance members notified immediately</p>
            <p className="text-gray-400">· War bonuses activate for both sides at start time</p>
            <p className="text-gray-400">· Side with higher score at end wins and earns war rewards</p>
          </div>
        </div>
        <div className="px-5 py-3.5 flex gap-2 justify-end" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={onClose} className="px-4 py-1.5 text-xs rounded border border-white/10 text-gray-400 hover:bg-white/5 cursor-pointer whitespace-nowrap">Cancel</button>
          <button
            onClick={() => { if (isValid) { onDeclare(form); onClose(); } }}
            disabled={!isValid}
            className="px-5 py-1.5 text-xs rounded font-bold cursor-pointer transition-all whitespace-nowrap disabled:opacity-40"
            style={{ background: 'rgba(248,113,113,0.2)', color: '#f87171', border: '1px solid rgba(248,113,113,0.4)' }}
          >
            <i className="ri-sword-fill mr-1"></i>Declare War
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────────────── */
export default function WarRoomPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'stats'>('active');
  const [selectedWar, setSelectedWar] = useState<War | null>(MOCK_WARS[0]);
  const [showDeclare, setShowDeclare] = useState(false);
  const [wars, setWars] = useState<War[]>(MOCK_WARS);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleDeclareWar = (form: DeclareWarForm) => {
    const newWar: War = {
      id: `w${Date.now()}`,
      name: `War against ${form.targetAlliance}`,
      attacker: 'Your Alliance',
      attackerTag: '[YOU]',
      defender: form.targetAlliance,
      defenderTag: form.targetTag || '[?]',
      status: 'pending',
      startDate: new Date().toISOString().split('T')[0],
      attackerScore: 0,
      defenderScore: 0,
      participants: 1,
      battles: 0,
      warBonuses: ['+15% Fleet Speed', 'War Contribution Points'],
      battleHistory: [],
    };
    setWars(prev => [newWar, ...prev]);
    showToast(`War declared on ${form.targetAlliance}! All members have been notified.`);
  };

  const activeWars = wars.filter(w => w.status === 'active' || w.status === 'pending');
  const endedWars = wars.filter(w => w.status === 'ended');

  const totalStats = {
    totalBattles: wars.reduce((a, w) => a + w.battles, 0),
    victories: 47,
    defeats: 21,
    totalParticipants: wars.reduce((a, w) => a + w.participants, 0),
  };

  return (
    <div className="text-white px-6 py-5">
      {showDeclare && <DeclareWarModal onClose={() => setShowDeclare(false)} onDeclare={handleDeclareWar} />}

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-lg text-sm font-medium text-white" style={{ background: '#0d1526', border: '1px solid rgba(248,113,113,0.4)' }}>
          <i className="ri-sword-fill text-red-400 mr-2"></i>{toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-red-400">War Room</h1>
          <p className="text-xs text-gray-400 mt-1">Coordinate alliance wars, track battles, and plan strategic operations</p>
        </div>
        <button
          onClick={() => setShowDeclare(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all whitespace-nowrap text-sm font-bold"
          style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.35)', color: '#f87171' }}
        >
          <i className="ri-sword-fill"></i>Declare War
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Active Wars', val: activeWars.filter(w=>w.status==='active').length, icon: 'ri-fire-line', color: '#f87171' },
          { label: 'Total Battles', val: totalStats.totalBattles, icon: 'ri-sword-line', color: '#fb923c' },
          { label: 'Victories', val: totalStats.victories, icon: 'ri-trophy-line', color: '#4ade80' },
          { label: 'Defeats', val: totalStats.defeats, icon: 'ri-close-circle-line', color: '#f87171' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 flex items-center gap-3" style={{ background: `${s.color}0a`, border: `1px solid ${s.color}20` }}>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${s.color}15` }}>
              <i className={`${s.icon} text-lg`} style={{ color: s.color }}></i>
            </div>
            <div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-xl font-black" style={{ color: s.color }}>{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-white/5 rounded-lg p-1 w-fit">
        {([['active', 'Active Wars'], ['history', 'War History'], ['stats', 'War Stats']] as const).map(([id, label]) => (
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

      {/* Active Wars tab */}
      {activeTab === 'active' && (
        <div className="grid grid-cols-3 gap-5">
          {/* War list */}
          <div className="space-y-3">
            {activeWars.map(war => {
              const isSelected = selectedWar?.id === war.id;
              const statusColor = war.status === 'active' ? '#f87171' : '#fbbf24';
              const attackerWinning = war.attackerScore >= war.defenderScore;

              return (
                <div
                  key={war.id}
                  onClick={() => setSelectedWar(war)}
                  className="rounded-xl p-4 cursor-pointer transition-all"
                  style={{
                    background: isSelected ? 'rgba(248,113,113,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isSelected ? 'rgba(248,113,113,0.35)' : 'rgba(255,255,255,0.07)'}`,
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-bold text-white">{war.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium ml-2 flex-shrink-0" style={{ background: `${statusColor}12`, color: statusColor, border: `1px solid ${statusColor}25` }}>
                      {war.status}
                    </span>
                  </div>
                  <p className="text-xs mb-2" style={{ color: '#6b7a95' }}>
                    {war.attackerTag} vs {war.defenderTag} · {war.battles} battles
                  </p>
                  {war.battles > 0 && (
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-1.5 rounded-full" style={{
                        width: `${(war.attackerScore / (war.attackerScore + war.defenderScore)) * 100}%`,
                        background: attackerWinning ? '#f87171' : '#60a5fa'
                      }}></div>
                    </div>
                  )}
                  {war.daysLeft !== undefined && (
                    <p className="text-xs mt-1.5" style={{ color: war.daysLeft <= 2 ? '#f87171' : '#6b7a95' }}>
                      <i className="ri-time-line mr-1"></i>{war.daysLeft} days remaining
                    </p>
                  )}
                </div>
              );
            })}
            {activeWars.length === 0 && (
              <div className="rounded-xl p-8 text-center" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <i className="ri-global-line text-3xl text-gray-600 block mb-2"></i>
                <p className="text-gray-400 text-sm">No active wars</p>
              </div>
            )}
          </div>

          {/* War detail */}
          <div className="col-span-2">
            {selectedWar ? (
              <div className="rounded-xl overflow-hidden" style={{ background: '#0d1526', border: '1px solid rgba(248,113,113,0.2)' }}>
                {/* War header */}
                <div className="p-5" style={{ borderBottom: '1px solid rgba(248,113,113,0.12)', background: 'rgba(248,113,113,0.04)' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-white">{selectedWar.name}</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Started {selectedWar.startDate} · {selectedWar.participants} participants</p>
                    </div>
                    <div className="text-right">
                      {selectedWar.daysLeft !== undefined && (
                        <p className="text-sm font-bold" style={{ color: selectedWar.daysLeft <= 2 ? '#f87171' : '#fbbf24' }}>
                          {selectedWar.daysLeft} days left
                        </p>
                      )}
                      <p className="text-xs text-gray-500">{selectedWar.battles} total battles</p>
                    </div>
                  </div>

                  {/* Score */}
                  <WarScoreBar
                    attackerScore={selectedWar.attackerScore}
                    defenderScore={selectedWar.defenderScore}
                    attacker={selectedWar.attacker}
                    defender={selectedWar.defender}
                  />
                </div>

                {/* Factions */}
                <div className="grid grid-cols-2 gap-4 p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {[
                    { name: selectedWar.attacker, tag: selectedWar.attackerTag, score: selectedWar.attackerScore, side: 'Attacker', color: '#f87171', icon: 'ri-sword-fill' },
                    { name: selectedWar.defender, tag: selectedWar.defenderTag, score: selectedWar.defenderScore, side: 'Defender', color: '#60a5fa', icon: 'ri-shield-fill' },
                  ].map(faction => (
                    <div key={faction.side} className="rounded-lg p-3" style={{ background: `${faction.color}08`, border: `1px solid ${faction.color}20` }}>
                      <div className="flex items-center gap-2 mb-2">
                        <i className={`${faction.icon} text-sm`} style={{ color: faction.color }}></i>
                        <span className="text-xs font-semibold" style={{ color: faction.color }}>{faction.side}</span>
                      </div>
                      <p className="text-sm font-bold text-white">{faction.name}</p>
                      <p className="text-xs text-gray-400">{faction.tag}</p>
                      <p className="text-lg font-black mt-1" style={{ color: faction.color }}>{faction.score.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">combat score</p>
                    </div>
                  ))}
                </div>

                {/* War bonuses */}
                {selectedWar.warBonuses.length > 0 && (
                  <div className="px-4 py-3 flex items-center gap-2 flex-wrap" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="text-xs text-gray-500">War Bonuses:</span>
                    {selectedWar.warBonuses.map((b, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>
                        <i className="ri-flashlight-line mr-1"></i>{b}
                      </span>
                    ))}
                  </div>
                )}

                {/* Battle reports */}
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#f87171' }}>
                    <i className="ri-file-list-3-line mr-1"></i>Recent Battle Reports
                  </p>
                  {selectedWar.battleHistory.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 text-sm">
                      <i className="ri-time-line text-2xl block mb-1 text-gray-600"></i>
                      No battles recorded yet — war pending or just started
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedWar.battleHistory.map(r => <BattleReportRow key={r.id} report={r} />)}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                {selectedWar.status === 'active' && (
                  <div className="px-4 pb-4 flex gap-2">
                    <Link to="/fleet" className="flex-1 py-2 text-xs font-bold rounded-lg text-center cursor-pointer transition-all whitespace-nowrap" style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171' }}>
                      <i className="ri-rocket-2-line mr-1"></i>Launch Attack
                    </Link>
                    <Link to="/defense" className="flex-1 py-2 text-xs font-bold rounded-lg text-center cursor-pointer transition-all whitespace-nowrap" style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa' }}>
                      <i className="ri-shield-line mr-1"></i>Reinforce Defense
                    </Link>
                    <Link to="/alliance" className="flex-1 py-2 text-xs font-bold rounded-lg text-center cursor-pointer transition-all whitespace-nowrap" style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)', color: '#fbbf24' }}>
                      <i className="ri-group-line mr-1"></i>Coordinate Alliance
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl p-12 text-center" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <i className="ri-sword-line text-4xl text-gray-600 block mb-2"></i>
                <p className="text-gray-400">Select a war to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History tab */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {endedWars.length === 0 && (
            <div className="rounded-xl p-10 text-center" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <i className="ri-history-line text-3xl text-gray-600 block mb-2"></i>
              <p className="text-gray-400 text-sm">No past wars</p>
            </div>
          )}
          {endedWars.map(war => {
            const attackerWon = war.attackerScore > war.defenderScore;
            return (
              <div key={war.id} className="rounded-xl p-5" style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">{war.name}</h3>
                    <p className="text-xs text-gray-400">{war.startDate} → {war.endDate} · {war.battles} battles · {war.participants} participants</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: '#6b7a95' }}>ENDED</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className={`font-bold ${attackerWon ? 'text-green-400' : 'text-gray-400'}`}>{war.attacker} {war.attackerTag}: {war.attackerScore.toLocaleString()}</span>
                  <span className="text-gray-600">vs</span>
                  <span className={`font-bold ${!attackerWon ? 'text-green-400' : 'text-gray-400'}`}>{war.defender} {war.defenderTag}: {war.defenderScore.toLocaleString()}</span>
                  <span className="ml-auto text-xs" style={{ color: attackerWon ? '#4ade80' : '#f87171' }}>
                    {attackerWon ? war.attacker.split(' ')[0] : war.defender.split(' ')[0]} WON
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats tab */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-xl p-5" style={{ background: '#0d1526', border: '1px solid rgba(248,113,113,0.2)' }}>
            <h3 className="text-sm font-bold text-red-400 mb-4">Combat Record</h3>
            <div className="space-y-3">
              {[
                { label: 'Total Wars', val: wars.length, color: '#00d4ff' },
                { label: 'Wars Won', val: 3, color: '#4ade80' },
                { label: 'Wars Lost', val: 1, color: '#f87171' },
                { label: 'Total Battles', val: totalStats.totalBattles, color: '#fbbf24' },
                { label: 'Battle Victories', val: totalStats.victories, color: '#4ade80' },
                { label: 'Battle Defeats', val: totalStats.defeats, color: '#f87171' },
                { label: 'Win Rate', val: `${Math.round((totalStats.victories / (totalStats.victories + totalStats.defeats)) * 100)}%`, color: '#a78bfa' },
              ].map(s => (
                <div key={s.label} className="flex justify-between items-center py-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span className="text-xs text-gray-400">{s.label}</span>
                  <span className="text-sm font-bold" style={{ color: s.color }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-5" style={{ background: '#0d1526', border: '1px solid rgba(251,191,36,0.2)' }}>
            <h3 className="text-sm font-bold text-amber-400 mb-4">Resources Plundered (War Totals)</h3>
            <div className="space-y-4">
              {[
                { label: 'Metal', val: '12.4B', pct: 78, color: '#fcd34d' },
                { label: 'Crystal', val: '6.2B', pct: 56, color: '#60a5fa' },
                { label: 'Deuterium', val: '2.1B', pct: 34, color: '#4ade80' },
                { label: 'Dark Matter', val: '48,500', pct: 22, color: '#c084fc' },
              ].map(r => (
                <div key={r.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: r.color }}>{r.label}</span>
                    <span className="text-white font-bold">{r.val}</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-2 rounded-full transition-all" style={{ width: `${r.pct}%`, background: r.color }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs text-gray-500">Total Score Points Earned in Wars</p>
              <p className="text-2xl font-black text-amber-400 mt-1">284,750</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}