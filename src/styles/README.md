# Stellar Dominion 3.5 Theme (Test CSS)

**Source:** https://github.com/ArkansasIo/stellar-dominion3.5

This directory contains CSS imported from the Stellar Dominion 3.5 codebase for testing.

## Files

| File | Description |
|------|-------------|
| `stellar-dominion-theme.css` | Full sci-fi design system — 3 themes (black-style, imperial-gold, og-white), button system, panel system, sidebar, navigation, forms, tables |

## How to use

Import in any component to test:

```tsx
import '../styles/stellar-dominion-theme.css';
```

Or add to `src/index.css`:

```css
@import './styles/stellar-dominion-theme.css';
```

## Theme switching

Set `data-sd-theme` attribute on `<html>`:

- `black-style` (default) — dark cyberpunk
- `imperial-gold` — warm gold empire
- `og-white` — light/classic

## CSS class reference

| Class | Purpose |
|-------|---------|
| `.sci-fi-button` + `--default/--ghost/--destructive/--link` | Sci-fi button with clip-path corners |
| `.sd-panel` | Base panel container |
| `.sd-panel-surface` | Interactive panel surface |
| `.sd-detail-card` | Detail card with hover glow |
| `.sd-command-tile` | Clickable command tile |
| `.sd-subpage-card` | Sub-navigation card |
| `.sd-sidebar-shell` | Sidebar background |
| `.sd-sidebar-item` | Sidebar nav item (add `--active`) |
| `.sd-game-shell` | Main game background with nebula |
| `.sd-bottom-command-bar` | Bottom command grid |
| `.sd-top-link-bar` | Top navigation link bar |
| `.sd-card-shell` | Card container with clip-path |
| `.sd-input` / `.sd-textarea` / `.sd-select-trigger` | Form inputs |
| `.sd-tabs-list` / `.sd-tabs-trigger` | Tab container/trigger |
| `.sd-badge` | Status badge |
| `.sd-table-wrap` / `.sd-table` | Table container |
| `.sd-resource-chip` (with `data-resource`) | Resource display chip |
| `.sd-future-text` | Orbitron display text |
| `.sd-muted-text` / `.sd-highlight-text` | Text color utilities |
| `.sd-eyebrow` | Section eyebrow label |
