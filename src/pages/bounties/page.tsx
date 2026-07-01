import { useState } from 'react';
import { useBountySystem } from '../../hooks/useBountySystem';
import PageLoading from '@/components/PageLoading';

function formatNum(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'just now';
}

function expiresIn(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.floor(diff / 86400000);
  const hrs = Math.floor(diff / 3600000);
  if (days > 0) return `${days}d left`;
  if (hrs > 0) return `${hrs}h left`;
  return 'expiring soon';
}

export default function BountyBoardPage() {
  const {
    bounties,
    myPlacedBounties,
    bountyTargets,
    leaderboard,
    bountyHunterRank,
    loading,
    placeBounty,
    claimBounty,
    cancelBounty,
    refreshBounties,
  } = useBountySystem();

  const [activeTab, setActiveTab] = useState<'active' | 'place' | 'my-bounties' | 'leaderboard'>('active');
  const [sortBy, setSortBy] = useState<'amount' | 'newest' | 'expiring'>('amount');
  const [filterCurrency, setFilterCurrency] = useState<'all' | 'imperial_credits' | 'republic_credits'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState('');
  const [bountyAmount, setBountyAmount] = useState(100000);
  const [bountyCurrency, setBountyCurrency] = useState<'imperial_credits' | 'republic_credits'>('imperial_credits');
  const [bountyReason, setBountyReason] = useState('');
  const [claimMessage, setClaimMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const rankColors: Record<string, string> = {
    'Novice Hunter': 'text-gray-400',
    'Skilled Hunter': 'text-green-400',
    'Veteran Bounty Hunter': 'text-cyan-400',
    'Expert Bounty Hunter': 'text-blue-400',
    'Master Bounty Hunter': 'text-purple-400',
    'Legendary Bounty Hunter': 'text-yellow-400',
  };

  const amountColors: Record<string, string> = {
    'imperial_credits': 'text-yellow-400',
    'republic_credits': 'text-green-400',
  };

  const amountIcons: Record<string, string> = {
    'imperial_credits': 'ri-coins-line',
    'republic_credits': 'ri-coin-line',
  };

  // ── Sorting and filtering ──────────────────────────────
  let filteredBounties = [...bounties];
  if (filterCurrency !== 'all') {
    filteredBounties = filteredBounties.filter(b => b.currency === filterCurrency);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredBounties = filteredBounties.filter(
      b => b.target_name.toLowerCase().includes(q) || b.placer_name.toLowerCase().includes(q) || b.reason.toLowerCase().includes(q)
    );
  }
  switch (sortBy) {
    case 'amount':
      filteredBounties.sort((a, b) => b.amount - a.amount);
      break;
    case 'newest':
      filteredBounties.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
    case 'expiring':
      filteredBounties.sort((a, b) => new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime());
      break;
  }

  // ── Handlers ───────────────────────────────────────────
  const handlePlaceBounty = async () => {
    const target = bountyTargets.find(t => t.id === selectedTarget);
    if (!target) {
      setClaimMessage({ text: 'Please select a target', type: 'error' });
      return;
    }
    if (bountyAmount < 10000) {
      setClaimMessage({ text: 'Minimum bounty is 10,000 credits', type: 'error' });
      return;
    }
    const result = await placeBounty(target.id, target.username, bountyAmount, bountyCurrency, bountyReason || 'Unspecified');
    setClaimMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    if (result.success) {
      setShowPlaceModal(false);
      setSelectedTarget('');
      setBountyAmount(100000);
      setBountyReason('');
    }
  };

  const handleClaimBounty = async (bountyId: string, targetId: string) => {
    const result = await claimBounty(bountyId, targetId);
    setClaimMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    if (result.success) refreshBounties();
  };

  const handleCancelBounty = async (bountyId: string) => {
    const result = await cancelBounty(bountyId);
    setClaimMessage({ text: result.message, type: result.success ? 'success' : 'error' });
  };

  if (loading) {
    return <PageLoading message="Loading Bounty Board..." className="min-h-[60vh] text-yellow-400" spinnerSize="md" />;
  }

  return (
    <div className="text-white px-6 py-8 max-w-7xl mx-auto">
      {/* ── Claim Message Toast ─────────────────────────── */}
      {claimMessage && (
        <div
          className={`mb-4 px-5 py-3 rounded-lg flex items-center justify-between ${
            claimMessage.type === 'success' ? 'bg-green-500/20 border border-green-500/40 text-green-400' : 'bg-red-500/20 border border-red-500/40 text-red-400'
          }`}
        >
          <span className="text-sm font-semibold">{claimMessage.text}</span>
          <button onClick={() => setClaimMessage(null)} className="cursor-pointer hover:opacity-70">
            <i className="ri-close-line"></i>
          </button>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <i className="ri-skull-line w-10 h-10 flex items-center justify-center text-yellow-400"></i>
            Bounty Board
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-white/60">Track down targets and collect rewards across the galaxy</p>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${rankColors[bountyHunterRank]} bg-white/5 border border-white/10`}>
              {bountyHunterRank}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowPlaceModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 rounded-lg font-bold hover:from-yellow-400 hover:to-orange-400 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <i className="ri-add-line w-5 h-5 flex items-center justify-center"></i>
          Place Bounty
        </button>
      </div>

      {/* ── Stats Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/50 text-sm">Active Bounties</span>
            <i className="ri-skull-line text-2xl text-yellow-400 w-7 h-7 flex items-center justify-center"></i>
          </div>
          <p className="text-3xl font-bold text-white">{bounties.length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/50 text-sm">Total Pool</span>
            <i className="ri-coins-line text-2xl text-yellow-400 w-7 h-7 flex items-center justify-center"></i>
          </div>
          <p className="text-3xl font-bold text-white">
            {formatNum(bounties.reduce((sum, b) => sum + b.amount, 0))}
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/50 text-sm">My Bounties</span>
            <i className="ri-user-search-line text-2xl text-cyan-400 w-7 h-7 flex items-center justify-center"></i>
          </div>
          <p className="text-3xl font-bold text-white">{myPlacedBounties.length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/50 text-sm">Notable Targets</span>
            <i className="ri-crosshair-line text-2xl text-red-400 w-7 h-7 flex items-center justify-center"></i>
          </div>
          <p className="text-3xl font-bold text-white">{bountyTargets.length}</p>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────── */}
      <div className="flex gap-2 mb-6 bg-white/5 backdrop-blur-md rounded-xl p-2 border border-white/10">
        {[
          { id: 'active', label: 'Active Bounties', icon: 'ri-skull-line' },
          { id: 'place', label: 'Target Directory', icon: 'ri-user-search-line' },
          { id: 'my-bounties', label: 'My Placed Bounties', icon: 'ri-file-list-3-line' },
          { id: 'leaderboard', label: 'Hunter Leaderboard', icon: 'ri-trophy-line' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 px-5 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#d4a853] to-[#e2c044] text-[#080b0f] font-bold'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className={`${tab.icon} w-5 h-5 flex items-center justify-center`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Active Bounties Tab ──────────────────────────── */}
      {activeTab === 'active' && (
        <>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <div className="relative flex-1 max-w-md">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4 flex items-center justify-center"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name or reason..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-yellow-500"
              />
            </div>

            <select
              value={filterCurrency}
              onChange={e => setFilterCurrency(e.target.value as typeof filterCurrency)}
              className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-500 cursor-pointer"
            >
              <option value="all">All Currencies</option>
              <option value="imperial_credits">Imperial Credits</option>
              <option value="republic_credits">Republic Credits</option>
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-500 cursor-pointer"
            >
              <option value="amount">Highest Reward</option>
              <option value="newest">Newest First</option>
              <option value="expiring">Expiring Soon</option>
            </select>
          </div>

          {/* Bounty Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBounties.map(bounty => (
              <div
                key={bounty.id}
                className="bg-[#080b0f] rounded-xl border border-[#1e2a36] p-6 hover:border-[#d4a853]/20 transition-all group"
              >
                {/* Target Name & Amount */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white truncate">{bounty.target_name}</h3>
                    <p className="text-white/40 text-sm mt-0.5">Placed by {bounty.placer_name}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 ml-3 flex-shrink-0`}>
                    <i className={`${amountIcons[bounty.currency]} ${amountColors[bounty.currency]} w-4 h-4 flex items-center justify-center`}></i>
                    <span className={`font-bold text-lg ${amountColors[bounty.currency]}`}>
                      {formatNum(bounty.amount)}
                    </span>
                  </div>
                </div>

                {/* Reason */}
                <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/5">
                  <p className="text-white/60 text-sm italic">"{bounty.reason}"</p>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-white/40 mb-4">
                  <span>
                    <i className="ri-time-line mr-1 w-3 h-3 inline-flex items-center justify-center"></i>
                    {timeAgo(bounty.created_at)}
                  </span>
                  <span className={new Date(bounty.expires_at).getTime() - Date.now() < 86400000 ? 'text-red-400' : ''}>
                    <i className="ri-timer-line mr-1 w-3 h-3 inline-flex items-center justify-center"></i>
                    {expiresIn(bounty.expires_at)}
                  </span>
                </div>

                {/* Claim Button */}
                <button
                  onClick={() => handleClaimBounty(bounty.id, bounty.target_id)}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-400 rounded-lg font-semibold hover:from-yellow-500/30 hover:to-orange-500/30 hover:border-yellow-500/50 transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                >
                  <i className="ri-crosshair-line w-5 h-5 flex items-center justify-center"></i>
                  Claim Bounty
                </button>
              </div>
            ))}

            {filteredBounties.length === 0 && (
              <div className="col-span-full text-center py-16">
                <i className="ri-skull-line text-6xl text-white/10 mb-4 block"></i>
                <p className="text-white/30 text-lg">No bounties match your filters</p>
                <p className="text-white/20 text-sm mt-1">Try adjusting your search or currency filter</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Target Directory Tab ─────────────────────────── */}
      {activeTab === 'place' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bountyTargets.map(target => (
            <div
              key={target.id}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-yellow-500/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{target.username}</h3>
                  <p className="text-white/40 text-sm">{target.alliance || 'Independent'}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/5 text-white/50 border border-white/10">
                  Lv {target.level}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Power</span>
                  <span className="text-white font-semibold">{formatNum(target.total_power)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Last Seen</span>
                  <span className="text-white/60">{timeAgo(target.last_seen || '')}</span>
                </div>
              </div>

              <div className="w-full h-1 bg-white/5 rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                  style={{ width: `${Math.min(100, (target.total_power / 5000000) * 100)}%` }}
                ></div>
              </div>

              <button
                onClick={() => {
                  setSelectedTarget(target.id);
                  setShowPlaceModal(true);
                }}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 rounded-lg font-bold hover:from-yellow-400 hover:to-orange-400 transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
              >
                <i className="ri-crosshair-2-line w-5 h-5 flex items-center justify-center"></i>
                Place Bounty
              </button>
            </div>
          ))}

          {bountyTargets.length === 0 && (
            <div className="col-span-full text-center py-16">
              <i className="ri-user-search-line text-6xl text-white/10 mb-4 block"></i>
              <p className="text-white/30 text-lg">No targets available</p>
              <p className="text-white/20 text-sm mt-1">Check back later for new targets</p>
            </div>
          )}
        </div>
      )}

      {/* ── My Placed Bounties Tab ───────────────────────── */}
      {activeTab === 'my-bounties' && (
        <>
          {myPlacedBounties.length === 0 ? (
            <div className="text-center py-16">
              <i className="ri-file-list-3-line text-6xl text-white/10 mb-4 block"></i>
              <p className="text-white/30 text-lg">You haven't placed any bounties yet</p>
              <p className="text-white/20 text-sm mt-1">Find a target and place your first bounty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myPlacedBounties.map(bounty => (
                <div
                  key={bounty.id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-white truncate">{bounty.target_name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-sm ${amountColors[bounty.currency]}`}>
                          {formatNum(bounty.amount)} credits
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          bounty.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          bounty.status === 'claimed' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {bounty.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-white/50 text-sm mb-4 italic">"{bounty.reason}"</p>

                  <div className="flex items-center justify-between text-xs text-white/40 mb-4">
                    <span>{timeAgo(bounty.created_at)}</span>
                    <span>{expiresIn(bounty.expires_at)}</span>
                  </div>

                  {bounty.status === 'active' && (
                    <button
                      onClick={() => handleCancelBounty(bounty.id)}
                      className="w-full px-4 py-2.5 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition-all whitespace-nowrap cursor-pointer"
                    >
                      Cancel Bounty (80% Refund)
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Leaderboard Tab ──────────────────────────────── */}
      {activeTab === 'leaderboard' && (
        <div className="bg-[#080b0f] rounded-xl border border-[#1e2a36] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <i className="ri-trophy-line w-6 h-6 flex items-center justify-center text-yellow-400"></i>
              Top Bounty Hunters
            </h3>
            <span className="text-white/30 text-sm">{leaderboard.length} hunters ranked</span>
          </div>

          <div className="divide-y divide-white/5">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.player_id}
                className="flex items-center px-6 py-4 hover:bg-white/5 transition-all"
              >
                {/* Rank */}
                <div className="w-10 flex-shrink-0">
                  {index < 3 ? (
                    <span className={`text-2xl font-black ${
                      index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : 'text-orange-400'
                    }`}>
                      #{index + 1}
                    </span>
                  ) : (
                    <span className="text-white/30 font-bold text-lg">#{index + 1}</span>
                  )}
                </div>

                {/* Name & Stats */}
                <div className="flex-1 ml-4">
                  <p className="text-white font-semibold">{entry.player_name}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-white/40">
                    <span>
                      <i className="ri-check-line mr-1 w-3 h-3 inline-flex items-center justify-center text-green-400"></i>
                      {entry.bounties_claimed} claims
                    </span>
                    <span>
                      <i className="ri-coins-line mr-1 w-3 h-3 inline-flex items-center justify-center text-yellow-400"></i>
                      {formatNum(entry.total_earned)} earned
                    </span>
                  </div>
                </div>

                {/* Earnings bar */}
                <div className="w-32 flex-shrink-0 hidden md:block">
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                      style={{
                        width: `${Math.min(100, (entry.total_earned / (leaderboard[0]?.total_earned || 1)) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}

            {leaderboard.length === 0 && (
              <div className="text-center py-16">
                <i className="ri-trophy-line text-6xl text-white/10 mb-4 block"></i>
                <p className="text-white/30 text-lg">No hunters ranked yet</p>
                <p className="text-white/20 text-sm mt-1">Start claiming bounties to appear on the board</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Place Bounty Modal ───────────────────────────── */}
      {showPlaceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-[#1e2a36] p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <i className="ri-crosshair-2-line w-7 h-7 flex items-center justify-center text-yellow-400"></i>
              Place Bounty
            </h2>

            <div className="space-y-5">
              {/* Target */}
              <div>
                <label className="block text-sm text-white/50 mb-2">Target</label>
                <select
                  value={selectedTarget}
                  onChange={e => setSelectedTarget(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 cursor-pointer"
                >
                  <option value="">Select a target...</option>
                  {bountyTargets.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.username} - Lv {t.level} ({formatNum(t.total_power)} power)
                    </option>
                  ))}
                </select>
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm text-white/50 mb-2">Currency</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setBountyCurrency('imperial_credits')}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      bountyCurrency === 'imperial_credits'
                        ? 'bg-yellow-500 text-gray-900'
                        : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <i className="ri-coins-line mr-1 w-4 h-4 inline-flex items-center justify-center"></i>
                    Imperial
                  </button>
                  <button
                    onClick={() => setBountyCurrency('republic_credits')}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      bountyCurrency === 'republic_credits'
                        ? 'bg-green-500 text-gray-900'
                        : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <i className="ri-coin-line mr-1 w-4 h-4 inline-flex items-center justify-center"></i>
                    Republic
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm text-white/50 mb-2">Reward Amount</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {[50000, 100000, 250000, 500000, 1000000, 5000000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setBountyAmount(amt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                        bountyAmount === amt
                          ? 'bg-yellow-500/20 border border-yellow-500 text-yellow-400'
                          : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {formatNum(amt)}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={bountyAmount}
                  onChange={e => setBountyAmount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 text-sm"
                  min="10000"
                  step="10000"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm text-white/50 mb-2">Reason (optional)</label>
                <input
                  type="text"
                  value={bountyReason}
                  onChange={e => setBountyReason(e.target.value)}
                  placeholder="e.g., Attacked imperial trade routes..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-yellow-500"
                  maxLength={200}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handlePlaceBounty}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 rounded-lg font-bold hover:from-yellow-400 hover:to-orange-400 transition-all whitespace-nowrap cursor-pointer"
              >
                <i className="ri-skull-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>
                Place Bounty
              </button>
              <button
                onClick={() => setShowPlaceModal(false)}
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