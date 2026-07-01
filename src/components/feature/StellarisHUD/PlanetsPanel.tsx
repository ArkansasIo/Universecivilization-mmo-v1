import { useState } from 'react';

const TABS = ['Planets', 'Habitats', 'Terraforming', 'Resettlement'];

const PLANETS = [
  { name: 'Aetherion Prime', type: 'Continental World', system: 'Sol', pop: 18, stability: 100, amenities: 35, isCapital: true, img: '🌍' },
  { name: 'New Dawn', type: 'Ocean World', system: 'Alpha Centauri', pop: 12, stability: 95, amenities: 28, isCapital: false, img: '🌊' },
  { name: 'Hope', type: 'Ocean World', system: 'Sirius', pop: 8, stability: 88, amenities: 22, isCapital: false, img: '🌏' },
  { name: 'Elysium', type: 'Gaia World', system: 'Tau Ceti', pop: 16, stability: 92, amenities: 40, isCapital: false, img: '🌿' },
  { name: 'Promise', type: 'Arid World', system: 'Vega', pop: 6, stability: 75, amenities: 18, isCapital: false, img: '🏜️' },
  { name: 'Bastion', type: 'Tundra World', system: 'Barnard\'s Star', pop: 9, stability: 82, amenities: 20, isCapital: false, img: '❄️' },
  { name: 'Nexus', type: 'Ecumenopolis', system: 'Rigol', pop: 24, stability: 79, amenities: 15, isCapital: false, img: '🏙️' },
  { name: 'Verdant', type: 'Tropical World', system: 'Polaris', pop: 7, stability: 90, amenities: 25, isCapital: false, img: '🌴' },
];

const HABITATS = [
  { name: 'Sol Habitat I', over: 'Sol', type: 'Habitat', pop: 4, district: 'Industrial' },
  { name: 'Alpha Centauri Hab', over: 'Alpha Centauri', type: 'Habitat', pop: 3, district: 'Research' },
  { name: 'Ring World Seg. A', over: 'Tau Ceti', type: 'Ring World', pop: 12, district: 'Mixed' },
];

const TERRAFORM = [
  { planet: 'Barren IV', from: 'Barren World', to: 'Arid World', progress: 65, eta: '120 days', cost: '500 Min' },
  { planet: 'Ice Giant II', from: 'Frozen World', to: 'Arctic World', progress: 30, eta: '280 days', cost: '800 Min' },
];

const RESETTLE = [
  { pop: 'Human Colonist', from: 'Aetherion Prime', to: 'Promise', cost: '100 Influence', jobs: 'Farmer' },
  { pop: 'Fen Habaris', from: 'New Dawn', to: 'Bastion', cost: '100 Influence', jobs: 'Miner' },
];

