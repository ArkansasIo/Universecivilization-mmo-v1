# Universe Civilization MMO — Documentation

> A browser-based space empire MMO built with React, TypeScript, Supabase, and Vite.

## Quick Links

| Category | Description | Docs |
|---|---|---|
| [Pages](pages/) | 100+ game page routes | [README](pages/README.md) |
| [Hooks](hooks/) | 69 custom React hooks | [README](hooks/README.md) |
| [Data](data/) | 41+ static data definition files | [README](data/README.md) |
| [Config](config/) | 10 game configuration files | [README](config/README.md) |
| [Components](components/) | 22 shared UI components | [README](components/README.md) |
| [Contexts](contexts/) | 2 React context providers | [README](contexts/README.md) |
| [Router](router/) | Route definitions and navigation | [README](router/README.md) |
| [Utils](utils/) | Utility functions | [README](utils/README.md) |
| [Types](types/) | TypeScript type definitions | [README](types/README.md) |
| [Supabase](supabase/) | 17 edge functions | [README](supabase/README.md) |

## Project Overview

```
src/
├── pages/          # 107 page routes (lazy-loaded)
├── hooks/          # 69 custom hooks for game systems
├── data/           # 41+ static data files
├── config/         # 10 configuration modules
├── components/     # 22 shared UI components
├── contexts/       # 2 auth context providers
├── router/         # Route configuration + global navigate
├── utils/          # Shared utility functions
├── types/          # TypeScript type definitions
├── i18n/           # Internationalization setup
├── lib/            # Supabase client singleton
└── mocks/          # Mock data for testing
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 7 + SWC |
| Styling | Tailwind CSS 3 |
| Backend | Supabase (PostgreSQL, Auth, Edge Functions) |
| Routing | React Router v7 (lazy routes) |
| 3D | Three.js, @react-three/fiber, @react-three/drei |
| Charts | Recharts |
| Payments | Stripe |
| Auth | Firebase + Supabase Auth |
| i18n | i18next + react-i18next |
