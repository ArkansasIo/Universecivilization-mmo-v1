import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────
interface ProfileData {
  username: string;
  email: string;
  level: number;
  experience: number;
  avatar_url: string | null;
  race: string | null;
  government: string | null;
  created_at: string;
  vacation_mode: boolean;
}

interface LeaderboardRow {
  level: number;
  total_points: number;
  fleet_points: number;
  research_points: number;
  building_points: number;
  combat_wins: number;
  total_planets: number;
  galaxy_rank: number | null;
  universe_rank: number | null;
  alliance_name: string | null;
}

interface CombatStats {
  wins: number;
  losses: number;
  totalPlundered: number;
  plunderedMetal: number;
  plunderedCrystal: number;
  plunderedDeuterium: number;
}

interface Resources {
  metal: number;
  crystal: number;
  deuterium: number;
  dark_matter: number;
  imperial_credits: number;
}

interface AchievementRow {
  achievement_name: string;
  category: string;
  is_completed: boolean;
  unlocked_at: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const RANK_TIERS = [
  { name: 'Cadet',       min: 1,  color: '#9ca3af' },
  { name: 'Lieutenant',  min: 10, color: '#34d399' },
  { name: 'Commander',   min: 25, color: '#00d4ff' },
  { name: 'Captain',     min: 40, color: '#a78bfa' },
  { name: 'Admiral',     min: 60, color: '#fbbf24' },
  { name: 'Grand Marshal', min: 80, color: '#f87171' },
];

function getRankTier(level: number) {
  return [...RANK_TIERS].reverse().find(r => level >= r.min) ?? RANK_TIERS[0];
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

const CATEGORY_COLORS: Record<string, string> = {
  combat:    '#f87171',
  building:  '#34d399',
  research:  '#a78bfa',
  fleet:     '#00d4ff',
  economy:   '#fbbf24',
  diplomacy: '#fb923c',
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }: { icon: string; label: string; value: string | number; sub: string; color: string }) {
  return (
    <div className="rounded-xl p-5" style={{ background: `${color}08`, border: `1px solid ${color}25` }}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
          <i className={`${icon} text-xl`} style={{ color }} />
        </div>
        <div>
          <p className="text-xs text-gray-400">{label}</p>
          <p className="text-2xl font-black text-white">{typeof value === 'number' ? fmtNum(value) : value}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500">{sub}</p>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative w-12 h-6 rounded-full cursor-pointer transition-all flex-shrink-0"
      style={{ background: on ? '#00d4ff' : 'rgba(255,255,255,0.15)' }}
    >
      <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all" style={{ left: on ? '26px' : '4px' }} />
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, signOut } = useAuth();

  const [profile, setProfile]     = useState<ProfileData | null>(null);
  const [lb, setLb]               = useState<LeaderboardRow | null>(null);
  const [combat, setCombat]       = useState<CombatStats | null>(null);
  const [resources, setResources] = useState<Resources | null>(null);
  const [achievements, setAchievements] = useState<AchievementRow[]>([]);
  const [planets, setPlanets]     = useState<number>(0);

  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'combat' | 'achievements' | 'settings'>('overview');
  const [editing, setEditing]     = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newAvatar, setNewAvatar]     = useState('');
  const [saveMsg, setSaveMsg]     = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [vacConfirm, setVacConfirm] = useState(false);
  const [notifs, setNotifs]       = useState([true, true, false]);
  const [changeEmail, setChangeEmail] = useState('');
  const [changeEmailLoading, setChangeEmailLoading] = useState(false);
  const [changeEmailMsg, setChangeEmailMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // ── Load all data ──────────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const [
        profileRes,
        lbRes,
        attackRes,
        defRes,
        resourcesRes,
        achievementsRes,
        planetsRes,
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('leaderboard').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('combat_logs').select('result, resources_plundered').eq('attacker_id', user.id),
        supabase.from('combat_logs').select('result').eq('defender_id', user.id),
        supabase.from('player_resources').select('metal,crystal,deuterium,dark_matter,imperial_credits').eq('player_id', user.id).maybeSingle(),
        supabase.from('achievements').select('achievement_name,category,is_completed,unlocked_at').eq('user_id', user.id).order('unlocked_at', { ascending: false }),
        supabase.from('planets').select('id', { count: 'exact' }).eq('player_id', user.id),
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
        setNewUsername(profileRes.data.username ?? '');
        setNewAvatar(profileRes.data.avatar_url ?? '');
      }

