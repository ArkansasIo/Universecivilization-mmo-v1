import { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
interface Fleet {
  id: string;
  owner: string;
  alliance: string;
  mission: string;
  ships: number;
  shipTypes: string;
  origin: string;
  destination: string;
  arrivalTime: string;
  returnTime: string | null;
  direction: 'incoming' | 'outgoing';
  isHostile: boolean;
}

interface Moon {
  id: string;
  coordinates: string;
  name: string;
  phalanxLevel: number;
  phalanxRange: number;
  scanCost: number;
  lastScan: string | null;
}

// ── Mock data ──────────────────────────────────────────────────────────────
const MOONS: Moon[] = [
  { id: 'm1', coordinates: '[1:234:8]', name: 'Home Moon Alpha', phalanxLevel: 5, phalanxRange: 5, scanCost: 5000, lastScan: '15 min ago' },
  { id: 'm2', coordinates: '[1:234:12]', name: 'Beta Moon', phalanxLevel: 3, phalanxRange: 3, scanCost: 3000, lastScan: '2h ago' },
];

const MOCK_FLEETS: Fleet[] = [
  {
    id: 'f1', owner: 'Emperor Stellar', alliance: '[VOID]',
    mission: 'Attack', ships: 1850, shipTypes: '500x Battleship, 800x Cruiser, 550x Fighter',
    origin: '[3:421:9]', destination: '[1:234:8]',
    arrivalTime: '00:23:15', returnTime: null,
    direction: 'incoming', isHostile: true,
  },
  {
    id: 'f2', owner: 'General Nova', alliance: '[NOVA]',
    mission: 'Transport', ships: 120, shipTypes: '120x Large Cargo',
    origin: '[1:234:5]', destination: '[1:234:12]',
    arrivalTime: '00:08:44', returnTime: '00:18:20',
    direction: 'outgoing', isHostile: false,
  },
  {
    id: 'f3', owner: 'Captain Zenith', alliance: '[NOVA]',
    mission: 'Espionage', ships: 5, shipTypes: '5x Espionage Probe',
    origin: '[2:87:3]', destination: '[1:240:6]',
    arrivalTime: '00:04:10', returnTime: '00:08:05',
    direction: 'incoming', isHostile: false,
  },
  {
    id: 'f4', owner: 'Lord Quantum', alliance: '[TITAN]',
    mission: 'Attack', ships: 3200, shipTypes: '1000x Battleship, 1500x Cruiser, 700x Destroyer',
    origin: '[2:156:5]', destination: '[1:234:12]',
    arrivalTime: '00:55:00', returnTime: null,
    direction: 'incoming', isHostile: true,
  },
  {
    id: 'f5', owner: 'Commander Nexus (You)', alliance: '[NOVA]',
    mission: 'Attack', ships: 800, shipTypes: '300x Battleship, 500x Cruiser',
    origin: '[1:234:8]', destination: '[3:421:9]',
    arrivalTime: '01:15:30', returnTime: '02:30:00',
    direction: 'outgoing', isHostile: false,
  },
  {
    id: 'f6', owner: 'Admiral Vortex', alliance: '[NOVA]',
    mission: 'Expedition', ships: 250, shipTypes: '200x Fighter, 50x Transport',
    origin: '[1:234:8]', destination: '[1:234:16]',
    arrivalTime: '00:30:00', returnTime: '08:30:00',
    direction: 'outgoing', isHostile: false,
  },
];

// ── Fleet card ─────────────────────────────────────────────────────────────
function FleetCard({ fleet }: { fleet: Fleet }) {
  const [expanded, setExpanded] = useState(false);

  const isIncoming = fleet.direction === 'incoming';
  const borderColor = fleet.isHostile ? '#f87171' : isIncoming ? '#fbbf24' : '#4ade80';
  const missionIcon: Record<string, string> = {
    'Attack': 'ri-sword-fill',
    'Transport': 'ri-truck-line',
    'Espionage': 'ri-user-search-line',
    'Expedition': 'ri-compass-3-line',
    'Deploy': 'ri-map-pin-line',
    'Colonize': 'ri-planet-line',
    'Harvest': 'ri-recycle-line',
  };

  return (
    <div
      className="rounded-xl overflow-hidden cursor-pointer transition-all"
      style={{ border: `1px solid ${borderColor}30`, background: fleet.isHostile ? 'rgba(248,113,113,0.04)' : 'rgba(255,255,255,0.02)' }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Direction arrow */}
        <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${borderColor}15` }}>
          <i className={`${isIncoming ? 'ri-arrow-left-down-line' : 'ri-arrow-right-up-line'} text-sm`} style={{ color: borderColor }}></i>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-white">{fleet.owner}</span>
            {fleet.alliance && <span className="text-xs text-purple-400">{fleet.alliance}</span>}
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${borderColor}12`, color: borderColor, border: `1px solid ${borderColor}25` }}>
              <i className={`${missionIcon[fleet.mission] || 'ri-rocket-line'} mr-1`}></i>
              {fleet.mission}
            </span>
            {fleet.isHostile && (
              <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full border border-red-400/20">⚠ Hostile</span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
            <span>{fleet.origin} → {fleet.destination}</span>
            <span className="text-gray-600">·</span>
            <span className="text-cyan-400">{fleet.ships.toLocaleString()} ships</span>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-xs text-gray-400">Arrival</p>
          <p className="text-sm font-bold" style={{ color: borderColor }}>{fleet.arrivalTime}</p>
        </div>

        <i className={`ri-arrow-${expanded ? 'up' : 'down'}-s-line text-gray-500 text-sm`}></i>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-white/5">
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-xs text-gray-500 mb-0.5">Ship Types</p>
              <p className="text-xs text-white">{fleet.shipTypes}</p>
            </div>
            <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-xs text-gray-500 mb-0.5">Return Time</p>
              <p className="text-xs text-white">{fleet.returnTime ?? 'One-way'}</p>
            </div>
          </div>
          {fleet.isHostile && (
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-1.5 text-xs rounded font-semibold bg-red-400/15 border border-red-400/30 text-red-400 hover:bg-red-400/25 cursor-pointer transition-all whitespace-nowrap">
                <i className="ri-shield-line mr-1"></i>Organize Defense
              </button>
              <button className="flex-1 py-1.5 text-xs rounded font-semibold bg-amber-400/15 border border-amber-400/30 text-amber-400 hover:bg-amber-400/25 cursor-pointer transition-all whitespace-nowrap">
                <i className="ri-mail-line mr-1"></i>Alert Alliance
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function SensorPhalanxPage() {
  const [selectedMoon, setSelectedMoon] = useState<Moon>(MOONS[0]);
  const [scanTarget, setScanTarget] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<Fleet[] | null>(null);
  const [filter, setFilter] = useState<'all' | 'hostile' | 'incoming' | 'outgoing'>('all');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleScan = async () => {
    if (!scanTarget) return;
    setScanning(true);
    await new Promise(r => setTimeout(r, 1500));
    setScanResult(MOCK_FLEETS.filter(f =>
      f.origin.includes(scanTarget.split(':')[1] || '') ||
      f.destination.includes(scanTarget.split(':')[1] || '')
    ));
    setScanning(false);
    showToast(`Phalanx scan complete — ${scanTarget} analyzed.`);
  };

  const fleets = scanResult ?? MOCK_FLEETS;
  const filtered = fleets.filter(f => {
    if (filter === 'hostile') return f.isHostile;
    if (filter === 'incoming') return f.direction === 'incoming';
    if (filter === 'outgoing') return f.direction === 'outgoing';
    return true;
  });

  const incomingHostile = MOCK_FLEETS.filter(f => f.isHostile && f.direction === 'incoming');

  return (
    <div className="text-white px-6 py-5">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-lg text-sm font-medium text-white"
          style={{ background: '#0d1526', border: '1px solid rgba(251,191,36,0.4)' }}>
          <i className="ri-check-line text-green-400 mr-2"></i>{toast}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-amber-400">Sensor Phalanx</h1>
        <p className="text-xs text-gray-400 mt-1">Scan coordinates to detect all fleet movements within range</p>
      </div>

      {/* Incoming threats alert */}
      {incomingHostile.length > 0 && (
        <div className="rounded-xl p-4 mb-5 flex items-center gap-3" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.35)' }}>
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-400/15 flex-shrink-0">
            <i className="ri-alarm-warning-fill text-red-400 text-lg"></i>
          </div>
          <div>
            <p className="text-sm font-bold text-red-400">⚠ {incomingHostile.length} Hostile Fleet{incomingHostile.length > 1 ? 's' : ''} Detected!</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {incomingHostile.map(f => `${f.owner} (${f.ships.toLocaleString()} ships, arrives ${f.arrivalTime})`).join(' · ')}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-5">
        {/* Left column — moon selector + scanner */}
        <div className="space-y-4">
          {/* Moon selector */}
          <div className="rounded-xl p-4" style={{ background: '#0d1526', border: '1px solid rgba(251,191,36,0.2)' }}>
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Select Moon</h3>
            <div className="space-y-2">
              {MOONS.map(moon => (
                <button
                  key={moon.id}
                  onClick={() => setSelectedMoon(moon)}
                  className="w-full text-left rounded-lg p-3 transition-all cursor-pointer"
                  style={selectedMoon.id === moon.id
                    ? { background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)' }
                    : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }
                  }
                >
                  <div className="flex items-center gap-2 mb-1">
                    <i className="ri-moon-fill text-cyan-300 text-sm"></i>
                    <span className="text-xs font-semibold text-white">{moon.name}</span>
                  </div>
                  <p className="text-xs text-gray-500">{moon.coordinates}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-xs">
                    <span className="text-amber-400">Phalanx Lv.{moon.phalanxLevel}</span>
                    <span className="text-gray-500">Range: {moon.phalanxRange} systems</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Phalanx info */}
          <div className="rounded-xl p-4" style={{ background: '#0d1526', border: '1px solid rgba(0,212,255,0.15)' }}>
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">Phalanx Status</h3>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Moon', val: selectedMoon.name, color: '#e2e8f0' },
                { label: 'Phalanx Level', val: `Level ${selectedMoon.phalanxLevel}`, color: '#fbbf24' },
                { label: 'Scan Range', val: `±${selectedMoon.phalanxRange} systems`, color: '#4ade80' },
                { label: 'Scan Cost', val: `${selectedMoon.scanCost.toLocaleString()} Deuterium`, color: '#4ade80' },
                { label: 'Last Scan', val: selectedMoon.lastScan ?? 'Never', color: '#9ca3af' },
              ].map(r => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-gray-500">{r.label}</span>
                  <span style={{ color: r.color }}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scanner input */}
          <div className="rounded-xl p-4" style={{ background: '#0d1526', border: '1px solid rgba(251,191,36,0.2)' }}>
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Scan Target</h3>
            <input
              value={scanTarget}
              onChange={e => setScanTarget(e.target.value)}
              placeholder="[G:S:P]"
              className="w-full bg-white/8 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono mb-3 focus:outline-none focus:border-amber-400/50"
            />
            <p className="text-xs text-gray-500 mb-3">
              Cost: {selectedMoon.scanCost.toLocaleString()} Deuterium<br/>
              Scans ±{selectedMoon.phalanxRange} systems around target
            </p>
            <button
              onClick={handleScan}
              disabled={!scanTarget || scanning}
              className="w-full py-2 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-40 whitespace-nowrap"
              style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24' }}
            >
              {scanning
                ? <><i className="ri-loader-4-line mr-1 animate-spin"></i>Scanning...</>
                : <><i className="ri-radar-line mr-1"></i>Activate Phalanx</>
              }
            </button>
          </div>
        </div>

        {/* Right 2/3 — fleet list */}
        <div className="col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1 bg-white/5 rounded-lg p-1">
              {(['all', 'incoming', 'outgoing', 'hostile'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap"
                  style={filter === f
                    ? { background: 'rgba(251,191,36,0.2)', color: '#fbbf24' }
                    : { color: '#6b7280' }
                  }
                >
                  {f}{f === 'hostile' && incomingHostile.length > 0 ? ` (${incomingHostile.length})` : ''}
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-500">{filtered.length} fleet movements detected</span>
          </div>

          {/* Fleet cards */}
          <div className="space-y-2">
            {filtered.map(fleet => <FleetCard key={fleet.id} fleet={fleet} />)}
            {filtered.length === 0 && (
              <div className="rounded-xl p-10 text-center" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <i className="ri-search-line text-3xl text-gray-600 block mb-2"></i>
                <p className="text-gray-400 text-sm">No fleets detected with current filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
