import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  PlanetClassLetter, PlanetCategory,
  PLANET_CLASS_LETTER_NAMES, PLANET_CLASS_LETTER_COLORS,
  getHabitabilityRating,
} from '../../types/gameTypes';

interface Colony {
  id: string;
  player_id: string;
  name: string;
  type: 'planet' | 'moon';
  coordinates: string;
  temperature: number;
  size: number;
  planet_size?: number;
  planet_class?: PlanetClassLetter;
  sub_class?: string;
  category?: PlanetCategory;
  sub_category?: string;
  atmosphere?: string;
  gravity?: number;
  habitability?: number;
  resource_richness?: number;
  upgrade_level?: number;
  buildings?: any;
  info?: string;
  lore?: string;
  fields_used: number;
  fields_total: number;
  image_url: string;
  created_at: string;
}

export default function ColoniesPage() {
  const { user } = useAuth();
  const [colonies, setColonies] = useState<Colony[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState<'planet' | 'moon'>('planet');
  const [newColonyName, setNewColonyName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'planet' | 'moon'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedColony, setSelectedColony] = useState<Colony | null>(null);

  const MAX_PLANETS = 1000;
  const MAX_MOONS = 1000;
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    if (user) {
      fetchColonies();
    }
  }, [user]);

  const fetchColonies = async () => {
    try {
      const { data, error } = await supabase
        .from('planets')
        .select('*')
        .eq('player_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setColonies(data || []);
    } catch (error) {
      console.error('Error fetching colonies:', error);
    } finally {
      setLoading(false);
    }
  };

  const planetCount = colonies.filter(c => c.type === 'planet').length;
  const moonCount = colonies.filter(c => c.type === 'moon').length;

  const canAddPlanet = planetCount < MAX_PLANETS;
  const canAddMoon = moonCount < MAX_MOONS;

  const handleAddColony = async () => {
    if (!newColonyName.trim()) {
      alert('Please enter a colony name');
      return;
    }

    if (selectedType === 'planet' && !canAddPlanet) {
      alert(`Maximum planet limit reached (${MAX_PLANETS})`);
      return;
    }

    if (selectedType === 'moon' && !canAddMoon) {
      alert(`Maximum moon limit reached (${MAX_MOONS})`);
      return;
    }

    try {
      const galaxy = Math.floor(Math.random() * 9) + 1;
      const system = Math.floor(Math.random() * 499) + 1;
      const position = Math.floor(Math.random() * 15) + 1;
      const coordinates = `${galaxy}:${system}:${position}`;

      const newColony = {
        player_id: user?.id,
        name: newColonyName,
        type: selectedType,
        coordinates,
        temperature: Math.floor(Math.random() * 200) - 50,
        size: Math.floor(Math.random() * 150) + 100,
        fields_used: 0,
        fields_total: Math.floor(Math.random() * 150) + 100,
        image_url: selectedType === 'planet'
          ? 'https://readdy.ai/api/search-image?query=alien%20exoplanet%20with%20colorful%20atmosphere%20rings%20and%20moons%20in%20deep%20space%20cosmic%20background%20science%20fiction%20digital%20art&width=400&height=400&seq=colony-planet-001&orientation=squarish'
          : 'https://readdy.ai/api/search-image?query=rocky%20moon%20surface%20with%20craters%20in%20space%20with%20stars%20and%20nebula%20background%20science%20fiction%20digital%20art&width=400&height=400&seq=colony-moon-001&orientation=squarish'
      };

      const { error } = await supabase
        .from('planets')
        .insert([newColony]);

      if (error) throw error;

      await fetchColonies();
      setShowAddModal(false);
      setNewColonyName('');
    } catch (error) {
      console.error('Error adding colony:', error);
      alert('Failed to add colony');
    }
  };

  const handleDeleteColony = async (id: string) => {
    if (!confirm('Are you sure you want to abandon this colony?')) return;

    try {
      const { error } = await supabase
        .from('planets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchColonies();
      setSelectedColony(null);
    } catch (error) {
      console.error('Error deleting colony:', error);
      alert('Failed to delete colony');
    }
  };

  const handleRenameColony = async (id: string, currentName: string) => {
    const newName = prompt('Enter new colony name:', currentName);
    if (!newName || newName === currentName) return;

    try {
      const { error } = await supabase
        .from('planets')
        .update({ name: newName })
        .eq('id', id);

      if (error) throw error;
      await fetchColonies();
      if (selectedColony?.id === id) {
        setSelectedColony({ ...selectedColony, name: newName });
      }
    } catch (error) {
      console.error('Error renaming colony:', error);
      alert('Failed to rename colony');
    }
  };

  const filteredColonies = colonies
    .filter(colony => {
      const matchesSearch = colony.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          colony.coordinates.includes(searchTerm);
      const matchesType = filterType === 'all' || colony.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'size') return b.size - a.size;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const totalPages = Math.ceil(filteredColonies.length / ITEMS_PER_PAGE);
  const paginatedColonies = filteredColonies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return <PageLoading message="Loading colonies..." className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white" />;
  }

  return (
    <div className="min-h-screen bg-[#080b0f] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <i className="ri-planet-line text-[#d4a853]"></i>
            Colony Management
          </h1>
          <p className="text-slate-300">Manage up to 1,000 planets and 1,000 moons across the galaxy</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <i className="ri-planet-fill text-2xl text-cyan-400"></i>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{planetCount}</div>
                <div className="text-sm text-slate-300">/ {MAX_PLANETS}</div>
              </div>
            </div>
            <div className="text-slate-300 font-medium mb-2">Planets</div>
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(planetCount / MAX_PLANETS) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <i className="ri-moon-fill text-2xl text-purple-400"></i>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{moonCount}</div>
                <div className="text-sm text-slate-300">/ {MAX_MOONS}</div>
              </div>
            </div>
            <div className="text-slate-300 font-medium mb-2">Moons</div>
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(moonCount / MAX_MOONS) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <i className="ri-earth-fill text-2xl text-emerald-400"></i>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{colonies.length}</div>
                <div className="text-sm text-slate-300">/ {MAX_PLANETS + MAX_MOONS}</div>
              </div>
            </div>
            <div className="text-slate-300 font-medium mb-2">Total Colonies</div>
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(colonies.length / (MAX_PLANETS + MAX_MOONS)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  type="text"
                  placeholder="Search by name or coordinates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="planet">Planets Only</option>
                <option value="moon">Moons Only</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="size">Sort by Size</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#d4a853] to-[#e2c044] hover:from-amber-400 hover:to-amber-300 text-[#080b0f] font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <i className="ri-add-line text-xl"></i>
              Add Colony
            </button>
          </div>
        </div>

        {/* Colonies Grid */}
        {filteredColonies.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-12 text-center">
            <i className="ri-planet-line text-6xl text-slate-600 mb-4"></i>
            <h3 className="text-xl font-semibold text-white mb-2">No Colonies Found</h3>
            <p className="text-slate-400 mb-6">Start building your galactic empire by adding your first colony</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <i className="ri-add-line text-xl"></i>
              Add Your First Colony
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedColonies.map((colony) => (
                <div
                  key={colony.id}
                  className="bg-[#080b0f] border border-[#1e2a36] rounded-xl overflow-hidden hover:border-[#d4a853]/50 transition-all group cursor-pointer"
                  onClick={() => setSelectedColony(colony)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={colony.image_url}
                      alt={colony.name}
                      className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        colony.type === 'planet' 
                          ? 'bg-cyan-500/80 text-white' 
                          : 'bg-purple-500/80 text-white'
                      }`}>
                        <i className={`${colony.type === 'planet' ? 'ri-planet-fill' : 'ri-moon-fill'} mr-1`}></i>
                        {colony.type.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{colony.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <i className="ri-map-pin-line"></i>
                          <span>{colony.coordinates}</span>
                        </div>
                      </div>
                    </div>

                    {/* Classification Badges */}
                    {colony.planet_class && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span
                          className="text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 whitespace-nowrap"
                          style={{ backgroundColor: (PLANET_CLASS_LETTER_COLORS[colony.planet_class] || '#666') + '30', color: PLANET_CLASS_LETTER_COLORS[colony.planet_class] || '#999', border: `1px solid ${PLANET_CLASS_LETTER_COLORS[colony.planet_class] || '#666'}40` }}
                        >
                          <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]" style={{ backgroundColor: PLANET_CLASS_LETTER_COLORS[colony.planet_class] || '#666' }}>
                            {colony.planet_class}
                          </span>
                          {PLANET_CLASS_LETTER_NAMES[colony.planet_class]}
                        </span>
                        {colony.category && (
                          <span className="text-xs px-2 py-1 rounded-full bg-slate-700/70 text-slate-300 border border-slate-600 font-medium whitespace-nowrap">
                            {colony.category}
                          </span>
                        )}
                        {colony.sub_class && (
                          <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 whitespace-nowrap">
                            {colony.sub_class}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Habitability & Upgrade */}
                    {colony.habitability != null && (
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-slate-400">Hab:</span>
                          <span className={`font-bold ${colony.habitability >= 70 ? 'text-emerald-400' : colony.habitability >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                            {colony.habitability}% · {getHabitabilityRating(colony.habitability)}
                          </span>
                        </div>
                        {colony.upgrade_level != null && colony.upgrade_level > 0 && (
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-slate-400">Upg:</span>
                            <span className="font-bold text-purple-400">Tier {colony.upgrade_level}</span>
                          </div>
                        )}
                        {colony.buildings && typeof colony.buildings === 'object' && (
                          <div className="flex items-center gap-1 text-xs">
                            <i className="ri-building-line text-slate-400 w-3 h-3 flex items-center justify-center"></i>
                            <span className="text-slate-300">{Object.keys(colony.buildings).length} buildings</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Temperature</span>
                        <span className="text-white font-medium">{colony.temperature}°C</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Size</span>
                        <span className="text-white font-medium">{colony.size} km</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Fields</span>
                        <span className="text-white font-medium">{colony.fields_used} / {colony.fields_total}</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${(colony.fields_used / colony.fields_total) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRenameColony(colony.id, colony.name);
                        }}
                        className="flex-1 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-white text-sm font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-edit-line"></i>
                        Rename
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteColony(colony.id);
                        }}
                        className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 text-sm font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-delete-bin-line"></i>
                        Abandon
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <i className="ri-arrow-left-s-line"></i>
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                            : 'bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <i className="ri-arrow-right-s-line"></i>
                </button>

                <div className="ml-4 text-slate-400 text-sm">
                  Page {currentPage} of {totalPages} ({filteredColonies.length} colonies)
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Colony Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Add New Colony</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Colony Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedType('planet')}
                    disabled={!canAddPlanet}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedType === 'planet'
                        ? 'border-cyan-500 bg-cyan-500/20'
                        : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                    } ${!canAddPlanet ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <i className="ri-planet-fill text-3xl text-cyan-400 mb-2"></i>
                    <div className="text-white font-semibold">Planet</div>
                    <div className="text-xs text-slate-400 mt-1">{planetCount}/{MAX_PLANETS}</div>
                  </button>
                  <button
                    onClick={() => setSelectedType('moon')}
                    disabled={!canAddMoon}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedType === 'moon'
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                    } ${!canAddMoon ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <i className="ri-moon-fill text-3xl text-purple-400 mb-2"></i>
                    <div className="text-white font-semibold">Moon</div>
                    <div className="text-xs text-slate-400 mt-1">{moonCount}/{MAX_MOONS}</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Colony Name</label>
                <input
                  type="text"
                  value={newColonyName}
                  onChange={(e) => setNewColonyName(e.target.value)}
                  placeholder={`Enter ${selectedType} name...`}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                  maxLength={30}
                />
                <div className="text-xs text-slate-400 mt-1">{newColonyName.length}/30 characters</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-white font-medium transition-all whitespace-nowrap cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddColony}
                disabled={!newColonyName.trim() || (selectedType === 'planet' && !canAddPlanet) || (selectedType === 'moon' && !canAddMoon)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
              >
                <i className="ri-add-line mr-2"></i>
                Add Colony
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Colony Detail Modal */}
      {selectedColony && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{selectedColony.name}</h2>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <i className="ri-map-pin-line"></i>
                  <span>{selectedColony.coordinates}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedColony(null)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="p-6">
              <div className="relative h-64 rounded-xl overflow-hidden mb-6">
                <img
                  src={selectedColony.image_url}
                  alt={selectedColony.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    selectedColony.type === 'planet' 
                      ? 'bg-cyan-500/80 text-white' 
                      : 'bg-purple-500/80 text-white'
                  }`}>
                    <i className={`${selectedColony.type === 'planet' ? 'ri-planet-fill' : 'ri-moon-fill'} mr-2`}></i>
                    {selectedColony.type.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">Temperature</div>
                  <div className="text-white text-xl font-bold">{selectedColony.temperature}°C</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">Size</div>
                  <div className="text-white text-xl font-bold">{selectedColony.size} km</div>
                </div>
                {selectedColony.planet_class && (
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">Class</div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: PLANET_CLASS_LETTER_COLORS[selectedColony.planet_class] || '#666' }}>
                        {selectedColony.planet_class}
                      </span>
                      <span className="text-white text-lg font-bold">{PLANET_CLASS_LETTER_NAMES[selectedColony.planet_class]}</span>
                    </div>
                  </div>
                )}
                {selectedColony.habitability != null && (
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">Habitability</div>
                    <div className={`text-xl font-bold ${selectedColony.habitability >= 70 ? 'text-emerald-400' : selectedColony.habitability >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                      {selectedColony.habitability}% · {getHabitabilityRating(selectedColony.habitability)}
                    </div>
                  </div>
                )}
                {selectedColony.gravity != null && (
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">Gravity</div>
                    <div className="text-white text-xl font-bold">{selectedColony.gravity} G</div>
                  </div>
                )}
                {selectedColony.atmosphere && (
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">Atmosphere</div>
                    <div className="text-white text-sm font-bold">{selectedColony.atmosphere}</div>
                  </div>
                )}
                {selectedColony.resource_richness != null && (
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">Resource Richness</div>
                    <div className="text-white text-xl font-bold">{selectedColony.resource_richness}%</div>
                  </div>
                )}
                {selectedColony.upgrade_level != null && (
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-1">Upgrade Tier</div>
                    <div className="text-purple-400 text-xl font-bold">Tier {selectedColony.upgrade_level}</div>
                  </div>
                )}
                {(selectedColony.category || selectedColony.sub_class || selectedColony.sub_category) && (
                  <div className="col-span-2 bg-slate-700/30 rounded-lg p-4">
                    <div className="text-slate-400 text-sm mb-2">Classification Details</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedColony.category && (
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-600/50 text-slate-300 whitespace-nowrap">
                          Category: {selectedColony.category}
                        </span>
                      )}
                      {selectedColony.sub_category && (
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-600/50 text-slate-300 whitespace-nowrap">
                          Sub: {selectedColony.sub_category}
                        </span>
                      )}
                      {selectedColony.sub_class && (
                        <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 whitespace-nowrap">
                          Sub-Class: {selectedColony.sub_class}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {selectedColony.info && (
                  <div className="col-span-2 bg-slate-700/20 rounded-lg p-4 border border-slate-600/50">
                    <div className="text-slate-400 text-sm mb-2">Planetary Information</div>
                    <p className="text-slate-300 text-sm leading-relaxed">{selectedColony.info}</p>
                  </div>
                )}
                {selectedColony.buildings && typeof selectedColony.buildings === 'object' && Object.keys(selectedColony.buildings).length > 0 && (
                  <div className="col-span-2 bg-slate-700/20 rounded-lg p-4 border border-slate-600/50">
                    <div className="text-slate-400 text-sm mb-2">Buildings ({Object.keys(selectedColony.buildings).length})</div>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(selectedColony.buildings).slice(0, 9).map(([key, b]: [string, any]) => (
                        <div key={key} className="bg-slate-800/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400 truncate">{key.replace(/_/g, ' ')}</div>
                          <div className="text-sm font-bold text-cyan-400">Lv.{b?.level || 1}</div>
                        </div>
                      ))}
                      {Object.keys(selectedColony.buildings).length > 9 && (
                        <div className="bg-slate-800/50 rounded p-2 text-center">
                          <div className="text-xs text-slate-400">+more</div>
                          <div className="text-sm font-bold text-purple-400">{Object.keys(selectedColony.buildings).length - 9}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">Fields Used</div>
                  <div className="text-white text-xl font-bold">{selectedColony.fields_used} / {selectedColony.fields_total}</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">Utilization</div>
                  <div className="text-white text-xl font-bold">
                    {((selectedColony.fields_used / selectedColony.fields_total) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-slate-300 font-medium mb-2">Field Usage</div>
                <div className="w-full bg-slate-700/50 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-4 rounded-full transition-all flex items-center justify-end pr-2"
                    style={{ width: `${(selectedColony.fields_used / selectedColony.fields_total) * 100}%` }}
                  >
                    <span className="text-xs text-white font-semibold">
                      {selectedColony.fields_used}/{selectedColony.fields_total}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleRenameColony(selectedColony.id, selectedColony.name)}
                  className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-edit-line"></i>
                  Rename Colony
                </button>
                <button
                  onClick={() => handleDeleteColony(selectedColony.id)}
                  className="flex-1 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-delete-bin-line"></i>
                  Abandon Colony
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
