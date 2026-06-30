import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface MarketplaceListing {
  id: string;
  seller_id: string;
  seller_name?: string;
  resource_type: string;
  quantity: number;
  price_per_unit: number;
  total_price: number;
  currency: string;
  status: string;
  created_at: string;
  expires_at?: string;
}

export const useMarketplace = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [myListings, setMyListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingTrade, setProcessingTrade] = useState(false);

  // Fetch all listings
  const fetchListings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setListings(data || []);

      if (user) {
        const mine = (data || []).filter((l: any) => l.seller_id === user.id);
        setMyListings(mine);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create listing
  const createListing = async (
    resourceType: string,
    quantity: number,
    pricePerUnit: number,
    currency: 'imperial_credits' | 'republic_credits' = 'imperial_credits',
    expiresInDays: number = 7
  ) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const totalPrice = Math.floor(pricePerUnit * quantity);
      const expiresAt = new Date(Date.now() + expiresInDays * 86400000).toISOString();

      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .maybeSingle();

      const { data, error } = await supabase
        .from('marketplace_listings')
        .insert({
          seller_id: user.id,
          seller_name: profile?.username || 'Unknown',
          resource_type: resourceType,
          quantity: quantity,
          price_per_unit: pricePerUnit,
          total_price: totalPrice,
          currency: currency,
          status: 'active',
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchListings();
      return { success: true, data };
    } catch (error: any) {
      console.error('Error creating listing:', error);
      return { success: false, error: error.message };
    }
  };

  // ── Server-side marketplace trade via edge function ─────────────────
  const buyItem = async (listingId: string, quantity?: number) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    setProcessingTrade(true);

    try {
      const { data, error } = await supabase.functions.invoke('process-marketplace-trade', {
        body: {
          listing_id: Number(listingId),
          quantity: quantity,
        },
      });

      if (error) {
        return { success: false, error: error.message || 'Trade failed' };
      }

      await fetchListings();
      return { success: true, data };
    } catch (error: any) {
      console.error('Error buying item:', error);
      return { success: false, error: error.message || 'Trade failed' };
    } finally {
      setProcessingTrade(false);
    }
  };

  // Cancel listing
  const cancelListing = async (listingId: string) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('marketplace_listings')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', listingId)
        .eq('seller_id', user.id);

      if (error) throw error;

      await fetchListings();
      return { success: true };
    } catch (error: any) {
      console.error('Error canceling listing:', error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return {
    listings,
    myListings,
    loading,
    processingTrade,
    createListing,
    buyItem,
    cancelListing,
    refreshListings: fetchListings,
  };
};