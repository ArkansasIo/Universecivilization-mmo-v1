# 🌌 Nexus Prime — Complete Game Systems Reference

> **Alpha 1.5.0** — A browser-based MMORPG space strategy game inspired by OGame.  
> Build empires, command fleets, research technologies, forge alliances, harness cosmic power, and conquer the galaxy.

---

## Systems Overview

### ⚡ Power Grid System
**54 unique reactor variants across 9 types and 6 sub-classes.** Place reactors on a 2D grid, connect them with transmission lines, and manage load balancing to prevent cascading meltdowns. Handles real-time power flow, overload events, auto-SCRAM, and building priority-based load shedding. Inspired by Arknights: Endfield's grid mechanics.

> **Related pages:** Power Grid Manager, Reactor Definitions, Grid Overload Monitor  
> **Hooks:** `usePowerGrid`, `useGridOverload`, `usePowerConsumption`  
> **Tables:** `planet_power_grids`, `power_reactors`, `reactor_definitions`, `grid_connections`, `building_power_connections`, `grid_overload_events`

---

### 🌌 Universe & Galaxy Generation
**9 universes × 90 galaxies each × 499 sectors × 15 planets per system = 3 billion+ potential worlds.** Fully deterministic procedural generation using seeded RNG — the same seed always produces the same universe. Each galaxy has a spectral class (A-Z), type (Spiral/Elliptical/Irregular/etc.), quadrant, dominant species, and unique special features.

> **Related pages:** Galaxy Map, Universe Overview, Sectors, Cosmic Hierarchy, Races Explorer  
> **Hooks:** `useUniverseGenerator`, `useStargateNetwork`, `useTravelSystem`, `useInterstellarObjects`  
> **Tables:** `universes`, `galaxies`, `sectors`, `solar_systems`, `planets`, `moons`

---

### ⚔️ Fleet & Combat
**Turn-based tactical combat with rapid fire, formations, technology bonuses, and battle reports.** Ship classes range from Fighters to Deathstars with detailed stats for attack, defense, HP, speed, and cargo. Supports fleet missions: Attack, Transport, Deploy, Espionage, Colonize, Harvest, Expedition, and Alliance attacks.

> **Related pages:** Fleet Manager, Shipyard, Starships, Combat Simulator, Fleet Formations, War Room, ACS  
> **Hooks:** `useFleetManager`, `useAdvancedCombat`, `useCombatSimulator`, `useFleetFormations`, `useShipProduction`, `useShipUpgrades`  
> **Tables:** `fleets`, `fleet_ships`, `ships`, `combat_logs`, `battle_reports`, `fleet_missions`, `missile_attacks`

---

### 🏛️ Buildings & Infrastructure
**Civil, Industrial, Military, Infrastructure, Research, Defense, Energy, Storage, and Special buildings.** Construction queue with sequential upgrades, resource validation, and time-based completion. Buildings generate resources, unlock capabilities, and provide bonuses. Includes megastructures (Dyson spheres, ringworlds), starbases, moonbases, and motherships.

> **Related pages:** Buildings, Colonies, Megastructures, Starbases, Moonbases, Motherships, Defense  
> **Hooks:** `useBuildingQueue`, `useColonyManagement`, `useMegastructureManager`, `useMothershipManager`  
> **Tables:** `buildings`, `building_queue`, `defense_structures`, `megastructures`, `player_megastructures`, `starbases`, `motherships`

---

### 🔬 Research & Technology
**Full research tree with prerequisites, queue management, and technology bonuses.** Technologies boost production, combat, fleet speed, and unlock new buildings/ships. Includes advanced research for late-game technologies, blueprints for ship and weapon designs, and a seed discovery system for exploring uncharted space.

> **Related pages:** Research, Advanced Research, Blueprints, Seed Discovery, Skills  
> **Hooks:** `useResearchManager`, `useBlueprintSystem`, `useSeedSystem`, `useSkillSystem`  
> **Tables:** `research`, `research_projects`, `technologies`, `blueprints`, `blueprint_jobs`

---

### 🔨 Crafting System
**16-page crafting ecosystem with 5 skill disciplines.** Core crafting with material gathering, recipe discovery, and queue management. Master crafting for legendary-tier items. Five specialization trees: Weaponsmithing, Armorsmithing, Engineering, Alchemy, and Nanotechnology. Includes forge, drones, augmentations, artifacts, dismantling, and crafting rank progression.

