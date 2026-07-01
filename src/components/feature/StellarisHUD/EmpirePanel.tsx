import { useState } from 'react';

const TABS = ['Summary', 'Government', 'Sectors', 'Policies', 'Edicts', 'Factions', 'Decrees', 'Reforms'];

const EMPIRE_MODIFIERS = [
  { label: 'Research Speed', value: '+42%', color: '#4a9dd4' },
  { label: 'Sublight Speed', value: '+18%', color: '#4a9dd4' },
  { label: 'Ship-Fire Rate', value: '+13%', color: '#e87a5a' },
  { label: 'Unity from Jobs', value: '+15%', color: '#c9a227' },
];

const POLICIES = [
  { label: 'Economic Policy', value: 'Mercantile', icon: 'ri-exchange-line' },
  { label: 'Trade Policy', value: 'Wealth Creation', icon: 'ri-coins-line' },
  { label: 'Migration Controls', value: 'Open Borders', icon: 'ri-group-line' },
  { label: 'Robotics Policy', value: 'Unrestricted', icon: 'ri-robot-line' },
  { label: 'Slavery Tolerance', value: 'Prohibited', icon: 'ri-shield-check-line' },
  { label: 'Warfare Doctrine', value: 'Liberation Wars', icon: 'ri-sword-line' },
];

const EDICTS = [
  { label: 'Nutritional Plenitude', cost: '10 ⚡/mo', active: true, icon: 'ri-leaf-line' },
  { label: 'Martial Training', cost: '20 ⚡/mo', active: true, icon: 'ri-shield-line' },
  { label: 'Diplomatic Grants', cost: '15 ⚡/mo', active: false, icon: 'ri-star-line' },
  { label: 'Manufacturing Focus', cost: '25 ⚡/mo', active: false, icon: 'ri-tools-line' },
];

const FACTIONS = [
  { name: 'Industrialists', support: 38, icon: 'ri-building-2-line', color: '#c9a227', happiness: 72 },
  { name: 'Progressives', support: 24, icon: 'ri-lightbulb-line', color: '#4a9dd4', happiness: 85 },
  { name: 'Militarists', support: 21, icon: 'ri-sword-line', color: '#e87a5a', happiness: 61 },
  { name: 'Pacifists', support: 11, icon: 'ri-heart-line', color: '#3aaa5e', happiness: 44 },
  { name: 'Xenophiles', support: 6, icon: 'ri-user-heart-line', color: '#a78bfa', happiness: 78 },
];

const DECREES = [
  { label: 'Subsidised Education', unity: '-5/mo', effect: 'Research Speed +10%', active: true },
  { label: 'Garrison Orders', unity: '-10/mo', effect: 'Defense +20%', active: false },
  { label: 'Trade Stimulation', unity: '-8/mo', effect: 'Trade Value +15%', active: true },
];

const REFORMS = [
  { label: 'Civic: Mining Guilds', cost: '2500 Unity', available: true, icon: 'ri-hammer-line' },
  { label: 'Civic: Citizen Service', cost: '2500 Unity', available: false, icon: 'ri-shield-star-line' },
  { label: 'Civic: Free Haven', cost: '2500 Unity', available: true, icon: 'ri-community-line' },
];

