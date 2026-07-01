import { useState } from 'react';

const TABS = ['Science Ships', 'Anomalies', 'Archaeology'];

const SCIENCE_SHIPS = [
  { name: 'ISS Explorer', scientist: 'Dr. Aelindra Voss', location: 'Beta Centauri', status: 'Surveying', task: 'Anomaly Investigation', progress: 45, color: '#a78bfa' },
  { name: 'ISS Voyage', scientist: 'None', location: 'Tau Ceti', status: 'Idle', task: 'None', progress: 0, color: '#6b8aaa' },
  { name: 'ISS Investigator', scientist: 'Prof. Tarren', location: 'Polaris', status: 'Surveying', task: 'Planetary Survey', progress: 78, color: '#4a9dd4' },
  { name: 'ISS Anomalies', scientist: 'Dr. Nara Elise', location: 'Sirius', status: 'Researching', task: 'Ancient Precursor Cache', progress: 22, color: '#a78bfa' },
  { name: 'ISS Petitioner', scientist: 'None', location: 'Vega', status: 'Idle', task: 'None', progress: 0, color: '#6b8aaa' },
];

const ANOMALIES = [
  { name: 'Strange Radiation Pattern', system: 'Beta Centauri', risk: 'Low', reward: 'Research Boost', investigator: 'ISS Explorer' },
  { name: 'Ancient Gateway Debris', system: 'Procyon', risk: 'Medium', reward: 'Gateway Tech', investigator: 'Unassigned' },
  { name: 'Psionic Disturbance', system: 'Deneb', risk: 'High', reward: 'Psionic Research', investigator: 'Unassigned' },
  { name: 'Void Creature Egg', system: 'Unknown', risk: 'Critical', reward: '???', investigator: 'Unassigned' },
];

const ARCHAEOLOGY = [
  { site: 'Zroni Homeworld', location: 'Sigma Draconis', clues: 4, cluesMax: 7, era: 'Ancient', progress: 57 },
  { site: 'First League Vault', location: 'Tau Ceti', clues: 2, cluesMax: 5, era: 'Early Space Age', progress: 40 },
];

export default function SciencePanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState('Science Ships');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="flex flex-col rounded-lg overflow-hidden" style={{ width: 520, height: 620, background: '#0e1520', border: '1px solid #1d2d40', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40', background: 'rgba(0,0,0,0.3)' }}>
          <div className="flex items-center gap-2">
            <i className="ri-microscope-line text-lg" style={{ color: '#a78bfa' }}></i>
            <span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Science</span>
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa' }}>{SCIENCE_SHIPS.length} ships</span>
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}>
            <i className="ri-close-line text-sm"></i>
          </button>
        </div>

        <div className="flex flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className="px-4 py-2 text-xs font-semibold whitespace-nowrap cursor-pointer" style={{ color: tab === t ? '#a78bfa' : '#6b8aaa', borderBottom: tab === t ? '2px solid #a78bfa' : '2px solid transparent' }}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1d2d40 transparent' }}>
          {tab === 'Science Ships' && SCIENCE_SHIPS.map(s => (
            <div key={s.name} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${s.color}20` }}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <i className="ri-microscope-line text-sm" style={{ color: s.color }}></i>
                  <span className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{s.name}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${s.color}15`, color: s.color }}>{s.status}</span>
              </div>
              <div className="flex justify-between text-xs mb-1" style={{ color: '#6b8aaa' }}>
                <span><i className="ri-user-star-line mr-1"></i>{s.scientist}</span>
                <span><i className="ri-map-pin-line mr-1"></i>{s.location}</span>
              </div>
              {s.progress > 0 && (
                <>
                  <div className="text-xs mb-1" style={{ color: '#c8d8e8' }}>{s.task}</div>
                  <div className="w-full h-1 rounded-full" style={{ background: '#1d2d40' }}>
                    <div className="h-1 rounded-full" style={{ width: `${s.progress}%`, background: s.color }}></div>
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#6b8aaa' }}>{s.progress}%</div>
                </>
              )}
              {s.status === 'Idle' && (
                <button className="w-full mt-2 py-1 rounded text-xs cursor-pointer" style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', color: '#a78bfa' }}>
                  Assign Mission
                </button>
              )}
            </div>
          ))}

          {tab === 'Anomalies' && ANOMALIES.map(a => (
            <div key={a.name} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #1d2d40' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{a.name}</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: a.risk === 'Critical' ? 'rgba(255,68,68,0.15)' : a.risk === 'High' ? 'rgba(232,122,90,0.15)' : a.risk === 'Medium' ? 'rgba(201,162,39,0.15)' : 'rgba(58,170,94,0.15)', color: a.risk === 'Critical' ? '#ff4444' : a.risk === 'High' ? '#e87a5a' : a.risk === 'Medium' ? '#c9a227' : '#3aaa5e' }}>
                  {a.risk} Risk
                </span>
              </div>
              <div className="text-xs mb-1" style={{ color: '#6b8aaa' }}><i className="ri-star-line mr-1"></i>{a.system}</div>
              <div className="text-xs mb-2" style={{ color: '#3aaa5e' }}>Reward: {a.reward}</div>
              {a.investigator !== 'Unassigned' ? (
                <div className="text-xs" style={{ color: '#4a9dd4' }}>Investigating: {a.investigator}</div>
              ) : (
                <button className="w-full py-1 rounded text-xs cursor-pointer" style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', color: '#a78bfa' }}>
                  Investigate
                </button>
              )}
            </div>
          ))}

          {tab === 'Archaeology' && ARCHAEOLOGY.map(arc => (
            <div key={arc.site} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #1d2d40' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: '#c8d8e8' }}>{arc.site}</div>
              <div className="flex gap-4 text-xs mb-2" style={{ color: '#6b8aaa' }}>
                <span><i className="ri-map-pin-line mr-1"></i>{arc.location}</span>
                <span>Era: <span style={{ color: '#c9a227' }}>{arc.era}</span></span>
              </div>
              <div className="text-xs mb-1" style={{ color: '#6b8aaa' }}>Clues: <span style={{ color: '#c8d8e8' }}>{arc.clues} / {arc.cluesMax}</span></div>
              <div className="w-full h-2 rounded-full mb-1" style={{ background: '#1d2d40' }}>
                <div className="h-2 rounded-full" style={{ width: `${arc.progress}%`, background: 'linear-gradient(90deg, #c9a227, #a78bfa)' }}></div>
              </div>
              <div className="text-xs" style={{ color: '#6b8aaa' }}>{arc.progress}% excavated</div>
            </div>
          ))}
        </div>

        <div className="p-3 flex justify-end flex-shrink-0" style={{ borderTop: '1px solid #1d2d40' }}>
          <button onClick={onClose} className="px-4 py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1d2d40', color: '#6b8aaa' }}>Close</button>
        </div>
      </div>
    </div>
  );
}
