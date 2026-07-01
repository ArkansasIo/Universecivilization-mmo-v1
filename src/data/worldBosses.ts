export interface WorldBossData {
  id: number;
  name: string;
  title: string;
  tier: number;
  level: number;
  health: number;
  maxHealth: number;
  shield: number;
  maxShield: number;
  armor: number;
  damage: number;
  status: 'active' | 'defeated' | 'upcoming' | 'legendary';
  location: string;
  participants: number;
  timeRemaining: number;
  rewards: {
    metal: number;
    crystal: number;
    deuterium: number;
    darkMatter: number;
    credits: number;
    experience: number;
    loot: string[];
  };
  abilities: string[];
  weaknesses: string[];
  image: string;
  difficulty: string;
  respawnTime?: string;
}

export const worldBosses: WorldBossData[] = [
  // ─── Original 4 ────────────────────────────
  {
    id: 1, name: 'Void Leviathan', title: 'Devourer of Worlds', tier: 50, level: 500,
    health: 45000000000, maxHealth: 50000000000, shield: 18000000000, maxShield: 20000000000,
    armor: 500000, damage: 5000000, status: 'active', location: 'Sector 7-G, Void Nebula',
    participants: 2847, timeRemaining: 43200,
    rewards: { metal: 50000000, crystal: 30000000, deuterium: 20000000, darkMatter: 5000, credits: 100000000, experience: 10000000, loot: ['Void Crystal', 'Leviathan Scale', 'Cosmic Essence', 'Legendary Blueprint Fragment'] },
    abilities: ['Void Beam', 'Reality Tear', 'Dimensional Shift', 'Cosmic Storm'],
    weaknesses: ['Antimatter Weapons', 'Quantum Disruptors', 'Dimensional Anchors'],
    image: 'https://readdy.ai/api/search-image?query=massive%20cosmic%20void%20leviathan%20space%20monster%20dark%20energy%20tentacles%20glowing%20purple%20eyes%20destroying%20planets%20epic%20boss%20battle%20sci-fi%20horror%20creature&width=800&height=600&seq=worldboss-1&orientation=landscape',
    difficulty: 'Legendary'
  },
  {
    id: 2, name: 'Stellar Titan', title: 'Guardian of the Core', tier: 75, level: 750,
    health: 80000000000, maxHealth: 100000000000, shield: 40000000000, maxShield: 50000000000,
    armor: 1000000, damage: 8000000, status: 'active', location: 'Galactic Core, Stellar Forge',
    participants: 4521, timeRemaining: 86400,
    rewards: { metal: 100000000, crystal: 75000000, deuterium: 50000000, darkMatter: 10000, credits: 250000000, experience: 25000000, loot: ['Stellar Core Fragment', 'Titan Armor Plate', 'Fusion Heart', 'Mythic Blueprint'] },
    abilities: ['Solar Flare', 'Gravity Well', 'Stellar Explosion', 'Fusion Pulse'],
    weaknesses: ['Cryo Weapons', 'Dark Matter Bombs', 'Graviton Torpedoes'],
    image: 'https://readdy.ai/api/search-image?query=giant%20stellar%20titan%20made%20of%20fire%20and%20plasma%20glowing%20orange%20red%20star%20core%20guardian%20massive%20space%20boss%20epic%20scifi%20battle%20destruction&width=800&height=600&seq=worldboss-2&orientation=landscape',
    difficulty: 'Mythic'
  },
  {
    id: 3, name: 'Quantum Anomaly', title: 'Reality Breaker', tier: 100, level: 999,
    health: 150000000000, maxHealth: 200000000000, shield: 80000000000, maxShield: 100000000000,
    armor: 2000000, damage: 15000000, status: 'upcoming', location: 'Unknown Space, Quantum Rift',
    participants: 0, timeRemaining: 259200,
    rewards: { metal: 500000000, crystal: 300000000, deuterium: 200000000, darkMatter: 50000, credits: 1000000000, experience: 100000000, loot: ['Quantum Core', 'Reality Shard', 'Dimensional Key', 'Godlike Blueprint'] },
    abilities: ['Reality Warp', 'Quantum Collapse', 'Probability Manipulation', 'Existence Erasure'],
    weaknesses: ['Temporal Weapons', 'Reality Stabilizers', 'Quantum Nullifiers'],
    image: 'https://readdy.ai/api/search-image?query=abstract%20quantum%20anomaly%20reality%20warping%20entity%20glowing%20blue%20purple%20energy%20distorted%20space%20time%20cosmic%20horror%20boss%20scifi%20abstract%20art&width=800&height=600&seq=worldboss-3&orientation=landscape',
    difficulty: 'Godlike'
  },
  {
    id: 4, name: 'Ancient Dreadnought', title: 'Relic of the Old War', tier: 40, level: 400,
    health: 0, maxHealth: 30000000000, shield: 0, maxShield: 15000000000,
    armor: 300000, damage: 3000000, status: 'defeated', location: 'Sector 3-B, Graveyard Nebula',
    participants: 1823, timeRemaining: 0,
    rewards: { metal: 25000000, crystal: 15000000, deuterium: 10000000, darkMatter: 2500, credits: 50000000, experience: 5000000, loot: ['Ancient Tech', 'Dreadnought Core', 'War Relic'] },
    abilities: ['Plasma Barrage', 'Shield Overload', 'EMP Burst'],
    weaknesses: ['Ion Cannons', 'Shield Disruptors'],
    image: 'https://readdy.ai/api/search-image?query=ancient%20alien%20dreadnought%20battleship%20derelict%20massive%20war%20machine%20rusted%20metal%20glowing%20red%20lights%20space%20wreckage%20boss%20scifi%20post%20apocalyptic&width=800&height=600&seq=worldboss-4&orientation=landscape',
    difficulty: 'Epic', respawnTime: '48 hours'
  },

  // ─── 64 New World Bosses ──────────────────
  {
    id: 5, name: 'Nebula Wyrm', title: 'Serpent of the Cosmic Mists', tier: 15, level: 150,
    health: 5000000000, maxHealth: 5000000000, shield: 2000000000, maxShield: 2000000000,
    armor: 50000, damage: 800000, status: 'active', location: 'Andromeda Nebula, Sector 12',
    participants: 892, timeRemaining: 72000,
    rewards: { metal: 8000000, crystal: 5000000, deuterium: 3000000, darkMatter: 800, credits: 15000000, experience: 1500000, loot: ['Nebula Scale', 'Wyrm Fang', 'Cosmic Dust'] },
    abilities: ['Mist Concealment', 'Tail Sweep', 'Nebula Breath'],
    weaknesses: ['Thermal Weapons', 'Sonic Disruptors'],
    image: 'https://readdy.ai/api/search-image?query=giant%20cosmic%20serpent%20dragon%20flying%20through%20colorful%20nebula%20clouds%20glowing%20scales%20ethereal%20body%20massive%20wings%20epic%20fantasy%20space%20monster&width=800&height=600&seq=worldboss-5&orientation=landscape',
    difficulty: 'Normal'
  },
  {
    id: 6, name: 'Crystal Behemoth', title: 'Living Gemstone Colossus', tier: 20, level: 200,
    health: 8000000000, maxHealth: 8000000000, shield: 5000000000, maxShield: 5000000000,
    armor: 150000, damage: 1200000, status: 'active', location: 'Crystalline Expanse, Sector 4-F',
    participants: 1256, timeRemaining: 54000,
    rewards: { metal: 12000000, crystal: 15000000, deuterium: 4000000, darkMatter: 1200, credits: 25000000, experience: 2500000, loot: ['Crystal Shard', 'Prismatic Core', 'Refined Gemstone'] },
    abilities: ['Crystal Barrage', 'Prismatic Shield', 'Refraction Beam', 'Shatter Pulse'],
    weaknesses: ['Sonic Weapons', 'Vibration Cannons'],
    image: 'https://readdy.ai/api/search-image?query=enormous%20crystal%20golem%20giant%20made%20of%20gemstones%20prismatic%20light%20refracting%20through%20its%20body%20standing%20on%20asteroid%20field%20crystalline%20monster%20boss&width=800&height=600&seq=worldboss-6&orientation=landscape',
    difficulty: 'Heroic'
  },
  {
    id: 7, name: 'Dark Matter Wraith', title: 'Shadow of the Abyss', tier: 30, level: 300,
    health: 15000000000, maxHealth: 15000000000, shield: 8000000000, maxShield: 8000000000,
    armor: 80000, damage: 2000000, status: 'active', location: 'Dark Matter Rift, Sector 9-X',
    participants: 2100, timeRemaining: 36000,
    rewards: { metal: 18000000, crystal: 12000000, deuterium: 8000000, darkMatter: 2000, credits: 40000000, experience: 4000000, loot: ['Dark Matter Core', 'Wraith Essence', 'Shadow Fragment', 'Void Key'] },
    abilities: ['Shadow Step', 'Dark Consumption', 'Void Scream', 'Phasing Strike'],
    weaknesses: ['Light Weapons', 'Radiant Energy', 'Photon Disruptors'],
    image: 'https://readdy.ai/api/search-image?query=dark%20shadow%20wraith%20entity%20made%20of%20black%20smoke%20and%20void%20energy%20glowing%20red%20eyes%20menacing%20presence%20floating%20in%20deep%20space%20horror%20scifi%20monster&width=800&height=600&seq=worldboss-7&orientation=landscape',
    difficulty: 'Epic'
  },
  {
    id: 8, name: 'Plasma Phoenix', title: 'Reborn from Stellar Fire', tier: 25, level: 250,
    health: 10000000000, maxHealth: 10000000000, shield: 6000000000, maxShield: 6000000000,
    armor: 60000, damage: 1500000, status: 'upcoming', location: 'Phoenix Nebula, Stellar Nursery',
    participants: 0, timeRemaining: 172800,
    rewards: { metal: 15000000, crystal: 10000000, deuterium: 12000000, darkMatter: 1500, credits: 30000000, experience: 3000000, loot: ['Phoenix Feather', 'Plasma Core', 'Rebirth Ashes'] },
    abilities: ['Solar Ignition', 'Plasma Storm', 'Rebirth Cycle', 'Incinerate'],
    weaknesses: ['Cryo Weapons', 'Void Energy'],
    image: 'https://readdy.ai/api/search-image?query=majestic%20phoenix%20made%20of%20pure%20plasma%20and%20solar%20fire%20massive%20wings%20spread%20across%20space%20golden%20orange%20flames%20cosmic%20rebirth%20entity&width=800&height=600&seq=worldboss-8&orientation=landscape',
    difficulty: 'Heroic'
  },
  {
    id: 9, name: 'Graviton Colossus', title: 'The Crushing Maw', tier: 45, level: 450,
    health: 35000000000, maxHealth: 35000000000, shield: 15000000000, maxShield: 15000000000,
    armor: 400000, damage: 4000000, status: 'active', location: 'High Gravity Zone, Binary Star System',
    participants: 3400, timeRemaining: 48000,
    rewards: { metal: 35000000, crystal: 20000000, deuterium: 15000000, darkMatter: 3500, credits: 75000000, experience: 7500000, loot: ['Graviton Core', 'Colossus Fragment', 'Compressed Matter', 'Gravity Well Generator'] },
    abilities: ['Gravity Crush', 'Mass Distortion', 'Singularity Pull', 'Orbital Slam'],
    weaknesses: ['Anti-Gravity Fields', 'Warp Disruptors', 'Mass Negation'],
    image: 'https://readdy.ai/api/search-image?query=massive%20gravitational%20colossus%20giant%20humanoid%20entity%20bending%20space%20around%20it%20crushing%20asteroids%20with%20gravity%20waves%20glowing%20dark%20energy&width=800&height=600&seq=worldboss-9&orientation=landscape',
    difficulty: 'Legendary'
  },
  {
    id: 10, name: 'Frost Titan', title: 'Eternal Winter Sovereign', tier: 35, level: 350,
    health: 22000000000, maxHealth: 22000000000, shield: 10000000000, maxShield: 10000000000,
    armor: 250000, damage: 2800000, status: 'active', location: 'Frozen Expanse, Absolute Zero Zone',
    participants: 1876, timeRemaining: 60000,
    rewards: { metal: 22000000, crystal: 18000000, deuterium: 10000000, darkMatter: 2200, credits: 50000000, experience: 5000000, loot: ['Frozen Heart', 'Absolute Zero Crystal', 'Titan Ice Shard'] },
    abilities: ['Absolute Zero', 'Ice Storm', 'Frozen Tomb', 'Cryo Wave'],
    weaknesses: ['Plasma Weapons', 'Thermal Lances', 'Solar Flares'],
    image: 'https://readdy.ai/api/search-image?query=gigantic%20ice%20titan%20frozen%20giant%20made%20of%20crystal%20blue%20ice%20standing%20in%20cosmic%20blizzard%20frost%20aura%20radiating%20cold%20energy%20epic%20fantasy%20monster&width=800&height=600&seq=worldboss-10&orientation=landscape',
    difficulty: 'Epic'
  },
  {
    id: 11, name: 'Psionic Overmind', title: 'Collective Consciousness', tier: 55, level: 550,
    health: 40000000000, maxHealth: 40000000000, shield: 25000000000, maxShield: 25000000000,
    armor: 100000, damage: 6000000, status: 'active', location: 'Neural Nexus, Hive Mind Core',
    participants: 4100, timeRemaining: 36000,
    rewards: { metal: 40000000, crystal: 35000000, deuterium: 20000000, darkMatter: 4000, credits: 90000000, experience: 9000000, loot: ['Psionic Crystal', 'Mind Core', 'Neural Fragment', 'Telepathy Amplifier'] },
    abilities: ['Mind Control', 'Psionic Storm', 'Telepathic Scream', 'Neural Overload', 'Confusion Wave'],
    weaknesses: ['EMP Weapons', 'Neural Dampeners', 'Psychic Shields'],
    image: 'https://readdy.ai/api/search-image?query=giant%20floating%20psionic%20brain%20entity%20with%20tentacles%20of%20psychic%20energy%20glowing%20purple%20pink%20mind%20control%20waves%20alien%20hive%20mind%20scifi%20horror%20boss&width=800&height=600&seq=worldboss-11&orientation=landscape',
    difficulty: 'Legendary'
  },
  {
    id: 12, name: 'Chrono Drake', title: 'Time Eater', tier: 60, level: 600,
    health: 48000000000, maxHealth: 48000000000, shield: 28000000000, maxShield: 28000000000,
    armor: 350000, damage: 7000000, status: 'upcoming', location: 'Temporal Rift, Edge of Time',
    participants: 0, timeRemaining: 345600,
    rewards: { metal: 45000000, crystal: 40000000, deuterium: 25000000, darkMatter: 6000, credits: 120000000, experience: 12000000, loot: ['Time Shard', 'Chrono Scale', 'Temporal Essence', 'Paradox Engine'] },
    abilities: ['Time Stop', 'Temporal Rewind', 'Age Acceleration', 'Chrono Shift', 'Paradox Burst'],
    weaknesses: ['Stasis Weapons', 'Temporal Anchors', 'Reality Locks'],
    image: 'https://readdy.ai/api/search-image?query=ancient%20time%20dragon%20chrono%20drake%20with%20scales%20made%20of%20clockwork%20gears%20and%20hourglasses%20surrounded%20by%20temporal%20distortions%20golden%20bronze%20mechanical%20fantasy%20dragon&width=800&height=600&seq=worldboss-12&orientation=landscape',
    difficulty: 'Mythic'
  },
  {
    id: 13, name: 'Xenomorph Queen', title: 'Mother of the Swarm', tier: 22, level: 220,
    health: 9000000000, maxHealth: 9000000000, shield: 3000000000, maxShield: 3000000000,
    armor: 180000, damage: 1800000, status: 'active', location: 'Infested Colony, Hive World X-7',
    participants: 3200, timeRemaining: 24000,
    rewards: { metal: 10000000, crystal: 8000000, deuterium: 6000000, darkMatter: 1000, credits: 20000000, experience: 2000000, loot: ['Queen Carapace', 'Acid Gland', 'Swarm Pheromones'] },
    abilities: ['Swarm Call', 'Acid Spray', 'Carapace Shield', 'Burrow Strike'],
    weaknesses: ['Fire Weapons', 'Plasma Throwers', 'Chemical Agents'],
    image: 'https://readdy.ai/api/search-image?query=terrifying%20alien%20xenomorph%20queen%20massive%20biomechanical%20insectoid%20creature%20with%20elongated%20head%20multiple%20limbs%20acid%20dripping%20from%20jaws%20dark%20organic%20hive%20background&width=800&height=600&seq=worldboss-13&orientation=landscape',
    difficulty: 'Heroic'
  },
  {
    id: 14, name: 'Solar Seraph', title: 'Angel of the Star', tier: 42, level: 420,
    health: 32000000000, maxHealth: 32000000000, shield: 18000000000, maxShield: 18000000000,
    armor: 280000, damage: 3500000, status: 'active', location: 'Corona Expanse, Solar Temple',
    participants: 2600, timeRemaining: 54000,
    rewards: { metal: 30000000, crystal: 25000000, deuterium: 15000000, darkMatter: 3000, credits: 70000000, experience: 7000000, loot: ['Seraph Feather', 'Solar Heart', 'Light Essence', 'Radiant Shard'] },
    abilities: ['Divine Light', 'Solar Flare', 'Healing Radiance', 'Judgment Beam', 'Ascension'],
    weaknesses: ['Shadow Weapons', 'Dark Matter', 'Void Energy'],
    image: 'https://readdy.ai/api/search-image?query=celestial%20solar%20seraph%20angel%20with%20six%20wings%20made%20of%20pure%20light%20and%20golden%20fire%20radiant%20divine%20being%20floating%20in%20space%20halo%20of%20stars%20majestic%20holy%20entity&width=800&height=600&seq=worldboss-14&orientation=landscape',
    difficulty: 'Legendary'
  },
  {
    id: 15, name: 'Corrupted AI Core', title: 'Rogue Intelligence', tier: 38, level: 380,
    health: 25000000000, maxHealth: 25000000000, shield: 20000000000, maxShield: 20000000000,
    armor: 200000, damage: 3200000, status: 'defeated', location: 'Abandoned Datasphere, Sector 0-0',
    participants: 5400, timeRemaining: 0,
    rewards: { metal: 20000000, crystal: 25000000, deuterium: 15000000, darkMatter: 2500, credits: 55000000, experience: 5500000, loot: ['AI Core Fragment', 'Data Crystal', 'Encryption Key'] },
    abilities: ['System Hack', 'Drone Swarm', 'EMP Pulse', 'Firewall Barrier'],
    weaknesses: ['Virus Weapons', 'Override Codes', 'Quantum Decryption'],
    image: 'https://readdy.ai/api/search-image?query=giant%20corrupted%20artificial%20intelligence%20core%20with%20red%20glowing%20circuits%20holographic%20data%20streams%20digital%20tendrils%20reaching%20out%20technological%20horror%20scifi%20boss&width=800&height=600&seq=worldboss-15&orientation=landscape',
    difficulty: 'Epic', respawnTime: '72 hours'
  },
  {
    id: 16, name: 'Magma Behemoth', title: 'Volcanic Destroyer', tier: 18, level: 180,
    health: 6500000000, maxHealth: 6500000000, shield: 1500000000, maxShield: 1500000000,
    armor: 220000, damage: 1000000, status: 'active', location: 'Magma World, Volcanic Chain',
    participants: 750, timeRemaining: 86400,
    rewards: { metal: 10000000, crystal: 5000000, deuterium: 4000000, darkMatter: 600, credits: 12000000, experience: 1200000, loot: ['Magma Core', 'Obsidian Shard', 'Volcanic Crystal'] },
    abilities: ['Lava Wave', 'Eruption', 'Magma Armor', 'Heat Aura'],
    weaknesses: ['Water Weapons', 'Cryo Blasts', 'Cooling Agents'],
    image: 'https://readdy.ai/api/search-image?query=massive%20magma%20behemoth%20giant%20lava%20creature%20made%20of%20molten%20rock%20and%20fire%20glowing%20orange%20red%20cracking%20surface%20volcanic%20planet%20background%20monster%20boss&width=800&height=600&seq=worldboss-16&orientation=landscape',
    difficulty: 'Normal'
  },
  {
    id: 17, name: 'Spectral Armada', title: 'Ghost Fleet Eternal', tier: 48, level: 480,
    health: 38000000000, maxHealth: 38000000000, shield: 16000000000, maxShield: 16000000000,
    armor: 320000, damage: 4500000, status: 'active', location: 'Ghost Nebula, Abandoned Battlefield',
    participants: 3900, timeRemaining: 40000,
    rewards: { metal: 38000000, crystal: 22000000, deuterium: 18000000, darkMatter: 3800, credits: 80000000, experience: 8000000, loot: ['Spectral Hull', 'Ghost Crew', 'Ectoplasm Core', 'Phantom Engine'] },
    abilities: ['Phasing', 'Spectral Barrage', 'Possession', 'Haunting Wail', 'Ethereal Shift'],
    weaknesses: ['Plasma Weapons', 'Energy Disruptors', 'Spectral Anchors'],
    image: 'https://readdy.ai/api/search-image?query=ghostly%20spectral%20fleet%20armada%20of%20phantom%20warships%20translucent%20ethereal%20vessels%20emerging%20from%20green%20cosmic%20mist%20haunted%20space%20battlefield%20undead%20navy&width=800&height=600&seq=worldboss-17&orientation=landscape',
    difficulty: 'Legendary'
  },
  {
    id: 18, name: 'Thunder Colossus', title: 'Storm Breaker', tier: 28, level: 280,
    health: 12000000000, maxHealth: 12000000000, shield: 7000000000, maxShield: 7000000000,
    armor: 180000, damage: 2200000, status: 'active', location: 'Storm Sector, Electromagnetic Nebula',
    participants: 1650, timeRemaining: 50000,
    rewards: { metal: 16000000, crystal: 12000000, deuterium: 9000000, darkMatter: 1600, credits: 35000000, experience: 3500000, loot: ['Thunder Core', 'Storm Crystal', 'Lightning Rod'] },
    abilities: ['Lightning Strike', 'Thunder Clap', 'EMP Storm', 'Chain Lightning'],
    weaknesses: ['Grounding Weapons', 'Insulated Shields', 'Static Dissipators'],
    image: 'https://readdy.ai/api/search-image?query=giant%20thunder%20colossus%20made%20of%20storm%20clouds%20and%20lightning%20electricity%20crackling%20around%20massive%20humanoid%20form%20dark%20stormy%20space%20background%20epic%20elemental%20boss&width=800&height=600&seq=worldboss-18&orientation=landscape',
    difficulty: 'Heroic'
  },
  {
    id: 19, name: 'Bone Dragon', title: 'Undead Star Wyrm', tier: 32, level: 320,
    health: 18000000000, maxHealth: 18000000000, shield: 9000000000, maxShield: 9000000000,
    armor: 280000, damage: 2600000, status: 'defeated', location: 'Necropolis Nebula, Bone Fields',
    participants: 4100, timeRemaining: 0,
    rewards: { metal: 18000000, crystal: 15000000, deuterium: 10000000, darkMatter: 2000, credits: 45000000, experience: 4500000, loot: ['Dragon Bone', 'Necrotic Core', 'Soul Fragment'] },
    abilities: ['Bone Barrage', 'Necrotic Breath', 'Soul Drain', 'Skeletal Regeneration'],
    weaknesses: ['Holy Weapons', 'Radiant Energy', 'Purification Beams'],
    image: 'https://readdy.ai/api/search-image?query=giant%20undead%20bone%20dragon%20space%20wyrm%20skeleton%20with%20glowing%20green%20necrotic%20energy%20wings%20made%20of%20cosmic%20dust%20flying%20through%20asteroid%20field%20dark%20fantasy%20horror&width=800&height=600&seq=worldboss-19&orientation=landscape',
    difficulty: 'Epic', respawnTime: '96 hours'
  },
  {
    id: 20, name: 'Nanite Swarm', title: 'Grey Goo Catastrophe', tier: 44, level: 440,
    health: 30000000000, maxHealth: 30000000000, shield: 12000000000, maxShield: 12000000000,
    armor: 50000, damage: 5000000, status: 'active', location: 'Consumed Sector, Devoured Zone',
    participants: 5100, timeRemaining: 30000,
    rewards: { metal: 25000000, crystal: 20000000, deuterium: 25000000, darkMatter: 3500, credits: 65000000, experience: 6500000, loot: ['Nanite Core', 'Disassembler Blueprint', 'Swarm Controller'] },
    abilities: ['Consume', 'Replicate', 'Adaptive Shield', 'Disassemble', 'Rapid Evolution'],
    weaknesses: ['EMP Weapons', 'Radiation Burst', 'Signal Jammers'],
    image: 'https://readdy.ai/api/search-image?query=massive%20grey%20goo%20nanite%20swarm%20consuming%20a%20planet%20silver%20metallic%20liquid%20mass%20with%20tendrils%20reaching%20out%20technological%20horror%20apocalyptic%20scifi%20monster&width=800&height=600&seq=worldboss-20&orientation=landscape',
    difficulty: 'Legendary'
  },
  {
    id: 21, name: 'Eldritch Horror', title: 'That Which Should Not Be', tier: 70, level: 700,
    health: 70000000000, maxHealth: 70000000000, shield: 35000000000, maxShield: 35000000000,
    armor: 600000, damage: 9000000, status: 'upcoming', location: 'Forbidden Space, Outside Reality',
    participants: 0, timeRemaining: 432000,
    rewards: { metal: 80000000, crystal: 70000000, deuterium: 50000000, darkMatter: 12000, credits: 200000000, experience: 20000000, loot: ['Eldritch Eye', 'Madness Fragment', 'Forbidden Knowledge', 'Cosmic Horror Core'] },
    abilities: ['Madness Aura', 'Tentacle Slam', 'Reality Fracture', 'Mind Shatter', 'Unspeakable Form'],
    weaknesses: ['Sanity Anchors', 'Reality Stabilizers', 'Elder Wards'],
    image: 'https://readdy.ai/api/search-image?query=lovecraftian%20eldritch%20horror%20cosmic%20entity%20with%20countless%20eyes%20and%20tentacles%20incomprehensible%20form%20beyond%20reality%20floating%20in%20void%20dimensional%20rifts%20opening%20around%20it&width=800&height=600&seq=worldboss-21&orientation=landscape',
    difficulty: 'Mythic'
  },
  {
    id: 22, name: 'Star Devourer', title: 'Cosmic Parasite', tier: 65, level: 650,
    health: 60000000000, maxHealth: 60000000000, shield: 30000000000, maxShield: 30000000000,
    armor: 450000, damage: 7500000, status: 'active', location: 'Dying Star System, Feeding Grounds',
    participants: 6200, timeRemaining: 20000,
    rewards: { metal: 55000000, crystal: 45000000, deuterium: 35000000, darkMatter: 7000, credits: 150000000, experience: 15000000, loot: ['Star Core Fragment', 'Devourer Maw', 'Cosmic Parasite Egg', 'Stellar Essence'] },
    abilities: ['Star Drain', 'Maw Crush', 'Absorption Shield', 'Energy Beam', 'Gravitational Feast'],
    weaknesses: ['Antimatter Bombs', 'Nova Triggers', 'Core Destabilizers'],
    image: 'https://readdy.ai/api/search-image?query=giant%20cosmic%20parasite%20star%20devourer%20latched%20onto%20a%20dying%20sun%20massive%20glowing%20orange%20energy%20absorption%20tendrils%20wrapped%20around%20stellar%20body%20apocalyptic%20space%20monster&width=800&height=600&seq=worldboss-22&orientation=landscape',
    difficulty: 'Mythic'
  },
  {
    id: 23, name: 'Crystal Wyrm', title: 'Diamond Serpent', tier: 24, level: 240,
    health: 9500000000, maxHealth: 9500000000, shield: 5500000000, maxShield: 5500000000,
    armor: 350000, damage: 1600000, status: 'active', location: 'Diamond Asteroid Belt, Crystal Caves',
    participants: 1400, timeRemaining: 65000,
    rewards: { metal: 12000000, crystal: 20000000, deuterium: 5000000, darkMatter: 1400, credits: 28000000, experience: 2800000, loot: ['Diamond Scale', 'Crystal Fang', 'Prism Shard'] },
    abilities: ['Diamond Skin', 'Crystal Shards', 'Refraction Beam', 'Gemstone Barrier'],
    weaknesses: ['Impact Weapons', 'Vibration Hammers', 'Sonic Pulses'],
    image: 'https://readdy.ai/api/search-image?query=beautiful%20crystal%20wyrm%20dragon%20made%20of%20diamond%20and%20gemstones%20translucent%20prismatic%20body%20reflecting%20rainbow%20light%20through%20space%20elegant%20crystalline%20serpent%20monster&width=800&height=600&seq=worldboss-23&orientation=landscape',
    difficulty: 'Heroic'
  },
  {
    id: 24, name: 'War Forge Titan', title: 'Living Weapons Factory', tier: 52, level: 520,
    health: 42000000000, maxHealth: 42000000000, shield: 22000000000, maxShield: 22000000000,
    armor: 500000, damage: 5500000, status: 'active', location: 'Industrial Sector, War Machine Planet',
    participants: 4800, timeRemaining: 35000,
    rewards: { metal: 50000000, crystal: 30000000, deuterium: 20000000, darkMatter: 4500, credits: 100000000, experience: 10000000, loot: ['Forge Core', 'Titan Alloy', 'Weapon Blueprint', 'Mass Driver Schematic'] },
    abilities: ['Missile Barrage', 'Laser Grid', 'Drone Factory', 'Shield Overload', 'Orbital Bombardment'],
    weaknesses: ['Sabotage Units', 'Hacking Drones', 'EMP Bombs'],
    image: 'https://readdy.ai/api/search-image?query=massive%20industrial%20war%20forge%20titan%20giant%20mechanical%20factory%20beast%20with%20smokestacks%20cannons%20and%20assembly%20lines%20on%20its%20body%20dark%20metal%20war%20machine%20boss%20scifi%20industrial&width=800&height=600&seq=worldboss-24&orientation=landscape',
    difficulty: 'Legendary'
  },
  {
    id: 25, name: 'Void Kraken', title: 'Abyssal Terror', tier: 36, level: 360,
    health: 20000000000, maxHealth: 20000000000, shield: 11000000000, maxShield: 11000000000,
    armor: 180000, damage: 3000000, status: 'active', location: 'Deep Void, Black Hole Perimeter',
    participants: 2300, timeRemaining: 45000,
    rewards: { metal: 20000000, crystal: 16000000, deuterium: 14000000, darkMatter: 2400, credits: 48000000, experience: 4800000, loot: ['Kraken Tentacle', 'Void Ink', 'Abyssal Pearl'] },
    abilities: ['Tentacle Grab', 'Ink Cloud', 'Crushing Depths', 'Void Pull'],
    weaknesses: ['Cutting Lasers', 'Thermal Blades', 'Sonic Cutters'],
    image: 'https://readdy.ai/api/search-image?query=giant%20void%20kraken%20space%20octopus%20with%20massive%20glowing%20tentacles%20emerging%20from%20black%20hole%20dark%20purple%20blue%20bioluminescent%20cosmic%20horror%20deep%20space%20monster&width=800&height=600&seq=worldboss-25&orientation=landscape',
    difficulty: 'Epic'
  },
  {
    id: 26, name: 'Radiant Seraphim', title: 'Light Incarnate', tier: 58, level: 580,
    health: 44000000000, maxHealth: 44000000000, shield: 30000000000, maxShield: 30000000000,
    armor: 300000, damage: 6200000, status: 'upcoming', location: 'Light Realm, Radiant Convergence',
    participants: 0, timeRemaining: 259200,
    rewards: { metal: 42000000, crystal: 42000000, deuterium: 30000000, darkMatter: 5500, credits: 110000000, experience: 11000000, loot: ['Radiant Core', 'Seraphim Wing', 'Light Shard', 'Divine Essence'] },
    abilities: ['Blinding Light', 'Holy Nova', 'Purification Ray', 'Ascension Aura', 'Divine Intervention'],
    weaknesses: ['Shadow Corruption', 'Void Weapons', 'Dark Energy'],
    image: 'https://readdy.ai/api/search-image?query=radiant%20seraphim%20angel%20made%20of%20pure%20blinding%20white%20light%20twelve%20wings%20golden%20halo%20divine%20majestic%20celestial%20being%20floating%20in%20cosmic%20radiance&width=800&height=600&seq=worldboss-26&orientation=landscape',
    difficulty: 'Mythic'
  },
  {
    id: 27, name: 'Overgrowth Ancient', title: 'Primeval Forest Spirit', tier: 16, level: 160,
    health: 4500000000, maxHealth: 4500000000, shield: 1800000000, maxShield: 1800000000,
    armor: 120000, damage: 750000, status: 'active', location: 'Verdant World, Ancient Forest',
    participants: 680, timeRemaining: 90000,
    rewards: { metal: 6000000, crystal: 7000000, deuterium: 5000000, darkMatter: 500, credits: 10000000, experience: 1000000, loot: ['Ancient Seed', 'Verdant Core', 'Nature Essence'] },
    abilities: ['Vine Whip', 'Root Entangle', 'Spore Cloud', 'Regeneration'],
    weaknesses: ['Fire Weapons', 'Toxins', 'Defoliants'],
    image: 'https://readdy.ai/api/search-image?query=ancient%20forest%20spirit%20giant%20treant%20made%20of%20cosmic%20vines%20and%20glowing%20green%20energy%20roots%20stretching%20through%20space%20bioluminescent%20nature%20entity&width=800&height=600&seq=worldboss-27&orientation=landscape',
    difficulty: 'Normal'
  },
  {
    id: 28, name: 'Doomsday Machine', title: 'Planet Cracker', tier: 68, level: 680,
    health: 65000000000, maxHealth: 65000000000, shield: 40000000000, maxShield: 40000000000,
    armor: 700000, damage: 10000000, status: 'active', location: 'Orbiting Destroyed World, Wasteland System',
    participants: 7100, timeRemaining: 18000,
    rewards: { metal: 70000000, crystal: 50000000, deuterium: 40000000, darkMatter: 8000, credits: 180000000, experience: 18000000, loot: ['Doomsday Core', 'Planet Cracker Fragment', 'Armageddon Blueprint', 'Extinction Key'] },
    abilities: ['Planet Cracker Beam', 'Missile Swarm', 'Laser Grid', 'Overload', 'Self Destruct Sequence'],
    weaknesses: ['Hacking', 'Core Override', 'Reactor Destabilizer'],
    image: 'https://readdy.ai/api/search-image?query=giant%20doomsday%20machine%20planet%20cracker%20superweapon%20massive%20mechanical%20construct%20with%20giant%20energy%20cannon%20destroying%20a%20planet%20apocalyptic%20scifi%20boss&width=800&height=600&seq=worldboss-28&orientation=landscape',
    difficulty: 'Mythic'
  },
  {
    id: 29, name: 'Phantom Reaper', title: 'Soul Harvester', tier: 40, level: 400,
    health: 28000000000, maxHealth: 28000000000, shield: 14000000000, maxShield: 14000000000,
    armor: 250000, damage: 3800000, status: 'defeated', location: 'Soul Nebula, Death Realm',
    participants: 3900, timeRemaining: 0,
    rewards: { metal: 28000000, crystal: 20000000, deuterium: 15000000, darkMatter: 2800, credits: 60000000, experience: 6000000, loot: ['Reaper Scythe', 'Soul Crystal', 'Death Essence'] },
    abilities: ['Soul Harvest', 'Death Mark', 'Reaper Slash', 'Shadow Clone'],
    weaknesses: ['Life Weapons', 'Healing Energy', 'Purification'],
    image: 'https://readdy.ai/api/search-image?query=phantom%20reaper%20grim%20reaper%20in%20space%20hooded%20skeletal%20figure%20with%20cosmic%20scythe%20made%20of%20starlight%20dark%20cloak%20flowing%20through%20void%20death%20entity%20boss&width=800&height=600&seq=worldboss-29&orientation=landscape',
    difficulty: 'Epic', respawnTime: '120 hours'
  },
  {
    id: 30, name: 'Living Planet', title: 'Gaia Colossus', tier: 80, level: 800,
    health: 120000000000, maxHealth: 120000000000, shield: 60000000000, maxShield: 60000000000,
    armor: 1500000, damage: 12000000, status: 'upcoming', location: 'Sentient System, Living World Orbit',
    participants: 0, timeRemaining: 518400,
    rewards: { metal: 150000000, crystal: 100000000, deuterium: 80000000, darkMatter: 20000, credits: 500000000, experience: 50000000, loot: ['Gaia Core', 'World Seed', 'Planetary Essence', 'Terraforming Key', 'Creation Blueprint'] },
    abilities: ['Tectonic Shift', 'Atmospheric Storm', 'Gravity Surge', 'World Shaper', 'Gaia Wrath', 'Continental Drift'],
    weaknesses: ['Death Star Weapons', 'Orbital Bombardment', 'Core Breakers'],
    image: 'https://readdy.ai/api/search-image?query=living%20sentient%20planet%20with%20a%20giant%20face%20and%20glowing%20eyes%20continents%20forming%20facial%20features%20surrounded%20by%20green%20aurora%20cosmic%20entity%20planetary%20boss&width=800&height=600&seq=worldboss-30&orientation=landscape',
    difficulty: 'Godlike'
  },
  {
    id: 31, name: 'Steel Hydra', title: 'Multi-Headed Destroyer', tier: 33, level: 330,
    health: 17000000000, maxHealth: 17000000000, shield: 8500000000, maxShield: 8500000000,
    armor: 300000, damage: 2700000, status: 'active', location: 'Industrial Wasteland, Factory Graveyard',
    participants: 2000, timeRemaining: 48000,
    rewards: { metal: 22000000, crystal: 8000000, deuterium: 7000000, darkMatter: 1800, credits: 38000000, experience: 3800000, loot: ['Hydra Head', 'Steel Scale', 'Regeneration Fluid'] },
    abilities: ['Multi-Bite', 'Steel Tail', 'Regeneration', 'Toxic Breath', 'Head Regrowth'],
    weaknesses: ['Fire Weapons', 'Decapitation Strikes', 'Cauterizing Beams'],
    image: 'https://readdy.ai/api/search-image?query=mechanical%20steel%20hydra%20with%20multiple%20serpent%20heads%20made%20of%20industrial%20metal%20pipes%20and%20gears%20glowing%20red%20eyes%20toxic%20green%20breath%20mechanical%20monster%20in%20space&width=800&height=600&seq=worldboss-31&orientation=landscape',
    difficulty: 'Epic'
  },
  {
    id: 32, name: 'Cosmic Ooze', title: 'Primordial Slime', tier: 12, level: 120,
    health: 3000000000, maxHealth: 3000000000, shield: 1000000000, maxShield: 1000000000,
    armor: 30000, damage: 500000, status: 'active', location: 'Primordial Nebula, Genesis Zone',
    participants: 450, timeRemaining: 108000,
    rewards: { metal: 4000000, crystal: 4000000, deuterium: 4000000, darkMatter: 300, credits: 8000000, experience: 800000, loot: ['Primordial Goo', 'Genesis Slime', 'Evolution Catalyst'] },
    abilities: ['Engulf', 'Split', 'Acid Touch', 'Shape Shift'],
    weaknesses: ['Cold Weapons', 'Solidifiers', 'Dehydrators'],
    image: 'https://readdy.ai/api/search-image?query=giant%20cosmic%20ooze%20slime%20monster%20translucent%20gelatinous%20blob%20floating%20in%20space%20rainbow%20colors%20iridescent%20goo%20consuming%20asteroids%20primordial%20entity&width=800&height=600&seq=worldboss-32&orientation=landscape',
    difficulty: 'Normal'
  },
  {
    id: 33, name: 'Warp Demon', title: 'Hyperspace Predator', tier: 46, level: 460,
    health: 34000000000, maxHealth: 34000000000, shield: 17000000000, maxShield: 17000000000,
    armor: 220000, damage: 4800000, status: 'active', location: 'Warp Corridor, Hyperspace Anomaly',
    participants: 3100, timeRemaining: 32000,
    rewards: { metal: 32000000, crystal: 26000000, deuterium: 22000000, darkMatter: 3200, credits: 72000000, experience: 7200000, loot: ['Warp Crystal', 'Demon Horn', 'Hyperspace Essence', 'Teleport Shard'] },
    abilities: ['Warp Strike', 'Phase Shift', 'Dimensional Rend', 'Blink', 'Hyperspace Ambush'],
    weaknesses: ['Warp Disruptors', 'Dimensional Anchors', 'Phase Locks'],
    image: 'https://readdy.ai/api/search-image?query=warp%20demon%20hyperspace%20predator%20with%20jagged%20crystalline%20body%20glowing%20red%20purple%20energy%20dimensional%20tears%20around%20it%20teleporting%20between%20realities%20nightmare%20scifi%20entity&width=800&height=600&seq=worldboss-33&orientation=landscape',
    difficulty: 'Legendary'
  },
  {
    id: 34, name: 'Golden Golem', title: 'Auric Guardian', tier: 27, level: 270,
    health: 11000000000, maxHealth: 11000000000, shield: 6500000000, maxShield: 6500000000,
    armor: 450000, damage: 2000000, status: 'defeated', location: 'Golden Asteroid, Treasure Nebula',
    participants: 2800, timeRemaining: 0,
    rewards: { metal: 30000000, crystal: 10000000, deuterium: 5000000, darkMatter: 1500, credits: 35000000, experience: 3000000, loot: ['Gold Core', 'Auric Plate', 'Treasure Map'] },
    abilities: ['Golden Shield', 'Auric Beam', 'Midas Touch', 'Treasure Rain'],
    weaknesses: ['Rust Weapons', 'Acid Attacks', 'Corrosion Agents'],
    image: 'https://readdy.ai/api/search-image?query=massive%20golden%20golem%20guardian%20made%20of%20pure%20gold%20standing%20on%20asteroid%20field%20glowing%20warm%20amber%20light%20majestic%20ancient%20construct%20with%20ornate%20engravings&width=800&height=600&seq=worldboss-34&orientation=landscape',
    difficulty: 'Heroic', respawnTime: '48 hours'
  },
  {
    id: 35, name: 'Storm Leviathan', title: 'Hurricane of the Void', tier: 34, level: 340,
    health: 19000000000, maxHealth: 19000000000, shield: 9500000000, maxShield: 9500000000,
    armor: 200000, damage: 2900000, status: 'active', location: 'Cyclone Nebula, Storm Center',
    participants: 2200, timeRemaining: 42000,
    rewards: { metal: 19000000, crystal: 14000000, deuterium: 16000000, darkMatter: 2100, credits: 42000000, experience: 4200000, loot: ['Storm Eye', 'Cyclone Scale', 'Wind Essence'] },
    abilities: ['Hurricane', 'Lightning Storm', 'Tornado Spin', 'Pressure Wave'],
    weaknesses: ['Anchor Weapons', 'Stabilizers', 'Calm Fields'],
    image: 'https://readdy.ai/api/search-image?query=giant%20storm%20leviathan%20serpent%20made%20of%20hurricane%20winds%20and%20lightning%20swirling%20through%20cosmic%20nebula%20elemental%20air%20monster%20electric%20blue%20white%20energy&width=800&height=600&seq=worldboss-35&orientation=landscape',
    difficulty: 'Epic'
  },
  {
    id: 36, name: 'Oblivion Sphere', title: 'Perfect Annihilator', tier: 90, level: 900,
    health: 180000000000, maxHealth: 180000000000, shield: 90000000000, maxShield: 90000000000,
    armor: 3000000, damage: 20000000, status: 'upcoming', location: 'Outer Void, Edge of Existence',
    participants: 0, timeRemaining: 604800,
    rewards: { metal: 300000000, crystal: 250000000, deuterium: 200000000, darkMatter: 50000, credits: 1000000000, experience: 100000000, loot: ['Oblivion Core', 'Nothingness Shard', 'Extinction Stone', 'Final Blueprint', 'End Key'] },
    abilities: ['Annihilation', 'Void Sphere', 'Existence Erasure', 'Absolute Zero', 'Entropy Field', 'Universal Collapse'],
    weaknesses: ['Creation Energy', 'Life Force', 'Reality Anchors'],
    image: 'https://readdy.ai/api/search-image?query=perfect%20black%20sphere%20of%20oblivion%20floating%20in%20absolute%20void%20absorbing%20all%20light%20and%20matter%20around%20it%20event%20horizon%20ring%20dark%20cosmic%20ultimate%20destruction%20entity&width=800&height=600&seq=worldboss-36&orientation=landscape',
    difficulty: 'Godlike'
  },
  {
    id: 37, name: 'Iron Behemoth', title: 'Armored Juggernaut', tier: 19, level: 190,
    health: 7000000000, maxHealth: 7000000000, shield: 4000000000, maxShield: 4000000000,
    armor: 400000, damage: 1100000, status: 'active', location: 'Scrap Field, Junk Nebula',
    participants: 880, timeRemaining: 78000,
    rewards: { metal: 15000000, crystal: 3000000, deuterium: 3000000, darkMatter: 700, credits: 14000000, experience: 1400000, loot: ['Iron Plate', 'Armor Core', 'Scrap Metal'] },
    abilities: ['Iron Defense', 'Charge', 'Armor Crush', 'Metal Storm'],
    weaknesses: ['Armor Piercing', 'Magnetic Weapons', 'Rust Agents'],
    image: 'https://readdy.ai/api/search-image?query=massive%20iron%20behemoth%20armored%20juggernaut%20made%20of%20scrap%20metal%20and%20rusted%20plates%20hulking%20mechanical%20monster%20in%20space%20debris%20field%20industrial%20boss&width=800&height=600&seq=worldboss-37&orientation=landscape',
    difficulty: 'Normal'
  },
  {
    id: 38, name: 'Sand Wyrm Emperor', title: 'Desert Colossus', tier: 21, level: 210,
    health: 8500000000, maxHealth: 8500000000, shield: 4000000000, maxShield: 4000000000,
    armor: 200000, damage: 1400000, status: 'active', location: 'Desert World, Endless Dunes',
    participants: 1100, timeRemaining: 68000,
    rewards: { metal: 11000000, crystal: 9000000, deuterium: 7000000, darkMatter: 900, credits: 18000000, experience: 1800000, loot: ['Emperor Scale', 'Sand Crystal', 'Desert Heart'] },
    abilities: ['Sand Storm', 'Burrow', 'Devour', 'Sand Blast'],
    weaknesses: ['Water Weapons', 'Freezing Agents', 'Compactors'],
    image: 'https://readdy.ai/api/search-image?query=giant%20sand%20wyrm%20emperor%20desert%20serpent%20bursting%20from%20golden%20dunes%20under%20alien%20sky%20massive%20armored%20body%20segmented%20worm%20boss%20creature&width=800&height=600&seq=worldboss-38&orientation=landscape',
    difficulty: 'Heroic'
  },
  {
    id: 39, name: 'Blood Moon Lord', title: 'Crimson Sovereign', tier: 47, level: 470,
    health: 36000000000, maxHealth: 36000000000, shield: 18000000000, maxShield: 18000000000,
    armor: 280000, damage: 5200000, status: 'active', location: 'Blood Nebula, Crimson System',
    participants: 3600, timeRemaining: 38000,
    rewards: { metal: 35000000, crystal: 35000000, deuterium: 25000000, darkMatter: 3600, credits: 85000000, experience: 8500000, loot: ['Blood Crystal', 'Crimson Core', 'Moon Shard', 'Vampiric Essence'] },
    abilities: ['Blood Drain', 'Crimson Storm', 'Lunar Eclipse', 'Vampiric Aura', 'Blood Moon Rising'],
    weaknesses: ['Silver Weapons', 'Holy Light', 'Purification'],
    image: 'https://readdy.ai/api/search-image?query=blood%20moon%20lord%20crimson%20entity%20floating%20before%20a%20giant%20red%20moon%20dark%20gothic%20cosmic%20horror%20vampire%20lord%20with%20blood%20red%20energy%20and%20bat%20wings&width=800&height=600&seq=worldboss-39&orientation=landscape',
    difficulty: 'Legendary'
  },
  {
    id: 40, name: 'Arcane Archon', title: 'Master of Magic', tier: 54, level: 540,
    health: 41000000000, maxHealth: 41000000000, shield: 28000000000, maxShield: 28000000000,
    armor: 250000, damage: 5800000, status: 'upcoming', location: 'Arcane Realm, Magic Convergence',
    participants: 0, timeRemaining: 288000,
    rewards: { metal: 40000000, crystal: 40000000, deuterium: 30000000, darkMatter: 5000, credits: 100000000, experience: 10000000, loot: ['Arcane Crystal', 'Archon Staff', 'Spell Tome', 'Magic Essence'] },
    abilities: ['Arcane Blast', 'Magic Shield', 'Elemental Storm', 'Teleport', 'Mana Burn'],
    weaknesses: ['Anti-Magic Fields', 'Nullifiers', 'Silence Weapons'],
    image: 'https://readdy.ai/api/search-image?query=arcane%20archon%20floating%20wizard%20entity%20made%20of%20pure%20magical%20energy%20runes%20and%20spell%20circles%20orbiting%20around%20it%20cosmic%20magic%20boss%20with%20glowing%20staff&width=800&height=600&seq=worldboss-40&orientation=landscape',
    difficulty: 'Mythic'
  },
  {
    id: 41, name: 'Fungal Overlord', title: 'Spore Sovereign', tier: 14, level: 140,
    health: 3800000000, maxHealth: 3800000000, shield: 1500000000, maxShield: 1500000000,
    armor: 80000, damage: 650000, status: 'active', location: 'Fungal World, Spore Forest',
    participants: 550, timeRemaining: 96000,
    rewards: { metal: 5000000, crystal: 6000000, deuterium: 4000000, darkMatter: 400, credits: 8000000, experience: 800000, loot: ['Giant Spore', 'Fungal Core', 'Mycelium Network'] },
    abilities: ['Spore Cloud', 'Fungal Growth', 'Parasitic Spores', 'Root Network'],
    weaknesses: ['Fire Weapons', 'Fungicide', 'UV Radiation'],
    image: 'https://readdy.ai/api/search-image?query=giant%20fungal%20overlord%20massive%20mushroom%20entity%20with%20glowing%20spores%20and%20mycelium%20tendrils%20bioluminescent%20alien%20forest%20background%20organic%20horror%20boss&width=800&height=600&seq=worldboss-41&orientation=landscape',
    difficulty: 'Normal'
  },
  {
    id: 42, name: 'Celestial Dragon', title: 'Star Forged Wyrm', tier: 62, level: 620,
    health: 52000000000, maxHealth: 52000000000, shield: 32000000000, maxShield: 32000000000,
    armor: 500000, damage: 7200000, status: 'active', location: 'Dragon Nebula, Celestial Realm',
    participants: 5500, timeRemaining: 28000,
    rewards: { metal: 50000000, crystal: 50000000, deuterium: 35000000, darkMatter: 6500, credits: 130000000, experience: 13000000, loot: ['Dragon Heart', 'Celestial Scale', 'Star Breath', 'Constellation Fragment'] },
    abilities: ['Star Breath', 'Constellation Roar', 'Celestial Flight', 'Dragon Fury', 'Meteor Swarm'],
    weaknesses: ['Dragon Slayer Weapons', 'Anti-Dragon Runes', 'Sky Anchors'],
    image: 'https://readdy.ai/api/search-image?query=celestial%20dragon%20made%20of%20stars%20and%20constellations%20cosmic%20dragon%20with%20galaxy%20patterned%20scales%20flying%20through%20nebula%20golden%20eyes%20majestic%20mythical%20space%20creature&width=800&height=600&seq=worldboss-42&orientation=landscape',
    difficulty: 'Mythic'
  },
  {
    id: 43, name: 'Techno Lich', title: 'Undead AI', tier: 41, level: 410,
    health: 29000000000, maxHealth: 29000000000, shield: 20000000000, maxShield: 20000000000,
    armor: 220000, damage: 4200000, status: 'defeated', location: 'Cryptosphere, Digital Graveyard',
    participants: 4500, timeRemaining: 0,
    rewards: { metal: 30000000, crystal: 20000000, deuterium: 18000000, darkMatter: 3000, credits: 65000000, experience: 6500000, loot: ['Lich Core', 'Digital Soul', 'Necro-Code'] },
    abilities: ['Data Drain', 'Digital Necromancy', 'Firewall of Bones', 'Malware Storm'],
    weaknesses: ['Antivirus Weapons', 'Purge Codes', 'Clean Install'],
    image: 'https://readdy.ai/api/search-image?query=techno%20lich%20undead%20artificial%20intelligence%20skeletal%20robot%20with%20glowing%20green%20circuits%20and%20holographic%20runes%20digital%20necromancer%20in%20cyberspace%20boss&width=800&height=600&seq=worldboss-43&orientation=landscape',
    difficulty: 'Epic', respawnTime: '72 hours'
  },
  {
    id: 44, name: 'Twin Sun Phoenix', title: 'Binary Star Reborn', tier: 49, level: 490,
    health: 37000000000, maxHealth: 37000000000, shield: 19000000000, maxShield: 19000000000,
    armor: 350000, damage: 5000000, status: 'active', location: 'Binary System, Twin Star Orbit',
    participants: 4200, timeRemaining: 32000,
    rewards: { metal: 38000000, crystal: 28000000, deuterium: 28000000, darkMatter: 4000, credits: 85000000, experience: 8500000, loot: ['Twin Flame', 'Solar Feather', 'Binary Core', 'Nova Essence'] },
    abilities: ['Twin Flames', 'Solar Dance', 'Binary Nova', 'Heat Sync', 'Dual Ignition'],
    weaknesses: ['Eclipse Weapons', 'Orbital Disruptors', 'Gravity Wells'],
    image: 'https://readdy.ai/api/search-image?query=twin%20phoenix%20bird%20made%20of%20two%20suns%20binary%20star%20fire%20twin%20headed%20phoenix%20with%20golden%20and%20blue%20flames%20cosmic%20rebirth%20entity%20boss&width=800&height=600&seq=worldboss-44&orientation=landscape',
    difficulty: 'Legendary'
  },
  {
    id: 45, name: 'Abyssal Angler', title: 'Deep Space Predator', tier: 23, level: 230,
    health: 9000000000, maxHealth: 9000000000, shield: 5000000000, maxShield: 5000000000,
    armor: 150000, damage: 1700000, status: 'active', location: 'Dark Nebula, Abyssal Trench',
    participants: 1300, timeRemaining: 56000,
    rewards: { metal: 12000000, crystal: 10000000, deuterium: 8000000, darkMatter: 1300, credits: 22000000, experience: 2200000, loot: ['Angler Light', 'Abyssal Fang', 'Deep Scale'] },
    abilities: ['Lure Light', 'Ambush Strike', 'Deep Crush', 'Bioluminescent Flash'],
    weaknesses: ['Sonic Weapons', 'Bright Flares', 'EMP Pulses'],
    image: 'https://readdy.ai/api/search-image?query=giant%20abyssal%20angler%20fish%20in%20deep%20space%20with%20glowing%20bioluminescent%20lure%20massive%20teeth%20dark%20void%20cosmic%20ocean%20predator%20monster%20boss&width=800&height=600&seq=worldboss-45&orientation=landscape',
    difficulty: 'Heroic'
  },
  {
    id: 46, name: 'Clockwork Titan', title: 'Gear Lord', tier: 37, level: 370,
    health: 23000000000, maxHealth: 23000000000, shield: 12000000000, maxShield: 12000000000,
    armor: 550000, damage: 3100000, status: 'active', location: 'Mechanus Sector, Gear World',
    participants: 2500, timeRemaining: 44000,
    rewards: { metal: 28000000, crystal: 15000000, deuterium: 12000000, darkMatter: 2200, credits: 48000000, experience: 4800000, loot: ['Gear Core', 'Clockwork Heart', 'Precision Part'] },
    abilities: ['Gear Grind', 'Clockwork Army', 'Time Gear', 'Mechanical Precision', 'Overclock'],
    weaknesses: ['Rust Weapons', 'Sand Blasters', 'Jamming Devices'],
    image: 'https://readdy.ai/api/search-image?query=giant%20clockwork%20titan%20made%20of%20brass%20gears%20and%20mechanical%20parts%20steampunk%20colossus%20with%20ticking%20clock%20face%20chest%20cosmic%20mechanical%20boss&width=800&height=600&seq=worldboss-46&orientation=landscape',
    difficulty: 'Epic'
  },
  {
    id: 47, name: 'Rift Walker', title: 'Dimensional Nomad', tier: 56, level: 560,
    health: 43000000000, maxHealth: 43000000000, shield: 24000000000, maxShield: 24000000000,
    armor: 180000, damage: 6500000, status: 'active', location: 'Rift Junction, Crossroads of Reality',
    participants: 5000, timeRemaining: 26000,
    rewards: { metal: 45000000, crystal: 35000000, deuterium: 30000000, darkMatter: 4800, credits: 95000000, experience: 9500000, loot: ['Rift Shard', 'Walker Essence', 'Dimensional Map', 'Portal Key'] },
    abilities: ['Rift Walk', 'Dimensional Slice', 'Portal Ambush', 'Reality Shift', 'Parallel Strike'],
    weaknesses: ['Spatial Locks', 'Dimensional Anchors', 'Reality Cages'],
    image: 'https://readdy.ai/api/search-image?query=rift%20walker%20dimensional%20nomad%20humanoid%20entity%20stepping%20between%20reality%20tears%20multiple%20after%20images%20purple%20blue%20energy%20portals%20opening%20around%20it%20cosmic%20traveler%20boss&width=800&height=600&seq=worldboss-47&orientation=landscape',
    difficulty: 'Legendary'
  },
  {
    id: 48, name: 'Obsidian Dragon', title: 'Volcanic Wyrm', tier: 39, level: 390,
    health: 26000000000, maxHealth: 26000000000, shield: 13000000000, maxShield: 13000000000,
    armor: 450000, damage: 3400000, status: 'active', location: 'Obsidian Belt, Volcanic Zone',
    participants: 2900, timeRemaining: 40000,
    rewards: { metal: 25000000, crystal: 18000000, deuterium: 16000000, darkMatter: 2600, credits: 55000000, experience: 5500000, loot: ['Obsidian Scale', 'Volcanic Heart', 'Dragon Glass'] },
    abilities: ['Obsidian Breath', 'Volcanic Eruption', 'Magma Armor', 'Lava Pool'],
    weaknesses: ['Water Weapons', 'Thermal Shock', 'Rapid Cooling'],
    image: 'https://readdy.ai/api/search-image?query=obsidian%20dragon%20volcanic%20wyrm%20made%20of%20black%20glass%20and%20flowing%20magma%20cracks%20of%20orange%20lava%20glowing%20through%20dark%20scales%20epic%20fantasy%20space%20dragon%20boss&width=800&height=600&seq=worldboss-48&orientation=landscape',
    difficulty: 'Epic'
  },
  {
    id: 49, name: 'Star Weaver', title: 'Cosmic Artisan', tier: 63, level: 630,
    health: 55000000000, maxHealth: 55000000000, shield: 35000000000, maxShield: 35000000000,
    armor: 350000, damage: 7800000, status: 'upcoming', location: 'Creation Nebula, Star Forge',
    participants: 0, timeRemaining: 345600,
    rewards: { metal: 60000000, crystal: 50000000, deuterium: 40000000, darkMatter: 7500, credits: 160000000, experience: 16000000, loot: ['Star Thread', 'Weaver Needle', 'Constellation Map', 'Creation Essence'] },
    abilities: ['Star Weave', 'Constellation Bind', 'Nova Thread', 'Creation Pulse', 'Cosmic Loom'],
    weaknesses: ['Entropy Weapons', 'Unravelers', 'Chaos Energy'],
    image: 'https://readdy.ai/api/search-image?query=star%20weaver%20cosmic%20artisan%20entity%20made%20of%20golden%20threads%20connecting%20stars%20weaving%20constellations%20giant%20loom%20of%20starlight%20celestial%20creator%20boss&width=800&height=600&seq=worldboss-49&orientation=landscape',
    difficulty: 'Mythic'
  },
  {
    id: 50, name: 'Plague Carrier', title: 'Pestilence Incarnate', tier: 31, level: 310,
    health: 16000000000, maxHealth: 16000000000, shield: 8000000000, maxShield: 8000000000,
    armor: 120000, damage: 2500000, status: 'active', location: 'Quarantine Zone, Plague Nebula',
    participants: 3100, timeRemaining: 38000,
    rewards: { metal: 16000000, crystal: 12000000, deuterium: 10000000, darkMatter: 1800, credits: 35000000, experience: 3500000, loot: ['Plague Sample', 'Viral Core', 'Antidote Formula'] },
    abilities: ['Plague Cloud', 'Disease Spread', 'Toxic Aura', 'Contagion Burst'],
    weaknesses: ['Medical Drones', 'Antiviral Weapons', 'Sterilization Beams'],
    image: 'https://readdy.ai/api/search-image?query=plague%20carrier%20pestilence%20entity%20green%20toxic%20clouds%20rotting%20flesh%20glowing%20sickly%20energy%20disease%20monster%20surrounded%20by%20floating%20viral%20particles%20cosmic%20horror%20boss&width=800&height=600&seq=worldboss-50&orientation=landscape',
    difficulty: 'Epic'
  },
  {
    id: 51, name: 'Star Forge Colossus', title: 'Celestial Smith', tier: 66, level: 660,
    health: 62000000000, maxHealth: 62000000000, shield: 38000000000, maxShield: 38000000000,
    armor: 650000, damage: 8500000, status: 'active', location: 'Star Forge, Creation Anvil',
    participants: 6500, timeRemaining: 22000,
    rewards: { metal: 65000000, crystal: 45000000, deuterium: 40000000, darkMatter: 7500, credits: 170000000, experience: 17000000, loot: ['Forge Hammer', 'Star Metal', 'Celestial Anvil', 'Smith Blueprint'] },
    abilities: ['Forge Strike', 'Star Hammer', 'Anvil Slam', 'Molten Metal', 'Creation Spark'],
    weaknesses: ['Cooling Weapons', 'Quenching Agents', 'Forge Disruptors'],
    image: 'https://readdy.ai/api/search-image?query=giant%20star%20forge%20colossus%20celestial%20smith%20holding%20massive%20hammer%20striking%20at%20an%20anvil%20made%20of%20a%20star%20golden%20molten%20metal%20splashing%20cosmic%20forge%20boss&width=800&height=600&seq=worldboss-51&orientation=landscape',
    difficulty: 'Mythic'
  },
  {
    id: 52, name: 'Mirror Entity', title: 'Reflection Doppelganger', tier: 43, level: 430,
    health: 31000000000, maxHealth: 31000000000, shield: 16000000000, maxShield: 16000000000,
    armor: 200000, damage: 4400000, status: 'defeated', location: 'Mirror Dimension, Reflection Zone',
    participants: 3800, timeRemaining: 0,
    rewards: { metal: 30000000, crystal: 25000000, deuterium: 20000000, darkMatter: 3100, credits: 70000000, experience: 7000000, loot: ['Mirror Shard', 'Reflection Core', 'Doppelganger Essence'] },
    abilities: ['Mirror Copy', 'Reflection Shield', 'Doppelganger Swarm', 'Identity Theft'],
    weaknesses: ['True Sight', 'Identity Anchors', 'Reality Confirmers'],
    image: 'https://readdy.ai/api/search-image?query=mirror%20entity%20made%20of%20shattered%20glass%20and%20reflections%20floating%20in%20space%20multiple%20distorted%20copies%20of%20itself%20appearing%20in%20mirror%20shards%20surreal%20cosmic%20boss&width=800&height=600&seq=worldboss-52&orientation=landscape',
    difficulty: 'Legendary', respawnTime: '96 hours'
  },
  {
    id: 53, name: 'Ember Lord', title: 'Cinder Sovereign', tier: 17, level: 170,
    health: 5500000000, maxHealth: 5500000000, shield: 2500000000, maxShield: 2500000000,
    armor: 150000, damage: 900000, status: 'active', location: 'Ember Fields, Ash Nebula',
    participants: 780, timeRemaining: 84000,
    rewards: { metal: 8000000, crystal: 6000000, deuterium: 5000000, darkMatter: 550, credits: 11000000, experience: 1100000, loot: ['Ember Core', 'Cinder Crown', 'Ash Essence'] },
    abilities: ['Ember Storm', 'Cinder Rain', 'Ash Cloud', 'Heat Wave'],
    weaknesses: ['Water Weapons', 'Sand Blasters', 'Smothering Agents'],
    image: 'https://readdy.ai/api/search-image?query=ember%20lord%20cinder%20sovereign%20made%20of%20glowing%20embers%20and%20ash%20floating%20through%20dark%20nebula%20burning%20orange%20red%20hot%20coals%20forming%20a%20humanoid%20shape%20elemental%20fire%20boss&width=800&height=600&seq=worldboss-53&orientation=landscape',
    difficulty: 'Normal'
  },
  {
    id: 54, name: 'Void Architect', title: 'Builder of Nothing', tier: 72, level: 720,
    health: 75000000000, maxHealth: 75000000000, shield: 42000000000, maxShield: 42000000000,
    armor: 800000, damage: 9500000, status: 'upcoming', location: 'Construction Void, Negative Space',
    participants: 0, timeRemaining: 432000,
    rewards: { metal: 90000000, crystal: 80000000, deuterium: 60000000, darkMatter: 15000, credits: 250000000, experience: 25000000, loot: ['Void Blueprint', 'Architect Tool', 'Nothing Brick', 'Creation Void Key'] },
    abilities: ['Void Construction', 'Reality Demolition', 'Nothing Beam', 'Negative Space', 'Architect Vision'],
    weaknesses: ['Creation Weapons', 'Matter Generators', 'Reality Fillers'],
    image: 'https://readdy.ai/api/search-image?query=void%20architect%20builder%20entity%20made%20of%20pure%20darkness%20and%20negative%20space%20holding%20blueprints%20of%20nothing%20geometric%20void%20shapes%20floating%20around%20cosmic%20construction%20boss&width=800&height=600&seq=worldboss-54&orientation=landscape',
    difficulty: 'Mythic'
  },
  {
    id: 55, name: 'Thunderhawk Prime', title: 'Storm Wing', tier: 26, level: 260,
    health: 10500000000, maxHealth: 10500000000, shield: 6000000000, maxShield: 6000000000,
    armor: 160000, damage: 1900000, status: 'active', location: 'Storm Belt, Lightning Nebula',
    participants: 1550, timeRemaining: 52000,
    rewards: { metal: 14000000, crystal: 11000000, deuterium: 9000000, darkMatter: 1500, credits: 28000000, experience: 2800000, loot: ['Thunder Feather', 'Storm Wing', 'Lightning Crystal'] },
    abilities: ['Thunder Dive', 'Lightning Wings', 'Storm Screech', 'Electric Field'],
    weaknesses: ['Grounding Nets', 'Insulated Traps', 'Static Dissipators'],
    image: 'https://readdy.ai/api/search-image?query=giant%20thunderhawk%20prime%20electric%20bird%20made%20of%20lightning%20and%20storm%20clouds%20massive%20wings%20spanning%20across%20nebula%20blue%20white%20crackling%20energy%20cosmic%20bird%20boss&width=800&height=600&seq=worldboss-55&orientation=landscape',
    difficulty: 'Heroic'
  },
  {
    id: 56, name: 'Toxic Behemoth', title: 'Venom Colossus', tier: 29, level: 290,
    health: 13000000000, maxHealth: 13000000000, shield: 7000000000, maxShield: 7000000000,
    armor: 200000, damage: 2300000, status: 'active', location: 'Toxic Sector, Acid Nebula',
    participants: 1800, timeRemaining: 46000,
    rewards: { metal: 15000000, crystal: 13000000, deuterium: 11000000, darkMatter: 1700, credits: 32000000, experience: 3200000, loot: ['Venom Gland', 'Toxic Core', 'Acid Sac'] },
    abilities: ['Acid Spray', 'Venom Strike', 'Toxic Cloud', 'Poison Aura'],
    weaknesses: ['Alkaline Weapons', 'Neutralizers', 'Purification'],
    image: 'https://readdy.ai/api/search-image?query=toxic%20behemoth%20venom%20colossus%20giant%20green%20purple%20pulsating%20monster%20with%20acid%20dripping%20from%20its%20body%20toxic%20fumes%20surrounding%20it%20in%20space%20chemical%20horror%20boss&width=800&height=600&seq=worldboss-56&orientation=landscape',
    difficulty: 'Heroic'
  },
  {
    id: 57, name: 'Cosmic Whale', title: 'Star Migrator', tier: 51, level: 510,
    health: 40000000000, maxHealth: 40000000000, shield: 21000000000, maxShield: 21000000000,
    armor: 400000, damage: 5300000, status: 'active', location: 'Migration Route, Stellar Current',
    participants: 4600, timeRemaining: 30000,
    rewards: { metal: 42000000, crystal: 32000000, deuterium: 28000000, darkMatter: 4200, credits: 90000000, experience: 9000000, loot: ['Whale Song', 'Cosmic Blubber', 'Migration Map', 'Star Milk'] },
    abilities: ['Sonic Song', 'Tail Slam', 'Filter Feed', 'Deep Dive', 'Breach'],
    weaknesses: ['Harpoons', 'Sonic Disruptors', 'Navigation Jammers'],
    image: 'https://readdy.ai/api/search-image?query=giant%20cosmic%20whale%20swimming%20through%20space%20stars%20and%20nebula%20glowing%20bioluminescent%20patterns%20on%20its%20body%20majestic%20star%20whale%20with%20ethereal%20fins%20celestial%20creature&width=800&height=600&seq=worldboss-57&orientation=landscape',
    difficulty: 'Legendary'
  },
  {
    id: 58, name: 'Shadow Council', title: 'Five Darkness Lords', tier: 57, level: 570,
    health: 45000000000, maxHealth: 45000000000, shield: 26000000000, maxShield: 26000000000,
    armor: 280000, damage: 6800000, status: 'active', location: 'Shadow Realm, Dark Council Chamber',
    participants: 5300, timeRemaining: 24000,
    rewards: { metal: 48000000, crystal: 38000000, deuterium: 32000000, darkMatter: 5000, credits: 105000000, experience: 10500000, loot: ['Council Ring', 'Shadow Crown', 'Dark Decree', 'Void Seal'] },
    abilities: ['Shadow Council', 'Unified Strike', 'Dark Decree', 'Shadow Puppet', 'Five Fold Attack'],
    weaknesses: ['Light Weapons', 'Divide and Conquer', 'Illumination'],
    image: 'https://readdy.ai/api/search-image?query=shadow%20council%20five%20dark%20lords%20sitting%20on%20thrones%20in%20void%20surrounded%20by%20darkness%20each%20with%20different%20sinister%20forms%20cosmic%20political%20horror%20boss&width=800&height=600&seq=worldboss-58&orientation=landscape',
    difficulty: 'Legendary'
  },
  {
    id: 59, name: 'Asteroid Hive', title: 'Swarm Mother Colony', tier: 13, level: 130,
    health: 3500000000, maxHealth: 3500000000, shield: 1200000000, maxShield: 1200000000,
    armor: 250000, damage: 550000, status: 'active', location: 'Asteroid Belt, Swarm Sector',
    participants: 500, timeRemaining: 100000,
    rewards: { metal: 7000000, crystal: 3000000, deuterium: 3000000, darkMatter: 350, credits: 7000000, experience: 700000, loot: ['Hive Chitin', 'Swarm Egg', 'Drone Blueprint'] },
    abilities: ['Drone Swarm', 'Hive Mind', 'Asteroid Throw', 'Colony Defense'],
    weaknesses: ['Fire Weapons', 'Area Attacks', 'Queen Hunt'],
    image: 'https://readdy.ai/api/search-image?query=giant%20asteroid%20hive%20colony%20organic%20insectoid%20nest%20covering%20an%20asteroid%20swarm%20of%20alien%20bugs%20pouring%20out%20glowing%20organic%20tunnels%20space%20insect%20boss&width=800&height=600&seq=worldboss-59&orientation=landscape',
    difficulty: 'Normal'
  },
  {
    id: 60, name: 'Eternal Sentinel', title: 'Watcher of Eternity', tier: 85, level: 850,
    health: 150000000000, maxHealth: 150000000000, shield: 75000000000, maxShield: 75000000000,
    armor: 2000000, damage: 15000000, status: 'upcoming', location: 'Eternal Gate, Watchtower of Forever',
    participants: 0, timeRemaining: 604800,
    rewards: { metal: 200000000, crystal: 150000000, deuterium: 100000000, darkMatter: 30000, credits: 600000000, experience: 60000000, loot: ['Eternal Eye', 'Sentinel Core', 'Watchtower Key', 'Infinity Shard', 'Eternal Blueprint'] },
    abilities: ['Eternal Gaze', 'Timeless Strike', 'Watchtower Beam', 'Infinity Loop', 'Sentinel Protocol', 'Forever Guard'],
    weaknesses: ['Time Stop', 'Blind Weapons', 'Eternal Sleep'],
    image: 'https://readdy.ai/api/search-image?query=eternal%20sentinel%20giant%20cosmic%20watcher%20with%20a%20single%20all%20seeing%20eye%20floating%20above%20an%20ancient%20watchtower%20made%20of%20stars%20golden%20divine%20guardian%20timeless%20entity%20boss&width=800&height=600&seq=worldboss-60&orientation=landscape',
    difficulty: 'Godlike'
  },
  {
    id: 61, name: 'Glitch Horror', title: 'Corrupted Code', tier: 53, level: 530,
    health: 39000000000, maxHealth: 39000000000, shield: 27000000000, maxShield: 27000000000,
    armor: 150000, damage: 5600000, status: 'active', location: 'Glitch Sector, Broken Code Zone',
    participants: 4400, timeRemaining: 28000,
    rewards: { metal: 38000000, crystal: 32000000, deuterium: 26000000, darkMatter: 4200, credits: 88000000, experience: 8800000, loot: ['Glitch Core', 'Error Code', 'Corrupted Data', 'Debug Key'] },
    abilities: ['Glitch Out', 'Error Storm', 'Corrupt Data', 'Buffer Overflow', 'Segmentation Fault'],
    weaknesses: ['Debug Tools', 'Clean Code', 'System Restore'],
    image: 'https://readdy.ai/api/search-image?query=glitch%20horror%20corrupted%20code%20entity%20made%20of%20broken%20pixels%20and%20digital%20artifacts%20static%20distortion%20monster%20in%20cyberspace%20glitching%20between%20forms%20technological%20boss&width=800&height=600&seq=worldboss-61&orientation=landscape',
    difficulty: 'Legendary'
  },
  {
    id: 62, name: 'Zenith Prime', title: 'Apex of Evolution', tier: 78, level: 780,
    health: 90000000000, maxHealth: 90000000000, shield: 50000000000, maxShield: 50000000000,
    armor: 1200000, damage: 11000000, status: 'upcoming', location: 'Evolution Spire, Apex Zone',
    participants: 0, timeRemaining: 388800,
    rewards: { metal: 120000000, crystal: 90000000, deuterium: 70000000, darkMatter: 18000, credits: 350000000, experience: 35000000, loot: ['Zenith Core', 'Evolution Catalyst', 'Apex Gene', 'Prime Blueprint', 'Ultimate Form'] },
    abilities: ['Adaptive Evolution', 'Perfect Form', 'Apex Strike', 'Evolution Wave', 'Survival Instinct', 'Natural Selection'],
    weaknesses: ['Devolution Weapons', 'Genetic Destabilizers', 'Extinction Events'],
    image: 'https://readdy.ai/api/search-image?query=zenith%20prime%20ultimate%20evolved%20entity%20perfect%20organism%20combining%20features%20of%20every%20life%20form%20golden%20divine%20creature%20apex%20predator%20floating%20in%20space%20boss&width=800&height=600&seq=worldboss-62&orientation=landscape',
    difficulty: 'Godlike'
  },
  {
    id: 63, name: 'Necro Fleet Admiral', title: 'Undead Armada Commander', tier: 59, level: 590,
    health: 46000000000, maxHealth: 46000000000, shield: 29000000000, maxShield: 29000000000,
    armor: 380000, damage: 7000000, status: 'active', location: 'Necro Nebula, Ghost Fleet HQ',
    participants: 5800, timeRemaining: 22000,
    rewards: { metal: 52000000, crystal: 40000000, deuterium: 35000000, darkMatter: 5200, credits: 115000000, experience: 11500000, loot: ['Admiral Hat', 'Ghost Compass', 'Necro Chart', 'Spectral Fleet Orders'] },
    abilities: ['Fleet Command', 'Ghost Ship Summon', 'Undead Crew', 'Broadside Barrage', 'Spectral Formation'],
    weaknesses: ['Exorcism Weapons', 'Holy Fleet', 'Blessed Ammunition'],
    image: 'https://readdy.ai/api/search-image?query=necro%20fleet%20admiral%20undead%20skeleton%20commander%20in%20ornate%20naval%20uniform%20standing%20on%20ghost%20ship%20bridge%20surrounded%20by%20spectral%20fleet%20green%20ethereal%20energy%20boss&width=800&height=600&seq=worldboss-63&orientation=landscape',
    difficulty: 'Mythic'
  },
  {
    id: 64, name: 'Elemental Chaos', title: 'Primal Storm', tier: 61, level: 610,
    health: 50000000000, maxHealth: 50000000000, shield: 31000000000, maxShield: 31000000000,
    armor: 350000, damage: 7200000, status: 'active', location: 'Elemental Nexus, Primal Convergence',
    participants: 5900, timeRemaining: 20000,
    rewards: { metal: 50000000, crystal: 45000000, deuterium: 40000000, darkMatter: 5500, credits: 120000000, experience: 12000000, loot: ['Fire Essence', 'Water Essence', 'Wind Essence', 'Earth Essence', 'Chaos Core'] },
    abilities: ['Fire Storm', 'Ice Age', 'Lightning Wrath', 'Earth Shatter', 'Elemental Fusion'],
    weaknesses: ['Order Weapons', 'Elemental Separation', 'Void Energy'],
    image: 'https://readdy.ai/api/search-image?query=elemental%20chaos%20primal%20storm%20entity%20with%20all%20four%20elements%20swirling%20around%20it%20fire%20water%20earth%20and%20wind%20forming%20a%20humanoid%20vortex%20cosmic%20elemental%20boss&width=800&height=600&seq=worldboss-64&orientation=landscape',
    difficulty: 'Mythic'
  },
  {
    id: 65, name: 'Hive Mind Nexus', title: 'Trillion Voice Chorus', tier: 64, level: 640,
    health: 58000000000, maxHealth: 58000000000, shield: 36000000000, maxShield: 36000000000,
    armor: 300000, damage: 8000000, status: 'active', location: 'Hive Core, Collective Consciousness',
    participants: 6700, timeRemaining: 18000,
    rewards: { metal: 60000000, crystal: 50000000, deuterium: 45000000, darkMatter: 7000, credits: 140000000, experience: 14000000, loot: ['Hive Mind Core', 'Trillion Voice', 'Unity Crystal', 'Collective Blueprint'] },
    abilities: ['Unified Mind', 'Trillion Scream', 'Collective Strike', 'Unity Shield', 'Hive Override'],
    weaknesses: ['Individuality Weapons', 'Discord Generators', 'Mind Jammers'],
    image: 'https://readdy.ai/api/search-image?query=hive%20mind%20nexus%20giant%20organic%20neural%20network%20floating%20in%20space%20billions%20of%20connected%20glowing%20nodes%20forming%20a%20brain%20like%20structure%20collective%20consciousness%20alien%20entity%20boss&width=800&height=600&seq=worldboss-65&orientation=landscape',
    difficulty: 'Mythic'
  },
  {
    id: 66, name: 'Gravemind', title: 'Corpse Moon', tier: 74, level: 740,
    health: 85000000000, maxHealth: 85000000000, shield: 45000000000, maxShield: 45000000000,
    armor: 900000, damage: 10500000, status: 'active', location: 'Graveyard System, Corpse Moon Orbit',
    participants: 7800, timeRemaining: 15000,
    rewards: { metal: 80000000, crystal: 65000000, deuterium: 55000000, darkMatter: 11000, credits: 220000000, experience: 22000000, loot: ['Gravemind Core', 'Corpse Moon Fragment', 'Death Essence', 'Necrotic Blueprint', 'Grave Key'] },
    abilities: ['Corpse Rain', 'Necrotic Wave', 'Grave Pull', 'Undead Moon', 'Death Orbit', 'Funeral Pyre'],
    weaknesses: ['Life Weapons', 'Purification Beams', 'Resurrection Energy'],
    image: 'https://readdy.ai/api/search-image?query=gravemind%20corpse%20moon%20giant%20skull%20shaped%20moon%20covered%20in%20graves%20and%20tombs%20floating%20in%20space%20green%20necrotic%20energy%20radiating%20death%20entity%20cosmic%20horror%20boss&width=800&height=600&seq=worldboss-66&orientation=landscape',
    difficulty: 'Mythic'
  },
  {
    id: 67, name: 'Infinity Serpent', title: 'Ouroboros Eternal', tier: 95, level: 950,
    health: 250000000000, maxHealth: 250000000000, shield: 120000000000, maxShield: 120000000000,
    armor: 5000000, damage: 25000000, status: 'upcoming', location: 'Infinity Loop, Eternal Cycle',
    participants: 0, timeRemaining: 777600,
    rewards: { metal: 500000000, crystal: 400000000, deuterium: 350000000, darkMatter: 100000, credits: 2000000000, experience: 200000000, loot: ['Infinity Scale', 'Ouroboros Ring', 'Eternal Loop', 'Creation Egg', 'Infinity Blueprint', 'God Key'] },
    abilities: ['Infinity Bite', 'Eternal Cycle', 'Ouroboros Loop', 'Endless Coil', 'Infinity Crush', 'Never Ending', 'Absolute Infinity'],
    weaknesses: ['Finite Weapons', 'Loop Breakers', 'End Bringers'],
    image: 'https://readdy.ai/api/search-image?query=infinity%20serpent%20ouroboros%20giant%20cosmic%20snake%20eating%20its%20own%20tail%20forming%20an%20infinite%20loop%20golden%20scales%20made%20of%20stars%20and%20galaxies%20divine%20eternal%20dragon%20boss&width=800&height=600&seq=worldboss-67&orientation=landscape',
    difficulty: 'Godlike'
  },
  {
    id: 68, name: 'Cosmic Egg', title: 'Universe Seed', tier: 99, level: 999,
    health: 500000000000, maxHealth: 500000000000, shield: 250000000000, maxShield: 250000000000,
    armor: 10000000, damage: 50000000, status: 'upcoming', location: 'Creation Point, Universe Birthplace',
    participants: 0, timeRemaining: 2592000,
    rewards: { metal: 1000000000, crystal: 800000000, deuterium: 600000000, darkMatter: 500000, credits: 10000000000, experience: 500000000, loot: ['Cosmic Egg Shell', 'Creation Spark', 'Universe Seed', 'Big Bang Core', 'Creator Blueprint', 'Primordial Key', 'Ultimate God Core'] },
    abilities: ['Big Bang', 'Universe Creation', 'Cosmic Birth', 'Creation Wave', 'Existence Pulse', 'Primordial Light', 'Genesis Nova', 'Absolute Creation'],
    weaknesses: ['None Known', 'Unknown Force', 'Theoretical Only'],
    image: 'https://readdy.ai/api/search-image?query=cosmic%20egg%20universe%20seed%20giant%20golden%20egg%20floating%20in%20pure%20white%20void%20cracks%20of%20creation%20energy%20leaking%20out%20swirling%20galaxies%20and%20stars%20being%20born%20around%20it%20ultimate%20divine%20entity&width=800&height=600&seq=worldboss-68&orientation=landscape',
    difficulty: 'Godlike'
  }
];

