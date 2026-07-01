import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CombatResult {
  winner: 'attacker' | 'defender' | 'draw';
  attackerLosses: Record<string, number>;
  defenderLosses: Record<string, number>;
  loot: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  rounds: number;
  combatLog: string[];
}

interface ServerCombatResult {
  combatId: number | null;
  winner: 'attacker' | 'defender' | 'draw';
  attackerLosses: Record<string, number>;
  defenderLosses: Record<string, number>;
  rounds: number;
  attackerPower: number;
  defenderPower: number;
  loot: Record<string, number>;
  summary: string;
}

export function useCombatSimulator() {
  const { user } = useAuth();
  const [simulating, setSimulating] = useState(false);
  const [lastResult, setLastResult] = useState<CombatResult | null>(null);
  const [resolvingCombat, setResolvingCombat] = useState(false);

  // ── Client-side simulation (for preview / practice) ───────────────
  const simulateCombat = useCallback(async (
    attackerFleet: Record<string, number>,
    defenderFleet: Record<string, number>,
    _defenderDefenses?: Record<string, number>
  ): Promise<CombatResult> => {
    setSimulating(true);

    try {
      // Ship stats (simplified)
      const shipStats: Record<string, { attack: number; defense: number; shield: number; hull: number }> = {
        light_fighter: { attack: 50, defense: 10, shield: 10, hull: 400 },
        heavy_fighter: { attack: 150, defense: 25, shield: 25, hull: 1000 },
        cruiser: { attack: 400, defense: 50, shield: 50, hull: 2700 },
        battleship: { attack: 1000, defense: 200, shield: 200, hull: 6000 },
        bomber: { attack: 1000, defense: 500, shield: 500, hull: 7500 },
        destroyer: { attack: 2000, defense: 500, shield: 500, hull: 11000 }
      };

      const attackerShips = { ...attackerFleet };
      const defenderShips = { ...defenderFleet };
      const combatLog: string[] = [];
      let rounds = 0;
      const maxRounds = 6;

      // Combat simulation
      while (rounds < maxRounds) {
        rounds++;
        combatLog.push(`--- Round ${rounds} ---`);

        // Attacker fires
        let attackerDamage = 0;
        Object.entries(attackerShips).forEach(([shipType, count]) => {
          if (count > 0 && shipStats[shipType]) {
            attackerDamage += shipStats[shipType].attack * count;
          }
        });

        // Defender fires
        let defenderDamage = 0;
        Object.entries(defenderShips).forEach(([shipType, count]) => {
          if (count > 0 && shipStats[shipType]) {
            defenderDamage += shipStats[shipType].attack * count;
          }
        });

        // Apply damage to defender
        let remainingDamage = attackerDamage;
        Object.entries(defenderShips).forEach(([shipType, count]) => {
          if (count > 0 && remainingDamage > 0 && shipStats[shipType]) {
            const shipsDestroyed = Math.min(
              count,
              Math.floor(remainingDamage / shipStats[shipType].hull)
            );
            defenderShips[shipType] -= shipsDestroyed;
            remainingDamage -= shipsDestroyed * shipStats[shipType].hull;
            if (shipsDestroyed > 0) {
              combatLog.push(`Attacker destroyed ${shipsDestroyed} ${shipType}(s)`);
            }
          }
        });

        // Apply damage to attacker
        remainingDamage = defenderDamage;
        Object.entries(attackerShips).forEach(([shipType, count]) => {
          if (count > 0 && remainingDamage > 0 && shipStats[shipType]) {
            const shipsDestroyed = Math.min(
              count,
              Math.floor(remainingDamage / shipStats[shipType].hull)
            );
            attackerShips[shipType] -= shipsDestroyed;
            remainingDamage -= shipsDestroyed * shipStats[shipType].hull;
            if (shipsDestroyed > 0) {
              combatLog.push(`Defender destroyed ${shipsDestroyed} ${shipType}(s)`);
            }
          }
        });

        // Check if battle is over
        const attackerAlive = Object.values(attackerShips).some(count => count > 0);
        const defenderAlive = Object.values(defenderShips).some(count => count > 0);

        if (!attackerAlive || !defenderAlive) {
          break;
        }
      }

      // Calculate losses
      const attackerLosses: Record<string, number> = {};
      const defenderLosses: Record<string, number> = {};

      Object.entries(attackerFleet).forEach(([shipType, count]) => {
        attackerLosses[shipType] = count - (attackerShips[shipType] || 0);
      });

      Object.entries(defenderFleet).forEach(([shipType, count]) => {
        defenderLosses[shipType] = count - (defenderShips[shipType] || 0);
      });

      // Determine winner
      const attackerAlive = Object.values(attackerShips).some(count => count > 0);
      const defenderAlive = Object.values(defenderShips).some(count => count > 0);

      let winner: 'attacker' | 'defender' | 'draw';
      if (attackerAlive && !defenderAlive) {
        winner = 'attacker';
        combatLog.push('Attacker wins!');
      } else if (!attackerAlive && defenderAlive) {
        winner = 'defender';
        combatLog.push('Defender wins!');
      } else {
        winner = 'draw';
        combatLog.push('Draw!');
      }

      // Calculate loot (if attacker wins)
      const loot = winner === 'attacker' ? {
        metal: Math.floor(Math.random() * 100000),
        crystal: Math.floor(Math.random() * 50000),
        deuterium: Math.floor(Math.random() * 25000)
      } : { metal: 0, crystal: 0, deuterium: 0 };

      const result: CombatResult = {
        winner,
        attackerLosses,
        defenderLosses,
        loot,
        rounds,
        combatLog
      };

      // Save combat log to database
      if (user) {
        await supabase.from('combat_logs').insert({
          attacker_id: user.id,
          defender_id: 'simulation',
          attacker_losses: attackerLosses,
          defender_losses: defenderLosses,
          resources_plundered: loot,
          combat_rounds: rounds,
          report_detail: {
            attackerFleet,
            defenderFleet,
            combatLog,
            result: winner,
          },
          result: winner,
          created_at: new Date().toISOString(),
        });
      }

      setLastResult(result);
      return result;
    } catch (error) {
      console.error('Error simulating combat:', error);
      throw error;
    } finally {
      setSimulating(false);
    }
  }, [user]);

  // ── Server-side fleet combat resolution ─────────────────────────────
  const resolveFleetCombat = useCallback(async (
    attackerFleetId: number,
    defenderFleetId?: number,
    attackerTech?: { weapons: number; shielding: number; armour: number },
    defenderTech?: { weapons: number; shielding: number; armour: number }
  ): Promise<ServerCombatResult> => {
    setResolvingCombat(true);

    try {
      const { data, error } = await supabase.functions.invoke('resolve-combat', {
        body: {
          attacker_fleet_id: attackerFleetId,
          defender_fleet_id: defenderFleetId,
          attacker_tech: attackerTech || { weapons: 0, shielding: 0, armour: 0 },
          defender_tech: defenderTech || { weapons: 0, shielding: 0, armour: 0 },
        },
      });

      if (error) throw new Error(error.message || 'Combat resolution failed');

      return data as ServerCombatResult;
    } catch (error: any) {
      console.error('Error resolving fleet combat:', error);
      throw error;
    } finally {
      setResolvingCombat(false);
    }
  }, []);

  // ── Legacy client-side execute combat (kept for non-fleet combat) ───
  const executeCombat = async (
    defenderId: string,
    attackerFleet: Record<string, number>
  ) => {
    if (!user) return null;

    try {
      // Get defender fleet
      const { data: defenderShips } = await supabase
        .from('ships')
        .select('ship_type, quantity')
        .eq('player_id', defenderId)
        .eq('status', 'docked');

      const defenderFleet: Record<string, number> = {};
      defenderShips?.forEach((ship: any) => {
        defenderFleet[ship.ship_type] = (defenderFleet[ship.ship_type] || 0) + (ship.quantity || 1);
      });

      // Use server-side resolution if we have fleet IDs; otherwise fall back to simulation
      const result = await simulateCombat(attackerFleet, defenderFleet);

      // Apply results
      if (result.winner === 'attacker') {
        // Add loot to attacker
        const { data: attackerResources } = await supabase
          .from('player_resources')
          .select('metal, crystal, deuterium')
          .eq('player_id', user.id)
          .maybeSingle();

        if (attackerResources) {
          await supabase
            .from('player_resources')
            .update({
              metal: (attackerResources.metal || 0) + result.loot.metal,
              crystal: (attackerResources.crystal || 0) + result.loot.crystal,
              deuterium: (attackerResources.deuterium || 0) + result.loot.deuterium,
              updated_at: new Date().toISOString(),
            })
            .eq('player_id', user.id);
        }

        // Deduct loot from defender
        const { data: defenderResources } = await supabase
          .from('player_resources')
          .select('metal, crystal, deuterium')
          .eq('player_id', defenderId)
          .maybeSingle();

        if (defenderResources) {
          await supabase
            .from('player_resources')
            .update({
              metal: Math.max(0, (defenderResources.metal || 0) - result.loot.metal),
              crystal: Math.max(0, (defenderResources.crystal || 0) - result.loot.crystal),
              deuterium: Math.max(0, (defenderResources.deuterium || 0) - result.loot.deuterium),
              updated_at: new Date().toISOString(),
            })
            .eq('player_id', defenderId);
        }
      }

      // Update ship quantities
      for (const [shipType, losses] of Object.entries(result.attackerLosses)) {
        if (losses > 0) {
          const { data: ships } = await supabase
            .from('ships')
            .select('id, quantity')
            .eq('player_id', user.id)
            .eq('ship_type', shipType)
            .eq('status', 'docked');

          if (ships && ships.length > 0) {
            let remainingLosses = losses;
            for (const ship of ships) {
              if (remainingLosses <= 0) break;
              const currentQty = ship.quantity || 1;
              if (currentQty <= remainingLosses) {
                await supabase.from('ships').delete().eq('id', ship.id);
                remainingLosses -= currentQty;
              } else {
                await supabase.from('ships').update({ quantity: currentQty - remainingLosses }).eq('id', ship.id);
                remainingLosses = 0;
              }
            }
          }
        }
      }

      for (const [shipType, losses] of Object.entries(result.defenderLosses)) {
        if (losses > 0) {
          const { data: ships } = await supabase
            .from('ships')
            .select('id, quantity')
            .eq('player_id', defenderId)
            .eq('ship_type', shipType)
            .eq('status', 'docked');

          if (ships && ships.length > 0) {
            let remainingLosses = losses;
            for (const ship of ships) {
              if (remainingLosses <= 0) break;
              const currentQty = ship.quantity || 1;
              if (currentQty <= remainingLosses) {
                await supabase.from('ships').delete().eq('id', ship.id);
                remainingLosses -= currentQty;
              } else {
                await supabase.from('ships').update({ quantity: currentQty - remainingLosses }).eq('id', ship.id);
                remainingLosses = 0;
              }
            }
          }
        }
      }

      return result;
    } catch (error) {
      console.error('Error executing combat:', error);
      return null;
    }
  };

  return {
    simulateCombat,
    executeCombat,
    resolveFleetCombat,
    simulating,
    resolvingCombat,
    lastResult
  };
}