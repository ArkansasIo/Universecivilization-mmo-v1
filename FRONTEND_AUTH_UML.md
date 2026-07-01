# Frontend Auth & Index UML — Universe Civilization

> **Scope:** Home page (index), Login, Registration, Password Reset, Email Verification, Auth Callback, Auth Guard, and Dashboard redirect — the complete visitor-to-player pipeline.

---

## 1. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        React 19 SPA                              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                     App.tsx                                 │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │              <AuthProvider>                          │  │  │
│  │  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  │           <BrowserRouter>                      │  │  │
│  │  │  │  ┌──────────────────────────────────────────┐  │  │
│  │  │  │  │           <AppRoutes />                   │  │  │
│  │  │  │  │  uses useRoutes(routes[]) from config     │  │  │
│  │  │  │  └──────────────────────────────────────────┘  │  │
│  │  │  └────────────────────────────────────────────────┘  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────┐    ┌──────────────────────────────┐   │
│  │   Supabase Client     │    │   Edge Functions (server)     │   │
│  │   (singleton, lazy)   │    │   create-user-account         │   │
│  │   - auth.*()          │    │   create-demo-user            │   │
│  │   - from().*()        │    │   resend-verification-email   │   │
│  └──────────────────────┘    └──────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

### 1.1 Route Partitioning

Two distinct route groups separated by layout:

| Group | Layout | Auth Required | Example Routes |
|-------|--------|---------------|----------------|
| **Public** | None | No | `/`, `/login`, `/register`, `/verify-email`, `/reset-password`, `/auth/callback` |
| **Game** | `GameRoutesLayout` | Yes | `/dashboard`, `/fleet`, `/research`, ... (all 85+ game pages) |
| **Admin** | `AdminRoutesLayout` | Yes (admin) | `/admin-dashboard`, `/admin-register` |

---

## 2. Route Configuration Map

```
                    ┌──────────────┐
                    │      /       │  HomePage (index)
                    └──────┬───────┘
                           │
           ┌───────────────┼───────────────┬─────────────────┐
           │               │               │                 │
    ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐  ┌───────▼──────┐
    │   /login    │ │ /register   │ │/verify-email│  │/reset-password│
    │  LoginPage  │ │ RegisterPage│ │VerifyEmail  │  │ResetPassword  │
    └──────┬──────┘ └──────┬──────┘ └──────┬──────┘  └───────┬──────┘
           │               │               │                  │
           │    ┌──────────┘               │                  │
           │    │                          │                  │
    ┌──────▼────▼──────┐          ┌────────▼────────┐  ┌──────▼──────┐
    │  /auth/callback  │          │  Email inbox    │  │Reset link   │
    │  AuthCallback    │          │  (user action)  │  │(email link) │
    └──────┬───────────┘          └────────┬────────┘  └──────┬──────┘
           │                              │                   │
           └──────────────┬───────────────┘                   │
                          │                                   │
                   ┌──────▼──────┐                            │
                   │ /dashboard  │◄───────────────────────────┘
                   │  Dashboard  │
                   │  (game)     │
                   └─────────────┘
```

---

## 3. Component Tree — Home Page (`/`)

