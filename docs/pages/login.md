# Login

**Route:** `/login`

**Purpose:** User authentication page with email/password login, OAuth providers, and demo account access. Uses Supabase auth via `useAuth` context.

**Key Features:**
- Email/password sign-in with "remember me" option
- Redirect support via `?redirect=` query parameter
- Demo account auto-login via `?demo=true` query param (creates/resets demo account on the fly)
- Forgot password flow with email reset via Supabase `resetPasswordForEmail`
- Unconfirmed email detection with inline resend verification button via edge function
- Social login buttons for Google and Discord (OAuth via `signInWithOAuth`)
- Link to registration page for new users
