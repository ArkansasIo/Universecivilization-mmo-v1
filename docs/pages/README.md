# Pages

107 page routes organized by feature area. All pages are lazy-loaded via `React.lazy()`.

## Route Table

| Route | Page | Area |
|---|---|---|
| `/` | Home | Public |
| `/login` | Login | Auth |
| `/register` | Register | Auth |
| `/empire-creation` | Empire Creation | Auth |
| `/dashboard` | Dashboard | Overview |
| `/buildings` | Buildings | Empire |
| `/storage` | Storage | Empire |
| `/colonies` | Colonies | Empire |
| `/population` | Population | Empire |
| `/megastructures` | Megastructures | Empire |
| `/fleet` | Fleet Manager | Military |
| `/shipyard` | Shipyard | Military |
| `/starships` | Starships | Military |
| `/motherships` | Motherships | Military |
| `/enhanced-ships` | Enhanced Ships | Military |
| `/defense` | Defense | Military |
| `/fleet-combat` | Fleet Combat | Military |
| `/research` | Research | Science |
| `/advanced-research` | Advanced Research | Science |
| `/skills` | Skills | Science |
| `/crafting` | Crafting | Crafting |
| `/master-crafting` | Master Crafting | Crafting |
| `/galaxy` | Galaxy | Galaxy |
| `/universe` | Universe | Galaxy |
| `/alliance` | Alliance | Social |
| `/messages` | Messages | Social |
| `/chat` | Chat | Social |
| `/marketplace` | Marketplace | Economy |
| `/store` | Store | Premium |
| ... and 70+ more | | |

## Page File Structure

Each page follows this convention:

```
src/pages/<name>/
├── page.tsx             # Entry component (default export)
├── components/          # Page-specific subcomponents (optional)
│   ├── ComponentA.tsx
│   └── ComponentB.tsx
├── types.ts             # Local types (optional)
└── data.ts              # Local data (optional)
```

## Page List

### Public Pages
- [home.md](home.md) — Landing page, marketing, testimonials
- [login.md](login.md) — User login
- [register.md](register.md) — User registration
- [empire-creation.md](empire-creation.md) — Initial empire setup wizard
- [reset-password.md](reset-password.md) — Password reset flow
- [verify-email.md](verify-email.md) — Email verification
- [auth-callback.md](auth-callback.md) — OAuth callback handler

### Admin Pages
- [admin-dashboard.md](admin-dashboard.md) — Admin panel
- [admin-login.md](admin-login.md) — Admin authentication
- [admin-register.md](admin-register.md) — Admin registration

### Empire / Resource Pages
- [dashboard.md](dashboard.md) — Main game hub
- [buildings.md](buildings.md) — Resource and facility construction
- [storage.md](storage.md) — Resource storage management
- [colonies.md](colonies.md) — Planetary colony management
- [population.md](population.md) — Population management
- [megastructures.md](megastructures.md) — Megastructure construction
- [enhanced-megastructures.md](enhanced-megastructures.md) — Advanced megastructures
- [travel-network.md](travel-network.md) — Interstellar travel infrastructure
- [starbases.md](starbases.md) — Starbase management
- [moonbases.md](moonbases.md) — Lunar base management
- [food-water-disease.md](food-water-disease.md) — Life support systems
- [power-grid.md](power-grid.md) — Power grid management
- [reactor-research.md](reactor-research.md) — Reactor blueprint R&D

### Military Pages
- [fleet.md](fleet.md) — Fleet deployment and management
- [shipyard.md](shipyard.md) — Ship construction
- [starships.md](starships.md) — Ship classification browser
- [motherships.md](motherships.md) — Mothership management
- [enhanced-ships.md](enhanced-ships.md) — Enhanced ship management
- [enhanced-motherships.md](enhanced-motherships.md) — Enhanced mothership management
- [ship-upgrades.md](ship-upgrades.md) — Ship upgrade system
- [ship-customization.md](ship-customization.md) — Ship loadout customization
- [fleet-formations.md](fleet-formations.md) — Fleet formation configuration
- [fleet-combat.md](fleet-combat.md) — Fleet combat simulator
- [defense.md](defense.md) — Planetary defense systems
- [officers.md](officers.md) — Officer recruitment and assignments
- [units.md](units.md) — Military unit management
- [training-center.md](training-center.md) — Unit training facility
- [ground-combat.md](ground-combat.md) — Planetary ground combat
- [combat-simulator.md](combat-simulator.md) — Battle simulation sandbox
- [war-room.md](war-room.md) — Strategic war command center
- [missions.md](missions.md) — Mission deployment
- [campaign.md](campaign.md) — Story campaign mode
- [expeditions.md](expeditions.md) — Deep space expeditions
- [acs.md](acs.md) — Allied combat support

