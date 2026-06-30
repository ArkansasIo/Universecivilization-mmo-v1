# useSeasonPass

Manages the seasonal battle pass — tier progression, reward claiming, and premium activation.

## Returns

- `seasonPass` — `{ current_tier, experience, is_premium, claimed_tiers }`
- `tiers` — all season pass tiers with free and premium rewards
- `loading` — boolean for initial load
- `addExperience(amount)` — adds XP, checks for tier-ups
- `claimReward(tier, isPremium)` — claims rewards for a tier (checks eligibility)
- `purchasePremium()` — unlocks premium track for 1000 dark matter
- `reload` — refreshes from Supabase

## Features

- Season pass/battle pass system
- Free vs premium reward tracks
- Tier progression from XP
- Resource and item rewards
