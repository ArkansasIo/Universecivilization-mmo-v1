import { useState } from 'react';
import { useAllianceSystem } from '../../hooks/useAllianceSystem';
import { useAuth } from '../../contexts/AuthContext';

const GOLD = '#d4a853';
const BORDER = '#1e2a36';
const CARD_BG = '#080b0f';

interface AllianceMember {
  id: string; name: string; rank: string; contribution: number; joinDate: string; lastActive: string; level: number; power: number;
}
interface AllianceWar {
  id: string; enemyAlliance: string; status: 'active' | 'won' | 'lost'; score: { us: number; them: number }; endsAt: string; rewards: string;
}

export default function AlliancePage() {
  const { user } = useAuth();
  const { alliance, joinAlliance, leaveAlliance, createAlliance } = useAllianceSystem();
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'wars' | 'diplomacy' | 'treasury' | 'technology' | 'events' | 'create'>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newAllianceName, setNewAllianceName] = useState('');
  const [newAllianceTag, setNewAllianceTag] = useState('');
  const [newAllianceDescription, setNewAllianceDescription] = useState('');

  const mockAlliance = {
    id: 'alliance-1', name: 'Galactic Empire', tag: '[GE]', level: 15, members: 48, maxMembers: 50,
    power: 15847293, rank: 3, description: 'The most powerful alliance in the galaxy. We dominate through strength and strategy.',
    leader: 'Emperor Palpatine', founded: '2024-01-15',
    treasury: { metal: 50000000, crystal: 30000000, deuterium: 15000000, darkMatter: 500000 },
    perks: [
      { name: 'Resource Boost', level: 10, effect: '+50% resource production' },
      { name: 'Fleet Speed', level: 8, effect: '+40% fleet speed' },
      { name: 'Research Speed', level: 12, effect: '+60% research speed' },
      { name: 'Defense Bonus', level: 7, effect: '+35% defense power' }
    ],
    technologies: [
      { name: 'Alliance Weapons', level: 15, progress: 75 },
      { name: 'Alliance Shields', level: 12, progress: 40 },
      { name: 'Alliance Drive', level: 10, progress: 90 }
    ]
  };

  const mockMembers: AllianceMember[] = [
    { id: '1', name: 'Emperor Palpatine', rank: 'Leader', contribution: 5847293, joinDate: '2024-01-15', lastActive: '2 min ago', level: 250, power: 5847293 },
    { id: '2', name: 'Darth Vader', rank: 'Co-Leader', contribution: 4123456, joinDate: '2024-01-16', lastActive: '15 min ago', level: 235, power: 4123456 },
    { id: '3', name: 'Grand Moff Tarkin', rank: 'Officer', contribution: 2987654, joinDate: '2024-01-20', lastActive: '1 hour ago', level: 220, power: 2987654 },
    { id: '4', name: 'Admiral Thrawn', rank: 'Officer', contribution: 2456789, joinDate: '2024-01-22', lastActive: '3 hours ago', level: 215, power: 2456789 },
    { id: '5', name: 'Captain Phasma', rank: 'Elite Member', contribution: 1876543, joinDate: '2024-02-01', lastActive: '5 hours ago', level: 200, power: 1876543 },
    { id: '6', name: 'General Hux', rank: 'Elite Member', contribution: 1654321, joinDate: '2024-02-05', lastActive: '8 hours ago', level: 195, power: 1654321 },
    { id: '7', name: 'Kylo Ren', rank: 'Member', contribution: 1234567, joinDate: '2024-02-10', lastActive: '12 hours ago', level: 180, power: 1234567 },
    { id: '8', name: 'Commander Cody', rank: 'Member', contribution: 987654, joinDate: '2024-02-15', lastActive: '1 day ago', level: 175, power: 987654 }
  ];

  const mockWars: AllianceWar[] = [
    { id: '1', enemyAlliance: 'Rebel Alliance [RA]', status: 'active', score: { us: 1250, them: 980 }, endsAt: '2024-12-25 18:00', rewards: '5M Metal, 3M Crystal, 1M Dark Matter' },
    { id: '2', enemyAlliance: 'Trade Federation [TF]', status: 'won', score: { us: 2100, them: 1450 }, endsAt: '2024-12-20 12:00', rewards: 'Claimed' },
    { id: '3', enemyAlliance: 'Separatist Alliance [SA]', status: 'lost', score: { us: 890, them: 1200 }, endsAt: '2024-12-15 20:00', rewards: 'None' }
  ];

  const mockDiplomacy = [
    { alliance: 'Republic Forces [RF]', relation: 'Allied', since: '2024-03-01', pact: 'Non-Aggression Pact' },
    { alliance: 'Mandalorian Clans [MC]', relation: 'Friendly', since: '2024-04-15', pact: 'Trade Agreement' },
    { alliance: 'Rebel Alliance [RA]', relation: 'War', since: '2024-12-20', pact: 'Active War' },
    { alliance: 'Bounty Hunters Guild [BH]', relation: 'Neutral', since: '2024-05-10', pact: 'None' }
  ];

  const mockAvailableAlliances = [
    { id: 'a1', name: 'Star Defenders', tag: '[SD]', members: 35, power: 8234567, rank: 8, requirement: 'Level 50+' },
    { id: 'a2', name: 'Cosmic Warriors', tag: '[CW]', members: 42, power: 12456789, rank: 5, requirement: 'Level 100+' },
    { id: 'a3', name: 'Void Hunters', tag: '[VH]', members: 28, power: 5678901, rank: 12, requirement: 'Level 30+' },
    { id: 'a4', name: 'Nebula Knights', tag: '[NK]', members: 31, power: 6789012, rank: 10, requirement: 'Level 75+' }
  ];

  const mockEvents = [
    { id: '1', name: 'Alliance Raid Boss', type: 'Boss Battle', participants: 32, progress: 65, reward: '10M Resources', endsIn: '2h 15m' },
    { id: '2', name: 'Territory Control', type: 'PvP Event', participants: 45, progress: 80, reward: 'Territory Bonuses', endsIn: '5h 30m' },
    { id: '3', name: 'Resource Rush', type: 'Gathering', participants: 38, progress: 45, reward: '5M Each Resource', endsIn: '8h 45m' }
  ];

  const handleCreateAlliance = () => {
    if (newAllianceName && newAllianceTag) {
      createAlliance(newAllianceName, newAllianceTag, newAllianceDescription);
      setShowCreateModal(false);
    }
  };

  const handleJoinAlliance = (allianceId: string) => {
    joinAlliance(allianceId);
    setShowJoinModal(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getRankColor = (rank: string) => {
    const m: Record<string,string> = { Leader: 'text-yellow-400', 'Co-Leader': 'text-orange-400', Officer: 'text-purple-400', 'Elite Member': 'text-teal-400' };
    return m[rank] || 'text-ogame-muted';
  };

  const getRelationColor = (relation: string) => {
    const m: Record<string,string> = { Allied: 'text-emerald-400', Friendly: 'text-teal-400', Neutral: 'text-ogame-muted', War: 'text-red-400' };
    return m[relation] || 'text-ogame-muted';
  };

  const getRelationBg = (relation: string) => {
    const m: Record<string,string> = { Allied: 'bg-emerald-500/10', Friendly: 'bg-teal-500/10', Neutral: 'bg-gray-500/10', War: 'bg-red-500/10' };
    return m[relation] || 'bg-gray-500/10';
  };

  // Not in alliance
  if (!alliance && activeTab !== 'create') {
    return (
      <div className="min-h-screen p-6" style={{ background: '#05080d' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Alliance System</h1>
            <p className="text-ogame-muted">Join forces with other players to dominate the galaxy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl p-8" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(212,168,83,0.1)' }}>
                <i className="ri-team-line text-3xl" style={{ color: GOLD }}></i>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Join an Alliance</h2>
              <p className="text-ogame-muted mb-6">Find and join an existing alliance to start your journey</p>
              <button onClick={() => setShowJoinModal(true)}
                className="w-full px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer text-black"
                style={{ background: 'linear-gradient(90deg, #d4a853, #e2c044)' }}>
                Browse Alliances
              </button>
            </div>

            <div className="rounded-xl p-8" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(245,158,11,0.1)' }}>
                <i className="ri-flag-line text-3xl text-amber-400"></i>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Create Alliance</h2>
              <p className="text-ogame-muted mb-6">Start your own alliance and lead others to victory</p>
              <button onClick={() => setShowCreateModal(true)}
                className="w-full px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer"
                style={{ background: 'rgba(212,168,83,0.1)', color: GOLD, border: `1px solid rgba(212,168,83,0.3)` }}>
                Create New Alliance
              </button>
            </div>
          </div>

          <div className="rounded-xl p-8" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
            <h2 className="text-2xl font-bold text-white mb-6">Alliance Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: 'ri-arrow-up-line', color: 'text-emerald-400', bg: 'bg-emerald-500/10', title: 'Resource Boost', desc: 'Increase production rates' },
                { icon: 'ri-rocket-line', color: 'text-teal-400', bg: 'bg-teal-500/10', title: 'Fleet Bonuses', desc: 'Enhanced fleet capabilities' },
                { icon: 'ri-flask-line', color: 'text-purple-400', bg: 'bg-purple-500/10', title: 'Research Speed', desc: 'Faster technology progress' },
                { icon: 'ri-sword-line', color: 'text-red-400', bg: 'bg-red-500/10', title: 'Combat Power', desc: 'Stronger in battles' },
              ].map((b, i) => (
                <div key={i} className="text-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${b.bg}`}>
                    <i className={`${b.icon} text-2xl ${b.color}`}></i>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{b.title}</h3>
                  <p className="text-ogame-muted text-sm">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="rounded-xl p-8 max-w-2xl w-full" style={{ background: '#0d1117', border: `1px solid ${BORDER}` }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Create New Alliance</h2>
                <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 flex items-center justify-center text-ogame-muted hover:text-white transition-colors cursor-pointer">
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Alliance Name</label>
                  <input type="text" value={newAllianceName} onChange={(e) => setNewAllianceName(e.target.value)} placeholder="Enter alliance name" maxLength={30}
                    className="w-full rounded-lg px-4 py-3 text-white placeholder-ogame-dim focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}` }} />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Alliance Tag</label>
                  <input type="text" value={newAllianceTag} onChange={(e) => setNewAllianceTag(e.target.value)} placeholder="[TAG]" maxLength={6}
                    className="w-full rounded-lg px-4 py-3 text-white placeholder-ogame-dim focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}` }} />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Description</label>
                  <textarea value={newAllianceDescription} onChange={(e) => setNewAllianceDescription(e.target.value)} placeholder="Describe your alliance..." maxLength={500}
                    className="w-full rounded-lg px-4 py-3 text-white placeholder-ogame-dim focus:outline-none h-32 resize-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}` }} />
                </div>
                <div className="rounded-lg p-4" style={{ background: 'rgba(212,168,83,0.05)', border: '1px solid rgba(212,168,83,0.2)' }}>
                  <div className="flex items-start gap-3">
                    <i className="ri-information-line text-xl text-amber-400 mt-0.5"></i>
                    <div>
                      <p className="text-amber-400 font-semibold mb-1">Creation Cost</p>
                      <p className="text-ogame-muted text-sm">1,000,000 Metal · 500,000 Crystal · 250,000 Deuterium</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer text-ogame-muted"
                    style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}` }}>Cancel</button>
                  <button onClick={handleCreateAlliance} disabled={!newAllianceName || !newAllianceTag}
                    className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer text-black"
                    style={{ background: 'linear-gradient(90deg, #d4a853, #e2c044)' }}>Create Alliance</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Join Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ background: '#0d1117', border: `1px solid ${BORDER}` }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Available Alliances</h2>
                <button onClick={() => setShowJoinModal(false)} className="w-8 h-8 flex items-center justify-center text-ogame-muted hover:text-white transition-colors cursor-pointer">
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
              <div className="space-y-4">
                {mockAvailableAlliances.map((alliance) => (
                  <div key={alliance.id} className="rounded-lg p-6 transition-colors" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{alliance.name}</h3>
                          <span className="font-mono" style={{ color: GOLD }}>{alliance.tag}</span>
                          <span className="px-3 py-1 rounded-full text-sm" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>Rank #{alliance.rank}</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2"><i className="ri-team-line text-amber-400"></i><span className="text-ogame-muted">{alliance.members}/50 Members</span></div>
                          <div className="flex items-center gap-2"><i className="ri-sword-line text-red-400"></i><span className="text-ogame-muted">{formatNumber(alliance.power)} Power</span></div>
                          <div className="flex items-center gap-2"><i className="ri-shield-line text-emerald-400"></i><span className="text-ogame-muted">{alliance.requirement}</span></div>
                        </div>
                      </div>
                      <button onClick={() => handleJoinAlliance(alliance.id)}
                        className="px-6 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer text-black"
                        style={{ background: 'linear-gradient(90deg, #d4a853, #e2c044)' }}>Request to Join</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // In alliance view
  return (
    <div className="min-h-screen p-6" style={{ background: '#05080d' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-white">{mockAlliance.name}</h1>
                <span className="text-2xl font-mono" style={{ color: GOLD }}>{mockAlliance.tag}</span>
                <span className="px-4 py-1 rounded-full text-sm font-semibold" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>Level {mockAlliance.level}</span>
              </div>
              <p className="text-ogame-muted">{mockAlliance.description}</p>
            </div>
            <button onClick={() => leaveAlliance()}
              className="px-6 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>Leave Alliance</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: 'ri-team-line', color: 'text-amber-400', label: 'Members', val: `${mockAlliance.members}/${mockAlliance.maxMembers}` },
              { icon: 'ri-sword-line', color: 'text-red-400', label: 'Total Power', val: formatNumber(mockAlliance.power) },
              { icon: 'ri-trophy-line', color: 'text-amber-400', label: 'Galaxy Rank', val: `#${mockAlliance.rank}` },
              { icon: 'ri-user-star-line', color: 'text-yellow-400', label: 'Leader', val: mockAlliance.leader, small: true },
              { icon: 'ri-calendar-line', color: 'text-emerald-400', label: 'Founded', val: mockAlliance.founded, small: true },
            ].map((s, i) => (
              <div key={i} className="rounded-lg p-4" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-2 mb-1"><i className={`${s.icon} ${s.color}`}></i><span className="text-ogame-dim text-sm">{s.label}</span></div>
                <p className={`font-bold text-white ${s.small ? 'text-lg' : 'text-2xl'} truncate`}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: 'ri-dashboard-line' },
            { id: 'members', label: 'Members', icon: 'ri-team-line' },
            { id: 'wars', label: 'Wars', icon: 'ri-sword-line' },
            { id: 'diplomacy', label: 'Diplomacy', icon: 'ri-service-line' },
            { id: 'treasury', label: 'Treasury', icon: 'ri-safe-line' },
            { id: 'technology', label: 'Technology', icon: 'ri-flask-line' },
            { id: 'events', label: 'Events', icon: 'ri-calendar-event-line' }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id ? 'text-black' : 'text-ogame-muted hover:text-white'
              }`}
              style={activeTab === tab.id
                ? { background: 'linear-gradient(90deg, #d4a853, #e2c044)' }
                : { background: CARD_BG, border: `1px solid ${BORDER}` }
              }>
              <i className={`${tab.icon} text-lg`}></i>{tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="rounded-xl p-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
              <h2 className="text-2xl font-bold text-white mb-6">Alliance Perks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockAlliance.perks.map((perk, i) => (
                  <div key={i} className="rounded-lg p-4" style={{ background: '#0d1117', border: `1px solid ${BORDER}` }}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">{perk.name}</h3>
                      <span className="px-3 py-1 rounded-full text-sm" style={{ background: 'rgba(212,168,83,0.1)', color: GOLD }}>Level {perk.level}</span>
                    </div>
                    <p className="text-emerald-400 text-sm">{perk.effect}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
              <h2 className="text-2xl font-bold text-white mb-6">Active Wars</h2>
              {mockWars.filter(w => w.status === 'active').map(war => (
                <div key={war.id} className="rounded-lg p-6" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div><h3 className="text-xl font-bold text-white mb-1">vs {war.enemyAlliance}</h3><p className="text-ogame-muted text-sm">Ends: {war.endsAt}</p></div>
                    <span className="px-4 py-2 rounded-lg font-semibold" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>WAR ACTIVE</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center"><p className="text-ogame-dim text-sm mb-1">Our Score</p><p className="text-3xl font-bold text-emerald-400">{war.score.us}</p></div>
                    <div className="flex items-center justify-center"><i className="ri-sword-line text-4xl text-red-400"></i></div>
                    <div className="text-center"><p className="text-ogame-dim text-sm mb-1">Enemy Score</p><p className="text-3xl font-bold text-red-400">{war.score.them}</p></div>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-ogame-dim text-sm mb-1">Victory Rewards</p><p className="text-white font-semibold">{war.rewards}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
              <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
              <div className="space-y-3">
                {[
                  { icon: 'ri-sword-line', color: 'text-red-400', text: 'Darth Vader attacked Rebel Base [3:245:7]', time: '5 min ago' },
                  { icon: 'ri-user-add-line', color: 'text-emerald-400', text: 'Commander Cody joined the alliance', time: '15 min ago' },
                  { icon: 'ri-trophy-line', color: 'text-amber-400', text: 'Alliance reached Level 15!', time: '1 hour ago' },
                  { icon: 'ri-flask-line', color: 'text-amber-400', text: 'Alliance Weapons upgraded to Level 15', time: '2 hours ago' },
                  { icon: 'ri-service-line', color: 'text-emerald-400', text: 'Peace treaty signed with Republic Forces', time: '3 hours ago' }
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-lg p-4" style={{ background: '#0d1117', border: `1px solid ${BORDER}` }}>
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ background: CARD_BG }}>
                      <i className={`${a.icon} text-xl ${a.color}`}></i>
                    </div>
                    <div className="flex-1"><p className="text-white">{a.text}</p><p className="text-ogame-dim text-sm">{a.time}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Members */}
        {activeTab === 'members' && (
          <div className="rounded-xl p-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Alliance Members ({mockMembers.length})</h2>
              <button className="px-6 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer text-black" style={{ background: 'linear-gradient(90deg, #d4a853, #e2c044)' }}>
                <i className="ri-user-add-line mr-2"></i>Invite Players
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                    {['Rank','Player','Level','Power','Contribution','Joined','Last Active','Actions'].map(h => (
                      <th key={h} className="text-left text-ogame-dim font-semibold py-3 px-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockMembers.map(member => (
                    <tr key={member.id} className="transition-colors" style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <td className="py-4 px-4"><span className={`font-semibold ${getRankColor(member.rank)}`}>{member.rank}</span></td>
                      <td className="py-4 px-4"><span className="text-white font-semibold">{member.name}</span></td>
                      <td className="py-4 px-4"><span className="text-amber-400">{member.level}</span></td>
                      <td className="py-4 px-4"><span className="text-white">{formatNumber(member.power)}</span></td>
                      <td className="py-4 px-4"><span className="text-emerald-400">{formatNumber(member.contribution)}</span></td>
                      <td className="py-4 px-4"><span className="text-ogame-muted">{member.joinDate}</span></td>
                      <td className="py-4 px-4"><span className="text-ogame-muted">{member.lastActive}</span></td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer" style={{ background: 'rgba(212,168,83,0.1)', color: GOLD }}>
                            <i className="ri-message-3-line"></i></button>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                            <i className="ri-user-settings-line"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Wars */}
        {activeTab === 'wars' && (
          <div className="space-y-6">
            <div className="rounded-xl p-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Alliance Wars</h2>
                <button className="px-6 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer" style={{ background: 'linear-gradient(90deg, #ef4444, #dc2626)', color: '#fff' }}>
                  <i className="ri-sword-line mr-2"></i>Declare War
                </button>
              </div>
              <div className="space-y-4">
                {mockWars.map(war => (
                  <div key={war.id} className="rounded-lg p-6" style={{
                    background: war.status === 'active' ? 'rgba(239,68,68,0.05)' : war.status === 'won' ? 'rgba(52,211,153,0.05)' : CARD_BG,
                    border: war.status === 'active' ? '1px solid rgba(239,68,68,0.2)' : `1px solid ${BORDER}`
                  }}>
                    <div className="flex items-center justify-between mb-4">
                      <div><h3 className="text-xl font-bold text-white mb-1">vs {war.enemyAlliance}</h3><p className="text-ogame-muted text-sm">Ended: {war.endsAt}</p></div>
                      <span className="px-4 py-2 rounded-lg font-semibold" style={{
                        background: war.status === 'active' ? 'rgba(239,68,68,0.1)' : war.status === 'won' ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.05)',
                        color: war.status === 'active' ? '#ef4444' : war.status === 'won' ? '#34d399' : '#5a6577'
                      }}>{war.status === 'active' ? 'ACTIVE' : war.status === 'won' ? 'VICTORY' : 'DEFEAT'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center"><p className="text-ogame-dim text-sm mb-1">Our Score</p><p className={`text-3xl font-bold ${war.score.us > war.score.them ? 'text-emerald-400' : 'text-red-400'}`}>{war.score.us}</p></div>
                      <div className="flex items-center justify-center"><i className="ri-sword-line text-4xl text-ogame-dim"></i></div>
                      <div className="text-center"><p className="text-ogame-dim text-sm mb-1">Enemy Score</p><p className={`text-3xl font-bold ${war.score.them > war.score.us ? 'text-emerald-400' : 'text-red-400'}`}>{war.score.them}</p></div>
                    </div>
                    <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)' }}><p className="text-ogame-dim text-sm mb-1">Rewards</p><p className="text-white font-semibold">{war.rewards}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Diplomacy */}
        {activeTab === 'diplomacy' && (
          <div className="rounded-xl p-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Diplomatic Relations</h2>
              <button className="px-6 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer text-black" style={{ background: 'linear-gradient(90deg, #d4a853, #e2c044)' }}>
                <i className="ri-service-line mr-2"></i>Propose Treaty
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockDiplomacy.map((rel, i) => (
                <div key={i} className={`rounded-lg p-6 ${getRelationBg(rel.relation)}`} style={{ border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center justify-between mb-4">
                    <div><h3 className="text-xl font-bold text-white mb-1">{rel.alliance}</h3><p className="text-ogame-muted text-sm">Since {rel.since}</p></div>
                    <span className={`px-4 py-2 rounded-lg font-semibold ${getRelationColor(rel.relation)}`}
                      style={{ background: rel.relation === 'Allied' ? 'rgba(52,211,153,0.1)' : rel.relation === 'War' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)' }}>{rel.relation}</span>
                  </div>
                  <div className="rounded-lg p-3 mb-4" style={{ background: 'rgba(255,255,255,0.03)' }}><p className="text-ogame-dim text-sm mb-1">Current Pact</p><p className="text-white font-semibold">{rel.pact}</p></div>
                  <div className="flex gap-2">
                    {rel.relation !== 'War' ? <>
                      <button className="flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer" style={{ background: 'rgba(212,168,83,0.1)', color: GOLD, border: `1px solid rgba(212,168,83,0.2)` }}>Send Message</button>
                      <button className="flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>Break Pact</button>
                    </> : <button className="flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer" style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>Propose Peace</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Treasury */}
        {activeTab === 'treasury' && (
          <div className="space-y-6">
            <div className="rounded-xl p-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
              <h2 className="text-2xl font-bold text-white mb-6">Alliance Treasury</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Metal', val: mockAlliance.treasury.metal, color: '#fbbf24', icon: 'ri-copper-coin-line' },
                  { label: 'Crystal', val: mockAlliance.treasury.crystal, color: '#5bc0be', icon: 'ri-vip-diamond-line' },
                  { label: 'Deuterium', val: mockAlliance.treasury.deuterium, color: '#34d399', icon: 'ri-drop-line' },
                  { label: 'Dark Matter', val: mockAlliance.treasury.darkMatter, color: '#c084fc', icon: 'ri-contrast-drop-line' },
                ].map(r => (
                  <div key={r.label} className="rounded-lg p-6" style={{ background: '#0d1117', border: `1px solid ${BORDER}` }}>
                    <div className="flex items-center gap-3 mb-2"><i className={`${r.icon} text-2xl`} style={{ color: r.color }}></i><span style={{ color: r.color }}>{r.label}</span></div>
                    <p className="text-3xl font-bold text-white">{formatNumber(r.val)}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg p-6" style={{ background: '#0d1117', border: `1px solid ${BORDER}` }}>
                <h3 className="text-xl font-bold text-white mb-4">Donate Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-ogame-muted mb-2">Resource Type</label>
                    <select className="w-full rounded-lg px-4 py-3 text-white focus:outline-none" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
                      <option style={{background: CARD_BG}}>Metal</option><option style={{background: CARD_BG}}>Crystal</option><option style={{background: CARD_BG}}>Deuterium</option><option style={{background: CARD_BG}}>Dark Matter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-ogame-muted mb-2">Amount</label>
                    <input type="number" placeholder="Enter amount" className="w-full rounded-lg px-4 py-3 text-white placeholder-ogame-dim focus:outline-none" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }} />
                  </div>
                </div>
                <button className="w-full mt-4 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer text-black" style={{ background: 'linear-gradient(90deg, #d4a853, #e2c044)' }}>Donate to Alliance</button>
              </div>
            </div>
            <div className="rounded-xl p-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
              <h2 className="text-2xl font-bold text-white mb-6">Recent Donations</h2>
              <div className="space-y-3">
                {[
                  { player: 'Darth Vader', resource: 'Metal', amount: 5000000, time: '10 min ago' },
                  { player: 'Grand Moff Tarkin', resource: 'Crystal', amount: 3000000, time: '25 min ago' },
                  { player: 'Admiral Thrawn', resource: 'Deuterium', amount: 1500000, time: '1 hour ago' },
                  { player: 'Emperor Palpatine', resource: 'Dark Matter', amount: 50000, time: '2 hours ago' }
                ].map((d, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg p-4" style={{ background: '#0d1117', border: `1px solid ${BORDER}` }}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,168,83,0.08)' }}>
                        <i className="ri-user-line" style={{ color: GOLD }}></i></div>
                      <div><p className="text-white font-semibold">{d.player}</p><p className="text-ogame-dim text-sm">{d.time}</p></div>
                    </div>
                    <div className="text-right"><p className="text-emerald-400 font-semibold">+{formatNumber(d.amount)}</p><p className="text-ogame-dim text-sm">{d.resource}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Technology */}
        {activeTab === 'technology' && (
          <div className="rounded-xl p-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
            <h2 className="text-2xl font-bold text-white mb-6">Alliance Technologies</h2>
            <div className="space-y-4">
              {mockAlliance.technologies.map((tech, i) => (
                <div key={i} className="rounded-lg p-6" style={{ background: '#0d1117', border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center justify-between mb-4">
                    <div><h3 className="text-xl font-bold text-white mb-1">{tech.name}</h3><p className="text-amber-400">Level {tech.level}</p></div>
                    <button className="px-6 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer text-black" style={{ background: 'linear-gradient(90deg, #d4a853, #e2c044)' }}>Upgrade</button>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-1"><span className="text-ogame-dim">Progress to Level {tech.level + 1}</span><span className="text-amber-400">{tech.progress}%</span></div>
                    <div className="w-full rounded-full h-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full transition-all duration-300" style={{ width: `${tech.progress}%`, background: 'linear-gradient(90deg, #d4a853, #e2c044)' }}></div>
                    </div>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: CARD_BG }}><p className="text-ogame-muted text-sm">Next Level Bonus: +5% to all alliance members</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="rounded-xl p-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
              <h2 className="text-2xl font-bold text-white mb-6">Active Alliance Events</h2>
              <div className="space-y-4">
                {mockEvents.map(event => (
                  <div key={event.id} className="rounded-lg p-6" style={{ background: '#0d1117', border: `1px solid ${BORDER}` }}>
                    <div className="flex items-center justify-between mb-4">
                      <div><h3 className="text-xl font-bold text-white mb-1">{event.name}</h3>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="px-3 py-1 rounded-full text-sm" style={{ background: 'rgba(212,168,83,0.1)', color: GOLD }}>{event.type}</span>
                          <span className="text-ogame-muted">{event.participants} participants</span>
                        </div>
                      </div>
                      <div className="text-right"><p className="text-ogame-dim text-sm mb-1">Ends in</p><p className="text-2xl font-bold text-white">{event.endsIn}</p></div>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1"><span className="text-ogame-dim">Event Progress</span><span className="text-amber-400">{event.progress}%</span></div>
                      <div className="w-full rounded-full h-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full transition-all duration-300" style={{ width: `${event.progress}%`, background: 'linear-gradient(90deg, #d4a853, #e2c044)' }}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="rounded-lg px-4 py-2" style={{ background: CARD_BG }}><p className="text-ogame-dim text-sm mb-1">Rewards</p><p className="text-white font-semibold">{event.reward}</p></div>
                      <button className="px-6 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer text-black" style={{ background: 'linear-gradient(90deg, #d4a853, #e2c044)' }}>Participate</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl p-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
              <h2 className="text-2xl font-bold text-white mb-6">Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Alliance Tournament', starts: '2 days', reward: 'Legendary Ships' },
                  { name: 'Resource Gathering', starts: '5 days', reward: '20M Resources' },
                  { name: 'Boss Siege', starts: '1 week', reward: 'Epic Equipment' }
                ].map((e, i) => (
                  <div key={i} className="rounded-lg p-6 text-center" style={{ background: '#0d1117', border: `1px solid ${BORDER}` }}>
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(245,158,11,0.1)' }}>
                      <i className="ri-calendar-event-line text-3xl text-amber-400"></i></div>
                    <h3 className="text-white font-bold mb-2">{e.name}</h3>
                    <p className="text-ogame-muted text-sm mb-3">Starts in {e.starts}</p>
                    <p className="text-amber-400 text-sm">{e.reward}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}