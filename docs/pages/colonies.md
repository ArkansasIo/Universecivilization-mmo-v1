# Colonies

- **Route:** `/colonies`
- **Purpose:** Planetary colony management — view, add, rename, and abandon colonies.

## Key Features

- Fetches colony data from `supabase` (`planets` table) via `useColonyManagement`-like logic
- Supports up to 1,000 planets and 1,000 moons
- Search by name or coordinates; filter by type (all/planet/moon); sort by date/name/size
- Paginated grid (12 items per page)
- Add Colony modal with type selection (planet/moon) and name input
- Colony detail modal with full classification info
- Planet classification system: class letters (A–H), categories, sub-classes, habitability ratings, atmosphere, gravity, resource richness

## UI Sections

| Section | Description |
|---|---|
| **Stats Cards** | Three cards showing planet count, moon count, and total colonies — each with capacity bar and max limits. |
| **Controls Bar** | Search input, type filter dropdown, sort dropdown, and "Add Colony" button. |
| **Colonies Grid** | Paginated cards showing colony image, name, coordinates, type badge, planet class, habitability, upgrade tier, buildings count, temperature, size, fields used/total with progress bar. Rename and Abandon action buttons. |
| **Add Colony Modal** | Type selector (planet/moon with remaining capacity), name input with character limit, Cancel/Add buttons. |
| **Colony Detail Modal** | Full detail view with image, temperature, size, class, habitability rating, gravity, atmosphere, resource richness, upgrade tier, classification details, planetary info, buildings list, field usage. |
