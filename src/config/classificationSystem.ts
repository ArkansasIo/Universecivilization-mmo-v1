// ════════════════════════════════════════════════════════════════════
// MASTER CLASSIFICATION TAXONOMY — 90+ Categories, Sub-Categories,
// Classes, Sub-Classes, Types, Sub-Types
//
// Covers: Starships | Motherships | Military Units | Civilian Units
//         | Government Units | Aggregations
// ════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────
// SECTION 1: SHIP CLASSIFICATION (20 classes, each with sub-classes)
// ─────────────────────────────────────────────────────────────────────

export const SHIP_CLASSES = {
  Fighter: 'Fighter',
  Interceptor: 'Interceptor',
  Bomber: 'Bomber',
  Corvette: 'Corvette',
  Frigate: 'Frigate',
  Destroyer: 'Destroyer',
  Cruiser: 'Cruiser',
  Battlecruiser: 'Battlecruiser',
  Battleship: 'Battleship',
  Dreadnought: 'Dreadnought',
  Carrier: 'Carrier',
  Titan: 'Titan',
  Mothership: 'Mothership',
  Flagship: 'Flagship',
  Juggernaut: 'Juggernaut',
  Leviathan: 'Leviathan',
  Sentinel: 'Sentinel',
  Arbiter: 'Arbiter',
  Behemoth: 'Behemoth',
  Colossus: 'Colossus',
} as const;

export type ShipClass = (typeof SHIP_CLASSES)[keyof typeof SHIP_CLASSES];

export const SHIP_SUB_CLASSES: Record<ShipClass, string[]> = {
  Fighter: ['Light-Fighter', 'Heavy-Fighter', 'Stealth-Fighter', 'Superiority-Fighter', 'Escort-Fighter'],
  Interceptor: ['Fast-Interceptor', 'Pursuit-Interceptor', 'Cloaked-Interceptor', 'Point-Defense-Interceptor'],
  Bomber: ['Torpedo-Bomber', 'Plasma-Bomber', 'Kinetic-Bomber', 'Fusion-Bomber', 'Drone-Bomber'],
  Corvette: ['Patrol-Corvette', 'Missile-Corvette', 'Assault-Corvette', 'Stealth-Corvette', 'Support-Corvette'],
  Frigate: ['Strike-Frigate', 'Shield-Frigate', 'Recon-Frigate', 'Artillery-Frigate', 'Troop-Frigate'],
  Destroyer: ['Heavy-Destroyer', 'Siege-Destroyer', 'Command-Destroyer', 'Anti-Fighter-Destroyer', 'Phase-Destroyer'],
  Cruiser: ['Battle-Cruiser', 'Light-Cruiser', 'Heavy-Cruiser', 'Command-Cruiser', 'Stealth-Cruiser'],
  Battlecruiser: ['Strike-Battlecruiser', 'Fleet-Battlecruiser', 'Siege-Battlecruiser', 'Carrier-Battlecruiser', 'Flagship-Battlecruiser'],
  Battleship: ['Dreadnought-Battleship', 'Command-Battleship', 'Siege-Battleship', 'Carrier-Battleship', 'Fortress-Battleship'],
  Dreadnought: ['Omega-Dreadnought', 'Titan-Dreadnought', 'Void-Dreadnought', 'Eternal-Dreadnought', 'Annihilator-Dreadnought'],
  Carrier: ['Fleet-Carrier', 'Super-Carrier', 'Command-Carrier', 'Assault-Carrier', 'Support-Carrier'],
  Titan: ['Celestial-Titan', 'Void-Titan', 'World-Titan', 'War-Titan', 'Genesis-Titan'],
  Mothership: ['Exodus-Mothership', 'Ark-Mothership', 'War-Mothership', 'Colony-Mothership', 'Nexus-Mothership'],
  Flagship: ['Eternal-Flagship', 'Imperial-Flagship', 'Supreme-Flagship', 'Unified-Flagship', 'Legend-Flagship'],
  Juggernaut: ['War-Juggernaut', 'Mobile-Fortress', 'Planet-Breaker', 'Stellar-Juggernaut', 'Unstoppable-Force'],
  Leviathan: ['Deep-Space-Leviathan', 'Void-Leviathan', 'Cosmic-Leviathan', 'Abyssal-Leviathan', 'Omega-Leviathan'],
  Sentinel: ['Guardian-Sentinel', 'Watchtower-Sentinel', 'Defender-Sentinel', 'Shield-Sentinel', 'Watcher-Sentinel'],
  Arbiter: ['Peace-Arbiter', 'Justice-Arbiter', 'Balance-Arbiter', 'Law-Arbiter', 'Harmony-Arbiter'],
  Behemoth: ['War-Behemoth', 'Terraforming-Behemoth', 'Construction-Behemoth', 'Harvest-Behemoth', 'Doomsday-Behemoth'],
  Colossus: ['Planet-Cracker-Colossus', 'Star-Eater-Colossus', 'Reality-Breaker-Colossus', 'Galaxy-Splitter-Colossus', 'Universe-Ender-Colossus'],
};

export const SHIP_CATEGORIES = {
  Light: 'Light',
  Medium: 'Medium',
  Heavy: 'Heavy',
  SuperHeavy: 'Super Heavy',
  Capital: 'Capital',
  SuperCapital: 'Super Capital',
  Legendary: 'Legendary',
  Escort: 'Escort',
  Assault: 'Assault',
  Support: 'Support',
  Siege: 'Siege',
  Carrier: 'Carrier',
  Command: 'Command',
  Stealth: 'Stealth',
  Exploration: 'Exploration',
  Utility: 'Utility',
  Flagship: 'Flagship',
  Juggernaut: 'Juggernaut',
  Leviathan: 'Leviathan',
  Colossal: 'Colossal',
} as const;

export type ShipCategory = (typeof SHIP_CATEGORIES)[keyof typeof SHIP_CATEGORIES];

export const SHIP_SUB_CATEGORIES: Record<ShipCategory, string[]> = {
  Light: ['Ultra-Light', 'Scout-Class', 'Patrol-Class', 'Fast-Attack', 'Interception'],
  Medium: ['Line-Class', 'Standard-Class', 'Balanced-Class', 'Multi-Role', 'Modular'],
  Heavy: ['Brawler-Class', 'Tank-Class', 'Line-Breaker', 'Fortress-Class', 'Bombardment'],
  'Super Heavy': ['Battleship-Class', 'Dread-Class', 'Titan-Class', 'Behemoth-Class', 'Colossus-Class'],
  Capital: ['Fleet-Capital', 'System-Capital', 'Sector-Capital', 'Core-Capital', 'War-Capital'],
  'Super Capital': ['Galactic-Capital', 'Empire-Capital', 'Dominion-Capital', 'Nexus-Capital', 'Supreme-Capital'],
  Legendary: ['Mythic-Class', 'Transcendent-Class', 'Eternal-Class', 'Primal-Class', 'Divine-Class'],
  Escort: ['Screening', 'Protection', 'Fleet-Escort', 'Convoy-Escort', 'Vanguard'],
  Assault: ['Strike-Force', 'Rapid-Assault', 'Planetary-Assault', 'Orbital-Strike', 'Shock-Assault'],
  Support: ['Logistics', 'Repair', 'Supply', 'Medical', 'Reinforcement'],
  Siege: ['Bombardment', 'Fortress-Breaker', 'Orbital-Siege', 'Planet-Cracker', 'System-Killer'],
  Carrier: ['Fighter-Carrier', 'Troop-Carrier', 'Super-Carrier', 'Drone-Carrier', 'Swarm-Carrier'],
  Command: ['Tactical-Command', 'Strategic-Command', 'Fleet-Command', 'Battle-Command', 'Supreme-Command'],
  Stealth: ['Cloaked', 'Shadow', 'Phase-Shifted', 'Covert', 'Ghost-Class'],
  Exploration: ['Deep-Space', 'Long-Range', 'Survey', 'Colony-Ship', 'Science-Vessel'],
  Utility: ['Mining', 'Construction', 'Salvage', 'Tug', 'Freighter'],
  Flagship: ['Fleet-Flagship', 'Empire-Flagship', 'Supreme-Flagship', 'War-Flagship', 'Unity-Flagship'],
  Juggernaut: ['War-Machine', 'Mobile-Base', 'Siege-Platform', 'Fortress-Ship', 'World-Destroyer'],
  Leviathan: ['Deep-Void', 'Cosmic-Entity', 'Abyssal-Walker', 'Void-Spawn', 'Universe-Traveler'],
  Colossal: ['Star-Forged', 'Galaxy-Class', 'Universe-Class', 'Infinity-Class', 'Omni-Class'],
};

