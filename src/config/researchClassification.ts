// ════════════════════════════════════════════════════════════════════
// RESEARCH & TECHNOLOGY CLASSIFICATION TAXONOMY — 90+ Groups
//
// Covers: Research Domains | Technology Trees | Tech Libraries
//         | Categories | Sub-Categories | Classes | Sub-Classes
//         | Types | Sub-Types | Research Fields | Specializations
// ════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────
// SECTION 1: RESEARCH DOMAINS (12 primary domains)
// ─────────────────────────────────────────────────────────────────────

export const RESEARCH_DOMAINS = {
  Weapons: 'Weapons',
  Defense: 'Defense',
  Propulsion: 'Propulsion',
  Energy: 'Energy',
  Production: 'Production',
  Economy: 'Economy',
  Espionage: 'Espionage',
  Computing: 'Computing',
  Nanotechnology: 'Nanotechnology',
  Quantum: 'Quantum',
  Xenotech: 'Xenotech',
  Cosmic: 'Cosmic',
} as const;

export type ResearchDomain = (typeof RESEARCH_DOMAINS)[keyof typeof RESEARCH_DOMAINS];

export const RESEARCH_DOMAIN_SUB_CLASSES: Record<ResearchDomain, string[]> = {
  Weapons: ['Directed-Energy', 'Kinetic-Weapons', 'Missile-Systems', 'Explosive-Tech', 'Exotic-Weaponry'],
  Defense: ['Shield-Systems', 'Armor-Materials', 'Point-Defense', 'Counter-Measures', 'Structural-Integrity'],
  Propulsion: ['Sub-Light-Drive', 'FTL-Drive', 'Maneuvering-Systems', 'Fuel-Efficiency', 'Spatial-Navigation'],
  Energy: ['Power-Generation', 'Energy-Storage', 'Power-Distribution', 'Efficiency-Optimization', 'Alternative-Sources'],
  Production: ['Mining-Tech', 'Manufacturing', 'Construction', 'Resource-Processing', 'Logistics-Automation'],
  Economy: ['Trade-Commerce', 'Taxation-Finance', 'Resource-Management', 'Market-Regulation', 'Corporation-Development'],
  Espionage: ['Surveillance', 'Counter-Intelligence', 'Infiltration', 'Signal-Intercept', 'Code-Breaking'],
  Computing: ['Hardware-Architecture', 'Software-Systems', 'Artificial-Intelligence', 'Cybernetics', 'Data-Networks'],
  Nanotechnology: ['Nano-Manufacturing', 'Self-Replication', 'Bio-Nano-Integration', 'Nano-Weapons', 'Nano-Repair'],
  Quantum: ['Quantum-Computing', 'Quantum-Communications', 'Quantum-Physics', 'Quantum-Energy', 'Quantum-Warp'],
  Xenotech: ['Alien-Artifact-Study', 'Biotech-Integration', 'Precursor-Analysis', 'Psychic-Technology', 'Dimensional-Tech'],
  Cosmic: ['Stellar-Engineering', 'Space-Time', 'Reality-Manipulation', 'Time-Dilation', 'Universal-Constants'],
};

// ─────────────────────────────────────────────────────────────────────
// SECTION 2: TECHNOLOGY TREES (18 trees, each with sub-trees)
// ─────────────────────────────────────────────────────────────────────

export const TECH_TREES = {
  LaserTech: 'Laser Technology',
  PlasmaTech: 'Plasma Technology',
  IonTech: 'Ion Technology',
  GravitonTech: 'Graviton Technology',
  QuantumWeapons: 'Quantum Weapons',
  AntimatterWeapons: 'Antimatter Weapons',
  Shielding: 'Shielding',
  Armor: 'Armor',
  EnergyShields: 'Energy Shields',
  Countermeasures: 'Countermeasures',
  ImpulseDrive: 'Impulse Drive',
  HyperspaceDrive: 'Hyperspace Drive',
  WarpDrive: 'Warp Drive',
  WormholeTech: 'Wormhole Technology',
  Transwarp: 'Transwarp',
  FusionPower: 'Fusion Power',
  AntimatterPower: 'Antimatter Power',
  ZeroPointEnergy: 'Zero-Point Energy',
  MiningEfficiency: 'Mining Efficiency',
  Manufacturing: 'Manufacturing',
  NaniteAssembly: 'Nanite Assembly',
  Construction: 'Construction',
  ResourceProcessing: 'Resource Processing',
  TradeTech: 'Trade Technology',
  FinanceTech: 'Finance Technology',
  SpyTech: 'Espionage Technology',
  Communication: 'Communication',
  ComputerTech: 'Computer Technology',
  ArtificialIntelligence: 'Artificial Intelligence',
  Cybernetics: 'Cybernetics',
  Nanotech: 'Nanotechnology',
  Biotech: 'Biotechnology',
  PsychicTech: 'Psychic Technology',
  PrecursorTech: 'Precursor Technology',
  DimensionalTech: 'Dimensional Technology',
  TemporalTech: 'Temporal Technology',
} as const;

export type TechTree = (typeof TECH_TREES)[keyof typeof TECH_TREES];

