import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RACES, getRaceById, type RaceDefinition, type RaceId } from '@/data/playerRaces';
import { useAuth } from '@/contexts/AuthContext';

const RACE_CHANGE_COST_DARK_MATTER = 500;
const RACE_CHANGE_COOLDOWN_SECONDS = 7 * 24 * 60 * 60; // 7 days

interface RaceChangeModalProps {
  onClose: () => void;
}

export default function RaceChangeModal({ onClose }: RaceChangeModalProps) {
  const { profile, user, refreshProfile } = useAuth();
  const [step, setStep] = useState<'select' | 'confirm' | 'processing' | 'done'>('select');
  const [selectedRace, setSelectedRace] = useState<RaceDefinition>(getRaceById((profile?.race as RaceId) || 'terran'));
  const [darkMatter, setDarkMatter] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<string>('');

  const currentRace = profile?.race ? getRaceById(profile.race as RaceId) : RACES[0];
  const lastChange = profile?.last_race_change ? new Date(profile.last_race_change) : null;
  const cooldownEnd = lastChange ? new Date(lastChange.getTime() + RACE_CHANGE_COOLDOWN_SECONDS * 1000) : null;
  const isOnCooldown = cooldownEnd ? new Date() < cooldownEnd : false;

  // Fetch dark matter balance
  useEffect(() => {
    async function fetchDM() {
      if (!user?.id) return;
      const { data } = await supabase
        .from('player_resources')
        .select('dark_matter')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) setDarkMatter(Number(data.dark_matter) || 0);
    }
    fetchDM();
  }, [user?.id]);

  // Countdown timer for cooldown
  useEffect(() => {
    if (!isOnCooldown || !cooldownEnd) {
      setCountdown('');
      return;
    }
    function tick() {
      const remaining = cooldownEnd!.getTime() - Date.now();
      if (remaining <= 0) {
        setCountdown('');
        return;
      }
      const d = Math.floor(remaining / 86400000);
      const h = Math.floor((remaining % 86400000) / 3600000);
      const m = Math.floor((remaining % 3600000) / 60000);
      setCountdown(`${d}d ${h}h ${m}m`);
    }
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, [isOnCooldown, cooldownEnd]);

  const canAfford = darkMatter >= RACE_CHANGE_COST_DARK_MATTER;
  const isSameRace = selectedRace.id === (profile?.race || '');

  const handleChange = async () => {
    if (!user?.id || !profile) return;
    setError(null);
    setStep('processing');

    try {
      // Deduct dark matter
      const { error: resourceError } = await supabase
        .from('player_resources')
        .update({ dark_matter: darkMatter - RACE_CHANGE_COST_DARK_MATTER })
        .eq('user_id', user.id);

      if (resourceError) {
        setError('Failed to deduct dark matter. Please try again.');
        setStep('confirm');
        return;
      }

      // Update race and cooldown
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          race: selectedRace.id,
          last_race_change: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) {
        setError('Failed to update race. Please try again.');
        setStep('confirm');
        return;
      }

      await refreshProfile();
      setStep('done');
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setStep('confirm');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-[#0D0D1A] border border-white/[0.08] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0D0D1A] border-b border-white/[0.06] p-6 z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-heading text-[#E8E0D5]">
              {step === 'done' ? 'Race Change Complete' : 'Gene Resequencing'}
            </h2>
            <p className="text-xs text-[#E8E0D5]/40 mt-1">
              {step === 'done'
                ? 'Your empire has been reborn'
                : step === 'select'
                  ? 'Select your new species — this is a permanent transformation'
                  : 'Confirm your genetic resequencing'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-[#E8E0D5]/40 hover:text-[#E8E0D5] hover:bg-white/[0.1] transition-colors"
          >
            <i className="ri-close-line" />
          </button>
        </div>

        {/* Done state */}
        {step === 'done' && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-400/15 flex items-center justify-center">
              <i className="ri-check-fill text-4xl text-emerald-400 w-12 h-12 flex items-center justify-center" />
            </div>
            <h3 className="text-xl font-heading text-[#E8E0D5] mb-2">
              You are now {selectedRace.name}
            </h3>
            <p className="text-sm text-[#E8E0D5]/50 mb-6 max-w-md mx-auto">
              {selectedRace.lore}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all whitespace-nowrap cursor-pointer text-sm font-semibold"
            >
              Return to Empire
            </button>
          </div>
        )}

        {/* Processing state */}
        {step === 'processing' && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-400/15 flex items-center justify-center animate-spin">
              <i className="ri-loader-4-line text-3xl text-amber-400 w-10 h-10 flex items-center justify-center" />
            </div>
            <h3 className="text-lg font-heading text-[#E8E0D5] mb-2">Resequencing in progress...</h3>
            <p className="text-sm text-[#E8E0D5]/40">Rewriting genetic code and applying empire modifiers</p>
          </div>
        )}

        {/* Select / Confirm steps */}
        {(step === 'select' || step === 'confirm') && (
          <>
            {/* Current Race Banner */}
            <div className="px-6 pt-6">
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${currentRace.color} rounded-xl flex items-center justify-center`}>
                  <i className={`${currentRace.icon} text-lg text-white`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-heading text-[#E8E0D5]">{currentRace.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-[#E8E0D5]/40">{currentRace.category}</span>
                  </div>
                  <p className="text-xs text-[#E8E0D5]/40 mt-0.5">Your current species</p>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full bg-white/[0.05] text-[#E8E0D5]/30 font-mono">CURRENT</span>
              </div>
            </div>

            {/* Cooldown Warning */}
            {isOnCooldown && countdown && (
              <div className="mx-6 mt-4 bg-red-500/5 border border-red-500/15 rounded-lg p-3 flex items-center gap-3">
                <i className="ri-timer-line text-red-400 w-5 h-5 flex items-center justify-center" />
                <div>
                  <p className="text-xs text-red-400 font-semibold">Gene Resequencing on Cooldown</p>
                  <p className="text-[10px] text-red-400/60">
                    You recently changed races. Next resequencing available in {countdown}.
                  </p>
                </div>
              </div>
            )}

            {/* Cost info */}
            <div className="mx-6 mt-4 bg-gradient-to-r from-purple-500/5 to-fuchsia-500/5 border border-purple-500/15 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className="ri-moon-line text-purple-400 w-5 h-5 flex items-center justify-center" />
                  <span className="text-xs text-[#E8E0D5]/60">Resequencing Cost</span>
                </div>
                <span className={`text-sm font-bold font-mono ${canAfford ? 'text-purple-400' : 'text-red-400'}`}>
                  {RACE_CHANGE_COST_DARK_MATTER} Dark Matter
                </span>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-[#E8E0D5]/30">Your balance</span>
                <span className={`text-xs font-mono ${canAfford ? 'text-[#E8E0D5]/50' : 'text-red-400/70'}`}>
                  {darkMatter.toLocaleString()} DM
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mx-6 mt-4 bg-red-500/5 border border-red-500/15 rounded-lg p-3">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            {/* Race Selection Grid */}
            <div className="p-6">
              <h3 className="text-xs uppercase tracking-widest text-[#E8E0D5]/30 font-bold mb-4">
                {step === 'confirm' ? 'Confirm New Species' : 'Choose Your New Species'}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {RACES.map((race) => {
                  const isSelected = selectedRace.id === race.id;
                  const isCurrent = race.id === (profile?.race || '');
                  const borderClass = isSelected
                    ? 'border-purple-400/50 bg-purple-400/[0.06]'
                    : isCurrent
                      ? 'border-white/[0.06] bg-white/[0.03] opacity-60'
                      : 'border-white/[0.06] bg-white/[0.01] hover:border-white/[0.12] hover:bg-white/[0.03]';

                  return (
                    <button
                      key={race.id}
                      onClick={() => {
                        if (step === 'confirm') return;
                        if (isCurrent) return;
                        if (isOnCooldown) return;
                        setSelectedRace(race);
                      }}
                      disabled={isCurrent || step === 'confirm' || isOnCooldown}
                      className={`text-left rounded-xl p-3 transition-all cursor-pointer border ${borderClass} ${
                        isCurrent || step === 'confirm' || isOnCooldown ? 'cursor-default' : 'cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className={`w-8 h-8 bg-gradient-to-br ${race.color} rounded-lg flex items-center justify-center shrink-0`}>
                          <i className={`${race.icon} text-sm text-white`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-heading text-[#E8E0D5] truncate">{race.name}</p>
                          <p className="text-[10px] text-[#E8E0D5]/30">{race.category}</p>
                        </div>
                        {isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06] text-[#E8E0D5]/30 ml-auto shrink-0">YOU</span>
                        )}
                        {isSelected && !isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-400/15 text-purple-400 ml-auto shrink-0">PICKED</span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#E8E0D5]/40 leading-relaxed line-clamp-2">{race.bonusDetails}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-[#0D0D1A] border-t border-white/[0.06] p-4 flex items-center justify-between">
              {step === 'select' ? (
                <>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 text-[#E8E0D5]/40 hover:text-[#E8E0D5] transition-colors whitespace-nowrap text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (isSameRace) return;
                      if (!canAfford) return;
                      if (isOnCooldown) return;
                      setStep('confirm');
                    }}
                    disabled={isSameRace || !canAfford || isOnCooldown}
                    className={`px-6 py-2.5 rounded-lg font-semibold whitespace-nowrap transition-all text-sm ${
                      isSameRace
                        ? 'bg-white/[0.04] text-[#E8E0D5]/20 cursor-default'
                        : !canAfford
                          ? 'bg-white/[0.04] text-red-400/50 cursor-default'
                          : isOnCooldown
                            ? 'bg-white/[0.04] text-[#E8E0D5]/20 cursor-default'
                            : 'bg-purple-500/20 border border-purple-400/40 text-purple-400 hover:bg-purple-500/30 cursor-pointer'
                    }`}
                  >
                    {isSameRace
                      ? 'Already Selected'
                      : !canAfford
                        ? 'Insufficient Dark Matter'
                        : isOnCooldown
                          ? 'On Cooldown'
                          : `Resequence to ${selectedRace.name}`}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setStep('select')}
                    className="px-5 py-2.5 text-[#E8E0D5]/40 hover:text-[#E8E0D5] transition-colors whitespace-nowrap text-sm"
                  >
                    Back
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[10px] text-[#E8E0D5]/30">Cost</p>
                      <p className="text-xs text-purple-400 font-mono font-bold">{RACE_CHANGE_COST_DARK_MATTER} DM</p>
                    </div>
                    <button
                      onClick={handleChange}
                      className="px-6 py-2.5 bg-purple-500 hover:bg-purple-400 text-white rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer text-sm"
                    >
                      Confirm Resequencing
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}