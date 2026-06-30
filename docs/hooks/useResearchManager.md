# useResearchManager

Manages technology research — start, cancel, complete, and progress tracking.

## Returns

- `research` — all research entries for the player
- `activeResearch` — the currently researching technology (or null)
- `loading` — boolean for initial load
- `startResearch(technologyName, currentLevel, researchTime, cost)` — starts research (pre-increments level)
- `cancelResearch()` — cancels active research (rolls back level)
- `getResearchLevel(technologyName)` — returns effective level (accounts for in-progress research)
- `getTimeRemaining()` — seconds until active research completes
- `getProgress()` — approximate progress percentage (0–100)
- `refreshResearch` — reloads from Supabase

## Features

- Technology tree / research system
- Real-time completion detection (polls every 3s)
- Achievement tracking on research complete
- Research queue (one at a time)
