# 🚀 Galactic Empire — Master TODO & Development Roadmap

> **Last Updated:** 2026-06-26  
> **Current State:** Alpha 1.5.0 — 85+ pages, 60+ hooks, 50+ tables, 18 edge functions  
> **Goal:** Beta 2.0 — fully playable, all systems wired end-to-end, no mock data

---

## 📊 Progress Overview

```
PHASE 1  ████████░░░░░░░░░░  40%  Core Infrastructure
PHASE 2  ██████░░░░░░░░░░░░  30%  Resource & Economy
PHASE 3  ████████░░░░░░░░░░  40%  Fleet & Combat
PHASE 4  ██████░░░░░░░░░░░░  30%  Research & Technology
PHASE 5  ████░░░░░░░░░░░░░░  20%  Crafting System
PHASE 6  ██████░░░░░░░░░░░░  30%  Social & Alliance
PHASE 7  ████░░░░░░░░░░░░░░  20%  Exploration & Universe
PHASE 8  ████░░░░░░░░░░░░░░  20%  Events & Activities
PHASE 9  ██████░░░░░░░░░░░░  30%  Progression & Achievements
PHASE 10 ████░░░░░░░░░░░░░░  20%  Admin & Moderation
PHASE 11 ██████░░░░░░░░░░░░  30%  UI/UX Polish
PHASE 12 ██░░░░░░░░░░░░░░░░  10%  Performance & Security
```

---

## 🔴 PHASE 1 — Core Infrastructure (Critical Path)

These items block everything else. Must be done first.

### 1.1 Database Population & Seed Data

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| DB-01 | Seed `building_definitions` table with all building types | 🔴 Critical | ❌ Not Started | Currently using hardcoded `BUILDING_LEVELS` mock in training-center and buildingDefinitions.ts. Need real DB table with costs, production rates, upgrade times per level |
| DB-02 | Seed `technologies` table with full research tree | 🔴 Critical | ❌ Not Started | Research tree exists only in `researchTechnologies.ts` mock data. DB table `technologies` needs seeding with all techs, prerequisites, costs |
| DB-03 | Seed `ships` definitions table with all ship types & stats | 🔴 Critical | ❌ Not Started | Ships defined in 15+ mock data files. Need a `ship_definitions` table with attack, defense, HP, speed, cargo, fuel cost, build time, build cost |
| DB-04 | Seed `crafting_recipes` and `crafting_materials` tables | 🔴 Critical | ❌ Not Started | All crafting items exist only in `craftingItems.ts`, `craftingMaterials.ts` mock files. DB tables exist but are empty |
| DB-05 | Seed `quests` definitions table with all quests | 🔴 Critical | ❌ Not Started | Quest data scattered in mock files. Need seeded quest_definitions table with objectives, rewards, prerequisites |
| DB-06 | Seed `achievements` definitions table | 🔴 Critical | ❌ Not Started | Achievements in `achievementDefinitions.ts` mock. Need DB seed |
| DB-07 | Seed `officers` definitions table | 🔴 Critical | ❌ Not Started | Officer data in `officers.ts` mock. Need DB seed |
| DB-08 | Seed `planetary_events` definitions table | 🟠 High | ❌ Not Started | Events defined but not seeded to DB |
| DB-09 | Seed `seasonal_events` definitions table | 🟠 High | ❌ Not Started | Event data needs DB seed |
| DB-10 | Seed `world_bosses` definitions table | 🟠 High | ❌ Not Started | Boss stats, HP, rewards need DB seed |
| DB-11 | Seed `skill_definitions` table for all skill trees | 🟠 High | ❌ Not Started | Crafting skill trees exist in mock. Need DB seed for all 5 disciplines + general skills |

### 1.2 Auth & Account System Hardening

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| AUTH-01 | Add email verification enforcement toggle | 🟠 High | ❌ Not Started | Currently project may auto-confirm. Add admin toggle |
| AUTH-02 | Add password strength indicator on register page | 🟡 Medium | ❌ Not Started | Visual feedback during password creation |
| AUTH-03 | Add "Resend Verification" button with rate limiting | 🟡 Medium | ⚠️ Partial | Exists on login page but needs cooldown timer UI |
| AUTH-04 | Add OAuth providers (Discord, Google) configuration UI | 🟡 Medium | ⚠️ Partial | Social buttons exist on login but need full OAuth setup |
| AUTH-05 | Add account deletion flow with confirmation | 🟡 Medium | ❌ Not Started | GDPR compliance — account + all data deletion |
| AUTH-06 | Add 2FA (Two-Factor Authentication) | 🟢 Low | ❌ Not Started | TOTP-based 2FA for sensitive accounts |

