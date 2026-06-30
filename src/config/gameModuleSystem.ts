// ═══════════════════════════════════════════════════════════════════════════════
// GAME MODULE SYSTEM — Full Hierarchical Classification
// 12 Levels: Module → SubModule → Category → SubCategory → Class → SubClass
//           → Type → SubType → System → SubSystem → Button → SubButton
//
// Covers every feature, page, hook, data set, and UI element in the game.
// ═══════════════════════════════════════════════════════════════════════════════

export type EntityId = string;

// ── Leaf node: a button or action the player can click ─────────────────────
export interface SubButtonDef {
  id: EntityId;
  label: string;
  icon: string;
  action: string;
  shortcut?: string;
  hotkey?: string;
  tooltip?: string;
  confirmRequired?: boolean;
  color?: string;
}

export interface ButtonDef {
  id: EntityId;
  label: string;
  icon: string;
  action: string;
  subButtons?: Record<string, SubButtonDef>;
}

export interface SubSystemDef {
  id: EntityId;
  label: string;
  description: string;
  buttons?: Record<string, ButtonDef>;
}

export interface SystemDef {
  id: EntityId;
  label: string;
  description: string;
  subsystems?: Record<string, SubSystemDef>;
}

export interface SubTypeDef {
  id: EntityId;
  label: string;
  description: string;
  systems?: Record<string, SystemDef>;
}

export interface TypeDef {
  id: EntityId;
  label: string;
  description: string;
  subTypes?: Record<string, SubTypeDef>;
}

export interface SubClassDef {
  id: EntityId;
  label: string;
  description: string;
  types?: Record<string, TypeDef>;
}

export interface ClassDef {
  id: EntityId;
  label: string;
  description: string;
  subClasses?: Record<string, SubClassDef>;
}

export interface SubCategoryDef {
  id: EntityId;
  label: string;
  description: string;
  classes?: Record<string, ClassDef>;
}

export interface CategoryDef {
  id: EntityId;
  label: string;
  icon: string;
  color: string;
  description: string;
  subCategories?: Record<string, SubCategoryDef>;
}

export interface SubModuleDef {
  id: EntityId;
  label: string;
  icon: string;
  color: string;
  description: string;
  route?: string;
  categories?: Record<string, CategoryDef>;
}

export interface ModuleDef {
  id: EntityId;
  label: string;
  icon: string;
  color: string;
  description: string;
  order: number;
  subModules?: Record<string, SubModuleDef>;
}

