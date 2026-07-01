# useWorldBosses

Manages world boss encounters — boss spawning, damage dealing, participant tracking, and reward distribution.

## Returns

- `bosses` — recent world bosses
- `activeBoss` — the currently active boss (or null)
- `participants` — damage leaderboard for the active boss
- `loading` — boolean for initial load
- `attackBoss(bossId, damage)` — deals damage, updates participant score, triggers reward distribution on defeat
- `spawnBoss(name, level, maxHealth, attack, defense, rewards)` — creates a new boss encounter
- `reload` — refreshes from Supabase

## Reward Distribution

On boss defeat: experience and credits awarded proportionally to damage (top player gets 2×, top 3 get 1.5×). Items awarded to top 3 participants.

## Features

- Cooperative world boss system
- Damage contribution leaderboard
- Tiered reward distribution
- Real-time boss updates via Postgres subscription
