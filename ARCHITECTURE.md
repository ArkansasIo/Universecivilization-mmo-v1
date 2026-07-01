# 🏗️ Galactic Empire - System Architecture & UML

This document provides detailed UML diagrams and architectural documentation for the Galactic Empire game.

---

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    React Application                      │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │   Pages    │  │ Components │  │   Hooks    │         │  │
│  │  └────────────┘  └────────────┘  └────────────┘         │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │  Contexts  │  │   Router   │  │   Utils    │         │  │
│  │  └────────────┘  └────────────┘  └────────────┘         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │     Auth     │  │   Database   │  │   Storage    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Realtime    │  │ Edge Funcs   │  │     RLS      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Core Game Systems UML

### 1. Class Diagram - Core Entities

```
┌─────────────────────────────────────────────────────────────────┐
│                         CORE ENTITIES                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│      Empire          │
├──────────────────────┤
│ - id: string         │
│ - name: string       │
│ - userId: string     │
│ - resources: Object  │
│ - population: number │
│ - level: number      │
│ - experience: number │
├──────────────────────┤
│ + addResources()     │
│ + consumeResources() │
│ + levelUp()          │
└──────────────────────┘
         │
         │ owns
         ↓
┌──────────────────────┐
│       Fleet          │
├──────────────────────┤
│ - id: string         │
│ - name: string       │
│ - empireId: string   │
│ - ships: Ship[]      │
│ - position: Coords   │
│ - status: string     │
├──────────────────────┤
│ + addShip()          │
│ + removeShip()       │
│ + moveTo()           │
│ + attack()           │
└──────────────────────┘
         │
         │ contains
         ↓
┌──────────────────────┐
│        Ship          │
├──────────────────────┤
│ - id: string         │
│ - type: string       │
│ - level: number      │
│ - health: number     │
│ - attack: number     │
│ - defense: number    │
│ - speed: number      │
├──────────────────────┤
│ + upgrade()          │
│ + repair()           │
│ + takeDamage()       │
└──────────────────────┘

┌──────────────────────┐
│      Building        │
├──────────────────────┤
│ - id: string         │
│ - type: string       │
│ - level: number      │
│ - empireId: string   │
│ - production: Object │
│ - cost: Object       │
├──────────────────────┤
│ + upgrade()          │
│ + produce()          │
│ + demolish()         │
└──────────────────────┘

┌──────────────────────┐
│     Technology       │
├──────────────────────┤
│ - id: string         │
│ - name: string       │
│ - level: number      │
│ - requirements: []   │
│ - cost: Object       │
│ - researchTime: num  │
├──────────────────────┤
│ + research()         │
│ + unlock()           │
│ + getBonus()         │
└──────────────────────┘

┌──────────────────────┐
│      Alliance        │
├──────────────────────┤
│ - id: string         │
│ - name: string       │
│ - members: Empire[]  │
│ - level: number      │
│ - resources: Object  │
├──────────────────────┤
│ + addMember()        │
│ + removeMember()     │
│ + declareWar()       │
│ + shareResources()   │
└──────────────────────┘
```

---

### 2. Component Hierarchy Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      COMPONENT TREE                              │
└─────────────────────────────────────────────────────────────────┘

