import { useState, useEffect } from 'react';
import { useInsuranceSystem } from '../../hooks/useInsuranceSystem';
import PageLoading from '@/components/PageLoading';

function formatNum(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  const hrs = Math.floor(diff / 3600000);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  return 'just now';
}

function expiresIn(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.floor(diff / 86400000);
  const hrs = Math.floor(diff / 3600000);
  if (days > 0) return `${days}d left`;
  if (hrs > 0) return `${hrs}h left`;
  return 'expired';
}

export default function InsuranceBrokerPage() {
  const {
    policies,
    activePolicies,
    stats,
    loading,
    processingClaim,
    purchaseInsurance,
    fileClaim,
    cancelPolicy,
    getInsurableShips,
    refreshPolicies,
  } = useInsuranceSystem();

  const [activeTab, setActiveTab] = useState<'policies' | 'purchase' | 'claims'>('policies');
  const [policyFilter, setPolicyFilter] = useState<'all' | 'active' | 'expired' | 'claimed'>('all');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [insurableShips, setInsurableShips] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Purchase form state
  const [selectedShip, setSelectedShip] = useState('');
  const [coveragePercent, setCoveragePercent] = useState(75);
  const [durationDays, setDurationDays] = useState(14);
  const [purchaseCurrency, setPurchaseCurrency] = useState<'imperial_credits' | 'republic_credits'>('imperial_credits');

  // Load insurable ships when purchase tab selected
  useEffect(() => {
    if (activeTab === 'purchase') {
      getInsurableShips().then(setInsurableShips);
    }
  }, [activeTab, getInsurableShips]);

  // ── Derived ────────────────────────────────────────────
  const getSelectedShipData = () => insurableShips.find(s => s.ship_id === selectedShip);

  const getCalculatedPremium = () => {
    const ship = getSelectedShipData();
    if (!ship) return 0;
    const rate = (coveragePercent / 100) * (durationDays / 30) * 0.05;
    return Math.floor(ship.ship_value * rate);
  };

  const getCalculatedPayout = () => {
    const ship = getSelectedShipData();
    if (!ship) return 0;
    return Math.floor(ship.ship_value * coveragePercent / 100);
  };

  const filteredPolicies = policyFilter === 'all'
    ? policies
    : policies.filter(p => p.status === policyFilter);

  // ── Handlers ───────────────────────────────────────────
  const handlePurchase = async () => {
    const ship = getSelectedShipData();
    if (!ship) {
      setToastMessage({ text: 'Please select a ship', type: 'error' });
      return;
    }
    const premium = getCalculatedPremium();
    if (premium < 100) {
      setToastMessage({ text: 'Minimum premium is 100 credits', type: 'error' });
      return;
    }
    const result = await purchaseInsurance(
      ship.ship_id,
      ship.ship_name,
      ship.ship_type,
      ship.ship_value,
      coveragePercent,
      purchaseCurrency,
      durationDays,
    );
    setToastMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    if (result.success) {
      setShowPurchaseModal(false);
      setSelectedShip('');
    }
  };

  const handleFileClaim = async (policyId: string) => {
    setToastMessage(null);
    const result = await fileClaim(policyId);
    setToastMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    if (result.success) refreshPolicies();
  };

  const handleCancelPolicy = async (policyId: string) => {
    const result = await cancelPolicy(policyId);
    setToastMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    if (result.success) refreshPolicies();
  };

  if (loading) {
    return <PageLoading message="Loading Insurance Broker..." className="min-h-[60vh] text-emerald-400" spinnerSize="md" />;
  }

  return (
    <div className="text-white px-6 py-8 max-w-7xl mx-auto">
      {/* ── Toast ────────────────────────────────────────── */}
      {toastMessage && (
        <div
          className={`mb-4 px-5 py-3 rounded-lg flex items-center justify-between ${
            toastMessage.type === 'success' ? 'bg-green-500/20 border border-green-500/40 text-green-400' : 'bg-red-500/20 border border-red-500/40 text-red-400'
          }`}
        >
          <span className="text-sm font-semibold">{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="cursor-pointer hover:opacity-70">
            <i className="ri-close-line"></i>
          </button>
        </div>
      )}

      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <i className="ri-shield-check-line w-10 h-10 flex items-center justify-center text-emerald-400"></i>
            Insurance Broker
          </h1>
          <p className="text-white/60">Protect your fleet with comprehensive coverage policies</p>
        </div>
        <button
          onClick={() => {
            getInsurableShips().then(ships => {
              setInsurableShips(ships);
              setShowPurchaseModal(true);
            });
          }}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-900 rounded-lg font-bold hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <i className="ri-add-line w-5 h-5 flex items-center justify-center"></i>
          Purchase Policy
        </button>
      </div>

      {/* ── Stats Overview ────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/50 text-sm">Active Policies</span>
            <i className="ri-shield-check-line text-2xl text-emerald-400 w-7 h-7 flex items-center justify-center"></i>
          </div>
          <p className="text-3xl font-bold text-white">{stats.active_policies}</p>
          <p className="text-white/30 text-xs mt-1">of {stats.total_policies} total</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/50 text-sm">Premiums Paid</span>
            <i className="ri-money-dollar-circle-line text-2xl text-yellow-400 w-7 h-7 flex items-center justify-center"></i>
          </div>
          <p className="text-3xl font-bold text-white">{formatNum(stats.total_premiums_paid)}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/50 text-sm">Claims Filed</span>
            <i className="ri-file-list-3-line text-2xl text-cyan-400 w-7 h-7 flex items-center justify-center"></i>
          </div>
          <p className="text-3xl font-bold text-white">{stats.claims_filed}</p>
          <p className="text-white/30 text-xs mt-1">{stats.claims_approved} approved</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/50 text-sm">Payouts Received</span>
            <i className="ri-hand-coin-line text-2xl text-green-400 w-7 h-7 flex items-center justify-center"></i>
          </div>
          <p className="text-3xl font-bold text-white">{formatNum(stats.total_payouts_received)}</p>
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────────────── */}
      <div className="flex gap-2 mb-6 bg-white/5 backdrop-blur-md rounded-xl p-2 border border-white/10">
        {[
          { id: 'policies', label: 'My Policies', icon: 'ri-file-list-3-line' },
          { id: 'purchase', label: 'Insurable Fleet', icon: 'ri-rocket-line' },
          { id: 'claims', label: 'File a Claim', icon: 'ri-hand-coin-line' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 px-5 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-900'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className={`${tab.icon} w-5 h-5 flex items-center justify-center`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── My Policies Tab ───────────────────────────────── */}
      {activeTab === 'policies' && (
        <>
          {/* Filter */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {[
              { id: 'all', label: 'All', count: policies.length },
              { id: 'active', label: 'Active', count: activePolicies.length },
              { id: 'expired', label: 'Expired', count: policies.filter(p => p.status === 'expired').length },
              { id: 'claimed', label: 'Claimed', count: policies.filter(p => p.status === 'claimed').length },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setPolicyFilter(f.id as typeof policyFilter)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  policyFilter === f.id
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                    : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>

          {/* Policy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPolicies.map(policy => (
              <div
                key={policy.id}
                className={`bg-white/5 backdrop-blur-sm rounded-xl border p-6 transition-all ${
                  policy.status === 'active' ? 'border-emerald-500/20 hover:border-emerald-500/40' :
                  policy.status === 'claimed' ? 'border-yellow-500/20' :
                  'border-white/10 opacity-70'
                }`}
              >
                {/* Ship Name & Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white truncate">{policy.ship_name}</h3>
                    <p className="text-white/40 text-sm">{policy.ship_type}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ml-3 flex-shrink-0 ${
                    policy.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    policy.status === 'claimed' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    policy.status === 'expired' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-white/10 text-white/40 border border-white/20'
                  }`}>
                    {policy.status.toUpperCase()}
                  </span>
                </div>

                {/* Policy Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Ship Value</span>
                    <span className="text-white font-semibold">{formatNum(policy.ship_value)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Coverage</span>
                    <span className="text-emerald-400 font-semibold">{policy.coverage_percentage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Payout Value</span>
                    <span className="text-green-400 font-semibold">{formatNum(policy.payout_amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Premium Paid</span>
                    <span className="text-yellow-400 font-semibold">{formatNum(policy.premium_paid)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Duration</span>
                    <span className="text-white/60">{policy.duration_days} days</span>
                  </div>
                </div>

                {/* Coverage Bar */}
                <div className="w-full h-1.5 bg-white/5 rounded-full mb-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      policy.coverage_percentage >= 90 ? 'bg-gradient-to-r from-emerald-400 to-green-400' :
                      policy.coverage_percentage >= 70 ? 'bg-gradient-to-r from-yellow-400 to-emerald-400' :
                      'bg-gradient-to-r from-orange-400 to-yellow-400'
                    }`}
                    style={{ width: `${policy.coverage_percentage}%` }}
                  ></div>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-white/40 mb-4">
                  <span>Purchased {timeAgo(policy.created_at)}</span>
                  {policy.status === 'active' && (
                    <span className="text-emerald-400/60">{expiresIn(policy.expires_at)}</span>
                  )}
                </div>

                {/* Actions */}
                {policy.status === 'active' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFileClaim(policy.id)}
                      disabled={processingClaim}
                      className="flex-1 px-4 py-2.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg font-semibold hover:bg-emerald-500/30 transition-all whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="ri-hand-coin-line mr-1 w-4 h-4 inline-flex items-center justify-center"></i>
                      {processingClaim ? 'Processing...' : 'File Claim'}
                    </button>
                    <button
                      onClick={() => handleCancelPolicy(policy.id)}
                      className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400/70 rounded-lg font-semibold hover:bg-red-500/20 transition-all whitespace-nowrap cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {policy.status === 'claimed' && policy.claimed_at && (
                  <p className="text-xs text-yellow-400/60 text-center">
                    Claimed {timeAgo(policy.claimed_at)}
                  </p>
                )}
              </div>
            ))}

            {filteredPolicies.length === 0 && (
              <div className="col-span-full text-center py-16">
                <i className="ri-shield-check-line text-6xl text-white/10 mb-4 block"></i>
                <p className="text-white/30 text-lg">No policies found</p>
                <p className="text-white/20 text-sm mt-1">
                  {policyFilter === 'all' ? 'Purchase your first insurance policy to get started' : 'Try a different filter'}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Insurable Fleet Tab ───────────────────────────── */}
      {activeTab === 'purchase' && (
        <>
          {insurableShips.length === 0 ? (
            <div className="text-center py-16">
              <i className="ri-rocket-line text-6xl text-white/10 mb-4 block"></i>
              <p className="text-white/30 text-lg">No docked ships found</p>
              <p className="text-white/20 text-sm mt-1">Dock some ships at your shipyard to insure them</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {insurableShips.map(ship => (
                <div
                  key={ship.ship_id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-emerald-500/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{ship.ship_name}</h3>
                      <p className="text-white/40 text-sm capitalize">{ship.ship_type.replace(/_/g, ' ')}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <i className="ri-rocket-line text-xl text-emerald-400 w-6 h-6 flex items-center justify-center"></i>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Ship Value</span>
                      <span className="text-white font-semibold">{formatNum(ship.ship_value)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">75% Coverage</span>
                      <span className="text-emerald-400 font-semibold">{formatNum(Math.floor(ship.ship_value * 0.75))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Est. Premium</span>
                      <span className="text-yellow-400 font-semibold">{formatNum(Math.floor(ship.ship_value * 0.75 * 0.05))}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedShip(ship.ship_id);
                      setCoveragePercent(75);
                      setDurationDays(14);
                      setShowPurchaseModal(true);
                    }}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-900 rounded-lg font-bold hover:from-emerald-400 hover:to-teal-400 transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                  >
                    <i className="ri-shield-check-line w-5 h-5 flex items-center justify-center"></i>
                    Insure This Ship
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── File a Claim Tab ──────────────────────────────── */}
      {activeTab === 'claims' && (
        <>
          {activePolicies.length === 0 ? (
            <div className="text-center py-16">
              <i className="ri-hand-coin-line text-6xl text-white/10 mb-4 block"></i>
              <p className="text-white/30 text-lg">No active policies to claim against</p>
              <p className="text-white/20 text-sm mt-1">Purchase a policy first, then come back here to file claims</p>
            </div>
          ) : (
            <>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <i className="ri-information-line w-6 h-6 flex items-center justify-center text-cyan-400"></i>
                  How Claims Work
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">1</span>
                      <span className="text-white font-semibold">File a Claim</span>
                    </div>
                    <p className="text-white/40">Select an active policy and submit your claim. Our system processes it instantly.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">2</span>
                      <span className="text-white font-semibold">95% Approval Rate</span>
                    </div>
                    <p className="text-white/40">Most claims are approved automatically. Payouts are deposited directly to your account.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">3</span>
                      <span className="text-white font-semibold">Instant Payout</span>
                    </div>
                    <p className="text-white/40">Approved claims pay out immediately based on your coverage percentage.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {activePolicies.map(policy => (
                  <div
                    key={policy.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl border border-emerald-500/20 p-6 hover:border-emerald-500/40 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-white truncate">{policy.ship_name}</h3>
                        <p className="text-white/40 text-sm">{policy.ship_type}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 ml-3 flex-shrink-0">
                        ACTIVE
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">Coverage</span>
                        <span className="text-emerald-400 font-semibold">{policy.coverage_percentage}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">Payout Amount</span>
                        <span className="text-green-400 font-semibold">{formatNum(policy.payout_amount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">Expires</span>
                        <span className="text-white/60">{expiresIn(policy.expires_at)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleFileClaim(policy.id)}
                      disabled={processingClaim}
                      className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-900 rounded-lg font-bold hover:from-emerald-400 hover:to-teal-400 transition-all whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="ri-hand-coin-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>
                      {processingClaim ? 'Processing...' : `File Claim — ${formatNum(policy.payout_amount)}`}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* ── Purchase Modal ────────────────────────────────── */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-white/20 p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <i className="ri-shield-check-line w-7 h-7 flex items-center justify-center text-emerald-400"></i>
              Purchase Insurance
            </h2>

            <div className="space-y-5">
              {/* Ship Selection */}
              <div>
                <label className="block text-sm text-white/50 mb-2">Ship</label>
                <select
                  value={selectedShip}
                  onChange={e => setSelectedShip(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="">Select a ship...</option>
                  {insurableShips.map(s => (
                    <option key={s.ship_id} value={s.ship_id}>
                      {s.ship_name} ({s.ship_type}) — Value: {formatNum(s.ship_value)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Coverage */}
              <div>
                <label className="block text-sm text-white/50 mb-2">
                  Coverage: {coveragePercent}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={coveragePercent}
                  onChange={e => setCoveragePercent(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/30 mt-1">
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm text-white/50 mb-2">Duration</label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 7, 14, 30].map(days => (
                    <button
                      key={days}
                      onClick={() => setDurationDays(days)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                        durationDays === days
                          ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400'
                          : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm text-white/50 mb-2">Payment Currency</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPurchaseCurrency('imperial_credits')}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      purchaseCurrency === 'imperial_credits'
                        ? 'bg-yellow-500 text-gray-900'
                        : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <i className="ri-coins-line mr-1 w-4 h-4 inline-flex items-center justify-center"></i>
                    Imperial
                  </button>
                  <button
                    onClick={() => setPurchaseCurrency('republic_credits')}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      purchaseCurrency === 'republic_credits'
                        ? 'bg-green-500 text-gray-900'
                        : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <i className="ri-coin-line mr-1 w-4 h-4 inline-flex items-center justify-center"></i>
                    Republic
                  </button>
                </div>
              </div>

              {/* Summary */}
              {selectedShip && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Ship Value</span>
                    <span className="text-white font-semibold">{formatNum(getSelectedShipData()?.ship_value || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Coverage</span>
                    <span className="text-emerald-400 font-semibold">{coveragePercent}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Payout if Lost</span>
                    <span className="text-green-400 font-bold">{formatNum(getCalculatedPayout())}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between">
                    <span className="text-white/70 font-semibold">Premium</span>
                    <span className="text-yellow-400 font-bold text-lg">{formatNum(getCalculatedPremium())}</span>
                  </div>
                  <p className="text-white/30 text-xs">
                    Rate: {((coveragePercent / 100) * (durationDays / 30) * 0.05 * 100).toFixed(1)}% of ship value
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handlePurchase}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-900 rounded-lg font-bold hover:from-emerald-400 hover:to-teal-400 transition-all whitespace-nowrap cursor-pointer"
              >
                <i className="ri-shield-check-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>
                Purchase Policy
              </button>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="px-6 py-3 bg-white/5 text-white/50 rounded-lg font-semibold hover:bg-white/10 transition-all whitespace-nowrap cursor-pointer border border-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}