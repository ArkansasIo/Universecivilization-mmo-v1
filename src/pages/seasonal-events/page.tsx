import { useState } from 'react';

/* ── Types ───────────────────────────────────────────────────────────── */
type EventStatus = 'active' | 'upcoming' | 'ended';
type EventType = 'holiday' | 'competition' | 'invasion' | 'discovery' | 'cosmic' | 'war';

interface EventTask {
  id: string;
  description: string;
  progress: number;
  target: number;
  reward: string;
  rewardColor: string;
  completed: boolean;
}

interface LeaderboardEntry { rank: number; name: string; score: number; change: number }

interface SeasonalEvent {
  id: string;
  name: string;
  subtitle: string;
  type: EventType;
  status: EventStatus;
  startDate: string;
  endDate: string;
  daysLeft?: number;
  description: string;
  lore: string;
  bonuses: { label: string; value: string; icon: string; color: string }[];
  tasks: EventTask[];
  rewards: { tier: string; score: number; reward: string; icon: string; color: string; claimed: boolean }[];
  leaderboard: LeaderboardEntry[];
  joined: boolean;
  playerScore: number;
  playerRank: number;
  participants: number;
  banner: string;
}

/* ── Mock events ─────────────────────────────────────────────────────── */
const EVENTS: SeasonalEvent[] = [
  {
    id: 'ev1',
    name: 'Galactic Conquest',
    subtitle: 'Seize the Stars',
    type: 'competition',
    status: 'active',
    startDate: '2026-05-01',
    endDate: '2026-05-31',
    daysLeft: 12,
    description: 'Compete against commanders across the universe in the ultimate conquest challenge. Dominate planets, win battles, and accumulate conquest points to claim legendary prizes.',
    lore: 'Once every cycle, the Galactic Council opens the Conquest Games. The most powerful commander earns the right to name a star.',
    bonuses: [
      { label: 'Combat XP', value: '×2.5', icon: 'ri-sword-line', color: '#f87171' },
      { label: 'Fleet Speed', value: '+20%', icon: 'ri-rocket-line', color: '#60a5fa' },
      { label: 'Resource Drop', value: '+35%', icon: 'ri-copper-coin-line', color: '#fcd34d' },
    ],
    tasks: [
      { id: 't1', description: 'Conquer 5 planets', progress: 3, target: 5, reward: '5,000 DM', rewardColor: '#c084fc', completed: false },
      { id: 't2', description: 'Win 50 fleet battles', progress: 42, target: 50, reward: '10,000 DM', rewardColor: '#c084fc', completed: false },
      { id: 't3', description: 'Collect 1 Billion resources', progress: 780000000, target: 1000000000, reward: 'War Ship Blueprint', rewardColor: '#f87171', completed: false },
      { id: 't4', description: 'Earn 10,000 conquest points', progress: 7200, target: 10000, reward: '50K Credits', rewardColor: '#fbbf24', completed: false },
      { id: 't5', description: 'Destroy 500 enemy ships', progress: 500, target: 500, reward: 'Rare Officer Card', rewardColor: '#4ade80', completed: true },
    ],
    rewards: [
      { tier: 'Bronze', score: 1000, reward: '2,000 Dark Matter', icon: 'ri-medal-line', color: '#b45309', claimed: true },
      { tier: 'Silver', score: 5000, reward: '10,000 Dark Matter + Blueprint', icon: 'ri-medal-2-line', color: '#9ca3af', claimed: false },
      { tier: 'Gold', score: 15000, reward: '50,000 DM + Legendary Ship', icon: 'ri-trophy-line', color: '#fbbf24', claimed: false },
      { tier: 'Champion', score: 50000, reward: 'Emperor\'s Sigil + 200K DM', icon: 'ri-vip-crown-line', color: '#f43f5e', claimed: false },
    ],
    leaderboard: [
      { rank: 1, name: 'Emperor Nexus', score: 94200, change: 2 },
      { rank: 2, name: 'Lord Quantum', score: 88500, change: -1 },
      { rank: 3, name: 'Admiral Stellar', score: 75100, change: 1 },
      { rank: 4, name: 'General Vortex', score: 62800, change: 0 },
      { rank: 5, name: 'Commander Storm', score: 54000, change: 3 },
      { rank: 6, name: 'Lady Xenith', score: 48200, change: -2 },
      { rank: 7, name: 'Captain Blaze', score: 41000, change: 1 },
      { rank: 8, name: 'Director Kaos', score: 36500, change: 0 },
    ],
    joined: true,
    playerScore: 7200,
    playerRank: 142,
    participants: 45820,
    banner: 'https://readdy.ai/api/search-image?query=epic%20galactic%20conquest%20competition%20massive%20fleet%20battle%20stars%20exploding%20nebula%20in%20background%20trophy%20gold%20championship%20sci-fi%20dramatic%20cinematic%20atmosphere%20massive%20scale%20war&width=1200&height=280&seq=event-galactic-conquest&orientation=landscape',
  },
  {
    id: 'ev2',
    name: 'Xel Invasion',
    subtitle: 'Defend the Core',
    type: 'invasion',
    status: 'active',
    startDate: '2026-05-15',
    endDate: '2026-05-22',
    daysLeft: 3,
    description: 'The Xel alien armada has launched a massive offensive against the core systems. All commanders must unite to repel the invasion waves. Contribution rewards scale with alien kills.',
    lore: 'The Xel invasion began with a single rift. Now fifty rifts dot the known galaxy. They do not negotiate.',
    bonuses: [
      { label: 'Xel Ship Bounty', value: '×5', icon: 'ri-sword-line', color: '#f87171' },
      { label: 'Alliance Bonus', value: '+40%', icon: 'ri-group-line', color: '#fbbf24' },
      { label: 'Repair Speed', value: '+50%', icon: 'ri-tools-line', color: '#34d399' },
    ],
    tasks: [
      { id: 't1', description: 'Kill 100 Xel Fighters', progress: 87, target: 100, reward: '3,000 DM', rewardColor: '#c084fc', completed: false },
      { id: 't2', description: 'Participate in 5 invasion battles', progress: 5, target: 5, reward: 'Xel Armor Upgrade', rewardColor: '#38bdf8', completed: true },
      { id: 't3', description: 'Destroy 3 Xel Carriers', progress: 1, target: 3, reward: '8,000 DM', rewardColor: '#c084fc', completed: false },
      { id: 't4', description: 'Contribute 500K battle score', progress: 380000, target: 500000, reward: 'Xel Tech Fragment', rewardColor: '#38bdf8', completed: false },
    ],
    rewards: [
      { tier: 'Defender', score: 500, reward: '1,500 DM + Xel Fragment', icon: 'ri-shield-line', color: '#38bdf8', claimed: true },
      { tier: 'Warrior', score: 5000, reward: '8,000 DM + Alien Reactor', icon: 'ri-sword-fill', color: '#60a5fa', claimed: false },
      { tier: 'Hero', score: 20000, reward: 'Xel Hull Module + 30K DM', icon: 'ri-star-fill', color: '#f43f5e', claimed: false },
    ],
    leaderboard: [
      { rank: 1, name: 'Iron Shield Alliance', score: 2480000, change: 0 },
      { rank: 2, name: 'Void Hunters', score: 2150000, change: 1 },
      { rank: 3, name: 'Star Command', score: 1890000, change: -1 },
      { rank: 4, name: 'Red Fleet', score: 1420000, change: 2 },
      { rank: 5, name: 'Nova Corps', score: 1200000, change: 0 },
    ],
    joined: true,
    playerScore: 380000,
    playerRank: 28,
    participants: 128450,
    banner: 'https://readdy.ai/api/search-image?query=alien%20invasion%20fleet%20dark%20menacing%20otherworldly%20ships%20pouring%20through%20a%20glowing%20space%20rift%20attacking%20human%20colonies%20dramatic%20red%20and%20purple%20cosmic%20horror%20cinematic%20dark%20atmosphere%20massive%20scale&width=1200&height=280&seq=event-xel-invasion&orientation=landscape',
  },
  {
    id: 'ev3',
    name: 'Dark Matter Hunt',
    subtitle: 'The Rift Opens',
    type: 'discovery',
    status: 'upcoming',
    startDate: '2026-05-25',
    endDate: '2026-05-28',
    description: 'A rare cosmic event causes Dark Matter to crystallize across the galaxy. Send expeditions to position 16 and specialized scanning ships to collect this precious resource before the window closes.',
    lore: 'The Void Rift occurs every 3 years. Scientists still cannot explain why Dark Matter clusters in the rift zones.',
    bonuses: [
      { label: 'DM Collection', value: '×8', icon: 'ri-focus-2-line', color: '#c084fc' },
      { label: 'Expedition Speed', value: '+60%', icon: 'ri-compass-3-line', color: '#60a5fa' },
      { label: 'Discovery Rate', value: '×3', icon: 'ri-search-line', color: '#4ade80' },
    ],
    tasks: [
      { id: 't1', description: 'Complete 50 expeditions', progress: 0, target: 50, reward: '10,000 DM', rewardColor: '#c084fc', completed: false },
      { id: 't2', description: 'Collect 50,000 Dark Matter', progress: 0, target: 50000, reward: 'Void Drive Module', rewardColor: '#818cf8', completed: false },
      { id: 't3', description: 'Discover 3 rare anomalies', progress: 0, target: 3, reward: 'Quantum Core Blueprint', rewardColor: '#38bdf8', completed: false },
    ],
    rewards: [
      { tier: 'Explorer', score: 100, reward: '5,000 DM', icon: 'ri-compass-3-line', color: '#4ade80', claimed: false },
      { tier: 'Pioneer', score: 1000, reward: '25,000 DM + Void Cloak', icon: 'ri-rocket-line', color: '#c084fc', claimed: false },
      { tier: 'Void Master', score: 5000, reward: '100K DM + Legendary Blueprint', icon: 'ri-focus-2-line', color: '#f43f5e', claimed: false },
    ],
    leaderboard: [],
    joined: false,
    playerScore: 0,
    playerRank: 0,
    participants: 0,
    banner: 'https://readdy.ai/api/search-image?query=dark%20matter%20cosmic%20phenomenon%20glowing%20purple%20and%20black%20void%20rift%20in%20space%20with%20crystalline%20dark%20matter%20formations%20exploration%20ships%20nearby%20mysterious%20beautiful%20cosmic%20event&width=1200&height=280&seq=event-dark-matter-hunt&orientation=landscape',
  },
];

