// ─────────────────────────────────────────────────────────────────────────────
// Universe-Empire-Dominions — 30 Universes × 10 Realm Systems = 300 Realms
// ─────────────────────────────────────────────────────────────────────────────

export type UniverseClass =
  | 'Standard'
  | 'Hardcore'
  | 'Peaceful'
  | 'Chaos'
  | 'Ancient'
  | 'Void'
  | 'Primordial'
  | 'Quantum'
  | 'Temporal'
  | 'Mythic';

export type RealmType =
  | 'Core'
  | 'Frontier'
  | 'Contested'
  | 'Sanctuary'
  | 'Warzone'
  | 'Nexus'
  | 'Void Rift'
  | 'Ancient Ruins'
  | 'Resource Hub'
  | 'Dimensional Gate';

export type SecurityLevel = 'High' | 'Medium' | 'Low' | 'Null' | 'Anomalous';

export interface RealmSystem {
  id: string;
  name: string;
  type: RealmType;
  security: SecurityLevel;
  galaxyCount: number;
  starSystemCount: number;
  planetCount: number;
  playerCount: number;
  dominantFaction: string;
  resources: {
    metal: 'Scarce' | 'Low' | 'Normal' | 'Rich' | 'Abundant';
    crystal: 'Scarce' | 'Low' | 'Normal' | 'Rich' | 'Abundant';
    deuterium: 'Scarce' | 'Low' | 'Normal' | 'Rich' | 'Abundant';
    darkMatter: 'None' | 'Trace' | 'Present' | 'Rich' | 'Overflowing';
    exoticMatter: 'None' | 'Trace' | 'Present' | 'Rich' | 'Overflowing';
  };
  specialFeatures: string[];
  threatLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  description: string;
  color: string;
  icon: string;
  isOpen: boolean;
  maxPlayers: number;
  speed: number;
  fleetSpeed: number;
  researchSpeed: number;
}

export interface UniverseData {
  id: string;
  name: string;
  class: UniverseClass;
  seed: number;
  description: string;
  color: string;
  accentColor: string;
  image: string;
  totalPlayers: number;
  maxPlayers: number;
  isActive: boolean;
  launchDate: string;
  age: 'New' | 'Young' | 'Mature' | 'Ancient' | 'Primordial';
  characteristics: {
    density: 'Sparse' | 'Normal' | 'Dense' | 'Packed';
    hostility: 'Peaceful' | 'Moderate' | 'Dangerous' | 'Extreme';
    resources: 'Scarce' | 'Normal' | 'Abundant' | 'Infinite';
    technology: 'Primitive' | 'Standard' | 'Advanced' | 'Transcendent';
  };
  realms: RealmSystem[];
}

// ─── Faction names pool ───────────────────────────────────────────────────────
const FACTIONS = [
  'Terran Dominion', 'Void Collective', 'Stellar Imperium', 'Nexus Syndicate',
  'Ancient Order', 'Quantum Conclave', 'Iron Legion', 'Crystal Covenant',
  'Shadow Pact', 'Solar Alliance', 'Nebula Consortium', 'Rift Walkers',
  'Eternal Empire', 'Chaos Brotherhood', 'Primordial Council', 'Nova Republic',
  'Dark Matter Cult', 'Temporal Guardians', 'Cosmic Federation', 'Void Hunters',
  'Galactic Union', 'Star Forge Guild', 'Dimensional Wardens', 'Plasma Syndicate',
  'Antimatter Sect', 'Celestial Order', 'Rogue Collective', 'Titan Alliance',
  'Phantom Fleet', 'Omega Dominion'
];

