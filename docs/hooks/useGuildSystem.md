# useGuildSystem

## Manages
Guild (alliance-based) management: guild creation, application/join flow, member roles (leader/officer/veteran/member/recruit), permissions, treasury contributions, application approval/rejection, guild events.

## Returns
- `myGuild`, `guildMembers`, `availableGuilds`, `applications`, `guildEvents` — data arrays
- `loading` — loading state
- `createGuild`, `applyToGuild`, `joinGuild`, `leaveGuild` — lifecycle actions
- `kickMember`, `promoteMember` — member management
- `contributeToTreasury(resources)` — donate resources for contribution points
- `respondToApplication(id, accept)` — approve/deny applications
- `reload` — re-fetch all guild data

## Used by
- Guild management screens
- Guild directory/browser
