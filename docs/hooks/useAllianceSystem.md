# useAllianceSystem

## Manages
Alliance lifecycle: creation, joining, leaving, member management (kick/promote), and contribution tracking. Queries `alliances` and `alliance_members` tables.

## Returns
- `alliance` — current user's alliance or null
- `members` — alliance member list with roles and contributions
- `allAlliances` — top 50 alliances by power
- `loading` — loading state
- `createAlliance`, `joinAlliance`, `leaveAlliance` — lifecycle actions
- `kickMember`, `promoteToOfficer` — member management
- `addContribution(amount)` — increment contribution points
- `reload` — re-fetch all alliance data

## Used by
- Alliance management screens
- Alliance directory/ranking UI