### Research Pages
- [research.md](research.md) — Research lab
- [advanced-research.md](advanced-research.md) — Advanced research tree
- [skills.md](skills.md) — Character skill system
- [blueprints.md](blueprints.md) — Blueprint management

### Crafting Pages
- [crafting.md](crafting.md) — Crafting workshop hub
- [master-crafting.md](master-crafting.md) — Master crafting system
- [crafting-forge.md](crafting-forge.md) — Forge and smithing
- [crafting-materials.md](crafting-materials.md) — Material inventory
- [crafting-drones.md](crafting-drones.md) — Crafting drone management
- [crafting-augmentations.md](crafting-augmentations.md) — Ship augmentations
- [crafting-artifacts.md](crafting-artifacts.md) — Artifact crafting
- [crafting-dismantle.md](crafting-dismantle.md) — Item dismantling
- [crafting-rank.md](crafting-rank.md) — Crafting rank progression
- [crafting-recipe-unlocks.md](crafting-recipe-unlocks.md) — Recipe unlocks
- [crafting-skill-trees.md](crafting-skill-trees.md) — Crafting skill trees hub
- weaponsmithing.md — Weaponsmithing skill tree
- armorsmithing.md — Armorsmithing skill tree
- engineering.md — Engineering skill tree
- alchemy.md — Alchemy skill tree
- nanotechnology.md — Nanotechnology skill tree

### Galaxy / Universe Pages
- [galaxy.md](galaxy.md) — Galaxy view
- [galaxy-map.md](galaxy-map.md) — Interactive galaxy map
- [universe.md](universe.md) — Universe overview
- [universe-3d.md](universe-3d.md) — 3D universe view
- [sectors.md](sectors.md) — Sector management
- [stargate-network.md](stargate-network.md) — Stargate network
- [realms.md](realms.md) — Realm systems
- [seed-discovery.md](seed-discovery.md) — Universe seed discovery
- [stellaris-view.md](stellaris-view.md) — Stellaris-style galaxy view
- [cosmic-hierarchy.md](cosmic-hierarchy.md) — Cosmic hierarchy browser

### Economy Pages
- [marketplace.md](marketplace.md) — Player marketplace
- [resource-trading.md](resource-trading.md) — Resource trading
- [trade-routes.md](trade-routes.md) — Trade route management
- [auction.md](auction.md) — Auction house
- [black-market.md](black-market.md) — Black market
- [insurance.md](insurance.md) — Fleet insurance

### Social / Alliance Pages
- [alliance.md](alliance.md) — Alliance hub
- [diplomacy.md](diplomacy.md) — Diplomatic relations
- [diplomacy-map.md](diplomacy-map.md) — Diplomacy map view
- [espionage.md](espionage.md) — Espionage operations
- [intel.md](intel.md) — Intelligence database
- [messages.md](messages.md) — In-game messaging
- [chat.md](chat.md) — Global chat
- [leaderboard.md](leaderboard.md) — Player leaderboard
- [universe-leaderboard.md](universe-leaderboard.md) — Universe-wide leaderboard

### Events / Activities Pages
- [pirates.md](pirates.md) — Pirate hunting
- [bounties.md](bounties.md) — Bounty system
- [world-bosses.md](world-bosses.md) — World boss battles
- [quests.md](quests.md) — Quest system
- [achievements.md](achievements.md) — Achievement tracking
- [events.md](events.md) — Game events
- [seasonal-events.md](seasonal-events.md) — Seasonal events
- [planetary-events.md](planetary-events.md) — Planetary events
- [empires-at-war.md](empires-at-war.md) — War overview
- [universe-war-events.md](universe-war-events.md) — Universe war events

### Premium Pages
- [store.md](store.md) — Premium item store
- [season-pass.md](season-pass.md) — Season pass

### Info Pages
- [profile.md](profile.md) — Player profile
- [empire.md](empire.md) — Empire overview
- [terms.md](terms.md) — Terms of service
- [privacy.md](privacy.md) — Privacy policy
- [support.md](support.md) — Support page
- [changelog.md](changelog.md) — Game changelog
- [galactic-calendar.md](galactic-calendar.md) — In-game calendar
- [races-explorer.md](races-explorer.md) — Race browser
- [sensor-phalanx.md](sensor-phalanx.md) — Sensor phalanx
- [game-test.md](game-test.md) — Test/debug page
- [NotFound.md](NotFound.md) — 404 page
