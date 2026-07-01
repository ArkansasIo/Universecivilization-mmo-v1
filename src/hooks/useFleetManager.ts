import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useAchievementSystem } from '@/hooks/useAchievementSystem';

interface Fleet {
  id: string;
  player_id: string;
  mission: string;
  ships: Record<string, number>;
  origin: string;
  destination: string;
  status: 'moving' | 'returning' | 'stationed' | 'arrived';
  departure_time: string;
  arrival_time: string;
  return_time?: string;
  cargo?: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  mission_data?: any;
}

interface CombatResult {
  victory: boolean;
  attackerLosses: Record<string, number>;
  defenderLosses: Record<string, number>;
  loot: { metal: number; crystal: number; deuterium: number };
  debris: { metal: number; crystal: number };
  experience: number;
  rounds: number;
}

// Ship stats database
const SHIP_STATS: Record<string, { speed: number; attack: number; shield: number; cargo: number; fuel: number }> = {
  fighter: { speed: 12500, attack: 50, shield: 10, cargo: 50, fuel: 20 },
  heavy: { speed: 10000, attack: 150, shield: 25, cargo: 100, fuel: 75 },
  cruiser: { speed: 15000, attack: 400, shield: 50, cargo: 800, fuel: 300 },
  battleship: { speed: 10000, attack: 1000, shield: 200, cargo: 1500, fuel: 500 },
  destroyer: { speed: 5000, attack: 2000, shield: 500, cargo: 2000, fuel: 1000 },
  transport: { speed: 7500, attack: 5, shield: 25, cargo: 25000, fuel: 50 },
  colony: { speed: 2500, attack: 50, shield: 100, cargo: 7500, fuel: 1000 },
  recycler: { speed: 2000, attack: 1, shield: 10, cargo: 20000, fuel: 300 }
};

