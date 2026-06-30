import { useState, useEffect, useCallback, useRef } from 'react';

export type NotificationType =
  | 'fleet_arrival'
  | 'fleet_departure'
  | 'fleet_return'
  | 'build_complete'
  | 'research_complete'
  | 'ship_built'
  | 'attack_incoming'
  | 'attack_repelled'
  | 'attack_received'
  | 'espionage'
  | 'resource_full'
  | 'quest_complete'
  | 'alliance'
  | 'system';

export interface GameNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  /** Unix ms when the event actually lands (fleet arrives / attack hits).
   *  Only present on fleet_arrival, fleet_return, fleet_departure, attack_incoming. */
  eta?: number;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  icon: string;
  color: string;
}

const TYPE_META: Record<
  NotificationType,
  { icon: string; color: string; defaultPriority: GameNotification['priority'] }
> = {
  fleet_arrival:     { icon: 'ri-rocket-2-line',        color: '#00d4ff', defaultPriority: 'medium' },
  fleet_departure:   { icon: 'ri-rocket-2-fill',        color: '#38bdf8', defaultPriority: 'low' },
  fleet_return:      { icon: 'ri-arrow-go-back-line',   color: '#34d399', defaultPriority: 'medium' },
  build_complete:    { icon: 'ri-building-2-line',      color: '#4ade80', defaultPriority: 'medium' },
  research_complete: { icon: 'ri-flask-fill',           color: '#a78bfa', defaultPriority: 'medium' },
  ship_built:        { icon: 'ri-space-ship-line',      color: '#60a5fa', defaultPriority: 'low' },
  attack_incoming:   { icon: 'ri-alarm-warning-fill',   color: '#f87171', defaultPriority: 'critical' },
  attack_repelled:   { icon: 'ri-shield-check-line',    color: '#fbbf24', defaultPriority: 'high' },
  attack_received:   { icon: 'ri-sword-line',           color: '#ef4444', defaultPriority: 'high' },
  espionage:         { icon: 'ri-user-search-line',             color: '#f472b6', defaultPriority: 'high' },
  resource_full:     { icon: 'ri-archive-2-line',       color: '#fb923c', defaultPriority: 'low' },
  quest_complete:    { icon: 'ri-trophy-line',          color: '#fcd34d', defaultPriority: 'medium' },
  alliance:          { icon: 'ri-shield-star-line',     color: '#fbbf24', defaultPriority: 'medium' },
  system:            { icon: 'ri-information-line',     color: '#94a3b8', defaultPriority: 'low' },
};

/* ── SEED DATA  (etaOffsetMs = ms from notification creation → event fires) ── */
interface SeedEntry extends Omit<GameNotification, 'id' | 'timestamp' | 'read'> {
  etaOffsetMs?: number;
}

