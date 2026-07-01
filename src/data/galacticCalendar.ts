/* ═══════════════════════════════════════════════════════════════════════════
   GALACTIC CALENDAR — Sol System Year Calendar
   ────────────────────────────────────────────────────────────────────────────
   12 months × 30 days = 360 day years
   7-day Sol week: Solis, Lunaris, Mercuris, Veneris, Terrae, Martis, Jovis
   ═══════════════════════════════════════════════════════════════════════════ */

/** The 12 months of the Galactic Standard Year */
export interface CalendarMonth {
  index: number;       // 0-based
  name: string;
  abbr: string;       // 3-letter abbreviation
  days: number;       // always 30
  season: 'Voidwinter' | 'Starbloom' | 'Emberfall' | 'Frostveil';
  description: string;
  color: string;      // accent color for UI
}

export const GALACTIC_MONTHS: CalendarMonth[] = [
  { index: 0,  name: 'Aetherium',    abbr: 'AET', days: 30, season: 'Voidwinter', description: 'The cosmic dawn — galaxies realign, ancient energies surge across the void.',         color: '#7c3aed' },
  { index: 1,  name: 'Solara',       abbr: 'SOL', days: 30, season: 'Voidwinter', description: 'Solar winds intensify, bathing inner systems in heightened radiation.',            color: '#f59e0b' },
  { index: 2,  name: 'Veridian',     abbr: 'VER', days: 30, season: 'Starbloom',  description: 'Nebula blooms appear across the outer rim — prime season for exploration.',        color: '#10b981' },
  { index: 3,  name: 'Luminar',      abbr: 'LUM', days: 30, season: 'Starbloom',  description: 'Binary star alignments create spectacular light phenomena across the sectors.',     color: '#06b6d4' },
  { index: 4,  name: 'Crystallis',   abbr: 'CRY', days: 30, season: 'Starbloom',  description: 'Crystal formations grow rapidly — resource yields double in mining operations.',     color: '#a78bfa' },
  { index: 5,  name: 'Pyronis',      abbr: 'PYR', days: 30, season: 'Emberfall',  description: 'Core worlds experience volcanic surges — geothermal energy peaks.',                  color: '#ef4444' },
  { index: 6,  name: 'Ferrunox',     abbr: 'FER', days: 30, season: 'Emberfall',  description: 'Metal-rich asteroid fields reach closest approach — prime harvesting season.',        color: '#f97316' },
  { index: 7,  name: 'Nocturnis',    abbr: 'NOC', days: 30, season: 'Emberfall',  description: 'Dark matter density increases — stealth and espionage operations gain bonuses.',     color: '#6366f1' },
  { index: 8,  name: 'Zephyron',     abbr: 'ZEP', days: 30, season: 'Frostveil',  description: 'Interstellar currents shift — fleet travel speeds increase by 15% sector-wide.',     color: '#14b8a6' },
  { index: 9,  name: 'Glaciara',     abbr: 'GLA', days: 30, season: 'Frostveil',  description: 'Ice world temperatures plummet — cryogenic research bonuses active.',               color: '#0ea5e9' },
  { index: 10, name: 'Umbron',       abbr: 'UMB', days: 30, season: 'Frostveil',  description: 'The Great Shadow — nebula density peaks, reducing visibility across all sectors.',   color: '#8b5cf6' },
  { index: 11, name: 'Aethereon',    abbr: 'AEN', days: 30, season: 'Voidwinter',  description: 'The year-end convergence — all celestial bodies align, legendary events trigger.',   color: '#d946ef' },
];

export const SOL_DAY_NAMES = ['Solis', 'Lunaris', 'Mercuris', 'Veneris', 'Terrae', 'Martis', 'Jovis'] as const;

export const SEASONS = ['Voidwinter', 'Starbloom', 'Emberfall', 'Frostveil'] as const;

export type Season = typeof SEASONS[number];

/** A holiday or special day in the galactic calendar */
export interface CalendarHoliday {
  id: string;
  name: string;
  description: string;
  month: number;        // 0-based month index
  day: number;          // 1-30
  type: 'galactic' | 'faction' | 'seasonal' | 'religious' | 'historical';
  icon: string;
  color: string;
  effects?: string;     // Gameplay effects description
}

