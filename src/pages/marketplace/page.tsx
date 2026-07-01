import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useResources } from '@/hooks/useResources';

interface Listing {
  id: number;
  seller_id: string;
  seller_name: string;
  resource_type: string;
  quantity: number;
  price_per_unit: number;
  total_price: number;
  currency: string;
  status: string;
  expires_at: string;
  created_at: string;
}

interface SellForm {
  resource_type: string;
  quantity: string;
  price_per_unit: string;
  duration: string;
}

const RESOURCE_OPTIONS = ['metal', 'crystal', 'deuterium', 'dark_matter', 'energy'];
const DURATION_HOURS: Record<string, number> = { '6 Hours': 6, '12 Hours': 12, '24 Hours': 24, '48 Hours': 48 };

const RESOURCE_COLORS: Record<string, string> = {
  metal: '#fbbf24', crystal: '#5bc0be', deuterium: '#34d399',
  dark_matter: '#c084fc', energy: '#fb923c',
};
const RESOURCE_ICONS: Record<string, string> = {
  metal: 'ri-copper-coin-line', crystal: 'ri-sparkling-line', deuterium: 'ri-drop-line',
  dark_matter: 'ri-space-ship-line', energy: 'ri-flashlight-line',
};

const GOLD = '#d4a853';
const BORDER_OGAME = '#1e2a36';
const CARD_BG = '#080b0f';

