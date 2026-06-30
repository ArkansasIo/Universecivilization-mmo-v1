import { useState } from 'react';
import { useEnhancedShips } from '../../hooks/useEnhancedShips';

interface WeaponSlot {
  id: string;
  type: 'primary' | 'secondary' | 'special';
  weapon: any | null;
}

interface ShipLoadout {
  shipId: string;
  weapons: WeaponSlot[];
  modules: any[];
  upgrades: any[];
}

const availableWeapons = [
  { id: 'plasma-cannon', name: 'Plasma Cannon', type: 'primary', damage: 5000, dps: 2500, range: 8000, fireRate: 2, accuracy: 0.85, penetration: 0.6, cost: 50000 },
  { id: 'railgun', name: 'Railgun', type: 'primary', damage: 8000, dps: 2000, range: 15000, fireRate: 1, accuracy: 0.95, penetration: 0.9, cost: 75000 },
  { id: 'laser-array', name: 'Laser Array', type: 'primary', damage: 3000, dps: 3000, range: 10000, fireRate: 3, accuracy: 0.9, penetration: 0.5, cost: 60000 },
  { id: 'missile-launcher', name: 'Missile Launcher', type: 'secondary', damage: 15000, dps: 1500, range: 20000, fireRate: 0.5, accuracy: 0.8, penetration: 0.7, cost: 100000 },
  { id: 'torpedo-bay', name: 'Torpedo Bay', type: 'secondary', damage: 50000, dps: 2500, range: 25000, fireRate: 0.2, accuracy: 0.7, penetration: 0.95, cost: 200000 },
  { id: 'ion-cannon', name: 'Ion Cannon', type: 'special', damage: 10000, dps: 5000, range: 12000, fireRate: 2, accuracy: 0.85, penetration: 0.4, cost: 150000 },
];

const availableModules = [
  { id: 'shield-booster', name: 'Shield Booster', effect: '+25% Shield HP', bonus: { shields: 0.25 }, cost: 80000 },
  { id: 'armor-plating', name: 'Armor Plating', effect: '+30% Armor', bonus: { armor: 0.30 }, cost: 70000 },
  { id: 'engine-upgrade', name: 'Engine Upgrade', effect: '+20% Speed', bonus: { speed: 0.20 }, cost: 60000 },
  { id: 'reactor-core', name: 'Reactor Core', effect: '+40% Power Output', bonus: { power: 0.40 }, cost: 100000 },
  { id: 'targeting-computer', name: 'Targeting Computer', effect: '+15% Accuracy', bonus: { accuracy: 0.15 }, cost: 90000 },
  { id: 'repair-bay', name: 'Repair Bay', effect: '+50% Hull Regen', bonus: { hullRegen: 0.50 }, cost: 85000 },
];

