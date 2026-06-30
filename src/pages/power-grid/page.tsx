import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { usePowerGrid } from '@/hooks/usePowerGrid';
import { usePowerConsumption } from '@/hooks/usePowerConsumption';
import { useGridOverload } from '@/hooks/useGridOverload';
import GridBootSequence from './components/GridBootSequence';
import type {
  ReactorDefinition,
  PowerReactor,
  GridCell,
  ReactorClass,
  SubClass,
  ConnectionType,
} from '@/data/powerReactors';
import {
  REACTOR_CLASS_COLORS,
  SUB_CLASS_COLORS,
  SUB_CLASS_MULTIPLIERS,
  calculateReactorOutput,
  getReactorIcon,
  getDurabilityStatus,
  calculateEffectiveEfficiency,
} from '@/data/powerReactors';

type ViewMode = 'grid' | 'catalog' | 'stats' | 'maintenance';
type PlacementMode = 'none' | 'reactor' | 'connection';
type SubClassFilter = SubClass | 'all';
type ClassFilter = ReactorClass | 'all';

const GRID_CELL_SIZE = 68;

function formatPower(value: number): string {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)} GW`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)} MW`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)} KW`;
  return `${value} W`;
}

/* ── System Status Overview ─────────────────────────────────────────────── */
function SystemStatusOverview({
  grid, gridRisk, demandSnapshot, reactors, connections,
}: {
  grid: any; gridRisk: any; demandSnapshot: any; reactors: any[]; connections: any[];
}) {
  const isCrisis = gridRisk.status === 'critical' || gridRisk.status === 'unstable';
  const statusColor = gridRisk.status === 'critical' ? '#ef4444'
    : gridRisk.status === 'unstable' ? '#fb923c'
    : grid.status === 'active' ? '#34d399'
    : grid.status === 'overloaded' ? '#fb923c'
    : '#ef4444';

  const cards = [
    {
      label: 'GRID STATUS',
      value: grid.status?.toUpperCase() || 'OFFLINE',
      color: statusColor,
      icon: grid.status === 'active' ? 'ri-shield-check-line' : 'ri-alert-line',
      detail: `Efficiency ${grid.grid_efficiency_pct}%`,
    },
    {
      label: 'TOTAL OUTPUT',
      value: formatPower(grid.total_power_generated),
      color: '#e2c044',
      icon: 'ri-flashlight-line',
      detail: `${reactors.length} reactors online`,
    },
    {
      label: 'GRID DEMAND',
      value: formatPower(demandSnapshot.totalDemand),
      color: demandSnapshot.demandPct > 95 ? '#ef4444' : demandSnapshot.demandPct > 75 ? '#fb923c' : '#5bc0be',
      icon: 'ri-battery-charge-line',
      detail: `${demandSnapshot.demandPct}% capacity`,
    },
    {
      label: 'ENERGY YIELD',
      value: `${Math.floor(grid.total_power_generated / 1000).toLocaleString()} EU`,
      color: '#60a5fa',
      icon: 'ri-battery-2-charge-line',
      detail: 'Harvested to resources',
    },
    {
      label: 'STABILITY RISK',
      value: `${gridRisk.overallRisk}%`,
      color: gridRisk.overallRisk >= 75 ? '#ef4444' : gridRisk.overallRisk >= 40 ? '#fb923c' : '#34d399',
      icon: 'ri-heart-pulse-line',
      detail: `Cascade: ${gridRisk.cascadeProbability}%`,
    },
  ];

  return (
    <div className="rounded-xl overflow-hidden mb-4 relative"
      style={{
        border: `1px solid ${isCrisis ? 'rgba(239,68,68,0.4)' : '#1e2a36'}`,
        background: isCrisis ? 'linear-gradient(180deg, rgba(239,68,68,0.06) 0%, #080b0f 100%)' : 'linear-gradient(180deg, #080b0f 0%, #0a0e13 100%)',
      }}
    >
      {isCrisis && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(239,68,68,0.08) 3px, rgba(239,68,68,0.08) 6px)',
        }} />
      )}
      <div className="relative z-10 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e2c044, #d4a853)' }}>
            <i className="ri-flashlight-fill text-white text-base" />
          </div>
          <div>
            <h1 className="text-sm font-bold" style={{ color: '#d4a853', fontFamily: 'Orbitron, sans-serif' }}>POWER GRID</h1>
            <span className="text-xs" style={{ color: '#5a6577' }}>{grid.grid_name} · System {grid.id || '001'}</span>
          </div>
          {isCrisis && (
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg animate-pulse"
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)' }}
            >
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs font-black" style={{ color: '#ef4444', fontFamily: 'Orbitron, sans-serif' }}>CRITICAL ALERT</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {cards.map((card) => (
            <div key={card.label} className="relative rounded-lg p-3 overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.015)', border: `1px solid ${card.color}15` }}
            >
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10" style={{ background: card.color }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: `${card.color}12` }}>
                    <i className={`${card.icon} text-xs`} style={{ color: card.color }} />
                  </div>
                  <span className="font-bold tracking-wider" style={{ color: '#5a6577', fontSize: 9 }}>{card.label}</span>
                </div>
                <div className="text-base font-black text-white mb-0.5" style={{ fontFamily: 'Orbitron, sans-serif' }}>{card.value}</div>
                <div className="text-xs" style={{ color: '#4a5568' }}>{card.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Reactor Grid Node ──────────────────────────────────────────────────── */
function GridReactorNode({
  cell, def, isSelected, isConnStart, isHighlighted, isCrisis,
}: {
  cell: GridCell; def?: ReactorDefinition; isSelected: boolean;
  isConnStart: boolean; isHighlighted: boolean; isCrisis: boolean;
}) {
  if (!cell.hasReactor || !cell.reactor || !def) {
    return (
      <div className="flex flex-col items-center justify-center opacity-15 h-full">
        <span style={{ color: '#3a4557', fontSize: 8 }}>{cell.x},{cell.y}</span>
      </div>
    );
  }

  const color = REACTOR_CLASS_COLORS[def.reactor_class];
  const isOnline = cell.reactor.status === 'online';
  const durability = cell.reactor.durability_pct ?? 100;
  const durabilityStatus = getDurabilityStatus(durability);
  const thermalLevel = Math.min(100, (cell.powerLoad / (Math.max(cell.reactor.current_output, 1))) * 100);
  const isOverheated = thermalLevel > 85;
  const needsMaintenance = durability < 50 && isOnline;

  return (
    <div className="flex flex-col items-center justify-center gap-1 h-full relative">
      {/* Thermal / durability glow */}
      {isOnline && (
        <div className="absolute inset-2 rounded-md pointer-events-none"
          style={{
            boxShadow: needsMaintenance
              ? `0 0 8px rgba(251,146,60,0.5), inset 0 0 6px rgba(251,146,60,0.15)`
              : isOverheated
                ? `0 0 8px rgba(239,68,68,0.4), inset 0 0 6px rgba(239,68,68,0.15)`
                : `0 0 6px ${color}30, inset 0 0 4px ${color}10`,
            opacity: 0.6 + (thermalLevel / 100) * 0.4,
          }}
        />
      )}

      {/* Maintenance warning badge */}
      {needsMaintenance && (
        <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full flex items-center justify-center z-20 animate-pulse"
          style={{ background: '#fb923c' }}
        >
          <i className="ri-tools-fill" style={{ fontSize: 5, color: '#000' }} />
        </div>
      )}

      {/* Reactor icon */}
      <div className="w-7 h-7 rounded-md flex items-center justify-center"
        style={{
          background: isOnline ? `${color}18` : 'rgba(82,82,91,0.2)',
          border: `1px solid ${isOnline ? color + '50' : 'rgba(82,82,91,0.3)'}`,
        }}
      >
        <i className={`${getReactorIcon(def.reactor_type)} text-sm`} style={{ color: isOnline ? color : '#52525b' }} />
      </div>

      <span className="font-bold whitespace-nowrap truncate max-w-full px-1"
        style={{ color: isOnline ? color : '#52525b', fontSize: 8 }}
      >
        {def.reactor_name}
      </span>
      <span style={{ color: '#4a5568', fontSize: 7 }}>Lv.{cell.reactor.reactor_level}</span>

      {/* Durability bar */}
      {isOnline && (
        <div className="w-10 h-[3px] rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${durability}%`,
              background: durability < 30 ? '#ef4444' : durability < 60 ? '#fb923c' : `${color}`,
            }}
          />
        </div>
      )}

      {!isOnline && (
        <span className="px-1 rounded" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontSize: 6 }}>
          {cell.reactor.status}
        </span>
      )}

      {isConnStart && (
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center z-20"
          style={{ background: '#e2c044', border: '1px solid #e2c04480' }}
        >
          <i className="ri-link text-white" style={{ fontSize: 8 }} />
        </div>
      )}

      {isSelected && (
        <div className="absolute inset-0 rounded-md pointer-events-none"
          style={{ border: '2px solid #e2c044', boxShadow: '0 0 8px rgba(226,192,68,0.3)' }}
        />
      )}
    </div>
  );
}