function formatTime(isoDate: string): string {
  const diff = new Date(isoDate).getTime() - Date.now();
  if (diff <= 0) return 'Expired';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function MarketplacePage() {
  const { user } = useAuth();
  const { resources, deductResources, addResources } = useResources();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'myListings'>('buy');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [listings, setListings] = useState<Listing[]>([]);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const [sellForm, setSellForm] = useState<SellForm>({
    resource_type: 'metal', quantity: '', price_per_unit: '', duration: '24 Hours',
  });

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const loadListings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(50);

      const all = (data || []) as Listing[];
      setListings(all.filter(l => l.seller_id !== user?.id));
      setMyListings(all.filter(l => l.seller_id === user?.id));
    } catch (err) {
      console.error('Error loading listings:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadListings(); }, [loadListings]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('marketplace-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketplace_listings' }, loadListings)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, loadListings]);

  const handleBuy = async (listing: Listing) => {
    if (!user) { navigate('/login'); return; }

    const price = listing.total_price;
    if ((resources.imperial_credits ?? 0) < price) {
      showToast('Insufficient credits to buy this listing!', false);
      return;
    }

    try {
      const { error } = await supabase
        .from('marketplace_listings')
        .update({ status: 'sold', buyer_id: user.id, completed_at: new Date().toISOString() })
        .eq('id', listing.id)
        .eq('status', 'active');

      if (error) throw error;

      await supabase
        .from('player_resources')
        .update({ imperial_credits: (resources.imperial_credits ?? 0) - price })
        .eq('player_id', user.id);

      const addAmount: Record<string, number> = {};
      addAmount[listing.resource_type] = listing.quantity;
      await addResources(addAmount as any);

      showToast(`Purchased ${listing.quantity.toLocaleString()} ${listing.resource_type}!`);
      loadListings();
    } catch (err: any) {
      showToast(err.message ?? 'Purchase failed', false);
    }
  };

  const handleCreateListing = async () => {
    if (!user) { navigate('/login'); return; }

    const qty = parseFloat(sellForm.quantity);
    const pricePerUnit = parseFloat(sellForm.price_per_unit);

    if (!qty || qty <= 0 || !pricePerUnit || pricePerUnit <= 0) {
      showToast('Please fill in valid quantity and price.', false);
      return;
    }

    const resKey = sellForm.resource_type as keyof typeof resources;
    if ((resources[resKey] ?? 0) < qty) {
      showToast(`Insufficient ${sellForm.resource_type} to list.`, false);
      return;
    }

    const totalPrice = qty * pricePerUnit;
    const hours = DURATION_HOURS[sellForm.duration] ?? 24;
    const expiresAt = new Date(Date.now() + hours * 3600 * 1000).toISOString();

    const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).maybeSingle();
    const sellerName = (profile as any)?.username ?? 'Commander';

    const deductAmt: Record<string, number> = {};
    deductAmt[sellForm.resource_type] = qty;
    await deductResources(deductAmt as any);

    const { error } = await supabase.from('marketplace_listings').insert({
      seller_id: user.id, seller_name: sellerName, resource_type: sellForm.resource_type,
      quantity: qty, price_per_unit: pricePerUnit, total_price: totalPrice,
      currency: 'imperial_credits', status: 'active', expires_at: expiresAt,
    });

    if (error) { showToast(error.message, false); return; }

    showToast(`Listed ${qty.toLocaleString()} ${sellForm.resource_type} for ${totalPrice.toLocaleString()} CR!`);
    setSellForm({ resource_type: 'metal', quantity: '', price_per_unit: '', duration: '24 Hours' });
    setActiveTab('myListings');
    loadListings();
  };

  const handleCancelListing = async (listingId: number) => {
    if (!user) return;
    const listing = myListings.find(l => l.id === listingId);
    if (!listing) return;

    await supabase.from('marketplace_listings').update({ status: 'cancelled' }).eq('id', listingId);

    const addAmt: Record<string, number> = {};
    addAmt[listing.resource_type] = listing.quantity;
    await addResources(addAmt as any);

    showToast(`Listing cancelled — ${listing.quantity.toLocaleString()} ${listing.resource_type} refunded.`);
    loadListings();
  };

  const filteredListings = selectedType === 'all' ? listings : listings.filter(l => l.resource_type === selectedType);

  const qty = parseFloat(sellForm.quantity) || 0;
  const ppu = parseFloat(sellForm.price_per_unit) || 0;
  const totalSell = qty * ppu;
  const fee = totalSell * 0.05;
  const receive = totalSell - fee;

  return (
    <div className="text-white">
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold max-w-sm transition-all"
          style={{
            background: CARD_BG,
            border: `1px solid ${toast.ok ? 'rgba(212,168,83,0.4)' : 'rgba(248,113,113,0.4)'}`,
            color: toast.ok ? GOLD : '#f87171',
          }}>
          <i className={`${toast.ok ? 'ri-check-line' : 'ri-close-circle-line'} mr-2`}></i>{toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="relative overflow-hidden" style={{ height: 180 }}>
        <img
          src="https://readdy.ai/api/search-image?query=futuristic%20galactic%20trading%20hub%20space%20station%20interior%20holographic%20market%20displays%20traders%20exchanging%20goods%20glowing%20signs%20sci-fi%20economy%20wide%20cinematic%20dramatic%20lighting%20amber%20atmosphere&width=1920&height=360&seq=marketplace_hero_v3&orientation=landscape"
          alt="Marketplace"
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ filter: 'brightness(0.45) saturate(1.3)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(7,10,16,0.95) 100%)' }} />
        <div className="relative z-10 h-full flex items-end px-6 pb-5">
          <div>
            <h1 className="text-4xl font-black mb-1" style={{ color: GOLD }}>Galactic Marketplace</h1>
            <p className="text-sm text-ogame-muted">Trade resources with other commanders</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Balance bar */}
        <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl mb-6"
          style={{ background: 'rgba(212,168,83,0.04)', border: `1px solid ${BORDER_OGAME}` }}>
          {[
            { label: 'Metal', val: resources.metal, color: '#fbbf24', icon: 'ri-copper-coin-line' },
            { label: 'Crystal', val: resources.crystal, color: '#5bc0be', icon: 'ri-sparkling-line' },
            { label: 'Deuterium', val: resources.deuterium, color: '#34d399', icon: 'ri-drop-line' },
            { label: 'Credits', val: resources.imperial_credits, color: '#c084fc', icon: 'ri-coin-line' },
          ].map(r => (
            <div key={r.label} className="flex items-center gap-2">
              <i className={`${r.icon} text-sm`} style={{ color: r.color }}></i>
              <span className="text-xs text-ogame-muted">{r.label}:</span>
              <span className="text-sm font-bold" style={{ color: r.color }}>{Math.floor(r.val ?? 0).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 rounded-xl p-1.5 mb-6" style={{ background: CARD_BG }}>
          {(['buy', 'sell', 'myListings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap cursor-pointer transition-all ${
                activeTab === tab ? 'text-black' : 'text-ogame-muted hover:text-white'
              }`}
              style={activeTab === tab ? { background: 'linear-gradient(90deg, #d4a853, #e2c044)' } : {}}
            >
              {tab === 'buy' && <><i className="ri-shopping-cart-line mr-2"></i>Buy</>}
              {tab === 'sell' && <><i className="ri-price-tag-3-line mr-2"></i>Sell</>}
              {tab === 'myListings' && <><i className="ri-list-check mr-2"></i>My Listings ({myListings.length})</>}
            </button>
          ))}
        </div>

        {/* BUY TAB */}
        {activeTab === 'buy' && (
          <>
            <div className="flex gap-2 mb-5 flex-wrap">
              {['all', ...RESOURCE_OPTIONS].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap cursor-pointer transition-all ${
                    selectedType === type ? 'text-white' : 'text-ogame-muted hover:text-white'
                  }`}
                  style={selectedType === type
                    ? { background: `${RESOURCE_COLORS[type] ?? GOLD}30`, border: `1px solid ${RESOURCE_COLORS[type] ?? GOLD}60` }
                    : { background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER_OGAME}` }
                  }
                >
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-12 text-amber-400 animate-pulse">Loading listings...</div>
            ) : filteredListings.length === 0 ? (
              <div className="text-center py-16 rounded-xl" style={{ border: `1px solid ${BORDER_OGAME}` }}>
                <i className="ri-store-line text-5xl text-ogame-dim mb-3 block"></i>
                <p className="text-ogame-muted">No active listings right now.</p>
                <p className="text-ogame-dim text-sm mt-1">Be the first to list something!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredListings.map(listing => {
                  const color = RESOURCE_COLORS[listing.resource_type] ?? GOLD;
                  const icon = RESOURCE_ICONS[listing.resource_type] ?? 'ri-box-3-line';
                  return (
                    <div key={listing.id} className="rounded-xl p-5 transition-all hover:scale-[1.01]"
                      style={{ background: CARD_BG, border: `1px solid ${color}25` }}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                          <i className={`${icon} text-xl`} style={{ color }}></i>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize" style={{ color, background: `${color}18` }}>
                          {listing.resource_type}
                        </span>
                      </div>
                      <p className="text-xs text-ogame-dim mb-1">Seller: <span className="text-ogame-muted">{listing.seller_name}</span></p>
                      <div className="space-y-1 mb-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-ogame-muted">Qty:</span>
                          <span className="text-white font-bold">{listing.quantity.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ogame-muted">Per unit:</span>
                          <span className="font-bold" style={{ color }}>{listing.price_per_unit.toLocaleString()} CR</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t" style={{ borderColor: '#1e2a36' }}>
                          <span className="text-ogame-muted font-semibold">Total:</span>
                          <span className="font-black text-lg" style={{ color }}>{listing.total_price.toLocaleString()} CR</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-ogame-dim">
                          <i className="ri-time-line mr-1"></i>Expires {formatTime(listing.expires_at)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleBuy(listing)}
                        className="w-full py-2.5 rounded-lg font-bold text-sm cursor-pointer whitespace-nowrap transition-all hover:opacity-90"
                        style={{ background: `linear-gradient(135deg, ${color}40, ${color}20)`, border: `1px solid ${color}50`, color }}
                      >
                        <i className="ri-shopping-cart-line mr-2"></i>Buy Now
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* SELL TAB */}
        {activeTab === 'sell' && (
          <div className="max-w-xl mx-auto rounded-xl p-6"
            style={{ background: CARD_BG, border: `1px solid ${BORDER_OGAME}` }}>
            <h2 className="text-lg font-bold text-white mb-5">Create New Listing</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-ogame-muted block mb-1.5">Resource Type</label>
                <select
                  value={sellForm.resource_type}
                  onChange={e => setSellForm(f => ({ ...f, resource_type: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER_OGAME}` }}
                >
                  {RESOURCE_OPTIONS.map(r => (
                    <option key={r} value={r} style={{ background: '#080b0f' }}>
                      {r.charAt(0).toUpperCase() + r.slice(1)} (Have: {Math.floor((resources as any)[r] ?? 0).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-ogame-muted block mb-1.5">Quantity</label>
                  <input type="number" min="1" placeholder="0" value={sellForm.quantity}
                    onChange={e => setSellForm(f => ({ ...f, quantity: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER_OGAME}` }} />
                </div>
                <div>
                  <label className="text-xs text-ogame-muted block mb-1.5">Price per Unit (CR)</label>
                  <input type="number" min="0.01" step="0.01" placeholder="0.00" value={sellForm.price_per_unit}
                    onChange={e => setSellForm(f => ({ ...f, price_per_unit: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER_OGAME}` }} />
                </div>
              </div>

              <div>
                <label className="text-xs text-ogame-muted block mb-1.5">Duration</label>
                <select
                  value={sellForm.duration}
                  onChange={e => setSellForm(f => ({ ...f, duration: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER_OGAME}` }}
                >
                  {Object.keys(DURATION_HOURS).map(d => (
                    <option key={d} value={d} style={{ background: '#080b0f' }}>{d}</option>
                  ))}
                </select>
              </div>

              {totalSell > 0 && (
                <div className="rounded-lg p-3 text-sm space-y-1" style={{ background: 'rgba(212,168,83,0.05)', border: `1px solid ${BORDER_OGAME}` }}>
                  <div className="flex justify-between text-ogame-muted">
                    <span>Total price:</span><span className="text-white font-semibold">{totalSell.toLocaleString()} CR</span>
                  </div>
                  <div className="flex justify-between text-ogame-muted">
                    <span>Listing fee (5%):</span><span className="text-red-400">{fee.toLocaleString()} CR</span>
                  </div>
                  <div className="flex justify-between border-t pt-1" style={{ borderColor: BORDER_OGAME }}>
                    <span className="text-ogame-muted font-semibold">You receive:</span>
                    <span className="text-amber-400 font-bold">{receive.toLocaleString()} CR</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleCreateListing}
                className="w-full py-3 rounded-lg font-bold text-sm cursor-pointer whitespace-nowrap transition-all hover:opacity-90 text-black"
                style={{ background: 'linear-gradient(90deg, #d4a853, #e2c044)' }}
              >
                <i className="ri-price-tag-3-line mr-2"></i>Create Listing
              </button>
            </div>
          </div>
        )}

        {/* MY LISTINGS TAB */}
        {activeTab === 'myListings' && (
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12 text-amber-400 animate-pulse">Loading...</div>
            ) : myListings.length === 0 ? (
              <div className="text-center py-16 rounded-xl" style={{ border: `1px solid ${BORDER_OGAME}` }}>
                <i className="ri-inbox-line text-5xl text-ogame-dim mb-3 block"></i>
                <p className="text-ogame-muted">No active listings</p>
                <button onClick={() => setActiveTab('sell')}
                  className="mt-4 px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap text-black"
                  style={{ background: 'linear-gradient(90deg, #d4a853, #e2c044)' }}>
                  Create Listing
                </button>
              </div>
            ) : (
              myListings.map(listing => {
                const color = RESOURCE_COLORS[listing.resource_type] ?? GOLD;
                const icon = RESOURCE_ICONS[listing.resource_type] ?? 'ri-box-3-line';
                return (
                  <div key={listing.id} className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ background: CARD_BG, border: `1px solid ${color}25` }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                      <i className={`${icon} text-xl`} style={{ color }}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white capitalize">{listing.resource_type}</span>
                        <span className="text-xs text-ogame-dim">× {listing.quantity.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-ogame-dim">
                        {listing.price_per_unit} CR/unit · Expires {formatTime(listing.expires_at)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-black" style={{ color }}>{listing.total_price.toLocaleString()} CR</p>
                    </div>
                    <button
                      onClick={() => handleCancelListing(listing.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
                      style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}
                    >
                      <i className="ri-close-line mr-1"></i>Cancel
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}