export default function ShipCustomizationPage() {
  const { ships, upgradeShip } = useEnhancedShips();
  const [selectedShip, setSelectedShip] = useState<any>(null);
  const [loadout, setLoadout] = useState<ShipLoadout | null>(null);
  const [credits, setCredits] = useState(1000000);
  const [activeTab, setActiveTab] = useState<'weapons' | 'modules' | 'summary'>('weapons');

  const handleSelectShip = (ship: any) => {
    setSelectedShip(ship);
    setLoadout({
      shipId: ship.id,
      weapons: [
        { id: 'slot-1', type: 'primary', weapon: ship.weapons.primary[0] || null },
        { id: 'slot-2', type: 'primary', weapon: ship.weapons.primary[1] || null },
        { id: 'slot-3', type: 'secondary', weapon: ship.weapons.secondary[0] || null },
        { id: 'slot-4', type: 'special', weapon: null },
      ],
      modules: [],
      upgrades: [],
    });
  };

  const handleEquipWeapon = (slotId: string, weapon: any) => {
    if (!loadout || credits < weapon.cost) return;
    
    setLoadout({
      ...loadout,
      weapons: loadout.weapons.map(slot =>
        slot.id === slotId ? { ...slot, weapon } : slot
      ),
    });
    setCredits(credits - weapon.cost);
  };

  const handleUnequipWeapon = (slotId: string) => {
    if (!loadout) return;
    
    const slot = loadout.weapons.find(s => s.id === slotId);
    if (slot?.weapon) {
      setCredits(credits + (slot.weapon.cost || 0));
    }
    
    setLoadout({
      ...loadout,
      weapons: loadout.weapons.map(s =>
        s.id === slotId ? { ...s, weapon: null } : s
      ),
    });
  };

  const handleInstallModule = (module: any) => {
    if (!loadout || credits < module.cost || loadout.modules.length >= 6) return;
    
    setLoadout({
      ...loadout,
      modules: [...loadout.modules, module],
    });
    setCredits(credits - module.cost);
  };

  const handleRemoveModule = (moduleId: string) => {
    if (!loadout) return;
    
    const module = loadout.modules.find(m => m.id === moduleId);
    if (module) {
      setCredits(credits + module.cost);
    }
    
    setLoadout({
      ...loadout,
      modules: loadout.modules.filter(m => m.id !== moduleId),
    });
  };

  const calculateTotalStats = () => {
    if (!selectedShip || !loadout) return null;

    let totalDamage = 0;
    let totalDPS = 0;
    const bonuses = {
      shields: 1,
      armor: 1,
      speed: 1,
      power: 1,
      accuracy: 1,
      hullRegen: 1,
    };

    loadout.weapons.forEach(slot => {
      if (slot.weapon) {
        totalDamage += slot.weapon.damage || 0;
        totalDPS += slot.weapon.dps || 0;
      }
    });

    loadout.modules.forEach(module => {
      Object.keys(module.bonus).forEach(key => {
        if (key in bonuses) {
          bonuses[key as keyof typeof bonuses] += module.bonus[key];
        }
      });
    });

    return {
      totalDamage,
      totalDPS,
      shields: Math.round(selectedShip.shields.maxShields * bonuses.shields),
      armor: Math.round(selectedShip.hull.armor * bonuses.armor),
      speed: Math.round(selectedShip.mobility.speed * bonuses.speed),
      power: Math.round(selectedShip.powerCore.output * bonuses.power),
      accuracy: Math.min(0.99, selectedShip.weapons.primary[0]?.accuracy * bonuses.accuracy || 0.85),
      hullRegen: Math.round(selectedShip.hull.regeneration * bonuses.hullRegen),
    };
  };

  const handleSaveLoadout = () => {
    if (!selectedShip || !loadout) return;
    
    // Update ship with new loadout
    const updatedShip = {
      ...selectedShip,
      customLoadout: loadout,
    };
    
    upgradeShip(updatedShip);
    alert('Loadout saved successfully!');
  };

  const stats = calculateTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Ship Customization</h1>
          <p className="text-purple-300">Customize your ships with weapons, modules, and upgrades</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg px-4 py-2">
              <span className="text-yellow-300 font-semibold">Credits: {credits.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ship Selection */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Select Ship</h2>
              <div className="space-y-3">
                {ships.map(ship => (
                  <button
                    key={ship.id}
                    onClick={() => handleSelectShip(ship)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedShip?.id === ship.id
                        ? 'bg-cyan-500/20 border-cyan-500'
                        : 'bg-slate-700/30 border-slate-600 hover:border-purple-500'
                    }`}
                  >
                    <div className="font-semibold text-white">{ship.name}</div>
                    <div className="text-sm text-purple-300">{ship.class}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      Combat Power: {ship.combatPower?.toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Customization Panel */}
          <div className="lg:col-span-2">
            {selectedShip && loadout ? (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">{selectedShip.name}</h2>
                  <button
                    onClick={handleSaveLoadout}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap"
                  >
                    Save Loadout
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-slate-700">
                  {(['weapons', 'modules', 'summary'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-3 font-semibold capitalize transition-colors whitespace-nowrap ${
                        activeTab === tab
                          ? 'text-cyan-400 border-b-2 border-cyan-400'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Weapons Tab */}
                {activeTab === 'weapons' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Weapon Slots</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {loadout.weapons.map(slot => (
                          <div key={slot.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-purple-300 font-semibold capitalize">{slot.type} Slot</span>
                              {slot.weapon && (
                                <button
                                  onClick={() => handleUnequipWeapon(slot.id)}
                                  className="text-red-400 hover:text-red-300 text-sm whitespace-nowrap"
                                >
                                  Unequip
                                </button>
                              )}
                            </div>
                            {slot.weapon ? (
                              <div>
                                <div className="text-white font-semibold">{slot.weapon.name}</div>
                                <div className="text-sm text-slate-300 mt-1">
                                  Damage: {slot.weapon.damage?.toLocaleString()} | DPS: {slot.weapon.dps?.toLocaleString()}
                                </div>
                              </div>
                            ) : (
                              <div className="text-slate-500 text-sm">Empty Slot</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Available Weapons</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableWeapons.map(weapon => (
                          <div key={weapon.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-semibold">{weapon.name}</span>
                              <span className="text-yellow-400 text-sm">{weapon.cost.toLocaleString()} CR</span>
                            </div>
                            <div className="text-sm text-slate-300 mb-3">
                              <div>Damage: {weapon.damage.toLocaleString()} | DPS: {weapon.dps.toLocaleString()}</div>
                              <div>Range: {weapon.range.toLocaleString()}m | Accuracy: {(weapon.accuracy * 100).toFixed(0)}%</div>
                            </div>
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleEquipWeapon(e.target.value, weapon);
                                  e.target.value = '';
                                }
                              }}
                              className="w-full bg-slate-600 text-white rounded px-3 py-2 text-sm"
                              disabled={credits < weapon.cost}
                            >
                              <option value="">Equip to slot...</option>
                              {loadout.weapons
                                .filter(slot => slot.type === weapon.type)
                                .map(slot => (
                                  <option key={slot.id} value={slot.id}>
                                    {slot.type} - {slot.weapon ? slot.weapon.name : 'Empty'}
                                  </option>
                                ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Modules Tab */}
                {activeTab === 'modules' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Installed Modules ({loadout.modules.length}/6)</h3>
                      {loadout.modules.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {loadout.modules.map(module => (
                            <div key={module.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white font-semibold">{module.name}</span>
                                <button
                                  onClick={() => handleRemoveModule(module.id)}
                                  className="text-red-400 hover:text-red-300 text-sm whitespace-nowrap"
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="text-sm text-green-400">{module.effect}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-slate-500 text-center py-8">No modules installed</div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Available Modules</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableModules.map(module => (
                          <div key={module.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-semibold">{module.name}</span>
                              <span className="text-yellow-400 text-sm">{module.cost.toLocaleString()} CR</span>
                            </div>
                            <div className="text-sm text-green-400 mb-3">{module.effect}</div>
                            <button
                              onClick={() => handleInstallModule(module)}
                              disabled={credits < module.cost || loadout.modules.length >= 6}
                              className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-semibold transition-colors whitespace-nowrap"
                            >
                              Install Module
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary Tab */}
                {activeTab === 'summary' && stats && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg p-6 border border-cyan-500/30">
                      <h3 className="text-2xl font-bold text-white mb-4">Ship Statistics</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-slate-400 text-sm">Total Damage</div>
                          <div className="text-2xl font-bold text-white">{stats.totalDamage.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-sm">Total DPS</div>
                          <div className="text-2xl font-bold text-white">{stats.totalDPS.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-sm">Shield HP</div>
                          <div className="text-2xl font-bold text-cyan-400">{stats.shields.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-sm">Armor</div>
                          <div className="text-2xl font-bold text-orange-400">{stats.armor.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-sm">Speed</div>
                          <div className="text-2xl font-bold text-green-400">{stats.speed.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-sm">Power Output</div>
                          <div className="text-2xl font-bold text-yellow-400">{stats.power.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Equipped Weapons</h3>
                      <div className="space-y-2">
                        {loadout.weapons.filter(s => s.weapon).map(slot => (
                          <div key={slot.id} className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-semibold">{slot.weapon.name}</span>
                              <span className="text-purple-300 text-sm capitalize">{slot.type}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Installed Modules</h3>
                      <div className="space-y-2">
                        {loadout.modules.map(module => (
                          <div key={module.id} className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-semibold">{module.name}</span>
                              <span className="text-green-400 text-sm">{module.effect}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-12 text-center">
                <i className="ri-ship-line text-6xl text-slate-600 mb-4"></i>
                <p className="text-slate-400 text-lg">Select a ship to begin customization</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
