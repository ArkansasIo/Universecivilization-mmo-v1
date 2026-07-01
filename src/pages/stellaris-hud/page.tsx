import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import StellarisHUD from '../../components/feature/StellarisHUD/StellarisHUD';

// ── Minimal star system data ──────────────────────────────────────────────────
interface StarSystem {
  id: string;
  name: string;
  x: number;
  y: number;
  starClass: 'G' | 'K' | 'M' | 'F' | 'A' | 'B' | 'O' | 'neutron' | 'pulsar' | 'black_hole';
  controller: string | null;
  size: number;
}

const STAR_COLORS: Record<string, { core: string; glow: string }> = {
  G: { core: '#ffe08a', glow: '#ffcc44' },
  K: { core: '#ffbb55', glow: '#ff9922' },
  M: { core: '#ff7744', glow: '#ff5522' },
  F: { core: '#fffce0', glow: '#fff3aa' },
  A: { core: '#f0f4ff', glow: '#ddeeff' },
  B: { core: '#d0e0ff', glow: '#aaccff' },
  O: { core: '#c0c8ff', glow: '#8899ff' },
  neutron: { core: '#aaffff', glow: '#00ffff' },
  pulsar: { core: '#ffffff', glow: '#ff00ff' },
  black_hole: { core: '#330044', glow: '#8800ff' },
};

const EMPIRE_COLORS: Record<string, string> = {
  player: '#3aaa5e',
  zircon: '#e87a5a',
  kethri: '#4a9dd4',
  vorlon: '#ff4444',
  salfing: '#a78bfa',
  yarak: '#c9a227',
};

const SYSTEMS: StarSystem[] = [
  { id: 'sol', name: 'Sol', x: 300, y: 280, starClass: 'G', controller: 'player', size: 7 },
  { id: 'alpha', name: 'Alpha Centauri', x: 420, y: 240, starClass: 'G', controller: 'player', size: 6 },
  { id: 'epsilon', name: 'Epsilon Eridani', x: 200, y: 380, starClass: 'K', controller: 'player', size: 5 },
  { id: 'tau', name: 'Tau Ceti', x: 480, y: 350, starClass: 'G', controller: 'player', size: 6 },
  { id: 'vega', name: 'Vega', x: 150, y: 200, starClass: 'A', controller: 'player', size: 8 },
  { id: 'sirius', name: 'Sirius', x: 350, y: 160, starClass: 'A', controller: 'player', size: 9 },
  { id: 'barnard', name: "Barnard's Star", x: 560, y: 200, starClass: 'M', controller: 'player', size: 4 },
  { id: 'polaris', name: 'Polaris', x: 250, y: 100, starClass: 'F', controller: 'player', size: 7 },
  { id: 'rigol', name: 'Rigol', x: 650, y: 300, starClass: 'B', controller: 'player', size: 10 },
  { id: 'procyon', name: 'Procyon', x: 100, y: 300, starClass: 'F', controller: null, size: 5 },
  { id: 'deneb', name: 'Deneb', x: 700, y: 180, starClass: 'A', controller: 'zircon', size: 8 },
  { id: 'zircon_prime', name: 'Zircon Prime', x: 780, y: 250, starClass: 'G', controller: 'zircon', size: 7 },
  { id: 'zircon_b', name: 'Zircon II', x: 820, y: 350, starClass: 'K', controller: 'zircon', size: 5 },
  { id: 'kethri_a', name: 'Kethri Alpha', x: 600, y: 430, starClass: 'K', controller: 'kethri', size: 6 },
  { id: 'kethri_b', name: 'Kethri Beta', x: 700, y: 490, starClass: 'M', controller: 'kethri', size: 4 },
  { id: 'vorlon_prime', name: 'Vorlon Prime', x: 80, y: 450, starClass: 'B', controller: 'vorlon', size: 9 },
  { id: 'vorlon_b', name: 'Vorlon II', x: 120, y: 500, starClass: 'O', controller: 'vorlon', size: 8 },
  { id: 'salfing_a', name: 'Salfing Alpha', x: 450, y: 480, starClass: 'G', controller: 'salfing', size: 6 },
  { id: 'yarak_a', name: 'Yarak Prime', x: 350, y: 530, starClass: 'K', controller: 'yarak', size: 5 },
  { id: 'bhole1', name: 'Singularity', x: 500, y: 120, starClass: 'black_hole', controller: null, size: 6 },
  { id: 'frontier1', name: 'Unknown System', x: 850, y: 450, starClass: 'M', controller: null, size: 4 },
  { id: 'frontier2', name: 'Deep Void', x: 50, y: 180, starClass: 'K', controller: null, size: 3 },
  { id: 'neutron1', name: 'Pulsar Station', x: 650, y: 120, starClass: 'neutron', controller: null, size: 5 },
];