export const TECH_TREE_SUB_TREES: Record<TechTree, string[]> = {
  'Laser Technology': ['Basic-Lasers', 'Pulse-Lasers', 'Beam-Lasers', 'X-Ray-Lasers', 'Gamma-Ray-Lasers'],
  'Plasma Technology': ['Thermal-Plasma', 'Magnetically-Contained', 'Plasma-Throwers', 'Plasma-Mortars', 'Fusion-Plasma'],
  'Ion Technology': ['Ion-Cannons', 'Ion-Disruptors', 'Ion-Field', 'Ion-Shield-Drain', 'EMP-Weapons'],
  'Graviton Technology': ['Gravity-Wells', 'Graviton-Beams', 'Mass-Disruptors', 'Tidal-Force', 'Singularity-Weapons'],
  'Quantum Weapons': ['Quantum-Entanglement-Strike', 'Reality-Disruptor', 'Subatomic-Blaster', 'Cascade-Weapon', 'Existence-Eraser'],
  'Antimatter Weapons': ['Antimatter-Missiles', 'Antimatter-Beams', 'Matter-Antimatter-Bombs', 'Annihilation-Field', 'Omega-Weapon'],
  'Shielding': ['Standard-Shields', 'Deflector-Shields', 'Adaptive-Shields', 'Reinforced-Shields', 'Omega-Shields'],
  'Armor': ['Metallic-Alloys', 'Composite-Armor', 'Reactive-Armor', 'Ablative-Armor', 'Neutronium-Armor'],
  'Energy Shields': ['Kinetic-Shields', 'Thermal-Shields', 'EM-Shields', 'Phase-Shields', 'Quantum-Barriers'],
  'Countermeasures': ['Chaff-Launchers', 'Flare-Decoys', 'ECM-Jamming', 'Sensor-Spoofing', 'Holographic-Projectors'],
  'Impulse Drive': ['Basic-Impulse', 'Advanced-Impulse', 'High-Thrust', 'Efficient-Cruise', 'Combat-Maneuver'],
  'Hyperspace Drive': ['Hyperspace-Voyage', 'Hyperspace-Jump', 'Hyperspace-Lanes', 'Mass-Relay', 'Fleet-Hyperspace'],
  'Warp Drive': ['Warp-Field', 'Alcubierre-Drive', 'Controlled-Warp', 'Warp-Sustainer', 'Soliton-Wave'],
  'Wormhole Technology': ['Stable-Wormhole', 'Wormhole-Gate', 'Network-Hub', 'Portal-Matrix', 'Wormhole-Routing'],
  'Transwarp': ['Transwarp-Conduit', 'Transwarp-Hub', 'Quantum-Tunnel', 'Slipstream', 'Underspace-Corridor'],
  'Fusion Power': ['Deuterium-Fusion', 'Helium-3-Fusion', 'Catalyzed-Fusion', 'Cold-Fusion', 'Tokamak-Advanced'],
  'Antimatter Power': ['Antimatter-Containment', 'Antimatter-Injection', 'Matter-Annihilation-Reactor', 'Antimatter-Cascade', 'Self-Sustaining-Annihilation'],
  'Zero-Point Energy': ['Vacuum-Energy', 'Casimir-Harvester', 'Quantum-Flucutuation-Harness', 'Point-Extraction', 'Infinite-Well'],
  'Mining Efficiency': ['Deep-Core-Mining', 'Asteroid-Strip-Mining', 'Gas-Giant-Extraction', 'Ice-Mining', 'Exotic-Matter-Mining'],
  'Manufacturing': ['Assembly-Line', 'Mass-Production', 'Advanced-Fabrication', 'Nano-Assembly', 'Replicator-Systems'],
  'Nanite Assembly': ['Nanite-Swarms', 'Self-Replicating-Nanites', 'Programmable-Matter', 'Utility-Fog', 'Grey-Goo-Protocol'],
  'Construction': ['Robotic-Assembly', '3D-Printing-Mega', 'Orbital-Fabrication', 'Self-Healing-Structures', 'Instant-Construction'],
  'Resource Processing': ['Ore-Refining', 'Gas-Liquefaction', 'Crystal-Purification', 'Deuterium-Electrolysis', 'Transmutation'],
  'Trade Technology': ['Interstellar-Trade-Routes', 'Market-Analysis', 'Trade-Agreements', 'Tariff-Optimization', 'Black-Market-Networks'],
  'Finance Technology': ['Banking-Systems', 'Credit-Generation', 'Insurance-Markets', 'Stock-Exchanges', 'Galactic-Economics'],
  'Espionage Technology': ['Spy-Probes', 'Covert-Networks', 'Agent-Training', 'Signal-Decryption', 'Deep-Cover-Ops'],
  'Communication': ['Quantum-Comm', 'Subspace-Relay', 'Holographic-Transmission', 'Encryption-Protocols', 'Galactic-Network'],
  'Computer Technology': ['Processing-Units', 'Memory-Architecture', 'Parallel-Computing', 'Wetware-Integration', 'Quantum-Processors'],
  'Artificial Intelligence': ['Expert-Systems', 'Neural-Networks', 'Self-Aware-AI', 'Artificial-Consciousness', 'Superintelligence'],
  'Cybernetics': ['Neural-Implants', 'Cybernetic-Limbs', 'Brain-Computer-Interface', 'Augmented-Reality', 'Full-Conversion'],
  'Nanotechnology': ['Nano-Medicine', 'Nano-Fabricators', 'Molecular-Assemblers', 'Nano-Swarm-Combat', 'Environmental-Nano'],
  'Biotechnology': ['Gene-Therapy', 'Cloning', 'Xeno-Biology', 'Evolution-Acceleration', 'Bio-Engineered-Soldiers'],
  'Psychic Technology': ['Psi-Amplifiers', 'Telepathic-Network', 'Psychic-Corps', 'Mental-Shields', 'Reality-Molding'],
  'Precursor Technology': ['Ancient-Relic-Study', 'Precursor-Alloys', 'Lost-Weapon-Yield', 'Gaia-Engineering', 'Legacy-Unlocks'],
  'Dimensional Technology': ['Pocket-Dimensions', 'Phase-Shifting', 'Reality-Anchoring', 'Dimensional-Gate', 'Multiverse-Access'],
  'Temporal Technology': ['Time-Dilation', 'Chroniton-Manipulation', 'Time-Loop', 'Precognition', 'Temporal-Immunity'],
};

