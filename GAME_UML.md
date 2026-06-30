# 🚀 Galactic Empire — Complete UML & Game Systems Reference

> **Alpha 1.5.0** — A comprehensive browser-based MMORPG space strategy game.  
> Build empires, command fleets, research technologies, forge alliances, and conquer the galaxy.

---

## 📐 System Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER (React 19 + TypeScript)            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  Pages   │ │ Hooks   │ │Contexts │ │  Data   │ │  Utils  │      │
│  │  85+     │ │  60+    │ │   2     │ │  40+    │ │   5+    │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
├──────────────────────────────────────────────────────────────────────────┤
│                           SUPABASE BaaS LAYER                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  Auth    │ │Database  │ │Realtime  │ │  Edge    │ │ Storage  │      │
│  │  JWT     │ │  50+     │ │   Sub    │ │   Funcs  │ │          │      │
│  │          │ │  Tables  │ │          │ │   18     │ │          │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Data Flow Pattern

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │────▶│Component │────▶│  Hook    │────▶│Supabase  │
│  Action  │     │ (UI)     │     │(Logic)   │     │(Persist) │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                      ▲                                  │
                      │         ┌──────────┐             │
                      └─────────│ Context  │◀────────────┘
                                │ (State)  │
                                └──────────┘

Secondary flow (real-time):
  Supabase Change → Realtime Sub → Hook Listener → State Update → UI Render
