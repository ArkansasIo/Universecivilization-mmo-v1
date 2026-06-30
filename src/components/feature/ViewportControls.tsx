import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────
   VIEWPORT STATE
   Used by galaxy/universe pages to get camera position
───────────────────────────────────────────── */
export interface ViewportState {
  x: number;
  y: number;
  zoom: number;
  speed: number; // 1-4
  paused: boolean;
}

const DEFAULT_VIEWPORT: ViewportState = {
  x: 0,
  y: 0,
  zoom: 1,
  speed: 2,
  paused: false,
};

// Global viewport state (shared across components)
let _viewport: ViewportState = { ...DEFAULT_VIEWPORT };
const _listeners: Set<(v: ViewportState) => void> = new Set();

export function getViewport(): ViewportState {
  return { ..._viewport };
}

export function setViewport(update: Partial<ViewportState>) {
  _viewport = { ..._viewport, ...update };
  _listeners.forEach((fn) => fn({ ..._viewport }));
}

export function useViewport() {
  const [viewport, setVp] = useState<ViewportState>({ ..._viewport });
  useEffect(() => {
    const fn = (v: ViewportState) => setVp(v);
    _listeners.add(fn);
    return () => { _listeners.delete(fn); };
  }, []);
  return { viewport, setViewport };
}

/* ─────────────────────────────────────────────
   KEYBOARD SHORTCUT NAVIGATION MAP
───────────────────────────────────────────── */
const NAV_HOTKEYS: Record<string, string> = {
  f: '/fleet',
  b: '/buildings',
  r: '/research',
  g: '/galaxy',
  c: '/ground-combat',
  t: '/marketplace',
  i: '/espionage',
  m: '/missions',
  u: '/universe',
  d: '/dashboard',
  e: '/empire',
};

/* ─────────────────────────────────────────────
   VIEWPORT CONTROLS HUD
   Renders the bottom-center speed/pause bar + zoom indicator
   like Stellaris
───────────────────────────────────────────── */
interface ViewportControlsProps {
  onToggleRightPanel: () => void;
  isGalaxyPage?: boolean;
}

