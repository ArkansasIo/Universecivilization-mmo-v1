import { useState, useMemo } from 'react';
import {
  universeLeaderboards,
  type EmpireEntry,
  rankColors,
  rankGlows,
  formatConquestPoints,
} from '@/data/universeLeaderboard';
import type { MyEmpireConfig } from '../types';

function RankBadge({ rank }: { rank: EmpireEntry['empireRank'] }) {
  const color = rankColors[rank];
  const glow = rankGlows[rank];
  const icons: Record<string, string> = {
    Iron: 'ri-shield-line', Bronze: 'ri-shield-fill', Silver: 'ri-shield-star-line',
    Gold: 'ri-shield-star-fill', Platinum: 'ri-vip-crown-line', Diamond: 'ri-vip-crown-fill',
    Mythic: 'ri-sword-fill', Cosmic: 'ri-planet-fill',
  };
  return (
    <span className="inline-flex items-center gap-1 rounded-full font-bold whitespace-nowrap px-2 py-0.5 text-xs" style={{ background: glow, border: `1px solid ${color}50`, color }}>
      <i className={`${icons[rank]} text-xs`}></i>{rank}
    </span>
  );
}

export default function MyEmpireSetupModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (cfg: MyEmpireConfig) => void;
}) {
  const [step, setStep] = useState<'universe' | 'empire'>('universe');
  const [selectedUniverseId, setSelectedUniverseId] = useState('u1');
  const [selectedEmpireId, setSelectedEmpireId] = useState('');
  const [search, setSearch] = useState('');

  const selectedUniverse = universeLeaderboards.find((u) => u.universeId === selectedUniverseId) ?? universeLeaderboards[0];

  const filteredEmpires = useMemo(() => {
    if (!search) return selectedUniverse.empires;
    const q = search.toLowerCase();
    return selectedUniverse.empires.filter(
      (e) => e.empireName.toLowerCase().includes(q) || e.commanderName.toLowerCase().includes(q)
    );
  }, [selectedUniverse, search]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
      <div
        className="relative flex flex-col rounded-2xl overflow-hidden"
        style={{ width: 560, maxHeight: '80vh', background: 'linear-gradient(135deg, #0d1526 0%, #0a0f1e 100%)', border: '1px solid rgba(0,212,255,0.25)', boxShadow: '0 0 60px rgba(0,212,255,0.12)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
          <div>
            <h2 className="text-base font-black" style={{ color: '#00d4ff' }}>
              <i className="ri-user-star-line mr-2"></i>Set My Empire
            </h2>
            <p className="text-xs mt-0.5" style={{ color: '#4a5568' }}>Pin your empire to always see your ranking at a glance</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', color: '#6b7a95', border: '1px solid rgba(255,255,255,0.08)' }}>
            <i className="ri-close-line text-sm"></i>
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 px-6 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {(['universe', 'empire'] as const).map((s, idx) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  background: step === s || (s === 'universe' && step === 'empire') ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${step === s || (s === 'universe' && step === 'empire') ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  color: step === s || (s === 'universe' && step === 'empire') ? '#00d4ff' : '#4a5568',
                }}
              >
                {s === 'universe' && step === 'empire' ? <i className="ri-check-line text-xs"></i> : idx + 1}
              </div>
              <span className="text-xs font-semibold capitalize" style={{ color: step === s ? '#00d4ff' : '#4a5568' }}>
                {s === 'universe' ? 'Choose Universe' : 'Choose Empire'}
              </span>
              {idx === 0 && <i className="ri-arrow-right-s-line text-xs" style={{ color: '#4a5568' }}></i>}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {step === 'universe' && (
            <div className="p-4 grid grid-cols-2 gap-2">
              {universeLeaderboards.map((u) => (
                <button
                  key={u.universeId}
                  onClick={() => setSelectedUniverseId(u.universeId)}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all text-left"
                  style={{
                    background: selectedUniverseId === u.universeId ? `${u.universeColor}15` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${selectedUniverseId === u.universeId ? u.universeColor + '50' : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: u.universeColor, boxShadow: `0 0 6px ${u.universeColor}` }}></div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate" style={{ color: selectedUniverseId === u.universeId ? u.universeColor : '#c8d4e8' }}>{u.universeName}</div>
                    <div className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>{u.universeClass} · {u.totalEmpires.toLocaleString()} empires</div>
                  </div>
                  {selectedUniverseId === u.universeId && <i className="ri-check-line text-xs ml-auto flex-shrink-0" style={{ color: u.universeColor }}></i>}
                </button>
              ))}
            </div>
          )}

          {step === 'empire' && (
            <div className="flex flex-col">
              <div className="px-4 pt-4 pb-2 flex-shrink-0">
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#4a5568' }}></i>
                  <input
                    type="text"
                    placeholder="Search your empire or commander name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg text-xs outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#c8d4e8' }}
                    autoFocus
                  />
                </div>
              </div>
              <div className="px-4 pb-4" style={{ scrollbarWidth: 'none' }}>
                {filteredEmpires.map((empire) => (
                  <button
                    key={empire.empireId}
                    onClick={() => setSelectedEmpireId(empire.empireId)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1.5 cursor-pointer transition-all text-left"
                    style={{
                      background: selectedEmpireId === empire.empireId ? `${empire.color}15` : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${selectedEmpireId === empire.empireId ? empire.color + '50' : 'rgba(255,255,255,0.05)'}`,
                    }}
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ background: 'rgba(255,255,255,0.06)', color: '#4a5568' }}>
                      {empire.rank}
                    </div>
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ border: `1px solid ${empire.color}40` }}>
                      <img src={empire.avatar} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate" style={{ color: selectedEmpireId === empire.empireId ? empire.color : '#c8d4e8' }}>{empire.empireName}</div>
                      <div className="text-xs" style={{ color: '#4a5568', fontSize: 10 }}>{empire.commanderName}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-semibold mb-0.5" style={{ color: '#e2e8f0' }}>{formatConquestPoints(empire.conquestPoints)}</div>
                      <RankBadge rank={empire.empireRank} />
                    </div>
                    {selectedEmpireId === empire.empireId && (
                      <i className="ri-checkbox-circle-fill text-sm flex-shrink-0" style={{ color: empire.color }}></i>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => step === 'empire' ? setStep('universe') : onClose()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#6b7a95', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <i className="ri-arrow-left-line text-xs"></i>
            {step === 'empire' ? 'Back' : 'Cancel'}
          </button>
          {step === 'universe' ? (
            <button
              onClick={() => { setSelectedEmpireId(''); setStep('empire'); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap"
              style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }}
            >
              Choose Empire <i className="ri-arrow-right-line text-xs"></i>
            </button>
          ) : (
            <button
              onClick={() => selectedEmpireId && onSave({ universeId: selectedUniverseId, empireId: selectedEmpireId })}
              disabled={!selectedEmpireId}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap"
              style={{
                background: selectedEmpireId ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.04)',
                color: selectedEmpireId ? '#00d4ff' : '#4a5568',
                border: `1px solid ${selectedEmpireId ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                cursor: selectedEmpireId ? 'pointer' : 'not-allowed',
              }}
            >
              <i className="ri-user-star-line text-xs"></i>
              Set as My Empire
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