export const SHIP_TYPES = {
  Combat: 'Combat',
  Support: 'Support',
  Stealth: 'Stealth',
  Siege: 'Siege',
  Exploration: 'Exploration',
  Mining: 'Mining',
  Transport: 'Transport',
  Hybrid: 'Hybrid',
  Carrier: 'Carrier',
  Command: 'Command',
  Scientific: 'Scientific',
  Colonization: 'Colonization',
  Construction: 'Construction',
  Salvage: 'Salvage',
  Logistics: 'Logistics',
  Medical: 'Medical',
  Communications: 'Communications',
  ElectronicWar: 'Electronic Warfare',
  Diplomatic: 'Diplomatic',
  Refugee: 'Refugee',
} as const;

export type ShipType = (typeof SHIP_TYPES)[keyof typeof SHIP_TYPES];

export const SHIP_SUB_TYPES: Record<ShipType, string[]> = {
  Combat: ['Direct-Fire', 'Missile-Boat', 'Beam-Array', 'Projectile', 'Point-Blank', 'Long-Range', 'Alpha-Strike', 'Sustained-DPS'],
  Support: ['Repair-Ship', 'Shield-Booster', 'Supply-Vessel', 'Ammunition-Tender', 'Fuel-Tanker', 'Maintenance-Drone', 'Rescue-Vessel'],
  Stealth: ['Cloak-Field', 'Phase-Shifter', 'Shadow-Meld', 'Active-Camo', 'Signature-Nullifier', 'Sensor-Dampener'],
  Siege: ['Orbital-Bombardment', 'Planet-Cracker', 'Fortress-Destroyer', 'Structure-Killer', 'Area-Denial', 'Shield-Penetrator'],
  Exploration: ['Deep-Survey', 'Wormhole-Explorer', 'Nebula-Penetrator', 'Anomaly-Investigator', 'Ancient-Relic-Seeker', 'Void-Cartographer'],
  Mining: ['Asteroid-Miner', 'Planet-Stripper', 'Gas-Collector', 'Deep-Core-Miner', 'Ice-Miner', 'Crystal-Harvester', 'Nano-Collector'],
  Transport: ['Cargo-Freighter', 'Troop-Transport', 'Colony-Transport', 'Resource-Hauler', 'Passenger-Liner', 'Priority-Courier', 'Diplomatic-Courier'],
  Hybrid: ['Combat-Support', 'Assault-Carrier', 'Recon-Strike', 'Battle-Utility', 'Multi-Mission', 'Modular-System', 'Transform-Class'],
  Carrier: ['Fighter-Deployment', 'Bomber-Wing', 'Drone-Swarm', 'Drop-Ship', 'Shuttle-Bay', 'Elite-Squadron', 'Interceptor-Landing'],
  Command: ['Tactical-Center', 'Fleet-Coordination', 'Strategic-HQ', 'Battle-Net', 'Command-Node', 'Communications-Relay', 'Quantum-Link'],
  Scientific: ['Research-Lab', 'Xeno-Study', 'Archaeology', 'Quantum-Research', 'Biology-Study', 'Physics-Platform', 'Observation-Post'],
  Colonization: ['Terraforming', 'Habitat-Constructor', 'Atmosphere-Processor', 'Ecosystem-Engineer', 'Colony-Founder', 'Arc-Ship', 'Sleep-Ship'],
  Construction: ['Space-Dock', 'Orbital-Constructor', 'Platform-Builder', 'Nanite-Assembler', 'Structural-Framer', 'Station-Builder', 'Ring-Constructor'],
  Salvage: ['Wreck-Recovery', 'Battlefield-Clearer', 'Debris-Collector', 'Component-Salvager', 'Recycler', 'Scrap-Processor', 'Material-Extractor'],
  Logistics: ['Supply-Chain', 'Fleet-Resupply', 'Ammunition-Depot', 'Fuel-Depot', 'Forward-Base', 'Mobile-Repair', 'Dry-Dock'],
  Medical: ['Hospital-Ship', 'Bio-Lab', 'Quarantine-Vessel', 'Trauma-Center', 'Clone-Facility', 'Gene-Therapy', 'Psy-Ward'],
  Communications: ['Quantum-Relay', 'Subspace-Beacon', 'Data-Node', 'Encryption-Hub', 'Holographic-Projector', 'Fleet-Net', 'Wormhole-Stabilizer'],
  'Electronic Warfare': ['Jammer-Ship', 'Decoy-Vessel', 'Sensor-Spoofer', 'Cyber-Attack', 'Signal-Eavesdropper', 'Frequency-Scrambler', 'Hologram-Projector'],
  Diplomatic: ['Peace-Negotiator', 'Treaty-Ship', 'Ambassadorial-Vessel', 'Cultural-Exchange', 'Trade-Envoy', 'Mediation-Craft', 'Ceasefire-Platform'],
  Refugee: ['Escape-Transport', 'Shelter-Ship', 'Evacuation-Vessel', 'Migration-Fleet', 'Sanctuary-Ship', 'Safe-Haven', 'Relief-Carrier'],
};

export const SHIP_ROLES = {
  Vanguard: 'Vanguard',
  Line: 'Line',
  Flanker: 'Flanker',
  Sniper: 'Sniper',
  Brawler: 'Brawler',
  Tank: 'Tank',
  Healer: 'Healer',
  Buffer: 'Buffer',
  Debuffer: 'Debuffer',
  Scout: 'Scout',
  Interceptor: 'Interceptor',
  Defender: 'Defender',
  Controller: 'Controller',
  Striker: 'Striker',
  Artillery: 'Artillery',
  Disruptor: 'Disruptor',
  Assassin: 'Assassin',
  Commander: 'Commander',
  Supportive: 'Supportive',
  Hunter: 'Hunter',
} as const;

export type ShipRole = (typeof SHIP_ROLES)[keyof typeof SHIP_ROLES];

export const SHIP_SUB_ROLES: Record<ShipRole, string[]> = {
  Vanguard: ['Point-Breaker', 'First-Strike', 'Shock-Trooper', 'Formation-Leader', 'Spearhead'],
  Line: ['Battle-Line', 'Wall-Formation', 'Defensive-Line', 'Screening', 'Phalanx'],
  Flanker: ['Side-Attack', 'Pincer-Maneuver', 'Outflank', 'Harassment', 'Rear-Charge'],
  Sniper: ['Precision-Shot', 'Long-Strike', 'Critical-Focus', 'Pick-Off', 'Focused-Fire'],
  Brawler: ['Close-Quarters', 'Melee-Range', 'Knife-Fight', 'Ramming', 'Boarding'],
  Tank: ['Damage-Sponge', 'Shield-Wall', 'Armor-Plated', 'Fortress', 'Reinforced'],
  Healer: ['Repair-Aura', 'Nanite-Cloud', 'Emergency-Fix', 'Shield-Regen', 'Structure-Repair'],
  Buffer: ['Damage-Boost', 'Speed-Boost', 'Shield-Boost', 'Morale-Boost', 'Command-Aura'],
  Debuffer: ['Weaken', 'Slow', 'Blind', 'Break-Armor', 'Disrupt-Shields'],
  Scout: ['Recon', 'Spotter', 'Pathfinder', 'Tracker', 'Surveyor'],
  Interceptor: ['Pursuer', 'Chaser', 'Blitzer', 'Quick-Strike', 'Rapid-Engage'],
  Defender: ['Guardian', 'Protector', 'Bastion', 'Shield-Bearer', 'Aegis-Carrier'],
  Controller: ['Area-Denial', 'Zone-Control', 'Crowd-Control', 'Gravity-Well', 'Stasis-Field'],
  Striker: ['Alpha-Striker', 'Burst-Damage', 'Assault-Leader', 'Shock-and-Awe', 'Overwhelming-Force'],
  Artillery: ['Siege-Mode', 'Orbital-Strike', 'Barrage', 'Salvo-Launcher', 'Heavy-Bombardment'],
  Disruptor: ['EMP-Burst', 'System-Shutdown', 'Engine-Killer', 'Weapon-Jammer', 'Sensor-Blind'],
  Assassin: ['Stealth-Kill', 'One-Shot', 'Backstab', 'Ambush', 'Covert-Strike'],
  Commander: ['Fleet-Leader', 'Squadron-Captain', 'Task-Force-Commander', 'Sector-Admiral', 'Supreme-Commander'],
  Supportive: ['Logistics-Chief', 'Supply-Master', 'Repair-Coordinator', 'Reinforcement-Call', 'Morale-Officer'],
  Hunter: ['Bounty-Hunter', 'Pirate-Catcher', 'Monster-Slayer', 'Warband-Chaser', 'Nemesis-Tracker'],
};

