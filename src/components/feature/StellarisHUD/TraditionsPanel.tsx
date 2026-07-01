import { useState } from 'react';

const TABS = ['Traditions', 'Ascension Perks'];

const TRADITION_TREES = [
  {
    name: 'Expansion',
    color: '#3aaa5e',
    icon: 'ri-compass-3-line',
    completed: 4,
    total: 7,
    traditions: [
      { name: 'Scouting Protocols', unlocked: true },
      { name: 'Colonial Enthusiasm', unlocked: true },
      { name: 'Planetary Unification', unlocked: true },
      { name: 'Adaptive Colonization', unlocked: true },
      { name: 'Aggressive Expansion', unlocked: false },
      { name: 'Bleeding Edge Technology', unlocked: false },
      { name: 'Adopt Expansion', unlocked: true, isFinisher: true },
    ],
  },
  {
    name: 'Domination',
    color: '#e87a5a',
    icon: 'ri-sword-line',
    completed: 2,
    total: 7,
    traditions: [
      { name: 'Imperial Prerogative', unlocked: true },
      { name: 'Strength of Legions', unlocked: true },
      { name: 'Border Friction', unlocked: false },
      { name: 'Vassal Acculturation', unlocked: false },
    ],
  },
  {
    name: 'Prosperity',
    color: '#c9a227',
    icon: 'ri-coins-line',
    completed: 3,
    total: 7,
    traditions: [
      { name: 'Marketplace of Ideas', unlocked: true },
      { name: 'Interstellar Franchising', unlocked: true },
      { name: 'Trickle-Up Economics', unlocked: true },
      { name: 'Consecrated Worlds', unlocked: false },
    ],
  },
  {
    name: 'Harmony',
    color: '#a78bfa',
    icon: 'ri-heart-line',
    completed: 1,
    total: 7,
    traditions: [
      { name: 'Shared Destiny', unlocked: true },
      { name: 'Integrated Preservation', unlocked: false },
    ],
  },
  {
    name: 'Supremacy',
    color: '#4a9dd4',
    icon: 'ri-rocket-2-line',
    completed: 5,
    total: 7,
    traditions: [
      { name: 'Reach for the Stars', unlocked: true },
      { name: 'Stellar Fleet Doctrine', unlocked: true },
      { name: 'Eternal Vigilance', unlocked: true },
      { name: 'Arsenal of Democracy', unlocked: true },
      { name: 'One Vision', unlocked: true },
      { name: 'Supreme Commander', unlocked: false },
    ],
  },
  {
    name: 'Discovery',
    color: '#a78bfa',
    icon: 'ri-telescope-line',
    completed: 2,
    total: 7,
    traditions: [
      { name: 'Curator Orders', unlocked: true },
      { name: 'The Scientific Method', unlocked: true },
      { name: 'Exploration Protocols', unlocked: false },
    ],
  },
];

const ASCENSION_PERKS = [
  { name: 'Voidborne', unlocked: true, icon: 'ri-planet-line', color: '#4a9dd4', desc: 'Habitats can be built' },
  { name: 'One Vision', unlocked: true, icon: 'ri-eye-line', color: '#c9a227', desc: '+10% Pop growth speed' },
  { name: 'Technological Ascendancy', unlocked: true, icon: 'ri-cpu-line', color: '#a78bfa', desc: '+10% Research speed' },
  { name: 'Nihilistic Acquisition', unlocked: false, icon: 'ri-ghost-line', color: '#e87a5a', desc: 'Raid pops from planets' },
  { name: 'Galactic Contender', unlocked: false, icon: 'ri-trophy-line', color: '#c9a227', desc: '+50 Diplomatic weight' },
  { name: 'Master Builders', unlocked: false, icon: 'ri-building-4-line', color: '#3aaa5e', desc: 'Extra megastructure slot' },
];

