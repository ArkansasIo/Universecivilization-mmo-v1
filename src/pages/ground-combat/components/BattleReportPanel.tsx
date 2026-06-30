import { BattleReport, BattleEvent } from '../../../hooks/useGroundCombat';

const EVENT_COLORS: Record<string, { icon: string; color: string }> = {
  advance:  { icon: 'ri-arrow-right-circle-line', color: 'text-emerald-400' },
  assault:  { icon: 'ri-sword-line',               color: 'text-red-400' },
  ability:  { icon: 'ri-flashlight-line',          color: 'text-amber-400' },
  casualty: { icon: 'ri-heart-pulse-line',         color: 'text-rose-400' },
  capture:  { icon: 'ri-flag-line',                color: 'text-sky-400' },
  info:     { icon: 'ri-information-line',         color: 'text-slate-400' },
  warning:  { icon: 'ri-alert-line',               color: 'text-orange-400' },
  victory:  { icon: 'ri-trophy-line',              color: 'text-amber-400' },
  defeat:   { icon: 'ri-close-circle-line',        color: 'text-red-500' },
};

const PHASE_LABELS: Record<string, string> = {
  'orbital-bombardment': 'Orbital Bombardment',
  landing:   'Planetary Landing',
  assault:   'Ground Assault',
  occupation:'Occupation',
  victory:   'Victory',
  defeat:    'Defeat',
  retreat:   'Retreat',
};

interface Props {
  report: BattleReport;
  onClose: () => void;
}

export default function BattleReportPanel({ report, onClose }: Props) {
  const isVictory = report.outcome === 'victory';
  const isPartial = report.outcome === 'partial';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className={`p-6 border-b border-slate-700 rounded-t-2xl ${
          isVictory ? 'bg-gradient-to-r from-amber-900/40 to-emerald-900/40' :
          isPartial ? 'bg-gradient-to-r from-amber-900/40 to-slate-900/40' :
          'bg-gradient-to-r from-red-900/40 to-slate-900/40'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 flex items-center justify-center rounded-xl text-2xl ${
                isVictory ? 'bg-amber-500/20 text-amber-400' :
                isPartial ? 'bg-orange-500/20 text-orange-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                <i className={isVictory ? 'ri-trophy-fill' : isPartial ? 'ri-flag-line' : 'ri-close-circle-fill'} />
              </div>
              <div>
                <div className={`text-xl font-bold ${isVictory ? 'text-amber-400' : isPartial ? 'text-orange-400' : 'text-red-400'}`}>
                  {isVictory ? 'VICTORY' : isPartial ? 'PARTIAL SUCCESS' : 'MISSION FAILED'}
                </div>
                <div className="text-slate-400 text-sm">Battle Report · Duration: {report.duration}</div>
              </div>
            </div>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer transition-colors">
              <i className="ri-close-line text-lg" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/60 rounded-xl p-4">
              <div className="text-xs text-slate-500 mb-1">Enemy Eliminated</div>
              <div className="text-red-400 text-xl font-bold">{report.enemyKilled.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-4">
              <div className="text-xs text-slate-500 mb-1">Own Casualties</div>
              <div className="text-rose-400 text-xl font-bold">{report.ownCasualties.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-4">
              <div className="text-xs text-slate-500 mb-1">Experience Gained</div>
              <div className="text-emerald-400 text-xl font-bold">+{report.experienceGained.toLocaleString()} XP</div>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-4">
              <div className="text-xs text-slate-500 mb-1">Planet Captured</div>
              <div className={`text-xl font-bold ${report.planetCaptured ? 'text-amber-400' : 'text-slate-500'}`}>
                {report.planetCaptured ? 'Yes' : 'No'}
              </div>
            </div>
          </div>

          {/* Loot */}
          {(report.resourcesLooted.metal > 0 || report.resourcesLooted.crystal > 0 || report.resourcesLooted.credits > 0) && (
            <div>
              <div className="text-sm font-semibold text-slate-300 mb-3">Resources Looted</div>
              <div className="flex gap-3 flex-wrap">
                {report.resourcesLooted.metal > 0 && (
                  <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2">
                    <i className="ri-copper-coin-line text-slate-300 text-sm" />
                    <span className="text-slate-200 text-sm">{report.resourcesLooted.metal.toLocaleString()} Metal</span>
                  </div>
                )}
                {report.resourcesLooted.crystal > 0 && (
                  <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2">
                    <i className="ri-gem-line text-cyan-400 text-sm" />
                    <span className="text-slate-200 text-sm">{report.resourcesLooted.crystal.toLocaleString()} Crystal</span>
                  </div>
                )}
                {report.resourcesLooted.credits > 0 && (
                  <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2">
                    <i className="ri-coins-line text-amber-400 text-sm" />
                    <span className="text-slate-200 text-sm">{report.resourcesLooted.credits.toLocaleString()} Credits</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Facilities */}
          {report.facilitiesCaptured.length > 0 && (
            <div>
              <div className="text-sm font-semibold text-slate-300 mb-3">Facilities Captured</div>
              <div className="flex flex-wrap gap-2">
                {report.facilitiesCaptured.map(f => (
                  <div key={f} className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-700/40 rounded-lg px-3 py-1">
                    <i className="ri-flag-line text-emerald-400 text-xs" />
                    <span className="text-emerald-300 text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Battle log */}
          <div>
            <div className="text-sm font-semibold text-slate-300 mb-3">Battle Log</div>
            <div className="bg-slate-950/60 rounded-xl border border-slate-800 divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
              {report.events.map(evt => {
                const style = EVENT_COLORS[evt.type] || EVENT_COLORS.info;
                return (
                  <div key={evt.id} className="flex items-start gap-3 px-4 py-2.5">
                    <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 ${style.color}`}>
                      <i className={`${style.icon} text-sm`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-medium ${style.color} mr-2`}>[{PHASE_LABELS[evt.phase] || evt.phase}]</span>
                      <span className="text-slate-300 text-xs">{evt.message}</span>
                    </div>
                    <span className="text-slate-600 text-xs flex-shrink-0">{evt.timestamp}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold transition-colors cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
