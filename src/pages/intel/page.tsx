import { useState } from 'react';
import { Link } from 'react-router-dom';

/* ── Types ─────────────────────────────────────────────────────────────── */
type ScanType = 'fleet' | 'resources' | 'defense' | 'technology' | 'full';

interface IntelReport {
  id: string;
  target: string;
  targetCoords: string;
  targetRace: string;
  type: ScanType;
  data: Record<string, number | string>;
  timestamp: string;
  reliability: number;
  detected: boolean;
  agentLevel: number;
}

interface ScanConfig {
  type: ScanType;
  label: string;
  icon: string;
  color: string;
  cost: { metal: number; crystal: number; deuterium: number };
  time: string;
  detectionChance: number;
  description: string;
}

/* ── Scan configs ──────────────────────────────────────────────────────── */
const SCAN_TYPES: ScanConfig[] = [
  {
    type: 'fleet',
    label: 'Fleet Scan',
    icon: 'ri-rocket-2-line',
    color: '#60a5fa',
    cost: { metal: 10000, crystal: 5000, deuterium: 2000 },
    time: '45s',
    detectionChance: 25,
    description: 'Reveals all fleet compositions, ship counts, and hangar inventory.',
  },
  {
    type: 'resources',
    label: 'Resource Scan',
    icon: 'ri-copper-coin-line',
    color: '#fcd34d',
    cost: { metal: 5000, crystal: 2500, deuterium: 1000 },
    time: '30s',
    detectionChance: 15,
    description: 'Reveals metal, crystal, deuterium, and dark matter stockpiles.',
  },
  {
    type: 'defense',
    label: 'Defense Scan',
    icon: 'ri-shield-cross-line',
    color: '#f87171',
    cost: { metal: 15000, crystal: 7500, deuterium: 3000 },
    time: '60s',
    detectionChance: 35,
    description: 'Reveals planetary defenses, shield levels, and turret counts.',
  },
  {
    type: 'technology',
    label: 'Tech Scan',
    icon: 'ri-flask-line',
    color: '#a78bfa',
    cost: { metal: 20000, crystal: 10000, deuterium: 5000 },
    time: '90s',
    detectionChance: 45,
    description: 'Reveals technology levels, research progress, and special modules.',
  },
  {
    type: 'full',
    label: 'Full Probe',
    icon: 'ri-eye-line',
    color: '#f43f5e',
    cost: { metal: 50000, crystal: 25000, deuterium: 15000 },
    time: '3m',
    detectionChance: 80,
    description: 'Complete scan of all systems — fleet, resources, defenses, and technology.',
  },
];

const MOCK_REPORTS: IntelReport[] = [
  {
    id: 'r1',
    target: 'Admiral Vortex',
    targetCoords: '[2:345:7]',
    targetRace: 'Terran Empire',
    type: 'fleet',
    data: { Battleships: 150, Cruisers: 300, Destroyers: 450, Fighters: 1200, Frigates: 280, Carriers: 12 },
    timestamp: '5 min ago',
    reliability: 95,
    detected: false,
    agentLevel: 7,
  },
  {
    id: 'r2',
    target: 'Commander Storm',
    targetCoords: '[1:123:4]',
    targetRace: 'Void Collective',
    type: 'resources',
    data: { Metal: 2500000, Crystal: 1200000, Deuterium: 500000, 'Dark Matter': 4500, 'Imperial Credits': 8200000 },
    timestamp: '15 min ago',
    reliability: 88,
    detected: false,
    agentLevel: 5,
  },
  {
    id: 'r3',
    target: 'General Chaos',
    targetCoords: '[3:567:2]',
    targetRace: 'Iron Federation',
    type: 'defense',
    data: { 'Plasma Turrets': 500, 'Ion Cannons': 300, 'Missile Batteries': 200, 'Shield Generators': 45, 'Defense Platforms': 18 },
    timestamp: '1 hour ago',
    reliability: 72,
    detected: true,
    agentLevel: 4,
  },
  {
    id: 'r4',
    target: 'Emperor Rhal',
    targetCoords: '[5:891:11]',
    targetRace: 'Void Collective',
    type: 'technology',
    data: { 'Weapon Tech': 18, 'Shield Tech': 15, 'Armor Tech': 16, 'Drive Tech': 12, 'Plasma Physics': 8, 'Espionage': 14 },
    timestamp: '3 hours ago',
    reliability: 91,
    detected: false,
    agentLevel: 9,
  },
  {
    id: 'r5',
    target: 'Lady Xenith',
    targetCoords: '[4:210:6]',
    targetRace: 'Stellar Empire',
    type: 'full',
    data: { Battleships: 85, Metal: 1800000, 'Plasma Turrets': 200, 'Weapon Tech': 14, Crystal: 900000 },
    timestamp: '6 hours ago',
    reliability: 84,
    detected: true,
    agentLevel: 6,
  },
];

