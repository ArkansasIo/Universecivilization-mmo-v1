# Verify Email

**Route:** `/verify-email`

**Purpose:** Displays after registration when email verification is required. Instructs the user to check their inbox and allows resending the verification email.

**Key Features:**
- Shows email address from query param `?email=` or from `sessionStorage` (set during registration)
- Displays a 3-step instruction: check inbox, click activation link, then launch empire
- Resend verification button with 60-second cooldown countdown timer
- Calls a Supabase edge function (`resend-verification-email`) to resend
- Manual email input field if no email was passed via query/session
- Link back to login page
