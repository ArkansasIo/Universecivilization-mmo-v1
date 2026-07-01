import { useState } from 'react';
import { useEnhancedShips } from '../../hooks/useEnhancedShips';
import { enhancedShips } from '../../data/enhancedShips';
import PageLoading from '@/components/PageLoading';

export default function EnhancedShipsPage() {
  const { loading, buildShip, calculateShipPower } = useEnhancedShips();
  const [selectedShip, setSelectedShip] = useState<typeof enhancedShips[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'weapons' | 'systems'>('overview');

  if (loading) {
    return <PageLoading message="Loading Enhanced Ships..." className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-purple-500" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <i className="ri-rocket-2-fill text-purple-400"></i>
            Enhanced Ship Systems
          </h1>
          <p className="text-purple-200">Advanced warships with comprehensive stats and capabilities</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <i className="ri-ship-fill text-purple-400"></i>
                Available Ships
              </h2>
              <div className="space-y-3">
                {enhancedShips.map((ship) => (
                  <div
                    key={ship.id}
                    onClick={() => setSelectedShip(ship)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedShip?.id === ship.id
                        ? 'bg-purple-500/30 border-2 border-purple-400'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-white text-sm">{ship.name}</h3>
                        <p className="text-xs text-purple-300">{ship.class} - Tier {ship.tier}</p>
                      </div>
                      <span className="px-2 py-1 bg-purple-500/30 rounded text-xs text-purple-200">
                        {ship.rarity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <span className="flex items-center gap-1">
                        <i className="ri-shield-fill text-blue-400"></i>
                        {(ship.hull.maximum / 1000000).toFixed(1)}M
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="ri-sword-fill text-red-400"></i>
                        {(ship.weapons.totalFirepower / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedShip && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => buildShip(selectedShip)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <i className="ri-hammer-fill"></i>
                    Build Ship
                  </button>
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                    <i className="ri-information-fill"></i>
                    View Details
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {selectedShip ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={selectedShip.image}
                    alt={selectedShip.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedShip.name}</h2>
                    <p className="text-purple-200">{selectedShip.description}</p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex gap-2 mb-6 border-b border-white/20">
                    {(['overview', 'stats', 'weapons', 'systems'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-semibold capitalize transition-all whitespace-nowrap ${
                          activeTab === tab
                            ? 'text-purple-400 border-b-2 border-purple-400'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="text-gray-400 text-sm mb-1">Combat Power</div>
                          <div className="text-2xl font-bold text-purple-400">
                            {(calculateShipPower(selectedShip) / 1000000).toFixed(1)}M
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="text-gray-400 text-sm mb-1">Hull HP</div>
                          <div className="text-2xl font-bold text-blue-400">
                            {(selectedShip.hull.maximum / 1000000).toFixed(1)}M
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="text-gray-400 text-sm mb-1">Shield HP</div>
                          <div className="text-2xl font-bold text-cyan-400">
                            {(selectedShip.shields.maximum / 1000000).toFixed(1)}M
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="text-gray-400 text-sm mb-1">Firepower</div>
                          <div className="text-2xl font-bold text-red-400">
                            {(selectedShip.weapons.totalFirepower / 1000000).toFixed(1)}M
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-white mb-3">Lore</h3>
                        <p className="text-gray-300 leading-relaxed">{selectedShip.lore}</p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-white mb-3">Special Abilities</h3>
                        <div className="space-y-3">
                          {selectedShip.abilities.map((ability, index) => (
                            <div key={index} className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-bold text-purple-300">{ability.name}</h4>
                                  <p className="text-sm text-gray-400">{ability.description}</p>
                                </div>
                                <span className="px-2 py-1 bg-purple-500/30 rounded text-xs text-purple-200 whitespace-nowrap">
                                  {ability.type}
                                </span>
                              </div>
                              {ability.cooldown && (
                                <div className="text-xs text-gray-400">
                                  Cooldown: {ability.cooldown}s
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'stats' && (
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <i className="ri-shield-fill text-blue-400"></i>
                          Hull & Armor
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-400">Maximum HP:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.hull.maximum.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Armor:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.hull.armor.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Armor Type:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.hull.armorType}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Damage Reduction:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.hull.damageReduction}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Hull Regen:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.hull.hullRegeneration}/s
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Integrity:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.hull.structuralIntegrity}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <i className="ri-shield-star-fill text-cyan-400"></i>
                          Shield Systems
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-400">Maximum Shields:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.shields.maximum.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Shield Type:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.shields.shieldType}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Recharge Rate:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.shields.rechargeRate}/s
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Efficiency:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.shields.efficiency}%
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">Resistances</h4>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            {Object.entries(selectedShip.shields.resistance).map(([type, value]) => (
                              <div key={type} className="bg-white/5 rounded px-2 py-1">
                                <span className="text-gray-400 capitalize">{type}:</span>
                                <span className="text-white ml-1 font-semibold">{value}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <i className="ri-team-fill text-yellow-400"></i>
                          Crew & Personnel
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-400">Total Crew:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.crew.maximum.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Officers:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.crew.officers.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Engineers:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.crew.engineers.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Gunners:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.crew.gunners.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Marines:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.crew.marines.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Morale:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.crew.morale}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <i className="ri-speed-fill text-green-400"></i>
                          Mobility
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-400">Speed:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.mobility.speed}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Agility:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.mobility.agility}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Evasion:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.mobility.evasion}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">FTL Speed:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.mobility.ftlSpeed}c
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'weapons' && (
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <i className="ri-sword-fill text-red-400"></i>
                          Primary Weapons
                        </h3>
                        <div className="space-y-3">
                          {selectedShip.weapons.primary.map((weapon, index) => (
                            <div key={index} className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-bold text-white">{weapon.name}</h4>
                                  <p className="text-sm text-gray-400">{weapon.type} Weapon</p>
                                </div>
                                <span className="px-2 py-1 bg-red-500/30 rounded text-xs text-red-200 whitespace-nowrap">
                                  {weapon.slots} Slots
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div>
                                  <span className="text-gray-400">Damage:</span>
                                  <span className="text-white ml-1 font-semibold">
                                    {weapon.damage.toLocaleString()}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-400">DPS:</span>
                                  <span className="text-white ml-1 font-semibold">
                                    {weapon.dps.toLocaleString()}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Range:</span>
                                  <span className="text-white ml-1 font-semibold">
                                    {weapon.range.toLocaleString()}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Accuracy:</span>
                                  <span className="text-white ml-1 font-semibold">
                                    {weapon.accuracy}%
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Penetration:</span>
                                  <span className="text-white ml-1 font-semibold">
                                    {weapon.penetration}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Tracking:</span>
                                  <span className="text-white ml-1 font-semibold">
                                    {weapon.tracking}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <i className="ri-rocket-fill text-orange-400"></i>
                          Secondary Weapons
                        </h3>
                        <div className="space-y-3">
                          {selectedShip.weapons.secondary.map((weapon, index) => (
                            <div key={index} className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-bold text-white">{weapon.name}</h4>
                                  <p className="text-sm text-gray-400">{weapon.type} Weapon</p>
                                </div>
                                <span className="px-2 py-1 bg-orange-500/30 rounded text-xs text-orange-200 whitespace-nowrap">
                                  {weapon.slots} Slots
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div>
                                  <span className="text-gray-400">Damage:</span>
                                  <span className="text-white ml-1 font-semibold">
                                    {weapon.damage.toLocaleString()}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Range:</span>
                                  <span className="text-white ml-1 font-semibold">
                                    {weapon.range.toLocaleString()}
                                  </span>
                                </div>
                                {weapon.ammunition && (
                                  <div>
                                    <span className="text-gray-400">Ammo:</span>
                                    <span className="text-white ml-1 font-semibold">
                                      {weapon.ammunition}/{weapon.maxAmmunition}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <i className="ri-flashlight-fill text-purple-400"></i>
                          Special Weapons
                        </h3>
                        <div className="space-y-3">
                          {selectedShip.weapons.special.map((weapon, index) => (
                            <div key={index} className="bg-white/5 rounded-lg p-3">
                              <h4 className="font-bold text-purple-300 mb-1">{weapon.name}</h4>
                              <p className="text-sm text-gray-400 mb-2">{weapon.effect}</p>
                              <div className="flex gap-4 text-xs">
                                {weapon.damage && (
                                  <div>
                                    <span className="text-gray-400">Damage:</span>
                                    <span className="text-white ml-1 font-semibold">
                                      {weapon.damage.toLocaleString()}
                                    </span>
                                  </div>
                                )}
                                <div>
                                  <span className="text-gray-400">Cooldown:</span>
                                  <span className="text-white ml-1 font-semibold">
                                    {weapon.cooldown}s
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Power Cost:</span>
                                  <span className="text-white ml-1 font-semibold">
                                    {weapon.powerCost.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'systems' && (
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <i className="ri-radar-fill text-cyan-400"></i>
                          Sensor Systems
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-400">Range:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.systems.sensors.range.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Resolution:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.systems.sensors.resolution}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Targeting:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.systems.sensors.targeting}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Jamming:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.systems.sensors.jamming}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <i className="ri-tools-fill text-yellow-400"></i>
                          Engineering Systems
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-400">Repair Rate:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.systems.engineering.repairRate}/s
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Efficiency:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.systems.engineering.efficiency}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Redundancy:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.systems.engineering.redundancy}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Damage Control:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.systems.engineering.damageControl}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <i className="ri-cpu-fill text-purple-400"></i>
                          Tactical Systems
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-400">Battle Computer:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.systems.tactical.battleComputer}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">AI Level:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.systems.tactical.aiLevel}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Fire Control:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.systems.tactical.fireControl}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Coordination:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.systems.tactical.coordination}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <i className="ri-battery-charge-fill text-green-400"></i>
                          Power Core
                        </h3>
                        <div className="mb-3">
                          <div className="text-sm text-gray-400 mb-1">Reactor Type</div>
                          <div className="text-white font-semibold">{selectedShip.power.reactor}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-400">Output:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.power.output.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Capacity:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.power.capacity.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Efficiency:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.power.efficiency}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Backup:</span>
                            <span className="text-white ml-2 font-semibold">
                              {selectedShip.power.backup.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">Power Distribution</h4>
                          <div className="space-y-2">
                            {Object.entries(selectedShip.power.distribution).map(([system, percentage]) => (
                              <div key={system}>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-400 capitalize">{system}</span>
                                  <span className="text-white font-semibold">{percentage}%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-12 text-center">
                <i className="ri-ship-line text-6xl text-purple-400 mb-4"></i>
                <h3 className="text-2xl font-bold text-white mb-2">Select a Ship</h3>
                <p className="text-gray-400">Choose a ship from the list to view its detailed specifications</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
