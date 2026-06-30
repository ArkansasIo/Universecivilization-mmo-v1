import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasAdmins, setHasAdmins] = useState<boolean | null>(null);
  const [bootstrapping, setBootstrapping] = useState(false);
  const [bootstrapError, setBootstrapError] = useState('');
  const [bootstrapSuccess, setBootstrapSuccess] = useState(false);
  const [isBlockedPlayer, setIsBlockedPlayer] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [checkTimedOut, setCheckTimedOut] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, isAuthenticated } = useAdminAuth();

  const redirectPath = searchParams.get('redirect') || '/admin-dashboard';

  // Check for existing non-admin session — block regular players from admin area
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', session.user.id)
            .eq('is_active', true)
            .maybeSingle();

          if (!adminData) {
            setIsBlockedPlayer(true);
          }
        }
      } catch {
        // Fall through — show login form on error
      } finally {
        setCheckingSession(false);
      }
    };
    checkSession();
  }, []);

  // Check if any admins exist via edge function (bypasses RLS)
  useEffect(() => {
    let cancelled = false;
    const timeoutId = setTimeout(() => {
      if (!cancelled && hasAdmins === null) {
        setCheckTimedOut(true);
      }
    }, 8000);

    const checkAdmins = async () => {
      try {
        const supabaseUrl = (import.meta.env.VITE_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '').replace(/^["']|["']$/g, '');
        const anonKey = (import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || '').replace(/^["']|["']$/g, '');

        const response = await fetch(`${supabaseUrl}/functions/v1/check-admin-exists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`,
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          throw new Error(errData?.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        if (!cancelled) {
          setHasAdmins(data.exists === true);
          clearTimeout(timeoutId);
        }
      } catch (err: any) {
        console.warn('Edge function check failed, trying direct DB check:', err.message);
        try {
          const { data: adminCheck } = await supabase
            .from('admin_users')
            .select('id')
            .limit(1);
          if (!cancelled) {
            setHasAdmins((adminCheck?.length ?? 0) > 0);
            clearTimeout(timeoutId);
          }
        } catch (dbErr: any) {
          console.error('Direct DB check also failed:', dbErr);
          if (!cancelled) {
            setHasAdmins(false);
            clearTimeout(timeoutId);
          }
        }
      }
    };
    checkAdmins();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  // If already authenticated, go to intended page
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08080F] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 border-3 border-[#D4A017]/20 rounded-full"></div>
            <div className="absolute inset-0 border-3 border-[#D4A017] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-[#D4A017] font-medium">Redirecting to admin panel...</p>
        </div>
      </div>
    );
  }

  // Loading session check
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#08080F] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 border-3 border-[#605040]/50 rounded-full"></div>
            <div className="absolute inset-0 border-3 border-[#908070] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-[#908070] font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Loading admin existence check
  if (hasAdmins === null) {
    return (
      <div className="min-h-screen bg-[#08080F] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('https://readdy.ai/api/search-image?query=abstract%20golden%20circuit%20network%20dark%20background%20with%20warm%20amber%20data%20streams%20imperial%20security%20interface%20brass%20copper%20technology%20grid%20minimalist%20design&width=1920&height=1080&seq=admin-bg-002&orientation=landscape')] bg-cover bg-center opacity-5"></div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-[#111108]/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-[#D4A017]/20 p-8 text-center">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 border-3 border-[#D4A017]/20 rounded-full"></div>
              <div className="absolute inset-0 border-3 border-[#D4A017] border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="ri-shield-keyhole-line text-[#D4A017] text-xl"></i>
              </div>
            </div>
            <h1 className="text-xl font-bold text-[#E8E0D5] mb-2">Checking System Status</h1>
            <p className="text-[#908070] text-sm">Verifying admin configuration...</p>
            {checkTimedOut && (
              <div className="mt-6 p-4 bg-[#D4A017]/10 border border-[#D4A017]/30 rounded-lg">
                <p className="text-[#D4A017] text-sm mb-3">This is taking longer than expected. The edge function may be cold-starting.</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => { setHasAdmins(true); setCheckTimedOut(false); }}
                    className="px-4 py-2 bg-[#D4A017] hover:bg-[#E8B820] text-[#08080F] text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Skip to Login
                  </button>
                  <button
                    onClick={() => { setHasAdmins(false); setCheckTimedOut(false); }}
                    className="px-4 py-2 bg-[#B8860B] hover:bg-[#C9A018] text-[#08080F] text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Go to Setup
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-[#908070] hover:text-[#D4A017] transition-colors flex items-center justify-center gap-2 mx-auto whitespace-nowrap cursor-pointer"
            >
              <i className="ri-arrow-left-line"></i>
              Back to Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Block non-admin logged-in players
  if (isBlockedPlayer) {
    return (
      <div className="min-h-screen bg-[#08080F] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('https://readdy.ai/api/search-image?query=abstract%20golden%20circuit%20network%20dark%20background%20with%20warm%20amber%20data%20streams%20imperial%20security%20interface%20brass%20copper%20technology%20grid%20minimalist%20design&width=1920&height=1080&seq=admin-bg-002&orientation=landscape')] bg-cover bg-center opacity-5"></div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-[#111108]/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-red-500/20 p-8 text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-forbid-line text-4xl text-red-400"></i>
            </div>
            <h1 className="text-2xl font-bold text-[#E8E0D5] mb-3">Access Restricted</h1>
            <p className="text-[#908070] mb-6">
              This area is reserved for system administrators. You are logged in as a regular player — admin privileges are required to proceed.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-[#D4A017]/10 text-[#D4A017] rounded-lg hover:bg-[#D4A017]/20 transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-home-line mr-2"></i>
                Go to Dashboard
              </button>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setIsBlockedPlayer(false);
                }}
                className="px-6 py-3 bg-[#1a180f] text-[#908070] rounded-lg hover:bg-[#222015] transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-logout-box-r-line mr-2"></i>
                Sign Out
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-[#908070] hover:text-[#D4A017] transition-colors flex items-center justify-center gap-2 mx-auto whitespace-nowrap cursor-pointer"
            >
              <i className="ri-arrow-left-line"></i>
              Back to Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(usernameOrEmail, password);
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials or unauthorized access');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBootstrap = async () => {
    setBootstrapping(true);
    setBootstrapError('');
    setBootstrapSuccess(false);

    try {
      const supabaseUrl = (import.meta.env.VITE_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '').replace(/^["']|["']$/g, '');

      const response = await fetch(`${supabaseUrl}/functions/v1/bootstrap-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'root',
          email: 'root@admin.local',
          password: 'ChangeMe123!',
          full_name: 'Root Administrator',
          secret: 'bootstrap-root-2026',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.error?.includes('already exists')) {
          setBootstrapSuccess(true);
          setHasAdmins(true);
          setBootstrapping(false);
          return;
        }
        throw new Error(data.error || `Edge function returned ${response.status}`);
      }

      setBootstrapSuccess(true);
      setHasAdmins(true);
    } catch (err: any) {
      const msg = err?.message || String(err) || 'Failed to initialize root admin';
      setBootstrapError(msg);
      console.error('Bootstrap error:', err);
    } finally {
      setBootstrapping(false);
    }
  };

  // First-time setup screen — no admins exist yet
  if (hasAdmins === false) {
    return (
      <div className="min-h-screen bg-[#08080F] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('https://readdy.ai/api/search-image?query=abstract%20golden%20circuit%20network%20dark%20background%20with%20warm%20amber%20data%20streams%20imperial%20security%20interface%20brass%20copper%20technology%20grid%20minimalist%20design&width=1920&height=1080&seq=admin-bg-002&orientation=landscape')] bg-cover bg-center opacity-5"></div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-[#111108]/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-[#D4A017]/20 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D4A017] to-[#B8860B] rounded-xl mb-4">
                <i className="ri-settings-3-line text-3xl text-[#08080F]"></i>
              </div>
              <h1 className="text-3xl font-bold text-[#E8E0D5] mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>System Initialization</h1>
              <p className="text-[#908070]">No admin accounts found. Initialize the root admin to get started.</p>
            </div>

            {bootstrapError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                <i className="ri-error-warning-line text-red-400 text-xl mt-0.5"></i>
                <div>
                  <p className="text-red-400 font-medium">Initialization Failed</p>
                  <p className="text-red-300/80 text-sm mt-1">{bootstrapError}</p>
                </div>
              </div>
            )}

            {bootstrapSuccess ? (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-start gap-3">
                <i className="ri-checkbox-circle-line text-emerald-400 text-xl mt-0.5"></i>
                <div>
                  <p className="text-emerald-400 font-medium">Root Admin Created</p>
                  <p className="text-emerald-300/80 text-sm mt-1">
                    Log in with username <strong className="text-emerald-200">root</strong> and password <strong className="text-emerald-200">ChangeMe123!</strong>
                  </p>
                  <button
                    onClick={() => setHasAdmins(true)}
                    className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-[#0D0C07]/50 rounded-xl p-5 border border-[#B8860B]/20">
                  <h3 className="text-sm font-semibold text-[#A09080] uppercase tracking-wider mb-4">Default Root Credentials</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#908070] text-sm">Username</span>
                      <span className="text-[#E8E0D5] font-mono text-sm">root</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#908070] text-sm">Email</span>
                      <span className="text-[#E8E0D5] font-mono text-sm">root@admin.local</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#908070] text-sm">Password</span>
                      <span className="text-[#E8E0D5] font-mono text-sm">ChangeMe123!</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#908070] text-sm">Role</span>
                      <span className="text-[#D4A017] font-medium text-sm">Super Admin</span>
                    </div>
                  </div>
                  <p className="text-[#605040] text-xs mt-4">
                    <i className="ri-information-line mr-1"></i>
                    You can change the password after your first login.
                  </p>
                </div>

                <button
                  onClick={handleBootstrap}
                  disabled={bootstrapping}
                  className="w-full py-3 bg-gradient-to-r from-[#D4A017] to-[#B8860B] hover:from-[#E8B820] hover:to-[#C9A018] text-[#08080F] font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                  {bootstrapping ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      Initializing...
                    </>
                  ) : (
                    <>
                      <i className="ri-shield-keyhole-line"></i>
                      Initialize Root Admin
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-[#908070] hover:text-[#D4A017] transition-colors flex items-center justify-center gap-2 mx-auto whitespace-nowrap cursor-pointer"
            >
              <i className="ri-arrow-left-line"></i>
              Back to Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Normal login screen
  return (
    <div className="min-h-screen bg-[#08080F] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('https://readdy.ai/api/search-image?query=abstract%20golden%20circuit%20network%20dark%20background%20with%20warm%20amber%20data%20streams%20imperial%20security%20interface%20brass%20copper%20technology%20grid%20minimalist%20design&width=1920&height=1080&seq=admin-bg-002&orientation=landscape')] bg-cover bg-center opacity-5"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#111108]/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-[#D4A017]/20 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D4A017] to-[#B8860B] rounded-xl mb-4">
              <i className="ri-shield-keyhole-line text-3xl text-[#08080F]"></i>
            </div>
            <h1 className="text-3xl font-bold text-[#E8E0D5] mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>Admin Access</h1>
            <p className="text-[#908070]">Secure Control Panel Login</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <i className="ri-error-warning-line text-red-400 text-xl mt-0.5"></i>
              <div>
                <p className="text-red-400 font-medium">Access Denied</p>
                <p className="text-red-300/80 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#A09080] mb-2">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-user-line text-[#605040]"></i>
                </div>
                <input
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0D0C07] border border-[#B8860B]/20 rounded-lg text-[#E8E0D5] placeholder-[#605040] focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-transparent transition-all text-sm"
                  placeholder="admin or admin@empire.local"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#A09080] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-lock-password-line text-[#605040]"></i>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0D0C07] border border-[#B8860B]/20 rounded-lg text-[#E8E0D5] placeholder-[#605040] focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-transparent transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#D4A017] to-[#B8860B] hover:from-[#E8B820] hover:to-[#C9A018] text-[#08080F] font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
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
                  Access Admin Panel
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#B8860B]/20">
            <div className="flex items-center justify-center text-sm">
              <div className="flex items-center gap-2 text-[#605040]">
                <i className="ri-shield-check-line"></i>
                <span>Restricted Access — Authorized Personnel Only</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-[#908070] hover:text-[#D4A017] transition-colors flex items-center justify-center gap-2 mx-auto whitespace-nowrap cursor-pointer"
          >
            <i className="ri-arrow-left-line"></i>
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
}