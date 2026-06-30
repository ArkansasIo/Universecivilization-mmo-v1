import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export interface BuildingConnection {
  id: number;
  building_id: number;
  grid_id: number;
  connection_node_x: number;
  connection_node_y: number;
  power_draw: number;
  priority: 'critical' | 'high' | 'normal' | 'low' | 'offline';
  is_connected: boolean;
  building_type?: string;
  building_level?: number;
  building_name?: string;
}

export interface DemandSnapshot {
  totalDemand: number;
  totalSupply: number;
  surplus: number;
  deficit: number;
  demandPct: number;
  status: 'surplus' | 'balanced' | 'strained' | 'critical' | 'blackout';
  criticalLoad: number;
  highLoad: number;
  normalLoad: number;
  lowLoad: number;
  buildingCount: number;
  connectedCount: number;
}

interface UsePowerConsumptionOptions {
  gridId?: number;
  planetId?: string;
}

interface UsePowerConsumptionReturn {
  connections: BuildingConnection[];
  snapshot: DemandSnapshot;
  isLoading: boolean;
  error: string | null;
  connectBuilding: (buildingId: number, nodeX: number, nodeY: number, priority?: string) => Promise<boolean>;
  disconnectBuilding: (buildingId: number) => Promise<boolean>;
  setBuildingPowerDraw: (buildingId: number, draw: number) => Promise<boolean>;
  setBuildingPriority: (buildingId: number, priority: string) => Promise<boolean>;
  emergencyShedLoad: (priority: string) => Promise<number>;
  refresh: () => Promise<void>;
}

