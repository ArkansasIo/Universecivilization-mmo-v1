# useAdvancedCombat

## Manages
Multi-unit combat simulation with technology modifiers, shield/armor calculations, per-round battle reports, and debris field/loot/experience calculations.

## Returns
- `simulateBattle(attacker, defender)` — runs a full ship-vs-ship battle simulation, returns `BattleResult`
- `saveBattleReport(attackerId, defenderId, result)` — persists battle results to Supabase
- `isSimulating` — boolean flag

## Used by
- Combat UI components that need detailed damage breakdowns
- Battle report viewer
