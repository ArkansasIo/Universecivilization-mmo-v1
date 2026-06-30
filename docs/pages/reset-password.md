# Reset Password

**Route:** `/reset-password`

**Purpose:** Allows users to set a new password after clicking the reset link sent via email. Uses Supabase's automatic recovery token handling from URL hash.

**Key Features:**
- Waits for Supabase to process the recovery token from the URL hash and establish a session
- Shows loading state while verifying the reset token
- Validates password length (min 6 chars) and confirm match
- Calls `supabase.auth.updateUser({ password })` to set the new password
- Signs the user out after successful reset so they log in fresh
- Displays success state with a button to navigate to `/login`
- Shows error for invalid/expired links
