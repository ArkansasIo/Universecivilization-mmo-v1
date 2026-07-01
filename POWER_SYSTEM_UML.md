# 🛡️ Power Grid System — UML & Architecture

> Inspired by Arknights: Endfield's power grid mechanics.  
> 9 Reactor Types × 6 Sub-Classes = 54 unique reactor variants.

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          POWER GRID SYSTEM                                   │
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │   usePowerGrid  │    │  useGridOverload│    │usePowerConsumption│        │
│  │   (Grid Ops)    │    │  (Risk & Events)│    │  (Load & Demand) │         │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘         │
│           │                      │                      │                   │
│           └──────────────────────┼──────────────────────┘                   │
│                                  │                                          │
│  ┌───────────────────────────────┼───────────────────────────────────────┐ │
│  │                      Supabase Tables                                   │ │
│  │  ┌────────────────┐  ┌──────────────────┐  ┌────────────────────────┐ │ │
│  │  │planet_power    │  │power_reactors    │  │grid_overload_events    │ │ │
│  │  │_grids          │  │                  │  │                        │ │ │
│  │  │- grid_size_x/y │  │- definition_id   │  │- event_type            │ │ │
│  │  │- efficiency    │  │- reactor_level   │  │- severity              │ │ │
│  │  │- total_power   │  │- grid_position   │  │- meltdown_risk_pct      │ │ │
│  │  │- status        │  │- efficiency_pct  │  │- cascade_count         │ │ │
│  │  └────────────────┘  │- status          │  │- damage_dealt          │ │ │
│  │                      │- fuel_remaining  │  └────────────────────────┘ │ │
│  │                      └──────────────────┘                             │ │
│  │  ┌────────────────┐  ┌──────────────────────────────────────────────┐ │ │
│  │  │grid_connections│  │building_power_connections                     │ │ │
│  │  │- from_x/y      │  │- building_id, power_draw, priority           │ │ │
│  │  │- to_x/y        │  │- is_connected, connection_node_x/y           │ │ │
│  │  │- type          │  └──────────────────────────────────────────────┘ │ │
│  │  │- max_capacity  │                                                   │ │
│  │  │- power_flow    │  ┌──────────────────────────────────────────────┐ │ │
│  │  └────────────────┘  │reactor_definitions                            │ │ │
│  │                      │- 54 variants: 9 types × 6 sub-classes       │ │ │
│  │                      │- base_power_output, max_level, stability     │ │ │
│  │                      │- meltdown_risk_pct, special_effects          │ │ │
│  │                      └──────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Reactor Class Hierarchy

```
                         ┌──────────────────────────┐
                         │     REACTOR CLASSES       │
                         │          (9)              │
                         └──────────┬───────────────┘
                                    │
        ┌───────────┬───────────────┼───────────────┬───────────┬───────────┐
        │           │               │               │           │           │
   ┌────▼────┐ ┌────▼────┐ ┌───────▼──────┐ ┌──────▼────┐ ┌────▼────┐ ┌────▼────┐
   │ CIVILIAN│ │INDUSTRIAL│ │  MILITARY  │ │ RESEARCH │ │ EXOTIC │ │  ...    │
   │  🟢     │ │  🟠     │ │    🔴      │ │   🔵     │ │  🟣    │ │         │
   └────┬────┘ └────┬────┘ └──────┬──────┘ └──────┬────┘ └────┬────┘ └────┬────┘
        │           │              │               │          │          │
        ▼           ▼              ▼               ▼          ▼          ▼
 ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
 │  Fusion  │ │Geothermal│ │ Plasma   │ │  Zero-   │ │  Dark    │ │  Anti-   │
 │  Reactor │ │   Tap    │ │ Reactor  │ │  Point   │ │  Matter  │ │  Matter  │
 └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
 ┌──────────┐ ┌──────────┐ ┌─────────────────────────────────────────────────┐
 │  Solar   │ │  Bio-    │ │            EACH HAS 6 SUB-CLASSES:              │
 │Collector │ │ Reactor  │ │ Standard → Advanced → Elite → Master →          │
 └──────────┘ └──────────┘ │ Grandmaster → Mythic                            │
 ┌──────────┐               │ Multipliers: 1.0× → 1.4× → 2.0× → 3.0× →      │
 │Dimensional│              │              4.5× → 7.0×                       │
 │ Reactor  │               └─────────────────────────────────────────────────┘
 └──────────┘
```

