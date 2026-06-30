import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface RaidTarget {
  planet_id: string;
  player_id: string;
  player_name: string;
  planet_name: string;
  coordinates: string;
  estimated_resources: number;
  defense_strength: number;
}

interface RaidResult {
  success: boolean;
  winner: string;
  attacker_losses: any;
  defender_losses: any;
  resources_stolen: any;
  total_loot: number;
  combat_rounds: number;
}

export const useRaiding = (playerId: string) => {
  const [loading, setLoading] = useState(false);
  const [raidHistory, setRaidHistory] = useState<any[]>([]);

  const findTargets = async (minResources: number = 0, maxDefense: number = 1000000) => {
    try {
      setLoading(true);

      const { data: planets } = await supabase
        .from('planets')
        .select(`
          id,
          name,
          galaxy,
          system,
          planet,
          player_id,
          profiles!inner(username)
        `)
        .neq('player_id', playerId)
        .limit(20);

      if (!planets) return [];

      const targets: RaidTarget[] = [];

      for (const planet of planets) {
        const { data: resources } = await supabase
          .from('player_resources')
          .select('metal, crystal, deuterium')
          .eq('player_id', planet.player_id)
          .maybeSingle();

        const { data: defenses } = await supabase
          .from('defense_structures')
          .select('*')
          .eq('planet_id', planet.id);

        const totalResources = resources 
          ? resources.metal + resources.crystal + resources.deuterium 
          : 0;

        const defenseStrength = defenses 
          ? defenses.reduce((sum: number, d: any) => sum + (d.quantity * 100), 0)
          : 0;

        if (totalResources >= minResources && defenseStrength <= maxDefense) {
          targets.push({
            planet_id: planet.id,
            player_id: planet.player_id,
            player_name: (planet.profiles as any)?.username || 'Unknown',
            planet_name: planet.name,
            coordinates: `${planet.galaxy}:${planet.system}:${planet.planet}`,
            estimated_resources: totalResources,
            defense_strength: defenseStrength
          });
        }
      }

      return targets.sort((a, b) => b.estimated_resources - a.estimated_resources);
    } catch (error) {
      console.error('Error finding targets:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const launchRaid = async (
    targetPlanetId: string,
    fleetId: string,
    attackerShips: any[]
  ): Promise<RaidResult> => {
    try {
      setLoading(true);

      const { data: targetPlanet } = await supabase
        .from('planets')
        .select('player_id')
        .eq('id', targetPlanetId)
        .maybeSingle();

      if (!targetPlanet) {
        throw new Error('Target planet not found');
      }

      const { data: defenderShips } = await supabase
        .from('fleet_ships')
        .select('*')
        .eq('fleet_id', fleetId);

      const { data: defenderDefenses } = await supabase
        .from('defense_structures')
        .select('*')
        .eq('planet_id', targetPlanetId);

      const { data: defenderResources } = await supabase
        .from('player_resources')
        .select('*')
        .eq('player_id', targetPlanet.player_id)
        .maybeSingle();

      let attackerPower = attackerShips.reduce((sum, ship) => {
        return sum + (ship.quantity * (ship.attack || 100));
      }, 0);

      let defenderPower = 0;
      if (defenderShips) {
        defenderPower += defenderShips.reduce((sum: number, ship: any) => {
          return sum + (ship.quantity * 100);
        }, 0);
      }
      if (defenderDefenses) {
        defenderPower += defenderDefenses.reduce((sum: number, def: any) => {
          return sum + (def.quantity * 150);
        }, 0);
      }

      const totalPower = attackerPower + defenderPower;
      const attackerWinChance = totalPower > 0 ? attackerPower / totalPower : 0.5;
      const rounds = Math.floor(Math.random() * 5) + 3;

      const attackerWins = Math.random() < attackerWinChance;

      const attackerLossPercent = attackerWins ? 0.2 : 0.6;
      const defenderLossPercent = attackerWins ? 0.7 : 0.3;

      const attackerLosses: any = {};
      const defenderLosses: any = {};

      attackerShips.forEach(ship => {
        const losses = Math.floor(ship.quantity * attackerLossPercent);
        if (losses > 0) {
          attackerLosses[ship.ship_type] = losses;
        }
      });

      if (defenderShips) {
        defenderShips.forEach((ship: any) => {
          const losses = Math.floor(ship.quantity * defenderLossPercent);
          if (losses > 0) {
            defenderLosses[ship.ship_type] = losses;
          }
        });
      }

      let resourcesStolen = { metal: 0, crystal: 0, deuterium: 0 };
      let totalLoot = 0;

      if (attackerWins && defenderResources) {
        const lootPercent = 0.5;
        resourcesStolen = {
          metal: Math.floor(defenderResources.metal * lootPercent),
          crystal: Math.floor(defenderResources.crystal * lootPercent),
          deuterium: Math.floor(defenderResources.deuterium * lootPercent)
        };
        totalLoot = resourcesStolen.metal + resourcesStolen.crystal + resourcesStolen.deuterium;

        await supabase
          .from('player_resources')
          .update({
            metal: defenderResources.metal - resourcesStolen.metal,
            crystal: defenderResources.crystal - resourcesStolen.crystal,
            deuterium: defenderResources.deuterium - resourcesStolen.deuterium
          })
          .eq('player_id', targetPlanet.player_id);

        const { data: attackerResources } = await supabase
          .from('player_resources')
          .select('*')
          .eq('player_id', playerId)
          .maybeSingle();

        if (attackerResources) {
          await supabase
            .from('player_resources')
            .update({
              metal: attackerResources.metal + resourcesStolen.metal,
              crystal: attackerResources.crystal + resourcesStolen.crystal,
              deuterium: attackerResources.deuterium + resourcesStolen.deuterium
            })
            .eq('player_id', playerId);
        }
      }

      await supabase.from('raid_history').insert({
        attacker_id: playerId,
        defender_id: targetPlanet.player_id,
        target_planet_id: targetPlanetId,
        fleet_id: fleetId,
        attacker_ships: attackerShips,
        defender_ships: defenderShips || [],
        defender_defenses: defenderDefenses || [],
        battle_result: attackerWins ? 'attacker_victory' : 'defender_victory',
        attacker_losses: attackerLosses,
        defender_losses: defenderLosses,
        resources_stolen: resourcesStolen,
        total_loot: totalLoot,
        combat_rounds: rounds
      });

      return {
        success: true,
        winner: attackerWins ? 'attacker' : 'defender',
        attacker_losses: attackerLosses,
        defender_losses: defenderLosses,
        resources_stolen: resourcesStolen,
        total_loot: totalLoot,
        combat_rounds: rounds
      };
    } catch (error) {
      console.error('Error launching raid:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchRaidHistory = async () => {
    try {
      const { data } = await supabase
        .from('raid_history')
        .select(`
          *,
          attacker:profiles!raid_history_attacker_id_fkey(username),
          defender:profiles!raid_history_defender_id_fkey(username),
          target_planet:planets(name, galaxy, system, planet)
        `)
        .or(`attacker_id.eq.${playerId},defender_id.eq.${playerId}`)
        .order('raid_time', { ascending: false })
        .limit(50);

      setRaidHistory(data || []);
    } catch (error) {
      console.error('Error fetching raid history:', error);
    }
  };

  return {
    loading,
    raidHistory,
    findTargets,
    launchRaid,
    fetchRaidHistory
  };
};