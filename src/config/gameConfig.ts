// ═══════════════════════════════════════════════════════════════════════════
// MASTER GAME CONFIGURATION — Sci-Fi MMORPG OGame-Style
// All settings, constants, formulas, modules, categories and subcategories
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: SERVER & UNIVERSE SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

export const UNIVERSE_CONFIG = {
  name: 'Nexus Prime',
  speed: 1,                     // Universe speed multiplier (1x = normal)
  fleetSpeed: 1,                // Fleet travel speed multiplier
  researchSpeed: 1,             // Research time multiplier
  buildSpeed: 1,                // Build time multiplier
  economySpeed: 1,              // Resource production multiplier

  // Structure
  galaxies: 9,                  // Total galaxy count (1–9)
  systemsPerGalaxy: 499,        // Solar systems per galaxy
  planetsPerSystem: 15,         // Max planets per system (positions 1–15)
  maxPlanetsPerPlayer: 9,       // Max colonies a player can own
  debutPlanetPosition: 6,       // Default homeworld planet position

  // Timing (seconds)
  tickRate: 1,                  // Server tick every N seconds
  turnsPerMinute: 6,           // 6 turns per minute = one turn every 10s
  productionInterval: 10,       // Resources update every 10 seconds (6 TPM)
  fleetCheckInterval: 10,       // Fleet arrival check every 10 seconds
  rankingUpdateInterval: 3600,  // Ranking recalculates every hour

  // Debris fields
  debrisFieldEnabled: true,
  debrisMetalRate: 0.3,         // 30% of destroyed ships become debris
  debrisCrystalRate: 0.3,
  debrisHarvesterCapacity: 20000,

  // Moon system
  moonsEnabled: true,
  moonChancePerShip: 0.01,      // 1% per ship in fleet on impact
  maxMoonChance: 0.2,           // Max 20% moon creation chance
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// IN-GAME TIME CONFIGURATION — Sol System Year Clock
// ─────────────────────────────────────────────────────────────────────────────
//
// Formula: GameSeconds = RealSeconds × scalingFactor
//   1 real second  = 60 game seconds (1 game minute)
//   1 real minute  = 60 game minutes (1 game hour)
//   1 real hour    = 60 game hours   (2.5 game days)
//   1 real day     = 60 game days
//   1 game year    = 360 game days  → 6 real days per game year
//
// ─────────────────────────────────────────────────────────────────────────────

export const GAME_TIME_CONFIG = {
  /** How many game seconds pass per real second. S=60 means 1 real minute = 1 game hour. */
  scalingFactor: 60,

  /** Real-world epoch — the date/time when this universe/server went live. */
  epochReal: '2024-01-01T00:00:00Z' as const,

  /** The in-game calendar year at the epoch moment (Stellaris starts at 2200). */
  epochGameYear: 2247,

  /** Days per in-game year. 360 keeps the math clean and is common in space calendars. */
  daysPerYear: 360,

  /** Seconds per in-game day (always 86400, standard day). */
  secondsPerDay: 86400,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: RESOURCE TYPES & PRODUCTION
// ─────────────────────────────────────────────────────────────────────────────

export const RESOURCE_TYPES = {
  // Primary Resources
  METAL:             { id: 'metal',             name: 'Metal',             color: '#8B7355', icon: 'ri-coins-line',      category: 'primary'  },
  CRYSTAL:           { id: 'crystal',           name: 'Crystal',           color: '#4FC3F7', icon: 'ri-vip-diamond-line',        category: 'primary'  },
  DEUTERIUM:         { id: 'deuterium',         name: 'Deuterium',         color: '#80DEEA', icon: 'ri-drop-line',       category: 'primary'  },
  ENERGY:            { id: 'energy',            name: 'Energy',            color: '#FFF176', icon: 'ri-flashlight-line', category: 'primary'  },
  // Advanced Resources
  DARK_MATTER:       { id: 'dark_matter',       name: 'Dark Matter',       color: '#CE93D8', icon: 'ri-moon-line',       category: 'advanced' },
  ANTIMATTER:        { id: 'antimatter',        name: 'Antimatter',        color: '#F48FB1', icon: 'ri-flashlight-fill', category: 'advanced' },
  NANITES:           { id: 'nanites',           name: 'Nanites',           color: '#A5D6A7', icon: 'ri-microscope-line', category: 'advanced' },
  QUANTUM_CORES:     { id: 'quantum_cores',     name: 'Quantum Cores',     color: '#80CBC4', icon: 'ri-cpu-line',        category: 'advanced' },
  // Currencies
  IMPERIAL_CREDITS:  { id: 'imperial_credits',  name: 'Imperial Credits',  color: '#FFD700', icon: 'ri-coins-line', category: 'currency' },
  REPUBLIC_CREDITS:  { id: 'republic_credits',  name: 'Republic Credits',  color: '#98FB98', icon: 'ri-coin-line',       category: 'currency' },
} as const;

export type ResourceId = keyof typeof RESOURCE_TYPES;

export const RESOURCE_BASE_PRODUCTION: Record<string, number> = {
  metal:            30,   // units/hour at mine level 0
  crystal:          20,
  deuterium:        10,
  energy:           0,
};

export const RESOURCE_PRODUCTION_FORMULA = {
  // production = base * level * 1.1^level * universeSpeed
  multiplier:      1.1,
  energyCostBase:  10,  // energy needed per production unit
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: PLANET TYPES, SIZES & CLASSES
// ─────────────────────────────────────────────────────────────────────────────

export const PLANET_TYPES = {
  // Type → production bonus
  TERRAN:    { id: 'terran',    name: 'Terran',    metalBonus: 1.0, crystalBonus: 1.0, deuteriumBonus: 1.0, maxTemp: 40,   minTemp: -10, buildSlots: 163 },
  DESERT:    { id: 'desert',   name: 'Desert',    metalBonus: 1.2, crystalBonus: 0.8, deuteriumBonus: 0.7, maxTemp: 80,   minTemp: 20,  buildSlots: 162 },
  OCEAN:     { id: 'ocean',    name: 'Ocean',     metalBonus: 0.8, crystalBonus: 0.8, deuteriumBonus: 1.5, maxTemp: 20,   minTemp: -5,  buildSlots: 140 },
  ICE:       { id: 'ice',      name: 'Ice',       metalBonus: 0.9, crystalBonus: 1.1, deuteriumBonus: 1.3, maxTemp: -20,  minTemp: -80, buildSlots: 140 },
  VOLCANIC:  { id: 'volcanic', name: 'Volcanic',  metalBonus: 1.5, crystalBonus: 0.6, deuteriumBonus: 0.5, maxTemp: 130,  minTemp: 80,  buildSlots: 170 },
  GAS_GIANT: { id: 'gas',      name: 'Gas Giant', metalBonus: 0.5, crystalBonus: 0.7, deuteriumBonus: 2.0, maxTemp: -100, minTemp: -150,buildSlots: 90  },
  ROCKY:     { id: 'rocky',    name: 'Rocky',     metalBonus: 1.1, crystalBonus: 1.2, deuteriumBonus: 0.8, maxTemp: 50,   minTemp: -30, buildSlots: 155 },
  JUNGLE:    { id: 'jungle',   name: 'Jungle',    metalBonus: 0.9, crystalBonus: 1.0, deuteriumBonus: 1.2, maxTemp: 30,   minTemp: 10,  buildSlots: 152 },
  BARREN:    { id: 'barren',   name: 'Barren',    metalBonus: 1.0, crystalBonus: 1.0, deuteriumBonus: 0.6, maxTemp: 60,   minTemp: -60, buildSlots: 130 },
  EXOTIC:    { id: 'exotic',   name: 'Exotic',    metalBonus: 1.3, crystalBonus: 1.3, deuteriumBonus: 1.3, maxTemp: 200,  minTemp: -200,buildSlots: 180 },
} as const;

export const PLANET_POSITIONS: Record<number, { type: string; tempRange: [number, number] }> = {
  1:  { type: 'volcanic', tempRange: [220, 260] },
  2:  { type: 'volcanic', tempRange: [170, 220] },
  3:  { type: 'desert',   tempRange: [120, 170] },
  4:  { type: 'desert',   tempRange: [70, 120]  },
  5:  { type: 'rocky',    tempRange: [40, 75]   },
  6:  { type: 'terran',   tempRange: [10, 45]   },
  7:  { type: 'terran',   tempRange: [-18, 18]  },
  8:  { type: 'ocean',    tempRange: [-50, -10] },
  9:  { type: 'jungle',   tempRange: [-65, -25] },
  10: { type: 'ice',      tempRange: [-80, -40] },
  11: { type: 'ice',      tempRange: [-110, -65]},
  12: { type: 'gas',      tempRange: [-130, -90]},
  13: { type: 'gas',      tempRange: [-150, -110]},
  14: { type: 'barren',   tempRange: [-170, -130]},
  15: { type: 'barren',   tempRange: [-200, -160]},
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: COMBAT SYSTEM CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

export const COMBAT_CONFIG = {
  // Rounds
  maxRounds: 6,
  rapidFireThreshold: 0.01,       // 1% hull = ship destroyed

  // Rapid Fire Table (attacker → target → RF value)
  // Higher RF = more shots per round
  rapidFireTable: {
    fighter:      { transport: 5, solar_sat: 5, espionage_probe: 5, light_laser: 2 },
    heavy:        { transport: 5, solar_sat: 5, espionage_probe: 5, light_laser: 3, heavy_laser: 2 },
    cruiser:      { fighter: 6, espionage_probe: 5, light_laser: 6, heavy_laser: 3 },
    battleship:   { espionage_probe: 5 },
    interceptor:  { cruiser: 4, fighter: 4, espionage_probe: 5 },
    bomber:       { ion_cannon: 20, espionage_probe: 5, plasma_turret: 5 },
    destroyer:    { battleship: 2, espionage_probe: 5, deathstar: 2 },
    deathstar:    { fighter: 200, heavy: 100, cruiser: 33, battleship: 30, espionage_probe: 1250, solar_sat: 1250, transport: 250, recycler: 250, destroyer: 5, bomber: 25, interceptor: 25 },
    recycler:     { espionage_probe: 5, solar_sat: 5 },
  } as Record<string, Record<string, number>>,

  // Defense vs Ship modifiers (defense type → ship type → multiplier)
  defenseEfficiency: {
    rocket_launcher: { fighter: 1.0, heavy: 1.0, cruiser: 0.5, battleship: 0.25 },
    light_laser:     { fighter: 1.0, heavy: 1.0, cruiser: 0.5, battleship: 0.25 },
    heavy_laser:     { fighter: 1.0, heavy: 1.0, cruiser: 1.0, battleship: 0.5  },
    gauss_cannon:    { fighter: 1.0, heavy: 1.0, cruiser: 1.0, battleship: 1.0  },
    ion_cannon:      { fighter: 1.0, heavy: 1.0, cruiser: 1.0, battleship: 1.0  },
    plasma_turret:   { fighter: 1.0, heavy: 1.0, cruiser: 1.0, battleship: 1.0  },
  } as Record<string, Record<string, number>>,

  // Loot
  lootRate: 0.5,           // 50% of resources on planet can be looted
  lootCapacityLimit: true, // Limited by fleet cargo capacity

  // Espionage
  espionageBaseProbability: 0.1,
  espionageLevelBonus: 0.1,    // +10% per espionage tech level diff

  // Fleet save
  allowFleetSave: true,
  fleetSaveMinDuration: 1800,  // 30 min minimum
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: MISSION TYPES
// ─────────────────────────────────────────────────────────────────────────────

export const MISSION_TYPES = {
  ATTACK:         { id: 'attack',     name: 'Attack',         icon: 'ri-sword-line',       requiresShips: true,  cargoAllowed: false, espionageOnly: false },
  TRANSPORT:      { id: 'transport',  name: 'Transport',      icon: 'ri-truck-line',        requiresShips: true,  cargoAllowed: true,  espionageOnly: false },
  DEPLOY:         { id: 'deploy',     name: 'Deploy',         icon: 'ri-map-pin-add-line',  requiresShips: true,  cargoAllowed: true,  espionageOnly: false },
  STATIONING:     { id: 'station',    name: 'Stationing',     icon: 'ri-base-station-line', requiresShips: true,  cargoAllowed: false, espionageOnly: false },
  ESPIONAGE:      { id: 'spy',        name: 'Espionage',      icon: 'ri-user-search-line',          requiresShips: true,  cargoAllowed: false, espionageOnly: true  },
  COLONIZE:       { id: 'colonize',   name: 'Colonize',       icon: 'ri-planet-line',       requiresShips: true,  cargoAllowed: true,  espionageOnly: false },
  HARVEST:        { id: 'harvest',    name: 'Harvest',        icon: 'ri-recycle-line',      requiresShips: true,  cargoAllowed: false, espionageOnly: false },
  DESTROY:        { id: 'destroy',    name: 'Destroy Moon',   icon: 'ri-fire-fill',         requiresShips: true,  cargoAllowed: false, espionageOnly: false },
  EXPEDITION:     { id: 'expedition', name: 'Expedition',     icon: 'ri-compass-3-line',    requiresShips: true,  cargoAllowed: false, espionageOnly: false },
  ALLIANCE:       { id: 'alliance',   name: 'Alliance Attack',icon: 'ri-team-line',         requiresShips: true,  cargoAllowed: false, espionageOnly: false },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6: PLAYER PROGRESSION & RANK
// ─────────────────────────────────────────────────────────────────────────────

export const PROGRESSION_CONFIG = {
  maxLevel: 150,
  maxPrestige: 100,
  skillPointsPerLevel: 3,

  // XP formula: xpToNext = base * growthRate^(level-1)
  xpBase: 1000,
  xpGrowthRate: 1.5,

  // Rank thresholds (points)
  rankThresholds: {
    'E':   0,
    'D':   500,
    'C':   2000,
    'B':   5000,
    'A':   10000,
    'S':   25000,
    'SS':  50000,
    'SSS': 100000,
  },

  // Point scoring weights
  pointWeights: {
    buildingLevel:     1,
    researchLevel:     3,
    shipDestroyed:     1,
    shipBuilt:         0,
    planetColonized:   100,
    battleWon:         50,
    questCompleted:    25,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7: ECONOMY & MARKET CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

export const ECONOMY_CONFIG = {
  // Market
  marketTaxRate:      0.02,    // 2% transaction tax
  brokerFeeBase:      0.01,    // 1% base broker fee
  auctionDuration:    86400,   // 24h default auction duration (seconds)
  maxActiveOrders:    50,      // Max open market orders per player
  contractDuration:   2592000, // 30 days default contract duration

  // Currency exchange
  exchangeRates: {
    imperial_to_republic: 0.6,
    republic_to_imperial: 1.5,
    exchangeFee: 0.02,
  },

  // Black market
  blackMarketStockRefresh: 3600,   // 1 hour stock refresh
  blackMarketSlots:         6,     // Items available at once
  blackMarketPriceVariance: 0.3,   // ±30% price variance

  // Trade routes
  maxTradeRoutes:    10,
  tradeRouteCooldown: 300,         // 5 min cooldown after modification
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8: ALLIANCE SYSTEM CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

export const ALLIANCE_CONFIG = {
  maxMembers:          50,
  maxName:             20,
  maxTag:              5,
  createCost:          { imperial_credits: 500000 },
  diplomacyTypes:      ['ally', 'nap', 'war', 'neutral'],
  warDeclarationDelay: 86400,    // 24h war declaration notice
  allianceWarEnabled:  true,
  territoryBonuses:    true,
  maxDiplomacySlots:   20,

  // Ranks within alliance
  memberRanks: [
    { id: 'founder',     name: 'Founder',      level: 10, permissions: ['all'] },
    { id: 'coleader',    name: 'Co-Leader',     level: 9,  permissions: ['invite', 'kick', 'war', 'diplomacy', 'resources', 'manage'] },
    { id: 'officer',     name: 'Officer',       level: 8,  permissions: ['invite', 'kick', 'manage'] },
    { id: 'veteran',     name: 'Veteran',       level: 7,  permissions: ['invite'] },
    { id: 'member',      name: 'Member',        level: 1,  permissions: [] },
    { id: 'recruit',     name: 'Recruit',       level: 0,  permissions: [] },
  ],
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 9: FEATURE FLAGS
// ─────────────────────────────────────────────────────────────────────────────

export const FEATURE_FLAGS = {
  moonSystem:           true,
  espionage:            true,
  alliances:            true,
  allianceWars:         true,
  seasonPass:           true,
  worldBosses:          true,
  pirateRaids:          true,
  blackMarket:          true,
  crafting:             true,
  masterCrafting:       true,
  fleetFormations:      true,
  officers:             true,
  megastructures:       true,
  motherships:          true,
  planetaryEvents:      true,
  seasonalEvents:       true,
  leaderboards:         true,
  achievements:         true,
  skills:               true,
  populationSystem:     true,
  tradeRoutes:          true,
  resourceTrading:      true,
  blueprints:           true,
  shipCustomization:    true,
  starbaseNetwork:      true,
  stargateNetwork:      true,
  campaignMode:         true,
  expeditions:          true,
  bountySystem:         true,
  insuranceSystem:      true,
  galaxyMap:            true,
  universeGenerator:    true,
  combatSimulator:      true,
  advancedCombat:       true,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 10: NOTIFICATION & EVENT TYPES
// ─────────────────────────────────────────────────────────────────────────────

export const NOTIFICATION_TYPES = {
  FLEET_ARRIVED:      { id: 'fleet_arrived',      category: 'fleet',  priority: 'normal',  icon: 'ri-rocket-line'          },
  FLEET_RETURNING:    { id: 'fleet_returning',     category: 'fleet',  priority: 'normal',  icon: 'ri-rocket-line'          },
  FLEET_RECALLED:     { id: 'fleet_recalled',      category: 'fleet',  priority: 'normal',  icon: 'ri-arrow-go-back-line'   },
  UNDER_ATTACK:       { id: 'under_attack',        category: 'combat', priority: 'urgent',  icon: 'ri-alarm-warning-line'   },
  BATTLE_REPORT:      { id: 'battle_report',       category: 'combat', priority: 'high',    icon: 'ri-sword-line'           },
  ESPIONAGE_REPORT:   { id: 'espionage_report',    category: 'combat', priority: 'high',    icon: 'ri-user-search-line'             },
  BUILDING_COMPLETE:  { id: 'building_complete',   category: 'build',  priority: 'normal',  icon: 'ri-building-2-line'      },
  RESEARCH_COMPLETE:  { id: 'research_complete',   category: 'build',  priority: 'normal',  icon: 'ri-flask-line'           },
  SHIP_COMPLETE:      { id: 'ship_complete',        category: 'build',  priority: 'normal',  icon: 'ri-ship-line'            },
  QUEST_COMPLETE:     { id: 'quest_complete',       category: 'other',  priority: 'normal',  icon: 'ri-trophy-line'          },
  ALLIANCE_MSG:       { id: 'alliance_msg',         category: 'other',  priority: 'normal',  icon: 'ri-team-line'            },
  LEVEL_UP:           { id: 'level_up',             category: 'other',  priority: 'normal',  icon: 'ri-star-line'            },
  RESOURCES_FULL:     { id: 'resources_full',       category: 'other',  priority: 'normal',  icon: 'ri-database-2-line'      },
  PIRATE_RAID:        { id: 'pirate_raid',          category: 'combat', priority: 'urgent',  icon: 'ri-sword-line'           },
  WORLD_BOSS_SPAWN:   { id: 'world_boss_spawn',     category: 'other',  priority: 'high',    icon: 'ri-question-mark'           },
  MOON_CREATED:       { id: 'moon_created',         category: 'other',  priority: 'high',    icon: 'ri-moon-line'            },
  PLANET_COLONIZED:   { id: 'planet_colonized',     category: 'other',  priority: 'normal',  icon: 'ri-planet-line'          },
  ACHIEVEMENT_UNLOCK: { id: 'achievement_unlock',   category: 'other',  priority: 'normal',  icon: 'ri-medal-line'           },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 11: GAME SPEED & BALANCE PRESETS
// ─────────────────────────────────────────────────────────────────────────────

export const SPEED_PRESETS = {
  SLOW:       { label: 'Slow Universe',    buildSpeed: 0.5,  fleetSpeed: 0.5,  researchSpeed: 0.5,  economySpeed: 0.5  },
  NORMAL:     { label: 'Normal Universe',  buildSpeed: 1.0,  fleetSpeed: 1.0,  researchSpeed: 1.0,  economySpeed: 1.0  },
  FAST:       { label: 'Fast Universe',    buildSpeed: 2.0,  fleetSpeed: 2.0,  researchSpeed: 2.0,  economySpeed: 2.0  },
  EXTREME:    { label: 'Extreme Universe', buildSpeed: 5.0,  fleetSpeed: 5.0,  researchSpeed: 5.0,  economySpeed: 5.0  },
  RAPID:      { label: 'Rapid Universe',   buildSpeed: 10.0, fleetSpeed: 10.0, researchSpeed: 10.0, economySpeed: 10.0 },
  CUSTOM:     { label: 'Custom',           buildSpeed: 1.0,  fleetSpeed: 1.0,  researchSpeed: 1.0,  economySpeed: 1.0  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 12: PLAYER SETTINGS DEFAULTS
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_PLAYER_SETTINGS = {
  notifications: {
    fleetArrivals:    true,
    underAttack:      true,
    buildComplete:    true,
    researchComplete: true,
    allianceMessages: true,
    questComplete:    true,
    worldBoss:        true,
    email:            false,
  },
  display: {
    theme:            'dark',
    language:         'en',
    numberFormat:     'compact',  // 'compact' | 'full'
    coordinateFormat: 'galaxy:system:position',
    showOfflineTime:  true,
  },
  gameplay: {
    autoSave:         true,
    confirmFleetSend: true,
    confirmBuilding:  true,
    showTutorial:     true,
    showHints:        true,
  },
} as const;
