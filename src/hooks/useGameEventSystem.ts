import { useState, useEffect, useCallback, useRef } from 'react';

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
export type GameEventType =
  | 'fleet_arrived'
  | 'fleet_departed'
  | 'fleet_combat'
  | 'planet_colonized'
  | 'research_complete'
  | 'building_complete'
  | 'resource_collected'
  | 'pirate_attack'
  | 'world_boss_spawn'
  | 'diplomatic_offer'
  | 'trade_route_established'
  | 'anomaly_discovered'
  | 'sector_contested'
  | 'alliance_war_declared'
  | 'cosmic_event';

export interface GameEvent {
  id: string;
  type: GameEventType;
  title: string;
  description: string;
  timestamp: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  icon: string;
  color: string;
  coordinates?: string;
  dismissed: boolean;
  actionLabel?: string;
  actionPath?: string;
  data?: Record<string, any>;
}

export interface FleetMovement {
  id: string;
  name: string;
  mission: string;
  origin: string;
  destination: string;
  ships: number;
  departedAt: number;
  arrivalAt: number;
  returnAt?: number;
  status: 'traveling' | 'arrived' | 'returning' | 'recalled';
  cargo?: { metal: number; crystal: number; deuterium: number };
  missionColor: string;
}

export interface GameClock {
  tick: number;
  speed: number; // 1-4
  paused: boolean;
  realTime: number;
  gameTime: number; // in-game seconds elapsed
}

/* ─────────────────────────────────────────────
   EVENT TEMPLATES
───────────────────────────────────────────── */
const EVENT_TEMPLATES: Omit<GameEvent, 'id' | 'timestamp' | 'dismissed'>[] = [
  {
    type: 'fleet_arrived',
    title: 'Fleet Arrived',
    description: 'Attack Fleet Alpha has arrived at [3:421:9] and is engaging enemy forces.',
    priority: 'high',
    icon: 'ri-rocket-2-line',
    color: '#f87171',
    coordinates: '[3:421:9]',
    actionLabel: 'View Fleet',
    actionPath: '/fleet',
  },
  {
    type: 'research_complete',
    title: 'Research Complete',
    description: 'Quantum Computing Core Level 88 research has been completed.',
    priority: 'medium',
    icon: 'ri-flask-line',
    color: '#a78bfa',
    actionLabel: 'View Research',
    actionPath: '/research',
  },
  {
    type: 'building_complete',
    title: 'Building Complete',
    description: 'Metal Mine Level 25 construction finished on Homeworld Alpha.',
    priority: 'low',
    icon: 'ri-building-2-line',
    color: '#fbbf24',
    actionLabel: 'View Buildings',
    actionPath: '/buildings',
  },
  {
    type: 'pirate_attack',
    title: 'Pirate Attack!',
    description: 'Pirate fleet detected approaching Mining Colony Beta. Defenses engaged.',
    priority: 'critical',
    icon: 'ri-skull-2-line',
    color: '#f87171',
    coordinates: '[1:234:12]',
    actionLabel: 'Defend',
    actionPath: '/defense',
  },
  {
    type: 'world_boss_spawn',
    title: 'World Boss Spawned',
    description: 'The Void Leviathan has appeared in sector G-7. Coordinate with your alliance!',
    priority: 'critical',
    icon: 'ri-skull-fill',
    color: '#f472b6',
    actionLabel: 'View Boss',
    actionPath: '/world-bosses',
  },
  {
    type: 'diplomatic_offer',
    title: 'Diplomatic Offer',
    description: 'The Iron Federation has proposed a non-aggression pact.',
    priority: 'high',
    icon: 'ri-shake-hands-line',
    color: '#60a5fa',
    actionLabel: 'View Diplomacy',
    actionPath: '/diplomacy',
  },
  {
    type: 'anomaly_discovered',
    title: 'Anomaly Discovered',
    description: 'Exploration probe detected a temporal anomaly at [5:178:3]. Investigate for rewards.',
    priority: 'medium',
    icon: 'ri-focus-3-line',
    color: '#f472b6',
    coordinates: '[5:178:3]',
    actionLabel: 'Investigate',
    actionPath: '/universe',
  },
  {
    type: 'sector_contested',
    title: 'Sector Contested',
    description: 'Void Collective forces are contesting sector D-4. Deploy fleets to defend.',
    priority: 'high',
    icon: 'ri-alarm-warning-line',
    color: '#f87171',
    actionLabel: 'View Sectors',
    actionPath: '/sectors',
  },
  {
    type: 'trade_route_established',
    title: 'Trade Route Active',
    description: 'Trade route to Merchant Guild hub is now generating 12,000 credits/hour.',
    priority: 'low',
    icon: 'ri-route-line',
    color: '#34d399',
    actionLabel: 'View Routes',
    actionPath: '/trade-routes',
  },
  {
    type: 'cosmic_event',
    title: 'Cosmic Storm',
    description: 'A massive ion storm is sweeping through sectors B-2 to C-5. Fleet speed reduced by 30%.',
    priority: 'medium',
    icon: 'ri-thunderstorms-line',
    color: '#fbbf24',
    actionLabel: 'View Universe',
    actionPath: '/universe',
  },
  {
    type: 'fleet_combat',
    title: 'Combat Report',
    description: 'Your fleet engaged enemy forces at [2:156:8]. Victory! Looted 450,000 Metal.',
    priority: 'high',
    icon: 'ri-sword-line',
    color: '#f87171',
    coordinates: '[2:156:8]',
    actionLabel: 'View Report',
    actionPath: '/fleet',
    data: { result: 'victory', loot: { metal: 450000, crystal: 120000 } },
  },
  {
    type: 'planet_colonized',
    title: 'Colony Established',
    description: 'New colony established on [4:89:6]. Population: 50,000. Fields: 180.',
    priority: 'medium',
    icon: 'ri-planet-line',
    color: '#34d399',
    coordinates: '[4:89:6]',
    actionLabel: 'View Empire',
    actionPath: '/empire',
  },
];