```

---

## 📋 Complete Feature Catalog — 85+ Game Pages

### 🏛️ Empire & Infrastructure (14 pages)

| Page | Route | Description |
|------|-------|-------------|
| **Dashboard** | `/dashboard` | Central command — resources, quick actions, alerts |
| **Empire Overview** | `/empire` | Empire stats, territories, fleet summary |
| **Buildings** | `/buildings` | Construct & upgrade civil/industrial/military structures |
| **Colonies** | `/colonies` | Manage colonies across multiple planets |
| **Population** | `/population` | Citizen growth, happiness, employment, education |
| **Storage** | `/storage` | Resource warehouse capacity management |
| **Megastructures** | `/megastructures` | Dyson spheres, ringworlds, stellar forges |
| **Enhanced Megastructures** | `/enhanced-megastructures` | Advanced mega-construction projects |
| **Starbases** | `/starbases` | Orbital defense platforms & space stations |
| **Moonbases** | `/moonbases` | Lunar colonies, phalanx sensors, jump gates |
| **Travel Network** | `/travel-network` | Interplanetary transit infrastructure |
| **Food/Water/Disease** | `/food-water-disease` | Colony health, supply chains, pandemic control |
| **Planetary Events** | `/planetary-events` | Dynamic planet-level events & crises |
| **Realms** | `/realms` | Realm management & domain control |

### ⚔️ Military & Combat (19 pages)

| Page | Route | Description |
|------|-------|-------------|
| **Fleet** | `/fleet` | Ship composition, fleet dispatch, mission control |
| **Shipyard** | `/shipyard` | Starship construction & production queues |
| **Starships** | `/starships` | Ship inventory, stats, classifications |
| **Motherships** | `/motherships` | Mobile space fortress management |
| **Enhanced Ships** | `/enhanced-ships` | Elite ship variants with special abilities |
| **Enhanced Motherships** | `/enhanced-motherships` | Advanced mothership upgrades |
| **Ship Upgrades** | `/ship-upgrades` | Component upgrades — weapons, shields, engines |
| **Ship Customization** | `/ship-customization` | Visual & functional ship modification |
| **Fleet Formations** | `/fleet-formations` | Tactical positioning & formation bonuses |
| **Fleet Combat** | `/fleet-combat` | Real-time space battle interface |
| **Defense** | `/defense` | Planetary defense structures & turrets |
| **Officers** | `/officers` | Recruit & train fleet commanders & specialists |
| **Units** | `/units` | Ground forces, personnel, garrisons |
| **Training Center** | `/training-center` | Unit training & skill development |
| **Ground Combat** | `/ground-combat` | Planetary invasion & ground warfare |
| **Combat Simulator** | `/combat-simulator` | Simulate battles before engagement |
| **War Room** | `/war-room` | Strategic military planning & intel |
| **ACS (Allied Combat System)** | `/acs` | Coordinated multi-player attacks |
| **Pirates** | `/pirates` | Pirate raids, counter-piracy operations |

### 🔬 Research & Technology (5 pages)

| Page | Route | Description |
|------|-------|-------------|
| **Research** | `/research` | Technology tree, research queue, unlocks |
| **Advanced Research** | `/advanced-research` | Cutting-edge late-game technologies |
| **Skills** | `/skills` | Player skill trees & specialization |
| **Blueprints** | `/blueprints` | Discovered ship & weapon schematic library |
| **Sensor Phalanx** | `/sensor-phalanx` | Deep-space sensor network & fleet detection |

### 🔨 Crafting System (13 pages)

| Page | Route | Description |
|------|-------|-------------|
| **Crafting Hub** | `/crafting` | Main crafting interface — assemble items |
| **Master Crafting** | `/master-crafting` | Legendary-tier item creation |
| **Forge** | `/crafting-forge` | Weapon & armor smithing station |
| **Materials** | `/crafting-materials` | Material inventory & gathering |
| **Drones** | `/crafting-drones` | Drone construction & deployment |
| **Augmentations** | `/crafting-augmentations` | Cybernetic & bio-augmentation crafting |
| **Artifacts** | `/crafting-artifacts` | Ancient artifact assembly |
| **Dismantle** | `/crafting-dismantle` | Salvage items for components |
| **Crafting Rank** | `/crafting-rank` | Crafting prestige & tier progression |
| **Recipe Unlocks** | `/crafting-recipe-unlocks` | Discover new crafting recipes |
| **Skill Trees Hub** | `/crafting-skill-trees` | Overview of all 5 crafting disciplines |
| **Weaponsmithing Tree** | `/crafting-skill-trees/weaponsmithing` | Weapon crafting skill tree |
| **Armorsmithing Tree** | `/crafting-skill-trees/armorsmithing` | Armor crafting skill tree |
| **Engineering** | `/crafting-skill-trees/engineering` | Engineering specialization tree |
| **Alchemy** | `/crafting-skill-trees/alchemy` | Material transmutation tree |
| **Nanotechnology** | `/crafting-skill-trees/nanotechnology` | Nano-fabrication & enhancement tree |

### 🌌 Galaxy & Exploration (16 pages)

| Page | Route | Description |
|------|-------|-------------|
| **Galaxy** | `/galaxy` | Solar system browser — scan systems |
| **Galaxy Map** | `/galaxy-map` | Interactive star chart with fleet overlay |
| **Universe** | `/universe` | Universe overview — all 9 galaxies |
| **Sectors** | `/sectors` | Sector-level control & strategic zones |
| **Stargate Network** | `/stargate-network` | Instant wormhole travel between systems |
| **Seed Discovery** | `/seed-discovery` | Explore uncharted space — find new seeds |
| **Universe Leaderboard** | `/universe-leaderboard` | Cross-universe ranking comparisons |
| **Universe War Events** | `/universe-war-events` | Major galactic conflicts timeline |
| **Empires at War** | `/empires-at-war` | Active war declarations & battle fronts |
| **Diplomacy Map** | `/diplomacy-map` | Visual diplomacy & territory map |
| **Stellaris View** | `/stellaris-view` | 3D galaxy visualization |
| **Cosmic Hierarchy** | `/cosmic-hierarchy` | Universe → Galaxy → Sector → System tree |
| **Races Explorer** | `/races-explorer` | Browse all NPC, enemy & friendly races |
| **Missions** | `/missions` | Active fleet missions & campaign objectives |
| **Campaign** | `/campaign` | Story-driven campaign progression |
| **Expeditions** | `/expeditions` | Deep-space exploration & discovery missions |

### 💰 Economy & Trade (6 pages)

| Page | Route | Description |
|------|-------|-------------|
| **Marketplace** | `/marketplace` | Player-to-player trading, buy/sell orders |
| **Resource Trading** | `/resource-trading` | Direct resource exchange agreements |
| **Trade Routes** | `/trade-routes` | Automated recurring trade convoys |
| **Insurance** | `/insurance` | Fleet & cargo insurance policies |
| **Auction House** | `/auction` | Bid on rare items & equipment |
| **Black Market** | `/black-market` | Illicit goods, contraband, special deals |

### 👥 Social & Alliance (7 pages)

| Page | Route | Description |
|------|-------|-------------|
| **Alliance** | `/alliance` | Alliance management, members, resources |
| **Diplomacy** | `/diplomacy` | Treaties, NAPs, war declarations |
| **Espionage** | `/espionage` | Spy missions, intel gathering |
| **Intel** | `/intel` | Strategic intelligence dashboard |
| **Messages** | `/messages` | In-game personal messaging system |
| **Chat** | `/chat` | Real-time player chat channels |
| **Leaderboard** | `/leaderboard` | Player rankings — fleet, research, economy |

### 🎯 Activities & Progression (8 pages)

| Page | Route | Description |
|------|-------|-------------|
| **World Bosses** | `/world-bosses` | Cooperative boss battles — server-wide |
| **Quests** | `/quests` | Active quests, daily missions, bounties |
| **Seasonal Events** | `/seasonal-events` | Limited-time holiday & special events |
| **Season Pass** | `/season-pass` | Seasonal progression rewards (free + premium) |
| **Achievements** | `/achievements` | Achievement badges & milestone rewards |
| **Events** | `/events` | Active game events & notifications |
| **Bounties** | `/bounties` | Player bounty hunting system |
| **Store** | `/store` | Premium items, boosts, cosmetics |

### 👤 Account & Support (7 pages)

| Page | Route | Description |
|------|-------|-------------|
| **Profile** | `/profile` | Player profile, stats, settings |
| **Terms** | `/terms` | Terms of service |
| **Privacy** | `/privacy` | Privacy policy |
| **Support** | `/support` | Help & customer support |
| **Changelog** | `/changelog` | Version history & update notes |
| **Game Test** | `/game-test` | Developer testing sandbox |
| **Empire Creation** | `/empire-creation` | New player empire setup wizard |

### 🔐 Auth & Admin (7 pages)

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Landing page with hero, features, CTA |
| **Login** | `/login` | Player login (includes demo account) |
| **Register** | `/register` | New account registration |
| **Verify Email** | `/verify-email` | Email verification page |
| **Reset Password** | `/reset-password` | Password recovery flow |
| **Auth Callback** | `/auth/callback` | OAuth callback handler |
| **Admin** | `/admin-*` | Admin dashboard, user management, logs |

---

## 🧠 Custom Hooks Architecture — 60+ Game Logic Modules

### Master Loop

```
                    ┌──────────────────────┐
                    │    useGameLoop       │ ← Master orchestrator
                    │  (1 Hz tick engine)  │
                    └──────────────────────┘
                              │
          ┌───────────────────┼────────────────────┐
          ▼                   ▼                    ▼
   useResources     useRealTimeProduction   useAutoSave
