import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { defenses, Defense, DefenseType, getDefensesByType, calculateDefenseEffectiveness, getDefensePowerRating } from '../../data/defenses';
import { supabase } from '../../lib/supabase';

const GOLD = '#d4a853';
const BORDER = '#1e2a36';
const CARD_BG = '#080b0f';

export default function DefensePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDefenses, setSelectedDefenses] = useState<{[key: string]: number}>({});
  const [activeCategory, setActiveCategory] = useState<DefenseType>('shield');
  const [selectedDefense, setSelectedDefense] = useState<Defense | null>(null);
  const [playerResources, setPlayerResources] = useState({
    metal: 1000000,
    crystal: 800000,
    deuterium: 500000,
    darkMatter: 5000
  });
  const [playerDefenses, setPlayerDefenses] = useState<{[key: string]: {count: number, level: number}}>({});
  const [buildQueue, setBuildQueue] = useState<Array<{defenseId: string, count: number, timeRemaining: number}>>([]);
  const [showMissileModal, setShowMissileModal] = useState(false);
  const [missileTarget, setMissileTarget] = useState('');
  const [missileCount, setMissileCount] = useState(1);
  const [missilePrimaryTarget, setMissilePrimaryTarget] = useState('missile_launcher');
  const [missileLoading, setMissileLoading] = useState(false);
  const [missileError, setMissileError] = useState<string | null>(null);
  const [missileSuccess, setMissileSuccess] = useState<string | null>(null);
  const [availableMissiles, setAvailableMissiles] = useState(0);

  useEffect(() => {
    loadPlayerData();
  }, []);

  const loadPlayerData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: resourcesData } = await supabase
        .from('player_resources')
        .select('*')
        .eq('player_id', user.id)
        .single();

      if (resourcesData) {
        setPlayerResources({
          metal: resourcesData.metal || 0,
          crystal: resourcesData.crystal || 0,
          deuterium: resourcesData.deuterium || 0,
          darkMatter: resourcesData.dark_matter || 0
        });
      }

      const { data: defensesData } = await supabase
        .from('defense_structures')
        .select('*')
        .eq('player_id', user.id);

      if (defensesData) {
        const defenseMap: {[key: string]: {count: number, level: number}} = {};
        defensesData.forEach(d => {
          defenseMap[d.defense_type] = {
            count: d.quantity || 0,
            level: d.level || 1
          };
        });
        setPlayerDefenses(defenseMap);
      }

      const { data: missileData } = await supabase
        .from('ships')
        .select('quantity')
        .eq('player_id', user.id)
        .eq('ship_type', 'interplanetary_missile')
        .maybeSingle();
      
      setAvailableMissiles(missileData?.quantity || 0);

      setLoading(false);
    } catch (err) {
      console.error('Error loading player data:', err);
      setError('Failed to load defense data');
      setLoading(false);
    }
  };

  const handleLaunchMissiles = async () => {
    setMissileError(null);
    setMissileSuccess(null);

    if (!missileTarget) {
      setMissileError('Please enter target coordinates!');
      return;
    }
    if (missileCount < 1 || missileCount > availableMissiles) {
      setMissileError(`You only have ${availableMissiles} missiles available!`);
      return;
    }

    const coordsMatch = missileTarget.match(/(\d+):(\d+):(\d+)/);
    if (!coordsMatch) {
      setMissileError('Invalid coordinates! Use format: G:S:P (e.g. 1:234:5)');
      return;
    }

    setMissileLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data: planet } = await supabase
        .from('planets')
        .select('id')
        .eq('user_id', user?.id)
        .eq('is_homeworld', true)
        .maybeSingle();

      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/process-missile-attack`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`,
          'apikey': (import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || '').replace(/^["']|["']$/g, ''),
        },
        body: JSON.stringify({
          attacker_id: user?.id,
          attacker_planet_id: planet?.id,
          target_coords: {
            galaxy: parseInt(coordsMatch[1]),
            system: parseInt(coordsMatch[2]),
            planet: parseInt(coordsMatch[3]),
          },
          ipm_count: missileCount,
          primary_target: missilePrimaryTarget,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to launch missiles');
      }

      setMissileSuccess(`Launched ${missileCount} missile(s) toward ${missileTarget}. Arrival in ${Math.round(result.travel_seconds / 60)} minutes.`);
      setAvailableMissiles(prev => prev - missileCount);
      setMissileCount(1);
      setMissileTarget('');
    } catch (err: any) {
      setMissileError(err.message);
    } finally {
      setMissileLoading(false);
    }
  };

  const defenseCategories = [
    { id: 'shield' as DefenseType, label: 'Shield Systems', icon: 'ri-shield-line', color: 'amber' },
    { id: 'armor' as DefenseType, label: 'Armor Systems', icon: 'ri-shield-fill', color: 'orange' },
    { id: 'point_defense' as DefenseType, label: 'Point Defense', icon: 'ri-crosshair-line', color: 'red' },
    { id: 'barrier' as DefenseType, label: 'Barrier Systems', icon: 'ri-shield-star-line', color: 'purple' },
    { id: 'regeneration' as DefenseType, label: 'Regeneration', icon: 'ri-heart-pulse-line', color: 'green' },
    { id: 'stealth' as DefenseType, label: 'Stealth Systems', icon: 'ri-eye-off-line', color: 'indigo' },
    { id: 'countermeasure' as DefenseType, label: 'Countermeasures', icon: 'ri-radar-line', color: 'yellow' }
  ];

  const currentDefenses = getDefensesByType(activeCategory);

  const getRankColor = (rank: string) => {
    const colors: {[key: string]: string} = {
      'E': 'text-gray-400', 'D': 'text-green-400', 'C': 'text-blue-400',
      'B': 'text-purple-400', 'A': 'text-yellow-400', 'S': 'text-orange-400',
      'SS': 'text-red-400', 'SSS': 'text-pink-400'
    };
    return colors[rank] || 'text-gray-400';
  };

  const getRarityColor = (rarity: string) => {
    const colors: {[key: string]: string} = {
      'Common': 'text-gray-400', 'Uncommon': 'text-green-400', 'Rare': 'text-blue-400',
      'Epic': 'text-purple-400', 'Legendary': 'text-yellow-400', 'Mythic': 'text-orange-400',
      'Cosmic': 'text-red-400', 'Universal': 'text-pink-400'
    };
    return colors[rarity] || 'text-gray-400';
  };

  const canAfford = (defense: Defense, count: number = 1) => {
    return (
      playerResources.metal >= defense.cost.metal * count &&
      playerResources.crystal >= defense.cost.crystal * count &&
      playerResources.deuterium >= defense.cost.deuterium * count &&
      (!defense.cost.darkMatter || playerResources.darkMatter >= defense.cost.darkMatter * count)
    );
  };

  const handleBuildDefense = async (defense: Defense, count: number) => {
    if (!canAfford(defense, count)) {
      alert('Insufficient resources!');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newResources = {
        metal: playerResources.metal - defense.cost.metal * count,
        crystal: playerResources.crystal - defense.cost.crystal * count,
        deuterium: playerResources.deuterium - defense.cost.deuterium * count,
        dark_matter: playerResources.darkMatter - (defense.cost.darkMatter || 0) * count
      };

      await supabase
        .from('player_resources')
        .update(newResources)
        .eq('player_id', user.id);

      const currentCount = playerDefenses[defense.id]?.count || 0;
      const currentLevel = playerDefenses[defense.id]?.level || 1;

      const { error: defenseError } = await supabase
        .from('defense_structures')
        .upsert({
          player_id: user.id,
          defense_type: defense.id,
          quantity: currentCount + count,
          level: currentLevel,
          updated_at: new Date().toISOString()
        });

      if (defenseError) throw defenseError;

      setPlayerResources({
        metal: newResources.metal,
        crystal: newResources.crystal,
        deuterium: newResources.deuterium,
        darkMatter: newResources.dark_matter
      });

      setPlayerDefenses({
        ...playerDefenses,
        [defense.id]: {
          count: currentCount + count,
          level: currentLevel
        }
      });

      alert(`Successfully built ${count}x ${defense.name}!`);
      setSelectedDefenses({});
    } catch (err) {
      console.error('Error building defense:', err);
      alert('Failed to build defense');
    }
  };

  const handleUpgradeDefense = async (defense: Defense) => {
    const currentLevel = playerDefenses[defense.id]?.level || 1;
    if (currentLevel >= defense.maxLevel) {
      alert('Defense is already at max level!');
      return;
    }

    const upgradeCost = {
      metal: Math.floor(defense.cost.metal * Math.pow(1.5, currentLevel)),
      crystal: Math.floor(defense.cost.crystal * Math.pow(1.5, currentLevel)),
      deuterium: Math.floor(defense.cost.deuterium * Math.pow(1.5, currentLevel)),
      darkMatter: defense.cost.darkMatter ? Math.floor(defense.cost.darkMatter * Math.pow(1.5, currentLevel)) : 0
    };

    if (
      playerResources.metal < upgradeCost.metal ||
      playerResources.crystal < upgradeCost.crystal ||
      playerResources.deuterium < upgradeCost.deuterium ||
      playerResources.darkMatter < upgradeCost.darkMatter
    ) {
      alert('Insufficient resources for upgrade!');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newResources = {
        metal: playerResources.metal - upgradeCost.metal,
        crystal: playerResources.crystal - upgradeCost.crystal,
        deuterium: playerResources.deuterium - upgradeCost.deuterium,
        darkMatter: playerResources.darkMatter - upgradeCost.darkMatter
      };

      await supabase
        .from('player_resources')
        .update(newResources)
        .eq('player_id', user.id);

      await supabase
        .from('defense_structures')
        .update({
          level: currentLevel + 1,
          updated_at: new Date().toISOString()
        })
        .eq('player_id', user.id)
        .eq('defense_type', defense.id);

      setPlayerResources({
        metal: newResources.metal,
        crystal: newResources.crystal,
        deuterium: newResources.deuterium,
        darkMatter: newResources.dark_matter
      });

      setPlayerDefenses({
        ...playerDefenses,
        [defense.id]: {
          ...playerDefenses[defense.id],
          level: currentLevel + 1
        }
      });

      alert(`Successfully upgraded ${defense.name} to level ${currentLevel + 1}!`);
    } catch (err) {
      console.error('Error upgrading defense:', err);
      alert('Failed to upgrade defense');
    }
  };

  const totalDefensePower = Object.entries(playerDefenses).reduce((total, [defenseId, data]) => {
    const defense = defenses.find(d => d.id === defenseId);
    if (!defense) return total;
    return total + getDefensePowerRating(defense, data.level) * data.count;
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Defense Systems...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="ri-error-warning-line text-6xl text-red-400 mb-4"></i>
          <p className="text-white text-xl mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer text-black"
            style={{ background: 'linear-gradient(90deg, #d4a853, #e2c044)' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://readdy.ai/api/search-image?query=advanced%20planetary%20defense%20grid%20with%20energy%20shields%20force%20fields%20laser%20turrets%20missile%20batteries%20protecting%20futuristic%20space%20station%20against%20cosmic%20backdrop%20military%20sci-fi%20architecture%20glowing%20amber%20energy%20barriers&width=1920&height=600&seq=defense-hero-v3&orientation=landscape" alt="Defense Background" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-6xl font-black uppercase text-white mb-4">Defense Systems</h1>
              <p className="text-xl text-ogame-muted">Protect your empire with advanced defensive technology</p>
            </div>
            <button
              onClick={() => {
                setShowMissileModal(true);
                setMissileError(null);
                setMissileSuccess(null);
              }}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg hover:scale-105 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2"
            >
              <i className="ri-meteor-line w-5 h-5 flex items-center justify-center"></i>
              Missile Attack
              {availableMissiles > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs ml-1">
                  {availableMissiles}
                </span>
              )}
            </button>
          </div>
          <div className="flex items-center space-x-8 mt-6">
            <div className="flex items-center space-x-2">
              <i className="ri-shield-line text-amber-400 text-2xl"></i>
              <div>
                <p className="text-sm text-ogame-muted">Total Defense Power</p>
                <p className="text-2xl font-bold text-amber-400">{totalDefensePower.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-building-line text-purple-400 text-2xl"></i>
              <div>
                <p className="text-sm text-ogame-muted">Active Defenses</p>
                <p className="text-2xl font-bold text-purple-400">{Object.keys(playerDefenses).length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Missile Attack Modal */}
      {showMissileModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-xl max-w-lg w-full p-6" style={{ background: CARD_BG, border: '1px solid rgba(239,68,68,0.3)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <i className="ri-meteor-line text-red-400 w-6 h-6 flex items-center justify-center"></i>
                Interplanetary Missile Attack
              </h2>
              <button
                onClick={() => setShowMissileModal(false)}
                className="w-8 h-8 flex items-center justify-center text-ogame-muted hover:text-white cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>

            {missileError && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-3 mb-4 flex items-center gap-2">
                <i className="ri-error-warning-line text-red-400 w-5 h-5 flex items-center justify-center"></i>
                <p className="text-red-300 text-sm">{missileError}</p>
              </div>
            )}
            {missileSuccess && (
              <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg px-4 py-3 mb-4 flex items-center gap-2">
                <i className="ri-checkbox-circle-line text-emerald-400 w-5 h-5 flex items-center justify-center"></i>
                <p className="text-emerald-300 text-sm">{missileSuccess}</p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white font-semibold text-sm mb-2">Target Coordinates (G:S:P)</label>
                <input
                  type="text"
                  value={missileTarget}
                  onChange={(e) => setMissileTarget(e.target.value)}
                  placeholder="e.g. 1:234:5"
                  className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:border-red-400"
                  style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}` }}
                />
              </div>

              <div>
                <label className="block text-white font-semibold text-sm mb-2">
                  Missile Count (Available: {availableMissiles})
                </label>
                <input
                  type="number"
                  min="1"
                  max={availableMissiles}
                  value={missileCount}
                  onChange={(e) => setMissileCount(Math.min(parseInt(e.target.value) || 1, availableMissiles))}
                  className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:border-red-400"
                  style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}` }}
                />
              </div>

              <div>
                <label className="block text-white font-semibold text-sm mb-2">Primary Target</label>
                <select
                  value={missilePrimaryTarget}
                  onChange={(e) => setMissilePrimaryTarget(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:border-red-400"
                  style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}` }}
                >
                  <option value="missile_launcher" style={{background: CARD_BG}}>Missile Launcher</option>
                  <option value="light_laser" style={{background: CARD_BG}}>Light Laser</option>
                  <option value="heavy_laser" style={{background: CARD_BG}}>Heavy Laser</option>
                  <option value="gauss_cannon" style={{background: CARD_BG}}>Gauss Cannon</option>
                  <option value="ion_cannon" style={{background: CARD_BG}}>Ion Cannon</option>
                  <option value="plasma_turret" style={{background: CARD_BG}}>Plasma Turret</option>
                  <option value="small_shield" style={{background: CARD_BG}}>Small Shield Dome</option>
                  <option value="large_shield" style={{background: CARD_BG}}>Large Shield Dome</option>
                </select>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <p className="text-orange-300 text-sm flex items-start gap-2">
                  <i className="ri-alert-line text-orange-400 mt-0.5 w-5 h-5 flex items-center justify-center flex-shrink-0"></i>
                  <span>
                    Each missile has 12,000 attack power and targets defense structures. 
                    Defenses destroyed by missiles do NOT create debris fields. 
                    Travel time depends on distance.
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowMissileModal(false)}
                className="flex-1 px-4 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer text-ogame-muted"
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}` }}
              >
                Cancel
              </button>
              <button
                onClick={handleLaunchMissiles}
                disabled={missileLoading || availableMissiles === 0}
                className={`flex-1 px-4 py-3 rounded-lg font-bold whitespace-nowrap cursor-pointer ${
                  availableMissiles > 0 && !missileLoading
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {missileLoading ? 'Launching...' : 'Launch Missiles'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resources Bar */}
      <div style={{ background: '#0d1117', borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <i className="ri-copper-coin-line text-yellow-400 text-xl"></i>
                <span className="text-white font-semibold">{playerResources.metal.toLocaleString()}</span>
                <span className="text-ogame-muted text-sm">Metal</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-vip-diamond-line text-teal-400 text-xl"></i>
                <span className="text-white font-semibold">{playerResources.crystal.toLocaleString()}</span>
                <span className="text-ogame-muted text-sm">Crystal</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-drop-line text-green-400 text-xl"></i>
                <span className="text-white font-semibold">{playerResources.deuterium.toLocaleString()}</span>
                <span className="text-ogame-muted text-sm">Deuterium</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-contrast-drop-fill text-purple-400 text-xl"></i>
                <span className="text-white font-semibold">{playerResources.darkMatter.toLocaleString()}</span>
                <span className="text-ogame-muted text-sm">Dark Matter</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ background: '#0d1117', borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center space-x-1 overflow-x-auto">
            {defenseCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-4 text-sm font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === category.id
                    ? 'text-amber-400'
                    : 'text-ogame-muted hover:text-white'
                }`}
                style={activeCategory === category.id ? { background: CARD_BG, borderTop: `2px solid ${GOLD}` } : {}}
              >
                <i className={`${category.icon} mr-2`}></i>
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Defense List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {currentDefenses.map((defense) => {
                const owned = playerDefenses[defense.id];
                const currentLevel = owned?.level || 1;
                const currentCount = owned?.count || 0;
                const selectedCount = selectedDefenses[defense.id] || 0;
                const powerRating = getDefensePowerRating(defense, currentLevel);

                return (
                  <div 
                    key={defense.id} 
                    className="rounded-2xl p-6 transition-all cursor-pointer"
                    style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
                    onClick={() => setSelectedDefense(defense)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-2xl font-bold text-white">{defense.name}</h3>
                          <span className={`text-sm font-bold ${getRankColor(defense.rank)}`}>[{defense.rank}]</span>
                          <span className={`text-xs font-semibold ${getRarityColor(defense.rarity)}`}>{defense.rarity}</span>
                        </div>
                        <p className="text-ogame-muted text-sm mb-3">{defense.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <i className="ri-star-line text-yellow-400"></i>
                            <span className="text-white">Tier {defense.tier}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <i className="ri-flashlight-line text-amber-400"></i>
                            <span className="text-white">Power: {powerRating.toLocaleString()}</span>
                          </div>
                          {owned && (
                            <>
                              <div className="flex items-center space-x-1">
                                <i className="ri-building-line text-green-400"></i>
                                <span className="text-white">Owned: {currentCount}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <i className="ri-arrow-up-line text-purple-400"></i>
                                <span className="text-white">Lv.{currentLevel}/{defense.maxLevel}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 rounded-xl" style={{ background: '#0d1117' }}>
                      {defense.stats.protection > 0 && (
                        <div className="text-center">
                          <p className="text-xs text-ogame-dim mb-1">Protection</p>
                          <p className="text-lg font-bold text-orange-400">{defense.stats.protection.toLocaleString()}</p>
                        </div>
                      )}
                      {defense.stats.capacity > 0 && (
                        <div className="text-center">
                          <p className="text-xs text-ogame-dim mb-1">Capacity</p>
                          <p className="text-lg font-bold text-amber-400">{defense.stats.capacity.toLocaleString()}</p>
                        </div>
                      )}
                      {defense.stats.regeneration > 0 && (
                        <div className="text-center">
                          <p className="text-xs text-ogame-dim mb-1">Regen/sec</p>
                          <p className="text-lg font-bold text-green-400">{defense.stats.regeneration.toLocaleString()}</p>
                        </div>
                      )}
                      <div className="text-center">
                        <p className="text-xs text-ogame-dim mb-1">Coverage</p>
                        <p className="text-lg font-bold text-purple-400">{defense.stats.coverage}%</p>
                      </div>
                    </div>

                    {/* Resistances */}
                    <div className="mb-4 p-4 rounded-xl" style={{ background: '#0d1117' }}>
                      <p className="text-xs text-ogame-dim mb-2">Damage Resistance</p>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="text-center">
                          <i className="ri-sword-line text-red-400 text-lg"></i>
                          <p className="text-xs text-white mt-1">{defense.stats.resistance.kinetic}%</p>
                          <p className="text-xs text-ogame-dim">Kinetic</p>
                        </div>
                        <div className="text-center">
                          <i className="ri-flashlight-line text-teal-400 text-lg"></i>
                          <p className="text-xs text-white mt-1">{defense.stats.resistance.energy}%</p>
                          <p className="text-xs text-ogame-dim">Energy</p>
                        </div>
                        <div className="text-center">
                          <i className="ri-fire-line text-orange-400 text-lg"></i>
                          <p className="text-xs text-white mt-1">{defense.stats.resistance.explosive}%</p>
                          <p className="text-xs text-ogame-dim">Explosive</p>
                        </div>
                        <div className="text-center">
                          <i className="ri-contrast-drop-line text-purple-400 text-lg"></i>
                          <p className="text-xs text-white mt-1">{defense.stats.resistance.quantum}%</p>
                          <p className="text-xs text-ogame-dim">Quantum</p>
                        </div>
                      </div>
                    </div>

                    {/* Cost */}
                    <div className="flex items-center justify-between mb-4 p-4 rounded-xl" style={{ background: '#0d1117' }}>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <i className="ri-copper-coin-line text-yellow-400"></i>
                          <span className="text-white text-sm">{defense.cost.metal.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <i className="ri-vip-diamond-line text-teal-400"></i>
                          <span className="text-white text-sm">{defense.cost.crystal.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <i className="ri-drop-line text-green-400"></i>
                          <span className="text-white text-sm">{defense.cost.deuterium.toLocaleString()}</span>
                        </div>
                        {defense.cost.darkMatter && (
                          <div className="flex items-center space-x-1">
                            <i className="ri-contrast-drop-fill text-purple-400"></i>
                            <span className="text-white text-sm">{defense.cost.darkMatter.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <input 
                        type="number" 
                        min="0" 
                        max="1000"
                        value={selectedCount}
                        onChange={(e) => {
                          e.stopPropagation();
                          const val = parseInt(e.target.value) || 0;
                          setSelectedDefenses({...selectedDefenses, [defense.id]: val});
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 px-4 py-3 rounded-lg text-white focus:outline-none"
                        style={{ background: '#0d1117', border: `1px solid ${BORDER}` }}
                        placeholder="Quantity"
                      />
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuildDefense(defense, selectedCount || 1);
                        }}
                        disabled={!canAfford(defense, selectedCount || 1) || selectedCount === 0}
                        className={`px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                          canAfford(defense, selectedCount || 1) && selectedCount > 0
                            ? 'text-black'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                        style={canAfford(defense, selectedCount || 1) && selectedCount > 0 ? { background: 'linear-gradient(90deg, #d4a853, #e2c044)' } : {}}
                      >
                        <i className="ri-hammer-line mr-2"></i>
                        Build
                      </button>
                      {owned && currentLevel < defense.maxLevel && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpgradeDefense(defense);
                          }}
                          className="px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer text-white"
                          style={{ background: 'rgba(212,168,83,0.15)', border: `1px solid rgba(212,168,83,0.3)`, color: GOLD }}
                        >
                          <i className="ri-arrow-up-line mr-2"></i>
                          Upgrade
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Defense Details Sidebar */}
          <div className="space-y-6">
            {selectedDefense ? (
              <div className="rounded-2xl p-6 sticky top-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
                <h2 className="text-2xl font-bold text-white mb-4">{selectedDefense.name}</h2>
                
                <div className="mb-6 p-4 rounded-xl" style={{ background: '#0d1117' }}>
                  <p className="text-sm text-ogame-muted italic">{selectedDefense.lore}</p>
                </div>

                {selectedDefense.abilities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-amber-400 mb-3 flex items-center">
                      <i className="ri-magic-line mr-2"></i>
                      Abilities
                    </h3>
                    <div className="space-y-3">
                      {selectedDefense.abilities.map((ability, idx) => (
                        <div key={idx} className="p-3 rounded-lg" style={{ background: '#0d1117' }}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-semibold text-sm">{ability.name}</h4>
                            <span className="text-xs text-amber-400">{ability.cooldown}s CD</span>
                          </div>
                          <p className="text-xs text-ogame-muted mb-2">{ability.description}</p>
                          <p className="text-xs text-purple-400">{ability.effect}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDefense.specialEffects.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-amber-400 mb-3 flex items-center">
                      <i className="ri-star-line mr-2"></i>
                      Special Effects
                    </h3>
                    <div className="space-y-2">
                      {selectedDefense.specialEffects.map((effect, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <i className="ri-checkbox-circle-line text-green-400"></i>
                          <span className="text-ogame-muted">{effect}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-xl" style={{ background: '#0d1117' }}>
                  <h3 className="text-sm font-bold text-ogame-dim mb-2">Requirements</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-ogame-muted">Level</span>
                      <span className="text-white">{selectedDefense.requirements.level}</span>
                    </div>
                    {selectedDefense.requirements.technology && (
                      <div className="flex items-center justify-between">
                        <span className="text-ogame-muted">Technology</span>
                        <span className="text-amber-400">{selectedDefense.requirements.technology} Lv.{selectedDefense.requirements.techLevel}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl p-6 sticky top-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
                <div className="text-center py-12">
                  <i className="ri-shield-line text-6xl text-ogame-dim mb-4"></i>
                  <p className="text-ogame-muted">Select a defense to view details</p>
                </div>
              </div>
            )}

            {/* Defense Summary */}
            <div className="rounded-2xl p-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <i className="ri-bar-chart-line text-amber-400 mr-3"></i>
                Defense Summary
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <span className="text-ogame-muted">Total Power</span>
                  <span className="text-amber-400 font-bold text-lg">{totalDefensePower.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pb-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <span className="text-ogame-muted">Defense Types</span>
                  <span className="text-purple-400 font-bold text-lg">{Object.keys(playerDefenses).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ogame-muted">Total Units</span>
                  <span className="text-green-400 font-bold text-lg">
                    {Object.values(playerDefenses).reduce((sum, d) => sum + d.count, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}