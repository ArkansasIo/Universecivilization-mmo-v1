# Components

22 shared UI feature components used across pages.

## Layout Components

| Component | File | Purpose |
|---|---|---|
| [GameLayout](GameLayout.md) | `GameLayout.tsx` | Main game shell with sidebar, topbar, panels |
| [GameRoutesLayout](GameRoutesLayout.md) | `GameRoutesLayout.tsx` | Auth guard + game layout wrapper |
| [AdminRoutesLayout](AdminRoutesLayout.md) | `AdminRoutesLayout.tsx` | Admin auth guard |
| [GameNavigation](GameNavigation.md) | `GameNavigation.tsx` | Navigation menus and breadcrumbs |

## UI Widgets

| Component | File | Purpose |
|---|---|---|
| [RightSidePanel](RightSidePanel.md) | `RightSidePanel.tsx` | Right command panel |
| [GameEventCenter](GameEventCenter.md) | `GameEventCenter.tsx` | Fleet movement and event tracking |
| [NotificationBell](NotificationBell.md) | `NotificationBell.tsx` | Notification indicator |
| [NotificationCenter](NotificationCenter.md) | `NotificationCenter.tsx` | Notification list panel |
| [ThemeSwitcher](ThemeSwitcher.md) | `ThemeSwitcher.tsx` | Dark/light theme toggle |
| [ViewportControls](ViewportControls.md) | `ViewportControls.tsx` | Galaxy viewport controls |
| [PageLoading](PageLoading.md) | `PageLoading.tsx` | Loading state wrapper |
| [LoadingSpinner](LoadingSpinner.md) | `LoadingSpinner.tsx` | Animated spinner |

## Game Feature Components

| Component | File | Purpose |
|---|---|---|
| [AchievementToast](AchievementToast.md) | `AchievementToast.tsx` | Achievement unlock toast |
| [WelcomeBackCelebration](WelcomeBackCelebration.md) | `WelcomeBackCelebration.tsx` | Return player splash |
| [MaterialWishlistPanel](MaterialWishlistPanel.md) | `MaterialWishlistPanel.tsx` | Crafting material tracking |
| [RecipeUnlockBadge](RecipeUnlockBadge.md) | `RecipeUnlockBadge.tsx` | New recipe indicator |
| [RecipeUnlockRankUpToast](RecipeUnlockRankUpToast.md) | `RecipeUnlockRankUpToast.tsx` | Crafting rank-up notification |
| [ErrorBoundary](ErrorBoundary.md) | `ErrorBoundary.tsx` | React error boundary |
| [GameLoop](GameLoop.md) | `GameLoop.tsx` | Background game tick engine |

## 3D Components

| Component | File | Purpose |
|---|---|---|
| [SpaceCanvas](SpaceCanvas.md) | `SpaceCanvas.tsx` | Three.js canvas wrapper |
| [Planet3D](Planet3D.md) | `Planet3D.tsx` | 3D planet renderer |
| [StarMapViewport](StarMapViewport.md) | `StarMapViewport.tsx` | Star map viewport |

## Modals

| Component | File | Purpose |
|---|---|---|
| [CompareTraitsModal](CompareTraitsModal.md) | `CompareTraitsModal.tsx` | Trait comparison modal |
| [RaceChangeModal](RaceChangeModal.md) | `RaceChangeModal.tsx` | Race change confirmation |
