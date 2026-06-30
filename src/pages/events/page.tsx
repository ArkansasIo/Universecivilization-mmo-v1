import { useState } from 'react';

interface GameEvent {
  id: string;
  name: string;
  type: 'limited' | 'seasonal' | 'weekly' | 'daily' | 'special';
  status: 'active' | 'upcoming' | 'ended';
  startDate: string;
  endDate: string;
  description: string;
  rewards: {
    type: string;
    amount: string;
  }[];
  objectives: {
    id: string;
    description: string;
    progress: number;
    target: number;
    completed: boolean;
    reward: string;
  }[];
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  participants: number;
  icon: string;
  banner: string;
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'completed'>('active');
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const events: GameEvent[] = [
    {
      id: '1',
      name: 'Galactic Conquest',
      type: 'limited',
      status: 'active',
      startDate: '2024-05-01',
      endDate: '2024-05-31',
      description: 'Compete with players across the universe to conquer the most planets and earn exclusive rewards. Top 100 players receive legendary prizes!',
      rewards: [
        { type: 'Dark Matter', amount: '50,000' },
        { type: 'Legendary Ship Blueprint', amount: '1' },
        { type: 'Credits', amount: '100M' },
        { type: 'Exclusive Title', amount: 'Galactic Conqueror' }
      ],
      objectives: [
        { id: '1', description: 'Conquer 5 planets', progress: 3, target: 5, completed: false, reward: '5,000 DM' },
        { id: '2', description: 'Win 50 battles', progress: 42, target: 50, completed: false, reward: '10,000 DM' },
        { id: '3', description: 'Collect 1B resources', progress: 750000000, target: 1000000000, completed: false, reward: '15,000 DM' },
        { id: '4', description: 'Reach Top 100 ranking', progress: 0, target: 1, completed: false, reward: 'Legendary Blueprint' }
      ],
      difficulty: 'extreme',
      participants: 45820,
      icon: 'ri-trophy-line',
      banner: 'https://readdy.ai/api/search-image?query=epic%20space%20conquest%20battle%20scene%20with%20multiple%20fleets%20engaging%20in%20massive%20warfare%20across%20a%20vibrant%20purple%20and%20cyan%20nebula%20background%20with%20planets%20and%20stars%20creating%20a%20dramatic%20and%20intense%20atmosphere%20of%20galactic%20warfare&width=1200&height=400&seq=event1&orientation=landscape'
    },
    {
      id: '2',
      name: 'Resource Rush',
      type: 'weekly',
      status: 'active',
      startDate: '2024-05-15',
      endDate: '2024-05-22',
      description: 'Gather as many resources as possible within the week. Bonus production rates active for all players!',
      rewards: [
        { type: 'Credits', amount: '25M' },
        { type: 'Dark Matter', amount: '10,000' },
        { type: 'Resource Boost', amount: '7 days' }
      ],
      objectives: [
        { id: '1', description: 'Collect 100M Metal', progress: 85000000, target: 100000000, completed: false, reward: '2,000 DM' },
        { id: '2', description: 'Collect 75M Crystal', progress: 75000000, target: 75000000, completed: true, reward: '3,000 DM' },
        { id: '3', description: 'Collect 50M Deuterium', progress: 38000000, target: 50000000, completed: false, reward: '5,000 DM' }
      ],
      difficulty: 'medium',
      participants: 128450,
      icon: 'ri-database-2-line',
      banner: 'https://readdy.ai/api/search-image?query=futuristic%20mining%20operation%20in%20deep%20space%20with%20massive%20resource%20extraction%20facilities%20harvesting%20crystals%20and%20minerals%20from%20asteroids%20with%20bright%20cyan%20and%20purple%20energy%20beams%20illuminating%20the%20scene&width=1200&height=400&seq=event2&orientation=landscape'
    },
    {
      id: '3',
      name: 'Alliance Wars',
      type: 'seasonal',
      status: 'active',
      startDate: '2024-05-01',
      endDate: '2024-06-30',
      description: 'Team up with your alliance to dominate the galaxy. Coordinate attacks and defend territories to earn massive rewards!',
      rewards: [
        { type: 'Alliance Credits', amount: '500M' },
        { type: 'Dark Matter', amount: '100,000' },
        { type: 'Exclusive Alliance Banner', amount: '1' },
        { type: 'Legendary Officer', amount: '1' }
      ],
      objectives: [
        { id: '1', description: 'Win 100 alliance battles', progress: 67, target: 100, completed: false, reward: '20,000 DM' },
        { id: '2', description: 'Defend 50 territories', progress: 45, target: 50, completed: false, reward: '30,000 DM' },
        { id: '3', description: 'Reach Top 10 alliance ranking', progress: 0, target: 1, completed: false, reward: 'Legendary Officer' }
      ],
      difficulty: 'hard',
      participants: 8950,
      icon: 'ri-shield-star-line',
      banner: 'https://readdy.ai/api/search-image?query=massive%20alliance%20fleet%20battle%20with%20hundreds%20of%20starships%20in%20formation%20engaging%20enemy%20forces%20with%20purple%20and%20cyan%20laser%20beams%20crossing%20through%20space%20with%20dramatic%20explosions%20and%20energy%20shields&width=1200&height=400&seq=event3&orientation=landscape'
    },
    {
      id: '4',
      name: 'Daily Missions',
      type: 'daily',
      status: 'active',
      startDate: '2024-05-18',
      endDate: '2024-05-19',
      description: 'Complete daily objectives to earn quick rewards. Resets every 24 hours!',
      rewards: [
        { type: 'Credits', amount: '5M' },
        { type: 'Dark Matter', amount: '1,000' },
        { type: 'Skill Points', amount: '2' }
      ],
      objectives: [
        { id: '1', description: 'Send 10 fleets', progress: 10, target: 10, completed: true, reward: '500 DM' },
        { id: '2', description: 'Build 5 structures', progress: 3, target: 5, completed: false, reward: '500 DM' },
        { id: '3', description: 'Complete 3 researches', progress: 1, target: 3, completed: false, reward: '1,000 DM' },
        { id: '4', description: 'Win 5 battles', progress: 5, target: 5, completed: true, reward: '2 SP' }
      ],
      difficulty: 'easy',
      participants: 256780,
      icon: 'ri-calendar-check-line',
      banner: 'https://readdy.ai/api/search-image?query=daily%20space%20mission%20control%20center%20with%20holographic%20displays%20showing%20mission%20objectives%20and%20progress%20bars%20in%20a%20high%20tech%20command%20room%20with%20purple%20and%20cyan%20lighting%20and%20futuristic%20interface%20elements&width=1200&height=400&seq=event4&orientation=landscape'
    },
    {
      id: '5',
      name: 'Dark Matter Hunt',
      type: 'special',
      status: 'upcoming',
      startDate: '2024-05-25',
      endDate: '2024-05-28',
      description: 'A rare event where Dark Matter spawns across the galaxy. Send expeditions to collect this precious resource!',
      rewards: [
        { type: 'Dark Matter', amount: '75,000' },
        { type: 'Quantum Tunnel Blueprint', amount: '1' },
        { type: 'Credits', amount: '50M' }
      ],
      objectives: [
        { id: '1', description: 'Collect 10,000 Dark Matter', progress: 0, target: 10000, completed: false, reward: '15,000 DM' },
        { id: '2', description: 'Complete 50 expeditions', progress: 0, target: 50, completed: false, reward: '20,000 DM' },
        { id: '3', description: 'Discover rare anomaly', progress: 0, target: 1, completed: false, reward: 'Quantum Blueprint' }
      ],
      difficulty: 'hard',
      participants: 0,
      icon: 'ri-flashlight-line',
      banner: 'https://readdy.ai/api/search-image?query=mysterious%20dark%20matter%20anomaly%20in%20deep%20space%20with%20swirling%20purple%20and%20black%20energy%20vortex%20surrounded%20by%20exploration%20ships%20scanning%20the%20phenomenon%20with%20bright%20cyan%20detection%20beams%20in%20a%20mysterious%20cosmic%20setting&width=1200&height=400&seq=event5&orientation=landscape'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'extreme': return 'red';
      case 'hard': return 'orange';
      case 'medium': return 'amber';
      default: return 'emerald';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'limited': return 'purple';
      case 'seasonal': return 'pink';
      case 'weekly': return 'blue';
      case 'daily': return 'cyan';
      default: return 'amber';
    }
  };

