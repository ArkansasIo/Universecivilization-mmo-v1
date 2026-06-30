import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameTime } from '@/hooks/useGameTime';
import {
  isWeekend,
  getActiveCelestialEvents,
  getHolidaysForSolDay,
  getSeason,
} from '@/data/galacticCalendar';
import type { CelestialEvent, CalendarHoliday } from '@/data/galacticCalendar';

/* ═══════════════════════════════════════════════════════════════════════════
   useTimeBasedEvents
   ────────────────────────────────────────────────────────────────────────────
   Drives time-based gameplay modifiers from the galactic calendar:
   - Double resource weekends (Solis & Lunaris)
   - Active celestial event modifiers (solar flares, nebula surges, etc.)
   - Holiday bonuses
   - Seasonal boss spawn windows
   - Notification triggers for event starts/ends
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TimeEventModifiers {
  /** Multiplier applied to all resource production */
  resourceMultiplier: number;
  /** Per-resource-type bonus multipliers (additive with resourceMultiplier) */
  resourceBonuses: Partial<Record<string, number>>;
  /** Fleet speed multiplier (1.0 = normal) */
  fleetSpeedMod: number;
  /** Combat power multiplier */
  combatMod: number;
  /** Research speed multiplier */
  researchMod: number;
  /** Building/construction speed multiplier */
  buildMod: number;
  /** Whether it's currently a double resource weekend */
  isResourceWeekend: boolean;
}

export interface TimeEventState {
  /** Current active modifiers */
  modifiers: TimeEventModifiers;
  /** Active celestial events right now */
  activeCelestialEvents: CelestialEvent[];
  /** Holidays happening today */
  todayHolidays: CalendarHoliday[];
  /** Whether today is a weekend day */
  isWeekendDay: boolean;
  /** Current season */
  season: string;
  /** Events that just started this tick (for notifications) */
  justStartedEvents: CelestialEvent[];
  /** Events that just ended this tick */
  justEndedEvents: CelestialEvent[];
  /** Holidays that just began today */
  justStartedHolidays: CalendarHoliday[];
  /** Boss spawn events triggered this tick */
  bossSpawnEvents: { bossId: string; bossName: string; reason: string }[];
}

const DEFAULT_MODIFIERS: TimeEventModifiers = {
  resourceMultiplier: 1.0,
  resourceBonuses: {},
  fleetSpeedMod: 1.0,
  combatMod: 1.0,
  researchMod: 1.0,
  buildMod: 1.0,
  isResourceWeekend: false,
};

/** Seasonal boss spawns tied to specific calendar conditions */
const SEASONAL_BOSS_SPAWNS: Array<{
  bossId: string;
  bossName: string;
  condition: (solDay: number, season: string, events: CelestialEvent[]) => boolean;
  reason: string;
}> = [
  {
    bossId: 'sb-frost-wyrm',
    bossName: 'Frostveil Wyrm',
    condition: (solDay, season) => season === 'Frostveil' && solDay >= 240 && solDay <= 270 && Math.random() < 0.08,
    reason: 'The Frostveil has awakened an ancient ice wyrm from its glacial slumber.',
  },
  {
    bossId: 'sb-solar-phoenix',
    bossName: 'Solar Phoenix',
    condition: (solDay, season, events) => season === 'Emberfall' && events.some(e => e.type === 'solar_flare') && Math.random() < 0.05,
    reason: 'The solar flare energies have birthed a Solar Phoenix from the corona!',
  },
  {
    bossId: 'sb-void-horror',
    bossName: 'Void Horror',
    condition: (solDay, season, events) => events.some(e => e.type === 'void_rift' && e.severity === 'extreme') && Math.random() < 0.10,
    reason: 'A Void Horror has crawled through the dimensional rift — mobilize all fleets!',
  },
  {
    bossId: 'sb-crystal-colossus',
    bossName: 'Crystal Colossus',
    condition: (solDay, season) => season === 'Starbloom' && solDay >= 120 && solDay <= 150 && Math.random() < 0.06,
    reason: 'A Crystal Colossus has emerged from the deep mines — its crystals are legendary quality!',
  },
  {
    bossId: 'sb-nebula-wraith',
    bossName: 'Nebula Wraith',
    condition: (solDay, season, events) => events.some(e => e.type === 'nebula_surge') && Math.random() < 0.07,
    reason: 'The nebula surge has coalesced into a sentient Nebula Wraith!',
  },
  {
    bossId: 'sb-dark-tide-leviathan',
    bossName: 'Dark Tide Leviathan',
    condition: (solDay, season, events) => events.some(e => e.type === 'dark_matter_tide' && e.severity === 'extreme') && Math.random() < 0.09,
    reason: 'The Dark Matter Tide has awakened the ancient Leviathan from the abyss!',
  },
];

