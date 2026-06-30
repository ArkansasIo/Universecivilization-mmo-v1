import { useState, useEffect, useRef, useCallback } from 'react';
import {
  COLONY_HEALTH_DATA,
  DISEASES,
  SANITATION_UPGRADES,
  computeSanitationStats,
  type ColonyHealth,
  type Disease,
  type ColonySanitationState,
} from '@/data/foodWaterDisease';

// ─── PRP state (mirrored from page) ──────────────────────────────────────────
interface PRPState {
  activeUntil: number | null;
  cooldownUntil: number | null;
  activatedForColony: string | null;
}

// ─── Risk calculation helpers ─────────────────────────────────────────────────

const PRP_EFFECTS_SPREAD_BLOCK = 0.85;
const PRP_EFFECTS_VULNERABILITY_MOD = 0.30;

function getEffectiveSanitationScore(
  colony: ColonyHealth,
  sanitationStates: Record<string, ColonySanitationState>,
  prpStates: Record<string, PRPState>,
  now: number
): {
  sanitation: number;
  vulnerability: number;
  spreadMod: number;
  mortalityMod: number;
  prpActive: boolean;
  sanitationUpgrades: number;
} {
  const state = sanitationStates[colony.colonyId];
  const stats = state ? computeSanitationStats(state) : null;
  const baseSanitation = stats ? Math.min(100, colony.sanitationLevel + stats.totalSanitationBonus) : colony.sanitationLevel;
  const baseVuln = stats ? stats.effectiveVulnerabilityMod : 1.0;
  const baseSpreadMod = stats ? stats.totalSpreadReduction : 0;

  const prp = prpStates[colony.colonyId];
  const prpActive = prp?.activeUntil != null && prp.activeUntil > now;
  const prpSanBonus = prpActive ? 45 : 0;
  const prpVulnMod = prpActive ? PRP_EFFECTS_VULNERABILITY_MOD : 1.0;
  const prpSpreadBlock = prpActive ? PRP_EFFECTS_SPREAD_BLOCK : 0;

  const finalSanitation = Math.min(100, baseSanitation + prpSanBonus);
  const finalVuln = baseVuln * prpVulnMod;
  const finalSpreadMod = Math.min(0.99, baseSpreadMod + prpSpreadBlock);

  return {
    sanitation: finalSanitation,
    vulnerability: finalVuln,
    spreadMod: finalSpreadMod,
    mortalityMod: stats?.totalMortalityReduction ?? 0,
    prpActive,
    sanitationUpgrades: stats?.completedUpgrades ?? 0,
  };
}

// Base spread risk from A to B (ignoring sanitation & quarantine at B)
function computeRawSpreadRisk(
  source: ColonyHealth,
  target: ColonyHealth,
  disease: Disease,
  sourceEffective: ReturnType<typeof getEffectiveSanitationScore>,
  quarantinedIds: Set<string>
): number {
  if (!source.diseases.includes(disease.id)) return 0;
  if (target.diseases.includes(disease.id)) return 0;

  const baseRisk = disease.spreadRate;
  // Quarantine on source: massively reduces spread
  const sourceQ = quarantinedIds.has(source.colonyId) ? 0.05 : 1.0;
  // PRP on source reduces spread
  const sourcePRP = sourceEffective.prpActive ? (1 - PRP_EFFECTS_SPREAD_BLOCK) : 1.0;
  // Source sanitation upgrade spread reduction
  const sourceSanMod = 1 - sourceEffective.spreadMod;

  return baseRisk * sourceQ * sourcePRP * sourceSanMod;
}

// Net risk that target colony will contract disease
function computeInboundRisk(
  target: ColonyHealth,
  allColonies: ColonyHealth[],
  disease: Disease,
  sanitationStates: Record<string, ColonySanitationState>,
  prpStates: Record<string, PRPState>,
  quarantinedIds: Set<string>,
  now: number
): number {
  if (target.diseases.includes(disease.id)) return 0;
  const targetEff = getEffectiveSanitationScore(target, sanitationStates, prpStates, now);
  const targetQ = quarantinedIds.has(target.colonyId) ? 0.05 : 1.0;
  const targetVuln = targetEff.vulnerability;

  let totalRisk = 0;
  for (const source of allColonies) {
    if (source.colonyId === target.colonyId) continue;
    if (!source.diseases.includes(disease.id)) continue;
    const sourceEff = getEffectiveSanitationScore(source, sanitationStates, prpStates, now);
    const rawRisk = computeRawSpreadRisk(source, target, disease, sourceEff, quarantinedIds);
    totalRisk += rawRisk * targetQ * targetVuln;
  }

  return Math.min(1, totalRisk);
}

// Compute per-colony risk summary
interface ColonyRiskProfile {
  colonyId: string;
  colony: ColonyHealth;
  overallRisk: number;        // 0–1
  riskTier: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  inboundThreats: { diseaseId: string; risk: number; fromColony: string }[];
  activeDiseaseSeverity: number; // avg spread rate of active diseases
  effective: ReturnType<typeof getEffectiveSanitationScore>;
}

function getRiskTier(risk: number): ColonyRiskProfile['riskTier'] {
  if (risk < 0.05) return 'safe';
  if (risk < 0.15) return 'low';
  if (risk < 0.30) return 'medium';
  if (risk < 0.55) return 'high';
  return 'critical';
}