### Class Color Mapping

| Class | Color | Role |
|-------|-------|------|
| Civilian | #34d399 Emerald | Colony power, housing, agriculture |
| Industrial | #f59e0b Amber | Factories, refineries, mass production |
| Military | #ef4444 Red | Shield generators, weapons platforms |
| Research | #60a5fa Blue | Laboratories, scanners, data centers |
| Exotic | #a78bfa Purple | Dimensional, dark matter, advanced |

### Sub-Class Multiplier Table

| Sub-Class | Multiplier | Rarity Color | Typical Grid Size |
|-----------|-----------|-------------|-------------------|
| Standard | 1.0× | #9ca3af Gray | 2×2 |
| Advanced | 1.4× | #22c55e Green | 2×2 |
| Elite | 2.0× | #3b82f6 Blue | 3×3 |
| Master | 3.0× | #a855f7 Purple | 3×3 |
| Grandmaster | 4.5× | #f59e0b Gold | 4×4 |
| Mythic | 7.0× | #ef4444 Red | 5×5 |

---

## 3. Connection Type Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CONNECTION TYPES                                      │
│                                                                             │
│  STANDARD ────────────────────────────────────────────────────────────────  │
│  │ Capacity: 1,000 MW   │ Efficiency: 95%   │ Cost: 100 credits │          │
│  │ Grid visual: thin gray line                                             │
│                                                                             │
│  HIGH VOLTAGE ────────────────────────────────────────────────────────────  │
│  │ Capacity: 5,000 MW   │ Efficiency: 92%   │ Cost: 500 credits │          │
│  │ Grid visual: thick yellow line                                          │
│                                                                             │
│  SUPERCONDUCTOR ──────────────────────────────────────────────────────────  │
│  │ Capacity: 20,000 MW  │ Efficiency: 98%   │ Cost: 2,000 credits │        │
│  │ Grid visual: bright cyan line, pulsing                                  │
│                                                                             │
│  QUANTUM RELAY ───────────────────────────────────────────────────────────  │
│  │ Capacity: 100,000 MW │ Efficiency: 99.5% │ Cost: 10,000 credits │       │
│  │ Grid visual: ethereal purple-white, quantum flicker effect              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Reactor State Machine

```
                         ┌─────────────────────────┐
                         │                         │
        ┌────────────────►        ONLINE           │
        │                │    (generating power)   │
        │                │                         │
        │                └───────────┬─────────────┘
        │                            │
        │              ┌─────────────┼─────────────┐
        │              │             │             │
        │              ▼             ▼             ▼
        │       ┌──────────┐  ┌──────────┐  ┌──────────────┐
        │       │OVERLOADED│  │ DAMAGED  │  │ MAINTENANCE  │
        │       │ (150%+)  │  │(cascade) │  │  (scheduled) │
        │       └────┬─────┘  └────┬─────┘  └──────┬───────┘
        │            │             │                │
        │            ▼             │                │
        │       ┌──────────┐      │                │
        │       │ MELTDOWN │◄─────┘                │
        │       │(destroyed)│                       │
        │       └──────────┘                       │
        │           │                              │
        │           │ (reactor destroyed,           │
        │           │  grid position becomes        │
        │           │  radioactive debris)          │
        │                                          │
        │       ┌──────────┐                       │
        │       │ OFFLINE  │◄──────────────────────┘
        │       │(manual/  │
        │       │ SCRAM)   │
        │       └────┬─────┘
        │            │
        └────────────┘
```

---

## 5. Grid Overload Event System

