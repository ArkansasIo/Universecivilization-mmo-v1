import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface LeaderboardEntry {
  id: string;
  empire_name: string;
  level: number;
  credits: number;
  total_ships?: number;
  battles_won?: number;
  rank: number;
}

export const useLeaderboard = () => {
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async () => {
    try {
      // Get all players with their stats from profiles table
      const { data: allProfiles, error: playersError } = await supabase
        .from('profiles')
        .select('id, username, level, experience')
        .order('level', { ascending: false })
        .limit(100);

      if (playersError) throw playersError;

      const profiles = allProfiles || [];

      // Get ship counts for each player
      const playerIds = profiles.map((p) => p.id);
      const { data: ships, error: shipsError } = await supabase
        .from('ships')
        .select('player_id, ship_type, quantity')
        .in('player_id', playerIds.length > 0 ? playerIds : ['00000000-0000-0000-0000-000000000000']);

      if (shipsError && shipsError.code !== 'PGRST116') {
        console.warn('Error fetching ships for leaderboard:', shipsError);
      }

      // Get battle stats
      const { data: combatLogs, error: battleError } = await supabase
        .from('combat_logs')
        .select('attacker_id, result')
        .in('attacker_id', playerIds.length > 0 ? playerIds : ['00000000-0000-0000-0000-000000000000']);

      if (battleError && battleError.code !== 'PGRST116') {
        console.warn('Error fetching battle stats for leaderboard:', battleError);
      }

      const safeShips = ships || [];
      const safeCombatLogs = combatLogs || [];

      // Calculate stats for each player
      const rankings: LeaderboardEntry[] = profiles.map((player, index) => {
        const playerShips = safeShips.filter((s) => s.player_id === player.id);
        const totalShips = playerShips.reduce((sum, s) => sum + (s.quantity || 0), 0);

        const playerBattles = safeCombatLogs.filter((c) => c.attacker_id === player.id);
        const battlesWon = playerBattles.filter((c) => c.result === 'victory').length;

        return {
          id: player.id,
          empire_name: player.username || 'Commander',
          level: player.level || 0,
          credits: 0,
          total_ships: totalShips,
          battles_won: battlesWon,
          rank: index + 1,
        };
      });

      setRankings(rankings);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get player rank
  const getPlayerRank = (playerId: string) => {
    const entry = rankings.find((r) => r.id === playerId);
    return entry?.rank || 0;
  };

  // Get top players
  const getTopPlayers = (count: number = 10) => {
    return rankings.slice(0, count);
  };

  useEffect(() => {
    fetchLeaderboard();

    // Refresh every 60 seconds
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  return {
    rankings,
    loading,
    getPlayerRank,
    getTopPlayers,
    refreshLeaderboard: fetchLeaderboard,
  };
};