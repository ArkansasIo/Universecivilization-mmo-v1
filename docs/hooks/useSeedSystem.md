# useSeedSystem

NMS-style portal glyph seed system — generation, discovery, and persistence of seeded content.

## Returns

- `discoveries` — previously discovered seeds loaded from Supabase
- `loading` — boolean for initial load
- `FEATURED_SEEDS` — curated preset seeds
- `generateFromSeed(seed, type)` — generates planet/ship/creature/multitool from a numeric seed
- `discoverSeed(seed, type, name)` — saves a seed discovery to the database
- `deleteDiscovery(discoveryId)` — removes a saved discovery
- `generateRandomSeed()` — returns a random safe integer
- `seedToGlyphs(seed)` / `glyphsToSeed(glyphs)` — 64-bit seed ↔ 12-glyph conversion
- `getGlyphByValue` / `getGlyphByName` / `PORTAL_GLYPHS` — glyph lookup utilities

## Generation Types

- `planet` — biome, weather, sentinels, resources, flora/fauna, terrain, sky/ground color
- `ship` — archetype (Fighter/Hauler/Explorer/etc.), class, slots, stats, colors, parts
- `creature` — type, temperament, diet, rarity, height, weight, wings, aquatic
- `multitool` — type (Pistol/Rifle/Experimental/etc.), class, slots, damage/mining/scan

## Features

- Procedural generation from deterministic seeds
- Portal glyph address system
- Seed discovery and sharing
