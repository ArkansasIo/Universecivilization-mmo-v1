import { useState } from 'react';

const MEGA_TYPES = [
  { name: 'Dyson Sphere', icon: 'ri-sun-line', color: '#c9a227', desc: 'Harvest an entire star\'s energy output', phases: 5, currentPhase: 1, progress: 26, system: 'Rigol', status: 'Under Construction', output: '+4000 Energy per phase', cost: '5000 Alloys / phase' },
  { name: 'Ring World', icon: 'ri-circle-line', color: '#4a9dd4', desc: 'A habitable ring encircling a star', phases: 4, currentPhase: 0, progress: 0, system: 'None', status: 'Planned', output: '+120 Districts per segment', cost: '10000 Alloys' },
  { name: 'Matter Decompressor', icon: 'ri-planet-line', color: '#a78bfa', desc: 'Disassemble planets for raw minerals', phases: 3, currentPhase: 0, progress: 0, system: 'None', status: 'Locked', output: '+500 Minerals/month', cost: '8000 Alloys' },
  { name: 'Science Nexus', icon: 'ri-flask-line', color: '#3aaa5e', desc: 'Massive research station', phases: 3, currentPhase: 0, progress: 0, system: 'None', status: 'Planned', output: '+1500 Research/month', cost: '6000 Alloys' },
  { name: 'Mega Shipyard', icon: 'ri-tools-line', color: '#e87a5a', desc: 'Largest shipyard in the galaxy', phases: 5, currentPhase: 0, progress: 0, system: 'None', status: 'Locked', output: '+20 Shipyard Slots', cost: '7000 Alloys' },
];

const STATUS_COLOR: Record<string, string> = {
  'Under Construction': '#4a9dd4',
  Planned: '#c9a227',
  Locked: '#3a4a5a',
  Completed: '#3aaa5e',
};

export default function MegastructuresPanel({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState(MEGA_TYPES[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="flex flex-col rounded-lg overflow-hidden" style={{ width: 600, height: 640, background: '#0e1520', border: '1px solid #1d2d40', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40', background: 'rgba(0,0,0,0.3)' }}>
          <div className="flex items-center gap-2">
            <i className="ri-building-4-line text-lg" style={{ color: '#c9a227' }}></i>
            <span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Megastructures</span>
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}>
            <i className="ri-close-line text-sm"></i>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* List */}
          <div className="w-44 flex-shrink-0 overflow-y-auto" style={{ borderRight: '1px solid #1d2d40' }}>
            {MEGA_TYPES.map(m => (
              <button key={m.name} onClick={() => setSelected(m)} className="w-full text-left px-3 py-3 cursor-pointer hover:bg-white/5 transition-colors" style={{ borderBottom: '1px solid #1d2d4080', borderLeft: selected.name === m.name ? `2px solid ${m.color}` : '2px solid transparent', background: selected.name === m.name ? `${m.color}08` : 'transparent' }}>
                <div className="flex items-center gap-2 mb-1">
                  <i className={`${m.icon} text-sm`} style={{ color: m.status === 'Locked' ? '#3a4a5a' : m.color }}></i>
                  <span className="text-xs font-semibold" style={{ color: m.status === 'Locked' ? '#4a5a6a' : '#c8d8e8' }}>{m.name}</span>
                </div>
                <span className="text-xs" style={{ color: STATUS_COLOR[m.status] }}>{m.status}</span>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1d2d40 transparent' }}>
            <div className="text-center mb-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: `${selected.color}15`, border: `2px solid ${selected.color}40` }}>
                <i className={`${selected.icon} text-4xl`} style={{ color: selected.status === 'Locked' ? '#3a4a5a' : selected.color }}></i>
              </div>
              <div className="text-lg font-bold mb-1" style={{ color: '#c8d8e8' }}>{selected.name}</div>
              <div className="text-xs" style={{ color: '#6b8aaa' }}>{selected.desc}</div>
            </div>

            {selected.status === 'Under Construction' && (
              <div className="rounded p-3 mb-4" style={{ background: 'rgba(74,157,212,0.08)', border: '1px solid rgba(74,157,212,0.25)' }}>
                <div className="flex justify-between text-xs mb-2">
                  <span style={{ color: '#4a9dd4' }}>Phase {selected.currentPhase} / {selected.phases}</span>
                  <span style={{ color: '#6b8aaa' }}>{selected.system}</span>
                </div>
                <div className="w-full h-2 rounded-full mb-1" style={{ background: '#1d2d40' }}>
                  <div className="h-2 rounded-full" style={{ width: `${selected.progress}%`, background: selected.color }}></div>
                </div>
                <div className="text-xs" style={{ color: '#6b8aaa' }}>{selected.progress}% complete</div>
              </div>
            )}

            <div className="space-y-3">
              {[
                { label: 'System', value: selected.system, icon: 'ri-star-line' },
                { label: 'Status', value: selected.status, icon: 'ri-information-line' },
                { label: 'Output', value: selected.output, icon: 'ri-bar-chart-line' },
                { label: 'Cost', value: selected.cost, icon: 'ri-coins-line' },
                { label: 'Phases', value: `${selected.phases} phases`, icon: 'ri-progress-3-line' },
              ].map(d => (
                <div key={d.label} className="flex items-center justify-between rounded p-2" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #1d2d40' }}>
                  <div className="flex items-center gap-2">
                    <i className={`${d.icon} text-xs`} style={{ color: '#6b8aaa' }}></i>
                    <span className="text-xs" style={{ color: '#6b8aaa' }}>{d.label}</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: '#c8d8e8' }}>{d.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              {selected.status === 'Planned' && (
                <button className="w-full py-2 rounded text-sm font-semibold cursor-pointer" style={{ background: `${selected.color}15`, border: `1px solid ${selected.color}40`, color: selected.color }}>
                  <i className="ri-hammer-line mr-2"></i>Begin Construction
                </button>
              )}
              {selected.status === 'Under Construction' && (
                <>
                  <button className="w-full py-2 rounded text-sm font-semibold cursor-pointer" style={{ background: 'rgba(58,170,94,0.12)', border: '1px solid rgba(58,170,94,0.3)', color: '#3aaa5e' }}>
                    <i className="ri-arrow-up-line mr-2"></i>Advance Phase
                  </button>
                  <button className="w-full py-2 rounded text-sm font-semibold cursor-pointer" style={{ background: 'rgba(232,122,90,0.08)', border: '1px solid rgba(232,122,90,0.2)', color: '#e87a5a' }}>
                    <i className="ri-pause-line mr-2"></i>Pause Construction
                  </button>
                </>
              )}
              {selected.status === 'Locked' && (
                <div className="text-center py-3 text-xs" style={{ color: '#4a5a6a' }}>
                  <i className="ri-lock-line mr-1"></i>Research Mega-Engineering to unlock
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-3 flex justify-end flex-shrink-0" style={{ borderTop: '1px solid #1d2d40' }}>
          <button onClick={onClose} className="px-4 py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1d2d40', color: '#6b8aaa' }}>Close</button>
        </div>
      </div>
    </div>
  );
}
