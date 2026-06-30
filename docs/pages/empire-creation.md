# Empire Creation

**Route:** `/empire-creation`

**Purpose:** Post-registration empire setup wizard — the player configures their starting empire and the page writes initial game state to the database.

**Key Features:**
- 4-step wizard: Empire Info → Race → Starting Bonus → Confirm
- Step 1: Empire name, commander name, homeworld name inputs
- Step 2: Race selection from 9 species with different stat modifiers (resource bonuses, combat bonuses, etc.)
- Step 3: Starting bonus pick that affects initial resources, fleet, research, or buildings
- Step 4: Review and confirm before launching
- On confirm: upserts profile, sets up homeworld planet (inserts or updates), initializes player resources with race-specific modifiers, optionally inserts starting research/fleet/buildings based on bonus choice
- Navigates to `/dashboard` on success
