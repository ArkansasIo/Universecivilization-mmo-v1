import { useState } from 'react';

const TABS = ['Operatives', 'Operations', 'Counter-Intel', 'Intel'];

const OPERATIVES = [
  { name: 'Agent Vex', level: 7, location: 'Zircon Hegemony', mission: 'Gather Intel', skill: 'Saboteur', icon: 'ri-spy-line', progress: 68 },
  { name: 'Agent Nyx', level: 5, location: 'Vorlon Extinction', mission: 'Steal Tech', skill: 'Infiltrator', icon: 'ri-user-search-line', progress: 34 },
  { name: 'Agent Kira', level: 6, location: 'Aetherion Prime', mission: 'Training', skill: 'Handler', icon: 'ri-user-star-line', progress: 90 },
  { name: 'Agent Dross', level: 4, location: 'Unassigned', mission: 'Idle', skill: 'Analyst', icon: 'ri-user-line', progress: 0 },
];

const OPERATIONS = [
  { name: 'Steal Tech: Shields', target: 'Zircon Hegemony', risk: 'Medium', reward: 'Deflector Tech', icon: 'ri-shield-line', days: 85, color: '#c9a227' },
  { name: 'Sabotage Shipyard', target: 'Vorlon Extinction', risk: 'High', reward: '-30% Ship Production', icon: 'ri-tools-line', days: 120, color: '#e87a5a' },
  { name: 'Diplomatic Backdoor', target: 'Kethri Coalition', risk: 'Low', reward: '+50 Opinion', icon: 'ri-message-2-line', days: 45, color: '#3aaa5e' },
];

const THREATS = [
  { empire: 'Zircon Hegemony', level: 'High', icon: 'ri-alarm-warning-line', color: '#e87a5a', detected: 2 },
  { empire: 'Vorlon Extinction', level: 'Critical', icon: 'ri-skull-line', color: '#ff4444', detected: 4 },
  { empire: 'Unknown', level: 'Low', icon: 'ri-question-line', color: '#c9a227', detected: 1 },
];

const INTEL_REPORTS = [
  { empire: 'Zircon Hegemony', level: 68, fleets: 'Partially Known', tech: 'Unknown', planets: 'Some Known' },
  { empire: 'Kethri Coalition', level: 45, fleets: 'Unknown', tech: 'Some Known', planets: 'Unknown' },
  { empire: 'Vorlon Extinction', level: 82, fleets: 'Mostly Known', tech: 'Partially Known', planets: 'Many Known' },
];

export default function EspionagePanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState('Operatives');

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40' }}>
        <div className="flex items-center gap-2">
          <i className="ri-spy-line text-lg" style={{ color: '#e87a5a' }}></i>
          <span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Espionage</span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(232,122,90,0.15)', color: '#e87a5a' }}>4 Operatives</span>
        </div>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}>
          <i className="ri-close-line text-sm"></i>
        </button>
      </div>

      <div className="flex flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-3 py-2 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors" style={{ color: tab === t ? '#e87a5a' : '#6b8aaa', borderBottom: tab === t ? '2px solid #e87a5a' : '2px solid transparent' }}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1d2d40 transparent' }}>
        {tab === 'Operatives' && OPERATIVES.map(o => (
          <div key={o.name} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(232,122,90,0.1)', border: '1px solid rgba(232,122,90,0.25)' }}>
                <i className={`${o.icon} text-sm`} style={{ color: '#e87a5a' }}></i>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{o.name}</div>
                <div className="text-xs" style={{ color: '#6b8aaa' }}>Lv.{o.level} · {o.skill}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold" style={{ color: o.mission === 'Idle' ? '#6b8aaa' : '#c9a227' }}>{o.mission}</div>
                <div className="text-xs" style={{ color: '#6b8aaa' }}>{o.location}</div>
              </div>
            </div>
            {o.progress > 0 && (
              <div className="w-full h-1 rounded-full" style={{ background: '#1d2d40' }}>
                <div className="h-1 rounded-full" style={{ width: `${o.progress}%`, background: '#e87a5a' }}></div>
              </div>
            )}
          </div>
        ))}

        {tab === 'Operations' && (
          <>
            <div className="text-xs font-semibold mb-2" style={{ color: '#7eb8da' }}>Available Operations</div>
            {OPERATIONS.map(op => (
              <div key={op.name} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${op.color}20` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <i className={`${op.icon} text-sm`} style={{ color: op.color }}></i>
                    <span className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{op.name}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${op.color}15`, color: op.color }}>Risk: {op.risk}</span>
                </div>
                <div className="flex items-center justify-between text-xs mb-2" style={{ color: '#6b8aaa' }}>
                  <span>Target: {op.target}</span>
                  <span>~{op.days} days</span>
                </div>
                <div className="text-xs mb-2" style={{ color: '#3aaa5e' }}>Reward: {op.reward}</div>
                <button className="w-full py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: `${op.color}12`, border: `1px solid ${op.color}30`, color: op.color }}>
                  Launch Operation
                </button>
              </div>
            ))}
          </>
        )}

        {tab === 'Counter-Intel' && (
          <>
            <div className="text-xs font-semibold mb-2" style={{ color: '#7eb8da' }}>Detected Threats</div>
            {THREATS.map(t => (
              <div key={t.empire} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${t.color}20` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <i className={`${t.icon} text-sm`} style={{ color: t.color }}></i>
                    <span className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{t.empire}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${t.color}15`, color: t.color }}>{t.level}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: '#6b8aaa' }}>Operatives detected: <span style={{ color: t.color }}>{t.detected}</span></span>
                  <button className="px-2 py-1 rounded cursor-pointer" style={{ background: 'rgba(74,157,212,0.12)', border: '1px solid rgba(74,157,212,0.25)', color: '#4a9dd4' }}>Hunt</button>
                </div>
              </div>
            ))}
            <div className="rounded p-3 mt-2" style={{ background: 'rgba(58,170,94,0.08)', border: '1px solid rgba(58,170,94,0.2)' }}>
              <div className="text-xs font-semibold mb-1" style={{ color: '#3aaa5e' }}>Counter-Intel Strength</div>
              <div className="w-full h-2 rounded-full" style={{ background: '#1d2d40' }}>
                <div className="h-2 rounded-full" style={{ width: '65%', background: '#3aaa5e' }}></div>
              </div>
              <div className="text-xs mt-1" style={{ color: '#6b8aaa' }}>65 / 100 points</div>
            </div>
          </>
        )}

        {tab === 'Intel' && INTEL_REPORTS.map(r => (
          <div key={r.empire} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{r.empire}</span>
              <span className="text-xs font-bold" style={{ color: r.level >= 70 ? '#3aaa5e' : r.level >= 40 ? '#c9a227' : '#e87a5a' }}>
                Intel: {r.level}%
              </span>
            </div>
            <div className="w-full h-1 rounded-full mb-2" style={{ background: '#1d2d40' }}>
              <div className="h-1 rounded-full" style={{ width: `${r.level}%`, background: r.level >= 70 ? '#3aaa5e' : r.level >= 40 ? '#c9a227' : '#e87a5a' }}></div>
            </div>
            {[
              { label: 'Fleets', value: r.fleets },
              { label: 'Technology', value: r.tech },
              { label: 'Planets', value: r.planets },
            ].map(i => (
              <div key={i.label} className="flex justify-between text-xs py-0.5" style={{ borderBottom: '1px solid #1d2d4050' }}>
                <span style={{ color: '#6b8aaa' }}>{i.label}</span>
                <span style={{ color: i.value === 'Unknown' ? '#3a4a5a' : '#c8d8e8' }}>{i.value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
