import { useState } from 'react';
import { useCameraState, type CameraLevel } from './camera/CameraStateProvider';
import { useSelection, type Selection } from './selection/SelectionContext';

interface Tab { id: string; label: string; icon: string; }

const TABS: Tab[] = [
  { id: 'info', label: 'Info', icon: 'ri-information-line' },
  { id: 'commands', label: 'Commands', icon: 'ri-command-line' },
  { id: 'selected', label: 'Selected', icon: 'ri-focus-3-line' },
];

export default function RightPanel() {
  const [activeTab, setActiveTab] = useState('info');
  const [collapsed, setCollapsed] = useState(false);
  const { level } = useCameraState();
  const { selected } = useSelection();

  if (collapsed) {
    return (
      <aside
        className="fixed right-0 top-0 bottom-0 z-30 flex flex-col items-center"
        style={{
          width: 36,
          paddingTop: 44,
          background: 'rgba(5,7,10,0.88)',
          borderLeft: '1px solid rgba(30,42,54,0.6)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setCollapsed(false); }}
            className="w-full h-8 flex items-center justify-center transition-all hover:bg-white/5"
            style={{ color: activeTab === tab.id ? '#38bdf8' : '#5a6577' }}
            title={tab.label}
          >
            <i className={`${tab.icon} text-sm`}></i>
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => setCollapsed(false)}
          className="w-full h-8 flex items-center justify-center transition-all hover:bg-white/5"
          style={{ color: '#5a6577' }}
        >
          <i className="ri-arrow-left-s-line text-sm"></i>
        </button>
      </aside>
    );
  }

  return (
    <aside
      className="fixed right-0 top-0 bottom-0 z-30 flex flex-col"
      style={{
        width: 260,
        paddingTop: 44,
        background: 'rgba(5,7,10,0.92)',
        borderLeft: '1px solid rgba(30,42,54,0.6)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: 'rgba(30,42,54,0.4)' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 h-7 flex items-center justify-center gap-1 text-xs transition-all"
            style={{
              color: activeTab === tab.id ? '#38bdf8' : '#5a6577',
              borderBottom: activeTab === tab.id ? '2px solid #38bdf8' : '2px solid transparent',
            }}
          >
            <i className={`${tab.icon} text-xs`}></i>
            <span className="hidden sm:block text-2xs">{tab.label}</span>
          </button>
        ))}
        <button
          onClick={() => setCollapsed(true)}
          className="w-7 h-7 flex items-center justify-center transition-all hover:bg-white/5"
          style={{ color: '#5a6577' }}
        >
          <i className="ri-arrow-right-s-line text-sm"></i>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {activeTab === 'info' && <InfoPanel level={level} />}
        {activeTab === 'commands' && <CommandsPanel level={level} selected={selected} />}
        {activeTab === 'selected' && <SelectedPanel selected={selected} />}
      </div>
    </aside>
  );
}

/* ── Info Panel ────────────────────────────── */
function InfoPanel({ level }: { level: CameraLevel }) {
  return (
    <div className="p-3 space-y-3">
      {level === 'galaxy' && <GalaxyInfo />}
      {level === 'system' && <SystemInfo />}
      {level === 'planet' && <PlanetInfo />}
    </div>
  );
}

const EMPIRE_STATS = [
  { label: 'Homeworld', value: 'Earth' },
  { label: 'Population', value: '12.4B' },
  { label: 'Systems Controlled', value: '47 / 499' },
  { label: 'Total Fleets', value: '12' },
  { label: 'Total Ships', value: '847' },
  { label: 'Military Power', value: '34.2K' },
  { label: 'Economy Rating', value: 'A+' },
  { label: 'Technology Level', value: 'Tier IV' },
];

const SYSTEM_INFO = [
  { label: 'Star Type', value: 'G-Class' },
  { label: 'Habitable Planets', value: '3' },
  { label: 'Total Planets', value: '5' },
  { label: 'Stations', value: '2' },
  { label: 'Fleets Present', value: '1' },
  { label: 'Anomalies', value: '1' },
];

