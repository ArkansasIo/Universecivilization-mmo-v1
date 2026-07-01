import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // Supabase processes the recovery token from the URL hash automatically on init.
    // We just need to wait a moment and check if a session exists.
    const timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSessionReady(true);
      } else {
        setError('Invalid or expired reset link. Please request a new one.');
      }
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
      // Sign out so the user logs in fresh with the new password
      await supabase.auth.signOut();
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080F] relative overflow-hidden flex items-center justify-center">
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
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

      <div className="relative z-10 w-full max-w-md px-6 py-12">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D4A017] to-[#B8860B] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4A017]/20">
              <i className="ri-shield-keyhole-line text-2xl text-[#08080F]"></i>
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
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#E8E0D5] mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              {success ? 'Access Codes Updated' : 'Reset Access Codes'}
            </h2>
            <p className="text-sm text-[#908070]">
              {success
                ? 'Your credentials have been re-encrypted. You may now sign in.'
                : 'Enter a new secure access code for your command terminal.'}
            </p>
          </div>

          {error && !success && (
            <div className="mb-6 p-4 bg-red-500/5 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <i className="ri-error-warning-fill"></i>
                {error}
              </p>
            </div>
          )}

          {success ? (
            <div className="space-y-6">
              <div className="p-4 bg-green-500/5 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-sm flex items-center gap-2">
                  <i className="ri-check-line"></i>
                  Your access codes have been successfully reset.
                </p>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#D4A017] to-[#B8860B] hover:from-[#E8B820] hover:to-[#C9A018] text-[#08080F] font-bold rounded-lg shadow-lg shadow-[#D4A017]/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-login-box-line"></i>
                Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {!sessionReady && !error && (
                <div className="flex items-center justify-center gap-2 py-4">
                  <i className="ri-loader-4-line animate-spin text-[#D4A017]"></i>
                  <span className="text-sm text-[#908070]">Verifying reset token...</span>
                </div>
              )}

              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-[#A09080] mb-2">
                  New Access Code (Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="ri-lock-line text-[#605040]"></i>
                  </div>
                  <input
                    id="new-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={!sessionReady || loading}
                    className="w-full pl-10 pr-4 py-3 bg-[#0D0C07] border border-[#B8860B]/20 rounded-lg text-[#E8E0D5] placeholder-[#605040] focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]/30 transition-all text-sm disabled:opacity-50"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-[#A09080] mb-2">
                  Confirm Access Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="ri-lock-password-line text-[#605040]"></i>
                  </div>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={!sessionReady || loading}
                    className="w-full pl-10 pr-4 py-3 bg-[#0D0C07] border border-[#B8860B]/20 rounded-lg text-[#E8E0D5] placeholder-[#605040] focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]/30 transition-all text-sm disabled:opacity-50"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!sessionReady || loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#D4A017] to-[#B8860B] hover:from-[#E8B820] hover:to-[#C9A018] text-[#08080F] font-bold rounded-lg shadow-lg shadow-[#D4A017]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                {loading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="ri-shield-check-line"></i>
                    Confirm New Access Code
                  </>
                )}
              </button>
            </form>
          )}
        </div>
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