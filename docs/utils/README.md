# Utilities

Shared utility functions used across the application.

| File | Purpose |
|---|---|
| [gameCalculations.md](gameCalculations.md) | Game math: build costs, build time, resource formatting, ship power calculations |
| [registrationSetup.md](registrationSetup.md) | Registration flow: pending registration storage, user account creation in Supabase |

## gameCalculations.ts

Key exports:
- `calculateBuildingCost(baseCost, level)` — Resource cost for building level
- `calculateBuildTime(baseTime, level, robotFactory)` — Construction duration
- `formatTime(seconds)` — Human-readable time display
- `formatNumber(n)` — Number formatting with K/M/B suffixes

## registrationSetup.ts

Key exports:
- `completeRegistration(userId, empireData)` — Finalize user registration
- `getPendingRegistration()` — Retrieve pending registration data
- `clearPendingRegistration()` — Clean up after registration
