import { useState } from 'react';
import { useCraftingRank } from '@/hooks/useCraftingRank';
import CraftingRankModal from './CraftingRankModal';

const TREE_META: Record<string, { label: string; color: string }> = {
  weaponsmithing: { label: 'Weaponsmithing', color: '#f87171' },
  armorsmithing: { label: 'Armorsmithing', color: '#38bdf8' },
  engineering: { label: 'Engineering', color: '#4ade80' },
  alchemy: { label: 'Alchemy', color: '#a78bfa' },
  nanotechnology: { label: 'Nanotechnology', color: '#34d399' },
};

export default function CraftingRankBanner() {
  const { totalSpent, currentRank, nextRank, progressPct, spToNext, treeBreakdown } = useCraftingRank();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className="rounded-2xl overflow-hidden mb-8 cursor-pointer transition-all duration-200 group"
        style={{
          background: `linear-gradient(135deg, #0d1526, #0b1020)`,
          border: `1px solid ${currentRank.color}35`,
        }}
        onClick={() => setModalOpen(true)}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.border = `1px solid ${currentRank.color}70`;
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px ${currentRank.glowColor}`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.border = `1px solid ${currentRank.color}35`;
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        }}
      >
        {/* Top glow stripe */}
        <div
          className="h-0.5 w-full"
          style={{ background: `linear-gradient(90deg, transparent 0%, ${currentRank.color} 40%, ${nextRank?.color || currentRank.color} 70%, transparent 100%)` }}
        ></div>

        <div className="px-6 py-5">
          <div className="flex items-center gap-5 flex-wrap">
            {/* Rank icon */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: `${currentRank.color}20`,
                border: `2px solid ${currentRank.color}50`,
                boxShadow: `0 0 20px ${currentRank.glowColor}`,
              }}
            >
              <i className={`${currentRank.icon} text-3xl`} style={{ color: currentRank.color }}></i>
            </div>

            {/* Rank info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full font-black tracking-widest"
                  style={{
                    background: `${currentRank.color}18`,
                    color: currentRank.color,
                    border: `1px solid ${currentRank.color}40`,
                  }}
                >
                  {currentRank.badge}
                </span>
                <span className="text-xs" style={{ color: '#4a5568' }}>
                  Global Crafting Rank {currentRank.rank}/10
                </span>
              </div>
              <h2 className="text-xl font-black" style={{ color: currentRank.color }}>{currentRank.title}</h2>
              <p className="text-xs mt-0.5" style={{ color: '#6b7a95' }}>
                {currentRank.subtitle} &nbsp;·&nbsp;
                <span style={{ color: '#4a5568' }}>{currentRank.bonusDesc}</span>
              </p>
            </div>

            {/* Total SP */}
            <div
              className="flex flex-col items-center px-5 py-3 rounded-xl flex-shrink-0"
              style={{ background: `${currentRank.color}10`, border: `1px solid ${currentRank.color}30` }}
            >
              <span className="text-3xl font-black" style={{ color: currentRank.color }}>{totalSpent}</span>
              <span className="text-xs mt-0.5" style={{ color: '#6b7a95' }}>Total SP</span>
            </div>

            {/* View details CTA */}
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg flex-shrink-0 transition-all group-hover:gap-3"
              style={{
                background: `${currentRank.color}10`,
                border: `1px solid ${currentRank.color}30`,
                color: currentRank.color,
              }}
            >
              <span className="text-xs font-bold whitespace-nowrap">View Details</span>
              <i className="ri-external-link-line text-sm"></i>
            </div>
          </div>

          {/* Progress to next rank */}
          {nextRank && (
            <div className="mt-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs" style={{ color: '#6b7a95' }}>
                  Progress to <span style={{ color: nextRank.color }}>{nextRank.title}</span>
                </span>
                <span className="text-xs font-bold" style={{ color: currentRank.color }}>
                  {spToNext} SP remaining ({progressPct}%)
                </span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#1e2a3a' }}>
                <div
                  className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
                  style={{
                    width: `${progressPct}%`,
                    background: `linear-gradient(90deg, ${currentRank.color}80, ${currentRank.color}, ${nextRank.color})`,
                    boxShadow: `0 0 8px ${currentRank.glowColor}`,
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
            </div>
          )}

          {!nextRank && (
            <div
              className="mt-4 flex items-center gap-3 px-4 py-2.5 rounded-xl"
              style={{ background: `${currentRank.color}10`, border: `1px solid ${currentRank.color}30` }}
            >
              <i className="ri-vip-crown-fill text-lg" style={{ color: currentRank.color }}></i>
              <div>
                <p className="text-sm font-black" style={{ color: currentRank.color }}>Maximum Rank Achieved!</p>
                <p className="text-xs" style={{ color: '#6b7a95' }}>You have mastered all crafting disciplines. All passive bonuses are maximized.</p>
              </div>
            </div>
          )}

          {/* Tree breakdown bar */}
          {Object.keys(TREE_META).length > 0 && (
            <div className="mt-4 flex gap-1 h-1.5 rounded-full overflow-hidden">
              {Object.entries(TREE_META).map(([id, meta]) => {
                const spent = treeBreakdown[id] || 0;
                const pct = totalSpent > 0 ? (spent / totalSpent) * 100 : 20;
                return (
                  <div
                    key={id}
                    title={`${meta.label}: ${spent} SP`}
                    style={{ width: `${pct}%`, background: meta.color, minWidth: 4, transition: 'width 0.5s' }}
                  ></div>
                );
              })}
            </div>
          )}
          <div className="mt-2 flex gap-3 flex-wrap">
            {Object.entries(TREE_META).map(([id, meta]) => (
              <div key={id} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: meta.color }}></div>
                <span className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>
                  {meta.label} <span style={{ color: meta.color }}>{treeBreakdown[id] || 0}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CraftingRankModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </>
  );
}