### 1.3 Game Loop Engine

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| LOOP-01 | Fix resource tick to use real building production formulas | 🔴 Critical | ⚠️ Partial | `process-resource-tick` edge function exists but may not read real building levels. Dashboard calculates but doesn't persist |
| LOOP-02 | Add proper energy deficit calculation — buildings go offline when energy < requirement | 🔴 Critical | ❌ Not Started | Energy system exists in config but no enforcement in game loop |
| LOOP-03 | Add population growth tick (every 60s) | 🟠 High | ❌ Not Started | Population data table exists, growth formula in config, but no tick processing |
| LOOP-04 | Add food/water consumption tick | 🟠 High | ❌ Not Started | Colony health system not implemented despite page existing |
| LOOP-05 | Add disease spread tick | 🟡 Medium | ❌ Not Started | Food-water-disease page exists but no backend logic |
| LOOP-06 | Add trade route processing tick | 🟠 High | ❌ Not Started | Trade routes table exists but no automated processing |
| LOOP-07 | Add debris field decay tick | 🟡 Medium | ❌ Not Started | Debris should decay over time (e.g. 5% per hour) |
| LOOP-08 | Add moon creation check on combat end | 🟡 Medium | ⚠️ Partial | `create-moon-from-debris` edge function exists but not integrated into combat resolution |

---

## 🟠 PHASE 2 — Resource & Economy Systems

### 2.1 Resource Production

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| RES-01 | Wire all building production to real DB reads | 🔴 Critical | ⚠️ Partial | Dashboard reads from DB. Buildings page, colonies page, population page all use mock data |
| RES-02 | Implement storage capacity limits | 🟠 High | ❌ Not Started | `storage` page exists but no enforcement of max storage |
| RES-03 | Add resource overflow warnings (storage full → production stops) | 🟠 High | ❌ Not Started | UI needs to show when storage is capped |
| RES-04 | Implement planet-type bonus multipliers in production calc | 🟠 High | ❌ Not Started | Terran=1.0, Volcanic=1.5 metal, etc. Config exists but not applied |
| RES-05 | Wire population efficiency into production | 🟡 Medium | ❌ Not Started | Formula exists in config — employment rate × happiness affects output |
| RES-06 | Wire officer bonuses into production (engineer assignment) | 🟡 Medium | ❌ Not Started | Officer system exists but bonuses not applied to resource ticks |

### 2.2 Marketplace & Trading

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| MKT-01 | Wire marketplace buy/sell order creation to DB | 🔴 Critical | ⚠️ Partial | `useMarketplace` hook exists but needs full CRUD wiring |
| MKT-02 | Implement order matching engine (auto-match buy ↔ sell) | 🔴 Critical | ⚠️ Partial | `process-marketplace-trade` edge function exists, needs testing |
| MKT-03 | Add marketplace price history charts | 🟡 Medium | ❌ Not Started | No price tracking table or chart UI |
| MKT-04 | Wire auction house bidding to real DB | 🟠 High | ❌ Not Started | Auction page exists but likely mock-only |
| MKT-05 | Wire black market refresh + purchase to DB | 🟠 High | ❌ Not Started | Black market page exists, items in mock, no DB wiring |
| MKT-06 | Wire trade routes — create, manage, auto-run | 🟠 High | ❌ Not Started | Trade routes page/hook exist but no real DB operations |
| MKT-07 | Wire resource trading (direct player-to-player) | 🟠 High | ❌ Not Started | Resource trading page/hook exist but mock-only |
| MKT-08 | Wire insurance system — purchase, claim, payout | 🟡 Medium | ❌ Not Started | Insurance page/hook exist but no backend logic |

### 2.3 Store & Premium

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| STORE-01 | Wire store purchases to DB inventory | 🟠 High | ❌ Not Started | Store page + useStore hook exist, storeItems.ts mock data, no real purchase flow |
| STORE-02 | Add premium currency (dark matter) purchase flow | 🟠 High | ❌ Not Started | Needs Stripe integration for real payments |
| STORE-03 | Wire season pass purchase + tier unlocks | 🟠 High | ❌ Not Started | Season pass page/hook exist but mock-only |

---

## 🟠 PHASE 3 — Fleet & Combat Systems

