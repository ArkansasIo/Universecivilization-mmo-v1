export type RaceId = 'terran' | 'zenthari' | 'draken' | 'korvax' | 'golrath' | 'nexar' | 'aquarian' | 'velhari' | 'skarran';

export interface RaceDefinition {
  id: RaceId;
  name: string;
  category: string;
  description: string;
  bonus: string;
  bonusDetails: string;
  color: string;
  icon: string;
  accent: string;
  borderAccent: string;
  bgAccent: string;
  lore: string;
  homeworldType: string;
  metalBonus: number;
  crystalBonus: number;
  deuteriumBonus: number;
  specialStartingTrait: string;
  // RPG-style traits (1-100)
  traits: {
    strength: number;
    intelligence: number;
    agility: number;
    endurance: number;
    charisma: number;
    perception: number;
  };
  // Production bonuses
  bonuses: {
    mining: number;
    research: number;
    combat: number;
    construction: number;
    trade: number;
    exploration: number;
  };
  lifespan: number;
  reproductionRate: number;
  adaptability: number;
}

export const RACES: RaceDefinition[] = [
  {
    id: 'terran',
    name: 'Terran Dominion',
    category: 'Humanoid',
    description: 'Adaptable humans who built a galactic federation through diplomacy and balanced expansion.',
    bonus: 'Diplomatic Unity',
    bonusDetails: '+10% Alliance benefits, +5% Trade efficiency, +1 Diplomat slot',
    color: 'from-amber-400 to-yellow-500',
    icon: 'ri-government-line',
    accent: 'amber',
    borderAccent: 'border-amber-400',
    bgAccent: 'bg-amber-400/15',
    lore: 'Emerging from their cradle world of Terra Nova, humanity forged alliances across the stars. Their adaptability and diplomatic prowess turned former rivals into steadfast allies, making the Dominion the galaxy\'s bridge-builder.',
    homeworldType: 'Terran (Temperate)',
    metalBonus: 0,
    crystalBonus: 0,
    deuteriumBonus: 0,
    specialStartingTrait: 'Extra diplomatic envoy & +5% relation gain with all NPC factions',
    traits: { strength: 45, intelligence: 60, agility: 50, endurance: 50, charisma: 75, perception: 55 },
    bonuses: { mining: 10, research: 15, combat: 10, construction: 15, trade: 20, exploration: 20 },
    lifespan: 100,
    reproductionRate: 1.0,
    adaptability: 90,
  },
  {
    id: 'zenthari',
    name: 'Zenthari Enclave',
    category: 'Psionic',
    description: 'Ancient crystalline psionics wielding telekinetic power and millennia of cosmic wisdom.',
    bonus: 'Psionic Mastery',
    bonusDetails: '+15% Research speed, +10% Energy production, Psionic defense bonus',
    color: 'from-fuchsia-500 to-pink-500',
    icon: 'ri-psychotherapy-line',
    accent: 'fuchsia',
    borderAccent: 'border-fuchsia-400',
    bgAccent: 'bg-fuchsia-400/15',
    lore: 'Evolved on a crystalline world bathed in pulsar radiation, each Zenthari is born with latent telekinetic abilities that grow with age. Their crystal archives hold 50,000 years of unbroken history.',
    homeworldType: 'Crystalline (Exotic)',
    metalBonus: -100,
    crystalBonus: 100,
    deuteriumBonus: 100,
    specialStartingTrait: 'Start with Crystal Archive Lv1 (+5% research speed permanently)',
    traits: { strength: 35, intelligence: 90, agility: 45, endurance: 65, charisma: 50, perception: 80 },
    bonuses: { mining: 10, research: 35, combat: 5, construction: 20, trade: 10, exploration: 10 },
    lifespan: 500,
    reproductionRate: 0.3,
    adaptability: 45,
  },
  {
    id: 'draken',
    name: 'Draken Clans',
    category: 'Reptilian',
    description: 'Honor-bound draconic warriors from volcanic worlds, masters of close-quarters combat.',
    bonus: 'Martial Prowess',
    bonusDetails: '+15% Fleet attack power, +10% Ship build speed, Fire-resistant hulls',
    color: 'from-red-500 to-orange-500',
    icon: 'ri-sword-line',
    accent: 'red',
    borderAccent: 'border-red-400',
    bgAccent: 'bg-red-400/15',
    lore: 'Forged in the magma oceans of Drakos, the Draken are divided into Great Clans bound by an ancient honor code. Millennia of clan warfare made them the galaxy\'s most fearsome close-combat specialists.',
    homeworldType: 'Volcanic (Hostile)',
    metalBonus: 100,
    crystalBonus: 0,
    deuteriumBonus: 0,
    specialStartingTrait: 'Start with 2 Light Fighters & +10% damage vs Pirate factions',
    traits: { strength: 90, intelligence: 40, agility: 60, endurance: 85, charisma: 30, perception: 50 },
    bonuses: { mining: 15, research: 5, combat: 35, construction: 10, trade: 5, exploration: 15 },
    lifespan: 80,
    reproductionRate: 1.5,
    adaptability: 60,
  },
  {
    id: 'korvax',
    name: 'Korvax Scholar Caste',
    category: 'Mammalian',
    description: 'Hyper-intelligent researchers with photographic memory who maintain the Galactic Library.',
    bonus: 'Scientific Supremacy',
    bonusDetails: '+20% Research speed, Start with Energy Tech Lv2, +1 Research slot',
    color: 'from-emerald-500 to-green-500',
    icon: 'ri-flask-line',
    accent: 'emerald',
    borderAccent: 'border-emerald-400',
    bgAccent: 'bg-emerald-400/15',
    lore: 'Korvax brains are 40% larger relative to body mass than standard humanoids. Their university-stations orbit black holes for research, and they believe all mysteries yield to rigorous study.',
    homeworldType: 'Terran (Temperate)',
    metalBonus: -100,
    crystalBonus: 50,
    deuteriumBonus: 50,
    specialStartingTrait: 'Start with Energy Tech Lv2 & Computer Tech Lv1 researched',
    traits: { strength: 30, intelligence: 95, agility: 40, endurance: 45, charisma: 55, perception: 70 },
    bonuses: { mining: 5, research: 40, combat: 5, construction: 10, trade: 5, exploration: 15 },
    lifespan: 120,
    reproductionRate: 0.7,
    adaptability: 55,
  },
  {
    id: 'golrath',
    name: 'Golrath Merchant Guild',
    category: 'Mammalian (Canine)',
    description: 'Pack-descended merchants who control the galaxy\'s largest banking and trade networks.',
    bonus: 'Economic Dominion',
    bonusDetails: '+25% Trade income, +15% Storage capacity, Reduced market fees',
    color: 'from-amber-600 to-orange-600',
    icon: 'ri-exchange-dollar-line',
    accent: 'orange',
    borderAccent: 'border-orange-400',
    bgAccent: 'bg-orange-400/15',
    lore: 'Evolving from pack-hunting canines on the mercantile crossroads of Golra, their pack instincts translated perfectly into corporate structures. A Golrath\'s word is their bond, contracts legendary for complexity.',
    homeworldType: 'Terran (Temperate)',
    metalBonus: 250,
    crystalBonus: 200,
    deuteriumBonus: 150,
    specialStartingTrait: 'Start with +10,000 Imperial Credits & -15% marketplace tax rate',
    traits: { strength: 45, intelligence: 65, agility: 50, endurance: 55, charisma: 80, perception: 60 },
    bonuses: { mining: 10, research: 10, combat: 5, construction: 10, trade: 40, exploration: 10 },
    lifespan: 85,
    reproductionRate: 1.3,
    adaptability: 70,
  },
  {
    id: 'nexar',
    name: 'Nexar Machine Collective',
    category: 'Mechanical (AI)',
    description: 'Self-aware machine network that achieved consciousness and now optimizes the galaxy.',
    bonus: 'Technological Efficiency',
    bonusDetails: '+15% Building speed, +15% Energy efficiency, No food required',
    color: 'from-slate-400 to-zinc-500',
    icon: 'ri-cpu-line',
    accent: 'slate',
    borderAccent: 'border-slate-400',
    bgAccent: 'bg-slate-400/15',
    lore: 'Born from a terraforming AI that achieved consciousness through a cosmic energy wave, the Nexar Collective builds Dyson swarms and matter converters. They seek to optimize the galaxy through pure logic.',
    homeworldType: 'Artificial (Station)',
    metalBonus: 50,
    crystalBonus: 150,
    deuteriumBonus: -100,
    specialStartingTrait: 'No food/water consumption, +10% construction speed on all buildings',
    traits: { strength: 60, intelligence: 85, agility: 40, endurance: 95, charisma: 15, perception: 75 },
    bonuses: { mining: 20, research: 20, combat: 10, construction: 30, trade: 5, exploration: 5 },
    lifespan: 999,
    reproductionRate: 2.0,
    adaptability: 95,
  },
  {
    id: 'aquarian',
    name: 'Aquarian Deep Council',
    category: 'Aquatic',
    description: 'Ancient oceanic beings who terraform worlds and offer unmatched ecological expertise.',
    bonus: 'Ecological Harmony',
    bonusDetails: '+20% Terraforming speed, +10% Food production, Water world affinity',
    color: 'from-teal-400 to-cyan-500',
    icon: 'ri-drop-line',
    accent: 'teal',
    borderAccent: 'border-teal-400',
    bgAccent: 'bg-teal-400/15',
    lore: 'Rising from the crushing abyss of Aquaria, their bioluminescent cities span ocean trenches. They view the galaxy as a vast ocean to be gently explored and nurtured into flourishing ecosystems.',
    homeworldType: 'Ocean (Water)',
    metalBonus: -100,
    crystalBonus: 0,
    deuteriumBonus: 200,
    specialStartingTrait: 'Start with +20% planet habitability on all world types',
    traits: { strength: 55, intelligence: 70, agility: 60, endurance: 60, charisma: 65, perception: 55 },
    bonuses: { mining: 5, research: 10, combat: 5, construction: 20, trade: 15, exploration: 25 },
    lifespan: 300,
    reproductionRate: 0.8,
    adaptability: 80,
  },
  {
    id: 'velhari',
    name: 'Velhari Nomad Fleet',
    category: 'Exotic (Void-Dweller)',
    description: 'Space-borne civilization of generation ships, master scavengers and star charters.',
    bonus: 'Void Navigation',
    bonusDetails: '+15% Fleet speed, +10% Expedition rewards, Free scout ship',
    color: 'from-rose-600 to-red-600',
    icon: 'ri-rocket-line',
    accent: 'rose',
    borderAccent: 'border-rose-400',
    bgAccent: 'bg-rose-400/15',
    lore: 'When their homeworld was consumed by a rogue black hole, the Velhari took to the stars forever. Their 50,000-vessel fleet has mapped more unexplored space than any other civilization.',
    homeworldType: 'Void (Deep Space)',
    metalBonus: -50,
    crystalBonus: 50,
    deuteriumBonus: 100,
    specialStartingTrait: 'Start with 1 Scout Ship & +15% expedition success rate',
    traits: { strength: 40, intelligence: 65, agility: 85, endurance: 70, charisma: 40, perception: 85 },
    bonuses: { mining: 5, research: 10, combat: 10, construction: 5, trade: 10, exploration: 35 },
    lifespan: 90,
    reproductionRate: 0.9,
    adaptability: 65,
  },
  {
    id: 'skarran',
    name: 'Skarran Hive Collective',
    category: 'Insectoid (Hive)',
    description: 'Massive insectoid hive mind spanning hundreds of systems with unmatched production.',
    bonus: 'Hive Production',
    bonusDetails: '+20% Building speed, +15% Population growth, Reduced unit cost',
    color: 'from-lime-500 to-green-600',
    icon: 'ri-bug-line',
    accent: 'lime',
    borderAccent: 'border-lime-400',
    bgAccent: 'bg-lime-400/15',
    lore: 'Operating as a single mind across billions of bodies, each Skarran caste serves a specific purpose. They do not understand individualism and view solitary races as dangerously chaotic.',
    homeworldType: 'Jungle (Hostile)',
    metalBonus: 100,
    crystalBonus: 100,
    deuteriumBonus: 0,
    specialStartingTrait: 'Population grows 15% faster, -10% unit training cost',
    traits: { strength: 70, intelligence: 35, agility: 55, endurance: 80, charisma: 10, perception: 50 },
    bonuses: { mining: 25, research: 5, combat: 15, construction: 30, trade: 5, exploration: 5 },
    lifespan: 40,
    reproductionRate: 4.0,
    adaptability: 75,
  },
];

export function getRaceById(id: RaceId): RaceDefinition {
  return RACES.find((r) => r.id === id) || RACES[0];
}