### Event Type Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      OVERLOAD EVENT TYPES                                   │
│                                                                             │
│  SEVERITY LEVELS:                                                           │
│  ┌──────────┬──────────┬──────────┬──────────┐                             │
│  │ WARNING  │ DANGER   │ CRITICAL │ MELTDOWN │                             │
│  │   🟡     │   🟠     │   🔴    │   ⚫     │                             │
│  │ risk<50% │ risk<75% │ risk<95% │ risk≥95% │                             │
│  └──────────┴──────────┴──────────┴──────────┘                             │
│                                                                             │
│  EVENT TYPES:                                                               │
│  ┌─────────────────────────┬──────────────────────────────────────────────┐ │
│  │ overload_warning        │ First threshold crossed (50-75% max risk)     │ │
│  │ overload_danger         │ Second threshold (75-95%)                    │ │
│  │ cascade_failure         │ Multiple reactors failing simultaneously     │ │
│  │ reactor_meltdown        │ Single reactor catastrophic failure (≥95%)    │ │
│  │ grid_collapse           │ Entire grid offline                          │ │
│  │ emergency_scram         │ Manual emergency shutdown                    │ │
│  │ safety_relief           │ Auto load-shed prevented cascade             │ │
│  │ stabilization           │ Grid restored to stable state                │ │
│  └─────────────────────────┴──────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Cascade Failure Sequence

```
REACTOR A                                REACTOR B (adjacent)
   │                                          │
   │ reaches 95% risk                         │
   │                                          │
   ▼                                          │
┌──────────────────┐                          │
│  MELTDOWN        │                          │
│  - output = 0    │                          │
│  - efficiency = 0│                          │
│  - grid position │                          │
│    contaminated  │                          │
└────────┬─────────┘                          │
         │                                    │
         │ sudden 100% power loss             │
         │ on adjacent connections            │
         ▼                                    │
┌──────────────────┐                          │
│  LOAD SPIKE      │─────────────────────────►│
│  Adjacent nodes  │    demand suddenly       │
│  absorb load     │    shifts to Reactor B   │
└────────┬─────────┘                          │
         │                                    ▼
         │                           ┌──────────────────┐
         │                           │  OVERLOAD        │
         │                           │  Reactor B now   │
         │                           │  at 130-200%     │
         │                           │  capacity        │
         │                           └────────┬─────────┘
         │                                    │
         │                           ┌────────▼─────────┐
         │                           │  CASCADE PROB    │
         │                           │  Check if B >60% │
         │                           │  risk → cascade  │
         │                           └────────┬─────────┘
         │                                    │
         └────────────────────────────────────┘
                 CASCADE CHAIN CONTINUES
                 until all high-risk reactors
                 are destroyed or SCRAM'd
```

---