App
├── AuthContext.Provider
│   └── AdminAuthContext.Provider
│       ├── ErrorBoundary
│       │   ├── GameLoop
│       │   ├── NotificationCenter
│       │   └── BrowserRouter
│       │       └── Routes
│       │           ├── Public Routes
│       │           │   ├── HomePage
│       │           │   ├── LoginPage
│       │           │   └── RegisterPage
│       │           │
│       │           ├── Protected Routes (Auth Required)
│       │           │   ├── DashboardPage
│       │           │   │   ├── ResourceDisplay
│       │           │   │   ├── QuickActions
│       │           │   │   └── RecentActivity
│       │           │   │
│       │           │   ├── FleetPage
│       │           │   │   ├── FleetList
│       │           │   │   ├── FleetDetails
│       │           │   │   └── FleetActions
│       │           │   │
│       │           │   ├── ResearchPage
│       │           │   │   ├── TechTree
│       │           │   │   ├── ResearchQueue
│       │           │   │   └── TechDetails
│       │           │   │
│       │           │   ├── BuildingsPage
│       │           │   │   ├── BuildingGrid
│       │           │   │   ├── BuildingQueue
│       │           │   │   └── BuildingUpgrade
│       │           │   │
│       │           │   ├── GalaxyMapPage
│       │           │   │   ├── StarMap
│       │           │   │   ├── SystemDetails
│       │           │   │   └── FleetMovement
│       │           │   │
│       │           │   ├── AlliancePage
│       │           │   │   ├── AllianceInfo
│       │           │   │   ├── MemberList
│       │           │   │   └── AllianceChat
│       │           │   │
│       │           │   ├── MarketplacePage
│       │           │   │   ├── MarketListings
│       │           │   │   ├── TradeInterface
│       │           │   │   └── PriceChart
│       │           │   │
│       │           │   └── [50+ other pages...]
│       │           │
│       │           └── Admin Routes
│       │               ├── AdminLoginPage
│       │               ├── AdminRegisterPage
│       │               └── AdminDashboardPage
│       │                   ├── UserManagement
│       │                   ├── GameSettings
│       │                   └── Analytics
│       │
│       └── GameNavigation
│           ├── TopNav
│           ├── SideNav
│           └── QuickMenu
```

---

### 3. State Management Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT FLOW                         │
└─────────────────────────────────────────────────────────────────┘

User Action
    ↓
┌─────────────────┐
│   Component     │
│   (UI Layer)    │
└─────────────────┘
    ↓
┌─────────────────┐
│  Custom Hook    │
│ (Logic Layer)   │
│                 │
│ • useResources  │
│ • useFleet      │
│ • useResearch   │
└─────────────────┘
    ↓
┌─────────────────┐
│  Context/State  │
│ (State Layer)   │
│                 │
│ • AuthContext   │
│ • GameState     │
└─────────────────┘
    ↓
┌─────────────────┐
│   Supabase      │
│ (Data Layer)    │
│                 │
│ • Database      │
│ • Realtime      │
└─────────────────┘
    ↓
Update UI ← Realtime Subscription
```

---

### 4. Sequence Diagram - Fleet Combat

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLEET COMBAT SEQUENCE                         │
└─────────────────────────────────────────────────────────────────┘

Player          FleetPage       useFleetManager    useCombat      Supabase
  │                 │                  │               │              │
  │─Attack Enemy───→│                  │               │              │
  │                 │                  │               │              │
  │                 │─initiateCombat──→│               │              │
  │                 │                  │               │              │
  │                 │                  │─validateFleet→│              │
  │                 │                  │               │              │
  │                 │                  │               │─getFleetData→│
  │                 │                  │               │              │
  │                 │                  │               │←fleetData────│
  │                 │                  │               │              │
  │                 │                  │←fleetValid────│              │
  │                 │                  │               │              │
  │                 │                  │─startBattle──→│              │
  │                 │                  │               │              │
  │                 │                  │               │─calculateDmg→│
  │                 │                  │               │              │
  │                 │                  │               │─updateFleets→│
  │                 │                  │               │              │
  │                 │                  │               │←battleResult─│
  │                 │                  │               │              │
  │                 │                  │←battleReport──│              │
  │                 │                  │               │              │
  │                 │←showResults──────│               │              │
  │                 │                  │               │              │
  │←Display Report──│                  │               │              │
  │                 │                  │               │              │