```
HomePage
├── Top Info Bar
│   ├── Developer: Empire Forge Studios
│   ├── Lead Designer: Stephen
│   ├── Version: v3.0.0 Dominion
│   └── Links: Terms | Privacy | Support | Changelog
│
├── Navigation Bar (fixed, sticky on scroll)
│   ├── Logo (crown icon + "UNIVERSE Civilization")
│   ├── Nav Links: Empire | Warfare | Civilization | Universe | Hierarchy | Races | Team | Roadmap
│   ├── [Logged Out]
│   │   ├── "Instant Demo" → /login?demo=true  (emerald gradient)
│   │   ├── "Log In" → /login
│   │   └── "Register" → /register  (gold gradient)
│   └── [Logged In]
│       ├── "Enter Dashboard" → /dashboard
│       └── "Log Out"
│
├── Hero Section (full-screen, cosmic background image + dark overlay)
│   ├── Badge: "Empires at War"
│   ├── H1: "Forge Your Civilization"
│   ├── Subtitle paragraph
│   └── CTA Row
│       ├── [Logged In]
│       │   ├── "ENTER THE UNIVERSE" → /dashboard
│       │   └── "LOG OUT"
│       └── [Logged Out]
│           ├── "ACCESS COMMAND" → /login  (gold CTA)
│           ├── "INSTANT DEMO" → /login?demo=true  (emerald CTA)
│           └── "EXPLORE" → anchor #features
│
├── Empire Pillars Section (#features)
│   ├── Military Might card
│   ├── Economic Power card
│   └── Diplomatic Mastery card
│
├── Systems of the Empire Section
│   └── 8 system cards: Fleet, Research, Crafting, Alliances, Colonies, Market, Officers, World Bosses
│
├── Warfare Section (#warfare)
│   └── War command UI preview + live stats
│
├── Civilization Building Section (#civilization)
│   └── 3 image cards: Colony, Research, Infrastructure
│
├── Universe Section (#universe)
│   └── Galaxy map + stats (50K+ Commanders, 1,200+ Alliances, 8.4M Planets, 340K Daily Battles)
│
├── Roadmap Section (#roadmap)
│   └── 4 phase cards: Foundation, Conquest, Dominion, Legacy
│
├── Development Team Section (#team)
│   └── Stephen card (Lead Designer)
│
├── Testimonials Section
│   └── Carousel with 3 player quotes
│
├── CTA Section (full-screen, throne-room background)
│   └── [Logged Out]
│       ├── "CLAIM YOUR THRONE" → /register
│       └── "INSTANT DEMO" → /login?demo=true
│
├── Footer
│   ├── Brand block
│   ├── Empire links
│   ├── Community links
│   ├── Newsletter subscription form (data-readdy-form)
│   └── Copyright + Powered by Readdy
│
└── CSS: @keyframes drift (particle animation)
```

---

## 4. Component Tree — Login Page (`/login`)

```
LoginPage
├── Background: ambient gold particles + radial glow
│
├── Branding Header
│   ├── Crown icon (gradient gold)
│   └── "UNIVERSE CIVILIZATION — Empires at War"
│
├── Card Container (glass-morphism)
│   │
│   ├── [Mode: Normal Login]
│   │   ├── Title: "Command Access"
│   │   ├── Email input (prefix icon: mail)
│   │   ├── Password input (prefix icon: shield-keyhole)
│   │   ├── Checkbox: "Remember this terminal" + "Forgot access code?"
│   │   ├── Submit: "Access Command Interface" (gold gradient)
│   │   ├── Divider: "or connect via"
│   │   ├── Social buttons: Google | Discord
│   │   ├── "New commander? Establish Empire" → /register
│   │   └── Demo section (separator)
│   │       ├── "Launch Demo Account" button
│   │       └── Hint: "Instantly explore the universe"
│   │
│   ├── [Mode: Forgot Password]
│   │   ├── Title: "Reset Access Codes"
│   │   ├── Email input
│   │   ├── "Send Reset Transmission" button
│   │   └── "Return to Command Access" back button
│   │
│   ├── [State: Error]
│   │   └── Red alert card with error message
│   │
│   └── [State: Unconfirmed Email]
│       ├── Amber card: "Your comms frequency has not been verified"
│       ├── "Resend Verification Transmission" button
│       └── Display: "Sent to user@email.com"
│
└── "Return to Imperial Court" → /
```

---

## 5. State Machine — LoginPage

