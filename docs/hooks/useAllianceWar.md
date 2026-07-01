# useAllianceWar

## Manages
Alliance war declarations, war lifecycle (declare/accept/end), battle recording with point scoring, and war history for a given alliance.

## Returns
- `currentWar` — active or declared war for the alliance (or null)
- `warHistory` — past wars (last 10)
- `battles` — battles recorded in the current war
- `loading` — loading state
- `declareWar`, `acceptWar`, `recordBattle`, `endWar` — war actions
- `reload` — re-fetch war data

## Used by
- Alliance war dashboard
- War declaration and battle reporting UI
