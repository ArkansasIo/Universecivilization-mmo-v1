# usePlayerProgression

Manages player level, experience, prestige, skill points, and level-based unlocks.

## Returns

- `progression` — `{ level, experience, experienceToNext, prestige, skillPoints, title, rank }`
- `loading` — boolean for initial load
- `addExperience(amount)` — adds XP, checks for level-ups, grants rewards (dark matter, skill points)
- `addPrestige(amount)` — increments prestige
- `spendSkillPoints(amount)` — spends skill points (returns success boolean)
- `reload` — refreshes from Supabase

## Level Unlocks

Level 5 → Advanced Research, Level 10 → Fleet Formations, Level 15 → Alliance Wars, Level 20 → Motherships, Level 25 → Megastructures, Level 30 → World Bosses, Level 40 → Dimensional Travel, Level 50 → Reality Manipulation

## Features

- Player leveling / XP system
- Skill point economy
- Prestige system
- Feature gating by level