// ─────────────────────────────────────────────────────────────────────
// SECTION 2: MOTHERSHIP CLASSIFICATION (12 classes, each with sub-classes)
// ─────────────────────────────────────────────────────────────────────

export const MOTHERSHIP_CLASSES = {
  Ark: 'Ark',
  Carrier: 'Carrier',
  Command: 'Command',
  Dreadnought: 'Dreadnought',
  Eternal: 'Eternal',
  Forge: 'Forge',
  Genesis: 'Genesis',
  Leviathan: 'Leviathan',
  Nexus: 'Nexus',
  Sanctuary: 'Sanctuary',
  Titan: 'Titan',
  Worldship: 'Worldship',
} as const;

export type MothershipClass = (typeof MOTHERSHIP_CLASSES)[keyof typeof MOTHERSHIP_CLASSES];

export const MOTHERSHIP_SUB_CLASSES: Record<MothershipClass, string[]> = {
  Ark: ['Genetic-Ark', 'Data-Ark', 'Seed-Ark', 'Exodus-Ark', 'Library-Ark'],
  Carrier: ['Super-Carrier', 'Fleet-Carrier', 'Swarm-Carrier', 'Troop-Carrier', 'Drone-Carrier'],
  Command: ['Fleet-Command', 'War-Command', 'Nexus-Command', 'Supreme-Command', 'Battle-Command'],
  Dreadnought: ['War-Dreadnought', 'Siege-Dreadnought', 'Void-Dreadnought', 'Annihilator-Dreadnought', 'Omega-Dreadnought'],
  Eternal: ['Time-Eternal', 'Space-Eternal', 'Reality-Eternal', 'Immortal-Eternal', 'Infinite-Eternal'],
  Forge: ['Industrial-Forge', 'Nano-Forge', 'Star-Forge', 'Mega-Forge', 'Replicator-Forge'],
  Genesis: ['Life-Genesis', 'World-Genesis', 'Star-Genesis', 'Galaxy-Genesis', 'Universe-Genesis'],
  Leviathan: ['Deep-Void-Leviathan', 'Cosmic-Leviathan', 'Abyssal-Leviathan', 'Omega-Leviathan', 'Void-Walker'],
  Nexus: ['Trade-Nexus', 'Data-Nexus', 'Warp-Nexus', 'Resource-Nexus', 'Knowledge-Nexus'],
  Sanctuary: ['Refuge-Sanctuary', 'Nature-Sanctuary', 'Peace-Sanctuary', 'Knowledge-Sanctuary', 'Life-Sanctuary'],
  Titan: ['War-Titan', 'World-Titan', 'Celestial-Titan', 'Void-Titan', 'Primal-Titan'],
  Worldship: ['Mobile-World', 'Wandering-World', 'Garden-World', 'Factory-World', 'Fortress-World'],
};

export const MOTHERSHIP_CATEGORIES = {
  Civilian: 'Civilian',
  Combat: 'Combat',
  Command: 'Command',
  Economic: 'Economic',
  Exploration: 'Exploration',
  Hybrid: 'Hybrid',
  Industrial: 'Industrial',
  Scientific: 'Scientific',
  Sovereign: 'Sovereign',
  Support: 'Support',
  Transcendent: 'Transcendent',
  Ultimate: 'Ultimate',
} as const;

export type MothershipCategory = (typeof MOTHERSHIP_CATEGORIES)[keyof typeof MOTHERSHIP_CATEGORIES];

export const MOTHERSHIP_SUB_CATEGORIES: Record<MothershipCategory, string[]> = {
  Civilian: ['Colony', 'Refugee', 'Migration', 'Leisure', 'Educational'],
  Combat: ['Strike-Wing', 'Siege-Force', 'Battle-Station', 'War-Fleet', 'Dominator'],
  Command: ['Fleet-HQ', 'Sector-Command', 'Battle-Center', 'Strategic-Core', 'War-Council'],
  Economic: ['Trade-Center', 'Banking-Hub', 'Resource-Hub', 'Manufacturing-Core', 'Market-Hub'],
  Exploration: ['Deep-Survey', 'Voyager', 'Pathfinder', 'Pioneer', 'Expedition'],
  Hybrid: ['Multi-Role', 'Adaptive', 'Modular', 'Transformative', 'Omega-Class'],
  Industrial: ['Mega-Factory', 'Assembly-Line', 'Refinery-Complex', 'Construction-Yard', 'Processing-Center'],
  Scientific: ['Research-Core', 'Xeno-Studies', 'Quantum-Lab', 'Bio-Dome', 'Think-Tank'],
  Sovereign: ['Capital-Class', 'Royal-Sovereign', 'Imperial-Glory', 'Supreme-Dominion', 'Eternal-Throne'],
  Support: ['Logistics-Base', 'Medical-Center', 'Repair-Dock', 'Supply-Depot', 'Reinforcement-Hub'],
  Transcendent: ['Ascended', 'Evolved', 'Awakened', 'Enlightened', 'Divine-Class'],
  Ultimate: ['Infinity-Class', 'Omni-Class', 'Absolute-Class', 'Primordial-Class', 'God-Class'],
};

export const MOTHERSHIP_TYPES = {
  ArkShip: 'Ark Ship',
  BattlePlatform: 'Battle Platform',
  CityShip: 'City Ship',
  ColonyVessel: 'Colony Vessel',
  CommandCenter: 'Command Center',
  Constructor: 'Constructor',
  DeepSpaceHabitat: 'Deep Space Habitat',
  FactoryShip: 'Factory Ship',
  Flagship: 'Flagship',
  ForgeShip: 'Forge Ship',
  GenerationShip: 'Generation Ship',
  MobileBase: 'Mobile Base',
  NexusHub: 'Nexus Hub',
  ResearchPlatform: 'Research Platform',
  SiegePlatform: 'Siege Platform',
  SuperCarrier: 'Super Carrier',
  Terraformer: 'Terraformer',
  VoidCitadel: 'Void Citadel',
  WarWorld: 'War World',
  WorldCracker: 'World Cracker',
} as const;

export type MothershipType = (typeof MOTHERSHIP_TYPES)[keyof typeof MOTHERSHIP_TYPES];

export const MOTHERSHIP_SUB_TYPES: Record<MothershipType, string[]> = {
  'Ark Ship': ['Genetic-Ark', 'Data-Ark', 'Exodus-Ark', 'Seed-Ark', 'Library-Ark'],
  'Battle Platform': ['Orbital-Fortress', 'War-Moon', 'Siege-Platform', 'Fleet-Anchor', 'System-Dominator'],
  'City Ship': ['Floating-City', 'Mobile-Metropolis', 'Orbital-City', 'Arcologies', 'Hive-City'],
  'Colony Vessel': ['Sleep-Ship', 'Cryo-Vessel', 'Colony-Founder', 'Settlement-Ship', 'Migration-Fleet'],
  'Command Center': ['Fleet-Core', 'War-Room', 'Battle-Nexus', 'Strategic-Center', 'Supreme-HQ'],
  Constructor: ['Mega-Constructor', 'Station-Builder', 'Ring-Forger', 'World-Architect', 'Dyson-Assembler'],
  'Deep Space Habitat': ['Void-Station', 'Nebula-Haven', 'Dark-Space-Colony', 'Interstellar-Refuge', 'Deep-Void-Citadel'],
  'Factory Ship': ['Assembly-World', 'Production-Line', 'Nano-Factory', 'Mass-Constructor', 'Replicator-Ship'],
  Flagship: ['Galactic-Flagship', 'Imperial-Flagship', 'Sector-Flagship', 'War-Flagship', 'Unity-Flagship'],
  'Forge Ship': ['Star-Forge', 'Planet-Forge', 'Nano-Forge', 'Quantum-Forge', 'Matter-Forge'],
  'Generation Ship': ['World-Ship', 'System-Voyager', 'Galaxy-Crosser', 'Ark-of-Civilization', 'Seed-of-Life'],
  'Mobile Base': ['Forward-Operations', 'Fleet-Anchor', 'Supply-Hub', 'Mobile-Dock', 'Field-HQ'],
  'Nexus Hub': ['Trade-Nexus', 'Data-Nexus', 'Warp-Nexus', 'Resource-Nexus', 'Knowledge-Nexus'],
  'Research Platform': ['Science-Core', 'Quantum-Lab', 'Xeno-Study', 'Observation-Array', 'Think-Center'],
  'Siege Platform': ['System-Killer', 'Planet-Cracker', 'Star-Eater', 'Fortress-Breaker', 'Galaxy-Destroyer'],
  'Super Carrier': ['Fleet-Carrier', 'Swarm-Carrier', 'Drone-Carrier', 'Troop-Carrier', 'Fighter-Depot'],
  Terraformer: ['Atmosphere-Forge', 'Ocean-Shaper', 'Climate-Engine', 'Ecosystem-Crafter', 'Biome-Constructor'],
  'Void Citadel': ['Dark-Fortress', 'Shadow-Citadel', 'Void-Keep', 'Abyssal-Fortress', 'Umbral-Citadel'],
  'War World': ['Battle-Moon', 'War-Planetoid', 'Combat-World', 'Siege-World', 'Fleet-World'],
  'World Cracker': ['Planet-Splitter', 'Core-Destroyer', 'Crust-Stripper', 'Mantle-Breacher', 'World-Ender'],
};

