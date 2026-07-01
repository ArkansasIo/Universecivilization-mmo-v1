import { useState } from 'react';
import { useSeasonPass } from '../../hooks/useSeasonPass';
import { currentSeasonPass, seasonPassMissions, SeasonPassMission } from '../../data/seasonPass';

export default function SeasonPassPage() {
  const {
    seasonPass,
    claimReward,
    purchasePremium,
  } = useSeasonPass();

  const [activeTab, setActiveTab] = useState<'pass' | 'missions'>('pass');
  const [missionTab, setMissionTab] = useState<'daily' | 'weekly' | 'seasonal'>('daily');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const calculateProgress = () => {
    const currentTier = currentSeasonPass.tiers.find(t => t.tier === seasonPass.current_tier);
    const nextTier = currentSeasonPass.tiers.find(t => t.tier === seasonPass.current_tier + 1);
    if (!currentTier || !nextTier) return 100;
    const xpInCurrentTier = seasonPass.experience - currentTier.requiredXP;
    const xpNeededForNext = nextTier.requiredXP - currentTier.requiredXP;
    return Math.min((xpInCurrentTier / xpNeededForNext) * 100, 100);
  };

  const handleUnlockPremium = async () => {
    const success = await purchasePremium();
    if (success) {
      showNotification('Premium Pass unlocked! Enjoy exclusive rewards!');
    } else {
      showNotification('Not enough Dark Matter (requires 1,000).');
    }
  };

  const handleClaimReward = async (tier: number, isPremium: boolean) => {
    const success = await claimReward(tier, isPremium);
    if (success) {
      showNotification('Reward claimed successfully!');
    } else {
      showNotification('Unable to claim reward.');
    }
  };

  const getDailyMissions = () => seasonPassMissions.filter(m => m.type === 'daily');
  const getWeeklyMissions = () => seasonPassMissions.filter(m => m.type === 'weekly');
  const getSeasonalMissions = () => seasonPassMissions.filter(m => m.type === 'seasonal');

  const difficultyColors: Record<string, string> = {
    easy: 'from-green-400 to-green-500',
    medium: 'from-yellow-400 to-orange-500',
    hard: 'from-orange-400 to-red-500',
    extreme: 'from-red-500 to-pink-600',
  };

  const renderMissionCard = (mission: SeasonPassMission) => {
    const requirement = mission.requirements[0];
    const currentProgress = requirement.current || 0;
    const progressPercent = Math.min((currentProgress / requirement.target) * 100, 100);
    const isCompleted = progressPercent >= 100;

    return (
      <div key={mission.id} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className={`inline-block bg-gradient-to-r ${difficultyColors[mission.difficulty]} text-white px-3 py-1 rounded-full text-xs font-bold uppercase mb-2`}>
              {mission.difficulty}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{mission.name}</h3>
            <p className="text-gray-400 text-sm">{mission.description}</p>
          </div>
          <div className="text-right ml-4">
            <div className="text-yellow-400 font-bold text-lg">+{mission.xpReward.toLocaleString()} XP</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Progress</span>
            <span className="text-white font-semibold">{currentProgress.toLocaleString()} / {requirement.target.toLocaleString()}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {isCompleted ? (
          <div className="w-full bg-green-900/40 border border-green-500/40 text-green-400 py-3 rounded-lg font-bold text-center flex items-center justify-center gap-2">
            <i className="ri-check-line" />
            Completed
          </div>
        ) : (
          <div className="w-full bg-slate-700 text-gray-400 py-3 rounded-lg font-bold text-center">
            In Progress
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl shadow-2xl font-semibold animate-pulse">
          {notification}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{currentSeasonPass.name}</h1>
              <p className="text-gray-300">{currentSeasonPass.description}</p>
            </div>
            {!seasonPass.is_premium ? (
              <button
                onClick={handleUnlockPremium}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-3 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-vip-crown-line text-2xl" />
                Unlock Premium Pass
                <span className="text-sm opacity-90">({currentSeasonPass.premiumPrice.toLocaleString()} Dark Matter)</span>
              </button>
            ) : (
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl px-8 py-4 flex items-center gap-3">
                <i className="ri-vip-crown-line text-3xl text-white" />
                <div>
                  <div className="text-white font-bold text-lg">Premium Active</div>
                  <div className="text-white/80 text-sm">Exclusive rewards unlocked</div>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-gray-400 text-sm mb-1">Current Tier</div>
                <div className="text-white font-bold text-3xl">Tier {seasonPass.current_tier}</div>
              </div>
              <div className="text-right">
                <div className="text-gray-400 text-sm mb-1">Total XP</div>
                <div className="text-white font-bold text-3xl">{seasonPass.experience.toLocaleString()}</div>
              </div>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-full transition-all duration-500"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>Tier {seasonPass.current_tier}</span>
              <span>Next: Tier {seasonPass.current_tier + 1}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('pass')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-3 whitespace-nowrap cursor-pointer ${
              activeTab === 'pass'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
            }`}
          >
            <i className="ri-trophy-line text-2xl" />
            Season Pass
          </button>
          <button
            onClick={() => setActiveTab('missions')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-3 whitespace-nowrap cursor-pointer ${
              activeTab === 'missions'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
            }`}
          >
            <i className="ri-task-line text-2xl" />
            Missions
          </button>
        </div>

        {/* Season Pass Content */}
        {activeTab === 'pass' && (
          <div className="space-y-4">
            {currentSeasonPass.tiers.map(tier => {
              const isUnlocked = seasonPass.current_tier >= tier.tier;
              const freeRewardClaimed = seasonPass.claimed_tiers.includes(tier.tier);
              const premiumRewardClaimed = seasonPass.claimed_tiers.includes(tier.tier);

              return (
                <div
                  key={tier.tier}
                  className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border-2 ${isUnlocked ? 'border-purple-500' : 'border-slate-700'}`}
                >
                  <div className="flex items-center gap-6">
                    {/* Tier Number */}
                    <div className={`w-24 h-24 rounded-xl flex items-center justify-center flex-shrink-0 ${isUnlocked ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-slate-700'}`}>
                      <div className="text-center">
                        <div className="text-white font-bold text-2xl">{tier.tier}</div>
                        <div className="text-white/80 text-xs">TIER</div>
                      </div>
                    </div>

                    {/* Free Rewards */}
                    <div className="flex-1">
                      <div className="text-gray-400 text-sm mb-2 font-semibold">FREE REWARDS</div>
                      <div className="flex flex-wrap gap-2">
                        {tier.freeRewards.map((reward, idx) => (
                          <div key={idx} className="bg-slate-700 rounded-lg px-4 py-2 text-sm text-white">
                            {reward.name}
                          </div>
                        ))}
                      </div>
                      {isUnlocked && !freeRewardClaimed && (
                        <button
                          onClick={() => handleClaimReward(tier.tier, false)}
                          className="mt-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer"
                        >
                          Claim Free Reward
                        </button>
                      )}
                      {freeRewardClaimed && (
                        <div className="mt-3 text-green-400 font-semibold flex items-center gap-2">
                          <i className="ri-check-line" />
                          Claimed
                        </div>
                      )}
                    </div>

                    {/* Premium Rewards */}
                    <div className="flex-1">
                      <div className="text-yellow-400 text-sm mb-2 font-semibold flex items-center gap-2">
                        <i className="ri-vip-crown-line" />
                        PREMIUM REWARDS
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tier.premiumRewards.map((reward, idx) => (
                          <div key={idx} className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border border-yellow-500/30 rounded-lg px-4 py-2 text-sm text-white">
                            {reward.name}
                          </div>
                        ))}
                      </div>
                      {isUnlocked && seasonPass.is_premium && !premiumRewardClaimed && (
                        <button
                          onClick={() => handleClaimReward(tier.tier, true)}
                          className="mt-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer"
                        >
                          Claim Premium Reward
                        </button>
                      )}
                      {premiumRewardClaimed && (
                        <div className="mt-3 text-yellow-400 font-semibold flex items-center gap-2">
                          <i className="ri-check-line" />
                          Claimed
                        </div>
                      )}
                      {!seasonPass.is_premium && (
                        <div className="mt-3 text-gray-500 font-semibold flex items-center gap-2">
                          <i className="ri-lock-line" />
                          Premium Required
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Missions Content */}
        {activeTab === 'missions' && (
          <div>
            {/* Mission Tabs */}
            <div className="flex gap-4 mb-6">
              {(['daily', 'weekly', 'seasonal'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setMissionTab(tab)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    missionTab === tab
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Missions
                </button>
              ))}
            </div>

            {/* Mission Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {missionTab === 'daily' && getDailyMissions().map(renderMissionCard)}
              {missionTab === 'weekly' && getWeeklyMissions().map(renderMissionCard)}
              {missionTab === 'seasonal' && getSeasonalMissions().map(renderMissionCard)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
