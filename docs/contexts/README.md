# Contexts

2 React Context providers for authentication state.

| Context | File | Purpose |
|---|---|---|
| [AuthContext](AuthContext.md) | `AuthContext.tsx` | User authentication, session management, sign in/out |
| [AdminAuthContext](AdminAuthContext.md) | `AdminAuthContext.tsx` | Admin authentication with Supabase admin table |

## AuthContext

Provides:
- `user` — Current user object or null
- `loading` — Auth loading state
- `signIn(email, password)` — Email/password login
- `signUp(email, password)` — Registration
- `signOut()` — Logout
- `resetPassword(email)` — Password reset

## AdminAuthContext

Provides:
- `isAuthenticated` — Admin session flag
- `loading` — Auth loading state
- `admin` — Admin user metadata
- `login(email, password)` — Admin login
- `register(email, password, code)` — Admin registration with code
