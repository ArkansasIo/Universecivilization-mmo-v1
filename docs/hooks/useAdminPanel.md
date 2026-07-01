# useAdminPanel

## Manages
Admin dashboard: game stats, player list, admin user management, admin action logs, and server-wide broadcast messages.

## Returns
- `stats` — counts of players, alliances, ships, fleets, combats
- `players`, `admins`, `adminLogs` — raw data arrays
- `loading`, `adminLoading` — loading states
- `loadStats`, `loadPlayers`, `loadAdmins`, `loadAdminLogs` — data fetchers
- `updateAdminRole`, `toggleAdminStatus`, `deleteAdmin` — admin CRUD
- `banPlayer`, `unbanPlayer`, `giveResources`, `adjustPlayerLevel`, `deletePlayer` — player management
- `broadcastMessage` — system-wide message to all players

## Used by
- Admin panel UI components
