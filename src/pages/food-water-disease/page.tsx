import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DiseaseSpreadMap from './components/DiseaseSpreadMap';
import BioResearchLab from './components/BioResearchLab';
import ColonyHealthDashboard from './components/ColonyHealthDashboard';
import SupplyEmergencyResponse from './components/SupplyEmergencyResponse';
import { type PRPState } from './types';
import {
  FOOD_SOURCES,
  WATER_SOURCES,
  DISEASES,
  COLONY_HEALTH_DATA,
  SUPPLY_EVENTS,
  SEVERITY_CONFIG,
  SANITATION_UPGRADES,
  BIO_RESEARCH_TREE,
  computeSanitationStats,
  type Disease,
  type ColonyHealth,
  type SupplyEvent,
  type ColonySanitationState,
  type SanitationUpgrade,
  type SanitationTier,
  type BioResearchState,
} from '@/data/foodWaterDisease';

// ─── Quarantine context shared across panels ─────────────────────────────────
// Stored at page level and passed down via props

// ─── helpers ────────────────────────────────────────────────────────────────

function HealthBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.08)' }}>
      <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function StatBadge({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg" style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
      <i className={`${icon} text-base`} style={{ color }} />
      <span className="text-xs font-bold whitespace-nowrap" style={{ color }}>{value}</span>
      <span className="text-xs text-gray-500 whitespace-nowrap">{label}</span>
    </div>
  );
}

// ─── Overview Panel ──────────────────────────────────────────────────────────