## 6. Meltdown Risk Formula

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MELTDOWN RISK CALCULATION                              │
│                                                                             │
│  Per-Reactor Risk Formula:                                                  │
│                                                                             │
│  Risk = baseRisk × LoadRatio³ × (100 / (stability + 10))                   │
│                                                                             │
│  WHERE:                                                                     │
│    baseRisk     = reactor definition's meltdown_risk_pct (5% default)      │
│    LoadRatio    = totalDemand / totalSupply (capped at 2.0)                │
│    stability    = reactor definition's stability_rating (50 default)       │
│                                                                             │
│  EFFICIENCY PENALTY (if efficiency < 80%):                                  │
│    Risk ×= 1 + (80 - efficiency) / 40                                      │
│                                                                             │
│  EXAMPLE:                                                                   │
│    Fusion Reactor (Standard): baseRisk=5, stability=50, eff=95%            │
│    Grid load ratio: 1.2                                                     │
│    Risk = 5 × 1.2³ × (100 / 60) = 5 × 1.728 × 1.667 = 14.4%               │
│    Status: STABLE ✓                                                        │
│                                                                             │
│  EXAMPLE (DANGER):                                                          │
│    Plasma Reactor (Grandmaster): baseRisk=8, stability=35, eff=60%         │
│    Grid load ratio: 1.5                                                     │
│    Risk = 8 × 1.5³ × (100 / 45) × (1 + 20/40)                             │
│         = 8 × 3.375 × 2.222 × 1.5 = 90.0%                                  │
│    Status: CRITICAL ⚠                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Grid Risk Assessment Matrix

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           RISK MATRIX                                         │
│                                                                              │
│                  CASCADE PROBABILITY ──►                                     │
│   │              0-20%      20-40%       40-60%       60-80%      80-100%  │
│ ──┼──────────────────────────────────────────────────────────────────────── │
│   │                                                                          │
│ 0 │  🟢         🟢          🟡           🟠           🔴          🔴        │
│ 2 │  STABLE     STABLE      CAUTION      UNSTABLE     UNSTABLE    CRITICAL  │
│ 5 │                                                                          │
│ ──┼──────────────────────────────────────────────────────────────────────── │
│ 2 │  🟢         🟡          🟡           🟠           🔴          🔴        │
│ 5 │  STABLE     CAUTION     CAUTION      UNSTABLE     UNSTABLE    CRITICAL  │
│ 5 │                                                                          │
│ 0 │                                                                          │
│ ──┼──────────────────────────────────────────────────────────────────────── │
│ 5 │  🟡         🟡          🟠           🔴           🔴          ⚫        │
│ 0 │  CAUTION    CAUTION     UNSTABLE     CRITICAL     CRITICAL    MELTDOWN  │
│ 7 │                                                                          │
│ 5 │                                                                          │
│ ──┼──────────────────────────────────────────────────────────────────────── │
│ 7 │  🟡         🟠          🔴           🔴           ⚫          ⚫        │
│ 5 │  CAUTION    UNSTABLE    CRITICAL     CRITICAL     MELTDOWN    MELTDOWN  │
│ 9 │                                                                          │
│ 0 │                                                                          │
│ ──┼──────────────────────────────────────────────────────────────────────── │
│ 9 │  🟠         🔴          🔴           ⚫           ⚫          ⚫        │
│ 0 │  UNSTABLE   CRITICAL    CRITICAL     MELTDOWN     MELTDOWN    MELTDOWN  │
│ 1 │                                                                          │
│ 0 │                                                                          │
│ 0 │                                                                          │
│ ──┴────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  CASCADE_PROB = (reactors with risk > 60%) × 15                             │
│  MAX_RISK = highest individual reactor risk                                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Power Production Formula

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                       REACTOR OUTPUT CALCULATION                              │
│                                                                              │
│  Output = (basePower + powerPerLevel × (level - 1)) × subClassMultiplier    │
│           × (efficiency / 100)                                              │
│                                                                              │
│  EXAMPLE:                                                                    │
│    Dark Matter Reactor (Elite, Level 12, 85% efficiency)                    │
│    basePower = 500, powerPerLevel = 45, subClassMultiplier = 2.0            │
│    Output = (500 + 45 × 11) × 2.0 × 0.85                                   │
│           = (500 + 495) × 2.0 × 0.85                                        │
│           = 995 × 2.0 × 0.85                                                │
│           = 1,691 MW                                                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Building Power Connection — Priority System

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        LOAD SHED PRIORITY                                     │
│                                                                              │
│  When grid is overloaded, buildings are disconnected in this order:          │
│                                                                              │
│  ┌──────────┬──────────────────────────────────────────────────────────────┐ │
│  │ PRIORITY │ BUILDING TYPES                    │ KEPT ONLINE?             │ │
│  ├──────────┼──────────────────────────────────┼──────────────────────────┤ │
│  │ CRITICAL │ Shield Generator, Life Support,  │ ✅ Always (last resort)   │ │
│  │          │ Military HQ, Power Relay         │                          │ │
│  ├──────────┼──────────────────────────────────┼──────────────────────────┤ │
│  │ HIGH     │ Shipyard, Research Lab,          │ ✅ If supply > 70%        │ │
│  │          │ Defense Turrets, Hospital        │                          │ │
│  ├──────────┼──────────────────────────────────┼──────────────────────────┤ │
│  │ NORMAL   │ Factory, Mine, Refinery,         │ ✅ If supply > 90%        │ │
│  │          │ Trade Center, Barracks           │                          │ │
│  ├──────────┼──────────────────────────────────┼──────────────────────────┤ │
│  │ LOW      │ Storage, Housing, Park,          │ ❌ First to go            │ │
│  │          │ Cosmetic buildings               │                          │ │
│  ├──────────┼──────────────────────────────────┼──────────────────────────┤ │
│  │ OFFLINE  │ Manually disconnected,           │ ❌ Disconnected           │ │
│  │          │ damaged, or under construction   │                          │ │
│  └──────────┴──────────────────────────────────┴──────────────────────────┘ │
│                                                                              │
│  EMERGENCY STABILIZATION:                                                    │
│    Immediately sheds ALL "low" and "normal" priority loads.                  │
│    Keeps "critical" and "high" online to prevent total collapse.            │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Grid Topology — Visual Design

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                   10×10 GRID CELL EXAMPLE                                     │
│                                                                              │
│    0     1     2     3     4     5     6     7     8     9                 │
│   ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐                       │
│ 0 │    │    │ R1 │    │    │    │    │    │    │    │                       │
│   ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤                       │
│ 1 │    │ ═══╪════╪═══╗│    │    │ R2 │    │    │    │                       │
│   ├────┼────┼────┼────╫────┼────┼────┼────┼────┼────┤                       │
│ 2 │    │    │    │    ║    │ ═══╪════╪═══╗│    │    │                       │
│   ├────┼────┼────┼────╫────┼────┼────┼────╫────┼────┤                       │
│ 3 │ B1 │ B2 │    │    ║    │    │    │    ║    │    │                       │
│   ├────┼────┼────┼────╫────┼────┼────┼────╫────┼────┤                       │
│ 4 │    │    │ R3 │    ╚════╪════╪════╪════╝    │    │                       │
│   ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤                       │
│ 5 │    │    │    │    │    │    │    │    │    │    │                       │
│   └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘                       │
│                                                                              │
│  LEGEND:                                                                     │
│    R1, R2, R3  = Reactor nodes (power sources)                              │
│    B1, B2      = Building connections (power sinks)                          │
│    ═══, ║      = Grid connections (standard, high-voltage, superconductor)  │
│                                                                              │
│  TRANSMISSION LOSS:                                                          │
│    loss = distance × lossPerUnit × (2 - connectionEfficiency)               │
│    distance = √((x₂-x₁)² + (y₂-y₁)²)                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Hook Interaction Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     HOOK INTERACTION PATTERN                                  │
│                                                                              │
│                         ┌──────────────────┐                                 │
│                         │   GameLoop       │                                 │
│                         │   (1 Hz tick)    │                                 │
│                         └────────┬─────────┘                                 │
│                                  │                                           │
│                    ┌─────────────┼─────────────┐                             │
│                    │             │             │                             │
│                    ▼             ▼             ▼                             │
│           ┌────────────┐ ┌────────────┐ ┌──────────────┐                    │
│           │usePowerGrid│ │useGrid     │ │usePower      │                    │
│           │(grid ops,  │ │Overload    │ │Consumption   │                    │
│           │ reactors)  │ │(risk calc) │ │(demand)      │                    │
│           └──────┬─────┘ └──────┬─────┘ └──────┬───────┘                    │
│                  │              │               │                            │
│                  │    ┌─────────┼───────┐       │                            │
│                  ▼    ▼         ▼       ▼       ▼                            │
│           ┌─────────────────────────────────────────┐                        │
│           │           SUPABASE TABLES                │                        │
│           │  • planet_power_grids                   │                        │
│           │  • power_reactors                       │                        │
│           │  • reactor_definitions                  │                        │
│           │  • grid_connections                     │                        │
│           │  • building_power_connections            │                        │
│           │  • grid_overload_events                 │                        │
│           └─────────────────────────────────────────┘                        │
│                                                                              │
│  POLLING INTERVALS:                                                          │
│    usePowerGrid:    initial load, then manual refresh on actions             │
│    useGridOverload: 8 seconds (meltdown simulation + event generation)      │
│    usePowerConsumption: 5 seconds (demand snapshot + building sync)          │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Emergency Actions Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    EMERGENCY ACTION DECISION TREE                             │
│                                                                              │
│                          ┌──────────────┐                                    │
│                          │ GRID ALERT!  │                                    │
│                          │ status != OK │                                    │
│                          └──────┬───────┘                                    │
│                                 │                                            │
│                    ┌────────────┼────────────┐                                │
│                    ▼            ▼            ▼                                │
│              ┌──────────┐ ┌──────────┐ ┌──────────┐                          │
│              │ CAUTION  │ │ UNSTABLE │ │ CRITICAL │                          │
│              │ risk<50% │ │risk<75%  │ │risk<95%  │                          │
│              └────┬─────┘ └────┬─────┘ └────┬─────┘                          │
│                   │            │            │                                 │
│                   ▼            ▼            ▼                                 │
│            ┌──────────┐ ┌──────────┐ ┌──────────────┐                        │
│            │ Monitor  │ │ Shed LOW │ │ SCRAM worst  │                        │
│            │ Only     │ │ priority │ │ reactor      │                        │
│            │          │ │ loads    │ │ immediately  │                        │
│            └──────────┘ └────┬─────┘ └──────┬───────┘                        │
│                              │              │                                 │
│                              ▼              ▼                                 │
│                       ┌──────────┐   ┌──────────────┐                        │
│                       │ Stable?  │   │ Still         │                        │
│                       │ ✅ Done  │   │ critical?     │                        │
│                       └──────────┘   │ → STABILIZE  │                        │
│                                      │ (shed NORMAL)│                        │
│                                      └──────┬───────┘                        │
│                                             │                                 │
│                                        ┌────▼────┐                           │
│                                        │ MELTDOWN│                           │
│                                        │ risk≥95%│                           │
│                                        └────┬────┘                           │
│                                             │                                 │
│                                             ▼                                 │
│                                    ┌────────────────┐                        │
│                                    │ AUTO-MELTDOWN  │                        │
│                                    │ • reactor = 0  │                        │
│                                    │ • cascade check│                        │
│                                    │ • debris spawn │                        │
│                                    │ • rad zone     │                        │
│                                    └────────────────┘                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 13. Reactor Definitions Data Contract

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ReactorDefinition                                                          │
│  ┌───────────────────┬────────────┬──────────────────────────────────────┐  │
│  │ FIELD             │ TYPE       │ DESCRIPTION                          │  │
│  ├───────────────────┼────────────┼──────────────────────────────────────┤  │
│  │ id                │ number     │ Unique reactor definition ID         │  │
│  │ reactor_type      │ string     │ e.g. "Fusion Reactor"               │  │
│  │ reactor_name      │ string     │ e.g. "Helios Mk V Fusion Core"      │  │
│  │ reactor_class     │ enum       │ Civilian|Industrial|Military|...     │  │
│  │ sub_class         │ enum       │ Standard→Mythic (6 tiers)           │  │
│  │ tier              │ number     │ 1-9 unlock tier                      │  │
│  │ base_power_output │ number     │ MW at level 1                        │  │
│  │ power_per_level   │ number     │ MW gained per level                  │  │
│  │ max_level         │ number     │ Maximum upgrade level                │  │
│  │ grid_size         │ number     │ Cells occupied (2-5)                 │  │
│  │ transmission_range│ number     │ Max connection distance in cells     │  │
│  │ transmission_loss │ number     │ % loss per cell distance             │  │
│  │ build_cost_metal  │ number     │ Metal cost to build                  │  │
│  │ build_cost_crystal│ number     │ Crystal cost to build                │  │
│  │ build_cost_deut   │ number     │ Deuterium cost to build              │  │
│  │ build_time_sec    │ number     │ Build time in seconds                │  │
│  │ maintenance_energy│ number     │ Energy consumed just to stay online  │  │
│  │ stability_rating  │ number     │ 1-100 (higher = less meltdown risk)  │  │
│  │ meltdown_risk_pct │ number     │ Base meltdown risk % (1-10)          │  │
│  │ special_effects   │ string[]   │ e.g. ["adjacent_boost_5%"]          │  │
│  │ required_tech     │ string|null│ Tech prerequisite to build           │  │
│  │ description       │ string     │ In-game description                  │  │
│  │ lore              │ string     │ Flavor text                          │  │
│  └───────────────────┴────────────┴──────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 14. Connection Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CONNECTION LIFECYCLE                                    │
│                                                                              │
│  1. PLANNING                                                                │
│     └── User selects two grid cells (must have adjacent reactors/buildings)  │
│     └── Preview shows: cost, efficiency, max capacity                       │
│                                                                              │
│  2. CONSTRUCTION                                                             │
│     └── INSERT INTO grid_connections                                         │
│     └── status = 'building', timer = connection_type cost                    │
│                                                                              │
│  3. ACTIVE                                                                   │
│     └── status = 'active'                                                    │
│     └── Power flows between nodes                                           │
│     └── Transmission loss calculated per tick                               │
│                                                                              │
│  4. DEGRADATION (over time)                                                  │
│     └── efficiency_pct -= 0.01 per game hour (standard)                     │
│     └── High-voltage degrades faster (0.03/hr)                              │
│     └── Superconductor/Quantum Relay: stable (no degradation)                │
│                                                                              │
│  5. DESTRUCTION                                                              │
│     └── If node at either end is destroyed (meltdown)                       │
│     └── Connection auto-deleted                                              │
│     └── Adjacent connections experience power surge                          │
│                                                                              │
│  6. REMOVAL                                                                  │
│     └── DELETE FROM grid_connections                                         │
│     └── Brief power disruption to affected nodes                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 15. New Ideas & Suggested Improvements

