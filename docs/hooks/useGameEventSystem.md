# useGameEventSystem

## Manages
In-game event feed with 13+ event types, a game clock (tick/speed/pause), mock fleet movements with progress tracking, random event generation, and fleet arrival detection.

## Returns
- `events`, `activeEvents`, `criticalEvents`, `unreadCount` — event state
- `fleets` — mock fleet movement data
- `clock` — `{ tick, speed, paused, realTime, gameTime }`
- `addEvent(template)` — push a new event
- `dismissEvent(id)`, `dismissAll`, `markAllRead` — event management
- `recallFleet(fleetId)` — recall a mocked fleet
- `getFleetProgress(fleet)`, `getTimeRemaining(fleet)`, `formatTime(ms)` — utility functions
- `setSpeed(speed)`, `setPaused(paused)` — clock controls

## Used by
- Event feed sidebar
- Fleet movement visualization
- Game clock display
