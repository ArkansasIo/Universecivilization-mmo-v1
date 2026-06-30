import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export default function AdminRegister() {
  const navigate = useNavigate();
  const { register, isSuperAdmin, loading: authLoading } = useAdminAuth();

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'moderator' as 'moderator' | 'admin' | 'super_admin',
    accessCode: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmScreen, setShowConfirmScreen] = useState(false);

  // ── Super Admin Guard ──────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#08080F] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 border-3 border-[#D4A017]/20 rounded-full"></div>
            <div className="absolute inset-0 border-3 border-[#D4A017] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-[#D4A017] font-medium">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-[#08080F] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-forbid-line text-4xl text-red-400"></i>
          </div>
          <h1 className="text-2xl font-bold text-[#E8E0D5] mb-3">Access Denied</h1>
          <p className="text-[#908070] mb-6">
            Only the root super administrator can create new admin accounts. If you need an admin account, contact the system administrator.
          </p>
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="px-6 py-3 bg-[#D4A017]/10 text-[#D4A017] rounded-lg hover:bg-[#D4A017]/20 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Admin Panel
          </button>
        </div>
      </div>
    );
  }
  // ─────────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (formData.accessCode !== 'STELLAR_ADMIN_2024') {
      setError('Invalid access code');
      return;
    }

    setLoading(true);

    try {
      const result = await register(
        formData.username,
        formData.email,
        formData.password,
        formData.fullName,
        formData.role
      );

      if (result.needsEmailConfirmation) {
        setShowConfirmScreen(true);
      } else {
        navigate('/admin-dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (showConfirmScreen) {
    return (
      <div className="min-h-screen bg-[#08080F] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-[#111108]/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-[#D4A017]/20 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#D4A017] to-[#B8860B] rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-mail-check-line text-4xl text-[#08080F]"></i>
            </div>
            <h2 className="text-2xl font-bold text-[#E8E0D5] mb-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>Verify Your Email</h2>
            <p className="text-[#908070] mb-6">
              We've sent a confirmation link to <span className="text-[#D4A017] font-medium">{formData.email}</span>. Click the link to activate your admin account, then log in through the admin panel.
            </p>
            <div className="bg-[#0D0C07]/50 rounded-xl p-4 text-left space-y-2 mb-6">
              <p className="text-[#908070] text-sm flex items-center gap-2">
                <i className="ri-time-line text-[#D4A017]"></i>
                The link expires in 24 hours
              </p>
              <p className="text-[#908070] text-sm flex items-center gap-2">
                <i className="ri-spam-2-line text-[#B8860B]"></i>
                Check your spam folder if you don't see it
              </p>
            </div>
            <button
              onClick={() => navigate('/admin-login')}
              className="w-full bg-gradient-to-r from-[#D4A017] to-[#B8860B] text-[#08080F] font-semibold py-3 rounded-xl transition-all whitespace-nowrap cursor-pointer"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              Go to Admin Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080F] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('https://readdy.ai/api/search-image?query=abstract%20golden%20circuit%20network%20dark%20background%20with%20warm%20amber%20data%20streams%20imperial%20security%20interface%20brass%20copper%20technology%20grid%20minimalist%20design&width=1920&height=1080&seq=admin-bg-002&orientation=landscape')] bg-cover bg-center opacity-5"></div>

      <div className="relative z-10 max-w-md w-full">
        <div className="bg-[#111108]/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-[#D4A017]/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#D4A017] to-[#B8860B] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <i className="ri-shield-user-line text-4xl text-[#08080F]"></i>
            </div>
            <h1 className="text-3xl font-bold text-[#E8E0D5] mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>Admin Registration</h1>
            <p className="text-[#908070]">Create your admin account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2">
                <i className="ri-error-warning-line text-red-400"></i>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-[#A09080] text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-[#0D0C07] border border-[#B8860B]/20 rounded-xl px-4 py-3 text-[#E8E0D5] placeholder-[#605040] focus:outline-none focus:border-[#D4A017] transition-colors text-sm"
                placeholder="Enter username"
                required
                minLength={3}
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-[#A09080] text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-[#0D0C07] border border-[#B8860B]/20 rounded-xl px-4 py-3 text-[#E8E0D5] placeholder-[#605040] focus:outline-none focus:border-[#D4A017] transition-colors text-sm"
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[#A09080] text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#0D0C07] border border-[#B8860B]/20 rounded-xl px-4 py-3 text-[#E8E0D5] placeholder-[#605040] focus:outline-none focus:border-[#D4A017] transition-colors text-sm"
                placeholder="admin@empire.local"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#A09080] text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#0D0C07] border border-[#B8860B]/20 rounded-xl px-4 py-3 text-[#E8E0D5] placeholder-[#605040] focus:outline-none focus:border-[#D4A017] transition-colors text-sm"
                placeholder="Min. 8 characters"
                required
                minLength={8}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[#A09080] text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full bg-[#0D0C07] border border-[#B8860B]/20 rounded-xl px-4 py-3 text-[#E8E0D5] placeholder-[#605040] focus:outline-none focus:border-[#D4A017] transition-colors text-sm"
                placeholder="Re-enter password"
                required
                minLength={8}
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-[#A09080] text-sm font-medium mb-2">
                Admin Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full bg-[#0D0C07] border border-[#B8860B]/20 rounded-xl px-4 py-3 text-[#E8E0D5] focus:outline-none focus:border-[#D4A017] transition-colors cursor-pointer text-sm"
              >
                <option value="moderator" className="bg-[#08080F]">Moderator</option>
                <option value="admin" className="bg-[#08080F]">Admin</option>
                <option value="super_admin" className="bg-[#08080F]">Super Admin</option>
              </select>
            </div>

            {/* Access Code */}
            <div>
              <label className="block text-[#A09080] text-sm font-medium mb-2">
                Access Code
              </label>
              <input
                type="password"
                value={formData.accessCode}
                onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                className="w-full bg-[#0D0C07] border border-[#B8860B]/20 rounded-xl px-4 py-3 text-[#E8E0D5] placeholder-[#605040] focus:outline-none focus:border-[#D4A017] transition-colors text-sm"
                placeholder="Enter access code"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#D4A017] to-[#B8860B] hover:from-[#E8B820] hover:to-[#C9A018] disabled:opacity-50 text-[#08080F] font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line text-xl animate-spin"></i>
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="ri-user-add-line text-xl"></i>
                  Create Admin Account
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-[#B8860B]/20 text-center">
            <p className="text-[#908070] text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/admin-login')}
                className="text-[#D4A017] hover:text-[#E8B820] font-medium transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-[#605040] text-xs">
            <i className="ri-shield-check-line mr-1"></i>
            All admin actions are logged and monitored
          </p>
        </div>
      </div>
    </div>
  );
}