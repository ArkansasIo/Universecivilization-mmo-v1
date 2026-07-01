# useTimeBasedEvents

Drives time-based gameplay modifiers from the galactic calendar — weekends, celestial events, holidays, and seasonal boss spawns.

## Returns

- `modifiers` — `{ resourceMultiplier, resourceBonuses, fleetSpeedMod, combatMod, researchMod, buildMod, isResourceWeekend }`
- `activeCelestialEvents` — events currently affecting the game
- `todayHolidays` — holidays active on the current sol day
- `isWeekendDay` / `season` — calendar state
- `justStartedEvents` / `justEndedEvents` / `justStartedHolidays` — change detection for notifications
- `bossSpawnEvents` — boss spawn triggers from seasonal conditions
- `clearNotifications()` — clears the just-started/just-ended flags
- `recompute` — forces state recalculation

## Modifier Sources

- **Weekends**: 2× resource multiplier
- **Celestial events**: resource bonuses, fleet speed/combat/research/build modifiers (cumulative, capped)
- **Holidays**: 1.1× resource multiplier per active holiday (capped at 5×)
- **Seasonal boss spawns**: condition-based triggers (Frostveil Wyrm, Solar Phoenix, Void Horror, etc.)

## Features

- Dynamic gameplay modifiers
- Seasonal events and holidays
- Automated boss spawning
- Notification triggers for event start/end
