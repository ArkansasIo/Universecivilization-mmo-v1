import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const AUTO_PROCESS_INTERVAL = 15000;

export function useBackgroundProcessor() {
  const { user } = useAuth();
  const mountedRef = useRef(true);
  const processingRef = useRef(false);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);

  // ── Auto-execute trade routes ─────────────────────────────
  const processTradeRoutes = useCallback(async () => {
    if (!user || !mountedRef.current) return;

    try {
      const { data: routes, error } = await supabase
        .from('trade_routes')
        .select('*')
        .eq('player_id', user.id)
        .eq('status', 'active')
        .not('next_trip', 'is', null);

      if (error || !routes?.length) return;

      const now = new Date();
      for (const route of routes) {
        if (!mountedRef.current) break;
        if (!route.next_trip || now < new Date(route.next_trip)) continue;

        const profit = route.profit_per_trip || Math.floor((route.cargo_amount || 100) * 0.2);

        const { data: resources } = await supabase
          .from('player_resources')
          .select('metal')
          .eq('user_id', user.id)
          .maybeSingle();

        if (resources) {
          await supabase
            .from('player_resources')
            .update({ metal: (resources.metal || 0) + profit })
            .eq('user_id', user.id);
        }

        const nextTrip = new Date(Date.now() + (route.frequency || 3600) * 1000);
        await supabase
          .from('trade_routes')
          .update({
            last_trip: now.toISOString(),
            next_trip: nextTrip.toISOString(),
          })
          .eq('id', route.id);

        await supabase.from('economy_transactions').insert({
          player_id: user.id,
          transaction_type: 'trade_route',
          amount: profit,
          details: {
            route_id: route.id,
            cargo_type: route.cargo_type,
            cargo_amount: route.cargo_amount,
          },
          created_at: now.toISOString(),
        });
      }
    } catch (err) {
      if (mountedRef.current) console.warn('Trade route processing error:', err);
    }
  }, [user]);

  // ── Auto-complete espionage missions ───────────────────────
  const processEspionageMissions = useCallback(async () => {
    if (!user || !mountedRef.current) return;

    try {
      const { data: missions, error } = await supabase
        .from('espionage_missions')
        .select('*')
        .eq('player_id', user.id)
        .eq('status', 'active')
        .not('completed_at', 'is', null);

      if (error || !missions?.length) return;

      const now = new Date();
      for (const mission of missions) {
        if (!mountedRef.current) break;
        if (!mission.completed_at || now < new Date(mission.completed_at)) continue;

        const successChance = 0.7;
        const success = Math.random() < successChance;
        const detected = Math.random() < 0.3;

        let result: any = { success, detected };

        if (success && mission.mission_type === 'steal') {
          const { data: targetResources } = await supabase
            .from('player_resources')
            .select('metal, crystal, deuterium')
            .eq('user_id', mission.target_id)
            .maybeSingle();

          if (targetResources) {
            const stolen = {
              metal: Math.floor((targetResources.metal || 0) * 0.1),
              crystal: Math.floor((targetResources.crystal || 0) * 0.1),
              deuterium: Math.floor((targetResources.deuterium || 0) * 0.1),
            };

            await supabase
              .from('player_resources')
              .update({
                metal: Math.max(0, (targetResources.metal || 0) - stolen.metal),
                crystal: Math.max(0, (targetResources.crystal || 0) - stolen.crystal),
                deuterium: Math.max(0, (targetResources.deuterium || 0) - stolen.deuterium),
              })
              .eq('user_id', mission.target_id);

            const { data: myResources } = await supabase
              .from('player_resources')
              .select('metal, crystal, deuterium')
              .eq('user_id', user.id)
              .maybeSingle();

            if (myResources) {
              await supabase
                .from('player_resources')
                .update({
                  metal: (myResources.metal || 0) + stolen.metal,
                  crystal: (myResources.crystal || 0) + stolen.crystal,
                  deuterium: (myResources.deuterium || 0) + stolen.deuterium,
                })
                .eq('user_id', user.id);
            }
            result.data = { stolen };
          }
        } else if (success && mission.mission_type === 'sabotage') {
          const { data: targetBuildings } = await supabase
            .from('buildings')
            .select('*')
            .eq('player_id', mission.target_id)
            .limit(1);

          if (targetBuildings?.length) {
            const building = targetBuildings[0];
            await supabase
              .from('buildings')
              .update({ level: Math.max(1, (building.level || 1) - 1) })
              .eq('id', building.id);
            result.data = { damaged: building.building_type };
          }
        }

        await supabase
          .from('espionage_missions')
          .update({
            status: success ? 'completed' : 'failed',
            result,
          })
          .eq('id', mission.id);

        if (detected) {
          await supabase.from('notifications').insert({
            player_id: mission.target_id,
            type: 'espionage',
            title: 'Espionage Detected!',
            message: 'An espionage mission was detected targeting your empire.',
            icon: 'ri-user-search-line',
            created_at: now.toISOString(),
          });
        }

        await supabase.from('notifications').insert({
          player_id: user.id,
          type: 'espionage_report',
          title: success ? 'Espionage Mission Complete' : 'Espionage Mission Failed',
          message: success ? 'Your operatives returned with valuable intel.' : 'Your operatives were compromised.',
          icon: success ? 'ri-check-line' : 'ri-close-line',
          created_at: now.toISOString(),
        });
      }
    } catch (err) {
      if (mountedRef.current) console.warn('Espionage processing error:', err);
    }
  }, [user]);

  // ── Process stargate jumps ─────────────────────────────────
  const processStargateJumps = useCallback(async () => {
    if (!user || !mountedRef.current) return;

    try {
      const { data: jumps, error } = await supabase
        .from('active_jumps')
        .select('*')
        .eq('player_id', user.id)
        .in('status', ['in_transit', 'arriving'])
        .not('arrival_time', 'is', null);

      if (error || !jumps?.length) return;

      const now = new Date();
      for (const jump of jumps) {
        if (!mountedRef.current) break;
        if (!jump.arrival_time || now < new Date(jump.arrival_time)) continue;

        await supabase
          .from('active_jumps')
          .update({ status: 'completed' })
          .eq('id', jump.id);

        await supabase.from('notifications').insert({
          player_id: user.id,
          type: 'fleet_arrived',
          title: 'Fleet Arrived via Stargate',
          message: `Your fleet has completed the stargate jump to ${jump.to_gate_id}.`,
          icon: 'ri-rocket-line',
          created_at: now.toISOString(),
        });
      }
    } catch (err) {
      if (mountedRef.current) console.warn('Stargate processing error:', err);
    }
  }, [user]);

  // ── Auto-generate planetary events ─────────────────────────
  const generatePlanetaryEvents = useCallback(async () => {
    if (!user || !mountedRef.current) return;

    const EVENT_TEMPLATES = [
      { type: 'meteor_shower', name: 'Meteor Shower', description: 'A meteor shower is approaching! Mine it or evacuate.', choices: [
        { id: 'evacuate', label: 'Evacuate', effect: { metal: 0, happiness: -10 } },
        { id: 'mine', label: 'Mine Meteors', effect: { metal: 5000, happiness: -5 } },
      ], duration: 12 },
      { type: 'solar_flare', name: 'Solar Flare', description: 'Solar flare disrupting energy! Shield or harvest.', choices: [
        { id: 'shield', label: 'Shield', effect: { energy: -20 } },
        { id: 'harvest', label: 'Harvest', effect: { energy: 50, damage: 10 } },
      ], duration: 6 },
      { type: 'alien_artifact', name: 'Alien Artifact', description: 'Ancient artifact discovered! Study or sell.', choices: [
        { id: 'study', label: 'Study', effect: { research_points: 1000 } },
        { id: 'sell', label: 'Sell', effect: { dark_matter: 100 } },
      ], duration: 24 },
    ];

    try {
      const { data: recentEvents } = await supabase
        .from('planetary_events')
        .select('created_at')
        .eq('player_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (recentEvents?.length) {
        const lastEvent = new Date(recentEvents[0].created_at);
        const hoursSinceLast = (Date.now() - lastEvent.getTime()) / 3600000;
        if (hoursSinceLast < 4) return;
      }

      const { data: planets } = await supabase
        .from('planets')
        .select('id')
        .eq('player_id', user.id)
        .limit(5);

      if (!planets?.length) return;

      if (Math.random() > 0.3) return;

      const planet = planets[Math.floor(Math.random() * planets.length)];
      const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];

      await supabase.from('planetary_events').insert({
        planet_id: planet.id,
        player_id: user.id,
        event_type: template.type,
        event_name: template.name,
        event_description: template.description,
        choices: template.choices,
        duration_hours: template.duration,
        ends_at: new Date(Date.now() + template.duration * 3600000).toISOString(),
        is_active: true,
      });

      await supabase.from('notifications').insert({
        player_id: user.id,
        type: 'planetary_event',
        title: `New Event: ${template.name}`,
        message: template.description,
        icon: 'ri-planet-line',
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      if (mountedRef.current) console.warn('Planetary event generation error:', err);
    }
  }, [user]);

  // ── Auto-expire old events and quests ─────────────────────
  const cleanupExpiredContent = useCallback(async () => {
    if (!user || !mountedRef.current) return;

    try {
      const now = new Date().toISOString();

      // Expire planetary events
      await supabase
        .from('planetary_events')
        .update({ is_active: false, resolved_at: now })
        .eq('player_id', user.id)
        .eq('is_active', true)
        .lt('ends_at', now);

      // Expire market listings
      await supabase
        .from('marketplace_listings')
        .update({ status: 'expired' })
        .eq('seller_id', user.id)
        .eq('status', 'active')
        .lt('expires_at', now);
    } catch (err) {
      if (mountedRef.current) console.warn('Cleanup error:', err);
    }
  }, [user]);

  // ── Fleet arrival processing ──────────────────────────────
  const processFleetArrivals = useCallback(async () => {
    if (!user || !mountedRef.current) return;

    try {
      const { data: fleets, error } = await supabase
        .from('fleets')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'returning')
        .not('arrival_time', 'is', null);

      if (error || !fleets?.length) return;

      const now = new Date();
      for (const fleet of fleets) {
        if (!mountedRef.current) break;
        if (!fleet.arrival_time || now < new Date(fleet.arrival_time)) continue;

        await supabase
          .from('fleets')
          .update({ status: 'idle', arrival_time: null })
          .eq('id', fleet.id);

        await supabase.from('notifications').insert({
          player_id: user.id,
          type: 'fleet_arrived',
          title: 'Fleet Returned',
          message: `${fleet.name || 'Your fleet'} has returned to base.`,
          icon: 'ri-rocket-line',
          created_at: now.toISOString(),
        });
      }
    } catch (err) {
      if (mountedRef.current) console.warn('Fleet arrival error:', err);
    }
  }, [user]);

  useEffect(() => {
    mountedRef.current = true;
    intervalsRef.current = [];

    if (!user) return;

    const runAll = async () => {
      if (processingRef.current || !mountedRef.current) return;
      processingRef.current = true;
      try {
        await Promise.all([
          processTradeRoutes(),
          processEspionageMissions(),
          processStargateJumps(),
          generatePlanetaryEvents(),
          cleanupExpiredContent(),
          processFleetArrivals(),
        ]);
      } catch (err) {
        if (mountedRef.current) console.warn('Background processor error:', err);
      } finally {
        processingRef.current = false;
      }
    };

    runAll();

    const interval = setInterval(runAll, AUTO_PROCESS_INTERVAL);
    intervalsRef.current.push(interval);

    return () => {
      mountedRef.current = false;
      intervalsRef.current.forEach(i => clearInterval(i));
      intervalsRef.current = [];
    };
  }, [user, processTradeRoutes, processEspionageMissions, processStargateJumps, generatePlanetaryEvents, cleanupExpiredContent, processFleetArrivals]);

  return {
    processTradeRoutes,
    processEspionageMissions,
    processStargateJumps,
    generatePlanetaryEvents,
    cleanupExpiredContent,
    processFleetArrivals,
  };
}