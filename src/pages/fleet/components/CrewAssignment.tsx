import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { militaryUnits } from '../../../data/units/military';
import { UNIT_CLASS_GRADIENTS } from '../../../data/units/types';
import { calculateUnitPower } from '../../../hooks/useUnitSystem';

// ── Ship roster available for crew assignment ──────────────
interface CrewableShip {
  id: string;
  name: string;
  class: string;
  icon: string;
  slots: CrewSlot[];
}

interface CrewSlot {
  role: 'pilot' | 'gunner' | 'officer' | 'engineer' | 'special-ops';
  label: string;
  icon: string;
  maxSlots: number;
  statBonus: string;
  assignedUnitId: string | null;
}

const CREW_STAT_BONUSES: Record<string, string> = {
  pilot: '+70% Fighter effectiveness · +50% Evasion',
  gunner: '+35% Weapon damage · +25% Reload speed',
  officer: '+100% Fleet coordination · +75% Tactical advantage',
  engineer: '+55% Construction speed · +40% Repair efficiency',
  'special-ops': '+90% Combat effectiveness · +70% Stealth',
};

const CREW_UNIT_FILTER: Record<string, string[]> = {
  pilot: ['starfighter-pilot'],
  gunner: ['fleet-gunner'],
  officer: ['tactical-officer', 'fleet-admiral'],
  engineer: ['structural-engineer', 'master-engineer'],
  'special-ops': ['commando', 'elite-marine', 'field-agent'],
};

// Mock player ships roster
const PLAYER_SHIPS: CrewableShip[] = [
  {
    id: 'ship-001', name: 'INS Sovereignty', class: 'Battlecruiser', icon: 'ri-ship-2-line',
    slots: [
      { role: 'pilot', label: 'Pilot', icon: 'ri-flight-takeoff-line', maxSlots: 1, statBonus: CREW_STAT_BONUSES.pilot, assignedUnitId: null },
      { role: 'gunner', label: 'Chief Gunner', icon: 'ri-focus-3-line', maxSlots: 2, statBonus: CREW_STAT_BONUSES.gunner, assignedUnitId: null },
      { role: 'officer', label: 'Tactical Officer', icon: 'ri-user-star-line', maxSlots: 1, statBonus: CREW_STAT_BONUSES.officer, assignedUnitId: null },
      { role: 'engineer', label: 'Chief Engineer', icon: 'ri-tools-line', maxSlots: 1, statBonus: CREW_STAT_BONUSES.engineer, assignedUnitId: null },
    ]
  },
  {
    id: 'ship-002', name: 'ISS Phantom Strike', class: 'Stealth Destroyer', icon: 'ri-rocket-line',
    slots: [
      { role: 'pilot', label: 'Pilot', icon: 'ri-flight-takeoff-line', maxSlots: 1, statBonus: CREW_STAT_BONUSES.pilot, assignedUnitId: null },
      { role: 'special-ops', label: 'Special Ops Leader', icon: 'ri-user-search-line', maxSlots: 2, statBonus: CREW_STAT_BONUSES['special-ops'], assignedUnitId: null },
      { role: 'gunner', label: 'Weapons Officer', icon: 'ri-focus-3-line', maxSlots: 1, statBonus: CREW_STAT_BONUSES.gunner, assignedUnitId: null },
    ]
  },
  {
    id: 'ship-003', name: 'CCS Eternal Flame', class: 'Command Cruiser', icon: 'ri-radar-line',
    slots: [
      { role: 'officer', label: 'Fleet Admiral', icon: 'ri-user-star-line', maxSlots: 1, statBonus: CREW_STAT_BONUSES.officer, assignedUnitId: null },
      { role: 'pilot', label: 'Helm Officer', icon: 'ri-flight-takeoff-line', maxSlots: 2, statBonus: CREW_STAT_BONUSES.pilot, assignedUnitId: null },
      { role: 'gunner', label: 'Weapons Battery Chief', icon: 'ri-focus-3-line', maxSlots: 3, statBonus: CREW_STAT_BONUSES.gunner, assignedUnitId: null },
      { role: 'engineer', label: 'Engineering Team', icon: 'ri-tools-line', maxSlots: 2, statBonus: CREW_STAT_BONUSES.engineer, assignedUnitId: null },
    ]
  },
  {
    id: 'ship-004', name: 'ASF Shadow Wing', class: 'Fighter Squadron', icon: 'ri-plane-line',
    slots: [
      { role: 'pilot', label: 'Ace Pilot', icon: 'ri-flight-takeoff-line', maxSlots: 3, statBonus: CREW_STAT_BONUSES.pilot, assignedUnitId: null },
      { role: 'special-ops', label: 'Boarding Team', icon: 'ri-user-search-line', maxSlots: 1, statBonus: CREW_STAT_BONUSES['special-ops'], assignedUnitId: null },
    ]
  },
];

