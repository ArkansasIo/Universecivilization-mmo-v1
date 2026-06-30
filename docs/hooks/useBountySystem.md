# useBountySystem

## Manages
Bounty placement, claiming, and cancellation. Generates NPC bounties and computes bounty hunter ranking based on player power/level.

## Returns
- `bounties` — active bounty list
- `myPlacedBounties` — bounties placed by the user
- `bountyTargets` — player profiles eligible for bounties
- `leaderboard` — top bounty hunters by power
- `bountyHunterRank` — computed rank title
- `loading`, `error` — state
- `placeBounty` — place a bounty on a target (deducts credits)
- `claimBounty` — claim reward for completing a bounty
- `cancelBounty` — cancel own bounty (80% refund)
- `refreshBounties`, `refreshTargets`, `refreshLeaderboard` — data refreshers

## Used by
- Bounty board UI
- Bounty hunter profile display
