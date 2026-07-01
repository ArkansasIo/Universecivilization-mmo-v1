import { useState, useMemo } from 'react';
import { trainingTracks } from '../../data/units/personnel';
import { ALL_UNITS } from '../../data/units';
import type { TrainingTrack } from '../../data/units/types';
import { UNIT_CLASS_GRADIENTS } from '../../data/units/types';

// ── Mock building levels (in real game, read from player data) ──────────
const BUILDING_LEVELS: Record<string, number> = {
  'Barracks': 5,
  'Barracks Level 1': 5,
  'Barracks Level 2': 5,
  'Barracks Level 4': 5,
  'Research Lab': 6,
  'Research Lab Level 1': 6,
  'Research Lab Level 4': 6,
  'Mine': 4,
  'Mine Level 3': 4,
  'Refinery': 3,
  'Refinery Level 2': 3,
  'Medical Center': 3,
  'Medical Center Level 2': 3,
  'Training Ground': 4,
  'Training Ground Level 2': 4,
  'Training Ground Level 3': 4,
  'Hangar': 3,
  'Hangar Level 2': 3,
  'Simulator Bay': 2,
  'Simulator Bay Level 1': 2,
  'Special Ops Center': 2,
  'Special Ops Center Level 1': 2,
  'Special Ops Center Level 2': 2,
  'Command Center': 7,
  'Command Center Level 1': 7,
  'Command Center Level 3': 7,
  'Farm': 3,
  'Farm Level 2': 3,
  'Trade Post': 4,
  'Trade Post Level 3': 4,
  'Fusion Reactor': 3,
  'Fusion Reactor Level 2': 3,
  'Psi Training Center': 1,
  'Psi Training Center Level 3': 0,
  'Intelligence HQ': 3,
  'Intelligence HQ Level 2': 3,
  'Diplomatic Center': 4,
  'Diplomatic Center Level 1': 4,
  'Diplomatic Center Level 5': 0,
  'Security Station': 3,
  'Security Station Level 1': 3,
};

function isBuildingAvailable(req: string): boolean {
  return (BUILDING_LEVELS[req] || 0) > 0;
}

function isTrackUnlocked(track: TrainingTrack): boolean {
  if (!track.requirements.buildings || track.requirements.buildings.length === 0) return true;
  return track.requirements.buildings.every(b => isBuildingAvailable(b));
}

// Capacity per training track (units/day)
const TRACK_CAPACITY: Record<string, number> = {
  'track-basic-labor': 200,
  'track-mining-specialist': 30,
  'track-science': 15,
  'track-basic-military': 150,
  'track-special-ops': 5,
  'track-pilot': 20,
  'track-admin': 60,
  'track-diplomacy': 3,
};

