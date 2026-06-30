import { useState } from 'react';
import { Link } from 'react-router-dom';

interface ShipType {
  id: string;
  name: string;
  attack: number;
  shield: number;
  hull: number;
  speed: number;
  cargo: number;
  fuel: number;
}

interface DefenseType {
  id: string;
  name: string;
  attack: number;
  shield: number;
  hull: number;
}

export default function CombatSimulatorPage() {
  const [attackerFleet, setAttackerFleet] = useState<Record<string, number>>({});
  const [defenderFleet, setDefenderFleet] = useState<Record<string, number>>({});
  const [defenderDefense, setDefenderDefense] = useState<Record<string, number>>({});
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const shipTypes: ShipType[] = [
    { id: 'light-fighter', name: 'Light Fighter', attack: 50, shield: 10, hull: 400, speed: 12500, cargo: 50, fuel: 20 },
    { id: 'heavy-fighter', name: 'Heavy Fighter', attack: 150, shield: 25, hull: 1000, speed: 10000, cargo: 100, fuel: 75 },
    { id: 'cruiser', name: 'Cruiser', attack: 400, shield: 50, hull: 2700, speed: 15000, cargo: 800, fuel: 300 },
    { id: 'battleship', name: 'Battleship', attack: 1000, shield: 200, hull: 6000, speed: 10000, cargo: 1500, fuel: 500 },
    { id: 'battlecruiser', name: 'Battlecruiser', attack: 700, shield: 400, hull: 7000, speed: 10000, cargo: 750, fuel: 250 },
    { id: 'bomber', name: 'Bomber', attack: 1000, shield: 500, hull: 7500, speed: 4000, cargo: 500, fuel: 700 },
    { id: 'destroyer', name: 'Destroyer', attack: 2000, shield: 500, hull: 11000, speed: 5000, cargo: 2000, fuel: 1000 },
    { id: 'deathstar', name: 'Deathstar', attack: 200000, shield: 50000, hull: 900000, speed: 100, cargo: 1000000, fuel: 1 },
    { id: 'small-cargo', name: 'Small Cargo', attack: 5, shield: 10, hull: 400, speed: 5000, cargo: 5000, fuel: 20 },
    { id: 'large-cargo', name: 'Large Cargo', attack: 5, shield: 25, hull: 1200, speed: 7500, cargo: 25000, fuel: 50 },
    { id: 'colony-ship', name: 'Colony Ship', attack: 50, shield: 100, hull: 3000, speed: 2500, cargo: 7500, fuel: 1000 },
    { id: 'recycler', name: 'Recycler', attack: 1, shield: 10, hull: 1600, speed: 2000, cargo: 20000, fuel: 300 },
    { id: 'espionage-probe', name: 'Espionage Probe', attack: 0, shield: 0, hull: 100, speed: 100000000, cargo: 0, fuel: 1 },
    { id: 'solar-satellite', name: 'Solar Satellite', attack: 1, shield: 1, hull: 200, speed: 0, cargo: 0, fuel: 0 }
  ];

  const defenseTypes: DefenseType[] = [
    { id: 'rocket-launcher', name: 'Rocket Launcher', attack: 80, shield: 20, hull: 200 },
    { id: 'light-laser', name: 'Light Laser', attack: 100, shield: 25, hull: 200 },
    { id: 'heavy-laser', name: 'Heavy Laser', attack: 250, shield: 100, hull: 800 },
    { id: 'gauss-cannon', name: 'Gauss Cannon', attack: 1100, shield: 200, hull: 3500 },
    { id: 'ion-cannon', name: 'Ion Cannon', attack: 150, shield: 500, hull: 800 },
    { id: 'plasma-turret', name: 'Plasma Turret', attack: 3000, shield: 300, hull: 10000 },
    { id: 'small-shield-dome', name: 'Small Shield Dome', attack: 1, shield: 2000, hull: 2000 },
    { id: 'large-shield-dome', name: 'Large Shield Dome', attack: 1, shield: 10000, hull: 10000 },
    { id: 'anti-ballistic-missile', name: 'Anti-Ballistic Missile', attack: 1, shield: 1, hull: 800 },
    { id: 'interplanetary-missile', name: 'Interplanetary Missile', attack: 12000, shield: 1, hull: 1500 }
  ];

  const updateAttackerFleet = (shipId: string, count: number) => {
    setAttackerFleet(prev => ({ ...prev, [shipId]: Math.max(0, count) }));
  };

  const updateDefenderFleet = (shipId: string, count: number) => {
    setDefenderFleet(prev => ({ ...prev, [shipId]: Math.max(0, count) }));
  };

  const updateDefenderDefense = (defenseId: string, count: number) => {
    setDefenderDefense(prev => ({ ...prev, [defenseId]: Math.max(0, count) }));
  };

  const calculateCombat = () => {
    // Calculate total stats
    let attackerPower = 0;
    let attackerShield = 0;
    let attackerHull = 0;
    let attackerShipCount = 0;

    Object.entries(attackerFleet).forEach(([shipId, count]) => {
      const ship = shipTypes.find(s => s.id === shipId);
      if (ship && count > 0) {
        attackerPower += ship.attack * count;
        attackerShield += ship.shield * count;
        attackerHull += ship.hull * count;
        attackerShipCount += count;
      }
    });

    let defenderPower = 0;
    let defenderShield = 0;
    let defenderHull = 0;
    let defenderShipCount = 0;

    Object.entries(defenderFleet).forEach(([shipId, count]) => {
      const ship = shipTypes.find(s => s.id === shipId);
      if (ship && count > 0) {
        defenderPower += ship.attack * count;
        defenderShield += ship.shield * count;
        defenderHull += ship.hull * count;
        defenderShipCount += count;
      }
    });

    Object.entries(defenderDefense).forEach(([defenseId, count]) => {
      const defense = defenseTypes.find(d => d.id === defenseId);
      if (defense && count > 0) {
        defenderPower += defense.attack * count;
        defenderShield += defense.shield * count;
        defenderHull += defense.hull * count;
      }
    });

    // Simple combat calculation
    const attackerTotal = attackerPower + attackerShield + attackerHull;
    const defenderTotal = defenderPower + defenderShield + defenderHull;
    const totalPower = attackerTotal + defenderTotal;

    const attackerWinChance = totalPower > 0 ? (attackerTotal / totalPower) * 100 : 50;
    const defenderWinChance = 100 - attackerWinChance;

    // Calculate losses (simplified)
    const attackerLossPercent = Math.min(90, (defenderPower / (attackerShield + attackerHull + 1)) * 100);
    const defenderLossPercent = Math.min(90, (attackerPower / (defenderShield + defenderHull + 1)) * 100);

    const attackerLosses: Record<string, number> = {};
    Object.entries(attackerFleet).forEach(([shipId, count]) => {
      if (count > 0) {
        attackerLosses[shipId] = Math.floor(count * (attackerLossPercent / 100));
      }
    });

    const defenderLosses: Record<string, number> = {};
    Object.entries(defenderFleet).forEach(([shipId, count]) => {
      if (count > 0) {
        defenderLosses[shipId] = Math.floor(count * (defenderLossPercent / 100));
      }
    });

    const defenderDefenseLosses: Record<string, number> = {};
    Object.entries(defenderDefense).forEach(([defenseId, count]) => {
      if (count > 0) {
        defenderDefenseLosses[defenseId] = Math.floor(count * (defenderLossPercent / 100));
      }
    });

    // Calculate debris field
    const debrisMetal = Math.floor((attackerLossPercent / 100) * attackerShipCount * 1000);
    const debrisCrystal = Math.floor((defenderLossPercent / 100) * defenderShipCount * 800);

    setSimulationResult({
      attackerWinChance,
      defenderWinChance,
      attackerPower,
      defenderPower,
      attackerLosses,
      defenderLosses,
      defenderDefenseLosses,
      debrisMetal,
      debrisCrystal,
      winner: attackerWinChance > 50 ? 'attacker' : 'defender'
    });
  };

  const resetSimulation = () => {
    setAttackerFleet({});
    setDefenderFleet({});
    setDefenderDefense({});
    setSimulationResult(null);
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
            Combat Simulator
          </h1>
          <p className="text-gray-400 text-lg">Test your fleet against enemy forces before committing to battle</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Attacker Section */}
          <div className="bg-[#080b0f] border border-red-500/30 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-red-400 mb-4 flex items-center">
              <i className="ri-sword-line mr-3 w-6 h-6 flex items-center justify-center"></i>
              Attacker Fleet
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {shipTypes.map(ship => (
                <div key={ship.id} className="bg-slate-900/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{ship.name}</h3>
                      <div className="flex gap-3 text-xs text-gray-400 mt-1">
                        <span>⚔️ {ship.attack}</span>
                        <span>🛡️ {ship.shield}</span>
                        <span>❤️ {ship.hull}</span>
                      </div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={attackerFleet[ship.id] || 0}
                      onChange={(e) => updateAttackerFleet(ship.id, parseInt(e.target.value) || 0)}
                      className="w-24 px-3 py-2 bg-[#1e2a36] border border-[#1e2a36] rounded-lg text-white text-center focus:outline-none focus:border-red-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Defender Section */}
          <div className="bg-[#080b0f] border border-blue-500/30 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center">
              <i className="ri-shield-line mr-3 w-6 h-6 flex items-center justify-center"></i>
              Defender Forces
            </h2>
            
            {/* Defender Fleet */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">Fleet</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {shipTypes.map(ship => (
                  <div key={ship.id} className="bg-slate-900/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-sm">{ship.name}</h3>
                        <div className="flex gap-3 text-xs text-gray-400 mt-1">
                          <span>⚔️ {ship.attack}</span>
                          <span>🛡️ {ship.shield}</span>
                          <span>❤️ {ship.hull}</span>
                        </div>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={defenderFleet[ship.id] || 0}
                        onChange={(e) => updateDefenderFleet(ship.id, parseInt(e.target.value) || 0)}
                        className="w-24 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-center focus:outline-none focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Defender Defense */}
            <div>
              <h3 className="text-lg font-bold text-purple-400 mb-3">Defense Systems</h3>
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                {defenseTypes.map(defense => (
                  <div key={defense.id} className="bg-slate-900/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-sm">{defense.name}</h3>
                        <div className="flex gap-3 text-xs text-gray-400 mt-1">
                          <span>⚔️ {defense.attack}</span>
                          <span>🛡️ {defense.shield}</span>
                          <span>❤️ {defense.hull}</span>
                        </div>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={defenderDefense[defense.id] || 0}
                        onChange={(e) => updateDefenderDefense(defense.id, parseInt(e.target.value) || 0)}
                        className="w-24 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-center focus:outline-none focus:border-purple-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={calculateCombat}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-lg font-bold text-lg transition-all whitespace-nowrap cursor-pointer"
          >
            <i className="ri-sword-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>
            Simulate Battle
          </button>
          <button
            onClick={resetSimulation}
            className="px-8 py-4 bg-[#1e2a36] hover:bg-[#2a3a4a] text-white rounded-lg font-bold text-lg transition-all whitespace-nowrap cursor-pointer"
          >
            <i className="ri-refresh-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>
            Reset
          </button>
        </div>

        {/* Simulation Results */}
        {simulationResult && (
          <div className="bg-[#080b0f] border border-amber-500/30 rounded-xl p-6">
            <h2 className="text-3xl font-bold text-amber-400 mb-6 text-center flex items-center justify-center">
              <i className="ri-trophy-line mr-3 w-8 h-8 flex items-center justify-center"></i>
              Battle Simulation Results
            </h2>

            {/* Winner Banner */}
            <div className={`text-center mb-8 p-6 rounded-xl ${
              simulationResult.winner === 'attacker' 
                ? 'bg-red-500/20 border-2 border-red-500' 
                : 'bg-blue-500/20 border-2 border-blue-500'
            }`}>
              <div className="text-4xl font-black mb-2">
                {simulationResult.winner === 'attacker' ? '⚔️ ATTACKER VICTORY' : '🛡️ DEFENDER VICTORY'}
              </div>
              <div className="text-xl text-gray-300">
                {simulationResult.winner === 'attacker' 
                  ? `${simulationResult.attackerWinChance.toFixed(1)}% chance of victory`
                  : `${simulationResult.defenderWinChance.toFixed(1)}% chance of defense`
                }
              </div>
            </div>

            {/* Power Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-400 mb-4">Attacker Power</h3>
                <div className="text-4xl font-black text-white mb-2">{simulationResult.attackerPower.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Attack Power</div>
                <div className="mt-4 h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                    style={{ width: `${simulationResult.attackerWinChance}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Defender Power</h3>
                <div className="text-4xl font-black text-white mb-2">{simulationResult.defenderPower.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Defense Power</div>
                <div className="mt-4 h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${simulationResult.defenderWinChance}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Losses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Attacker Losses */}
              <div className="bg-[#080b0f] rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-400 mb-4">Attacker Losses</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {Object.entries(simulationResult.attackerLosses).map(([shipId, losses]) => {
                    const ship = shipTypes.find(s => s.id === shipId);
                    if (!ship || losses === 0) return null;
                    return (
                      <div key={shipId} className="flex justify-between items-center bg-slate-800/50 rounded-lg p-3">
                        <span className="text-white">{ship.name}</span>
                        <span className="text-red-400 font-bold">-{losses}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Defender Losses */}
              <div className="bg-[#080b0f] rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Defender Losses</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {Object.entries(simulationResult.defenderLosses).map(([shipId, losses]) => {
                    const ship = shipTypes.find(s => s.id === shipId);
                    if (!ship || losses === 0) return null;
                    return (
                      <div key={shipId} className="flex justify-between items-center bg-slate-800/50 rounded-lg p-3">
                        <span className="text-white">{ship.name}</span>
                        <span className="text-blue-400 font-bold">-{losses}</span>
                      </div>
                    );
                  })}
                  {Object.entries(simulationResult.defenderDefenseLosses).map(([defenseId, losses]) => {
                    const defense = defenseTypes.find(d => d.id === defenseId);
                    if (!defense || losses === 0) return null;
                    return (
                      <div key={defenseId} className="flex justify-between items-center bg-slate-800/50 rounded-lg p-3">
                        <span className="text-white">{defense.name}</span>
                        <span className="text-purple-400 font-bold">-{losses}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Debris Field */}
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center">
                <i className="ri-recycle-line mr-2 w-6 h-6 flex items-center justify-center"></i>
                Debris Field
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">{simulationResult.debrisMetal.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Metal</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-1">{simulationResult.debrisCrystal.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Crystal</div>
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-gray-400">
                Total Debris: {(simulationResult.debrisMetal + simulationResult.debrisCrystal).toLocaleString()} resources
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