> **Related pages:** Crafting Hub, Master Crafting, Forge, Materials, Drones, Augmentations, Artifacts, Dismantle, 5 Skill Trees  
> **Hooks:** `useCrafting`, `useMasterCrafting`, `useCraftingRank`, `useRecipeUnlocks`, `useMaterialWishlist`  
> **Tables:** `crafting_queue`, `crafting_recipes`, `crafting_materials`, `master_crafting_skills`, `master_crafting_materials`

---

### 👥 Alliance & Diplomacy
**Full alliance system with membership, roles, resource sharing, and war coordination.** Diplomacy supports treaties, NAPs, war declarations, and faction reputation. Alliance wars track battles, casualties, and territorial control. Includes guild system, in-game messaging, real-time chat, espionage, and intelligence dashboard.

> **Related pages:** Alliance, Diplomacy, Alliance Wars, Diplomacy Map, Espionage, Intel, Messages, Chat  
> **Hooks:** `useAllianceSystem`, `useAllianceWar`, `useDiplomacy`, `useMessaging`, `useGuildSystem`, `useEspionage`, `useUniverseReputation`  
> **Tables:** `alliances`, `alliance_members`, `alliance_wars`, `war_battles`, `diplomacy`, `diplomatic_relations`, `messages`, `espionage_reports`

---

### 💰 Economy & Trading
**Dynamic marketplace with buy/sell orders, auction house, trade routes, and black market.** Resource trading between players, automated trade convoys, and premium store. Includes insurance system for fleet and cargo protection. Economy system manages market prices, inflation, and currency exchange between Imperial and Republic credits.

> **Related pages:** Marketplace, Resource Trading, Trade Routes, Auction House, Black Market, Insurance, Store  
> **Hooks:** `useMarketplace`, `useEconomySystem`, `useResourceTrading`, `useTradeRoutes`, `useBlackMarket`, `useStore`, `useInsuranceSystem`  
> **Tables:** `marketplace_listings`, `auction_listings`, `trade_routes`, `trade_offers`, `resource_trades`, `economy_transactions`, `black_market_items`

---

### 📅 Galactic Calendar & Events
**360-day galactic year across 12 months with 4 seasons, 24 holidays, and 16 celestial events.** Each month has unique gameplay effects. Seasons affect resource production, fleet speed, and combat. Celestial events include solar flares, meteor showers, nebula surges, quantum anomalies, dark matter tides, and void rifts — each with gameplay modifiers.

> **Related pages:** Galactic Calendar, Seasonal Events, Planetary Events, World Bosses, Events  
> **Hooks:** `useSeasonalEvents`, `usePlanetaryEvents`, `useWorldBosses`, `useGameEventSystem`, `useTimeBasedEvents`  
> **Tables:** `world_bosses`, `world_boss_participants`, `boss_damage_log`, `seasonal_events`, `planetary_events`, `events_participation`

---

### 🎯 Quests & Progression
**Quest system with daily missions, campaign quests, and bounties.** Player progression through levels (1-150), skill trees, and prestige ranks (E through SSS). Season pass with free and premium tiers. Achievement system with unlock conditions and rewards. Officer recruitment and training system.

> **Related pages:** Quests, Campaign, Bounties, Season Pass, Achievements, Officers, Profile, Leaderboard  
> **Hooks:** `useQuestSystem`, `usePlayerProgression`, `useAchievementSystem`, `useSeasonPass`, `useSkillSystem`, `useLeaderboard`  
> **Tables:** `quests`, `achievements`, `player_skills`, `player_officers`, `season_pass_progress`, `player_season_pass`, `leaderboard`

---

### 🌍 Population & Colony Health
**Population growth, happiness, employment, education, and migration across colonies.** Food/water supply chain management with disease prevention and pandemic control. Population efficiency directly affects resource production output. Colony health system tracks food reserves, water purity, and medical capacity.

> **Related pages:** Population, Food/Water/Disease, Colonies, Storage  
> **Hooks:** `usePopulationSystem`, `useColonyManagement`  
> **Tables:** `population_data`, `planetary_events`, `planets`

---

### 🗺️ Diplomacy Map & Empires at War
**Visual diplomacy map with territory control, contested zones, and active war fronts.** Tracks 10 named NPC empires with detailed military compositions, war histories, and diplomatic relations. 8 active war declarations with key battle histories, front line positions, and casualty tracking. Real-time diplomacy events feed.