// ─── 30 Universes with 10 Realms each ────────────────────────────────────────
export const universeData: UniverseData[] = [
  // ── UNIVERSE 1 ──────────────────────────────────────────────────────────────
  {
    id: 'u1',
    name: 'Alpha Prime',
    class: 'Standard',
    seed: 42069,
    description: 'The original universe. Balanced gameplay with all features available. Perfect for new commanders learning the ropes.',
    color: '#00d4ff',
    accentColor: '#0891b2',
    image: 'https://readdy.ai/api/search-image?query=spiral%20galaxy%20with%20blue%20cyan%20tones%20balanced%20star%20distribution%20cosmic%20dust%20nebula%20deep%20space%20astronomy%20photography%20ultra%20detailed&width=800&height=450&seq=u1bg&orientation=landscape',
    totalPlayers: 48291,
    maxPlayers: 100000,
    isActive: true,
    launchDate: '2024-01-15',
    age: 'Mature',
    characteristics: { density: 'Normal', hostility: 'Moderate', resources: 'Normal', technology: 'Standard' },
    realms: [
      { id: 'u1-r1', name: 'Core Nexus', type: 'Core', security: 'High', galaxyCount: 12, starSystemCount: 1200, planetCount: 8400, playerCount: 8200, dominantFaction: FACTIONS[0], resources: { metal: 'Normal', crystal: 'Normal', deuterium: 'Normal', darkMatter: 'Trace', exoticMatter: 'None' }, specialFeatures: ['Starter Zone', 'Tutorial Available', 'Protected Spawn'], threatLevel: 2, description: 'The safe heart of Alpha Prime. New commanders begin their journey here under the protection of the Terran Dominion.', color: '#00d4ff', icon: 'ri-focus-3-line', isOpen: true, maxPlayers: 15000, speed: 1, fleetSpeed: 1, researchSpeed: 1 },
      { id: 'u1-r2', name: 'Frontier Expanse', type: 'Frontier', security: 'Medium', galaxyCount: 18, starSystemCount: 2100, planetCount: 14700, playerCount: 6100, dominantFaction: FACTIONS[1], resources: { metal: 'Rich', crystal: 'Normal', deuterium: 'Low', darkMatter: 'Trace', exoticMatter: 'None' }, specialFeatures: ['Expansion Zone', 'Colonization Bonus', 'Trade Routes'], threatLevel: 4, description: 'Vast unexplored territories rich in metal deposits. Brave commanders push the boundaries of known space.', color: '#38bdf8', icon: 'ri-compass-3-line', isOpen: true, maxPlayers: 12000, speed: 1, fleetSpeed: 1.2, researchSpeed: 1 },
      { id: 'u1-r3', name: 'Contested Badlands', type: 'Contested', security: 'Low', galaxyCount: 15, starSystemCount: 1800, planetCount: 12600, playerCount: 5400, dominantFaction: FACTIONS[2], resources: { metal: 'Abundant', crystal: 'Rich', deuterium: 'Normal', darkMatter: 'Present', exoticMatter: 'Trace' }, specialFeatures: ['PvP Zone', 'Resource Wars', 'Alliance Battles'], threatLevel: 7, description: 'Fierce battles rage over resource-rich systems. Only the strongest alliances survive here.', color: '#f87171', icon: 'ri-sword-line', isOpen: true, maxPlayers: 10000, speed: 2, fleetSpeed: 1.5, researchSpeed: 1.5 },
      { id: 'u1-r4', name: 'Crystal Sanctuary', type: 'Sanctuary', security: 'High', galaxyCount: 8, starSystemCount: 960, planetCount: 6720, playerCount: 3200, dominantFaction: FACTIONS[3], resources: { metal: 'Low', crystal: 'Abundant', deuterium: 'Normal', darkMatter: 'None', exoticMatter: 'None' }, specialFeatures: ['No PvP', 'Research Bonus +50%', 'Crystal Formations'], threatLevel: 1, description: 'A peaceful realm dedicated to scientific advancement. Crystal formations amplify research capabilities.', color: '#a78bfa', icon: 'ri-flask-line', isOpen: true, maxPlayers: 8000, speed: 1, fleetSpeed: 1, researchSpeed: 2 },
      { id: 'u1-r5', name: 'Void Rift Alpha', type: 'Void Rift', security: 'Null', galaxyCount: 6, starSystemCount: 720, planetCount: 5040, playerCount: 1800, dominantFaction: FACTIONS[4], resources: { metal: 'Scarce', crystal: 'Scarce', deuterium: 'Rich', darkMatter: 'Overflowing', exoticMatter: 'Rich' }, specialFeatures: ['Dark Matter Storms', 'Void Entities', 'Dimensional Tears'], threatLevel: 9, description: 'Reality tears open here. Dark matter floods the void, attracting the most dangerous entities in the universe.', color: '#7c3aed', icon: 'ri-ghost-line', isOpen: true, maxPlayers: 5000, speed: 3, fleetSpeed: 2, researchSpeed: 2 },
      { id: 'u1-r6', name: 'Warzone Sigma', type: 'Warzone', security: 'Null', galaxyCount: 20, starSystemCount: 2400, planetCount: 16800, playerCount: 7600, dominantFaction: FACTIONS[5], resources: { metal: 'Abundant', crystal: 'Abundant', deuterium: 'Rich', darkMatter: 'Present', exoticMatter: 'Present' }, specialFeatures: ['Permanent War', 'Alliance Wars', 'Conquest Points'], threatLevel: 10, description: 'The eternal battleground. Alliances clash for dominance in this resource-rich warzone.', color: '#ef4444', icon: 'ri-alarm-warning-line', isOpen: true, maxPlayers: 15000, speed: 4, fleetSpeed: 2, researchSpeed: 2 },
      { id: 'u1-r7', name: 'Ancient Ruins Sector', type: 'Ancient Ruins', security: 'Low', galaxyCount: 10, starSystemCount: 1200, planetCount: 8400, playerCount: 2900, dominantFaction: FACTIONS[6], resources: { metal: 'Normal', crystal: 'Rich', deuterium: 'Low', darkMatter: 'Present', exoticMatter: 'Rich' }, specialFeatures: ['Ancient Artifacts', 'Ruin Exploration', 'Tech Discoveries'], threatLevel: 6, description: 'Remnants of a civilization billions of years old. Ancient technology awaits those brave enough to explore.', color: '#d97706', icon: 'ri-ancient-gate-line', isOpen: true, maxPlayers: 8000, speed: 1, fleetSpeed: 1, researchSpeed: 3 },
      { id: 'u1-r8', name: 'Resource Hub Omega', type: 'Resource Hub', security: 'Medium', galaxyCount: 14, starSystemCount: 1680, planetCount: 11760, playerCount: 5100, dominantFaction: FACTIONS[7], resources: { metal: 'Abundant', crystal: 'Abundant', deuterium: 'Abundant', darkMatter: 'Trace', exoticMatter: 'None' }, specialFeatures: ['Trade Bonus +100%', 'Mining Bonus +75%', 'Market Hub'], threatLevel: 3, description: 'The economic heart of Alpha Prime. Trade routes converge here, making it the wealthiest realm.', color: '#4ade80', icon: 'ri-store-2-line', isOpen: true, maxPlayers: 12000, speed: 1, fleetSpeed: 1, researchSpeed: 1 },
      { id: 'u1-r9', name: 'Nexus Gate Prime', type: 'Nexus', security: 'Medium', galaxyCount: 9, starSystemCount: 1080, planetCount: 7560, playerCount: 4200, dominantFaction: FACTIONS[8], resources: { metal: 'Normal', crystal: 'Normal', deuterium: 'Rich', darkMatter: 'Present', exoticMatter: 'Present' }, specialFeatures: ['Stargate Network Hub', 'Fast Travel', 'Dimensional Access'], threatLevel: 5, description: 'The crossroads of Alpha Prime. Stargates connect all realms, making this the most strategically vital location.', color: '#f59e0b', icon: 'ri-focus-2-line', isOpen: true, maxPlayers: 10000, speed: 2, fleetSpeed: 3, researchSpeed: 1.5 },
      { id: 'u1-r10', name: 'Dimensional Gate Zero', type: 'Dimensional Gate', security: 'Anomalous', galaxyCount: 5, starSystemCount: 600, planetCount: 4200, playerCount: 1290, dominantFaction: FACTIONS[9], resources: { metal: 'Scarce', crystal: 'Scarce', deuterium: 'Scarce', darkMatter: 'Overflowing', exoticMatter: 'Overflowing' }, specialFeatures: ['Cross-Universe Travel', 'Dimensional Entities', 'Reality Instability'], threatLevel: 10, description: 'A gateway to other universes. Reality itself is unstable here, but the rewards for surviving are beyond imagination.', color: '#ec4899', icon: 'ri-door-open-line', isOpen: true, maxPlayers: 3000, speed: 5, fleetSpeed: 5, researchSpeed: 5 },
    ],
  },

  // ── UNIVERSE 2 ──────────────────────────────────────────────────────────────
  {
    id: 'u2',
    name: 'Omega Void',
    class: 'Hardcore',
    seed: 13337,
    description: 'Extreme difficulty. Sparse resources, ancient threats, and void anomalies make this universe only for veteran commanders.',
    color: '#7c3aed',
    accentColor: '#5b21b6',
    image: 'https://readdy.ai/api/search-image?query=dark%20void%20universe%20sparse%20stars%20purple%20black%20deep%20space%20cosmic%20horror%20empty%20galaxy%20far%20away&width=800&height=450&seq=u2bg&orientation=landscape',
    totalPlayers: 12847,
    maxPlayers: 50000,
    isActive: true,
    launchDate: '2024-03-01',
    age: 'Ancient',
    characteristics: { density: 'Sparse', hostility: 'Extreme', resources: 'Scarce', technology: 'Advanced' },
    realms: [
      { id: 'u2-r1', name: 'Void Entry Point', type: 'Core', security: 'Low', galaxyCount: 5, starSystemCount: 500, planetCount: 3000, playerCount: 3200, dominantFaction: FACTIONS[1], resources: { metal: 'Low', crystal: 'Low', deuterium: 'Scarce', darkMatter: 'Present', exoticMatter: 'Trace' }, specialFeatures: ['Hardcore Mode', 'Permadeath Risk', 'Void Storms'], threatLevel: 6, description: 'The entry point into the Omega Void. Even the safest zone here is more dangerous than most warzones.', color: '#7c3aed', icon: 'ri-focus-3-line', isOpen: true, maxPlayers: 8000, speed: 2, fleetSpeed: 1.5, researchSpeed: 1.5 },
      { id: 'u2-r2', name: 'Ancient Graveyard', type: 'Ancient Ruins', security: 'Null', galaxyCount: 8, starSystemCount: 800, planetCount: 4800, playerCount: 1800, dominantFaction: FACTIONS[4], resources: { metal: 'Scarce', crystal: 'Rich', deuterium: 'Scarce', darkMatter: 'Rich', exoticMatter: 'Rich' }, specialFeatures: ['Dead Civilizations', 'Artifact Hunting', 'Ghost Fleets'], threatLevel: 9, description: 'Billions of years of dead civilizations. Their ruins hold unimaginable technology — if you can survive long enough to claim it.', color: '#d97706', icon: 'ri-ancient-gate-line', isOpen: true, maxPlayers: 5000, speed: 2, fleetSpeed: 1, researchSpeed: 4 },
      { id: 'u2-r3', name: 'Void Abyss', type: 'Void Rift', security: 'Null', galaxyCount: 4, starSystemCount: 400, planetCount: 2400, playerCount: 890, dominantFaction: FACTIONS[9], resources: { metal: 'None' as 'Scarce', crystal: 'Scarce', deuterium: 'Scarce', darkMatter: 'Overflowing', exoticMatter: 'Overflowing' }, specialFeatures: ['Void Entities', 'Reality Collapse', 'Extreme Danger'], threatLevel: 10, description: 'The deepest void in the universe. Void entities patrol these empty expanses, hunting any who dare enter.', color: '#1e1b4b', icon: 'ri-ghost-line', isOpen: true, maxPlayers: 2000, speed: 3, fleetSpeed: 2, researchSpeed: 3 },
      { id: 'u2-r4', name: 'Scarce Frontier', type: 'Frontier', security: 'Low', galaxyCount: 10, starSystemCount: 1000, planetCount: 6000, playerCount: 2100, dominantFaction: FACTIONS[2], resources: { metal: 'Low', crystal: 'Low', deuterium: 'Low', darkMatter: 'Trace', exoticMatter: 'None' }, specialFeatures: ['Resource Scarcity', 'Survival Mode', 'Harsh Conditions'], threatLevel: 7, description: 'Vast empty space with barely enough resources to survive. Only the most efficient commanders thrive here.', color: '#6b7280', icon: 'ri-compass-3-line', isOpen: true, maxPlayers: 6000, speed: 2, fleetSpeed: 1.5, researchSpeed: 1.5 },
      { id: 'u2-r5', name: 'Anomaly Cluster', type: 'Contested', security: 'Anomalous', galaxyCount: 6, starSystemCount: 600, planetCount: 3600, playerCount: 1200, dominantFaction: FACTIONS[5], resources: { metal: 'Normal', crystal: 'Normal', deuterium: 'Rich', darkMatter: 'Present', exoticMatter: 'Present' }, specialFeatures: ['Spatial Anomalies', 'Random Events', 'Unstable Physics'], threatLevel: 8, description: 'Physics breaks down here. Spatial anomalies warp space, creating unpredictable combat conditions.', color: '#ec4899', icon: 'ri-error-warning-line', isOpen: true, maxPlayers: 4000, speed: 3, fleetSpeed: 2, researchSpeed: 2 },
      { id: 'u2-r6', name: 'Void Warzone', type: 'Warzone', security: 'Null', galaxyCount: 12, starSystemCount: 1200, planetCount: 7200, playerCount: 1900, dominantFaction: FACTIONS[6], resources: { metal: 'Rich', crystal: 'Rich', deuterium: 'Normal', darkMatter: 'Present', exoticMatter: 'Present' }, specialFeatures: ['Void Combat', 'Alliance Supremacy', 'Void Weapons'], threatLevel: 10, description: 'The most brutal warzone in any universe. Void-enhanced weapons tear through shields like paper.', color: '#dc2626', icon: 'ri-alarm-warning-line', isOpen: true, maxPlayers: 8000, speed: 4, fleetSpeed: 2.5, researchSpeed: 2 },
      { id: 'u2-r7', name: 'Neutron Graveyard', type: 'Void Rift', security: 'Null', galaxyCount: 3, starSystemCount: 300, planetCount: 1800, playerCount: 450, dominantFaction: FACTIONS[7], resources: { metal: 'Scarce', crystal: 'Scarce', deuterium: 'Abundant', darkMatter: 'Rich', exoticMatter: 'Overflowing' }, specialFeatures: ['Neutron Stars', 'Radiation Zones', 'Exotic Matter Deposits'], threatLevel: 10, description: 'A graveyard of neutron stars. Lethal radiation fills the void, but exotic matter deposits make it worth the risk.', color: '#0f172a', icon: 'ri-star-line', isOpen: true, maxPlayers: 1500, speed: 3, fleetSpeed: 2, researchSpeed: 3 },
      { id: 'u2-r8', name: 'Void Sanctuary', type: 'Sanctuary', security: 'Medium', galaxyCount: 7, starSystemCount: 700, planetCount: 4200, playerCount: 1600, dominantFaction: FACTIONS[8], resources: { metal: 'Normal', crystal: 'Normal', deuterium: 'Normal', darkMatter: 'Trace', exoticMatter: 'None' }, specialFeatures: ['Void Refuge', 'Research Bonus', 'Protected Zone'], threatLevel: 3, description: 'A rare pocket of stability in the Omega Void. Commanders gather here to regroup and research.', color: '#0891b2', icon: 'ri-shield-line', isOpen: true, maxPlayers: 5000, speed: 1, fleetSpeed: 1, researchSpeed: 2 },
      { id: 'u2-r9', name: 'Dark Matter Sea', type: 'Resource Hub', security: 'Low', galaxyCount: 9, starSystemCount: 900, planetCount: 5400, playerCount: 1100, dominantFaction: FACTIONS[0], resources: { metal: 'Low', crystal: 'Low', deuterium: 'Low', darkMatter: 'Overflowing', exoticMatter: 'Rich' }, specialFeatures: ['Dark Matter Harvesting', 'Exotic Upgrades', 'Void Tech'], threatLevel: 7, description: 'Seas of dark matter flow between the sparse stars. Those who master dark matter harvesting gain incredible power.', color: '#4c1d95', icon: 'ri-drop-line', isOpen: true, maxPlayers: 4000, speed: 2, fleetSpeed: 1.5, researchSpeed: 2 },
      { id: 'u2-r10', name: 'Omega Gate', type: 'Dimensional Gate', security: 'Anomalous', galaxyCount: 2, starSystemCount: 200, planetCount: 1200, playerCount: 607, dominantFaction: FACTIONS[3], resources: { metal: 'Scarce', crystal: 'Scarce', deuterium: 'Scarce', darkMatter: 'Overflowing', exoticMatter: 'Overflowing' }, specialFeatures: ['Omega Dimension', 'Reality Collapse', 'Ultimate Challenge'], threatLevel: 10, description: 'The Omega Gate leads to dimensions beyond comprehension. Only the most powerful commanders in the void dare approach.', color: '#7c3aed', icon: 'ri-door-open-line', isOpen: false, maxPlayers: 1000, speed: 5, fleetSpeed: 5, researchSpeed: 5 },
    ],
  },

  // ── UNIVERSE 3 ──────────────────────────────────────────────────────────────
  {
    id: 'u3',
    name: 'Genesis Cluster',
    class: 'Peaceful',
    seed: 77777,
    description: 'A young, resource-rich universe perfect for builders and traders. Rapid expansion with minimal conflict.',
    color: '#4ade80',
    accentColor: '#16a34a',
    image: 'https://readdy.ai/api/search-image?query=young%20vibrant%20green%20teal%20galaxy%20with%20abundant%20star%20formation%20nebula%20clouds%20rich%20cosmic%20environment%20new%20universe%20birth&width=800&height=450&seq=u3bg&orientation=landscape',
    totalPlayers: 67432,
    maxPlayers: 150000,
    isActive: true,
    launchDate: '2024-02-01',
    age: 'Young',
    characteristics: { density: 'Packed', hostility: 'Peaceful', resources: 'Abundant', technology: 'Standard' },
    realms: [
      { id: 'u3-r1', name: 'Genesis Core', type: 'Core', security: 'High', galaxyCount: 20, starSystemCount: 3000, planetCount: 21000, playerCount: 12000, dominantFaction: FACTIONS[10], resources: { metal: 'Abundant', crystal: 'Abundant', deuterium: 'Rich', darkMatter: 'None', exoticMatter: 'None' }, specialFeatures: ['Rapid Growth', 'Builder Bonus +100%', 'Peaceful Zone'], threatLevel: 1, description: 'The birthplace of the Genesis Cluster. Resources overflow and new stars form daily.', color: '#4ade80', icon: 'ri-seedling-line', isOpen: true, maxPlayers: 20000, speed: 2, fleetSpeed: 1, researchSpeed: 2 },
      { id: 'u3-r2', name: 'Star Nursery', type: 'Sanctuary', security: 'High', galaxyCount: 15, starSystemCount: 2250, planetCount: 15750, playerCount: 8900, dominantFaction: FACTIONS[11], resources: { metal: 'Rich', crystal: 'Rich', deuterium: 'Abundant', darkMatter: 'None', exoticMatter: 'None' }, specialFeatures: ['New Star Formation', 'Planet Seeding', 'Life Emergence'], threatLevel: 1, description: 'New stars are born here every day. The energy from stellar formation powers incredible production rates.', color: '#fbbf24', icon: 'ri-sun-line', isOpen: true, maxPlayers: 15000, speed: 2, fleetSpeed: 1, researchSpeed: 2 },
      { id: 'u3-r3', name: 'Expansion Frontier', type: 'Frontier', security: 'Medium', galaxyCount: 25, starSystemCount: 3750, planetCount: 26250, playerCount: 11200, dominantFaction: FACTIONS[12], resources: { metal: 'Abundant', crystal: 'Rich', deuterium: 'Rich', darkMatter: 'Trace', exoticMatter: 'None' }, specialFeatures: ['Colonization Rush', 'Territory Bonus', 'Rapid Expansion'], threatLevel: 2, description: 'Endless new territories to claim. The colonization rush is in full swing as empires race to expand.', color: '#34d399', icon: 'ri-compass-3-line', isOpen: true, maxPlayers: 18000, speed: 2, fleetSpeed: 1.5, researchSpeed: 1.5 },
      { id: 'u3-r4', name: 'Trade Paradise', type: 'Resource Hub', security: 'High', galaxyCount: 18, starSystemCount: 2700, planetCount: 18900, playerCount: 9800, dominantFaction: FACTIONS[13], resources: { metal: 'Abundant', crystal: 'Abundant', deuterium: 'Abundant', darkMatter: 'None', exoticMatter: 'None' }, specialFeatures: ['Trade Bonus +200%', 'Market Stability', 'Economic Paradise'], threatLevel: 1, description: 'The wealthiest realm in the Genesis Cluster. Trade routes crisscross the entire realm, generating enormous wealth.', color: '#f59e0b', icon: 'ri-store-2-line', isOpen: true, maxPlayers: 15000, speed: 1, fleetSpeed: 1, researchSpeed: 1 },
      { id: 'u3-r5', name: 'Research Haven', type: 'Sanctuary', security: 'High', galaxyCount: 12, starSystemCount: 1800, planetCount: 12600, playerCount: 6700, dominantFaction: FACTIONS[14], resources: { metal: 'Normal', crystal: 'Abundant', deuterium: 'Rich', darkMatter: 'Trace', exoticMatter: 'Trace' }, specialFeatures: ['Research Bonus +150%', 'Tech Sharing', 'Science Guilds'], threatLevel: 1, description: 'The scientific capital of the Genesis Cluster. Research institutions share discoveries freely.', color: '#818cf8', icon: 'ri-flask-line', isOpen: true, maxPlayers: 12000, speed: 1, fleetSpeed: 1, researchSpeed: 3 },
      { id: 'u3-r6', name: 'Contested Bloom', type: 'Contested', security: 'Low', galaxyCount: 16, starSystemCount: 2400, planetCount: 16800, playerCount: 7300, dominantFaction: FACTIONS[15], resources: { metal: 'Abundant', crystal: 'Abundant', deuterium: 'Abundant', darkMatter: 'Present', exoticMatter: 'Trace' }, specialFeatures: ['Resource Wars', 'Territory Control', 'Alliance Battles'], threatLevel: 5, description: 'Even in peaceful Genesis, some realms become contested. The richest territories attract the most conflict.', color: '#fb923c', icon: 'ri-sword-line', isOpen: true, maxPlayers: 12000, speed: 2, fleetSpeed: 1.5, researchSpeed: 1.5 },
      { id: 'u3-r7', name: 'Crystal Gardens', type: 'Sanctuary', security: 'High', galaxyCount: 10, starSystemCount: 1500, planetCount: 10500, playerCount: 5200, dominantFaction: FACTIONS[16], resources: { metal: 'Low', crystal: 'Overflowing' as 'Abundant', deuterium: 'Normal', darkMatter: 'None', exoticMatter: 'Trace' }, specialFeatures: ['Crystal Overabundance', 'Ship Bonus', 'Crystal Tech'], threatLevel: 1, description: 'Crystal formations cover entire planets here. The abundance of crystal makes ship construction incredibly cheap.', color: '#a78bfa', icon: 'ri-drop-line', isOpen: true, maxPlayers: 10000, speed: 1, fleetSpeed: 1, researchSpeed: 2 },
      { id: 'u3-r8', name: 'Nexus of Life', type: 'Nexus', security: 'Medium', galaxyCount: 14, starSystemCount: 2100, planetCount: 14700, playerCount: 7800, dominantFaction: FACTIONS[17], resources: { metal: 'Rich', crystal: 'Rich', deuterium: 'Rich', darkMatter: 'Trace', exoticMatter: 'Trace' }, specialFeatures: ['Life Bonus', 'Population Growth +200%', 'Organic Resources'], threatLevel: 2, description: 'Life flourishes in every corner of this realm. Population growth rates are unmatched anywhere in the universe.', color: '#10b981', icon: 'ri-heart-line', isOpen: true, maxPlayers: 14000, speed: 2, fleetSpeed: 1, researchSpeed: 2 },
      { id: 'u3-r9', name: 'Warzone Bloom', type: 'Warzone', security: 'Low', galaxyCount: 14, starSystemCount: 2100, planetCount: 14700, playerCount: 4900, dominantFaction: FACTIONS[18], resources: { metal: 'Abundant', crystal: 'Abundant', deuterium: 'Rich', darkMatter: 'Present', exoticMatter: 'Present' }, specialFeatures: ['Alliance Wars', 'Conquest Bonus', 'War Spoils'], threatLevel: 7, description: 'The one warzone in peaceful Genesis. Alliances battle for control of the most resource-rich territories.', color: '#ef4444', icon: 'ri-alarm-warning-line', isOpen: true, maxPlayers: 10000, speed: 3, fleetSpeed: 2, researchSpeed: 2 },
      { id: 'u3-r10', name: 'Genesis Gate', type: 'Dimensional Gate', security: 'Medium', galaxyCount: 8, starSystemCount: 1200, planetCount: 8400, playerCount: 3600, dominantFaction: FACTIONS[19], resources: { metal: 'Rich', crystal: 'Rich', deuterium: 'Rich', darkMatter: 'Present', exoticMatter: 'Present' }, specialFeatures: ['Multi-Universe Access', 'Dimensional Trade', 'Gate Bonus'], threatLevel: 4, description: 'The most welcoming dimensional gate in any universe. Trade and travel between universes is encouraged here.', color: '#06b6d4', icon: 'ri-door-open-line', isOpen: true, maxPlayers: 8000, speed: 2, fleetSpeed: 2, researchSpeed: 2 },
    ],
  },

  // ── UNIVERSE 4 ──────────────────────────────────────────────────────────────
  {
    id: 'u4',
    name: 'Eternal Nexus',
    class: 'Mythic',
    seed: 99999,
    description: 'The endgame universe. Unlimited resources, cosmic entities, and reality rifts. Only the most powerful empires survive.',
    color: '#f59e0b',
    accentColor: '#d97706',
    image: 'https://readdy.ai/api/search-image?query=mythic%20golden%20cosmic%20universe%20with%20reality%20rifts%20dimensional%20tears%20ancient%20cosmic%20entities%20swirling%20energy%20vortex%20epic%20scale&width=800&height=450&seq=u4bg&orientation=landscape',
    totalPlayers: 8934,
    maxPlayers: 30000,
    isActive: true,
    launchDate: '2024-04-15',
    age: 'Primordial',
    characteristics: { density: 'Dense', hostility: 'Extreme', resources: 'Infinite', technology: 'Transcendent' },
    realms: [
      { id: 'u4-r1', name: 'Nexus Core', type: 'Core', security: 'Medium', galaxyCount: 30, starSystemCount: 6000, planetCount: 42000, playerCount: 2100, dominantFaction: FACTIONS[20], resources: { metal: 'Abundant', crystal: 'Abundant', deuterium: 'Abundant', darkMatter: 'Rich', exoticMatter: 'Rich' }, specialFeatures: ['Mythic Tier', 'Cosmic Entities', 'Reality Rifts'], threatLevel: 8, description: 'The heart of the Eternal Nexus. Cosmic entities roam freely and reality itself bends to the will of the powerful.', color: '#f59e0b', icon: 'ri-focus-3-line', isOpen: true, maxPlayers: 5000, speed: 4, fleetSpeed: 3, researchSpeed: 3 },
      { id: 'u4-r2', name: 'Reality Rift Zone', type: 'Void Rift', security: 'Anomalous', galaxyCount: 15, starSystemCount: 3000, planetCount: 21000, playerCount: 890, dominantFaction: FACTIONS[21], resources: { metal: 'Scarce', crystal: 'Scarce', deuterium: 'Scarce', darkMatter: 'Overflowing', exoticMatter: 'Overflowing' }, specialFeatures: ['Reality Collapse', 'Dimensional Entities', 'Infinite Power'], threatLevel: 10, description: 'Reality collapses and reforms constantly. Those who master the rifts gain access to infinite power.', color: '#7c3aed', icon: 'ri-ghost-line', isOpen: true, maxPlayers: 2000, speed: 5, fleetSpeed: 5, researchSpeed: 5 },
      { id: 'u4-r3', name: 'Cosmic Warzone', type: 'Warzone', security: 'Null', galaxyCount: 25, starSystemCount: 5000, planetCount: 35000, playerCount: 1800, dominantFaction: FACTIONS[22], resources: { metal: 'Abundant', crystal: 'Abundant', deuterium: 'Abundant', darkMatter: 'Rich', exoticMatter: 'Rich' }, specialFeatures: ['Cosmic Combat', 'Entity Battles', 'Universe Conquest'], threatLevel: 10, description: 'The ultimate warzone. Cosmic entities fight alongside empires in battles that reshape the universe.', color: '#dc2626', icon: 'ri-alarm-warning-line', isOpen: true, maxPlayers: 4000, speed: 5, fleetSpeed: 4, researchSpeed: 3 },
      { id: 'u4-r4', name: 'Primordial Ruins', type: 'Ancient Ruins', security: 'Low', galaxyCount: 20, starSystemCount: 4000, planetCount: 28000, playerCount: 1200, dominantFaction: FACTIONS[23], resources: { metal: 'Normal', crystal: 'Rich', deuterium: 'Normal', darkMatter: 'Rich', exoticMatter: 'Overflowing' }, specialFeatures: ['Primordial Artifacts', 'God-Tech', 'Ancient Entities'], threatLevel: 9, description: 'Ruins from the first civilization in the universe. Their technology is indistinguishable from magic.', color: '#d97706', icon: 'ri-ancient-gate-line', isOpen: true, maxPlayers: 3000, speed: 3, fleetSpeed: 2, researchSpeed: 5 },
      { id: 'u4-r5', name: 'Infinite Resource Sea', type: 'Resource Hub', security: 'Medium', galaxyCount: 22, starSystemCount: 4400, planetCount: 30800, playerCount: 1600, dominantFaction: FACTIONS[24], resources: { metal: 'Abundant', crystal: 'Abundant', deuterium: 'Abundant', darkMatter: 'Overflowing', exoticMatter: 'Overflowing' }, specialFeatures: ['Infinite Resources', 'Mythic Crafting', 'God-Tier Items'], threatLevel: 5, description: 'Resources flow without limit here. The foundation of every mythic empire is built on the wealth of this realm.', color: '#4ade80', icon: 'ri-store-2-line', isOpen: true, maxPlayers: 4000, speed: 3, fleetSpeed: 2, researchSpeed: 3 },
      { id: 'u4-r6', name: 'Transcendent Research', type: 'Sanctuary', security: 'High', galaxyCount: 12, starSystemCount: 2400, planetCount: 16800, playerCount: 980, dominantFaction: FACTIONS[25], resources: { metal: 'Normal', crystal: 'Rich', deuterium: 'Rich', darkMatter: 'Present', exoticMatter: 'Rich' }, specialFeatures: ['Transcendent Tech', 'God-Level Research', 'Reality Manipulation'], threatLevel: 3, description: 'The pinnacle of scientific achievement. Research here unlocks technologies that transcend normal physics.', color: '#818cf8', icon: 'ri-flask-line', isOpen: true, maxPlayers: 2000, speed: 2, fleetSpeed: 1, researchSpeed: 10 },
      { id: 'u4-r7', name: 'Entity Nexus', type: 'Nexus', security: 'Anomalous', galaxyCount: 18, starSystemCount: 3600, planetCount: 25200, playerCount: 760, dominantFaction: FACTIONS[26], resources: { metal: 'Rich', crystal: 'Rich', deuterium: 'Rich', darkMatter: 'Overflowing', exoticMatter: 'Overflowing' }, specialFeatures: ['Cosmic Entity Allies', 'Entity Contracts', 'Dimensional Power'], threatLevel: 9, description: 'Cosmic entities gather here. Commanders who prove themselves worthy can forge alliances with these ancient beings.', color: '#ec4899', icon: 'ri-focus-2-line', isOpen: true, maxPlayers: 2000, speed: 4, fleetSpeed: 4, researchSpeed: 4 },
      { id: 'u4-r8', name: 'Mythic Frontier', type: 'Frontier', security: 'Low', galaxyCount: 28, starSystemCount: 5600, planetCount: 39200, playerCount: 1100, dominantFaction: FACTIONS[27], resources: { metal: 'Abundant', crystal: 'Abundant', deuterium: 'Abundant', darkMatter: 'Present', exoticMatter: 'Present' }, specialFeatures: ['Mythic Expansion', 'God-Tier Colonies', 'Legendary Planets'], threatLevel: 7, description: 'Uncharted mythic territories. Every planet discovered here has the potential to be a legendary world.', color: '#f97316', icon: 'ri-compass-3-line', isOpen: true, maxPlayers: 3000, speed: 4, fleetSpeed: 3, researchSpeed: 3 },
      { id: 'u4-r9', name: 'Contested Eternity', type: 'Contested', security: 'Null', galaxyCount: 20, starSystemCount: 4000, planetCount: 28000, playerCount: 1400, dominantFaction: FACTIONS[28], resources: { metal: 'Abundant', crystal: 'Abundant', deuterium: 'Abundant', darkMatter: 'Rich', exoticMatter: 'Rich' }, specialFeatures: ['Eternal War', 'Mythic PvP', 'Universe Domination'], threatLevel: 10, description: 'The eternal contest for dominance. Empires that control this realm control the fate of the Eternal Nexus.', color: '#ef4444', icon: 'ri-sword-line', isOpen: true, maxPlayers: 3000, speed: 5, fleetSpeed: 4, researchSpeed: 4 },
      { id: 'u4-r10', name: 'Eternal Gate', type: 'Dimensional Gate', security: 'Anomalous', galaxyCount: 5, starSystemCount: 1000, planetCount: 7000, playerCount: 604, dominantFaction: FACTIONS[29], resources: { metal: 'Scarce', crystal: 'Scarce', deuterium: 'Scarce', darkMatter: 'Overflowing', exoticMatter: 'Overflowing' }, specialFeatures: ['Eternal Dimension', 'God-Mode Access', 'Universe Creation'], threatLevel: 10, description: 'The gate to eternity. Those who pass through gain the power to create and destroy universes.', color: '#f59e0b', icon: 'ri-door-open-line', isOpen: false, maxPlayers: 500, speed: 10, fleetSpeed: 10, researchSpeed: 10 },
    ],
  },

  // ── UNIVERSES 5–30 (condensed but fully defined) ─────────────────────────────
  ...generateRemainingUniverses(),
];

