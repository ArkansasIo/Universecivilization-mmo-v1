import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  currentLevel: number;
  maxLevel: number;
  costPerLevel: number;
  bonusPerLevel: string;
}

export default function SkillsPage() {
  const { user } = useAuth();
  const [availablePoints, setAvailablePoints] = useState(0);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Combat', 'Economy', 'Research', 'Fleet', 'Defense', 'Expansion'];

  const defaultSkills: Skill[] = [
    // Combat Skills
    { id: 'weapon-tech', name: 'Weapon Technology', description: 'Increases damage of all weapons', category: 'Combat', icon: 'ri-sword-line', currentLevel: 0, maxLevel: 20, costPerLevel: 1, bonusPerLevel: '+5% weapon damage' },
    { id: 'shield-tech', name: 'Shield Technology', description: 'Increases shield strength', category: 'Combat', icon: 'ri-shield-line', currentLevel: 0, maxLevel: 20, costPerLevel: 1, bonusPerLevel: '+5% shield capacity' },
    { id: 'armor-tech', name: 'Armor Technology', description: 'Increases hull strength', category: 'Combat', icon: 'ri-shield-check-line', currentLevel: 0, maxLevel: 20, costPerLevel: 1, bonusPerLevel: '+5% hull points' },
    { id: 'combat-tactics', name: 'Combat Tactics', description: 'Improves battle performance', category: 'Combat', icon: 'ri-focus-3-line', currentLevel: 0, maxLevel: 15, costPerLevel: 2, bonusPerLevel: '+3% combat effectiveness' },
    
    // Economy Skills
    { id: 'mining-efficiency', name: 'Mining Efficiency', description: 'Increases metal production', category: 'Economy', icon: 'ri-hammer-line', currentLevel: 0, maxLevel: 25, costPerLevel: 1, bonusPerLevel: '+4% metal production' },
    { id: 'crystal-synthesis', name: 'Crystal Synthesis', description: 'Increases crystal production', category: 'Economy', icon: 'ri-vip-diamond-line', currentLevel: 0, maxLevel: 25, costPerLevel: 1, bonusPerLevel: '+4% crystal production' },
    { id: 'deuterium-refining', name: 'Deuterium Refining', description: 'Increases deuterium production', category: 'Economy', icon: 'ri-drop-line', currentLevel: 0, maxLevel: 25, costPerLevel: 1, bonusPerLevel: '+4% deuterium production' },
    { id: 'energy-management', name: 'Energy Management', description: 'Reduces energy consumption', category: 'Economy', icon: 'ri-flashlight-line', currentLevel: 0, maxLevel: 20, costPerLevel: 1, bonusPerLevel: '-3% energy cost' },
    { id: 'trade-mastery', name: 'Trade Mastery', description: 'Better trade rates', category: 'Economy', icon: 'ri-exchange-line', currentLevel: 0, maxLevel: 15, costPerLevel: 2, bonusPerLevel: '+5% trade profit' },
    
    // Research Skills
    { id: 'research-speed', name: 'Research Speed', description: 'Faster research completion', category: 'Research', icon: 'ri-flask-line', currentLevel: 0, maxLevel: 20, costPerLevel: 2, bonusPerLevel: '+5% research speed' },
    { id: 'tech-efficiency', name: 'Tech Efficiency', description: 'Reduced research costs', category: 'Research', icon: 'ri-lightbulb-line', currentLevel: 0, maxLevel: 15, costPerLevel: 2, bonusPerLevel: '-4% research cost' },
    { id: 'innovation', name: 'Innovation', description: 'Unlock advanced technologies', category: 'Research', icon: 'ri-rocket-line', currentLevel: 0, maxLevel: 10, costPerLevel: 3, bonusPerLevel: 'Unlock special tech' },
    
    // Fleet Skills
    { id: 'fleet-command', name: 'Fleet Command', description: 'Command larger fleets', category: 'Fleet', icon: 'ri-ship-line', currentLevel: 0, maxLevel: 20, costPerLevel: 2, bonusPerLevel: '+5% fleet capacity' },
    { id: 'navigation', name: 'Navigation', description: 'Faster fleet movement', category: 'Fleet', icon: 'ri-compass-3-line', currentLevel: 0, maxLevel: 20, costPerLevel: 1, bonusPerLevel: '+4% fleet speed' },
    { id: 'logistics', name: 'Logistics', description: 'Increased cargo capacity', category: 'Fleet', icon: 'ri-truck-line', currentLevel: 0, maxLevel: 15, costPerLevel: 1, bonusPerLevel: '+6% cargo space' },
    { id: 'fuel-efficiency', name: 'Fuel Efficiency', description: 'Reduced fuel consumption', category: 'Fleet', icon: 'ri-gas-station-line', currentLevel: 0, maxLevel: 15, costPerLevel: 1, bonusPerLevel: '-5% fuel cost' },
    
    // Defense Skills
    { id: 'planetary-defense', name: 'Planetary Defense', description: 'Stronger defense systems', category: 'Defense', icon: 'ri-shield-star-line', currentLevel: 0, maxLevel: 20, costPerLevel: 2, bonusPerLevel: '+5% defense power' },
    { id: 'fortification', name: 'Fortification', description: 'Increased defense durability', category: 'Defense', icon: 'ri-building-line', currentLevel: 0, maxLevel: 15, costPerLevel: 1, bonusPerLevel: '+4% defense HP' },
    { id: 'early-warning', name: 'Early Warning', description: 'Detect incoming attacks', category: 'Defense', icon: 'ri-radar-line', currentLevel: 0, maxLevel: 10, costPerLevel: 2, bonusPerLevel: '+10% detection range' },
    
    // Expansion Skills
    { id: 'colonization', name: 'Colonization', description: 'Establish more colonies', category: 'Expansion', icon: 'ri-planet-line', currentLevel: 0, maxLevel: 20, costPerLevel: 2, bonusPerLevel: '+1 colony slot' },
    { id: 'terraforming', name: 'Terraforming', description: 'Improve planet conditions', category: 'Expansion', icon: 'ri-earth-line', currentLevel: 0, maxLevel: 15, costPerLevel: 2, bonusPerLevel: '+5% planet capacity' },
    { id: 'exploration', name: 'Exploration', description: 'Discover new systems', category: 'Expansion', icon: 'ri-map-2-line', currentLevel: 0, maxLevel: 15, costPerLevel: 1, bonusPerLevel: '+10% discovery chance' },
  ];

  useEffect(() => {
    if (user) {
      loadSkills();
    }
  }, [user]);

  const loadSkills = async () => {
    if (!user) return;

    try {
      const { data: skillData, error } = await supabase
        .from('player_skills')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Load available skill points from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('level, experience')
        .eq('id', user.id)
        .single();

      if (profile) {
        // Calculate available points based on level and spent points
        const totalPoints = Math.floor(profile.level / 2) + 5;
        const spentPoints = skillData?.reduce((sum, skill) => sum + (skill.level || 0) * (defaultSkills.find(s => s.id === skill.skill_id)?.costPerLevel || 1), 0) || 0;
        setAvailablePoints(Math.max(0, totalPoints - spentPoints));
      }

      // Merge loaded skills with default skills
      const mergedSkills = defaultSkills.map(defaultSkill => {
        const loadedSkill = skillData?.find(s => s.skill_id === defaultSkill.id);
        return {
          ...defaultSkill,
          currentLevel: loadedSkill?.level || 0
        };
      });

      setSkills(mergedSkills);
    } catch (error) {
      console.error('Error loading skills:', error);
      setSkills(defaultSkills);
    } finally {
      setLoading(false);
    }
  };

  const upgradeSkill = async (skillId: string) => {
    const skill = skills.find(s => s.id === skillId);
    if (!skill || !user) return;

    if (availablePoints < skill.costPerLevel) {
      alert('Not enough skill points!');
      return;
    }

    if (skill.currentLevel >= skill.maxLevel) {
      alert('Skill is already at maximum level!');
      return;
    }

    try {
      // Check if skill exists in database
      const { data: existingSkill } = await supabase
        .from('player_skills')
        .select('*')
        .eq('user_id', user.id)
        .eq('skill_id', skillId)
        .single();

      if (existingSkill) {
        // Update existing skill
        const { error } = await supabase
          .from('player_skills')
          .update({ level: skill.currentLevel + 1 })
          .eq('user_id', user.id)
          .eq('skill_id', skillId);

        if (error) throw error;
      } else {
        // Insert new skill
        const { error } = await supabase
          .from('player_skills')
          .insert({
            user_id: user.id,
            skill_id: skillId,
            level: 1
          });

        if (error) throw error;
      }

      // Update local state
      setAvailablePoints(prev => prev - skill.costPerLevel);
      setSkills(prev => prev.map(s => 
        s.id === skillId ? { ...s, currentLevel: s.currentLevel + 1 } : s
      ));

      alert(`${skill.name} upgraded to level ${skill.currentLevel + 1}!`);
    } catch (error) {
      console.error('Error upgrading skill:', error);
      alert('Failed to upgrade skill. Please try again.');
    }
  };

  const filteredSkills = selectedCategory === 'All' 
    ? skills 
    : skills.filter(s => s.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Combat': 'red',
      'Economy': 'emerald',
      'Research': 'purple',
      'Fleet': 'blue',
      'Defense': 'amber',
      'Expansion': 'cyan'
    };
    return colors[category] || 'gray';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <i className="ri-loader-4-line animate-spin text-4xl text-purple-400"></i>
      </div>
    );
  }

  return (
    <div className="text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-[#d4a853] via-amber-400 to-[#e2c044] bg-clip-text text-transparent">
            Skill Tree
          </h1>
          <p className="text-gray-400 text-lg">Enhance your commander abilities and empire bonuses</p>
        </div>

        {/* Skill Points Display */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Available Skill Points</h2>
              <p className="text-gray-400">Earn skill points by leveling up and completing achievements</p>
            </div>
            <div className="text-6xl font-black text-purple-400">{availablePoints}</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map(skill => {
            const color = getCategoryColor(skill.category);
            const canUpgrade = availablePoints >= skill.costPerLevel && skill.currentLevel < skill.maxLevel;
            const isMaxLevel = skill.currentLevel >= skill.maxLevel;
            const progress = (skill.currentLevel / skill.maxLevel) * 100;

            return (
              <div
                key={skill.id}
                className={`bg-slate-800/30 backdrop-blur-sm border border-${color}-500/30 rounded-xl p-6 hover:border-${color}-500/60 transition-all`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-${color}-500/20 rounded-lg flex items-center justify-center`}>
                    <i className={`${skill.icon} text-2xl text-${color}-400 w-6 h-6 flex items-center justify-center`}></i>
                  </div>
                  <span className={`px-3 py-1 bg-${color}-500/20 text-${color}-400 rounded-full text-xs font-bold`}>
                    {skill.category}
                  </span>
                </div>

                {/* Skill Info */}
                <h3 className="text-xl font-bold text-white mb-2">{skill.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{skill.description}</p>

                {/* Level Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Level {skill.currentLevel}/{skill.maxLevel}</span>
                    <span className={`text-${color}-400 font-bold`}>{progress.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-400`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Bonus Info */}
                <div className={`bg-${color}-500/10 rounded-lg p-3 mb-4`}>
                  <div className="text-xs text-gray-400 mb-1">Bonus per level:</div>
                  <div className={`text-sm font-bold text-${color}-400`}>{skill.bonusPerLevel}</div>
                </div>

                {/* Upgrade Button */}
                {isMaxLevel ? (
                  <button
                    disabled
                    className="w-full py-3 bg-slate-700 text-gray-500 rounded-lg font-bold cursor-not-allowed"
                  >
                    <i className="ri-check-line mr-2"></i>MAX LEVEL
                  </button>
                ) : (
                  <button
                    onClick={() => upgradeSkill(skill.id)}
                    disabled={!canUpgrade}
                    className={`w-full py-3 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                      canUpgrade
                        ? `bg-gradient-to-r from-${color}-600 to-${color}-500 hover:from-${color}-500 hover:to-${color}-400 text-white`
                        : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <i className="ri-arrow-up-line mr-2"></i>
                    Upgrade ({skill.costPerLevel} SP)
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats Summary */}
        <div className="mt-8 bg-slate-800/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Total Bonuses</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">+40%</div>
              <div className="text-sm text-gray-400">Weapon Damage</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">+36%</div>
              <div className="text-sm text-gray-400">Metal Production</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">+24%</div>
              <div className="text-sm text-gray-400">Fleet Speed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">+30%</div>
              <div className="text-sm text-gray-400">Research Speed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
