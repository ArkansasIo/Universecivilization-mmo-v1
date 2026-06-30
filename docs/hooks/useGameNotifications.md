# useGameNotifications

## Manages
In-game notification system with 14 notification types, seeded mock data, periodic live event generation (25–60s intervals), and read/unread tracking.

## Returns
- `notifications` — full notification list (capped at 80)
- `unreadCount` — count of unread notifications
- `markAsRead(id)`, `markAllAsRead` — read state management
- `deleteNotification(id)`, `clearAll` — removal
- `pushNotification(type, title, message, etaMs?)` — programmatically add a notification

## Used by
- Notification bell/dropdown UI
- Alert banners and toast overlays
