import { useState } from 'react';
import { useRecipeUnlocks, RecipeUnlockStatus } from '@/hooks/useRecipeUnlocks';
import { useCraftingRank, CRAFTING_TITLES } from '@/hooks/useCraftingRank';
import { Link } from 'react-router-dom';

const RARITY_STYLES: Record<string, { text: string; bg: string; border: string }> = {
  Common: { text: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' },
  Uncommon: { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  Rare: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  Epic: { text: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/30' },
  Legendary: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  Mythic: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  Universal: { text: 'text-cyan-300', bg: 'bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10', border: 'border-cyan-400/30' },
};

const PAGE_ICONS: Record<string, string> = {
  forge: 'ri-fire-fill',
  laboratory: 'ri-body-scan-line',
  artifacts: 'ri-ancient-pavilion-line',
};

const PAGE_COLORS: Record<string, string> = {
  forge: 'text-orange-400',
  laboratory: 'text-fuchsia-400',
  artifacts: 'text-amber-400',
};

type FilterMode = 'all' | 'unlocked' | 'locked' | 'forge' | 'laboratory' | 'artifacts';

function RecipeCard({ entry, isCurrent }: { entry: RecipeUnlockStatus; isCurrent: boolean }) {
  const rar = RARITY_STYLES[entry.rarity] || RARITY_STYLES.Common;
  const rankDef = CRAFTING_TITLES[entry.minRank - 1];

  return (
    <div
      className={`relative rounded-xl border transition-all overflow-hidden
        ${entry.unlocked
          ? 'bg-slate-800/50 border-slate-700/60 hover:border-slate-500/80'
          : 'bg-slate-900/70 border-slate-800/60'}
        ${isCurrent ? 'ring-2 ring-emerald-400/50' : ''}
      `}
    >
      {/* New unlock shimmer */}
      {isCurrent && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 via-transparent to-emerald-400/5 pointer-events-none animate-pulse"></div>
      )}

      {!entry.unlocked && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
          <div className="text-center px-4">
            <div className="w-12 h-12 flex items-center justify-center mx-auto bg-slate-800 rounded-full border border-slate-700 mb-2">
              <i className="ri-lock-line text-xl text-slate-400"></i>
            </div>
            <p className="text-xs text-slate-400 font-bold">Requires</p>
            <p className="text-sm font-black" style={{ color: rankDef.color }}>{rankDef.title}</p>
            <p className="text-xs text-slate-500 mt-0.5">Rank {entry.minRank} · {rankDef.spRequired} SP</p>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl ${rar.bg} border ${rar.border}`}
          >
            <i className={`${entry.icon} text-lg ${rar.text}`}></i>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3 className="text-sm font-bold text-white truncate">{entry.recipeName}</h3>
              {isCurrent && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                  NEW UNLOCK
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${rar.text} ${rar.bg} ${rar.border}`}>
                {entry.rarity}
              </span>
              <span className="text-[10px] text-slate-500">T{entry.tier}</span>
              <span className={`text-[10px] font-bold ${PAGE_COLORS[entry.page]}`}>
                <i className={`${PAGE_ICONS[entry.page]} mr-0.5`}></i>{entry.pageLabel}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{entry.description}</p>
        <p className="text-[10px] text-slate-500 font-medium mb-3">
          <i className="ri-price-tag-3-line mr-1"></i>{entry.category}
        </p>

        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border"
          style={{
            background: `${rankDef.color}12`,
            borderColor: `${rankDef.color}35`,
            color: rankDef.color,
          }}
        >
          <i className={`${rankDef.icon} text-sm`}></i>
          <span>{entry.unlocked ? 'Unlocked at' : 'Requires'}: {rankDef.title}</span>
          <span className="ml-auto text-slate-500">R{entry.minRank}</span>
        </div>
      </div>
    </div>
  );
}

export default function CraftingRecipeUnlocksPage() {
  const { allWithStatus, unlocked, locked, newAtCurrentRank, upcomingAtNextRank, currentRank } = useRecipeUnlocks();
  const { nextRank, progressPct, spToNext } = useCraftingRank();
  const [filter, setFilter] = useState<FilterMode>('all');
  const [search, setSearch] = useState('');

  const filtered = allWithStatus.filter(r => {
    const matchFilter =
      filter === 'all' ? true :
      filter === 'unlocked' ? r.unlocked :
      filter === 'locked' ? !r.unlocked :
      r.page === filter;
    const matchSearch = search === '' || r.recipeName.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // Group by rank
  const byRank: Record<number, RecipeUnlockStatus[]> = {};
  filtered.forEach(r => {
    if (!byRank[r.minRank]) byRank[r.minRank] = [];
    byRank[r.minRank].push(r);
  });

  const FILTER_TABS: { id: FilterMode; label: string; icon: string; count: number }[] = [
    { id: 'all', label: 'All Recipes', icon: 'ri-list-check', count: allWithStatus.length },
    { id: 'unlocked', label: 'Unlocked', icon: 'ri-lock-unlock-line', count: unlocked.length },
    { id: 'locked', label: 'Locked', icon: 'ri-lock-line', count: locked.length },
    { id: 'forge', label: 'Forge', icon: 'ri-fire-fill', count: allWithStatus.filter(r => r.page === 'forge').length },
    { id: 'laboratory', label: 'Lab', icon: 'ri-body-scan-line', count: allWithStatus.filter(r => r.page === 'laboratory').length },
    { id: 'artifacts', label: 'Artifacts', icon: 'ri-ancient-pavilion-line', count: allWithStatus.filter(r => r.page === 'artifacts').length },
  ];

  return (
    <div className="min-h-screen bg-[#080b0f] text-white">
      {/* Hero */}
      <div className="relative h-52 overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=holographic%20recipe%20scroll%20vault%20glowing%20ancient%20runes%20formula%20schematics%20unlocking%20cosmic%20energy%20beams%20floating%20blueprint%20pages%20mystical%20crafting%20knowledge%20library%20dark%20space%20background%20with%20golden%20light%20shafts&width=1920&height=380&seq=recipe-unlock-hero-1&orientation=landscape"
          alt="Recipe Unlocks"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-slate-950"></div>
        <div className="absolute inset-0 flex items-end px-8 pb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-black text-white flex items-center gap-3 mb-1">
              <i className="ri-key-2-line text-3xl text-emerald-400"></i>
              Recipe Unlock Registry
            </h1>
            <p className="text-slate-300 text-sm">Exclusive recipes unlocked as your Crafting Rank increases</p>
          </div>
          {/* Current rank pill */}
          <div
            className="flex-shrink-0 px-5 py-3 rounded-2xl border text-right"
            style={{
              background: `${currentRank.color}15`,
              borderColor: `${currentRank.color}40`,
            }}
          >
            <p className="text-xs text-slate-400 font-bold">Current Rank</p>
            <p className="text-lg font-black" style={{ color: currentRank.color }}>{currentRank.title}</p>
            <p className="text-xs text-slate-500">Rank {currentRank.rank} · {unlocked.length}/{allWithStatus.length} recipes</p>
          </div>
        </div>
      </div>

      {/* Stats + Progress Bar */}
      <div className="px-6 pt-5 pb-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <div className="bg-[#080b0f] rounded-xl p-4 border border-[#1e2a36]">
            <p className="text-2xl font-black text-emerald-400">{unlocked.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">Unlocked Recipes</p>
          </div>
          <div className="bg-[#080b0f] rounded-xl p-4 border border-[#1e2a36]">
            <p className="text-2xl font-black text-slate-400">{locked.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">Still Locked</p>
          </div>
          <div className="bg-[#080b0f] rounded-xl p-4 border border-[#1e2a36]">
            <p className="text-2xl font-black text-amber-400">{newAtCurrentRank.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">Unlocked This Rank</p>
          </div>
          <div className="bg-[#080b0f] rounded-xl p-4 border border-[#1e2a36]">
            <p className="text-2xl font-black text-cyan-400">{upcomingAtNextRank.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">Coming Next Rank</p>
          </div>
        </div>

        {/* Progress to next rank */}
        {nextRank && (
          <div
            className="rounded-xl p-4 border mb-5"
            style={{ background: `${nextRank.color}08`, borderColor: `${nextRank.color}25` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <i className={`${nextRank.icon} text-lg`} style={{ color: nextRank.color }}></i>
                <span className="text-sm font-bold text-white">Progress to <span style={{ color: nextRank.color }}>{nextRank.title}</span></span>
              </div>
              <span className="text-xs text-slate-400">{spToNext} SP needed</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 mb-2">
              <div
                className="h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%`, background: nextRank.color }}
              ></div>
            </div>
            {upcomingAtNextRank.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs text-slate-500 mr-1 self-center">Next unlock:</span>
                {upcomingAtNextRank.map(r => (
                  <span key={r.recipeId} className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                    <i className={`${r.icon} mr-1`}></i>{r.recipeName}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Filter + Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex flex-wrap gap-2">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap border
                  ${filter === tab.id ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'}`}
              >
                <i className={tab.icon}></i>{tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === tab.id ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-[#080b0f] border border-[#1e2a36] rounded-xl px-3 py-2 flex-1 sm:max-w-xs">
            <i className="ri-search-line text-slate-400 text-sm"></i>
            <input
              type="text"
              placeholder="Search recipes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-white text-sm flex-1 focus:outline-none placeholder:text-slate-500"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-slate-500 hover:text-white cursor-pointer">
                <i className="ri-close-line text-sm"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grouped Recipe Grid */}
      <div className="px-6 pb-10">
        {Object.keys(byRank).length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <i className="ri-search-eye-line text-4xl mb-3 block"></i>
            <p className="text-lg font-bold">No recipes match your filter</p>
          </div>
        ) : (
          Object.entries(byRank)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([rankStr, entries]) => {
              const rank = Number(rankStr);
              const rankDef = CRAFTING_TITLES[rank - 1];
              const isCurrentRankGroup = rank === currentRank.rank;
              const isUnlockedGroup = rank <= currentRank.rank;

              return (
                <div key={rank} className="mb-8">
                  {/* Rank header */}
                  <div
                    className="flex items-center gap-3 mb-4 px-4 py-3 rounded-xl border"
                    style={{
                      background: `${rankDef.color}10`,
                      borderColor: `${rankDef.color}30`,
                    }}
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded-full border"
                      style={{ borderColor: rankDef.color, background: `${rankDef.color}20` }}
                    >
                      <i className={`${rankDef.icon} text-lg`} style={{ color: rankDef.color }}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base font-black" style={{ color: rankDef.color }}>
                          Rank {rank}: {rankDef.title}
                        </h2>
                        {isCurrentRankGroup && (
                          <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                            CURRENT RANK
                          </span>
                        )}
                        {!isUnlockedGroup && (
                          <span className="text-xs bg-slate-800 text-slate-500 border border-slate-700 px-2 py-0.5 rounded-full">
                            Locked · {rankDef.spRequired} SP required
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{rankDef.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{entries.length} recipe{entries.length !== 1 ? 's' : ''}</p>
                      <p className="text-xs text-slate-500">
                        {entries.filter(r => r.page === 'forge').length > 0 && <span className="mr-2"><i className="ri-fire-fill text-orange-400 mr-0.5"></i>{entries.filter(r => r.page === 'forge').length}</span>}
                        {entries.filter(r => r.page === 'laboratory').length > 0 && <span className="mr-2"><i className="ri-body-scan-line text-fuchsia-400 mr-0.5"></i>{entries.filter(r => r.page === 'laboratory').length}</span>}
                        {entries.filter(r => r.page === 'artifacts').length > 0 && <span><i className="ri-ancient-pavilion-line text-amber-400 mr-0.5"></i>{entries.filter(r => r.page === 'artifacts').length}</span>}
                      </p>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {entries.map(r => (
                      <RecipeCard
                        key={r.recipeId}
                        entry={r}
                        isCurrent={isCurrentRankGroup && r.unlocked && filter !== 'locked'}
                      />
                    ))}
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* Bottom quick-links */}
      <div className="px-6 pb-10">
        <div className="bg-[#080b0f] rounded-xl border border-[#1e2a36] p-5">
          <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-widest">Jump to Workshop</h3>
          <div className="flex flex-wrap gap-3">
            {([
              { label: 'Crafting Forge', path: '/crafting-forge', icon: 'ri-fire-fill', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20' },
              { label: 'Augmentations Lab', path: '/crafting-augmentations', icon: 'ri-body-scan-line', color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10 border-fuchsia-500/30 hover:bg-fuchsia-500/20' },
              { label: 'Artifact Workshop', path: '/crafting-artifacts', icon: 'ri-ancient-pavilion-line', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20' },
              { label: 'Crafting Rank', path: '/crafting-rank', icon: 'ri-medal-line', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20' },
            ] as const).map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${link.bg} ${link.color}`}
              >
                <i className={`${link.icon}`}></i>
                {link.label}
                <i className="ri-arrow-right-line text-xs opacity-60"></i>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}