import { useState, useEffect, useRef, useCallback } from 'react';
import { GAME_TIME_CONFIG } from '@/config/gameConfig';

/* ══════════════════════════════════════════════════════
   useGameTime — Synchronised In-Game Sol System Clock
   Formula:  G = R × S  (Game time = Real time × Scale)
   
   At S=60:  1 real minute = 1 game hour
             1 real day    = 60 game days
             1 game year   = 6 real days
   ══════════════════════════════════════════════════════ */

interface GameTimeState {
  /** Full game year (e.g. 2247) */
  gameYear: number;
  /** Day of year, 1–360 */
  solDay: number;
  /** Hour of day, 0–23 (Galactic Standard Time) */
  hour: number;
  /** Minute, 0–59 */
  minute: number;
  /** Second, 0–59 */
  second: number;
  /** Formatted game date string: "2247 · Sol 142" */
  dateDisplay: string;
  /** Formatted game time string: "14:32:00" */
  timeDisplay: string;
  /** Full display: "Year 2247 · Sol 142 · 14:32:00 GST" */
  fullDisplay: string;
  /** Current server (real) time as "HH:MM:SS" */
  serverTime: string;
  /** Current server (real) time as locale string */
  serverTimeLocale: string;
  /** Game day of week name (based on 7-day week cycle) */
  solDayName: string;
}

/** Game day names — 7-day week mapped from sol day modulo */
const SOL_DAY_NAMES = ['Solis', 'Lunaris', 'Mercuris', 'Veneris', 'Terrae', 'Martis', 'Jovis'];

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function padDay(n: number): string {
  return n.toString().padStart(3, '0');
}

/** Compute game time from real time using G = R × S */
function computeGameTime(nowReal: Date): Omit<GameTimeState, 'serverTime' | 'serverTimeLocale'> {
  const { scalingFactor, epochReal, epochGameYear, daysPerYear, secondsPerDay } = GAME_TIME_CONFIG;

  const epochMs = new Date(epochReal).getTime();
  const realElapsedMs = nowReal.getTime() - epochMs;
  const realElapsedSec = Math.floor(realElapsedMs / 1000);

  // G = R × S
  const gameElapsedSec = realElapsedSec * scalingFactor;

  // Total game days elapsed (fractional)
  const totalGameDays = gameElapsedSec / secondsPerDay;

  // Year calculation
  const fullYears = Math.floor(totalGameDays / daysPerYear);
  const gameYear = epochGameYear + fullYears;

  // Day within current year (1-indexed)
  const daysIntoYear = totalGameDays - (fullYears * daysPerYear);
  const solDay = Math.floor(daysIntoYear) + 1;

  // Time within current day
  const dayFraction = daysIntoYear - Math.floor(daysIntoYear);
  const daySeconds = Math.floor(dayFraction * secondsPerDay);
  const hour = Math.floor(daySeconds / 3600);
  const minute = Math.floor((daySeconds % 3600) / 60);
  const second = daySeconds % 60;

  // Sol day name (7-day cycle)
  const solDayName = SOL_DAY_NAMES[(solDay - 1) % 7];

  // Display formatting
  const dateDisplay = `${gameYear} · Sol ${padDay(solDay)}`;
  const timeDisplay = `${pad(hour)}:${pad(minute)}:${pad(second)}`;
  const fullDisplay = `Year ${gameYear} · Sol ${padDay(solDay)} · ${pad(hour)}:${pad(minute)}:${pad(second)} GST`;

  return {
    gameYear,
    solDay,
    hour,
    minute,
    second,
    dateDisplay,
    timeDisplay,
    fullDisplay,
    solDayName,
  };
}

/** Format server (real) time */
function computeServerTime(now: Date) {
  return {
    serverTime: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    serverTimeLocale: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' }),
  };
}

/**
 * React hook that provides a live ticking in-game clock synchronised
 * across all clients via the deterministic formula G = R × S.
 *
 * Ticks every 250ms for smooth second transitions.
 */
export function useGameTime(): GameTimeState {
  const [state, setState] = useState<GameTimeState>(() => {
    const now = new Date();
    return { ...computeGameTime(now), ...computeServerTime(now) };
  });

  const rafRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);

  const tick = useCallback(() => {
    const now = Date.now();
    // Only update state when the second actually changes (avoids unnecessary re-renders)
    const gameElapsedSec = Math.floor((now - new Date(GAME_TIME_CONFIG.epochReal).getTime()) / 1000) * GAME_TIME_CONFIG.scalingFactor;
    const prevGameElapsedSec = Math.floor((lastTickRef.current - new Date(GAME_TIME_CONFIG.epochReal).getTime()) / 1000) * GAME_TIME_CONFIG.scalingFactor;

    if (gameElapsedSec !== prevGameElapsedSec || lastTickRef.current === 0) {
      lastTickRef.current = now;
      const nowDate = new Date(now);
      setState({ ...computeGameTime(nowDate), ...computeServerTime(nowDate) });
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  return state;
}

export default useGameTime;

/** Compute the Stardate (game time) at which something will arrive,
 * given the remaining real-world seconds until arrival.
 * Uses the same G = R × S formula.
 *
 * Example output: "Year 2247 · Sol 145 · 18:42:00 GST"
 */
export function computeArrivalStardate(remainingRealSeconds: number): string {
  const { scalingFactor, epochReal, epochGameYear, daysPerYear, secondsPerDay } = GAME_TIME_CONFIG;
  const now = new Date();

  // Current game elapsed
  const epochMs = new Date(epochReal).getTime();
  const nowRealElapsedSec = Math.floor((now.getTime() - epochMs) / 1000);
  const nowGameElapsedSec = nowRealElapsedSec * scalingFactor;

  // Add remaining real time (converted to game time) to get arrival game elapsed
  const remainingGameSec = remainingRealSeconds * scalingFactor;
  const arrivalGameElapsedSec = nowGameElapsedSec + remainingGameSec;

  const totalGameDays = arrivalGameElapsedSec / secondsPerDay;
  const fullYears = Math.floor(totalGameDays / daysPerYear);
  const gameYear = epochGameYear + fullYears;

  const daysIntoYear = totalGameDays - (fullYears * daysPerYear);
  const solDay = Math.floor(daysIntoYear) + 1;

  const dayFraction = daysIntoYear - Math.floor(daysIntoYear);
  const daySeconds = Math.floor(dayFraction * secondsPerDay);
  const hour = Math.floor(daySeconds / 3600);
  const minute = Math.floor((daySeconds % 3600) / 60);
  const second = daySeconds % 60;

  return `Year ${gameYear} · Sol ${padDay(solDay)} · ${pad(hour)}:${pad(minute)}:${pad(second)} GST`;
}

/** Get a compact Stardate display: "2247 · Sol 145 · 18:42 GST" */
export function computeCompactArrivalStardate(remainingRealSeconds: number): string {
  const full = computeArrivalStardate(remainingRealSeconds);
  // "Year 2247 · Sol 145 · 18:42:00 GST" → "2247 · Sol 145 · 18:42 GST"
  return full.replace('Year ', '').replace(/:\d{2} GST/, ' GST');
}