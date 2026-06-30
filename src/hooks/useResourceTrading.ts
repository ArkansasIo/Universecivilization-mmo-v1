import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface TradeOffer {
  id: string;
  sellerId: string;
  sellerName: string;
  resourceType: string;
  amount: number;
  pricePerUnit: number;
  totalPrice: number;
  currency: 'credits' | 'dark_matter' | 'exotic_matter';
  status: 'active' | 'completed' | 'cancelled';
  expiresAt: Date;
  createdAt: Date;
}

export interface TradeHistory {
  id: string;
  buyerId: string;
  sellerId: string;
  resourceType: string;
  amount: number;
  price: number;
  currency: string;
  completedAt: Date;
}

export interface MarketPrice {
  resourceType: string;
  averagePrice: number;
  lowestPrice: number;
  highestPrice: number;
  volume24h: number;
  priceChange24h: number;
}

export const useResourceTrading = (playerId: string) => {
  const [myOffers, setMyOffers] = useState<TradeOffer[]>([]);
  const [marketOffers, setMarketOffers] = useState<TradeOffer[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([]);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);

  // Resource types available for trading
  const tradableResources = [
    'metal', 'crystal', 'deuterium', 'dark_matter', 'exotic_matter',
    'antimatter', 'nanites', 'plasma', 'food', 'water', 'oxygen', 'energy',
    // Crafting materials
    'steel_alloy', 'titanium_alloy', 'durasteel', 'quantum_steel',
    'energy_crystal', 'plasma_core', 'fusion_core', 'antimatter_cell',
    'quantum_crystal', 'dark_matter_core', 'cosmic_essence', 'temporal_fragment',
    'void_essence', 'stellar_plasma', 'quantum_foam', 'living_metal',
    'chrono_dust', 'psionic_crystal', 'graviton_particle', 'dimensional_shard',
    'zero_point_energy', 'neutrino_mesh', 'primordial_essence', 'omega_matter',
    'consciousness_matrix', 'reality_code', 'infinity_stone'
  ];

  // Load market data
  const loadMarketData = async () => {
    try {
      setLoading(true);

      // Load my offers
      const { data: myOffersData } = await supabase
        .from('resource_trades')
        .select('*')
        .eq('seller_id', playerId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (myOffersData) {
        setMyOffers(myOffersData.map(offer => ({
          id: offer.id,
          sellerId: offer.seller_id,
          sellerName: offer.seller_name,
          resourceType: offer.resource_type,
          amount: offer.amount,
          pricePerUnit: offer.price_per_unit,
          totalPrice: offer.total_price,
          currency: offer.currency,
          status: offer.status,
          expiresAt: new Date(offer.expires_at),
          createdAt: new Date(offer.created_at)
        })));
      }

      // Load market offers (excluding my own)
      const { data: marketOffersData } = await supabase
        .from('resource_trades')
        .select('*')
        .neq('seller_id', playerId)
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString())
        .order('price_per_unit', { ascending: true })
        .limit(100);

      if (marketOffersData) {
        setMarketOffers(marketOffersData.map(offer => ({
          id: offer.id,
          sellerId: offer.seller_id,
          sellerName: offer.seller_name,
          resourceType: offer.resource_type,
          amount: offer.amount,
          pricePerUnit: offer.price_per_unit,
          totalPrice: offer.total_price,
          currency: offer.currency,
          status: offer.status,
          expiresAt: new Date(offer.expires_at),
          createdAt: new Date(offer.created_at)
        })));
      }

      // Load trade history
      const { data: historyData } = await supabase
        .from('trade_history')
        .select('*')
        .or(`buyer_id.eq.${playerId},seller_id.eq.${playerId}`)
        .order('completed_at', { ascending: false })
        .limit(50);

      if (historyData) {
        setTradeHistory(historyData.map(trade => ({
          id: trade.id,
          buyerId: trade.buyer_id,
          sellerId: trade.seller_id,
          resourceType: trade.resource_type,
          amount: trade.amount,
          price: trade.price,
          currency: trade.currency,
          completedAt: new Date(trade.completed_at)
        })));
      }

      // Calculate market prices
      await calculateMarketPrices();

    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate market prices for all resources
  const calculateMarketPrices = async () => {
    try {
      const prices: MarketPrice[] = [];

      for (const resource of tradableResources) {
        // Get active offers for this resource
        const { data: offers } = await supabase
          .from('resource_trades')
          .select('price_per_unit, amount')
          .eq('resource_type', resource)
          .eq('status', 'active')
          .eq('currency', 'credits');

        // Get 24h trade history
        const yesterday = new Date();
        yesterday.setHours(yesterday.getHours() - 24);
        
        const { data: history } = await supabase
          .from('trade_history')
          .select('price, amount')
          .eq('resource_type', resource)
          .eq('currency', 'credits')
          .gte('completed_at', yesterday.toISOString());

        if (offers && offers.length > 0) {
          const prices_list = offers.map(o => o.price_per_unit);
          const avgPrice = prices_list.reduce((a, b) => a + b, 0) / prices_list.length;
          const lowestPrice = Math.min(...prices_list);
          const highestPrice = Math.max(...prices_list);
          
          const volume24h = history?.reduce((sum, t) => sum + t.amount, 0) || 0;
          
          // Calculate price change (simplified)
          const oldAvg = history && history.length > 0 
            ? history.reduce((sum, t) => sum + t.price, 0) / history.length 
            : avgPrice;
          const priceChange = ((avgPrice - oldAvg) / oldAvg) * 100;

          prices.push({
            resourceType: resource,
            averagePrice: Math.round(avgPrice),
            lowestPrice: Math.round(lowestPrice),
            highestPrice: Math.round(highestPrice),
            volume24h,
            priceChange24h: Math.round(priceChange * 10) / 10
          });
        }
      }

      setMarketPrices(prices);
    } catch (error) {
      console.error('Error calculating market prices:', error);
    }
  };

  // Create a new trade offer
  const createOffer = async (
    resourceType: string,
    amount: number,
    pricePerUnit: number,
    currency: 'credits' | 'dark_matter' | 'exotic_matter',
    durationHours: number = 24
  ) => {
    try {
      // Check if player has enough resources
      const { data: resources } = await supabase
        .from('player_resources')
        .select(resourceType)
        .eq('player_id', playerId)
        .maybeSingle();

      if (!resources || resources[resourceType] < amount) {
        throw new Error('Insufficient resources');
      }

      // Get player name
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', playerId)
        .maybeSingle();

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + durationHours);

      // Create offer
      const { data, error } = await supabase
        .from('resource_trades')
        .insert({
          seller_id: playerId,
          seller_name: profile?.username || 'Unknown',
          resource_type: resourceType,
          amount,
          price_per_unit: pricePerUnit,
          total_price: amount * pricePerUnit,
          currency,
          status: 'active',
          expires_at: expiresAt.toISOString()
        })
        .select()
        .maybeSingle();

      if (error) throw error;

      // Deduct resources from player
      await supabase
        .from('player_resources')
        .update({ [resourceType]: resources[resourceType] - amount })
        .eq('player_id', playerId);

      await loadMarketData();
      return { success: true, offerId: data?.id };
    } catch (error) {
      console.error('Error creating offer:', error);
      return { success: false, error: error.message };
    }
  };

  // Buy a trade offer
  const buyOffer = async (offerId: string) => {
    try {
      // Get offer details
      const { data: offer } = await supabase
        .from('resource_trades')
        .select('*')
        .eq('id', offerId)
        .maybeSingle();

      if (!offer || offer.status !== 'active') {
        throw new Error('Offer not available');
      }

      // Check if buyer has enough currency
      const { data: buyerResources } = await supabase
        .from('player_resources')
        .select('*')
        .eq('player_id', playerId)
        .maybeSingle();

      const currencyField = offer.currency === 'credits' ? 'credits' : offer.currency;
      if (!buyerResources || buyerResources[currencyField] < offer.total_price) {
        throw new Error('Insufficient funds');
      }

      // Get seller resources
      const { data: sellerResources } = await supabase
        .from('player_resources')
        .select('*')
        .eq('player_id', offer.seller_id)
        .maybeSingle();

      // Execute trade
      // 1. Update offer status
      await supabase
        .from('resource_trades')
        .update({ status: 'completed' })
        .eq('id', offerId);

      // 2. Transfer resources to buyer
      const buyerExisting = buyerResources?.[offer.resource_type] || 0;
      await supabase
        .from('player_resources')
        .update({
          [offer.resource_type]: buyerExisting + offer.amount,
          [currencyField]: buyerResources[currencyField] - offer.total_price
        })
        .eq('player_id', playerId);

      // 3. Transfer currency to seller
      const sellerExisting = sellerResources?.[currencyField] || 0;
      if (sellerResources) {
        await supabase
          .from('player_resources')
          .update({
            [currencyField]: sellerExisting + offer.total_price
          })
          .eq('player_id', offer.seller_id);
      }

      // 4. Record trade history
      await supabase
        .from('trade_history')
        .insert({
          buyer_id: playerId,
          seller_id: offer.seller_id,
          resource_type: offer.resource_type,
          amount: offer.amount,
          price: offer.total_price,
          currency: offer.currency,
          completed_at: new Date().toISOString()
        });

      await loadMarketData();
      return { success: true };
    } catch (error) {
      console.error('Error buying offer:', error);
      return { success: false, error: error.message };
    }
  };

  // Cancel an offer
  const cancelOffer = async (offerId: string) => {
    try {
      // Get offer details
      const { data: offer } = await supabase
        .from('resource_trades')
        .select('*')
        .eq('id', offerId)
        .eq('seller_id', playerId)
        .maybeSingle();

      if (!offer) {
        throw new Error('Offer not found');
      }

      // Update offer status
      await supabase
        .from('resource_trades')
        .update({ status: 'cancelled' })
        .eq('id', offerId);

      // Return resources to seller
      const { data: resources } = await supabase
        .from('player_resources')
        .select(offer.resource_type)
        .eq('player_id', playerId)
        .maybeSingle();

      const existing = resources?.[offer.resource_type] || 0;
      await supabase
        .from('player_resources')
        .update({
          [offer.resource_type]: existing + offer.amount
        })
        .eq('player_id', playerId);

      await loadMarketData();
      return { success: true };
    } catch (error) {
      console.error('Error cancelling offer:', error);
      return { success: false, error: error.message };
    }
  };

  // Get market price for a resource
  const getMarketPrice = (resourceType: string): MarketPrice | null => {
    return marketPrices.find(p => p.resourceType === resourceType) || null;
  };

  // Get offers for a specific resource
  const getResourceOffers = (resourceType: string): TradeOffer[] => {
    return marketOffers.filter(o => o.resourceType === resourceType);
  };

  useEffect(() => {
    if (playerId) {
      loadMarketData();
      
      // Refresh every 30 seconds
      const interval = setInterval(loadMarketData, 30000);
      return () => clearInterval(interval);
    }
  }, [playerId]);

  return {
    myOffers,
    marketOffers,
    tradeHistory,
    marketPrices,
    tradableResources,
    loading,
    createOffer,
    buyOffer,
    cancelOffer,
    getMarketPrice,
    getResourceOffers,
    refreshMarket: loadMarketData
  };
};
