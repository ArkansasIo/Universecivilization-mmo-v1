import { useState, useMemo } from 'react';
import {
  EMPIRES_AT_WAR,
  ACTIVE_WAR_DECLARATIONS,
  getEmpireById,
  formatMilitaryPower,
  formatPopulation,
  formatCasualties,
  type EmpireAtWar,
  type WarDeclaration,
} from '@/data/empiresAtWar';

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function ThreatBadge({ level }: { level: EmpireAtWar['threatLevel'] }) {
  const config: Record<string, { color: string; bg: string; label: string }> = {
    apocalyptic: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', label: 'APOCALYPTIC' },
    extreme: { color: '#f87171', bg: 'rgba(248,113,113,0.10)', label: 'EXTREME' },
    high: { color: '#fb923c', bg: 'rgba(251,146,60,0.10)', label: 'HIGH' },
    moderate: { color: '#fbbf24', bg: 'rgba(251,191,36,0.10)', label: 'MODERATE' },
    low: { color: '#4ade80', bg: 'rgba(74,222,128,0.10)', label: 'LOW' },
  };
  const c = config[level];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap" style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}30` }}>
      {level === 'apocalyptic' && <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: c.color }} />}
      {c.label}
    </span>
  );
}

function RankBadge({ rank }: { rank: EmpireAtWar['rank'] }) {
  const colors: Record<string, string> = {
    SSS: '#fbbf24', SS: '#ef4444', S: '#fb923c', A: '#a78bfa', B: '#4ade80', C: '#6b7a95',
  };
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-black whitespace-nowrap" style={{ background: `${colors[rank]}15`, color: colors[rank], border: `1px solid ${colors[rank]}30` }}>
      {rank}
    </span>
  );
}

function WarScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? '#ef4444' : score >= 50 ? '#fb923c' : score >= 30 ? '#fbbf24' : '#4ade80';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }} />
      </div>
      <span className="text-xs font-bold flex-shrink-0" style={{ color }}>{score}</span>
    </div>
  );
}