const HYPERLANES: [string, string][] = [
  ['sol', 'alpha'], ['sol', 'epsilon'], ['sol', 'sirius'], ['sol', 'tau'],
  ['alpha', 'barnard'], ['alpha', 'sirius'], ['alpha', 'tau'],
  ['epsilon', 'kethri_a'], ['epsilon', 'procyon'], ['epsilon', 'tau'],
  ['sirius', 'polaris'], ['sirius', 'vega'], ['sirius', 'barnard'],
  ['vega', 'polaris'], ['vega', 'procyon'],
  ['barnard', 'rigol'], ['barnard', 'deneb'],
  ['rigol', 'deneb'], ['rigol', 'kethri_a'],
  ['deneb', 'zircon_prime'], ['deneb', 'neutron1'],
  ['zircon_prime', 'zircon_b'],
  ['kethri_a', 'kethri_b'], ['kethri_a', 'salfing_a'],
  ['salfing_a', 'yarak_a'], ['salfing_a', 'tau'],
  ['procyon', 'vorlon_prime'],
  ['vorlon_prime', 'vorlon_b'], ['vorlon_prime', 'frontier2'],
  ['yarak_a', 'epsilon'], ['tau', 'rigol'],
  ['bhole1', 'polaris'], ['bhole1', 'barnard'],
  ['neutron1', 'zircon_prime'], ['frontier1', 'zircon_b'],
];

const sysMap: Record<string, StarSystem> = {};
SYSTEMS.forEach(s => { sysMap[s.id] = s; });

const MAP_W = 920;
const MAP_H = 580;