// ─────────────────────────────────────────────────────────────────────
// SECTION 3: MILITARY UNIT CLASSIFICATION (20 classes, each with sub-classes)
// ─────────────────────────────────────────────────────────────────────

export const MILITARY_UNIT_CLASSES = {
  Conscript: 'Conscript',
  Soldier: 'Soldier',
  Veteran: 'Veteran',
  Elite: 'Elite',
  Commando: 'Commando',
  Officer: 'Officer',
  Commander: 'Commander',
  Hero: 'Hero',
  PsiOperative: 'Psi-Operative',
  Marine: 'Marine',
  Pilot: 'Pilot',
  Gunner: 'Gunner',
  Engineer: 'Engineer',
  Medic: 'Medic',
  Scout: 'Scout',
  Sniper: 'Sniper',
  Heavy: 'Heavy',
  CyberKnight: 'Cyber-Knight',
  TitanGuardian: 'Titan-Guardian',
  Warden: 'Warden',
} as const;

export type MilitaryUnitClass = (typeof MILITARY_UNIT_CLASSES)[keyof typeof MILITARY_UNIT_CLASSES];

export const MILITARY_SUB_CLASSES: Record<MilitaryUnitClass, string[]> = {
  Conscript: ['Raw-Conscript', 'Press-Ganged', 'Volunteer', 'Draftee', 'Garrison-Troop'],
  Soldier: ['Infantry', 'Rifleman', 'Assault-Trooper', 'Grenadier', 'Automatic-Rifleman'],
  Veteran: ['Battle-Hardened', 'War-Worn', 'Campaign-Veteran', 'Decorated-Veteran', 'Seasoned-Trooper'],
  Elite: ['Special-Forces', 'Shock-Trooper', 'Guardian', 'Paladin', 'Storm-Trooper'],
  Commando: ['Saboteur', 'Infiltrator', 'Ranger', 'Sniper-Commando', 'Breacher'],
  Officer: ['Lieutenant', 'Captain', 'Major', 'Colonel', 'Brigadier'],
  Commander: ['General', 'Admiral', 'Field-Marshal', 'Supreme-Commander', 'Grand-Strategist'],
  Hero: ['Legendary-Hero', 'Champion', 'War-Hero', 'Immortal', 'Demigod'],
  'Psi-Operative': ['Telepath', 'Telekine', 'Precog', 'Empath', 'Mind-Controller'],
  Marine: ['Boarding-Marine', 'Ship-Trooper', 'Space-Marine', 'Assault-Marine', 'Void-Marine'],
  Pilot: ['Fighter-Pilot', 'Bomber-Pilot', 'Dropship-Pilot', 'Recon-Pilot', 'Ace-Pilot'],
  Gunner: ['Turret-Operator', 'Missile-Specialist', 'Beam-Gunner', 'Point-Defense-Gunner', 'Artillery-Gunner'],
  Engineer: ['Combat-Engineer', 'Field-Engineer', 'Demolition-Expert', 'Fortification-Builder', 'Repair-Specialist'],
  Medic: ['Combat-Medic', 'Field-Doctor', 'Trauma-Specialist', 'Bio-Stabilizer', 'Nanite-Healer'],
  Scout: ['Pathfinder', 'Recon-Specialist', 'Spotter', 'Tracker', 'Forward-Observer'],
  Sniper: ['Marksman', 'Sharpshooter', 'Long-Rifle', 'Precision-Expert', 'Ghost-Sniper'],
  Heavy: ['Machine-Gunner', 'Rocket-Trooper', 'Support-Gunner', 'Heavy-Weapons-Specialist', 'Juggernaut'],
  'Cyber-Knight': ['Augmented-Warrior', 'Cyborg-Soldier', 'Neural-Knight', 'Tech-Priest', 'Warmind'],
  'Titan-Guardian': ['World-Guardian', 'Star-Titan', 'Reality-Warden', 'Cosmic-Sentinel', 'Immortal-Protector'],
  Warden: ['Sector-Warden', 'Border-Guardian', 'Perimeter-Defender', 'Zone-Protector', 'March-Warden'],
};

export const MILITARY_UNIT_CATEGORIES = {
  Infantry: 'Infantry',
  Armor: 'Armor',
  Artillery: 'Artillery',
  Air: 'Air',
  Naval: 'Naval',
  Space: 'Space',
  SpecialOps: 'Special Ops',
  Support: 'Support',
  Cyber: 'Cyber',
  Psi: 'Psi',
  Mechanized: 'Mechanized',
  DropTroops: 'Drop Troops',
  Garrison: 'Garrison',
  EliteGuard: 'Elite Guard',
  Recon: 'Recon',
} as const;

export type MilitaryUnitCategory = (typeof MILITARY_UNIT_CATEGORIES)[keyof typeof MILITARY_UNIT_CATEGORIES];

export const MILITARY_UNIT_SUB_CATEGORIES: Record<MilitaryUnitCategory, string[]> = {
  Infantry: ['Light-Infantry', 'Heavy-Infantry', 'Mechanized-Infantry', 'Motorized-Infantry', 'Airborne-Infantry', 'Siege-Infantry'],
  Armor: ['Light-Tank', 'Main-Battle-Tank', 'Heavy-Tank', 'Super-Heavy-Tank', 'Hover-Tank', 'Walker-Mech'],
  Artillery: ['Howitzer', 'Rocket-Artillery', 'Plasma-Artillery', 'Railgun', 'Orbital-Strike-Designator', 'Missile-Battery'],
  Air: ['Fighter-Craft', 'Bomber-Craft', 'Gunship', 'Transport-Craft', 'Recon-Craft', 'Drone-Swarm'],
  Naval: ['Patrol-Boat', 'Destroyer-Escort', 'Amphibious-Assault', 'Submersible', 'Naval-Carrier', 'Battleship-Escort'],
  Space: ['Boarding-Pod', 'Space-Marine', 'Fighter-Squadron', 'Bomber-Wing', 'Corvette-Crew', 'Station-Guard'],
  'Special Ops': ['Black-Ops', 'Covert-Unit', 'Strike-Team', 'Shadow-Unit', 'Rapid-Intervention', 'Crisis-Response'],
  Support: ['Logistics', 'Medical', 'Engineering', 'Communications', 'Supply', 'Repair'],
  Cyber: ['Hacker-Unit', 'AI-Warfare', 'EW-Specialist', 'Code-Breaker', 'Network-Infiltrator', 'System-Saboteur'],
  Psi: ['Psi-Assault', 'Psi-Defense', 'Psi-Control', 'Psi-Healer', 'Psi-Scout', 'Psi-Commander'],
  Mechanized: ['APC', 'IFV', 'Mech-Suit', 'Powered-Armor', 'Exo-Squad', 'Battle-Frame'],
  'Drop Troops': ['Orbital-Drop', 'Rapid-Deployment', 'Planetary-Assault', 'Hot-Drop', 'Zero-G-Assault', 'Atmospheric-Entry'],
  Garrison: ['Planetary-Defense', 'Station-Security', 'Base-Guard', 'Colony-Protection', 'Fortress-Troop', 'Bunker-Garrison'],
  'Elite Guard': ['Royal-Guard', 'Imperial-Guard', 'Praetorian', 'Presidential-Security', 'Supreme-Protector', 'Bodyguard-Corps'],
  Recon: ['Scout-Squad', 'Patrol-Unit', 'Surveillance-Team', 'Pathfinder', 'Tracker-Unit', 'Forward-Observer'],
};

export const MILITARY_UNIT_TYPES = {
  Assault: 'Assault',
  Defense: 'Defense',
  Support: 'Support',
  Recon: 'Recon',
  Stealth: 'Stealth',
  Siege: 'Siege',
  Command: 'Command',
  Medical: 'Medical',
  Engineer: 'Engineer',
  Cyber: 'Cyber',
  Psi: 'Psi',
  Elite: 'Elite',
  Reserve: 'Reserve',
  Militia: 'Militia',
  Mercenary: 'Mercenary',
  HonorGuard: 'Honor Guard',
} as const;