function ProgressBar({ value, color, label }: { value: number; color: string; label?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}60, ${color})` }} />
      </div>
      {label && <span className="text-xs font-semibold flex-shrink-0" style={{ color }}>{label}</span>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   EMPIRE CARD
───────────────────────────────────────────────────────────── */
function EmpireCard({ empire, isSelected, isPlayer, onClick }: { empire: EmpireAtWar; isSelected: boolean; isPlayer: boolean; onClick: () => void }) {
  const stanceColors: Record<string, string> = {
    total_war: '#ef4444', limited_war: '#f87171', cold_war: '#fb923c',
  };
  const warStanceColor = empire.activeWars >= 3 ? '#ef4444' : empire.activeWars >= 2 ? '#f87171' : '#fb923c';

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl p-4 transition-all cursor-pointer relative overflow-hidden group"
      style={{
        background: isSelected ? `${empire.color}10` : isPlayer ? `${empire.color}08` : 'rgba(255,255,255,0.02)',
        border: isSelected ? `1px solid ${empire.color}50` : isPlayer ? `1px solid ${empire.color}25` : '1px solid rgba(255,255,255,0.06)',
        boxShadow: isSelected ? `0 0 20px ${empire.color}10` : 'none',
      }}
    >
      {/* Top glow bar */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${empire.color}40, transparent)`, opacity: isSelected ? 1 : 0, transition: 'opacity 0.3s' }} />

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-xl overflow-hidden" style={{ border: `2px solid ${empire.color}40` }}>
            <img src={empire.avatar} alt={empire.commanderName} className="w-full h-full object-cover object-top" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
          {empire.activeWars >= 1 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: warStanceColor, border: '1px solid rgba(0,0,0,0.3)' }}>
              <i className="ri-sword-fill text-xs text-white"></i>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-black truncate" style={{ color: empire.color }}>{empire.name}</span>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: `${empire.color}15`, color: empire.color, fontSize: 10 }}>[{empire.tag}]</span>
            <RankBadge rank={empire.rank} />
          </div>
          <div className="text-xs mt-0.5" style={{ color: '#4a5568' }}>
            {empire.commanderTitle.split(' ').slice(0, 3).join(' ')}...
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <ThreatBadge level={empire.threatLevel} />
            {empire.activeWars > 0 && (
              <span className="text-xs font-bold" style={{ color: warStanceColor }}>
                <i className="ri-sword-line mr-0.5"></i>{empire.activeWars} active war{empire.activeWars > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-lg p-2" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>Fleet Power</div>
          <div className="text-sm font-bold" style={{ color: '#e2e8f0' }}>{formatMilitaryPower(empire.militaryPower)}</div>
        </div>
        <div className="rounded-lg p-2" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>Territory</div>
          <div className="text-sm font-bold" style={{ color: '#e2e8f0' }}>{empire.territorySystems.toLocaleString()} systems</div>
        </div>
      </div>

      {/* War score */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>WAR SCORE</span>
          <span className="text-xs font-bold" style={{ color: empire.warScore >= 50 ? '#f87171' : '#4ade80' }}>{empire.warScore}/100</span>
        </div>
        <WarScoreBar score={empire.warScore} />
      </div>

      {/* Enemies */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-xs" style={{ color: '#4a5568', fontSize: 9 }}>AT WAR:</span>
        {empire.enemies.slice(0, 3).map((enemy) => (
          <span key={enemy} className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: 9, border: '1px solid rgba(239,68,68,0.15)' }}>
            {enemy}
          </span>
        ))}
        {empire.enemies.length > 3 && (
          <span className="text-xs" style={{ color: '#4a5568', fontSize: 9 }}>+{empire.enemies.length - 3} more</span>
        )}
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────────
   WAR DECLARATION CARD
───────────────────────────────────────────────────────────── */
function WarCard({ war, onClick }: { war: WarDeclaration; onClick: () => void }) {
  const attacker = getEmpireById(war.attackerId);
  const defender = getEmpireById(war.defenderId);
  if (!attacker || !defender) return null;

  const intensityColors: Record<string, string> = {
    apocalyptic: '#ef4444', extreme: '#f87171', high: '#fb923c', moderate: '#fbbf24',
  };

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl p-4 transition-all cursor-pointer hover:bg-white/[0.02]"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <i className="ri-sword-fill text-lg" style={{ color: '#ef4444' }}></i>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold truncate" style={{ color: '#e2e8f0' }}>{war.warName}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-semibold" style={{ color: attacker.color }}>[{attacker.tag}]</span>
            <i className="ri-arrow-right-line text-xs" style={{ color: '#4a5568' }}></i>
            <span className="text-xs font-semibold" style={{ color: defender.color }}>[{defender.tag}]</span>
          </div>
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded flex-shrink-0" style={{ background: `${intensityColors[war.intensity]}12`, color: intensityColors[war.intensity], border: `1px solid ${intensityColors[war.intensity]}25` }}>
          {war.intensity.toUpperCase()}
        </span>
      </div>

      {/* Battle progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-bold" style={{ color: attacker.color }}>{attacker.name}</span>
          <span className="font-bold" style={{ color: defender.color }}>{defender.name}</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-l-full" style={{ width: `${war.attackerProgress}%`, background: `linear-gradient(90deg, ${attacker.color}cc, ${attacker.color})`, transition: 'width 1s' }} />
          <div className="w-px h-full bg-black/60 flex-shrink-0" />
          <div className="h-full rounded-r-full" style={{ width: `${war.defenderProgress}%`, background: `linear-gradient(270deg, ${defender.color}cc, ${defender.color})`, transition: 'width 1s' }} />
        </div>
        <div className="flex items-center justify-between text-xs mt-1" style={{ color: '#4a5568' }}>
          <span style={{ color: attacker.color }}>{war.attackerProgress}%</span>
          <span>{war.duration}</span>
          <span style={{ color: defender.color }}>{war.defenderProgress}%</span>
        </div>
      </div>

      <p className="text-xs leading-relaxed mb-3" style={{ color: '#6b7a95' }}>{war.description.slice(0, 160)}...</p>

      <div className="flex items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8 }}>
        <div className="flex items-center gap-1 text-xs" style={{ color: '#6b7a95' }}>
          <i className="ri-map-pin-line text-xs" style={{ color: '#ef4444' }}></i>
          <span>{war.frontSystems} front systems</span>
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: '#6b7a95' }}>
          <i className="ri-sword-line text-xs" style={{ color: '#f87171' }}></i>
          <span>{war.battlesFought.toLocaleString()} battles</span>
        </div>
        <div className="flex items-center gap-1 text-xs ml-auto" style={{ color: '#6b7a95' }}>
          <i className="ri-skull-2-line text-xs" style={{ color: '#fb923c' }}></i>
          <span>{formatCasualties(war.totalCasualties)} casualties</span>
        </div>
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────────
   EMPIRE DETAIL PANEL
───────────────────────────────────────────────────────────── */
function EmpireDetailPanel({ empire, wars }: { empire: EmpireAtWar; wars: WarDeclaration[] }) {
  const empireWars = wars.filter(w => w.attackerId === empire.id || w.defenderId === empire.id);

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      {/* Header banner */}
      <div className="p-5 flex-shrink-0 relative overflow-hidden" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: `linear-gradient(135deg, ${empire.color}10, rgba(0,0,0,0.4))` }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${empire.color}, transparent)` }} />
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ border: `2px solid ${empire.color}50`, boxShadow: `0 0 20px ${empire.color}20` }}>
            <img src={empire.avatar} alt={empire.commanderName} className="w-full h-full object-cover object-top" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-black" style={{ color: empire.color }}>{empire.name}</h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: `${empire.color}15`, color: empire.color }}>[{empire.tag}]</span>
              <RankBadge rank={empire.rank} />
              <ThreatBadge level={empire.threatLevel} />
            </div>
            <p className="text-xs mt-1" style={{ color: '#4a5568' }}>{empire.commanderTitle}</p>
            <p className="text-xs mt-0.5 font-semibold" style={{ color: '#8892aa' }}>Cmd: {empire.commanderName}</p>
            <div className="text-xs mt-1 italic" style={{ color: empire.color, opacity: 0.7 }}>"{empire.battlecry}"</div>
          </div>
        </div>

        {/* Core stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Power', value: formatMilitaryPower(empire.militaryPower), icon: 'ri-rocket-2-line', color: empire.color },
            { label: 'Territory', value: empire.territorySystems.toLocaleString(), icon: 'ri-global-line', color: '#00d4ff' },
            { label: 'Fleets', value: empire.fleetCount.toLocaleString(), icon: 'ri-ship-line', color: '#4ade80' },
            { label: 'Population', value: formatPopulation(empire.population), icon: 'ri-community-line', color: '#fb923c' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
              <i className={`${stat.icon} text-sm mb-1`} style={{ color: stat.color }}></i>
              <div className="text-xs font-bold" style={{ color: '#e2e8f0' }}>{stat.value}</div>
              <div className="text-xs mt-0.5" style={{ color: '#4a5568', fontSize: 9 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* War score + Performance */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h4 className="text-xs font-bold tracking-widest mb-3" style={{ color: '#4a5568' }}>WAR PERFORMANCE</h4>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: '#6b7a95' }}>War Score</span>
                <span className="text-xs font-bold" style={{ color: empire.warScore >= 50 ? '#f87171' : '#4ade80' }}>{empire.warScore}/100</span>
              </div>
              <WarScoreBar score={empire.warScore} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.1)' }}>
                <div className="text-sm font-black" style={{ color: '#4ade80' }}>{empire.warsWon}</div>
                <div className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>Wars Won</div>
              </div>
              <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.1)' }}>
                <div className="text-sm font-black" style={{ color: '#f87171' }}>{empire.warsLost}</div>
                <div className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>Wars Lost</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <i className="ri-skull-2-line text-sm" style={{ color: '#fb923c' }}></i>
                <div>
                  <div className="text-xs font-bold" style={{ color: '#e2e8f0' }}>{formatCasualties(empire.casualtiesTotal)}</div>
                  <div className="text-xs" style={{ color: '#4a5568', fontSize: 9 }}>Total Casualties</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <i className="ri-rocket-2-line text-sm" style={{ color: '#f87171' }}></i>
                <div>
                  <div className="text-xs font-bold" style={{ color: '#e2e8f0' }}>{empire.shipsDestroyed.toLocaleString()}</div>
                  <div className="text-xs" style={{ color: '#4a5568', fontSize: 9 }}>Ships Destroyed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flagship */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h4 className="text-xs font-bold tracking-widest mb-2" style={{ color: '#4a5568' }}>FLAGSHIP</h4>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${empire.color}15`, border: `1px solid ${empire.color}30` }}>
              <i className="ri-ship-fill text-lg" style={{ color: empire.color }}></i>
            </div>
            <div>
              <div className="text-xs font-bold" style={{ color: '#e2e8f0' }}>{empire.flagshipName}</div>
              <div className="text-xs" style={{ color: '#4a5568' }}>{empire.flagshipsDestroyed} flagships destroyed in battle</div>
            </div>
          </div>
        </div>

        {/* Military composition */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h4 className="text-xs font-bold tracking-widest mb-3" style={{ color: '#4a5568' }}>FLEET COMPOSITION</h4>
          <div className="space-y-2">
            {empire.militaryComposition.map((comp) => (
              <div key={comp.type} className="flex items-center gap-2">
                <span className="text-xs w-20 text-right flex-shrink-0" style={{ color: '#6b7a95', fontSize: 10 }}>{comp.type}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.max(5, (comp.power / empire.militaryPower) * 100)}%`, background: empire.color }} />
                </div>
                <span className="text-xs w-12 text-right flex-shrink-0 font-semibold" style={{ color: '#8892aa', fontSize: 10 }}>{comp.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active wars for this empire */}
        {empireWars.length > 0 && (
          <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 className="text-xs font-bold tracking-widest mb-3" style={{ color: '#4a5568' }}>
              <i className="ri-sword-fill mr-1" style={{ color: '#ef4444' }}></i>ACTIVE WARS ({empireWars.length})
            </h4>
            <div className="space-y-2">
              {empireWars.map((war) => {
                const opponent = war.attackerId === empire.id ? getEmpireById(war.defenderId) : getEmpireById(war.attackerId);
                const isAttacker = war.attackerId === empire.id;
                return (
                  <div key={war.id} className="flex items-center gap-2 rounded-lg p-2" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: isAttacker ? '#ef4444' : '#fbbf24' }} />
                    <span className="text-xs font-semibold flex-1 truncate" style={{ color: opponent?.color ?? '#8892aa' }}>{war.warName}</span>
                    <span className="text-xs" style={{ color: '#4a5568' }}>{war.duration}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* War history */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h4 className="text-xs font-bold tracking-widest mb-3" style={{ color: '#4a5568' }}>WAR HISTORY</h4>
          <div className="space-y-2">
            {empire.warHistory.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs" style={{ borderBottom: i < empire.warHistory.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', paddingBottom: i < empire.warHistory.length - 1 ? 8 : 0 }}>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${h.result === 'victory' ? 'bg-green-400' : h.result === 'defeat' ? 'bg-red-400' : h.result === 'ongoing' ? 'bg-amber-400 animate-pulse' : 'bg-gray-500'}`} />
                <span className="flex-1 truncate" style={{ color: '#8892aa' }}>{h.opponent}</span>
                <span className="text-xs font-semibold capitalize flex-shrink-0" style={{ color: h.result === 'victory' ? '#4ade80' : h.result === 'defeat' ? '#f87171' : h.result === 'ongoing' ? '#fbbf24' : '#6b7a95' }}>{h.result}</span>
                <span className="text-xs flex-shrink-0" style={{ color: '#4a5568' }}>{h.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vassals */}
        {empire.vassals.length > 0 && (
          <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 className="text-xs font-bold tracking-widest mb-2" style={{ color: '#4a5568' }}>VASSALS</h4>
            <div className="flex flex-wrap gap-1.5">
              {empire.vassals.map((v) => (
                <span key={v} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(168,85,247,0.08)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.15)', fontSize: 10 }}>
                  <i className="ri-link mr-0.5"></i>{v}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Government / Ideology */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="block mb-0.5" style={{ color: '#4a5568', fontSize: 10 }}>Government</span>
              <span style={{ color: '#8892aa' }}>{empire.governmentType}</span>
            </div>
            <div>
              <span className="block mb-0.5" style={{ color: '#4a5568', fontSize: 10 }}>Race</span>
              <span style={{ color: '#8892aa' }}>{empire.raceType}</span>
            </div>
            <div>
              <span className="block mb-0.5" style={{ color: '#4a5568', fontSize: 10 }}>Homeworld</span>
              <span style={{ color: '#8892aa' }}>{empire.homeworld}</span>
            </div>
            <div>
              <span className="block mb-0.5" style={{ color: '#4a5568', fontSize: 10 }}>Planets</span>
              <span style={{ color: '#8892aa' }}>{empire.totalPlanets.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="text-xs block mb-1 italic leading-relaxed" style={{ color: '#6b7a95' }}>{empire.warDescription}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function EmpiresAtWarPage() {
  const [selectedEmpireId, setSelectedEmpireId] = useState<string>('empire-imperial-dominion');
  const [selectedWarId, setSelectedWarId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'militaryPower' | 'warScore' | 'territorySystems' | 'activeWars'>('militaryPower');
  const [threatFilter, setThreatFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'empires' | 'wars'>('empires');

  const selectedEmpire = useMemo(() => EMPIRES_AT_WAR.find(e => e.id === selectedEmpireId) ?? EMPIRES_AT_WAR[0], [selectedEmpireId]);

  const filteredEmpires = useMemo(() => {
    let list = [...EMPIRES_AT_WAR];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q) || e.tag.toLowerCase().includes(q) || e.commanderName.toLowerCase().includes(q));
    }
    if (threatFilter !== 'all') list = list.filter(e => e.threatLevel === threatFilter);
    list.sort((a, b) => b[sortBy] - a[sortBy]);
    return list;
  }, [searchQuery, threatFilter, sortBy]);

  const selectedWar = useMemo(() => ACTIVE_WAR_DECLARATIONS.find(w => w.id === selectedWarId) ?? null, [selectedWarId]);

  // Totals
  const totalEmpires = EMPIRES_AT_WAR.length;
  const totalActiveWars = ACTIVE_WAR_DECLARATIONS.length;
  const totalMilitaryPower = EMPIRES_AT_WAR.reduce((s, e) => s + e.militaryPower, 0);
  const totalCasualties = EMPIRES_AT_WAR.reduce((s, e) => s + e.casualtiesTotal, 0);
  const totalShipsDestroyed = EMPIRES_AT_WAR.reduce((s, e) => s + e.shipsDestroyed, 0);
  const totalTerritory = EMPIRES_AT_WAR.reduce((s, e) => s + e.territorySystems, 0);

  return (
    <>
      <style>{`
        @keyframes eaw-pulse-glitch { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes eaw-flame { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(1.3)} }
      `}</style>

      <div className="flex flex-col h-full" style={{ minHeight: 'calc(100vh - 96px)' }}>
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-5 relative overflow-hidden" style={{ borderBottom: '1px solid rgba(239,68,68,0.08)' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(239,68,68,0.03) 0%, transparent 100%)' }} />
          <div className="relative z-10 flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-black tracking-wider flex items-center gap-2" style={{ color: '#e2e8f0' }}>
                <i className="ri-sword-fill text-xl" style={{ color: '#ef4444' }}></i>
                EMPIRES AT WAR
              </h1>
              <p className="text-xs mt-0.5" style={{ color: '#4a5568' }}>
                Galactic-scale conflict tracker — 10 major civilizations locked in struggle across {totalActiveWars} active wars
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-bold">LIVE CONFLICT FEED</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color: '#4a5568' }}>Updated:</span>
                <span style={{ color: '#8892aa' }}>Just now</span>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Civilizations', value: totalEmpires, icon: 'ri-building-4-line', color: '#a78bfa' },
              { label: 'Active Wars', value: totalActiveWars, icon: 'ri-sword-fill', color: '#ef4444' },
              { label: 'Total Fleet Power', value: formatMilitaryPower(totalMilitaryPower), icon: 'ri-rocket-2-line', color: '#00d4ff' },
              { label: 'Total Casualties', value: formatCasualties(totalCasualties), icon: 'ri-skull-2-line', color: '#fb923c' },
              { label: 'Ships Destroyed', value: totalShipsDestroyed.toLocaleString(), icon: 'ri-ship-line', color: '#f87171' },
              { label: 'Contested Territory', value: totalTerritory.toLocaleString() + ' sys', icon: 'ri-global-line', color: '#4ade80' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: `${stat.color}08`, border: `1px solid ${stat.color}20` }}>
                <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${stat.color}15` }}>
                  <i className={`${stat.icon} text-sm`} style={{ color: stat.color }}></i>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-black truncate" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden" style={{ minHeight: 0 }}>
          {/* Left panel — Empire list or War list */}
          <div className="flex flex-col" style={{ width: 400, minWidth: 320, borderRight: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
            {/* View mode toggle */}
            <div className="flex items-center gap-1 px-4 py-2.5 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <button
                onClick={() => { setViewMode('empires'); setSelectedWarId(null); }}
                className="px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all whitespace-nowrap"
                style={{ background: viewMode === 'empires' ? 'rgba(239,68,68,0.12)' : 'transparent', color: viewMode === 'empires' ? '#ef4444' : '#4a5568', border: viewMode === 'empires' ? '1px solid rgba(239,68,68,0.3)' : '1px solid transparent' }}
              >
                <i className="ri-building-4-line mr-1"></i>Empires
              </button>
              <button
                onClick={() => { setViewMode('wars'); setSelectedEmpireId(EMPIRES_AT_WAR[0].id); }}
                className="px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all whitespace-nowrap"
                style={{ background: viewMode === 'wars' ? 'rgba(239,68,68,0.12)' : 'transparent', color: viewMode === 'wars' ? '#ef4444' : '#4a5568', border: viewMode === 'wars' ? '1px solid rgba(239,68,68,0.3)' : '1px solid transparent' }}
              >
                <i className="ri-sword-line mr-1"></i>Active Wars
              </button>
            </div>

            {viewMode === 'empires' ? (
              <>
                {/* Filters */}
                <div className="px-4 py-2.5 space-y-2 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="relative">
                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#4a5568' }}></i>
                    <input
                      type="text" placeholder="Search empires..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#c8d4e8' }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={threatFilter} onChange={(e) => setThreatFilter(e.target.value)} className="flex-1 px-2 py-1.5 rounded-lg text-xs outline-none cursor-pointer" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#c8d4e8' }}>
                      <option value="all" style={{ background: '#0d1526' }}>All Threats</option>
                      <option value="apocalyptic" style={{ background: '#0d1526' }}>Apocalyptic</option>
                      <option value="extreme" style={{ background: '#0d1526' }}>Extreme</option>
                      <option value="high" style={{ background: '#0d1526' }}>High</option>
                      <option value="moderate" style={{ background: '#0d1526' }}>Moderate</option>
                      <option value="low" style={{ background: '#0d1526' }}>Low</option>
                    </select>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="flex-1 px-2 py-1.5 rounded-lg text-xs outline-none cursor-pointer" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#c8d4e8' }}>
                      <option value="militaryPower" style={{ background: '#0d1526' }}>Sort: Fleet Power</option>
                      <option value="warScore" style={{ background: '#0d1526' }}>Sort: War Score</option>
                      <option value="territorySystems" style={{ background: '#0d1526' }}>Sort: Territory</option>
                      <option value="activeWars" style={{ background: '#0d1526' }}>Sort: Active Wars</option>
                    </select>
                  </div>
                </div>

                {/* Empire list */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ scrollbarWidth: 'none' }}>
                  {filteredEmpires.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 gap-2">
                      <i className="ri-search-line text-2xl" style={{ color: '#4a5568' }}></i>
                      <span className="text-xs" style={{ color: '#4a5568' }}>No empires found</span>
                    </div>
                  ) : filteredEmpires.map((empire) => (
                    <EmpireCard
                      key={empire.id}
                      empire={empire}
                      isSelected={selectedEmpireId === empire.id}
                      isPlayer={false}
                      onClick={() => { setSelectedEmpireId(empire.id); setViewMode('empires'); }}
                    />
                  ))}
                </div>
              </>
            ) : (
              /* War list */
              <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ scrollbarWidth: 'none' }}>
                {ACTIVE_WAR_DECLARATIONS.map((war) => (
                  <WarCard
                    key={war.id}
                    war={war}
                    onClick={() => { setSelectedWarId(war.id); if (war.attackerId) setSelectedEmpireId(war.attackerId); }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Center — War map visualization */}
          <div className="flex-1 flex flex-col overflow-hidden" style={{ minWidth: 0 }}>
            {/* Podium / Top empires in war */}
            <div className="flex-shrink-0 px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#4a5568' }}>MOST DANGEROUS EMPIRES</div>
              <div className="flex items-end justify-center gap-4">
                {/* #2 */}
                {EMPIRES_AT_WAR[1] && (
                  <div className="flex flex-col items-center gap-2 flex-1 max-w-[160px]">
                    <div className="w-14 h-14 rounded-xl overflow-hidden" style={{ border: `2px solid ${EMPIRES_AT_WAR[1].color}40` }}>
                      <img src={EMPIRES_AT_WAR[1].avatar} alt="" className="w-full h-full object-cover object-top" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold truncate max-w-[120px]" style={{ color: EMPIRES_AT_WAR[1].color }}>{EMPIRES_AT_WAR[1].name}</div>
                      <div className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>{EMPIRES_AT_WAR[1].commanderName}</div>
                      <div className="text-xs font-bold mt-0.5" style={{ color: '#e2e8f0' }}>{formatMilitaryPower(EMPIRES_AT_WAR[1].militaryPower)}</div>
                    </div>
                    <div className="w-full flex items-center justify-center rounded-t-lg" style={{ background: 'rgba(192,192,192,0.08)', border: '1px solid rgba(192,192,192,0.15)', height: 55 }}>
                      <span className="text-2xl font-black" style={{ color: '#c0c0c0' }}>2</span>
                    </div>
                  </div>
                )}
                {/* #1 */}
                {EMPIRES_AT_WAR[0] && (
                  <div className="flex flex-col items-center gap-2 flex-1 max-w-[180px]">
                    <div className="relative">
                      <i className="ri-vip-crown-fill text-xl absolute -top-3 left-1/2 -translate-x-1/2" style={{ color: '#fbbf24' }}></i>
                      <div className="w-16 h-16 rounded-xl overflow-hidden" style={{ border: `2px solid ${EMPIRES_AT_WAR[0].color}50`, boxShadow: `0 0 20px ${EMPIRES_AT_WAR[0].color}20` }}>
                        <img src={EMPIRES_AT_WAR[0].avatar} alt="" className="w-full h-full object-cover object-top" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold truncate max-w-[140px]" style={{ color: EMPIRES_AT_WAR[0].color }}>{EMPIRES_AT_WAR[0].name}</div>
                      <div className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>{EMPIRES_AT_WAR[0].commanderName}</div>
                      <div className="text-sm font-black mt-0.5" style={{ color: '#e2e8f0' }}>{formatMilitaryPower(EMPIRES_AT_WAR[0].militaryPower)}</div>
                      <ThreatBadge level={EMPIRES_AT_WAR[0].threatLevel} />
                    </div>
                    <div className="w-full flex items-center justify-center rounded-t-lg" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', height: 72 }}>
                      <span className="text-3xl font-black" style={{ color: '#ef4444' }}>1</span>
                    </div>
                  </div>
                )}
                {/* #3 */}
                {EMPIRES_AT_WAR[2] && (
                  <div className="flex flex-col items-center gap-2 flex-1 max-w-[160px]">
                    <div className="w-14 h-14 rounded-xl overflow-hidden" style={{ border: `2px solid ${EMPIRES_AT_WAR[2].color}40` }}>
                      <img src={EMPIRES_AT_WAR[2].avatar} alt="" className="w-full h-full object-cover object-top" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold truncate max-w-[120px]" style={{ color: EMPIRES_AT_WAR[2].color }}>{EMPIRES_AT_WAR[2].name}</div>
                      <div className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>{EMPIRES_AT_WAR[2].commanderName}</div>
                      <div className="text-xs font-bold mt-0.5" style={{ color: '#e2e8f0' }}>{formatMilitaryPower(EMPIRES_AT_WAR[2].militaryPower)}</div>
                    </div>
                    <div className="w-full flex items-center justify-center rounded-t-lg" style={{ background: 'rgba(205,127,50,0.08)', border: '1px solid rgba(205,127,50,0.15)', height: 44 }}>
                      <span className="text-2xl font-black" style={{ color: '#cd7f32' }}>3</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* War zone / key battles */}
            <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: 'none' }}>
              {/* Key Battles section */}
              <div className="mb-6">
                <h4 className="text-xs font-bold tracking-widest mb-3" style={{ color: '#4a5568' }}>
                  <i className="ri-fire-fill mr-1.5" style={{ color: '#ef4444' }}></i>KEY BATTLEFRONTS
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {ACTIVE_WAR_DECLARATIONS.slice(0, 4).map((war) => {
                    const attacker = getEmpireById(war.attackerId);
                    const defender = getEmpireById(war.defenderId);
                    return (
                      <div key={war.id} className="rounded-xl p-4 cursor-pointer transition-all hover:bg-white/[0.03]" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }} onClick={() => { setSelectedWarId(war.id); setViewMode('wars'); }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold truncate" style={{ color: '#e2e8f0' }}>{war.warName}</span>
                          <span className="text-xs px-2 py-0.5 rounded flex-shrink-0" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: 10, border: '1px solid rgba(239,68,68,0.2)' }}>
                            {war.intensity.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold" style={{ color: attacker?.color }}>[{attacker?.tag}]</span>
                          <i className="ri-arrow-right-line text-xs" style={{ color: '#4a5568' }}></i>
                          <span className="text-xs font-semibold" style={{ color: defender?.color }}>[{defender?.tag}]</span>
                        </div>
                        <div className="space-y-1 mt-2">
                          {war.keyBattles.slice(0, 2).map((b, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#4a5568' }} />
                              <span className="flex-1 truncate" style={{ color: '#8892aa' }}>{b.name}</span>
                              <span className="text-xs flex-shrink-0" style={{ color: b.result.includes('Victory') ? '#4ade80' : b.result === 'Ongoing' ? '#fbbf24' : '#f87171', fontSize: 10 }}>{b.result}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 mt-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                          <span className="text-xs" style={{ color: '#4a5568' }}>{war.frontSystems} systems</span>
                          <span className="text-xs" style={{ color: '#4a5568' }}>{war.battlesFought.toLocaleString()} battles</span>
                          <span className="text-xs" style={{ color: '#4a5568' }}>{war.duration}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fleet Power Comparison */}
              <div className="mb-6">
                <h4 className="text-xs font-bold tracking-widest mb-3" style={{ color: '#4a5568' }}>
                  <i className="ri-bar-chart-line mr-1.5" style={{ color: '#00d4ff' }}></i>FLEET POWER COMPARISON
                </h4>
                <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="space-y-3">
                    {[...EMPIRES_AT_WAR].sort((a, b) => b.militaryPower - a.militaryPower).slice(0, 6).map((empire, idx) => {
                      const maxPower = EMPIRES_AT_WAR[0].militaryPower;
                      const pct = (empire.militaryPower / maxPower) * 100;
                      return (
                        <div key={empire.id} className="flex items-center gap-3">
                          <span className="text-xs w-4 text-right flex-shrink-0 font-bold" style={{ color: idx === 0 ? '#fbbf24' : '#4a5568' }}>#{idx + 1}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold truncate" style={{ color: empire.color }}>[{empire.tag}]</span>
                                <span className="text-xs truncate" style={{ color: '#8892aa' }}>{empire.name}</span>
                              </div>
                              <span className="text-xs font-bold flex-shrink-0 ml-2" style={{ color: '#e2e8f0' }}>{formatMilitaryPower(empire.militaryPower)}</span>
                            </div>
                            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${empire.color}80, ${empire.color})` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Alliance Web */}
              <div>
                <h4 className="text-xs font-bold tracking-widest mb-3" style={{ color: '#4a5568' }}>
                  <i className="ri-shield-star-line mr-1.5" style={{ color: '#a78bfa' }}></i>ALLIANCE WEB
                </h4>
                <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="space-y-2">
                    {/* Alliance Blocs */}
                    <div className="mb-3">
                      <span className="text-xs font-bold block mb-2" style={{ color: '#ef4444' }}>AXIS OF IRON</span>
                      <div className="flex flex-wrap gap-1.5">
                        {['Imperial Dominion', 'Dark Legion', 'Void Hunters'].map((name) => {
                          const emp = EMPIRES_AT_WAR.find(e => e.name === name);
                          return (
                            <span key={name} className="text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap" style={{ background: `${emp?.color ?? '#ef4444'}12`, color: emp?.color ?? '#ef4444', border: `1px solid ${emp?.color ?? '#ef4444'}25` }}>
                              [{emp?.tag ?? '???'}]
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="mb-3">
                      <span className="text-xs font-bold block mb-2" style={{ color: '#00d4ff' }}>FREEDOM COALITION</span>
                      <div className="flex flex-wrap gap-1.5">
                        {['Galactic Federation', 'Solar Collective', 'Nova Coalition', 'Terran Republic'].map((name) => {
                          const emp = EMPIRES_AT_WAR.find(e => e.name === name);
                          return (
                            <span key={name} className="text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap" style={{ background: `${emp?.color ?? '#00d4ff'}12`, color: emp?.color ?? '#00d4ff', border: `1px solid ${emp?.color ?? '#00d4ff'}25` }}>
                              [{emp?.tag ?? '???'}]
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="mb-3">
                      <span className="text-xs font-bold block mb-2" style={{ color: '#4ade80' }}>INDEPENDENT POWERS</span>
                      <div className="flex flex-wrap gap-1.5">
                        {['Forge World Alliance', 'Celestial Pact', 'Pirate Clans Coalition'].map((name) => {
                          const emp = EMPIRES_AT_WAR.find(e => e.name === name);
                          return (
                            <span key={name} className="text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap" style={{ background: `${emp?.color ?? '#4ade80'}12`, color: emp?.color ?? '#4ade80', border: `1px solid ${emp?.color ?? '#4ade80'}25` }}>
                              [{emp?.tag ?? '???'}]
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <span className="text-xs" style={{ color: '#4a5568' }}>
                      <span className="font-bold" style={{ color: '#ef4444' }}>2 major blocs</span> locked in galactic-scale conflict |{' '}
                      <span className="font-bold" style={{ color: '#fbbf24' }}>3 independent powers</span> shaping the balance
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel — Detail */}
          <div className="flex-shrink-0 overflow-hidden" style={{ width: 320, borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
            {viewMode === 'empires' && selectedEmpire ? (
              <EmpireDetailPanel empire={selectedEmpire} wars={ACTIVE_WAR_DECLARATIONS} />
            ) : viewMode === 'wars' && selectedWar ? (
              <div className="h-full overflow-y-auto p-4" style={{ scrollbarWidth: 'none' }}>
                <div className="flex flex-col items-center justify-center h-40 gap-3">
                  <i className="ri-sword-line text-3xl" style={{ color: '#4a5568' }}></i>
                  <span className="text-xs text-center" style={{ color: '#4a5568' }}>Select a war in the left panel to view full details</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <i className="ri-sword-fill text-3xl" style={{ color: '#4a5568' }}></i>
                <span className="text-xs" style={{ color: '#4a5568' }}>Select an empire to view war details</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}