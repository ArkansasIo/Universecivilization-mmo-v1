import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCraftingRank, CRAFTING_TITLES } from '@/hooks/useCraftingRank';

const TREE_META: Record<string, { label: string; icon: string; color: string; path: string }> = {
  weaponsmithing: { label: 'Weaponsmithing', icon: 'ri-sword-line', color: '#f87171', path: '/crafting-skill-trees/weaponsmithing' },
  armorsmithing: { label: 'Armorsmithing', icon: 'ri-shield-star-line', color: '#38bdf8', path: '/crafting-skill-trees/armorsmithing' },
  engineering: { label: 'Engineering', icon: 'ri-tools-line', color: '#4ade80', path: '/crafting-skill-trees/engineering' },
  alchemy: { label: 'Alchemy', icon: 'ri-flask-line', color: '#a78bfa', path: '/crafting-skill-trees/alchemy' },
  nanotechnology: { label: 'Nanotechnology', icon: 'ri-microscope-line', color: '#34d399', path: '/crafting-skill-trees/nanotechnology' },
};

export default function CraftingRankPage() {
  const navigate = useNavigate();
  const {
    totalSpent,
    treeBreakdown,
    currentRank,
    nextRank,
    progressPct,
    spToNext,
    allTitles,
    recentUnlock,
  } = useCraftingRank();

  const [activeTab, setActiveTab] = useState<'overview' | 'ladder' | 'breakdown'>('overview');

  const spNeededForMax = CRAFTING_TITLES[CRAFTING_TITLES.length - 1].spRequired;
  const overallPct = Math.min(100, Math.round((totalSpent / spNeededForMax) * 100));

  return (
    <div className="min-h-screen px-6 py-6">
      {/* Rank-up flash banner */}
      {recentUnlock && (
        <div
          className="mb-6 rounded-xl px-5 py-4 flex items-center gap-4 animate-pulse"
          style={{
            background: `${recentUnlock.color}12`,
            border: `1px solid ${recentUnlock.color}50`,
            boxShadow: `0 0 30px ${recentUnlock.glowColor}`,
          }}
        >
          <i className="ri-sparkling-2-fill text-2xl" style={{ color: recentUnlock.color }}></i>
          <div>
            <p className="text-xs font-bold tracking-widest" style={{ color: recentUnlock.color }}>RANK UP!</p>
            <p className="text-lg font-black text-white">{recentUnlock.title}</p>
            <p className="text-xs" style={{ color: '#8892aa' }}>{recentUnlock.bonusDesc}</p>
          </div>
        </div>
      )}

      {/* Page header */}
      <div className="flex items-start gap-5 mb-8">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `${currentRank.color}20`,
            border: `2px solid ${currentRank.color}50`,
            boxShadow: `0 0 24px ${currentRank.glowColor}`,
          }}
        >
          <i className={`${currentRank.icon} text-3xl`} style={{ color: currentRank.color }}></i>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <span
              className="text-xs px-3 py-0.5 rounded-full font-black tracking-widest"
              style={{ background: `${currentRank.color}18`, color: currentRank.color, border: `1px solid ${currentRank.color}40` }}
            >
              {currentRank.badge}
            </span>
            <span className="text-xs" style={{ color: '#4a5568' }}>
              Global Rank {currentRank.rank} / {CRAFTING_TITLES.length}
            </span>
          </div>
          <h1 className="text-2xl font-black" style={{ color: currentRank.color }}>{currentRank.title}</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7a95' }}>{currentRank.subtitle}</p>
        </div>
        <div
          className="flex flex-col items-center px-5 py-3 rounded-xl flex-shrink-0"
          style={{ background: `${currentRank.color}10`, border: `1px solid ${currentRank.color}30` }}
        >
          <span className="text-3xl font-black" style={{ color: currentRank.color }}>{totalSpent}</span>
          <span className="text-xs mt-0.5" style={{ color: '#6b7a95' }}>Total SP Spent</span>
        </div>
      </div>

      {/* Progress to next rank */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: 'rgba(13,21,38,0.85)',
          border: `1px solid ${currentRank.color}25`,
        }}
      >
        {nextRank ? (
          <>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div>
                <p className="text-xs font-semibold" style={{ color: '#6b7a95' }}>PROGRESS TO NEXT RANK</p>
                <p className="text-base font-bold mt-0.5" style={{ color: nextRank.color }}>{nextRank.title}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black" style={{ color: currentRank.color }}>{progressPct}%</p>
                <p className="text-xs" style={{ color: '#4a5568' }}>{spToNext} SP remaining</p>
              </div>
            </div>
            <div className="h-4 rounded-full overflow-hidden" style={{ background: '#1e2a3a' }}>
              <div
                className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
                style={{
                  width: `${progressPct}%`,
                  background: `linear-gradient(90deg, ${currentRank.color}80, ${currentRank.color}, ${nextRank.color})`,
                  boxShadow: `0 0 12px ${currentRank.glowColor}`,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                    animation: 'shimmer 2.5s infinite',
                  }}
                ></div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {nextRank.perks.map((perk, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg px-3 py-2"
                  style={{ background: `${nextRank.color}08`, border: `1px solid ${nextRank.color}20` }}
                >
                  <i className="ri-lock-line mt-0.5 text-xs flex-shrink-0" style={{ color: nextRank.color }}></i>
                  <span className="text-xs" style={{ color: '#8892aa' }}>{perk}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <i className="ri-vip-crown-fill text-4xl" style={{ color: currentRank.color }}></i>
            <div>
              <p className="text-lg font-black" style={{ color: currentRank.color }}>Maximum Rank Achieved!</p>
              <p className="text-sm" style={{ color: '#6b7a95' }}>You have mastered every crafting discipline. All bonuses at full power.</p>
            </div>
          </div>
        )}
      </div>

      {/* Overall SP Progress */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs font-semibold" style={{ color: '#6b7a95' }}>TOTAL PROGRESS TO GRANDMASTER ARTISAN</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(251,191,36,0.1)' }}></div>
        <span className="text-xs font-bold" style={{ color: '#fbbf24' }}>{totalSpent} / {spNeededForMax} SP ({overallPct}%)</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden mb-8" style={{ background: '#1e2a3a' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${overallPct}%`,
            background: 'linear-gradient(90deg, #9ca3af, #4ade80, #60a5fa, #c084fc, #fbbf24)',
          }}
        ></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ background: 'rgba(13,21,38,0.8)', border: '1px solid rgba(0,212,255,0.1)' }}>
        {(['overview', 'ladder', 'breakdown'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all whitespace-nowrap capitalize"
            style={{
              background: activeTab === tab ? `${currentRank.color}20` : 'transparent',
              color: activeTab === tab ? currentRank.color : '#6b7a95',
              border: activeTab === tab ? `1px solid ${currentRank.color}40` : '1px solid transparent',
            }}
          >
            {tab === 'overview' ? 'Current Rank Perks' : tab === 'ladder' ? 'Rank Ladder' : 'Discipline Breakdown'}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div
            className="rounded-xl p-5"
            style={{ background: 'rgba(13,21,38,0.8)', border: `1px solid ${currentRank.color}20` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${currentRank.color}18`, border: `1px solid ${currentRank.color}35` }}
              >
                <i className={`${currentRank.icon} text-lg`} style={{ color: currentRank.color }}></i>
              </div>
              <div>
                <p className="text-sm font-black text-white">{currentRank.title}</p>
                <p className="text-xs" style={{ color: '#6b7a95' }}>{currentRank.bonusDesc}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentRank.perks.map((perk, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-lg px-3 py-2.5"
                  style={{ background: `${currentRank.color}08`, border: `1px solid ${currentRank.color}20` }}
                >
                  <i className="ri-checkbox-circle-fill mt-0.5 text-sm flex-shrink-0" style={{ color: currentRank.color }}></i>
                  <span className="text-xs text-white leading-relaxed">{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Passive bonus stat card */}
          {currentRank.bonusPct > 0 && (
            <div
              className="rounded-xl p-5 flex items-center gap-5"
              style={{
                background: `linear-gradient(135deg, ${currentRank.color}12, ${currentRank.color}05)`,
                border: `1px solid ${currentRank.color}30`,
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${currentRank.color}20`, border: `2px solid ${currentRank.color}50` }}
              >
                <span className="text-xl font-black" style={{ color: currentRank.color }}>+{currentRank.bonusPct}%</span>
              </div>
              <div>
                <p className="text-sm font-black text-white mb-0.5">Active Passive Bonus</p>
                <p className="text-xs leading-relaxed" style={{ color: '#8892aa' }}>{currentRank.bonusDesc}</p>
                <p className="text-xs mt-1" style={{ color: '#4a5568' }}>This bonus applies globally to all crafting disciplines</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Rank Ladder */}
      {activeTab === 'ladder' && (
        <div className="space-y-2">
          {allTitles.map((t, idx) => {
            const isCurrentRank = t.rank === currentRank.rank;
            const isUnlocked = totalSpent >= t.spRequired;
            const isNext = nextRank?.rank === t.rank;
            const spIntoThisRank = totalSpent - t.spRequired;
            const spBetween = idx + 1 < allTitles.length ? allTitles[idx + 1].spRequired - t.spRequired : 1;
            const fillPct = isCurrentRank ? Math.min(100, Math.round((spIntoThisRank / spBetween) * 100)) : isUnlocked ? 100 : 0;

            return (
              <div
                key={t.rank}
                className="rounded-xl overflow-hidden transition-all"
                style={{
                  background: isCurrentRank ? `${t.color}10` : 'rgba(13,21,38,0.7)',
                  border: isCurrentRank
                    ? `1px solid ${t.color}50`
                    : `1px solid ${isUnlocked ? t.color + '20' : 'rgba(30,42,58,0.8)'}`,
                  opacity: isUnlocked ? 1 : 0.45,
                }}
              >
                <div className="px-5 py-4 flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isUnlocked ? `${t.color}18` : '#1e2a3a',
                      border: `1px solid ${isUnlocked ? t.color + '40' : '#2d3748'}`,
                    }}
                  >
                    <i className={`${t.icon} text-base`} style={{ color: isUnlocked ? t.color : '#3d4e63' }}></i>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-sm font-black" style={{ color: isUnlocked ? t.color : '#4a5568' }}>
                        {t.title}
                      </span>
                      {isCurrentRank && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded font-black"
                          style={{ background: `${t.color}25`, color: t.color, fontSize: 9 }}
                        >
                          CURRENT
                        </span>
                      )}
                      {isNext && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded font-black"
                          style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', fontSize: 9 }}
                        >
                          NEXT
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: '#4a5568' }}>{t.bonusDesc}</p>
                    {(isCurrentRank || isUnlocked) && (
                      <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: '#1e2a3a' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${fillPct}%`, background: t.color, transition: 'width 0.5s' }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* SP */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black" style={{ color: isUnlocked ? t.color : '#3d4e63' }}>
                      {t.spRequired} SP
                    </p>
                    {isUnlocked ? (
                      <i className="ri-checkbox-circle-fill text-sm" style={{ color: t.color }}></i>
                    ) : (
                      <i className="ri-lock-line text-sm" style={{ color: '#3d4e63' }}></i>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Breakdown */}
      {activeTab === 'breakdown' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(TREE_META).map(([treeId, meta]) => {
            const spent = treeBreakdown[treeId] || 0;
            const pct = totalSpent > 0 ? Math.round((spent / totalSpent) * 100) : 0;
            const maxEst = 100;
            const treePct = Math.min(100, Math.round((spent / maxEst) * 100));

            return (
              <div
                key={treeId}
                className="rounded-xl p-5 cursor-pointer transition-all"
                style={{ background: 'rgba(13,21,38,0.8)', border: `1px solid ${meta.color}25` }}
                onClick={() => navigate(meta.path)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.border = `1px solid ${meta.color}60`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.border = `1px solid ${meta.color}25`;
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}35` }}
                  >
                    <i className={`${meta.icon} text-base`} style={{ color: meta.color }}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">{meta.label}</p>
                    <p className="text-xs" style={{ color: '#4a5568' }}>{pct}% of your total SP</p>
                  </div>
                  <i className="ri-arrow-right-line text-sm" style={{ color: meta.color }}></i>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-black" style={{ color: meta.color }}>{spent}</span>
                  <span className="text-xs" style={{ color: '#4a5568' }}>SP invested</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1e2a3a' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${treePct}%`, background: meta.color, transition: 'width 0.5s' }}
                  ></div>
                </div>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#4a5568' }}>Mastery</span>
                  <span className="text-xs font-bold" style={{ color: meta.color }}>{treePct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}