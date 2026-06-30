import { useGroundCombat, MissionType, AVAILABLE_UNITS_FOR_GROUND, TARGET_PLANETS, TERRAIN_MODIFIERS, MISSION_TYPE_LABELS } from '../../hooks/useGroundCombat';
import PlanetCard from './components/PlanetCard';
import UnitAssignRow from './components/UnitAssignRow';
import BattleReportPanel from './components/BattleReportPanel';

const ROLE_LABELS: Record<string, string> = {
  vanguard: 'Vanguard',
  'shock-assault': 'Shock Assault',
  'special-ops': 'Special Ops',
  'fire-support': 'Fire Support',
  command: 'Command',
  reserve: 'Reserve',
};

const MISSION_ICONS: Record<MissionType, string> = {
  'full-invasion':    'ri-sword-fill',
  'raid':             'ri-run-line',
  'sabotage':         'ri-fire-fill',
  'liberation':       'ri-hand-heart-line',
  'capture-facility': 'ri-building-2-line',
  'assassination':    'ri-user-search-line',
  'guerrilla':        'ri-footprint-line',
};

const MISSION_DESCRIPTIONS: Record<MissionType, string> = {
  'full-invasion':    'Capture the entire planet with full ground forces.',
  'raid':             'Strike fast, loot resources, and withdraw.',
  'sabotage':         'Destroy key infrastructure targets.',
  'liberation':       'Free allied population from enemy control.',
  'capture-facility': 'Seize a specific strategic installation.',
  'assassination':    'Eliminate enemy commanders.',
  'guerrilla':        'Long-term resistance campaign.',
};

const OUTCOME_STYLES = {
  victory: 'bg-emerald-500/10 border-emerald-600/40 text-emerald-400',
  partial: 'bg-amber-500/10 border-amber-600/40 text-amber-400',
  defeat:  'bg-red-500/10 border-red-600/40 text-red-400',
};