// ─────────────────────────────────────────────────────────────────────
// SECTION 3: TECHNOLOGY CATEGORIES / SUBCATEGORIES (20+ groups)
// ─────────────────────────────────────────────────────────────────────

export const TECHNOLOGY_CATEGORIES = {
  DirectedEnergy: 'Directed Energy',
  Ballistic: 'Ballistic',
  Missile: 'Missile',
  Explosive: 'Explosive',
  ElectronicWarfare: 'Electronic Warfare',
  Structural: 'Structural',
  FTL: 'FTL',
  SublightPropulsion: 'Sublight Propulsion',
  PowerSystems: 'Power Systems',
  ResourceTech: 'Resource Technology',
  EconomicTech: 'Economic Technology',
  IntelTech: 'Intelligence Technology',
  ComputingTech: 'Computing Technology',
  ManufacturingTech: 'Manufacturing Technology',
  Materials: 'Materials',
  Biological: 'Biological',
  Psionic: 'Psionic',
  Dimensional: 'Dimensional',
  Temporal: 'Temporal',
  Precursor: 'Precursor',
  CosmicForces: 'Cosmic Forces',
} as const;

export type TechnologyCategory = (typeof TECHNOLOGY_CATEGORIES)[keyof typeof TECHNOLOGY_CATEGORIES];

export const TECHNOLOGY_SUB_CATEGORIES: Record<TechnologyCategory, string[]> = {
  'Directed Energy': ['Lasers', 'Plasma-Cannons', 'Particle-Beams', 'Phasers', 'Disruptors', 'Blasters'],
  'Ballistic': ['Railguns', 'Gauss-Cannons', 'Mass-Drivers', 'Coilguns', 'Hypervelocity-Projectiles'],
  'Missile': ['Guided-Missiles', 'Torpedoes', 'Proximity-Fused', 'Nuclear-Warheads', 'Smart-Seeking'],
  'Explosive': ['Plasma-Charges', 'Antimatter-Bombs', 'Singularity-Devices', 'Void-Bombs', 'Reality-Fracture'],
  'Electronic Warfare': ['Jammer-Tech', 'Decoy-Systems', 'Signal-Scrambling', 'AI-Hacking', 'Cyber-Attacks'],
  'Structural': ['Hull-Alloys', 'Nanite-Lattice', 'Reinforced-Frame', 'Self-Sealing', 'Adaptive-Morphology'],
  'FTL': ['Hyperspace', 'Warp-Tech', 'Wormhole', 'Transwarp', 'Slipstream', 'Subspace-Corridor'],
  'Sublight Propulsion': ['Ion-Thrusters', 'Fusion-Torches', 'Plasma-Propulsion', 'Zero-Point-Drive', 'Gravitic-Drive'],
  'Power Systems': ['Fusion-Reactors', 'Antimatter-Reactor', 'Zero-Point-Core', 'Quantum-Power', 'Dimensional-Tap'],
  'Resource Technology': ['Mining-Lasers', 'Deep-Core-Rigs', 'Gas-Extractors', 'Nano-Collectors', 'Transmutation-Arc'],
  'Economic Technology': ['Market-Manipulation', 'Resource-Hedging', 'Trade-Networks', 'Tax-Systems', 'Patent-Licensing'],
  'Intelligence Technology': ['Monitoring-Stations', 'Spy-Satellites', 'Agent-Training', 'Double-Agent-Protocols', 'Truth-Detection'],
  'Computing Technology': ['Optical-Computing', 'Quantum-Computing', 'Neural-Computing', 'Wetware-Computing', 'Distributed-Computing'],
  'Manufacturing Technology': ['Factories', 'Assembly-Plants', 'Orbital-Foundries', 'Nano-Forge', 'Replicator'],
  'Materials': ['Metal-Alloys', 'Composite-Materials', 'Crystal-Matrices', 'Energy-Matter', 'Programmable-Matter'],
  'Biological': ['Genetic-Engineering', 'Cybernetic-Integration', 'Cloning-Facilities', 'Bio-Adaptation', 'Evolution-Acceleration'],
  'Psionic': ['Telepathy', 'Telekinesis', 'Precognition', 'Mind-Control', 'Psychic-Blast'],
  'Dimensional': ['Pocket-Space', 'Phase-Tech', 'Reality-Bubble', 'Dimensional-Lock', 'Multi-Universe'],
  'Temporal': ['Time-Acceleration', 'Time-Slow', 'Time-Stop', 'Time-Rewind', 'Temporal-Shield'],
  'Precursor': ['Artifact-Harvesting', 'Database-Decryption', 'Gaia-Secrets', 'Engine-Mimicry', 'Legacy-Weapons'],
  'Cosmic Forces': ['Gravity-Control', 'Dark-Energy', 'Dark-Matter', 'String-Manipulation', 'Fundamental-Force-Resonance'],
};