// ── Top-level modules ───────────────────────────────────────────────────────
export const GAME_MODULES: Record<string, ModuleDef> = {
  // ═════════════════════════════════════════════════════════════════════
  // MODULE 1: EMPIRE
  // ═════════════════════════════════════════════════════════════════════
  empire: {
    id: 'empire',
    label: 'Empire Management',
    icon: 'ri-building-2-line',
    color: '#3B82F6',
    description: 'Manage your planets, buildings, colonies, population, and infrastructure.',
    order: 1,
    subModules: {
      overview: {
        id: 'overview',
        label: 'Empire Overview',
        icon: 'ri-dashboard-3-line',
        color: '#3B82F6',
        description: 'Dashboard and empire-wide summary.',
        route: '/dashboard',
        categories: {
          resources: {
            id: 'resources', label: 'Resources', icon: 'ri-coins-line', color: '#F59E0B',
            description: 'Resource production and storage.',
            subCategories: {
              primary: {
                id: 'primary', label: 'Primary Resources', description: 'Metal, Crystal, Deuterium, Energy.',
                classes: {
                  metal: { id: 'metal', label: 'Metal', description: 'Basic construction material.', subClasses: { ore: { id: 'ore', label: 'Ore Extraction', description: '', types: { mine: { id: 'mine', label: 'Metal Mine', description: '' } } }, scrap: { id: 'scrap', label: 'Scrap Recycling', description: '', types: { salvager: { id: 'salvager', label: 'Salvager', description: '' } } } } },
                  crystal: { id: 'crystal', label: 'Crystal', description: 'Advanced component material.', subClasses: { mine: { id: 'mine', label: 'Crystal Mine', description: '' }, harvester: { id: 'harvester', label: 'Crystal Harvester', description: '' } } },
                  deuterium: { id: 'deuterium', label: 'Deuterium', description: 'Fuel and FTL propellant.', subClasses: { synthesizer: { id: 'synthesizer', label: 'Deuterium Synthesizer', description: '' }, harvester: { id: 'harvester', label: 'Gas Harvester', description: '' } } },
                  energy: { id: 'energy', label: 'Energy', description: 'Power for buildings and ships.', subClasses: { solar: { id: 'solar', label: 'Solar', description: '' }, fusion: { id: 'fusion', label: 'Fusion', description: '' }, antimatter: { id: 'antimatter', label: 'Antimatter', description: '' }, zeroPoint: { id: 'zeroPoint', label: 'Zero-Point', description: '' } } },
                },
              },
              advanced: {
                id: 'advanced', label: 'Advanced Resources', description: 'Rare and exotic materials.',
                classes: {
                  darkMatter: { id: 'darkMatter', label: 'Dark Matter', description: 'Exotic space-time material.' },
                  antimatter: { id: 'antimatter', label: 'Antimatter', description: 'High-energy particle matter.' },
                  nanites: { id: 'nanites', label: 'Nanites', description: 'Self-replicating nano-machines.' },
                  quantumCores: { id: 'quantumCores', label: 'Quantum Cores', description: 'Quantum processing units.' },
                },
              },
              currencies: {
                id: 'currencies', label: 'Currencies', description: 'Imperial and Republic Credits.',
                classes: {
                  imperialCredits: { id: 'imperialCredits', label: 'Imperial Credits', description: 'Standard galactic currency.' },
                  republicCredits: { id: 'republicCredits', label: 'Republic Credits', description: 'Faction-based currency.' },
                },
              },
            },
          },
          stats: {
            id: 'stats', label: 'Statistics', icon: 'ri-bar-chart-line', color: '#8B5CF6',
            description: 'Empire statistics and rankings.',
            subCategories: {
              military: { id: 'military', label: 'Military Stats', description: 'Fleet size, power, ships destroyed.' },
              economy: { id: 'economy', label: 'Economy Stats', description: 'Production rates, trade volume.' },
              research: { id: 'research', label: 'Research Stats', description: 'Technologies discovered, research speed.' },
              achievements: { id: 'achievements', label: 'Achievements', description: 'Milestones and unlocks.' },
            },
          },
        },
      },
      buildings: {
        id: 'buildings', label: 'Buildings', icon: 'ri-building-2-line', color: '#3B82F6',
        description: 'Construct and upgrade planetary facilities.',
        route: '/buildings',
        categories: {
          production: {
            id: 'production', label: 'Production Buildings', icon: 'ri-factory-line', color: '#F59E0B',
            description: 'Resource extraction and manufacturing.',
            subCategories: {
              mines: { id: 'mines', label: 'Mines & Extractors', description: 'Resource gathering facilities.', classes: { metalMine: { id: 'metalMine', label: 'Metal Mine', description: '' }, crystalMine: { id: 'crystalMine', label: 'Crystal Mine', description: '' }, deuteriumSynth: { id: 'deuteriumSynth', label: 'Deuterium Synthesizer', description: '' }, gasHarvester: { id: 'gasHarvester', label: 'Gas Harvester', description: '' }, orbitalMining: { id: 'orbitalMining', label: 'Orbital Mining Station', description: '' } } },
              energy: { id: 'energy', label: 'Energy Facilities', description: 'Power generation buildings.', classes: { solarPlant: { id: 'solarPlant', label: 'Solar Plant', description: '' }, fusionReactor: { id: 'fusionReactor', label: 'Fusion Reactor', description: '' }, antimatterPlant: { id: 'antimatterPlant', label: 'Antimatter Plant', description: '' }, zeroPointReactor: { id: 'zeroPointReactor', label: 'Zero-Point Reactor', description: '' } } },
              storage: { id: 'storage', label: 'Storage Facilities', description: 'Resource storage buildings.', classes: { metalStorage: { id: 'metalStorage', label: 'Metal Storage', description: '' }, crystalStorage: { id: 'crystalStorage', label: 'Crystal Storage', description: '' }, deuteriumTank: { id: 'deuteriumTank', label: 'Deuterium Tank', description: '' }, energyCapacitor: { id: 'energyCapacitor', label: 'Energy Capacitor', description: '' } } },
            },
          },
          facility: {
            id: 'facility', label: 'Facilities', icon: 'ri-government-line', color: '#06B6D4',
            description: 'Empire infrastructure and special buildings.',
            subCategories: {
              infrastructure: { id: 'infrastructure', label: 'Infrastructure', description: 'Base colony facilities.', classes: { roboticsFactory: { id: 'roboticsFactory', label: 'Robotics Factory', description: '' }, shipyard: { id: 'shipyard', label: 'Shipyard', description: '' }, researchLab: { id: 'researchLab', label: 'Research Lab', description: '' }, allianceDepot: { id: 'allianceDepot', label: 'Alliance Depot', description: '' }, missileSilo: { id: 'missileSilo', label: 'Missile Silo', description: '' }, naniteFactory: { id: 'naniteFactory', label: 'Nanite Factory', description: '' }, terraformer: { id: 'terraformer', label: 'Terraformer', description: '' }, spaceDock: { id: 'spaceDock', label: 'Space Dock', description: '' } } },
              lunar: { id: 'lunar', label: 'Lunar Facilities', description: 'Moon base buildings.', classes: { lunarBase: { id: 'lunarBase', label: 'Lunar Base', description: '' }, sensorArray: { id: 'sensorArray', label: 'Sensor Array', description: '' }, jumpGate: { id: 'jumpGate', label: 'Jump Gate', description: '' } } },
              orbital: { id: 'orbital', label: 'Orbital Facilities', description: 'Space station buildings.', classes: { orbitalPlatform: { id: 'orbitalPlatform', label: 'Orbital Platform', description: '' }, defenseGrid: { id: 'defenseGrid', label: 'Defense Grid', description: '' }, tradeHub: { id: 'tradeHub', label: 'Trade Hub', description: '' } } },
            },
          },
          population: {
            id: 'population', label: 'Population', icon: 'ri-group-line', color: '#F97316',
            description: 'Population management and colony growth.',
            route: '/population',
            subCategories: {
              housing: { id: 'housing', label: 'Housing', description: 'Living quarters and habitats.', classes: { residentialBlock: { id: 'residentialBlock', label: 'Residential Block', description: '' }, habitatDome: { id: 'habitatDome', label: 'Habitat Dome', description: '' }, arcology: { id: 'arcology', label: 'Arcology', description: '' } } },
              growth: { id: 'growth', label: 'Population Growth', description: 'Birth rate and immigration.', classes: { nursery: { id: 'nursery', label: 'Nursery', description: '' }, cloningFacility: { id: 'cloningFacility', label: 'Cloning Facility', description: '' }, immigrationCenter: { id: 'immigrationCenter', label: 'Immigration Center', description: '' } } },
              morale: { id: 'morale', label: 'Morale & Happiness', description: 'Citizen satisfaction and productivity.', classes: { entertainmentComplex: { id: 'entertainmentComplex', label: 'Entertainment Complex', description: '' }, paradiseDome: { id: 'paradiseDome', label: 'Paradise Dome', description: '' }, monument: { id: 'monument', label: 'Monument', description: '' } } },
              food: { id: 'food', label: 'Food & Water', description: 'Sustenance and disease control.', route: '/food-water-disease', classes: { hydroponics: { id: 'hydroponics', label: 'Hydroponics Farm', description: '' }, waterProcessor: { id: 'waterProcessor', label: 'Water Processor', description: '' }, bioLab: { id: 'bioLab', label: 'Bio-Research Lab', description: '' }, medicalCenter: { id: 'medicalCenter', label: 'Medical Center', description: '' } } },
            },
          },
        },
      },
      colonies: {
        id: 'colonies', label: 'Colonies', icon: 'ri-planet-line', color: '#10B981',
        description: 'Manage your planetary colonies and moon bases.',
        route: '/colonies',
        categories: {
          planets: {
            id: 'planets', label: 'Planets', icon: 'ri-earth-line', color: '#10B981',
            description: 'All colonized planets.',
            subCategories: {
              byType: { id: 'byType', label: 'By Planet Type', description: 'Terran, Desert, Ocean, Ice, Volcanic, Gas, Rocky, Jungle, Barren, Exotic.' },
              byPosition: { id: 'byPosition', label: 'By Position', description: 'Positions 1-15 in a solar system.' },
              bySize: { id: 'bySize', label: 'By Size', description: 'Small, Medium, Large, Giant.' },
            },
          },
          moons: {
            id: 'moons', label: 'Moons', icon: 'ri-moon-line', color: '#8B5CF6',
            description: 'Lunar bases and facilities.',
            route: '/moonbases',
            subCategories: {
              facilities: { id: 'facilities', label: 'Lunar Facilities', description: 'Buildings on moon bases.' },
              defense: { id: 'defense', label: 'Lunar Defense', description: 'Moon base defensive structures.' },
              special: { id: 'special', label: 'Special Lunar Structures', description: 'Jump Gates, Sensor Arrays.' },
            },
          },
          starbases: {
            id: 'starbases', label: 'Starbases', icon: 'ri-base-station-line', color: '#F59E0B',
            description: 'Orbital starbases and space stations.',
            route: '/starbases',
            subCategories: {
              type: { id: 'type', label: 'Starbase Types', description: 'Outpost, Station, Fortress, Citadel.' },
              modules: { id: 'modules', label: 'Starbase Modules', description: 'Docks, Hangars, Defense Platforms.' },
              defense: { id: 'defense', label: 'Starbase Defense', description: 'Turret arrays, Shield generators.' },
            },
          },
        },
      },
      storage: {
        id: 'storage', label: 'Storage', icon: 'ri-database-2-line', color: '#6B7280',
        description: 'Resource storage and inventory management.',
        route: '/storage',
        categories: {
          resources: {
            id: 'resources', label: 'Resource Storage', icon: 'ri-stack-line', color: '#6B7280',
            description: 'Capacity for primary resources.',
            subCategories: {
              capacities: { id: 'capacities', label: 'Storage Capacities', description: 'Current and max storage levels.' },
              upgrades: { id: 'upgrades', label: 'Storage Upgrades', description: 'Increase storage capacity.' },
            },
          },
          inventory: {
            id: 'inventory', label: 'Inventory', icon: 'ri-inbox-line', color: '#8B5CF6',
            description: 'Items, materials, and artifacts.',
            subCategories: {
              materials: { id: 'materials', label: 'Crafting Materials', description: 'Raw and refined crafting components.' },
              artifacts: { id: 'artifacts', label: 'Artifacts', description: 'Ancient and exotic artifacts.' },
              consumables: { id: 'consumables', label: 'Consumables', description: 'One-use items and boosters.' },
            },
          },
        },
      },
      megastructures: {
        id: 'megastructures', label: 'Megastructures', icon: 'ri-mental-health-line', color: '#A855F7',
        description: 'Massive-scale construction projects.',
        route: '/megastructures',
        categories: {
          energy: {
            id: 'energy', label: 'Energy Megastructures', icon: 'ri-sun-line', color: '#F59E0B',
            description: 'Power generation at massive scale.',
            subCategories: {
              dysonSphere: { id: 'dysonSphere', label: 'Dyson Sphere', description: 'Stellar-scale energy collector.' },
              dysonSwarm: { id: 'dysonSwarm', label: 'Dyson Swarm', description: 'Orbital solar collector array.' },
              ringWorld: { id: 'ringWorld', label: 'Ring World', description: 'Habitable ring megastructure.' },
              starLift: { id: 'starLift', label: 'Star Lifter', description: 'Extracts stellar material.' },
            },
          },
          scientific: {
            id: 'scientific', label: 'Science Megastructures', icon: 'ri-flask-line', color: '#06B6D4',
            description: 'Research-oriented megastructures.',
            subCategories: {
              researchNexus: { id: 'researchNexus', label: 'Research Nexus', description: 'Centralized research hub.' },
              sentinelArray: { id: 'sentinelArray', label: 'Sentinel Array', description: 'Deep space observation.' },
              quantumComputer: { id: 'quantumComputer', label: 'Quantum Computer', description: 'Ultimate computing.' },
            },
          },
          military: {
            id: 'military', label: 'Military Megastructures', icon: 'ri-sword-line', color: '#EF4444',
            description: 'Defensive and offensive megastructures.',
            subCategories: {
              orbitalFortress: { id: 'orbitalFortress', label: 'Orbital Fortress', description: 'System defense platform.' },
              planetaryShield: { id: 'planetaryShield', label: 'Planetary Shield', description: 'World-wide shield generator.' },
              ionCannon: { id: 'ionCannon', label: 'Ion Cannon', description: 'Planetary-scale weapon.' },
            },
          },
        },
      },
      travel: {
        id: 'travel', label: 'Travel Network', icon: 'ri-road-map-line', color: '#14B8A6',
        description: 'Interstellar travel and transportation.',
        route: '/travel-network',
        categories: {
          stargates: {
            id: 'stargates', label: 'Stargate Network', icon: 'ri-door-open-line', color: '#14B8A6',
            description: 'Instant travel between gates.',
            route: '/stargate-network',
            subCategories: {
              gates: { id: 'gates', label: 'Gates', description: 'Constructed stargates.' },
              routes: { id: 'routes', label: 'Gate Routes', description: 'Connected gate pairs.' },
              jumps: { id: 'jumps', label: 'Active Jumps', description: 'Fleets in transit via gate.' },
            },
          },
          wormholes: {
            id: 'wormholes', label: 'Wormholes', icon: 'ri-contrast-2-line', color: '#A855F7',
            description: 'Natural and artificial wormholes.',
            subCategories: {
              natural: { id: 'natural', label: 'Natural Wormholes', description: 'Stable cosmic wormholes.' },
              artificial: { id: 'artificial', label: 'Artificial Wormholes', description: 'Player-created wormholes.' },
            },
          },
          tradeRoutes: {
            id: 'tradeRoutes', label: 'Trade Routes', icon: 'ri-exchange-line', color: '#F59E0B',
            description: 'Automated resource transportation.',
            route: '/trade-routes',
            subCategories: {
              active: { id: 'active', label: 'Active Routes', description: 'Currently running trade routes.' },
              available: { id: 'available', label: 'Available Partners', description: 'Potential trade partners.' },
              history: { id: 'history', label: 'Route History', description: 'Past shipments and profits.' },
            },
          },
        },
      },
      foodWaterDisease: {
        id: 'foodWaterDisease', label: 'Food, Water & Disease', icon: 'ri-mental-health-line', color: '#F97316',
        description: 'Colony sustenance, health, and plague management.',
        route: '/food-water-disease',
        categories: {
          food: { id: 'food', label: 'Food Production', icon: 'ri-restaurant-line', color: '#22C55E', description: 'Sustenance for your population.' },
          water: { id: 'water', label: 'Water Management', icon: 'ri-drop-line', color: '#3B82F6', description: 'Clean water supply and purification.' },
          disease: { id: 'disease', label: 'Disease Control', icon: 'ri-virus-line', color: '#EF4444', description: 'Outbreak prevention and response.' },
          health: { id: 'health', label: 'Healthcare', icon: 'ri-hospital-line', color: '#06B6D4', description: 'Medical facilities and bio-research.' },
        },
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  // MODULE 2: POWER & ENERGY
  // ═════════════════════════════════════════════════════════════════════
  power: {
    id: 'power',
    label: 'Power & Energy',
    icon: 'ri-flashlight-line',
    color: '#F59E0B',
    description: 'Power grid management, reactors, and ALC technology systems.',
    order: 2,
    subModules: {
      powerGrid: {
        id: 'powerGrid', label: 'Power Grid', icon: 'ri-grid-line', color: '#F59E0B',
        description: 'Visual grid management for power distribution.',
        route: '/power-grid',
        categories: {
          gridView: { id: 'gridView', label: 'Grid View', icon: 'ri-layout-grid-line', color: '#F59E0B', description: 'Visual grid editor.', subCategories: { cells: { id: 'cells', label: 'Grid Cells', description: '' }, reactors: { id: 'reactors', label: 'Reactors', description: '' }, connections: { id: 'connections', label: 'Connections', description: '' } } },
          stats: { id: 'stats', label: 'Grid Statistics', icon: 'ri-bar-chart-line', color: '#8B5CF6', description: 'Grid performance metrics.', subCategories: { generation: { id: 'generation', label: 'Power Generation', description: '' }, consumption: { id: 'consumption', label: 'Power Consumption', description: '' }, losses: { id: 'losses', label: 'Transmission Losses', description: '' }, efficiency: { id: 'efficiency', label: 'Grid Efficiency', description: '' } } },
          overload: { id: 'overload', label: 'Overload Management', icon: 'ri-alarm-warning-line', color: '#EF4444', description: 'Meltdown risk and event handling.', subCategories: { risk: { id: 'risk', label: 'Risk Assessment', description: '' }, events: { id: 'events', label: 'Overload Events', description: '' }, stabilization: { id: 'stabilization', label: 'Emergency Stabilization', description: '' } } },
        },
      },
      reactors: {
        id: 'reactors', label: 'Reactors', icon: 'ri-flashlight-fill', color: '#A855F7',
        description: 'Reactor construction, upgrade, and research.',
        route: '/reactor-research',
        categories: {
          definitions: { id: 'definitions', label: 'Reactor Types', icon: 'ri-list-check', color: '#A855F7', description: 'All available reactor definitions.', subCategories: { byClass: { id: 'byClass', label: 'By Reactor Class', description: 'Civilian, Industrial, Military, Research, Exotic.' }, bySubClass: { id: 'bySubClass', label: 'By Sub-Class', description: 'Standard, Advanced, Elite, Master, Grandmaster, Mythic.' }, byType: { id: 'byType', label: 'By Type', description: 'Fusion, Antimatter, Solar, Dark Matter, Zero-Point, Geothermal, Plasma, Bio, Dimensional.' } } },
          management: { id: 'management', label: 'Reactor Management', icon: 'ri-settings-line', color: '#8B5CF6', description: 'Place, upgrade, maintain, repair.', subCategories: { placement: { id: 'placement', label: 'Grid Placement', description: '' }, upgrades: { id: 'upgrades', label: 'Level Upgrades', description: '' }, maintenance: { id: 'maintenance', label: 'Maintenance & Repair', description: '' }, scrapping: { id: 'scrapping', label: 'Scrapping', description: '' } } },
        },
      },
      alcTech: {
        id: 'alcTech', label: 'ALC Power Tech Tree', icon: 'ri-tree-line', color: '#06B6D4',
        description: 'ALC (Arknights: Endfield) power technology research.',
        route: '/alc-power-tech',
        categories: {
          gridOps: { id: 'gridOps', label: 'Grid Operations', icon: 'ri-grid-line', color: '#06B6D4', description: 'Grid efficiency, topology, automation.', subCategories: { basics: { id: 'basics', label: 'Basic Grid Management', description: '' }, topology: { id: 'topology', label: 'Grid Topology Optimization', description: '' }, automation: { id: 'automation', label: 'Grid Automation Systems', description: '' } } },
          reactorEnhancement: { id: 'reactorEnhancement', label: 'Reactor Enhancement', icon: 'ri-flashlight-fill', color: '#A855F7', description: 'Reactor output and efficiency per class.', subCategories: { standard: { id: 'standard', label: 'Standard Calibration', description: '' }, advanced: { id: 'advanced', label: 'Advanced Tuning', description: '' }, elite: { id: 'elite', label: 'Elite Optimization', description: '' }, master: { id: 'master', label: 'Master Synthesis', description: '' }, grandmaster: { id: 'grandmaster', label: 'Grandmaster Singularity', description: '' }, mythic: { id: 'mythic', label: 'Mythic Dimensional', description: '' } } },
          transmission: { id: 'transmission', label: 'Transmission Tech', icon: 'ri-route-line', color: '#22D3EE', description: 'Connection types and loss reduction.', subCategories: { hv: { id: 'hv', label: 'High-Voltage', description: '' }, sc: { id: 'sc', label: 'Superconductor', description: '' }, qr: { id: 'qr', label: 'Quantum Relay', description: '' } } },
          stability: { id: 'stability', label: 'Stability & Safety', icon: 'ri-shield-check-line', color: '#34D399', description: 'Meltdown prevention and hardening.', subCategories: { basics: { id: 'basics', label: 'Safety Protocols', description: '' }, hardening: { id: 'hardening', label: 'Reactor Hardening', description: '' }, emergency: { id: 'emergency', label: 'Emergency Shutdown', description: '' }, mastery: { id: 'mastery', label: 'Stability Field Mastery', description: '' } } },
          storage: { id: 'storage', label: 'Energy Storage', icon: 'ri-battery-line', color: '#FBBF24', description: 'Reserve capacity and surge protection.', subCategories: { cell: { id: 'cell', label: 'Energy Cell', description: '' }, capacitor: { id: 'capacitor', label: 'Capacitor Arrays', description: '' }, quantum: { id: 'quantum', label: 'Quantum Storage', description: '' } } },
        },
      },
      energyStorage: {
        id: 'energyStorage', label: 'Energy Storage', icon: 'ri-battery-2-line', color: '#FBBF24',
        description: 'Grid buffering, capacitor banks, and surge protection.', route: '/storage',
        categories: {
          capacitors: { id: 'capacitors', label: 'Capacitors', icon: 'ri-battery-charge-line', color: '#FBBF24', description: 'Power storage units.' },
          batteries: { id: 'batteries', label: 'Battery Banks', icon: 'ri-battery-low-line', color: '#F59E0B', description: 'Long-term energy reserves.' },
          surge: { id: 'surge', label: 'Surge Protection', icon: 'ri-lightning-line', color: '#EF4444', description: 'Overload absorption systems.' },
        },
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  // MODULE 3: MILITARY
  // ═════════════════════════════════════════════════════════════════════
  military: {
    id: 'military',
    label: 'Military',
    icon: 'ri-sword-line',
    color: '#EF4444',
    description: 'Fleet management, ship production, combat, and defense.',
    order: 3,
    subModules: {
      fleet: {
        id: 'fleet', label: 'Fleet', icon: 'ri-rocket-2-line', color: '#EF4444',
        description: 'Manage your starship fleet and missions.',
        route: '/fleet',
        categories: {
          overview: { id: 'overview', label: 'Fleet Overview', icon: 'ri-list-check', color: '#EF4444', description: 'All ships and fleets at a glance.', subCategories: { ships: { id: 'ships', label: 'Ship Inventory', description: '' }, fleets: { id: 'fleets', label: 'Active Fleets', description: '' }, missions: { id: 'missions', label: 'Active Missions', description: '' }, returning: { id: 'returning', label: 'Returning Fleets', description: '' } } },
          missions: {
            id: 'missions', label: 'Fleet Missions', icon: 'ri-send-plane-line', color: '#F97316',
            description: 'Send fleets on various mission types.',
            route: '/missions',
            subCategories: {
              attack: { id: 'attack', label: 'Attack', description: 'Offensive combat missions.' },
              transport: { id: 'transport', label: 'Transport', description: 'Resource shipment missions.' },
              deploy: { id: 'deploy', label: 'Deploy', description: 'Station ships at remote locations.' },
              station: { id: 'station', label: 'Station', description: 'Hold position at a location.' },
              spy: { id: 'spy', label: 'Espionage', description: 'Gather intelligence on targets.' },
              colonize: { id: 'colonize', label: 'Colonize', description: 'Establish new colonies.' },
              harvest: { id: 'harvest', label: 'Harvest', description: 'Collect debris field resources.' },
              destroy: { id: 'destroy', label: 'Destroy Moon', description: 'Attempt to destroy a moon.' },
              expedition: { id: 'expedition', label: 'Expedition', description: 'Explore the unknown.' },
              alliance: { id: 'alliance', label: 'Alliance Attack', description: 'Joint alliance assault.' },
            },
          },
          formations: {
            id: 'formations', label: 'Fleet Formations', icon: 'ri-group-2-line', color: '#A855F7',
            description: 'Arrange ships into tactical formations.',
            route: '/fleet-formations',
            subCategories: {
              offensive: { id: 'offensive', label: 'Offensive Formations', description: 'Attack-focused arrangements.' },
              defensive: { id: 'defensive', label: 'Defensive Formations', description: 'Protection-oriented formations.' },
              balanced: { id: 'balanced', label: 'Balanced Formations', description: 'Mixed offensive/defensive.' },
              specialized: { id: 'specialized', label: 'Specialized Formations', description: 'Role-specific setups.' },
            },
          },
          combat: {
            id: 'combat', label: 'Fleet Combat', icon: 'ri-sword-fill', color: '#DC2626',
            description: 'Resolve and review combat engagements.',
            route: '/fleet-combat',
            subCategories: {
              engage: { id: 'engage', label: 'Engage Combat', description: 'Initiate combat.' },
              reports: { id: 'reports', label: 'Combat Reports', description: 'Past battle results.' },
              acs: { id: 'acs', label: 'ACS (Allied Combat)', description: 'Joint fleet combat.', route: '/acs' },
            },
          },
          crews: {
            id: 'crews', label: 'Crew Assignment', icon: 'ri-team-line', color: '#3B82F6',
            description: 'Assign officers and crew to ships.',
            route: '/fleet',
            subCategories: {
              captains: { id: 'captains', label: 'Ship Captains', description: '' },
              crew: { id: 'crew', label: 'Crew Members', description: '' },
              specialists: { id: 'specialists', label: 'Specialists', description: '' },
            },
          },
        },
      },
      shipyard: {
        id: 'shipyard', label: 'Shipyard', icon: 'ri-ship-2-line', color: '#F59E0B',
        description: 'Build, upgrade, and customize ships.',
        route: '/shipyard',
        categories: {
          production: {
            id: 'production', label: 'Ship Production', icon: 'ri-hammer-line', color: '#F59E0B',
            description: 'Build new ships.',
            subCategories: {
              queue: { id: 'queue', label: 'Production Queue', description: '' },
              light: { id: 'light', label: 'Light Ships', description: 'Fighters, Interceptors, Bombers.' },
              medium: { id: 'medium', label: 'Medium Ships', description: 'Corvettes, Frigates, Destroyers.' },
              heavy: { id: 'heavy', label: 'Heavy Ships', description: 'Cruisers, Battlecruisers, Battleships.' },
              capital: { id: 'capital', label: 'Capital Ships', description: 'Dreadnoughts, Carriers, Titans.' },
              civilian: { id: 'civilian', label: 'Civilian Ships', description: 'Cargo, Colony, Recycler.' },
            },
          },
          upgrades: {
            id: 'upgrades', label: 'Ship Upgrades', icon: 'ri-arrow-up-circle-line', color: '#8B5CF6',
            description: 'Upgrade existing ships.',
            route: '/ship-upgrades',
            subCategories: {
              weapons: { id: 'weapons', label: 'Weapon Systems', description: '' },
              defense: { id: 'defense', label: 'Defense Systems', description: '' },
              engines: { id: 'engines', label: 'Engine Upgrades', description: '' },
              special: { id: 'special', label: 'Special Modules', description: '' },
            },
          },
          customization: {
            id: 'customization', label: 'Ship Customization', icon: 'ri-palette-line', color: '#EC4899',
            description: 'Customize ship appearance and loadouts.',
            route: '/ship-customization',
            subCategories: {
              skins: { id: 'skins', label: 'Ship Skins', description: '' },
              loadouts: { id: 'loadouts', label: 'Weapon Loadouts', description: '' },
              decals: { id: 'decals', label: 'Decals & Markings', description: '' },
            },
          },
        },
      },
      starships: {
        id: 'starships', label: 'Starships', icon: 'ri-rocket-line', color: '#8B5CF6',
        description: 'All starship classes, stats, and management.',
        route: '/starships',
        categories: {
          classes: { id: 'classes', label: 'Ship Classes', icon: 'ri-list-check', color: '#8B5CF6', description: 'All 20 ship classes.', subCategories: { fighter: { id: 'fighter', label: 'Fighters', description: '' }, corvette: { id: 'corvette', label: 'Corvettes', description: '' }, frigate: { id: 'frigate', label: 'Frigates', description: '' }, destroyer: { id: 'destroyer', label: 'Destroyers', description: '' }, cruiser: { id: 'cruiser', label: 'Cruisers', description: '' }, battleship: { id: 'battleship', label: 'Battleships', description: '' }, carrier: { id: 'carrier', label: 'Carriers', description: '' }, titan: { id: 'titan', label: 'Titans', description: '' } } },
          roles: { id: 'roles', label: 'Ship Roles', icon: 'ri-user-star-line', color: '#F59E0B', description: 'Combat roles and specializations.', subCategories: { vanguard: { id: 'vanguard', label: 'Vanguard', description: '' }, line: { id: 'line', label: 'Line', description: '' }, sniper: { id: 'sniper', label: 'Sniper', description: '' }, tank: { id: 'tank', label: 'Tank', description: '' }, support: { id: 'support', label: 'Support', description: '' } } },
          enhanced: {
            id: 'enhanced', label: 'Enhanced Ships', icon: 'ri-star-line', color: '#A855F7',
            description: 'Special upgraded ship variants.',
            route: '/enhanced-ships',
            subCategories: {
              mk2: { id: 'mk2', label: 'Mk II Variants', description: '' },
              mk3: { id: 'mk3', label: 'Mk III Variants', description: '' },
              prototype: { id: 'prototype', label: 'Prototypes', description: '' },
              legendary: { id: 'legendary', label: 'Legendary Ships', description: '' },
            },
          },
        },
      },
      motherships: {
        id: 'motherships', label: 'Motherships', icon: 'ri-parent-line', color: '#EC4899',
        description: 'Flagship-class capital vessels.',
        route: '/motherships',
        categories: {
          classes: {
            id: 'classes', label: 'Mothership Classes', icon: 'ri-list-check', color: '#EC4899',
            description: '12 mothership classes.',
            subCategories: {
              ark: { id: 'ark', label: 'Ark Class', description: '' },
              carrier: { id: 'carrier', label: 'Carrier Class', description: '' },
              command: { id: 'command', label: 'Command Class', description: '' },
              dreadnought: { id: 'dreadnought', label: 'Dreadnought Class', description: '' },
              forge: { id: 'forge', label: 'Forge Class', description: '' },
              genesis: { id: 'genesis', label: 'Genesis Class', description: '' },
              leviathan: { id: 'leviathan', label: 'Leviathan Class', description: '' },
              nexus: { id: 'nexus', label: 'Nexus Class', description: '' },
              sanctuary: { id: 'sanctuary', label: 'Sanctuary Class', description: '' },
              titan: { id: 'titan', label: 'Titan Class', description: '' },
              worldship: { id: 'worldship', label: 'Worldship Class', description: '' },
            },
          },
          enhanced: {
            id: 'enhanced', label: 'Enhanced Motherships', icon: 'ri-star-line', color: '#D946EF',
            description: 'Upgraded mothership variants.',
            route: '/enhanced-motherships',
            subCategories: { ascended: { id: 'ascended', label: 'Ascended Variants', description: '' }, awakened: { id: 'awakened', label: 'Awakened Variants', description: '' }, eternal: { id: 'eternal', label: 'Eternal Variants', description: '' } },
          },
        },
      },
      defense: {
        id: 'defense', label: 'Defense', icon: 'ri-shield-line', color: '#3B82F6',
        description: 'Planetary and orbital defense structures.',
        route: '/defense',
        categories: {
          turrets: {
            id: 'turrets', label: 'Turret Defenses', icon: 'ri-crosshair-line', color: '#EF4444',
            description: 'Weapon emplacements.',
            subCategories: {
              light: { id: 'light', label: 'Light Turrets', description: 'Rocket Launcher, Light Laser.' },
              medium: { id: 'medium', label: 'Medium Turrets', description: 'Heavy Laser, Gauss Cannon, Ion Cannon.' },
              heavy: { id: 'heavy', label: 'Heavy Turrets', description: 'Plasma Turret, Particle Cannon.' },
              missile: { id: 'missile', label: 'Missile Systems', description: 'Interceptors, Anti-Ballistic.' },
            },
          },
          shields: {
            id: 'shields', label: 'Shield Generators', icon: 'ri-shield-star-line', color: '#06B6D4',
            description: 'Planetary and orbital shields.',
            subCategories: { planetary: { id: 'planetary', label: 'Planetary Shield', description: '' }, orbital: { id: 'orbital', label: 'Orbital Shield', description: '' } },
          },
          planetary: {
            id: 'planetary', label: 'Planetary Defense', icon: 'ri-earth-line', color: '#22C55E',
            description: 'Integrated planetary defense systems.',
            subCategories: { ground: { id: 'ground', label: 'Ground Defenses', description: '' }, orbital: { id: 'orbital', label: 'Orbital Platforms', description: '' }, planetaryShield: { id: 'planetaryShield', label: 'Planetary Shield', description: '' } },
          },
        },
      },
      units: {
        id: 'units', label: 'Units', icon: 'ri-group-2-line', color: '#22C55E',
        description: 'Ground forces, personnel, and training.',
        route: '/units',
        categories: {
          military: {
            id: 'military', label: 'Military Units', icon: 'ri-sword-line', color: '#EF4444',
            description: 'Combat personnel.',
            subCategories: {
              infantry: { id: 'infantry', label: 'Infantry', description: 'Soldiers, Veterans, Elites.' },
              special: { id: 'special', label: 'Special Forces', description: 'Commandos, Psi-Operatives.' },
              armored: { id: 'armored', label: 'Armored Units', description: 'Tanks, Mechs.' },
              artillery: { id: 'artillery', label: 'Artillery', description: 'Howitzers, Plasma Cannons.' },
              air: { id: 'air', label: 'Air Units', description: 'Fighters, Bombers, Gunships.' },
              support: { id: 'support', label: 'Support Units', description: 'Medics, Engineers.' },
            },
          },
          civilian: {
            id: 'civilian', label: 'Civilian Units', icon: 'ri-user-line', color: '#3B82F6',
            description: 'Non-combat personnel.',
            subCategories: {
              labor: { id: 'labor', label: 'Laborers', description: 'Construction, Mining.' },
              science: { id: 'science', label: 'Scientists', description: 'Research, Development.' },
              trade: { id: 'trade', label: 'Traders', description: 'Commerce, Finance.' },
              admin: { id: 'admin', label: 'Administrators', description: 'Management, Governance.' },
            },
          },
          training: {
            id: 'training', label: 'Training Center', icon: 'ri-graduation-cap-line', color: '#F59E0B',
            description: 'Recruit and train new units.',
            route: '/training-center',
            subCategories: {
              recruitment: { id: 'recruitment', label: 'Recruitment', description: '' },
              training: { id: 'training', label: 'Basic Training', description: '' },
              advanced: { id: 'advanced', label: 'Advanced Training', description: '' },
              specialization: { id: 'specialization', label: 'Specialization Paths', description: '' },
            },
          },
          groundCombat: {
            id: 'groundCombat', label: 'Ground Combat', icon: 'ri-crosshair-2-line', color: '#DC2626',
            description: 'Planetary invasion and defense.',
            route: '/ground-combat',
            subCategories: {
              deploy: { id: 'deploy', label: 'Deploy Units', description: '' },
              battle: { id: 'battle', label: 'Battle Resolution', description: '' },
              reports: { id: 'reports', label: 'Battle Reports', description: '' },
            },
          },
        },
      },
      officers: {
        id: 'officers', label: 'Officers', icon: 'ri-user-star-line', color: '#A855F7',
        description: 'Command staff and special operatives.',
        route: '/officers',
        categories: {
          admirals: { id: 'admirals', label: 'Admirals', icon: 'ri-star-line', color: '#EF4444', description: 'Fleet command officers.' },
          commanders: { id: 'commanders', label: 'Commanders', icon: 'ri-star-half-line', color: '#F59E0B', description: 'Tactical field commanders.' },
          captains: { id: 'captains', label: 'Captains', icon: 'ri-steering-line', color: '#3B82F6', description: 'Individual ship captains.' },
          specialists: { id: 'specialists', label: 'Specialists', icon: 'ri-flask-line', color: '#22C55E', description: 'Scientific and engineering officers.' },
          diplomacy: { id: 'diplomacy', label: 'Diplomats', icon: 'ri-handshake-line', color: '#06B6D4', description: 'Diplomatic officers.' },
        },
      },
      combatSim: {
        id: 'combatSim', label: 'Combat Simulator', icon: 'ri-gamepad-line', color: '#8B5CF6',
        description: 'Simulate battles before committing.',
        route: '/combat-simulator',
        categories: {
          setup: { id: 'setup', label: 'Battle Setup', icon: 'ri-settings-line', color: '#8B5CF6', description: 'Configure simulation parameters.' },
          results: { id: 'results', label: 'Simulation Results', icon: 'ri-bar-chart-line', color: '#F59E0B', description: 'Analyze battle outcomes.' },
        },
      },
      warRoom: {
        id: 'warRoom', label: 'War Room', icon: 'ri-map-2-line', color: '#DC2626',
        description: 'Strategic overview of conflicts and campaigns.',
        route: '/war-room',
        categories: {
          overview: { id: 'overview', label: 'War Overview', icon: 'ri-global-line', color: '#DC2626', description: 'Active conflicts.' },
          campaigns: { id: 'campaigns', label: 'Campaigns', icon: 'ri-flag-line', color: '#F59E0B', description: 'Structured mission chains.', route: '/campaign' },
          expeditions: { id: 'expeditions', label: 'Expeditions', icon: 'ri-compass-line', color: '#22C55E', description: 'Deep space exploration.', route: '/expeditions' },
        },
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  // MODULE 4: RESEARCH & TECHNOLOGY
  // ═════════════════════════════════════════════════════════════════════
  research: {
    id: 'research',
    label: 'Research & Technology',
    icon: 'ri-flask-line',
    color: '#8B5CF6',
    description: 'Unlock new technologies, skills, and blueprints.',
    order: 4,
    subModules: {
      researchLab: {
        id: 'researchLab', label: 'Research Lab', icon: 'ri-flask-line', color: '#8B5CF6',
        description: 'Standard technology research tree.',
        route: '/research',
        categories: {
          categories: {
            id: 'categories', label: 'Research Categories', icon: 'ri-list-check', color: '#8B5CF6',
            description: 'Organized by field of study.',
            subCategories: {
              combat: { id: 'combat', label: 'Combat Technologies', description: 'Weapons, Targeting, Tactics.' },
              defense: { id: 'defense', label: 'Defense Technologies', description: 'Armor, Shielding, Fortification.' },
              propulsion: { id: 'propulsion', label: 'Propulsion Technologies', description: 'Sub-light, FTL, Hyperspace.' },
              energy: { id: 'energy', label: 'Energy Technologies', description: 'Generation, Efficiency, Storage.' },
              economic: { id: 'economic', label: 'Economic Technologies', description: 'Mining, Production, Trade.' },
              espionage: { id: 'espionage', label: 'Espionage Technologies', description: 'Surveillance, Counter-Intel.' },
              advanced: { id: 'advanced', label: 'Advanced Technologies', description: 'Nano, Quantum, Xenotech.' },
              astrophysics: { id: 'astrophysics', label: 'Astrophysics', description: 'Exploration, Colonization.' },
            },
          },
        },
      },
      advancedResearch: {
        id: 'advancedResearch', label: 'Advanced Research', icon: 'ri-flask-fill', color: '#EC4899',
        description: 'Post-standard research with exotic requirements.',
        route: '/advanced-research',
        categories: {
          disciplines: { id: 'disciplines', label: 'Disciplines', icon: 'ri-book-2-line', color: '#EC4899', description: 'Specialized research paths.', subCategories: { quantum: { id: 'quantum', label: 'Quantum Physics', description: '' }, xenotech: { id: 'xenotech', label: 'Xeno-Technology', description: '' }, nanotechnology: { id: 'nanotechnology', label: 'Nanotechnology', description: '' }, cosmic: { id: 'cosmic', label: 'Cosmic Studies', description: '' } } },
          projects: { id: 'projects', label: 'Research Projects', icon: 'ri-projector-line', color: '#A855F7', description: 'Active research initiatives.' },
        },
      },
      skills: {
        id: 'skills', label: 'Skills', icon: 'ri-user-settings-line', color: '#3B82F6',
        description: 'Player skill trees and abilities.',
        route: '/skills',
        categories: {
          categories: {
            id: 'categories', label: 'Skill Categories', icon: 'ri-list-check', color: '#3B82F6',
            description: 'Skill domains.',
            subCategories: {
              combat: { id: 'combat', label: 'Combat Skills', description: '' },
              leadership: { id: 'leadership', label: 'Leadership Skills', description: '' },
              engineering: { id: 'engineering', label: 'Engineering Skills', description: '' },
              science: { id: 'science', label: 'Science Skills', description: '' },
              diplomacy: { id: 'diplomacy', label: 'Diplomacy Skills', description: '' },
              crafting: { id: 'crafting', label: 'Crafting Skills', description: '' },
            },
          },
        },
      },
      blueprints: {
        id: 'blueprints', label: 'Blueprints', icon: 'ri-file-list-3-line', color: '#F59E0B',
        description: 'Ship, weapon, and building blueprints.',
        route: '/blueprints',
        categories: {
          ships: { id: 'ships', label: 'Ship Blueprints', icon: 'ri-ship-line', color: '#F59E0B', description: 'Starship construction plans.' },
          weapons: { id: 'weapons', label: 'Weapon Blueprints', icon: 'ri-sword-line', color: '#EF4444', description: 'Weapon system designs.' },
          buildings: { id: 'buildings', label: 'Building Blueprints', icon: 'ri-building-2-line', color: '#3B82F6', description: 'Facility construction plans.' },
          special: { id: 'special', label: 'Special Blueprints', icon: 'ri-star-line', color: '#A855F7', description: 'Unique and legendary designs.' },
        },
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  // MODULE 5: CRAFTING & MANUFACTURING
  // ═════════════════════════════════════════════════════════════════════
  crafting: {
    id: 'crafting',
    label: 'Crafting & Manufacturing',
    icon: 'ri-tools-line',
    color: '#F97316',
    description: 'Craft items, forge equipment, and manufacture goods.',
    order: 5,
    subModules: {
      crafting: {
        id: 'crafting', label: 'Crafting Overview', icon: 'ri-tools-line', color: '#F97316',
        description: 'Main crafting hub.',
        route: '/crafting',
        categories: {
          stations: { id: 'stations', label: 'Crafting Stations', icon: 'ri-hammer-line', color: '#F97316', description: 'Workbenches and stations.' },
          recipes: { id: 'recipes', label: 'Crafting Recipes', icon: 'ri-file-list-line', color: '#F59E0B', description: 'Available recipes.', subCategories: { weapons: { id: 'weapons', label: 'Weapons', description: '' }, armor: { id: 'armor', label: 'Armor', description: '' }, modules: { id: 'modules', label: 'Ship Modules', description: '' }, consumables: { id: 'consumables', label: 'Consumables', description: '' } } },
          queue: { id: 'queue', label: 'Crafting Queue', icon: 'ri-stack-line', color: '#8B5CF6', description: 'Active production queue.' },
        },
      },
      forge: {
        id: 'forge', label: 'Forge', icon: 'ri-fire-line', color: '#EF4444',
        description: 'Advanced forging and smithing.',
        route: '/crafting-forge',
        categories: {
          weaponsmithing: { id: 'weaponsmithing', label: 'Weaponsmithing', icon: 'ri-sword-line', color: '#EF4444', description: 'Forge weapons.', route: '/crafting-skill-trees/weaponsmithing' },
          armorsmithing: { id: 'armorsmithing', label: 'Armorsmithing', icon: 'ri-shield-line', color: '#3B82F6', description: 'Forge armor.', route: '/crafting-skill-trees/armorsmithing' },
          engineering: { id: 'engineering', label: 'Engineering', icon: 'ri-settings-line', color: '#F59E0B', description: 'Build mechanical items.', route: '/crafting-skill-trees/engineering' },
          alchemy: { id: 'alchemy', label: 'Alchemy', icon: 'ri-flask-line', color: '#22C55E', description: 'Transmute materials.', route: '/crafting-skill-trees/alchemy' },
          nanotechnology: { id: 'nanotechnology', label: 'Nanotechnology', icon: 'ri-microscope-line', color: '#A855F7', description: 'Nano-scale construction.', route: '/crafting-skill-trees/nanotechnology' },
        },
      },
      materials: {
        id: 'materials', label: 'Materials', icon: 'ri-stack-line', color: '#6B7280',
        description: 'Raw and refined crafting materials.',
        route: '/crafting-materials',
        categories: {
          raw: { id: 'raw', label: 'Raw Materials', icon: 'ri-archive-line', color: '#6B7280', description: 'Unprocessed resources.' },
          refined: { id: 'refined', label: 'Refined Materials', icon: 'ri-archive-drawer-line', color: '#8B5CF6', description: 'Processed components.' },
          exotic: { id: 'exotic', label: 'Exotic Materials', icon: 'ri-star-line', color: '#EC4899', description: 'Rare and unusual substances.' },
        },
      },
      drones: {
        id: 'drones', label: 'Crafting Drones', icon: 'ri-robot-line', color: '#06B6D4',
        description: 'Automated crafting assistants.',
        route: '/crafting-drones',
        categories: {
          types: { id: 'types', label: 'Drone Types', icon: 'ri-list-check', color: '#06B6D4', description: 'Available drone classes.' },
          management: { id: 'management', label: 'Drone Management', icon: 'ri-settings-line', color: '#06B6D4', description: 'Assign and control drones.' },
        },
      },
      augmentations: {
        id: 'augmentations', label: 'Augmentations', icon: 'ri-bodymon-line', color: '#EC4899',
        description: 'Ship and player augmentation modules.',
        route: '/crafting-augmentations',
        categories: { ship: { id: 'ship', label: 'Ship Augments', icon: 'ri-rocket-line', color: '#F59E0B', description: '' }, personal: { id: 'personal', label: 'Personal Augments', icon: 'ri-user-line', color: '#A855F7', description: '' }, weapon: { id: 'weapon', label: 'Weapon Augments', icon: 'ri-sword-line', color: '#EF4444', description: '' } },
      },
      artifacts: {
        id: 'artifacts', label: 'Artifacts', icon: 'ri-vip-diamond-line', color: '#A855F7',
        description: 'Ancient and legendary artifacts.',
        route: '/crafting-artifacts',
        categories: { ancient: { id: 'ancient', label: 'Ancient Artifacts', icon: 'ri-history-line', color: '#F59E0B', description: '' }, alien: { id: 'alien', label: 'Alien Artifacts', icon: 'ri-alien-line', color: '#22C55E', description: '' }, legendary: { id: 'legendary', label: 'Legendary Artifacts', icon: 'ri-star-line', color: '#EF4444', description: '' } },
      },
      dismantle: {
        id: 'dismantle', label: 'Dismantle', icon: 'ri-hammer-line', color: '#6B7280',
        description: 'Break down items for materials.',
        route: '/crafting-dismantle',
        categories: { ships: { id: 'ships', label: 'Dismantle Ships', icon: 'ri-ship-line', color: '#F59E0B', description: '' }, items: { id: 'items', label: 'Dismantle Items', icon: 'ri-box-line', color: '#6B7280', description: '' }, debris: { id: 'debris', label: 'Process Debris', icon: 'ri-recycle-line', color: '#22C55E', description: '' } },
      },
      rank: {
        id: 'rank', label: 'Crafting Rank', icon: 'ri-medal-line', color: '#F59E0B',
        description: 'Advance your crafting mastery.',
        route: '/crafting-rank',
        categories: { progression: { id: 'progression', label: 'Rank Progression', icon: 'ri-arrow-up-line', color: '#F59E0B', description: '' }, unlocks: { id: 'unlocks', label: 'Rank Unlocks', icon: 'ri-lock-unlock-line', color: '#22C55E', description: '' } },
      },
      recipeUnlocks: {
        id: 'recipeUnlocks', label: 'Recipe Unlocks', icon: 'ri-file-list-3-line', color: '#8B5CF6',
        description: 'Discover and unlock new recipes.',
        route: '/crafting-recipe-unlocks',
        categories: { discovery: { id: 'discovery', label: 'Discovery', icon: 'ri-lightbulb-line', color: '#F59E0B', description: '' }, mastery: { id: 'mastery', label: 'Recipe Mastery', icon: 'ri-star-line', color: '#A855F7', description: '' } },
      },
      masterCrafting: {
        id: 'masterCrafting', label: 'Master Crafting', icon: 'ri-vip-crown-line', color: '#EF4444',
        description: 'Highest-tier crafting with legendary outcomes.',
        route: '/master-crafting',
        categories: { legendary: { id: 'legendary', label: 'Legendary Recipes', icon: 'ri-star-line', color: '#EF4444', description: '' }, mythic: { id: 'mythic', label: 'Mythic Recipes', icon: 'ri-fire-line', color: '#A855F7', description: '' }, cosmic: { id: 'cosmic', label: 'Cosmic Recipes', icon: 'ri-planet-line', color: '#06B6D4', description: '' } },
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  // MODULE 6: ECONOMY & TRADE
  // ═════════════════════════════════════════════════════════════════════
  economy: {
    id: 'economy',
    label: 'Economy & Trade',
    icon: 'ri-coins-line',
    color: '#F59E0B',
    description: 'Marketplace, trading, routes, and financial systems.',
    order: 6,
    subModules: {
      marketplace: {
        id: 'marketplace', label: 'Marketplace', icon: 'ri-shopping-cart-line', color: '#F59E0B',
        description: 'Buy and sell resources with other players.',
        route: '/marketplace',
        categories: { buy: { id: 'buy', label: 'Buy Resources', icon: 'ri-shopping-bag-line', color: '#22C55E', description: '' }, sell: { id: 'sell', label: 'Sell Resources', icon: 'ri-money-dollar-box-line', color: '#EF4444', description: '' }, orders: { id: 'orders', label: 'My Orders', icon: 'ri-file-list-line', color: '#3B82F6', description: '' }, history: { id: 'history', label: 'Trade History', icon: 'ri-history-line', color: '#6B7280', description: '' } },
      },
      resourceTrading: {
        id: 'resourceTrading', label: 'Resource Trading', icon: 'ri-exchange-line', color: '#8B5CF6',
        description: 'Direct peer-to-peer resource exchange.',
        route: '/resource-trading',
        categories: { offers: { id: 'offers', label: 'Trade Offers', icon: 'ri-file-list-line', color: '#8B5CF6', description: '' }, contracts: { id: 'contracts', label: 'Contracts', icon: 'ri-file-text-line', color: '#3B82F6', description: '' } },
      },
      tradeRoutes: {
        id: 'tradeRoutes', label: 'Trade Routes', icon: 'ri-route-line', color: '#06B6D4',
        description: 'Automated resource transport between colonies.',
        route: '/trade-routes',
        categories: { routes: { id: 'routes', label: 'My Routes', icon: 'ri-route-line', color: '#06B6D4', description: '' }, partners: { id: 'partners', label: 'Trade Partners', icon: 'ri-team-line', color: '#22C55E', description: '' }, logs: { id: 'logs', label: 'Shipment Logs', icon: 'ri-file-list-line', color: '#6B7280', description: '' } },
      },
      insurance: {
        id: 'insurance', label: 'Insurance', icon: 'ri-shield-line', color: '#3B82F6',
        description: 'Insure fleets and cargo against loss.',
        route: '/insurance',
        categories: { policies: { id: 'policies', label: 'My Policies', icon: 'ri-file-text-line', color: '#3B82F6', description: '' }, claims: { id: 'claims', label: 'Claims', icon: 'ri-file-warning-line', color: '#F59E0B', description: '' } },
      },
      auction: {
        id: 'auction', label: 'Auction House', icon: 'ri-auction-line', color: '#A855F7',
        description: 'Bid on rare items and resources.',
        route: '/auction',
        categories: { browse: { id: 'browse', label: 'Browse Auctions', icon: 'ri-search-line', color: '#A855F7', description: '' }, bids: { id: 'bids', label: 'My Bids', icon: 'ri-hand-coin-line', color: '#F59E0B', description: '' }, create: { id: 'create', label: 'Create Auction', icon: 'ri-add-circle-line', color: '#22C55E', description: '' } },
      },
      blackMarket: {
        id: 'blackMarket', label: 'Black Market', icon: 'ri-spy-line', color: '#DC2626',
        description: 'Underground trade of contraband goods.',
        route: '/black-market',
        categories: { stock: { id: 'stock', label: 'Current Stock', icon: 'ri-shopping-bag-line', color: '#DC2626', description: '' }, refresh: { id: 'refresh', label: 'Stock Refresh', icon: 'ri-restart-line', color: '#F59E0B', description: '' }, deals: { id: 'deals', label: 'Special Deals', icon: 'ri-fire-line', color: '#EF4444', description: '' } },
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  // MODULE 7: DIPLOMACY & ALLIANCES
  // ═════════════════════════════════════════════════════════════════════
  diplomacy: {
    id: 'diplomacy',
    label: 'Diplomacy & Alliances',
    icon: 'ri-handshake-line',
    color: '#06B6D4',
    description: 'Alliances, diplomacy, espionage, and communication.',
    order: 7,
    subModules: {
      alliance: {
        id: 'alliance', label: 'Alliance', icon: 'ri-team-line', color: '#3B82F6',
        description: 'Your alliance hub.',
        route: '/alliance',
        categories: { overview: { id: 'overview', label: 'Alliance Overview', icon: 'ri-dashboard-line', color: '#3B82F6', description: '' }, members: { id: 'members', label: 'Members', icon: 'ri-group-line', color: '#22C55E', description: '' }, management: { id: 'management', label: 'Management', icon: 'ri-settings-line', color: '#F59E0B', description: '' }, bank: { id: 'bank', label: 'Alliance Bank', icon: 'ri-bank-line', color: '#F59E0B', description: '' } },
      },
      diplomacy: {
        id: 'diplomacy', label: 'Diplomacy', icon: 'ri-handshake-line', color: '#06B6D4',
        description: 'Relations with other empires and alliances.',
        route: '/diplomacy',
        categories: { relations: { id: 'relations', label: 'Foreign Relations', icon: 'ri-earth-line', color: '#06B6D4', description: '' }, treaties: { id: 'treaties', label: 'Treaties & Pacts', icon: 'ri-file-text-line', color: '#3B82F6', description: '' }, wars: { id: 'wars', label: 'Wars', icon: 'ri-sword-line', color: '#EF4444', description: '' }, diplomacyMap: { id: 'diplomacyMap', label: 'Diplomacy Map', icon: 'ri-map-2-line', color: '#8B5CF6', description: '', route: '/diplomacy-map' } },
      },
      espionage: {
        id: 'espionage', label: 'Espionage', icon: 'ri-user-search-line', color: '#6B7280',
        description: 'Gather intelligence on other players.',
        route: '/espionage',
        categories: { probes: { id: 'probes', label: 'Espionage Probes', icon: 'ri-send-plane-line', color: '#6B7280', description: '' }, reports: { id: 'reports', label: 'Espionage Reports', icon: 'ri-file-list-line', color: '#8B5CF6', description: '' }, counter: { id: 'counter', label: 'Counter-Intel', icon: 'ri-shield-line', color: '#3B82F6', description: '' } },
      },
      intel: {
        id: 'intel', label: 'Intel', icon: 'ri-brain-line', color: '#A855F7',
        description: 'Analyzed intelligence and threat assessment.',
        route: '/intel',
        categories: { threat: { id: 'threat', label: 'Threat Assessment', icon: 'ri-alert-line', color: '#EF4444', description: '' }, players: { id: 'players', label: 'Player Intel', icon: 'ri-user-search-line', color: '#8B5CF6', description: '' }, galaxy: { id: 'galaxy', label: 'Galaxy Intel', icon: 'ri-planet-line', color: '#06B6D4', description: '' } },
      },
      communications: {
        id: 'communications', label: 'Communications', icon: 'ri-chat-3-line', color: '#06B6D4',
        description: 'In-game messaging and chat.',
        categories: {
          messages: { id: 'messages', label: 'Messages', icon: 'ri-mail-line', color: '#3B82F6', description: 'Private messaging.', route: '/messages', subCategories: { inbox: { id: 'inbox', label: 'Inbox', description: '' }, sent: { id: 'sent', label: 'Sent', description: '' }, compose: { id: 'compose', label: 'Compose', description: '' } } },
          chat: { id: 'chat', label: 'Chat', icon: 'ri-chat-1-line', color: '#22C55E', description: 'Real-time chat.', route: '/chat', subCategories: { global: { id: 'global', label: 'Global Chat', description: '' }, alliance: { id: 'alliance', label: 'Alliance Chat', description: '' }, private: { id: 'private', label: 'Private Chat', description: '' } } },
        },
      },
      leaderboard: {
        id: 'leaderboard', label: 'Leaderboard', icon: 'ri-trophy-line', color: '#F59E0B',
        description: 'Player rankings and scores.',
        route: '/leaderboard',
        categories: {
          categories: {
            id: 'categories', label: 'Leaderboard Categories', icon: 'ri-list-check', color: '#F59E0B',
            description: 'Competitive rankings.',
            subCategories: {
              economy: { id: 'economy', label: 'Economy Leaders', description: '' },
              military: { id: 'military', label: 'Military Leaders', description: '' },
              research: { id: 'research', label: 'Research Leaders', description: '' },
              overall: { id: 'overall', label: 'Overall Rankings', description: '' },
              universe: { id: 'universe', label: 'Universe Leaderboard', description: '', route: '/universe-leaderboard' },
            },
          },
        },
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  // MODULE 8: GALAXY & EXPLORATION
  // ═════════════════════════════════════════════════════════════════════
  galaxy: {
    id: 'galaxy',
    label: 'Galaxy & Exploration',
    icon: 'ri-planet-line',
    color: '#14B8A6',
    description: 'Explore the galaxy, universe, and beyond.',
    order: 8,
    subModules: {
      galaxyView: {
        id: 'galaxyView', label: 'Galaxy View', icon: 'ri-earth-line', color: '#14B8A6',
        description: 'Solar system browser.',
        route: '/galaxy',
        categories: { browser: { id: 'browser', label: 'System Browser', icon: 'ri-search-line', color: '#14B8A6', description: '' }, scan: { id: 'scan', label: 'Scan System', icon: 'ri-radar-line', color: '#06B6D4', description: '' }, phalanx: { id: 'phalanx', label: 'Sensor Phalanx', icon: 'ri-satellite-line', color: '#8B5CF6', description: '', route: '/sensor-phalanx' } },
      },
      galaxyMap: {
        id: 'galaxyMap', label: 'Galaxy Map', icon: 'ri-map-2-line', color: '#3B82F6',
        description: 'Top-down galaxy map.',
        route: '/galaxy-map',
        categories: { view: { id: 'view', label: 'Map View', icon: 'ri-map-line', color: '#3B82F6', description: '' }, filters: { id: 'filters', label: 'Map Filters', icon: 'ri-filter-line', color: '#6B7280', description: '' }, routes: { id: 'routes', label: 'Travel Routes', icon: 'ri-route-line', color: '#F59E0B', description: '' } },
      },
      universe: {
        id: 'universe', label: 'Universe', icon: 'ri-global-line', color: '#A855F7',
        description: 'Full universe view with all galaxies.',
        route: '/universe',
        categories: {
          standard: { id: 'standard', label: 'Universe Overview', icon: 'ri-global-line', color: '#A855F7', description: '2D universe map.', subCategories: { galaxies: { id: 'galaxies', label: 'Galaxies', description: '' }, systems: { id: 'systems', label: 'Solar Systems', description: '' }, players: { id: 'players', label: 'Players', description: '' } } },
          threeD: {
            id: 'threeD', label: '3D Universe', icon: 'ri-cube-3d-line', color: '#EC4899',
            description: '3D interactive universe with Stellaris-like features.',
            route: '/universe-3d',
            subCategories: {
              systemView: { id: 'systemView', label: 'System View 3D', description: 'Detailed 3D solar system with orbiting planets, asteroid belts, rings.' },
              territoryMesh: { id: 'territoryMesh', label: 'Empire Territories 3D', description: '3D empire territory clouds and border lines.' },
              anomalyNodes: { id: 'anomalyNodes', label: 'Space Anomalies 3D', description: 'Discoverable anomaly markers with investigation UI in 3D space.' },
              expansion: { id: 'expansion', label: 'Territory Expansion', description: 'Influence, outposts, starbases, system claims.' },
              investigations: { id: 'investigations', label: 'Anomaly Investigations', description: 'Branching investigation paths with outcomes.' },
            },
          },
          stellaris: {
            id: 'stellaris', label: 'Stellaris View', icon: 'ri-eye-line', color: '#06B6D4',
            description: 'Strategy map view with anomaly investigation and territory expansion.',
            route: '/stellaris-view',
            subCategories: {
              anomalyInvestigation: { id: 'anomalyInvestigation', label: 'Anomaly Investigation', description: 'Investigate discovered anomalies with branching outcomes.' },
              territoryClaims: { id: 'territoryClaims', label: 'Territory Claims', description: 'Influence system for claiming systems and building starbases.' },
              empireBorders: { id: 'empireBorders', label: 'Empire Borders', description: 'Visual territory borders and contested systems.' },
              firstContact: { id: 'firstContact', label: 'First Contact', description: 'First contact system for discovering alien empires.' },
            },
          },
          cosmic: { id: 'cosmic', label: 'Cosmic Hierarchy', icon: 'ri-organization-chart', color: '#F59E0B', description: 'Universal structure.', route: '/cosmic-hierarchy' },
        },
      },
      sectors: {
        id: 'sectors', label: 'Sectors', icon: 'ri-layout-grid-line', color: '#22C55E',
        description: 'Sector-level territory management.',
        route: '/sectors',
        categories: { overview: { id: 'overview', label: 'Sector Overview', icon: 'ri-dashboard-line', color: '#22C55E', description: '' }, control: { id: 'control', label: 'Sector Control', icon: 'ri-flag-line', color: '#3B82F6', description: '' }, influence: { id: 'influence', label: 'Influence Map', icon: 'ri-heat-map-line', color: '#A855F7', description: '' } },
      },
      stargates: {
        id: 'stargates', label: 'Stargate Network', icon: 'ri-door-open-line', color: '#06B6D4',
        description: 'Instant travel between gates.',
        route: '/stargate-network',
        categories: { network: { id: 'network', label: 'Gate Network', icon: 'ri-share-line', color: '#06B6D4', description: '' }, jumps: { id: 'jumps', label: 'Active Jumps', icon: 'ri-flight-takeoff-line', color: '#F59E0B', description: '' }, build: { id: 'build', label: 'Construct Gate', icon: 'ri-hammer-line', color: '#22C55E', description: '' } },
      },
      exploration: {
        id: 'exploration', label: 'Exploration', icon: 'ri-compass-line', color: '#F59E0B',
        description: 'Discover new worlds and phenomena.',
        categories: {
          seeds: { id: 'seeds', label: 'Seed Discovery', icon: 'ri-seedling-line', color: '#22C55E', description: 'Discover universe seeds.', route: '/seed-discovery' },
          realms: { id: 'realms', label: 'Realms', icon: 'ri-door-open-line', color: '#A855F7', description: 'Alternate dimensional realms.', route: '/realms' },
          races: { id: 'races', label: 'Races Explorer', icon: 'ri-team-line', color: '#3B82F6', description: 'Discoverable alien races.', route: '/races-explorer' },
        },
      },
      universeEvents: {
        id: 'universeEvents', label: 'Universe Events', icon: 'ri-flashlight-line', color: '#EF4444',
        description: 'Galactic-scale events and conflicts.',
        categories: {
          wars: { id: 'wars', label: 'Universe Wars', icon: 'ri-sword-line', color: '#EF4444', description: 'Galactic conflicts.', route: '/universe-war-events' },
          empiresAtWar: { id: 'empiresAtWar', label: 'Empires at War', icon: 'ri-team-line', color: '#DC2626', description: 'Active wars between empires.', route: '/empires-at-war' },
          events: { id: 'events', label: 'Universe Events', icon: 'ri-calendar-line', color: '#F59E0B', description: 'Scheduled cosmic events.', route: '/events' },
        },
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  // MODULE 9: ACTIVITIES & EVENTS
  // ═════════════════════════════════════════════════════════════════════
  activities: {
    id: 'activities',
    label: 'Activities & Events',
    icon: 'ri-calendar-line',
    color: '#F97316',
    description: 'Quests, events, world bosses, and challenges.',
    order: 9,
    subModules: {
      quests: {
        id: 'quests', label: 'Quests', icon: 'ri-flag-line', color: '#F59E0B',
        description: 'Complete quests for rewards.',
        route: '/quests',
        categories: { daily: { id: 'daily', label: 'Daily Quests', icon: 'ri-calendar-line', color: '#3B82F6', description: '' }, weekly: { id: 'weekly', label: 'Weekly Quests', icon: 'ri-calendar-event-line', color: '#A855F7', description: '' }, story: { id: 'story', label: 'Story Quests', icon: 'ri-book-2-line', color: '#F59E0B', description: '' }, achievements: { id: 'achievements', label: 'Achievements', icon: 'ri-trophy-line', color: '#F59E0B', description: '', route: '/achievements' } },
      },
      worldBosses: {
        id: 'worldBosses', label: 'World Bosses', icon: 'ri-skull-line', color: '#EF4444',
        description: 'Fight powerful world bosses.',
        route: '/world-bosses',
        categories: { active: { id: 'active', label: 'Active Bosses', icon: 'ri-fire-line', color: '#EF4444', description: '' }, defeated: { id: 'defeated', label: 'Defeated Bosses', icon: 'ri-check-double-line', color: '#22C55E', description: '' }, rewards: { id: 'rewards', label: 'Boss Rewards', icon: 'ri-gift-line', color: '#F59E0B', description: '' } },
      },
      pirates: {
        id: 'pirates', label: 'Pirates', icon: 'ri-skull-2-line', color: '#DC2626',
        description: 'Defend against and hunt pirates.',
        route: '/pirates',
        categories: { raids: { id: 'raids', label: 'Active Raids', icon: 'ri-alert-line', color: '#EF4444', description: '' }, hunting: { id: 'hunting', label: 'Pirate Hunting', icon: 'ri-crosshair-line', color: '#F59E0B', description: '' }, loot: { id: 'loot', label: 'Pirate Loot', icon: 'ri-money-dollar-box-line', color: '#22C55E', description: '' } },
      },
      bounties: {
        id: 'bounties', label: 'Bounties', icon: 'ri-price-tag-3-line', color: '#F59E0B',
        description: 'Place and claim bounties on players.',
        route: '/bounties',
        categories: { available: { id: 'available', label: 'Available Bounties', icon: 'ri-list-check', color: '#F59E0B', description: '' }, claimed: { id: 'claimed', label: 'My Bounties', icon: 'ri-file-list-line', color: '#3B82F6', description: '' }, place: { id: 'place', label: 'Place Bounty', icon: 'ri-add-circle-line', color: '#EF4444', description: '' } },
      },
      seasonal: {
        id: 'seasonal', label: 'Seasonal Events', icon: 'ri-snowflake-line', color: '#06B6D4',
        description: 'Time-limited seasonal activities.',
        route: '/seasonal-events',
        categories: { current: { id: 'current', label: 'Current Event', icon: 'ri-fire-line', color: '#EF4444', description: '' }, rewards: { id: 'rewards', label: 'Event Rewards', icon: 'ri-gift-line', color: '#F59E0B', description: '' }, history: { id: 'history', label: 'Past Events', icon: 'ri-history-line', color: '#6B7280', description: '' } },
      },
      planetaryEvents: {
        id: 'planetaryEvents', label: 'Planetary Events', icon: 'ri-earth-line', color: '#22C55E',
        description: 'Events occurring on your colonies.',
        route: '/planetary-events',
        categories: { active: { id: 'active', label: 'Active Events', icon: 'ri-fire-line', color: '#EF4444', description: '' }, resolved: { id: 'resolved', label: 'Resolved Events', icon: 'ri-check-line', color: '#22C55E', description: '' } },
      },
      seasonPass: {
        id: 'seasonPass', label: 'Season Pass', icon: 'ri-vip-crown-2-line', color: '#A855F7',
        description: 'Battle pass with tiered rewards.',
        route: '/season-pass',
        categories: { tiers: { id: 'tiers', label: 'Reward Tiers', icon: 'ri-stairs-line', color: '#A855F7', description: '' }, missions: { id: 'missions', label: 'Season Missions', icon: 'ri-flag-line', color: '#F59E0B', description: '' }, premium: { id: 'premium', label: 'Premium Track', icon: 'ri-vip-diamond-line', color: '#F59E0B', description: '' } },
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  // MODULE 10: PLAYER PROGRESSION
  // ═════════════════════════════════════════════════════════════════════
  progression: {
    id: 'progression',
    label: 'Player Progression',
    icon: 'ri-arrow-up-circle-line',
    color: '#A855F7',
    description: 'Player level, rank, titles, and profile.',
    order: 10,
    subModules: {
      profile: {
        id: 'profile', label: 'Profile', icon: 'ri-user-line', color: '#3B82F6',
        description: 'Your player profile and stats.',
        route: '/profile',
        categories: { stats: { id: 'stats', label: 'Player Stats', icon: 'ri-bar-chart-line', color: '#3B82F6', description: '' }, achievements: { id: 'achievements', label: 'Achievements', icon: 'ri-trophy-line', color: '#F59E0B', description: '' }, titles: { id: 'titles', label: 'Titles', icon: 'ri-medal-line', color: '#A855F7', description: '' }, settings: { id: 'settings', label: 'Settings', icon: 'ri-settings-line', color: '#6B7280', description: '' } },
      },
      empire: {
        id: 'empire', label: 'Empire Profile', icon: 'ri-building-2-line', color: '#F59E0B',
        description: 'Your empire overview.',
        route: '/empire',
        categories: { info: { id: 'info', label: 'Empire Info', icon: 'ri-information-line', color: '#F59E0B', description: '' }, stats: { id: 'stats', label: 'Empire Stats', icon: 'ri-bar-chart-line', color: '#3B82F6', description: '' }, history: { id: 'history', label: 'Empire History', icon: 'ri-history-line', color: '#6B7280', description: '' } },
      },
      galacticCalendar: {
        id: 'galacticCalendar', label: 'Galactic Calendar', icon: 'ri-calendar-2-line', color: '#06B6D4',
        description: 'In-game date and time system.',
        route: '/galactic-calendar',
        categories: { calendar: { id: 'calendar', label: 'Calendar View', icon: 'ri-calendar-line', color: '#06B6D4', description: '' }, events: { id: 'events', label: 'Upcoming Events', icon: 'ri-calendar-event-line', color: '#F59E0B', description: '' }, time: { id: 'time', label: 'Game Time', icon: 'ri-time-line', color: '#3B82F6', description: '' } },
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  // MODULE 11: STORE & MICROTRANSACTIONS
  // ═════════════════════════════════════════════════════════════════════
  store: {
    id: 'store',
    label: 'Store',
    icon: 'ri-shopping-cart-line',
    color: '#EC4899',
    description: 'In-game purchases and premium content.',
    order: 11,
    subModules: {
      shop: {
        id: 'shop', label: 'Shop', icon: 'ri-store-line', color: '#EC4899',
        description: 'Browse and purchase items.',
        route: '/store',
        categories: {
          featured: { id: 'featured', label: 'Featured', icon: 'ri-star-line', color: '#F59E0B', description: '' },
          resources: { id: 'resources', label: 'Resource Packs', icon: 'ri-box-line', color: '#F59E0B', description: '' },
          cosmetics: { id: 'cosmetics', label: 'Cosmetics', icon: 'ri-palette-line', color: '#EC4899', description: '' },
          boosts: { id: 'boosts', label: 'Boosts & Bonuses', icon: 'ri-flashlight-line', color: '#06B6D4', description: '' },
          premium: { id: 'premium', label: 'Premium', icon: 'ri-vip-diamond-line', color: '#A855F7', description: '' },
        },
      },
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  // MODULE 12: ADMINISTRATION
  // ═════════════════════════════════════════════════════════════════════
  admin: {
    id: 'admin',
    label: 'Administration',
    icon: 'ri-shield-user-line',
    color: '#6B7280',
    description: 'Admin panel and game management tools.',
    order: 12,
    subModules: {
      dashboard: {
        id: 'dashboard', label: 'Admin Dashboard', icon: 'ri-dashboard-line', color: '#6B7280',
        description: 'Game administration panel.',
        route: '/admin-dashboard',
        categories: {
          overview: { id: 'overview', label: 'Server Overview', icon: 'ri-dashboard-line', color: '#6B7280', description: '' },
          players: { id: 'players', label: 'Player Management', icon: 'ri-user-settings-line', color: '#3B82F6', description: '' },
          economy: { id: 'economy', label: 'Economy Controls', icon: 'ri-coins-line', color: '#F59E0B', description: '' },
          events: { id: 'events', label: 'Event Management', icon: 'ri-calendar-line', color: '#22C55E', description: '' },
          verification: { id: 'verification', label: 'Verification', icon: 'ri-verified-badge-line', color: '#8B5CF6', description: '' },
          logs: { id: 'logs', label: 'Audit Logs', icon: 'ri-file-list-line', color: '#6B7280', description: '' },
        },
      },
    },
  },
};

// ── Helper: flatten module hierarchy to a list of all pages ────────────────
export interface FlatPageEntry {
  moduleId: string;
  moduleLabel: string;
  subModuleId: string;
  subModuleLabel: string;
  route: string;
}

export function flattenModulePages(): FlatPageEntry[] {
  const pages: FlatPageEntry[] = [];
  for (const mod of Object.values(GAME_MODULES)) {
    if (!mod.subModules) continue;
    for (const sub of Object.values(mod.subModules)) {
      if (sub.route) {
        pages.push({
          moduleId: mod.id,
          moduleLabel: mod.label,
          subModuleId: sub.id,
          subModuleLabel: sub.label,
          route: sub.route,
        });
      }
      if (!sub.categories) continue;
      for (const cat of Object.values(sub.categories)) {
        if (cat.route) {
          pages.push({
            moduleId: mod.id,
            moduleLabel: mod.label,
            subModuleId: sub.id,
            subModuleLabel: sub.label,
            route: cat.route,
          });
        }
        if (!cat.subCategories) continue;
        for (const sc of Object.values(cat.subCategories)) {
          if (sc.route) {
            pages.push({
              moduleId: mod.id,
              moduleLabel: mod.label,
              subModuleId: sub.id,
              subModuleLabel: sub.label,
              route: sc.route,
            });
          }
          if (!sc.classes) continue;
          for (const cls of Object.values(sc.classes)) {
            if (!cls.subClasses) continue;
            for (const scls of Object.values(cls.subClasses)) {
              if (!scls.types) continue;
              for (const t of Object.values(scls.types)) {
                if (!t.subTypes) continue;
                for (const st of Object.values(t.subTypes)) {
                  if (!st.systems) continue;
                  for (const sys of Object.values(st.systems)) {
                    if (!sys.subsystems) continue;
                    for (const ssys of Object.values(sys.subsystems)) {
                      if (!ssys.buttons) continue;
                      for (const btn of Object.values(ssys.buttons)) {
                        if (btn.action?.startsWith('/')) {
                          pages.push({
                            moduleId: mod.id,
                            moduleLabel: mod.label,
                            subModuleId: sub.id,
                            subModuleLabel: sub.label,
                            route: btn.action,
                          });
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return pages;
}

// ── Helper: get all module-level summary stats ─────────────────────────────
export function getModuleStats(): { moduleId: string; pageCount: number }[] {
  const pages = flattenModulePages();
  const counts: Record<string, number> = {};
  for (const p of pages) {
    counts[p.moduleId] = (counts[p.moduleId] || 0) + 1;
  }
  return Object.entries(counts).map(([moduleId, pageCount]) => ({ moduleId, pageCount }));
}

// ── Helper: find a specific entity by its id path ──────────────────────────
export function findEntity(
  moduleId: string,
  subModuleId: string,
  categoryId?: string,
  subCategoryId?: string,
): CategoryDef | SubCategoryDef | undefined {
  const mod = GAME_MODULES[moduleId];
  if (!mod?.subModules) return undefined;
  const sub = mod.subModules[subModuleId];
  if (!sub) return undefined;
  if (!categoryId) return sub;
  const cat = sub.categories?.[categoryId];
  if (!cat) return sub;
  if (!subCategoryId) return cat;
  const sc = cat.subCategories?.[subCategoryId];
  if (!sc) return cat;
  return sc;
}
