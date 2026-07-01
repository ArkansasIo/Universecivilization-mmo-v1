import { useState } from 'react';

const TABS = ['Construction Ships', 'Build Queue'];

const SHIPS = [
  { name: 'ISS Builder', location: 'Alpha Centauri', status: 'Building', task: 'Starbase', progress: 100, color: '#3aaa5e' },
  { name: 'ISS Prodigy', location: 'Tau Ceti', status: 'Building', task: 'Defense Platform', progress: 100, color: '#3aaa5e' },
  { name: 'ISS Makona', location: 'Vega', status: 'Idle', task: 'None', progress: 100, color: '#c9a227' },
];

const BUILD_QUEUE = [
  { item: 'Starbase Module: Shipyard', system: 'Epsilon Eridani', eta: '45 days', cost: '100 Alloys', progress: 62 },
  { item: 'Defense Platform', system: 'Sol', eta: '28 days', cost: '150 Alloys', progress: 78 },
  { item: 'Megastructure: Dyson Sphere Phase 1', system: 'Rigol', eta: '3600 days', cost: '5000 Alloys', progress: 5 },
];

export default function ConstructionPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState('Construction Ships');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="flex flex-col rounded-lg overflow-hidden" style={{ width: 500, height: 560, background: '#0e1520', border: '1px solid #1d2d40', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40', background: 'rgba(0,0,0,0.3)' }}>
          <div className="flex items-center gap-2">
            <i className="ri-tools-line text-lg" style={{ color: '#4a9dd4' }}></i>
            <span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Construction</span>
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}>
            <i className="ri-close-line text-sm"></i>
          </button>
        </div>

        <div className="flex flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className="px-4 py-2 text-xs font-semibold whitespace-nowrap cursor-pointer" style={{ color: tab === t ? '#4a9dd4' : '#6b8aaa', borderBottom: tab === t ? '2px solid #4a9dd4' : '2px solid transparent' }}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1d2d40 transparent' }}>
          {tab === 'Construction Ships' && SHIPS.map(s => (
            <div key={s.name} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${s.color}20` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <i className="ri-ship-line text-sm" style={{ color: s.color }}></i>
                  <span className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{s.name}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${s.color}15`, color: s.color }}>{s.status}</span>
              </div>
              <div className="flex justify-between text-xs" style={{ color: '#6b8aaa' }}>
                <span><i className="ri-map-pin-line mr-1"></i>{s.location}</span>
                <span>{s.task}</span>
              </div>
              {s.status === 'Building' && (
                <div className="mt-2">
                  <div className="w-full h-1 rounded-full" style={{ background: '#1d2d40' }}>
                    <div className="h-1 rounded-full" style={{ width: `${s.progress}%`, background: s.color }}></div>
                  </div>
                </div>
              )}
              <div className="mt-2 flex gap-2">
                <button className="flex-1 py-1 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(74,157,212,0.12)', border: '1px solid rgba(74,157,212,0.25)', color: '#4a9dd4' }}>Move</button>
                {s.status === 'Idle' && <button className="flex-1 py-1 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(58,170,94,0.12)', border: '1px solid rgba(58,170,94,0.25)', color: '#3aaa5e' }}>Assign</button>}
              </div>
            </div>
          ))}

          {tab === 'Build Queue' && (
            <>
              {BUILD_QUEUE.map(b => (
                <div key={b.item} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #1d2d40' }}>
                  <div className="text-sm font-semibold mb-1" style={{ color: '#c8d8e8' }}>{b.item}</div>
                  <div className="flex justify-between text-xs mb-2" style={{ color: '#6b8aaa' }}>
                    <span><i className="ri-star-line mr-1"></i>{b.system}</span>
                    <span>ETA: {b.eta}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full mb-1" style={{ background: '#1d2d40' }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${b.progress}%`, background: '#4a9dd4' }}></div>
                  </div>
                  <div className="flex justify-between text-xs" style={{ color: '#6b8aaa' }}>
                    <span>{b.progress}%</span>
                    <span style={{ color: '#c9a227' }}>{b.cost}</span>
                  </div>
                </div>
              ))}
              <div className="text-xs text-center mt-4" style={{ color: '#6b8aaa' }}>
                Build Queue: {BUILD_QUEUE.length} / 10 slots
              </div>
            </>
          )}
        </div>

        <div className="p-3 flex justify-end gap-2 flex-shrink-0" style={{ borderTop: '1px solid #1d2d40' }}>
          <button className="px-4 py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(58,170,94,0.12)', border: '1px solid rgba(58,170,94,0.25)', color: '#3aaa5e' }}>
            Build New Ship
          </button>
          <button onClick={onClose} className="px-4 py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1d2d40', color: '#6b8aaa' }}>Close</button>
        </div>
      </div>
    </div>
  );
}