```
                         ┌─────────────────────┐
                         │   IDLE (initial)    │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
     ┌────────▼────────┐  ┌────────▼────────┐  ┌─────────▼──────────┐
     │  NORMAL LOGIN   │  │ FORGOT PASSWORD │  │  ?demo=true auto   │
     │  (default view) │  │ (toggle view)   │  │  trigger           │
     └────────┬────────┘  └────────┬────────┘  └─────────┬──────────┘
              │                    │                      │
     ┌────────▼────────┐  ┌────────▼────────┐  ┌─────────▼──────────┐
     │   SUBMITTING    │  │ SUBMITTING      │  │  DEMO_LOADING      │
     │   (loading)     │  │ (resetLoading)  │  │  (demoLoading)     │
     └────────┬────────┘  └────────┬────────┘  └─────────┬──────────┘
              │                    │                      │
   ┌──────────┼──────────┐  ┌──────┼──────┐      ┌───────┼───────┐
   │          │          │  │      │      │      │       │       │
┌──▼──┐ ┌────▼────┐ ┌───▼──┐ ┌─▼─┐ ┌──▼──┐ ┌──▼──┐ ┌──▼──┐
│ERROR│ │SUCCESS  │ │UNCON │ │OK │ │ERROR│ │OK  │ │ERROR│
│     │ │redirect │ │FIRMED│ │   │ │     │ │→sign│ │     │
│     │ │/dashboard│ │EMAIL │ │   │ │     │ │in   │ │     │
└──┬──┘ └─────────┘ └──┬───┘ └───┘ └─────┘ └─────┘ └─────┘
   │                    │
   │           ┌────────▼────────┐
   │           │RESEND VERIFY    │
   │           │(resendVerify)   │
   │           └────────┬────────┘
   │                    │
   │           ┌────────┼────────┐
   │      ┌────▼───┐ ┌──▼────┐
   │      │SUCCESS │ │ERROR  │
   │      │(toast) │ │(toast)│
   │      └────────┘ └───────┘
   │
   └──► Back to IDLE
```

---

## 6. AuthContext — State Machine & Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     AuthProvider                             │
│                                                             │
│  State:                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐              │
│  │ loading  │  │ user     │  │ profile      │              │
│  │ boolean  │  │ User|null│  │ ProfileData? │              │
│  └──────────┘  └──────────┘  └──────────────┘              │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              dataEnsuredRef (boolean)                 │   │
│  │  Prevents duplicate ensurePlayerData() calls per     │   │
│  │  session. Reset on SIGNED_IN and SIGNED_OUT.         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  Public API:                                                │
│  ┌─────────────┐ ┌──────────┐ ┌───────────┐ ┌───────────┐  │
│  │ signIn()    │ │ signUp() │ │ signOut() │ │refresh()  │  │
│  │ email+pass  │ │ email+   │ │           │ │Profile()  │  │
│  │ +rememberMe │ │ pass+    │ │           │ │           │  │
│  │             │ │ username │ │           │ │           │  │
│  └─────────────┘ └──────────┘ └───────────┘ └───────────┘  │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  AuthProvider Lifecycle                                       │
│                                                              │
│  1. MOUNT                                                     │
│     ├── Check sessionStorage for 'sessionOnly' flag           │
│     │   └── If true: wipe localStorage supabase keys,        │
│     │       clear flag, set user=null, done                  │
│     ├── supabase.auth.getSession()                           │
│     │   ├── On error (JWT corruption): wipe keys, signOut    │
│     │   ├── On session: setUser → fetchProfile →             │
│     │   │   ensurePlayerData()                               │
│     │   └── Finally: setLoading(false)                       │
│     └── supabase.auth.onAuthStateChange() listener           │
│         ├── SIGNED_IN: setUser → fetchProfile →              │
│         │   reset dataEnsuredRef → ensurePlayerData()        │
│         └── SIGNED_OUT: clear profile + reset ref            │
│                                                              │
│  ensurePlayerData(userId, email, username):                   │
│     1. Check 3 tables in parallel (profiles, resources,      │
│        planets)                                              │
│     2. Create profile if missing (upsert)                    │
│     3. Create resources if missing (500 metal, 300 crystal,  │
│        100 deuterium, 10k imperial credits)                  │
│     4. Create homeworld planet + 3 starter buildings if      │
│        missing                                               │
│     5. Mark dataEnsuredRef = true                            │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  signIn(email, password, rememberMe)                          │
│                                                              │
│  ┌─────────────────┐                                         │
│  │ signInWithPwd() │──► Error? ──► throw                     │
│  └────────┬────────┘                                         │
│           │ Success                                           │
│     ┌─────▼──────┐                                           │
│     │ rememberMe?│──► NO: wipe localStorage sb-* keys       │
│     └─────┬──────┘    set sessionStorage 'sessionOnly'       │
│           │ YES: session persists (default Supabase)         │
│           │                                                  │
│     ┌─────▼──────────────────────────────────┐               │
│     │ onAuthStateChange fires SIGNED_IN      │               │
│     │ → setUser, fetchProfile, ensureData    │               │
│     └────────────────────────────────────────┘               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  signUp(email, password, username)                            │
│                                                              │
│  1. supabase.auth.signUp()                                   │
│     └── Creates auth user (confirms per project config)      │
│  2. Store pending registration wizard data in sessionStorage  │
│  3. If session exists (auto-confirmed):                      │
│     → navigate /auth/callback                                │
│  4. If no session (email verification required):             │
│     → store email in sessionStorage                          │
│     → navigate /verify-email                                 │
│                                                              │
│  NOTE: create-user-account edge function is called by the    │
│  signUp → callback flow, not directly from the client.       │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  signOut()                                                    │
│                                                              │
│  supabase.auth.signOut()                                     │
│   → clear user, profile, dataEnsuredRef                      │
│   → remove sessionStorage 'sessionOnly'                      │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. Sequence Diagram — Full Login Flow

