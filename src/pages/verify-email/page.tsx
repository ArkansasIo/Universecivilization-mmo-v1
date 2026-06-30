import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

function cleanEnv(value: string | undefined): string {
  if (!value) return '';
  return value.trim().replace(/^["']|["']$/g, '');
}

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');
  const [email, setEmail] = useState('');
  const [emailLocked, setEmailLocked] = useState(false);

  // Pull email from query param or sessionStorage on mount
  useEffect(() => {
    const qEmail = searchParams.get('email');
    if (qEmail) {
      setEmail(qEmail);
      setEmailLocked(true);
    } else {
      const stored = sessionStorage.getItem('pendingVerifyEmail');
      if (stored) {
        setEmail(stored);
        setEmailLocked(true);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = async () => {
    const targetEmail = email.trim();
    if (!targetEmail) {
      setResendError('Please enter your email address.');
      return;
    }
    setResendLoading(true);
    setResendSuccess(false);
    setResendError('');

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
          body: JSON.stringify({ email: targetEmail, redirectTo }),
        }
      );

      const result = await response.json().catch(() => ({ success: false, error: 'Network error' }));

      if (!response.ok || !result.success) {
        setResendError(result.error || 'Failed to resend verification email.');
      } else {
        setResendSuccess(true);
        setCountdown(60);
      }
    } catch (err: any) {
      setResendError(err.message || 'Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080F] relative overflow-hidden flex items-center justify-center">
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-[#D4A017] rounded-full opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `drift ${5 + Math.random() * 6}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-12 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-[#D4A017] to-[#B8860B] rounded-2xl flex items-center justify-center shadow-lg shadow-[#D4A017]/20 mx-auto mb-6">
          <i className="ri-mail-check-line text-4xl text-[#08080F]"></i>
        </div>

        <h1 className="text-3xl font-bold text-[#E8E0D5] mb-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          Verify Your Comms Frequency
        </h1>
        <p className="text-[#908070] mb-8 leading-relaxed">
          A verification transmission has been dispatched to your email address.
          Please open the encrypted message and activate your command codes to complete registration.
        </p>

        {/* Status card */}
        <div className="bg-gradient-to-b from-[#111108] to-[#0D0C07] rounded-2xl border border-[#B8860B]/20 shadow-2xl shadow-black/60 p-6 mb-6 text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-amber-400 font-medium">Awaiting Confirmation</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <i className="ri-mail-line text-[#D4A017] mt-0.5"></i>
              <div>
                <p className="text-sm text-[#E8E0D5]">Check your inbox</p>
                <p className="text-xs text-[#605040]">Look for &ldquo;Universe Civilization &mdash; Verify Email&rdquo;</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="ri-shield-check-line text-[#D4A017] mt-0.5"></i>
              <div>
                <p className="text-sm text-[#E8E0D5]">Click the activation link</p>
                <p className="text-xs text-[#605040]">This confirms your comms frequency is valid</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="ri-rocket-2-line text-[#D4A017] mt-0.5"></i>
              <div>
                <p className="text-sm text-[#E8E0D5]">Launch your empire</p>
                <p className="text-xs text-[#605040]">You will be signed in automatically</p>
              </div>
            </div>
          </div>
        </div>

        {/* Email input if not locked from query param */}
        {!emailLocked && (
          <div className="mb-4 text-left">
            <label className="block text-sm text-[#A09080] mb-1.5">Comms Frequency (Email)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-mail-line text-[#605040]"></i>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="commander@empire.local"
                className="w-full pl-10 pr-4 py-3 bg-[#0D0C07] border border-[#B8860B]/20 rounded-lg text-[#E8E0D5] placeholder-[#605040] focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]/30 transition-all text-sm"
              />
            </div>
          </div>
        )}

        {emailLocked && (
          <div className="mb-4 p-3 bg-[#B8860B]/5 border border-[#B8860B]/20 rounded-lg">
            <p className="text-sm text-[#A09080] flex items-center justify-center gap-2">
              <i className="ri-mail-line text-[#D4A017]"></i>
              {email}
            </p>
          </div>
        )}

        {/* Success / Error messages */}
        {resendSuccess && (
          <div className="mb-4 p-3 bg-green-500/5 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm flex items-center justify-center gap-2">
              <i className="ri-check-line"></i>
              Verification transmission resent! Check your inbox.
            </p>
          </div>
        )}

        {resendError && (
          <div className="mb-4 p-3 bg-red-500/5 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm flex items-center justify-center gap-2">
              <i className="ri-error-warning-line"></i>
              {resendError}
            </p>
          </div>
        )}

        <button
          onClick={handleResend}
          disabled={countdown > 0 || resendLoading}
          className="w-full py-3 px-4 bg-[#111108] border border-[#B8860B]/20 rounded-lg text-[#E8E0D5] font-medium hover:border-[#D4A017]/40 hover:bg-[#1a180f] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer mb-4"
        >
          {resendLoading ? (
            <>
              <i className="ri-loader-4-line animate-spin"></i>
              Transmitting...
            </>
          ) : countdown > 0 ? (
            <>
              <i className="ri-time-line"></i>
              Resend in {countdown}s
            </>
          ) : (
            <>
              <i className="ri-refresh-line"></i>
              Resend Verification Transmission
            </>
          )}
        </button>

        <Link
          to="/login"
          className="text-[#908070] hover:text-[#D4A017] text-sm transition-colors inline-flex items-center gap-2"
        >
          <i className="ri-arrow-left-line"></i>
          Return to Command Access
        </Link>
      </div>

      <style>{`
        @keyframes drift {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          20% { opacity: 0.3; }
          80% { opacity: 0.3; }
          100% { transform: translateY(-30px) translateX(15px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}