export const GALACTIC_HOLIDAYS: CalendarHoliday[] = [
  // ── Voidwinter Holidays ──
  { id: 'h-new-year',        name: 'Universal Dawn',        description: 'Year reset — all empires celebrate the new cosmic cycle.',                                                                 month: 0,  day: 1,  type: 'galactic',   icon: 'ri-sun-line',              color: '#f59e0b', effects: 'All production boosted +20% for 24h' },
  { id: 'h-founder-day',     name: 'Founder\'s Accord',     description: 'Commemorating the signing of the Galactic Concordat that united the core systems.',                                      month: 0,  day: 15, type: 'historical', icon: 'ri-file-text-line',           color: '#d4a853', effects: 'Diplomacy actions cost 50% less' },
  { id: 'h-void-silence',    name: 'Void Silence',          description: 'A solemn day honoring those lost to the deep void — all combat ceases across the galaxy.',                               month: 0,  day: 28, type: 'galactic',   icon: 'ri-moon-clear-line',     color: '#6366f1', effects: 'No attacks possible for 6 game hours' },
  // ── Solara Holidays ──
  { id: 'h-solar-festival',  name: 'Solaris Festival',      description: 'The grand festival of light — cities glow with fusion lanterns and plasma fireworks.',                                   month: 1,  day: 10, type: 'seasonal',  icon: 'ri-sparkling-2-line',       color: '#f97316', effects: 'Energy production doubled for 12h' },
  { id: 'h-harvest-begin',   name: 'First Harvest',         description: 'The first resource harvest of the new year — miners work double shifts across the empire.',                             month: 1,  day: 22, type: 'seasonal',  icon: 'ri-plant-line',           color: '#10b981', effects: 'Metal and Crystal production +50% for 24h' },
  // ── Veridian ──
  { id: 'h-explorer-day',    name: 'Stargazer\'s Vigil',    description: 'Explorers and cartographers are celebrated — expedition success rates increase dramatically.',                           month: 2,  day: 7,  type: 'galactic',   icon: 'ri-compass-3-line',       color: '#06b6d4', effects: 'Expedition rewards doubled' },
  { id: 'h-nebula-bloom',    name: 'Nebula Bloom Festival', description: 'The outer rim nebulas reach peak luminescence — a galaxy-wide celebration of beauty and discovery.',                     month: 2,  day: 18, type: 'seasonal',  icon: 'ri-sparkling-line',       color: '#a78bfa', effects: 'All scanning ranges +40% for 24h' },
  // ── Luminar ──
  { id: 'h-binary-alignment',name: 'Binary Alignment',     description: 'Twin suns of the Helios system align perfectly — a rare astronomical event with spiritual significance.',               month: 3,  day: 4,  type: 'seasonal',  icon: 'ri-sun-line',              color: '#fbbf24', effects: 'Solar collector output tripled for 6h' },
  { id: 'h-light-pilgrimage',name: 'Pilgrimage of Light',  description: 'Pilgrims travel to the Luminous Shrine on Helios IV — travel routes are congested galaxy-wide.',                       month: 3,  day: 25, type: 'religious', icon: 'ri-route-line',            color: '#f59e0b', effects: 'Trade route income +30% for 48h' },
  // ── Crystallis ──
  { id: 'h-crystal-rush',    name: 'Crystal Convergence',   description: 'Rare crystal formations appear across all mining worlds — a frantic resource rush begins.',                            month: 4,  day: 5,  type: 'seasonal',  icon: 'ri-vip-diamond-line',      color: '#7c3aed', effects: 'Crystal production tripled for 18h' },
  { id: 'h-artisan-day',     name: 'Artisan\'s Jubilee',    description: 'Master crafters showcase their finest works — crafting success rates soar.',                                         month: 4,  day: 20, type: 'galactic',   icon: 'ri-hammer-line',           color: '#d946ef', effects: 'Crafting time halved, quality +25% for 24h' },
  // ── Pyronis ──
  { id: 'h-ignition-day',    name: 'The Great Ignition',    description: 'Core worlds celebrate the volcanic season — forge worlds run at maximum capacity.',                                     month: 5,  day: 1,  type: 'seasonal',  icon: 'ri-fire-line',             color: '#ef4444', effects: 'Ship build speed +40% for 24h' },
  { id: 'h-war-memorial',    name: 'Remembrance of Flames', description: 'Honoring the billions lost in the Pyronis Sector Wars — a day of reflection and military parades.',                     month: 5,  day: 15, type: 'historical', icon: 'ri-user-heart-line',       color: '#f87171', effects: 'All units gain +15% combat power for 12h' },
  // ── Ferrunox ──
  { id: 'h-forge-festival',  name: 'Forge Festival',        description: 'The great industrial celebration — factories run non-stop, shipyards operate at 150% efficiency.',                    month: 6,  day: 8,  type: 'galactic',   icon: 'ri-tools-line',            color: '#f97316', effects: 'All construction times -30% for 24h' },
  { id: 'h-iron-pact',       name: 'Iron Pact Day',         description: 'Anniversary of the treaty that ended the Metalloid Wars — alliances renew their bonds.',                              month: 6,  day: 22, type: 'historical', icon: 'ri-shake-hands-line',      color: '#d4a853', effects: 'Alliance bonuses doubled for 24h' },
  // ── Nocturnis ──
  { id: 'h-shadow-market',   name: 'Shadow Market',         description: 'During the dark season, the black market flourishes — rare items appear at discounted prices.',                        month: 7,  day: 13, type: 'seasonal',  icon: 'ri-moon-foggy-line',       color: '#6366f1', effects: 'Black market prices -40%, rare items +200% stock' },
  { id: 'h-veil-night',      name: 'Night of the Veil',     description: 'The darkest night of the year — espionage and covert operations become significantly more effective.',               month: 7,  day: 27, type: 'seasonal',  icon: 'ri-eye-off-line',          color: '#8b5cf6', effects: 'Espionage success +35%, detection -50% for 12h' },
  // ── Zephyron ──
  { id: 'h-wind-festival',   name: 'Zephyr Winds Festival', description: 'Interstellar currents reach peak velocity — fleet races are held across the galaxy.',                                   month: 8,  day: 5,  type: 'seasonal',  icon: 'ri-windy-line',            color: '#14b8a6', effects: 'All fleet speed +25% for 48h' },
  { id: 'h-migration-day',   name: 'Great Migration',       description: 'Mass colony ship launches — colonists seek new worlds during the favorable winds.',                                    month: 8,  day: 18, type: 'seasonal',  icon: 'ri-rocket-2-line',         color: '#06b6d4', effects: 'Colonization cost -50% for 24h' },
  // ── Glaciara ──
  { id: 'h-frost-festival',  name: 'Frostheart Festival',   description: 'Ice worlds host grand winter celebrations — unique cryogenic-enhanced food and drink flow freely.',                   month: 9,  day: 10, type: 'seasonal',  icon: 'ri-snowflake-line',        color: '#0ea5e9', effects: 'Population growth +50% for 24h' },
  { id: 'h-cryo-remembrance',name: 'Cryo Remembrance',      description: 'Honoring those in cryosleep awaiting cures — research labs report breakthrough rates increase.',                     month: 9,  day: 25, type: 'historical', icon: 'ri-heart-pulse-line',      color: '#38bdf8', effects: 'Research speed +35% for 24h' },
  // ── Umbron ──
  { id: 'h-shadow-war',      name: 'Shadow War Anniversary',description: 'Marking the darkest conflict in galactic history — the Umbral Crusade that reshaped the outer sectors.',              month: 10, day: 6,  type: 'historical', icon: 'ri-sword-line',            color: '#8b5cf6', effects: 'Weapon damage +20% for 12h' },
  { id: 'h-convergence-eve', name: 'Convergence Eve',       description: 'The night before the Great Convergence — mysterious energy spikes occur randomly across the galaxy.',                   month: 10, day: 29, type: 'galactic',   icon: 'ri-star-line',             color: '#d946ef', effects: 'Random bonus events trigger every hour for 24h' },
  // ── Aethereon ──
  { id: 'h-convergence',     name: 'The Great Convergence', description: 'All celestial bodies align in a once-per-cycle cosmic event — maximum energy flows across every leyline in the galaxy.',month: 11, day: 1,  type: 'galactic',   icon: 'ri-planet-line',           color: '#d946ef', effects: 'ALL production +100%, ALL speeds +50% for 12h' },
  { id: 'h-year-end',        name: 'Void\'s End Gala',      description: 'The grand finale — empires hold massive celebrations as the cosmic cycle begins anew.',                                month: 11, day: 30, type: 'galactic',   icon: 'ri-sparkling-2-line',        color: '#f59e0b', effects: 'Special year-end rewards distributed to all players' },
];