```
Visitor          HomePage        LoginPage       AuthContext       Supabase        EdgeFn          Dashboard
  │                 │               │                │                │               │               │
  │──GET /──────────►│               │                │                │               │               │
  │                 │──read user────►│ (null)         │                │               │               │
  │◄───render home──│               │                │                │               │               │
  │                 │               │                │                │               │               │
  │──click "Login"─►│               │                │                │               │               │
  │──navigate /login────────────────►│                │                │               │               │
  │                 │               │──read user────►│                │               │               │
  │                 │               │◄───null────────│                │               │               │
  │◄───render login─│               │                │                │               │               │
  │                 │               │                │                │               │               │
  │──enter creds────────────────────►│                │                │               │               │
  │──click submit───────────────────►│                │                │               │               │
  │                 │               │──signIn()─────►│                │               │               │
  │                 │               │                │──signInPassword►│               │               │
  │                 │               │                │◄───session─────│               │               │
  │                 │               │                │──onAuthState:  │               │               │
  │                 │               │                │  SIGNED_IN     │               │               │
  │                 │               │                │──setUser()     │               │               │
  │                 │               │                │──fetchProfile()│               │               │
  │                 │               │                │◄───profile─────│               │               │
  │                 │               │                │──ensurePlayer──►               │               │
  │                 │               │                │  Data()        │               │               │
  │                 │               │                │  (parallel     │               │               │
  │                 │               │                │   checks on    │               │               │
  │                 │               │                │   profiles,    │               │               │
  │                 │               │                │   resources,   │               │               │
  │                 │               │                │   planets)     │               │               │
  │                 │               │◄──complete─────│                │               │               │
  │                 │               │──navigate──────────────────────────────────────────►│
  │                 │               │  /dashboard                                         │
  │◄───dashboard────│               │                │                │               │               │
```

---

## 8. Sequence Diagram — Demo Login Flow

