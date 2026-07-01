import { useState } from 'react';

const TABS = ['Fleets', 'Fleet Designer', 'Admirals', 'Fleet Manager'];

const FLEETS = [
  { name: '1st Strike Force', power: 25300, ships: 128, max: 200, admiral: 'Adm. Sol', location: 'Sol', status: 'Patrolling', color: '#3aaa5e' },
  { name: '2nd Strike Force', power: 18700, ships: 96, max: 200, admiral: 'Adm. Alpha', location: 'Alpha Centauri', status: 'Moving', color: '#4a9dd4' },
  { name: '3rd Strike Force', power: 11200, ships: 64, max: 80, admiral: 'Adm. Epsilon', location: 'Epsilon Eridani', status: 'Idle', color: '#c9a227' },
  { name: '4th Patrol Wing', power: 9800, ships: 45, max: 80, admiral: 'None', location: 'Sirius', status: 'Idle', color: '#a78bfa' },
  { name: '5th Expeditionary', power: 15100, ships: 80, max: 120, admiral: 'Adm. Vega', location: 'Vega', status: 'Expediting', color: '#e87a5a' },
];

const SHIP_TEMPLATES = [
  { name: 'Aetherion Destroyer', class: 'Destroyer', role: 'Screen', power: 280, cost: '120 Alloys', icon: 'ri-rocket-2-line' },
  { name: 'Eclipse Cruiser', class: 'Cruiser', role: 'Line', power: 680, cost: '280 Alloys', icon: 'ri-ship-line' },
  { name: 'Horizon Battleship', class: 'Battleship', role: 'Artillery', power: 1840, cost: '480 Alloys', icon: 'ri-rocket-fill' },
  { name: 'Nebula Corvette', class: 'Corvette', role: 'Picket', power: 120, cost: '60 Alloys', icon: 'ri-arrow-up-line' },
  { name: 'Titan Mk II', class: 'Titan', role: 'Capital', power: 12000, cost: '1200 Alloys', icon: 'ri-building-4-line' },
];

const ADMIRALS = [
  { name: 'Fleet Adm. Sevara', level: 8, skill: 'Aggressive', fleet: '1st Strike Force', bonus: 'Fire Rate +15%', icon: 'ri-user-star-line', color: '#c9a227' },
  { name: 'Adm. Rykos Khan', level: 6, skill: 'Defender', fleet: '2nd Strike Force', bonus: 'Armor +20%', icon: 'ri-shield-star-line', color: '#4a9dd4' },
  { name: 'Adm. Lyanna', level: 5, skill: 'Navigator', fleet: '3rd Strike Force', bonus: 'Speed +25%', icon: 'ri-compass-3-line', color: '#a78bfa' },
  { name: 'Adm. Taranis', level: 4, skill: 'Logistician', fleet: 'Unassigned', bonus: 'Upkeep -10%', icon: 'ri-user-settings-line', color: '#3aaa5e' },
];

