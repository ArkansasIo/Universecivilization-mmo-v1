# Auth Callback

**Route:** `/auth/callback`

**Purpose:** Handles post-authentication processing — called after Supabase email verification, OAuth redirect, or auto-confirm registration. Completes the registration flow by writing pending empire data to the database.

**Key Features:**
- Waits 800ms for Supabase to process URL hash tokens
- Retrieves current Supabase session; shows error if no session found
- If pending registration data exists in session storage, calls `completeRegistration()` to write empire data to the database
- Three-state UI: processing (spinner), success (checkmark + redirect to dashboard), error (warning + link to login)
- Auto-redirects to `/dashboard` after 1.2s on success
- Handles cleanup with cancellation flag to prevent state updates after unmount
