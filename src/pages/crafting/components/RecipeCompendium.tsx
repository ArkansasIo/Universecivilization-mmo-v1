import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useRecipeUnlocks, RECIPE_UNLOCK_TABLE } from '@/hooks/useRecipeUnlocks';
import { useCraftingRank, CRAFTING_TITLES } from '@/hooks/useCraftingRank';

/* ─── Types ──────────────────────────────────────────────────────── */
interface WorkshopDef {
  id: 'forge' | 'laboratory' | 'artifacts';
  label: string;
  sublabel: string;
  path: string;
  icon: string;
  ringColor: string;
  glowColor: string;
  bgGrad: string;
  borderColor: string;
}

const WORKSHOPS: WorkshopDef[] = [
  {
    id: 'forge',
    label: 'Crafting Forge',
    sublabel: 'Weapons · Armor · Modules',
    path: '/crafting-forge',
    icon: 'ri-fire-fill',
    ringColor: '#f97316',
    glowColor: '#f9731640',
    bgGrad: 'from-orange-900/20 to-amber-900/10',
    borderColor: 'border-orange-500/30',
  },
  {
    id: 'laboratory',
    label: 'Augmentations Lab',
    sublabel: 'Neural · Combat · Utility',
    path: '/crafting-augmentations',
    icon: 'ri-body-scan-line',
    ringColor: '#d946ef',
    glowColor: '#d946ef40',
    bgGrad: 'from-fuchsia-900/20 to-purple-900/10',
    borderColor: 'border-fuchsia-500/30',
  },
  {
    id: 'artifacts',
    label: 'Artifact Workshop',
    sublabel: 'Legendary · Mythic · Universal',
    path: '/crafting-artifacts',
    icon: 'ri-ancient-pavilion-line',
    ringColor: '#f59e0b',
    glowColor: '#f59e0b40',
    bgGrad: 'from-amber-900/20 to-yellow-900/10',
    borderColor: 'border-amber-500/30',
  },
];

/* ─── Animated SVG Ring ──────────────────────────────────────────── */
interface RingProps {
  pct: number;
  color: string;
  glow: string;
  size?: number;
  strokeW?: number;
  children?: React.ReactNode;
  animate?: boolean;
}

function ProgressRing({ pct, color, glow, size = 120, strokeW = 8, children, animate = true }: RingProps) {
  const [displayed, setDisplayed] = useState(animate ? 0 : pct);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!animate) { setDisplayed(pct); return; }
    const start = performance.now();
    const duration = 1200;
    const from = 0;
    const to = pct;

    const tick = (now: number) => {
      const elapsed = Math.min(now - start, duration);
      const t = elapsed / duration;
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(from + (to - from) * eased);
      if (elapsed < duration) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayed(to);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [pct, animate]);

  const r = (size - strokeW) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (displayed / 100) * circumference;
  const cx = size / 2;

  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeW}
        />
        {/* Progress */}
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            filter: `drop-shadow(0 0 6px ${glow})`,
            transition: animate ? undefined : 'stroke-dashoffset 0.6s ease',
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

/* ─── Rarity breakdown bar ───────────────────────────────────────── */
const RARITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic', 'Universal'];
const RARITY_COLORS: Record<string, string> = {
  Common: '#9ca3af',
  Uncommon: '#4ade80',
  Rare: '#22d3ee',
  Epic: '#d946ef',
  Legendary: '#f59e0b',
  Mythic: '#f43f5e',
  Universal: '#67e8f9',
};

/* ─── Mini rank milestone markers ───────────────────────────────── */
interface MilestoneProps {
  workshopId: 'forge' | 'laboratory' | 'artifacts';
  currentRank: number;
  color: string;
}

