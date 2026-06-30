# useCombatSimulator

## Manages
Client-side combat simulation (simplified ship stats, multi-round) and server-side fleet combat resolution via edge function. Also supports legacy execute-combat with resource transfer.

## Returns
- `simulateCombat(attackerFleet, defenderFleet, defenderDefenses?)` — client-side preview simulation
- `resolveFleetCombat(attackerFleetId, defenderFleetId?, attackerTech?, defenderTech?)` — server-side resolution via edge function
- `executeCombat(defenderId, attackerFleet)` — full legacy combat with resource application
- `simulating`, `resolvingCombat` — loading flags
- `lastResult` — most recent `CombatResult`

## Used by
- Combat preview/practice tool
- Fleet combat resolution flow