function OverviewPanel({
  quarantinedIds,
  onQuarantineToggle,
  sanitationStates,
  prpStates,
  onOpenPRP,
}: {
  quarantinedIds: Set<string>;
  onQuarantineToggle: (id: string) => void;
  sanitationStates: Record<string, ColonySanitationState>;
  prpStates: Record<string, PRPState>;
  onOpenPRP: () => void;
}) {
  const totalFood = FOOD_SOURCES.reduce((s, f) => s + f.outputPerHour, 0);
  const totalWater = WATER_SOURCES.reduce((s, w) => s + w.outputPerHour, 0);
  const activeDiseases = DISEASES.filter(d => d.daysActive !== undefined).length;
  const quarantinedColonies = quarantinedIds.size;
  const totalInfected = DISEASES.reduce((s, d) => s + (d.affectedPop || 0), 0);

  const globalHealth = Math.round(
    COLONY_HEALTH_DATA.reduce((s, c) => s + c.healthScore, 0) / COLONY_HEALTH_DATA.length
  );

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div
        className="relative rounded-2xl overflow-hidden h-48"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d2235 50%, #0a1628 100%)' }}
      >
        <img
          src="https://readdy.ai/api/search-image?query=futuristic%20space%20colony%20biodome%20interior%20lush%20hydroponics%20green%20plants%20glowing%20water%20pipes%20food%20production%20facility%20sci-fi%20beautiful%20concept%20art%20cinematic%20wide%20angle%20highly%20detailed&width=1200&height=400&seq=fwd_hero_01&orientation=landscape"
          alt="Colony Sustenance"
          className="absolute inset-0 w-full h-full object-cover object-top opacity-40"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.5) 100%)' }} />
        <div className="relative z-10 flex flex-col justify-center h-full px-8">
          <p className="text-xs font-bold tracking-widest mb-1" style={{ color: '#4ade80' }}>COLONY LIFE-SUPPORT SYSTEMS</p>
          <h1 className="text-3xl font-black text-white mb-2">Food · Water · Disease Control</h1>
          <p className="text-sm text-gray-300 max-w-xl">
            Manage the biological survival layer of your empire. Monitor supply chains, contain outbreaks, and keep your populations productive and healthy.
          </p>
          {/* PRP trigger button */}
          <button
            onClick={onOpenPRP}
            className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black self-start transition-all cursor-pointer hover:scale-105 animate-pulse"
            style={{ background: 'rgba(244,63,94,0.25)', border: '2px solid rgba(244,63,94,0.6)', color: '#f43f5e', animationDuration: '2s' }}
          >
            <i className="ri-shield-flash-line text-base" />
            PLAGUE RESPONSE PROTOCOL
            <span className="px-1.5 py-0.5 rounded text-xs font-black" style={{ background: 'rgba(244,63,94,0.3)', color: '#fff' }}>EMERGENCY</span>
          </button>
        </div>
        {/* Alert strip */}
        {activeDiseases > 0 && (
          <div
            className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold animate-pulse"
            style={{ background: 'rgba(244,63,94,0.2)', border: '1px solid rgba(244,63,94,0.5)', color: '#f43f5e' }}
          >
            <i className="ri-virus-line" />
            {activeDiseases} ACTIVE OUTBREAKS
          </div>
        )}
      </div>

      {/* Empire-wide stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatBadge icon="ri-restaurant-line" label="Food/hr" value={`+${totalFood.toLocaleString()}`} color="#4ade80" />
        <StatBadge icon="ri-drop-line" label="Water/hr" value={`+${totalWater.toLocaleString()}`} color="#38bdf8" />
        <StatBadge icon="ri-heart-pulse-line" label="Global Health" value={`${globalHealth}%`} color={globalHealth > 75 ? '#4ade80' : globalHealth > 50 ? '#fbbf24' : '#f87171'} />
        <StatBadge icon="ri-virus-line" label="Outbreaks" value={activeDiseases} color="#f87171" />
        <StatBadge icon="ri-lock-line" label="Quarantined" value={quarantinedColonies} color="#fbbf24" />
        <StatBadge icon="ri-user-unfollow-line" label="Total Infected" value={totalInfected.toLocaleString()} color="#f43f5e" />
      </div>

      {/* Colony health overview */}
      <div>
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <i className="ri-planet-line text-cyan-400" />
          Colony Health Status
          <span className="text-xs text-gray-500 ml-1 font-normal hidden lg:inline">— toggle quarantine on each colony below</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {COLONY_HEALTH_DATA.map((colony) => (
            <ColonyHealthCard
              key={colony.colonyId}
              colony={colony}
              isQuarantined={quarantinedIds.has(colony.colonyId)}
              onQuarantineToggle={onQuarantineToggle}
              sanitationState={sanitationStates[colony.colonyId]}
            />
          ))}
        </div>
      </div>

      {/* Events */}
      <div>
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <i className="ri-notification-3-line text-red-400" />
          Supply & Health Alerts
        </h2>
        <div className="space-y-2">
          {SUPPLY_EVENTS.map((evt) => (
            <EventRow key={evt.id} evt={evt} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Quarantine confirm modal ────────────────────────────────────────────────

interface QuarantineModalProps {
  colony: ColonyHealth;
  isQuarantined: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

function QuarantineModal({ colony, isQuarantined, onConfirm, onClose }: QuarantineModalProps) {
  const [loading, setLoading] = useState(false);
  const activeDiseases = DISEASES.filter(d => colony.diseases.includes(d.id));

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConfirm();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="rounded-2xl p-6 max-w-lg w-full"
        style={{
          background: '#0a1020',
          border: `2px solid ${isQuarantined ? 'rgba(74,222,128,0.4)' : 'rgba(251,191,36,0.45)'}`,
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: isQuarantined ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.15)',
              border: `1px solid ${isQuarantined ? 'rgba(74,222,128,0.4)' : 'rgba(251,191,36,0.4)'}`,
            }}
          >
            <i
              className={isQuarantined ? 'ri-lock-unlock-line text-xl' : 'ri-lock-line text-xl'}
              style={{ color: isQuarantined ? '#4ade80' : '#fbbf24' }}
            />
          </div>
          <div>
            <h3 className="text-base font-black text-white">
              {isQuarantined ? 'Lift Quarantine' : 'Impose Quarantine'}
            </h3>
            <p className="text-xs text-gray-400">{colony.colonyName} · {colony.coordinates}</p>
          </div>
        </div>

        {/* Colony thumbnail */}
        <div className="relative h-28 rounded-xl overflow-hidden mb-4">
          <img src={colony.image} alt={colony.colonyName} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(10,16,32,0.85))' }} />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            {isQuarantined ? (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.5)', color: '#fbbf24' }}>
                <i className="ri-lock-line mr-1" />QUARANTINED
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.4)', color: '#4ade80' }}>
                <i className="ri-check-line mr-1" />ACTIVE
              </span>
            )}
            <span className="text-xs text-gray-300 font-semibold">{colony.type} · Pop. {colony.population.toLocaleString()}</span>
          </div>
        </div>

        {/* Active diseases warning */}
        {activeDiseases.length > 0 && !isQuarantined && (
          <div
            className="rounded-xl p-3 mb-4 space-y-1.5"
            style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)' }}
          >
            <p className="text-xs font-bold text-red-400 flex items-center gap-1.5">
              <i className="ri-error-warning-line" />Active Disease Outbreaks Detected
            </p>
            {activeDiseases.map(d => (
              <div key={d.id} className="flex items-center gap-2 text-xs" style={{ color: d.color }}>
                <i className={d.icon} />
                <span className="font-semibold">{d.name}</span>
                <span className="text-gray-500 ml-auto">{d.affectedPop?.toLocaleString()} infected</span>
              </div>
            ))}
          </div>
        )}

        {/* Explanation */}
        <div
          className="rounded-xl p-3 mb-5 text-xs leading-relaxed"
          style={{
            background: isQuarantined ? 'rgba(74,222,128,0.07)' : 'rgba(251,191,36,0.07)',
            border: `1px solid ${isQuarantined ? 'rgba(74,222,128,0.2)' : 'rgba(251,191,36,0.2)'}`,
            color: '#9ca3af',
          }}
        >
          {isQuarantined ? (
            <>
              <strong className="text-green-400">Lifting quarantine</strong> will restore trade routes, fleet movement, and normal supply chain flow to this colony.
              {' '}Only lift quarantine when diseases have been treated or contained. Premature lifting risks further spread.
            </>
          ) : (
            <>
              <strong className="text-amber-400">Imposing quarantine</strong> will block all incoming and outgoing fleet traffic, freeze trade routes, and isolate this colony to prevent disease spread to other worlds.
              {' '}Colony productivity will be reduced by 15% due to lockdown protocols. Supply drops can still reach quarantined colonies.
            </>
          )}
        </div>

        {/* Effects grid */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { label: 'Fleet Traffic', value: isQuarantined ? 'Restored' : 'Blocked', good: isQuarantined, icon: 'ri-rocket-line' },
            { label: 'Trade Routes', value: isQuarantined ? 'Restored' : 'Frozen', good: isQuarantined, icon: 'ri-route-line' },
            { label: 'Spread Risk', value: isQuarantined ? 'Elevated' : 'Contained', good: !isQuarantined, icon: 'ri-virus-line' },
          ].map(e => (
            <div key={e.label} className="text-center px-2 py-2 rounded-lg" style={{ background: e.good ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)' }}>
              <i className={`${e.icon} text-sm mb-0.5 block`} style={{ color: e.good ? '#4ade80' : '#f87171' }} />
              <p className="text-xs font-bold" style={{ color: e.good ? '#4ade80' : '#f87171' }}>{e.value}</p>
              <p className="text-xs text-gray-500">{e.label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer whitespace-nowrap"
            style={{
              background: isQuarantined ? 'rgba(74,222,128,0.2)' : 'rgba(251,191,36,0.2)',
              border: `1px solid ${isQuarantined ? 'rgba(74,222,128,0.5)' : 'rgba(251,191,36,0.5)'}`,
              color: isQuarantined ? '#4ade80' : '#fbbf24',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="ri-loader-4-line animate-spin" />
                {isQuarantined ? 'Lifting...' : 'Imposing...'}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <i className={isQuarantined ? 'ri-lock-unlock-line' : 'ri-lock-line'} />
                {isQuarantined ? 'Lift Quarantine' : 'Impose Quarantine'}
              </span>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm text-gray-400 cursor-pointer whitespace-nowrap transition-all hover:bg-white/5"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Colony Health Card ───────────────────────────────────────────────────────

function ColonyHealthCard({
  colony,
  isQuarantined,
  onQuarantineToggle,
  sanitationState,
}: {
  colony: ColonyHealth;
  isQuarantined: boolean;
  onQuarantineToggle: (colonyId: string) => void;
  sanitationState?: ColonySanitationState;
}) {
  const sanStats = sanitationState ? computeSanitationStats(sanitationState) : null;
  const effectiveSanitation = sanStats ? Math.min(100, colony.sanitationLevel + sanStats.totalSanitationBonus) : colony.sanitationLevel;
  const vulnerabilityPct = sanStats ? Math.round(sanStats.effectiveVulnerabilityMod * 100) : 100;
  const [showModal, setShowModal] = useState(false);
  const [justChanged, setJustChanged] = useState(false);
  const activeDiseases = DISEASES.filter(d => colony.diseases.includes(d.id));
  const healthColor =
    colony.healthScore > 80 ? '#4ade80' :
    colony.healthScore > 55 ? '#fbbf24' :
    colony.healthScore > 30 ? '#f87171' : '#f43f5e';

  const handleConfirm = () => {
    onQuarantineToggle(colony.colonyId);
    setShowModal(false);
    setJustChanged(true);
    setTimeout(() => setJustChanged(false), 3000);
  };

  return (
    <>
      {showModal && (
        <QuarantineModal
          colony={colony}
          isQuarantined={isQuarantined}
          onConfirm={handleConfirm}
          onClose={() => setShowModal(false)}
        />
      )}

      <div
        className="rounded-xl overflow-hidden transition-all duration-300"
        style={{
          background: 'rgba(10,15,30,0.85)',
          border: `1px solid ${isQuarantined ? 'rgba(251,191,36,0.4)' : justChanged ? 'rgba(74,222,128,0.4)' : 'rgba(0,212,255,0.15)'}`,
        }}
      >
        {/* Image */}
        <div className="relative h-28 overflow-hidden">
          <img src={colony.image} alt={colony.colonyName} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(10,15,30,0.9) 100%)' }} />

          {/* Quarantine badge */}
          {isQuarantined && (
            <div
              className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold"
              style={{ background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.5)', color: '#fbbf24' }}
            >
              <i className="ri-lock-line text-xs" /> QUARANTINE
            </div>
          )}
          {justChanged && !isQuarantined && (
            <div
              className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold"
              style={{ background: 'rgba(74,222,128,0.2)', border: '1px solid rgba(74,222,128,0.5)', color: '#4ade80' }}
            >
              <i className="ri-check-line text-xs" /> LIFTED
            </div>
          )}

          <div className="absolute bottom-2 left-3">
            <p className="text-xs font-black text-white">{colony.colonyName}</p>
            <p className="text-xs text-gray-400">{colony.coordinates} · {colony.type}</p>
          </div>
        </div>

        <div className="p-3 space-y-2.5">
          {/* Health score */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">Health Score</span>
              <span className="text-xs font-bold" style={{ color: healthColor }}>{colony.healthScore}%</span>
            </div>
            <HealthBar value={colony.healthScore} color={healthColor} />
          </div>

          {/* Food / Water surpluses */}
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center rounded p-1.5" style={{ background: colony.foodSurplus >= 0 ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', border: `1px solid ${colony.foodSurplus >= 0 ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}` }}>
              <i className="ri-restaurant-line text-xs" style={{ color: colony.foodSurplus >= 0 ? '#4ade80' : '#f87171' }} />
              <p className="text-xs font-bold" style={{ color: colony.foodSurplus >= 0 ? '#4ade80' : '#f87171' }}>
                {colony.foodSurplus >= 0 ? '+' : ''}{colony.foodSurplus}/h
              </p>
              <p className="text-xs text-gray-500">Food</p>
            </div>
            <div className="text-center rounded p-1.5" style={{ background: colony.waterSurplus >= 0 ? 'rgba(56,189,248,0.1)' : 'rgba(248,113,113,0.1)', border: `1px solid ${colony.waterSurplus >= 0 ? 'rgba(56,189,248,0.3)' : 'rgba(248,113,113,0.3)'}` }}>
              <i className="ri-drop-line text-xs" style={{ color: colony.waterSurplus >= 0 ? '#38bdf8' : '#f87171' }} />
              <p className="text-xs font-bold" style={{ color: colony.waterSurplus >= 0 ? '#38bdf8' : '#f87171' }}>
                {colony.waterSurplus >= 0 ? '+' : ''}{colony.waterSurplus}/h
              </p>
              <p className="text-xs text-gray-500">Water</p>
            </div>
          </div>

          {/* Diseases */}
          {activeDiseases.length > 0 && (
            <div className="space-y-1">
              {activeDiseases.map(d => (
                <div key={d.id} className="flex items-center gap-2 px-2 py-1 rounded text-xs" style={{ background: `${d.glowColor}`, border: `1px solid ${d.color}40` }}>
                  <i className={`${d.icon} text-xs`} style={{ color: d.color }} />
                  <span style={{ color: d.color }}>{d.name}</span>
                  <span className="ml-auto text-gray-500">{d.affectedPop?.toLocaleString()} infected</span>
                </div>
              ))}
            </div>
          )}

          {/* Sanitation & Medical */}
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-0.5">
                <p className="text-xs text-gray-500">Sanitation</p>
                <span className="text-xs font-bold" style={{ color: effectiveSanitation > 75 ? '#38bdf8' : effectiveSanitation > 50 ? '#fbbf24' : '#f87171' }}>{effectiveSanitation}%</span>
              </div>
              <HealthBar value={effectiveSanitation} color="#38bdf8" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">Medical</p>
              <HealthBar value={colony.medicalCapacity} color="#a78bfa" />
            </div>
          </div>
          {/* Vulnerability indicator from upgrades */}
          {sanStats && sanStats.completedUpgrades > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.2)' }}>
              <i className="ri-shield-check-line text-xs" style={{ color: '#38bdf8' }} />
              <span className="text-xs" style={{ color: '#38bdf8' }}>{sanStats.completedUpgrades} sanitation upgrades active</span>
              <span className="ml-auto text-xs font-bold" style={{ color: vulnerabilityPct < 90 ? '#4ade80' : '#fbbf24' }}>{vulnerabilityPct}% vuln.</span>
            </div>
          )}

          {/* ── Quarantine button ── */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            style={
              isQuarantined
                ? { background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.35)', color: '#4ade80' }
                : activeDiseases.length > 0
                  ? { background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.4)', color: '#fbbf24' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#6b7a95' }
            }
          >
            <i className={isQuarantined ? 'ri-lock-unlock-line' : 'ri-lock-line'} />
            {isQuarantined ? 'Lift Quarantine' : 'Impose Quarantine'}
          </button>
        </div>
      </div>
    </>
  );
}

function EventRow({ evt }: { evt: SupplyEvent }) {
  const bgMap: Record<string, string> = {
    info: 'rgba(56,189,248,0.06)',
    warning: 'rgba(251,191,36,0.06)',
    danger: 'rgba(248,113,113,0.06)',
    critical: 'rgba(244,63,94,0.08)',
  };
  const borderMap: Record<string, string> = {
    info: 'rgba(56,189,248,0.2)',
    warning: 'rgba(251,191,36,0.25)',
    danger: 'rgba(248,113,113,0.25)',
    critical: 'rgba(244,63,94,0.4)',
  };

  return (
    <div
      className="flex items-start gap-3 rounded-xl p-4"
      style={{ background: bgMap[evt.severity], border: `1px solid ${borderMap[evt.severity]}` }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${evt.color}18`, border: `1px solid ${evt.color}35` }}
      >
        <i className={`${evt.icon} text-base`} style={{ color: evt.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-bold text-white">{evt.title}</span>
          {evt.resolved && (
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}>
              RESOLVED
            </span>
          )}
          {evt.severity === 'critical' && !evt.resolved && (
            <span className="text-xs px-2 py-0.5 rounded-full font-bold animate-pulse" style={{ background: 'rgba(244,63,94,0.2)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.5)' }}>
              CRITICAL
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">{evt.description}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-xs text-gray-600"><i className="ri-planet-line mr-1" />{evt.colony}</span>
          <span className="text-xs text-gray-600">{evt.timeAgo}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Food Panel ──────────────────────────────────────────────────────────────

function FoodPanel() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedSrc = FOOD_SOURCES.find(f => f.id === selected);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white">Food Production Systems</h2>
          <p className="text-xs text-gray-400 mt-0.5">Manage all agricultural and synthetic food sources across your empire</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)' }}>
          <i className="ri-restaurant-line text-green-400 text-sm" />
          <span className="text-sm font-bold text-green-400">
            +{FOOD_SOURCES.reduce((s, f) => s + f.outputPerHour, 0).toLocaleString()} Food/hr
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {FOOD_SOURCES.map((src) => (
            <button
              key={src.id}
              onClick={() => setSelected(selected === src.id ? null : src.id)}
              className="rounded-xl overflow-hidden text-left transition-all cursor-pointer hover:scale-[1.02]"
              style={{
                background: 'rgba(10,15,30,0.85)',
                border: `1px solid ${selected === src.id ? src.color : 'rgba(74,222,128,0.15)'}`,
              }}
            >
              <div className="relative h-32 overflow-hidden">
                <img src={src.image} alt={src.name} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(10,15,30,0.85) 100%)' }} />
                <div
                  className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                  style={{ background: `${src.color}20`, border: `1px solid ${src.color}40`, color: src.color }}
                >
                  <i className={`${src.icon} text-xs`} />{src.category.replace('_', ' ')}
                </div>
                <div className="absolute bottom-2 right-2 text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.6)', color: src.color }}>
                  Lv.{src.level}/{src.maxLevel}
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold text-white mb-1">{src.name}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>
                    <i className="ri-restaurant-line mr-1" />+{src.outputPerHour.toLocaleString()}/hr
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24' }}>
                    <i className="ri-flashlight-line mr-1" />{src.energyCost} E
                  </span>
                  {src.waterCost > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8' }}>
                      <i className="ri-drop-line mr-1" />{src.waterCost} W
                    </span>
                  )}
                </div>
                {/* Level bar */}
                <div>
                  <HealthBar value={src.level} max={src.maxLevel} color={src.color} />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'rgba(10,15,30,0.85)', border: '1px solid rgba(74,222,128,0.2)' }}
        >
          {selectedSrc ? (
            <div>
              <div className="relative h-40 rounded-lg overflow-hidden mb-4">
                <img src={selectedSrc.image} alt={selectedSrc.name} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(10,15,30,0.8))' }} />
              </div>
              <h3 className="text-base font-black text-white mb-1">{selectedSrc.name}</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">{selectedSrc.description}</p>

              <div className="space-y-2.5">
                {[
                  { label: 'Output / Hour', value: `+${selectedSrc.outputPerHour.toLocaleString()} food units`, color: '#4ade80', icon: 'ri-restaurant-line' },
                  { label: 'Energy Cost', value: `${selectedSrc.energyCost} units/hr`, color: '#fbbf24', icon: 'ri-flashlight-line' },
                  { label: 'Water Cost', value: selectedSrc.waterCost > 0 ? `${selectedSrc.waterCost} units/hr` : 'None', color: '#38bdf8', icon: 'ri-drop-line' },
                  { label: 'Current Level', value: `${selectedSrc.level} / ${selectedSrc.maxLevel}`, color: selectedSrc.color, icon: 'ri-arrow-up-circle-line' },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: `${stat.color}08` }}>
                    <span className="text-xs text-gray-400 flex items-center gap-1.5">
                      <i className={`${stat.icon} text-xs`} style={{ color: stat.color }} />{stat.label}
                    </span>
                    <span className="text-xs font-bold" style={{ color: stat.color }}>{stat.value}</span>
                  </div>
                ))}
              </div>

              {selectedSrc.unlockResearch && (
                <div className="mt-3 px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', color: '#a78bfa' }}>
                  <i className="ri-flask-line mr-1.5" />Requires Research: <strong>{selectedSrc.unlockResearch.replace(/_/g, ' ')}</strong>
                </div>
              )}

              <button
                className="w-full mt-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer"
                style={{ background: `${selectedSrc.color}20`, border: `1px solid ${selectedSrc.color}40`, color: selectedSrc.color }}
              >
                <i className="ri-arrow-up-circle-line mr-1.5" />Upgrade to Level {selectedSrc.level + 1}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <i className="ri-restaurant-2-line text-4xl mb-3" style={{ color: 'rgba(74,222,128,0.4)' }} />
              <p className="text-sm text-gray-500">Select a food source to view details & upgrade options</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Water Panel ─────────────────────────────────────────────────────────────

function WaterPanel() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedSrc = WATER_SOURCES.find(w => w.id === selected);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white">Water Supply Systems</h2>
          <p className="text-xs text-gray-400 mt-0.5">Extraction, recycling and generation of water across all colonies</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)' }}>
          <i className="ri-drop-line text-sky-400 text-sm" />
          <span className="text-sm font-bold text-sky-400">
            +{WATER_SOURCES.reduce((s, w) => s + w.outputPerHour, 0).toLocaleString()} Water/hr
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {WATER_SOURCES.map((src) => (
            <button
              key={src.id}
              onClick={() => setSelected(selected === src.id ? null : src.id)}
              className="rounded-xl overflow-hidden text-left cursor-pointer transition-all hover:scale-[1.02]"
              style={{
                background: 'rgba(10,15,30,0.85)',
                border: `1px solid ${selected === src.id ? src.color : 'rgba(56,189,248,0.15)'}`,
              }}
            >
              <div className="relative h-32 overflow-hidden">
                <img src={src.image} alt={src.name} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(10,15,30,0.85) 100%)' }} />
                <div
                  className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                  style={{ background: `${src.color}20`, border: `1px solid ${src.color}40`, color: src.color }}
                >
                  <i className={`${src.icon} text-xs`} />{src.category.replace('_', ' ')}
                </div>
                <div className="absolute bottom-2 right-2 text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.6)', color: src.color }}>
                  Lv.{src.level}/{src.maxLevel}
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold text-white mb-1">{src.name}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8' }}>
                    <i className="ri-drop-line mr-1" />+{src.outputPerHour.toLocaleString()}/hr
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24' }}>
                    <i className="ri-flashlight-line mr-1" />{src.energyCost} E
                  </span>
                </div>
                <HealthBar value={src.level} max={src.maxLevel} color={src.color} />
              </div>
            </button>
          ))}
        </div>

        <div
          className="rounded-xl p-5"
          style={{ background: 'rgba(10,15,30,0.85)', border: '1px solid rgba(56,189,248,0.2)' }}
        >
          {selectedSrc ? (
            <div>
              <div className="relative h-40 rounded-lg overflow-hidden mb-4">
                <img src={selectedSrc.image} alt={selectedSrc.name} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(10,15,30,0.8))' }} />
              </div>
              <h3 className="text-base font-black text-white mb-1">{selectedSrc.name}</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">{selectedSrc.description}</p>

              <div className="space-y-2.5">
                {[
                  { label: 'Output / Hour', value: `+${selectedSrc.outputPerHour.toLocaleString()} water units`, color: '#38bdf8', icon: 'ri-drop-line' },
                  { label: 'Energy Cost', value: `${selectedSrc.energyCost} units/hr`, color: '#fbbf24', icon: 'ri-flashlight-line' },
                  { label: 'Current Level', value: `${selectedSrc.level} / ${selectedSrc.maxLevel}`, color: selectedSrc.color, icon: 'ri-arrow-up-circle-line' },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: `${stat.color}08` }}>
                    <span className="text-xs text-gray-400 flex items-center gap-1.5">
                      <i className={`${stat.icon} text-xs`} style={{ color: stat.color }} />{stat.label}
                    </span>
                    <span className="text-xs font-bold" style={{ color: stat.color }}>{stat.value}</span>
                  </div>
                ))}
              </div>

              <button
                className="w-full mt-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer"
                style={{ background: `${selectedSrc.color}20`, border: `1px solid ${selectedSrc.color}40`, color: selectedSrc.color }}
              >
                <i className="ri-arrow-up-circle-line mr-1.5" />Upgrade to Level {selectedSrc.level + 1}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <i className="ri-drop-line text-4xl mb-3" style={{ color: 'rgba(56,189,248,0.4)' }} />
              <p className="text-sm text-gray-500">Select a water source to view details & upgrade options</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Disease Panel ───────────────────────────────────────────────────────────

function DiseasePanel() {
  const [selected, setSelected] = useState<Disease | null>(null);
  const [showTreatModal, setShowTreatModal] = useState(false);
  const [treatingId, setTreatingId] = useState<string | null>(null);
  const [treatedIds, setTreatedIds] = useState<string[]>([]);

  const handleTreat = (id: string) => {
    setTreatingId(id);
    setTimeout(() => {
      setTreatedIds(prev => [...prev, id]);
      setTreatingId(null);
      setShowTreatModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Treatment modal */}
      {showTreatModal && selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="rounded-2xl p-6 max-w-md w-full"
            style={{ background: '#0d1526', border: `1px solid ${selected.color}50` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${selected.glowColor}`, border: `1px solid ${selected.color}40` }}>
                <i className={`${selected.icon} text-xl`} style={{ color: selected.color }} />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Deploy Treatment</h3>
                <p className="text-xs text-gray-400">{selected.name}</p>
              </div>
            </div>
            <p className="text-xs text-gray-300 mb-4 leading-relaxed">{selected.treatment}</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {[
                { label: 'Metal', val: selected.treatmentCost.metal, color: '#fcd34d', icon: 'ri-copper-coin-line' },
                { label: 'Crystal', val: selected.treatmentCost.crystal, color: '#60a5fa', icon: 'ri-drop-line' },
                { label: 'Deuterium', val: selected.treatmentCost.deuterium, color: '#4ade80', icon: 'ri-drop-line' },
                { label: 'Credits', val: selected.treatmentCost.imperial_credits, color: '#fbbf24', icon: 'ri-coins-line' },
              ].filter(r => r.val > 0).map(r => (
                <div key={r.label} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: `${r.color}0f` }}>
                  <i className={`${r.icon} text-sm`} style={{ color: r.color }} />
                  <div>
                    <p className="text-xs text-gray-400">{r.label}</p>
                    <p className="text-xs font-bold" style={{ color: r.color }}>{r.val.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleTreat(selected.id)}
                disabled={treatingId === selected.id}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer whitespace-nowrap"
                style={{ background: `${selected.color}25`, border: `1px solid ${selected.color}50`, color: selected.color }}
              >
                {treatingId === selected.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-loader-4-line animate-spin" />Treating...
                  </span>
                ) : 'Confirm Treatment'}
              </button>
              <button
                onClick={() => setShowTreatModal(false)}
                className="px-4 py-2.5 rounded-lg text-sm text-gray-400 cursor-pointer whitespace-nowrap"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white">Disease & Outbreak Control</h2>
          <p className="text-xs text-gray-400 mt-0.5">Monitor, contain and eradicate biological threats across your empire</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg animate-pulse" style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)' }}>
          <i className="ri-virus-line text-red-400 text-sm" />
          <span className="text-sm font-bold text-red-400">{DISEASES.filter(d => d.daysActive).length} Active Threats</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {DISEASES.map((disease) => {
          const cfg = SEVERITY_CONFIG[disease.severity];
          const treated = treatedIds.includes(disease.id);

          return (
            <button
              key={disease.id}
              onClick={() => setSelected(selected?.id === disease.id ? null : disease)}
              className="rounded-xl p-4 text-left cursor-pointer transition-all hover:scale-[1.01]"
              style={{
                background: treated ? 'rgba(74,222,128,0.05)' : cfg.bg,
                border: `1px solid ${treated ? 'rgba(74,222,128,0.3)' : selected?.id === disease.id ? disease.color : cfg.border}`,
              }}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${disease.glowColor}`, border: `1px solid ${disease.color}40` }}
                >
                  <i className={`${disease.icon} text-lg`} style={{ color: treated ? '#4ade80' : disease.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-black text-white">{disease.name}</h3>
                    {treated ? (
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}>TREATED</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                        {cfg.label}
                      </span>
                    )}
                    {disease.severity === 'pandemic' && !treated && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-black animate-pulse" style={{ background: 'rgba(255,0,0,0.15)', color: '#ff3333', border: '1px solid rgba(255,0,0,0.5)' }}>
                        ⚠ PANDEMIC
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{disease.category} · {disease.infectedPlanet || 'Multiple colonies'}</p>
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed mb-3">{disease.description}</p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center px-2 py-1.5 rounded" style={{ background: 'rgba(248,113,113,0.1)' }}>
                  <p className="text-xs font-bold text-red-400">{(disease.spreadRate * 100).toFixed(0)}%</p>
                  <p className="text-xs text-gray-500">Spread</p>
                </div>
                <div className="text-center px-2 py-1.5 rounded" style={{ background: 'rgba(251,191,36,0.1)' }}>
                  <p className="text-xs font-bold text-amber-400">{(disease.productivityLoss * 100).toFixed(0)}%</p>
                  <p className="text-xs text-gray-500">Prod. Loss</p>
                </div>
                <div className="text-center px-2 py-1.5 rounded" style={{ background: 'rgba(244,63,94,0.1)' }}>
                  <p className="text-xs font-bold text-red-400">{(disease.mortalityRate * 100).toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">Mortality</p>
                </div>
              </div>

              {/* Symptoms */}
              <div className="flex flex-wrap gap-1 mb-3">
                {disease.symptoms.map((s) => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af' }}>
                    {s}
                  </span>
                ))}
              </div>

              {/* Infected + days */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {disease.affectedPop && (
                    <span className="text-xs flex items-center gap-1" style={{ color: disease.color }}>
                      <i className="ri-user-unfollow-line" />{disease.affectedPop.toLocaleString()} infected
                    </span>
                  )}
                  {disease.daysActive !== undefined && (
                    <span className="text-xs text-gray-500">
                      <i className="ri-time-line mr-1" />Day {disease.daysActive}
                    </span>
                  )}
                </div>
                {!treated && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelected(disease); setShowTreatModal(true); }}
                    className="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                    style={{ background: `${disease.color}20`, border: `1px solid ${disease.color}40`, color: disease.color }}
                  >
                    <i className="ri-medicine-bottle-line mr-1" />Treat
                  </button>
                )}
              </div>

              {/* Expanded detail */}
              {selected?.id === disease.id && (
                <div className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <p className="text-xs text-gray-300"><span className="text-gray-500">Treatment:</span> {disease.treatment}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-gray-400">Resource consumption modifiers:</span>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>
                      Food ×{disease.foodConsumptionMod.toFixed(1)}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8' }}>
                      Water ×{disease.waterConsumptionMod.toFixed(1)}
                    </span>
                  </div>
                  {disease.researchCure && (
                    <p className="text-xs" style={{ color: '#a78bfa' }}>
                      <i className="ri-flask-line mr-1" />Research cure available: <strong>{disease.researchCure.replace(/_/g, ' ')}</strong>
                    </p>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Research Cures note */}
      <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)' }}>
        <i className="ri-flask-line text-purple-400 text-lg mt-0.5" />
        <div>
          <p className="text-sm font-bold text-purple-300 mb-0.5">Research-Based Immunity</p>
          <p className="text-xs text-gray-400">
            Some diseases can be permanently countered by researching specific technologies in the <strong className="text-purple-400">Advanced Research Lab</strong>. Unlock <em>Nano Immunity</em>, <em>Parasite Immunity Shield</em> and <em>Bioengineering</em> for permanent protection.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Supply Chain Panel ───────────────────────────────────────────────────────

function SupplyPanel({
  quarantinedIds,
  onQuarantineToggle,
}: {
  quarantinedIds: Set<string>;
  onQuarantineToggle: (id: string) => void;
}) {
  const [routeFrom, setRouteFrom] = useState('Homeworld Alpha');
  const [routeTo, setRouteTo] = useState('Outer Rim Post Delta');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1800);
  };

  const colonies = COLONY_HEALTH_DATA.map(c => c.colonyName);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-black text-white">Supply Chain Management</h2>

      {/* Empire-wide chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Food balance */}
        <div className="rounded-xl p-5" style={{ background: 'rgba(10,15,30,0.85)', border: '1px solid rgba(74,222,128,0.2)' }}>
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <i className="ri-restaurant-line text-green-400" />Food Balance per Colony
          </h3>
          <div className="space-y-3">
            {COLONY_HEALTH_DATA.map(c => (
              <div key={c.colonyId}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-300">{c.colonyName}</span>
                  <span className="text-xs font-bold" style={{ color: c.foodSurplus >= 0 ? '#4ade80' : '#f87171' }}>
                    {c.foodSurplus >= 0 ? '+' : ''}{c.foodSurplus}/hr
                  </span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.abs(c.foodSurplus) / 15)}%`,
                      background: c.foodSurplus >= 0 ? 'linear-gradient(90deg,#4ade80,#86efac)' : 'linear-gradient(90deg,#f87171,#f43f5e)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Water balance */}
        <div className="rounded-xl p-5" style={{ background: 'rgba(10,15,30,0.85)', border: '1px solid rgba(56,189,248,0.2)' }}>
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <i className="ri-drop-line text-sky-400" />Water Balance per Colony
          </h3>
          <div className="space-y-3">
            {COLONY_HEALTH_DATA.map(c => (
              <div key={c.colonyId}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-300">{c.colonyName}</span>
                  <span className="text-xs font-bold" style={{ color: c.waterSurplus >= 0 ? '#38bdf8' : '#f87171' }}>
                    {c.waterSurplus >= 0 ? '+' : ''}{c.waterSurplus}/hr
                  </span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.abs(c.waterSurplus) / 10)}%`,
                      background: c.waterSurplus >= 0 ? 'linear-gradient(90deg,#38bdf8,#bae6fd)' : 'linear-gradient(90deg,#f87171,#f43f5e)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency supply dispatch */}
      <div className="rounded-xl p-5" style={{ background: 'rgba(10,15,30,0.85)', border: '1px solid rgba(251,191,36,0.25)' }}>
        <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <i className="ri-send-plane-fill text-amber-400" />Emergency Supply Dispatch
        </h3>
        <p className="text-xs text-gray-400 mb-4">Immediately redirect food and water reserves from a surplus colony to a colony in crisis.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">From Colony</label>
            <select
              value={routeFrom}
              onChange={e => setRouteFrom(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm text-white cursor-pointer"
              style={{ background: '#0d1526', border: '1px solid rgba(251,191,36,0.3)', color: '#fff' }}
            >
              {colonies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">To Colony</label>
            <select
              value={routeTo}
              onChange={e => setRouteTo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm cursor-pointer"
              style={{ background: '#0d1526', border: '1px solid rgba(251,191,36,0.3)', color: '#fff' }}
            >
              {colonies.filter(c => c !== routeFrom).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button
            onClick={handleSend}
            disabled={sending || sent}
            className="py-2 rounded-lg text-sm font-bold transition-all cursor-pointer whitespace-nowrap"
            style={{
              background: sent ? 'rgba(74,222,128,0.2)' : 'rgba(251,191,36,0.2)',
              border: `1px solid ${sent ? 'rgba(74,222,128,0.4)' : 'rgba(251,191,36,0.4)'}`,
              color: sent ? '#4ade80' : '#fbbf24',
            }}
          >
            {sending ? (
              <span className="flex items-center justify-center gap-2">
                <i className="ri-loader-4-line animate-spin" />Dispatching...
              </span>
            ) : sent ? (
              <span className="flex items-center justify-center gap-2">
                <i className="ri-check-line" />Supply Sent!
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <i className="ri-send-plane-line" />Dispatch Supply
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active quarantines */}
      <div className="rounded-xl p-5" style={{ background: 'rgba(10,15,30,0.85)', border: '1px solid rgba(248,113,113,0.2)' }}>
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <i className="ri-lock-line text-red-400" />Active Quarantine Zones
          <span className="ml-auto text-xs text-gray-500 font-normal">Toggle directly from colony cards</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {COLONY_HEALTH_DATA.filter(c => quarantinedIds.has(c.colonyId)).map(c => {
            const diseases = DISEASES.filter(d => c.diseases.includes(d.id));
            return (
              <div key={c.colonyId} className="rounded-lg p-3 flex items-start gap-3" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)' }}>
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={c.image} alt={c.colonyName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-bold text-white">{c.colonyName}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.4)' }}>
                      QUARANTINE
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">{c.coordinates} · {c.type}</p>
                  {diseases.map(d => (
                    <div key={d.id} className="text-xs flex items-center gap-1.5" style={{ color: d.color }}>
                      <i className={d.icon} />{d.name}
                    </div>
                  ))}
                  <button
                    onClick={() => onQuarantineToggle(c.colonyId)}
                    className="mt-2 text-xs px-2.5 py-1 rounded-lg font-semibold cursor-pointer transition-all"
                    style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.35)', color: '#4ade80' }}
                  >
                    <i className="ri-lock-unlock-line mr-1" />Lift Quarantine
                  </button>
                </div>
              </div>
            );
          })}
          {quarantinedIds.size === 0 && (
            <p className="text-xs text-gray-500">No colonies currently under quarantine. Use the colony cards in the Overview tab to impose quarantine.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sanitation Upgrade Panel ─────────────────────────────────────────────────

interface UpgradeConfirmModalProps {
  upgrade: SanitationUpgrade;
  tier: SanitationTier;
  colonyName: string;
  onConfirm: () => void;
  onClose: () => void;
}

function UpgradeConfirmModal({ upgrade, tier, colonyName, onConfirm, onClose }: UpgradeConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConfirm();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="rounded-2xl p-6 max-w-lg w-full"
        style={{ background: '#0a1020', border: `2px solid ${upgrade.color}50` }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${upgrade.color}18`, border: `1px solid ${upgrade.color}40` }}
          >
            <i className={`${tier.icon} text-2xl`} style={{ color: tier.color }} />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Upgrade to Tier {tier.tier}: {tier.name}</h3>
            <p className="text-xs text-gray-400">{upgrade.name} · {colonyName}</p>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-4 px-1">{tier.description}</p>

        {/* Effects grid */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[
            { label: 'Sanitation Boost', value: `+${tier.sanitationBonus} pts`, color: '#38bdf8', icon: 'ri-sparkling-line' },
            { label: 'Disease Vulnerability', value: `-${((1 - tier.diseaseVulnerabilityMod) * 100).toFixed(0)}%`, color: '#4ade80', icon: 'ri-shield-check-line' },
            { label: 'Spread Rate Cut', value: `-${(tier.spreadRateReduction * 100).toFixed(0)}%`, color: '#f87171', icon: 'ri-virus-line' },
            { label: 'Mortality Reduction', value: `-${(tier.mortalityReduction * 100).toFixed(1)}%`, color: '#c084fc', icon: 'ri-heart-pulse-line' },
          ].map(e => (
            <div key={e.label} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: `${e.color}10`, border: `1px solid ${e.color}25` }}>
              <i className={`${e.icon} text-sm flex-shrink-0`} style={{ color: e.color }} />
              <div>
                <p className="text-xs font-bold" style={{ color: e.color }}>{e.value}</p>
                <p className="text-xs text-gray-500">{e.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Cost */}
        <div className="rounded-xl p-3 mb-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1.5">
            <i className="ri-coins-line" />Resource Cost
          </p>
          <div className="flex flex-wrap gap-3">
            {tier.costMetal > 0 && (
              <span className="text-xs flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: 'rgba(252,211,77,0.1)', color: '#fcd34d', border: '1px solid rgba(252,211,77,0.25)' }}>
                <i className="ri-copper-coin-line" />{tier.costMetal.toLocaleString()} Metal
              </span>
            )}
            {tier.costCrystal > 0 && (
              <span className="text-xs flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}>
                <i className="ri-drop-line" />{tier.costCrystal.toLocaleString()} Crystal
              </span>
            )}
            {tier.costCredits > 0 && (
              <span className="text-xs flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}>
                <i className="ri-coins-line" />{tier.costCredits.toLocaleString()} Credits
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer whitespace-nowrap"
            style={{ background: `${upgrade.color}22`, border: `1px solid ${upgrade.color}55`, color: upgrade.color }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="ri-loader-4-line animate-spin" />Upgrading...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <i className="ri-arrow-up-circle-line" />Confirm Upgrade
              </span>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm text-gray-400 cursor-pointer whitespace-nowrap transition-all hover:bg-white/5"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

interface SanitationPanelProps {
  sanitationStates: Record<string, ColonySanitationState>;
  onUpgrade: (colonyId: string, upgradeId: string) => void;
  prpStates: Record<string, PRPState>;
  onOpenPRP: () => void;
}

function SanitationPanel({ sanitationStates, onUpgrade, prpStates, onOpenPRP }: SanitationPanelProps) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const anyPRPActive = Object.values(prpStates).some(s => s.activeUntil !== null && s.activeUntil > now);
  const [selectedColony, setSelectedColony] = useState(COLONY_HEALTH_DATA[0].colonyId);
  const [pendingUpgrade, setPendingUpgrade] = useState<{ upgrade: SanitationUpgrade; tier: SanitationTier } | null>(null);
  const [recentlyUpgraded, setRecentlyUpgraded] = useState<string[]>([]);

  const colony = COLONY_HEALTH_DATA.find(c => c.colonyId === selectedColony)!;
  const state = sanitationStates[selectedColony];
  const stats = computeSanitationStats(state);

  const getUpgradeLevel = (upgradeId: string) => state.upgradeLevel[upgradeId] ?? 0;

  const isPrereqMet = (upgrade: SanitationUpgrade) => {
    if (!upgrade.requiresUpgradeId) return true;
    return (state.upgradeLevel[upgrade.requiresUpgradeId] ?? 0) >= 1;
  };

  const handleConfirmUpgrade = () => {
    if (!pendingUpgrade) return;
    const upgradeId = pendingUpgrade.upgrade.id;
    onUpgrade(selectedColony, upgradeId);
    setRecentlyUpgraded(prev => [...prev, `${selectedColony}_${upgradeId}`]);
    setTimeout(() => {
      setRecentlyUpgraded(prev => prev.filter(k => k !== `${selectedColony}_${upgradeId}`));
    }, 4000);
    setPendingUpgrade(null);
  };

  const effectiveSanitation = Math.min(100, colony.sanitationLevel + stats.totalSanitationBonus);
  const vulnerabilityPct = Math.round(stats.effectiveVulnerabilityMod * 100);

  return (
    <div className="space-y-6">
      {pendingUpgrade && (
        <UpgradeConfirmModal
          upgrade={pendingUpgrade.upgrade}
          tier={pendingUpgrade.tier}
          colonyName={colony.colonyName}
          onConfirm={handleConfirmUpgrade}
          onClose={() => setPendingUpgrade(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white">Sanitation Upgrade Center</h2>
          <p className="text-xs text-gray-400 mt-0.5">Spend resources to reduce disease vulnerability and raise sanitation scores per colony</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* PRP quick launch from sanitation tab */}
          <button
            onClick={onOpenPRP}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer hover:scale-105"
            style={{
              background: anyPRPActive ? 'rgba(74,222,128,0.15)' : 'rgba(244,63,94,0.15)',
              border: `2px solid ${anyPRPActive ? 'rgba(74,222,128,0.45)' : 'rgba(244,63,94,0.45)'}`,
              color: anyPRPActive ? '#4ade80' : '#f43f5e',
              animationDuration: '2s',
            }}
          >
            <i className={`ri-shield-flash-line ${anyPRPActive ? '' : 'animate-pulse'}`} />
            {anyPRPActive ? 'PRP ACTIVE' : 'PLAGUE RESPONSE'}
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)' }}>
            <i className="ri-shield-check-line text-sky-400 text-sm" />
            <span className="text-sm font-bold text-sky-400">Empire: {stats.completedUpgrades}/{stats.totalUpgrades} Tiers</span>
          </div>
        </div>
      </div>

      {/* Colony selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {COLONY_HEALTH_DATA.map(c => {
          const cs = sanitationStates[c.colonyId];
          const cStats = computeSanitationStats(cs);
          const effSan = Math.min(100, c.sanitationLevel + cStats.totalSanitationBonus);
          const active = selectedColony === c.colonyId;
          return (
            <button
              key={c.colonyId}
              onClick={() => setSelectedColony(c.colonyId)}
              className="relative rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] text-left"
              style={{
                border: `2px solid ${active ? '#38bdf8' : 'rgba(255,255,255,0.08)'}`,
                background: active ? 'rgba(56,189,248,0.08)' : 'rgba(10,15,30,0.85)',
              }}
            >
              <div className="h-20 overflow-hidden relative">
                <img src={c.image} alt={c.colonyName} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(10,15,30,0.85))' }} />
              </div>
              <div className="p-2.5">
                <p className="text-xs font-black text-white truncate">{c.colonyName}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${effSan}%`, background: effSan > 75 ? '#38bdf8' : effSan > 50 ? '#fbbf24' : '#f87171' }} />
                  </div>
                  <span className="text-xs font-bold" style={{ color: effSan > 75 ? '#38bdf8' : effSan > 50 ? '#fbbf24' : '#f87171' }}>{effSan}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{cStats.completedUpgrades} upgrades</p>
              </div>
              {active && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#38bdf8' }}>
                  <i className="ri-check-line text-xs text-black" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Colony stats bar */}
      <div
        className="rounded-xl p-5"
        style={{ background: 'rgba(10,15,30,0.9)', border: '1px solid rgba(56,189,248,0.2)' }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              <img src={colony.image} alt={colony.colonyName} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-base font-black text-white">{colony.colonyName}</p>
              <p className="text-xs text-gray-400">{colony.type} · {colony.coordinates}</p>
              <p className="text-xs text-gray-500">Pop. {colony.population.toLocaleString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
            {[
              { label: 'Effective Sanitation', value: `${effectiveSanitation}%`, sub: `Base ${colony.sanitationLevel}% + ${stats.totalSanitationBonus} bonus`, color: '#38bdf8', icon: 'ri-sparkling-line' },
              { label: 'Disease Vulnerability', value: `${vulnerabilityPct}%`, sub: `${((1 - stats.effectiveVulnerabilityMod) * 100).toFixed(0)}% reduction active`, color: vulnerabilityPct < 80 ? '#4ade80' : '#fbbf24', icon: 'ri-shield-check-line' },
              { label: 'Spread Rate Cut', value: `-${(stats.totalSpreadReduction * 100).toFixed(0)}%`, sub: 'On incoming outbreaks', color: '#f87171', icon: 'ri-virus-line' },
              { label: 'Mortality Cut', value: `-${(stats.totalMortalityReduction * 100).toFixed(1)}%`, sub: 'From all active diseases', color: '#c084fc', icon: 'ri-heart-pulse-line' },
            ].map(s => (
              <div key={s.label} className="rounded-lg px-3 py-2.5" style={{ background: `${s.color}0e`, border: `1px solid ${s.color}22` }}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <i className={`${s.icon} text-xs`} style={{ color: s.color }} />
                  <span className="text-xs text-gray-400">{s.label}</span>
                </div>
                <p className="text-base font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-tight">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {SANITATION_UPGRADES.map(upgrade => {
          const currentLevel = getUpgradeLevel(upgrade.id);
          const prereqMet = isPrereqMet(upgrade);
          const prereqUpgrade = upgrade.requiresUpgradeId ? SANITATION_UPGRADES.find(u => u.id === upgrade.requiresUpgradeId) : null;
          const maxed = currentLevel >= upgrade.tiers.length;
          const justUpgraded = recentlyUpgraded.includes(`${selectedColony}_${upgrade.id}`);

          return (
            <div
              key={upgrade.id}
              className="rounded-xl overflow-hidden transition-all"
              style={{
                background: 'rgba(10,15,30,0.9)',
                border: `1px solid ${maxed ? `${upgrade.color}55` : justUpgraded ? `${upgrade.color}80` : !prereqMet ? 'rgba(255,255,255,0.06)' : `${upgrade.color}25`}`,
                opacity: !prereqMet ? 0.6 : 1,
              }}
            >
              {/* Card header image */}
              <div className="relative h-36 overflow-hidden">
                <img src={upgrade.image} alt={upgrade.name} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(10,15,30,0.92) 100%)' }} />

                {/* Category badge */}
                <div
                  className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                  style={{ background: `${upgrade.color}20`, border: `1px solid ${upgrade.color}45`, color: upgrade.color }}
                >
                  <i className={`${upgrade.icon} mr-1`} />{upgrade.category}
                </div>

                {/* Status badge */}
                {maxed ? (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(74,222,128,0.2)', border: '1px solid rgba(74,222,128,0.5)', color: '#4ade80' }}>
                    <i className="ri-checkbox-circle-fill mr-1" />MAXED
                  </div>
                ) : currentLevel > 0 ? (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: `${upgrade.color}20`, border: `1px solid ${upgrade.color}45`, color: upgrade.color }}>
                    Tier {currentLevel}/{upgrade.tiers.length}
                  </div>
                ) : !prereqMet ? (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.35)', color: '#f87171' }}>
                    <i className="ri-lock-line mr-1" />LOCKED
                  </div>
                ) : null}

                <div className="absolute bottom-3 left-3">
                  <h3 className="text-sm font-black text-white">{upgrade.name}</h3>
                  <p className="text-xs text-gray-400">{upgrade.description}</p>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {/* Long description */}
                <p className="text-xs text-gray-400 leading-relaxed">{upgrade.longDesc}</p>

                {/* Prerequisite notice */}
                {!prereqMet && prereqUpgrade && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171' }}>
                    <i className="ri-lock-line flex-shrink-0" />
                    Requires: <strong className="ml-1">{prereqUpgrade.name}</strong> (any tier)
                  </div>
                )}

                {/* Tier progression */}
                <div className="space-y-2">
                  {upgrade.tiers.map(tier => {
                    const isPurchased = currentLevel >= tier.tier;
                    const isNext = currentLevel === tier.tier - 1;
                    const isLocked = !prereqMet || currentLevel < tier.tier - 1;

                    return (
                      <div
                        key={tier.tier}
                        className="rounded-lg p-3 transition-all"
                        style={{
                          background: isPurchased ? `${tier.color}12` : isNext ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${isPurchased ? `${tier.color}40` : isNext ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'}`,
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: isPurchased ? `${tier.color}20` : 'rgba(255,255,255,0.05)', border: `1px solid ${isPurchased ? `${tier.color}45` : 'rgba(255,255,255,0.08)'}` }}
                            >
                              {isPurchased ? (
                                <i className="ri-check-line text-sm" style={{ color: tier.color }} />
                              ) : (
                                <span className="text-xs font-black" style={{ color: isNext ? '#fff' : '#374151' }}>{tier.tier}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold" style={{ color: isPurchased ? tier.color : isNext ? '#e5e7eb' : '#4b5563' }}>{tier.name}</p>
                              <p className="text-xs text-gray-500 leading-tight">{tier.description}</p>
                            </div>
                          </div>

                          {!isPurchased && isNext && !isLocked && (
                            <button
                              onClick={() => setPendingUpgrade({ upgrade, tier })}
                              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all hover:scale-105"
                              style={{ background: `${upgrade.color}20`, border: `1px solid ${upgrade.color}50`, color: upgrade.color }}
                            >
                              <i className="ri-arrow-up-circle-line mr-1" />Upgrade
                            </button>
                          )}
                          {!isPurchased && (isLocked || !isNext) && (
                            <span className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap" style={{ background: 'rgba(255,255,255,0.04)', color: '#374151', border: '1px solid rgba(255,255,255,0.06)' }}>
                              <i className="ri-lock-line mr-1" />Locked
                            </span>
                          )}
                        </div>

                        {/* Tier effects summary */}
                        {(isPurchased || isNext) && (
                          <div className="flex flex-wrap gap-2 mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8' }}>+{tier.sanitationBonus} Sanit.</span>
                            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>-{((1 - tier.diseaseVulnerabilityMod) * 100).toFixed(0)}% Vuln.</span>
                            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171' }}>-{(tier.spreadRateReduction * 100).toFixed(0)}% Spread</span>
                            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(192,132,252,0.1)', color: '#c084fc' }}>-{(tier.mortalityReduction * 100).toFixed(1)}% Mort.</span>
                            <span className="text-xs ml-auto font-semibold" style={{ color: '#6b7280' }}>
                              {tier.costMetal > 0 ? `${(tier.costMetal / 1000).toFixed(0)}k M` : ''}
                              {tier.costCrystal > 0 ? ` · ${(tier.costCrystal / 1000).toFixed(0)}k C` : ''}
                              {` · ${(tier.costCredits / 1000).toFixed(0)}k Cr`}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empire-wide summary */}
      <div
        className="rounded-xl p-5"
        style={{ background: 'rgba(10,15,30,0.9)', border: '1px solid rgba(56,189,248,0.15)' }}
      >
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <i className="ri-global-line text-cyan-400" />Empire-Wide Sanitation Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLONY_HEALTH_DATA.map(c => {
            const cs = sanitationStates[c.colonyId];
            const cStats = computeSanitationStats(cs);
            const effSan = Math.min(100, c.sanitationLevel + cStats.totalSanitationBonus);
            const sanColor = effSan > 75 ? '#38bdf8' : effSan > 50 ? '#fbbf24' : '#f87171';
            return (
              <div key={c.colonyId} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-xs font-bold text-white mb-2 truncate">{c.colonyName}</p>
                <div className="space-y-1.5">
                  <div>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-xs text-gray-500">Sanitation</span>
                      <span className="text-xs font-bold" style={{ color: sanColor }}>{effSan}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${effSan}%`, background: sanColor }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-xs text-gray-500">Vulnerability</span>
                      <span className="text-xs font-bold" style={{ color: cStats.effectiveVulnerabilityMod < 0.85 ? '#4ade80' : '#fbbf24' }}>
                        {Math.round(cStats.effectiveVulnerabilityMod * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${cStats.effectiveVulnerabilityMod * 100}%`, background: cStats.effectiveVulnerabilityMod < 0.85 ? '#4ade80' : '#fbbf24' }} />
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-600">
                  <span>{cStats.completedUpgrades} tiers</span>
                  <button
                    onClick={() => setSelectedColony(c.colonyId)}
                    className="cursor-pointer transition-all hover:text-cyan-400 whitespace-nowrap"
                    style={{ color: selectedColony === c.colonyId ? '#38bdf8' : undefined }}
                  >
                    {selectedColony === c.colonyId ? 'Selected' : 'Manage →'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Plague Response Protocol ─────────────────────────────────────────────────

const PRP_COST = {
  metal: 150000,
  crystal: 80000,
  deuterium: 50000,
  credits: 500000,
};

const PRP_EFFECTS = {
  sanitationSurge: 45,          // flat sanitation points during active window
  vulnerabilityMod: 0.30,       // disease vulnerability drops to 30% of base
  spreadRateBlock: 0.85,        // 85% spread rate reduction
  mortalitySlash: 0.90,         // 90% mortality reduction
  durationSeconds: 300,         // 5 min real-time surge window
  cooldownSeconds: 600,         // 10 min cooldown before reuse
};

interface PlaguePRPModalProps {
  onClose: () => void;
  prpStates: Record<string, PRPState>;
  onActivate: (colonyId: string) => void;
}

function PlaguePRPModal({ onClose, prpStates, onActivate }: PlaguePRPModalProps) {
  const [selectedColony, setSelectedColony] = useState<string | null>(null);
  const [phase, setPhase] = useState<'select' | 'confirm' | 'activating' | 'active'>('select');
  const [activationProgress, setActivationProgress] = useState(0);
  const [now, setNow] = useState(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  const criticalColonies = COLONY_HEALTH_DATA.filter(c =>
    c.diseases.length > 0 || c.healthScore < 50
  );

  const getColonyPRPState = (colonyId: string): PRPState =>
    prpStates[colonyId] ?? { activeUntil: null, cooldownUntil: null, activatedForColony: null };

  const isOnCooldown = (colonyId: string) => {
    const s = getColonyPRPState(colonyId);
    return s.cooldownUntil !== null && s.cooldownUntil > now;
  };

  const isActive = (colonyId: string) => {
    const s = getColonyPRPState(colonyId);
    return s.activeUntil !== null && s.activeUntil > now;
  };

  const cooldownSecsLeft = (colonyId: string) => {
    const s = getColonyPRPState(colonyId);
    if (!s.cooldownUntil) return 0;
    return Math.max(0, Math.ceil((s.cooldownUntil - now) / 1000));
  };

  const activeSecsLeft = (colonyId: string) => {
    const s = getColonyPRPState(colonyId);
    if (!s.activeUntil) return 0;
    return Math.max(0, Math.ceil((s.activeUntil - now) / 1000));
  };

  const formatSecs = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleActivate = () => {
    if (!selectedColony) return;
    setPhase('activating');
    setActivationProgress(0);
    let p = 0;
    intervalRef.current = setInterval(() => {
      p += 4;
      setActivationProgress(p);
      if (p >= 100) {
        clearInterval(intervalRef.current!);
        onActivate(selectedColony);
        setPhase('active');
      }
    }, 80);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const selectedColonyData = COLONY_HEALTH_DATA.find(c => c.colonyId === selectedColony);
  const activeDiseases = selectedColonyData
    ? DISEASES.filter(d => selectedColonyData.diseases.includes(d.id))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.92)' }}>
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(244,63,94,0.02) 2px, rgba(244,63,94,0.02) 4px)' }} />

      <div
        className="relative rounded-2xl w-full max-w-3xl overflow-hidden"
        style={{ background: '#05080f', border: '2px solid rgba(244,63,94,0.6)' }}
      >
        {/* Glowing top bar */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: 'linear-gradient(90deg, rgba(244,63,94,0.25) 0%, rgba(244,63,94,0.08) 60%, rgba(244,63,94,0.0) 100%)', borderBottom: '1px solid rgba(244,63,94,0.35)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse" style={{ background: 'rgba(244,63,94,0.2)', border: '2px solid rgba(244,63,94,0.6)' }}>
              <i className="ri-shield-flash-line text-2xl" style={{ color: '#f43f5e' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-wider">PLAGUE RESPONSE PROTOCOL</h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-black animate-pulse" style={{ background: 'rgba(244,63,94,0.25)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.5)' }}>EMERGENCY</span>
              </div>
              <p className="text-xs" style={{ color: 'rgba(244,63,94,0.8)' }}>Instant empire-wide sanitation surge · Heavy resource expenditure · Single colony target</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:bg-white/10" style={{ color: '#6b7280' }}>
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Phase: select or confirm or activating or active */}
          {(phase === 'select' || phase === 'confirm') && (
            <>
              {/* Resource cost warning */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.3)' }}>
                <p className="text-xs font-bold mb-3 flex items-center gap-1.5" style={{ color: '#f43f5e' }}>
                  <i className="ri-error-warning-line" />ACTIVATION COST — NON-REFUNDABLE
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { label: 'Metal', val: PRP_COST.metal, color: '#fcd34d', icon: 'ri-copper-coin-line' },
                    { label: 'Crystal', val: PRP_COST.crystal, color: '#60a5fa', icon: 'ri-drop-line' },
                    { label: 'Deuterium', val: PRP_COST.deuterium, color: '#4ade80', icon: 'ri-drop-line' },
                    { label: 'Credits', val: PRP_COST.credits, color: '#fbbf24', icon: 'ri-coins-line' },
                  ].map(r => (
                    <div key={r.label} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: `${r.color}0d`, border: `1px solid ${r.color}25` }}>
                      <i className={`${r.icon} text-base flex-shrink-0`} style={{ color: r.color }} />
                      <div>
                        <p className="text-xs font-black" style={{ color: r.color }}>{r.val.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{r.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Effects summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: 'Sanitation Surge', value: `+${PRP_EFFECTS.sanitationSurge} pts`, color: '#38bdf8', icon: 'ri-sparkling-2-line', sub: 'Instant flat boost' },
                  { label: 'Vulnerability', value: `-${((1 - PRP_EFFECTS.vulnerabilityMod) * 100).toFixed(0)}%`, color: '#4ade80', icon: 'ri-shield-check-line', sub: 'Disease resistance' },
                  { label: 'Spread Blocked', value: `-${(PRP_EFFECTS.spreadRateBlock * 100).toFixed(0)}%`, color: '#f87171', icon: 'ri-virus-line', sub: 'Outbreak containment' },
                  { label: 'Mortality Cut', value: `-${(PRP_EFFECTS.mortalitySlash * 100).toFixed(0)}%`, color: '#c084fc', icon: 'ri-heart-pulse-line', sub: 'Death rate slashed' },
                ].map(e => (
                  <div key={e.label} className="rounded-lg p-3 text-center" style={{ background: `${e.color}0d`, border: `1px solid ${e.color}25` }}>
                    <i className={`${e.icon} text-xl mb-1 block`} style={{ color: e.color }} />
                    <p className="text-base font-black" style={{ color: e.color }}>{e.value}</p>
                    <p className="text-xs text-gray-400 font-semibold">{e.label}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{e.sub}</p>
                  </div>
                ))}
              </div>

              {/* Duration info */}
              <div className="flex items-center gap-4 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-2">
                  <i className="ri-time-line text-amber-400" />
                  <span className="text-xs text-gray-400">Active window: <strong className="text-amber-400">{PRP_EFFECTS.durationSeconds / 60} minutes</strong></span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2">
                  <i className="ri-refresh-line text-gray-500" />
                  <span className="text-xs text-gray-400">Cooldown: <strong className="text-gray-300">{PRP_EFFECTS.cooldownSeconds / 60} minutes</strong> per colony</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2">
                  <i className="ri-planet-line text-cyan-400" />
                  <span className="text-xs text-gray-400">Targets: <strong className="text-cyan-400">Single colony</strong></span>
                </div>
              </div>

              {/* Colony selector */}
              <div>
                <p className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
                  <i className="ri-cursor-line text-red-400" />Select Target Colony
                  {criticalColonies.length > 0 && (
                    <span className="ml-1 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(244,63,94,0.15)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' }}>
                      {criticalColonies.length} colonies in crisis
                    </span>
                  )}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {COLONY_HEALTH_DATA.map(c => {
                    const onCD = isOnCooldown(c.colonyId);
                    const alreadyActive = isActive(c.colonyId);
                    const cdLeft = cooldownSecsLeft(c.colonyId);
                    const activeLeft = activeSecsLeft(c.colonyId);
                    const diseases = DISEASES.filter(d => c.diseases.includes(d.id));
                    const isSel = selectedColony === c.colonyId;
                    const isUnavailable = onCD || alreadyActive;

                    return (
                      <button
                        key={c.colonyId}
                        onClick={() => !isUnavailable && setSelectedColony(isSel ? null : c.colonyId)}
                        disabled={isUnavailable}
                        className="rounded-xl overflow-hidden text-left transition-all"
                        style={{
                          border: `2px solid ${alreadyActive ? 'rgba(74,222,128,0.5)' : onCD ? 'rgba(255,255,255,0.08)' : isSel ? 'rgba(244,63,94,0.7)' : 'rgba(255,255,255,0.1)'}`,
                          background: alreadyActive ? 'rgba(74,222,128,0.07)' : onCD ? 'rgba(255,255,255,0.02)' : isSel ? 'rgba(244,63,94,0.1)' : 'rgba(255,255,255,0.03)',
                          opacity: onCD ? 0.5 : 1,
                          cursor: isUnavailable ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <div className="flex items-start gap-3 p-3">
                          <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={c.image} alt={c.colonyName} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-sm font-black text-white">{c.colonyName}</span>
                              {alreadyActive && (
                                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: 'rgba(74,222,128,0.2)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.4)' }}>
                                  <i className="ri-shield-flash-line mr-1" />ACTIVE {formatSecs(activeLeft)}
                                </span>
                              )}
                              {onCD && (
                                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: 'rgba(255,255,255,0.07)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.1)' }}>
                                  <i className="ri-time-line mr-1" />CD {formatSecs(cdLeft)}
                                </span>
                              )}
                              {!alreadyActive && !onCD && (
                                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}>
                                  READY
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mb-1.5">{c.type} · {c.coordinates} · Health {c.healthScore}%</p>
                            {diseases.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {diseases.map(d => (
                                  <span key={d.id} className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${d.color}18`, color: d.color, border: `1px solid ${d.color}30` }}>
                                    <i className={`${d.icon} mr-1`} />{d.name}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-600">No active diseases</span>
                            )}
                          </div>
                          {isSel && !isUnavailable && (
                            <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#f43f5e' }}>
                              <i className="ri-check-line text-xs text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Confirm row */}
              {phase === 'select' && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => selectedColony && setPhase('confirm')}
                    disabled={!selectedColony}
                    className="flex-1 py-3 rounded-xl text-sm font-black transition-all cursor-pointer whitespace-nowrap"
                    style={{
                      background: selectedColony ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.04)',
                      border: `2px solid ${selectedColony ? 'rgba(244,63,94,0.6)' : 'rgba(255,255,255,0.08)'}`,
                      color: selectedColony ? '#f43f5e' : '#374151',
                    }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <i className="ri-shield-flash-line" />
                      {selectedColony ? `Activate PRP on ${COLONY_HEALTH_DATA.find(c => c.colonyId === selectedColony)?.colonyName}` : 'Select a Colony First'}
                    </span>
                  </button>
                  <button onClick={onClose} className="px-5 py-3 rounded-xl text-sm text-gray-400 cursor-pointer whitespace-nowrap transition-all hover:bg-white/5" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                    Cancel
                  </button>
                </div>
              )}

              {phase === 'confirm' && selectedColonyData && (
                <div className="rounded-xl p-4 space-y-4" style={{ background: 'rgba(244,63,94,0.1)', border: '2px solid rgba(244,63,94,0.5)' }}>
                  <div className="flex items-start gap-3">
                    <i className="ri-error-warning-fill text-2xl flex-shrink-0 mt-0.5" style={{ color: '#f43f5e' }} />
                    <div>
                      <p className="text-sm font-black text-white mb-1">FINAL CONFIRMATION REQUIRED</p>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        You are about to expend <strong className="text-amber-400">150,000 Metal · 80,000 Crystal · 50,000 Deuterium · 500,000 Credits</strong> to activate
                        the Plague Response Protocol on <strong className="text-white">{selectedColonyData.colonyName}</strong>.
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        The surge will last <strong className="text-red-400">{PRP_EFFECTS.durationSeconds / 60} minutes</strong> before returning to baseline. Colony will then be on cooldown for {PRP_EFFECTS.cooldownSeconds / 60} minutes. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleActivate}
                      className="flex-1 py-3 rounded-xl text-sm font-black transition-all cursor-pointer whitespace-nowrap animate-pulse"
                      style={{ background: 'rgba(244,63,94,0.3)', border: '2px solid rgba(244,63,94,0.8)', color: '#f43f5e' }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <i className="ri-shield-flash-line" />CONFIRM — ACTIVATE PLAGUE RESPONSE
                      </span>
                    </button>
                    <button onClick={() => setPhase('select')} className="px-5 py-3 rounded-xl text-sm text-gray-400 cursor-pointer whitespace-nowrap hover:bg-white/5 transition-all" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                      Back
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Activating phase */}
          {phase === 'activating' && (
            <div className="py-8 flex flex-col items-center gap-6">
              <div className="relative w-28 h-28">
                {/* Outer pulse rings */}
                <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(244,63,94,0.15)', animationDuration: '1s' }} />
                <div className="absolute inset-2 rounded-full animate-ping" style={{ background: 'rgba(244,63,94,0.1)', animationDuration: '1.3s' }} />
                <div className="w-28 h-28 rounded-full flex items-center justify-center relative" style={{ background: 'rgba(244,63,94,0.2)', border: '3px solid rgba(244,63,94,0.7)' }}>
                  <i className="ri-shield-flash-line text-5xl" style={{ color: '#f43f5e' }} />
                </div>
              </div>
              <div className="w-full max-w-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-red-400">ACTIVATING PLAGUE RESPONSE PROTOCOL...</span>
                  <span className="text-xs font-black text-red-400">{activationProgress}%</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-3 rounded-full transition-all duration-75"
                    style={{
                      width: `${activationProgress}%`,
                      background: 'linear-gradient(90deg, #f43f5e, #fb923c, #fbbf24)',
                    }}
                  />
                </div>
                <div className="mt-3 space-y-1">
                  {[
                    { threshold: 20, label: 'Deploying emergency sanitation teams...' },
                    { threshold: 40, label: 'Activating nano-purge swarms...' },
                    { threshold: 60, label: 'Engaging UV sterilization grids...' },
                    { threshold: 80, label: 'Flooding colony with antiviral compounds...' },
                    { threshold: 95, label: 'Locking down disease vectors...' },
                  ].map(step => (
                    <div key={step.threshold} className="flex items-center gap-2">
                      {activationProgress >= step.threshold ? (
                        <i className="ri-check-line text-xs" style={{ color: '#4ade80' }} />
                      ) : (
                        <i className="ri-loader-4-line text-xs animate-spin" style={{ color: activationProgress >= step.threshold - 20 ? '#f43f5e' : '#374151' }} />
                      )}
                      <span className="text-xs" style={{ color: activationProgress >= step.threshold ? '#4ade80' : activationProgress >= step.threshold - 20 ? '#9ca3af' : '#374151' }}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active phase success */}
          {phase === 'active' && selectedColonyData && (
            <div className="py-6 flex flex-col items-center gap-5 text-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.15)', border: '3px solid rgba(74,222,128,0.6)' }}>
                  <i className="ri-shield-check-line text-5xl" style={{ color: '#4ade80' }} />
                </div>
              </div>
              <div>
                <p className="text-xl font-black text-white mb-1">PROTOCOL ACTIVE</p>
                <p className="text-sm text-gray-400">Plague Response Protocol successfully deployed on <strong className="text-white">{selectedColonyData.colonyName}</strong></p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
                {[
                  { label: 'Sanitation', value: `+${PRP_EFFECTS.sanitationSurge} pts`, color: '#38bdf8' },
                  { label: 'Vulnerability', value: `-70%`, color: '#4ade80' },
                  { label: 'Spread', value: `-85%`, color: '#f87171' },
                  { label: 'Mortality', value: `-90%`, color: '#c084fc' },
                ].map(e => (
                  <div key={e.label} className="rounded-lg py-2 px-3" style={{ background: `${e.color}12`, border: `1px solid ${e.color}30` }}>
                    <p className="text-sm font-black" style={{ color: e.color }}>{e.value}</p>
                    <p className="text-xs text-gray-500">{e.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)' }}>
                <i className="ri-time-line text-green-400 text-sm" />
                <span className="text-xs font-bold text-green-400">Active for {PRP_EFFECTS.durationSeconds / 60} minutes · then {PRP_EFFECTS.cooldownSeconds / 60} min cooldown</span>
              </div>
              <button
                onClick={onClose}
                className="px-8 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all"
                style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.4)', color: '#4ade80' }}
              >
                Close & Monitor
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Active PRP Status Strip ─────────────────────────────────────────────────

function ActivePRPStrip({ prpStates, onOpenPRP }: { prpStates: Record<string, PRPState>; onOpenPRP: () => void }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const active = Object.entries(prpStates)
    .filter(([, s]) => s.activeUntil !== null && s.activeUntil > now)
    .map(([colonyId, s]) => ({
      colonyId,
      colony: COLONY_HEALTH_DATA.find(c => c.colonyId === colonyId),
      secsLeft: Math.max(0, Math.ceil(((s.activeUntil ?? 0) - now) / 1000)),
      totalSecs: PRP_EFFECTS.durationSeconds,
    }));

  if (active.length === 0) return null;

  return (
    <div
      className="px-6 py-2 flex items-center gap-4 overflow-x-auto"
      style={{ background: 'rgba(74,222,128,0.08)', borderBottom: '1px solid rgba(74,222,128,0.25)' }}
    >
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-5 h-5 flex items-center justify-center">
          <i className="ri-shield-flash-line text-sm animate-pulse" style={{ color: '#4ade80' }} />
        </div>
        <span className="text-xs font-black" style={{ color: '#4ade80' }}>PRP ACTIVE</span>
      </div>
      {active.map(({ colonyId, colony, secsLeft, totalSecs }) => (
        <div key={colonyId} className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-400">{colony?.colonyName ?? colonyId}</span>
          <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-1.5 rounded-full transition-all"
              style={{ width: `${(secsLeft / totalSecs) * 100}%`, background: 'linear-gradient(90deg,#4ade80,#22d3ee)' }}
            />
          </div>
          <span className="text-xs font-bold" style={{ color: '#4ade80' }}>
            {Math.floor(secsLeft / 60)}:{String(secsLeft % 60).padStart(2, '0')}
          </span>
        </div>
      ))}
      <button
        onClick={onOpenPRP}
        className="ml-auto flex-shrink-0 text-xs px-3 py-1 rounded-lg cursor-pointer whitespace-nowrap transition-all hover:scale-105"
        style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.4)', color: '#4ade80' }}
      >
        <i className="ri-add-line mr-1" />Deploy Another
      </button>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'ri-dashboard-3-line', color: '#00d4ff' },
  { id: 'health-dashboard', label: 'Health Dashboard', icon: 'ri-pulse-line', color: '#4ade80' },
  { id: 'supply-emergency', label: 'Supply Emergency', icon: 'ri-send-plane-fill', color: '#fb923c' },
  { id: 'food', label: 'Food', icon: 'ri-restaurant-2-line', color: '#4ade80' },
  { id: 'water', label: 'Water', icon: 'ri-drop-line', color: '#38bdf8' },
  { id: 'disease', label: 'Disease Control', icon: 'ri-virus-line', color: '#f87171' },
  { id: 'spread-map', label: 'Spread Map', icon: 'ri-radar-line', color: '#f43f5e' },
  { id: 'supply', label: 'Supply Chain', icon: 'ri-truck-line', color: '#fbbf24' },
  { id: 'sanitation', label: 'Sanitation Upgrades', icon: 'ri-shield-check-line', color: '#38bdf8' },
  { id: 'bio-research', label: 'Bio-Research Lab', icon: 'ri-test-tube-line', color: '#4ade80' },
];

export default function FoodWaterDiseasePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const activeDiseaseCount = DISEASES.filter(d => d.daysActive !== undefined).length;

  // ── Quarantine state lifted to page level so all panels stay in sync ──
  const initialQuarantined = new Set(
    COLONY_HEALTH_DATA.filter(c => c.quarantined).map(c => c.colonyId)
  );
  const [quarantinedIds, setQuarantinedIds] = useState<Set<string>>(initialQuarantined);

  // ── Plague Response Protocol state ──
  const [showPRP, setShowPRP] = useState(false);
  const [prpStates, setPrpStates] = useState<Record<string, PRPState>>({});

  const handlePRPActivate = useCallback((colonyId: string) => {
    const now = Date.now();
    setPrpStates(prev => ({
      ...prev,
      [colonyId]: {
        activeUntil: now + PRP_EFFECTS.durationSeconds * 1000,
        cooldownUntil: now + (PRP_EFFECTS.durationSeconds + PRP_EFFECTS.cooldownSeconds) * 1000,
        activatedForColony: colonyId,
      },
    }));
  }, []);

  // ── Bio-Research state ──
  const [bioResearchState, setBioResearchState] = useState<BioResearchState>({
    completedIds: [],
    researchingId: null,
    researchStartTime: null,
  });

  const handleStartResearch = useCallback((id: string) => {
    setBioResearchState(prev => ({
      ...prev,
      researchingId: id,
      researchStartTime: Date.now(),
    }));
  }, []);

  const handleCompleteResearch = useCallback((id: string) => {
    setBioResearchState(prev => {
      if (prev.completedIds.includes(id)) return prev;
      return {
        completedIds: [...prev.completedIds, id],
        researchingId: null,
        researchStartTime: null,
      };
    });
  }, []);

  // ── Sanitation state per colony ──
  const [sanitationStates, setSanitationStates] = useState<Record<string, ColonySanitationState>>(() => {
    const initial: Record<string, ColonySanitationState> = {};
    COLONY_HEALTH_DATA.forEach(c => {
      initial[c.colonyId] = { colonyId: c.colonyId, upgradeLevel: {} };
    });
    // Pre-fill homeworld with some upgrades to showcase the system
    initial['homeworld'] = {
      colonyId: 'homeworld',
      upgradeLevel: { waste_management: 2, water_purification: 1 },
    };
    return initial;
  });

  const handleUpgrade = useCallback((colonyId: string, upgradeId: string) => {
    setSanitationStates(prev => {
      const colonyState = prev[colonyId];
      const currentLevel = colonyState.upgradeLevel[upgradeId] ?? 0;
      const upgrade = SANITATION_UPGRADES.find(u => u.id === upgradeId);
      if (!upgrade || currentLevel >= upgrade.tiers.length) return prev;
      return {
        ...prev,
        [colonyId]: {
          ...colonyState,
          upgradeLevel: { ...colonyState.upgradeLevel, [upgradeId]: currentLevel + 1 },
        },
      };
    });
  }, []);

  const handleQuarantineToggle = useCallback((colonyId: string) => {
    setQuarantinedIds(prev => {
      const next = new Set(prev);
      if (next.has(colonyId)) {
        next.delete(colonyId);
      } else {
        next.add(colonyId);
      }
      return next;
    });
  }, []);

  // Ticker state
  const [tickerPos, setTickerPos] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTickerPos(p => p - 1), 20);
    return () => clearInterval(interval);
  }, []);

  const tickerMessages = [
    '⚠ Void Fever spreading in Mining Colony Beta — 1,240 infected',
    '🔴 CRITICAL: Nano Plague at Outer Rim Post Delta — 5,600+ infected — QUARANTINE IN EFFECT',
    '💧 Water contamination detected at Research Station Gamma',
    '🌿 Homeworld Alpha algae yield +340% — 12h food surplus secured',
    '🚢 Food import routes to Outer Rim disrupted by pirate activity',
    '⚗ Crystal Blight fungal spores quarantined at Research Station Gamma',
  ];
  const fullMsg = tickerMessages.join('   ·   ');

  const tickerStyle = { transform: `translateX(${tickerPos % (fullMsg.length * 8)}px)`, whiteSpace: 'nowrap' as const };

  // Any active PRPs for status bar
  const activePRPs = Object.entries(prpStates).filter(
    ([, s]) => s.activeUntil !== null && s.activeUntil > Date.now()
  );

  return (
    <div className="text-white">
      {/* PRP Modal */}
      {showPRP && (
        <PlaguePRPModal
          prpStates={prpStates}
          onActivate={handlePRPActivate}
          onClose={() => setShowPRP(false)}
        />
      )}
      {/* Ticker */}
      <div
        className="overflow-hidden px-4 py-1.5"
        style={{ background: 'rgba(244,63,94,0.1)', borderBottom: '1px solid rgba(244,63,94,0.2)' }}
      >
        <div className="text-xs" style={{ color: '#f87171', ...tickerStyle }}>
          {fullMsg} &nbsp;&nbsp;&nbsp; {fullMsg}
        </div>
      </div>

      {/* Active PRP status strip */}
      {activePRPs.length > 0 && (
        <ActivePRPStrip prpStates={prpStates} onOpenPRP={() => setShowPRP(true)} />
      )}

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tab Bar */}
        <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap relative"
                style={{
                  background: active ? `${tab.color}18` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? `${tab.color}45` : 'rgba(255,255,255,0.08)'}`,
                  color: active ? tab.color : '#6b7a95',
                }}
              >
                <i className={`${tab.icon} text-sm`} />
                {tab.label}
                {tab.id === 'disease' && activeDiseaseCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: '#f43f5e', color: '#fff', fontSize: 9 }}
                  >
                    {activeDiseaseCount}
                  </span>
                )}
                {tab.id === 'health-dashboard' && (() => {
                  const atRisk = COLONY_HEALTH_DATA.filter(c => c.healthScore < 60).length;
                  return atRisk > 0 ? (
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-black animate-pulse"
                      style={{ background: '#fbbf24', color: '#000', fontSize: 9 }}
                    >
                      {atRisk}
                    </span>
                  ) : null;
                })()}
                {tab.id === 'supply-emergency' && (() => {
                  const critDeficit = COLONY_HEALTH_DATA.filter(c => c.foodSurplus < -200 || c.waterSurplus < -200).length;
                  return critDeficit > 0 ? (
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-black animate-pulse"
                      style={{ background: '#fb923c', color: '#000', fontSize: 9 }}
                    >
                      {critDeficit}
                    </span>
                  ) : null;
                })()}
                {tab.id === 'spread-map' && activeDiseaseCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-black animate-pulse"
                    style={{ background: '#f43f5e', color: '#fff', fontSize: 9 }}
                  >
                    !
                  </span>
                )}
                {tab.id === 'bio-research' && (() => {
                  const avail = BIO_RESEARCH_TREE.filter(
                    r => (!r.requiresResearch || r.requiresResearch.every(id => bioResearchState.completedIds.includes(id)))
                      && !bioResearchState.completedIds.includes(r.id)
                      && bioResearchState.researchingId !== r.id
                  ).length;
                  return avail > 0 ? (
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-black"
                      style={{ background: '#4ade80', color: '#000', fontSize: 9 }}
                    >
                      {avail}
                    </span>
                  ) : null;
                })()}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <OverviewPanel
            quarantinedIds={quarantinedIds}
            onQuarantineToggle={handleQuarantineToggle}
            sanitationStates={sanitationStates}
            prpStates={prpStates}
            onOpenPRP={() => setShowPRP(true)}
          />
        )}
        {activeTab === 'health-dashboard' && (
          <ColonyHealthDashboard
            sanitationStates={sanitationStates}
            prpStates={prpStates}
            quarantinedIds={quarantinedIds}
            onOpenPRP={() => setShowPRP(true)}
          />
        )}
        {activeTab === 'supply-emergency' && <SupplyEmergencyResponse />}
        {activeTab === 'food' && <FoodPanel />}
        {activeTab === 'water' && <WaterPanel />}
        {activeTab === 'disease' && <DiseasePanel />}
        {activeTab === 'spread-map' && (
          <DiseaseSpreadMap
            quarantinedIds={quarantinedIds}
            sanitationStates={sanitationStates}
            prpStates={prpStates}
            onOpenPRP={() => setShowPRP(true)}
          />
        )}
        {activeTab === 'bio-research' && (
          <BioResearchLab
            researchState={bioResearchState}
            onStartResearch={handleStartResearch}
            onCompleteResearch={handleCompleteResearch}
          />
        )}
        {activeTab === 'supply' && (
          <SupplyPanel
            quarantinedIds={quarantinedIds}
            onQuarantineToggle={handleQuarantineToggle}
          />
        )}
        {activeTab === 'sanitation' && (
          <SanitationPanel
            sanitationStates={sanitationStates}
            onUpgrade={handleUpgrade}
            prpStates={prpStates}
            onOpenPRP={() => setShowPRP(true)}
          />
        )}
      </div>
    </div>
  );
}