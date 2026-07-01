import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGameNotifications,
  GameNotification,
  NotificationType,
} from '../../hooks/useGameNotifications';

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function timeAgo(ts: number): string {
  const sec = Math.floor((Date.now() - ts) / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00';
  const totalSec = Math.ceil(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const HAS_ETA_TYPES: NotificationType[] = [
  'attack_incoming',
  'fleet_arrival',
  'fleet_return',
  'fleet_departure',
];

/* ─────────────────────────────────────────────
   COUNTDOWN TIMER COMPONENT
───────────────────────────────────────────── */
interface CountdownTimerProps {
  eta: number;
  startTime: number;
  type: NotificationType;
}

function CountdownTimer({ eta, startTime, type }: CountdownTimerProps) {
  const isAttack = type === 'attack_incoming';
  const color = isAttack ? '#f87171' : type === 'fleet_return' ? '#34d399' : '#00d4ff';
  const bgColor = isAttack ? 'rgba(248,113,113,0.1)' : 'rgba(0,212,255,0.08)';
  const borderColor = isAttack ? 'rgba(248,113,113,0.3)' : 'rgba(0,212,255,0.2)';

  const [remaining, setRemaining] = useState(() => Math.max(0, eta - Date.now()));
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const tick = () => {
      const r = Math.max(0, eta - Date.now());
      setRemaining(r);
      forceUpdate((v) => v + 1);
    };
    const id = setInterval(tick, 1000);
    tick();
    return () => clearInterval(id);
  }, [eta]);

  const total = Math.max(1, eta - startTime);
  const elapsed = Math.min(total, Date.now() - startTime);
  const progress = Math.min(100, (elapsed / total) * 100);
  const expired = remaining <= 0;

  // Status labels
  const statusLabel = expired
    ? isAttack
      ? 'IMPACT'
      : type === 'fleet_departure'
      ? 'DEPARTED'
      : 'ARRIVED'
    : isAttack
    ? 'IMPACT IN'
    : type === 'fleet_return'
    ? 'ETA'
    : 'ARRIVES IN';

  return (
    <div
      className="mt-2 rounded-md overflow-hidden"
      style={{ background: bgColor, border: `1px solid ${borderColor}` }}
    >
      {/* Timer row */}
      <div className="flex items-center justify-between px-2.5 py-1.5">
        <div className="flex items-center gap-1.5">
          <i
            className={`${isAttack ? 'ri-alarm-warning-line' : 'ri-timer-line'} text-xs`}
            style={{ color }}
          ></i>
          <span
            className="font-bold tracking-wide"
            style={{ color: '#8892aa', fontSize: 9, letterSpacing: '0.08em' }}
          >
            {statusLabel}
          </span>
        </div>

        {expired ? (
          <span
            className="font-black tracking-widest"
            style={{
              color,
              fontSize: 11,
              animation: 'pulse 1s infinite',
            }}
          >
            {statusLabel}
          </span>
        ) : (
          <span
            className="font-black tabular-nums"
            style={{
              color,
              fontSize: 13,
              fontFamily: '"Courier New", monospace',
              letterSpacing: '0.05em',
              textShadow: `0 0 8px ${color}80`,
            }}
          >
            {formatCountdown(remaining)}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative h-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div
          className="absolute left-0 top-0 h-full transition-all"
          style={{
            width: `${progress}%`,
            background: expired
              ? color
              : isAttack
              ? `linear-gradient(90deg, #ef4444, #f87171)`
              : `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: expired ? `0 0 6px ${color}` : undefined,
          }}
        ></div>

        {/* Animated shimmer on the leading edge */}
        {!expired && (
          <div
            className="absolute top-0 h-full w-4 rounded-full"
            style={{
              left: `calc(${progress}% - 8px)`,
              background: `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)`,
              opacity: 0.8,
            }}
          ></div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FILTER TABS
───────────────────────────────────────────── */
const FILTER_TABS = [
  { id: 'all',    label: 'All',    icon: 'ri-list-unordered' },
  { id: 'attack', label: 'Combat', icon: 'ri-alarm-warning-line' },
  { id: 'fleet',  label: 'Fleet',  icon: 'ri-rocket-2-line' },
  { id: 'build',  label: 'Build',  icon: 'ri-building-2-line' },
  { id: 'other',  label: 'Other',  icon: 'ri-more-line' },
] as const;
type FilterTab = (typeof FILTER_TABS)[number]['id'];

function matchesTab(n: GameNotification, tab: FilterTab): boolean {
  if (tab === 'all') return true;
  if (tab === 'attack') return ['attack_incoming', 'attack_repelled', 'attack_received', 'espionage'].includes(n.type);
  if (tab === 'fleet')  return ['fleet_arrival', 'fleet_departure', 'fleet_return'].includes(n.type);
  if (tab === 'build')  return ['build_complete', 'research_complete', 'ship_built'].includes(n.type);
  return ['resource_full', 'quest_complete', 'alliance', 'system'].includes(n.type);
}

const PRIORITY_RING: Record<GameNotification['priority'], string> = {
  low:      'rgba(148,163,184,0.3)',
  medium:   'rgba(0,212,255,0.4)',
  high:     'rgba(251,191,36,0.5)',
  critical: 'rgba(248,113,113,0.7)',
};

const TYPE_ROUTE: Partial<Record<NotificationType, string>> = {
  fleet_arrival:     '/fleet',
  fleet_departure:   '/fleet',
  fleet_return:      '/fleet',
  build_complete:    '/buildings',
  research_complete: '/research',
  ship_built:        '/shipyard',
  attack_incoming:   '/war-room',
  attack_repelled:   '/war-room',
  attack_received:   '/war-room',
  espionage:         '/espionage',
  resource_full:     '/storage',
  quest_complete:    '/quests',
  alliance:          '/alliance',
};

/* ─────────────────────────────────────────────
   NOTIFICATION ROW
───────────────────────────────────────────── */
interface NotifRowProps {
  n: GameNotification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate: (n: GameNotification) => void;
}

function NotifRow({ n, onRead, onDelete, onNavigate }: NotifRowProps) {
  const hasCountdown = n.eta !== undefined && HAS_ETA_TYPES.includes(n.type);
  const isAttack = n.type === 'attack_incoming';

  // Pulse the entire row for critical unread attacks
  const rowPulse = isAttack && !n.read;

  return (
    <div
      className="relative flex items-start gap-3 px-4 py-3 cursor-pointer group transition-all"
      style={{
        background: n.read
          ? 'transparent'
          : rowPulse
          ? 'rgba(248,113,113,0.05)'
          : `${n.color}08`,
        borderLeft: `3px solid ${n.read ? 'transparent' : n.color}`,
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        animation: rowPulse ? 'attackPulse 2s ease-in-out infinite' : undefined,
      }}
      onClick={() => { onRead(n.id); onNavigate(n); }}
    >
      {/* Icon */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
        style={{
          background: `${n.color}18`,
          border: `1px solid ${PRIORITY_RING[n.priority]}`,
          flexShrink: 0,
        }}
      >
        <i className={`${n.icon} text-sm`} style={{ color: n.color }}></i>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title row */}
        <div className="flex items-center gap-2">
          <p
            className="text-xs font-semibold leading-tight truncate"
            style={{ color: n.read ? '#6b7a95' : '#dde4f0' }}
          >
            {n.title}
          </p>
          {n.priority === 'critical' && !n.read && (
            <span
              className="px-1.5 rounded-full flex-shrink-0 font-black tracking-widest"
              style={{ background: '#ef444430', color: '#f87171', fontSize: 8 }}
            >
              URGENT
            </span>
          )}
        </div>

        {/* Message */}
        <p
          className="text-xs leading-snug mt-0.5"
          style={{ color: n.read ? '#4a5568' : '#7a8599', fontSize: 11 }}
        >
          {n.message}
        </p>

        {/* Countdown timer */}
        {hasCountdown && n.eta && (
          <CountdownTimer eta={n.eta} startTime={n.timestamp} type={n.type} />
        )}

        {/* Timestamp */}
        <p className="text-xs mt-1.5" style={{ color: '#2d3748', fontSize: 10 }}>
          {timeAgo(n.timestamp)}
        </p>
      </div>

      {/* Unread dot */}
      {!n.read && (
        <div
          className="flex-shrink-0 w-2 h-2 rounded-full mt-1.5"
          style={{ background: n.color, boxShadow: `0 0 6px ${n.color}` }}
        ></div>
      )}

      {/* Delete */}
      <button
        className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
        style={{ color: '#4a5568' }}
        onClick={(e) => { e.stopPropagation(); onDelete(n.id); }}
      >
        <i className="ri-close-line text-xs"></i>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN BELL COMPONENT
───────────────────────────────────────────── */
export default function NotificationBell() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } =
    useGameNotifications();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<FilterTab>('all');
  const [pulse, setPulse] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const prevUnread = useRef(unreadCount);

  // Bell bounce on new notification
  useEffect(() => {
    if (unreadCount > prevUnread.current) {
      setPulse(true);
      setTimeout(() => setPulse(false), 1200);
    }
    prevUnread.current = unreadCount;
  }, [unreadCount]);

  // Close on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const filtered = notifications.filter((n) => matchesTab(n, tab));
  const tabCounts = useCallback(
    (t: FilterTab) => notifications.filter((n) => !n.read && matchesTab(n, t)).length,
    [notifications]
  );

  const handleNavigate = (n: GameNotification) => {
    const route = TYPE_ROUTE[n.type];
    if (route) { setOpen(false); navigate(route); }
  };

  // Count notifications that have live countdowns
  const activeCountdowns = notifications.filter(
    (n) => n.eta && n.eta > Date.now() && HAS_ETA_TYPES.includes(n.type)
  ).length;

  return (
    <div ref={panelRef} className="relative flex-shrink-0">
      {/* ── Bell button ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`relative flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer transition-all ${
          pulse ? 'animate-bounce' : ''
        }`}
        style={{
          background: open ? 'rgba(0,212,255,0.12)' : 'transparent',
          border: `1px solid ${open ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
          color: open ? '#00d4ff' : '#8892aa',
        }}
      >
        <i className={`ri-notification-${unreadCount > 0 ? '3' : '2'}-line text-base`}></i>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full font-bold"
            style={{
              minWidth: unreadCount > 9 ? 18 : 16,
              height: 16,
              background: '#ef4444',
              color: '#fff',
              fontSize: 9,
              lineHeight: 1,
              padding: '0 3px',
              boxShadow: '0 0 8px rgba(239,68,68,0.6)',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Countdown activity indicator (small cyan dot) */}
        {activeCountdowns > 0 && unreadCount === 0 && (
          <span
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
            style={{ background: '#00d4ff', boxShadow: '0 0 6px #00d4ff' }}
          ></span>
        )}
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden z-50 flex flex-col"
          style={{
            width: 372,
            maxHeight: 580,
            background: '#07111e',
            border: '1px solid rgba(0,212,255,0.2)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.85), 0 0 40px rgba(0,212,255,0.04)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}
          >
            <div className="flex items-center gap-2">
              <i className="ri-notification-3-line text-sm" style={{ color: '#00d4ff' }}></i>
              <span className="text-sm font-bold" style={{ color: '#dde4f0' }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171' }}
                >
                  {unreadCount} new
                </span>
              )}
              {activeCountdowns > 0 && (
                <span
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}
                >
                  <i className="ri-timer-line" style={{ fontSize: 10 }}></i>
                  {activeCountdowns} live
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs cursor-pointer hover:opacity-70 transition-opacity whitespace-nowrap"
                  style={{ color: '#00d4ff' }}
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs cursor-pointer hover:opacity-70 transition-opacity"
                  style={{ color: '#374151' }}
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Filter tabs */}
          <div
            className="flex items-center px-3 py-2 gap-1 flex-shrink-0 overflow-x-auto"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', scrollbarWidth: 'none' }}
          >
            {FILTER_TABS.map((ft) => {
              const cnt = tabCounts(ft.id);
              const active = tab === ft.id;
              return (
                <button
                  key={ft.id}
                  onClick={() => setTab(ft.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition-all"
                  style={{
                    background: active ? 'rgba(0,212,255,0.15)' : 'transparent',
                    color: active ? '#00d4ff' : '#6b7a95',
                    border: `1px solid ${active ? 'rgba(0,212,255,0.3)' : 'transparent'}`,
                    fontSize: 11,
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  <i className={`${ft.icon} text-xs`}></i>
                  {ft.label}
                  {cnt > 0 && (
                    <span
                      className="px-1 rounded-full font-bold"
                      style={{ background: 'rgba(239,68,68,0.3)', color: '#f87171', fontSize: 9 }}
                    >
                      {cnt}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Notification list */}
          <div
            className="flex-1 overflow-y-auto"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,212,255,0.15) transparent' }}
          >
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)' }}
                >
                  <i className="ri-notification-off-line text-xl" style={{ color: '#374151' }}></i>
                </div>
                <p className="text-xs" style={{ color: '#374151' }}>
                  No notifications in this category
                </p>
              </div>
            ) : (
              filtered.map((n) => (
                <NotifRow
                  key={n.id}
                  n={n}
                  onRead={markAsRead}
                  onDelete={deleteNotification}
                  onNavigate={handleNavigate}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div
            className="flex-shrink-0 px-4 py-2.5 flex items-center justify-between"
            style={{ borderTop: '1px solid rgba(0,212,255,0.08)' }}
          >
            <span className="text-xs" style={{ color: '#2d3748' }}>
              {notifications.length} total · {unreadCount} unread
            </span>
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: '#22c55e', boxShadow: '0 0 5px #22c55e' }}
              ></div>
              <span className="text-xs" style={{ color: '#374151' }}>Live</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Keyframes injected once ── */}
      <style>{`
        @keyframes attackPulse {
          0%, 100% { background-color: rgba(248,113,113,0.05); }
          50%       { background-color: rgba(248,113,113,0.10); }
        }
      `}</style>
    </div>
  );
}