```

### Core Resource & Economy (6 hooks)

| Hook | Purpose |
|------|---------|
| `useResources` | Resource production, consumption, stockpile management |
| `useEconomySystem` | Market prices, inflation, economic calculations |
| `useRealTimeProduction` | Per-second resource updates from buildings |
| `useResourceTrading` | Player-to-player direct resource exchanges |
| `useTradeRoutes` | Automated recurring trade convoy management |
| `useMarketplace` | Buy/sell order creation, fulfillment, browsing |

### Fleet & Combat (7 hooks)

| Hook | Purpose |
|------|---------|
| `useFleetManager` | Fleet creation, dispatch, recall, status tracking |
| `useAdvancedCombat` | Real-time tactical combat engine |
| `useCombatSimulator` | Pre-battle simulation with outcome prediction |
| `useFleetFormations` | Tactical formation bonuses and positioning |
| `useShipProduction` | Shipyard construction queue management |
| `useShipUpgrades` | Component upgrades — weapons, shields, engines |
| `useEnhancedShips` | Elite ship variant unlocks & management |

### Building & Construction (4 hooks)

| Hook | Purpose |
|------|---------|
| `useBuildingQueue` | Construction queue — sequential building upgrades |
| `useColonyManagement` | Multi-planet colony operations & expansion |
| `useMegastructureManager` | Megastructure construction & upgrades |
| `useMothershipManager` | Mothership fleet — mobile bases & superweapons |

### Research & Technology (3 hooks)

| Hook | Purpose |
|------|---------|
| `useResearchManager` | Technology tree, research queue, prerequisites |
| `useBlueprintSystem` | Blueprint discovery, usage, permanent unlocks |
| `useSeedSystem` | Seed-based random universe discovery |

### Crafting (4 hooks)

| Hook | Purpose |
|------|---------|
| `useCrafting` | Core item crafting — recipes, materials, queue |
| `useMasterCrafting` | Legendary-tier item creation system |
| `useCraftingRank` | Crafting prestige tier & rank progression |
| `useRecipeUnlocks` | New recipe discovery & unlock triggers |
| `useMaterialWishlist` | Wishlist tracking for target materials |

### Social & Multiplayer (5 hooks)

| Hook | Purpose |
|------|---------|
| `useAllianceSystem` | Alliance creation, membership, roles, resources |
| `useAllianceWar` | Coordinated alliance warfare system |
| `useDiplomacy` | Treaties, NAPs, war declarations, relations |
| `useMessaging` | In-game personal message system |
| `useGuildSystem` | Guild operations & guild event management |

### Progression & Rewards (5 hooks)

| Hook | Purpose |
|------|---------|
| `usePlayerProgression` | Level system, XP, prestige |
| `useAchievementSystem` | Achievement tracking, unlock conditions, rewards |
| `useQuestSystem` | Quest tracking, daily missions, campaign quests |
| `useSkillSystem` | Player skill trees & specialization points |
| `useSeasonPass` | Seasonal battle pass — free & premium tiers |

### Exploration & Travel (4 hooks)

| Hook | Purpose |
|------|---------|
| `useTravelSystem` | Fleet travel mechanics — speed, fuel, duration |
| `useStargateNetwork` | Wormhole travel network management |
| `useUniverseGenerator` | Procedural galaxy & system generation |
| `useInterstellarObjects` | Space anomalies, artifacts, special discoveries |

### Events & Activities (5 hooks)

| Hook | Purpose |
|------|---------|
| `usePlanetaryEvents` | Dynamic planet-level crisis & opportunity events |
| `useSeasonalEvents` | Holiday & limited-time event management |
| `useWorldBosses` | Server-wide cooperative boss battle system |
| `usePirateSystem` | AI pirate raids & counter-piracy mechanics |
| `useBountySystem` | Player bounty hunting — place & claim bounties |

### Intelligence & Warfare (4 hooks)

| Hook | Purpose |
|------|---------|
| `useEspionage` | Spy mission dispatch, counter-espionage |
| `useRaiding` | Raid mechanics — attack enemy installations |
| `useUniverseReputation` | Faction reputation across NPC races |
| `useGroundCombat` | Planetary invasion & ground force battles |

### Economy & Trading (3 hooks)

| Hook | Purpose |
|------|---------|
| `useBlackMarket` | Illicit goods, contraband, black market refresh |
| `useStore` | Premium store — items, boosts, cosmetics |
| `useInsuranceSystem` | Fleet & cargo insurance policies |

### System & Infrastructure (5 hooks)

| Hook | Purpose |
|------|---------|
| `useGameLoop` | Master 1-second tick engine — orchestrates all systems |
| `useAutoSave` | Automatic game state persistence (every 30s) |
| `useNotificationSystem` | Cross-system notification dispatch & delivery |
| `useGameNotifications` | Toast notifications for in-game events |
| `useTutorialSystem` | New player tutorial & guidance system |
| `useLeaderboard` | Ranking calculations & leaderboard display |
| `useGameEventSystem` | Central event bus for cross-system communication |
| `useBackgroundProcessor` | Background data processing worker |
| `useAdminPanel` | Admin tools & moderation interface |
| `usePopulationSystem` | Population growth, happiness, migration |
| `useFoodWaterDisease` | Colony health — supply chains & disease spread |

---

## 🗄️ Database Schema — 50+ Tables

### Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────┐       ┌──────────────┐
│  profiles   │       │   planets    │       │    fleets    │
├─────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)     │──┐    │ id (PK)      │──┐    │ id (PK)      │
│ username    │  │    │ owner_id (FK)│  │    │ player_id(FK)│
│ empire_name │  │    │ planet_type  │  │    │ mission_type │
│ level       │  │    │ coordinates  │  │    │ status       │
│ rank        │  │    │ metal_bonus  │  │    │ ships (JSONB)│
│ total_points│  │    │ crystal_bonus│  │    │ arrival_time │
│ created_at  │  │    │ build_slots  │  │    └──────────────┘
└─────────────┘  │    └──────────────┘  │           │
                 │            │          │           │
    ┌────────────┘            │          │           ▼
    ▼                         │          │    ┌──────────────┐
┌──────────────┐              │          │    │combat_logs   │
│   resources  │              │          │    ├──────────────┤
├──────────────┤              │          │    │attacker_id   │
│ user_id (FK) │              │          │    │defender_id   │
│ metal        │              │          │    │fleet_id (FK) │
│ crystal      │              │          │    │result        │
│ deuterium    │              │          │    │loot (JSONB)  │
│ dark_matter  │              │          │    │debris(JSONB) │
│ credits      │              │          │    └──────────────┘
└──────────────┘              │          │
                              ▼          ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  buildings   │       │    ships     │       │  research    │
├──────────────┤       ├──────────────┤       ├──────────────┤
│player_id (FK)│       │player_id (FK)│       │player_id (FK)│
│planet_id (FK)│       │planet_id (FK)│       │tech_name     │
│building_type │       │ship_type     │       │level         │
│level         │       │ship_class    │       │category      │
│is_building   │       │quantity      │       │is_researching│
└──────────────┘       └──────────────┘       └──────────────┘
```

