import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface ShipProductionItem {
  id: string;
  ship_type: string;
  quantity: number;
  produced: number;
  start_time: string;
  end_time: string;
  time_per_ship: number;
}

export const useShipProduction = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState<ShipProductionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch production queue
  const fetchQueue = useCallback(async () => {
    if (!user) return;

    try {
      // For now, use local state since we don't have a ship_production table
      // In production, you'd query from database
      const stored = localStorage.getItem(`ship_production_${user.id}`);
      if (stored) {
        const data = JSON.parse(stored);
        setQueue(data);
      }
    } catch (error) {
      console.error('Error fetching ship production:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Add ships to production queue
  const addToQueue = async (
    shipType: string,
    quantity: number,
    timePerShip: number
  ) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const now = new Date();
      const totalTime = timePerShip * quantity;
      const endTime = new Date(now.getTime() + totalTime * 1000);

      const newItem: ShipProductionItem = {
        id: `prod_${Date.now()}`,
        ship_type: shipType,
        quantity: quantity,
        produced: 0,
        start_time: now.toISOString(),
        end_time: endTime.toISOString(),
        time_per_ship: timePerShip,
      };

      const newQueue = [...queue, newItem];
      setQueue(newQueue);
      localStorage.setItem(`ship_production_${user.id}`, JSON.stringify(newQueue));

      return { success: true, data: newItem };
    } catch (error: any) {
      console.error('Error adding to production:', error);
      return { success: false, error: error.message };
    }
  };

  // Check and complete ship production
  const checkProduction = useCallback(async () => {
    if (!user || queue.length === 0) return;

    const now = new Date();
    let updated = false;

    const newQueue = queue.map((item) => {
      if (item.produced >= item.quantity) return item;

      const elapsed = now.getTime() - new Date(item.start_time).getTime();
      const shipsProduced = Math.floor(elapsed / (item.time_per_ship * 1000));
      const actualProduced = Math.min(shipsProduced, item.quantity);

      if (actualProduced > item.produced) {
        updated = true;
        return { ...item, produced: actualProduced };
      }

      return item;
    });

    if (updated) {
      setQueue(newQueue);
      localStorage.setItem(`ship_production_${user.id}`, JSON.stringify(newQueue));

      // Add completed ships to inventory
      for (const item of newQueue) {
        if (item.produced === item.quantity) {
          await addShipsToInventory(item.ship_type, item.quantity);
        }
      }

      // Remove completed items
      const activeQueue = newQueue.filter((item) => item.produced < item.quantity);
      setQueue(activeQueue);
      localStorage.setItem(`ship_production_${user.id}`, JSON.stringify(activeQueue));
    }
  }, [user, queue]);

  // Add ships to inventory
  const addShipsToInventory = async (shipType: string, quantity: number) => {
    if (!user) return;

    try {
      // Check if ship exists
      const { data: existing } = await supabase
        .from('ships')
        .select('*')
        .eq('player_id', user.id)
        .eq('ship_type', shipType)
        .single();

      if (existing) {
        // Update quantity
        await supabase
          .from('ships')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);
      } else {
        // Insert new ship
        await supabase
          .from('ships')
          .insert({
            player_id: user.id,
            ship_type: shipType,
            quantity: quantity,
          });
      }

      console.log(`✅ Ships completed: ${quantity}x ${shipType}`);
    } catch (error) {
      console.error('Error adding ships to inventory:', error);
    }
  };

  // Cancel production
  const cancelProduction = async (productionId: string) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const newQueue = queue.filter((item) => item.id !== productionId);
      setQueue(newQueue);
      localStorage.setItem(`ship_production_${user.id}`, JSON.stringify(newQueue));
      return { success: true };
    } catch (error: any) {
      console.error('Error canceling production:', error);
      return { success: false, error: error.message };
    }
  };

  // Get time remaining
  const getTimeRemaining = (item: ShipProductionItem) => {
    const now = new Date();
    const end = new Date(item.end_time);
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.floor(diff / 1000));
  };

  // Get progress percentage
  const getProgress = (item: ShipProductionItem) => {
    return (item.produced / item.quantity) * 100;
  };

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  // Check production every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      checkProduction();
    }, 5000);

    return () => clearInterval(interval);
  }, [checkProduction]);

  return {
    queue,
    loading,
    addToQueue,
    cancelProduction,
    getTimeRemaining,
    getProgress,
    refreshQueue: fetchQueue,
  };
};