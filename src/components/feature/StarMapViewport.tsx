import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useViewport, setViewport } from './ViewportControls';

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
export interface StarNode {
  id: string;
  name: string;
  x: number; // world coords
  y: number;
  type: 'G' | 'K' | 'M' | 'F' | 'A' | 'B' | 'O' | 'red_giant' | 'blue_giant' | 'white_dwarf' | 'neutron' | 'black_hole';
  planets: number;
  habitablePlanets: number;
  controlled: boolean;
  faction: string | null;
  factionColor: string;
  hasFleet: boolean;
  hasStation: boolean;
  anomaly: boolean;
  explored: boolean;
  selected?: boolean;
}

export interface HyperlaneEdge {
  from: string;
  to: string;
}

export interface FleetMarker {
  id: string;
  x: number;
  y: number;
  destX: number;
  destY: number;
  faction: string;
  color: string;
  ships: number;
  progress: number; // 0-1
  /** Fleet mission type for tooltip */
  mission?: string;
  /** Individual ship counts by type */
  shipBreakdown?: Record<string, number>;
  /** ETA display (Stardate format) */
  etaStardate?: string;
  /** Time remaining in seconds */
  timeRemaining?: number;
  /** Fleet name */
  fleetName?: string;
}

interface StarMapViewportProps {
  stars: StarNode[];
  hyperlanes: HyperlaneEdge[];
  fleets?: FleetMarker[];
  selectedStarId?: string | null;
  onSelectStar?: (star: StarNode | null) => void;
  onDoubleClickStar?: (star: StarNode) => void;
  width?: number;
  height?: number;
  className?: string;
}

/* ─────────────────────────────────────────────
   STAR COLORS
───────────────────────────────────────────── */
const STAR_COLORS: Record<string, string> = {
  G: '#FFD700', K: '#FFA500', M: '#FF4500', F: '#FFFACD',
  A: '#E0E8FF', B: '#B0C4FF', O: '#9090FF',
  red_giant: '#FF2200', blue_giant: '#4488FF',
  white_dwarf: '#FFFFFF', neutron: '#88FFFF', black_hole: '#440088',
};

const STAR_SIZES: Record<string, number> = {
  G: 5, K: 4.5, M: 3.5, F: 5.5, A: 6, B: 7, O: 8,
  red_giant: 9, blue_giant: 8, white_dwarf: 3, neutron: 3, black_hole: 6,
};

