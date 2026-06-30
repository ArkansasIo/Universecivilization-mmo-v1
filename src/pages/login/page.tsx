import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

function cleanEnv(value: string | undefined): string {
  if (!value) return '';
  return value.trim().replace(/^["']|["']$/g, '');
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);
  // NEW: unconfirmed email resend states
  const [unconfirmedEmail, setUnconfirmedEmail] = useState('');
  const [resendVerifyLoading, setResendVerifyLoading] = useState(false);
  const [resendVerifySuccess, setResendVerifySuccess] = useState(false);
  const [resendVerifyError, setResendVerifyError] = useState('');

  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const demoTriggered = useRef(false);

  // If already logged in, redirect immediately
  useEffect(() => {
    if (user) {
      const redirect = searchParams.get('redirect');
      navigate(redirect ? decodeURIComponent(redirect) : '/dashboard', { replace: true });
    }
  }, [user, navigate, searchParams]);

  // Auto-trigger demo login if ?demo=true is in the URL
  useEffect(() => {
    const isDemo = searchParams.get('demo') === 'true';
    if (isDemo && !demoTriggered.current && !user) {
      demoTriggered.current = true;
      handleDemoLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUnconfirmedEmail('');
    setResendVerifySuccess(false);
    setResendVerifyError('');
    setLoading(true);

    try {
      await signIn(email, password, rememberMe);
      const redirect = searchParams.get('redirect');
      navigate(redirect ? decodeURIComponent(redirect) : '/dashboard');
    } catch (err: any) {
      const msg = err?.message || 'Failed to sign in';
      const code = err?.code || '';
      // Detect unconfirmed email
      if (
        code === 'email_not_confirmed' ||
        msg.toLowerCase().includes('email not confirmed') ||
        msg.toLowerCase().includes('not confirmed')
      ) {
        setUnconfirmedEmail(email);
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unconfirmedEmail) return;
    setResendVerifyLoading(true);
    setResendVerifySuccess(false);
    setResendVerifyError('');

    try {
      const supabaseUrl = cleanEnv(import.meta.env.VITE_PUBLIC_SUPABASE_URL).replace(/\/$/, '');
      const anonKey = cleanEnv(import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY);
      const redirectTo = `${window.location.origin}/login`;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/resend-verification-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': anonKey,
          },
          body: JSON.stringify({ email: unconfirmedEmail, redirectTo }),
        }
      );

      const result = await response.json().catch(() => ({ success: false, error: 'Network error' }));

      if (!response.ok || !result.success) {
        setResendVerifyError(result.error || 'Failed to resend verification email.');
      } else {
        setResendVerifySuccess(true);
      }
    } catch (err: any) {
      setResendVerifyError(err.message || 'Network error. Please try again.');
    } finally {
      setResendVerifyLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess(false);
    setResetLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setResetSuccess(true);
      setResetEmail('');
    } catch (err: any) {
      setResetError(err.message || 'Failed to send reset email');
    } finally {
      setResetLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setDemoLoading(true);

    const demoEmail = 'demo@universe-civ.local';
    const demoPassword = 'Demo123!';
    const demoUsername = 'DemoCommander';

    try {
      // Step 1: Try signing in with demo credentials first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (signInError) {
        // Step 2: Demo account doesn't exist or password mismatch
        const supabaseUrl = (import.meta.env.VITE_PUBLIC_SUPABASE_URL?.toString()?.trim()?.replace(/\/$/, '')?.replace(/^["']|["']$/g, '') || '').trim();
        const anonKey = (import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY?.toString()?.trim()?.replace(/^["']|["']$/g, '') || '').trim();

        const createResponse = await fetch(
          `${supabaseUrl}/functions/v1/create-user-account`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'apikey': anonKey },
            body: JSON.stringify({ email: demoEmail, password: demoPassword, username: demoUsername }),
          }
        );

        const createResult = await createResponse.json().catch(() => ({ success: false }));

        if (!createResult.success && createResponse.status === 409) {
          const demoResetResponse = await fetch(
            `${supabaseUrl}/functions/v1/create-demo-user`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'apikey': anonKey },
            }
          );

          const demoResetResult = await demoResetResponse.json().catch(() => ({ success: false }));

          if (!demoResetResult.success && demoResetResponse.status !== 200) {
            setError('Unable to initialize demo account. Please try again later.');
            setDemoLoading(false);
            return;
          }
        } else if (!createResult.success && createResponse.status !== 409) {
          setError(createResult.error || 'Failed to initialize demo account.');
          setDemoLoading(false);
          return;
        }

        // Step 3: Now sign in
        await signIn(demoEmail, demoPassword, true);
      }

      const redirect = searchParams.get('redirect');
      navigate(redirect ? decodeURIComponent(redirect) : '/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to launch demo. Please try again.');
    } finally {
      setDemoLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSocialLoading('google');

    try {
      const redirect = searchParams.get('redirect');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${redirect ? decodeURIComponent(redirect) : '/dashboard'}`,
        },
      });

      if (error) {
        setError('Google sign-in is not configured. Please use email/password or contact support.');
      } else if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again or use email/password.');
    } finally {
      setSocialLoading(null);
    }
  };

  const handleDiscordSignIn = async () => {
    setError('');
    setSocialLoading('discord');

    try {
      const redirect = searchParams.get('redirect');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}${redirect ? decodeURIComponent(redirect) : '/dashboard'}`,
        },
      });

      if (error) {
        setError('Discord sign-in is not configured. Please use email/password or contact support.');
      } else if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again or use email/password.');
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080F] relative overflow-hidden flex items-center justify-center">
      {/* Ambient gold particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-[#D4A017] rounded-full opacity-40"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animation: `drift ${4 + Math.random() * 6}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 30%, rgba(212,160,23,0.06) 0%, transparent 60%)',
      }} />

      <div className="relative z-10 w-full max-w-md px-6 py-12">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D4A017] to-[#B8860B] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4A017]/20">
              <i className="ri-vip-crown-line text-2xl text-[#08080F]"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#E8E0D5] tracking-tight" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                UNIVERSE CIVILIZATION
              </h1>
              <p className="text-[10px] text-[#A09080] tracking-[0.3em] uppercase">Empires at War</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#111108] to-[#0D0C07] rounded-2xl border border-[#B8860B]/20 shadow-2xl shadow-black/60 p-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#E8E0D5] mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              {showForgotPassword ? 'Reset Access Codes' : 'Command Access'}
            </h2>
            <p className="text-sm text-[#908070]">
              {showForgotPassword
                ? 'Enter your comms frequency to receive reset instructions'
                : 'Enter your credentials to access the command interface'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/5 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <i className="ri-error-warning-fill"></i>
                {error}
              </p>
            </div>
          )}

          {/* Unconfirmed Email Resend Card */}
          {unconfirmedEmail && (
            <div className="mb-6 p-4 bg-amber-500/5 border border-amber-500/30 rounded-lg">
              <p className="text-amber-400 text-sm mb-3 flex items-start gap-2">
                <i className="ri-mail-close-line mt-0.5 flex-shrink-0"></i>
                <span>Your comms frequency has not been verified. Please check your inbox, or resend the verification transmission.</span>
              </p>

              {resendVerifySuccess && (
                <p className="text-green-400 text-xs flex items-center gap-1.5 mb-3">
                  <i className="ri-check-line"></i>
                  Verification transmission resent successfully.
                </p>
              )}

              {resendVerifyError && (
                <p className="text-red-400 text-xs flex items-center gap-1.5 mb-3">
                  <i className="ri-error-warning-line"></i>
                  {resendVerifyError}
                </p>
              )}

              <button
                onClick={handleResendVerification}
                disabled={resendVerifyLoading || resendVerifySuccess}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-[#D4A017] to-[#B8860B] hover:from-[#E8B820] hover:to-[#C9A018] text-[#08080F] font-semibold rounded-lg shadow-lg shadow-[#D4A017]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer text-sm"
              >
                {resendVerifyLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i>
                    Transmitting...
                  </>
                ) : resendVerifySuccess ? (
                  <>
                    <i className="ri-check-line"></i>
                    Sent — Check Your Inbox
                  </>
                ) : (
                  <>
                    <i className="ri-refresh-line"></i>
                    Resend Verification Transmission
                  </>
                )}
              </button>

              <p className="text-[#605040] text-xs text-center mt-2">
                Sent to {unconfirmedEmail}
              </p>
            </div>
          )}

          {/* Forgot Password Form */}
          {showForgotPassword ? (
            <div className="space-y-6">
              {resetSuccess ? (
                <div className="p-4 bg-green-500/5 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 text-sm flex items-center gap-2">
                    <i className="ri-check-line"></i>
                    Transmission sent! Check your inbox.
                  </p>
                </div>
              ) : (
                <>
                  {resetError && (
                    <div className="p-4 bg-red-500/5 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-sm flex items-center gap-2">
                        <i className="ri-error-warning-fill"></i>
                        {resetError}
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleForgotPassword} className="space-y-6">
                    <div>
                      <label htmlFor="reset-email" className="block text-sm font-medium text-[#A09080] mb-2">
                        Comms Frequency (Email)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="ri-mail-line text-[#605040]"></i>
                        </div>
                        <input
                          id="reset-email"
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-[#0D0C07] border border-[#B8860B]/20 rounded-lg text-[#E8E0D5] placeholder-[#605040] focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]/30 transition-all text-sm"
                          placeholder="commander@empire.local"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#D4A017] to-[#B8860B] hover:from-[#E8B820] hover:to-[#C9A018] text-[#08080F] font-semibold rounded-lg shadow-lg shadow-[#D4A017]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                    >
                      {resetLoading ? (
                        <>
                          <i className="ri-loader-4-line animate-spin"></i>
                          Transmitting...
                        </>
                      ) : (
                        <>
                          <i className="ri-mail-send-line"></i>
                          Send Reset Transmission
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}

              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetSuccess(false);
                  setResetError('');
                  setResetEmail('');
                }}
                className="w-full py-3 px-4 bg-[#111108] border border-[#B8860B]/20 rounded-lg text-[#E8E0D5] font-medium hover:border-[#D4A017]/40 hover:bg-[#1a180f] transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-arrow-left-line"></i>
                Return to Command Access
              </button>
            </div>
          ) : (
            <>
              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#A09080] mb-2">
                    Comms Frequency (Email)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="ri-mail-line text-[#605040]"></i>
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[#0D0C07] border border-[#B8860B]/20 rounded-lg text-[#E8E0D5] placeholder-[#605040] focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]/30 transition-all text-sm"
                      placeholder="commander@empire.local"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#A09080] mb-2">
                    Access Code (Password)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="ri-shield-keyhole-line text-[#605040]"></i>
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[#0D0C07] border border-[#B8860B]/20 rounded-lg text-[#E8E0D5] placeholder-[#605040] focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]/30 transition-all text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#B8860B]/30 bg-[#0D0C07] text-[#D4A017] focus:ring-[#D4A017] focus:ring-offset-[#08080F] cursor-pointer"
                    />
                    <span className="text-sm text-[#908070]">Remember this terminal</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-[#D4A017] hover:text-[#E8B820] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Forgot access code?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#D4A017] to-[#B8860B] hover:from-[#E8B820] hover:to-[#C9A018] text-[#08080F] font-bold rounded-lg shadow-lg shadow-[#D4A017]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                  {loading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <i className="ri-login-box-line"></i>
                      Access Command Interface
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#B8860B]/20"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-[#0D0C07] text-[#605040]">or connect via</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={!!socialLoading}
                  className="py-3 px-4 bg-[#111108] border border-[#B8860B]/20 rounded-lg text-[#E8E0D5] text-sm font-medium hover:border-[#D4A017]/40 hover:bg-[#1a180f] transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  {socialLoading === 'google' ? (
                    <i className="ri-loader-4-line animate-spin"></i>
                  ) : (
                    <i className="ri-google-fill text-[#D4A017]"></i>
                  )}
                  Google
                </button>
                <button
                  onClick={handleDiscordSignIn}
                  disabled={!!socialLoading}
                  className="py-3 px-4 bg-[#111108] border border-[#B8860B]/20 rounded-lg text-[#E8E0D5] text-sm font-medium hover:border-[#D4A017]/40 hover:bg-[#1a180f] transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  {socialLoading === 'discord' ? (
                    <i className="ri-loader-4-line animate-spin"></i>
                  ) : (
                    <i className="ri-discord-fill text-[#D4A017]"></i>
                  )}
                  Discord
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-[#908070]">
                  New commander?{' '}
                  <Link to="/register" className="text-[#D4A017] hover:text-[#E8B820] font-semibold transition-colors">
                    Establish Empire
                  </Link>
                </p>
              </div>

              {/* Demo Access */}
              <div className="mt-6 pt-6 border-t border-[#B8860B]/20">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={demoLoading}
                  className="w-full py-3 px-4 bg-[#111108] border border-[#B8860B]/30 hover:border-[#D4A017] hover:bg-[#1a180f] text-[#D4A017] font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  {demoLoading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      Initializing Demo...
                    </>
                  ) : (
                    <>
                      <i className="ri-rocket-2-line"></i>
                      Launch Demo Account
                    </>
                  )}
                </button>
                <p className="text-[#605040] text-xs text-center mt-2">
                  Instantly explore the universe — no registration required
                </p>
              </div>
            </>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-[#A09080] hover:text-[#D4A017] text-sm transition-colors inline-flex items-center gap-2">
            <i className="ri-arrow-left-line"></i>
            Return to Imperial Court
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes drift {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          20% { opacity: 0.4; }
          80% { opacity: 0.4; }
          100% { transform: translateY(-30px) translateX(15px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}