import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { RACES, type RaceId } from '@/data/playerRaces';
import { storePendingRegistration } from '../../utils/registrationSetup';

interface WizardData {
  // Step 1: Account
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  // Step 2: Empire Identity
  empireName: string;
  commanderName: string;
  homeworld: string;
  // Step 3: Race Selection
  race: RaceId;
  // Step 4: Starting Bonus
  startingBonus: 'resources' | 'military' | 'research' | 'economy';
}

const INITIAL_DATA: WizardData = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  empireName: '',
  commanderName: '',
  homeworld: '',
  race: 'terran',
  startingBonus: 'resources',
};

const STARTING_BONUSES = [
  {
    id: 'resources' as const,
    name: 'Resource Cache',
    description: 'Start with extra raw materials',
    bonus: '+1,000 Metal, +750 Crystal, +500 Deuterium',
    icon: 'ri-database-2-line',
  },
  {
    id: 'military' as const,
    name: 'Military Fleet',
    description: 'Begin with a small defensive fleet',
    bonus: '5 Light Fighters, 2 Heavy Fighters, 1 Cruiser',
    icon: 'ri-rocket-line',
  },
  {
    id: 'research' as const,
    name: 'Research Head Start',
    description: 'Advanced technology from day one',
    bonus: 'Energy Tech Lv2, Computer Tech Lv2, Weapons Tech Lv1',
    icon: 'ri-flask-line',
  },
  {
    id: 'economy' as const,
    name: 'Economic Boost',
    description: 'Enhanced production facilities',
    bonus: 'Metal Mine Lv3, Crystal Mine Lv2, Solar Plant Lv3',
    icon: 'ri-line-chart-line',
  },
];

/* ── Animated star background ───────────────────────── */
function StarField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            opacity: Math.random() * 0.6 + 0.2,
          }}
        />
      ))}
    </div>
  );
}