### Complete Table Catalog

**Core Player** — profiles, player_settings, player_resources, resource_transactions, players

**Universe & Territory** — universes, galaxies, sectors, solar_systems, planets, moons, population_data, debris_fields

**Infrastructure** — buildings, building_queue, defense_structures, megastructures, player_megastructures, megastructure_queue, player_structure_modules, starbases, motherships

**Fleet & Combat** — ships, ship_production, fleets, fleet_ships, fleet_missions, fleet_formations, ship_upgrades, combat_logs, battle_reports, espionage_reports, espionage_missions, missile_attacks

**Research & Tech** — research, research_projects, technologies, blueprints, blueprint_jobs

**Crafting** — crafting_queue, crafting_recipes, crafting_materials, master_crafting_skills, master_crafting_materials, master_crafting_queue

**Economy** — marketplace_listings, auction_listings, trade_routes, trade_offers, resource_trades, trade_history, economy_transactions, black_market_items, player_inventory, artifacts

**Social & Alliance** — alliances, alliance_members, alliance_wars, war_battles, diplomacy, diplomatic_relations, diplomatic_proposals, faction_reputations, messages, notifications

**Progression** — quests, achievements, player_skills, player_titles, player_officers, season_pass_progress, player_season_pass, season_pass_rewards

**Events** — world_bosses, world_boss_participants, boss_damage_log, seasonal_events, planetary_events, events_participation, pirate_raids, raid_history, expedition_results, seed_discoveries

**Admin** — admin_users, admin_logs, leaderboard, leaderboard_cache, server_settings

**E-Commerce** — product_categories, product_items, product_variants, product_skus, product_custom_fields, product_custom_values, order_headers, order_items

---

## 🔄 Game Loop Activity Diagram

