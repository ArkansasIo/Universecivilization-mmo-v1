import { useState } from 'react';
import { RACES, getRaceById, type RaceDefinition, type RaceId } from '@/data/playerRaces';
import { useAuth } from '@/contexts/AuthContext';

interface CompareTraitsModalProps {
  onClose: () => void;
  initialRaceId?: RaceId;
}

const traitColorMap: Record<string, { bar: string; text: string }> = {
  strength: { bar: 'bg-gradient-to-r from-red-600 to-red-400', text: 'text-red-400' },
  intelligence: { bar: 'bg-gradient-to-r from-cyan-500 to-cyan-300', text: 'text-cyan-400' },
  agility: { bar: 'bg-gradient-to-r from-emerald-500 to-emerald-300', text: 'text-emerald-400' },
  endurance: { bar: 'bg-gradient-to-r from-orange-500 to-orange-300', text: 'text-orange-400' },
  charisma: { bar: 'bg-gradient-to-r from-pink-500 to-pink-300', text: 'text-pink-400' },
  perception: { bar: 'bg-gradient-to-r from-yellow-500 to-yellow-300', text: 'text-yellow-400' },
};

const bonusMeta: Record<string, { icon: string; color: string; label: string }> = {
  mining: { icon: 'ri-hammer-line', color: 'text-yellow-400', label: 'Mining' },
  research: { icon: 'ri-flask-line', color: 'text-cyan-400', label: 'Research' },
  combat: { icon: 'ri-sword-line', color: 'text-red-400', label: 'Combat' },
  construction: { icon: 'ri-building-4-line', color: 'text-emerald-400', label: 'Construction' },
  trade: { icon: 'ri-exchange-dollar-line', color: 'text-amber-400', label: 'Trade' },
  exploration: { icon: 'ri-compass-3-line', color: 'text-purple-400', label: 'Exploration' },
};

