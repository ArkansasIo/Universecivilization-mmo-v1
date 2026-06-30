import { useState, useEffect, createContext, useContext, useRef, lazy, Suspense } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useResources } from '../../hooks/useResources';
import { useGameTime } from '../../hooks/useGameTime';
import { GAME_TIME_CONFIG } from '../../config/gameConfig';
import NotificationBell from './NotificationBell';
import ThemeSwitcher from './ThemeSwitcher';

const RightSidePanel = lazy(() => import('./RightSidePanel'));
const ViewportControls = lazy(() => import('./ViewportControls'));
const GameEventCenter = lazy(() => import('./GameEventCenter'));
const AchievementToastContainer = lazy(() => import('./AchievementToast'));

/* ─────────────────────────────────────────────
   SIDEBAR CONTEXT
───────────────────────────────────────────── */
interface SidebarCtx { collapsed: boolean }
const SidebarContext = createContext<SidebarCtx>({ collapsed: false });
const useSidebar = () => useContext(SidebarContext);

/* ─────────────────────────────────────────────
   NAV DATA TYPES
───────────────────────────────────────────── */
interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: string;
}
interface NavSection {
  id: string;
  label: string;
  icon: string;
  color: string;
  path?: string;
  items?: NavItem[];
}

/* ─────────────────────────────────────────────
   OGame X NAV DATA — cleaner, classic hierarchy
───────────────────────────────────────────── */
const NAV_SECTIONS: NavSection[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: 'ri-dashboard-3-line',
    path: '/dashboard',
    color: '#f59e0b',
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: 'ri-copper-coin-line',
    color: '#fbbf24',
    items: [
      { label: 'Buildings', path: '/buildings', icon: 'ri-building-2-line' },
      { label: 'Storage', path: '/storage', icon: 'ri-archive-line' },
      { label: 'Colonies', path: '/colonies', icon: 'ri-planet-line' },
      { label: 'Population', path: '/population', icon: 'ri-community-line' },
    ],
  },
  {
    id: 'facilities',
    label: 'Facilities',
    icon: 'ri-settings-4-line',
    color: '#a3a3a3',
    items: [
      { label: 'Research Lab', path: '/research', icon: 'ri-flask-line' },
      { label: 'Shipyard', path: '/shipyard', icon: 'ri-tools-line' },
      { label: 'Defense', path: '/defense', icon: 'ri-shield-line' },
      { label: 'Starbases', path: '/starbases', icon: 'ri-focus-3-line' },
      { label: 'Moon Bases', path: '/moonbases', icon: 'ri-moon-line' },
      { label: 'Megastructures', path: '/megastructures', icon: 'ri-planet-fill' },
      { label: 'Travel Network', path: '/travel-network', icon: 'ri-route-line' },
      { label: 'Food · Water', path: '/food-water-disease', icon: 'ri-heart-pulse-line' },
    ],
  },
  {
    id: 'alc-power',
    label: 'ALC Power Systems',
    icon: 'ri-flashlight-fill',
    color: '#06b6d4',
    items: [
      { label: 'Power Grid', path: '/power-grid', icon: 'ri-flashlight-line' },
      { label: 'ALC Power Tech Tree', path: '/alc-power-tech', icon: 'ri-git-branch-line', badge: 'TECH' },
      { label: 'Reactor Blueprints', path: '/reactor-research', icon: 'ri-file-code-line', badge: 'R&D' },
      { label: 'Energy Storage', path: '/storage?tab=energy', icon: 'ri-battery-line' },
    ],
  },
  {
    id: 'fleet',
    label: 'Fleet',
    icon: 'ri-rocket-2-line',
    color: '#34d399',
    items: [
      { label: 'Fleet Manager', path: '/fleet', icon: 'ri-rocket-2-line' },
      { label: 'Starships', path: '/starships', icon: 'ri-space-ship-line' },
      { label: 'Motherships', path: '/motherships', icon: 'ri-ship-line' },
      { label: 'Enhanced Ships', path: '/enhanced-ships', icon: 'ri-rocket-line' },
      { label: 'Ship Upgrades', path: '/ship-upgrades', icon: 'ri-arrow-up-circle-line' },
      { label: 'Fleet Formations', path: '/fleet-formations', icon: 'ri-layout-grid-line' },
      { label: 'Fleet Combat', path: '/fleet-combat', icon: 'ri-fire-line' },
      { label: 'Expeditions', path: '/expeditions', icon: 'ri-compass-3-line' },
      { label: 'ACS', path: '/acs', icon: 'ri-group-line' },
    ],
  },
  {
    id: 'military',
    label: 'Military',
    icon: 'ri-sword-line',
    color: '#f87171',
    items: [
      { label: 'Ground Combat', path: '/ground-combat', icon: 'ri-shield-cross-line', badge: 'NEW' },
      { label: 'Officers', path: '/officers', icon: 'ri-user-star-line' },
      { label: 'Units', path: '/units', icon: 'ri-team-line' },
      { label: 'Training Center', path: '/training-center', icon: 'ri-building-4-line' },
      { label: 'Combat Simulator', path: '/combat-simulator', icon: 'ri-sword-fill' },
      { label: 'War Room', path: '/war-room', icon: 'ri-alarm-warning-line' },
      { label: 'Campaign', path: '/campaign', icon: 'ri-flag-line' },
    ],
  },
  {
    id: 'research',
    label: 'Research',
    icon: 'ri-test-tube-line',
    color: '#a78bfa',
    items: [
      { label: 'Research Lab', path: '/research', icon: 'ri-test-tube-line' },
      { label: 'Advanced Research', path: '/advanced-research', icon: 'ri-microscope-line' },
      { label: 'Skills', path: '/skills', icon: 'ri-star-line' },
      { label: 'Blueprints', path: '/blueprints', icon: 'ri-file-list-3-line' },
    ],
  },
  {
    id: 'crafting',
    label: 'Crafting',
    icon: 'ri-hammer-line',
    color: '#fb923c',
    items: [
      { label: 'Crafting Workshop', path: '/crafting', icon: 'ri-hammer-line' },
      { label: 'Master Crafting', path: '/master-crafting', icon: 'ri-fire-fill' },
      { label: 'Crafting Rank', path: '/crafting-rank', icon: 'ri-vip-crown-line' },
      { label: 'Skill Trees', path: '/crafting-skill-trees', icon: 'ri-git-branch-line' },
      { label: 'Materials Lab', path: '/crafting-materials', icon: 'ri-inbox-2-line' },
      { label: 'Dismantle', path: '/crafting-dismantle', icon: 'ri-delete-bin-2-line' },
      { label: 'Augmentations', path: '/crafting-augmentations', icon: 'ri-body-scan-line' },
      { label: 'Artifacts', path: '/crafting-artifacts', icon: 'ri-ancient-pavilion-line' },
    ],
  },
  {
    id: 'galaxy',
    label: 'Galaxy',
    icon: 'ri-global-line',
    color: '#38bdf8',
    items: [
      { label: 'Galaxy View', path: '/galaxy', icon: 'ri-global-line' },
      { label: 'Galaxy Map', path: '/galaxy-map', icon: 'ri-map-line' },
      { label: '3D Universe', path: '/universe-3d', icon: 'ri-global-fill', badge: '3D' },
      { label: 'Universe', path: '/universe', icon: 'ri-earth-line' },
      { label: 'Sectors', path: '/sectors', icon: 'ri-layout-4-line' },
      { label: 'Realm Systems', path: '/realms', icon: 'ri-ancient-gate-line' },
      { label: 'Sensor Phalanx', path: '/sensor-phalanx', icon: 'ri-radar-line' },
      { label: 'Stargate Network', path: '/stargate-network', icon: 'ri-focus-2-line' },
      { label: 'Seed Discovery', path: '/seed-discovery', icon: 'ri-focus-3-line' },
      { label: 'Stellaris View', path: '/stellaris-view', icon: 'ri-global-fill' },
      { label: 'Galactic Calendar', path: '/galactic-calendar', icon: 'ri-calendar-2-line', badge: 'TIME' },
    ],
  },
  {
    id: 'economy',
    label: 'Economy',
    icon: 'ri-exchange-line',
    color: '#4ade80',
    items: [
      { label: 'Marketplace', path: '/marketplace', icon: 'ri-store-2-line' },
      { label: 'Resource Trading', path: '/resource-trading', icon: 'ri-exchange-line' },
      { label: 'Trade Routes', path: '/trade-routes', icon: 'ri-route-line' },
      { label: 'Auction House', path: '/auction', icon: 'ri-auction-line' },
      { label: 'Black Market', path: '/black-market', icon: 'ri-sword-line' },
      { label: 'Insurance', path: '/insurance', icon: 'ri-shield-check-line' },
    ],
  },
  {
    id: 'alliance',
    label: 'Alliance',
    icon: 'ri-shield-star-line',
    color: '#fbbf24',
    items: [
      { label: 'Alliance Hub', path: '/alliance', icon: 'ri-shield-star-line' },
      { label: 'Diplomacy', path: '/diplomacy', icon: 'ri-shake-hands-line' },
      { label: 'Espionage', path: '/espionage', icon: 'ri-user-search-line' },
      { label: 'Intel', path: '/intel', icon: 'ri-eye-line' },
      { label: 'Diplomacy Map', path: '/diplomacy-map', icon: 'ri-earth-line' },
    ],
  },
  {
    id: 'activities',
    label: 'Activities',
    icon: 'ri-game-line',
    color: '#f472b6',
    items: [
      { label: 'Pirate Hunting', path: '/pirates', icon: 'ri-skull-2-line' },
      { label: 'Bounty Board', path: '/bounties', icon: 'ri-crosshair-line' },
      { label: 'World Bosses', path: '/world-bosses', icon: 'ri-skull-fill' },
      { label: 'Quests', path: '/quests', icon: 'ri-questionnaire-line' },
      { label: 'Achievements', path: '/achievements', icon: 'ri-medal-line' },
      { label: 'Season Pass', path: '/season-pass', icon: 'ri-vip-crown-line' },
      { label: 'Seasonal Events', path: '/seasonal-events', icon: 'ri-calendar-event-line' },
    ],
  },
  {
    id: 'social',
    label: 'Social',
    icon: 'ri-chat-3-line',
    color: '#818cf8',
    items: [
      { label: 'Messages', path: '/messages', icon: 'ri-mail-line' },
      { label: 'Global Chat', path: '/chat', icon: 'ri-chat-3-line' },
      { label: 'Leaderboard', path: '/leaderboard', icon: 'ri-trophy-line' },
      { label: 'Universe LB', path: '/universe-leaderboard', icon: 'ri-trophy-fill' },
      { label: 'Empires at War', path: '/empires-at-war', icon: 'ri-fire-fill' },
    ],
  },
  {
    id: 'store',
    label: 'Premium',
    icon: 'ri-vip-crown-line',
    color: '#f43f5e',
    items: [
      { label: 'Store', path: '/store', icon: 'ri-store-3-line' },
      { label: 'Season Pass', path: '/season-pass', icon: 'ri-vip-crown-2-line' },
    ],
  },
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function formatNum(n: number | undefined | null): string {
  if (!n || isNaN(n)) return '0';
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/* ─────────────────────────────────────────────
   OGame X TOP RESOURCE BAR
───────────────────────────────────────────── */
function TopBar({
  sidebarWidth,
  onToggleRightPanel,
  rightPanelOpen,
  onToggleEventCenter,
  eventCenterOpen,
}: {
  sidebarWidth: number;
  onToggleRightPanel: () => void;
  rightPanelOpen: boolean;
  onToggleEventCenter: () => void;
  eventCenterOpen: boolean;
}) {
  const { resources, loading } = useResources();
  const { user, signOut } = useAuth();
  const gameTime = useGameTime();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthMenu, setShowAuthMenu] = useState(false);
  const fleetSlotsUsed = 3;
  const fleetSlotsTotal = 7;

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch {
      navigate('/login');
    }
  };

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.top-user-menu')) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // Close auth menu on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.top-auth-menu')) setShowAuthMenu(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const resourceCards = [
    { key: 'metal', label: 'Metal', icon: 'ri-copper-coin-line', color: '#d4a853', bgColor: 'rgba(212,168,83,0.08)', borderColor: 'rgba(212,168,83,0.25)', capacity: 25000000 },
    { key: 'crystal', label: 'Crystal', icon: 'ri-sparkling-line', color: '#5bc0be', bgColor: 'rgba(91,192,190,0.08)', borderColor: 'rgba(91,192,190,0.25)', capacity: 25000000 },
    { key: 'deuterium', label: 'Deuterium', icon: 'ri-drop-line', color: '#7bc67e', bgColor: 'rgba(123,198,126,0.08)', borderColor: 'rgba(123,198,126,0.25)', capacity: 15000000 },
    { key: 'energy', label: 'Energy', icon: 'ri-flashlight-line', color: '#e2c044', bgColor: 'rgba(226,192,68,0.08)', borderColor: 'rgba(226,192,68,0.25)', capacity: 0 },
    { key: 'dark_matter', label: 'Dark Matter', icon: 'ri-focus-2-line', color: '#b98cd6', bgColor: 'rgba(185,140,214,0.08)', borderColor: 'rgba(185,140,214,0.25)', capacity: 0 },
  ];

  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center"
      style={{
        left: sidebarWidth,
        height: 60,
        background: 'linear-gradient(180deg, #10161d 0%, #0a0e13 100%)',
        borderBottom: '2px solid #1e2a36',
        transition: 'left 0.3s',
        padding: '0 12px',
        gap: 6,
      }}
    >
      {/* Logo + Server Info */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link to="/dashboard" className="flex items-center gap-1.5 cursor-pointer">
          <div
            className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #e2c044, #d4a853)' }}
          >
            <i className="ri-planet-fill text-white text-sm"></i>
          </div>
        </Link>
        <div className="hidden lg:flex flex-col leading-tight">
          <span className="text-xs font-bold tracking-wider" style={{ color: '#8892aa' }}>U-E-DOMINIONS</span>
          <span className="text-xs opacity-60" style={{ color: '#5bc0be', fontSize: 9 }}>Universe 1 · Orion</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-8 flex-shrink-0 hidden lg:block" style={{ background: '#1e2a36' }}></div>

      {/* Stardate — In-Game Sol System Clock */}
      <div className="hidden md:flex items-center gap-2 flex-shrink-0 px-2">
        {/* Game Time */}
        <div className="flex flex-col items-end leading-tight">
          <span className="text-xs font-mono font-bold tracking-wider" style={{ color: '#e2c044', fontSize: 11 }}>
            {gameTime.dateDisplay}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono" style={{ color: '#d4a853', fontSize: 10 }}>{gameTime.timeDisplay}</span>
            <span className="text-xs font-mono opacity-50" style={{ color: '#8892aa', fontSize: 9 }}>GST</span>
          </div>
        </div>
        {/* Thin vertical divider */}
        <div className="w-px h-9 flex-shrink-0" style={{ background: 'linear-gradient(180deg, transparent, rgba(226,192,68,0.3), transparent)' }}></div>
        {/* Server Time — smaller, subdued */}
        <div className="flex flex-col items-start leading-tight">
          <span className="text-xs font-bold tracking-wider opacity-50" style={{ color: '#5a6577', fontSize: 9 }}>
            SERVER
          </span>
          <span className="text-xs font-mono" style={{ color: '#6b7a95', fontSize: 10 }}>{gameTime.serverTime}</span>
        </div>
        {/* Tooltip hint */}
        <div
          className="relative group cursor-help flex-shrink-0"
          title={`Sol Day: ${gameTime.solDayName} · Game Year ${gameTime.gameYear} · 1 real day = ${GAME_TIME_CONFIG.scalingFactor * 24} game hours`}
        >
          <div className="w-5 h-5 flex items-center justify-center rounded-full" style={{ background: 'rgba(226,192,68,0.08)' }}>
            <i className="ri-time-line text-xs" style={{ color: '#5a6577' }}></i>
          </div>
          {/* Tooltip popup */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-3 py-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-50 whitespace-nowrap"
            style={{ background: '#0d131a', border: '1px solid #1e2a36' }}
          >
            <div className="text-xs font-bold mb-1" style={{ color: '#e2c044' }}>Sol System Calendar</div>
            <div className="text-xs space-y-0.5" style={{ color: '#5a6577' }}>
              <div>Day: <span style={{ color: '#8892aa' }}>{gameTime.solDayName}</span></div>
              <div>1 real hour = 60 game hours</div>
              <div>1 game year = 6 real days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-8 flex-shrink-0" style={{ background: '#1e2a36' }}></div>

      {/* Resource Cards */}
      <div className="flex-1 flex items-center gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {loading ? (
          <span className="text-xs opacity-60" style={{ color: '#5a6577' }}>Loading resources...</span>
        ) : (
          resourceCards.map((rc) => {
            const val = (resources as Record<string, number>)[rc.key];
            if (val === undefined || val === null) return null;
            return (
              <div
                key={rc.key}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded flex-shrink-0 cursor-default transition-all group"
                style={{
                  background: rc.bgColor,
                  border: `1px solid ${rc.borderColor}`,
                }}
              >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <i className={`${rc.icon} text-sm`} style={{ color: rc.color }}></i>
                </div>
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-xs font-bold whitespace-nowrap" style={{ color: rc.color }}>
                    {formatNum(val)}
                  </span>
                  {rc.capacity > 0 && (
                    <div className="w-full h-0.5 rounded-full mt-0.5" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div
                        className="h-0.5 rounded-full"
                        style={{
                          width: `${Math.min((val / rc.capacity) * 100, 100)}%`,
                          background: rc.color,
                          opacity: val / rc.capacity > 0.9 ? 1 : 0.6,
                        }}
                      />
                    </div>
                  )}
                </div>
                <span className="text-xs hidden xl:block opacity-50" style={{ color: rc.color, fontSize: 10 }}>
                  {rc.label}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Fleet Slots */}
        <button
          onClick={() => navigate('/fleet')}
          className="flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer transition-all hover:bg-white/5"
          style={{ border: '1px solid rgba(91,192,190,0.2)', background: 'rgba(91,192,190,0.06)' }}
          title={`Fleet Slots: ${fleetSlotsUsed}/${fleetSlotsTotal}`}
        >
          <i className="ri-rocket-2-line text-sm" style={{ color: '#5bc0be' }}></i>
          <span className="text-xs font-bold whitespace-nowrap" style={{ color: '#5bc0be' }}>{fleetSlotsUsed}/{fleetSlotsTotal}</span>
        </button>

        {/* Event Center */}
        <button
          onClick={onToggleEventCenter}
          className="w-8 h-8 flex items-center justify-center rounded cursor-pointer transition-all hover:bg-white/5 relative"
          style={{
            color: eventCenterOpen ? '#f87171' : '#5a6577',
            background: eventCenterOpen ? 'rgba(248,113,113,0.1)' : 'transparent',
            border: `1px solid ${eventCenterOpen ? 'rgba(248,113,113,0.35)' : '#1e2a36'}`,
          }}
          title="Event Center (Ctrl+E)"
        >
          <i className="ri-notification-3-line text-sm"></i>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* Right Panel Toggle */}
        <button
          onClick={onToggleRightPanel}
          className="w-8 h-8 flex items-center justify-center rounded cursor-pointer transition-all hover:bg-white/5"
          style={{
            color: rightPanelOpen ? '#e2c044' : '#5a6577',
            background: rightPanelOpen ? 'rgba(226,192,68,0.1)' : 'transparent',
            border: `1px solid ${rightPanelOpen ? 'rgba(226,192,68,0.4)' : '#1e2a36'}`,
          }}
          title="Command Panel (Ctrl+P)"
        >
          <i className="ri-layout-right-2-line text-sm"></i>
        </button>

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Dark Matter Quick Add */}
        <button
          onClick={() => navigate('/store')}
          className="flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer transition-all hover:bg-white/5"
          style={{ border: '1px solid rgba(185,140,214,0.3)', background: 'rgba(185,140,214,0.08)' }}
        >
          <i className="ri-add-circle-line text-sm" style={{ color: '#b98cd6' }}></i>
          <span className="text-xs font-bold whitespace-nowrap hidden md:block" style={{ color: '#b98cd6' }}>+ DM</span>
        </button>

        {/* User Menu — logged in */}
        {user ? (
          <div className="relative top-user-menu">
            <button
              onClick={() => setShowUserMenu((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded cursor-pointer transition-all hover:bg-white/5"
              style={{ border: '1px solid #1e2a36', color: '#8892aa' }}
            >
              <div
                className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #d4a853, #5bc0be)' }}
              >
                <i className="ri-user-line text-white text-xs"></i>
              </div>
              <span className="text-xs font-semibold whitespace-nowrap hidden sm:block">
                {user?.email?.split('@')[0] || 'Commander'}
              </span>
              <i className={`ri-arrow-down-s-line text-xs transition-transform ${showUserMenu ? 'rotate-180' : ''}`}></i>
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 top-full mt-1 w-48 rounded-lg overflow-hidden z-50"
                style={{ background: '#0d131a', border: '1px solid #1e2a36' }}
              >
                {[
                  { label: 'Profile', icon: 'ri-user-line', path: '/profile', color: '#e2c044' },
                  { label: 'Empire Overview', icon: 'ri-building-4-line', path: '/empire', color: '#5bc0be' },
                  { label: 'Achievements', icon: 'ri-medal-line', path: '/achievements', color: '#fbbf24' },
                  { label: 'Premium Store', icon: 'ri-shopping-cart-line', path: '/store', color: '#b98cd6' },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all hover:bg-white/5"
                    style={{ color: '#8892aa', fontSize: 13 }}
                  >
                    <i className={`${item.icon} text-sm`} style={{ color: item.color }}></i>
                    <span>{item.label}</span>
                  </Link>
                ))}
                <div style={{ borderTop: '1px solid #1e2a36' }}>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all hover:bg-white/5 w-full text-left"
                    style={{ color: '#8892aa', fontSize: 13 }}
                  >
                    <i className="ri-logout-box-line text-sm" style={{ color: '#f87171' }}></i>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Auth quick-access dropdown — logged out */
          <div className="relative top-auth-menu">
            <button
              onClick={() => setShowAuthMenu((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded cursor-pointer transition-all hover:bg-white/5"
              style={{
                border: '1px solid rgba(226,192,68,0.3)',
                color: '#e2c044',
                background: 'rgba(226,192,68,0.06)',
              }}
            >
              <div
                className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #e2c044, #d4a853)' }}
              >
                <i className="ri-user-add-line text-white text-xs"></i>
              </div>
              <span className="text-xs font-semibold whitespace-nowrap hidden sm:block">Access Account</span>
              <i className={`ri-arrow-down-s-line text-xs transition-transform ${showAuthMenu ? 'rotate-180' : ''}`}></i>
            </button>

            {showAuthMenu && (
              <div
                className="absolute right-0 top-full mt-1 w-44 rounded-lg overflow-hidden z-50"
                style={{ background: '#0d131a', border: '1px solid #1e2a36' }}
              >
                <Link
                  to="/login"
                  onClick={() => setShowAuthMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all hover:bg-white/5"
                  style={{ color: '#8892aa', fontSize: 13 }}
                >
                  <i className="ri-login-box-line text-sm" style={{ color: '#5bc0be' }}></i>
                  <span>Log In</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setShowAuthMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all hover:bg-white/5"
                  style={{ color: '#8892aa', fontSize: 13 }}
                >
                  <i className="ri-user-add-line text-sm" style={{ color: '#e2c044' }}></i>
                  <span>Register</span>
                </Link>
                <Link
                  to="/login?demo=true"
                  onClick={() => setShowAuthMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all hover:bg-white/5"
                  style={{ color: '#8892aa', fontSize: 13 }}
                >
                  <i className="ri-user-smile-line text-sm" style={{ color: '#34d399' }}></i>
                  <span>Continue as Guest</span>
                </Link>
                <Link
                  to="/login"
                  state={{ demo: true }}
                  onClick={() => setShowAuthMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all hover:bg-white/5"
                  style={{ color: '#8892aa', fontSize: 13 }}
                >
                  <i className="ri-flask-line text-sm" style={{ color: '#a78bfa' }}></i>
                  <span>Demo Account</span>
                </Link>
                <div style={{ borderTop: '1px solid #1e2a36' }}>
                  <Link
                    to="/"
                    onClick={() => setShowAuthMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all hover:bg-white/5"
                    style={{ color: '#8892aa', fontSize: 13 }}
                  >
                    <i className="ri-home-line text-sm" style={{ color: '#fbbf24' }}></i>
                    <span>Home Page</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────
   OGame X LEFT SIDEBAR
───────────────────────────────────────────── */
function Sidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) {
  const location = useLocation();
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Determine which sections contain the active page (for auto-expand)
  const sectionsWithActive = NAV_SECTIONS
    .filter((s) => !s.path && s.items?.some((i) => i.path === location.pathname))
    .map((s) => s.id);
  const sectionsWithActiveOnSub = new Set(sectionsWithActive);

  // Track expanded sections — auto-expand the one containing active page
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    const initial = new Set<string>(sectionsWithActive);
    // Default all sections open if none active
    if (initial.size === 0) {
      NAV_SECTIONS.forEach((s) => { if (!s.path) initial.add(s.id); });
    }
    return initial;
  });

  // Auto-expand section when active page changes
  useEffect(() => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      sectionsWithActive.forEach((id) => next.add(id));
      return next;
    });
  }, [location.pathname]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isActiveItem = (path: string) => location.pathname === path;

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col transition-all duration-300 overflow-hidden"
      style={{
        width: collapsed ? 52 : 220,
        background: 'linear-gradient(180deg, #0a0e13 0%, #080b0f 100%)',
        borderRight: '2px solid #1e2a36',
      }}
    >
      {/* Spacer to match top bar height */}
      <div className="h-[60px] flex-shrink-0" style={{ borderBottom: '2px solid #1e2a36' }}>
        {collapsed ? (
          <div className="flex items-center justify-center h-full">
            <div
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #e2c044, #d4a853)' }}
            >
              <i className="ri-planet-fill text-white text-sm"></i>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div
              className="w-9 h-9 rounded flex items-center justify-center mr-2"
              style={{ background: 'linear-gradient(135deg, #e2c044, #d4a853)' }}
            >
              <i className="ri-planet-fill text-white"></i>
            </div>
            <div>
              <span className="text-xs font-black tracking-widest" style={{ color: '#d4a853' }}>U-E-DOMINIONS</span>
              <div className="text-xs opacity-60" style={{ color: '#5a6577', fontSize: 9 }}>Universe 1 · Orion</div>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-[70px] -right-3 w-6 h-6 rounded-full flex items-center justify-center z-50 cursor-pointer transition-all hover:scale-110"
        style={{
          background: '#0a0e13',
          border: '1px solid #1e2a36',
          color: '#5a6577',
        }}
      >
        <i className={`${collapsed ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'} text-xs`}></i>
      </button>

      {/* Nav scroll area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-1" style={{ scrollbarWidth: 'none' }}>
        {NAV_SECTIONS.map((section) => {
          const isDirect = !!section.path;
          const active = isDirect
            ? location.pathname === section.path
            : section.items?.some((i) => i.path === location.pathname);
          const isExpanded = expandedSections.has(section.id);
          const isHovered = hoveredSection === section.id;
          const hasActiveSub = sectionsWithActiveOnSub.has(section.id);

          if (isDirect) {
            return (
              <Link
                key={section.id}
                to={section.path!}
                className="flex items-center h-9 px-3 cursor-pointer transition-all relative group"
                style={{
                  background: active ? `${section.color}10` : 'transparent',
                  borderLeft: active ? `3px solid ${section.color}` : '3px solid transparent',
                  color: active ? section.color : '#6b7a95',
                }}
              >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <i className={`${section.icon} text-sm`}></i>
                </div>
                {!collapsed && (
                  <span className="ml-2.5 text-xs font-semibold whitespace-nowrap">
                    {section.label}
                  </span>
                )}
                {collapsed && (
                  <div
                    className="absolute left-full ml-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50"
                    style={{ background: '#0d131a', color: section.color, border: `1px solid ${section.color}40` }}
                  >
                    {section.label}
                  </div>
                )}
              </Link>
            );
          }

          // Section with sub-items — now collapsible!
          return (
            <div key={section.id}>
              {/* Section header — clickable toggle */}
              <button
                onClick={() => {
                  if (collapsed) return;
                  toggleSection(section.id);
                }}
                onMouseEnter={() => setHoveredSection(section.id)}
                onMouseLeave={() => setHoveredSection(null)}
                className="flex items-center w-full h-9 px-3 cursor-pointer transition-all relative group text-left"
                style={{
                  background: active ? `${section.color}10` : 'transparent',
                  borderLeft: hasActiveSub ? `3px solid ${section.color}` : '3px solid transparent',
                  color: active ? section.color : '#6b7a95',
                }}
              >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <i className={`${section.icon} text-sm`}></i>
                </div>
                {!collapsed && (
                  <>
                    <span className="ml-2.5 text-xs font-semibold flex-1 text-left whitespace-nowrap">
                      {section.label}
                    </span>
                    {/* Chevron indicator */}
                    <div
                      className="w-4 h-4 flex items-center justify-center flex-shrink-0 transition-transform duration-200"
                      style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                    >
                      <i className="ri-arrow-down-s-line text-xs"></i>
                    </div>
                    <span
                      className="text-xs px-1.5 rounded font-bold ml-1"
                      style={{
                        background: `${section.color}15`,
                        color: section.color,
                        fontSize: 9,
                        opacity: 0.6,
                      }}
                    >
                      {section.items?.length || 0}
                    </span>
                  </>
                )}
                {collapsed && (
                  <>
                    {/* Collapsed mode: hover to show sub-items as a dropdown */}
                    {isHovered && section.items && (
                      <div
                        className="absolute left-full top-0 ml-1 rounded-lg overflow-hidden z-50 transition-all opacity-100"
                        style={{
                          background: '#0d131a',
                          border: `1px solid ${section.color}30`,
                          minWidth: 160,
                        }}
                      >
                        <div
                          className="px-3 py-2 text-xs font-bold"
                          style={{ color: section.color, borderBottom: '1px solid #1e2a36', fontSize: 10 }}
                        >
                          {section.label}
                        </div>
                        {section.items.map((item) => {
                          const itemActive = isActiveItem(item.path);
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              className="flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-all hover:bg-white/5"
                              style={{
                                color: itemActive ? section.color : '#8892aa',
                                fontSize: 12,
                              }}
                            >
                              <i className={`${item.icon}`} style={{ fontSize: 11 }}></i>
                              <span>{item.label}</span>
                              {item.badge && (
                                <span
                                  className="ml-auto text-xs px-1 rounded font-bold"
                                  style={{
                                    background: `${section.color}20`,
                                    color: section.color,
                                    fontSize: 8,
                                  }}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                    <div
                      className="absolute left-full ml-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50"
                      style={{ background: '#0d131a', color: section.color, border: `1px solid ${section.color}40` }}
                    >
                      {section.label}
                    </div>
                  </>
                )}
              </button>

              {/* Collapsible sub-items with animation */}
              {!collapsed && (
                <div
                  className="overflow-hidden transition-all duration-200 ease-in-out"
                  style={{
                    maxHeight: isExpanded ? `${(section.items?.length || 0) * 30 + 4}px` : '0px',
                    opacity: isExpanded ? 1 : 0,
                    background: 'rgba(0,0,0,0.15)',
                  }}
                >
                  <div className="py-0.5">
                    {section.items?.map((item) => {
                      const itemActive = isActiveItem(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center h-7 px-3 pl-9 cursor-pointer transition-all"
                          style={{
                            background: itemActive ? `${section.color}15` : 'transparent',
                            borderLeft: itemActive ? `3px solid ${section.color}` : '3px solid transparent',
                            color: itemActive ? section.color : '#5a6577',
                            fontSize: 11,
                            fontWeight: itemActive ? 600 : 400,
                          }}
                        >
                          <i className={`${item.icon} text-xs mr-2 flex-shrink-0`}></i>
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className="ml-auto text-xs px-1 rounded font-bold flex-shrink-0"
                              style={{
                                background: `${section.color}20`,
                                color: section.color,
                                fontSize: 8,
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Links */}
      {!collapsed && (
        <div className="flex-shrink-0 px-3 py-2.5" style={{ borderTop: '1px solid #1e2a36' }}>
          <Link
            to="/profile"
            className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-all hover:bg-white/5 mb-1"
            style={{ color: '#5a6577', fontSize: 11 }}
          >
            <i className="ri-user-line text-xs"></i>
            <span>Profile</span>
          </Link>
          <Link
            to="/support"
            className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-all hover:bg-white/5"
            style={{ color: '#5a6577', fontSize: 11 }}
          >
            <i className="ri-question-line text-xs"></i>
            <span>Support</span>
          </Link>
        </div>
      )}
    </aside>
  );
}

/* ─────────────────────────────────────────────
   OGame X MAIN LAYOUT
───────────────────────────────────────────── */
export default function GameLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [eventCenterOpen, setEventCenterOpen] = useState(false);
  const location = useLocation();

  const sidebarWidth = collapsed ? 52 : 220;

  const isGalaxyPage = ['/galaxy', '/galaxy-map', '/universe', '/universe-3d', '/sectors', '/stargate-network'].includes(location.pathname);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('sidebar-collapse', { detail: { collapsed } }));
  }, [collapsed]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setRightPanelOpen((v) => !v);
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setEventCenterOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <TopBar
        sidebarWidth={sidebarWidth}
        onToggleRightPanel={() => setRightPanelOpen((v) => !v)}
        rightPanelOpen={rightPanelOpen}
        onToggleEventCenter={() => setEventCenterOpen((v) => !v)}
        eventCenterOpen={eventCenterOpen}
      />

      {/* No PageHeader breadcrumb — clean OGame style */}

      <main
        className="min-h-screen overflow-x-hidden"
        style={{
          marginLeft: sidebarWidth,
          paddingTop: 60,
          background: 'linear-gradient(180deg, #070a10 0%, #090c14 50%, #070a10 100%)',
          transition: 'margin-left 0.3s',
          maxWidth: `calc(100vw - ${sidebarWidth}px)`,
        }}
      >
        {children}
      </main>

      <Suspense fallback={null}>
        <RightSidePanel
          open={rightPanelOpen}
          onClose={() => setRightPanelOpen(false)}
        />
      </Suspense>

      <Suspense fallback={null}>
        <GameEventCenter
          open={eventCenterOpen}
          onClose={() => setEventCenterOpen(false)}
        />
      </Suspense>

      <Suspense fallback={null}>
        <ViewportControls
          onToggleRightPanel={() => setRightPanelOpen((v) => !v)}
          isGalaxyPage={isGalaxyPage}
        />
      </Suspense>

      <Suspense fallback={null}>
        <AchievementToastContainer />
      </Suspense>
    </SidebarContext.Provider>
  );
}