# Admin Login

**Route:** `/admin-login` and `/admin/login`

**Purpose:** Secure authentication page for admin panel access. Checks for existing admin accounts, provides first-time bootstrap flow, and blocks regular logged-in players.

**Key Features:**
- Session check on mount — if a regular user is logged in (not an admin), shows an "Access Restricted" block with options to go to dashboard or sign out
- Checks if any admin accounts exist via edge function (`check-admin-exists`) with an 8-second timeout fallback to direct DB query
- If no admins exist, shows a **System Initialization** screen with a "Initialize Root Admin" button that calls the `bootstrap-admin` edge function
- Default root credentials displayed during setup (username: `root`, password: `ChangeMe123!`)
- Login form accepts username or email + password, authenticates via `useAdminAuth` context's `signIn`
- Redirect support via `?redirect=` query parameter
- Shown only to intentionally navigated users — not wrapped by route guards (guarding happens in `AdminRoutesLayout`)
