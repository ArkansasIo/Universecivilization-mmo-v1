import { useState } from 'react';

const TABS = ['Overview', 'Modifiers', 'Relations', 'History'];

const EMPIRES = [
  { name: 'Zircon Hegemony', relation: 'Rival', attitude: 'Hostile', opinion: -245, power: 'Equivalent', color: '#e87a5a' },
  { name: 'Kethri Coalition', relation: 'Neutral', attitude: 'Indifferent', opinion: +33, power: 'Inferior', color: '#6b8aaa' },
  { name: 'Vorlon Extinction', relation: 'At War', attitude: 'Threatening', opinion: -350, power: 'Superior', color: '#ff4444' },
  { name: 'Salfing Starclave', relation: 'Federation', attitude: 'Friendly', opinion: +146, power: 'Inferior', color: '#3aaa5e' },
  { name: 'Union of Sirius', relation: 'Friendly', attitude: 'Cordial', opinion: +82, power: 'Equivalent', color: '#4a9dd4' },
  { name: 'Yarak Assembly', relation: 'Neutral', attitude: 'Wary', opinion: -12, power: 'Inferior', color: '#6b8aaa' },
];

const MODIFIERS = [
  { label: 'Federation Member', value: '+60', color: '#3aaa5e' },
  { label: 'Trade Agreement', value: '+20', color: '#4a9dd4' },
  { label: 'Rival Declaration', value: '-150', color: '#e87a5a' },
  { label: 'Border Friction', value: '-30', color: '#e87a5a' },
  { label: 'Research Sharing', value: '+15', color: '#a78bfa' },
  { label: 'Cultural Exchange', value: '+10', color: '#3aaa5e' },
];

const HISTORY = [
  { event: 'Declared Rival: Zircon Hegemony', date: '2348.04', color: '#e87a5a' },
  { event: 'Joined Salfing Federation', date: '2351.11', color: '#3aaa5e' },
  { event: 'Trade Agreement: Union of Sirius', date: '2352.08', color: '#4a9dd4' },
  { event: 'War declared by Vorlon Extinction', date: '2370.01', color: '#ff4444' },
  { event: 'Research sharing pact: Kethri', date: '2369.06', color: '#a78bfa' },
];

export default function DiplomacyPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState('Overview');
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40' }}>
        <div className="flex items-center gap-2">
          <i className="ri-shake-hands-line text-lg" style={{ color: '#4a9dd4' }}></i>
          <span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Diplomacy</span>
          <div className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(74,157,212,0.15)', color: '#4a9dd4' }}>
            Influence: 874
          </div>
        </div>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}>
          <i className="ri-close-line text-sm"></i>
        </button>
      </div>

      <div className="flex flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors" style={{ color: tab === t ? '#4a9dd4' : '#6b8aaa', borderBottom: tab === t ? '2px solid #4a9dd4' : '2px solid transparent' }}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1d2d40 transparent' }}>
        {tab === 'Overview' && EMPIRES.map(e => (
          <div key={e.name} onClick={() => setSelected(e.name === selected ? null : e.name)} className="rounded cursor-pointer" style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${selected === e.name ? e.color + '50' : '#1d2d40'}` }}>
            <div className="flex items-center gap-3 p-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${e.color}15` }}>
                <i className="ri-shield-line text-sm" style={{ color: e.color }}></i>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{e.name}</div>
                <div className="text-xs" style={{ color: '#6b8aaa' }}>{e.attitude} · {e.power}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold" style={{ color: e.color }}>{e.relation}</div>
                <div className="text-xs" style={{ color: e.opinion > 0 ? '#3aaa5e' : '#e87a5a' }}>
                  {e.opinion > 0 ? '+' : ''}{e.opinion}
                </div>
              </div>
            </div>
            {selected === e.name && (
              <div className="px-3 pb-3 grid grid-cols-2 gap-2">
                <button className="py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(74,157,212,0.12)', border: '1px solid rgba(74,157,212,0.25)', color: '#4a9dd4' }}>
                  <i className="ri-shake-hands-line mr-1"></i>Propose Alliance
                </button>
                <button className="py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(232,122,90,0.12)', border: '1px solid rgba(232,122,90,0.25)', color: '#e87a5a' }}>
                  <i className="ri-sword-line mr-1"></i>Declare War
                </button>
                <button className="py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(58,170,94,0.12)', border: '1px solid rgba(58,170,94,0.25)', color: '#3aaa5e' }}>
                  <i className="ri-exchange-line mr-1"></i>Trade Deal
                </button>
                <button className="py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.25)', color: '#c9a227' }}>
                  <i className="ri-message-2-line mr-1"></i>Send Message
                </button>
              </div>
            )}
          </div>
        ))}

        {tab === 'Modifiers' && (
          <div className="space-y-2">
            <div className="text-xs font-semibold mb-3" style={{ color: '#7eb8da' }}>Global Diplomatic Modifiers</div>
            {MODIFIERS.map(m => (
              <div key={m.label} className="flex items-center justify-between rounded p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
                <span className="text-xs" style={{ color: '#c8d8e8' }}>{m.label}</span>
                <span className="text-xs font-bold" style={{ color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'Relations' && (
          <div className="space-y-3">
            <div className="text-xs font-semibold mb-2" style={{ color: '#7eb8da' }}>Active Agreements</div>
            {[
              { type: 'Federation', partner: 'Salfing Starclave', color: '#3aaa5e', icon: 'ri-shield-star-line' },
              { type: 'Trade Agreement', partner: 'Union of Sirius', color: '#4a9dd4', icon: 'ri-exchange-line' },
              { type: 'Non-Aggression Pact', partner: 'Kethri Coalition', color: '#c9a227', icon: 'ri-handshake-line' },
              { type: 'Research Sharing', partner: 'Kethri Coalition', color: '#a78bfa', icon: 'ri-flask-line' },
            ].map(a => (
              <div key={`${a.type}-${a.partner}`} className="flex items-center gap-3 rounded p-3" style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${a.color}25` }}>
                <i className={`${a.icon} text-lg`} style={{ color: a.color }}></i>
                <div>
                  <div className="text-xs font-semibold" style={{ color: a.color }}>{a.type}</div>
                  <div className="text-xs" style={{ color: '#6b8aaa' }}>with {a.partner}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'History' && (
          <div className="space-y-2">
            <div className="text-xs font-semibold mb-2" style={{ color: '#7eb8da' }}>Diplomatic History</div>
            {HISTORY.map((h, i) => (
              <div key={i} className="flex items-start gap-3 rounded p-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #1d2d40' }}>
                <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: h.color }}></div>
                <div>
                  <div className="text-xs" style={{ color: '#c8d8e8' }}>{h.event}</div>
                  <div className="text-xs" style={{ color: '#6b8aaa' }}>{h.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
