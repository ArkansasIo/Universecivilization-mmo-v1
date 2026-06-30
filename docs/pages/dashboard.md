# Dashboard

- **Route:** `/dashboard`
- **Purpose:** Main game hub — central overview of the player's empire status, resources, active operations, and recent events.

## Key Features

- Progressive data loading from `supabase` across five phases: planets, stats, fleets, queues, events
- Real-time ticker for war alerts and galactic events
- Server Pulse Bar showing live universe stats (active players, battles, ships destroyed, trades)
- `useGameTime` for stardate/time display
- `useTimeBasedEvents` for active modifiers (weekend bonuses, celestial events, holidays, boss spawns)
- `WelcomeBackCelebration` component for returning guest players

## UI Sections

| Section | Description |
|---|---|
| **Planet Hero** | Cinematic planet header with background image, name, coordinates, type, temperature, field usage, and status badges (homeworld/capital/colony). Planet selector pills to switch between owned planets. |
| **Time Events Banner** | Shows active modifiers: double resource weekends, celestial events, holidays, and world boss spawn alerts. |
| **Resource HUD** | Gauge-style resource cards for Metal, Crystal, Deuterium, Energy — displays current value, capacity bar, and hourly production rate. |
| **Empire Power Grid** | Big stat cards for total fleet power, defense power, research points, total buildings, and ships. Animated number transitions. |
| **Tactical Event Feed** | Recent combat logs and game events with color-coded outcomes (victory/defeat/repelled), icons, and timestamps. |
| **Operations Panel** | Active fleet movements (with mission type, ETA, progress bars), construction queue, and research queue. Pills show counts for fleets, building, and research. |
| **Command Dock** | Quick-action grid: Build, Research, Shipyard, Defense, Fleet, Galaxy, Combat, Market — each navigates to the respective page. |
