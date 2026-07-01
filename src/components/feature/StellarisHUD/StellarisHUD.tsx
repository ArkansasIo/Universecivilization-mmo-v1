import { useState, type ReactNode } from 'react';
import type { StellarisPanel, StellarisModal } from './types';
import EmpirePanel from './EmpirePanel';
import PlanetsPanel from './PlanetsPanel';
import FleetsPanel from './FleetsPanel';
import TechnologyPanel from './TechnologyPanel';
import DiplomacyPanel from './DiplomacyPanel';
import EspionagePanel from './EspionagePanel';
import TraditionsPanel from './TraditionsPanel';
import LeadersPanel from './LeadersPanel';
import StarbasesPanel from './StarbasesPanel';
import ConstructionPanel from './ConstructionPanel';
import SciencePanel from './SciencePanel';
import ShipDesignerPanel from './ShipDesignerPanel';
import MegastructuresPanel from './MegastructuresPanel';
import AlertsPanel from './AlertsPanel';
import EventsPanel from './EventsPanel';
import VictoryPanel from './VictoryPanel';
import SettingsPanel from './SettingsPanel';
import { ColonizePanel, SurveyPanel, AttackPanel, TradePanel, FederationPanel, RelicsPanel, AchievementsPanel } from './ActionPanels';
import OutlinerPanel from './OutlinerPanel';

// ── Types ────────────────────────────────────────────────────────

// ── Resources ───────────────────────────────────────────────────
const RESOURCES = [
  { key: 'energy', label: 'Energy', value: 14208, rate: '+84', icon: 'ri-flashlight-line', color: '#f0e060' },
  { key: 'minerals', label: 'Minerals', value: 8432, rate: '+62', icon: 'ri-copper-coin-line', color: '#9aa0a6' },
  { key: 'food', label: 'Food', value: 3120, rate: '+28', icon: 'ri-plant-line', color: '#3aaa5e' },
  { key: 'alloys', label: 'Alloys', value: 1840, rate: '-12', icon: 'ri-tools-line', color: '#4a9dd4' },
  { key: 'influence', label: 'Influence', value: 874, rate: '+6', icon: 'ri-star-s-line', color: '#a78bfa' },
  { key: 'unity', label: 'Unity', value: 5280, rate: '+42', icon: 'ri-government-line', color: '#e87a5a' },
  { key: 'research', label: 'Research', value: 3740, rate: '+3740', icon: 'ri-flask-line', color: '#c8d8e8' },
];

// ── Left sidebar nav items ───────────────────────────────────────
const MAIN_NAV: { key: StellarisPanel; label: string; icon: string; color: string }[] = [
  { key: 'empire', label: 'Empire', icon: 'ri-building-4-line', color: '#c9a227' },
  { key: 'planets', label: 'Planets', icon: 'ri-planet-line', color: '#4a9dd4' },
  { key: 'fleets', label: 'Fleets', icon: 'ri-rocket-2-line', color: '#3aaa5e' },
  { key: 'technology', label: 'Technology', icon: 'ri-flask-line', color: '#a78bfa' },
  { key: 'diplomacy', label: 'Diplomacy', icon: 'ri-shake-hands-line', color: '#4a9dd4' },
  { key: 'espionage', label: 'Espionage', icon: 'ri-spy-line', color: '#e87a5a' },
  { key: 'traditions', label: 'Traditions', icon: 'ri-sparkling-2-line', color: '#c9a227' },
  { key: 'leaders', label: 'Leaders', icon: 'ri-user-star-line', color: '#c9a227' },
];

// ── Toolbar extra icons ──────────────────────────────────────────
const TOOLBAR: { key: StellarisModal; label: string; icon: string; color: string }[] = [
  { key: 'starbases', label: 'Starbases', icon: 'ri-focus-3-line', color: '#c9a227' },
  { key: 'construction', label: 'Construction', icon: 'ri-tools-line', color: '#4a9dd4' },
  { key: 'science', label: 'Science', icon: 'ri-microscope-line', color: '#a78bfa' },
  { key: 'shipdesigner', label: 'Ship Designer', icon: 'ri-settings-3-line', color: '#4a9dd4' },
  { key: 'megastructures', label: 'Megastructures', icon: 'ri-building-4-line', color: '#c9a227' },
];