      if (lbRes.data) setLb(lbRes.data);

      // Combat stats
      const wins = attackRes.data?.filter(r => r.result === 'victory').length ?? 0;
      const losses = defRes.data?.filter(r => r.result === 'victory').length ?? 0;
      let plunderedMetal = 0;
      let plunderedCrystal = 0;
      let plunderedDeuterium = 0;
      attackRes.data?.forEach(row => {
        const p = row.resources_plundered as Record<string, number> | null;
        if (p) {
          plunderedMetal     += Number(p.metal ?? 0);
          plunderedCrystal   += Number(p.crystal ?? 0);
          plunderedDeuterium += Number(p.deuterium ?? 0);
        }
      });
      setCombat({ wins, losses, totalPlundered: plunderedMetal + plunderedCrystal + plunderedDeuterium, plunderedMetal, plunderedCrystal, plunderedDeuterium });

      if (resourcesRes.data) {
        setResources({
          metal:            Number(resourcesRes.data.metal ?? 0),
          crystal:          Number(resourcesRes.data.crystal ?? 0),
          deuterium:        Number(resourcesRes.data.deuterium ?? 0),
          dark_matter:      Number(resourcesRes.data.dark_matter ?? 0),
          imperial_credits: Number(resourcesRes.data.imperial_credits ?? 0),
        });
      }