const RISK_CONFIG: Record<ColonyRiskProfile['riskTier'], { color: string; bg: string; border: string; label: string; pulse: boolean }> = {
  safe:     { color: '#4ade80', bg: 'rgba(74,222,128,0.12)',    border: 'rgba(74,222,128,0.45)',   label: 'SAFE',     pulse: false },
  low:      { color: '#a3e635', bg: 'rgba(163,230,53,0.10)',    border: 'rgba(163,230,53,0.35)',   label: 'LOW RISK', pulse: false },
  medium:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',    border: 'rgba(251,191,36,0.45)',   label: 'MEDIUM',   pulse: false },
  high:     { color: '#f87171', bg: 'rgba(248,113,113,0.14)',   border: 'rgba(248,113,113,0.5)',   label: 'HIGH RISK',pulse: true },
  critical: { color: '#f43f5e', bg: 'rgba(244,63,94,0.18)',     border: 'rgba(244,63,94,0.7)',     label: 'CRITICAL', pulse: true },
};

// ─── Spread line helper ────────────────────────────────────────────────────────

interface SpreadEdge {
  fromId: string;
  toId: string;
  diseaseId: string;
  risk: number;
  disease: Disease;
}

// ─── Colony node positions (% based for responsive layout) ────────────────────

const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  homeworld:       { x: 30, y: 25 },
  mining_beta:     { x: 68, y: 20 },
  research_gamma:  { x: 20, y: 65 },
  outer_rim_delta: { x: 72, y: 72 },
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface DiseaseSpreadMapProps {
  quarantinedIds: Set<string>;
  sanitationStates: Record<string, ColonySanitationState>;
  prpStates: Record<string, PRPState>;
  onOpenPRP: () => void;
}

// ─── Animated dashed line component ──────────────────────────────────────────

