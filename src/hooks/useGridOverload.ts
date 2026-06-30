import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export type OverloadSeverity = 'warning' | 'danger' | 'critical' | 'meltdown';
export type OverloadEventType = 'overload_warning' | 'overload_danger' | 'cascade_failure' | 'reactor_meltdown' | 'grid_collapse' | 'emergency_scram' | 'safety_relief' | 'stabilization';
export type OverloadEventStatus = 'active' | 'contained' | 'resolved' | 'meltdown_occurred';

export interface OverloadEvent {
  id: number;
  grid_id: number;
  event_type: OverloadEventType;
  severity: OverloadSeverity;
  status: OverloadEventStatus;
  meltdown_risk_pct: number;
  affected_reactor_id: number | null;
  trigger_reason: string;
  demand_at_trigger: number;
  supply_at_trigger: number;
  efficiency_at_trigger: number;
  cascade_count: number;
  damage_dealt: number;
  reactor_name?: string;
  reactor_type?: string;
  resolved_at?: string;
  created_at: string;
}

export interface GridRiskAssessment {
  overallRisk: number;
  reactorRisks: { reactorId: number; risk: number; stability: number; name: string; type: string }[];
  cascadeProbability: number;
  maxSafeLoad: number;
  currentLoad: number;
  loadPct: number;
  status: 'stable' | 'caution' | 'unstable' | 'critical';
  activeEvents: number;
  containedEvents: number;
}

interface UseGridOverloadOptions {
  gridId?: number;
  planetId?: string;
}

interface UseGridOverloadReturn {
  events: OverloadEvent[];
  risk: GridRiskAssessment;
  isLoading: boolean;
  error: string | null;
  resolveEvent: (eventId: number) => Promise<boolean>;
  scramReactor: (reactorId: number) => Promise<boolean>;
  triggerEmergencyStabilization: () => Promise<boolean>;
  refresh: () => Promise<void>;
}

