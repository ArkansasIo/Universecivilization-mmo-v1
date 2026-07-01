export const shipCategories = [
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

export const shipClasses = [
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

export const craftingMaterialTypes = [
  // Basic Materials
  { id: 'titanium-alloy', name: 'Titanium Alloy', type: 'material', rarity: 'Common', description: 'Basic hull construction material', baseValue: 100 },
  { id: 'durasteel', name: 'Durasteel', type: 'material', rarity: 'Common', description: 'Reinforced structural material', baseValue: 150 },
  { id: 'plasteel', name: 'Plasteel', type: 'material', rarity: 'Uncommon', description: 'Lightweight armor plating', baseValue: 250 },
  { id: 'crystal-matrix', name: 'Crystal Matrix', type: 'material', rarity: 'Uncommon', description: 'Advanced energy systems component', baseValue: 400 },
  { id: 'neutronium', name: 'Neutronium', type: 'material', rarity: 'Rare', description: 'Ultra-dense armor material', baseValue: 800 },
  { id: 'antimatter-cell', name: 'Antimatter Cell', type: 'material', rarity: 'Rare', description: 'High-energy power source', baseValue: 1200 },
  { id: 'dark-matter-shard', name: 'Dark Matter Shard', type: 'material', rarity: 'Epic', description: 'Exotic matter fragment', baseValue: 2500 },
  { id: 'dimensional-crystal', name: 'Dimensional Crystal', type: 'material', rarity: 'Mythic', description: 'Reality-bending material', baseValue: 10000 },
  
  // Components
  { id: 'fusion-core', name: 'Fusion Core', type: 'component', rarity: 'Common', description: 'Basic power reactor', baseValue: 300 },
  { id: 'plasma-conduit', name: 'Plasma Conduit', type: 'component', rarity: 'Uncommon', description: 'Energy transfer system', baseValue: 500 },
  { id: 'shield-generator', name: 'Shield Generator', type: 'component', rarity: 'Uncommon', description: 'Defensive shield projector', baseValue: 600 },
  { id: 'quantum-processor', name: 'Quantum Processor', type: 'component', rarity: 'Epic', description: 'Advanced AI and targeting systems', baseValue: 3000 },
  { id: 'graviton-emitter', name: 'Graviton Emitter', type: 'component', rarity: 'Epic', description: 'Gravity manipulation device', baseValue: 3500 },
  { id: 'dark-matter-core', name: 'Dark Matter Core', type: 'component', rarity: 'Legendary', description: 'Exotic energy reactor core', baseValue: 8000 },
  { id: 'reality-stabilizer', name: 'Reality Stabilizer', type: 'component', rarity: 'Mythic', description: 'Maintains dimensional integrity', baseValue: 15000 },
  
  // Blueprint Fragments
  { id: 'fighter-fragment', name: 'Fighter Blueprint Fragment', type: 'fragment', rarity: 'Common', description: 'Blueprint fragment for fighter-class ships', baseValue: 50 },
  { id: 'corvette-fragment', name: 'Corvette Blueprint Fragment', type: 'fragment', rarity: 'Uncommon', description: 'Blueprint fragment for corvette-class ships', baseValue: 100 },
  { id: 'frigate-fragment', name: 'Frigate Blueprint Fragment', type: 'fragment', rarity: 'Uncommon', description: 'Blueprint fragment for frigate-class ships', baseValue: 150 },
  { id: 'destroyer-fragment', name: 'Destroyer Blueprint Fragment', type: 'fragment', rarity: 'Rare', description: 'Blueprint fragment for destroyer-class ships', baseValue: 300 },
  { id: 'cruiser-fragment', name: 'Cruiser Blueprint Fragment', type: 'fragment', rarity: 'Rare', description: 'Blueprint fragment for cruiser-class ships', baseValue: 500 },
  { id: 'battleship-fragment', name: 'Battleship Blueprint Fragment', type: 'fragment', rarity: 'Epic', description: 'Blueprint fragment for battleship-class ships', baseValue: 1000 },
  { id: 'capital-fragment', name: 'Capital Ship Blueprint Fragment', type: 'fragment', rarity: 'Legendary', description: 'Blueprint fragment for capital ships', baseValue: 2000 },
  { id: 'special-fragment', name: 'Special Ship Blueprint Fragment', type: 'fragment', rarity: 'Mythic', description: 'Blueprint fragment for special ships', baseValue: 5000 },
  
  // Rare Items
  { id: 'ancient-artifact', name: 'Ancient Artifact', type: 'blueprint', rarity: 'Legendary', description: 'Mysterious ancient technology', baseValue: 10000 },
  { id: 'precursor-data', name: 'Precursor Data Core', type: 'blueprint', rarity: 'Legendary', description: 'Advanced alien technology data', baseValue: 12000 },
  { id: 'cosmic-essence', name: 'Cosmic Essence', type: 'material', rarity: 'Cosmic', description: 'Pure cosmic energy', baseValue: 25000 },
  { id: 'universal-blueprint', name: 'Universal Blueprint', type: 'blueprint', rarity: 'Universal', description: 'Complete ship design schematics', baseValue: 50000 }
];

export const blueprintSources = [
  'Complete high-level missions and campaigns',
  'Defeat powerful enemy fleets and bosses',
  'Explore dangerous sectors and anomalies',
  'Purchase from the galactic marketplace',
  'Trade with other players',
  'Research and development projects',
  'Expedition rewards and discoveries',
  'Alliance war victories',
  'Raid legendary targets',
  'Special events and tournaments'
];

export const getMaterialsByRarity = (rarity: string) => {
  if (rarity === 'all') return craftingMaterialTypes;
  return craftingMaterialTypes.filter(mat => mat.rarity === rarity);
};

export const getMaterialsByType = (type: string) => {
  if (type === 'all') return craftingMaterialTypes;
  return craftingMaterialTypes.filter(mat => mat.type === type);
};
