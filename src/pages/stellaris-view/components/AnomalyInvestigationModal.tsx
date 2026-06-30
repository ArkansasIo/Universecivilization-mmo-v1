import { useState, useCallback } from 'react';
import type { StellarisAnomaly, AnomalyCategory, AnomalyDifficulty } from '@/hooks/useStellarisAnomalies';

interface AnomalyInvestigationModalProps {
  anomaly: StellarisAnomaly;
  investigating: string | null;
  investigationProgress: number;
  getCategoryColor: (cat: AnomalyCategory) => string;
  getDifficultyColor: (diff: AnomalyDifficulty) => string;
  onStartInvestigation: (anomalyId: string, branchId: string) => void;
  onClose: () => void;
}

const ANOMALY_ICONS: Record<AnomalyCategory, string> = {
  precursor: 'ri-flask-line',
  spatial: 'ri-planet-line',
  biological: 'ri-seedling-line',
  technological: 'ri-microchip-line',
  gravitational: 'ri-contrast-2-line',
  temporal: 'ri-time-line',
  psionic: 'ri-brain-line',
  cosmic: 'ri-star-line',
};

export default function AnomalyInvestigationModal({
  anomaly, investigating, investigationProgress,
  getCategoryColor, getDifficultyColor,
  onStartInvestigation, onClose,
}: AnomalyInvestigationModalProps) {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const categoryColor = getCategoryColor(anomaly.category);

  const handleInvestigate = useCallback(() => {
    if (!selectedBranch) return;
    onStartInvestigation(anomaly.id, selectedBranch);
  }, [anomaly.id, selectedBranch, onStartInvestigation]);

  const isInvestigating = investigating === anomaly.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-[500px] max-h-[80vh] overflow-y-auto rounded-2xl"
        style={{ background: 'rgba(2,4,12,0.97)', border: `1px solid ${categoryColor}40` }}>
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ background: categoryColor }}></div>
            <h3 className="text-base font-bold text-white">Anomaly Investigation</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
            <i className="ri-close-line"></i>
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
              style={{ background: `${categoryColor}20`, color: categoryColor }}>
              <i className={ANOMALY_ICONS[anomaly.category]}></i>
            </div>
            <div>
              <h4 className="text-base font-bold text-white">{anomaly.name}</h4>
              <p className="text-xs text-gray-400">{anomaly.category} anomaly in {anomaly.systemName}</p>
            </div>
            <div className="ml-auto">
              <span className="text-xs px-2 py-1 rounded capitalize font-medium"
                style={{ background: `${getDifficultyColor(anomaly.difficulty)}20`, color: getDifficultyColor(anomaly.difficulty) }}>
                {anomaly.difficulty}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-300 mb-5 leading-relaxed">{anomaly.description}</p>

          {isInvestigating ? (
            <div className="space-y-3">
              <p className="text-amber-400 text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Investigating...
              </p>
              <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round(investigationProgress * 100)}%`, background: `linear-gradient(90deg, ${categoryColor}, #a78bfa)` }} />
              </div>
              <p className="text-xs text-gray-500">{Math.round(investigationProgress * 100)}% complete</p>
            </div>
          ) : anomaly.status === 'completed' && anomaly.outcome ? (
            <div className="space-y-3">
              <div className="rounded-xl p-4" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <p className="text-green-400 font-semibold text-sm mb-1">
                  <i className="ri-checkbox-circle-line mr-1"></i>Investigation Complete
                </p>
                <p className="text-gray-300 text-sm">{anomaly.outcome.description}</p>
                {Object.entries(anomaly.outcome.effect).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(anomaly.outcome.effect).map(([key, val]) => (
                      <span key={key} className="text-xs px-2 py-0.5 rounded"
                        style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>
                        {key}: +{val}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : anomaly.status === 'failed' ? (
            <div className="rounded-xl p-4" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
              <p className="text-red-400 font-semibold text-sm">
                <i className="ri-error-warning-line mr-1"></i>Investigation Failed
              </p>
              <p className="text-gray-400 text-sm mt-1">The anomaly was too complex or dangerous to fully investigate.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Choose Investigation Approach</p>
              {anomaly.branches.map(branch => (
                <button
                  key={branch.id}
                  onClick={() => setSelectedBranch(branch.id)}
                  className="w-full text-left rounded-xl p-4 transition-all cursor-pointer"
                  style={{
                    background: selectedBranch === branch.id ? `${categoryColor}12` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${selectedBranch === branch.id ? `${categoryColor}50` : 'rgba(255,255,255,0.06)'}`,
                  }}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-white">{branch.label}</p>
                    <span className="text-xs px-2 py-0.5 rounded"
                      style={{
                        background: branch.successChance > 0.7 ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.15)',
                        color: branch.successChance > 0.7 ? '#4ade80' : '#fbbf24',
                      }}>
                      {Math.round(branch.successChance * 100)}% success
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{branch.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {branch.outcomes.map((outcome, oi) => (
                      <span key={oi} className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{
                          background: outcome.type === 'negative_event' ? 'rgba(248,113,113,0.1)' : 'rgba(96,165,250,0.1)',
                          color: outcome.type === 'negative_event' ? '#f87171' : '#60a5fa',
                        }}>
                        {outcome.label}
                      </span>
                    ))}
                  </div>
                </button>
              ))}

              <button
                onClick={handleInvestigate}
                disabled={!selectedBranch}
                className="w-full py-3 rounded-xl text-sm font-bold cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: selectedBranch ? `linear-gradient(135deg, ${categoryColor}, #a78bfa)` : 'rgba(255,255,255,0.05)',
                  color: selectedBranch ? '#fff' : '#666',
                }}>
                <i className="ri-search-line mr-1.5"></i>
                Begin Investigation
              </button>
            </div>
          )}

          {anomaly.resultLog.length > 0 && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Investigation Log</p>
              <div className="space-y-1">
                {anomaly.resultLog.map((log, i) => (
                  <p key={i} className="text-xs text-gray-400 flex items-start gap-2">
                    <span className="text-gray-600 mt-0.5">•</span>
                    {log}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
