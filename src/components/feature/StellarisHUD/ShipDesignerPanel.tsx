import { useState } from 'react';

const SHIP_CLASSES = ['Corvette', 'Destroyer', 'Cruiser', 'Battleship', 'Titan', 'Colossus'];

const COMPONENTS: Record<string, string[]> = {
  'Core Components': ['Tier III Reactor', 'Impulse Drive IV', 'Thrusters IV', 'Sensors IV'],
  Weapons: ['Medium Laser x2', 'Point Defense x1', 'Neutron Launcher x1', 'Empty x2'],
  Utility: ['Regenerative Hull Tissue', 'Auto-Repair System', 'Afterburners I'],
  Advanced: ['Ai Combat Computer', 'Jump Drive', 'Cloaking Device'],
};

const DESIGNS = [
  { name: 'Aetherion Destroyer', class: 'Destroyer', power: 280, hull: 800, shield: 400, armor: 300, dps: 54 },
  { name: 'Eclipse Cruiser', class: 'Cruiser', power: 680, hull: 1600, shield: 800, armor: 600, dps: 128 },
  { name: 'Horizon Battleship', class: 'Battleship', power: 1840, hull: 4000, shield: 2000, armor: 1500, dps: 380 },
  { name: 'Nebula Corvette', class: 'Corvette', power: 120, hull: 400, shield: 200, armor: 150, dps: 28 },
  { name: 'Titan Mk II', class: 'Titan', power: 12000, hull: 20000, shield: 10000, armor: 8000, dps: 2400 },
];

export default function ShipDesignerPanel({ onClose }: { onClose: () => void }) {
  const [selectedClass, setSelectedClass] = useState('Destroyer');
  const [selectedDesign, setSelectedDesign] = useState(DESIGNS[0]);
  const [activeSection, setActiveSection] = useState<string | null>('Core Components');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="flex flex-col rounded-lg overflow-hidden" style={{ width: 700, height: 700, background: '#0e1520', border: '1px solid #1d2d40', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40', background: 'rgba(0,0,0,0.3)' }}>
          <div className="flex items-center gap-2">
            <i className="ri-settings-3-line text-lg" style={{ color: '#4a9dd4' }}></i>
            <span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Ship Designer</span>
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}>
            <i className="ri-close-line text-sm"></i>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left: Design List */}
          <div className="w-48 flex flex-col flex-shrink-0 overflow-hidden" style={{ borderRight: '1px solid #1d2d40' }}>
            <div className="px-3 py-2 text-xs font-semibold" style={{ color: '#6b8aaa', borderBottom: '1px solid #1d2d40' }}>
              Ship Designs
            </div>
            <div className="flex-1 overflow-y-auto">
              {DESIGNS.map(d => (
                <button key={d.name} onClick={() => setSelectedDesign(d)} className="w-full text-left px-3 py-2 text-xs cursor-pointer hover:bg-white/5 transition-colors" style={{ background: selectedDesign.name === d.name ? 'rgba(74,157,212,0.1)' : 'transparent', borderLeft: selectedDesign.name === d.name ? '2px solid #4a9dd4' : '2px solid transparent', color: selectedDesign.name === d.name ? '#4a9dd4' : '#c8d8e8' }}>
                  <div className="font-semibold">{d.name}</div>
                  <div className="text-xs" style={{ color: '#6b8aaa' }}>{d.class} · ★ {d.power}</div>
                </button>
              ))}
            </div>
            <button className="m-2 py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(58,170,94,0.1)', border: '1px solid rgba(58,170,94,0.25)', color: '#3aaa5e' }}>
              + New Design
            </button>
          </div>

          {/* Right: Editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Ship class selector */}
            <div className="flex gap-1 p-3 flex-shrink-0 flex-wrap" style={{ borderBottom: '1px solid #1d2d40' }}>
              {SHIP_CLASSES.map(cls => (
                <button key={cls} onClick={() => setSelectedClass(cls)} className="px-2 py-1 rounded text-xs font-semibold cursor-pointer transition-colors" style={{ background: selectedClass === cls ? 'rgba(74,157,212,0.15)' : 'transparent', border: `1px solid ${selectedClass === cls ? '#4a9dd4' : '#1d2d40'}`, color: selectedClass === cls ? '#4a9dd4' : '#6b8aaa' }}>
                  {cls}
                </button>
              ))}
            </div>

            {/* Ship preview stats */}
            <div className="grid grid-cols-4 gap-2 p-3 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40' }}>
              {[
                { label: 'Power', value: selectedDesign.power.toLocaleString(), color: '#e87a5a', icon: 'ri-flashlight-line' },
                { label: 'Hull', value: selectedDesign.hull.toLocaleString(), color: '#4a9dd4', icon: 'ri-shield-line' },
                { label: 'Shield', value: selectedDesign.shield.toLocaleString(), color: '#a78bfa', icon: 'ri-circle-line' },
                { label: 'DPS', value: selectedDesign.dps.toLocaleString(), color: '#e87a5a', icon: 'ri-sword-line' },
              ].map(s => (
                <div key={s.label} className="rounded p-2 text-center" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #1d2d40' }}>
                  <i className={`${s.icon} text-sm mb-1`} style={{ color: s.color }}></i>
                  <div className="text-sm font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs" style={{ color: '#6b8aaa' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Components */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1d2d40 transparent' }}>
              {Object.entries(COMPONENTS).map(([section, items]) => (
                <div key={section} className="rounded overflow-hidden" style={{ border: '1px solid #1d2d40' }}>
                  <button onClick={() => setActiveSection(activeSection === section ? null : section)} className="w-full flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-white/5 text-xs font-semibold" style={{ background: 'rgba(0,0,0,0.3)', color: '#7eb8da' }}>
                    <span>{section}</span>
                    <i className={`ri-arrow-${activeSection === section ? 'up' : 'down'}-s-line`}></i>
                  </button>
                  {activeSection === section && (
                    <div className="p-2 space-y-1">
                      {items.map(item => (
                        <div key={item} className="flex items-center justify-between rounded px-2 py-1.5 cursor-pointer hover:bg-white/5" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #1d2d4050' }}>
                          <span className="text-xs" style={{ color: item.includes('Empty') ? '#3a4a5a' : '#c8d8e8' }}>{item}</span>
                          {!item.includes('Empty') && <i className="ri-check-line text-xs" style={{ color: '#3aaa5e' }}></i>}
                          {item.includes('Empty') && <i className="ri-add-line text-xs" style={{ color: '#3a4a5a' }}></i>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="p-3 flex gap-2 flex-shrink-0" style={{ borderTop: '1px solid #1d2d40' }}>
              <button className="flex-1 py-2 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(74,157,212,0.12)', border: '1px solid rgba(74,157,212,0.3)', color: '#4a9dd4' }}>
                Auto Design
              </button>
              <button className="flex-1 py-2 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(58,170,94,0.12)', border: '1px solid rgba(58,170,94,0.3)', color: '#3aaa5e' }}>
                Save Design
              </button>
              <button onClick={onClose} className="px-4 py-2 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1d2d40', color: '#6b8aaa' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