// ─────────────────────────────────────────────────────────────────────
// SECTION 4: TECHNOLOGY TYPES / SUB-TYPES (20+ groups)
// ─────────────────────────────────────────────────────────────────────

export const TECHNOLOGY_TYPES = {
  MilitaryTech: 'Military Tech',
  DefensiveTech: 'Defensive Tech',
  PropulsionTech: 'Propulsion Tech',
  EnergyTech: 'Energy Tech',
  IndustrialTech: 'Industrial Tech',
  EconomicTechType: 'Economic Tech',
  EspionageTech: 'Espionage Tech',
  InformationTech: 'Information Tech',
  ProductionTech: 'Production Tech',
  MaterialTech: 'Material Tech',
  BiologicalTech: 'Biological Tech',
  PsionicTech: 'Psionic Tech',
  SpaceTimeTech: 'Space-Time Tech',
  PrecursorTechType: 'Precursor Tech',
  HybridTech: 'Hybrid Tech',
  ExperimentalTech: 'Experimental Tech',
  ForbiddenTech: 'Forbidden Tech',
  TranscendentTech: 'Transcendent Tech',
  FundamentalTech: 'Fundamental Tech',
  AppliedTech: 'Applied Tech',
} as const;

export type TechnologyType = (typeof TECHNOLOGY_TYPES)[keyof typeof TECHNOLOGY_TYPES];

export const TECHNOLOGY_SUB_TYPES: Record<TechnologyType, string[]> = {
  'Military Tech': ['Ship-Weapons', 'Ground-Weapons', 'Station-Weapons', 'Fighter-Weapons', 'Bomber-Weapons', 'Siege-Weapons'],
  'Defensive Tech': ['Ship-Armor', 'Station-Armor', 'Personal-Armor', 'Shield-Arrays', 'Point-Defense-Systems', 'Bastion-Fortifications'],
  'Propulsion Tech': ['Warp-Cores', 'Impulse-Engines', 'RCS-Thrusters', 'Emergency-Drive', 'Reaction-Engine', 'Ion-Drive'],
  'Energy Tech': ['Reactor-Tech', 'Battery-Capacity', 'Wireless-Transmission', 'Emergency-Power', 'Siphon-Tech', 'Overload-Protection'],
  'Industrial Tech': ['Smelters', 'Refineries', 'Assembly-Lines', 'Automated-Factories', '3D-Foundries', 'Nano-Assemblers'],
  'Economic Tech': ['Trade-Policy', 'Currency-Minting', 'Tariff-Management', 'Market-Intelligence', 'Contract-Enforcement', 'Blockchain-Networks'],
  'Espionage Tech': ['Covert-Ops-Gear', 'Encryption-Software', 'Stealth-Field', 'Identity-Forgery', 'Interrogation-Tools', 'Tracking-Implants'],
  'Information Tech': ['Data-Banks', 'Search-Algorithms', 'Predictive-Analytics', 'Holographic-Storage', 'Neural-Databases', 'Quantum-Memory'],
  'Production Tech': ['Manufacturing-Hubs', 'Resource-Efficiency', 'Production-Lines', 'Modular-Construction', 'Rapid-Prototyping', 'Scalable-Factories'],
  'Material Tech': ['Alloy-Smelting', 'Crystal-Growth', 'Composite-Bonding', 'Superconductor-Creation', 'Metamaterial-Fabrication', 'Hyperdense-Material'],
  'Biological Tech': ['Genetic-Sequencing', 'Augmentation-Surgery', 'Bio-Sculpting', 'Organ-Cloning', 'Symbiote-Integration', 'Nanite-Boost'],
  'Psionic Tech': ['Psi-Amplifier-Crown', 'Neural-Interfacer', 'Collective-Mind-Link', 'Psychic-Shield-Generator', 'Precog-Scanner', 'Telekine-Exosuit'],
  'Space-Time Tech': ['Warp-Field-Generator', 'Gravity-Manipulator', 'Temporal-Stabilizer', 'Spacial-Anchoring', 'Inertial-Dampener', 'Mass-Reducer'],
  'Precursor Tech': ['Artifact-Decoder', 'Power-Core-Study', 'Alloy-Mimicry', 'Blueprint-Recovery', 'Network-Integration', 'Consciousness-Upload'],
  'Hybrid Tech': ['Bio-Mechanical', 'Nano-Energy', 'Psy-Quantum', 'Temporal-Gravity', 'Dimensional-Energy', 'Plasma-Kinetic'],
  'Experimental Tech': ['Prototype-Weapons', 'Beta-Shields', 'Alpha-Drive', 'Pre-Release-Systems', 'Unstable-Energy', 'Risky-Enhancement'],
  'Forbidden Tech': ['Antimatter-Bomb', 'Weaponized-Plague', 'Soul-Harvesting', 'Reality-Collapse', 'Mind-Shatter', 'Existence-Erasure'],
  'Transcendent Tech': ['Ascended-Materials', 'Divine-Energy', 'God-Core', 'Infinity-Power', 'Eternal-Shield', 'Omni-Weapon'],
  'Fundamental Tech': ['String-Theory', 'Grand-Unified-Theory', 'Theory-of-Everything', 'Multiversal-Laws', 'Consciousness-Theory', 'Original-Source'],
  'Applied Tech': ['Practical-Weapons', 'Field-Ready-Armor', 'Production-Modules', 'Commercial-Products', 'Consumer-Tech', 'Infrastructure-Grade'],
};

