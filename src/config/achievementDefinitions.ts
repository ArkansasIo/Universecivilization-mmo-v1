// ─── Achievement Definitions ──────────────────────────────────────────────────
// Single source of truth for all achievements.
// Each entry maps to one row in the `achievements` table.
// progress thresholds are cumulative totals.

export interface AchievementDef {
  id: string;              // achievement_id in DB
  name: string;            // achievement_name in DB
  description: string;
  category: 'building' | 'research' | 'combat' | 'fleet' | 'economy' | 'exploration';
  icon: string;            // Remix Icon class
  tiers: number[];         // progress thresholds for each tier (e.g. [1, 10, 50])
  tierNames: string[];     // label for each tier
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDef[] = [
  // ── BUILDING ───────────────────────────────────────────────────────────────
  {
    id: 'first_building',
    name: 'Stone & Steel',
    description: 'Construct your first building upgrade.',
    category: 'building',
    icon: 'ri-building-line',
    tiers: [1],
    tierNames: ['Apprentice Builder'],
  },
  {
    id: 'building_upgrades_10',
    name: 'Master Builder',
    description: 'Complete 10 building upgrades.',
    category: 'building',
    icon: 'ri-building-2-line',
    tiers: [10],
    tierNames: ['Master Builder'],
  },
  {
    id: 'building_upgrades_50',
    name: 'Architect of Worlds',
    description: 'Complete 50 building upgrades across your empire.',
    category: 'building',
    icon: 'ri-building-4-line',
    tiers: [50],
    tierNames: ['Grand Architect'],
  },
  {
    id: 'building_upgrades_200',
    name: 'Urban Planner',
    description: 'Complete 200 building upgrades.',
    category: 'building',
    icon: 'ri-community-line',
    tiers: [200],
    tierNames: ['Galactic Engineer'],
  },

  // ── RESEARCH ───────────────────────────────────────────────────────────────
  {
    id: 'first_research',
    name: 'Curious Mind',
    description: 'Complete your first research.',
    category: 'research',
    icon: 'ri-flask-line',
    tiers: [1],
    tierNames: ['Curious Mind'],
  },
  {
    id: 'research_5',
    name: 'Scientist',
    description: 'Complete 5 research projects.',
    category: 'research',
    icon: 'ri-microscope-line',
    tiers: [5],
    tierNames: ['Scientist'],
  },
  {
    id: 'research_20',
    name: 'Master Scientist',
    description: 'Complete 20 research projects.',
    category: 'research',
    icon: 'ri-test-tube-line',
    tiers: [20],
    tierNames: ['Master Scientist'],
  },
  {
    id: 'research_50',
    name: 'Galactic Scholar',
    description: 'Complete 50 research projects.',
    category: 'research',
    icon: 'ri-graduation-cap-line',
    tiers: [50],
    tierNames: ['Galactic Scholar'],
  },

  // ── COMBAT ─────────────────────────────────────────────────────────────────
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Win your first battle.',
    category: 'combat',
    icon: 'ri-sword-line',
    tiers: [1],
    tierNames: ['Warrior'],
  },
  {
    id: 'combat_wins_10',
    name: 'Battle Hardened',
    description: 'Win 10 battles.',
    category: 'combat',
    icon: 'ri-shield-cross-line',
    tiers: [10],
    tierNames: ['Battle Hardened'],
  },
  {
    id: 'combat_wins_50',
    name: 'Warlord',
    description: 'Win 50 battles.',
    category: 'combat',
    icon: 'ri-sword-line',
    tiers: [50],
    tierNames: ['Warlord'],
  },
  {
    id: 'combat_wins_200',
    name: 'Grand Marshal',
    description: 'Win 200 battles and dominate the galaxy.',
    category: 'combat',
    icon: 'ri-sword-fill',
    tiers: [200],
    tierNames: ['Grand Marshal'],
  },

  // ── FLEET ──────────────────────────────────────────────────────────────────
  {
    id: 'first_fleet',
    name: 'First Deployment',
    description: 'Send your first fleet on a mission.',
    category: 'fleet',
    icon: 'ri-rocket-line',
    tiers: [1],
    tierNames: ['Ensign'],
  },
  {
    id: 'fleet_missions_10',
    name: 'Fleet Commander',
    description: 'Complete 10 fleet missions.',
    category: 'fleet',
    icon: 'ri-rocket-2-line',
    tiers: [10],
    tierNames: ['Fleet Commander'],
  },
  {
    id: 'fleet_missions_50',
    name: 'Admiral',
    description: 'Complete 50 fleet missions.',
    category: 'fleet',
    icon: 'ri-navigation-line',
    tiers: [50],
    tierNames: ['Admiral'],
  },

  // ── ECONOMY ────────────────────────────────────────────────────────────────
  {
    id: 'plunder_100k',
    name: 'Plunderer',
    description: 'Plunder 100,000 total resources.',
    category: 'economy',
    icon: 'ri-treasure-map-line',
    tiers: [100000],
    tierNames: ['Plunderer'],
  },
  {
    id: 'plunder_1m',
    name: 'Galactic Raider',
    description: 'Plunder 1,000,000 total resources.',
    category: 'economy',
    icon: 'ri-coins-line',
    tiers: [1000000],
    tierNames: ['Galactic Raider'],
  },
];

// Flat lookup map by achievement_id
export const ACHIEVEMENT_MAP = Object.fromEntries(
  ACHIEVEMENT_DEFINITIONS.map(a => [a.id, a])
);