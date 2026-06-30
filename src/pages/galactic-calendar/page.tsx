import { useState, useMemo } from 'react';
import { useGameTime } from '@/hooks/useGameTime';
import {
  GALACTIC_MONTHS,
  SOL_DAY_NAMES,
  getMonthForSolDay,
  getDayInMonth,
  getHolidaysForSolDay,
  getActiveCelestialEvents,
  getUpcomingCelestialEvents,
  getHolidaysForMonth,
  getSolDayName,
  isWeekend,
  getSeason,
} from '@/data/galacticCalendar';
import type { CalendarMonth, CalendarHoliday, CelestialEvent } from '@/data/galacticCalendar';

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

const SEASON_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Voidwinter: { bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.3)', text: '#818cf8' },
  Starbloom:  { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.3)', text: '#34d399' },
  Emberfall:  { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.3)', text: '#fb923c' },
  Frostveil:  { bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.3)', text: '#38bdf8' },
};

const HOLIDAY_TYPE_ICONS: Record<string, string> = {
  galactic: 'ri-global-line',
  faction: 'ri-flag-line',
  seasonal: 'ri-calendar-event-line',
  religious: 'ri-star-line',
  historical: 'ri-book-open-line',
};

const EVENT_SEVERITY_COLORS: Record<string, string> = {
  low: '#34d399',
  moderate: '#fbbf24',
  high: '#f97316',
  extreme: '#ef4444',
};

/* ─────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────── */

