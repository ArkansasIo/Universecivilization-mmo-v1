# Government & Politics

**File:** `src/data/govPolitics.ts`

## Purpose
Government and political systems for player faction management.

## Key Exports
- `GOVERNMENT_TYPES: GovernmentType[]` — 10 government types (Democracy, Monarchy, Theocracy, Dictatorship, Council, Corporation, AI Governance, Anarchy, Federation, Empire) with bonuses, penalties, and stability factors.
- `GOVERNMENT_SYSTEMS: GovernmentSystem[]` — Faction-specific government implementations.
- `POLITICAL_PARTIES: PoliticalParty[]` — Party definitions with ideology, popularity, policies.
- `SENATE: Senate` — Senate system with chambers, seats, and session tracking.
- `policiesData: Policy[]` — Individual policies with categories, costs, and effects.
- `getPartyById`, `getSystemById`, `calculateGovernmentStability` — Helpers.
