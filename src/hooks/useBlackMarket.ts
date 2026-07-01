import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface BlackMarketItem {
  id: string;
  seller_id: string;
  item_type: 'ship' | 'technology' | 'officer' | 'artifact' | 'blueprint' | 'resource_pack';
  item_name: string;
  item_data: any;
  price_metal: number;
  price_crystal: number;
  price_deuterium: number;
  price_dark_matter: number;
  quantity: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  is_anonymous: boolean;
  expires_at: string;
  sold_at?: string;
  buyer_id?: string;
  created_at: string;
}

export const useBlackMarket = () => {
  const [items, setItems] = useState<BlackMarketItem[]>([]);
  const [myListings, setMyListings] = useState<BlackMarketItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('black_market_items')
        .select('*')
        .is('sold_at', null)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching black market items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyListings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('black_market_items')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyListings(data || []);
    } catch (error) {
      console.error('Error fetching my listings:', error);
    }
  };

  const createListing = async (
    itemType: string,
    itemName: string,
    itemData: any,
    priceMetal: number,
    priceCrystal: number,
    priceDeuterium: number,
    priceDarkMatter: number,
    quantity: number,
    rarity: string,
    isAnonymous: boolean,
    durationHours: number
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);

      const { data, error } = await supabase
        .from('black_market_items')
        .insert({
          seller_id: user.id,
          item_type: itemType,
          item_name: itemName,
          item_data: itemData,
          price_metal: priceMetal,
          price_crystal: priceCrystal,
          price_deuterium: priceDeuterium,
          price_dark_matter: priceDarkMatter,
          quantity,
          rarity,
          is_anonymous: isAnonymous,
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      await fetchItems();
      await fetchMyListings();
      return { success: true, listing: data };
    } catch (error) {
      console.error('Error creating listing:', error);
      return { success: false, error };
    }
  };

  const buyItem = async (itemId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: item } = await supabase
        .from('black_market_items')
        .select('*')
        .eq('id', itemId)
        .maybeSingle();

      if (!item) throw new Error('Item not found');
      if (item.sold_at) throw new Error('Item already sold');

      // Check if player has enough resources
      const { data: resources } = await supabase
        .from('player_resources')
        .select('*')
        .eq('player_id', user.id)
        .maybeSingle();

      if (!resources) throw new Error('Resources not found');

      if (
        resources.metal < item.price_metal ||
        resources.crystal < item.price_crystal ||
        resources.deuterium < item.price_deuterium ||
        (resources.dark_matter || 0) < item.price_dark_matter
      ) {
        throw new Error('Insufficient resources');
      }

      // Deduct resources from buyer
      await supabase.rpc('increment_resources', {
        p_player_id: user.id,
        p_metal: -item.price_metal,
        p_crystal: -item.price_crystal,
        p_deuterium: -item.price_deuterium,
      });

      // Add resources to seller
      await supabase.rpc('increment_resources', {
        p_player_id: item.seller_id,
        p_metal: item.price_metal,
        p_crystal: item.price_crystal,
        p_deuterium: item.price_deuterium,
      });

      // Mark item as sold
      const { error } = await supabase
        .from('black_market_items')
        .update({
          sold_at: new Date().toISOString(),
          buyer_id: user.id,
        })
        .eq('id', itemId);

      if (error) throw error;

      // Add item to buyer's inventory based on type
      if (item.item_type === 'artifact') {
        await supabase.from('artifacts').insert({
          player_id: user.id,
          artifact_name: item.item_name,
          artifact_type: item.item_data.type || 'special',
          rarity: item.rarity,
          level: item.item_data.level || 1,
          bonuses: item.item_data.bonuses || {},
          description: item.item_data.description || '',
        });
      }

      await fetchItems();
      return { success: true, item };
    } catch (error) {
      console.error('Error buying item:', error);
      return { success: false, error };
    }
  };

  const cancelListing = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('black_market_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      await fetchItems();
      await fetchMyListings();
      return { success: true };
    } catch (error) {
      console.error('Error canceling listing:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchItems();
    fetchMyListings();
  }, []);

  return {
    items,
    myListings,
    loading,
    createListing,
    buyItem,
    cancelListing,
    refreshItems: fetchItems,
  };
};
