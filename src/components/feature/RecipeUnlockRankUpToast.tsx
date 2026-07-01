import { useEffect, useState, useRef } from 'react';
import { CraftingTitle } from '@/hooks/useCraftingRank';
import { RECIPE_UNLOCK_TABLE, RecipeUnlockEntry } from '@/hooks/useRecipeUnlocks';
import { Link } from 'react-router-dom';

interface Props {
  newRank: CraftingTitle | null;
  /** Filter to only show recipes from specific page(s) */
  pageFilter?: Array<'forge' | 'laboratory' | 'artifacts'>;
}

const RARITY_TEXT: Record<string, string> = {
  Common: 'text-slate-400',
  Uncommon: 'text-green-400',
  Rare: 'text-cyan-400',
  Epic: 'text-fuchsia-400',
  Legendary: 'text-amber-400',
  Mythic: 'text-rose-400',
  Universal: 'text-cyan-300',
};

const PAGE_LABEL: Record<string, { label: string; icon: string; color: string }> = {
  forge: { label: 'Forge', icon: 'ri-fire-fill', color: 'text-orange-400' },
  laboratory: { label: 'Lab', icon: 'ri-body-scan-line', color: 'text-fuchsia-400' },
  artifacts: { label: 'Artifacts', icon: 'ri-ancient-pavilion-line', color: 'text-amber-400' },
};

