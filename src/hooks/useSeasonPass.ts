import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface SeasonPassTier {
  tier: number;
  experience_required: number;
  free_rewards: {
    type: string;
    value: number;
    name: string;
  }[];
  premium_rewards: {
    type: string;
    value: number;
    name: string;
  }[];
}

interface PlayerSeasonPass {
  current_tier: number;
  experience: number;
  is_premium: boolean;
  claimed_tiers: number[];
}

export function useSeasonPass() {
  const { user } = useAuth();
  const [seasonPass, setSeasonPass] = useState<PlayerSeasonPass>({
    current_tier: 1,
    experience: 0,
    is_premium: false,
    claimed_tiers: []
  });
  const [tiers, setTiers] = useState<SeasonPassTier[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSeasonPass = useCallback(async () => {
    if (!user) return;

    try {
      // Load player season pass data
      const { data: playerData, error: playerError } = await supabase
        .from('player_season_pass')
        .select('*')
        .eq('player_id', user.id)
        .maybeSingle();

      if (playerError && playerError.code !== 'PGRST116') throw playerError;

      if (playerData) {
        setSeasonPass({
          current_tier: playerData.current_tier || 1,
          experience: playerData.experience || 0,
          is_premium: playerData.is_premium || false,
          claimed_tiers: playerData.claimed_tiers || []
        });
      } else {
        // Create initial season pass entry
        await supabase.from('player_season_pass').insert({
          player_id: user.id,
          current_tier: 1,
          experience: 0,
          is_premium: false,
          claimed_tiers: []
        });
      }

      // Load tier rewards
      const { data: tierData, error: tierError } = await supabase
        .from('season_pass_rewards')
        .select('*')
        .order('tier', { ascending: true });

      if (tierError && tierError.code !== 'PGRST116') throw tierError;

      const tiersList: SeasonPassTier[] = (tierData || []).map(tier => ({
        tier: tier.tier,
        experience_required: tier.experience_required,
        free_rewards: tier.free_rewards || [],
        premium_rewards: tier.premium_rewards || []
      }));

      setTiers(tiersList);
    } catch (error) {
      console.error('Error loading season pass:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadSeasonPass();
  }, [loadSeasonPass]);

  const addExperience = async (amount: number) => {
    if (!user) return;

    try {
      const newExp = seasonPass.experience + amount;
      let newTier = seasonPass.current_tier;

      // Check for tier ups
      for (const tier of tiers) {
        if (newExp >= tier.experience_required && tier.tier > newTier) {
          newTier = tier.tier;
        }
      }

      await supabase
        .from('player_season_pass')
        .update({
          experience: newExp,
          current_tier: newTier
        })
        .eq('player_id', user.id);

      await loadSeasonPass();
    } catch (error) {
      console.error('Error adding season pass experience:', error);
    }
  };

  const claimReward = async (tier: number, isPremium: boolean) => {
    if (!user) return false;

    try {
      if (seasonPass.claimed_tiers.includes(tier)) {
        return false; // Already claimed
      }

      if (tier > seasonPass.current_tier) {
        return false; // Tier not reached
      }

      if (isPremium && !seasonPass.is_premium) {
        return false; // Not premium
      }

      const tierData = tiers.find(t => t.tier === tier);
      if (!tierData) return false;

      const rewards = isPremium ? tierData.premium_rewards : tierData.free_rewards;

      // Grant rewards
      for (const reward of rewards) {
        if (reward.type === 'metal' || reward.type === 'crystal' || reward.type === 'deuterium' || reward.type === 'dark_matter') {
          const { data: resources } = await supabase
            .from('player_resources')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (resources) {
            await supabase
              .from('player_resources')
              .update({
                [reward.type]: (resources[reward.type] || 0) + reward.value
              })
              .eq('user_id', user.id);
          }
        } else if (reward.type === 'item') {
          await supabase.from('player_inventory').insert({
            player_id: user.id,
            item_id: reward.name,
            quantity: reward.value
          });
        }
      }

      // Mark as claimed
      const newClaimedTiers = [...seasonPass.claimed_tiers, tier];
      await supabase
        .from('player_season_pass')
        .update({
          claimed_tiers: newClaimedTiers
        })
        .eq('player_id', user.id);

      await loadSeasonPass();
      return true;
    } catch (error) {
      console.error('Error claiming reward:', error);
      return false;
    }
  };

  const purchasePremium = async () => {
    if (!user) return false;

    try {
      // Deduct dark matter (cost: 1000)
      const { data: resources } = await supabase
        .from('player_resources')
        .select('dark_matter')
        .eq('user_id', user.id)
        .maybeSingle();

      const dm = resources?.dark_matter || 0;
      if (dm < 1000) {
        return false;
      }

      await supabase
        .from('player_resources')
        .update({
          dark_matter: dm - 1000
        })
        .eq('user_id', user.id);

      // Activate premium
      await supabase
        .from('player_season_pass')
        .update({
          is_premium: true
        })
        .eq('player_id', user.id);

      await loadSeasonPass();
      return true;
    } catch (error) {
      console.error('Error purchasing premium:', error);
      return false;
    }
  };

  return {
    seasonPass,
    tiers,
    loading,
    addExperience,
    claimReward,
    purchasePremium,
    reload: loadSeasonPass
  };
}