export default function PlanetsPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState('Planets');
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40' }}>
        <div className="flex items-center gap-2">
          <i className="ri-planet-line text-lg" style={{ color: '#4a9dd4' }}></i>
          <span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Planets</span>
          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(74,157,212,0.15)', color: '#4a9dd4' }}>{PLANETS.length}</span>
        </div>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}>
          <i className="ri-close-line text-sm"></i>
        </button>
      </div>

      <div className="flex flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-3 py-2 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors" style={{ color: tab === t ? '#4a9dd4' : '#6b8aaa', borderBottom: tab === t ? '2px solid #4a9dd4' : '2px solid transparent' }}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1d2d40 transparent' }}>
        {tab === 'Planets' && (
          <div>
            {PLANETS.map(p => (
              <div key={p.name} onClick={() => setSelected(p.name === selected ? null : p.name)} className="cursor-pointer transition-colors" style={{ borderBottom: '1px solid #1d2d40', background: selected === p.name ? 'rgba(74,157,212,0.08)' : 'transparent' }}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="text-2xl flex-shrink-0">{p.img}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate" style={{ color: '#c8d8e8' }}>{p.name}</span>
                      {p.isCapital && <span className="text-xs px-1 rounded" style={{ background: 'rgba(201,162,39,0.2)', color: '#c9a227' }}>Capital</span>}
                    </div>
                    <div className="text-xs" style={{ color: '#6b8aaa' }}>{p.type} · {p.system}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold" style={{ color: '#c8d8e8' }}>Pop {p.pop}</div>
                    <div className="text-xs" style={{ color: p.stability >= 90 ? '#3aaa5e' : p.stability >= 75 ? '#c9a227' : '#e87a5a' }}>
                      {p.stability}% ⚖
                    </div>
                  </div>
                </div>
                {selected === p.name && (
                  <div className="px-4 pb-3 grid grid-cols-3 gap-2">
                    {[
                      { label: 'Population', value: `${p.pop}`, icon: 'ri-user-line', color: '#3aaa5e' },
                      { label: 'Stability', value: `${p.stability}%`, icon: 'ri-scales-3-line', color: '#4a9dd4' },
                      { label: 'Amenities', value: `+${p.amenities}`, icon: 'ri-heart-line', color: '#a78bfa' },
                    ].map(s => (
                      <div key={s.label} className="rounded p-2 text-center" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #1d2d40' }}>
                        <div className="text-xs font-bold" style={{ color: s.color }}>{s.value}</div>
                        <div className="text-xs" style={{ color: '#6b8aaa' }}>{s.label}</div>
                      </div>
                    ))}
                    <div className="col-span-3 flex gap-2 mt-1">
                      <button className="flex-1 py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(74,157,212,0.12)', border: '1px solid rgba(74,157,212,0.25)', color: '#4a9dd4' }}>View Planet</button>
                      <button className="flex-1 py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(58,170,94,0.12)', border: '1px solid rgba(58,170,94,0.25)', color: '#3aaa5e' }}>Build</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="p-4">
              <button className="w-full py-2 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(58,170,94,0.1)', border: '1px solid rgba(58,170,94,0.25)', color: '#3aaa5e' }}>
                <i className="ri-planet-line mr-1"></i>Create New Colony
              </button>
            </div>
          </div>
        )}

        {tab === 'Habitats' && (
          <div className="p-4 space-y-3">
            {HABITATS.map(h => (
              <div key={h.name} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{h.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa' }}>{h.type}</span>
                </div>
                <div className="flex items-center gap-4 text-xs" style={{ color: '#6b8aaa' }}>
                  <span><i className="ri-star-line mr-1"></i>Over {h.over}</span>
                  <span><i className="ri-user-line mr-1"></i>Pop {h.pop}</span>
                  <span><i className="ri-building-2-line mr-1"></i>{h.district}</span>
                </div>
              </div>
            ))}
            <button className="w-full py-2 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', color: '#a78bfa' }}>
              + Build Habitat
            </button>
          </div>
        )}

        {tab === 'Terraforming' && (
          <div className="p-4 space-y-3">
            <div className="text-xs mb-2" style={{ color: '#6b8aaa' }}>Active Terraforming Projects</div>
            {TERRAFORM.map(t => (
              <div key={t.planet} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{t.planet}</span>
                  <span className="text-xs" style={{ color: '#6b8aaa' }}>ETA: {t.eta}</span>
                </div>
                <div className="text-xs mb-2" style={{ color: '#6b8aaa' }}>{t.from} → <span style={{ color: '#3aaa5e' }}>{t.to}</span></div>
                <div className="w-full h-2 rounded-full mb-2" style={{ background: '#1d2d40' }}>
                  <div className="h-2 rounded-full" style={{ width: `${t.progress}%`, background: 'linear-gradient(90deg, #3aaa5e, #4a9dd4)' }}></div>
                </div>
                <div className="flex items-center justify-between text-xs" style={{ color: '#6b8aaa' }}>
                  <span>{t.progress}% complete</span>
                  <span>Cost: {t.cost}/mo</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Resettlement' && (
          <div className="p-4 space-y-3">
            <div className="text-xs mb-2" style={{ color: '#6b8aaa' }}>Resettlement Queue — 100 Influence per pop</div>
            {RESETTLE.map(r => (
              <div key={r.pop} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
                <div className="text-sm font-semibold mb-1" style={{ color: '#c8d8e8' }}>{r.pop}</div>
                <div className="text-xs mb-1" style={{ color: '#6b8aaa' }}>{r.from} → <span style={{ color: '#4a9dd4' }}>{r.to}</span></div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#c9a227' }}>{r.cost}</span>
                  <button className="text-xs px-2 py-1 rounded cursor-pointer" style={{ background: 'rgba(74,157,212,0.15)', border: '1px solid rgba(74,157,212,0.3)', color: '#4a9dd4' }}>Resettle</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
