import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  universeLeaderboards,
  type UniverseLeaderboardEntry,
  type EmpireEntry,
  rankColors,
  rankGlows,
  formatConquestPoints,
} from '@/data/universeLeaderboard';
import { loadMyEmpire, saveMyEmpire, type MyEmpireConfig } from './types';
import MyEmpireSetupModal from './components/MyEmpireSetupModal';

// ─── Rank badge ───────────────────────────────────────────────────────────────
function RankBadge({ rank, size = 'sm' }: { rank: EmpireEntry['empireRank']; size?: 'sm' | 'md' }) {
  const color = rankColors[rank];
  const glow = rankGlows[rank];
  const icons: Record<string, string> = {
    Iron: 'ri-shield-line', Bronze: 'ri-shield-fill', Silver: 'ri-shield-star-line',
    Gold: 'ri-shield-star-fill', Platinum: 'ri-vip-crown-line', Diamond: 'ri-vip-crown-fill',
    Mythic: 'ri-sword-fill', Cosmic: 'ri-planet-fill',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold whitespace-nowrap ${size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-xs'}`}
      style={{ background: glow, border: `1px solid ${color}50`, color }}
    >
      <i className={`${icons[rank]} text-xs`}></i>{rank}
    </span>
  );
}

// ─── Position medal ───────────────────────────────────────────────────────────
function PositionMedal({ position }: { position: number }) {
  if (position === 1) return (
    <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0" style={{ background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.5)' }}>
      <i className="ri-trophy-fill text-sm" style={{ color: '#fbbf24' }}></i>
    </div>
  );
  if (position === 2) return (
    <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0" style={{ background: 'rgba(192,192,192,0.2)', border: '1px solid rgba(192,192,192,0.4)' }}>
      <i className="ri-medal-fill text-sm" style={{ color: '#c0c0c0' }}></i>
    </div>
  );
  if (position === 3) return (
    <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0" style={{ background: 'rgba(205,127,50,0.2)', border: '1px solid rgba(205,127,50,0.4)' }}>
      <i className="ri-medal-line text-sm" style={{ color: '#cd7f32' }}></i>
    </div>
  );
  return (
    <div className="w-8 h-8 flex items-center justify-center rounded flex-shrink-0" style={{ background: 'rgba(255,255,255,0.04)' }}>
      <span className="text-xs font-bold" style={{ color: '#4a5568' }}>#{position}</span>
    </div>
  );
}

// ─── Weekly change ────────────────────────────────────────────────────────────
function WeeklyChange({ change }: { change: number }) {
  if (change === 0) return <span className="text-xs" style={{ color: '#4a5568' }}>—</span>;
  if (change > 0) return <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: '#4ade80' }}><i className="ri-arrow-up-s-line"></i>{change}</span>;
  return <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: '#f87171' }}><i className="ri-arrow-down-s-line"></i>{Math.abs(change)}</span>;
}

