import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface PirateFleet {
  id: string;
  name: string;
  level: number;
  power: number;
  location: {
    galaxy: number;
    system: number;
    position: number;
  };
  ships: {
    type: string;
    quantity: number;
  }[];
  loot: {
    metal: number;
    crystal: number;
    deuterium: number;
    dark_matter: number;
  };
  respawn_time?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme' | 'legendary';
}

interface PirateHunt {
  id: string;
  player_id: string;
  pirate_fleet_id: string;
  status: 'hunting' | 'engaged' | 'victory' | 'defeat';
  fleet_id: string;
  arrival_time: string;
  battle_result?: any;
  loot_gained?: any;
  created_at: string;
}

interface PirateReputation {
  player_id: string;
  reputation: number;
  rank: string;
  kills: number;
  total_loot: number;
  bounties_completed: number;
}

export const usePirateSystem = (playerId: string) => {
  const [pirateFleets, setPirateFleets] = useState<PirateFleet[]>([]);
  const [activeHunts, setActiveHunts] = useState<PirateHunt[]>([]);
  const [reputation, setReputation] = useState<PirateReputation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      if (playerId) {
        setLoading(true);
        try {
          await Promise.all([
            generatePirateFleets(),
            loadActiveHunts(),
            loadReputation()
          ]);
        } catch (err) {
          console.error('Error initializing pirate system:', err);
          setError('Failed to load pirate system');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initializeData();
  }, [playerId]);

  const generatePirateFleets = async () => {
    try {
      setError(null);
      const fleets: PirateFleet[] = [];
      const difficulties: Array<'easy' | 'medium' | 'hard' | 'extreme' | 'legendary'> = ['easy', 'medium', 'hard', 'extreme', 'legendary'];
      
      for (let i = 0; i < 20; i++) {
        const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        let level = 1;
        let power = 1000;
        let lootMultiplier = 1;

        switch (difficulty) {
          case 'easy':
            level = Math.floor(Math.random() * 10) + 1;
            power = level * 1000;
            lootMultiplier = 1;
            break;
          case 'medium':
            level = Math.floor(Math.random() * 20) + 10;
            power = level * 2000;
            lootMultiplier = 2;
            break;
          case 'hard':
            level = Math.floor(Math.random() * 30) + 20;
            power = level * 5000;
            lootMultiplier = 5;
            break;
          case 'extreme':
            level = Math.floor(Math.random() * 40) + 40;
            power = level * 10000;
            lootMultiplier = 10;
            break;
          case 'legendary':
            level = Math.floor(Math.random() * 50) + 80;
            power = level * 50000;
            lootMultiplier = 50;
            break;
        }

        const pirateNames = [
          'Blackbeard', 'Redskull', 'Voidreaver', 'Starcrusher', 'Nebula Raider',
          'Cosmic Marauder', 'Dark Corsair', 'Shadow Buccaneer', 'Void Pirate',
          'Stellar Bandit', 'Galaxy Plunderer', 'Space Scourge', 'Astro Raider'
        ];

        fleets.push({
          id: `pirate_${i}`,
          name: `${pirateNames[Math.floor(Math.random() * pirateNames.length)]} ${level}`,
          level,
          power,
          location: {
            galaxy: Math.floor(Math.random() * 5) + 1,
            system: Math.floor(Math.random() * 499) + 1,
            position: Math.floor(Math.random() * 15) + 1,
          },
          ships: [
            { type: 'Fighter', quantity: level * 10 },
            { type: 'Cruiser', quantity: level * 5 },
            { type: 'Battleship', quantity: level * 2 },
          ],
          loot: {
            metal: 10000 * level * lootMultiplier,
            crystal: 5000 * level * lootMultiplier,
            deuterium: 2500 * level * lootMultiplier,
            dark_matter: Math.floor(level * lootMultiplier * 0.5),
          },
          difficulty,
        });
      }

      setPirateFleets(fleets);
    } catch (err) {
      setError('Failed to generate pirate fleets');
      console.error('Error generating pirate fleets:', err);
      throw err;
    }
  };

  const loadActiveHunts = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('user_id', playerId)
        .eq('mission_type', 'pirate_hunt')
        .in('status', ['in_progress', 'engaged'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      const hunts: PirateHunt[] = (data || []).map((mission: any) => ({
        id: mission.id,
        player_id: playerId,
        pirate_fleet_id: mission.target_id,
        status: mission.status,
        fleet_id: mission.fleet_id,
        arrival_time: mission.arrival_time,
        battle_result: mission.battle_result,
        loot_gained: mission.loot_gained,
        created_at: mission.created_at,
      }));

      setActiveHunts(hunts);
    } catch (error) {
      setError('Failed to load active hunts');
      console.error('Error loading active hunts:', error);
    }
  };

  const loadReputation = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('player_resources')
        .select('pirate_reputation')
        .eq('player_id', playerId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data?.pirate_reputation) {
        setReputation(data.pirate_reputation);
      } else {
        const defaultRep: PirateReputation = {
          player_id: playerId,
          reputation: 0,
          rank: 'Novice Hunter',
          kills: 0,
          total_loot: 0,
          bounties_completed: 0,
        };
        setReputation(defaultRep);
      }
    } catch (error) {
      setError('Failed to load reputation');
      console.error('Error loading reputation:', error);
    }
  };

  const huntPirates = async (pirateFleetId: string, playerFleetId: string) => {
    try {
      setError(null);
      const pirateFleet = pirateFleets.find(f => f.id === pirateFleetId);
      if (!pirateFleet) return { success: false, error: 'Pirate fleet not found' };

      if (!playerId || !playerFleetId) {
        return { success: false, error: 'Invalid player or fleet ID' };
      }

      // Calculate travel time (30 minutes)
      const arrivalTime = new Date(Date.now() + 30 * 60 * 1000);

      const { data, error } = await supabase
        .from('missions')
        .insert({
          user_id: playerId,
          mission_type: 'pirate_hunt',
          mission_name: `Hunt ${pirateFleet.name}`,
          description: `Hunting pirate fleet at ${pirateFleet.location.galaxy}:${pirateFleet.location.system}:${pirateFleet.location.position}`,
          difficulty: pirateFleet.difficulty,
          target_id: pirateFleetId,
          fleet_id: playerFleetId,
          status: 'in_progress',
          arrival_time: arrivalTime.toISOString(),
          target_coordinates: `${pirateFleet.location.galaxy}:${pirateFleet.location.system}:${pirateFleet.location.position}`,
          progress: 0,
          target_value: 100,
        })
        .select()
        .single();

      if (error) throw error;

      await loadActiveHunts();
      return { success: true, hunt: data };
    } catch (error) {
      setError('Failed to hunt pirates');
      console.error('Error hunting pirates:', error);
      return { success: false, error: 'Failed to start pirate hunt' };
    }
  };

  const engagePirates = async (huntId: string) => {
    try {
      setError(null);
      const hunt = activeHunts.find(h => h.id === huntId);
      if (!hunt) return { success: false, error: 'Hunt not found' };

      const pirateFleet = pirateFleets.find(f => f.id === hunt.pirate_fleet_id);
      if (!pirateFleet) return { success: false, error: 'Pirate fleet not found' };

      // Get player fleet
      const { data: playerFleet, error: fleetError } = await supabase
        .from('fleets')
        .select('*')
        .eq('id', hunt.fleet_id)
        .maybeSingle();

      if (fleetError || !playerFleet) return { success: false, error: 'Player fleet not found' };

      // Get player fleet ships
      const { data: playerShips } = await supabase
        .from('fleet_ships')
        .select('*')
        .eq('fleet_id', hunt.fleet_id);

      // Calculate fleet power
      let playerPower = 0;
      if (playerShips) {
        playerPower = playerShips.reduce((sum: number, ship: any) => {
          return sum + (ship.quantity * 100);
        }, 0);
      }

      const piratePower = pirateFleet.power;
      const totalPower = playerPower + piratePower;
      const playerWinChance = totalPower > 0 ? playerPower / totalPower : 0;

      // Simulate battle
      const playerWins = Math.random() < playerWinChance;
      const rounds = Math.floor(Math.random() * 5) + 3;

      const playerLossPercent = playerWins ? 0.15 : 0.7;
      const pirateLossPercent = playerWins ? 0.9 : 0.3;

      const battleResult = {
        winner: playerWins ? 'player' : 'pirates',
        rounds,
        player_power: playerPower,
        pirate_power: piratePower,
        player_losses: Math.floor(playerPower * playerLossPercent),
        pirate_losses: Math.floor(piratePower * pirateLossPercent),
      };

      let lootGained = { metal: 0, crystal: 0, deuterium: 0, dark_matter: 0 };
      let reputationGain = 0;

      if (playerWins) {
        // Award loot
        lootGained = {
          metal: Math.floor(pirateFleet.loot.metal * 0.7),
          crystal: Math.floor(pirateFleet.loot.crystal * 0.7),
          deuterium: Math.floor(pirateFleet.loot.deuterium * 0.7),
          dark_matter: Math.floor(pirateFleet.loot.dark_matter * 0.7),
        };

        // Add resources to player
        const { data: resources } = await supabase
          .from('player_resources')
          .select('*')
          .eq('player_id', playerId)
          .maybeSingle();

        if (resources) {
          await supabase
            .from('player_resources')
            .update({
              metal: (resources.metal || 0) + lootGained.metal,
              crystal: (resources.crystal || 0) + lootGained.crystal,
              deuterium: (resources.deuterium || 0) + lootGained.deuterium,
              dark_matter: (resources.dark_matter || 0) + lootGained.dark_matter,
            })
            .eq('player_id', playerId);
        }

        // Update reputation
        reputationGain = pirateFleet.level * 10;
        if (reputation) {
          const newReputation = {
            ...reputation,
            reputation: reputation.reputation + reputationGain,
            kills: reputation.kills + 1,
            total_loot: reputation.total_loot + (lootGained.metal + lootGained.crystal + lootGained.deuterium),
            bounties_completed: reputation.bounties_completed + 1,
          };

          // Update rank based on reputation
          if (newReputation.reputation >= 10000) newReputation.rank = 'Legendary Hunter';
          else if (newReputation.reputation >= 5000) newReputation.rank = 'Master Hunter';
          else if (newReputation.reputation >= 2000) newReputation.rank = 'Expert Hunter';
          else if (newReputation.reputation >= 1000) newReputation.rank = 'Veteran Hunter';
          else if (newReputation.reputation >= 500) newReputation.rank = 'Skilled Hunter';
          else if (newReputation.reputation >= 100) newReputation.rank = 'Apprentice Hunter';

          await supabase
            .from('player_resources')
            .update({ pirate_reputation: newReputation })
            .eq('player_id', playerId);

          setReputation(newReputation);
        }
      }

      // Update mission
      await supabase
        .from('missions')
        .update({
          status: playerWins ? 'victory' : 'defeat',
          battle_result: battleResult,
          loot_gained: lootGained,
          completed_at: new Date().toISOString(),
        })
        .eq('id', huntId);

      // Apply ship losses
      if (playerShips) {
        for (const ship of playerShips) {
          const losses = Math.floor(ship.quantity * playerLossPercent);
          const remaining = Math.max(0, ship.quantity - losses);
          
          await supabase
            .from('fleet_ships')
            .update({ quantity: remaining })
            .eq('id', ship.id);
        }
      }

      await loadActiveHunts();
      await loadReputation();

      return {
        success: true,
        victory: playerWins,
        battleResult,
        lootGained,
        reputationGain,
      };
    } catch (error) {
      setError('Failed to engage pirates');
      console.error('Error engaging pirates:', error);
      return { success: false, error: 'Failed to engage in battle' };
    }
  };

  const claimBounty = async (difficulty: string) => {
    try {
      setError(null);
      const bountyRewards: any = {
        easy: { metal: 50000, crystal: 25000, deuterium: 10000, dark_matter: 5 },
        medium: { metal: 150000, crystal: 75000, deuterium: 30000, dark_matter: 15 },
        hard: { metal: 500000, crystal: 250000, deuterium: 100000, dark_matter: 50 },
        extreme: { metal: 2000000, crystal: 1000000, deuterium: 500000, dark_matter: 200 },
        legendary: { metal: 10000000, crystal: 5000000, deuterium: 2500000, dark_matter: 1000 },
      };

      const reward = bountyRewards[difficulty as keyof typeof bountyRewards];
      if (!reward) return { success: false, error: 'Invalid difficulty' };

      // Add rewards
      const { data: resources } = await supabase
        .from('player_resources')
        .select('*')
        .eq('player_id', playerId)
        .maybeSingle();

      if (resources) {
        await supabase
          .from('player_resources')
          .update({
            metal: (resources.metal || 0) + reward.metal,
            crystal: (resources.crystal || 0) + reward.crystal,
            deuterium: (resources.deuterium || 0) + reward.deuterium,
            dark_matter: (resources.dark_matter || 0) + reward.dark_matter,
          })
          .eq('player_id', playerId);
      }

      return { success: true, reward };
    } catch (error) {
      setError('Failed to claim bounty');
      console.error('Error claiming bounty:', error);
      return { success: false, error: 'Failed to claim bounty reward' };
    }
  };

  return {
    pirateFleets,
    activeHunts,
    reputation,
    loading,
    error,
    huntPirates,
    engagePirates,
    claimBounty,
    refreshFleets: generatePirateFleets,
    refreshHunts: loadActiveHunts,
    refreshReputation: loadReputation,
  };
};