### 3.1 Fleet Management

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| FLT-01 | Wire fleet creation to real DB — select ships, set mission, dispatch | 🔴 Critical | ⚠️ Partial | `useFleetManager` exists with DB writes. Fleet page needs full wiring |
| FLT-02 | Wire fleet recall functionality | 🟠 High | ⚠️ Partial | Recall button exists on dashboard, needs DB update validation |
| FLT-03 | Implement fleet speed calculation (engine tech × universe speed × ship speed) | 🟠 High | ❌ Not Started | Travel time formula from config not applied |
| FLT-04 | Add fuel consumption calculation (deuterium cost for travel) | 🟠 High | ❌ Not Started | Config has fleet fuel system but not implemented |
| FLT-05 | Wire fleet formations — apply formation bonuses in combat | 🟠 High | ⚠️ Partial | `useFleetFormations` exists but bonuses not applied in combat resolution |
| FLT-06 | Implement fleet cargo capacity limits | 🟡 Medium | ❌ Not Started | Loot/transport limited by total cargo of ships in fleet |

### 3.2 Ship Production & Upgrades

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| SHP-01 | Wire shipyard production queue to DB — build ships with real costs & time | 🔴 Critical | ❌ Not Started | Shipyard page exists but likely mock. Need real build queue processing |
| SHP-02 | Wire ship upgrades — component upgrades with real costs | 🟠 High | ❌ Not Started | Ship upgrades page/hook exist but mock-only |
| SHP-03 | Wire ship customization — visual and functional modifications | 🟡 Medium | ❌ Not Started | Customization page exists, no real persistence |
| SHP-04 | Wire enhanced ships — elite variant unlocks | 🟡 Medium | ❌ Not Started | Enhanced ships page/hook exist but mock-only |

### 3.3 Combat Resolution

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| CBT-01 | Complete `resolve-combat` edge function — round-by-round damage with rapid fire, formations, tech bonuses | 🔴 Critical | ⚠️ Partial | Edge function exists. Needs testing with real fleet data |
| CBT-02 | Wire combat log display — battle reports page | 🟠 High | ⚠️ Partial | Combat logs table exists, but no dedicated battle report viewer page |
| CBT-03 | Add combat replay/animation system | 🟢 Low | ❌ Not Started | Visual battle replay for combat logs |
| CBT-04 | Wire ground combat system to DB | 🟠 High | ❌ Not Started | Ground combat page/hook exist, mock-only |
| CBT-05 | Wire defense structures — automated defense fire on attacker | 🟠 High | ❌ Not Started | Defense page exists but structures don't participate in combat |
| CBT-06 | Wire missile attacks — interplanetary missile system | 🟡 Medium | ❌ Not Started | `process-missile-attack` edge function exists, no UI integration |

### 3.4 Motherships & Megastructures

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| MEGA-01 | Wire megastructure construction to DB — Dyson spheres, ringworlds, etc. | 🟠 High | ❌ Not Started | Pages/hooks exist but mock-only |
| MEGA-02 | Wire mothership management — mobile base fleet operations | 🟠 High | ❌ Not Started | Motherships page/hook exist but mock-only |
| MEGA-03 | Wire starbase construction & defense | 🟡 Medium | ❌ Not Started | Starbases page exists, mock-only |
| MEGA-04 | Wire moonbase operations — phalanx sensors, jump gates | 🟡 Medium | ❌ Not Started | Moonbases page exists, mock-only |

---

## 🟡 PHASE 4 — Research & Technology

### 4.1 Research System

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| RSH-01 | Wire research queue to DB — start, progress, complete | 🔴 Critical | ⚠️ Partial | `useResearchManager` exists with DB. Dashboard shows queue. Needs full wiring on research page |
| RSH-02 | Implement technology prerequisites check | 🟠 High | ❌ Not Started | Research tree has prerequisites defined. Must check before allowing research start |
| RSH-03 | Apply technology bonuses to production, combat, fleet speed | 🟠 High | ❌ Not Started | Research levels should multiply production/combat stats |
| RSH-04 | Wire advanced research — late-game techs | 🟡 Medium | ❌ Not Started | Advanced research page exists, mock-only |
| RSH-05 | Wire blueprint system — discovery, permanent unlocks | 🟠 High | ❌ Not Started | Blueprints page/hook exist but mock-only |
| RSH-06 | Wire seed discovery system — explore uncharted space | 🟡 Medium | ❌ Not Started | Seed discovery page/hook exist but mock-only |

### 4.2 Skills System

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| SKL-01 | Wire player skill tree to DB — allocate skill points, unlock skills | 🟠 High | ❌ Not Started | Skills page/hook exist but mock-only. `player_skills` table empty |
| SKL-02 | Apply skill bonuses to relevant systems (production, combat, crafting) | 🟠 High | ❌ Not Started | Skills should affect gameplay but bonuses not applied |
| SKL-03 | Wire all 5 crafting skill trees to DB | 🟠 High | ❌ Not Started | Crafting skill tree pages exist with rich UI but mock-only |

