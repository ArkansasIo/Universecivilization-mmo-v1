import { Item, ItemType, Rank, Rarity, Quality } from '../types/gameTypes';

export const items: Item[] = [
  // Weapons
  {
    id: 'basic-laser',
    name: 'Basic Laser Cannon',
    description: 'A standard-issue energy weapon found on most civilian and light military vessels. Reliable but unremarkable.',
    lore: 'The Basic Laser Cannon has been the workhorse of space combat for centuries. While newer technologies have emerged, its simplicity, reliability, and low maintenance costs ensure it remains in widespread use across the galaxy.',
    type: 'Weapon' as ItemType,
    rank: 'E' as Rank,
    rarity: 'Common' as Rarity,
    quality: 'Normal' as Quality,
    tier: 1,
    level: 1,
    maxLevel: 50,
    baseStats: {
      attack: 20,
      criticalChance: 5,
      accuracy: 80
    },
    bonuses: {
      attackBonus: 5,
      energyEfficiency: 10
    },
    cost: {
      metal: 500,
      crystal: 200,
      credits: 2000
    },
    requirements: {
      level: 1,
      technologies: ['laser_technology_1'],
      shipClass: ['Fighter', 'Interceptor', 'Corvette']
    },
    specialEffect: 'Basic energy damage with no special properties',
    flavorText: 'Simple, effective, and everywhere.'
  },
  {
    id: 'plasma-cannon',
    name: 'Plasma Cannon',
    description: 'An advanced energy weapon that fires superheated plasma bolts. Deals significant damage with a chance to burn through armor.',
    lore: 'Developed during the Plasma Wars, these weapons revolutionized combat by introducing armor-melting capabilities. The distinctive blue-white plasma bolts have become synonymous with serious military power.',
    type: 'Weapon' as ItemType,
    rank: 'D' as Rank,
    rarity: 'Uncommon' as Rarity,
    quality: 'Superior' as Quality,
    tier: 2,
    level: 1,
    maxLevel: 60,
    baseStats: {
      attack: 50,
      criticalChance: 8,
      accuracy: 82,
      penetration: 15
    },
    bonuses: {
      attackBonus: 12,
      armorPenetration: 15,
      burnChance: 10
    },
    cost: {
      metal: 1500,
      crystal: 800,
      deuterium: 300,
      credits: 8000
    },
    requirements: {
      level: 10,
      technologies: ['plasma_technology_2'],
      shipClass: ['Interceptor', 'Bomber', 'Corvette', 'Frigate']
    },
    specialEffect: '10% chance to apply burning effect, dealing damage over time',
    flavorText: 'Watch it melt through their defenses.'
  },
  {
    id: 'ion-disruptor',
    name: 'Ion Disruptor',
    description: 'A sophisticated weapon that disrupts enemy shields and electronic systems. Particularly effective against shielded targets.',
    lore: 'Ion technology was originally developed for mining operations but was quickly weaponized. The Ion Disruptor can disable entire ship systems, making it a favorite among pirates and special forces.',
    type: 'Weapon' as ItemType,
    rank: 'C' as Rank,
    rarity: 'Rare' as Rarity,
    quality: 'Excellent' as Quality,
    tier: 3,
    level: 1,
    maxLevel: 70,
    baseStats: {
      attack: 80,
      criticalChance: 12,
      accuracy: 85,
      shieldPenetration: 25
    },
    bonuses: {
      attackBonus: 18,
      shieldDamage: 30,
      systemDisruptChance: 15
    },
    cost: {
      metal: 3500,
      crystal: 2500,
      deuterium: 1000,
      credits: 25000
    },
    requirements: {
      level: 25,
      technologies: ['ion_technology_3'],
      shipClass: ['Corvette', 'Frigate', 'Destroyer']
    },
    specialEffect: '15% chance to disable enemy systems for 5 seconds, +30% damage to shields',
    flavorText: 'Their shields won\'t save them.'
  },
  {
    id: 'graviton-beam',
    name: 'Graviton Beam Projector',
    description: 'An exotic weapon that manipulates gravitational forces to crush enemy vessels. Ignores conventional defenses.',
    lore: 'Graviton technology represents a leap forward in weapons science. By manipulating gravity itself, these weapons can tear ships apart from the inside, making armor and shields largely irrelevant.',
    type: 'Weapon' as ItemType,
    rank: 'B' as Rank,
    rarity: 'Epic' as Rarity,
    quality: 'Masterwork' as Quality,
    tier: 4,
    level: 1,
    maxLevel: 85,
    baseStats: {
      attack: 150,
      criticalChance: 18,
      accuracy: 88,
      penetration: 40,
      shieldPenetration: 40
    },
    bonuses: {
      attackBonus: 30,
      ignoreArmor: 35,
      ignoreShields: 35,
      slowEffect: 20
    },
    cost: {
      metal: 8000,
      crystal: 6000,
      deuterium: 3000,
      credits: 75000
    },
    requirements: {
      level: 45,
      technologies: ['graviton_technology_2'],
      shipClass: ['Frigate', 'Destroyer', 'Cruiser', 'Battlecruiser']
    },
    specialEffect: 'Ignores 35% of armor and shields, 20% chance to slow enemy by 30%',
    flavorText: 'Gravity is the ultimate weapon.'
  },
  {
    id: 'quantum-lance',
    name: 'Quantum Lance',
    description: 'A legendary weapon that fires quantum-entangled particles, dealing massive damage that cannot be blocked or evaded.',
    lore: 'The Quantum Lance is the result of centuries of research into quantum mechanics. Its projectiles exist in multiple states simultaneously, making them impossible to defend against through conventional means.',
    type: 'Weapon' as ItemType,
    rank: 'A' as Rank,
    rarity: 'Legendary' as Rarity,
    quality: 'Perfect' as Quality,
    tier: 5,
    level: 1,
    maxLevel: 100,
    baseStats: {
      attack: 300,
      criticalChance: 25,
      accuracy: 95,
      penetration: 60,
      shieldPenetration: 60
    },
    bonuses: {
      attackBonus: 50,
      guaranteedDamage: 40,
      criticalDamage: 50,
      quantumEffect: 25
    },
    cost: {
      metal: 20000,
      crystal: 15000,
      deuterium: 8000,
      credits: 250000
    },
    requirements: {
      level: 70,
      technologies: ['quantum_weapons_3'],
      shipClass: ['Cruiser', 'Battlecruiser', 'Battleship', 'Dreadnought']
    },
    specialEffect: '40% of damage cannot be reduced, 25% chance to deal double damage',
    flavorText: 'Strike from all possible futures simultaneously.'
  },
  {
    id: 'reality-ripper',
    name: 'Reality Ripper',
    description: 'A mythical weapon that tears holes in the fabric of reality itself. Deals catastrophic damage and can erase targets from existence.',
    lore: 'Legends speak of ancient civilizations that could manipulate reality. The Reality Ripper is believed to be reverse-engineered from their technology. It doesn\'t just destroy ships—it unmakes them.',
    type: 'Weapon' as ItemType,
    rank: 'S' as Rank,
    rarity: 'Mythic' as Rarity,
    quality: 'Divine' as Quality,
    tier: 6,
    level: 1,
    maxLevel: 120,
    baseStats: {
      attack: 600,
      criticalChance: 35,
      accuracy: 98,
      penetration: 80,
      shieldPenetration: 80
    },
    bonuses: {
      attackBonus: 100,
      guaranteedDamage: 60,
      criticalDamage: 100,
      realityDamage: 50,
      existenceErasure: 10
    },
    cost: {
      metal: 50000,
      crystal: 40000,
      deuterium: 25000,
      credits: 1000000
    },
    requirements: {
      level: 100,
      technologies: ['reality_bending_3'],
      shipClass: ['Battleship', 'Dreadnought', 'Titan', 'Mothership']
    },
    specialEffect: '60% damage cannot be reduced, 10% chance to instantly destroy target',
    flavorText: 'Erase them from existence.'
  },
  {
    id: 'cosmic-annihilator',
    name: 'Cosmic Annihilator',
    description: 'A cosmic-tier weapon that channels the power of dying stars. Each shot can obliterate entire fleets.',
    lore: 'Forged in the heart of a supernova and powered by antimatter, the Cosmic Annihilator represents the pinnacle of destructive technology. Only the most powerful vessels can withstand the energy requirements.',
    type: 'Weapon' as ItemType,
    rank: 'SS' as Rank,
    rarity: 'Cosmic' as Rarity,
    quality: 'Divine' as Quality,
    tier: 7,
    level: 1,
    maxLevel: 140,
    baseStats: {
      attack: 1500,
      criticalChance: 45,
      accuracy: 99,
      penetration: 90,
      shieldPenetration: 90
    },
    bonuses: {
      attackBonus: 200,
      guaranteedDamage: 80,
      criticalDamage: 200,
      areaDamage: 100,
      cosmicPower: 75
    },
    cost: {
      metal: 150000,
      crystal: 120000,
      deuterium: 80000,
      credits: 5000000
    },
    requirements: {
      level: 125,
      technologies: ['cosmic_energy_3'],
      shipClass: ['Dreadnought', 'Titan', 'Mothership']
    },
    specialEffect: '80% damage cannot be reduced, deals 100% splash damage to nearby enemies',
    flavorText: 'Harness the power of dying stars.'
  },
  {
    id: 'eternal-devastator',
    name: 'Eternal Devastator',
    description: 'The ultimate weapon—a universal-tier armament that transcends the laws of physics. Can destroy anything, anywhere, anytime.',
    lore: 'The Eternal Devastator is said to be a gift from beings that exist beyond our universe. It operates on principles that defy comprehension, capable of striking targets across dimensions and timelines. Possession of even one makes you a galactic superpower.',
    type: 'Weapon' as ItemType,
    rank: 'SSS' as Rank,
    rarity: 'Universal' as Rarity,
    quality: 'Divine' as Quality,
    tier: 8,
    level: 1,
    maxLevel: 150,
    baseStats: {
      attack: 5000,
      criticalChance: 60,
      accuracy: 100,
      penetration: 100,
      shieldPenetration: 100
    },
    bonuses: {
      attackBonus: 500,
      guaranteedDamage: 100,
      criticalDamage: 500,
      areaDamage: 200,
      universalPower: 100,
      dimensionalStrike: 50
    },
    cost: {
      metal: 500000,
      crystal: 400000,
      deuterium: 300000,
      credits: 25000000
    },
    requirements: {
      level: 150,
      technologies: ['universal_mastery_1', 'eternal_power_1'],
      shipClass: ['Mothership', 'Flagship']
    },
    specialEffect: 'All damage guaranteed, deals 200% splash damage, 50% chance to strike across dimensions',
    flavorText: 'The end of all things.'
  },

  // Armor
  {
    id: 'basic-hull',
    name: 'Basic Hull Plating',
    description: 'Standard reinforced hull plating that provides basic protection against kinetic and energy weapons.',
    lore: 'Every ship needs armor, and Basic Hull Plating has protected countless vessels since the dawn of space travel. While not glamorous, it gets the job done.',
    type: 'Armor' as ItemType,
    rank: 'E' as Rank,
    rarity: 'Common' as Rarity,
    quality: 'Normal' as Quality,
    tier: 1,
    level: 1,
    maxLevel: 50,
    baseStats: {
      defense: 20,
      health: 200,
      armor: 10
    },
    bonuses: {
      defenseBonus: 5,
      damageReduction: 5
    },
    cost: {
      metal: 800,
      crystal: 100,
      credits: 1500
    },
    requirements: {
      level: 1,
      technologies: ['armor_technology_1'],
      shipClass: ['Fighter', 'Interceptor', 'Corvette']
    },
    specialEffect: 'Reduces incoming damage by 5%',
    flavorText: 'Better than nothing.'
  },
  {
    id: 'composite-armor',
    name: 'Composite Armor',
    description: 'Advanced multi-layered armor combining various materials for superior protection and weight distribution.',
    lore: 'Composite Armor was developed to address the limitations of single-material plating. By layering different materials, engineers created armor that\'s both lighter and stronger.',
    type: 'Armor' as ItemType,
    rank: 'D' as Rank,
    rarity: 'Uncommon' as Rarity,
    quality: 'Superior' as Quality,
    tier: 2,
    level: 1,
    maxLevel: 60,
    baseStats: {
      defense: 45,
      health: 500,
      armor: 25
    },
    bonuses: {
      defenseBonus: 12,
      damageReduction: 10,
      speedPenaltyReduction: 5
    },
    cost: {
      metal: 2000,
      crystal: 500,
      credits: 6000
    },
    requirements: {
      level: 10,
      technologies: ['armor_technology_2'],
      shipClass: ['Interceptor', 'Bomber', 'Corvette', 'Frigate']
    },
    specialEffect: 'Reduces incoming damage by 10%, -5% speed penalty from armor',
    flavorText: 'Layers of protection.'
  },
  {
    id: 'reactive-plating',
    name: 'Reactive Armor Plating',
    description: 'Intelligent armor that adapts to incoming damage types, providing enhanced protection against repeated attacks.',
    lore: 'Reactive Armor uses advanced sensors and nano-materials to detect and counter incoming threats. It literally learns from each hit, becoming more effective over time.',
    type: 'Armor' as ItemType,
    rank: 'C' as Rank,
    rarity: 'Rare' as Rarity,
    quality: 'Excellent' as Quality,
    tier: 3,
    level: 1,
    maxLevel: 70,
    baseStats: {
      defense: 80,
      health: 1000,
      armor: 45
    },
    bonuses: {
      defenseBonus: 20,
      damageReduction: 15,
      adaptiveResistance: 10,
      regeneration: 2
    },
    cost: {
      metal: 5000,
      crystal: 2000,
      deuterium: 500,
      credits: 20000
    },
    requirements: {
      level: 25,
      technologies: ['armor_technology_3', 'nanite_technology_1'],
      shipClass: ['Corvette', 'Frigate', 'Destroyer']
    },
    specialEffect: 'Reduces damage by 15%, gains +2% resistance per hit (max 20%), regenerates 2 armor/sec',
    flavorText: 'Adapts to survive.'
  },
  {
    id: 'neutronium-armor',
    name: 'Neutronium Armor',
    description: 'Incredibly dense armor forged from neutron star material. Nearly impenetrable but extremely heavy.',
    lore: 'Harvesting material from neutron stars is one of the most dangerous operations in the galaxy. The resulting armor is worth the risk—it can withstand hits that would vaporize lesser vessels.',
    type: 'Armor' as ItemType,
    rank: 'B' as Rank,
    rarity: 'Epic' as Rarity,
    quality: 'Masterwork' as Quality,
    tier: 4,
    level: 1,
    maxLevel: 85,
    baseStats: {
      defense: 150,
      health: 2500,
      armor: 80
    },
    bonuses: {
      defenseBonus: 35,
      damageReduction: 25,
      criticalDamageReduction: 30,
      massIncrease: 15
    },
    cost: {
      metal: 12000,
      crystal: 5000,
      deuterium: 2000,
      credits: 60000
    },
    requirements: {
      level: 45,
      technologies: ['armor_technology_4', 'exotic_materials_2'],
      shipClass: ['Frigate', 'Destroyer', 'Cruiser', 'Battlecruiser']
    },
    specialEffect: 'Reduces all damage by 25%, reduces critical damage by 30%, -10% speed',
    flavorText: 'Forged from collapsed stars.'
  },
  {
    id: 'quantum-plating',
    name: 'Quantum Phase Armor',
    description: 'Revolutionary armor that exists in multiple quantum states, making it extremely difficult to damage.',
    lore: 'Quantum Phase Armor doesn\'t just block attacks—it exists partially out of phase with normal space, causing many attacks to pass harmlessly through. The technology is barely understood even by its creators.',
    type: 'Armor' as ItemType,
    rank: 'A' as Rank,
    rarity: 'Legendary' as Rarity,
    quality: 'Perfect' as Quality,
    tier: 5,
    level: 1,
    maxLevel: 100,
    baseStats: {
      defense: 280,
      health: 5000,
      armor: 120,
      evasion: 15
    },
    bonuses: {
      defenseBonus: 60,
      damageReduction: 35,
      phaseChance: 25,
      quantumResistance: 40
    },
    cost: {
      metal: 30000,
      crystal: 20000,
      deuterium: 10000,
      credits: 200000
    },
    requirements: {
      level: 70,
      technologies: ['quantum_technology_3', 'phase_technology_2'],
      shipClass: ['Cruiser', 'Battlecruiser', 'Battleship', 'Dreadnought']
    },
    specialEffect: 'Reduces damage by 35%, 25% chance to phase out and avoid damage completely',
    flavorText: 'Here and not here.'
  },
  {
    id: 'dimensional-shell',
    name: 'Dimensional Shell',
    description: 'Mythical armor that anchors the ship across multiple dimensions, distributing damage across realities.',
    lore: 'The Dimensional Shell doesn\'t just protect—it spreads damage across parallel universes. When your ship takes a hit, countless alternate versions share the burden. The technology is considered borderline impossible.',
    type: 'Armor' as ItemType,
    rank: 'S' as Rank,
    rarity: 'Mythic' as Rarity,
    quality: 'Divine' as Quality,
    tier: 6,
    level: 1,
    maxLevel: 120,
    baseStats: {
      defense: 550,
      health: 12000,
      armor: 200,
      evasion: 20
    },
    bonuses: {
      defenseBonus: 120,
      damageReduction: 50,
      dimensionalShift: 35,
      damageDistribution: 40,
      regeneration: 5
    },
    cost: {
      metal: 80000,
      crystal: 60000,
      deuterium: 40000,
      credits: 800000
    },
    requirements: {
      level: 100,
      technologies: ['dimensional_technology_3'],
      shipClass: ['Battleship', 'Dreadnought', 'Titan', 'Mothership']
    },
    specialEffect: 'Reduces damage by 50%, distributes 40% of damage across dimensions, regenerates 5% health/sec',
    flavorText: 'Protected by infinite realities.'
  },
  {
    id: 'cosmic-carapace',
    name: 'Cosmic Carapace',
    description: 'Cosmic-tier armor woven from the fabric of space-time itself. Nearly indestructible and self-repairing.',
    lore: 'The Cosmic Carapace is grown rather than built, using techniques that manipulate space-time at the quantum level. It\'s said to be alive in some sense, adapting and evolving to counter threats.',
    type: 'Armor' as ItemType,
    rank: 'SS' as Rank,
    rarity: 'Cosmic' as Rarity,
    quality: 'Divine' as Quality,
    tier: 7,
    level: 1,
    maxLevel: 140,
    baseStats: {
      defense: 1200,
      health: 30000,
      armor: 400,
      evasion: 25
    },
    bonuses: {
      defenseBonus: 250,
      damageReduction: 65,
      cosmicResistance: 60,
      selfRepair: 10,
      damageReflection: 25
    },
    cost: {
      metal: 200000,
      crystal: 150000,
      deuterium: 100000,
      credits: 4000000
    },
    requirements: {
      level: 125,
      technologies: ['cosmic_engineering_3'],
      shipClass: ['Dreadnought', 'Titan', 'Mothership']
    },
    specialEffect: 'Reduces damage by 65%, regenerates 10% health/sec, reflects 25% damage',
    flavorText: 'Woven from reality itself.'
  },
  {
    id: 'eternal-fortress',
    name: 'Eternal Fortress',
    description: 'The ultimate defensive system—universal-tier armor that makes the wearer virtually immortal. Cannot be destroyed by conventional means.',
    lore: 'The Eternal Fortress is less armor and more a fundamental alteration of reality around the ship. It doesn\'t just resist damage—it denies the very concept of destruction. Ships equipped with it have survived direct hits from supernovas.',
    type: 'Armor' as ItemType,
    rank: 'SSS' as Rank,
    rarity: 'Universal' as Rarity,
    quality: 'Divine' as Quality,
    tier: 8,
    level: 1,
    maxLevel: 150,
    baseStats: {
      defense: 3000,
      health: 100000,
      armor: 1000,
      evasion: 30
    },
    bonuses: {
      defenseBonus: 600,
      damageReduction: 80,
      universalResistance: 90,
      selfRepair: 20,
      damageReflection: 50,
      immortality: 1
    },
    cost: {
      metal: 600000,
      crystal: 500000,
      deuterium: 400000,
      credits: 20000000
    },
    requirements: {
      level: 150,
      technologies: ['universal_mastery_1', 'eternal_power_1'],
      shipClass: ['Mothership', 'Flagship']
    },
    specialEffect: 'Reduces damage by 80%, regenerates 20% health/sec, reflects 50% damage, prevents death once per battle',
    flavorText: 'Immortality made manifest.'
  },

  // Shields
  {
    id: 'basic-shield',
    name: 'Basic Energy Shield',
    description: 'A standard deflector shield that provides basic protection against energy weapons and debris.',
    lore: 'The invention of energy shields revolutionized space combat. Even basic models can mean the difference between life and death in the void.',
    type: 'Shield' as ItemType,
    rank: 'E' as Rank,
    rarity: 'Common' as Rarity,
    quality: 'Normal' as Quality,
    tier: 1,
    level: 1,
    maxLevel: 50,
    baseStats: {
      defense: 15,
      shieldStrength: 150,
      shieldRegeneration: 2
    },
    bonuses: {
      shieldBonus: 10,
      energyResistance: 10
    },
    cost: {
      crystal: 600,
      deuterium: 200,
      credits: 2500
    },
    requirements: {
      level: 1,
      technologies: ['shielding_technology_1'],
      shipClass: ['Fighter', 'Interceptor', 'Corvette']
    },
    specialEffect: 'Regenerates 2 shield points per second, +10% energy damage resistance',
    flavorText: 'Your first line of defense.'
  },
  {
    id: 'deflector-shield',
    name: 'Deflector Shield Array',
    description: 'An improved shield system that deflects incoming projectiles and absorbs energy attacks more efficiently.',
    lore: 'Deflector technology improved upon basic shields by adding directional emitters that can focus protection where it\'s needed most.',
    type: 'Shield' as ItemType,
    rank: 'D' as Rank,
    rarity: 'Uncommon' as Rarity,
    quality: 'Superior' as Quality,
    tier: 2,
    level: 1,
    maxLevel: 60,
    baseStats: {
      defense: 35,
      shieldStrength: 400,
      shieldRegeneration: 5
    },
    bonuses: {
      shieldBonus: 20,
      energyResistance: 15,
      kineticResistance: 10
    },
    cost: {
      crystal: 1500,
      deuterium: 600,
      credits: 7000
    },
    requirements: {
      level: 10,
      technologies: ['shielding_technology_2'],
      shipClass: ['Interceptor', 'Bomber', 'Corvette', 'Frigate']
    },
    specialEffect: 'Regenerates 5 shield/sec, +15% energy resistance, +10% kinetic resistance',
    flavorText: 'Deflect and protect.'
  },
  {
    id: 'adaptive-shield',
    name: 'Adaptive Shield Matrix',
    description: 'An intelligent shield system that adapts to incoming damage types, providing enhanced protection against repeated attacks.',
    lore: 'Adaptive Shields use AI to analyze incoming fire and adjust their frequency to provide optimal protection. They learn from every hit.',
    type: 'Shield' as ItemType,
    rank: 'C' as Rank,
    rarity: 'Rare' as Rarity,
    quality: 'Excellent' as Quality,
    tier: 3,
    level: 1,
    maxLevel: 70,
    baseStats: {
      defense: 65,
      shieldStrength: 900,
      shieldRegeneration: 10
    },
    bonuses: {
      shieldBonus: 35,
      adaptiveResistance: 20,
      fastRecharge: 15
    },
    cost: {
      crystal: 4000,
      deuterium: 2000,
      credits: 18000
    },
    requirements: {
      level: 25,
      technologies: ['shielding_technology_3', 'ai_systems_2'],
      shipClass: ['Corvette', 'Frigate', 'Destroyer']
    },
    specialEffect: 'Regenerates 10 shield/sec, gains +3% resistance per hit type (max 30%), +15% recharge rate',
    flavorText: 'Learns to protect.'
  },
  {
    id: 'graviton-shield',
    name: 'Graviton Shield Generator',
    description: 'An advanced shield that uses gravitational manipulation to deflect attacks. Particularly effective against physical projectiles.',
    lore: 'By creating localized gravity wells, Graviton Shields can bend the trajectory of incoming fire. Some attacks literally orbit the ship without ever hitting.',
    type: 'Shield' as ItemType,
    rank: 'B' as Rank,
    rarity: 'Epic' as Rarity,
    quality: 'Masterwork' as Quality,
    tier: 4,
    level: 1,
    maxLevel: 85,
    baseStats: {
      defense: 120,
      shieldStrength: 2000,
      shieldRegeneration: 20
    },
    bonuses: {
      shieldBonus: 60,
      kineticResistance: 40,
      projectileDeflection: 25,
      gravityWell: 15
    },
    cost: {
      crystal: 10000,
      deuterium: 6000,
      credits: 55000
    },
    requirements: {
      level: 45,
      technologies: ['graviton_technology_2', 'shielding_technology_4'],
      shipClass: ['Frigate', 'Destroyer', 'Cruiser', 'Battlecruiser']
    },
    specialEffect: 'Regenerates 20 shield/sec, +40% kinetic resistance, 25% chance to deflect projectiles',
    flavorText: 'Bend space, deflect death.'
  },
  {
    id: 'quantum-barrier',
    name: 'Quantum Barrier Field',
    description: 'A legendary shield that exists in quantum superposition, making it extremely difficult to penetrate.',
    lore: 'The Quantum Barrier doesn\'t just block attacks—it exists in multiple states simultaneously, forcing attackers to hit all possible states to penetrate it.',
    type: 'Shield' as ItemType,
    rank: 'A' as Rank,
    rarity: 'Legendary' as Rarity,
    quality: 'Perfect' as Quality,
    tier: 5,
    level: 1,
    maxLevel: 100,
    baseStats: {
      defense: 220,
      shieldStrength: 4500,
      shieldRegeneration: 40
    },
    bonuses: {
      shieldBonus: 110,
      quantumResistance: 50,
      phaseShift: 30,
      instantRecharge: 20
    },
    cost: {
      crystal: 25000,
      deuterium: 18000,
      credits: 180000
    },
    requirements: {
      level: 70,
      technologies: ['quantum_technology_3', 'shielding_technology_5'],
      shipClass: ['Cruiser', 'Battlecruiser', 'Battleship', 'Dreadnought']
    },
    specialEffect: 'Regenerates 40 shield/sec, 30% chance to phase and avoid damage, 20% instant recharge on break',
    flavorText: 'Uncertainty is your defense.'
  },
  {
    id: 'reality-shield',
    name: 'Reality Distortion Field',
    description: 'A mythical shield that warps reality around the ship, making it nearly impossible to damage.',
    lore: 'The Reality Distortion Field doesn\'t block attacks in the traditional sense—it alters the fundamental nature of reality around the ship, causing attacks to simply not happen.',
    type: 'Shield' as ItemType,
    rank: 'S' as Rank,
    rarity: 'Mythic' as Rarity,
    quality: 'Divine' as Quality,
    tier: 6,
    level: 1,
    maxLevel: 120,
    baseStats: {
      defense: 450,
      shieldStrength: 10000,
      shieldRegeneration: 80
    },
    bonuses: {
      shieldBonus: 220,
      realityResistance: 70,
      attackNegation: 40,
      continuousRecharge: 50
    },
    cost: {
      crystal: 70000,
      deuterium: 50000,
      credits: 750000
    },
    requirements: {
      level: 100,
      technologies: ['reality_bending_3', 'shielding_technology_6'],
      shipClass: ['Battleship', 'Dreadnought', 'Titan', 'Mothership']
    },
    specialEffect: 'Regenerates 80 shield/sec, 40% chance to negate attacks entirely, never fully depletes',
    flavorText: 'Rewrite the rules.'
  },
  {
    id: 'cosmic-aegis',
    name: 'Cosmic Aegis Field',
    description: 'A cosmic-tier shield powered by stellar energy. Provides near-absolute protection and can absorb unlimited energy.',
    lore: 'The Cosmic Aegis draws power directly from nearby stars, making it effectively unlimited. It has been observed absorbing the full output of capital ship weapons without flickering.',
    type: 'Shield' as ItemType,
    rank: 'SS' as Rank,
    rarity: 'Cosmic' as Rarity,
    quality: 'Divine' as Quality,
    tier: 7,
    level: 1,
    maxLevel: 140,
    baseStats: {
      defense: 900,
      shieldStrength: 25000,
      shieldRegeneration: 150
    },
    bonuses: {
      shieldBonus: 450,
      cosmicResistance: 85,
      energyAbsorption: 60,
      stellarRecharge: 100
    },
    cost: {
      crystal: 180000,
      deuterium: 140000,
      credits: 3500000
    },
    requirements: {
      level: 125,
      technologies: ['cosmic_energy_3', 'shielding_technology_7'],
      shipClass: ['Dreadnought', 'Titan', 'Mothership']
    },
    specialEffect: 'Regenerates 150 shield/sec, absorbs 60% of energy attacks as shield power, draws power from stars',
    flavorText: 'Protected by the cosmos.'
  },
  {
    id: 'eternal-aegis',
    name: 'Eternal Aegis Field',
    description: 'The ultimate shield—a universal-tier barrier that cannot be broken. Provides absolute protection against all forms of attack.',
    lore: 'The Eternal Aegis is said to be a fragment of the barrier that separates universes. It doesn\'t just protect—it makes the concept of damage meaningless. Ships with this shield have survived inside black holes.',
    type: 'Shield' as ItemType,
    rank: 'SSS' as Rank,
    rarity: 'Universal' as Rarity,
    quality: 'Divine' as Quality,
    tier: 8,
    level: 1,
    maxLevel: 150,
    baseStats: {
      defense: 2500,
      shieldStrength: 100000,
      shieldRegeneration: 500
    },
    bonuses: {
      shieldBonus: 1000,
      universalResistance: 95,
      absoluteProtection: 80,
      infiniteRecharge: 200,
      damageImmunity: 50
    },
    cost: {
      crystal: 550000,
      deuterium: 450000,
      credits: 18000000
    },
    requirements: {
      level: 150,
      technologies: ['universal_mastery_1', 'eternal_power_1'],
      shipClass: ['Mothership', 'Flagship']
    },
    specialEffect: 'Regenerates 500 shield/sec, 50% chance to be immune to damage, cannot be fully depleted',
    flavorText: 'Absolute invulnerability.'
  },

  // Engines
  {
    id: 'basic-thruster',
    name: 'Basic Ion Thruster',
    description: 'A reliable propulsion system that provides adequate speed for basic operations and short-range travel.',
    lore: 'Ion Thrusters have been the standard for centuries. While not the fastest, their reliability and fuel efficiency make them perfect for everyday use.',
    type: 'Engine' as ItemType,
    rank: 'E' as Rank,
    rarity: 'Common' as Rarity,
    quality: 'Normal' as Quality,
    tier: 1,
    level: 1,
    maxLevel: 50,
    baseStats: {
      speed: 30,
      acceleration: 15
    },
    bonuses: {
      speedBonus: 5,
      fuelEfficiency: 10
    },
    cost: {
      metal: 400,
      deuterium: 300,
      credits: 1800
    },
    requirements: {
      level: 1,
      technologies: ['combustion_drive_1'],
      shipClass: ['Fighter', 'Interceptor', 'Corvette']
    },
    specialEffect: '+10% fuel efficiency, reliable performance',
    flavorText: 'Gets you there.'
  },
  {
    id: 'impulse-drive',
    name: 'Impulse Drive System',
    description: 'An advanced propulsion system offering significantly improved speed and maneuverability.',
    lore: 'Impulse Drives use controlled plasma reactions to achieve speeds that make ion thrusters look like they\'re standing still.',
    type: 'Engine' as ItemType,
    rank: 'D' as Rank,
    rarity: 'Uncommon' as Rarity,
    quality: 'Superior' as Quality,
    tier: 2,
    level: 1,
    maxLevel: 60,
    baseStats: {
      speed: 65,
      acceleration: 35,
      maneuverability: 20
    },
    bonuses: {
      speedBonus: 12,
      accelerationBonus: 15,
      turnRate: 10
    },
    cost: {
      metal: 1200,
      deuterium: 900,
      credits: 5500
    },
    requirements: {
      level: 10,
      technologies: ['impulse_drive_2'],
      shipClass: ['Interceptor', 'Bomber', 'Corvette', 'Frigate']
    },
    specialEffect: '+15% acceleration, +10% turn rate',
    flavorText: 'Speed is life.'
  },
  {
    id: 'warp-drive',
    name: 'Warp Drive Core',
    description: 'A sophisticated FTL system that allows for faster-than-light travel and rapid tactical repositioning.',
    lore: 'Warp technology changed everything. Suddenly, the galaxy became accessible. What once took years now takes days.',
    type: 'Engine' as ItemType,
    rank: 'C' as Rank,
    rarity: 'Rare' as Rarity,
    quality: 'Excellent' as Quality,
    tier: 3,
    level: 1,
    maxLevel: 70,
    baseStats: {
      speed: 120,
      acceleration: 60,
      maneuverability: 35,
      ftlSpeed: 50
    },
    bonuses: {
      speedBonus: 25,
      ftlBonus: 30,
      emergencySpeed: 40
    },
    cost: {
      metal: 3500,
      crystal: 1500,
      deuterium: 2500,
      credits: 16000
    },
    requirements: {
      level: 25,
      technologies: ['hyperspace_drive_2'],
      shipClass: ['Corvette', 'Frigate', 'Destroyer']
    },
    specialEffect: 'Enables FTL travel, +40% emergency speed boost (cooldown 60s)',
    flavorText: 'Break the light barrier.'
  },
  {
    id: 'quantum-drive',
    name: 'Quantum Tunneling Drive',
    description: 'An exotic propulsion system that uses quantum mechanics to achieve incredible speeds and near-instantaneous acceleration.',
    lore: 'Quantum Drives don\'t move through space—they tunnel through it. The ship disappears from one point and reappears at another, making traditional concepts of speed meaningless.',
    type: 'Engine' as ItemType,
    rank: 'B' as Rank,
    rarity: 'Epic' as Rarity,
    quality: 'Masterwork' as Quality,
    tier: 4,
    level: 1,
    maxLevel: 85,
    baseStats: {
      speed: 200,
      acceleration: 120,
      maneuverability: 60,
      ftlSpeed: 120
    },
    bonuses: {
      speedBonus: 45,
      instantAcceleration: 80,
      quantumJump: 100,
      evasionBonus: 15
    },
    cost: {
      metal: 8000,
      crystal: 5000,
      deuterium: 6000,
      credits: 50000
    },
    requirements: {
      level: 45,
      technologies: ['quantum_technology_2', 'hyperspace_drive_3'],
      shipClass: ['Frigate', 'Destroyer', 'Cruiser', 'Battlecruiser']
    },
    specialEffect: 'Near-instant acceleration, can perform short-range quantum jumps, +15% evasion',
    flavorText: 'Tunnel through reality.'
  },
  {
    id: 'dimensional-drive',
    name: 'Dimensional Phase Drive',
    description: 'A legendary engine that allows travel through alternate dimensions, achieving speeds that defy physics.',
    lore: 'Dimensional Drives access parallel universes where the laws of physics are slightly different, allowing for impossible speeds. Ships equipped with them can cross the galaxy in hours.',
    type: 'Engine' as ItemType,
    rank: 'A' as Rank,
    rarity: 'Legendary' as Rarity,
    quality: 'Perfect' as Quality,
    tier: 5,
    level: 1,
    maxLevel: 100,
    baseStats: {
      speed: 350,
      acceleration: 200,
      maneuverability: 100,
      ftlSpeed: 250
    },
    bonuses: {
      speedBonus: 80,
      dimensionalTravel: 150,
      phaseShift: 30,
      evasionBonus: 25
    },
    cost: {
      metal: 20000,
      crystal: 15000,
      deuterium: 18000,
      credits: 160000
    },
    requirements: {
      level: 70,
      technologies: ['dimensional_technology_2', 'hyperspace_drive_4'],
      shipClass: ['Cruiser', 'Battlecruiser', 'Battleship', 'Dreadnought']
    },
    specialEffect: 'Travel through dimensions, 30% chance to phase during combat, +25% evasion',
    flavorText: 'Cross dimensions.'
  },
  {
    id: 'reality-engine',
    name: 'Reality Manipulation Engine',
    description: 'A mythical propulsion system that doesn\'t move the ship—it moves reality around the ship.',
    lore: 'The Reality Engine is based on a simple principle: why move when you can make your destination come to you? It manipulates space-time on a fundamental level.',
    type: 'Engine' as ItemType,
    rank: 'S' as Rank,
    rarity: 'Mythic' as Rarity,
    quality: 'Divine' as Quality,
    tier: 6,
    level: 1,
    maxLevel: 120,
    baseStats: {
      speed: 600,
      acceleration: 400,
      maneuverability: 180,
      ftlSpeed: 500
    },
    bonuses: {
      speedBonus: 150,
      realityManipulation: 200,
      instantTravel: 100,
      evasionBonus: 40
    },
    cost: {
      metal: 60000,
      crystal: 45000,
      deuterium: 50000,
      credits: 650000
    },
    requirements: {
      level: 100,
      technologies: ['reality_bending_3', 'hyperspace_drive_5'],
      shipClass: ['Battleship', 'Dreadnought', 'Titan', 'Mothership']
    },
    specialEffect: 'Near-instant travel anywhere, manipulate space-time, +40% evasion',
    flavorText: 'Rewrite distance.'
  },
  {
    id: 'cosmic-drive',
    name: 'Cosmic Singularity Drive',
    description: 'A cosmic-tier engine powered by a contained singularity. Achieves speeds that make light seem slow.',
    lore: 'The Cosmic Drive contains a miniature black hole, using its gravitational effects to warp space-time. Ships with this drive can cross the entire galaxy in minutes.',
    type: 'Engine' as ItemType,
    rank: 'SS' as Rank,
    rarity: 'Cosmic' as Rarity,
    quality: 'Divine' as Quality,
    tier: 7,
    level: 1,
    maxLevel: 140,
    baseStats: {
      speed: 1200,
      acceleration: 800,
      maneuverability: 300,
      ftlSpeed: 1000
    },
    bonuses: {
      speedBonus: 300,
      singularityPower: 400,
      gravityManipulation: 250,
      evasionBonus: 60
    },
    cost: {
      metal: 160000,
      crystal: 130000,
      deuterium: 150000,
      credits: 3000000
    },
    requirements: {
      level: 125,
      technologies: ['cosmic_energy_3', 'singularity_control_2'],
      shipClass: ['Dreadnought', 'Titan', 'Mothership']
    },
    specialEffect: 'Instant galactic travel, manipulate gravity, +60% evasion',
    flavorText: 'Harness singularities.'
  },
  {
    id: 'eternal-propulsion',
    name: 'Eternal Propulsion System',
    description: 'The ultimate engine—a universal-tier system that transcends the concept of movement. Be everywhere at once.',
    lore: 'The Eternal Propulsion System doesn\'t move the ship through space—it makes the ship exist in all places simultaneously. Distance becomes meaningless. Time becomes optional. Physics becomes a suggestion.',
    type: 'Engine' as ItemType,
    rank: 'SSS' as Rank,
    rarity: 'Universal' as Rarity,
    quality: 'Divine' as Quality,
    tier: 8,
    level: 1,
    maxLevel: 150,
    baseStats: {
      speed: 5000,
      acceleration: 3000,
      maneuverability: 1000,
      ftlSpeed: 10000
    },
    bonuses: {
      speedBonus: 1000,
      omnipresence: 1000,
      timeManipulation: 500,
      evasionBonus: 90
    },
    cost: {
      metal: 500000,
      crystal: 450000,
      deuterium: 500000,
      credits: 15000000
    },
    requirements: {
      level: 150,
      technologies: ['universal_mastery_1', 'eternal_power_1'],
      shipClass: ['Mothership', 'Flagship']
    },
    specialEffect: 'Exist everywhere simultaneously, manipulate time, +90% evasion, instant travel anywhere',
    flavorText: 'Transcend movement.'
  }
];
