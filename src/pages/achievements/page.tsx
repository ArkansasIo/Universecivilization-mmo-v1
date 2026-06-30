import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Legendary';
  progress: number;
  maxProgress: number;
  completed: boolean;
  rewards: {
    skillPoints?: number;
    credits?: number;
    darkMatter?: number;
    title?: string;
  };
}

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const achievements: Achievement[] = [
    // Combat Achievements
    { id: 'first-blood', name: 'First Blood', description: 'Win your first battle', category: 'Combat', icon: 'ri-sword-line', tier: 'Bronze', progress: 1, maxProgress: 1, completed: true, rewards: { skillPoints: 1, credits: 10000 } },
    { id: 'warrior', name: 'Warrior', description: 'Win 100 battles', category: 'Combat', icon: 'ri-shield-cross-line', tier: 'Silver', progress: 87, maxProgress: 100, completed: false, rewards: { skillPoints: 3, credits: 50000 } },
    { id: 'warlord', name: 'Warlord', description: 'Win 1,000 battles', category: 'Combat', icon: 'ri-trophy-line', tier: 'Gold', progress: 247, maxProgress: 1000, completed: false, rewards: { skillPoints: 5, credits: 250000, title: 'Warlord' } },
    { id: 'destroyer', name: 'Destroyer', description: 'Destroy 10,000 enemy ships', category: 'Combat', icon: 'ri-fire-line', tier: 'Platinum', progress: 4567, maxProgress: 10000, completed: false, rewards: { skillPoints: 10, darkMatter: 100 } },
    { id: 'boss-slayer', name: 'Boss Slayer', description: 'Defeat 10 World Bosses', category: 'Combat', icon: 'ri-sword-line', tier: 'Diamond', progress: 3, maxProgress: 10, completed: false, rewards: { skillPoints: 15, darkMatter: 500 } },
    
    // Economy Achievements
    { id: 'miner', name: 'Miner', description: 'Collect 1M metal', category: 'Economy', icon: 'ri-hammer-line', tier: 'Bronze', progress: 1000000, maxProgress: 1000000, completed: true, rewards: { skillPoints: 1, credits: 5000 } },
    { id: 'industrialist', name: 'Industrialist', description: 'Collect 100M metal', category: 'Economy', icon: 'ri-building-2-line', tier: 'Silver', progress: 45000000, maxProgress: 100000000, completed: false, rewards: { skillPoints: 3, credits: 100000 } },
    { id: 'tycoon', name: 'Tycoon', description: 'Accumulate 10M credits', category: 'Economy', icon: 'ri-coins-line', tier: 'Gold', progress: 2450000, maxProgress: 10000000, completed: false, rewards: { skillPoints: 5, darkMatter: 50 } },
    { id: 'trade-master', name: 'Trade Master', description: 'Complete 500 trades', category: 'Economy', icon: 'ri-exchange-line', tier: 'Platinum', progress: 156, maxProgress: 500, completed: false, rewards: { skillPoints: 10, credits: 500000 } },
    
    // Research Achievements
    { id: 'scientist', name: 'Scientist', description: 'Complete 10 research projects', category: 'Research', icon: 'ri-flask-line', tier: 'Bronze', progress: 10, maxProgress: 10, completed: true, rewards: { skillPoints: 1, credits: 15000 } },
    { id: 'innovator', name: 'Innovator', description: 'Complete 100 research projects', category: 'Research', icon: 'ri-lightbulb-line', tier: 'Silver', progress: 67, maxProgress: 100, completed: false, rewards: { skillPoints: 3, credits: 75000 } },
    { id: 'tech-master', name: 'Tech Master', description: 'Unlock all technologies', category: 'Research', icon: 'ri-rocket-line', tier: 'Legendary', progress: 156, maxProgress: 200, completed: false, rewards: { skillPoints: 25, darkMatter: 1000, title: 'Tech Master' } },
    
    // Fleet Achievements
    { id: 'captain', name: 'Captain', description: 'Build 100 ships', category: 'Fleet', icon: 'ri-ship-line', tier: 'Bronze', progress: 100, maxProgress: 100, completed: true, rewards: { skillPoints: 1, credits: 20000 } },
    { id: 'admiral', name: 'Admiral', description: 'Build 10,000 ships', category: 'Fleet', icon: 'ri-anchor-line', tier: 'Silver', progress: 12450, maxProgress: 10000, completed: true, rewards: { skillPoints: 3, credits: 100000 } },
    { id: 'fleet-commander', name: 'Fleet Commander', description: 'Command 100,000 ships', category: 'Fleet', icon: 'ri-compass-3-line', tier: 'Gold', progress: 12450, maxProgress: 100000, completed: false, rewards: { skillPoints: 5, darkMatter: 100, title: 'Fleet Commander' } },
    { id: 'armada', name: 'Armada', description: 'Build a Deathstar', category: 'Fleet', icon: 'ri-planet-line', tier: 'Diamond', progress: 0, maxProgress: 1, completed: false, rewards: { skillPoints: 20, darkMatter: 500 } },
    
    // Expansion Achievements
    { id: 'colonist', name: 'Colonist', description: 'Establish 5 colonies', category: 'Expansion', icon: 'ri-earth-line', tier: 'Bronze', progress: 5, maxProgress: 5, completed: true, rewards: { skillPoints: 1, credits: 25000 } },
    { id: 'empire-builder', name: 'Empire Builder', description: 'Establish 50 colonies', category: 'Expansion', icon: 'ri-global-line', tier: 'Silver', progress: 18, maxProgress: 50, completed: false, rewards: { skillPoints: 3, credits: 150000 } },
    { id: 'galactic-emperor', name: 'Galactic Emperor', description: 'Establish 200 colonies', category: 'Expansion', icon: 'ri-vip-crown-line', tier: 'Legendary', progress: 18, maxProgress: 200, completed: false, rewards: { skillPoints: 30, darkMatter: 2000, title: 'Galactic Emperor' } },
    
    // Special Achievements
    { id: 'explorer', name: 'Explorer', description: 'Discover 100 systems', category: 'Special', icon: 'ri-map-2-line', tier: 'Silver', progress: 45, maxProgress: 100, completed: false, rewards: { skillPoints: 3, darkMatter: 50 } },
    { id: 'alliance-leader', name: 'Alliance Leader', description: 'Lead an alliance with 50 members', category: 'Special', icon: 'ri-team-line', tier: 'Gold', progress: 0, maxProgress: 50, completed: false, rewards: { skillPoints: 5, darkMatter: 100, title: 'Alliance Leader' } },
    { id: 'legendary', name: 'Legendary Commander', description: 'Reach level 100', category: 'Special', icon: 'ri-star-line', tier: 'Legendary', progress: 42, maxProgress: 100, completed: false, rewards: { skillPoints: 50, darkMatter: 5000, title: 'Legendary Commander' } },
  ];

  const categories = ['All', 'Combat', 'Economy', 'Research', 'Fleet', 'Expansion', 'Special'];

  const filteredAchievements = selectedCategory === 'All'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const completedCount = achievements.filter(a => a.completed).length;
  const totalCount = achievements.length;
  const completionPercentage = (completedCount / totalCount) * 100;

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      'Bronze': 'amber-700',
      'Silver': 'gray-400',
      'Gold': 'yellow-400',
      'Platinum': 'cyan-400',
      'Diamond': 'blue-400',
      'Legendary': 'purple-400'
    };
    return colors[tier] || 'gray-400';
  };

  const getTierGradient = (tier: string) => {
    const gradients: Record<string, string> = {
      'Bronze': 'from-amber-700 to-amber-600',
      'Silver': 'from-gray-400 to-gray-300',
      'Gold': 'from-yellow-400 to-yellow-300',
      'Platinum': 'from-cyan-400 to-cyan-300',
      'Diamond': 'from-blue-400 to-blue-300',
      'Legendary': 'from-purple-400 via-pink-400 to-cyan-400'
    };
    return gradients[tier] || 'from-gray-400 to-gray-300';
  };

  return (
    <div className="text-white">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Achievements
          </h1>
          <p className="text-gray-400 text-lg">Track your progress and earn exclusive rewards</p>
        </div>

        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Overall Progress</h2>
              <p className="text-gray-400">{completedCount} of {totalCount} achievements completed</p>
            </div>
            <div className="text-6xl font-black text-amber-400">{completionPercentage.toFixed(0)}%</div>
          </div>
          <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
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
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map(achievement => {
            const tierColor = getTierColor(achievement.tier);
            const tierGradient = getTierGradient(achievement.tier);
            const progress = (achievement.progress / achievement.maxProgress) * 100;

            return (
              <div
                key={achievement.id}
                className={`bg-slate-800/30 backdrop-blur-sm border rounded-xl p-6 transition-all ${
                  achievement.completed
                    ? `border-${tierColor} shadow-lg shadow-${tierColor}/20`
                    : 'border-slate-700 opacity-75'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${tierGradient} rounded-xl flex items-center justify-center ${
                    !achievement.completed && 'opacity-50 grayscale'
                  }`}>
                    <i className={`${achievement.icon} text-3xl text-white w-8 h-8 flex items-center justify-center`}></i>
                  </div>
                  <span className={`px-3 py-1 bg-gradient-to-r ${tierGradient} text-white rounded-full text-xs font-bold`}>
                    {achievement.tier}
                  </span>
                </div>

                {/* Achievement Info */}
                <h3 className="text-xl font-bold text-white mb-2">{achievement.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{achievement.description}</p>

                {/* Progress Bar */}
                {!achievement.completed && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">
                        {achievement.progress.toLocaleString()} / {achievement.maxProgress.toLocaleString()}
                      </span>
                      <span className={`text-${tierColor} font-bold`}>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${tierGradient}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Rewards */}
                <div className={`bg-slate-900/50 rounded-lg p-3 ${achievement.completed && 'border-2 border-green-500'}`}>
                  <div className="text-xs text-gray-400 mb-2">
                    {achievement.completed ? '✓ Rewards Claimed:' : 'Rewards:'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {achievement.rewards.skillPoints && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-bold">
                        +{achievement.rewards.skillPoints} SP
                      </span>
                    )}
                    {achievement.rewards.credits && (
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-bold">
                        {achievement.rewards.credits.toLocaleString()} Credits
                      </span>
                    )}
                    {achievement.rewards.darkMatter && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-bold">
                        {achievement.rewards.darkMatter} DM
                      </span>
                    )}
                    {achievement.rewards.title && (
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs font-bold">
                        Title: {achievement.rewards.title}
                      </span>
                    )}
                  </div>
                </div>

                {/* Completion Badge */}
                {achievement.completed && (
                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                      <i className="ri-check-line mr-2"></i>
                      COMPLETED
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
