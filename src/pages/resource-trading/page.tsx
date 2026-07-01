import { useState } from 'react';
import { useResourceTrading } from '../../hooks/useResourceTrading';
import { useAuth } from '../../contexts/AuthContext';
import PageLoading from '@/components/PageLoading';

export default function ResourceTradingPage() {
  const { user } = useAuth();
  const {
    myOffers,
    marketOffers,
    tradeHistory,
    marketPrices,
    tradableResources,
    loading,
    createOffer,
    buyOffer,
    cancelOffer,
  } = useResourceTrading(user?.id || '');

  const [activeTab, setActiveTab] = useState<'market' | 'my-offers' | 'history' | 'prices'>('market');
  const [selectedResource, setSelectedResource] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  // Create offer form
  const [newOffer, setNewOffer] = useState({
    resourceType: 'metal',
    amount: 1000,
    pricePerUnit: 10,
    currency: 'credits' as 'credits' | 'dark_matter' | 'exotic_matter',
    duration: 24
  });

  const handleCreateOffer = async () => {
    const result = await createOffer(
      newOffer.resourceType,
      newOffer.amount,
      newOffer.pricePerUnit,
      newOffer.currency,
      newOffer.duration
    );

    if (result.success) {
      setShowCreateModal(false);
      setNewOffer({
        resourceType: 'metal',
        amount: 1000,
        pricePerUnit: 10,
        currency: 'credits',
        duration: 24
      });
    } else {
      alert(result.error);
    }
  };

  const handleBuyOffer = async () => {
    if (!selectedOffer) return;

    const result = await buyOffer(selectedOffer.id);
    if (result.success) {
      setShowBuyModal(false);
      setSelectedOffer(null);
    } else {
      alert(result.error);
    }
  };

  const handleCancelOffer = async (offerId: string) => {
    if (confirm('Are you sure you want to cancel this offer?')) {
      await cancelOffer(offerId);
    }
  };

  const filteredMarketOffers = selectedResource === 'all' 
    ? marketOffers 
    : marketOffers.filter(o => o.resourceType === selectedResource);

  const formatResourceName = (resource: string) => {
    return resource.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'credits': return '💰';
      case 'dark_matter': return '🌑';
      case 'exotic_matter': return '✨';
      default: return '💰';
    }
  };

  if (loading) {
    return <PageLoading message="Loading Resource Trading Market..." className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Resource Trading Market</h1>
          <p className="text-purple-200">Buy and sell resources with other players</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('market')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'market'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <i className="ri-store-2-line mr-2"></i>
            Market ({filteredMarketOffers.length})
          </button>
          <button
            onClick={() => setActiveTab('my-offers')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'my-offers'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <i className="ri-file-list-3-line mr-2"></i>
            My Offers ({myOffers.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <i className="ri-history-line mr-2"></i>
            History ({tradeHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('prices')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'prices'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <i className="ri-line-chart-line mr-2"></i>
            Market Prices ({marketPrices.length})
          </button>
        </div>

        {/* Create Offer Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all whitespace-nowrap"
          >
            <i className="ri-add-line mr-2"></i>
            Create New Offer
          </button>
        </div>

        {/* Resource Filter */}
        {activeTab === 'market' && (
          <div className="mb-6">
            <select
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700"
            >
              <option value="all">All Resources</option>
              {tradableResources.map(resource => (
                <option key={resource} value={resource}>
                  {formatResourceName(resource)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Market Tab */}
        {activeTab === 'market' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMarketOffers.map(offer => (
              <div key={offer.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {formatResourceName(offer.resourceType)}
                    </h3>
                    <p className="text-sm text-slate-400">by {offer.sellerName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-400">
                      {offer.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">units</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Price per unit:</span>
                    <span className="text-white font-semibold">
                      {getCurrencyIcon(offer.currency)} {offer.pricePerUnit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total price:</span>
                    <span className="text-yellow-400 font-bold">
                      {getCurrencyIcon(offer.currency)} {offer.totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expires:</span>
                    <span className="text-slate-300">
                      {new Date(offer.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedOffer(offer);
                    setShowBuyModal(true);
                  }}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all whitespace-nowrap"
                >
                  <i className="ri-shopping-cart-line mr-2"></i>
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        )}

        {/* My Offers Tab */}
        {activeTab === 'my-offers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myOffers.map(offer => (
              <div key={offer.id} className="bg-slate-800 rounded-lg p-6 border border-purple-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {formatResourceName(offer.resourceType)}
                    </h3>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                      Active
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-400">
                      {offer.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">units</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Price per unit:</span>
                    <span className="text-white font-semibold">
                      {getCurrencyIcon(offer.currency)} {offer.pricePerUnit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total value:</span>
                    <span className="text-yellow-400 font-bold">
                      {getCurrencyIcon(offer.currency)} {offer.totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expires:</span>
                    <span className="text-slate-300">
                      {new Date(offer.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleCancelOffer(offer.id)}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all whitespace-nowrap"
                >
                  <i className="ri-close-line mr-2"></i>
                  Cancel Offer
                </button>
              </div>
            ))}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-6 py-3 text-left text-white">Date</th>
                  <th className="px-6 py-3 text-left text-white">Resource</th>
                  <th className="px-6 py-3 text-left text-white">Amount</th>
                  <th className="px-6 py-3 text-left text-white">Price</th>
                  <th className="px-6 py-3 text-left text-white">Type</th>
                </tr>
              </thead>
              <tbody>
                {tradeHistory.map(trade => (
                  <tr key={trade.id} className="border-t border-slate-700">
                    <td className="px-6 py-4 text-slate-300">
                      {new Date(trade.completedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-white font-semibold">
                      {formatResourceName(trade.resourceType)}
                    </td>
                    <td className="px-6 py-4 text-cyan-400">
                      {trade.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-yellow-400">
                      {getCurrencyIcon(trade.currency)} {trade.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        trade.buyerId === user?.id
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {trade.buyerId === user?.id ? 'Bought' : 'Sold'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Market Prices Tab */}
        {activeTab === 'prices' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketPrices.map(price => (
              <div key={price.resourceType} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">
                  {formatResourceName(price.resourceType)}
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Average:</span>
                    <span className="text-white font-semibold">
                      💰 {price.averagePrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lowest:</span>
                    <span className="text-green-400 font-semibold">
                      💰 {price.lowestPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Highest:</span>
                    <span className="text-red-400 font-semibold">
                      💰 {price.highestPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">24h Volume:</span>
                    <span className="text-cyan-400 font-semibold">
                      {price.volume24h.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">24h Change:</span>
                    <span className={`font-bold ${
                      price.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {price.priceChange24h >= 0 ? '+' : ''}{price.priceChange24h}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Offer Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-white mb-6">Create Trade Offer</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 mb-2">Resource</label>
                  <select
                    value={newOffer.resourceType}
                    onChange={(e) => setNewOffer({...newOffer, resourceType: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg border border-slate-700"
                  >
                    {tradableResources.map(resource => (
                      <option key={resource} value={resource}>
                        {formatResourceName(resource)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-2">Amount</label>
                  <input
                    type="number"
                    value={newOffer.amount}
                    onChange={(e) => setNewOffer({...newOffer, amount: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg border border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2">Price per Unit</label>
                  <input
                    type="number"
                    value={newOffer.pricePerUnit}
                    onChange={(e) => setNewOffer({...newOffer, pricePerUnit: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg border border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2">Currency</label>
                  <select
                    value={newOffer.currency}
                    onChange={(e) => setNewOffer({...newOffer, currency: e.target.value as any})}
                    className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg border border-slate-700"
                  >
                    <option value="credits">💰 Credits</option>
                    <option value="dark_matter">🌑 Dark Matter</option>
                    <option value="exotic_matter">✨ Exotic Matter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-2">Duration (hours)</label>
                  <input
                    type="number"
                    value={newOffer.duration}
                    onChange={(e) => setNewOffer({...newOffer, duration: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg border border-slate-700"
                  />
                </div>

                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="flex justify-between text-white">
                    <span>Total Value:</span>
                    <span className="font-bold text-yellow-400">
                      {getCurrencyIcon(newOffer.currency)} {(newOffer.amount * newOffer.pricePerUnit).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateOffer}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all whitespace-nowrap"
                >
                  Create Offer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Buy Confirmation Modal */}
        {showBuyModal && selectedOffer && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-white mb-6">Confirm Purchase</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-400">Resource:</span>
                  <span className="text-white font-semibold">
                    {formatResourceName(selectedOffer.resourceType)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount:</span>
                  <span className="text-cyan-400 font-bold">
                    {selectedOffer.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Price:</span>
                  <span className="text-yellow-400 font-bold">
                    {getCurrencyIcon(selectedOffer.currency)} {selectedOffer.totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Seller:</span>
                  <span className="text-white">{selectedOffer.sellerName}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowBuyModal(false);
                    setSelectedOffer(null);
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuyOffer}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all whitespace-nowrap"
                >
                  Confirm Purchase
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