// ── Action buttons (bottom bar) ──────────────────────────────────
const ACTION_BUTTONS: { key: StellarisModal; label: string; icon: string; color: string }[] = [
  { key: 'colonize', label: 'Colonize', icon: 'ri-planet-line', color: '#3aaa5e' },
  { key: 'survey', label: 'Survey', icon: 'ri-search-eye-line', color: '#4a9dd4' },
  { key: 'attack', label: 'Attack', icon: 'ri-sword-fill', color: '#e87a5a' },
  { key: 'trade', label: 'Trade', icon: 'ri-exchange-line', color: '#c9a227' },
  { key: 'federation', label: 'Federation', icon: 'ri-shield-star-line', color: '#3aaa5e' },
  { key: 'relics', label: 'Relics', icon: 'ri-ancient-pavilion-line', color: '#c9a227' },
  { key: 'achievements', label: 'Achievements', icon: 'ri-medal-line', color: '#c9a227' },
];

const SIDEBAR_W = 130;
const PANEL_W = 380;

function TopBar({ onModal }: { onModal: (m: StellarisModal) => void }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-30 flex items-center h-9 px-2 gap-1 flex-wrap overflow-hidden"
      style={{ background: 'rgba(10,16,24,0.98)', borderBottom: '1px solid #1d2d40', backdropFilter: 'blur(8px)' }}>
      {/* Resources */}
      {RESOURCES.map(r => (
        <div key={r.key} className="flex items-center gap-1 px-2 h-7 rounded cursor-pointer hover:bg-white/5 transition-colors group" title={r.label}>
          <i className={`${r.icon} text-sm flex-shrink-0`} style={{ color: r.color }}></i>
          <span className="text-xs font-semibold" style={{ color: '#c8d8e8' }}>
            {r.value >= 1000 ? `${(r.value / 1000).toFixed(1)}K` : r.value}
          </span>
          <span className="text-xs" style={{ color: r.rate.startsWith('+') ? '#3aaa5e' : '#e87a5a' }}>{r.rate}</span>
        </div>
      ))}

      {/* Separator */}
      <div className="w-px h-5 mx-1" style={{ background: '#1d2d40' }}></div>

      {/* Toolbar buttons */}
      {TOOLBAR.map(t => (
        <button key={t.key} onClick={() => onModal(t.key)} title={t.label} className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-white/10 transition-colors" style={{ color: t.color }}>
          <i className={`${t.icon} text-sm`}></i>
        </button>
      ))}

      <div className="w-px h-5 mx-1" style={{ background: '#1d2d40' }}></div>

      {/* Notifications + extra */}
      <button onClick={() => onModal('alerts')} title="Alerts" className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-white/10 transition-colors relative">
        <i className="ri-notification-3-line text-sm" style={{ color: '#e87a5a' }}></i>
        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full flex items-center justify-center" style={{ background: '#e87a5a', fontSize: 7, color: '#fff' }}>3</div>
      </button>
      <button onClick={() => onModal('events')} title="Events" className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-white/10 transition-colors">
        <i className="ri-calendar-event-line text-sm" style={{ color: '#4a9dd4' }}></i>
      </button>
      <button onClick={() => onModal('victory')} title="Victory" className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-white/10 transition-colors">
        <i className="ri-trophy-line text-sm" style={{ color: '#c9a227' }}></i>
      </button>
      <button onClick={() => onModal('settings')} title="Settings" className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-white/10 transition-colors ml-auto">
        <i className="ri-settings-3-line text-sm" style={{ color: '#6b8aaa' }}></i>
      </button>

      {/* Date */}
      <div className="text-xs font-bold px-2 py-1 rounded" style={{ background: 'rgba(0,0,0,0.3)', color: '#c9a227', border: '1px solid #1d2d40' }}>
        2370.06.01 ▶
      </div>
    </div>
  );
}