/* ── Type icons and styles ───────────────────────────────────────────── */
const TYPE_STYLE: Record<EventType, { icon: string; color: string; bg: string }> = {
  competition: { icon: 'ri-trophy-line', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  invasion: { icon: 'ri-sword-fill', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  discovery: { icon: 'ri-compass-3-line', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
  holiday: { icon: 'ri-gift-line', color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
  cosmic: { icon: 'ri-planet-fill', color: '#c084fc', bg: 'rgba(192,132,252,0.12)' },
  war: { icon: 'ri-alarm-warning-fill', color: '#f43f5e', bg: 'rgba(244,63,94,0.12)' },
};

/* ── Task progress bar ───────────────────────────────────────────────── */
function TaskRow({ task }: { task: EventTask }) {
  const pct = Math.min(100, (task.progress / task.target) * 100);
  const formatVal = (v: number) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v.toLocaleString();
  return (
    <div className="rounded-lg p-3" style={{ background: task.completed ? 'rgba(74,222,128,0.05)' : 'rgba(255,255,255,0.03)', border: `1px solid ${task.completed ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <i className={`${task.completed ? 'ri-checkbox-circle-fill text-green-400' : 'ri-circle-line text-gray-600'} text-sm flex-shrink-0`}></i>
          <span className="text-xs text-white">{task.description}</span>
        </div>
        <span className="text-xs font-semibold ml-3 flex-shrink-0" style={{ color: task.rewardColor }}>{task.reward}</span>
      </div>
      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: task.completed ? '#4ade80' : 'linear-gradient(90deg,#818cf8,#a78bfa)' }}></div>
      </div>
      <div className="flex justify-between text-xs mt-1" style={{ color: '#6b7a95' }}>
        <span>{formatVal(task.progress)} / {formatVal(task.target)}</span>
        <span>{pct.toFixed(0)}%</span>
      </div>
    </div>
  );
}

/* ── Event detail modal ────────────────────────────────────────────── */
function EventModal({ event, onClose }: { event: SeasonalEvent; onClose: () => void }) {
  const [activeSection, setActiveSection] = useState<'overview' | 'tasks' | 'rewards' | 'leaderboard'>('overview');
  const ts = TYPE_STYLE[event.type];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto" onClick={onClose}>
      <div className="min-h-screen px-4 py-8 flex items-start justify-center">
        <div className="w-full max-w-3xl rounded-2xl overflow-hidden" style={{ background: '#0a0f1e', border: `1px solid ${ts.color}30` }} onClick={e => e.stopPropagation()}>
          {/* Banner */}
          <div className="relative h-44 overflow-hidden">
            <img src={event.banner} alt={event.name} className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-black/40 to-transparent"></div>
            <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer hover:bg-white/20" style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <i className="ri-close-line text-white text-sm"></i>
            </button>
            <div className="absolute bottom-4 left-5">
              <span className="text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block" style={{ background: ts.bg, color: ts.color, border: `1px solid ${ts.color}30` }}>
                <i className={`${ts.icon} mr-1`}></i>{event.type.toUpperCase()}
              </span>
              <h2 className="text-2xl font-black text-white">{event.name}</h2>
              <p className="text-sm" style={{ color: ts.color }}>{event.subtitle}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-5 pt-4 pb-0">
            {([['overview', 'Overview'], ['tasks', `Tasks (${event.tasks.filter(t=>!t.completed).length} left)`], ['rewards', 'Rewards'], ['leaderboard', 'Leaderboard']] as const).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className="px-4 py-2 text-xs font-semibold rounded-t-lg cursor-pointer transition-all whitespace-nowrap"
                style={activeSection === id
                  ? { background: ts.bg, color: ts.color, border: `1px solid ${ts.color}25`, borderBottom: 'none' }
                  : { color: '#6b7280' }
                }
              >{label}</button>
            ))}
          </div>

          <div className="p-5" style={{ borderTop: `1px solid ${ts.color}15` }}>
            {/* Overview */}
            {activeSection === 'overview' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-300 leading-relaxed">{event.description}</p>
                <div className="rounded-lg p-3 italic text-xs text-gray-400 leading-relaxed" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  "{event.lore}"
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Active Bonuses</p>
                  <div className="grid grid-cols-3 gap-3">
                    {event.bonuses.map((b, i) => (
                      <div key={i} className="rounded-lg p-3 text-center" style={{ background: `${b.color}08`, border: `1px solid ${b.color}20` }}>
                        <i className={`${b.icon} text-xl block mb-1`} style={{ color: b.color }}></i>
                        <p className="text-lg font-black" style={{ color: b.color }}>{b.value}</p>
                        <p className="text-xs text-gray-400">{b.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-lg font-black" style={{ color: ts.color }}>{event.participants.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Participants</p>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-lg font-black text-white">{event.playerScore.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Your Score</p>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-lg font-black text-amber-400">#{event.playerRank || '—'}</p>
                    <p className="text-xs text-gray-400">Your Rank</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tasks */}
            {activeSection === 'tasks' && (
              <div className="space-y-2.5">
                {event.tasks.map(task => <TaskRow key={task.id} task={task} />)}
              </div>
            )}

            {/* Rewards */}
            {activeSection === 'rewards' && (
              <div className="space-y-3">
                {event.rewards.map((r, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-xl p-4" style={{ background: `${r.color}08`, border: `1px solid ${r.color}${event.playerScore >= r.score ? '35' : '15'}` }}>
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: `${r.color}15` }}>
                      <i className={`${r.icon} text-2xl`} style={{ color: r.color }}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-bold text-white">{r.tier} Tier</span>
                        <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: `${r.color}15`, color: r.color }}>
                          {r.score.toLocaleString()} score
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: r.color }}>{r.reward}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {r.claimed ? (
                        <span className="text-xs text-green-400 font-bold"><i className="ri-check-line mr-1"></i>Claimed</span>
                      ) : event.playerScore >= r.score ? (
                        <button className="px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer whitespace-nowrap" style={{ background: `${r.color}20`, border: `1px solid ${r.color}35`, color: r.color }}>
                          Claim
                        </button>
                      ) : (
                        <span className="text-xs text-gray-500">{r.score - event.playerScore} pts needed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Leaderboard */}
            {activeSection === 'leaderboard' && (
              <div>
                {event.leaderboard.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <i className="ri-trophy-line text-3xl text-gray-600 block mb-2"></i>
                    Event hasn't started yet
                  </div>
                ) : (
                  <div className="space-y-2">
                    {event.leaderboard.map((entry, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg px-4 py-3" style={{
                        background: i < 3 ? `${ts.color}08` : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${i < 3 ? `${ts.color}20` : 'rgba(255,255,255,0.05)'}`,
                      }}>
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg font-black text-sm flex-shrink-0" style={{
                          background: i === 0 ? 'rgba(251,191,36,0.2)' : i === 1 ? 'rgba(156,163,175,0.2)' : i === 2 ? 'rgba(180,83,9,0.2)' : 'rgba(255,255,255,0.05)',
                          color: i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : i === 2 ? '#b45309' : '#6b7280',
                        }}>
                          {entry.rank}
                        </div>
                        <span className="text-sm font-semibold text-white flex-1">{entry.name}</span>
                        <div className="flex items-center gap-2">
                          {entry.change !== 0 && (
                            <span className="text-xs" style={{ color: entry.change > 0 ? '#4ade80' : '#f87171' }}>
                              <i className={`${entry.change > 0 ? 'ri-arrow-up-line' : 'ri-arrow-down-line'}`}></i>{Math.abs(entry.change)}
                            </span>
                          )}
                          <span className="text-sm font-bold" style={{ color: ts.color }}>{entry.score.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer CTA */}
          {event.status === 'active' && (
            <div className="px-5 pb-5">
              <button className="w-full py-3 rounded-xl text-sm font-bold cursor-pointer transition-all whitespace-nowrap" style={{ background: `linear-gradient(135deg, ${ts.color}, ${ts.bg.replace('rgba', 'rgba').replace(/,[\d.]+\)/, ',0.8)') || ts.color})`, color: '#fff' }}>
                <i className={`${ts.icon} mr-2`}></i>
                {event.joined ? 'View My Progress' : 'Join Event Now'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────────────── */
export default function SeasonalEventsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'ended'>('active');
  const [selectedEvent, setSelectedEvent] = useState<SeasonalEvent | null>(null);

  const active = EVENTS.filter(e => e.status === 'active');
  const upcoming = EVENTS.filter(e => e.status === 'upcoming');

  function EventCard({ event }: { event: SeasonalEvent }) {
    const ts = TYPE_STYLE[event.type];
    const totalTasks = event.tasks.length;
    const doneTasks = event.tasks.filter(t => t.completed).length;
    const overallPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    return (
      <div
        className="rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.01]"
        style={{ background: '#0d1526', border: `1px solid ${ts.color}20` }}
        onClick={() => setSelectedEvent(event)}
      >
        {/* Banner */}
        <div className="relative h-36 overflow-hidden">
          <img src={event.banner} alt={event.name} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1526] via-black/40 to-transparent"></div>
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: ts.bg, color: ts.color, border: `1px solid ${ts.color}30` }}>
              <i className={`${ts.icon} mr-1`}></i>{event.type}
            </span>
            {event.status === 'active' && event.daysLeft !== undefined && event.daysLeft <= 3 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(248,113,113,0.2)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}>
                <i className="ri-time-line mr-1"></i>{event.daysLeft}d left!
              </span>
            )}
          </div>
          {event.joined && (
            <div className="absolute top-3 right-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(74,222,128,0.2)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}>
                <i className="ri-check-line mr-1"></i>Joined
              </span>
            </div>
          )}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-base font-black text-white">{event.name}</h3>
            <p className="text-xs" style={{ color: ts.color }}>{event.subtitle}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">{event.description}</p>

          {/* Bonuses row */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {event.bonuses.map((b, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded font-semibold" style={{ background: `${b.color}12`, color: b.color, border: `1px solid ${b.color}20` }}>
                <i className={`${b.icon} mr-0.5`}></i>{b.value} {b.label}
              </span>
            ))}
          </div>

          {/* Task progress */}
          {event.joined && totalTasks > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1" style={{ color: '#6b7a95' }}>
                <span>Tasks: {doneTasks}/{totalTasks}</span>
                <span>{overallPct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-1.5 rounded-full transition-all" style={{ width: `${overallPct}%`, background: ts.color }}></div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3" style={{ color: '#6b7a95' }}>
              <span><i className="ri-group-line mr-1"></i>{event.participants > 0 ? `${(event.participants / 1000).toFixed(0)}K` : 'TBD'} players</span>
              {event.playerScore > 0 && <span style={{ color: ts.color }}><i className="ri-star-line mr-1"></i>{event.playerScore.toLocaleString()} pts</span>}
            </div>
            <span className="text-xs px-2 py-0.5 rounded font-medium" style={{
              background: event.status === 'active' ? 'rgba(74,222,128,0.1)' : event.status === 'upcoming' ? 'rgba(96,165,250,0.1)' : 'rgba(107,114,128,0.1)',
              color: event.status === 'active' ? '#4ade80' : event.status === 'upcoming' ? '#60a5fa' : '#9ca3af'
            }}>
              {event.status === 'active' ? 'LIVE' : event.status === 'upcoming' ? `Starts ${event.startDate}` : 'ENDED'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white px-6 py-5">
      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ background: 'linear-gradient(135deg,#f43f5e,#c084fc,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Seasonal Events
        </h1>
        <p className="text-xs text-gray-400 mt-1">Limited-time events with exclusive rewards, unique challenges, and galactic-scale competition</p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Active Events', val: active.length, icon: 'ri-play-circle-line', color: '#4ade80' },
          { label: 'Upcoming', val: upcoming.length, icon: 'ri-time-line', color: '#60a5fa' },
          { label: 'Events Joined', val: EVENTS.filter(e => e.joined).length, icon: 'ri-check-line', color: '#fbbf24' },
          { label: 'Total DM Available', val: '170K+', icon: 'ri-focus-2-line', color: '#c084fc' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3.5 flex items-center gap-3" style={{ background: `${s.color}0a`, border: `1px solid ${s.color}20` }}>
            <div className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${s.color}15` }}>
              <i className={`${s.icon} text-base`} style={{ color: s.color }}></i>
            </div>
            <div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-lg font-black" style={{ color: s.color }}>{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-white/5 rounded-lg p-1 w-fit">
        {([['active', `Active (${active.length})`], ['upcoming', `Upcoming (${upcoming.length})`], ['ended', 'Past Events']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap"
            style={activeTab === id
              ? { background: 'rgba(244,63,94,0.2)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' }
              : { color: '#6b7280' }
            }
          >{label}</button>
        ))}
      </div>

      {/* Event grid */}
      {activeTab === 'active' && (
        <div>
          {active.length === 0 ? (
            <div className="rounded-xl p-12 text-center" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <i className="ri-calendar-event-line text-3xl text-gray-600 block mb-2"></i>
              <p className="text-gray-400">No active events right now. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {active.map(e => <EventCard key={e.id} event={e} />)}
            </div>
          )}
        </div>
      )}

      {activeTab === 'upcoming' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {upcoming.map(e => <EventCard key={e.id} event={e} />)}
          {upcoming.length === 0 && (
            <div className="col-span-2 rounded-xl p-12 text-center" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <i className="ri-time-line text-3xl text-gray-600 block mb-2"></i>
              <p className="text-gray-400">No upcoming events scheduled yet</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ended' && (
        <div className="rounded-xl p-12 text-center" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <i className="ri-history-line text-3xl text-gray-600 block mb-2"></i>
          <p className="text-gray-400">No past events to display</p>
        </div>
      )}
    </div>
  );
}