// ─── Empire row ───────────────────────────────────────────────────────────────
function EmpireRow({
  empire, isSelected, isMyEmpire, onClick, rowRef,
}: {
  empire: EmpireEntry; isSelected: boolean; isMyEmpire: boolean;
  onClick: () => void; rowRef?: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div
      ref={rowRef}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all relative"
      style={{
        background: isMyEmpire ? 'rgba(0,212,255,0.07)' : isSelected ? `${empire.color}12` : empire.rank <= 3 ? 'rgba(255,255,255,0.025)' : 'transparent',
        borderLeft: isMyEmpire ? '3px solid #00d4ff' : isSelected ? `3px solid ${empire.color}` : '3px solid transparent',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        boxShadow: isMyEmpire ? 'inset 0 0 20px rgba(0,212,255,0.05)' : 'none',
      }}
    >
      {isMyEmpire && (
        <span className="absolute inset-0 pointer-events-none rounded-sm" style={{ border: '1px solid rgba(0,212,255,0.2)', animation: 'ued-pulse 2.5s ease-in-out infinite' }} />
      )}
      <PositionMedal position={empire.rank} />
      <div className="relative flex-shrink-0">
        <div className="w-8 h-8 rounded-full overflow-hidden" style={{ border: isMyEmpire ? '2px solid #00d4ff' : `1px solid ${empire.color}40`, boxShadow: isMyEmpire ? '0 0 8px rgba(0,212,255,0.5)' : 'none' }}>
          <img src={empire.avatar} alt={empire.commanderName} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
        {empire.isOnline && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border border-gray-900"></span>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold truncate" style={{ color: isMyEmpire ? '#00d4ff' : empire.color }}>{empire.empireName}</span>
          {isMyEmpire && <span className="text-xs px-1.5 py-0.5 rounded font-bold flex-shrink-0" style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff', fontSize: 9, border: '1px solid rgba(0,212,255,0.3)' }}>YOU</span>}
          {empire.specialTitle && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontSize: 10 }}>{empire.specialTitle}</span>}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs" style={{ color: '#4a5568' }}>{empire.commanderName}</span>
          {empire.allianceTag && <span className="text-xs px-1 rounded" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', fontSize: 10 }}>[{empire.allianceTag}]</span>}
        </div>
      </div>
      <div className="text-right flex-shrink-0 hidden sm:block">
        <div className="text-xs font-bold" style={{ color: isMyEmpire ? '#00d4ff' : '#e2e8f0' }}>{formatConquestPoints(empire.conquestPoints)}</div>
        <div className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>CP</div>
      </div>
      <div className="flex-shrink-0 hidden md:block"><RankBadge rank={empire.empireRank} /></div>
      <div className="flex-shrink-0 w-8 text-center hidden lg:block"><WeeklyChange change={empire.weeklyChange} /></div>
    </div>
  );
}

// ─── My Empire pinned banner ──────────────────────────────────────────────────
function MyEmpireBanner({ empire, universeName, onJump, onClear }: {
  empire: EmpireEntry; universeName: string; onJump: () => void; onClear: () => void;
}) {
  return (
    <div className="flex-shrink-0 mx-4 my-3 rounded-xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(0,212,255,0.04) 100%)', border: '1px solid rgba(0,212,255,0.3)', boxShadow: '0 0 20px rgba(0,212,255,0.08)' }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)', animation: 'ued-shimmer 3s ease-in-out infinite' }} />
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden" style={{ border: '2px solid #00d4ff', boxShadow: '0 0 12px rgba(0,212,255,0.6)' }}>
            <img src={empire.avatar} alt={empire.commanderName} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-gray-900"></span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black" style={{ color: '#00d4ff' }}>{empire.empireName}</span>
            <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(0,212,255,0.2)', color: '#00d4ff', fontSize: 9, border: '1px solid rgba(0,212,255,0.4)' }}>MY EMPIRE</span>
            <RankBadge rank={empire.empireRank} />
          </div>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="text-xs" style={{ color: '#4a5568' }}><i className="ri-earth-line mr-1"></i>{universeName}</span>
            <span className="text-xs font-bold" style={{ color: '#e2e8f0' }}>#{empire.rank} Universe</span>
            <span className="text-xs font-bold" style={{ color: '#f59e0b' }}>{formatConquestPoints(empire.conquestPoints)} CP</span>
            <span className="text-xs" style={{ color: '#6b7a95' }}>{empire.territorySystems} systems</span>
          </div>
        </div>
        <div className="flex-shrink-0 px-2.5 py-1.5 rounded-lg text-center hidden sm:block" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
          <div className="text-xs font-black" style={{ color: '#34d399' }}>+{formatConquestPoints(empire.weeklyGain)}</div>
          <div className="text-xs" style={{ color: '#4a5568', fontSize: 9 }}>this week</div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button onClick={onJump} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap" style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }}>
            <i className="ri-focus-3-line text-xs"></i>Jump to Me
          </button>
          <button onClick={onClear} className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer" style={{ background: 'rgba(255,255,255,0.04)', color: '#4a5568', border: '1px solid rgba(255,255,255,0.08)' }} title="Remove My Empire">
            <i className="ri-close-line text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empire detail panel ──────────────────────────────────────────────────────
function EmpireDetailPanel({ empire, universeColor, isMyEmpire }: { empire: EmpireEntry; universeColor: string; isMyEmpire: boolean }) {
  const panelColor = isMyEmpire ? '#00d4ff' : empire.color;
  const stats = [
    { label: 'Conquest Points', value: formatConquestPoints(empire.conquestPoints), icon: 'ri-sword-fill', color: '#f59e0b' },
    { label: 'Territory Systems', value: empire.territorySystems.toLocaleString(), icon: 'ri-global-line', color: '#00d4ff' },
    { label: 'Total Planets', value: empire.totalPlanets.toLocaleString(), icon: 'ri-planet-line', color: '#4ade80' },
    { label: 'Fleet Power', value: formatConquestPoints(empire.fleetPower), icon: 'ri-rocket-2-line', color: '#f87171' },
    { label: 'Weekly Gain', value: `+${formatConquestPoints(empire.weeklyGain)}`, icon: 'ri-line-chart-line', color: '#34d399' },
    { label: 'Realm', value: empire.realmName, icon: 'ri-ancient-gate-line', color: '#a78bfa' },
  ];
  return (
    <div className="h-full flex flex-col">
      <div className="p-5 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: isMyEmpire ? 'rgba(0,212,255,0.06)' : `${empire.color}08`, boxShadow: isMyEmpire ? 'inset 0 0 30px rgba(0,212,255,0.04)' : 'none' }}>
        {isMyEmpire && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)' }}>
            <i className="ri-user-star-fill text-sm" style={{ color: '#00d4ff' }}></i>
            <span className="text-xs font-black tracking-wider" style={{ color: '#00d4ff' }}>YOUR EMPIRE</span>
            <span className="w-2 h-2 rounded-full bg-green-400 ml-auto animate-pulse"></span>
          </div>
        )}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ border: `2px solid ${panelColor}60`, boxShadow: isMyEmpire ? '0 0 16px rgba(0,212,255,0.4)' : 'none' }}>
            <img src={empire.avatar} alt={empire.commanderName} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black" style={{ color: panelColor }}>{empire.empireName}</h3>
              <RankBadge rank={empire.empireRank} size="md" />
            </div>
            {empire.specialTitle && <div className="text-xs mt-0.5 font-semibold" style={{ color: '#f59e0b' }}>{empire.specialTitle}</div>}
            <div className="text-xs mt-1" style={{ color: '#6b7a95' }}>Commander: <span style={{ color: '#c8d4e8' }}>{empire.commanderName}</span></div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {empire.allianceName && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}>
                  <i className="ri-shield-star-line mr-1"></i>{empire.allianceName}
                </span>
              )}
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: empire.isOnline ? 'rgba(74,222,128,0.1)' : 'rgba(107,114,128,0.1)', color: empire.isOnline ? '#4ade80' : '#6b7280', border: `1px solid ${empire.isOnline ? 'rgba(74,222,128,0.3)' : 'rgba(107,114,128,0.2)'}` }}>
                <i className={`${empire.isOnline ? 'ri-wifi-line' : 'ri-wifi-off-line'} mr-1`}></i>{empire.lastSeen}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: isMyEmpire ? 'rgba(0,212,255,0.06)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isMyEmpire ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
          <div className="text-center">
            <div className="text-2xl font-black" style={{ color: panelColor }}>#{empire.rank}</div>
            <div className="text-xs" style={{ color: '#4a5568' }}>Universe Rank</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: '#e2e8f0' }}>{formatConquestPoints(empire.conquestPoints)}</div>
            <div className="text-xs" style={{ color: '#4a5568' }}>Conquest Points</div>
          </div>
          <div className="text-center">
            <WeeklyChange change={empire.weeklyChange} />
            <div className="text-xs mt-0.5" style={{ color: '#4a5568' }}>This Week</div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'none' }}>
        <div className="text-xs font-bold tracking-widest mb-3" style={{ color: '#4a5568' }}>EMPIRE STATISTICS</div>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {stats.map((s) => (
            <div key={s.label} className="p-3 rounded-lg" style={{ background: `${s.color}08`, border: `1px solid ${s.color}20` }}>
              <div className="flex items-center gap-1.5 mb-1">
                <i className={`${s.icon} text-xs`} style={{ color: s.color }}></i>
                <span className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>{s.label}</span>
              </div>
              <div className="text-sm font-bold" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div className="mb-5">
          <div className="text-xs font-bold tracking-widest mb-2" style={{ color: '#4a5568' }}>TERRITORY CONTROL</div>
          {[
            { label: 'Systems Controlled', val: empire.territorySystems, max: 500, color: '#00d4ff' },
            { label: 'Planets Colonized', val: empire.totalPlanets, max: 1500, color: '#4ade80' },
          ].map((bar) => (
            <div key={bar.label} className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: '#6b7a95' }}>{bar.label}</span>
                <span className="text-xs font-bold" style={{ color: bar.color }}>{bar.val}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${Math.min(100, (bar.val / bar.max) * 100)}%`, background: `linear-gradient(90deg, ${bar.color}, ${universeColor})` }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-5">
          <div className="text-xs font-bold tracking-widest mb-2" style={{ color: '#4a5568' }}>FLEET POWER</div>
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
            <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: 'rgba(248,113,113,0.15)' }}>
              <i className="ri-rocket-2-line text-sm" style={{ color: '#f87171' }}></i>
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: '#f87171' }}>{formatConquestPoints(empire.fleetPower)}</div>
              <div className="text-xs" style={{ color: '#4a5568' }}>Combined Fleet Power Rating</div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-xs font-bold tracking-widest mb-2" style={{ color: '#4a5568' }}>WEEKLY PERFORMANCE</div>
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}>
            <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: 'rgba(52,211,153,0.15)' }}>
              <i className="ri-line-chart-line text-sm" style={{ color: '#34d399' }}></i>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: '#6b7a95' }}>Points Gained</span>
                <span className="text-sm font-bold" style={{ color: '#34d399' }}>+{formatConquestPoints(empire.weeklyGain)}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs" style={{ color: '#6b7a95' }}>Rank Change</span>
                <WeeklyChange change={empire.weeklyChange} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Universe tab ─────────────────────────────────────────────────────────────
function UniverseTab({ entry, isActive, hasMyEmpire, onClick }: { entry: UniverseLeaderboardEntry; isActive: boolean; hasMyEmpire: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all whitespace-nowrap flex-shrink-0 relative"
      style={{ background: isActive ? `${entry.universeColor}18` : 'rgba(255,255,255,0.03)', border: `1px solid ${isActive ? entry.universeColor + '50' : 'rgba(255,255,255,0.06)'}`, color: isActive ? entry.universeColor : '#6b7a95' }}
    >
      <span className="text-xs font-bold">{entry.universeName}</span>
      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${entry.universeColor}20`, color: entry.universeColor, fontSize: 10 }}>{entry.universeClass}</span>
      {hasMyEmpire && (
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center" style={{ background: '#00d4ff', boxShadow: '0 0 6px rgba(0,212,255,0.8)' }} title="Your empire is here">
          <i className="ri-user-fill" style={{ fontSize: 7, color: '#000' }}></i>
        </span>
      )}
    </button>
  );
}

