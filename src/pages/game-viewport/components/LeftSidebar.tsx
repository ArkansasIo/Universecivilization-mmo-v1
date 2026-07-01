import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCameraState } from './camera/CameraStateProvider';
import { useSelection } from './selection/SelectionContext';
import { useViewport } from '../../../components/feature/ViewportControls';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

interface NavSection {
  id: string;
  label: string;
  icon: string;
  color: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    id: 'overview', label: 'Overview', icon: 'ri-dashboard-3-line', color: '#f59e0b',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: 'ri-dashboard-3-line' },
      { label: 'Empire', path: '/empire', icon: 'ri-building-4-line' },
      { label: 'Profile', path: '/profile', icon: 'ri-user-line' },
    ],
  },
  {
    id: 'resources', label: 'Resources', icon: 'ri-copper-coin-line', color: '#fbbf24',
    items: [
      { label: 'Buildings', path: '/buildings', icon: 'ri-building-2-line' },
      { label: 'Colonies', path: '/colonies', icon: 'ri-planet-line' },
      { label: 'Storage', path: '/storage', icon: 'ri-archive-line' },
      { label: 'Population', path: '/population', icon: 'ri-community-line' },
    ],
  },
  {
    id: 'fleet', label: 'Fleet', icon: 'ri-rocket-2-line', color: '#f87171',
    items: [
      { label: 'Fleet', path: '/fleet', icon: 'ri-rocket-line' },
      { label: 'Shipyard', path: '/shipyard', icon: 'ri-ship-2-line' },
      { label: 'Defense', path: '/defense', icon: 'ri-shield-line' },
      { label: 'Officers', path: '/officers', icon: 'ri-user-star-line' },
    ],
  },
  {
    id: 'galaxy', label: 'Galaxy', icon: 'ri-global-line', color: '#38bdf8',
    items: [
      { label: 'Game Viewport', path: '/game-viewport', icon: 'ri-eye-line' },
      { label: '3D Universe', path: '/universe-3d', icon: 'ri-global-fill' },
      { label: 'Stellaris View', path: '/stellaris-view', icon: 'ri-map-line' },
      { label: 'Galaxy Map', path: '/galaxy-map', icon: 'ri-map-2-line' },
      { label: 'Sectors', path: '/sectors', icon: 'ri-layout-4-line' },
    ],
  },
  {
    id: 'research', label: 'Research', icon: 'ri-test-tube-line', color: '#a78bfa',
    items: [
      { label: 'Research Lab', path: '/research', icon: 'ri-test-tube-line' },
      { label: 'Advanced Research', path: '/advanced-research', icon: 'ri-microscope-line' },
      { label: 'Blueprints', path: '/blueprints', icon: 'ri-file-list-3-line' },
    ],
  },
  {
    id: 'economy', label: 'Economy', icon: 'ri-exchange-line', color: '#4ade80',
    items: [
      { label: 'Marketplace', path: '/marketplace', icon: 'ri-store-2-line' },
      { label: 'Trade Routes', path: '/trade-routes', icon: 'ri-route-line' },
      { label: 'Resource Trading', path: '/resource-trading', icon: 'ri-exchange-line' },
    ],
  },
  {
    id: 'social', label: 'Social', icon: 'ri-chat-3-line', color: '#818cf8',
    items: [
      { label: 'Alliance', path: '/alliance', icon: 'ri-group-line' },
      { label: 'Messages', path: '/messages', icon: 'ri-mail-line' },
      { label: 'Leaderboard', path: '/leaderboard', icon: 'ri-trophy-line' },
    ],
  },
];

const QUICK_ACTIONS = [
  { label: 'Center Capital', icon: 'ri-home-4-line', action: 'center' as const },
  { label: 'Reset View', icon: 'ri-restart-line', action: 'reset' as const },
  { label: 'Empire View', icon: 'ri-building-4-line', action: 'empire' as const },
];