export function useTimeBasedEvents() {
  const gameTime = useGameTime();
  const [state, setState] = useState<TimeEventState>({
    modifiers: DEFAULT_MODIFIERS,
    activeCelestialEvents: [],
    todayHolidays: [],
    isWeekendDay: false,
    season: '',
    justStartedEvents: [],
    justEndedEvents: [],
    justStartedHolidays: [],
    bossSpawnEvents: [],
  });

  const prevSolDayRef = useRef(gameTime.solDay);
  const prevActiveEventIdsRef = useRef<Set<string>>(new Set());
  const notifiedBossesRef = useRef<Set<string>>(new Set());

  // Core computation — recalculate modifiers when sol day changes
  const computeTimeState = useCallback(() => {
    const { solDay } = gameTime;
    const weekend = isWeekend(solDay);
    const activeEvents = getActiveCelestialEvents(solDay);
    const todayHolidays = getHolidaysForSolDay(solDay);
    const season = getSeason(solDay);

    // Build modifiers from active events
    const mods: TimeEventModifiers = {
      ...DEFAULT_MODIFIERS,
      isResourceWeekend: weekend,
    };

    // Weekend bonus: double resources
    if (weekend) {
      mods.resourceMultiplier = 2.0;
      mods.resourceBonuses = {
        metal: 100,
        crystal: 100,
        deuterium: 100,
        energy: 50,
      };
    }

    // Celestial event modifiers (cumulative, capped)
    for (const event of activeEvents) {
      if (event.gameplayModifiers) {
        const gm = event.gameplayModifiers;
        if (gm.resourceBonus) {
          for (const [key, val] of Object.entries(gm.resourceBonus)) {
            mods.resourceBonuses[key] = (mods.resourceBonuses[key] || 0) + val;
          }
        }
        if (gm.fleetSpeedMod !== undefined) mods.fleetSpeedMod *= gm.fleetSpeedMod;
        if (gm.combatMod !== undefined) mods.combatMod *= gm.combatMod;
        if (gm.researchMod !== undefined) mods.researchMod *= gm.researchMod;
        if (gm.buildMod !== undefined) mods.buildMod *= gm.buildMod;
      }
    }

    // Holiday bonuses
    for (const holiday of todayHolidays) {
      if (holiday.effects) {
        // Simple boost for holidays — most give some kind of bonus
        mods.resourceMultiplier = Math.min(mods.resourceMultiplier * 1.1, 5.0);
      }
    }

    // Cap extremes
    mods.fleetSpeedMod = Math.max(0.2, Math.min(mods.fleetSpeedMod, 3.0));
    mods.combatMod = Math.max(0.3, Math.min(mods.combatMod, 2.5));
    mods.researchMod = Math.max(0.2, Math.min(mods.researchMod, 5.0));
    mods.buildMod = Math.max(0.2, Math.min(mods.buildMod, 5.0));

    // Detect changes for notifications
    const currentEventIds = new Set(activeEvents.map(e => e.id));
    const prevEventIds = prevActiveEventIdsRef.current;

    const justStarted: CelestialEvent[] = [];
    const justEnded: string[] = [];

    for (const e of activeEvents) {
      if (!prevEventIds.has(e.id)) justStarted.push(e);
    }
    for (const id of prevEventIds) {
      if (!currentEventIds.has(id)) justEnded.push(id);
    }

    const justStartedHolidays = prevSolDayRef.current !== solDay ? todayHolidays : [];

    // Seasonal boss spawn checks
    const bossSpawnEvents: typeof state.bossSpawnEvents = [];
    for (const boss of SEASONAL_BOSS_SPAWNS) {
      if (!notifiedBossesRef.current.has(boss.bossId) && boss.condition(solDay, season, activeEvents)) {
        bossSpawnEvents.push({ bossId: boss.bossId, bossName: boss.bossName, reason: boss.reason });
        notifiedBossesRef.current.add(boss.bossId);
      }
    }

    // Update refs
    prevActiveEventIdsRef.current = currentEventIds;
    if (prevSolDayRef.current !== solDay) {
      prevSolDayRef.current = solDay;
      // Reset boss notifications on new day (so they can spawn again next cycle)
      if (solDay % 30 === 1) {
        notifiedBossesRef.current.clear();
      }
    }

    setState({
      modifiers: mods,
      activeCelestialEvents: activeEvents,
      todayHolidays,
      isWeekendDay: weekend,
      season,
      justStartedEvents: justStarted,
      justEndedEvents: activeEvents.filter(e => justEnded.includes(e.id)),
      justStartedHolidays,
      bossSpawnEvents,
    });

    return { mods, activeEvents, todayHolidays, weekend, season, justStarted, justStartedHolidays, bossSpawnEvents };
  }, [gameTime]);

  // Run computation on mount and when sol day changes
  useEffect(() => {
    computeTimeState();
  }, [computeTimeState]);

  // Clear just-started flags after consumption
  const clearNotifications = useCallback(() => {
    setState(prev => ({
      ...prev,
      justStartedEvents: [],
      justEndedEvents: [],
      justStartedHolidays: [],
      bossSpawnEvents: [],
    }));
  }, []);

  return {
    ...state,
    clearNotifications,
    recompute: computeTimeState,
  };
}

export default useTimeBasedEvents;