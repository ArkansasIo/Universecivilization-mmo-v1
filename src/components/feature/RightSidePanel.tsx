import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

/* ─────────────────────────────────────────────
   RIGHT PANEL NAV DATA — OGame X style
───────────────────────────────────────────── */
const RIGHT_SECTIONS = [
  {
    id: 'combat',
    label: 'COMBAT OPS',
    icon: 'ri-sword-fill',
    color: '#f87171',
    items: [
      { label: 'Ground Combat', path: '/ground-combat', icon: 'ri-shield-cross-line', badge: 'NEW', desc: 'Planetary invasion missions' },
      { label: 'Fleet Combat', path: '/fleet-combat', icon: 'ri-fire-line', desc: 'Space battle simulator' },
      { label: 'Combat Simulator', path: '/combat-simulator', icon: 'ri-sword-line', desc: 'Test battle outcomes' },
      { label: 'War Room', path: '/war-room', icon: 'ri-alarm-warning-line', desc: 'Active conflicts & alerts' },
      { label: 'Pirate Hunting', path: '/pirates', icon: 'ri-skull-2-line', desc: 'Hunt pirate fleets' },
      { label: 'World Bosses', path: '/world-bosses', icon: 'ri-skull-fill', desc: 'Epic boss encounters' },
    ],
  },
  {
    id: 'training',
    label: 'TRAINING & UNITS',
    icon: 'ri-team-line',
    color: '#fb923c',
    items: [
      { label: 'Training Center', path: '/training-center', icon: 'ri-building-4-line', badge: 'NEW', desc: 'Manage training tracks' },
      { label: 'Ground Units', path: '/units', icon: 'ri-group-line', desc: 'Infantry & special ops' },
      { label: 'Officers', path: '/officers', icon: 'ri-user-star-line', desc: 'Command officers' },
      { label: 'Fleet Formations', path: '/fleet-formations', icon: 'ri-layout-grid-line', desc: 'Tactical formations' },
      { label: 'ACS', path: '/acs', icon: 'ri-group-2-line', desc: 'Alliance combat system' },
    ],
  },
  {
    id: 'intel',
    label: 'INTELLIGENCE',
    icon: 'ri-user-search-line',
    color: '#a78bfa',
    items: [
      { label: 'Espionage', path: '/espionage', icon: 'ri-user-search-line', desc: 'Spy on enemies' },
      { label: 'Intel Reports', path: '/intel', icon: 'ri-eye-line', desc: 'Intelligence database' },
      { label: 'Sensor Phalanx', path: '/sensor-phalanx', icon: 'ri-radar-line', desc: 'Long-range scanning' },
      { label: 'Diplomacy', path: '/diplomacy', icon: 'ri-shake-hands-line', desc: 'Faction relations' },
    ],
  },
  {
    id: 'infrastructure',
    label: 'INFRASTRUCTURE',
    icon: 'ri-building-2-line',
    color: '#5bc0be',
    items: [
      { label: 'Starbases', path: '/starbases', icon: 'ri-focus-3-line', desc: 'Orbital stations' },
      { label: 'Moon Bases', path: '/moonbases', icon: 'ri-moon-line', desc: 'Lunar installations' },
      { label: 'Stargate Network', path: '/stargate-network', icon: 'ri-focus-2-line', desc: 'FTL gate network' },
      { label: 'Travel Network', path: '/travel-network', icon: 'ri-route-line', desc: 'Route management' },
      { label: 'Enhanced Mega', path: '/enhanced-megastructures', icon: 'ri-building-4-line', desc: 'Mega-scale builds' },
    ],
  },
  {
    id: 'power',
    label: 'ALC POWER SYSTEMS',
    icon: 'ri-flashlight-fill',
    color: '#06b6d4',
    items: [
      { label: 'Power Grid', path: '/power-grid', icon: 'ri-flashlight-line', desc: 'Grid management & distribution' },
      { label: 'ALC Power Tech Tree', path: '/alc-power-tech', icon: 'ri-git-branch-line', badge: 'TECH', desc: 'Research ALC power technologies' },
      { label: 'Reactor Research', path: '/reactor-research', icon: 'ri-file-code-line', badge: 'R&D', desc: 'Reactor blueprints & technology' },
      { label: 'Energy Storage', path: '/storage?tab=energy', icon: 'ri-battery-line', desc: 'Battery & capacitor banks' },
    ],
  },
  {
    id: 'economy',
    label: 'ECONOMY',
    icon: 'ri-exchange-line',
    color: '#4ade80',
    items: [
      { label: 'Marketplace', path: '/marketplace', icon: 'ri-store-2-line', desc: 'Buy & sell resources' },
      { label: 'Resource Trading', path: '/resource-trading', icon: 'ri-exchange-line', desc: 'Direct trades' },
      { label: 'Trade Routes', path: '/trade-routes', icon: 'ri-route-line', desc: 'Automated routes' },
      { label: 'Auction House', path: '/auction', icon: 'ri-auction-line', desc: 'Bid on rare items' },
      { label: 'Black Market', path: '/black-market', icon: 'ri-sword-line', desc: 'Illegal goods' },
    ],
  },
  {
    id: 'progression',
    label: 'PROGRESSION',
    icon: 'ri-bar-chart-line',
    color: '#e2c044',
    items: [
      { label: 'Skills', path: '/skills', icon: 'ri-star-line', desc: 'Commander skills' },
      { label: 'Achievements', path: '/achievements', icon: 'ri-medal-line', desc: 'Unlock rewards' },
      { label: 'Season Pass', path: '/season-pass', icon: 'ri-vip-crown-line', desc: 'Premium rewards' },
      { label: 'Quests', path: '/quests', icon: 'ri-questionnaire-line', desc: 'Active missions' },
      { label: 'Seasonal Events', path: '/seasonal-events', icon: 'ri-calendar-event-line', desc: 'Limited events' },
      { label: 'Planetary Events', path: '/planetary-events', icon: 'ri-earth-line', desc: 'Planet crises' },
    ],
  },
  {
    id: 'crafting',
    label: 'CRAFTING',
    icon: 'ri-hammer-line',
    color: '#f472b6',
    items: [
      { label: 'Crafting Workshop', path: '/crafting', icon: 'ri-hammer-line', desc: 'Craft equipment' },
      { label: 'Master Crafting', path: '/master-crafting', icon: 'ri-fire-fill', desc: 'Legendary items' },
      { label: 'Blueprints', path: '/blueprints', icon: 'ri-file-list-3-line', desc: 'Ship & weapon plans' },
      { label: 'Ship Customization', path: '/ship-customization', icon: 'ri-settings-3-line', desc: 'Customize loadouts' },
    ],
  },
  {
    id: 'social',
    label: 'SOCIAL',
    icon: 'ri-chat-3-line',
    color: '#818cf8',
    items: [
      { label: 'Alliance', path: '/alliance', icon: 'ri-shield-star-line', desc: 'Alliance management' },
      { label: 'Messages', path: '/messages', icon: 'ri-mail-line', desc: 'Private messages' },
      { label: 'Global Chat', path: '/chat', icon: 'ri-chat-3-line', desc: 'Live chat' },
      { label: 'Leaderboard', path: '/leaderboard', icon: 'ri-trophy-line', desc: 'Top players' },
    ],
  },
];