const MOCK_SEED: SeedEntry[] = [
  {
    type: 'attack_incoming',
    title: 'Incoming Attack!',
    message: 'Enemy fleet detected — ETA 4 min to Kepler IV. Scramble defenses now!',
    priority: 'critical',
    icon: TYPE_META.attack_incoming.icon,
    color: TYPE_META.attack_incoming.color,
    etaOffsetMs: 4 * 60_000,
  },
  {
    type: 'fleet_arrival',
    title: 'Fleet En Route',
    message: 'Battle Group Alpha inbound to Proxima Centauri B — 12 destroyers, 4 cruisers.',
    priority: 'medium',
    icon: TYPE_META.fleet_arrival.icon,
    color: TYPE_META.fleet_arrival.color,
    etaOffsetMs: 9 * 60_000,
  },
  {
    type: 'build_complete',
    title: 'Construction Complete',
    message: 'Metal Mine Level 8 finished on Kepler IV. Production +340/hr.',
    priority: 'medium',
    icon: TYPE_META.build_complete.icon,
    color: TYPE_META.build_complete.color,
  },
  {
    type: 'research_complete',
    title: 'Research Complete',
    message: 'Quantum Drive Technology Level 5 unlocked. Fleet speed +25%.',
    priority: 'medium',
    icon: TYPE_META.research_complete.icon,
    color: TYPE_META.research_complete.color,
  },
  {
    type: 'attack_repelled',
    title: 'Attack Repelled',
    message: 'Pirate raiders repelled at Sector 7-G. Defense turrets destroyed 28 ships.',
    priority: 'high',
    icon: TYPE_META.attack_repelled.icon,
    color: TYPE_META.attack_repelled.color,
  },
  {
    type: 'fleet_return',
    title: 'Fleet Returning',
    message: 'Raiding Squad Omega returning from Delta Vega. Carrying 45,000 Metal.',
    priority: 'medium',
    icon: TYPE_META.fleet_return.icon,
    color: TYPE_META.fleet_return.color,
    etaOffsetMs: 18 * 60_000,
  },
  {
    type: 'fleet_arrival',
    title: 'Strike Force Inbound',
    message: 'Strike Force Zeta approaching Sector 9 — full battle complement.',
    priority: 'medium',
    icon: TYPE_META.fleet_arrival.icon,
    color: TYPE_META.fleet_arrival.color,
    etaOffsetMs: 22 * 60_000,
  },
  {
    type: 'attack_incoming',
    title: 'Hostile Fleet Detected!',
    message: 'Commander Varex\'s dreadnought spotted — trajectory: Nova Prime.',
    priority: 'critical',
    icon: TYPE_META.attack_incoming.icon,
    color: TYPE_META.attack_incoming.color,
    etaOffsetMs: 7 * 60_000,
  },
  {
    type: 'ship_built',
    title: 'Ships Constructed',
    message: 'Shipyard: 5× Battlecruiser, 12× Interceptor ready for deployment.',
    priority: 'low',
    icon: TYPE_META.ship_built.icon,
    color: TYPE_META.ship_built.color,
  },
  {
    type: 'espionage',
    title: 'Espionage Report',
    message: 'Probe returned from Commander Varex\'s homeworld. Intel ready.',
    priority: 'high',
    icon: TYPE_META.espionage.icon,
    color: TYPE_META.espionage.color,
  },
  {
    type: 'resource_full',
    title: 'Storage Nearly Full',
    message: 'Crystal storage on Kepler IV at 95%. Consider upgrading or trading.',
    priority: 'low',
    icon: TYPE_META.resource_full.icon,
    color: TYPE_META.resource_full.color,
  },
  {
    type: 'quest_complete',
    title: 'Quest Completed!',
    message: '"Expanding the Empire" done. Reward: 50,000 IGC + Epic Blueprint Fragment.',
    priority: 'medium',
    icon: TYPE_META.quest_complete.icon,
    color: TYPE_META.quest_complete.color,
  },
  {
    type: 'alliance',
    title: 'Alliance Message',
    message: 'Commander Zephyr requests an emergency military aid pact.',
    priority: 'medium',
    icon: TYPE_META.alliance.icon,
    color: TYPE_META.alliance.color,
  },
  {
    type: 'build_complete',
    title: 'Defense Built',
    message: 'Plasma Cannon Battery Level 3 online on New Horizon. +520 defense.',
    priority: 'medium',
    icon: TYPE_META.build_complete.icon,
    color: TYPE_META.build_complete.color,
  },
];

/* ── LIVE EVENT POOL ─────────────────────────── */
interface PoolEntry extends Omit<GameNotification, 'id' | 'timestamp' | 'read'> {
  etaOffsetMsRange?: [number, number]; // random range [min, max]
}