/* ── Animated Power Flow Lines ─────────────────────────────────────────── */
function PowerFlowLines({ lines }: { lines: any[] }) {
  return (
    <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {lines.map((line) => (
        <g key={line.id}>
          <line
            x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
            stroke={line.color}
            strokeWidth={line.width}
            strokeDasharray={line.dashed ? '5,5' : 'none'}
            opacity={line.status === 'active' ? 0.6 : 0.15}
          />
          {line.status === 'active' && line.powerFlow > 0 && (
            <>
              <circle r={3} fill={line.color} opacity={0.9}>
                <animateMotion dur={`${2 + Math.random()}s`} repeatCount="indefinite"
                  path={`M${line.x1},${line.y1} L${line.x2},${line.y2}`} />
              </circle>
              <circle r={2} fill={line.color} opacity={0.5}>
                <animateMotion dur={`${2.5 + Math.random()}s`} begin="0.5s" repeatCount="indefinite"
                  path={`M${line.x1},${line.y1} L${line.x2},${line.y2}`} />
              </circle>
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

/* ── Maintenance Panel ──────────────────────────────────────────────────── */
function MaintenancePanel({
  reactors, definitions, onMaintain, onRepair, onHarvest, onClose, showToast,
}: {
  reactors: PowerReactor[];
  definitions: ReactorDefinition[];
  onMaintain: (id: number) => Promise<boolean>;
  onRepair: (id: number) => Promise<boolean>;
  onHarvest: () => Promise<number>;
  onClose: () => void;
  showToast: (msg: string) => void;
}) {
  const [harvesting, setHarvesting] = useState(false);

  const needsMaintenance = reactors.filter(r => (r.durability_pct ?? 100) < 70);
  const damaged = reactors.filter(r => r.status === 'damaged' || r.status === 'meltdown');
  const healthy = reactors.filter(r => (r.durability_pct ?? 100) >= 70 && r.status === 'online');

  const handleHarvest = async () => {
    setHarvesting(true);
    const amount = await onHarvest();
    setHarvesting(false);
    if (amount > 0) showToast(`Harvested ${amount.toLocaleString()} EU into energy reserves`);
    else showToast('No surplus energy to harvest right now');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div className="rounded-xl overflow-hidden" style={{ width: 600, maxHeight: '82vh', background: '#0d131a', border: '1px solid #1e2a36' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1e2a36' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.3)' }}>
              <i className="ri-tools-line text-sm" style={{ color: '#fb923c' }} />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: '#fb923c', fontFamily: 'Orbitron, sans-serif' }}>MAINTENANCE CENTER</h3>
              <span className="text-xs" style={{ color: '#5a6577' }}>{needsMaintenance.length + damaged.length} reactors require attention</span>
            </div>
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded cursor-pointer hover:bg-white/5" style={{ color: '#5a6577' }}>
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(82vh - 130px)' }}>
          {/* Energy Harvest */}
          <div className="mb-4 p-3 rounded-lg" style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.2)' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-xs font-bold" style={{ color: '#60a5fa' }}>ENERGY HARVEST</div>
                <div className="text-xs" style={{ color: '#5a6577' }}>Convert surplus grid power into player energy resources</div>
              </div>
              <button
                onClick={handleHarvest}
                disabled={harvesting}
                className="px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition-all hover:opacity-80 whitespace-nowrap"
                style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.3)' }}
              >
                <i className={`${harvesting ? 'ri-loader-4-line animate-spin' : 'ri-battery-2-charge-line'} mr-1`} />
                {harvesting ? 'Harvesting...' : 'Harvest Now'}
              </button>
            </div>
            <div className="text-xs" style={{ color: '#4a5568' }}>
              Grid surplus → Energy resource pool · 1,000 MW = 1 EU/tick
            </div>
          </div>

          {/* Damaged reactors */}
          {damaged.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold" style={{ color: '#ef4444' }}>DAMAGED / MELTDOWN ({damaged.length})</span>
              </div>
              <div className="space-y-2">
                {damaged.map(r => {
                  const def = definitions.find(d => d.id === r.definition_id);
                  const repairCostMult = r.status === 'meltdown' ? 5 : 3;
                  return (
                    <div key={r.id} className="flex items-center gap-3 p-2.5 rounded"
                      style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }}
                    >
                      <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}
                      >
                        <i className={`${getReactorIcon(def?.reactor_type || '')} text-sm`} style={{ color: '#ef4444' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold" style={{ color: '#f87171' }}>{def?.reactor_name || 'Unknown'}</div>
                        <div className="text-xs capitalize px-1.5 py-0.5 rounded inline-block mt-0.5"
                          style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontSize: 9 }}
                        >{r.status}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs mb-1" style={{ color: '#5a6577' }}>
                          {(def?.maintenance_cost_metal || 100) * repairCostMult} metal
                        </div>
                        <button
                          onClick={() => onRepair(r.id).then(ok => ok ? showToast('Repair initiated') : showToast('Insufficient resources'))}
                          className="px-2 py-1 rounded text-xs font-bold cursor-pointer transition-all hover:opacity-80 whitespace-nowrap"
                          style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
                        >
                          <i className="ri-tools-line mr-1" />Repair
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Needs maintenance */}
          {needsMaintenance.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ background: '#fb923c' }} />
                <span className="text-xs font-bold" style={{ color: '#fb923c' }}>MAINTENANCE REQUIRED ({needsMaintenance.length})</span>
              </div>
              <div className="space-y-2">
                {needsMaintenance.map(r => {
                  const def = definitions.find(d => d.id === r.definition_id);
                  const durabilityStatus = getDurabilityStatus(r.durability_pct ?? 100);
                  const eff = calculateEffectiveEfficiency(r.efficiency_pct, r.durability_pct ?? 100);
                  return (
                    <div key={r.id} className="flex items-center gap-3 p-2.5 rounded"
                      style={{ background: 'rgba(251,146,60,0.04)', border: '1px solid rgba(251,146,60,0.2)' }}
                    >
                      <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.25)' }}
                      >
                        <i className={`${getReactorIcon(def?.reactor_type || '')} text-sm`} style={{ color: '#fb923c' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate" style={{ color: '#8892aa' }}>{def?.reactor_name || 'Unknown'}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs" style={{ color: durabilityStatus.color, fontSize: 9 }}>{durabilityStatus.label}</span>
                          <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-full rounded-full"
                              style={{ width: `${r.durability_pct ?? 100}%`, background: durabilityStatus.color }}
                            />
                          </div>
                          <span className="text-xs font-bold" style={{ color: durabilityStatus.color, fontSize: 9 }}>{r.durability_pct ?? 100}%</span>
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: '#4a5568', fontSize: 9 }}>
                          Eff. penalty: {Math.floor(100 - eff)}% · Output reduced
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs mb-1" style={{ color: '#5a6577' }}>
                          {def?.maintenance_cost_metal || 100}M / {def?.maintenance_cost_crystal || 50}C
                        </div>
                        <button
                          onClick={() => onMaintain(r.id).then(ok => ok ? showToast('Maintenance started') : showToast('Insufficient resources'))}
                          disabled={r.status === 'maintenance'}
                          className="px-2 py-1 rounded text-xs font-bold cursor-pointer transition-all hover:opacity-80 whitespace-nowrap"
                          style={{
                            background: r.status === 'maintenance' ? 'rgba(255,255,255,0.04)' : 'rgba(251,146,60,0.12)',
                            color: r.status === 'maintenance' ? '#5a6577' : '#fb923c',
                            border: `1px solid ${r.status === 'maintenance' ? '#1e2a36' : 'rgba(251,146,60,0.3)'}`,
                          }}
                        >
                          <i className={`${r.status === 'maintenance' ? 'ri-loader-4-line animate-spin' : 'ri-settings-3-line'} mr-1`} />
                          {r.status === 'maintenance' ? 'Ongoing...' : 'Maintain'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Healthy reactors summary */}
          {healthy.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold" style={{ color: '#34d399' }}>OPERATIONAL ({healthy.length})</span>
              </div>
              <div className="space-y-1">
                {healthy.map(r => {
                  const def = definitions.find(d => d.id === r.definition_id);
                  const dur = r.durability_pct ?? 100;
                  return (
                    <div key={r.id} className="flex items-center gap-2 p-2 rounded"
                      style={{ background: 'rgba(0,0,0,0.1)', border: '1px solid rgba(52,211,153,0.08)' }}
                    >
                      <i className={`${getReactorIcon(def?.reactor_type || '')} text-xs`} style={{ color: '#34d399' }} />
                      <span className="text-xs flex-1 truncate" style={{ color: '#8892aa' }}>{def?.reactor_name}</span>
                      <div className="w-16 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full" style={{ width: `${dur}%`, background: '#34d399' }} />
                      </div>
                      <span className="text-xs font-bold" style={{ color: '#34d399', fontSize: 9 }}>{dur}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {reactors.length === 0 && (
            <div className="text-center py-12">
              <i className="ri-tools-line text-2xl block mb-2" style={{ color: '#4a5568' }} />
              <span className="text-xs" style={{ color: '#5a6577' }}>No reactors deployed yet</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────────── */
export default function PowerGridPage() {
  const {
    grid,
    reactors,
    definitions,
    connections,
    gridCells,
    selectedReactor,
    selectedDefinition,
    isLoading,
    error,
    selectReactor,
    selectDefinition,
    placeReactor,
    removeReactor,
    upgradeReactor,
    toggleReactorStatus,
    maintainReactor,
    repairReactor,
    harvestEnergy,
    addConnection,
    removeConnection,
    refreshGrid,
  } = usePowerGrid({ planetId: 'homeworld' });

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [placementMode, setPlacementMode] = useState<PlacementMode>('none');
  const [placementDefId, setPlacementDefId] = useState<number | null>(null);
  const [connStart, setConnStart] = useState<{ x: number; y: number } | null>(null);
  const [connType, setConnType] = useState<ConnectionType>('standard');
  const [classFilter, setClassFilter] = useState<ClassFilter>('all');
  const [subClassFilter, setSubClassFilter] = useState<SubClassFilter>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showOverloadPanel, setShowOverloadPanel] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [minBootElapsed, setMinBootElapsed] = useState(false);

  const {
    connections: buildingConns,
    snapshot: demandSnapshot,
    disconnectBuilding,
    emergencyShedLoad,
  } = usePowerConsumption({ planetId: 'homeworld' });

  const {
    events: overloadEvents,
    risk: gridRisk,
    resolveEvent,
    scramReactor: scramReactorFn,
    triggerEmergencyStabilization,
  } = useGridOverload({ planetId: 'homeworld' });

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const isCrisis = gridRisk.status === 'critical' || gridRisk.status === 'unstable';

  const reactorNeedsAttention = useMemo(() =>
    reactors.filter(r => (r.durability_pct ?? 100) < 70 || r.status === 'damaged' || r.status === 'meltdown').length,
    [reactors]
  );

  const groupedDefs = useMemo(() => {
    const groups: Record<string, ReactorDefinition[]> = {};
    definitions
      .filter(d => classFilter === 'all' || d.reactor_class === classFilter)
      .filter(d => subClassFilter === 'all' || d.sub_class === subClassFilter)
      .forEach(d => {
        if (!groups[d.reactor_type]) groups[d.reactor_type] = [];
        groups[d.reactor_type].push(d);
      });
    return groups;
  }, [definitions, classFilter, subClassFilter]);

  const handleCellClick = useCallback((cell: GridCell) => {
    if (placementMode === 'reactor' && placementDefId && !cell.hasReactor) {
      placeReactor(placementDefId, cell.x, cell.y).then(success => {
        if (success) {
          showToast(`Reactor deployed at (${cell.x}, ${cell.y})`);
          setPlacementMode('none');
          setPlacementDefId(null);
        }
      });
    } else if (placementMode === 'connection') {
      if (!connStart) {
        setConnStart({ x: cell.x, y: cell.y });
      } else {
        addConnection(connStart.x, connStart.y, cell.x, cell.y, connType).then(success => {
          if (success) showToast(`Connection established`);
          setConnStart(null);
          setPlacementMode('none');
        });
      }
    } else if (cell.hasReactor && cell.reactor) {
      selectReactor(cell.reactor);
    } else {
      selectReactor(null);
    }
  }, [placementMode, placementDefId, connStart, connType, placeReactor, addConnection, selectReactor, showToast]);

  const startPlaceReactor = useCallback((defId: number) => {
    setPlacementMode('reactor');
    setPlacementDefId(defId);
    selectDefinition(definitions.find(d => d.id === defId) || null);
    showToast('Select a grid cell to deploy reactor');
  }, [definitions, selectDefinition, showToast]);

  const startConnectionMode = useCallback(() => {
    setPlacementMode('connection');
    setConnStart(null);
    showToast('Select source node, then target node');
  }, [showToast]);

  const clearPlacementMode = useCallback(() => {
    setPlacementMode('none');
    setPlacementDefId(null);
    setConnStart(null);
  }, []);

  const connectionLines = useMemo(() => {
    return connections.map(conn => {
      const fromX = conn.from_node_x * GRID_CELL_SIZE + GRID_CELL_SIZE / 2;
      const fromY = conn.from_node_y * GRID_CELL_SIZE + GRID_CELL_SIZE / 2;
      const toX = conn.to_node_x * GRID_CELL_SIZE + GRID_CELL_SIZE / 2;
      const toY = conn.to_node_y * GRID_CELL_SIZE + GRID_CELL_SIZE / 2;
      const isActive = conn.status === 'active';
      const typeColors: Record<string, string> = {
        standard: isActive ? '#34d399' : '#3a4557',
        high_voltage: isActive ? '#f59e0b' : '#3a4557',
        superconductor: isActive ? '#60a5fa' : '#3a4557',
        quantum_relay: isActive ? '#a78bfa' : '#3a4557',
      };
      return {
        id: conn.id, x1: fromX, y1: fromY, x2: toX, y2: toY,
        color: typeColors[conn.connection_type] || '#3a4557',
        width: conn.connection_type === 'quantum_relay' ? 3 : conn.connection_type === 'superconductor' ? 2.5 : 2,
        dashed: conn.status !== 'active',
        type: conn.connection_type, status: conn.status,
        powerFlow: conn.power_flow, maxCapacity: conn.max_capacity,
      };
    });
  }, [connections]);

  const isBooting = isLoading || !minBootElapsed;

  // Ensure boot sequence shows for at least 2.5s for cinematic effect
  const bootStartRef = useRef(Date.now());
  useEffect(() => {
    if (!isLoading) {
      const elapsed = Date.now() - bootStartRef.current;
      const remaining = Math.max(0, 2500 - elapsed);
      const timer = setTimeout(() => setMinBootElapsed(true), remaining);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isBooting) {
    return <GridBootSequence />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px]"
        style={{ background: 'linear-gradient(180deg, #070a10 0%, #090c14 100%)' }}
      >
        <div className="flex flex-col items-center gap-4 p-8 rounded-lg text-center"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}
        >
          <i className="ri-error-warning-line text-3xl" style={{ color: '#ef4444' }} />
          <span className="text-sm" style={{ color: '#f87171' }}>{error}</span>
          <button onClick={refreshGrid} className="px-4 py-2 rounded cursor-pointer text-xs font-bold" style={{ background: '#ef4444', color: '#fff' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!grid) return null;

  return (
    <div className="flex h-full"
      style={{
        minHeight: 'calc(100vh - 60px)',
        background: isCrisis
          ? 'linear-gradient(180deg, rgba(239,68,68,0.03) 0%, #070a10 30%, #090c14 100%)'
          : 'linear-gradient(180deg, #070a10 0%, #090c14 100%)',
      }}
    >
      {/* LEFT PANEL */}
      <div className="flex-1 flex flex-col p-4 overflow-auto">
        <SystemStatusOverview grid={grid} gridRisk={gridRisk} demandSnapshot={demandSnapshot} reactors={reactors} connections={connections} />

        {/* View Tabs + Action Buttons */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5 rounded-lg overflow-hidden flex-1" style={{ border: '1px solid #1e2a36' }}>
            {(['grid', 'catalog'] as ViewMode[]).map(mode => (
              <button key={mode} onClick={() => { setViewMode(mode); clearPlacementMode(); }}
                className="px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all capitalize whitespace-nowrap flex-1"
                style={{
                  background: viewMode === mode ? '#e2c04415' : 'transparent',
                  color: viewMode === mode ? '#e2c044' : '#5a6577',
                  borderRight: mode === 'grid' ? '1px solid #1e2a36' : 'none',
                }}
              >
                {mode === 'grid' && <><i className="ri-layout-grid-line mr-1" />Grid</>}
                {mode === 'catalog' && <><i className="ri-archive-line mr-1" />Catalog</>}
              </button>
            ))}
          </div>

          {/* Maintenance button */}
          <button
            onClick={() => setShowMaintenance(true)}
            className="relative px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition-all whitespace-nowrap"
            style={{
              background: reactorNeedsAttention > 0 ? 'rgba(251,146,60,0.12)' : 'rgba(255,255,255,0.04)',
              color: reactorNeedsAttention > 0 ? '#fb923c' : '#5a6577',
              border: `1px solid ${reactorNeedsAttention > 0 ? 'rgba(251,146,60,0.3)' : '#1e2a36'}`,
            }}
          >
            <i className="ri-tools-line mr-1" />
            Maintenance
            {reactorNeedsAttention > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white animate-pulse"
                style={{ background: '#fb923c', fontSize: 8 }}
              >
                {reactorNeedsAttention}
              </span>
            )}
          </button>

          {/* Overload button */}
          <button
            onClick={() => setShowOverloadPanel(true)}
            className="relative px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition-all whitespace-nowrap"
            style={{
              background: isCrisis ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.04)',
              color: isCrisis ? '#ef4444' : '#5a6577',
              border: `1px solid ${isCrisis ? 'rgba(239,68,68,0.3)' : '#1e2a36'}`,
            }}
          >
            <i className="ri-alert-line mr-1" />Grid Risk
            {isCrisis && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse" style={{ background: '#ef4444' }} />
            )}
          </button>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="flex-1 flex items-start justify-center">
            <div className="relative" style={{ width: grid.grid_size_x * GRID_CELL_SIZE, height: grid.grid_size_y * GRID_CELL_SIZE }}>
              <div className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
                style={{ background: 'radial-gradient(ellipse at center, rgba(212,168,83,0.02) 0%, transparent 70%)' }}
              />
              <PowerFlowLines lines={connectionLines} />
              <div className="grid relative"
                style={{
                  gridTemplateColumns: `repeat(${grid.grid_size_x}, ${GRID_CELL_SIZE}px)`,
                  gridTemplateRows: `repeat(${grid.grid_size_y}, ${GRID_CELL_SIZE}px)`,
                  gap: 1,
                  background: isCrisis ? 'rgba(239,68,68,0.03)' : '#0d131a',
                  border: `1px solid ${isCrisis ? 'rgba(239,68,68,0.3)' : '#1e2a36'}`,
                  borderRadius: 6, zIndex: 2,
                }}
              >
                {gridCells.flat().map(cell => {
                  const isConnStart = connStart && connStart.x === cell.x && connStart.y === cell.y;
                  const isHighlighted = placementMode === 'reactor' && !cell.hasReactor;
                  const def = cell.reactor?.definition;
                  return (
                    <button key={`${cell.x}-${cell.y}`} onClick={() => handleCellClick(cell)}
                      className="relative flex items-center justify-center cursor-pointer transition-all p-1"
                      style={{
                        background: cell.hasReactor ? `${def ? REACTOR_CLASS_COLORS[def.reactor_class] : '#52525b'}10` : cell.isConnected ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.15)',
                        border: cell.hasReactor
                          ? `2px solid ${def ? REACTOR_CLASS_COLORS[def.reactor_class] : '#52525b'}50`
                          : isConnStart ? '2px solid #e2c044' : isHighlighted ? '1px dashed rgba(226,192,68,0.3)' : '1px solid rgba(255,255,255,0.03)',
                        borderRadius: 4,
                      }}
                    >
                      <GridReactorNode
                        cell={cell} def={def}
                        isSelected={!!selectedReactor && cell.reactor?.id === selectedReactor.id}
                        isConnStart={!!isConnStart} isHighlighted={isHighlighted} isCrisis={isCrisis}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Catalog View */}
        {viewMode === 'catalog' && (
          <div className="flex-1 overflow-y-auto space-y-3">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {(['all', 'Civilian', 'Industrial', 'Military', 'Research', 'Exotic'] as ClassFilter[]).map(cls => (
                <button key={cls} onClick={() => setClassFilter(cls)}
                  className="px-2 py-1 rounded text-xs font-semibold cursor-pointer transition-all"
                  style={{
                    background: classFilter === cls ? `${cls === 'all' ? '#e2c044' : REACTOR_CLASS_COLORS[cls as ReactorClass]}20` : 'rgba(0,0,0,0.2)',
                    color: cls === 'all' ? (classFilter === 'all' ? '#e2c044' : '#5a6577') : REACTOR_CLASS_COLORS[cls as ReactorClass],
                    border: `1px solid ${classFilter === cls ? (cls === 'all' ? '#e2c044' : REACTOR_CLASS_COLORS[cls as ReactorClass]) + '40' : '#1e2a36'}`,
                  }}
                >{cls}</button>
              ))}
            </div>
            {Object.entries(groupedDefs).map(([typeName, typeDefs]) => (
              <div key={typeName} className="rounded-lg overflow-hidden" style={{ border: '1px solid #1e2a36' }}>
                <div className="flex items-center gap-2 px-3 py-2" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <i className={`${getReactorIcon(typeName)} text-sm`} style={{ color: REACTOR_CLASS_COLORS[typeDefs[0].reactor_class] }} />
                  <span className="text-xs font-bold" style={{ color: '#8892aa' }}>{typeName}</span>
                  <span className="ml-auto text-xs" style={{ color: '#5a6577' }}>{typeDefs.length} variants</span>
                </div>
                <div className="divide-y" style={{ borderColor: '#1e2a36' }}>
                  {typeDefs.map(def => {
                    const placed = reactors.filter(r => r.definition_id === def.id).length;
                    return (
                      <button key={def.id} onClick={() => { selectDefinition(def); startPlaceReactor(def.id); }}
                        className="w-full flex items-center gap-3 p-3 cursor-pointer transition-all text-left hover:bg-white/[0.015]"
                        style={{ background: placementDefId === def.id ? `${REACTOR_CLASS_COLORS[def.reactor_class]}10` : 'transparent' }}
                      >
                        <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                          style={{ background: `${REACTOR_CLASS_COLORS[def.reactor_class]}15`, border: `1px solid ${REACTOR_CLASS_COLORS[def.reactor_class]}30` }}
                        >
                          <span className="text-xs font-bold" style={{ color: REACTOR_CLASS_COLORS[def.reactor_class] }}>T{def.tier}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold" style={{ color: '#8892aa' }}>{def.reactor_name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs" style={{ color: SUB_CLASS_COLORS[def.sub_class], fontSize: 9 }}>{def.sub_class}</span>
                            <span className="text-xs" style={{ color: '#5a6577', fontSize: 9 }}>{formatPower(def.base_power_output)} base</span>
                            <span className="text-xs" style={{ color: '#4a5568', fontSize: 9 }}>Wear: {def.wear_rate_per_hour ?? 0.5}%/hr</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold" style={{ color: REACTOR_CLASS_COLORS[def.reactor_class] }}>×{SUB_CLASS_MULTIPLIERS[def.sub_class].toFixed(1)}</span>
                          {placed > 0 && <span className="text-xs" style={{ color: '#34d399', fontSize: 9 }}>{placed} placed</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {Object.keys(groupedDefs).length === 0 && (
              <div className="text-center py-12">
                <span className="text-xs" style={{ color: '#5a6577' }}>No reactors match filters</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="w-80 flex-shrink-0 flex flex-col overflow-y-auto"
        style={{ borderLeft: `1px solid ${isCrisis ? 'rgba(239,68,68,0.3)' : '#1e2a36'}`, background: '#090c14' }}
      >
        {/* Reactor Details */}
        {selectedReactor && selectedReactor.definition && (
          <div className="p-3" style={{ borderBottom: '1px solid #1e2a36' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#d4a853', fontFamily: 'Orbitron, sans-serif' }}>
                REACTOR DIAGNOSTICS
              </h3>
              <button onClick={() => selectReactor(null)}
                className="w-5 h-5 flex items-center justify-center rounded cursor-pointer hover:bg-white/5"
                style={{ color: '#5a6577' }}
              >
                <i className="ri-close-line text-xs" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${REACTOR_CLASS_COLORS[selectedReactor.definition.reactor_class]}15`,
                  border: `1px solid ${REACTOR_CLASS_COLORS[selectedReactor.definition.reactor_class]}30`,
                }}
              >
                <i className={`${getReactorIcon(selectedReactor.definition.reactor_type)} text-base`}
                  style={{ color: REACTOR_CLASS_COLORS[selectedReactor.definition.reactor_class] }}
                />
              </div>
              <div>
                <div className="text-xs font-bold" style={{ color: '#8892aa' }}>{selectedReactor.definition.reactor_name}</div>
                <div className="text-xs" style={{ color: '#5a6577' }}>
                  {selectedReactor.definition.reactor_class} · {selectedReactor.definition.sub_class}
                </div>
              </div>
            </div>

            {/* Output gauge */}
            <div className="mb-2 p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #1e2a36' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold" style={{ color: '#5a6577' }}>Output</span>
                <span className="text-xs font-bold" style={{ color: '#e2c044' }}>
                  {formatPower(calculateReactorOutput(selectedReactor.definition, selectedReactor.reactor_level, selectedReactor.efficiency_pct, selectedReactor.durability_pct))}
                </span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-2 rounded-full"
                  style={{
                    width: `${selectedReactor.efficiency_pct}%`,
                    background: selectedReactor.efficiency_pct > 90 ? 'linear-gradient(90deg, #fb923c, #ef4444)' : 'linear-gradient(90deg, #34d399, #e2c044)',
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs" style={{ color: '#4a5568', fontSize: 8 }}>Efficiency</span>
                <span className="text-xs font-bold" style={{ color: '#e2c044', fontSize: 8 }}>{selectedReactor.efficiency_pct}%</span>
              </div>
            </div>

            {/* Durability gauge */}
            {(() => {
              const dur = selectedReactor.durability_pct ?? 100;
              const ds = getDurabilityStatus(dur);
              const eff = calculateEffectiveEfficiency(selectedReactor.efficiency_pct, dur);
              return (
                <div className="mb-3 p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${ds.color}20` }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold" style={{ color: '#5a6577' }}>Durability</span>
                    <span className="text-xs font-bold" style={{ color: ds.color }}>{ds.label}</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${dur}%`, background: ds.color }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs" style={{ color: '#4a5568', fontSize: 8 }}>
                      Wear: {selectedReactor.definition.wear_rate_per_hour ?? 0.5}%/hr
                    </span>
                    <span className="text-xs font-bold" style={{ color: ds.color, fontSize: 8 }}>{dur}%</span>
                  </div>
                  {dur < 80 && (
                    <div className="mt-1 text-xs" style={{ color: '#fb923c', fontSize: 8 }}>
                      Eff. penalty: {Math.floor(100 - eff)}% output lost to wear
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2 rounded" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <div className="text-xs" style={{ color: '#5a6577' }}>Level</div>
                <div className="text-xs font-bold" style={{ color: '#e2c044' }}>{selectedReactor.reactor_level} / {selectedReactor.definition.max_level}</div>
              </div>
              <div className="p-2 rounded" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <div className="text-xs" style={{ color: '#5a6577' }}>Tier</div>
                <div className="text-xs font-bold" style={{ color: '#a78bfa' }}>{selectedReactor.definition.tier}</div>
              </div>
              <div className="p-2 rounded" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <div className="text-xs" style={{ color: '#5a6577' }}>Uptime hrs</div>
                <div className="text-xs font-bold" style={{ color: '#5bc0be' }}>{Math.floor(selectedReactor.total_uptime_hours ?? 0)}</div>
              </div>
              <div className="p-2 rounded" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <div className="text-xs" style={{ color: '#5a6577' }}>Status</div>
                <div className="text-xs font-bold capitalize"
                  style={{ color: selectedReactor.status === 'online' ? '#34d399' : '#ef4444' }}
                >
                  {selectedReactor.status}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button onClick={() => upgradeReactor(selectedReactor.id)}
                className="px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-all hover:opacity-80 whitespace-nowrap"
                style={{ background: '#e2c044', color: '#000' }}
              >
                <i className="ri-arrow-up-line mr-1" />Upgrade
              </button>
              <button
                onClick={() => maintainReactor(selectedReactor.id).then(ok => ok ? showToast('Maintenance started') : showToast('Insufficient resources'))}
                className="px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-all hover:opacity-80 whitespace-nowrap"
                style={{ background: 'rgba(251,146,60,0.12)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.3)' }}
              >
                <i className="ri-settings-3-line mr-1" />Maintain
              </button>
              <button
                onClick={() => toggleReactorStatus(selectedReactor.id, selectedReactor.status === 'online' ? 'offline' : 'online')}
                className="px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-all hover:opacity-80 whitespace-nowrap"
                style={{
                  background: selectedReactor.status === 'online' ? 'rgba(239,68,68,0.15)' : 'rgba(52,211,153,0.15)',
                  color: selectedReactor.status === 'online' ? '#ef4444' : '#34d399',
                  border: `1px solid ${selectedReactor.status === 'online' ? 'rgba(239,68,68,0.3)' : 'rgba(52,211,153,0.3)'}`,
                }}
              >
                {selectedReactor.status === 'online' ? 'SCRAM' : 'Activate'}
              </button>
              <button onClick={() => removeReactor(selectedReactor.id)}
                className="px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-all hover:opacity-80 whitespace-nowrap"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
              >
                <i className="ri-delete-bin-line mr-1" />Dismantle
              </button>
            </div>
          </div>
        )}

        {/* Right panel content: Connection mode & catalog */}
        <div className="p-3 flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#d4a853', fontFamily: 'Orbitron, sans-serif' }}>
              REACTOR CATALOG
            </h3>
            <button onClick={startConnectionMode}
              className="px-2 py-1 rounded text-xs font-bold cursor-pointer transition-all whitespace-nowrap"
              style={{
                background: placementMode === 'connection' ? 'rgba(91,192,190,0.2)' : 'rgba(91,192,190,0.08)',
                color: '#5bc0be',
                border: `1px solid ${placementMode === 'connection' ? 'rgba(91,192,190,0.4)' : 'rgba(91,192,190,0.2)'}`,
              }}
            >
              <i className="ri-link mr-1" />Connect
            </button>
          </div>

          {/* Sub-class filters */}
          <div className="flex items-center gap-1 mb-3 flex-wrap">
            {(['all', 'Standard', 'Advanced', 'Elite', 'Master', 'Grandmaster', 'Mythic'] as SubClassFilter[]).map(sub => (
              <button key={sub} onClick={() => setSubClassFilter(sub)}
                className="px-1.5 py-0.5 rounded text-xs font-semibold cursor-pointer transition-all whitespace-nowrap"
                style={{
                  background: subClassFilter === sub ? `${sub === 'all' ? '#e2c044' : SUB_CLASS_COLORS[sub as SubClass]}20` : 'transparent',
                  color: sub === 'all' ? (subClassFilter === 'all' ? '#e2c044' : '#5a6577') : SUB_CLASS_COLORS[sub as SubClass],
                  border: `1px solid ${subClassFilter === sub ? (sub === 'all' ? '#e2c044' : SUB_CLASS_COLORS[sub as SubClass]) + '40' : 'transparent'}`,
                  fontSize: 8,
                }}
              >{sub}</button>
            ))}
          </div>

          <div className="space-y-2">
            {Object.entries(groupedDefs).map(([typeName, typeDefs]) => (
              <div key={typeName}>
                <div className="flex items-center gap-1.5 mb-1">
                  <i className={`${getReactorIcon(typeName)} text-xs`} style={{ color: REACTOR_CLASS_COLORS[typeDefs[0].reactor_class] }} />
                  <span className="text-xs font-bold" style={{ color: '#8892aa' }}>{typeName}</span>
                  <span className="text-xs" style={{ color: '#5a6577', fontSize: 9 }}>({typeDefs.length})</span>
                </div>
                <div className="space-y-1">
                  {typeDefs.map(def => {
                    const placed = reactors.filter(r => r.definition_id === def.id).length;
                    return (
                      <button key={def.id} onClick={() => { selectDefinition(def); startPlaceReactor(def.id); }}
                        className="w-full flex items-center gap-2 p-2 rounded cursor-pointer transition-all text-left"
                        style={{
                          background: placementDefId === def.id ? `${REACTOR_CLASS_COLORS[def.reactor_class]}15` : 'rgba(0,0,0,0.15)',
                          border: `1px solid ${placementDefId === def.id ? REACTOR_CLASS_COLORS[def.reactor_class] + '40' : 'transparent'}`,
                        }}
                      >
                        <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
                          style={{ background: `${REACTOR_CLASS_COLORS[def.reactor_class]}10`, border: `1px solid ${REACTOR_CLASS_COLORS[def.reactor_class]}25` }}
                        >
                          <span className="text-xs font-bold" style={{ color: REACTOR_CLASS_COLORS[def.reactor_class] }}>{def.tier}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold truncate" style={{ color: '#8892aa' }}>{def.reactor_name}</div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs" style={{ color: SUB_CLASS_COLORS[def.sub_class], fontSize: 8 }}>{def.sub_class}</span>
                            <span className="text-xs" style={{ color: '#5a6577', fontSize: 8 }}>{formatPower(def.base_power_output)}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold" style={{ color: REACTOR_CLASS_COLORS[def.reactor_class] }}>×{SUB_CLASS_MULTIPLIERS[def.sub_class].toFixed(1)}</span>
                          {placed > 0 && <span className="text-xs" style={{ color: '#34d399', fontSize: 8 }}>{placed} active</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {Object.keys(groupedDefs).length === 0 && (
              <div className="text-center py-8">
                <span className="text-xs" style={{ color: '#5a6577' }}>No reactors match filters</span>
              </div>
            )}
          </div>
        </div>

        {/* Grid Stats */}
        <div className="p-3" style={{ borderTop: '1px solid #1e2a36' }}>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="text-center p-1.5 rounded" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ color: '#5a6577', fontSize: 8 }}>REACTORS</div>
              <div className="text-xs font-bold" style={{ color: '#8892aa' }}>{reactors.length}</div>
            </div>
            <div className="text-center p-1.5 rounded" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ color: '#5a6577', fontSize: 8 }}>CONNECTIONS</div>
              <div className="text-xs font-bold" style={{ color: '#8892aa' }}>{connections.length}</div>
            </div>
            <div className="text-center p-1.5 rounded" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ color: '#5a6577', fontSize: 8 }}>GENERATED</div>
              <div className="text-xs font-bold" style={{ color: '#34d399' }}>{formatPower(grid.total_power_generated)}</div>
            </div>
            <div className="text-center p-1.5 rounded" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ color: '#5a6577', fontSize: 8 }}>GRID EFF.</div>
              <div className="text-xs font-bold" style={{ color: '#5bc0be' }}>{grid.grid_efficiency_pct}%</div>
            </div>
            <div className="col-span-2 text-center p-1.5 rounded cursor-pointer transition-all hover:opacity-80"
              style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)' }}
              onClick={() => setShowMaintenance(true)}
            >
              <div className="flex items-center justify-center gap-2">
                <i className="ri-tools-line text-xs" style={{ color: '#60a5fa' }} />
                <span style={{ color: '#60a5fa', fontSize: 8 }}>MAINTENANCE & ENERGY HARVEST</span>
                {reactorNeedsAttention > 0 && (
                  <span className="px-1.5 rounded-full text-white animate-pulse" style={{ background: '#fb923c', fontSize: 7 }}>
                    {reactorNeedsAttention}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-xs font-bold"
          style={{ background: '#0d131a', color: '#e2c044', border: '1px solid #e2c04440' }}
        >
          {toastMessage}
        </div>
      )}

      {/* Placement mode indicator */}
      {placementMode !== 'none' && (
        <div className="fixed top-[68px] left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: '#0d131a', border: '1px solid #e2c04440' }}
        >
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#e2c044' }} />
          <span className="text-xs font-bold" style={{ color: '#e2c044' }}>
            {placementMode === 'reactor' ? 'DEPLOYMENT MODE — Select grid cell' : connStart ? 'ROUTING MODE — Select target node' : 'ROUTING MODE — Select source node'}
          </span>
          <button onClick={clearPlacementMode} className="w-5 h-5 flex items-center justify-center rounded cursor-pointer hover:bg-white/5" style={{ color: '#5a6577' }}>
            <i className="ri-close-line text-xs" />
          </button>
        </div>
      )}

      {/* Overload Panel */}
      {showOverloadPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="rounded-xl overflow-hidden" style={{ width: 580, maxHeight: '80vh', background: '#0d131a', border: '1px solid #1e2a36' }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1e2a36' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded flex items-center justify-center"
                  style={{ background: isCrisis ? 'rgba(239,68,68,0.15)' : 'rgba(251,146,60,0.15)', border: `1px solid ${isCrisis ? 'rgba(239,68,68,0.3)' : 'rgba(251,146,60,0.3)'}` }}
                >
                  <i className={`${isCrisis ? 'ri-alert-fill' : 'ri-shield-flash-line'} text-sm`} style={{ color: isCrisis ? '#ef4444' : '#fb923c' }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: isCrisis ? '#ef4444' : '#fb923c' }}>Grid Overload Control</h3>
                  <span className="text-xs capitalize" style={{ color: isCrisis ? '#f87171' : '#fdba74' }}>Status: {gridRisk.status}</span>
                </div>
              </div>
              <button onClick={() => setShowOverloadPanel(false)} className="w-6 h-6 flex items-center justify-center rounded cursor-pointer hover:bg-white/5" style={{ color: '#5a6577' }}>
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 130px)' }}>
              <div className="mb-4 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #1e2a36' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold" style={{ color: '#8892aa' }}>Meltdown Risk Assessment</span>
                  <span className="text-lg font-black" style={{ color: gridRisk.overallRisk >= 75 ? '#ef4444' : gridRisk.overallRisk >= 40 ? '#fb923c' : '#34d399', fontFamily: 'Orbitron, sans-serif' }}>
                    {gridRisk.overallRisk}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${gridRisk.overallRisk}%`, background: gridRisk.overallRisk >= 75 ? 'linear-gradient(90deg, #fb923c, #ef4444)' : gridRisk.overallRisk >= 40 ? 'linear-gradient(90deg, #fbbf24, #fb923c)' : '#34d399' }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5 text-xs">
                  <span style={{ color: '#5a6577' }}>Cascade: <strong style={{ color: gridRisk.cascadeProbability > 50 ? '#ef4444' : '#fbbf24' }}>{gridRisk.cascadeProbability}%</strong></span>
                  <span style={{ color: '#5a6577' }}>Load: <strong style={{ color: gridRisk.loadPct > 95 ? '#ef4444' : '#8892aa' }}>{gridRisk.loadPct}%</strong></span>
                  <span style={{ color: '#5a6577' }}>Safe: <strong style={{ color: '#34d399' }}>{formatPower(gridRisk.maxSafeLoad)}</strong></span>
                </div>
              </div>

              {gridRisk.reactorRisks.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs font-bold mb-2 block" style={{ color: '#8892aa' }}>Reactor Risk Breakdown</span>
                  <div className="space-y-1.5">
                    {gridRisk.reactorRisks.map(r => (
                      <div key={r.reactorId} className="flex items-center gap-2 p-2 rounded"
                        style={{ background: 'rgba(0,0,0,0.15)', border: `1px solid ${r.risk >= 75 ? 'rgba(239,68,68,0.3)' : r.risk >= 40 ? 'rgba(251,146,60,0.2)' : 'rgba(52,211,153,0.15)'}` }}
                      >
                        <span className="text-xs font-semibold truncate flex-1" style={{ color: '#8892aa' }}>{r.name}</span>
                        <span className="text-xs" style={{ color: '#5a6577' }}>Stab: {r.stability}</span>
                        <div className="w-16 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${r.risk}%`, background: r.risk >= 75 ? '#ef4444' : r.risk >= 40 ? '#fb923c' : '#34d399' }} />
                        </div>
                        <span className="text-xs font-bold w-8 text-right" style={{ color: r.risk >= 75 ? '#ef4444' : r.risk >= 40 ? '#fb923c' : '#34d399' }}>{r.risk}%</span>
                        <button
                          onClick={() => { scramReactorFn(r.reactorId); showToast(`SCRAM triggered on ${r.name}`); }}
                          className="px-1.5 py-0.5 rounded text-xs font-bold cursor-pointer"
                          style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
                        >
                          SCRAM
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-xs font-bold mb-2 block" style={{ color: '#8892aa' }}>
                  Events ({overloadEvents.filter(e => e.status === 'active').length} active)
                </span>
                <div className="space-y-1.5">
                  {overloadEvents.slice(0, 8).map(evt => {
                    const severityColors: Record<string, string> = { warning: '#fbbf24', danger: '#fb923c', critical: '#ef4444', meltdown: '#dc2626' };
                    const typeLabels: Record<string, string> = {
                      overload_warning: 'Overload Warning', overload_danger: 'Overload Danger',
                      cascade_failure: 'Cascade Failure', reactor_meltdown: 'REACTOR MELTDOWN',
                      grid_collapse: 'Grid Collapse', emergency_scram: 'Emergency SCRAM',
                      safety_relief: 'Safety Relief', stabilization: 'Stabilization',
                    };
                    return (
                      <div key={evt.id} className="p-2 rounded"
                        style={{ background: evt.status === 'active' ? 'rgba(239,68,68,0.06)' : 'rgba(0,0,0,0.1)', border: `1px solid ${evt.status === 'active' ? 'rgba(239,68,68,0.2)' : '#1e2a36'}`, opacity: evt.status === 'resolved' ? 0.5 : 1 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ background: severityColors[evt.severity] || '#5a6577' }} />
                            <span className="text-xs font-bold" style={{ color: severityColors[evt.severity] || '#8892aa' }}>{typeLabels[evt.event_type] || evt.event_type}</span>
                          </div>
                          <span className="text-xs capitalize px-1.5 py-0.5 rounded"
                            style={{ background: evt.status === 'active' ? 'rgba(239,68,68,0.15)' : 'rgba(52,211,153,0.1)', color: evt.status === 'active' ? '#ef4444' : '#34d399', fontSize: 8 }}
                          >{evt.status}</span>
                        </div>
                        <div className="text-xs" style={{ color: '#5a6577', fontSize: 9 }}>{evt.trigger_reason}</div>
                        {evt.status === 'active' && (
                          <button onClick={() => { resolveEvent(evt.id); showToast('Event acknowledged'); }}
                            className="mt-1 px-1.5 py-0.5 rounded text-xs font-bold cursor-pointer"
                            style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)', fontSize: 8 }}
                          >Resolve</button>
                        )}
                      </div>
                    );
                  })}
                  {overloadEvents.length === 0 && <div className="text-center py-4"><span className="text-xs" style={{ color: '#4a5568' }}>No overload events recorded</span></div>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderTop: '1px solid #1e2a36', background: 'rgba(0,0,0,0.15)' }}>
              <button onClick={async () => { const c = await emergencyShedLoad('low'); showToast(c > 0 ? `${c} low-priority buildings disconnected` : 'No loads to shed'); }}
                className="px-3 py-1.5 rounded text-xs font-bold cursor-pointer flex-1 whitespace-nowrap"
                style={{ background: 'rgba(251,146,60,0.12)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.3)' }}
              >
                <i className="ri-scissors-line mr-1" />Shed Low Priority
              </button>
              <button onClick={async () => { await triggerEmergencyStabilization(); showToast('Emergency stabilization initiated'); }}
                className="px-3 py-1.5 rounded text-xs font-bold cursor-pointer flex-1 whitespace-nowrap"
                style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
              >
                <i className="ri-shield-flash-line mr-1" />Emergency Stabilize
              </button>
              <button onClick={() => setShowOverloadPanel(false)} className="px-3 py-1.5 rounded text-xs font-bold cursor-pointer whitespace-nowrap"
                style={{ background: 'rgba(255,255,255,0.04)', color: '#5a6577', border: '1px solid #1e2a36' }}
              >Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Panel */}
      {showMaintenance && (
        <MaintenancePanel
          reactors={reactors}
          definitions={definitions}
          onMaintain={maintainReactor}
          onRepair={repairReactor}
          onHarvest={harvestEnergy}
          onClose={() => setShowMaintenance(false)}
          showToast={showToast}
        />
      )}
    </div>
  );
}