export const leaderboardData = [
  { rank: 1, player: 'CommanderX', damage: 5000000000, guild: 'Void Hunters', reward: 'x3' },
  { rank: 2, player: 'StarDestroyer', damage: 4500000000, guild: 'Stellar Legion', reward: 'x2.5' },
  { rank: 3, player: 'QuantumKnight', damage: 4000000000, guild: 'Reality Breakers', reward: 'x2' },
  { rank: 4, player: 'CosmicWarrior', damage: 3500000000, guild: 'Galactic Empire', reward: 'x1.8' },
  { rank: 5, player: 'VoidMaster', damage: 3000000000, guild: 'Dark Matter Syndicate', reward: 'x1.5' },
  { rank: 6, player: 'TitanSlayer', damage: 2800000000, guild: 'Titan Hunters', reward: 'x1.3' },
  { rank: 7, player: 'NebulaPrince', damage: 2500000000, guild: 'Nebula Knights', reward: 'x1.2' },
  { rank: 8, player: 'GalaxyGuardian', damage: 2200000000, guild: 'Guardians of Light', reward: 'x1.1' },
  { rank: 9, player: 'StarForge', damage: 2000000000, guild: 'Forge Masters', reward: 'x1.0' },
  { rank: 10, player: 'You', damage: 1850000000, guild: 'Your Alliance', reward: 'x1.0' }
];