```
                        ┌─────────┐
                        │  START  │
                        └────┬────┘
                             │
                             ▼
                   ┌──────────────────┐
                   │  Initialize Game │
                   │  State from DB   │
                   └────────┬─────────┘
                            │
                            ▼
              ┌──────────────────────────┐
     ┌───────▶│     1-Second Tick        │
     │        └──────────────────────────┘
     │                    │
     │        ┌───────────┼───────────┐
     │        ▼           ▼           ▼
     │  ┌──────────┐ ┌──────────┐ ┌──────────┐
     │  │Update    │ │Update    │ │Update    │
     │  │Resources │ │Buildings │ │Research  │
     │  └──────────┘ └──────────┘ └──────────┘
     │        │           │           │
     │        ▼           ▼           ▼
     │  ┌──────────┐ ┌──────────┐ ┌──────────┐
     │  │Process   │ │Check     │ │Update    │
     │  │Fleets    │ │Queue     │ │Ships     │
     │  └──────────┘ └──────────┘ └──────────┘
     │        │           │           │
     │        ▼           ▼           ▼
     │  ┌──────────────────────────────────┐
     │  │        Process Combat            │
     │  │   (resolve arriving fleets)      │
     │  └──────────────────────────────────┘
     │        │
     │        ▼
     │  ┌──────────────────────────────────┐
     │  │     Check Events & Triggers      │
     │  │  - Pirate raids                  │
     │  │  - World boss spawns             │
     │  │  - Seasonal events               │
     │  │  - Planetary events              │
     │  └──────────────────────────────────┘
     │        │
     │        ▼
     │  ┌──────────────────────────────────┐
     │  │  Update UI & Notifications       │
     │  │  (re-render changed components)  │
     │  └──────────────────────────────────┘
     │        │
     │        ▼
     │  ┌──────────────────────────────────┐
     │  │  Auto-Save (every 30 seconds)    │
     │  └──────────────────────────────────┘
     │        │
     │        ▼
     │  ┌──────────────────┐
     │  │   Wait 1 Second  │
     └──┤   (setTimeout)   │
        └──────────────────┘
```

---

## ⚔️ Combat System — Full UML

### Sequence Diagram: Fleet Battle

```
Attacker        FleetPage      useFleetManager     useCombat       Supabase
   │                │                │                  │               │
   │─Send Fleet────▶│                │                  │               │
   │                │─dispatch()────▶│                  │               │
   │                │                │─validate()──────▶│               │
   │                │                │   Resources OK?  │               │
   │                │                │   Ships exist?   │               │
   │                │                │◀─validated───────│               │
   │                │                │                  │               │
   │                │                │─insert fleet────────────────────▶│
   │                │                │◀─fleet record────────────────────│
   │                │                │                  │               │
   │                │◀─ETA displayed─│                  │               │
   │                │                │                  │               │
   │  ... fleet travels ...         │                  │               │
   │                │                │                  │               │
   │                │      ┌─────────────────────────────────────────┐ │
   │                │      │ EDGE FUNCTION: resolve-combat           │ │
   │                │      │ (triggered on arrival)                  │ │
   │                │      ├─────────────────────────────────────────┤ │
   │                │      │ 1. Load attacker & defender fleets      │ │
   │                │      │ 2. Calculate round-by-round damage      │ │
   │                │      │ 3. Apply rapid fire                    │ │
   │                │      │ 4. Apply formation bonuses              │ │
   │                │      │ 5. Apply technology bonuses             │ │
   │                │      │ 6. Calculate loot & debris              │ │
   │                │      │ 7. Update both players' ships           │ │
   │                │      │ 8. Create combat_log entry              │ │
   │                │      │ 9. Send notifications                   │ │
   │                │      └─────────────────────────────────────────┘ │
   │                │                │                  │               │
   │                │◀─combat report─│◀─────────────────│               │
   │◀─Battle Result─│                │                  │               │
```

### Combat Calculation Formula

```
                    ┌─────────────────────────────────────────┐
                    │         RAPID FIRE CHECK                 │
                    │   rapidFire[attacker][defender]          │
                    │   → N additional shots if triggered      │
                    └─────────────────────────────────────────┘
                                        │
                                        ▼
┌──────────────────────────────────────────────────────────────────────┐
│                        DAMAGE PER SHOT                                │
│                                                                      │
│   BaseAttack = ship.attack × weaponTech × officerBonus               │
│   BaseDefense = ship.defense × armorTech × shieldPoints              │
│                                                                      │
│   RawDamage = BaseAttack - BaseDefense × formationFactor             │
│   FinalDamage = RawDamage × Random(0.8, 1.2)                        │
│                                                                      │
│   IF ship.health ≤ (maxHealth × 0.01) → SHIP DESTROYED              │
│   ELSE → ship.health -= FinalDamage                                  │
└──────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────────────┐
                    │         POST-BATTLE LOOT                │
                    │  Loot = min(                              │
                    │    target.resources × 0.5,                │
                    │    fleet.totalCargoCapacity               │
                    │  )                                        │
                    │                                          │
                    │  Debris = destroyedShips × 0.3           │
                    │   (30% of lost ship metal/crystal)       │
                    └─────────────────────────────────────────┘
```