const QUICK_ACTIONS = [
  { icon: 'ri-rocket-2-line', label: 'Fleet', path: '/fleet', color: '#5bc0be', key: 'F' },
  { icon: 'ri-building-2-line', label: 'Build', path: '/buildings', color: '#d4a853', key: 'B' },
  { icon: 'ri-flask-line', label: 'Research', path: '/research', color: '#a78bfa', key: 'R' },
  { icon: 'ri-global-line', label: 'Galaxy', path: '/galaxy', color: '#60a5fa', key: 'G' },
  { icon: 'ri-sword-fill', label: 'Combat', path: '/ground-combat', color: '#f87171', key: 'C' },
  { icon: 'ri-exchange-line', label: 'Trade', path: '/marketplace', color: '#4ade80', key: 'T' },
  { icon: 'ri-user-search-line', label: 'Intel', path: '/espionage', color: '#a78bfa', key: 'I' },
  { icon: 'ri-map-2-line', label: 'Missions', path: '/missions', color: '#e2c044', key: 'M' },
];

/* ─────────────────────────────────────────────
   HOTKEY DATA
───────────────────────────────────────────── */
const HOTKEY_SECTIONS = [
  {
    title: 'VIEWPORT / CAMERA',
    color: '#5bc0be',
    icon: 'ri-camera-line',
    keys: [
      { key: 'WASD / Arrows', action: 'Pan camera' },
      { key: 'Scroll Wheel', action: 'Zoom in / out' },
      { key: 'Middle Mouse', action: 'Pan (drag)' },
      { key: 'Home', action: 'Center on capital' },
      { key: 'Space', action: 'Center on selection' },
      { key: 'Tab', action: 'Cycle selected objects' },
    ],
  },
  {
    title: 'GAME SPEED',
    color: '#e2c044',
    icon: 'ri-speed-line',
    keys: [
      { key: '1', action: 'Slow speed' },
      { key: '2', action: 'Normal speed' },
      { key: '3', action: 'Fast speed' },
      { key: '4', action: 'Fastest speed' },
      { key: 'P / Pause', action: 'Pause / unpause' },
    ],
  },
  {
    title: 'NAVIGATION',
    color: '#a78bfa',
    icon: 'ri-navigation-line',
    keys: [
      { key: 'F', action: 'Fleet Manager' },
      { key: 'B', action: 'Buildings' },
      { key: 'R', action: 'Research' },
      { key: 'G', action: 'Galaxy View' },
      { key: 'C', action: 'Ground Combat' },
      { key: 'T', action: 'Marketplace' },
      { key: 'I', action: 'Intel / Espionage' },
      { key: 'M', action: 'Missions' },
      { key: 'D', action: 'Dashboard' },
      { key: 'E', action: 'Empire Overview' },
      { key: 'Ctrl+P', action: 'Right Panel toggle' },
    ],
  },
  {
    title: 'FLEET COMMANDS',
    color: '#f87171',
    icon: 'ri-rocket-2-line',
    keys: [
      { key: 'A', action: 'Attack move' },
      { key: 'S', action: 'Stop / hold position' },
      { key: 'H', action: 'Return to base' },
      { key: 'F1-F8', action: 'Fleet group 1-8' },
      { key: 'Ctrl+F1-F8', action: 'Assign fleet group' },
    ],
  },
  {
    title: 'CONTROLLER',
    color: '#fb923c',
    icon: 'ri-gamepad-line',
    keys: [
      { key: 'L-Stick', action: 'Pan camera' },
      { key: 'R-Stick', action: 'Rotate / zoom' },
      { key: 'A / Cross', action: 'Select / confirm' },
      { key: 'B / Circle', action: 'Cancel / back' },
      { key: 'D-Pad', action: 'Cycle menus' },
      { key: 'Start', action: 'Pause / menu' },
    ],
  },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
interface RightSidePanelProps {
  open: boolean;
  onClose: () => void;
}

export default function RightSidePanel({ open, onClose }: RightSidePanelProps) {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<string[]>(['combat']);
  const [activeTab, setActiveTab] = useState<'menu' | 'quick' | 'hotkeys'>('menu');

  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    RIGHT_SECTIONS.forEach((s) => {
      if (s.items.some((i) => i.path === location.pathname)) {
        setOpenSections((prev) => (prev.includes(s.id) ? prev : [...prev, s.id]));
      }
    });
  }, [location.pathname]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.3)' }}
          onClick={onClose}
        />
      )}

      <aside
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col transition-transform duration-300"
        style={{
          width: 280,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          background: 'linear-gradient(180deg, #0a0e13 0%, #080b0f 100%)',
          borderLeft: '2px solid #1e2a36',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 flex-shrink-0"
          style={{ height: 60, borderBottom: '2px solid #1e2a36' }}
        >
          <div className="flex items-center gap-2">
            <i className="ri-apps-2-line text-sm" style={{ color: '#d4a853' }}></i>
            <span className="text-xs font-black tracking-widest" style={{ color: '#d4a853' }}>
              COMMAND PANEL
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded cursor-pointer transition-all hover:bg-white/5"
            style={{ color: '#5a6577' }}
          >
            <i className="ri-close-line text-base"></i>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-shrink-0" style={{ borderBottom: '1px solid #1e2a36' }}>
          {(['menu', 'quick', 'hotkeys'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 text-xs font-bold tracking-wider cursor-pointer transition-all"
              style={{
                color: activeTab === tab ? '#d4a853' : '#4a5568',
                borderBottom: activeTab === tab ? '2px solid #d4a853' : '2px solid transparent',
                background: activeTab === tab ? 'rgba(212,168,83,0.05)' : 'transparent',
              }}
            >
              {tab === 'menu' ? 'MENUS' : tab === 'quick' ? 'QUICK' : 'HOTKEYS'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

          {/* ── MENUS TAB ── */}
          {activeTab === 'menu' && (
            <div className="py-1.5">
              {RIGHT_SECTIONS.map((section) => {
                const isOpen = openSections.includes(section.id);
                const hasActive = section.items.some((i) => i.path === location.pathname);
                return (
                  <div key={section.id}>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center h-9 px-4 cursor-pointer transition-all"
                      style={{
                        background: hasActive && !isOpen ? `${section.color}10` : 'transparent',
                        borderLeft: hasActive ? `3px solid ${section.color}` : '3px solid transparent',
                        color: hasActive ? section.color : '#6b7a95',
                      }}
                    >
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <i className={`${section.icon} text-sm`} style={{ color: section.color }}></i>
                      </div>
                      <span className="ml-2.5 text-xs font-bold tracking-wider flex-1 text-left whitespace-nowrap">
                        {section.label}
                      </span>
                      <i
                        className={`ri-arrow-down-s-line text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        style={{ color: hasActive ? section.color : '#3a4557' }}
                      ></i>
                    </button>

                    {isOpen && (
                      <div style={{ background: 'rgba(0,0,0,0.2)' }}>
                        {section.items.map((item) => {
                          const active = isActive(item.path);
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={onClose}
                              className="flex items-center gap-3 px-4 pl-10 py-2 cursor-pointer transition-all group"
                              style={{
                                background: active ? `${section.color}12` : 'transparent',
                                borderLeft: active ? `3px solid ${section.color}` : '3px solid transparent',
                              }}
                            >
                              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                                <i
                                  className={`${item.icon} text-xs`}
                                  style={{ color: active ? section.color : '#5a6577' }}
                                ></i>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className="text-xs font-medium truncate"
                                    style={{ color: active ? section.color : '#6b7a95' }}
                                  >
                                    {item.label}
                                  </span>
                                  {item.badge && (
                                    <span
                                      className="text-xs px-1 rounded font-bold flex-shrink-0"
                                      style={{
                                        background: `${section.color}20`,
                                        color: section.color,
                                        fontSize: 9,
                                      }}
                                    >
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs truncate" style={{ color: '#3a4557', fontSize: 10 }}>
                                  {item.desc}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── QUICK ACCESS TAB ── */}
          {activeTab === 'quick' && (
            <div className="p-4">
              <p className="text-xs mb-4" style={{ color: '#3a4557' }}>
                Quick-access shortcuts to key game systems.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <Link
                    key={action.path}
                    to={action.path}
                    onClick={onClose}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-all hover:scale-105"
                    style={{
                      background: `${action.color}08`,
                      border: `1px solid ${action.color}20`,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: `${action.color}15` }}
                    >
                      <i className={`${action.icon} text-lg`} style={{ color: action.color }}></i>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: action.color }}>
                      {action.label}
                    </span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-mono font-bold"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        color: '#5a6577',
                        border: '1px solid rgba(255,255,255,0.06)',
                        fontSize: 10,
                      }}
                    >
                      {action.key}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-6">
                <div className="text-xs font-bold tracking-wider mb-3" style={{ color: '#3a4557' }}>
                  RECENTLY VISITED
                </div>
                {[
                  { label: 'Ground Combat', path: '/ground-combat', icon: 'ri-shield-cross-line', color: '#f87171' },
                  { label: 'Training Center', path: '/training-center', icon: 'ri-building-4-line', color: '#fb923c' },
                  { label: 'Fleet Manager', path: '/fleet', icon: 'ri-rocket-2-line', color: '#5bc0be' },
                  { label: 'Galaxy View', path: '/galaxy', icon: 'ri-global-line', color: '#60a5fa' },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className="flex items-center gap-3 px-2 py-2 rounded cursor-pointer transition-all hover:bg-white/5"
                    style={{ color: '#5a6577' }}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className={`${item.icon} text-sm`} style={{ color: item.color }}></i>
                    </div>
                    <span className="text-xs">{item.label}</span>
                    <i className="ri-arrow-right-s-line ml-auto text-xs" style={{ color: '#3a4557' }}></i>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── HOTKEYS TAB ── */}
          {activeTab === 'hotkeys' && (
            <div className="p-4">
              <p className="text-xs mb-4" style={{ color: '#3a4557' }}>
                Keyboard bindings — OGame / Stellaris style.
              </p>
              {HOTKEY_SECTIONS.map((section) => (
                <HotkeyBlock key={section.title} {...section} />
              ))}
            </div>
          )}
        </div>

        {/* Footer status */}
        <div
          className="flex-shrink-0 px-4 py-3 flex items-center gap-3"
          style={{ borderTop: '1px solid #1e2a36' }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
            <span className="text-xs" style={{ color: '#4a5568' }}>All systems online</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-xs font-mono" style={{ color: '#4a5568' }}>Ctrl+P</span>
            <span className="text-xs" style={{ color: '#4a5568' }}>to toggle</span>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ─────────────────────────────────────────────
   HOTKEY BLOCK
───────────────────────────────────────────── */
function HotkeyBlock({
  title, color, icon, keys,
}: {
  title: string; color: string; icon: string; keys: { key: string; action: string }[];
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 py-1.5 cursor-pointer"
      >
        <div className="w-4 h-4 flex items-center justify-center">
          <i className={`${icon} text-xs`} style={{ color }}></i>
        </div>
        <span className="text-xs font-bold tracking-wider flex-1 text-left" style={{ color }}>
          {title}
        </span>
        <i
          className={`ri-arrow-down-s-line text-xs transition-transform ${open ? 'rotate-180' : ''}`}
          style={{ color: '#4a5568' }}
        ></i>
      </button>
      {open && (
        <div
          className="rounded-lg overflow-hidden mb-1"
          style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${color}18` }}
        >
          {keys.map((k, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-1.5"
              style={{ borderBottom: i < keys.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}
            >
              <span className="text-xs" style={{ color: '#5a6577' }}>{k.action}</span>
              <span
                className="text-xs font-mono px-1.5 py-0.5 rounded whitespace-nowrap"
                style={{
                  background: `${color}12`,
                  color,
                  border: `1px solid ${color}28`,
                  fontSize: 10,
                }}
              >
                {k.key}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}