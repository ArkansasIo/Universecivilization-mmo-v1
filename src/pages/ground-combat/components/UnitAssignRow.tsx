import { useState } from 'react';

const RARITY_COLORS: Record<string, string> = {
  Common: 'text-slate-400 border-slate-600',
  Uncommon: 'text-emerald-400 border-emerald-700',
  Rare: 'text-sky-400 border-sky-700',
  Epic: 'text-violet-400 border-violet-700',
  Legendary: 'text-amber-400 border-amber-700',
  Transcendent: 'text-pink-400 border-pink-700',
};

const ROLE_LABELS: Record<string, string> = {
  vanguard: 'Vanguard',
  'shock-assault': 'Shock Assault',
  'special-ops': 'Special Ops',
  'fire-support': 'Fire Support',
  command: 'Command',
  medic: 'Medic',
  engineer: 'Engineer',
  reserve: 'Reserve',
};

const ROLE_COLORS: Record<string, string> = {
  vanguard: 'text-amber-400 bg-amber-400/10',
  'shock-assault': 'text-red-400 bg-red-400/10',
  'special-ops': 'text-violet-400 bg-violet-400/10',
  'fire-support': 'text-orange-400 bg-orange-400/10',
  command: 'text-sky-400 bg-sky-400/10',
  medic: 'text-emerald-400 bg-emerald-400/10',
  engineer: 'text-cyan-400 bg-cyan-400/10',
  reserve: 'text-slate-400 bg-slate-400/10',
};

interface UnitRow {
  unitId: string;
  unitName: string;
  unitClass: string;
  sector: string;
  count: number;
  combatPower: number;
  specialAbility: string;
  role: string;
  icon: string;
  rarity: string;
}

interface Props {
  unit: UnitRow;
  assigned: number;
  onAssign: (count: number) => void;
  onRemove: () => void;
}

export default function UnitAssignRow({ unit, assigned, onAssign, onRemove }: Props) {
  const [inputVal, setInputVal] = useState(assigned || '');
  const isAssigned = assigned > 0;

  const handleSet = (val: number) => {
    const clamped = Math.max(0, Math.min(val, unit.count));
    setInputVal(clamped);
    if (clamped === 0) onRemove();
    else onAssign(clamped);
  };

  return (
    <div className={`rounded-xl border transition-all duration-200 ${
      isAssigned ? 'border-amber-500/50 bg-amber-500/5' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
    }`}>
      <div className="p-4 flex items-center gap-4">
        {/* Icon */}
        <div className={`w-11 h-11 flex items-center justify-center rounded-lg border ${RARITY_COLORS[unit.rarity] || 'text-slate-400 border-slate-600'} bg-slate-900/60 flex-shrink-0`}>
          <i className={`${unit.icon} text-xl`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-100 font-semibold text-sm">{unit.unitName}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RARITY_COLORS[unit.rarity]?.split(' ')[0] || 'text-slate-400'}`}>
              {unit.rarity}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[unit.role] || 'text-slate-400 bg-slate-700/50'}`}>
              {ROLE_LABELS[unit.role] || unit.role}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-slate-500 text-xs">{unit.sector}</span>
            <span className="text-slate-600 text-xs">·</span>
            <span className="text-slate-500 text-xs">Combat Power: <span className="text-rose-400 font-bold">{unit.combatPower}</span></span>
            <span className="text-slate-600 text-xs">·</span>
            <span className="text-amber-400/80 text-xs italic">{unit.specialAbility}</span>
          </div>
        </div>

        {/* Available count */}
        <div className="text-center flex-shrink-0 hidden sm:block">
          <div className="text-xs text-slate-500 mb-0.5">Available</div>
          <div className="text-emerald-400 font-bold text-sm">{unit.count.toLocaleString()}</div>
        </div>

        {/* Assignment controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => handleSet((assigned || 0) - Math.max(1, Math.floor(unit.count * 0.05)))}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors cursor-pointer"
          >
            <i className="ri-subtract-line text-sm" />
          </button>
          <input
            type="number"
            value={inputVal}
            min={0}
            max={unit.count}
            onChange={(e) => {
              setInputVal(e.target.value as unknown as number);
              handleSet(parseInt(e.target.value, 10) || 0);
            }}
            className="w-20 text-center bg-slate-900 border border-slate-600 rounded-lg text-slate-200 text-sm py-1 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={() => handleSet((assigned || 0) + Math.max(1, Math.floor(unit.count * 0.05)))}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors cursor-pointer"
          >
            <i className="ri-add-line text-sm" />
          </button>
          <button
            onClick={() => handleSet(unit.count)}
            className="text-xs px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 transition-colors cursor-pointer whitespace-nowrap"
          >
            All
          </button>
          {isAssigned && (
            <button
              onClick={onRemove}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-sm" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
