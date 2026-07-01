import { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { storeItems, premiumCurrencyPacks } from '../../data/storeItems';

export default function StorePage() {
  const { inventory, purchasing, purchaseItem, purchasePremiumCurrency } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const categories = [
    { id: 'all', name: 'All Items', icon: 'ri-store-2-line' },
    { id: 'ship', name: 'Ships', icon: 'ri-rocket-line' },
    { id: 'blueprint', name: 'Blueprints', icon: 'ri-file-list-3-line' },
    { id: 'resource', name: 'Resources', icon: 'ri-database-2-line' },
    { id: 'booster', name: 'Boosters', icon: 'ri-flashlight-line' },
    { id: 'cosmetic', name: 'Cosmetics', icon: 'ri-palette-line' },
    { id: 'officer', name: 'Officers', icon: 'ri-user-star-line' },
    { id: 'bundle', name: 'Bundles', icon: 'ri-gift-line' }
  ];

  const rarityColors: Record<string, string> = {
    common: 'from-gray-400 to-gray-500',
    uncommon: 'from-green-400 to-green-500',
    rare: 'from-blue-400 to-blue-500',
    epic: 'from-purple-400 to-purple-500',
    legendary: 'from-orange-400 to-orange-500',
    mythic: 'from-red-400 to-red-500'
  };

  const filteredItems = selectedCategory === 'all' 
    ? storeItems 
    : storeItems.filter(item => item.category === selectedCategory);

  const featuredItems = storeItems.filter(item => item.featured);

  const handlePurchase = async (item: any) => {
    const success = await purchaseItem(item);
    if (success) {
      alert('Purchase successful!');
      setSelectedItem(null);
    }
  };

  const handleCurrencyPurchase = async (amount: number, price: number) => {
    // In real app, integrate with payment processor
    const confirmed = confirm(`Purchase ${amount} Premium Currency for $${price}?`);
    if (confirmed) {
      const success = await purchasePremiumCurrency(amount, price);
      if (success) {
        alert('Currency purchased successfully!');
        setShowCurrencyModal(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Galactic Store</h1>
              <p className="text-gray-300">Premium items, boosters, and exclusive content</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg px-6 py-3 flex items-center gap-3">
                <i className="ri-vip-crown-line text-2xl text-white"></i>
                <div>
                  <div className="text-xs text-white/80">Premium Currency</div>
                  <div className="text-xl font-bold text-white">{inventory?.premium_currency || 0}</div>
                </div>
              </div>
              <button
                onClick={() => setShowCurrencyModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <i className="ri-add-circle-line text-xl"></i>
                Buy Currency
              </button>
            </div>
          </div>
        </div>

        {/* Featured Items */}
        {featuredItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <i className="ri-star-line text-yellow-400"></i>
              Featured Items
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map(item => (
                <div
                  key={item.id}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border-2 border-yellow-500/50 hover:border-yellow-400 transition-all cursor-pointer transform hover:scale-105"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative h-48">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <div className={`absolute top-2 right-2 bg-gradient-to-r ${rarityColors[item.rarity]} text-white px-3 py-1 rounded-full text-xs font-bold uppercase`}>
                      {item.rarity}
                    </div>
                    {item.discount && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        -{item.discount}%
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <i className="ri-vip-crown-line text-yellow-400"></i>
                        <span className="text-white font-bold">{item.price.premiumCurrency}</span>
                      </div>
                      <button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              <i className={`${cat.icon} text-xl`}></i>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700 hover:border-purple-500 transition-all cursor-pointer transform hover:scale-105"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative h-40">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className={`absolute top-2 right-2 bg-gradient-to-r ${rarityColors[item.rarity]} text-white px-2 py-1 rounded-full text-xs font-bold uppercase`}>
                  {item.rarity}
                </div>
                {item.discount && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    -{item.discount}%
                  </div>
                )}
                {item.limited && (
                  <div className="absolute bottom-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    LIMITED
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{item.name}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className="ri-vip-crown-line text-yellow-400"></i>
                    <span className="text-white font-bold">{item.price.premiumCurrency}</span>
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-all whitespace-nowrap">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Item Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedItem(null)}>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-500" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className={`inline-block bg-gradient-to-r ${rarityColors[selectedItem.rarity]} text-white px-4 py-1 rounded-full text-sm font-bold uppercase mb-2`}>
                      {selectedItem.rarity}
                    </div>
                    <h2 className="text-3xl font-bold text-white">{selectedItem.name}</h2>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-white text-2xl">
                    <i className="ri-close-line"></i>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-64 object-cover rounded-lg" />
                  </div>
                  <div>
                    <p className="text-gray-300 mb-4">{selectedItem.description}</p>
                    
                    {selectedItem.stats && (
                      <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                        <h3 className="text-white font-bold mb-2">Stats</h3>
                        {Object.entries(selectedItem.stats).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400 capitalize">{key}:</span>
                            <span className="text-white font-semibold">{Array.isArray(value) ? value.join(', ') : value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedItem.contents && (
                      <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                        <h3 className="text-white font-bold mb-2">Contains</h3>
                        {selectedItem.contents.map((content: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">{content.name || content.type}:</span>
                            <span className="text-white font-semibold">{content.quantity.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedItem.requirements && (
                      <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                        <h3 className="text-white font-bold mb-2">Requirements</h3>
                        {Object.entries(selectedItem.requirements).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400 capitalize">{key}:</span>
                            <span className="text-white font-semibold">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg p-4">
                      <div>
                        <div className="text-gray-300 text-sm mb-1">Price</div>
                        <div className="flex items-center gap-2">
                          <i className="ri-vip-crown-line text-yellow-400 text-2xl"></i>
                          <span className="text-white font-bold text-2xl">{selectedItem.price.premiumCurrency}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePurchase(selectedItem)}
                        disabled={purchasing}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 text-white px-8 py-3 rounded-lg font-bold text-lg transition-all whitespace-nowrap"
                      >
                        {purchasing ? 'Processing...' : 'Purchase Now'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Currency Purchase Modal */}
        {showCurrencyModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowCurrencyModal(false)}>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl max-w-4xl w-full border-2 border-yellow-500" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <i className="ri-vip-crown-line text-yellow-400"></i>
                    Buy Premium Currency
                  </h2>
                  <button onClick={() => setShowCurrencyModal(false)} className="text-gray-400 hover:text-white text-2xl">
                    <i className="ri-close-line"></i>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {premiumCurrencyPacks.map(pack => (
                    <div
                      key={pack.id}
                      className={`bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 border-2 transition-all cursor-pointer hover:scale-105 ${
                        pack.popular ? 'border-yellow-500' : 'border-slate-600 hover:border-purple-500'
                      }`}
                      onClick={() => handleCurrencyPurchase(pack.amount + pack.bonus, pack.price)}
                    >
                      {pack.popular && (
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                          BEST VALUE
                        </div>
                      )}
                      <div className="text-center">
                        <i className="ri-vip-crown-line text-yellow-400 text-5xl mb-3"></i>
                        <div className="text-3xl font-bold text-white mb-2">{pack.amount.toLocaleString()}</div>
                        {pack.bonus > 0 && (
                          <div className="text-green-400 font-semibold mb-2">+{pack.bonus} Bonus!</div>
                        )}
                        <div className="text-gray-400 text-sm mb-4">Premium Currency</div>
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-xl py-3 rounded-lg">
                          ${pack.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <i className="ri-information-line text-blue-400 text-xl"></i>
                    <div className="text-sm text-gray-300">
                      <p className="font-semibold text-white mb-1">Secure Payment</p>
                      <p>All transactions are processed securely. Premium currency is added instantly to your account.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
