import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Mothership {
  id: string;
  name: string;
  type: 'mothership' | 'space-station' | 'starbase' | 'moon-base' | 'orbital-platform' | 'titan-carrier';
  class: 'Titan' | 'Leviathan' | 'Colossus' | 'Behemoth' | 'Dreadnought' | 'Fortress' | 'Citadel';
  tier: number;
  level: number;
  maxLevel: number;
  status: 'operational' | 'construction' | 'upgrading' | 'damaged' | 'docked' | 'deployed' | 'locked';
  constructionProgress?: number;
  description: string;
  specifications: {
    length: string;
    mass: string;
    crew: number;
    maxCrew: number;
    hangarCapacity: number;
    weaponSlots: number;
    moduleSlots: number;
    powerCore: string;
  };
  stats: {
    hull: number;
    maxHull: number;
    shield: number;
    maxShield: number;
    armor: number;
    firepower: number;
    speed: number;
    maneuverability: number;
    cargoCapacity: number;
    fuelCapacity: number;
  };
  weapons: {
    name: string;
    type: 'beam' | 'projectile' | 'missile' | 'plasma' | 'exotic';
    damage: number;
    range: string;
    cooldown: string;
    installed: boolean;
  }[];
  modules: {
    name: string;
    category: 'defense' | 'offense' | 'utility' | 'production' | 'research';
    effect: string;
    installed: boolean;
    cost: {
      metal: number;
      crystal: number;
      deuterium: number;
      antimatter: number;
    };
  }[];
  hangar: {
    fighters: number;
    maxFighters: number;
    bombers: number;
    maxBombers: number;
    frigates: number;
    maxFrigates: number;
    cruisers: number;
    maxCruisers: number;
  };
  location: {
    universe: number;
    galaxy: number;
    system: number;
    position: number;
  };
  specialAbilities: string[];
  requirements: {
    metal: number;
    crystal: number;
    deuterium: number;
    darkMatter: number;
    antimatter: number;
    time: string;
  };
  unlockRequirements?: string[];
}

