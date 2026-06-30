import { useState } from 'react';
import RecipeCompendium from './components/RecipeCompendium';
import MaterialWishlistPanel from '@/components/feature/MaterialWishlistPanel';

interface CraftingRecipe {
  id: string;
  name: string;
  category: 'weapon' | 'armor' | 'module' | 'consumable' | 'material';
  tier: number;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  description: string;
  craftTime: number;
  requirements: {
    level: number;
    skill: string;
    skillLevel: number;
  };
  materials: {
    id: string;
    name: string;
    quantity: number;
    icon: string;
  }[];
  output: {
    quantity: number;
    stats: any;
  };
  icon: string;
}

export default function CraftingPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedRecipe, setSelectedRecipe] = useState<CraftingRecipe | null>(null);
  const [craftQuantity, setCraftQuantity] = useState(1);
  const [craftingQueue, setCraftingQueue] = useState<any[]>([]);
  const [playerSkills] = useState<any>({
    weaponsmithing: 15,
    armorsmithing: 12,
    engineering: 18,
    alchemy: 10
  });

  const recipes: CraftingRecipe[] = [
    {
      id: 'plasma_cannon_mk1',
      name: 'Plasma Cannon Mk I',
      category: 'weapon',
      tier: 1,
      rarity: 'Uncommon',
      description: 'A basic plasma weapon with moderate damage output',
      craftTime: 300,
      requirements: { level: 10, skill: 'weaponsmithing', skillLevel: 5 },
      materials: [
        { id: 'metal', name: 'Metal', quantity: 5000, icon: 'ri-copper-coin-line' },
        { id: 'crystal', name: 'Crystal', quantity: 2000, icon: 'ri-drop-line' },
        { id: 'plasma_core', name: 'Plasma Core', quantity: 1, icon: 'ri-flashlight-line' }
      ],
      output: { quantity: 1, stats: { damage: 150, range: 500 } },
      icon: 'ri-sword-line'
    },
    {
      id: 'quantum_shield_mk1',
      name: 'Quantum Shield Mk I',
      category: 'armor',
      tier: 1,
      rarity: 'Rare',
      description: 'Advanced shield technology providing superior protection',
      craftTime: 450,
      requirements: { level: 15, skill: 'armorsmithing', skillLevel: 8 },
      materials: [
        { id: 'metal', name: 'Metal', quantity: 8000, icon: 'ri-copper-coin-line' },
        { id: 'crystal', name: 'Crystal', quantity: 5000, icon: 'ri-drop-line' },
        { id: 'quantum_matrix', name: 'Quantum Matrix', quantity: 2, icon: 'ri-contrast-drop-line' }
      ],
      output: { quantity: 1, stats: { shield: 500, regeneration: 10 } },
      icon: 'ri-shield-line'
    },
    {
      id: 'hyperdrive_module',
      name: 'Hyperdrive Module',
      category: 'module',
      tier: 2,
      rarity: 'Epic',
      description: 'Increases fleet speed by 25%',
      craftTime: 600,
      requirements: { level: 20, skill: 'engineering', skillLevel: 12 },
      materials: [
        { id: 'metal', name: 'Metal', quantity: 10000, icon: 'ri-copper-coin-line' },
        { id: 'deuterium', name: 'Deuterium', quantity: 5000, icon: 'ri-drop-line' },
        { id: 'exotic_matter', name: 'Exotic Matter', quantity: 3, icon: 'ri-star-line' }
      ],
      output: { quantity: 1, stats: { speedBonus: 25 } },
      icon: 'ri-rocket-line'
    },
    {
      id: 'repair_nanobots',
      name: 'Repair Nanobots',
      category: 'consumable',
      tier: 1,
      rarity: 'Common',
      description: 'Instantly repairs 50% of ship hull damage',
      craftTime: 120,
      requirements: { level: 5, skill: 'engineering', skillLevel: 3 },
      materials: [
        { id: 'metal', name: 'Metal', quantity: 1000, icon: 'ri-copper-coin-line' },
        { id: 'nanites', name: 'Nanites', quantity: 50, icon: 'ri-cpu-line' }
      ],
      output: { quantity: 10, stats: { healAmount: 50 } },
      icon: 'ri-heart-pulse-line'
    },
    {
      id: 'advanced_alloy',
      name: 'Advanced Alloy',
      category: 'material',
      tier: 2,
      rarity: 'Uncommon',
      description: 'High-grade material used in advanced crafting',
      craftTime: 180,
      requirements: { level: 12, skill: 'armorsmithing', skillLevel: 6 },
      materials: [
        { id: 'metal', name: 'Metal', quantity: 3000, icon: 'ri-copper-coin-line' },
        { id: 'crystal', name: 'Crystal', quantity: 1500, icon: 'ri-drop-line' }
      ],
      output: { quantity: 5, stats: {} },
      icon: 'ri-box-3-line'
    },
    {
      id: 'ion_cannon_mk2',
      name: 'Ion Cannon Mk II',
      category: 'weapon',
      tier: 2,
      rarity: 'Epic',
      description: 'Advanced ion weapon with shield-penetrating capabilities',
      craftTime: 900,
      requirements: { level: 25, skill: 'weaponsmithing', skillLevel: 15 },
      materials: [
        { id: 'metal', name: 'Metal', quantity: 15000, icon: 'ri-copper-coin-line' },
        { id: 'crystal', name: 'Crystal', quantity: 10000, icon: 'ri-drop-line' },
        { id: 'ion_core', name: 'Ion Core', quantity: 3, icon: 'ri-thunderstorms-line' },
        { id: 'advanced_alloy', name: 'Advanced Alloy', quantity: 5, icon: 'ri-box-3-line' }
      ],
      output: { quantity: 1, stats: { damage: 350, shieldPenetration: 30 } },
      icon: 'ri-flashlight-fill'
    },
    {
      id: 'energy_cell',
      name: 'Energy Cell',
      category: 'consumable',
      tier: 1,
      rarity: 'Common',
      description: 'Restores 100 energy to ships',
      craftTime: 60,
      requirements: { level: 3, skill: 'engineering', skillLevel: 1 },
      materials: [
        { id: 'crystal', name: 'Crystal', quantity: 500, icon: 'ri-drop-line' },
        { id: 'deuterium', name: 'Deuterium', quantity: 200, icon: 'ri-drop-line' }
      ],
      output: { quantity: 20, stats: { energyRestore: 100 } },
      icon: 'ri-battery-charge-line'
    },
    {
      id: 'stealth_module',
      name: 'Stealth Module',
      category: 'module',
      tier: 3,
      rarity: 'Legendary',
      description: 'Makes ships invisible to enemy sensors for 30 seconds',
      craftTime: 1200,
      requirements: { level: 35, skill: 'engineering', skillLevel: 20 },
      materials: [
        { id: 'metal', name: 'Metal', quantity: 25000, icon: 'ri-copper-coin-line' },
        { id: 'crystal', name: 'Crystal', quantity: 20000, icon: 'ri-drop-line' },
        { id: 'dark_matter', name: 'Dark Matter', quantity: 100, icon: 'ri-contrast-drop-fill' },
        { id: 'quantum_matrix', name: 'Quantum Matrix', quantity: 5, icon: 'ri-contrast-drop-line' }
      ],
      output: { quantity: 1, stats: { stealthDuration: 30 } },
      icon: 'ri-eye-off-line'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Recipes', icon: 'ri-apps-line', color: 'cyan' },
    { id: 'weapon', name: 'Weapons', icon: 'ri-sword-line', color: 'red' },
    { id: 'armor', name: 'Armor', icon: 'ri-shield-line', color: 'blue' },
    { id: 'module', name: 'Modules', icon: 'ri-cpu-line', color: 'purple' },
    { id: 'consumable', name: 'Consumables', icon: 'ri-flask-line', color: 'green' },
    { id: 'material', name: 'Materials', icon: 'ri-box-3-line', color: 'amber' }
  ];

  const filteredRecipes = activeCategory === 'all' 
    ? recipes 
    : recipes.filter(r => r.category === activeCategory);

  const getRarityColor = (rarity: string) => {
    const colors: any = {
      'Common': 'text-gray-400',
      'Uncommon': 'text-green-400',
      'Rare': 'text-blue-400',
      'Epic': 'text-purple-400',
      'Legendary': 'text-amber-400',
      'Mythic': 'text-red-400'
    };
    return colors[rarity] || 'text-gray-400';
  };

  const canCraft = () => {
    // Check materials (mock check)
    return true;
  };

  const handleCraft = async (recipe: CraftingRecipe) => {
    if (!canCraft()) {
      alert('⚠️ Insufficient Materials!\n\nYou don\'t have enough materials to craft this item.');
      return;
    }

    const totalTime = recipe.craftTime * craftQuantity;
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;

    const confirm = window.confirm(
      `🔨 Craft ${craftQuantity}x ${recipe.name}?\n\n` +
      `Materials Required:\n${recipe.materials.map(m => `• ${m.name}: ${m.quantity * craftQuantity}`).join('\n')}\n\n` +
      `Craft Time: ${minutes}m ${seconds}s\n` +
      `Skill Required: ${recipe.requirements.skill} Lv.${recipe.requirements.skillLevel}\n\n` +
      `Start crafting?`
    );

    if (confirm) {
      const newItem = {
        id: Date.now().toString(),
        recipe: recipe.name,
        quantity: craftQuantity,
        progress: 0,
        totalTime: totalTime,
        completesAt: new Date(Date.now() + totalTime * 1000)
      };

      setCraftingQueue(prev => [...prev, newItem]);
      alert(`✅ Crafting Started!\n\n${craftQuantity}x ${recipe.name} added to crafting queue!\n\nEstimated completion: ${minutes}m ${seconds}s`);
      setCraftQuantity(1);
    }
  };

  const handleCancelCraft = (itemId: string) => {
    const confirm = window.confirm('Cancel this crafting job?\n\nMaterials will be returned to your inventory.');
    if (confirm) {
      setCraftingQueue(prev => prev.filter(item => item.id !== itemId));
      alert('Crafting job cancelled. Materials returned.');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="text-white">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://readdy.ai/api/search-image?query=futuristic%20crafting%20workshop%20with%20holographic%20blueprints%20advanced%20manufacturing%20equipment%20glowing%20forge%20high-tech%20workbenches%20robotic%20arms%20assembling%20components%20sci-fi%20industrial%20facility&width=1920&height=600&seq=crafting-hero&orientation=landscape" alt="Crafting Background" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-[#d4a853] via-amber-400 to-[#e2c044] bg-clip-text text-transparent">Crafting Workshop</h1>
          <p className="text-xl text-gray-300">Forge powerful equipment and items for your empire</p>
          <div className="flex items-center space-x-8 mt-6">
            {Object.entries(playerSkills).map(([skill, level]) => (
              <div key={skill} className="flex items-center space-x-2">
                <i className="ri-hammer-line text-[#d4a853] text-xl"></i>
                <div>
                  <p className="text-sm text-[#8892aa] capitalize">{skill}</p>
                  <p className="text-lg font-bold text-[#d4a853]">Lv.{level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recipe Compendium */}
      <div className="pt-8">
        <RecipeCompendium />
      </div>

      {/* Material Wishlist */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <MaterialWishlistPanel />
      </div>

      {/* Crafting Queue */}
      {craftingQueue.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="bg-[#080b0f] border border-[#1e2a36] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <i className="ri-time-line text-[#d4a853] mr-3"></i>
              Crafting Queue ({craftingQueue.length})
            </h2>
            <div className="space-y-4">
              {craftingQueue.map((item) => {
                const timeLeft = Math.max(0, Math.floor((item.completesAt.getTime() - Date.now()) / 1000));
                const progress = Math.min(100, ((item.totalTime - timeLeft) / item.totalTime) * 100);

                return (
                  <div key={item.id} className="bg-[#080b0f] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-white font-bold">{item.quantity}x {item.recipe}</h3>
                        <p className="text-sm text-[#8892aa]">Time remaining: {formatTime(timeLeft)}</p>
                      </div>
                      <button
                        onClick={() => handleCancelCraft(item.id)}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all whitespace-nowrap cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="w-full bg-[#1e2a36] rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-[#d4a853] to-[#e2c044] h-3 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-[#d4a853] to-[#e2c044] text-[#080b0f] font-bold'
                  : 'bg-[#080b0f] text-[#8892aa] hover:text-white border border-[#1e2a36]'
              }`}
            >
              <i className={`${cat.icon} mr-2`}></i>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recipe List */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRecipes.map(recipe => (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className={`bg-[#080b0f] border rounded-2xl p-6 transition-all cursor-pointer ${
                    selectedRecipe?.id === recipe.id ? 'border-[#d4a853]' : 'border-[#1e2a36]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-[#d4a853]/15 rounded-xl flex items-center justify-center">
                      <i className={`${recipe.icon} text-3xl text-[#d4a853]`}></i>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${getRarityColor(recipe.rarity)}`}>
                        {recipe.rarity}
                      </span>
                      <p className="text-xs text-gray-400">Tier {recipe.tier}</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{recipe.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{recipe.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Craft Time:</span>
                      <span className="text-[#d4a853]">{formatTime(recipe.craftTime)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Required Level:</span>
                      <span className="text-white">{recipe.requirements.level}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 capitalize">{recipe.requirements.skill}:</span>
                      <span className={playerSkills[recipe.requirements.skill] >= recipe.requirements.skillLevel ? 'text-green-400' : 'text-red-400'}>
                        Lv.{recipe.requirements.skillLevel}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#080b0f] rounded-lg p-3">
                    <p className="text-xs text-[#8892aa] mb-2">Materials:</p>
                    <div className="space-y-1">
                      {recipe.materials.map(mat => (
                        <div key={mat.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            <i className={`${mat.icon} text-[#d4a853]`}></i>
                            <span className="text-white">{mat.name}</span>
                          </div>
                          <span className="text-[#8892aa]">{mat.quantity.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Crafting Panel */}
          <div className="space-y-6">
            {selectedRecipe ? (
              <div className="bg-[#080b0f] border border-[#1e2a36] rounded-2xl p-6 sticky top-6">
                <h2 className="text-2xl font-bold text-white mb-6">Craft Item</h2>

                <div className="mb-6">
                  <div className="w-24 h-24 bg-[#d4a853]/15 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <i className={`${selectedRecipe.icon} text-5xl text-[#d4a853]`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-white text-center mb-2">{selectedRecipe.name}</h3>
                  <p className={`text-center font-bold ${getRarityColor(selectedRecipe.rarity)}`}>
                    {selectedRecipe.rarity} • Tier {selectedRecipe.tier}
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-400 mb-2">Quantity</label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCraftQuantity(Math.max(1, craftQuantity - 1))}
                      className="w-10 h-10 bg-[#1e2a36] rounded-lg flex items-center justify-center hover:bg-[#2a3a4a] transition-all cursor-pointer"
                    >
                      <i className="ri-subtract-line text-white"></i>
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={craftQuantity}
                      onChange={(e) => setCraftQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 px-4 py-3 bg-[#080b0f] border border-[#1e2a36] rounded-lg text-white text-center focus:outline-none focus:border-[#d4a853]"
                    />
                    <button
                      onClick={() => setCraftQuantity(craftQuantity + 1)}
                      className="w-10 h-10 bg-[#1e2a36] rounded-lg flex items-center justify-center hover:bg-[#2a3a4a] transition-all cursor-pointer"
                    >
                      <i className="ri-add-line text-white"></i>
                    </button>
                  </div>
                </div>

                <div className="bg-[#080b0f] rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-bold text-[#8892aa] mb-3">Total Materials Required:</h4>
                  <div className="space-y-2">
                    {selectedRecipe.materials.map(mat => (
                      <div key={mat.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <i className={`${mat.icon} text-cyan-400`}></i>
                          <span className="text-white">{mat.name}</span>
                        </div>
                        <span className="text-[#d4a853] font-bold">
                          {(mat.quantity * craftQuantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#1e2a36] mt-3 pt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Total Time:</span>
                      <span className="text-cyan-400 font-bold">
                        {formatTime(selectedRecipe.craftTime * craftQuantity)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCraft(selectedRecipe)}
                  disabled={!canCraft(selectedRecipe)}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-all whitespace-nowrap ${
                    canCraft(selectedRecipe)
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:scale-105 cursor-pointer'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <i className="ri-hammer-line mr-2"></i>
                  Craft {craftQuantity}x {selectedRecipe.name}
                </button>
              </div>
            ) : (
              <div className="bg-[#080b0f] border border-[#1e2a36] rounded-2xl p-6 sticky top-6">
                <div className="text-center py-12">
                  <i className="ri-hammer-line text-6xl text-[#5a6577] mb-4"></i>
                  <p className="text-[#8892aa]">Select a recipe to start crafting</p>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-[#080b0f] border border-[#1e2a36] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Crafting Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#8892aa]">Items Crafted:</span>
                  <span className="text-[#d4a853] font-bold">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8892aa]">Active Jobs:</span>
                  <span className="text-[#d4a853] font-bold">{craftingQueue.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8892aa]">Success Rate:</span>
                  <span className="text-green-400 font-bold">98.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}