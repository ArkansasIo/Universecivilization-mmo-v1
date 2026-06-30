import { useState } from 'react';
import { Link } from 'react-router-dom';

interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  allianceTag?: string;
  score: number;
  change: number;
  avatar?: string;
}

interface LeaderboardCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export default function LeaderboardPage() {
  const [activeCategory, setActiveCategory] = useState('overall');
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly' | 'alltime'>('alltime');

  const categories: LeaderboardCategory[] = [
    { id: 'overall', name: 'Overall Power', icon: 'ri-trophy-line', description: 'Total empire power ranking' },
    { id: 'fleet', name: 'Fleet Power', icon: 'ri-rocket-line', description: 'Military fleet strength' },
    { id: 'economy', name: 'Economy', icon: 'ri-coins-line', description: 'Resource production and wealth' },
    { id: 'research', name: 'Research', icon: 'ri-flask-line', description: 'Technology advancement level' },
    { id: 'battles', name: 'Battles Won', icon: 'ri-sword-line', description: 'Combat victories' },
    { id: 'alliance', name: 'Alliance Power', icon: 'ri-team-line', description: 'Top alliances by combined power' }
  ];

  const leaderboards: Record<string, LeaderboardEntry[]> = {
    overall: [
      { rank: 1, playerId: 'p1', playerName: 'DarkLord', allianceTag: '[DL]', score: 245000000, change: 0 },
      { rank: 2, playerId: 'p2', playerName: 'StarCommander', allianceTag: '[GF]', score: 198000000, change: 1 },
      { rank: 3, playerId: 'p3', playerName: 'NebulaKing', allianceTag: '[SE]', score: 175000000, change: -1 },
      { rank: 4, playerId: 'p4', playerName: 'VoidHunter', allianceTag: '[VH]', score: 156000000, change: 2 },
      { rank: 5, playerId: 'p5', playerName: 'CosmicEmperor', allianceTag: '[GF]', score: 142000000, change: 0 },
      { rank: 6, playerId: 'p6', playerName: 'GalacticWarrior', allianceTag: '[DL]', score: 128000000, change: -2 },
      { rank: 7, playerId: 'p7', playerName: 'StellarMaster', allianceTag: '[NC]', score: 115000000, change: 3 },
      { rank: 8, playerId: 'p8', playerName: 'QuantumRaider', allianceTag: '[SE]', score: 98000000, change: 1 },
      { rank: 9, playerId: 'p9', playerName: 'NovaDestroyer', allianceTag: '[VH]', score: 87000000, change: -1 },
      { rank: 10, playerId: 'p10', playerName: 'EclipseWarrior', allianceTag: '[GF]', score: 76000000, change: 0 },
      { rank: 42, playerId: 'you', playerName: 'You', allianceTag: '[GF]', score: 8750000, change: 5 }
    ],
    fleet: [
      { rank: 1, playerId: 'p1', playerName: 'DarkLord', allianceTag: '[DL]', score: 125000000, change: 0 },
      { rank: 2, playerId: 'p4', playerName: 'VoidHunter', allianceTag: '[VH]', score: 98000000, change: 2 },
      { rank: 3, playerId: 'p2', playerName: 'StarCommander', allianceTag: '[GF]', score: 87000000, change: -1 },
      { rank: 4, playerId: 'p6', playerName: 'GalacticWarrior', allianceTag: '[DL]', score: 76000000, change: 1 },
      { rank: 5, playerId: 'p8', playerName: 'QuantumRaider', allianceTag: '[SE]', score: 65000000, change: -2 },
      { rank: 6, playerId: 'p9', playerName: 'NovaDestroyer', allianceTag: '[VH]', score: 54000000, change: 3 },
      { rank: 7, playerId: 'p3', playerName: 'NebulaKing', allianceTag: '[SE]', score: 48000000, change: 0 },
      { rank: 8, playerId: 'p10', playerName: 'EclipseWarrior', allianceTag: '[GF]', score: 42000000, change: 1 },
      { rank: 9, playerId: 'p5', playerName: 'CosmicEmperor', allianceTag: '[GF]', score: 38000000, change: -1 },
      { rank: 10, playerId: 'p7', playerName: 'StellarMaster', allianceTag: '[NC]', score: 32000000, change: 0 },
      { rank: 38, playerId: 'you', playerName: 'You', allianceTag: '[GF]', score: 8750000, change: 8 }
    ],
    economy: [
      { rank: 1, playerId: 'p5', playerName: 'CosmicEmperor', allianceTag: '[GF]', score: 98000000, change: 1 },
      { rank: 2, playerId: 'p3', playerName: 'NebulaKing', allianceTag: '[SE]', score: 87000000, change: -1 },
      { rank: 3, playerId: 'p2', playerName: 'StarCommander', allianceTag: '[GF]', score: 76000000, change: 0 },
      { rank: 4, playerId: 'p7', playerName: 'StellarMaster', allianceTag: '[NC]', score: 65000000, change: 2 },
      { rank: 5, playerId: 'p1', playerName: 'DarkLord', allianceTag: '[DL]', score: 54000000, change: -1 },
      { rank: 6, playerId: 'p4', playerName: 'VoidHunter', allianceTag: '[VH]', score: 48000000, change: 1 },
      { rank: 7, playerId: 'p8', playerName: 'QuantumRaider', allianceTag: '[SE]', score: 42000000, change: -2 },
      { rank: 8, playerId: 'p6', playerName: 'GalacticWarrior', allianceTag: '[DL]', score: 38000000, change: 0 },
      { rank: 9, playerId: 'p10', playerName: 'EclipseWarrior', allianceTag: '[GF]', score: 32000000, change: 1 },
      { rank: 10, playerId: 'p9', playerName: 'NovaDestroyer', allianceTag: '[VH]', score: 28000000, change: -1 },
      { rank: 52, playerId: 'you', playerName: 'You', allianceTag: '[GF]', score: 6200000, change: 3 }
    ],
    research: [
      { rank: 1, playerId: 'p2', playerName: 'StarCommander', allianceTag: '[GF]', score: 87000000, change: 0 },
      { rank: 2, playerId: 'p5', playerName: 'CosmicEmperor', allianceTag: '[GF]', score: 76000000, change: 1 },
      { rank: 3, playerId: 'p3', playerName: 'NebulaKing', allianceTag: '[SE]', score: 65000000, change: -1 },
      { rank: 4, playerId: 'p7', playerName: 'StellarMaster', allianceTag: '[NC]', score: 54000000, change: 2 },
      { rank: 5, playerId: 'p1', playerName: 'DarkLord', allianceTag: '[DL]', score: 48000000, change: 0 },
      { rank: 6, playerId: 'p8', playerName: 'QuantumRaider', allianceTag: '[SE]', score: 42000000, change: -2 },
      { rank: 7, playerId: 'p4', playerName: 'VoidHunter', allianceTag: '[VH]', score: 38000000, change: 1 },
      { rank: 8, playerId: 'p10', playerName: 'EclipseWarrior', allianceTag: '[GF]', score: 32000000, change: 0 },
      { rank: 9, playerId: 'p6', playerName: 'GalacticWarrior', allianceTag: '[DL]', score: 28000000, change: 1 },
      { rank: 10, playerId: 'p9', playerName: 'NovaDestroyer', allianceTag: '[VH]', score: 24000000, change: -1 },
      { rank: 28, playerId: 'you', playerName: 'You', allianceTag: '[GF]', score: 45000000, change: 12 }
    ],
    battles: [
      { rank: 1, playerId: 'p1', playerName: 'DarkLord', allianceTag: '[DL]', score: 8450, change: 0 },
      { rank: 2, playerId: 'p4', playerName: 'VoidHunter', allianceTag: '[VH]', score: 7280, change: 1 },
      { rank: 3, playerId: 'p6', playerName: 'GalacticWarrior', allianceTag: '[DL]', score: 6890, change: -1 },
      { rank: 4, playerId: 'p9', playerName: 'NovaDestroyer', allianceTag: '[VH]', score: 5670, change: 2 },
      { rank: 5, playerId: 'p8', playerName: 'QuantumRaider', allianceTag: '[SE]', score: 4920, change: 0 },
      { rank: 6, playerId: 'p2', playerName: 'StarCommander', allianceTag: '[GF]', score: 4350, change: -2 },
      { rank: 7, playerId: 'p10', playerName: 'EclipseWarrior', allianceTag: '[GF]', score: 3780, change: 1 },
      { rank: 8, playerId: 'p3', playerName: 'NebulaKing', allianceTag: '[SE]', score: 3240, change: 1 },
      { rank: 9, playerId: 'p5', playerName: 'CosmicEmperor', allianceTag: '[GF]', score: 2890, change: -2 },
      { rank: 10, playerId: 'p7', playerName: 'StellarMaster', allianceTag: '[NC]', score: 2450, change: 0 },
      { rank: 156, playerId: 'you', playerName: 'You', allianceTag: '[GF]', score: 1247, change: 18 }
    ],
    alliance: [
      { rank: 1, playerId: 'a1', playerName: 'Galactic Federation', allianceTag: '[GF]', score: 1250000000, change: 0 },
      { rank: 2, playerId: 'a2', playerName: 'Dark Legion', allianceTag: '[DL]', score: 1145000000, change: 1 },
      { rank: 3, playerId: 'a3', playerName: 'Stellar Empire', allianceTag: '[SE]', score: 980000000, change: -1 },
      { rank: 4, playerId: 'a4', playerName: 'Void Hunters', allianceTag: '[VH]', score: 720000000, change: 0 },
      { rank: 5, playerId: 'a5', playerName: 'Nova Collective', allianceTag: '[NC]', score: 580000000, change: 2 },
      { rank: 6, playerId: 'a6', playerName: 'Cosmic Raiders', allianceTag: '[CR]', score: 450000000, change: -1 },
      { rank: 7, playerId: 'a7', playerName: 'Quantum Alliance', allianceTag: '[QA]', score: 380000000, change: 1 },
      { rank: 8, playerId: 'a8', playerName: 'Eclipse Warriors', allianceTag: '[EW]', score: 320000000, change: -2 },
      { rank: 9, playerId: 'a9', playerName: 'Nebula Knights', allianceTag: '[NK]', score: 280000000, change: 0 },
      { rank: 10, playerId: 'a10', playerName: 'Star Guardians', allianceTag: '[SG]', score: 240000000, change: 1 }
    ]
  };

