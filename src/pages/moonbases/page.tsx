import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface MoonBase {
  id: string;
  name: string;
  moon_id: string;
  moon_name: string;
  level: number;
  maxLevel: number;
  type: 'mining' | 'military' | 'research' | 'industrial' | 'defensive';
  status: 'operational' | 'construction' | 'upgrading' | 'damaged';
  capacity: number;
  currentPopulation: number;
  facilities: string[];
  production: {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
  };
  defense: {
    shields: number;
    armor: number;
    weapons: number;
  };
  upgradeCost: {
    metal: number;
    crystal: number;
    deuterium: number;
    time: string;
  };
  icon: string;
}

export default function MoonBasesPage() {
  const { user } = useAuth();
  const [moonBases, setMoonBases] = useState<MoonBase[]>([]);
  const [selectedBase, setSelectedBase] = useState<MoonBase | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMoonBases();
  }, []);

  const loadMoonBases = async () => {
    setLoading(true);
    
    try {
      // Mock moon base data
      const mockBases: MoonBase[] = [
        {
          id: '1',
          name: 'Lunar Mining Complex Alpha',
          moon_id: 'moon1',
          moon_name: 'Titan',
          level: 15,
          maxLevel: 50,
          type: 'mining',
          status: 'operational',
          capacity: 5000,
          currentPopulation: 4200,
          facilities: ['Advanced Mining Drills', 'Ore Processing Plant', 'Storage Silos', 'Worker Quarters'],
          production: {
            metal: 12500,
            crystal: 8500,
            deuterium: 3200,
            energy: 15000
          },
          defense: {
            shields: 75,
            armor: 60,
            weapons: 40
          },
          upgradeCost: {
            metal: 150000,
            crystal: 100000,
            deuterium: 50000,
            time: '8 hours'
          },
          icon: 'ri-hammer-line'
        },
        {
          id: '2',
          name: 'Fortress Europa',
          moon_id: 'moon2',
          moon_name: 'Europa',
          level: 22,
          maxLevel: 50,
          type: 'military',
          status: 'operational',
          capacity: 8000,
          currentPopulation: 7500,
          facilities: ['Missile Silos', 'Plasma Cannons', 'Shield Generators', 'Barracks', 'Command Center'],
          production: {
            metal: 5000,
            crystal: 3000,
            deuterium: 2000,
            energy: 25000
          },
          defense: {
            shields: 95,
            armor: 90,
            weapons: 98
          },
          upgradeCost: {
            metal: 300000,
            crystal: 250000,
            deuterium: 150000,
            time: '12 hours'
          },
          icon: 'ri-shield-star-line'
        },
        {
          id: '3',
          name: 'Research Station Ganymede',
          moon_id: 'moon3',
          moon_name: 'Ganymede',
          level: 18,
          maxLevel: 50,
          type: 'research',
          status: 'operational',
          capacity: 3000,
          currentPopulation: 2800,
          facilities: ['Quantum Labs', 'Particle Accelerator', 'Observatory', 'Data Centers', 'Science Quarters'],
          production: {
            metal: 2000,
            crystal: 15000,
            deuterium: 8000,
            energy: 20000
          },
          defense: {
            shields: 70,
            armor: 50,
            weapons: 30
          },
          upgradeCost: {
            metal: 200000,
            crystal: 300000,
            deuterium: 100000,
            time: '10 hours'
          },
          icon: 'ri-flask-line'
        },
        {
          id: '4',
          name: 'Industrial Hub Callisto',
          moon_id: 'moon4',
          moon_name: 'Callisto',
          level: 20,
          maxLevel: 50,
          type: 'industrial',
          status: 'upgrading',
          capacity: 6000,
          currentPopulation: 5500,
          facilities: ['Shipyard', 'Manufacturing Plants', 'Assembly Lines', 'Refineries', 'Cargo Bays'],
          production: {
            metal: 10000,
            crystal: 7000,
            deuterium: 5000,
            energy: 18000
          },
          defense: {
            shields: 65,
            armor: 70,
            weapons: 50
          },
          upgradeCost: {
            metal: 250000,
            crystal: 200000,
            deuterium: 120000,
            time: '14 hours'
          },
          icon: 'ri-building-4-line'
        },
        {
          id: '5',
          name: 'Defense Outpost Io',
          moon_id: 'moon5',
          moon_name: 'Io',
          level: 25,
          maxLevel: 50,
          type: 'defensive',
          status: 'operational',
          capacity: 4000,
          currentPopulation: 3800,
          facilities: ['Ion Cannons', 'Laser Batteries', 'Defense Grid', 'Early Warning System', 'Bunkers'],
          production: {
            metal: 3000,
            crystal: 2000,
            deuterium: 1500,
            energy: 22000
          },
          defense: {
            shields: 100,
            armor: 95,
            weapons: 100
          },
          upgradeCost: {
            metal: 350000,
            crystal: 280000,
            deuterium: 180000,
            time: '16 hours'
          },
          icon: 'ri-shield-check-line'
        }
      ];

      setMoonBases(mockBases);
    } catch (error) {
      console.error('Error loading moon bases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (baseId: string) => {
    const base = moonBases.find(b => b.id === baseId);
    if (!base) return;

    if (confirm(`Upgrade ${base.name} to Level ${base.level + 1}?\n\nCost:\nMetal: ${base.upgradeCost.metal.toLocaleString()}\nCrystal: ${base.upgradeCost.crystal.toLocaleString()}\nDeuterium: ${base.upgradeCost.deuterium.toLocaleString()}\nTime: ${base.upgradeCost.time}`)) {
      try {
        setMoonBases(prev => prev.map(b => 
          b.id === baseId 
            ? { ...b, status: 'upgrading' as const }
            : b
        ));
      } catch (error) {
        console.error('Error upgrading base:', error);
      }
    }
  };

  const handleRepair = async (baseId: string) => {
    if (confirm('Repair this moon base? Cost: 50,000 Metal, 30,000 Crystal')) {
      try {
        setMoonBases(prev => prev.map(b => 
          b.id === baseId 
            ? { ...b, status: 'operational' as const }
            : b
        ));
      } catch (error) {
        console.error('Error repairing base:', error);
      }
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mining': return 'yellow';
      case 'military': return 'red';
      case 'research': return 'purple';
      case 'industrial': return 'blue';
      case 'defensive': return 'green';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-emerald-400';
      case 'construction': return 'text-blue-400';
      case 'upgrading': return 'text-amber-400';
      case 'damaged': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const filteredBases = activeFilter === 'all' 
    ? moonBases 
    : moonBases.filter(b => b.type === activeFilter);

  const totalProduction = moonBases.reduce((sum, b) => ({
    metal: sum.metal + b.production.metal,
    crystal: sum.crystal + b.production.crystal,
    deuterium: sum.deuterium + b.production.deuterium,
    energy: sum.energy + b.production.energy
  }), { metal: 0, crystal: 0, deuterium: 0, energy: 0 });

  return (
    <div className="text-white">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://readdy.ai/api/search-image?query=massive%20futuristic%20moon%20base%20lunar%20colony%20with%20domes%20structures%20facilities%20on%20moon%20surface%20space%20station%20military%20mining%20research%20industrial%20complex%20sci-fi%20architecture%20glowing%20lights%20stars%20in%20background&width=1920&height=600&seq=moonbase-hero&orientation=landscape" alt="Moon Base" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <h1 className="text-6xl font-black uppercase text-white mb-4">Moon Base Command</h1>
          <p className="text-xl text-gray-300">Manage your lunar colonies and orbital installations</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-[#0F1F3A] border border-cyan-400/30 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Total Bases</div>
            <div className="text-3xl font-bold text-cyan-400">{moonBases.length}</div>
          </div>
          <div className="bg-[#0F1F3A] border border-yellow-400/30 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Metal/Hour</div>
            <div className="text-3xl font-bold text-yellow-400">{totalProduction.metal.toLocaleString()}</div>
          </div>
          <div className="bg-[#0F1F3A] border border-blue-400/30 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Crystal/Hour</div>
            <div className="text-3xl font-bold text-blue-400">{totalProduction.crystal.toLocaleString()}</div>
          </div>
          <div className="bg-[#0F1F3A] border border-green-400/30 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Deuterium/Hour</div>
            <div className="text-3xl font-bold text-green-400">{totalProduction.deuterium.toLocaleString()}</div>
          </div>
          <div className="bg-[#0F1F3A] border border-purple-400/30 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Total Energy</div>
            <div className="text-3xl font-bold text-purple-400">{totalProduction.energy.toLocaleString()}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'all', name: 'All Bases', icon: 'ri-building-line' },
            { id: 'mining', name: 'Mining', icon: 'ri-hammer-line' },
            { id: 'military', name: 'Military', icon: 'ri-shield-star-line' },
            { id: 'research', name: 'Research', icon: 'ri-flask-line' },
            { id: 'industrial', name: 'Industrial', icon: 'ri-building-4-line' },
            { id: 'defensive', name: 'Defensive', icon: 'ri-shield-check-line' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeFilter === filter.id
                  ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400'
                  : 'bg-[#0F1F3A] border border-cyan-400/30 text-gray-400 hover:border-cyan-500/50'
              }`}
            >
              <i className={`${filter.icon} w-5 h-5 flex items-center justify-center`}></i>
              <span>{filter.name}</span>
            </button>
          ))}
        </div>

        {/* Moon Bases Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBases.map(base => (
            <div
              key={base.id}
              className="bg-[#0F1F3A] border border-cyan-400/30 rounded-xl overflow-hidden hover:border-cyan-400/60 transition-all"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-lg bg-${getTypeColor(base.type)}-400/20 flex items-center justify-center flex-shrink-0`}>
                    <i className={`${base.icon} text-3xl text-${getTypeColor(base.type)}-400 w-10 h-10 flex items-center justify-center`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white mb-1">{base.name}</h3>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`text-xs px-2 py-1 rounded bg-${getTypeColor(base.type)}-400/20 text-${getTypeColor(base.type)}-400 font-bold capitalize`}>
                        {base.type}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-slate-700 text-gray-300">
                        Level {base.level}
                      </span>
                      <span className={`text-xs font-medium ${getStatusColor(base.status)} capitalize`}>
                        {base.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">Moon: {base.moon_name}</div>
                  </div>
                </div>

                {/* Population */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Population</span>
                    <span>{base.currentPopulation.toLocaleString()} / {base.capacity.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all"
                      style={{ width: `${(base.currentPopulation / base.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Production Stats */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <div className="text-xs text-gray-400">Metal</div>
                    <div className="text-sm font-bold text-yellow-400">{base.production.metal.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <div className="text-xs text-gray-400">Crystal</div>
                    <div className="text-sm font-bold text-blue-400">{base.production.crystal.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <div className="text-xs text-gray-400">Deuterium</div>
                    <div className="text-sm font-bold text-green-400">{base.production.deuterium.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <div className="text-xs text-gray-400">Energy</div>
                    <div className="text-sm font-bold text-purple-400">{base.production.energy.toLocaleString()}</div>
                  </div>
                </div>

                {/* Defense Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <div className="text-xs text-gray-400">Shields</div>
                    <div className="text-sm font-bold text-blue-400">{base.defense.shields}%</div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <div className="text-xs text-gray-400">Armor</div>
                    <div className="text-sm font-bold text-gray-400">{base.defense.armor}%</div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <div className="text-xs text-gray-400">Weapons</div>
                    <div className="text-sm font-bold text-red-400">{base.defense.weapons}%</div>
                  </div>
                </div>

                {/* Facilities */}
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-2">Facilities:</div>
                  <div className="flex flex-wrap gap-1">
                    {base.facilities.slice(0, 3).map((facility, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-slate-800/50 rounded text-gray-300">
                        {facility}
                      </span>
                    ))}
                    {base.facilities.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-slate-800/50 rounded text-cyan-400">
                        +{base.facilities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {base.status === 'operational' && (
                    <button
                      onClick={() => handleUpgrade(base.id)}
                      className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-arrow-up-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                      Upgrade
                    </button>
                  )}
                  {base.status === 'damaged' && (
                    <button
                      onClick={() => handleRepair(base.id)}
                      className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-tools-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                      Repair
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedBase(base)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-eye-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Build New Base Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowBuildModal(true)}
            className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold text-lg rounded-lg hover:scale-105 transition-all whitespace-nowrap cursor-pointer shadow-lg shadow-cyan-400/50"
          >
            <i className="ri-add-circle-line mr-2"></i>
            Build New Moon Base
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {selectedBase && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={() => setSelectedBase(null)}>
          <div className="bg-[#0F1F3A] border border-cyan-400/30 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedBase.name}</h2>
                  <p className="text-gray-400">{selectedBase.moon_name} • Level {selectedBase.level}</p>
                </div>
                <button
                  onClick={() => setSelectedBase(null)}
                  className="w-10 h-10 bg-black/50 hover:bg-black/70 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                >
                  <i className="ri-close-line text-2xl text-white w-6 h-6 flex items-center justify-center"></i>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-cyan-400 mb-3">All Facilities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedBase.facilities.map((facility, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-800/50 rounded p-3">
                        <i className="ri-checkbox-circle-fill text-cyan-400 w-5 h-5 flex items-center justify-center"></i>
                        <span className="text-gray-300">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-cyan-400 mb-3">Upgrade Cost</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Metal</div>
                      <div className="text-xl font-bold text-yellow-400">{selectedBase.upgradeCost.metal.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Crystal</div>
                      <div className="text-xl font-bold text-blue-400">{selectedBase.upgradeCost.crystal.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Deuterium</div>
                      <div className="text-xl font-bold text-green-400">{selectedBase.upgradeCost.deuterium.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Time</div>
                      <div className="text-xl font-bold text-purple-400">{selectedBase.upgradeCost.time}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
