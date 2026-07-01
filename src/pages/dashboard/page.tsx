import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useResources } from '../../hooks/useResources';
import { useTimeBasedEvents } from '../../hooks/useTimeBasedEvents';
import { useGameTime } from '../../hooks/useGameTime';
import { supabase } from '../../lib/supabase';
import WelcomeBackCelebration from '../../components/feature/WelcomeBackCelebration';

/* ═══════════════════════════════════════════════════════════════════════
   ANIMATED NUMBER
   ═══════════════════════════════════════════════════════════════════════ */
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const from = prev.current;
    const to = value;
    prev.current = value;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / 800, 1);
      setDisplay(Math.floor(from + (to - from) * progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <>{display.toLocaleString()}{suffix}</>;
}

function formatNum(n: number | undefined | null): string {
  if (!n || isNaN(n)) return '0';
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}

/* ═══════════════════════════════════════════════════════════════════════
   SKELETON
   ═══════════════════════════════════════════════════════════════════════ */
function Sk({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-white/[0.04] ${className}`} />;
}

/* ═══════════════════════════════════════════════════════════════════════
   SERVER PULSE BAR — Live universe stats (inspired by stellar-dominion)
   ═══════════════════════════════════════════════════════════════════════ */
function ServerPulseBar() {
  const [pulseStats] = useState({
    activePlayers: 50847,
    activeBattles: 12847,
    shipsDestroyedToday: 2400000,
    dailyTransactions: 890000,
  });

  const stats = [
    { label: 'ACTIVE COMMANDERS', val: pulseStats.activePlayers, icon: 'ri-user-3-line', color: '#5bc0be' },
    { label: 'LIVE BATTLES', val: pulseStats.activeBattles, icon: 'ri-fire-line', color: '#f87171' },
    { label: 'SHIPS DESTROYED TODAY', val: pulseStats.shipsDestroyedToday, icon: 'ri-skull-2-line', color: '#fb923c' },
    { label: 'TRADES TODAY', val: pulseStats.dailyTransactions, icon: 'ri-exchange-line', color: '#34d399' },
  ];

  return (
    <div className="flex items-stretch gap-0 overflow-hidden rounded-xl mb-4" style={{ border: '1px solid #1e2a36', background: '#080b0f' }}>
      <div className="flex items-center gap-2 px-4 py-3 flex-shrink-0" style={{ borderRight: '1px solid #1e2a36', background: 'rgba(212,168,83,0.06)' }}>
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs font-bold tracking-wider" style={{ color: '#34d399', fontSize: 10 }}>UNIVERSE ONLINE</span>
      </div>
      {stats.map((s, i) => (
        <div key={s.label} className="flex-1 flex items-center justify-center gap-2 px-3 py-3" style={{ borderRight: i < stats.length - 1 ? '1px solid #1e2a36' : 'none' }}>
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: `${s.color}10` }}>
            <i className={`${s.icon} text-xs`} style={{ color: s.color }} />
          </div>
          <div className="leading-tight">
            <div className="text-xs font-black text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 13 }}>{formatNum(s.val)}</div>
            <div className="text-xs opacity-50" style={{ color: '#5a6577', fontSize: 9, letterSpacing: '0.1em' }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   CINEMATIC PLANET HERO — Command center view of current planet
   ═══════════════════════════════════════════════════════════════════════ */
function PlanetHero({
  planet,
  loading,
  onPlanetSelect,
  planets,
  selectedIndex,
}: {
  planet: any;
  loading: boolean;
  onPlanetSelect: (i: number) => void;
  planets: any[];
  selectedIndex: number;
}) {
  const gameTime = useGameTime();

  if (loading) {
    return (
      <div className="rounded-xl overflow-hidden relative mb-4" style={{ border: '1px solid #1e2a36', minHeight: 220 }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0d131a 0%, #111922 50%, #080b0f 100%)' }} />
        <div className="relative z-10 p-6">
          <Sk className="h-8 w-48 mb-3" />
          <Sk className="h-4 w-72 mb-6" />
          <div className="flex gap-3">
            <Sk className="h-10 w-32" />
            <Sk className="h-10 w-32" />
            <Sk className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden relative mb-4" style={{ border: '1px solid #1e2a36', minHeight: 220 }}>
      {/* Background image */}
      {planet?.image_url ? (
        <img src={planet.image_url} alt={planet.name} className="absolute inset-0 w-full h-full object-cover object-top" style={{ filter: 'brightness(0.35)' }} />
      ) : (
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0d131a 0%, #111922 50%, #080b0f 100%)' }} />
      )}

      {/* Scanline overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
      }} />

      {/* Gradient overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)' }} />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-16 h-16" style={{ borderTop: '2px solid rgba(212,168,83,0.3)', borderLeft: '2px solid rgba(212,168,83,0.3)' }} />
      <div className="absolute top-0 right-0 w-16 h-16" style={{ borderTop: '2px solid rgba(212,168,83,0.3)', borderRight: '2px solid rgba(212,168,83,0.3)' }} />
      <div className="absolute bottom-0 left-0 w-16 h-16" style={{ borderBottom: '2px solid rgba(212,168,83,0.3)', borderLeft: '2px solid rgba(212,168,83,0.3)' }} />
      <div className="absolute bottom-0 right-0 w-16 h-16" style={{ borderBottom: '2px solid rgba(212,168,83,0.3)', borderRight: '2px solid rgba(212,168,83,0.3)' }} />

      <div className="relative z-10 p-6">
        {/* Top row: Planet selector pills + stardate */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {planets.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => onPlanetSelect(idx)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all text-left"
                style={{
                  background: idx === selectedIndex ? 'rgba(212,168,83,0.15)' : 'rgba(255,255,255,0.04)',
                  border: idx === selectedIndex ? '1px solid rgba(212,168,83,0.4)' : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="w-6 h-6 rounded overflow-hidden flex-shrink-0" style={{ border: '1px solid #1e2a36' }}>
                  <img src={p.image_url || ''} alt={p.name} className="w-full h-full object-cover object-top" />
                </div>
                <span className="text-xs font-semibold" style={{ color: idx === selectedIndex ? '#d4a853' : '#6b7a95' }}>{p.name}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(226,192,68,0.15)' }}>
            <i className="ri-time-line text-xs" style={{ color: '#e2c044' }} />
            <span className="text-xs font-mono" style={{ color: '#e2c044', fontSize: 11 }}>{gameTime.dateDisplay} · {gameTime.timeDisplay} GST</span>
          </div>
        </div>

        {/* Planet name + badges */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 20px rgba(212,168,83,0.3)' }}>
                {planet?.name || 'Unknown World'}
              </h1>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold" style={{ background: 'rgba(212,168,83,0.15)', border: '1px solid rgba(212,168,83,0.3)', color: '#d4a853' }}>
                RANK #42
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: '#5a6577' }}>
              <span className="flex items-center gap-1">
                <i className="ri-map-pin-line" style={{ color: '#d4a853' }} />
                {planet?.coordinates || `[${planet?.position_galaxy}:${planet?.position_system}:${planet?.position_planet}]`}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#3a4557]" />
              <span>{planet?.planet_type || 'Unknown'}</span>
              <span className="w-1 h-1 rounded-full bg-[#3a4557]" />
              <span className="flex items-center gap-1">
                <i className="ri-temp-hot-line" style={{ color: '#e2c044' }} />
                {planet?.temperature || 0}°C
              </span>
              <span className="w-1 h-1 rounded-full bg-[#3a4557]" />
              <span className="flex items-center gap-1">
                <i className="ri-layout-grid-line" style={{ color: '#5bc0be' }} />
                {planet?.fields_used || 0}/{planet?.fields_max || 0} Fields
              </span>
            </div>
          </div>

          {/* Planet status badges */}
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5" style={{ background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.2)', color: '#d4a853' }}>
              <i className={planet?.is_homeworld ? 'ri-home-4-line' : 'ri-flag-line'} />
              {planet?.is_homeworld ? 'HOMEWORLD' : planet?.is_capital ? 'CAPITAL' : 'COLONY'}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5" style={{ background: 'rgba(91,192,190,0.1)', border: '1px solid rgba(91,192,190,0.2)', color: '#5bc0be' }}>
              <i className="ri-water-flash-line" />
              HABITABILITY {planet?.habitability || 0}%
            </span>
            <span className="text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5" style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', color: '#a78bfa' }}>
              <i className="ri-gemini-line" />
              RESOURCES {planet?.resource_richness || 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   RESOURCE HUD — Gauge-style resource cards
   ═══════════════════════════════════════════════════════════════════════ */
function ResourceGauge({
  label, icon, color, value, production, capacity,
}: {
  label: string; icon: string; color: string;
  value: number; production: number; capacity: number;
}) {
  const pct = capacity > 0 ? Math.min((value / capacity) * 100, 100) : 0;
  const isFull = pct >= 90;

  return (
    <div className="rounded-xl p-4 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.015)', border: `1px solid ${color}15` }}>
      {/* Subtle glow */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20" style={{ background: color }} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}12` }}>
              <i className={`${icon} text-sm`} style={{ color }} />
            </div>
            <span className="text-xs font-bold tracking-wider" style={{ color: '#6b7a95', fontSize: 10 }}>{label}</span>
          </div>
          {isFull && (
            <span className="text-xs px-1.5 py-0.5 rounded font-bold animate-pulse" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', fontSize: 9 }}>FULL</span>
          )}
        </div>

        <div className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          {formatNum(value)}
        </div>

        {/* Capacity bar */}
        {capacity > 0 && (
          <div className="w-full h-1 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: isFull ? 'linear-gradient(90deg, #f87171, #fb923c)' : `linear-gradient(90deg, ${color}66, ${color})`,
              }}
            />
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <i className="ri-arrow-up-line text-xs" style={{ color: '#34d399' }} />
          <span className="text-xs font-bold" style={{ color: '#34d399' }}>+{formatNum(production)}/hr</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   EMPIRE POWER GRID — Big stat cards
   ═══════════════════════════════════════════════════════════════════════ */
function PowerCard({
  label, value, subtext, icon, color, onClick,
}: {
  label: string; value: number; subtext: string; icon: string; color: string; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative rounded-xl p-5 text-left cursor-pointer transition-all hover:brightness-110 overflow-hidden group"
      style={{ background: 'rgba(255,255,255,0.015)', border: `1px solid ${color}15` }}
    >
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-15 transition-opacity" style={{ background: color }} />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}12` }}>
            <i className={`${icon} text-lg`} style={{ color }} />
          </div>
          <span className="text-xs font-bold tracking-wider" style={{ color: '#5a6577', fontSize: 10 }}>{label}</span>
        </div>
        <div className="text-3xl font-black text-white mb-1" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          <AnimatedNumber value={value} />
        </div>
        <div className="text-xs" style={{ color: '#4a5568' }}>{subtext}</div>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   TACTICAL EVENT FEED — Rich combat & event log
   ═══════════════════════════════════════════════════════════════════════ */
function TacticalFeed({
  events, loading, userId,
}: {
  events: any[]; loading: boolean; userId?: string;
}) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="rounded-xl" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
        <div className="px-4 py-3" style={{ borderBottom: '1px solid #1e2a36' }}>
          <h3 className="text-xs font-bold tracking-wider" style={{ color: '#8892aa' }}>TACTICAL FEED</h3>
        </div>
        <div className="p-4 space-y-3">
          <Sk className="h-14 w-full" />
          <Sk className="h-14 w-full" />
          <Sk className="h-14 w-full" />
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-xl" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1e2a36' }}>
          <h3 className="text-xs font-bold tracking-wider" style={{ color: '#8892aa' }}>TACTICAL FEED</h3>
          <button onClick={() => navigate('/messages')} className="text-xs cursor-pointer hover:opacity-80" style={{ color: '#5a6577' }}>View All →</button>
        </div>
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <i className="ri-radar-line text-xl" style={{ color: '#3a4557' }} />
          </div>
          <p className="text-xs" style={{ color: '#5a6577' }}>No recent tactical events</p>
          <p className="text-xs mt-1" style={{ color: '#3a4557' }}>Your empire is at peace... for now</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1e2a36' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <h3 className="text-xs font-bold tracking-wider" style={{ color: '#8892aa' }}>TACTICAL FEED</h3>
        </div>
        <button onClick={() => navigate('/messages')} className="text-xs cursor-pointer hover:opacity-80" style={{ color: '#5a6577' }}>View All →</button>
      </div>
      <div>
        {events.slice(0, 6).map((event, i) => {
          const isMyAttack = event.attacker_id === userId;
          const isMyDefense = event.defender_id === userId;
          let icon = 'ri-sword-line';
          let color = '#e2c044';
          let title = '';
          let detail = '';
          let outcome = '';

          if (event.result === 'defender_repelled') {
            if (isMyDefense) {
              title = `Defense repelled attack`;
              detail = `Enemy forces destroyed at ${event.coordinates}`;
              outcome = 'VICTORY';
              color = '#4ade80'; icon = 'ri-shield-flash-line';
            } else {
              title = `Attack repelled`;
              detail = `Your assault on ${event.defender_name} failed`;
              outcome = 'REPELLED';
              color = '#f87171'; icon = 'ri-error-warning-line';
            }
          } else if (event.result === 'attacker_victory') {
            if (isMyAttack) {
              title = `Victory! Colony raided`;
              const res = event.resources_plundered;
              detail = `Plundered ${formatNum(res?.metal || 0)} Metal from ${event.defender_name}`;
              outcome = 'VICTORY';
              color = '#4ade80'; icon = 'ri-trophy-line';
            } else {
              title = `Defeated by ${event.attacker_name}`;
              detail = `Colony at ${event.coordinates} under enemy control`;
              outcome = 'DEFEAT';
              color = '#f87171'; icon = 'ri-skull-line';
            }
          } else if (event.result === 'defender_victory') {
            if (isMyDefense) {
              title = `Victory! Defense held`;
              detail = `Repelled ${event.attacker_name} at ${event.coordinates}`;
              outcome = 'VICTORY';
              color = '#4ade80'; icon = 'ri-shield-check-line';
            } else {
              title = `Attack failed`;
              detail = `Defenses too strong at ${event.coordinates}`;
              outcome = 'FAILED';
              color = '#fb923c'; icon = 'ri-shield-star-line';
            }
          } else {
            title = `${event.attacker_name} vs ${event.defender_name}`;
            detail = `Battle at ${event.coordinates}`;
            outcome = event.result?.toUpperCase() || 'UNKNOWN';
            color = '#e2c044'; icon = 'ri-sword-line';
          }

          const timeAgo = (() => {
            const ms = new Date().getTime() - new Date(event.created_at).getTime();
            const mins = Math.floor(ms / 60000);
            if (mins < 1) return 'just now';
            if (mins < 60) return `${mins}m ago`;
            const hrs = Math.floor(mins / 60);
            if (hrs < 24) return `${hrs}h ago`;
            return `${Math.floor(hrs / 24)}d ago`;
          })();

          return (
            <div
              key={event.id}
              className="px-4 py-3 flex items-start gap-3 transition-all hover:bg-white/[0.02] cursor-default"
              style={{ borderBottom: i < Math.min(events.length, 6) - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${color}12` }}>
                <i className={`${icon} text-sm`} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-white">{title}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: `${color}15`, color, fontSize: 9 }}>{outcome}</span>
                </div>
                <div className="text-xs" style={{ color: '#4a5568' }}>{detail}</div>
              </div>
              <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: '#3a4557', fontSize: 10 }}>{timeAgo}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   OPERATIONS COMMAND PANEL — Active fleets + queues
   ═══════════════════════════════════════════════════════════════════════ */
function OperationsPanel({
  fleets, buildQueue, researchQueue, loading,
}: {
  fleets: any[]; buildQueue: any[]; researchQueue: any[]; loading: boolean;
}) {
  const navigate = useNavigate();

  const activeFleets = fleets.filter(f => f.status !== 'idle' && f.status !== 'stationed');

  return (
    <div className="rounded-xl" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1e2a36' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-xs font-bold tracking-wider" style={{ color: '#8892aa' }}>ACTIVE OPERATIONS</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: 'rgba(91,192,190,0.1)', color: '#5bc0be', fontSize: 9 }}>
            {activeFleets.length} FLEETS
          </span>
          <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: 'rgba(212,168,83,0.1)', color: '#d4a853', fontSize: 9 }}>
            {buildQueue.length} BUILDING
          </span>
          <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa', fontSize: 9 }}>
            {researchQueue.length} RESEARCH
          </span>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {loading ? (
          <>
            <Sk className="h-16 w-full" />
            <Sk className="h-16 w-full" />
          </>
        ) : (
          <>
            {/* Active Fleets */}
            {activeFleets.length > 0 && (
              <div>
                <div className="text-xs font-bold tracking-wider mb-2 px-1" style={{ color: '#5a6577', fontSize: 10 }}>FLEET MOVEMENTS</div>
                <div className="space-y-1.5">
                  {activeFleets.slice(0, 3).map((fleet) => {
                    const missionColor = fleet.mission === 'attack' || fleet.mission === 'raid' ? '#f87171'
                      : fleet.mission === 'transport' ? '#5bc0be'
                      : fleet.mission === 'spy' ? '#e2c044'
                      : fleet.mission === 'colonize' ? '#a78bfa'
                      : '#8892aa';
                    const arrival = fleet.arrival_time ? new Date(fleet.arrival_time) : null;
                    const now = new Date();
                    let eta = '—';
                    let progress = 0;
                    if (arrival) {
                      const diff = arrival.getTime() - now.getTime();
                      if (diff <= 0) eta = 'Arriving...';
                      else {
                        const m = Math.floor(diff / 60000);
                        const s = Math.floor((diff % 60000) / 1000);
                        eta = m > 0 ? `${m}m ${s}s` : `${s}s`;
                      }
                      const departure = fleet.departure_time ? new Date(fleet.departure_time) : new Date(now.getTime() - 3600000);
                      const total = Math.max(1, arrival.getTime() - departure.getTime());
                      const elapsed = Math.max(0, now.getTime() - departure.getTime());
                      progress = Math.min(100, (elapsed / total) * 100);
                    }

                    return (
                      <div key={fleet.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${missionColor}12` }}>
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: missionColor }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white">{fleet.name}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: `${missionColor}15`, color: missionColor, fontSize: 9 }}>
                              {fleet.mission?.toUpperCase()}
                            </span>
                          </div>
                          <div className="w-full h-1 rounded-full mt-1.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <div className="h-1 rounded-full" style={{ width: `${progress}%`, background: missionColor }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs font-bold" style={{ color: missionColor }}>{formatNum(fleet.total_ships)} ships</span>
                          <span className="text-xs font-mono" style={{ color: '#e2c044' }}>{eta}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {activeFleets.length > 3 && (
                  <button onClick={() => navigate('/fleet')} className="w-full text-center text-xs py-2 cursor-pointer hover:opacity-80" style={{ color: '#5a6577' }}>
                    +{activeFleets.length - 3} more fleets →
                  </button>
                )}
              </div>
            )}

            {/* Build Queue */}
            {buildQueue.length > 0 && (
              <div>
                <div className="text-xs font-bold tracking-wider mb-2 px-1" style={{ color: '#5a6577', fontSize: 10 }}>CONSTRUCTION</div>
                {buildQueue.slice(0, 2).map((item) => {
                  if (!item.completion_time) return null;
                  const completion = new Date(item.completion_time);
                  const now = new Date();
                  const created = item.created_at ? new Date(item.created_at) : new Date(now.getTime() - 3600000);
                  const total = Math.max(1, completion.getTime() - created.getTime());
                  const remaining = Math.max(0, completion.getTime() - now.getTime());
                  const progress = Math.min(100, ((total - remaining) / total) * 100);
                  const hrs = Math.floor(remaining / 3600000);
                  const mins = Math.floor((remaining % 3600000) / 60000);
                  const timeStr = remaining <= 0 ? 'Complete' : hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
                  const name = (item.building_type || '').replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

                  return (
                    <div key={item.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,168,83,0.1)' }}>
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#d4a853' }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">{name} <span style={{ color: '#5a6577' }}>Lv.{item.level}</span></span>
                          <span className="text-xs font-mono" style={{ color: '#e2c044' }}>{timeStr}</span>
                        </div>
                        <div className="w-full h-1 rounded-full mt-1.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <div className="h-1 rounded-full" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #d4a853, #e2c044)' }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Research Queue */}
            {researchQueue.length > 0 && (
              <div>
                <div className="text-xs font-bold tracking-wider mb-2 px-1" style={{ color: '#5a6577', fontSize: 10 }}>RESEARCH</div>
                {researchQueue.slice(0, 1).map((item) => {
                  if (!item.completion_time) return null;
                  const completion = new Date(item.completion_time);
                  const now = new Date();
                  const created = item.created_at ? new Date(item.created_at) : new Date(now.getTime() - 3600000);
                  const total = Math.max(1, completion.getTime() - created.getTime());
                  const remaining = Math.max(0, completion.getTime() - now.getTime());
                  const progress = Math.min(100, ((total - remaining) / total) * 100);
                  const hrs = Math.floor(remaining / 3600000);
                  const mins = Math.floor((remaining % 3600000) / 60000);
                  const timeStr = remaining <= 0 ? 'Complete' : hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
                  const name = (item.technology_id || '').replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

                  return (
                    <div key={item.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(167,139,250,0.1)' }}>
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#a78bfa' }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">{name}</span>
                          <span className="text-xs font-mono" style={{ color: '#e2c044' }}>{timeStr}</span>
                        </div>
                        <div className="w-full h-1 rounded-full mt-1.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <div className="h-1 rounded-full" style={{ width: `${progress}%`, background: '#a78bfa' }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeFleets.length === 0 && buildQueue.length === 0 && researchQueue.length === 0 && (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <i className="ri-shield-check-line text-xl" style={{ color: '#3a4557' }} />
                </div>
                <p className="text-xs" style={{ color: '#5a6577' }}>No active operations</p>
                <p className="text-xs mt-1" style={{ color: '#3a4557' }}>Launch a fleet or start construction</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   QUICK COMMAND DOCK — Bottom action bar
   ═══════════════════════════════════════════════════════════════════════ */
function CommandDock() {
  const navigate = useNavigate();

  const commands = [
    { label: 'Build', icon: 'ri-building-line', color: '#d4a853', path: '/buildings', desc: 'Structures' },
    { label: 'Research', icon: 'ri-flask-line', color: '#a78bfa', path: '/research', desc: 'Technologies' },
    { label: 'Shipyard', icon: 'ri-tools-line', color: '#5bc0be', path: '/shipyard', desc: 'Ships' },
    { label: 'Defense', icon: 'ri-shield-line', color: '#fb923c', path: '/defense', desc: 'Fortify' },
    { label: 'Fleet', icon: 'ri-rocket-line', color: '#34d399', path: '/fleet', desc: 'Command' },
    { label: 'Galaxy', icon: 'ri-global-line', color: '#60a5fa', path: '/galaxy', desc: 'Explore' },
    { label: 'Combat', icon: 'ri-sword-line', color: '#f87171', path: '/fleet-combat', desc: 'Engage' },
    { label: 'Market', icon: 'ri-store-2-line', color: '#4ade80', path: '/marketplace', desc: 'Trade' },
  ];

  return (
    <div className="mt-4 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
      <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #1e2a36' }}>
        <h3 className="text-xs font-bold tracking-wider" style={{ color: '#5a6577' }}>COMMAND DOCK</h3>
      </div>
      <div className="p-3 grid grid-cols-4 sm:grid-cols-8 gap-2">
        {commands.map((cmd) => (
          <button
            key={cmd.label}
            onClick={() => navigate(cmd.path)}
            className="group rounded-lg p-3 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all hover:brightness-125 active:scale-95"
            style={{ background: `${cmd.color}06`, border: `1px solid ${cmd.color}15` }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-all group-hover:scale-110" style={{ background: `${cmd.color}10` }}>
              <i className={`${cmd.icon} text-xl`} style={{ color: cmd.color }} />
            </div>
            <span className="text-xs font-semibold text-white whitespace-nowrap">{cmd.label}</span>
            <span className="text-xs opacity-50" style={{ color: '#5a6577', fontSize: 9 }}>{cmd.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   TIME EVENTS BANNER
   ═══════════════════════════════════════════════════════════════════════ */
function TimeEventsBanner({ timeEvents }: { timeEvents: ReturnType<typeof useTimeBasedEvents> }) {
  if (!timeEvents.isWeekendDay && timeEvents.activeCelestialEvents.length === 0 && timeEvents.todayHolidays.length === 0 && timeEvents.bossSpawnEvents.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="rounded-xl p-4" style={{
        background: 'linear-gradient(135deg, rgba(226,192,68,0.06) 0%, rgba(167,139,250,0.04) 100%)',
        border: '1px solid rgba(226,192,68,0.2)',
      }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-bold tracking-wider" style={{ color: '#e2c044' }}>ACTIVE TIME MODIFIERS</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {timeEvents.isWeekendDay && (
            <span className="text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5"
              style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399' }}>
              <i className="ri-calendar-check-line w-3.5 h-3.5 flex items-center justify-center" />
              Double Resource Weekend! (+100%)
            </span>
          )}
          {timeEvents.activeCelestialEvents.map((e) => (
            <span key={e.id} className="text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5"
              style={{ background: `${e.color}10`, border: `1px solid ${e.color}30`, color: e.color }}>
              <i className={`${e.icon} w-3.5 h-3.5 flex items-center justify-center`} />
              {e.name}
            </span>
          ))}
          {timeEvents.todayHolidays.map((h) => (
            <span key={h.id} className="text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5"
              style={{ background: `${h.color}10`, border: `1px solid ${h.color}30`, color: h.color }}>
              <i className={`${h.icon} w-3.5 h-3.5 flex items-center justify-center`} />
              {h.name}
            </span>
          ))}
          {timeEvents.bossSpawnEvents.map((boss) => (
            <span key={boss.bossId} className="text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 animate-pulse"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
              <i className="ri-skull-2-line w-3.5 h-3.5 flex items-center justify-center" />
              BOSS: {boss.bossName}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN DASHBOARD PAGE
   ═══════════════════════════════════════════════════════════════════════ */
function OverviewHeader({
  commanderName,
  currentPlanet,
  planetCount,
  warAlert,
  stats,
  resources,
  onCollect,
  onNavigate,
}: {
  commanderName: string;
  currentPlanet: any;
  planetCount: number;
  warAlert: string;
  stats: {
    totalFleetPower: number;
    totalDefensePower: number;
    totalResearchPoints: number;
    totalBuildings: number;
    totalShips: number;
    battlesWon: number;
    battlesLost: number;
    rank: number;
  };
  resources: any;
  onCollect: () => void;
  onNavigate: (path: string) => void;
}) {
  const score = stats.totalBuildings * 1000 + stats.totalFleetPower + stats.totalResearchPoints;
  const healthItems = [
    { label: 'Fleet', value: formatNum(stats.totalFleetPower), icon: 'ri-rocket-2-line', color: '#5bc0be' },
    { label: 'Defense', value: formatNum(stats.totalDefensePower), icon: 'ri-shield-star-line', color: '#f87171' },
    { label: 'Research', value: formatNum(stats.totalResearchPoints), icon: 'ri-flask-line', color: '#a78bfa' },
  ];

  return (
    <section className="mb-4 overflow-hidden rounded-lg border border-[#1e2a36] bg-[#080b0f]">
      <div className="relative">
        {currentPlanet?.image_url ? (
          <img
            src={currentPlanet.image_url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-top opacity-25"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(91,192,190,0.20),transparent_34%),linear-gradient(135deg,#0c1118_0%,#080b0f_58%,#11110b_100%)]" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,11,15,0.96)_0%,rgba(8,11,15,0.86)_48%,rgba(8,11,15,0.64)_100%)]" />

        <div className="relative grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-5">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded border border-[#34d399]/30 bg-[#34d399]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#34d399]">
                Command Overview
              </span>
              <span className="rounded border border-[#1e2a36] bg-black/30 px-2 py-1 text-[10px] font-semibold text-[#8892aa]">
                Rank #{stats.rank}
              </span>
              <span className="rounded border border-[#1e2a36] bg-black/30 px-2 py-1 text-[10px] font-semibold text-[#8892aa]">
                {planetCount} worlds
              </span>
            </div>

            <div className="mb-5">
              <h1 className="text-2xl font-black leading-tight text-white md:text-4xl" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {commanderName}'s Command Deck
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8892aa]">
                {currentPlanet?.name || 'Primary world'} is the active command focus. Fleet posture, resources, queues, and live alerts are gathered here for quick decisions.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              {healthItems.map((item) => (
                <div key={item.label} className="rounded-lg border border-white/[0.06] bg-black/25 p-3">
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#5a6577]">
                    <i className={item.icon} style={{ color: item.color }} />
                    {item.label}
                  </div>
                  <div className="text-lg font-black text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#1e2a36] bg-black/35 p-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#5a6577]">Empire Score</div>
                <div className="mt-1 text-3xl font-black text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>{formatNum(score)}</div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/leaderboard')}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#d4a853]/30 bg-[#d4a853]/10 text-[#d4a853] transition hover:brightness-125"
                aria-label="Open leaderboard"
                title="Open leaderboard"
              >
                <i className="ri-trophy-line text-lg" />
              </button>
            </div>

            <div className="mb-3 grid grid-cols-3 gap-2">
              {[
                { icon: 'ri-copper-coin-line', value: resources.metal, color: '#d4a853' },
                { icon: 'ri-sparkling-line', value: resources.crystal, color: '#5bc0be' },
                { icon: 'ri-drop-line', value: resources.deuterium, color: '#7bc67e' },
              ].map((item) => (
                <div key={item.icon} className="rounded border border-white/[0.06] bg-white/[0.03] px-2 py-2 text-center">
                  <i className={item.icon} style={{ color: item.color }} />
                  <div className="mt-1 text-xs font-bold text-white">{formatNum(item.value || 0)}</div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onCollect}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#d4a853] to-[#e2c044] px-4 py-2.5 text-sm font-black text-[#080b0f] transition hover:brightness-110 active:scale-[0.99]"
            >
              <i className="ri-download-cloud-line" />
              Auto-Collect Resources
            </button>

            <div className="rounded-lg border border-[#f87171]/20 bg-[#f87171]/10 px-3 py-2">
              <div className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#f87171]">
                <span className="h-2 w-2 rounded-full bg-[#f87171]" />
                Live Alert
              </div>
              <p className="truncate text-xs text-[#d4d9e6]">{warAlert}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { resources: gameResources, loading: resourcesLoading } = useResources();
  const timeEvents = useTimeBasedEvents();
  const [selectedPlanet, setSelectedPlanet] = useState(0);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [productionRates, setProductionRates] = useState({ metal: 0, crystal: 0, deuterium: 0, energy: 0 });
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [tickerIndex, setTickerIndex] = useState(0);
  const [warAlerts] = useState<string[]>([
    'Alliance [NOVA] declared war on [TITAN] — Galaxy 3',
    'World Boss "Void Leviathan" spawned at [3:421:0] — 28% HP remaining',
    'Massive fleet battle detected in [2:156:5] — 450 ships lost',
    'Galactic Tournament starting in 02:14:38',
    'Commander DarkLord claims #1 rank with 245M points',
  ]);

  // ── DB-fetched state ──
  const [dbPlanets, setDbPlanets] = useState<any[]>([]);
  const [dbFleets, setDbFleets] = useState<any[]>([]);
  const [buildQueue, setBuildQueue] = useState<any[]>([]);
  const [researchQueue, setResearchQueue] = useState<any[]>([]);
  const [eventLog, setEventLog] = useState<any[]>([]);
  const [playerStats, setPlayerStats] = useState({
    totalFleetPower: 0, totalDefensePower: 0, totalResearchPoints: 0,
    totalBuildings: 0, totalShips: 0, totalColonies: 0,
    battlesWon: 0, battlesLost: 0, rank: 42,
  });
  const [sectionLoading, setSectionLoading] = useState({
    planets: true, fleets: true, queues: true, events: true, stats: true,
  });
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Fetch dashboard data progressively ──
  const fetchDashboardData = useCallback(async () => {
    if (!user) return;

    loadTimeoutRef.current = setTimeout(() => {
      setSectionLoading({ planets: false, fleets: false, queues: false, events: false, stats: false });
    }, 15000);

    try {
      // Phase 1: Planets
      supabase.from('planets').select('*').eq('player_id', user.id).order('created_at')
        .then(({ data }) => {
          if (data) setDbPlanets(data);
          setSectionLoading(prev => ({ ...prev, planets: false }));
        }).catch(() => setSectionLoading(prev => ({ ...prev, planets: false })));

      // Phase 1: Stats
      Promise.all([
        supabase.from('buildings').select('level').eq('player_id', user.id),
        supabase.from('ships').select('quantity,ship_type').eq('user_id', user.id),
        supabase.from('technologies').select('level').eq('player_id', user.id),
        supabase.from('defense_structures').select('quantity,structure_type').eq('player_id', user.id),
      ]).then(([buildings, ships, techs, defenses]) => {
        let fleetPower = 0, totalShips = 0;
        if (ships.data) {
          const powerMap: any = {
            light_fighter: 4000, heavy_fighter: 10000, cruiser: 27000, battleship: 60000,
            battlecruiser: 70000, destroyer: 110000, small_cargo: 4000, large_cargo: 12000,
            colony_ship: 12000, recycler: 16000, espionage_probe: 0,
          };
          ships.data.forEach((s: any) => {
            totalShips += s.quantity || 0;
            fleetPower += (s.quantity || 0) * (powerMap[s.ship_type] || 5000);
          });
        }
        let totalBuildings = 0;
        if (buildings.data) totalBuildings = buildings.data.reduce((sum: number, b: any) => sum + (b.level || 0), 0);
        let totalResearch = 0;
        if (techs.data) totalResearch = techs.data.reduce((sum: number, t: any) => sum + (t.level || 0), 0) * 100000;
        let totalDefense = 0;
        const defPowerMap: any = {
          rocket_launcher: 2000, light_laser: 2000, heavy_laser: 8000, gauss_cannon: 35000,
          ion_cannon: 50000, plasma_turret: 100000, small_shield_dome: 20000, large_shield_dome: 100000,
        };
        if (defenses.data) {
          defenses.data.forEach((d: any) => {
            totalDefense += (d.quantity || 0) * (defPowerMap[d.structure_type] || 2000);
          });
        }
        setPlayerStats({
          totalFleetPower: fleetPower, totalDefensePower: totalDefense, totalResearchPoints: totalResearch,
          totalBuildings, totalShips, totalColonies: 0,
          battlesWon: 0, battlesLost: 0, rank: 42,
        });
        setSectionLoading(prev => ({ ...prev, stats: false }));
      }).catch(() => setSectionLoading(prev => ({ ...prev, stats: false })));

      // Phase 2: Fleets
      supabase.from('fleets').select('*').eq('player_id', user.id).order('created_at')
        .then(({ data }) => {
          if (data) setDbFleets(data);
          setSectionLoading(prev => ({ ...prev, fleets: false }));
        }).catch(() => setSectionLoading(prev => ({ ...prev, fleets: false })));

      // Phase 2: Queues
      Promise.all([
        supabase.from('building_queue').select('*').eq('player_id', user.id).eq('status', 'in_progress'),
        supabase.from('research_projects').select('*').eq('player_id', user.id).eq('status', 'in_progress'),
      ]).then(([bq, rq]) => {
        if (bq.data) setBuildQueue(bq.data);
        if (rq.data) setResearchQueue(rq.data);
        setSectionLoading(prev => ({ ...prev, queues: false }));
      }).catch(() => setSectionLoading(prev => ({ ...prev, queues: false })));

      // Phase 3: Events
      Promise.all([
        supabase.from('combat_logs').select('*').or(`attacker_id.eq.${user.id},defender_id.eq.${user.id}`).order('created_at', { ascending: false }).limit(5),
        supabase.from('game_events').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(6),
      ]).then(([logs, gEvents]) => {
        if (logs.data) {
          setEventLog(logs.data);
          const wins = logs.data.filter((l: any) =>
            (l.result === 'attacker_victory' && l.attacker_id === user.id) ||
            (l.result === 'defender_victory' && l.defender_id === user.id)
          ).length;
          const losses = logs.data.filter((l: any) =>
            (l.result === 'defender_repelled' && l.defender_id === user.id) ||
            (l.result === 'attacker_victory' && l.defender_id === user.id)
          ).length;
          setPlayerStats(prev => ({ ...prev, battlesWon: wins, battlesLost: losses }));
        }
        if (gEvents.data && gEvents.data.length > 0) {
          // could update war alerts from live events
        }
        setSectionLoading(prev => ({ ...prev, events: false }));
      }).catch(() => setSectionLoading(prev => ({ ...prev, events: false })));

      setTimeout(() => {
        if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
      }, 3000);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setSectionLoading({ planets: false, fleets: false, queues: false, events: false, stats: false });
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
    return () => { if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current); };
  }, [fetchDashboardData]);

  useEffect(() => {
    const t = setInterval(() => setTickerIndex(i => (i + 1) % warAlerts.length), 5000);
    return () => clearInterval(t);
  }, [warAlerts]);

  useEffect(() => {
    if (profile?.was_guest && user?.id) {
      const alreadyShown = sessionStorage.getItem(`welcome_back_${user.id}`);
      if (!alreadyShown) {
        setShowWelcomeBack(true);
        sessionStorage.setItem(`welcome_back_${user.id}`, '1');
      }
    }
  }, [profile?.was_guest, user?.id]);

  useEffect(() => {
    const calc = async () => {
      if (!user) return;
      const { data: buildings } = await supabase.from('buildings').select('building_type, level').eq('player_id', user.id);
      if (buildings) {
        const m: any = {};
        buildings.forEach(b => { m[b.building_type] = b.level || 0; });
        setProductionRates({
          metal: Math.floor((m.metal_mine || 0) * 30 * Math.pow(1.1, m.metal_mine || 0)),
          crystal: Math.floor((m.crystal_mine || 0) * 20 * Math.pow(1.1, m.crystal_mine || 0)),
          deuterium: Math.floor((m.deuterium_synthesizer || 0) * 10 * Math.pow(1.1, m.deuterium_synthesizer || 0)),
          energy: Math.floor((m.solar_plant || 0) * 20 * Math.pow(1.05, m.solar_plant || 0)),
        });
      }
    };
    calc();
  }, [user]);

  const handleAutoCollect = async () => {
    if (!user) return;
    try {
      const { data: buildings } = await supabase.from('buildings').select('building_type, level').eq('player_id', user.id);
      if (!buildings || buildings.length === 0) { setToastMessage({ text: 'No buildings found!', type: 'error' }); return; }
      const bMap: any = {};
      buildings.forEach(b => { bMap[b.building_type] = b.level || 0; });
      const mL = bMap.metal_mine || 0, cL = bMap.crystal_mine || 0, dL = bMap.deuterium_synthesizer || 0;
      if (!mL && !cL && !dL) { setToastMessage({ text: 'No production buildings yet!', type: 'error' }); return; }
      const mP = Math.floor(mL * 30 * Math.pow(1.1, mL)) * 2;
      const cP = Math.floor(cL * 20 * Math.pow(1.1, cL)) * 2;
      const dP = Math.floor(dL * 10 * Math.pow(1.1, dL)) * 2;
      const { data: cur } = await supabase.from('player_resources').select('*').eq('player_id', user.id).maybeSingle();
      if (!cur) {
        await supabase.from('player_resources').insert({ player_id: user.id, metal: mP, crystal: cP, deuterium: dP, energy: 0, dark_matter: 0 });
      } else {
        await supabase.from('player_resources').update({
          metal: (cur.metal || 0) + mP, crystal: (cur.crystal || 0) + cP, deuterium: (cur.deuterium || 0) + dP,
        }).eq('player_id', user.id);
      }
      setToastMessage({ text: `Collected! +${mP.toLocaleString()} Metal  +${cP.toLocaleString()} Crystal  +${dP.toLocaleString()} Deuterium`, type: 'success' });
    } catch (e) { console.error(e); }
  };

  const currentPlanet = dbPlanets[selectedPlanet];
  const commanderName = profile?.username || user?.email?.split('@')[0] || 'Commander';

  return (
    <div className="min-w-0 text-[#8892aa]">
      {/* ── Toast ─── */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg flex items-center gap-3 shadow-lg border ${
          toastMessage.type === 'success'
            ? 'bg-green-500/15 border-green-500/30 text-green-400'
            : 'bg-red-500/15 border-red-500/30 text-red-400'
        }`}>
          <i className={`${toastMessage.type === 'success' ? 'ri-checkbox-circle-fill' : 'ri-error-warning-fill'} text-lg`} />
          <span className="text-sm font-semibold">{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-70 cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>
      )}

      {/* ── Welcome Back ─── */}
      {showWelcomeBack && (
        <div className="px-5 pt-4 pb-1">
          <WelcomeBackCelebration
            username={commanderName}
            onDismiss={() => setShowWelcomeBack(false)}
          />
        </div>
      )}

      {/* ── MAIN DASHBOARD ─── */}
      <div className="px-3 py-4 sm:px-5">
        <OverviewHeader
          commanderName={commanderName}
          currentPlanet={currentPlanet}
          planetCount={dbPlanets.length}
          warAlert={warAlerts[tickerIndex]}
          stats={playerStats}
          resources={gameResources}
          onCollect={handleAutoCollect}
          onNavigate={navigate}
        />

        {/* Time Events Banner */}
        <TimeEventsBanner timeEvents={timeEvents} />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,0.8fr)]">
          <div className="min-w-0">
            <PlanetHero
              planet={currentPlanet}
              loading={sectionLoading.planets}
              onPlanetSelect={setSelectedPlanet}
              planets={dbPlanets}
              selectedIndex={selectedPlanet}
            />
          </div>

          <div className="min-w-0">
            <ServerPulseBar />
            <OperationsPanel
              fleets={dbFleets}
              buildQueue={buildQueue}
              researchQueue={researchQueue}
              loading={sectionLoading.fleets || sectionLoading.queues}
              userId={user?.id}
            />
          </div>
        </div>

        {/* Resource HUD Gauges */}
        {sectionLoading.stats || resourcesLoading ? (
          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Sk className="h-28" />
            <Sk className="h-28" />
            <Sk className="h-28" />
            <Sk className="h-28" />
          </div>
        ) : (
          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <ResourceGauge
              label="METAL"
              icon="ri-copper-coin-line"
              color="#d4a853"
              value={gameResources.metal || 0}
              production={productionRates.metal}
              capacity={25000000}
            />
            <ResourceGauge
              label="CRYSTAL"
              icon="ri-sparkling-line"
              color="#5bc0be"
              value={gameResources.crystal || 0}
              production={productionRates.crystal}
              capacity={25000000}
            />
            <ResourceGauge
              label="DEUTERIUM"
              icon="ri-drop-line"
              color="#7bc67e"
              value={gameResources.deuterium || 0}
              production={productionRates.deuterium}
              capacity={15000000}
            />
            <ResourceGauge
              label="ENERGY"
              icon="ri-flashlight-line"
              color="#e2c044"
              value={gameResources.energy || 0}
              production={productionRates.energy}
              capacity={0}
            />
          </div>
        )}

        {/* Empire Power Grid */}
        {sectionLoading.stats ? (
          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Sk className="h-32" />
            <Sk className="h-32" />
            <Sk className="h-32" />
            <Sk className="h-32" />
          </div>
        ) : (
          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <PowerCard
              label="FLEET POWER"
              value={playerStats.totalFleetPower}
              subtext={`${formatNum(playerStats.totalShips)} ships across ${dbPlanets.length} worlds`}
              icon="ri-rocket-2-line"
              color="#5bc0be"
              onClick={() => navigate('/fleet')}
            />
            <PowerCard
              label="DEFENSE GRID"
              value={playerStats.totalDefensePower}
              subtext="Total defensive strength"
              icon="ri-shield-star-line"
              color="#f87171"
              onClick={() => navigate('/defense')}
            />
            <PowerCard
              label="RESEARCH"
              value={playerStats.totalResearchPoints}
              subtext="Technology advancement points"
              icon="ri-flask-line"
              color="#a78bfa"
              onClick={() => navigate('/research')}
            />
            <PowerCard
              label="EMPIRE SCORE"
              value={playerStats.totalBuildings * 1000 + playerStats.totalFleetPower + playerStats.totalResearchPoints}
              subtext={`${playerStats.totalBuildings} structures · ${playerStats.battlesWon}W/${playerStats.battlesLost}L`}
              icon="ri-trophy-line"
              color="#d4a853"
              onClick={() => navigate('/leaderboard')}
            />
          </div>
        )}

        {/* Main 2-column: Tactical Feed + Operations */}
        <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <TacticalFeed events={eventLog} loading={sectionLoading.events} userId={user?.id} />
          <div className="rounded-xl border border-[#1e2a36] bg-white/[0.015] p-3">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#34d399]/10 text-[#34d399]">
                <i className="ri-compass-3-line" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8892aa]">Next Moves</h3>
                <p className="text-xs text-[#4a5568]">Fast routes from overview</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Fleet', icon: 'ri-rocket-line', path: '/fleet', color: '#5bc0be' },
                { label: 'Build', icon: 'ri-building-line', path: '/buildings', color: '#d4a853' },
                { label: 'Research', icon: 'ri-flask-line', path: '/research', color: '#a78bfa' },
                { label: 'Market', icon: 'ri-store-2-line', path: '/marketplace', color: '#34d399' },
              ].map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => navigate(action.path)}
                  className="flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-bold text-white transition hover:brightness-125"
                  style={{ borderColor: `${action.color}22`, background: `${action.color}08` }}
                >
                  <i className={action.icon} style={{ color: action.color }} />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <CommandDock />
      </div>
    </div>
  );
}
