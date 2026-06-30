# useNotificationSystem

Manages player notifications with create, read, and delete operations.

## Returns

- `notifications` — list of notifications (type, title, message, read status)
- `unreadCount` — count of unread notifications
- `loading` — boolean for initial load
- `createNotification(type, title, message, data?)` — creates a new notification
- `markAsRead(notificationId)` — marks single notification as read
- `markAllAsRead()` — marks all as read
- `deleteNotification(notificationId)` — deletes a single notification
- `clearAll()` — deletes all notifications for the player
- `reload` — refreshes from Supabase

## Features

- Notification bell / dropdown
- Real-time notification delivery
- System alerts and event updates