const CATEGORY_ICONS: Record<string, string> = {
  civilian: 'ri-user-line',
  military: 'ri-sword-line',
  government: 'ri-government-line',
};
const CATEGORY_COLORS: Record<string, { text: string; border: string; bg: string }> = {
  civilian: { text: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-500/10' },
  military: { text: 'text-red-400', border: 'border-red-500/40', bg: 'bg-red-500/10' },
  government: { text: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-500/10' },
};

export default function TrainingCenterPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'civilian' | 'military' | 'government'>('all');
  const [selectedTrack, setSelectedTrack] = useState<TrainingTrack | null>(null);

  const filteredTracks = useMemo(() =>
    trainingTracks.filter(t => selectedCategory === 'all' || t.category === selectedCategory),
    [selectedCategory]
  );

  const unlocked = filteredTracks.filter(isTrackUnlocked);
  const locked = filteredTracks.filter(t => !isTrackUnlocked(t));

  const totalCapacity = Object.values(TRACK_CAPACITY).reduce((a, b) => a + b, 0);
  const activeCount = Object.values(activeQueues).reduce((a, b) => a + b, 0);

  function startTraining(trackId: string, count: number) {
    if (count <= 0) return;
    setActiveQueues(prev => ({ ...prev, [trackId]: (prev[trackId] || 0) + count }));
    setNotification(`Started training ${count} units on ${trainingTracks.find(t => t.id === trackId)?.name}`);
    setTimeout(() => setNotification(''), 3000);
  }

  function getCapacity(trackId: string) {
    return capacityOverrides[trackId] ?? TRACK_CAPACITY[trackId] ?? 10;
  }

  // Find units produced by each track
  function getTrackUnits(track: TrainingTrack) {
    return ALL_UNITS.filter(u =>
      u.category === track.category &&
      u.sector === track.sector &&
      u.class === track.finalClass
    ).slice(0, 3);
  }

  return (
    <div className="text-white">
      {/* Hero */}
      <div className="relative py-14 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://readdy.ai/api/search-image?query=futuristic%20training%20academy%20with%20multiple%20specialized%20facilities%20barracks%20flight%20simulators%20research%20labs%20and%20government%20academies%20all%20visible%20from%20aerial%20view%20sci-fi%20military%20training%20complex%20sprawling%20campus&width=1920&height=440&seq=traincenter2025&orientation=landscape"
            alt="Training Center"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-[#060f1e]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">Imperial Academy</div>
              <h1 className="text-5xl font-black uppercase text-white mb-2">Training Center</h1>
              <p className="text-gray-300">Manage all training tracks · Unlock via buildings · Set capacity limits</p>
            </div>
            <Link
              to="/units"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 rounded-xl text-sm font-semibold hover:bg-cyan-500/30 transition-all cursor-pointer whitespace-nowrap"
            >
              <i className="ri-team-line w-4 h-4 flex items-center justify-center" />
              View Personnel
            </Link>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center gap-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl px-4 py-3">
            <i className="ri-checkbox-circle-fill text-emerald-400 w-4 h-4 flex items-center justify-center" />
            <span className="text-sm text-emerald-300">{notification}</span>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Tracks', val: trainingTracks.length, color: 'text-white', icon: 'ri-route-line', border: 'border-slate-600/40' },
            { label: 'Unlocked', val: trainingTracks.filter(isTrackUnlocked).length, color: 'text-emerald-400', icon: 'ri-lock-unlock-line', border: 'border-emerald-500/30' },
            { label: 'Locked', val: trainingTracks.filter(t => !isTrackUnlocked(t)).length, color: 'text-red-400', icon: 'ri-lock-2-line', border: 'border-red-500/30' },
            { label: 'Total Capacity/day', val: totalCapacity, color: 'text-cyan-400', icon: 'ri-user-add-line', border: 'border-cyan-500/30' },
          ].map(s => (
            <div key={s.label} className={`bg-[#0B1929] border ${s.border} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-1">
                <i className={`${s.icon} text-sm ${s.color} w-4 h-4 flex items-center justify-center`} />
                <span className="text-xs text-gray-500">{s.label}</span>
              </div>
              <div className={`text-2xl font-black ${s.color}`}>{s.val.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Category Tabs */}
            <div className="flex gap-2 mb-5">
              {(['all', 'civilian', 'military', 'government'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer whitespace-nowrap capitalize ${
                    selectedCategory === cat
                      ? cat === 'all' ? 'border-cyan-500 bg-cyan-500/15 text-cyan-400'
                      : cat === 'civilian' ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                      : cat === 'military' ? 'border-red-500 bg-red-500/15 text-red-400'
                      : 'border-amber-500 bg-amber-500/15 text-amber-400'
                      : 'border-slate-700 text-gray-500 hover:border-slate-500'
                  }`}
                >
                  {cat !== 'all' && <i className={`${CATEGORY_ICONS[cat]} w-4 h-4 flex items-center justify-center`} />}
                  {cat === 'all' ? 'All Tracks' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* Unlocked Tracks */}
            {unlocked.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <i className="ri-lock-unlock-line w-4 h-4 flex items-center justify-center" />
                  Available Training Tracks ({unlocked.length})
                </h2>
                <div className="space-y-4">
                  {unlocked.map(track => {
                    const colors = CATEGORY_COLORS[track.category];
                    const cap = getCapacity(track.id);
                    const active = activeQueues[track.id] || 0;
                    const trackUnits = getTrackUnits(track);
                    const isSelected = selectedTrack?.id === track.id;

                    return (
                      <div
                        key={track.id}
                        className={`bg-[#0B1929] border rounded-2xl overflow-hidden transition-all ${
                          isSelected ? `${colors.border} ring-1 ring-${track.category === 'civilian' ? 'emerald' : track.category === 'military' ? 'red' : 'amber'}-500/30` : 'border-slate-700/60 hover:border-slate-600'
                        }`}
                      >
                        {/* Track Header */}
                        <div
                          className="p-5 cursor-pointer"
                          onClick={() => setSelectedTrack(isSelected ? null : track)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className={`w-11 h-11 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0`}>
                                <i className={`${CATEGORY_ICONS[track.category]} text-xl ${colors.text} w-6 h-6 flex items-center justify-center`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                  <h3 className="text-base font-bold text-white">{track.name}</h3>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} font-semibold capitalize`}>
                                    {track.category}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">{track.sector} · {track.jobType} · {track.totalDuration}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 flex-shrink-0">
                              <div className="text-right">
                                <div className="text-sm font-bold text-cyan-400">{cap}/day</div>
                                <div className="text-xs text-gray-600">capacity</div>
                              </div>
                              {active > 0 && (
                                <div className="text-right">
                                  <div className="text-sm font-bold text-amber-400">{active}</div>
                                  <div className="text-xs text-gray-600">training</div>
                                </div>
                              )}
                              <i className={`ri-arrow-down-s-line text-gray-400 transition-transform ${isSelected ? 'rotate-180' : ''} w-5 h-5 flex items-center justify-center`} />
                            </div>
                          </div>

                          {/* Phases Preview */}
                          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                            {track.phases.map((phase, i) => (
                              <div key={i} className="flex items-center gap-1">
                                <div className="text-xs bg-slate-800 border border-slate-600/60 rounded-lg px-2 py-1 text-gray-300">
                                  {phase.name}
                                  <span className="text-gray-600 ml-1">({phase.duration})</span>
                                </div>
                                {i < track.phases.length - 1 && <i className="ri-arrow-right-s-line text-gray-700 text-sm w-3 h-3 flex items-center justify-center" />}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Expanded Detail */}
                        {isSelected && (
                          <div className="border-t border-slate-700/60 p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Training Phases */}
                              <div>
                                <h4 className="text-sm font-bold text-cyan-400 mb-3">Training Phases</h4>
                                <div className="space-y-3">
                                  {track.phases.map((phase) => (
                                    <div key={phase.phase} className="bg-slate-800/60 rounded-xl p-3">
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold text-white">Phase {phase.phase}: {phase.name}</span>
                                        <span className="text-xs text-gray-500">{phase.duration}</span>
                                      </div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs text-gray-600">Pass rate:</span>
                                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                          <div
                                            className={`h-full ${phase.passRate >= 75 ? 'bg-emerald-500' : phase.passRate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                            style={{ width: `${phase.passRate}%` }}
                                          />
                                        </div>
                                        <span className={`text-xs font-bold ${phase.passRate >= 75 ? 'text-emerald-400' : phase.passRate >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                                          {phase.passRate}%
                                        </span>
                                      </div>
                                      {phase.unlockedSkills.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                          {phase.unlockedSkills.map(s => (
                                            <span key={s} className="text-xs bg-violet-500/15 text-violet-300 px-1.5 py-0.5 rounded">{s}</span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Capacity Control + Units Produced */}
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-bold text-cyan-400 mb-3">Capacity Management</h4>
                                  <div className="bg-slate-800/60 rounded-xl p-4 space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-gray-400">Daily Capacity</span>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => setCapacityOverrides(prev => ({ ...prev, [track.id]: Math.max(1, (prev[track.id] ?? cap) - 10) }))}
                                          className="w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center cursor-pointer text-sm"
                                        >
                                          <i className="ri-subtract-line w-3 h-3 flex items-center justify-center" />
                                        </button>
                                        <span className="text-white font-bold w-10 text-center">{cap}</span>
                                        <button
                                          onClick={() => setCapacityOverrides(prev => ({ ...prev, [track.id]: Math.min(500, (prev[track.id] ?? cap) + 10) }))}
                                          className="w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center cursor-pointer text-sm"
                                        >
                                          <i className="ri-add-line w-3 h-3 flex items-center justify-center" />
                                        </button>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-gray-400">Currently Training</span>
                                      <span className="text-amber-400 font-bold">{active}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-gray-400">Utilization</span>
                                      <span className={`font-bold ${active >= cap * 0.8 ? 'text-red-400' : active > 0 ? 'text-amber-400' : 'text-gray-500'}`}>
                                        {cap > 0 ? Math.round((active / cap) * 100) : 0}%
                                      </span>
                                    </div>
                                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full transition-all ${active >= cap * 0.8 ? 'bg-red-500' : 'bg-cyan-500'}`}
                                        style={{ width: `${Math.min((active / Math.max(cap, 1)) * 100, 100)}%` }}
                                      />
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                      {[10, 25, 50].map(n => (
                                        <button
                                          key={n}
                                          onClick={() => startTraining(track.id, Math.min(n, cap - active))}
                                          disabled={active >= cap}
                                          className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                                            active < cap
                                              ? `${colors.bg} ${colors.text} ${colors.border} hover:opacity-80`
                                              : 'bg-slate-700 text-gray-600 border-slate-600 cursor-not-allowed'
                                          }`}
                                        >
                                          +{n}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {trackUnits.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-bold text-cyan-400 mb-2">Produces Units</h4>
                                    <div className="space-y-2">
                                      {trackUnits.map(u => {
                                        const cg = UNIT_CLASS_GRADIENTS[u.class] || 'from-gray-500 to-slate-600';
                                        return (
                                          <div key={u.id} className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2">
                                            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${cg} flex items-center justify-center flex-shrink-0`}>
                                              <i className={`${u.icon} text-xs text-white w-4 h-4 flex items-center justify-center`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <div className="text-xs font-semibold text-white truncate">{u.name}</div>
                                              <div className="text-xs text-gray-600 capitalize">{u.class}</div>
                                            </div>
                                            <span className="text-xs text-gray-500">T{u.tier}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* Requirements */}
                                <div>
                                  <h4 className="text-sm font-bold text-cyan-400 mb-2">Requirements</h4>
                                  <div className="grid grid-cols-3 gap-1.5">
                                    {[
                                      { label: 'Metal', val: track.requirements.metal, color: 'text-yellow-400' },
                                      { label: 'Crystal', val: track.requirements.crystal, color: 'text-sky-400' },
                                      { label: 'Credits', val: track.requirements.credits, color: 'text-amber-400' },
                                    ].map(r => (
                                      <div key={r.label} className="bg-slate-800/60 rounded-lg p-2 text-center">
                                        <div className="text-xs text-gray-600 mb-0.5">{r.label}</div>
                                        <div className={`text-xs font-bold ${r.color}`}>{r.val.toLocaleString()}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Locked Tracks */}
            {locked.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <i className="ri-lock-2-line w-4 h-4 flex items-center justify-center" />
                  Locked Tracks — Upgrade Buildings to Unlock ({locked.length})
                </h2>
                <div className="space-y-3">
                  {locked.map(track => {
                    const missingBuildings = (track.requirements.buildings || []).filter(b => !isBuildingAvailable(b));
                    return (
                      <div key={track.id} className="bg-[#0B1929] border border-slate-700/40 rounded-2xl p-5 opacity-70">
                        <div className="flex items-start gap-4">
                          <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-600/50 flex items-center justify-center flex-shrink-0">
                            <i className="ri-lock-2-line text-gray-600 w-5 h-5 flex items-center justify-center" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-bold text-gray-400">{track.name}</h3>
                              <span className="text-xs text-gray-600 capitalize">({track.category})</span>
                            </div>
                            <div className="text-xs text-gray-600 mb-2">{track.sector} · {track.totalDuration}</div>
                            <div className="flex flex-wrap gap-1.5">
                              <span className="text-xs text-gray-600">Requires:</span>
                              {missingBuildings.map(b => (
                                <span key={b} className="text-xs px-2 py-0.5 bg-red-500/15 text-red-400 border border-red-500/25 rounded-lg">{b}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0 space-y-4">
            {/* Active Training Summary */}
            <div className="bg-[#0B1929] border border-cyan-400/30 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-cyan-400/20">
                <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <i className="ri-time-line w-4 h-4 flex items-center justify-center" />
                  Active Training
                </h2>
              </div>
              <div className="p-4">
                {Object.keys(activeQueues).length === 0 ? (
                  <div className="text-center py-4">
                    <i className="ri-inbox-line text-2xl text-gray-700 w-7 h-7 mx-auto flex items-center justify-center mb-2" />
                    <p className="text-xs text-gray-600">No active training</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(activeQueues).map(([id, count]) => {
                      const t = trainingTracks.find(x => x.id === id);
                      if (!t) return null;
                      const colors = CATEGORY_COLORS[t.category];
                      return (
                        <div key={id} className="flex items-center justify-between bg-slate-800/60 rounded-lg px-3 py-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-white truncate">{t.name}</div>
                            <div className={`text-xs capitalize ${colors.text}`}>{t.category}</div>
                          </div>
                          <span className="text-sm font-bold text-amber-400 ml-2">{count}</span>
                        </div>
                      );
                    })}
                    <div className="pt-2 border-t border-slate-700/50 flex justify-between text-xs text-gray-500">
                      <span>Total training:</span>
                      <span className="text-cyan-400 font-bold">{activeCount}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Building Requirements */}
            <div className="bg-[#0B1929] border border-cyan-400/30 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-cyan-400/20">
                <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <i className="ri-building-2-line w-4 h-4 flex items-center justify-center" />
                  Building Status
                </h2>
              </div>
              <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
                {Object.entries(BUILDING_LEVELS)
                  .filter(([k]) => !k.includes('Level '))
                  .map(([building, level]) => (
                    <div key={building} className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 truncate">{building}</span>
                      <span className={`font-bold ml-2 flex-shrink-0 ${level > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {level > 0 ? `Lv.${level}` : 'Not Built'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-[#0B1929] border border-cyan-400/30 rounded-2xl p-4">
              <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Quick Access</h2>
              <div className="space-y-2">
                {[
                  { to: '/units', label: 'Personnel Registry', icon: 'ri-team-line' },
                  { to: '/buildings', label: 'Buildings', icon: 'ri-building-line' },
                  { to: '/fleet', label: 'Fleet Command', icon: 'ri-ship-line' },
                ].map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-800/60 hover:bg-slate-700/60 rounded-lg text-sm text-gray-300 hover:text-white transition-all cursor-pointer"
                  >
                    <i className={`${link.icon} text-cyan-400 w-4 h-4 flex items-center justify-center`} />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
