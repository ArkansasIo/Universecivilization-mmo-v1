import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import SpaceCanvas from '../../components/feature/SpaceCanvas';
import { Planet3D, Star3D } from '../../components/feature/Planet3D';
import type { PlanetType, StarType } from '../../components/feature/Planet3D';

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type SecurityLevel = 'High Sec' | 'Low Sec' | 'Null Sec' | 'Wormhole';
type FactionName = 'Stellar Empire' | 'Void Collective' | 'Iron Federation' | 'Merchant Guild' | 'Nomad Clans' | null;

interface Sector {
  id: string;
  name: string;
  gridX: number;
  gridY: number;
  galaxyId: string;
  systems: number;
  controlledBy: FactionName;
  securityLevel: SecurityLevel;
  resources: { metal: number; crystal: number; deuterium: number };
  stations: number;
  traffic: number;
  dangerLevel: number;
  starType: StarType;
  planetType: PlanetType;
  fleets: number;
  contested: boolean;
}

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const FACTIONS: Record<string, { color: string; bg: string; icon: string }> = {
  'Stellar Empire':   { color: '#f87171', bg: 'rgba(248,113,113,0.12)', icon: 'ri-sword-line' },
  'Void Collective':  { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', icon: 'ri-eye-line' },
  'Iron Federation':  { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  icon: 'ri-shield-line' },
  'Merchant Guild':   { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  icon: 'ri-store-2-line' },
  'Nomad Clans':      { color: '#34d399', bg: 'rgba(52,211,153,0.12)',  icon: 'ri-compass-3-line' },
};

const SEC_STYLES: Record<SecurityLevel, { label: string; color: string; bg: string }> = {
  'High Sec':  { label: 'High Sec',  color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  'Low Sec':   { label: 'Low Sec',   color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  'Null Sec':  { label: 'Null Sec',  color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  'Wormhole':  { label: 'Wormhole',  color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
};

const GALAXIES = ['Andromeda Prime', 'Milky Way Nexus', 'Triangulum Expanse', 'Centaurus Cluster'];
const FACTION_NAMES: FactionName[] = ['Stellar Empire', 'Void Collective', 'Iron Federation', 'Merchant Guild', 'Nomad Clans', null];
const SEC_LEVELS: SecurityLevel[] = ['High Sec', 'Low Sec', 'Null Sec', 'Wormhole'];
const STAR_TYPES: StarType[] = ['G', 'K', 'M', 'F', 'A', 'B', 'O', 'red_giant'];
const PLANET_TYPES: PlanetType[] = ['terrestrial', 'desert', 'ice', 'volcanic', 'ocean', 'gas_giant', 'jungle', 'barren', 'crystal'];

/* ─────────────────────────────────────────────
   SECTOR GRID VIEWPORT
───────────────────────────────────────────── */
const CELL = 90;
const COLS = 10;
const ROWS = 10;

function SectorGridViewport({
  sectors,
  selectedSector,
  onSelectSector,
}: {
  sectors: Sector[];
  selectedSector: Sector | null;
  onSelectSector: (s: Sector | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cam, setCam] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [camStart, setCamStart] = useState({ x: 0, y: 0 });
  const [hoveredSector, setHoveredSector] = useState<Sector | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  // Sector lookup by grid position
  const sectorGrid = useMemo(() => {
    const m = new Map<string, Sector>();
    sectors.forEach((s) => m.set(`${s.gridX},${s.gridY}`, s));
    return m;
  }, [sectors]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setCanvasSize({ w: Math.floor(width), h: Math.floor(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Center on load
  useEffect(() => {
    const totalW = COLS * CELL;
    const totalH = ROWS * CELL;
    setCam({ x: (canvasSize.w - totalW * zoom) / 2, y: (canvasSize.h - totalH * zoom) / 2 });
  }, [canvasSize.w, canvasSize.h]);

  const worldToScreen = useCallback((wx: number, wy: number) => ({
    sx: wx * zoom + cam.x,
    sy: wy * zoom + cam.y,
  }), [zoom, cam]);

  const screenToGrid = useCallback((sx: number, sy: number) => ({
    gx: Math.floor((sx - cam.x) / (CELL * zoom)),
    gy: Math.floor((sy - cam.y) / (CELL * zoom)),
  }), [zoom, cam]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { w, h } = canvasSize;
    canvas.width = w;
    canvas.height = h;
    timeRef.current += 0.016;
    const t = timeRef.current;

    // Background
    ctx.fillStyle = '#020408';
    ctx.fillRect(0, 0, w, h);

    // Starfield
    for (let i = 0; i < 150; i++) {
      const bx = (i * 137.5 * 7) % w;
      const by = (i * 97.3 * 11) % h;
      ctx.fillStyle = `rgba(255,255,255,${0.05 + Math.sin(t + i) * 0.02})`;
      ctx.fillRect(bx, by, 1, 1);
    }

    const cellPx = CELL * zoom;

    // Draw sectors
    for (let gy = 0; gy < ROWS; gy++) {
      for (let gx = 0; gx < COLS; gx++) {
        const { sx, sy } = worldToScreen(gx * CELL, gy * CELL);
        if (sx + cellPx < 0 || sx > w || sy + cellPx < 0 || sy > h) continue;

        const sector = sectorGrid.get(`${gx},${gy}`);
        const isSelected = sector?.id === selectedSector?.id;
        const isHovered = sector?.id === hoveredSector?.id;

        // Cell background
        const faction = sector?.controlledBy ? FACTIONS[sector.controlledBy] : null;
        ctx.fillStyle = faction ? faction.bg : 'rgba(255,255,255,0.02)';
        ctx.fillRect(sx, sy, cellPx - 1, cellPx - 1);

        // Border
        ctx.strokeStyle = isSelected
          ? '#00d4ff'
          : isHovered
          ? 'rgba(255,255,255,0.3)'
          : faction
          ? `${faction.color}30`
          : 'rgba(255,255,255,0.06)';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.strokeRect(sx, sy, cellPx - 1, cellPx - 1);

        if (!sector) continue;

        // Security color strip (top)
        const secStyle = SEC_STYLES[sector.securityLevel];
        ctx.fillStyle = secStyle.color;
        ctx.fillRect(sx, sy, cellPx - 1, 3);

        // Contested flash
        if (sector.contested) {
          ctx.fillStyle = `rgba(248,113,113,${0.1 + Math.sin(t * 4) * 0.08})`;
          ctx.fillRect(sx, sy, cellPx - 1, cellPx - 1);
        }

        if (zoom < 0.5) continue; // Skip labels at low zoom

        // Sector name
        ctx.font = `bold ${Math.max(8, 10 * zoom)}px Inter, sans-serif`;
        ctx.fillStyle = isSelected ? '#00d4ff' : 'rgba(200,210,230,0.8)';
        ctx.textAlign = 'center';
        ctx.fillText(sector.name, sx + cellPx / 2, sy + 18 * zoom);

        // Systems count
        ctx.font = `${Math.max(7, 9 * zoom)}px Inter, sans-serif`;
        ctx.fillStyle = 'rgba(0,212,255,0.7)';
        ctx.fillText(`${sector.systems} sys`, sx + cellPx / 2, sy + 30 * zoom);

        // Faction name
        if (sector.controlledBy && faction) {
          ctx.fillStyle = faction.color;
          ctx.font = `${Math.max(7, 8 * zoom)}px Inter, sans-serif`;
          const fName = sector.controlledBy.split(' ')[0];
          ctx.fillText(fName, sx + cellPx / 2, sy + cellPx - 18 * zoom);
        }

        // Fleet indicator
        if (sector.fleets > 0) {
          ctx.fillStyle = '#60a5fa';
          ctx.font = `${Math.max(8, 9 * zoom)}px sans-serif`;
          ctx.textAlign = 'right';
          ctx.fillText(`▲${sector.fleets}`, sx + cellPx - 6, sy + 16 * zoom);
        }

        // Station indicator
        if (sector.stations > 0) {
          ctx.fillStyle = '#fbbf24';
          ctx.textAlign = 'left';
          ctx.fillText(`⬡${sector.stations}`, sx + 6, sy + 16 * zoom);
        }

        ctx.textAlign = 'left';

        // Danger bar (bottom)
        const dangerW = ((cellPx - 4) * sector.dangerLevel) / 10;
        ctx.fillStyle = sector.dangerLevel > 7 ? '#f87171' : sector.dangerLevel > 4 ? '#fbbf24' : '#34d399';
        ctx.fillRect(sx + 2, sy + cellPx - 5, dangerW, 3);
      }
    }

    // Selection glow
    if (selectedSector) {
      const { sx, sy } = worldToScreen(selectedSector.gridX * CELL, selectedSector.gridY * CELL);
      ctx.save();
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx, sy, cellPx - 1, cellPx - 1);
      ctx.restore();
    }

    animRef.current = requestAnimationFrame(draw);
  }, [canvasSize, sectorGrid, worldToScreen, selectedSector, hoveredSector, zoom]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setCamStart({ ...cam });
  }, [cam]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    if (dragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setCam({ x: camStart.x + dx, y: camStart.y + dy });
      return;
    }

    const { gx, gy } = screenToGrid(sx, sy);
    const s = sectorGrid.get(`${gx},${gy}`);
    setHoveredSector(s ?? null);
  }, [dragging, dragStart, camStart, screenToGrid, sectorGrid]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    const moved = Math.hypot(e.clientX - dragStart.x, e.clientY - dragStart.y);
    if (moved < 5) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const { gx, gy } = screenToGrid(sx, sy);
      const s = sectorGrid.get(`${gx},${gy}`);
      onSelectSector(s ?? null);
    }
    setDragging(false);
  }, [dragStart, screenToGrid, sectorGrid, onSelectSector]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.15 : 0.87;
    const newZoom = Math.max(0.3, Math.min(3, zoom * factor));
    const newCamX = mx - (mx - cam.x) * (newZoom / zoom);
    const newCamY = my - (my - cam.y) * (newZoom / zoom);
    setZoom(newZoom);
    setCam({ x: newCamX, y: newCamY });
  }, [zoom, cam]);

  // WASD
  useEffect(() => {
    const keys = new Set<string>();
    const onDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      keys.add(e.key.toLowerCase());
    };
    const onUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());
    let raf: number;
    const tick = () => {
      const speed = 6;
      let dx = 0, dy = 0;
      if (keys.has('arrowleft') || keys.has('a')) dx += speed;
      if (keys.has('arrowright') || keys.has('d')) dx -= speed;
      if (keys.has('arrowup') || keys.has('w')) dy += speed;
      if (keys.has('arrowdown') || keys.has('s')) dy -= speed;
      if (dx !== 0 || dy !== 0) setCam((c) => ({ x: c.x + dx, y: c.y + dy }));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{ cursor: dragging ? 'grabbing' : hoveredSector ? 'pointer' : 'grab' }}
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.w}
        height={canvasSize.h}
        className="absolute inset-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Hover tooltip */}
      {hoveredSector && !dragging && (
        <div
          className="absolute z-20 pointer-events-none px-3 py-2 rounded-lg text-xs"
          style={{
            left: 20,
            bottom: 60,
            background: 'rgba(2,4,12,0.95)',
            border: '1px solid rgba(0,212,255,0.2)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <p className="font-bold text-white mb-1">{hoveredSector.name}</p>
          <p className="text-gray-400">{hoveredSector.galaxyId} · {hoveredSector.systems} systems</p>
          <p style={{ color: SEC_STYLES[hoveredSector.securityLevel].color }}>{hoveredSector.securityLevel}</p>
          {hoveredSector.controlledBy && (
            <p style={{ color: FACTIONS[hoveredSector.controlledBy]?.color }}>{hoveredSector.controlledBy}</p>
          )}
        </div>
      )}

      {/* Controls hint */}
      <div className="absolute top-3 left-3 z-10 text-xs space-y-0.5" style={{ color: 'rgba(0,212,255,0.4)' }}>
        <div>WASD — Pan · Scroll — Zoom</div>
        <div>Click — Select sector</div>
      </div>

      {/* Zoom */}
      <div className="absolute top-3 right-3 z-10 text-xs font-mono" style={{ color: 'rgba(0,212,255,0.5)' }}>
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTOR DETAIL PANEL
───────────────────────────────────────────── */
function SectorDetailPanel({ sector, onClose }: { sector: Sector; onClose: () => void }) {
  const faction = sector.controlledBy ? FACTIONS[sector.controlledBy] : null;
  const secStyle = SEC_STYLES[sector.securityLevel];

  return (
    <div
      className="absolute top-0 right-0 bottom-0 z-20 flex flex-col overflow-hidden"
      style={{
        width: 320,
        background: 'rgba(2,4,12,0.97)',
        borderLeft: '1px solid rgba(0,212,255,0.15)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
        <div>
          <h3 className="text-sm font-bold text-white">{sector.name}</h3>
          <p className="text-xs text-gray-400">{sector.galaxyId}</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer">
          <i className="ri-close-line text-sm"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 3D preview */}
        <div className="relative rounded-xl overflow-hidden h-36">
          <SpaceCanvas starCount={80} showNebulae animated={false} />
          <div className="absolute inset-0 flex items-center justify-center gap-6 z-10">
            <Star3D type={sector.starType} size={60} animate useImage />
            <Planet3D type={sector.planetType} size={50} animate useImage />
          </div>
          {/* Security badge */}
          <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-xs font-bold" style={{ background: secStyle.bg, color: secStyle.color, border: `1px solid ${secStyle.color}40` }}>
            {secStyle.label}
          </div>
          {sector.contested && (
            <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded text-xs font-bold text-red-400" style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)' }}>
              CONTESTED
            </div>
          )}
        </div>

        {/* Faction */}
        {faction && sector.controlledBy && (
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: faction.bg, border: `1px solid ${faction.color}30` }}>
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: `${faction.color}20` }}>
              <i className={`${faction.icon} text-sm`} style={{ color: faction.color }}></i>
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: faction.color }}>{sector.controlledBy}</p>
              <p className="text-xs text-gray-400">Controlling Faction</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Systems', val: sector.systems, color: 'text-cyan-400', icon: 'ri-star-line' },
            { label: 'Stations', val: sector.stations, color: 'text-amber-400', icon: 'ri-building-4-line' },
            { label: 'Fleets', val: sector.fleets, color: 'text-sky-400', icon: 'ri-rocket-2-line' },
            { label: 'Traffic', val: `${sector.traffic}/h`, color: 'text-green-400', icon: 'ri-route-line' },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <i className={`${s.icon} text-xs`} style={{ color: s.color.replace('text-', '') === s.color ? '#fff' : undefined }}></i>
                <span className="text-xs text-gray-500">{s.label}</span>
              </div>
              <p className={`text-lg font-bold ${s.color}`}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Danger */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-500">Danger Level</span>
            <span className={sector.dangerLevel > 7 ? 'text-red-400' : sector.dangerLevel > 4 ? 'text-amber-400' : 'text-green-400'}>
              {sector.dangerLevel}/10
            </span>
          </div>
          <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${sector.dangerLevel * 10}%`,
                background: sector.dangerLevel > 7 ? '#f87171' : sector.dangerLevel > 4 ? '#fbbf24' : '#34d399',
              }}
            />
          </div>
        </div>

        {/* Resources */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Resources</p>
          <div className="space-y-2">
            {[
              { label: 'Metal', val: sector.resources.metal, color: '#fcd34d', icon: 'ri-copper-coin-line' },
              { label: 'Crystal', val: sector.resources.crystal, color: '#60a5fa', icon: 'ri-drop-line' },
              { label: 'Deuterium', val: sector.resources.deuterium, color: '#4ade80', icon: 'ri-drop-line' },
            ].map((r) => (
              <div key={r.label} className="flex items-center gap-2">
                <i className={`${r.icon} text-sm`} style={{ color: r.color }}></i>
                <span className="text-xs text-gray-400 w-16">{r.label}</span>
                <div className="flex-1 rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${(r.val / 1000000) * 100}%`, background: r.color }} />
                </div>
                <span className="text-xs font-semibold text-white w-12 text-right">{(r.val / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 flex-shrink-0 space-y-2" style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}>
        <button className="w-full py-2 rounded-lg text-sm font-bold text-white whitespace-nowrap cursor-pointer" style={{ background: 'linear-gradient(135deg, #00b4d8, #7209b7)' }}>
          <i className="ri-navigation-line mr-2"></i>Navigate Here
        </button>
        <div className="grid grid-cols-3 gap-2">
          <button className="py-1.5 rounded text-xs font-semibold text-cyan-400 whitespace-nowrap cursor-pointer" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <i className="ri-scan-line mr-1"></i>Scan
          </button>
          <button className="py-1.5 rounded text-xs font-semibold text-green-400 whitespace-nowrap cursor-pointer" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
            <i className="ri-flag-line mr-1"></i>Claim
          </button>
          <button className="py-1.5 rounded text-xs font-semibold text-red-400 whitespace-nowrap cursor-pointer" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>
            <i className="ri-sword-line mr-1"></i>Attack
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function SectorsPage() {
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [filterSecurity, setFilterSecurity] = useState<string>('all');
  const [filterControl, setFilterControl] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [activeTab, setActiveTab] = useState<'overview' | 'factions' | 'stats'>('overview');

  // Generate sectors on a 10x10 grid
  const sectors = useMemo<Sector[]>(() => {
    const data: Sector[] = [];
    for (let gy = 0; gy < ROWS; gy++) {
      for (let gx = 0; gx < COLS; gx++) {
        const i = gy * COLS + gx;
        const seed = i * 1103515245 + 12345;
        const pseudo = (seed ^ (seed >> 16)) & 0x7fffffff;
        const security = SEC_LEVELS[pseudo % SEC_LEVELS.length];
        const dangerLevel =
          security === 'High Sec' ? (pseudo % 3) + 1 :
          security === 'Low Sec' ? (pseudo % 4) + 3 :
          security === 'Null Sec' ? (pseudo % 3) + 7 :
          (pseudo % 5) + 5;
        const factionIdx = pseudo % FACTION_NAMES.length;
        const faction = FACTION_NAMES[factionIdx];
        data.push({
          id: `sector-${i}`,
          name: `${String.fromCharCode(65 + gy)}-${gx + 1}`,
          gridX: gx,
          gridY: gy,
          galaxyId: GALAXIES[pseudo % GALAXIES.length],
          systems: (pseudo % 50) + 10,
          controlledBy: faction,
          securityLevel: security,
          resources: {
            metal: ((pseudo % 1000) + 100) * 1000,
            crystal: ((pseudo % 500) + 50) * 1000,
            deuterium: ((pseudo % 250) + 25) * 1000,
          },
          stations: pseudo % 10,
          traffic: pseudo % 1000,
          dangerLevel,
          starType: STAR_TYPES[pseudo % STAR_TYPES.length],
          planetType: PLANET_TYPES[pseudo % PLANET_TYPES.length],
          fleets: (pseudo % 8),
          contested: (pseudo % 12) === 0,
        });
      }
    }
    return data;
  }, []);

  const filteredSectors = useMemo(() => {
    return sectors.filter((s) => {
      const matchSec = filterSecurity === 'all' || s.securityLevel === filterSecurity;
      const matchCtrl =
        filterControl === 'all' ||
        (filterControl === 'controlled' && s.controlledBy !== null) ||
        (filterControl === 'independent' && s.controlledBy === null) ||
        s.controlledBy === filterControl;
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.galaxyId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.controlledBy ?? '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchSec && matchCtrl && matchSearch;
    });
  }, [sectors, filterSecurity, filterControl, searchQuery]);

  // Stats
  const stats = useMemo(() => ({
    highSec: sectors.filter((s) => s.securityLevel === 'High Sec').length,
    lowSec: sectors.filter((s) => s.securityLevel === 'Low Sec').length,
    nullSec: sectors.filter((s) => s.securityLevel === 'Null Sec').length,
    wormhole: sectors.filter((s) => s.securityLevel === 'Wormhole').length,
    contested: sectors.filter((s) => s.contested).length,
    totalSystems: sectors.reduce((a, s) => a + s.systems, 0),
    totalStations: sectors.reduce((a, s) => a + s.stations, 0),
    totalFleets: sectors.reduce((a, s) => a + s.fleets, 0),
  }), [sectors]);

  const factionStats = useMemo(() => {
    const counts: Record<string, number> = {};
    sectors.forEach((s) => {
      if (s.controlledBy) counts[s.controlledBy] = (counts[s.controlledBy] ?? 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [sectors]);

  return (
    <div className="text-white" style={{ minHeight: 'calc(100vh - 96px)' }}>
      {/* Hero */}
      <div className="relative h-40 overflow-hidden" style={{ background: '#020408' }}>
        <SpaceCanvas starCount={300} showNebulae />
        <div className="absolute inset-0 flex items-center px-6 z-10">
          <div>
            <h1 className="text-4xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-400">
              SECTOR CONTROL
            </h1>
            <p className="text-gray-400 text-sm mt-1">Monitor and control sectors across the galaxy</p>
          </div>
          <div className="ml-auto flex gap-6">
            {[
              { label: 'Total Sectors', val: sectors.length, color: 'text-cyan-400' },
              { label: 'Systems', val: stats.totalSystems.toLocaleString(), color: 'text-purple-400' },
              { label: 'Contested', val: stats.contested, color: 'text-red-400' },
              { label: 'Fleets', val: stats.totalFleets, color: 'text-sky-400' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className={`text-2xl font-black ${s.color}`}>{s.val}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-2" style={{ borderBottom: '1px solid rgba(0,212,255,0.08)', background: 'rgba(2,4,12,0.9)' }}>
        {/* Security stats */}
        <div className="flex gap-2">
          {[
            { label: 'High', val: stats.highSec, color: '#34d399' },
            { label: 'Low', val: stats.lowSec, color: '#fbbf24' },
            { label: 'Null', val: stats.nullSec, color: '#f87171' },
            { label: 'WH', val: stats.wormhole, color: '#a78bfa' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1.5 px-2 py-1 rounded text-xs" style={{ background: `${s.color}10`, border: `1px solid ${s.color}25` }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }}></div>
              <span style={{ color: s.color }}>{s.label}: {s.val}</span>
            </div>
          ))}
        </div>

        <div className="flex-1"></div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search sectors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-1.5 rounded text-xs text-white focus:outline-none"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', width: 180 }}
        />

        {/* Filters */}
        <select
          value={filterSecurity}
          onChange={(e) => setFilterSecurity(e.target.value)}
          className="px-3 py-1.5 rounded text-xs text-white focus:outline-none"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <option value="all">All Security</option>
          <option value="High Sec">High Sec</option>
          <option value="Low Sec">Low Sec</option>
          <option value="Null Sec">Null Sec</option>
          <option value="Wormhole">Wormhole</option>
        </select>

        <select
          value={filterControl}
          onChange={(e) => setFilterControl(e.target.value)}
          className="px-3 py-1.5 rounded text-xs text-white focus:outline-none"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <option value="all">All Control</option>
          <option value="controlled">Controlled</option>
          <option value="independent">Independent</option>
          {Object.keys(FACTIONS).map((f) => <option key={f} value={f}>{f}</option>)}
        </select>

        {/* View toggle */}
        <div className="flex gap-1 p-0.5 rounded" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {[{ id: 'map', icon: 'ri-map-2-line' }, { id: 'list', icon: 'ri-list-check' }].map((m) => (
            <button
              key={m.id}
              onClick={() => setViewMode(m.id as any)}
              className="px-3 py-1 rounded text-xs font-semibold whitespace-nowrap cursor-pointer transition-all"
              style={viewMode === m.id ? { background: 'linear-gradient(135deg, #00b4d8, #7209b7)', color: '#fff' } : { color: '#6b7a95' }}
            >
              <i className={m.icon}></i>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex" style={{ height: 'calc(100vh - 96px - 160px - 52px)' }}>
        {/* Left sidebar — faction/stats */}
        <div className="w-52 flex-shrink-0 overflow-y-auto p-3 space-y-3" style={{ borderRight: '1px solid rgba(255,255,255,0.05)', background: 'rgba(2,4,12,0.8)' }}>
          {/* Tabs */}
          <div className="flex gap-1 p-0.5 rounded" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {[{ id: 'overview', label: 'Overview' }, { id: 'factions', label: 'Factions' }].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className="flex-1 py-1 rounded text-xs font-semibold whitespace-nowrap cursor-pointer transition-all"
                style={activeTab === t.id ? { background: 'rgba(0,212,255,0.2)', color: '#00d4ff' } : { color: '#6b7a95' }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-2">
              {[
                { label: 'Total Sectors', val: sectors.length, color: '#00d4ff' },
                { label: 'Total Systems', val: stats.totalSystems, color: '#a78bfa' },
                { label: 'Stations', val: stats.totalStations, color: '#fbbf24' },
                { label: 'Active Fleets', val: stats.totalFleets, color: '#60a5fa' },
                { label: 'Contested', val: stats.contested, color: '#f87171' },
              ].map((s) => (
                <div key={s.label} className="flex justify-between items-center p-2 rounded" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <span className="text-xs text-gray-400">{s.label}</span>
                  <span className="text-sm font-bold" style={{ color: s.color }}>{s.val}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'factions' && (
            <div className="space-y-2">
              {factionStats.map(([name, count]) => {
                const f = FACTIONS[name];
                const pct = Math.round((count / sectors.length) * 100);
                return (
                  <div key={name} className="p-2 rounded" style={{ background: f.bg, border: `1px solid ${f.color}20` }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <i className={`${f.icon} text-xs`} style={{ color: f.color }}></i>
                      <span className="text-xs font-semibold" style={{ color: f.color }}>{name.split(' ')[0]}</span>
                      <span className="ml-auto text-xs text-gray-400">{count}</span>
                    </div>
                    <div className="w-full rounded-full h-1" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-1 rounded-full" style={{ width: `${pct}%`, background: f.color }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{pct}% control</p>
                  </div>
                );
              })}
              <div className="p-2 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-xs text-gray-500">Independent: {sectors.filter((s) => !s.controlledBy).length}</span>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Legend</p>
            <div className="space-y-1">
              {Object.entries(SEC_STYLES).map(([key, s]) => (
                <div key={key} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-1.5 rounded-full" style={{ background: s.color }}></div>
                  <span className="text-gray-400">{s.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 text-xs mt-1">
                <div className="w-3 h-1.5 rounded-full bg-red-400 opacity-50"></div>
                <span className="text-gray-400">Contested</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main viewport */}
        <div className="flex-1 relative overflow-hidden">
          {viewMode === 'map' ? (
            <div className="relative w-full h-full">
              <SectorGridViewport
                sectors={sectors}
                selectedSector={selectedSector}
                onSelectSector={setSelectedSector}
              />
              {selectedSector && (
                <SectorDetailPanel
                  sector={selectedSector}
                  onClose={() => setSelectedSector(null)}
                />
              )}
            </div>
          ) : (
            /* List view */
            <div className="overflow-y-auto h-full p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredSectors.map((sector) => {
                  const faction = sector.controlledBy ? FACTIONS[sector.controlledBy] : null;
                  const secStyle = SEC_STYLES[sector.securityLevel];
                  return (
                    <div
                      key={sector.id}
                      onClick={() => setSelectedSector(sector)}
                      className="rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02]"
                      style={{
                        background: selectedSector?.id === sector.id ? 'rgba(0,212,255,0.06)' : 'rgba(255,255,255,0.02)',
                        border: selectedSector?.id === sector.id ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-sm font-bold text-white">{sector.name}</h3>
                          <p className="text-xs text-gray-400">{sector.galaxyId}</p>
                        </div>
                        <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ background: secStyle.bg, color: secStyle.color }}>
                          {secStyle.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <Star3D type={sector.starType} size={32} animate={false} useImage />
                        <Planet3D type={sector.planetType} size={28} animate={false} useImage />
                        {sector.contested && (
                          <span className="text-xs text-red-400 ml-auto">CONTESTED</span>
                        )}
                      </div>

                      <div className="space-y-1 text-xs mb-3">
                        <div className="flex justify-between"><span className="text-gray-500">Systems</span><span className="text-cyan-400 font-semibold">{sector.systems}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Stations</span><span className="text-amber-400 font-semibold">{sector.stations}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Danger</span><span className={sector.dangerLevel > 7 ? 'text-red-400' : sector.dangerLevel > 4 ? 'text-amber-400' : 'text-green-400'}>{sector.dangerLevel}/10</span></div>
                      </div>

                      {faction && sector.controlledBy && (
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: faction.color }}>
                          <i className={`${faction.icon} text-xs`}></i>
                          <span>{sector.controlledBy}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
