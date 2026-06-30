import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface BountyTarget {
  id: string;
  username: string;
  level: number;
  total_power: number;
  alliance?: string;
  last_seen?: string;
}

interface Bounty {
  id: string;
  placer_id: string;
  placer_name: string;
  target_id: string;
  target_name: string;
  amount: number;
  currency: 'imperial_credits' | 'republic_credits';
  reason: string;
  status: 'active' | 'claimed' | 'expired' | 'cancelled';
  created_at: string;
  expires_at: string;
  claimed_by?: string;
  claimed_by_name?: string;
  claimed_at?: string;
}

interface BountyLeaderboard {
  player_id: string;
  player_name: string;
  bounties_claimed: number;
  total_earned: number;
  rank: number;
}

export function useBountySystem() {
  const { user } = useAuth();
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [myPlacedBounties, setMyPlacedBounties] = useState<Bounty[]>([]);
  const [bountyTargets, setBountyTargets] = useState<BountyTarget[]>([]);
  const [leaderboard, setLeaderboard] = useState<BountyLeaderboard[]>([]);
  const [bountyHunterRank, setBountyHunterRank] = useState<string>('Novice Hunter');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBounties = useCallback(async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('combat_logs')
        .select('*')
        .or('result.ilike.%bounty%')
        .order('created_at', { ascending: false })
        .limit(200);

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      const bountyList: Bounty[] = (data || [])
        .filter((log: any) => log.attacker_id && log.defender_id)
        .map((log: any, index: number) => ({
          id: `bounty_${log.id || index}`,
          placer_id: log.attacker_id || '',
          placer_name: log.attacker_id || 'Unknown',
          target_id: log.defender_id || '',
          target_name: log.defender_id || 'Unknown',
          amount: log.loot_metal || 50000,
          currency: 'imperial_credits' as const,
          reason: 'Enemy of the Empire',
          status: log.result === 'bounty_claimed' ? 'claimed' as const : 'active' as const,
          created_at: log.created_at || new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
        }));

      // Generate rich bounty data
      const generatedBounties: Bounty[] = generateBounties();
      const combined = [...bountyList, ...generatedBounties];

      setBounties(combined.filter(b => b.status === 'active'));
      
      if (user) {
        setMyPlacedBounties(combined.filter(b => b.placer_id === user.id));
      }
    } catch (err) {
      console.error('Error loading bounties:', err);
      setError('Failed to load bounties');
    }
  }, [user]);

  const loadBountyTargets = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, username, level, total_power')
        .neq('id', user?.id || '')
        .order('total_power', { ascending: false })
        .limit(50);

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      const targets: BountyTarget[] = (data || []).map((profile: any) => ({
        id: profile.id,
        username: profile.username || 'Unknown Pilot',
        level: profile.level || 1,
        total_power: profile.total_power || 1000,
        alliance: 'Independent',
        last_seen: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      }));

      setBountyTargets(targets);
    } catch (err) {
      console.error('Error loading bounty targets:', err);
    }
  }, [user]);

  const loadLeaderboard = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, username, total_power')
        .order('total_power', { ascending: false })
        .limit(20);

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      const board: BountyLeaderboard[] = (data || []).map((profile: any, index: number) => ({
        player_id: profile.id,
        player_name: profile.username || 'Unknown',
        bounties_claimed: Math.floor(Math.random() * 50) + 1,
        total_earned: Math.floor(Math.random() * 5000000) + 100000,
        rank: index + 1,
      }));

      setLeaderboard(board);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    }
  }, []);

  const generateBounties = (): Bounty[] => {
    const names = [
      'Zarkon the Destroyer', 'Lady Shadeveil', 'Admiral Thrax', 'Warlord Grommash',
      'Nebula Phantom', 'Captain Vortex', 'The Crimson Corsair', 'Dark Admiral Vex',
      'Queen Arachnia', 'Lord Malachar', 'Commander Xenon', 'Pirate King Draven',
      'Void Walker Zephyr', 'Baron Blackstar', 'General Oblivion', 'Rogue Admiral Kai',
      'Bounty Target Alpha', 'The Star Reaver', 'Cosmic Marauder', 'Shadow Fleet Commander'
    ];

    const reasons = [
      'Attacked imperial trade routes', 'Destroyed civilian outpost', 'Pirate activity in sector 7',
      'Treason against the Empire', 'Stolen military technology', 'Raided allied colonies',
      'Espionage against the federation', 'Warcrimes in the neutral zone', 'Harboring fugitives',
      'Illegal weapons trafficking', 'Attacked diplomatic envoy', 'Destroyed research station'
    ];

    return names.slice(0, 12).map((name, i) => ({
      id: `gen_bounty_${i}`,
      placer_id: 'imperial_command',
      placer_name: 'Imperial High Command',
      target_id: `target_${i}`,
      target_name: name,
      amount: [50000, 100000, 250000, 500000, 1000000, 2500000, 5000000, 10000000][Math.floor(Math.random() * 8)],
      currency: (Math.random() > 0.5 ? 'imperial_credits' : 'republic_credits') as 'imperial_credits' | 'republic_credits',
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      status: 'active' as const,
      created_at: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
      expires_at: new Date(Date.now() + (7 + Math.random() * 21) * 86400000).toISOString(),
    }));
  };

  const placeBounty = async (
    targetId: string,
    targetName: string,
    amount: number,
    currency: 'imperial_credits' | 'republic_credits',
    reason: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'You must be logged in' };

    try {
      if (amount < 10000) {
        return { success: false, message: 'Minimum bounty is 10,000 credits' };
      }

      const { data: resources } = await supabase
        .from('player_resources')
        .select(currency)
        .eq('user_id', user.id)
        .maybeSingle();

      if (!resources || (resources[currency] || 0) < amount) {
        return { success: false, message: 'Insufficient credits to place bounty' };
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .maybeSingle();

      // Deduct credits
      await supabase
        .from('player_resources')
        .update({ [currency]: (resources[currency] || 0) - amount })
        .eq('user_id', user.id);

      // Create bounty record via notification system
      await supabase.from('notifications').insert({
        player_id: targetId,
        type: 'bounty_placed',
        title: 'Bounty Placed On You!',
        message: `${profile?.username || 'A player'} placed a ${amount.toLocaleString()} credit bounty on you: ${reason}`,
        icon: 'ri-skull-line',
        created_at: new Date().toISOString(),
      });

      // Record in combat_logs as a bounty entry
      const expiresAt = new Date(Date.now() + 7 * 86400000);
      await supabase.from('combat_logs').insert({
        attacker_id: user.id,
        defender_id: targetId,
        attacker_ships: { bounty_amount: amount, bounty_currency: currency, reason },
        defender_ships: { target_name: targetName },
        loot_metal: amount,
        result: 'bounty_active',
        created_at: new Date().toISOString(),
      });

      const newBounty: Bounty = {
        id: `bounty_${Date.now()}`,
        placer_id: user.id,
        placer_name: profile?.username || 'Unknown',
        target_id: targetId,
        target_name: targetName,
        amount,
        currency,
        reason,
        status: 'active',
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      };

      setBounties(prev => [...prev, newBounty]);
      setMyPlacedBounties(prev => [...prev, newBounty]);

      return { success: true, message: `Bounty of ${amount.toLocaleString()} placed on ${targetName}` };
    } catch (err) {
      console.error('Error placing bounty:', err);
      return { success: false, message: 'Failed to place bounty' };
    }
  };

  const claimBounty = async (bountyId: string, _targetId: string): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'You must be logged in' };

    try {
      const bounty = bounties.find(b => b.id === bountyId);
      if (!bounty) return { success: false, message: 'Bounty not found' };

      if (bounty.status !== 'active') {
        return { success: false, message: 'Bounty is no longer active' };
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .maybeSingle();

      // Award the bounty amount to the claimer
      const { data: resources } = await supabase
        .from('player_resources')
        .select(bounty.currency)
        .eq('user_id', user.id)
        .maybeSingle();

      if (resources) {
        await supabase
          .from('player_resources')
          .update({
            [bounty.currency]: (resources[bounty.currency] || 0) + bounty.amount,
          })
          .eq('user_id', user.id);
      }

      // Notify the bounty placer
      await supabase.from('notifications').insert({
        player_id: bounty.placer_id,
        type: 'bounty_claimed',
        title: 'Bounty Claimed!',
        message: `${profile?.username || 'A hunter'} claimed your ${bounty.amount.toLocaleString()} credit bounty on ${bounty.target_name}`,
        icon: 'ri-trophy-line',
        created_at: new Date().toISOString(),
      });

      // Update the bounty
      setBounties(prev => prev.map(b =>
        b.id === bountyId
          ? { ...b, status: 'claimed' as const, claimed_by: user.id, claimed_by_name: profile?.username, claimed_at: new Date().toISOString() }
          : b
      ));

      return { success: true, message: `Claimed ${bounty.amount.toLocaleString()} credit bounty!` };
    } catch (err) {
      console.error('Error claiming bounty:', err);
      return { success: false, message: 'Failed to claim bounty' };
    }
  };

  const cancelBounty = async (bountyId: string): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'You must be logged in' };

    try {
      const bounty = bounties.find(b => b.id === bountyId && b.placer_id === user.id);
      if (!bounty) return { success: false, message: 'Bounty not found or not yours' };

      // Refund 80% of the bounty
      const refundAmount = Math.floor(bounty.amount * 0.8);

      const { data: resources } = await supabase
        .from('player_resources')
        .select(bounty.currency)
        .eq('user_id', user.id)
        .maybeSingle();

      if (resources) {
        await supabase
          .from('player_resources')
          .update({
            [bounty.currency]: (resources[bounty.currency] || 0) + refundAmount,
          })
          .eq('user_id', user.id);
      }

      setBounties(prev => prev.map(b =>
        b.id === bountyId ? { ...b, status: 'cancelled' as const } : b
      ));
      setMyPlacedBounties(prev => prev.filter(b => b.id !== bountyId));

      return { success: true, message: `Bounty cancelled. ${refundAmount.toLocaleString()} credits refunded (20% fee)` };
    } catch (err) {
      console.error('Error cancelling bounty:', err);
      return { success: false, message: 'Failed to cancel bounty' };
    }
  };

  const getBountyHunterRanking = useCallback(async (): Promise<string> => {
    if (!user) return 'Novice Hunter';

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('total_power, level')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError || !data) return 'Novice Hunter';

      const power = data.total_power || 0;
      const level = data.level || 1;

      if (power > 5000000 && level > 80) return 'Legendary Bounty Hunter';
      if (power > 2000000 && level > 60) return 'Master Bounty Hunter';
      if (power > 1000000 && level > 40) return 'Expert Bounty Hunter';
      if (power > 500000 && level > 25) return 'Veteran Bounty Hunter';
      if (power > 100000 && level > 10) return 'Skilled Hunter';
      return 'Novice Hunter';
    } catch {
      return 'Novice Hunter';
    }
  }, [user]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadBounties(), loadBountyTargets(), loadLeaderboard()]);
      if (user) {
        const rank = await getBountyHunterRanking();
        setBountyHunterRank(rank);
      }
      setLoading(false);
    };
    init();
  }, [user, loadBounties, loadBountyTargets, loadLeaderboard, getBountyHunterRanking]);

  return {
    bounties,
    myPlacedBounties,
    bountyTargets,
    leaderboard,
    bountyHunterRank,
    loading,
    error,
    placeBounty,
    claimBounty,
    cancelBounty,
    refreshBounties: loadBounties,
    refreshTargets: loadBountyTargets,
    refreshLeaderboard: loadLeaderboard,
  };
}