export default function GroundCombatPage() {
  const gc = useGroundCombat();
  const {
    activeTab, setActiveTab,
    selectedPlanet, setSelectedPlanet,
    selectedMission, setSelectedMission,
    assignedUnits, unitCounts,
    orbitalSupport, setOrbitalSupport,
    activeMissions, battleReports,
    simulating, showReport, setShowReport,
    totalCombatPower, successChance,
    assignUnit, removeUnit,
    launchMission,
  } = gc;

  const canLaunch = !!selectedPlanet && assignedUnits.length > 0 && !simulating;

  const successColor =
    successChance >= 75 ? 'text-emerald-400' :
    successChance >= 50 ? 'text-amber-400' :
    successChance >= 30 ? 'text-orange-400' :
    'text-red-400';

  const tabs = [
    { id: 'briefing', label: 'Briefing & Target', icon: 'ri-radar-line' },
    { id: 'deploy',   label: 'Deploy Forces',     icon: 'ri-user-star-line' },
    { id: 'active',   label: 'Active Operations', icon: 'ri-sword-line', badge: activeMissions.length },
    { id: 'history',  label: 'Battle History',    icon: 'ri-history-line', badge: battleReports.length },
  ] as const;

  return (
    <div className="min-h-screen bg-[#080b0f] text-slate-200">
      {/* Hero banner */}
      <div className="relative overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=massive%20planetary%20invasion%20fleet%20descending%20through%20clouds%20soldiers%20dropping%20from%20orbit%20military%20dropships%20explosions%20planetary%20assault%20epic%20science%20fiction%20cinematic%20widescreen%20dramatic%20lighting&width=1400&height=320&seq=groundcombat-hero&orientation=landscape"
          alt="Ground Combat"
          className="w-full h-56 object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 flex items-center justify-center bg-red-500/20 rounded-xl border border-red-500/40">
                <i className="ri-sword-fill text-red-400 text-xl" />
              </div>
              <h1 className="text-3xl font-bold text-white">Ground Combat Command</h1>
            </div>
            <p className="text-slate-400 text-sm max-w-xl">
              Assign trained infantry, shock troopers, and special ops units to planetary invasion missions. Plan your assault, deploy your forces, and claim victory on the ground.
            </p>
            <div className="flex gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-xs font-medium">{activeMissions.filter(m => m.status === 'active').length} Active Missions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-amber-400 rounded-full" />
                <span className="text-amber-400 text-xs font-medium">{AVAILABLE_UNITS_FOR_GROUND.reduce((s, u) => s + u.count, 0).toLocaleString()} Units Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-30 bg-[#080b0f]/95 backdrop-blur-sm border-b border-[#1e2a36]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-0">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as typeof activeTab)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === t.id
                    ? 'border-red-500 text-red-400'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className={`${t.icon} text-sm`} />
                </div>
                {t.label}
                {'badge' in t && (t.badge as number) > 0 && (
                  <span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full min-w-5 text-center">
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ═══ TAB: BRIEFING & TARGET ═══════════════════════════════════ */}
        {activeTab === 'briefing' && (
          <div className="space-y-8">
            {/* Mission Type */}
            <div>
              <h2 className="text-lg font-bold text-slate-100 mb-4">Select Mission Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(Object.entries(MISSION_TYPE_LABELS) as [MissionType, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedMission(key)}
                    className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      selectedMission === key
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-[#1e2a36] bg-[#080b0f] hover:border-[#d4a853]/30'
                    }`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center mb-2">
                      <i className={`${MISSION_ICONS[key]} text-xl ${selectedMission === key ? 'text-red-400' : 'text-slate-500'}`} />
                    </div>
                    <div className={`text-sm font-semibold mb-1 ${selectedMission === key ? 'text-red-300' : 'text-slate-300'}`}>{label}</div>
                    <div className="text-xs text-slate-500">{MISSION_DESCRIPTIONS[key]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Selection */}
            <div>
              <h2 className="text-lg font-bold text-slate-100 mb-4">Select Target Planet</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {TARGET_PLANETS.map(planet => (
                  <PlanetCard
                    key={planet.id}
                    planet={planet}
                    selected={selectedPlanet?.id === planet.id}
                    onSelect={() => setSelectedPlanet(planet.id === selectedPlanet?.id ? null : planet)}
                  />
                ))}
              </div>
            </div>

            {/* Planet Detail Briefing */}
            {selectedPlanet && (
              <div className="bg-[#080b0f] rounded-2xl border border-[#1e2a36] overflow-hidden">
                <div className="relative h-48">
                  <img src={selectedPlanet.image} alt={selectedPlanet.name} className="w-full h-full object-cover object-top" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
                  <div className="absolute inset-0 flex items-end p-6">
                    <div>
                      <div className="text-2xl font-bold text-white">{selectedPlanet.name}</div>
                      <div className="text-slate-400 text-sm">{selectedPlanet.system} · {selectedPlanet.coordinates} · {selectedPlanet.faction}</div>
                    </div>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Defense Rating</div>
                    <div className="text-2xl font-bold text-red-400">{selectedPlanet.defenseRating}/100</div>
                    <div className="h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${selectedPlanet.defenseRating}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Garrison Strength</div>
                    <div className="text-2xl font-bold text-rose-400">{selectedPlanet.garrisonStrength.toLocaleString()}</div>
                    <div className="text-xs text-slate-500 mt-1">enemy troops</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Strategic Value</div>
                    <div className="text-2xl font-bold text-amber-400">{selectedPlanet.strategicValue}/100</div>
                    <div className="text-xs text-slate-500 mt-1">high priority</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Shield Strength</div>
                    <div className="text-2xl font-bold text-cyan-400">{selectedPlanet.shieldStrength}%</div>
                    <div className="text-xs text-slate-500 mt-1">orbital shields</div>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <div className="text-xs text-slate-500 mb-2">Defense Modifiers</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlanet.defenseModifiers.map(mod => (
                      <span key={mod} className="text-xs bg-red-500/10 border border-red-700/40 text-red-300 px-3 py-1 rounded-full">
                        {mod}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-slate-500">Terrain modifier: <span className={
                    TERRAIN_MODIFIERS[selectedPlanet.terrain].attackMod < 0 ? 'text-red-400' : 'text-emerald-400'
                  }>
                    {TERRAIN_MODIFIERS[selectedPlanet.terrain].attackMod > 0 ? '+' : ''}{Math.round(TERRAIN_MODIFIERS[selectedPlanet.terrain].attackMod * 100)}% Attack
                  </span></div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab('deploy')}
                disabled={!selectedPlanet}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold transition-colors cursor-pointer"
              >
                <i className="ri-arrow-right-circle-line" />
                Proceed to Unit Deployment
              </button>
            </div>
          </div>
        )}

        {/* ═══ TAB: DEPLOY FORCES ═══════════════════════════════════════ */}
        {activeTab === 'deploy' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Unit roster */}
            <div className="xl:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-100">Available Units</h2>
                <span className="text-slate-500 text-sm">{AVAILABLE_UNITS_FOR_GROUND.length} unit types ready</span>
              </div>
              <div className="space-y-3">
                {AVAILABLE_UNITS_FOR_GROUND.map(unit => (
                  <UnitAssignRow
                    key={unit.unitId}
                    unit={unit}
                    assigned={unitCounts[unit.unitId] || 0}
                    onAssign={(count) => assignUnit(unit, count)}
                    onRemove={() => removeUnit(unit.unitId)}
                  />
                ))}
              </div>
            </div>

            {/* Mission summary sidebar */}
            <div className="space-y-4">
              {/* Target planet */}
              {selectedPlanet ? (
                <div className="bg-[#080b0f] rounded-xl border border-[#1e2a36] overflow-hidden">
                  <div className="relative h-32">
                    <img src={selectedPlanet.image} alt={selectedPlanet.name} className="w-full h-full object-cover object-top" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <div className="text-white font-bold">{selectedPlanet.name}</div>
                      <div className="text-slate-400 text-xs">{selectedPlanet.coordinates}</div>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Mission Type</span>
                      <span className="text-slate-200 font-medium">{MISSION_TYPE_LABELS[selectedMission]}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Enemy Garrison</span>
                      <span className="text-red-400 font-bold">{selectedPlanet.garrisonStrength.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/50 rounded-xl border border-red-700/40 p-4 text-center">
                  <i className="ri-alert-line text-red-400 text-2xl mb-2" />
                  <div className="text-red-400 text-sm font-medium">No target selected</div>
                  <button onClick={() => setActiveTab('briefing')} className="mt-2 text-xs text-slate-400 underline cursor-pointer">Go back to briefing</button>
                </div>
              )}

              {/* Orbital support toggle */}
              <div className="bg-[#080b0f] rounded-xl border border-[#1e2a36] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm font-semibold text-slate-200">Orbital Support</div>
                    <div className="text-xs text-slate-500">Naval bombardment before landing</div>
                  </div>
                  <button
                    onClick={() => setOrbitalSupport(!orbitalSupport)}
                    className={`w-12 h-6 rounded-full transition-all cursor-pointer relative ${orbitalSupport ? 'bg-sky-500' : 'bg-slate-700'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${orbitalSupport ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
                {orbitalSupport && (
                  <div className="text-xs text-sky-400 bg-sky-400/10 border border-sky-700/30 rounded-lg px-3 py-2">
                    +12% success chance · Destroys 12% enemy garrison pre-landing
                  </div>
                )}
              </div>

              {/* Assigned units summary */}
              <div className="bg-[#080b0f] rounded-xl border border-[#1e2a36] p-4">
                <div className="text-sm font-semibold text-slate-200 mb-3">Assigned Forces</div>
                {assignedUnits.length === 0 ? (
                  <div className="text-slate-500 text-xs text-center py-4">No units assigned yet</div>
                ) : (
                  <div className="space-y-2">
                    {assignedUnits.map(u => (
                      <div key={u.unitId} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 flex items-center justify-center">
                            <i className={`${u.icon} text-amber-400 text-sm`} />
                          </div>
                          <span className="text-slate-300 text-xs truncate max-w-28">{u.unitName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 text-xs font-bold">{u.count.toLocaleString()}</span>
                          <span className="text-slate-600 text-xs">·</span>
                          <span className="text-rose-400 text-xs">{ROLE_LABELS[u.role]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Totals */}
                {assignedUnits.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Total Troops</span>
                      <span className="text-slate-200 font-bold">
                        {assignedUnits.reduce((s, u) => s + u.count, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Combined Power</span>
                      <span className="text-red-400 font-bold">{totalCombatPower.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Success prediction */}
              {assignedUnits.length > 0 && selectedPlanet && (
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
                  <div className="text-sm font-semibold text-slate-200 mb-3">Mission Prediction</div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-500 text-sm">Success Chance</span>
                    <span className={`text-2xl font-bold ${successColor}`}>{successChance}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        successChance >= 75 ? 'bg-emerald-500' :
                        successChance >= 50 ? 'bg-amber-500' :
                        successChance >= 30 ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${successChance}%` }}
                    />
                  </div>
                  <div className="mt-3 text-xs text-slate-500">
                    {successChance >= 75
                      ? 'High confidence. Victory is very likely.'
                      : successChance >= 50
                      ? 'Moderate risk. Consider reinforcing assault.'
                      : 'Dangerous mission. Heavy casualties expected.'}
                  </div>
                </div>
              )}

              {/* Launch button */}
              <button
                onClick={launchMission}
                disabled={!canLaunch}
                className="w-full py-4 rounded-xl font-bold text-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white"
              >
                {simulating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Launching Invasion...
                  </>
                ) : (
                  <>
                    <i className="ri-sword-fill text-xl" />
                    Launch Invasion
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ═══ TAB: ACTIVE OPERATIONS ═══════════════════════════════════ */}
        {activeTab === 'active' && (
          <div className="space-y-6">
            {simulating && (
              <div className="bg-amber-500/10 border border-amber-600/40 rounded-xl p-5 flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <div className="w-6 h-6 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                </div>
                <div>
                  <div className="text-amber-400 font-semibold">Invasion In Progress</div>
                  <div className="text-amber-300/70 text-sm">Ground forces are engaged. Awaiting battle resolution...</div>
                </div>
              </div>
            )}

            {activeMissions.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <i className="ri-radar-line text-5xl text-slate-700" />
                </div>
                <div className="text-slate-500 text-lg mb-2">No Active Operations</div>
                <div className="text-slate-600 text-sm">Launch an invasion from the Briefing tab to see it here.</div>
                <button onClick={() => setActiveTab('briefing')} className="mt-4 px-6 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-700/40 text-sm cursor-pointer transition-colors">
                  Start a Mission
                </button>
              </div>
            ) : (
              <div className="grid gap-5">
                {activeMissions.map(m => (
                  <div key={m.id} className="bg-[#080b0f] rounded-2xl border border-[#1e2a36] overflow-hidden">
                    <div className="relative h-40">
                      <img src={m.targetPlanet.image} alt={m.targetPlanet.name} className="w-full h-full object-cover object-top" />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 to-slate-900/30" />
                      <div className="absolute inset-0 p-5 flex items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                              m.status === 'active' ? 'bg-amber-400/20 text-amber-400' :
                              m.status === 'completed' ? 'bg-emerald-400/20 text-emerald-400' :
                              'bg-red-400/20 text-red-400'
                            }`}>
                              {m.status === 'active' ? 'IN PROGRESS' : m.status === 'completed' ? 'COMPLETED' : 'FAILED'}
                            </span>
                            <span className="text-slate-500 text-xs">{MISSION_TYPE_LABELS[m.missionType]}</span>
                          </div>
                          <div className="text-white text-xl font-bold">{m.targetPlanet.name}</div>
                          <div className="text-slate-400 text-sm">{m.targetPlanet.system} · {m.targetPlanet.faction}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500 mb-1">Success Chance</div>
                          <div className={`text-3xl font-bold ${
                            m.successChance >= 75 ? 'text-emerald-400' :
                            m.successChance >= 50 ? 'text-amber-400' :
                            'text-red-400'
                          }`}>{m.successChance}%</div>
                          <div className="text-slate-500 text-xs mt-1">Est. {m.estimatedDuration}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="text-xs text-slate-500 mb-3">Deployed Forces</div>
                      <div className="flex flex-wrap gap-3">
                        {m.assignedUnits.map(u => (
                          <div key={u.unitId} className="flex items-center gap-2 bg-slate-900/60 rounded-lg px-3 py-2">
                            <div className="w-5 h-5 flex items-center justify-center">
                              <i className={`${u.icon} text-amber-400 text-sm`} />
                            </div>
                            <span className="text-slate-300 text-xs">{u.unitName}</span>
                            <span className="text-amber-400 text-xs font-bold">×{u.count.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      {m.orbitalSupport && (
                        <div className="mt-3 flex items-center gap-2 text-sky-400 text-xs">
                          <div className="w-4 h-4 flex items-center justify-center">
                            <i className="ri-ship-line" />
                          </div>
                          Orbital support active
                        </div>
                      )}

                      {(m.status === 'completed' || m.status === 'failed') && battleReports.length > 0 && (
                        <div className="mt-4">
                          <button
                            onClick={() => {
                              const rep = battleReports.find(r => r.missionId === m.id);
                              if (rep) setShowReport(rep);
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium transition-colors cursor-pointer"
                          >
                            <i className="ri-file-list-3-line" />
                            View Battle Report
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ TAB: BATTLE HISTORY ══════════════════════════════════════ */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-100">Battle History</h2>
              <span className="text-slate-500 text-sm">{battleReports.length} reports on record</span>
            </div>

            {battleReports.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <i className="ri-history-line text-5xl text-slate-700" />
                </div>
                <div className="text-slate-500 text-lg">No Battle Records</div>
                <div className="text-slate-600 text-sm mt-1">Complete an invasion mission to see reports here.</div>
              </div>
            ) : (
              <div className="grid gap-4">
                {battleReports.map((r, idx) => (
                  <div key={r.missionId} className={`rounded-xl border p-5 ${OUTCOME_STYLES[r.outcome]}`}>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 flex items-center justify-center rounded-lg text-lg ${
                          r.outcome === 'victory' ? 'bg-emerald-500/20 text-emerald-400' :
                          r.outcome === 'partial' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          <i className={r.outcome === 'victory' ? 'ri-trophy-fill' : r.outcome === 'partial' ? 'ri-flag-line' : 'ri-close-circle-fill'} />
                        </div>
                        <div>
                          <div className={`font-bold ${
                            r.outcome === 'victory' ? 'text-emerald-300' :
                            r.outcome === 'partial' ? 'text-amber-300' :
                            'text-red-300'
                          }`}>
                            {r.outcome === 'victory' ? 'Victory' : r.outcome === 'partial' ? 'Partial Success' : 'Defeat'}
                          </div>
                          <div className="text-slate-400 text-xs">Report #{battleReports.length - idx} · Duration: {r.duration}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <div className="text-xs text-slate-500">Enemy KIA</div>
                          <div className="font-bold text-red-400">{r.enemyKilled.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Casualties</div>
                          <div className="font-bold text-rose-400">{r.ownCasualties.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">XP Gained</div>
                          <div className="font-bold text-emerald-400">+{r.experienceGained.toLocaleString()}</div>
                        </div>
                        <button
                          onClick={() => setShowReport(r)}
                          className="px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer border border-slate-700 whitespace-nowrap"
                        >
                          Full Report
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Battle Report Modal */}
      {showReport && (
        <BattleReportPanel report={showReport} onClose={() => setShowReport(null)} />
      )}
    </div>
  );
}
