import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Starship {
  id: string;
  name: string;
  category: 'fighter' | 'corvette' | 'frigate' | 'destroyer' | 'cruiser' | 'battlecruiser' | 'battleship' | 'dreadnought' | 'carrier' | 'support' | 'special';
  class: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Transcendent' | 'Cosmic' | 'Universal' | 'Godlike';
  tier: number;
  level: number;
  maxLevel: number;
  owned: number;
  status: 'available' | 'locked' | 'blueprint';
  hasBlueprint: boolean;
  blueprintProgress?: number;
  description: string;
  role: string;
  stats: {
    hull: number;
    shield: number;
    armor: number;
    speed: number;
    agility: number;
    firepower: number;
    accuracy: number;
    evasion: number;
    cargoCapacity: number;
    fuelCapacity: number;
  };
  subStats: {
    structuralIntegrity: number;
    shieldRegeneration: number;
    armorPenetration: number;
    criticalChance: number;
    criticalDamage: number;
    sensorRange: number;
    jamming: number;
    stealth: number;
  };
  weapons: {
    primary: string[];
    secondary: string[];
    special: string[];
  };
  equipment: {
    engine: string;
    reactor: string;
    computer: string;
    sensors: string;
  };
  effects: {
    passive: string[];
    active: string[];
    unique: string[];
  };
  requirements: {
    metal: number;
    crystal: number;
    deuterium: number;
    antimatter: number;
    time: string;
    shipyard: number;
  };
  blueprintRequirements?: {
    fragments: number;
    currentFragments: number;
    researchPoints: number;
  };
}

interface CraftingMaterial {
  id: string;
  name: string;
  type: 'component' | 'material' | 'blueprint' | 'fragment';
  rarity: string;
  quantity: number;
  description: string;
  usedIn: string[];
}

