# usePirateSystem

Manages pirate PvE gameplay — fleet generation, hunting, combat simulation, and reputation.

## Returns

- `pirateFleets` — generated pirate fleets with difficulty tiers (easy → legendary)
- `activeHunts` — ongoing player hunts loaded from missions table
- `reputation` — player pirate reputation (rank, kills, loot, bounties)
- `loading` / `error` — state indicators
- `huntPirates(pirateFleetId, playerFleetId)` — starts a hunt mission (30 min travel)
- `engagePirates(huntId)` — resolves combat via power comparison, awards loot/reputation
- `claimBounty(difficulty)` — claims a bounty reward based on difficulty tier
- `refreshFleets` / `refreshHunts` / `refreshReputation` — reload functions

## Features

- Pirate hunting / PvE combat
- Difficulty-based loot tables
- Pirate reputation ranks (Novice → Legendary Hunter)