function SpreadLine({
  x1, y1, x2, y2,
  risk,
  color,
  animated,
}: {
  x1: number; y1: number; x2: number; y2: number;
  risk: number; color: string; animated: boolean;
}) {
  const strokeWidth = 1 + risk * 4;
  const opacity = 0.3 + risk * 0.6;

  return (
    <g>
      {/* Background glow */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={strokeWidth + 4}
        strokeOpacity={opacity * 0.15}
        strokeLinecap="round"
      />
      {/* Main line */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity={opacity}
        strokeLinecap="round"
        strokeDasharray={animated ? '6 4' : '2 5'}
        style={animated ? { animation: `spreadFlow 1.2s linear infinite` } : undefined}
      />
    </g>
  );
}

// ─── Colony node ──────────────────────────────────────────────────────────────

function ColonyNode({
  colony,
  profile,
  isSelected,
  isQuarantined,
  cx, cy,
  onClick,
}: {
  colony: ColonyHealth;
  profile: ColonyRiskProfile;
  isSelected: boolean;
  isQuarantined: boolean;
  cx: number; cy: number;
  onClick: () => void;
}) {
  const cfg = RISK_CONFIG[profile.riskTier];
  const hasDisease = colony.diseases.length > 0;
  const r = 28;

  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }} className="colony-node">
      {/* Pulse ring for high/critical */}
      {cfg.pulse && (
        <>
          <circle cx={cx} cy={cy} r={r + 14} fill="none" stroke={cfg.color} strokeWidth="1" strokeOpacity="0.25"
            style={{ animation: 'nodePulse 2s ease-out infinite' }} />
          <circle cx={cx} cy={cy} r={r + 8} fill="none" stroke={cfg.color} strokeWidth="1.5" strokeOpacity="0.4"
            style={{ animation: 'nodePulse 2s ease-out infinite', animationDelay: '0.5s' }} />
        </>
      )}

      {/* Selected ring */}
      {isSelected && (
        <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke="#fff" strokeWidth="2" strokeOpacity="0.7"
          strokeDasharray="4 3" style={{ animation: 'spinSlow 8s linear infinite' }} />
      )}

      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r + 3} fill="none" stroke={cfg.color} strokeWidth="1.5" strokeOpacity="0.6" />

      {/* Main circle */}
      <circle cx={cx} cy={cy} r={r} fill={cfg.bg} stroke={cfg.color} strokeWidth={isSelected ? 2.5 : 1.5} />

      {/* Health indicator arc */}
      {(() => {
        const pct = colony.healthScore / 100;
        const arcR = r - 4;
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + pct * 2 * Math.PI;
        const x1 = cx + arcR * Math.cos(startAngle);
        const y1 = cy + arcR * Math.sin(startAngle);
        const x2 = cx + arcR * Math.cos(endAngle);
        const y2 = cy + arcR * Math.sin(endAngle);
        const large = pct > 0.5 ? 1 : 0;
        const healthColor = colony.healthScore > 70 ? '#4ade80' : colony.healthScore > 40 ? '#fbbf24' : '#f43f5e';
        return (
          <path
            d={`M ${x1} ${y1} A ${arcR} ${arcR} 0 ${large} 1 ${x2} ${y2}`}
            fill="none"
            stroke={healthColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />
        );
      })()}

      {/* Disease biohazard icon */}
      {hasDisease && (
        <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="middle"
          fontSize="16" fill={cfg.color} fontFamily="remixicon" style={{ userSelect: 'none' }}>
          ☣
        </text>
      )}
      {!hasDisease && (
        <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="middle"
          fontSize="14" fill={cfg.color} fontFamily="remixicon" style={{ userSelect: 'none' }}>
          ✦
        </text>
      )}

      {/* Quarantine lock badge */}
      {isQuarantined && (
        <g>
          <circle cx={cx + r - 4} cy={cy - r + 4} r={9} fill="#fbbf24" stroke="#0a1020" strokeWidth="1.5" />
          <text x={cx + r - 4} y={cy - r + 5} textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fill="#0a1020" fontWeight="bold" style={{ userSelect: 'none' }}>🔒</text>
        </g>
      )}

      {/* PRP active badge */}
      {profile.effective.prpActive && (
        <g>
          <circle cx={cx - r + 4} cy={cy - r + 4} r={9} fill="#4ade80" stroke="#0a1020" strokeWidth="1.5" />
          <text x={cx - r + 4} y={cy - r + 5} textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fill="#0a1020" style={{ userSelect: 'none' }}>⚡</text>
        </g>
      )}

      {/* Colony name label */}
      <text x={cx} y={cy + r + 14} textAnchor="middle"
        fontSize="10" fill="white" fontWeight="bold" style={{ userSelect: 'none' }}>
        {colony.colonyName.split(' ').slice(0, 2).join(' ')}
      </text>
      <text x={cx} y={cy + r + 26} textAnchor="middle"
        fontSize="9" fill={cfg.color} style={{ userSelect: 'none' }}>
        {cfg.label}
      </text>
    </g>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DiseaseSpreadMap({
  quarantinedIds,
  sanitationStates,
  prpStates,
  onOpenPRP,
}: DiseaseSpreadMapProps) {
  const [now, setNow] = useState(Date.now());
  const [selectedColony, setSelectedColony] = useState<string | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<string | 'all'>('all');
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgSize, setSvgSize] = useState({ w: 800, h: 480 });

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  // Observe SVG container size
  useEffect(() => {
    const el = svgRef.current?.parentElement;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      for (const e of entries) {
        setSvgSize({ w: e.contentRect.width, h: Math.max(420, e.contentRect.width * 0.55) });
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Compute risk profiles
  const profiles: Record<string, ColonyRiskProfile> = {};
  for (const colony of COLONY_HEALTH_DATA) {
    const effective = getEffectiveSanitationScore(colony, sanitationStates, prpStates, now);
    const inboundThreats: ColonyRiskProfile['inboundThreats'] = [];
    let overallRisk = 0;

    const activeDiseases = DISEASES.filter(d => d.daysActive !== undefined);
    for (const disease of activeDiseases) {
      if (colony.diseases.includes(disease.id)) continue;
      const risk = computeInboundRisk(colony, COLONY_HEALTH_DATA, disease, sanitationStates, prpStates, quarantinedIds, now);
      if (risk > 0.01) {
        const fromColony = COLONY_HEALTH_DATA.find(c => c.diseases.includes(disease.id) && c.colonyId !== colony.colonyId);
        inboundThreats.push({ diseaseId: disease.id, risk, fromColony: fromColony?.colonyName ?? 'Unknown' });
        overallRisk = Math.max(overallRisk, risk);
      }
    }

    const activeDiseaseSeverity = colony.diseases.length > 0
      ? colony.diseases.reduce((s, did) => {
          const d = DISEASES.find(x => x.id === did);
          return s + (d?.spreadRate ?? 0);
        }, 0) / colony.diseases.length
      : 0;

    profiles[colony.colonyId] = {
      colonyId: colony.colonyId,
      colony,
      overallRisk,
      riskTier: getRiskTier(overallRisk),
      inboundThreats,
      activeDiseaseSeverity,
      effective,
    };
  }

  // Compute spread edges
  const edges: SpreadEdge[] = [];
  const activeDiseases = DISEASES.filter(d => d.daysActive !== undefined);
  for (const disease of activeDiseases) {
    if (selectedDisease !== 'all' && selectedDisease !== disease.id) continue;
    for (const source of COLONY_HEALTH_DATA) {
      if (!source.diseases.includes(disease.id)) continue;
      const sourceEff = getEffectiveSanitationScore(source, sanitationStates, prpStates, now);
      for (const target of COLONY_HEALTH_DATA) {
        if (target.colonyId === source.colonyId) continue;
        if (target.diseases.includes(disease.id)) continue;
        const rawRisk = computeRawSpreadRisk(source, target, disease, sourceEff, quarantinedIds);
        const targetEff = getEffectiveSanitationScore(target, sanitationStates, prpStates, now);
        const netRisk = rawRisk * (quarantinedIds.has(target.colonyId) ? 0.05 : 1.0) * targetEff.vulnerability;
        if (netRisk > 0.01) {
          edges.push({ fromId: source.colonyId, toId: target.colonyId, diseaseId: disease.id, risk: netRisk, disease });
        }
      }
    }
  }

  const getNodeCenter = useCallback((colonyId: string) => {
    const pos = NODE_POSITIONS[colonyId] ?? { x: 50, y: 50 };
    return { cx: (pos.x / 100) * svgSize.w, cy: (pos.y / 100) * svgSize.h };
  }, [svgSize]);

  const selectedProfile = selectedColony ? profiles[selectedColony] : null;
  const selectedColonyData = selectedColony ? COLONY_HEALTH_DATA.find(c => c.colonyId === selectedColony) : null;

  // Empire-wide summary stats
  const highRiskCount = Object.values(profiles).filter(p => p.riskTier === 'high' || p.riskTier === 'critical').length;
  const safeCount = Object.values(profiles).filter(p => p.riskTier === 'safe').length;
  const totalEdgeRisk = edges.reduce((s, e) => s + e.risk, 0);
  const avgSanitation = Math.round(
    Object.values(profiles).reduce((s, p) => s + p.effective.sanitation, 0) / COLONY_HEALTH_DATA.length
  );

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <i className="ri-radar-line text-red-400" />
            Disease Spread Risk Map
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Visual cross-infection analysis — shows which colonies are at risk based on active diseases, spread rates, quarantine &amp; sanitation
          </p>
        </div>
        <button
          onClick={onOpenPRP}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap cursor-pointer hover:scale-105 transition-all flex-shrink-0"
          style={{ background: 'rgba(244,63,94,0.15)', border: '2px solid rgba(244,63,94,0.5)', color: '#f43f5e' }}
        >
          <i className="ri-shield-flash-line animate-pulse" />
          PLAGUE RESPONSE
        </button>
      </div>

      {/* Empire risk summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'High/Critical Colonies', value: highRiskCount, color: '#f43f5e', icon: 'ri-alarm-warning-line', sub: 'Immediate attention needed' },
          { label: 'Safe Colonies', value: safeCount, color: '#4ade80', icon: 'ri-shield-check-line', sub: 'No significant risk' },
          { label: 'Active Spread Vectors', value: edges.length, color: '#fbbf24', icon: 'ri-virus-line', sub: 'Cross-infection paths' },
          { label: 'Avg. Sanitation', value: `${avgSanitation}%`, color: '#38bdf8', icon: 'ri-sparkling-2-line', sub: 'With upgrades & PRP' },
        ].map(stat => (
          <div
            key={stat.label}
            className="rounded-xl px-4 py-3"
            style={{ background: `${stat.color}0d`, border: `1px solid ${stat.color}25` }}
          >
            <div className="flex items-center gap-2 mb-1">
              <i className={`${stat.icon} text-sm`} style={{ color: stat.color }} />
              <span className="text-xs text-gray-400">{stat.label}</span>
            </div>
            <p className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Disease filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-500 flex-shrink-0">Filter by disease:</span>
        <button
          onClick={() => setSelectedDisease('all')}
          className="px-3 py-1 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
          style={{
            background: selectedDisease === 'all' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${selectedDisease === 'all' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
            color: selectedDisease === 'all' ? '#fff' : '#6b7a95',
          }}
        >
          All Diseases
        </button>
        {activeDiseases.map(d => (
          <button
            key={d.id}
            onClick={() => setSelectedDisease(selectedDisease === d.id ? 'all' : d.id)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
            style={{
              background: selectedDisease === d.id ? `${d.color}20` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${selectedDisease === d.id ? `${d.color}55` : 'rgba(255,255,255,0.1)'}`,
              color: selectedDisease === d.id ? d.color : '#6b7a95',
            }}
          >
            <i className={`${d.icon} text-xs`} />
            {d.name}
          </button>
        ))}
      </div>

      {/* Main layout: map + detail panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* SVG Map */}
        <div
          className="xl:col-span-2 rounded-2xl overflow-hidden relative"
          style={{ background: 'radial-gradient(ellipse at 40% 40%, rgba(10,25,50,0.98) 0%, rgba(5,8,18,1) 100%)', border: '1px solid rgba(0,212,255,0.15)', minHeight: 420 }}
        >
          {/* Star field */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 2 + 0.5,
                  height: Math.random() * 2 + 0.5,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: 'rgba(255,255,255,0.6)',
                  opacity: 0.2 + Math.random() * 0.5,
                }}
              />
            ))}
          </div>

          {/* CSS for animations */}
          <style>{`
            @keyframes spreadFlow { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -20; } }
            @keyframes nodePulse { 0% { transform-origin: center; opacity: 0.6; r: 35; } 100% { opacity: 0; r: 55; } }
            @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          `}</style>

          <svg
            ref={svgRef}
            width="100%"
            height={svgSize.h}
            viewBox={`0 0 ${svgSize.w} ${svgSize.h}`}
            style={{ display: 'block' }}
          >
            {/* Grid lines (subtle) */}
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={`hg${i}`} x1={0} y1={(i + 1) * svgSize.h / 7} x2={svgSize.w} y2={(i + 1) * svgSize.h / 7}
                stroke="rgba(0,212,255,0.04)" strokeWidth="1" />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={`vg${i}`} x1={(i + 1) * svgSize.w / 9} y1={0} x2={(i + 1) * svgSize.w / 9} y2={svgSize.h}
                stroke="rgba(0,212,255,0.04)" strokeWidth="1" />
            ))}

            {/* Spread edges */}
            {edges.map(edge => {
              const { cx: x1, cy: y1 } = getNodeCenter(edge.fromId);
              const { cx: x2, cy: y2 } = getNodeCenter(edge.toId);
              const edgeKey = `${edge.fromId}-${edge.toId}-${edge.diseaseId}`;
              const isHovered = hoveredEdge === edgeKey;
              return (
                <g key={edgeKey}
                  onMouseEnter={() => setHoveredEdge(edgeKey)}
                  onMouseLeave={() => setHoveredEdge(null)}
                >
                  <SpreadLine
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    risk={edge.risk}
                    color={isHovered ? '#ffffff' : edge.disease.color}
                    animated={edge.risk > 0.15}
                  />
                  {/* Arrowhead */}
                  {(() => {
                    const angle = Math.atan2(y2 - y1, x2 - x1);
                    const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                    const t = Math.max(0, 1 - 36 / dist);
                    const mx = x1 + (x2 - x1) * t;
                    const my = y1 + (y2 - y1) * t;
                    const size = 6 + edge.risk * 6;
                    const p1x = mx - size * Math.cos(angle - 0.4);
                    const p1y = my - size * Math.sin(angle - 0.4);
                    const p2x = mx - size * Math.cos(angle + 0.4);
                    const p2y = my - size * Math.sin(angle + 0.4);
                    return (
                      <polygon
                        points={`${mx},${my} ${p1x},${p1y} ${p2x},${p2y}`}
                        fill={edge.disease.color}
                        fillOpacity={0.7 + edge.risk * 0.3}
                      />
                    );
                  })()}
                  {/* Edge label on hover */}
                  {isHovered && (
                    <g>
                      <rect
                        x={(x1 + x2) / 2 - 42} y={(y1 + y2) / 2 - 13}
                        width={84} height={24} rx={4} ry={4}
                        fill="#0a1020" stroke={edge.disease.color} strokeWidth="1" strokeOpacity="0.6"
                      />
                      <text
                        x={(x1 + x2) / 2} y={(y1 + y2) / 2 + 1}
                        textAnchor="middle" dominantBaseline="middle"
                        fontSize="9" fill={edge.disease.color} fontWeight="bold" style={{ userSelect: 'none' }}
                      >
                        {edge.disease.name} · {(edge.risk * 100).toFixed(0)}% risk
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Colony nodes */}
            {COLONY_HEALTH_DATA.map(colony => {
              const { cx, cy } = getNodeCenter(colony.colonyId);
              const profile = profiles[colony.colonyId];
              return (
                <ColonyNode
                  key={colony.colonyId}
                  colony={colony}
                  profile={profile}
                  isSelected={selectedColony === colony.colonyId}
                  isQuarantined={quarantinedIds.has(colony.colonyId)}
                  cx={cx} cy={cy}
                  onClick={() => setSelectedColony(colony.colonyId === selectedColony ? null : colony.colonyId)}
                />
              );
            })}
          </svg>

          {/* Map legend */}
          <div
            className="absolute bottom-3 left-3 rounded-xl px-3 py-2.5 space-y-1.5"
            style={{ background: 'rgba(5,8,18,0.9)', border: '1px solid rgba(0,212,255,0.15)' }}
          >
            <p className="text-xs font-bold text-gray-400 mb-2">RISK LEGEND</p>
            {(Object.entries(RISK_CONFIG) as [ColonyRiskProfile['riskTier'], typeof RISK_CONFIG[keyof typeof RISK_CONFIG]][]).map(([tier, cfg]) => (
              <div key={tier} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cfg.color, border: `1px solid ${cfg.border}` }} />
                <span className="text-xs" style={{ color: cfg.color }}>{cfg.label}</span>
              </div>
            ))}
            <div className="pt-1 border-t border-white/10 mt-1 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 rounded" style={{ background: 'rgba(248,113,113,0.8)', borderTop: '1px dashed rgba(248,113,113,0.8)' }} />
                <span className="text-xs text-gray-500">Active spread</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 rounded" style={{ background: 'rgba(248,113,113,0.3)', borderTop: '1px dotted rgba(248,113,113,0.4)' }} />
                <span className="text-xs text-gray-500">Low risk path</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs">🔒</span>
                <span className="text-xs text-gray-500">Quarantined</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">⚡</span>
                <span className="text-xs text-gray-500">PRP active</span>
              </div>
            </div>
          </div>

          {/* Map instructions */}
          <div
            className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg"
            style={{ background: 'rgba(5,8,18,0.85)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-xs text-gray-500">Click colony to inspect · Hover lines to see risk</p>
          </div>
        </div>

        {/* Right panel: Colony detail or overview */}
        <div className="space-y-4">
          {selectedProfile && selectedColonyData ? (
            <SelectedColonyPanel
              profile={selectedProfile}
              colony={selectedColonyData}
              isQuarantined={quarantinedIds.has(selectedColonyData.colonyId)}
              prpStates={prpStates}
              now={now}
              onOpenPRP={onOpenPRP}
            />
          ) : (
            <AllColoniesPanel profiles={profiles} onSelect={setSelectedColony} />
          )}
        </div>
      </div>

      {/* Cross-infection risk matrix */}
      <CrossInfectionMatrix
        profiles={profiles}
        edges={edges}
        quarantinedIds={quarantinedIds}
      />

      {/* Actionable recommendations */}
      <RecommendationsPanel
        profiles={profiles}
        quarantinedIds={quarantinedIds}
        edges={edges}
        prpStates={prpStates}
        now={now}
        onOpenPRP={onOpenPRP}
      />
    </div>
  );
}

// ─── Selected Colony Detail Panel ────────────────────────────────────────────

function SelectedColonyPanel({
  profile,
  colony,
  isQuarantined,
  prpStates,
  now,
  onOpenPRP,
}: {
  profile: ColonyRiskProfile;
  colony: ColonyHealth;
  isQuarantined: boolean;
  prpStates: Record<string, PRPState>;
  now: number;
  onOpenPRP: () => void;
}) {
  const cfg = RISK_CONFIG[profile.riskTier];
  const activeDiseases = DISEASES.filter(d => colony.diseases.includes(d.id));
  const prp = prpStates[colony.colonyId];
  const prpActive = prp?.activeUntil != null && prp.activeUntil > now;
  const prpSecsLeft = prpActive ? Math.max(0, Math.ceil(((prp.activeUntil ?? 0) - now) / 1000)) : 0;

  return (
    <div className="space-y-4">
      {/* Colony header */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: `2px solid ${cfg.color}50`, background: 'rgba(10,15,30,0.95)' }}
      >
        <div className="relative h-32 overflow-hidden">
          <img src={colony.image} alt={colony.colonyName} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(10,15,30,0.92))' }} />
          <div className="absolute bottom-3 left-3">
            <p className="text-sm font-black text-white">{colony.colonyName}</p>
            <p className="text-xs text-gray-400">{colony.type} · {colony.coordinates}</p>
          </div>
          <div
            className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-black"
            style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
          >
            {cfg.label}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Risk gauge */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-400">Infection Risk</span>
              <span className="text-xs font-black" style={{ color: cfg.color }}>
                {(profile.overallRisk * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${profile.overallRisk * 100}%`,
                  background: `linear-gradient(90deg, ${cfg.color}cc, ${cfg.color})`,
                }}
              />
            </div>
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Sanitation', value: `${profile.effective.sanitation}%`, color: '#38bdf8', icon: 'ri-sparkling-2-line' },
              { label: 'Vulnerability', value: `${Math.round(profile.effective.vulnerability * 100)}%`, color: profile.effective.vulnerability < 0.7 ? '#4ade80' : '#fbbf24', icon: 'ri-shield-line' },
              { label: 'Health Score', value: `${colony.healthScore}%`, color: colony.healthScore > 70 ? '#4ade80' : colony.healthScore > 40 ? '#fbbf24' : '#f43f5e', icon: 'ri-heart-pulse-line' },
              { label: 'Spread Block', value: `${(profile.effective.spreadMod * 100).toFixed(0)}%`, color: '#c084fc', icon: 'ri-close-circle-line' },
            ].map(s => (
              <div key={s.label} className="rounded-lg px-2.5 py-2" style={{ background: `${s.color}0d`, border: `1px solid ${s.color}22` }}>
                <div className="flex items-center gap-1 mb-0.5">
                  <i className={`${s.icon} text-xs`} style={{ color: s.color }} />
                  <span className="text-xs text-gray-500">{s.label}</span>
                </div>
                <p className="text-sm font-black" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Status flags */}
          <div className="flex flex-wrap gap-2">
            {isQuarantined && (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.4)' }}>
                <i className="ri-lock-line mr-1" />QUARANTINED
              </span>
            )}
            {prpActive && (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.4)' }}>
                <i className="ri-shield-flash-line mr-1" />PRP {Math.floor(prpSecsLeft / 60)}:{String(prpSecsLeft % 60).padStart(2, '0')}
              </span>
            )}
            {profile.effective.sanitationUpgrades > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(56,189,248,0.12)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.35)' }}>
                <i className="ri-shield-check-line mr-1" />{profile.effective.sanitationUpgrades} upgrades
              </span>
            )}
          </div>

          {/* Active diseases */}
          {activeDiseases.length > 0 && (
            <div
              className="rounded-lg p-2.5 space-y-1.5"
              style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)' }}
            >
              <p className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                <i className="ri-virus-line" />Active Outbreaks
              </p>
              {activeDiseases.map(d => (
                <div key={d.id} className="flex items-center gap-2 text-xs" style={{ color: d.color }}>
                  <i className={d.icon} />
                  <span className="font-semibold">{d.name}</span>
                  <span className="ml-auto text-gray-500">{(d.spreadRate * 100).toFixed(0)}% spread</span>
                </div>
              ))}
            </div>
          )}

          {/* Inbound threats */}
          {profile.inboundThreats.length > 0 && (
            <div
              className="rounded-lg p-2.5 space-y-1.5"
              style={{ background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.2)' }}
            >
              <p className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                <i className="ri-arrow-down-line" />Inbound Infection Risks
              </p>
              {profile.inboundThreats.map((threat, i) => {
                const d = DISEASES.find(x => x.id === threat.diseaseId);
                return (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <i className={`${d?.icon} text-xs`} style={{ color: d?.color }} />
                    <span style={{ color: d?.color ?? '#f87171' }}>{d?.name}</span>
                    <span className="text-gray-500 text-xs">from {threat.fromColony}</span>
                    <span className="ml-auto font-black" style={{ color: threat.risk > 0.3 ? '#f43f5e' : threat.risk > 0.1 ? '#fbbf24' : '#4ade80' }}>
                      {(threat.risk * 100).toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            {!prpActive && profile.overallRisk > 0.05 && (
              <button
                onClick={onOpenPRP}
                className="w-full py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all hover:scale-[1.02]"
                style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.45)', color: '#f43f5e' }}
              >
                <i className="ri-shield-flash-line mr-1.5" />Deploy Plague Response Protocol
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── All Colonies Overview Panel ──────────────────────────────────────────────

function AllColoniesPanel({
  profiles,
  onSelect,
}: {
  profiles: Record<string, ColonyRiskProfile>;
  onSelect: (id: string) => void;
}) {
  const sorted = Object.values(profiles).sort((a, b) => b.overallRisk - a.overallRisk);
  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(0,212,255,0.15)' }}
    >
      <p className="text-sm font-black text-white flex items-center gap-2">
        <i className="ri-list-check text-cyan-400" />Colony Risk Summary
      </p>
      <p className="text-xs text-gray-500">Click a colony on the map or below to inspect</p>
      <div className="space-y-2.5">
        {sorted.map(profile => {
          const cfg = RISK_CONFIG[profile.riskTier];
          const colony = profile.colony;
          return (
            <button
              key={profile.colonyId}
              onClick={() => onSelect(profile.colonyId)}
              className="w-full flex items-center gap-3 rounded-lg p-2.5 cursor-pointer text-left transition-all hover:scale-[1.01]"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                <img src={colony.image} alt={colony.colonyName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-white truncate">{colony.colonyName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div
                    className="h-1 rounded-full"
                    style={{ width: `${Math.max(4, profile.overallRisk * 100)}%`, maxWidth: '80px', background: cfg.color }}
                  />
                  <span className="text-xs" style={{ color: cfg.color }}>{(profile.overallRisk * 100).toFixed(1)}%</span>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-xs font-black" style={{ color: cfg.color }}>{cfg.label}</p>
                {colony.diseases.length > 0 && (
                  <p className="text-xs text-red-400 mt-0.5">{colony.diseases.length} active</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Cross Infection Matrix ───────────────────────────────────────────────────

function CrossInfectionMatrix({
  profiles,
  edges,
  quarantinedIds,
}: {
  profiles: Record<string, ColonyRiskProfile>;
  edges: SpreadEdge[];
  quarantinedIds: Set<string>;
}) {
  const colonies = COLONY_HEALTH_DATA;

  const getEdgeRisk = (fromId: string, toId: string) => {
    const matching = edges.filter(e => e.fromId === fromId && e.toId === toId);
    if (matching.length === 0) return null;
    return Math.max(...matching.map(e => e.risk));
  };

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'rgba(10,15,30,0.9)', border: '1px solid rgba(0,212,255,0.12)' }}
    >
      <h3 className="text-sm font-black text-white mb-1 flex items-center gap-2">
        <i className="ri-grid-line text-cyan-400" />Cross-Infection Risk Matrix
      </h3>
      <p className="text-xs text-gray-500 mb-4">Spread risk from source colony (row) to target colony (column). Each cell shows disease transmission probability.</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr>
              <th className="text-left pb-3 pr-4">
                <span className="text-xs text-gray-500 font-normal">Source ↓ / Target →</span>
              </th>
              {colonies.map(c => (
                <th key={c.colonyId} className="text-center pb-3 px-2 min-w-[100px]">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-7 h-7 rounded overflow-hidden mx-auto">
                      <img src={c.image} alt={c.colonyName} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-gray-400 font-normal leading-tight block max-w-[90px] text-center">
                      {c.colonyName.split(' ').slice(0, 2).join(' ')}
                    </span>
                    {quarantinedIds.has(c.colonyId) && (
                      <span className="text-xs px-1 py-0 rounded" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>QZN</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {colonies.map(source => {
              const sourceProfile = profiles[source.colonyId];
              const sourceCfg = RISK_CONFIG[sourceProfile?.riskTier ?? 'safe'];
              return (
                <tr key={source.colonyId} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded overflow-hidden flex-shrink-0">
                        <img src={source.image} alt={source.colonyName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block leading-tight">{source.colonyName.split(' ').slice(0, 2).join(' ')}</span>
                        {source.diseases.length > 0 && (
                          <span className="text-xs" style={{ color: sourceCfg.color }}>{source.diseases.length} disease{source.diseases.length > 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  {colonies.map(target => {
                    if (source.colonyId === target.colonyId) {
                      return (
                        <td key={target.colonyId} className="text-center py-2.5 px-2">
                          <div className="w-16 h-8 rounded mx-auto flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <span className="text-gray-600 text-lg">—</span>
                          </div>
                        </td>
                      );
                    }

                    const risk = getEdgeRisk(source.colonyId, target.colonyId);
                    if (risk === null) {
                      return (
                        <td key={target.colonyId} className="text-center py-2.5 px-2">
                          <div className="w-16 h-8 rounded mx-auto flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.1)' }}>
                            <span className="text-xs font-bold" style={{ color: '#4ade80' }}>0%</span>
                          </div>
                        </td>
                      );
                    }

                    const tier = getRiskTier(risk);
                    const tcfg = RISK_CONFIG[tier];
                    return (
                      <td key={target.colonyId} className="text-center py-2.5 px-2">
                        <div
                          className="w-16 h-8 rounded mx-auto flex flex-col items-center justify-center"
                          style={{ background: tcfg.bg, border: `1px solid ${tcfg.border}` }}
                        >
                          <span className="text-xs font-black" style={{ color: tcfg.color }}>{(risk * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Recommendations Panel ────────────────────────────────────────────────────

function RecommendationsPanel({
  profiles,
  quarantinedIds,
  edges,
  prpStates,
  now,
  onOpenPRP,
}: {
  profiles: Record<string, ColonyRiskProfile>;
  quarantinedIds: Set<string>;
  edges: SpreadEdge[];
  prpStates: Record<string, PRPState>;
  now: number;
  onOpenPRP: () => void;
}) {
  const recs: { icon: string; color: string; title: string; body: string; priority: 'critical' | 'high' | 'medium' | 'low'; action?: () => void; actionLabel?: string }[] = [];

  // Check for critical colonies without quarantine
  for (const profile of Object.values(profiles)) {
    if ((profile.riskTier === 'critical' || profile.riskTier === 'high') && !quarantinedIds.has(profile.colonyId) && profile.colony.diseases.length > 0) {
      recs.push({
        icon: 'ri-lock-line',
        color: '#f43f5e',
        title: `Quarantine ${profile.colony.colonyName}`,
        body: `This colony is actively infected and spreading disease. Quarantine will reduce outbound spread by 95%.`,
        priority: 'critical',
      });
    }
  }

  // Check for highest risk edge
  const topEdge = [...edges].sort((a, b) => b.risk - a.risk)[0];
  if (topEdge && topEdge.risk > 0.2) {
    const fromC = COLONY_HEALTH_DATA.find(c => c.colonyId === topEdge.fromId);
    const toC = COLONY_HEALTH_DATA.find(c => c.colonyId === topEdge.toId);
    recs.push({
      icon: 'ri-virus-line',
      color: '#fbbf24',
      title: `High Spread Risk: ${topEdge.disease.name}`,
      body: `${(topEdge.risk * 100).toFixed(0)}% probability of ${topEdge.disease.name} spreading from ${fromC?.colonyName} to ${toC?.colonyName}. Consider quarantine or PRP activation.`,
      priority: 'high',
      action: onOpenPRP,
      actionLabel: 'Deploy PRP',
    });
  }

  // PRP recommendation for colonies with active PRP window ending soon
  for (const [colonyId, prp] of Object.entries(prpStates)) {
    if (prp.activeUntil && prp.activeUntil > now) {
      const secsLeft = Math.ceil((prp.activeUntil - now) / 1000);
      if (secsLeft < 90) {
        const colony = COLONY_HEALTH_DATA.find(c => c.colonyId === colonyId);
        recs.push({
          icon: 'ri-shield-flash-line',
          color: '#4ade80',
          title: `PRP Expiring: ${colony?.colonyName}`,
          body: `Plague Response Protocol expires in ${secsLeft}s. Disease vulnerability will return to baseline. Consider follow-up treatment.`,
          priority: 'medium',
        });
      }
    }
  }

  // Sanitation upgrade recommendation for most vulnerable colony
  const mostVulnerable = Object.values(profiles).sort((a, b) => b.effective.vulnerability - a.effective.vulnerability)[0];
  if (mostVulnerable && mostVulnerable.effective.vulnerability > 0.85) {
    recs.push({
      icon: 'ri-shield-check-line',
      color: '#38bdf8',
      title: `Boost Sanitation: ${mostVulnerable.colony.colonyName}`,
      body: `${mostVulnerable.colony.colonyName} has ${(mostVulnerable.effective.vulnerability * 100).toFixed(0)}% disease vulnerability. Sanitation upgrades will permanently reduce this.`,
      priority: 'low',
    });
  }

  if (recs.length === 0) {
    return (
      <div
        className="rounded-xl p-5 flex items-center gap-4"
        style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.25)' }}
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.35)' }}>
          <i className="ri-shield-check-line text-2xl" style={{ color: '#4ade80' }} />
        </div>
        <div>
          <p className="text-sm font-black text-white">All Clear — No Critical Actions Required</p>
          <p className="text-xs text-gray-400 mt-0.5">Your empire's disease containment measures are effective. Continue monitoring for new outbreaks.</p>
        </div>
      </div>
    );
  }

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sorted = recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'rgba(10,15,30,0.9)', border: '1px solid rgba(244,63,94,0.18)' }}
    >
      <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
        <i className="ri-checkbox-circle-line text-red-400" />
        Recommended Actions
        <span className="ml-1 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(244,63,94,0.15)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' }}>
          {sorted.length} action{sorted.length > 1 ? 's' : ''}
        </span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sorted.map((rec, i) => (
          <div
            key={i}
            className="rounded-lg p-3.5 flex items-start gap-3"
            style={{ background: `${rec.color}0c`, border: `1px solid ${rec.color}2a` }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: `${rec.color}15`, border: `1px solid ${rec.color}35` }}
            >
              <i className={`${rec.icon} text-sm`} style={{ color: rec.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <p className="text-xs font-black text-white">{rec.title}</p>
                <span
                  className="text-xs px-1.5 py-0 rounded capitalize"
                  style={{ background: `${rec.color}18`, color: rec.color, border: `1px solid ${rec.color}30` }}
                >
                  {rec.priority}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{rec.body}</p>
              {rec.action && rec.actionLabel && (
                <button
                  onClick={rec.action}
                  className="mt-2 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all hover:scale-105"
                  style={{ background: `${rec.color}18`, border: `1px solid ${rec.color}40`, color: rec.color }}
                >
                  {rec.actionLabel} →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}