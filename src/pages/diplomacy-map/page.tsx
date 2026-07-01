import { useState, useRef, useCallback, useEffect } from 'react';
import {
  ALLIANCES,
  DIPLOMACY_ZONES,
  ACTIVE_WARS,
  DIPLOMACY_EVENTS,
  Alliance,
  DiplomacyZone,
} from '@/data/diplomacyMap';

// ── helpers ──────────────────────────────────────────────────────────────────
function allianceById(id: string | null): Alliance | undefined {
  if (!id) return undefined;
  return ALLIANCES.find(a => a.id === id);
}

function formatNum(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}

// ── Event feed item ───────────────────────────────────────────────────────────
function EventTypeIcon({ type }: { type: string }) {
  const map: Record<string, { icon: string; color: string }> = {
    war_declared:       { icon: 'ri-sword-fill',              color: '#f87171' },
    peace_signed:       { icon: 'ri-shake-hands-line',         color: '#34d399' },
    nap_signed:         { icon: 'ri-hand-heart-line',         color: '#60a5fa' },
    alliance_formed:    { icon: 'ri-shield-star-line',        color: '#fbbf24' },
    territory_captured: { icon: 'ri-flag-fill',               color: '#fb923c' },
    blockade:           { icon: 'ri-lock-line',               color: '#a78bfa' },
  };
  const { icon, color } = map[type] ?? { icon: 'ri-information-line', color: '#6b7280' };
  return (
    <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
      style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
      <i className={`${icon} text-xs`} style={{ color }}></i>
    </div>
  );
}

// ── Galaxy grid cell ──────────────────────────────────────────────────────────
function GridCell({
  zone,
  selected,
  onClick,
}: {
  zone: DiplomacyZone;
  selected: boolean;
  onClick: (z: DiplomacyZone) => void;
}) {
  const alliance = allianceById(zone.allianceId);

  let bg = 'rgba(255,255,255,0.03)';
  let border = 'rgba(255,255,255,0.06)';

  if (zone.type === 'warzone' && alliance) {
    bg = `${alliance.color}22`;
    border = `${alliance.color}60`;
  } else if (zone.type === 'contested') {
    bg = 'rgba(239,68,68,0.18)';
    border = 'rgba(239,68,68,0.6)';
  } else if (zone.type === 'territory' && alliance) {
    bg = `${alliance.color}14`;
    border = `${alliance.color}30`;
  } else if (zone.type === 'nap_border' && alliance) {
    bg = `${alliance.color}0a`;
    border = `${alliance.color}50`;
  } else if (zone.type === 'ally_border' && alliance) {
    bg = `${alliance.color}10`;
    border = `${alliance.color}40`;
  }

  if (selected) {
    bg = alliance ? `${alliance.color}40` : 'rgba(255,255,255,0.15)';
    border = alliance ? alliance.color : '#fff';
  }

  return (
    <div
      className="relative cursor-pointer transition-all hover:scale-105 rounded-sm"
      style={{ background: bg, border: `1px solid ${border}`, aspectRatio: '1' }}
      onClick={() => onClick(zone)}
      title={`[${zone.galaxy}:${zone.system}:16] — ${zone.type}`}
    >
      {/* War zone pulse */}
      {zone.type === 'warzone' && (
        <div className="absolute inset-0 rounded-sm animate-pulse opacity-40"
          style={{ background: alliance ? alliance.color : '#f87171' }} />
      )}
      {/* Contested flash */}
      {zone.type === 'contested' && (
        <div className="absolute inset-0 rounded-sm animate-ping opacity-20"
          style={{ background: '#ef4444' }} />
      )}
      {/* Resource dot */}
      {zone.resources === 'high' && (
        <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full"
          style={{ background: '#fcd34d' }} />
      )}
    </div>
  );
}