// ─────────────────────────────────────────────────────────────────────
// SECTION 5: TECH LIBRARIES / FIELDS (15+ groups)
// ─────────────────────────────────────────────────────────────────────

export const TECH_LIBRARIES = {
  ImperialArchive: 'Imperial Archive',
  XenotechLibrary: 'Xenotech Library',
  QuantumCore: 'Quantum Core',
  PrecursorVault: 'Precursor Vault',
  DarkTech: 'Dark Tech',
  GalacticStandard: 'Galactic Standard',
  MilitaryDoctrine: 'Military Doctrine',
  CivilEngineering: 'Civil Engineering',
  BioscienceDivision: 'Bioscience Division',
  MaterialScience: 'Material Science',
  EnergyCommission: 'Energy Commission',
  PropulsionAuthority: 'Propulsion Authority',
  IntelDivision: 'Intelligence Division',
  CyberDivision: 'Cyber Division',
  ExoticResearch: 'Exotic Research',
  AscensionStudies: 'Ascension Studies',
} as const;

export type TechLibrary = (typeof TECH_LIBRARIES)[keyof typeof TECH_LIBRARIES];

export const TECH_LIBRARY_SUB_FIELDS: Record<TechLibrary, string[]> = {
  'Imperial Archive': ['Standard-Protocols', 'Classified-Documents', 'Military-Manuals', 'Engineering-Schematics', 'Historical-Records', 'Citizen-Database'],
  'Xenotech Library': ['Alien-Weapon-Data', 'Xeno-Biology-Notes', 'Cultural-Artifacts', 'Lost-Translations', 'Tech-Integration', 'Hybrid-Designs'],
  'Quantum Core': ['Quantum-Algorithms', 'Qubit-Architecture', 'Entanglement-Network', 'Quantum-Error-Correction', 'Superposition-Storage', 'Quantum-Gate-Design'],
  'Precursor Vault': ['Relic-Catalog', 'Gaia-Data', 'Precursor-Maps', 'Ancient-History', 'Creation-Myths', 'Legacy-Key-Codes'],
  'Dark Tech': ['Forbidden-Knowledge', 'Illegal-Weapons', 'Contraband-Schematics', 'Black-Market-Tech', 'Shadow-Protocols', 'Deniable-Operations'],
  'Galactic Standard': ['Common-Weapons', 'Standard-Shields', 'Universal-Protocols', 'Interstellar-Comms', 'Trade-Regulations', 'Safety-Standards'],
  'Military Doctrine': ['Fleet-Tactics', 'Ground-Warfare', 'Siege-Operations', 'Defense-Strategies', 'Boarding-Protocols', 'Evacuation-Procedures'],
  'Civil Engineering': ['Habitat-Construction', 'Life-Support-Systems', 'Gravity-Plating', 'Atmosphere-Processing', 'Waste-Recycling', 'Power-Distribution'],
  'Bioscience Division': ['Genetic-Sequencing', 'Medical-Research', 'Cloning-Technology', 'Bio-Weapons', 'Pharmaceuticals', 'Augmentation-Studies'],
  'Material Science': ['Alloy-Composition', 'Composite-Structures', 'Crystal-Growth', 'Superconductor-Design', 'Metamaterial-Physics', 'Density-Minimization'],
  'Energy Commission': ['Grid-Management', 'Fusion-Containment', 'Antimatter-Storage', 'Zero-Point-Harness', 'Energy-Distribution', 'Safety-Protocols'],
  'Propulsion Authority': ['Engine-Design', 'Fuel-Refinement', 'Gravity-Propulsion', 'Warp-Calculation', 'Navigation-Systems', 'FTL-Safety'],
  'Intelligence Division': ['Spy-Drone-Network', 'Communications-Intercept', 'Infiltration-Tactics', 'Counter-Intel-Protocols', 'Code-Cracking', 'Data-Mining'],
  'Cyber Division': ['Firewall-Systems', 'Intrusion-Detection', 'AI-Integration', 'Cyborg-Protocols', 'Network-Defense', 'Hack-Countermeasures'],
  'Exotic Research': ['Dimensional-Physics', 'Temporal-Tech', 'Psionic-Studies', 'Reality-Manipulation', 'Hyperspace-Anomalies', 'Cosmic-Radiation'],
  'Ascension Studies': ['Transcendence-Path', 'Consciousness-Evolution', 'Energy-Being-Research', 'Godhood-Protocols', 'Immortality-Serum', 'Universe-Bending'],
};

