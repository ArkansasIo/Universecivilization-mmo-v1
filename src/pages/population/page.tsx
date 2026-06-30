import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePopulationSystem } from '../../hooks/usePopulationSystem';
import { resourceTypes } from '../../data/craftingMaterials';

export default function PopulationPage() {
  const { user } = useAuth();
  const {
    populations: locations,
    events,
    loading,
    locationTypes,
    specializations,
    addLocation,
    upgradeProduction,
    addResources,
    transferPopulation,
    setSpecialization,
    upgradeSpecialization,
    reducePollution,
    improveSecurity,
    boostCulture,
    getSpecializationInfo,
    getLocationTypeInfo
  } = usePopulationSystem(user?.id || '');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSpecializationModal, setShowSpecializationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [newLocation, setNewLocation] = useState({
    name: '',
    type: 'planet' as any
  });

  const handleSetSpecialization = async (specialization: string) => {
    if (!selectedLocation) return;
    
    const result = await setSpecialization(selectedLocation.locationId, specialization);
    if (result.success) {
      setShowSpecializationModal(false);
      setSelectedLocation(null);
    } else {
      alert(result.error);
    }
  };

  const handleUpgradeSpecialization = async (locationId: string) => {
    const result = await upgradeSpecialization(locationId);
    if (result.success) {
      alert(`Specialization upgraded to level ${result.newLevel}! Bonus: +${result.newBonus}%`);
    } else {
      alert(result.error);
    }
  };

  const handleReducePollution = async (locationId: string) => {
    const amount = parseInt(prompt('How much pollution to reduce? (Cost: 1000 credits per point)') || '0');
    if (amount > 0) {
      const result = await reducePollution(locationId, amount);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleImproveSecurity = async (locationId: string) => {
    if (confirm('Improve security by 10 points? Cost: 50,000 credits')) {
      const result = await improveSecurity(locationId);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleBoostCulture = async (locationId: string) => {
    if (confirm('Boost culture by 10 points? Cost: 30,000 credits')) {
      const result = await boostCulture(locationId);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleUpgradeProduction = async (locationId: string, resourceType: 'food' | 'water' | 'oxygen' | 'energy') => {
    const cost = 10000;
    const confirm = window.confirm(
      `Upgrade ${resourceType} production?\n\n` +
      `Cost: ${cost.toLocaleString()} credits\n` +
      `This will increase ${resourceType} production by 10%`
    );
    
    if (confirm) {
      const result = await upgradeProduction(locationId, resourceType);
      if (result.success) {
        alert(`✅ ${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} production upgraded!`);
      } else {
        alert(result.error || 'Failed to upgrade production');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Population System...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Population Management</h1>
          <p className="text-purple-200">Manage your colonies, habitats, and population across the galaxy</p>
        </div>

        {/* Add Location Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all whitespace-nowrap"
          >
            <i className="ri-add-line mr-2"></i>
            Add New Location
          </button>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {locations.map(location => {
            const typeInfo = getLocationTypeInfo(location.locationType);
            const specInfo = location.specialization ? getSpecializationInfo(location.specialization) : null;
            
            return (
              <div key={location.locationId} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                {/* Location Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-3xl">{typeInfo?.icon}</span>
                      <h3 className="text-2xl font-bold text-white">{location.locationName}</h3>
                    </div>
                    <p className="text-sm text-slate-400">{typeInfo?.name}</p>
                    {specInfo && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xl">{specInfo.icon}</span>
                        <span className="text-sm text-purple-400">
                          {specInfo.name} (Lv.{location.specializationLevel}) +{location.specializationBonus}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-400">
                      {location.population.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">
                      / {location.maxPopulation.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Population Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Happiness</span>
                      <span className="text-white">{location.happiness}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                        style={{ width: `${location.happiness}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Health</span>
                      <span className="text-white">{location.health}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: `${location.health}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Education</span>
                      <span className="text-white">{location.education}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${location.education}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Security</span>
                      <span className="text-white">{location.security}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
                        style={{ width: `${location.security}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Advanced Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-slate-900 rounded p-2 text-center">
                    <div className="text-xs text-slate-400">Pollution</div>
                    <div className={`text-lg font-bold ${location.pollution > 50 ? 'text-red-400' : 'text-green-400'}`}>
                      {location.pollution}%
                    </div>
                  </div>
                  <div className="bg-slate-900 rounded p-2 text-center">
                    <div className="text-xs text-slate-400">Crime</div>
                    <div className={`text-lg font-bold ${location.crime > 50 ? 'text-red-400' : 'text-green-400'}`}>
                      {location.crime}%
                    </div>
                  </div>
                  <div className="bg-slate-900 rounded p-2 text-center">
                    <div className="text-xs text-slate-400">Culture</div>
                    <div className="text-lg font-bold text-purple-400">{location.culture}%</div>
                  </div>
                </div>

                {/* Life Support Resources */}
                <div className="space-y-2 mb-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">🍖 Food</span>
                      <span className={location.foodProduction >= location.foodConsumption ? 'text-green-400' : 'text-red-400'}>
                        {location.foodProduction} / {location.foodConsumption}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${location.foodProduction >= location.foodConsumption ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(100, (location.foodProduction / location.foodConsumption) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">💧 Water</span>
                      <span className={location.waterProduction >= location.waterConsumption ? 'text-green-400' : 'text-red-400'}>
                        {location.waterProduction} / {location.waterConsumption}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${location.waterProduction >= location.waterConsumption ? 'bg-blue-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(100, (location.waterProduction / location.waterConsumption) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">🌬️ Oxygen</span>
                      <span className={location.oxygenProduction >= location.oxygenConsumption ? 'text-green-400' : 'text-red-400'}>
                        {location.oxygenProduction} / {location.oxygenConsumption}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${location.oxygenProduction >= location.oxygenConsumption ? 'bg-cyan-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(100, (location.oxygenProduction / location.oxygenConsumption) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">⚡ Energy</span>
                      <span className={location.energyProduction >= location.energyConsumption ? 'text-green-400' : 'text-red-400'}>
                        {location.energyProduction} / {location.energyConsumption}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${location.energyProduction >= location.energyConsumption ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(100, (location.energyProduction / location.energyConsumption) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {!location.specialization ? (
                    <button
                      onClick={() => {
                        setSelectedLocation(location);
                        setShowSpecializationModal(true);
                      }}
                      className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded text-sm font-semibold hover:from-purple-600 hover:to-pink-600 transition-all whitespace-nowrap"
                    >
                      <i className="ri-star-line mr-1"></i>
                      Set Specialization
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgradeSpecialization(location.locationId)}
                      className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded text-sm font-semibold hover:from-purple-600 hover:to-pink-600 transition-all whitespace-nowrap"
                    >
                      <i className="ri-arrow-up-line mr-1"></i>
                      Upgrade Spec
                    </button>
                  )}
                  
                  {location.pollution > 20 && (
                    <button
                      onClick={() => handleReducePollution(location.locationId)}
                      className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded text-sm font-semibold hover:from-green-600 hover:to-emerald-600 transition-all whitespace-nowrap"
                    >
                      <i className="ri-leaf-line mr-1"></i>
                      Clean Up
                    </button>
                  )}
                  
                  {location.security < 80 && (
                    <button
                      onClick={() => handleImproveSecurity(location.locationId)}
                      className="px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded text-sm font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all whitespace-nowrap"
                    >
                      <i className="ri-shield-line mr-1"></i>
                      Security
                    </button>
                  )}
                  
                  {location.culture < 80 && (
                    <button
                      onClick={() => handleBoostCulture(location.locationId)}
                      className="px-3 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded text-sm font-semibold hover:from-pink-600 hover:to-rose-600 transition-all whitespace-nowrap"
                    >
                      <i className="ri-palette-line mr-1"></i>
                      Culture
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleUpgradeProduction(location.locationId, 'food')}
                    className="px-3 py-2 bg-slate-700 text-white rounded text-sm hover:bg-slate-600 transition-all whitespace-nowrap"
                  >
                    <i className="ri-restaurant-line mr-1"></i>
                    Food
                  </button>
                  <button
                    onClick={() => handleUpgradeProduction(location.locationId, 'water')}
                    className="px-3 py-2 bg-slate-700 text-white rounded text-sm hover:bg-slate-600 transition-all whitespace-nowrap"
                  >
                    <i className="ri-drop-line mr-1"></i>
                    Water
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Events */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4">
            <i className="ri-notification-line mr-2"></i>
            Recent Events
          </h2>
          <div className="space-y-3">
            {events.slice(0, 10).map(event => (
              <div key={event.id} className="bg-slate-900 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-semibold mb-1">{event.type}</h3>
                    <p className="text-slate-400 text-sm">{event.message}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {event.impact !== 0 && (
                      <div className={`text-sm ${event.impact > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        Impact: {event.impact > 0 ? '+' : ''}{event.impact}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specialization Modal */}
        {showSpecializationModal && selectedLocation && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-bold text-white mb-6">
                Choose Specialization for {selectedLocation.locationName}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {specializations.map(spec => (
                  <div
                    key={spec.type}
                    onClick={() => handleSetSpecialization(spec.type)}
                    className="bg-slate-900 rounded-lg p-6 border-2 border-slate-700 hover:border-purple-500 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">{spec.icon}</span>
                      <h3 className="text-xl font-bold text-white">{spec.name}</h3>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">{spec.description}</p>
                    <div className="space-y-1">
                      <div className="text-sm text-slate-300">Bonuses:</div>
                      {Object.entries(spec.bonuses).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="text-slate-400">{key}:</span>
                          <span className={`ml-2 font-semibold ${value > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {value > 0 ? '+' : ''}{value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowSpecializationModal(false);
                  setSelectedLocation(null);
                }}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Add Location Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Add New Location</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-white font-semibold mb-2 block">Location Name</label>
                  <input
                    type="text"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                    placeholder="Enter location name..."
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-white font-semibold mb-2 block">Location Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {locationTypes.map(type => (
                      <button
                        key={type.value}
                        onClick={() => setNewLocation({ ...newLocation, type: type.value as any })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          newLocation.type === type.value
                            ? 'border-blue-500 bg-blue-900/50'
                            : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                        }`}
                      >
                        <i className={`${type.icon} ${type.color} text-2xl mb-1`}></i>
                        <div className="text-white text-sm font-semibold">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newLocation.name.trim()) {
                      alert('Please enter a location name');
                      return;
                    }

                    const result = addLocation(newLocation.name, newLocation.type);
                    if (result.success) {
                      setShowAddModal(false);
                      setNewLocation({ name: '', type: 'planet' as any });
                    } else {
                      alert(result.message);
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Add Location
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