const PLANET_INFO = [
  { label: 'Type', value: 'Terrestrial' },
  { label: 'Size', value: 'Medium' },
  { label: 'Population', value: '2.1B' },
  { label: 'Buildings', value: '8 / 12' },
  { label: 'Happiness', value: '78%' },
  { label: 'Development', value: '65%' },
];

function GalaxyInfo() {
  return (
    <>
      <Section title="EMPIRE OVERVIEW">
        {EMPIRE_STATS.map((s) => (
          <StatRow key={s.label} label={s.label} value={s.value} />
        ))}
      </Section>
      <Section title="ACTIVE FLEETS">
        <div className="space-y-0.5">
          <MiniFleetRow name="1st Fleet" location="Sol Prime" status="Idle" color="#5bc0be" />
          <MiniFleetRow name="2nd Fleet" location="Arcturus Gate" status="Patrolling" color="#fbbf24" />
          <MiniFleetRow name="Expedition Alpha" location="Void Nexus" status="Exploring" color="#a78bfa" />
        </div>
      </Section>
    </>
  );
}

function SystemInfo() {
  return (
    <>
      <Section title="SYSTEM DATA">
        {SYSTEM_INFO.map((s) => (
          <StatRow key={s.label} label={s.label} value={s.value} />
        ))}
      </Section>
      <Section title="RESOURCES IN SYSTEM">
        <StatRow label="Minerals" value="High" color="#d4a853" />
        <StatRow label="Gas" value="Medium" color="#7bc67e" />
        <StatRow label="Exotic" value="Low" color="#b98cd6" />
      </Section>
    </>
  );
}

function PlanetInfo() {
  return (
    <>
      <Section title="PLANET DATA">
        {PLANET_INFO.map((s) => (
          <StatRow key={s.label} label={s.label} value={s.value} />
        ))}
      </Section>
      <Section title="RESOURCES">
        <StatRow label="Food" value="+45 / tick" color="#7bc67e" />
        <StatRow label="Industry" value="+120 / tick" color="#fbbf24" />
        <StatRow label="Research" value="+30 / tick" color="#a78bfa" />
      </Section>
    </>
  );
}

/* ── Commands Panel ────────────────────────── */
function CommandsPanel({ level, selected }: { level: CameraLevel; selected: Selection | null }) {
  if (selected) {
    return <EntityCommands selected={selected} />;
  }
  return <LevelCommands level={level} />;
}

function LevelCommands({ level }: { level: CameraLevel }) {
  const cmds = level === 'galaxy' ? GALAXY_COMMANDS
    : level === 'system' ? SYSTEM_COMMANDS
    : PLANET_COMMANDS;

  return (
    <div className="p-3 space-y-1">
      <Section title={`${level.toUpperCase()} COMMANDS`}>
        {cmds.map((cmd) => (
          <CmdButton key={cmd.label} icon={cmd.icon} label={cmd.label} color={cmd.color} />
        ))}
      </Section>
    </div>
  );
}

function EntityCommands({ selected }: { selected: Selection }) {
  const cmds = selected.type === 'star' ? STAR_COMMANDS
    : selected.type === 'planet' ? PLANET_SELECT_COMMANDS
    : FLEET_COMMANDS;

  return (
    <div className="p-3 space-y-1">
      <Section title={`${selected.label.toUpperCase()}`}>
        {cmds.map((cmd) => (
          <CmdButton key={cmd.label} icon={cmd.icon} label={cmd.label} color={cmd.color} />
        ))}
      </Section>
    </div>
  );
}

const GALAXY_COMMANDS = [
  { icon: 'ri-search-line', label: 'Search Systems', color: '#5bc0be' },
  { icon: 'ri-radar-line', label: 'Scan Sector', color: '#38bdf8' },
  { icon: 'ri-flag-line', label: 'Set Waypoint', color: '#fbbf24' },
  { icon: 'ri-map-line', label: 'Toggle Hyperlanes', color: '#a78bfa' },
  { icon: 'ri-bubble-chart-line', label: 'Toggle Borders', color: '#4ade80' },
];

const SYSTEM_COMMANDS = [
  { icon: 'ri-ship-line', label: 'Send Fleet', color: '#f87171' },
  { icon: 'ri-building-4-line', label: 'Build Station', color: '#fbbf24' },
  { icon: 'ri-search-line', label: 'Survey System', color: '#5bc0be' },
  { icon: 'ri-flask-line', label: 'Research Anomaly', color: '#a78bfa' },
];

