import { useState } from 'react';

const TABS = ['Starbases', 'Starbase Builder', 'Defense Platforms'];

const STARBASES = [
  { name: 'Sol Station', system: 'Sol', type: 'Citadel', modules: ['Shipyard', 'Trade Hub', 'Anchorage'], power: 35200, color: '#c9a227' },
  { name: 'Alpha Centauri Station', system: 'Alpha Centauri', type: 'Starhold', modules: ['Bastion', 'Anchorage'], power: 18500, color: '#4a9dd4' },
  { name: 'Epsilon Eridani Station', system: 'Epsilon Eridani', type: 'Starfort', modules: ['Shipyard', 'Anchorage'], power: 27300, color: '#a78bfa' },
  { name: 'Sirius Outpost', system: 'Sirius', type: 'Outpost', modules: [], power: 2400, color: '#3aaa5e' },
  { name: 'Vega Station', system: 'Vega', type: 'Starport', modules: ['Anchorage'], power: 8200, color: '#e87a5a' },
  { name: 'Vega Station', system: 'Barnard\'s Star', type: 'Starhold', modules: ['Bastion'], power: 12000, color: '#c9a227' },
];

const BUILDER_MODULES = [
  { name: 'Shipyard', cost: '100 Alloys', effect: '+1 Shipyard Slot', icon: 'ri-tools-line', color: '#4a9dd4' },
  { name: 'Trade Hub', cost: '100 Alloys', effect: '+2 Trade Collection Range', icon: 'ri-exchange-line', color: '#c9a227' },
  { name: 'Anchorage', cost: '100 Alloys', effect: '+5 Naval Capacity', icon: 'ri-anchor-line', color: '#3aaa5e' },
  { name: 'Bastion', cost: '150 Alloys', effect: '+50% Defense Platforms', icon: 'ri-shield-line', color: '#e87a5a' },
  { name: 'Crew Quarters', cost: '75 Alloys', effect: '+5% Fleet Command', icon: 'ri-group-line', color: '#a78bfa' },
  { name: 'Listening Post', cost: '80 Alloys', effect: '+30 Sensor Range', icon: 'ri-radar-line', color: '#4a9dd4' },
];

const PLATFORMS = [
  { name: 'Defense Platform A', type: 'Kinetic', power: 4500, weapons: 'Mass Drivers x4', shields: 'Deflector II' },
  { name: 'Defense Platform B', type: 'Energy', power: 5200, weapons: 'Lasers x4', shields: 'Deflector II' },
  { name: 'Torpedo Platform', type: 'Torpedo', power: 3800, weapons: 'Torpedoes x2', shields: 'Deflector I' },
];

const TYPE_COLORS: Record<string, string> = {
  Outpost: '#3aaa5e',
  Starport: '#4a9dd4',
  Starhold: '#c9a227',
  Starfort: '#a78bfa',
  Citadel: '#e87a5a',
};

export default function StarbasesPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState('Starbases');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="flex flex-col rounded-lg overflow-hidden" style={{ width: 540, height: 640, background: '#0e1520', border: '1px solid #1d2d40', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40', background: 'rgba(0,0,0,0.3)' }}>
          <div className="flex items-center gap-2">
            <i className="ri-focus-3-line text-lg" style={{ color: '#c9a227' }}></i>
            <span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Starbases</span>
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(201,162,39,0.15)', color: '#c9a227' }}>{STARBASES.length} stations</span>
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}>
            <i className="ri-close-line text-sm"></i>
          </button>
        </div>

        <div className="flex flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className="px-4 py-2 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors" style={{ color: tab === t ? '#c9a227' : '#6b8aaa', borderBottom: tab === t ? '2px solid #c9a227' : '2px solid transparent' }}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1d2d40 transparent' }}>
          {tab === 'Starbases' && STARBASES.map(sb => (
            <div key={sb.name + sb.system} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #1d2d40' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <i className="ri-focus-3-line text-sm" style={{ color: TYPE_COLORS[sb.type] || '#c9a227' }}></i>
                  <span className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{sb.name}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${TYPE_COLORS[sb.type] || '#c9a227'}15`, color: TYPE_COLORS[sb.type] || '#c9a227' }}>{sb.type}</span>
              </div>
              <div className="flex items-center gap-4 text-xs mb-2" style={{ color: '#6b8aaa' }}>
                <span><i className="ri-star-line mr-1"></i>{sb.system}</span>
                <span><i className="ri-shield-line mr-1"></i>★ {(sb.power / 1000).toFixed(1)}K</span>
              </div>
              {sb.modules.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {sb.modules.map(m => (
                    <span key={m} className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(74,157,212,0.1)', color: '#4a9dd4', border: '1px solid rgba(74,157,212,0.2)' }}>{m}</span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {tab === 'Starbase Builder' && (
            <>
              <div className="text-xs mb-2" style={{ color: '#6b8aaa' }}>Select a starbase then add modules and buildings</div>
              <div className="rounded p-3 mb-3" style={{ background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.25)' }}>
                <div className="text-xs font-semibold" style={{ color: '#c9a227' }}>Selected: Sol Station (Citadel)</div>
                <div className="text-xs mt-1" style={{ color: '#6b8aaa' }}>Module slots: 3/6 · Building slots: 2/4</div>
              </div>
              {BUILDER_MODULES.map(m => (
                <div key={m.name} className="flex items-center justify-between rounded p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #1d2d40' }}>
                  <div className="flex items-center gap-2">
                    <i className={`${m.icon} text-sm`} style={{ color: m.color }}></i>
                    <div>
                      <div className="text-xs font-semibold" style={{ color: '#c8d8e8' }}>{m.name}</div>
                      <div className="text-xs" style={{ color: '#6b8aaa' }}>{m.effect}</div>
                    </div>
                  </div>
                  <button className="text-xs px-2 py-1 rounded cursor-pointer" style={{ background: `${m.color}12`, border: `1px solid ${m.color}30`, color: m.color }}>
                    {m.cost}
                  </button>
                </div>
              ))}
              <button className="w-full py-2 rounded text-xs font-semibold cursor-pointer mt-2" style={{ background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.25)', color: '#c9a227' }}>
                <i className="ri-arrow-up-line mr-1"></i>Upgrade Starbase
              </button>
            </>
          )}

          {tab === 'Defense Platforms' && (
            <>
              <div className="text-xs mb-2" style={{ color: '#6b8aaa' }}>Defense platforms attached to your starbases</div>
              {PLATFORMS.map(p => (
                <div key={p.name} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #1d2d40' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{p.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(232,122,90,0.15)', color: '#e87a5a' }}>{p.type}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: '#6b8aaa' }}>
                    <span><i className="ri-shield-line mr-1"></i>★ {(p.power / 1000).toFixed(1)}K</span>
                    <span><i className="ri-sword-line mr-1"></i>{p.weapons}</span>
                    <span><i className="ri-circle-line mr-1"></i>{p.shields}</span>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 rounded text-xs font-semibold cursor-pointer mt-2" style={{ background: 'rgba(232,122,90,0.1)', border: '1px solid rgba(232,122,90,0.25)', color: '#e87a5a' }}>
                <i className="ri-add-line mr-1"></i>Build Defense Platform
              </button>
            </>
          )}
        </div>

        <div className="p-3 flex justify-end flex-shrink-0" style={{ borderTop: '1px solid #1d2d40' }}>
          <button onClick={onClose} className="px-4 py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(74,157,212,0.12)', border: '1px solid rgba(74,157,212,0.25)', color: '#4a9dd4' }}>
            Build Starbase
          </button>
        </div>
      </div>
    </div>
  );
}
