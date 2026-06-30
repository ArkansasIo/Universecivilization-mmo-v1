import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { RESEARCH_TREE, type TechDef, type ResearchId } from '@/config/researchTree';
import { REACTOR_CLASS_COLORS, SUB_CLASS_COLORS, getReactorIcon } from '@/data/powerReactors';
import type { ReactorDefinition, ReactorClass, SubClass } from '@/data/powerReactors';

interface ResearchProgress {
  [key: string]: number;
}

interface UnlockedSubClass {
  reactor_type: string;
  sub_class: SubClass;
  tier: number;
  required_tech: string | null;
  required_building: string | null;
  is_unlocked: boolean;
  missing_techs: string[];
  reactor_count: number;
}

const SUB_CLASS_ORDER: SubClass[] = ['Standard', 'Advanced', 'Elite', 'Master', 'Grandmaster', 'Mythic'];

function parseTechReq(requiredTech: string | null): { tech: string; level: number }[] {
  if (!requiredTech) return [];
  return requiredTech.split(',').map(pair => {
    const [tech, level] = pair.split(':');
    return { tech, level: parseInt(level) || 0 };
  });
}

function parseBldReq(requiredBld: string | null): { building: string; level: number }[] {
  if (!requiredBld) return [];
  return requiredBld.split(',').map(pair => {
    const [bld, level] = pair.split(':');
    return { building: bld, level: parseInt(level) || 0 };
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   SVG TREE CONNECTOR — Draws a curved path between two points
   ═══════════════════════════════════════════════════════════════════════ */
function TreeConnector({ fromX, fromY, toX, toY, isActive, color }: {
  fromX: number; fromY: number; toX: number; toY: number; isActive: boolean; color: string;
}) {
  const midX = (fromX + toX) / 2;
  const path = `M ${fromX},${fromY} C ${midX},${fromY} ${midX},${toY} ${toX},${toY}`;
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 0 }}>
      <path
        d={path}
        fill="none"
        stroke={isActive ? color : '#2a3544'}
        strokeWidth={isActive ? 2 : 1}
        opacity={isActive ? 0.6 : 0.2}
        strokeDasharray={isActive ? 'none' : '4,4'}
      />
      {isActive && (
        <circle r={2.5} fill={color} opacity={0.8}>
          <animateMotion dur="2s" repeatCount="indefinite" path={path} />
        </circle>
      )}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   TECH NODE CARD — Cinematic reactor blueprint card
   ═══════════════════════════════════════════════════════════════════════ */
function TechNodeCard({
  entry, def, clsColor, index, columnHeight,
}: {
  entry: UnlockedSubClass; def?: ReactorDefinition; clsColor: string;
  index: number; columnHeight: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prevUnlocked = useRef(entry.is_unlocked);
  const [justUnlocked, setJustUnlocked] = useState(false);

  useEffect(() => {
    if (!prevUnlocked.current && entry.is_unlocked) {
      setJustUnlocked(true);
      setTimeout(() => setJustUnlocked(false), 2000);
    }
    prevUnlocked.current = entry.is_unlocked;
  }, [entry.is_unlocked]);

  return (
    <div
      ref={cardRef}
      className="relative rounded-lg p-2.5 transition-all duration-500"
      style={{
        background: entry.is_unlocked
          ? `linear-gradient(135deg, ${clsColor}08, rgba(0,0,0,0.3))`
          : 'rgba(0,0,0,0.2)',
        border: `1px solid ${entry.is_unlocked ? clsColor + '40' : 'rgba(239,68,68,0.15)'}`,
        boxShadow: justUnlocked ? `0 0 20px ${clsColor}30` : 'none',
        opacity: entry.is_unlocked ? 1 : 0.55,
      }}
    >
      {/* Just-unlocked flash */}
      {justUnlocked && (
        <div className="absolute inset-0 rounded-lg pointer-events-none animate-pulse" style={{ border: `2px solid ${clsColor}`, opacity: 0.4 }} />
      )}

      <div className="flex items-center gap-1.5 mb-1.5">
        <div
          className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
          style={{
            background: entry.is_unlocked ? `${clsColor}15` : 'rgba(239,68,68,0.08)',
            border: `1px solid ${entry.is_unlocked ? clsColor + '30' : 'rgba(239,68,68,0.2)'}`,
          }}
        >
          {entry.is_unlocked ? (
            <i className="ri-check-line text-xs" style={{ color: '#34d399' }} />
          ) : (
            <i className="ri-lock-line text-xs" style={{ color: '#f87171' }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold truncate" style={{ color: '#8892aa' }}>{entry.reactor_type}</div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold" style={{ color: SUB_CLASS_COLORS[entry.sub_class] }}>{entry.sub_class}</span>
            {def && (
              <span className="text-xs" style={{ color: '#5a6577' }}>
                {def.base_power_output >= 1e6 ? `${(def.base_power_output / 1e6).toFixed(1)}MW` : def.base_power_output >= 1e3 ? `${(def.base_power_output / 1e3).toFixed(0)}KW` : `${def.base_power_output}W`}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end flex-shrink-0">
          {def && (
            <span className="text-xs font-bold" style={{ color: clsColor }}>T{def.tier}</span>
          )}
        </div>
      </div>

      {/* Requirements detail */}
      {!entry.is_unlocked && entry.missing_techs.length > 0 && (
        <div className="mt-1.5 pt-1.5 space-y-0.5" style={{ borderTop: '1px solid rgba(239,68,68,0.1)' }}>
          {entry.missing_techs.map((tech, i) => (
            <div key={i} className="flex items-center gap-1 text-xs" style={{ color: '#f87171' }}>
              <i className="ri-close-circle-line text-[8px] w-3 h-3 flex items-center justify-center flex-shrink-0" />
              <span className="truncate" style={{ fontSize: 8 }}>{tech}</span>
            </div>
          ))}
        </div>
      )}

      {entry.is_unlocked && (
        <div className="mt-1 flex items-center gap-1">
          <span className="text-xs" style={{ color: '#34d399', fontSize: 8 }}>
            <i className="ri-checkbox-circle-line mr-0.5" />Blueprint Unlocked
          </span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   RESEARCH SUMMARY CARD — Top panel tech progress
   ═══════════════════════════════════════════════════════════════════════ */
function TechSummaryCard({ techId, level }: { techId: string; level: number }) {
  const def = RESEARCH_TREE[techId as ResearchId];
  if (!def) return null;

  const pct = Math.min(100, (level / def.maxLevel) * 100);
  const catColors: Record<string, string> = {
    Energy: '#F59E0B',
    Advanced: '#EC4899',
    Physics: '#60a5fa',
    Military: '#ef4444',
  };

  return (
    <div className="p-3 rounded-lg relative overflow-hidden group"
      style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1e2a36' }}
    >
      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-5"
        style={{ background: catColors[def.category] || '#8892aa' }}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-6 h-6 rounded flex items-center justify-center"
            style={{ background: `${catColors[def.category] || '#8892aa'}15` }}
          >
            <i className={`${def.icon} text-xs`} style={{ color: catColors[def.category] || '#8892aa' }} />
          </div>
          <span className="text-xs font-semibold truncate" style={{ color: '#8892aa' }}>{def.name}</span>
        </div>
        <div className="flex items-end gap-1 mb-1.5">
          <span className="text-2xl font-black leading-none" style={{ color: '#e2c044', fontFamily: 'Orbitron, sans-serif' }}>{level}</span>
          <span className="text-xs mb-0.5" style={{ color: '#5a6577' }}>/ {def.maxLevel}</span>
        </div>
        <div className="w-full h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="h-1 rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${catColors[def.category] || '#e2c044'}40, ${catColors[def.category] || '#e2c044'})` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ReactorResearchTreePage() {
  const [definitions, setDefinitions] = useState<ReactorDefinition[]>([]);
  const [researchProgress, setResearchProgress] = useState<ResearchProgress>();
  const [buildingLevels, setBuildingLevels] = useState<ResearchProgress>();
  const [unlocks, setUnlocks] = useState<UnlockedSubClass[]>([]);
  const [selectedReactor, setSelectedReactor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const treeContainerRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: defs } = await supabase
        .from('reactor_definitions')
        .select('*')
        .order('tier')
        .order('id');
      setDefinitions((defs || []) as ReactorDefinition[]);

      const { data: research } = await supabase
        .from('research_projects')
        .select('technology_name, level')
        .eq('status', 'completed');

      const progress: ResearchProgress = {};
      (research || []).forEach((r: Record<string, unknown>) => {
        const name = (r.technology_name as string || '').toLowerCase().replace(/\s+/g, '_');
        const level = r.level as number;
        const nameMap: Record<string, string> = {
          'energy_technology': 'energy_technology',
          'fusion_technology': 'fusion_technology',
          'dark_energy_research': 'dark_energy_research',
          'quantum_research': 'quantum_research',
        };
        const techNames: Record<string, string> = {
          'energy technology': 'energy_technology',
          'fusion technology': 'fusion_technology',
          'dark energy research': 'dark_energy_research',
          'quantum research': 'quantum_research',
        };
        const key = nameMap[name] || techNames[(r.technology_name as string || '').toLowerCase()] || name;
        if (!progress[key] || level > progress[key]) {
          progress[key] = level;
        }
      });

      if (Object.keys(progress).length === 0) {
        progress.energy_technology = 15;
        progress.fusion_technology = 10;
        progress.dark_energy_research = 8;
        progress.quantum_research = 5;
      }
      setResearchProgress(progress);

      const { data: buildings } = await supabase
        .from('buildings')
        .select('building_type, level');

      const bldLevels: ResearchProgress = {};
      (buildings || []).forEach((b: Record<string, unknown>) => {
        const type = b.building_type as string;
        if (!bldLevels[type] || (b.level as number) > bldLevels[type]) {
          bldLevels[type] = b.level as number;
        }
      });

      if (Object.keys(bldLevels).length === 0) {
        bldLevels.research_lab = 14;
      }
      setBuildingLevels(bldLevels);
    } catch (e) {
      console.error('Failed to load research tree data:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Calculate unlocks
  useEffect(() => {
    if (definitions.length === 0) return;
    const typeGroups: Record<string, ReactorDefinition[]> = {};
    definitions.forEach(d => {
      if (!typeGroups[d.reactor_type]) typeGroups[d.reactor_type] = [];
      typeGroups[d.reactor_type].push(d);
    });

    const unlockStatus: UnlockedSubClass[] = [];
    Object.entries(typeGroups).forEach(([typeName, defs]) => {
      defs.sort((a, b) => a.tier - b.tier);
      defs.forEach(def => {
        const techReqs = parseTechReq(def.required_tech);
        const bldReqs = parseBldReq(def.required_building_level);
        const missingTechs: string[] = [];

        techReqs.forEach(({ tech, level }) => {
          if ((researchProgress[tech] || 0) < level) {
            const techDef = RESEARCH_TREE[tech as ResearchId];
            missingTechs.push(`${techDef?.name || tech} Lv.${level} (have ${researchProgress[tech] || 0})`);
          }
        });
        bldReqs.forEach(({ building, level }) => {
          if ((buildingLevels[building] || 0) < level) {
            missingTechs.push(`${building.replace(/_/g, ' ')} Lv.${level} (have ${buildingLevels[building] || 0})`);
          }
        });

        unlockStatus.push({
          reactor_type: typeName,
          sub_class: def.sub_class,
          tier: def.tier,
          required_tech: def.required_tech,
          required_building: def.required_building_level,
          is_unlocked: missingTechs.length === 0,
          missing_techs: missingTechs,
          reactor_count: 0,
        });
      });
    });
    setUnlocks(unlockStatus);
  }, [definitions, researchProgress, buildingLevels]);

  useEffect(() => { loadData(); }, [loadData]);

  const groupedUnlocks = SUB_CLASS_ORDER.map(sub => ({
    sub_class: sub,
    entries: unlocks.filter(u => u.sub_class === sub),
    anyUnlocked: unlocks.filter(u => u.sub_class === sub && u.is_unlocked).length > 0,
    allUnlocked: unlocks.filter(u => u.sub_class === sub).every(u => u.is_unlocked),
  }));

  const reactorTypes = [...new Set(definitions.map(d => d.reactor_type))];
  const unlockedCount = unlocks.filter(u => u.is_unlocked).length;
  const lockedCount = unlocks.filter(u => !u.is_unlocked).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px]"
        style={{ background: 'linear-gradient(180deg, #070a10 0%, #090c14 100%)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-transparent animate-spin"
            style={{ borderTopColor: '#e2c044', borderRightColor: '#d4a853' }}
          />
          <span className="text-sm" style={{ color: '#5a6577' }}>Loading Reactor Research Tree...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-auto"
      style={{ minHeight: 'calc(100vh - 60px)', background: 'linear-gradient(180deg, #070a10 0%, #090c14 100%)' }}
    >
      {/* Header */}
      <div className="px-5 py-4" style={{ borderBottom: '1px solid #1e2a36' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #e2c044, #d4a853)' }}
          >
            <i className="ri-file-code-line text-white text-lg" />
          </div>
          <div>
            <h1 className="text-base font-bold" style={{ color: '#d4a853', fontFamily: 'Orbitron, sans-serif' }}>
              REACTOR BLUEPRINT ARCHIVE
            </h1>
            <p className="text-xs" style={{ color: '#5a6577' }}>
              Unlock higher-tier reactor designs through Research Lab advancement
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: '#34d399' }} />
              <span style={{ color: '#8892aa' }}>Unlocked <strong style={{ color: '#34d399' }}>{unlockedCount}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: '#f87171' }} />
              <span style={{ color: '#8892aa' }}>Locked <strong style={{ color: '#f87171' }}>{lockedCount}</strong></span>
            </div>
            <div className="px-2 py-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #1e2a36' }}>
              <span style={{ color: '#5a6577' }}>Lab <strong style={{ color: '#e2c044' }}>Lv.{buildingLevels.research_lab || 0}</strong></span>
            </div>
          </div>
        </div>

        {/* Reactor type filter tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedReactor(null)}
            className="px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all whitespace-nowrap"
            style={{
              background: !selectedReactor ? 'rgba(226,192,68,0.15)' : 'transparent',
              color: !selectedReactor ? '#e2c044' : '#5a6577',
              border: `1px solid ${!selectedReactor ? 'rgba(226,192,68,0.3)' : '#1e2a36'}`,
            }}
          >
            All Types
          </button>
          {reactorTypes.map(type => {
            const def = definitions.find(d => d.reactor_type === type);
            const cls = def?.reactor_class || 'Civilian';
            return (
              <button
                key={type}
                onClick={() => setSelectedReactor(type)}
                className="px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all whitespace-nowrap flex items-center gap-1.5"
                style={{
                  background: selectedReactor === type ? `${REACTOR_CLASS_COLORS[cls]}15` : 'transparent',
                  color: selectedReactor === type ? REACTOR_CLASS_COLORS[cls] : '#5a6577',
                  border: `1px solid ${selectedReactor === type ? REACTOR_CLASS_COLORS[cls] + '40' : '#1e2a36'}`,
                }}
              >
                <i className={`${getReactorIcon(type)} text-xs`} />
                {type.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Research Progress Summary */}
      <div className="px-5 py-3 grid grid-cols-2 md:grid-cols-4 gap-3" style={{ borderBottom: '1px solid #1e2a36', background: 'rgba(0,0,0,0.08)' }}>
        {['energy_technology', 'fusion_technology', 'dark_energy_research', 'quantum_research'].map(techId => (
          <TechSummaryCard key={techId} techId={techId} level={researchProgress[techId] || 0} />
        ))}
      </div>

      {/* Legend */}
      <div className="px-5 py-2 flex items-center gap-4 text-xs" style={{ borderBottom: '1px solid #1e2a36', background: 'rgba(0,0,0,0.05)' }}>
        <span style={{ color: '#5a6577' }}>Legend:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }} />
          <span style={{ color: '#34d399' }}>Unlocked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: 'rgba(239,68,68,0.3)', border: '1px solid rgba(239,68,68,0.4)' }} />
          <span style={{ color: '#f87171' }}>Locked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: 'rgba(251,191,36,0.3)', border: '1px solid rgba(251,191,36,0.4)' }} />
          <span style={{ color: '#fbbf24' }}>Partial</span>
        </div>
      </div>

      {/* Main tree body */}
      <div className="flex-1 p-5 overflow-auto">
        <div ref={treeContainerRef} className="relative">
          <div className="grid gap-4"
            style={{
              gridTemplateColumns: selectedReactor
                ? `repeat(${Math.min(6, SUB_CLASS_ORDER.length)}, minmax(200px, 1fr))`
                : `repeat(${SUB_CLASS_ORDER.length}, minmax(200px, 1fr))`,
            }}
          >
            {SUB_CLASS_ORDER.map((subClass, colIdx) => {
              const group = groupedUnlocks.find(g => g.sub_class === subClass);
              const entries = selectedReactor
                ? (group?.entries.filter(e => e.reactor_type === selectedReactor) || [])
                : (group?.entries || []);
              const tierReqs: Record<string, string> = {
                Standard: 'No requirement',
                Advanced: 'Energy Tech Lv.3',
                Elite: 'Energy Lv.5 + Fusion Lv.3',
                Master: 'Energy Lv.10 + Fusion Lv.8',
                Grandmaster: 'Energy Lv.12 + Dark Energy Lv.5',
                Mythic: 'Dark Energy Lv.10 + Quantum Lv.5',
              };

              return (
                <div key={subClass} className="flex flex-col gap-3 relative">
                  {/* Column header */}
                  <div className="text-center relative z-10">
                    <div className="px-3 py-2.5 rounded-xl"
                      style={{
                        background: group?.allUnlocked
                          ? 'rgba(52,211,153,0.08)'
                          : group?.anyUnlocked
                            ? 'rgba(251,191,36,0.08)'
                            : 'rgba(239,68,68,0.05)',
                        border: `1px solid ${group?.allUnlocked ? 'rgba(52,211,153,0.2)' : group?.anyUnlocked ? 'rgba(251,191,36,0.2)' : 'rgba(239,68,68,0.15)'}`,
                      }}
                    >
                      <div className="text-sm font-bold" style={{ color: SUB_CLASS_COLORS[subClass], fontFamily: 'Orbitron, sans-serif' }}>
                        {subClass}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: '#5a6577', fontSize: 9 }}>TIER {colIdx + 1}</div>
                      <div className="text-xs mt-1" style={{ color: '#4a5568', fontSize: 8 }}>{tierReqs[subClass]}</div>
                    </div>

                    {/* Connector arrow to next tier */}
                    {colIdx < SUB_CLASS_ORDER.length - 1 && (
                      <div className="flex items-center justify-center my-1">
                        <i className="ri-arrow-down-s-line" style={{ color: '#2a3544', fontSize: 20 }} />
                      </div>
                    )}
                  </div>

                  {/* Reactor entries */}
                  <div className="flex flex-col gap-2 relative z-10">
                    {entries.map((entry, idx) => {
                      const def = definitions.find(d => d.reactor_type === entry.reactor_type && d.sub_class === entry.sub_class);
                      const cls = def?.reactor_class || 'Civilian';
                      const clsColor = REACTOR_CLASS_COLORS[cls];

                      return (
                        <div key={`${entry.reactor_type}-${entry.sub_class}`}
                          onMouseEnter={() => setHoveredNode(`${entry.reactor_type}-${entry.sub_class}`)}
                          onMouseLeave={() => setHoveredNode(null)}
                        >
                          <TechNodeCard
                            entry={entry}
                            def={def}
                            clsColor={clsColor}
                            index={idx}
                            columnHeight={entries.length}
                          />
                        </div>
                      );
                    })}

                    {entries.length === 0 && (
                      <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(0,0,0,0.1)', border: '1px dashed #1e2a36' }}>
                        <span className="text-xs" style={{ color: '#4a5568' }}>— No blueprints —</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: '1px solid #1e2a36', background: 'rgba(0,0,0,0.15)' }}>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: '#34d399' }} />
            <span style={{ color: '#8892aa' }}>Unlocked <strong style={{ color: '#34d399' }}>{unlockedCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: '#f87171' }} />
            <span style={{ color: '#8892aa' }}>Locked <strong style={{ color: '#f87171' }}>{lockedCount}</strong></span>
          </div>
          <div style={{ color: '#5a6577' }}>
            Total <strong style={{ color: '#e2c044' }}>{unlocks.length} blueprints</strong> · {reactorTypes.length} reactor types
          </div>
        </div>
        <button
          onClick={loadData}
          className="px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition-all hover:opacity-80 whitespace-nowrap"
          style={{ background: 'rgba(226,192,68,0.1)', color: '#e2c044', border: '1px solid rgba(226,192,68,0.2)' }}
        >
          <i className="ri-refresh-line mr-1" />Sync Data
        </button>
      </div>
    </div>
  );
}