```

---

### 5. Database Schema Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE SCHEMA                             │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    users     │         │   empires    │         │    fleets    │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │────────→│ user_id (FK) │────────→│ empire_id(FK)│
│ email        │         │ id (PK)      │         │ id (PK)      │
│ created_at   │         │ name         │         │ name         │
│ last_login   │         │ level        │         │ position     │
└──────────────┘         │ resources    │         │ status       │
                         │ population   │         └──────────────┘
                         └──────────────┘                │
                                │                        │
                                │                        ↓
                                │                 ┌──────────────┐
                                │                 │    ships     │
                                │                 ├──────────────┤
                                │                 │ fleet_id (FK)│
                                │                 │ id (PK)      │
                                │                 │ type         │
                                │                 │ level        │
                                │                 │ health       │
                                │                 └──────────────┘
                                │
                                ↓
                         ┌──────────────┐
                         │  buildings   │
                         ├──────────────┤
                         │ empire_id(FK)│
                         │ id (PK)      │
                         │ type         │
                         │ level        │
                         │ production   │
                         └──────────────┘
                                │
                                ↓
                         ┌──────────────┐
                         │  research    │
                         ├──────────────┤
                         │ empire_id(FK)│
                         │ id (PK)      │
                         │ tech_id      │
                         │ level        │
                         │ progress     │
                         └──────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  alliances   │         │   members    │         │   messages   │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │────────→│ alliance_id  │         │ sender_id    │
│ name         │         │ empire_id    │         │ receiver_id  │
│ level        │         │ role         │         │ content      │
│ resources    │         │ joined_at    │         │ created_at   │
└──────────────┘         └──────────────┘         └──────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    quests    │         │ achievements │         │  leaderboard │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │         │ id (PK)      │         │ empire_id    │
│ empire_id(FK)│         │ empire_id(FK)│         │ category     │
│ quest_id     │         │ achievement  │         │ score        │
│ progress     │         │ unlocked_at  │         │ rank         │
│ status       │         │ progress     │         │ updated_at   │
└──────────────┘         └──────────────┘         └──────────────┘
```

---

### 6. Hook Dependencies Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    CUSTOM HOOKS ARCHITECTURE                     │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │   useGameLoop    │
                    │  (Master Hook)   │
                    └──────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ↓                   ↓                   ↓
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ useResources │    │useFleetMgr   │    │useResearch   │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                   │
        │                   ↓                   │
        │           ┌──────────────┐            │
        │           │useCombatSim  │            │
        │           └──────────────┘            │
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                            ↓
                    ┌──────────────┐
                    │useNotify     │
                    └──────────────┘

Core Resource Hooks:
├── useResources          → Resource management
├── useEconomySystem      → Economy calculations
├── useRealTimeProduction → Production updates
└── useResourceTrading    → Trading system

Fleet & Combat Hooks:
├── useFleetManager       → Fleet operations
├── useAdvancedCombat     → Combat system
├── useCombatSimulator    → Battle simulation
├── useFleetFormations    → Formation tactics
└── useShipUpgrades       → Ship enhancement

Building & Construction:
├── useBuildingQueue      → Construction queue
├── useColonyManagement   → Colony operations
├── useMegastructureManager → Megastructures
└── useMothershipManager  → Mothership control

Research & Technology:
├── useResearchManager    → Research tree
├── useCrafting           → Item crafting
├── useMasterCrafting     → Advanced crafting
└── useEnhancedShips      → Ship variants

Social & Multiplayer:
├── useAllianceSystem     → Alliance management
├── useAllianceWar        → War coordination
├── useDiplomacy          → Diplomatic relations
├── useMessaging          → Player messaging
└── useGuildSystem        → Guild operations

Progression & Rewards:
├── usePlayerProgression  → Level system
├── useAchievementSystem  → Achievements
├── useQuestSystem        → Quest tracking
├── useSkillSystem        → Skill trees
└── useSeasonPass         → Season rewards

Economy & Trading:
├── useMarketplace        → Market operations
├── useResourceTrading    → Resource exchange
├── useTradeRoutes        → Trade automation
├── useBlackMarket        → Black market
└── useStore              → Premium store

Exploration & Travel:
├── useTravelSystem       → Travel mechanics
├── useStargateNetwork    → Stargate travel
├── useUniverseGenerator  → Universe creation
└── useInterstellarObjects → Space objects

Events & Activities:
├── usePlanetaryEvents    → Planet events
├── useSeasonalEvents     → Seasonal content
├── useWorldBosses        → Boss battles
└── usePirateSystem       → Pirate encounters

Intelligence & Warfare:
├── useEspionage          → Spy operations
├── useRaiding            → Raid mechanics
└── useUniverseReputation → Reputation system

