// Comprehensive Crafting Materials System
export interface CraftingMaterial {
  id: string;
  name: string;
  type: 'ore' | 'refined' | 'component' | 'essence' | 'rare' | 'exotic' | 'quantum' | 'cosmic';
  tier: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  description: string;
  sources: string[];
  usedIn: string[];
}

export const craftingMaterials: CraftingMaterial[] = [
  // Basic Materials (Tier 1)
  { id: 'mat_steel', name: 'Steel Alloy', type: 'refined', tier: 1, rarity: 'common', description: 'Basic construction material', sources: ['Mining', 'Refining'], usedIn: ['Weapons', 'Armor', 'Ships'] },
  { id: 'mat_copper', name: 'Copper Wire', type: 'component', tier: 1, rarity: 'common', description: 'Basic electrical component', sources: ['Mining', 'Salvage'], usedIn: ['Electronics', 'Modules'] },
  { id: 'mat_silicon', name: 'Silicon Wafer', type: 'component', tier: 1, rarity: 'common', description: 'Electronic component base', sources: ['Mining', 'Processing'], usedIn: ['Electronics', 'Computers'] },
  { id: 'mat_crystal', name: 'Energy Crystal', type: 'ore', tier: 1, rarity: 'common', description: 'Basic energy storage', sources: ['Crystal Mining', 'Asteroids'], usedIn: ['Weapons', 'Shields', 'Power'] },
  { id: 'mat_fuel_cell', name: 'Fuel Cell', type: 'component', tier: 1, rarity: 'common', description: 'Basic power source', sources: ['Crafting', 'Trading'], usedIn: ['Engines', 'Power Systems'] },
  
  // Advanced Materials (Tier 2)
  { id: 'mat_titanium', name: 'Titanium Alloy', type: 'refined', tier: 2, rarity: 'uncommon', description: 'Advanced construction material', sources: ['Deep Mining', 'Refining'], usedIn: ['Advanced Ships', 'Heavy Armor'] },
  { id: 'mat_plasma_core', name: 'Plasma Core', type: 'component', tier: 2, rarity: 'uncommon', description: 'High-energy plasma container', sources: ['Plasma Harvesting', 'Crafting'], usedIn: ['Plasma Weapons', 'Reactors'] },
  { id: 'mat_shield_emitter', name: 'Shield Emitter', type: 'component', tier: 2, rarity: 'uncommon', description: 'Shield generation component', sources: ['Crafting', 'Salvage'], usedIn: ['Shield Systems', 'Defense'] },
  { id: 'mat_warp_coil', name: 'Warp Coil', type: 'component', tier: 2, rarity: 'uncommon', description: 'FTL drive component', sources: ['Advanced Crafting', 'Trading'], usedIn: ['Warp Drives', 'FTL Systems'] },
  { id: 'mat_rare_earth', name: 'Rare Earth Elements', type: 'ore', tier: 2, rarity: 'uncommon', description: 'Rare mineral compounds', sources: ['Rare Mining', 'Planetary Extraction'], usedIn: ['Advanced Electronics', 'Processors'] },
  
  // Elite Materials (Tier 3)
  { id: 'mat_durasteel', name: 'Durasteel', type: 'refined', tier: 3, rarity: 'rare', description: 'Ultra-strong alloy', sources: ['Advanced Refining', 'Deep Space Mining'], usedIn: ['Battleships', 'Heavy Armor', 'Structures'] },
  { id: 'mat_ion_cell', name: 'Ion Cell', type: 'component', tier: 3, rarity: 'rare', description: 'Ionized energy storage', sources: ['Ion Harvesting', 'Advanced Crafting'], usedIn: ['Ion Weapons', 'EMP Systems'] },
  { id: 'mat_fusion_core', name: 'Fusion Core', type: 'component', tier: 3, rarity: 'rare', description: 'Fusion reactor core', sources: ['Advanced Engineering', 'Trading'], usedIn: ['Fusion Reactors', 'Power Systems'] },
  { id: 'mat_reactive_compound', name: 'Reactive Compound', type: 'essence', tier: 3, rarity: 'rare', description: 'Adaptive material compound', sources: ['Chemical Synthesis', 'Alchemy'], usedIn: ['Reactive Armor', 'Smart Materials'] },
  { id: 'mat_nanites', name: 'Raw Nanites', type: 'component', tier: 3, rarity: 'rare', description: 'Microscopic machines', sources: ['Nanotechnology Lab', 'Salvage'], usedIn: ['Self-Repair', 'Advanced Systems'] },
  
  // Master Materials (Tier 4)
  { id: 'mat_quantum_steel', name: 'Quantum Steel', type: 'refined', tier: 4, rarity: 'epic', description: 'Quantum-enhanced alloy', sources: ['Quantum Forging', 'Exotic Mining'], usedIn: ['Capital Ships', 'Quantum Weapons'] },
  { id: 'mat_antimatter', name: 'Antimatter Cell', type: 'exotic', tier: 4, rarity: 'epic', description: 'Contained antimatter', sources: ['Antimatter Production', 'Black Holes'], usedIn: ['Antimatter Weapons', 'Exotic Reactors'] },
  { id: 'mat_quantum_crystal', name: 'Quantum Crystal', type: 'exotic', tier: 4, rarity: 'epic', description: 'Quantum-entangled crystal', sources: ['Quantum Mining', 'Dimensional Rifts'], usedIn: ['Quantum Shields', 'Advanced Computing'] },
  { id: 'mat_quantum_processor', name: 'Quantum Processor', type: 'component', tier: 4, rarity: 'epic', description: 'Quantum computing unit', sources: ['Advanced Manufacturing', 'Research'], usedIn: ['AI Systems', 'Quantum Computers'] },
  { id: 'mat_exotic_alloy', name: 'Exotic Alloy', type: 'exotic', tier: 4, rarity: 'epic', description: 'Rare exotic metal blend', sources: ['Exotic Refining', 'Alien Technology'], usedIn: ['Legendary Ships', 'Advanced Modules'] },
  
  // Legendary Materials (Tier 5)
  { id: 'mat_dark_matter', name: 'Dark Matter Core', type: 'cosmic', tier: 5, rarity: 'legendary', description: 'Stabilized dark matter', sources: ['Dark Matter Harvesting', 'Cosmic Events'], usedIn: ['Singularity Weapons', 'Exotic Systems'] },
  { id: 'mat_phase_crystal', name: 'Phase Crystal', type: 'cosmic', tier: 5, rarity: 'legendary', description: 'Phase-shifting crystal', sources: ['Dimensional Mining', 'Cosmic Anomalies'], usedIn: ['Cloaking Devices', 'Phase Systems'] },
  { id: 'mat_cosmic_essence', name: 'Cosmic Essence', type: 'essence', tier: 5, rarity: 'legendary', description: 'Pure cosmic energy', sources: ['Cosmic Harvesting', 'Stellar Events'], usedIn: ['Ultimate Shields', 'Cosmic Weapons'] },
  { id: 'mat_cosmic_alloy', name: 'Cosmic Alloy', type: 'cosmic', tier: 5, rarity: 'legendary', description: 'Ultimate construction material', sources: ['Cosmic Forging', 'Ancient Technology'], usedIn: ['Titan Ships', 'Megastructures'] },
  { id: 'mat_temporal_fragment', name: 'Temporal Fragment', type: 'cosmic', tier: 5, rarity: 'mythic', description: 'Crystallized time essence', sources: ['Time Anomalies', 'Ancient Ruins'], usedIn: ['Time Manipulation', 'Ultimate Technology'] },
  
  // NEW TIER 6 - Transcendent Materials
  {
    id: 'void_essence',
    name: 'Void Essence',
    tier: 6,
    rarity: 'mythic',
    description: 'Pure essence extracted from the void between dimensions',
    sources: ['Void Rifts', 'Dimensional Tears', 'Black Holes'],
    usedIn: ['Ultimate Artifacts', 'Transcendent Weapons'],
    image: 'https://readdy.ai/api/search-image?query=void%20essence%20dark%20purple%20energy%20swirling%20with%20dimensional%20power%20sci-fi%20material%20icon&width=400&height=400&seq=mat_void1&orientation=squarish'
  },
  {
    id: 'stellar_plasma',
    name: 'Stellar Plasma',
    tier: 6,
    rarity: 'mythic',
    description: 'Superheated plasma from the core of stars',
    sources: ['Star Mining', 'Supernova Events', 'Stellar Forges'],
    usedIn: ['Plasma Weapons', 'Fusion Reactors'],
    image: 'https://readdy.ai/api/search-image?query=stellar%20plasma%20glowing%20orange%20yellow%20energy%20from%20star%20core%20sci-fi%20material%20icon&width=400&height=400&seq=mat_plasma1&orientation=squarish'
  },
  {
    id: 'quantum_foam',
    name: 'Quantum Foam',
    tier: 6,
    rarity: 'mythic',
    description: 'Unstable quantum particles at the Planck scale',
    sources: ['Quantum Experiments', 'Particle Accelerators', 'Reality Tears'],
    usedIn: ['Quantum Computers', 'Reality Manipulators'],
    image: 'https://readdy.ai/api/search-image?query=quantum%20foam%20bubbling%20particles%20with%20probability%20waves%20sci-fi%20material%20icon&width=400&height=400&seq=mat_foam1&orientation=squarish'
  },
  {
    id: 'living_metal',
    name: 'Living Metal',
    tier: 6,
    rarity: 'mythic',
    description: 'Self-repairing metallic organism hybrid',
    sources: ['Ancient Ruins', 'Precursor Sites', 'Bio-Forges'],
    usedIn: ['Self-Healing Armor', 'Adaptive Weapons'],
    image: 'https://readdy.ai/api/search-image?query=living%20metal%20with%20organic%20patterns%20and%20self-healing%20properties%20sci-fi%20material%20icon&width=400&height=400&seq=mat_living1&orientation=squarish'
  },
  {
    id: 'chrono_dust',
    name: 'Chrono Dust',
    tier: 6,
    rarity: 'mythic',
    description: 'Particles that exist outside normal time flow',
    sources: ['Time Anomalies', 'Temporal Storms', 'Ancient Clocks'],
    usedIn: ['Time Manipulation Devices', 'Temporal Shields'],
    image: 'https://readdy.ai/api/search-image?query=chrono%20dust%20golden%20particles%20with%20clock%20symbols%20and%20time%20distortion%20sci-fi%20material%20icon&width=400&height=400&seq=mat_chrono1&orientation=squarish'
  },
  {
    id: 'psionic_crystal',
    name: 'Psionic Crystal',
    tier: 6,
    rarity: 'mythic',
    description: 'Crystallized psychic energy',
    sources: ['Psionic Beings', 'Mind Temples', 'Consciousness Nodes'],
    usedIn: ['Neural Interfaces', 'Mind Control Devices'],
    image: 'https://readdy.ai/api/search-image?query=psionic%20crystal%20glowing%20purple%20with%20mental%20energy%20waves%20sci-fi%20material%20icon&width=400&height=400&seq=mat_psi1&orientation=squarish'
  },
  {
    id: 'graviton_particle',
    name: 'Graviton Particles',
    tier: 6,
    rarity: 'mythic',
    description: 'Theoretical particles that carry gravitational force',
    sources: ['Gravity Wells', 'Singularities', 'Graviton Collectors'],
    usedIn: ['Gravity Weapons', 'Artificial Gravity Systems'],
    image: 'https://readdy.ai/api/search-image?query=graviton%20particles%20with%20gravity%20field%20lines%20and%20mass%20distortion%20sci-fi%20material%20icon&width=400&height=400&seq=mat_grav1&orientation=squarish'
  },
  {
    id: 'dimensional_shard',
    name: 'Dimensional Shard',
    tier: 6,
    rarity: 'mythic',
    description: 'Fragment of another dimension',
    sources: ['Dimensional Portals', 'Reality Breaks', 'Multiverse Nodes'],
    usedIn: ['Portal Generators', 'Dimensional Storage'],
    image: 'https://readdy.ai/api/search-image?query=dimensional%20shard%20with%20multiverse%20colors%20and%20reality%20fractures%20sci-fi%20material%20icon&width=400&height=400&seq=mat_dim1&orientation=squarish'
  },
  {
    id: 'zero_point_energy',
    name: 'Zero Point Energy Cell',
    tier: 6,
    rarity: 'mythic',
    description: 'Energy extracted from quantum vacuum',
    sources: ['Vacuum Extractors', 'Quantum Generators', 'Energy Voids'],
    usedIn: ['Infinite Power Sources', 'Ultimate Weapons'],
    image: 'https://readdy.ai/api/search-image?query=zero%20point%20energy%20cell%20with%20infinite%20power%20symbol%20and%20quantum%20vacuum%20sci-fi%20material%20icon&width=400&height=400&seq=mat_zero1&orientation=squarish'
  },
  {
    id: 'neutrino_mesh',
    name: 'Neutrino Mesh',
    tier: 6,
    rarity: 'mythic',
    description: 'Woven fabric of captured neutrinos',
    sources: ['Neutrino Detectors', 'Stellar Winds', 'Particle Storms'],
    usedIn: ['Stealth Systems', 'Phase Shields'],
    image: 'https://readdy.ai/api/search-image?query=neutrino%20mesh%20invisible%20particle%20network%20with%20detection%20resistance%20sci-fi%20material%20icon&width=400&height=400&seq=mat_neut1&orientation=squarish'
  },

  // NEW TIER 7 - Ascendant Materials
  {
    id: 'primordial_essence',
    name: 'Primordial Essence',
    tier: 7,
    rarity: 'universal',
    description: 'The first matter created at the birth of the universe',
    sources: ['Big Bang Remnants', 'Creation Nodes', 'Universe Seeds'],
    usedIn: ['Genesis Devices', 'Universe Creation'],
    image: 'https://readdy.ai/api/search-image?query=primordial%20essence%20with%20big%20bang%20energy%20and%20creation%20power%20sci-fi%20material%20icon&width=400&height=400&seq=mat_prim1&orientation=squarish'
  },
  {
    id: 'omega_matter',
    name: 'Omega Matter',
    tier: 7,
    rarity: 'universal',
    description: 'The final form of matter at the end of time',
    sources: ['Heat Death Zones', 'Entropy Wells', 'End Times'],
    usedIn: ['Entropy Weapons', 'Time End Devices'],
    image: 'https://readdy.ai/api/search-image?query=omega%20matter%20with%20end%20of%20universe%20energy%20and%20entropy%20power%20sci-fi%20material%20icon&width=400&height=400&seq=mat_omega1&orientation=squarish'
  },
  {
    id: 'consciousness_matrix',
    name: 'Consciousness Matrix',
    tier: 7,
    rarity: 'universal',
    description: 'Crystallized collective consciousness of civilizations',
    sources: ['Ascended Beings', 'Hive Minds', 'Consciousness Nexus'],
    usedIn: ['AI Gods', 'Collective Intelligence'],
    image: 'https://readdy.ai/api/search-image?query=consciousness%20matrix%20with%20neural%20networks%20and%20collective%20mind%20energy%20sci-fi%20material%20icon&width=400&height=400&seq=mat_cons1&orientation=squarish'
  },
  {
    id: 'reality_code',
    name: 'Reality Source Code',
    tier: 7,
    rarity: 'universal',
    description: 'The fundamental code that defines reality itself',
    sources: ['Reality Cores', 'Simulation Breaks', 'Matrix Nodes'],
    usedIn: ['Reality Rewriting', 'Universe Hacking'],
    image: 'https://readdy.ai/api/search-image?query=reality%20source%20code%20with%20matrix%20symbols%20and%20universe%20programming%20sci-fi%20material%20icon&width=400&height=400&seq=mat_code1&orientation=squarish'
  },
  {
    id: 'infinity_stone',
    name: 'Infinity Stone',
    tier: 7,
    rarity: 'universal',
    description: 'Stone containing infinite power of a fundamental force',
    sources: ['Universe Creation', 'Cosmic Forges', 'Infinity Wells'],
    usedIn: ['Ultimate Artifacts', 'God-Tier Weapons'],
    image: 'https://readdy.ai/api/search-image?query=infinity%20stone%20with%20cosmic%20power%20and%20fundamental%20force%20energy%20sci-fi%20material%20icon&width=400&height=400&seq=mat_inf1&orientation=squarish'
  }
];

