import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface TradeRoute {
  id: string;
  origin: string;
  destination: string;
  cargo_type: string;
  cargo_amount: number;
  frequency: number;
  status: 'active' | 'paused';
  profit_per_trip: number;
  last_trip?: string;
  next_trip?: string;
}

export function useTradeRoutes() {
  const { user } = useAuth();
  const [routes, setRoutes] = useState<TradeRoute[]>([]);
  const [activeRoutes, setActiveRoutes] = useState<TradeRoute[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRoutes = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('trade_routes')
        .select('*')
        .eq('player_id', user.id)
        .order('created_at', { ascending: false });

      if (error && error.code !== 'PGRST116') throw error;

      const routesList: TradeRoute[] = (data || []).map(route => ({
        id: route.id,
        origin: route.origin,
        destination: route.destination,
        cargo_type: route.cargo_type,
        cargo_amount: route.cargo_amount,
        frequency: route.frequency,
        status: route.status,
        profit_per_trip: route.profit_per_trip || 0,
        last_trip: route.last_trip,
        next_trip: route.next_trip
      }));

      setRoutes(routesList);
      setActiveRoutes(routesList.filter(r => r.status === 'active'));
    } catch (error) {
      console.error('Error loading trade routes:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  const createRoute = async (
    origin: string,
    destination: string,
    cargoType: string,
    cargoAmount: number,
    frequency: number
  ) => {
    if (!user) return false;

    try {
      const profitPerTrip = calculateProfit(cargoType, cargoAmount);
      const nextTrip = new Date(Date.now() + frequency * 1000);

      await supabase.from('trade_routes').insert({
        player_id: user.id,
        origin,
        destination,
        cargo_type: cargoType,
        cargo_amount: cargoAmount,
        frequency,
        status: 'active',
        profit_per_trip: profitPerTrip,
        next_trip: nextTrip.toISOString()
      });

      await loadRoutes();
      return true;
    } catch (error) {
      console.error('Error creating trade route:', error);
      return false;
    }
  };

  const calculateProfit = (cargoType: string, amount: number): number => {
    const basePrices: Record<string, number> = {
      metal: 1,
      crystal: 2,
      deuterium: 3
    };

    const basePrice = basePrices[cargoType] || 1;
    return Math.floor(amount * basePrice * 0.2);
  };

  const executeRoute = async (routeId: string) => {
    if (!user) return false;

    try {
      const route = routes.find(r => r.id === routeId);
      if (!route) return false;

      // Add profit to resources
      const { data: resources } = await supabase
        .from('player_resources')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (resources) {
        await supabase
          .from('player_resources')
          .update({
            metal: resources.metal + route.profit_per_trip
          })
          .eq('user_id', user.id);
      }

      // Update route
      const nextTrip = new Date(Date.now() + route.frequency * 1000);
      await supabase
        .from('trade_routes')
        .update({
          last_trip: new Date().toISOString(),
          next_trip: nextTrip.toISOString()
        })
        .eq('id', routeId);

      // Log transaction
      await supabase.from('economy_transactions').insert({
        player_id: user.id,
        transaction_type: 'trade_route',
        amount: route.profit_per_trip,
        details: {
          route_id: routeId,
          cargo_type: route.cargo_type,
          cargo_amount: route.cargo_amount
        }
      });

      await loadRoutes();
      return true;
    } catch (error) {
      console.error('Error executing trade route:', error);
      return false;
    }
  };

  const pauseRoute = async (routeId: string) => {
    if (!user) return false;

    try {
      await supabase
        .from('trade_routes')
        .update({ status: 'paused' })
        .eq('id', routeId)
        .eq('player_id', user.id);

      await loadRoutes();
      return true;
    } catch (error) {
      console.error('Error pausing route:', error);
      return false;
    }
  };

  const resumeRoute = async (routeId: string) => {
    if (!user) return false;

    try {
      const route = routes.find(r => r.id === routeId);
      if (!route) return false;

      const nextTrip = new Date(Date.now() + route.frequency * 1000);

      await supabase
        .from('trade_routes')
        .update({
          status: 'active',
          next_trip: nextTrip.toISOString()
        })
        .eq('id', routeId)
        .eq('player_id', user.id);

      await loadRoutes();
      return true;
    } catch (error) {
      console.error('Error resuming route:', error);
      return false;
    }
  };

  const deleteRoute = async (routeId: string) => {
    if (!user) return false;

    try {
      await supabase
        .from('trade_routes')
        .delete()
        .eq('id', routeId)
        .eq('player_id', user.id);

      await loadRoutes();
      return true;
    } catch (error) {
      console.error('Error deleting route:', error);
      return false;
    }
  };

  return {
    routes,
    activeRoutes,
    loading,
    createRoute,
    executeRoute,
    pauseRoute,
    resumeRoute,
    deleteRoute,
    reload: loadRoutes
  };
}