  const filteredEvents = events.filter(event => {
    if (activeTab === 'active') return event.status === 'active';
    if (activeTab === 'upcoming') return event.status === 'upcoming';
    if (activeTab === 'completed') return event.status === 'ended';
    return true;
  });

  return (
    <div className="text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-[#d4a853] via-amber-400 to-[#e2c044] bg-clip-text text-transparent">
              Events & Challenges
            </h1>
            <p className="text-gray-400 text-lg">Participate in special events to earn exclusive rewards</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg px-4 py-2">
              <div className="text-xs text-gray-400 mb-1">Active Events</div>
              <div className="text-xl font-bold text-purple-400">{events.filter(e => e.status === 'active').length}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-amber-500/30 rounded-lg px-4 py-2">
              <div className="text-xs text-gray-400 mb-1">Total Rewards</div>
              <div className="text-xl font-bold text-amber-400">235K DM</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'active', name: 'Active Events', icon: 'ri-play-circle-line' },
            { id: 'upcoming', name: 'Upcoming', icon: 'ri-time-line' },
            { id: 'completed', name: 'Completed', icon: 'ri-check-line' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-500/20 border-2 border-purple-500 text-purple-400'
                  : 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:border-purple-500/50'
              }`}
            >
              <i className={`${tab.icon} w-5 h-5 flex items-center justify-center`}></i>
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              className={`bg-slate-800/30 backdrop-blur-sm border border-${getTypeColor(event.type)}-500/30 rounded-xl overflow-hidden hover:border-${getTypeColor(event.type)}-500/60 transition-all cursor-pointer`}
              onClick={() => {
                setSelectedEvent(event);
                setShowDetails(true);
              }}
            >
              {/* Event Banner */}
              <div className="relative h-48 overflow-hidden">
                <img src={event.banner} alt={event.name} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full border bg-${getTypeColor(event.type)}-500/20 border-${getTypeColor(event.type)}-500/50 text-${getTypeColor(event.type)}-400 font-bold uppercase`}>
                    {event.type}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full border bg-${getDifficultyColor(event.difficulty)}-500/20 border-${getDifficultyColor(event.difficulty)}-500/50 text-${getDifficultyColor(event.difficulty)}-400 font-bold uppercase`}>
                    {event.difficulty}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-3xl font-black text-white mb-1">{event.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <span><i className="ri-calendar-line mr-1 w-4 h-4 inline-flex items-center justify-center"></i>{event.startDate} - {event.endDate}</span>
                    <span><i className="ri-team-line mr-1 w-4 h-4 inline-flex items-center justify-center"></i>{event.participants.toLocaleString()} participants</span>
                  </div>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <p className="text-gray-300 mb-4">{event.description}</p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Overall Progress</span>
                    <span className="text-purple-400">
                      {event.objectives.filter(o => o.completed).length}/{event.objectives.length} completed
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r from-${getTypeColor(event.type)}-500 to-${getTypeColor(event.type)}-600 h-2 rounded-full transition-all`}
                      style={{ width: `${(event.objectives.filter(o => o.completed).length / event.objectives.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Objectives Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {event.objectives.slice(0, 2).map(objective => (
                    <div key={objective.id} className={`bg-slate-900/50 rounded-lg p-3 ${objective.completed ? 'border border-emerald-500/30' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">{objective.description}</span>
                        {objective.completed && (
                          <i className="ri-check-line text-emerald-400 w-5 h-5 flex items-center justify-center"></i>
                        )}
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5 mb-1">
                        <div
                          className={`${objective.completed ? 'bg-emerald-500' : 'bg-purple-500'} h-1.5 rounded-full transition-all`}
                          style={{ width: `${Math.min((objective.progress / objective.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{objective.progress.toLocaleString()} / {objective.target.toLocaleString()}</span>
                        <span className="text-amber-400">{objective.reward}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rewards Preview */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Rewards:</span>
                    {event.rewards.slice(0, 3).map((reward, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full">
                        {reward.amount} {reward.type}
                      </span>
                    ))}
                    {event.rewards.length > 3 && (
                      <span className="text-xs text-purple-400">+{event.rewards.length - 3} more</span>
                    )}
                  </div>
                  <button className={`px-6 py-2 bg-${getTypeColor(event.type)}-600 hover:bg-${getTypeColor(event.type)}-500 text-white rounded-lg font-bold transition-all whitespace-nowrap`}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50 overflow-y-auto" onClick={() => setShowDetails(false)}>
          <div className="bg-slate-900 border border-purple-500/30 rounded-xl max-w-4xl w-full my-8" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="relative h-64 overflow-hidden rounded-t-xl">
              <img src={selectedEvent.banner} alt={selectedEvent.name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-black/50 rounded-full p-2"
              >
                <i className="ri-close-line text-2xl w-8 h-8 flex items-center justify-center"></i>
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex gap-2 mb-3">
                  <span className={`text-xs px-3 py-1 rounded-full border bg-${getTypeColor(selectedEvent.type)}-500/20 border-${getTypeColor(selectedEvent.type)}-500/50 text-${getTypeColor(selectedEvent.type)}-400 font-bold uppercase`}>
                    {selectedEvent.type}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full border bg-${getDifficultyColor(selectedEvent.difficulty)}-500/20 border-${getDifficultyColor(selectedEvent.difficulty)}-500/50 text-${getDifficultyColor(selectedEvent.difficulty)}-400 font-bold uppercase`}>
                    {selectedEvent.difficulty}
                  </span>
                </div>
                <h2 className="text-4xl font-black text-white mb-2">{selectedEvent.name}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span><i className="ri-calendar-line mr-1 w-4 h-4 inline-flex items-center justify-center"></i>{selectedEvent.startDate} - {selectedEvent.endDate}</span>
                  <span><i className="ri-team-line mr-1 w-4 h-4 inline-flex items-center justify-center"></i>{selectedEvent.participants.toLocaleString()} participants</span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-300 mb-6">{selectedEvent.description}</p>

              {/* All Objectives */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-purple-400 mb-4">Objectives</h3>
                <div className="space-y-3">
                  {selectedEvent.objectives.map(objective => (
                    <div key={objective.id} className={`bg-slate-800/50 rounded-lg p-4 ${objective.completed ? 'border border-emerald-500/30' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{objective.description}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full">{objective.reward}</span>
                          {objective.completed && (
                            <i className="ri-check-line text-emerald-400 w-5 h-5 flex items-center justify-center"></i>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2 mb-1">
                        <div
                          className={`${objective.completed ? 'bg-emerald-500' : 'bg-purple-500'} h-2 rounded-full transition-all`}
                          style={{ width: `${Math.min((objective.progress / objective.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {objective.progress.toLocaleString()} / {objective.target.toLocaleString()} ({Math.round((objective.progress / objective.target) * 100)}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Rewards */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-purple-400 mb-4">Rewards</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedEvent.rewards.map((reward, idx) => (
                    <div key={idx} className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">{reward.type}</div>
                      <div className="text-xl font-bold text-amber-400">{reward.amount}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button className={`w-full bg-${getTypeColor(selectedEvent.type)}-600 hover:bg-${getTypeColor(selectedEvent.type)}-500 text-white px-6 py-4 rounded-lg font-bold text-lg transition-all whitespace-nowrap`}>
                {selectedEvent.status === 'upcoming' ? (
                  <>
                    <i className="ri-notification-line mr-2 w-6 h-6 inline-flex items-center justify-center"></i>
                    Set Reminder
                  </>
                ) : (
                  <>
                    <i className="ri-play-circle-line mr-2 w-6 h-6 inline-flex items-center justify-center"></i>
                    Participate Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}