function generateRemainingUniverses(): UniverseData[] {
  const universeTemplates = [
    { id: 'u5', name: 'Quantum Flux', class: 'Quantum' as UniverseClass, seed: 55555, description: 'Physics operates differently here. Quantum mechanics govern everything from combat to resource generation.', color: '#06b6d4', accentColor: '#0891b2', age: 'Mature' as const, density: 'Normal' as const, hostility: 'Moderate' as const, resources: 'Normal' as const, technology: 'Advanced' as const, players: 31200, image: 'https://readdy.ai/api/search-image?query=quantum%20universe%20with%20probability%20waves%20particle%20interference%20patterns%20cyan%20teal%20energy%20fields%20physics%20visualization&width=800&height=450&seq=u5bg&orientation=landscape' },
    { id: 'u6', name: 'Temporal Rift', class: 'Temporal' as UniverseClass, seed: 66666, description: 'Time flows differently across this universe. Some realms experience time at 10x speed, others at 0.1x.', color: '#a78bfa', accentColor: '#7c3aed', age: 'Ancient' as const, density: 'Normal' as const, hostility: 'Dangerous' as const, resources: 'Normal' as const, technology: 'Transcendent' as const, players: 19800, image: 'https://readdy.ai/api/search-image?query=temporal%20rift%20universe%20with%20time%20distortion%20clock%20spirals%20purple%20violet%20dimensional%20tears%20time%20streams&width=800&height=450&seq=u6bg&orientation=landscape' },
    { id: 'u7', name: 'Iron Dominion', class: 'Hardcore' as UniverseClass, seed: 11111, description: 'A universe dominated by military might. Only the strongest fleets survive in this brutal warzone universe.', color: '#f87171', accentColor: '#dc2626', age: 'Mature' as const, density: 'Dense' as const, hostility: 'Extreme' as const, resources: 'Normal' as const, technology: 'Advanced' as const, players: 24600, image: 'https://readdy.ai/api/search-image?query=iron%20military%20universe%20with%20warships%20battle%20formations%20red%20orange%20combat%20zones%20space%20warfare%20epic%20scale&width=800&height=450&seq=u7bg&orientation=landscape' },
    { id: 'u8', name: 'Crystal Expanse', class: 'Peaceful' as UniverseClass, seed: 88888, description: 'Crystal formations dominate this universe. Research and crafting bonuses are unmatched anywhere.', color: '#c084fc', accentColor: '#9333ea', age: 'Young' as const, density: 'Normal' as const, hostility: 'Peaceful' as const, resources: 'Abundant' as const, technology: 'Advanced' as const, players: 42100, image: 'https://readdy.ai/api/search-image?query=crystal%20universe%20with%20purple%20violet%20crystal%20formations%20planets%20covered%20in%20crystals%20gem-like%20structures%20space&width=800&height=450&seq=u8bg&orientation=landscape' },
    { id: 'u9', name: 'Void Nexus', class: 'Void' as UniverseClass, seed: 22222, description: 'The void between dimensions. Dark matter is the primary resource and void entities are everywhere.', color: '#1e1b4b', accentColor: '#312e81', age: 'Primordial' as const, density: 'Sparse' as const, hostility: 'Extreme' as const, resources: 'Scarce' as const, technology: 'Transcendent' as const, players: 7800, image: 'https://readdy.ai/api/search-image?query=void%20nexus%20dark%20universe%20between%20dimensions%20dark%20matter%20streams%20void%20entities%20empty%20space%20cosmic%20horror&width=800&height=450&seq=u9bg&orientation=landscape' },
    { id: 'u10', name: 'Solar Dominion', class: 'Standard' as UniverseClass, seed: 33333, description: 'A sun-rich universe with abundant energy. Solar technology is the most advanced here.', color: '#fbbf24', accentColor: '#f59e0b', age: 'Mature' as const, density: 'Dense' as const, hostility: 'Moderate' as const, resources: 'Abundant' as const, technology: 'Standard' as const, players: 38900, image: 'https://readdy.ai/api/search-image?query=solar%20universe%20with%20many%20bright%20stars%20golden%20yellow%20energy%20abundant%20suns%20solar%20flares%20warm%20cosmic%20environment&width=800&height=450&seq=u10bg&orientation=landscape' },
    { id: 'u11', name: 'Nebula Realm', class: 'Standard' as UniverseClass, seed: 44444, description: 'Vast nebulae fill this universe, providing unique resources and hiding countless secrets.', color: '#f472b6', accentColor: '#ec4899', age: 'Young' as const, density: 'Dense' as const, hostility: 'Moderate' as const, resources: 'Abundant' as const, technology: 'Standard' as const, players: 29300, image: 'https://readdy.ai/api/search-image?query=nebula%20realm%20universe%20with%20colorful%20gas%20clouds%20pink%20magenta%20star%20forming%20regions%20cosmic%20nursery%20beautiful&width=800&height=450&seq=u11bg&orientation=landscape' },
    { id: 'u12', name: 'Chaos Dimension', class: 'Chaos' as UniverseClass, seed: 12345, description: 'Nothing is predictable here. Random events constantly reshape the universe and its rules.', color: '#fb923c', accentColor: '#ea580c', age: 'Ancient' as const, density: 'Packed' as const, hostility: 'Extreme' as const, resources: 'Normal' as const, technology: 'Advanced' as const, players: 15600, image: 'https://readdy.ai/api/search-image?query=chaos%20dimension%20universe%20with%20random%20energy%20explosions%20unpredictable%20physics%20orange%20red%20chaotic%20cosmic%20environment&width=800&height=450&seq=u12bg&orientation=landscape' },
    { id: 'u13', name: 'Ancient Cosmos', class: 'Ancient' as UniverseClass, seed: 98765, description: 'The oldest universe. Ancient civilizations left behind technology that modern empires can barely comprehend.', color: '#d97706', accentColor: '#b45309', age: 'Primordial' as const, density: 'Sparse' as const, hostility: 'Dangerous' as const, resources: 'Normal' as const, technology: 'Transcendent' as const, players: 11200, image: 'https://readdy.ai/api/search-image?query=ancient%20cosmos%20universe%20with%20old%20stars%20dying%20galaxies%20amber%20gold%20ancient%20ruins%20cosmic%20archaeology%20primordial&width=800&height=450&seq=u13bg&orientation=landscape' },
    { id: 'u14', name: 'Plasma Storm', class: 'Hardcore' as UniverseClass, seed: 54321, description: 'Plasma storms rage across this universe. Energy is infinite but navigation is treacherous.', color: '#f97316', accentColor: '#ea580c', age: 'Young' as const, density: 'Dense' as const, hostility: 'Dangerous' as const, resources: 'Abundant' as const, technology: 'Advanced' as const, players: 18700, image: 'https://readdy.ai/api/search-image?query=plasma%20storm%20universe%20with%20orange%20energy%20storms%20plasma%20waves%20electromagnetic%20fields%20dangerous%20space%20environment&width=800&height=450&seq=u14bg&orientation=landscape' },
    { id: 'u15', name: 'Frozen Expanse', class: 'Standard' as UniverseClass, seed: 67890, description: 'A cold, crystalline universe where ice worlds dominate and deuterium is incredibly abundant.', color: '#bae6fd', accentColor: '#38bdf8', age: 'Ancient' as const, density: 'Normal' as const, hostility: 'Moderate' as const, resources: 'Abundant' as const, technology: 'Standard' as const, players: 22400, image: 'https://readdy.ai/api/search-image?query=frozen%20expanse%20universe%20with%20ice%20worlds%20blue%20white%20crystalline%20planets%20cold%20space%20environment%20deuterium%20rich&width=800&height=450&seq=u15bg&orientation=landscape' },
    { id: 'u16', name: 'Dark Horizon', class: 'Void' as UniverseClass, seed: 11223, description: 'Black holes dominate this universe. Gravitational forces create unique combat and travel mechanics.', color: '#0f172a', accentColor: '#1e293b', age: 'Ancient' as const, density: 'Sparse' as const, hostility: 'Extreme' as const, resources: 'Scarce' as const, technology: 'Advanced' as const, players: 9100, image: 'https://readdy.ai/api/search-image?query=dark%20horizon%20universe%20with%20black%20holes%20accretion%20disks%20gravitational%20lensing%20dark%20space%20event%20horizons&width=800&height=450&seq=u16bg&orientation=landscape' },
    { id: 'u17', name: 'Emerald Worlds', class: 'Peaceful' as UniverseClass, seed: 33445, description: 'Life thrives everywhere in this universe. Organic resources and population bonuses are extraordinary.', color: '#10b981', accentColor: '#059669', age: 'Young' as const, density: 'Packed' as const, hostility: 'Peaceful' as const, resources: 'Abundant' as const, technology: 'Standard' as const, players: 51200, image: 'https://readdy.ai/api/search-image?query=emerald%20worlds%20universe%20with%20green%20life-covered%20planets%20lush%20vegetation%20from%20space%20organic%20rich%20environment%20thriving&width=800&height=450&seq=u17bg&orientation=landscape' },
    { id: 'u18', name: 'Antimatter Sea', class: 'Chaos' as UniverseClass, seed: 55667, description: 'Antimatter floods this universe. Incredible energy potential but catastrophic if mishandled.', color: '#e879f9', accentColor: '#d946ef', age: 'Mature' as const, density: 'Normal' as const, hostility: 'Dangerous' as const, resources: 'Abundant' as const, technology: 'Transcendent' as const, players: 13400, image: 'https://readdy.ai/api/search-image?query=antimatter%20sea%20universe%20with%20pink%20magenta%20antimatter%20streams%20annihilation%20events%20energy%20explosions%20exotic%20matter&width=800&height=450&seq=u18bg&orientation=landscape' },
    { id: 'u19', name: 'Titan Cluster', class: 'Standard' as UniverseClass, seed: 77889, description: 'Giant stars and massive planets define this universe. Everything here is on a colossal scale.', color: '#fb923c', accentColor: '#f97316', age: 'Mature' as const, density: 'Dense' as const, hostility: 'Moderate' as const, resources: 'Normal' as const, technology: 'Standard' as const, players: 34700, image: 'https://readdy.ai/api/search-image?query=titan%20cluster%20universe%20with%20giant%20stars%20massive%20planets%20colossal%20scale%20orange%20red%20giant%20stars%20impressive%20scale&width=800&height=450&seq=u19bg&orientation=landscape' },
    { id: 'u20', name: 'Phantom Realm', class: 'Void' as UniverseClass, seed: 99001, description: 'Cloaking technology is native to this universe. Stealth and espionage are the primary tools of power.', color: '#6b7280', accentColor: '#4b5563', age: 'Ancient' as const, density: 'Normal' as const, hostility: 'Dangerous' as const, resources: 'Normal' as const, technology: 'Advanced' as const, players: 16800, image: 'https://readdy.ai/api/search-image?query=phantom%20realm%20universe%20with%20cloaked%20ships%20stealth%20technology%20gray%20silver%20invisible%20fleets%20espionage%20space&width=800&height=450&seq=u20bg&orientation=landscape' },
    { id: 'u21', name: 'Nova Burst', class: 'Chaos' as UniverseClass, seed: 11334, description: 'Supernovae occur constantly here. The destruction creates incredible resources but also constant danger.', color: '#fcd34d', accentColor: '#fbbf24', age: 'Young' as const, density: 'Dense' as const, hostility: 'Dangerous' as const, resources: 'Abundant' as const, technology: 'Standard' as const, players: 21300, image: 'https://readdy.ai/api/search-image?query=nova%20burst%20universe%20with%20supernova%20explosions%20yellow%20white%20stellar%20explosions%20shockwaves%20cosmic%20destruction%20creation&width=800&height=450&seq=u21bg&orientation=landscape' },
    { id: 'u22', name: 'Rogue Dimension', class: 'Hardcore' as UniverseClass, seed: 22445, description: 'No rules, no alliances, no mercy. Pure survival of the fittest in this lawless dimension.', color: '#dc2626', accentColor: '#b91c1c', age: 'Mature' as const, density: 'Normal' as const, hostility: 'Extreme' as const, resources: 'Normal' as const, technology: 'Advanced' as const, players: 8900, image: 'https://readdy.ai/api/search-image?query=rogue%20dimension%20universe%20with%20lawless%20space%20pirate%20fleets%20red%20danger%20zones%20no%20rules%20combat%20everywhere&width=800&height=450&seq=u22bg&orientation=landscape' },
    { id: 'u23', name: 'Celestial Garden', class: 'Peaceful' as UniverseClass, seed: 33556, description: 'The most beautiful universe. Aesthetic bonuses and cultural advancement are the primary goals here.', color: '#f9a8d4', accentColor: '#f472b6', age: 'Young' as const, density: 'Normal' as const, hostility: 'Peaceful' as const, resources: 'Abundant' as const, technology: 'Standard' as const, players: 44600, image: 'https://readdy.ai/api/search-image?query=celestial%20garden%20universe%20with%20beautiful%20colorful%20nebulae%20flower-like%20formations%20pink%20pastel%20cosmic%20beauty%20aesthetic&width=800&height=450&seq=u23bg&orientation=landscape' },
    { id: 'u24', name: 'Quantum Singularity', class: 'Quantum' as UniverseClass, seed: 44667, description: 'A universe collapsing into a singularity. Time is running out — claim what you can before it ends.', color: '#7c3aed', accentColor: '#6d28d9', age: 'Ancient' as const, density: 'Packed' as const, hostility: 'Extreme' as const, resources: 'Infinite' as const, technology: 'Transcendent' as const, players: 6700, image: 'https://readdy.ai/api/search-image?query=quantum%20singularity%20universe%20collapsing%20into%20point%20purple%20violet%20gravitational%20collapse%20everything%20falling%20inward&width=800&height=450&seq=u24bg&orientation=landscape' },
    { id: 'u25', name: 'Stellar Forge', class: 'Standard' as UniverseClass, seed: 55778, description: 'Star forges create new stars and planets constantly. Construction and crafting bonuses are legendary.', color: '#f59e0b', accentColor: '#d97706', age: 'Young' as const, density: 'Dense' as const, hostility: 'Moderate' as const, resources: 'Abundant' as const, technology: 'Advanced' as const, players: 27800, image: 'https://readdy.ai/api/search-image?query=stellar%20forge%20universe%20with%20star%20creation%20forges%20new%20stars%20being%20born%20golden%20amber%20construction%20cosmic%20manufacturing&width=800&height=450&seq=u25bg&orientation=landscape' },
    { id: 'u26', name: 'Dimensional Nexus', class: 'Mythic' as UniverseClass, seed: 66889, description: 'The crossroads of all dimensions. Every universe can be accessed from here, making it the most strategic location.', color: '#06b6d4', accentColor: '#0891b2', age: 'Primordial' as const, density: 'Dense' as const, hostility: 'Dangerous' as const, resources: 'Abundant' as const, technology: 'Transcendent' as const, players: 5400, image: 'https://readdy.ai/api/search-image?query=dimensional%20nexus%20universe%20with%20portals%20to%20other%20dimensions%20cyan%20teal%20gateway%20crossroads%20multiple%20universes%20visible&width=800&height=450&seq=u26bg&orientation=landscape' },
    { id: 'u27', name: 'Crimson Tide', class: 'Hardcore' as UniverseClass, seed: 77990, description: 'Blood-red nebulae fill this universe. Combat bonuses are extreme but so is the danger.', color: '#ef4444', accentColor: '#dc2626', age: 'Mature' as const, density: 'Dense' as const, hostility: 'Extreme' as const, resources: 'Normal' as const, technology: 'Advanced' as const, players: 14200, image: 'https://readdy.ai/api/search-image?query=crimson%20tide%20universe%20with%20blood%20red%20nebulae%20crimson%20space%20combat%20zones%20red%20stars%20dangerous%20environment&width=800&height=450&seq=u27bg&orientation=landscape' },
    { id: 'u28', name: 'Sapphire Expanse', class: 'Peaceful' as UniverseClass, seed: 88001, description: 'Deep blue oceans cover most planets here. Naval and aquatic technologies are uniquely advanced.', color: '#3b82f6', accentColor: '#2563eb', age: 'Young' as const, density: 'Normal' as const, hostility: 'Peaceful' as const, resources: 'Abundant' as const, technology: 'Standard' as const, players: 36500, image: 'https://readdy.ai/api/search-image?query=sapphire%20expanse%20universe%20with%20blue%20ocean%20worlds%20water%20planets%20sapphire%20blue%20space%20environment%20aquatic%20worlds&width=800&height=450&seq=u28bg&orientation=landscape' },
    { id: 'u29', name: 'Omega Singularity', class: 'Mythic' as UniverseClass, seed: 99112, description: 'The final universe before the end of all things. Mythic power awaits those who reach its core.', color: '#1e1b4b', accentColor: '#312e81', age: 'Primordial' as const, density: 'Sparse' as const, hostility: 'Extreme' as const, resources: 'Infinite' as const, technology: 'Transcendent' as const, players: 3200, image: 'https://readdy.ai/api/search-image?query=omega%20singularity%20universe%20final%20universe%20dark%20purple%20black%20end%20of%20all%20things%20cosmic%20apocalypse%20mythic%20power&width=800&height=450&seq=u29bg&orientation=landscape' },
    { id: 'u30', name: 'Infinite Horizon', class: 'Standard' as UniverseClass, seed: 10101, description: 'The newest universe, freshly spawned. Everything is possible here — the story is just beginning.', color: '#34d399', accentColor: '#10b981', age: 'New' as const, density: 'Normal' as const, hostility: 'Moderate' as const, resources: 'Normal' as const, technology: 'Standard' as const, players: 2100, image: 'https://readdy.ai/api/search-image?query=infinite%20horizon%20universe%20new%20fresh%20universe%20green%20teal%20horizon%20endless%20possibilities%20new%20beginning%20cosmic%20dawn&width=800&height=450&seq=u30bg&orientation=landscape' },
  ];

  return universeTemplates.map((tmpl, uIdx) => {
    const realmTypes: RealmType[] = ['Core', 'Frontier', 'Contested', 'Sanctuary', 'Warzone', 'Nexus', 'Void Rift', 'Ancient Ruins', 'Resource Hub', 'Dimensional Gate'];
    const securityLevels: SecurityLevel[] = ['High', 'Medium', 'Low', 'Null', 'Anomalous'];
    const realmNames = [
      `${tmpl.name} Core`, `${tmpl.name} Frontier`, `${tmpl.name} Contested Zone`,
      `${tmpl.name} Sanctuary`, `${tmpl.name} Warzone`, `${tmpl.name} Nexus`,
      `${tmpl.name} Void Rift`, `${tmpl.name} Ancient Sector`, `${tmpl.name} Resource Hub`,
      `${tmpl.name} Gate`
    ];
    const realmColors = [tmpl.color, '#38bdf8', '#f87171', '#a78bfa', '#ef4444', '#f59e0b', '#7c3aed', '#d97706', '#4ade80', '#ec4899'];
    const realmIcons = ['ri-focus-3-line', 'ri-compass-3-line', 'ri-sword-line', 'ri-shield-line', 'ri-alarm-warning-line', 'ri-focus-2-line', 'ri-ghost-line', 'ri-ancient-gate-line', 'ri-store-2-line', 'ri-door-open-line'];
    const threatLevels: Array<1|2|3|4|5|6|7|8|9|10> = [2, 4, 7, 1, 10, 5, 9, 6, 3, 10];
    const securityMap: SecurityLevel[] = ['High', 'Medium', 'Low', 'High', 'Null', 'Medium', 'Null', 'Low', 'Medium', 'Anomalous'];
    const speeds = [1, 1, 2, 1, 4, 2, 3, 1, 1, 5];
    const fleetSpeeds = [1, 1.2, 1.5, 1, 2, 3, 2, 1, 1, 5];
    const researchSpeeds = [1, 1, 1.5, 2, 2, 1.5, 2, 3, 1, 5];
    const playerCounts = [Math.floor(tmpl.players * 0.25), Math.floor(tmpl.players * 0.18), Math.floor(tmpl.players * 0.16), Math.floor(tmpl.players * 0.1), Math.floor(tmpl.players * 0.12), Math.floor(tmpl.players * 0.08), Math.floor(tmpl.players * 0.04), Math.floor(tmpl.players * 0.03), Math.floor(tmpl.players * 0.02), Math.floor(tmpl.players * 0.02)];

    const realms: RealmSystem[] = realmTypes.map((type, rIdx) => ({
      id: `${tmpl.id}-r${rIdx + 1}`,
      name: realmNames[rIdx],
      type,
      security: securityMap[rIdx],
      galaxyCount: [12, 18, 15, 8, 20, 9, 6, 10, 14, 5][rIdx],
      starSystemCount: [1200, 2100, 1800, 960, 2400, 1080, 720, 1200, 1680, 600][rIdx],
      planetCount: [8400, 14700, 12600, 6720, 16800, 7560, 5040, 8400, 11760, 4200][rIdx],
      playerCount: playerCounts[rIdx],
      dominantFaction: FACTIONS[(uIdx * 3 + rIdx) % FACTIONS.length],
      resources: {
        metal: (['Normal', 'Rich', 'Abundant', 'Low', 'Abundant', 'Normal', 'Scarce', 'Normal', 'Abundant', 'Scarce'] as const)[rIdx],
        crystal: (['Normal', 'Normal', 'Rich', 'Abundant', 'Abundant', 'Normal', 'Scarce', 'Rich', 'Abundant', 'Scarce'] as const)[rIdx],
        deuterium: (['Normal', 'Low', 'Normal', 'Normal', 'Rich', 'Rich', 'Rich', 'Low', 'Abundant', 'Scarce'] as const)[rIdx],
        darkMatter: (['Trace', 'Trace', 'Present', 'None', 'Present', 'Present', 'Overflowing', 'Present', 'Trace', 'Overflowing'] as const)[rIdx],
        exoticMatter: (['None', 'None', 'Trace', 'None', 'Present', 'Present', 'Rich', 'Rich', 'None', 'Overflowing'] as const)[rIdx],
      },
      specialFeatures: [
        ['Starter Zone', 'Tutorial', 'Protected'],
        ['Expansion Zone', 'Colonization Bonus', 'Trade Routes'],
        ['PvP Zone', 'Resource Wars', 'Alliance Battles'],
        ['No PvP', 'Research Bonus', 'Safe Haven'],
        ['Permanent War', 'Alliance Wars', 'Conquest Points'],
        ['Stargate Hub', 'Fast Travel', 'Dimensional Access'],
        ['Dark Matter Storms', 'Void Entities', 'Dimensional Tears'],
        ['Ancient Artifacts', 'Ruin Exploration', 'Tech Discoveries'],
        ['Trade Bonus', 'Mining Bonus', 'Market Hub'],
        ['Cross-Universe Travel', 'Dimensional Entities', 'Reality Instability'],
      ][rIdx],
      threatLevel: threatLevels[rIdx],
      description: [
        `The core of ${tmpl.name}. New commanders begin their journey here.`,
        `Vast unexplored territories in ${tmpl.name}. Brave commanders push the boundaries.`,
        `Fierce battles rage in ${tmpl.name}. Only the strongest alliances survive.`,
        `A peaceful sanctuary in ${tmpl.name} dedicated to scientific advancement.`,
        `The eternal battleground of ${tmpl.name}. Alliances clash for dominance.`,
        `The crossroads of ${tmpl.name}. Stargates connect all realms.`,
        `Reality tears open in ${tmpl.name}. Dark matter floods the void.`,
        `Ancient ruins from civilizations billions of years old in ${tmpl.name}.`,
        `The economic heart of ${tmpl.name}. Trade routes converge here.`,
        `A gateway to other universes from ${tmpl.name}. Reality is unstable here.`,
      ][rIdx],
      color: realmColors[rIdx],
      icon: realmIcons[rIdx],
      isOpen: rIdx < 9,
      maxPlayers: [15000, 12000, 10000, 8000, 15000, 10000, 5000, 8000, 12000, 3000][rIdx],
      speed: speeds[rIdx],
      fleetSpeed: fleetSpeeds[rIdx],
      researchSpeed: researchSpeeds[rIdx],
    }));

    return {
      id: tmpl.id,
      name: tmpl.name,
      class: tmpl.class,
      seed: tmpl.seed,
      description: tmpl.description,
      color: tmpl.color,
      accentColor: tmpl.accentColor,
      image: tmpl.image,
      totalPlayers: tmpl.players,
      maxPlayers: Math.ceil(tmpl.players * 2.5),
      isActive: true,
      launchDate: `2024-${String(((uIdx % 12) + 1)).padStart(2, '0')}-01`,
      age: tmpl.age,
      characteristics: {
        density: tmpl.density,
        hostility: tmpl.hostility,
        resources: tmpl.resources,
        technology: tmpl.technology,
      },
      realms,
    };
  });
}

// ─── Helper: get universe by id ───────────────────────────────────────────────
export function getUniverseById(id: string): UniverseData | undefined {
  return universeData.find((u) => u.id === id);
}

// ─── Helper: get realm by id ──────────────────────────────────────────────────
export function getRealmById(universeId: string, realmId: string): RealmSystem | undefined {
  const universe = getUniverseById(universeId);
  return universe?.realms.find((r) => r.id === realmId);
}

// ─── Class color map ──────────────────────────────────────────────────────────
export const universeClassColors: Record<UniverseClass, string> = {
  Standard: '#00d4ff',
  Hardcore: '#ef4444',
  Peaceful: '#4ade80',
  Chaos: '#fb923c',
  Ancient: '#d97706',
  Void: '#7c3aed',
  Primordial: '#f59e0b',
  Quantum: '#06b6d4',
  Temporal: '#a78bfa',
  Mythic: '#f59e0b',
};

// ─── Security level colors ────────────────────────────────────────────────────
export const securityColors: Record<SecurityLevel, string> = {
  High: '#4ade80',
  Medium: '#fbbf24',
  Low: '#f87171',
  Null: '#ef4444',
  Anomalous: '#a78bfa',
};
