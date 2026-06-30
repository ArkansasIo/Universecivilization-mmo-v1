import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMasterCrafting } from '../../hooks/useMasterCrafting';
import { craftingItems } from '../../data/craftingItems';
import { craftingMaterials } from '../../data/craftingMaterials';

const MasterCraftingPage = () => {
  const { user } = useAuth();
  const {
    craftingQueue,
    materials,
    craftingSkills,
    loading,
    startCrafting,
    speedUpCrafting,
    claimCraftedItem,
    cancelCrafting,
    addMaterial,
    getCraftableItems,
    dismantleItem
  } = useMasterCrafting(user?.id || '');

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [craftQuantity, setCraftQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'craft' | 'queue' | 'materials' | 'skills'>('craft');

  const categories = ['all', 'weapon', 'armor', 'module', 'component', 'blueprint', 'technology', 'equipment', 'starship'];
  const tiers = [0, 1, 2, 3, 4, 5];

  const filteredItems = craftingItems.filter(item => {
    if (selectedCategory !== 'all' && item.type !== selectedCategory) return false;
    if (selectedTier !== 0 && item.tier !== selectedTier) return false;
    return true;
  });

  const getRarityColor = (rarity: string) => {
    const colors: any = {
      common: 'text-slate-400',
      uncommon: 'text-green-400',
      rare: 'text-blue-400',
      epic: 'text-purple-400',
      legendary: 'text-orange-400',
      mythic: 'text-pink-400',
      universal: 'text-cyan-400'
    };
    return colors[rarity] || 'text-slate-400';
  };

  const getClassColor = (itemClass: string) => {
    const colors: any = {
      basic: 'bg-slate-600',
      advanced: 'bg-green-600',
      elite: 'bg-blue-600',
      master: 'bg-purple-600',
      legendary: 'bg-orange-600',
      mythic: 'bg-pink-600',
      quantum: 'bg-cyan-600',
      cosmic: 'bg-indigo-600',
      universal: 'bg-gradient-to-r from-purple-600 to-pink-600'
    };
    return colors[itemClass] || 'bg-slate-600';
  };

  const handleCraft = async (itemId: string) => {
    const result = await startCrafting(itemId, craftQuantity);
    if (result.success) {
      setSelectedItem(null);
      setCraftQuantity(1);
    }
    alert(result.message);
  };

  const handleClaim = async (queueId: string) => {
    const result = await claimCraftedItem(queueId);
    alert(result.message);
  };

  const handleCancel = async (queueId: string) => {
    if (confirm('Cancel crafting? You will receive 50% materials back.')) {
      const result = await cancelCrafting(queueId);
      alert(result.message);
    }
  };

  const handleSpeedUp = async (queueId: string) => {
    if (confirm('Speed up crafting for 100 Dark Matter?')) {
      const result = await speedUpCrafting(queueId, 100);
      alert(result.message);
    }
  };

  const getMaterialQuantity = (materialId: string) => {
    const mat = materials.find(m => m.materialId === materialId);
    return mat ? mat.quantity : 0;
  };

  const canCraft = (item: any) => {
    // Check skill
    if (item.requiredSkill) {
      const skill = craftingSkills.find(s => s.skillName === item.requiredSkill);
      if (!skill || skill.level < (item.requiredSkillLevel || 0)) return false;
    }

    // Check materials
    return item.materials.every((mat: any) => {
      return getMaterialQuantity(mat.id) >= mat.amount * craftQuantity;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Master Crafting System...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <i className="ri-hammer-line"></i>
            Master Crafting System
          </h1>
          <p className="text-slate-300">Forge legendary items and equipment</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['craft', 'queue', 'materials', 'skills'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab === 'craft' && <><i className="ri-hammer-line mr-2"></i>Craft Items</>}
              {tab === 'queue' && <><i className="ri-time-line mr-2"></i>Crafting Queue ({craftingQueue.length})</>}
              {tab === 'materials' && <><i className="ri-box-3-line mr-2"></i>Materials ({materials.length})</>}
              {tab === 'skills' && <><i className="ri-star-line mr-2"></i>Skills</>}
            </button>
          ))}
        </div>

        {/* Craft Tab */}
        {activeTab === 'craft' && (
          <div>
            {/* Filters */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="text-white font-semibold mb-2 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedCategory === cat
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tier Filter */}
                <div>
                  <label className="text-white font-semibold mb-2 block">Tier</label>
                  <div className="flex gap-2">
                    {tiers.map(tier => (
                      <button
                        key={tier}
                        onClick={() => setSelectedTier(tier)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedTier === tier
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {tier === 0 ? 'All' : `T${tier}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border-2 border-slate-700 hover:border-purple-500 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className={`text-lg font-bold ${getRarityColor(item.rarity)}`}>
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getClassColor(item.class)}`}>
                          {item.class.toUpperCase()}
                        </span>
                        <span className="text-slate-400 text-sm">Tier {item.tier}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-400 text-xs">Level {item.requiredLevel}</div>
                      {item.requiredSkill && (
                        <div className="text-purple-400 text-xs">
                          {item.requiredSkill} {item.requiredSkillLevel}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm mb-3">{item.description}</p>

                  {/* Materials */}
                  <div className="space-y-1 mb-3">
                    {item.materials.slice(0, 3).map(mat => {
                      const hasEnough = getMaterialQuantity(mat.id) >= mat.amount;
                      return (
                        <div key={mat.id} className="flex justify-between text-sm">
                          <span className={hasEnough ? 'text-green-400' : 'text-red-400'}>
                            {mat.name}
                          </span>
                          <span className={hasEnough ? 'text-green-400' : 'text-red-400'}>
                            {getMaterialQuantity(mat.id)}/{mat.amount}
                          </span>
                        </div>
                      );
                    })}
                    {item.materials.length > 3 && (
                      <div className="text-slate-400 text-xs">+{item.materials.length - 3} more...</div>
                    )}
                  </div>

                  {/* Crafting Time */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">
                      <i className="ri-time-line mr-1"></i>
                      {Math.floor(item.craftingTime / 60)}m {item.craftingTime % 60}s
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                      disabled={!canCraft(item)}
                      className={`px-4 py-1 rounded-lg font-semibold transition-all ${
                        canCraft(item)
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                          : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      Craft
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Queue Tab */}
        {activeTab === 'queue' && (
          <div className="space-y-4">
            {craftingQueue.length === 0 ? (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-12 text-center">
                <i className="ri-inbox-line text-6xl text-slate-600 mb-4"></i>
                <p className="text-slate-400 text-lg">No items in crafting queue</p>
              </div>
            ) : (
              craftingQueue.map(queue => (
                <div key={queue.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{queue.itemName}</h3>
                      <p className="text-slate-400">Quantity: {queue.quantity}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        queue.status === 'completed' ? 'text-green-400' : 'text-purple-400'
                      }`}>
                        {queue.status === 'completed' ? 'COMPLETED' : `${queue.progress.toFixed(1)}%`}
                      </div>
                      {queue.status === 'crafting' && (
                        <div className="text-slate-400 text-sm">
                          {Math.ceil((queue.endTime.getTime() - Date.now()) / 1000)}s remaining
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${queue.progress}%` }}
                    ></div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {queue.status === 'completed' ? (
                      <button
                        onClick={() => handleClaim(queue.id)}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        <i className="ri-check-line mr-2"></i>
                        Claim Item
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleSpeedUp(queue.id)}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                          <i className="ri-flashlight-line mr-2"></i>
                          Speed Up (100 DM)
                        </button>
                        <button
                          onClick={() => handleCancel(queue.id)}
                          className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all"
                        >
                          <i className="ri-close-line mr-2"></i>
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Materials Tab */}
        {activeTab === 'materials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {craftingMaterials.map(material => {
              const playerMat = materials.find(m => m.materialId === material.id);
              const quantity = playerMat ? playerMat.quantity : 0;

              return (
                <div key={material.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border-2 border-slate-700">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className={`text-lg font-bold ${getRarityColor(material.rarity)}`}>
                        {material.name}
                      </h3>
                      <span className="text-slate-400 text-sm">Tier {material.tier}</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{quantity}</div>
                  </div>

                  <p className="text-slate-300 text-sm mb-3">{material.description}</p>

                  <div className="space-y-2">
                    <div>
                      <div className="text-slate-400 text-xs mb-1">Sources:</div>
                      <div className="flex flex-wrap gap-1">
                        {material.sources.map(source => (
                          <span key={source} className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-xs mb-1">Used In:</div>
                      <div className="flex flex-wrap gap-1">
                        {material.usedIn.map(use => (
                          <span key={use} className="bg-purple-900/50 text-purple-300 px-2 py-1 rounded text-xs">
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {craftingSkills.map(skill => (
              <div key={skill.skillName} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white capitalize">
                    {skill.skillName.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <div className="text-3xl font-bold text-purple-400">
                    {skill.level}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Experience</span>
                    <span>{skill.experience} / {skill.nextLevelXP}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all"
                      style={{ width: `${(skill.experience / skill.nextLevelXP) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-slate-300 text-sm">
                  <p>Craft items to gain experience and level up this skill.</p>
                  <p className="mt-2 text-purple-400">
                    Next level: {skill.nextLevelXP - skill.experience} XP needed
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Craft Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className={`text-3xl font-bold ${getRarityColor(selectedItem.rarity)} mb-2`}>
                      {selectedItem.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded text-sm font-bold text-white ${getClassColor(selectedItem.class)}`}>
                        {selectedItem.class.toUpperCase()}
                      </span>
                      <span className="text-slate-400">Tier {selectedItem.tier}</span>
                      <span className="text-slate-400">Level {selectedItem.requiredLevel}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-slate-400 hover:text-white text-2xl"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>

                <p className="text-slate-300 mb-6">{selectedItem.description}</p>

                {/* Stats */}
                {selectedItem.stats && (
                  <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
                    <h3 className="text-white font-bold mb-3">Stats</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedItem.stats).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-slate-400 capitalize">{key}:</span>
                          <span className="text-white font-semibold">{value as any}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Effects */}
                {selectedItem.effects && selectedItem.effects.length > 0 && (
                  <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
                    <h3 className="text-white font-bold mb-3">Special Effects</h3>
                    <ul className="space-y-2">
                      {selectedItem.effects.map((effect: string, idx: number) => (
                        <li key={idx} className="text-purple-400 flex items-start gap-2">
                          <i className="ri-star-fill text-sm mt-1"></i>
                          <span>{effect}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Materials Required */}
                <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
                  <h3 className="text-white font-bold mb-3">Materials Required</h3>
                  <div className="space-y-2">
                    {selectedItem.materials.map((mat: any) => {
                      const hasEnough = getMaterialQuantity(mat.id) >= mat.amount * craftQuantity;
                      return (
                        <div key={mat.id} className="flex justify-between items-center">
                          <span className={hasEnough ? 'text-green-400' : 'text-red-400'}>
                            {mat.name}
                          </span>
                          <span className={hasEnough ? 'text-green-400' : 'text-red-400'}>
                            {getMaterialQuantity(mat.id)} / {mat.amount * craftQuantity}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Resources Required */}
                {selectedItem.resources && (
                  <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
                    <h3 className="text-white font-bold mb-3">Resources Required</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedItem.resources).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-slate-400 capitalize">{key}:</span>
                          <span className="text-white font-semibold">{(value as number) * craftQuantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
                  <h3 className="text-white font-bold mb-3">Quantity</h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setCraftQuantity(Math.max(1, craftQuantity - 1))}
                      className="bg-slate-700 text-white w-10 h-10 rounded-lg hover:bg-slate-600 transition-all"
                    >
                      <i className="ri-subtract-line"></i>
                    </button>
                    <input
                      type="number"
                      value={craftQuantity}
                      onChange={(e) => setCraftQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg text-center font-bold"
                      min="1"
                    />
                    <button
                      onClick={() => setCraftQuantity(craftQuantity + 1)}
                      className="bg-slate-700 text-white w-10 h-10 rounded-lg hover:bg-slate-600 transition-all"
                    >
                      <i className="ri-add-line"></i>
                    </button>
                  </div>
                  <p className="text-slate-400 text-sm mt-2 text-center">
                    Total time: {Math.floor((selectedItem.craftingTime * craftQuantity) / 60)}m {(selectedItem.craftingTime * craftQuantity) % 60}s
                  </p>
                </div>

                {/* Craft Button */}
                <button
                  onClick={() => handleCraft(selectedItem.id)}
                  disabled={!canCraft(selectedItem)}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    canCraft(selectedItem)
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-2xl'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {canCraft(selectedItem) ? (
                    <>
                      <i className="ri-hammer-line mr-2"></i>
                      Start Crafting
                    </>
                  ) : (
                    'Insufficient Materials or Skill'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterCraftingPage;