export type MilitaryUnitType = (typeof MILITARY_UNIT_TYPES)[keyof typeof MILITARY_UNIT_TYPES];

export const MILITARY_UNIT_SUB_TYPES: Record<MilitaryUnitType, string[]> = {
  Assault: ['Frontal-Assault', 'Flanking-Force', 'Breaching-Team', 'Rapid-Strike', 'Overwhelming-Force', 'Alpha-Team'],
  Defense: ['Static-Defense', 'Mobile-Defense', 'Perimeter-Guard', 'Shield-Wall', 'Counter-Attack', 'Bastion'],
  Support: ['Fire-Support', 'Logistics-Support', 'Medical-Support', 'Engineering-Support', 'EW-Support', 'Artillery-Support'],
  Recon: ['Deep-Recon', 'Electronic-Recon', 'Forward-Recon', 'Stealth-Recon', 'Signal-Recon', 'Pathfinder'],
  Stealth: ['Covert-Ops', 'Shadow-Unit', 'Ghost-Unit', 'Silent-Team', 'Phantom-Squad', 'Invisible'],
  Siege: ['Fortress-Breaker', 'Siege-Gunner', 'Bombardment-Team', 'Structure-Destroyer', 'Bunker-Buster', 'Wall-Cracker'],
  Command: ['Tactical-Command', 'Field-Command', 'Squad-Command', 'Fleet-Command', 'Battle-Command', 'Strategic-Command'],
  Medical: ['Field-Medic', 'Surgery-Team', 'Evacuation-Team', 'Bio-Containment', 'Trauma-Response', 'Recovery-Unit'],
  Engineer: ['Construction-Engineer', 'Demolition-Engineer', 'Field-Fortification', 'Repair-Team', 'Sabotage-Engineer', 'Bridge-Builder'],
  Cyber: ['Cyber-Attack-Team', 'Defense-Network-Team', 'Electronic-Surveillance', 'Code-Crackers', 'AI-Interface-Team', 'System-Exploit-Team'],
  Psi: ['Psi-Strike-Team', 'Psi-Support-Team', 'Psi-Defense-Corps', 'Psi-Intel-Team', 'Psi-Controller-Unit', 'Psi-Healer-Circle'],
  Elite: ['Special-Forces', 'Strike-Team', 'Rapid-Response', 'Crisis-Team', 'High-Value-Target-Team', 'Tactical-Intervention'],
  Reserve: ['Strategic-Reserve', 'Garrison-Reserve', 'Training-Cadre', 'Standby-Force', 'Reinforcement-Pool', 'Mobilization-Corps'],
  Militia: ['Planetary-Militia', 'Colony-Defense-Force', 'Civilian-Guard', 'Home-Defense-Unit', 'Local-Security', 'Volunteer-Force'],
  Mercenary: ['Free-Lancers', 'Contract-Warriors', 'Private-Military', 'Mercenary-Company', 'Blade-for-Hire', 'Legion-of-Fortune'],
  'Honor Guard': ['Ceremonial-Guard', 'Veteran-Honor-Guard', 'Imperial-Honor-Guard', 'Heroes-Escort', 'Legacy-Protector', 'Eternal-Sentinel'],
};

// ─────────────────────────────────────────────────────────────────────
// SECTION 4: CIVILIAN UNIT CLASSIFICATION (20 classes, each with sub-classes)
// ─────────────────────────────────────────────────────────────────────

export const CIVILIAN_UNIT_CLASSES = {
  Untrained: 'Untrained',
  Laborer: 'Laborer',
  Technician: 'Technician',
  Specialist: 'Specialist',
  Expert: 'Expert',
  Master: 'Master',
  Grandmaster: 'Grandmaster',
  Artisan: 'Artisan',
  Scientist: 'Scientist',
  Engineer: 'Engineer',
  Doctor: 'Doctor',
  Teacher: 'Teacher',
  Trader: 'Trader',
  Artist: 'Artist',
  Administrator: 'Administrator',
  Entertainer: 'Entertainer',
  Explorer: 'Explorer',
  Colonist: 'Colonist',
  Diplomat: 'Diplomat',
  Pioneer: 'Pioneer',
} as const;

export type CivilianUnitClass = (typeof CIVILIAN_UNIT_CLASSES)[keyof typeof CIVILIAN_UNIT_CLASSES];

export const CIVILIAN_SUB_CLASSES: Record<CivilianUnitClass, string[]> = {
  Untrained: ['Raw-Civilian', 'Unassigned', 'Immigrant', 'Refugee', 'Child-of-Colony'],
  Laborer: ['General-Laborer', 'Construction-Worker', 'Miner', 'Dock-Worker', 'Sanitation-Worker', 'Farmhand'],
  Technician: ['Maintenance-Tech', 'Repair-Tech', 'Lab-Tech', 'Network-Tech', 'Industrial-Tech', 'Energy-Tech'],
  Specialist: ['Mining-Specialist', 'Medical-Specialist', 'Agricultural-Specialist', 'Manufacturing-Specialist', 'Logistics-Specialist', 'Energy-Specialist'],
  Expert: ['Senior-Engineer', 'Lead-Scientist', 'Chief-Doctor', 'Master-Trader', 'Head-Administrator', 'Prime-Investigator'],
  Master: ['Master-Engineer', 'Master-Scientist', 'Master-Artisan', 'Master-Trader', 'Master-Architect', 'Master-Planner'],
  Grandmaster: ['Grand-Theorist', 'Grand-Architect', 'Grand-Strategist', 'Grand-Inventor', 'Grand-Explorer', 'Grand-Coordinator'],
  Artisan: ['Craftsman', 'Jeweler', 'Sculptor', 'Forger', 'Designer', 'Fabricator'],
  Scientist: ['Physicist', 'Biologist', 'Chemist', 'Xenologist', 'Astronomer', 'Quantum-Physicist'],
  Engineer: ['Structural-Engineer', 'Systems-Engineer', 'Propulsion-Engineer', 'Material-Engineer', 'Bio-Engineer', 'Nano-Engineer'],
  Doctor: ['General-Practitioner', 'Surgeon', 'Psychiatrist', 'Xeno-Biologist', 'Geneticist', 'Epidemiologist'],
  Teacher: ['Instructor', 'Professor', 'Trainer', 'Mentor', 'Curriculum-Designer', 'Academy-Head'],
  Trader: ['Merchant', 'Broker', 'Auctioneer', 'Exporter', 'Importer', 'Black-Market-Dealer'],
  Artist: ['Painter', 'Sculptor', 'Musician', 'Holo-Artist', 'Writer', 'Architect'],
  Administrator: ['Office-Manager', 'HR-Specialist', 'Finance-Officer', 'Operations-Manager', 'Project-Coordinator', 'Executive-Director'],
  Entertainer: ['Performer', 'Actor', 'Musician', 'Comedian', 'Holo-Star', 'Event-Planner'],
  Explorer: ['Surveyor', 'Pathfinder', 'Void-Explorer', 'Anomaly-Hunter', 'Ancient-Relic-Seeker', 'Wormhole-Navigator'],
  Colonist: ['Settler', 'Frontier-Dweller', 'Homesteader', 'Terraformer', 'Colony-Founder', 'Pioneer'],
  Diplomat: ['Envoy', 'Consul', 'Negotiator', 'Trade-Attache', 'Cultural-Liaison', 'Peace-Ambassador'],
  Pioneer: ['Frontier-Scout', 'Path-Breaker', 'New-World-Settler', 'First-Contact-Specialist', 'Wilderness-Survivor', 'Trail-Blazer'],
};

export const CIVILIAN_UNIT_CATEGORIES = {
  Agriculture: 'Agriculture',
  Commerce: 'Commerce',
  Communications: 'Communications',
  Construction: 'Construction',
  Education: 'Education',
  Energy: 'Energy',
  Engineering: 'Engineering',
  Entertainment: 'Entertainment',
  Exploration: 'Exploration',
  Health: 'Health',
  Infrastructure: 'Infrastructure',
  Labor: 'Labor',
  Manufacturing: 'Manufacturing',
  Mining: 'Mining',
  Science: 'Science',
  Services: 'Services',
  Trade: 'Trade',
  Transport: 'Transport',
} as const;

export type CivilianUnitCategory = (typeof CIVILIAN_UNIT_CATEGORIES)[keyof typeof CIVILIAN_UNIT_CATEGORIES];

