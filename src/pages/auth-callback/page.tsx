import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { completeRegistration, getPendingRegistration, clearPendingRegistration } from '../../utils/registrationSetup';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Initializing command protocols...');

  useEffect(() => {
    let cancelled = false;

    async function processCallback() {
      try {
        // Give Supabase a moment to process any tokens in the URL hash
        await new Promise((r) => setTimeout(r, 800));

        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          // No session yet — might be a direct visit without a callback token
          setStatus('error');
          setMessage('No active session detected. Please sign in manually.');
          return;
        }

        if (cancelled) return;

        const pending = getPendingRegistration();

        if (pending) {
          setMessage('Configuring empire data...');
          try {
            await completeRegistration(session.user.id, pending);
            clearPendingRegistration();
          } catch (setupErr: any) {
            console.error('Registration setup error:', setupErr);
            // Non-fatal — user can still play, just might be missing starting bonuses
          }
        }

        if (cancelled) return;

        setStatus('success');
        setMessage('Command interface online. Redirecting...');

        // Brief delay so the user sees the success state
        setTimeout(() => {
          if (!cancelled) navigate('/dashboard', { replace: true });
        }, 1200);
      } catch (err: any) {
        console.error('Auth callback error:', err);
        if (!cancelled) {
          setStatus('error');
          setMessage(err.message || 'Authentication failed. Please try again.');
        }
      }
    }

    processCallback();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#08080F] relative overflow-hidden flex items-center justify-center">
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
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

      <div className="relative z-10 text-center px-6">
        {/* Spinner or icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-[#D4A017] to-[#B8860B] rounded-2xl flex items-center justify-center shadow-lg shadow-[#D4A017]/20 mx-auto mb-6">
          {status === 'processing' && (
            <i className="ri-loader-4-line text-3xl text-[#08080F] animate-spin"></i>
          )}
          {status === 'success' && (
            <i className="ri-check-line text-3xl text-[#08080F]"></i>
          )}
          {status === 'error' && (
            <i className="ri-error-warning-line text-3xl text-[#08080F]"></i>
          )}
        </div>

        <h1
          className={`text-2xl font-bold mb-3 ${
            status === 'error' ? 'text-red-400' : 'text-[#E8E0D5]'
          }`}
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          {status === 'processing' && 'Establishing Connection'}
          {status === 'success' && 'Access Granted'}
          {status === 'error' && 'Connection Failed'}
        </h1>

        <p className="text-[#908070] max-w-sm mx-auto">{message}</p>

        {status === 'error' && (
          <div className="mt-8 flex gap-3 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="py-3 px-6 bg-gradient-to-r from-[#D4A017] to-[#B8860B] hover:from-[#E8B820] hover:to-[#C9A018] text-[#08080F] font-semibold rounded-lg shadow-lg shadow-[#D4A017]/20 transition-all whitespace-nowrap cursor-pointer"
            >
              <i className="ri-login-box-line mr-2"></i>
              Return to Login
            </button>
          </div>
        )}
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