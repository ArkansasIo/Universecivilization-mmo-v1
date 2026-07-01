# useUniverseReputation

Manages faction reputation standings — effects, missions, and relationship levels.

## Returns

- `factions` — all available factions with benefit tiers
- `reputations` — `Map<factionId, ReputationStanding>` with reputation score, level, title, relation status
- `missions` — available and locked reputation missions
- `loading` — boolean for initial load
- `addReputation(factionId, amount)` — changes reputation, recalculates level/status/title, updates mission availability
- `completeMission(missionId)` — completes a mission, grants reputation and rewards
- `getFactionReputation(factionId)` — standing lookup
- `getAvailableMissions(factionId)` / `getAllMissions(factionId)` — mission filters
- `getFactionBenefits(factionId)` — perks at current standing level

## Factions

Terran Federation (military), Galactic Trade Consortium (trade), Science Collective (science), Void Pirates (pirate), Ancient Guardians (ancient), Neutral Alliance (neutral)

## Reputation Levels

-10000–50000 range, 10 levels per faction, 5 relation statuses (hostile → allied). Higher levels unlock better perks and missions.

## Features

- Multi-faction reputation system
- Level-based faction perks (10 levels per faction)
- Procedurally generated missions
- Relation status effects (hostile → allied)
- Peristence to Supabase
