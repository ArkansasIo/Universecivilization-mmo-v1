import { useState } from 'react';

const TABS = ['Events', 'Situations'];

const EVENTS = [
  { id: 1, title: 'Alien First Contact', subtitle: 'Affects Kethri Coalition · Gamma Detector', severity: 'Medium', status: 'Active', icon: 'ri-user-alien-line', color: '#4a9dd4', desc: 'Your science ship has detected a previously unknown civilization in the outer reaches. How do you wish to proceed?', options: ['Open Diplomatic Channels', 'Observe Covertly', 'Establish Trade Route'] },
  { id: 2, title: 'Psionic Manifestation', subtitle: 'New Breccia Reformist 400K Idea', severity: 'High', status: 'Live', icon: 'ri-brain-line', color: '#a78bfa', desc: 'Psionic activity has been detected in multiple population centers. Citizens are reporting strange visions and heightened mental capabilities.', options: ['Encourage Research', 'Suppress Manifestation', 'Establish Psionic Corps'] },
  { id: 3, title: 'Megacorp Offer', subtitle: 'Affects Component: Gene Circuit', severity: 'Low', status: 'Active', icon: 'ri-building-line', color: '#3aaa5e', desc: 'The Interstellar Trading Company wishes to establish a corporate presence in your empire in exchange for economic benefits.', options: ['Accept Terms', 'Negotiate', 'Decline'] },
];

const SITUATIONS = [
  { name: 'Void Cloud Migration', type: 'Threat', progress: 65, severity: 'High', color: '#e87a5a', stages: ['Detected', 'Approaching', 'Engaged', 'Resolved'], currentStage: 1, desc: 'A massive void cloud entity is migrating through your territory. Its presence disrupts hyperlane travel.' },
  { name: 'Great Crusade', type: 'Crisis', progress: 30, severity: 'Critical', color: '#ff4444', stages: ['Building', 'Mobilizing', 'Active', 'Concluded'], currentStage: 1, desc: 'The Vorlon Extinction has called for a total war against all organic life. All empires are threatened.' },
  { name: 'Synthetic Evolution', type: 'Internal', progress: 48, severity: 'Medium', color: '#4a9dd4', stages: ['Awakening', 'Rights Movement', 'Crisis Point', 'Resolution'], currentStage: 1, desc: 'Your synthetic population is demanding equal rights. How this situation evolves will shape your empire\'s future.' },
];

export default function EventsPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState('Events');
  const [selected, setSelected] = useState<number | null>(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="flex flex-col rounded-lg overflow-hidden" style={{ width: 620, height: 680, background: '#0e1520', border: '1px solid #1d2d40', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40', background: 'rgba(0,0,0,0.3)' }}>
          <div className="flex items-center gap-2">
            <i className="ri-calendar-event-line text-lg" style={{ color: '#4a9dd4' }}></i>
            <span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Events & Situations</span>
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}>
            <i className="ri-close-line text-sm"></i>
          </button>
        </div>

        <div className="flex flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className="px-4 py-2 text-xs font-semibold cursor-pointer" style={{ color: tab === t ? '#4a9dd4' : '#6b8aaa', borderBottom: tab === t ? '2px solid #4a9dd4' : '2px solid transparent' }}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1d2d40 transparent' }}>
          {tab === 'Events' && EVENTS.map(e => (
            <div key={e.id} className="rounded overflow-hidden" style={{ border: `1px solid ${e.color}30` }}>
              <div onClick={() => setSelected(e.id === selected ? null : e.id)} className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/5 transition-colors" style={{ background: `${e.color}08` }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${e.color}15` }}>
                  <i className={`${e.icon} text-lg`} style={{ color: e.color }}></i>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold" style={{ color: '#c8d8e8' }}>{e.title}</div>
                  <div className="text-xs" style={{ color: '#6b8aaa' }}>{e.subtitle}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${e.color}15`, color: e.color }}>{e.severity}</span>
                  <div className="text-xs mt-1" style={{ color: '#6b8aaa' }}>{e.status}</div>
                </div>
              </div>
              {selected === e.id && (
                <div className="p-3 space-y-3" style={{ background: 'rgba(0,0,0,0.3)', borderTop: `1px solid ${e.color}20` }}>
                  <p className="text-xs leading-relaxed" style={{ color: '#c8d8e8' }}>{e.desc}</p>
                  <div className="space-y-2">
                    {e.options.map((opt, i) => (
                      <button key={i} className="w-full text-left py-2 px-3 rounded text-xs font-semibold cursor-pointer hover:bg-white/10 transition-colors" style={{ background: i === 0 ? `${e.color}15` : 'rgba(255,255,255,0.04)', border: `1px solid ${i === 0 ? e.color + '40' : '#1d2d40'}`, color: i === 0 ? e.color : '#c8d8e8' }}>
                        {i + 1}. {opt}
                      </button>
                    ))}
                  </div>
                  <button className="w-full py-1.5 rounded text-xs cursor-pointer" style={{ color: '#6b8aaa' }}>
                    View Situation
                  </button>
                </div>
              )}
            </div>
          ))}

          {tab === 'Situations' && SITUATIONS.map(s => (
            <div key={s.name} className="rounded p-4" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${s.color}30` }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-bold" style={{ color: '#c8d8e8' }}>{s.name}</div>
                  <div className="text-xs" style={{ color: '#6b8aaa' }}>{s.type}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded" style={{ background: `${s.color}15`, color: s.color }}>{s.severity}</span>
              </div>
              <p className="text-xs leading-relaxed mb-3" style={{ color: '#6b8aaa' }}>{s.desc}</p>

              {/* Stage progress */}
              <div className="flex gap-1 mb-3">
                {s.stages.map((stage, i) => (
                  <div key={stage} className="flex-1 text-center">
                    <div className="w-full h-1.5 rounded-full mb-1" style={{ background: i <= s.currentStage ? s.color : '#1d2d40' }}></div>
                    <div className="text-xs" style={{ color: i === s.currentStage ? s.color : '#4a5a6a', fontSize: 9 }}>{stage}</div>
                  </div>
                ))}
              </div>

              <div className="w-full h-2 rounded-full mb-1" style={{ background: '#1d2d40' }}>
                <div className="h-2 rounded-full" style={{ width: `${s.progress}%`, background: s.color }}></div>
              </div>
              <div className="text-xs" style={{ color: '#6b8aaa' }}>{s.progress}% progress</div>
            </div>
          ))}
        </div>

        <div className="p-3 flex justify-between flex-shrink-0" style={{ borderTop: '1px solid #1d2d40' }}>
          <button className="px-4 py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(74,157,212,0.12)', border: '1px solid rgba(74,157,212,0.25)', color: '#4a9dd4' }}>View All Events</button>
          <button onClick={onClose} className="px-4 py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1d2d40', color: '#6b8aaa' }}>Close</button>
        </div>
      </div>
    </div>
  );
}