---

## ⛏️ Resource Production System

```
┌──────────────────────────────────────────────────────────────────────┐
│                     PRODUCTION FORMULA                                │
│                                                                      │
│  Production = BASE × LEVEL × 1.1^LEVEL × UNIVERSE_SPEED             │
│                                                                      │
│  Metal Mine:       base=30  × level × 1.1^level × speed             │
│  Crystal Mine:     base=20  × level × 1.1^level × speed             │
│  Deuterium Synth:  base=10  × level × 1.1^level × speed             │
│                                                                      │
│  THEN apply:                                                         │
│    × planetTypeBonus (e.g. Volcanic: 1.5× metal)                    │
│    × technologyBonus (research upgrades)                             │
│    × populationEfficiency (employment rate × happiness)              │
│    × officerBonus (if engineer assigned)                            │
│                                                                      │
│  ENERGY COST:                                                        │
│    EnergyRequired = productionLevel × energyCostPerUnit             │
│    IF availableEnergy < energyRequired:                              │
│      Production ×= (availableEnergy / energyRequired)               │
└──────────────────────────────────────────────────────────────────────┘
```

### Resource Types

```
┌──────────────┬───────────────┬──────────────────────────────────────┐
│   RESOURCE   │    SOURCE     │              USED FOR                │
├──────────────┼───────────────┼──────────────────────────────────────┤
│ Metal        │ Mines         │ Ships, buildings, defenses           │
│ Crystal      │ Extractors    │ Research, advanced ships             │
│ Deuterium    │ Synthesizers  │ Fleet fuel, energy plants            │
│ Energy       │ Power plants  │ Powers all buildings                 │
│ Dark Matter  │ Special ops   │ Megastructures, premium research     │
│ Antimatter   │ Advanced labs │ Motherships, exotic weapons          │
│ Nanites      │ Nano-factories│ Ship upgrades, augmentations         │
│ Quantum Cores│ Quantum labs  │ Stargates, FTL drives                │
│ Imp. Credits │ Trade/economy │ Universal market currency            │
│ Rep. Credits │ Alliance ops  │ Alliance & diplomacy currency        │
└──────────────┴───────────────┴──────────────────────────────────────┘
```

---

## 🌌 Universe & Territory System

### Galaxy Hierarchy

```
  UNIVERSE (Nexus Prime)
  ├── Galaxy 1: Andromeda Nexus ........ (Spiral, 499 systems)
  │   ├── Sector: Core Worlds
  │   │   ├── System 1:1 ............... Star: G-type, Temp: 5800K
  │   │   │   ├── Position 1 .......... Volcanic  (220-260°C, metal 1.5×)
  │   │   │   ├── Position 6 .......... Terran    (10-45°C, balanced)
  │   │   │   └── Position 15 ......... Barren    (-200 to -160°C)
  │   │   ├── System 1:2
  │   │   └── System 1:3
  │   └── Sector: Outer Rim
  ├── Galaxy 2: Triangulum .............. (Spiral, 499 systems)
  ├── Galaxy 3: Magellanic Cloud ........ (Irregular)
  ├── Galaxy 4: Sombrero ................ (Ring)
  ├── Galaxy 5: Whirlpool ............... (Spiral)
  ├── Galaxy 6: Centaurus ............... (Elliptical)
  ├── Galaxy 7: Phoenix ................. (Dwarf)
  ├── Galaxy 8: Draco ................... (Spiral)
  └── Galaxy 9: Eridanus ................ (Irregular)
```

### Planet Types & Bonuses

```
┌──────────────┬──────────┬──────────┬──────────┬──────────┐
│  PLANET TYPE │  METAL   │ CRYSTAL  │DEUTERIUM │  SLOTS   │
├──────────────┼──────────┼──────────┼──────────┼──────────┤
│ Terran       │   1.0×   │   1.0×   │   1.0×   │   163    │
│ Desert       │   1.2×   │   0.8×   │   0.7×   │   162    │
│ Ocean        │   0.8×   │   0.8×   │   1.5×   │   140    │
│ Ice          │   0.9×   │   1.1×   │   1.3×   │   140    │
│ Volcanic     │   1.5×   │   0.6×   │   0.5×   │   170    │
│ Gas Giant    │   0.5×   │   0.7×   │   2.0×   │    90    │
│ Rocky        │   1.1×   │   1.2×   │   0.8×   │   155    │
│ Jungle       │   0.9×   │   1.0×   │   1.2×   │   152    │
│ Barren       │   1.0×   │   1.0×   │   0.6×   │   130    │
│ Exotic       │   1.3×   │   1.3×   │   1.3×   │   180    │
└──────────────┴──────────┴──────────┴──────────┴──────────┘
```

---

## 🔐 Authentication Flow