  const formatScore = (score: number, category: string) => {
    if (category === 'battles') {
      return score.toLocaleString();
    }
    if (score >= 1000000000) {
      return `${(score / 1000000000).toFixed(2)}B`;
    }
    if (score >= 1000000) {
      return `${(score / 1000000).toFixed(2)}M`;
    }
    if (score >= 1000) {
      return `${(score / 1000).toFixed(2)}K`;
    }
    return score.toString();
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-amber-500 to-yellow-600';
    if (rank === 2) return 'from-gray-400 to-gray-500';
    if (rank === 3) return 'from-orange-600 to-orange-700';
    return 'from-slate-600 to-slate-700';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return 'ri-trophy-fill';
    if (rank === 2) return 'ri-medal-2-fill';
    if (rank === 3) return 'ri-medal-fill';
    return null;
  };

  return (
    <div className="text-white">
      {/* Hero Banner */}
      <div className="relative h-52 overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=epic%20galactic%20leaderboard%20arena%20champions%20podium%20space%20commanders%20holographic%20trophies%20rankings%20cosmic%20tournament%20dramatic%20lighting%20sci-fi%20wide%20angle%20cinematic%20background&width=1920&height=600&seq=lb_hero_banner&orientation=landscape"
          alt="Leaderboard"
          className="w-full h-full object-cover object-top"
          style={{ filter: 'brightness(0.7) saturate(1.2)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)' }} />
        <div className="absolute inset-0 flex items-center px-6">
          <div>
            <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent drop-shadow-lg">
              Galactic Leaderboards
            </h1>
            <p className="text-gray-300 text-lg">Compete with the best commanders in the universe</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="bg-black/50 backdrop-blur-sm border border-amber-500/40 rounded-lg px-4 py-2">
              <div className="text-xs text-gray-400 mb-1">Your Best Rank</div>
              <div className="text-xl font-bold text-amber-400">#28</div>
            </div>
            <div className="bg-black/50 backdrop-blur-sm border border-emerald-500/40 rounded-lg px-4 py-2">
              <div className="text-xs text-gray-400 mb-1">Total Players</div>
              <div className="text-xl font-bold text-emerald-400">256,780</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Time Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'daily', name: 'Daily', icon: 'ri-calendar-line' },
            { id: 'weekly', name: 'Weekly', icon: 'ri-calendar-line' },
            { id: 'monthly', name: 'Monthly', icon: 'ri-calendar-2-line' },
            { id: 'alltime', name: 'All Time', icon: 'ri-time-line' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setTimeFilter(filter.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg whitespace-nowrap transition-all ${
                timeFilter === filter.id
                  ? 'bg-purple-500/20 border-2 border-purple-500 text-purple-400'
                  : 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:border-purple-500/50'
              }`}
            >
              <i className={`${filter.icon} w-5 h-5 flex items-center justify-center`}></i>
              <span className="font-medium">{filter.name}</span>
            </button>
          ))}
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`p-4 rounded-xl transition-all ${
                activeCategory === category.id
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-purple-400'
                  : 'bg-slate-800/30 border border-slate-700 hover:border-purple-500/50'
              }`}
            >
              <div className={`w-12 h-12 mx-auto mb-2 rounded-lg ${
                activeCategory === category.id ? 'bg-white/20' : 'bg-slate-700'
              } flex items-center justify-center`}>
                <i className={`${category.icon} text-2xl w-8 h-8 flex items-center justify-center`}></i>
              </div>
              <div className="text-sm font-bold text-center">{category.name}</div>
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-purple-500/30 rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="bg-slate-900/50 border-b border-purple-500/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-purple-400">
                {categories.find(c => c.id === activeCategory)?.name} Rankings
              </h2>
              <p className="text-sm text-gray-400">
                {categories.find(c => c.id === activeCategory)?.description}
              </p>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-700">
            {leaderboards[activeCategory]?.map((entry, index) => (
              <div
                key={entry.playerId}
                className={`px-6 py-4 hover:bg-slate-700/30 transition-all ${
                  entry.playerId === 'you' ? 'bg-purple-500/10 border-l-4 border-purple-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Rank */}
                    <div className="w-16 text-center flex-shrink-0">
                      {entry.rank <= 3 ? (
                        <div className={`w-12 h-12 mx-auto rounded-lg bg-gradient-to-br ${getRankColor(entry.rank)} flex items-center justify-center`}>
                          <i className={`${getRankIcon(entry.rank)} text-2xl text-white w-8 h-8 flex items-center justify-center`}></i>
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-gray-400">#{entry.rank}</div>
                      )}
                    </div>

                    {/* Avatar for top ranks */}
                    {entry.rank <= 3 && (
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-amber-400/50">
                        <img
                          src={`https://readdy.ai/api/search-image?query=futuristic%20space%20commander%20portrait%20military%20uniform%20rank%20badge%20glowing%20visor%20dark%20background%20digital%20art%20sci-fi%20character%20portrait%20highly%20detailed&width=120&height=120&seq=lb_avatar_${entry.rank}&orientation=squarish`}
                          alt={entry.playerName}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    )}

                    {/* Player Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${entry.playerId === 'you' ? 'text-purple-400' : 'text-white'}`}>
                          {entry.playerName}
                        </span>
                        {entry.allianceTag && (
                          <span className="text-sm text-gray-400">{entry.allianceTag}</span>
                        )}
                        {entry.playerId === 'you' && (
                          <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full font-bold">YOU</span>
                        )}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cyan-400">
                        {formatScore(entry.score, activeCategory)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {activeCategory === 'battles' ? 'victories' : 'power'}
                      </div>
                    </div>

                    {/* Change */}
                    <div className="w-24 text-right">
                      {entry.change !== 0 && (
                        <div className={`flex items-center justify-end gap-1 ${
                          entry.change > 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          <i className={`${entry.change > 0 ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} w-4 h-4 flex items-center justify-center`}></i>
                          <span className="font-bold">{Math.abs(entry.change)}</span>
                        </div>
                      )}
                      {entry.change === 0 && (
                        <div className="text-gray-500">
                          <i className="ri-subtract-line w-4 h-4 inline-flex items-center justify-center"></i>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More */}
          <div className="bg-slate-900/50 border-t border-purple-500/30 px-6 py-4 text-center">
            <button className="text-purple-400 hover:text-purple-300 font-medium transition-colors whitespace-nowrap">
              <i className="ri-arrow-down-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
              Load More Rankings
            </button>
          </div>
        </div>

        {/* Your Stats Summary */}
        <div className="mt-8 bg-slate-800/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Your Rankings Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(category => {
              const yourRank = leaderboards[category.id]?.find(e => e.playerId === 'you');
              return (
                <div key={category.id} className="bg-slate-900/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <i className={`${category.icon} text-purple-400 w-5 h-5 flex items-center justify-center`}></i>
                    <div className="text-xs text-gray-400">{category.name}</div>
                  </div>
                  <div className="text-2xl font-bold text-white">#{yourRank?.rank || '---'}</div>
                  {yourRank && yourRank.change !== 0 && (
                    <div className={`text-xs mt-1 ${yourRank.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {yourRank.change > 0 ? '+' : ''}{yourRank.change} this week
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}