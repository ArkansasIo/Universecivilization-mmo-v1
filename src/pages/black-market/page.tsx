import { useState } from 'react';
import { useBlackMarket } from '../../hooks/useBlackMarket';

export default function BlackMarketPage() {
  const { items, myListings, loading, createListing, buyItem, cancelListing } = useBlackMarket();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'my-listings'>('buy');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newListing, setNewListing] = useState({
    itemType: 'artifact',
    itemName: '',
    priceMetal: 0,
    priceCrystal: 0,
    priceDeuterium: 0,
    priceDarkMatter: 0,
    quantity: 1,
    rarity: 'common',
    isAnonymous: true,
    durationHours: 24,
  });

  const rarityColors: Record<string, string> = {
    common: 'text-gray-400',
    uncommon: 'text-green-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-orange-400',
  };

  const filteredItems = items.filter(item => {
    if (selectedRarity !== 'all' && item.rarity !== selectedRarity) return false;
    if (selectedType !== 'all' && item.item_type !== selectedType) return false;
    return true;
  });

  const handleBuyItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to buy this item?')) return;

    const result = await buyItem(itemId);
    if (result.success) {
      alert('Item purchased successfully!');
    } else {
      alert('Failed to purchase item. Check your resources.');
    }
  };

  const handleCreateListing = async () => {
    if (!newListing.itemName) {
      alert('Please enter an item name');
      return;
    }

    const result = await createListing(
      newListing.itemType,
      newListing.itemName,
      {},
      newListing.priceMetal,
      newListing.priceCrystal,
      newListing.priceDeuterium,
      newListing.priceDarkMatter,
      newListing.quantity,
      newListing.rarity,
      newListing.isAnonymous,
      newListing.durationHours
    );

    if (result.success) {
      alert('Listing created successfully!');
      setShowCreateModal(false);
      setNewListing({
        itemType: 'artifact',
        itemName: '',
        priceMetal: 0,
        priceCrystal: 0,
        priceDeuterium: 0,
        priceDarkMatter: 0,
        quantity: 1,
        rarity: 'common',
        isAnonymous: true,
        durationHours: 24,
      });
    } else {
      alert('Failed to create listing');
    }
  };

  const handleCancelListing = async (itemId: string) => {
    if (!confirm('Are you sure you want to cancel this listing?')) return;

    const result = await cancelListing(itemId);
    if (result.success) {
      alert('Listing cancelled successfully!');
    } else {
      alert('Failed to cancel listing');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl">Loading Black Market...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Black Market</h1>
        <p className="text-gray-400">Trade rare items anonymously with other players</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('buy')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'buy'
              ? 'bg-red-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Buy Items
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'sell'
              ? 'bg-red-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Sell Items
        </button>
        <button
          onClick={() => setActiveTab('my-listings')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'my-listings'
              ? 'bg-red-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          My Listings ({myListings.length})
        </button>
      </div>

      {activeTab === 'buy' && (
        <>
          <div className="flex gap-4 mb-6">
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700"
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700"
            >
              <option value="all">All Types</option>
              <option value="artifact">Artifacts</option>
              <option value="ship">Ships</option>
              <option value="technology">Technologies</option>
              <option value="officer">Officers</option>
              <option value="blueprint">Blueprints</option>
              <option value="resource_pack">Resource Packs</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className={`text-xl font-bold ${rarityColors[item.rarity]}`}>
                      {item.item_name}
                    </h3>
                    <p className="text-gray-400 text-sm capitalize">{item.item_type.replace('_', ' ')}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${rarityColors[item.rarity]} bg-gray-900`}>
                    {item.rarity}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {item.price_metal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Metal:</span>
                      <span className="text-white font-semibold">{item.price_metal.toLocaleString()}</span>
                    </div>
                  )}
                  {item.price_crystal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Crystal:</span>
                      <span className="text-white font-semibold">{item.price_crystal.toLocaleString()}</span>
                    </div>
                  )}
                  {item.price_deuterium > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Deuterium:</span>
                      <span className="text-white font-semibold">{item.price_deuterium.toLocaleString()}</span>
                    </div>
                  )}
                  {item.price_dark_matter > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Dark Matter:</span>
                      <span className="text-purple-400 font-semibold">{item.price_dark_matter.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400 text-sm">Quantity: {item.quantity}</span>
                  <span className="text-gray-400 text-sm">
                    {item.is_anonymous ? 'Anonymous' : 'Public'}
                  </span>
                </div>

                <button
                  onClick={() => handleBuyItem(item.id)}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No items available</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'sell' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Listing</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Item Type</label>
                <select
                  value={newListing.itemType}
                  onChange={(e) => setNewListing({ ...newListing, itemType: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700"
                >
                  <option value="artifact">Artifact</option>
                  <option value="ship">Ship</option>
                  <option value="technology">Technology</option>
                  <option value="officer">Officer</option>
                  <option value="blueprint">Blueprint</option>
                  <option value="resource_pack">Resource Pack</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Item Name</label>
                <input
                  type="text"
                  value={newListing.itemName}
                  onChange={(e) => setNewListing({ ...newListing, itemName: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700"
                  placeholder="Enter item name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">Metal Price</label>
                  <input
                    type="number"
                    value={newListing.priceMetal}
                    onChange={(e) => setNewListing({ ...newListing, priceMetal: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Crystal Price</label>
                  <input
                    type="number"
                    value={newListing.priceCrystal}
                    onChange={(e) => setNewListing({ ...newListing, priceCrystal: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Deuterium Price</label>
                  <input
                    type="number"
                    value={newListing.priceDeuterium}
                    onChange={(e) => setNewListing({ ...newListing, priceDeuterium: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Dark Matter Price</label>
                  <input
                    type="number"
                    value={newListing.priceDarkMatter}
                    onChange={(e) => setNewListing({ ...newListing, priceDarkMatter: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">Rarity</label>
                  <select
                    value={newListing.rarity}
                    onChange={(e) => setNewListing({ ...newListing, rarity: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700"
                  >
                    <option value="common">Common</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={newListing.quantity}
                    onChange={(e) => setNewListing({ ...newListing, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Duration (hours)</label>
                <input
                  type="number"
                  value={newListing.durationHours}
                  onChange={(e) => setNewListing({ ...newListing, durationHours: parseInt(e.target.value) || 24 })}
                  className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700"
                  min="1"
                  max="168"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={newListing.isAnonymous}
                  onChange={(e) => setNewListing({ ...newListing, isAnonymous: e.target.checked })}
                  className="w-5 h-5 cursor-pointer"
                />
                <label className="text-gray-400">List anonymously</label>
              </div>

              <button
                onClick={handleCreateListing}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer"
              >
                Create Listing
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'my-listings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map((item) => (
            <div key={item.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`text-xl font-bold ${rarityColors[item.rarity]}`}>
                    {item.item_name}
                  </h3>
                  <p className="text-gray-400 text-sm capitalize">{item.item_type.replace('_', ' ')}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.sold_at ? 'bg-green-900 text-green-400' : 'bg-gray-900 text-gray-400'
                }`}>
                  {item.sold_at ? 'Sold' : 'Active'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {item.price_metal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Metal:</span>
                    <span className="text-white font-semibold">{item.price_metal.toLocaleString()}</span>
                  </div>
                )}
                {item.price_crystal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Crystal:</span>
                    <span className="text-white font-semibold">{item.price_crystal.toLocaleString()}</span>
                  </div>
                )}
                {item.price_deuterium > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Deuterium:</span>
                    <span className="text-white font-semibold">{item.price_deuterium.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {!item.sold_at && (
                <button
                  onClick={() => handleCancelListing(item.id)}
                  className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer"
                >
                  Cancel Listing
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