export default function ViewportControls({ onToggleRightPanel, isGalaxyPage }: ViewportControlsProps) {
  const navigate = useNavigate();
  const { viewport } = useViewport();
  const [showZoomHint, setShowZoomHint] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const notifTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNotif = useCallback((msg: string) => {
    setNotification(msg);
    if (notifTimer.current) clearTimeout(notifTimer.current);
    notifTimer.current = setTimeout(() => setNotification(null), 1800);
  }, []);

  /* ── Keyboard handler ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      const key = e.key.toLowerCase();

      // Ctrl+P → toggle right panel
      if (e.ctrlKey && key === 'p') {
        e.preventDefault();
        onToggleRightPanel();
        return;
      }

      // Navigation hotkeys (no modifier)
      if (!e.ctrlKey && !e.altKey && !e.shiftKey && NAV_HOTKEYS[key]) {
        navigate(NAV_HOTKEYS[key]);
        showNotif(`Navigating to ${NAV_HOTKEYS[key].replace('/', '').replace('-', ' ').toUpperCase()}`);
        return;
      }

      // Game speed
      if (key === '1') { setViewport({ speed: 1 }); showNotif('Speed: Slow'); }
      if (key === '2') { setViewport({ speed: 2 }); showNotif('Speed: Normal'); }
      if (key === '3') { setViewport({ speed: 3 }); showNotif('Speed: Fast'); }
      if (key === '4') { setViewport({ speed: 4 }); showNotif('Speed: Fastest'); }
      if (key === 'p' && !e.ctrlKey) { setViewport({ paused: !_viewport.paused }); showNotif(_viewport.paused ? 'Resumed' : 'Paused'); }
      if (key === 'pause') { setViewport({ paused: !_viewport.paused }); }

      // Zoom
      if (key === 'z') { setViewport({ zoom: Math.min(3, _viewport.zoom + 0.2) }); setShowZoomHint(true); setTimeout(() => setShowZoomHint(false), 1000); }
      if (key === 'x') { setViewport({ zoom: Math.max(0.3, _viewport.zoom - 0.2) }); setShowZoomHint(true); setTimeout(() => setShowZoomHint(false), 1000); }

      // Center / home
      if (key === 'home') { setViewport({ x: 0, y: 0, zoom: 1 }); showNotif('Centered on Capital'); }
      if (key === ' ') { setViewport({ x: 0, y: 0 }); showNotif('Centered on Selection'); }

      // Escape
      if (key === 'escape') {
        // Dispatch a custom event pages can listen to
        window.dispatchEvent(new CustomEvent('viewport-escape'));
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate, onToggleRightPanel, showNotif]);

  const speedLabels = ['', 'SLOW', 'NORMAL', 'FAST', 'MAX'];
  const speedColors = ['', '#6b7a95', '#34d399', '#fbbf24', '#f87171'];

  return (
    <>
      {/* ── Keyboard notification toast ── */}
      {notification && (
        <div
          className="fixed z-50 pointer-events-none transition-all"
          style={{
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.85)',
            border: '1px solid rgba(0,212,255,0.3)',
            borderRadius: 6,
            padding: '6px 16px',
            color: '#00d4ff',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.1em',
            backdropFilter: 'blur(8px)',
          }}
        >
          {notification}
        </div>
      )}

      {/* ── Bottom HUD bar (Stellaris-style) ── */}
      <div
        className="fixed bottom-0 left-1/2 z-30 flex items-center gap-1 px-3 py-1.5 rounded-t-lg"
        style={{
          transform: 'translateX(-50%)',
          background: 'rgba(8,13,26,0.95)',
          border: '1px solid rgba(0,212,255,0.15)',
          borderBottom: 'none',
          backdropFilter: 'blur(12px)',
          minWidth: 320,
        }}
      >
        {/* Pause button */}
        <button
          onClick={() => { setViewport({ paused: !viewport.paused }); }}
          className="w-7 h-7 flex items-center justify-center rounded cursor-pointer transition-all hover:bg-white/10"
          style={{
            color: viewport.paused ? '#f87171' : '#34d399',
            border: `1px solid ${viewport.paused ? '#f8717140' : '#34d39940'}`,
          }}
          title="Pause/Resume (P)"
        >
          <i className={`${viewport.paused ? 'ri-play-line' : 'ri-pause-line'} text-sm`}></i>
        </button>

        {/* Speed buttons */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              onClick={() => setViewport({ speed: s })}
              className="w-7 h-7 flex items-center justify-center rounded cursor-pointer transition-all hover:bg-white/10"
              style={{
                background: viewport.speed === s ? `${speedColors[s]}20` : 'transparent',
                border: `1px solid ${viewport.speed === s ? speedColors[s] + '60' : 'transparent'}`,
                color: viewport.speed === s ? speedColors[s] : '#4a5568',
              }}
              title={`Speed ${s}: ${speedLabels[s]} (${s})`}
            >
              <span className="text-xs font-bold">{s}</span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{ background: 'rgba(0,212,255,0.15)' }}></div>

        {/* Speed label */}
        <span
          className="text-xs font-bold tracking-wider w-14 text-center"
          style={{ color: speedColors[viewport.speed] }}
        >
          {viewport.paused ? 'PAUSED' : speedLabels[viewport.speed]}
        </span>

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{ background: 'rgba(0,212,255,0.15)' }}></div>

        {/* Zoom controls */}
        <button
          onClick={() => setViewport({ zoom: Math.max(0.3, viewport.zoom - 0.2) })}
          className="w-6 h-6 flex items-center justify-center rounded cursor-pointer transition-all hover:bg-white/10"
          style={{ color: '#6b7a95' }}
          title="Zoom Out (X)"
        >
          <i className="ri-subtract-line text-xs"></i>
        </button>
        <div
          className="text-xs font-mono w-10 text-center"
          style={{ color: showZoomHint ? '#00d4ff' : '#6b7a95' }}
        >
          {Math.round(viewport.zoom * 100)}%
        </div>
        <button
          onClick={() => setViewport({ zoom: Math.min(3, viewport.zoom + 0.2) })}
          className="w-6 h-6 flex items-center justify-center rounded cursor-pointer transition-all hover:bg-white/10"
          style={{ color: '#6b7a95' }}
          title="Zoom In (Z)"
        >
          <i className="ri-add-line text-xs"></i>
        </button>

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{ background: 'rgba(0,212,255,0.15)' }}></div>

        {/* Center button */}
        <button
          onClick={() => setViewport({ x: 0, y: 0, zoom: 1 })}
          className="w-7 h-7 flex items-center justify-center rounded cursor-pointer transition-all hover:bg-white/10"
          style={{ color: '#6b7a95' }}
          title="Center on Capital (Home)"
        >
          <i className="ri-focus-3-line text-sm"></i>
        </button>

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{ background: 'rgba(0,212,255,0.15)' }}></div>

        {/* Right panel toggle */}
        <button
          onClick={onToggleRightPanel}
          className="w-7 h-7 flex items-center justify-center rounded cursor-pointer transition-all hover:bg-white/10"
          style={{ color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}
          title="Command Panel (Ctrl+P)"
        >
          <i className="ri-layout-right-2-line text-sm"></i>
        </button>
      </div>

      {/* ── Zoom hint overlay (galaxy pages) ── */}
      {showZoomHint && isGalaxyPage && (
        <div
          className="fixed z-40 pointer-events-none"
          style={{
            bottom: 60,
            right: 20,
            background: 'rgba(0,0,0,0.8)',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: 6,
            padding: '4px 10px',
            color: '#00d4ff',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          ZOOM {Math.round(viewport.zoom * 100)}%
        </div>
      )}
    </>
  );
}