export const CIVILIAN_UNIT_SUB_CATEGORIES: Record<CivilianUnitCategory, string[]> = {
  Agriculture: ['Hydroponics', 'Aquaculture', 'Vertical-Farming', 'Livestock', 'Mycelium-Farming', 'Synthetic-Food', 'Algae-Harvesting'],
  Commerce: ['Retail', 'Wholesale', 'E-Commerce', 'Marketplace', 'Auction-House', 'Banking', 'Insurance'],
  Communications: ['Data-Relay', 'Subspace-Comm', 'Quantum-Network', 'Holographic-Comm', 'Encryption-Services', 'News-Media', 'Social-Network-Admin'],
  Construction: ['Residential', 'Commercial', 'Industrial', 'Infrastructure', 'Megastructure', 'Orbital', 'Underground'],
  Education: ['Basic-Education', 'Higher-Education', 'Vocational-Training', 'Military-Academy', 'Science-Institute', 'Art-School', 'Trade-School'],
  Energy: ['Fusion-Power', 'Solar-Collection', 'Antimatter', 'Zero-Point', 'Geothermal', 'Nebula-Extraction', 'Quantum-Harvesting'],
  Engineering: ['Mechanical', 'Electrical', 'Civil', 'Nano', 'Bio', 'Quantum', 'Propulsion'],
  Entertainment: ['Holodeck', 'Virtual-Reality', 'Sports', 'Arts', 'Music', 'Gaming', 'Theme-Parks'],
  Exploration: ['Deep-Space', 'Planetary-Survey', 'Anomaly-Research', 'Wormhole-Mapping', 'Nebula-Navigation', 'Ancient-Ruins', 'Xeno-Contact'],
  Health: ['Hospitals', 'Clinics', 'Research-Medicine', 'Psychiatry', 'Gene-Therapy', 'Cybernetics', 'Preventive-Care'],
  Infrastructure: ['Roads-Transit', 'Life-Support', 'Waste-Management', 'Water-Systems', 'Habitat-Domes', 'Atmospheric-Processors', 'Gravity-Stabilizers'],
  Labor: ['Unskilled-Labor', 'Semi-Skilled', 'Skilled-Trades', 'Supervisory', 'Union-Represented', 'Automation-Oversight', 'Robotic-Supervision'],
  Manufacturing: ['Heavy-Manufacturing', 'Precision-Manufacturing', 'Nano-Assembly', '3D-Printing', 'Chemical-Processing', 'Pharmaceuticals', 'Electronics'],
  Mining: ['Asteroid-Mining', 'Planet-Mining', 'Deep-Core', 'Gas-Harvesting', 'Ice-Mining', 'Crystal-Mining', 'Exotic-Matter'],
  Science: ['Physics', 'Biology', 'Chemistry', 'Xenology', 'Archaeology', 'Computer-Science', 'Materials-Science'],
  Services: ['Food-Services', 'Hospitality', 'Cleaning', 'Security', 'Legal', 'Consulting', 'Logistics'],
  Trade: ['Import-Export', 'Interstellar-Trade', 'Resource-Brokerage', 'Technology-Licensing', 'Ship-Trading', 'Contract-Negotiation', 'Currency-Exchange'],
  Transport: ['Cargo-Freight', 'Passenger-Transport', 'Courier-Services', 'Fleet-Logistics', 'Emergency-Response', 'Colony-Supply', 'Wormhole-Transit'],
};

export const CIVILIAN_UNIT_TYPES = {
  Producer: 'Producer',
  Gatherer: 'Gatherer',
  Processor: 'Processor',
  Builder: 'Builder',
  Maintainer: 'Maintainer',
  Researcher: 'Researcher',
  Healer: 'Healer',
  Educator: 'Educator',
  Merchant: 'Merchant',
  Artist: 'Artist',
  Explorer: 'Explorer',
  Administrator: 'Administrator',
  Entertainer: 'Entertainer',
  Logistician: 'Logistician',
  Servitor: 'Servitor',
  Innovator: 'Innovator',
} as const;

export type CivilianUnitType = (typeof CIVILIAN_UNIT_TYPES)[keyof typeof CIVILIAN_UNIT_TYPES];

export const CIVILIAN_UNIT_SUB_TYPES: Record<CivilianUnitType, string[]> = {
  Producer: ['Manufacturer', 'Fabricator', 'Assembler', 'Refiner', 'Crafter', 'Constructor', 'Grower'],
  Gatherer: ['Miner', 'Harvester', 'Collector', 'Extractor', 'Forager', 'Salvager', 'Scavenger'],
  Processor: ['Refiner', 'Purifier', 'Transmuter', 'Compressor', 'Enricher', 'Separator', 'Catalyzer'],
  Builder: ['Architect', 'Constructor', 'Framer', 'Finisher', 'Megastructure-Builder', 'Orbital-Constructor', 'Habitat-Builder'],
  Maintainer: ['Repair-Tech', 'Service-Tech', 'Upkeep-Specialist', 'System-Monitor', 'Maintenance-Drone-Op', 'Facility-Manager', 'Janitor'],
  Researcher: ['Lab-Scientist', 'Field-Researcher', 'Data-Analyst', 'Theorist', 'Experimentalist', 'Peer-Reviewer', 'Archivist'],
  Healer: ['Doctor', 'Surgeon', 'Nurse', 'Psychiatrist', 'Gene-Therapist', 'Cyber-Surgeon', 'Rehab-Specialist'],
  Educator: ['Teacher', 'Professor', 'Trainer', 'Mentor', 'Coach', 'Lecturer', 'Simulation-Designer'],
  Merchant: ['Trader', 'Broker', 'Shopkeeper', 'Auctioneer', 'Exporter', 'Importer', 'Market-Analyst'],
  Artist: ['Painter', 'Sculptor', 'Musician', 'Writer', 'Holo-Artist', 'Architect', 'Designer'],
  Explorer: ['Void-Navigator', 'Planet-Surveyor', 'Anomaly-Hunter', 'Wormhole-Scouter', 'Nebula-Penetrator', 'Relic-Seeker', 'Star-Chartographer'],
  Administrator: ['Manager', 'Coordinator', 'Director', 'Executive', 'Supervisor', 'Planner', 'Scheduler'],
  Entertainer: ['Performer', 'VR-Designer', 'Sports-Player', 'Game-Designer', 'Musician', 'Actor', 'Host'],
  Logistician: ['Supply-Chain-Manager', 'Freight-Coordinator', 'Warehouse-Manager', 'Inventory-Specialist', 'Distribution-Planner', 'Fleet-Logistician', 'Resource-Allocator'],
  Servitor: ['Personal-Assistant', 'Butler', 'Concierge', 'Steward', 'Helper', 'Attendant', 'Volunteer'],
  Innovator: ['Inventor', 'Designer', 'Visionary', 'Disruptor', 'Optimizer', 'Hacker', 'System-Architect'],
};

// ─────────────────────────────────────────────────────────────────────
// SECTION 5: GOVERNMENT UNIT CLASSIFICATION (20 classes, each with sub-classes)
// ─────────────────────────────────────────────────────────────────────

export const GOVERNMENT_UNIT_CLASSES = {
  Untrained: 'Untrained',
  Clerk: 'Clerk',
  Official: 'Official',
  Director: 'Director',
  Minister: 'Minister',
  Chancellor: 'Chancellor',
  Emperor: 'Emperor',
  Magistrate: 'Magistrate',
  Diplomat: 'Diplomat',
  Inquisitor: 'Inquisitor',
  Ambassador: 'Ambassador',
  Governor: 'Governor',
  Senator: 'Senator',
  Councilor: 'Councilor',
  Praetorian: 'Praetorian',
  Judge: 'Judge',
  Spymaster: 'Spymaster',
  Archivist: 'Archivist',
  Treasurer: 'Treasurer',
  GrandMinister: 'Grand Minister',
} as const;

export type GovernmentUnitClass = (typeof GOVERNMENT_UNIT_CLASSES)[keyof typeof GOVERNMENT_UNIT_CLASSES];