      setAchievements(achievementsRes.data ?? []);
      setPlanets(planetsRes.count ?? 0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── Save profile ───────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!user || !newUsername.trim()) {
      setSaveMsg({ type: 'err', text: 'Username cannot be empty' });
      return;
    }
    const { error } = await supabase.from('profiles')
      .update({ username: newUsername.trim(), avatar_url: newAvatar.trim() || null })
      .eq('id', user.id);
    if (error) {
      setSaveMsg({ type: 'err', text: 'Failed to save — ' + error.message });
    } else {
      setProfile(prev => prev ? { ...prev, username: newUsername.trim(), avatar_url: newAvatar.trim() || null } : prev);
      setEditing(false);
      setSaveMsg({ type: 'ok', text: 'Profile updated successfully!' });
    }
    setTimeout(() => setSaveMsg(null), 4000);
  };

  // ── Vacation toggle ────────────────────────────────────────────────────────
  const handleVacation = async (activate: boolean) => {
    if (!user) return;
    await supabase.from('profiles').update({ vacation_mode: activate }).eq('id', user.id);
    setProfile(prev => prev ? { ...prev, vacation_mode: activate } : prev);
    setVacConfirm(false);
    setSaveMsg({ type: 'ok', text: activate ? 'Vacation mode activated — empire protected!' : 'Vacation mode deactivated.' });
    setTimeout(() => setSaveMsg(null), 4000);
  };

  // ── Change email ─────────────────────────────────────────────────────────
  const handleChangeEmail = async () => {
    const newEmail = changeEmail.trim();
    if (!newEmail || !newEmail.includes('@')) {
      setChangeEmailMsg({ type: 'err', text: 'Please enter a valid email address.' });
      setTimeout(() => setChangeEmailMsg(null), 4000);
      return;
    }
    if (newEmail === profile?.email) {
      setChangeEmailMsg({ type: 'err', text: 'New email must be different from your current one.' });
      setTimeout(() => setChangeEmailMsg(null), 4000);
      return;
    }
    setChangeEmailLoading(true);
    setChangeEmailMsg(null);

    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) {
        setChangeEmailMsg({ type: 'err', text: error.message });
      } else {
        setChangeEmailMsg({ type: 'ok', text: 'Verification transmission sent to ' + newEmail + '. Check your inbox to confirm.' });
        setChangeEmail('');
      }
    } catch (err: any) {
      setChangeEmailMsg({ type: 'err', text: err.message || 'Failed to update email.' });
    } finally {
      setChangeEmailLoading(false);
      setTimeout(() => setChangeEmailMsg(null), 6000);
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await signOut();
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const profileReady = !!profile;
  const level      = lb?.level ?? profile?.level ?? 1;
  const xpToNext   = level * 1500;
  const xpPct      = Math.min(((profile?.experience ?? 0) / xpToNext) * 100, 100);
  const rank       = getRankTier(level);
  const winRate    = combat ? Math.round((combat.wins / Math.max(combat.wins + combat.losses, 1)) * 100) : 0;
  const totalPts   = lb?.total_points ?? 0;
  const galaxyRank = lb?.galaxy_rank ?? null;
  const universeRank = lb?.universe_rank ?? null;
  const completedAch  = achievements.filter(a => a.is_completed);
  const vacMode    = profile?.vacation_mode ?? false;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="text-white min-h-screen" style={{ background: 'linear-gradient(180deg, #060b1a 0%, #080d20 100%)' }}>

      {/* ── Vacation confirm modal ── */}
      {vacConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#0a0f1e', border: '1px solid rgba(0,212,255,0.35)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: 'rgba(0,212,255,0.12)' }}>
                <i className="ri-moon-line text-cyan-400 text-lg" />
              </div>
              <h3 className="text-base font-bold">Activate Vacation Mode?</h3>
            </div>
            <div className="rounded-xl p-4 mb-5 space-y-2 text-xs text-gray-300" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}>
              {([
                ['check', 'green', 'Your planets are protected from attacks'],
                ['check', 'green', 'Resource production continues normally'],
                ['close', 'red',   'Cannot attack, send fleets, or trade'],
                ['close', 'red',   'Building and research queues are paused'],
                ['information', 'amber', 'Minimum 48 hours before deactivating'],
              ] as [string, string, string][]).map(([icon, c, text]) => (
                <p key={text} className="flex items-start gap-2">
                  <i className={`ri-${icon}-line text-${c}-400 mt-0.5 flex-shrink-0`} />
                  {text}
                </p>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setVacConfirm(false)} className="flex-1 py-2 rounded-xl text-sm border border-white/10 text-gray-400 hover:bg-white/5 cursor-pointer whitespace-nowrap">Cancel</button>
              <button onClick={() => handleVacation(true)} className="flex-1 py-2 rounded-xl text-sm font-bold cursor-pointer whitespace-nowrap" style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>
                <i className="ri-moon-line mr-1" />Activate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden" style={{ height: 300 }}>
        <img
          src="https://readdy.ai/api/search-image?query=futuristic%20space%20empire%20command%20bridge%20panoramic%20view%20stars%20nebula%20holographic%20displays%20military%20officers%20epic%20cinematic%20dark%20atmospheric%20vast%20cosmic%20environment%20detailed%20sci-fi%20art%20ultra%20wide&width=1920&height=600&seq=profile_hero_v4&orientation=landscape"
          alt="Profile Hero"
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ filter: 'brightness(0.4) saturate(1.3)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(6,11,26,0.96) 100%)' }} />

        <div className="relative z-10 h-full flex items-end pb-7 px-8">
          <div className="flex items-end gap-6 w-full">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {profileReady ? (
                <div className="w-24 h-24 rounded-2xl overflow-hidden" style={{ border: `3px solid ${rank.color}`, boxShadow: `0 0 24px ${rank.color}50` }}>
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                  ) : (
                    <img
                      src="https://readdy.ai/api/search-image?query=futuristic%20military%20commander%20portrait%20close-up%20face%20sci-fi%20armor%20glowing%20eyes%20dark%20background%20detailed%20fantasy%20digital%20art&width=200&height=200&seq=commander_avatar_v2&orientation=squarish"
                      alt="Commander"
                      className="w-full h-full object-cover object-top"
                    />
                  )}
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.06)', border: '3px solid rgba(255,255,255,0.1)' }} />
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-lg" style={{ background: rank.color, color: '#000' }}>
                {level}
              </div>
            </div>

            {/* Name + XP */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                {profileReady ? (
                  <>
                    <h1 className="text-3xl font-black text-white tracking-tight">{profile.username}</h1>
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold whitespace-nowrap" style={{ background: `${rank.color}20`, color: rank.color, border: `1px solid ${rank.color}40` }}>{rank.name}</span>
                    {vacMode && <span className="px-3 py-0.5 rounded-full text-xs font-bold whitespace-nowrap" style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }}><i className="ri-moon-fill mr-1" />Vacation</span>}
                  </>
                ) : (
                  <>
                    <div className="h-9 w-48 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    <div className="h-6 w-20 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-2">
                {lb?.alliance_name && (
                  <div className="flex items-center gap-1.5">
                    <i className="ri-shield-star-line text-amber-400 text-sm" />
                    <span className="text-sm text-amber-400 font-semibold">{lb.alliance_name}</span>
                  </div>
                )}
                {profile?.race && (
                  <div className="flex items-center gap-1.5">
                    <i className="ri-user-star-line text-purple-400 text-sm" />
                    <span className="text-sm text-gray-300">{profile.race}</span>
                  </div>
                )}
                {profile?.government && (
                  <div className="flex items-center gap-1.5">
                    <i className="ri-government-line text-green-400 text-sm" />
                    <span className="text-sm text-gray-300">{profile.government}</span>
                  </div>
                )}
              </div>

              {/* XP bar */}
              <div className="w-80 max-w-full">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Experience</span>
                  <span style={{ color: rank.color }}>{fmtNum(profile?.experience ?? 0)} / {fmtNum(xpToNext)}</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${xpPct}%`, background: `linear-gradient(90deg, ${rank.color}, ${rank.color}80)` }} />
                </div>
              </div>
            </div>

            {/* Top-right stats */}
            <div className="hidden lg:flex items-end gap-6 flex-shrink-0 pb-1">
              {[
                { label: 'Galaxy Rank',  val: galaxyRank  ? `#${galaxyRank}`  : '—', color: '#fbbf24' },
                { label: 'Universe Rank', val: universeRank ? `#${universeRank}` : '—', color: '#f87171' },
                { label: 'Total Points', val: fmtNum(totalPts), color: '#00d4ff' },
                { label: 'Win Rate',     val: `${winRate}%`,   color: '#34d399' },
              ].map(s => (
                <div key={s.label} className="text-right">
                  <p className="text-xs text-gray-400">{s.label}</p>
                  <p className="text-2xl font-black" style={{ color: s.color }}>{s.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      {saveMsg && (
        <div className="mx-6 mt-4 rounded-xl p-3 flex items-center gap-2 text-sm" style={{
          background: saveMsg.type === 'ok' ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
          border: `1px solid ${saveMsg.type === 'ok' ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)'}`,
          color: saveMsg.type === 'ok' ? '#4ade80' : '#f87171',
        }}>
          <i className={saveMsg.type === 'ok' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'} />
          {saveMsg.text}
          <button onClick={() => setSaveMsg(null)} className="ml-auto cursor-pointer"><i className="ri-close-line" /></button>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="mx-6 mt-6 mb-6 flex gap-2 p-1.5 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {([
          { id: 'overview',      icon: 'ri-user-line',     label: 'Overview' },
          { id: 'combat',        icon: 'ri-sword-line',    label: 'Combat' },
          { id: 'achievements',  icon: 'ri-trophy-line',   label: 'Achievements' },
          { id: 'settings',      icon: 'ri-settings-line', label: 'Settings' },
        ] as { id: typeof activeTab; icon: string; label: string }[]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            style={activeTab === tab.id ? { background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(167,139,250,0.2))', border: '1px solid rgba(0,212,255,0.25)' } : {}}
          >
            <i className={`${tab.icon} mr-2`} />{tab.label}
          </button>
        ))}
      </div>

      <div className="px-6 pb-10">

        {/* ═══ OVERVIEW ════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-6 max-w-7xl">

            {/* Big stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon="ri-planet-line"   label="Colonies"    value={planets}           sub="total planets"          color="#00d4ff" />
              <StatCard icon="ri-sword-line"    label="Battles Won" value={combat?.wins ?? 0}  sub={`${winRate}% win rate`} color="#f87171" />
              <StatCard icon="ri-treasure-map-line" label="Resources Plundered" value={combat?.totalPlundered ?? 0} sub="total looted" color="#fbbf24" />
              <StatCard icon="ri-trophy-line"   label="Achievements" value={completedAch.length} sub={`of ${achievements.length > 0 ? achievements.length : '?'} total`} color="#a78bfa" />
            </div>

            {/* Points breakdown + Resources + Account */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Points breakdown */}
              <div className="rounded-xl p-5" style={{ background: 'rgba(10,20,45,0.8)', border: '1px solid rgba(0,212,255,0.15)' }}>
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <i className="ri-bar-chart-line text-cyan-400" />Score Breakdown
                </h3>
                <div className="space-y-3">
                  {([
                    { label: 'Fleet Points',    val: lb?.fleet_points    ?? 0, color: '#00d4ff', icon: 'ri-rocket-line' },
                    { label: 'Research Points', val: lb?.research_points ?? 0, color: '#a78bfa', icon: 'ri-flask-line' },
                    { label: 'Building Points', val: lb?.building_points ?? 0, color: '#34d399', icon: 'ri-building-line' },
                    { label: 'Total Points',    val: lb?.total_points    ?? 0, color: '#fbbf24', icon: 'ri-star-line' },
                  ] as { label: string; val: number; color: string; icon: string }[]).map(row => {
                    const maxVal = lb?.total_points ?? 1;
                    const pct    = Math.round((row.val / Math.max(maxVal, 1)) * 100);
                    return (
                      <div key={row.label}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center gap-1.5 text-gray-300">
                            <i className={`${row.icon}`} style={{ color: row.color }} />
                            {row.label}
                          </div>
                          <span style={{ color: row.color }} className="font-bold">{fmtNum(row.val)}</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                          <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: row.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Resources */}
              <div className="rounded-xl p-5" style={{ background: 'rgba(10,20,45,0.8)', border: '1px solid rgba(251,191,36,0.15)' }}>
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <i className="ri-coin-line text-amber-400" />Current Resources
                </h3>
                {resources ? (
                  <div className="space-y-3">
                    {([
                      { label: 'Metal',            val: resources.metal,            color: '#9ca3af', icon: 'ri-hammer-line' },
                      { label: 'Crystal',          val: resources.crystal,          color: '#67e8f9', icon: 'ri-sparkling-line' },
                      { label: 'Deuterium',        val: resources.deuterium,        color: '#34d399', icon: 'ri-drop-line' },
                      { label: 'Dark Matter',      val: resources.dark_matter,      color: '#a78bfa', icon: 'ri-ghost-line' },
                      { label: 'Imperial Credits', val: resources.imperial_credits, color: '#fbbf24', icon: 'ri-coin-fill' },
                    ] as { label: string; val: number; color: string; icon: string }[]).map(r => (
                      <div key={r.label} className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-2 text-gray-300">
                          <div className="w-6 h-6 flex items-center justify-center rounded" style={{ background: `${r.color}18` }}>
                            <i className={`${r.icon} text-xs`} style={{ color: r.color }} />
                          </div>
                          {r.label}
                        </div>
                        <span className="font-bold" style={{ color: r.color }}>{fmtNum(r.val)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No resource data found.</p>
                )}
              </div>

              {/* Account + Edit */}
              <div className="rounded-xl p-5" style={{ background: 'rgba(10,20,45,0.8)', border: '1px solid rgba(167,139,250,0.15)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <i className="ri-user-fill text-purple-400" />Account
                  </h3>
                  <button
                    onClick={() => setEditing(!editing)}
                    className="text-xs px-3 py-1 rounded-lg cursor-pointer whitespace-nowrap transition-all"
                    style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' }}
                  >
                    <i className={`${editing ? 'ri-close-line' : 'ri-edit-line'} mr-1`} />{editing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {editing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Username</label>
                      <input
                        value={newUsername}
                        onChange={e => setNewUsername(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Avatar URL</label>
                      <input
                        value={newAvatar}
                        onChange={e => setNewAvatar(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                      />
                    </div>
                    <button
                      onClick={handleSave}
                      className="w-full py-2 rounded-lg text-sm font-bold text-white cursor-pointer whitespace-nowrap"
                      style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)' }}
                    >
                      <i className="ri-save-line mr-1" />Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'Email',       val: profile?.email },
                      { label: 'Joined',      val: new Date(profile?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                      { label: 'Player ID',   val: user?.id.slice(0, 16) + '...' },
                      { label: 'Rank',        val: rank.name, style: { color: rank.color, fontWeight: 700 } },
                    ].map(f => (
                      <div key={f.label}>
                        <span className="text-xs text-gray-500">{f.label}</span>
                        <p className="text-white font-mono text-xs" style={f.style}>{f.val}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ═══ COMBAT ══════════════════════════════════════════════════════════ */}
        {activeTab === 'combat' && (
          <div className="max-w-5xl space-y-6">
            {/* Summary row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon="ri-medal-line"   label="Victories"    value={combat?.wins    ?? 0} sub="as attacker"             color="#34d399" />
              <StatCard icon="ri-skull-line"   label="Defeats"      value={combat?.losses  ?? 0} sub="as defender"             color="#f87171" />
              <StatCard icon="ri-percent-line" label="Win Rate"      value={`${winRate}%`}         sub="attack success rate"     color="#fbbf24" />
              <StatCard icon="ri-treasure-map-line" label="Total Plundered" value={combat?.totalPlundered ?? 0} sub="resources looted" color="#00d4ff" />
            </div>

            {/* Win bar + plunder breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl p-5" style={{ background: 'rgba(10,20,45,0.8)', border: '1px solid rgba(248,113,113,0.15)' }}>
                <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                  <i className="ri-sword-fill text-red-400" />Win / Loss Ratio
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span className="text-green-400 font-bold">{combat?.wins ?? 0} Wins</span>
                    <span className="text-red-400 font-bold">{combat?.losses ?? 0} Losses</span>
                  </div>
                  <div className="flex h-4 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div style={{ width: `${winRate}%`, background: 'linear-gradient(90deg,#34d399,#4ade80)' }} />
                    <div style={{ width: `${100 - winRate}%`, background: 'linear-gradient(90deg,#f87171,#ef4444)' }} />
                  </div>
                  <p className="text-center text-2xl font-black text-white mt-3">{winRate}<span className="text-sm text-gray-400">%</span></p>
                  <p className="text-center text-xs text-gray-500">win rate</p>
                </div>
                <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Total Battles</p>
                    <p className="text-xl font-black text-white">{fmtNum((combat?.wins ?? 0) + (combat?.losses ?? 0))}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Galaxy Rank</p>
                    <p className="text-xl font-black" style={{ color: '#fbbf24' }}>{galaxyRank ? `#${galaxyRank}` : '—'}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-5" style={{ background: 'rgba(10,20,45,0.8)', border: '1px solid rgba(251,191,36,0.15)' }}>
                <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                  <i className="ri-treasure-map-line text-amber-400" />Resources Plundered
                </h3>
                {([
                  { label: 'Metal',      val: combat?.plunderedMetal ?? 0,      color: '#9ca3af', icon: 'ri-hammer-line' },
                  { label: 'Crystal',    val: combat?.plunderedCrystal ?? 0,    color: '#67e8f9', icon: 'ri-sparkling-line' },
                  { label: 'Deuterium',  val: combat?.plunderedDeuterium ?? 0,  color: '#34d399', icon: 'ri-drop-line' },
                ] as { label: string; val: number; color: string; icon: string }[]).map(r => {
                  const total = (combat?.totalPlundered ?? 0) || 1;
                  const pct = Math.round((r.val / total) * 100);
                  return (
                    <div key={r.label} className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <i className={`${r.icon}`} style={{ color: r.color }} />{r.label}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{pct}%</span>
                          <span className="font-bold" style={{ color: r.color }}>{fmtNum(r.val)}</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: r.color }} />
                      </div>
                    </div>
                  );
                })}
                <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                  <span className="text-xs text-gray-400">Grand Total</span>
                  <span className="font-black text-xl" style={{ color: '#fbbf24' }}>{fmtNum(combat?.totalPlundered ?? 0)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ ACHIEVEMENTS ════════════════════════════════════════════════════ */}
        {activeTab === 'achievements' && (
          <div className="max-w-7xl space-y-5">
            {/* Progress header */}
            <div className="rounded-xl p-5 flex items-center gap-6" style={{ background: 'rgba(10,20,45,0.8)', border: '1px solid rgba(251,191,36,0.2)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(251,191,36,0.15)', border: '2px solid rgba(251,191,36,0.4)' }}>
                <i className="ri-trophy-fill text-3xl text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-3xl font-black text-white">{completedAch.length}</span>
                  <span className="text-gray-400 text-sm mb-1">/ {achievements.length} achievements unlocked</span>
                </div>
                <div className="w-full h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-2.5 rounded-full transition-all" style={{ width: `${achievements.length > 0 ? (completedAch.length / achievements.length) * 100 : 0}%`, background: 'linear-gradient(90deg,#fbbf24,#f87171)' }} />
                </div>
              </div>
            </div>

            {achievements.length === 0 ? (
              <div className="rounded-xl p-10 text-center" style={{ background: 'rgba(10,20,45,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <i className="ri-trophy-line text-4xl text-gray-600 mb-3 block" />
                <p className="text-gray-400">No achievements recorded yet. Start conquering!</p>
              </div>
            ) : (
              <>
                {/* Group by category */}
                {Object.entries(
                  achievements.reduce<Record<string, AchievementRow[]>>((acc, ach) => {
                    const cat = ach.category ?? 'general';
                    acc[cat] = [...(acc[cat] ?? []), ach];
                    return acc;
                  }, {})
                ).map(([cat, rows]) => (
                  <div key={cat}>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: CATEGORY_COLORS[cat] ?? '#9ca3af' }}>
                      <div className="w-4 h-px flex-1" style={{ background: CATEGORY_COLORS[cat] ?? '#9ca3af', opacity: 0.3 }} />
                      {cat}
                      <div className="w-4 h-px flex-1" style={{ background: CATEGORY_COLORS[cat] ?? '#9ca3af', opacity: 0.3 }} />
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                      {rows.map(ach => {
                        const c = CATEGORY_COLORS[ach.category ?? ''] ?? '#9ca3af';
                        return (
                          <div
                            key={ach.achievement_name}
                            className="rounded-xl p-4 flex flex-col items-center text-center transition-all"
                            style={{
                              background: ach.is_completed ? `${c}08` : 'rgba(10,20,40,0.7)',
                              border: `1px solid ${ach.is_completed ? c + '28' : 'rgba(255,255,255,0.06)'}`,
                              opacity: ach.is_completed ? 1 : 0.45,
                            }}
                          >
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{ background: ach.is_completed ? `${c}20` : 'rgba(255,255,255,0.05)' }}>
                              <i className="ri-trophy-line text-2xl" style={{ color: ach.is_completed ? c : '#374151' }} />
                            </div>
                            <p className="text-sm font-bold text-white mb-1 leading-tight">{ach.achievement_name}</p>
                            {ach.is_completed && ach.unlocked_at && (
                              <p className="text-xs text-gray-500">{new Date(ach.unlocked_at).toLocaleDateString()}</p>
                            )}
                            {ach.is_completed && (
                              <span className="mt-2 text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: `${c}20`, color: c }}>Unlocked</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ═══ SETTINGS ════════════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div className="max-w-xl space-y-4">

            {/* Vacation mode */}
            <div className="rounded-xl p-5" style={{ background: vacMode ? 'rgba(0,212,255,0.07)' : 'rgba(10,20,45,0.8)', border: `1px solid ${vacMode ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.07)'}` }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: vacMode ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.05)' }}>
                  <i className={`ri-moon-line text-lg ${vacMode ? 'text-cyan-400' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Vacation Mode</p>
                  <p className="text-xs text-gray-400 mt-0.5">Protect your empire while away. Pauses all activity.</p>
                  <p className="text-xs mt-1.5" style={{ color: vacMode ? '#00d4ff' : '#6b7280' }}>
                    Status: <span className="font-semibold">{vacMode ? 'Active — Empire Protected' : 'Inactive'}</span>
                  </p>
                </div>
                <Toggle on={vacMode} onChange={() => vacMode ? handleVacation(false) : setVacConfirm(true)} />
              </div>
            </div>

            {/* Email Preferences */}
            <div className="rounded-xl p-5" style={{ background: 'rgba(10,20,45,0.8)', border: '1px solid rgba(0,212,255,0.15)' }}>
              <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <i className="ri-mail-settings-line text-cyan-400" />Email Preferences
              </h4>

              {/* Current email */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Current Comms Frequency</p>
                <p className="text-sm text-white font-mono flex items-center gap-2">
                  <i className="ri-mail-line text-cyan-400 text-xs" />
                  {profile?.email}
                </p>
              </div>

              {/* Change email */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Change Email Address</label>
                  <input
                    type="email"
                    value={changeEmail}
                    onChange={(e) => setChangeEmail(e.target.value)}
                    placeholder="new-commander@empire.local"
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                  />
                </div>
                <button
                  onClick={handleChangeEmail}
                  disabled={changeEmailLoading}
                  className="w-full py-2.5 rounded-lg text-sm font-bold text-white cursor-pointer whitespace-nowrap transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(167,139,250,0.2))', border: '1px solid rgba(0,212,255,0.25)' }}
                >
                  {changeEmailLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="ri-loader-4-line animate-spin" />Updating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <i className="ri-mail-send-line" />Send Verification & Update
                    </span>
                  )}
                </button>
              </div>

              {/* Change email message */}
              {changeEmailMsg && (
                <div className="mt-3 p-3 rounded-lg text-xs flex items-start gap-2" style={{
                  background: changeEmailMsg.type === 'ok' ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
                  border: `1px solid ${changeEmailMsg.type === 'ok' ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`,
                  color: changeEmailMsg.type === 'ok' ? '#4ade80' : '#f87171',
                }}>
                  <i className={changeEmailMsg.type === 'ok' ? 'ri-checkbox-circle-line mt-0.5' : 'ri-error-warning-line mt-0.5'} />
                  {changeEmailMsg.text}
                </div>
              )}
            </div>

            <div className="rounded-xl px-5 py-3" style={{ background: 'rgba(10,20,45,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 py-2 mb-1">Notifications</p>
              {([
                { icon: 'ri-notification-line', label: 'Battle Alerts',     desc: 'Get alerted when under attack' },
                { icon: 'ri-mail-line',         label: 'Alliance Messages', desc: 'Receive alliance broadcasts' },
                { icon: 'ri-calendar-line',     label: 'Event Reminders',   desc: 'Tournament and event alerts' },
              ] as { icon: string; label: string; desc: string }[]).map((s, idx) => (
                <div key={s.label} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                  <div className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: 'rgba(0,212,255,0.08)' }}>
                    <i className={`${s.icon} text-cyan-400 text-sm`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{s.label}</p>
                    <p className="text-xs text-gray-400">{s.desc}</p>
                  </div>
                  <Toggle on={notifs[idx]} onChange={() => setNotifs(prev => prev.map((v, i) => i === idx ? !v : v))} />
                </div>
              ))}
            </div>

            {/* Logout */}
            <div className="rounded-xl p-5" style={{ background: 'rgba(248,113,113,0.04)', border: '1px solid rgba(248,113,113,0.15)' }}>
              <h4 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                <i className="ri-logout-box-r-line" />End Session
              </h4>
              <p className="text-xs text-gray-400 mb-4">Sign out of your command terminal. You will be redirected to the login screen.</p>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-2.5 rounded-lg border cursor-pointer whitespace-nowrap transition-all hover:bg-red-500/10"
                style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171' }}
              >
                <i className="ri-logout-box-r-line mr-1.5" />Log Out
              </button>
            </div>

            {/* Danger zone */}
            <div className="rounded-xl p-5" style={{ background: 'rgba(248,113,113,0.04)', border: '1px solid rgba(248,113,113,0.15)' }}>
              <h4 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                <i className="ri-error-warning-line" />Danger Zone
              </h4>
              <p className="text-xs text-gray-400 mb-4">Irreversible account actions. Proceed with caution.</p>
              <button className="text-sm px-4 py-2 rounded-lg border cursor-pointer whitespace-nowrap" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171' }}>
                <i className="ri-delete-bin-line mr-1.5" />Delete Account
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}