export default function MothershipsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedShip, setSelectedShip] = useState<Mothership | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'weapons' | 'modules' | 'hangar'>('overview');

  const motherships: Mothership[] = [
    {
      id: 'titan-nexus',
      name: 'Titan Nexus Prime',
      type: 'mothership',
      class: 'Titan',
      tier: 10,
      level: 5,
      maxLevel: 999,
      status: 'operational',
      description: 'The ultimate mobile command center and fleet carrier. A city-sized vessel capable of housing entire fleets and serving as a mobile starbase.',
      specifications: {
        length: '25 km',
        mass: '500 billion tons',
        crew: 150000,
        maxCrew: 200000,
        hangarCapacity: 5000,
        weaponSlots: 50,
        moduleSlots: 30,
        powerCore: 'Antimatter Fusion Reactor Array'
      },
      stats: {
        hull: 50000000,
        maxHull: 50000000,
        shield: 25000000,
        maxShield: 25000000,
        armor: 15000,
        firepower: 500000,
        speed: 50,
        maneuverability: 20,
        cargoCapacity: 10000000,
        fuelCapacity: 5000000
      },
      weapons: [
        { name: 'Titan Beam Cannon Array', type: 'beam', damage: 100000, range: '500,000 km', cooldown: '30s', installed: true },
        { name: 'Quantum Torpedo Launcher', type: 'missile', damage: 150000, range: '1,000,000 km', cooldown: '60s', installed: true },
        { name: 'Plasma Lance Battery', type: 'plasma', damage: 80000, range: '300,000 km', cooldown: '20s', installed: true },
        { name: 'Graviton Pulse Cannon', type: 'exotic', damage: 200000, range: '750,000 km', cooldown: '90s', installed: false }
      ],
      modules: [
        { name: 'Advanced Shield Generator', category: 'defense', effect: '+5,000,000 Shield capacity', installed: true, cost: { metal: 50000000, crystal: 30000000, deuterium: 20000000, antimatter: 5000 } },
        { name: 'Repair Bay Complex', category: 'utility', effect: 'Auto-repair 1% hull/min', installed: true, cost: { metal: 40000000, crystal: 25000000, deuterium: 15000000, antimatter: 3000 } },
        { name: 'Fleet Command Center', category: 'utility', effect: '+50% Fleet coordination', installed: true, cost: { metal: 35000000, crystal: 35000000, deuterium: 20000000, antimatter: 4000 } },
        { name: 'Resource Processing Plant', category: 'production', effect: '+100,000 resources/hour', installed: false, cost: { metal: 60000000, crystal: 40000000, deuterium: 30000000, antimatter: 6000 } }
      ],
      hangar: {
        fighters: 2000,
        maxFighters: 2500,
        bombers: 800,
        maxBombers: 1000,
        frigates: 150,
        maxFrigates: 200,
        cruisers: 50,
        maxCruisers: 100
      },
      location: { universe: 1, galaxy: 1, system: 1, position: 3 },
      specialAbilities: [
        'Mobile Starbase - Can deploy anywhere',
        'Fleet Coordination Hub - +50% fleet effectiveness',
        'Emergency Warp - Instant retreat capability',
        'Titan Beam - Devastating long-range weapon',
        'Self-Sustaining - Produces own resources'
      ],
      requirements: {
        metal: 500000000,
        crystal: 300000000,
        deuterium: 200000000,
        darkMatter: 50000,
        antimatter: 25000,
        time: '180 days'
      },
      unlockRequirements: [
        'Shipyard Level 25',
        'Hyperspace Technology Level 20',
        'Advanced Weapons Level 20',
        'Fleet Command Level 18'
      ]
    },
    {
      id: 'fortress-omega',
      name: 'Fortress Omega Station',
      type: 'space-station',
      class: 'Fortress',
      tier: 9,
      level: 8,
      maxLevel: 999,
      status: 'operational',
      description: 'A massive orbital fortress designed for system defense. Impregnable walls of steel and energy shields protect entire planets.',
      specifications: {
        length: '15 km diameter',
        mass: '300 billion tons',
        crew: 80000,
        maxCrew: 100000,
        hangarCapacity: 3000,
        weaponSlots: 80,
        moduleSlots: 25,
        powerCore: 'Fusion Reactor Grid'
      },
      stats: {
        hull: 80000000,
        maxHull: 80000000,
        shield: 40000000,
        maxShield: 40000000,
        armor: 25000,
        firepower: 800000,
        speed: 0,
        maneuverability: 0,
        cargoCapacity: 5000000,
        fuelCapacity: 2000000
      },
      weapons: [
        { name: 'Fortress Defense Grid', type: 'beam', damage: 50000, range: '800,000 km', cooldown: '10s', installed: true },
        { name: 'Heavy Missile Batteries', type: 'missile', damage: 120000, range: '1,500,000 km', cooldown: '45s', installed: true },
        { name: 'Point Defense System', type: 'projectile', damage: 10000, range: '100,000 km', cooldown: '2s', installed: true },
        { name: 'Siege Plasma Cannon', type: 'plasma', damage: 250000, range: '2,000,000 km', cooldown: '120s', installed: true }
      ],
      modules: [
        { name: 'Planetary Shield Projector', category: 'defense', effect: 'Protects planet below', installed: true, cost: { metal: 80000000, crystal: 50000000, deuterium: 30000000, antimatter: 8000 } },
        { name: 'Automated Defense Drones', category: 'defense', effect: '+1,000 defense drones', installed: true, cost: { metal: 40000000, crystal: 30000000, deuterium: 20000000, antimatter: 4000 } },
        { name: 'Early Warning System', category: 'utility', effect: 'Detect threats 10 systems away', installed: true, cost: { metal: 30000000, crystal: 40000000, deuterium: 25000000, antimatter: 5000 } }
      ],
      hangar: {
        fighters: 1500,
        maxFighters: 2000,
        bombers: 500,
        maxBombers: 800,
        frigates: 100,
        maxFrigates: 150,
        cruisers: 30,
        maxCruisers: 50
      },
      location: { universe: 1, galaxy: 1, system: 1, position: 3 },
      specialAbilities: [
        'Immobile Fortress - Cannot move but impregnable',
        'Planetary Shield - Protects entire planet',
        'Defense Grid - Automated turret network',
        'Siege Mode - +200% firepower when stationary',
        'Repair Facilities - Repairs allied ships'
      ],
      requirements: {
        metal: 400000000,
        crystal: 250000000,
        deuterium: 150000000,
        darkMatter: 40000,
        antimatter: 20000,
        time: '150 days'
      }
    },
    {
      id: 'starbase-alpha',
      name: 'Starbase Alpha-7',
      type: 'starbase',
      class: 'Citadel',
      tier: 8,
      level: 12,
      maxLevel: 999,
      status: 'operational',
      description: 'A strategic military and commercial hub. Serves as a resupply point, shipyard, and trade center for entire sectors.',
      specifications: {
        length: '10 km diameter',
        mass: '150 billion tons',
        crew: 50000,
        maxCrew: 75000,
        hangarCapacity: 2000,
        weaponSlots: 40,
        moduleSlots: 35,
        powerCore: 'Deuterium Fusion Array'
      },
      stats: {
        hull: 40000000,
        maxHull: 40000000,
        shield: 20000000,
        maxShield: 20000000,
        armor: 12000,
        firepower: 300000,
        speed: 0,
        maneuverability: 0,
        cargoCapacity: 15000000,
        fuelCapacity: 8000000
      },
      weapons: [
        { name: 'Defense Turret Array', type: 'beam', damage: 30000, range: '400,000 km', cooldown: '8s', installed: true },
        { name: 'Missile Defense System', type: 'missile', damage: 50000, range: '600,000 km', cooldown: '30s', installed: true },
        { name: 'Ion Cannon Battery', type: 'beam', damage: 80000, range: '500,000 km', cooldown: '40s', installed: true }
      ],
      modules: [
        { name: 'Shipyard Complex', category: 'production', effect: 'Build ships 200% faster', installed: true, cost: { metal: 60000000, crystal: 40000000, deuterium: 30000000, antimatter: 6000 } },
        { name: 'Trade Hub', category: 'utility', effect: '+50% trade efficiency', installed: true, cost: { metal: 40000000, crystal: 50000000, deuterium: 25000000, antimatter: 5000 } },
        { name: 'Research Laboratory', category: 'research', effect: '+30% research speed', installed: true, cost: { metal: 50000000, crystal: 60000000, deuterium: 35000000, antimatter: 7000 } },
        { name: 'Refueling Station', category: 'utility', effect: 'Instant fleet refuel', installed: true, cost: { metal: 30000000, crystal: 25000000, deuterium: 40000000, antimatter: 4000 } }
      ],
      hangar: {
        fighters: 1000,
        maxFighters: 1500,
        bombers: 400,
        maxBombers: 600,
        frigates: 80,
        maxFrigates: 120,
        cruisers: 25,
        maxCruisers: 40
      },
      location: { universe: 1, galaxy: 1, system: 5, position: 0 },
      specialAbilities: [
        'Shipyard - Construct ships 200% faster',
        'Trade Hub - Central marketplace',
        'Refueling Station - Instant fleet refuel',
        'Repair Docks - Repair multiple ships',
        'Research Facility - Conduct research'
      ],
      requirements: {
        metal: 250000000,
        crystal: 180000000,
        deuterium: 120000000,
        darkMatter: 30000,
        antimatter: 15000,
        time: '120 days'
      }
    },
    {
      id: 'moon-base-delta',
      name: 'Moon Base Delta',
      type: 'moon-base',
      class: 'Citadel',
      tier: 7,
      level: 15,
      maxLevel: 999,
      status: 'operational',
      description: 'A fortified lunar installation built into the moon itself. Combines natural protection with advanced technology.',
      specifications: {
        length: '5 km underground',
        mass: '50 billion tons',
        crew: 25000,
        maxCrew: 40000,
        hangarCapacity: 1000,
        weaponSlots: 30,
        moduleSlots: 20,
        powerCore: 'Geothermal Reactor'
      },
      stats: {
        hull: 60000000,
        maxHull: 60000000,
        shield: 15000000,
        maxShield: 15000000,
        armor: 30000,
        firepower: 200000,
        speed: 0,
        maneuverability: 0,
        cargoCapacity: 8000000,
        fuelCapacity: 3000000
      },
      weapons: [
        { name: 'Surface Defense Cannons', type: 'projectile', damage: 40000, range: '300,000 km', cooldown: '15s', installed: true },
        { name: 'Underground Missile Silos', type: 'missile', damage: 100000, range: '1,000,000 km', cooldown: '60s', installed: true },
        { name: 'Orbital Strike Laser', type: 'beam', damage: 120000, range: '800,000 km', cooldown: '50s', installed: true }
      ],
      modules: [
        { name: 'Underground Mining Complex', category: 'production', effect: '+200,000 metal/hour', installed: true, cost: { metal: 40000000, crystal: 25000000, deuterium: 15000000, antimatter: 3000 } },
        { name: 'Crystal Extraction Facility', category: 'production', effect: '+150,000 crystal/hour', installed: true, cost: { metal: 35000000, crystal: 40000000, deuterium: 20000000, antimatter: 4000 } },
        { name: 'Sensor Array Network', category: 'utility', effect: 'Scan entire system', installed: true, cost: { metal: 30000000, crystal: 35000000, deuterium: 18000000, antimatter: 3500 } }
      ],
      hangar: {
        fighters: 500,
        maxFighters: 800,
        bombers: 200,
        maxBombers: 400,
        frigates: 40,
        maxFrigates: 80,
        cruisers: 15,
        maxCruisers: 30
      },
      location: { universe: 1, galaxy: 1, system: 1, position: 3 },
      specialAbilities: [
        'Underground Fortress - Natural armor bonus',
        'Resource Mining - Produces resources',
        'Hidden Base - Hard to detect',
        'Sensor Network - System-wide surveillance',
        'Emergency Bunker - Ultimate protection'
      ],
      requirements: {
        metal: 180000000,
        crystal: 120000000,
        deuterium: 80000000,
        darkMatter: 20000,
        antimatter: 10000,
        time: '90 days'
      }
    },
    {
      id: 'leviathan-carrier',
      name: 'Leviathan Fleet Carrier',
      type: 'titan-carrier',
      class: 'Leviathan',
      tier: 9,
      level: 3,
      maxLevel: 999,
      status: 'operational',
      description: 'A massive fleet carrier designed to transport and deploy entire armadas. Mobile hangar with devastating support capabilities.',
      specifications: {
        length: '18 km',
        mass: '350 billion tons',
        crew: 100000,
        maxCrew: 150000,
        hangarCapacity: 8000,
        weaponSlots: 35,
        moduleSlots: 28,
        powerCore: 'Quantum Reactor Core'
      },
      stats: {
        hull: 35000000,
        maxHull: 35000000,
        shield: 18000000,
        maxShield: 18000000,
        armor: 10000,
        firepower: 250000,
        speed: 80,
        maneuverability: 35,
        cargoCapacity: 12000000,
        fuelCapacity: 6000000
      },
      weapons: [
        { name: 'Carrier Defense Grid', type: 'beam', damage: 40000, range: '350,000 km', cooldown: '12s', installed: true },
        { name: 'Long-Range Missile Array', type: 'missile', damage: 90000, range: '1,200,000 km', cooldown: '50s', installed: true },
        { name: 'Point Defense Lasers', type: 'beam', damage: 15000, range: '80,000 km', cooldown: '3s', installed: true }
      ],
      modules: [
        { name: 'Rapid Launch System', category: 'utility', effect: 'Deploy all fighters instantly', installed: true, cost: { metal: 50000000, crystal: 35000000, deuterium: 25000000, antimatter: 5000 } },
        { name: 'Fighter Assembly Bay', category: 'production', effect: 'Build fighters onboard', installed: true, cost: { metal: 45000000, crystal: 40000000, deuterium: 30000000, antimatter: 6000 } },
        { name: 'Fleet Coordination AI', category: 'utility', effect: '+40% fighter effectiveness', installed: false, cost: { metal: 55000000, crystal: 45000000, deuterium: 35000000, antimatter: 7000 } }
      ],
      hangar: {
        fighters: 4000,
        maxFighters: 5000,
        bombers: 1500,
        maxBombers: 2000,
        frigates: 200,
        maxFrigates: 300,
        cruisers: 80,
        maxCruisers: 120
      },
      location: { universe: 1, galaxy: 2, system: 3, position: 5 },
      specialAbilities: [
        'Massive Hangar - Carries 8,000 ships',
        'Rapid Deployment - Launch all fighters instantly',
        'Mobile Shipyard - Build ships while traveling',
        'Fleet Support - Repairs and resupplies fleet',
        'Carrier Strike - Overwhelming fighter swarm'
      ],
      requirements: {
        metal: 350000000,
        crystal: 220000000,
        deuterium: 160000000,
        darkMatter: 35000,
        antimatter: 18000,
        time: '140 days'
      }
    },
    {
      id: 'orbital-platform',
      name: 'Orbital Defense Platform Zeta',
      type: 'orbital-platform',
      class: 'Dreadnought',
      tier: 6,
      level: 20,
      maxLevel: 999,
      status: 'operational',
      description: 'A compact but powerful orbital weapons platform. Designed for planetary defense and system patrol.',
      specifications: {
        length: '3 km',
        mass: '20 billion tons',
        crew: 5000,
        maxCrew: 8000,
        hangarCapacity: 300,
        weaponSlots: 25,
        moduleSlots: 15,
        powerCore: 'Compact Fusion Reactor'
      },
      stats: {
        hull: 15000000,
        maxHull: 15000000,
        shield: 8000000,
        maxShield: 8000000,
        armor: 8000,
        firepower: 180000,
        speed: 0,
        maneuverability: 0,
        cargoCapacity: 2000000,
        fuelCapacity: 1000000
      },
      weapons: [
        { name: 'Orbital Strike Cannon', type: 'beam', damage: 60000, range: '400,000 km', cooldown: '25s', installed: true },
        { name: 'Anti-Ship Missiles', type: 'missile', damage: 80000, range: '600,000 km', cooldown: '35s', installed: true },
        { name: 'Plasma Turrets', type: 'plasma', damage: 45000, range: '250,000 km', cooldown: '18s', installed: true }
      ],
      modules: [
        { name: 'Enhanced Targeting System', category: 'offense', effect: '+50% accuracy', installed: true, cost: { metal: 25000000, crystal: 30000000, deuterium: 15000000, antimatter: 3000 } },
        { name: 'Shield Booster', category: 'defense', effect: '+3,000,000 shield', installed: true, cost: { metal: 30000000, crystal: 25000000, deuterium: 18000000, antimatter: 3500 } },
        { name: 'Automated Repair System', category: 'utility', effect: 'Auto-repair 0.5% hull/min', installed: true, cost: { metal: 20000000, crystal: 20000000, deuterium: 12000000, antimatter: 2500 } }
      ],
      hangar: {
        fighters: 200,
        maxFighters: 300,
        bombers: 80,
        maxBombers: 150,
        frigates: 15,
        maxFrigates: 30,
        cruisers: 5,
        maxCruisers: 10
      },
      location: { universe: 1, galaxy: 1, system: 2, position: 4 },
      specialAbilities: [
        'Orbital Strike - Devastating surface bombardment',
        'Automated Defense - AI-controlled weapons',
        'Quick Deploy - Rapid construction',
        'Network Defense - Links with other platforms',
        'Low Maintenance - Minimal crew required'
      ],
      requirements: {
        metal: 120000000,
        crystal: 80000000,
        deuterium: 50000000,
        darkMatter: 15000,
        antimatter: 8000,
        time: '60 days'
      }
    },
    {
      id: 'colossus-command',
      name: 'Colossus Command Ship',
      type: 'mothership',
      class: 'Colossus',
      tier: 8,
      level: 7,
      maxLevel: 999,
      status: 'construction',
      constructionProgress: 45,
      description: 'A massive command vessel designed to coordinate entire fleets. Combines firepower with strategic command capabilities.',
      specifications: {
        length: '12 km',
        mass: '200 billion tons',
        crew: 60000,
        maxCrew: 90000,
        hangarCapacity: 1500,
        weaponSlots: 45,
        moduleSlots: 22,
        powerCore: 'Hybrid Fusion-Antimatter Reactor'
      },
      stats: {
        hull: 28000000,
        maxHull: 28000000,
        shield: 14000000,
        maxShield: 14000000,
        armor: 9000,
        firepower: 350000,
        speed: 60,
        maneuverability: 25,
        cargoCapacity: 7000000,
        fuelCapacity: 4000000
      },
      weapons: [
        { name: 'Command Ship Batteries', type: 'beam', damage: 70000, range: '450,000 km', cooldown: '20s', installed: false },
        { name: 'Strategic Missile System', type: 'missile', damage: 110000, range: '900,000 km', cooldown: '55s', installed: false },
        { name: 'Broadside Plasma Cannons', type: 'plasma', damage: 65000, range: '350,000 km', cooldown: '22s', installed: false }
      ],
      modules: [
        { name: 'Fleet Command Bridge', category: 'utility', effect: '+60% fleet coordination', installed: false, cost: { metal: 45000000, crystal: 40000000, deuterium: 28000000, antimatter: 5500 } },
        { name: 'Tactical Analysis Computer', category: 'utility', effect: '+30% battle strategy', installed: false, cost: { metal: 38000000, crystal: 42000000, deuterium: 25000000, antimatter: 5000 } }
      ],
      hangar: {
        fighters: 800,
        maxFighters: 1200,
        bombers: 350,
        maxBombers: 500,
        frigates: 60,
        maxFrigates: 100,
        cruisers: 20,
        maxCruisers: 35
      },
      location: { universe: 1, galaxy: 1, system: 1, position: 3 },
      specialAbilities: [
        'Fleet Command - Coordinate multiple fleets',
        'Tactical Analysis - Predict enemy movements',
        'Strategic Strike - Precision fleet attacks',
        'Command Aura - Boost nearby ships',
        'Emergency Protocols - Quick response'
      ],
      requirements: {
        metal: 280000000,
        crystal: 190000000,
        deuterium: 130000000,
        darkMatter: 28000,
        antimatter: 14000,
        time: '110 days'
      },
      unlockRequirements: [
        'Shipyard Level 22',
        'Fleet Command Level 16',
        'Advanced Weapons Level 18'
      ]
    },
    {
      id: 'behemoth-mining',
      name: 'Behemoth Mining Station',
      type: 'space-station',
      class: 'Behemoth',
      tier: 7,
      level: 10,
      maxLevel: 999,
      status: 'operational',
      description: 'A colossal mining and processing station. Extracts resources from asteroids, moons, and planetary rings.',
      specifications: {
        length: '8 km diameter',
        mass: '100 billion tons',
        crew: 35000,
        maxCrew: 50000,
        hangarCapacity: 800,
        weaponSlots: 20,
        moduleSlots: 30,
        powerCore: 'Industrial Fusion Array'
      },
      stats: {
        hull: 25000000,
        maxHull: 25000000,
        shield: 10000000,
        maxShield: 10000000,
        armor: 15000,
        firepower: 100000,
        speed: 0,
        maneuverability: 0,
        cargoCapacity: 25000000,
        fuelCapacity: 5000000
      },
      weapons: [
        { name: 'Mining Laser Array', type: 'beam', damage: 20000, range: '200,000 km', cooldown: '10s', installed: true },
        { name: 'Defense Turrets', type: 'projectile', damage: 35000, range: '300,000 km', cooldown: '15s', installed: true }
      ],
      modules: [
        { name: 'Asteroid Processing Plant', category: 'production', effect: '+300,000 metal/hour', installed: true, cost: { metal: 50000000, crystal: 30000000, deuterium: 20000000, antimatter: 4000 } },
        { name: 'Crystal Refinery', category: 'production', effect: '+200,000 crystal/hour', installed: true, cost: { metal: 40000000, crystal: 50000000, deuterium: 25000000, antimatter: 5000 } },
        { name: 'Deuterium Extractor', category: 'production', effect: '+150,000 deuterium/hour', installed: true, cost: { metal: 35000000, crystal: 40000000, deuterium: 45000000, antimatter: 4500 } },
        { name: 'Automated Mining Drones', category: 'production', effect: '+100% mining speed', installed: true, cost: { metal: 45000000, crystal: 35000000, deuterium: 30000000, antimatter: 6000 } }
      ],
      hangar: {
        fighters: 300,
        maxFighters: 500,
        bombers: 100,
        maxBombers: 200,
        frigates: 30,
        maxFrigates: 50,
        cruisers: 10,
        maxCruisers: 20
      },
      location: { universe: 1, galaxy: 1, system: 4, position: 0 },
      specialAbilities: [
        'Industrial Mining - Massive resource production',
        'Automated Processing - Self-sufficient operation',
        'Cargo Hub - Enormous storage capacity',
        'Mining Drones - Autonomous resource gathering',
        'Refinery Complex - Process raw materials'
      ],
      requirements: {
        metal: 200000000,
        crystal: 150000000,
        deuterium: 100000000,
        darkMatter: 25000,
        antimatter: 12000,
        time: '100 days'
      }
    }
  ];

  const categories = [
    { id: 'all', name: 'All Vessels', icon: 'ri-rocket-line' },
    { id: 'mothership', name: 'Motherships', icon: 'ri-ship-line' },
    { id: 'space-station', name: 'Space Stations', icon: 'ri-building-4-line' },
    { id: 'starbase', name: 'Starbases', icon: 'ri-community-line' },
    { id: 'moon-base', name: 'Moon Bases', icon: 'ri-moon-line' },
    { id: 'orbital-platform', name: 'Orbital Platforms', icon: 'ri-radar-line' },
    { id: 'titan-carrier', name: 'Titan Carriers', icon: 'ri-plane-line' }
  ];

  const filteredShips = selectedCategory === 'all'
    ? motherships
    : motherships.filter(s => s.type === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-emerald-400';
      case 'construction': return 'text-amber-400';
      case 'upgrading': return 'text-blue-400';
      case 'damaged': return 'text-red-400';
      case 'docked': return 'text-gray-400';
      case 'deployed': return 'text-cyan-400';
      case 'locked': return 'text-gray-500';
      default: return 'text-gray-400';
    }
  };

  const getClassColor = (shipClass: string) => {
    switch (shipClass) {
      case 'Titan': return 'from-amber-500 to-orange-500';
      case 'Leviathan': return 'from-purple-500 to-pink-500';
      case 'Colossus': return 'from-blue-500 to-cyan-500';
      case 'Behemoth': return 'from-green-500 to-emerald-500';
      case 'Dreadnought': return 'from-red-500 to-rose-500';
      case 'Fortress': return 'from-slate-500 to-gray-500';
      case 'Citadel': return 'from-indigo-500 to-violet-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mothership': return 'ri-ship-line';
      case 'space-station': return 'ri-building-4-line';
      case 'starbase': return 'ri-community-line';
      case 'moon-base': return 'ri-moon-line';
      case 'orbital-platform': return 'ri-radar-line';
      case 'titan-carrier': return 'ri-plane-line';
      default: return 'ri-rocket-line';
    }
  };

  return (
    <div className="text-white">
      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://readdy.ai/api/search-image?query=massive%20space%20mothership%20titan%20class%20fleet%20carrier%20space%20station%20starbase%20orbital%20fortress%20sci-fi%20military%20vessels%20cosmic%20background%20epic%20scale%20futuristic%20technology&width=1920&height=500&seq=mothership-hero&orientation=landscape" alt="Motherships Background" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <h1 className="text-6xl font-black uppercase text-white mb-4">Capital Ships & Stations</h1>
          <p className="text-xl text-gray-300">Command the most powerful vessels in the galaxy</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0F1F3A] border border-cyan-400/30 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Active Vessels</div>
            <div className="text-3xl font-bold text-cyan-400">7 / 8</div>
          </div>
          <div className="bg-[#0F1F3A] border border-amber-400/30 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Total Firepower</div>
            <div className="text-3xl font-bold text-amber-400">2.78M</div>
          </div>
          <div className="bg-[#0F1F3A] border border-emerald-400/30 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Hangar Capacity</div>
            <div className="text-3xl font-bold text-emerald-400">21,600</div>
          </div>
          <div className="bg-[#0F1F3A] border border-purple-400/30 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Total Crew</div>
            <div className="text-3xl font-bold text-purple-400">505K</div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400'
                  : 'bg-[#0F1F3A] border border-cyan-400/30 text-gray-400 hover:border-cyan-500/50'
              }`}
            >
              <i className={`${cat.icon} w-5 h-5 flex items-center justify-center`}></i>
              <span className="font-medium">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Ships Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredShips.map(ship => (
            <div
              key={ship.id}
              className={`bg-[#0F1F3A] border rounded-xl overflow-hidden transition-all hover:scale-[1.02] cursor-pointer ${
                ship.status === 'locked'
                  ? 'border-gray-700 opacity-60'
                  : 'border-cyan-400/30 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/20'
              }`}
              onClick={() => {
                setSelectedShip(ship);
                setShowDetails(true);
              }}
            >
              {/* Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={`https://readdy.ai/api/search-image?query=$%7Bship.type%7D%20$%7Bship.class%7D%20class%20massive%20space%20vessel%20sci-fi%20military%20ship%20station%20detailed%20view%20futuristic%20technology&width=800&height=400&seq=${ship.id}&orientation=landscape`}
                  alt={ship.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F3A] to-transparent"></div>
                <div className={`absolute top-4 left-4 w-16 h-16 rounded-lg bg-gradient-to-br ${getClassColor(ship.class)} flex items-center justify-center`}>
                  <i className={`${getTypeIcon(ship.type)} text-3xl text-white w-10 h-10 flex items-center justify-center`}></i>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-sm font-bold text-white border border-cyan-400/30">
                    Tier {ship.tier}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{ship.name}</h3>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`text-sm px-3 py-1 rounded-lg bg-gradient-to-r ${getClassColor(ship.class)} text-white font-bold`}>
                        {ship.class} Class
                      </span>
                      <span className={`text-sm font-medium ${getStatusColor(ship.status)}`}>
                        {ship.status.charAt(0).toUpperCase() + ship.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      [{ship.location.universe}:{ship.location.galaxy}:{ship.location.system}:{ship.location.position}]
                    </div>
                  </div>
                  {ship.status !== 'locked' && (
                    <div className="text-right">
                      <div className="text-3xl font-bold text-cyan-400">Lv.{ship.level}</div>
                      <div className="text-xs text-gray-400">Max: {ship.maxLevel}</div>
                    </div>
                  )}
                </div>

                {/* Construction Progress */}
                {ship.status === 'construction' && ship.constructionProgress && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Construction Progress</span>
                      <span>{ship.constructionProgress}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                        style={{ width: `${ship.constructionProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Description */}
                <p className="text-sm text-gray-400 mb-4">{ship.description}</p>

                {/* Key Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Length</div>
                    <div className="text-sm font-bold text-cyan-400">{ship.specifications.length}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Crew</div>
                    <div className="text-sm font-bold text-purple-400">{ship.specifications.crew.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Hangar</div>
                    <div className="text-sm font-bold text-emerald-400">{ship.specifications.hangarCapacity.toLocaleString()}</div>
                  </div>
                </div>

                {/* Combat Stats */}
                {ship.status !== 'locked' && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Hull Integrity</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                            style={{ width: `${(ship.stats.hull / ship.stats.maxHull) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-cyan-400">{((ship.stats.hull / ship.stats.maxHull) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Shield Power</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: `${(ship.stats.shield / ship.stats.maxShield) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-purple-400">{((ship.stats.shield / ship.stats.maxShield) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Firepower</div>
                      <div className="text-lg font-bold text-amber-400">{(ship.stats.firepower / 1000).toFixed(0)}K</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Armor Rating</div>
                      <div className="text-lg font-bold text-emerald-400">{ship.stats.armor.toLocaleString()}</div>
                    </div>
                  </div>
                )}

                {/* Special Abilities Preview */}
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-2">Special Abilities:</div>
                  <div className="space-y-1">
                    {ship.specialAbilities.slice(0, 2).map((ability, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <i className="ri-star-fill text-amber-400 mt-0.5 w-4 h-4 flex items-center justify-center"></i>
                        <span className="text-gray-300">{ability}</span>
                      </div>
                    ))}
                    {ship.specialAbilities.length > 2 && (
                      <div className="text-xs text-cyan-400">+{ship.specialAbilities.length - 2} more abilities...</div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {ship.status === 'operational' && (
                    <>
                      <button className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap">
                        <i className="ri-eye-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                        View Details
                      </button>
                      <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap">
                        <i className="ri-arrow-up-line w-4 h-4 inline-flex items-center justify-center"></i>
                      </button>
                    </>
                  )}
                  {ship.status === 'construction' && (
                    <button className="flex-1 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap">
                      <i className="ri-time-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                      Speed Up Construction
                    </button>
                  )}
                  {ship.status === 'locked' && (
                    <button className="flex-1 bg-slate-700 text-gray-400 px-4 py-2 rounded-lg font-medium cursor-not-allowed whitespace-nowrap">
                      <i className="ri-lock-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                      Locked
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedShip && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={() => setShowDetails(false)}>
          <div className="bg-[#0F1F3A] border border-cyan-400/30 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="relative h-80 w-full overflow-hidden">
              <img
                src={`https://readdy.ai/api/search-image?query=$%7BselectedShip.type%7D%20$%7BselectedShip.class%7D%20class%20detailed%20interior%20exterior%20massive%20space%20vessel%20sci-fi%20military%20ship%20station%20epic%20view%20futuristic%20technology&width=1200&height=600&seq=${selectedShip.id}-detail&orientation=landscape`}
                alt={selectedShip.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F3A] to-transparent"></div>
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-lg flex items-center justify-center transition-all cursor-pointer"
              >
                <i className="ri-close-line text-2xl text-white w-6 h-6 flex items-center justify-center"></i>
              </button>
              <div className="absolute bottom-6 left-6">
                <h2 className="text-4xl font-bold text-white mb-2">{selectedShip.name}</h2>
                <div className="flex items-center gap-3">
                  <span className={`text-base px-4 py-2 rounded-lg bg-gradient-to-r ${getClassColor(selectedShip.class)} text-white font-bold`}>
                    {selectedShip.class} Class
                  </span>
                  <span className="text-base px-4 py-2 rounded-lg bg-black/60 backdrop-blur-sm text-white font-bold border border-cyan-400/30">
                    Tier {selectedShip.tier} • Level {selectedShip.level}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-cyan-400/30">
              <div className="flex gap-2 px-6">
                {(['overview', 'weapons', 'modules', 'hangar'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-medium capitalize transition-all ${
                      activeTab === tab
                        ? 'text-cyan-400 border-b-2 border-cyan-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
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
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-bold text-cyan-400 mb-2">Description</h3>
                    <p className="text-gray-300">{selectedShip.description}</p>
                  </div>

                  {/* Specifications */}
                  <div>
                    <h3 className="text-lg font-bold text-cyan-400 mb-3">Specifications</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Length</div>
                        <div className="text-lg font-bold text-white">{selectedShip.specifications.length}</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Mass</div>
                        <div className="text-lg font-bold text-white">{selectedShip.specifications.mass}</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Crew</div>
                        <div className="text-lg font-bold text-white">{selectedShip.specifications.crew.toLocaleString()} / {selectedShip.specifications.maxCrew.toLocaleString()}</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Power Core</div>
                        <div className="text-sm font-bold text-white">{selectedShip.specifications.powerCore}</div>
                      </div>
                    </div>
                  </div>

                  {/* Combat Stats */}
                  <div>
                    <h3 className="text-lg font-bold text-cyan-400 mb-3">Combat Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-2">Hull Integrity</div>
                        <div className="text-2xl font-bold text-blue-400 mb-2">{(selectedShip.stats.hull / 1000000).toFixed(1)}M</div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${(selectedShip.stats.hull / selectedShip.stats.maxHull) * 100}%` }}></div>
                        </div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-2">Shield Power</div>
                        <div className="text-2xl font-bold text-purple-400 mb-2">{(selectedShip.stats.shield / 1000000).toFixed(1)}M</div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${(selectedShip.stats.shield / selectedShip.stats.maxShield) * 100}%` }}></div>
                        </div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Armor Rating</div>
                        <div className="text-2xl font-bold text-emerald-400">{selectedShip.stats.armor.toLocaleString()}</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Firepower</div>
                        <div className="text-2xl font-bold text-amber-400">{(selectedShip.stats.firepower / 1000).toFixed(0)}K</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Speed</div>
                        <div className="text-2xl font-bold text-cyan-400">{selectedShip.stats.speed}</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Maneuverability</div>
                        <div className="text-2xl font-bold text-cyan-400">{selectedShip.stats.maneuverability}</div>
                      </div>
                    </div>
                  </div>

                  {/* Special Abilities */}
                  <div>
                    <h3 className="text-lg font-bold text-cyan-400 mb-3">Special Abilities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedShip.specialAbilities.map((ability, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-4">
                          <i className="ri-star-fill text-amber-400 mt-1 w-5 h-5 flex items-center justify-center"></i>
                          <span className="text-sm text-gray-300">{ability}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Weapons Tab */}
              {activeTab === 'weapons' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-cyan-400 mb-3">Weapon Systems ({selectedShip.weapons.filter(w => w.installed).length} / {selectedShip.specifications.weaponSlots})</h3>
                  {selectedShip.weapons.map((weapon, idx) => (
                    <div key={idx} className={`bg-slate-800/50 border rounded-lg p-4 ${weapon.installed ? 'border-emerald-500/30' : 'border-slate-700'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-white text-lg">{weapon.name}</h4>
                            {weapon.installed && (
                              <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
                                Installed
                              </span>
                            )}
                            <span className="text-xs px-2 py-1 bg-slate-700 text-gray-300 rounded capitalize">
                              {weapon.type}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Damage: </span>
                              <span className="text-amber-400 font-bold">{weapon.damage.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Range: </span>
                              <span className="text-cyan-400 font-bold">{weapon.range}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Cooldown: </span>
                              <span className="text-purple-400 font-bold">{weapon.cooldown}</span>
                            </div>
                          </div>
                        </div>
                        {!weapon.installed && (
                          <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap">
                            Install
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Modules Tab */}
              {activeTab === 'modules' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-cyan-400 mb-3">Module Systems ({selectedShip.modules.filter(m => m.installed).length} / {selectedShip.specifications.moduleSlots})</h3>
                  {selectedShip.modules.map((module, idx) => (
                    <div key={idx} className={`bg-slate-800/50 border rounded-lg p-4 ${module.installed ? 'border-emerald-500/30' : 'border-slate-700'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-white text-lg">{module.name}</h4>
                            {module.installed && (
                              <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
                                Installed
                              </span>
                            )}
                            <span className="text-xs px-2 py-1 bg-slate-700 text-gray-300 rounded capitalize">
                              {module.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">{module.effect}</p>
                          <div className="flex gap-4 text-sm">
                            <span className="text-blue-400">{module.cost.metal.toLocaleString()} Metal</span>
                            <span className="text-purple-400">{module.cost.crystal.toLocaleString()} Crystal</span>
                            <span className="text-emerald-400">{module.cost.deuterium.toLocaleString()} Deuterium</span>
                            <span className="text-pink-400">{module.cost.antimatter.toLocaleString()} Antimatter</span>
                          </div>
                        </div>
                        {!module.installed && (
                          <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap">
                            Install Module
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Hangar Tab */}
              {activeTab === 'hangar' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-cyan-400 mb-3">Hangar Bay Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-400">Fighters</div>
                        <div className="text-lg font-bold text-cyan-400">{selectedShip.hangar.fighters} / {selectedShip.hangar.maxFighters}</div>
                      </div>
                      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${(selectedShip.hangar.fighters / selectedShip.hangar.maxFighters) * 100}%` }}></div>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-400">Bombers</div>
                        <div className="text-lg font-bold text-amber-400">{selectedShip.hangar.bombers} / {selectedShip.hangar.maxBombers}</div>
                      </div>
                      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${(selectedShip.hangar.bombers / selectedShip.hangar.maxBombers) * 100}%` }}></div>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-400">Frigates</div>
                        <div className="text-lg font-bold text-purple-400">{selectedShip.hangar.frigates} / {selectedShip.hangar.maxFrigates}</div>
                      </div>
                      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${(selectedShip.hangar.frigates / selectedShip.hangar.maxFrigates) * 100}%` }}></div>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-400">Cruisers</div>
                        <div className="text-lg font-bold text-emerald-400">{selectedShip.hangar.cruisers} / {selectedShip.hangar.maxCruisers}</div>
                      </div>
                      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500" style={{ width: `${(selectedShip.hangar.cruisers / selectedShip.hangar.maxCruisers) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                    <div className="text-sm text-gray-400 mb-2">Total Hangar Capacity</div>
                    <div className="text-4xl font-bold text-cyan-400 mb-4">
                      {selectedShip.hangar.fighters + selectedShip.hangar.bombers + selectedShip.hangar.frigates + selectedShip.hangar.cruisers} / {selectedShip.specifications.hangarCapacity}
                    </div>
                    <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap">
                      <i className="ri-add-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>
                      Deploy Ships
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}