export default function CompareTraitsModal({ onClose, initialRaceId }: CompareTraitsModalProps) {
  const { profile } = useAuth();
  const playerRaceId = (profile?.race as RaceId) || 'terran';
  const [leftRaceId, setLeftRaceId] = useState<RaceId>(initialRaceId || 'terran');
  const [rightRaceId, setRightRaceId] = useState<RaceId>(playerRaceId);

  const leftRace = getRaceById(leftRaceId);
  const rightRace = getRaceById(rightRaceId);

  function TraitBar({ name, valueL, valueR }: { name: string; valueL: number; valueR: number }) {
    const colors = traitColorMap[name] || traitColorMap.strength;
    const label = name.charAt(0).toUpperCase() + name.slice(1);
    const diff = valueL - valueR;
    return (
      <div className="mb-3 last:mb-0">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-[10px] font-semibold ${colors.text}`}>{label}</span>
          <span className="text-[10px] text-[#E8E0D5]/30 font-mono">
            {valueL} <span className="text-[#E8E0D5]/10">vs</span> {valueR}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex-1 h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
            <div className={`h-full ${colors.bar} rounded-full transition-all duration-500`} style={{ width: `${valueL}%` }} />
          </div>
          {diff !== 0 && (
            <span className={`text-[9px] font-mono font-bold ${diff > 0 ? 'text-emerald-400' : 'text-red-400'} w-8 text-left`}>
              {diff > 0 ? '+' : ''}{diff}
            </span>
          )}
        </div>
      </div>
    );
  }

  function RaceSelector({ value, onChange, excludeId }: { value: RaceId; onChange: (id: RaceId) => void; excludeId: RaceId }) {
    return (
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as RaceId)}
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-[#E8E0D5] focus:outline-none focus:border-purple-400/40 transition-colors appearance-none cursor-pointer"
        >
          {RACES.filter((r) => r.id !== excludeId).map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-[#E8E0D5]/30 pointer-events-none text-sm" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-[#0D0D1A] border border-white/[0.08] rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0D0D1A] border-b border-white/[0.06] px-6 py-4 z-10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-heading text-[#E8E0D5]">Race Comparison</h2>
            <p className="text-xs text-[#E8E0D5]/30 mt-0.5">Side-by-side trait, bonus, and identity analysis</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-[#E8E0D5]/40 hover:text-[#E8E0D5] hover:bg-white/[0.1] transition-colors"
          >
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="p-6">
          {/* Selectors */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <RaceSelector value={leftRaceId} onChange={setLeftRaceId} excludeId={rightRaceId} />
            <RaceSelector value={rightRaceId} onChange={setRightRaceId} excludeId={leftRaceId} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Left race */}
            <RaceDetailPanel race={leftRace} />
            {/* Right race */}
            <RaceDetailPanel race={rightRace} />
          </div>

          {/* Shared comparison: RPG Traits */}
          <div className="mt-6 bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
            <h3 className="text-xs uppercase tracking-widest text-[#E8E0D5]/30 font-bold mb-4">
              Genetic Attribute Comparison
            </h3>
            <div className="grid grid-cols-2 gap-x-8">
              {(Object.keys(traitColorMap) as string[]).map((name) => (
                <TraitBar
                  key={name}
                  name={name}
                  valueL={leftRace.traits[name as keyof typeof leftRace.traits]}
                  valueR={rightRace.traits[name as keyof typeof rightRace.traits]}
                />
              ))}
            </div>
            {/* Average */}
            <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-2 gap-x-8">
              <div className="flex justify-between text-xs">
                <span className="text-[#E8E0D5]/30">Avg Rating</span>
                <span className="text-white font-bold font-mono">
                  {Math.round(Object.values(leftRace.traits).reduce((a, b) => a + b, 0) / 6)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#E8E0D5]/30">Avg Rating</span>
                <span className="text-white font-bold font-mono">
                  {Math.round(Object.values(rightRace.traits).reduce((a, b) => a + b, 0) / 6)}
                </span>
              </div>
            </div>
          </div>

          {/* Empire bonus comparison */}
          <div className="mt-4 bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
            <h3 className="text-xs uppercase tracking-widest text-[#E8E0D5]/30 font-bold mb-4">
              Empire Modifier Comparison
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {(Object.keys(bonusMeta) as string[]).map((key) => {
                const meta = bonusMeta[key];
                const vL = leftRace.bonuses[key as keyof typeof leftRace.bonuses];
                const vR = rightRace.bonuses[key as keyof typeof rightRace.bonuses];
                const diff = vL - vR;
                return (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <i className={`${meta.icon} ${meta.color} text-sm`} />
                      <span className="text-xs text-[#E8E0D5]/50">{meta.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono font-bold ${vL >= vR ? 'text-emerald-400' : 'text-red-400'}`}>
                        {vL > 0 ? '+' : ''}{vL}%
                      </span>
                      <span className="text-[10px] text-[#E8E0D5]/10">vs</span>
                      <span className={`text-xs font-mono font-bold ${vR >= vL ? 'text-emerald-400' : 'text-red-400'}`}>
                        {vR > 0 ? '+' : ''}{vR}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RaceDetailPanel({ race }: { race: RaceDefinition }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${race.color} px-4 py-3`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <i className={`${race.icon} text-base text-white`} />
          </div>
          <div>
            <h3 className="text-sm font-heading text-white">{race.name}</h3>
            <p className="text-[10px] text-white/70">{race.category}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Lore */}
        <p className="text-[11px] text-[#E8E0D5]/40 italic leading-relaxed">
          &ldquo;{race.lore}&rdquo;
        </p>

        {/* Vital stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/[0.03] rounded-lg px-3 py-2">
            <p className="text-[9px] text-[#E8E0D5]/20">Homeworld</p>
            <p className="text-[11px] text-[#E8E0D5]/60">{race.homeworldType}</p>
          </div>
          <div className="bg-white/[0.03] rounded-lg px-3 py-2">
            <p className="text-[9px] text-[#E8E0D5]/20">Lifespan</p>
            <p className="text-[11px] text-[#E8E0D5]/60">{race.lifespan >= 500 ? '∞' : ''}{race.lifespan} yrs</p>
          </div>
          <div className="bg-white/[0.03] rounded-lg px-3 py-2">
            <p className="text-[9px] text-[#E8E0D5]/20">Reproduction</p>
            <p className="text-[11px] text-[#E8E0D5]/60">{race.reproductionRate.toFixed(1)}x</p>
          </div>
          <div className="bg-white/[0.03] rounded-lg px-3 py-2">
            <p className="text-[9px] text-[#E8E0D5]/20">Adaptability</p>
            <p className="text-[11px] text-[#E8E0D5]/60">{race.adaptability}%</p>
          </div>
        </div>

        {/* Bonus */}
        <div className={`bg-gradient-to-br ${race.bgAccent} border ${race.borderAccent} rounded-lg p-3`}>
          <p className={`text-[11px] font-bold text-${race.accent}-400`}>{race.bonus}</p>
          <p className={`text-[10px] text-${race.accent}-300/70 mt-0.5`}>{race.bonusDetails}</p>
        </div>

        {/* Special trait */}
        <div className="bg-amber-400/5 border border-amber-400/15 rounded-lg p-3">
          <p className="text-[10px] text-amber-400/60 font-semibold mb-0.5">Starting Trait</p>
          <p className="text-[11px] text-amber-200/70">{race.specialStartingTrait}</p>
        </div>

        {/* Resource modifiers */}
        <div className="flex gap-2">
          <div className="flex-1 text-center bg-white/[0.03] rounded-lg py-1.5">
            <p className="text-[8px] text-[#E8E0D5]/20">Metal</p>
            <p className={`text-[11px] font-bold ${race.metalBonus >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
              {race.metalBonus > 0 ? '+' : ''}{race.metalBonus}
            </p>
          </div>
          <div className="flex-1 text-center bg-white/[0.03] rounded-lg py-1.5">
            <p className="text-[8px] text-[#E8E0D5]/20">Crystal</p>
            <p className={`text-[11px] font-bold ${race.crystalBonus >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
              {race.crystalBonus > 0 ? '+' : ''}{race.crystalBonus}
            </p>
          </div>
          <div className="flex-1 text-center bg-white/[0.03] rounded-lg py-1.5">
            <p className="text-[8px] text-[#E8E0D5]/20">Deuterium</p>
            <p className={`text-[11px] font-bold ${race.deuteriumBonus >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
              {race.deuteriumBonus > 0 ? '+' : ''}{race.deuteriumBonus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}