import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';

interface AuthUser {
  id: string;
  email: string;
  email_confirmed_at: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  username: string | null;
  provider: string;
}

const supabaseUrl = (import.meta.env.VITE_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '').replace(/^[\"']|[\"']$/g, '');
const anonKey = (import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || '').replace(/^[\"']|[\"']$/g, '');

async function getSessionToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

export default function VerificationTab() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [filtered, setFiltered] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'pending' | 'verified' | 'all'>('pending');
  const [search, setSearch] = useState('');
  const [resendLoadingId, setResendLoadingId] = useState<string | null>(null);
  const [verifyLoadingId, setVerifyLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmUser, setConfirmUser] = useState<AuthUser | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getSessionToken();
      const res = await fetch(`${supabaseUrl}/functions/v1/list-pending-verifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ page: 1, perPage: 1000, filter }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        showToast(data.error || 'Failed to load users', 'error');
      }
    } catch {
      showToast('Network error while loading users', 'error');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.email.toLowerCase().includes(term) ||
          (u.username && u.username.toLowerCase().includes(term))
      )
    );
  }, [users, search]);

  const handleResend = async (user: AuthUser) => {
    setResendLoadingId(user.id);
    try {
      const token = await getSessionToken();
      const res = await fetch(`${supabaseUrl}/functions/v1/resend-verification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Verification resent to ${user.email}`, 'success');
      } else {
        showToast(data.error || 'Failed to resend', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setResendLoadingId(null);
    }
  };

  const handleForceVerify = async (user: AuthUser) => {
    setVerifyLoadingId(user.id);
    try {
      const token = await getSessionToken();
      const res = await fetch(`${supabaseUrl}/functions/v1/admin-verify-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ user_id: user.id }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`${user.email} verified successfully`, 'success');
        await loadUsers();
      } else {
        showToast(data.error || 'Failed to verify', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setVerifyLoadingId(null);
      setConfirmUser(null);
    }
  };

  const pendingCount = users.filter((u) => !u.email_confirmed_at).length;
  const verifiedCount = users.filter((u) => !!u.email_confirmed_at).length;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/15 border border-red-500/30 text-red-300'
          }`}
        >
          <i
            className={
              toast.type === 'success' ? 'ri-checkbox-circle-line text-lg' : 'ri-error-warning-line text-lg'
            }
          ></i>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#E8E0D5]">Email Verifications</h2>
          <p className="text-[#908070] text-sm mt-1">
            Manage pending verifications, resend confirmation emails, and force-verify accounts
          </p>
        </div>
        <button
          onClick={loadUsers}
          disabled={loading}
          className="px-4 py-2 bg-[#D4A017]/10 text-[#D4A017] rounded-lg hover:bg-[#D4A017]/20 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-50"
        >
          <i className={`ri-refresh-line ${loading ? 'animate-spin' : ''}`}></i>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#D4A017]/10 to-[#B8860B]/10 border border-[#D4A017]/20 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4A017]/20 rounded-lg flex items-center justify-center">
              <i className="ri-mail-check-line text-xl text-[#D4A017]"></i>
            </div>
            <div>
              <p className="text-[#908070] text-xs font-medium">Total Loaded</p>
              <p className="text-2xl font-bold text-[#E8E0D5]">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-xl text-orange-400"></i>
            </div>
            <div>
              <p className="text-[#908070] text-xs font-medium">Pending</p>
              <p className="text-2xl font-bold text-[#E8E0D5]">{pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <i className="ri-shield-check-line text-xl text-emerald-400"></i>
            </div>
            <div>
              <p className="text-[#908070] text-xs font-medium">Verified</p>
              <p className="text-2xl font-bold text-[#E8E0D5]">{verifiedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex bg-[#111108] border border-[#B8860B]/20 rounded-xl p-1 gap-1">
          {(['pending', 'verified', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                filter === f
                  ? 'bg-gradient-to-r from-[#D4A017] to-[#B8860B] text-[#08080F]'
                  : 'text-[#908070] hover:text-[#E8E0D5]'
              }`}
            >
              {f === 'pending' && (
                <>
                  <i className="ri-time-line mr-1"></i>Pending
                </>
              )}
              {f === 'verified' && (
                <>
                  <i className="ri-shield-check-line mr-1"></i>Verified
                </>
              )}
              {f === 'all' && (
                <>
                  <i className="ri-list-check mr-1"></i>All
                </>
              )}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[#605040]"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email or username..."
            className="w-full bg-[#111108] border border-[#B8860B]/20 rounded-xl pl-10 pr-4 py-2.5 text-[#E8E0D5] text-sm placeholder-[#605040] focus:outline-none focus:border-[#D4A017]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111108]/80 border border-[#B8860B]/20 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <i className="ri-loader-4-line text-3xl text-[#D4A017] animate-spin"></i>
            <p className="text-[#908070] mt-3">Loading accounts...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[#D4A017]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-mail-check-line text-3xl text-[#D4A017]"></i>
            </div>
            <p className="text-[#E8E0D5] font-medium">
              {search ? 'No accounts match your search' : 'No accounts found in this category'}
            </p>
            <p className="text-[#908070] text-sm mt-1">
              {filter === 'pending'
                ? 'All registered accounts have verified their email — excellent!'
                : 'Try switching the filter or refreshing the data.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#B8860B]/20 bg-[#1a180f]/60">
                  <th className="text-left text-[#A09080] font-semibold py-3 px-4 text-sm">Email</th>
                  <th className="text-left text-[#A09080] font-semibold py-3 px-4 text-sm">Username</th>
                  <th className="text-left text-[#A09080] font-semibold py-3 px-4 text-sm">Provider</th>
                  <th className="text-left text-[#A09080] font-semibold py-3 px-4 text-sm">Registered</th>
                  <th className="text-left text-[#A09080] font-semibold py-3 px-4 text-sm">Status</th>
                  <th className="text-left text-[#A09080] font-semibold py-3 px-4 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[#B8860B]/10 hover:bg-[#1a180f]/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="text-[#E8E0D5] text-sm font-medium">{user.email}</span>
                      <span className="block text-[#605040] text-xs font-mono mt-0.5">
                        {user.id.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[#A09080] text-sm">
                        {user.username || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-[#1a180f] border border-[#B8860B]/20 rounded text-[#908070] text-xs capitalize">
                        {user.provider}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[#908070] text-sm whitespace-nowrap">
                        {new Date(user.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="block text-[#605040] text-xs">
                        {new Date(user.created_at).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {user.email_confirmed_at ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-500/25 rounded-full text-emerald-400 text-xs font-medium">
                          <i className="ri-checkbox-circle-line"></i>
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/15 border border-orange-500/25 rounded-full text-orange-400 text-xs font-medium">
                          <i className="ri-time-line"></i>
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {!user.email_confirmed_at && (
                          <>
                            <button
                              onClick={() => handleResend(user)}
                              disabled={resendLoadingId === user.id}
                              className="w-8 h-8 flex items-center justify-center bg-[#D4A017]/15 text-[#D4A017] rounded-lg hover:bg-[#D4A017]/25 transition-colors cursor-pointer disabled:opacity-50"
                              title="Resend verification email"
                            >
                              {resendLoadingId === user.id ? (
                                <i className="ri-loader-4-line animate-spin"></i>
                              ) : (
                                <i className="ri-mail-send-line"></i>
                              )}
                            </button>
                            <button
                              onClick={() => setConfirmUser(user)}
                              disabled={verifyLoadingId === user.id}
                              className="w-8 h-8 flex items-center justify-center bg-emerald-500/15 text-emerald-400 rounded-lg hover:bg-emerald-500/25 transition-colors cursor-pointer disabled:opacity-50"
                              title="Force verify account"
                            >
                              {verifyLoadingId === user.id ? (
                                <i className="ri-loader-4-line animate-spin"></i>
                              ) : (
                                <i className="ri-shield-check-line"></i>
                              )}
                            </button>
                          </>
                        )}
                        {user.email_confirmed_at && (
                          <span className="text-[#605040] text-xs italic">No action needed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Force Verify Confirmation Modal */}
      {confirmUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111108] border border-[#B8860B]/20 rounded-xl p-8 max-w-md w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-500/15 rounded-full flex items-center justify-center border border-emerald-500/25">
                <i className="ri-shield-check-line text-2xl text-emerald-400"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#E8E0D5]">Force Verify Account</h3>
                <p className="text-[#908070] text-sm">This bypasses email confirmation</p>
              </div>
            </div>
            <p className="text-[#A09080] mb-2">
              You are about to manually verify the account for:
            </p>
            <div className="bg-[#0D0C07] border border-[#B8860B]/20 rounded-lg p-4 mb-6">
              <p className="text-[#E8E0D5] font-semibold">{confirmUser.email}</p>
              <p className="text-[#605040] text-xs font-mono mt-1">{confirmUser.id}</p>
              <p className="text-[#908070] text-xs mt-1">
                Registered {new Date(confirmUser.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-6">
              <p className="text-orange-300 text-sm flex items-start gap-2">
                <i className="ri-error-warning-line text-orange-400 mt-0.5"></i>
                This action cannot be undone. The user will be able to log in immediately without confirming their email address.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmUser(null)}
                className="flex-1 bg-[#1a180f] border border-[#B8860B]/20 text-[#E8E0D5] px-6 py-3 rounded-lg font-semibold hover:bg-[#1a180f]/80 transition-colors whitespace-nowrap cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleForceVerify(confirmUser)}
                disabled={verifyLoadingId === confirmUser.id}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 whitespace-nowrap cursor-pointer"
              >
                {verifyLoadingId === confirmUser.id ? (
                  <span className="flex items-center gap-2 justify-center">
                    <i className="ri-loader-4-line animate-spin"></i>
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    <i className="ri-shield-check-line"></i>
                    Force Verify
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}