export interface StoreItem {
  id: string;
  name: string;
  description: string;
  category: 'ship' | 'blueprint' | 'resource' | 'booster' | 'cosmetic' | 'officer' | 'bundle';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  price: {
    credits?: number;
    darkMatter?: number;
    premiumCurrency?: number;
  };
  discount?: number;
  featured?: boolean;
  limited?: boolean;
  stock?: number;
  requirements?: {
    level?: number;
    rank?: string;
    achievement?: string;
  };
  contents?: {
    type: string;
    id: string;
    quantity: number;
  }[];
  stats?: Record<string, any>;
  image?: string;
  tags?: string[];
}

export const storeItems: StoreItem[] = [
  // Premium Ships
  {
    id: 'premium_ship_1',
    name: 'Celestial Destroyer',
    description: 'A legendary destroyer with quantum weapons and advanced shields. Exclusive premium ship with 50% bonus to all stats.',
    category: 'ship',
    rarity: 'legendary',
    price: { premiumCurrency: 2500 },
    featured: true,
    requirements: { level: 30 },
    stats: {
      attack: 15000,
      defense: 12000,
      speed: 8000,
      cargo: 5000,
      fuel: 2000,
      bonuses: ['50% Attack Bonus', '50% Defense Bonus', 'Quantum Weapons', 'Advanced Shields']
    },
    image: 'https://readdy.ai/api/search-image?query=futuristic%20celestial%20destroyer%20spaceship%20with%20glowing%20quantum%20weapons%20and%20advanced%20energy%20shields%20floating%20in%20deep%20space%20with%20nebula%20background%20sleek%20metallic%20design%20with%20blue%20and%20gold%20accents%20highly%20detailed%20sci%20fi%20concept%20art&width=400&height=300&seq=store001&orientation=landscape',
    tags: ['premium', 'exclusive', 'powerful']
  },
  {
    id: 'premium_ship_2',
    name: 'Void Reaper',
    description: 'Stealth battleship with cloaking technology and dark matter cannons. Perfect for surprise attacks.',
    category: 'ship',
    rarity: 'mythic',
    price: { premiumCurrency: 5000 },
    featured: true,
    requirements: { level: 50 },
    stats: {
      attack: 25000,
      defense: 18000,
      speed: 12000,
      cargo: 8000,
      fuel: 3000,
      bonuses: ['Stealth Cloak', 'Dark Matter Weapons', '100% Critical Damage', 'Phase Shift']
    },
    image: 'https://readdy.ai/api/search-image?query=dark%20stealth%20battleship%20spaceship%20with%20black%20matte%20hull%20and%20purple%20glowing%20dark%20matter%20cannons%20cloaking%20device%20active%20with%20shimmer%20effect%20menacing%20angular%20design%20in%20void%20of%20space%20sci%20fi%20military%20vessel&width=400&height=300&seq=store002&orientation=landscape',
    tags: ['premium', 'stealth', 'mythic']
  },
  {
    id: 'premium_ship_3',
    name: 'Phoenix Carrier',
    description: 'Massive carrier ship that can deploy fighter squadrons. Includes 50 fighter drones.',
    category: 'ship',
    rarity: 'legendary',
    price: { premiumCurrency: 3500 },
    requirements: { level: 40 },
    stats: {
      attack: 10000,
      defense: 30000,
      speed: 5000,
      cargo: 20000,
      fuel: 5000,
      bonuses: ['50 Fighter Drones', 'Repair Bay', 'Shield Regeneration', 'Command Center']
    },
    image: 'https://readdy.ai/api/search-image?query=massive%20phoenix%20carrier%20spaceship%20with%20orange%20and%20red%20color%20scheme%20multiple%20hangar%20bays%20deploying%20fighter%20squadrons%20enormous%20scale%20with%20detailed%20surface%20panels%20and%20glowing%20engines%20epic%20space%20carrier&width=400&height=300&seq=store003&orientation=landscape',
    tags: ['premium', 'carrier', 'support']
  },

  // Blueprints
  {
    id: 'blueprint_1',
    name: 'Titan Dreadnought Blueprint',
    description: 'Unlock the ability to build the ultimate Titan-class dreadnought. Requires advanced shipyard.',
    category: 'blueprint',
    rarity: 'epic',
    price: { premiumCurrency: 1500, darkMatter: 50000 },
    requirements: { level: 35 },
    image: 'https://readdy.ai/api/search-image?query=technical%20blueprint%20schematic%20of%20massive%20titan%20dreadnought%20spaceship%20with%20detailed%20engineering%20diagrams%20holographic%20blue%20lines%20on%20dark%20background%20futuristic%20technical%20drawing%20style&width=400&height=300&seq=store004&orientation=landscape',
    tags: ['blueprint', 'ship', 'titan']
  },
  {
    id: 'blueprint_2',
    name: 'Quantum Reactor Blueprint',
    description: 'Advanced reactor technology that provides 200% energy production. Game-changing technology.',
    category: 'blueprint',
    rarity: 'legendary',
    price: { premiumCurrency: 2000 },
    requirements: { level: 45 },
    image: 'https://readdy.ai/api/search-image?query=quantum%20reactor%20blueprint%20with%20glowing%20energy%20core%20technical%20schematic%20showing%20advanced%20fusion%20technology%20holographic%20display%20with%20cyan%20and%20white%20energy%20patterns%20futuristic%20engineering%20design&width=400&height=300&seq=store005&orientation=landscape',
    tags: ['blueprint', 'technology', 'energy']
  },

  // Resource Packs
  {
    id: 'resource_pack_1',
    name: 'Starter Resource Pack',
    description: 'Perfect for new commanders. Contains metal, crystal, and deuterium to kickstart your empire.',
    category: 'resource',
    rarity: 'common',
    price: { premiumCurrency: 100 },
    contents: [
      { type: 'metal', id: 'metal', quantity: 100000 },
      { type: 'crystal', id: 'crystal', quantity: 50000 },
      { type: 'deuterium', id: 'deuterium', quantity: 25000 }
    ],
    image: 'https://readdy.ai/api/search-image?query=collection%20of%20resource%20containers%20with%20metal%20ore%20blue%20crystals%20and%20deuterium%20fuel%20cells%20neatly%20arranged%20on%20metallic%20platform%20with%20soft%20lighting%20game%20asset%20style%20clean%20simple%20background&width=400&height=300&seq=store006&orientation=landscape',
    tags: ['resources', 'starter', 'value']
  },
  {
    id: 'resource_pack_2',
    name: 'Advanced Resource Pack',
    description: 'Large quantities of all basic resources plus dark matter. Great value for expanding empires.',
    category: 'resource',
    rarity: 'rare',
    price: { premiumCurrency: 500 },
    discount: 20,
    contents: [
      { type: 'metal', id: 'metal', quantity: 1000000 },
      { type: 'crystal', id: 'crystal', quantity: 500000 },
      { type: 'deuterium', id: 'deuterium', quantity: 250000 },
      { type: 'darkMatter', id: 'darkMatter', quantity: 1000 }
    ],
    image: 'https://readdy.ai/api/search-image?query=premium%20resource%20collection%20with%20glowing%20dark%20matter%20containers%20large%20metal%20ingots%20crystalline%20structures%20and%20deuterium%20tanks%20arranged%20in%20organized%20display%20with%20holographic%20labels%20high%20tech%20storage&width=400&height=300&seq=store007&orientation=landscape',
    tags: ['resources', 'value', 'popular']
  },
  {
    id: 'resource_pack_3',
    name: 'Ultimate Resource Bundle',
    description: 'Massive resource package with exotic matter. Best value in the store!',
    category: 'resource',
    rarity: 'legendary',
    price: { premiumCurrency: 2000 },
    discount: 30,
    featured: true,
    contents: [
      { type: 'metal', id: 'metal', quantity: 10000000 },
      { type: 'crystal', id: 'crystal', quantity: 5000000 },
      { type: 'deuterium', id: 'deuterium', quantity: 2500000 },
      { type: 'darkMatter', id: 'darkMatter', quantity: 10000 },
      { type: 'exoticMatter', id: 'exoticMatter', quantity: 1000 }
    ],
    image: 'https://readdy.ai/api/search-image?query=massive%20collection%20of%20premium%20resources%20with%20exotic%20matter%20crystals%20glowing%20in%20rainbow%20colors%20surrounded%20by%20metal%20ore%20and%20energy%20containers%20epic%20scale%20display%20with%20dramatic%20lighting%20luxury%20game%20bundle&width=400&height=300&seq=store008&orientation=landscape',
    tags: ['resources', 'best-value', 'featured']
  },

  // Boosters
  {
    id: 'booster_1',
    name: 'Production Booster (24h)',
    description: 'Increase all resource production by 100% for 24 hours. Stackable with other bonuses.',
    category: 'booster',
    rarity: 'uncommon',
    price: { premiumCurrency: 200 },
    stats: { duration: 86400, bonus: 100, type: 'production' },
    image: 'https://readdy.ai/api/search-image?query=glowing%20production%20booster%20icon%20with%20upward%20arrows%20and%20resource%20symbols%20bright%20green%20and%20gold%20energy%20effect%20floating%20holographic%20display%20game%20ui%20power%20up%20style%20clean%20background&width=400&height=300&seq=store009&orientation=landscape',
    tags: ['booster', 'production', 'temporary']
  },
  {
    id: 'booster_2',
    name: 'Research Accelerator (7d)',
    description: 'Reduce all research times by 50% for 7 days. Essential for rapid progression.',
    category: 'booster',
    rarity: 'rare',
    price: { premiumCurrency: 800 },
    stats: { duration: 604800, bonus: 50, type: 'research' },
    image: 'https://readdy.ai/api/search-image?query=research%20accelerator%20icon%20with%20scientific%20symbols%20and%20fast%20forward%20arrows%20glowing%20blue%20and%20purple%20energy%20swirls%20holographic%20technology%20display%20game%20power%20up%20design&width=400&height=300&seq=store010&orientation=landscape',
    tags: ['booster', 'research', 'value']
  },
  {
    id: 'booster_3',
    name: 'Combat Enhancer (3d)',
    description: 'Increase fleet attack and defense by 50% for 3 days. Dominate the battlefield!',
    category: 'booster',
    rarity: 'epic',
    price: { premiumCurrency: 600 },
    stats: { duration: 259200, bonus: 50, type: 'combat' },
    image: 'https://readdy.ai/api/search-image?query=combat%20enhancer%20power%20up%20icon%20with%20crossed%20swords%20and%20shield%20symbols%20glowing%20red%20and%20orange%20battle%20energy%20effect%20dramatic%20lighting%20game%20buff%20icon%20style&width=400&height=300&seq=store011&orientation=landscape',
    tags: ['booster', 'combat', 'pvp']
  },
  {
    id: 'booster_4',
    name: 'Experience Multiplier (7d)',
    description: 'Gain 200% more experience from all activities for 7 days. Level up faster!',
    category: 'booster',
    rarity: 'epic',
    price: { premiumCurrency: 1000 },
    stats: { duration: 604800, bonus: 200, type: 'experience' },
    image: 'https://readdy.ai/api/search-image?query=experience%20multiplier%20icon%20with%20star%20burst%20and%20level%20up%20symbols%20glowing%20yellow%20and%20white%20radiant%20energy%20effect%20game%20xp%20boost%20power%20up%20design&width=400&height=300&seq=store012&orientation=landscape',
    tags: ['booster', 'experience', 'progression']
  },

  // Cosmetics
  {
    id: 'cosmetic_1',
    name: 'Imperial Gold Ship Skin',
    description: 'Luxurious gold plating for your flagship. Show your wealth and power!',
    category: 'cosmetic',
    rarity: 'epic',
    price: { premiumCurrency: 1200 },
    image: 'https://readdy.ai/api/search-image?query=luxury%20spaceship%20with%20shiny%20gold%20metallic%20plating%20and%20ornate%20imperial%20decorations%20gleaming%20in%20starlight%20prestigious%20design%20with%20elegant%20details%20premium%20cosmetic%20skin&width=400&height=300&seq=store013&orientation=landscape',
    tags: ['cosmetic', 'skin', 'prestige']
  },
  {
    id: 'cosmetic_2',
    name: 'Plasma Trail Effect',
    description: 'Leave a stunning plasma trail as your ships travel. Multiple color options available.',
    category: 'cosmetic',
    rarity: 'rare',
    price: { premiumCurrency: 500 },
    image: 'https://readdy.ai/api/search-image?query=spaceship%20leaving%20beautiful%20glowing%20plasma%20trail%20effect%20in%20multiple%20colors%20blue%20purple%20and%20cyan%20energy%20streams%20flowing%20behind%20vessel%20spectacular%20visual%20effect&width=400&height=300&seq=store014&orientation=landscape',
    tags: ['cosmetic', 'effect', 'visual']
  },
  {
    id: 'cosmetic_3',
    name: 'Holographic Commander Avatar',
    description: 'Premium holographic avatar frame with animated effects. Stand out in chat and leaderboards.',
    category: 'cosmetic',
    rarity: 'legendary',
    price: { premiumCurrency: 1500 },
    image: 'https://readdy.ai/api/search-image?query=futuristic%20holographic%20commander%20avatar%20frame%20with%20animated%20glowing%20borders%20and%20particle%20effects%20cyan%20and%20gold%20colors%20premium%20profile%20decoration%20game%20ui%20element&width=400&height=300&seq=store015&orientation=landscape',
    tags: ['cosmetic', 'avatar', 'premium']
  },

  // Officers
  {
    id: 'officer_1',
    name: 'Admiral Vex Shadowblade',
    description: 'Legendary officer with mastery in fleet command and tactical warfare. Unique abilities.',
    category: 'officer',
    rarity: 'legendary',
    price: { premiumCurrency: 3000 },
    requirements: { level: 40 },
    stats: {
      attack: 95,
      defense: 85,
      leadership: 98,
      intelligence: 88,
      abilities: ['Fleet Command Mastery', 'Tactical Genius', 'Inspiring Presence', 'Battle Hardened']
    },
    image: 'https://readdy.ai/api/search-image?query=legendary%20space%20admiral%20in%20futuristic%20military%20uniform%20with%20medals%20and%20insignia%20commanding%20presence%20standing%20on%20starship%20bridge%20with%20holographic%20displays%20epic%20portrait%20style&width=400&height=300&seq=store016&orientation=landscape',
    tags: ['officer', 'legendary', 'combat']
  },
  {
    id: 'officer_2',
    name: 'Dr. Aria Quantum',
    description: 'Brilliant scientist specializing in advanced research and technology development.',
    category: 'officer',
    rarity: 'epic',
    price: { premiumCurrency: 2000 },
    requirements: { level: 30 },
    stats: {
      attack: 60,
      defense: 70,
      leadership: 75,
      intelligence: 99,
      abilities: ['Research Acceleration', 'Technology Insight', 'Innovation', 'Scientific Method']
    },
    image: 'https://readdy.ai/api/search-image?query=brilliant%20female%20scientist%20in%20futuristic%20lab%20coat%20with%20holographic%20research%20displays%20and%20quantum%20equations%20floating%20around%20intelligent%20expression%20high%20tech%20laboratory%20background&width=400&height=300&seq=store017&orientation=landscape',
    tags: ['officer', 'research', 'science']
  },

  // Bundles
  {
    id: 'bundle_1',
    name: 'Commander Starter Bundle',
    description: 'Everything you need to start strong! Includes resources, boosters, and a premium ship.',
    category: 'bundle',
    rarity: 'epic',
    price: { premiumCurrency: 1500 },
    discount: 40,
    featured: true,
    contents: [
      { type: 'ship', id: 'premium_ship_1', quantity: 1 },
      { type: 'metal', id: 'metal', quantity: 500000 },
      { type: 'crystal', id: 'crystal', quantity: 250000 },
      { type: 'deuterium', id: 'deuterium', quantity: 125000 },
      { type: 'booster', id: 'booster_1', quantity: 3 },
      { type: 'booster', id: 'booster_2', quantity: 1 }
    ],
    image: 'https://readdy.ai/api/search-image?query=premium%20game%20bundle%20package%20with%20spaceship%20resource%20containers%20and%20glowing%20power%20ups%20arranged%20in%20attractive%20display%20gift%20box%20style%20with%20ribbons%20and%20sparkles%20best%20value%20offer&width=400&height=300&seq=store018&orientation=landscape',
    tags: ['bundle', 'starter', 'best-value']
  },
  {
    id: 'bundle_2',
    name: 'Ultimate Power Bundle',
    description: 'The most powerful bundle in the store! Mythic ship, legendary officer, and massive resources.',
    category: 'bundle',
    rarity: 'mythic',
    price: { premiumCurrency: 10000 },
    discount: 50,
    featured: true,
    limited: true,
    stock: 100,
    contents: [
      { type: 'ship', id: 'premium_ship_2', quantity: 1 },
      { type: 'officer', id: 'officer_1', quantity: 1 },
      { type: 'metal', id: 'metal', quantity: 20000000 },
      { type: 'crystal', id: 'crystal', quantity: 10000000 },
      { type: 'deuterium', id: 'deuterium', quantity: 5000000 },
      { type: 'darkMatter', id: 'darkMatter', quantity: 50000 },
      { type: 'booster', id: 'booster_4', quantity: 5 }
    ],
    image: 'https://readdy.ai/api/search-image?query=ultimate%20premium%20bundle%20with%20mythic%20spaceship%20legendary%20officer%20hologram%20and%20massive%20resource%20collection%20glowing%20with%20power%20epic%20scale%20display%20with%20dramatic%20lighting%20limited%20edition%20exclusive&width=400&height=300&seq=store019&orientation=landscape',
    tags: ['bundle', 'ultimate', 'limited']
  }
];

export const premiumCurrencyPacks = [
  {
    id: 'currency_1',
    amount: 500,
    price: 4.99,
    bonus: 0,
    popular: false
  },
  {
    id: 'currency_2',
    amount: 1200,
    price: 9.99,
    bonus: 200,
    popular: true
  },
  {
    id: 'currency_3',
    amount: 2500,
    price: 19.99,
    bonus: 500,
    popular: false
  },
  {
    id: 'currency_4',
    amount: 6500,
    price: 49.99,
    bonus: 1500,
    popular: false
  },
  {
    id: 'currency_5',
    amount: 14000,
    price: 99.99,
    bonus: 4000,
    popular: false
  }
];