// ─────────────────────────────────────────────────────────────────────
// SECTION 6: RESEARCH FIELDS / SPECIALIZATIONS (15+ groups)
// ─────────────────────────────────────────────────────────────────────

export const RESEARCH_FIELDS = {
  EnergyWeapons: 'Energy Weapons',
  KineticWeapons: 'Kinetic Weapons',
  ExplosiveOrdnance: 'Explosive Ordnance',
  ShieldSystems: 'Shield Systems',
  HullArmor: 'Hull Armor',
  PassiveDefense: 'Passive Defense',
  CombatMobility: 'Combat Mobility',
  StrategicMobility: 'Strategic Mobility',
  PowerGeneration: 'Power Generation',
  EnergyEfficiency: 'Energy Efficiency',
  ResourceExtraction: 'Resource Extraction',
  IndustrialOutput: 'Industrial Output',
  InformationWarfare: 'Information Warfare',
  CovertOps: 'Covert Ops',
  CyberWarfare: 'Cyber Warfare',
  AdvancedPhysics: 'Advanced Physics',
  MaterialScienceField: 'Material Science',
  BiologicalScience: 'Biological Science',
  ArtificialIntelligenceField: 'Artificial Intelligence',
  ExoticScience: 'Exotic Science',
} as const;

export type ResearchField = (typeof RESEARCH_FIELDS)[keyof typeof RESEARCH_FIELDS];

export const RESEARCH_FIELD_SPECIALIZATIONS: Record<ResearchField, string[]> = {
  'Energy Weapons': ['Laser-Specialization', 'Plasma-Specialization', 'Particle-Beam-Specialization', 'Phaser-Specialization', 'Ion-Specialization'],
  'Kinetic Weapons': ['Railgun-Specialization', 'Gauss-Specialization', 'Mass-Drivers', 'Coilgun-Specialization', 'Hybrid-Specialization'],
  'Explosive Ordnance': ['Missile-Specialization', 'Torpedo-Specialization', 'Bomber-Specialization', 'Nuclear-Warhead', 'Antimatter-Warhead'],
  'Shield Systems': ['Standard-Shield-Specialization', 'Adaptive-Shield-Specialization', 'Quantum-Shield-Specialization', 'Reactive-Shield-Specialization', 'Multi-Layer-Specialization'],
  'Hull Armor': ['Composite-Armor-Specialization', 'Reactive-Armor-Specialization', 'Ablative-Armor-Specialization', 'Heavy-Plate-Specialization', 'Nanite-Armor-Specialization'],
  'Passive Defense': ['Structural-Integrity', 'Damage-Control', 'Redundancy-Systems', 'Auto-Repair', 'Emergency-Protocols'],
  'Combat Mobility': ['Maneuver-Thrusters', 'Combat-Drive', 'Quick-Turn', 'Emergency-Acceleration', 'Combat-Sliding'],
  'Strategic Mobility': ['Jump-Drive', 'Warp-Drive', 'Hyperspace-Lanes', 'Mass-Relay-Tech', 'Wormhole-Navigation'],
  'Power Generation': ['Fusion-Reactor', 'Antimatter-Reactor', 'Zero-Point-Core', 'Quantum-Energy', 'Dimensional-Tap'],
  'Energy Efficiency': ['Low-Power-Mode', 'Energy-Recycling', 'Heat-Recovery', 'Passive-Generation', 'Superconducting-Circuits'],
  'Resource Extraction': ['Mining-Efficiency', 'Refining-Efficiency', 'Deep-Core-Drill', 'Gas-Giant-Scoop', 'Asteroid-Tug'],
  'Industrial Output': ['Factory-Automation', 'Assembly-Line-Speed', 'Nano-Construction', 'Orbital-Foundry', 'Shipyard-Efficiency'],
  'Information Warfare': ['Encryption-Mastery', 'Decryption-Protocols', 'Data-Mining', 'False-Intel-Generation', 'Network-Infiltration'],
  'Covert Ops': ['Stealth-Field-Generator', 'Identity-Forgery', 'Agent-Network', 'Safe-Houses', 'Exfiltration-Protocols'],
  'Cyber Warfare': ['AI-Hacking', 'System-Sabotage', 'Turret-Takeover', 'Network-Exploit', 'Shield-Deactivation'],
  'Advanced Physics': ['String-Theory', 'Quantum-Mechanics', 'Grand-Unification', 'Multiversal-Physics', 'Metaphysical-Studies'],
  'Material Science': ['Alloy-Development', 'Composite-Engineering', 'Crystal-Growth-Tech', 'Superconductor-Physics', 'Metamaterial-Design'],
  'Biological Science': ['Genetic-Engineering', 'Medical-Nanotech', 'Stem-Cell-Research', 'Bio-Augmentation', 'Cloning-Ethics'],
  'Artificial Intelligence': ['Machine-Learning', 'Neural-Net-Architecture', 'Consciousness-Simulation', 'AI-Safety-Protocols', 'Emulation-Cores'],
  'Exotic Science': ['Dimensional-Physics', 'Temporal-Mechanics', 'Psychic-Research', 'Dark-Matter-Studies', 'Reality-Theory'],
};