export default function StarshipsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedShip, setSelectedShip] = useState<Starship | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'weapons' | 'equipment' | 'blueprint'>('overview');
  const [showCrafting, setShowCrafting] = useState(false);
  const [sortBy, setSortBy] = useState<'tier' | 'level' | 'power' | 'name'>('tier');

  const starships: Starship[] = [
    // FIGHTERS (Tier 1-100)
    {
      id: 'light-fighter',
      name: 'Light Fighter',
      category: 'fighter',
      class: 'Common',
      tier: 1,
      level: 1,
      maxLevel: 999,
      owned: 250,
      status: 'available',
      hasBlueprint: true,
      description: 'Fast and agile interceptor designed for quick strikes and reconnaissance missions.',
      role: 'Interceptor',
      stats: { hull: 400, shield: 100, armor: 10, speed: 12500, agility: 95, firepower: 50, accuracy: 85, evasion: 80, cargoCapacity: 50, fuelCapacity: 200 },
      subStats: { structuralIntegrity: 60, shieldRegeneration: 5, armorPenetration: 15, criticalChance: 12, criticalDamage: 150, sensorRange: 5, jamming: 0, stealth: 20 },
      weapons: { primary: ['Laser Cannon'], secondary: ['Missile Pod'], special: [] },
      equipment: { engine: 'Ion Drive', reactor: 'Fusion Core', computer: 'Basic AI', sensors: 'Standard Scanner' },
      effects: { passive: ['+20% Speed', '+15% Evasion'], active: ['Afterburner Boost'], unique: [] },
      requirements: { metal: 3000, crystal: 1000, deuterium: 0, antimatter: 0, time: '30s', shipyard: 1 }
    },
    {
      id: 'heavy-fighter',
      name: 'Heavy Fighter',
      category: 'fighter',
      class: 'Uncommon',
      tier: 15,
      level: 1,
      maxLevel: 999,
      owned: 180,
      status: 'available',
      hasBlueprint: true,
      description: 'Heavily armed fighter with enhanced shields and firepower for sustained combat.',
      role: 'Assault Fighter',
      stats: { hull: 1000, shield: 250, armor: 25, speed: 10000, agility: 75, firepower: 150, accuracy: 80, evasion: 60, cargoCapacity: 100, fuelCapacity: 300 },
      subStats: { structuralIntegrity: 75, shieldRegeneration: 10, armorPenetration: 25, criticalChance: 15, criticalDamage: 175, sensorRange: 6, jamming: 5, stealth: 10 },
      weapons: { primary: ['Plasma Cannon', 'Ion Blaster'], secondary: ['Heavy Missiles'], special: ['EMP Burst'] },
      equipment: { engine: 'Plasma Drive', reactor: 'Advanced Fusion', computer: 'Tactical AI', sensors: 'Enhanced Scanner' },
      effects: { passive: ['+30% Firepower', '+20% Shield'], active: ['Shield Overcharge'], unique: ['Armor Piercing Rounds'] },
      requirements: { metal: 6000, crystal: 4000, deuterium: 0, antimatter: 0, time: '1m', shipyard: 3 }
    },
    {
      id: 'stealth-fighter',
      name: 'Stealth Fighter',
      category: 'fighter',
      class: 'Rare',
      tier: 45,
      level: 1,
      maxLevel: 999,
      owned: 50,
      status: 'available',
      hasBlueprint: true,
      description: 'Advanced stealth technology makes this fighter nearly invisible to enemy sensors.',
      role: 'Stealth Interceptor',
      stats: { hull: 800, shield: 200, armor: 20, speed: 15000, agility: 90, firepower: 120, accuracy: 90, evasion: 95, cargoCapacity: 75, fuelCapacity: 250 },
      subStats: { structuralIntegrity: 70, shieldRegeneration: 8, armorPenetration: 30, criticalChance: 25, criticalDamage: 200, sensorRange: 8, jamming: 40, stealth: 85 },
      weapons: { primary: ['Stealth Laser'], secondary: ['Cloaked Missiles'], special: ['Assassination Strike'] },
      equipment: { engine: 'Quantum Drive', reactor: 'Antimatter Core', computer: 'Stealth AI', sensors: 'Cloaking Device' },
      effects: { passive: ['+50% Stealth', '+40% Critical Chance'], active: ['Cloak', 'First Strike Bonus'], unique: ['Undetectable'] },
      requirements: { metal: 15000, crystal: 10000, deuterium: 5000, antimatter: 100, time: '5m', shipyard: 8 }
    },
    {
      id: 'interceptor-mk2',
      name: 'Interceptor MK-II',
      category: 'fighter',
      class: 'Epic',
      tier: 75,
      level: 1,
      maxLevel: 999,
      owned: 25,
      status: 'available',
      hasBlueprint: true,
      description: 'Next-generation interceptor with quantum engines and devastating firepower.',
      role: 'Elite Interceptor',
      stats: { hull: 1500, shield: 400, armor: 35, speed: 18000, agility: 98, firepower: 250, accuracy: 95, evasion: 90, cargoCapacity: 100, fuelCapacity: 350 },
      subStats: { structuralIntegrity: 85, shieldRegeneration: 15, armorPenetration: 45, criticalChance: 30, criticalDamage: 250, sensorRange: 10, jamming: 20, stealth: 40 },
      weapons: { primary: ['Quantum Cannon', 'Photon Blaster'], secondary: ['Smart Missiles'], special: ['Quantum Strike'] },
      equipment: { engine: 'Quantum Warp Drive', reactor: 'Zero-Point Energy', computer: 'Quantum AI', sensors: 'Quantum Scanner' },
      effects: { passive: ['+60% Speed', '+50% Agility', '+40% Firepower'], active: ['Quantum Dash', 'Time Dilation'], unique: ['Quantum Superiority'] },
      requirements: { metal: 35000, crystal: 25000, deuterium: 15000, antimatter: 500, time: '15m', shipyard: 12 }
    },

    // CORVETTES (Tier 50-150)
    {
      id: 'patrol-corvette',
      name: 'Patrol Corvette',
      category: 'corvette',
      class: 'Common',
      tier: 50,
      level: 1,
      maxLevel: 999,
      owned: 120,
      status: 'available',
      hasBlueprint: true,
      description: 'Versatile patrol ship for system defense and escort duties.',
      role: 'Patrol Ship',
      stats: { hull: 4000, shield: 1000, armor: 50, speed: 8000, agility: 65, firepower: 400, accuracy: 75, evasion: 50, cargoCapacity: 500, fuelCapacity: 800 },
      subStats: { structuralIntegrity: 80, shieldRegeneration: 20, armorPenetration: 35, criticalChance: 10, criticalDamage: 150, sensorRange: 12, jamming: 10, stealth: 15 },
      weapons: { primary: ['Dual Laser Turrets'], secondary: ['Torpedo Launcher'], special: ['Point Defense'] },
      equipment: { engine: 'Impulse Drive', reactor: 'Fusion Reactor', computer: 'Combat AI', sensors: 'Long-Range Scanner' },
      effects: { passive: ['+25% Hull', '+20% Sensors'], active: ['Emergency Shields'], unique: [] },
      requirements: { metal: 20000, crystal: 15000, deuterium: 5000, antimatter: 0, time: '10m', shipyard: 5 }
    },
    {
      id: 'assault-corvette',
      name: 'Assault Corvette',
      category: 'corvette',
      class: 'Uncommon',
      tier: 80,
      level: 1,
      maxLevel: 999,
      owned: 75,
      status: 'available',
      hasBlueprint: true,
      description: 'Fast attack ship designed for hit-and-run tactics against larger vessels.',
      role: 'Fast Attack',
      stats: { hull: 6000, shield: 1500, armor: 75, speed: 9500, agility: 70, firepower: 800, accuracy: 80, evasion: 60, cargoCapacity: 600, fuelCapacity: 1000 },
      subStats: { structuralIntegrity: 85, shieldRegeneration: 25, armorPenetration: 50, criticalChance: 18, criticalDamage: 180, sensorRange: 14, jamming: 15, stealth: 20 },
      weapons: { primary: ['Plasma Cannons', 'Rail Guns'], secondary: ['Heavy Torpedoes'], special: ['Assault Mode'] },
      equipment: { engine: 'Advanced Impulse', reactor: 'Antimatter Reactor', computer: 'Tactical Computer', sensors: 'Combat Scanner' },
      effects: { passive: ['+40% Firepower', '+30% Speed'], active: ['Overcharge Weapons', 'Evasive Maneuvers'], unique: ['Hit and Run'] },
      requirements: { metal: 40000, crystal: 30000, deuterium: 15000, antimatter: 200, time: '20m', shipyard: 8 }
    },
    {
      id: 'stealth-corvette',
      name: 'Stealth Corvette',
      class: 'Rare',
      category: 'corvette',
      tier: 110,
      level: 1,
      maxLevel: 999,
      owned: 30,
      status: 'available',
      hasBlueprint: true,
      description: 'Advanced stealth corvette for covert operations and sabotage missions.',
      role: 'Covert Ops',
      stats: { hull: 5000, shield: 1200, armor: 60, speed: 11000, agility: 80, firepower: 600, accuracy: 90, evasion: 85, cargoCapacity: 400, fuelCapacity: 900 },
      subStats: { structuralIntegrity: 82, shieldRegeneration: 22, armorPenetration: 60, criticalChance: 35, criticalDamage: 220, sensorRange: 16, jamming: 60, stealth: 90 },
      weapons: { primary: ['Stealth Cannons'], secondary: ['Cloaked Torpedoes'], special: ['Sabotage Systems'] },
      equipment: { engine: 'Silent Drive', reactor: 'Dark Matter Core', computer: 'Infiltration AI', sensors: 'Advanced Cloak' },
      effects: { passive: ['+70% Stealth', '+50% Critical Damage'], active: ['Full Cloak', 'Sabotage', 'Silent Running'], unique: ['Ghost Ship'] },
      requirements: { metal: 60000, crystal: 45000, deuterium: 25000, antimatter: 800, time: '35m', shipyard: 10 }
    },

    // FRIGATES (Tier 100-200)
    {
      id: 'escort-frigate',
      name: 'Escort Frigate',
      category: 'frigate',
      class: 'Uncommon',
      tier: 100,
      level: 1,
      maxLevel: 999,
      owned: 90,
      status: 'available',
      hasBlueprint: true,
      description: 'Reliable escort ship with balanced offense and defense capabilities.',
      role: 'Escort',
      stats: { hull: 10000, shield: 3000, armor: 100, speed: 7000, agility: 55, firepower: 1500, accuracy: 75, evasion: 45, cargoCapacity: 1500, fuelCapacity: 2000 },
      subStats: { structuralIntegrity: 90, shieldRegeneration: 40, armorPenetration: 55, criticalChance: 12, criticalDamage: 160, sensorRange: 18, jamming: 20, stealth: 10 },
      weapons: { primary: ['Beam Cannons', 'Missile Batteries'], secondary: ['Torpedo Tubes'], special: ['Defensive Screen'] },
      equipment: { engine: 'Warp Drive', reactor: 'Fusion Array', computer: 'Fleet AI', sensors: 'Fleet Scanner' },
      effects: { passive: ['+30% Shield', '+25% Hull'], active: ['Shield Boost', 'Point Defense'], unique: ['Fleet Support'] },
      requirements: { metal: 80000, crystal: 60000, deuterium: 30000, antimatter: 500, time: '45m', shipyard: 10 }
    },
    {
      id: 'missile-frigate',
      name: 'Missile Frigate',
      category: 'frigate',
      class: 'Rare',
      tier: 135,
      level: 1,
      maxLevel: 999,
      owned: 45,
      status: 'available',
      hasBlueprint: true,
      description: 'Specialized long-range missile platform with devastating alpha strike capability.',
      role: 'Missile Platform',
      stats: { hull: 8000, shield: 2500, armor: 80, speed: 6500, agility: 50, firepower: 2500, accuracy: 85, evasion: 40, cargoCapacity: 1000, fuelCapacity: 1800 },
      subStats: { structuralIntegrity: 85, shieldRegeneration: 35, armorPenetration: 80, criticalChance: 20, criticalDamage: 200, sensorRange: 25, jamming: 15, stealth: 15 },
      weapons: { primary: ['Missile Pods'], secondary: ['Heavy Missile Launchers'], special: ['Missile Barrage'] },
      equipment: { engine: 'Standard Warp', reactor: 'Enhanced Fusion', computer: 'Targeting Computer', sensors: 'Long-Range Targeting' },
      effects: { passive: ['+80% Missile Damage', '+50% Range'], active: ['Alpha Strike', 'Missile Swarm'], unique: ['Overwhelming Firepower'] },
      requirements: { metal: 100000, crystal: 80000, deuterium: 40000, antimatter: 1000, time: '60m', shipyard: 12 }
    },
    {
      id: 'shield-frigate',
      name: 'Shield Frigate',
      category: 'frigate',
      class: 'Epic',
      tier: 170,
      level: 1,
      maxLevel: 999,
      owned: 20,
      status: 'available',
      hasBlueprint: true,
      description: 'Advanced defensive frigate capable of projecting shields to protect allied vessels.',
      role: 'Shield Support',
      stats: { hull: 12000, shield: 8000, armor: 120, speed: 6000, agility: 45, firepower: 1000, accuracy: 70, evasion: 35, cargoCapacity: 1200, fuelCapacity: 2200 },
      subStats: { structuralIntegrity: 95, shieldRegeneration: 100, armorPenetration: 40, criticalChance: 8, criticalDamage: 140, sensorRange: 20, jamming: 25, stealth: 5 },
      weapons: { primary: ['Defensive Turrets'], secondary: ['Shield Projectors'], special: ['Fleet Shield'] },
      equipment: { engine: 'Efficient Warp', reactor: 'Shield Generator Array', computer: 'Defense AI', sensors: 'Shield Harmonics' },
      effects: { passive: ['+150% Shield Strength', '+100% Shield Regen'], active: ['Project Shield', 'Shield Overload', 'Emergency Barrier'], unique: ['Fleet Guardian'] },
      requirements: { metal: 150000, crystal: 120000, deuterium: 60000, antimatter: 2000, time: '90m', shipyard: 14 }
    },

    // DESTROYERS (Tier 150-300)
    {
      id: 'light-destroyer',
      name: 'Light Destroyer',
      category: 'destroyer',
      class: 'Rare',
      tier: 150,
      level: 1,
      maxLevel: 999,
      owned: 60,
      status: 'available',
      hasBlueprint: true,
      description: 'Fast destroyer with powerful weapons for hunting down smaller vessels.',
      role: 'Hunter-Killer',
      stats: { hull: 20000, shield: 6000, armor: 150, speed: 6500, agility: 50, firepower: 3500, accuracy: 80, evasion: 40, cargoCapacity: 3000, fuelCapacity: 4000 },
      subStats: { structuralIntegrity: 100, shieldRegeneration: 60, armorPenetration: 70, criticalChance: 15, criticalDamage: 180, sensorRange: 22, jamming: 30, stealth: 20 },
      weapons: { primary: ['Heavy Beam Cannons', 'Plasma Turrets'], secondary: ['Torpedo Batteries'], special: ['Hunter Protocol'] },
      equipment: { engine: 'Fast Warp Drive', reactor: 'Antimatter Reactor', computer: 'Hunter AI', sensors: 'Tracking System' },
      effects: { passive: ['+50% Damage vs Smaller Ships', '+40% Speed'], active: ['Pursuit Mode', 'Target Lock'], unique: ['Relentless Hunter'] },
      requirements: { metal: 200000, crystal: 150000, deuterium: 80000, antimatter: 3000, time: '2h', shipyard: 15 }
    },
    {
      id: 'heavy-destroyer',
      name: 'Heavy Destroyer',
      category: 'destroyer',
      class: 'Epic',
      tier: 200,
      level: 1,
      maxLevel: 999,
      owned: 35,
      status: 'available',
      hasBlueprint: true,
      description: 'Heavily armed and armored destroyer capable of engaging capital ships.',
      role: 'Line Breaker',
      stats: { hull: 35000, shield: 10000, armor: 250, speed: 5500, agility: 40, firepower: 6000, accuracy: 75, evasion: 30, cargoCapacity: 4000, fuelCapacity: 5000 },
      subStats: { structuralIntegrity: 110, shieldRegeneration: 80, armorPenetration: 100, criticalChance: 18, criticalDamage: 200, sensorRange: 24, jamming: 35, stealth: 10 },
      weapons: { primary: ['Heavy Plasma Cannons', 'Rail Gun Arrays'], secondary: ['Heavy Torpedoes', 'Missile Pods'], special: ['Broadside Barrage'] },
      equipment: { engine: 'Heavy Warp Drive', reactor: 'Dual Antimatter Cores', computer: 'Battle Computer', sensors: 'Combat Array' },
      effects: { passive: ['+70% Firepower', '+60% Armor'], active: ['Full Broadside', 'Armor Piercing', 'Ramming Speed'], unique: ['Capital Ship Killer'] },
      requirements: { metal: 350000, crystal: 250000, deuterium: 150000, antimatter: 5000, time: '3h', shipyard: 18 }
    },
    {
      id: 'stealth-destroyer',
      name: 'Phantom Destroyer',
      category: 'destroyer',
      class: 'Legendary',
      tier: 275,
      level: 1,
      maxLevel: 999,
      owned: 10,
      status: 'blueprint',
      hasBlueprint: true,
      blueprintProgress: 65,
      description: 'Legendary stealth destroyer that can strike from the shadows with devastating precision.',
      role: 'Ghost Assassin',
      stats: { hull: 25000, shield: 8000, armor: 180, speed: 7500, agility: 60, firepower: 8000, accuracy: 95, evasion: 75, cargoCapacity: 3500, fuelCapacity: 4500 },
      subStats: { structuralIntegrity: 105, shieldRegeneration: 70, armorPenetration: 150, criticalChance: 45, criticalDamage: 300, sensorRange: 28, jamming: 80, stealth: 95 },
      weapons: { primary: ['Phantom Cannons'], secondary: ['Shadow Torpedoes'], special: ['Assassination Strike', 'Void Cloak'] },
      equipment: { engine: 'Quantum Stealth Drive', reactor: 'Dark Energy Core', computer: 'Phantom AI', sensors: 'Dimensional Cloak' },
      effects: { passive: ['+90% Stealth', '+80% Critical Damage', '+60% First Strike'], active: ['Perfect Cloak', 'Dimensional Strike', 'Shadow Form'], unique: ['Phantom Protocol', 'Undetectable Death'] },
      requirements: { metal: 500000, crystal: 400000, deuterium: 250000, antimatter: 10000, time: '5h', shipyard: 20 },
      blueprintRequirements: { fragments: 100, currentFragments: 65, researchPoints: 50000 }
    },

    // CRUISERS (Tier 200-400)
    {
      id: 'light-cruiser',
      name: 'Light Cruiser',
      category: 'cruiser',
      class: 'Rare',
      tier: 200,
      level: 1,
      maxLevel: 999,
      owned: 50,
      status: 'available',
      hasBlueprint: true,
      description: 'Versatile cruiser with balanced capabilities for fleet operations.',
      role: 'Multi-Role',
      stats: { hull: 50000, shield: 15000, armor: 300, speed: 5000, agility: 35, firepower: 8000, accuracy: 75, evasion: 28, cargoCapacity: 8000, fuelCapacity: 10000 },
      subStats: { structuralIntegrity: 120, shieldRegeneration: 100, armorPenetration: 90, criticalChance: 15, criticalDamage: 175, sensorRange: 30, jamming: 40, stealth: 15 },
      weapons: { primary: ['Cruiser Cannons', 'Beam Arrays'], secondary: ['Missile Batteries', 'Torpedo Launchers'], special: ['Multi-Target Lock'] },
      equipment: { engine: 'Cruiser Warp Drive', reactor: 'Fusion Core Array', computer: 'Fleet Command AI', sensors: 'Advanced Scanner Array' },
      effects: { passive: ['+50% Hull', '+40% Firepower'], active: ['Coordinated Strike', 'Shield Harmonics'], unique: ['Fleet Backbone'] },
      requirements: { metal: 600000, crystal: 450000, deuterium: 300000, antimatter: 8000, time: '6h', shipyard: 20 }
    },
    {
      id: 'heavy-cruiser',
      name: 'Heavy Cruiser',
      category: 'cruiser',
      class: 'Epic',
      tier: 280,
      level: 1,
      maxLevel: 999,
      owned: 28,
      status: 'available',
      hasBlueprint: true,
      description: 'Powerful heavy cruiser with devastating firepower and strong defenses.',
      role: 'Heavy Assault',
      stats: { hull: 80000, shield: 25000, armor: 500, speed: 4500, agility: 30, firepower: 15000, accuracy: 78, evasion: 22, cargoCapacity: 12000, fuelCapacity: 15000 },
      subStats: { structuralIntegrity: 135, shieldRegeneration: 150, armorPenetration: 130, criticalChance: 20, criticalDamage: 210, sensorRange: 32, jamming: 45, stealth: 10 },
      weapons: { primary: ['Heavy Plasma Arrays', 'Graviton Cannons'], secondary: ['Heavy Missile Pods', 'Torpedo Batteries'], special: ['Devastating Barrage'] },
      equipment: { engine: 'Heavy Warp Core', reactor: 'Antimatter Array', computer: 'Tactical Battle AI', sensors: 'Combat Sensor Suite' },
      effects: { passive: ['+80% Firepower', '+70% Armor'], active: ['Full Assault', 'Armor Break', 'Shield Penetration'], unique: ['Unstoppable Force'] },
      requirements: { metal: 1000000, crystal: 750000, deuterium: 500000, antimatter: 15000, time: '10h', shipyard: 22 }
    },
    {
      id: 'battle-cruiser',
      name: 'Battle Cruiser',
      category: 'battlecruiser',
      class: 'Legendary',
      tier: 350,
      level: 1,
      maxLevel: 999,
      owned: 15,
      status: 'available',
      hasBlueprint: true,
      description: 'Elite battle cruiser combining speed, firepower, and survivability.',
      role: 'Elite Warship',
      stats: { hull: 120000, shield: 40000, armor: 700, speed: 5500, agility: 38, firepower: 25000, accuracy: 82, evasion: 30, cargoCapacity: 15000, fuelCapacity: 20000 },
      subStats: { structuralIntegrity: 150, shieldRegeneration: 200, armorPenetration: 180, criticalChance: 25, criticalDamage: 250, sensorRange: 35, jamming: 50, stealth: 20 },
      weapons: { primary: ['Quantum Cannons', 'Plasma Lance Arrays'], secondary: ['Advanced Missile Systems', 'Graviton Torpedoes'], special: ['Quantum Strike', 'Overwhelming Force'] },
      equipment: { engine: 'Quantum Warp Drive', reactor: 'Zero-Point Reactor', computer: 'Quantum Battle AI', sensors: 'Quantum Sensor Array' },
      effects: { passive: ['+100% Firepower', '+90% Speed', '+80% Shields'], active: ['Quantum Barrage', 'Time Dilation Field', 'Perfect Strike'], unique: ['Legendary Warship', 'Fleet Commander'] },
      requirements: { metal: 2000000, crystal: 1500000, deuterium: 1000000, antimatter: 30000, time: '18h', shipyard: 25 }
    },

    // BATTLESHIPS (Tier 300-500)
    {
      id: 'battleship',
      name: 'Battleship',
      category: 'battleship',
      class: 'Epic',
      tier: 300,
      level: 1,
      maxLevel: 999,
      owned: 25,
      status: 'available',
      hasBlueprint: true,
      description: 'Massive battleship with overwhelming firepower and impenetrable defenses.',
      role: 'Capital Ship',
      stats: { hull: 200000, shield: 60000, armor: 1000, speed: 4000, agility: 25, firepower: 40000, accuracy: 80, evasion: 18, cargoCapacity: 25000, fuelCapacity: 35000 },
      subStats: { structuralIntegrity: 180, shieldRegeneration: 300, armorPenetration: 200, criticalChance: 22, criticalDamage: 220, sensorRange: 40, jamming: 55, stealth: 8 },
      weapons: { primary: ['Super Heavy Cannons', 'Plasma Broadside Arrays'], secondary: ['Capital Missile Batteries', 'Heavy Torpedo Tubes'], special: ['Full Broadside', 'Siege Mode'] },
      equipment: { engine: 'Capital Warp Drive', reactor: 'Antimatter Core Array', computer: 'Capital Ship AI', sensors: 'Capital Sensor Suite' },
      effects: { passive: ['+120% Firepower', '+100% Hull', '+90% Armor'], active: ['Siege Bombardment', 'Fortress Mode', 'Shield Wall'], unique: ['Capital Ship Dominance'] },
      requirements: { metal: 3500000, crystal: 2500000, deuterium: 1800000, antimatter: 50000, time: '24h', shipyard: 28 }
    },
    {
      id: 'dreadnought',
      name: 'Dreadnought',
      category: 'dreadnought',
      class: 'Legendary',
      tier: 420,
      level: 1,
      maxLevel: 999,
      owned: 8,
      status: 'available',
      hasBlueprint: true,
      description: 'Legendary dreadnought class vessel, the ultimate expression of naval power.',
      role: 'Super Capital',
      stats: { hull: 350000, shield: 100000, armor: 1500, speed: 3500, agility: 20, firepower: 70000, accuracy: 85, evasion: 15, cargoCapacity: 40000, fuelCapacity: 50000 },
      subStats: { structuralIntegrity: 220, shieldRegeneration: 500, armorPenetration: 300, criticalChance: 28, criticalDamage: 280, sensorRange: 45, jamming: 60, stealth: 5 },
      weapons: { primary: ['Dreadnought Cannons', 'Quantum Plasma Arrays'], secondary: ['Super Heavy Missiles', 'Graviton Torpedoes'], special: ['Apocalypse Barrage', 'Titan Strike'] },
      equipment: { engine: 'Titan Warp Core', reactor: 'Zero-Point Array', computer: 'Dreadnought AI', sensors: 'Omniscient Scanner' },
      effects: { passive: ['+180% Firepower', '+150% Hull', '+130% Shields'], active: ['Dreadnought Protocol', 'Unstoppable Advance', 'Fleet Annihilation'], unique: ['Legendary Dreadnought', 'System Destroyer'] },
      requirements: { metal: 6000000, crystal: 4500000, deuterium: 3000000, antimatter: 100000, time: '48h', shipyard: 30 }
    },
    {
      id: 'titan-battleship',
      name: 'Titan Battleship',
      category: 'battleship',
      class: 'Mythic',
      tier: 550,
      level: 1,
      maxLevel: 999,
      owned: 3,
      status: 'blueprint',
      hasBlueprint: true,
      blueprintProgress: 40,
      description: 'Mythic titan-class battleship capable of destroying entire fleets single-handedly.',
      role: 'Titan Warship',
      stats: { hull: 600000, shield: 180000, armor: 2500, speed: 4200, agility: 28, firepower: 150000, accuracy: 90, evasion: 20, cargoCapacity: 60000, fuelCapacity: 80000 },
      subStats: { structuralIntegrity: 280, shieldRegeneration: 800, armorPenetration: 500, criticalChance: 35, criticalDamage: 350, sensorRange: 55, jamming: 70, stealth: 15 },
      weapons: { primary: ['Titan Cannons', 'Reality Breaker Arrays'], secondary: ['Dimensional Missiles', 'Quantum Torpedoes'], special: ["Titan's Wrath", 'Fleet Obliteration', 'Dimensional Strike'] },
      equipment: { engine: 'Dimensional Warp Core', reactor: 'Dark Matter Reactor', computer: 'Titan AI', sensors: 'Reality Scanner' },
      effects: { passive: ['+300% Firepower', '+250% Hull', '+200% Shields'], active: ['Titan Mode', 'Reality Distortion', 'Unstoppable Titan'], unique: ['Mythic Titan', 'Fleet Destroyer', 'System Annihilator'] },
      requirements: { metal: 12000000, crystal: 9000000, deuterium: 6000000, antimatter: 250000, time: '96h', shipyard: 35 },
      blueprintRequirements: { fragments: 200, currentFragments: 80, researchPoints: 150000 }
    },

    // CARRIERS (Tier 250-450)
    {
      id: 'light-carrier',
      name: 'Light Carrier',
      category: 'carrier',
      class: 'Rare',
      tier: 250,
      level: 1,
      maxLevel: 999,
      owned: 40,
      status: 'available',
      hasBlueprint: true,
      description: 'Carrier vessel capable of deploying fighter squadrons for fleet support.',
      role: 'Fighter Carrier',
      stats: { hull: 60000, shield: 20000, armor: 400, speed: 4500, agility: 30, firepower: 5000, accuracy: 70, evasion: 25, cargoCapacity: 20000, fuelCapacity: 25000 },
      subStats: { structuralIntegrity: 130, shieldRegeneration: 120, armorPenetration: 60, criticalChance: 10, criticalDamage: 150, sensorRange: 35, jamming: 45, stealth: 12 },
      weapons: { primary: ['Defensive Turrets'], secondary: ['Point Defense Systems'], special: ['Fighter Launch', 'Squadron Deploy'] },
      equipment: { engine: 'Carrier Warp Drive', reactor: 'Carrier Fusion Array', computer: 'Carrier Command AI', sensors: 'Fleet Coordination System' },
      effects: { passive: ['+500 Fighter Capacity', '+40% Fighter Damage'], active: ['Launch Fighters', 'Recall Squadron', 'Fighter Screen'], unique: ['Carrier Operations'] },
      requirements: { metal: 800000, crystal: 600000, deuterium: 400000, antimatter: 12000, time: '12h', shipyard: 22 }
    },
    {
      id: 'fleet-carrier',
      name: 'Fleet Carrier',
      category: 'carrier',
      class: 'Epic',
      tier: 380,
      level: 1,
      maxLevel: 999,
      owned: 18,
      status: 'available',
      hasBlueprint: true,
      description: 'Massive fleet carrier capable of deploying multiple fighter and bomber wings.',
      role: 'Super Carrier',
      stats: { hull: 150000, shield: 50000, armor: 800, speed: 4000, agility: 25, firepower: 12000, accuracy: 75, evasion: 20, cargoCapacity: 50000, fuelCapacity: 60000 },
      subStats: { structuralIntegrity: 170, shieldRegeneration: 250, armorPenetration: 80, criticalChance: 12, criticalDamage: 160, sensorRange: 42, jamming: 55, stealth: 10 },
      weapons: { primary: ['Carrier Defense Arrays'], secondary: ['Heavy Point Defense'], special: ['Mass Fighter Launch', 'Bomber Strike', 'Fighter Swarm'] },
      equipment: { engine: 'Super Carrier Drive', reactor: 'Antimatter Carrier Array', computer: 'Fleet Carrier AI', sensors: 'Advanced Fleet Coordination' },
      effects: { passive: ['+2000 Fighter Capacity', '+1000 Bomber Capacity', '+60% Squadron Damage'], active: ['Full Launch', 'Coordinated Strike', 'Fighter Superiority'], unique: ['Fleet Carrier Dominance', 'Air Superiority'] },
      requirements: { metal: 2500000, crystal: 2000000, deuterium: 1500000, antimatter: 40000, time: '36h', shipyard: 26 }
    },
    {
      id: 'super-carrier',
      name: 'Super Carrier',
      category: 'carrier',
      class: 'Legendary',
      tier: 480,
      level: 1,
      maxLevel: 999,
      owned: 5,
      status: 'blueprint',
      hasBlueprint: true,
      blueprintProgress: 55,
      description: 'Legendary super carrier capable of deploying entire air armadas.',
      role: 'Titan Carrier',
      stats: { hull: 300000, shield: 90000, armor: 1200, speed: 3800, agility: 22, firepower: 20000, accuracy: 78, evasion: 18, cargoCapacity: 100000, fuelCapacity: 120000 },
      subStats: { structuralIntegrity: 200, shieldRegeneration: 450, armorPenetration: 100, criticalChance: 15, criticalDamage: 180, sensorRange: 50, jamming: 65, stealth: 12 },
      weapons: { primary: ['Super Carrier Batteries'], secondary: ['Advanced Defense Grid'], special: ['Armada Launch', 'Total Air Superiority', 'Fighter Storm'] },
      equipment: { engine: 'Titan Carrier Drive', reactor: 'Zero-Point Carrier Core', computer: 'Super Carrier AI', sensors: 'Omniscient Fleet Control' },
      effects: { passive: ['+5000 Fighter Capacity', '+3000 Bomber Capacity', '+100% Squadron Damage', '+80% Squadron Speed'], active: ['Full Armada Launch', 'Overwhelming Air Power', 'Fighter Dominance'], unique: ['Legendary Carrier', 'Air Armada', 'Sky Fortress'] },
      requirements: { metal: 8000000, crystal: 6000000, deuterium: 4500000, antimatter: 150000, time: '72h', shipyard: 32 },
      blueprintRequirements: { fragments: 180, currentFragments: 99, researchPoints: 120000 }
    },

    // SUPPORT SHIPS (Tier 100-400)
    {
      id: 'repair-ship',
      name: 'Repair Ship',
      category: 'support',
      class: 'Uncommon',
      tier: 100,
      level: 1,
      maxLevel: 999,
      owned: 80,
      status: 'available',
      hasBlueprint: true,
      description: 'Specialized support vessel for repairing damaged ships during and after combat.',
      role: 'Fleet Repair',
      stats: { hull: 15000, shield: 5000, armor: 100, speed: 5000, agility: 40, firepower: 500, accuracy: 60, evasion: 35, cargoCapacity: 5000, fuelCapacity: 8000 },
      subStats: { structuralIntegrity: 100, shieldRegeneration: 80, armorPenetration: 20, criticalChance: 5, criticalDamage: 120, sensorRange: 25, jamming: 30, stealth: 15 },
      weapons: { primary: ['Defensive Lasers'], secondary: ['Repair Drones'], special: ['Emergency Repair', 'Hull Restoration'] },
      equipment: { engine: 'Support Drive', reactor: 'Repair Bay Reactor', computer: 'Repair AI', sensors: 'Damage Scanner' },
      effects: { passive: ['+50% Repair Speed', '+40% Repair Efficiency'], active: ['Mass Repair', 'Emergency Hull Patch', 'Shield Restoration'], unique: ['Fleet Medic'] },
      requirements: { metal: 100000, crystal: 80000, deuterium: 50000, antimatter: 1000, time: '2h', shipyard: 12 }
    },
    {
      id: 'supply-ship',
      name: 'SupplyShip',
      category: 'support',
      class: 'Rare',
      tier: 180,
      level: 1,
      maxLevel: 999,
      owned: 55,
      status: 'available',
      hasBlueprint: true,
      description: 'Logistics vessel for resupplying fleets with ammunition, fuel, and resources.',
      role: 'Fleet Logistics',
      stats: { hull: 25000, shield: 8000, armor: 150, speed: 4800, agility: 35, firepower: 800, accuracy: 65, evasion: 30, cargoCapacity: 50000, fuelCapacity: 40000 },
      subStats: { structuralIntegrity: 110, shieldRegeneration: 90, armorPenetration: 25, criticalChance: 6, criticalDamage: 130, sensorRange: 28, jamming: 35, stealth: 18 },
      weapons: { primary: ['Light Defense Turrets'], secondary: ['Supply Drones'], special: ['Rapid Resupply', 'Emergency Fuel Transfer'] },
      equipment: { engine: 'Cargo Warp Drive', reactor: 'Logistics Reactor', computer: 'Supply AI', sensors: 'Cargo Scanner' },
      effects: { passive: ['+200% Cargo Capacity', '+100% Fuel Capacity'], active: ['Fleet Resupply', 'Emergency Ammunition', 'Fuel Transfer'], unique: ['Logistics Master', 'Fleet Sustainer'] },
      requirements: { metal: 200000, crystal: 150000, deuterium: 100000, antimatter: 2500, time: '4h', shipyard: 16 }
    },
    {
      id: 'command-ship',
      name: 'Command Ship',
      category: 'support',
      class: 'Epic',
      tier: 320,
      level: 1,
      maxLevel: 999,
      owned: 22,
      status: 'available',
      hasBlueprint: true,
      description: 'Advanced command vessel providing fleet-wide tactical bonuses and coordination.',
      role: 'Fleet Command',
      stats: { hull: 100000, shield: 35000, armor: 600, speed: 4500, agility: 32, firepower: 8000, accuracy: 80, evasion: 28, cargoCapacity: 15000, fuelCapacity: 25000 },
      subStats: { structuralIntegrity: 150, shieldRegeneration: 180, armorPenetration: 90, criticalChance: 18, criticalDamage: 190, sensorRange: 60, jamming: 70, stealth: 20 },
      weapons: { primary: ['Command Batteries'], secondary: ['Tactical Missiles'], special: ['Fleet Coordination', 'Tactical Override'] },
      equipment: { engine: 'Command Warp Drive', reactor: 'Command Core Array', computer: 'Fleet Command AI', sensors: 'Omniscient Battle Network' },
      effects: { passive: ['+30% Fleet Damage', '+25% Fleet Defense', '+20% Fleet Speed'], active: ['Tactical Genius', 'Perfect Coordination', 'Fleet Synergy'], unique: ['Fleet Commander', 'Tactical Mastermind', 'Battle Coordinator'] },
      requirements: { metal: 1500000, crystal: 1200000, deuterium: 800000, antimatter: 25000, time: '20h', shipyard: 24 }
    },
    {
      id: 'science-vessel',
      name: 'Science Vessel',
      category: 'support',
      class: 'Rare',
      tier: 220,
      level: 1,
      maxLevel: 999,
      owned: 35,
      status: 'available',
      hasBlueprint: true,
      description: 'Research vessel for scanning anomalies and gathering scientific data.',
      role: 'Research',
      stats: { hull: 30000, shield: 10000, armor: 200, speed: 5500, agility: 45, firepower: 1000, accuracy: 70, evasion: 40, cargoCapacity: 8000, fuelCapacity: 15000 },
      subStats: { structuralIntegrity: 115, shieldRegeneration: 100, armorPenetration: 30, criticalChance: 8, criticalDamage: 140, sensorRange: 80, jamming: 40, stealth: 25 },
      weapons: { primary: ['Research Lasers'], secondary: ['Probe Launchers'], special: ['Deep Scan', 'Anomaly Analysis'] },
      equipment: { engine: 'Research Drive', reactor: 'Science Reactor', computer: 'Research AI', sensors: 'Advanced Science Scanner' },
      effects: { passive: ['+100% Scan Range', '+80% Research Speed'], active: ['Deep Space Scan', 'Anomaly Detection', 'Data Collection'], unique: ['Scientific Discovery', 'Research Bonus'] },
      requirements: { metal: 300000, crystal: 400000, deuterium: 200000, antimatter: 5000, time: '8h', shipyard: 18 }
    },

    // SPECIAL SHIPS (Tier 400-999)
    {
      id: 'death-star',
      name: 'Death Star',
      category: 'special',
      class: 'Mythic',
      tier: 750,
      level: 1,
      maxLevel: 999,
      owned: 1,
      status: 'blueprint',
      hasBlueprint: true,
      blueprintProgress: 25,
      description: 'Planet-destroying superweapon capable of annihilating entire worlds.',
      role: 'Planet Killer',
      stats: { hull: 1000000, shield: 300000, armor: 5000, speed: 1000, agility: 5, firepower: 500000, accuracy: 100, evasion: 5, cargoCapacity: 200000, fuelCapacity: 500000 },
      subStats: { structuralIntegrity: 500, shieldRegeneration: 1500, armorPenetration: 1000, criticalChance: 50, criticalDamage: 500, sensorRange: 100, jamming: 90, stealth: 5 },
      weapons: { primary: ['Superlaser'], secondary: ['Turbolaser Batteries'], special: ['Planet Destruction', 'System Annihilation'] },
      equipment: { engine: 'Hypermatter Reactor Drive', reactor: 'Hypermatter Core', computer: 'Death Star AI', sensors: 'Galactic Scanner' },
      effects: { passive: ['+1000% Firepower', '+500% Hull'], active: ['Destroy Planet', 'Obliterate Fleet', 'System Destruction'], unique: ['Planet Killer', 'Ultimate Weapon', 'Galactic Terror'] },
      requirements: { metal: 50000000, crystal: 40000000, deuterium: 30000000, antimatter: 1000000, time: '720h', shipyard: 40 },
      blueprintRequirements: { fragments: 500, currentFragments: 125, researchPoints: 500000 }
    },
    {
      id: 'world-ship',
      name: 'World Ship',
      category: 'special',
      class: 'Transcendent',
      tier: 850,
      level: 1,
      maxLevel: 999,
      owned: 0,
      status: 'locked',
      hasBlueprint: false,
      description: 'Mobile planet-sized vessel housing entire civilizations and fleets.',
      role: 'Mobile World',
      stats: { hull: 2000000, shield: 600000, armor: 8000, speed: 500, agility: 2, firepower: 300000, accuracy: 95, evasion: 3, cargoCapacity: 1000000, fuelCapacity: 2000000 },
      subStats: { structuralIntegrity: 800, shieldRegeneration: 3000, armorPenetration: 800, criticalChance: 40, criticalDamage: 400, sensorRange: 150, jamming: 95, stealth: 10 },
      weapons: { primary: ['World Cannons'], secondary: ['Planetary Defense Grid'], special: ['Continental Strike', 'World Barrier'] },
      equipment: { engine: 'Planetary Drive', reactor: 'Stellar Core', computer: 'World AI', sensors: 'Universal Scanner' },
      effects: { passive: ['+500% All Stats', '+1000% Production'], active: ['Deploy Fleets', 'Planetary Shield', 'Continental Bombardment'], unique: ['Mobile Civilization', 'Self-Sustaining', 'Fleet Factory'] },
      requirements: { metal: 100000000, crystal: 80000000, deuterium: 60000000, antimatter: 2000000, time: '1440h', shipyard: 45 }
    },
    {
      id: 'dimensional-ship',
      name: 'Dimensional Warship',
      category: 'special',
      class: 'Cosmic',
      tier: 920,
      level: 1,
      maxLevel: 999,
      owned: 0,
      status: 'locked',
      hasBlueprint: false,
      description: 'Ship that exists across multiple dimensions simultaneously, nearly invincible.',
      role: 'Dimensional Warrior',
      stats: { hull: 1500000, shield: 800000, armor: 10000, speed: 8000, agility: 60, firepower: 800000, accuracy: 98, evasion: 85, cargoCapacity: 500000, fuelCapacity: 1000000 },
      subStats: { structuralIntegrity: 1000, shieldRegeneration: 5000, armorPenetration: 2000, criticalChance: 60, criticalDamage: 600, sensorRange: 200, jamming: 100, stealth: 95 },
      weapons: { primary: ['Dimensional Cannons'], secondary: ['Reality Breakers'], special: ['Dimensional Strike', 'Phase Shift', 'Reality Tear'] },
      equipment: { engine: 'Dimensional Drive', reactor: 'Dimensional Core', computer: 'Dimensional AI', sensors: 'Omniversal Scanner' },
      effects: { passive: ['+1000% All Combat Stats', '+500% Evasion'], active: ['Phase Through Attacks', 'Dimensional Assault', 'Reality Manipulation'], unique: ['Dimensional Being', 'Untouchable', 'Reality Bender'] },
      requirements: { metal: 200000000, crystal: 150000000, deuterium: 100000000, antimatter: 5000000, time: '2160h', shipyard: 50 }
    },
    {
      id: 'god-ship',
      name: 'God Ship',
      category: 'special',
      class: 'Godlike',
      tier: 999,
      level: 1,
      maxLevel: 999,
      owned: 0,
      status: 'locked',
      hasBlueprint: false,
      description: 'The ultimate vessel, transcending physical reality itself. Grants godlike power.',
      role: 'Divine Entity',
      stats: { hull: 10000000, shield: 5000000, armor: 50000, speed: 50000, agility: 100, firepower: 5000000, accuracy: 100, evasion: 100, cargoCapacity: 10000000, fuelCapacity: 10000000 },
      subStats: { structuralIntegrity: 10000, shieldRegeneration: 50000, armorPenetration: 10000, criticalChance: 100, criticalDamage: 1000, sensorRange: 999, jamming: 100, stealth: 100 },
      weapons: { primary: ['Divine Wrath'], secondary: ['Creation/Destruction'], special: ['Omnipotence', 'Reality Rewrite', 'Universal Annihilation'] },
      equipment: { engine: 'Divine Drive', reactor: 'Universal Core', computer: 'Omniscient AI', sensors: 'All-Seeing Eye' },
      effects: { passive: ['+10000% All Stats', 'Invincibility', 'Omnipotence'], active: ['Create/Destroy Anything', 'Rewrite Reality', 'Absolute Power'], unique: ['Godhood', 'Omnipotent', 'Omniscient', 'Omnipresent'] },
      requirements: { metal: 1000000000, crystal: 1000000000, deuterium: 1000000000, antimatter: 100000000, time: '10000h', shipyard: 999 }
    }
  ];

  const craftingMaterials: CraftingMaterial[] = [
    { id: 'titanium-alloy', name: 'Titanium Alloy', type: 'material', rarity: 'Common', quantity: 15000, description: 'Basic hull construction material', usedIn: ['Light Fighter', 'Heavy Fighter', 'Patrol Corvette'] },
    { id: 'crystal-matrix', name: 'Crystal Matrix', type: 'material', rarity: 'Uncommon', quantity: 8500, description: 'Advanced energy systems component', usedIn: ['Stealth Fighter', 'Assault Corvette', 'Escort Frigate'] },
    { id: 'antimatter-cell', name: 'Antimatter Cell', type: 'material', rarity: 'Rare', quantity: 2200, description: 'High-energy power source', usedIn: ['Missile Frigate', 'Light Destroyer', 'Heavy Destroyer'] },
    { id: 'quantum-processor', name: 'Quantum Processor', type: 'component', rarity: 'Epic', quantity: 850, description: 'Advanced AI and targeting systems', usedIn: ['Battle Cruiser', 'Battleship', 'Dreadnought'] },
    { id: 'dark-matter-core', name: 'Dark Matter Core', type: 'component', rarity: 'Legendary', quantity: 180, description: 'Exotic energy reactor core', usedIn: ['Phantom Destroyer', 'Titan Battleship', 'Super Carrier'] },
    { id: 'dimensional-crystal', name: 'Dimensional Crystal', type: 'material', rarity: 'Mythic', quantity: 45, description: 'Reality-bending material', usedIn: ['Death Star', 'World Ship', 'Dimensional Warship'] },
    { id: 'fighter-blueprint', name: 'Fighter Blueprint Fragment', type: 'fragment', rarity: 'Common', quantity: 320, description: 'Blueprint fragment for fighter-class ships', usedIn: ['Light Fighter', 'Heavy Fighter', 'Stealth Fighter'] },
    { id: 'capital-blueprint', name: 'Capital Ship Blueprint Fragment', type: 'fragment', rarity: 'Legendary', quantity: 28, description: 'Blueprint fragment for capital ships', usedIn: ['Battleship', 'Dreadnought', 'Titan Battleship'] },
    { id: 'special-blueprint', name: 'Special Ship Blueprint Fragment', type: 'fragment', rarity: 'Mythic', quantity: 5, description: 'Blueprint fragment for special ships', usedIn: ['Death Star', 'World Ship', 'Dimensional Warship'] }
  ];

  const categories = [
    { id: 'all', name: 'All Ships', icon: 'ri-rocket-line', color: 'cyan' },
    { id: 'fighter', name: 'Fighters', icon: 'ri-plane-line', color: 'blue' },
    { id: 'corvette', name: 'Corvettes', icon: 'ri-ship-2-line', color: 'green' },
    { id: 'frigate', name: 'Frigates', icon: 'ri-sailboat-line', color: 'purple' },
    { id: 'destroyer', name: 'Destroyers', icon: 'ri-ship-line', color: 'red' },
    { id: 'cruiser', name: 'Cruisers', icon: 'ri-anchor-line', color: 'amber' },
    { id: 'battlecruiser', name: 'Battle Cruisers', icon: 'ri-compass-3-line', color: 'orange' },
    { id: 'battleship', name: 'Battleships', icon: 'ri-compass-4-line', color: 'pink' },
    { id: 'dreadnought', name: 'Dreadnoughts', icon: 'ri-sword-line', color: 'rose' },
    { id: 'carrier', name: 'Carriers', icon: 'ri-flight-takeoff-line', color: 'indigo' },
    { id: 'support', name: 'Support', icon: 'ri-lifebuoy-line', color: 'emerald' },
    { id: 'special', name: 'Special', icon: 'ri-star-line', color: 'violet' }
  ];

  const classTypes = [
    { id: 'all', name: 'All Classes' },
    { id: 'Common', name: 'Common', color: 'gray' },
    { id: 'Uncommon', name: 'Uncommon', color: 'green' },
    { id: 'Rare', name: 'Rare', color: 'blue' },
    { id: 'Epic', name: 'Epic', color: 'purple' },
    { id: 'Legendary', name: 'Legendary', color: 'amber' },
    { id: 'Mythic', name: 'Mythic', color: 'pink' },
    { id: 'Transcendent', name: 'Transcendent', color: 'cyan' },
    { id: 'Cosmic', name: 'Cosmic', color: 'indigo' },
    { id: 'Universal', name: 'Universal', color: 'violet' },
    { id: 'Godlike', name: 'Godlike', color: 'rose' }
  ];

  const getClassColor = (className: string) => {
    const classInfo = classTypes.find(c => c.id === className);
    return classInfo?.color || 'gray';
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'cyan';
  };

  const filteredShips = starships
    .filter(ship => selectedCategory === 'all' || ship.category === selectedCategory)
    .filter(ship => selectedClass === 'all' || ship.class === selectedClass)
    .sort((a, b) => {
      switch (sortBy) {
        case 'tier':
          return b.tier - a.tier;
        case 'level':
          return b.level - a.level;
        case 'power':
          return b.stats.firepower - a.stats.firepower;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleBuildShip = (ship: Starship) => {
    if (ship.status === 'locked') {
      alert('This ship is locked! Complete requirements to unlock it.');
      return;
    }
    if (ship.status === 'blueprint') {
      alert('Blueprint incomplete! Collect more fragments to unlock this ship.');
      return;
    }
    navigate('/shipyard');
  };

  const handleResearchBlueprint = (ship: Starship) => {
    if (!ship.blueprintRequirements) return;
    
    const { currentFragments, fragments, researchPoints } = ship.blueprintRequirements;
    
    if (currentFragments >= fragments) {
      alert(`Blueprint complete! You can now build ${ship.name}!`);
    } else {
      alert(`Blueprint Progress: ${currentFragments}/${fragments} fragments\nResearch Points Required: ${researchPoints.toLocaleString()}\n\nKeep collecting fragments!`);
    }
  };

  const handleUpgradeShip = (ship: Starship) => {
    if (ship.level >= ship.maxLevel) {
      alert('Ship is already at maximum level!');
      return;
    }
    alert(`Upgrading ${ship.name} to level ${ship.level + 1}!`);
  };

  const handleCraftMaterial = (material: CraftingMaterial) => {
    alert(`Crafting ${material.name}...\n\nType: ${material.type}\nRarity: ${material.rarity}\nCurrent: ${material.quantity}`);
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Starship Command Center
            </h1>
            <p className="text-gray-400 text-lg">90+ Ship Types • Blueprints • Crafting System</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/shipyard')}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer"
            >
              <i className="ri-hammer-line mr-2"></i>
              Shipyard
            </button>
            <button
              onClick={() => navigate('/fleet')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer"
            >
              <i className="ri-rocket-2-line mr-2"></i>
              Fleet
            </button>
            <button
              onClick={() => navigate('/research')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer"
            >
              <i className="ri-flask-line mr-2"></i>
              Research
            </button>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg px-4 py-2">
              <div className="text-xs text-gray-400 mb-1">Total Ships</div>
              <div className="text-xl font-bold text-cyan-400">{starships.filter(s => s.owned > 0).reduce((sum, s) => sum + s.owned, 0).toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg px-4 py-2">
              <div className="text-xs text-gray-400 mb-1">Ship Types</div>
              <div className="text-xl font-bold text-purple-400">{starships.filter(s => s.owned > 0).length} / {starships.length}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-amber-500/30 rounded-lg px-4 py-2">
              <div className="text-xs text-gray-400 mb-1">Blueprints</div>
              <div className="text-xl font-bold text-amber-400">{starships.filter(s => s.hasBlueprint).length}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-6">
          {/* Category Filter */}
          <div>
            <div className="text-sm text-gray-400 mb-2">Category:</div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? `bg-${cat.color}-500/20 border-2 border-${cat.color}-500 text-${cat.color}-400`
                      : 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:border-cyan-500/50'
                  }`}
                >
                  <i className={`${cat.icon} w-5 h-5 flex items-center justify-center`} />
                  <span className="font-medium">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Class and Sort Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400 mb-2">Class:</div>
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                {classTypes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-2">Sort By:</div>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="tier">Tier (High to Low)</option>
                <option value="level">Level (High to Low)</option>
                <option value="power">Firepower (High to Low)</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ships Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredShips.map(ship => (
            <div
              key={ship.id}
              className={`bg-slate-800/30 backdrop-blur-sm border rounded-xl p-6 transition-all hover:scale-[1.02] cursor-pointer ${
                ship.status === 'locked'
                  ? 'border-gray-700 opacity-60'
                  : `border-${getCategoryColor(ship.category)}-500/30 hover:border-${getCategoryColor(ship.category)}-500/60 hover:shadow-lg hover:shadow-${getCategoryColor(ship.category)}-500/20`
              }`}
              onClick={() => {
                setSelectedShip(ship);
                setShowDetails(true);
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white">{ship.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded border bg-${getClassColor(ship.class)}-500/20 border-${getClassColor(ship.class)}-500/50 text-${getClassColor(ship.class)}-400 font-bold`}>
                      {ship.class}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded bg-${getCategoryColor(ship.category)}-500/20 text-${getCategoryColor(ship.category)}-400 font-medium capitalize`}>
                      {ship.category}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-slate-700/50 text-gray-300">
                      Tier {ship.tier}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-slate-700/50 text-gray-300">
                      {ship.role}
                    </span>
                  </div>
                </div>
                {ship.status !== 'locked' && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-400">{ship.owned}</div>
                    <div className="text-xs text-gray-400">Owned</div>
                  </div>
                )}
              </div>

              {/* Blueprint Progress */}
              {ship.status === 'blueprint' && ship.blueprintProgress && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Blueprint Progress</span>
                    <span>{ship.blueprintProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${ship.blueprintProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{ship.description}</p>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-slate-900/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-400 mb-1">Firepower</div>
                  <div className="text-sm font-bold text-amber-400">{ship.stats.firepower.toLocaleString()}</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-400 mb-1">Hull</div>
                  <div className="text-sm font-bold text-blue-400">{ship.stats.hull.toLocaleString()}</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-400 mb-1">Speed</div>
                  <div className="text-sm font-bold text-cyan-400">{ship.stats.speed.toLocaleString()}</div>
                </div>
              </div>

              {/* Primary Weapons */}
              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-2">Primary Weapons:</div>
                <div className="space-y-1">
                  {ship.weapons.primary.slice(0, 2).map((weapon, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <i className="ri-sword-line text-amber-400 mt-0.5 w-4 h-4 flex items-center justify-center" />
                      <span className="text-gray-300">{weapon}</span>
                    </div>
                  ))}
                  {ship.weapons.primary.length > 2 && (
                    <div className="text-xs text-cyan-400">+{ship.weapons.primary.length - 2} more weapons...</div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {ship.status === 'available' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuildShip(ship);
                      }}
                      className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-hammer-line mr-2 w-4 h-4 inline-flex items-center justify-center" />
                      Build
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpgradeShip(ship);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-arrow-up-line w-4 h-4 inline-flex items-center justify-center" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedShip(ship);
                        setShowDetails(true);
                      }}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-information-line w-4 h-4 inline-flex items-center justify-center" />
                    </button>
                  </>
                )}
                {ship.status === 'blueprint' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResearchBlueprint(ship);
                      }}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-file-list-3-line mr-2 w-4 h-4 inline-flex items-center justify-center" />
                      Research Blueprint
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCrafting(true);
                      }}
                      className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-hammer-line w-4 h-4 inline-flex items-center justify-center" />
                    </button>
                  </>
                )}
                {ship.status === 'locked' && (
                  <button className="flex-1 bg-slate-700 text-gray-400 px-4 py-2 rounded-lg font-medium cursor-not-allowed whitespace-nowrap">
                    <i className="ri-lock-line mr-2 w-4 h-4 inline-flex items-center justify-center" />
                    Locked
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ship Details Modal */}
      {showDetails && selectedShip && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={() => setShowDetails(false)}>
          <div className="bg-slate-900 border border-cyan-500/30 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-cyan-500/30 p-6 z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-white">{selectedShip.name}</h2>
                    <span className={`text-sm px-3 py-1 rounded border bg-${getClassColor(selectedShip.class)}-500/20 border-${getClassColor(selectedShip.class)}-500/50 text-${getClassColor(selectedShip.class)}-400 font-bold`}>
                      {selectedShip.class}
                    </span>
                    <span className={`text-sm px-3 py-1 rounded bg-${getCategoryColor(selectedShip.category)}-500/20 text-${getCategoryColor(selectedShip.category)}-400 font-bold capitalize`}>
                      {selectedShip.category}
                    </span>
                  </div>
                  <p className="text-gray-400">{selectedShip.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div>
                      <span className="text-gray-400 text-sm">Tier: </span>
                      <span className="text-cyan-400 font-bold text-lg">{selectedShip.tier}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Role: </span>
                      <span className="text-purple-400 font-medium">{selectedShip.role}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Owned: </span>
                      <span className="text-emerald-400 font-bold">{selectedShip.owned}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedShip.status === 'available' && (
                    <>
                      <button
                        onClick={() => {
                          handleBuildShip(selectedShip);
                          setShowDetails(false);
                        }}
                        className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-hammer-line mr-2"></i>
                        Build Now
                      </button>
                      <button
                        onClick={() => handleUpgradeShip(selectedShip)}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-arrow-up-line mr-2"></i>
                        Upgrade
                      </button>
                    </>
                  )}
                  {selectedShip.status === 'blueprint' && (
                    <button
                      onClick={() => handleResearchBlueprint(selectedShip)}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-file-list-3-line mr-2"></i>
                      Research
                    </button>
                  )}
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <i className="ri-close-line text-2xl w-8 h-8 flex items-center justify-center" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-cyan-500/30">
              <div className="flex gap-2 px-6">
                {(['overview', 'weapons', 'equipment', 'blueprint'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-medium capitalize transition-all ${activeTab === tab ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Combat Stats */}
                  <div>
                    <h3 className="text-lg font-bold text-cyan-400 mb-3">Combat Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Hull</div>
                        <div className="text-2xl font-bold text-blue-400">{selectedShip.stats.hull.toLocaleString()}</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Shield</div>
                        <div className="text-2xl font-bold text-purple-400">{selectedShip.stats.shield.toLocaleString()}</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Armor</div>
                        <div className="text-2xl font-bold text-emerald-400">{selectedShip.stats.armor.toLocaleString()}</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Firepower</div>
                        <div className="text-2xl font-bold text-amber-400">{selectedShip.stats.firepower.toLocaleString()}</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Speed</div>
                        <div className="text-2xl font-bold text-cyan-400">{selectedShip.stats.speed.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Sub Stats */}
                  <div>
                    <h3 className="text-lg font-bold text-cyan-400 mb-3">Advanced Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(selectedShip.subStats).map(([key, value]) => (
                        <div key={key} className="bg-slate-800/50 rounded-lg p-3">
                          <div className="text-xs text-gray-400 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                          <div className="text-lg font-bold text-cyan-400">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Effects */}
                  <div>
                    <h3 className="text-lg font-bold text-cyan-400 mb-3">Ship Effects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-emerald-400 mb-2">Passive Effects</h4>
                        <div className="space-y-2">
                          {selectedShip.effects.passive.map((effect, idx) => (
                            <div key={idx} className="flex items-start gap-2 bg-slate-800/50 rounded-lg p-2">
                              <i className="ri-checkbox-circle-fill text-emerald-400 mt-0.5 w-4 h-4 flex items-center justify-center" />
                              <span className="text-xs text-gray-300">{effect}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-purple-400 mb-2">Active Abilities</h4>
                        <div className="space-y-2">
                          {selectedShip.effects.active.map((effect, idx) => (
                            <div key={idx} className="flex items-start gap-2 bg-slate-800/50 rounded-lg p-2">
                              <i className="ri-flashlight-fill text-purple-400 mt-0.5 w-4 h-4 flex items-center justify-center" />
                              <span className="text-xs text-gray-300">{effect}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-amber-400 mb-2">Unique Traits</h4>
                        <div className="space-y-2">
                          {selectedShip.effects.unique.map((effect, idx) => (
                            <div key={idx} className="flex items-start gap-2 bg-slate-800/50 rounded-lg p-2">
                              <i className="ri-star-fill text-amber-400 mt-0.5 w-4 h-4 flex items-center justify-center" />
                              <span className="text-xs text-gray-300">{effect}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Build Requirements */}
                  <div>
                    <h3 className="text-lg font-bold text-cyan-400 mb-3">Build Requirements</h3>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Metal</div>
                          <div className="text-lg font-bold text-blue-400">{selectedShip.requirements.metal.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Crystal</div>
                          <div className="text-lg font-bold text-purple-400">{selectedShip.requirements.crystal.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Deuterium</div>
                          <div className="text-lg font-bold text-emerald-400">{selectedShip.requirements.deuterium.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Antimatter</div>
                          <div className="text-lg font-bold text-pink-400">{selectedShip.requirements.antimatter.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">Shipyard Level</div>
                          <div className="text-lg font-bold text-cyan-400">{selectedShip.requirements.shipyard}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <i className="ri-time-line w-4 h-4 flex items-center justify-center" />
                        <span>Build Time: {selectedShip.requirements.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Weapons Tab */}
              {activeTab === 'weapons' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-amber-400 mb-3">Primary Weapons</h3>
                    <div className="space-y-2">
                      {selectedShip.weapons.primary.map((weapon, idx) => (
                        <div key={idx} className="bg-slate-800/50 rounded-lg p-4 flex items-center gap-3">
                          <i className="ri-sword-line text-amber-400 text-2xl w-8 h-8 flex items-center justify-center" />
                          <span className="text-white font-medium">{weapon}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-purple-400 mb-3">Secondary Weapons</h3>
                    <div className="space-y-2">
                      {selectedShip.weapons.secondary.map((weapon, idx) => (
                        <div key={idx} className="bg-slate-800/50 rounded-lg p-4 flex items-center gap-3">
                          <i className="ri-knife-line text-purple-400 text-2xl w-8 h-8 flex items-center justify-center" />
                          <span className="text-white font-medium">{weapon}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {selectedShip.weapons.special.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-cyan-400 mb-3">Special Weapons</h3>
                      <div className="space-y-2">
                        {selectedShip.weapons.special.map((weapon, idx) => (
                          <div key={idx} className="bg-slate-800/50 rounded-lg p-4 flex items-center gap-3">
                            <i className="ri-flashlight-fill text-cyan-400 text-2xl w-8 h-8 flex items-center justify-center" />
                            <span className="text-white font-medium">{weapon}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Equipment Tab */}
              {activeTab === 'equipment' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-cyan-400 mb-3">Ship Equipment</h3>
                  {Object.entries(selectedShip.equipment).map(([key, value]) => (
                    <div key={key} className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-400 capitalize mb-1">{key}</div>
                          <div className="text-lg font-bold text-white">{value}</div>
                        </div>
                        <i className="ri-settings-3-line text-cyan-400 text-2xl w-8 h-8 flex items-center justify-center" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Blueprint Tab */}
              {activeTab === 'blueprint' && (
                <div className="space-y-6">
                  {selectedShip.hasBlueprint ? (
                    <>
                      <div>
                        <h3 className="text-lg font-bold text-purple-400 mb-3">Blueprint Status</h3>
                        <div className="bg-slate-800/50 rounded-lg p-6">
                          {selectedShip.blueprintRequirements ? (
                            <>
                              <div className="mb-4">
                                <div className="flex justify-between text-sm text-gray-400 mb-2">
                                  <span>Blueprint Fragments</span>
                                  <span>{selectedShip.blueprintRequirements.currentFragments} / {selectedShip.blueprintRequirements.fragments}</span>
                                </div>
                                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                    style={{ width: `${(selectedShip.blueprintRequirements.currentFragments / selectedShip.blueprintRequirements.fragments) * 100}%` }}
                                  />
                                </div>
                              </div>
                              <div className="text-sm text-gray-400">
                                Research Points Required: <span className="text-cyan-400 font-bold">{selectedShip.blueprintRequirements.researchPoints.toLocaleString()}</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-center text-emerald-400">
                              <i className="ri-checkbox-circle-fill text-4xl mb-4 w-12 h-12 flex items-center justify-center mx-auto" />
                              <div className="font-bold">Blueprint Complete!</div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-cyan-400 mb-3">How to Obtain Fragments</h3>
                        <div className="space-y-2">
                          <div className="bg-slate-800/50 rounded-lg p-3 flex items-start gap-3">
                            <i className="ri-trophy-line text-amber-400 mt-1 w-5 h-5 flex items-center justify-center" />
                            <span className="text-sm text-gray-300">Complete high-level missions and events</span>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-3 flex items-start gap-3">
                            <i className="ri-sword-line text-red-400 mt-1 w-5 h-5 flex items-center justify-center" />
                            <span className="text-sm text-gray-300">Defeat powerful enemy fleets</span>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-3 flex items-start gap-3">
                            <i className="ri-shopping-cart-line text-emerald-400 mt-1 w-5 h-5 flex items-center justify-center" />
                            <span className="text-sm text-gray-300">Purchase from the galactic marketplace</span>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-3 flex items-start gap-3">
                            <i className="ri-flask-line text-purple-400 mt-1 w-5 h-5 flex items-center justify-center" />
                            <span className="text-sm text-gray-300">Research and exploration missions</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <i className="ri-lock-line text-6xl text-gray-600 mb-4 w-16 h-16 flex items-center justify-center mx-auto" />
                      <div className="text-xl font-bold text-gray-400 mb-2">No Blueprint Available</div>
                      <div className="text-sm text-gray-500">This ship can be built directly without a blueprint</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Crafting & Blueprints Modal */}
      {showCrafting && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={() => setShowCrafting(false)}>
          <div className="bg-slate-900 border border-purple-500/30 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-purple-500/30 p-6 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Crafting &amp; Blueprints</h2>
                  <p className="text-gray-400">Materials and components for ship construction</p>
                </div>
                <button
                  onClick={() => setShowCrafting(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="ri-close-line text-2xl w-8 h-8 flex items-center justify-center" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-purple-400 mb-4">Crafting Materials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {craftingMaterials.map(material => (
                  <div key={material.id} className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-white mb-1">{material.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded bg-${getClassColor(material.rarity)}-500/20 text-${getClassColor(material.rarity)}-400 border border-${getClassColor(material.rarity)}-500/30`}>
                            {material.rarity}
                          </span>
                          <span className="text-xs px-2 py-1 rounded bg-slate-700 text-gray-300 capitalize">{material.type}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-cyan-400">{material.quantity}</div>
                        <div className="text-xs text-gray-400">Owned</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{material.description}</p>
                    <div className="mb-3">
                      <div className="text-xs text-gray-400 mb-1">Used in:</div>
                      <div className="flex flex-wrap gap-1">
                        {material.usedIn.slice(0, 3).map((ship, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-slate-700/50 text-gray-300 rounded">
                            {ship}
                          </span>
                        ))}
                        {material.usedIn.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-slate-700/50 text-cyan-400 rounded">
                            +{material.usedIn.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCraftMaterial(material)}
                      className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-hammer-line mr-2"></i>
                      Craft
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}