const PLANET_COMMANDS = [
  { icon: 'ri-building-2-line', label: 'Build Structure', color: '#fbbf24' },
  { icon: 'ri-rocket-line', label: 'Launch Colony Ship', color: '#f87171' },
  { icon: 'ri-shield-line', label: 'Garrison Defense', color: '#4ade80' },
];

const STAR_COMMANDS = [
  { icon: 'ri-ship-line', label: 'Send Fleet', color: '#f87171' },
  { icon: 'ri-search-line', label: 'Survey', color: '#5bc0be' },
  { icon: 'ri-flag-line', label: 'Set Waypoint', color: '#fbbf24' },
  { icon: 'ri-radar-line', label: 'Deep Scan', color: '#38bdf8' },
  { icon: 'ri-flask-line', label: 'Investigate Anomaly', color: '#a78bfa' },
];

const PLANET_SELECT_COMMANDS = [
  { icon: 'ri-building-2-line', label: 'Build Structure', color: '#fbbf24' },
  { icon: 'ri-shield-line', label: 'Garrison', color: '#4ade80' },
  { icon: 'ri-rocket-line', label: 'Colonize', color: '#f87171' },
  { icon: 'ri-radar-line', label: 'Scan Surface', color: '#38bdf8' },
];

const FLEET_COMMANDS = [
  { icon: 'ri-rocket-line', label: 'Move To', color: '#5bc0be' },
  { icon: 'ri-sword-line', label: 'Attack', color: '#f87171' },
  { icon: 'ri-shield-line', label: 'Patrol', color: '#fbbf24' },
  { icon: 'ri-ship-line', label: 'Merge Fleet', color: '#a78bfa' },
  { icon: 'ri-flag-line', label: 'Split Fleet', color: '#4ade80' },
];

/* ── Selected Panel ────────────────────────── */
function SelectedPanel({ selected }: { selected: Selection | null }) {
  if (!selected) {
    return (
      <div className="flex items-center justify-center h-full p-6 text-center">
        <div>
          <i className="ri-focus-3-line text-2xl block mb-2" style={{ color: '#1e2a36' }}></i>
          <p className="text-xs" style={{ color: '#5a6577' }}>
            Click a star, planet, or fleet in the viewport to see details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      <Section title={`${selected.type.toUpperCase()} — ${selected.label}`}>
        <StatRow label="ID" value={selected.id} />
        <StatRow label="Type" value={selected.type} />
        <StatRow label="Position" value={`${selected.position.x.toFixed(1)}, ${selected.position.y.toFixed(1)}, ${selected.position.z.toFixed(1)}`} />
      </Section>
      {selected.data && (
        <Section title="PROPERTIES">
          {Object.entries(selected.data).map(([k, v]) => (
            <StatRow key={k} label={k} value={String(v)} />
          ))}
        </Section>
      )}
    </div>
  );
}

/* ── Shared UI Components ─────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-2xs font-bold tracking-wider mb-1.5" style={{ color: '#5a6577', fontSize: 9, letterSpacing: '0.1em' }}>
        {title}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function StatRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-xs" style={{ color: '#5a6577' }}>{label}</span>
      <span className="text-xs font-semibold" style={{ color: color || '#8892aa' }}>{value}</span>
    </div>
  );
}

function CmdButton({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <button
      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-xs transition-all hover:bg-white/5 text-left"
      style={{ color: '#8892aa' }}
    >
      <i className={`${icon} text-sm`} style={{ color }}></i>
      <span>{label}</span>
    </button>
  );
}

function MiniFleetRow({ name, location, status, color }: { name: string; location: string; status: string; color: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <div className="flex items-center gap-1.5 min-w-0">
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
        <div className="min-w-0">
          <div className="text-xs truncate" style={{ color: '#8892aa' }}>{name}</div>
          <div className="text-2xs truncate" style={{ color: '#5a6577', fontSize: 9 }}>{location}</div>
        </div>
      </div>
      <span className="text-2xs flex-shrink-0 ml-2" style={{ color, fontSize: 9 }}>{status}</span>
    </div>
  );
}
