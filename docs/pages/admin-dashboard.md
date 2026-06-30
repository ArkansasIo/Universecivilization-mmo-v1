# Admin Dashboard

**Route:** `/admin-dashboard` and `/admin/dashboard`

**Purpose:** Admin control panel for managing players, server settings, admin accounts, and broadcasting messages. Wrapped by `AdminRoutesLayout` which enforces authentication.

**Key Features:**
- **Overview tab** — Game statistics dashboard (total players, alliances, ships, fleets, combats, server status)
- **Players tab** — Player management table with ban/unban, give resources, and broadcast actions
- **Settings tab** — Editable server settings grouped by category (boolean, number, and text types)
- **Admin Management tab** (super admin only) — CRUD for admin accounts; change roles (moderator/admin/super_admin), activate/deactivate, delete
- **Audit Logs tab** (super admin only) — Full audit trail of all admin actions with timestamps, admin names, action types, targets, and details
- **Verifications tab** (super admin only) — User email verification management
- **Economy, Combat, Alliances tabs** — Placeholder section headers
- Broadcast modal to send system-wide messages to all players
- Ban modal with reason textarea; resource grant modal with metal/crystal/deuterium/dark matter inputs