> **Related pages:** Diplomacy Map, Empires at War, War Room, Intel  
> **Hooks:** `useDiplomacy`, `useAllianceWar`, `useEspionage`  
> **Tables:** `diplomatic_relations`, `diplomatic_proposals`, `faction_reputations`, `alliance_wars`, `war_battles`

---

### 🛡️ Motherships & Megastructures
**Mobile space fortresses (Motherships) and permanent mega-constructions.** Megastructures include Dyson Spheres (energy), Ringworlds (population), Stellar Forges (production), and more. Motherships serve as mobile bases with their own weapons, hangars, and support fleets. Both systems have construction queues with massive resource requirements.

> **Related pages:** Motherships, Enhanced Motherships, Megastructures, Enhanced Megastructures  
> **Hooks:** `useMothershipManager`, `useMegastructureManager`  
> **Tables:** `motherships`, `megastructures`, `player_megastructures`, `megastructure_queue`, `player_structure_modules`

---

### 🌠 Stargates & Travel Network
**Interplanetary transit infrastructure with stargates for instant wormhole travel.** Travel system calculates fleet speed based on engine technology, universe speed, and ship class. Stargate network allows building and connecting gates for near-instant travel between linked systems. Interstellar objects include space anomalies and artifacts.

> **Related pages:** Stargate Network, Travel Network, Expeditions  
> **Hooks:** `useStargateNetwork`, `useTravelSystem`, `useInterstellarObjects`  
> **Tables:** `active_jumps`, `jump_history`, `trade_routes`, `expedition_results`

---

### 🎮 Game Loop & Real-Time Systems
**1 Hz master tick engine orchestrating all systems.** Resource production updates every 10 seconds, fleet arrival checks every 10 seconds, ranking recalculates hourly. Auto-save every 30 seconds. Background processor handles trade routes, espionage, stargate operations, planetary events, and fleet arrivals every 15 seconds.

> **Hooks:** `useGameLoop`, `useAutoSave`, `useBackgroundProcessor`, `useGameTime`, `useRealTimeProduction`  
> **Edge Functions:** `process-resource-tick`, `process-fleet-mission`, `resolve-combat`, `process-expedition`, `process-marketplace-trade`

---

### 🔐 Auth & Account System
**Supabase Auth with email/password, demo accounts, and OAuth providers.** 5-step registration wizard (race selection, empire identity, starting bonuses). "Remember me" with session persistence control. Self-healing JWT corruption recovery. Admin verification workflow with email-based approval. Auth guard protects all 85+ game pages.

> **Related pages:** Home, Login, Register, Verify Email, Reset Password, Auth Callback, Admin  
> **Hooks:** `AuthContext` (React Context), `useAdminPanel`  
> **Edge Functions:** `create-user-account`, `create-demo-user`, `convert-guest-account`, `admin-verify-user`, `bootstrap-admin`

---

### 🛒 Product & Order System
**Full e-commerce backend for premium items, season passes, and store purchases.** Product categories with items, variants, SKUs, pricing modes, discounts, and custom fields. Order headers with line items, payment provider tracking, and recipient JSONB. Ready for Stripe and Shopify integration.

> **Related pages:** Store, Season Pass  
> **Hooks:** `useStore`, `useSeasonPass`  
> **Tables:** `product_categories`, `product_items`, `product_variants`, `product_skus`, `order_headers`, `order_items`

---

## Tech Stack

```
FRONTEND ............ React 19, TypeScript 5, Vite 6
STYLING ............. TailwindCSS 3, Motion (Framer Motion)
ROUTING ............. React Router DOM 7
BACKEND ............. Supabase (Auth, Database, Realtime, Edge Functions)
DATABASE ............ PostgreSQL 15 (50+ tables, RLS policies)
STATE ............... React Context + 60+ Custom Hooks
ICONS ............... Remix Icon, FontAwesome
DESIGN .............. StyleSystem palette tokens, minimalism sci-fi dark theme
```

---

## Project Scale

