import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface GameStats {
  totalPlayers: number;
  activePlayers: number;
  totalAlliances: number;
  totalShips: number;
  totalFleets: number;
  totalCombats: number;
}

interface Player {
  id: string;
  username: string;
  level: number;
  credits: number;
  faction: string;
  is_banned: boolean;
  created_at: string;
  last_login: string;
}

interface AdminUserData {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  role: string;
  is_super_admin: boolean;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

interface AdminLogEntry {
  id: number;
  admin_id: string;
  action: string;
  target_table: string | null;
  target_id: string | null;
  details: Record<string, any>;
  created_at: string;
}

export function useAdminPanel() {
  const [stats, setStats] = useState<GameStats>({
    totalPlayers: 0,
    activePlayers: 0,
    totalAlliances: 0,
    totalShips: 0,
    totalFleets: 0,
    totalCombats: 0,
  });
  const [players, setPlayers] = useState<Player[]>([]);
  const [admins, setAdmins] = useState<AdminUserData[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  useEffect(() => {
    loadStats();
    loadPlayers();
  }, []);

  const loadStats = async () => {
    setLoading(true);

    const [
      playersResult,
      alliancesResult,
      shipsResult,
      fleetsResult,
      combatsResult,
    ] = await Promise.all([
      supabase.from('players').select('id, last_login', { count: 'exact' }),
      supabase.from('alliances').select('id', { count: 'exact' }),
      supabase.from('ships').select('id', { count: 'exact' }),
      supabase.from('fleets').select('id', { count: 'exact' }),
      supabase.from('combat_logs').select('id', { count: 'exact' }),
    ]);

    // Calculate active players (logged in within last 24 hours)
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const activePlayers =
      playersResult.data?.filter(
        (p) => p.last_login && new Date(p.last_login) > oneDayAgo
      ).length || 0;

    setStats({
      totalPlayers: playersResult.count || 0,
      activePlayers,
      totalAlliances: alliancesResult.count || 0,
      totalShips: shipsResult.count || 0,
      totalFleets: fleetsResult.count || 0,
      totalCombats: combatsResult.count || 0,
    });

    setLoading(false);
  };

  const loadPlayers = async () => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (!error && data) {
      setPlayers(data);
    }
  };

  const loadAdmins = async () => {
    setAdminLoading(true);
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAdmins(data as AdminUserData[]);
    }
    setAdminLoading(false);
  };

  const loadAdminLogs = async () => {
    const { data, error } = await supabase
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (!error && data) {
      setAdminLogs(data as AdminLogEntry[]);
    }
  };

  const updateAdminRole = async (adminId: string, role: string) => {
    const { error } = await supabase
      .from('admin_users')
      .update({
        role,
        is_super_admin: role === 'super_admin',
      })
      .eq('id', adminId);

    if (!error) {
      await loadAdmins();
      await logAdminAction('update_admin_role', 'admin_users', adminId, { new_role: role });
    }

    return { success: !error, error };
  };

  const toggleAdminStatus = async (adminId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('admin_users')
      .update({ is_active: isActive })
      .eq('id', adminId);

    if (!error) {
      await loadAdmins();
      await logAdminAction('toggle_admin_status', 'admin_users', adminId, { is_active: isActive });
    }

    return { success: !error, error };
  };

  const deleteAdmin = async (adminId: string) => {
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', adminId);

    if (!error) {
      await loadAdmins();
      await logAdminAction('delete_admin', 'admin_users', adminId, {});
    }

    return { success: !error, error };
  };

  const logAdminAction = async (
    action: string,
    targetTable: string,
    targetId: string,
    details: Record<string, any>
  ) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    await supabase.from('admin_logs').insert({
      admin_id: session.user.id,
      action,
      target_table: targetTable,
      target_id: targetId,
      details,
    });
  };

  const banPlayer = async (playerId: string, reason: string) => {
    const { error } = await supabase
      .from('players')
      .update({ is_banned: true, ban_reason: reason })
      .eq('id', playerId);

    if (!error) {
      await loadPlayers();
    }

    return { success: !error, error };
  };

  const unbanPlayer = async (playerId: string) => {
    const { error } = await supabase
      .from('players')
      .update({ is_banned: false, ban_reason: null })
      .eq('id', playerId);

    if (!error) {
      await loadPlayers();
    }

    return { success: !error, error };
  };

  const giveResources = async (
    playerId: string,
    resources: {
      metal?: number;
      crystal?: number;
      deuterium?: number;
      dark_matter?: number;
    }
  ) => {
    const { data: currentResources } = await supabase
      .from('player_resources')
      .select('*')
      .eq('player_id', playerId)
      .maybeSingle();

    if (!currentResources) return { success: false };

    const { error } = await supabase
      .from('player_resources')
      .update({
        metal: (currentResources.metal || 0) + (resources.metal || 0),
        crystal: (currentResources.crystal || 0) + (resources.crystal || 0),
        deuterium: (currentResources.deuterium || 0) + (resources.deuterium || 0),
        dark_matter: (currentResources.dark_matter || 0) + (resources.dark_matter || 0),
      })
      .eq('player_id', playerId);

    return { success: !error, error };
  };

  const adjustPlayerLevel = async (playerId: string, newLevel: number) => {
    const { error } = await supabase
      .from('players')
      .update({ level: newLevel })
      .eq('id', playerId);

    if (!error) {
      await loadPlayers();
    }

    return { success: !error, error };
  };

  const deletePlayer = async (playerId: string) => {
    // This will cascade delete all related data
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', playerId);

    if (!error) {
      await loadPlayers();
      await loadStats();
    }

    return { success: !error, error };
  };

  const broadcastMessage = async (subject: string, content: string) => {
    const { data: allPlayers } = await supabase
      .from('players')
      .select('id');

    if (!allPlayers) return { success: false };

    const messages = allPlayers.map((player) => ({
      sender_id: '00000000-0000-0000-0000-000000000000', // System sender
      recipient_id: player.id,
      subject,
      content,
      is_read: false,
    }));

    const { error } = await supabase.from('messages').insert(messages);

    return { success: !error, error };
  };

  return {
    stats,
    players,
    admins,
    adminLogs,
    loading,
    adminLoading,
    loadStats,
    loadPlayers,
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
  };
}