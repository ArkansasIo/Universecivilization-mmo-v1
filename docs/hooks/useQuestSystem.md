# useQuestSystem

Manages quest tracking, progress updates, reward claiming, and automatic quest mapping.

## Returns

- `quests` — array of player quests with progress, completion, and claim status
- `loading` — boolean for initial load
- `updateProgress(questId, progress)` — updates quest progress, auto-completes at target
- `claimRewards(questId)` — grants rewards (credits, XP) and marks quest claimed
- `trackQuest(type, value)` — maps event types (build_ships, win_battles, etc.) to quest IDs
- `refreshQuests` — reloads from Supabase

## Quest Mapping

`build_ships` → `first_fleet`, `complete_research` → `tech_pioneer`, `win_battles` → `conqueror`, `collect_resources` → `resource_master`, `build_structures` → `empire_builder`

## Features

- Quest / achievement tracking
- Reward claiming flow
- Automatic progress tracking from game events
