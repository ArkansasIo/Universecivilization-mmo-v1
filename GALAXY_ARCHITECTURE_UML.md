# 🌌 Cosmic Architecture — Galaxy & Universe System UML

> Procedural universe generation with seeded RNG.  
> 9 Universes × 90 Galaxies each × up to 499 Sectors × up to 15 Planets per system.

---

## 1. Cosmic Hierarchy — Full Tree

```
                                ┌─────────────────────────┐
                                │    COSMIC HIERARCHY      │
                                │      (ROOT LEVEL)        │
                                └────────────┬────────────┘
                                             │
              ┌──────────────────────────────┼──────────────────────────────┐
              │                              │                              │
    ┌─────────▼─────────┐          ┌─────────▼─────────┐          ┌─────────▼─────────┐
    │   UNIVERSE 1      │          │   UNIVERSE 2      │   ...    │   UNIVERSE 9      │
    │  Prime Dominion   │          │   Void Reaches    │          │ Obsidian Depths   │
    │  Seed: 42069001   │          │   Seed: 13337002  │          │  Seed: 22222009   │
    │  Class: Standard  │          │   Class: Void     │          │ Class: Hardcore   │
    └─────────┬─────────┘          └─────────┬─────────┘          └─────────┬─────────┘
              │                              │                              │
    ┌─────────┴───────────────┐              │                              │
    │   90 GALAXIES           │              └── 90 Galaxies each ──────────┘
    │   (per universe)        │
    └─────────┬───────────────┘
              │
    ┌─────────▼────────────────────────────────────────────────────────────┐
    │  GALAXY (e.g. Galaxy 42: "Eternal Spire")                           │
    │  ├── class: Spiral (G), subClass: Grand Design                      │
    │  ├── type: Spiral, category: Giant Galaxy                           │
    │  ├── quadrant: Spiral Arm / Orion Spur                              │
    │  ├── 847,000 ly diameter, 3.2 billion stars                        │
    │  ├── dominantSpecies: Zorgath, controllingFaction: Void Covenant    │
    │  ├── specialFeatures: [Ancient Ruins, Dark Matter Concentration]    │
    │  └── sectors: up to 499                                            │
    └─────────┬───────────────────────────────────────────────────────────┘
              │
    ┌─────────▼────────────────────────────────────────────────────────────┐
    │  SECTOR (e.g. Sector 142)                                            │
    │  ├── type: Mid Sector, securityLevel: Medium                        │
    │  ├── dominantFaction: Galactic Federation                            │
    │  ├── starSystemCount: 84, discoveredSystems: 17                     │
    │  ├── resourceLevel: Rich, threatLevel: 4                            │
    │  └── maxStarSystems: 120                                            │
    └─────────┬───────────────────────────────────────────────────────────┘
              │
    ┌─────────▼────────────────────────────────────────────────────────────┐
    │  SOLAR SYSTEM (e.g. Alpha Sector142-06)                              │
    │  ├── systemType: Binary, starType: BlueGiant                        │
    │  ├── starColor: #4488FF, starTemperature: 12000K                    │
    │  ├── planetCount: 8, asteroidBelts: 2                              │
    │  ├── hasBlackHole: false, hasNebula: false                          │
    │  ├── habitabilityZonePlanets: 2                                     │
    │  ├── resourceOutput: {metal: 284000, crystal: 142000, deut: 48000} │
    │  └── isColonized: true, threatLevel: 3                             │
    └─────────┬───────────────────────────────────────────────────────────┘
              │
    ┌─────────▼────────────────────────────────────────────────────────────┐
    │  PLANET (e.g. Position 6 — Terran)                                   │
    │  ├── type: Terran, metalBonus: 1.0×, crystalBonus: 1.0×             │
    │  ├── deuteriumBonus: 1.0×, buildSlots: 163                         │
    │  ├── tempRange: [10°C, 45°C]                                        │
    │  ├── buildings: [Mine Lv.12, Crystal Lv.8, Deuterium Lv.5, ...]     │
    │  └── powerGrid: Planet Power Grid ID 8472                          │
    └──────────────────────────────────────────────────────────────────────┘
```

---

