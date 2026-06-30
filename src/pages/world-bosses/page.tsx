import { useState } from 'react';
import { worldBosses } from '../../data/worldBosses';
import { arcBosses } from '../../data/arcBosses';


export default function WorldBossesPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [bossCategory, setBossCategory] = useState<'world' | 'arc'>('world');

  const filteredWorldBosses = worldBosses.filter(boss => {
    if (bossCategory !== 'world') return false;
    if (activeTab === 'active') return boss.status === 'active';
    if (activeTab === 'upcoming') return boss.status === 'upcoming';
    if (activeTab === 'defeated') return boss.status === 'defeated';
    return true;
  });

  const filteredArcBosses = arcBosses.filter(boss => {
    if (bossCategory !== 'arc') return false;
    if (activeTab === 'active') return boss.status === 'active';
    if (activeTab === 'upcoming') return boss.status === 'upcoming';
    if (activeTab === 'defeated') return boss.status === 'defeated';
    return true;
  });

  return (
    <div className="text-white">
      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://readdy.ai/api/search-image?query=epic%20space%20battle%20massive%20cosmic%20boss%20monsters%20attacking%20fleets%20explosions%20dramatic%20lighting%20world%20boss%20event%20scifi%20war%20scene&width=1920&height=500&seq=worldboss-hero-v2&orientation=landscape" alt="World Bosses" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <h1 className="text-6xl font-black uppercase text-white mb-4">World Boss Events</h1>
          <p className="text-xl text-gray-300">Unite with players across the galaxy to defeat legendary threats</p>
        </div>
      </div>

      {/* Boss Category Toggle */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setBossCategory('world'); setActiveTab('active'); }}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all cursor-pointer whitespace-nowrap ${
              bossCategory === 'world'
                ? 'bg-gradient-to-r from-[#d4a853] to-[#e2c044] text-[#080b0f] shadow-lg shadow-[#d4a853]/30'
                : 'bg-[#080b0f] border border-[#1e2a36] text-[#8892aa] hover:text-white'
            }`}
          >
            <i className="ri-sword-line mr-2"></i>
            World Bosses
            <span className="ml-2 text-xs opacity-70">({worldBosses.length})</span>
          </button>
          <button
            onClick={() => { setBossCategory('arc'); setActiveTab('active'); }}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all cursor-pointer whitespace-nowrap ${
              bossCategory === 'arc'
                ? 'bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white shadow-lg shadow-purple-500/30'
                : 'bg-[#080b0f] border border-[#1e2a36] text-[#8892aa] hover:text-white'
            }`}
          >
            <i className="ri-book-open-line mr-2"></i>
            Arc Bosses
            <span className="ml-2 text-xs opacity-70">({arcBosses.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-[#080b0f] border border-[#1e2a36] rounded-t-2xl">
          <div className="flex items-center space-x-1 px-6">
            {[
              { id: 'active', label: `Active (${bossCategory === 'world' ? worldBosses.filter(b => b.status === 'active').length : activeArcCount})`, icon: 'ri-sword-line' },
              { id: 'upcoming', label: `Upcoming (${bossCategory === 'world' ? worldBosses.filter(b => b.status === 'upcoming').length : arcBosses.filter(b => b.status === 'upcoming').length})`, icon: 'ri-time-line' },
              { id: 'defeated', label: `Defeated (${bossCategory === 'world' ? worldBosses.filter(b => b.status === 'defeated').length : defeatedArcCount})`, icon: 'ri-checkbox-circle-line' },
              ...(bossCategory === 'world' ? [
                { id: 'leaderboard', label: 'Leaderboard', icon: 'ri-trophy-line' }
              ] : [
                { id: 'leaderboard', label: 'Arc Leaderboard', icon: 'ri-trophy-line' }
              ]),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? bossCategory === 'world'
                      ? 'bg-[#080b0f] text-[#d4a853] border-t-2 border-[#d4a853]'
                      : 'bg-[#080b0f] text-[#a78bfa] border-t-2 border-[#a78bfa]'
                    : 'text-[#8892aa] hover:text-white'
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── ARC BOSSES VIEW ─── */}
        {bossCategory === 'arc' && activeTab !== 'leaderboard' && (
          <div className="bg-[#0F1F3A] border border-purple-400/30 border-t-0 rounded-b-2xl p-6">
            {/* Arc Selector */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {[1, 2, 3, 4, 5, 6].map(arcNum => {
                const arcBossesInArc = arcBosses.filter(a => a.arcNumber === arcNum);
                const allDefeated = arcBossesInArc.every(a => a.status === 'defeated');
                const hasActive = arcBossesInArc.some(a => a.status === 'active');
                const arcName = arcBossesInArc[0]?.arcName || `Arc ${arcNum}`;
                return (
                  <button
                    key={arcNum}
                    onClick={() => setSelectedArc(arcNum)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedArc === arcNum
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                        : allDefeated
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : hasActive
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-gray-800/50 text-gray-500 border border-gray-700/30'
                    }`}
                  >
                    <i className={`${allDefeated ? 'ri-check-double-line' : hasActive ? 'ri-fire-line' : 'ri-lock-line'} mr-1.5`}></i>
                    Arc {arcNum}: {arcName}
                  </button>
                );
              })}
            </div>

            {/* Arc Boss Cards */}
            {selectedArc === 0 && (
              <div className="text-center py-12">
                <i className="ri-book-open-line text-5xl text-purple-400 mb-4 block"></i>
                <p className="text-gray-400 text-lg mb-2">Select an Arc above to view its bosses</p>
                <p className="text-gray-500 text-sm">Each Arc tells a story across 3 chapters. Progress through them in order.</p>
              </div>
            )}

            {selectedArc > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {arcBosses
                  .filter(a => a.arcNumber === selectedArc)
                  .filter(boss => {
                    if (activeTab === 'active') return boss.status === 'active';
                    if (activeTab === 'upcoming') return boss.status === 'upcoming';
                    if (activeTab === 'defeated') return boss.status === 'defeated';
                    return true;
                  })
                  .map((boss) => (
                    <div
                      key={boss.id}
                      className={`rounded-xl overflow-hidden transition-all cursor-pointer group ${
                        boss.status === 'locked'
                          ? 'bg-gray-800/40 border border-gray-700/30 opacity-60 pointer-events-none'
                          : 'bg-[#080b0f] border border-[#1e2a36] hover:border-purple-400/50'
                      }`}
                      onClick={() => boss.status !== 'locked' && setSelectedBoss(boss)}
                    >
                      <div className="relative h-56 w-full overflow-hidden">
                        <img src={boss.image} alt={boss.name} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080b0f] via-transparent to-transparent"></div>
                        {boss.status === 'locked' && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="text-center">
                              <i className="ri-lock-fill text-4xl text-gray-500 mb-2 block"></i>
                              <span className="text-sm text-gray-400">Complete Arc {boss.prerequisiteArc} first</span>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-4 right-4 flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(boss.difficulty)}`}>
                            {boss.difficulty}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(boss.status)}`}>
                            {boss.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <div className="text-xs text-purple-400 mb-1" style={{ fontSize: 10 }}>{boss.chapter}</div>
                          <h3 className="text-xl font-black text-white mb-1">{boss.name}</h3>
                          <p className="text-sm text-purple-300">{boss.title}</p>
                        </div>
                      </div>
                      <div className="p-5 space-y-3">
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{boss.lore}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Arc Progress</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${boss.arcProgress}%` }}></div>
                            </div>
                            <span className="text-purple-400 font-bold">{boss.arcProgress}%</span>
                          </div>
                        </div>
                        {boss.status !== 'defeated' && boss.status !== 'locked' && (
                          <>
                            <div>
                              <div className="flex items-center justify-between text-xs mb-1.5">
                                <span className="text-gray-400">Health</span>
                                <span className="text-red-400 font-semibold">{formatNumber(boss.health)} / {formatNumber(boss.maxHealth)}</span>
                              </div>
                              <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full" style={{ width: `${(boss.health / boss.maxHealth) * 100}%` }}></div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Participants: <span className="text-white font-bold">{boss.participants.toLocaleString()}</span></span>
                              <span className="text-yellow-400 font-bold">{formatTime(boss.timeRemaining)}</span>
                            </div>
                          </>
                        )}
                        <div className="text-xs text-amber-400 font-bold">
                          <i className="ri-gift-line mr-1"></i>Arc Reward: {boss.rewards.arcReward}
                        </div>
                        <button
                          className={`w-full px-4 py-3 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                            boss.status === 'active'
                              ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-400 hover:to-purple-600'
                              : boss.status === 'upcoming'
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-green-600/30 text-green-400'
                          }`}
                        >
                          <i className={`${boss.status === 'active' ? 'ri-sword-line' : boss.status === 'upcoming' ? 'ri-notification-line' : 'ri-eye-line'} mr-2`}></i>
                          {boss.status === 'active' ? 'Join Arc Battle' : boss.status === 'upcoming' ? 'Set Reminder' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {selectedArc > 0 && filteredArcBosses.length === 0 && activeTab !== 'defeated' && (
              <div className="text-center py-12">
                <p className="text-gray-500">No {activeTab} arc bosses in this arc</p>
              </div>
            )}
          </div>
        )}

        {/* ─── WORLD BOSSES VIEW ─── */}
        {bossCategory === 'world' && activeTab !== 'leaderboard' && (
          <div className="bg-[#0F1F3A] border border-cyan-400/30 border-t-0 rounded-b-2xl p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredWorldBosses.map((boss) => (
                <div
                  key={boss.id}
                  className="bg-[#080b0f] border border-[#1e2a36] rounded-xl overflow-hidden hover:border-[#d4a853] transition-all cursor-pointer group"
                  onClick={() => setSelectedBoss(boss)}
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    <img src={boss.image} alt={boss.name} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080b0f] via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(boss.difficulty)}`}>
                        {boss.difficulty}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(boss.status)}`}>
                        {boss.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-2xl font-black text-white mb-1">{boss.name}</h3>
                      <p className="text-sm text-[#d4a853]">{boss.title}</p>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Tier / Level</p>
                        <p className="text-white font-semibold">Tier {boss.tier} • Lv.{boss.level}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Location</p>
                        <p className="text-[#d4a853] font-semibold text-xs">{boss.location}</p>
                      </div>
                    </div>

                    {boss.status !== 'defeated' && (
                      <>
                        <div>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-gray-400">Health</span>
                            <span className="text-red-400 font-semibold">{formatNumber(boss.health)} / {formatNumber(boss.maxHealth)}</span>
                          </div>
                          <div className="relative w-full h-3 bg-[#0F1F3A] rounded-full overflow-hidden">
                            <div
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 to-red-400 transition-all"
                              style={{ width: `${(boss.health / boss.maxHealth) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-gray-400">Shield</span>
                            <span className="text-blue-400 font-semibold">{formatNumber(boss.shield)} / {formatNumber(boss.maxShield)}</span>
                          </div>
                          <div className="relative w-full h-3 bg-[#0F1F3A] rounded-full overflow-hidden">
                            <div
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all"
                              style={{ width: `${(boss.shield / boss.maxShield) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Participants:</span>
                            <span className="text-white font-semibold">{boss.participants.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Time Left:</span>
                            <span className="text-yellow-400 font-semibold">{formatTime(boss.timeRemaining)}</span>
                          </div>
                        </div>
                      </>
                    )}

                    {boss.status === 'defeated' && boss.respawnTime && (
                      <div className="text-center py-4 bg-gray-800/50 rounded-lg">
                        <p className="text-gray-400 text-sm">Respawns in</p>
                        <p className="text-white font-bold text-lg">{boss.respawnTime}</p>
                      </div>
                    )}

                    <button className="w-full px-4 py-3 bg-gradient-to-r from-[#d4a853] to-[#e2c044] text-[#080b0f] font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer hover:from-amber-400 hover:to-amber-300">
                      <i className="ri-sword-line mr-2"></i>
                      {boss.status === 'active' ? 'Join Battle' : boss.status === 'upcoming' ? 'Set Reminder' : 'View Details'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {filteredWorldBosses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No {activeTab} world bosses</p>
              </div>
            )}
          </div>
        )}

        {/* ─── LEADERBOARD ─── */}
        {activeTab === 'leaderboard' && (
          <div className="bg-[#0F1F3A] border border-cyan-400/30 border-t-0 rounded-b-2xl p-6">
            <div className="space-y-3">
              {(bossCategory === 'world' ? leaderboardData : arcBossLeaderboard).map((entry, index) => (
                <div
                  key={index}
                  className={`bg-[#080b0f] border rounded-xl p-5 flex items-center justify-between ${
                    entry.player === 'You'
                      ? 'border-[#d4a853] bg-[#d4a853]/5'
                      : 'border-[#1e2a36]'
                  }`}
                >
                  <div className="flex items-center space-x-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl ${
                      entry.rank === 1 ? 'bg-yellow-400/20 text-yellow-400' :
                      entry.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                      entry.rank === 3 ? 'bg-orange-400/20 text-orange-400' :
                      'bg-cyan-400/20 text-cyan-400'
                    }`}>
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{entry.player}</h3>
                      <p className="text-sm text-gray-400">{entry.guild}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">{formatNumber(entry.damage)}</p>
                    <p className="text-xs text-gray-400">Damage Dealt</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-4 py-2 rounded-lg font-semibold ${
                      bossCategory === 'world' ? 'bg-purple-500/20 text-purple-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {entry.reward} Rewards
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}