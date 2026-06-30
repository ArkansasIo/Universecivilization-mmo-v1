import { useCraftingRank, CRAFTING_TITLES } from '@/hooks/useCraftingRank';

interface Props {
  open: boolean;
  onClose: () => void;
}

const TREE_META: Record<string, { label: string; icon: string; color: string }> = {
  weaponsmithing: { label: 'Weaponsmithing', icon: 'ri-sword-line', color: '#f87171' },
  armorsmithing: { label: 'Armorsmithing', icon: 'ri-shield-star-line', color: '#38bdf8' },
  engineering: { label: 'Engineering', icon: 'ri-tools-line', color: '#4ade80' },
  alchemy: { label: 'Alchemy', icon: 'ri-flask-line', color: '#a78bfa' },
  nanotechnology: { label: 'Nanotechnology', icon: 'ri-microscope-line', color: '#34d399' },
};

export default function CraftingRankModal({ open, onClose }: Props) {
  const { totalSpent, treeBreakdown, currentRank, nextRank, progressPct, spToNext, allTitles } = useCraftingRank();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="rounded-2xl overflow-hidden flex flex-col"
        style={{
          width: 760,
          maxWidth: '95vw',
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, #0d1526, #0b1020)',
          border: `1px solid ${currentRank.color}40`,
          boxShadow: `0 0 60px ${currentRank.glowColor}`,
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between flex-shrink-0"
          style={{
            borderBottom: `1px solid ${currentRank.color}25`,
            background: `linear-gradient(90deg, ${currentRank.color}12, transparent)`,
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: `${currentRank.color}20`,
                border: `2px solid ${currentRank.color}50`,
                boxShadow: `0 0 20px ${currentRank.glowColor}`,
              }}
            >
              <i className={`${currentRank.icon} text-2xl`} style={{ color: currentRank.color }}></i>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-black tracking-widest"
                  style={{ background: `${currentRank.color}20`, color: currentRank.color, border: `1px solid ${currentRank.color}40` }}
                >
                  {currentRank.badge}
                </span>
                <span className="text-xs" style={{ color: '#4a5568' }}>Rank {currentRank.rank} / {CRAFTING_TITLES.length}</span>
              </div>
              <h2 className="text-xl font-black text-white">{currentRank.title}</h2>
              <p className="text-xs mt-0.5" style={{ color: '#6b7a95' }}>{currentRank.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all"
            style={{ color: '#6b7a95' }}
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6" style={{ scrollbarWidth: 'thin' }}>

          {/* Total SP + progress to next rank */}
          <div
            className="rounded-xl p-5"
            style={{ background: 'rgba(13,21,38,0.8)', border: `1px solid ${currentRank.color}20` }}
          >
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-xs font-semibold mb-0.5" style={{ color: '#6b7a95' }}>TOTAL SP SPENT (ALL TREES)</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black" style={{ color: currentRank.color }}>{totalSpent}</span>
                  <span className="text-sm font-semibold" style={{ color: '#4a5568' }}>skill points</span>
                </div>
              </div>
              {nextRank && (
                <div className="text-right">
                  <p className="text-xs" style={{ color: '#4a5568' }}>Next: <span style={{ color: nextRank.color }}>{nextRank.title}</span></p>
                  <p className="text-xs font-bold mt-0.5" style={{ color: '#6b7a95' }}>{spToNext} SP remaining</p>
                </div>
              )}
              {!nextRank && (
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ background: `${currentRank.color}15`, border: `1px solid ${currentRank.color}40` }}
                >
                  <i className="ri-vip-crown-fill" style={{ color: currentRank.color }}></i>
                  <span className="text-xs font-black" style={{ color: currentRank.color }}>MAX RANK</span>
                </div>
              )}
            </div>
            {nextRank && (
              <>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs" style={{ color: '#4a5568' }}>Progress to {nextRank.title}</span>
                  <span className="text-xs font-bold" style={{ color: currentRank.color }}>{progressPct}%</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: '#1e2a3a' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
                    style={{
                      width: `${progressPct}%`,
                      background: `linear-gradient(90deg, ${currentRank.color}80, ${currentRank.color}, ${nextRank.color})`,
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                        animation: 'shimmer 2s infinite',
                      }}
                    ></div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Current rank perks */}
          <div>
            <h3 className="text-xs font-bold tracking-widest mb-3" style={{ color: '#4a5568' }}>CURRENT RANK PERKS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentRank.perks.map((perk, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-lg px-3 py-2.5"
                  style={{ background: `${currentRank.color}08`, border: `1px solid ${currentRank.color}20` }}
                >
                  <i className="ri-checkbox-circle-fill mt-0.5 flex-shrink-0 text-sm" style={{ color: currentRank.color }}></i>
                  <span className="text-xs text-white leading-relaxed">{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SP breakdown per tree */}
          <div>
            <h3 className="text-xs font-bold tracking-widest mb-3" style={{ color: '#4a5568' }}>SP INVESTED PER DISCIPLINE</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(TREE_META).map(([treeId, meta]) => {
                const spent = treeBreakdown[treeId] || 0;
                const maxPer = 100;
                const pct = Math.min(100, Math.round((spent / maxPer) * 100));
                return (
                  <div
                    key={treeId}
                    className="rounded-lg p-3"
                    style={{ background: 'rgba(13,21,38,0.7)', border: `1px solid ${meta.color}25` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}35` }}>
                        <i className={`${meta.icon} text-sm`} style={{ color: meta.color }}></i>
                      </div>
                      <span className="text-xs font-semibold text-white">{meta.label}</span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-1.5">
                      <span className="text-xl font-black" style={{ color: meta.color }}>{spent}</span>
                      <span className="text-xs" style={{ color: '#4a5568' }}>SP</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1e2a3a' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: meta.color }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full rank ladder */}
          <div>
            <h3 className="text-xs font-bold tracking-widest mb-3" style={{ color: '#4a5568' }}>RANK LADDER</h3>
            <div className="space-y-2">
              {allTitles.map((t) => {
                const isCurrentRank = t.rank === currentRank.rank;
                const isUnlocked = totalSpent >= t.spRequired;
                const isNext = nextRank?.rank === t.rank;
                return (
                  <div
                    key={t.rank}
                    className="flex items-center gap-4 rounded-lg px-4 py-3 transition-all"
                    style={{
                      background: isCurrentRank ? `${t.color}12` : 'rgba(13,21,38,0.5)',
                      border: isCurrentRank
                        ? `1px solid ${t.color}50`
                        : isNext
                        ? `1px solid ${t.color}25`
                        : `1px solid ${isUnlocked ? t.color + '15' : 'rgba(30,42,58,0.8)'}`,
                      opacity: isUnlocked ? 1 : 0.45,
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isUnlocked ? `${t.color}18` : '#1e2a3a',
                        border: `1px solid ${isUnlocked ? t.color + '40' : '#2d3748'}`,
                      }}
                    >
                      <i className={`${t.icon} text-base`} style={{ color: isUnlocked ? t.color : '#3d4e63' }}></i>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span
                          className="text-sm font-bold"
                          style={{ color: isUnlocked ? t.color : '#4a5568' }}
                        >
                          {t.title}
                        </span>
                        {isCurrentRank && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded font-black"
                            style={{ background: `${t.color}20`, color: t.color, fontSize: 9 }}
                          >
                            CURRENT
                          </span>
                        )}
                        {isNext && !isCurrentRank && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded font-black"
                            style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', fontSize: 9 }}
                          >
                            NEXT
                          </span>
                        )}
                      </div>
                      <p className="text-xs truncate" style={{ color: '#4a5568' }}>{t.bonusDesc}</p>
                    </div>

                    {/* SP requirement */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold" style={{ color: isUnlocked ? t.color : '#4a5568' }}>
                        {t.spRequired} SP
                      </p>
                      {isUnlocked ? (
                        <i className="ri-check-line text-xs" style={{ color: t.color }}></i>
                      ) : (
                        <i className="ri-lock-line text-xs" style={{ color: '#3d4e63' }}></i>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}