# Register

**Route:** `/register`

**Purpose:** Multi-step registration wizard that creates a new Supabase auth account and collects empire identity, race, and starting bonus preferences.

**Key Features:**
- 5-step wizard: Account → Identity → Race → Bonus → Launch
- Step 1: Commander name, email, password, confirm password, terms acceptance
- Step 2: Empire name, commander title, homeworld name (with character limits)
- Step 3: Race selection from 9 playable races (terran, zenthari, draken, korvax, golrath, nexar, aquarian, velhari, skarran) with lore tooltips
- Step 4: Starting bonus pick (Resource Cache, Military Fleet, Research Head Start, Economic Boost)
- Step 5: Review summary of all choices before submitting
- Creates Supabase account via `signUp`; stores pending registration data in session for callback processing
- Auto-navigates to `/auth/callback` (auto-confirm) or `/verify-email` (if email verification required)