/** Upcoming or recurring celestial events tied to specific Sol days */
export interface CelestialEvent {
  id: string;
  name: string;
  description: string;
  solDayRange: [number, number];  // sol day range (1-360) when active
  type: 'solar_flare' | 'meteor_shower' | 'nebula_surge' | 'quantum_anomaly' | 'dark_matter_tide' | 'planetary_alignment' | 'void_rift';
  icon: string;
  color: string;
  severity: 'low' | 'moderate' | 'high' | 'extreme';
  effects: string;
  gameplayModifiers?: {
    resourceBonus?: Partial<Record<string, number>>;
    fleetSpeedMod?: number;
    combatMod?: number;
    researchMod?: number;
    buildMod?: number;
  };
}

export const CELESTIAL_EVENTS: CelestialEvent[] = [
  // ── Solar Flare Events ──
  {
    id: 'ce-solar-flare-minor',   name: 'Minor Solar Flare',   description: 'Routine solar activity — communication disruptions are minimal across inner systems.',
    solDayRange: [20, 25], type: 'solar_flare', icon: 'ri-sun-line', color: '#f59e0b', severity: 'low',
    effects: 'Energy grids fluctuate slightly — +5% energy production, -2% shield strength',
    gameplayModifiers: { resourceBonus: { energy: 5 }, combatMod: 0.98 },
  },
  {
    id: 'ce-solar-flare-major',   name: 'Major Solar Storm',   description: 'A CME-class event — shields flicker, scanners glitch, and the brave venture out for rare particle harvesting.',
    solDayRange: [85, 92], type: 'solar_flare', icon: 'ri-sun-foggy-line', color: '#f97316', severity: 'high',
    effects: 'Shields -15%, scanning -30%, but rare particles spawn in debris fields',
    gameplayModifiers: { resourceBonus: { dark_matter: 15 }, combatMod: 0.85, fleetSpeedMod: 0.9 },
  },
  {
    id: 'ce-solar-flare-cataclysmic', name: 'Cataclysmic Solar Eruption', description: 'A once-per-cycle mega-flare — entire sectors go dark. Only the most shielded vessels can navigate.',
    solDayRange: [330, 340], type: 'solar_flare', icon: 'ri-fire-line', color: '#ef4444', severity: 'extreme',
    effects: 'Shields -50%, all communications jammed. BUT: Dark Matter spawns x5 across all systems.',
    gameplayModifiers: { resourceBonus: { dark_matter: 50, antimatter: 25 }, combatMod: 0.65, fleetSpeedMod: 0.6 },
  },
  // ── Meteor Showers ──
  {
    id: 'ce-crystal-shower',      name: 'Crystallid Meteor Shower', description: 'A dazzling display of crystal-laden asteroids — debris fields fill with precious resources.',
    solDayRange: [95, 105], type: 'meteor_shower', icon: 'ri-meteor-line', color: '#a78bfa', severity: 'moderate',
    effects: 'Debris fields spawn x3 crystal — harvesters work overtime',
    gameplayModifiers: { resourceBonus: { crystal: 30 } },
  },
  {
    id: 'ce-iron-rain',           name: 'Iron Rain',              description: 'Dense metallic meteors bombard outer sectors — a windfall for metal production empires.',
    solDayRange: [185, 195], type: 'meteor_shower', icon: 'ri-meteor-fill', color: '#d4a853', severity: 'moderate',
    effects: 'Metal production +40% — debris fields rich in metal alloys',
    gameplayModifiers: { resourceBonus: { metal: 40 } },
  },
  // ── Nebula Surges ──
  {
    id: 'ce-nebula-verdant',      name: 'Verdant Nebula Surge',   description: 'The Veridian Nebula pulses with exotic energy — research labs report unprecedented discoveries.',
    solDayRange: [55, 65], type: 'nebula_surge', icon: 'ri-sparkling-line', color: '#10b981', severity: 'moderate',
    effects: 'Research speed +40%, rare technology discoveries +25%',
    gameplayModifiers: { researchMod: 1.4 },
  },
  {
    id: 'ce-nebula-crimson',      name: 'Crimson Nebula Surge',   description: 'A blood-red nebula sweeps through the core systems — combat instincts heighten across all species.',
    solDayRange: [155, 165], type: 'nebula_surge', icon: 'ri-fire-fill', color: '#ef4444', severity: 'high',
    effects: 'Combat power +25%, but ship hulls degrade 10% faster — offensive window',
    gameplayModifiers: { combatMod: 1.25 },
  },
  {
    id: 'ce-nebula-shadow',       name: 'Shadow Nebula Passage',  description: 'The Umbron Nebula passes through — stealth technology becomes hyper-effective.',
    solDayRange: [295, 305], type: 'nebula_surge', icon: 'ri-moon-foggy-line', color: '#8b5cf6', severity: 'high',
    effects: 'All ships gain stealth +50% — perfect for surprise attacks or covert ops',
    gameplayModifiers: { combatMod: 1.15, fleetSpeedMod: 1.1 },
  },
  // ── Quantum Anomalies ──
  {
    id: 'ce-quantum-tear',        name: 'Quantum Spacetime Tear', description: 'A localized tear in spacetime — jump drives malfunction but wormhole shortcuts appear between random sectors.',
    solDayRange: [130, 138], type: 'quantum_anomaly', icon: 'ri-focus-3-line', color: '#06b6d4', severity: 'extreme',
    effects: 'Random stargate connections form — fleet jumps cost 0 fuel but destination is unpredictable',
    gameplayModifiers: { fleetSpeedMod: 0.5 },
  },
  {
    id: 'ce-temporal-loop',       name: 'Temporal Loop Anomaly',  description: 'Time flows differently within the anomaly — production speed triples for those inside the affected zones.',
    solDayRange: [250, 260], type: 'quantum_anomaly', icon: 'ri-time-line', color: '#14b8a6', severity: 'high',
    effects: 'Building and research speeds +200% — but ships caught in the loop take 3x longer to arrive',
    gameplayModifiers: { buildMod: 3.0, researchMod: 3.0, fleetSpeedMod: 0.33 },
  },
  // ── Dark Matter Tides ──
  {
    id: 'ce-dark-tide-rising',    name: 'Dark Matter Tide — Rising', description: 'Dark matter density increases across all systems — mysterious, profitable, and dangerous.',
    solDayRange: [215, 225], type: 'dark_matter_tide', icon: 'ri-moon-line', color: '#6366f1', severity: 'moderate',
    effects: 'Dark matter production +60%, but ship shields fluctuate randomly',
    gameplayModifiers: { resourceBonus: { dark_matter: 60 } },
  },
  {
    id: 'ce-dark-tide-peak',      name: 'Dark Matter Tide — Peak',  description: 'Maximum dark matter saturation — legendary artifacts may spontaneously materialize.',
    solDayRange: [226, 235], type: 'dark_matter_tide', icon: 'ri-moon-fill', color: '#8b5cf6', severity: 'extreme',
    effects: 'Dark matter production +150%, rare artifact spawns — but enemy AI becomes more aggressive',
    gameplayModifiers: { resourceBonus: { dark_matter: 150, antimatter: 50 } },
  },
  // ── Planetary Alignments ──
  {
    id: 'ce-core-alignment',      name: 'Core Worlds Alignment',   description: 'The five core worlds align — political unity surges, alliance bonuses peak.',
    solDayRange: [42, 48], type: 'planetary_alignment', icon: 'ri-planet-line', color: '#fbbf24', severity: 'moderate',
    effects: 'Alliance bonuses +50%, diplomacy success +30%',
    gameplayModifiers: { combatMod: 1.1 },
  },
  {
    id: 'ce-void-alignment',      name: 'Void Gate Alignment',     description: 'Ancient void gates align — dormant stargates reactivate, connecting to unknown regions.',
    solDayRange: [310, 318], type: 'planetary_alignment', icon: 'ri-ancient-gate-line', color: '#d946ef', severity: 'extreme',
    effects: 'New stargate destinations unlock — expedition rewards x5',
    gameplayModifiers: { fleetSpeedMod: 1.5 },
  },
  // ── Void Rifts ──
  {
    id: 'ce-void-rift-minor',     name: 'Minor Void Rift',        description: 'A small tear opens to the void — strange creatures may cross over. Bounties increase.',
    solDayRange: [170, 178], type: 'void_rift', icon: 'ri-alert-line', color: '#f87171', severity: 'high',
    effects: 'Pirate and world boss spawn rates x3 — bounty rewards doubled',
    gameplayModifiers: { combatMod: 1.2 },
  },
  {
    id: 'ce-void-rift-major',     name: 'Major Void Incursion',   description: 'A catastrophic void breach — the galaxy mobilizes against an interdimensional invasion.',
    solDayRange: [345, 355], type: 'void_rift', icon: 'ri-alarm-warning-line', color: '#ef4444', severity: 'extreme',
    effects: 'Massive void fleets attack all sectors — coordinated defense yields legendary rewards',
    gameplayModifiers: { combatMod: 1.5 },
  },
];