```
                      ┌─────────────────┐
                      │  LANDING PAGE   │
                      └────────┬────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
     ┌────────────┐  ┌────────────┐  ┌────────────────┐
     │  REGISTER  │  │   LOGIN    │  │  INSTANT DEMO  │
     └──────┬─────┘  └──────┬─────┘  └────────┬───────┘
            │               │                  │
            ▼               ▼                  ▼
   ┌──────────────────────────────────────────────────┐
   │              SUPABASE AUTH                       │
   │  - Email + password                              │
   │  - JWT token generation                          │
   │  - Email verification                            │
   └──────────────────────┬───────────────────────────┘
                          │
                          ▼
   ┌──────────────────────────────────────────────────┐
   │         TRIGGER: on_auth_user_created             │
   │  → INSERT profiles (username, empire_name)       │
   │  → INSERT player_resources (500M, 300C, 100D)    │
   │  → INSERT player_settings (defaults)             │
   └──────────────────────┬───────────────────────────┘
                          │
                          ▼
   ┌──────────────────────────────────────────────────┐
   │       EDGE FUNCTION: create-user-account         │
   │  → Create homeworld planet (position 6)          │
   │  → Create 10 starter buildings                   │
   │  → Create population data                        │
   │  → Create starter fleet (3 fighters, 2 cargo)    │
   │  → Create leaderboard entry                      │
   │  → Create 7 research slots                       │
   └──────────────────────┬───────────────────────────┘
                          │
                          ▼
   ┌──────────────────────────────────────────────────┐
   │              AuthContext Provider                 │
   │  → Store JWT session                             │
   │  → Load profile & resources                      │
   │  → Redirect to /dashboard                        │
   └──────────────────────────────────────────────────┘
```

---

## 🏗️ Component Hierarchy

```
App
├── AuthContext.Provider
│   └── AdminAuthContext.Provider
│       ├── ErrorBoundary
│       │   ├── GameLoop (1-second tick engine)
│       │   ├── GameEventCenter (cross-system event bus)
│       │   ├── NotificationCenter (toast notifications)
│       │   ├── AchievementToast
│       │   ├── WelcomeBackCelebration
│       │   ├── RecipeUnlockRankUpToast
│       │   └── BrowserRouter
│       │       └── Routes
│       │           ├── Public Routes (no auth)
│       │           │   ├── HomePage
│       │           │   ├── LoginPage
│       │           │   ├── RegisterPage
│       │           │   ├── VerifyEmailPage
│       │           │   ├── ResetPasswordPage
│       │           │   └── AuthCallbackPage
│       │           │
│       │           ├── GameRoutesLayout (auth required)
│       │           │   └── GameNavigation (top + side nav)
│       │           │       ├── Dashboard → 85+ game pages
│       │           │       └── RightSidePanel (quick actions)
│       │           │
│       │           └── AdminRoutesLayout (admin auth)
│       │               └── AdminDashboard
│       │
│       └── Shared Feature Components
│           ├── CompareTraitsModal
│           ├── RaceChangeModal
│           ├── MaterialWishlistPanel
│           ├── RecipeUnlockBadge
│           ├── NotificationBell
│           ├── Planet3D
│           ├── SpaceCanvas
│           ├── StarMapViewport
│           └── ViewportControls
```

---

## 🔌 Edge Functions — 18 Serverless Backend Processes

| Function | Trigger | Purpose |
|----------|---------|---------|
| `create-user-account` | Auth signup | Full new-player setup — homeworld, buildings, fleet, resources |
| `create-demo-user` | Demo button | One-click demo account with full empire preset |
| `resolve-combat` | Fleet arrival | Round-by-round combat resolution engine |
| `process-resource-tick` | Cron (10s) | Global resource production update for all players |
| `process-fleet-mission` | Fleet timer | Handle fleet mission completion & return |
| `process-expedition` | Fleet arrival | Expedition outcome generation & rewards |
| `process-harvest-debris` | Fleet arrival | Debris field harvesting & resource collection |
| `process-marketplace-trade` | Order match | Auto-match & execute market buy/sell orders |
| `process-missile-attack` | Missile launch | Interplanetary missile damage calculation |
| `create-moon-from-debris` | Combat end | Moon creation from debris fields (probability check) |
| `bootstrap-admin` | Manual | Initialize admin user account |
| `seed-admin` | Manual | Seed admin role & permissions |
| `admin-verify-user` | Admin action | Approve pending user verifications |
| `check-admin-exists` | Login check | Verify admin account existence |
| `list-pending-verifications`| Admin view | List users awaiting admin approval |
| `resend-verification-email` | User request | Re-send email verification link |
| `resolve-admin-email` | Admin lookup | Resolve admin email by username |
| `convert-guest-account` | Guest → full | Convert demo/temp account to permanent |

---

## 🎮 Player Progression System

### Level Formula

```
  XP to next level = 1000 × 1.5^(currentLevel - 1)
  
  Example progression:
    Level 1 → 2:  1,000 XP
    Level 5 → 6:  5,062 XP
    Level 10 → 11: 38,443 XP
    Level 50 → 51: 1,000,000+ XP
```

### Rank Thresholds