// ─── Alliance row ─────────────────────────────────────────────────────────────
function AllianceRow({ rank, entry }: { rank: number; entry: UniverseLeaderboardEntry }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="w-6 text-center flex-shrink-0">
        <span className="text-xs font-bold" style={{ color: rank === 1 ? '#fbbf24' : '#4a5568' }}>#{rank}</span>
      </div>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${entry.universeColor}20`, border: `1px solid ${entry.universeColor}30` }}>
        <i className="ri-shield-star-fill text-sm" style={{ color: entry.universeColor }}></i>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold" style={{ color: '#e2e8f0' }}>[{entry.topAllianceTag}] {entry.topAlliance}</div>
        <div className="text-xs" style={{ color: '#4a5568' }}>{entry.topAllianceMembers} members</div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-xs font-bold" style={{ color: entry.universeColor }}>{formatConquestPoints(entry.topAlliancePoints)}</div>
        <div className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>Alliance CP</div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function UniverseLeaderboardPage() {
  const [activeUniverseId, setActiveUniverseId] = useState('u1');
  const [selectedEmpireId, setSelectedEmpireId] = useState<string | null>('u1-emp-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [rankFilter, setRankFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'conquestPoints' | 'territorySystems' | 'fleetPower' | 'weeklyGain'>('conquestPoints');
  const [activeTab, setActiveTab] = useState<'empires' | 'alliances' | 'overview'>('empires');
  const [myEmpire, setMyEmpire] = useState<MyEmpireConfig | null>(loadMyEmpire);
  const [showSetupModal, setShowSetupModal] = useState(false);

  const myEmpireRowRef = useRef<HTMLDivElement>(null);

  const activeUniverse = useMemo(
    () => universeLeaderboards.find((u) => u.universeId === activeUniverseId) ?? universeLeaderboards[0],
    [activeUniverseId]
  );

  const myEmpireData = useMemo(() => {
    if (!myEmpire) return null;
    const universe = universeLeaderboards.find((u) => u.universeId === myEmpire.universeId);
    const empire = universe?.empires.find((e) => e.empireId === myEmpire.empireId);
    return universe && empire ? { empire, universe } : null;
  }, [myEmpire]);

  const isMyEmpireInActiveUniverse = myEmpire?.universeId === activeUniverseId;

  const filteredEmpires = useMemo(() => {
    let list = [...activeUniverse.empires];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((e) => e.empireName.toLowerCase().includes(q) || e.commanderName.toLowerCase().includes(q) || (e.allianceName?.toLowerCase().includes(q) ?? false));
    }
    if (rankFilter !== 'All') list = list.filter((e) => e.empireRank === rankFilter);
    list.sort((a, b) => b[sortBy] - a[sortBy]);
    return list;
  }, [activeUniverse, searchQuery, rankFilter, sortBy]);

  const selectedEmpire = useMemo(
    () => activeUniverse.empires.find((e) => e.empireId === selectedEmpireId) ?? null,
    [activeUniverse, selectedEmpireId]
  );

  const totalCP = useMemo(() => universeLeaderboards.reduce((s, u) => s + u.totalConquestPoints, 0), []);
  const totalEmpires = useMemo(() => universeLeaderboards.reduce((s, u) => s + u.totalEmpires, 0), []);

  const handleSaveMyEmpire = useCallback((cfg: MyEmpireConfig) => {
    setMyEmpire(cfg);
    saveMyEmpire(cfg);
    setShowSetupModal(false);
    setActiveUniverseId(cfg.universeId);
    setSelectedEmpireId(cfg.empireId);
    setActiveTab('empires');
  }, []);

  const handleClearMyEmpire = useCallback(() => { setMyEmpire(null); saveMyEmpire(null); }, []);

  const handleJumpToMyEmpire = useCallback(() => {
    if (!myEmpire) return;
    setActiveUniverseId(myEmpire.universeId);
    setActiveTab('empires');
    setSearchQuery('');
    setRankFilter('All');
    setSortBy('conquestPoints');
    setSelectedEmpireId(myEmpire.empireId);
    setTimeout(() => { myEmpireRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 150);
  }, [myEmpire]);

  useEffect(() => {
    if (isMyEmpireInActiveUniverse) {
      setTimeout(() => { myEmpireRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 200);
    }
  }, [activeUniverseId, isMyEmpireInActiveUniverse]);

  const rankOptions = ['All', 'Cosmic', 'Mythic', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze', 'Iron'];

  return (
    <>
      <style>{`
        @keyframes ued-shimmer { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes ued-pulse { 0%,100%{opacity:0.25} 50%{opacity:0.7} }
      `}</style>

      {showSetupModal && <MyEmpireSetupModal onClose={() => setShowSetupModal(false)} onSave={handleSaveMyEmpire} />}

      <div className="flex flex-col h-full" style={{ minHeight: 'calc(100vh - 96px)' }}>
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4" style={{ borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-black tracking-wider" style={{ color: '#e2e8f0' }}>UNIVERSE LEADERBOARD</h1>
              <p className="text-xs mt-0.5" style={{ color: '#4a5568' }}>Top empires ranked by conquest points, territory control &amp; fleet power across all universes</p>
            </div>
            <div className="flex items-center gap-2">
              {myEmpireData ? (
                <button
                  onClick={handleJumpToMyEmpire}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap"
                  style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.35)', color: '#00d4ff', boxShadow: '0 0 12px rgba(0,212,255,0.15)' }}
                >
                  <i className="ri-user-star-fill text-xs"></i>
                  My Empire — #{myEmpireData.empire.rank}
                  <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(0,212,255,0.2)', fontSize: 9 }}>{myEmpireData.universe.universeName}</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowSetupModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#6b7a95' }}
                >
                  <i className="ri-user-star-line text-xs"></i>Set My Empire
                </button>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
                <i className="ri-refresh-line"></i>Live Rankings
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Universes', value: universeLeaderboards.length, icon: 'ri-earth-line', color: '#00d4ff' },
              { label: 'Total Empires', value: totalEmpires.toLocaleString(), icon: 'ri-building-4-line', color: '#a78bfa' },
              { label: 'Total Conquest Points', value: formatConquestPoints(totalCP), icon: 'ri-sword-fill', color: '#f59e0b' },
              { label: 'Active Alliances', value: '847', icon: 'ri-shield-star-line', color: '#4ade80' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: `${stat.color}08`, border: `1px solid ${stat.color}20` }}>
                <div className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${stat.color}15` }}>
                  <i className={`${stat.icon} text-base`} style={{ color: stat.color }}></i>
                </div>
                <div>
                  <div className="text-sm font-black" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Universe selector */}
        <div className="flex-shrink-0 px-6 py-3 flex items-center gap-2 overflow-x-auto" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', scrollbarWidth: 'none' }}>
          <span className="text-xs font-bold tracking-widest flex-shrink-0" style={{ color: '#4a5568' }}>UNIVERSE:</span>
          {universeLeaderboards.map((entry) => (
            <UniverseTab
              key={entry.universeId}
              entry={entry}
              isActive={activeUniverseId === entry.universeId}
              hasMyEmpire={myEmpire?.universeId === entry.universeId}
              onClick={() => { setActiveUniverseId(entry.universeId); setSelectedEmpireId(`${entry.universeId}-emp-1`); setSearchQuery(''); setRankFilter('All'); }}
            />
          ))}
        </div>

        {/* Universe banner */}
        <div className="flex-shrink-0 px-6 py-3 flex items-center gap-6 flex-wrap" style={{ background: `${activeUniverse.universeColor}06`, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: activeUniverse.universeColor }}></div>
            <span className="text-sm font-black" style={{ color: activeUniverse.universeColor }}>{activeUniverse.universeName}</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${activeUniverse.universeColor}20`, color: activeUniverse.universeColor, border: `1px solid ${activeUniverse.universeColor}30` }}>{activeUniverse.universeClass}</span>
          </div>
          {[
            { label: 'Empires', value: activeUniverse.totalEmpires.toLocaleString(), icon: 'ri-building-4-line' },
            { label: 'Total CP', value: formatConquestPoints(activeUniverse.totalConquestPoints), icon: 'ri-sword-fill' },
            { label: 'Top Alliance', value: `[${activeUniverse.topAllianceTag}] ${activeUniverse.topAlliance}`, icon: 'ri-shield-star-line' },
            { label: 'Dominant Faction', value: activeUniverse.dominantFaction, icon: 'ri-flag-line' },
            { label: 'Territory', value: `${activeUniverse.controlledSystems}/${activeUniverse.totalSystems} systems`, icon: 'ri-global-line' },
            { label: 'Updated', value: activeUniverse.lastUpdated, icon: 'ri-time-line' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <i className={`${item.icon} text-xs`} style={{ color: '#4a5568' }}></i>
              <span className="text-xs" style={{ color: '#4a5568' }}>{item.label}:</span>
              <span className="text-xs font-semibold" style={{ color: '#8892aa' }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden" style={{ minHeight: 0 }}>
          {/* Left panel */}
          <div className="flex flex-col" style={{ width: 420, minWidth: 320, borderRight: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
            {/* Tabs */}
            <div className="flex items-center gap-1 px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {(['empires', 'alliances', 'overview'] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all capitalize whitespace-nowrap"
                  style={{ background: activeTab === tab ? `${activeUniverse.universeColor}20` : 'transparent', color: activeTab === tab ? activeUniverse.universeColor : '#4a5568', border: `1px solid ${activeTab === tab ? activeUniverse.universeColor + '40' : 'transparent'}` }}>
                  {tab === 'empires' && <i className="ri-building-4-line mr-1"></i>}
                  {tab === 'alliances' && <i className="ri-shield-star-line mr-1"></i>}
                  {tab === 'overview' && <i className="ri-bar-chart-line mr-1"></i>}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'empires' && (
              <>
                {/* My Empire banner */}
                {myEmpireData && isMyEmpireInActiveUniverse && (
                  <MyEmpireBanner empire={myEmpireData.empire} universeName={activeUniverse.universeName} onJump={handleJumpToMyEmpire} onClear={handleClearMyEmpire} />
                )}
                {/* Cross-universe notice */}
                {myEmpireData && !isMyEmpireInActiveUniverse && (
                  <div className="mx-4 my-2 px-3 py-2 rounded-lg flex items-center gap-2 flex-shrink-0 cursor-pointer" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }} onClick={handleJumpToMyEmpire}>
                    <i className="ri-user-star-line text-xs flex-shrink-0" style={{ color: '#00d4ff' }}></i>
                    <span className="text-xs flex-1" style={{ color: '#6b7a95' }}>Your empire is in <span style={{ color: '#00d4ff' }}>{myEmpireData.universe.universeName}</span></span>
                    <span className="text-xs font-bold whitespace-nowrap" style={{ color: '#00d4ff' }}>Jump <i className="ri-arrow-right-line"></i></span>
                  </div>
                )}
                {/* Set empire prompt */}
                {!myEmpireData && (
                  <button onClick={() => setShowSetupModal(true)} className="mx-4 my-2 px-3 py-2 rounded-lg flex items-center gap-2 flex-shrink-0 cursor-pointer transition-all text-left" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <i className="ri-user-star-line text-xs" style={{ color: '#4a5568' }}></i>
                    <span className="text-xs" style={{ color: '#4a5568' }}>Pin your empire for quick access</span>
                    <span className="text-xs font-bold ml-auto whitespace-nowrap" style={{ color: '#00d4ff' }}>Set Empire</span>
                  </button>
                )}
                {/* Filters */}
                <div className="px-4 py-3 flex-shrink-0 space-y-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="relative">
                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#4a5568' }}></i>
                    <input type="text" placeholder="Search empire or commander..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-8 pr-3 py-2 rounded-lg text-xs outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#c8d4e8' }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={rankFilter} onChange={(e) => setRankFilter(e.target.value)} className="flex-1 px-2 py-1.5 rounded-lg text-xs outline-none cursor-pointer" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#c8d4e8' }}>
                      {rankOptions.map((r) => <option key={r} value={r} style={{ background: '#0d1526' }}>{r === 'All' ? 'All Ranks' : r}</option>)}
                    </select>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="flex-1 px-2 py-1.5 rounded-lg text-xs outline-none cursor-pointer" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#c8d4e8' }}>
                      <option value="conquestPoints" style={{ background: '#0d1526' }}>Sort: Conquest Points</option>
                      <option value="territorySystems" style={{ background: '#0d1526' }}>Sort: Territory</option>
                      <option value="fleetPower" style={{ background: '#0d1526' }}>Sort: Fleet Power</option>
                      <option value="weeklyGain" style={{ background: '#0d1526' }}>Sort: Weekly Gain</option>
                    </select>
                  </div>
                </div>
                {/* Column headers */}
                <div className="flex items-center gap-3 px-4 py-2 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                  <div className="w-8 flex-shrink-0"></div>
                  <div className="w-8 flex-shrink-0"></div>
                  <div className="flex-1 text-xs font-bold tracking-wider" style={{ color: '#4a5568' }}>EMPIRE</div>
                  <div className="text-xs font-bold tracking-wider hidden sm:block" style={{ color: '#4a5568' }}>CP</div>
                  <div className="text-xs font-bold tracking-wider hidden md:block" style={{ color: '#4a5568' }}>RANK</div>
                  <div className="w-8 text-xs font-bold tracking-wider hidden lg:block text-center" style={{ color: '#4a5568' }}>±</div>
                </div>
                {/* List */}
                <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                  {filteredEmpires.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 gap-2">
                      <i className="ri-search-line text-2xl" style={{ color: '#4a5568' }}></i>
                      <span className="text-xs" style={{ color: '#4a5568' }}>No empires found</span>
                    </div>
                  ) : filteredEmpires.map((empire) => {
                    const isMe = isMyEmpireInActiveUniverse && myEmpire?.empireId === empire.empireId;
                    return (
                      <EmpireRow
                        key={empire.empireId}
                        empire={empire}
                        isSelected={selectedEmpireId === empire.empireId}
                        isMyEmpire={isMe}
                        onClick={() => setSelectedEmpireId(empire.empireId)}
                        rowRef={isMe ? myEmpireRowRef : undefined}
                      />
                    );
                  })}
                </div>
              </>
            )}

            {activeTab === 'alliances' && (
              <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="text-xs font-bold tracking-widest" style={{ color: '#4a5568' }}>TOP ALLIANCES — {activeUniverse.universeName.toUpperCase()}</div>
                </div>
                {universeLeaderboards.map((entry, idx) => <AllianceRow key={entry.universeId} rank={idx + 1} entry={entry} />)}
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'none' }}>
                <div className="text-xs font-bold tracking-widest mb-3" style={{ color: '#4a5568' }}>UNIVERSE RANKINGS BY TOTAL CP</div>
                {[...universeLeaderboards].sort((a, b) => b.totalConquestPoints - a.totalConquestPoints).map((entry, idx) => {
                  const pct = (entry.totalConquestPoints / universeLeaderboards[0].totalConquestPoints) * 100;
                  const isMyUniverse = myEmpire?.universeId === entry.universeId;
                  return (
                    <div key={entry.universeId} className="mb-3 cursor-pointer rounded-lg px-2 py-1 transition-all"
                      style={{ background: isMyUniverse ? 'rgba(0,212,255,0.04)' : 'transparent', border: isMyUniverse ? '1px solid rgba(0,212,255,0.15)' : '1px solid transparent' }}
                      onClick={() => { setActiveUniverseId(entry.universeId); setActiveTab('empires'); setSelectedEmpireId(`${entry.universeId}-emp-1`); }}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold" style={{ color: '#4a5568' }}>#{idx + 1}</span>
                          <span className="text-xs font-bold" style={{ color: entry.universeColor }}>{entry.universeName}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${entry.universeColor}15`, color: entry.universeColor, fontSize: 10 }}>{entry.universeClass}</span>
                          {isMyUniverse && <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff', fontSize: 9 }}>YOU</span>}
                        </div>
                        <span className="text-xs font-bold" style={{ color: '#e2e8f0' }}>{formatConquestPoints(entry.totalConquestPoints)}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: entry.universeColor }}></div>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>{entry.totalEmpires.toLocaleString()} empires</span>
                        <span className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>{entry.controlledSystems}/{entry.totalSystems} systems</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Center panel */}
          <div className="flex-1 flex flex-col overflow-hidden" style={{ minWidth: 0 }}>
            {/* Podium */}
            <div className="flex-shrink-0 px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#4a5568' }}>TOP COMMANDERS — {activeUniverse.universeName.toUpperCase()}</div>
              <div className="flex items-end justify-center gap-4">
                {activeUniverse.empires[1] && (
                  <div className="flex flex-col items-center gap-2 flex-1 max-w-[160px]">
                    <div className="w-14 h-14 rounded-full overflow-hidden" style={{ border: '2px solid rgba(192,192,192,0.5)' }}>
                      <img src={activeUniverse.empires[1].avatar} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold truncate max-w-[120px]" style={{ color: '#c0c0c0' }}>{activeUniverse.empires[1].empireName}</div>
                      <div className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>{activeUniverse.empires[1].commanderName}</div>
                      <div className="text-xs font-bold mt-0.5" style={{ color: '#e2e8f0' }}>{formatConquestPoints(activeUniverse.empires[1].conquestPoints)}</div>
                    </div>
                    <div className="w-full flex items-center justify-center rounded-t-lg" style={{ background: 'rgba(192,192,192,0.1)', border: '1px solid rgba(192,192,192,0.2)', height: 60 }}>
                      <span className="text-2xl font-black" style={{ color: '#c0c0c0' }}>2</span>
                    </div>
                  </div>
                )}
                {activeUniverse.empires[0] && (
                  <div className="flex flex-col items-center gap-2 flex-1 max-w-[180px]">
                    <div className="relative">
                      <i className="ri-vip-crown-fill text-xl absolute -top-3 left-1/2 -translate-x-1/2" style={{ color: '#fbbf24' }}></i>
                      <div className="w-16 h-16 rounded-full overflow-hidden" style={{ border: '2px solid rgba(251,191,36,0.7)' }}>
                        <img src={activeUniverse.empires[0].avatar} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold truncate max-w-[140px]" style={{ color: '#fbbf24' }}>{activeUniverse.empires[0].empireName}</div>
                      <div className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>{activeUniverse.empires[0].commanderName}</div>
                      <div className="text-sm font-black mt-0.5" style={{ color: '#e2e8f0' }}>{formatConquestPoints(activeUniverse.empires[0].conquestPoints)}</div>
                      {activeUniverse.empires[0].specialTitle && <div className="text-xs mt-0.5" style={{ color: '#f59e0b', fontSize: 10 }}>{activeUniverse.empires[0].specialTitle}</div>}
                    </div>
                    <div className="w-full flex items-center justify-center rounded-t-lg" style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)', height: 80 }}>
                      <span className="text-3xl font-black" style={{ color: '#fbbf24' }}>1</span>
                    </div>
                  </div>
                )}
                {activeUniverse.empires[2] && (
                  <div className="flex flex-col items-center gap-2 flex-1 max-w-[160px]">
                    <div className="w-14 h-14 rounded-full overflow-hidden" style={{ border: '2px solid rgba(205,127,50,0.5)' }}>
                      <img src={activeUniverse.empires[2].avatar} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold truncate max-w-[120px]" style={{ color: '#cd7f32' }}>{activeUniverse.empires[2].empireName}</div>
                      <div className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>{activeUniverse.empires[2].commanderName}</div>
                      <div className="text-xs font-bold mt-0.5" style={{ color: '#e2e8f0' }}>{formatConquestPoints(activeUniverse.empires[2].conquestPoints)}</div>
                    </div>
                    <div className="w-full flex items-center justify-center rounded-t-lg" style={{ background: 'rgba(205,127,50,0.1)', border: '1px solid rgba(205,127,50,0.2)', height: 48 }}>
                      <span className="text-2xl font-black" style={{ color: '#cd7f32' }}>3</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Analytics */}
            <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: 'none' }}>
              {/* Territory */}
              <div className="mb-6">
                <div className="text-xs font-bold tracking-widest mb-3" style={{ color: '#4a5568' }}>TERRITORY CONTROL — {activeUniverse.universeName.toUpperCase()}</div>
                <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: '#6b7a95' }}>Controlled Systems</span>
                    <span className="text-xs font-bold" style={{ color: '#e2e8f0' }}>{activeUniverse.controlledSystems.toLocaleString()} / {activeUniverse.totalSystems.toLocaleString()}</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(activeUniverse.controlledSystems / activeUniverse.totalSystems) * 100}%`, background: `linear-gradient(90deg, ${activeUniverse.universeColor}, ${activeUniverse.universeColor}80)` }}></div>
                  </div>
                  <div className="space-y-2">
                    {activeUniverse.empires.slice(0, 5).map((empire, idx) => {
                      const pct = Math.max(5, 40 - idx * 7);
                      const isMe = isMyEmpireInActiveUniverse && myEmpire?.empireId === empire.empireId;
                      return (
                        <div key={empire.empireId} className="flex items-center gap-3">
                          <span className="text-xs w-4 text-right flex-shrink-0" style={{ color: '#4a5568' }}>#{idx + 1}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold truncate" style={{ color: isMe ? '#00d4ff' : empire.color }}>{empire.empireName}</span>
                                {isMe && <span className="text-xs px-1 rounded font-bold" style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff', fontSize: 9 }}>YOU</span>}
                              </div>
                              <span className="text-xs flex-shrink-0 ml-2" style={{ color: '#6b7a95' }}>{empire.territorySystems} sys</span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: isMe ? '#00d4ff' : empire.color }}></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Rank distribution */}
              <div className="mb-6">
                <div className="text-xs font-bold tracking-widest mb-3" style={{ color: '#4a5568' }}>RANK DISTRIBUTION</div>
                <div className="grid grid-cols-4 gap-2">
                  {(['Cosmic', 'Mythic', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze', 'Iron'] as const).map((rank) => {
                    const count = activeUniverse.empires.filter((e) => e.empireRank === rank).length;
                    const color = rankColors[rank];
                    return (
                      <div key={rank} className="flex flex-col items-center gap-1 p-2 rounded-lg" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
                        <span className="text-sm font-black" style={{ color }}>{count}</span>
                        <span className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>{rank}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weekly movers */}
              <div>
                <div className="text-xs font-bold tracking-widest mb-3" style={{ color: '#4a5568' }}>BIGGEST WEEKLY MOVERS</div>
                <div className="space-y-2">
                  {[...activeUniverse.empires].sort((a, b) => b.weeklyGain - a.weeklyGain).slice(0, 5).map((empire) => {
                    const isMe = isMyEmpireInActiveUniverse && myEmpire?.empireId === empire.empireId;
                    return (
                      <div key={empire.empireId} className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all"
                        style={{ background: isMe ? 'rgba(0,212,255,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isMe ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.05)'}` }}
                        onClick={() => { setSelectedEmpireId(empire.empireId); setActiveTab('empires'); }}>
                        <div className="w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0" style={{ background: `${isMe ? '#00d4ff' : empire.color}20` }}>
                          <i className="ri-arrow-up-line text-xs" style={{ color: isMe ? '#00d4ff' : empire.color }}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <div className="text-xs font-bold truncate" style={{ color: isMe ? '#00d4ff' : empire.color }}>{empire.empireName}</div>
                            {isMe && <span className="text-xs px-1 rounded font-bold flex-shrink-0" style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff', fontSize: 9 }}>YOU</span>}
                          </div>
                          <div className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>{empire.commanderName}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs font-bold" style={{ color: '#34d399' }}>+{formatConquestPoints(empire.weeklyGain)}</div>
                          <div className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>this week</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right: detail panel */}
          <div className="flex-shrink-0 overflow-hidden" style={{ width: 300, borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
            {selectedEmpire ? (
              <EmpireDetailPanel
                empire={selectedEmpire}
                universeColor={activeUniverse.universeColor}
                isMyEmpire={isMyEmpireInActiveUniverse && myEmpire?.empireId === selectedEmpire.empireId}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <i className="ri-building-4-line text-3xl" style={{ color: '#4a5568' }}></i>
                <span className="text-xs" style={{ color: '#4a5568' }}>Select an empire to view details</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
