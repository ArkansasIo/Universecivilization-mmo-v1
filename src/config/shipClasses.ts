// ═══════════════════════════════════════════════════════════════════════════
// SHIP CLASS HIERARCHY — Full Classification System
// Classes → Subclasses → Roles → Specializations
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: CLASS HIERARCHY STRUCTURE
// ─────────────────────────────────────────────────────────────────────────────

export const SHIP_CLASS_HIERARCHY = {
  // ── TIER 1–15: LIGHT VESSELS ───────────────────────────────────────────────
  Fighter: {
    tier:         { min: 1,  max: 15 },
    category:     'Light',
    crewRange:    [1, 3],
    subClasses: [
      { id: 'interceptor',    name: 'Interceptor',      role: 'anti-fighter',  speedBonus: 1.3, damageBonus: 0.8 },
      { id: 'strike',         name: 'Strike Fighter',   role: 'assault',       speedBonus: 1.1, damageBonus: 1.2 },
      { id: 'stealth',        name: 'Stealth Fighter',  role: 'covert',        speedBonus: 1.2, damageBonus: 1.0 },
      { id: 'bomber',         name: 'Bomber',           role: 'siege',         speedBonus: 0.8, damageBonus: 1.5 },
      { id: 'scout',          name: 'Scout',            role: 'recon',         speedBonus: 1.5, damageBonus: 0.5 },
    ],
    counters:     ['transport', 'mining'],
    counteredBy:  ['corvette', 'defense'],
    roles:        ['patrol', 'escort', 'scout', 'intercept'],
    unlockLevel:  1,
  },

  // ── TIER 12–25: FAST ATTACK ────────────────────────────────────────────────
  Corvette: {
    tier:         { min: 12, max: 25 },
    category:     'Light',
    crewRange:    [5, 20],
    subClasses: [
      { id: 'attack',         name: 'Attack Corvette',   role: 'assault',       speedBonus: 1.2, damageBonus: 1.1 },
      { id: 'missile',        name: 'Missile Corvette',  role: 'long-range',    speedBonus: 0.9, damageBonus: 1.3 },
      { id: 'stealth',        name: 'Stealth Corvette',  role: 'covert',        speedBonus: 1.1, damageBonus: 1.1 },
      { id: 'defense',        name: 'Defense Corvette',  role: 'support',       speedBonus: 0.8, damageBonus: 0.8 },
      { id: 'patrol',         name: 'Patrol Corvette',   role: 'patrol',        speedBonus: 1.3, damageBonus: 0.9 },
    ],
    counters:     ['fighter', 'probe'],
    counteredBy:  ['frigate', 'destroyer'],
    roles:        ['patrol', 'raid', 'escort', 'intercept'],
    unlockLevel:  5,
  },

  // ── TIER 25–40: VERSATILE MEDIUM ──────────────────────────────────────────
  Frigate: {
    tier:         { min: 25, max: 40 },
    category:     'Medium',
    crewRange:    [20, 60],
    subClasses: [
      { id: 'assault',        name: 'Assault Frigate',   role: 'combat',        speedBonus: 1.0, damageBonus: 1.2 },
      { id: 'defense',        name: 'Shield Frigate',    role: 'support',       speedBonus: 0.8, damageBonus: 0.8 },
      { id: 'recon',          name: 'Recon Frigate',     role: 'exploration',   speedBonus: 1.2, damageBonus: 0.7 },
      { id: 'electronic',     name: 'EW Frigate',        role: 'electronic-war',speedBonus: 0.9, damageBonus: 0.6 },
      { id: 'logistics',      name: 'Logistics Frigate', role: 'repair',        speedBonus: 0.7, damageBonus: 0.5 },
    ],
    counters:     ['corvette', 'fighter'],
    counteredBy:  ['destroyer', 'cruiser'],
    roles:        ['fleet-support', 'patrol', 'combat', 'exploration'],
    unlockLevel:  10,
  },

  // ── TIER 40–55: HEAVY COMBAT ───────────────────────────────────────────────
  Destroyer: {
    tier:         { min: 40, max: 55 },
    category:     'Heavy',
    crewRange:    [50, 120],
    subClasses: [
      { id: 'gunship',        name: 'Gunship',           role: 'assault',       speedBonus: 1.0, damageBonus: 1.3 },
      { id: 'missile',        name: 'Missile Destroyer', role: 'long-range',    speedBonus: 0.9, damageBonus: 1.4 },
      { id: 'carrier',        name: 'Escort Carrier',    role: 'carrier',       speedBonus: 0.8, damageBonus: 0.9 },
      { id: 'siege',          name: 'Siege Destroyer',   role: 'siege',         speedBonus: 0.7, damageBonus: 1.5 },
      { id: 'stealth',        name: 'Stealth Destroyer', role: 'covert',        speedBonus: 1.1, damageBonus: 1.2 },
    ],
    counters:     ['frigate', 'corvette', 'fighter'],
    counteredBy:  ['cruiser', 'battleship'],
    roles:        ['fleet-escort', 'siege', 'patrol', 'strike'],
    unlockLevel:  20,
  },

  // ── TIER 55–70: POWERFUL CAPITAL ──────────────────────────────────────────
  Cruiser: {
    tier:         { min: 55, max: 70 },
    category:     'Capital',
    crewRange:    [100, 400],
    subClasses: [
      { id: 'battle',         name: 'Battle Cruiser',    role: 'combat',        speedBonus: 1.0, damageBonus: 1.2 },
      { id: 'heavy',          name: 'Heavy Cruiser',     role: 'assault',       speedBonus: 0.8, damageBonus: 1.4 },
      { id: 'command',        name: 'Command Cruiser',   role: 'command',       speedBonus: 0.9, damageBonus: 0.9 },
      { id: 'stealth',        name: 'Stealth Cruiser',   role: 'covert',        speedBonus: 1.1, damageBonus: 1.2 },
      { id: 'siege',          name: 'Siege Cruiser',     role: 'siege',         speedBonus: 0.7, damageBonus: 1.6 },
    ],
    counters:     ['destroyer', 'frigate'],
    counteredBy:  ['battleship', 'dreadnought'],
    roles:        ['fleet-lead', 'siege', 'command', 'patrol'],
    unlockLevel:  30,
  },

  // ── TIER 70–80: ELITE CAPITAL ──────────────────────────────────────────────
  Battlecruiser: {
    tier:         { min: 70, max: 80 },
    category:     'Super Capital',
    crewRange:    [300, 700],
    subClasses: [
      { id: 'assault',        name: 'Assault BC',        role: 'combat',        speedBonus: 1.0, damageBonus: 1.3 },
      { id: 'command',        name: 'Command BC',        role: 'command',       speedBonus: 0.9, damageBonus: 1.0 },
      { id: 'siege',          name: 'Siege BC',          role: 'siege',         speedBonus: 0.7, damageBonus: 1.6 },
      { id: 'stealth',        name: 'Eclipse BC',        role: 'covert',        speedBonus: 1.0, damageBonus: 1.3 },
      { id: 'carrier',        name: 'Carrier BC',        role: 'carrier',       speedBonus: 0.8, damageBonus: 0.9 },
    ],
    counters:     ['cruiser', 'destroyer'],
    counteredBy:  ['battleship', 'titan'],
    roles:        ['fleet-lead', 'siege', 'carrier', 'command'],
    unlockLevel:  40,
  },

  // ── TIER 80–88: MASSIVE WAR MACHINES ──────────────────────────────────────
  Battleship: {
    tier:         { min: 80, max: 88 },
    category:     'Super Capital',
    crewRange:    [500, 1500],
    subClasses: [
      { id: 'titan',          name: 'Titan Battleship',  role: 'combat',        speedBonus: 0.8, damageBonus: 1.4 },
      { id: 'dreadnought',    name: 'Dreadnought',       role: 'assault',       speedBonus: 0.7, damageBonus: 1.5 },
      { id: 'fortress',       name: 'Fortress BS',       role: 'support',       speedBonus: 0.6, damageBonus: 1.0 },
      { id: 'siege',          name: 'Siege BS',          role: 'siege',         speedBonus: 0.6, damageBonus: 1.7 },
    ],
    counters:     ['battlecruiser', 'cruiser'],
    counteredBy:  ['dreadnought', 'titan'],
    roles:        ['fleet-anchor', 'siege', 'command'],
    unlockLevel:  50,
  },

  // ── TIER 60–85: FIGHTER COMMAND ────────────────────────────────────────────
  Carrier: {
    tier:         { min: 60, max: 85 },
    category:     'Capital',
    crewRange:    [400, 2000],
    subClasses: [
      { id: 'fleet',          name: 'Fleet Carrier',     role: 'carrier',       speedBonus: 0.9, damageBonus: 0.8 },
      { id: 'super',          name: 'Super Carrier',     role: 'carrier',       speedBonus: 0.8, damageBonus: 0.9 },
      { id: 'command',        name: 'Command Carrier',   role: 'command',       speedBonus: 0.7, damageBonus: 0.7 },
      { id: 'assault',        name: 'Assault Carrier',   role: 'combat',        speedBonus: 0.9, damageBonus: 1.1 },
    ],
    counters:     ['cruiser'],
    counteredBy:  ['interceptor', 'destroyer'],
    roles:        ['carrier', 'command', 'assault'],
    unlockLevel:  35,
  },

  // ── TIER 88–95: ULTIMATE WAR MACHINES ─────────────────────────────────────
  Dreadnought: {
    tier:         { min: 88, max: 95 },
    category:     'Legendary',
    crewRange:    [1000, 3000],
    subClasses: [
      { id: 'siege',          name: 'Siege Dreadnought', role: 'siege',         speedBonus: 0.6, damageBonus: 1.8 },
      { id: 'command',        name: 'Command Dread',     role: 'command',       speedBonus: 0.7, damageBonus: 1.2 },
      { id: 'assault',        name: 'Assault Dread',     role: 'combat',        speedBonus: 0.8, damageBonus: 1.5 },
    ],
    counters:     ['battleship', 'battlecruiser'],
    counteredBy:  ['titan', 'mothership'],
    roles:        ['fleet-destroyer', 'siege', 'command'],
    unlockLevel:  60,
  },

  // ── TIER 95–97: GOD-TIER ──────────────────────────────────────────────────
  Titan: {
    tier:         { min: 95, max: 97 },
    category:     'Legendary',
    crewRange:    [2000, 6000],
    subClasses: [
      { id: 'celestial',      name: 'Celestial Titan',   role: 'combat',        speedBonus: 0.7, damageBonus: 1.6 },
      { id: 'void',           name: 'Void Titan',        role: 'siege',         speedBonus: 0.6, damageBonus: 1.9 },
      { id: 'eternal',        name: 'Eternal Titan',     role: 'command',       speedBonus: 0.8, damageBonus: 1.4 },
    ],
    counters:     ['dreadnought', 'battleship'],
    counteredBy:  ['mothership'],
    roles:        ['fleet-supreme', 'god-tier'],
    unlockLevel:  75,
  },

  // ── TIER 97–99: ULTIMATE VESSELS ──────────────────────────────────────────
  Mothership: {
    tier:         { min: 97, max: 99 },
    category:     'Legendary',
    crewRange:    [5000, 20000],
    subClasses: [
      { id: 'genesis',        name: 'Genesis MS',        role: 'support',       speedBonus: 0.7, damageBonus: 1.2 },
      { id: 'exodus',         name: 'Exodus MS',         role: 'exploration',   speedBonus: 0.9, damageBonus: 1.0 },
      { id: 'apocalypse',     name: 'Apocalypse MS',     role: 'combat',        speedBonus: 0.6, damageBonus: 2.0 },
    ],
    counters:     ['titan', 'dreadnought', 'all'],
    counteredBy:  ['flagship'],
    roles:        ['supreme-command', 'fleet-base', 'world-destroyer'],
    unlockLevel:  90,
  },

  // ── TIER 99: THE ULTIMATE SHIP ────────────────────────────────────────────
  Flagship: {
    tier:         { min: 99, max: 99 },
    category:     'Legendary',
    crewRange:    [20000, 50000],
    subClasses: [
      { id: 'eternal',        name: 'Eternal Flagship',  role: 'all',           speedBonus: 1.0, damageBonus: 2.5 },
    ],
    counters:     ['all'],
    counteredBy:  [],
    roles:        ['omnipotent'],
    unlockLevel:  100,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: SHIP ROLE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export const SHIP_ROLES = {
  Combat:       { id: 'Combat',       name: 'Combat',       desc: 'Balanced attack & defense', icon: 'ri-sword-line'          },
  Support:      { id: 'Support',      name: 'Support',      desc: 'Fleet buffs & repair',      icon: 'ri-shield-line'         },
  Stealth:      { id: 'Stealth',      name: 'Stealth',      desc: 'Covert ops & espionage',    icon: 'ri-user-search-line'            },
  Siege:        { id: 'Siege',        name: 'Siege',        desc: 'Structure & planet attack', icon: 'ri-fire-fill'           },
  Exploration:  { id: 'Exploration',  name: 'Exploration',  desc: 'Deep space surveying',      icon: 'ri-compass-3-line'      },
  Mining:       { id: 'Mining',       name: 'Mining',       desc: 'Resource extraction',       icon: 'ri-hammer-line'         },
  Transport:    { id: 'Transport',    name: 'Transport',    desc: 'Cargo & colonization',      icon: 'ri-truck-line'          },
  Hybrid:       { id: 'Hybrid',       name: 'Hybrid',       desc: 'Multi-role versatility',    icon: 'ri-settings-3-line'     },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: BASE SHIP STAT FORMULAS
// ─────────────────────────────────────────────────────────────────────────────

export const SHIP_STAT_FORMULAS = {
  // hull = base * tier^1.4 * level^0.3
  hull:         { base: 100,  tierExponent: 1.4, levelExponent: 0.3 },
  shield:       { base: 40,   tierExponent: 1.3, levelExponent: 0.3 },
  armor:        { base: 10,   tierExponent: 1.3, levelExponent: 0.25 },
  attack:       { base: 15,   tierExponent: 1.35,levelExponent: 0.35 },
  speed:        { base: 1000, tierExponent: 0.8, levelExponent: 0.1  },
  cargo:        { base: 50,   tierExponent: 1.5, levelExponent: 0.2  },
  fuel:         { base: 20,   tierExponent: 1.2, levelExponent: 0.15 },

  // Build costs = base * 1.5^tier
  metalCost:    { base: 3000,   growth: 1.5  },
  crystalCost:  { base: 1000,   growth: 1.5  },
  deutCost:     { base: 500,    growth: 1.5  },
  buildTime:    { base: 30,     growth: 1.4  }, // seconds

  // Rapid fire threshold
  rapidFireThreshold: 0.01,  // 1% hull remaining = destroyed
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: UTILITY SHIP TYPES
// ─────────────────────────────────────────────────────────────────────────────

export const UTILITY_SHIPS = {
  SMALL_TRANSPORT:   { id: 'small_transport',  name: 'Small Transport',   cargo: 5000,   speed: 10000 },
  LARGE_TRANSPORT:   { id: 'large_transport',  name: 'Large Transport',   cargo: 25000,  speed: 7500  },
  COLONY_SHIP:       { id: 'colony_ship',      name: 'Colony Ship',       cargo: 7500,   speed: 2500  },
  RECYCLER:          { id: 'recycler',         name: 'Recycler',          cargo: 20000,  speed: 2000  },
  ESPIONAGE_PROBE:   { id: 'espionage_probe',  name: 'Espionage Probe',   cargo: 0,      speed: 100000000 },
  SOLAR_SATELLITE:   { id: 'solar_satellite',  name: 'Solar Satellite',   cargo: 0,      speed: 0     },
  CRAWLER:           { id: 'crawler',          name: 'Crawler',           cargo: 0,      speed: 0     },
  REAPER:            { id: 'reaper',           name: 'Reaper',            cargo: 7000,   speed: 7000  },
  PATHFINDER:        { id: 'pathfinder',       name: 'Pathfinder',        cargo: 10000,  speed: 12000 },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: FLEET FORMATION TYPES
// ─────────────────────────────────────────────────────────────────────────────

export const FLEET_FORMATIONS = {
  WEDGE:        { id: 'wedge',        name: 'Wedge',         attackBonus: 1.15, defenseBonus: 0.9,  speedBonus: 1.0  },
  SPREAD:       { id: 'spread',       name: 'Spread',        attackBonus: 1.0,  defenseBonus: 1.0,  speedBonus: 1.0  },
  DEFENSIVE:    { id: 'defensive',    name: 'Defensive Box', attackBonus: 0.85, defenseBonus: 1.25, speedBonus: 0.9  },
  RAPID:        { id: 'rapid',        name: 'Rapid Strike',  attackBonus: 1.1,  defenseBonus: 0.85, speedBonus: 1.2  },
  SIEGE:        { id: 'siege',        name: 'Siege Line',    attackBonus: 1.3,  defenseBonus: 0.8,  speedBonus: 0.7  },
  HAMMER:       { id: 'hammer',       name: 'Hammer & Anvil',attackBonus: 1.2,  defenseBonus: 1.1,  speedBonus: 0.95 },
  DIAMOND:      { id: 'diamond',      name: 'Diamond',       attackBonus: 1.05, defenseBonus: 1.15, speedBonus: 0.95 },
  SPEAR:        { id: 'spear',        name: 'Spear Tip',     attackBonus: 1.25, defenseBonus: 0.75, speedBonus: 1.1  },
} as const;