export default function LeftSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { level, setLevel, setTarget } = useCameraState();
  const { selected, clear } = useSelection();
  const { setViewport } = useViewport();
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(['galaxy']));

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'center':
        setLevel('galaxy');
        setTarget(null);
        clear();
        break;
      case 'reset':
        setLevel('galaxy');
        setTarget(null);
        clear();
        setViewport({ x: 0, y: 0, zoom: 1 });
        break;
      case 'empire':
        navigate('/empire');
        break;
    }
  };

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 z-30 flex flex-col overflow-hidden"
      style={{
        width: 190,
        paddingTop: 44,
        background: 'linear-gradient(180deg, rgba(5,7,10,0.94) 0%, rgba(5,7,10,0.88) 100%)',
        borderRight: '1px solid rgba(30,42,54,0.6)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Quick actions */}
      <div className="flex gap-1 px-2 py-1.5 border-b" style={{ borderColor: 'rgba(30,42,54,0.4)' }}>
        {QUICK_ACTIONS.map((qa) => (
          <button
            key={qa.action}
            onClick={() => handleQuickAction(qa.action)}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all hover:bg-white/5"
            style={{ color: '#5a6577', background: 'rgba(255,255,255,0.03)' }}
            title={qa.label}
          >
            <i className={`${qa.icon} text-xs`} style={{ color: '#38bdf8' }}></i>
            <span className="hidden xl:block">{qa.label}</span>
          </button>
        ))}
      </div>

      {/* Viewport level indicator */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b" style={{ borderColor: 'rgba(30,42,54,0.4)' }}>
        {(['galaxy', 'system', 'planet'] as const).map((l) => (
          <button
            key={l}
            onClick={() => { setLevel(l); setTarget(null); clear(); }}
            className="flex-1 py-1 rounded text-2xs font-bold uppercase tracking-wider transition-all"
            style={{
              background: level === l ? 'rgba(56,189,248,0.12)' : 'transparent',
              color: level === l ? '#38bdf8' : '#5a6577',
              border: `1px solid ${level === l ? 'rgba(56,189,248,0.3)' : 'transparent'}`,
              fontSize: 9,
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Nav sections */}
      <div className="flex-1 overflow-y-auto py-1" style={{ scrollbarWidth: 'none' }}>
        {SECTIONS.map((section) => {
          const isExpanded = expanded.has(section.id);
          const hasActive = section.items.some((i) => location.pathname === i.path);
          return (
            <div key={section.id}>
              <button
                onClick={() => toggle(section.id)}
                className="flex items-center w-full h-7 px-3 text-left transition-all hover:bg-white/5"
                style={{ color: hasActive ? section.color : '#5a6577' }}
              >
                <i className={`${section.icon} text-xs mr-2`}></i>
                <span className="text-2xs font-semibold flex-1 uppercase tracking-wider" style={{ fontSize: 10 }}>
                  {section.label}
                </span>
                <i className={`ri-arrow-down-s-line text-2xs transition-transform ${isExpanded ? '' : '-rotate-90'}`} style={{ fontSize: 10 }}></i>
              </button>
              {isExpanded && (
                <div>
                  {section.items.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className="flex items-center w-full h-6 px-3 pl-8 transition-all text-left"
                        style={{
                          background: active ? `${section.color}12` : 'transparent',
                          borderLeft: active ? `2px solid ${section.color}` : '2px solid transparent',
                          color: active ? section.color : '#5a6577',
                        }}
                      >
                        <i className={`${item.icon} text-2xs mr-2`} style={{ fontSize: 10 }}></i>
                        <span className="text-xs truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom status */}
      <div
        className="flex-shrink-0 px-3 py-2 border-t"
        style={{ borderColor: 'rgba(30,42,54,0.4)' }}
      >
        <div className="flex items-center justify-between">
          <span className="text-2xs" style={{ color: '#5a6577', fontSize: 9 }}>
            {selected ? selected.type : 'No Selection'}
          </span>
          {selected && (
            <button
              onClick={clear}
              className="text-2xs transition-all hover:text-white"
              style={{ color: '#5a6577', fontSize: 9 }}
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
