import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface AuctionListing {
  id: string;
  seller_id: string;
  seller_name: string;
  item_type: string;
  item_name: string;
  quantity: number;
  starting_bid: number;
  current_bid: number;
  buyout_price: number | null;
  highest_bidder: string | null;
  highest_bidder_name: string | null;
  ends_at: string;
  status: string;
  created_at: string;
}

export default function AuctionPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([] as AuctionListing[]);
  const [activeTab, setActiveTab] = useState('browse');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [bidAmount, setBidAmount] = useState({} as { [key: string]: number });

  // Create listing form
  const [newListing, setNewListing] = useState({
    itemType: 'resource',
    itemName: 'Metal',
    quantity: 1000,
    startingBid: 100,
    buyoutPrice: 500,
    duration: 24
  });

  useEffect(() => {
    loadListings();
  }, [activeTab]);

  const loadListings = async () => {
    setLoading(true);
    
    // Mock auction data
    const mockListings: AuctionListing[] = [
      {
        id: '1',
        seller_id: 'user1',
        seller_name: 'Commander_Alpha',
        item_type: 'resource',
        item_name: 'Crystal',
        quantity: 50000,
        starting_bid: 5000,
        current_bid: 7500,
        buyout_price: 15000,
        highest_bidder: 'user2',
        highest_bidder_name: 'StarLord_99',
        ends_at: new Date(Date.now() + 3600000).toISOString(),
        status: 'active',
        created_at: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: '2',
        seller_id: 'user3',
        seller_name: 'GalaxyDefender',
        item_type: 'ship',
        item_name: 'Battlecruiser',
        quantity: 10,
        starting_bid: 20000,
        current_bid: 25000,
        buyout_price: 40000,
        highest_bidder: 'user4',
        highest_bidder_name: 'NovaExplorer',
        ends_at: new Date(Date.now() + 7200000).toISOString(),
        status: 'active',
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '3',
        seller_id: 'user5',
        seller_name: 'CosmicTrader',
        item_type: 'resource',
        item_name: 'Deuterium',
        quantity: 25000,
        starting_bid: 3000,
        current_bid: 3000,
        buyout_price: 8000,
        highest_bidder: null,
        highest_bidder_name: null,
        ends_at: new Date(Date.now() + 10800000).toISOString(),
        status: 'active',
        created_at: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: '4',
        seller_id: 'user6',
        seller_name: 'TechMaster',
        item_type: 'blueprint',
        item_name: 'Plasma Technology',
        quantity: 1,
        starting_bid: 50000,
        current_bid: 65000,
        buyout_price: 100000,
        highest_bidder: 'user7',
        highest_bidder_name: 'WarCommander',
        ends_at: new Date(Date.now() + 14400000).toISOString(),
        status: 'active',
        created_at: new Date(Date.now() - 5400000).toISOString()
      }
    ];

    setListings(mockListings);
    setLoading(false);
  };

  const handlePlaceBid = async (listingId: string) => {
    const amount = bidAmount[listingId];
    if (!amount) return;

    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;

    if (amount <= listing.current_bid) {
      alert('Bid must be higher than current bid!');
      return;
    }

    // Update listing with new bid
    setListings(prev => prev.map(l => 
      l.id === listingId 
        ? { ...l, current_bid: amount, highest_bidder: user?.id || null, highest_bidder_name: 'You' }
        : l
    ));

    setBidAmount(prev => ({ ...prev, [listingId]: 0 }));
  };

  const handleBuyout = async (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing?.buyout_price) return;

    if (confirm(`Buy ${listing.item_name} x${listing.quantity} for ${listing.buyout_price.toLocaleString()} credits?`)) {
      setListings(prev => prev.filter(l => l.id !== listingId));
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const listing: AuctionListing = {
      id: Date.now().toString(),
      seller_id: user?.id || '',
      seller_name: 'You',
      item_type: newListing.itemType,
      item_name: newListing.itemName,
      quantity: newListing.quantity,
      starting_bid: newListing.startingBid,
      current_bid: newListing.startingBid,
      buyout_price: newListing.buyoutPrice,
      highest_bidder: null,
      highest_bidder_name: null,
      ends_at: new Date(Date.now() + newListing.duration * 3600000).toISOString(),
      status: 'active',
      created_at: new Date().toISOString()
    };

    setListings(prev => [listing, ...prev]);
    setShowCreateModal(false);
    setActiveTab('my-listings');
  };

  const getTimeRemaining = (endsAt: string) => {
    const diff = new Date(endsAt).getTime() - Date.now();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const getItemIcon = (itemType: string) => {
    switch (itemType) {
      case 'resource': return 'ri-database-2-line';
      case 'ship': return 'ri-rocket-line';
      case 'blueprint': return 'ri-file-list-3-line';
      default: return 'ri-box-3-line';
    }
  };

  const filteredListings = activeTab === 'my-listings' 
    ? listings.filter(l => l.seller_id === user?.id)
    : activeTab === 'my-bids'
    ? listings.filter(l => l.highest_bidder === user?.id)
    : listings;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <i className="ri-auction-line text-yellow-400"></i>
            Galactic Auction House
          </h1>
          <p className="text-slate-400">Bid on rare items and resources</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <i className="ri-add-line"></i>
          Create Listing
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'browse', label: 'Browse All', icon: 'ri-search-line' },
          { id: 'my-listings', label: 'My Listings', icon: 'ri-file-list-line' },
          { id: 'my-bids', label: 'My Bids', icon: 'ri-hand-coin-line' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <i className={tab.icon}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <i className="ri-loader-4-line animate-spin text-4xl text-purple-400"></i>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredListings.map(listing => (
            <div key={listing.id} className="bg-slate-800/80 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <i className={`${getItemIcon(listing.item_type)} text-2xl text-white`}></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{listing.item_name}</h3>
                    <p className="text-sm text-slate-400">Quantity: {listing.quantity.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Ends in</div>
                  <div className="text-sm font-bold text-yellow-400">{getTimeRemaining(listing.ends_at)}</div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Current Bid</div>
                    <div className="text-xl font-bold text-white">{listing.current_bid.toLocaleString()}</div>
                  </div>
                  {listing.buyout_price && (
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Buyout Price</div>
                      <div className="text-xl font-bold text-green-400">{listing.buyout_price.toLocaleString()}</div>
                    </div>
                  )}
                </div>
                {listing.highest_bidder_name && (
                  <div className="text-sm text-slate-400">
                    Highest bidder: <span className="text-purple-400 font-semibold">{listing.highest_bidder_name}</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-500 mb-4">
                Seller: {listing.seller_name}
              </div>

              {listing.seller_id !== user?.id && (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={bidAmount[listing.id] || ''}
                    onChange={(e) => setBidAmount(prev => ({ ...prev, [listing.id]: parseInt(e.target.value) || 0 }))}
                    placeholder="Enter bid amount"
                    className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    onClick={() => handlePlaceBid(listing.id)}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-hand-coin-line"></i>
                    Bid
                  </button>
                  {listing.buyout_price && (
                    <button
                      onClick={() => handleBuyout(listing.id)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-shopping-cart-line"></i>
                      Buyout
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Listing Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-purple-500/20 p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <i className="ri-add-circle-line text-yellow-400"></i>
              Create Auction Listing
            </h2>

            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Item Type</label>
                <select
                  value={newListing.itemType}
                  onChange={(e) => setNewListing(prev => ({ ...prev, itemType: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="resource">Resource</option>
                  <option value="ship">Ship</option>
                  <option value="blueprint">Blueprint</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Item Name</label>
                <input
                  type="text"
                  value={newListing.itemName}
                  onChange={(e) => setNewListing(prev => ({ ...prev, itemName: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Quantity</label>
                <input
                  type="number"
                  value={newListing.quantity}
                  onChange={(e) => setNewListing(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Starting Bid</label>
                <input
                  type="number"
                  value={newListing.startingBid}
                  onChange={(e) => setNewListing(prev => ({ ...prev, startingBid: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Buyout Price (Optional)</label>
                <input
                  type="number"
                  value={newListing.buyoutPrice}
                  onChange={(e) => setNewListing(prev => ({ ...prev, buyoutPrice: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Duration (hours)</label>
                <select
                  value={newListing.duration}
                  onChange={(e) => setNewListing(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value={12}>12 hours</option>
                  <option value={24}>24 hours</option>
                  <option value={48}>48 hours</option>
                  <option value={72}>72 hours</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer"
                >
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