/* ── Step indicator ─────────────────────────────────── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  const labels = ['Account', 'Identity', 'Race', 'Bonus', 'Launch'];
  return (
    <div className="mb-10">
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: total }, (_, i) => {
          const step = i + 1;
          const done = current > step;
          const active = current === step;
          return (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  done
                    ? 'bg-amber-400 text-black'
                    : active
                      ? 'bg-gradient-to-r from-amber-400 to-[#B8860B] text-white shadow-lg shadow-amber-400/40 scale-110'
                      : 'bg-[#111108] text-[#605040] border border-[#B8860B]/20'
                }`}
              >
                {done ? <i className="ri-check-line text-lg" /> : step}
              </div>
              {step < total && (
                <div
                  className={`w-10 sm:w-16 h-0.5 mx-2 transition-all duration-500 ${
                    done ? 'bg-gradient-to-r from-amber-400 to-[#B8860B]' : 'bg-[#111108]'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-3 px-1 max-w-md mx-auto">
        {labels.map((label, i) => (
          <span
            key={label}
            className={`text-xs font-medium transition-colors ${
              current >= i + 1 ? 'text-amber-400' : 'text-[#605040]'
            }`}
            style={{ width: `${100 / total}%`, textAlign: 'center' }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
/*  MAIN REGISTER WIZARD                                 */
/* ══════════════════════════════════════════════════════ */
export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>();

  /* ── Validation helpers ───────────────────────────── */
  function validateStep1(): boolean {
    const errs: Record<string, string> = {};
    if (data.username.trim().length < 3) errs.username = 'Commander name must be at least 3 characters';
    if (!data.email.trim() || !data.email.includes('@')) errs.email = 'Enter a valid email address';
    if (data.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (data.password !== data.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!data.acceptTerms) errs.acceptTerms = 'You must accept the Terms of Service';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep2(): boolean {
    const errs: Record<string, string> = {};
    if (data.empireName.trim().length < 2) errs.empireName = 'Empire name must be at least 2 characters';
    if (data.commanderName.trim().length < 2) errs.commanderName = 'Commander name must be at least 2 characters';
    if (data.homeworld.trim().length < 2) errs.homeworld = 'Homeworld name must be at least 2 characters';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  /* ── Update helper ──────────────────────────────────── */
  function update<K extends keyof WizardData>(key: K, value: WizardData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  /* ── Final submission ─────────────────────────────── */
  async function handleLaunch() {
    setError('');
    setLoading(true);

    try {
      // Use Supabase native signUp so email verification is respected
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { username: data.username },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) throw signUpError;

      // Store wizard data for the callback page to finish setup after verification
      storePendingRegistration(data);

      if (signUpData.session) {
        // Project is configured to auto-confirm (no email verification needed)
        navigate('/auth/callback');
      } else {
        // Email confirmation required — store email for verify page and show check-your-inbox page
        sessionStorage.setItem('pendingVerifyEmail', data.email);
        navigate('/verify-email');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  /* ── Next / Back helpers ────────────────────────────── */
  function nextStep() {
    setError('');
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step < 5) setStep((s) => s + 1);
  }

  function prevStep() {
    setError('');
    setFieldErrors({});
    if (step > 1) setStep((s) => s - 1);
  }

  /* ════════════════════════════════════════════════════ */
  /*  STEP 1 — ACCOUNT CREDENTIALS                      */
  /* ════════════════════════════════════════════════════ */
  function Step1() {
    return (
      <div className="space-y-5">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-white mb-1">Create Your Account</h2>
          <p className="text-[#908070] text-sm">Your identity across the galaxy</p>
        </div>

        {/* Commander Name */}
        <div>
          <label className="block text-sm font-medium text-[#A09080] mb-1.5">Commander Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-user-line text-[#908070]" />
            </div>
            <input
              type="text"
              value={data.username}
              onChange={(e) => update('username', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 bg-[#111108] border rounded-lg text-white placeholder-[#605040] focus:outline-none focus:ring-2 focus:ring-[#D4A017] transition-all ${
                fieldErrors.username ? 'border-red-500/60' : 'border-[#B8860B]/20'
              }`}
              placeholder="Admiral Nexus"
              required
            />
          </div>
          {fieldErrors.username && <p className="text-xs text-red-400 mt-1">{fieldErrors.username}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-[#A09080] mb-1.5">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-mail-line text-[#908070]" />
            </div>
            <input
              type="email"
              value={data.email}
              onChange={(e) => update('email', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 bg-[#111108] border rounded-lg text-white placeholder-[#605040] focus:outline-none focus:ring-2 focus:ring-[#D4A017] transition-all ${
                fieldErrors.email ? 'border-red-500/60' : 'border-[#B8860B]/20'
              }`}
              placeholder="commander@galaxy.com"
              required
            />
          </div>
          {fieldErrors.email && <p className="text-xs text-red-400 mt-1">{fieldErrors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-[#A09080] mb-1.5">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-lock-line text-[#908070]" />
            </div>
            <input
              type="password"
              value={data.password}
              onChange={(e) => update('password', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 bg-[#111108] border rounded-lg text-white placeholder-[#605040] focus:outline-none focus:ring-2 focus:ring-[#D4A017] transition-all ${
                fieldErrors.password ? 'border-red-500/60' : 'border-[#B8860B]/20'
              }`}
              placeholder="••••••••"
              required
            />
          </div>
          {fieldErrors.password && <p className="text-xs text-red-400 mt-1">{fieldErrors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-[#A09080] mb-1.5">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-lock-password-line text-[#908070]" />
            </div>
            <input
              type="password"
              value={data.confirmPassword}
              onChange={(e) => update('confirmPassword', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 bg-[#111108] border rounded-lg text-white placeholder-[#605040] focus:outline-none focus:ring-2 focus:ring-[#D4A017] transition-all ${
                fieldErrors.confirmPassword ? 'border-red-500/60' : 'border-[#B8860B]/20'
              }`}
              placeholder="••••••••"
              required
            />
          </div>
          {fieldErrors.confirmPassword && (
            <p className="text-xs text-red-400 mt-1">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3 pt-1">
          <input
            type="checkbox"
            checked={data.acceptTerms}
            onChange={(e) => update('acceptTerms', e.target.checked)}
            className={`mt-1 w-4 h-4 bg-[#111108] border rounded text-amber-500 focus:ring-[#D4A017] focus:ring-offset-[#08080F] cursor-pointer ${
              fieldErrors.acceptTerms ? 'border-red-500' : 'border-[#B8860B]/20'
            }`}
          />
          <label className="text-sm text-[#908070] leading-relaxed">
            I agree to the{' '}
            <Link to="/terms" className="text-amber-400 hover:text-amber-300 transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-amber-400 hover:text-amber-300 transition-colors">
              Privacy Policy
            </Link>
          </label>
        </div>
        {fieldErrors.acceptTerms && <p className="text-xs text-red-400 -mt-3">{fieldErrors.acceptTerms}</p>}
      </div>
    );
  }

  /* ════════════════════════════════════════════════════ */
  /*  STEP 2 — EMPIRE IDENTITY                          */
  /* ════════════════════════════════════════════════════ */
  function Step2() {
    return (
      <div className="space-y-5">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-white mb-1">Empire Identity</h2>
          <p className="text-[#908070] text-sm">Name your empire and homeworld</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#A09080] mb-1.5">Empire Name</label>
          <input
            type="text"
            value={data.empireName}
            onChange={(e) => update('empireName', e.target.value)}
            className={`w-full px-4 py-3 bg-[#111108] border rounded-lg text-white placeholder-[#605040] focus:outline-none focus:ring-2 focus:ring-[#D4A017] transition-all ${
              fieldErrors.empireName ? 'border-red-500/60' : 'border-[#B8860B]/20'
            }`}
            placeholder="The Eternal Empire"
            maxLength={30}
          />
          <p className="text-xs text-[#605040] mt-1 text-right">{data.empireName.length}/30</p>
          {fieldErrors.empireName && <p className="text-xs text-red-400 -mt-1">{fieldErrors.empireName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#A09080] mb-1.5">Commander Title</label>
          <input
            type="text"
            value={data.commanderName}
            onChange={(e) => update('commanderName', e.target.value)}
            className={`w-full px-4 py-3 bg-[#111108] border rounded-lg text-white placeholder-[#605040] focus:outline-none focus:ring-2 focus:ring-[#D4A017] transition-all ${
              fieldErrors.commanderName ? 'border-red-500/60' : 'border-[#B8860B]/20'
            }`}
            placeholder="Grand Admiral"
            maxLength={20}
          />
          <p className="text-xs text-[#605040] mt-1 text-right">{data.commanderName.length}/20</p>
          {fieldErrors.commanderName && <p className="text-xs text-red-400 -mt-1">{fieldErrors.commanderName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#A09080] mb-1.5">Homeworld Name</label>
          <input
            type="text"
            value={data.homeworld}
            onChange={(e) => update('homeworld', e.target.value)}
            className={`w-full px-4 py-3 bg-[#111108] border rounded-lg text-white placeholder-[#605040] focus:outline-none focus:ring-2 focus:ring-[#D4A017] transition-all ${
              fieldErrors.homeworld ? 'border-red-500/60' : 'border-[#B8860B]/20'
            }`}
            placeholder="Terra Prime"
            maxLength={20}
          />
          <p className="text-xs text-[#605040] mt-1 text-right">{data.homeworld.length}/20</p>
          {fieldErrors.homeworld && <p className="text-xs text-red-400 -mt-1">{fieldErrors.homeworld}</p>}
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════ */
  /*  STEP 3 — CHOOSE YOUR RACE                          */
  /* ════════════════════════════════════════════════════ */
  function Step3() {
    return (
      <div className="space-y-4">
        <div className="text-center mb-1">
          <h2 className="text-2xl font-bold text-white mb-1">Choose Your Race</h2>
          <p className="text-[#908070] text-sm">Your species shapes your destiny across the galaxy</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {RACES.map((r) => {
            const selected = data.race === r.id;
            return (
              <button
                key={r.id}
                onClick={() => update('race', r.id)}
                className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group ${
                  selected
                    ? `${r.borderAccent} bg-[#111108]/80 shadow-lg`
                    : 'border-[#B8860B]/20 bg-[#111108]/60 hover:border-[#B8860B]/20 hover:bg-[#111108]'
                }`}
              >
                {selected && (
                  <div className={`absolute top-2 right-2 w-5 h-5 bg-gradient-to-br ${r.color} rounded-full flex items-center justify-center`}>
                    <i className="ri-check-line text-white text-xs" />
                  </div>
                )}

                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-9 h-9 bg-gradient-to-br ${r.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <i className={`${r.icon} text-base text-white`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{r.name}</h3>
                    <span className="text-[10px] text-[#605040] uppercase tracking-wider">{r.category}</span>
                  </div>
                </div>

                <p className="text-xs text-[#908070] leading-relaxed mb-2 line-clamp-2">{r.description}</p>

                <div className={`${r.bgAccent} rounded-lg px-2.5 py-2`}>
                  <p className={`text-[11px] text-${r.accent}-400 font-semibold`}>{r.bonus}</p>
                  <p className={`text-[10px] text-[#A09080] mt-0.5 leading-tight`}>{r.bonusDetails}</p>
                </div>

                {/* Lore tooltip on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#0D0C07] border border-[#B8860B]/20 rounded-lg shadow-2xl z-50">
                    <p className="text-[11px] text-[#A09080] leading-relaxed">{r.lore}</p>
                    <p className="text-[10px] text-[#605040] mt-1.5">Homeworld: {r.homeworldType}</p>
                    <p className="text-[10px] text-amber-400 mt-0.5">{r.specialStartingTrait}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════ */
  /*  STEP 4 — STARTING BONUS                             */
  /* ════════════════════════════════════════════════════ */
  function Step4() {
    return (
      <div className="space-y-5">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-white mb-1">Starting Bonus</h2>
          <p className="text-[#908070] text-sm">Choose your initial advantage</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STARTING_BONUSES.map((b) => {
            const selected = data.startingBonus === b.id;
            return (
              <button
                key={b.id}
                onClick={() => update('startingBonus', b.id)}
                className={`relative text-left p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  selected
                    ? 'border-amber-400 bg-[#111108]/80 shadow-lg shadow-amber-400/20'
                    : 'border-[#B8860B]/20 bg-[#111108]/60 hover:border-[#B8860B]/20 hover:bg-[#111108]'
                }`}
              >
                {selected && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                    <i className="ri-check-line text-black text-sm" />
                  </div>
                )}

                <div className="w-11 h-11 bg-amber-400/15 rounded-xl flex items-center justify-center mb-3">
                  <i className={`${b.icon} text-xl text-amber-400`} />
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{b.name}</h3>
                <p className="text-sm text-[#908070] mb-3">{b.description}</p>

                <div className="bg-[#0D0C07]/50 rounded-lg px-3 py-2">
                  <p className="text-xs text-amber-400 font-semibold">You Receive:</p>
                  <p className="text-xs text-[#A09080] mt-0.5">{b.bonus}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════ */
  /*  STEP 5 — REVIEW & LAUNCH                            */
  /* ════════════════════════════════════════════════════ */
  function Step5() {
    const selectedRace = RACES.find((r) => r.id === data.race)!;
    const selectedBonus = STARTING_BONUSES.find((b) => b.id === data.startingBonus);

    return (
      <div className="space-y-5">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-white mb-1">Launch Your Empire</h2>
          <p className="text-[#908070] text-sm">Review your choices before takeoff</p>
        </div>

        <div className="bg-[#111108]/50 backdrop-blur-sm border border-[#B8860B]/20 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#605040] uppercase tracking-wider mb-1">Commander</p>
              <p className="text-lg font-semibold text-white">{data.username}</p>
            </div>
            <div>
              <p className="text-xs text-[#605040] uppercase tracking-wider mb-1">Email</p>
              <p className="text-lg font-semibold text-white truncate">{data.email}</p>
            </div>
            <div>
              <p className="text-xs text-[#605040] uppercase tracking-wider mb-1">Empire</p>
              <p className="text-lg font-semibold text-white">{data.empireName}</p>
            </div>
            <div>
              <p className="text-xs text-[#605040] uppercase tracking-wider mb-1">Homeworld</p>
              <p className="text-lg font-semibold text-white">{data.homeworld}</p>
            </div>
          </div>

          {/* Race */}
          <div className="border-t border-[#B8860B]/20 pt-4">
            <p className="text-xs text-[#605040] uppercase tracking-wider mb-2">Race</p>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${selectedRace.color} rounded-lg flex items-center justify-center`}>
                <i className={`${selectedRace.icon} text-lg text-white`} />
              </div>
              <div>
                <p className="text-white font-semibold">{selectedRace.name}</p>
                <p className="text-xs text-[#908070]">{selectedRace.category}</p>
                <p className="text-xs text-amber-400 mt-0.5">{selectedRace.specialStartingTrait}</p>
              </div>
            </div>
          </div>

          {/* Race Bonus */}
          <div className="border-t border-[#B8860B]/20 pt-4">
            <p className="text-xs text-[#605040] uppercase tracking-wider mb-2">Racial Bonus — {selectedRace.bonus}</p>
            <div className="bg-[#0D0C07]/50 rounded-lg px-3 py-2">
              <p className="text-xs text-amber-400">{selectedRace.bonusDetails}</p>
            </div>
          </div>

          {/* Starting Bonus */}
          <div className="border-t border-[#B8860B]/20 pt-4">
            <p className="text-xs text-[#605040] uppercase tracking-wider mb-2">Starting Bonus</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-400/15 rounded-lg flex items-center justify-center">
                <i className={`${selectedBonus?.icon} text-sm text-amber-400`} />
              </div>
              <div>
                <p className="text-white font-semibold">{selectedBonus?.name}</p>
                <p className="text-xs text-amber-400">{selectedBonus?.bonus}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLaunch}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-[#D4A017] to-[#B8860B] hover:from-[#E8B820] hover:to-[#C9A018] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#D4A017]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg whitespace-nowrap cursor-pointer"
        >
          {loading ? (
            <>
              <i className="ri-loader-4-line animate-spin text-xl" />
              Launching Empire...
            </>
          ) : (
            <>
              <i className="ri-rocket-2-line text-xl" />
              LAUNCH EMPIRE
            </>
          )}
        </button>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════ */
  /*  RENDER                                             */
  /* ════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#08080F] relative overflow-hidden flex items-center justify-center py-8 px-4">
      <StarField />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-[#B8860B] rounded-xl flex items-center justify-center shadow-lg shadow-amber-400/30">
              <i className="ri-rocket-2-fill text-xl text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              UNIVERSE-EMPIRE-DOMINIONS
            </h1>
          </div>
          <p className="text-[#908070] text-sm">Forge your legacy among the stars</p>
        </div>

        {/* Card */}
        <div className="bg-gradient-to-b from-[#111108] to-[#0D0C07] border border-[#B8860B]/20 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40">
          <StepIndicator current={step} total={5} />

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/40 rounded-lg flex items-start gap-3">
              <i className="ri-error-warning-fill text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}
          {step === 5 && <Step5 />}

          {/* Navigation */}
          {step < 5 && (
            <div className="flex gap-3 mt-8">
              {step > 1 ? (
                <button
                  onClick={prevStep}
                  disabled={loading}
                  className="flex-1 py-3 bg-[#111108] border border-[#B8860B]/20 text-white font-semibold rounded-xl hover:bg-[#1a180f]/60 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  <i className="ri-arrow-left-line" />
                  Back
                </button>
              ) : (
                <Link
                  to="/"
                  className="flex-1 py-3 bg-[#111108] border border-[#B8860B]/20 text-white font-semibold rounded-xl hover:bg-[#1a180f]/60 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <i className="ri-home-line" />
                  Home
                </Link>
              )}

              <button
                onClick={nextStep}
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-[#D4A017] to-[#B8860B] hover:from-[#E8B820] hover:to-[#C9A018] text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                Continue
                <i className="ri-arrow-right-line" />
              </button>
            </div>
          )}

          {/* Footer link */}
          {step === 1 && (
            <p className="text-center text-[#605040] text-sm mt-6">
              Already have an empire?{' '}
              <Link to="/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}