export default function RecipeUnlockRankUpToast({ newRank, pageFilter }: Props) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Recipes newly unlocked at exactly this rank
  const newlyUnlocked: RecipeUnlockEntry[] = newRank
    ? RECIPE_UNLOCK_TABLE.filter(r => {
        const matchRank = r.minRank === newRank.rank;
        const matchPage = !pageFilter || pageFilter.includes(r.page);
        return matchRank && matchPage;
      })
    : [];

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (leaveRef.current) clearTimeout(leaveRef.current);

    if (newRank) {
      setLeaving(false);
      setExpanded(false);
      setVisible(true);

      leaveRef.current = setTimeout(() => setLeaving(true), 7000);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setExpanded(false);
      }, 7600);
    } else {
      setVisible(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (leaveRef.current) clearTimeout(leaveRef.current);
    };
  }, [newRank]);

  const handleDismiss = () => {
    setLeaving(true);
    setTimeout(() => { setVisible(false); setExpanded(false); }, 500);
  };

  const resetTimer = () => {
    // If user expands, reset the dismiss timer to give them time to read
    if (leaveRef.current) clearTimeout(leaveRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
    leaveRef.current = setTimeout(() => setLeaving(true), 10000);
    timerRef.current = setTimeout(() => { setVisible(false); setExpanded(false); }, 10600);
  };

  if (!visible || !newRank) return null;

  const hasNewRecipes = newlyUnlocked.length > 0;

  return (
    <div
      className="fixed top-24 right-5 z-[60] rounded-2xl overflow-hidden transition-all duration-500"
      style={{
        width: 360,
        background: 'linear-gradient(135deg, #0d1526 0%, #0a1020 100%)',
        border: `1px solid ${newRank.color}55`,
        boxShadow: `0 0 48px ${newRank.glowColor}, 0 12px 40px rgba(0,0,0,0.7)`,
        opacity: leaving ? 0 : 1,
        transform: leaving ? 'translateX(115%) scale(0.95)' : 'translateX(0) scale(1)',
      }}
    >
      {/* Top accent line */}
      <div
        className="h-0.5 w-full"
        style={{ background: `linear-gradient(90deg, transparent 0%, ${newRank.color} 40%, ${newRank.color} 60%, transparent 100%)` }}
      />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <i className="ri-sparkling-2-fill text-xs animate-pulse" style={{ color: newRank.color }}></i>
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: newRank.color }}>
              Crafting Rank Up!
            </span>
          </div>
          <button
            onClick={handleDismiss}
            className="w-5 h-5 flex items-center justify-center rounded-full text-slate-500 hover:text-white cursor-pointer transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <i className="ri-close-line text-xs"></i>
          </button>
        </div>

        {/* Rank identity */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl"
            style={{
              background: `${newRank.color}20`,
              border: `2px solid ${newRank.color}55`,
              boxShadow: `0 0 18px ${newRank.glowColor}`,
            }}
          >
            <i className={`${newRank.icon} text-xl`} style={{ color: newRank.color }}></i>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-500 mb-0.5">You are now a</p>
            <p className="text-sm font-black leading-tight" style={{ color: newRank.color }}>{newRank.title}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{newRank.subtitle}</p>
          </div>
        </div>

        {/* Passive bonus pill */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3"
          style={{ background: `${newRank.color}12`, border: `1px solid ${newRank.color}25` }}
        >
          <i className="ri-flashlight-line text-sm flex-shrink-0" style={{ color: newRank.color }}></i>
          <span className="text-xs font-semibold text-slate-200">{newRank.bonusDesc}</span>
        </div>

        {/* New recipe unlocks section */}
        {hasNewRecipes && (
          <div>
            <button
              onClick={() => { setExpanded(v => !v); if (!expanded) resetTimer(); }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all mb-1"
              style={{
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.25)',
              }}
            >
              <div className="flex items-center gap-2">
                <i className="ri-lock-unlock-line text-sm text-emerald-400"></i>
                <span className="text-xs font-bold text-emerald-300">
                  {newlyUnlocked.length} New Recipe{newlyUnlocked.length !== 1 ? 's' : ''} Unlocked
                </span>
              </div>
              {expanded
                ? <i className="ri-arrow-up-s-line text-xs text-emerald-400"></i>
                : <i className="ri-arrow-down-s-line text-xs text-emerald-400"></i>
              }
            </button>

            {expanded && (
              <div className="space-y-1.5 mt-2 max-h-52 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                {newlyUnlocked.map(recipe => {
                  const pageCfg = PAGE_LABEL[recipe.page];
                  return (
                    <div
                      key={recipe.recipeId}
                      className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div
                        className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg mt-0.5"
                        style={{ background: `${newRank.color}15`, border: `1px solid ${newRank.color}30` }}
                      >
                        <i className={`${recipe.icon} text-sm`} style={{ color: newRank.color }}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white leading-tight truncate">{recipe.recipeName}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className={`text-[10px] font-bold ${RARITY_TEXT[recipe.rarity] || 'text-slate-400'}`}>
                            {recipe.rarity}
                          </span>
                          <span className="text-[10px] text-slate-600">·</span>
                          <span className={`text-[10px] font-medium flex items-center gap-0.5 ${pageCfg.color}`}>
                            <i className={`${pageCfg.icon} text-[10px]`}></i>
                            {pageCfg.label}
                          </span>
                          <span className="text-[10px] text-slate-600">·</span>
                          <span className="text-[10px] text-slate-500">{recipe.category}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {!hasNewRecipes && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <i className="ri-information-line text-xs text-slate-500"></i>
            <span className="text-[10px] text-slate-500">No new recipes on this page — check others!</span>
          </div>
        )}
      </div>

      {/* Footer link */}
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}
      >
        <Link
          to="/crafting-recipe-unlocks"
          onClick={handleDismiss}
          className="text-[10px] font-bold flex items-center gap-1 transition-colors hover:opacity-80 cursor-pointer whitespace-nowrap"
          style={{ color: newRank.color }}
        >
          <i className="ri-key-2-line"></i>
          View All Unlocks
          <i className="ri-arrow-right-line text-[9px]"></i>
        </Link>
        <span className="text-[10px] text-slate-600">Rank {newRank.rank} of 10</span>
      </div>

      {/* Countdown drain bar */}
      <div className="h-0.5 w-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div
          className="h-full"
          style={{
            background: newRank.color,
            animation: 'recipe-unlock-drain 7s linear forwards',
            transformOrigin: 'left',
          }}
        />
      </div>

      <style>{`
        @keyframes recipe-unlock-drain {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}