function MilestoneStrip({ workshopId, currentRank, color }: MilestoneProps) {
  const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <div className="flex items-center gap-0.5 mt-2">
      {ranks.map(r => {
        const hasUnlock = RECIPE_UNLOCK_TABLE.some(e => e.page === workshopId && e.minRank === r);
        const isReached = r <= currentRank;
        return (
          <div
            key={r}
            className="flex-1 h-1 rounded-full transition-all"
            style={{
              background: isReached
                ? hasUnlock ? color : `${color}50`
                : 'rgba(255,255,255,0.06)',
              boxShadow: isReached && hasUnlock ? `0 0 4px ${color}80` : 'none',
            }}
            title={`Rank ${r}${hasUnlock ? ' (recipe unlock)' : ''}`}
          />
        );
      })}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function RecipeCompendium() {
  const { allWithStatus, currentRank } = useRecipeUnlocks();
  const { nextRank, progressPct, spToNext, totalSpent } = useCraftingRank();
  const [animTriggered, setAnimTriggered] = useState(false);

  // Trigger ring animation on mount
  useEffect(() => {
    const t = setTimeout(() => setAnimTriggered(true), 150);
    return () => clearTimeout(t);
  }, []);

  const workshopStats = WORKSHOPS.map(ws => {
    const all = allWithStatus.filter(r => r.page === ws.id);
    const unlocked = all.filter(r => r.unlocked);
    const pct = all.length > 0 ? Math.round((unlocked.length / all.length) * 100) : 0;

    // Rarity breakdown of unlocked
    const byRarity: Record<string, number> = {};
    unlocked.forEach(r => { byRarity[r.rarity] = (byRarity[r.rarity] || 0) + 1; });

    // Next unlock
    const nextUnlock = all.filter(r => !r.unlocked).sort((a, b) => a.minRank - b.minRank)[0];

    return { ws, all, unlocked, pct, byRarity, nextUnlock };
  });

  const totalAll = allWithStatus.length;
  const totalUnlocked = allWithStatus.filter(r => r.unlocked).length;
  const totalPct = totalAll > 0 ? Math.round((totalUnlocked / totalAll) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 mb-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30">
            <i className="ri-book-open-line text-emerald-400 text-lg"></i>
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Recipe Compendium</h2>
            <p className="text-xs text-slate-500">Unlock progress across all workshops</p>
          </div>
        </div>
        <Link
          to="/crafting-recipe-unlocks"
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-key-2-line"></i>
          Full Registry
          <i className="ri-arrow-right-line text-[10px]"></i>
        </Link>
      </div>

      {/* Overall rank + progress bar */}
      <div
        className="rounded-2xl border p-5 mb-5"
        style={{
          background: `linear-gradient(135deg, ${currentRank.color}10 0%, rgba(8,13,26,0.9) 100%)`,
          borderColor: `${currentRank.color}35`,
        }}
      >
        <div className="flex items-center gap-5 flex-wrap">
          {/* Overall ring */}
          <ProgressRing
            pct={animTriggered ? totalPct : 0}
            color={currentRank.color}
            glow={currentRank.glowColor}
            size={96}
            strokeW={7}
            animate
          >
            <div className="text-center">
              <p className="text-xl font-black" style={{ color: currentRank.color }}>{totalPct}%</p>
              <p className="text-[9px] text-slate-500 leading-tight">TOTAL</p>
            </div>
          </ProgressRing>

          {/* Text info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <i className={`${currentRank.icon} text-base`} style={{ color: currentRank.color }}></i>
              <span className="text-sm font-black" style={{ color: currentRank.color }}>{currentRank.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold border" style={{ color: currentRank.color, borderColor: `${currentRank.color}40`, background: `${currentRank.color}15` }}>
                RANK {currentRank.rank}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">{totalUnlocked} of {totalAll} exclusive recipes unlocked · {totalAll - totalUnlocked} remaining</p>

            {/* Progress to next rank */}
            {nextRank && (
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span>Progress to <span style={{ color: nextRank.color }}>{nextRank.title}</span></span>
                  <span>{spToNext} SP needed · {totalSpent} spent</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%`, background: nextRank.color, boxShadow: `0 0 6px ${nextRank.color}60` }}
                  />
                </div>
                {/* Milestone markers */}
                <div className="flex items-center gap-1 mt-2 flex-wrap">
                  {CRAFTING_TITLES.map(t => (
                    <div
                      key={t.rank}
                      className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full"
                      style={{
                        background: t.rank <= currentRank.rank ? `${t.color}18` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${t.rank <= currentRank.rank ? `${t.color}40` : 'rgba(255,255,255,0.06)'}`,
                        color: t.rank <= currentRank.rank ? t.color : '#374151',
                      }}
                    >
                      <i className={`${t.icon} text-[8px]`}></i>
                      <span>R{t.rank}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!nextRank && (
              <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                <i className="ri-vip-crown-fill"></i>
                Grandmaster Artisan — All recipes available!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Per-workshop cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workshopStats.map(({ ws, all, unlocked, pct, byRarity, nextUnlock }) => (
          <div
            key={ws.id}
            className={`relative rounded-2xl border bg-gradient-to-br overflow-hidden ${ws.bgGrad} ${ws.borderColor}`}
            style={{ background: `linear-gradient(135deg, ${ws.ringColor}08 0%, rgba(8,13,26,0.95) 100%)` }}
          >
            {/* Card body */}
            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <i className={`${ws.icon} text-base`} style={{ color: ws.ringColor }}></i>
                    <h3 className="text-sm font-black text-white">{ws.label}</h3>
                  </div>
                  <p className="text-[10px] text-slate-500">{ws.sublabel}</p>
                </div>
                <Link
                  to={ws.path}
                  className="flex items-center justify-center w-7 h-7 rounded-lg transition-all cursor-pointer hover:opacity-80"
                  style={{ background: `${ws.ringColor}18`, border: `1px solid ${ws.ringColor}30` }}
                >
                  <i className="ri-arrow-right-line text-xs" style={{ color: ws.ringColor }}></i>
                </Link>
              </div>

              {/* Ring + numbers row */}
              <div className="flex items-center gap-4 mb-4">
                <ProgressRing
                  pct={animTriggered ? pct : 0}
                  color={ws.ringColor}
                  glow={ws.glowColor}
                  size={80}
                  strokeW={6}
                  animate
                >
                  <div className="text-center">
                    <p className="text-base font-black leading-none" style={{ color: ws.ringColor }}>{pct}%</p>
                  </div>
                </ProgressRing>

                <div className="flex-1">
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-2xl font-black text-white">{unlocked.length}</span>
                    <span className="text-sm text-slate-500 mb-0.5">/ {all.length}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">recipes unlocked</p>
                  <p className="text-[10px] font-bold mt-1" style={{ color: ws.ringColor }}>
                    {all.length - unlocked.length} locked
                  </p>
                </div>
              </div>

              {/* Rank milestone strip */}
              <MilestoneStrip
                workshopId={ws.id}
                currentRank={currentRank.rank}
                color={ws.ringColor}
              />

              {/* Rarity breakdown */}
              {unlocked.length > 0 && (
                <div className="mt-3">
                  <p className="text-[9px] text-slate-600 uppercase tracking-widest mb-1.5">Unlocked by Rarity</p>
                  <div className="flex flex-wrap gap-1.5">
                    {RARITY_ORDER.filter(r => byRarity[r] > 0).map(r => (
                      <span
                        key={r}
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          color: RARITY_COLORS[r],
                          background: `${RARITY_COLORS[r]}15`,
                          border: `1px solid ${RARITY_COLORS[r]}30`,
                        }}
                      >
                        {byRarity[r]}× {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Next unlock hint */}
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {nextUnlock ? (
                  <div className="flex items-start gap-2">
                    <i className="ri-lock-line text-xs text-slate-500 mt-0.5 flex-shrink-0"></i>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-500 leading-none mb-0.5">Next unlock</p>
                      <p className="text-[10px] font-bold text-slate-300 truncate">{nextUnlock.recipeName}</p>
                      <p className="text-[9px] flex items-center gap-1 mt-0.5">
                        {(() => {
                          const rd = CRAFTING_TITLES[nextUnlock.minRank - 1];
                          return (
                            <>
                              <i className={`${rd.icon} text-[9px]`} style={{ color: rd.color }}></i>
                              <span style={{ color: rd.color }}>{rd.title}</span>
                            </>
                          );
                        })()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <i className="ri-check-double-line text-xs text-emerald-400"></i>
                    <p className="text-[10px] font-bold text-emerald-400">All recipes unlocked!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom CTA */}
            <Link
              to={ws.path}
              className="block w-full py-2.5 text-center text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer hover:opacity-90"
              style={{
                background: `${ws.ringColor}15`,
                borderTop: `1px solid ${ws.ringColor}25`,
                color: ws.ringColor,
              }}
            >
              <i className={`${ws.icon} mr-1.5`}></i>
              Open Workshop
            </Link>
          </div>
        ))}
      </div>

      {/* Compact unlock timeline — next 3 unlocks across all workshops */}
      {(() => {
        const upcoming = allWithStatus
          .filter(r => !r.unlocked)
          .sort((a, b) => a.minRank - b.minRank)
          .slice(0, 4);

        if (upcoming.length === 0) return null;

        return (
          <div className="mt-4 rounded-xl border border-slate-700/50 bg-slate-900/40 p-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
              <i className="ri-route-line mr-1.5 text-emerald-400"></i>
              Upcoming Unlocks
            </p>
            <div className="flex flex-wrap gap-2">
              {upcoming.map(r => {
                const rd = CRAFTING_TITLES[r.minRank - 1];
                const ws = WORKSHOPS.find(w => w.id === r.page)!;
                return (
                  <div
                    key={r.recipeId}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border"
                    style={{ background: `${rd.color}08`, borderColor: `${rd.color}25` }}
                  >
                    <i className={`${r.icon} text-xs`} style={{ color: ws.ringColor }}></i>
                    <div>
                      <p className="text-[10px] font-bold text-white leading-tight">{r.recipeName}</p>
                      <p className="text-[9px] flex items-center gap-1" style={{ color: rd.color }}>
                        <i className={`${rd.icon} text-[8px]`}></i>
                        Rank {r.minRank} · {r.rarity}
                      </p>
                    </div>
                  </div>
                );
              })}
              {allWithStatus.filter(r => !r.unlocked).length > 4 && (
                <Link
                  to="/crafting-recipe-unlocks"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700/50 text-[10px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  +{allWithStatus.filter(r => !r.unlocked).length - 4} more
                  <i className="ri-arrow-right-line text-[9px]"></i>
                </Link>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}