export default function EmpirePanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState('Summary');

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: 'rgba(212,160,23,0.15)' }}>
            <i className="ri-building-4-line text-sm" style={{ color: '#d4a017' }}></i>
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Aetherion Empire</div>
            <div className="text-xs" style={{ color: '#6b8aaa' }}>Technocratic Empire</div>
          </div>
        </div>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}>
          <i className="ri-close-line text-sm"></i>
        </button>
      </div>

      {/* Empire Ruler */}
      <div className="px-4 py-2 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40', background: 'rgba(0,0,0,0.2)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2a3f5a, #1d2d40)' }}>
            <i className="ri-user-star-line" style={{ color: '#c9a227' }}></i>
          </div>
          <div>
            <div className="text-xs font-semibold" style={{ color: '#c8d8e8' }}>Empress Lyra V</div>
            <div className="text-xs" style={{ color: '#6b8aaa' }}>Aetherion Prime · Ruler</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs font-bold" style={{ color: '#4a9dd4' }}>Technocratic Empire</div>
            <div className="text-xs" style={{ color: '#6b8aaa' }}>Ov: Aetherion Prime</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 flex-shrink-0 overflow-x-auto" style={{ borderBottom: '1px solid #1d2d40', scrollbarWidth: 'none' }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3 py-2 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors flex-shrink-0"
            style={{
              color: tab === t ? '#c9a227' : '#6b8aaa',
              borderBottom: tab === t ? '2px solid #c9a227' : '2px solid transparent',
              background: tab === t ? 'rgba(201,162,39,0.05)' : 'transparent',
            }}
          >{t}</button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1d2d40 transparent' }}>
        {tab === 'Summary' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Star Systems', value: '47', icon: 'ri-star-line', color: '#c9a227' },
                { label: 'Planets', value: '12', icon: 'ri-planet-line', color: '#4a9dd4' },
                { label: 'Population', value: '124.8B', icon: 'ri-user-line', color: '#3aaa5e' },
                { label: 'Fleet Power', value: '184.2K', icon: 'ri-rocket-2-line', color: '#e87a5a' },
              ].map(s => (
                <div key={s.label} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <i className={`${s.icon} text-sm`} style={{ color: s.color }}></i>
                    <span className="text-xs" style={{ color: '#6b8aaa' }}>{s.label}</span>
                  </div>
                  <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs font-semibold mb-2" style={{ color: '#7eb8da' }}>Empire Modifiers</div>
              {EMPIRE_MODIFIERS.map(m => (
                <div key={m.label} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid #1d2d40' }}>
                  <span className="text-xs" style={{ color: '#c8d8e8' }}>{m.label}</span>
                  <span className="text-xs font-bold" style={{ color: m.color }}>{m.value}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2 rounded text-xs font-semibold cursor-pointer transition-colors" style={{ background: 'rgba(74,157,212,0.15)', border: '1px solid rgba(74,157,212,0.3)', color: '#4a9dd4' }}>
                <i className="ri-bar-chart-line mr-1"></i>Overview
              </button>
              <button className="py-2 rounded text-xs font-semibold cursor-pointer transition-colors" style={{ background: 'rgba(58,170,94,0.15)', border: '1px solid rgba(58,170,94,0.3)', color: '#3aaa5e' }}>
                <i className="ri-history-line mr-1"></i>History
              </button>
            </div>
          </div>
        )}

        {tab === 'Government' && (
          <div className="space-y-3">
            {[
              { label: 'Authority', value: 'Imperial', icon: 'ri-crown-line' },
              { label: 'Ethics', value: 'Materialist · Authoritarian', icon: 'ri-scales-3-line' },
              { label: 'Civics', value: 'Technocracy · Mining Guilds', icon: 'ri-government-line' },
              { label: 'Origin', value: 'Prosperous Unification', icon: 'ri-planet-fill' },
              { label: 'Capital', value: 'Aetherion Prime', icon: 'ri-home-3-line' },
            ].map(g => (
              <div key={g.label} className="rounded p-3 flex items-center gap-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
                <i className={`${g.icon} text-lg`} style={{ color: '#c9a227' }}></i>
                <div>
                  <div className="text-xs" style={{ color: '#6b8aaa' }}>{g.label}</div>
                  <div className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{g.value}</div>
                </div>
              </div>
            ))}
            <div className="rounded p-3" style={{ background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.2)' }}>
              <div className="text-xs font-bold mb-1" style={{ color: '#c9a227' }}>Council Agenda</div>
              <div className="text-xs" style={{ color: '#c8d8e8' }}>Focus: Industrial Development — +15% Mineral Production</div>
            </div>
          </div>
        )}

        {tab === 'Sectors' && (
          <div className="space-y-2">
            {[
              { name: 'Core Sector', systems: 12, governor: 'Adm. Valeria', focus: 'Industrial', color: '#c9a227' },
              { name: 'Frontier Sector', systems: 8, governor: 'None', focus: 'Expansion', color: '#4a9dd4' },
              { name: 'Outer Rim', systems: 15, governor: 'Adm. Rykos', focus: 'Research', color: '#a78bfa' },
              { name: 'Southern Reaches', systems: 12, governor: 'Adm. Fenn', focus: 'Military', color: '#e87a5a' },
            ].map(s => (
              <div key={s.name} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold" style={{ color: s.color }}>{s.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${s.color}20`, color: s.color }}>{s.focus}</span>
                </div>
                <div className="flex items-center gap-4 text-xs" style={{ color: '#6b8aaa' }}>
                  <span><i className="ri-star-line mr-1"></i>{s.systems} Systems</span>
                  <span><i className="ri-user-line mr-1"></i>{s.governor}</span>
                </div>
              </div>
            ))}
            <button className="w-full py-2 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(74,157,212,0.1)', border: '1px solid rgba(74,157,212,0.25)', color: '#4a9dd4' }}>
              + Create New Sector
            </button>
          </div>
        )}

        {tab === 'Policies' && (
          <div className="space-y-2">
            {POLICIES.map(p => (
              <div key={p.label} className="flex items-center justify-between rounded p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
                <div className="flex items-center gap-2">
                  <i className={`${p.icon} text-sm`} style={{ color: '#4a9dd4' }}></i>
                  <span className="text-xs" style={{ color: '#c8d8e8' }}>{p.label}</span>
                </div>
                <span className="text-xs font-semibold" style={{ color: '#c9a227' }}>{p.value}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'Edicts' && (
          <div className="space-y-2">
            <div className="text-xs mb-3" style={{ color: '#6b8aaa' }}>Edict Slots: <span style={{ color: '#c9a227' }}>2 / 4</span></div>
            {EDICTS.map(e => (
              <div key={e.label} className="flex items-center justify-between rounded p-3" style={{ background: e.active ? 'rgba(58,170,94,0.08)' : 'rgba(0,0,0,0.25)', border: `1px solid ${e.active ? 'rgba(58,170,94,0.3)' : '#1d2d40'}` }}>
                <div className="flex items-center gap-2">
                  <i className={`${e.icon} text-sm`} style={{ color: e.active ? '#3aaa5e' : '#6b8aaa' }}></i>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: e.active ? '#c8d8e8' : '#6b8aaa' }}>{e.label}</div>
                    <div className="text-xs" style={{ color: '#6b8aaa' }}>{e.cost}</div>
                  </div>
                </div>
                <button className="text-xs px-2 py-1 rounded cursor-pointer" style={{ background: e.active ? 'rgba(232,122,90,0.15)' : 'rgba(58,170,94,0.15)', color: e.active ? '#e87a5a' : '#3aaa5e', border: `1px solid ${e.active ? 'rgba(232,122,90,0.3)' : 'rgba(58,170,94,0.3)'}` }}>
                  {e.active ? 'Revoke' : 'Enact'}
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'Factions' && (
          <div className="space-y-3">
            {FACTIONS.map(f => (
              <div key={f.name} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <i className={`${f.icon} text-sm`} style={{ color: f.color }}></i>
                    <span className="text-sm font-semibold" style={{ color: f.color }}>{f.name}</span>
                  </div>
                  <span className="text-xs" style={{ color: '#6b8aaa' }}>Support: <span style={{ color: f.color }}>{f.support}%</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: '#1d2d40' }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${f.support}%`, background: f.color }}></div>
                  </div>
                  <span className="text-xs" style={{ color: f.happiness > 70 ? '#3aaa5e' : '#e87a5a' }}>
                    😊 {f.happiness}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Decrees' && (
          <div className="space-y-2">
            <div className="text-xs mb-3" style={{ color: '#6b8aaa' }}>Empire Decrees — costs Unity per month</div>
            {DECREES.map(d => (
              <div key={d.label} className="rounded p-3" style={{ background: d.active ? 'rgba(201,162,39,0.08)' : 'rgba(0,0,0,0.25)', border: `1px solid ${d.active ? 'rgba(201,162,39,0.25)' : '#1d2d40'}` }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold" style={{ color: d.active ? '#c9a227' : '#c8d8e8' }}>{d.label}</span>
                  <span className="text-xs" style={{ color: '#e87a5a' }}>{d.unity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#3aaa5e' }}>{d.effect}</span>
                  <button className="text-xs px-2 py-0.5 rounded cursor-pointer" style={{ background: d.active ? 'rgba(232,122,90,0.15)' : 'rgba(201,162,39,0.15)', color: d.active ? '#e87a5a' : '#c9a227', border: '1px solid currentColor' }}>
                    {d.active ? 'Revoke' : 'Issue'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Reforms' && (
          <div className="space-y-2">
            <div className="text-xs mb-2" style={{ color: '#6b8aaa' }}>Unity Available: <span style={{ color: '#c9a227' }}>4,280</span></div>
            {REFORMS.map(r => (
              <div key={r.label} className="flex items-center justify-between rounded p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
                <div className="flex items-center gap-2">
                  <i className={`${r.icon} text-sm`} style={{ color: r.available ? '#c9a227' : '#3a4a5a' }}></i>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: r.available ? '#c8d8e8' : '#4a5a6a' }}>{r.label}</div>
                    <div className="text-xs" style={{ color: '#6b8aaa' }}>{r.cost}</div>
                  </div>
                </div>
                <button disabled={!r.available} className="text-xs px-2 py-1 rounded cursor-pointer" style={{ background: r.available ? 'rgba(201,162,39,0.15)' : 'rgba(255,255,255,0.03)', color: r.available ? '#c9a227' : '#3a4a5a', border: `1px solid ${r.available ? 'rgba(201,162,39,0.3)' : '#1d2d40'}` }}>
                  Reform
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
