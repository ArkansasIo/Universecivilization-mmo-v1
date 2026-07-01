import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type MouseEvent as RMouseEvent,
  type WheelEvent as RWheelEvent,
} from 'react';
import { Link } from 'react-router-dom';
import {
  EMPIRES,
  STAR_SYSTEMS,
  FLEETS,
  GALACTIC_EVENTS,
  type Empire,
  type StarSystem,
  type Fleet,
  type StarClass,
} from './data';

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════
const STAR_COLORS: Record<StarClass, { core: string; glow: string }> = {
  O:          { core: '#c0c8ff', glow: '#8899ff' },
  B:          { core: '#d0e0ff', glow: '#aaccff' },
  A:          { core: '#f0f4ff', glow: '#ddeeff' },
  F:          { core: '#fffce0', glow: '#fff3aa' },
  G:          { core: '#ffe08a', glow: '#ffcc44' },
  K:          { core: '#ffbb55', glow: '#ff9922' },
  M:          { core: '#ff7744', glow: '#ff5522' },
  neutron:    { core: '#aaffff', glow: '#00ffff' },
  pulsar:     { core: '#ffffff', glow: '#ff00ff' },
  black_hole: { core: '#220033', glow: '#8800ff' },
};

const STARBASE_ICONS: Record<string, string> = {
  outpost:       'ri-focus-3-line',
  starport:      'ri-space-ship-line',
  starhold:      'ri-shield-line',
  star_fortress: 'ri-shield-star-line',
  citadel:       'ri-building-4-line',
};

const FLEET_ICON: Record<string, string> = {
  military: 'ri-rocket-2-line',
  civilian: 'ri-ship-line',
  science:  'ri-microscope-line',
  colony:   'ri-planet-line',
};

const STATUS_LABEL: Record<string, string> = {
  controlled: 'Controlled',
  contested:  'Contested',
  frontier:   'Frontier',
  uncharted:  'Uncharted',
  war_zone:   'War Zone',
};

const DIPLO_LABEL: Record<string, { label: string; color: string }> = {
  ally:       { label: 'Ally',       color: '#00d4ff' },
  federation: { label: 'Federation', color: '#34d399' },
  nap:        { label: 'Non-Aggression', color: '#fbbf24' },
  rival:      { label: 'Rival',      color: '#f87171' },
  war:        { label: 'AT WAR',     color: '#ff2222' },
  neutral:    { label: 'Neutral',    color: '#6b7a95' },
  subject:    { label: 'Subject',    color: '#a78bfa' },
};

const RESOURCE_STRIP = [
  { label: 'Energy', value: '+846', icon: 'ri-flashlight-line', color: '#9a6a00' },
  { label: 'Minerals', value: '+612', icon: 'ri-copper-coin-line', color: '#5f6670' },
  { label: 'Food', value: '+318', icon: 'ri-seedling-line', color: '#197a48' },
  { label: 'Alloys', value: '+144', icon: 'ri-tools-line', color: '#334155' },
  { label: 'Influence', value: '6.2', icon: 'ri-star-line', color: '#6d5a00' },
  { label: 'Unity', value: '+92', icon: 'ri-government-line', color: '#4338ca' },
  { label: 'Research', value: '1.8K', icon: 'ri-flask-line', color: '#0369a1' },
];

const MENU_GROUPS = [
  {
    id: 'council',
    label: 'Council',
    icon: 'ri-government-line',
    items: ['Agenda', 'Edicts', 'Policies', 'Leaders'],
  },
  {
    id: 'outliner',
    label: 'Outliner',
    icon: 'ri-list-check-3',
    items: ['Colonies', 'Fleets', 'Starbases', 'Megastructures'],
  },
  {
    id: 'fleet',
    label: 'Fleet',
    icon: 'ri-rocket-2-line',
    items: ['Ship Designer', 'Fleet Manager', 'Reinforce', 'Patrols'],
  },
  {
    id: 'economy',
    label: 'Economy',
    icon: 'ri-exchange-dollar-line',
    items: ['Market', 'Trade Routes', 'Sectors', 'Production'],
  },
  {
    id: 'science',
    label: 'Science',
    icon: 'ri-microscope-line',
    items: ['Research', 'Anomalies', 'Situation Log', 'Archaeology'],
  },
] as const;

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
function formatPower(n: number) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return String(n);
}

function getEmpireForSystem(sys: StarSystem): Empire | null {
  if (!sys.controller) return null;
  return EMPIRES[sys.controller] ?? null;
}

