# Reactor Research

- **Route:** `/reactor-research`
- **Purpose:** Reactor blueprint R&D system — browse and research reactor types to unlock higher-tier designs.

## Key Features

- Fetches `reactor_definitions` and `research_projects` from `supabase`
- Sub-class progression: Standard → Advanced → Elite → Master → Grandmaster → Mythic
- Requirements system: technology level checks (`energy_technology`, `fusion_technology`, `dark_energy_research`, `quantum_research`) and building level checks (`research_lab`)
- SVG tree connectors with animated power particles on active paths
- Tech node cards with locked/unlocked states, missing requirements display
- Just-unlocked animation flash effect
- Reactor type filter tabs with color-coded class indicators
- Research progress summary section showing key technology levels

## UI Sections

| Section | Description |
|---|---|
| **Header** | "Reactor Blueprint Archive" title with unlock/lock counters and Research Lab level display. Reactor type filter tabs (All Types + per-reactor-type filters). |
| **Research Progress Summary** | Four tech progress cards: Energy Technology, Fusion Technology, Dark Energy Research, Quantum Research — each showing current level, max level, and progress bar with category color. |
| **Legend Bar** | Color legend for Unlocked (green), Locked (red), Partial (amber) states. |
| **Main Tree** | Column-based layout by sub-class tier (6 columns). Each column shows: tier header with requirements tooltip, connector arrows between tiers, and reactor blueprint cards. Cards display unlock status, reactor type, sub-class, tier, power output, and missing requirements if locked. SVG curved-path connectors between tiers with animated particles for active paths. |
| **Footer** | Summary of unlocked/locked counts, total blueprints, reactor types, and a Sync Data refresh button. |
