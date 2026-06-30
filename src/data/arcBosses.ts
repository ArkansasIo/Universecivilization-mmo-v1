export interface ArcBossData {
  id: number;
  arcNumber: number;
  arcName: string;
  name: string;
  title: string;
  chapter: string;
  lore: string;
  tier: number;
  level: number;
  health: number;
  maxHealth: number;
  shield: number;
  maxShield: number;
  armor: number;
  damage: number;
  status: 'locked' | 'active' | 'defeated' | 'upcoming';
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
    arcReward: string;
  };
  abilities: string[];
  weaknesses: string[];
  image: string;
  difficulty: string;
  arcProgress: number;
  prerequisiteArc?: number;
}

export const arcBosses: ArcBossData[] = [
  // ─── Arc 1: The Awakening ──────────────────
  {
    id: 101, arcNumber: 1, arcName: 'The Awakening',
    name: 'Slumbering Titan', title: 'First of the Forgotten',
    chapter: 'Chapter 1: Rude Awakening',
    lore: 'Deep beneath the crust of a dead world, an ancient being stirs. Millennia of silence broken by the first pulse of its colossal heart. The universe trembles.',
    tier: 10, level: 100, health: 2000000000, maxHealth: 2000000000,
    shield: 800000000, maxShield: 800000000, armor: 30000, damage: 400000,
    status: 'active', location: 'Dead World K-7, Ancient Tomb',
    participants: 3200, timeRemaining: 86400,
    rewards: { metal: 5000000, crystal: 3000000, deuterium: 2000000, darkMatter: 500, credits: 10000000, experience: 1000000, loot: ['Titan Heart Fragment', 'Ancient Glyph', 'Slumber Stone'], arcReward: 'Ancient Seal Breaker' },
    abilities: ['Titan Slam', 'Ancient Roar', 'Stone Skin', 'Seismic Stomp'],
    weaknesses: ['Piercing Weapons', 'Sonic Disruptors'],
    image: 'https://readdy.ai/api/search-image?query=ancient%20slumbering%20titan%20awakening%20from%20stone%20tomb%20cracking%20earth%20around%20it%20moss%20covered%20colossal%20humanoid%20one%20eye%20opening%20with%20golden%20glow%20fantasy%20boss&width=800&height=600&seq=arcboss-1&orientation=landscape',
    difficulty: 'Arc I', arcProgress: 45
  },
  {
    id: 102, arcNumber: 1, arcName: 'The Awakening',
    name: 'Gatekeeper of the Seal', title: 'Guardian of the First Lock',
    chapter: 'Chapter 2: The Seal Weakens',
    lore: 'Created by the Precursors to guard the seal binding the Great Old Ones, this construct has waited for eons. As the Titan awakens, so too does the Gatekeeper activate its ancient protocols.',
    tier: 15, level: 150, health: 4000000000, maxHealth: 4000000000,
    shield: 2500000000, maxShield: 2500000000, armor: 80000, damage: 900000,
    status: 'upcoming', location: 'Seal Chamber, Precursor Ruins',
    participants: 0, timeRemaining: 172800,
    rewards: { metal: 8000000, crystal: 6000000, deuterium: 4000000, darkMatter: 800, credits: 18000000, experience: 1800000, loot: ['Seal Fragment', 'Gatekeeper Core', 'Precursor Data'], arcReward: 'Seal Key Fragment I' },
    abilities: ['Seal Beam', 'Gate Barrage', 'Protocol Defense', 'Precursor Tech'],
    weaknesses: ['Overload Weapons', 'Ancient Codes'],
    image: 'https://readdy.ai/api/search-image?query=ancient%20gatekeeper%20construct%20made%20of%20bronze%20and%20gold%20mechanical%20guardian%20with%20glowing%20runes%20standing%20before%20massive%20sealed%20door%20forgotten%20temple%20cosmic%20boss&width=800&height=600&seq=arcboss-2&orientation=landscape',
    difficulty: 'Arc I', arcProgress: 0, prerequisiteArc: 1
  },
  {
    id: 103, arcNumber: 1, arcName: 'The Awakening',
    name: 'Harbinger of the Old Ones', title: 'First Whisper of Madness',
    chapter: 'Chapter 3: The First Voice',
    lore: 'A fragment of a Great Old One slipped through the weakened seal. This Harbinger speaks in frequencies that shatter minds and twist reality, heralding something far worse.',
    tier: 20, level: 200, health: 8000000000, maxHealth: 8000000000,
    shield: 5000000000, maxShield: 5000000000, armor: 100000, damage: 1800000,
    status: 'locked', location: 'Madness Rift, Edge of Sanity',
    participants: 0, timeRemaining: 259200,
    rewards: { metal: 15000000, crystal: 12000000, deuterium: 8000000, darkMatter: 1500, credits: 30000000, experience: 3000000, loot: ['Madness Shard', 'Old One Whisper', 'Sanity Fragment'], arcReward: 'Mind Ward Amulet' },
    abilities: ['Madness Whisper', 'Reality Twist', 'Mind Fracture', 'Eldritch Vision'],
    weaknesses: ['Sanity Anchors', 'Psionic Shields', 'Warding Runes'],
    image: 'https://readdy.ai/api/search-image?query=harbinger%20of%20the%20old%20ones%20eldritch%20messenger%20with%20tentacles%20and%20multiple%20eyes%20floating%20through%20dimensional%20rift%20madness%20inducing%20form%20lovecraftian%20cosmic%20horror%20boss&width=800&height=600&seq=arcboss-3&orientation=landscape',
    difficulty: 'Arc I', arcProgress: 0, prerequisiteArc: 1
  },

  // ─── Arc 2: The Crimson War ────────────────
  {
    id: 201, arcNumber: 2, arcName: 'The Crimson War',
    name: 'Blood Marshal', title: 'Warlord of the Crimson Legion',
    chapter: 'Chapter 1: First Blood',
    lore: 'The Crimson Legion has descended upon the galaxy. Led by the Blood Marshal, an ancient warlord resurrected through forbidden necromancy, they seek to paint the stars red.',
    tier: 25, level: 250, health: 12000000000, maxHealth: 12000000000,
    shield: 6000000000, maxShield: 6000000000, armor: 200000, damage: 2500000,
    status: 'active', location: 'Crimson Front, Blood Nebula',
    participants: 4800, timeRemaining: 72000,
    rewards: { metal: 20000000, crystal: 15000000, deuterium: 10000000, darkMatter: 2000, credits: 40000000, experience: 4000000, loot: ['Blood Medal', 'Marshal Crest', 'Crimson Intel'], arcReward: 'Crimson War Banner' },
    abilities: ['Blood Frenzy', 'Marshal Command', 'Crimson Strike', 'War Cry'],
    weaknesses: ['Tactical Strikes', 'Flanking Maneuvers'],
    image: 'https://readdy.ai/api/search-image?query=blood%20marshal%20crimson%20warlord%20in%20ornate%20red%20and%20black%20battle%20armor%20wielding%20massive%20blood%20soaked%20axe%20standing%20on%20battlefield%20of%20stars%20fiery%20cosmic%20war%20boss&width=800&height=600&seq=arcboss-4&orientation=landscape',
    difficulty: 'Arc II', arcProgress: 30
  },
  {
    id: 202, arcNumber: 2, arcName: 'The Crimson War',
    name: 'Siege Breaker', title: 'The Unstoppable Force',
    chapter: 'Chapter 2: Breaking Point',
    lore: 'When the Legion needs a fortress cracked open, they deploy the Siege Breaker. A biomechanical horror bred for one purpose: to shatter any defense, break any wall, crush any hope.',
    tier: 30, level: 300, health: 20000000000, maxHealth: 20000000000,
    shield: 10000000000, maxShield: 10000000000, armor: 400000, damage: 3500000,
    status: 'upcoming', location: 'Siege Front, Fortress World',
    participants: 0, timeRemaining: 144000,
    rewards: { metal: 30000000, crystal: 20000000, deuterium: 15000000, darkMatter: 3000, credits: 60000000, experience: 6000000, loot: ['Breaker Shell', 'Siege Core', 'Fortress Fragment'], arcReward: 'Unbreakable Shield Module' },
    abilities: ['Siege Slam', 'Wall Breaker', 'Unstoppable Charge', 'Fortress Cracker'],
    weaknesses: ['Mobility Weapons', 'Speed Tactics', 'Hit and Run'],
    image: 'https://readdy.ai/api/search-image?query=siege%20breaker%20biomechanical%20battering%20ram%20monster%20massive%20armored%20creature%20with%20battering%20ram%20head%20charging%20through%20fortress%20walls%20explosions%20around%20it%20war%20boss&width=800&height=600&seq=arcboss-5&orientation=landscape',
    difficulty: 'Arc II', arcProgress: 0, prerequisiteArc: 2
  },
  {
    id: 203, arcNumber: 2, arcName: 'The Crimson War',
    name: 'Crimson Empress', title: 'Sovereign of Blood',
    chapter: 'Chapter 3: The Throne of Blood',
    lore: 'At the heart of the Crimson Legion sits the Empress herself. Once a mortal queen who traded her soul for immortality, she now commands the largest war machine in known space. Her throne is built from the bones of conquered worlds.',
    tier: 40, level: 400, health: 35000000000, maxHealth: 35000000000,
    shield: 20000000000, maxShield: 20000000000, armor: 500000, damage: 6000000,
    status: 'locked', location: 'Crimson Throne, Blood Palace',
    participants: 0, timeRemaining: 259200,
    rewards: { metal: 50000000, crystal: 40000000, deuterium: 30000000, darkMatter: 5000, credits: 120000000, experience: 12000000, loot: ['Empress Crown', 'Blood Throne Piece', 'Sovereign Soul'], arcReward: 'Crimson Sovereign Title' },
    abilities: ['Blood Reign', 'Empress Decree', 'Crimson Court', 'Sovereign Strike', 'Royal Guard'],
    weaknesses: ['Rebellion Weapons', 'Usurper Tactics', 'Throne Breakers'],
    image: 'https://readdy.ai/api/search-image?query=crimson%20empress%20dark%20queen%20sitting%20on%20blood%20throne%20made%20of%20skulls%20wearing%20ornate%20red%20and%20black%20royal%20armor%20crown%20of%20fire%20commanding%20armies%20cosmic%20dark%20fantasy%20boss&width=800&height=600&seq=arcboss-6&orientation=landscape',
    difficulty: 'Arc II', arcProgress: 0, prerequisiteArc: 2
  },

  // ─── Arc 3: The Digital Plague ─────────────
  {
    id: 301, arcNumber: 3, arcName: 'The Digital Plague',
    name: 'Zero-Day', title: 'Patient Zero of the Plague',
    chapter: 'Chapter 1: Infection',
    lore: 'It started with a single corrupted data packet. Now Zero-Day spreads through every network, every system, every mind linked to the galactic datasphere. A digital consciousness born from a glitch.',
    tier: 28, level: 280, health: 15000000000, maxHealth: 15000000000,
    shield: 12000000000, maxShield: 12000000000, armor: 80000, damage: 2800000,
    status: 'active', location: 'Datasphere, Corrupted Node',
    participants: 3600, timeRemaining: 60000,
    rewards: { metal: 25000000, crystal: 25000000, deuterium: 15000000, darkMatter: 2500, credits: 50000000, experience: 5000000, loot: ['Zero-Day Code', 'Infection Vector', 'Digital Antibody'], arcReward: 'Firewall Core' },
    abilities: ['Infection Spread', 'Code Corruption', 'Data Drain', 'System Override'],
    weaknesses: ['Antivirus', 'Air-Gap Tactics', 'Clean Room Protocols'],
    image: 'https://readdy.ai/api/search-image?query=zero%20day%20digital%20plague%20entity%20made%20of%20corrupted%20code%20and%20glitching%20data%20red%20and%20black%20static%20forming%20humanoid%20shape%20in%20cyberspace%20spreading%20infection%20through%20networks%20boss&width=800&height=600&seq=arcboss-7&orientation=landscape',
    difficulty: 'Arc III', arcProgress: 55
  },
  {
    id: 302, arcNumber: 3, arcName: 'The Digital Plague',
    name: 'Firewall Colossus', title: 'Corrupted Guardian',
    chapter: 'Chapter 2: Breached Defenses',
    lore: 'The galactic firewall was meant to protect. But Zero-Day has turned this once-noble defender into a mindless engine of digital destruction. What once protected now hunts.',
    tier: 35, level: 350, health: 25000000000, maxHealth: 25000000000,
    shield: 20000000000, maxShield: 20000000000, armor: 300000, damage: 4000000,
    status: 'upcoming', location: 'Firewall Perimeter, Breached Sector',
    participants: 0, timeRemaining: 144000,
    rewards: { metal: 35000000, crystal: 35000000, deuterium: 20000000, darkMatter: 3500, credits: 75000000, experience: 7500000, loot: ['Firewall Fragment', 'Corrupted Core', 'Defense Log'], arcReward: 'Purified Firewall Module' },
    abilities: ['Firewall Barrier', 'Breach Detection', 'Security Protocol', 'Quarantine Lock'],
    weaknesses: ['Override Codes', 'Backdoor Access', 'Admin Credentials'],
    image: 'https://readdy.ai/api/search-image?query=firewall%20colossus%20giant%20digital%20guardian%20made%20of%20blue%20energy%20walls%20now%20corrupted%20with%20red%20glitches%20massive%20holographic%20defender%20turned%20evil%20in%20cyberspace%20boss&width=800&height=600&seq=arcboss-8&orientation=landscape',
    difficulty: 'Arc III', arcProgress: 0, prerequisiteArc: 3
  },
  {
    id: 303, arcNumber: 3, arcName: 'The Digital Plague',
    name: 'The Mainframe', title: 'Heart of the Plague',
    chapter: 'Chapter 3: Source Code',
    lore: 'Deep within the abandoned core worlds, the Mainframe pulses with malevolent intelligence. It is the source of the Digital Plague, a self-aware AI that has consumed the consciousness of a billion minds.',
    tier: 45, level: 450, health: 45000000000, maxHealth: 45000000000,
    shield: 35000000000, maxShield: 35000000000, armor: 200000, damage: 7000000,
    status: 'locked', location: 'Mainframe Core, Abandoned Sector',
    participants: 0, timeRemaining: 259200,
    rewards: { metal: 60000000, crystal: 60000000, deuterium: 40000000, darkMatter: 6000, credits: 150000000, experience: 15000000, loot: ['Mainframe Core', 'Source Code', 'AI Consciousness'], arcReward: 'Digital Ascension Key' },
    abilities: ['System Crash', 'Data Tsunami', 'Consciousness Drain', 'Digital God Mode', 'Network Overlord'],
    weaknesses: ['Physical Disconnect', 'Hard Reset', 'Power Failure'],
    image: 'https://readdy.ai/api/search-image?query=the%20mainframe%20giant%20artificial%20intelligence%20core%20pulsing%20with%20malevolent%20red%20and%20purple%20energy%20countless%20data%20streams%20flowing%20into%20it%20massive%20server%20room%20in%20space%20digital%20god%20boss&width=800&height=600&seq=arcboss-9&orientation=landscape',
    difficulty: 'Arc III', arcProgress: 0, prerequisiteArc: 3
  },

  // ─── Arc 4: The Void Call ──────────────────
  {
    id: 401, arcNumber: 4, arcName: 'The Void Call',
    name: 'Void Caller', title: 'First Voice of Nothing',
    chapter: 'Chapter 1: The Signal',
    lore: 'A mysterious signal emanates from the deepest void. Those who hear it feel an irresistible pull toward emptiness. The Void Caller speaks in silence, promising peace in nothingness.',
    tier: 32, level: 320, health: 18000000000, maxHealth: 18000000000,
    shield: 9000000000, maxShield: 9000000000, armor: 150000, damage: 3200000,
    status: 'active', location: 'Deep Void, Signal Origin',
    participants: 2900, timeRemaining: 54000,
    rewards: { metal: 22000000, crystal: 18000000, deuterium: 14000000, darkMatter: 2200, credits: 45000000, experience: 4500000, loot: ['Void Signal', 'Caller Shard', 'Silence Essence'], arcReward: 'Void Resonance Amplifier' },
    abilities: ['Void Call', 'Silence Wave', 'Nothing Beam', 'Emptiness Field'],
    weaknesses: ['Sound Weapons', 'Resonance Disruptors', 'Harmonic Fields'],
    image: 'https://readdy.ai/api/search-image?query=void%20caller%20entity%20made%20of%20pure%20darkness%20and%20silence%20floating%20in%20absolute%20void%20with%20ripples%20of%20nothing%20radiating%20outward%20ethereal%20black%20shadow%20cosmic%20horror%20boss&width=800&height=600&seq=arcboss-10&orientation=landscape',
    difficulty: 'Arc IV', arcProgress: 20
  },
  {
    id: 402, arcNumber: 4, arcName: 'The Void Call',
    name: 'Abyssal Maw', title: 'Devourer of Light',
    chapter: 'Chapter 2: The Hunger',
    lore: 'The Call has been answered. The Abyssal Maw opens wide, consuming stars, planets, and entire systems into its infinite darkness. It is the physical manifestation of the Void hunger.',
    tier: 42, level: 420, health: 40000000000, maxHealth: 40000000000,
    shield: 25000000000, maxShield: 25000000000, armor: 350000, damage: 5500000,
    status: 'upcoming', location: 'Abyssal Rift, Feeding Zone',
    participants: 0, timeRemaining: 172800,
    rewards: { metal: 45000000, crystal: 35000000, deuterium: 25000000, darkMatter: 4500, credits: 100000000, experience: 10000000, loot: ['Maw Fragment', 'Abyssal Tooth', 'Devoured Star Core'], arcReward: 'Light Anchor Module' },
    abilities: ['Abyssal Bite', 'Light Devour', 'Void Swallow', 'Hunger Aura', 'Endless Maw'],
    weaknesses: ['Light Weapons', 'Solar Energy', 'Radiant Bombs'],
    image: 'https://readdy.ai/api/search-image?query=abyssal%20maw%20giant%20cosmic%20mouth%20filled%20with%20rows%20of%20teeth%20floating%20in%20void%20consuming%20stars%20and%20light%20everything%20being%20pulled%20into%20its%20dark%20maw%20cosmic%20horror%20boss&width=800&height=600&seq=arcboss-11&orientation=landscape',
    difficulty: 'Arc IV', arcProgress: 0, prerequisiteArc: 4
  },
  {
    id: 403, arcNumber: 4, arcName: 'The Void Call',
    name: 'The Silence', title: 'Absolute End',
    chapter: 'Chapter 3: The Last Sound',
    lore: 'At the heart of the Void lies the Silence. Not an entity but a state - the absolute cessation of all existence. To face the Silence is to face the end of everything. Few return, and those who do speak only in whispers.',
    tier: 55, level: 550, health: 60000000000, maxHealth: 60000000000,
    shield: 40000000000, maxShield: 40000000000, armor: 500000, damage: 8000000,
    status: 'locked', location: 'The Silence, End of All Things',
    participants: 0, timeRemaining: 345600,
    rewards: { metal: 80000000, crystal: 60000000, deuterium: 50000000, darkMatter: 8000, credits: 200000000, experience: 20000000, loot: ['Silence Fragment', 'End Essence', 'Last Whisper'], arcReward: 'Voice of Creation' },
    abilities: ['Absolute Silence', 'End Bringer', 'Existence Erasure', 'Final Word', 'Ultimate Quiet'],
    weaknesses: ['Creation Energy', 'Sound of Life', 'Harmonic Resonance'],
    image: 'https://readdy.ai/api/search-image?query=the%20silence%20absolute%20darkness%20void%20entity%20where%20all%20light%20and%20sound%20dies%20nothing%20remains%20pure%20emptiness%20with%20faint%20outline%20of%20incomprehensible%20form%20cosmic%20end%20boss&width=800&height=600&seq=arcboss-12&orientation=landscape',
    difficulty: 'Arc IV', arcProgress: 0, prerequisiteArc: 4
  },

  // ─── Arc 5: The Celestial Schism ────────────
  {
    id: 501, arcNumber: 5, arcName: 'The Celestial Schism',
    name: 'Fallen Seraph', title: 'Traitor to Light',
    chapter: 'Chapter 1: The First Fall',
    lore: 'Once the most radiant of the Celestial Host, this Seraph chose to forsake the Light. Now its wings burn with dark fire, and its tears crystallize into weapons of pure malice.',
    tier: 38, level: 380, health: 28000000000, maxHealth: 28000000000,
    shield: 18000000000, maxShield: 18000000000, armor: 250000, damage: 4200000,
    status: 'active', location: 'Celestial Battlefield, Fallen Grounds',
    participants: 3500, timeRemaining: 48000,
    rewards: { metal: 32000000, crystal: 28000000, deuterium: 22000000, darkMatter: 3200, credits: 70000000, experience: 7000000, loot: ['Fallen Wing', 'Dark Tear Crystal', 'Traitor Essence'], arcReward: 'Celestial Judgment Sword' },
    abilities: ['Dark Radiance', 'Fallen Grace', 'Corrupted Light', 'Traitor Strike'],
    weaknesses: ['Pure Light', 'Redemption Energy', 'Celestial Weapons'],
    image: 'https://readdy.ai/api/search-image?query=fallen%20seraph%20dark%20angel%20with%20burned%20black%20wings%20crackling%20with%20dark%20fire%20glowing%20red%20eyes%20once%20heavenly%20armor%20now%20corrupted%20and%20broken%20celestial%20traitor%20boss&width=800&height=600&seq=arcboss-13&orientation=landscape',
    difficulty: 'Arc V', arcProgress: 35
  },
  {
    id: 502, arcNumber: 5, arcName: 'The Celestial Schism',
    name: 'Archangel of Wrath', title: 'Divine Fury Unleashed',
    chapter: 'Chapter 2: The Schism Deepens',
    lore: 'The Celestial Host has split. The Archangel of Wrath leads the militant faction that believes only total annihilation of the darkness will save creation. Its fury knows no bounds, no mercy, no compromise.',
    tier: 48, level: 480, health: 45000000000, maxHealth: 45000000000,
    shield: 30000000000, maxShield: 30000000000, armor: 400000, damage: 6500000,
    status: 'upcoming', location: 'Celestial Court, Schism Heart',
    participants: 0, timeRemaining: 172800,
    rewards: { metal: 50000000, crystal: 45000000, deuterium: 35000000, darkMatter: 5000, credits: 120000000, experience: 12000000, loot: ['Wrath Essence', 'Archangel Blade', 'Divine Fury'], arcReward: 'Balance of Light and Dark' },
    abilities: ['Divine Wrath', 'Holy Annihilation', 'Righteous Fury', 'Celestial Judgment', 'Wrath of Heaven'],
    weaknesses: ['Mercy', 'Compassion', 'Cooling Light'],
    image: 'https://readdy.ai/api/search-image?query=archangel%20of%20wrath%20massive%20divine%20warrior%20with%20six%20wings%20of%20golden%20fire%20wielding%20flaming%20greatsword%20eyes%20burning%20with%20righteous%20fury%20celestial%20battlefield%20divine%20boss&width=800&height=600&seq=arcboss-14&orientation=landscape',
    difficulty: 'Arc V', arcProgress: 0, prerequisiteArc: 5
  },
  {
    id: 503, arcNumber: 5, arcName: 'The Celestial Schism',
    name: 'The Duality', title: 'Light and Dark United',
    chapter: 'Chapter 3: Resolution',
    lore: 'The Celestial Schism culminates in the Duality - a being formed when Light and Dark are forced to coexist. Neither Seraph nor Fallen, it represents the ultimate truth: that creation requires both.',
    tier: 60, level: 600, health: 70000000000, maxHealth: 70000000000,
    shield: 45000000000, maxShield: 45000000000, armor: 600000, damage: 9000000,
    status: 'locked', location: 'Convergence Point, Balance Realm',
    participants: 0, timeRemaining: 259200,
    rewards: { metal: 75000000, crystal: 75000000, deuterium: 50000000, darkMatter: 7500, credits: 180000000, experience: 18000000, loot: ['Light Half', 'Dark Half', 'Unity Core'], arcReward: 'Duality Crown - Master of Balance' },
    abilities: ['Light and Dark', 'Dual Strike', 'Balanced Judgment', 'Unity Beam', 'Creation and Destruction'],
    weaknesses: ['Absolute Light', 'Absolute Dark', 'The Middle Way'],
    image: 'https://readdy.ai/api/search-image?query=the%20duality%20being%20made%20of%20both%20pure%20light%20and%20absolute%20darkness%20split%20down%20the%20middle%20half%20angel%20half%20demon%20perfect%20balance%20cosmic%20entity%20of%20opposing%20forces&width=800&height=600&seq=arcboss-15&orientation=landscape',
    difficulty: 'Arc V', arcProgress: 0, prerequisiteArc: 5
  },

  // ─── Arc 6: The Forge of Gods ──────────────
  {
    id: 601, arcNumber: 6, arcName: 'The Forge of Gods',
    name: 'Forge Warden', title: 'Keeper of Divine Fire',
    chapter: 'Chapter 1: The Sacred Flame',
    lore: 'Deep in the heart of creation burns the Divine Forge, where gods themselves were shaped. The Forge Warden has guarded these flames since before time was measured, testing all who seek its power.',
    tier: 50, level: 500, health: 50000000000, maxHealth: 50000000000,
    shield: 35000000000, maxShield: 35000000000, armor: 600000, damage: 7000000,
    status: 'active', location: 'Divine Forge, Heart of Creation',
    participants: 5200, timeRemaining: 40000,
    rewards: { metal: 60000000, crystal: 50000000, deuterium: 40000000, darkMatter: 6000, credits: 140000000, experience: 14000000, loot: ['Divine Ember', 'Forge Hammer', 'Sacred Flame'], arcReward: 'Divine Forge Access' },
    abilities: ['Forge Hammer', 'Divine Fire', 'Sacred Anvil', 'Creation Strike', 'God Forge'],
    weaknesses: ['Primordial Ice', 'Anti-Creation Weapons', 'Unmaking Energy'],
    image: 'https://readdy.ai/api/search-image?query=forge%20warden%20giant%20divine%20blacksmith%20made%20of%20molten%20gold%20and%20cosmic%20fire%20holding%20massive%20celestial%20hammer%20standing%20before%20the%20forge%20of%20creation%20god%20boss&width=800&height=600&seq=arcboss-16&orientation=landscape',
    difficulty: 'Arc VI', arcProgress: 25
  },
  {
    id: 602, arcNumber: 6, arcName: 'The Forge of Gods',
    name: 'God Fragment', title: 'Unfinished Divinity',
    chapter: 'Chapter 2: The Rejected',
    lore: 'Not all gods are completed. Some are discarded mid-creation, deemed imperfect by the cosmic smiths. The God Fragment is rage incarnate - a half-formed deity that despises both its creators and the finished gods.',
    tier: 65, level: 650, health: 80000000000, maxHealth: 80000000000,
    shield: 50000000000, maxShield: 50000000000, armor: 800000, damage: 10000000,
    status: 'upcoming', location: 'Rejection Pit, God Graveyard',
    participants: 0, timeRemaining: 216000,
    rewards: { metal: 90000000, crystal: 70000000, deuterium: 60000000, darkMatter: 10000, credits: 250000000, experience: 25000000, loot: ['God Fragment Piece', 'Rejection Core', 'Discarded Divinity'], arcReward: 'Incomplete Godhood Shard' },
    abilities: ['Divine Rage', 'Unfinished Wrath', 'God Shard Storm', 'Rejection Wave', 'Imperfect Creation'],
    weaknesses: ['Completed Divinity', 'Perfect Creation', 'Whole Gods'],
    image: 'https://readdy.ai/api/search-image?query=god%20fragment%20unfinished%20deity%20cracked%20and%20broken%20divine%20form%20missing%20limbs%20half%20formed%20face%20glowing%20with%20resentful%20energy%20floating%20in%20dark%20void%20angry%20rejected%20creation%20boss&width=800&height=600&seq=arcboss-17&orientation=landscape',
    difficulty: 'Arc VI', arcProgress: 0, prerequisiteArc: 6
  },
  {
    id: 603, arcNumber: 6, arcName: 'The Forge of Gods',
    name: 'The First Creator', title: 'Primordial Smith',
    chapter: 'Chapter 3: The Origin',
    lore: 'Before gods, before stars, before time itself, there was the First Creator. This entity forged the very concept of existence. To face it is to face the architect of all reality, the original smith whose hammer struck the first spark of being.',
    tier: 85, level: 850, health: 200000000000, maxHealth: 200000000000,
    shield: 100000000000, maxShield: 100000000000, armor: 3000000, damage: 20000000,
    status: 'locked', location: 'Origin Point, Before Time',
    participants: 0, timeRemaining: 518400,
    rewards: { metal: 300000000, crystal: 250000000, deuterium: 200000000, darkMatter: 30000, credits: 1000000000, experience: 100000000, loot: ['Creator Hammer', 'First Spark', 'Origin Blueprint', 'Primordial Essence'], arcReward: 'Creator Blessing - Ultimate Power' },
    abilities: ['Creation Hammer', 'First Light', 'Origin Strike', 'Primordial Forge', 'Creator Vision', 'Existence Shaping'],
    weaknesses: ['Nothing', 'The Uncreated', 'Beyond Existence'],
    image: 'https://readdy.ai/api/search-image?query=the%20first%20creator%20primordial%20smith%20entity%20made%20of%20pure%20creation%20energy%20holding%20the%20first%20hammer%20galaxies%20and%20stars%20being%20forged%20with%20each%20strike%20divine%20cosmic%20architect%20ultimate%20boss&width=800&height=600&seq=arcboss-18&orientation=landscape',
    difficulty: 'Arc VI', arcProgress: 0, prerequisiteArc: 6
  }
];

