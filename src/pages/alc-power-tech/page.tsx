import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAlcPowerResearch } from '@/hooks/useAlcPowerResearch';
import { useResources } from '@/hooks/useResources';
import {
  ALC_POWER_TECH_TREE,
  ALC_CATEGORIES,
  ALC_TIER_RANGES,
  getAlcTechCost,
  getAlcTechTime,
  type AlcTechCategory,
  type AlcTechDef,
} from '@/config/alcPowerTechTree';

type ViewMode = 'tier' | 'category' | 'tree';

const categoryOrder: AlcTechCategory[] = ['grid', 'reactors', 'transmission', 'stability', 'storage'];

function formatTime(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function TechCard({
  tech,
  currentLevel,
  activeResearch,
  isWorking,
  affordable,
  canStart,
  isLocked,
  lockReason,
  resources,
  onResearch,
}: {
  tech: AlcTechDef;
  currentLevel: number;
  activeResearch: boolean;
  isWorking: boolean;
  affordable: boolean;
  canStart: boolean;
  isLocked: boolean;
  lockReason?: string;
  resources: { metal: number; crystal: number; deuterium: number };
  onResearch: () => void;
}) {
  const nextLevel = currentLevel + 1;
  const cost = getAlcTechCost(tech.id, currentLevel);
  const time = getAlcTechTime(tech.id, currentLevel);
  const catInfo = ALC_CATEGORIES[tech.category];
  const tierInfo = ALC_TIER_RANGES.find(t => t.tier === tech.tier);

  return (
    <div
      className="rounded-xl overflow-hidden border transition-all hover:brightness-110"
      style={{
        background: '#080b0f',
        borderColor: activeResearch ? 'rgba(6,182,212,0.4)' : isLocked ? 'rgba(255,255,255,0.04)' : '#1e2a36',
        opacity: isLocked ? 0.5 : 1,
      }}
    >
      {/* Header */}
      <div className="p-3.5" style={{ borderBottom: '1px solid #1e2a36' }}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${tech.color}15` }}>
              <i className={`${tech.icon} text-base w-4 h-4 flex items-center justify-center`} style={{ color: tech.color }}></i>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">{tech.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: `${catInfo.color}15`, color: catInfo.color, fontSize: 9 }}>{catInfo.name}</span>
                {tierInfo && (
                  <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: `${tierInfo.color}15`, color: tierInfo.color, fontSize: 9 }}>T{tierInfo.tier}</span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-black" style={{ color: tech.color }}>Lv.{currentLevel}</span>
            <div className="text-xs" style={{ color: '#3a4557', fontSize: 9 }}>Max {tech.maxLevel}</div>
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: '#6b7a95' }}>{tech.description}</p>
      </div>

      {/* Body */}
      <div className="p-3.5">
        {/* Effects */}
        <div className="space-y-1 mb-3">
          {tech.effects.map((eff, i) => {
            const val = typeof eff.valuePerLevel === 'number' ? (eff.valuePerLevel * currentLevel) : 0;
            const nextVal = typeof eff.valuePerLevel === 'number' ? (eff.valuePerLevel * nextLevel) : 0;
            return (
              <div key={i} className="flex items-center justify-between text-xs">
                <span style={{ color: '#5a6577' }}>
                  <i className="ri-arrow-right-s-line w-3.5 h-3.5 inline-flex items-center justify-center" style={{ color: tech.color }}></i>
                  {eff.type.replace(/_/g, ' ')} ({eff.target})
                </span>
                <span style={{ color: currentLevel > 0 ? tech.color : '#3a4557' }}>
                  {currentLevel > 0 ? `${val}${eff.unit}` : '—'}
                  {currentLevel > 0 && nextLevel <= tech.maxLevel && (
                    <span style={{ color: '#22d3ee' }}> → {nextVal}{eff.unit}</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* Prerequisites */}
        {tech.requirements.research && tech.requirements.research.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tech.requirements.research.map((reqId, i) => {
              const req = ALC_POWER_TECH_TREE[reqId];
              return (
                <span key={i} className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(167,139,250,0.08)', color: '#a78bfa', fontSize: 9 }}>
                  ← {req?.name ?? reqId}
                </span>
              );
            })}
          </div>
        )}

        {/* Cost & Time */}
        <div className="rounded-lg p-3 mb-3" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
          <p className="text-xs mb-2" style={{ color: '#5a6577' }}>Research Level {nextLevel}:</p>
          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
            <div className="flex items-center gap-1">
              <i className="ri-copper-coin-line w-3.5 h-3.5 flex items-center justify-center" style={{ color: '#d4a853' }}></i>
              <span className={`font-semibold ${cost.metal > 0 && resources.metal < cost.metal ? 'text-red-400' : 'text-white'}`}>{cost.metal.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <i className="ri-sparkling-line w-3.5 h-3.5 flex items-center justify-center" style={{ color: '#5bc0be' }}></i>
              <span className={`font-semibold ${cost.crystal > 0 && resources.crystal < cost.crystal ? 'text-red-400' : 'text-white'}`}>{cost.crystal.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <i className="ri-drop-line w-3.5 h-3.5 flex items-center justify-center" style={{ color: '#7bc67e' }}></i>
              <span className={`font-semibold ${cost.deuterium > 0 && resources.deuterium < cost.deuterium ? 'text-red-400' : 'text-white'}`}>{cost.deuterium.toLocaleString()}</span>
            </div>
          </div>
          {(cost as any).darkMatter && (
            <div className="flex items-center gap-1 text-xs mb-2">
              <i className="ri-focus-2-line w-3.5 h-3.5 flex items-center justify-center" style={{ color: '#b98cd6' }}></i>
              <span className={`font-semibold ${(cost as any).darkMatter > 0 ? 'text-white' : ''}`}>{(cost as any).darkMatter.toLocaleString()} DM</span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: '#5a6577' }}>Research Time:</span>
            <span className="font-semibold" style={{ color: '#e2c044' }}>{formatTime(time)}</span>
          </div>
        </div>

        {/* Action Button */}
        {isLocked ? (
          <div className="w-full py-2 rounded-lg text-xs font-bold text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: '#5a6577' }}>
            <i className="ri-lock-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center"></i>
            {lockReason ?? 'Locked'}
          </div>
        ) : (
          <button
            onClick={onResearch}
            disabled={!canStart}
            className={`w-full py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${canStart ? 'text-white cursor-pointer hover:opacity-90' : 'cursor-not-allowed'}`}
            style={canStart ? { background: 'linear-gradient(90deg, #06b6d4, #22d3ee)' } : { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: '#5a6577' }}
          >
            {isWorking ? (<><i className="ri-loader-4-line animate-spin mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Starting...</>)
              : activeResearch ? (<><i className="ri-time-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Lab Busy</>)
                : !affordable ? (<><i className="ri-close-circle-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Insufficient Resources</>)
                  : (<><i className="ri-arrow-up-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Research Lv.{nextLevel}</>)}
          </button>
        )}
      </div>
    </div>
  );
}

export default function AlcPowerTechPage() {
  const {
    activeResearch,
    loading,
    getTechLevel,
    startAlcResearch,
    cancelAlcResearch,
    getTimeRemaining,
    getProgress,
    isTechUnlockable,
  } = useAlcPowerResearch();
  const { resources, canAfford, deductResources } = useResources();

  const [viewMode, setViewMode] = useState<ViewMode>('tier');
  const [activeTier, setActiveTier] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<AlcTechCategory | 'all'>('all');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [working, setWorking] = useState<string | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleResearch = useCallback(async (techId: string) => {
    const currentLevel = getTechLevel(techId);
    const cost = getAlcTechCost(techId, currentLevel);
    const time = getAlcTechTime(techId, currentLevel);
    if (!canAfford(cost)) { showToast('Insufficient resources!', 'error'); return; }
    setWorking(techId);
    try {
      const deducted = await deductResources(cost);
      if (!deducted) { showToast('Failed to deduct resources', 'error'); return; }
      const result = await startAlcResearch(techId, currentLevel, time, cost);
      if (result.success) {
        const def = ALC_POWER_TECH_TREE[techId];
        showToast(`Researching ${def?.name ?? techId} Level ${currentLevel + 1} — ${formatTime(time)}`);
      } else {
        showToast(result.error ?? 'Failed to start research', 'error');
      }
    } finally { setWorking(null); }
  }, [getTechLevel, canAfford, deductResources, startAlcResearch]);

  const handleCancel = async () => {
    const result = await cancelAlcResearch();
    if (result.success) showToast('Research cancelled — resources refunded');
    else showToast(result.error ?? 'Failed to cancel', 'error');
  };

  const timeLeft = getTimeRemaining();
  const progress = getProgress();

  const activeDef = activeResearch ? ALC_POWER_TECH_TREE[activeResearch.tech_id] : null;

  // Filter techs based on view mode
  const visibleTechs = (() => {
    let techs: AlcTechDef[] = Object.values(ALC_POWER_TECH_TREE);
    if (viewMode === 'tier') {
      techs = techs.filter(t => t.tier === activeTier);
    }
    if (activeCategory !== 'all') {
      techs = techs.filter(t => t.category === activeCategory);
    }
    if (viewMode === 'tree') {
      return techs.sort((a, b) => a.tier - b.tier || categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));
    }
    return techs.sort((a, b) => a.tier - b.tier || categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));
  })();

  return (
    <div style={{ color: '#8892aa' }}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-xs font-semibold transition-all max-w-sm"
          style={{ background: 'linear-gradient(135deg, #111922, #1a2035)', border: `1px solid ${toast.type === 'error' ? 'rgba(248,113,113,0.5)' : 'rgba(6,182,212,0.4)'}`, color: toast.type === 'error' ? '#f87171' : '#06b6d4' }}>
          <i className={`${toast.type === 'error' ? 'ri-error-warning-line' : 'ri-information-line'} mr-2 w-3.5 h-3.5 inline-flex items-center justify-center`}></i>{toast.msg}
        </div>
      )}

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <div className="absolute inset-0">
          <img
            src="https://readdy.ai/api/search-image?query=futuristic%20power%20core%20chamber%20glowing%20energy%20reactors%20cyan%20blue%20plasma%20arcs%20sci-fi%20power%20generation%20industrial%20complex%20holographic%20grid%20overlay%20neon%20lighting%20dramatic%20cinematic%20art&width=1920&height=600&seq=alc_power_hero&orientation=landscape"
            alt="ALC Power Systems"
            className="w-full h-full object-cover object-top"
            style={{ filter: 'brightness(0.4) saturate(1.2)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(7,10,16,0.95) 100%)' }} />
        </div>
        <div className="relative z-10 h-full flex items-end px-6 pb-5">
          <div className="flex items-end justify-between w-full">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded font-bold tracking-wider" style={{ background: 'rgba(6,182,212,0.15)', color: '#06b6d4' }}>ALC SYSTEMS</span>
                <span className="text-xs px-2 py-0.5 rounded font-bold tracking-wider" style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}>ENDFIELD PROTOCOL</span>
              </div>
              <h1 className="text-3xl font-black text-white mb-1 tracking-tight">ALC Power Tech Tree</h1>
              <p className="text-sm" style={{ color: '#5a6577' }}>Research and unlock Arknights Limited Company power technologies</p>
            </div>
            <Link
              to="/power-grid"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all hover:brightness-110"
              style={{ background: 'rgba(6,182,212,0.1)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.25)' }}
            >
              <i className="ri-flashlight-line"></i>
              Open Power Grid
            </Link>
          </div>
        </div>
      </div>

      {/* Active Research Banner */}
      {activeResearch && activeDef && (
        <div className="mx-5 mt-4 p-4 rounded-xl" style={{ background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.2)' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <i className="ri-flask-line text-lg w-5 h-5 flex items-center justify-center" style={{ color: '#06b6d4' }}></i>
              <div>
                <p className="text-sm font-bold text-white">Researching: {activeDef.name} Level {activeResearch.level}</p>
                <p className="text-xs" style={{ color: '#5a6577' }}>Time remaining: <span className="font-mono" style={{ color: '#22d3ee' }}>{formatTime(timeLeft)}</span></p>
              </div>
            </div>
            <button onClick={handleCancel} className="text-xs px-3 py-1.5 rounded cursor-pointer whitespace-nowrap font-bold transition-all"
              style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
              <i className="ri-close-line mr-1 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Cancel
            </button>
          </div>
          <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-1.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #06b6d4, #22d3ee)' }} />
          </div>
        </div>
      )}

      {/* View Mode & Filters */}
      <div className="px-5 py-3 flex flex-col gap-3" style={{ borderBottom: '1px solid #1e2a36', background: 'rgba(0,0,0,0.15)' }}>
        {/* View Mode Tabs */}
        <div className="flex items-center gap-2">
          {([
            { id: 'tier' as const, label: 'By Tier', icon: 'ri-stairs-line' },
            { id: 'category' as const, label: 'By Category', icon: 'ri-apps-2-line' },
            { id: 'tree' as const, label: 'Tree View', icon: 'ri-git-branch-line' },
          ]).map(mode => (
            <button key={mode.id} onClick={() => { setViewMode(mode.id); setActiveTier(1); setActiveCategory('all'); }}
              className={`px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap cursor-pointer transition-all ${viewMode === mode.id ? 'text-white' : ''}`}
              style={viewMode === mode.id
                ? { background: 'linear-gradient(90deg, #06b6d4, #22d3ee)' }
                : { background: 'rgba(255,255,255,0.02)', border: '1px solid #1e2a36', color: '#5a6577' }}>
              <i className={`${mode.icon} mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center`}></i>{mode.label}
            </button>
          ))}
        </div>

        {/* Tier Filter (for tier view) */}
        {viewMode === 'tier' && (
          <div className="flex items-center gap-2 overflow-x-auto">
            {ALC_TIER_RANGES.map(tr => (
              <button key={tr.tier} onClick={() => setActiveTier(tr.tier)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap cursor-pointer transition-all ${activeTier === tr.tier ? 'text-white' : ''}`}
                style={activeTier === tr.tier
                  ? { background: tr.color }
                  : { background: 'rgba(255,255,255,0.02)', border: '1px solid #1e2a36', color: '#5a6577' }}>
                T{tr.tier} · {tr.label}
              </button>
            ))}
          </div>
        )}

        {/* Category Filter */}
        {viewMode !== 'tree' && (
          <div className="flex items-center gap-2 overflow-x-auto">
            <button onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap cursor-pointer transition-all ${activeCategory === 'all' ? 'text-white' : ''}`}
              style={activeCategory === 'all'
                ? { background: '#06b6d4' }
                : { background: 'rgba(255,255,255,0.02)', border: '1px solid #1e2a36', color: '#5a6577' }}>
              All
            </button>
            {categoryOrder.map(cat => {
              const info = ALC_CATEGORIES[cat];
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap cursor-pointer transition-all ${activeCategory === cat ? 'text-white' : ''}`}
                  style={activeCategory === cat
                    ? { background: info.color }
                    : { background: 'rgba(255,255,255,0.02)', border: '1px solid #1e2a36', color: '#5a6577' }}>
                  <i className={`${info.icon} mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center`}></i>{info.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="px-5 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-sm animate-pulse" style={{ color: '#5a6577' }}>Loading ALC power research data...</div>
          </div>
        ) : visibleTechs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <i className="ri-flashlight-line text-4xl mb-3" style={{ color: '#3a4557' }}></i>
            <p className="text-sm" style={{ color: '#5a6577' }}>No technologies found for this filter.</p>
          </div>
        ) : viewMode === 'tree' ? (
          /* Tree View — grouped by tier */
          <div className="space-y-6">
            {ALC_TIER_RANGES.map(tr => {
              const tierTechs = visibleTechs.filter(t => t.tier === tr.tier);
              if (tierTechs.length === 0) return null;
              return (
                <div key={tr.tier}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1.5 h-6 rounded-full" style={{ background: tr.color }}></div>
                    <h2 className="text-sm font-bold tracking-wider" style={{ color: tr.color }}>TIER {tr.tier} — {tr.label.toUpperCase()}</h2>
                    <div className="flex-1 h-px" style={{ background: `${tr.color}20` }}></div>
                  </div>
                  {tierTechs.length > 0 && (
                    <div className="relative">
                      {/* Vertical connector line */}
                      <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.04)' }}></div>
                      <div className="space-y-2 pl-8">
                        {tierTechs.map(tech => {
                          const lvl = getTechLevel(tech.id);
                          const unlockStatus = isTechUnlockable(tech.id);
                          const isLocked = lvl === 0 && !unlockStatus.unlockable;
                          return (
                            <div key={tech.id} className="flex items-center gap-3 p-2.5 rounded-lg transition-all hover:bg-white/5"
                              style={{ background: lvl > 0 ? `${tech.color}06` : 'rgba(255,255,255,0.01)' }}>
                              <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0" style={{ background: `${tech.color}15` }}>
                                <i className={`${tech.icon} text-xs w-3 h-3 flex items-center justify-center`} style={{ color: tech.color }}></i>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-white truncate">{tech.name}</span>
                                  <span className="text-xs font-bold" style={{ color: tech.color }}>Lv.{lvl}</span>
                                  {isLocked && <i className="ri-lock-line text-xs" style={{ color: '#5a6577' }}></i>}
                                </div>
                                <div className="text-xs" style={{ color: '#3a4557', fontSize: 9 }}>{catLabel(tech.category)} · T{tech.tier}</div>
                              </div>
                              <Link
                                to={`/alc-power-tech?focus=${tech.id}`}
                                onClick={(e) => { e.preventDefault(); }}
                                className="text-xs px-2 py-1 rounded cursor-pointer whitespace-nowrap font-bold transition-all"
                                style={{ background: `${tech.color}10`, color: tech.color, border: `1px solid ${tech.color}20` }}
                              >
                                {isLocked ? 'Locked' : lvl >= tech.maxLevel ? 'Maxed' : 'Research'}
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Card Grid View (tier or category) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {visibleTechs.map(tech => {
              const currentLevel = getTechLevel(tech.id);
              const isAtMax = currentLevel >= tech.maxLevel;
              const cost = getAlcTechCost(tech.id, currentLevel);
              const affordable = canAfford(cost) && !isAtMax;
              const isActive = activeResearch?.tech_id === tech.id;
              const isWorking = working === tech.id;
              const canStart = !activeResearch && affordable && !isWorking && !isAtMax;
              const unlockStatus = isTechUnlockable(tech.id);
              const isLocked = currentLevel === 0 && !unlockStatus.unlockable;

              if (isAtMax) return null;

              return (
                <TechCard
                  key={tech.id}
                  tech={tech}
                  currentLevel={currentLevel}
                  activeResearch={isActive}
                  isWorking={isWorking}
                  affordable={affordable}
                  canStart={canStart}
                  isLocked={isLocked}
                  lockReason={unlockStatus.reason}
                  resources={resources as any}
                  onResearch={() => handleResearch(tech.id)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Legend / Stats Footer */}
      <div className="px-5 py-4" style={{ borderTop: '1px solid #1e2a36' }}>
        <div className="flex items-center gap-4 text-xs" style={{ color: '#3a4557' }}>
          <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 mr-1"></span> Researchable</span>
          <span><span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: '#06b6d4' }} mr-1></span> In Progress</span>
          <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-600 mr-1"></span> Locked</span>
          <span className="ml-auto">{Object.values(ALC_POWER_TECH_TREE).length} technologies · 6 tiers · 5 categories</span>
        </div>
      </div>
    </div>
  );
}

function catLabel(cat: string): string {
  const map: Record<string, string> = {
    grid: 'Grid Ops',
    reactors: 'Reactors',
    transmission: 'Transmission',
    stability: 'Safety',
    storage: 'Storage',
  };
  return map[cat] ?? cat;
}