```
┌─────────────────────────┬──────────────┐
│ METRIC                  │ COUNT        │
├─────────────────────────┼──────────────┤
│ Total Pages             │ 85+          │
│ Custom Hooks            │ 60+          │
│ Database Tables         │ 50+          │
│ Edge Functions          │ 18           │
│ Mock Data Files         │ 40+          │
│ React Contexts          │ 2            │
│ Global Features Enabled │ 34           │
├─────────────────────────┼──────────────┤
│ Galaxies (per universe) │ 90           │
│ Max Sectors (per galaxy)│ 499          │
│ Planets (per system)    │ 15           │
│ Ship Classes            │ 7 categories │
│ Reactor Variants        │ 54           │
│ Crafting Skill Trees    │ 5            │
│ Empire Ranks            │ E → SSS (8)  │
│ Player Levels           │ 1 → 150      │
│ Galactic Months         │ 12           │
│ Galactic Holidays       │ 24           │
│ Celestial Events        │ 16           │
└─────────────────────────┴──────────────┘
```

---

## New Ideas & Feature Suggestions

### From Code Analysis — High-Potential Additions

| # | System | Idea | Impact | Effort |
|---|--------|------|--------|--------|
| 1 | Power Grid | **Reactor Synergy Bonuses** — same-class adjacent reactors boost each other +10%. Different-class adjacent: -5% interference penalty | 🟠 High | 🟢 Low |
| 2 | Power Grid | **Grid Heat Map Overlay** — color-gradient showing real-time power flow density per cell | 🟠 High | 🟡 Medium |
| 3 | Power Grid | **Battery Storage Buildings** — store excess during surplus, auto-release during deficit | 🟠 High | 🟡 Medium |
| 4 | Power Grid | **Reactor Aging Curve** — efficiency decays with runtime hours. Maintenance restores. | 🟡 Medium | 🟢 Low |
| 5 | Universe | **Galaxy Heat Map** — color-code galaxies by player activity, warzone density, discovery rate | 🟠 High | 🟢 Low |
| 6 | Universe | **Fog of War** — undiscovered galaxies/sectors are obscured until explored | 🟠 High | 🟡 Medium |
| 7 | Universe | **Intergalactic Hyperlanes** — travel connections between adjacent galaxies | 🟡 Medium | 🟡 Medium |
| 8 | Universe | **Galaxy Leaderboard Filter** — "Top 100 in Andromeda" vs global rankings | 🟡 Medium | 🟢 Low |
| 9 | Combat | **Ship Veterancy** — ships that survive battles gain XP and combat bonuses | 🟡 Medium | 🟡 Medium |
| 10 | Combat | **Formation Rock-Paper-Scissors** — Wedge beats Line, Line beats Screen, Screen beats Wedge | 🟡 Medium | 🟡 Medium |
| 11 | Crafting | **Crafting Quality Grades** — Poor/Common/Uncommon/Rare/Epic/Legendary output tiers | 🟡 Medium | 🟡 Medium |
| 12 | Economy | **Player Corporations** — multi-player business entities with shared profits | 🟡 Medium | 🟠 High |
| 13 | Events | **Server-Wide Event Chains** — multi-stage events where the whole server participates collectively | 🟠 High | 🟠 High |
| 14 | Fleet | **Flagship Customization** — name, appearance, bonus selection for admiral's flagship | 🟡 Medium | 🟢 Low |
| 15 | Progression | **Prestige Reset Bonuses** — permanent bonuses gained each prestige cycle | 🟡 Medium | 🟡 Medium |

---

## Documentation Index

| Document | Focus |
|----------|-------|
| `README.md` | Project entry point, features, tech stack, setup |
| `ARCHITECTURE.md` | System architecture, component hierarchy, database schema |
| `GAME_UML.md` | Complete game systems UML, feature catalog, hooks index |
| `GAME_TODO.md` | Development roadmap — 131 tasks across 12 phases |
| `FRONTEND_AUTH_UML.md` | Auth flow, login/register, route guard, state machines |
| `POWER_SYSTEM_UML.md` | Power grid, reactors, overload events, cascade logic |
| `GALAXY_ARCHITECTURE_UML.md` | Universe generation, galaxy classes, sector types, planet positions |
| **SYSTEMS_OVERVIEW.md** *(this file)* | Repo-style systems catalog with ideas and suggestions |

---

> **Document Version** Alpha 1.5.0 | **Last Updated** 2026-06-26  
> **Game Universe** Nexus Prime — 9 Universes, 810 Galaxies, 405K Sectors, 3B+ potential worlds