// Unit role mapping
function getUnitRole(unitId: string): string {
  for (const [role, ids] of Object.entries(CREW_UNIT_FILTER)) {
    if (ids.includes(unitId)) return role;
  }
  return '';
}

export default function CrewAssignment() {
  const [ships, setShips] = useState<CrewableShip[]>(PLAYER_SHIPS);
  const [selectedShipId, setSelectedShipId] = useState<string>(PLAYER_SHIPS[0].id);
  const [assigningSlot, setAssigningSlot] = useState<{ shipId: string; slotRole: string } | null>(null);
  const [notification, setNotification] = useState('');

  const selectedShip = ships.find(s => s.id === selectedShipId) || ships[0];

  // Military units eligible for crew
  const eligibleUnits = useMemo(() => militaryUnits.filter(u =>
    ['trained', 'veteran', 'elite', 'deployed'].includes(u.status) &&
    u.available > 0 &&
    ['starfighter-pilot', 'fleet-gunner', 'tactical-officer', 'fleet-admiral',
     'structural-engineer', 'master-engineer', 'commando', 'elite-marine', 'field-agent', 'psi-operative'].includes(u.id)
  ), []);

  // Units for current slot filter
  const crewCandidates = useMemo(() => {
    if (!assigningSlot) return [];
    const allowed = CREW_UNIT_FILTER[assigningSlot.slotRole] || [];
    return allowed.length > 0
      ? eligibleUnits.filter(u => allowed.includes(u.id))
      : eligibleUnits;
  }, [assigningSlot, eligibleUnits]);

  function assignCrew(unitId: string) {
    if (!assigningSlot) return;
    const unit = militaryUnits.find(u => u.id === unitId);
    setShips(prev => prev.map(ship => {
      if (ship.id !== assigningSlot.shipId) return ship;
      return {
        ...ship,
        slots: ship.slots.map(slot => {
          if (slot.role !== assigningSlot.slotRole) return slot;
          return { ...slot, assignedUnitId: unitId };
        })
      };
    }));
    setNotification(`${unit?.name} assigned to ${selectedShip.name}`);
    setTimeout(() => setNotification(''), 3000);
    setAssigningSlot(null);
  }

  function removeCrewSlot(shipId: string, slotRole: string) {
    setShips(prev => prev.map(ship => {
      if (ship.id !== shipId) return ship;
      return {
        ...ship,
        slots: ship.slots.map(slot =>
          slot.role === slotRole ? { ...slot, assignedUnitId: null } : slot
        )
      };
    }));
  }

  // Calculate total stat bonus for a ship
  function getShipBonusSummary(ship: CrewableShip): string[] {
    const bonuses: string[] = [];
    ship.slots.forEach(slot => {
      if (slot.assignedUnitId) {
        bonuses.push(slot.statBonus.split(' · ')[0]);
      }
    });
    return bonuses;
  }

  const roleColors: Record<string, string> = {
    pilot: 'border-sky-500/50 bg-sky-500/10 text-sky-400',
    gunner: 'border-red-500/50 bg-red-500/10 text-red-400',
    officer: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
    engineer: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
    'special-ops': 'border-violet-500/50 bg-violet-500/10 text-violet-400',
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Crew Assignment</h2>
          <p className="text-sm text-gray-400">Assign trained military units to ships to boost their combat stats</p>
        </div>
        <Link
          to="/units"
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 rounded-xl text-sm font-semibold hover:bg-cyan-500/30 transition-all cursor-pointer whitespace-nowrap"
        >
          <i className="ri-team-line w-4 h-4 flex items-center justify-center" />
          Manage Personnel
        </Link>
      </div>

      {/* Notification */}
      {notification && (
        <div className="flex items-center gap-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl px-4 py-3 mb-5">
          <i className="ri-checkbox-circle-fill text-emerald-400 w-4 h-4 flex items-center justify-center" />
          <span className="text-sm text-emerald-300">{notification}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Ship List */}
        <div className="lg:w-64 flex-shrink-0 space-y-2">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Ships</h3>
          {ships.map(ship => {
            const assigned = ship.slots.filter(s => s.assignedUnitId).length;
            const total = ship.slots.length;
            return (
              <button
                key={ship.id}
                onClick={() => setSelectedShipId(ship.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedShipId === ship.id
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-slate-700/60 bg-[#0B1929] hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <i className={`${ship.icon} text-cyan-400 w-4 h-4 flex items-center justify-center`} />
                  <span className="text-sm font-semibold text-white truncate">{ship.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{ship.class}</span>
                  <span className={`text-xs font-bold ${assigned === total ? 'text-emerald-400' : assigned > 0 ? 'text-amber-400' : 'text-gray-600'}`}>
                    {assigned}/{total} crew
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Ship Detail */}
        <div className="flex-1 min-w-0">
          <div className="bg-[#0B1929] border border-cyan-400/30 rounded-2xl overflow-hidden">
            {/* Ship Header */}
            <div className="p-5 border-b border-slate-700/60">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/40 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className={`${selectedShip.icon} text-2xl text-cyan-400 w-7 h-7 flex items-center justify-center`} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{selectedShip.name}</h3>
                  <div className="text-sm text-gray-400">{selectedShip.class}</div>
                </div>
              </div>

              {/* Active bonuses from crew */}
              {getShipBonusSummary(selectedShip).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {getShipBonusSummary(selectedShip).map((bonus, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 rounded-lg">
                      {bonus}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Crew Slots */}
            <div className="p-5">
              <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4">Crew Stations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedShip.slots.map((slot) => {
                  const assignedUnit = slot.assignedUnitId
                    ? militaryUnits.find(u => u.id === slot.assignedUnitId)
                    : null;
                  const roleStyle = roleColors[slot.role] || 'border-gray-500/40 bg-slate-800/60 text-gray-400';

                  return (
                    <div key={slot.role} className={`border rounded-xl p-4 ${assignedUnit ? roleStyle : 'border-slate-700/60 bg-slate-800/30'}`}>
                      {/* Slot Header */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${assignedUnit ? roleStyle : 'border-slate-600 bg-slate-800'}`}>
                          <i className={`${slot.icon} text-sm w-4 h-4 flex items-center justify-center`} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{slot.label}</div>
                          <div className="text-xs text-gray-600 capitalize">{slot.role} · {slot.maxSlots} max</div>
                        </div>
                      </div>

                      {/* Assigned Unit */}
                      {assignedUnit ? (
                        <div className="mb-3">
                          <div className="flex items-center gap-2 bg-slate-900/60 rounded-lg p-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${UNIT_CLASS_GRADIENTS[assignedUnit.class] || 'from-gray-500 to-slate-600'} flex items-center justify-center flex-shrink-0`}>
                              <i className={`${assignedUnit.icon} text-xs text-white w-4 h-4 flex items-center justify-center`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-white truncate">{assignedUnit.name}</div>
                              <div className="text-xs text-gray-500">Lv.{assignedUnit.level} · {calculateUnitPower(assignedUnit).toLocaleString()} PWR</div>
                            </div>
                            <button
                              onClick={() => removeCrewSlot(selectedShip.id, slot.role)}
                              className="w-6 h-6 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-full flex items-center justify-center cursor-pointer text-xs"
                            >
                              <i className="ri-close-line w-3 h-3 flex items-center justify-center" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-3 py-3 border border-dashed border-slate-600/50 rounded-lg text-center">
                          <span className="text-xs text-gray-600">No crew assigned</span>
                        </div>
                      )}

                      {/* Stat Bonus */}
                      <div className="text-xs text-gray-600 mb-3 leading-relaxed">{slot.statBonus}</div>

                      {/* Assign Button */}
                      <button
                        onClick={() => setAssigningSlot({ shipId: selectedShip.id, slotRole: slot.role })}
                        className={`w-full py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                          assignedUnit
                            ? 'bg-slate-700/60 border-slate-600 text-gray-400 hover:bg-slate-600'
                            : `${roleStyle} hover:opacity-80`
                        }`}
                      >
                        <i className={`${assignedUnit ? 'ri-swap-line' : 'ri-user-add-line'} mr-1 w-3 h-3 inline-flex items-center justify-center`} />
                        {assignedUnit ? 'Replace Crew' : 'Assign Crew'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unit Picker Modal */}
      {assigningSlot && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setAssigningSlot(null)}
        >
          <div
            className="bg-[#0B1929] border border-cyan-400/30 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-700/60 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Select Crew Member</h3>
                <p className="text-sm text-gray-400 capitalize">Role: {assigningSlot.slotRole}</p>
              </div>
              <button
                onClick={() => setAssigningSlot(null)}
                className="w-9 h-9 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center cursor-pointer"
              >
                <i className="ri-close-line text-white w-5 h-5 flex items-center justify-center" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto">
              {crewCandidates.length === 0 ? (
                <div className="text-center py-8">
                  <i className="ri-user-forbid-line text-3xl text-gray-700 w-8 h-8 mx-auto flex items-center justify-center mb-3" />
                  <p className="text-sm text-gray-500">No eligible units available</p>
                  <p className="text-xs text-gray-600 mt-1">Train {assigningSlot.slotRole} units in the Training Center</p>
                  <Link
                    to="/training-center"
                    className="inline-flex items-center gap-1 mt-3 text-xs text-cyan-400 hover:underline cursor-pointer"
                    onClick={() => setAssigningSlot(null)}
                  >
                    <i className="ri-external-link-line w-3 h-3 flex items-center justify-center" />
                    Go to Training Center
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {crewCandidates.map(unit => {
                    const cg = UNIT_CLASS_GRADIENTS[unit.class] || 'from-gray-500 to-slate-600';
                    const power = calculateUnitPower(unit);
                    return (
                      <button
                        key={unit.id}
                        onClick={() => assignCrew(unit.id)}
                        className="text-left p-4 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 hover:border-cyan-500/40 rounded-xl transition-all cursor-pointer"
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cg} flex items-center justify-center flex-shrink-0`}>
                            <i className={`${unit.icon} text-lg text-white w-6 h-6 flex items-center justify-center`} />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-bold text-white mb-0.5">{unit.name}</div>
                            <div className="text-xs text-gray-500">Lv.{unit.level} · {unit.rarity}</div>
                          </div>
                          <div className="text-xs font-bold text-amber-400">{power.toLocaleString()} PWR</div>
                        </div>
                        <div className="text-xs text-emerald-300 leading-relaxed">
                          {unit.effects.primary[0]}
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
                          <span>Combat: <span className="text-red-400 font-bold">{unit.stats.combat}</span></span>
                          <span>Speed: <span className="text-green-400 font-bold">{unit.stats.speed}</span></span>
                          <span>Available: <span className="text-cyan-400 font-bold">{unit.available}</span></span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
