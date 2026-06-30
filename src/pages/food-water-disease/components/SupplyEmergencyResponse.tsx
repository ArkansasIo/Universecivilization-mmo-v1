import { useState, useEffect, useRef, useCallback } from 'react';
import { COLONY_HEALTH_DATA, DISEASES, type ColonyHealth } from '@/data/foodWaterDisease';

// ─── Types ────────────────────────────────────────────────────────────────────

type ResourceType = 'food' | 'water';

type DispatchStatus = 'queued' | 'launching' | 'in_transit' | 'arriving' | 'delivered' | 'failed';

interface DispatchMission {
  id: string;
  fromId: string;
  toId: string;
  resource: ResourceType;
  amount: number;
  travelDurationMs: number;
  launchedAt: number;
  status: DispatchStatus;
  autoTriggered: boolean;
  note: string;
}

interface AutoRule {
  id: string;
  colonyId: string;
  resource: ResourceType;
  threshold: number;   // surplus below this triggers auto-dispatch
  sourceColonyId: string;
  amount: number;
  enabled: boolean;
  cooldownMs: number;
  lastTriggeredAt: number | null;
}

interface EventLogEntry {
  id: string;
  timestamp: number;
  type: 'auto_triggered' | 'manual_dispatch' | 'delivered' | 'failed' | 'rule_added' | 'rule_toggled';
  message: string;
  icon: string;
  color: string;
  missionId?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TRANSIT_DURATION_MS = 12000; // 12s simulated travel

const RESOURCE_CFG: Record<ResourceType, { icon: string; color: string; label: string; unit: string }> = {
  food:  { icon: 'ri-restaurant-line',  color: '#4ade80', label: 'Food',  unit: 'units' },
  water: { icon: 'ri-drop-line',        color: '#38bdf8', label: 'Water', unit: 'units' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function colonySurplus(c: ColonyHealth, r: ResourceType) {
  return r === 'food' ? c.foodSurplus : c.waterSurplus;
}

function crisisLevel(surplus: number): 'ok' | 'warning' | 'critical' {
  if (surplus >= 0) return 'ok';
  if (surplus >= -200) return 'warning';
  return 'critical';
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Status pill ──────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: DispatchStatus }) {
  const cfg: Record<DispatchStatus, { label: string; color: string; bg: string; pulse: boolean }> = {
    queued:     { label: 'QUEUED',      color: '#6b7280', bg: 'rgba(107,114,128,0.15)', pulse: false },
    launching:  { label: 'LAUNCHING',   color: '#fbbf24', bg: 'rgba(251,191,36,0.15)',  pulse: true  },
    in_transit: { label: 'IN TRANSIT',  color: '#38bdf8', bg: 'rgba(56,189,248,0.15)',  pulse: false },
    arriving:   { label: 'ARRIVING',    color: '#a78bfa', bg: 'rgba(167,139,250,0.15)', pulse: true  },
    delivered:  { label: 'DELIVERED',   color: '#4ade80', bg: 'rgba(74,222,128,0.15)',  pulse: false },
    failed:     { label: 'FAILED',      color: '#f43f5e', bg: 'rgba(244,63,94,0.15)',   pulse: false },
  };
  const c = cfg[status];
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-black whitespace-nowrap ${c.pulse ? 'animate-pulse' : ''}`}
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}40` }}
    >
      {c.label}
    </span>
  );
}

// ─── Progress transit bar ─────────────────────────────────────────────────────

