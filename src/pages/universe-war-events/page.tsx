import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  warEvents,
  warSummary,
  eventTypeConfig,
  statusConfig,
  intensityConfig,
  type WarEvent,
  type WarEventType,
  type WarEventStatus,
  type WarEventIntensity,
} from '@/data/universeWarEvents';

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function formatNum(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}

/* ─────────────────────────────────────────────
   INTENSITY BARS
───────────────────────────────────────────── */
function IntensityBars({ intensity }: { intensity: WarEventIntensity }) {
  const cfg = intensityConfig[intensity];
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4].map((b) => (
        <div
          key={b}
          className="w-1.5 h-3 rounded-sm"
          style={{
            background: b <= cfg.bars ? cfg.color : 'rgba(255,255,255,0.1)',
          }}
        />
      ))}
      <span className="ml-1 text-xs font-semibold" style={{ color: cfg.color }}>
        {cfg.label}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────────── */
function StatusBadge({ status }: { status: WarEventStatus }) {
  const cfg = statusConfig[status];
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.pulse ? 'animate-pulse' : ''}`}
        style={{ background: cfg.color }}
      />
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: cfg.color }}>
        {cfg.label}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROGRESS BAR
───────────────────────────────────────────── */
function BattleProgress({ event }: { event: WarEvent }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold truncate max-w-[120px]" style={{ color: event.attacker.color }}>
          [{event.attacker.tag}] {event.attacker.name}
        </span>
        <span className="font-bold truncate max-w-[120px] text-right" style={{ color: event.defender.color }}>
          {event.defender.name} [{event.defender.tag}]
        </span>
      </div>
      <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="absolute left-0 top-0 h-full rounded-l-full transition-all duration-1000"
          style={{
            width: `${event.attackerProgress}%`,
            background: `linear-gradient(90deg, ${event.attacker.color}cc, ${event.attacker.color})`,
          }}
        />
        <div
          className="absolute right-0 top-0 h-full rounded-r-full transition-all duration-1000"
          style={{
            width: `${event.defenderProgress}%`,
            background: `linear-gradient(270deg, ${event.defender.color}cc, ${event.defender.color})`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-0.5 h-full bg-black/60" />
        </div>
      </div>
      <div className="flex items-center justify-between text-xs" style={{ color: '#6b7a95' }}>
        <span style={{ color: event.attacker.color }}>{event.attackerProgress}%</span>
        <span className="text-xs" style={{ color: '#4a5568' }}>Battle Progress</span>
        <span style={{ color: event.defender.color }}>{event.defenderProgress}%</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   WAR EVENT CARD
───────────────────────────────────────────── */
function WarEventCard({
  event,
  selected,
  onClick,
}: {
  event: WarEvent;
  selected: boolean;
  onClick: () => void;
}) {
  const typeCfg = eventTypeConfig[event.type];
  const statusCfg = statusConfig[event.status];

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl p-4 transition-all cursor-pointer"
      style={{
        background: selected
          ? `linear-gradient(135deg, ${event.universeColor}18, ${event.universeColor}08)`
          : 'rgba(255,255,255,0.03)',
        border: selected
          ? `1px solid ${event.universeColor}50`
          : '1px solid rgba(255,255,255,0.06)',
        boxShadow: selected ? `0 0 20px ${event.universeColor}15` : 'none',
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: typeCfg.bg, border: `1px solid ${typeCfg.color}30` }}
          >
            <i className={`${typeCfg.icon} text-sm`} style={{ color: typeCfg.color }} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold truncate" style={{ color: '#e2e8f0' }}>
              {event.title}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ background: typeCfg.bg, color: typeCfg.color, fontSize: 10 }}
              >
                {typeCfg.label}
              </span>
              <span className="text-xs" style={{ color: event.universeColor }}>
                {event.universeName}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <StatusBadge status={event.status} />
          <IntensityBars intensity={event.intensity} />
        </div>
      </div>

      {/* Progress */}
      <BattleProgress event={event} />

      {/* Stats row */}
      <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-1 text-xs" style={{ color: '#6b7a95' }}>
          <i className="ri-sword-line text-xs" style={{ color: '#ef4444' }} />
          <span>{formatNum(event.totalCasualties)}</span>
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: '#6b7a95' }}>
          <i className="ri-rocket-2-line text-xs" style={{ color: '#f59e0b' }} />
          <span>{formatNum(event.shipsDestroyed)}</span>
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: '#6b7a95' }}>
          <i className="ri-map-pin-line text-xs" style={{ color: '#4ade80' }} />
          <span>{event.systemsContested} systems</span>
        </div>
        <div className="ml-auto flex items-center gap-1 text-xs" style={{ color: '#4a5568' }}>
          <i className="ri-eye-line text-xs" />
          <span>{formatNum(event.spectators)}</span>
        </div>
      </div>

      {/* Duration */}
      <div className="flex items-center justify-between mt-2 text-xs" style={{ color: '#4a5568' }}>
        <span>
          <i className="ri-time-line mr-1" />
          {event.duration}
        </span>
        <span style={{ color: statusCfg.color }}>{event.estimatedEnd}</span>
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────────
   PARTICIPANT CARD
───────────────────────────────────────────── */
function ParticipantCard({ participant, side }: { participant: WarEvent['attacker']; side: 'attacker' | 'defender' }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: `${participant.color}10`,
        border: `1px solid ${participant.color}30`,
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-shrink-0">
          <img
            src={participant.avatar}
            alt={participant.commander}
            className="w-12 h-12 rounded-full object-cover object-top"
            style={{ border: `2px solid ${participant.color}60` }}
          />
          {participant.isWinning && (
            <div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: '#fbbf24', border: '1px solid #92400e' }}
            >
              <i className="ri-sword-line text-xs text-black" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: participant.color }}>
            [{participant.tag}] {side === 'attacker' ? 'Attacker' : 'Defender'}
          </div>
          <div className="text-sm font-bold truncate" style={{ color: '#e2e8f0' }}>
            {participant.name}
          </div>
          <div className="text-xs" style={{ color: '#6b7a95' }}>
            Cmd: {participant.commander}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Members', value: participant.memberCount.toLocaleString(), icon: 'ri-team-line' },
          { label: 'Fleet Power', value: formatNum(participant.fleetPower), icon: 'ri-rocket-2-line' },
          { label: 'Territory', value: `${participant.territorySystems} sys`, icon: 'ri-map-pin-line' },
          { label: 'CP', value: formatNum(participant.conquestPoints), icon: 'ri-trophy-line' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg p-2" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="flex items-center gap-1 mb-0.5">
              <i className={`${stat.icon} text-xs`} style={{ color: participant.color }} />
              <span className="text-xs" style={{ color: '#4a5568' }}>{stat.label}</span>
            </div>
            <div className="text-sm font-bold" style={{ color: '#c8d4e8' }}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DETAIL PANEL
───────────────────────────────────────────── */
function EventDetailPanel({ event }: { event: WarEvent }) {
  const typeCfg = eventTypeConfig[event.type];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div
        className="rounded-xl p-5"
        style={{
          background: `linear-gradient(135deg, ${event.universeColor}15, rgba(0,0,0,0.4))`,
          border: `1px solid ${event.universeColor}30`,
        }}
      >
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: typeCfg.bg, border: `1px solid ${typeCfg.color}40` }}
          >
            <i className={`${typeCfg.icon} text-lg`} style={{ color: typeCfg.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-black" style={{ color: '#e2e8f0' }}>{event.title}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: typeCfg.bg, color: typeCfg.color }}
              >
                {typeCfg.label}
              </span>
              <span className="text-xs font-semibold" style={{ color: event.universeColor }}>
                <i className="ri-earth-line mr-1" />{event.universeName}
              </span>
              <StatusBadge status={event.status} />
            </div>
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: '#8892aa' }}>{event.description}</p>

        {/* Location */}
        <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: `1px solid ${event.universeColor}20` }}>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: '#6b7a95' }}>
            <i className="ri-map-pin-line" style={{ color: event.universeColor }} />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: '#6b7a95' }}>
            <i className="ri-crosshair-line" style={{ color: '#4a5568' }} />
            <span className="font-mono">{event.systemCoords}</span>
          </div>
        </div>
      </div>

      {/* Battle Progress */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#4a5568' }}>Battle Progress</h3>
        <BattleProgress event={event} />
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Total Casualties', value: formatNum(event.totalCasualties), icon: 'ri-sword-line', color: '#ef4444' },
            { label: 'Ships Destroyed', value: formatNum(event.shipsDestroyed), icon: 'ri-rocket-2-line', color: '#f59e0b' },
            { label: 'Systems Captured', value: event.systemsCaptured.toString(), icon: 'ri-map-pin-line', color: '#4ade80' },
          ].map((s) => (
            <div key={s.label} className="rounded-lg p-3 text-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <i className={`${s.icon} text-lg mb-1`} style={{ color: s.color }} />
              <div className="text-base font-black" style={{ color: '#e2e8f0' }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: '#4a5568' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Participants */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#4a5568' }}>Participants</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <ParticipantCard participant={event.attacker} side="attacker" />
          <ParticipantCard participant={event.defender} side="defender" />
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#4a5568' }}>
          <i className="ri-time-line mr-1.5" />Recent Events
        </h3>
        <div className="space-y-2">
          {event.recentEvents.map((e, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div
                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ background: i === 0 ? event.universeColor : '#374151' }}
              />
              <span className="text-xs leading-relaxed" style={{ color: i === 0 ? '#c8d4e8' : '#6b7a95' }}>
                {e}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#4a5568' }}>
          <i className="ri-gift-line mr-1.5" />Victory Rewards
        </h3>
        <div className="space-y-2">
          {event.rewards.map((r, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className={`${r.icon} text-sm`} style={{ color: event.universeColor }} />
                <span className="text-xs" style={{ color: '#8892aa' }}>{r.type}</span>
              </div>
              <span className="text-xs font-bold" style={{ color: '#e2e8f0' }}>{r.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {event.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#6b7a95', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Timing */}
      <div
        className="rounded-xl p-4 grid grid-cols-3 gap-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {[
          { label: 'Started', value: event.startedAt, icon: 'ri-calendar-line' },
          { label: 'Duration', value: event.duration, icon: 'ri-timer-line' },
          { label: 'Est. End', value: event.estimatedEnd, icon: 'ri-flag-line' },
        ].map((t) => (
          <div key={t.label} className="text-center">
            <i className={`${t.icon} text-base mb-1`} style={{ color: '#4a5568' }} />
            <div className="text-xs font-semibold" style={{ color: '#c8d4e8' }}>{t.value}</div>
            <div className="text-xs mt-0.5" style={{ color: '#4a5568' }}>{t.label}</div>
          </div>
        ))}
      </div>

      {/* Spectators */}
      <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2 text-sm" style={{ color: '#6b7a95' }}>
          <i className="ri-eye-line" />
          <span>{formatNum(event.spectators)} players watching</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-semibold" style={{ color: '#4ade80' }}>LIVE</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUMMARY STATS BAR
───────────────────────────────────────────── */
function SummaryStatsBar() {
  const stats = [
    { label: 'Active Wars', value: warSummary.totalActiveWars, icon: 'ri-sword-line', color: '#ef4444' },
    { label: 'Sieges', value: warSummary.totalSieges, icon: 'ri-shield-cross-line', color: '#f59e0b' },
    { label: 'Territory Battles', value: warSummary.totalTerritoryBattles, icon: 'ri-map-pin-line', color: '#4ade80' },
    { label: 'Fleet Engagements', value: warSummary.totalFleetEngagements, icon: 'ri-rocket-2-line', color: '#00d4ff' },
    { label: 'Blockades', value: warSummary.totalBlockades, icon: 'ri-lock-line', color: '#a78bfa' },
    { label: 'Invasions', value: warSummary.totalInvasions, icon: 'ri-planet-line', color: '#fb923c' },
    { label: '24h Casualties', value: formatNum(warSummary.totalCasualtiesLast24h), icon: 'ri-sword-line', color: '#f87171' },
  ];

  return (
    <div className="grid grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl p-3 text-center"
          style={{
            background: `${s.color}0d`,
            border: `1px solid ${s.color}25`,
          }}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg mx-auto mb-2" style={{ background: `${s.color}18` }}>
            <i className={`${s.icon} text-base`} style={{ color: s.color }} />
          </div>
          <div className="text-base font-black" style={{ color: '#e2e8f0' }}>{s.value}</div>
          <div className="text-xs mt-0.5" style={{ color: '#4a5568' }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   LIVE TICKER
───────────────────────────────────────────── */
const TICKER_ITEMS = [
  'EVG fleet destroyed 12,400 Void Destroyers at Alpha Prime [4:224:11]',
  'Void Rift Gate battle — 184,720 ships destroyed in 18 hours',
  'Crystal Sanctuary blockade enters day 5 — resources down 84%',
  'Warzone Sigma Fortress holds — 14th assault wave repelled',
  'Genesis War: Solar Pact captures 12 systems in core push',
  'Quantum Corridor: 3 alliances fighting for strategic route',
  'Solaris-IV colony falls to Titan League ground forces',
  'Ancient Ruins Sector: Celestial Pact victory imminent',
  'Server record: 2M+ ships engaged at Void Rift Gate simultaneously',
  'Iron Brotherhood skirmish at Resource Hub Omega — deuterium field contested',
];

function LiveTicker() {
  const [offset, setOffset] = useState(0);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => {
        const el = tickerRef.current;
        if (!el) return prev;
        const maxOffset = el.scrollWidth / 2;
        return prev >= maxOffset ? 0 : prev + 1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      className="flex items-center h-9 overflow-hidden rounded-xl mb-6"
      style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
    >
      <div
        className="flex-shrink-0 flex items-center gap-2 px-3 h-full"
        style={{ background: 'rgba(239,68,68,0.15)', borderRight: '1px solid rgba(239,68,68,0.2)' }}
      >
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap" style={{ color: '#ef4444' }}>
          LIVE
        </span>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div
          ref={tickerRef}
          className="flex items-center gap-8 whitespace-nowrap"
          style={{ transform: `translateX(-${offset}px)`, transition: 'none' }}
        >
          {doubled.map((item, i) => (
            <span key={i} className="text-xs flex-shrink-0" style={{ color: '#8892aa' }}>
              <i className="ri-sword-line mr-1.5" style={{ color: '#ef4444' }} />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   UNIVERSE FILTER BAR
───────────────────────────────────────────── */
const UNIVERSES = [
  { id: 'all', name: 'All Universes', color: '#00d4ff' },
  { id: 'u1', name: 'Alpha Prime', color: '#00d4ff' },
  { id: 'u2', name: 'Omega Void', color: '#7c3aed' },
  { id: 'u3', name: 'Genesis Cluster', color: '#4ade80' },
  { id: 'u4', name: 'Eternal Nexus', color: '#f59e0b' },
  { id: 'u5', name: 'Quantum Flux', color: '#06b6d4' },
  { id: 'u6', name: 'Temporal Rift', color: '#a78bfa' },
  { id: 'u7', name: 'Iron Dominion', color: '#f87171' },
  { id: 'u8', name: 'Crystal Expanse', color: '#c084fc' },
  { id: 'u9', name: 'Void Nexus', color: '#818cf8' },
  { id: 'u10', name: 'Solar Dominion', color: '#fbbf24' },
];

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function UniverseWarEventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<WarEvent>(warEvents[0]);
  const [filterUniverse, setFilterUniverse] = useState('all');
  const [filterType, setFilterType] = useState<WarEventType | 'all'>('all');
  const [filterIntensity, setFilterIntensity] = useState<WarEventIntensity | 'all'>('all');
  const [sortBy, setSortBy] = useState<'intensity' | 'casualties' | 'duration' | 'spectators'>('intensity');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Auto-refresh simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const intensityOrder: Record<WarEventIntensity, number> = { extreme: 4, high: 3, medium: 2, low: 1 };

  const filteredEvents = warEvents
    .filter((e) => {
      if (filterUniverse !== 'all' && e.universeId !== filterUniverse) return false;
      if (filterType !== 'all' && e.type !== filterType) return false;
      if (filterIntensity !== 'all' && e.intensity !== filterIntensity) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          e.attacker.name.toLowerCase().includes(q) ||
          e.defender.name.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.universeName.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'intensity') return intensityOrder[b.intensity] - intensityOrder[a.intensity];
      if (sortBy === 'casualties') return b.totalCasualties - a.totalCasualties;
      if (sortBy === 'spectators') return b.spectators - a.spectators;
      return 0;
    });

  return (
    <div className="px-6 py-4 min-h-screen" style={{ color: '#c8d4e8' }}>
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              <i className="ri-sword-fill text-xl" style={{ color: '#ef4444' }} />
            </div>
            <div>
              <h1 className="text-2xl font-black" style={{ color: '#e2e8f0' }}>Universe War Events</h1>
              <p className="text-sm" style={{ color: '#6b7a95' }}>
                Live conflict tracker — alliance wars, sieges &amp; territory battles across all universes
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs" style={{ color: '#4a5568' }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Updated {lastRefresh.toLocaleTimeString()}</span>
          </div>
          <Link
            to="/universe-leaderboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all hover:bg-white/5"
            style={{ border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}
          >
            <i className="ri-trophy-line" />
            Leaderboard
          </Link>
          <Link
            to="/war-room"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
          >
            <i className="ri-alarm-warning-line" />
            War Room
          </Link>
        </div>
      </div>

      {/* Live Ticker */}
      <LiveTicker />

      {/* Summary Stats */}
      <SummaryStatsBar />

      {/* Universe Filter */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {UNIVERSES.map((u) => {
          const count = u.id === 'all' ? warEvents.length : warEvents.filter((e) => e.universeId === u.id).length;
          const active = filterUniverse === u.id;
          return (
            <button
              key={u.id}
              onClick={() => setFilterUniverse(u.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all flex-shrink-0"
              style={{
                background: active ? `${u.color}20` : 'rgba(255,255,255,0.04)',
                border: active ? `1px solid ${u.color}50` : '1px solid rgba(255,255,255,0.08)',
                color: active ? u.color : '#6b7a95',
              }}
            >
              {u.id !== 'all' && (
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: u.color }} />
              )}
              {u.name}
              {count > 0 && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-xs"
                  style={{ background: active ? `${u.color}30` : 'rgba(255,255,255,0.08)', color: active ? u.color : '#4a5568' }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 min-w-[200px]"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <i className="ri-search-line text-sm" style={{ color: '#4a5568' }} />
          <input
            type="text"
            placeholder="Search events, alliances, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"
            style={{ color: '#c8d4e8' }}
          />
        </div>

        {/* Type filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as WarEventType | 'all')}
          className="px-3 py-2 rounded-lg text-xs cursor-pointer outline-none"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8892aa' }}
        >
          <option value="all">All Types</option>
          <option value="alliance_war">Alliance War</option>
          <option value="siege">Siege</option>
          <option value="territory_battle">Territory Battle</option>
          <option value="fleet_engagement">Fleet Engagement</option>
          <option value="blockade">Blockade</option>
          <option value="invasion">Invasion</option>
        </select>

        {/* Intensity filter */}
        <select
          value={filterIntensity}
          onChange={(e) => setFilterIntensity(e.target.value as WarEventIntensity | 'all')}
          className="px-3 py-2 rounded-lg text-xs cursor-pointer outline-none"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8892aa' }}
        >
          <option value="all">All Intensities</option>
          <option value="extreme">Extreme</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2 rounded-lg text-xs cursor-pointer outline-none"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8892aa' }}
        >
          <option value="intensity">Sort: Intensity</option>
          <option value="casualties">Sort: Casualties</option>
          <option value="spectators">Sort: Spectators</option>
        </select>

        <div className="text-xs ml-auto" style={{ color: '#4a5568' }}>
          {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-5">
        {/* Left: Event List */}
        <div className="w-[420px] flex-shrink-0 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 340px)' }}>
          {filteredEvents.length === 0 ? (
            <div
              className="rounded-xl p-8 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <i className="ri-sword-line text-3xl mb-3" style={{ color: '#374151' }} />
              <p className="text-sm" style={{ color: '#4a5568' }}>No events match your filters</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <WarEventCard
                key={event.id}
                event={event}
                selected={selectedEvent?.id === event.id}
                onClick={() => setSelectedEvent(event)}
              />
            ))
          )}
        </div>

        {/* Right: Detail Panel */}
        <div className="flex-1 min-w-0 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 340px)' }}>
          {selectedEvent ? (
            <EventDetailPanel event={selectedEvent} />
          ) : (
            <div
              className="rounded-xl p-12 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <i className="ri-sword-line text-4xl mb-4" style={{ color: '#374151' }} />
              <p style={{ color: '#4a5568' }}>Select an event to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