// ─────────────────────────────────────────────────────────────────────
// SECTION 7: TECH RANK / RARITY CLASSIFICATION
// ─────────────────────────────────────────────────────────────────────

export const TECH_TIERS = {
  Primitive: 'Primitive',
  EarlyIndustrial: 'Early Industrial',
  Industrial: 'Industrial',
  Atomic: 'Atomic',
  Information: 'Information',
  Fusion: 'Fusion',
  Antimatter: 'Antimatter',
  Quantum: 'Quantum',
  Transcendent: 'Transcendent',
  Ascended: 'Ascended',
} as const;

export type TechTier = (typeof TECH_TIERS)[keyof typeof TECH_TIERS];

export const TECH_TIER_COLORS: Record<TechTier, string> = {
  Primitive: '#9CA3AF',
  'Early Industrial': '#A3E635',
  Industrial: '#F59E0B',
  Atomic: '#EF4444',
  Information: '#3B82F6',
  Fusion: '#8B5CF6',
  Antimatter: '#EC4899',
  Quantum: '#14B8A6',
  Transcendent: '#F97316',
  Ascended: '#FFD700',
};

export const TECH_RARITY = {
  Common: 'Common',
  Uncommon: 'Uncommon',
  Rare: 'Rare',
  Epic: 'Epic',
  Legendary: 'Legendary',
  Mythic: 'Mythic',
  Cosmic: 'Cosmic',
  Universal: 'Universal',
  Divine: 'Divine',
  TranscendentRarity: 'Transcendent',
} as const;

export type TechRarity = (typeof TECH_RARITY)[keyof typeof TECH_RARITY];

export const TECH_RARITY_COLORS: Record<TechRarity, string> = {
  Common: '#9CA3AF',
  Uncommon: '#10B981',
  Rare: '#3B82F6',
  Epic: '#8B5CF6',
  Legendary: '#F59E0B',
  Mythic: '#EF4444',
  Cosmic: '#EC4899',
  Universal: '#F97316',
  Divine: '#FFD700',
  Transcendent: '#FFFFFF',
};

// ─────────────────────────────────────────────────────────────────────
// SECTION 8: TECH EFFECT CATEGORIES
// ─────────────────────────────────────────────────────────────────────

export const TECH_EFFECT_TYPES = {
  Passive: 'Passive',
  Active: 'Active',
  Toggle: 'Toggle',
  Unlock: 'Unlock',
  Enhancement: 'Enhancement',
  Special: 'Special',
} as const;

export type TechEffectType = (typeof TECH_EFFECT_TYPES)[keyof typeof TECH_EFFECT_TYPES];

export const TECH_EFFECT_SUB_TYPES: Record<TechEffectType, string[]> = {
  Passive: ['Flat-Bonus', 'Percentage-Bonus', 'Scaling-Bonus', 'Threshold-Bonus', 'Stacking-Bonus'],
  Active: ['Directed-Ability', 'Self-Buff', 'Area-Effect', 'Debuff', 'Summon'],
  Toggle: ['Mode-Switch', 'Resource-Conversion', 'State-Change', 'Allocation-Shift', 'Aura-Toggle'],
  Unlock: ['Building-Unlock', 'Ship-Unlock', 'Weapon-Unlock', 'Ability-Unlock', 'Module-Unlock', 'Upgrade-Path'],
  Enhancement: ['Stat-Increase', 'Efficiency-Gain', 'Speed-Boost', 'Capacity-Raise', 'Resistance-Grant'],
  Special: ['Unique-Effect', 'Cascading', 'Transformative', 'Reality-Warp', 'Time-Altering'],
};

// ─────────────────────────────────────────────────────────────────────
// SECTION 9: AGGREGATION HELPERS
// ─────────────────────────────────────────────────────────────────────

export const ALL_RESEARCH_CLASSIFICATIONS = {
  domains: {
    classes: Object.keys(RESEARCH_DOMAIN_SUB_CLASSES) as ResearchDomain[],
  },
  techTrees: {
    classes: Object.keys(TECH_TREE_SUB_TREES) as TechTree[],
  },
  categories: {
    classes: Object.keys(TECHNOLOGY_SUB_CATEGORIES) as TechnologyCategory[],
  },
  types: {
    classes: Object.keys(TECHNOLOGY_SUB_TYPES) as TechnologyType[],
  },
  libraries: {
    classes: Object.keys(TECH_LIBRARY_SUB_FIELDS) as TechLibrary[],
  },
  fields: {
    classes: Object.keys(RESEARCH_FIELD_SPECIALIZATIONS) as ResearchField[],
  },
  tiers: {
    classes: Object.keys(TECH_TIER_COLORS) as TechTier[],
  },
  rarities: {
    classes: Object.keys(TECH_RARITY_COLORS) as TechRarity[],
  },
  effectTypes: {
    classes: Object.keys(TECH_EFFECT_SUB_TYPES) as TechEffectType[],
  },
};

