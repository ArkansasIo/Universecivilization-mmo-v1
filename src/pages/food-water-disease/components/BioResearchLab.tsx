import { useState, useEffect, useRef, useCallback } from 'react';
import {
  BIO_RESEARCH_TREE,
  RESEARCH_CATEGORY_CONFIG,
  DISEASES,
  computeBioResearchEffects,
  type BioResearch,
  type BioResearchState,
  type ResearchCategory,
} from '@/data/foodWaterDisease';

// ─── helpers ─────────────────────────────────────────────────────────────────

function isAvailable(research: BioResearch, completedIds: string[]): boolean {
  if (!research.requiresResearch || research.requiresResearch.length === 0) return true;
  return research.requiresResearch.every(id => completedIds.includes(id));
}

function getStatus(
  research: BioResearch,
  state: BioResearchState
): 'locked' | 'available' | 'researching' | 'completed' {
  if (state.completedIds.includes(research.id)) return 'completed';
  if (state.researchingId === research.id) return 'researching';
  if (isAvailable(research, state.completedIds)) return 'available';
  return 'locked';
}

const TIER_LABELS = ['', 'Foundation', 'Advanced', 'Elite'];
const TIER_COLORS = ['', '#4ade80', '#38bdf8', '#fbbf24'];

// ─── Props ────────────────────────────────────────────────────────────────────

export interface BioResearchLabProps {
  researchState: BioResearchState;
  onStartResearch: (id: string) => void;
  onCompleteResearch: (id: string) => void;
}

// ─── Research Confirm Modal ───────────────────────────────────────────────────

