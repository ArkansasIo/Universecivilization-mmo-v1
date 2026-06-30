import { useState } from 'react';

interface Mission {
  id: number;
  name: string;
  description: string;
  difficulty: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed' | 'failed';
  objectives: {
    description: string;
    current: number;
    required: number;
    completed: boolean;
  }[];
  rewards: {
    metal: number;
    crystal: number;
    deuterium: number;
    credits: number;
    experience: number;
    darkMatter?: number;
    items?: string[];
  };
  requirements: {
    level?: number;
    previousMission?: number;
    buildings?: string[];
    research?: string[];
  };
  timeLimit?: number;
  actionPointCost: number;
}

interface Chapter {
  id: number;
  name: string;
  description: string;
  missions: Mission[];
  completed: number;
  total: number;
  unlocked: boolean;
}

interface Act {
  id: number;
  name: string;
  description: string;
  chapters: Chapter[];
  completed: number;
  total: number;
  unlocked: boolean;
  image: string;
}

export default function MissionCampaign() {
  const [selectedAct, setSelectedAct] = useState<number | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  // Generate comprehensive mission campaign data
  const generateMissions = (actId: number, chapterId: number): Mission[] => {
    const missions: Mission[] = [];
    const baseId = (actId - 1) * 500 + (chapterId - 1) * 50;
    
    for (let i = 1; i <= 50; i++) {
      const missionId = baseId + i;
      const tier = Math.floor(i / 10) + 1;
      const isCompleted = i <= 5;
      const isAvailable = i === 6;
      const isLocked = i > 6;
      
      missions.push({
        id: missionId,
        name: `Mission ${i}: ${getMissionName(actId, chapterId, i)}`,
        description: getMissionDescription(actId, chapterId, i),
        difficulty: getDifficulty(tier),
        status: isCompleted ? 'completed' : isAvailable ? 'available' : 'locked',
        objectives: generateObjectives(actId, chapterId, i),
        rewards: {
          metal: 100000 * tier * actId,
          crystal: 75000 * tier * actId,
          deuterium: 50000 * tier * actId,
          credits: 500000 * tier * actId,
          experience: 10000 * tier * actId,
          darkMatter: tier >= 3 ? 100 * tier : undefined,
          items: tier >= 4 ? [`Tier ${tier} Blueprint`, `Rare Material x${tier}`] : undefined
        },
        requirements: {
          level: i * 2,
          previousMission: i > 1 ? missionId - 1 : undefined,
          buildings: i % 10 === 0 ? [`Building Level ${i}`] : undefined,
          research: i % 15 === 0 ? [`Research Level ${i}`] : undefined
        },
        timeLimit: i % 5 === 0 ? 3600 * (tier + 1) : undefined,
        actionPointCost: tier * 2
      });
    }
    
    return missions;
  };

  const getMissionName = (act: number, chapter: number, mission: number): string => {
    const names = [
      'First Contact', 'Resource Raid', 'Defend the Colony', 'Scout Enemy Territory', 'Establish Outpost',
      'Rescue Operation', 'Destroy Enemy Fleet', 'Capture Strategic Point', 'Research Ancient Tech', 'Build Alliance',
      'Infiltrate Enemy Base', 'Sabotage Mission', 'Escort Convoy', 'Mine Asteroid Field', 'Diplomatic Mission',
      'Assassination Contract', 'Steal Prototype', 'Defend Starbase', 'Explore Unknown Sector', 'Trade Route',
      'Pirate Hunt', 'Rescue Hostages', 'Destroy Superweapon', 'Colonize Planet', 'Research Breakthrough',
      'Epic Space Battle', 'Siege Fortress', 'Negotiate Peace', 'Uncover Conspiracy', 'Time Trial Challenge',
      'Boss Encounter', 'Legendary Quest', 'Ultimate Showdown', 'Final Stand', 'Victory March',
      'Secret Mission', 'Hidden Objective', 'Bonus Challenge', 'Elite Operation', 'Master Quest',
      'Heroic Deed', 'Mythic Trial', 'Cosmic Event', 'Dimensional Rift', 'Reality Break',
      'Quantum Leap', 'Stellar Conquest', 'Galactic Domination', 'Universal Truth', 'Transcendence'
    ];
    return names[mission - 1] || `Operation ${mission}`;
  };

  const getMissionDescription = (act: number, chapter: number, mission: number): string => {
    return `Complete objectives in Act ${act}, Chapter ${chapter} to progress through the campaign and unlock greater rewards.`;
  };

  const getDifficulty = (tier: number): string => {
    if (tier === 1) return 'Easy';
    if (tier === 2) return 'Normal';
    if (tier === 3) return 'Hard';
    if (tier === 4) return 'Expert';
    return 'Master';
  };

  const generateObjectives = (act: number, chapter: number, mission: number) => {
    const objectives = [
      { description: 'Defeat enemy forces', current: mission <= 5 ? 10 : 0, required: 10, completed: mission <= 5 },
      { description: 'Collect resources', current: mission <= 5 ? 5000 : 0, required: 5000, completed: mission <= 5 },
      { description: 'Survive for duration', current: mission <= 5 ? 300 : 0, required: 300, completed: mission <= 5 }
    ];
    
    if (mission % 10 === 0) {
      objectives.push({ description: 'Defeat Boss', current: 0, required: 1, completed: false });
    }
    
    return objectives;
  };

  const generateChapters = (actId: number): Chapter[] => {
    const chapters: Chapter[] = [];
    for (let i = 1; i <= 10; i++) {
      chapters.push({
        id: (actId - 1) * 10 + i,
        name: `Chapter ${i}: ${getChapterName(actId, i)}`,
        description: `Progress through 50 missions in this chapter of Act ${actId}`,
        missions: generateMissions(actId, i),
        completed: i === 1 ? 5 : 0,
        total: 50,
        unlocked: i === 1 || (i === 2 && actId === 1)
      });
    }
    return chapters;
  };

  const getChapterName = (act: number, chapter: number): string => {
    const names = [
      'The Beginning', 'Rising Threat', 'First Blood', 'Turning Point', 'Dark Times',
      'Hope Returns', 'The Offensive', 'Final Push', 'Endgame', 'Victory'
    ];
    return names[chapter - 1];
  };

  const acts: Act[] = [
    {
      id: 1,
      name: 'Act I: The Awakening',
      description: 'Begin your journey as a new commander in the galaxy',
      chapters: generateChapters(1),
      completed: 5,
      total: 500,
      unlocked: true,
      image: 'https://readdy.ai/api/search-image?query=space%20station%20awakening%20new%20commander%20beginning%20journey%20sci-fi%20blue%20glowing%20lights%20futuristic&width=400&height=300&seq=act1&orientation=landscape'
    },
    {
      id: 2,
      name: 'Act II: Rising Empire',
      description: 'Expand your influence across multiple star systems',
      chapters: generateChapters(2),
      completed: 0,
      total: 500,
      unlocked: false,
      image: 'https://readdy.ai/api/search-image?query=expanding%20space%20empire%20multiple%20planets%20colonies%20growing%20power%20sci-fi%20green%20energy&width=400&height=300&seq=act2&orientation=landscape'
    },
    {
      id: 3,
      name: 'Act III: War Begins',
      description: 'Face the first major conflict with rival factions',
      chapters: generateChapters(3),
      completed: 0,
      total: 500,
      unlocked: false,
      image: 'https://readdy.ai/api/search-image?query=space%20war%20beginning%20massive%20fleet%20battle%20explosions%20red%20orange%20fire%20conflict&width=400&height=300&seq=act3&orientation=landscape'
    },
    {
      id: 4,
      name: 'Act IV: Dark Alliance',
      description: 'Uncover a sinister conspiracy threatening the galaxy',
      chapters: generateChapters(4),
      completed: 0,
      total: 500,
      unlocked: false,
      image: 'https://readdy.ai/api/search-image?query=dark%20alliance%20conspiracy%20shadowy%20figures%20purple%20dark%20energy%20mysterious%20threat&width=400&height=300&seq=act4&orientation=landscape'
    },
    {
      id: 5,
      name: 'Act V: The Void',
      description: 'Venture into uncharted void space and face unknown horrors',
      chapters: generateChapters(5),
      completed: 0,
      total: 500,
      unlocked: false,
      image: 'https://readdy.ai/api/search-image?query=void%20space%20dark%20cosmic%20horror%20unknown%20threats%20black%20purple%20nebula%20mysterious&width=400&height=300&seq=act5&orientation=landscape'
    },
    {
      id: 6,
      name: 'Act VI: Ancient Secrets',
      description: 'Discover the remnants of an ancient civilization',
      chapters: generateChapters(6),
      completed: 0,
      total: 500,
      unlocked: false,
      image: 'https://readdy.ai/api/search-image?query=ancient%20alien%20ruins%20mysterious%20artifacts%20glowing%20symbols%20archaeological%20discovery%20cyan%20lights&width=400&height=300&seq=act6&orientation=landscape'
    },
    {
      id: 7,
      name: 'Act VII: Galactic Crisis',
      description: 'The galaxy faces its greatest threat yet',
      chapters: generateChapters(7),
      completed: 0,
      total: 500,
      unlocked: false,
      image: 'https://readdy.ai/api/search-image?query=galactic%20crisis%20massive%20threat%20destroying%20galaxies%20apocalyptic%20red%20fire%20chaos&width=400&height=300&seq=act7&orientation=landscape'
    },
    {
      id: 8,
      name: 'Act VIII: Unity',
      description: 'Unite all factions against the common enemy',
      chapters: generateChapters(8),
      completed: 0,
      total: 500,
      unlocked: false,
      image: 'https://readdy.ai/api/search-image?query=united%20space%20fleets%20alliance%20multiple%20factions%20together%20golden%20light%20hope%20unity&width=400&height=300&seq=act8&orientation=landscape'
    },
    {
      id: 9,
      name: 'Act IX: Final War',
      description: 'The ultimate battle for the fate of the universe',
      chapters: generateChapters(9),
      completed: 0,
      total: 500,
      unlocked: false,
      image: 'https://readdy.ai/api/search-image?query=final%20epic%20space%20war%20massive%20battle%20fleets%20explosions%20dramatic%20orange%20red%20ultimate%20conflict&width=400&height=300&seq=act9&orientation=landscape'
    },
    {
      id: 10,
      name: 'Act X: Ascension',
      description: 'Transcend mortal limitations and achieve godhood',
      chapters: generateChapters(10),
      completed: 0,
      total: 500,
      unlocked: false,
      image: 'https://readdy.ai/api/search-image?query=ascension%20transcendence%20godlike%20power%20cosmic%20energy%20white%20gold%20divine%20light&width=400&height=300&seq=act10&orientation=landscape'
    },
    {
      id: 11,
      name: 'Act XI: New Reality',
      description: 'Shape reality itself and create new universes',
      chapters: generateChapters(11),
      completed: 0,
      total: 500,
      unlocked: false,
      image: 'https://readdy.ai/api/search-image?query=reality%20creation%20new%20universe%20birth%20cosmic%20power%20rainbow%20colors%20dimensional&width=400&height=300&seq=act11&orientation=landscape'
    },
    {
      id: 12,
      name: 'Act XII: Eternity',
      description: 'The final chapter - become eternal and omnipotent',
      chapters: generateChapters(12),
      completed: 0,
      total: 500,
      unlocked: false,
      image: 'https://readdy.ai/api/search-image?query=eternity%20infinite%20power%20omnipotent%20being%20cosmic%20consciousness%20white%20cyan%20divine&width=400&height=300&seq=act12&orientation=landscape'
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20';
      case 'Normal': return 'text-blue-400 bg-blue-400/20';
      case 'Hard': return 'text-yellow-400 bg-yellow-400/20';
      case 'Expert': return 'text-orange-400 bg-orange-400/20';
      case 'Master': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'available': return 'text-cyan-400 bg-cyan-400/20';
      case 'in-progress': return 'text-yellow-400 bg-yellow-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Acts Overview */}
      {!selectedAct && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {acts.map((act) => (
            <div
              key={act.id}
              onClick={() => act.unlocked && setSelectedAct(act.id)}
              className={`bg-[#0A1628] border rounded-xl overflow-hidden transition-all ${
                act.unlocked
                  ? 'border-cyan-400/20 hover:border-cyan-400 cursor-pointer hover:scale-105'
                  : 'border-gray-700/20 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img src={act.image} alt={act.name} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent"></div>
                {!act.unlocked && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <i className="ri-lock-line text-6xl text-gray-500"></i>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{act.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{act.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-cyan-400 font-semibold">{act.completed} / {act.total}</span>
                  </div>
                  <div className="relative w-full h-2 bg-[#0F1F3A] rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all"
                      style={{ width: `${(act.completed / act.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>10 Chapters</span>
                    <span>500 Missions</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chapters View */}
      {selectedAct && !selectedChapter && (
        <div>
          <button
            onClick={() => setSelectedAct(null)}
            className="mb-6 px-4 py-2 bg-cyan-400/20 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-all whitespace-nowrap cursor-pointer"
          >
            <i className="ri-arrow-left-line mr-2"></i>Back to Acts
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {acts.find(a => a.id === selectedAct)?.chapters.map((chapter) => (
              <div
                key={chapter.id}
                onClick={() => chapter.unlocked && setSelectedChapter(chapter.id)}
                className={`bg-[#0A1628] border rounded-xl p-6 transition-all ${
                  chapter.unlocked
                    ? 'border-cyan-400/20 hover:border-cyan-400 cursor-pointer'
                    : 'border-gray-700/20 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{chapter.name}</h3>
                    <p className="text-sm text-gray-400">{chapter.description}</p>
                  </div>
                  {!chapter.unlocked && <i className="ri-lock-line text-2xl text-gray-500"></i>}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Missions Completed</span>
                    <span className="text-cyan-400 font-semibold">{chapter.completed} / {chapter.total}</span>
                  </div>
                  <div className="relative w-full h-2 bg-[#0F1F3A] rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all"
                      style={{ width: `${(chapter.completed / chapter.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missions View */}
      {selectedAct && selectedChapter && (
        <div>
          <button
            onClick={() => setSelectedChapter(null)}
            className="mb-6 px-4 py-2 bg-cyan-400/20 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-all whitespace-nowrap cursor-pointer"
          >
            <i className="ri-arrow-left-line mr-2"></i>Back to Chapters
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {acts
              .find(a => a.id === selectedAct)
              ?.chapters.find(c => c.id === selectedChapter)
              ?.missions.map((mission) => (
                <div
                  key={mission.id}
                  onClick={() => mission.status !== 'locked' && setSelectedMission(mission)}
                  className={`bg-[#0A1628] border rounded-lg p-4 transition-all ${
                    mission.status === 'locked'
                      ? 'border-gray-700/20 opacity-50 cursor-not-allowed'
                      : 'border-cyan-400/20 hover:border-cyan-400 cursor-pointer'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-sm font-bold text-white">{mission.name}</h4>
                    {mission.status === 'locked' && <i className="ri-lock-line text-gray-500"></i>}
                    {mission.status === 'completed' && <i className="ri-checkbox-circle-fill text-green-400"></i>}
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(mission.difficulty)}`}>
                      {mission.difficulty}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(mission.status)}`}>
                      {mission.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-400">
                    <div className="flex items-center justify-between">
                      <span>AP Cost:</span>
                      <span className="text-yellow-400 font-semibold">{mission.actionPointCost} AP</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Rewards:</span>
                      <span className="text-green-400 font-semibold">{formatNumber(mission.rewards.credits)} Credits</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Mission Detail Modal */}
      {selectedMission && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-[#0A1628] border border-cyan-400 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-cyan-400/30">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white mb-2">{selectedMission.name}</h2>
                  <p className="text-gray-400">{selectedMission.description}</p>
                </div>
                <button
                  onClick={() => setSelectedMission(null)}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Objectives</h3>
                <div className="space-y-2">
                  {selectedMission.objectives.map((obj, idx) => (
                    <div key={idx} className="bg-[#0F1F3A] rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white">{obj.description}</span>
                        <span className={`text-sm font-semibold ${obj.completed ? 'text-green-400' : 'text-cyan-400'}`}>
                          {obj.current} / {obj.required}
                        </span>
                      </div>
                      <div className="relative w-full h-2 bg-black/50 rounded-full overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full transition-all ${
                            obj.completed ? 'bg-green-400' : 'bg-cyan-400'
                          }`}
                          style={{ width: `${(obj.current / obj.required) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3">Rewards</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0F1F3A] rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Metal</p>
                    <p className="text-lg font-bold text-white">{formatNumber(selectedMission.rewards.metal)}</p>
                  </div>
                  <div className="bg-[#0F1F3A] rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Crystal</p>
                    <p className="text-lg font-bold text-white">{formatNumber(selectedMission.rewards.crystal)}</p>
                  </div>
                  <div className="bg-[#0F1F3A] rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Deuterium</p>
                    <p className="text-lg font-bold text-white">{formatNumber(selectedMission.rewards.deuterium)}</p>
                  </div>
                  <div className="bg-[#0F1F3A] rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Credits</p>
                    <p className="text-lg font-bold text-emerald-400">{formatNumber(selectedMission.rewards.credits)}</p>
                  </div>
                  <div className="bg-[#0F1F3A] rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Experience</p>
                    <p className="text-lg font-bold text-blue-400">{formatNumber(selectedMission.rewards.experience)}</p>
                  </div>
                  {selectedMission.rewards.darkMatter && (
                    <div className="bg-[#0F1F3A] rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Dark Matter</p>
                      <p className="text-lg font-bold text-purple-400">{selectedMission.rewards.darkMatter}</p>
                    </div>
                  )}
                </div>
                {selectedMission.rewards.items && (
                  <div className="mt-3 space-y-2">
                    {selectedMission.rewards.items.map((item, idx) => (
                      <div key={idx} className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-2 text-sm text-purple-400">
                        <i className="ri-gift-line mr-2"></i>{item}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button className="w-full px-6 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold rounded-lg hover:scale-105 transition-all shadow-lg whitespace-nowrap cursor-pointer">
                <i className="ri-play-line mr-2"></i>
                {selectedMission.status === 'available' ? `Start Mission (${selectedMission.actionPointCost} AP)` : 'Continue Mission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}