function LeftSidebar({ active, onSelect }: { active: StellarisPanel; onSelect: (k: StellarisPanel) => void }) {
  return (
    <div className="fixed left-0 top-9 bottom-0 z-20 flex flex-col overflow-hidden"
      style={{ width: SIDEBAR_W, background: '#060c14', borderRight: '1px solid #1d2d40' }}>

      {/* Empire header */}
      <div className="px-2 py-2 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40', background: 'rgba(0,0,0,0.4)' }}>
        <div className="flex items-center gap-2 rounded p-2" style={{ background: 'rgba(201,162,39,0.06)', border: '1px solid rgba(201,162,39,0.15)' }}>
          <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(201,162,39,0.15)' }}>
            <i className="ri-crown-fill text-sm" style={{ color: '#c9a227' }}></i>
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold truncate" style={{ color: '#c9a227', fontSize: 10 }}>Aetherion</div>
            <div className="text-xs truncate" style={{ color: '#6b8aaa', fontSize: 9 }}>Empire</div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {MAIN_NAV.map(nav => {
          const isActive = active === nav.key;
          return (
            <button
              key={nav.key}
              onClick={() => onSelect(isActive ? null : nav.key)}
              className="w-full flex flex-col items-center justify-center gap-1 py-3 px-1 cursor-pointer transition-all relative group"
              style={{
                background: isActive ? `${nav.color}12` : 'transparent',
                borderLeft: isActive ? `2px solid ${nav.color}` : '2px solid transparent',
                borderBottom: '1px solid #1d2d4060',
              }}
            >
              <i className={`${nav.icon} text-lg`} style={{ color: isActive ? nav.color : '#4a6a8a' }}></i>
              <span className="text-xs font-semibold" style={{ color: isActive ? nav.color : '#4a6a8a', fontSize: 10 }}>{nav.label}</span>
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0" style={{ borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: `6px solid ${nav.color}` }}></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom action bar icons */}
      <div className="flex-shrink-0 p-2 space-y-1" style={{ borderTop: '1px solid #1d2d40' }}>
        <div className="grid grid-cols-2 gap-1">
          {TOOLBAR.map(t => (
            <div key={t.key} title={t.label} className="rounded p-1 text-center cursor-pointer hover:bg-white/10 transition-colors" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
              <i className={`${t.icon} text-sm`} style={{ color: t.color }}></i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MainPanel({ panel, onClose }: { panel: StellarisPanel; onClose: () => void }) {
  if (!panel) return null;
  const PANEL_MAP: Record<string, JSX.Element> = {
    empire: <EmpirePanel onClose={onClose} />,
    planets: <PlanetsPanel onClose={onClose} />,
    fleets: <FleetsPanel onClose={onClose} />,
    technology: <TechnologyPanel onClose={onClose} />,
    diplomacy: <DiplomacyPanel onClose={onClose} />,
    espionage: <EspionagePanel onClose={onClose} />,
    traditions: <TraditionsPanel onClose={onClose} />,
    leaders: <LeadersPanel onClose={onClose} />,
  };
  return (
    <div className="fixed top-9 bottom-0 z-20 flex flex-col overflow-hidden"
      style={{ left: SIDEBAR_W, width: PANEL_W, background: '#0e1520', borderRight: '1px solid #1d2d40', boxShadow: '4px 0 24px rgba(0,0,0,0.4)' }}>
      {PANEL_MAP[panel] ?? null}
    </div>
  );
}

function BottomActionBar({ onModal }: { onModal: (m: StellarisModal) => void }) {
  return (
    <div className="fixed bottom-0 left-0 z-20 flex items-center gap-1 px-2 py-2"
      style={{ left: SIDEBAR_W, background: 'rgba(6,12,20,0.97)', borderTop: '1px solid #1d2d40', borderRight: '1px solid #1d2d40', backdropFilter: 'blur(8px)' }}>
      {ACTION_BUTTONS.map(a => (
        <button key={a.key} onClick={() => onModal(a.key)} title={a.label}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded cursor-pointer hover:bg-white/10 transition-colors"
          style={{ border: `1px solid ${a.color}30`, background: `${a.color}08` }}>
          <i className={`${a.icon} text-sm`} style={{ color: a.color }}></i>
          <span className="text-xs" style={{ color: a.color, fontSize: 9 }}>{a.label}</span>
        </button>
      ))}
    </div>
  );
}

function PlanetInfoCard() {
  const [open, setOpen] = useState(true);
  if (!open) return (
    <button onClick={() => setOpen(true)} className="fixed bottom-12 left-36 z-20 px-2 py-1 rounded text-xs cursor-pointer" style={{ background: '#0e1520', border: '1px solid #1d2d40', color: '#6b8aaa' }}>
      <i className="ri-planet-line mr-1"></i>System Info
    </button>
  );
  return (
    <div className="fixed bottom-14 z-20 rounded-lg overflow-hidden" style={{ left: SIDEBAR_W + 8, width: 280, background: '#0a1018', border: '1px solid #1d2d40', boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid #1d2d40', background: 'rgba(0,0,0,0.3)' }}>
        <div className="flex items-center gap-2">
          <i className="ri-star-line text-sm" style={{ color: '#c9a227' }}></i>
          <span className="text-xs font-bold" style={{ color: '#c8d8e8' }}>Sol System</span>
        </div>
        <button onClick={() => setOpen(false)} className="text-xs cursor-pointer" style={{ color: '#6b8aaa' }}><i className="ri-minimize-2-line"></i></button>
      </div>
      <div className="px-3 py-2 grid grid-cols-2 gap-2">
        {[
          { label: 'Star Class', value: 'G-Class Yellow', icon: 'ri-sun-line', color: '#f0e060' },
          { label: 'Planets', value: '5 bodies', icon: 'ri-planet-line', color: '#4a9dd4' },
          { label: 'Controlled By', value: 'Aetherion', icon: 'ri-crown-line', color: '#c9a227' },
          { label: 'Fleet Power', value: '★ 25.3K', icon: 'ri-rocket-2-line', color: '#3aaa5e' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <i className={`${s.icon} text-xs flex-shrink-0`} style={{ color: s.color }}></i>
            <div>
              <div className="text-xs" style={{ color: '#6b8aaa', fontSize: 9 }}>{s.label}</div>
              <div className="text-xs font-semibold" style={{ color: '#c8d8e8', fontSize: 10 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-3 pb-2 flex gap-1.5">
        {['View Planets', 'Deploy Fleet', 'Build Station'].map(btn => (
          <button key={btn} className="flex-1 py-1 rounded text-xs cursor-pointer" style={{ background: 'rgba(74,157,212,0.1)', border: '1px solid rgba(74,157,212,0.2)', color: '#4a9dd4', fontSize: 9 }}>
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Modal Router ─────────────────────────────────────────────────
function ModalLayer({ modal, onClose }: { modal: StellarisModal; onClose: () => void }) {
  if (!modal) return null;
  const MAP: Record<string, JSX.Element> = {
    starbases: <StarbasesPanel onClose={onClose} />,
    construction: <ConstructionPanel onClose={onClose} />,
    science: <SciencePanel onClose={onClose} />,
    shipdesigner: <ShipDesignerPanel onClose={onClose} />,
    megastructures: <MegastructuresPanel onClose={onClose} />,
    alerts: <AlertsPanel onClose={onClose} />,
    events: <EventsPanel onClose={onClose} />,
    victory: <VictoryPanel onClose={onClose} />,
    settings: <SettingsPanel onClose={onClose} />,
    colonize: <ColonizePanel onClose={onClose} />,
    survey: <SurveyPanel onClose={onClose} />,
    attack: <AttackPanel onClose={onClose} />,
    trade: <TradePanel onClose={onClose} />,
    federation: <FederationPanel onClose={onClose} />,
    relics: <RelicsPanel onClose={onClose} />,
    achievements: <AchievementsPanel onClose={onClose} />,
  };
  return MAP[modal] ?? null;
}

// ── Main export ──────────────────────────────────────────────────
export default function StellarisHUD({ children }: { children?: ReactNode }) {
  const [activePanel, setActivePanel] = useState<StellarisPanel>(null);
  const [activeModal, setActiveModal] = useState<StellarisModal>(null);

  const handlePanelSelect = (p: StellarisPanel) => {
    setActiveModal(null);
    setActivePanel(p);
  };
  const handleModal = (m: StellarisModal) => {
    setActivePanel(null);
    setActiveModal(m);
  };
  const closePanel = () => setActivePanel(null);
  const closeModal = () => setActiveModal(null);

  return (
    <div className="relative w-full h-full" style={{ background: '#08080f' }}>
      {/* ── Galaxy map / children ── */}
      <div
        className="absolute inset-0"
        style={{ top: 36, left: SIDEBAR_W, right: 220 }}
      >
        {children}
      </div>

      {/* ── HUD Overlay ── (pointer-events:none for passthrough in the middle) */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        {/* All interactive elements below re-enable pointer-events */}
        <div className="pointer-events-auto w-full h-full relative">

          {/* Top bar */}
          <TopBar onModal={handleModal} />

          {/* Left sidebar */}
          <LeftSidebar active={activePanel} onSelect={handlePanelSelect} />

          {/* Main sliding panel */}
          <MainPanel panel={activePanel} onClose={closePanel} />

          {/* Right: Outliner */}
          <OutlinerPanel setModal={handleModal} />

          {/* Bottom action bar */}
          <BottomActionBar onModal={handleModal} />

          {/* Planet info card */}
          <PlanetInfoCard />

          {/* Modal layer */}
          <ModalLayer modal={activeModal} onClose={closeModal} />
        </div>
      </div>
    </div>
  );
}
