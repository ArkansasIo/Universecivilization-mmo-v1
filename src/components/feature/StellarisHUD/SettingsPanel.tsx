import { useState } from 'react';

const TABS = ['Graphics', 'Audio', 'Controls', 'Interface', 'Language', 'Gameplay', 'Accessibility'];

const GFX_OPTIONS = [
  { label: 'Display Mode', value: 'Fullscreen', options: ['Fullscreen', 'Windowed', 'Borderless'] },
  { label: 'Resolution', value: '3840 × 2160', options: ['1920×1080', '2560×1440', '3840×2160'] },
  { label: 'VSync', value: 'On', options: ['On', 'Off', 'Adaptive'] },
  { label: 'Quality', value: 'High', options: ['Low', 'Medium', 'High', 'Ultra'] },
];

const SLIDERS = [
  { label: 'Bloom', value: 80 },
  { label: 'Antialiasing', value: 100 },
];

const TOGGLES = [
  { label: 'Screen Shake', value: true },
  { label: 'Particles', value: true },
  { label: 'Scanlines', value: false },
];

export default function SettingsPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState('Graphics');
  const [sliders, setSliders] = useState(SLIDERS.map(s => ({ ...s })));
  const [toggles, setToggles] = useState(TOGGLES.map(t => ({ ...t })));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="flex flex-col rounded-lg overflow-hidden" style={{ width: 580, height: 640, background: '#0e1520', border: '1px solid #1d2d40', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40', background: 'rgba(0,0,0,0.3)' }}>
          <div className="flex items-center gap-2">
            <i className="ri-settings-3-line text-lg" style={{ color: '#6b8aaa' }}></i>
            <span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Settings</span>
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}>
            <i className="ri-close-line text-sm"></i>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-36 flex-shrink-0 overflow-y-auto" style={{ borderRight: '1px solid #1d2d40', background: 'rgba(0,0,0,0.2)' }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} className="w-full text-left px-3 py-2.5 text-xs cursor-pointer transition-colors hover:bg-white/5" style={{ color: tab === t ? '#4a9dd4' : '#6b8aaa', borderLeft: tab === t ? '2px solid #4a9dd4' : '2px solid transparent', background: tab === t ? 'rgba(74,157,212,0.06)' : 'transparent' }}>
                {t}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1d2d40 transparent' }}>
            {tab === 'Graphics' && (
              <>
                {GFX_OPTIONS.map(g => (
                  <div key={g.label} className="flex items-center justify-between rounded p-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #1d2d40' }}>
                    <span className="text-xs" style={{ color: '#c8d8e8' }}>{g.label}</span>
                    <select className="text-xs px-2 py-1 rounded cursor-pointer" style={{ background: '#1d2d40', border: '1px solid #2d3d50', color: '#c8d8e8', outline: 'none' }} defaultValue={g.value}>
                      {g.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                {sliders.map((s, i) => (
                  <div key={s.label} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #1d2d40' }}>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs" style={{ color: '#c8d8e8' }}>{s.label}</span>
                      <span className="text-xs font-bold" style={{ color: '#4a9dd4' }}>{s.value}%</span>
                    </div>
                    <input type="range" min={0} max={100} value={s.value} onChange={e => { const v = [...sliders]; v[i].value = +e.target.value; setSliders(v); }} className="w-full cursor-pointer" style={{ accentColor: '#4a9dd4' }} />
                  </div>
                ))}
                {toggles.map((t, i) => (
                  <div key={t.label} className="flex items-center justify-between rounded p-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #1d2d40' }}>
                    <span className="text-xs" style={{ color: '#c8d8e8' }}>{t.label}</span>
                    <div onClick={() => { const v = [...toggles]; v[i].value = !v[i].value; setToggles(v); }} className="w-10 h-5 rounded-full cursor-pointer relative transition-colors" style={{ background: t.value ? '#3aaa5e' : '#1d2d40' }}>
                      <div className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all" style={{ left: t.value ? '22px' : '2px' }}></div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {tab === 'Audio' && (
              <>
                {[
                  { label: 'Master Volume', value: 85 },
                  { label: 'Music Volume', value: 70 },
                  { label: 'SFX Volume', value: 90 },
                  { label: 'Voice Volume', value: 80 },
                  { label: 'Ambient Volume', value: 60 },
                ].map(a => (
                  <div key={a.label} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #1d2d40' }}>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs" style={{ color: '#c8d8e8' }}>{a.label}</span>
                      <span className="text-xs font-bold" style={{ color: '#4a9dd4' }}>{a.value}%</span>
                    </div>
                    <input type="range" min={0} max={100} defaultValue={a.value} className="w-full cursor-pointer" style={{ accentColor: '#4a9dd4' }} />
                  </div>
                ))}
              </>
            )}

            {tab !== 'Graphics' && tab !== 'Audio' && (
              <div className="text-center py-12">
                <i className="ri-settings-3-line text-4xl mb-3" style={{ color: '#3a4a5a' }}></i>
                <div className="text-sm" style={{ color: '#4a5a6a' }}>{tab} settings coming soon</div>
              </div>
            )}
          </div>
        </div>

        <div className="p-3 flex justify-between flex-shrink-0" style={{ borderTop: '1px solid #1d2d40' }}>
          <button className="px-4 py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(232,122,90,0.1)', border: '1px solid rgba(232,122,90,0.25)', color: '#e87a5a' }}>Reset Defaults</button>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(58,170,94,0.12)', border: '1px solid rgba(58,170,94,0.3)', color: '#3aaa5e' }}>Apply</button>
            <button onClick={onClose} className="px-4 py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1d2d40', color: '#6b8aaa' }}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
