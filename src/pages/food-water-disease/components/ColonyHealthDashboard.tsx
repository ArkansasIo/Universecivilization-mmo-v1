import { useState, useEffect, useRef, useCallback } from 'react';
import {
  COLONY_HEALTH_DATA,
  DISEASES,
  FOOD_SOURCES,
  WATER_SOURCES,
  SUPPLY_EVENTS,
  computeSanitationStats,
  type ColonyHealth,
  type ColonySanitationState,
} from '@/data/foodWaterDisease';
import { type PRPState } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface VitalSample {
  t: number; // relative time index
  health: number;
  sanitation: number;
  food: number;
  water: number;
}

interface Alert {
  id: string;
  colonyId: string;
  colonyName: string;
  metric: string;
  value: number;
  threshold: number;
  severity: 'warning' | 'critical';
  message: string;
  icon: string;
  color: string;
  timestamp: number;
  dismissed: boolean;
}

interface ThresholdConfig {
  healthWarn: number;
  healthCrit: number;
  sanitationWarn: number;
  sanitationCrit: number;
  foodWarn: number;     // food surplus floor
  waterWarn: number;
}

interface ColonyHealthDashboardProps {
  sanitationStates: Record<string, ColonySanitationState>;
  prpStates: Record<string, PRPState>;
  quarantinedIds: Set<string>;
  onOpenPRP: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TREND_POINTS = 20;
const DEFAULT_THRESHOLDS: ThresholdConfig = {
  healthWarn: 60,
  healthCrit: 35,
  sanitationWarn: 55,
  sanitationCrit: 30,
  foodWarn: 0,
  waterWarn: 0,
};

// ─── Generate simulated trend history ─────────────────────────────────────────

function generateTrend(
  colony: ColonyHealth,
  sanitationBonus: number,
  points = TREND_POINTS
): VitalSample[] {
  const samples: VitalSample[] = [];
  // Seed with realistic variance around current values
  let health = Math.max(5, colony.healthScore - 15 + Math.random() * 10);
  let sanit = Math.max(5, colony.sanitationLevel + sanitationBonus - 12 + Math.random() * 8);
  let food = colony.foodSurplus - 200 + Math.random() * 100;
  let water = colony.waterSurplus - 150 + Math.random() * 80;

  const isStressed = colony.healthScore < 50;

  for (let i = 0; i < points; i++) {
    const frac = i / (points - 1);
    // Trend toward current values with noise
    health += (colony.healthScore - health) * 0.12 + (Math.random() - 0.48) * (isStressed ? 3 : 1.5);
    sanit  += ((colony.sanitationLevel + sanitationBonus) - sanit) * 0.10 + (Math.random() - 0.5) * 2;
    food   += (colony.foodSurplus - food) * 0.10 + (Math.random() - 0.5) * 40;
    water  += (colony.waterSurplus - water) * 0.10 + (Math.random() - 0.5) * 30;
    samples.push({
      t: frac,
      health: Math.max(0, Math.min(100, health)),
      sanitation: Math.max(0, Math.min(100, sanit)),
      food,
      water,
    });
  }
  return samples;
}

// ─── Sparkline SVG ────────────────────────────────────────────────────────────

function Sparkline({
  data,
  width = 120,
  height = 36,
  color,
  fillOpacity = 0.18,
  showDot = true,
}: {
  data: number[];
  width?: number;
  height?: number;
  color: string;
  fillOpacity?: number;
  showDot?: boolean;
}) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 3;

  const pts = data.map((v, i) => {
    const x = pad + ((i / (data.length - 1)) * (width - pad * 2));
    const y = pad + ((1 - (v - min) / range) * (height - pad * 2));
    return [x, y] as [number, number];
  });

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const fillPath = `${linePath} L${pts[pts.length - 1][0].toFixed(1)},${(height - pad).toFixed(1)} L${pts[0][0].toFixed(1)},${(height - pad).toFixed(1)} Z`;

  const lastPt = pts[pts.length - 1];

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={fillOpacity * 2.5} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#sg-${color.replace('#', '')})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {showDot && (
        <circle cx={lastPt[0]} cy={lastPt[1]} r={3} fill={color} />
      )}
    </svg>
  );
}

// ─── Radial gauge ─────────────────────────────────────────────────────────────

function RadialGauge({
  value,
  size = 72,
  strokeWidth = 6,
  color,
  label,
  unit = '%',
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  label: string;
  unit?: string;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value)) / 100;
  const offset = circ * (1 - pct);
  const cx = size / 2;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeWidth} />
        <circle
          cx={cx} cy={cx} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="text-center" style={{ marginTop: -size * 0.55, marginBottom: size * 0.28 }}>
        <p className="text-sm font-black" style={{ color }}>{Math.round(value)}{unit}</p>
      </div>
      <p className="text-xs text-gray-500 whitespace-nowrap">{label}</p>
    </div>
  );
}

// ─── Alert Badge ──────────────────────────────────────────────────────────────