## 2. The 9 Universes — Complete Definitions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         THE NINE UNIVERSES                                    │
│                                                                              │
│  ┌────────┬─────────────────┬───────────┬──────────┬──────────┬──────────┐ │
│  │  ID    │ NAME            │ CLASS     │ PLAYERS  │ HOSTILITY│ RESOURCES│ │
│  ├────────┼─────────────────┼───────────┼──────────┼──────────┼──────────┤ │
│  │  u1    │ Prime Dominion  │ Standard  │ 48,291   │ Moderate │ Normal   │ │
│  │  u2    │ Void Reaches    │ Void      │ 12,847   │ Extreme  │ Scarce   │ │
│  │  u3    │ Genesis Fields  │ Peaceful  │ 67,432   │ Peaceful │ Abundant │ │
│  │  u4    │ Eternal Nexus   │ Mythic    │ 8,934    │ Extreme  │ Infinite │ │
│  │  u5    │ Quantum Sea     │ Quantum   │ 31,200   │ Moderate │ Normal   │ │
│  │  u6    │ Temporal Expanse│ Ancient   │ 19,800   │ Dangerous│ Normal   │ │
│  │  u7    │ Iron Crucible   │ Chaos     │ 24,600   │ Extreme  │ Normal   │ │
│  │  u8    │ Crystalline     │ Peaceful  │ 42,100   │ Peaceful │ Abundant │ │
│  │  u9    │ Obsidian Depths │ Hardcore  │ 5,600    │ Extreme  │ Scarce   │ │
│  └────────┴─────────────────┴───────────┴──────────┴──────────┴──────────┘ │
│                                                                              │
│  UNIVERSE CLASSES:                                                           │
│  🟡 Standard — Balanced gameplay, all features enabled                       │
│  🟣 Void     — Dark matter abundance, void entities, sparse galaxies         │
│  🟢 Peaceful — Resource abundance, safe zones, new player friendly           │
│  🟠 Mythic   — Endgame content, transcendent tech, cosmic entities           │
│  🔵 Quantum  — Probability mechanics, superposition resources                │
│  🟣 Ancient  — Time dilation, ancient tech, temporal rifts                   │
│  🔴 Chaos    — Permanent war zones, combat bonuses, war spoils               │
│  🔮 Crystalline — Research/crafting bonuses, peaceful coexistence             │
│  ⚫ Hardcore — Permadeath zones, extreme difficulty, legendary worlds         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Galaxy Class System

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    GALAXY CLASSIFICATION (A-Z Letters)                         │
│                                                                              │
│  CLASS LETTER → GALAXY TYPE MAPPING:                                         │
│                                                                              │
│  A, G, H, N, S, T, W → SPIRAL        (30% rarity)                          │
│  B, E, J, O, R       → ELLIPTICAL    (18% rarity)                          │
│  D, M, Q             → IRREGULAR     (12% rarity)                          │
│  C, P                → LENTICULAR    (8% rarity)                           │
│  F, K, V             → DWARF         (12% rarity)                          │
│  I                   → RING          (5% rarity)                           │
│  L, U                → STARBURST     (6% rarity)                           │
│  X, Y                → ACTIVE        (5% rarity)                           │
│  Z                   → ULTRA-DIFFUSE (4% rarity)                           │
│                                                                              │
│  EACH CLASS HAS SUB-CLASSES:                                                 │
│  ┌──────────┬─────────────────────────────────────────────────────────────┐ │
│  │ CLASS    │ SUB-CLASSES                                                  │ │
│  ├──────────┼─────────────────────────────────────────────────────────────┤ │
│  │ A-Spiral │ Grand Design, Barred, Flocculent, Multi-Arm, Anemic, ...    │ │
│  │ B-Ellip  │ Giant, Dwarf, cD, Box, Disky, Blue Compact                  │ │
│  │ D-Irreg  │ Magellanic, Amorphous, Dwarf Irregular, Tidal               │ │
│  │ I-Ring   │ Collisional, Polar, Resonance, Nuclear                      │ │
│  │ Z-UltraD │ Ghost, Dark, Ultra-Faint, Failed                            │ │
│  └──────────┴─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Quadrant System — Galaxy Internal Zones

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    GALAXY QUADRANT TYPES                                       │
│                                                                              │
│  ┌─────────────────┬──────────────────────────────────────────────────────┐ │
│  │ QUADRANT        │ DESCRIPTION                  │ STAR DENSITY          │ │
│  ├─────────────────┼──────────────────────────────┼───────────────────────┤ │
│  │ Inner Core      │ Supermassive black hole zone │ Very High (danger)    │ │
│  │ Outer Core      │ Dense old star population    │ High                  │ │
│  │ Galactic Bulge  │ Central stellar bulge        │ Very High             │ │
│  │ Spiral Arm      │ Spiral density wave region   │ Medium-High           │ │
│  │ Galactic Bar    │ Central bar structure        │ Medium                │ │
│  │ Halo            │ Outer sparse star region     │ Low                   │ │
│  │ Dark Matter Halo│ Invisible mass region        │ Very Low (anomalous)  │ │
│  │ Satellite Region│ Orbiting dwarf companions    │ Low                   │ │
│  │ Intergalactic   │ Void between galaxies        │ Near Zero             │ │
│  └─────────────────┴──────────────────────────────┴───────────────────────┘ │
│                                                                              │
│  QUADRANT DETERMINES SECTOR TYPES:                                           │
│  Inner Core  → Core Sector, Inner Sector, Anomalous Sector                  │
│  Spiral Arm  → Mid, Outer, Frontier, Nebula Sectors                         │
│  Halo        → Outer, Frontier, Void Sectors                                │
│  Void        → Void, Wild Space, Anomalous Sectors (rare discoveries!)     │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Sector System Types

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                       SECTOR TYPE DEFINITIONS                                  │
│                                                                              │
│  ┌──────────────────┬───────┬─────────────┬────────────────────────────────┐ │
│  │ TYPE             │ COLOR │ SECURITY    │ DESCRIPTION                    │ │
│  ├──────────────────┼───────┼─────────────┼────────────────────────────────┤ │
│  │ Core Sector      │ #FFD700│Maximum/High│ Galactic center systems.       │ │
│  │                  │       │             │ Highest star density, most     │ │
│  │                  │       │             │ dangerous radiation zones.     │ │
│  ├──────────────────┼───────┼─────────────┼────────────────────────────────┤ │
│  │ Inner Sector     │ #FFA500│High/Medium │ Developed core-adjacent space. │ │
│  │                  │       │             │ Established trade routes,      │ │
│  │                  │       │             │ heavy alliance presence.       │ │
│  ├──────────────────┼───────┼─────────────┼────────────────────────────────┤ │
│  │ Mid Sector       │ #87CEEB│Medium      │ Colonized middle ring.         │ │
│  │                  │       │             │ Balanced resources and         │ │
│  │                  │       │             │ moderate threat. Most players. │ │
│  ├──────────────────┼───────┼─────────────┼────────────────────────────────┤ │
│  │ Outer Sector     │ #90EE90│Low/Medium  │ Outer colonies. Less           │ │
│  │                  │       │             │ populated, more pirate raids.  │ │
│  ├──────────────────┼───────┼─────────────┼────────────────────────────────┤ │
│  │ Frontier Sector  │ #DDA0DD│Low/Minimal │ Expansion frontier.            │ │
│  │                  │       │             │ Unexplored systems, high       │ │
│  │                  │       │             │ discovery potential.           │ │
│  ├──────────────────┼───────┼─────────────┼────────────────────────────────┤ │
│  │ Anomalous Sector │ #FF69B4│Anomalous   │ Space-time distortions.        │ │
│  │                  │       │             │ Random events, rare resources, │ │
│  │                  │       │             │ quantum phenomena.             │ │
│  ├──────────────────┼───────┼─────────────┼────────────────────────────────┤ │
│  │ Nebula Sector    │ #00CED1│None/Low    │ Dense nebula clouds.           │ │
│  │                  │       │             │ Scanners reduced 80%, stealth  │ │
│  │                  │       │             │ effective, gas harvesting.     │ │
│  ├──────────────────┼───────┼─────────────┼────────────────────────────────┤ │
│  │ Void Sector      │ #2F4F4F│None        │ Deep space between stars.      │ │
│  │                  │       │             │ Almost no resources, but       │ │
│  │                  │       │             │ hidden artifacts possible.     │ │
│  ├──────────────────┼───────┼─────────────┼────────────────────────────────┤ │
│  │ Wild Space       │ #8B0000│None        │ Completely uncontrolled.       │ │
│  │                  │       │             │ No laws, no alliances,         │ │
│  │                  │       │             │ pure anarchy. High risk/      │ │
│  │                  │       │             │ reward potential.              │ │
│  └──────────────────┴───────┴─────────────┴────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Solar System & Star Types

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                      SOLAR SYSTEM TYPES                                        │
│                                                                              │
│  ┌────────────────┬──────────────┬────────────────────────────────────────┐ │
│  │ SYSTEM TYPE    │ PLANET RANGE │ DESCRIPTION                            │ │
│  ├────────────────┼──────────────┼────────────────────────────────────────┤ │
│  │ Single Star    │ 3-9          │ Most common — one star, standard       │ │
│  │                │              │ planetary system.                      │ │
│  │ Binary         │ 4-12         │ Two stars orbiting each other. More    │ │
│  │                │              │ planets possible, wider habitable zone. │ │
│  │ Trinary        │ 6-15         │ Three stars — rare, complex orbits.    │ │
│  │                │              │ Maximum planets potential.             │ │
│  │ Neutron Star   │ 1-3          │ Collapsed star. No habitable planets,  │ │
│  │                │              │ but exotic materials abundant.         │ │
│  │ Black Hole     │ 0-2          │ Singularity. No planets, but extreme   │ │
│  │                │              │ research bonuses from observation.     │ │
│  │ Nebula         │ 2-6          │ Star-forming region. Gas giants and    │ │
│  │                │              │ deuterium-rich worlds.                 │ │
│  │ White Dwarf    │ 1-4          │ Dead star remnant. Crystal and metal   │ │
│  │                │              │ deposits from supernova remnants.      │ │
│  │ Pulsar         │ 1-2          │ Rotating neutron star. Constant energy │ │
│  │                │              │ pulse — great for power generation.    │ │
│  │ Rogue Planet   │ 0-1          │ Planet(s) without a star. Dark, cold,  │ │
│  │ Cluster        │              │ but perfect for hidden bases.          │ │
│  └────────────────┴──────────────┴────────────────────────────────────────┘ │
│                                                                              │
│  STAR CLASS TYPES (Spectral Classification):                                 │
│                                                                              │
│  ┌──────┬──────────┬──────────────┬──────────┬─────────┬──────────────────┐ │
│  │CLASS │ NAME     │ TEMP (K)     │ COLOR    │ RARITY  │ HABITABLE ZONE   │ │
│  ├──────┼──────────┼──────────────┼──────────┼─────────┼──────────────────┤ │
│  │  O   │ Blue     │ 30000-50000  │ #9bb0ff  │ 0.5%    │ Very Far (deadly)│ │
│  │  B   │ Blue-Wh  │ 10000-30000  │ #aabfff  │ 2%      │ Far              │ │
│  │  A   │ White    │ 7500-10000   │ #cad8ff  │ 5%      │ Mid-Far          │ │
│  │  F   │ Yellow-W │ 6000-7500    │ #f8f7ff  │ 8%      │ Mid              │ │
│  │  G   │ Yellow   │ 5200-6000    │ #fff4ea  │ 12%     │ Mid-Close ✓      │ │
│  │  K   │ Orange   │ 3700-5200    │ #ffd2a1  │ 15%     │ Close ✓          │ │
│  │  M   │ Red      │ 2400-3700    │ #ffb56b  │ 30%     │ Very Close       │ │
│  │  L   │ Brown    │ 1300-2400    │ #c44b00  │ 17%     │ None             │ │
│  │  T   │ Methane  │ 700-1300     │ #4a2800  │ 9%      │ None             │ │
│  │  Y   │ UltraCold│ <700         │ #1a0a00  │ 1.5%    │ None             │ │
│  └──────┴──────────┴──────────────┴──────────┴─────────┴──────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Seeded RNG — Deterministic Generation

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     COSMIC RNG (Seeded Random)                                 │
│                                                                              │
│  WHY SEEDED?                                                                 │
│  ────────────                                                                │
│  Every universe/galaxy/sector/system is procedurally generated from a        │
│  seed. The same seed ALWAYS produces the same universe. This means:          │
│  • No need to store all 90 galaxies × 499 sectors × 15 planets in DB        │
│  • Only store what players have modified/discovered                          │
│  • Deterministic — all players see the same universe from the same seed     │
│                                                                              │
│  SEED SOURCE:                                                                │
│  ┌─────────────┐                                                             │
│  │Universe Seed│──► generates 90 galaxy seeds ──► generates sector seeds    │
│  │ e.g. 42069001│    from universe seed +     │    from galaxy seed +        │
│  └─────────────┘    galaxy index              │    sector number              │
│                                                │                              │
│                                   ┌────────────▼──────────────┐              │
│                                   │generates system seeds    │              │
│                                   │from sector seed +         │              │
│                                   │system number             │              │
│                                   └────────────┬──────────────┘              │
│                                                │                              │
│                                   ┌────────────▼──────────────┐              │
│                                   │generates planet positions │              │
│                                   │from system seed +         │              │
│                                   │position (1-15)           │              │
│                                   └───────────────────────────┘              │
│                                                                              │
│  RNG ALGORITHM:                                                              │
│    seed = (seed * 9301 + 49297) % 233280                                    │
│    return seed / 233280  // 0 to 1                                           │
│                                                                              │
│  METHODS:                                                                    │
│    next()        → 0-1 float                                                 │
│    nextInt(a,b)  → integer between a-b                                      │
│    nextFloat(a,b)→ float between a-b                                        │
│    choice(arr)   → random element from array                                │
│    weightedChoice(items) → weighted by rarity property                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Galaxy Name Generation

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     GALAXY NAME GENERATOR                                      │
│                                                                              │
│  PREFIX POOL:                                                                │
│  ['Nebula', 'Star', 'Crystal', 'Void', 'Shadow', 'Eternal', 'Celestial',    │
│   'Astral', 'Cosmic', 'Solar', 'Lunar', 'Stellar', 'Nova', 'Quantum',       │
│   'Phoenix', 'Dragon', 'Titan', 'Oracle', 'Obsidian', 'Emerald',            │
│   'Crimson', 'Azure', 'Spectral', 'Phantom', 'Radiant', 'Abyssal',          │
│   'Zenith', 'Apex', 'Primal', 'Infinite']                                   │
│                                                                              │
│  SUFFIX POOL:                                                                │
│  ['Reach', 'Expanse', 'Drift', 'Void', 'Abyss', 'Gulf', 'Sea', 'Rift',     │
│   'Spire', 'Cradle', 'Forge', 'Haven', 'Gate', 'Wall', 'Bridge', 'Maw',    │
│   'Throne', 'Tomb', 'Sanctum', 'Frontier', 'Verge', 'Crucible',            │
│   'Nexus', 'Aegis', 'Citadel', 'Bastion', 'Pinnacle']                       │
│                                                                              │
│  DESCRIPTOR POOL:                                                            │
│  ['Great', 'Dark', 'Shining', 'Ancient', 'Lost', 'Hidden', 'Burning',       │
│   'Frozen', 'Silent', 'Shattered', 'Golden', 'Iron', 'Crystal',             │
│   'Eternal', 'Fallen', 'Rising', 'Wandering', 'Distant', 'Forbidden']       │
│                                                                              │
│  NAME PATTERNS:                                                              │
│  Pattern 1: "{Descriptor} {Prefix} {Suffix}" → "Lost Shadow Throne"         │
│  Pattern 2: "{Prefix} {Suffix} {Number}"     → "Crystal Abyss 42"           │
│  Pattern 3: "{Descriptor} {Prefix}"           → "Ancient Void"               │
│  Pattern 4: "{Prefix}-{Number}"               → "Nova-8472"                  │
│                                                                              │
│  EXAMPLES GENERATED:                                                         │
│  • The Wandering Nebula Throne                                               │
│  • Dragon Gate 117                                                           │
│  • Silent Abyss                                                              │
│  • Stellar-42069                                                             │
│  • Eternal Void Spire                                                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Planet Position System

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    PLANET POSITIONS (1-15 PER SYSTEM)                          │
│                                                                              │
│   POSITION    PLANET TYPE     TEMP RANGE (°C)       BONUSES                  │
│   ────────    ───────────     ───────────────       ───────                  │
│     1         Volcanic        220 to 260            Metal ×1.5, Deut ×0.5   │
│     2         Volcanic        170 to 220            Metal ×1.3               │
│     3         Desert          120 to 170            Metal ×1.2               │
│     4         Desert          70 to 120             Metal ×1.1               │
│     5         Rocky           40 to 75              Balanced                 │
│     6  ★      TERRAN          10 to 45              BALANCED (HOMEWORLD)     │
│     7         Terran          -18 to 18             Balanced                 │
│     8         Ocean           -50 to -10            Deuterium ×1.5           │
│     9         Jungle          -65 to -25            Crystal ×1.2             │
│    10         Ice             -80 to -40            Crystal ×1.3             │
│    11         Ice             -110 to -65           Deuterium ×1.3           │
│    12         Gas Giant       -130 to -90           Deuterium ×2.0           │
│    13         Gas Giant       -150 to -110          Deuterium ×1.8           │
│    14         Barren          -170 to -130          Low yield                │
│    15         Barren          -200 to -160          Low yield                │
│                                                                              │
│  ★ Position 6 is the default homeworld position for new empires.            │
│    It always yields a Terran planet with balanced bonuses.                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Galaxy Generation Data Contracts

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  GalaxyData                                                                  │
│  ┌─────────────────┬──────────────────┬──────────────────────────────────┐  │
│  │ FIELD           │ TYPE             │ DESCRIPTION                      │  │
│  ├─────────────────┼──────────────────┼──────────────────────────────────┤  │
│  │ id              │ string           │ "u1-g042" (universe + galaxy)    │  │
│  │ universeId      │ string           │ Parent universe ID               │  │
│  │ name            │ string           │ Generated name                   │  │
│  │ galaxyClass     │ A-Z              │ Spectral class letter            │  │
│  │ subClass        │ string           │ e.g. "Grand Design"              │  │
│  │ galaxyType      │ enum             │ Spiral|Elliptical|...            │  │
│  │ category        │ enum             │ Giant|Intermediate|Dwarf|...     │  │
│  │ quadrantType    │ enum             │ Inner Core|Spiral Arm|...        │  │
│  │ coordinates     │ {x,y,z}          │ 3D position in universe          │  │
│  │ starCount       │ number           │ Total stars (millions+)          │  │
│  │ diameterLy      │ number           │ Diameter in light years          │  │
│  │ ageBillionYears │ number           │ Age in billions of years         │  │
│  │ dominantSpecies │ string           │ Dominant NPC species             │  │
│  │ controllingFact │ string           │ Controlling NPC faction         │  │
│  │ sectorCount     │ number           │ Generated sectors (capped)       │  │
│  │ discoveredPct   │ number           │ % of sectors discovered          │  │
│  │ habitableRatio  │ number           │ 0.05-0.35 % habitable planets    │  │
│  │ resourceRichness│ enum             │ Scarce|Low|Normal|Rich|Abundant  │  │
│  │ threatLevel     │ 1-10             │ Overall danger rating            │  │
│  │ specialFeatures │ string[]         │ Unique galaxy properties         │  │
│  │ color           │ string           │ UI display color                 │  │
│  └─────────────────┴──────────────────┴──────────────────────────────────┘  │
│                                                                              │
│  SectorData                                                                  │
│  ┌─────────────────┬──────────────────┬──────────────────────────────────┐  │
│  │ id              │ string           │ "u1-g042-s137"                   │  │
│  │ galaxyId        │ string           │ Parent galaxy                    │  │
│  │ sectorNumber    │ 1-499            │ Sector position in galaxy        │  │
│  │ sectorType      │ enum             │ Core|Inner|Mid|Outer|...         │  │
│  │ securityLevel   │ enum             │ Maximum→Anomalous               │  │
│  │ starSystemCount │ number           │ Actual system count              │  │
│  │ discoveredSystems│ number          │ Discovered by players             │  │
│  │ colonizedSystems│ number           │ With player colonies             │  │
│  │ dominantFaction │ string           │ Controlling faction              │  │
│  │ resourceLevel   │ enum             │ Scarce→Abundant                  │  │
│  └─────────────────┴──────────────────┴──────────────────────────────────┘  │
│                                                                              │
│  SolarSystemData                                                             │
│  ┌─────────────────┬──────────────────┬──────────────────────────────────┐  │
│  │ id              │ string           │ "u1-g042-s137-sys06"             │  │
│  │ systemType      │ enum             │ Single|Binary|Trinary|...        │  │
│  │ starType        │ O-Y              │ Star spectral class              │  │
│  │ starTemperature │ number           │ Kelvin                           │  │
│  │ planetCount     │ 0-15             │ Number of planets                │  │
│  │ asteroidBelts   │ 0-5              │ Asteroid belts                   │  │
│  │ hasBlackHole    │ boolean           │ BH present                       │  │
│  │ habitabilityPlanets│ number        │ Count in habitable zone          │  │
│  │ isColonized     │ boolean           │ Any player colony                │  │
│  │ resourceOutput  │ {metal,crystal,  │ Base resource estimates          │  │
│  │                 │  deuterium,dm}   │                                   │  │
│  └─────────────────┴──────────────────┴──────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Galaxy Color Mapping (UI)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    GALAXY CLASS → UI COLORS                                    │
│                                                                              │
│  CLASS A (Spiral)     → #4FC3F7  Cyan Blue                                 │
│  CLASS B (Elliptical) → #FF8A65  Warm Coral                                 │
│  CLASS C (Lenticular) → #81C784  Soft Green                                 │
│  CLASS D (Irregular)  → #FFB74D  Amber                                      │
│  CLASS E (Elliptical) → #E57373  Salmon                                     │
│  CLASS F (Dwarf)      → #90A4AE  Slate Gray                                 │
│  CLASS G (Spiral)     → #64B5F6  Sky Blue                                   │
│  CLASS H (Spiral)     → #4DD0E1  Cyan                                       │
│  CLASS I (Ring)       → #BA68C8  Lavender                                   │
│  CLASS J (Elliptical) → #A1887F  Warm Brown                                 │
│  CLASS K (Dwarf)      → #78909C  Blue Gray                                  │
│  CLASS L (Starburst)  → #FFD54F  Golden Yellow                              │
│  CLASS M (Irregular)  → #F06292  Pink                                       │
│  CLASS N (Spiral)     → #7986CB  Indigo                                     │
│  CLASS O (Elliptical) → #FF7043  Deep Orange                                │
│  CLASS P (Lenticular) → #4DB6AC  Teal                                       │
│  CLASS Q (Irregular)  → #FF8A80  Light Coral                                │
│  CLASS R (Elliptical) → #CE93D8  Light Purple                               │
│  CLASS S (Spiral)     → #AED581  Light Green                                │
│  CLASS T (Spiral)     → #90CAF9  Light Blue                                 │
│  CLASS U (Starburst)  → #FFCA28  Bright Amber                               │
│  CLASS V (Dwarf)      → #CFD8DC  Light Gray                                 │
│  CLASS W (Spiral)     → #80DEEA  Pale Cyan                                  │
│  CLASS X (Active)     → #FF5252  Bright Red                                 │
│  CLASS Y (Active)     → #FF1744  Crimson                                    │
│  CLASS Z (Ultra-Dif.) → #B0BEC5  Silver Gray                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Cosmos Summary — Scale Snapshots

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     COSMIC SCALE (via getCosmicSummary)                        │
│                                                                              │
│  TOTAL UNIVERSES:  9                                                         │
│  TOTAL GALAXIES:   810 (9 × 90)                                             │
│  TOTAL PLAYERS:    260,804 (across all universes)                           │
│  MAX PLAYERS:      720,000                                                  │
│                                                                              │
│  GALAXY CLASSES:   26 (A-Z)                                                 │
│  GALAXY TYPES:     9 (Spiral, Elliptical, Irregular, etc.)                  │
│  SECTOR TYPES:     9 (Core, Inner, Mid, Outer, etc.)                        │
│  SYSTEM TYPES:     9 (Single, Binary, Trinary, etc.)                        │
│  STAR TYPES:       11 (O, B, A, F, G, K, M, L, T, Y, BlackHole)           │
│  PLANET TYPES:     10 (Terran, Desert, Ocean, Ice, etc.)                    │
│  PLANET POSITIONS: 15 (per system)                                          │
│  QUADRANT TYPES:   9 (Inner Core through Intergalactic Void)                │
│                                                                              │
│  THEORETICAL MAX PLANETS PER UNIVERSE:                                       │
│  90 galaxies × 499 sectors × 499 systems × 15 positions =                    │
│  336,282,750 potential planets                                               │
│                                                                              │
│  PER UNIVERSE (90 galaxies):                                                 │
│  ~37.3 million potential planets                                             │
│                                                                              │
│  TOTAL (all 9 universes):                                                    │
│  ~3.03 BILLION potential planets                                             │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 13. Galaxy Generation Sequence

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                 GALAXY GENERATION PIPELINE                                     │
│                                                                              │
│  INPUT: Universe seed + galaxy index (0-89)                                  │
│                                                                              │
│  1. INITIALIZE RNG                                                            │
│     └── CosmicRNG(universe.seed + galaxyIndex * 31)                          │
│                                                                              │
│  2. ROLL GALAXY CLASS                                                         │
│     └── weightedChoice(GALAXY_CLASS_RARITIES)                               │
│     └── Determines: type, subClass, quadrant, color                         │
│                                                                              │
│  3. ROLL QUADRANT TYPE                                                        │
│     └── choice(GALAXY_TYPE_TO_QUADRANTS[galaxyType])                        │
│     └── Determines: available sector types                                  │
│                                                                              │
│  4. ROLL CATEGORY                                                             │
│     └── Based on galaxy type: Giant/Dwarf/Satellite/etc.                    │
│     └── Determines: star range, sector range                                │
│                                                                              │
│  5. GENERATE NAME                                                             │
│     └── 4 possible name patterns                                            │
│     └── Combines: prefixes, suffixes, descriptors, numbers                  │
│                                                                              │
│  6. ROLL STATISTICS                                                           │
│     └── diameterLy: 15,000 - 450,000                                        │
│     └── starCount: diameterLY × random(500, 5000)                           │
│     └── ageBillionYears: 0.5 - 13.8                                         │
│     └── sectorCount: random(10, maxSectors)                                  │
│     └── habitableZoneRatio: 0.05 - 0.35                                     │
│     └── resourceRichness: weighted roll                                     │
│     └── threatLevel: 1-10                                                    │
│                                                                              │
│  7. ROLL SPECIAL FEATURES                                                     │
│     └── 1-5 unique features from 20-option pool                             │
│     └── Options include: Ancient Ruins, Wormhole Nexus,                    │
│         Dark Matter Concentration, Reality Rift, etc.                       │
│                                                                              │
│  8. ROLL DOMINANT SPECIES & FACTION                                          │
│     └── choice(SPECIES_NAMES) — e.g. Zorgath, Terrans, Voidborn            │
│     └── choice(FACTION_NAMES) — e.g. Void Covenant, Iron Dominion           │
│                                                                              │
│  9. GENERATE COORDINATES                                                      │
│     └── x: -50,000 to 50,000                                                 │
│     └── y: -50,000 to 50,000                                                 │
│     └── z: -10,000 to 10,000                                                 │
│                                                                              │
│  10. GENERATE DESCRIPTION & LORE                                             │
│      └── Template-based, filled with rolled values                          │
│                                                                              │
│  OUTPUT: Complete GalaxyData                                                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 14. New Ideas & Suggested Improvements

