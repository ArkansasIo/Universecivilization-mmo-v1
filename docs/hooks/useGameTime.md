# useGameTime

## Manages
Synchronised in-game sol system clock using the formula `G = R × S` (Game time = Real time × scaling factor). Ticks via `requestAnimationFrame` and updates only when the game second changes.

## Returns
- `gameYear`, `solDay`, `hour`, `minute`, `second` — time components
- `dateDisplay` — `"2247 · Sol 142"`
- `timeDisplay` — `"14:32:00"`
- `fullDisplay` — `"Year 2247 · Sol 142 · 14:32:00 GST"`
- `serverTime`, `serverTimeLocale` — real-world clock
- `solDayName` — day of week (Solis–Jovis)

## Used by
- Game header / time display
- Any component showing in-game time
- Fleet arrival ETA calculations via `computeArrivalStardate`
