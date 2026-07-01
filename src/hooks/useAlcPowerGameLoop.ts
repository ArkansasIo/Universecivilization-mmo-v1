import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { AlcEffects } from './useAlcSystemEffects';

const POWER_TICK_INTERVAL = 5000;
const SURPLUS_CONVERSION_RATE = 0.001;

interface PowerGameLoopOptions {
  planetId?: string;
  getAlcEffects: () => AlcEffects;
  isEnabled?: boolean;
}

interface PriorityLoad {
  id: number;
  building_id: number;
  power_draw: number;
  priority: 'critical' | 'high' | 'normal' | 'low';
  is_connected: boolean;
}

const PRIORITY_ORDER: ('low' | 'normal' | 'high' | 'critical')[] = ['low', 'normal', 'high', 'critical'];

export function useAlcPowerGameLoop(options: PowerGameLoopOptions) {
  const { planetId, getAlcEffects, isEnabled = true } = options;
  const { user } = useAuth();
  const processingRef = useRef(false);
  const mountedRef = useRef(true);
  const blackoutRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const processPowerTick = useCallback(async () => {
    if (!user || !planetId || processingRef.current || !mountedRef.current) return;
    processingRef.current = true;

    try {
      const { data: grid } = await supabase
        .from('planet_power_grids')
        .select('*')
        .eq('planet_id', planetId)
        .maybeSingle();

      if (!grid) return;

      const { data: conns } = await supabase
        .from('building_power_connections')
        .select('*')
        .eq('grid_id', grid.id);

      const loads: PriorityLoad[] = (conns || []).map(c => ({
        id: c.id,
        building_id: c.building_id,
        power_draw: Number(c.power_draw || 0),
        priority: c.priority as PriorityLoad['priority'],
        is_connected: c.is_connected,
      }));

      const totalDemand = loads.reduce((sum, l) => sum + l.power_draw, 0);
      const totalSupply = Number(grid.total_power_generated || 0);
      const deficit = Math.max(0, totalDemand - totalSupply);
      const surplus = Math.max(0, totalSupply - totalDemand);

      const alc = getAlcEffects();

      if (deficit > 0) {
        let remainingDeficit = deficit;

        for (const priority of PRIORITY_ORDER) {
          if (remainingDeficit <= 0) break;

          const targetLoads = loads.filter(l => l.priority === priority && l.is_connected);
          for (const load of targetLoads) {
            if (remainingDeficit <= 0) break;
            if (load.power_draw <= 0) continue;

            await supabase
              .from('building_power_connections')
              .update({ is_connected: false })
              .eq('id', load.id);

            remainingDeficit -= load.power_draw;
          }
        }

        if (remainingDeficit > 0) {
          blackoutRef.current = true;
        }

        await supabase
          .from('planet_power_grids')
          .update({ total_power_consumed: Math.floor(totalDemand - deficit + remainingDeficit) })
          .eq('id', grid.id);
      } else if (surplus > 0) {
        const restoredLoads = loads.filter(l => !l.is_connected);
        let remainingSurplus = surplus;

        for (const priority of [...PRIORITY_ORDER].reverse()) {
          if (remainingSurplus <= 0) break;

          const offlineLoads = restoredLoads.filter(l => l.priority === priority);
          for (const load of offlineLoads) {
            if (remainingSurplus < load.power_draw) break;
            if (load.power_draw <= 0) continue;

            await supabase
              .from('building_power_connections')
              .update({ is_connected: true })
              .eq('id', load.id);

            remainingSurplus -= load.power_draw;
          }
        }

        if (blackoutRef.current && loads.every(l => l.is_connected)) {
          blackoutRef.current = false;
        }

        const energyAmount = Math.floor(surplus * SURPLUS_CONVERSION_RATE * (1 + alc.allEnergyMultiplier));
        if (energyAmount > 0) {
          const { data: resources } = await supabase
            .from('player_resources')
            .select('energy')
            .eq('user_id', user.id)
            .maybeSingle();

          if (resources) {
            await supabase
              .from('player_resources')
              .update({ energy: Number(resources.energy || 0) + energyAmount })
              .eq('user_id', user.id);
          }
        }

        await supabase
          .from('planet_power_grids')
          .update({ total_power_consumed: Math.floor(totalDemand) })
          .eq('id', grid.id);
      }
    } catch (e) {
      if (mountedRef.current) {
        console.warn('ALC power game loop tick error:', e);
      }
    } finally {
      processingRef.current = false;
    }
  }, [user, planetId, getAlcEffects]);

  const recoverGrid = useCallback(async () => {
    if (!user || !planetId || !mountedRef.current) return;

    try {
      const { data: grid } = await supabase
        .from('planet_power_grids')
        .select('*')
        .eq('planet_id', planetId)
        .maybeSingle();

      if (!grid) return;

      const { data: conns } = await supabase
        .from('building_power_connections')
        .select('*')
        .eq('grid_id', grid.id);

      if (!conns || conns.length === 0) return;

      const loads: PriorityLoad[] = conns.map(c => ({
        id: c.id,
        building_id: c.building_id,
        power_draw: Number(c.power_draw || 0),
        priority: c.priority as PriorityLoad['priority'],
        is_connected: c.is_connected,
      }));

      const disconnected = loads.filter(l => !l.is_connected);
      if (disconnected.length === 0) {
        blackoutRef.current = false;
        return;
      }

      const totalSupply = Number(grid.total_power_generated || 0);
      const connectedDemand = loads
        .filter(l => l.is_connected)
        .reduce((s, l) => s + l.power_draw, 0);

      for (const priority of [...PRIORITY_ORDER].reverse()) {
        const offlineLoads = disconnected.filter(l => l.priority === priority);
        for (const load of offlineLoads) {
          if (connectedDemand + load.power_draw <= totalSupply) {
            await supabase
              .from('building_power_connections')
              .update({ is_connected: true })
              .eq('id', load.id);
          }
        }
      }

      blackoutRef.current = false;
    } catch (e) {
      if (mountedRef.current) {
        console.warn('ALC grid recovery error:', e);
      }
    }
  }, [user, planetId]);

  useEffect(() => {
    mountedRef.current = true;

    if (!user || !planetId || !isEnabled) return;

    processPowerTick();

    timerRef.current = setInterval(() => {
      if (mountedRef.current) processPowerTick();
    }, POWER_TICK_INTERVAL);

    return () => {
      mountedRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      processingRef.current = false;
    };
  }, [user, planetId, isEnabled, processPowerTick]);

  return {
    processPowerTick,
    recoverGrid,
  };
}