function AlertBadge({ count, pulse }: { count: number; pulse?: boolean }) {
  if (count === 0) return null;
  return (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-black ${pulse ? 'animate-pulse' : ''}`}
      style={{ background: '#f43f5e', color: '#fff', fontSize: 10 }}
    >
      {count}
    </span>
  );
}

// ─── Threshold Settings Modal ─────────────────────────────────────────────────

function ThresholdModal({
  config,
  onChange,
  onClose,
}: {
  config: ThresholdConfig;
  onChange: (cfg: ThresholdConfig) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState(config);

  const field = (
    label: string,
    key: keyof ThresholdConfig,
    color: string,
    unit = '%'
  ) => (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-gray-400 w-40">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={100}
          value={local[key]}
          onChange={e => setLocal(prev => ({ ...prev, [key]: Number(e.target.value) }))}
          className="w-28 accent-current cursor-pointer"
          style={{ accentColor: color }}
        />
        <span className="text-xs font-bold w-10 text-right" style={{ color }}>
          {local[key]}{unit}
        </span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="rounded-2xl p-6 w-full max-w-md" style={{ background: '#0a1020', border: '1px solid rgba(56,189,248,0.35)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <i className="ri-settings-3-line text-cyan-400" />Alert Thresholds
          </h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer hover:bg-white/10" style={{ color: '#6b7280' }}>
            <i className="ri-close-line" />
          </button>
        </div>
        <div className="space-y-3 mb-6">
          <p className="text-xs text-gray-500 mb-3">Alerts fire when any colony metric falls below these thresholds</p>
          {field('Health Warning', 'healthWarn', '#fbbf24')}
          {field('Health Critical', 'healthCrit', '#f43f5e')}
          {field('Sanitation Warning', 'sanitationWarn', '#fbbf24')}
          {field('Sanitation Critical', 'sanitationCrit', '#f43f5e')}
          {field('Min Food Surplus', 'foodWarn', '#4ade80', '/hr')}
          {field('Min Water Surplus', 'waterWarn', '#38bdf8', '/hr')}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { onChange(local); onClose(); }}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold cursor-pointer whitespace-nowrap transition-all"
            style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.4)', color: '#38bdf8' }}
          >
            <i className="ri-save-line mr-1.5" />Save Thresholds
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm text-gray-400 cursor-pointer whitespace-nowrap hover:bg-white/5 transition-all" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Colony Detail Panel ──────────────────────────────────────────────────────

function ColonyDetailPanel({
  colony,
  trends,
  sanitationState,
  prpState,
  isQuarantined,
  alerts,
  onOpenPRP,
}: {
  colony: ColonyHealth;
  trends: VitalSample[];
  sanitationState?: ColonySanitationState;
  prpState?: PRPState;
  isQuarantined: boolean;
  alerts: Alert[];
  onOpenPRP: () => void;
}) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const [activeMetric, setActiveMetric] = useState<'health' | 'sanitation' | 'food' | 'water'>('health');

  const sanStats = sanitationState ? computeSanitationStats(sanitationState) : null;
  const effSanitation = Math.min(100, colony.sanitationLevel + (sanStats?.totalSanitationBonus ?? 0));
  const prpActive = prpState?.activeUntil !== null && (prpState?.activeUntil ?? 0) > now;
  const prpSecsLeft = prpActive ? Math.max(0, Math.ceil(((prpState?.activeUntil ?? 0) - now) / 1000)) : 0;

  const activeDiseases = DISEASES.filter(d => colony.diseases.includes(d.id));

  const healthColor =
    colony.healthScore > 75 ? '#4ade80' :
    colony.healthScore > 50 ? '#fbbf24' :
    colony.healthScore > 30 ? '#f87171' : '#f43f5e';

  const metricData = trends.map(s => {
    if (activeMetric === 'health') return s.health;
    if (activeMetric === 'sanitation') return s.sanitation;
    if (activeMetric === 'food') return s.food;
    return s.water;
  });

  const metricColors: Record<string, string> = {
    health: healthColor,
    sanitation: '#38bdf8',
    food: '#4ade80',
    water: '#38bdf8',
  };

  const metricLabels: Record<string, string> = {
    health: 'Health Score (24h)',
    sanitation: 'Sanitation Level (24h)',
    food: 'Food Surplus/hr (24h)',
    water: 'Water Surplus/hr (24h)',
  };

  const colonyAlerts = alerts.filter(a => a.colonyId === colony.colonyId && !a.dismissed);

  return (
    <div className="space-y-4">
      {/* Colony header */}
      <div className="relative rounded-xl overflow-hidden h-32">
        <img src={colony.image} alt={colony.colonyName} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(5,10,20,0.92))' }} />
        {isQuarantined && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold" style={{ background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.5)', color: '#fbbf24' }}>
            <i className="ri-lock-line text-xs" />QUARANTINED
          </div>
        )}
        {prpActive && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold animate-pulse" style={{ background: 'rgba(74,222,128,0.2)', border: '1px solid rgba(74,222,128,0.5)', color: '#4ade80' }}>
            <i className="ri-shield-flash-line text-xs" />PRP {Math.floor(prpSecsLeft / 60)}:{String(prpSecsLeft % 60).padStart(2, '0')}
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <h3 className="text-base font-black text-white">{colony.colonyName}</h3>
          <p className="text-xs text-gray-400">{colony.type} · {colony.coordinates} · Pop. {colony.population.toLocaleString()}</p>
        </div>
      </div>

      {/* Radial gauges */}
      <div className="grid grid-cols-4 gap-2 px-1">
        <RadialGauge value={colony.healthScore} color={healthColor} label="Health" />
        <RadialGauge value={effSanitation} color="#38bdf8" label="Sanitation" />
        <RadialGauge value={colony.medicalCapacity} color="#c084fc" label="Medical" />
        <RadialGauge
          value={Math.min(100, Math.max(0, (colony.foodSurplus / 1500) * 100 + 50))}
          color={colony.foodSurplus >= 0 ? '#4ade80' : '#f87171'}
          label="Food"
        />
      </div>

      {/* Trend chart */}
      <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {(['health', 'sanitation', 'food', 'water'] as const).map(m => (
            <button
              key={m}
              onClick={() => setActiveMetric(m)}
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer transition-all capitalize whitespace-nowrap"
              style={{
                background: activeMetric === m ? `${metricColors[m]}20` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activeMetric === m ? metricColors[m] : 'transparent'}`,
                color: activeMetric === m ? metricColors[m] : '#6b7280',
              }}
            >
              {m}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mb-2">{metricLabels[activeMetric]}</p>
        <div className="flex items-end gap-1" style={{ height: 48 }}>
          <Sparkline data={metricData} width={220} height={48} color={metricColors[activeMetric]} fillOpacity={0.25} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-600">24h ago</span>
          <span className="text-xs text-gray-600">Now</span>
        </div>
      </div>

      {/* Surplus stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg p-3 text-center" style={{ background: colony.foodSurplus >= 0 ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)', border: `1px solid ${colony.foodSurplus >= 0 ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)'}` }}>
          <i className="ri-restaurant-line text-sm mb-0.5 block" style={{ color: colony.foodSurplus >= 0 ? '#4ade80' : '#f87171' }} />
          <p className="text-sm font-black" style={{ color: colony.foodSurplus >= 0 ? '#4ade80' : '#f87171' }}>
            {colony.foodSurplus >= 0 ? '+' : ''}{colony.foodSurplus}/hr
          </p>
          <p className="text-xs text-gray-500">Food Surplus</p>
        </div>
        <div className="rounded-lg p-3 text-center" style={{ background: colony.waterSurplus >= 0 ? 'rgba(56,189,248,0.08)' : 'rgba(248,113,113,0.08)', border: `1px solid ${colony.waterSurplus >= 0 ? 'rgba(56,189,248,0.25)' : 'rgba(248,113,113,0.25)'}` }}>
          <i className="ri-drop-line text-sm mb-0.5 block" style={{ color: colony.waterSurplus >= 0 ? '#38bdf8' : '#f87171' }} />
          <p className="text-sm font-black" style={{ color: colony.waterSurplus >= 0 ? '#38bdf8' : '#f87171' }}>
            {colony.waterSurplus >= 0 ? '+' : ''}{colony.waterSurplus}/hr
          </p>
          <p className="text-xs text-gray-500">Water Surplus</p>
        </div>
      </div>

      {/* Active diseases */}
      {activeDiseases.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-bold text-gray-400">Active Diseases</p>
          {activeDiseases.map(d => (
            <div key={d.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: `${d.color}10`, border: `1px solid ${d.color}30` }}>
              <i className={`${d.icon} text-xs flex-shrink-0`} style={{ color: d.color }} />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold" style={{ color: d.color }}>{d.name}</span>
                <span className="text-xs text-gray-500 ml-2">{d.affectedPop?.toLocaleString()} infected</span>
              </div>
              <span className="text-xs text-gray-500">Spread {(d.spreadRate * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Colony alerts */}
      {colonyAlerts.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
            <i className="ri-alarm-warning-line text-amber-400" />Active Alerts
          </p>
          {colonyAlerts.map(a => (
            <div key={a.id} className="flex items-start gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: a.severity === 'critical' ? 'rgba(244,63,94,0.08)' : 'rgba(251,191,36,0.08)', border: `1px solid ${a.severity === 'critical' ? 'rgba(244,63,94,0.3)' : 'rgba(251,191,36,0.3)'}` }}>
              <i className={`${a.icon} text-xs flex-shrink-0 mt-0.5`} style={{ color: a.color }} />
              <p className="text-xs" style={{ color: a.color }}>{a.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* PRP button */}
      {colony.healthScore < 60 && (
        <button
          onClick={onOpenPRP}
          className="w-full py-2 rounded-xl text-xs font-black cursor-pointer transition-all hover:scale-[1.02]"
          style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.4)', color: '#f43f5e' }}
        >
          <i className="ri-shield-flash-line mr-1.5" />Deploy Plague Response Protocol
        </button>
      )}
    </div>
  );
}

// ─── Mini Colony Card ─────────────────────────────────────────────────────────

function MiniColonyCard({
  colony,
  trends,
  sanBonus,
  alertCount,
  isSelected,
  onSelect,
  prpActive,
}: {
  colony: ColonyHealth;
  trends: VitalSample[];
  sanBonus: number;
  alertCount: number;
  isSelected: boolean;
  onSelect: () => void;
  prpActive: boolean;
}) {
  const effSan = Math.min(100, colony.sanitationLevel + sanBonus);
  const healthColor =
    colony.healthScore > 75 ? '#4ade80' :
    colony.healthScore > 50 ? '#fbbf24' :
    colony.healthScore > 30 ? '#f87171' : '#f43f5e';

  const healthTrend = trends.map(s => s.health);
  const trendDir = healthTrend.length >= 2
    ? healthTrend[healthTrend.length - 1] - healthTrend[0]
    : 0;

  return (
    <button
      onClick={onSelect}
      className="w-full rounded-xl overflow-hidden text-left transition-all cursor-pointer hover:scale-[1.01]"
      style={{
        background: isSelected ? `${healthColor}12` : 'rgba(10,15,30,0.85)',
        border: `2px solid ${isSelected ? healthColor : 'rgba(255,255,255,0.08)'}`,
      }}
    >
      <div className="relative h-20 overflow-hidden">
        <img src={colony.image} alt={colony.colonyName} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(10,15,30,0.88))' }} />
        {alertCount > 0 && (
          <div className="absolute top-1.5 right-1.5">
            <AlertBadge count={alertCount} pulse />
          </div>
        )}
        {prpActive && (
          <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.3)', border: '1px solid rgba(74,222,128,0.6)' }}>
            <i className="ri-shield-flash-line text-xs" style={{ color: '#4ade80', fontSize: 8 }} />
          </div>
        )}
        <div className="absolute bottom-1.5 left-2">
          <p className="text-xs font-black text-white leading-tight truncate">{colony.colonyName}</p>
        </div>
      </div>
      <div className="p-2.5 space-y-1.5">
        {/* Health row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-1.5 rounded-full transition-all" style={{ width: `${colony.healthScore}%`, background: healthColor }} />
            </div>
          </div>
          <span className="text-xs font-black w-10 text-right" style={{ color: healthColor }}>{colony.healthScore}%</span>
        </div>
        {/* Sparkline */}
        <div className="flex items-center gap-2">
          <Sparkline data={healthTrend} width={70} height={20} color={healthColor} showDot={false} />
          <div className="flex items-center gap-1 ml-auto">
            <i
              className={`text-xs ${trendDir > 1 ? 'ri-arrow-up-line' : trendDir < -1 ? 'ri-arrow-down-line' : 'ri-subtract-line'}`}
              style={{ color: trendDir > 1 ? '#4ade80' : trendDir < -1 ? '#f43f5e' : '#6b7280' }}
            />
            <span className="text-xs text-gray-500">San {effSan}%</span>
          </div>
        </div>
        {/* Disease tags */}
        {colony.diseases.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {colony.diseases.slice(0, 2).map(id => {
              const d = DISEASES.find(x => x.id === id);
              return d ? (
                <span key={id} className="text-xs px-1 py-0.5 rounded" style={{ background: `${d.color}15`, color: d.color, fontSize: 9 }}>
                  <i className={`${d.icon} mr-0.5`} />{d.name}
                </span>
              ) : null;
            })}
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Alert Feed ───────────────────────────────────────────────────────────────

function AlertFeed({
  alerts,
  onDismiss,
  onDismissAll,
}: {
  alerts: Alert[];
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
}) {
  const active = alerts.filter(a => !a.dismissed);

  if (active.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ background: 'rgba(74,222,128,0.1)' }}>
          <i className="ri-shield-check-line text-3xl" style={{ color: '#4ade80' }} />
        </div>
        <p className="text-sm font-bold text-white mb-1">All Clear!</p>
        <p className="text-xs text-gray-500">No active alerts — all colonies are within thresholds</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
          <i className="ri-alarm-warning-line text-amber-400" />
          {active.length} Active Alert{active.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={onDismissAll}
          className="text-xs px-2.5 py-1 rounded-lg cursor-pointer transition-all hover:bg-white/10"
          style={{ color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          Dismiss All
        </button>
      </div>
      {active.map(a => (
        <div
          key={a.id}
          className="flex items-start gap-3 rounded-xl px-3 py-2.5"
          style={{
            background: a.severity === 'critical' ? 'rgba(244,63,94,0.08)' : 'rgba(251,191,36,0.07)',
            border: `1px solid ${a.severity === 'critical' ? 'rgba(244,63,94,0.3)' : 'rgba(251,191,36,0.25)'}`,
          }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: `${a.color}18`, border: `1px solid ${a.color}30` }}
          >
            <i className={`${a.icon} text-xs`} style={{ color: a.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="text-xs font-bold" style={{ color: a.color }}>{a.colonyName}</span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-bold uppercase"
                style={{
                  background: a.severity === 'critical' ? 'rgba(244,63,94,0.2)' : 'rgba(251,191,36,0.15)',
                  color: a.severity === 'critical' ? '#f43f5e' : '#fbbf24',
                  fontSize: 9,
                }}
              >
                {a.severity}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-snug">{a.message}</p>
          </div>
          <button
            onClick={() => onDismiss(a.id)}
            className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all"
            style={{ color: '#4b5563' }}
          >
            <i className="ri-close-line text-xs" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Empire Overview Strip ────────────────────────────────────────────────────

function EmpireOverviewStrip({
  colonies,
  sanitationStates,
  prpStates,
  alerts,
}: {
  colonies: ColonyHealth[];
  sanitationStates: Record<string, ColonySanitationState>;
  prpStates: Record<string, PRPState>;
  alerts: Alert[];
}) {
  const now = Date.now();
  const avgHealth = Math.round(colonies.reduce((s, c) => s + c.healthScore, 0) / colonies.length);
  const activeDiseaseCount = [...new Set(colonies.flatMap(c => c.diseases))].length;
  const coloniesAtRisk = colonies.filter(c => c.healthScore < 60).length;
  const totalInfected = DISEASES.reduce((s, d) => s + (d.affectedPop ?? 0), 0);
  const activePRPs = Object.values(prpStates).filter(s => s.activeUntil !== null && s.activeUntil > now).length;
  const activeAlerts = alerts.filter(a => !a.dismissed).length;
  const foodTotal = FOOD_SOURCES.reduce((s, f) => s + f.outputPerHour, 0);
  const waterTotal = WATER_SOURCES.reduce((s, w) => s + w.outputPerHour, 0);

  const stats = [
    { label: 'Avg Health', value: `${avgHealth}%`, color: avgHealth > 70 ? '#4ade80' : avgHealth > 45 ? '#fbbf24' : '#f43f5e', icon: 'ri-heart-pulse-line' },
    { label: 'At Risk', value: coloniesAtRisk, color: coloniesAtRisk > 0 ? '#f87171' : '#4ade80', icon: 'ri-alert-line' },
    { label: 'Active Outbreaks', value: activeDiseaseCount, color: activeDiseaseCount > 0 ? '#f43f5e' : '#4ade80', icon: 'ri-virus-line' },
    { label: 'Total Infected', value: totalInfected.toLocaleString(), color: '#f87171', icon: 'ri-user-unfollow-line' },
    { label: 'Active PRPs', value: activePRPs, color: activePRPs > 0 ? '#4ade80' : '#6b7280', icon: 'ri-shield-flash-line' },
    { label: 'Live Alerts', value: activeAlerts, color: activeAlerts > 0 ? '#fbbf24' : '#4ade80', icon: 'ri-notification-3-line' },
    { label: 'Food/hr', value: `+${foodTotal.toLocaleString()}`, color: '#4ade80', icon: 'ri-restaurant-line' },
    { label: 'Water/hr', value: `+${waterTotal.toLocaleString()}`, color: '#38bdf8', icon: 'ri-drop-line' },
  ];

  return (
    <div className="grid grid-cols-4 xl:grid-cols-8 gap-2 mb-5">
      {stats.map(s => (
        <div
          key={s.label}
          className="rounded-xl px-3 py-2.5 text-center"
          style={{ background: 'rgba(10,15,30,0.9)', border: `1px solid ${s.color}20` }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1.5" style={{ background: `${s.color}12` }}>
            <i className={`${s.icon} text-sm`} style={{ color: s.color }} />
          </div>
          <p className="text-sm font-black" style={{ color: s.color }}>{s.value}</p>
          <p className="text-xs text-gray-500 leading-tight">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ColonyHealthDashboard({
  sanitationStates,
  prpStates,
  quarantinedIds,
  onOpenPRP,
}: ColonyHealthDashboardProps) {
  const [selectedColony, setSelectedColony] = useState<string>(COLONY_HEALTH_DATA[0].colonyId);
  const [thresholds, setThresholds] = useState<ThresholdConfig>(DEFAULT_THRESHOLDS);
  const [showThresholdModal, setShowThresholdModal] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');
  const [showAlertsPanel, setShowAlertsPanel] = useState(false);
  const [now, setNow] = useState(Date.now());
  const trendsRef = useRef<Record<string, VitalSample[]>>({});

  // Generate trends once per colony
  useEffect(() => {
    COLONY_HEALTH_DATA.forEach(c => {
      if (!trendsRef.current[c.colonyId]) {
        const sanState = sanitationStates[c.colonyId];
        const sanStats = sanState ? computeSanitationStats(sanState) : { totalSanitationBonus: 0 } as any;
        trendsRef.current[c.colonyId] = generateTrend(c, sanStats.totalSanitationBonus);
      }
    });
  }, [sanitationStates]);

  // Clock tick
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Generate alerts based on thresholds
  const generateAlerts = useCallback(() => {
    const newAlerts: Alert[] = [];
    COLONY_HEALTH_DATA.forEach(c => {
      const sanState = sanitationStates[c.colonyId];
      const sanStats = sanState ? computeSanitationStats(sanState) : { totalSanitationBonus: 0 } as any;
      const effSan = Math.min(100, c.sanitationLevel + (sanStats.totalSanitationBonus ?? 0));

      // Health alerts
      if (c.healthScore <= thresholds.healthCrit) {
        newAlerts.push({
          id: `health-crit-${c.colonyId}`,
          colonyId: c.colonyId,
          colonyName: c.colonyName,
          metric: 'health',
          value: c.healthScore,
          threshold: thresholds.healthCrit,
          severity: 'critical',
          message: `CRITICAL: Health score at ${c.healthScore}% — below critical threshold of ${thresholds.healthCrit}%`,
          icon: 'ri-heart-pulse-line',
          color: '#f43f5e',
          timestamp: Date.now(),
          dismissed: false,
        });
      } else if (c.healthScore <= thresholds.healthWarn) {
        newAlerts.push({
          id: `health-warn-${c.colonyId}`,
          colonyId: c.colonyId,
          colonyName: c.colonyName,
          metric: 'health',
          value: c.healthScore,
          threshold: thresholds.healthWarn,
          severity: 'warning',
          message: `Health score at ${c.healthScore}% — below warning threshold of ${thresholds.healthWarn}%`,
          icon: 'ri-heart-pulse-line',
          color: '#fbbf24',
          timestamp: Date.now(),
          dismissed: false,
        });
      }

      // Sanitation alerts
      if (effSan <= thresholds.sanitationCrit) {
        newAlerts.push({
          id: `san-crit-${c.colonyId}`,
          colonyId: c.colonyId,
          colonyName: c.colonyName,
          metric: 'sanitation',
          value: effSan,
          threshold: thresholds.sanitationCrit,
          severity: 'critical',
          message: `CRITICAL: Sanitation at ${effSan}% — colony at severe outbreak risk`,
          icon: 'ri-shield-cross-line',
          color: '#f43f5e',
          timestamp: Date.now(),
          dismissed: false,
        });
      } else if (effSan <= thresholds.sanitationWarn) {
        newAlerts.push({
          id: `san-warn-${c.colonyId}`,
          colonyId: c.colonyId,
          colonyName: c.colonyName,
          metric: 'sanitation',
          value: effSan,
          threshold: thresholds.sanitationWarn,
          severity: 'warning',
          message: `Sanitation at ${effSan}% — below recommended level of ${thresholds.sanitationWarn}%`,
          icon: 'ri-shield-check-line',
          color: '#fbbf24',
          timestamp: Date.now(),
          dismissed: false,
        });
      }

      // Food/water deficit alerts
      if (c.foodSurplus < thresholds.foodWarn) {
        newAlerts.push({
          id: `food-${c.colonyId}`,
          colonyId: c.colonyId,
          colonyName: c.colonyName,
          metric: 'food',
          value: c.foodSurplus,
          threshold: thresholds.foodWarn,
          severity: c.foodSurplus < -200 ? 'critical' : 'warning',
          message: `Food deficit: ${c.foodSurplus}/hr — population at risk of starvation`,
          icon: 'ri-restaurant-line',
          color: c.foodSurplus < -200 ? '#f43f5e' : '#fbbf24',
          timestamp: Date.now(),
          dismissed: false,
        });
      }
      if (c.waterSurplus < thresholds.waterWarn) {
        newAlerts.push({
          id: `water-${c.colonyId}`,
          colonyId: c.colonyId,
          colonyName: c.colonyName,
          metric: 'water',
          value: c.waterSurplus,
          threshold: thresholds.waterWarn,
          severity: c.waterSurplus < -150 ? 'critical' : 'warning',
          message: `Water deficit: ${c.waterSurplus}/hr — dehydration risk rising`,
          icon: 'ri-drop-line',
          color: c.waterSurplus < -150 ? '#f43f5e' : '#38bdf8',
          timestamp: Date.now(),
          dismissed: false,
        });
      }

      // Disease alerts
      if (c.diseases.length > 0) {
        const dNames = c.diseases.map(id => DISEASES.find(d => d.id === id)?.name ?? id).join(', ');
        newAlerts.push({
          id: `disease-${c.colonyId}`,
          colonyId: c.colonyId,
          colonyName: c.colonyName,
          metric: 'disease',
          value: c.diseases.length,
          threshold: 0,
          severity: c.diseases.some(id => {
            const d = DISEASES.find(x => x.id === id);
            return d && (d.severity === 'critical' || d.severity === 'pandemic');
          }) ? 'critical' : 'warning',
          message: `${c.diseases.length} active disease${c.diseases.length > 1 ? 's' : ''}: ${dNames}`,
          icon: 'ri-virus-line',
          color: '#f43f5e',
          timestamp: Date.now(),
          dismissed: false,
        });
      }
    });
    return newAlerts;
  }, [thresholds, sanitationStates]);

  // Regenerate alerts when thresholds or states change
  useEffect(() => {
    const fresh = generateAlerts();
    setAlerts(prev => {
      // Merge: keep dismissed state for existing alerts
      const dismissedIds = new Set(prev.filter(a => a.dismissed).map(a => a.id));
      return fresh.map(a => ({ ...a, dismissed: dismissedIds.has(a.id) }));
    });
  }, [generateAlerts]);

  const handleDismiss = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));
  };

  const handleDismissAll = () => {
    setAlerts(prev => prev.map(a => ({ ...a, dismissed: true })));
  };

  const selectedColonyData = COLONY_HEALTH_DATA.find(c => c.colonyId === selectedColony)!;
  const activeAlertCount = alerts.filter(a => !a.dismissed).length;
  const criticalAlertCount = alerts.filter(a => !a.dismissed && a.severity === 'critical').length;

  return (
    <div className="space-y-5">
      {showThresholdModal && (
        <ThresholdModal
          config={thresholds}
          onChange={setThresholds}
          onClose={() => setShowThresholdModal(false)}
        />
      )}

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <i className="ri-pulse-line text-cyan-400" />Colony Health Dashboard
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Real-time vitals, trend monitoring and automated threshold alerts for all colonies</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          {/* Alert panel toggle */}
          <button
            onClick={() => setShowAlertsPanel(p => !p)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all whitespace-nowrap"
            style={{
              background: showAlertsPanel ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${showAlertsPanel ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.1)'}`,
              color: showAlertsPanel ? '#fbbf24' : '#9ca3af',
            }}
          >
            <i className="ri-notification-3-line" />
            Alerts
            {activeAlertCount > 0 && <AlertBadge count={activeAlertCount} pulse={criticalAlertCount > 0} />}
          </button>

          {/* Threshold settings */}
          <button
            onClick={() => setShowThresholdModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all whitespace-nowrap hover:bg-white/10"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af' }}
          >
            <i className="ri-settings-3-line" />Thresholds
          </button>

          {/* View toggle */}
          <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            {(['grid', 'list'] as const).map(v => (
              <button
                key={v}
                onClick={() => setActiveView(v)}
                className="px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all capitalize"
                style={{
                  background: activeView === v ? 'rgba(56,189,248,0.15)' : 'transparent',
                  color: activeView === v ? '#38bdf8' : '#6b7280',
                }}
              >
                <i className={`${v === 'grid' ? 'ri-layout-grid-line' : 'ri-list-check'} mr-1`} />{v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empire overview strip */}
      <EmpireOverviewStrip
        colonies={COLONY_HEALTH_DATA}
        sanitationStates={sanitationStates}
        prpStates={prpStates}
        alerts={alerts}
      />

      {/* Alert panel (inline) */}
      {showAlertsPanel && (
        <div className="rounded-2xl p-4" style={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(251,191,36,0.25)' }}>
          <AlertFeed alerts={alerts} onDismiss={handleDismiss} onDismissAll={handleDismissAll} />
        </div>
      )}

      {/* Main content: colony list + detail */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left: colony grid/list */}
        <div className="lg:w-72 xl:w-80 flex-shrink-0">
          <p className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-1.5">
            <i className="ri-planet-line text-cyan-400" />
            Colonies
            <span className="ml-auto text-gray-600">{COLONY_HEALTH_DATA.length} total</span>
          </p>
          <div className={activeView === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-2'}>
            {COLONY_HEALTH_DATA.map(c => {
              const sanState = sanitationStates[c.colonyId];
              const sanStats = sanState ? computeSanitationStats(sanState) : { totalSanitationBonus: 0 } as any;
              const colonyAlerts = alerts.filter(a => a.colonyId === c.colonyId && !a.dismissed);
              const prpActive = !!(prpStates[c.colonyId]?.activeUntil && prpStates[c.colonyId].activeUntil! > now);
              const trends = trendsRef.current[c.colonyId] ?? [];
              return (
                <MiniColonyCard
                  key={c.colonyId}
                  colony={c}
                  trends={trends}
                  sanBonus={sanStats.totalSanitationBonus ?? 0}
                  alertCount={colonyAlerts.length}
                  isSelected={selectedColony === c.colonyId}
                  onSelect={() => setSelectedColony(c.colonyId)}
                  prpActive={prpActive}
                />
              );
            })}
          </div>

          {/* Threshold summary */}
          <div className="mt-4 rounded-xl p-3" style={{ background: 'rgba(10,15,30,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1.5">
              <i className="ri-alarm-line text-amber-400" />Alert Thresholds
            </p>
            <div className="space-y-1.5">
              {[
                { label: 'Health warn', val: `< ${thresholds.healthWarn}%`, color: '#fbbf24' },
                { label: 'Health crit', val: `< ${thresholds.healthCrit}%`, color: '#f43f5e' },
                { label: 'Sanitation warn', val: `< ${thresholds.sanitationWarn}%`, color: '#fbbf24' },
                { label: 'Sanitation crit', val: `< ${thresholds.sanitationCrit}%`, color: '#f43f5e' },
              ].map(t => (
                <div key={t.label} className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{t.label}</span>
                  <span className="text-xs font-bold" style={{ color: t.color }}>{t.val}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowThresholdModal(true)}
              className="w-full mt-2 py-1.5 rounded-lg text-xs text-gray-500 cursor-pointer hover:bg-white/5 transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <i className="ri-settings-3-line mr-1" />Edit thresholds
            </button>
          </div>
        </div>

        {/* Right: detail panel */}
        <div className="flex-1 min-w-0 rounded-2xl p-4" style={{ background: 'rgba(10,15,30,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <ColonyDetailPanel
            colony={selectedColonyData}
            trends={trendsRef.current[selectedColony] ?? []}
            sanitationState={sanitationStates[selectedColony]}
            prpState={prpStates[selectedColony]}
            isQuarantined={quarantinedIds.has(selectedColony)}
            alerts={alerts.filter(a => a.colonyId === selectedColony)}
            onOpenPRP={onOpenPRP}
          />

          {/* Recent supply events for this colony */}
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-1.5">
              <i className="ri-time-line text-cyan-400" />Recent Events
              <span className="ml-auto text-gray-600">for {selectedColonyData.colonyName}</span>
            </p>
            <div className="space-y-2">
              {SUPPLY_EVENTS
                .filter(e => e.colony === selectedColonyData.colonyName)
                .slice(0, 3)
                .map(e => (
                  <div
                    key={e.id}
                    className="flex items-start gap-2.5 rounded-lg px-3 py-2"
                    style={{
                      background: e.resolved ? 'rgba(74,222,128,0.06)' : e.severity === 'critical' ? 'rgba(244,63,94,0.07)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${e.resolved ? 'rgba(74,222,128,0.2)' : e.severity === 'critical' ? 'rgba(244,63,94,0.25)' : 'rgba(255,255,255,0.07)'}`,
                    }}
                  >
                    <i className={`${e.icon} text-xs mt-0.5 flex-shrink-0`} style={{ color: e.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white leading-tight">{e.title}</p>
                      <p className="text-xs text-gray-500 leading-tight mt-0.5">{e.timeAgo}</p>
                    </div>
                    {e.resolved && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', fontSize: 9 }}>
                        RESOLVED
                      </span>
                    )}
                  </div>
                ))}
              {SUPPLY_EVENTS.filter(e => e.colony === selectedColonyData.colonyName).length === 0 && (
                <p className="text-xs text-gray-600 text-center py-3">No recent events for this colony</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live status bar */}
      <div
        className="rounded-xl p-4"
        style={{ background: 'rgba(10,15,30,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-1.5">
          <i className="ri-bar-chart-line text-cyan-400" />Empire-Wide Health Comparison
        </p>
        <div className="space-y-3">
          {COLONY_HEALTH_DATA.map(c => {
            const sanState = sanitationStates[c.colonyId];
            const sanStats = sanState ? computeSanitationStats(sanState) : { totalSanitationBonus: 0 } as any;
            const effSan = Math.min(100, c.sanitationLevel + (sanStats.totalSanitationBonus ?? 0));
            const hc = c.healthScore > 75 ? '#4ade80' : c.healthScore > 50 ? '#fbbf24' : c.healthScore > 30 ? '#f87171' : '#f43f5e';
            const prpOn = !!(prpStates[c.colonyId]?.activeUntil && prpStates[c.colonyId].activeUntil! > now);
            const colAlerts = alerts.filter(a => a.colonyId === c.colonyId && !a.dismissed);
            const trends = trendsRef.current[c.colonyId] ?? [];

            return (
              <div key={c.colonyId} className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedColony(c.colonyId)}
                  className="w-32 text-left cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap flex items-center gap-1.5"
                >
                  <span className="text-xs font-semibold text-gray-300 truncate">{c.colonyName}</span>
                </button>
                {/* Health bar */}
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${c.healthScore}%`, background: hc }} />
                  </div>
                  <span className="text-xs font-bold w-8 text-right" style={{ color: hc }}>{c.healthScore}%</span>
                </div>
                {/* Sanitation */}
                <div className="w-28 flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${effSan}%`, background: '#38bdf8' }} />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{effSan}%</span>
                </div>
                {/* Sparkline */}
                <div className="hidden xl:block w-20">
                  <Sparkline data={trends.map(s => s.health)} width={80} height={18} color={hc} showDot={false} />
                </div>
                {/* Status chips */}
                <div className="flex items-center gap-1.5 w-28 justify-end">
                  {colAlerts.length > 0 && <AlertBadge count={colAlerts.length} />}
                  {prpOn && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', fontSize: 9 }}>PRP</span>
                  )}
                  {c.diseases.length > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', fontSize: 9 }}>
                      {c.diseases.length}🦠
                    </span>
                  )}
                  {c.diseases.length === 0 && !prpOn && colAlerts.length === 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', fontSize: 9 }}>OK</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Threshold lines legend */}
        <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs text-gray-600">Health thresholds:</span>
          <span className="text-xs flex items-center gap-1" style={{ color: '#fbbf24' }}>
            <span className="w-6 h-0.5 inline-block" style={{ background: '#fbbf24' }} />
            Warn {thresholds.healthWarn}%
          </span>
          <span className="text-xs flex items-center gap-1" style={{ color: '#f43f5e' }}>
            <span className="w-6 h-0.5 inline-block" style={{ background: '#f43f5e' }} />
            Crit {thresholds.healthCrit}%
          </span>
          <button
            onClick={() => setShowThresholdModal(true)}
            className="ml-auto text-xs cursor-pointer transition-all hover:text-cyan-400 whitespace-nowrap"
            style={{ color: '#4b5563' }}
          >
            <i className="ri-settings-3-line mr-1" />Edit
          </button>
        </div>
      </div>
    </div>
  );
}