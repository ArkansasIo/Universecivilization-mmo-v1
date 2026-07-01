import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useResources } from '../../../hooks/useResources';
import { useGameTime } from '../../../hooks/useGameTime';
import { useViewport } from '../../../components/feature/ViewportControls';
import { useCameraState } from './camera/CameraStateProvider';
import { useSelection } from './selection/SelectionContext';
import SoundControls from './SoundControls';

const RESOURCE_DEFS = [
  { key: 'metal', label: 'Metal', icon: 'ri-copper-coin-line', color: '#d4a853' },
  { key: 'crystal', label: 'Crystal', icon: 'ri-sparkling-line', color: '#5bc0be' },
  { key: 'deuterium', label: 'Deuterium', icon: 'ri-drop-line', color: '#7bc67e' },
  { key: 'energy', label: 'Energy', icon: 'ri-flashlight-line', color: '#e2c044' },
  { key: 'dark_matter', label: 'Dark Matter', icon: 'ri-focus-2-line', color: '#b98cd6' },
] as const;

function formatNum(n: number | undefined | null): string {
  if (n === undefined || n === null || isNaN(n)) return '0';
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}

export default function TopBar() {
  const { user, profile, signOut } = useAuth();
  const { resources, loading: resLoading } = useResources();
  const gameTime = useGameTime();
  const { viewport, setViewport } = useViewport();
  const { level } = useCameraState();
  const { selected } = useSelection();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSoundPanel, setShowSoundPanel] = useState(false);

  const handleLogout = async () => {
    try { await signOut(); } catch { /* ignore */ }
    navigate('/login');
  };

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.viewport-user-menu')) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const levelLabel = { galaxy: 'Galaxy', system: 'System', planet: 'Planet' }[level];
  const title = selected ? selected.label : levelLabel;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center px-3"
      style={{
        height: 44,
        background: 'linear-gradient(180deg, rgba(5,7,10,0.95) 0%, rgba(5,7,10,0.75) 100%)',
        borderBottom: '1px solid rgba(30,42,54,0.6)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-2 flex-shrink-0 min-w-0" style={{ width: 200 }}>
        <Link to="/dashboard" className="flex items-center gap-1.5">
          <div
            className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #e2c044, #d4a853)' }}
          >
            <i className="ri-planet-fill text-white text-xs"></i>
          </div>
        </Link>
        <div className="flex flex-col leading-tight min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold tracking-wider truncate" style={{ color: '#8892aa' }}>
              {profile?.username || 'U-E-DOMINIONS'}
            </span>
            <span className="text-xs font-bold" style={{ color: '#38bdf8', fontSize: 9 }}>
              {title}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono" style={{ color: '#e2c044', fontSize: 10 }}>
              {gameTime.dateDisplay}
            </span>
            <span className="text-xs font-mono opacity-50" style={{ color: '#5a6577', fontSize: 9 }}>
              {gameTime.timeDisplay}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Resource cards */}
      <div className="flex-1 flex items-center justify-center gap-1 overflow-x-auto px-2" style={{ scrollbarWidth: 'none' }}>
        {resLoading ? (
          <span className="text-xs opacity-60" style={{ color: '#5a6577' }}>Loading resources...</span>
        ) : (
          RESOURCE_DEFS.map((r) => {
            const val = (resources as unknown as Record<string, number>)[r.key];
            return (
              <div
                key={r.key}
                className="flex items-center gap-1 px-2 py-1 rounded flex-shrink-0"
                style={{ background: `${r.color}08`, border: `1px solid ${r.color}18` }}
              >
                <i className={`${r.icon} text-xs`} style={{ color: r.color }}></i>
                <span className="text-xs font-bold whitespace-nowrap" style={{ color: r.color }}>
                  {formatNum(val)}
                </span>
                <span className="text-xs hidden lg:block opacity-50" style={{ color: r.color, fontSize: 9 }}>
                  {r.label}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Zoom indicator */}
        <div className="flex items-center gap-1 px-2 py-1 rounded" style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)' }}>
          <i className="ri-zoom-in-line text-xs" style={{ color: '#38bdf8' }}></i>
          <span className="text-xs font-mono font-bold" style={{ color: '#38bdf8' }}>
            {Math.round(viewport.zoom * 100)}%
          </span>
        </div>

        <div className="w-px h-5" style={{ background: '#1e2a36' }}></div>

        {/* Speed */}
        <div className="flex items-center">
          <button
            onClick={() => setViewport({ paused: !viewport.paused })}
            className="w-6 h-6 flex items-center justify-center rounded transition-all hover:bg-white/5"
            style={{ color: viewport.paused ? '#f87171' : '#5bc0be' }}
            title={viewport.paused ? 'Resume' : 'Pause'}
          >
            <i className={`${viewport.paused ? 'ri-play-line' : 'ri-pause-line'} text-xs`}></i>
          </button>
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              onClick={() => setViewport({ speed: s as 1 | 2 | 3 | 4, paused: false })}
              className="w-5 h-6 flex items-center justify-center text-xs font-bold rounded transition-all"
              style={{
                color: viewport.speed === s && !viewport.paused ? '#e2c044' : '#5a6577',
                background: viewport.speed === s && !viewport.paused ? 'rgba(226,192,68,0.12)' : 'transparent',
                fontSize: 10,
              }}
            >
              {s}x
            </button>
          ))}
        </div>

        <div className="w-px h-5" style={{ background: '#1e2a36' }}></div>

        {/* Nav shortcuts */}
        <Link to="/dashboard" className="w-6 h-6 flex items-center justify-center rounded transition-all hover:bg-white/5" style={{ color: '#5a6577' }} title="Dashboard">
          <i className="ri-dashboard-3-line text-xs"></i>
        </Link>
        <Link to="/fleet" className="w-6 h-6 flex items-center justify-center rounded transition-all hover:bg-white/5" style={{ color: '#5a6577' }} title="Fleet">
          <i className="ri-rocket-line text-xs"></i>
        </Link>
        <Link to="/research" className="w-6 h-6 flex items-center justify-center rounded transition-all hover:bg-white/5" style={{ color: '#5a6577' }} title="Research">
          <i className="ri-test-tube-line text-xs"></i>
        </Link>

        <div className="w-px h-5" style={{ background: '#1e2a36' }}></div>

        {/* Sound controls */}
        <div className="relative">
          <button
            onClick={() => setShowSoundPanel((v) => !v)}
            className="w-6 h-6 flex items-center justify-center rounded transition-all hover:bg-white/5 sound-controls-trigger"
            style={{ color: '#5a6577' }}
            title="Sound Settings"
          >
            <i className="ri-volume-up-line text-xs"></i>
          </button>
          <SoundControls open={showSoundPanel} onClose={() => setShowSoundPanel(false)} />
        </div>

        <div className="w-px h-5" style={{ background: '#1e2a36' }}></div>

        {/* User menu */}
        <div className="relative viewport-user-menu">
          <button
            onClick={() => setShowUserMenu((v) => !v)}
            className="flex items-center gap-1.5 px-2 py-1 rounded transition-all hover:bg-white/5"
            style={{ color: '#8892aa', border: '1px solid #1e2a36' }}
          >
            <div
              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #d4a853, #5bc0be)' }}
            >
              <i className="ri-user-line text-white text-2xs"></i>
            </div>
            <span className="text-xs font-semibold hidden sm:block max-w-[80px] truncate">
              {profile?.username || user?.email?.split('@')[0] || 'Commander'}
            </span>
            <i className={`ri-arrow-down-s-line text-xs transition-transform ${showUserMenu ? 'rotate-180' : ''}`}></i>
          </button>

          {showUserMenu && (
            <div
              className="absolute right-0 top-full mt-1 w-44 rounded-lg overflow-hidden z-50"
              style={{ background: '#0d131a', border: '1px solid #1e2a36' }}
            >
              {[
                { label: 'Dashboard', icon: 'ri-dashboard-3-line', path: '/dashboard', color: '#e2c044' },
                { label: 'Profile', icon: 'ri-user-line', path: '/profile', color: '#5bc0be' },
                { label: 'Empire', icon: 'ri-building-4-line', path: '/empire', color: '#fbbf24' },
                { label: 'Store', icon: 'ri-shopping-cart-line', path: '/store', color: '#b98cd6' },
                { label: 'Stellaris View', icon: 'ri-global-fill', path: '/stellaris-view', color: '#38bdf8' },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer transition-all hover:bg-white/5"
                  style={{ color: '#8892aa', fontSize: 12 }}
                >
                  <i className={`${item.icon} text-sm`} style={{ color: item.color }}></i>
                  <span>{item.label}</span>
                </Link>
              ))}
              <div style={{ borderTop: '1px solid #1e2a36' }}>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer transition-all hover:bg-white/5 w-full text-left"
                  style={{ color: '#8892aa', fontSize: 12 }}
                >
                  <i className="ri-logout-box-line text-sm" style={{ color: '#f87171' }}></i>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