---

## 🟡 PHASE 5 — Crafting System

### 5.1 Core Crafting

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| CRF-01 | Wire crafting queue to DB — assemble items with real materials & time | 🔴 Critical | ❌ Not Started | Crafting hub page exists, `crafting_queue` table exists, no wiring |
| CRF-02 | Implement material consumption on craft | 🟠 High | ❌ Not Started | Materials must be deducted from inventory on craft |
| CRF-03 | Implement recipe prerequisite checks | 🟠 High | ❌ Not Started | Can't craft without required materials in inventory |
| CRF-04 | Wire forge (weapons/armor smithing) to DB | 🟠 High | ❌ Not Started | Forge page exists, mock-only |
| CRF-05 | Wire materials inventory to DB | 🟠 High | ❌ Not Started | Materials page exists, mock-only |
| CRF-06 | Wire drone crafting & deployment | 🟡 Medium | ❌ Not Started | Drones page exists, mock-only |
| CRF-07 | Wire augmentations crafting | 🟡 Medium | ❌ Not Started | Augmentations page exists, mock-only |
| CRF-08 | Wire artifact assembly | 🟡 Medium | ❌ Not Started | Artifacts page exists, mock-only |
| CRF-09 | Wire dismantle (salvage) system | 🟡 Medium | ❌ Not Started | Dismantle page exists, mock-only |
| CRF-10 | Wire crafting rank progression | 🟡 Medium | ❌ Not Started | Crafting rank page/hook exist but mock-only |
| CRF-11 | Wire recipe unlock system | 🟡 Medium | ❌ Not Started | Recipe unlock page/hook exist but mock-only |

### 5.2 Master Crafting

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| MCRF-01 | Wire master crafting to DB — legendary-tier items | 🟠 High | ❌ Not Started | Master crafting page/hook exist, `master_crafting_*` tables exist, no wiring |
| MCRF-02 | Wire material wishlist tracking | 🟡 Medium | ❌ Not Started | Wishlist panel component exists, mock-only |

---

## 🟡 PHASE 6 — Social & Alliance

### 6.1 Alliance System

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| ALY-01 | Wire alliance creation to DB | 🔴 Critical | ⚠️ Partial | Alliance page/hook exist. `alliances` table exists. Needs full CRUD wiring |
| ALY-02 | Wire alliance join/leave/invite/kick to DB | 🟠 High | ❌ Not Started | Membership management UI exists, no DB wiring |
| ALY-03 | Wire alliance role management (founder → recruit permissions) | 🟠 High | ❌ Not Started | Roles defined in config but not enforced |
| ALY-04 | Wire alliance resource sharing | 🟡 Medium | ❌ Not Started | Alliance resources not implemented |
| ALY-05 | Wire alliance war system — declare war, track battles, peace treaties | 🟠 High | ❌ Not Started | Alliance war page/hook exist but mock-only |
| ALY-06 | Add real-time alliance chat via Supabase Realtime | 🟠 High | ❌ Not Started | Chat page exists but likely mock. Needs realtime channels |

### 6.2 Diplomacy

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| DIP-01 | Wire diplomacy — treaties, NAPs, war declarations to DB | 🟠 High | ❌ Not Started | Diplomacy page/hook exist, `diplomacy` table exists, no wiring |
| DIP-02 | Wire diplomacy map visualization | 🟡 Medium | ❌ Not Started | Diplomacy map page exists, mock-only |
| DIP-03 | Wire faction reputation system | 🟡 Medium | ❌ Not Started | `useUniverseReputation`, `faction_reputations` table exist, no wiring |

### 6.3 Communication

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| MSG-01 | Wire personal messaging to full DB CRUD | 🔴 Critical | ⚠️ Partial | Messages page/hook exist. `messages` table exists. Needs complete wiring with inbox/sent/read states |
| MSG-02 | Wire notification system to real DB events | 🟠 High | ⚠️ Partial | `notifications` table exists. Game loop creates some. Need all event types wired |
| MSG-03 | Wire espionage reports to DB | 🟠 High | ❌ Not Started | Espionage page/hook exist, mock-only |
| MSG-04 | Wire intel dashboard to real data | 🟡 Medium | ❌ Not Started | Intel page exists, mock-only |

---

## 🟡 PHASE 7 — Exploration & Universe

