import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type {
  ReactorDefinition,
  PowerGrid,
  PowerReactor,
  GridConnection,
  GridCell,
  ReactorStatus,
  ConnectionType,
  GridStatus,
} from '@/data/powerReactors';
import { calculateReactorOutput, calculateTransmissionLoss, calculateEffectiveEfficiency } from '@/data/powerReactors';

interface UsePowerGridOptions {
  planetId?: string;
  moonId?: string;
  gridSizeX?: number;
  gridSizeY?: number;
}

interface UsePowerGridReturn {
  grid: PowerGrid | null;
  reactors: PowerReactor[];
  definitions: ReactorDefinition[];
  connections: GridConnection[];
  gridCells: GridCell[][];
  selectedReactor: PowerReactor | null;
  selectedDefinition: ReactorDefinition | null;
  isLoading: boolean;
  error: string | null;
  loadDurationMs: number;
  selectReactor: (reactor: PowerReactor | null) => void;
  selectDefinition: (def: ReactorDefinition | null) => void;
  placeReactor: (definitionId: number, x: number, y: number) => Promise<boolean>;
  removeReactor: (reactorId: number) => Promise<boolean>;
  upgradeReactor: (reactorId: number) => Promise<boolean>;
  toggleReactorStatus: (reactorId: number, status: ReactorStatus) => Promise<boolean>;
  maintainReactor: (reactorId: number) => Promise<boolean>;
  repairReactor: (reactorId: number) => Promise<boolean>;
  addConnection: (fromX: number, fromY: number, toX: number, toY: number, type: ConnectionType) => Promise<boolean>;
  removeConnection: (connectionId: number) => Promise<boolean>;
  harvestEnergy: () => Promise<number>;
  recalculateGrid: () => void;
  refreshGrid: () => Promise<void>;
}