function MonthGrid({ month, solDay, gameYear }: { month: CalendarMonth; solDay: number; gameYear: number }) {
  const dayInMonth = month.index === Math.floor((solDay - 1) / 30) ? getDayInMonth(solDay) : -1;
  const firstSolDayOfMonth = month.index * 30 + 1;
  const firstDayName = getSolDayName(firstSolDayOfMonth);
  const dayOffset = SOL_DAY_NAMES.indexOf(firstDayName);

  const days: (number | null)[] = [];
  for (let i = 0; i < dayOffset; i++) days.push(null);
  for (let d = 1; d <= 30; d++) days.push(d);

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
      {/* Month header */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1e2a36' }}>
        <div>
          <h3 className="text-sm font-bold text-white">{month.name}</h3>
          <p className="text-xs" style={{ color: '#5a6577' }}>{month.season} · {month.days} days</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold" style={{ color: month.color }}>Year {gameYear}</span>
        </div>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-px px-2 py-2" style={{ background: 'rgba(255,255,255,0.02)' }}>
        {SOL_DAY_NAMES.map((name) => (
          <div key={name} className="text-center text-xs font-bold py-1" style={{ color: '#5a6577', fontSize: 10 }}>
            {name.slice(0, 2)}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-px p-2" style={{ background: 'rgba(255,255,255,0.02)' }}>
        {days.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} className="aspect-square" />;

          const absoluteSolDay = month.index * 30 + day;
          const holidays = getHolidaysForSolDay(absoluteSolDay);
          const events = getActiveCelestialEvents(absoluteSolDay);
          const isToday = day === dayInMonth;
          const weekend = isWeekend(absoluteSolDay);

          return (
            <div
              key={day}
              className="aspect-square rounded-lg flex flex-col items-center justify-center cursor-default transition-all relative group"
              style={{
                background: isToday ? `${month.color}15` : 'transparent',
                border: isToday ? `1px solid ${month.color}50` : '1px solid transparent',
              }}
            >
              <span
                className="text-xs font-mono"
                style={{
                  color: isToday ? month.color : weekend ? '#5a6577' : '#8892aa',
                  fontWeight: isToday ? 700 : 400,
                }}
              >
                {day}
              </span>

              {/* Holiday indicator */}
              {holidays.length > 0 && (
                <div className="absolute bottom-1 flex gap-0.5">
                  {holidays.slice(0, 2).map((h) => (
                    <div
                      key={h.id}
                      className="w-1 h-1 rounded-full"
                      style={{ background: h.color }}
                      title={h.name}
                    />
                  ))}
                </div>
              )}

              {/* Event indicator */}
              {events.length > 0 && (
                <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full" style={{ background: '#ef4444' }} />
              )}

              {/* Tooltip */}
              {(holidays.length > 0 || events.length > 0) && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-50 whitespace-nowrap"
                  style={{ background: '#0d131a', border: '1px solid #1e2a36' }}>
                  {holidays.map((h) => (
                    <div key={h.id} className="flex items-center gap-1.5 mb-0.5">
                      <i className={`${h.icon} text-xs`} style={{ color: h.color }}></i>
                      <span className="text-xs font-bold" style={{ color: h.color }}>{h.name}</span>
                    </div>
                  ))}
                  {events.map((e) => (
                    <div key={e.id} className="flex items-center gap-1.5">
                      <i className={`${e.icon} text-xs`} style={{ color: e.color }}></i>
                      <span className="text-xs font-bold" style={{ color: e.color }}>{e.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HolidayCard({ holiday, solDay, gameYear }: { holiday: CalendarHoliday; solDay: number; gameYear: number }) {
  const holidaySolDay = holiday.month * 30 + holiday.day;
  const daysUntil = holidaySolDay - solDay;
  const isPast = daysUntil < 0;

  return (
    <div
      className="rounded-lg p-4 transition-all"
      style={{
        background: isPast ? 'rgba(255,255,255,0.01)' : `${holiday.color}08`,
        border: `1px solid ${isPast ? 'rgba(255,255,255,0.04)' : holiday.color + '30'}`,
        opacity: isPast ? 0.5 : 1,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${holiday.color}15` }}>
          <i className={`${holiday.icon} text-lg`} style={{ color: holiday.color }}></i>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold text-white">{holiday.name}</h4>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0 ml-2"
              style={{ background: `${holiday.color}15`, color: holiday.color, fontSize: 10 }}>
              {HOLIDAY_TYPE_ICONS[holiday.type] ? (
                <><i className={`${HOLIDAY_TYPE_ICONS[holiday.type]} mr-1 w-3 h-3 inline-flex items-center justify-center`}></i>{holiday.type}</>
              ) : holiday.type}
            </span>
          </div>
          <p className="text-xs mb-2" style={{ color: '#5a6577' }}>{holiday.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono" style={{ color: '#6b7a95' }}>
              Sol {holiday.day} · {GALACTIC_MONTHS[holiday.month].name}
            </span>
            {!isPast && daysUntil > 0 && (
              <span className="text-xs font-bold" style={{ color: holiday.color }}>
                in {daysUntil} Sol{daysUntil !== 1 ? 's' : ''}
              </span>
            )}
            {daysUntil === 0 && (
              <span className="text-xs font-bold animate-pulse" style={{ color: holiday.color }}>TODAY!</span>
            )}
            {isPast && <span className="text-xs" style={{ color: '#3a4557' }}>passed</span>}
          </div>
          {holiday.effects && (
            <div className="mt-2 pt-2 flex items-center gap-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <i className="ri-flashlight-line text-xs" style={{ color: '#d4a853' }}></i>
              <span className="text-xs" style={{ color: '#d4a853' }}>{holiday.effects}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CelestialEventCard({ event, solDay }: { event: CelestialEvent; solDay: number; gameYear: number }) {
  const isActive = solDay >= event.solDayRange[0] && solDay <= event.solDayRange[1];
  const startsIn = event.solDayRange[0] - solDay;
  const totalDays = event.solDayRange[1] - event.solDayRange[0] + 1;
  const progressDays = isActive ? solDay - event.solDayRange[0] + 1 : 0;
  const progressPct = isActive ? Math.min((progressDays / totalDays) * 100, 100) : 0;

  return (
    <div
      className="rounded-lg p-4 transition-all"
      style={{
        background: isActive ? `${event.color}08` : 'rgba(255,255,255,0.012)',
        border: `1px solid ${isActive ? event.color + '40' : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 relative"
          style={{ background: `${event.color}15` }}>
          <i className={`${event.icon} text-lg`} style={{ color: event.color }}></i>
          {isActive && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse" style={{ background: event.color }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold text-white">{event.name}</h4>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0"
              style={{ background: `${EVENT_SEVERITY_COLORS[event.severity]}15`, color: EVENT_SEVERITY_COLORS[event.severity], fontSize: 10 }}>
              {event.severity}
            </span>
          </div>
          <p className="text-xs mb-2" style={{ color: '#5a6577' }}>{event.description}</p>

          {/* Progress bar for active events */}
          {isActive && (
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span style={{ color: '#5a6577' }}>Day {progressDays} of {totalDays}</span>
                <span style={{ color: event.color }}>{Math.floor(progressPct)}%</span>
              </div>
              <div className="w-full h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-1 rounded-full transition-all" style={{ width: `${progressPct}%`, background: event.color }} />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className="font-mono" style={{ color: '#6b7a95' }}>
              Sol {event.solDayRange[0]} – Sol {event.solDayRange[1]}
            </span>
            {!isActive && startsIn > 0 && (
              <span className="font-bold" style={{ color: event.color }}>
                in {startsIn} Sol{startsIn !== 1 ? 's' : ''}
              </span>
            )}
            {isActive && (
              <span className="font-bold" style={{ color: event.color }}>ACTIVE</span>
            )}
          </div>

          {/* Effects */}
          <div className="mt-2 pt-2 flex items-start gap-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <i className="ri-flashlight-line text-xs mt-0.5 flex-shrink-0" style={{ color: '#d4a853' }}></i>
            <span className="text-xs" style={{ color: '#d4a853' }}>{event.effects}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function GalacticCalendarPage() {
  const gameTime = useGameTime();
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
  const [monthOffset, setMonthOffset] = useState(0);

  const currentSolDay = gameTime.solDay;
  const currentGameYear = gameTime.gameYear;
  const currentMonth = getMonthForSolDay(currentSolDay);
  const dayInMonth = getDayInMonth(currentSolDay);

  // The viewing month (with offset from current)
  const viewingMonthIndex = (currentMonth.index + monthOffset + 12) % 12;
  const viewingMonth = GALACTIC_MONTHS[viewingMonthIndex];

  const holidaysForViewingMonth = useMemo(() => getHolidaysForMonth(viewingMonthIndex), [viewingMonthIndex]);
  const activeEvents = useMemo(() => getActiveCelestialEvents(currentSolDay), [currentSolDay]);
  const upcomingEvents = useMemo(() => getUpcomingCelestialEvents(currentSolDay, 60), [currentSolDay]);

  const todayHolidays = useMemo(() => getHolidaysForSolDay(currentSolDay), [currentSolDay]);
  const season = getSeason(currentSolDay);
  const seasonStyle = SEASON_COLORS[season];

  return (
    <div style={{ color: '#8892aa' }}>
      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ height: 220 }}>
        <img
          src="https://readdy.ai/api/search-image?query=ancient%20galactic%20star%20map%20with%20glowing%20constellation%20lines%20connecting%20stars%20on%20a%20deep%20cosmos%20background%20with%20swirling%20nebulas%20in%20purple%20cyan%20and%20gold%20hues%20ornate%20celestial%20calendar%20aesthetic%20brass%20and%20copper%20mechanical%20astrolabe%20elements%20sci-fi%20fantasy%20art&width=1920&height=600&seq=galactic_calendar_hero&orientation=landscape"
          alt="Galactic Calendar"
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ filter: 'brightness(0.35)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(7,10,16,0.95) 100%)' }} />
        <div className="relative z-10 h-full flex items-end px-6 pb-5">
          <div className="flex items-end justify-between w-full">
            <div>
              <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Galactic Calendar</h1>
              <p className="text-sm" style={{ color: '#5a6577' }}>Sol Standard Time · Year {currentGameYear}</p>
            </div>
            {/* Live clock */}
            <div className="text-right">
              <div className="text-2xl font-mono font-bold" style={{ color: '#e2c044' }}>
                {gameTime.dateDisplay}
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-lg font-mono" style={{ color: '#d4a853' }}>{gameTime.timeDisplay}</span>
                <span className="text-xs opacity-50" style={{ color: '#8892aa' }}>GST</span>
              </div>
              <div className="text-xs" style={{ color: '#5a6577' }}>
                {gameTime.solDayName} · {currentMonth.name} ({currentMonth.abbr}) · {season}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Day Overview */}
      <div className="px-5 mt-5">
        <div className="rounded-xl p-5" style={{ background: seasonStyle.bg, border: `1px solid ${seasonStyle.border}` }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider" style={{ color: seasonStyle.text }}>{season}</span>
              <span className="text-xs" style={{ color: '#5a6577' }}>·</span>
              <span className="text-xs" style={{ color: '#8892aa' }}>{currentMonth.name} · Sol {dayInMonth} · {gameTime.solDayName}</span>
            </div>
            <span className="text-xs" style={{ color: seasonStyle.text }}>{currentMonth.description}</span>
          </div>
        </div>
      </div>

      {/* Today's Holidays */}
      {todayHolidays.length > 0 && (
        <div className="px-5 mt-4">
          <h2 className="text-xs font-bold tracking-wider mb-3 flex items-center gap-2" style={{ color: '#8892aa' }}>
            <i className="ri-calendar-event-line w-4 h-4 flex items-center justify-center" style={{ color: '#f59e0b' }}></i>
            TODAY'S OBSERVANCES
          </h2>
          <div className="space-y-2">
            {todayHolidays.map((h) => (
              <HolidayCard key={h.id} holiday={h} solDay={currentSolDay} gameYear={currentGameYear} />
            ))}
          </div>
        </div>
      )}

      {/* View Toggle & Navigation */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5 rounded-lg p-1.5" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
            <button
              onClick={() => { setViewMode('month'); setMonthOffset(0); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${viewMode === 'month' ? 'text-white' : ''}`}
              style={viewMode === 'month' ? { background: 'linear-gradient(90deg, #d4a853, #e2c044)' } : { color: '#5a6577' }}
            >
              <i className="ri-calendar-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Month View
            </button>
            <button
              onClick={() => { setViewMode('year'); setMonthOffset(0); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${viewMode === 'year' ? 'text-white' : ''}`}
              style={viewMode === 'year' ? { background: 'linear-gradient(90deg, #d4a853, #e2c044)' } : { color: '#5a6577' }}
            >
              <i className="ri-calendar-2-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Year View
            </button>
          </div>

          {viewMode === 'month' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMonthOffset((o) => o - 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:bg-white/5"
                style={{ border: '1px solid #1e2a36', color: '#5a6577' }}
              >
                <i className="ri-arrow-left-s-line text-sm"></i>
              </button>
              <span className="text-sm font-bold text-white min-w-[130px] text-center">{viewingMonth.name} · Year {currentGameYear}</span>
              <button
                onClick={() => setMonthOffset((o) => o + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:bg-white/5"
                style={{ border: '1px solid #1e2a36', color: '#5a6577' }}
              >
                <i className="ri-arrow-right-s-line text-sm"></i>
              </button>
              {monthOffset !== 0 && (
                <button
                  onClick={() => setMonthOffset(0)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all"
                  style={{ background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.2)', color: '#d4a853' }}
                >
                  Today
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Month Grid View */}
      {viewMode === 'month' && (
        <div className="px-5 mt-4 pb-5">
          <MonthGrid month={viewingMonth} solDay={currentSolDay} gameYear={currentGameYear} />

          {/* Holidays in viewing month */}
          {holidaysForViewingMonth.length > 0 && (
            <div className="mt-5">
              <h2 className="text-xs font-bold tracking-wider mb-3 flex items-center gap-2" style={{ color: '#8892aa' }}>
                <i className="ri-sparkling-2-line w-4 h-4 flex items-center justify-center" style={{ color: '#f59e0b' }}></i>
                HOLIDAYS IN {viewingMonth.name.toUpperCase()}
              </h2>
              <div className="space-y-2">
                {holidaysForViewingMonth.map((h) => (
                  <HolidayCard key={h.id} holiday={h} solDay={currentSolDay} gameYear={currentGameYear} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Year View */}
      {viewMode === 'year' && (
        <div className="px-5 mt-4 pb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GALACTIC_MONTHS.map((month) => {
              const isCurrentMonth = month.index === currentMonth.index;
              return (
                <div key={month.index} className="rounded-xl overflow-hidden transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.015)',
                    border: `1px solid ${isCurrentMonth ? month.color + '50' : '#1e2a36'}`,
                    transform: isCurrentMonth ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  <div className="px-3 py-2.5 flex items-center justify-between" style={{ borderBottom: '1px solid #1e2a36' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: month.color }} />
                      <span className="text-sm font-bold text-white">{month.abbr}</span>
                      <span className="text-xs" style={{ color: '#5a6577' }}>{month.name}</span>
                    </div>
                    {isCurrentMonth && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${month.color}20`, color: month.color, fontSize: 9 }}>
                        CURRENT
                      </span>
                    )}
                  </div>

                  {/* Compact 7-column grid */}
                  <div className="p-2">
                    <div className="grid grid-cols-7 gap-px mb-1">
                      {SOL_DAY_NAMES.map((name) => (
                        <div key={name} className="text-center text-xs py-0.5" style={{ color: '#3a4557', fontSize: 9 }}>{name[0]}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-px">
                      {/* Offset for first day */}
                      {Array.from({ length: SOL_DAY_NAMES.indexOf(getSolDayName(month.index * 30 + 1)) }).map((_, i) => (
                        <div key={`e-${i}`} className="aspect-square" />
                      ))}
                      {Array.from({ length: 30 }).map((_, i) => {
                        const d = i + 1;
                        const absSol = month.index * 30 + d;
                        const hasHoliday = getHolidaysForSolDay(absSol).length > 0;
                        const hasEvent = getActiveCelestialEvents(absSol).length > 0;
                        const isToday = isCurrentMonth && d === dayInMonth;
                        return (
                          <div
                            key={d}
                            className="aspect-square rounded flex items-center justify-center text-xs font-mono relative cursor-default"
                            style={{
                              background: isToday ? `${month.color}25` : 'transparent',
                              color: isToday ? month.color : '#5a6577',
                              fontWeight: isToday ? 700 : 400,
                              fontSize: 10,
                            }}
                          >
                            {d}
                            {hasHoliday && <div className="absolute bottom-0.5 w-1 h-1 rounded-full" style={{ background: '#f59e0b' }} />}
                            {hasEvent && <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full" style={{ background: '#ef4444' }} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Celestial Events */}
      {activeEvents.length > 0 && (
        <div className="px-5 pb-5">
          <h2 className="text-xs font-bold tracking-wider mb-3 flex items-center gap-2" style={{ color: '#8892aa' }}>
            <i className="ri-planet-line w-4 h-4 flex items-center justify-center" style={{ color: '#f87171' }}></i>
            ACTIVE CELESTIAL EVENTS
          </h2>
          <div className="space-y-3">
            {activeEvents.map((e) => (
              <CelestialEventCard key={e.id} event={e} solDay={currentSolDay} gameYear={currentGameYear} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Celestial Events */}
      {upcomingEvents.length > 0 && (
        <div className="px-5 pb-8">
          <h2 className="text-xs font-bold tracking-wider mb-3 flex items-center gap-2" style={{ color: '#8892aa' }}>
            <i className="ri-time-line w-4 h-4 flex items-center justify-center" style={{ color: '#38bdf8' }}></i>
            UPCOMING CELESTIAL EVENTS
          </h2>
          <div className="space-y-3">
            {upcomingEvents.map((e) => (
              <CelestialEventCard key={e.id} event={e} solDay={currentSolDay} gameYear={currentGameYear} />
            ))}
          </div>
        </div>
      )}

      {/* No events state */}
      {activeEvents.length === 0 && upcomingEvents.length === 0 && (
        <div className="px-5 pb-8">
          <div className="rounded-xl p-10 text-center" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,168,83,0.06)', border: '1px solid rgba(212,168,83,0.15)' }}>
              <i className="ri-planet-line text-2xl" style={{ color: '#d4a853' }}></i>
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Calm Cosmos</h3>
            <p className="text-xs max-w-md mx-auto" style={{ color: '#5a6577' }}>
              No celestial events are currently active or upcoming in the next 60 Sols.
              Check back as the galactic cycle progresses — cosmic phenomena are always brewing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}