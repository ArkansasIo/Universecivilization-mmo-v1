import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { stargates, getStargateById, getConnectedStargates, calculateJumpCost } from '../data/stargates';
import type { Stargate } from '../data/stargates';

interface JumpRoute {
  path: Stargate[];
  totalDistance: number;
  totalEnergyCost: number;
  totalIGCCost: number;
  totalGRCCost: number;
  totalTime: number;
  jumps: number;
}

interface StargateNetworkState {
  availableGates: Stargate[];
  discoveredGates: string[];
  activeJumps: ActiveJump[];
  jumpHistory: JumpHistory[];
}

interface ActiveJump {
  id: string;
  playerId: string;
  fleetId: string;
  fromGateId: string;
  toGateId: string;
  startTime: number;
  arrivalTime: number;
  status: 'in_transit' | 'arriving' | 'completed';
}

interface JumpHistory {
  id: string;
  playerId: string;
  gateId: string;
  timestamp: number;
  energyCost: number;
  igcCost: number;
  grcCost: number;
}

export const useStargateNetwork = (playerId: string) => {
  const [state, setState] = useState<StargateNetworkState>({
    availableGates: [],
    discoveredGates: [],
    activeJumps: [],
    jumpHistory: []
  });
  const [loading, setLoading] = useState(true);

  // Load player's discovered gates
  const loadDiscoveredGates = useCallback(async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('discovered_gates')
        .eq('id', playerId)
        .maybeSingle();

      if (profile?.discovered_gates) {
        const discoveredGateIds = profile.discovered_gates as string[];
        const availableGates = stargates.filter(gate => 
          discoveredGateIds.includes(gate.id) || gate.requirements.level <= 1
        );

        setState(prev => ({
          ...prev,
          discoveredGates: discoveredGateIds,
          availableGates
        }));
      } else {
        // Initialize with starter gates
        const starterGates = stargates.filter(gate => gate.requirements.level <= 1);
        const starterGateIds = starterGates.map(g => g.id);

        await supabase
          .from('profiles')
          .update({ discovered_gates: starterGateIds })
          .eq('id', playerId);

        setState(prev => ({
          ...prev,
          discoveredGates: starterGateIds,
          availableGates: starterGates
        }));
      }
    } catch (error) {
      console.error('Error loading discovered gates:', error);
    }
  }, [playerId]);

  // Load active jumps
  const loadActiveJumps = useCallback(async () => {
    try {
      const { data: jumps } = await supabase
        .from('active_jumps')
        .select('*')
        .eq('player_id', playerId)
        .in('status', ['in_transit', 'arriving']);

      if (jumps) {
        setState(prev => ({
          ...prev,
          activeJumps: jumps.map(j => ({
            id: j.id,
            playerId: j.player_id,
            fleetId: j.fleet_id,
            fromGateId: j.from_gate_id,
            toGateId: j.to_gate_id,
            startTime: new Date(j.start_time).getTime(),
            arrivalTime: new Date(j.arrival_time).getTime(),
            status: j.status
          }))
        }));
      }
    } catch (error) {
      console.error('Error loading active jumps:', error);
    }
  }, [playerId]);

  // Load jump history
  const loadJumpHistory = useCallback(async () => {
    try {
      const { data: history } = await supabase
        .from('jump_history')
        .select('*')
        .eq('player_id', playerId)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (history) {
        setState(prev => ({
          ...prev,
          jumpHistory: history.map(h => ({
            id: h.id,
            playerId: h.player_id,
            gateId: h.gate_id,
            timestamp: new Date(h.timestamp).getTime(),
            energyCost: h.energy_cost,
            igcCost: h.igc_cost,
            grcCost: h.grc_cost
          }))
        }));
      }
    } catch (error) {
      console.error('Error loading jump history:', error);
    }
  }, [playerId]);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await Promise.all([
        loadDiscoveredGates(),
        loadActiveJumps(),
        loadJumpHistory()
      ]);
      setLoading(false);
    };

    initialize();
  }, [loadDiscoveredGates, loadActiveJumps, loadJumpHistory]);

  // Find shortest route between two gates using Dijkstra's algorithm
  const findRoute = useCallback((fromGateId: string, toGateId: string, shipMass: number): JumpRoute | null => {
    const startGate = getStargateById(fromGateId);
    const endGate = getStargateById(toGateId);

    if (!startGate || !endGate) return null;

    const distances = new Map<string, number>();
    const previous = new Map<string, string>();
    const unvisited = new Set(state.discoveredGates);

    distances.set(fromGateId, 0);

    while (unvisited.size > 0) {
      let currentId: string | null = null;
      let minDistance = Infinity;

      for (const gateId of unvisited) {
        const dist = distances.get(gateId) ?? Infinity;
        if (dist < minDistance) {
          minDistance = dist;
          currentId = gateId;
        }
      }

      if (!currentId || currentId === toGateId) break;

      unvisited.delete(currentId);
      const currentGate = getStargateById(currentId);
      if (!currentGate) continue;

      const connectedGates = getConnectedStargates(currentId);

      for (const neighbor of connectedGates) {
        if (!state.discoveredGates.includes(neighbor.id)) continue;

        const distance = Math.sqrt(
          Math.pow(neighbor.coordinates.x - currentGate.coordinates.x, 2) +
          Math.pow(neighbor.coordinates.y - currentGate.coordinates.y, 2) +
          Math.pow(neighbor.coordinates.z - currentGate.coordinates.z, 2)
        );

        const cost = calculateJumpCost(currentGate, shipMass, distance);
        if (!cost.canJump) continue;

        const newDistance = (distances.get(currentId) ?? 0) + distance;

        if (newDistance < (distances.get(neighbor.id) ?? Infinity)) {
          distances.set(neighbor.id, newDistance);
          previous.set(neighbor.id, currentId);
        }
      }
    }

    // Reconstruct path
    const path: Stargate[] = [];
    let current: string | undefined = toGateId;

    while (current) {
      const gate = getStargateById(current);
      if (gate) path.unshift(gate);
      current = previous.get(current);
    }

    if (path.length === 0 || path[0].id !== fromGateId) return null;

    // Calculate total costs
    let totalEnergyCost = 0;
    let totalIGCCost = 0;
    let totalGRCCost = 0;
    let totalTime = 0;

    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];
      const distance = Math.sqrt(
        Math.pow(to.coordinates.x - from.coordinates.x, 2) +
        Math.pow(to.coordinates.y - from.coordinates.y, 2) +
        Math.pow(to.coordinates.z - from.coordinates.z, 2)
      );

      const cost = calculateJumpCost(from, shipMass, distance);
      totalEnergyCost += cost.energyCost;
      totalIGCCost += cost.igcCost;
      totalGRCCost += cost.grcCost;
      totalTime += from.stats.cooldown;
    }

    return {
      path,
      totalDistance: distances.get(toGateId) ?? 0,
      totalEnergyCost,
      totalIGCCost,
      totalGRCCost,
      totalTime,
      jumps: path.length - 1
    };
  }, [state.discoveredGates]);

  // Execute jump through stargate
  const executeJump = useCallback(async (
    fleetId: string,
    fromGateId: string,
    toGateId: string,
    shipMass: number
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const fromGate = getStargateById(fromGateId);
      const toGate = getStargateById(toGateId);

      if (!fromGate || !toGate) {
        return { success: false, message: 'Invalid stargate' };
      }

      if (!state.discoveredGates.includes(fromGateId) || !state.discoveredGates.includes(toGateId)) {
        return { success: false, message: 'Stargate not discovered' };
      }

      if (!fromGate.connections.includes(toGateId)) {
        return { success: false, message: 'Gates are not connected' };
      }

      const distance = Math.sqrt(
        Math.pow(toGate.coordinates.x - fromGate.coordinates.x, 2) +
        Math.pow(toGate.coordinates.y - fromGate.coordinates.y, 2) +
        Math.pow(toGate.coordinates.z - fromGate.coordinates.z, 2)
      );

      const cost = calculateJumpCost(fromGate, shipMass, distance);

      if (!cost.canJump) {
        return { success: false, message: cost.reason || 'Cannot jump' };
      }

      // Check resources
      const { data: resources } = await supabase
        .from('player_resources')
        .select('energy, igc, grc')
        .eq('player_id', playerId)
        .maybeSingle();

      if (!resources) {
        return { success: false, message: 'Resource data not found' };
      }

      if (resources.energy < cost.energyCost) {
        return { success: false, message: 'Insufficient energy' };
      }

      if (resources.igc < cost.igcCost) {
        return { success: false, message: 'Insufficient Imperial Galactic Credits' };
      }

      if (resources.grc < cost.grcCost) {
        return { success: false, message: 'Insufficient Galactic Republic Credits' };
      }

      // Deduct costs
      await supabase
        .from('player_resources')
        .update({
          energy: resources.energy - cost.energyCost,
          igc: resources.igc - cost.igcCost,
          grc: resources.grc - cost.grcCost
        })
        .eq('player_id', playerId);

      // Create active jump
      const startTime = new Date();
      const arrivalTime = new Date(startTime.getTime() + fromGate.stats.cooldown * 1000);

      const { data: jump } = await supabase
        .from('active_jumps')
        .insert({
          player_id: playerId,
          fleet_id: fleetId,
          from_gate_id: fromGateId,
          to_gate_id: toGateId,
          start_time: startTime.toISOString(),
          arrival_time: arrivalTime.toISOString(),
          status: 'in_transit'
        })
        .select()
        .single();

      // Record jump history
      await supabase
        .from('jump_history')
        .insert({
          player_id: playerId,
          gate_id: fromGateId,
          timestamp: startTime.toISOString(),
          energy_cost: cost.energyCost,
          igc_cost: cost.igcCost,
          grc_cost: cost.grcCost
        });

      if (jump) {
        setState(prev => ({
          ...prev,
          activeJumps: [...prev.activeJumps, {
            id: jump.id,
            playerId: jump.player_id,
            fleetId: jump.fleet_id,
            fromGateId: jump.from_gate_id,
            toGateId: jump.to_gate_id,
            startTime: new Date(jump.start_time).getTime(),
            arrivalTime: new Date(jump.arrival_time).getTime(),
            status: jump.status
          }]
        }));
      }

      return { success: true, message: 'Jump initiated successfully' };
    } catch (error) {
      console.error('Error executing jump:', error);
      return { success: false, message: 'Failed to execute jump' };
    }
  }, [playerId, state.discoveredGates]);

  // Discover new stargate
  const discoverGate = useCallback(async (gateId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const gate = getStargateById(gateId);
      if (!gate) {
        return { success: false, message: 'Stargate not found' };
      }

      if (state.discoveredGates.includes(gateId)) {
        return { success: false, message: 'Stargate already discovered' };
      }

      // Check requirements
      const { data: profile } = await supabase
        .from('profiles')
        .select('level')
        .eq('id', playerId)
        .maybeSingle();

      if (!profile || (profile.level || 0) < gate.requirements.level) {
        return { success: false, message: `Requires level ${gate.requirements.level}` };
      }

      // Check technology requirements
      const { data: techs } = await supabase
        .from('technologies')
        .select('name')
        .eq('player_id', playerId);

      const playerTechs = techs?.map(t => t.name) || [];
      const missingTechs = gate.requirements.technology.filter(t => !playerTechs.includes(t));

      if (missingTechs.length > 0) {
        return { success: false, message: `Missing technologies: ${missingTechs.join(', ')}` };
      }

      // Check costs
      const { data: resources } = await supabase
        .from('player_resources')
        .select('igc, grc')
        .eq('player_id', playerId)
        .maybeSingle();

      if (!resources) {
        return { success: false, message: 'Resource data not found' };
      }

      if (resources.igc < gate.requirements.igc) {
        return { success: false, message: 'Insufficient Imperial Galactic Credits' };
      }

      if (resources.grc < gate.requirements.grc) {
        return { success: false, message: 'Insufficient Galactic Republic Credits' };
      }

      // Deduct costs
      await supabase
        .from('player_resources')
        .update({
          igc: resources.igc - gate.requirements.igc,
          grc: resources.grc - gate.requirements.grc
        })
        .eq('player_id', playerId);

      // Add to discovered gates
      const newDiscoveredGates = [...state.discoveredGates, gateId];
      await supabase
        .from('profiles')
        .update({ discovered_gates: newDiscoveredGates })
        .eq('id', playerId);

      setState(prev => ({
        ...prev,
        discoveredGates: newDiscoveredGates,
        availableGates: [...prev.availableGates, gate]
      }));

      return { success: true, message: `Discovered ${gate.name}!` };
    } catch (error) {
      console.error('Error discovering gate:', error);
      return { success: false, message: 'Failed to discover stargate' };
    }
  }, [playerId, state.discoveredGates]);

  // Process active jumps
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = Date.now();
      const completedJumps = state.activeJumps.filter(jump => jump.arrivalTime <= now);

      if (completedJumps.length > 0) {
        for (const jump of completedJumps) {
          await supabase
            .from('active_jumps')
            .update({ status: 'completed' })
            .eq('id', jump.id);
        }

        setState(prev => ({
          ...prev,
          activeJumps: prev.activeJumps.filter(jump => jump.arrivalTime > now)
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [state.activeJumps]);

  return {
    ...state,
    loading,
    findRoute,
    executeJump,
    discoverGate,
    allGates: stargates,
    getStargateById,
    getConnectedStargates
  };
};
