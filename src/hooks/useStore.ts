import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StoreItem } from '../data/storeItems';

interface PlayerInventory {
  player_id: string;
  premium_currency: number;
  purchased_items: {
    item_id: string;
    quantity: number;
    purchased_at: string;
  }[];
  active_boosters: {
    booster_id: string;
    expires_at: string;
  }[];
}

export const useStore = () => {
  const [inventory, setInventory] = useState<PlayerInventory | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('player_inventory')
        .select('*')
        .eq('player_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading inventory:', error);
        return;
      }

      if (!data) {
        // Create inventory
        const { data: newInventory } = await supabase
          .from('player_inventory')
          .insert({
            player_id: user.id,
            premium_currency: 0,
            purchased_items: [],
            active_boosters: []
          })
          .select()
          .single();

        setInventory(newInventory || null);
      } else {
        setInventory(data);
      }
    } catch (error) {
      console.error('Error in loadInventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const purchaseItem = async (item: StoreItem): Promise<boolean> => {
    setPurchasing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !inventory) return false;

      // Check if player has enough currency
      const cost = item.price.premiumCurrency || 0;
      if (inventory.premium_currency < cost) {
        alert('Not enough premium currency!');
        return false;
      }

      // Check requirements
      if (item.requirements) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('level, rank')
          .eq('id', user.id)
          .maybeSingle();

        if (item.requirements.level && profile && (profile.level || 0) < item.requirements.level) {
          alert(`Requires level ${item.requirements.level}!`);
          return false;
        }
      }

      // Deduct currency and add item
      const newCurrency = inventory.premium_currency - cost;
      const purchasedItems = [...inventory.purchased_items];
      
      const existingItem = purchasedItems.find(i => i.item_id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        purchasedItems.push({
          item_id: item.id,
          quantity: 1,
          purchased_at: new Date().toISOString()
        });
      }

      // Update inventory
      const { error } = await supabase
        .from('player_inventory')
        .update({
          premium_currency: newCurrency,
          purchased_items: purchasedItems
        })
        .eq('player_id', user.id);

      if (error) throw error;

      // If it's a resource pack, add resources
      if (item.category === 'resource' && item.contents) {
        const { data: resources } = await supabase
          .from('player_resources')
          .select('*')
          .eq('player_id', user.id)
          .maybeSingle();

        if (resources) {
          const updates: any = {};
          item.contents.forEach((content: any) => {
            if (content.type === 'metal') updates.metal = (resources.metal || 0) + content.quantity;
            if (content.type === 'crystal') updates.crystal = (resources.crystal || 0) + content.quantity;
            if (content.type === 'deuterium') updates.deuterium = (resources.deuterium || 0) + content.quantity;
            if (content.type === 'darkMatter') updates.dark_matter = (resources.dark_matter || 0) + content.quantity;
            if (content.type === 'exoticMatter') updates.exotic_matter = (resources.exotic_matter || 0) + content.quantity;
          });

          await supabase
            .from('player_resources')
            .update(updates)
            .eq('player_id', user.id);
        }
      }

      // If it's a booster, activate it
      if (item.category === 'booster' && item.stats) {
        const activeBoosters = [...inventory.active_boosters];
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + item.stats.duration);
        
        activeBoosters.push({
          booster_id: item.id,
          expires_at: expiresAt.toISOString()
        });

        await supabase
          .from('player_inventory')
          .update({ active_boosters: activeBoosters })
          .eq('player_id', user.id);
      }

      await loadInventory();
      return true;
    } catch (error) {
      console.error('Error purchasing item:', error);
      return false;
    } finally {
      setPurchasing(false);
    }
  };

  const purchasePremiumCurrency = async (amount: number, _price: number): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !inventory) return false;

      // In a real app, this would integrate with payment processor
      // For now, just add the currency
      const newCurrency = inventory.premium_currency + amount;

      const { error } = await supabase
        .from('player_inventory')
        .update({ premium_currency: newCurrency })
        .eq('player_id', user.id);

      if (error) throw error;

      await loadInventory();
      return true;
    } catch (error) {
      console.error('Error purchasing currency:', error);
      return false;
    }
  };

  const getActiveBoosters = () => {
    if (!inventory) return [];
    
    const now = new Date();
    return inventory.active_boosters.filter(booster => {
      const expiresAt = new Date(booster.expires_at);
      return expiresAt > now;
    });
  };

  return {
    inventory,
    loading,
    purchasing,
    purchaseItem,
    purchasePremiumCurrency,
    getActiveBoosters,
    reloadInventory: loadInventory
  };
};
