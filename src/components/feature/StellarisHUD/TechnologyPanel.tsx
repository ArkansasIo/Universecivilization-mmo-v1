import { useState } from 'react';

const TABS = ['Contacts', 'Society', 'Engineering', 'Research Queue', 'Tech Tree', 'Special Projects', 'Mega-Engineering'];

const CONTACTS = [
  { name: 'Zircon Hegemony', relation: 'Rival', power: 'Equivalent', color: '#e87a5a', icon: 'ri-sword-line' },
  { name: 'Kethri Coalition', relation: 'Neutral', power: 'Inferior', color: '#6b8aaa', icon: 'ri-shield-line' },
  { name: 'Vorlon Extinction', relation: 'At War', power: 'Superior', color: '#ff4444', icon: 'ri-alarm-warning-line' },
  { name: 'Salfing Starclave', relation: 'Federation', power: 'Inferior', color: '#3aaa5e', icon: 'ri-shield-star-line' },
  { name: 'Union of Sirius', relation: 'Friendly', power: 'Equivalent', color: '#4a9dd4', icon: 'ri-handshake-line' },
];

const SOCIETY_TECH = [
  { name: 'Artificial Intelligence', cost: 3600, progress: 72, type: 'Physics', tier: 3, icon: 'ri-robot-line' },
  { name: 'Gene Tailoring', cost: 2800, progress: 45, type: 'Society', tier: 2, icon: 'ri-dna-line' },
  { name: 'Psionic Theory', cost: 5200, progress: 18, type: 'Society', tier: 4, icon: 'ri-brain-line' },
];

const ENGINEERING_TECH = [
  { name: 'Advanced Bio-Engineering', cost: 2400, progress: 88, type: 'Engineering', tier: 2, icon: 'ri-microscope-line' },
  { name: 'Mega-Engineering', cost: 12000, progress: 5, type: 'Engineering', tier: 5, icon: 'ri-building-4-line', special: true },
  { name: 'Zero-Point Reactor', cost: 8000, progress: 0, type: 'Physics', tier: 4, icon: 'ri-flashlight-line' },
];

const RESEARCH_QUEUE = [
  { name: 'AI Integration', field: 'Physics', eta: '42 days', progress: 72, points: 1840 },
  { name: 'Supersolid Materials', eta: '28 days', field: 'Engineering', progress: 88, points: 1620 },
];

const SPECIAL_PROJECTS = [
  { name: 'Anomaly: Gateway Debris', location: 'Beta Centauri', days: 85, assigned: 'ISS Horizon', progress: 34 },
  { name: 'Ancient Precursor Cache', location: 'Unknown', days: 140, assigned: 'ISS Pioneer', progress: 12 },
];

