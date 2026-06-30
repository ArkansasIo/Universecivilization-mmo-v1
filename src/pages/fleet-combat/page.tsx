import { useState } from 'react';
import { useEnhancedShips } from '../../hooks/useEnhancedShips';
import { useMothershipManager } from '../../hooks/useMothershipManager';

interface FleetComposition {
  id: string;
  name: string;
  ships: Array<{
    shipId: string;
    quantity: number;
  }>;
  motherships: Array<{
    mothershipId: string;
    quantity: number;
  }>;
  totalPower: number;
  totalCrew: number;
}

export default function FleetCombatPage() {
  const { ships, calculateCombatPower } = useEnhancedShips();
  const { motherships } = useMothershipManager();
  
  const [playerFleet, setPlayerFleet] = useState<FleetComposition>({
    id: 'player',
    name: 'Your Fleet',
    ships: [],
    motherships: [],
    totalPower: 0,
    totalCrew: 0
  });
  
  const [enemyFleet, setEnemyFleet] = useState<FleetComposition>({
    id: 'enemy',
    name: 'Enemy Fleet',
    ships: [],
    motherships: [],
    totalPower: 0,
    totalCrew: 0
  });
  
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [battleInProgress, setBattleInProgress] = useState(false);
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);

  const addShipToFleet = (fleetType: 'player' | 'enemy', shipId: string) => {
    const fleet = fleetType === 'player' ? playerFleet : enemyFleet;
    const setFleet = fleetType === 'player' ? setPlayerFleet : setEnemyFleet;
    
    const existingShip = fleet.ships.find(s => s.shipId === shipId);
    if (existingShip) {
      setFleet({
        ...fleet,
        ships: fleet.ships.map(s => 
          s.shipId === shipId ? { ...s, quantity: s.quantity + 1 } : s
        )
      });
    } else {
      setFleet({
        ...fleet,
        ships: [...fleet.ships, { shipId, quantity: 1 }]
      });
    }
    updateFleetStats(fleetType);
  };

  const addMothershipToFleet = (fleetType: 'player' | 'enemy', mothershipId: string) => {
    const fleet = fleetType === 'player' ? playerFleet : enemyFleet;
    const setFleet = fleetType === 'player' ? setPlayerFleet : setEnemyFleet;
    
    const existingMothership = fleet.motherships.find(m => m.mothershipId === mothershipId);
    if (existingMothership) {
      setFleet({
        ...fleet,
        motherships: fleet.motherships.map(m => 
          m.mothershipId === mothershipId ? { ...m, quantity: m.quantity + 1 } : m
        )
      });
    } else {
      setFleet({
        ...fleet,
        motherships: [...fleet.motherships, { mothershipId, quantity: 1 }]
      });
    }
    updateFleetStats(fleetType);
  };

  const updateFleetStats = (fleetType: 'player' | 'enemy') => {
    const fleet = fleetType === 'player' ? playerFleet : enemyFleet;
    const setFleet = fleetType === 'player' ? setPlayerFleet : setEnemyFleet;
    
    let totalPower = 0;
    let totalCrew = 0;
    
    fleet.ships.forEach(({ shipId, quantity }) => {
      const ship = ships.find(s => s.id === shipId);
      if (ship) {
        totalPower += calculateCombatPower(ship) * quantity;
        totalCrew += ship.crew.total * quantity;
      }
    });
    
    fleet.motherships.forEach(({ mothershipId, quantity }) => {
      const mothership = motherships.find(m => m.id === mothershipId);
      if (mothership) {
        totalPower += calculateCombatPower(mothership) * quantity;
        totalCrew += mothership.crew.total * quantity;
      }
    });
    
    setFleet({ ...fleet, totalPower, totalCrew });
  };

  const simulateBattle = () => {
    setBattleInProgress(true);
    setBattleLog([]);
    setBattleResult(null);
    
    const log: string[] = [];
    log.push('⚔️ Battle Commencing!');
    log.push(`${playerFleet.name}: ${playerFleet.totalPower.toLocaleString()} Combat Power`);
    log.push(`${enemyFleet.name}: ${enemyFleet.totalPower.toLocaleString()} Combat Power`);
    log.push('---');
    
    let playerHP = playerFleet.totalPower;
    let enemyHP = enemyFleet.totalPower;
    let round = 1;
    
    const interval = setInterval(() => {
      if (playerHP <= 0 || enemyHP <= 0) {
        clearInterval(interval);
        if (playerHP > enemyHP) {
          log.push('🎉 VICTORY! Your fleet has triumphed!');
          setBattleResult('victory');
        } else {
          log.push('💀 DEFEAT! Your fleet has been destroyed!');
          setBattleResult('defeat');
        }
        setBattleLog([...log]);
        setBattleInProgress(false);
        return;
      }
      
      const playerDamage = Math.floor(playerFleet.totalPower * 0.1 * (0.8 + Math.random() * 0.4));
      const enemyDamage = Math.floor(enemyFleet.totalPower * 0.1 * (0.8 + Math.random() * 0.4));
      
      enemyHP -= playerDamage;
      playerHP -= enemyDamage;
      
      log.push(`Round ${round}:`);
      log.push(`  Your fleet deals ${playerDamage.toLocaleString()} damage`);
      log.push(`  Enemy fleet deals ${enemyDamage.toLocaleString()} damage`);
      log.push(`  Your HP: ${Math.max(0, playerHP).toLocaleString()} | Enemy HP: ${Math.max(0, enemyHP).toLocaleString()}`);
      log.push('---');
      
      setBattleLog([...log]);
      round++;
    }, 1000);
  };

  const clearFleet = (fleetType: 'player' | 'enemy') => {
    const setFleet = fleetType === 'player' ? setPlayerFleet : setEnemyFleet;
    setFleet({
      id: fleetType,
      name: fleetType === 'player' ? 'Your Fleet' : 'Enemy Fleet',
      ships: [],
      motherships: [],
      totalPower: 0,
      totalCrew: 0
    });
  };

  return (
    <div className="text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#d4a853] to-[#e2c044] mb-2">
            Fleet Combat Simulator
          </h1>
          <p className="text-slate-400 text-lg">Compose your fleet and simulate epic space battles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Player Fleet */}
          <div className="bg-[#080b0f] border border-cyan-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-cyan-400">Your Fleet</h2>
              <button
                onClick={() => clearFleet('player')}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg text-red-400 transition-all whitespace-nowrap"
              >
                Clear Fleet
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">Combat Power</div>
                <div className="text-2xl font-bold text-cyan-400">{playerFleet.totalPower.toLocaleString()}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">Total Crew</div>
                <div className="text-2xl font-bold text-purple-400">{playerFleet.totalCrew.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              {playerFleet.ships.map(({ shipId, quantity }) => {
                const ship = ships.find(s => s.id === shipId);
                return ship ? (
                  <div key={shipId} className="bg-slate-800/30 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{ship.name}</div>
                      <div className="text-sm text-slate-400">Power: {calculateCombatPower(ship).toLocaleString()}</div>
                    </div>
                    <div className="text-cyan-400 font-bold">x{quantity}</div>
                  </div>
                ) : null;
              })}
              {playerFleet.motherships.map(({ mothershipId, quantity }) => {
                const mothership = motherships.find(m => m.id === mothershipId);
                return mothership ? (
                  <div key={mothershipId} className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-3 flex items-center justify-between border border-purple-500/30">
                    <div>
                      <div className="font-semibold text-purple-300">{mothership.name}</div>
                      <div className="text-sm text-slate-400">Power: {calculateCombatPower(mothership).toLocaleString()}</div>
                    </div>
                    <div className="text-purple-400 font-bold">x{quantity}</div>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          {/* Enemy Fleet */}
          <div className="bg-[#080b0f] border border-red-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-red-400">Enemy Fleet</h2>
              <button
                onClick={() => clearFleet('enemy')}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg text-red-400 transition-all whitespace-nowrap"
              >
                Clear Fleet
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">Combat Power</div>
                <div className="text-2xl font-bold text-red-400">{enemyFleet.totalPower.toLocaleString()}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">Total Crew</div>
                <div className="text-2xl font-bold text-orange-400">{enemyFleet.totalCrew.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              {enemyFleet.ships.map(({ shipId, quantity }) => {
                const ship = ships.find(s => s.id === shipId);
                return ship ? (
                  <div key={shipId} className="bg-slate-800/30 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{ship.name}</div>
                      <div className="text-sm text-slate-400">Power: {calculateCombatPower(ship).toLocaleString()}</div>
                    </div>
                    <div className="text-red-400 font-bold">x{quantity}</div>
                  </div>
                ) : null;
              })}
              {enemyFleet.motherships.map(({ mothershipId, quantity }) => {
                const mothership = motherships.find(m => m.id === mothershipId);
                return mothership ? (
                  <div key={mothershipId} className="bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-lg p-3 flex items-center justify-between border border-red-500/30">
                    <div>
                      <div className="font-semibold text-red-300">{mothership.name}</div>
                      <div className="text-sm text-slate-400">Power: {calculateCombatPower(mothership).toLocaleString()}</div>
                    </div>
                    <div className="text-red-400 font-bold">x{quantity}</div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>

        {/* Ship Selection */}
        <div className="bg-[#080b0f] border border-[#1e2a36] rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Add Ships to Fleet</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ships.slice(0, 6).map(ship => (
              <div key={ship.id} className="bg-[#080b0f] rounded-lg p-4 border border-[#1e2a36]">
                <div className="font-semibold text-white mb-2">{ship.name}</div>
                <div className="text-sm text-slate-400 mb-3">
                  Power: {calculateCombatPower(ship).toLocaleString()}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => addShipToFleet('player', ship.id)}
                    className="flex-1 px-3 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/50 rounded-lg text-cyan-400 transition-all whitespace-nowrap"
                  >
                    Add to Your Fleet
                  </button>
                  <button
                    onClick={() => addShipToFleet('enemy', ship.id)}
                    className="flex-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg text-red-400 transition-all whitespace-nowrap"
                  >
                    Add to Enemy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mothership Selection */}
        <div className="bg-[#080b0f] border border-[#1e2a36] rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Add Motherships to Fleet</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {motherships.slice(0, 4).map(mothership => (
              <div key={mothership.id} className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 border border-purple-500/30">
                <div className="font-semibold text-purple-300 mb-2">{mothership.name}</div>
                <div className="text-sm text-slate-400 mb-3">
                  Power: {calculateCombatPower(mothership).toLocaleString()}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => addMothershipToFleet('player', mothership.id)}
                    className="flex-1 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 rounded-lg text-purple-400 transition-all whitespace-nowrap"
                  >
                    Add to Your Fleet
                  </button>
                  <button
                    onClick={() => addMothershipToFleet('enemy', mothership.id)}
                    className="flex-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg text-red-400 transition-all whitespace-nowrap"
                  >
                    Add to Enemy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Battle Controls */}
        <div className="bg-[#080b0f] border border-[#1e2a36] rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Battle Simulation</h3>
            <button
              onClick={simulateBattle}
              disabled={battleInProgress || playerFleet.ships.length === 0 || enemyFleet.ships.length === 0}
              className="px-6 py-3 bg-gradient-to-r from-[#d4a853] to-[#e2c044] text-[#080b0f] hover:from-amber-400 hover:to-amber-300 disabled:from-[#1e2a36] disabled:to-[#1e2a36] disabled:text-[#5a6577] disabled:cursor-not-allowed rounded-lg font-bold transition-all whitespace-nowrap"
            >
              {battleInProgress ? 'Battle in Progress...' : 'Start Battle'}
            </button>
          </div>
          
          {battleResult && (
            <div className={`mb-4 p-4 rounded-lg border-2 ${
              battleResult === 'victory' 
                ? 'bg-green-900/20 border-green-500/50 text-green-400' 
                : 'bg-red-900/20 border-red-500/50 text-red-400'
            }`}>
              <div className="text-2xl font-bold text-center">
                {battleResult === 'victory' ? '🎉 VICTORY!' : '💀 DEFEAT!'}
              </div>
            </div>
          )}
          
          <div className="bg-slate-800/50 rounded-lg p-4 h-96 overflow-y-auto">
            {battleLog.length === 0 ? (
              <div className="text-slate-500 text-center py-8">
                Configure your fleets and start the battle to see the combat log
              </div>
            ) : (
              <div className="space-y-1 font-mono text-sm">
                {battleLog.map((log, index) => (
                  <div key={index} className={`${
                    log.includes('VICTORY') ? 'text-green-400 font-bold' :
                    log.includes('DEFEAT') ? 'text-red-400 font-bold' :
                    log.includes('Your fleet') ? 'text-cyan-400' :
                    log.includes('Enemy fleet') ? 'text-red-400' :
                    log.includes('Round') ? 'text-yellow-400 font-semibold' :
                    'text-slate-300'
                  }`}>
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}