System Hooks:
├── useAutoSave           → Auto-save system
├── useNotificationSystem → Notifications
├── useTutorialSystem     → Tutorial guide
├── useLeaderboard        → Rankings
└── useAdminPanel         → Admin tools
```

---

### 7. Game Loop Activity Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      GAME LOOP FLOW                              │
└─────────────────────────────────────────────────────────────────┘

        START
          │
          ↓
    ┌──────────┐
    │Initialize│
    │Game State│
    └──────────┘
          │
          ↓
    ┌──────────────────┐
    │  Every Second    │◄─────────┐
    │  (Game Tick)     │          │
    └──────────────────┘          │
          │                       │
          ↓                       │
    ┌──────────────────┐          │
    │Update Resources  │          │
    │  Production      │          │
    └──────────────────┘          │
          │                       │
          ↓                       │
    ┌──────────────────┐          │
    │Update Building   │          │
    │  Queue           │          │
    └──────────────────┘          │
          │                       │
          ↓                       │
    ┌──────────────────┐          │
    │Update Research   │          │
    │  Progress        │          │
    └──────────────────┘          │
          │                       │
          ↓                       │
    ┌──────────────────┐          │
    │Update Fleet      │          │
    │  Movements       │          │
    └──────────────────┘          │
          │                       │
          ↓                       │
    ┌──────────────────┐          │
    │Process Combat    │          │
    │  Battles         │          │
    └──────────────────┘          │
          │                       │
          ↓                       │
    ┌──────────────────┐          │
    │Check Events      │          │
    │  & Triggers      │          │
    └──────────────────┘          │
          │                       │
          ↓                       │
    ┌──────────────────┐          │
    │Update UI         │          │
    │  Notifications   │          │
    └──────────────────┘          │
          │                       │
          ↓                       │
    ┌──────────────────┐          │
    │  Auto Save       │          │
    │  (Every 30s)     │          │
    └──────────────────┘          │
          │                       │
          ↓                       │
    ┌──────────────────┐          │
    │  Wait 1 Second   │──────────┘
    └──────────────────┘
```

---

### 8. Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                           │
└─────────────────────────────────────────────────────────────────┘

User Registration:
─────────────────
User → Register Page → Enter Credentials → Supabase Auth
                                              │
                                              ↓
                                        Create User
                                              │
                                              ↓
                                        Create Empire
                                              │
                                              ↓
                                        Initialize Resources
                                              │
                                              ↓
                                        Return JWT Token
                                              │
                                              ↓
                                        Store in Context
                                              │
                                              ↓
                                        Redirect to Dashboard

User Login:
───────────
User → Login Page → Enter Credentials → Supabase Auth
                                           │
                                           ↓
                                      Validate User
                                           │
                                           ↓
                                      Return JWT Token
                                           │
                                           ↓
                                      Store in Context
                                           │
                                           ↓
                                      Load Empire Data
                                           │
                                           ↓
                                      Redirect to Dashboard

Protected Route:
────────────────
User → Access Page → Check Auth Context
                          │
                          ↓
                    Is Authenticated?
                     │           │
                   Yes          No
                     │           │
                     ↓           ↓
              Render Page   Redirect to Login
```

---

### 9. Resource Production System

```
┌─────────────────────────────────────────────────────────────────┐
│                  RESOURCE PRODUCTION SYSTEM                      │
└─────────────────────────────────────────────────────────────────┘

Building Production:
────────────────────

┌──────────────┐
│   Building   │
│   (Level N)  │
└──────────────┘
       │
       ↓
┌──────────────────────────────────┐
│  Base Production Rate            │
│  = baseRate × level              │
└──────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────┐
│  Technology Bonus                │
│  = production × (1 + techBonus)  │
└──────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────┐
│  Population Efficiency           │
│  = production × popEfficiency    │
└──────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────┐
│  Energy Requirement              │
│  = production × energyCost       │
└──────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────┐
│  Final Production                │
│  = Add to Resource Pool          │
└──────────────────────────────────┘

