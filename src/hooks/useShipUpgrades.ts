import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface ShipUpgrade {
  id: string;
  fleet_ship_id: string;
  upgrade_type: string;
  level: number;
  bonus_value: number;
  cost_metal: number;
  cost_crystal: number;
  cost_deuterium: number;
  installed_at: string;
}

interface FleetShipWithUpgrades {
  id: string;
  ship_type: string;
  quantity: number;
  upgrade_slots: number;
  experience: number;
  ship_level: number;
  total_attack_bonus: number;
  total_defense_bonus: number;
  total_speed_bonus: number;
  upgrades: ShipUpgrade[];
}

export const useShipUpgrades = (playerId: string) => {
  const [ships, setShips] = useState<FleetShipWithUpgrades[]>([]);
  const [loading, setLoading] = useState(true);

  const upgradeTypes = [
    { type: 'weapon', name: 'Weapon System', bonus: 'attack', icon: 'ri-sword-line' },
    { type: 'armor', name: 'Armor Plating', bonus: 'defense', icon: 'ri-shield-line' },
    { type: 'engine', name: 'Engine Boost', bonus: 'speed', icon: 'ri-rocket-line' },
    { type: 'shield', name: 'Shield Generator', bonus: 'defense', icon: 'ri-shield-star-line' },
    { type: 'targeting', name: 'Targeting Computer', bonus: 'attack', icon: 'ri-focus-3-line' },
    { type: 'reactor', name: 'Power Reactor', bonus: 'attack', icon: 'ri-flashlight-line' }
  ];

  const fetchShipsWithUpgrades = useCallback(async () => {
    try {
      const { data: fleetData } = await supabase
        .from('fleets')
        .select('id')
        .eq('player_id', playerId)
        .maybeSingle();

      if (!fleetData) return;

      const { data: shipsData } = await supabase
        .from('fleet_ships')
        .select('*')
        .eq('fleet_id', fleetData.id);

      if (!shipsData) return;

      const shipsWithUpgrades = await Promise.all(
        shipsData.map(async (ship) => {
          const { data: upgrades } = await supabase
            .from('ship_upgrades')
            .select('*')
            .eq('fleet_ship_id', ship.id);

          return {
            ...ship,
            upgrades: upgrades || []
          };
        })
      );

      setShips(shipsWithUpgrades);
    } catch (error) {
      console.error('Error fetching ships:', error);
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  const installUpgrade = async (
    fleetShipId: string,
    upgradeType: string,
    level: number = 1
  ) => {
    try {
      const ship = ships.find(s => s.id === fleetShipId);
      if (!ship) return { success: false, message: 'Ship not found' };

      if (ship.upgrades.length >= ship.upgrade_slots) {
        return { success: false, message: 'No upgrade slots available' };
      }

      const baseCost = {
        metal: 1000 * level,
        crystal: 500 * level,
        deuterium: 200 * level
      };

      const { data: resources } = await supabase
        .from('player_resources')
        .select('*')
        .eq('player_id', playerId)
        .maybeSingle();

      if (!resources || 
          (resources.metal || 0) < baseCost.metal ||
          (resources.crystal || 0) < baseCost.crystal ||
          (resources.deuterium || 0) < baseCost.deuterium) {
        return { success: false, message: 'Insufficient resources' };
      }

      const bonusValue = level * 5;

      const { error: upgradeError } = await supabase
        .from('ship_upgrades')
        .insert({
          fleet_ship_id: fleetShipId,
          upgrade_type: upgradeType,
          level,
          bonus_value: bonusValue,
          cost_metal: baseCost.metal,
          cost_crystal: baseCost.crystal,
          cost_deuterium: baseCost.deuterium
        });

      if (upgradeError) throw upgradeError;

      await supabase
        .from('player_resources')
        .update({
          metal: resources.metal - baseCost.metal,
          crystal: resources.crystal - baseCost.crystal,
          deuterium: resources.deuterium - baseCost.deuterium
        })
        .eq('player_id', playerId);

      const bonusField = upgradeType === 'weapon' || upgradeType === 'targeting' || upgradeType === 'reactor'
        ? 'total_attack_bonus'
        : upgradeType === 'engine'
        ? 'total_speed_bonus'
        : 'total_defense_bonus';

      await supabase
        .from('fleet_ships')
        .update({
          [bonusField]: (ship[bonusField as keyof FleetShipWithUpgrades] as number || 0) + bonusValue
        })
        .eq('id', fleetShipId);

      await fetchShipsWithUpgrades();
      return { success: true, message: 'Upgrade installed successfully' };
    } catch (error) {
      console.error('Error installing upgrade:', error);
      return { success: false, message: 'Failed to install upgrade' };
    }
  };

  const removeUpgrade = async (upgradeId: string) => {
    try {
      const { error } = await supabase
        .from('ship_upgrades')
        .delete()
        .eq('id', upgradeId);

      if (error) throw error;

      await fetchShipsWithUpgrades();
      return { success: true, message: 'Upgrade removed' };
    } catch (error) {
      console.error('Error removing upgrade:', error);
      return { success: false, message: 'Failed to remove upgrade' };
    }
  };

  const upgradeShipLevel = async (fleetShipId: string) => {
    try {
      const ship = ships.find(s => s.id === fleetShipId);
      if (!ship) return { success: false, message: 'Ship not found' };

      const requiredExp = ship.ship_level * 1000;
      if (ship.experience < requiredExp) {
        return { success: false, message: `Need ${requiredExp} experience` };
      }

      const cost = {
        metal: ship.ship_level * 5000,
        crystal: ship.ship_level * 2500,
        deuterium: ship.ship_level * 1000
      };

      const { data: resources } = await supabase
        .from('player_resources')
        .select('*')
        .eq('player_id', playerId)
        .maybeSingle();

      if (!resources || 
          (resources.metal || 0) < cost.metal ||
          (resources.crystal || 0) < cost.crystal ||
          (resources.deuterium || 0) < cost.deuterium) {
        return { success: false, message: 'Insufficient resources' };
      }

      await supabase
        .from('fleet_ships')
        .update({
          ship_level: ship.ship_level + 1,
          experience: ship.experience - requiredExp,
          upgrade_slots: ship.upgrade_slots + 1
        })
        .eq('id', fleetShipId);

      await supabase
        .from('player_resources')
        .update({
          metal: resources.metal - cost.metal,
          crystal: resources.crystal - cost.crystal,
          deuterium: resources.deuterium - cost.deuterium
        })
        .eq('player_id', playerId);

      await fetchShipsWithUpgrades();
      return { success: true, message: 'Ship level increased!' };
    } catch (error) {
      console.error('Error upgrading ship:', error);
      return { success: false, message: 'Failed to upgrade ship' };
    }
  };

  useEffect(() => {
    if (playerId) {
      fetchShipsWithUpgrades();
    }
  }, [playerId, fetchShipsWithUpgrades]);

  return {
    ships,
    loading,
    upgradeTypes,
    installUpgrade,
    removeUpgrade,
    upgradeShipLevel,
    refresh: fetchShipsWithUpgrades
  };
};
