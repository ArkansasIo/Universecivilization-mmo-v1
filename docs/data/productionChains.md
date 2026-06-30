# Production Chains

**File:** `src/data/productionChains.ts`

## Purpose
Production chain definitions for manufacturing and resource processing.

## Key Exports
- `PRODUCTION_CHAINS: ProductionChain[]` — Array of production chains with id, name, inputs (resources + quantities), outputs, processing time, required tier/facility, and byproducts.
- `getChainById`, `getChainsForOutput`, `calculateChainEfficiency` — Utilities.