// Update material tiers
export const materialTiers = [
  { tier: 1, name: 'Basic', color: 'text-gray-400' },
  { tier: 2, name: 'Advanced', color: 'text-blue-400' },
  { tier: 3, name: 'Elite', color: 'text-purple-400' },
  { tier: 4, name: 'Master', color: 'text-yellow-400' },
  { tier: 5, name: 'Legendary', color: 'text-orange-400' },
  { tier: 6, name: 'Transcendent', color: 'text-pink-400' },
  { tier: 7, name: 'Ascendant', color: 'text-red-400' }
];

// Resource Types for Population and Crafting
export interface ResourceType {
  id: string;
  name: string;
  category: 'basic' | 'advanced' | 'exotic' | 'life_support';
  description: string;
  icon: string;
  color: string;
}

export const resourceTypes: ResourceType[] = [
  // Basic Resources
  { id: 'metal', name: 'Metal', category: 'basic', description: 'Basic construction material', icon: 'ri-hammer-line', color: '#94a3b8' },
  { id: 'crystal', name: 'Crystal', category: 'basic', description: 'Energy and technology resource', icon: 'ri-flashlight-line', color: '#60a5fa' },
  { id: 'deuterium', name: 'Deuterium', category: 'basic', description: 'Fuel for ships and reactors', icon: 'ri-drop-line', color: '#34d399' },
  
  // Advanced Resources
  { id: 'darkMatter', name: 'Dark Matter', category: 'advanced', description: 'Exotic energy source', icon: 'ri-contrast-drop-line', color: '#a78bfa' },
  { id: 'exoticMatter', name: 'Exotic Matter', category: 'exotic', description: 'Rare cosmic material', icon: 'ri-star-line', color: '#f472b6' },
  { id: 'antimatter', name: 'Antimatter', category: 'exotic', description: 'Powerful energy source', icon: 'ri-flashlight-fill', color: '#ef4444' },
  { id: 'nanites', name: 'Nanites', category: 'advanced', description: 'Self-replicating machines', icon: 'ri-cpu-line', color: '#06b6d4' },
  { id: 'plasma', name: 'Plasma', category: 'advanced', description: 'Ionized gas for weapons', icon: 'ri-fire-line', color: '#f59e0b' },
  
  // Life Support Resources
  { id: 'food', name: 'Food', category: 'life_support', description: 'Sustains population', icon: 'ri-restaurant-line', color: '#84cc16' },
  { id: 'water', name: 'Water', category: 'life_support', description: 'Essential for colonization', icon: 'ri-drop-line', color: '#3b82f6' },
  { id: 'oxygen', name: 'Oxygen', category: 'life_support', description: 'Breathable atmosphere', icon: 'ri-windy-line', color: '#10b981' },
  { id: 'energy', name: 'Energy', category: 'basic', description: 'Powers all systems', icon: 'ri-flashlight-line', color: '#eab308' }
];