/* ─────────────────────────────────────────────
   MOCK FLEET MOVEMENTS
───────────────────────────────────────────── */
const MISSION_COLORS: Record<string, string> = {
  Attack: '#f87171', Transport: '#34d399', Deploy: '#60a5fa',
  Colonize: '#a78bfa', Harvest: '#38bdf8', Spy: '#fbbf24',
  Expedition: '#fb923c', Defend: '#4ade80',
};

function generateFleets(): FleetMovement[] {
  const now = Date.now();
  return [
    {
      id: 'fleet-1',
      name: 'Attack Fleet Alpha',
      mission: 'Attack',
      origin: '[1:234:8]',
      destination: '[3:421:9]',
      ships: 245,
      departedAt: now - 600000,
      arrivalAt: now + 262000,
      status: 'traveling',
      missionColor: MISSION_COLORS.Attack,
    },
    {
      id: 'fleet-2',
      name: 'Transport Beta',
      mission: 'Transport',
      origin: '[1:234:8]',
      destination: '[1:234:12]',
      ships: 50,
      departedAt: now - 200000,
      arrivalAt: now + 295000,
      status: 'traveling',
      cargo: { metal: 500000, crystal: 200000, deuterium: 50000 },
      missionColor: MISSION_COLORS.Transport,
    },
    {
      id: 'fleet-3',
      name: 'Expedition Gamma',
      mission: 'Expedition',
      origin: '[1:234:8]',
      destination: '[7:89:15]',
      ships: 120,
      departedAt: now - 1800000,
      arrivalAt: now - 600000,
      returnAt: now + 1200000,
      status: 'returning',
      missionColor: MISSION_COLORS.Expedition,
    },
    {
      id: 'fleet-4',
      name: 'Spy Probe Delta',
      mission: 'Spy',
      origin: '[1:234:8]',
      destination: '[2:156:5]',
      ships: 5,
      departedAt: now - 60000,
      arrivalAt: now + 120000,
      status: 'traveling',
      missionColor: MISSION_COLORS.Spy,
    },
    {
      id: 'fleet-5',
      name: 'Colony Ship Epsilon',
      mission: 'Colonize',
      origin: '[1:234:8]',
      destination: '[4:89:6]',
      ships: 1,
      departedAt: now - 3600000,
      arrivalAt: now + 7200000,
      status: 'traveling',
      missionColor: MISSION_COLORS.Colonize,
    },
  ];
}

