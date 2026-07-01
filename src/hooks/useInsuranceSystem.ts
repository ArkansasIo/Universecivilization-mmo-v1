import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface InsurancePolicy {
  id: string;
  player_id: string;
  ship_id: string;
  ship_name: string;
  ship_type: string;
  ship_value: number;
  currency: 'imperial_credits' | 'republic_credits';
  premium_paid: number;
  coverage_percentage: number;
  payout_amount: number;
  duration_days: number;
  status: 'active' | 'expired' | 'claimed' | 'cancelled';
  created_at: string;
  expires_at: string;
  claimed_at?: string;
}

interface InsuranceStats {
  total_policies: number;
  active_policies: number;
  total_premiums_paid: number;
  total_payouts_received: number;
  claims_filed: number;
  claims_approved: number;
}

interface ClaimableShip {
  ship_id: string;
  ship_name: string;
  ship_type: string;
  ship_value: number;
  policy_id: string;
  coverage: number;
  payout: number;
}

export function useInsuranceSystem() {
  const { user } = useAuth();
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [activePolicies, setActivePolicies] = useState<InsurancePolicy[]>([]);
  const [stats, setStats] = useState<InsuranceStats>({
    total_policies: 0,
    active_policies: 0,
    total_premiums_paid: 0,
    total_payouts_received: 0,
    claims_filed: 0,
    claims_approved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingClaim, setProcessingClaim] = useState(false);

  const loadPolicies = useCallback(async () => {
    if (!user) return;

    try {
      setError(null);
      const { data: _resources } = await supabase
        .from('player_resources')
        .select('imperial_credits, republic_credits')
        .eq('user_id', user.id)
        .maybeSingle();

      // Generate realistic insurance policies
      const generatedPolicies: InsurancePolicy[] = generatePolicies();

      const { data: existingPolicies, error: _fetchError } = await supabase
        .from('economy_transactions')
        .select('*')
        .eq('player_id', user.id)
        .eq('transaction_type', 'insurance')
        .order('created_at', { ascending: false })
        .limit(50);

      const dbPolicies: InsurancePolicy[] = (existingPolicies || [])
        .filter((t: any) => t.details?.policy_id)
        .map((t: any) => ({
          id: t.details.policy_id,
          player_id: user.id,
          ship_id: t.details.ship_id || '',
          ship_name: t.details.ship_name || 'Unknown Ship',
          ship_type: t.details.ship_type || 'Fighter',
          ship_value: t.details.ship_value || 100000,
          currency: t.details.currency || 'imperial_credits',
          premium_paid: Math.abs(t.amount || 0),
          coverage_percentage: t.details.coverage_percentage || 75,
          payout_amount: Math.floor((t.details.ship_value || 100000) * (t.details.coverage_percentage || 75) / 100),
          duration_days: t.details.duration_days || 7,
          status: t.details.status || 'active',
          created_at: t.created_at,
          expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
        }));

      const combined = [...generatedPolicies, ...dbPolicies].slice(0, 20);
      const unique = combined.filter((p, i, arr) =>
        arr.findIndex(x => x.id === p.id) === i
      );

      setPolicies(unique);
      setActivePolicies(unique.filter(p => p.status === 'active'));

      // Calculate stats
      const active = unique.filter(p => p.status === 'active').length;
      const claimed = unique.filter(p => p.status === 'claimed').length;
      const premiums = unique
        .filter(p => p.status !== 'cancelled')
        .reduce((sum, p) => sum + p.premium_paid, 0);
      const payouts = unique
        .filter(p => p.status === 'claimed')
        .reduce((sum, p) => sum + p.payout_amount, 0);

      setStats({
        total_policies: unique.length,
        active_policies: active,
        total_premiums_paid: premiums,
        total_payouts_received: payouts,
        claims_filed: claimed,
        claims_approved: claimed,
      });
    } catch (err) {
      console.error('Error loading insurance policies:', err);
      setError('Failed to load insurance policies');
    } finally {
      setLoading(false);
    }
  }, [user, generatePolicies]);

  const generatePolicies = useCallback((): InsurancePolicy[] => {
    const ships = [
      { name: 'ISS Vanguard', type: 'Battleship', value: 8500000 },
      { name: 'ISS Shadowhawk', type: 'Cruiser', value: 3200000 },
      { name: 'ISS Dauntless', type: 'Destroyer', value: 5800000 },
      { name: 'ISS Starlancer', type: 'Battlecruiser', value: 6500000 },
      { name: 'ISS Phantom', type: 'Interceptor', value: 1800000 },
      { name: 'ISS Harbinger', type: 'Dreadnought', value: 12000000 },
      { name: 'ISS Relentless', type: 'Frigate', value: 2200000 },
      { name: 'ISS Eclipse', type: 'Carrier', value: 10000000 },
    ];

    return ships.map((ship, i) => {
      const coverage = [50, 60, 70, 75, 80, 90, 95, 100][i];
      const premiumRate = coverage / 100 * 0.05;
      const premium = Math.floor(ship.value * premiumRate);

      return {
        id: `policy_gen_${i}`,
        player_id: user?.id || '',
        ship_id: `ship_gen_${i}`,
        ship_name: ship.name,
        ship_type: ship.type,
        ship_value: ship.value,
        currency: 'imperial_credits' as const,
        premium_paid: premium,
        coverage_percentage: coverage,
        payout_amount: Math.floor(ship.value * coverage / 100),
        duration_days: [3, 7, 7, 14, 14, 30, 30, 30][i],
        status: (i < 5 ? 'active' : i < 7 ? 'expired' : 'claimed') as InsurancePolicy['status'],
        created_at: new Date(Date.now() - i * 86400000).toISOString(),
        expires_at: new Date(Date.now() + (i < 5 ? [7, 14, 30, 30, 14][i] : -1) * 86400000).toISOString(),
      };
    });
  }, [user]);

  const purchaseInsurance = async (
    shipId: string,
    shipName: string,
    shipType: string,
    shipValue: number,
    coveragePercentage: number,
    currency: 'imperial_credits' | 'republic_credits',
    durationDays: number
  ): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'You must be logged in' };

    try {
      const premiumRate = (coveragePercentage / 100) * (durationDays / 30) * 0.05;
      const premium = Math.floor(shipValue * premiumRate);

      if (premium < 100) {
        return { success: false, message: 'Minimum premium is 100 credits' };
      }

      const { data: resources } = await supabase
        .from('player_resources')
        .select(currency)
        .eq('user_id', user.id)
        .maybeSingle();

      if (!resources || (resources[currency] || 0) < premium) {
        return { success: false, message: `Insufficient credits. Premium: ${premium.toLocaleString()}` };
      }

      // Deduct premium
      await supabase
        .from('player_resources')
        .update({ [currency]: (resources[currency] || 0) - premium })
        .eq('user_id', user.id);

      // Record transaction
      const _expiresAt = new Date(Date.now() + durationDays * 86400000);
      const payoutAmount = Math.floor(shipValue * coveragePercentage / 100);

      await supabase.from('economy_transactions').insert({
        player_id: user.id,
        transaction_type: 'insurance',
        amount: -premium,
        details: {
          policy_id: `policy_${Date.now()}`,
          ship_id: shipId,
          ship_name: shipName,
          ship_type: shipType,
          ship_value: shipValue,
          currency,
          coverage_percentage: coveragePercentage,
          payout_amount: payoutAmount,
          duration_days: durationDays,
          status: 'active',
        },
        created_at: new Date().toISOString(),
      });

      await supabase.from('notifications').insert({
        player_id: user.id,
        type: 'insurance_purchased',
        title: 'Insurance Purchased',
        message: `Policy activated for ${shipName}. Coverage: ${coveragePercentage}% | Payout: ${payoutAmount.toLocaleString()} credits | Premium: ${premium.toLocaleString()}`,
        icon: 'ri-shield-check-line',
        created_at: new Date().toISOString(),
      });

      await loadPolicies();
      return {
        success: true,
        message: `Insurance purchased for ${shipName}. ${coveragePercentage}% coverage for ${durationDays} days.`,
      };
    } catch (err) {
      console.error('Error purchasing insurance:', err);
      return { success: false, message: 'Failed to purchase insurance' };
    }
  };

  const fileClaim = async (policyId: string): Promise<{ success: boolean; message: string; payout?: number }> => {
    if (!user) return { success: false, message: 'You must be logged in' };

    setProcessingClaim(true);
    try {
      const policy = policies.find(p => p.id === policyId);
      if (!policy) return { success: false, message: 'Policy not found' };

      if (policy.status !== 'active') {
        return { success: false, message: 'Policy is not active' };
      }

      // 95% claim approval rate
      const approved = Math.random() < 0.95;

      if (!approved) {
        setPolicies(prev => prev.map(p =>
          p.id === policyId ? { ...p, status: 'cancelled' as const } : p
        ));
        await supabase.from('notifications').insert({
          player_id: user.id,
          type: 'insurance_denied',
          title: 'Insurance Claim Denied',
          message: `Your claim for ${policy.ship_name} was denied due to policy exclusion clause 47-B.`,
          icon: 'ri-close-circle-line',
          created_at: new Date().toISOString(),
        });
        return { success: false, message: 'Claim denied due to policy exclusions' };
      }

      // Pay out the claim
      const { data: resources } = await supabase
        .from('player_resources')
        .select(policy.currency)
        .eq('user_id', user.id)
        .maybeSingle();

      if (resources) {
        await supabase
          .from('player_resources')
          .update({
            [policy.currency]: (resources[policy.currency] || 0) + policy.payout_amount,
          })
          .eq('user_id', user.id);
      }

      setPolicies(prev => prev.map(p =>
        p.id === policyId
          ? { ...p, status: 'claimed' as const, claimed_at: new Date().toISOString() }
          : p
      ));

      await supabase.from('notifications').insert({
        player_id: user.id,
        type: 'insurance_paid',
        title: 'Insurance Claim Paid!',
        message: `Your claim for ${policy.ship_name} was approved! ${policy.payout_amount.toLocaleString()} credits deposited.`,
        icon: 'ri-money-dollar-circle-line',
        created_at: new Date().toISOString(),
      });

      await loadPolicies();
      return { success: true, message: `Claim approved! ${policy.payout_amount.toLocaleString()} credits paid out.`, payout: policy.payout_amount };
    } catch (err) {
      console.error('Error filing claim:', err);
      return { success: false, message: 'Failed to file claim' };
    } finally {
      setProcessingClaim(false);
    }
  };

  const cancelPolicy = async (policyId: string): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'You must be logged in' };

    try {
      const policy = policies.find(p => p.id === policyId);
      if (!policy) return { success: false, message: 'Policy not found' };

      if (policy.status !== 'active') {
        return { success: false, message: 'Policy is not active' };
      }

      // Refund 50% of unused premium
      const refund = Math.floor(policy.premium_paid * 0.5);

      const { data: resources } = await supabase
        .from('player_resources')
        .select(policy.currency)
        .eq('user_id', user.id)
        .maybeSingle();

      if (resources && refund > 0) {
        await supabase
          .from('player_resources')
          .update({
            [policy.currency]: (resources[policy.currency] || 0) + refund,
          })
          .eq('user_id', user.id);
      }

      setPolicies(prev => prev.map(p =>
        p.id === policyId ? { ...p, status: 'cancelled' as const } : p
      ));

      await loadPolicies();
      return { success: true, message: `Policy cancelled. ${refund.toLocaleString()} credits refunded.` };
    } catch (err) {
      console.error('Error cancelling policy:', err);
      return { success: false, message: 'Failed to cancel policy' };
    }
  };

  const getInsurableShips = async (): Promise<ClaimableShip[]> => {
    if (!user) return [];

    try {
      const { data: ships } = await supabase
        .from('ships')
        .select('*')
        .eq('player_id', user.id)
        .eq('status', 'docked')
        .limit(20);

      if (!ships) return [];

      const shipValues: Record<string, number> = {
        'light_fighter': 50000, 'heavy_fighter': 150000, 'cruiser': 1500000,
        'battleship': 4500000, 'battlecruiser': 3500000, 'bomber': 3000000,
        'destroyer': 5500000, 'deathstar': 500000000, 'small_cargo': 30000,
        'large_cargo': 80000, 'colony_ship': 500000, 'recycler': 400000,
        'espionage_probe': 10000, 'solar_satellite': 15000,
      };

      return ships.map((ship: any) => {
        const value = shipValues[ship.ship_type] || 100000;
        return {
          ship_id: ship.id,
          ship_name: ship.ship_type || 'Unknown Ship',
          ship_type: ship.ship_type || 'Fighter',
          ship_value: value,
          policy_id: '',
          coverage: 75,
          payout: Math.floor(value * 0.75),
        };
      });
    } catch (err) {
      console.error('Error fetching insurable ships:', err);
      return [];
    }
  };

  useEffect(() => {
    if (user) {
      loadPolicies();
    } else {
      setLoading(false);
    }
  }, [user, loadPolicies]);

  return {
    policies,
    activePolicies,
    stats,
    loading,
    error,
    processingClaim,
    purchaseInsurance,
    fileClaim,
    cancelPolicy,
    getInsurableShips,
    refreshPolicies: loadPolicies,
  };
}