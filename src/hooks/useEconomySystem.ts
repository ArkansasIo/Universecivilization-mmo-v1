import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface MarketPrice {
  metal: number;
  crystal: number;
  deuterium: number;
  lastUpdate: string;
}

interface TradeOffer {
  id: string;
  seller_id: string;
  seller_name: string;
  resource_type: 'metal' | 'crystal' | 'deuterium';
  amount: number;
  price_per_unit: number;
  total_price: number;
  created_at: string;
  expires_at: string;
}

interface PlayerBalance {
  credits: number;
  darkMatter: number;
  reputation: number;
}

export function useEconomySystem() {
  const { user } = useAuth();
  const [marketPrices, setMarketPrices] = useState<MarketPrice>({
    metal: 1.0,
    crystal: 2.0,
    deuterium: 4.0,
    lastUpdate: new Date().toISOString()
  });
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>([]);
  const [playerBalance, setPlayerBalance] = useState<PlayerBalance>({
    credits: 0,
    darkMatter: 0,
    reputation: 0
  });
  const [loading, setLoading] = useState(true);

  // Dynamic market price calculation
  const updateMarketPrices = useCallback(() => {
    // Simulate market fluctuations (±10%)
    const fluctuation = () => 0.9 + Math.random() * 0.2;
    
    setMarketPrices(prev => ({
      metal: Math.max(0.5, prev.metal * fluctuation()),
      crystal: Math.max(1.0, prev.crystal * fluctuation()),
      deuterium: Math.max(2.0, prev.deuterium * fluctuation()),
      lastUpdate: new Date().toISOString()
    }));
  }, []);

  // Load player balance
  const loadPlayerBalance = useCallback(async () => {
    if (!user) return;

    try {
      const { data: resources } = await supabase
        .from('player_resources')
        .select('dark_matter')
        .eq('player_id', user.id)
        .maybeSingle();

      const { data: profile } = await supabase
        .from('profiles')
        .select('credits, reputation')
        .eq('id', user.id)
        .maybeSingle();

      setPlayerBalance({
        credits: profile?.credits || 0,
        darkMatter: resources?.dark_matter || 0,
        reputation: profile?.reputation || 0
      });
    } catch (error) {
      console.error('Error loading player balance:', error);
    }
  }, [user]);

  // Load active trade offers
  const loadTradeOffers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('trade_offers')
        .select(`
          *,
          profiles:seller_id (username)
        `)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const offers = data?.map(offer => ({
        id: offer.id,
        seller_id: offer.seller_id,
        seller_name: offer.profiles?.username || 'Unknown',
        resource_type: offer.resource_type,
        amount: offer.amount,
        price_per_unit: offer.price_per_unit,
        total_price: offer.total_price,
        created_at: offer.created_at,
        expires_at: offer.expires_at
      })) || [];

      setTradeOffers(offers);
    } catch (error) {
      console.error('Error loading trade offers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create trade offer
  const createTradeOffer = useCallback(async (
    resourceType: 'metal' | 'crystal' | 'deuterium',
    amount: number,
    pricePerUnit: number
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Check if player has enough resources
      const { data: resources } = await supabase
        .from('player_resources')
        .select(resourceType)
        .eq('player_id', user.id)
        .maybeSingle();

      if (!resources || resources[resourceType] < amount) {
        throw new Error('Insufficient resources');
      }

      // Deduct resources
      await supabase
        .from('player_resources')
        .update({
          [resourceType]: resources[resourceType] - amount
        })
        .eq('player_id', user.id);

      // Create offer (expires in 24 hours)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await supabase.from('trade_offers').insert({
        seller_id: user.id,
        resource_type: resourceType,
        amount,
        price_per_unit: pricePerUnit,
        total_price: amount * pricePerUnit,
        expires_at: expiresAt.toISOString()
      });

      await loadTradeOffers();
      return { success: true, message: 'Trade offer created successfully' };
    } catch (error) {
      console.error('Error creating trade offer:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Failed to create offer' };
    }
  }, [user, loadTradeOffers]);

  // Accept trade offer
  const acceptTradeOffer = useCallback(async (offerId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const offer = tradeOffers.find(o => o.id === offerId);
      if (!offer) throw new Error('Offer not found');

      // Check if buyer has enough credits
      if (playerBalance.credits < offer.total_price) {
        throw new Error('Insufficient credits');
      }

      // Transfer credits to seller
      const { data: sellerProfile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', offer.seller_id)
        .maybeSingle();

      if (sellerProfile) {
        await supabase
          .from('profiles')
          .update({
            credits: (sellerProfile.credits || 0) + offer.total_price
          })
          .eq('id', offer.seller_id);
      }

      // Deduct credits from buyer
      await supabase
        .from('profiles')
        .update({
          credits: playerBalance.credits - offer.total_price
        })
        .eq('id', user.id);

      // Transfer resources to buyer
      const { data: buyerResources } = await supabase
        .from('player_resources')
        .select(offer.resource_type)
        .eq('player_id', user.id)
        .maybeSingle();

      if (buyerResources) {
        await supabase
          .from('player_resources')
          .update({
            [offer.resource_type]: (buyerResources[offer.resource_type] || 0) + offer.amount
          })
          .eq('player_id', user.id);
      }

      // Delete offer
      await supabase
        .from('trade_offers')
        .delete()
        .eq('id', offerId);

      await loadTradeOffers();
      await loadPlayerBalance();

      return { success: true, message: 'Trade completed successfully' };
    } catch (error) {
      console.error('Error accepting trade offer:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Failed to complete trade' };
    }
  }, [user, tradeOffers, playerBalance, loadTradeOffers, loadPlayerBalance]);

  // Cancel trade offer
  const cancelTradeOffer = useCallback(async (offerId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const offer = tradeOffers.find(o => o.id === offerId);
      if (!offer) throw new Error('Offer not found');

      if (offer.seller_id !== user.id) {
        throw new Error('You can only cancel your own offers');
      }

      // Refund resources
      const { data: resources } = await supabase
        .from('player_resources')
        .select(offer.resource_type)
        .eq('player_id', user.id)
        .maybeSingle();

      if (resources) {
        await supabase
          .from('player_resources')
          .update({
            [offer.resource_type]: (resources[offer.resource_type] || 0) + offer.amount
          })
          .eq('player_id', user.id);
      }

      // Delete offer
      await supabase
        .from('trade_offers')
        .delete()
        .eq('id', offerId);

      await loadTradeOffers();
      return { success: true, message: 'Offer cancelled and resources refunded' };
    } catch (error) {
      console.error('Error cancelling trade offer:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Failed to cancel offer' };
    }
  }, [user, tradeOffers, loadTradeOffers]);

  // Convert resources to credits
  const sellResources = useCallback(async (
    resourceType: 'metal' | 'crystal' | 'deuterium',
    amount: number
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data: resources } = await supabase
        .from('player_resources')
        .select(resourceType)
        .eq('player_id', user.id)
        .maybeSingle();

      if (!resources || resources[resourceType] < amount) {
        throw new Error('Insufficient resources');
      }

      const creditsEarned = Math.floor(amount * marketPrices[resourceType]);

      // Deduct resources
      await supabase
        .from('player_resources')
        .update({
          [resourceType]: resources[resourceType] - amount
        })
        .eq('player_id', user.id);

      // Add credits
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .maybeSingle();

      await supabase
        .from('profiles')
        .update({
          credits: (profile?.credits || 0) + creditsEarned
        })
        .eq('id', user.id);

      await loadPlayerBalance();
      return { success: true, message: `Sold ${amount.toLocaleString()} ${resourceType} for ${creditsEarned.toLocaleString()} credits` };
    } catch (error) {
      console.error('Error selling resources:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Failed to sell resources' };
    }
  }, [user, marketPrices, loadPlayerBalance]);

  // Buy resources with credits
  const buyResources = useCallback(async (
    resourceType: 'metal' | 'crystal' | 'deuterium',
    amount: number
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const creditsCost = Math.floor(amount * marketPrices[resourceType] * 1.2); // 20% markup

      if (playerBalance.credits < creditsCost) {
        throw new Error('Insufficient credits');
      }

      // Deduct credits
      await supabase
        .from('profiles')
        .update({
          credits: playerBalance.credits - creditsCost
        })
        .eq('id', user.id);

      // Add resources
      const { data: resources } = await supabase
        .from('player_resources')
        .select(resourceType)
        .eq('player_id', user.id)
        .maybeSingle();

      if (resources) {
        await supabase
          .from('player_resources')
          .update({
            [resourceType]: (resources[resourceType] || 0) + amount
          })
          .eq('player_id', user.id);
      }

      await loadPlayerBalance();
      return { success: true, message: `Bought ${amount.toLocaleString()} ${resourceType} for ${creditsCost.toLocaleString()} credits` };
    } catch (error) {
      console.error('Error buying resources:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Failed to buy resources' };
    }
  }, [user, marketPrices, playerBalance, loadPlayerBalance]);

  useEffect(() => {
    if (user) {
      loadPlayerBalance();
      loadTradeOffers();
    }

    // Update market prices every 5 minutes
    const priceInterval = setInterval(updateMarketPrices, 300000);

    return () => clearInterval(priceInterval);
  }, [user, loadPlayerBalance, loadTradeOffers, updateMarketPrices]);

  return {
    marketPrices,
    tradeOffers,
    playerBalance,
    loading,
    createTradeOffer,
    acceptTradeOffer,
    cancelTradeOffer,
    sellResources,
    buyResources,
    refreshOffers: loadTradeOffers,
    refreshBalance: loadPlayerBalance
  };
}