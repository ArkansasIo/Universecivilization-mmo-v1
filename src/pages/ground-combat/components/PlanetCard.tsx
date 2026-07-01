import { TargetPlanet, TerrainType } from '../../../hooks/useGroundCombat';

const TERRAIN_ICONS: Record<TerrainType, string> = {
  urban: 'ri-building-4-line',
  jungle: 'ri-plant-line',
  desert: 'ri-sun-line',
  arctic: 'ri-temp-cold-line',
  'orbital-station': 'ri-space-ship-line',
  underground: 'ri-map-pin-line',
  volcanic: 'ri-fire-line',
};

const TERRAIN_LABELS: Record<TerrainType, string> = {
  urban: 'Urban',
  jungle: 'Jungle',
  desert: 'Desert',
  arctic: 'Arctic',
  'orbital-station': 'Orbital Station',
  underground: 'Underground',
  volcanic: 'Volcanic',
};

interface Props {
  planet: TargetPlanet;
  selected: boolean;
  onSelect: () => void;
}

export default function PlanetCard({ planet, selected, onSelect }: Props) {
  const defColor =
    planet.defenseRating >= 80 ? 'text-red-400' :
    planet.defenseRating >= 55 ? 'text-amber-400' :
    'text-emerald-400';

  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 ${
        selected
          ? 'border-amber-500 shadow-lg shadow-amber-500/20'
          : 'border-slate-700 hover:border-slate-500'
      }`}
    >
      {/* Planet image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={planet.image}
          alt={planet.name}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        {selected && (
          <div className="absolute top-2 right-2 bg-amber-500 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
            Selected
          </div>
        )}
        <div className="absolute bottom-2 left-3 right-3">
          <div className="text-white font-bold text-sm">{planet.name}</div>
          <div className="text-slate-400 text-xs">{planet.system} · {planet.coordinates}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-slate-800/90 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-xs">Faction</span>
          <span className="text-slate-200 text-xs font-medium">{planet.faction}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-xs">Terrain</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className={`${TERRAIN_ICONS[planet.terrain]} text-cyan-400 text-xs`} />
            </div>
            <span className="text-cyan-400 text-xs">{TERRAIN_LABELS[planet.terrain]}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-xs">Defense</span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  planet.defenseRating >= 80 ? 'bg-red-500' :
                  planet.defenseRating >= 55 ? 'bg-amber-500' :
                  'bg-emerald-500'
                }`}
                style={{ width: `${planet.defenseRating}%` }}
              />
            </div>
            <span className={`text-xs font-bold ${defColor}`}>{planet.defenseRating}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-xs">Garrison</span>
          <span className="text-rose-400 text-xs font-medium">{planet.garrisonStrength.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-xs">Strategic Value</span>
          <span className="text-amber-400 text-xs font-bold">{planet.strategicValue}/100</span>
        </div>
      </div>
    </div>
  );
}
