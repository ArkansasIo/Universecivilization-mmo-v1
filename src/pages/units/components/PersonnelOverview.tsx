import type { EmpirePersonnel } from '../../../data/units/types';

interface PersonnelOverviewProps {
  personnel: EmpirePersonnel;
}

export default function PersonnelOverview({ personnel }: PersonnelOverviewProps) {
  const stats = [
    { label: 'Total Personnel', value: personnel.total.toLocaleString(), color: 'text-white', icon: 'ri-team-line', border: 'border-slate-500/40' },
    { label: 'Civilian', value: personnel.civilian.toLocaleString(), color: 'text-emerald-400', icon: 'ri-user-line', border: 'border-emerald-500/30' },
    { label: 'Military', value: personnel.military.toLocaleString(), color: 'text-red-400', icon: 'ri-sword-line', border: 'border-red-500/30' },
    { label: 'Government', value: personnel.government.toLocaleString(), color: 'text-amber-400', icon: 'ri-government-line', border: 'border-amber-500/30' },
    { label: 'Untrained', value: personnel.untrained.toLocaleString(), color: 'text-gray-400', icon: 'ri-user-2-line', border: 'border-gray-500/30' },
    { label: 'In Training', value: personnel.inTraining.toLocaleString(), color: 'text-orange-400', icon: 'ri-time-line', border: 'border-orange-500/30' },
    { label: 'Deployed', value: personnel.deployed.toLocaleString(), color: 'text-sky-400', icon: 'ri-send-plane-line', border: 'border-sky-500/30' },
    { label: 'Injured', value: personnel.injured.toLocaleString(), color: 'text-rose-400', icon: 'ri-heart-pulse-line', border: 'border-rose-500/30' },
  ];

  const empireStats = [
    { label: 'Combat Power', value: personnel.totalCombatPower.toLocaleString(), color: 'text-red-400', icon: 'ri-shield-flash-line' },
    { label: 'Productivity', value: personnel.totalProductivity.toLocaleString(), color: 'text-emerald-400', icon: 'ri-line-chart-line' },
    { label: 'Daily Food', value: `${personnel.dailyFoodUpkeep.toLocaleString()}/d`, color: 'text-orange-400', icon: 'ri-leaf-line' },
    { label: 'Daily Credits', value: `${personnel.dailyCreditUpkeep.toLocaleString()}/d`, color: 'text-amber-400', icon: 'ri-coin-line' },
    { label: 'Avg Morale', value: `${personnel.moraleAverage}%`, color: 'text-pink-400', icon: 'ri-emotion-line' },
  ];

  return (
    <div className="space-y-4">
      {/* Personnel Counts */}
      <div className="bg-[#0B1929] border border-cyan-400/30 rounded-2xl p-4">
        <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <i className="ri-bar-chart-line w-4 h-4 flex items-center justify-center" />
          Empire Personnel
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {stats.map(s => (
            <div key={s.label} className={`bg-slate-800/60 border ${s.border} rounded-xl p-3`}>
              <div className="flex items-center gap-1.5 mb-1">
                <i className={`${s.icon} text-xs ${s.color} w-4 h-4 flex items-center justify-center`} />
                <span className="text-xs text-gray-500">{s.label}</span>
              </div>
              <div className={`text-lg font-black ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Empire Performance */}
      <div className="bg-[#0B1929] border border-cyan-400/30 rounded-2xl p-4">
        <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <i className="ri-dashboard-line w-4 h-4 flex items-center justify-center" />
          Performance Metrics
        </h2>
        <div className="space-y-2">
          {empireStats.map(s => (
            <div key={s.label} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
              <div className="flex items-center gap-2">
                <i className={`${s.icon} text-sm ${s.color} w-4 h-4 flex items-center justify-center`} />
                <span className="text-xs text-gray-400">{s.label}</span>
              </div>
              <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Morale Bar */}
      <div className="bg-[#0B1929] border border-pink-400/20 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-pink-400">Empire Morale</span>
          <span className="text-xs text-pink-400 font-bold">{personnel.moraleAverage}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              personnel.moraleAverage >= 75 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
              personnel.moraleAverage >= 50 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
              'bg-gradient-to-r from-red-600 to-rose-500'
            }`}
            style={{ width: `${personnel.moraleAverage}%` }}
          />
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {personnel.moraleAverage >= 75 ? 'High — units perform above baseline' :
           personnel.moraleAverage >= 50 ? 'Average — normal performance' :
           'Low — productivity penalties active'}
        </div>
      </div>
    </div>
  );
}