```
  E Rank  ..............  0 points       (Novice Explorer)
  D Rank  ..............  500 points     (Space Cadet)
  C Rank  ..............  2,000 points   (Fleet Lieutenant)
  B Rank  ..............  5,000 points   (Commander)
  A Rank  ..............  10,000 points  (Captain)
  S Rank  ..............  25,000 points  (Admiral)
  SS Rank ..............  50,000 points  (Grand Admiral)
  SSS Rank .............  100,000 points (Galactic Emperor)
```

### Point Scoring

| Activity | Points |
|----------|--------|
| Building level (each) | 1 |
| Research level (each) | 3 |
| Ship destroyed (each) | 1 |
| Planet colonized | 100 |
| Battle won | 50 |
| Quest completed | 25 |

---

## 🛡️ Ship Classification System

### Ship Categories
```
  Light .............. Fighter, Interceptor, Bomber, Corvette
  Medium ............. Frigate, Destroyer
  Heavy .............. Cruiser, Battlecruiser
  Super Heavy ........ Battleship, Dreadnought
  Capital ............ Carrier, Titan
  Super Capital ...... Mothership, Flagship
  Legendary .......... Unique/event ships
```

### Ship Roles
```
  Combat  ............ Frontline combat vessels
  Support ............ Repair, rearm, buff allies
  Stealth ............ Espionage, infiltration
  Siege .............. Planetary bombardment
  Exploration ........ Expedition, scanning
  Mining ............. Asteroid mining, harvesting
  Transport .......... Cargo, colonization
  Hybrid  ............ Multi-role flexibility
```

### Rapid Fire Table (Key Examples)

| Attacker | Target | Shots/Round |
|----------|--------|-------------|
| Fighter | Transport | 5 |
| Heavy Fighter | Light Laser | 3 |
| Cruiser | Fighter | 6 |
| Bomber | Plasma Turret | 5 |
| Destroyer | Deathstar | 2 |
| Deathstar | Fighter | 200 |
| Deathstar | Battleship | 30 |

---

## 🏛️ Building Categories

```
  Civil .............. Housing, research labs, trade centers
  Military ........... Barracks, training grounds, defense HQ
  Industrial ......... Factories, refineries, assembly plants
  Infrastructure ..... Spaceports, power grids, storage depots
  Research ........... Laboratories, observatories, think tanks
  Defense ............ Turrets, shield generators, missile silos
  Energy ............. Solar plants, fusion reactors, deuterium plants
  Storage ............ Warehouses, silos, vaults
  Special ............ Unique/event buildings
```

---

## 🎨 UI Design System

```
  Style .............. Minimalism — dark sci-fi theme
  Colors ............. StyleSystem palette tokens (background, accent, primary,
                       secondary, foreground — each with 50-950 scales)
  Typography ......... Google Fonts — sans for body, heading for titles
  Rounded Corners .... rounded-lg (8px) for cards, rounded-md (6px) for buttons,
                       rounded-full for pills/avatars
  Icons .............. Remix Icon (linear) + FontAwesome
  Animations ......... Motion (Framer Motion) — appropriate micro-interactions
  Spacing ............ 4px grid system, generous whitespace
  Responsive ......... Desktop-first, mobile adaptive with breakpoints
```

---

## 🚀 Feature Flags

All 30 feature systems enabled in Alpha 1.5.0:

```
  moonSystem, espionage, alliances, allianceWars, seasonPass,
  worldBosses, pirateRaids, blackMarket, crafting, masterCrafting,
  fleetFormations, officers, megastructures, motherships,
  planetaryEvents, seasonalEvents, leaderboards, achievements,
  skills, populationSystem, tradeRoutes, resourceTrading,
  blueprints, shipCustomization, starbaseNetwork, stargateNetwork,
  campaignMode, expeditions, bountySystem, insuranceSystem,
  galaxyMap, universeGenerator, combatSimulator, advancedCombat
```

---

## 📦 Technology Stack

```
  FRONTEND ............ React 19, TypeScript 5, Vite 6
  STYLING ............. TailwindCSS 3, Motion (Framer Motion)
  ROUTING ............. React Router DOM 7
  BACKEND ............. Supabase (Auth, Database, Realtime, Edge Functions)
  DATABASE ............ PostgreSQL 15 (50+ tables, RLS policies, 30+ indexes)
  ICONS ............... Remix Icon, FontAwesome
  STATE ............... React Context + Custom Hooks + Supabase Realtime
  FORM HANDLING ....... Native HTML forms with Readdy form backend
  BUILD ............... Vite build → static SPA
```

---

## 🗺️ Next Steps (Alpha 1.5.0 → Beta 2.0)

- [ ] Complete remaining `alert()` → toast UI conversions on secondary pages
- [ ] Implement admin verification workflow (email-based, self-service)
- [ ] Add real-time alliance chat via Supabase Realtime channels
- [ ] Add combat replay/animation for battle reports
- [ ] Mobile-responsive game layout optimizations
- [ ] Performance profiling for large fleet combat (>1000 ships)
- [ ] Tutorial system activation for new player onboarding

---

> **Document Version**: Alpha 1.5.0  
> **Last Updated**: 2026-06-24  
> **Game Universe**: Nexus Prime — 9 Galaxies, 27 Sectors, 285 Systems