### 7.1 Galaxy & Universe

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| UNI-01 | Wire galaxy map to real DB planet/sector data | 🔴 Critical | ❌ Not Started | Galaxy map page exists but likely mock or static data |
| UNI-02 | Wire universe overview to real DB | 🟠 High | ❌ Not Started | Universe page exists, mock-only |
| UNI-03 | Wire sectors page to DB | 🟡 Medium | ❌ Not Started | Sectors page exists, mock-only |
| UNI-04 | Wire stargate network — build, connect, travel | 🟠 High | ❌ Not Started | Stargate page/hook exist but mock-only |
| UNI-05 | Wire universe generator — procedural system creation | 🟡 Medium | ❌ Not Started | `useUniverseGenerator` exists, `universes`, `galaxies`, `sectors`, `solar_systems` tables exist, needs seeding + generation logic |

### 7.2 Exploration

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| EXP-01 | Wire expeditions — send fleet, receive outcomes, collect rewards | 🟠 High | ⚠️ Partial | `process-expedition` edge function exists. Game loop handles expedition arrival. Needs full UI wiring |
| EXP-02 | Wire campaign mode — story-driven missions | 🟡 Medium | ❌ Not Started | Campaign page exists, mock-only |
| EXP-03 | Wire missions system to DB | 🟠 High | ❌ Not Started | Missions page exists, mock-only |
| EXP-04 | Wire races explorer — browse NPC, enemy, friendly races | 🟡 Medium | ❌ Not Started | Races explorer page exists, mock-only |
| EXP-05 | Wire cosmic hierarchy view | 🟡 Medium | ❌ Not Started | Cosmic hierarchy page exists, mock-only |
| EXP-06 | Wire stellaris view (3D galaxy visualization) | 🟢 Low | ❌ Not Started | Stellaris view page exists with mock data |

### 7.3 Colonization & Travel

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| COL-01 | Wire colonization mission — send colony ship, claim planet | 🟠 High | ⚠️ Partial | Game loop handles colonize mission. Need full UI flow |
| COL-02 | Wire colony management — build on remote planets | 🟠 High | ❌ Not Started | Colonies page/hook exist but mock-only |
| COL-03 | Wire travel network — interplanetary transit infrastructure | 🟡 Medium | ❌ Not Started | Travel network page exists, mock-only |

---

## 🟡 PHASE 8 — Events & Activities

### 8.1 World Bosses

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| WBS-01 | Wire world boss spawn logic (periodic, triggered) | 🟠 High | ❌ Not Started | World bosses page/hook exist, `world_bosses`, `boss_damage_log`, `world_boss_participants` tables exist, no spawn/combat logic |
| WBS-02 | Wire boss damage submission from players | 🟠 High | ❌ Not Started | Need damage calculation + contribution tracking |
| WBS-03 | Wire boss reward distribution on defeat | 🟠 High | ❌ Not Started | Rewards proportional to contribution % |

### 8.2 Quests & Missions

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| QST-01 | Wire quest tracking to DB — accept, progress, complete, claim | 🟠 High | ❌ Not Started | Quests page/hook exist, `quests` table exists, no wiring |
| QST-02 | Wire daily missions — reset, new daily tasks | 🟡 Medium | ❌ Not Started | Daily mission system not implemented |
| QST-03 | Wire bounties — place bounty, claim bounty | 🟡 Medium | ❌ Not Started | Bounties page/hook exist but mock-only |

### 8.3 Events

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| EVT-01 | Wire seasonal events — activate, track progress, distribute rewards | 🟠 High | ❌ Not Started | Seasonal events page/hook exist, `seasonal_events` table exists, no wiring |
| EVT-02 | Wire planetary events — crisis and opportunity events | 🟡 Medium | ❌ Not Started | Planetary events page/hook exist but mock-only |
| EVT-03 | Wire pirate raids — AI raid scheduling + counter-piracy | 🟠 High | ❌ Not Started | Pirates page/hook exist, `pirate_raids` table exists, no spawn/combat logic |
| EVT-04 | Wire game event center to real event bus | 🟡 Medium | ⚠️ Partial | `GameEventCenter` component exists, needs all events wired |

---

## 🟡 PHASE 9 — Progression & Achievements

### 9.1 Player Progression

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| PRG-01 | Wire XP gain from all activities (building, research, combat, quests) | 🟠 High | ⚠️ Partial | XP formula in config. Some hooks may track. Need comprehensive wiring |
| PRG-02 | Wire level-up rewards — skill points, unlocks | 🟠 High | ❌ Not Started | Level-up should grant skill points and unlock features |
| PRG-03 | Wire prestige system | 🟢 Low | ❌ Not Started | Prestige defined in config but not implemented |
| PRG-04 | Wire rank calculation (E → SSS based on total points) | 🟠 High | ⚠️ Partial | Rank thresholds in config. Profile has rank field. Need auto-recalc |