export function usePowerConsumption(options: UsePowerConsumptionOptions = {}): UsePowerConsumptionReturn {
  const { gridId, planetId } = options;

  const [connections, setConnections] = useState<BuildingConnection[]>([]);
  const [snapshot, setSnapshot] = useState<DemandSnapshot>({
    totalDemand: 0, totalSupply: 0, surplus: 0, deficit: 0, demandPct: 0,
    status: 'surplus', criticalLoad: 0, highLoad: 0, normalLoad: 0, lowLoad: 0,
    buildingCount: 0, connectedCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const calculateSnapshot = useCallback(async () => {
    try {
      // Get grid supply
      let gridQuery = supabase.from('planet_power_grids').select('*');
      if (gridId) gridQuery = gridQuery.eq('id', gridId);
      else if (planetId) gridQuery = gridQuery.eq('planet_id', planetId);
      else return;

      const { data: grid } = await gridQuery.maybeSingle();
      if (!grid) return;

      // Get building connections
      const { data: buildingConns } = await supabase
        .from('building_power_connections')
        .select('*')
        .eq('grid_id', grid.id);

      const conns = buildingConns || [];

      // Get building details for connected buildings
      const buildingIds = conns.map((c: Record<string, unknown>) => c.building_id as number).filter(Boolean);
      let buildingMap: Record<number, { type: string; level: number }> = {};
      if (buildingIds.length > 0) {
        const { data: buildings } = await supabase
          .from('buildings')
          .select('id, building_type, level, power_consumption')
          .in('id', buildingIds);

        (buildings || []).forEach((b: Record<string, unknown>) => {
          buildingMap[b.id as number] = {
            type: (b.building_type as string) || 'unknown',
            level: (b.level as number) || 1,
          };
        });
      }

      // Also get total buildings on planet
      const { count: totalBuildings } = await supabase
        .from('buildings')
        .select('*', { count: 'exact', head: true })
        .eq('planet_id', planetId ? parseInt(planetId) : 0);

      // Calculate demand breakdown
      let criticalLoad = 0, highLoad = 0, normalLoad = 0, lowLoad = 0;
      const enrichedConns: BuildingConnection[] = conns.map((c: Record<string, unknown>) => {
        const draw = Number(c.power_draw || 0);
        const priority = (c.priority as string) || 'normal';
        if (priority === 'critical') criticalLoad += draw;
        else if (priority === 'high') highLoad += draw;
        else if (priority === 'normal') normalLoad += draw;
        else if (priority === 'low') lowLoad += draw;

        const bld = buildingMap[c.building_id as number];
        return {
          id: c.id as number,
          building_id: c.building_id as number,
          grid_id: c.grid_id as number,
          connection_node_x: c.connection_node_x as number,
          connection_node_y: c.connection_node_y as number,
          power_draw: draw,
          priority: priority as BuildingConnection['priority'],
          is_connected: (c.is_connected as boolean) || false,
          building_type: bld?.type,
          building_level: bld?.level,
          building_name: bld ? `${bld.type} Lv.${bld.level}` : 'Unknown',
        };
      });

      const totalDemand = criticalLoad + highLoad + normalLoad + lowLoad;
      const totalSupply = Number(grid.total_power_generated || 0);
      const surplus = totalSupply - totalDemand;
      const deficit = Math.max(0, totalDemand - totalSupply);
      const demandPct = totalSupply > 0 ? (totalDemand / totalSupply) * 100 : 0;

      let status: DemandSnapshot['status'] = 'surplus';
      if (demandPct >= 110) status = 'blackout';
      else if (demandPct >= 95) status = 'critical';
      else if (demandPct >= 75) status = 'strained';
      else if (demandPct >= 50) status = 'balanced';

      setSnapshot({
        totalDemand: Math.floor(totalDemand),
        totalSupply,
        surplus: Math.floor(surplus),
        deficit: Math.floor(deficit),
        demandPct: Math.floor(demandPct),
        status,
        criticalLoad: Math.floor(criticalLoad),
        highLoad: Math.floor(highLoad),
        normalLoad: Math.floor(normalLoad),
        lowLoad: Math.floor(lowLoad),
        buildingCount: totalBuildings || 0,
        connectedCount: conns.filter((c: Record<string, unknown>) => c.is_connected).length,
      });

      setConnections(enrichedConns);
    } catch (e) {
      console.error('Failed to calculate snapshot:', e);
    }
  }, [gridId, planetId]);

  const getGridId = useCallback(async (): Promise<number | null> => {
    if (gridId) return gridId;
    if (!planetId) return null;
    const { data } = await supabase.from('planet_power_grids').select('id').eq('planet_id', planetId).maybeSingle();
    return data?.id || null;
  }, [gridId, planetId]);

  const connectBuilding = useCallback(async (buildingId: number, nodeX: number, nodeY: number, priority: string = 'normal'): Promise<boolean> => {
    const gid = await getGridId();
    if (!gid) { setError('No power grid found'); return false; }

    const { data: building } = await supabase.from('buildings').select('power_consumption').eq('id', buildingId).maybeSingle();
    const draw = building ? Number(building.power_consumption) : 25;

    const { error: insErr } = await supabase.from('building_power_connections').insert({
      building_id: buildingId,
      grid_id: gid,
      connection_node_x: nodeX,
      connection_node_y: nodeY,
      power_draw: draw,
      priority,
      is_connected: true,
    });

    if (insErr) { setError('Failed to connect building'); return false; }
    await calculateSnapshot();
    return true;
  }, [getGridId, calculateSnapshot]);

  const disconnectBuilding = useCallback(async (buildingId: number): Promise<boolean> => {
    const gid = await getGridId();
    if (!gid) return false;

    const { error: delErr } = await supabase
      .from('building_power_connections')
      .delete()
      .eq('building_id', buildingId)
      .eq('grid_id', gid);

    if (delErr) { setError('Failed to disconnect building'); return false; }
    await calculateSnapshot();
    return true;
  }, [getGridId, calculateSnapshot]);

  const setBuildingPowerDraw = useCallback(async (buildingId: number, draw: number): Promise<boolean> => {
    const gid = await getGridId();
    if (!gid) return false;

    const { error: updErr } = await supabase
      .from('building_power_connections')
      .update({ power_draw: draw })
      .eq('building_id', buildingId)
      .eq('grid_id', gid);

    if (updErr) return false;
    await calculateSnapshot();
    return true;
  }, [getGridId, calculateSnapshot]);

  const setBuildingPriority = useCallback(async (buildingId: number, priority: string): Promise<boolean> => {
    const gid = await getGridId();
    if (!gid) return false;

    const { error: updErr } = await supabase
      .from('building_power_connections')
      .update({ priority })
      .eq('building_id', buildingId)
      .eq('grid_id', gid);

    if (updErr) return false;
    await calculateSnapshot();
    return true;
  }, [getGridId, calculateSnapshot]);

  const emergencyShedLoad = useCallback(async (priority: string): Promise<number> => {
    const gid = await getGridId();
    if (!gid) return 0;

    const { data: conns } = await supabase
      .from('building_power_connections')
      .select('*')
      .eq('grid_id', gid)
      .eq('is_connected', true)
      .eq('priority', priority);

    if (!conns || conns.length === 0) return 0;

    const { error: shedErr } = await supabase
      .from('building_power_connections')
      .update({ is_connected: false })
      .eq('grid_id', gid)
      .eq('priority', priority);

    if (shedErr) return 0;
    await calculateSnapshot();
    return conns.length;
  }, [getGridId, calculateSnapshot]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    await calculateSnapshot();
    setIsLoading(false);
  }, [calculateSnapshot]);

  // Initial load + polling
  useEffect(() => {
    refresh();
    pollTimer.current = setInterval(() => calculateSnapshot(), 5000);
    return () => { if (pollTimer.current) clearInterval(pollTimer.current); };
  }, [refresh, calculateSnapshot]);

  return {
    connections, snapshot, isLoading, error,
    connectBuilding, disconnectBuilding,
    setBuildingPowerDraw, setBuildingPriority,
    emergencyShedLoad, refresh,
  };
}