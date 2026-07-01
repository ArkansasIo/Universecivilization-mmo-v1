import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Resources {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
  dark_matter: number;
  imperial_credits: number;
  republic_credits: number;
}

interface ResourceCost {
  metal: number;
  crystal: number;
  deuterium: number;
}

export function useResources() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resources>({
    metal: 0,
    crystal: 0,
    deuterium: 0,
    energy: 0,
    dark_matter: 0,
    imperial_credits: 0,
    republic_credits: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const subscriptionRef = useRef<any>(null);

  // Fetch resources
  const fetchResources = useCallback(async () => {
    if (!user || !mountedRef.current) return;

    try {
      // Try both user_id and player_id for compatibility
      let { data, error: fetchError } = await supabase
        .from('player_resources')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // If not found with user_id, try player_id
      if (!data && fetchError?.code === 'PGRST116') {
        const result = await supabase
          .from('player_resources')
          .select('*')
          .eq('player_id', user.id)
          .maybeSingle();
        
        data = result.data;
        fetchError = result.error;
      }

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (data && mountedRef.current) {
        setResources({
          metal: data.metal || 0,
          crystal: data.crystal || 0,
          deuterium: data.deuterium || 0,
          energy: data.energy || 0,
          dark_matter: data.dark_matter || 0,
          imperial_credits: data.imperial_credits || 10000,
          republic_credits: data.republic_credits || 5000
        });
        setError(null);
      } else if (!data && mountedRef.current) {
        // Initialize resources if they don't exist
        const { data: newData, error: insertError } = await supabase
          .from('player_resources')
          .insert({
            user_id: user.id,
            player_id: user.id,
            metal: 500,
            crystal: 300,
            deuterium: 100,
            energy: 0,
            dark_matter: 0,
            imperial_credits: 10000,
            republic_credits: 5000
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating resources:', insertError);
          // Set default values even if insert fails
          setResources({
            metal: 500,
            crystal: 300,
            deuterium: 100,
            energy: 0,
            dark_matter: 0,
            imperial_credits: 10000,
            republic_credits: 5000
          });
        } else if (newData && mountedRef.current) {
          setResources({
            metal: newData.metal || 0,
            crystal: newData.crystal || 0,
            deuterium: newData.deuterium || 0,
            energy: newData.energy || 0,
            dark_matter: newData.dark_matter || 0,
            imperial_credits: newData.imperial_credits || 10000,
            republic_credits: newData.republic_credits || 5000
          });
        }
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
      if (mountedRef.current) {
        setError('Failed to load resources');
        // Set default values on error
        setResources({
          metal: 500,
          crystal: 300,
          deuterium: 100,
          energy: 0,
          dark_matter: 0,
          imperial_credits: 10000,
          republic_credits: 5000
        });
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [user]);

  // Check if player can afford a cost
  const canAfford = useCallback((cost: ResourceCost): boolean => {
    return (
      resources.metal >= cost.metal &&
      resources.crystal >= cost.crystal &&
      resources.deuterium >= cost.deuterium
    );
  }, [resources]);

  // Deduct resources (with validation)
  const deductResources = useCallback(async (cost: ResourceCost): Promise<boolean> => {
    if (!user || !mountedRef.current) return false;

    if (!canAfford(cost)) {
      console.error('Cannot afford resources:', cost);
      return false;
    }

    try {
      // Try player_id first (RLS key), fall back to user_id
      let result = await supabase
        .from('player_resources')
        .update({
          metal: resources.metal - cost.metal,
          crystal: resources.crystal - cost.crystal,
          deuterium: resources.deuterium - cost.deuterium,
          updated_at: new Date().toISOString()
        })
        .eq('player_id', user.id)
        .select()
        .maybeSingle();

      // If no row matched by player_id, try user_id
      if (!result.data && !result.error) {
        result = await supabase
          .from('player_resources')
          .update({
            metal: resources.metal - cost.metal,
            crystal: resources.crystal - cost.crystal,
            deuterium: resources.deuterium - cost.deuterium,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .select()
          .maybeSingle();
      }

      if (result.error) throw result.error;

      if (result.data && mountedRef.current) {
        const d = result.data as any;
        setResources({
          metal: d.metal || 0,
          crystal: d.crystal || 0,
          deuterium: d.deuterium || 0,
          energy: d.energy || 0,
          dark_matter: d.dark_matter || 0,
          imperial_credits: d.imperial_credits || 0,
          republic_credits: d.republic_credits || 0
        });
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error deducting resources:', err);
      return false;
    }
  }, [user, resources, canAfford]);

  // Add resources
  const addResources = useCallback(async (amount: Partial<ResourceCost>): Promise<boolean> => {
    if (!user || !mountedRef.current) return false;

    try {
      let result = await supabase
        .from('player_resources')
        .update({
          metal: resources.metal + (amount.metal || 0),
          crystal: resources.crystal + (amount.crystal || 0),
          deuterium: resources.deuterium + (amount.deuterium || 0),
          updated_at: new Date().toISOString()
        })
        .eq('player_id', user.id)
        .select()
        .maybeSingle();

      if (!result.data && !result.error) {
        result = await supabase
          .from('player_resources')
          .update({
            metal: resources.metal + (amount.metal || 0),
            crystal: resources.crystal + (amount.crystal || 0),
            deuterium: resources.deuterium + (amount.deuterium || 0),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .select()
          .maybeSingle();
      }

      if (result.error) throw result.error;

      if (result.data && mountedRef.current) {
        const d = result.data as any;
        setResources({
          metal: d.metal || 0,
          crystal: d.crystal || 0,
          deuterium: d.deuterium || 0,
          energy: d.energy || 0,
          dark_matter: d.dark_matter || 0,
          imperial_credits: d.imperial_credits || 0,
          republic_credits: d.republic_credits || 0
        });
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error adding resources:', err);
      return false;
    }
  }, [user, resources]);

  // Set up real-time subscription
  useEffect(() => {
    mountedRef.current = true;

    if (!user) {
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchResources();

    // Set up real-time subscription
    subscriptionRef.current = supabase
      .channel(`resources-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'player_resources',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new && mountedRef.current) {
            const newData = payload.new as any;
            setResources({
              metal: newData.metal || 0,
              crystal: newData.crystal || 0,
              deuterium: newData.deuterium || 0,
              energy: newData.energy || 0,
              dark_matter: newData.dark_matter || 0,
              imperial_credits: newData.imperial_credits || 0,
              republic_credits: newData.republic_credits || 0
            });
          }
        }
      )
      .subscribe();

    return () => {
      mountedRef.current = false;
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, [user, fetchResources]);

  return {
    resources,
    loading,
    error,
    canAfford,
    deductResources,
    addResources,
    refetch: fetchResources
  };
}
