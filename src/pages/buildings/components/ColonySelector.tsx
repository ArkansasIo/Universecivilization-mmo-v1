import { useState } from 'react';

export interface Planet {
  id: number;
  name: string;
  planet_type: string;
  position_galaxy: number;
  position_system: number;
  position_planet: number;
  is_capital: boolean;
  is_homeworld: boolean;
  fields_used: number;
  fields_max: number;
  diameter: number;
  temperature: number;
  image_url: string | null;
  coordinates: string | null;
}

interface ColonySelectorProps {
  planets: Planet[];
  selectedPlanetId: number | undefined;
  onSelect: (id: number) => void;
}

const planetTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  terrestrial: { bg: 'rgba(52,211,153,0.1)', text: '#34d399', border: 'rgba(52,211,153,0.3)' },
  gas_giant:   { bg: 'rgba(251,191,36,0.1)',  text: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
  ice:         { bg: 'rgba(147,197,253,0.1)', text: '#93c5fd', border: 'rgba(147,197,253,0.3)' },
  desert:      { bg: 'rgba(252,165,165,0.1)', text: '#fca5a5', border: 'rgba(252,165,165,0.3)' },
  ocean:       { bg: 'rgba(56,189,248,0.1)',  text: '#38bdf8', border: 'rgba(56,189,248,0.3)' },
  volcanic:    { bg: 'rgba(251,113,133,0.1)', text: '#fb7185', border: 'rgba(251,113,133,0.3)' },
  barren:      { bg: 'rgba(156,163,175,0.1)', text: '#9ca3af', border: 'rgba(156,163,175,0.3)' },
};

const getPlanetColor = (type: string) =>
  planetTypeColors[type] ?? planetTypeColors.barren;

const planetImages: Record<string, string> = {
  terrestrial: 'https://readdy.ai/api/search-image?query=lush%20green%20terrestrial%20planet%20from%20space%20blue%20atmosphere%20white%20clouds%20continents%20sci-fi%20realistic&width=80&height=80&seq=colony_terrestrial&orientation=squarish',
  gas_giant: 'https://readdy.ai/api/search-image?query=massive%20golden%20gas%20giant%20planet%20swirling%20yellow%20orange%20storms%20rings%20sci-fi%20space%20realistic&width=80&height=80&seq=colony_gas_giant&orientation=squarish',
  ice: 'https://readdy.ai/api/search-image?query=frozen%20ice%20planet%20white%20blue%20glaciers%20frozen%20surface%20sci-fi%20space%20close%20up%20realistic&width=80&height=80&seq=colony_ice&orientation=squarish',
  desert: 'https://readdy.ai/api/search-image?query=barren%20desert%20planet%20red%20orange%20sandy%20surface%20craters%20sci-fi%20space%20realistic&width=80&height=80&seq=colony_desert&orientation=squarish',
  ocean: 'https://readdy.ai/api/search-image?query=deep%20ocean%20water%20planet%20blue%20teal%20covered%20in%20water%20sci-fi%20space%20realistic&width=80&height=80&seq=colony_ocean&orientation=squarish',
  volcanic: 'https://readdy.ai/api/search-image?query=volcanic%20lava%20planet%20glowing%20magma%20eruptions%20fiery%20sci-fi%20space%20realistic%20dark&width=80&height=80&seq=colony_volcanic&orientation=squarish',
  barren: 'https://readdy.ai/api/search-image?query=barren%20rocky%20grey%20moon-like%20lifeless%20planet%20craters%20sci-fi%20space%20realistic&width=80&height=80&seq=colony_barren&orientation=squarish',
};

const getPlanetImage = (planet: Planet) =>
  planet.image_url || planetImages[planet.planet_type] || planetImages.barren;

export default function ColonySelector({ planets, selectedPlanetId, onSelect }: ColonySelectorProps) {
  const [open, setOpen] = useState(false);
  const selected = planets.find(p => p.id === selectedPlanetId);

  if (planets.length === 0) return null;

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap"
        style={{
          background: 'rgba(10,15,30,0.9)',
          border: '1px solid rgba(0,212,255,0.3)',
          minWidth: 240,
        }}
      >
        {selected ? (
          <>
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={getPlanetImage(selected)}
                alt={selected.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white">{selected.name || `Planet ${selected.id}`}</span>
                {selected.is_capital && (
                  <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: 'rgba(0,212,255,0.2)', color: '#00d4ff' }}>
                    Capital
                  </span>
                )}
                {selected.is_homeworld && !selected.is_capital && (
                  <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: 'rgba(52,211,153,0.2)', color: '#34d399' }}>
                    Home
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                [{selected.position_galaxy}:{selected.position_system}:{selected.position_planet}] · {selected.fields_used ?? 0}/{selected.fields_max ?? 163} fields
              </div>
            </div>
            {open ? <i className="ri-arrow-up-s-line text-cyan-400 flex-shrink-0"></i> : <i className="ri-arrow-down-s-line text-cyan-400 flex-shrink-0"></i>}
          </>
        ) : (
          <span className="text-gray-400 text-sm">Select a colony...</span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute top-full left-0 mt-2 z-50 rounded-xl overflow-hidden"
            style={{
              background: 'rgba(8,12,28,0.98)',
              border: '1px solid rgba(0,212,255,0.25)',
              minWidth: 340,
              maxHeight: 420,
              overflowY: 'auto',
              boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
            }}
          >
            <div className="p-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Your Colonies</p>
              <p className="text-xs text-gray-600 mt-0.5">{planets.length} planet{planets.length !== 1 ? 's' : ''} under control</p>
            </div>

            <div className="p-2 space-y-1">
              {planets.map(planet => {
                const isActive = planet.id === selectedPlanetId;
                const col = getPlanetColor(planet.planet_type);
                return (
                  <button
                    key={planet.id}
                    onClick={() => { onSelect(planet.id); setOpen(false); }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer text-left"
                    style={{
                      background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                      border: isActive ? '1px solid rgba(0,212,255,0.3)' : '1px solid transparent',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                    }}
                    onMouseLeave={e => {
                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    }}
                  >
                    {/* Planet thumb */}
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2"
                      style={{ ringColor: isActive ? '#00d4ff' : 'transparent', outline: isActive ? '2px solid rgba(0,212,255,0.5)' : '2px solid transparent' }}>
                      <img
                        src={getPlanetImage(planet)}
                        alt={planet.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-sm font-bold text-white truncate">{planet.name || `Planet ${planet.id}`}</span>
                        {planet.is_capital && (
                          <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-xs font-bold"
                            style={{ background: 'rgba(0,212,255,0.2)', color: '#00d4ff' }}>Capital</span>
                        )}
                        {planet.is_homeworld && !planet.is_capital && (
                          <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-xs font-bold"
                            style={{ background: 'rgba(52,211,153,0.2)', color: '#34d399' }}>Home</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        [{planet.position_galaxy}:{planet.position_system}:{planet.position_planet}]
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="px-1.5 py-0.5 rounded text-xs capitalize"
                          style={{ background: col.bg, color: col.text, border: `1px solid ${col.border}` }}
                        >
                          {(planet.planet_type || 'unknown').replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-gray-600">
                          {planet.fields_used ?? 0}/{planet.fields_max ?? 163} fields
                        </span>
                        {planet.diameter ? (
                          <span className="text-xs text-gray-600">{planet.diameter.toLocaleString()} km</span>
                        ) : null}
                      </div>
                    </div>

                    {/* Active checkmark */}
                    {isActive && (
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <i className="ri-checkbox-circle-fill text-cyan-400 text-lg"></i>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}