function StarNode({ sys, scale, selected, onSelect }: { sys: StarSystem; scale: number; selected: boolean; onSelect: (s: StarSystem) => void }) {
  const col = STAR_COLORS[sys.starClass];
  const empireColor = sys.controller ? EMPIRE_COLORS[sys.controller] : null;
  const r = Math.max(4, sys.size * Math.min(scale, 1.5));
  return (
    <div className="absolute" style={{ left: sys.x, top: sys.y, transform: 'translate(-50%,-50%)', zIndex: 2 }}>
      {/* Territory aura */}
      {empireColor && (
        <div className="absolute rounded-full" style={{ width: r * 7, height: r * 7, left: '50%', top: '50%', transform: 'translate(-50%,-50%)', background: `radial-gradient(circle, ${empireColor}18 0%, ${empireColor}06 60%, transparent 100%)`, border: `1px solid ${empireColor}28`, pointerEvents: 'none' }} />
      )}
      {/* Star glow */}
      <div className="absolute rounded-full" style={{ width: r * 2.8, height: r * 2.8, left: '50%', top: '50%', transform: 'translate(-50%,-50%)', background: `radial-gradient(circle, ${col.glow}55 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <button
        onClick={() => onSelect(sys)}
        className="relative flex items-center justify-center cursor-pointer transition-all"
        style={{ width: r * 2.4, height: r * 2.4, borderRadius: '50%', background: `radial-gradient(circle, ${col.core} 40%, ${col.glow} 100%)`, boxShadow: selected ? `0 0 ${r * 4}px ${col.glow}, 0 0 ${r * 2}px ${col.core}` : `0 0 ${r * 1.5}px ${col.glow}80`, border: selected ? `2px solid ${col.core}` : 'none', outline: 'none' }}
      />
      {scale > 0.65 && (
        <div className="absolute w-max text-center" style={{ top: r * 1.4, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
          <div style={{ color: '#c8d8e8', fontSize: Math.max(8, 9 * scale), fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.9)', letterSpacing: 0.3 }}>{sys.name}</div>
        </div>
      )}
    </div>
  );
}

function GalaxyMap() {
  const [scale, setScale] = useState(1.0);
  const [offsetX, setOffsetX] = useState(-20);
  const [offsetY, setOffsetY] = useState(-20);
  const [selected, setSelected] = useState<string | null>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { isDragging.current = true; dragStart.current = { x: e.clientX, y: e.clientY, ox: offsetX, oy: offsetY }; }
  }, [offsetX, offsetY]);
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setOffsetX(dragStart.current.ox + (e.clientX - dragStart.current.x) / scale);
    setOffsetY(dragStart.current.oy + (e.clientY - dragStart.current.y) / scale);
  }, [scale]);
  const onMouseUp = useCallback(() => { isDragging.current = false; }, []);
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale(s => Math.max(0.3, Math.min(2.5, s + (e.deltaY > 0 ? -0.1 : 0.1))));
  }, []);

  // Draw stars-in-background effect
  const [stars] = useState(() => Array.from({ length: 200 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    s: Math.random() * 1.5 + 0.3,
    o: Math.random() * 0.7 + 0.1,
  })));

  return (
    <div
      ref={containerRef}
      className="w-full h-full select-none overflow-hidden cursor-grab"
      style={{ background: 'radial-gradient(ellipse at 35% 45%, rgba(18,8,38,1) 0%, rgba(5,5,14,1) 60%, rgba(2,3,10,1) 100%)' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
    >
      {/* Background stars */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.55 }}>
        {stars.map((s, i) => (
          <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.s} fill="white" opacity={s.o} />
        ))}
      </svg>

      {/* Nebula effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ position: 'absolute', left: '30%', top: '25%', width: 350, height: 250, background: 'radial-gradient(ellipse, rgba(40,20,80,0.25) 0%, transparent 70%)', borderRadius: '50%', transform: 'rotate(-20deg)' }} />
        <div style={{ position: 'absolute', left: '55%', top: '55%', width: 280, height: 200, background: 'radial-gradient(ellipse, rgba(10,40,80,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', left: '10%', top: '60%', width: 200, height: 160, background: 'radial-gradient(ellipse, rgba(80,10,10,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* Zoomable canvas */}
      <div
        className="absolute"
        style={{ left: 0, top: 0, transform: `translate(${offsetX * scale}px, ${offsetY * scale}px) scale(${scale})`, transformOrigin: '0 0', width: MAP_W, height: MAP_H }}
      >
        {/* Hyperlanes */}
        <svg className="absolute" style={{ left: 0, top: 0, width: MAP_W, height: MAP_H, overflow: 'visible', pointerEvents: 'none' }}>
          {HYPERLANES.map(([a, b]) => {
            const sa = sysMap[a]; const sb = sysMap[b];
            if (!sa || !sb) return null;
            return <line key={`${a}-${b}`} x1={sa.x} y1={sa.y} x2={sb.x} y2={sb.y} stroke="rgba(100,180,255,0.12)" strokeWidth={1.2} />;
          })}
        </svg>

        {/* Star systems */}
        {SYSTEMS.map(sys => (
          <StarNode key={sys.id} sys={sys} scale={scale} selected={selected === sys.id} onSelect={s => setSelected(s.id === selected ? null : s.id)} />
        ))}
      </div>

      {/* HUD overlays: scale indicator */}
      <div className="absolute bottom-2 right-2 text-xs font-mono" style={{ color: 'rgba(100,180,255,0.25)' }}>
        ×{scale.toFixed(2)} · {SYSTEMS.length} systems
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex items-center gap-3" style={{ opacity: 0.6 }}>
        {Object.entries(EMPIRE_COLORS).slice(0, 4).map(([k, c]) => (
          <div key={k} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: c }}></div>
            <span className="text-xs capitalize" style={{ color: '#c8d8e8', fontSize: 9 }}>
              {k === 'player' ? 'Aetherion' : k.charAt(0).toUpperCase() + k.slice(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StellarisHUDPage() {
  return (
    <div className="fixed inset-0" style={{ background: '#08080f' }}>
      <StellarisHUD>
        <GalaxyMap />
      </StellarisHUD>
    </div>
  );
}
