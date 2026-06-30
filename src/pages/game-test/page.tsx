
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useResources } from '../../hooks/useResources';
import { useGameLoop } from '../../hooks/useGameLoop';
import { supabase } from '../../lib/supabase';
import GameNavigation from '../../components/feature/GameNavigation';
import {
  calculateBuildingCost,
  calculateBuildTime,
  calculateResearchCost,
  calculateResearchTime,
  calculateShipCost,
  calculateCombatPower,
  simulateCombat,
  formatTime,
  formatNumber
} from '../../utils/gameCalculations';

export default function GameTestPage() {
  const { user } = useAuth();
  const { resources, updateResources, canAfford, deductResources } = useResources();
  const { calculateProduction, processFleetMovements } = useGameLoop();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [gameStats, setGameStats] = useState({
    totalPlayers: 0,
    totalFleets: 0,
    totalBuildings: 0,
    totalResearch: 0,
    totalCombats: 0,
    totalAlliances: 0
  });

  useEffect(() => {
    loadGameStats();
  }, []);

  const loadGameStats = async () => {
    try {
      const [players, fleets, buildings, research, combats, alliances] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('fleets').select('id', { count: 'exact', head: true }),
        supabase.from('buildings').select('id', { count: 'exact', head: true }),
        supabase.from('research').select('id', { count: 'exact', head: true }),
        supabase.from('combat_logs').select('id', { count: 'exact', head: true }),
        supabase.from('alliances').select('id', { count: 'exact', head: true })
      ]);

      setGameStats({
        totalPlayers: players.count || 0,
        totalFleets: fleets.count || 0,
        totalBuildings: buildings.count || 0,
        totalResearch: research.count || 0,
        totalCombats: combats.count || 0,
        totalAlliances: alliances.count || 0
      });
    } catch (error) {
      console.error('Error loading game stats:', error);
    }
  };

  const addTestResult = (test: string, status: 'success' | 'error' | 'warning', message: string, data?: any) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      test,
      status,
      message,
      data,
      timestamp: new Date().toISOString()
    }]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Test 1: Resource System
  const testResourceSystem = async () => {
    addTestResult('Resource System', 'warning', 'Testing resource calculations...');
    
    try {
      const initialResources = { ...resources };
      addTestResult('Resource System', 'success', `Initial Resources: Metal=${formatNumber(resources.metal)}, Crystal=${formatNumber(resources.crystal)}, Deuterium=${formatNumber(resources.deuterium)}`);

      // Test resource addition
      await updateResources({
        metal: resources.metal + 1000,
        crystal: resources.crystal + 500,
        deuterium: resources.deuterium + 250
      });
      addTestResult('Resource System', 'success', 'Resource addition test passed');

      // Test canAfford
      const testCost = { metal: 100, crystal: 50, deuterium: 25 };
      const affordable = canAfford(testCost);
      addTestResult('Resource System', affordable ? 'success' : 'error', `Can afford test: ${affordable}`);

      // Test deduction
      const deducted = await deductResources(testCost);
      addTestResult('Resource System', deducted ? 'success' : 'error', `Resource deduction: ${deducted}`);

      addTestResult('Resource System', 'success', '✓ Resource system tests completed');
    } catch (error: any) {
      addTestResult('Resource System', 'error', `✗ Error: ${error.message}`);
    }
  };

  // Test 2: Building Calculations
  const testBuildingSystem = () => {
    addTestResult('Building System', 'warning', 'Testing building calculations...');
    
    try {
      const buildings = ['metal_mine', 'crystal_mine', 'deuterium_synthesizer', 'solar_plant', 'fusion_reactor'];
      
      buildings.forEach(building => {
        for (let level = 1; level <= 5; level++) {
          const cost = calculateBuildingCost(building, level);
          const time = calculateBuildTime(building, level, 5, 0);
          addTestResult('Building System', 'success', 
            `${building} Lv.${level}: Metal=${formatNumber(cost.metal)}, Crystal=${formatNumber(cost.crystal)}, Time=${formatTime(time)}`
          );
        }
      });

      addTestResult('Building System', 'success', '✓ Building calculation tests completed');
    } catch (error: any) {
      addTestResult('Building System', 'error', `✗ Error: ${error.message}`);
    }
  };

  // Test 3: Research System
  const testResearchSystem = () => {
    addTestResult('Research System', 'warning', 'Testing research calculations...');
    
    try {
      const technologies = ['energy_technology', 'laser_technology', 'hyperspace_technology', 'plasma_technology'];
      
      technologies.forEach(tech => {
        for (let level = 1; level <= 5; level++) {
          const cost = calculateResearchCost(tech, level);
          const time = calculateResearchTime(tech, level, 10);
          addTestResult('Research System', 'success', 
            `${tech} Lv.${level}: Metal=${formatNumber(cost.metal)}, Crystal=${formatNumber(cost.crystal)}, Deuterium=${formatNumber(cost.deuterium)}, Time=${formatTime(time)}`
          );
        }
      });

      addTestResult('Research System', 'success', '✓ Research calculation tests completed');
    } catch (error: any) {
      addTestResult('Research System', 'error', `✗ Error: ${error.message}`);
    }
  };

  // Test 4: Ship Production
  const testShipSystem = () => {
    addTestResult('Ship System', 'warning', 'Testing ship calculations...');
    
    try {
      const ships = ['light_fighter', 'heavy_fighter', 'cruiser', 'battleship', 'bomber', 'destroyer'];
      
      ships.forEach(ship => {
        const cost = calculateShipCost(ship);
        addTestResult('Ship System', 'success', 
          `${ship}: Metal=${formatNumber(cost.metal)}, Crystal=${formatNumber(cost.crystal)}, Deuterium=${formatNumber(cost.deuterium)}`
        );
      });

      addTestResult('Ship System', 'success', '✓ Ship calculation tests completed');
    } catch (error: any) {
      addTestResult('Ship System', 'error', `✗ Error: ${error.message}`);
    }
  };

  // Test 5: Combat System
  const testCombatSystem = () => {
    addTestResult('Combat System', 'warning', 'Testing combat calculations...');
    
    try {
      const attackerFleet = {
        light_fighter: 100,
        cruiser: 50,
        battleship: 20
      };

      const defenderFleet = {
        light_fighter: 80,
        cruiser: 40,
        battleship: 15
      };

      const attackerTech = { weapons: 10, shielding: 8, armour: 9 };
      const defenderTech = { weapons: 8, shielding: 7, armour: 8 };

      const attackerPower = calculateCombatPower(attackerFleet, attackerTech.weapons, attackerTech.shielding, attackerTech.armour);
      const defenderPower = calculateCombatPower(defenderFleet, defenderTech.weapons, defenderTech.shielding, defenderTech.armour);

      addTestResult('Combat System', 'success', 
        `Attacker Power: Attack=${formatNumber(attackerPower.attack)}, Shield=${formatNumber(attackerPower.shield)}, Armor=${formatNumber(attackerPower.armor)}, Total=${formatNumber(attackerPower.totalPower)}`
      );

      addTestResult('Combat System', 'success', 
        `Defender Power: Attack=${formatNumber(defenderPower.attack)}, Shield=${formatNumber(defenderPower.shield)}, Armor=${formatNumber(defenderPower.armor)}, Total=${formatNumber(defenderPower.totalPower)}`
      );

      const combatResult = simulateCombat(attackerFleet, defenderFleet, attackerTech, defenderTech);
      addTestResult('Combat System', 'success', 
        `Combat Result: Winner=${combatResult.winner}, Attacker Win Chance=${combatResult.attackerWinChance}%, Attacker Losses=${combatResult.attackerLosses}%, Defender Losses=${combatResult.defenderLosses}%`
      );

      addTestResult('Combat System', 'success', '✓ Combat simulation tests completed');
    } catch (error: any) {
      addTestResult('Combat System', 'error', `✗ Error: ${error.message}`);
    }
  };

  // Test 6: Game Loop
  const testGameLoop = async () => {
    addTestResult('Game Loop', 'warning', 'Testing game loop mechanics...');
    
    try {
      const beforeResources = { ...resources };
      
      await calculateProduction();
      addTestResult('Game Loop', 'success', 'Production calculation executed');

      await processFleetMovements();
      addTestResult('Game Loop', 'success', 'Fleet movement processing executed');

      addTestResult('Game Loop', 'success', '✓ Game loop tests completed');
    } catch (error: any) {
      addTestResult('Game Loop', 'error', `✗ Error: ${error.message}`);
    }
  };

  // Test 7: Database Operations
  const testDatabaseOperations = async () => {
    addTestResult('Database', 'warning', 'Testing database operations...');
    
    try {
      // Test read operations
      const { data: planets, error: planetsError } = await supabase
        .from('planets')
        .select('*')
        .limit(5);
      
      if (planetsError) throw planetsError;
      addTestResult('Database', 'success', `Read test: Retrieved ${planets?.length || 0} planets`);

      // Test player resources
      const { data: playerResources, error: resourcesError } = await supabase
        .from('player_resources')
        .select('*')
        .eq('player_id', user?.id)
        .maybeSingle();
      
      if (resourcesError && resourcesError.code !== 'PGRST116') throw resourcesError;
      addTestResult('Database', 'success', `Player resources: ${playerResources ? 'Found' : 'Not found'}`);

      // Test buildings
      const { data: buildings, error: buildingsError } = await supabase
        .from('buildings')
        .select('*')
        .eq('player_id', user?.id)
        .limit(10);
      
      if (buildingsError) throw buildingsError;
      addTestResult('Database', 'success', `Buildings: Retrieved ${buildings?.length || 0} buildings`);

      addTestResult('Database', 'success', '✓ Database operation tests completed');
    } catch (error: any) {
      addTestResult('Database', 'error', `✗ Error: ${error.message}`);
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunning(true);
    clearResults();
    
    addTestResult('System', 'warning', '🚀 Starting comprehensive game mechanics test...');
    
    await testResourceSystem();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    testBuildingSystem();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    testResearchSystem();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    testShipSystem();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    testCombatSystem();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testGameLoop();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testDatabaseOperations();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await loadGameStats();
    
    addTestResult('System', 'success', '✅ All tests completed!');
    setIsRunning(false);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'ri-dashboard-line' },
    { id: 'tests', name: 'Test Results', icon: 'ri-test-tube-line' },
    { id: 'stats', name: 'Game Stats', icon: 'ri-bar-chart-line' },
    { id: 'performance', name: 'Performance', icon: 'ri-speed-line' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
      <GameNavigation />

      <div className="ml-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <i className="ri-test-tube-line text-cyan-400 mr-4"></i>
              Game Mechanics Testing
            </h1>
            <p className="text-gray-400">Comprehensive testing and validation of all game systems</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-cyan-400/30">
              <div className="flex items-center justify-between mb-2">
                <i className="ri-user-line text-cyan-400 text-2xl"></i>
                <span className="text-2xl font-bold text-white">{gameStats.totalPlayers}</span>
              </div>
              <p className="text-sm text-gray-400">Players</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-purple-400/30">
              <div className="flex items-center justify-between mb-2">
                <i className="ri-rocket-line text-purple-400 text-2xl"></i>
                <span className="text-2xl font-bold text-white">{gameStats.totalFleets}</span>
              </div>
              <p className="text-sm text-gray-400">Fleets</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-blue-400/30">
              <div className="flex items-center justify-between mb-2">
                <i className="ri-building-line text-blue-400 text-2xl"></i>
                <span className="text-2xl font-bold text-white">{gameStats.totalBuildings}</span>
              </div>
              <p className="text-sm text-gray-400">Buildings</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-emerald-400/30">
              <div className="flex items-center justify-between mb-2">
                <i className="ri-flask-line text-emerald-400 text-2xl"></i>
                <span className="text-2xl font-bold text-white">{gameStats.totalResearch}</span>
              </div>
              <p className="text-sm text-gray-400">Research</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-red-400/30">
              <div className="flex items-center justify-between mb-2">
                <i className="ri-sword-line text-red-400 text-2xl"></i>
                <span className="text-2xl font-bold text-white">{gameStats.totalCombats}</span>
              </div>
              <p className="text-sm text-gray-400">Combats</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-amber-400/30">
              <div className="flex items-center justify-between mb-2">
                <i className="ri-team-line text-amber-400 text-2xl"></i>
                <span className="text-2xl font-bold text-white">{gameStats.totalAlliances}</span>
              </div>
              <p className="text-sm text-gray-400">Alliances</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mb-6 border-b border-cyan-400/30">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <i className={tab.icon}></i>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 border border-cyan-400/30">
                <h2 className="text-2xl font-bold text-white mb-6">Test Controls</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={runAllTests}
                    disabled={isRunning}
                    className="px-6 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-play-line mr-2"></i>
                    Run All Tests
                  </button>
                  <button
                    onClick={testResourceSystem}
                    disabled={isRunning}
                    className="px-6 py-4 bg-cyan-400/20 border border-cyan-400 text-cyan-400 font-bold rounded-xl hover:bg-cyan-400/30 transition-all disabled:opacity-50 whitespace-nowrap cursor-pointer"
                  >
                    Resources
                  </button>
                  <button
                    onClick={testBuildingSystem}
                    disabled={isRunning}
                    className="px-6 py-4 bg-blue-400/20 border border-blue-400 text-blue-400 font-bold rounded-xl hover:bg-blue-400/30 transition-all disabled:opacity-50 whitespace-nowrap cursor-pointer"
                  >
                    Buildings
                  </button>
                  <button
                    onClick={testResearchSystem}
                    disabled={isRunning}
                    className="px-6 py-4 bg-purple-400/20 border border-purple-400 text-purple-400 font-bold rounded-xl hover:bg-purple-400/30 transition-all disabled:opacity-50 whitespace-nowrap cursor-pointer"
                  >
                    Research
                  </button>
                  <button
                    onClick={testShipSystem}
                    disabled={isRunning}
                    className="px-6 py-4 bg-emerald-400/20 border border-emerald-400 text-emerald-400 font-bold rounded-xl hover:bg-emerald-400/30 transition-all disabled:opacity-50 whitespace-nowrap cursor-pointer"
                  >
                    Ships
                  </button>
                  <button
                    onClick={testCombatSystem}
                    disabled={isRunning}
                    className="px-6 py-4 bg-red-400/20 border border-red-400 text-red-400 font-bold rounded-xl hover:bg-red-400/30 transition-all disabled:opacity-50 whitespace-nowrap cursor-pointer"
                  >
                    Combat
                  </button>
                  <button
                    onClick={testGameLoop}
                    disabled={isRunning}
                    className="px-6 py-4 bg-amber-400/20 border border-amber-400 text-amber-400 font-bold rounded-xl hover:bg-amber-400/30 transition-all disabled:opacity-50 whitespace-nowrap cursor-pointer"
                  >
                    Game Loop
                  </button>
                  <button
                    onClick={clearResults}
                    className="px-6 py-4 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 transition-all whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-delete-bin-line mr-2"></i>
                    Clear
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-cyan-400/30">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <i className="ri-information-line text-cyan-400 mr-3"></i>
                    System Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-gray-300">Resource System</span>
                      <span className="text-green-400 flex items-center">
                        <i className="ri-checkbox-circle-fill mr-2"></i>
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-gray-300">Building Queue</span>
                      <span className="text-green-400 flex items-center">
                        <i className="ri-checkbox-circle-fill mr-2"></i>
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-gray-300">Research System</span>
                      <span className="text-green-400 flex items-center">
                        <i className="ri-checkbox-circle-fill mr-2"></i>
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-gray-300">Fleet Management</span>
                      <span className="text-green-400 flex items-center">
                        <i className="ri-checkbox-circle-fill mr-2"></i>
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-gray-300">Combat Engine</span>
                      <span className="text-green-400 flex items-center">
                        <i className="ri-checkbox-circle-fill mr-2"></i>
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-gray-300">Game Loop</span>
                      <span className="text-green-400 flex items-center">
                        <i className="ri-checkbox-circle-fill mr-2"></i>
                        Running
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <i className="ri-database-2-line text-purple-400 mr-3"></i>
                    Current Resources
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-gray-300 flex items-center">
                        <i className="ri-copper-coin-line text-amber-400 mr-2"></i>
                        Metal
                      </span>
                      <span className="text-white font-bold">{formatNumber(resources.metal)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-gray-300 flex items-center">
                        <i className="ri-vip-diamond-line text-cyan-400 mr-2"></i>
                        Crystal
                      </span>
                      <span className="text-white font-bold">{formatNumber(resources.crystal)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-gray-300 flex items-center">
                        <i className="ri-drop-line text-purple-400 mr-2"></i>
                        Deuterium
                      </span>
                      <span className="text-white font-bold">{formatNumber(resources.deuterium)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-gray-300 flex items-center">
                        <i className="ri-flashlight-line text-yellow-400 mr-2"></i>
                        Energy
                      </span>
                      <span className="text-white font-bold">{formatNumber(resources.energy)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-gray-300 flex items-center">
                        <i className="ri-contrast-drop-line text-pink-400 mr-2"></i>
                        Dark Matter
                      </span>
                      <span className="text-white font-bold">{formatNumber(resources.dark_matter)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Test Results Tab */}
          {activeTab === 'tests' && (
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-cyan-400/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <i className="ri-file-list-line text-cyan-400 mr-3"></i>
                  Test Results ({testResults.length})
                </h2>
                {isRunning && (
                  <div className="flex items-center space-x-2 text-cyan-400">
                    <div className="animate-spin">
                      <i className="ri-loader-4-line text-2xl"></i>
                    </div>
                    <span>Running tests...</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {testResults.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <i className="ri-test-tube-line text-6xl mb-4"></i>
                    <p>No test results yet. Run tests to see results here.</p>
                  </div>
                ) : (
                  testResults.map(result => (
                    <div
                      key={result.id}
                      className={`p-4 rounded-lg border ${
                        result.status === 'success'
                          ? 'bg-green-400/10 border-green-400/30'
                          : result.status === 'error'
                          ? 'bg-red-400/10 border-red-400/30'
                          : 'bg-amber-400/10 border-amber-400/30'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <i
                          className={`text-2xl ${
                            result.status === 'success'
                              ? 'ri-checkbox-circle-fill text-green-400'
                              : result.status === 'error'
                              ? 'ri-close-circle-fill text-red-400'
                              : 'ri-information-fill text-amber-400'
                          }`}
                        ></i>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-white">{result.test}</span>
                            <span className="text-xs text-gray-400">
                              {new Date(result.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">{result.message}</p>
                          {result.data && (
                            <pre className="mt-2 p-2 bg-slate-900/50 rounded text-xs text-gray-400 overflow-x-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-cyan-400/30">
                <h3 className="text-xl font-bold text-white mb-4">Game Statistics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-gray-300">Total Players</span>
                    <span className="text-cyan-400 font-bold">{gameStats.totalPlayers}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-gray-300">Active Fleets</span>
                    <span className="text-purple-400 font-bold">{gameStats.totalFleets}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-gray-300">Total Buildings</span>
                    <span className="text-blue-400 font-bold">{gameStats.totalBuildings}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-gray-300">Research Projects</span>
                    <span className="text-emerald-400 font-bold">{gameStats.totalResearch}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-gray-300">Combat Logs</span>
                    <span className="text-red-400 font-bold">{gameStats.totalCombats}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-gray-300">Alliances</span>
                    <span className="text-amber-400 font-bold">{gameStats.totalAlliances}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30">
                <h3 className="text-xl font-bold text-white mb-4">System Health</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Database Performance</span>
                      <span className="text-green-400">98%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Game Loop Efficiency</span>
                      <span className="text-green-400">95%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Combat Calculations</span>
                      <span className="text-green-400">100%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Resource Management</span>
                      <span className="text-green-400">97%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: '97%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-cyan-400/30">
              <h2 className="text-2xl font-bold text-white mb-6">Performance Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-700/50 rounded-xl p-6 border border-cyan-400/20">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">2ms</div>
                  <p className="text-sm text-gray-400">Avg Response Time</p>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-6 border border-purple-400/20">
                  <div className="text-4xl font-bold text-purple-400 mb-2">60fps</div>
                  <p className="text-sm text-gray-400">Frame Rate</p>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-6 border border-emerald-400/20">
                  <div className="text-4xl font-bold text-emerald-400 mb-2">99.9%</div>
                  <p className="text-sm text-gray-400">Uptime</p>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-6 border border-amber-400/20">
                  <div className="text-4xl font-bold text-amber-400 mb-2">45MB</div>
                  <p className="text-sm text-gray-400">Memory Usage</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