export const GOVERNMENT_SUB_CLASSES: Record<GovernmentUnitClass, string[]> = {
  Untrained: ['Unassigned-Candidate', 'Trainee', 'Intern', 'Apprentice-Bureaucrat', 'Probationary-Official'],
  Clerk: ['Data-Entry-Clerk', 'Records-Clerk', 'Filing-Clerk', 'Correspondence-Clerk', 'Payroll-Clerk', 'Procurement-Clerk'],
  Official: ['Colony-Official', 'Trade-Official', 'Customs-Official', 'Immigration-Official', 'Licensing-Official', 'Inspector'],
  Director: ['Agency-Director', 'Bureau-Director', 'Division-Director', 'Department-Head', 'Program-Director', 'Task-Force-Lead'],
  Minister: ['Minister-of-Interior', 'Minister-of-Defense', 'Minister-of-Trade', 'Minister-of-Science', 'Minister-of-Justice', 'Minister-of-Colonies'],
  Chancellor: ['Grand-Chancellor', 'Imperial-Chancellor', 'War-Chancellor', 'Trade-Chancellor', 'Science-Chancellor', 'Colony-Chancellor'],
  Emperor: ['Galactic-Emperor', 'System-Lord', 'Star-Emperor', 'Eternal-Emperor', 'Divine-Emperor', 'Omni-Emperor'],
  Magistrate: ['Planetary-Magistrate', 'District-Magistrate', 'Chief-Magistrate', 'Military-Magistrate', 'Trade-Magistrate', 'High-Magistrate'],
  Diplomat: ['Junior-Diplomat', 'Senior-Diplomat', 'Trade-Diplomat', 'Military-Diplomat', 'Cultural-Diplomat', 'Crisis-Diplomat'],
  Inquisitor: ['Imperial-Inquisitor', 'Heresy-Inquisitor', 'Xeno-Inquisitor', 'Corruption-Inquisitor', 'Tech-Inquisitor', 'Psi-Inquisitor'],
  Ambassador: ['Faction-Ambassador', 'Council-Ambassador', 'Trade-Ambassador', 'Peace-Ambassador', 'Cultural-Ambassador', 'Defense-Ambassador'],
  Governor: ['Planetary-Governor', 'Sector-Governor', 'System-Governor', 'Military-Governor', 'Colony-Governor', 'Provisional-Governor'],
  Senator: ['Planetary-Senator', 'Sector-Senator', 'System-Senator', 'Trade-Senator', 'Military-Senator', 'High-Senator'],
  Councilor: ['War-Councilor', 'Trade-Councilor', 'Science-Councilor', 'Justice-Councilor', 'Foreign-Councilor', 'Supreme-Councilor'],
  Praetorian: ['Praetorian-Guard', 'Praetorian-Commander', 'Praetorian-Captain', 'Praetorian-Lieutenant', 'Praetorian-Elite', 'Praetorian-Prime'],
  Judge: ['District-Judge', 'Appeals-Judge', 'High-Judge', 'Chief-Justice', 'Military-Judge', 'Supreme-Judge'],
  Spymaster: ['Intel-Spymaster', 'Counter-Intel-Spymaster', 'Foreign-Spymaster', 'Tech-Spymaster', 'Psi-Spymaster', 'Shadow-Spymaster'],
  Archivist: ['Data-Archivist', 'History-Archivist', 'Tech-Archivist', 'Galactic-Archivist', 'Ancient-Archivist', 'Quantum-Archivist'],
  Treasurer: ['Planetary-Treasurer', 'Imperial-Treasurer', 'War-Treasurer', 'Trade-Treasurer', 'Mint-Treasurer', 'Auditor-General'],
  'Grand Minister': ['Supreme-Advisor', 'Imperial-Hand', 'Voice-of-the-Emperor', 'Grand-Vizier', 'Prime-Minister', 'Chancellor-of-State'],
};

export const GOVERNMENT_UNIT_CATEGORIES = {
  Administration: 'Administration',
  Diplomacy: 'Diplomacy',
  Economy: 'Economy',
  Education: 'Education',
  Intelligence: 'Intelligence',
  Justice: 'Justice',
  LawEnforcement: 'Law Enforcement',
  Military: 'Military',
  Science: 'Science',
  SocialServices: 'Social Services',
  Treasury: 'Treasury',
  ForeignAffairs: 'Foreign Affairs',
  Infrastructure: 'Infrastructure',
  ImperialGuard: 'Imperial Guard',
  ColonialAffairs: 'Colonial Affairs',
  StrategicCommand: 'Strategic Command',
} as const;

export type GovernmentUnitCategory = (typeof GOVERNMENT_UNIT_CATEGORIES)[keyof typeof GOVERNMENT_UNIT_CATEGORIES];

export const GOVERNMENT_UNIT_SUB_CATEGORIES: Record<GovernmentUnitCategory, string[]> = {
  Administration: ['Civil-Service', 'Records-Management', 'Permitting', 'Public-Works', 'Census', 'Immigration', 'Procurement'],
  Diplomacy: ['Foreign-Relations', 'Treaty-Negotiation', 'Cultural-Exchange', 'Consular-Services', 'Trade-Diplomacy', 'Peacekeeping', 'Crisis-Diplomacy'],
  Economy: ['Fiscal-Policy', 'Monetary-Policy', 'Market-Regulation', 'Resource-Allocation', 'Trade-Balance', 'Development', 'Currency-Control'],
  Education: ['Public-Schools', 'Academies', 'Research-Universities', 'Vocational-Training', 'Military-Academies', 'Diplomatic-School', 'Citizenship-Programs'],
  Intelligence: ['Foreign-Intel', 'Counter-Intel', 'Signals-Intel', 'Human-Intel', 'Tech-Intel', 'Analysis', 'Covert-Ops'],
  Justice: ['Civil-Courts', 'Criminal-Courts', 'Military-Courts', 'Supreme-Court', 'Arbitration', 'Legal-Aid', 'Constitutional-Review'],
  'Law Enforcement': ['Colony-Police', 'System-Security', 'Sector-Patrol', 'Imperial-Guard', 'Special-Investigations', 'Cyber-Crimes', 'Xeno-Security'],
  Military: ['Army-Command', 'Navy-Command', 'Marine-Corps', 'Special-Forces-Command', 'Strategic-Forces', 'Logistics-Command', 'Training-Command'],
  Science: ['Physics-Division', 'Biology-Division', 'Technology-Division', 'Medical-Research', 'Xeno-Studies', 'Quantum-Studies', 'Applied-Science'],
  'Social Services': ['Welfare', 'Housing', 'Food-Security', 'Healthcare-Access', 'Disaster-Relief', 'Refugee-Services', 'Community-Programs'],
  Treasury: ['Taxation', 'Auditing', 'Minting', 'Reserves-Management', 'Debt-Management', 'Financial-Intelligence', 'Budget-Office'],
  'Foreign Affairs': ['Bilateral-Relations', 'Multilateral-Relations', 'Embassy-Services', 'Treaty-Implementation', 'Sanctions-Enforcement', 'Humanitarian-Aid', 'Peace-Negotiations'],
  Infrastructure: ['Transportation', 'Energy-Grid', 'Communications-Network', 'Habitat-Development', 'Space-Facilities', 'Planetary-Engineering', 'Megastructure-Admin'],
  'Imperial Guard': ['Palace-Guard', 'Emperor-Protection', 'Ceremonial-Guard', 'Armored-Cavalry', 'Honor-Battalion', 'Capital-Defense', 'Royal-Fleet'],
  'Colonial Affairs': ['Settlement-Planning', 'Colony-Support', 'Frontier-Admin', 'Resource-Management', 'Indigenous-Relations', 'Terraforming-Oversight', 'Colony-Defense'],
  'Strategic Command': ['War-Planning', 'Intel-Fusion', 'Resource-Mobilization', 'Crisis-Management', 'Long-Range-Strategy', 'Doctrine-Development', 'Future-Threats-Analysis'],
};

export const GOVERNMENT_UNIT_TYPES = {
  Administrative: 'Administrative',
  Diplomatic: 'Diplomatic',
  Judicial: 'Judicial',
  Enforcement: 'Enforcement',
  Financial: 'Financial',
  Educational: 'Educational',
  Intelligence: 'Intelligence',
  Regulatory: 'Regulatory',
  Social: 'Social',
  Infrastructure: 'Infrastructure',
  Executive: 'Executive',
  Legislative: 'Legislative',
  Guard: 'Guard',
  Strategic: 'Strategic',
} as const;

export type GovernmentUnitType = (typeof GOVERNMENT_UNIT_TYPES)[keyof typeof GOVERNMENT_UNIT_TYPES];