export const RESEARCH_CLASSIFICATION_COUNTS = {
  domains: Object.keys(RESEARCH_DOMAINS).length,
  techTrees: Object.keys(TECH_TREES).length,
  categories: Object.keys(TECHNOLOGY_CATEGORIES).length,
  types: Object.keys(TECHNOLOGY_TYPES).length,
  libraries: Object.keys(TECH_LIBRARIES).length,
  fields: Object.keys(RESEARCH_FIELDS).length,
  tiers: Object.keys(TECH_TIERS).length,
  rarities: Object.keys(TECH_RARITY).length,
  effectTypes: Object.keys(TECH_EFFECT_TYPES).length,
};

// ─── Lookup Helpers ────────────────────────────────────────────────

export function getResearchDomainSubClasses(domain: ResearchDomain): string[] {
  return RESEARCH_DOMAIN_SUB_CLASSES[domain] ?? [];
}

export function getTechTreeSubTrees(tree: TechTree): string[] {
  return TECH_TREE_SUB_TREES[tree] ?? [];
}

export function getTechnologySubCategories(cat: TechnologyCategory): string[] {
  return TECHNOLOGY_SUB_CATEGORIES[cat] ?? [];
}

export function getTechnologySubTypes(type: TechnologyType): string[] {
  return TECHNOLOGY_SUB_TYPES[type] ?? [];
}

export function getTechLibrarySubFields(lib: TechLibrary): string[] {
  return TECH_LIBRARY_SUB_FIELDS[lib] ?? [];
}

export function getResearchFieldSpecializations(field: ResearchField): string[] {
  return RESEARCH_FIELD_SPECIALIZATIONS[field] ?? [];
}

export function getTechEffectSubTypes(type: TechEffectType): string[] {
  return TECH_EFFECT_SUB_TYPES[type] ?? [];
}

// ─── Classification Path ───────────────────────────────────────────

export interface ResearchClassificationPath {
  domain: string;
  domainSubClass: string;
  techTree: string;
  techTreeSub: string;
  category: string;
  subCategory: string;
  type: string;
  subType: string;
  library: string;
  librarySubField: string;
  field: string;
  fieldSpecialization: string;
  tier: TechTier;
  rarity: TechRarity;
}

// ─── Translation Maps ──────────────────────────────────────────────

// Map tech tree to primary domain
export const TECH_TREE_TO_DOMAIN: Partial<Record<TechTree, ResearchDomain>> = {
  'Laser Technology': 'Weapons',
  'Plasma Technology': 'Weapons',
  'Ion Technology': 'Weapons',
  'Graviton Technology': 'Weapons',
  'Quantum Weapons': 'Weapons',
  'Antimatter Weapons': 'Weapons',
  'Shielding': 'Defense',
  'Armor': 'Defense',
  'Energy Shields': 'Defense',
  'Countermeasures': 'Defense',
  'Impulse Drive': 'Propulsion',
  'Hyperspace Drive': 'Propulsion',
  'Warp Drive': 'Propulsion',
  'Wormhole Technology': 'Propulsion',
  'Transwarp': 'Propulsion',
  'Fusion Power': 'Energy',
  'Antimatter Power': 'Energy',
  'Zero-Point Energy': 'Energy',
  'Mining Efficiency': 'Production',
  'Manufacturing': 'Production',
  'Nanite Assembly': 'Nanotechnology',
  'Construction': 'Production',
  'Resource Processing': 'Production',
  'Trade Technology': 'Economy',
  'Finance Technology': 'Economy',
  'Espionage Technology': 'Espionage',
  'Communication': 'Computing',
  'Computer Technology': 'Computing',
  'Artificial Intelligence': 'Computing',
  'Cybernetics': 'Computing',
  'Nanotechnology': 'Nanotechnology',
  'Biotechnology': 'Xenotech',
  'Psychic Technology': 'Xenotech',
  'Precursor Technology': 'Xenotech',
  'Dimensional Technology': 'Quantum',
  'Temporal Technology': 'Cosmic',
};

// Map category to primary domain
export const TECH_CATEGORY_TO_DOMAIN: Record<TechnologyCategory, ResearchDomain> = {
  'Directed Energy': 'Weapons',
  'Ballistic': 'Weapons',
  'Missile': 'Weapons',
  'Explosive': 'Weapons',
  'Electronic Warfare': 'Espionage',
  'Structural': 'Defense',
  'FTL': 'Propulsion',
  'Sublight Propulsion': 'Propulsion',
  'Power Systems': 'Energy',
  'Resource Technology': 'Production',
  'Economic Technology': 'Economy',
  'Intelligence Technology': 'Espionage',
  'Computing Technology': 'Computing',
  'Manufacturing Technology': 'Production',
  'Materials': 'Nanotechnology',
  'Biological': 'Xenotech',
  'Psionic': 'Xenotech',
  'Dimensional': 'Quantum',
  'Temporal': 'Cosmic',
  'Precursor': 'Xenotech',
  'Cosmic Forces': 'Cosmic',
};

// ─── Default Research Tree for quick seed ──────────────────────────

export function getDefaultResearchTree(): {
  [key in TechTree]?: number;
} {
  return {
    'Laser Technology': 1,
    'Shielding': 1,
    'Impulse Drive': 1,
    'Fusion Power': 1,
    'Mining Efficiency': 1,
    'Computer Technology': 1,
    'Espionage Technology': 1,
  };
}
