# useAchievementSystem

## Manages
Tracking and persistence of player achievements via Supabase. Seeds achievement rows on first login, upserts progress, and fires toast notifications on unlock.

## Returns
- `achievements` — all achievement rows for the user
- `loading` — loading state
- `toasts` — unlock notifications to display
- `trackEvent(eventType, delta?)` — increment counters for building/research/combat/fleet/resource events
- `dismissToast(id)` — dismiss a toast
- `refreshAchievements` — re-fetch all achievements

## Used by
- `useBuildingQueue` (tracks `building_complete`)
- `useFleetManager` (tracks `fleet_sent`, `combat_victory`, `resources_plundered`)
- Any hook that fires research, combat, or fleet events
