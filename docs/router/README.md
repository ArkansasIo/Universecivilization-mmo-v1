# Router

React Router v7 configuration with lazy-loaded routes and global navigation.

## Files

| File | Purpose |
|---|---|
| [config.tsx](config.md) | Route definitions: 90+ lazy-loaded game routes, public routes, admin routes |
| [index.tsx](index.md) | `AppRoutes` component + global `navigatePromise` for imperative navigation |

## Route Structure

```
Public (no layout)
├── /                        → HomePage
├── /login                   → LoginPage
├── /register                → RegisterPage
├── /empire-creation         → EmpireCreationPage
├── /reset-password          → ResetPasswordPage
├── /verify-email            → VerifyEmailPage
├── /auth/callback           → AuthCallbackPage
└── /admin-login             → AdminLoginPage

Admin (AdminRoutesLayout)
├── /admin-dashboard         → AdminDashboard
├── /admin/dashboard         → AdminDashboard
├── /admin-register          → AdminRegister
└── /admin/register          → AdminRegister

Game (GameRoutesLayout → GameLayout)
├── /dashboard               → DashboardPage
├── /buildings               → BuildingsPage
├── /fleet                   → FleetPage
├── /research                → ResearchPage
├── /galaxy                  → GalaxyPage
├── /alliance                → AlliancePage
├── /crafting                → CraftingPage
├── /universe                → UniversePage
├── ... (80+ more)
└── /game-test               → GameTestPage

Catch-all
└── *                        → NotFound
```