/* ─────────────────────────────────────────────
   HOOK
───────────────────────────────────────────── */
export function useGameEventSystem() {
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [fleets, setFleets] = useState<FleetMovement[]>(generateFleets);
  const [clock, setClock] = useState<GameClock>({
    tick: 0,
    speed: 2,
    paused: false,
    realTime: Date.now(),
    gameTime: 0,
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const eventIdRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateEventId = useCallback(() => {
    eventIdRef.current += 1;
    return `evt-${Date.now()}-${eventIdRef.current}`;
  }, []);

  const addEvent = useCallback((template: Omit<GameEvent, 'id' | 'timestamp' | 'dismissed'>) => {
    const event: GameEvent = {
      ...template,
      id: generateEventId(),
      timestamp: Date.now(),
      dismissed: false,
    };
    setEvents((prev) => [event, ...prev].slice(0, 100));
    setUnreadCount((n) => n + 1);
  }, [generateEventId]);

  const dismissEvent = useCallback((id: string) => {
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, dismissed: true } : e));
  }, []);

  const dismissAll = useCallback(() => {
    setEvents((prev) => prev.map((e) => ({ ...e, dismissed: true })));
    setUnreadCount(0);
  }, []);

  const markAllRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const recallFleet = useCallback((fleetId: string) => {
    setFleets((prev) => prev.map((f) =>
      f.id === fleetId ? { ...f, status: 'recalled' as const } : f
    ));
    addEvent({
      type: 'fleet_departed',
      title: 'Fleet Recalled',
      description: 'Fleet has been recalled and is returning to base.',
      priority: 'medium',
      icon: 'ri-arrow-go-back-line',
      color: '#fbbf24',
      actionLabel: 'View Fleet',
      actionPath: '/fleet',
    });
  }, [addEvent]);

  // Game clock tick
  useEffect(() => {
    if (clock.paused) return;
    const speedMultiplier = [0, 1, 2, 4, 8][clock.speed] ?? 2;
    const interval = Math.max(100, 1000 / speedMultiplier);

    tickRef.current = setInterval(() => {
      setClock((prev) => ({
        ...prev,
        tick: prev.tick + 1,
        realTime: Date.now(),
        gameTime: prev.gameTime + speedMultiplier,
      }));
    }, interval);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [clock.paused, clock.speed]);

  // Random event generator
  useEffect(() => {
    const interval = setInterval(() => {
      if (clock.paused) return;
      // ~15% chance per 30 seconds
      if (Math.random() < 0.15) {
        const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
        addEvent(template);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [clock.paused, addEvent]);

  // Initial events on mount
  useEffect(() => {
    const initialEvents = EVENT_TEMPLATES.slice(0, 5);
    initialEvents.forEach((template, i) => {
      setTimeout(() => addEvent(template), i * 500);
    });
  }, []);

  // Fleet arrival detection
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setFleets((prev) =>
        prev.map((fleet) => {
          if (fleet.status === 'traveling' && now >= fleet.arrivalAt) {
            addEvent({
              type: 'fleet_arrived',
              title: `${fleet.name} Arrived`,
              description: `${fleet.name} has arrived at ${fleet.destination} with ${fleet.ships} ships.`,
              priority: 'high',
              icon: 'ri-rocket-2-line',
              color: fleet.missionColor,
              coordinates: fleet.destination,
              actionLabel: 'View Fleet',
              actionPath: '/fleet',
            });
            return { ...fleet, status: 'arrived' as const };
          }
          if (fleet.status === 'returning' && fleet.returnAt && now >= fleet.returnAt) {
            addEvent({
              type: 'fleet_arrived',
              title: `${fleet.name} Returned`,
              description: `${fleet.name} has returned to base from ${fleet.destination}.`,
              priority: 'medium',
              icon: 'ri-home-line',
              color: '#34d399',
              actionLabel: 'View Fleet',
              actionPath: '/fleet',
            });
            return { ...fleet, status: 'arrived' as const };
          }
          return fleet;
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [addEvent]);

  // Fleet progress calculation
  const getFleetProgress = useCallback((fleet: FleetMovement): number => {
    const now = Date.now();
    if (fleet.status === 'arrived') return 100;
    if (fleet.status === 'recalled') return 0;
    if (fleet.status === 'returning' && fleet.returnAt) {
      const total = fleet.returnAt - fleet.arrivalAt;
      const elapsed = now - fleet.arrivalAt;
      return Math.min(100, Math.max(0, (elapsed / total) * 100));
    }
    const total = fleet.arrivalAt - fleet.departedAt;
    const elapsed = now - fleet.departedAt;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  }, []);

  const getTimeRemaining = useCallback((fleet: FleetMovement): number => {
    const now = Date.now();
    if (fleet.status === 'returning' && fleet.returnAt) {
      return Math.max(0, fleet.returnAt - now);
    }
    return Math.max(0, fleet.arrivalAt - now);
  }, []);

  const formatTime = useCallback((ms: number): string => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${sec}s`;
    return `${sec}s`;
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setClock((prev) => ({ ...prev, speed }));
  }, []);

  const setPaused = useCallback((paused: boolean) => {
    setClock((prev) => ({ ...prev, paused }));
  }, []);

  const activeEvents = events.filter((e) => !e.dismissed);
  const criticalEvents = activeEvents.filter((e) => e.priority === 'critical');

  return {
    events,
    activeEvents,
    criticalEvents,
    unreadCount,
    fleets,
    clock,
    addEvent,
    dismissEvent,
    dismissAll,
    markAllRead,
    recallFleet,
    getFleetProgress,
    getTimeRemaining,
    formatTime,
    setSpeed,
    setPaused,
  };
}