### 9.2 Achievements

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| ACH-01 | Wire achievement tracking — check conditions, award on complete | 🟠 High | ❌ Not Started | Achievements page/hook exist, `achievements` table exists, mock-only |
| ACH-02 | Wire achievement reward claiming | 🟠 High | ❌ Not Started | Claim flow for achievement rewards |
| ACH-03 | Wire achievement toast notifications | 🟡 Medium | ⚠️ Partial | `AchievementToast` component exists, needs wiring |

### 9.3 Leaderboard

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| LDB-01 | Wire leaderboard to real DB data | 🟠 High | ⚠️ Partial | Leaderboard page/hook exist, `leaderboard_cache` table exists, needs auto-refresh |
| LDB-02 | Implement leaderboard recalculation (hourly cron via edge function) | 🟠 High | ❌ Not Started | Config says ranking updates every 3600s. No implementation |
| LDB-03 | Wire universe leaderboard comparisons | 🟡 Medium | ❌ Not Started | Universe leaderboard page exists, mock-only |

---

## 🔵 PHASE 10 — Admin & Moderation

### 10.1 Admin Dashboard

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| ADM-01 | Wire admin user management — search, view, edit, ban players | 🟠 High | ⚠️ Partial | Admin dashboard page exists, `admin_roles`, `admin_logs` tables exist, partial wiring |
| ADM-02 | Wire admin verification workflow (approve pending users) | 🟠 High | ⚠️ Partial | `admin-verify-user`, `list-pending-verifications` edge functions exist. Needs admin UI |
| ADM-03 | Wire admin game settings — speed, feature flags, economy tuning | 🟡 Medium | ❌ Not Started | `server_settings` table exists but no admin UI to modify |
| ADM-04 | Wire admin analytics — player counts, resource flows, combat stats | 🟡 Medium | ❌ Not Started | No analytics dashboard yet |
| ADM-05 | Add admin event creation — spawn bosses, trigger events | 🟡 Medium | ❌ Not Started | Manual event triggering for admins |
| ADM-06 | Wire admin log viewer | 🟡 Medium | ❌ Not Started | `admin_logs` table exists, no viewer UI |

### 10.2 Moderation Tools

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| MOD-01 | Add chat moderation — mute, warning, kick | 🟡 Medium | ❌ Not Started | No moderation tools for chat |
| MOD-02 | Add report system — player reporting with review queue | 🟡 Medium | ❌ Not Started | No report system exists |
| MOD-03 | Add automatic cheat detection | 🟢 Low | ❌ Not Started | Basic anomaly detection for resource gains |

---

## 🔵 PHASE 11 — UI/UX Polish

### 11.1 Responsive & Mobile

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| UI-01 | Mobile-responsive game layout — hamburger menu, stacked panels | 🟠 High | ❌ Not Started | Game is desktop-only. 85+ pages need mobile adaptation |
| UI-02 | Mobile-optimized sidebar navigation | 🟠 High | ❌ Not Started | Sidebar needs collapsible mobile variant |
| UI-03 | Mobile-optimized fleet/combat views | 🟡 Medium | ❌ Not Started | Complex tables need mobile-friendly versions |

### 11.2 UI Consistency

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| UI-04 | Replace all remaining `alert()` calls with toast notifications | 🟠 High | ⚠️ Partial | Many secondary pages still use native alert() |
| UI-05 | Standardize card/panel styling across all 85+ pages | 🟡 Medium | ⚠️ Partial | Dashboard looks great. Many other pages have inconsistent styling |
| UI-06 | Add loading skeletons for all data-fetching pages | 🟡 Medium | ❌ Not Started | Currently shows spinners or "Loading..." text |
| UI-07 | Add empty states for all list/detail pages | 🟡 Medium | ❌ Not Started | When no data, show helpful "Get started" messages |
| UI-08 | Add error states with retry buttons for all data-fetching pages | 🟠 High | ❌ Not Started | Currently shows console errors or blank screens |

### 11.3 Navigation & UX

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| UI-09 | Add breadcrumbs to deep navigation paths | 🟡 Medium | ❌ Not Started | Helps orientation in deep game pages |
| UI-10 | Add keyboard shortcuts for common actions | 🟢 Low | ❌ Not Started | Hotkeys for navigation, build, research |
| UI-11 | Add tutorial system activation — guided first-time experience | 🟠 High | ❌ Not Started | `useTutorialSystem` hook exists but tutorial content not created |
| UI-12 | Add tooltip system for game mechanics explanations | 🟡 Medium | ❌ Not Started | New players need inline explanations of formulas |

