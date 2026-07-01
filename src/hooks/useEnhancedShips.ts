import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { EnhancedShip, ShipGameLogic } from '../data/enhancedShips';

interface PlayerShip extends EnhancedShip {
  player_id: string;
  fleet_id?: string;
  location: string;
  status: 'active' | 'damaged' | 'repairing' | 'docked';
}

export function useEnhancedShips() {
  const { user } = useAuth();
  const [ships, setShips] = useState<PlayerShip[]>([]);
  const [loading, setLoading] = useState(true);

  const loadShips = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ships')
        .select('*')
        .eq('player_id', user.id);

      if (error) throw error;
      setShips(data || []);
    } catch (error) {
      console.error('Error loading ships:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadShips();

    if (!user) return;

    const channel = supabase
      .channel('ship-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ships',
          filter: `player_id=eq.${user.id}`
        },
        () => {
          loadShips();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadShips]);

  const buildShip = async (shipTemplate: EnhancedShip) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase.from('ships').insert({
        player_id: user.id,
        ...shipTemplate,
        status: 'docked',
        location: '[1:1:1]'
      }).select().single();

      if (error) throw error;
      await loadShips();
      return data;
    } catch (error) {
      console.error('Error building ship:', error);
      throw error;
    }
  };

  const repairShip = async (shipId: string) => {
    const ship = ships.find(s => s.id === shipId);
    if (!ship) return;

    try {
      const { error } = await supabase
        .from('ships')
        .update({
          status: 'repairing',
          hull: { ...ship.hull, current: ship.hull.maximum },
          shields: { ...ship.shields, current: ship.shields.maximum }
        })
        .eq('id', shipId);

      if (error) throw error;
      await loadShips();
    } catch (error) {
      console.error('Error repairing ship:', error);
      throw error;
    }
  };

  const upgradeShip = async (shipId: string, upgradeType: keyof EnhancedShip['upgrades']) => {
    const ship = ships.find(s => s.id === shipId);
    if (!ship) return;

    try {
      const newLevel = ship.upgrades[upgradeType] + 1;
      const upgrades = { ...ship.upgrades, [upgradeType]: newLevel };

      const { error } = await supabase
        .from('ships')
        .update({ upgrades })
        .eq('id', shipId);

      if (error) throw error;
      await loadShips();
    } catch (error) {
      console.error('Error upgrading ship:', error);
      throw error;
    }
  };

  const levelUpShip = async (shipId: string) => {
    const ship = ships.find(s => s.id === shipId) as EnhancedShip;
    if (!ship) return;

    ShipGameLogic.levelUp(ship);

    try {
      const { error } = await supabase
        .from('ships')
        .update(ship)
        .eq('id', shipId);

      if (error) throw error;
      await loadShips();
    } catch (error) {
      console.error('Error leveling up ship:', error);
      throw error;
    }
  };

  const calculateShipPower = (ship: EnhancedShip): number => {
    return ShipGameLogic.calculateCombatPower(ship);
  };

  return {
    ships,
    loading,
    buildShip,
    repairShip,
    upgradeShip,
    levelUpShip,
    calculateShipPower,
    loadShips
  };
}
