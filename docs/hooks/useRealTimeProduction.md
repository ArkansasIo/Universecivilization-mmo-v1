# useRealTimeProduction

Calculates and simulates real-time resource production from buildings and research bonuses.

## Returns

- `productionRates` — per-second resource rates `{ metal, crystal, deuterium, energy, energyConsumption }`
- `storageCapacity` — max storage per resource
- `currentResources` — live resource totals updated every second
- `researchBonuses` — percentage bonuses from plasma/energy/mining/deuterium techs
- `isProducing` — whether any production is active
- `energyEfficiency` — production multiplier based on energy ratio (0–100%)
- `storagePercentage` — fill percentage for each resource
- `recalculate` — recalculates production from building data
- `refreshBonuses` — recalculates research bonuses

## Simulation

- Accumulates resources client-side every 1s
- Syncs to Supabase `resources` table every 10s
- Energy deficiency reduces all production proportionally
- Storage caps are enforced

## Features

- Real-time resource display
- Production rate calculations from building levels
- Research bonus integration