export function useFleetManager() {
  const { user } = useAuth();
  const { trackEvent } = useAchievementSystem();
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFleets, setActiveFleets] = useState<Fleet[]>([]);
  const handleFleetArrivalRef = useRef<((fleet: Fleet) => Promise<void>) | null>(null);
  const handleFleetReturnRef = useRef<((fleet: Fleet) => Promise<void>) | null>(null);

  const loadFleets = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('fleets')
        .select('*')
        .eq('player_id', user.id)
        .order('departure_time', { ascending: false });

      if (error) throw error;
      
      setFleets(data || []);
      setActiveFleets((data || []).filter(f => f.status === 'moving' || f.status === 'returning'));
    } catch (error) {
      console.error('Error loading fleets:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFleets();

    // Subscribe to fleet updates
    if (!user) return;

    const channel = supabase
      .channel('fleet-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fleets',
          filter: `player_id=eq.${user.id}`
        },
        () => {
          loadFleets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadFleets]);

  // Real-time fleet movement checker
  useEffect(() => {
    if (!user || activeFleets.length === 0) return;

    const checkFleetArrivals = async () => {
      const now = new Date();

      for (const fleet of activeFleets) {
        const arrivalTime = new Date(fleet.arrival_time);
        
        // Check if fleet has arrived
        if (now >= arrivalTime && fleet.status === 'moving') {
          await handleFleetArrivalRef.current!(fleet);
        }

        // Check if fleet has returned
        if (fleet.return_time) {
          const returnTime = new Date(fleet.return_time);
          if (now >= returnTime && fleet.status === 'returning') {
            await handleFleetReturnRef.current!(fleet);
          }
        }
      }
    };

    // Check every 5 seconds
    const interval = setInterval(checkFleetArrivals, 5000);

    return () => clearInterval(interval);
  }, [user, activeFleets]);

  const calculateTravelTime = (ships: Record<string, number>, origin: string, destination: string): number => {
    // Parse coordinates
    const parseCoords = (coords: string) => {
      const match = coords.match(/\[?(\d+):(\d+):(\d+)\]?/);
      if (!match) return { galaxy: 1, system: 1, planet: 1 };
      return {
        galaxy: parseInt(match[1]),
        system: parseInt(match[2]),
        planet: parseInt(match[3])
      };
    };

    const originCoords = parseCoords(origin);
    const destCoords = parseCoords(destination);

    // Calculate distance
    const galaxyDist = Math.abs(destCoords.galaxy - originCoords.galaxy) * 20000;
    const systemDist = Math.abs(destCoords.system - originCoords.system) * 5 * 19 + 2700;
    const planetDist = Math.abs(destCoords.planet - originCoords.planet) * 5 + 1000;
    
    const totalDistance = galaxyDist + systemDist + planetDist;

    // Find slowest ship speed
    let slowestSpeed = Infinity;
    Object.entries(ships).forEach(([shipType, count]) => {
      if (count > 0 && SHIP_STATS[shipType]) {
        slowestSpeed = Math.min(slowestSpeed, SHIP_STATS[shipType].speed);
      }
    });

    if (slowestSpeed === Infinity) slowestSpeed = 10000;

    // Calculate time in seconds
    const travelTime = Math.floor((totalDistance / slowestSpeed) * 3600);
    
    return Math.max(travelTime, 10); // Minimum 10 seconds for testing
  };

  const calculateFuelCost = (ships: Record<string, number>, distance: number): number => {
    let totalFuel = 0;
    Object.entries(ships).forEach(([shipType, count]) => {
      if (SHIP_STATS[shipType]) {
        const baseFuel = SHIP_STATS[shipType].fuel;
        totalFuel += baseFuel * count * (distance / 1000);
      }
    });
    return Math.floor(totalFuel);
  };

  const sendFleet = async (
    missionType: string,
    ships: Record<string, number>,
    origin: string,
    destination: string,
    cargo?: { metal: number; crystal: number; deuterium: number }
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const travelTime = calculateTravelTime(ships, origin, destination);
      const departureTime = new Date();
      const arrivalTime = new Date(departureTime.getTime() + travelTime * 1000);

      // Deduct ships from inventory (ships table uses user_id)
      const { data: currentShips, error: shipsError } = await supabase
        .from('ships')
        .select('*')
        .eq('user_id', user.id);

      if (shipsError) throw shipsError;

      for (const [shipType, count] of Object.entries(ships)) {
        const shipRecord = currentShips?.find(s => s.ship_type === shipType);
        if (shipRecord) {
          const newCount = Math.max(0, shipRecord.quantity - count);
          await supabase.from('ships').update({ quantity: newCount }).eq('id', shipRecord.id);
        }
      }

      // Deduct cargo resources from player_resources
      if (cargo && (cargo.metal > 0 || cargo.crystal > 0 || cargo.deuterium > 0)) {
        const { data: resRow } = await supabase
          .from('player_resources')
          .select('metal,crystal,deuterium')
          .eq('player_id', user.id)
          .maybeSingle();

        if (resRow) {
          await supabase
            .from('player_resources')
            .update({
              metal: Math.max(0, (resRow.metal as number) - cargo.metal),
              crystal: Math.max(0, (resRow.crystal as number) - cargo.crystal),
              deuterium: Math.max(0, (resRow.deuterium as number) - cargo.deuterium)
            })
            .eq('player_id', user.id);
        }
      }

      const { data, error } = await supabase.from('fleets').insert({
        player_id: user.id,
        mission_type: missionType,
        ships,
        origin,
        destination,
        status: 'moving',
        departure_time: departureTime.toISOString(),
        arrival_time: arrivalTime.toISOString(),
        cargo
      }).select().single();

      if (error) throw error;

      await loadFleets();
      // Track fleet sent achievement
      await trackEvent('fleet_sent');
      return { success: true, fleet: data, arrivalTime };
    } catch (error) {
      console.error('Error sending fleet:', error);
      throw error;
    }
  };

  const handleFleetArrival = async (fleet: Fleet) => {
    try {
      console.log(`Fleet ${fleet.id} arrived at ${fleet.destination}!`);

      let missionResult: any = null;

      // Execute mission based on type
      switch (fleet.mission?.toLowerCase()) {
        case 'attack':
        case 'raid':
          missionResult = await executeCombatMission(fleet);
          break;
        case 'transport':
        case 'deploy':
          missionResult = await executeTransportMission(fleet);
          break;
        case 'spy':
          missionResult = await executeSpyMission(fleet);
          break;
        case 'colonize':
          missionResult = await executeColonizeMission(fleet);
          break;
        case 'harvest':
        case 'recycle':
          missionResult = await executeHarvestMission(fleet);
          break;
        default:
          missionResult = { success: true };
      }

      // Calculate return time
      const returnTime = new Date(Date.now() + calculateTravelTime(fleet.ships, fleet.destination, fleet.origin) * 1000);

      // Update fleet status
      await supabase
        .from('fleets')
        .update({
          status: 'returning',
          return_time: returnTime.toISOString(),
          mission_data: missionResult
        })
        .eq('id', fleet.id);

      await loadFleets();
    } catch (error) {
      console.error('Error handling fleet arrival:', error);
    }
  };

  const handleFleetReturn = async (fleet: Fleet) => {
    try {
      console.log(`Fleet ${fleet.id} returned home!`);

      // Return ships to inventory (ships table uses user_id)
      for (const [shipType, count] of Object.entries(fleet.ships)) {
        const { data: existingShip } = await supabase
          .from('ships')
          .select('*')
          .eq('user_id', user!.id)
          .eq('ship_type', shipType)
          .maybeSingle();

        if (existingShip) {
          await supabase.from('ships').update({ quantity: existingShip.quantity + count }).eq('id', existingShip.id);
        } else {
          await supabase.from('ships').insert({ user_id: user!.id, ship_type: shipType, quantity: count });
        }
      }

      // Add loot to player_resources
      if (fleet.mission_data?.loot) {
        const { data: resRow } = await supabase
          .from('player_resources')
          .select('metal,crystal,deuterium')
          .eq('player_id', user!.id)
          .maybeSingle();

        if (resRow) {
          await supabase
            .from('player_resources')
            .update({
              metal: (resRow.metal as number) + (fleet.mission_data.loot.metal || 0),
              crystal: (resRow.crystal as number) + (fleet.mission_data.loot.crystal || 0),
              deuterium: (resRow.deuterium as number) + (fleet.mission_data.loot.deuterium || 0)
            })
            .eq('player_id', user!.id);
        }
      }

      await supabase.from('fleets').delete().eq('id', fleet.id);
      await loadFleets();
    } catch (error) {
      console.error('Error handling fleet return:', error);
    }
  };

  // Keep refs in sync after handlers are initialized.
  handleFleetArrivalRef.current = handleFleetArrival;
  handleFleetReturnRef.current = handleFleetReturn;

  const executeCombatMission = async (fleet: Fleet): Promise<CombatResult> => {
    // Simplified combat simulation
    const attackPower = Object.entries(fleet.ships).reduce((total, [type, count]) => {
      return total + (SHIP_STATS[type]?.attack || 0) * count;
    }, 0);

    // Simulate defender (random strength)
    const defenderStrength = Math.random() * attackPower * 1.5;
    const victory = attackPower > defenderStrength;

    // Calculate losses (10-30% of fleet)
    const lossPercentage = victory ? 0.1 + Math.random() * 0.2 : 0.3 + Math.random() * 0.4;
    const attackerLosses: Record<string, number> = {};
    
    Object.entries(fleet.ships).forEach(([type, count]) => {
      attackerLosses[type] = Math.floor(count * lossPercentage);
    });

    // Calculate loot
    const loot = victory ? {
      metal: Math.floor(50000 + Math.random() * 100000),
      crystal: Math.floor(30000 + Math.random() * 70000),
      deuterium: Math.floor(20000 + Math.random() * 50000)
    } : { metal: 0, crystal: 0, deuterium: 0 };

    // Log combat
    await supabase.from('combat_logs').insert({
      attacker_id: user!.id,
      defender_id: null,
      attacker_ships: fleet.ships,
      defender_ships: {},
      attacker_losses: attackerLosses,
      defender_losses: {},
      result: victory ? 'victory' : 'defeat',
      loot,
      location: fleet.destination,
      timestamp: new Date().toISOString()
    });

    // Fire achievement events
    if (victory) {
      await trackEvent('combat_victory');
      const totalLoot = (loot.metal ?? 0) + (loot.crystal ?? 0) + (loot.deuterium ?? 0);
      if (totalLoot > 0) {
        await trackEvent('resources_plundered', totalLoot);
      }
    }

    return {
      victory,
      attackerLosses,
      defenderLosses: {},
      loot,
      debris: { metal: 10000, crystal: 5000 },
      experience: victory ? 15000 : 5000,
      rounds: Math.floor(2 + Math.random() * 4)
    };
  };

  const executeTransportMission = async (fleet: Fleet) => {
    // Resources already deducted, just confirm delivery
    return { success: true, delivered: fleet.cargo };
  };

  const executeSpyMission = async (_fleet: Fleet) => {
    return {
      success: true,
      intelligence: {
        defenses: Math.floor(Math.random() * 100),
        fleet: Math.floor(Math.random() * 50),
        resources: {
          metal: Math.floor(Math.random() * 100000),
          crystal: Math.floor(Math.random() * 50000),
          deuterium: Math.floor(Math.random() * 30000)
        }
      }
    };
  };

  const executeColonizeMission = async (_fleet: Fleet) => {
    return { success: true, colonyEstablished: true };
  };

  const executeHarvestMission = async (fleet: Fleet) => {
    try {
      // Parse destination coordinates
      const coordMatch = fleet.destination?.match(/\[?(\d+):(\d+):(\d+)\]?/);
      if (!coordMatch) {
        console.warn('Could not parse destination coordinates for harvest');
        return { success: false, loot: { metal: 0, crystal: 0, deuterium: 0 } };
      }

      const targetGalaxy = parseInt(coordMatch[1]);
      const targetSystem = parseInt(coordMatch[2]);
      const targetPlanet = parseInt(coordMatch[3]);

      // Calculate total recycler cargo capacity
      const ships = fleet.ships || {};
      let cargoCapacity = 0;
      const recyclerCount = (ships as Record<string, number>)['recycler'] || 0;
      const largeCargoCount = (ships as Record<string, number>)['large_cargo'] || 0;
      const smallCargoCount = (ships as Record<string, number>)['small_cargo'] || 0;
      cargoCapacity = (recyclerCount * 20000) + (largeCargoCount * 25000) + (smallCargoCount * 5000);

      // Call the harvest debris edge function
      const { data, error } = await supabase.functions.invoke('process-harvest-debris', {
        body: {
          fleet_id: fleet.id,
          target_galaxy: targetGalaxy,
          target_system: targetSystem,
          target_planet: targetPlanet,
          recycler_cargo_capacity: cargoCapacity,
        },
      });

      if (error || !data || !(data as any).success) {
        console.warn('Harvest mission result:', data);
        return {
          success: false,
          loot: { metal: 0, crystal: 0, deuterium: 0 },
          message: (data as any)?.message || 'Harvest mission completed with no debris found.',
        };
      }

      const result = data as any;
      return {
        success: true,
        loot: {
          metal: result.harvested?.metal || 0,
          crystal: result.harvested?.crystal || 0,
          deuterium: result.harvested?.deuterium || 0,
        },
        remaining: result.remaining,
        field_cleared: result.field_cleared,
      };
    } catch (err) {
      console.error('Harvest mission failed:', err);
      return { success: false, loot: { metal: 0, crystal: 0, deuterium: 0 } };
    }
  };

  const recallFleet = async (fleetId: string) => {
    try {
      const fleet = fleets.find(f => f.id === fleetId);
      if (!fleet) return;

      // Calculate return time from current position
      const now = new Date();
      const departure = new Date(fleet.departure_time);
      const arrival = new Date(fleet.arrival_time);
      const totalTravelTime = (arrival.getTime() - departure.getTime()) / 1000;
      const elapsed = (now.getTime() - departure.getTime()) / 1000;
      const progress = Math.min(elapsed / totalTravelTime, 1);

      // Return time is remaining travel time
      const returnTime = new Date(now.getTime() + (totalTravelTime * progress) * 1000);

      await supabase
        .from('fleets')
        .update({ 
          status: 'returning',
          return_time: returnTime.toISOString()
        })
        .eq('id', fleetId);

      await loadFleets();
    } catch (error) {
      console.error('Error recalling fleet:', error);
      throw error;
    }
  };

  const getFleetProgress = (fleet: Fleet): number => {
    const now = new Date().getTime();
    const departure = new Date(fleet.departure_time).getTime();
    const arrival = new Date(fleet.arrival_time).getTime();
    
    if (fleet.status === 'returning' && fleet.return_time) {
      const returnStart = arrival;
      const returnEnd = new Date(fleet.return_time).getTime();
      const progress = ((now - returnStart) / (returnEnd - returnStart)) * 100;
      return Math.min(Math.max(progress, 0), 100);
    }
    
    const progress = ((now - departure) / (arrival - departure)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getTimeRemaining = (fleet: Fleet): number => {
    const now = new Date().getTime();
    
    if (fleet.status === 'returning' && fleet.return_time) {
      return Math.max(0, new Date(fleet.return_time).getTime() - now);
    }
    
    return Math.max(0, new Date(fleet.arrival_time).getTime() - now);
  };

  return {
    fleets,
    activeFleets,
    loading,
    sendFleet,
    recallFleet,
    loadFleets,
    getFleetProgress,
    getTimeRemaining,
    calculateTravelTime,
    calculateFuelCost
  };
}
