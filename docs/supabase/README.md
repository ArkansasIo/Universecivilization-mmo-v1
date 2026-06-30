# Supabase

17 Supabase Edge Functions for server-side game logic.

## Account & Auth Functions

| Function | File | Purpose |
|---|---|---|
| [create-user-account](functions/create-user-account.md) | `create-user-account/index.ts` | Creates new user account and empire |
| [create-demo-user](functions/create-demo-user.md) | `create-demo-user/index.ts` | Creates demo/test accounts |
| [bootstrap-admin](functions/bootstrap-admin.md) | `bootstrap-admin/index.ts` | Initial admin setup |
| [seed-admin](functions/seed-admin.md) | `seed-admin/index.ts` | Seeds admin credentials |
| [check-admin-exists](functions/check-admin-exists.md) | `check-admin-exists/index.ts` | Admin existence check |
| [admin-verify-user](functions/admin-verify-user.md) | `admin-verify-user/index.ts` | Manual user verification |
| [resolve-admin-email](functions/resolve-admin-email.md) | `resolve-admin-email/index.ts` | Admin email resolution |
| [resend-verification-email](functions/resend-verification-email.md) | `resend-verification-email/index.ts` | Email re-send |
| [list-pending-verifications](functions/list-pending-verifications.md) | `list-pending-verifications/index.ts` | Pending verifications list |

## Game Logic Functions

| Function | File | Purpose |
|---|---|---|
| [process-fleet-mission](functions/process-fleet-mission.md) | `process-fleet-mission/index.ts` | Fleet movement execution |
| [process-expedition](functions/process-expedition.md) | `process-expedition/index.ts` | Expedition outcome generation |
| [resolve-combat](functions/resolve-combat.md) | `resolve-combat/index.ts` | PvP combat resolution |
| [process-missile-attack](functions/process-missile-attack.md) | `process-missile-attack/index.ts` | Interplanetary missile attacks |
| [process-marketplace-trade](functions/process-marketplace-trade.md) | `process-marketplace-trade/index.ts` | Trade execution |
| [process-resource-tick](functions/process-resource-tick.md) | `process-resource-tick/index.ts` | Resource production tick |
| [process-harvest-debris](functions/process-harvest-debris.md) | `process-harvest-debris/index.ts` | Debris field harvesting |
| [create-moon-from-debris](functions/create-moon-from-debris.md) | `create-moon-from-debris/index.ts` | Moon creation from debris |
