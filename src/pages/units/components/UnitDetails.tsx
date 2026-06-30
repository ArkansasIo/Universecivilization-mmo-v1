import type { UnitDefinition } from '../../../data/units/types';
import { UNIT_CLASS_GRADIENTS, UNIT_RARITY_GRADIENTS, UNIT_STATUS_COLORS } from '../../../data/units/types';
import { calculateUnitPower } from '../../../hooks/useUnitSystem';

interface UnitDetailsProps {
  unit: UnitDefinition;
  onClose: () => void;
  onTrain?: (unitId: string, count: number) => void;
}

export default function UnitDetails({ unit, onClose, onTrain }: UnitDetailsProps) {
  const classGradient = UNIT_CLASS_GRADIENTS[unit.class] || 'from-gray-500 to-slate-600';
  const rarityGradient = UNIT_RARITY_GRADIENTS[unit.rarity] || 'from-gray-500 to-slate-600';
  const statusColor = UNIT_STATUS_COLORS[unit.status] || 'text-gray-400';
  const power = calculateUnitPower(unit);

  const statSections = [
    { label: 'Health', val: unit.stats.health, color: 'text-red-400', max: unit.stats.maxHealth },
    { label: 'Stamina', val: unit.stats.stamina, color: 'text-orange-400', max: unit.stats.maxStamina },
    { label: 'Morale', val: unit.stats.morale, color: 'text-yellow-400', max: unit.stats.maxMorale },
    { label: 'Combat', val: unit.stats.combat, color: 'text-red-300', max: null },
    { label: 'Defense', val: unit.stats.defense, color: 'text-sky-400', max: null },
    { label: 'Speed', val: unit.stats.speed, color: 'text-green-400', max: null },
    { label: 'Intelligence', val: unit.stats.intelligence, color: 'text-violet-400', max: null },
    { label: 'Efficiency', val: unit.stats.efficiency, color: 'text-emerald-400', max: null },
    { label: 'Productivity', val: unit.stats.productivity, color: 'text-teal-400', max: null },
    { label: 'Loyalty', val: unit.stats.loyalty, color: 'text-pink-400', max: null },
    { label: 'Discipline', val: unit.stats.discipline, color: 'text-indigo-400', max: null },
  ];

  const subStatEntries = Object.entries(unit.subStats);

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#0B1929] border border-cyan-400/30 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`relative h-2 w-full rounded-t-2xl bg-gradient-to-r ${rarityGradient}`} />
        <div className="p-6 border-b border-cyan-400/20">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center cursor-pointer transition-all"
          >
            <i className="ri-close-line text-xl text-white w-5 h-5 flex items-center justify-center" />
          </button>

          <div className="flex items-start gap-5">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${classGradient} flex items-center justify-center flex-shrink-0`}>
              <i className={`${unit.icon} text-4xl text-white w-12 h-12 flex items-center justify-center`} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-black text-white mb-2">{unit.name}</h2>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded-lg bg-gradient-to-r ${classGradient} text-white font-bold capitalize`}>
                  {unit.class.replace('-', ' ')} · {unit.subClass.replace('-', ' ')}
                </span>
                <span className={`text-xs px-2 py-1 rounded-lg bg-gradient-to-r ${rarityGradient} text-white font-bold`}>
                  {unit.rarity}
                </span>
                <span className="text-xs px-2 py-1 bg-slate-700 text-gray-300 rounded-lg">Tier {unit.tier}</span>
                <span className={`text-xs font-bold capitalize ${statusColor}`}>{unit.status.replace(/-/g, ' ')}</span>
              </div>
              <div className="text-sm text-gray-400">
                {unit.jobType} · {unit.sector} · <span className="text-cyan-400">{unit.unitFunction}</span> → <span className="text-teal-400">{unit.subFunction}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-3xl font-black text-cyan-400">Lv.{unit.level}</div>
              <div className="text-sm text-gray-500">Max: {unit.maxLevel}</div>
              <div className="text-sm font-bold text-amber-400 mt-1">{power.toLocaleString()} PWR</div>
            </div>
          </div>

          <p className="text-sm text-gray-300 mt-4">{unit.description}</p>
          <p className="text-xs text-gray-500 italic mt-1">"{unit.lore}"</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Primary Stats */}
          <div>
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Primary Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {statSections.map(s => (
                <div key={s.label} className="bg-slate-800/60 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                  {s.max ? (
                    <>
                      <div className={`text-lg font-bold ${s.color}`}>{s.val} / {s.max}</div>
                      <div className="h-1 bg-slate-700 rounded-full mt-1 overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${s.label === 'Health' ? 'from-red-500 to-rose-600' : s.label === 'Stamina' ? 'from-orange-500 to-amber-600' : 'from-yellow-500 to-orange-500'}`} style={{ width: `${(s.val / s.max) * 100}%` }} />
                      </div>
                    </>
                  ) : (
                    <div className={`text-xl font-bold ${s.color}`}>{s.val}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sub-Stats */}
          <div>
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">RPG Attributes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {subStatEntries.map(([key, val]) => (
                <div key={key} className="bg-slate-800/60 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-500 mb-0.5 capitalize">{key}</div>
                  <div className="text-base font-bold text-cyan-300">{val}</div>
                  <div className="h-1 bg-slate-700 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-600 to-blue-700" style={{ width: `${Math.min(val / 3, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Effects */}
          <div>
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Effects & Abilities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold text-emerald-400 mb-2">Primary Effects</h4>
                <div className="space-y-1.5">
                  {unit.effects.primary.map((e, i) => (
                    <div key={i} className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 text-xs">
                      <i className="ri-checkbox-circle-fill text-emerald-400 mt-0.5 w-3 h-3 flex items-center justify-center flex-shrink-0" />
                      <span className="text-emerald-200">{e}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-sky-400 mb-2">Secondary Effects</h4>
                <div className="space-y-1.5">
                  {unit.effects.secondary.map((e, i) => (
                    <div key={i} className="flex items-start gap-2 bg-sky-500/10 border border-sky-500/20 rounded-lg px-3 py-2 text-xs">
                      <i className="ri-arrow-right-circle-fill text-sky-400 mt-0.5 w-3 h-3 flex items-center justify-center flex-shrink-0" />
                      <span className="text-sky-200">{e}</span>
                    </div>
                  ))}
                </div>
              </div>
              {unit.effects.special.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-amber-400 mb-2">Special Abilities</h4>
                  <div className="space-y-1.5">
                    {unit.effects.special.map((e, i) => (
                      <div key={i} className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 text-xs">
                        <i className="ri-star-fill text-amber-400 mt-0.5 w-3 h-3 flex items-center justify-center flex-shrink-0" />
                        <span className="text-amber-200">{e}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {unit.effects.passive.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-violet-400 mb-2">Passive Traits</h4>
                  <div className="space-y-1.5">
                    {unit.effects.passive.map((e, i) => (
                      <div key={i} className="flex items-start gap-2 bg-violet-500/10 border border-violet-500/20 rounded-lg px-3 py-2 text-xs">
                        <i className="ri-eye-fill text-violet-400 mt-0.5 w-3 h-3 flex items-center justify-center flex-shrink-0" />
                        <span className="text-violet-200">{e}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Equipment & Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Equipment</h3>
              <div className="space-y-1.5">
                {unit.equipment.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2 text-xs">
                    <i className="ri-shield-line text-amber-400 w-4 h-4 flex items-center justify-center flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Skills & Abilities</h3>
              <div className="space-y-1.5">
                {[...unit.skills, ...unit.abilities].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2 text-xs">
                    <i className="ri-star-line text-violet-400 w-4 h-4 flex items-center justify-center flex-shrink-0" />
                    <span className="text-gray-300">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Training Requirements</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { label: 'Metal', val: unit.requirements.metal, color: 'text-yellow-400' },
                { label: 'Crystal', val: unit.requirements.crystal, color: 'text-sky-400' },
                { label: 'Deuterium', val: unit.requirements.deuterium, color: 'text-green-400' },
                { label: 'Food', val: unit.requirements.food, color: 'text-orange-400' },
                { label: 'Credits', val: unit.requirements.credits, color: 'text-amber-400' },
                { label: 'Duration', val: unit.requirements.time, color: 'text-cyan-400', isString: true }
              ].map(r => (
                <div key={r.label} className="bg-slate-800/60 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-500 mb-0.5">{r.label}</div>
                  <div className={`text-xs font-bold ${r.color}`}>
                    {'isString' in r && r.isString ? r.val : typeof r.val === 'number' ? r.val.toLocaleString() : r.val}
                  </div>
                </div>
              ))}
            </div>
            {unit.requirements.buildings && unit.requirements.buildings.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {unit.requirements.buildings.map((b, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-slate-700 text-gray-400 rounded-lg">
                    <i className="ri-building-line mr-1" />{b}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Upkeep */}
          <div>
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Daily Upkeep</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-800/60 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Food</div>
                <div className="text-xl font-bold text-orange-400">{unit.upkeep.food}</div>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Credits</div>
                <div className="text-xl font-bold text-amber-400">{unit.upkeep.credits}</div>
              </div>
              {unit.upkeep.energy && (
                <div className="bg-slate-800/60 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">Energy</div>
                  <div className="text-xl font-bold text-yellow-400">{unit.upkeep.energy}</div>
                </div>
              )}
              {unit.upkeep.deuterium && (
                <div className="bg-slate-800/60 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">Deuterium</div>
                  <div className="text-xl font-bold text-green-400">{unit.upkeep.deuterium}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
