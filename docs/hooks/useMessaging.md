# useMessaging

Manages player-to-player in-game messaging (inbox, sent, system messages).

## Returns

- `inbox` — received messages with sender name resolved from profiles
- `sent` — sent messages with receiver name resolved
- `unreadCount` — number of unread messages in inbox
- `loading` — boolean for initial load
- `sendMessage(params)` — sends by recipient username; supports subject, body, type
- `sendSystemMessage(receiverId, subject, body, type)` — sends a system/battle-report message
- `markAsRead(messageId)` — marks a single message read
- `markAllAsRead()` — marks all inbox messages read
- `deleteMessage(messageId, folder)` — soft-deletes from inbox or sent
- `replyToMessage(original, body)` — replies with `Re:` prefix
- `refresh` — reloads inbox and sent

## Features

- Player messaging
- Battle report / system notifications via message_type
- Alliance communication