export function useGridOverload(options: UseGridOverloadOptions = {}): UseGridOverloadReturn {
  const { gridId, planetId } = options;

  const [events, setEvents] = useState<OverloadEvent[]>([]);
  const [risk, setRisk] = useState<GridRiskAssessment>({
    overallRisk: 0, reactorRisks: [], cascadeProbability: 0,
    maxSafeLoad: 0, currentLoad: 0, loadPct: 0, status: 'stable',
    activeEvents: 0, containedEvents: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const simTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const getGridId = useCallback(async (): Promise<number | null> => {
    if (gridId) return gridId;
    if (!planetId) return null;
    const { data } = await supabase.from('planet_power_grids').select('id').eq('planet_id', planetId).maybeSingle();
    return data?.id || null;
  }, [gridId, planetId]);

  const calculateMeltdownRisk = useCallback(async () => {
    const gid = await getGridId();
    if (!gid) return;

    try {
      // Get grid status
      const { data: grid } = await supabase.from('planet_power_grids').select('*').eq('id', gid).maybeSingle();
      if (!grid) return;

      // Get all reactors
      const { data: reactors } = await supabase
        .from('power_reactors')
        .select('id, definition_id, reactor_level, efficiency_pct, status')
        .eq('grid_id', gid);

      // Get reactor definitions for stability ratings
      const defIds = (reactors || []).map((r: Record<string, unknown>) => r.definition_id);
      const { data: defs } = await supabase
        .from('reactor_definitions')
        .select('id, reactor_name, reactor_type, stability_rating, meltdown_risk_pct, sub_class')
        .in('id', defIds.length > 0 ? defIds : [0]);

      const defMap: Record<number, Record<string, unknown>> = {};
      (defs || []).forEach((d: Record<string, unknown>) => { defMap[d.id as number] = d; });

      // Get demand from building connections
      const { data: conns } = await supabase
        .from('building_power_connections')
        .select('power_draw, is_connected')
        .eq('grid_id', gid)
        .eq('is_connected', true);

      const totalDemand = (conns || []).reduce((sum: number, c: Record<string, unknown>) => sum + Number(c.power_draw || 0), 0);
      const totalSupply = Number(grid.total_power_generated || 0);

      // Calculate risk per reactor
      const loadRatio = totalSupply > 0 ? totalDemand / totalSupply : 1;
      const reactorRisks = (reactors || []).map((r: Record<string, unknown>) => {
        const def = defMap[r.definition_id as number];
        const stability = def ? Number(def.stability_rating || 50) : 50;
        const baseRisk = def ? Number(def.meltdown_risk_pct || 5) : 5;
        const isOnline = (r.status as string) === 'online';
        const effPct = Number(r.efficiency_pct || 100);

        // Risk formula: base risk increases with load ratio, decreases with stability
        let risk = isOnline ? baseRisk * Math.pow(loadRatio, 3) * (100 / (stability + 10)) : 0;
        // Efficiency penalty: running at low efficiency increases risk
        if (effPct < 80) risk *= 1 + (80 - effPct) / 40;
        // Clamp
        risk = Math.min(100, Math.max(0, Math.floor(risk)));

        return {
          reactorId: r.id as number,
          risk,
          stability,
          name: (def?.reactor_name as string) || 'Unknown Reactor',
          type: (def?.reactor_type as string) || 'Unknown',
        };
      });

      const maxRisk = reactorRisks.length > 0
        ? Math.max(...reactorRisks.map(r => r.risk))
        : 0;

      const avgRisk = reactorRisks.length > 0
        ? reactorRisks.reduce((s, r) => s + r.risk, 0) / reactorRisks.length
        : 0;

      const cascadeProb = reactorRisks.filter(r => r.risk > 60).length * 15;

      let status: GridRiskAssessment['status'] = 'stable';
      if (maxRisk >= 90 || cascadeProb >= 80) status = 'critical';
      else if (maxRisk >= 60 || cascadeProb >= 40) status = 'unstable';
      else if (maxRisk >= 30) status = 'caution';

      // Count active/contained events
      const { data: activeEvts } = await supabase
        .from('grid_overload_events')
        .select('id, status', { count: 'exact' })
        .eq('grid_id', gid)
        .in('status', ['active', 'contained']);

      const activeCount = (activeEvts || []).filter((e: Record<string, unknown>) => e.status === 'active').length;
      const containedCount = (activeEvts || []).filter((e: Record<string, unknown>) => e.status === 'contained').length;

      setRisk({
        overallRisk: Math.floor(avgRisk),
        reactorRisks,
        cascadeProbability: Math.floor(cascadeProb),
        maxSafeLoad: Math.floor(totalSupply * 0.85),
        currentLoad: Math.floor(totalDemand),
        loadPct: Math.floor(loadRatio * 100),
        status,
        activeEvents: activeCount,
        containedEvents: containedCount,
      });

      // Auto-trigger events based on threshold crossings
      if (maxRisk >= 95 && activeCount === 0) {
        // Auto-trigger meltdown event for the most at-risk reactor
        const mostAtRisk = reactorRisks.reduce((a, b) => a.risk > b.risk ? a : b, reactorRisks[0]);
        if (mostAtRisk && mostAtRisk.risk >= 95) {
          await supabase.from('grid_overload_events').insert({
            grid_id: gid,
            event_type: 'reactor_meltdown',
            severity: 'meltdown',
            status: 'active',
            meltdown_risk_pct: mostAtRisk.risk,
            affected_reactor_id: mostAtRisk.reactorId,
            trigger_reason: `Reactor ${mostAtRisk.name} — stability failure at ${mostAtRisk.risk}% risk threshold. Load ratio: ${loadRatio.toFixed(2)}`,
            demand_at_trigger: Math.floor(totalDemand),
            supply_at_trigger: Math.floor(totalSupply),
            efficiency_at_trigger: Math.floor(Number(grid.grid_efficiency_pct || 50)),
            cascade_count: reactorRisks.filter(r => r.risk > 75).length,
          });

          // Damage the reactor
          await supabase.from('power_reactors').update({
            status: 'meltdown',
            current_output: 0,
            efficiency_pct: 0,
          }).eq('id', mostAtRisk.reactorId);

          // Cascade to adjacent reactors
          for (const adj of reactorRisks) {
            if (adj.reactorId !== mostAtRisk.reactorId && adj.risk > 60) {
              await supabase.from('power_reactors').update({
                status: 'damaged',
                efficiency_pct: Math.max(0, Number((reactors || []).find((r: Record<string, unknown>) => r.id === adj.reactorId)?.efficiency_pct || 50) - 30),
              }).eq('id', adj.reactorId);
            }
          }
        }
      } else if (maxRisk >= 75 && maxRisk < 95 && activeCount === 0) {
        await supabase.from('grid_overload_events').insert({
          grid_id: gid,
          event_type: 'cascade_failure',
          severity: 'critical',
          status: 'active',
          meltdown_risk_pct: maxRisk,
          affected_reactor_id: reactorRisks.find(r => r.risk >= 75)?.reactorId || null,
          trigger_reason: `Critical cascade risk — ${cascadeProb}% cascade probability. Load: ${Math.floor(loadRatio * 100)}%`,
          demand_at_trigger: Math.floor(totalDemand),
          supply_at_trigger: Math.floor(totalSupply),
          efficiency_at_trigger: Math.floor(Number(grid.grid_efficiency_pct || 50)),
          cascade_count: reactorRisks.filter(r => r.risk > 60).length,
        });
      } else if (maxRisk >= 50 && maxRisk < 75 && activeCount === 0) {
        await supabase.from('grid_overload_events').insert({
          grid_id: gid,
          event_type: 'overload_danger',
          severity: 'danger',
          status: 'active',
          meltdown_risk_pct: maxRisk,
          affected_reactor_id: null,
          trigger_reason: `Grid approaching critical load — ${Math.floor(loadRatio * 100)}% demand/supply ratio. ${reactorRisks.filter(r => r.risk > 50).length} reactors at risk.`,
          demand_at_trigger: Math.floor(totalDemand),
          supply_at_trigger: Math.floor(totalSupply),
          efficiency_at_trigger: Math.floor(Number(grid.grid_efficiency_pct || 50)),
          cascade_count: 0,
        });
      }

    } catch (e) {
      console.error('Meltdown risk calc failed:', e);
    }
  }, [getGridId]);

  const loadEvents = useCallback(async () => {
    const gid = await getGridId();
    if (!gid) { setIsLoading(false); return; }

    const { data: evtData, error: evtErr } = await supabase
      .from('grid_overload_events')
      .select('*')
      .eq('grid_id', gid)
      .order('created_at', { ascending: false })
      .limit(50);

    if (evtErr) { setError('Failed to load overload events'); return; }

    // Enrich with reactor names
    const enriched: OverloadEvent[] = [];
    for (const e of (evtData || [])) {
      let reactorName = 'N/A';
      let reactorType = 'N/A';
      if (e.affected_reactor_id) {
        const { data: reactor } = await supabase
          .from('power_reactors')
          .select('definition_id')
          .eq('id', e.affected_reactor_id)
          .maybeSingle();
        if (reactor) {
          const { data: def } = await supabase
            .from('reactor_definitions')
            .select('reactor_name, reactor_type')
            .eq('id', reactor.definition_id)
            .maybeSingle();
          if (def) {
            reactorName = def.reactor_name as string;
            reactorType = def.reactor_type as string;
          }
        }
      }
      enriched.push({ ...e as OverloadEvent, reactor_name: reactorName, reactor_type: reactorType });
    }

    setEvents(enriched.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
  }, [getGridId]);

  const resolveEvent = useCallback(async (eventId: number): Promise<boolean> => {
    const { error: resErr } = await supabase
      .from('grid_overload_events')
      .update({ status: 'resolved', resolved_at: new Date().toISOString() })
      .eq('id', eventId);

    if (resErr) { setError('Failed to resolve event'); return false; }
    await loadEvents();
    return true;
  }, [loadEvents]);

  const scramReactor = useCallback(async (reactorId: number): Promise<boolean> => {
    const gid = await getGridId();
    if (!gid) return false;

    // Emergency shutdown a reactor
    await supabase.from('power_reactors').update({
      status: 'offline',
      current_output: 0,
    }).eq('id', reactorId);

    // Log the SCRAM event
    await supabase.from('grid_overload_events').insert({
      grid_id: gid,
      event_type: 'emergency_scram',
      severity: 'warning',
      status: 'resolved',
      meltdown_risk_pct: 0,
      affected_reactor_id: reactorId,
      trigger_reason: 'Manual emergency SCRAM triggered by operator.',
      demand_at_trigger: risk.currentLoad,
      supply_at_trigger: risk.currentLoad,
      efficiency_at_trigger: 0,
      cascade_count: 0,
    });

    await Promise.all([loadEvents(), calculateMeltdownRisk()]);
    return true;
  }, [getGridId, loadEvents, calculateMeltdownRisk, risk]);

  const triggerEmergencyStabilization = useCallback(async (): Promise<boolean> => {
    const gid = await getGridId();
    if (!gid) return false;

    // Shut down all low-priority building connections
    await supabase.from('building_power_connections').update({ is_connected: false })
      .eq('grid_id', gid)
      .in('priority', ['low', 'normal']);

    // Log stabilization event
    await supabase.from('grid_overload_events').insert({
      grid_id: gid,
      event_type: 'stabilization',
      severity: 'warning',
      status: 'resolved',
      meltdown_risk_pct: risk.overallRisk,
      affected_reactor_id: null,
      trigger_reason: 'Emergency grid stabilization — non-critical loads shed.',
      demand_at_trigger: risk.currentLoad,
      supply_at_trigger: risk.maxSafeLoad,
      efficiency_at_trigger: 0,
      cascade_count: 0,
    });

    await loadEvents();

    // Resolve all active events
    for (const evt of events.filter(e => e.status === 'active')) {
      await supabase.from('grid_overload_events').update({
        status: 'contained',
        resolved_at: new Date().toISOString(),
      }).eq('id', evt.id);
    }

    await Promise.all([loadEvents(), calculateMeltdownRisk()]);
    return true;
  }, [getGridId, loadEvents, calculateMeltdownRisk, risk, events]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    await Promise.all([loadEvents(), calculateMeltdownRisk()]);
    setIsLoading(false);
  }, [loadEvents, calculateMeltdownRisk]);

  // Poll every 8 seconds for risk assessment and events
  useEffect(() => {
    refresh();
    simTimer.current = setInterval(() => {
      calculateMeltdownRisk();
      loadEvents();
    }, 8000);
    return () => { if (simTimer.current) clearInterval(simTimer.current); };
  }, [refresh, calculateMeltdownRisk, loadEvents]);

  return {
    events, risk, isLoading, error,
    resolveEvent, scramReactor, triggerEmergencyStabilization, refresh,
  };
}