### From the Repo's Design Philosophy

| # | Idea | Description | Effort |
|---|------|-------------|--------|
| 1 | **Galaxy Heat Map** | Color-code galaxies by player activity — red for warzones, green for peaceful, blue for undiscovered | Low |
| 2 | **Galaxy Discovery Log** | Each player tracks which galaxies/sectors they've personally discovered. Shows "Fog of War" on undiscovered regions. | Medium |
| 3 | **Galaxy Neighbors Graph** | Show which galaxies are adjacent/connected. Travel between galaxies via "intergalactic hyperlanes." | Low |
| 4 | **Sector Resources Heatmap** | Per-sector overlay showing resource abundance distribution across the galaxy | Low |
| 5 | **Galaxy Events Timeline** | Timeline view of major events per galaxy — wars, discoveries, boss kills | Medium |
| 6 | **Galaxy Leaderboard Filter** | Filter leaderboard by galaxy/universe — "Top players in Andromeda" | Low |
| 7 | **Intergalactic Trade Routes** | Trade connections between galaxies with different resource profiles | High |
| 8 | **Galaxy Age Effects** | Older galaxies have more ruins/artifacts, younger galaxies have more resources | Low |
| 9 | **Galaxy Migration** | Players can pay to relocate their empire to a different galaxy/universe | Medium |
| 10 | **Faction Territory Overlay** | Show NPC faction-controlled territories on the galaxy map with diplomatic coloring | Medium |
| 11 | **3D Galaxy Rotation** | Interactive 3D galaxy visualization where users can rotate/zoom the galaxy | High |
| 12 | **Expedition Discovery Log** | Log of all unique discoveries per galaxy — shared among all players exploring it | Low |

---

> **Document Version**: Alpha 1.5.0  
> **Last Updated**: 2026-06-26  
> **Data Source**: `src/data/cosmicHierarchy.ts`, `src/config/gameConfig.ts`  
> **Related Tables**: universes, galaxies, sectors, solar_systems, planets