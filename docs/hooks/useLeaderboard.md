# useLeaderboard

## Manages
Player rankings computed from profiles (level, experience), ship counts, and battle victory stats. Refreshes automatically every 60 seconds.

## Returns
- `rankings` — sorted array of `LeaderboardEntry` with rank, empire name, level, ship count, battles won
- `loading` — loading state
- `getPlayerRank(playerId)` — get a specific player's rank
- `getTopPlayers(count)` — get top N players
- `refreshLeaderboard` — manually re-fetch

## Used by
- Leaderboard tab/screen
- Player profile rank display
