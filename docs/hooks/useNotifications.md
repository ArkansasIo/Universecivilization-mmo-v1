# useNotifications

Alternative notification hook with real-time subscription, browser notification support, and optimistic UI updates.

## Returns

- `notifications` — list of notifications
- `unreadCount` — count of unread
- `loading` — boolean for initial load
- `markAsRead(notificationId)` — marks single notification read (optimistic)
- `markAllAsRead()` — marks all read (optimistic)
- `deleteNotification(notificationId)` — deletes (optimistic)
- `createNotification(type, message, data?)` — creates a system notification
- `refetch` — refreshes from Supabase

## Features

- Browser push notifications via `Notification` API
- Real-time Postgres changes subscription
- Optimistic local state updates