function TransitBar({ mission, now }: { mission: DispatchMission; now: number }) {
  const elapsed = now - mission.launchedAt;
  const pct = Math.min(100, (elapsed / mission.travelDurationMs) * 100);
  const secsLeft = Math.max(0, Math.ceil((mission.travelDurationMs - elapsed) / 1000));

  if (mission.status === 'delivered' || mission.status === 'failed') {
    return (
      <div className="h-1.5 w-full rounded-full" style={{ background: mission.status === 'delivered' ? 'rgba(74,222,128,0.3)' : 'rgba(244,63,94,0.3)' }} />
    );
  }

  const fromColony = COLONY_HEALTH_DATA.find(c => c.colonyId === mission.fromId);
  const toColony = COLONY_HEALTH_DATA.find(c => c.colonyId === mission.toId);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500 truncate max-w-[100px]">{fromColony?.colonyName.split(' ')[0]}</span>
        <span className="text-gray-400 font-bold">{secsLeft}s</span>
        <span className="text-gray-500 truncate max-w-[100px] text-right">{toColony?.colonyName.split(' ')[0]}</span>
      </div>
      <div className="relative w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-2 rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #38bdf8, #4ade80)' }}
        />
        {/* Ship icon */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full flex items-center justify-center"
          style={{ left: `${pct}%`, background: '#fff', zIndex: 2 }}
        >
          <i className="ri-rocket-2-fill text-xs" style={{ color: '#0a1020', fontSize: 7 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Crisis Colony Card ───────────────────────────────────────────────────────

function CrisisColonyCard({
  colony,
  resource,
  activeMissions,
  onDispatch,
}: {
  colony: ColonyHealth;
  resource: ResourceType;
  activeMissions: DispatchMission[];
  onDispatch: (to: ColonyHealth, resource: ResourceType) => void;
}) {
  const surplus = colonySurplus(colony, resource);
  const level = crisisLevel(surplus);
  const cfg = RESOURCE_CFG[resource];
  const diseases = DISEASES.filter(d => (colony.diseases ?? []).includes(d.id));

  const inTransit = activeMissions.filter(
    m => m.toId === colony.colonyId && m.resource === resource && m.status !== 'delivered' && m.status !== 'failed'
  );

  const borderColor = level === 'critical' ? '#f43f5e' : level === 'warning' ? '#fbbf24' : '#4ade80';
  const bgColor = level === 'critical' ? 'rgba(244,63,94,0.06)' : level === 'warning' ? 'rgba(251,191,36,0.05)' : 'rgba(74,222,128,0.04)';

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: bgColor, border: `1.5px solid ${borderColor}40` }}
    >
      {/* Image */}
      <div className="relative h-24 overflow-hidden">
        <img src={colony.image} alt={colony.colonyName} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(5,10,20,0.9))' }} />
        {level === 'critical' && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-black animate-pulse"
            style={{ background: 'rgba(244,63,94,0.3)', border: '1px solid rgba(244,63,94,0.7)', color: '#f43f5e' }}>
            <i className="ri-alarm-warning-line" />CRITICAL
          </div>
        )}
        {level === 'warning' && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-bold"
            style={{ background: 'rgba(251,191,36,0.25)', border: '1px solid rgba(251,191,36,0.6)', color: '#fbbf24' }}>
            <i className="ri-alert-line" />DEFICIT
          </div>
        )}
        <div className="absolute bottom-2 left-2">
          <p className="text-xs font-black text-white">{colony.colonyName}</p>
          <p className="text-xs text-gray-400">{colony.type} · Pop {(colony.population / 1000).toFixed(0)}k</p>
        </div>
        {inTransit.length > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-bold"
            style={{ background: 'rgba(56,189,248,0.2)', border: '1px solid rgba(56,189,248,0.5)', color: '#38bdf8' }}>
            <i className="ri-rocket-2-line" />{inTransit.length} en route
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3 space-y-2.5">
        {/* Surplus stat */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 flex items-center gap-1.5">
            <i className={`${cfg.icon} text-xs`} style={{ color: cfg.color }} />{cfg.label} / hr
          </span>
          <span className="text-sm font-black" style={{ color: level === 'ok' ? cfg.color : level === 'warning' ? '#fbbf24' : '#f43f5e' }}>
            {surplus >= 0 ? '+' : ''}{surplus}
          </span>
        </div>

        {/* Deficit bar */}
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-1.5 rounded-full" style={{
            width: `${Math.min(100, Math.max(4, surplus < 0 ? Math.abs(surplus) / 10 : surplus / 15))}%`,
            background: level === 'ok' ? cfg.color : level === 'warning' ? '#fbbf24' : '#f43f5e',
          }} />
        </div>

        {/* Disease tags */}
        {diseases.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {diseases.slice(0, 2).map(d => (
              <span key={d.id} className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${d.color}15`, color: d.color, fontSize: 9 }}>
                <i className={`${d.icon} mr-0.5`} />{d.name}
              </span>
            ))}
          </div>
        )}

        {/* In-transit missions */}
        {inTransit.length > 0 && (
          <div className="space-y-1.5">
            {inTransit.slice(0, 2).map(m => (
              <div key={m.id} className="rounded-lg px-2 py-1.5" style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.2)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">+{m.amount.toLocaleString()} {cfg.label}</span>
                  <StatusPill status={m.status} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dispatch button */}
        {level !== 'ok' && (
          <button
            onClick={() => onDispatch(colony, resource)}
            className="w-full py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all hover:scale-[1.02] whitespace-nowrap"
            style={{
              background: level === 'critical' ? 'rgba(244,63,94,0.15)' : 'rgba(251,191,36,0.12)',
              border: `1px solid ${level === 'critical' ? 'rgba(244,63,94,0.5)' : 'rgba(251,191,36,0.4)'}`,
              color: level === 'critical' ? '#f43f5e' : '#fbbf24',
            }}
          >
            <i className="ri-send-plane-line mr-1.5" />Dispatch {cfg.label} Relief
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Dispatch Builder Modal ───────────────────────────────────────────────────

function DispatchModal({
  target,
  resource: initialResource,
  onConfirm,
  onClose,
}: {
  target: ColonyHealth;
  resource: ResourceType;
  onConfirm: (from: ColonyHealth, to: ColonyHealth, resource: ResourceType, amount: number, note: string) => void;
  onClose: () => void;
}) {
  const [resource, setResource] = useState<ResourceType>(initialResource);
  const [fromId, setFromId] = useState<string>('');
  const [amount, setAmount] = useState(500);
  const [note, setNote] = useState('');
  const [launching, setLaunching] = useState(false);

  const surplusCols = COLONY_HEALTH_DATA.filter(c => {
    if (c.colonyId === target.colonyId) return false;
    return colonySurplus(c, resource) > 100;
  });

  const cfg = RESOURCE_CFG[resource];

  const selectedFrom = COLONY_HEALTH_DATA.find(c => c.colonyId === fromId);
  const availableSurplus = selectedFrom ? colonySurplus(selectedFrom, resource) : 0;

  const handleConfirm = () => {
    if (!selectedFrom) return;
    setLaunching(true);
    setTimeout(() => {
      onConfirm(selectedFrom, target, resource, amount, note);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="rounded-2xl w-full max-w-lg"
        style={{ background: '#080f1e', border: '2px solid rgba(56,189,248,0.4)' }}
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.4)' }}>
              <i className="ri-send-plane-fill text-lg" style={{ color: '#38bdf8' }} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Emergency Supply Dispatch</h3>
              <p className="text-xs text-gray-400">Route relief to → <strong className="text-white">{target.colonyName}</strong></p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10" style={{ color: '#6b7280' }}>
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Resource toggle */}
          <div>
            <p className="text-xs font-bold text-gray-400 mb-2">Resource Type</p>
            <div className="flex gap-2">
              {(['food', 'water'] as ResourceType[]).map(r => {
                const rc = RESOURCE_CFG[r];
                return (
                  <button
                    key={r}
                    onClick={() => { setResource(r); setFromId(''); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold cursor-pointer transition-all"
                    style={{
                      background: resource === r ? `${rc.color}18` : 'rgba(255,255,255,0.04)',
                      border: `2px solid ${resource === r ? rc.color : 'rgba(255,255,255,0.08)'}`,
                      color: resource === r ? rc.color : '#6b7280',
                    }}
                  >
                    <i className={rc.icon} />{rc.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Destination */}
          <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.3)' }}>
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img src={target.image} alt={target.colonyName} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-black text-white">{target.colonyName}</p>
              <p className="text-xs text-gray-400">{target.type} · {target.coordinates}</p>
              <p className="text-xs font-bold mt-0.5" style={{ color: '#f43f5e' }}>
                {cfg.label} {resource === 'food' ? target.foodSurplus : target.waterSurplus}/hr deficit
              </p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-gray-500">Destination</p>
              <i className="ri-map-pin-line text-red-400" />
            </div>
          </div>

          {/* Source colony selector */}
          <div>
            <p className="text-xs font-bold text-gray-400 mb-2">Source Colony <span className="text-gray-600 font-normal">(must have surplus)</span></p>
            {surplusCols.length === 0 ? (
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
                <i className="ri-error-warning-line text-red-400 text-xl mb-1 block" />
                <p className="text-xs text-gray-400">No colonies with sufficient {cfg.label} surplus available for dispatch</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {surplusCols.map(c => {
                  const s = colonySurplus(c, resource);
                  const sel = fromId === c.colonyId;
                  return (
                    <button
                      key={c.colonyId}
                      onClick={() => setFromId(c.colonyId)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 cursor-pointer transition-all text-left"
                      style={{
                        background: sel ? `${cfg.color}12` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${sel ? cfg.color : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={c.image} alt={c.colonyName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{c.colonyName}</p>
                        <p className="text-xs text-gray-500">{c.type} · {c.coordinates}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-black" style={{ color: cfg.color }}>+{s}/hr</p>
                        <p className="text-xs text-gray-500">surplus</p>
                      </div>
                      {sel && (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: cfg.color }}>
                          <i className="ri-check-line text-xs text-black" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Amount slider */}
          {fromId && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-bold text-gray-400">Dispatch Amount</p>
                <span className="text-sm font-black" style={{ color: cfg.color }}>{amount.toLocaleString()} {cfg.unit}</span>
              </div>
              <input
                type="range"
                min={100}
                max={Math.max(100, availableSurplus * 8)}
                step={100}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full cursor-pointer"
                style={{ accentColor: cfg.color }}
              />
              <div className="flex justify-between text-xs text-gray-600 mt-0.5">
                <span>100</span>
                <span className="text-gray-400">Source surplus: +{availableSurplus}/hr</span>
                <span>{(availableSurplus * 8).toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Note */}
          <div>
            <p className="text-xs font-bold text-gray-400 mb-2">Mission Note <span className="text-gray-600 font-normal">(optional)</span></p>
            <input
              type="text"
              placeholder="e.g. Pandemic relief package, Priority cargo run..."
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs text-white outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
              maxLength={80}
            />
          </div>

          {/* Route preview */}
          {selectedFrom && (
            <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-center flex-shrink-0">
                <div className="w-8 h-8 rounded-lg overflow-hidden mx-auto mb-1">
                  <img src={selectedFrom.image} alt={selectedFrom.colonyName} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-gray-400 truncate max-w-[60px]">{selectedFrom.colonyName.split(' ')[0]}</p>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1">
                  <i className={`${cfg.icon} text-sm`} style={{ color: cfg.color }} />
                  <span className="text-sm font-black" style={{ color: cfg.color }}>{amount.toLocaleString()} {cfg.label}</span>
                </div>
                <div className="w-full h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, ${cfg.color}60, ${cfg.color})` }} />
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <i className="ri-rocket-2-line" />~{TRANSIT_DURATION_MS / 1000}s transit
                </p>
              </div>
              <div className="text-center flex-shrink-0">
                <div className="w-8 h-8 rounded-lg overflow-hidden mx-auto mb-1">
                  <img src={target.image} alt={target.colonyName} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-gray-400 truncate max-w-[60px]">{target.colonyName.split(' ')[0]}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              disabled={!fromId || launching}
              className="flex-1 py-2.5 rounded-xl text-sm font-black cursor-pointer transition-all whitespace-nowrap"
              style={{
                background: fromId ? `${cfg.color}20` : 'rgba(255,255,255,0.04)',
                border: `2px solid ${fromId ? cfg.color : 'rgba(255,255,255,0.08)'}`,
                color: fromId ? cfg.color : '#374151',
              }}
            >
              {launching ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="ri-loader-4-line animate-spin" />Launching...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <i className="ri-send-plane-fill" />Launch Supply Run
                </span>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm text-gray-400 cursor-pointer whitespace-nowrap hover:bg-white/5 transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mission Card ─────────────────────────────────────────────────────────────

function MissionCard({ mission, now }: { mission: DispatchMission; now: number }) {
  const from = COLONY_HEALTH_DATA.find(c => c.colonyId === mission.fromId);
  const to = COLONY_HEALTH_DATA.find(c => c.colonyId === mission.toId);
  const cfg = RESOURCE_CFG[mission.resource];
  const isActive = mission.status !== 'delivered' && mission.status !== 'failed';

  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{
        background: mission.status === 'delivered' ? 'rgba(74,222,128,0.05)' : mission.status === 'failed' ? 'rgba(244,63,94,0.05)' : 'rgba(10,15,30,0.9)',
        border: `1px solid ${mission.status === 'delivered' ? 'rgba(74,222,128,0.25)' : mission.status === 'failed' ? 'rgba(244,63,94,0.25)' : 'rgba(255,255,255,0.08)'}`,
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <i className={`${cfg.icon} text-base flex-shrink-0`} style={{ color: cfg.color }} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-black text-white">{amount_fmt(mission.amount)} {cfg.label}</span>
              {mission.autoTriggered && (
                <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa', fontSize: 9 }}>
                  AUTO
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 truncate">
              {from?.colonyName} → {to?.colonyName}
            </p>
            {mission.note && <p className="text-xs text-gray-600 italic truncate">{mission.note}</p>}
          </div>
        </div>
        <StatusPill status={mission.status} />
      </div>

      {/* Transit bar */}
      {isActive && <TransitBar mission={mission} now={now} />}

      {/* Colony thumbnails */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
          <img src={from?.image} alt={from?.colonyName} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 h-px" style={{ background: `${cfg.color}40` }} />
        <i className="ri-rocket-2-fill text-xs flex-shrink-0" style={{ color: cfg.color }} />
        <div className="flex-1 h-px" style={{ background: `${cfg.color}40` }} />
        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
          <img src={to?.image} alt={to?.colonyName} className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}

function amount_fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

// ─── Auto Rules Panel ─────────────────────────────────────────────────────────

function AutoRulesPanel({
  rules,
  onToggle,
  onAdd,
  onDelete,
}: {
  rules: AutoRule[];
  onToggle: (id: string) => void;
  onAdd: (rule: Omit<AutoRule, 'id' | 'lastTriggeredAt'>) => void;
  onDelete: (id: string) => void;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRule, setNewRule] = useState({
    colonyId: COLONY_HEALTH_DATA[0].colonyId,
    resource: 'food' as ResourceType,
    threshold: -100,
    sourceColonyId: COLONY_HEALTH_DATA[1].colonyId,
    amount: 500,
    cooldownMs: 60000,
    enabled: true,
  });

  const handleAdd = () => {
    if (newRule.colonyId === newRule.sourceColonyId) return;
    onAdd(newRule);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <i className="ri-robot-line text-purple-400" />Automated Dispatch Rules
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Rules auto-trigger a supply run when a colony's surplus drops below threshold</p>
        </div>
        <button
          onClick={() => setShowAddForm(p => !p)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all whitespace-nowrap"
          style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.4)', color: '#a78bfa' }}
        >
          <i className={showAddForm ? 'ri-close-line' : 'ri-add-line'} />
          {showAddForm ? 'Cancel' : 'New Rule'}
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.25)' }}>
          <p className="text-xs font-bold text-purple-300">New Auto-Dispatch Rule</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Target Colony (receives supply)</label>
              <select
                value={newRule.colonyId}
                onChange={e => setNewRule(p => ({ ...p, colonyId: e.target.value }))}
                className="w-full px-2 py-1.5 rounded-lg text-xs text-white cursor-pointer"
                style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                {COLONY_HEALTH_DATA.map(c => (
                  <option key={c.colonyId} value={c.colonyId}>{c.colonyName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Resource</label>
              <select
                value={newRule.resource}
                onChange={e => setNewRule(p => ({ ...p, resource: e.target.value as ResourceType }))}
                className="w-full px-2 py-1.5 rounded-lg text-xs text-white cursor-pointer"
                style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <option value="food">Food</option>
                <option value="water">Water</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Trigger Threshold (surplus/hr)</label>
              <input
                type="number"
                value={newRule.threshold}
                onChange={e => setNewRule(p => ({ ...p, threshold: Number(e.target.value) }))}
                className="w-full px-2 py-1.5 rounded-lg text-xs text-white outline-none"
                style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.12)' }}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Source Colony (has surplus)</label>
              <select
                value={newRule.sourceColonyId}
                onChange={e => setNewRule(p => ({ ...p, sourceColonyId: e.target.value }))}
                className="w-full px-2 py-1.5 rounded-lg text-xs text-white cursor-pointer"
                style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                {COLONY_HEALTH_DATA.filter(c => c.colonyId !== newRule.colonyId).map(c => (
                  <option key={c.colonyId} value={c.colonyId}>{c.colonyName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Amount per dispatch</label>
              <input
                type="number"
                step={100}
                value={newRule.amount}
                onChange={e => setNewRule(p => ({ ...p, amount: Number(e.target.value) }))}
                className="w-full px-2 py-1.5 rounded-lg text-xs text-white outline-none"
                style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.12)' }}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Cooldown (seconds)</label>
              <input
                type="number"
                step={10}
                value={newRule.cooldownMs / 1000}
                onChange={e => setNewRule(p => ({ ...p, cooldownMs: Number(e.target.value) * 1000 }))}
                className="w-full px-2 py-1.5 rounded-lg text-xs text-white outline-none"
                style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.12)' }}
              />
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={newRule.colonyId === newRule.sourceColonyId}
            className="px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all whitespace-nowrap"
            style={{ background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.5)', color: '#a78bfa' }}
          >
            <i className="ri-add-circle-line mr-1.5" />Add Rule
          </button>
        </div>
      )}

      {/* Rules list */}
      {rules.length === 0 ? (
        <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <i className="ri-robot-line text-3xl mb-2 block" style={{ color: 'rgba(167,139,250,0.4)' }} />
          <p className="text-sm text-gray-500">No auto-dispatch rules yet</p>
          <p className="text-xs text-gray-600 mt-1">Create a rule above to automate supply routing</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map(rule => {
            const target = COLONY_HEALTH_DATA.find(c => c.colonyId === rule.colonyId);
            const source = COLONY_HEALTH_DATA.find(c => c.colonyId === rule.sourceColonyId);
            const cfg = RESOURCE_CFG[rule.resource];

            return (
              <div
                key={rule.id}
                className="rounded-xl p-3.5 flex items-start gap-3"
                style={{
                  background: rule.enabled ? 'rgba(167,139,250,0.06)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${rule.enabled ? 'rgba(167,139,250,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  opacity: rule.enabled ? 1 : 0.55,
                }}
              >
                {/* Status dot */}
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${rule.enabled ? 'animate-pulse' : ''}`}
                  style={{ background: rule.enabled ? '#a78bfa' : '#4b5563' }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <i className={cfg.icon} style={{ color: cfg.color }} />
                      {amount_fmt(rule.amount)} {cfg.label}
                    </span>
                    <i className="ri-arrow-right-line text-xs text-gray-600" />
                    <span className="text-xs font-bold" style={{ color: '#f43f5e' }}>{target?.colonyName}</span>
                    <span className="text-xs text-gray-600">from</span>
                    <span className="text-xs font-bold" style={{ color: cfg.color }}>{source?.colonyName}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-gray-500">
                      Triggers when {cfg.label} &lt; <strong className="text-white">{rule.threshold}/hr</strong>
                    </span>
                    <span className="text-xs text-gray-600">
                      CD: {rule.cooldownMs / 1000}s
                    </span>
                    {rule.lastTriggeredAt && (
                      <span className="text-xs" style={{ color: '#a78bfa' }}>
                        Last: {Math.round((Date.now() - rule.lastTriggeredAt) / 1000)}s ago
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => onToggle(rule.id)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all whitespace-nowrap"
                    style={{
                      background: rule.enabled ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${rule.enabled ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.12)'}`,
                      color: rule.enabled ? '#4ade80' : '#6b7280',
                    }}
                  >
                    {rule.enabled ? 'ON' : 'OFF'}
                  </button>
                  <button
                    onClick={() => onDelete(rule.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:bg-red-500/20"
                    style={{ color: '#4b5563' }}
                  >
                    <i className="ri-delete-bin-line text-xs" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Event Log ────────────────────────────────────────────────────────────────

function EventLog({ entries }: { entries: EventLogEntry[] }) {
  const sorted = [...entries].sort((a, b) => b.timestamp - a.timestamp).slice(0, 30);

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <i className="ri-history-line text-3xl mb-2 block" style={{ color: 'rgba(56,189,248,0.3)' }} />
        <p className="text-xs text-gray-500">No events yet — dispatch your first supply run or create an auto rule</p>
      </div>
    );
  }

  const relativeTime = (ts: number) => {
    const s = Math.round((Date.now() - ts) / 1000);
    if (s < 60) return `${s}s ago`;
    return `${Math.floor(s / 60)}m ago`;
  };

  return (
    <div className="space-y-1.5">
      {sorted.map(e => (
        <div
          key={e.id}
          className="flex items-start gap-2.5 rounded-lg px-3 py-2"
          style={{ background: `${e.color}08`, border: `1px solid ${e.color}18` }}
        >
          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${e.color}15` }}>
            <i className={`${e.icon} text-xs`} style={{ color: e.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-300 leading-snug">{e.message}</p>
          </div>
          <span className="text-xs text-gray-600 flex-shrink-0 whitespace-nowrap">{relativeTime(e.timestamp)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SupplyEmergencyResponse() {
  const [now, setNow] = useState(Date.now());
  const [missions, setMissions] = useState<DispatchMission[]>([]);
  const [rules, setRules] = useState<AutoRule[]>([]);
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);
  const [dispatchTarget, setDispatchTarget] = useState<{ colony: ColonyHealth; resource: ResourceType } | null>(null);
  const [activeSection, setActiveSection] = useState<'crises' | 'missions' | 'rules' | 'log'>('crises');
  const autoCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clock
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, []);

  // Mission progress updater
  useEffect(() => {
    const t = setInterval(() => {
      setMissions(prev => prev.map(m => {
        if (m.status === 'delivered' || m.status === 'failed') return m;
        const elapsed = Date.now() - m.launchedAt;
        const pct = elapsed / m.travelDurationMs;
        if (pct < 0.15) return { ...m, status: 'launching' };
        if (pct < 0.85) return { ...m, status: 'in_transit' };
        if (pct < 1.0) return { ...m, status: 'arriving' };
        return { ...m, status: 'delivered' };
      }));
    }, 500);
    return () => clearInterval(t);
  }, []);

  // Log delivery events
  useEffect(() => {
    missions.forEach(m => {
      if (m.status === 'delivered') {
        const logId = `delivered-${m.id}`;
        setEventLog(prev => {
          if (prev.find(e => e.id === logId)) return prev;
          const to = COLONY_HEALTH_DATA.find(c => c.colonyId === m.toId);
          const cfg = RESOURCE_CFG[m.resource];
          return [...prev, {
            id: logId,
            timestamp: Date.now(),
            type: 'delivered',
            message: `${amount_fmt(m.amount)} ${cfg.label} delivered to ${to?.colonyName} ${m.autoTriggered ? '(auto-dispatch)' : ''}`,
            icon: 'ri-check-double-line',
            color: '#4ade80',
            missionId: m.id,
          }];
        });
      }
    });
  }, [missions]);

  // Auto-rule checker
  const checkRules = useCallback(() => {
    const nowMs = Date.now();
    setRules(prev => {
      const updated = [...prev];
      const newMissions: DispatchMission[] = [];
      const newLogs: EventLogEntry[] = [];

      for (let i = 0; i < updated.length; i++) {
        const rule = updated[i];
        if (!rule.enabled) continue;
        const colony = COLONY_HEALTH_DATA.find(c => c.colonyId === rule.colonyId);
        if (!colony) continue;
        const surplus = colonySurplus(colony, rule.resource);
        if (surplus >= rule.threshold) continue;
        if (rule.lastTriggeredAt && nowMs - rule.lastTriggeredAt < rule.cooldownMs) continue;

        // Check no mission already in transit for same target+resource
        const alreadyInFlight = missions.some(
          m => m.toId === rule.colonyId && m.resource === rule.resource &&
            m.status !== 'delivered' && m.status !== 'failed'
        );
        if (alreadyInFlight) continue;

        // Check source has surplus
        const source = COLONY_HEALTH_DATA.find(c => c.colonyId === rule.sourceColonyId);
        if (!source) continue;
        if (colonySurplus(source, rule.resource) < 50) continue;

        updated[i] = { ...rule, lastTriggeredAt: nowMs };
        const mId = uid();
        newMissions.push({
          id: mId,
          fromId: rule.sourceColonyId,
          toId: rule.colonyId,
          resource: rule.resource,
          amount: rule.amount,
          travelDurationMs: TRANSIT_DURATION_MS,
          launchedAt: nowMs,
          status: 'launching',
          autoTriggered: true,
          note: `Auto-dispatch triggered: ${RESOURCE_CFG[rule.resource].label} < ${rule.threshold}/hr`,
        });
        const cfg = RESOURCE_CFG[rule.resource];
        newLogs.push({
          id: `auto-${mId}`,
          timestamp: nowMs,
          type: 'auto_triggered',
          message: `Auto-rule triggered: ${amount_fmt(rule.amount)} ${cfg.label} dispatched from ${source.colonyName} → ${colony.colonyName} (surplus ${surplus}/hr)`,
          icon: 'ri-robot-line',
          color: '#a78bfa',
          missionId: mId,
        });
      }

      if (newMissions.length > 0) {
        setMissions(prev => Array.isArray(prev) ? [...prev, ...newMissions] : [...newMissions]);
        setEventLog(prev => Array.isArray(prev) ? [...prev, ...newLogs] : [...newLogs]);
      }

      return updated;
    });
  }, [missions]);

  useEffect(() => {
    autoCheckRef.current = setInterval(checkRules, 3000);
    return () => { if (autoCheckRef.current) clearInterval(autoCheckRef.current); };
  }, [checkRules]);

  const handleManualDispatch = (from: ColonyHealth, to: ColonyHealth, resource: ResourceType, amount: number, note: string) => {
    const mId = uid();
    const nowMs = Date.now();
    const mission: DispatchMission = {
      id: mId,
      fromId: from.colonyId,
      toId: to.colonyId,
      resource,
      amount,
      travelDurationMs: TRANSIT_DURATION_MS,
      launchedAt: nowMs,
      status: 'launching',
      autoTriggered: false,
      note,
    };
    setMissions(prev => [mission, ...prev]);
    const cfg = RESOURCE_CFG[resource];
    setEventLog(prev => [...prev, {
      id: `manual-${mId}`,
      timestamp: nowMs,
      type: 'manual_dispatch',
      message: `Manual dispatch: ${amount_fmt(amount)} ${cfg.label} from ${from.colonyName} → ${to.colonyName}${note ? ` — "${note}"` : ''}`,
      icon: 'ri-send-plane-fill',
      color: '#38bdf8',
      missionId: mId,
    }]);
    setDispatchTarget(null);
    setActiveSection('missions');
  };

  const handleAddRule = (rule: Omit<AutoRule, 'id' | 'lastTriggeredAt'>) => {
    const r: AutoRule = { ...rule, id: uid(), lastTriggeredAt: null };
    setRules(prev => [...prev, r]);
    setEventLog(prev => [...prev, {
      id: `rule-${r.id}`,
      timestamp: Date.now(),
      type: 'rule_added',
      message: `Auto-dispatch rule created: ${RESOURCE_CFG[r.resource].label} → ${COLONY_HEALTH_DATA.find(c => c.colonyId === r.colonyId)?.colonyName} when surplus < ${r.threshold}/hr`,
      icon: 'ri-add-circle-line',
      color: '#a78bfa',
    }]);
  };

  const handleToggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleDeleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  // Compute crisis status
  const crisisColonies = COLONY_HEALTH_DATA.filter(
    c => c.foodSurplus < 0 || c.waterSurplus < 0
  );
  const criticalCount = COLONY_HEALTH_DATA.filter(
    c => c.foodSurplus < -200 || c.waterSurplus < -200
  ).length;
  const activeMissionCount = missions.filter(m => m.status !== 'delivered' && m.status !== 'failed').length;
  const deliveredCount = missions.filter(m => m.status === 'delivered').length;

  // Summary stats
  const totalFoodDeficit = COLONY_HEALTH_DATA.reduce((s, c) => c.foodSurplus < 0 ? s + Math.abs(c.foodSurplus) : s, 0);
  const totalWaterDeficit = COLONY_HEALTH_DATA.reduce((s, c) => c.waterSurplus < 0 ? s + Math.abs(c.waterSurplus) : s, 0);

  type SectionId = 'crises' | 'missions' | 'rules' | 'log';
  const tabs: { id: SectionId; label: string; icon: string; badge?: number; color: string }[] = [
    { id: 'crises', label: 'Crisis Map', icon: 'ri-alarm-warning-line', badge: criticalCount || undefined, color: '#f43f5e' },
    { id: 'missions', label: 'Active Missions', icon: 'ri-rocket-2-line', badge: activeMissionCount || undefined, color: '#38bdf8' },
    { id: 'rules', label: 'Auto Rules', icon: 'ri-robot-line', badge: rules.filter(r => r.enabled).length || undefined, color: '#a78bfa' },
    { id: 'log', label: 'Event Log', icon: 'ri-history-line', color: '#fbbf24' },
  ];

  return (
    <div className="space-y-5">
      {/* Dispatch modal */}
      {dispatchTarget && (
        <DispatchModal
          target={dispatchTarget.colony}
          resource={dispatchTarget.resource}
          onConfirm={handleManualDispatch}
          onClose={() => setDispatchTarget(null)}
        />
      )}

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <i className="ri-send-plane-fill text-amber-400" />Supply Emergency Response
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Detect food/water deficits in real-time, dispatch emergency supply runs, and set automated routing rules
          </p>
        </div>
        <button
          onClick={() => setActiveSection('crises')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all whitespace-nowrap hover:scale-[1.02]"
          style={{
            background: criticalCount > 0 ? 'rgba(244,63,94,0.15)' : 'rgba(251,191,36,0.12)',
            border: `2px solid ${criticalCount > 0 ? 'rgba(244,63,94,0.5)' : 'rgba(251,191,36,0.4)'}`,
            color: criticalCount > 0 ? '#f43f5e' : '#fbbf24',
          }}
        >
          <i className={`ri-alarm-warning-line ${criticalCount > 0 ? 'animate-pulse' : ''}`} />
          {criticalCount > 0 ? `${criticalCount} CRITICAL DEFICIT` : 'View Crisis Map'}
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
        {[
          { label: 'Crisis Colonies', value: crisisColonies.length, color: crisisColonies.length > 0 ? '#f43f5e' : '#4ade80', icon: 'ri-error-warning-line', sub: `${criticalCount} critical` },
          { label: 'Food Deficit', value: `-${totalFoodDeficit}/hr`, color: '#f87171', icon: 'ri-restaurant-line', sub: 'empire-wide' },
          { label: 'Water Deficit', value: `-${totalWaterDeficit}/hr`, color: '#38bdf8', icon: 'ri-drop-line', sub: 'empire-wide' },
          { label: 'Missions Active', value: activeMissionCount, color: activeMissionCount > 0 ? '#38bdf8' : '#6b7280', icon: 'ri-rocket-2-line', sub: 'in transit' },
          { label: 'Delivered', value: deliveredCount, color: '#4ade80', icon: 'ri-check-double-line', sub: 'total this session' },
          { label: 'Auto Rules', value: rules.filter(r => r.enabled).length, color: '#a78bfa', icon: 'ri-robot-line', sub: `${rules.length} total` },
        ].map(s => (
          <div key={s.label} className="rounded-xl px-3 py-3 text-center" style={{ background: 'rgba(10,15,30,0.9)', border: `1px solid ${s.color}20` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1.5" style={{ background: `${s.color}12` }}>
              <i className={`${s.icon} text-sm`} style={{ color: s.color }} />
            </div>
            <p className="text-sm font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-gray-500 leading-tight">{s.label}</p>
            <p className="text-xs text-gray-600">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Section tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {tabs.map(t => {
          const active = activeSection === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSection(t.id)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all whitespace-nowrap"
              style={{
                background: active ? `${t.color}15` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active ? `${t.color}40` : 'rgba(255,255,255,0.08)'}`,
                color: active ? t.color : '#6b7a95',
              }}
            >
              <i className={t.icon} />
              {t.label}
              {t.badge !== undefined && t.badge > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-black"
                  style={{ background: t.color, color: '#000', fontSize: 9 }}
                >
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Crisis Map */}
      {activeSection === 'crises' && (
        <div className="space-y-5">
          {/* Food deficits */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <i className="ri-restaurant-line text-green-400" />
              <h3 className="text-sm font-bold text-white">Food Supply Status</h3>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171' }}>
                {COLONY_HEALTH_DATA.filter(c => c.foodSurplus < 0).length} in deficit
              </span>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              {COLONY_HEALTH_DATA.map(c => (
                <CrisisColonyCard
                  key={c.colonyId}
                  colony={c}
                  resource="food"
                  activeMissions={missions}
                  onDispatch={(col, res) => setDispatchTarget({ colony: col, resource: res })}
                />
              ))}
            </div>
          </div>

          {/* Water deficits */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <i className="ri-drop-line text-sky-400" />
              <h3 className="text-sm font-bold text-white">Water Supply Status</h3>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}>
                {COLONY_HEALTH_DATA.filter(c => c.waterSurplus < 0).length} in deficit
              </span>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              {COLONY_HEALTH_DATA.map(c => (
                <CrisisColonyCard
                  key={c.colonyId}
                  colony={c}
                  resource="water"
                  activeMissions={missions}
                  onDispatch={(col, res) => setDispatchTarget({ colony: col, resource: res })}
                />
              ))}
            </div>
          </div>

          {/* Quick dispatch panel */}
          <div className="rounded-xl p-5" style={{ background: 'rgba(10,15,30,0.9)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <i className="ri-send-plane-line text-amber-400" />Manual Emergency Dispatch
            </h3>
            <p className="text-xs text-gray-400 mb-4">Select any colony below to manually dispatch an emergency supply run</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {COLONY_HEALTH_DATA.map(c => (
                <div key={c.colonyId} className="space-y-2">
                  <div className="relative h-16 rounded-lg overflow-hidden">
                    <img src={c.image} alt={c.colonyName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} />
                    <p className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">{c.colonyName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => setDispatchTarget({ colony: c, resource: 'food' })}
                      className="py-1 rounded-lg text-xs font-bold cursor-pointer transition-all hover:scale-[1.03] whitespace-nowrap"
                      style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.35)', color: '#4ade80' }}
                    >
                      <i className="ri-restaurant-line mr-0.5" />Food
                    </button>
                    <button
                      onClick={() => setDispatchTarget({ colony: c, resource: 'water' })}
                      className="py-1 rounded-lg text-xs font-bold cursor-pointer transition-all hover:scale-[1.03] whitespace-nowrap"
                      style={{ background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.35)', color: '#38bdf8' }}
                    >
                      <i className="ri-drop-line mr-0.5" />Water
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Missions */}
      {activeSection === 'missions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">All Dispatch Missions</h3>
            <span className="text-xs text-gray-500">{missions.length} total · {activeMissionCount} active</span>
          </div>
          {missions.length === 0 ? (
            <div className="rounded-xl p-10 text-center" style={{ background: 'rgba(10,15,30,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <i className="ri-rocket-2-line text-4xl mb-3 block" style={{ color: 'rgba(56,189,248,0.3)' }} />
              <p className="text-sm text-gray-500">No missions yet</p>
              <p className="text-xs text-gray-600 mt-1">Go to the Crisis Map and dispatch your first supply run</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Active first */}
              {(Array.isArray(missions) ? [...missions] : [])
                .sort((a, b) => {
                  const order: Record<DispatchStatus, number> = { launching: 0, arriving: 1, in_transit: 2, queued: 3, delivered: 4, failed: 5 };
                  return order[a.status] - order[b.status] || b.launchedAt - a.launchedAt;
                })
                .map(m => <MissionCard key={m.id} mission={m} now={now} />)}
            </div>
          )}
        </div>
      )}

      {/* Auto Rules */}
      {activeSection === 'rules' && (
        <AutoRulesPanel
          rules={rules}
          onToggle={handleToggleRule}
          onAdd={handleAddRule}
          onDelete={handleDeleteRule}
        />
      )}

      {/* Event Log */}
      {activeSection === 'log' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <i className="ri-history-line text-amber-400" />Supply Event Log
            </h3>
            <span className="text-xs text-gray-500">{eventLog.length} entries</span>
          </div>
          <EventLog entries={eventLog} />
        </div>
      )}
    </div>
  );
}