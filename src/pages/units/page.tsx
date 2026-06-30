import { useState, useMemo } from 'react';
import { useUnitSystem } from '../../hooks/useUnitSystem';
import type { UnitDefinition, UnitCategory } from '../../data/units/types';
import { JOB_CATEGORY_DESCRIPTIONS } from '../../data/units/personnel';
import UnitCard from './components/UnitCard';
import UnitDetails from './components/UnitDetails';
import TrainingQueue from './components/TrainingQueue';
import PersonnelOverview from './components/PersonnelOverview';

type SidePanel = 'training' | 'overview';

const CATEGORY_TABS: { id: 'all' | UnitCategory; label: string; icon: string; color: string }[] = [
  { id: 'all', label: 'All Units', icon: 'ri-team-line', color: 'text-cyan-400' },
  { id: 'civilian', label: 'Civilian', icon: 'ri-user-line', color: 'text-emerald-400' },
  { id: 'military', label: 'Military', icon: 'ri-sword-line', color: 'text-red-400' },
  { id: 'government', label: 'Government', icon: 'ri-government-line', color: 'text-amber-400' },
];

const RARITY_ORDER = ['Transcendent', 'Mythic', 'Legendary', 'Epic', 'Rare', 'Uncommon', 'Common'];

export default function UnitsPage() {
  const {
    filteredUnits,
    pools,
    trainingQueue,
    empirePersonnel,
    notifications,
    allSectors,
    selectedCategory,
    setSelectedCategory,
    selectedSector,
    setSelectedSector,
    searchQuery,
    setSearchQuery,
    trainUnits,
    cancelTraining,
    deployUnit,
    getTrainingQueueProgress,
    getTimeRemaining,
    clearNotification,
  } = useUnitSystem();

  const [selectedUnit, setSelectedUnit] = useState<UnitDefinition | null>(null);
  const [sidePanel, setSidePanel] = useState<SidePanel>('overview');
  const [sortBy, setSortBy] = useState<'tier' | 'rarity' | 'power' | 'available'>('tier');
  const [deployModal, setDeployModal] = useState<{ unit: UnitDefinition; count: number } | null>(null);

  // Sort filtered units
  const sortedUnits = useMemo(() => {
    return [...filteredUnits].sort((a, b) => {
      switch (sortBy) {
        case 'tier': return b.tier - a.tier;
        case 'rarity': return RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity);
        case 'available': return b.available - a.available;
        default: return b.tier - a.tier;
      }
    });
  }, [filteredUnits, sortBy]);

  // Sector list for current category
  const sectorOptions = useMemo(() => {
    if (selectedCategory === 'all') return allSectors;
    return allSectors.filter(s => {
      const desc = JOB_CATEGORY_DESCRIPTIONS[s as keyof typeof JOB_CATEGORY_DESCRIPTIONS];
      return !!desc;
    });
  }, [selectedCategory, allSectors]);

  const handleTrain = (unitId: string, count: number) => {
    trainUnits({ unitId, count });
  };

  const handleDeploy = (unit: UnitDefinition) => {
    setDeployModal({ unit, count: 1 });
  };

  const confirmDeploy = () => {
    if (!deployModal) return;
    deployUnit({ unitId: deployModal.unit.id, count: deployModal.count, destination: 'Front Lines' });
    setDeployModal(null);
  };

  const categoryColors: Record<string, string> = {
    all: 'border-cyan-500 bg-cyan-500/10 text-cyan-400',
    civilian: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
    military: 'border-red-500 bg-red-500/10 text-red-400',
    government: 'border-amber-500 bg-amber-500/10 text-amber-400',
  };

  return (
    <div className="text-white min-h-screen">
      {/* ── Hero Banner ── */}
      <div className="relative py-14 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://readdy.ai/api/search-image?query=massive%20futuristic%20command%20center%20with%20diverse%20ranks%20of%20civilian%20scientists%20engineers%20soldiers%20government%20officials%20in%20distinctive%20uniforms%20standing%20in%20formation%20on%20massive%20military%20base%20with%20holographic%20displays%20sci-fi%20empire%20personnel%20management%20center&width=1920&height=480&seq=unitshero2025&orientation=landscape"
            alt="Personnel Command"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#060f1e]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">Imperial Personnel Command</div>
              <h1 className="text-5xl font-black uppercase text-white mb-2">Personnel Registry</h1>
              <p className="text-gray-300">Train, deploy &amp; manage all civilian, military &amp; government units</p>
            </div>
            <div className="hidden md:flex gap-4 text-right">
              <div>
                <div className="text-3xl font-black text-cyan-400">{empirePersonnel.total.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Total Personnel</div>
              </div>
              <div>
                <div className="text-3xl font-black text-amber-400">{empirePersonnel.untrained.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Untrained</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Notifications ── */}
      {notifications.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="space-y-1">
            {notifications.slice(0, 3).map((n, i) => (
              <div key={i} className="flex items-center justify-between bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
                <span className="text-xs text-cyan-300">{n}</span>
                <button onClick={() => clearNotification(i)} className="text-gray-500 hover:text-white text-xs cursor-pointer">
                  <i className="ri-close-line w-3 h-3 flex items-center justify-center" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Summary Stats Bar ── */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Civilian', val: empirePersonnel.civilian, color: 'text-emerald-400', border: 'border-emerald-500/30', icon: 'ri-user-line' },
            { label: 'Military', val: empirePersonnel.military, color: 'text-red-400', border: 'border-red-500/30', icon: 'ri-sword-line' },
            { label: 'Government', val: empirePersonnel.government, color: 'text-amber-400', border: 'border-amber-500/30', icon: 'ri-government-line' },
            { label: 'In Training', val: empirePersonnel.inTraining, color: 'text-orange-400', border: 'border-orange-500/30', icon: 'ri-time-line' },
            { label: 'Deployed', val: empirePersonnel.deployed, color: 'text-sky-400', border: 'border-sky-500/30', icon: 'ri-send-plane-line' },
          ].map(s => (
            <div key={s.label} className={`bg-[#0B1929] border ${s.border} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-1">
                <i className={`${s.icon} text-sm ${s.color} w-4 h-4 flex items-center justify-center`} />
                <span className="text-xs text-gray-500">{s.label}</span>
              </div>
              <div className={`text-2xl font-black ${s.color}`}>{s.val.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            {/* Filters Row */}
            <div className="bg-[#0B1929] border border-cyan-400/20 rounded-2xl p-4 mb-5">
              {/* Category Tabs */}
              <div className="flex gap-2 mb-4">
                {CATEGORY_TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setSelectedCategory(tab.id); setSelectedSector('all'); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer border ${
                      selectedCategory === tab.id
                        ? categoryColors[tab.id]
                        : 'border-slate-700 text-gray-500 hover:border-slate-500'
                    }`}
                  >
                    <i className={`${tab.icon} w-4 h-4 flex items-center justify-center`} />
                    {tab.label}
                    {tab.id !== 'all' && (
                      <span className="text-xs bg-slate-700/80 px-1.5 py-0.5 rounded-full">
                        {tab.id === 'civilian' ? empirePersonnel.civilian.toLocaleString() :
                         tab.id === 'military' ? empirePersonnel.military.toLocaleString() :
                         empirePersonnel.government.toLocaleString()}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Second Row: Sector, Search, Sort */}
              <div className="flex flex-wrap gap-3 items-center">
                {/* Search */}
                <div className="relative flex-1 min-w-48">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm w-4 h-4 flex items-center justify-center" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search units, jobs, sectors..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Sector Filter */}
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="all">All Sectors</option>
                  {sectorOptions.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="tier">Sort: Tier</option>
                  <option value="rarity">Sort: Rarity</option>
                  <option value="available">Sort: Available</option>
                </select>

                {/* Results count */}
                <div className="text-xs text-gray-600 whitespace-nowrap">
                  {sortedUnits.length} units
                </div>
              </div>
            </div>

            {/* Current Sector Info */}
            {selectedSector !== 'all' && JOB_CATEGORY_DESCRIPTIONS[selectedSector as keyof typeof JOB_CATEGORY_DESCRIPTIONS] && (
              <div className="flex items-start gap-3 bg-slate-800/40 border border-slate-600/30 rounded-xl px-4 py-3 mb-4">
                <i className="ri-information-line text-cyan-400 text-sm mt-0.5 w-4 h-4 flex items-center justify-center flex-shrink-0" />
                <p className="text-sm text-gray-400">{JOB_CATEGORY_DESCRIPTIONS[selectedSector as keyof typeof JOB_CATEGORY_DESCRIPTIONS]}</p>
              </div>
            )}

            {/* Unit Grid */}
            {sortedUnits.length === 0 ? (
              <div className="text-center py-16 bg-[#0B1929] rounded-2xl border border-slate-700/50">
                <i className="ri-search-line text-4xl text-gray-700 w-10 h-10 mx-auto flex items-center justify-center mb-3" />
                <p className="text-gray-500">No units match your filters</p>
                <button
                  onClick={() => { setSelectedCategory('all'); setSelectedSector('all'); setSearchQuery(''); }}
                  className="mt-3 text-xs text-cyan-400 hover:underline cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {sortedUnits.map(unit => (
                  <UnitCard
                    key={unit.id}
                    unit={unit}
                    onViewDetails={setSelectedUnit}
                    onTrain={handleTrain}
                    onDeploy={() => handleDeploy(unit)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Side Panel ── */}
          <div className="lg:w-80 flex-shrink-0 space-y-4">
            {/* Panel Switcher */}
            <div className="flex gap-2 bg-[#0B1929] border border-cyan-400/20 rounded-xl p-1">
              <button
                onClick={() => setSidePanel('overview')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  sidePanel === 'overview'
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <i className="ri-dashboard-line mr-1.5 w-4 h-4 inline-flex items-center justify-center" />
                Overview
              </button>
              <button
                onClick={() => setSidePanel('training')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap relative ${
                  sidePanel === 'training'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <i className="ri-time-line mr-1.5 w-4 h-4 inline-flex items-center justify-center" />
                Training
                {trainingQueue.length > 0 && (
                  <span className="ml-1.5 text-xs bg-amber-500 text-black px-1.5 py-0.5 rounded-full font-bold">
                    {trainingQueue.length}
                  </span>
                )}
              </button>
            </div>

            {/* Side Panel Content */}
            {sidePanel === 'overview' ? (
              <PersonnelOverview personnel={empirePersonnel} />
            ) : (
              <TrainingQueue
                queue={trainingQueue}
                pools={pools}
                getProgress={getTrainingQueueProgress}
                getTimeRemaining={getTimeRemaining}
                onCancel={cancelTraining}
              />
            )}

            {/* Quick Reference: Job Hierarchy */}
            <div className="bg-[#0B1929] border border-cyan-400/20 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-cyan-400/20">
                <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <i className="ri-organization-chart w-4 h-4 flex items-center justify-center" />
                  Unit Hierarchy
                </h2>
              </div>
              <div className="p-4 space-y-2 text-xs">
                {[
                  { cat: 'Civilian', classes: ['Untrained → Laborer → Technician → Specialist → Expert → Master → Grandmaster'], color: 'text-emerald-400' },
                  { cat: 'Military', classes: ['Untrained → Recruit → Soldier → Veteran → Elite → Special-Ops → Officer → Commander → Hero'], color: 'text-red-400' },
                  { cat: 'Government', classes: ['Untrained → Clerk → Official → Director → Minister → Chancellor → Emperor'], color: 'text-amber-400' },
                ].map(h => (
                  <div key={h.cat}>
                    <div className={`font-bold ${h.color} mb-0.5`}>{h.cat}</div>
                    <div className="text-gray-600 leading-relaxed">{h.classes[0]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Legend */}
            <div className="bg-[#0B1929] border border-cyan-400/20 rounded-2xl p-4">
              <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Status Legend</h2>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(TRAINING_STATUS_LABELS).slice(0, 10).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-1.5 text-xs">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      key === 'trained' || key === 'veteran' || key === 'elite' ? 'bg-emerald-400' :
                      key === 'basic-training' || key === 'advanced-training' || key === 'specialist-training' ? 'bg-amber-400' :
                      key === 'deployed' ? 'bg-sky-400' :
                      key === 'injured' ? 'bg-red-400' :
                      key === 'untrained' ? 'bg-gray-500' :
                      'bg-slate-500'
                    }`} />
                    <span className="text-gray-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Unit Detail Modal ── */}
      {selectedUnit && (
        <UnitDetails
          unit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
          onTrain={handleTrain}
        />
      )}

      {/* ── Deploy Confirm Modal ── */}
      {deployModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setDeployModal(null)}
        >
          <div
            className="bg-[#0B1929] border border-sky-400/40 rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-2">Deploy {deployModal.unit.name}</h3>
            <p className="text-sm text-gray-400 mb-4">
              Available: <span className="text-cyan-400 font-bold">{deployModal.unit.available}</span>
            </p>
            <div className="flex items-center gap-3 mb-5">
              <label className="text-sm text-gray-400">Count:</label>
              <input
                type="number"
                min={1}
                max={deployModal.unit.available}
                value={deployModal.count}
                onChange={(e) => setDeployModal(prev => prev ? { ...prev, count: parseInt(e.target.value) || 1 } : null)}
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeployModal(null)}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-xl text-sm font-semibold cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeploy}
                className="flex-1 py-2 bg-sky-500/20 hover:bg-sky-500 text-sky-400 hover:text-white border border-sky-500/40 rounded-xl text-sm font-bold cursor-pointer whitespace-nowrap transition-all"
              >
                Deploy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
