import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  NINE_UNIVERSES,
  generateGalaxiesForUniverse,
  generateSectorsForGalaxy,
  generateSolarSystemsForSector,
  getCosmicSummary,
} from '@/data/cosmicHierarchy';
import type {
  UniverseData, GalaxyData, SectorData,
} from '@/types/gameTypes';
import {
  GALAXY_CLASS_NAMES, GALAXY_CLASS_COLORS,
  SECURITY_LEVEL_COLORS,
  STAR_CLASS_DEFINITIONS,
} from '@/types/gameTypes';

type ViewLevel = 'universes' | 'galaxies' | 'sectors' | 'systems';

export default function CosmicHierarchyPage() {
  const [viewLevel, setViewLevel] = useState<ViewLevel>('universes');
  const [selectedUniverse, setSelectedUniverse] = useState<UniverseData | null>(null);
  const [selectedGalaxy, setSelectedGalaxy] = useState<GalaxyData | null>(null);
  const [selectedSector, setSelectedSector] = useState<SectorData | null>(null);
  const [galaxyPage, setGalaxyPage] = useState(0);
  const [sectorPage, setSectorPage] = useState(0);
  const [systemPage, setSystemPage] = useState(0);
  const GALAXIES_PER_PAGE = 18;
  const PER_PAGE = 24;

  const summary = useMemo(() => getCosmicSummary(), []);

  const galaxies = useMemo(() => {
    if (!selectedUniverse) return [];
    return generateGalaxiesForUniverse(selectedUniverse);
  }, [selectedUniverse]);

  const sectors = useMemo(() => {
    if (!selectedGalaxy) return [];
    return generateSectorsForGalaxy(selectedGalaxy);
  }, [selectedGalaxy]);

  const solarSystems = useMemo(() => {
    if (!selectedSector) return [];
    return generateSolarSystemsForSector(selectedSector);
  }, [selectedSector]);

  const pagedGalaxies = galaxies.slice(galaxyPage * GALAXIES_PER_PAGE, (galaxyPage + 1) * GALAXIES_PER_PAGE);
  const pagedSectors = sectors.slice(sectorPage * PER_PAGE, (sectorPage + 1) * PER_PAGE);
  const pagedSystems = solarSystems.slice(systemPage * PER_PAGE, (systemPage + 1) * PER_PAGE);

  const navigateTo = (level: ViewLevel, universe?: UniverseData, galaxy?: GalaxyData, sector?: SectorData) => {
    setViewLevel(level);
    if (universe) setSelectedUniverse(universe);
    if (galaxy) setSelectedGalaxy(galaxy);
    if (sector) setSelectedSector(sector);
    setGalaxyPage(0);
    setSectorPage(0);
    setSystemPage(0);
  };

  const universeClassColors: Record<string, string> = {
    'Standard': '#F59E0B', 'Hardcore': '#EF4444', 'Peaceful': '#4ADE80',
    'Chaos': '#FB923C', 'Ancient': '#A78BFA', 'Void': '#7C3AED',
    'Primordial': '#F59E0B', 'Quantum': '#06B6D4', 'Mythic': '#EC4899',
  };

  return (
    <div className="min-h-screen bg-[#08080F]">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0D0D1A] to-[#08080F] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <div className="flex items-center gap-3 mb-2">
            <Link to="/" className="text-[#D4A017]/60 hover:text-[#D4A017] transition-colors">
              <i className="ri-arrow-left-line text-lg"></i>
            </Link>
            <h1 className="text-3xl md:text-4xl font-heading text-[#E8E0D5]">Cosmic Hierarchy</h1>
          </div>
          <p className="text-[#E8E0D5]/50 text-sm md:text-base max-w-2xl">
            Explore the complete cosmic structure — {summary.totalUniverses} Universes, {summary.totalGalaxies.toLocaleString()} Galaxies, with up to 499 Sectors per Galaxy and 1-15 Planets per System.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <button
            onClick={() => navigateTo('universes')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${viewLevel === 'universes' ? 'bg-[#D4A017]/20 text-[#D4A017]' : 'text-[#E8E0D5]/40 hover:text-[#E8E0D5]/70'}`}
          >
            <i className="ri-global-line mr-1"></i>Universes
          </button>
          {selectedUniverse && (
            <>
              <span className="text-[#E8E0D5]/20"><i className="ri-arrow-right-s-line"></i></span>
              <button
                onClick={() => navigateTo('galaxies', selectedUniverse)}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${viewLevel === 'galaxies' ? 'bg-[#D4A017]/20 text-[#D4A017]' : 'text-[#E8E0D5]/40 hover:text-[#E8E0D5]/70'}`}
              >
                <i className="ri-planet-line mr-1"></i>{selectedUniverse.name}
              </button>
            </>
          )}
          {selectedGalaxy && (
            <>
              <span className="text-[#E8E0D5]/20"><i className="ri-arrow-right-s-line"></i></span>
              <button
                onClick={() => navigateTo('sectors', selectedUniverse, selectedGalaxy)}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${viewLevel === 'sectors' ? 'bg-[#D4A017]/20 text-[#D4A017]' : 'text-[#E8E0D5]/40 hover:text-[#E8E0D5]/70'}`}
              >
                <i className="ri-focus-3-line mr-1"></i>{selectedGalaxy.name}
              </button>
            </>
          )}
          {selectedSector && (
            <>
              <span className="text-[#E8E0D5]/20"><i className="ri-arrow-right-s-line"></i></span>
              <span className="px-3 py-1.5 text-[#D4A017] whitespace-nowrap">
                <i className="ri-sun-line mr-1"></i>{selectedSector.name}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        {/* STATS BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {[
            { label: 'Universes', value: summary.totalUniverses, icon: 'ri-global-line' },
            { label: 'Galaxies', value: summary.totalGalaxies, icon: 'ri-planet-line' },
            { label: 'Quadrant Types', value: summary.quadrantTypes, icon: 'ri-focus-3-line' },
            { label: 'Galaxy Classes', value: summary.galaxyClasses, icon: 'ri-stack-line' },
            { label: 'Sector Types', value: summary.sectorTypes, icon: 'ri-layout-grid-line' },
            { label: 'System Types', value: summary.systemTypes, icon: 'ri-sun-line' },
            { label: 'Star Types', value: summary.starTypes, icon: 'ri-star-line' },
            { label: 'Total Players', value: summary.totalPlayers.toLocaleString(), icon: 'ri-user-line' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 text-center">
              <div className="text-[#D4A017] text-lg font-heading">{typeof stat.value === 'number' && stat.value > 999 ? (stat.value / 1000).toFixed(0) + 'K' : stat.value}</div>
              <div className="text-[#E8E0D5]/40 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* UNIVERSES VIEW */}
        {viewLevel === 'universes' && (
          <div>
            <h2 className="text-xl font-heading text-[#E8E0D5] mb-5">The Nine Universes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {NINE_UNIVERSES.map((universe) => (
                <button
                  key={universe.id}
                  onClick={() => navigateTo('galaxies', universe)}
                  className="text-left bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:border-[#D4A017]/30 hover:bg-white/[0.05] transition-all group cursor-pointer w-full"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-heading text-[#E8E0D5] group-hover:text-[#D4A017] transition-colors">{universe.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block" style={{ background: `${universeClassColors[universe.class]}20`, color: universeClassColors[universe.class] }}>
                        {universe.class}
                      </span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#D4A017]/10 text-[#D4A017]">{universe.age}</span>
                  </div>
                  <p className="text-[#E8E0D5]/50 text-sm mb-3 line-clamp-2">{universe.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[
                      { label: 'Density', value: universe.density },
                      { label: 'Hostility', value: universe.hostility },
                      { label: 'Resources', value: universe.resources },
                    ].map((attr) => (
                      <span key={attr.label} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-[#E8E0D5]/40">
                        {attr.label}: {attr.value}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#E8E0D5]/30">
                    <span><i className="ri-planet-line mr-1"></i>{universe.galaxyCount} Galaxies</span>
                    <span><i className="ri-user-line mr-1"></i>{universe.totalPlayers.toLocaleString()} Players</span>
                    <span className="text-[#D4A017]/60 group-hover:text-[#D4A017] transition-colors">
                      Explore <i className="ri-arrow-right-line ml-0.5"></i>
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Features */}
            <div className="mt-10">
              <h3 className="text-lg font-heading text-[#E8E0D5] mb-4">Universe Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(summary.universesByClass).map(([cls, count]) => (
                  <div key={cls} className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${universeClassColors[cls]}20` }}>
                      <span className="text-lg font-heading" style={{ color: universeClassColors[cls] }}>{count}</span>
                    </div>
                    <div>
                      <div className="text-[#E8E0D5] text-sm">{cls}</div>
                      <div className="text-[#E8E0D5]/40 text-xs">{count} Universe{count > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GALAXIES VIEW */}
        {viewLevel === 'galaxies' && selectedUniverse && (
          <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-heading text-[#E8E0D5]">{selectedUniverse.name} — Galaxies</h2>
                <p className="text-[#E8E0D5]/40 text-sm">{galaxies.length} galaxies, showing {pagedGalaxies.length} per page</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setGalaxyPage(Math.max(0, galaxyPage - 1))}
                  disabled={galaxyPage === 0}
                  className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#E8E0D5]/60 hover:text-[#D4A017] disabled:opacity-30 transition-colors"
                >
                  <i className="ri-arrow-left-s-line"></i>
                </button>
                <span className="px-3 py-1 text-xs text-[#E8E0D5]/40 flex items-center">
                  {galaxyPage + 1} / {Math.ceil(galaxies.length / GALAXIES_PER_PAGE)}
                </span>
                <button
                  onClick={() => setGalaxyPage(Math.min(Math.ceil(galaxies.length / GALAXIES_PER_PAGE) - 1, galaxyPage + 1))}
                  disabled={galaxyPage >= Math.ceil(galaxies.length / GALAXIES_PER_PAGE) - 1}
                  className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#E8E0D5]/60 hover:text-[#D4A017] disabled:opacity-30 transition-colors"
                >
                  <i className="ri-arrow-right-s-line"></i>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pagedGalaxies.map((galaxy) => {
                const classColor = GALAXY_CLASS_COLORS[galaxy.galaxyClass] || '#888';
                return (
                  <button
                    key={galaxy.id}
                    onClick={() => navigateTo('sectors', selectedUniverse, galaxy)}
                    className="text-left bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:border-[#D4A017]/20 hover:bg-white/[0.04] transition-all group cursor-pointer w-full"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold shrink-0"
                        style={{ background: `${classColor}20`, color: classColor }}
                      >
                        {galaxy.galaxyClass}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-heading text-[#E8E0D5] group-hover:text-[#D4A017] transition-colors truncate">{galaxy.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-[#E8E0D5]/40">{GALAXY_CLASS_NAMES[galaxy.galaxyClass]}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-[#E8E0D5]/40">{galaxy.galaxyType}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-[#E8E0D5]/40">{galaxy.quadrantType}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#E8E0D5]/30">
                      <span><i className="ri-star-line mr-1"></i>{(galaxy.starCount / 1e9).toFixed(1)}B stars</span>
                      <span><i className="ri-ruler-line mr-1"></i>{galaxy.diameterLy.toLocaleString()} ly</span>
                      <span><i className="ri-shield-line mr-1"></i>{galaxy.resourceRichness}</span>
                      <span className={galaxy.threatLevel >= 8 ? 'text-red-400/60' : ''}>
                        <i className="ri-alert-line mr-1"></i>Threat {galaxy.threatLevel}/10
                      </span>
                    </div>
                    <div className="mt-2 text-[10px] text-[#E8E0D5]/20 flex items-center gap-1">
                      <span>{galaxy.sectorCount} sectors</span>
                      <span>·</span>
                      <span>{galaxy.dominantSpecies}</span>
                      <span>·</span>
                      <span className="text-[#D4A017]/40 group-hover:text-[#D4A017]/80 transition-colors">View <i className="ri-arrow-right-line ml-0.5"></i></span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTORS VIEW */}
        {viewLevel === 'sectors' && selectedGalaxy && (
          <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-heading text-[#E8E0D5]">{selectedGalaxy.name} — Sectors</h2>
                <p className="text-[#E8E0D5]/40 text-sm">{selectedGalaxy.sectorCount} sectors ({selectedGalaxy.maxSectors} max), showing {pagedSectors.length} per page</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSectorPage(Math.max(0, sectorPage - 1))} disabled={sectorPage === 0}
                  className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#E8E0D5]/60 hover:text-[#D4A017] disabled:opacity-30 transition-colors">
                  <i className="ri-arrow-left-s-line"></i>
                </button>
                <span className="px-3 py-1 text-xs text-[#E8E0D5]/40 flex items-center">{sectorPage + 1} / {Math.ceil(sectors.length / PER_PAGE)}</span>
                <button onClick={() => setSectorPage(Math.min(Math.ceil(sectors.length / PER_PAGE) - 1, sectorPage + 1))}
                  disabled={sectorPage >= Math.ceil(sectors.length / PER_PAGE) - 1}
                  className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#E8E0D5]/60 hover:text-[#D4A017] disabled:opacity-30 transition-colors">
                  <i className="ri-arrow-right-s-line"></i>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pagedSectors.map((sector) => {
                const secColor = SECURITY_LEVEL_COLORS[sector.securityLevel] || '#888';
                return (
                  <button
                    key={sector.id}
                    onClick={() => navigateTo('systems', selectedUniverse!, selectedGalaxy, sector)}
                    className="text-left bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:border-[#D4A017]/20 hover:bg-white/[0.04] transition-all group cursor-pointer w-full"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-heading text-[#E8E0D5] group-hover:text-[#D4A017] transition-colors truncate">{sector.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0 ml-2" style={{ background: `${secColor}20`, color: secColor }}>
                        {sector.securityLevel}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-[#E8E0D5]/40">{sector.sectorType}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-[#E8E0D5]/40">#{sector.sectorNumber}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#E8E0D5]/30">
                      <span><i className="ri-sun-line mr-1"></i>{sector.starSystemCount} systems</span>
                      <span><i className="ri-flag-line mr-1"></i>{sector.colonizedSystems} colonized</span>
                      <span className={sector.threatLevel >= 7 ? 'text-red-400/60' : ''}>
                        <i className="ri-alert-line mr-1"></i>T{sector.threatLevel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SYSTEMS VIEW */}
        {viewLevel === 'systems' && selectedSector && (
          <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-heading text-[#E8E0D5]">{selectedSector.name} — Solar Systems</h2>
                <p className="text-[#E8E0D5]/40 text-sm">{selectedSector.starSystemCount} systems, showing {pagedSystems.length} per page</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSystemPage(Math.max(0, systemPage - 1))} disabled={systemPage === 0}
                  className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#E8E0D5]/60 hover:text-[#D4A017] disabled:opacity-30 transition-colors">
                  <i className="ri-arrow-left-s-line"></i>
                </button>
                <span className="px-3 py-1 text-xs text-[#E8E0D5]/40 flex items-center">{systemPage + 1} / {Math.ceil(solarSystems.length / PER_PAGE)}</span>
                <button onClick={() => setSystemPage(Math.min(Math.ceil(solarSystems.length / PER_PAGE) - 1, systemPage + 1))}
                  disabled={systemPage >= Math.ceil(solarSystems.length / PER_PAGE) - 1}
                  className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#E8E0D5]/60 hover:text-[#D4A017] disabled:opacity-30 transition-colors">
                  <i className="ri-arrow-right-s-line"></i>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {pagedSystems.map((sys) => {
                const starDef = STAR_CLASS_DEFINITIONS[sys.starType];
                const starColor = starDef?.color || '#FFD700';
                return (
                  <div key={sys.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.1] transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: `radial-gradient(circle, ${starColor}40, transparent 70%)` }}>
                        <i className="ri-sun-line text-lg" style={{ color: starColor }}></i>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-heading text-[#E8E0D5] truncate">{sys.name}</h3>
                        <span className="text-[10px] text-[#E8E0D5]/40">{starDef?.name || sys.starType}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-[#E8E0D5]/40">{sys.systemType}</span>
                      {sys.hasBlackHole && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400/60">BH</span>}
                      {sys.hasNebula && <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-400/60">Nebula</span>}
                      {sys.hasAnomaly && <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400/60">Anomaly</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-[#E8E0D5]/30">
                      <span><i className="ri-globe-line mr-1"></i>{sys.planetCount} planets</span>
                      <span><i className="ri-home-line mr-1"></i>{sys.habitabilityZonePlanets} habitable</span>
                      <span>{sys.asteroidBelts} belts</span>
                      <span className={sys.isColonized ? 'text-green-400/60' : ''}>{sys.isColonized ? 'Colonized' : sys.isDiscovered ? 'Discovered' : 'Unexplored'}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/[0.04] flex gap-2 text-[10px]">
                      <span className="text-[#E8E0D5]/20">M: {(sys.resourceOutput.metal / 1000).toFixed(0)}K</span>
                      <span className="text-[#E8E0D5]/20">C: {(sys.resourceOutput.crystal / 1000).toFixed(0)}K</span>
                      <span className="text-[#E8E0D5]/20">D: {(sys.resourceOutput.deuterium / 1000).toFixed(0)}K</span>
                      {sys.resourceOutput.darkMatter > 0 && <span className="text-purple-400/60">DM: {(sys.resourceOutput.darkMatter / 1000).toFixed(0)}K</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}