```
Visitor          HomePage        LoginPage       AuthContext       Supabase        create-user    create-demo
  │                 │               │                │                │              -account       -user
  │──click "Demo"──►│               │                │                │               │               │
  │──navigate───────────────────────►│                │                │               │               │
  │    /login?demo=true             │                │                │               │               │
  │                 │               │──detect        │                │               │               │
  │                 │               │  ?demo=true    │                │               │               │
  │                 │               │                │                │               │               │
  │                 │               │──attempt signIn───────────────►│               │               │
  │                 │               │  demo@universe-civ.local       │               │               │
  │                 │               │◄───error (no user)─────────────│               │               │
  │                 │               │                │                │               │               │
  │                 │               │──POST /create-user-account────►│               │               │
  │                 │               │                │                │──────────────►│               │
  │                 │               │                │                │◄───409:exists─│               │
  │                 │               │                │                │               │               │
  │                 │               │──POST /create-demo-user────────►│               │               │
  │                 │               │                │                │──────────────────────────────►│
  │                 │               │                │                │◄───reset + re-seed────────────│
  │                 │               │                │                │               │               │
  │                 │               │──signIn(demo@..., Demo123!)────►│               │               │
  │                 │               │                │──signInPassword►               │               │
  │                 │               │                │◄───session─────│               │               │
  │                 │               │                │──SIGNED_IN────►               │               │
  │                 │               │                │──fetchProfile, ensureData      │               │
  │                 │               │──navigate /dashboard                            │               │
```

---

## 9. Sequence Diagram — Registration + Email Verification

```
Visitor        RegisterPage    AuthContext      Supabase      /auth/callback   VerifyEmail    create-user    Email
  │                 │               │               │               │              │           -account     Inbox
  │──GET /register─►│               │               │               │              │               │          │
  │◄──wizard UI────│               │               │               │              │               │          │
  │                 │               │               │               │              │               │          │
  │──fill steps 1-5────────────────►│               │               │              │               │          │
  │──click LAUNCH──►│               │               │               │              │               │          │
  │                 │──signUp()────►│               │               │              │               │          │
  │                 │               │──signUp()────►│               │              │               │          │
  │                 │               │               │──POST────────►              │               │          │
  │                 │               │               │  /create-user-account       │               │          │
  │                 │               │               │◄───success──────────────────│               │          │
  │                 │               │               │                              │               │          │
  │  ┌──Branch A: project configured to auto-confirm ──────────────────────────────│───────────────│──────────│
  │  │              │               │               │                              │               │          │
  │  │              │◄──session────│               │                              │               │          │
  │  │              │──navigate /auth/callback─────►│                              │               │          │
  │  │              │               │               │──getSession()───────────────►│               │          │
  │  │              │               │               │◄───session───────────────────│               │          │
  │  │              │               │               │──completeRegistration()      │               │          │
  │  │              │               │               │──navigate /dashboard          │               │          │
  │  │              │               │               │                              │               │          │
  │  └──Branch B: email confirmation required ──────────────────────────────────────│───────────────│──────────│
  │                 │               │◄──no session──│                              │               │          │
  │                 │──store email──────────────────►│                              │               │          │
  │                 │  in sessionStorage            │                              │               │          │
  │                 │──navigate /verify-email───────────────────────►│               │               │          │
  │                 │               │               │               │──render UI────│               │          │
  │                 │               │               │               │               │               │          │
  │  ════════════════════════ USER CHECKS INBOX ══════════════════════════════════════════════════════►│
  │                 │               │               │               │               │               │  clicks  │
  │                 │               │               │               │               │               │  link    │
  │                 │               │               │               │◄──browser opens───────────────(callback)──│
  │                 │               │               │──getSession()►│               │               │          │
  │                 │               │               │◄──session─────│               │               │          │
  │                 │               │               │──completeReg()│               │               │          │
  │                 │               │               │──navigate /dashboard            │               │          │
```

---

## 10. Sequence Diagram — Password Reset

