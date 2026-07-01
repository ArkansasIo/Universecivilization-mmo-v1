# useInsuranceSystem

## Manages
Ship insurance policies: purchase with premium calculation, claim filing (95% approval rate), policy cancellation (50% premium refund), insurable ship listing, and stats (premiums paid, payouts received).

## Returns
- `policies`, `activePolicies` — insurance policy lists
- `stats` — aggregate totals (policies, premiums, payouts, claims)
- `loading`, `error`, `processingClaim` — state
- `purchaseInsurance(shipId, shipName, shipType, shipValue, coverage%, currency, durationDays)` — buy a policy
- `fileClaim(policyId)` — submit a claim (95% chance of payout)
- `cancelPolicy(policyId)` — cancel with 50% refund
- `getInsurableShips()` — fetch docked ships with estimated values
- `refreshPolicies` — re-fetch

## Used by
- Insurance broker UI
- Ship management detail panels