// ── Alliance legend card ──────────────────────────────────────────────────────
function AllianceLegendCard({
  alliance,
  active,
  onClick,
}: {
  alliance: Alliance;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl px-3 py-2.5 transition-all cursor-pointer"
      style={{
        background: active ? `${alliance.color}18` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${active ? alliance.color : 'rgba(255,255,255,0.07)'}`,
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: alliance.color }} />
        <span className="text-xs font-bold text-white truncate">{alliance.tag}</span>
        <span className="text-xs text-gray-500 truncate">{alliance.name}</span>
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
        <span className="text-xs" style={{ color: alliance.color }}>{formatNum(alliance.power)} PWR</span>
        <span className="text-xs text-gray-400">{alliance.members} members</span>
        <span className="text-xs text-gray-500">{alliance.territories} sectors</span>
        <span className="text-xs" style={{ color:
          alliance.status === 'dominant' ? '#f87171' :
          alliance.status === 'strong'   ? '#fbbf24' :
          alliance.status === 'growing'  ? '#34d399' : '#a78bfa'
        }}>{alliance.status}</span>
      </div>
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DiplomacyMapPage() {
  const [selectedZone, setSelectedZone] = useState<DiplomacyZone | null>(null);
  const [filterAlliance, setFilterAlliance] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [tab, setTab] = useState<'map' | 'wars' | 'events'>('map');
  const [tickerIdx, setTickerIdx] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);

  // Scrolling ticker
  useEffect(() => {
    const iv = setInterval(() => {
      setTickerIdx(i => (i + 1) % DIPLOMACY_EVENTS.length);
    }, 3500);
    return () => clearInterval(iv);
  }, []);

  const handleCellClick = useCallback((zone: DiplomacyZone) => {
    setSelectedZone(prev => (prev?.sectorId === zone.sectorId ? null : zone));
  }, []);

  // Group zones by galaxy (9 galaxies × 99 systems)
  const galaxies = Array.from({ length: 9 }, (_, i) => i + 1);

  // Filter zones for display
  const filteredZones = DIPLOMACY_ZONES.filter(z => {
    if (filterAlliance && z.allianceId !== filterAlliance) return false;
    if (filterType && z.type !== filterType) return false;
    return true;
  });
  const filteredSet = new Set(filteredZones.map(z => z.sectorId));

  const selectedAlliance = selectedZone ? allianceById(selectedZone.allianceId) : null;

  // War stats
  const totalWarzones = DIPLOMACY_ZONES.filter(z => z.type === 'warzone').length;
  const totalContested = DIPLOMACY_ZONES.filter(z => z.type === 'contested').length;

  const TYPE_FILTERS = [
    { id: 'warzone',    label: 'War Zones',  color: '#f87171' },
    { id: 'contested',  label: 'Contested',  color: '#fb923c' },
    { id: 'territory',  label: 'Territory',  color: '#34d399' },
    { id: 'nap_border', label: 'NAP Border', color: '#60a5fa' },
    { id: 'ally_border',label: 'Ally Border',color: '#fbbf24' },
    { id: 'neutral',    label: 'Neutral',    color: '#6b7280' },
  ];

  return (
    <div className="text-white px-4 py-5" style={{ minHeight: '100vh' }}>
      {/* ── Live Ticker ─────────────────────────────────────────────────── */}
      <div className="mb-4 rounded-lg overflow-hidden flex items-center gap-3"
        style={{ background: '#0d1020', border: '1px solid rgba(248,113,113,0.25)' }}>
        <div className="flex-shrink-0 px-3 py-1.5 flex items-center gap-1.5"
          style={{ background: 'rgba(248,113,113,0.15)', borderRight: '1px solid rgba(248,113,113,0.25)' }}>
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
          <span className="text-xs font-black text-red-400 tracking-widest">LIVE</span>
        </div>
        <p className="text-xs text-gray-300 py-1.5 truncate">
          {DIPLOMACY_EVENTS[tickerIdx].description}
        </p>
        <span className="text-xs text-gray-600 flex-shrink-0 pr-3">
          {DIPLOMACY_EVENTS[tickerIdx].timestamp}
        </span>
      </div>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-xl font-black" style={{ color: '#00d4ff' }}>Universe Diplomacy Map</h1>
          <p className="text-xs text-gray-400 mt-0.5">Alliance territories, borders &amp; active war zones across all 9 galaxies</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-lg font-black text-red-400">{ACTIVE_WARS.length}</p>
            <p className="text-xs text-gray-500">Active Wars</p>
          </div>
          <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="text-center">
            <p className="text-lg font-black text-orange-400">{totalWarzones}</p>
            <p className="text-xs text-gray-500">War Zones</p>
          </div>
          <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="text-center">
            <p className="text-lg font-black text-yellow-400">{totalContested}</p>
            <p className="text-xs text-gray-500">Contested</p>
          </div>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-4 p-1 rounded-lg w-fit" style={{ background: 'rgba(255,255,255,0.05)' }}>
        {(['map', 'wars', 'events'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer capitalize whitespace-nowrap"
            style={tab === t
              ? { background: 'rgba(0,212,255,0.2)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.4)' }
              : { color: '#6b7a95' }
            }
          >
            {t === 'map' ? 'Galaxy Grid' : t === 'wars' ? `Active Wars (${ACTIVE_WARS.length})` : 'Diplomacy Feed'}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MAP TAB
      ══════════════════════════════════════════════════════════════════ */}
      {tab === 'map' && (
        <div className="flex gap-4">
          {/* ── LEFT: Legend + Filters ────────────────────────────────── */}
          <div className="flex-shrink-0 w-52 space-y-4">
            {/* Alliance filter */}
            <div className="rounded-xl p-3" style={{ background: '#0a0f1e', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Alliances</p>
              <div className="space-y-2">
                <button
                  onClick={() => setFilterAlliance(null)}
                  className="w-full text-left text-xs px-2 py-1.5 rounded-lg cursor-pointer transition-all"
                  style={!filterAlliance
                    ? { background: 'rgba(0,212,255,0.15)', color: '#00d4ff' }
                    : { color: '#6b7a95' }
                  }
                >All Alliances</button>
                {ALLIANCES.map(a => (
                  <AllianceLegendCard
                    key={a.id}
                    alliance={a}
                    active={filterAlliance === a.id}
                    onClick={() => setFilterAlliance(filterAlliance === a.id ? null : a.id)}
                  />
                ))}
              </div>
            </div>

            {/* Type filter */}
            <div className="rounded-xl p-3" style={{ background: '#0a0f1e', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Zone Type</p>
              <div className="space-y-1">
                <button
                  onClick={() => setFilterType(null)}
                  className="w-full text-left text-xs px-2 py-1.5 rounded-lg cursor-pointer transition-all"
                  style={!filterType ? { background: 'rgba(0,212,255,0.15)', color: '#00d4ff' } : { color: '#6b7a95' }}
                >All Types</button>
                {TYPE_FILTERS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilterType(filterType === f.id ? null : f.id)}
                    className="w-full text-left flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg cursor-pointer transition-all"
                    style={filterType === f.id
                      ? { background: `${f.color}20`, color: f.color, border: `1px solid ${f.color}40` }
                      : { color: '#6b7a95' }
                    }
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: f.color }} />
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── CENTER: Galaxy Grid ───────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <div
              ref={mapRef}
              className="rounded-xl p-4 overflow-auto"
              style={{ background: '#060b18', border: '1px solid rgba(0,212,255,0.1)' }}
            >
              {/* Column labels — systems 1–99 grouped visually by 10 */}
              <div className="flex items-center gap-1 mb-2 ml-12">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="flex-1 text-center text-xs text-gray-600">{i * 10 + 5}</div>
                ))}
              </div>

              {/* Rows = galaxies */}
              <div className="space-y-1">
                {galaxies.map(g => {
                  const rowZones = DIPLOMACY_ZONES.filter(z => z.galaxy === g);
                  // Group into 10 columns (each col = ~10 systems merged into 1 cell for readability)
                  const cols = Array.from({ length: 10 }, (_, ci) => {
                    const sMin = ci * 10 + 1;
                    const sMax = ci * 10 + 10;
                    const zonesInCol = rowZones.filter(z => z.system >= sMin && z.system <= sMax);
                    // Pick representative zone (warzone > contested > territory > rest)
                    const priority = ['warzone', 'contested', 'nap_border', 'ally_border', 'territory', 'neutral'];
                    let rep = zonesInCol[0];
                    for (const p of priority) {
                      const found = zonesInCol.find(z => z.type === p);
                      if (found) { rep = found; break; }
                    }
                    return rep;
                  });

                  return (
                    <div key={g} className="flex items-center gap-1">
                      {/* Row label */}
                      <div className="w-10 flex-shrink-0 text-right pr-2 text-xs font-mono"
                        style={{ color: '#4a5568' }}>G{g}</div>
                      {/* Cells — 10 cols, each represents 10 systems */}
                      {cols.map((zone, ci) => {
                        if (!zone) return <div key={ci} className="flex-1 rounded-sm" style={{ aspectRatio: '1', background: 'rgba(0,0,0,0.3)' }} />;
                        const dimmed = (filterAlliance || filterType) && !filteredSet.has(zone.sectorId);
                        return (
                          <div
                            key={ci}
                            className="flex-1"
                            style={{ opacity: dimmed ? 0.15 : 1 }}
                          >
                            <GridCell
                              zone={zone}
                              selected={selectedZone?.sectorId === zone.sectorId}
                              onClick={handleCellClick}
                            />
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Map Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-3"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {[
                  { color: '#ef444430', border: '#ef444490', label: 'War Zone' },
                  { color: '#f9731620', border: '#f9731660', label: 'Contested' },
                  { color: '#00d4ff14', border: '#00d4ff30', label: 'Territory' },
                  { color: 'rgba(96,165,250,0.06)', border: 'rgba(96,165,250,0.5)', label: 'NAP Border' },
                  { color: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.4)', label: 'Ally Border' },
                  { color: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.06)', label: 'Neutral' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-sm flex-shrink-0"
                      style={{ background: l.color, border: `1px solid ${l.border}` }} />
                    <span className="text-xs text-gray-500">{l.label}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full" style={{ background: '#fcd34d' }} />
                  <span className="text-xs text-gray-500">High Resources</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Zone Inspector / Alliance detail ───────────────── */}
          <div className="flex-shrink-0 w-56 space-y-3">
            {selectedZone ? (
              <div className="rounded-xl p-4 space-y-3"
                style={{ background: '#0a0f1e', border: `1px solid ${selectedAlliance?.color ?? 'rgba(255,255,255,0.1)'}` }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Zone Inspector</span>
                  <button onClick={() => setSelectedZone(null)}
                    className="w-5 h-5 flex items-center justify-center rounded text-gray-500 hover:text-white cursor-pointer">
                    <i className="ri-close-line text-xs"></i>
                  </button>
                </div>
                <div className="rounded-lg p-3 space-y-2"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-sm font-mono font-bold" style={{ color: selectedAlliance?.color ?? '#6b7a95' }}>
                    G{selectedZone.galaxy} Sector {Math.floor(selectedZone.system / 10) * 10 + 1}–{Math.floor(selectedZone.system / 10) * 10 + 10}
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Controlled by</span>
                      <span style={{ color: selectedAlliance?.color ?? '#6b7a95' }}>
                        {selectedAlliance?.tag ?? 'Neutral'}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Zone type</span>
                      <span className="text-white capitalize">{selectedZone.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Resources</span>
                      <span className={selectedZone.resources === 'high' ? 'text-yellow-400' : selectedZone.resources === 'medium' ? 'text-green-400' : 'text-gray-400'}>
                        {selectedZone.resources.toUpperCase()}
                      </span>
                    </div>
                    {selectedZone.battleCount && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Battles (24h)</span>
                        <span className="text-red-400">{selectedZone.battleCount}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedAlliance && (
                  <div className="rounded-lg p-3 space-y-2"
                    style={{ background: `${selectedAlliance.color}08`, border: `1px solid ${selectedAlliance.color}25` }}>
                    <p className="text-xs font-bold" style={{ color: selectedAlliance.color }}>{selectedAlliance.name}</p>
                    <div className="space-y-1">
                      {[
                        ['Members', `${selectedAlliance.members}`],
                        ['Power', formatNum(selectedAlliance.power)],
                        ['Territories', `${selectedAlliance.territories}`],
                        ['Allies', selectedAlliance.diplomacy.allies.length ? selectedAlliance.diplomacy.allies.map(id => ALLIANCES.find(a => a.id === id)?.tag).join(', ') : '—'],
                        ['NAPs', selectedAlliance.diplomacy.nap.length ? selectedAlliance.diplomacy.nap.map(id => ALLIANCES.find(a => a.id === id)?.tag).join(', ') : '—'],
                        ['At War', selectedAlliance.diplomacy.war.length ? selectedAlliance.diplomacy.war.map(id => ALLIANCES.find(a => a.id === id)?.tag).join(', ') : 'None'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-xs">
                          <span className="text-gray-500">{k}</span>
                          <span className={k === 'At War' && v !== 'None' ? 'text-red-400' : k === 'Allies' && v !== '—' ? 'text-green-400' : 'text-white'}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl p-4 text-center"
                style={{ background: '#0a0f1e', border: '1px solid rgba(255,255,255,0.06)' }}>
                <i className="ri-cursor-line text-2xl text-gray-600 block mb-2"></i>
                <p className="text-xs text-gray-500">Click any cell on the map to inspect that sector</p>
              </div>
            )}

            {/* Alliance diplomacy web */}
            <div className="rounded-xl p-3" style={{ background: '#0a0f1e', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Diplo Relations</p>
              <div className="space-y-2">
                {ALLIANCES.map(a => (
                  <div key={a.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: a.color }} />
                    <span className="text-xs text-gray-300 flex-1 truncate">{a.tag}</span>
                    <div className="flex gap-1">
                      {a.diplomacy.war.length > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171' }}>
                          WAR×{a.diplomacy.war.length}
                        </span>
                      )}
                      {a.diplomacy.allies.length > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>
                          ✓{a.diplomacy.allies.length}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          WARS TAB
      ══════════════════════════════════════════════════════════════════ */}
      {tab === 'wars' && (
        <div className="space-y-4">
          {ACTIVE_WARS.map(war => {
            const attacker = allianceById(war.attackerId);
            const defender = allianceById(war.defenderId);
            if (!attacker || !defender) return null;
            const intensityColor = war.intensity === 'extreme' ? '#f87171' : war.intensity === 'critical' ? '#fb923c' : '#fbbf24';
            return (
              <div key={war.id} className="rounded-xl overflow-hidden"
                style={{ background: '#0a0f1e', border: `1px solid ${intensityColor}40` }}>
                {/* Header */}
                <div className="px-5 py-3 flex items-center justify-between"
                  style={{ background: `${intensityColor}10`, borderBottom: `1px solid ${intensityColor}20` }}>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: intensityColor }} />
                    <span className="text-sm font-bold" style={{ color: intensityColor }}>
                      {war.intensity.toUpperCase()} — Alliance War
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>Started {war.startTime}</span>
                  </div>
                </div>

                <div className="p-5">
                  {/* VS bar */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex-1 rounded-xl p-4"
                      style={{ background: `${attacker.color}12`, border: `1px solid ${attacker.color}35` }}>
                      <p className="text-xs text-gray-400 mb-0.5">Attacker</p>
                      <p className="text-sm font-black" style={{ color: attacker.color }}>{attacker.name}</p>
                      <p className="text-xs text-gray-500">{attacker.tag} · {attacker.members} members</p>
                    </div>
                    <div className="text-lg font-black text-gray-500 flex-shrink-0">VS</div>
                    <div className="flex-1 rounded-xl p-4"
                      style={{ background: `${defender.color}12`, border: `1px solid ${defender.color}35` }}>
                      <p className="text-xs text-gray-400 mb-0.5">Defender</p>
                      <p className="text-sm font-black" style={{ color: defender.color }}>{defender.name}</p>
                      <p className="text-xs text-gray-500">{defender.tag} · {defender.members} members</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Battles Fought', value: war.battlesFought.toLocaleString(), color: '#f87171', icon: 'ri-sword-line' },
                      { label: 'Total Casualties', value: formatNum(war.casualties), color: '#fb923c', icon: 'ri-sword-line' },
                      { label: 'Front-Line Zones', value: war.frontLine.length, color: '#fbbf24', icon: 'ri-map-pin-line' },
                    ].map(s => (
                      <div key={s.label} className="rounded-lg p-3 text-center"
                        style={{ background: `${s.color}08`, border: `1px solid ${s.color}20` }}>
                        <i className={`${s.icon} text-lg mb-1 block`} style={{ color: s.color }}></i>
                        <p className="text-base font-black" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-xs text-gray-500">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Front line coords */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs text-gray-500">Front Lines:</span>
                    {war.frontLine.map((fl, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded font-mono"
                        style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
                        [{fl.galaxy}:{fl.system}:16]
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Alliances at peace */}
          <div className="rounded-xl p-4" style={{ background: '#0a0f1e', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Alliance Status Overview</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ALLIANCES.map(a => (
                <div key={a.id} className="rounded-lg p-3"
                  style={{ background: `${a.color}08`, border: `1px solid ${a.color}25` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: a.color }} />
                    <span className="text-xs font-bold" style={{ color: a.color }}>{a.tag}</span>
                  </div>
                  <p className="text-xs text-gray-300 mb-1">{a.name}</p>
                  <div className="flex gap-1 flex-wrap">
                    {a.diplomacy.war.length > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171' }}>At War</span>
                    )}
                    {a.diplomacy.allies.length > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>Allied</span>
                    )}
                    {a.diplomacy.nap.length > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa' }}>NAP</span>
                    )}
                    {a.diplomacy.war.length === 0 && a.diplomacy.allies.length === 0 && a.diplomacy.nap.length === 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(107,114,128,0.15)', color: '#9ca3af' }}>Neutral</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          EVENTS TAB
      ══════════════════════════════════════════════════════════════════ */}
      {tab === 'events' && (
        <div className="max-w-2xl space-y-2">
          {DIPLOMACY_EVENTS.map((ev, i) => {
            const isNew = i < 2;
            return (
              <div key={ev.id}
                className="flex items-start gap-3 rounded-xl p-4 transition-all"
                style={{
                  background: isNew ? 'rgba(0,212,255,0.04)' : '#0a0f1e',
                  border: `1px solid ${isNew ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
                }}>
                <EventTypeIcon type={ev.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-200 leading-relaxed">{ev.description}</p>
                  {ev.location && (
                    <span className="inline-block mt-1 text-xs px-1.5 py-0.5 rounded font-mono"
                      style={{ background: 'rgba(0,212,255,0.08)', color: '#00d4ff80' }}>
                      {ev.location}
                    </span>
                  )}
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-gray-600">{ev.timestamp}</p>
                  {isNew && (
                    <span className="text-xs font-bold" style={{ color: '#00d4ff' }}>NEW</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}