/** Helper: get the month for a given sol day (1-360) */
export function getMonthForSolDay(solDay: number): CalendarMonth {
  const monthIndex = Math.min(Math.floor((solDay - 1) / 30), 11);
  return GALACTIC_MONTHS[monthIndex];
}

/** Helper: get the day within the current month (1-30) */
export function getDayInMonth(solDay: number): number {
  return ((solDay - 1) % 30) + 1;
}

/** Helper: get all holidays for a specific sol day */
export function getHolidaysForSolDay(solDay: number): CalendarHoliday[] {
  const month = Math.floor((solDay - 1) / 30);
  const day = ((solDay - 1) % 30) + 1;
  return GALACTIC_HOLIDAYS.filter(h => h.month === month && h.day === day);
}

/** Helper: get active celestial events for a given sol day */
export function getActiveCelestialEvents(solDay: number): CelestialEvent[] {
  return CELESTIAL_EVENTS.filter(ce => solDay >= ce.solDayRange[0] && solDay <= ce.solDayRange[1]);
}

/** Helper: get upcoming celestial events (starting within next N sol days) */
export function getUpcomingCelestialEvents(solDay: number, withinDays: number = 30): CelestialEvent[] {
  return CELESTIAL_EVENTS
    .filter(ce => ce.solDayRange[0] > solDay && ce.solDayRange[0] <= solDay + withinDays)
    .sort((a, b) => a.solDayRange[0] - b.solDayRange[0]);
}

/** Helper: get all holidays for a given month */
export function getHolidaysForMonth(monthIndex: number): CalendarHoliday[] {
  return GALACTIC_HOLIDAYS.filter(h => h.month === monthIndex);
}

/** Get the Sol day name for a given sol day */
export function getSolDayName(solDay: number): string {
  return SOL_DAY_NAMES[(solDay - 1) % 7];
}

/** Check if a sol day falls on a weekend (Solis or Lunaris — Sol days 1,8,15... or 2,9,16...) */
export function isWeekend(solDay: number): boolean {
  const dayOfWeek = (solDay - 1) % 7;
  return dayOfWeek === 0 || dayOfWeek === 1; // Solis or Lunaris
}

/** Get current season from sol day */
export function getSeason(solDay: number): Season {
  const monthIndex = Math.floor((solDay - 1) / 30);
  return GALACTIC_MONTHS[monthIndex].season;
}