import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useAdminPanel } from '../../hooks/useAdminPanel';
import { supabase } from '../../lib/supabase';
import VerificationTab from './components/VerificationTab';

interface ServerSetting {
  id: number;
  key: string;
  value: string;
  value_type: string;
  category: string;
  description: string;
  editable_by_admin: boolean;
}

export default function AdminDashboard() {
  const { adminUser, signOut, isSuperAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const {
    stats,
    players,
    admins,
    adminLogs,
    adminLoading,
    loading,
    loadAdmins,
    loadAdminLogs,
    updateAdminRole,
    toggleAdminStatus,
    deleteAdmin,
    banPlayer,
    unbanPlayer,
    giveResources,
    adjustPlayerLevel,
    deletePlayer,
    broadcastMessage,
  } = useAdminPanel();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [resourceAmount, setResourceAmount] = useState({ metal: 0, crystal: 0, deuterium: 0, dark_matter: 0 });
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');

  // Admin management state
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteAdminModal, setShowDeleteAdminModal] = useState(false);
  const [newRole, setNewRole] = useState('moderator');

  // Server settings state
  const [serverSettings, setServerSettings] = useState<ServerSetting[]>([]);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsEdited, setSettingsEdited] = useState<Record<string, string>>();
  const [settingsSaving, setSettingsSaving] = useState(false);

  useEffect(() => {
    if (activeTab === 'admins') {
      loadAdmins();
    }
    if (activeTab === 'audit') {
      loadAdminLogs();
      loadAdmins();
    }
    if (activeTab === 'settings') {
      loadServerSettings();
    }
  }, [activeTab]);

  const loadServerSettings = async () => {
    setSettingsLoading(true);
    const { data } = await supabase
      .from('server_settings')
      .select('*')
      .order('category', { ascending: true })
      .order('key', { ascending: true });
    if (data) {
      setServerSettings(data);
      const initialEdits: Record<string, string> = {};
      data.forEach((s: ServerSetting) => { initialEdits[s.key] = s.value; });
      setSettingsEdited(initialEdits);
    }
    setSettingsLoading(false);
  };

  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    const updates = Object.entries(settingsEdited).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }));

    for (const update of updates) {
      await supabase.from('server_settings').update({ value: update.value, updated_at: update.updated_at }).eq('key', update.key);
    }
    await loadServerSettings();
    setSettingsSaving(false);
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettingsEdited(prev => ({ ...prev, [key]: value }));
  };

  const handleAdminLogout = async () => {
    await signOut();
    navigate('/admin-login');
  };

  const handleBanPlayer = async () => {
    if (selectedPlayer && banReason) {
      await banPlayer(selectedPlayer.id, banReason);
      setShowBanModal(false);
      setBanReason('');
      setSelectedPlayer(null);
    }
  };

  const handleUnbanPlayer = async (playerId: string) => {
    await unbanPlayer(playerId);
  };

  const handleGiveResources = async () => {
    if (selectedPlayer) {
      await giveResources(selectedPlayer.id, resourceAmount);
      setShowResourceModal(false);
      setResourceAmount({ metal: 0, crystal: 0, deuterium: 0, dark_matter: 0 });
      setSelectedPlayer(null);
    }
  };

  const handleBroadcast = async () => {
    if (broadcastSubject && broadcastContent) {
      await broadcastMessage(broadcastSubject, broadcastContent);
      setShowBroadcastModal(false);
      setBroadcastSubject('');
      setBroadcastContent('');
    }
  };

  const handleUpdateAdminRole = async () => {
    if (selectedAdmin && newRole) {
      await updateAdminRole(selectedAdmin.id, newRole);
      setShowRoleModal(false);
      setSelectedAdmin(null);
      setNewRole('moderator');
    }
  };

  const handleToggleAdminStatus = async (adminId: string, currentStatus: boolean) => {
    await toggleAdminStatus(adminId, !currentStatus);
  };

  const handleDeleteAdmin = async () => {
    if (selectedAdmin) {
      await deleteAdmin(selectedAdmin.id);
      setShowDeleteAdminModal(false);
      setSelectedAdmin(null);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'text-amber-400 bg-amber-500/10';
      case 'admin': return 'text-cyan-400 bg-cyan-500/10';
      case 'moderator': return 'text-teal-400 bg-teal-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'admin_login': return { label: 'Login', color: 'text-emerald-400' };
      case 'admin_logout': return { label: 'Logout', color: 'text-gray-400' };
      case 'admin_register': return { label: 'Registered', color: 'text-cyan-400' };
      case 'update_admin_role': return { label: 'Role Updated', color: 'text-amber-400' };
      case 'toggle_admin_status': return { label: 'Status Changed', color: 'text-orange-400' };
      case 'delete_admin': return { label: 'Deleted', color: 'text-red-400' };
      case 'force_verify_user': return { label: 'Force Verified', color: 'text-emerald-400' };
      default: return { label: action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), color: 'text-gray-400' };
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'ri-dashboard-line' },
    { id: 'players', label: 'Players', icon: 'ri-group-line' },
    { id: 'alliances', label: 'Alliances', icon: 'ri-team-line' },
    { id: 'economy', label: 'Economy', icon: 'ri-coins-line' },
    { id: 'combat', label: 'Combat', icon: 'ri-sword-line' },
    { id: 'settings', label: 'Settings', icon: 'ri-settings-3-line' },
    { id: 'broadcast', label: 'Broadcast', icon: 'ri-broadcast-line' },
    ...(isSuperAdmin ? [
      { id: 'admins', label: 'Admin Management', icon: 'ri-shield-user-line' },
      { id: 'audit', label: 'Audit Logs', icon: 'ri-file-list-3-line' },
    ] : []),
    ...(isSuperAdmin ? [
      { id: 'verifications', label: 'Verifications', icon: 'ri-mail-check-line' },
    ] : []),
  ];

  const settingsByCategory = serverSettings.reduce((acc: Record<string, ServerSetting[]>, setting) => {
    if (!acc[setting.category]) acc[setting.category] = [];
    acc[setting.category].push(setting);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080F] flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-[#D4A017] animate-spin"></i>
          <p className="text-[#908070] mt-4">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080F]">
      {/* Top Bar */}
      <div className="bg-[#111108] border-b border-[#B8860B]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#D4A017] to-[#B8860B] rounded-lg flex items-center justify-center">
                  <i className="ri-shield-keyhole-line text-xl text-[#08080F]"></i>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#E8E0D5]">Admin Control Panel</h1>
                  <p className="text-sm text-[#908070]">Universe Civilization: Empires at War</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {adminUser && (
                <div className="flex items-center gap-3 mr-4">
                  <div className="text-right">
                    <p className="text-[#E8E0D5] text-sm font-medium">{adminUser.full_name || adminUser.username}</p>
                    <p className="text-[#D4A017] text-xs capitalize">{adminUser.role}{isSuperAdmin && ' · Super'}</p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-[#D4A017] to-[#B8860B] rounded-full flex items-center justify-center">
                    <i className="ri-shield-user-line text-[#08080F]"></i>
                  </div>
                </div>
              )}
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-[#D4A017]/10 text-[#D4A017] rounded-lg hover:bg-[#D4A017]/20 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-home-line"></i>
                Back to Game
              </button>
              <button
                onClick={handleAdminLogout}
                className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-logout-box-r-line"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#E8E0D5] mb-6">Game Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#D4A017]/10 to-[#B8860B]/10 border border-[#D4A017]/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#D4A017] text-sm font-medium">Total Players</p>
                  <p className="text-3xl font-bold text-[#E8E0D5] mt-2">{stats.totalPlayers.toLocaleString()}</p>
                  <p className="text-sm text-[#908070] mt-1">{stats.activePlayers} active (24h)</p>
                </div>
                <div className="w-12 h-12 bg-[#D4A017]/20 rounded-lg flex items-center justify-center">
                  <i className="ri-group-line text-2xl text-[#D4A017]"></i>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1e2a36]/80 to-[#080b0f]/80 border border-[#1e2a36] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#5bc0be] text-sm font-medium">Total Alliances</p>
                  <p className="text-3xl font-bold text-[#E8E0D5] mt-2">{stats.totalAlliances.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-[#5bc0be]/20 rounded-lg flex items-center justify-center">
                  <i className="ri-team-line text-2xl text-[#5bc0be]"></i>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-400 text-sm font-medium">Total Ships</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.totalShips.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <i className="ri-rocket-line text-2xl text-red-400"></i>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-400 text-sm font-medium">Active Fleets</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.totalFleets.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <i className="ri-ship-line text-2xl text-orange-400"></i>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Total Combats</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.totalCombats.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <i className="ri-sword-line text-2xl text-purple-400"></i>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-400 text-sm font-medium">Server Status</p>
                  <p className="text-xl font-bold text-white mt-2">Online</p>
                  <p className="text-sm text-gray-400 mt-1">All systems operational</p>
                </div>
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <i className="ri-server-line text-2xl text-amber-400"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#111108] border border-[#B8860B]/20 rounded-xl p-2 mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#D4A017] to-[#B8860B] text-[#08080F]'
                  : 'text-[#908070] hover:text-[#E8E0D5] hover:bg-[#1a180f]'
              }`}
            >
              <i className={tab.icon}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Players Tab */}
        {activeTab === 'players' && (
          <div className="bg-[#111108]/80 border border-[#B8860B]/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#E8E0D5]">Player Management</h2>
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#D4A017] to-[#B8860B] hover:from-[#E8B820] hover:to-[#C9A018] text-[#08080F] rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer"
              >
                <i className="ri-broadcast-line mr-2"></i>
                Broadcast Message
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-[#A09080] font-semibold py-3 px-4">Username</th>
                    <th className="text-left text-[#A09080] font-semibold py-3 px-4">Level</th>
                    <th className="text-left text-[#A09080] font-semibold py-3 px-4">Credits</th>
                    <th className="text-left text-[#A09080] font-semibold py-3 px-4">Faction</th>
                    <th className="text-left text-[#A09080] font-semibold py-3 px-4">Status</th>
                    <th className="text-left text-[#A09080] font-semibold py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id} className="border-b border-[#B8860B]/10 hover:bg-[#1a180f]/50 transition-colors">
                      <td className="py-4 px-4">
                        <span className="text-[#E8E0D5] font-semibold">{player.username}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-[#D4A017]">{player.level}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-emerald-400">{formatNumber(player.credits)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-400">{player.faction}</span>
                      </td>
                      <td className="py-4 px-4">
                        {player.is_banned ? (
                          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                            Banned
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedPlayer(player);
                              setShowResourceModal(true);
                            }}
                            className="w-8 h-8 flex items-center justify-center bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors cursor-pointer"
                            title="Give Resources"
                          >
                            <i className="ri-gift-line"></i>
                          </button>
                          {player.is_banned ? (
                            <button
                              onClick={() => handleUnbanPlayer(player.id)}
                              className="w-8 h-8 flex items-center justify-center bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors cursor-pointer"
                              title="Unban Player"
                            >
                              <i className="ri-shield-check-line"></i>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedPlayer(player);
                                setShowBanModal(true);
                              }}
                              className="w-8 h-8 flex items-center justify-center bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors cursor-pointer"
                              title="Ban Player"
                            >
                              <i className="ri-forbid-line"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Server Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#E8E0D5]">Server Settings</h2>
                <p className="text-[#908070] text-sm mt-1">Configure global game parameters and mechanics</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={loadServerSettings}
                  className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-refresh-line"></i>
                  Refresh
                </button>
                <button
                  onClick={handleSaveSettings}
                  disabled={settingsSaving}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-teal-600 transition-all disabled:opacity-50 whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-save-line mr-2"></i>
                  {settingsSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {settingsLoading ? (
              <div className="bg-[#111108]/80 border border-[#B8860B]/20 rounded-xl p-12 text-center">
                <i className="ri-loader-4-line text-4xl text-[#D4A017] animate-spin"></i>
                <p className="text-[#908070] mt-4">Loading server settings...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(settingsByCategory).map(([category, settings]) => (
                  <div key={category} className="bg-[#111108]/80 border border-[#B8860B]/20 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-[#D4A017] mb-4 capitalize flex items-center gap-2">
                      <i className="ri-settings-4-line"></i>
                      {category} Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {settings.map((setting) => (
                        <div key={setting.id} className="bg-[#0D0C07]/80 rounded-lg p-4 border border-[#1e2a36]">
                          <label className="block text-[#E8E0D5] font-semibold text-sm mb-1">
                            {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </label>
                          <p className="text-[#605040] text-xs mb-2">{setting.description}</p>
                          {setting.value_type === 'boolean' ? (
                            <select
                              value={settingsEdited[setting.key] ?? setting.value}
                              onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                            >
                              <option value="true">Enabled</option>
                              <option value="false">Disabled</option>
                            </select>
                          ) : setting.value_type === 'number' ? (
                            <input
                              type="number"
                              step="any"
                              value={settingsEdited[setting.key] ?? setting.value}
                              onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                              className="w-full px-3 py-2 bg-[#111108] border border-[#B8860B]/20 rounded-lg text-[#E8E0D5] text-sm focus:outline-none focus:border-[#D4A017]"
                            />
                          ) : (
                            <input
                              type="text"
                              value={settingsEdited[setting.key] ?? setting.value}
                              onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                              className="w-full px-3 py-2 bg-[#111108] border border-[#B8860B]/20 rounded-lg text-[#E8E0D5] text-sm focus:outline-none focus:border-[#D4A017]"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Admin Management Tab */}
        {activeTab === 'admins' && isSuperAdmin && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#E8E0D5]">Admin Management</h2>
                <p className="text-[#908070] text-sm mt-1">Manage admin accounts, roles, and access permissions</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/admin-register')}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-user-add-line"></i>
                  Create Admin
                </button>
                <button
                  onClick={() => {
                    loadAdmins();
                    loadAdminLogs();
                  }}
                  className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-refresh-line"></i>
                  Refresh
                </button>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700 bg-gray-800/80">
                      <th className="text-left text-[#A09080] font-semibold py-3 px-4">Username</th>
                      <th className="text-left text-[#A09080] font-semibold py-3 px-4">Email</th>
                      <th className="text-left text-[#A09080] font-semibold py-3 px-4">Full Name</th>
                      <th className="text-left text-[#A09080] font-semibold py-3 px-4">Role</th>
                      <th className="text-left text-[#A09080] font-semibold py-3 px-4">Status</th>
                      <th className="text-left text-[#A09080] font-semibold py-3 px-4">Last Login</th>
                      <th className="text-left text-[#A09080] font-semibold py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminLoading ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-500">
                          <i className="ri-loader-4-line animate-spin mr-2"></i>
                          Loading admin accounts...
                        </td>
                      </tr>
                    ) : admins.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-500">
                          No admin accounts found.
                        </td>
                      </tr>
                    ) : (
                      admins.map((admin) => (
                        <tr key={admin.id} className="border-b border-[#B8860B]/10 hover:bg-[#1a180f]/50 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                admin.is_super_admin
                                  ? 'bg-amber-500/20'
                                  : admin.role === 'admin'
                                  ? 'bg-cyan-500/20'
                                  : 'bg-teal-500/20'
                              }`}>
                                <i className={`${
                                  admin.is_super_admin
                                    ? 'ri-vip-crown-line text-amber-400'
                                    : admin.role === 'admin'
                                    ? 'ri-shield-keyhole-line text-cyan-400'
                                    : 'ri-shield-line text-teal-400'
                                }`}></i>
                              </div>
                              <span className="text-[#E8E0D5] font-semibold">{admin.username}</span>
                              {admin.id === adminUser?.id && (
                                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">You</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-[#908070]">{admin.email}</td>
                          <td className="py-4 px-4 text-[#A09080]">{admin.full_name || '-'}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-sm capitalize ${getRoleColor(admin.role)}`}>
                              {admin.role.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {admin.is_active ? (
                              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                                Active
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-[#908070] text-sm">
                            {admin.last_login
                              ? new Date(admin.last_login).toLocaleString()
                              : 'Never'}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedAdmin(admin);
                                  setNewRole(admin.role);
                                  setShowRoleModal(true);
                                }}
                                className="w-8 h-8 flex items-center justify-center bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors cursor-pointer"
                                title="Change Role"
                                disabled={admin.id === adminUser?.id}
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              <button
                                onClick={() => handleToggleAdminStatus(admin.id, admin.is_active)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                  admin.is_active
                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                    : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                }`}
                                title={admin.is_active ? 'Deactivate' : 'Activate'}
                                disabled={admin.id === adminUser?.id}
                              >
                                <i className={admin.is_active ? 'ri-close-circle-line' : 'ri-check-line'}></i>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedAdmin(admin);
                                  setShowDeleteAdminModal(true);
                                }}
                                className="w-8 h-8 flex items-center justify-center bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors cursor-pointer"
                                title="Remove Admin"
                                disabled={admin.id === adminUser?.id}
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && isSuperAdmin && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#E8E0D5]">Audit Trail</h2>
                <p className="text-[#908070] text-sm mt-1">All admin actions are logged and tracked below</p>
              </div>
              <button
                onClick={loadAdminLogs}
                className="px-4 py-2 bg-[#D4A017]/10 text-[#D4A017] rounded-lg hover:bg-[#D4A017]/20 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-refresh-line"></i>
                Refresh
              </button>
            </div>

            <div className="bg-[#111108]/80 border border-[#B8860B]/20 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#B8860B]/20 bg-[#1a180f]/60">
                      <th className="text-left text-[#A09080] font-semibold py-3 px-4">Timestamp</th>
                      <th className="text-left text-[#A09080] font-semibold py-3 px-4">Admin</th>
                      <th className="text-left text-[#A09080] font-semibold py-3 px-4">Action</th>
                      <th className="text-left text-[#A09080] font-semibold py-3 px-4">Target</th>
                      <th className="text-left text-[#A09080] font-semibold py-3 px-4">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          No audit logs found.
                        </td>
                      </tr>
                    ) : (
                      adminLogs.map((log) => {
                        const actionInfo = getActionLabel(log.action);
                        const adminInfo = admins.find(a => a.id === log.admin_id);
                        return (
                          <tr key={log.id} className="border-b border-[#B8860B]/10 hover:bg-[#1a180f]/50 transition-colors">
                            <td className="py-3 px-4 text-[#908070] text-sm whitespace-nowrap">
                              {new Date(log.created_at).toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-[#E8E0D5] font-medium">
                                {adminInfo?.username || log.admin_id.slice(0, 8)}
                              </span>
                              {adminInfo?.is_super_admin && (
                                <i className="ri-vip-crown-line text-amber-400 ml-2 text-xs"></i>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-sm ${actionInfo.color} bg-current/10`}>
                                {actionInfo.label}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-[#908070] text-sm">
                              {log.target_table && log.target_id
                                ? `${log.target_table}: ${log.target_id.slice(0, 8)}`
                                : '-'}
                            </td>
                            <td className="py-3 px-4 text-[#908070] text-sm max-w-xs truncate">
                              {JSON.stringify(log.details).length > 60
                                ? JSON.stringify(log.details).slice(0, 60) + '...'
                                : JSON.stringify(log.details)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'verifications' && isSuperAdmin && <VerificationTab />}

        {showBanModal && selectedPlayer && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111108] border border-[#B8860B]/20 rounded-xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-[#E8E0D5] mb-6">Ban Player</h2>
              <p className="text-[#908070] mb-4">
                Are you sure you want to ban <span className="text-white font-semibold">{selectedPlayer.username}</span>?
              </p>
              <div className="mb-6">
                <label className="block text-[#A09080] font-semibold mb-2">Ban Reason</label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Enter reason for ban..."
                  className="w-full bg-[#0D0C07] border border-[#B8860B]/20 rounded-lg px-4 py-3 text-[#E8E0D5] placeholder-[#605040] focus:outline-none focus:border-red-500 h-24 resize-none"
                  maxLength={500}
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowBanModal(false);
                    setSelectedPlayer(null);
                    setBanReason('');
                  }}
                  className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBanPlayer}
                  disabled={!banReason}
                  className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                >
                  Ban Player
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resource Modal */}
        {showResourceModal && selectedPlayer && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-white mb-6">Give Resources</h2>
              <p className="text-gray-400 mb-4">
                Give resources to <span className="text-white font-semibold">{selectedPlayer.username}</span>
              </p>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[#A09080] font-semibold mb-2">Metal</label>
                  <input
                    type="number"
                    value={resourceAmount.metal}
                    onChange={(e) => setResourceAmount({ ...resourceAmount, metal: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#0D0C07] border border-[#B8860B]/20 rounded-lg px-4 py-3 text-[#E8E0D5] focus:outline-none focus:border-[#D4A017]"
                  />
                </div>
                <div>
                  <label className="block text-[#A09080] font-semibold mb-2">Crystal</label>
                  <input
                    type="number"
                    value={resourceAmount.crystal}
                    onChange={(e) => setResourceAmount({ ...resourceAmount, crystal: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#0D0C07] border border-[#B8860B]/20 rounded-lg px-4 py-3 text-[#E8E0D5] focus:outline-none focus:border-[#D4A017]"
                  />
                </div>
                <div>
                  <label className="block text-[#A09080] font-semibold mb-2">Deuterium</label>
                  <input
                    type="number"
                    value={resourceAmount.deuterium}
                    onChange={(e) => setResourceAmount({ ...resourceAmount, deuterium: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#0D0C07] border border-[#B8860B]/20 rounded-lg px-4 py-3 text-[#E8E0D5] focus:outline-none focus:border-[#D4A017]"
                  />
                </div>
                <div>
                  <label className="block text-[#A09080] font-semibold mb-2">Dark Matter</label>
                  <input
                    type="number"
                    value={resourceAmount.dark_matter}
                    onChange={(e) => setResourceAmount({ ...resourceAmount, dark_matter: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#0D0C07] border border-[#B8860B]/20 rounded-lg px-4 py-3 text-[#E8E0D5] focus:outline-none focus:border-[#D4A017]"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowResourceModal(false);
                    setSelectedPlayer(null);
                    setResourceAmount({ metal: 0, crystal: 0, deuterium: 0, dark_matter: 0 });
                  }}
                  className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGiveResources}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all whitespace-nowrap cursor-pointer"
                >
                  Give Resources
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Broadcast Modal */}
        {showBroadcastModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111108] border border-[#B8860B]/20 rounded-xl p-8 max-w-2xl w-full">
              <h2 className="text-2xl font-bold text-[#E8E0D5] mb-6">Broadcast Message to All Players</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[#A09080] font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    value={broadcastSubject}
                    onChange={(e) => setBroadcastSubject(e.target.value)}
                    placeholder="Message subject"
                    className="w-full bg-[#0D0C07] border border-[#B8860B]/20 rounded-lg px-4 py-3 text-[#E8E0D5] placeholder-[#605040] focus:outline-none focus:border-[#D4A017]"
                  />
                </div>
                <div>
                  <label className="block text-[#A09080] font-semibold mb-2">Message</label>
                  <textarea
                    value={broadcastContent}
                    onChange={(e) => setBroadcastContent(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full bg-[#0D0C07] border border-[#B8860B]/20 rounded-lg px-4 py-3 text-[#E8E0D5] placeholder-[#605040] focus:outline-none focus:border-[#D4A017] h-32 resize-none"
                    maxLength={500}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowBroadcastModal(false);
                    setBroadcastSubject('');
                    setBroadcastContent('');
                  }}
                  className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBroadcast}
                  disabled={!broadcastSubject || !broadcastContent}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-broadcast-line mr-2"></i>
                  Send to All Players
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Role Change Modal */}
        {showRoleModal && selectedAdmin && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-white mb-6">Change Admin Role</h2>
              <p className="text-gray-400 mb-6">
                Change role for <span className="text-white font-semibold">{selectedAdmin.username}</span>
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { value: 'moderator', label: 'Moderator', desc: 'Can manage players and view reports' },
                  { value: 'admin', label: 'Admin', desc: 'Full player + game management access' },
                  { value: 'super_admin', label: 'Super Admin', desc: 'Can manage other admins and access audit logs' },
                ].map((roleOption) => (
                  <button
                    key={roleOption.value}
                    onClick={() => setNewRole(roleOption.value)}
                    className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      newRole === roleOption.value
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-gray-700 bg-gray-900/30 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-semibold ${newRole === roleOption.value ? 'text-cyan-400' : 'text-white'}`}>
                          {roleOption.label}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">{roleOption.desc}</p>
                      </div>
                      {newRole === roleOption.value && (
                        <i className="ri-check-line text-cyan-400 text-xl"></i>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowRoleModal(false);
                    setSelectedAdmin(null);
                    setNewRole('moderator');
                  }}
                  className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateAdminRole}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-teal-600 transition-all whitespace-nowrap cursor-pointer"
                >
                  Update Role
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Admin Modal */}
        {showDeleteAdminModal && selectedAdmin && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 max-w-md w-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <i className="ri-delete-bin-line text-2xl text-red-400"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Remove Admin</h2>
                  <p className="text-gray-400 text-sm">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                Are you sure you want to permanently remove <span className="text-white font-semibold">{selectedAdmin.username}</span> from the admin team? Their admin privileges will be revoked immediately.
              </p>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-red-300 text-sm flex items-start gap-2">
                  <i className="ri-error-warning-line text-red-400 mt-0.5"></i>
                  The admin user record will be deleted. Their Supabase auth account remains — they can still log into the game as a regular player.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowDeleteAdminModal(false);
                    setSelectedAdmin(null);
                  }}
                  className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAdmin}
                  className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-orange-600 transition-all whitespace-nowrap cursor-pointer"
                >
                  Remove Admin
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}