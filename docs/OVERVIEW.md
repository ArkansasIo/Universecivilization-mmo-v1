# Project Architecture Overview

## System Architecture

```
Browser ──► Vite Dev Server / Static Build
                │
                ├── React App (SPA)
                │     ├── Router (lazy pages)
                │     ├── Auth Contexts
                │     ├── Game Layout Shell
                │     ├── Background Processor
                │     └── Pages (code-split chunks)
                │
                ├── Supabase Client
                │     ├── Auth (login, register, session)
                │     ├── Database (real-time subscriptions)
                │     └── Edge Functions (background processing)
                │
                └── Third Party
                      ├── Stripe (payments)
                      ├── Firebase (secondary auth)
                      └── Three.js (3D universe)
```

## Key Design Patterns

### 1. Lazy-Loaded Pages
All 100+ page routes use `React.lazy()` for code splitting. Each page is a separate JS chunk loaded on demand.

### 2. Custom Hooks as Services
Game logic lives in hooks (`src/hooks/`) rather than being embedded in components. Hooks manage state, supabase subscriptions, and side effects.

### 3. Static Data Definitions
Game content (ships, weapons, buildings, etc.) is defined in `src/data/` as typed constants. No runtime fetching for static definitions.

### 4. Configuration-Driven
Many game mechanics are controlled by config files (`src/config/`) enabling parameter tuning without code changes.

### 5. Background Processing
A `useBackgroundProcessor` hook runs a 15-second interval loop that processes trade routes, espionage, stargate jumps, planetary events, fleet arrivals, and content cleanup.

## Data Flow

```
User Action
    ↓
Page Component
    ↓
Custom Hook (use*)
    ↓
Supabase Client    ←── Edge Functions (server-side logic)
    ↓
PostgreSQL Database
    ↓
Real-time Subscription
    ↓
State Update (useState/useReducer)
    ↓
React Re-render
```

## Route Structure

| Route Category | Count | Layout |
|---|---|---|
| Public | 10+ | None |
| Admin | 4+ | AdminRoutesLayout |
| Game | 90+ | GameRoutesLayout → GameLayout |
| 404 | 1 | None |

See [Router Docs](router/README.md) for full route table.

## File Conventions

- `src/pages/<page-name>/page.tsx` — Page entry component
- `src/pages/<page-name>/components/` — Page-specific sub-components
- `src/hooks/use<SystemName>.ts` — Custom hook per game system
- `src/data/<entityName>.ts` — Static game data definitions
- `src/config/<category>.ts` — Game configuration
