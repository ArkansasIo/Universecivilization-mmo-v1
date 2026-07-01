import type { TrainingQueueEntry, PersonnelPool } from '../../../data/units/types';

interface TrainingQueueProps {
  queue: TrainingQueueEntry[];
  pools: PersonnelPool[];
  getProgress: (entry: TrainingQueueEntry) => number;
  getTimeRemaining: (entry: TrainingQueueEntry) => string;
  onCancel: (index: number) => void;
}

export default function TrainingQueue({ queue, pools, getProgress, getTimeRemaining, onCancel }: TrainingQueueProps) {
  const totalTraining = queue.reduce((s, e) => s + e.count, 0);

  return (
    <div className="space-y-4">
      {/* Training Queue Panel */}
      <div className="bg-[#0B1929] border border-cyan-400/30 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-cyan-400/20 flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <i className="ri-time-line text-cyan-400 w-5 h-5 flex items-center justify-center" />
            Training Queue
          </h2>
          <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full font-bold">
            {queue.length} active
          </span>
        </div>

        <div className="p-4">
          {queue.length === 0 ? (
            <div className="text-center py-6">
              <i className="ri-inbox-line text-3xl text-gray-600 w-8 h-8 mx-auto flex items-center justify-center mb-2" />
              <p className="text-xs text-gray-600">No active training</p>
            </div>
          ) : (
            <div className="space-y-3">
              {queue.map((entry, idx) => {
                const progress = getProgress(entry);
                const timeLeft = getTimeRemaining(entry);
                return (
                  <div key={idx} className="bg-slate-800/60 rounded-xl p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-sm font-semibold text-white">{entry.unitName}</div>
                        <div className="text-xs text-gray-500">×{entry.count} units</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-amber-400 font-bold">{timeLeft}</span>
                        <button
                          onClick={() => onCancel(idx)}
                          className="w-6 h-6 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-full flex items-center justify-center cursor-pointer transition-all"
                        >
                          <i className="ri-close-line text-xs w-3 h-3 flex items-center justify-center" />
                        </button>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-right text-gray-600 mt-1">{Math.floor(progress)}%</div>
                  </div>
                );
              })}
            </div>
          )}

          {totalTraining > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Total in training:</span>
                <span className="text-cyan-400 font-bold">{totalTraining.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Personnel Pools */}
      <div className="bg-[#0B1929] border border-cyan-400/30 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-cyan-400/20">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <i className="ri-group-line text-emerald-400 w-5 h-5 flex items-center justify-center" />
            Personnel Pools
          </h2>
        </div>

        <div className="p-4 space-y-3">
          {pools.map(pool => {
            const fillPct = (pool.currentCount / pool.maxCount) * 100;
            const categoryColor = pool.category === 'civilian'
              ? 'text-emerald-400'
              : pool.category === 'military'
              ? 'text-red-400'
              : 'text-amber-400';

            const barColor = pool.category === 'civilian'
              ? 'from-emerald-600 to-teal-500'
              : pool.category === 'military'
              ? 'from-red-600 to-rose-500'
              : 'from-amber-500 to-yellow-600';

            return (
              <div key={pool.id} className="bg-slate-800/60 rounded-xl p-3">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <div className="text-xs font-semibold text-white leading-tight">{pool.name}</div>
                    <div className={`text-xs capitalize ${categoryColor}`}>{pool.category}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${categoryColor}`}>
                      {pool.currentCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">/{pool.maxCount.toLocaleString()}</div>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${barColor} transition-all`}
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
                {pool.status === 'untrained' && pool.growthRate > 0 && (
                  <div className="text-xs text-gray-600 mt-1">+{pool.growthRate}/min growth</div>
                )}
                {pool.availableForTraining > 0 && (
                  <div className="text-xs text-cyan-400 mt-1">{pool.availableForTraining.toLocaleString()} available</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
