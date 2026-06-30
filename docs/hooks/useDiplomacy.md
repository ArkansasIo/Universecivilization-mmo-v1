# useDiplomacy

## Manages
Player-to-player diplomatic relations (war, peace, alliance, trade, non-aggression) and proposals. Handles sending/responding to proposals, declaring war, offering peace, breaking alliances, and trust level changes.

## Returns
- `relations` — active and past diplomatic relations
- `proposals` — pending proposals
- `loading` — loading state
- `sendProposal`, `respondToProposal` — proposal lifecycle
- `declareWar`, `offerPeace`, `breakAlliance` — relation actions
- `updateTrustLevel(relationId, change)` — adjust trust
- `getRelationWithPlayer(playerId)`, `isAtWar`, `isAllied`, `canAttack` — query helpers
- `reload` — re-fetch data

## Used by
- Diplomacy screen
- Attack/ally confirmation dialogs