### From the Repo's Design Philosophy

| # | Idea | Description | Effort |
|---|------|-------------|--------|
| 1 | **Grid Heat Map Overlay** | Show a color-gradient overlay on the grid map indicating power flow density — red for high load, green for well-supplied | Medium |
| 2 | **Reactor Synergy Bonuses** | Same-class adjacent reactors get +10% output each. Different-class adjacent reactors get -5% (interference). Creates placement strategy. | Low |
| 3 | **Power Storage (Batteries)** | Add battery/capacitor buildings that store excess power during surplus and release during deficit. Smooths demand spikes. | Medium |
| 4 | **Dynamic Fuel Consumption** | Reactors consume deuterium/crystals over time. Fusion uses deuterium, Solar needs no fuel, Dark Matter consumes dark matter. Adds resource management. | Medium |
| 5 | **Grid Log History** | Record every grid status change, overload event, and operator action. Searchable, filterable log for post-mortem analysis. | Low |
| 6 | **Power Export/Import** | Allow colonies to export surplus power to other planets at a transmission loss. Creates inter-planetary resource dynamics. | High |
| 7 | **Reactor Aging Curve** | Efficiency decreases slowly with age (hours online). Full maintenance restores to 95%, rebuild restores 100%. | Low |
| 8 | **Grid Tech Tree** | Research unlocks: longer transmission range, lower loss, higher capacity connections, auto-load-shed, remote SCRAM | Medium |
| 9 | **Power Router/Node** | Placeable "router" nodes that split/combine power flows, adding strategic depth to grid layout | Medium |
| 10 | **Seasonal Efficiency Modifiers** | During Emberfall season: geothermal +30%, solar -20%. During Frostveil: solar +20%, geothermal -15% | Low |

---

> **Document Version**: Alpha 1.5.0  
> **Last Updated**: 2026-06-26  
> **Related Tables**: planet_power_grids, power_reactors, reactor_definitions, grid_connections, building_power_connections, grid_overload_events