### 11.4 Visual Polish

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| UI-13 | Add page transition animations | 🟢 Low | ❌ Not Started | Smooth transitions between game pages |
| UI-14 | Add micro-interactions — button press, hover effects, pulse on updates | 🟡 Medium | ⚠️ Partial | Dashboard has some animations. Extend to all pages |
| UI-15 | Add resource change animations (+/- floating numbers) | 🟢 Low | ❌ Not Started | Visual feedback when resources change |
| UI-16 | Add combat animation/vfx placeholders | 🟢 Low | ❌ Not Started | Basic visual effects for battles |

---

## 🔵 PHASE 12 — Performance & Security

### 12.1 Performance

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| PERF-01 | Add React.memo to all list item components | 🟠 High | ❌ Not Started | 85+ pages — many render unnecessary re-renders |
| PERF-02 | Add virtual scrolling for large lists (fleet, marketplace, leaderboard) | 🟡 Medium | ❌ Not Started | Lists with 1000+ items need virtualization |
| PERF-03 | Optimize database queries — add missing indexes | 🟠 High | ⚠️ Partial | Indexes defined in schema. Need to verify all are created |
| PERF-04 | Add request deduplication (prevent duplicate API calls) | 🟡 Medium | ❌ Not Started | Game loop runs multiple hooks that may fetch same data |
| PERF-05 | Profile game loop tick performance — ensure < 100ms per tick | 🟡 Medium | ❌ Not Started | Tick processing should be lightweight |
| PERF-06 | Add bundle splitting — lazy load heavy pages | 🟠 High | ⚠️ Partial | React.lazy() used for routes. Verify all pages are split |

### 12.2 Security

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| SEC-01 | Audit all RLS policies — ensure no data leaks | 🟠 High | ⚠️ Partial | RLS defined in schema. Need comprehensive audit |
| SEC-02 | Add rate limiting to all edge functions | 🟠 High | ❌ Not Started | Prevent abuse of resource tick, combat resolution, etc. |
| SEC-03 | Add input validation to all edge functions | 🟠 High | ❌ Not Started | Malformed requests should be rejected |
| SEC-04 | Add CORS configuration review | 🟡 Medium | ❌ Not Started | Ensure proper CORS headers on edge functions |
| SEC-05 | Add Content Security Policy headers | 🟡 Medium | ❌ Not Started | CSP headers not configured |

### 12.3 Testing & QA

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| QA-01 | Create test plan document covering all 12 game systems | 🟡 Medium | ❌ Not Started | Systematic test coverage |
| QA-02 | Test resource production math — verify formulas against OGame reference | 🟠 High | ❌ Not Started | Ensure production rates match design |
| QA-03 | Test combat math — verify rapid fire, damage, loot calculations | 🟠 High | ❌ Not Started | Combat simulator should match actual combat outcomes |
| QA-04 | Test economy balance — inflation, market equilibrium | 🟡 Medium | ❌ Not Started | Long-running economies need balance testing |
| QA-05 | Test concurrent operations — two players attacking same target | 🟡 Medium | ❌ Not Started | Race condition testing for combat |

---

## 📋 Quick Wins (Low Effort, High Impact)

These can be knocked out fast and make a big difference:

| ID | Task | Impact | Effort |
|----|------|--------|--------|
| QW-01 | Replace all `alert()` calls with toast notifications across all pages | 🟠 High | 🟢 Low |
| QW-02 | Add loading skeletons to Dashboard, Fleet, Research, Galaxy pages | 🟡 Medium | 🟢 Low |
| QW-03 | Add "No data" empty states to all list pages | 🟡 Medium | 🟢 Low |
| QW-04 | Enable the tutorial system with basic first-time walkthrough | 🟠 High | 🟡 Medium |
| QW-05 | Add breadcrumbs to all deep pages | 🟡 Medium | 🟢 Low |
| QW-06 | Add tooltip hints on key game mechanics (production formula, combat, etc.) | 🟡 Medium | 🟡 Medium |
| QW-07 | Standardize page header styles across all 85+ pages | 🟡 Medium | 🟡 Medium |
| QW-08 | Add keyboard shortcut for "Escape" to close modals/panels | 🟢 Low | 🟢 Low |
| QW-09 | Add "copy coordinates" button on planet/galaxy pages | 🟢 Low | 🟢 Low |
| QW-10 | Add "time until full storage" indicator on resource displays | 🟡 Medium | 🟢 Low |

---

## 🎯 Feature Completeness Matrix