/* ── Sub-components ─────────────────────────────────────────────────────── */
function ReportCard({ report, onView }: { report: IntelReport; onView: (r: IntelReport) => void }) {
  const cfg = SCAN_TYPES.find(s => s.type === report.type)!;
  return (
    <div
      className="rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.01]"
      style={{ background: '#0d1526', border: `1px solid ${cfg.color}20` }}
      onClick={() => onView(report)}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${cfg.color}15` }}>
          <i className={`${cfg.icon} text-base`} style={{ color: cfg.color }}></i>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-bold text-white">{report.target}</span>
            <span className="text-xs text-gray-400">{report.targetCoords}</span>
            {report.detected && (
              <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171' }}>
                <i className="ri-alert-line mr-0.5"></i>Detected
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
            <span className="text-gray-500">{report.timestamp}</span>
            <span style={{ color: report.reliability >= 90 ? '#4ade80' : report.reliability >= 70 ? '#fbbf24' : '#f87171' }}>
              {report.reliability}% reliable
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {Object.entries(report.data).slice(0, 4).map(([k, v]) => (
              <span key={k} className="text-xs px-2 py-0.5 rounded" style={{ background: `${cfg.color}10`, color: cfg.color, border: `1px solid ${cfg.color}20` }}>
                {k}: {typeof v === 'number' ? v.toLocaleString() : v}
              </span>
            ))}
            {Object.keys(report.data).length > 4 && (
              <span className="text-xs text-gray-500">+{Object.keys(report.data).length - 4} more</span>
            )}
          </div>
        </div>
        <i className="ri-arrow-right-s-line text-gray-500 flex-shrink-0"></i>
      </div>
    </div>
  );
}

function ReportModal({ report, onClose }: { report: IntelReport; onClose: () => void }) {
  const cfg = SCAN_TYPES.find(s => s.type === report.type)!;
  const dataEntries = Object.entries(report.data);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl overflow-hidden" style={{ background: '#0a0f1e', border: `1px solid ${cfg.color}40` }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: `1px solid ${cfg.color}15`, background: `${cfg.color}06` }}>
          <div className="flex items-center gap-2">
            <i className={`${cfg.icon} text-base`} style={{ color: cfg.color }}></i>
            <h2 className="text-sm font-bold" style={{ color: cfg.color }}>{cfg.label} Report</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer">
            <i className="ri-close-line text-sm"></i>
          </button>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">{report.target}</h3>
              <p className="text-xs text-gray-400">{report.targetCoords} · {report.targetRace}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                {report.detected && (
                  <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171' }}>Detected</span>
                )}
                <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: `${cfg.color}12`, color: cfg.color, border: `1px solid ${cfg.color}25` }}>
                  Lv.{report.agentLevel} Agent
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{report.timestamp}</p>
            </div>
          </div>

          {/* Reliability meter */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Data Reliability</span>
              <span className="font-bold" style={{ color: report.reliability >= 90 ? '#4ade80' : report.reliability >= 70 ? '#fbbf24' : '#f87171' }}>
                {report.reliability}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-2 rounded-full" style={{
                width: `${report.reliability}%`,
                background: report.reliability >= 90 ? '#4ade80' : report.reliability >= 70 ? '#fbbf24' : '#f87171'
              }}></div>
            </div>
          </div>

          {/* Data table */}
          <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${cfg.color}15` }}>
            {dataEntries.map(([key, value], i) => (
              <div key={key} className="flex items-center justify-between px-4 py-2.5" style={{ background: i % 2 === 0 ? `${cfg.color}05` : 'transparent' }}>
                <span className="text-xs text-gray-400">{key}</span>
                <span className="text-sm font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <Link to="/fleet" onClick={onClose} className="flex-1 py-2 text-xs font-bold rounded-lg text-center cursor-pointer transition-all whitespace-nowrap" style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171' }}>
              <i className="ri-sword-fill mr-1"></i>Attack
            </Link>
            <Link to="/espionage" onClick={onClose} className="flex-1 py-2 text-xs font-bold rounded-lg text-center cursor-pointer transition-all whitespace-nowrap" style={{ background: `${cfg.color}12`, border: `1px solid ${cfg.color}30`, color: cfg.color }}>
              <i className="ri-user-search-line mr-1"></i>Deep Probe
            </Link>
            <button onClick={onClose} className="px-3 py-2 text-xs rounded-lg text-gray-400 cursor-pointer transition-all whitespace-nowrap" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────────────── */
export default function IntelPage() {
  const [activeTab, setActiveTab] = useState<'scan' | 'reports' | 'network'>('scan');
  const [scanTarget, setScanTarget] = useState('');
  const [selectedScanType, setSelectedScanType] = useState<ScanType>('fleet');
  const [agentCount, setAgentCount] = useState(3);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; detected: boolean } | null>(null);
  const [reports, setReports] = useState<IntelReport[]>(MOCK_REPORTS);
  const [viewReport, setViewReport] = useState<IntelReport | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const cfg = SCAN_TYPES.find(s => s.type === selectedScanType)!;
  const adjustedDetection = Math.max(5, cfg.detectionChance - (agentCount - 1) * 8);

  const handleScan = async () => {
    if (!scanTarget) return;
    setScanning(true);
    setScanResult(null);
    await new Promise(r => setTimeout(r, 1800));
    const success = Math.random() > 0.15;
    const detected = Math.random() * 100 < adjustedDetection;
    setScanResult({ success, message: success ? `${cfg.label} complete. Report added to Intel archives.` : 'Scan failed — target may have counter-intelligence active.', detected });
    if (success) {
      const mockData: Record<string, number> = {};
      if (selectedScanType === 'resources' || selectedScanType === 'full') {
        mockData['Metal'] = Math.floor(Math.random() * 3000000) + 500000;
        mockData['Crystal'] = Math.floor(Math.random() * 1500000) + 200000;
        mockData['Deuterium'] = Math.floor(Math.random() * 800000) + 100000;
      }
      if (selectedScanType === 'fleet' || selectedScanType === 'full') {
        mockData['Battleships'] = Math.floor(Math.random() * 500);
        mockData['Cruisers'] = Math.floor(Math.random() * 1000);
        mockData['Fighters'] = Math.floor(Math.random() * 3000);
      }
      if (selectedScanType === 'defense' || selectedScanType === 'full') {
        mockData['Plasma Turrets'] = Math.floor(Math.random() * 600);
        mockData['Ion Cannons'] = Math.floor(Math.random() * 400);
      }
      const newReport: IntelReport = {
        id: `r${Date.now()}`,
        target: `Target ${scanTarget}`,
        targetCoords: scanTarget,
        targetRace: 'Unknown',
        type: selectedScanType,
        data: mockData,
        timestamp: 'just now',
        reliability: Math.floor(Math.random() * 20) + 75 + agentCount * 2,
        detected,
        agentLevel: agentCount,
      };
      setReports(prev => [newReport, ...prev]);
    }
    setScanning(false);
  };

  const filteredReports = filterType === 'all' ? reports : reports.filter(r => r.type === filterType);

  return (
    <div className="text-white px-6 py-5">
      {viewReport && <ReportModal report={viewReport} onClose={() => setViewReport(null)} />}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-indigo-400">Intelligence Center</h1>
        <p className="text-xs text-gray-400 mt-1">Gather intelligence on enemy positions, fleets, and resources</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Reports', val: reports.length, icon: 'ri-file-list-3-line', color: '#818cf8' },
          { label: 'Detected', val: reports.filter(r => r.detected).length, icon: 'ri-alert-line', color: '#f87171' },
          { label: 'Avg Reliability', val: `${Math.round(reports.reduce((a, r) => a + r.reliability, 0) / reports.length)}%`, icon: 'ri-bar-chart-2-line', color: '#4ade80' },
          { label: 'Agent Level', val: agentCount, icon: 'ri-user-search-line', color: '#fbbf24' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3.5 flex items-center gap-3" style={{ background: `${s.color}0a`, border: `1px solid ${s.color}20` }}>
            <div className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${s.color}15` }}>
              <i className={`${s.icon} text-base`} style={{ color: s.color }}></i>
            </div>
            <div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-lg font-black" style={{ color: s.color }}>{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-white/5 rounded-lg p-1 w-fit">
        {([['scan', 'Launch Scan', 'ri-radar-line'], ['reports', `Reports (${reports.length})`, 'ri-file-list-3-line'], ['network', 'Agent Network', 'ri-global-line']] as const).map(([id, label, icon]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap"
            style={activeTab === id
              ? { background: 'rgba(129,140,248,0.2)', color: '#818cf8', border: '1px solid rgba(129,140,248,0.35)' }
              : { color: '#6b7280' }
            }
          >
            <i className={icon}></i>{label}
          </button>
        ))}
      </div>

      {/* Scan tab */}
      {activeTab === 'scan' && (
        <div className="grid grid-cols-3 gap-5">
          {/* Scan type selector */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Scan Type</h3>
            {SCAN_TYPES.map(sc => (
              <button
                key={sc.type}
                onClick={() => setSelectedScanType(sc.type)}
                className="w-full text-left rounded-xl p-3.5 transition-all cursor-pointer"
                style={selectedScanType === sc.type
                  ? { background: `${sc.color}12`, border: `1px solid ${sc.color}40` }
                  : { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }
                }
              >
                <div className="flex items-center gap-2 mb-1">
                  <i className={`${sc.icon} text-sm flex-shrink-0`} style={{ color: sc.color }}></i>
                  <span className="text-xs font-bold text-white">{sc.label}</span>
                </div>
                <p className="text-xs text-gray-500">{sc.description}</p>
                <div className="flex gap-2 mt-2 text-xs">
                  <span style={{ color: sc.color }}>⏱ {sc.time}</span>
                  <span style={{ color: sc.detectionChance > 50 ? '#f87171' : sc.detectionChance > 30 ? '#fbbf24' : '#4ade80' }}>
                    {sc.detectionChance}% detect risk
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Scan config */}
          <div className="col-span-2 space-y-4">
            {/* Target input */}
            <div className="rounded-xl p-4" style={{ background: '#0d1526', border: `1px solid ${cfg.color}20` }}>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: cfg.color }}>Target Coordinates</h3>
              <input
                value={scanTarget}
                onChange={e => setScanTarget(e.target.value)}
                placeholder="[G:S:P] e.g. [1:234:8]"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono mb-3 focus:outline-none"
                style={{ '--tw-ring-color': cfg.color } as React.CSSProperties}
              />
              
              {/* Agent count */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold text-white">Espionage Probes</p>
                  <p className="text-xs text-gray-500">More probes = higher reliability, lower detection risk</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setAgentCount(a => Math.max(1, a - 1))} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <i className="ri-subtract-line text-xs"></i>
                  </button>
                  <span className="text-lg font-black text-white w-8 text-center">{agentCount}</span>
                  <button onClick={() => setAgentCount(a => Math.min(15, a + 1))} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <i className="ri-add-line text-xs"></i>
                  </button>
                </div>
              </div>

              {/* Cost summary */}
              <div className="rounded-lg p-3 mb-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-xs text-gray-500 mb-2">Scan Cost × {agentCount} probes</p>
                <div className="flex gap-4 text-xs">
                  <span style={{ color: '#fcd34d' }}>Metal: {(cfg.cost.metal * agentCount).toLocaleString()}</span>
                  <span style={{ color: '#60a5fa' }}>Crystal: {(cfg.cost.crystal * agentCount).toLocaleString()}</span>
                  <span style={{ color: '#4ade80' }}>Deuterium: {(cfg.cost.deuterium * agentCount).toLocaleString()}</span>
                </div>
              </div>

              {/* Detection risk */}
              <div className="flex items-center justify-between text-xs mb-4">
                <span className="text-gray-400">Adjusted Detection Risk</span>
                <span className="font-bold" style={{ color: adjustedDetection > 50 ? '#f87171' : adjustedDetection > 25 ? '#fbbf24' : '#4ade80' }}>
                  {adjustedDetection}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full mb-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-2 rounded-full transition-all" style={{
                  width: `${adjustedDetection}%`,
                  background: adjustedDetection > 50 ? '#f87171' : adjustedDetection > 25 ? '#fbbf24' : '#4ade80'
                }}></div>
              </div>

              <button
                onClick={handleScan}
                disabled={!scanTarget || scanning}
                className="w-full py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer disabled:opacity-40 whitespace-nowrap"
                style={{ background: `${cfg.color}20`, border: `1px solid ${cfg.color}35`, color: cfg.color }}
              >
                {scanning
                  ? <><i className="ri-loader-4-line mr-1 animate-spin"></i>Scanning...</>
                  : <><i className={`${cfg.icon} mr-1`}></i>Launch {cfg.label}</>
                }
              </button>
            </div>

            {/* Scan result */}
            {scanResult && (
              <div className="rounded-xl p-4" style={{
                background: scanResult.success ? 'rgba(74,222,128,0.06)' : 'rgba(248,113,113,0.06)',
                border: `1px solid ${scanResult.success ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)'}`
              }}>
                <div className="flex items-start gap-3">
                  <i className={`${scanResult.success ? 'ri-check-line text-green-400' : 'ri-close-line text-red-400'} text-base mt-0.5`}></i>
                  <div>
                    <p className="text-sm font-semibold text-white">{scanResult.success ? 'Scan Successful' : 'Scan Failed'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{scanResult.message}</p>
                    {scanResult.detected && (
                      <p className="text-xs text-red-400 mt-1"><i className="ri-alert-line mr-1"></i>Target was alerted to the probe attempt!</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Recent reports quick list */}
            <div className="rounded-xl p-4" style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Recent Reports</h3>
              <div className="space-y-2">
                {reports.slice(0, 3).map(r => {
                  const c = SCAN_TYPES.find(s => s.type === r.type)!;
                  return (
                    <button key={r.id} onClick={() => setViewReport(r)} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/5 transition-all">
                      <i className={`${c.icon} text-xs flex-shrink-0`} style={{ color: c.color }}></i>
                      <span className="text-xs text-white flex-1 truncate">{r.target} {r.targetCoords}</span>
                      <span className="text-xs text-gray-500 flex-shrink-0">{r.timestamp}</span>
                      <i className="ri-arrow-right-s-line text-gray-600 text-xs"></i>
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setActiveTab('reports')} className="w-full mt-2 py-1.5 text-xs rounded-lg text-indigo-400 cursor-pointer hover:bg-indigo-400/10 transition-all">
                View all {reports.length} reports →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports tab */}
      {activeTab === 'reports' && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {['all', 'fleet', 'resources', 'defense', 'technology', 'full'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className="px-3 py-1 text-xs font-semibold rounded capitalize cursor-pointer transition-all whitespace-nowrap"
                  style={filterType === f
                    ? { background: 'rgba(129,140,248,0.2)', color: '#818cf8' }
                    : { color: '#6b7280' }
                  }
                >{f === 'all' ? `All (${reports.length})` : f}</button>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-auto">{filteredReports.length} reports</span>
          </div>
          <div className="space-y-2">
            {filteredReports.map(r => <ReportCard key={r.id} report={r} onView={setViewReport} />)}
            {filteredReports.length === 0 && (
              <div className="rounded-xl p-10 text-center" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <i className="ri-file-list-3-line text-3xl text-gray-600 block mb-2"></i>
                <p className="text-gray-400 text-sm">No reports for this type</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Network tab */}
      {activeTab === 'network' && (
        <div className="grid grid-cols-2 gap-5">
          {/* Agent skill tree */}
          <div className="rounded-xl p-5" style={{ background: '#0d1526', border: '1px solid rgba(129,140,248,0.2)' }}>
            <h3 className="text-sm font-bold text-indigo-400 mb-4">Espionage Technology</h3>
            <div className="space-y-3">
              {[
                { name: 'Espionage Tech', level: 8, maxLevel: 15, bonus: 'Base reliability +5% per level', color: '#818cf8' },
                { name: 'Counter Intelligence', level: 5, maxLevel: 10, bonus: 'Reduce incoming scan success by 8%', color: '#f87171' },
                { name: 'Data Analysis', level: 3, maxLevel: 8, bonus: 'Reports show 20% more data fields', color: '#4ade80' },
                { name: 'Probe Network', level: 6, maxLevel: 12, bonus: '+1 simultaneous scan slot per level', color: '#fbbf24' },
                { name: 'Stealth Probes', level: 2, maxLevel: 10, bonus: '-10% detection chance per level', color: '#34d399' },
              ].map(tech => (
                <div key={tech.name} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${tech.color}18` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white">{tech.name}</span>
                    <span className="text-xs font-bold" style={{ color: tech.color }}>Lv.{tech.level}/{tech.maxLevel}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full mb-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${(tech.level / tech.maxLevel) * 100}%`, background: tech.color }}></div>
                  </div>
                  <p className="text-xs text-gray-500">{tech.bonus}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detected by / counter-intel */}
          <div className="space-y-4">
            <div className="rounded-xl p-5" style={{ background: '#0d1526', border: '1px solid rgba(248,113,113,0.2)' }}>
              <h3 className="text-sm font-bold text-red-400 mb-4">Incoming Probe Attempts</h3>
              <div className="space-y-2">
                {[
                  { from: 'Unknown [3:451:9]', type: 'Fleet Scan', time: '12 min ago', blocked: true },
                  { from: 'Admiral Ryx [5:210:3]', type: 'Full Probe', time: '2h ago', blocked: false },
                  { from: 'General Kaos [2:87:15]', type: 'Resources', time: '4h ago', blocked: true },
                ].map((attempt, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: attempt.blocked ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)' }}>
                      <i className={`${attempt.blocked ? 'ri-shield-check-line text-green-400' : 'ri-eye-line text-red-400'} text-xs`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{attempt.from}</p>
                      <p className="text-xs text-gray-500">{attempt.type} · {attempt.time}</p>
                    </div>
                    <span className="text-xs font-bold flex-shrink-0" style={{ color: attempt.blocked ? '#4ade80' : '#f87171' }}>
                      {attempt.blocked ? 'Blocked' : 'Success'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-5" style={{ background: '#0d1526', border: '1px solid rgba(251,191,36,0.2)' }}>
              <h3 className="text-sm font-bold text-amber-400 mb-4">Intel Capacity</h3>
              <div className="space-y-3 text-xs">
                {[
                  { label: 'Max Probes per Wave', val: `${agentCount} of 15`, pct: (agentCount / 15) * 100 },
                  { label: 'Report Archive Slots', val: '42 / 100', pct: 42 },
                  { label: 'Scan Range', val: '±8 Systems', pct: 55 },
                ].map(c => (
                  <div key={c.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">{c.label}</span>
                      <span className="text-amber-400 font-semibold">{c.val}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${c.pct}%`, background: '#fbbf24' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}