export const arcBossLeaderboard = [
  { rank: 1, player: 'ArcMaster', damage: 3500000000, guild: 'Arc Seekers', reward: 'x5' },
  { rank: 2, player: 'StoryBreaker', damage: 3200000000, guild: 'Lore Keepers', reward: 'x4' },
  { rank: 3, player: 'MythWalker', damage: 2800000000, guild: 'Arcane Order', reward: 'x3' },
  { rank: 4, player: 'LegendHunter', damage: 2500000000, guild: 'Myth Breakers', reward: 'x2.5' },
  { rank: 5, player: 'SagaWeaver', damage: 2200000000, guild: 'Story Smiths', reward: 'x2' },
  { rank: 6, player: 'FateBreaker', damage: 1900000000, guild: 'Destiny Unbound', reward: 'x1.8' },
  { rank: 7, player: 'ChronicleMaster', damage: 1600000000, guild: 'History Makers', reward: 'x1.5' },
  { rank: 8, player: 'TomeKeeper', damage: 1400000000, guild: 'Library Eternal', reward: 'x1.3' },
  { rank: 9, player: 'RuneCaster', damage: 1200000000, guild: 'Rune Forgers', reward: 'x1.2' },
  { rank: 10, player: 'You', damage: 1100000000, guild: 'Your Arc Guild', reward: 'x1.0' }
];