Resource Types:
───────────────
Metal      → Mining Facilities
Crystal    → Crystal Extractors
Deuterium  → Deuterium Synthesizers
Energy     → Power Plants
Credits    → Trade Centers
Dark Matter → Special Structures
```

---

### 10. Combat Calculation System

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMBAT CALCULATION                            │
└─────────────────────────────────────────────────────────────────┘

Attack Phase:
─────────────

Attacker Ship
     │
     ↓
┌─────────────────────────────────┐
│  Base Attack = ship.attack      │
└─────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────┐
│  Weapon Bonus                   │
│  = attack × weaponMultiplier    │
└─────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────┐
│  Technology Bonus               │
│  = attack × (1 + techBonus)     │
└─────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────┐
│  Officer Bonus                  │
│  = attack × (1 + officerBonus)  │
└─────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────┐
│  Formation Bonus                │
│  = attack × formationMultiplier │
└─────────────────────────────────┘
     │
     ↓
   Total Attack

Defense Phase:
──────────────

Defender Ship
     │
     ↓
┌─────────────────────────────────┐
│  Base Defense = ship.defense    │
└─────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────┐
│  Armor Bonus                    │
│  = defense × armorMultiplier    │
└─────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────┐
│  Shield Bonus                   │
│  = defense + shieldPoints       │
└─────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────┐
│  Technology Bonus               │
│  = defense × (1 + techBonus)    │
└─────────────────────────────────┘
     │
     ↓
   Total Defense

Damage Calculation:
───────────────────

Total Attack - Total Defense = Raw Damage
     │
     ↓
Raw Damage × Random(0.8, 1.2) = Final Damage
     │
     ↓
Apply to Ship Health
     │
     ↓
Health ≤ 0 ? Ship Destroyed : Ship Damaged
```

---

## 🔄 Data Flow Patterns

### Pattern 1: User Action → State Update
```
User Click → Component Handler → Hook Function → 
State Update → Supabase Sync → UI Re-render
```

### Pattern 2: Real-time Updates
```
Supabase Change → Realtime Subscription → 
Hook Listener → State Update → UI Re-render
```

### Pattern 3: Background Processing
```
Game Loop Timer → Process Updates → 
Calculate Changes → Update State → 
Sync to Supabase → Notify User
```

---

## 🎯 Key Design Principles

1. **Separation of Concerns**
   - UI components handle presentation
   - Hooks handle business logic
   - Contexts handle global state
   - Supabase handles persistence

2. **Single Responsibility**
   - Each hook manages one game system
   - Each component has one purpose
   - Each page represents one feature

3. **DRY (Don't Repeat Yourself)**
   - Reusable components
   - Shared utility functions
   - Common hooks for similar logic

4. **Performance Optimization**
   - Lazy loading for routes
   - Memoization for expensive calculations
   - Debouncing for frequent updates
   - Virtual scrolling for large lists

5. **Error Handling**
   - Error boundaries for component errors
   - Try-catch in async operations
   - User-friendly error messages
   - Logging for debugging

---

## 📊 Performance Considerations

### Optimization Strategies
- **Code Splitting** - Lazy load routes
- **Memoization** - Cache expensive calculations
- **Debouncing** - Limit API calls
- **Virtual Lists** - Render visible items only
- **Image Optimization** - Lazy load images
- **Bundle Size** - Tree shaking unused code

### Monitoring
- **Performance Metrics** - Track load times
- **Error Tracking** - Log errors
- **User Analytics** - Track user behavior
- **Database Queries** - Optimize slow queries

---

## 🔐 Security Architecture

### Authentication
- JWT tokens for session management
- Secure password hashing
- Email verification
- Password reset flow

### Authorization
- Row Level Security (RLS) in Supabase
- Role-based access control
- Protected routes
- Admin-only features

### Data Protection
- Input validation
- SQL injection prevention
- XSS protection
- CSRF tokens

---

## 🚀 Deployment Architecture

```
Developer → Git Push → GitHub
                         │
                         ↓
                    CI/CD Pipeline
                         │
                         ↓
                    Build & Test
                         │
                         ↓
                    Deploy to Vercel
                         │
                         ↓
                    Production Site
                         │
                         ↓
                    Supabase Backend
```

---

## 📈 Scalability Considerations

### Horizontal Scaling
- Stateless frontend (can run multiple instances)
- Supabase handles database scaling
- CDN for static assets

### Vertical Scaling
- Optimize database queries
- Add indexes for common queries
- Cache frequently accessed data

### Future Enhancements
- Redis for caching
- Message queue for background jobs
- Microservices for complex features
- Load balancer for high traffic

---

**This architecture supports a scalable, maintainable, and performant space strategy game! 🚀**
