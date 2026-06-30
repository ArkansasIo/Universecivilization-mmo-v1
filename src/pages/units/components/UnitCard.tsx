import { useState } from 'react';
import type { UnitDefinition } from '../../../data/units/types';
import { UNIT_CLASS_GRADIENTS, UNIT_RARITY_GRADIENTS, UNIT_STATUS_COLORS } from '../../../data/units/types';
import { calculateUnitPower } from '../../../hooks/useUnitSystem';

interface UnitCardProps {
  unit: UnitDefinition;
  onViewDetails: (unit: UnitDefinition) => void;
  onTrain: (unitId: string, count: number) => void;
  onDeploy?: (unitId: string) => void;
}

export default function UnitCard({ unit, onViewDetails, onTrain, onDeploy }: UnitCardProps) {
  const [trainCount, setTrainCount] = useState(0);

  const classGradient = UNIT_CLASS_GRADIENTS[unit.class] || 'from-gray-500 to-slate-600';
  const rarityGradient = UNIT_RARITY_GRADIENTS[unit.rarity] || 'from-gray-500 to-slate-600';
  const statusColor = UNIT_STATUS_COLORS[unit.status] || 'text-gray-400';
  const power = calculateUnitPower(unit);

  const rarityBorder: Record<string, string> = {
    Common: 'border-gray-500/40',
    Uncommon: 'border-emerald-500/40',
    Rare: 'border-sky-500/40',
    Epic: 'border-violet-500/40',
    Legendary: 'border-amber-500/50',
    Mythic: 'border-red-500/50',
    Transcendent: 'border-pink-500/60'
  };

  const handleTrain = () => {
    if (trainCount > 0) {
      onTrain(unit.id, trainCount);
      setTrainCount(0);
    }
  };

  return (
    <div className={`bg-[#0B1929] border ${rarityBorder[unit.rarity] || 'border-cyan-400/20'} rounded-xl overflow-hidden hover:border-cyan-400/50 transition-all`}>
      {/* Top Banner */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${rarityGradient}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${classGradient} flex items-center justify-center flex-shrink-0`}>
            <i className={`${unit.icon} text-2xl text-white w-8 h-8 flex items-center justify-center`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1 mb-1">
              <h3 className="text-base font-bold text-white leading-tight">{unit.name}</h3>
              <div className="text-right flex-shrink-0">
                <div className="text-xl font-black text-cyan-400">Lv.{unit.level}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className={`text-xs px-2 py-0.5 rounded bg-gradient-to-r ${classGradient} text-white font-semibold capitalize`}>
                {unit.class.replace('-', ' ')}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded bg-gradient-to-r ${rarityGradient} text-white font-semibold`}>
                {unit.rarity}
              </span>
              <span className="text-xs bg-slate-700/80 text-gray-300 px-2 py-0.5 rounded">
                T{unit.tier}
              </span>
            </div>

            <div className="text-xs text-gray-500">{unit.jobType} · {unit.sector}</div>
          </div>
        </div>

        {/* Status & Power */}
        <div className="flex items-center justify-between mb-3 bg-slate-800/50 rounded-lg px-3 py-2">
          <div className="flex items-center gap-1.5">
            <i className="ri-pulse-line text-xs text-gray-400 w-3 h-3 flex items-center justify-center" />
            <span className={`text-xs font-semibold capitalize ${statusColor}`}>
              {unit.status.replace('-', ' ')}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <i className="ri-sword-fill text-xs text-amber-400 w-3 h-3 flex items-center justify-center" />
            <span className="text-xs font-bold text-amber-400">{power.toLocaleString()} PWR</span>
          </div>
        </div>

        {/* Training Progress */}
        {(unit.status === 'basic-training' || unit.status === 'advanced-training' || unit.status === 'specialist-training') && unit.trainingProgress && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Training: {unit.status.replace('-', ' ')}</span>
              <span>{unit.trainingProgress}%</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all"
                style={{ width: `${unit.trainingProgress}%` }}
              />
            </div>
            {unit.trainingTimeLeft && (
              <div className="text-xs text-amber-400 mt-1 text-right">{unit.trainingTimeLeft} remaining</div>
            )}
          </div>
        )}

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          <div className="bg-slate-800/60 rounded-lg px-2 py-1.5 text-center">
            <div className="text-xs text-gray-500 mb-0.5">Combat</div>
            <div className="text-sm font-bold text-red-400">{unit.stats.combat}</div>
          </div>
          <div className="bg-slate-800/60 rounded-lg px-2 py-1.5 text-center">
            <div className="text-xs text-gray-500 mb-0.5">Efficiency</div>
            <div className="text-sm font-bold text-emerald-400">{unit.stats.efficiency}%</div>
          </div>
          <div className="bg-slate-800/60 rounded-lg px-2 py-1.5 text-center">
            <div className="text-xs text-gray-500 mb-0.5">Intel</div>
            <div className="text-sm font-bold text-violet-400">{unit.stats.intelligence}</div>
          </div>
        </div>

        {/* Top Effect */}
        {unit.effects.primary[0] && (
          <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 mb-3">
            <i className="ri-checkbox-circle-fill text-emerald-400 text-sm mt-0.5 w-4 h-4 flex items-center justify-center flex-shrink-0" />
            <span className="text-xs text-emerald-300">{unit.effects.primary[0]}</span>
          </div>
        )}

        {/* Available Count + XP Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Available: <span className="text-cyan-400 font-bold">{unit.available.toLocaleString()}</span></span>
            <span>XP: {unit.experience}/{unit.maxExperience}</span>
          </div>
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              style={{ width: `${Math.min((unit.experience / unit.maxExperience) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Training Input (untrained units) */}
        {(unit.status === 'untrained' || unit.available > 0) && (
          <div className="flex gap-2 mb-3">
            <input
              type="number"
              min="0"
              max={unit.available}
              value={trainCount || ''}
              onChange={(e) => setTrainCount(Math.max(0, parseInt(e.target.value) || 0))}
              placeholder="0"
              className="flex-1 px-3 py-1.5 bg-[#0A1628] border border-cyan-400/30 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => setTrainCount(Math.min(50, unit.available))}
              className="px-2 py-1.5 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-all text-xs cursor-pointer whitespace-nowrap"
            >
              +50
            </button>
            <button
              onClick={handleTrain}
              disabled={trainCount === 0}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                trainCount > 0
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500 hover:text-black'
                  : 'bg-slate-700 text-gray-600 cursor-not-allowed'
              }`}
            >
              Train
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(unit)}
            className="flex-1 px-3 py-2 bg-slate-700/80 hover:bg-slate-600 text-gray-300 hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
          >
            <i className="ri-eye-line mr-1 w-3 h-3 inline-flex items-center justify-center" />
            Details
          </button>
          {unit.status === 'trained' && unit.available > 0 && onDeploy && (
            <button
              onClick={() => onDeploy(unit.id)}
              className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border border-blue-500/30"
            >
              <i className="ri-send-plane-line mr-1 w-3 h-3 inline-flex items-center justify-center" />
              Deploy
            </button>
          )}
          {unit.status === 'injured' && (
            <button className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold whitespace-nowrap border border-red-500/30">
              <i className="ri-heart-pulse-line mr-1 w-3 h-3 inline-flex items-center justify-center" />
              Heal
            </button>
          )}
        </div>

        {/* Upkeep Row */}
        <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between text-xs text-gray-600">
          <span>Upkeep: <span className="text-orange-400">{unit.upkeep.food} food</span></span>
          <span><span className="text-amber-400">{unit.upkeep.credits} cr</span>/day</span>
        </div>
      </div>
    </div>
  );
}