/* ─────────────────────────────────────────────
   MINIMAP
───────────────────────────────────────────── */
function Minimap({
  stars,
  camX,
  camY,
  zoom,
  canvasW,
  canvasH,
  worldBounds,
}: {
  stars: StarNode[];
  camX: number;
  camY: number;
  zoom: number;
  canvasW: number;
  canvasH: number;
  worldBounds: { minX: number; maxX: number; minY: number; maxY: number };
}) {
  const mmW = 160;
  const mmH = 100;
  const { minX, maxX, minY, maxY } = worldBounds;
  const wW = maxX - minX || 1;
  const wH = maxY - minY || 1;

  const toMM = (wx: number, wy: number) => ({
    x: ((wx - minX) / wW) * mmW,
    y: ((wy - minY) / wH) * mmH,
  });

  // Viewport rect in world coords
  const vpW = canvasW / zoom;
  const vpH = canvasH / zoom;
  const vpX = -camX / zoom;
  const vpY = -camY / zoom;

  const vpRect = {
    x: ((vpX - minX) / wW) * mmW,
    y: ((vpY - minY) / wH) * mmH,
    w: (vpW / wW) * mmW,
    h: (vpH / wH) * mmH,
  };

  return (
    <div
      className="absolute bottom-12 right-4 z-20 rounded-lg overflow-hidden"
      style={{
        width: mmW,
        height: mmH,
        background: 'rgba(2,4,12,0.92)',
        border: '1px solid rgba(0,212,255,0.2)',
      }}
    >
      <svg width={mmW} height={mmH}>
        {/* Stars */}
        {stars.map((s) => {
          const { x, y } = toMM(s.x, s.y);
          return (
            <circle
              key={s.id}
              cx={x}
              cy={y}
              r={s.controlled ? 2 : 1}
              fill={s.controlled ? s.factionColor : STAR_COLORS[s.type] ?? '#fff'}
              opacity={s.explored ? 1 : 0.3}
            />
          );
        })}
        {/* Viewport rect */}
        <rect
          x={vpRect.x}
          y={vpRect.y}
          width={Math.max(4, vpRect.w)}
          height={Math.max(4, vpRect.h)}
          fill="none"
          stroke="rgba(0,212,255,0.6)"
          strokeWidth={1}
        />
      </svg>
      <div className="absolute bottom-1 left-1 text-xs" style={{ color: 'rgba(0,212,255,0.5)', fontSize: 9 }}>
        MINIMAP
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function StarMapViewport({
  stars,
  hyperlanes,
  fleets = [],
  selectedStarId,
  onSelectStar,
  onDoubleClickStar,
  className = '',
}: StarMapViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { viewport } = useViewport();

  // Camera state (separate from global viewport for local pan)
  const [cam, setCam] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [camStart, setCamStart] = useState({ x: 0, y: 0 });
  const [hoveredStar, setHoveredStar] = useState<StarNode | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; star: StarNode } | null>(null);
  const [hoveredFleet, setHoveredFleet] = useState<FleetMarker | null>(null);
  const [fleetTooltip, setFleetTooltip] = useState<{ x: number; y: number; fleet: FleetMarker } | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);

  // World bounds
  const worldBounds = useMemo(() => {
    if (stars.length === 0) return { minX: -500, maxX: 500, minY: -500, maxY: 500 };
    const xs = stars.map((s) => s.x);
    const ys = stars.map((s) => s.y);
    const pad = 100;
    return {
      minX: Math.min(...xs) - pad,
      maxX: Math.max(...xs) + pad,
      minY: Math.min(...ys) - pad,
      maxY: Math.max(...ys) + pad,
    };
  }, [stars]);

  // Build star lookup
  const starMap = useMemo(() => {
    const m = new Map<string, StarNode>();
    stars.forEach((s) => m.set(s.id, s));
    return m;
  }, [stars]);

  // Resize observer
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
    const { minX, maxX, minY, maxY } = worldBounds;
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    setCam({ x: -cx * zoom + canvasSize.w / 2, y: -cy * zoom + canvasSize.h / 2 });
  }, [worldBounds, canvasSize.w, canvasSize.h]);

  // Sync zoom from global viewport
  useEffect(() => {
    setZoom(viewport.zoom);
  }, [viewport.zoom]);

  // Center hotkey
  useEffect(() => {
    const handler = () => {
      const { minX, maxX, minY, maxY } = worldBounds;
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      setCam({ x: -cx * zoom + canvasSize.w / 2, y: -cy * zoom + canvasSize.h / 2 });
    };
    window.addEventListener('viewport-escape', handler);
    return () => window.removeEventListener('viewport-escape', handler);
  }, [worldBounds, zoom, canvasSize]);

  // World → screen
  const worldToScreen = useCallback(
    (wx: number, wy: number) => ({
      sx: wx * zoom + cam.x,
      sy: wy * zoom + cam.y,
    }),
    [zoom, cam]
  );

  // Screen → world
  const screenToWorld = useCallback(
    (sx: number, sy: number) => ({
      wx: (sx - cam.x) / zoom,
      wy: (sy - cam.y) / zoom,
    }),
    [zoom, cam]
  );

  // Hit test
  const hitTestStar = useCallback(
    (sx: number, sy: number): StarNode | null => {
      let closest: StarNode | null = null;
      let closestDist = Infinity;
      for (const star of stars) {
        const { sx: starSx, sy: starSy } = worldToScreen(star.x, star.y);
        const r = (STAR_SIZES[star.type] ?? 5) * Math.max(1, zoom) + 6;
        const dist = Math.hypot(sx - starSx, sy - starSy);
        if (dist < r && dist < closestDist) {
          closest = star;
          closestDist = dist;
        }
      }
      return closest;
    },
    [stars, worldToScreen, zoom]
  );

  /* ── DRAW ── */
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

    // Starfield background (tiny dots)
    ctx.save();
    for (let i = 0; i < 200; i++) {
      const bx = ((i * 137.5 * 7) % w);
      const by = ((i * 97.3 * 11) % h);
      const bz = (i % 3) + 1;
      const alpha = 0.1 + (Math.sin(t * 0.5 + i) * 0.05);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillRect(bx, by, bz * 0.5, bz * 0.5);
    }
    ctx.restore();

    // Nebula clouds
    const nebulae = [
      { x: w * 0.2, y: h * 0.3, r: 180, color: 'rgba(100,0,200,0.04)' },
      { x: w * 0.7, y: h * 0.6, r: 220, color: 'rgba(0,100,200,0.04)' },
      { x: w * 0.5, y: h * 0.2, r: 150, color: 'rgba(200,50,0,0.03)' },
    ];
    nebulae.forEach((n) => {
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      grad.addColorStop(0, n.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    });

    // Hyperlanes
    ctx.save();
    hyperlanes.forEach((edge) => {
      const from = starMap.get(edge.from);
      const to = starMap.get(edge.to);
      if (!from || !to) return;
      const { sx: x1, sy: y1 } = worldToScreen(from.x, from.y);
      const { sx: x2, sy: y2 } = worldToScreen(to.x, to.y);

      // Only draw if at least one endpoint is on screen
      if (
        Math.max(x1, x2) < -50 || Math.min(x1, x2) > w + 50 ||
        Math.max(y1, y2) < -50 || Math.min(y1, y2) > h + 50
      ) return;

      const bothControlled = from.controlled && to.controlled && from.faction === to.faction;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = bothControlled
        ? `${from.factionColor}40`
        : 'rgba(0,212,255,0.08)';
      ctx.lineWidth = bothControlled ? 1.5 : 0.8;
      ctx.setLineDash(bothControlled ? [] : [4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    });
    ctx.restore();

    // Territory influence circles
    stars.filter((s) => s.controlled).forEach((s) => {
      const { sx, sy } = worldToScreen(s.x, s.y);
      const r = 40 * zoom;
      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
      grad.addColorStop(0, `${s.factionColor}18`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Fleet movement lines with animated dash offset
    fleets.forEach((fleet) => {
      const { sx: fx, sy: fy } = worldToScreen(fleet.x, fleet.y);
      const { sx: dx, sy: dy } = worldToScreen(fleet.destX, fleet.destY);

      // Skip if both ends are off screen
      if ((fx < -50 && dx < -50) || (fx > w + 50 && dx > w + 50) ||
          (fy < -50 && dy < -50) || (fy > h + 50 && dy > h + 50)) return;

      ctx.save();

      // Animated dash offset creates a "flowing" movement effect
      const dashLen = 8 * Math.max(0.5, zoom);
      const gapLen = 5 * Math.max(0.5, zoom);
      const dashOffset = (t * 40) % (dashLen + gapLen);

      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(dx, dy);
      ctx.setLineDash([dashLen, gapLen]);
      ctx.lineDashOffset = -dashOffset;
      ctx.strokeStyle = `${fleet.color}50`;
      ctx.lineWidth = 1.2 * Math.max(0.5, zoom);
      ctx.stroke();
      ctx.setLineDash([]);

      // Traveled portion — solid line
      const cx = fx + (dx - fx) * fleet.progress;
      const cy = fy + (dy - fy) * fleet.progress;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(cx, cy);
      ctx.strokeStyle = `${fleet.color}35`;
      ctx.lineWidth = 1 * Math.max(0.5, zoom);
      ctx.stroke();

      ctx.restore();
    });

    // Stars
    stars.forEach((star) => {
      const { sx, sy } = worldToScreen(star.x, star.y);
      if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) return;

      const baseR = STAR_SIZES[star.type] ?? 5;
      const r = baseR * Math.max(0.5, Math.min(2, zoom));
      const color = STAR_COLORS[star.type] ?? '#fff';
      const isSelected = star.id === selectedStarId;
      const isHovered = star.id === hoveredStar?.id;

      // Unexplored fog
      if (!star.explored) {
        ctx.save();
        ctx.globalAlpha = 0.3;
      }

      // Glow
      if (star.type !== 'black_hole') {
        const glowR = r * 3 + (isSelected ? 6 : 0) + Math.sin(t * 2 + star.x) * 1;
        const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowR);
        glow.addColorStop(0, `${color}60`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Black hole accretion disk
      if (star.type === 'black_hole') {
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(t * 0.5);
        const diskGrad = ctx.createRadialGradient(0, 0, r, 0, 0, r * 3);
        diskGrad.addColorStop(0, 'rgba(255,100,0,0.6)');
        diskGrad.addColorStop(0.5, 'rgba(200,50,0,0.3)');
        diskGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = diskGrad;
        ctx.scale(1, 0.3);
        ctx.beginPath();
        ctx.arc(0, 0, r * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Star body
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fillStyle = star.type === 'black_hole' ? '#000' : color;
      ctx.fill();

      // Selection ring
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(sx, sy, r + 5 + Math.sin(t * 3) * 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Corner brackets
        const br = r + 10;
        const bl = 6;
        [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([dx, dy]) => {
          ctx.beginPath();
          ctx.moveTo(sx + dx * br, sy + dy * (br - bl));
          ctx.lineTo(sx + dx * br, sy + dy * br);
          ctx.lineTo(sx + dx * (br - bl), sy + dy * br);
          ctx.strokeStyle = '#00d4ff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      }

      // Hover ring
      if (isHovered && !isSelected) {
        ctx.beginPath();
        ctx.arc(sx, sy, r + 4, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Faction border ring
      if (star.controlled) {
        ctx.beginPath();
        ctx.arc(sx, sy, r + 2, 0, Math.PI * 2);
        ctx.strokeStyle = star.factionColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Icons (station, fleet, anomaly)
      if (zoom > 0.6) {
        let iconX = sx + r + 3;
        if (star.hasStation) {
          ctx.fillStyle = '#fbbf24';
          ctx.font = `${Math.max(8, 10 * zoom)}px sans-serif`;
          ctx.fillText('⬡', iconX, sy - 2);
          iconX += 12;
        }
        if (star.hasFleet) {
          ctx.fillStyle = '#60a5fa';
          ctx.font = `${Math.max(8, 9 * zoom)}px sans-serif`;
          ctx.fillText('▲', iconX, sy - 2);
          iconX += 10;
        }
        if (star.anomaly) {
          ctx.fillStyle = '#f472b6';
          ctx.font = `${Math.max(8, 9 * zoom)}px sans-serif`;
          ctx.fillText('!', iconX, sy - 2);
        }
      }

      // Star name label
      if (zoom > 0.8) {
        ctx.font = `${Math.max(9, 11 * zoom)}px "Inter", sans-serif`;
        ctx.fillStyle = isSelected ? '#00d4ff' : 'rgba(200,210,230,0.7)';
        ctx.textAlign = 'center';
        ctx.fillText(star.name, sx, sy + r + 14);
        ctx.textAlign = 'left';
      }

      if (!star.explored) ctx.restore();
    });

    // Fleet markers — animated ship icons with engine trails
    fleets.forEach((fleet) => {
      const curX = fleet.x + (fleet.destX - fleet.x) * fleet.progress;
      const curY = fleet.y + (fleet.destY - fleet.y) * fleet.progress;
      const { sx, sy } = worldToScreen(curX, curY);
      if (sx < -30 || sx > w + 30 || sy < -30 || sy > h + 30) return;

      const angle = Math.atan2(fleet.destY - fleet.y, fleet.destX - fleet.x);
      const shipScale = Math.max(0.6, Math.min(1.5, zoom));
      const shipSize = 10 * shipScale;

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(angle);

      // Engine trail — fading particles behind the ship
      const trailLength = 4;
      for (let i = trailLength; i >= 1; i--) {
        const trailAlpha = 0.25 * (1 - i / (trailLength + 1));
        const trailX = -shipSize * 0.8 - i * shipSize * 0.8;
        const trailSpread = shipSize * 0.35 * (1 + Math.sin(t * 8 + i * 2.5) * 0.4);
        ctx.fillStyle = `${fleet.color}${Math.round(trailAlpha * 100).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(trailX, -trailSpread * 0.5, shipSize * 0.2 * (1 - i / trailLength), 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(trailX, trailSpread * 0.5, shipSize * 0.2 * (1 - i / trailLength), 0, Math.PI * 2);
        ctx.fill();
      }

      // Pulsing glow under the ship
      const glowPhase = Math.sin(t * 3 + parseFloat(fleet.id.slice(-4) || '0') * 0.5) * 0.3 + 0.7;
      const glowR = shipSize * 1.6 * glowPhase;
      const glow = ctx.createRadialGradient(0, 0, shipSize * 0.2, 0, 0, glowR);
      glow.addColorStop(0, `${fleet.color}60`);
      glow.addColorStop(0.5, `${fleet.color}20`);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, glowR, 0, Math.PI * 2);
      ctx.fill();

      // Ship body — elongated diamond/arrow shape
      ctx.beginPath();
      ctx.moveTo(shipSize, 0);
      ctx.lineTo(-shipSize * 0.5, shipSize * 0.45);
      ctx.lineTo(-shipSize * 0.25, 0);
      ctx.lineTo(-shipSize * 0.5, -shipSize * 0.45);
      ctx.closePath();
      ctx.fillStyle = fleet.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.8 * shipScale;
      ctx.stroke();

      // Ship core highlight
      ctx.beginPath();
      ctx.moveTo(shipSize * 0.5, 0);
      ctx.lineTo(-shipSize * 0.15, shipSize * 0.2);
      ctx.lineTo(-shipSize * 0.15, -shipSize * 0.2);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fill();

      ctx.restore();

      // Ship count badge (only if zoomed in enough)
      if (zoom > 0.5) {
        const badgeX = sx + Math.cos(angle) * (shipSize + 6) - Math.sin(angle) * (10 * shipScale);
        const badgeY = sy + Math.sin(angle) * (shipSize + 6) + Math.cos(angle) * (10 * shipScale);
        const badgeText = fleet.ships >= 1000 ? `${(fleet.ships / 1000).toFixed(0)}K` : String(fleet.ships);
        const badgeW = ctx.measureText(badgeText).width + 8;

        ctx.fillStyle = 'rgba(2,4,12,0.9)';
        ctx.strokeStyle = fleet.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(badgeX - badgeW / 2, badgeY - 7, badgeW, 14, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = fleet.color;
        ctx.font = `bold ${Math.max(8, 9 * shipScale)}px "Inter", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(badgeText, badgeX, badgeY);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
      }
    });

    animFrameRef.current = requestAnimationFrame(draw);
  }, [canvasSize, stars, hyperlanes, fleets, starMap, worldToScreen, selectedStarId, hoveredStar, zoom]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);

  /* ── Mouse handlers ── */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 2) {
      // Middle or right mouse = pan
      setDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setCamStart({ ...cam });
      return;
    }
    if (e.button === 0) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const hit = hitTestStar(sx, sy);
      if (!hit) {
        onSelectStar?.(null);
        setDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        setCamStart({ ...cam });
      }
    }
  }, [cam, hitTestStar, onSelectStar]);

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

    const hit = hitTestStar(sx, sy);
    setHoveredStar(hit);
    if (hit) {
      setTooltip({ x: sx, y: sy, star: hit });
      setHoveredFleet(null);
      setFleetTooltip(null);
      return;
    }

    // Fleet hit test — check if cursor is near any fleet marker
    let closestFleet: FleetMarker | null = null;
    let closestFleetDist = Infinity;
    const fleetHitRadius = 14 * Math.max(0.5, zoom);

    fleets.forEach((fleet) => {
      const curX = fleet.x + (fleet.destX - fleet.x) * fleet.progress;
      const curY = fleet.y + (fleet.destY - fleet.y) * fleet.progress;
      const { sx: fsx, sy: fsy } = worldToScreen(curX, curY);
      const dist = Math.hypot(sx - fsx, sy - fsy);
      if (dist < fleetHitRadius && dist < closestFleetDist) {
        closestFleet = fleet;
        closestFleetDist = dist;
      }
    });

    if (closestFleet) {
      setHoveredFleet(closestFleet);
      const curX = closestFleet.x + (closestFleet.destX - closestFleet.x) * closestFleet.progress;
      const curY = closestFleet.y + (closestFleet.destY - closestFleet.y) * closestFleet.progress;
      const { sx: fsx, sy: fsy } = worldToScreen(curX, curY);
      setFleetTooltip({ x: fsx, y: fsy, fleet: closestFleet });
      setTooltip(null);
    } else {
      setHoveredFleet(null);
      setFleetTooltip(null);
    }
  }, [dragging, dragStart, camStart, hitTestStar, fleets, worldToScreen, zoom]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (dragging) {
      const moved = Math.hypot(e.clientX - dragStart.x, e.clientY - dragStart.y);
      if (moved < 5 && e.button === 0) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;
        const hit = hitTestStar(sx, sy);
        if (hit) onSelectStar?.(hit);
      }
    }
    setDragging(false);
  }, [dragging, dragStart, hitTestStar, onSelectStar]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const hit = hitTestStar(sx, sy);
    if (hit) onDoubleClickStar?.(hit);
  }, [hitTestStar, onDoubleClickStar]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const factor = e.deltaY < 0 ? 1.15 : 0.87;
    const newZoom = Math.max(0.2, Math.min(4, zoom * factor));

    // Zoom toward mouse
    const newCamX = mx - (mx - cam.x) * (newZoom / zoom);
    const newCamY = my - (my - cam.y) * (newZoom / zoom);

    setZoom(newZoom);
    setCam({ x: newCamX, y: newCamY });
    setViewport({ zoom: newZoom });
  }, [zoom, cam]);

  // WASD pan
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
      const speed = 8;
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
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
      style={{ background: '#020408', cursor: dragging ? 'grabbing' : (hoveredStar || hoveredFleet) ? 'pointer' : 'grab' }}
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.w}
        height={canvasSize.h}
        className="absolute inset-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-30 pointer-events-none px-3 py-2 rounded-lg text-xs"
          style={{
            left: tooltip.x + 14,
            top: tooltip.y - 10,
            background: 'rgba(2,4,12,0.95)',
            border: `1px solid ${tooltip.star.factionColor || 'rgba(0,212,255,0.3)'}`,
            backdropFilter: 'blur(8px)',
            maxWidth: 200,
          }}
        >
          <p className="font-bold text-white mb-1">{tooltip.star.name}</p>
          <p className="text-gray-400">{tooltip.star.type} Star · {tooltip.star.planets} planets</p>
          {tooltip.star.habitablePlanets > 0 && (
            <p className="text-green-400">{tooltip.star.habitablePlanets} habitable</p>
          )}
          {tooltip.star.controlled && (
            <p style={{ color: tooltip.star.factionColor }}>{tooltip.star.faction}</p>
          )}
          {!tooltip.star.explored && (
            <p className="text-gray-500 italic">Unexplored</p>
          )}
          <p className="text-gray-600 mt-1">Double-click to enter system</p>
        </div>
      )}

      {/* Fleet Tooltip */}
      {fleetTooltip && (
        <div
          className="absolute z-30 pointer-events-none px-3 py-2 rounded-lg text-xs"
          style={{
            left: fleetTooltip.x + 16,
            top: fleetTooltip.y - 10,
            background: 'rgba(2,4,12,0.96)',
            border: `1px solid ${fleetTooltip.fleet.color}80`,
            backdropFilter: 'blur(8px)',
            maxWidth: 220,
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: fleetTooltip.fleet.color }}></div>
            <p className="font-bold text-white">{fleetTooltip.fleet.fleetName || fleetTooltip.fleet.faction} Fleet</p>
          </div>
          {fleetTooltip.fleet.mission && (
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-gray-500">Mission:</span>
              <span className="text-white font-semibold capitalize">{fleetTooltip.fleet.mission}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-gray-500">Ships:</span>
            <span className="text-white font-semibold">{fleetTooltip.fleet.ships.toLocaleString()}</span>
          </div>
          {fleetTooltip.fleet.shipBreakdown && Object.keys(fleetTooltip.fleet.shipBreakdown).length > 0 && (
            <div className="mb-1 flex flex-wrap gap-1">
              {Object.entries(fleetTooltip.fleet.shipBreakdown).slice(0, 4).map(([type, count]) => (
                <span key={type} className="px-1.5 py-0.5 rounded text-xs" style={{ background: `${fleetTooltip.fleet.color}15`, color: fleetTooltip.fleet.color, fontSize: 9 }}>
                  {type.replace(/_/g, ' ')}: {count}
                </span>
              ))}
            </div>
          )}
          {fleetTooltip.fleet.timeRemaining !== undefined && fleetTooltip.fleet.timeRemaining > 0 && (
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-gray-500">ETA:</span>
              <span className="text-white font-mono" style={{ color: fleetTooltip.fleet.color, fontSize: 10 }}>
                {formatFleetTime(fleetTooltip.fleet.timeRemaining)}
              </span>
            </div>
          )}
          {fleetTooltip.fleet.etaStardate && (
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">Stardate:</span>
              <span className="text-white font-mono" style={{ color: '#e2c044', fontSize: 10 }}>
                {fleetTooltip.fleet.etaStardate}
              </span>
            </div>
          )}
          <div className="mt-1.5 pt-1.5 flex items-center gap-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${Math.round(fleetTooltip.fleet.progress * 100)}%`, background: fleetTooltip.fleet.color }} />
            </div>
            <span className="text-gray-500" style={{ fontSize: 9 }}>{Math.round(fleetTooltip.fleet.progress * 100)}%</span>
          </div>
        </div>
      )}

      {/* Minimap */}
      <Minimap
        stars={stars}
        camX={cam.x}
        camY={cam.y}
        zoom={zoom}
        canvasW={canvasSize.w}
        canvasH={canvasSize.h}
        worldBounds={worldBounds}
      />

      {/* Controls hint */}
      <div
        className="absolute top-3 left-3 z-20 text-xs space-y-0.5"
        style={{ color: 'rgba(0,212,255,0.4)' }}
      >
        <div>WASD / Arrow keys — Pan</div>
        <div>Scroll — Zoom</div>
        <div>Click — Select · Double-click — Enter</div>
        <div>Middle drag — Pan</div>
      </div>

      {/* Zoom indicator */}
      <div
        className="absolute top-3 right-3 z-20 text-xs font-mono"
        style={{ color: 'rgba(0,212,255,0.5)' }}
      >
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function formatFleetTime(seconds: number): string {
  if (seconds <= 0) return 'Arriving...';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}