import { useState } from 'react';
import { useQuestSystem } from '../../hooks/useQuestSystem';

import PageLoading from '@/components/PageLoading';

export default function QuestsPage() {
  const { quests, loading, claimRewards } = useQuestSystem();
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active');
  const [selectedQuest, setSelectedQuest] = useState<any>(null);

  const activeQuests = quests.filter(q => !q.completed && !q.claimed);
  const completedQuests = quests.filter(q => q.completed || q.claimed);

  const handleClaimReward = async (questId: string) => {
    const result = await claimRewards(questId);
    if (result.success) {
      alert('Rewards claimed successfully!');
    } else {
      alert('Failed to claim rewards.');
    }
  };

  if (loading) {
    return <PageLoading message="Loading quests..." className="h-64 text-cyan-400" spinnerSize="md" />;
  }

  return (
    <div className="text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <i className="ri-questionnaire-line text-[#d4a853]"></i>
            Quest Log
          </h1>
          <p className="text-gray-400">Complete quests to earn valuable rewards</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedTab('active')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${selectedTab === 'active' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
          >
            Active ({activeQuests.length})
          </button>
          <button
            onClick={() => setSelectedTab('completed')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${selectedTab === 'completed' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
          >
            Completed ({completedQuests.length})
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {selectedTab === 'active' && activeQuests.length === 0 && (
              <div className="text-center py-12">
                <i className="ri-questionnaire-line text-6xl text-gray-600 mb-4 block"></i>
                <p className="text-gray-400 text-lg">No active quests</p>
                <p className="text-gray-500 text-sm">Connect to Supabase to load your quests.</p>
              </div>
            )}

            {selectedTab === 'active' && activeQuests.map((quest) => {
              const progressPct = quest.target > 0 ? Math.min(100, (quest.progress / quest.target) * 100) : 0;
              return (
                <div
                  key={quest.id}
                  onClick={() => setSelectedQuest(quest)}
                  className="rounded-xl p-6 border cursor-pointer transition-all hover:border-cyan-500/50"
                  style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(0,212,255,0.2)' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#00d4ff,#a78bfa)' }}>
                        <i className="ri-questionnaire-line text-2xl text-white"></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{quest.title}</h3>
                        <p className="text-gray-400 text-sm">{quest.description}</p>
                      </div>
                    </div>
                    {quest.completed && !quest.claimed && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleClaimReward(quest.id); }}
                        className="px-4 py-2 rounded-lg font-semibold whitespace-nowrap cursor-pointer"
                        style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff' }}
                      >
                        Claim Reward
                      </button>
                    )}
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-cyan-400 font-semibold">{quest.progress}/{quest.target}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <div className="h-full transition-all" style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg,#00d4ff,#a78bfa)' }}></div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quest.reward_credits && (
                      <span className="px-2 py-1 rounded text-xs" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
                        {quest.reward_credits.toLocaleString()} Credits
                      </span>
                    )}
                    {quest.reward_experience && (
                      <span className="px-2 py-1 rounded text-xs" style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa' }}>
                        {quest.reward_experience.toLocaleString()} XP
                      </span>
                    )}
                    {quest.reward_items && (
                      <span className="px-2 py-1 rounded text-xs" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}>
                        {quest.reward_items}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {selectedTab === 'completed' && completedQuests.length === 0 && (
              <div className="text-center py-12">
                <i className="ri-inbox-line text-6xl text-gray-600 mb-4 block"></i>
                <p className="text-gray-400 text-lg">No completed quests yet</p>
              </div>
            )}

            {selectedTab === 'completed' && completedQuests.map((quest) => (
              <div
                key={quest.id}
                className="rounded-xl p-6 border opacity-75"
                style={{ background: 'rgba(34,197,94,0.05)', borderColor: 'rgba(34,197,94,0.2)' }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}>
                    <i className="ri-check-line text-2xl text-white"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{quest.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{quest.description}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-green-400 text-sm font-semibold">{quest.claimed ? 'CLAIMED' : 'COMPLETED'}</span>
                      {quest.completed_at && (
                        <span className="text-gray-500 text-sm">{new Date(quest.completed_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            {selectedQuest ? (
              <div className="rounded-xl p-6 border sticky top-8"
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(0,212,255,0.2)' }}>
                <h3 className="text-xl font-bold text-white mb-4">Quest Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Title</p>
                    <p className="text-white font-semibold">{selectedQuest.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Description</p>
                    <p className="text-gray-300 text-sm">{selectedQuest.description}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Progress</p>
                    <p className="text-cyan-400 font-semibold">{selectedQuest.progress} / {selectedQuest.target}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Rewards</p>
                    <div className="space-y-1">
                      {selectedQuest.reward_credits && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Credits</span>
                          <span className="text-yellow-400 font-semibold">{selectedQuest.reward_credits.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedQuest.reward_experience && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Experience</span>
                          <span className="text-purple-400 font-semibold">{selectedQuest.reward_experience.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {selectedQuest.completed && !selectedQuest.claimed && (
                    <button
                      onClick={() => handleClaimReward(selectedQuest.id)}
                      className="w-full py-3 rounded-lg font-semibold whitespace-nowrap cursor-pointer"
                      style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff' }}
                    >
                      Claim Reward
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-xl p-6 border text-center"
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(0,212,255,0.2)' }}>
                <i className="ri-information-line text-4xl text-gray-600 mb-3 block"></i>
                <p className="text-gray-400">Select a quest to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