```
Visitor        LoginPage          Supabase         Email          ResetPassword
  │               │                  │               │                │
  │──click────────►                  │               │                │
  │  "Forgot"     │                  │               │                │
  │               │──toggle to       │               │                │
  │               │  forgot mode     │               │                │
  │◄──UI─────────│                  │               │                │
  │               │                  │               │                │
  │──enter email──►                  │               │                │
  │──click submit─►                  │               │                │
  │               │──resetPassword   │               │                │
  │               │  ForEmail()─────►│               │                │
  │               │◄──ok────────────│               │                │
  │◄──success────│                  │               │                │
  │  toast        │                  │               │                │
  │               │                  │               │                │
  │  ════════════════ USER CHECKS INBOX ═════════════════════════►│
  │               │                  │          sends link          │
  │               │                  │─────────────────────────────►│
  │               │                  │               │  clicks      │
  │               │                  │               │  link        │
  │               │                  │               │              │
  │──opens link──────────────────────────────────────────────────►│
  │               │                  │               │              │
  │               │                  │               │──Supabase    │
  │               │                  │               │  processes   │
  │               │                  │               │  hash token  │
  │               │                  │               │              │
  │               │                  │               │──getSession()│
  │               │                  │               │  → session   │
  │               │                  │               │              │
  │◄──UI─────────│                  │               │──render form─│
  │               │                  │               │              │
  │──enter new────│                  │               │              │
  │  password─────────────────────────────────────────────────────►│
  │──click submit─────────────────────────────────────────────────►│
  │               │                  │               │──updateUser()│
  │               │                  │               │──signOut()   │
  │◄──success────│                  │               │──"Sign In"───│
  │  toast        │                  │               │  button      │
  │               │                  │               │              │
  │──click────────►                  │               │              │
  │  "Sign In"    │                  │               │              │
```

---

## 11. Auth Guard — GameRoutesLayout

```
┌──────────────────────────────────────────────────────────────┐
│  GameRoutesLayout (wraps all 85+ game pages)                 │
│                                                              │
│  Entry: Any /dashboard, /fleet, /research, etc.              │
│                                                              │
│  ┌─────────────┐                                             │
│  │ useAuth()   │──► { user, loading }                       │
│  └──────┬──────┘                                             │
│         │                                                    │
│    ┌────▼─────────────────────────┐                          │
│    │ loading && !forceReady?      │                          │
│    │ (forceReady = 6s timeout)    │                          │
│    └────┬─────────────────────────┘                          │
│         │                                                    │
│    YES  │  NO                                                │
│    ┌────▼────┐         ┌─────────▼──────────┐                │
│    │ Spinner │         │ !user && !loading? │                │
│    │ "Init   │         └─────────┬──────────┘                │
│    │ Systems"│                   │                           │
│    └─────────┘              YES  │  NO                       │
│                       ┌──────────▼──────┐  ┌──────────────┐  │
│                       │ <Navigate to    │  │ <GameLayout>  │  │
│                       │  /login?        │  │   <Outlet />  │  │
│                       │  redirect=      │  │ </GameLayout> │  │
│                       │  {current_url}  │  └──────────────┘  │
│                       └─────────────────┘                    │
│                                                              │
│  On successful login, user is redirected back to original    │
│  URL via the ?redirect= query parameter.                     │
│                                                              │
│  Also runs: useBackgroundProcessor() every 15s               │
│  → trade routes, espionage, stargate, planetary events,      │
│    fleet arrivals, content cleanup                           │
└──────────────────────────────────────────────────────────────┘
```

---

## 12. Data Flow — `rememberMe` Persistence

```
┌─────────────────────────────────────────────────────────────┐
│  rememberMe = true (default)                                 │
│  ─────────────────────────                                  │
│  Supabase stores session in localStorage (sb-* keys)        │
│  On next visit: getSession() finds valid session            │
│  → Auto-login, no prompt needed                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  rememberMe = false                                          │
│  ──────────────────                                         │
│  1. signInWithPassword() succeeds                           │
│  2. AuthContext.signIn() wipes ALL localStorage sb-* keys   │
│  3. Sets sessionStorage.setItem('sessionOnly', 'true')      │
│  4. Supabase client retains in-memory session               │
│  5. On next visit: getSession() first checks sessionStorage │
│     flag, finds 'sessionOnly'=true → wipes any lingering    │
│     localStorage → sets user=null → requires re-login       │
│  6. On explicit signOut: sessionStorage cleared             │
└─────────────────────────────────────────────────────────────┘
```

