# useSkillSystem

Manages player skills — leveling up abilities across combat, economic, research, exploration, and diplomatic categories.

## Returns

- `skills` — all available skills with current levels
- `playerSkills` — raw `{ [skillId]: level }` map from Supabase
- `loading` — boolean for initial load
- `upgradeSkill(skillId, skillPointsAvailable)` — spends skill points to level up a skill
- `getSkillBonus(skillId, effectType)` — calculates bonus value for a specific skill and effect
- `getTotalBonus(effectType)` — aggregates bonus across all leveled skills
- `reload` — refreshes from Supabase

## Available Skills

Combat Mastery, Defensive Tactics, Resource Efficiency, Trade Expertise, Research Speed, Construction Speed, Exploration Mastery, Fleet Capacity, Espionage Mastery, Diplomatic Influence, Energy Mastery, Colonization Expert

## Features

- Skill tree with 12 skills across 5 categories
- Per-level stat bonuses
- Skill point economy (from player leveling)
- Effect aggregation for game systems