// ═══════════════════════════════════════════════════════════════
// STAR NODE — rendered on canvas-like div
// ═══════════════════════════════════════════════════════════════
function StarNode({
  sys,
  scale,
  selected,
  dimmed,
  onSelect,
  onContextMenu,
}: {
  sys: StarSystem;
  scale: number;
  selected: boolean;
  dimmed: boolean;
  onSelect: (s: StarSystem) => void;
  onContextMenu: (e: RMouseEvent, s: StarSystem) => void;
}) {
  const empire = getEmpireForSystem(sys);
  const starColor = STAR_COLORS[sys.starClass];
  const baseSize = Math.max(4, sys.starSize * Math.min(scale, 1.5));
  const isWarZone = sys.status === 'war_zone';
  return (
    <div
      className="absolute select-none"
      style={{ left: sys.x, top: sys.y, transform: 'translate(-50%, -50%)' }}
    >
      {/* Territory circle */}
      {empire && (
        <div
          className="absolute rounded-full"
          style={{
            width: 56 * Math.min(scale, 1.4),
            height: 56 * Math.min(scale, 1.4),
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, ${empire.color}22 0%, ${empire.color}08 60%, transparent 100%)`,
            border: `1.5px solid ${empire.color}40`,
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* War zone pulse */}
      {isWarZone && (
        <div
          className="absolute rounded-full animate-ping"
          style={{
            width: 44 * Math.min(scale, 1.4),
            height: 44 * Math.min(scale, 1.4),
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            border: '2px solid rgba(255,50,50,0.6)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* The star itself */}
      <button
        onClick={() => onSelect(sys)}
        onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, sys); }}
        className="relative flex items-center justify-center cursor-pointer transition-all"
        style={{
          width: baseSize * 2.4,
          height: baseSize * 2.4,
          borderRadius: '50%',
          background: selected
            ? `radial-gradient(circle, ${starColor.core} 0%, ${starColor.glow} 55%, transparent 80%)`
            : `radial-gradient(circle, ${starColor.core} 0%, ${starColor.glow} 50%, transparent 80%)`,
          boxShadow: selected
            ? `0 0 ${baseSize * 4}px ${starColor.glow}, 0 0 ${baseSize * 8}px ${starColor.glow}80, 0 0 0 2px ${empire?.color ?? '#ffffff'}60`
            : `0 0 ${baseSize * 2}px ${starColor.glow}, 0 0 ${baseSize * 4}px ${starColor.glow}60`,
          opacity: dimmed ? 0.25 : 1,
          filter: sys.starClass === 'black_hole' ? 'brightness(0.6)' : undefined,
        }}
      />

      {/* System name — only show when not too zoomed out */}
      {scale > 0.45 && (
        <div
          className="absolute text-center whitespace-nowrap pointer-events-none"
          style={{
            top: baseSize * 2.4 + 4,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: Math.max(8, 10 * scale),
            color: selected
              ? (empire?.color ?? '#ffffff')
              : dimmed
              ? 'rgba(100,120,150,0.4)'
              : isWarZone
              ? '#ff6666'
              : (empire?.color ? `${empire.color}cc` : 'rgba(160,180,210,0.7)'),
            fontWeight: sys.isCapital ? 700 : selected ? 600 : 400,
            textShadow: '0 1px 4px rgba(0,0,0,0.9)',
          }}
        >
          {sys.name}
          {sys.isCapital && (
            <i className="ri-star-fill ml-1" style={{ color: empire?.color ?? '#fbbf24', fontSize: 8 }}></i>
          )}
        </div>
      )}

      {/* Starbase icon badge */}
      {sys.starbase && scale > 0.55 && (
        <div
          className="absolute flex items-center justify-center"
          style={{
            width: 12,
            height: 12,
            left: '50%',
            top: -6,
            transform: 'translateX(-50%)',
            background: empire?.color ? `${empire.color}cc` : '#334455',
            borderRadius: 3,
            fontSize: 7,
            color: '#fff',
            boxShadow: `0 0 4px ${empire?.color ?? '#335577'}80`,
            pointerEvents: 'none',
          }}
        >
          <i className={STARBASE_ICONS[sys.starbase]}></i>
        </div>
      )}

      {/* Fleet dot */}
      {sys.fleet && scale > 0.4 && (
        <div
          className="absolute"
          style={{
            width: 6,
            height: 6,
            right: -2,
            top: -2,
            borderRadius: '50%',
            background: empire?.color ?? '#00d4ff',
            boxShadow: `0 0 6px ${empire?.color ?? '#00d4ff'}`,
            border: '1px solid rgba(255,255,255,0.4)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Gateway icon */}
      {sys.isGateway && scale > 0.55 && (
        <div
          className="absolute"
          style={{
            width: 10,
            height: 10,
            left: -2,
            top: -2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9,
            color: '#fbbf24',
            textShadow: '0 0 6px #fbbf24',
            pointerEvents: 'none',
          }}
        >
          <i className="ri-links-line"></i>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HYPERLANE
// ═══════════════════════════════════════════════════════════════
function HyperlanesLayer({
  systems,
  scale,
  selectedEmpire,
  warSystems,
}: {
  systems: StarSystem[];
  scale: number;
  selectedEmpire: string | null;
  warSystems: Set<string>;
}) {
  const rendered = useMemo(() => {
    const added = new Set<string>();
    const lines: { x1: number; y1: number; x2: number; y2: number; isWar: boolean; sameEmpire: boolean; key: string }[] = [];

    const sysMap = new Map(systems.map((s) => [s.id, s]));

    systems.forEach((s) => {
      s.hyperlanes.forEach((tid) => {
        const key = [s.id, tid].sort().join('--');
        if (added.has(key)) return;
        added.add(key);
        const t = sysMap.get(tid);
        if (!t) return;

        const isWar = warSystems.has(s.id) && warSystems.has(tid);
        const sameEmpire =
          selectedEmpire !== null &&
          s.controller === selectedEmpire &&
          t.controller === selectedEmpire;

        lines.push({ x1: s.x, y1: s.y, x2: t.x, y2: t.y, isWar, sameEmpire, key });
      });
    });

    return lines;
  }, [systems, selectedEmpire, warSystems]);

  const w = 1050;
  const h = 700;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: w, height: h, overflow: 'visible' }}
    >
      <defs>
        <filter id="glow-lane">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {rendered.map((l) => (
        <line
          key={l.key}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={l.isWar ? 'rgba(255,60,60,0.65)' : l.sameEmpire ? 'rgba(200,220,255,0.35)' : 'rgba(100,130,170,0.18)'}
          strokeWidth={l.isWar ? 1.8 * Math.min(scale, 1) : 1.2 * Math.min(scale, 1)}
          strokeDasharray={l.isWar ? undefined : '4,6'}
          filter={l.isWar || l.sameEmpire ? 'url(#glow-lane)' : undefined}
        />
      ))}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// FLEET MARKERS
// ═══════════════════════════════════════════════════════════════
function FleetMarkersLayer({ fleets, scale }: { fleets: Fleet[]; scale: number }) {
  if (scale < 0.35) return null;
  return (
    <>
      {fleets.map((f) => {
        const empire = EMPIRES[f.empire];
        if (!empire) return null;
        return (
          <div
            key={f.id}
            className="absolute pointer-events-none flex items-center justify-center"
            style={{
              left: f.x,
              top: f.y,
              transform: 'translate(-50%, -50%)',
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: `${empire.color}cc`,
              border: `1.5px solid ${empire.color}`,
              boxShadow: `0 0 8px ${empire.color}80`,
              fontSize: 9,
              color: '#fff',
              zIndex: 25,
            }}
          >
            <i className={FLEET_ICON[f.type]}></i>
          </div>
        );
      })}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// CONTEXT MENU
// ═══════════════════════════════════════════════════════════════
function ContextMenu({
  system,
  pos,
  onClose,
}: {
  system: StarSystem;
  pos: { x: number; y: number };
  onClose: () => void;
}) {
  const empire = getEmpireForSystem(system);
  const actions = [
    { label: 'View System Details', icon: 'ri-information-line', color: '#00d4ff' },
    { label: 'Send Fleet Here', icon: 'ri-rocket-2-line', color: '#34d399' },
    ...(system.controller === 'player' ? [
      { label: 'Build Starbase', icon: 'ri-building-4-line', color: '#a78bfa' },
      { label: 'Colonize Planet', icon: 'ri-planet-line', color: '#fb923c' },
    ] : []),
    ...(system.controller && system.controller !== 'player' ? [
      { label: 'Launch Attack', icon: 'ri-sword-line', color: '#f87171' },
      { label: 'Send Spy Probe', icon: 'ri-user-search-line', color: '#fbbf24' },
    ] : []),
    { label: 'Set Waypoint', icon: 'ri-map-pin-line', color: '#6b7a95' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 rounded-xl overflow-hidden"
        style={{
          left: pos.x,
          top: pos.y,
          minWidth: 200,
          background: 'rgba(4, 8, 20, 0.97)',
          border: `1px solid ${empire?.color ?? 'rgba(0,212,255,0.3)'}60`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.8), 0 0 16px ${empire?.color ?? '#00d4ff'}20`,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          className="px-4 py-2.5 border-b"
          style={{ borderColor: `${empire?.color ?? 'rgba(0,212,255,0.15)'}30` }}
        >
          <p className="text-xs font-black text-white">{system.name}</p>
          <p className="text-xs" style={{ color: empire?.color ?? '#6b7a95' }}>
            {empire?.name ?? 'Unclaimed'} · {STATUS_LABEL[system.status]}
          </p>
        </div>
        <div className="py-1">
          {actions.map((a) => (
            <button
              key={a.label}
              onClick={onClose}
              className="w-full flex items-center gap-3 px-4 py-2 text-xs cursor-pointer transition-all hover:bg-white/5 whitespace-nowrap text-left"
              style={{ color: a.color }}
            >
              <i className={`${a.icon} text-sm w-4`}></i>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// BOTTOM INFO BAR — Stellaris-style
// ═══════════════════════════════════════════════════════════════
function BottomInfoBar({ system }: { system: StarSystem | null }) {
  const empire = system ? getEmpireForSystem(system) : null;

  if (!system) {
    return (
      <div
        className="absolute bottom-0 left-0 right-0 z-20 flex items-center px-6 gap-6"
        style={{
          height: 72,
          background: 'linear-gradient(90deg, rgba(2,5,15,0.98) 0%, rgba(4,8,22,0.97) 100%)',
          borderTop: '1px solid rgba(0,212,255,0.1)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}
          >
            <i className="ri-global-line text-cyan-400 text-xl"></i>
          </div>
          <div>
            <p className="text-sm font-bold text-white">Galaxy View — Nexus Dominion</p>
            <p className="text-xs" style={{ color: '#4a5568' }}>Click a star system to inspect · Right-click for actions</p>
          </div>
        </div>

        {/* Player empire quick stats */}
        <div className="flex gap-6 ml-8">
          {[
            { label: 'Systems', val: EMPIRES.player.systems, icon: 'ri-planet-line', color: '#00d4ff' },
            { label: 'Fleet Power', val: formatPower(EMPIRES.player.power), icon: 'ri-rocket-2-line', color: '#f87171' },
            { label: 'Tech Level', val: EMPIRES.player.tech, icon: 'ri-flask-line', color: '#a78bfa' },
            { label: 'Fleets', val: EMPIRES.player.fleets, icon: 'ri-group-line', color: '#34d399' },
          ].map((r) => (
            <div key={r.label} className="flex items-center gap-2">
              <i className={`${r.icon} text-sm`} style={{ color: r.color }}></i>
              <div>
                <p className="text-xs font-bold" style={{ color: r.color }}>{typeof r.val === 'number' ? r.val.toLocaleString() : r.val}</p>
                <p className="text-xs" style={{ color: '#4a5568' }}>{r.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="ml-auto text-xs" style={{ color: '#2a3a4a' }}>
          Scroll to zoom · Drag to pan · Right-click for menu
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 flex items-stretch"
      style={{
        height: 90,
        background: 'linear-gradient(90deg, rgba(2,5,15,0.99) 0%, rgba(4,8,22,0.98) 100%)',
        borderTop: `1px solid ${empire?.color ?? 'rgba(0,212,255,0.15)'}40`,
        boxShadow: `0 -4px 20px ${empire?.color ?? 'rgba(0,212,255,0.1)'}15`,
      }}
    >
      {/* Star icon section */}
      <div
        className="flex items-center justify-center px-6"
        style={{
          minWidth: 90,
          background: `linear-gradient(90deg, ${empire?.color ?? '#002233'}18, transparent)`,
          borderRight: `1px solid ${empire?.color ?? 'rgba(0,212,255,0.1)'}25`,
        }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${STAR_COLORS[system.starClass].core}30, transparent)`,
            border: `1.5px solid ${empire?.color ?? 'rgba(255,255,255,0.15)'}50`,
            boxShadow: `0 0 16px ${STAR_COLORS[system.starClass].glow}60`,
          }}
        >
          <i
            className="ri-sun-line text-3xl"
            style={{ color: STAR_COLORS[system.starClass].core }}
          ></i>
        </div>
      </div>

      {/* System name + type */}
      <div className="flex flex-col justify-center px-5 min-w-56" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <h3 className="text-lg font-black text-white leading-tight">{system.name}</h3>
        <p className="text-xs" style={{ color: empire?.color ?? '#6b7a95' }}>
          {system.starClass.toUpperCase()} Star · {empire?.name ?? 'Unclaimed'}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{
              background: system.status === 'war_zone' ? 'rgba(255,50,50,0.15)' : system.status === 'contested' ? 'rgba(255,180,50,0.12)' : `${empire?.color ?? '#334455'}15`,
              color: system.status === 'war_zone' ? '#ff6060' : system.status === 'contested' ? '#fbbf24' : (empire?.color ?? '#6b7a95'),
              border: `1px solid ${system.status === 'war_zone' ? 'rgba(255,50,50,0.3)' : system.status === 'contested' ? 'rgba(255,180,50,0.3)' : `${empire?.color ?? '#334455'}30`}`,
            }}
          >
            {STATUS_LABEL[system.status]}
          </span>
          {system.isCapital && <span className="text-xs text-amber-400 font-bold"><i className="ri-star-fill mr-0.5"></i>Capital</span>}
          {system.isGateway && <span className="text-xs text-amber-300 font-bold"><i className="ri-links-line mr-0.5"></i>Gateway</span>}
        </div>
      </div>

      {/* Planet count + population */}
      <div className="flex items-center px-5 gap-5" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="text-center">
          <p className="text-xl font-black text-white">{system.planets}</p>
          <p className="text-xs" style={{ color: '#4a5568' }}>Planets</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-black text-green-400">{system.habitablePlanets}</p>
          <p className="text-xs" style={{ color: '#4a5568' }}>Habitable</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-black text-white">{system.population > 0 ? `${(system.population / 1e6).toFixed(1)}M` : '—'}</p>
          <p className="text-xs" style={{ color: '#4a5568' }}>Population</p>
        </div>
      </div>

      {/* Resources */}
      <div className="flex items-center gap-4 px-5" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        {[
          { label: 'Energy', val: system.resources.energy, icon: 'ri-flashlight-line', color: '#fbbf24' },
          { label: 'Minerals', val: system.resources.minerals, icon: 'ri-copper-coin-line', color: '#fcd34d' },
          { label: 'Food', val: system.resources.food, icon: 'ri-seedling-line', color: '#4ade80' },
          { label: 'Alloys', val: system.resources.alloys, icon: 'ri-tools-line', color: '#94a3b8' },
        ].map((r) => (
          <div key={r.label} className="flex items-center gap-1.5">
            <i className={`${r.icon} text-sm`} style={{ color: r.color }}></i>
            <div>
              <p className="text-xs font-bold" style={{ color: r.color }}>{r.val}</p>
              <p className="text-xs" style={{ color: '#4a5568', fontSize: 9 }}>{r.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Starbase */}
      {system.starbase && (
        <div className="flex items-center px-5 gap-3" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: `${empire?.color ?? '#334455'}20`,
              border: `1px solid ${empire?.color ?? '#334455'}40`,
            }}
          >
            <i className={`${STARBASE_ICONS[system.starbase]} text-lg`} style={{ color: empire?.color ?? '#6b7a95' }}></i>
          </div>
          <div>
            <p className="text-xs font-bold text-white capitalize">{system.starbase.replace('_', ' ')}</p>
            <p className="text-xs" style={{ color: '#4a5568' }}>Starbase</p>
          </div>
        </div>
      )}

      {/* Anomaly */}
      {system.anomaly && (
        <div className="flex items-center px-5 gap-3" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(247,37,133,0.1)', border: '1px solid rgba(247,37,133,0.3)' }}>
            <i className="ri-focus-2-line text-pink-400 text-lg"></i>
          </div>
          <div>
            <p className="text-xs font-bold text-pink-400 capitalize">{system.anomaly.replace('_', ' ')}</p>
            <p className="text-xs" style={{ color: '#4a5568' }}>Anomaly</p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="ml-auto flex items-center gap-2 px-5">
        {system.controller === 'player' ? (
          <>
            <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-white whitespace-nowrap cursor-pointer" style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>
              <i className="ri-settings-3-line mr-1"></i>Manage
            </button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-white whitespace-nowrap cursor-pointer" style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80' }}>
              <i className="ri-rocket-2-line mr-1"></i>Fleet
            </button>
          </>
        ) : (
          <>
            <button className="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer" style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171' }}>
              <i className="ri-sword-line mr-1"></i>Attack
            </button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24' }}>
              <i className="ri-user-search-line mr-1"></i>Spy
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EMPIRE PANEL (right sidebar)
// ═══════════════════════════════════════════════════════════════
function EmpirePanel({
  empire,
  onClose,
  onFilter,
}: {
  empire: Empire;
  onClose: () => void;
  onFilter: (id: string | null) => void;
}) {
  const [tab, setTab] = useState<'overview' | 'diplo' | 'stats'>('overview');

  return (
    <div
      className="absolute right-0 top-0 bottom-0 z-30 flex flex-col overflow-hidden"
      style={{
        width: 320,
        background: 'rgba(2,5,15,0.98)',
        borderLeft: `1px solid ${empire.color}30`,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Empire header */}
      <div
        className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
        style={{ background: `linear-gradient(90deg, ${empire.color}18, transparent)`, borderBottom: `1px solid ${empire.color}25` }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${empire.color}25`, border: `1.5px solid ${empire.color}60` }}
        >
          <i className={`${empire.flag} text-2xl`} style={{ color: empire.color }}></i>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black text-white truncate">{empire.name}</h3>
          <p className="text-xs" style={{ color: empire.color }}>[{empire.tag}] · {empire.government}</p>
          <p className="text-xs text-gray-500">{empire.species}</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:text-white hover:bg-white/5 cursor-pointer flex-shrink-0">
          <i className="ri-close-line text-sm"></i>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-3 pt-2 gap-1 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'diplo', label: 'Diplomacy' },
          { id: 'stats', label: 'Power' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className="px-3 py-2 text-xs font-semibold rounded-t cursor-pointer whitespace-nowrap transition-all"
            style={tab === t.id ? { color: empire.color, borderBottom: `2px solid ${empire.color}`, background: `${empire.color}08` } : { color: '#6b7a95' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'overview' && (
          <div className="space-y-4">
            {/* Ethics */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Ethics</p>
              <div className="flex flex-wrap gap-1.5">
                {empire.ethics.map((e) => (
                  <span key={e} className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${empire.color}15`, color: empire.color, border: `1px solid ${empire.color}30` }}>{e}</span>
                ))}
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Systems', val: empire.systems, icon: 'ri-planet-line', color: empire.color },
                { label: 'Fleets', val: empire.fleets, icon: 'ri-rocket-2-line', color: '#f87171' },
                { label: 'Fleet Power', val: formatPower(empire.power), icon: 'ri-sword-line', color: '#f87171' },
                { label: 'Tech Level', val: empire.tech, icon: 'ri-flask-line', color: '#a78bfa' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg p-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <i className={`${s.icon} text-xs`} style={{ color: s.color }}></i>
                    <span className="text-xs text-gray-500">{s.label}</span>
                  </div>
                  <p className="text-base font-black" style={{ color: s.color }}>{typeof s.val === 'number' ? s.val.toLocaleString() : s.val}</p>
                </div>
              ))}
            </div>

            {/* Filter button */}
            <button
              onClick={() => onFilter(empire.id)}
              className="w-full py-2 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all"
              style={{ background: `${empire.color}18`, border: `1px solid ${empire.color}35`, color: empire.color }}
            >
              <i className="ri-focus-2-line mr-1"></i>
              Highlight Empire Systems
            </button>
          </div>
        )}

        {tab === 'diplo' && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Diplomatic Relations</p>
            {Object.entries(empire.diplomacy).map(([otherId, status]) => {
              const other = EMPIRES[otherId];
              if (!other) return null;
              const d = DIPLO_LABEL[status];
              return (
                <div
                  key={otherId}
                  className="flex items-center gap-3 rounded-lg p-2.5"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${other.color}18`, border: `1px solid ${other.color}30` }}
                  >
                    <i className={`${other.flag} text-sm`} style={{ color: other.color }}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{other.name}</p>
                    <p className="text-xs text-gray-500">[{other.tag}]</p>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-bold whitespace-nowrap"
                    style={{ background: `${d.color}15`, color: d.color, border: `1px solid ${d.color}30` }}
                  >
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'stats' && (
          <div className="space-y-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Power Breakdown</p>
            {[
              { label: 'Military Power', val: empire.power, max: 200000, color: '#f87171', icon: 'ri-sword-line' },
              { label: 'Technology', val: empire.tech * 1000, max: 150000, color: '#a78bfa', icon: 'ri-flask-line' },
              { label: 'Economy', val: empire.systems * 8000, max: 200000, color: '#34d399', icon: 'ri-exchange-line' },
              { label: 'Influence', val: empire.systems * 3000, max: 80000, color: '#fbbf24', icon: 'ri-star-line' },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <i className={`${s.icon} text-xs`} style={{ color: s.color }}></i>
                    <span className="text-xs text-gray-400">{s.label}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: s.color }}>{formatPower(s.val)}</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-2 rounded-full"
                    style={{ width: `${Math.min(100, (s.val / s.max) * 100)}%`, background: `linear-gradient(90deg, ${s.color}cc, ${s.color}66)` }}
                  />
                </div>
              </div>
            ))}

            {/* Compare vs player */}
            {empire.id !== 'player' && (
              <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}>
                <p className="text-xs text-gray-400 mb-2">vs. Nexus Dominion</p>
                <div className="space-y-1.5 text-xs">
                  {[
                    { label: 'Fleet Power', our: EMPIRES.player.power, their: empire.power },
                    { label: 'Tech', our: EMPIRES.player.tech * 1000, their: empire.tech * 1000 },
                  ].map((c) => {
                    const pct = Math.round((c.their / c.our) * 100);
                    return (
                      <div key={c.label} className="flex items-center justify-between">
                        <span className="text-gray-500">{c.label}</span>
                        <span style={{ color: pct > 120 ? '#f87171' : pct < 80 ? '#34d399' : '#fbbf24' }}>
                          {pct}% of yours
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// GALAXY TICKER (top scrolling events bar)
// ═══════════════════════════════════════════════════════════════
function GalacticTicker() {
  const EVENT_ICONS: Record<string, string> = {
    war:       'ri-sword-line',
    peace:     'ri-shake-hands-line',
    alliance:  'ri-team-line',
    crisis:    'ri-alarm-warning-fill',
    anomaly:   'ri-focus-2-line',
    discovery: 'ri-search-eye-line',
  };
  const EVENT_COLORS: Record<string, string> = {
    war:       '#f87171',
    peace:     '#34d399',
    alliance:  '#00d4ff',
    crisis:    '#ff2222',
    anomaly:   '#f59e0b',
    discovery: '#a78bfa',
  };

  return (
    <div
      className="flex items-center overflow-hidden"
      style={{ height: 30, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(2,5,15,0.98)' }}
    >
      <div
        className="flex-shrink-0 px-3 text-xs font-black tracking-widest"
        style={{ color: '#00d4ff', borderRight: '1px solid rgba(0,212,255,0.2)', height: 30, display: 'flex', alignItems: 'center', background: 'rgba(0,212,255,0.06)' }}
      >
        GALACTIC NEWS
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex gap-10 px-6 animate-ticker-scroll" style={{ animationDuration: '40s' }}>
          {[...GALACTIC_EVENTS, ...GALACTIC_EVENTS].map((e, i) => (
            <div key={`${e.id}-${i}`} className="flex items-center gap-2 flex-shrink-0 text-xs whitespace-nowrap">
              <i className={`${EVENT_ICONS[e.type]} text-sm`} style={{ color: EVENT_COLORS[e.type] }}></i>
              <span style={{ color: EVENT_COLORS[e.type], fontWeight: 700 }}>{e.title}</span>
              <span className="text-gray-400">—</span>
              <span style={{ color: '#8892aa' }}>{e.description}</span>
              <span style={{ color: '#4a5568' }}>[{e.time}]</span>
              <span style={{ color: 'rgba(255,255,255,0.06)' }}>|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MINIMAP
// ═══════════════════════════════════════════════════════════════
function Minimap({
  systems,
  viewX,
  viewY,
  viewW,
  viewH,
  mapW,
  mapH,
}: {
  systems: StarSystem[];
  viewX: number;
  viewY: number;
  viewW: number;
  viewH: number;
  mapW: number;
  mapH: number;
}) {
  const mW = 180;
  const mH = 120;
  const scaleX = mW / mapW;
  const scaleY = mH / mapH;

  return (
    <div
      className="relative overflow-hidden rounded-lg"
      style={{
        width: mW,
        height: mH,
        background: 'rgba(2,5,15,0.96)',
        border: '1px solid rgba(0,212,255,0.15)',
      }}
    >
      {/* Empire territories */}
      {systems.map((s) => {
        const empire = getEmpireForSystem(s);
        return (
          <div
            key={s.id}
            className="absolute rounded-full"
            style={{
              left: s.x * scaleX - 2,
              top: s.y * scaleY - 2,
              width: 4,
              height: 4,
              background: empire ? empire.color : (s.status === 'contested' ? '#fbbf24' : 'rgba(100,120,150,0.4)'),
              opacity: 0.9,
            }}
          />
        );
      })}

      {/* Viewport indicator */}
      <div
        className="absolute"
        style={{
          left: viewX * scaleX,
          top: viewY * scaleY,
          width: viewW * scaleX,
          height: viewH * scaleY,
          border: '1px solid rgba(0,212,255,0.6)',
          background: 'rgba(0,212,255,0.05)',
        }}
      />

      {/* Label */}
      <div className="absolute bottom-1 right-2 text-xs" style={{ color: 'rgba(0,212,255,0.4)', fontSize: 8 }}>MINIMAP</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════
function CommandRibbon({
  activeMenu,
  onMenuChange,
}: {
  activeMenu: typeof MENU_GROUPS[number]['id'];
  onMenuChange: (id: typeof MENU_GROUPS[number]['id']) => void;
}) {
  const active = MENU_GROUPS.find((m) => m.id === activeMenu) ?? MENU_GROUPS[0];

  return (
    <div className="silver-command-ribbon">
      <div className="silver-resource-strip">
        {RESOURCE_STRIP.map((r) => (
          <div key={r.label} className="silver-resource-chip">
            <i className={r.icon} style={{ color: r.color }}></i>
            <span>{r.label}</span>
            <strong style={{ color: r.color }}>{r.value}</strong>
          </div>
        ))}
      </div>

      <div className="silver-menu-row">
        {MENU_GROUPS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onMenuChange(m.id)}
            className={active.id === m.id ? 'is-active' : ''}
            title={m.label}
          >
            <i className={m.icon}></i>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      <div className="silver-submenu-row">
        {active.items.map((item) => (
          <button key={item} type="button">
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function ViewportControlCluster({
  mapLayer,
  showFleets,
  showHyperlanes,
  showEmpireList,
}: {
  mapLayer: string;
  showFleets: boolean;
  showHyperlanes: boolean;
  showEmpireList: boolean;
}) {
  const chips = [
    { label: 'Viewport', value: mapLayer.toUpperCase(), icon: 'ri-radar-line' },
    { label: 'Fleets', value: showFleets ? 'ON' : 'OFF', icon: 'ri-rocket-2-line' },
    { label: 'Lanes', value: showHyperlanes ? 'ON' : 'OFF', icon: 'ri-share-line' },
    { label: 'Outliner', value: showEmpireList ? 'OPEN' : 'HIDDEN', icon: 'ri-sidebar-fold-line' },
  ];

  return (
    <div className="silver-viewport-cluster">
      {chips.map((c) => (
        <div key={c.label}>
          <i className={c.icon}></i>
          <span>{c.label}</span>
          <strong>{c.value}</strong>
        </div>
      ))}
    </div>
  );
}

export default function StellarisViewPage() {
  const MAP_W = 1050;
  const MAP_H = 700;

  const containerRef = useRef<HTMLDivElement>(null);

  // Pan & zoom state
  const [offsetX, setOffsetX] = useState(-50);
  const [offsetY, setOffsetY] = useState(-30);
  const [scale, setScale] = useState(1.0);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  // UI state
  const [selectedSystem, setSelectedSystem] = useState<StarSystem | null>(null);
  const [selectedEmpire, setSelectedEmpire] = useState<Empire | null>(null);
  const [filterEmpire, setFilterEmpire] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ sys: StarSystem; x: number; y: number } | null>(null);
  const [showEmpireList, setShowEmpireList] = useState(true);
  const [mapLayer, setMapLayer] = useState<'default' | 'political' | 'strategic' | 'economic'>('default');
  const [showFleets, setShowFleets] = useState(true);
  const [showHyperlanes, setShowHyperlanes] = useState(true);
  const [timeAccel, setTimeAccel] = useState(1);
  const [activeMenu, setActiveMenu] = useState<typeof MENU_GROUPS[number]['id']>('outliner');

  // Animated fleet positions
  const [fleets, setFleets] = useState<Fleet[]>(FLEETS);

  // In-game clock
  const [gameDate, setGameDate] = useState({ year: 2350, month: 3, day: 14 });
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  useEffect(() => {
    const interval = setInterval(() => {
      setGameDate((d) => {
        let { year, month, day } = d;
        day += timeAccel;
        if (day > 30) { day = 1; month++; }
        if (month > 12) { month = 1; year++; }
        return { year, month, day };
      });

      // Animate fleets
      setFleets((prev) =>
        prev.map((f) => {
          if (!f.toSystem) return f;
          const newProg = Math.min(1, f.progress + 0.002 * timeAccel);
          const from = STAR_SYSTEMS.find((s) => s.id === f.fromSystem);
          const to = STAR_SYSTEMS.find((s) => s.id === f.toSystem);
          if (!from || !to) return f;
          return {
            ...f,
            progress: newProg === 1 ? 0 : newProg,
            x: from.x + (to.x - from.x) * (newProg === 1 ? 0 : newProg),
            y: from.y + (to.y - from.y) * (newProg === 1 ? 0 : newProg),
          };
        })
      );
    }, 400);
    return () => clearInterval(interval);
  }, [timeAccel]);

  // War zone systems (for highlighting)
  const warSystems = useMemo(() => {
    return new Set(STAR_SYSTEMS.filter((s) => s.warFront || s.status === 'war_zone').map((s) => s.id));
  }, []);

  // Pan handlers
  const onMouseDown = useCallback((e: RMouseEvent) => {
    if (e.button === 0) {
      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY, ox: offsetX, oy: offsetY };
    }
  }, [offsetX, offsetY]);

  const onMouseMove = useCallback((e: RMouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffsetX(dragStart.current.ox + dx / scale);
    setOffsetY(dragStart.current.oy + dy / scale);
  }, [scale]);

  const onMouseUp = useCallback(() => { isDragging.current = false; }, []);

  const onWheel = useCallback((e: RWheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((s) => Math.max(0.28, Math.min(2.4, s + delta)));
  }, []);

  // Zoom controls
  const zoom = (dir: 1 | -1) => setScale((s) => Math.max(0.28, Math.min(2.4, parseFloat((s + dir * 0.15).toFixed(2)))));
  const resetView = () => { setScale(1.0); setOffsetX(-50); setOffsetY(-30); };

  // Focus on capital
  const focusCapital = () => {
    const cap = STAR_SYSTEMS.find((s) => s.id === EMPIRES.player.capital);
    if (!cap) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setOffsetX(rect.width / 2 / scale - cap.x);
    setOffsetY(rect.height / 2 / scale - cap.y);
  };

  // Dimming logic
  const isDimmed = (sys: StarSystem) => {
    if (filterEmpire !== null) return sys.controller !== filterEmpire;
    return false;
  };

  // System select
  const handleSelectSystem = (sys: StarSystem) => {
    setSelectedSystem((prev) => prev?.id === sys.id ? null : sys);
    setContextMenu(null);
  };

  const handleContextMenu = (e: RMouseEvent, sys: StarSystem) => {
    e.stopPropagation();
    setContextMenu({ sys, x: e.clientX, y: e.clientY });
  };

  // Map background color by layer
  const bgColors: Record<typeof mapLayer, string> = {
    default:   'radial-gradient(ellipse at 30% 40%, rgba(20,10,40,1) 0%, rgba(5,5,15,1) 60%, rgba(2,3,10,1) 100%)',
    political: 'radial-gradient(ellipse at 30% 40%, rgba(5,10,30,1) 0%, rgba(2,5,18,1) 100%)',
    strategic: 'radial-gradient(ellipse at 50% 50%, rgba(5,15,10,1) 0%, rgba(2,5,8,1) 100%)',
    economic:  'radial-gradient(ellipse at 50% 20%, rgba(15,12,5,1) 0%, rgba(5,4,2,1) 100%)',
  };

  return (
    <div className="stellaris-silver-shell fixed inset-0 flex flex-col overflow-hidden" style={{ background: '#f3f5f8', zIndex: 0 }}>

      {/* ── CSS Ticker Animation ──────────────────────── */}
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-ticker-scroll {
          animation: ticker-scroll linear infinite;
          width: max-content;
        }
        .stellaris-silver-shell {
          color: #0f172a;
          background:
            linear-gradient(180deg, #ffffff 0%, #eef2f7 42%, #d8dee7 100%);
        }
        .stellaris-silver-shell .text-white,
        .stellaris-silver-shell .text-gray-400,
        .stellaris-silver-shell .text-gray-500,
        .stellaris-silver-shell .text-gray-600 {
          color: #111827 !important;
        }
        .stellaris-silver-shell button {
          border-radius: 6px !important;
        }
        .stellaris-silver-shell > .flex.items-center.h-12,
        .stellaris-silver-shell > .flex.items-center.overflow-hidden,
        .stellaris-silver-shell .silver-panel,
        .stellaris-silver-shell [style*="rgba(2,5,15"],
        .stellaris-silver-shell [style*="rgba(4, 8, 20"],
        .stellaris-silver-shell [style*="rgba(4,8,22"] {
          background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(230,236,244,0.96)) !important;
          color: #0f172a !important;
          border-color: rgba(86, 99, 118, 0.28) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.95), 0 10px 28px rgba(15,23,42,0.12);
        }
        .stellaris-silver-shell a,
        .stellaris-silver-shell button,
        .stellaris-silver-shell span,
        .stellaris-silver-shell p,
        .stellaris-silver-shell h3 {
          letter-spacing: 0;
        }
        .silver-command-ribbon {
          display: grid;
          grid-template-columns: minmax(420px, 1fr) auto;
          grid-template-rows: 34px 38px;
          gap: 0;
          border-bottom: 1px solid rgba(86, 99, 118, 0.32);
          background: linear-gradient(180deg, #fafafa 0%, #d9e0e9 100%);
          box-shadow: inset 0 1px 0 #fff, 0 8px 18px rgba(15,23,42,0.12);
          z-index: 45;
        }
        .silver-resource-strip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          overflow-x: auto;
          border-right: 1px solid rgba(86,99,118,0.22);
        }
        .silver-resource-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 24px;
          padding: 0 9px;
          border: 1px solid rgba(86,99,118,0.24);
          background: linear-gradient(180deg, #fff, #edf1f5);
          color: #111827;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }
        .silver-menu-row {
          grid-row: 1 / span 2;
          grid-column: 2;
          display: flex;
          align-items: stretch;
          padding: 5px 10px;
          gap: 6px;
          border-left: 1px solid rgba(86,99,118,0.22);
        }
        .silver-menu-row button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 76px;
          padding: 4px 9px;
          border: 1px solid rgba(86,99,118,0.26);
          background: linear-gradient(180deg, #ffffff, #e9edf3);
          color: #111827;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }
        .silver-menu-row button i {
          font-size: 16px;
          color: #334155;
        }
        .silver-menu-row button.is-active {
          background: linear-gradient(180deg, #ffffff, #cfd8e3);
          border-color: rgba(15,23,42,0.48);
          box-shadow: inset 0 -2px 0 #111827;
        }
        .silver-submenu-row {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-top: 1px solid rgba(86,99,118,0.18);
          overflow-x: auto;
        }
        .silver-submenu-row button {
          height: 26px;
          padding: 0 12px;
          border: 1px solid rgba(86,99,118,0.26);
          background: rgba(255,255,255,0.7);
          color: #0f172a;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }
        .silver-viewport-cluster {
          position: absolute;
          top: 54px;
          right: 14px;
          z-index: 22;
          display: grid;
          grid-template-columns: repeat(2, minmax(92px, 1fr));
          gap: 6px;
          width: min(330px, calc(100% - 28px));
        }
        .silver-viewport-cluster div {
          display: grid;
          grid-template-columns: 18px 1fr auto;
          align-items: center;
          gap: 6px;
          padding: 6px 8px;
          border: 1px solid rgba(86,99,118,0.28);
          background: rgba(248,250,252,0.9);
          color: #111827;
          box-shadow: 0 8px 24px rgba(15,23,42,0.12);
          backdrop-filter: blur(10px);
        }
        .silver-viewport-cluster span {
          font-size: 10px;
          font-weight: 700;
        }
        .silver-viewport-cluster strong {
          font-size: 10px;
          color: #0369a1;
        }
        @media (max-width: 1100px) {
          .silver-command-ribbon {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
          }
          .silver-menu-row {
            grid-row: auto;
            grid-column: auto;
            overflow-x: auto;
          }
        }
      `}</style>

      {/* ── TOP BAR ────────────────────────────────────── */}
      <div
        className="flex items-center h-12 px-4 gap-3 flex-shrink-0"
        style={{
          background: 'rgba(2,5,15,0.99)',
          borderBottom: '1px solid rgba(0,212,255,0.12)',
          zIndex: 50,
        }}
      >
        {/* Back to game */}
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all hover:bg-white/5"
          style={{ color: '#6b7a95', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <i className="ri-arrow-left-line text-sm"></i>
          Dashboard
        </Link>

        <div className="w-px h-6" style={{ background: 'rgba(255,255,255,0.06)' }}></div>

        {/* Title */}
        <div className="flex items-center gap-2">
          <i className="ri-global-line text-cyan-400 text-sm"></i>
          <span className="text-xs font-black tracking-widest text-white">STELLARIS GALAXY VIEW</span>
        </div>

        <div className="w-px h-6" style={{ background: 'rgba(255,255,255,0.06)' }}></div>

        {/* Game date */}
        <div className="flex items-center gap-2 px-3 py-1 rounded" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
          <i className="ri-calendar-line text-cyan-400 text-xs"></i>
          <span className="text-xs font-mono font-bold text-cyan-400">
            {MONTHS[gameDate.month - 1]} {gameDate.day}, {gameDate.year}
          </span>
        </div>

        {/* Time acceleration */}
        <div className="flex items-center gap-1 p-0.5 rounded" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[1, 2, 3, 5].map((n) => (
            <button
              key={n}
              onClick={() => setTimeAccel(n)}
              className="px-2.5 py-1 rounded text-xs font-bold cursor-pointer whitespace-nowrap"
              style={timeAccel === n ? { background: '#00d4ff25', color: '#00d4ff' } : { color: '#6b7a95' }}
            >
              {n}×
            </button>
          ))}
        </div>

        <div className="w-px h-6" style={{ background: 'rgba(255,255,255,0.06)' }}></div>

        {/* Map layer selector */}
        <div className="flex items-center gap-1 p-0.5 rounded" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {(['default', 'political', 'strategic', 'economic'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMapLayer(m)}
              className="px-2.5 py-1 rounded text-xs font-bold cursor-pointer whitespace-nowrap capitalize"
              style={mapLayer === m ? { background: '#a78bfa25', color: '#a78bfa' } : { color: '#6b7a95' }}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="w-px h-6" style={{ background: 'rgba(255,255,255,0.06)' }}></div>

        {/* Toggle buttons */}
        {[
          { label: 'Fleets', active: showFleets, toggle: () => setShowFleets((v) => !v), icon: 'ri-rocket-2-line' },
          { label: 'Lanes', active: showHyperlanes, toggle: () => setShowHyperlanes((v) => !v), icon: 'ri-share-line' },
          { label: 'Empires', active: showEmpireList, toggle: () => setShowEmpireList((v) => !v), icon: 'ri-flag-line' },
        ].map((t) => (
          <button
            key={t.label}
            onClick={t.toggle}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
            style={t.active ? { background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#6b7a95' }}
          >
            <i className={`${t.icon} text-xs`}></i>
            {t.label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => zoom(-1)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all">
              <i className="ri-subtract-line text-xs"></i>
            </button>
            <span className="px-2 text-xs font-mono text-gray-400" style={{ minWidth: 42, textAlign: 'center' }}>{Math.round(scale * 100)}%</span>
            <button onClick={() => zoom(1)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all">
              <i className="ri-add-line text-xs"></i>
            </button>
          </div>

          <button
            onClick={focusCapital}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}
          >
            <i className="ri-crosshair-2-line mr-1"></i>Capital
          </button>

          <button
            onClick={resetView}
            className="px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#6b7a95' }}
          >
            <i className="ri-refresh-line text-xs"></i>
          </button>

          {filterEmpire && (
            <button
              onClick={() => setFilterEmpire(null)}
              className="px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap cursor-pointer font-semibold"
              style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171' }}
            >
              <i className="ri-close-line mr-1"></i>Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* ── GALACTIC EVENTS TICKER ──────────────────────── */}
      <GalacticTicker />
      <CommandRibbon activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      {/* ── MAIN CONTENT ROW ────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT: EMPIRE LIST ─────────────────────────── */}
        {showEmpireList && (
          <div
            className="flex flex-col flex-shrink-0 overflow-hidden"
            style={{
              width: 220,
              background: 'rgba(2,5,15,0.98)',
              borderRight: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div className="px-3 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Empires</p>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {Object.values(EMPIRES).map((emp) => {
                const isSelected = selectedEmpire?.id === emp.id;
                const isFiltered = filterEmpire === emp.id;
                const diploStatus = emp.id !== 'player' ? EMPIRES.player.diplomacy[emp.id] : null;
                const d = diploStatus ? DIPLO_LABEL[diploStatus] : null;

                return (
                  <button
                    key={emp.id}
                    onClick={() => setSelectedEmpire(isSelected ? null : emp)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-all text-left"
                    style={{
                      background: isSelected ? `${emp.color}12` : isFiltered ? `${emp.color}08` : 'transparent',
                      borderLeft: `3px solid ${isSelected || isFiltered ? emp.color : 'transparent'}`,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${emp.color}18`, border: `1.5px solid ${emp.color}40` }}
                    >
                      <i className={`${emp.flag} text-base`} style={{ color: emp.color }}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{emp.name}</p>
                      <p className="text-xs truncate" style={{ color: '#4a5568', fontSize: 10 }}>{emp.systems} sys</p>
                    </div>
                    {d && (
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: d.color, boxShadow: `0 0 4px ${d.color}` }}
                        title={d.label}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="px-3 py-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-xs text-gray-600 uppercase tracking-wider mb-2" style={{ fontSize: 9 }}>Relations</p>
              {[
                { color: '#00d4ff', label: 'Ally' },
                { color: '#fbbf24', label: 'NAP' },
                { color: '#f87171', label: 'Rival' },
                { color: '#ff2222', label: 'At War' },
                { color: '#6b7a95', label: 'Neutral' },
              ].map((r) => (
                <div key={r.label} className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.color }}></div>
                  <span className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>{r.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CENTER: MAP VIEWPORT ──────────────────────── */}
        <div
          ref={containerRef}
          className="flex-1 relative overflow-hidden select-none"
          style={{ background: bgColors[mapLayer], cursor: isDragging.current ? 'grabbing' : 'grab' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onWheel={onWheel}
        >
          {/* Background nebula decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute" style={{ width: 400, height: 300, left: '10%', top: '15%', background: 'radial-gradient(ellipse, rgba(167,139,250,0.04) 0%, transparent 70%)', borderRadius: '50%' }} />
            <div className="absolute" style={{ width: 350, height: 250, right: '15%', top: '30%', background: 'radial-gradient(ellipse, rgba(248,113,113,0.04) 0%, transparent 70%)', borderRadius: '50%' }} />
            <div className="absolute" style={{ width: 300, height: 200, left: '40%', bottom: '20%', background: 'radial-gradient(ellipse, rgba(0,212,255,0.03) 0%, transparent 70%)', borderRadius: '50%' }} />
          </div>

          {/* Scrollable/pannable content */}
          <div
            className="absolute"
            style={{
              transform: `translate(${offsetX * scale}px, ${offsetY * scale}px) scale(${scale})`,
              transformOrigin: '0 0',
              width: MAP_W,
              height: MAP_H,
            }}
          >
            {/* Hyperlane SVG layer */}
            {showHyperlanes && (
              <HyperlanesLayer
                systems={STAR_SYSTEMS}
                scale={scale}
                selectedEmpire={filterEmpire}
                warSystems={warSystems}
              />
            )}

            {/* Starmap territory fills */}
            {mapLayer === 'political' && STAR_SYSTEMS.map((sys) => {
              const emp = getEmpireForSystem(sys);
              if (!emp) return null;
              return (
                <div
                  key={`territory-${sys.id}`}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    left: sys.x,
                    top: sys.y,
                    width: 90,
                    height: 90,
                    transform: 'translate(-50%, -50%)',
                    background: `radial-gradient(circle, ${emp.color}14 0%, ${emp.color}06 50%, transparent 80%)`,
                  }}
                />
              );
            })}

            {/* Fleet markers */}
            {showFleets && <FleetMarkersLayer fleets={fleets} scale={scale} />}

            {/* Star systems */}
            {STAR_SYSTEMS.map((sys) => (
              <StarNode
                key={sys.id}
                sys={sys}
                scale={scale}
                selected={selectedSystem?.id === sys.id}
                dimmed={isDimmed(sys)}
                onSelect={handleSelectSystem}
                onContextMenu={handleContextMenu}
              />
            ))}
          </div>

          {/* Map coordinates overlay */}
          <div className="absolute bottom-24 right-4 text-xs" style={{ color: 'rgba(0,212,255,0.2)', fontFamily: 'monospace', textAlign: 'right' }}>
            <div>Scale: {scale.toFixed(2)}×</div>
            <div>Systems: {STAR_SYSTEMS.length}</div>
          </div>

          {/* Minimap */}
          {containerRef.current && (
            <div className="absolute bottom-24 left-4 z-20">
              <Minimap
                systems={STAR_SYSTEMS}
                viewX={-offsetX}
                viewY={-offsetY}
                viewW={(containerRef.current?.clientWidth ?? 800) / scale}
                viewH={(containerRef.current?.clientHeight ?? 600) / scale}
                mapW={MAP_W}
                mapH={MAP_H}
              />
            </div>
          )}

          {/* War zone indicator banner */}
          {warSystems.size > 0 && (
            <div
              className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: 'rgba(255,30,30,0.12)',
                border: '1px solid rgba(255,50,50,0.35)',
                color: '#ff6060',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 0 20px rgba(255,50,50,0.12)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0"></span>
              {warSystems.size} ACTIVE WAR ZONES — Iron Pact vs. Void Collective, Nexus Dominion vs. Void Collective
            </div>
          )}

          <ViewportControlCluster
            mapLayer={mapLayer}
            showFleets={showFleets}
            showHyperlanes={showHyperlanes}
            showEmpireList={showEmpireList}
          />
        </div>

        {/* ── RIGHT: EMPIRE DETAIL PANEL ────────────────── */}
        {selectedEmpire && (
          <EmpirePanel
            empire={selectedEmpire}
            onClose={() => setSelectedEmpire(null)}
            onFilter={(id) => {
              setFilterEmpire(id);
              setSelectedEmpire(null);
            }}
          />
        )}
      </div>

      {/* ── BOTTOM INFO BAR ─────────────────────────────── */}
      <div className="relative flex-shrink-0" style={{ height: selectedSystem ? 90 : 72 }}>
        <BottomInfoBar system={selectedSystem} />
      </div>

      {/* ── CONTEXT MENU ────────────────────────────────── */}
      {contextMenu && (
        <ContextMenu
          system={contextMenu.sys}
          pos={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
