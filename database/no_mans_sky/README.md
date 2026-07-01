# No Man's Sky Universe SQL Pack

Relational database files for cataloging the No Man's Sky universe.

The game universe is procedural, so this pack stores:

- The 256 official galaxy slots with hexadecimal IDs.
- Known official galaxy names that are safe to seed immediately.
- Regions, star systems, planets, moons, stations, freighters, frigates, ships, multi-tools, bases, discoveries, missions, resources, flora, fauna, minerals, buildings, NPCs, races, factions, economy and conflict levels.
- Portal glyph addresses and coordinate fields for player-discovered content.

Source reference:

- No Man's Sky Wiki, Galaxy: https://nomanssky.fandom.com/wiki/Galaxy

Fandom blocked direct machine fetching during creation, so `galaxies.sql` seeds all 256 galaxy numbers/hex IDs and updates a verified starter set of galaxy names. Add the remaining names later by updating rows in `galaxies`.

## Load Order

Use `load_all.sql`, or run files in this order:

1. `schema.sql`
2. `economy.sql`
3. `conflict.sql`
4. `npc.sql`
5. `resources.sql`
6. `buildings.sql`
7. `galaxies.sql`
8. `regions.sql`
9. `systems.sql`
10. `planets.sql`
11. `flora.sql`
12. `fauna.sql`
13. `minerals.sql`
14. `ships.sql`
15. `multitools.sql`
16. `freighters.sql`
17. `frigates.sql`
18. `missions.sql`

## SQLite Example

```sql
.read database/no_mans_sky/load_all.sql
```

## Notes

The schema is normalized for search and long-term expansion. A full database of every system and planet is not practical because the universe contains trillions of systems and quadrillions of planets. Store official data and player discoveries as they are collected.