export function usePowerGrid(options: UsePowerGridOptions = {}): UsePowerGridReturn {
  const { planetId, moonId, gridSizeX = 10, gridSizeY = 10 } = options;

  const [grid, setGrid] = useState<PowerGrid | null>(null);
  const [reactors, setReactors] = useState<PowerReactor[]>([]);
  const [definitions, setDefinitions] = useState<ReactorDefinition[]>([]);
  const [connections, setConnections] = useState<GridConnection[]>([]);
  const [gridCells, setGridCells] = useState<GridCell[][]>([]);
  const [selectedReactor, setSelectedReactor] = useState<PowerReactor | null>(null);
  const [selectedDefinition, setSelectedDefinition] = useState<ReactorDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadDurationMs, setLoadDurationMs] = useState(0);
  const recalcTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastEnergyHarvest = useRef<number>(0);

  // Load all reactor definitions
  const loadDefinitions = useCallback(async () => {
    const { data, error: defError } = await supabase
      .from('reactor_definitions')
      .select('*')
      .order('tier', { ascending: true })
      .order('id', { ascending: true });

    if (defError) {
      console.error('Failed to load reactor definitions:', defError);
      return [];
    }

    return (data || []).map((d: Record<string, unknown>) => ({
      ...d,
      special_effects: typeof d.special_effects === 'string'
        ? JSON.parse(d.special_effects as string)
        : (d.special_effects || []),
    })) as ReactorDefinition[];
  }, []);

  // Load or create the power grid for this planet/moon
  const loadOrCreateGrid = useCallback(async (defs: ReactorDefinition[]) => {
    const filter = planetId
      ? { planet_id: planetId }
      : moonId
        ? { moon_id: moonId }
        : {};

    if (!planetId && !moonId) {
      setError('No planet or moon specified');
      setIsLoading(false);
      return null;
    }

    let { data: existingGrid } = await supabase
      .from('planet_power_grids')
      .select('*')
      .match(filter as Record<string, unknown>)
      .maybeSingle();

    if (!existingGrid) {
      const { data: newGrid, error: createError } = await supabase
        .from('planet_power_grids')
        .insert({
          ...filter,
          owner_id: (await supabase.auth.getUser()).data.user?.id || 'system',
          grid_name: planetId ? 'Planetary Power Grid' : 'Lunar Power Grid',
          grid_size_x: gridSizeX,
          grid_size_y: gridSizeY,
        })
        .select('*')
        .single();

      if (createError) {
        console.error('Failed to create grid:', createError);
        setError('Failed to create power grid');
        setIsLoading(false);
        return null;
      }
      existingGrid = newGrid;
    }

    return existingGrid as PowerGrid;
  }, [planetId, moonId, gridSizeX, gridSizeY]);

  // Load reactors for the grid
  const loadReactors = useCallback(async (gridId: number, defs: ReactorDefinition[]) => {
    const { data, error: reactorError } = await supabase
      .from('power_reactors')
      .select('*')
      .eq('grid_id', gridId);

    if (reactorError) {
      console.error('Failed to load reactors:', reactorError);
      return [];
    }

    return (data || []).map((r: PowerReactor) => ({
      ...r,
      definition: defs.find(d => d.id === r.definition_id),
    }));
  }, []);

  // Load connections for the grid
  const loadConnections = useCallback(async (gridId: number) => {
    const { data, error: connError } = await supabase
      .from('grid_connections')
      .select('*')
      .eq('grid_id', gridId);

    if (connError) {
      console.error('Failed to load connections:', connError);
      return [];
    }

    return data as GridConnection[];
  }, []);

  // Build the grid cells matrix
  const buildGridCells = useCallback((
    gridData: PowerGrid,
    reactorList: PowerReactor[],
    connList: GridConnection[]
  ): GridCell[][] => {
    const cells: GridCell[][] = [];

    for (let y = 0; y < gridData.grid_size_y; y++) {
      const row: GridCell[] = [];
      for (let x = 0; x < gridData.grid_size_x; x++) {
        const reactor = reactorList.find(r => r.grid_position_x === x && r.grid_position_y === y);
        const isConnected = connList.some(
          c => (c.from_node_x === x && c.from_node_y === y) ||
               (c.to_node_x === x && c.to_node_y === y)
        );

        row.push({
          x,
          y,
          hasReactor: !!reactor,
          reactor: reactor || undefined,
          isConnected,
          powerLoad: reactor?.current_output || 0,
          isSource: !!reactor && reactor.status === 'online',
        });
      }
      cells.push(row);
    }

    return cells;
  }, []);

  // Apply durability wear to online reactors
  const applyDurabilityWear = useCallback(async (reactorList: PowerReactor[]) => {
    const onlineReactors = reactorList.filter(r => r.status === 'online' && r.definition);
    if (onlineReactors.length === 0) return;

    for (const reactor of onlineReactors) {
      const wearRate = reactor.definition?.wear_rate_per_hour || 0.5;
      const hoursSinceMaintenance = Math.max(0,
        (Date.now() - new Date(reactor.last_maintenance_at).getTime()) / 3600000
      );
      const newDurability = Math.max(0, 100 - (hoursSinceMaintenance * wearRate));
      const newUptimeHours = (reactor.uptime_seconds || 0) / 3600 + hoursSinceMaintenance;

      if (Math.abs(newDurability - reactor.durability_pct) > 0.1) {
        await supabase.from('power_reactors').update({
          durability_pct: Math.floor(newDurability),
          total_uptime_hours: Math.floor(newUptimeHours),
        }).eq('id', reactor.id);
      }
    }
  }, []);

  // Recalculate total grid power
  const recalculateGrid = useCallback(() => {
    let totalGenerated = 0;
    let totalLoss = 0;

    reactors.forEach(reactor => {
      if (reactor.status === 'online' && reactor.definition) {
        const eff = calculateEffectiveEfficiency(reactor.efficiency_pct, reactor.durability_pct);
        const output = calculateReactorOutput(
          reactor.definition,
          reactor.reactor_level,
          eff,
          reactor.durability_pct
        );
        totalGenerated += output;
      }
    });

    // Calculate transmission losses
    connections.forEach(conn => {
      if (conn.status === 'active') {
        const distance = Math.sqrt(
          Math.pow(conn.to_node_x - conn.from_node_x, 2) +
          Math.pow(conn.to_node_y - conn.from_node_y, 2)
        );
        const loss = distance * 2 * (1 - conn.efficiency_pct / 100);
        totalLoss += loss;
      }
    });

    const netPower = totalGenerated - totalLoss;
    const efficiency = totalGenerated > 0 ? ((netPower / totalGenerated) * 100) : 0;

    if (grid) {
      const newStatus: GridStatus = netPower <= 0 ? 'offline'
        : efficiency < 50 ? 'overloaded'
        : 'active';

      setGrid(prev => prev ? {
        ...prev,
        total_power_generated: Math.floor(totalGenerated),
        total_power_loss: Math.floor(totalLoss),
        total_power_consumed: 0,
        grid_efficiency_pct: Math.floor(efficiency),
        status: newStatus,
      } : null);
    }
  }, [reactors, connections, grid]);

  // Full refresh
  const refreshGrid = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const t0 = performance.now();

    try {
      const defs = await loadDefinitions();
      setDefinitions(defs);

      const gridData = await loadOrCreateGrid(defs);
      if (!gridData) return;

      const reactorList = await loadReactors(gridData.id, defs);
      await applyDurabilityWear(reactorList);
      const refreshedReactors = await loadReactors(gridData.id, defs);

      const connList = await loadConnections(gridData.id);

      setGrid(gridData);
      setReactors(refreshedReactors);
      setConnections(connList);
      setGridCells(buildGridCells(gridData, refreshedReactors, connList));
      setLoadDurationMs(Math.round(performance.now() - t0));
    } catch (e) {
      console.error('Grid refresh failed:', e);
      setError('Failed to load power grid data');
    } finally {
      setIsLoading(false);
    }
  }, [loadDefinitions, loadOrCreateGrid, loadReactors, loadConnections, buildGridCells, applyDurabilityWear]);

  // Place a reactor on the grid
  const placeReactor = useCallback(async (definitionId: number, x: number, y: number): Promise<boolean> => {
    if (!grid) return false;

    const existingReactor = reactors.find(r => r.grid_position_x === x && r.grid_position_y === y);
    if (existingReactor) {
      setError('A reactor already occupies this grid position');
      return false;
    }

    const { error: placeError } = await supabase
      .from('power_reactors')
      .insert({
        grid_id: grid.id,
        definition_id: definitionId,
        grid_position_x: x,
        grid_position_y: y,
        current_output: 0,
        status: 'online',
        durability_pct: 100,
        last_maintenance_at: new Date().toISOString(),
        total_uptime_hours: 0,
      });

    if (placeError) {
      console.error('Failed to place reactor:', placeError);
      setError('Failed to place reactor');
      return false;
    }

    await refreshGrid();
    return true;
  }, [grid, reactors, refreshGrid]);

  // Remove a reactor
  const removeReactor = useCallback(async (reactorId: number): Promise<boolean> => {
    const { error: removeError } = await supabase
      .from('power_reactors')
      .delete()
      .eq('id', reactorId);

    if (removeError) {
      console.error('Failed to remove reactor:', removeError);
      setError('Failed to remove reactor');
      return false;
    }

    if (selectedReactor?.id === reactorId) {
      setSelectedReactor(null);
    }

    await refreshGrid();
    return true;
  }, [refreshGrid, selectedReactor]);

  // Upgrade a reactor level
  const upgradeReactor = useCallback(async (reactorId: number): Promise<boolean> => {
    const reactor = reactors.find(r => r.id === reactorId);
    if (!reactor || !reactor.definition) return false;
    if (reactor.reactor_level >= reactor.definition.max_level) {
      setError('Reactor is already at maximum level');
      return false;
    }

    const { error: upgradeError } = await supabase
      .from('power_reactors')
      .update({ reactor_level: reactor.reactor_level + 1 })
      .eq('id', reactorId);

    if (upgradeError) {
      console.error('Failed to upgrade reactor:', upgradeError);
      setError('Failed to upgrade reactor');
      return false;
    }

    await refreshGrid();
    return true;
  }, [reactors, refreshGrid]);

  // Toggle reactor status
  const toggleReactorStatus = useCallback(async (reactorId: number, status: ReactorStatus): Promise<boolean> => {
    const { error: statusError } = await supabase
      .from('power_reactors')
      .update({ status })
      .eq('id', reactorId);

    if (statusError) {
      console.error('Failed to update reactor status:', statusError);
      return false;
    }

    await refreshGrid();
    return true;
  }, [refreshGrid]);

  // Maintain reactor — restore durability
  const maintainReactor = useCallback(async (reactorId: number): Promise<boolean> => {
    const reactor = reactors.find(r => r.id === reactorId);
    if (!reactor || !reactor.definition) return false;
    if (reactor.status === 'maintenance') {
      setError('Reactor is already undergoing maintenance');
      return false;
    }

    const { data: user } = await supabase.auth.getUser();
    const userId = user.user?.id;
    if (!userId) return false;

    // Deduct maintenance costs
    const { data: resources } = await supabase
      .from('player_resources')
      .select('metal, crystal, deuterium')
      .eq('user_id', userId)
      .maybeSingle();

    const costMetal = reactor.definition.maintenance_cost_metal || 100;
    const costCrystal = reactor.definition.maintenance_cost_crystal || 50;
    const costDeut = reactor.definition.maintenance_cost_deuterium || 25;

    if (!resources || Number(resources.metal) < costMetal || Number(resources.crystal) < costCrystal || Number(resources.deuterium) < costDeut) {
      setError('Insufficient resources for maintenance');
      return false;
    }

    // Deduct costs and set maintenance status
    await supabase.from('player_resources').update({
      metal: Number(resources.metal) - costMetal,
      crystal: Number(resources.crystal) - costCrystal,
      deuterium: Number(resources.deuterium) - costDeut,
    }).eq('user_id', userId);

    await supabase.from('power_reactors').update({
      status: 'maintenance',
    }).eq('id', reactorId);

    // Simulate maintenance time, then restore
    const maintenanceTime = (reactor.definition.maintenance_time_seconds || 60) * 1000;
    setTimeout(async () => {
      await supabase.from('power_reactors').update({
        status: 'online',
        durability_pct: 100,
        last_maintenance_at: new Date().toISOString(),
      }).eq('id', reactorId);
      await refreshGrid();
    }, Math.min(maintenanceTime, 3000)); // Cap at 3s for UX

    await refreshGrid();
    return true;
  }, [reactors, refreshGrid]);

  // Repair reactor — fix damaged reactor
  const repairReactor = useCallback(async (reactorId: number): Promise<boolean> => {
    const reactor = reactors.find(r => r.id === reactorId);
    if (!reactor || !reactor.definition) return false;
    if (reactor.status !== 'damaged' && reactor.status !== 'meltdown') {
      setError('Reactor does not need repair');
      return false;
    }

    const { data: user } = await supabase.auth.getUser();
    const userId = user.user?.id;
    if (!userId) return false;

    const { data: resources } = await supabase
      .from('player_resources')
      .select('metal, crystal, deuterium')
      .eq('user_id', userId)
      .maybeSingle();

    const repairCostMult = reactor.status === 'meltdown' ? 5 : 3;
    const costMetal = (reactor.definition.maintenance_cost_metal || 100) * repairCostMult;
    const costCrystal = (reactor.definition.maintenance_cost_crystal || 50) * repairCostMult;
    const costDeut = (reactor.definition.maintenance_cost_deuterium || 25) * repairCostMult;

    if (!resources || Number(resources.metal) < costMetal || Number(resources.crystal) < costCrystal || Number(resources.deuterium) < costDeut) {
      setError('Insufficient resources for repair');
      return false;
    }

    await supabase.from('player_resources').update({
      metal: Number(resources.metal) - costMetal,
      crystal: Number(resources.crystal) - costCrystal,
      deuterium: Number(resources.deuterium) - costDeut,
    }).eq('user_id', userId);

    await supabase.from('power_reactors').update({
      status: 'maintenance',
      durability_pct: 50,
    }).eq('id', reactorId);

    setTimeout(async () => {
      await supabase.from('power_reactors').update({
        status: 'online',
        durability_pct: 75,
        last_maintenance_at: new Date().toISOString(),
      }).eq('id', reactorId);
      await refreshGrid();
    }, 3000);

    await refreshGrid();
    return true;
  }, [reactors, refreshGrid]);

  // Add a connection between grid cells
  const addConnection = useCallback(async (
    fromX: number, fromY: number,
    toX: number, toY: number,
    type: ConnectionType
  ): Promise<boolean> => {
    if (!grid) return false;

    const existingConn = connections.find(c =>
      (c.from_node_x === fromX && c.from_node_y === fromY &&
       c.to_node_x === toX && c.to_node_y === toY) ||
      (c.from_node_x === toX && c.from_node_y === toY &&
       c.to_node_x === fromX && c.to_node_y === fromY)
    );

    if (existingConn) {
      setError('Connection already exists between these nodes');
      return false;
    }

    const { error: connError } = await supabase
      .from('grid_connections')
      .insert({
        grid_id: grid.id,
        from_node_x: fromX,
        from_node_y: fromY,
        to_node_x: toX,
        to_node_y: toY,
        connection_type: type,
        max_capacity: type === 'standard' ? 1000 : type === 'high_voltage' ? 5000 : type === 'superconductor' ? 20000 : 100000,
        efficiency_pct: type === 'standard' ? 95 : type === 'high_voltage' ? 92 : type === 'superconductor' ? 98 : 99.5,
      });

    if (connError) {
      console.error('Failed to add connection:', connError);
      setError('Failed to add connection');
      return false;
    }

    await refreshGrid();
    return true;
  }, [grid, connections, refreshGrid]);

  // Remove a connection
  const removeConnection = useCallback(async (connectionId: number): Promise<boolean> => {
    const { error: removeError } = await supabase
      .from('grid_connections')
      .delete()
      .eq('id', connectionId);

    if (removeError) {
      console.error('Failed to remove connection:', removeError);
      return false;
    }

    await refreshGrid();
    return true;
  }, [refreshGrid]);

  // Harvest energy from grid surplus into player resources
  const harvestEnergy = useCallback(async (): Promise<number> => {
    if (!grid) return 0;

    const { data: user } = await supabase.auth.getUser();
    const userId = user.user?.id;
    if (!userId) return 0;

    const netPower = Math.max(0, grid.total_power_generated - grid.total_power_consumed - grid.total_power_loss);
    const now = Date.now();
    const timeSinceLastHarvest = Math.max(1, (now - lastEnergyHarvest.current) / 1000);
    lastEnergyHarvest.current = now;

    // Energy conversion: 1000 power units = 1 energy resource unit per second of surplus
    const energyAmount = Math.floor((netPower / 1000) * Math.min(timeSinceLastHarvest, 300));
    if (energyAmount <= 0) return 0;

    const { data: resources } = await supabase
      .from('player_resources')
      .select('energy')
      .eq('user_id', userId)
      .maybeSingle();

    const currentEnergy = Number(resources?.energy || 0);

    await supabase.from('player_resources').update({
      energy: currentEnergy + energyAmount,
    }).eq('user_id', userId);

    return energyAmount;
  }, [grid]);

  const selectReactorFn = useCallback((reactor: PowerReactor | null) => {
    setSelectedReactor(reactor);
    setSelectedDefinition(reactor?.definition || null);
  }, []);

  const selectDefinitionFn = useCallback((def: ReactorDefinition | null) => {
    setSelectedDefinition(def);
  }, []);

  // Initial load
  useEffect(() => {
    refreshGrid();
  }, [refreshGrid]);

  // Recalculate periodically + auto-harvest energy
  useEffect(() => {
    if (reactors.length > 0) {
      recalcTimer.current = setTimeout(() => {
        recalculateGrid();
        // Auto-harvest small amounts of energy every recalc
        harvestEnergy();
      }, 5000);
    }
    return () => {
      if (recalcTimer.current) clearTimeout(recalcTimer.current);
    };
  }, [reactors, connections, recalculateGrid, harvestEnergy]);

  return {
    grid,
    reactors,
    definitions,
    connections,
    gridCells,
    selectedReactor,
    selectedDefinition,
    isLoading,
    error,
    loadDurationMs,
    selectReactor: selectReactorFn,
    selectDefinition: selectDefinitionFn,
    placeReactor,
    removeReactor,
    upgradeReactor,
    toggleReactorStatus,
    maintainReactor,
    repairReactor,
    addConnection,
    removeConnection,
    harvestEnergy,
    recalculateGrid,
    refreshGrid,
  };
}