function ResearchModal({
  research,
  onConfirm,
  onClose,
}: {
  research: BioResearch;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const immuneDiseases = research.immunityAgainst
    ? DISEASES.filter(d => research.immunityAgainst!.includes(d.id))
    : [];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="rounded-2xl w-full max-w-xl overflow-hidden"
        style={{ background: '#07100f', border: `2px solid ${research.color}50` }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center gap-4"
          style={{ background: `linear-gradient(90deg, ${research.color}18 0%, transparent 100%)`, borderBottom: `1px solid ${research.color}30` }}
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${research.color}18`, border: `1px solid ${research.color}40` }}
          >
            <i className={`${research.icon} text-2xl`} style={{ color: research.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-white">{research.name}</h3>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: `${TIER_COLORS[research.tier]}18`, color: TIER_COLORS[research.tier], border: `1px solid ${TIER_COLORS[research.tier]}35` }}
              >
                Tier {research.tier} — {TIER_LABELS[research.tier]}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{research.description}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Image */}
          <div className="relative h-36 rounded-xl overflow-hidden">
            <img src={research.image} alt={research.name} className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(7,16,15,0.8))' }} />
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">{research.longDesc}</p>

          {/* Effects grid */}
          <div className="grid grid-cols-2 gap-2">
            {immuneDiseases.length > 0 && (
              <div
                className="col-span-2 rounded-lg p-3"
                style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)' }}
              >
                <p className="text-xs font-bold text-green-400 mb-2 flex items-center gap-1.5">
                  <i className="ri-shield-check-line" />Grants Permanent Immunity
                </p>
                <div className="flex flex-wrap gap-2">
                  {immuneDiseases.map(d => (
                    <span
                      key={d.id}
                      className="text-xs flex items-center gap-1.5 px-2 py-1 rounded-lg"
                      style={{ background: `${d.color}15`, border: `1px solid ${d.color}35`, color: d.color }}
                    >
                      <i className={d.icon} />{d.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {[
              research.spreadRateMod != null && { label: 'Spread Rate', value: `-${((1 - research.spreadRateMod) * 100).toFixed(0)}%`, color: '#f87171', icon: 'ri-virus-line' },
              research.mortalityMod != null && { label: 'Mortality', value: `-${((1 - research.mortalityMod) * 100).toFixed(0)}%`, color: '#c084fc', icon: 'ri-heart-pulse-line' },
              research.sanitationBonus != null && { label: 'Sanitation', value: `+${research.sanitationBonus} pts`, color: '#38bdf8', icon: 'ri-sparkling-2-line' },
              research.productivityBonus != null && { label: 'Productivity', value: `+${research.productivityBonus}%`, color: '#4ade80', icon: 'ri-bar-chart-2-line' },
            ].filter(Boolean).map((e: any) => (
              <div key={e.label} className="rounded-lg px-3 py-2 flex items-center gap-2" style={{ background: `${e.color}0d`, border: `1px solid ${e.color}22` }}>
                <i className={`${e.icon} text-sm`} style={{ color: e.color }} />
                <div>
                  <p className="text-xs font-black" style={{ color: e.color }}>{e.value}</p>
                  <p className="text-xs text-gray-500">{e.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Costs */}
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1.5">
              <i className="ri-coins-line" />Research Cost &amp; Duration
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              {research.costMetal > 0 && (
                <span className="text-xs flex items-center gap-1 px-2 py-1 rounded" style={{ background: 'rgba(252,211,77,0.1)', color: '#fcd34d', border: '1px solid rgba(252,211,77,0.25)' }}>
                  <i className="ri-copper-coin-line" />{research.costMetal.toLocaleString()} Metal
                </span>
              )}
              {research.costCrystal > 0 && (
                <span className="text-xs flex items-center gap-1 px-2 py-1 rounded" style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}>
                  <i className="ri-drop-line" />{research.costCrystal.toLocaleString()} Crystal
                </span>
              )}
              {research.costDeuterium > 0 && (
                <span className="text-xs flex items-center gap-1 px-2 py-1 rounded" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>
                  <i className="ri-drop-line" />{research.costDeuterium.toLocaleString()} Deuterium
                </span>
              )}
              {research.costCredits > 0 && (
                <span className="text-xs flex items-center gap-1 px-2 py-1 rounded" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}>
                  <i className="ri-coins-line" />{research.costCredits.toLocaleString()} Credits
                </span>
              )}
              <span className="text-xs flex items-center gap-1 px-2 py-1 rounded ml-auto" style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.25)' }}>
                <i className="ri-time-line" />{research.researchTimeSecs}s research time
              </span>
            </div>
          </div>

          {research.discoveredBy && (
            <p className="text-xs text-gray-600 italic">
              <i className="ri-flask-line mr-1" />Research attributed to: <span className="text-gray-500">{research.discoveredBy}</span>
            </p>
          )}
          {research.labRequired && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', color: '#fbbf24' }}>
              <i className="ri-building-2-line text-sm" />
              <span className="text-xs">Requires: <strong>{research.labRequired}</strong></span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl text-sm font-black cursor-pointer whitespace-nowrap transition-all hover:scale-[1.02]"
              style={{ background: `${research.color}20`, border: `2px solid ${research.color}55`, color: research.color }}
            >
              <span className="flex items-center justify-center gap-2">
                <i className="ri-flask-line" />Begin Research
              </span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm text-gray-400 cursor-pointer whitespace-nowrap transition-all hover:bg-white/5"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Research Card ────────────────────────────────────────────────────────────

function ResearchCard({
  research,
  status,
  progressPct,
  secsLeft,
  onStartResearch,
}: {
  research: BioResearch;
  status: 'locked' | 'available' | 'researching' | 'completed';
  progressPct: number;
  secsLeft: number;
  onStartResearch: (r: BioResearch) => void;
}) {
  const [showDetail, setShowDetail] = useState(false);
  const immuneDiseases = research.immunityAgainst
    ? DISEASES.filter(d => research.immunityAgainst!.includes(d.id))
    : [];

  const borderColor =
    status === 'completed' ? `${research.color}55` :
    status === 'researching' ? `${research.color}80` :
    status === 'available' ? `${research.color}35` :
    'rgba(255,255,255,0.06)';

  const bgColor =
    status === 'completed' ? `${research.color}0c` :
    status === 'researching' ? `${research.color}0f` :
    status === 'available' ? 'rgba(10,15,30,0.9)' :
    'rgba(8,12,22,0.85)';

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{ border: `1px solid ${borderColor}`, background: bgColor, opacity: status === 'locked' ? 0.55 : 1 }}
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        <img src={research.image} alt={research.name} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(8,12,22,0.92) 100%)' }} />

        {/* Status badges */}
        <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-bold"
            style={{ background: `${TIER_COLORS[research.tier]}20`, color: TIER_COLORS[research.tier], border: `1px solid ${TIER_COLORS[research.tier]}40` }}
          >
            T{research.tier} {TIER_LABELS[research.tier]}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize"
            style={{ background: `${research.color}15`, color: research.color, border: `1px solid ${research.color}35` }}
          >
            {RESEARCH_CATEGORY_CONFIG[research.category].label}
          </span>
        </div>

        <div className="absolute top-2 right-2">
          {status === 'completed' && (
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${research.color}25`, border: `1px solid ${research.color}55` }}>
              <i className="ri-check-fill text-sm" style={{ color: research.color }} />
            </div>
          )}
          {status === 'locked' && (
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <i className="ri-lock-line text-sm text-gray-500" />
            </div>
          )}
          {status === 'researching' && (
            <div className="w-7 h-7 rounded-full flex items-center justify-center animate-spin" style={{ background: `${research.color}20`, border: `1px solid ${research.color}55` }}>
              <i className="ri-loader-4-line text-sm" style={{ color: research.color }} />
            </div>
          )}
        </div>

        <div className="absolute bottom-2 left-3">
          <p className="text-sm font-black text-white">{research.name}</p>
          <p className="text-xs text-gray-400">{research.description}</p>
        </div>
      </div>

      <div className="p-3 space-y-2.5">
        {/* Progress bar (researching) */}
        {status === 'researching' && (
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-bold" style={{ color: research.color }}>Researching...</span>
              <span className="text-xs font-black" style={{ color: research.color }}>{Math.floor(secsLeft / 60)}:{String(secsLeft % 60).padStart(2, '0')} left</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-2 rounded-full transition-all duration-1000"
                style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${research.color}aa, ${research.color})` }}
              />
            </div>
          </div>
        )}

        {/* Immunity grants */}
        {immuneDiseases.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {immuneDiseases.map(d => (
              <span
                key={d.id}
                className="text-xs flex items-center gap-1 px-1.5 py-0.5 rounded"
                style={{
                  background: status === 'completed' ? `${d.color}18` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${status === 'completed' ? `${d.color}40` : 'rgba(255,255,255,0.08)'}`,
                  color: status === 'completed' ? d.color : '#4b5563',
                }}
              >
                <i className={d.icon} />{d.name} {status === 'completed' ? 'IMMUNE' : 'immunity'}
              </span>
            ))}
          </div>
        )}

        {/* Effects row */}
        <div className="flex flex-wrap gap-1.5">
          {research.spreadRateMod != null && (
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171' }}>
              -{((1 - research.spreadRateMod) * 100).toFixed(0)}% Spread
            </span>
          )}
          {research.mortalityMod != null && (
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(192,132,252,0.1)', color: '#c084fc' }}>
              -{((1 - research.mortalityMod) * 100).toFixed(0)}% Mortality
            </span>
          )}
          {research.sanitationBonus != null && (
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8' }}>
              +{research.sanitationBonus} Sanit.
            </span>
          )}
          {research.productivityBonus != null && (
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>
              +{research.productivityBonus}% Prod.
            </span>
          )}
        </div>

        {/* Prerequisites */}
        {status === 'locked' && research.requiresResearch && (
          <div className="flex items-start gap-1.5 px-2 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}>
            <i className="ri-lock-line flex-shrink-0 mt-0.5" />
            <span>Requires: {research.requiresResearch.map(id => BIO_RESEARCH_TREE.find(r => r.id === id)?.name ?? id).join(', ')}</span>
          </div>
        )}

        {/* Cost line */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {research.costMetal > 0 && (
            <span className="text-xs text-gray-500"><i className="ri-copper-coin-line mr-0.5" style={{ color: '#fcd34d' }} />{(research.costMetal / 1000).toFixed(0)}k M</span>
          )}
          {research.costCrystal > 0 && (
            <span className="text-xs text-gray-500"><i className="ri-drop-line mr-0.5" style={{ color: '#60a5fa' }} />{(research.costCrystal / 1000).toFixed(0)}k C</span>
          )}
          {research.costDeuterium > 0 && (
            <span className="text-xs text-gray-500"><i className="ri-drop-line mr-0.5" style={{ color: '#4ade80' }} />{(research.costDeuterium / 1000).toFixed(0)}k D</span>
          )}
          {research.costCredits > 0 && (
            <span className="text-xs text-gray-500"><i className="ri-coins-line mr-0.5" style={{ color: '#fbbf24' }} />{(research.costCredits / 1000).toFixed(0)}k Cr</span>
          )}
          <span className="text-xs text-gray-600 ml-auto"><i className="ri-time-line mr-0.5" />{research.researchTimeSecs}s</span>
        </div>

        {/* Action button */}
        {status === 'available' && (
          <button
            onClick={() => onStartResearch(research)}
            className="w-full py-2 rounded-lg text-xs font-black cursor-pointer whitespace-nowrap transition-all hover:scale-[1.02]"
            style={{ background: `${research.color}18`, border: `1px solid ${research.color}45`, color: research.color }}
          >
            <i className="ri-flask-fill mr-1.5" />Begin Research
          </button>
        )}
        {status === 'completed' && (
          <div
            className="w-full py-2 rounded-lg text-xs font-bold text-center"
            style={{ background: `${research.color}0f`, border: `1px solid ${research.color}35`, color: research.color }}
          >
            <i className="ri-check-double-line mr-1.5" />Research Complete
          </div>
        )}
        {status === 'researching' && (
          <div
            className="w-full py-2 rounded-lg text-xs font-bold text-center animate-pulse"
            style={{ background: `${research.color}0f`, border: `1px solid ${research.color}35`, color: research.color }}
          >
            <i className="ri-loader-4-line animate-spin mr-1.5" />In Progress...
          </div>
        )}
        {status === 'locked' && (
          <div
            className="w-full py-2 rounded-lg text-xs font-bold text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#374151' }}
          >
            <i className="ri-lock-line mr-1.5" />Locked
          </div>
        )}

        {/* Expand detail toggle */}
        <button
          onClick={() => setShowDetail(v => !v)}
          className="text-xs text-gray-600 cursor-pointer hover:text-gray-400 transition-all w-full text-center"
        >
          {showDetail ? '▲ Hide details' : '▼ View full details'}
        </button>

        {showDetail && (
          <div
            className="rounded-lg p-3 space-y-2 text-xs"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="text-gray-300 leading-relaxed">{research.longDesc}</p>
            {research.unlocksResearch && research.unlocksResearch.length > 0 && (
              <div className="flex items-start gap-2">
                <i className="ri-arrow-right-line text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Unlocks: <span className="text-cyan-400">{research.unlocksResearch.map(id => BIO_RESEARCH_TREE.find(r => r.id === id)?.name ?? id).join(', ')}</span></span>
              </div>
            )}
            {research.discoveredBy && (
              <p className="text-gray-600 italic">By: {research.discoveredBy}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tech Tree Diagram ────────────────────────────────────────────────────────

function TechTreeView({
  researchState,
  onStartResearch,
}: {
  researchState: BioResearchState;
  onStartResearch: (r: BioResearch) => void;
}) {
  const tiers = [1, 2, 3];

  return (
    <div className="space-y-6">
      {tiers.map(tier => {
        const tierResearch = BIO_RESEARCH_TREE.filter(r => r.tier === tier);
        return (
          <div key={tier}>
            {/* Tier header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${TIER_COLORS[tier]}40, transparent)` }} />
              <div
                className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-black"
                style={{ background: `${TIER_COLORS[tier]}15`, border: `1px solid ${TIER_COLORS[tier]}40`, color: TIER_COLORS[tier] }}
              >
                <i className={tier === 1 ? 'ri-seedling-line' : tier === 2 ? 'ri-test-tube-line' : 'ri-award-line'} />
                Tier {tier} — {TIER_LABELS[tier]}
              </div>
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, ${TIER_COLORS[tier]}40, transparent)` }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {tierResearch.map(research => {
                const status = getStatus(research, researchState);
                const isRes = researchState.researchingId === research.id;
                const progressPct = isRes && researchState.researchStartTime
                  ? Math.min(100, ((Date.now() - researchState.researchStartTime) / (research.researchTimeSecs * 1000)) * 100)
                  : 0;
                const secsLeft = isRes && researchState.researchStartTime
                  ? Math.max(0, Math.ceil(research.researchTimeSecs - (Date.now() - researchState.researchStartTime) / 1000))
                  : 0;

                return (
                  <ResearchCard
                    key={research.id}
                    research={research}
                    status={status}
                    progressPct={progressPct}
                    secsLeft={secsLeft}
                    onStartResearch={onStartResearch}
                  />
                );
              })}
            </div>

            {tier < 3 && (
              <div className="flex items-center justify-center mt-5">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-px h-4" style={{ background: `${TIER_COLORS[tier + 1]}50` }} />
                  <i className="ri-arrow-down-line text-sm" style={{ color: `${TIER_COLORS[tier + 1]}80` }} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Active Research Timer ────────────────────────────────────────────────────

function ActiveResearchBanner({
  researchState,
  now,
  onComplete,
}: {
  researchState: BioResearchState;
  now: number;
  onComplete: (id: string) => void;
}) {
  const research = BIO_RESEARCH_TREE.find(r => r.id === researchState.researchingId);
  if (!research || !researchState.researchStartTime) return null;

  const elapsed = (now - researchState.researchStartTime) / 1000;
  const pct = Math.min(100, (elapsed / research.researchTimeSecs) * 100);
  const secsLeft = Math.max(0, Math.ceil(research.researchTimeSecs - elapsed));

  // Trigger completion
  if (secsLeft === 0) {
    onComplete(research.id);
  }

  return (
    <div
      className="rounded-xl px-5 py-4 flex items-center gap-4"
      style={{ background: `${research.color}0e`, border: `2px solid ${research.color}40` }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse"
        style={{ background: `${research.color}18`, border: `1px solid ${research.color}50` }}
      >
        <i className={`${research.icon} text-xl animate-spin`} style={{ color: research.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
          <p className="text-sm font-black text-white">{research.name}</p>
          <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: `${research.color}18`, color: research.color, border: `1px solid ${research.color}35` }}>
            RESEARCHING
          </span>
          <span className="text-xs font-black ml-auto" style={{ color: research.color }}>
            {Math.floor(secsLeft / 60)}:{String(secsLeft % 60).padStart(2, '0')} remaining
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-2.5 rounded-full transition-all duration-1000"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${research.color}aa, ${research.color})` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{research.description}</p>
      </div>
    </div>
  );
}

// ─── Empire Effects Summary ───────────────────────────────────────────────────

function EmpireEffectsSummary({ completedIds }: { completedIds: string[] }) {
  const effects = computeBioResearchEffects(completedIds);
  const completedCount = completedIds.length;
  const totalCount = BIO_RESEARCH_TREE.length;
  const immuneDiseases = DISEASES.filter(d => effects.immuneDiseasIds.includes(d.id));

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(0,212,255,0.15)' }}
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <i className="ri-bar-chart-2-line text-cyan-400" />Empire Bio-Research Status
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{completedCount} of {totalCount} research projects completed</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)' }}>
          <i className="ri-flask-fill text-cyan-400 text-sm" />
          <span className="text-sm font-bold text-cyan-400">{completedCount}/{totalCount} Completed</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / totalCount) * 100}%`, background: 'linear-gradient(90deg, #38bdf8, #4ade80, #fbbf24)' }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-600">0%</span>
          <span className="text-xs text-gray-400 font-semibold">{Math.round((completedCount / totalCount) * 100)}% complete</span>
          <span className="text-xs text-gray-600">100%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Spread Rate Modifier', value: `×${effects.spreadRateMod.toFixed(2)}`, sub: `${((1 - effects.spreadRateMod) * 100).toFixed(0)}% reduction`, color: '#f87171', icon: 'ri-virus-line' },
          { label: 'Mortality Modifier', value: `×${effects.mortalityMod.toFixed(2)}`, sub: `${((1 - effects.mortalityMod) * 100).toFixed(0)}% reduction`, color: '#c084fc', icon: 'ri-heart-pulse-line' },
          { label: 'Sanitation Bonus', value: `+${effects.sanitationBonus}`, sub: 'Empire-wide flat bonus', color: '#38bdf8', icon: 'ri-sparkling-2-line' },
          { label: 'Productivity Bonus', value: `+${effects.productivityBonus}%`, sub: 'Empire-wide output boost', color: '#4ade80', icon: 'ri-bar-chart-2-line' },
        ].map(s => (
          <div key={s.label} className="rounded-lg px-3 py-2.5" style={{ background: `${s.color}0d`, border: `1px solid ${s.color}22` }}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <i className={`${s.icon} text-xs`} style={{ color: s.color }} />
              <span className="text-xs text-gray-400">{s.label}</span>
            </div>
            <p className="text-base font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Immunity status */}
      <div>
        <p className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1.5">
          <i className="ri-shield-check-line text-green-400" />Disease Immunity Status
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {DISEASES.map(d => {
            const immune = effects.immuneDiseasIds.includes(d.id);
            return (
              <div
                key={d.id}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg"
                style={{
                  background: immune ? `${d.color}10` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${immune ? `${d.color}35` : 'rgba(255,255,255,0.07)'}`,
                }}
              >
                <i className={`${d.icon} text-sm flex-shrink-0`} style={{ color: immune ? d.color : '#374151' }} />
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate" style={{ color: immune ? d.color : '#4b5563' }}>{d.name}</p>
                  <p className="text-xs" style={{ color: immune ? '#4ade80' : '#374151' }}>
                    {immune ? '✓ IMMUNE' : '✗ Vulnerable'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BioResearchLab({
  researchState,
  onStartResearch,
  onCompleteResearch,
}: BioResearchLabProps) {
  const [now, setNow] = useState(Date.now());
  const [pendingResearch, setPendingResearch] = useState<BioResearch | null>(null);
  const [activeFilter, setActiveFilter] = useState<ResearchCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree');
  const [justCompleted, setJustCompleted] = useState<string | null>(null);
  const completeRef = useRef<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleComplete = useCallback((id: string) => {
    if (completeRef.current === id) return;
    completeRef.current = id;
    onCompleteResearch(id);
    setJustCompleted(id);
    setTimeout(() => { setJustCompleted(null); completeRef.current = null; }, 5000);
  }, [onCompleteResearch]);

  const handleConfirmResearch = useCallback(() => {
    if (!pendingResearch) return;
    onStartResearch(pendingResearch.id);
    setPendingResearch(null);
  }, [pendingResearch, onStartResearch]);

  const categories = Object.entries(RESEARCH_CATEGORY_CONFIG) as [ResearchCategory, typeof RESEARCH_CATEGORY_CONFIG[ResearchCategory]][];

  const filteredResearch = activeFilter === 'all'
    ? BIO_RESEARCH_TREE
    : BIO_RESEARCH_TREE.filter(r => r.category === activeFilter);

  const completedCount = researchState.completedIds.length;
  const availableCount = BIO_RESEARCH_TREE.filter(
    r => isAvailable(r, researchState.completedIds) && !researchState.completedIds.includes(r.id) && researchState.researchingId !== r.id
  ).length;

  const justCompletedResearch = justCompleted ? BIO_RESEARCH_TREE.find(r => r.id === justCompleted) : null;

  return (
    <div className="space-y-6">
      {/* Research confirm modal */}
      {pendingResearch && (
        <ResearchModal
          research={pendingResearch}
          onConfirm={handleConfirmResearch}
          onClose={() => setPendingResearch(null)}
        />
      )}

      {/* Completion flash */}
      {justCompletedResearch && (
        <div
          className="rounded-xl px-5 py-4 flex items-center gap-4 animate-pulse"
          style={{ background: `${justCompletedResearch.color}12`, border: `2px solid ${justCompletedResearch.color}55` }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${justCompletedResearch.color}20` }}>
            <i className="ri-check-double-fill text-2xl" style={{ color: justCompletedResearch.color }} />
          </div>
          <div>
            <p className="text-sm font-black text-white">Research Complete!</p>
            <p className="text-xs mt-0.5" style={{ color: justCompletedResearch.color }}>
              <strong>{justCompletedResearch.name}</strong> has been successfully researched and effects applied empire-wide.
              {justCompletedResearch.immunityAgainst && justCompletedResearch.immunityAgainst.length > 0 && (
                <span> Immunity granted against: {justCompletedResearch.immunityAgainst.map(id => DISEASES.find(d => d.id === id)?.name ?? id).join(', ')}.</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <i className="ri-test-tube-line" style={{ color: '#38bdf8' }} />
            Bio-Research Laboratory
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Research permanent disease immunities, sanitation breakthroughs, and genetic upgrades for your empire
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)' }}>
            <i className="ri-check-line text-green-400 text-sm" />
            <span className="text-sm font-bold text-green-400">{completedCount} Done</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)' }}>
            <i className="ri-flask-line text-cyan-400 text-sm" />
            <span className="text-sm font-bold text-cyan-400">{availableCount} Available</span>
          </div>
          {/* View toggle */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            {(['tree', 'grid'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all capitalize"
                style={{
                  background: viewMode === mode ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.04)',
                  color: viewMode === mode ? '#38bdf8' : '#6b7a95',
                }}
              >
                <i className={`${mode === 'tree' ? 'ri-node-tree' : 'ri-grid-line'} mr-1`} />
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active research banner */}
      {researchState.researchingId && (
        <ActiveResearchBanner researchState={researchState} now={now} onComplete={handleComplete} />
      )}

      {/* Empire summary */}
      <EmpireEffectsSummary completedIds={researchState.completedIds} />

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-500 flex-shrink-0">Category:</span>
        <button
          onClick={() => setActiveFilter('all')}
          className="px-3 py-1 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
          style={{
            background: activeFilter === 'all' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${activeFilter === 'all' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
            color: activeFilter === 'all' ? '#fff' : '#6b7a95',
          }}
        >
          All ({BIO_RESEARCH_TREE.length})
        </button>
        {categories.map(([cat, cfg]) => {
          const count = BIO_RESEARCH_TREE.filter(r => r.category === cat).length;
          const doneCount = BIO_RESEARCH_TREE.filter(r => r.category === cat && researchState.completedIds.includes(r.id)).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(activeFilter === cat ? 'all' : cat)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
              style={{
                background: activeFilter === cat ? `${cfg.color}20` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activeFilter === cat ? `${cfg.color}55` : 'rgba(255,255,255,0.1)'}`,
                color: activeFilter === cat ? cfg.color : '#6b7a95',
              }}
            >
              <i className={`${cfg.icon} text-xs`} />
              {cfg.label}
              <span className="ml-0.5 opacity-70">({doneCount}/{count})</span>
            </button>
          );
        })}
      </div>

      {/* Research tree / grid */}
      {viewMode === 'tree' ? (
        <TechTreeView
          researchState={researchState}
          onStartResearch={r => {
            if (researchState.researchingId) return; // already researching
            setPendingResearch(r);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredResearch.map(research => {
            const status = getStatus(research, researchState);
            const isRes = researchState.researchingId === research.id;
            const progressPct = isRes && researchState.researchStartTime
              ? Math.min(100, ((now - researchState.researchStartTime) / (research.researchTimeSecs * 1000)) * 100)
              : 0;
            const secsLeft = isRes && researchState.researchStartTime
              ? Math.max(0, Math.ceil(research.researchTimeSecs - (now - researchState.researchStartTime) / 1000))
              : 0;
            return (
              <ResearchCard
                key={research.id}
                research={research}
                status={status}
                progressPct={progressPct}
                secsLeft={secsLeft}
                onStartResearch={r => {
                  if (researchState.researchingId) return;
                  setPendingResearch(r);
                }}
              />
            );
          })}
        </div>
      )}

      {/* Queue notice when busy */}
      {researchState.researchingId && (
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3 text-xs"
          style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.25)', color: '#fbbf24' }}
        >
          <i className="ri-information-line flex-shrink-0" />
          <span>Research queue is limited to one project at a time. Other research will become available once the current project completes.</span>
        </div>
      )}
    </div>
  );
}