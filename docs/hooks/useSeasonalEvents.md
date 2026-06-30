# useSeasonalEvents

Manages time-limited seasonal events — joining, task completion, rewards, and leaderboards.

## Returns

- `events` — all generated seasonal events
- `activeEvent` — the currently active event (or null)
- `playerProgress` — player's score, tasks, and claimed rewards for the current event
- `loading` — boolean for initial load
- `joinEvent(eventId)` — joins an event (checks level/power/alliance requirements)
- `completeEventTask(eventId, taskType, points)` — adds score and completed tasks
- `claimEventReward(eventId, rewardType)` — claims a specific reward
- `getEventLeaderboard(eventId)` — fetches top 100 players by score
- `refreshEvents` / `refreshProgress` — reload functions

## Event Types

`holiday`, `competition`, `invasion`, `discovery`, `cosmic_phenomenon`

## Features

- Timed seasonal events (Winter Invasion, Cosmic Discovery, Alliance Championship, Black Hole Anomaly)
- Score-based leaderboards
- Requirement gating (level, power, alliance)
- Event-specific multipliers and bonuses
