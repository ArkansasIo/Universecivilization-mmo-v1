import { useState } from 'react';
import type { StellarisModal } from './types';

const SECTIONS = [
  {
    key: 'fleets', label: 'FLEETS', count: 7, items: [
      { name: '1st Strike Force', sub: '128/200 (160)', power: '25.3K', loc: 'Sol', color: '#3aaa5e' },
      { name: '2nd Strike Force', sub: '96/200 (120)', power: '18.7K', loc: 'Alpha Centauri', color: '#4a9dd4' },
      { name: '3rd Strike Force', sub: '64/200 (80)', power: '11.2K', loc: 'Epsilon Eridani', color: '#c9a227' },
    ],
  },
  {
    key: 'planets', label: 'PLANETS', count: 12, items: [
      { name: 'Aetherion Prime', sub: 'Continental World', power: '', loc: 'Sol', color: '#3aaa5e' },
      { name: 'New Dawn', sub: 'Ocean World', power: '', loc: 'Alpha Centauri', color: '#4a9dd4' },
      { name: 'Hope', sub: 'Ocean World', power: '', loc: 'Sirius', color: '#4a9dd4' },
      { name: 'Elysium', sub: 'Gaia World', power: '', loc: 'Tau Ceti', color: '#a78bfa' },
    ],
  },
  {
    key: 'starbases', label: 'STARBASES', count: 6, items: [
      { name: 'Sol Station', sub: 'Shipyard', power: '', loc: 'Sol', color: '#c9a227' },
      { name: 'Alpha Centauri Station', sub: 'Bastion', power: '', loc: 'Alpha Centauri', color: '#4a9dd4' },
      { name: 'Epsilon Eridani Station', sub: 'Shipyard', power: '', loc: 'Epsilon Eridani', color: '#a78bfa' },
    ],
  },
  { key: 'construction', label: 'CONSTRUCTION SHIPS', count: 4, items: [] },
  { key: 'science', label: 'SCIENCE SHIPS', count: 5, items: [] },
  { key: 'armies', label: 'ARMIES', count: 3, items: [] },
  { key: 'idle', label: 'IDLE SHIPS', count: 2, items: [] },
];

type Props = {
  setModal: (m: StellarisModal) => void;
};

export default function OutlinerPanel({ setModal }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['fleets', 'planets', 'starbases']));
  const [open, setOpen] = useState(true);

  const toggle = (k: string) => setExpanded(e => { const n = new Set(e); n.has(k) ? n.delete(k) : n.add(k); return n; });

  const MODAL_MAP: Record<string, StellarisModal> = {
    starbases: 'starbases',
    construction: 'construction',
    science: 'science',
    idle: 'shipdesigner',
  };

  if (!open) {
    return (
      <div className="fixed right-0 top-16 z-20">
        <button onClick={() => setOpen(true)} className="flex items-center gap-1 px-2 py-1.5 text-xs cursor-pointer" style={{ background: '#0e1520', border: '1px solid #1d2d40', borderRight: 'none', borderRadius: '6px 0 0 6px', color: '#6b8aaa' }}>
          <i className="ri-list-check-3"></i>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-16 bottom-0 z-20 flex flex-col overflow-hidden" style={{ width: 220, background: '#0a1018', borderLeft: '1px solid #1d2d40', borderTop: '1px solid #1d2d40' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40', background: 'rgba(0,0,0,0.3)' }}>
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#7eb8da', letterSpacing: '0.1em' }}>Outliner</span>
        <button onClick={() => setOpen(false)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}>
          <i className="ri-close-line text-xs"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1d2d40 transparent' }}>
        {SECTIONS.map(sec => (
          <div key={sec.key}>
            {/* Section header */}
            <button
              onClick={() => MODAL_MAP[sec.key] ? setModal(MODAL_MAP[sec.key]) : toggle(sec.key)}
              className="w-full flex items-center justify-between px-3 py-1.5 cursor-pointer hover:bg-white/5 transition-colors text-left"
              style={{ borderBottom: '1px solid #1d2d4080' }}
            >
              <span className="text-xs font-bold tracking-wider" style={{ color: '#5a7a9a', letterSpacing: '0.08em' }}>{sec.label}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold" style={{ color: '#4a9dd4' }}>{sec.count}</span>
                {sec.items.length > 0 && (
                  <i className={`ri-arrow-${expanded.has(sec.key) ? 'up' : 'down'}-s-line text-xs`} style={{ color: '#3a4a5a' }}></i>
                )}
              </div>
            </button>

            {/* Items */}
            {expanded.has(sec.key) && sec.items.map((item, i) => (
              <button key={i} className="w-full flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-white/5 transition-colors text-left" style={{ borderBottom: '1px solid #1d2d4040' }}>
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: item.color }}></div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate" style={{ color: '#c8d8e8' }}>{item.name}</div>
                  <div className="text-xs truncate" style={{ color: '#4a5a6a' }}>{item.sub}</div>
                </div>
                {item.power && (
                  <span className="text-xs flex-shrink-0" style={{ color: '#e87a5a' }}>★ {item.power}</span>
                )}
                {item.loc && !item.power && (
                  <span className="text-xs flex-shrink-0" style={{ color: '#3a4a5a', fontSize: 9 }}>{item.loc}</span>
                )}
              </button>
            ))}

            {expanded.has(sec.key) && sec.items.length > 0 && sec.count > sec.items.length && (
              <div className="px-3 py-1 text-xs cursor-pointer hover:underline" style={{ color: '#3a5a7a' }}>
                {sec.count - sec.items.length} more {sec.label.toLowerCase()}...
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