export default function TraditionsPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState('Traditions');
  const [expanded, setExpanded] = useState<string | null>('Expansion');

  const totalUnity = 5280;
  const nextCost = 850;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40' }}>
        <div className="flex items-center gap-2">
          <i className="ri-sparkling-2-line text-lg" style={{ color: '#c9a227' }}></i>
          <span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Traditions</span>
          <div className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(201,162,39,0.15)', color: '#c9a227' }}>
            <i className="ri-government-line mr-1"></i>Unity: {totalUnity.toLocaleString()}
          </div>
        </div>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}>
          <i className="ri-close-line text-sm"></i>
        </button>
      </div>

      <div className="px-4 py-2 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40', background: 'rgba(0,0,0,0.15)' }}>
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: '#6b8aaa' }}>Next tradition: <span style={{ color: '#c9a227' }}>{nextCost.toLocaleString()} Unity</span></span>
          <span style={{ color: '#6b8aaa' }}>Tradition Points: <span style={{ color: '#c8d8e8' }}>0</span></span>
        </div>
      </div>

      <div className="flex flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors" style={{ color: tab === t ? '#c9a227' : '#6b8aaa', borderBottom: tab === t ? '2px solid #c9a227' : '2px solid transparent' }}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1d2d40 transparent' }}>
        {tab === 'Traditions' && TRADITION_TREES.map(tree => (
          <div key={tree.name} className="rounded overflow-hidden" style={{ border: `1px solid ${tree.color}25` }}>
            <button
              onClick={() => setExpanded(expanded === tree.name ? null : tree.name)}
              className="w-full flex items-center gap-3 p-3 cursor-pointer hover:bg-white/5 transition-colors text-left"
              style={{ background: `${tree.color}08` }}
            >
              <i className={`${tree.icon} text-sm`} style={{ color: tree.color }}></i>
              <span className="text-sm font-semibold flex-1" style={{ color: '#c8d8e8' }}>{tree.name}</span>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(tree.total)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-sm" style={{ background: i < tree.completed ? tree.color : '#1d2d40' }}></div>
                  ))}
                </div>
                <span className="text-xs" style={{ color: tree.color }}>{tree.completed}/{tree.total}</span>
              </div>
              <i className={`ri-arrow-${expanded === tree.name ? 'up' : 'down'}-s-line text-xs`} style={{ color: '#6b8aaa' }}></i>
            </button>
            {expanded === tree.name && (
              <div className="px-3 pb-3 space-y-1.5">
                {tree.traditions.map(tr => (
                  <div key={tr.name} className="flex items-center gap-2 rounded px-2 py-1.5" style={{ background: tr.unlocked ? `${tree.color}10` : 'rgba(0,0,0,0.2)', border: `1px solid ${tr.unlocked ? tree.color + '30' : '#1d2d40'}` }}>
                    <i className={`${tr.unlocked ? 'ri-checkbox-circle-fill' : 'ri-circle-line'} text-xs`} style={{ color: tr.unlocked ? tree.color : '#3a4a5a' }}></i>
                    <span className="text-xs" style={{ color: tr.unlocked ? '#c8d8e8' : '#4a5a6a' }}>{tr.name}</span>
                    {tr.isFinisher && <span className="ml-auto text-xs px-1 rounded" style={{ background: `${tree.color}20`, color: tree.color }}>Finisher</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {tab === 'Ascension Perks' && (
          <div className="space-y-2">
            <div className="text-xs mb-2" style={{ color: '#6b8aaa' }}>Ascension Perks: <span style={{ color: '#c9a227' }}>3 / 8 unlocked</span></div>
            {ASCENSION_PERKS.map(p => (
              <div key={p.name} className="flex items-center gap-3 rounded p-3" style={{ background: p.unlocked ? `${p.color}08` : 'rgba(0,0,0,0.2)', border: `1px solid ${p.unlocked ? p.color + '30' : '#1d2d40'}` }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: p.unlocked ? `${p.color}15` : 'rgba(0,0,0,0.3)', border: `1px solid ${p.unlocked ? p.color + '40' : '#1d2d40'}` }}>
                  <i className={`${p.icon} text-lg`} style={{ color: p.unlocked ? p.color : '#3a4a5a' }}></i>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold" style={{ color: p.unlocked ? '#c8d8e8' : '#4a5a6a' }}>{p.name}</div>
                  <div className="text-xs" style={{ color: p.unlocked ? p.color : '#3a4a5a' }}>{p.desc}</div>
                </div>
                {p.unlocked && <i className="ri-checkbox-circle-fill text-lg" style={{ color: p.color }}></i>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