export const GOVERNMENT_UNIT_SUB_TYPES: Record<GovernmentUnitType, string[]> = {
  Administrative: ['Records', 'Permits', 'Licensing', 'Procurement', 'Census', 'Civil-Service', 'Archives'],
  Diplomatic: ['Treaty-Negotiation', 'Cultural-Exchange', 'Trade-Diplomacy', 'Consular', 'Peacekeeping', 'Crisis-Diplomacy', 'Alliance-Formation'],
  Judicial: ['Civil-Courts', 'Criminal-Courts', 'Military-Courts', 'Administrative-Tribunals', 'Appeals', 'Constitutional', 'Arbitration'],
  Enforcement: ['Colony-Police', 'Planetary-Security', 'Sector-Patrol', 'Investigation', 'Cyber-Crimes', 'Xeno-Security', 'Special-Operations'],
  Financial: ['Taxation', 'Auditing', 'Budget', 'Reserves', 'Minting', 'Debt-Management', 'Markets-Regulation'],
  Educational: ['Schools', 'Universities', 'Training-Programs', 'Research-Grants', 'Curriculum-Dev', 'Scholarships', 'Exchange-Programs'],
  Intelligence: ['Foreign-Intel', 'Counter-Intel', 'Signals-Intel', 'Analysis', 'Covert-Ops', 'Cyber-Intel', 'Threat-Assessment'],
  Regulatory: ['Trade-Regulation', 'Environmental', 'Safety-Standards', 'Licensing-Boards', 'Compliance', 'Inspections', 'Consumer-Protection'],
  Social: ['Welfare', 'Housing', 'Food-Security', 'Healthcare', 'Disaster-Relief', 'Refugee-Services', 'Community-Development'],
  Infrastructure: ['Planning', 'Zoning', 'Development', 'Maintenance', 'Energy-Grid', 'Transit', 'Communications'],
  Executive: ['Policy-Making', 'Decree-Issuance', 'Emergency-Powers', 'State-Functions', 'Diplomatic-Reception', 'Ceremonial', 'Command-Decisions'],
  Legislative: ['Law-Formulation', 'Debate', 'Amendment', 'Ratification', 'Oversight', 'Budget-Approval', 'Investigation-Committees'],
  Guard: ['VIP-Protection', 'Perimeter-Security', 'Ceremonial-Guard', 'Armored-Escort', 'Palace-Defense', 'Capital-Security', 'Royal-Fleet'],
  Strategic: ['War-Planning', 'Crisis-Management', 'Long-Range-Strategy', 'Intel-Fusion', 'Resource-Mobilization', 'Doctrine-Dev', 'Threat-Analysis'],
};

// ─────────────────────────────────────────────────────────────────────
// SECTION 6: AGGREGATION HELPERS
// ─────────────────────────────────────────────────────────────────────

// 6A: Combined lookup maps for all entities
export const ALL_CLASSIFICATIONS = {
  // Ship (20 classes, 4 axes each = 80 classification groups)
  ships: {
    classes: Object.keys(SHIP_SUB_CLASSES) as ShipClass[],
    categories: Object.keys(SHIP_SUB_CATEGORIES) as ShipCategory[],
    types: Object.keys(SHIP_SUB_TYPES) as ShipType[],
    roles: Object.keys(SHIP_SUB_ROLES) as ShipRole[],
  },
  // Mothership (12 classes, 3 axes)
  motherships: {
    classes: Object.keys(MOTHERSHIP_SUB_CLASSES) as MothershipClass[],
    categories: Object.keys(MOTHERSHIP_SUB_CATEGORIES) as MothershipCategory[],
    types: Object.keys(MOTHERSHIP_SUB_TYPES) as MothershipType[],
  },
  // Military (20 classes, 3 axes)
  military: {
    classes: Object.keys(MILITARY_SUB_CLASSES) as MilitaryUnitClass[],
    categories: Object.keys(MILITARY_UNIT_SUB_CATEGORIES) as MilitaryUnitCategory[],
    types: Object.keys(MILITARY_UNIT_SUB_TYPES) as MilitaryUnitType[],
  },
  // Civilian (20 classes, 3 axes)
  civilian: {
    classes: Object.keys(CIVILIAN_SUB_CLASSES) as CivilianUnitClass[],
    categories: Object.keys(CIVILIAN_UNIT_SUB_CATEGORIES) as CivilianUnitCategory[],
    types: Object.keys(CIVILIAN_UNIT_SUB_TYPES) as CivilianUnitType[],
  },
  // Government (20 classes, 3 axes)
  government: {
    classes: Object.keys(GOVERNMENT_SUB_CLASSES) as GovernmentUnitClass[],
    categories: Object.keys(GOVERNMENT_UNIT_SUB_CATEGORIES) as GovernmentUnitCategory[],
    types: Object.keys(GOVERNMENT_UNIT_SUB_TYPES) as GovernmentUnitType[],
  },
};

// 6B: Total discrete classification count
export const CLASSIFICATION_COUNTS = {
  shipClasses: Object.keys(SHIP_CLASSES).length,
  shipCategories: Object.keys(SHIP_CATEGORIES).length,
  shipTypes: Object.keys(SHIP_TYPES).length,
  shipRoles: Object.keys(SHIP_ROLES).length,
  mothershipClasses: Object.keys(MOTHERSHIP_CLASSES).length,
  mothershipCategories: Object.keys(MOTHERSHIP_CATEGORIES).length,
  mothershipTypes: Object.keys(MOTHERSHIP_TYPES).length,
  militaryClasses: Object.keys(MILITARY_UNIT_CLASSES).length,
  militaryCategories: Object.keys(MILITARY_UNIT_CATEGORIES).length,
  militaryTypes: Object.keys(MILITARY_UNIT_TYPES).length,
  civilianClasses: Object.keys(CIVILIAN_UNIT_CLASSES).length,
  civilianCategories: Object.keys(CIVILIAN_UNIT_CATEGORIES).length,
  civilianTypes: Object.keys(CIVILIAN_UNIT_TYPES).length,
  governmentClasses: Object.keys(GOVERNMENT_UNIT_CLASSES).length,
  governmentCategories: Object.keys(GOVERNMENT_UNIT_CATEGORIES).length,
  governmentTypes: Object.keys(GOVERNMENT_UNIT_TYPES).length,
};

export const TOTAL_CLASSIFICATION_GROUPS =
  Object.keys(CLASSIFICATION_COUNTS).length;

// 6C: Get all sub-classes for a given classification
export function getSubClasses<K extends string>(
  map: Record<K, string[]>,
  key: K
): string[] {
  return map[key] ?? [];
}

// 6D: Resolve the full classification path for a given entity
export interface ClassificationPath {
  entityType: 'ship' | 'mothership' | 'military' | 'civilian' | 'government';
  class: string;
  subClass: string;
  category: string;
  subCategory: string;
  type: string;
  subType: string;
  role?: string;
  subRole?: string;
}

// 6E: Lookup helper — get all possible sub-items for a given classification
export function getAllSubClassesForShipClass(className: ShipClass): string[] {
  return SHIP_SUB_CLASSES[className] ?? [];
}

export function getAllSubCategoriesForShipCategory(category: ShipCategory): string[] {
  return SHIP_SUB_CATEGORIES[category] ?? [];
}

export function getAllSubTypesForShipType(type: ShipType): string[] {
  return SHIP_SUB_TYPES[type] ?? [];
}

export function getAllSubRolesForShipRole(role: ShipRole): string[] {
  return SHIP_SUB_ROLES[role] ?? [];
}

export function getAllSubClassesForMothershipClass(className: MothershipClass): string[] {
  return MOTHERSHIP_SUB_CLASSES[className] ?? [];
}

export function getAllSubCategoriesForMothershipCategory(category: MothershipCategory): string[] {
  return MOTHERSHIP_SUB_CATEGORIES[category] ?? [];
}

export function getAllSubTypesForMothershipType(type: MothershipType): string[] {
  return MOTHERSHIP_SUB_TYPES[type] ?? [];
}

export function getAllSubClassesForMilitaryClass(className: MilitaryUnitClass): string[] {
  return MILITARY_SUB_CLASSES[className] ?? [];
}

export function getAllSubCategoriesForMilitaryCategory(category: MilitaryUnitCategory): string[] {
  return MILITARY_UNIT_SUB_CATEGORIES[category] ?? [];
}

export function getAllSubTypesForMilitaryType(type: MilitaryUnitType): string[] {
  return MILITARY_UNIT_SUB_TYPES[type] ?? [];
}

export function getAllSubClassesForCivilianClass(className: CivilianUnitClass): string[] {
  return CIVILIAN_SUB_CLASSES[className] ?? [];
}

export function getAllSubCategoriesForCivilianCategory(category: CivilianUnitCategory): string[] {
  return CIVILIAN_UNIT_SUB_CATEGORIES[category] ?? [];
}

export function getAllSubTypesForCivilianType(type: CivilianUnitType): string[] {
  return CIVILIAN_UNIT_SUB_TYPES[type] ?? [];
}

export function getAllSubClassesForGovernmentClass(className: GovernmentUnitClass): string[] {
  return GOVERNMENT_SUB_CLASSES[className] ?? [];
}

export function getAllSubCategoriesForGovernmentCategory(category: GovernmentUnitCategory): string[] {
  return GOVERNMENT_UNIT_SUB_CATEGORIES[category] ?? [];
}

export function getAllSubTypesForGovernmentType(type: GovernmentUnitType): string[] {
  return GOVERNMENT_UNIT_SUB_TYPES[type] ?? [];
}