export default function TechnologyPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState('Contacts');

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40' }}>
        <div className="flex items-center gap-2">
          <i className="ri-flask-line text-lg" style={{ color: '#a78bfa' }}></i>
          <span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Technology</span>
          <div className="text-xs px-2 py-0.5 rounded flex items-center gap-1" style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa' }}>
            <i className="ri-flask-line"></i> 3,740/mo
          </div>
        </div>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}>
          <i className="ri-close-line text-sm"></i>
        </button>
      </div>

      <div className="flex flex-shrink-0 overflow-x-auto" style={{ borderBottom: '1px solid #1d2d40', scrollbarWidth: 'none' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-3 py-2 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors flex-shrink-0" style={{ color: tab === t ? '#a78bfa' : '#6b8aaa', borderBottom: tab === t ? '2px solid #a78bfa' : '2px solid transparent' }}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1d2d40 transparent' }}>
        {tab === 'Contacts' && (
          <>
            <div className="text-xs font-semibold mb-2" style={{ color: '#7eb8da' }}>Known Empires</div>
            {CONTACTS.map(c => (
              <div key={c.name} className="flex items-center justify-between rounded p-3 cursor-pointer hover:bg-white/5" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${c.color}15` }}>
                    <i className={`${c.icon} text-sm`} style={{ color: c.color }}></i>
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{c.name}</div>
                    <div className="text-xs" style={{ color: '#6b8aaa' }}>Power: {c.power}</div>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded" style={{ background: `${c.color}15`, color: c.color }}>{c.relation}</span>
              </div>
            ))}
          </>
        )}

        {tab === 'Society' && (
          <>
            <div className="text-xs font-semibold mb-2" style={{ color: '#7eb8da' }}>Active Research</div>
            {SOCIETY_TECH.map(t => (
              <div key={t.name} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <i className={`${t.icon} text-sm`} style={{ color: '#a78bfa' }}></i>
                    <span className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{t.name}</span>
                  </div>
                  <span className="text-xs" style={{ color: '#6b8aaa' }}>Tier {t.tier}</span>
                </div>
                <div className="w-full h-1.5 rounded-full mb-1" style={{ background: '#1d2d40' }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${t.progress}%`, background: '#a78bfa' }}></div>
                </div>
                <div className="flex justify-between text-xs" style={{ color: '#6b8aaa' }}>
                  <span>{t.type}</span>
                  <span>{t.progress}% · {t.cost.toLocaleString()} pts</span>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'Engineering' && (
          <>
            <div className="text-xs font-semibold mb-2" style={{ color: '#7eb8da' }}>Engineering Research</div>
            {ENGINEERING_TECH.map(t => (
              <div key={t.name} className="rounded p-3" style={{ background: t.special ? 'rgba(201,162,39,0.08)' : 'rgba(0,0,0,0.25)', border: `1px solid ${t.special ? 'rgba(201,162,39,0.25)' : '#1d2d40'}` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <i className={`${t.icon} text-sm`} style={{ color: t.special ? '#c9a227' : '#4a9dd4' }}></i>
                    <span className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{t.name}</span>
                    {t.special && <span className="text-xs px-1 rounded" style={{ background: 'rgba(201,162,39,0.2)', color: '#c9a227' }}>MEGA</span>}
                  </div>
                  <span className="text-xs" style={{ color: '#6b8aaa' }}>Tier {t.tier}</span>
                </div>
                <div className="w-full h-1.5 rounded-full mb-1" style={{ background: '#1d2d40' }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${t.progress}%`, background: t.special ? '#c9a227' : '#4a9dd4' }}></div>
                </div>
                <div className="flex justify-between text-xs" style={{ color: '#6b8aaa' }}>
                  <span>{t.type}</span>
                  <span>{t.progress > 0 ? `${t.progress}%` : 'Not started'} · {t.cost.toLocaleString()} pts</span>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'Research Queue' && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { field: 'Physics', rate: 1840, color: '#4a9dd4', icon: 'ri-flashlight-line' },
                { field: 'Society', rate: 1120, color: '#3aaa5e', icon: 'ri-leaf-line' },
                { field: 'Engineering', rate: 780, color: '#e87a5a', icon: 'ri-settings-3-line' },
              ].map(r => (
                <div key={r.field} className="rounded p-3 text-center" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #1d2d40' }}>
                  <i className={`${r.icon} text-lg mb-1`} style={{ color: r.color }}></i>
                  <div className="text-xs font-bold" style={{ color: r.color }}>{r.rate}/mo</div>
                  <div className="text-xs" style={{ color: '#6b8aaa' }}>{r.field}</div>
                </div>
              ))}
            </div>
            {RESEARCH_QUEUE.map(r => (
              <div key={r.name} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{r.name}</span>
                  <span className="text-xs" style={{ color: '#6b8aaa' }}>ETA: {r.eta}</span>
                </div>
                <div className="w-full h-2 rounded-full mb-1" style={{ background: '#1d2d40' }}>
                  <div className="h-2 rounded-full" style={{ width: `${r.progress}%`, background: 'linear-gradient(90deg, #a78bfa, #4a9dd4)' }}></div>
                </div>
                <div className="flex justify-between text-xs" style={{ color: '#6b8aaa' }}>
                  <span>{r.field}</span>
                  <span>{r.progress}% · {r.points}/mo</span>
                </div>
              </div>
            ))}
            <button className="w-full py-2 rounded text-xs font-semibold cursor-pointer mt-2" style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', color: '#a78bfa' }}>
              <i className="ri-user-add-line mr-1"></i>Manage Researchers
            </button>
          </>
        )}

        {tab === 'Tech Tree' && (
          <div className="space-y-4">
            {['Physics', 'Society', 'Engineering'].map(field => (
              <div key={field}>
                <div className="text-xs font-semibold mb-2" style={{ color: '#7eb8da' }}>{field}</div>
                <div className="grid grid-cols-2 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded p-2" style={{ background: i < 2 ? 'rgba(58,170,94,0.08)' : 'rgba(0,0,0,0.2)', border: `1px solid ${i < 2 ? 'rgba(58,170,94,0.25)' : '#1d2d40'}` }}>
                      <div className="text-xs font-semibold" style={{ color: i < 2 ? '#3aaa5e' : '#4a5a6a' }}>
                        {i < 2 ? '✓ Researched' : `Tier ${i + 1} Tech`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Special Projects' && (
          <>
            <div className="text-xs font-semibold mb-2" style={{ color: '#7eb8da' }}>Active Projects</div>
            {SPECIAL_PROJECTS.map(p => (
              <div key={p.name} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
                <div className="text-sm font-semibold mb-1" style={{ color: '#c8d8e8' }}>{p.name}</div>
                <div className="text-xs mb-2" style={{ color: '#6b8aaa' }}>
                  <span className="mr-3"><i className="ri-map-pin-line mr-1"></i>{p.location}</span>
                  <span><i className="ri-ship-line mr-1"></i>{p.assigned}</span>
                </div>
                <div className="w-full h-1.5 rounded-full mb-1" style={{ background: '#1d2d40' }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${p.progress}%`, background: '#a78bfa' }}></div>
                </div>
                <div className="flex justify-between text-xs" style={{ color: '#6b8aaa' }}>
                  <span>{p.progress}%</span>
                  <span>~{p.days} days</span>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'Mega-Engineering' && (
          <div className="space-y-3">
            <div className="rounded p-3" style={{ background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.25)' }}>
              <div className="text-xs font-bold mb-1" style={{ color: '#c9a227' }}>Mega-Engineering Required</div>
              <div className="text-xs" style={{ color: '#c8d8e8' }}>Research Mega-Engineering to unlock megastructure construction</div>
              <div className="w-full h-1.5 rounded-full mt-2" style={{ background: '#1d2d40' }}>
                <div className="h-1.5 rounded-full" style={{ width: '5%', background: '#c9a227' }}></div>
              </div>
              <div className="text-xs mt-1" style={{ color: '#6b8aaa' }}>5% · ~2,400 days remaining</div>
            </div>
            {['Dyson Sphere', 'Ring World', 'Matter Decompressor', 'Megaart Installation', 'Science Nexus'].map(m => (
              <div key={m} className="flex items-center justify-between rounded p-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #1d2d40', opacity: 0.5 }}>
                <span className="text-xs" style={{ color: '#4a5a6a' }}>{m}</span>
                <span className="text-xs" style={{ color: '#3a4a5a' }}>Locked</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