const LIVE_EVENT_POOL: PoolEntry[] = [
  {
    type: 'fleet_arrival',
    title: 'Fleet En Route',
    message: 'Strike Force Gamma inbound to target system — full complement.',
    priority: 'medium',
    icon: TYPE_META.fleet_arrival.icon,
    color: TYPE_META.fleet_arrival.color,
    etaOffsetMsRange: [5 * 60_000, 20 * 60_000],
  },
  {
    type: 'attack_incoming',
    title: 'Incoming Attack!',
    message: 'Hostile fleet detected — heading toward Nova Prime!',
    priority: 'critical',
    icon: TYPE_META.attack_incoming.icon,
    color: TYPE_META.attack_incoming.color,
    etaOffsetMsRange: [2 * 60_000, 8 * 60_000],
  },
  {
    type: 'attack_incoming',
    title: 'Hostile Battleship Incoming!',
    message: 'Unidentified dreadnought on intercept course — Vega Outpost at risk.',
    priority: 'critical',
    icon: TYPE_META.attack_incoming.icon,
    color: TYPE_META.attack_incoming.color,
    etaOffsetMsRange: [3 * 60_000, 6 * 60_000],
  },
  {
    type: 'build_complete',
    title: 'Upgrade Complete',
    message: 'Crystal Mine Level 10 finished. Production +580 crystal/hr.',
    priority: 'medium',
    icon: TYPE_META.build_complete.icon,
    color: TYPE_META.build_complete.color,
  },
  {
    type: 'ship_built',
    title: 'Fleet Ready',
    message: 'Shipyard completed 8× Heavy Cruisers. Ready for deployment.',
    priority: 'low',
    icon: TYPE_META.ship_built.icon,
    color: TYPE_META.ship_built.color,
  },
  {
    type: 'fleet_return',
    title: 'Fleet Returning',
    message: 'Patrol Wing Bravo returning to base.',
    priority: 'medium',
    icon: TYPE_META.fleet_return.icon,
    color: TYPE_META.fleet_return.color,
    etaOffsetMsRange: [8 * 60_000, 30 * 60_000],
  },
  {
    type: 'fleet_arrival',
    title: 'Reinforcements Inbound',
    message: 'Alliance reinforcement fleet en route to your position.',
    priority: 'medium',
    icon: TYPE_META.fleet_arrival.icon,
    color: TYPE_META.fleet_arrival.color,
    etaOffsetMsRange: [10 * 60_000, 25 * 60_000],
  },
  {
    type: 'research_complete',
    title: 'Research Done',
    message: 'Ion Drive Level 7 completed. All fleets +18% faster.',
    priority: 'medium',
    icon: TYPE_META.research_complete.icon,
    color: TYPE_META.research_complete.color,
  },
  {
    type: 'espionage',
    title: 'Spy Report Ready',
    message: 'Infiltration probe returned from Sector 12. New intelligence available.',
    priority: 'high',
    icon: TYPE_META.espionage.icon,
    color: TYPE_META.espionage.color,
  },
  {
    type: 'attack_repelled',
    title: 'Attack Repelled',
    message: 'Defenses held. Enemy fleet destroyed at Vega Station.',
    priority: 'high',
    icon: TYPE_META.attack_repelled.icon,
    color: TYPE_META.attack_repelled.color,
  },
];

/* ── utils ───────────────────────────────────── */
function makeId() {
  return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildFromSeed(entry: SeedEntry, offsetMs = 0): GameNotification {
  const timestamp = Date.now() - offsetMs;
  const eta = entry.etaOffsetMs !== undefined ? timestamp + entry.etaOffsetMs : undefined;
  return { ...entry, id: makeId(), timestamp, eta, read: false };
}

function buildFromPool(entry: PoolEntry): GameNotification {
  const timestamp = Date.now();
  let eta: number | undefined;
  if (entry.etaOffsetMsRange) {
    const [min, max] = entry.etaOffsetMsRange;
    eta = timestamp + min + Math.random() * (max - min);
  }
  const { etaOffsetMsRange: _r, ...base } = entry;
  return { ...base, id: makeId(), timestamp, eta, read: false };
}

/* ── hook ────────────────────────────────────── */
export function useGameNotifications() {
  const [notifications, setNotifications] = useState<GameNotification[]>(() =>
    MOCK_SEED.map((entry, i) => buildFromSeed(entry, i * 2 * 60_000))
  );

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const schedule = () => {
      const delay = 25_000 + Math.random() * 35_000;
      timerRef.current = setTimeout(() => {
        const base = LIVE_EVENT_POOL[Math.floor(Math.random() * LIVE_EVENT_POOL.length)];
        const newNotif = buildFromPool(base);
        setNotifications((prev) => [newNotif, ...prev].slice(0, 80));
        schedule();
      }, delay);
    };
    schedule();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const pushNotification = useCallback(
    (type: NotificationType, title: string, message: string, etaMs?: number) => {
      const meta = TYPE_META[type];
      const n: GameNotification = {
        id: makeId(),
        type,
        title,
        message,
        timestamp: Date.now(),
        eta: etaMs,
        read: false,
        priority: meta.defaultPriority,
        icon: meta.icon,
        color: meta.color,
      };
      setNotifications((prev) => [n, ...prev].slice(0, 80));
    },
    []
  );

  return { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll, pushNotification };
}
