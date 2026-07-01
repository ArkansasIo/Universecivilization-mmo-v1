import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { travelSystems, calculateTravelTime, calculateTravelCost, canUseSystem } from '../data/travelSystems';

interface TravelRoute {
  id: string;
  playerId: string;
  fleetId: string;
  systemId: string;
  fromCoordinates: { x: number; y: number; z: number };
  toCoordinates: { x: number; y: number; z: number };
  distance: number;
  travelTime: number;
  arrivalTime: Date;
  status: 'traveling' | 'arrived' | 'cancelled';
  createdAt: Date;
}

interface OwnedTravelSystem {
  id: string;
  playerId: string;
  systemId: string;
  level: number;
  coordinates: { x: number; y: number; z: number };
  isActive: boolean;
  lastUsed?: Date;
  connectedGates?: string[]; // For jump gates
}

export const useTravelSystem = (playerId: string) => {
  const [ownedSystems, setOwnedSystems] = useState<OwnedTravelSystem[]>([]);
  const [activeRoutes, setActiveRoutes] = useState<TravelRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [playerResources, setPlayerResources] = useState({
    metal: 0,
    crystal: 0,
    deuterium: 0,
    darkMatter: 0,
    exoticMatter: 0,
    energy: 0
  });
  const [playerLevel, setPlayerLevel] = useState(1);
  const [playerTechnologies, setPlayerTechnologies] = useState<string[]>([]);
  const [playerBuildings, setPlayerBuildings] = useState<{ [key: string]: number }>();

  // Load player data
  useEffect(() => {
    const loadPlayerData = async () => {
      try {
        // Load resources
        const { data: resourcesData } = await supabase
          .from('player_resources')
          .select('*')
          .eq('player_id', playerId)
          .maybeSingle();

        if (resourcesData) {
          setPlayerResources({
            metal: resourcesData.metal || 0,
            crystal: resourcesData.crystal || 0,
            deuterium: resourcesData.deuterium || 0,
            darkMatter: resourcesData.dark_matter || 0,
            exoticMatter: resourcesData.exotic_matter || 0,
            energy: resourcesData.energy || 0
          });
        }

        // Load profile for level
        const { data: profileData } = await supabase
          .from('profiles')
          .select('level')
          .eq('id', playerId)
          .maybeSingle();

        if (profileData) {
          setPlayerLevel(profileData.level || 1);
        }

        // Load technologies
        const { data: techData } = await supabase
          .from('research')
          .select('technology_id')
          .eq('player_id', playerId)
          .eq('status', 'completed');

        if (techData) {
          setPlayerTechnologies(techData.map(t => t.technology_id));
        }

        // Load buildings
        const { data: buildingsData } = await supabase
          .from('buildings')
          .select('building_type, level')
          .eq('player_id', playerId);

        if (buildingsData) {
          const buildingsMap: { [key: string]: number } = {};
          buildingsData.forEach(b => {
            buildingsMap[b.building_type] = b.level;
          });
          setPlayerBuildings(buildingsMap);
        }

      } catch (error) {
        console.error('Error loading player data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlayerData();
  }, [playerId]);

  // Build a travel system
  const buildTravelSystem = useCallback(async (
    systemId: string,
    coordinates: { x: number; y: number; z: number }
  ) => {
    const system = travelSystems.find(s => s.id === systemId);
    if (!system) {
      throw new Error('Travel system not found');
    }

    // Check requirements
    const { canUse, missingRequirements } = canUseSystem(
      system,
      playerLevel,
      playerTechnologies,
      playerBuildings,
      playerResources
    );

    if (!canUse) {
      throw new Error(`Missing requirements: ${missingRequirements.join(', ')}`);
    }

    // Deduct resources
    const { metal, crystal, deuterium, darkMatter, exoticMatter } = system.requirements.resources;
    
    const { error: resourceError } = await supabase
      .from('player_resources')
      .update({
        metal: playerResources.metal - metal,
        crystal: playerResources.crystal - crystal,
        deuterium: playerResources.deuterium - deuterium,
        dark_matter: playerResources.darkMatter - (darkMatter || 0),
        exotic_matter: playerResources.exoticMatter - (exoticMatter || 0)
      })
      .eq('player_id', playerId);

    if (resourceError) throw resourceError;

    // Create the travel system (store in a custom table or use existing structure)
    const newSystem: OwnedTravelSystem = {
      id: `${playerId}_${systemId}_${Date.now()}`,
      playerId,
      systemId,
      level: 1,
      coordinates,
      isActive: true,
      connectedGates: []
    };

    setOwnedSystems(prev => [...prev, newSystem]);
    
    // Update resources state
    setPlayerResources(prev => ({
      ...prev,
      metal: prev.metal - metal,
      crystal: prev.crystal - crystal,
      deuterium: prev.deuterium - deuterium,
      darkMatter: prev.darkMatter - (darkMatter || 0),
      exoticMatter: prev.exoticMatter - (exoticMatter || 0)
    }));

    return newSystem;
  }, [playerId, playerLevel, playerTechnologies, playerBuildings, playerResources]);

  // Initiate travel
  const initiateTravel = useCallback(async (
    fleetId: string,
    systemId: string,
    fromCoordinates: { x: number; y: number; z: number },
    toCoordinates: { x: number; y: number; z: number },
    fleetSize: number
  ) => {
    const system = travelSystems.find(s => s.id === systemId);
    if (!system) {
      throw new Error('Travel system not found');
    }

    // Calculate distance
    const distance = Math.sqrt(
      Math.pow(toCoordinates.x - fromCoordinates.x, 2) +
      Math.pow(toCoordinates.y - fromCoordinates.y, 2) +
      Math.pow(toCoordinates.z - fromCoordinates.z, 2)
    );

    // Check range
    if (distance > system.maxRange) {
      throw new Error(`Distance ${distance.toFixed(1)} LY exceeds maximum range of ${system.maxRange} LY`);
    }

    // Check fleet size
    if (fleetSize > system.maxFleetSize) {
      throw new Error(`Fleet size ${fleetSize} exceeds maximum capacity of ${system.maxFleetSize}`);
    }

    // Calculate costs
    const costs = calculateTravelCost(distance, system, fleetSize);
    
    if (playerResources.energy < costs.energy) {
      throw new Error(`Insufficient energy. Need ${costs.energy}, have ${playerResources.energy}`);
    }
    
    if (playerResources.deuterium < costs.deuterium) {
      throw new Error(`Insufficient deuterium. Need ${costs.deuterium}, have ${playerResources.deuterium}`);
    }

    // Deduct travel costs
    const { error: costError } = await supabase
      .from('player_resources')
      .update({
        energy: playerResources.energy - costs.energy,
        deuterium: playerResources.deuterium - costs.deuterium
      })
      .eq('player_id', playerId);

    if (costError) throw costError;

    // Calculate travel time
    const travelTime = calculateTravelTime(distance, system);
    const arrivalTime = new Date(Date.now() + travelTime * 1000);

    // Create travel route
    const route: TravelRoute = {
      id: `route_${Date.now()}`,
      playerId,
      fleetId,
      systemId,
      fromCoordinates,
      toCoordinates,
      distance,
      travelTime,
      arrivalTime,
      status: 'traveling',
      createdAt: new Date()
    };

    setActiveRoutes(prev => [...prev, route]);
    
    // Update resources state
    setPlayerResources(prev => ({
      ...prev,
      energy: prev.energy - costs.energy,
      deuterium: prev.deuterium - costs.deuterium
    }));

    // Update fleet position in database
    await supabase
      .from('fleets')
      .update({
        status: 'traveling',
        destination_x: toCoordinates.x,
        destination_y: toCoordinates.y,
        destination_z: toCoordinates.z,
        arrival_time: arrivalTime.toISOString()
      })
      .eq('id', fleetId);

    return route;
  }, [playerId, playerResources]);

  // Connect jump gates
  const connectJumpGates = useCallback(async (gate1Id: string, gate2Id: string) => {
    const gate1 = ownedSystems.find(s => s.id === gate1Id);
    const gate2 = ownedSystems.find(s => s.id === gate2Id);

    if (!gate1 || !gate2) {
      throw new Error('One or both gates not found');
    }

    const system1 = travelSystems.find(s => s.id === gate1.systemId);
    const system2 = travelSystems.find(s => s.id === gate2.systemId);

    if (system1?.type !== 'jumpgate' || system2?.type !== 'jumpgate') {
      throw new Error('Both systems must be jump gates');
    }

    // Calculate distance between gates
    const distance = Math.sqrt(
      Math.pow(gate2.coordinates.x - gate1.coordinates.x, 2) +
      Math.pow(gate2.coordinates.y - gate1.coordinates.y, 2) +
      Math.pow(gate2.coordinates.z - gate1.coordinates.z, 2)
    );

    if (distance > system1.maxRange) {
      throw new Error(`Gates are too far apart. Distance: ${distance.toFixed(1)} LY, Max range: ${system1.maxRange} LY`);
    }

    // Connect the gates
    setOwnedSystems(prev => prev.map(s => {
      if (s.id === gate1Id) {
        return { ...s, connectedGates: [...(s.connectedGates || []), gate2Id] };
      }
      if (s.id === gate2Id) {
        return { ...s, connectedGates: [...(s.connectedGates || []), gate1Id] };
      }
      return s;
    }));

    return { gate1Id, gate2Id, distance };
  }, [ownedSystems]);

  // Get available travel systems for player
  const getAvailableSystems = useCallback(() => {
    return travelSystems.map(system => {
      const check = canUseSystem(
        system,
        playerLevel,
        playerTechnologies,
        playerBuildings,
        playerResources
      );
      return {
        system,
        ...check
      };
    });
  }, [playerLevel, playerTechnologies, playerBuildings, playerResources]);

  // Check if route has arrived
  useEffect(() => {
    const checkArrivals = setInterval(() => {
      const now = new Date();
      setActiveRoutes(prev => prev.map(route => {
        if (route.status === 'traveling' && now >= route.arrivalTime) {
          // Update fleet position
          supabase
            .from('fleets')
            .update({
              status: 'idle',
              position_x: route.toCoordinates.x,
              position_y: route.toCoordinates.y,
              position_z: route.toCoordinates.z,
              arrival_time: null
            })
            .eq('id', route.fleetId);

          return { ...route, status: 'arrived' as const };
        }
        return route;
      }));
    }, 1000);

    return () => clearInterval(checkArrivals);
  }, []);

  return {
    ownedSystems,
    activeRoutes,
    loading,
    playerResources,
    buildTravelSystem,
    initiateTravel,
    connectJumpGates,
    getAvailableSystems,
    allTravelSystems: travelSystems
  };
};