---

## 13. JWT Corruption Recovery

```
┌──────────────────────────────────────────────────────────────┐
│  Pre-Init Cleanup (in supabase.ts, before createClient)      │
│                                                              │
│  1. Iterate all localStorage keys                            │
│  2. For each 'sb-*' key:                                    │
│     ├── Parse JSON value                                     │
│     ├── Extract access_token or token                        │
│     ├── Check token.split('.').length === 3                 │
│     └── If != 3: mark corrupted                             │
│  3. If any corruption found: wipe ALL sb-* keys              │
│                                                              │
│  Runtime Recovery (in AuthProvider):                         │
│  ─────────────────────────────────                          │
│  If getSession() throws JWT/token error:                     │
│    1. Wipe all sb-* localStorage keys                       │
│    2. supabase.auth.signOut({ scope: 'local' })             │
│    3. Set user=null, profile=null                            │
│    4. User sees clean login page (no crash)                  │
└──────────────────────────────────────────────────────────────┘
```

---

## 14. Edge Functions Used by Auth Flow

| Function | Trigger | Purpose |
|----------|---------|---------|
| `create-user-account` | Registration POST + Demo account creation | Creates complete empire: profile, resources, homeworld planet, 10 buildings, fleet, research slots, leaderboard entry |
| `create-demo-user` | Demo login (when account exists but data corrupted) | Resets demo account data to fresh state: re-seeds all tables for demo@universe-civ.local |
| `resend-verification-email` | Login page (unconfirmed email detected) + Verify page | Resends Supabase email verification link to user's email |

---

## 15. Complete Page State Matrix

| Page | Logged Out | Logged In | No Supabase Config | Notes |
|------|-----------|-----------|-------------------|-------|
| `/` Home | Shows CTA: Login, Register, Demo | Shows: Enter Dashboard, Logout | Works normally (static) | Auto-scroll nav, sticky on scroll |
| `/login` | Shows login form | Auto-redirects to /dashboard | Shows demo still works | ?demo=true auto-triggers |
| `/register` | Shows 5-step wizard | Redirects to /dashboard | Shows error on submit | Stores pending data for callback |
| `/verify-email` | Shows verify UI | Redirects to /dashboard | Resend button works | Pulls email from query param or sessionStorage |
| `/reset-password` | Shows reset form | Redirects to /dashboard | Would fail on submit | Waits for Supabase token processing |
| `/auth/callback` | Processes token, sets up empire | N/A | Shows error | Completes registration setup |
| `/dashboard`+ | Redirects to /login | Shows game shell | Shows login (can't auth) | Auth guard in GameRoutesLayout |
| `*` NotFound | Shows 404 | Shows 404 | Shows 404 | Catch-all |

---

## 16. Key Design Decisions

1. **AuthProvider wraps entire app** — Single source of truth for user/profile state, all pages react to auth changes.

2. **Lazy-loaded routes** — Every page uses `React.lazy()`, keeping the bundle split per route.

3. **Demo account is persistent** — `demo@universe-civ.local` / `Demo123!` exists in the database, gets reset by `create-demo-user` edge function if data is corrupt. Instant access, no registration.

4. **"Remember me" is explicit** — Defaults to true (persistent session). When false, sessionStorage flag prevents cross-session persistence without touching Supabase's own storage.

5. **Self-healing JWT** — Both pre-init and runtime recovery handle corrupted auth tokens so users never see a white screen crash.

6. **ensurePlayerData is idempotent** — Checks existence before inserting, runs on every SIGNED_IN, gated by a ref to prevent duplicate calls.

7. **Registration is a 5-step wizard** — Race selection, empire identity, starting bonus — stored in sessionStorage and applied by `/auth/callback` after email verification.

8. **Newsletter form uses Readdy Forms** — Footer subscription is a `data-readdy-form` posting to a Readdy form URL, not Supabase. No backend needed.

---

*Generated: 2026-06-24 | Scope: Frontend auth + index pages | Universe Civilization v3.0.0*