export default function FleetsPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState('Fleets');
  const [selected, setSelected] = useState<string | null>(null);

  const totalPower = FLEETS.reduce((s, f) => s + f.power, 0);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40' }}>
        <div className="flex items-center gap-2">
          <i className="ri-rocket-2-line text-lg" style={{ color: '#3aaa5e' }}></i>
          <span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Fleets</span>
          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(58,170,94,0.15)', color: '#3aaa5e' }}>
            {FLEETS.length} fleets
          </span>
        </div>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}>
          <i className="ri-close-line text-sm"></i>
        </button>
      </div>

      <div className="px-4 py-2 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40', background: 'rgba(0,0,0,0.15)' }}>
        <div className="flex items-center gap-4 text-xs">
          <span style={{ color: '#6b8aaa' }}>Total Power: <span className="font-bold" style={{ color: '#e87a5a' }}>{(totalPower / 1000).toFixed(1)}K</span></span>
          <span style={{ color: '#6b8aaa' }}>Ships: <span className="font-bold" style={{ color: '#4a9dd4' }}>{FLEETS.reduce((s, f) => s + f.ships, 0)}</span></span>
          <span style={{ color: '#6b8aaa' }}>Admirals: <span className="font-bold" style={{ color: '#c9a227' }}>3/4</span></span>
        </div>
      </div>

      <div className="flex flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-3 py-2 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors" style={{ color: tab === t ? '#3aaa5e' : '#6b8aaa', borderBottom: tab === t ? '2px solid #3aaa5e' : '2px solid transparent' }}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1d2d40 transparent' }}>
        {tab === 'Fleets' && (
          <div>
            {FLEETS.map(f => (
              <div key={f.name} onClick={() => setSelected(f.name === selected ? null : f.name)} className="cursor-pointer transition-colors" style={{ borderBottom: '1px solid #1d2d40', background: selected === f.name ? 'rgba(58,170,94,0.05)' : 'transparent' }}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                    <i className="ri-rocket-2-line text-sm" style={{ color: f.color }}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: '#c8d8e8' }}>{f.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-20 h-1 rounded-full" style={{ background: '#1d2d40' }}>
                        <div className="h-1 rounded-full" style={{ width: `${(f.ships / f.max) * 100}%`, background: f.color }}></div>
                      </div>
                      <span className="text-xs" style={{ color: '#6b8aaa' }}>{f.ships}/{f.max}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold" style={{ color: '#e87a5a' }}>★ {(f.power / 1000).toFixed(1)}K</div>
                    <div className="text-xs" style={{ color: f.status === 'Idle' ? '#c9a227' : f.status === 'Patrolling' ? '#3aaa5e' : '#4a9dd4' }}>{f.status}</div>
                  </div>
                </div>
                {selected === f.name && (
                  <div className="px-4 pb-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded p-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #1d2d40' }}>
                        <div className="text-xs" style={{ color: '#6b8aaa' }}>Admiral</div>
                        <div className="text-xs font-semibold" style={{ color: '#c9a227' }}>{f.admiral}</div>
                      </div>
                      <div className="rounded p-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #1d2d40' }}>
                        <div className="text-xs" style={{ color: '#6b8aaa' }}>Location</div>
                        <div className="text-xs font-semibold" style={{ color: '#4a9dd4' }}>{f.location}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(232,122,90,0.12)', border: '1px solid rgba(232,122,90,0.25)', color: '#e87a5a' }}>Attack</button>
                      <button className="flex-1 py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(74,157,212,0.12)', border: '1px solid rgba(74,157,212,0.25)', color: '#4a9dd4' }}>Move</button>
                      <button className="flex-1 py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(58,170,94,0.12)', border: '1px solid rgba(58,170,94,0.25)', color: '#3aaa5e' }}>Reinforce</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="p-4">
              <button className="w-full py-2 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(58,170,94,0.1)', border: '1px solid rgba(58,170,94,0.25)', color: '#3aaa5e' }}>
                <i className="ri-add-line mr-1"></i>Create New Fleet
              </button>
            </div>
          </div>
        )}

        {tab === 'Fleet Designer' && (
          <div className="p-4 space-y-3">
            <div className="text-xs font-semibold mb-2" style={{ color: '#7eb8da' }}>Ship Templates</div>
            {SHIP_TEMPLATES.map(s => (
              <div key={s.name} className="rounded p-3 cursor-pointer hover:bg-white/5 transition-colors" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <i className={`${s.icon} text-sm`} style={{ color: '#4a9dd4' }}></i>
                    <span className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{s.name}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(74,157,212,0.15)', color: '#4a9dd4' }}>{s.class}</span>
                </div>
                <div className="flex items-center gap-4 text-xs" style={{ color: '#6b8aaa' }}>
                  <span>Role: {s.role}</span>
                  <span>Power: <span style={{ color: '#e87a5a' }}>{s.power}</span></span>
                  <span>Cost: <span style={{ color: '#c9a227' }}>{s.cost}</span></span>
                </div>
              </div>
            ))}
            <button className="w-full py-2 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(74,157,212,0.1)', border: '1px solid rgba(74,157,212,0.25)', color: '#4a9dd4' }}>
              <i className="ri-add-line mr-1"></i>New Ship Design
            </button>
          </div>
        )}

        {tab === 'Admirals' && (
          <div className="p-4 space-y-3">
            {ADMIRALS.map(a => (
              <div key={a.name} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${a.color}15`, border: `1px solid ${a.color}30` }}>
                    <i className={`${a.icon} text-sm`} style={{ color: a.color }}></i>
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{a.name}</div>
                    <div className="text-xs" style={{ color: '#6b8aaa' }}>Lv.{a.level} · {a.skill}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-xs" style={{ color: a.fleet !== 'Unassigned' ? '#3aaa5e' : '#6b8aaa' }}>{a.fleet}</div>
                    <div className="text-xs font-semibold" style={{ color: a.color }}>{a.bonus}</div>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full py-2 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.25)', color: '#c9a227' }}>
              <i className="ri-user-add-line mr-1"></i>Recruit Admiral
            </button>
          </div>
        )}

        {tab === 'Fleet Manager' && (
          <div className="p-4 space-y-3">
            <div className="text-xs font-semibold mb-2" style={{ color: '#7eb8da' }}>Reinforcement Queue</div>
            {[
              { fleet: '3rd Strike Force', adding: '16 Destroyers', eta: '42 days', alloys: 1920 },
              { fleet: '4th Patrol Wing', adding: '8 Cruisers', eta: '67 days', alloys: 2240 },
            ].map(r => (
              <div key={r.fleet} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
                <div className="text-sm font-semibold mb-1" style={{ color: '#c8d8e8' }}>{r.fleet}</div>
                <div className="text-xs mb-2" style={{ color: '#6b8aaa' }}>Building: <span style={{ color: '#4a9dd4' }}>{r.adding}</span></div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: '#c9a227' }}>{r.alloys} Alloys</span>
                  <span style={{ color: '#6b8aaa' }}>ETA: {r.eta}</span>
                </div>
              </div>
            ))}
            <div className="text-xs font-semibold mt-4 mb-2" style={{ color: '#7eb8da' }}>Auto-Reinforce Settings</div>
            {FLEETS.slice(0, 3).map(f => (
              <div key={f.name} className="flex items-center justify-between rounded p-2" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #1d2d40' }}>
                <span className="text-xs" style={{ color: '#c8d8e8' }}>{f.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-4 rounded-full cursor-pointer" style={{ background: '#3aaa5e' }}>
                    <div className="w-3 h-3 rounded-full bg-white ml-auto mr-0.5 mt-0.5"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