| System | Pages Built | Hook Exists | DB Table Exists | Edge Function | Real DB Wired | % Complete |
|--------|------------|-------------|-----------------|---------------|---------------|------------|
| Auth/Account | ✅ 7 | ✅ | ✅ | ✅ 4 | ✅ | 85% |
| Dashboard | ✅ 1 | ✅ | ✅ | ✅ | ⚠️ Partial | 70% |
| Buildings | ✅ 1 | ✅ | ✅ | ❌ | ⚠️ Partial | 35% |
| Colonies | ✅ 1 | ✅ | ✅ | ❌ | ❌ | 15% |
| Population | ✅ 1 | ✅ | ✅ | ❌ | ❌ | 10% |
| Fleet | ✅ 4 | ✅ 3 | ✅ | ⚠️ 1 | ⚠️ Partial | 40% |
| Shipyard/Production | ✅ 1 | ✅ 1 | ✅ | ❌ | ❌ | 10% |
| Combat | ✅ 4 | ✅ 3 | ✅ | ✅ 1 | ⚠️ Partial | 35% |
| Defense | ✅ 1 | ✅ | ✅ | ✅ 1 | ❌ | 15% |
| Research | ✅ 2 | ✅ 1 | ✅ | ❌ | ⚠️ Partial | 35% |
| Skills | ✅ 1 | ✅ 1 | ✅ | ❌ | ❌ | 10% |
| Crafting | ✅ 16 | ✅ 4 | ✅ | ❌ | ❌ | 20% |
| Galaxy/Universe | ✅ 16 | ✅ 4 | ✅ | ❌ | ❌ | 20% |
| Economy/Market | ✅ 6 | ✅ 6 | ✅ | ✅ 1 | ❌ | 25% |
| Alliance | ✅ 1 | ✅ 2 | ✅ | ❌ | ❌ | 20% |
| Diplomacy | ✅ 2 | ✅ 1 | ✅ | ❌ | ❌ | 15% |
| Social/Messages | ✅ 3 | ✅ 2 | ✅ | ❌ | ⚠️ Partial | 30% |
| Quests/Missions | ✅ 4 | ✅ 1 | ✅ | ❌ | ❌ | 15% |
| Events | ✅ 4 | ✅ 3 | ✅ | ❌ | ❌ | 15% |
| Bosses | ✅ 1 | ✅ 1 | ✅ | ❌ | ❌ | 10% |
| Achievements | ✅ 1 | ✅ 1 | ✅ | ❌ | ❌ | 10% |
| Season Pass | ✅ 1 | ✅ 1 | ✅ | ❌ | ❌ | 10% |
| Leaderboard | ✅ 2 | ✅ 1 | ✅ | ❌ | ⚠️ Partial | 30% |
| Officers | ✅ 1 | ❌ | ✅ | ❌ | ❌ | 10% |
| Store | ✅ 1 | ✅ 1 | ✅ | ❌ | ❌ | 10% |
| Admin | ✅ 4 | ✅ 1 | ✅ | ✅ 5 | ⚠️ Partial | 40% |
| Home/Landing | ✅ 1 | N/A | N/A | ❌ | ✅ | 90% |

---

## 🗓️ Recommended Sprint Order

### Sprint 1 (Week 1-2): Foundation
- DB-01 through DB-06: Seed all definition tables
- LOOP-01, LOOP-02: Fix resource tick + energy system
- RES-01: Wire building production to real DB reads
- FLT-01: Wire fleet creation to real DB
- RSH-01: Wire research queue
- CRF-01: Wire crafting queue

### Sprint 2 (Week 3-4): Economy & Combat
- MKT-01 through MKT-07: Full marketplace + trading
- CBT-01 through CBT-05: Combat resolution + defense
- STORE-01, STORE-02: Store + premium currency
- ALY-01 through ALY-04: Alliance system
- MSG-01 through MSG-03: Messaging + notifications

### Sprint 3 (Week 5-6): Gameplay Systems
- UNI-01 through UNI-05: Universe + galaxy
- EXP-01 through EXP-03: Exploration + missions
- WBS-01 through WBS-03: World bosses
- QST-01 through QST-03: Quests + bounties
- ACH-01 through ACH-03: Achievements
- PRG-01 through PRG-04: Progression system

### Sprint 4 (Week 7-8): Polish & Hardening
- All UI-* tasks: Mobile responsive, consistency, UX
- All PERF-* tasks: Performance optimization
- All SEC-* tasks: Security audit
- All QA-* tasks: Testing & balance
- All QW-* tasks: Quick wins

---

> **Total TODO Items:** 131 tasks across 12 phases  
> **Estimated to Beta 2.0:** 8 weeks (2 months) of focused development  
> **Critical Path:** DB seeding → Resource system → Combat system → Alliance → Polish