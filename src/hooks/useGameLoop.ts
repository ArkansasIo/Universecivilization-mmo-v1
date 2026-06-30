import { useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const PRODUCTION_INTERVAL = 10000; // 10 seconds — 6 turns per minute
const FLEET_CHECK_INTERVAL = 10000; // 10 seconds — 6 turns per minute
const BUILDING_CHECK_INTERVAL = 10000; // 10 seconds — 6 turns per minute
const RESEARCH_CHECK_INTERVAL = 10000; // 10 seconds — 6 turns per minute

export function useGameLoop() {
  const { user } = useAuth();
  const isCalculatingRef = useRef(false);
  const isProcessingRef = useRef(false);
  const isBuildingProcessingRef = useRef(false);
  const isResearchProcessingRef = useRef(false);
  const lastUpdateRef = useRef<number>(Date.now());
  const mountedRef = useRef(true);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);

  // ── Resource Tick (server-side) ─────────────────────────────────────
  const calculateProduction = useCallback(async () => {
    if (!user || isCalculatingRef.current || !mountedRef.current) return;

    const now = Date.now();
    if (now - lastUpdateRef.current < 8000) return;

    isCalculatingRef.current = true;
    lastUpdateRef.current = now;

    try {
      const { error } = await supabase.functions.invoke('process-resource-tick', {
        body: {},
      });

      if (error && mountedRef.current) {
        // Auth errors (expired tokens) are expected on long sessions — don't spam the console
        const isAuthError = error.message?.toLowerCase().includes('unauthorized')
          || error.message?.toLowerCase().includes('token');
        if (!isAuthError) {
          console.warn('Resource tick error:', error.message);
        }
      }
    } catch (error) {
      if (mountedRef.current) {
        console.warn('Production tick error:', error);
      }
    } finally {
      isCalculatingRef.current = false;
    }
  }, [user]);

  // ── Fleet movements (client-side until we have a fleet edge fn) ────
  const processFleetMovements = useCallback(async () => {
    if (!user || isProcessingRef.current || !mountedRef.current) return;
    isProcessingRef.current = true;

    try {
      const { data: fleets, error } = await supabase
        .from('fleets')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'moving')
        .not('arrival_time', 'is', null);

      if (error) {
        if (mountedRef.current) console.warn('Error fetching fleets:', error.message);
        return;
      }

      const safeFleets = fleets || [];
      if (safeFleets.length === 0) return;

      const now = new Date();
      for (const fleet of safeFleets) {
        if (!mountedRef.current) break;
        if (!fleet.arrival_time) continue;
        if (now >= new Date(fleet.arrival_time)) {
          await executeMission(fleet);
        }
      }
    } catch (err) {
      if (mountedRef.current) console.warn('Fleet movement error:', err);
    } finally {
      isProcessingRef.current = false;
    }
  }, [user]);

  // ... existing code ...
  const processBuildingQueue = useCallback(async () => {
    if (!user || isBuildingProcessingRef.current || !mountedRef.current) return;
    isBuildingProcessingRef.current = true;

    try {
      const { data: queue, error } = await supabase
        .from('building_queue')
        .select('*')
        .eq('player_id', user.id)
        .eq('status', 'building')
        .not('completion_time', 'is', null);

      if (error) {
        if (mountedRef.current) console.warn('Error fetching building queue:', error.message);
        return;
      }

      const safeQueue = queue || [];
      if (safeQueue.length === 0) return;

      const now = new Date();
      for (const item of safeQueue) {
        if (!mountedRef.current) break;
        if (!item.completion_time) continue;
        if (now >= new Date(item.completion_time)) {
          await completeBuilding(item);
        }
      }
    } catch (err) {
      if (mountedRef.current) console.warn('Building queue processing error:', err);
    } finally {
      isBuildingProcessingRef.current = false;
    }
  }, [user]);

  const processResearchQueue = useCallback(async () => {
    if (!user || isResearchProcessingRef.current || !mountedRef.current) return;
    isResearchProcessingRef.current = true;

    try {
      const { data: queue, error } = await supabase
        .from('research_projects')
        .select('*')
        .eq('player_id', user.id)
        .eq('status', 'researching')
        .not('completion_time', 'is', null);

      if (error) {
        if (mountedRef.current) console.warn('Error fetching research queue:', error.message);
        return;
      }

      const safeQueue = queue || [];
      if (safeQueue.length === 0) return;

      const now = new Date();
      for (const item of safeQueue) {
        if (!mountedRef.current) break;
        if (!item.completion_time) continue;
        if (now >= new Date(item.completion_time)) {
          await completeResearch(item);
        }
      }
    } catch (err) {
      if (mountedRef.current) console.warn('Research queue processing error:', err);
    } finally {
      isResearchProcessingRef.current = false;
    }
  }, [user]);

  const executeMission = useCallback(async (fleet: any) => {
    if (!mountedRef.current) return;

    try {
      const missionHandlers: Record<string, () => Promise<void>> = {
        attack: async () => {
          const { error } = await supabase.from('combat_logs').insert({
            attacker_id: fleet.user_id,
            defender_id: fleet.target_player_id || null,
            attacker_ships: fleet.ships || {},
            result: 'pending',
            loot_metal: 0,
            loot_crystal: 0,
            loot_deuterium: 0,
            attacker_losses: {},
            defender_losses: {},
            created_at: new Date().toISOString()
          });
          if (error && mountedRef.current) console.error('Error creating combat log:', error);
        },
        transport: async () => {
          if (fleet.cargo && fleet.target_player_id) {
            const { data: targetResources, error: fetchError } = await supabase
              .from('player_resources')
              .select('metal, crystal, deuterium')
              .eq('player_id', fleet.target_player_id)
              .maybeSingle();

            if (fetchError) {
              if (mountedRef.current) console.error('Error fetching target resources:', fetchError);
              return;
            }
            if (targetResources) {
              const { error: updateError } = await supabase
                .from('player_resources')
                .update({
                  metal: (targetResources.metal || 0) + (fleet.cargo.metal || 0),
                  crystal: (targetResources.crystal || 0) + (fleet.cargo.crystal || 0),
                  deuterium: (targetResources.deuterium || 0) + (fleet.cargo.deuterium || 0)
                })
                .eq('player_id', fleet.target_player_id);
              if (updateError && mountedRef.current) console.error('Error updating target resources:', updateError);
            }
          }
        },
        colonize: async () => {
          const { error } = await supabase.from('planets').insert({
            player_id: fleet.user_id,
            name: `Colony ${Date.now()}`,
            position_galaxy: fleet.target_galaxy || 1,
            position_system: fleet.target_system || 1,
            position_planet: fleet.target_planet || 1,
            diameter: 12800,
            temperature: 25,
            is_capital: false,
            created_at: new Date().toISOString()
          });
          if (error && mountedRef.current) console.error('Error creating colony:', error);
          else {
            await supabase.from('notifications').insert({
              player_id: fleet.user_id,
              type: 'planet_colonized',
              title: 'New Colony Established!',
              message: `A new colony has been founded at [${fleet.target_galaxy}:${fleet.target_system}:${fleet.target_planet}].`,
              icon: 'ri-planet-line',
              created_at: new Date().toISOString()
            });
          }
        },
        harvest: async () => {
          if (fleet.target_galaxy != null && fleet.target_system != null) {
            const { data: debrisFields, error: debrisError } = await supabase
              .from('debris_fields')
              .select('*')
              .eq('galaxy', fleet.target_galaxy)
              .eq('system', fleet.target_system)
              .maybeSingle();

            if (debrisError) {
              if (mountedRef.current) console.error('Error fetching debris field:', debrisError);
              return;
            }

            if (debrisFields) {
              const harvestedMetal = Math.min(fleet.cargo_capacity || 10000, debrisFields.metal || 0);
              const harvestedCrystal = Math.min((fleet.cargo_capacity || 10000) - harvestedMetal, debrisFields.crystal || 0);

              const { error: updateError } = await supabase
                .from('debris_fields')
                .update({
                  metal: Math.max(0, (debrisFields.metal || 0) - harvestedMetal),
                  crystal: Math.max(0, (debrisFields.crystal || 0) - harvestedCrystal),
                })
                .eq('id', debrisFields.id);

              if (updateError && mountedRef.current) console.error('Error updating debris:', updateError);

              const { data: resources, error: resError } = await supabase
                .from('player_resources')
                .select('metal, crystal')
                .eq('user_id', fleet.user_id)
                .maybeSingle();

              if (!resError && resources) {
                await supabase
                  .from('player_resources')
                  .update({
                    metal: (resources.metal || 0) + harvestedMetal,
                    crystal: (resources.crystal || 0) + harvestedCrystal,
                  })
                  .eq('user_id', fleet.user_id);
              }

              await supabase.from('notifications').insert({
                player_id: fleet.user_id,
                type: 'fleet_arrived',
                title: 'Harvest Complete',
                message: `Harvested ${harvestedMetal.toLocaleString()} metal and ${harvestedCrystal.toLocaleString()} crystal from debris field.`,
                icon: 'ri-recycle-line',
                created_at: new Date().toISOString()
              });
            }
          }
        },
        destroy: async () => {
          if (fleet.target_moon_id) {
            const moonChance = Math.min(0.2, (Object.values(fleet.ships || {}).reduce((a: number, b: number) => a + b, 0) * 0.01));

            await supabase.from('combat_logs').insert({
              attacker_id: fleet.user_id,
              defender_id: fleet.target_player_id || null,
              attacker_ships: fleet.ships || {},
              result: 'moon_destruction_attempt',
              loot_metal: 0,
              loot_crystal: 0,
              loot_deuterium: 0,
              created_at: new Date().toISOString()
            });

            await supabase.from('notifications').insert({
              player_id: fleet.user_id,
              type: 'battle_report',
              title: 'Moon Destruction Attempt',
              message: `Your fleet attempted to destroy the moon. ${Math.random() < moonChance ? 'Success! Debris field created.' : 'Failed - the moon remains intact.'}`,
              icon: 'ri-fire-fill',
              created_at: new Date().toISOString()
            });
          }
        },
        expedition: async () => {
          const outcomes = [
            { type: 'resources_found', message: 'Expedition discovered rich resource deposits!', reward: { metal: 50000, crystal: 25000, deuterium: 10000 } },
            { type: 'dark_matter', message: 'Expedition found a cache of dark matter!', reward: { dark_matter: 250 } },
            { type: 'ships_found', message: 'Expedition recovered abandoned ships from a derelict fleet!', reward: { ships_found: true } },
            { type: 'nothing', message: 'Expedition returned empty-handed. The void gave nothing.', reward: {} },
            { type: 'technology', message: 'Expedition discovered ancient technology blueprints!', reward: { research_points: 5000 } },
            { type: 'danger', message: 'Expedition encountered hostile aliens! Fleet took damage but escaped.', reward: { fleet_damage: true } },
          ];

          const result = outcomes[Math.floor(Math.random() * outcomes.length)];

          if (result.reward.metal || result.reward.crystal || result.reward.deuterium) {
            const { data: resources } = await supabase
              .from('player_resources')
              .select('metal, crystal, deuterium')
              .eq('user_id', fleet.user_id)
              .maybeSingle();

            if (resources) {
              await supabase
                .from('player_resources')
                .update({
                  metal: (resources.metal || 0) + (result.reward.metal || 0),
                  crystal: (resources.crystal || 0) + (result.reward.crystal || 0),
                  deuterium: (resources.deuterium || 0) + (result.reward.deuterium || 0),
                })
                .eq('user_id', fleet.user_id);
            }
          }

          if (result.reward.dark_matter) {
            const { data: resources } = await supabase
              .from('player_resources')
              .select('dark_matter')
              .eq('user_id', fleet.user_id)
              .maybeSingle();

            if (resources) {
              await supabase
                .from('player_resources')
                .update({ dark_matter: (resources.dark_matter || 0) + result.reward.dark_matter })
                .eq('user_id', fleet.user_id);
            }
          }

          await supabase.from('expedition_results').insert({
            player_id: fleet.user_id,
            result_type: result.type,
            description: result.message,
            created_at: new Date().toISOString(),
          });

          await supabase.from('notifications').insert({
            player_id: fleet.user_id,
            type: 'fleet_arrived',
            title: 'Expedition Complete',
            message: result.message,
            icon: 'ri-compass-3-line',
            created_at: new Date().toISOString()
          });
        },
        deploy: async () => {
          if (fleet.target_galaxy != null && fleet.target_system != null) {
            await supabase.from('notifications').insert({
              player_id: fleet.user_id,
              type: 'fleet_arrived',
              title: 'Fleet Deployed',
              message: `Your fleet has been deployed to [${fleet.target_galaxy}:${fleet.target_system}:${fleet.target_planet || '?'}].`,
              icon: 'ri-map-pin-add-line',
              created_at: new Date().toISOString()
            });
          }
        },
        station: async () => {
          await supabase.from('notifications').insert({
            player_id: fleet.user_id,
            type: 'fleet_arrived',
            title: 'Fleet Stationed',
            message: `Your fleet has arrived at its stationing point and is holding position.`,
            icon: 'ri-base-station-line',
            created_at: new Date().toISOString()
          });
        },
        spy: async () => {
          const successChance = 0.7;
          const success = Math.random() < successChance;

          if (success && fleet.target_player_id) {
            const { data: targetResources } = await supabase
              .from('player_resources')
              .select('metal, crystal, deuterium, energy, dark_matter')
              .eq('player_id', fleet.target_player_id)
              .maybeSingle();

            const { data: targetBuildings } = await supabase
              .from('buildings')
              .select('building_type, level')
              .eq('player_id', fleet.target_player_id);

            const { data: targetShips } = await supabase
              .from('ships')
              .select('ship_type, quantity')
              .eq('player_id', fleet.target_player_id);

            await supabase.from('espionage_reports').insert({
              attacker_id: fleet.user_id,
              defender_id: fleet.target_player_id,
              resources_snapshot: targetResources || {},
              buildings_snapshot: targetBuildings || [],
              ships_snapshot: targetShips || [],
              success: true,
              created_at: new Date().toISOString(),
            });
          }

          await supabase.from('notifications').insert({
            player_id: fleet.user_id,
            type: 'espionage_report',
            title: success ? 'Espionage Mission Complete' : 'Espionage Failed',
            message: success ? 'Your probes returned with detailed intelligence.' : 'Your probes were detected and destroyed.',
            icon: 'ri-user-search-line',
            created_at: new Date().toISOString()
          });
        },
        alliance: async () => {
          await supabase.from('combat_logs').insert({
            attacker_id: fleet.user_id,
            defender_id: fleet.target_player_id || null,
            attacker_ships: fleet.ships || {},
            result: 'alliance_attack_pending',
            loot_metal: 0,
            loot_crystal: 0,
            loot_deuterium: 0,
            created_at: new Date().toISOString()
          });

          await supabase.from('notifications').insert({
            player_id: fleet.user_id,
            type: 'battle_report',
            title: 'Alliance Attack Launched',
            message: 'Your fleet has engaged as part of an alliance assault. Battle report incoming.',
            icon: 'ri-team-line',
            created_at: new Date().toISOString()
          });
        },
      };

      const handler = missionHandlers[fleet.mission_type];
      if (handler) await handler();

      const travelTime = fleet.travel_time || 3600;
      const { error: updateError } = await supabase
        .from('fleets')
        .update({
          status: 'returning',
          arrival_time: new Date(Date.now() + travelTime * 1000).toISOString()
        })
        .eq('id', fleet.id);
      if (updateError && mountedRef.current) console.error('Error updating fleet status:', updateError);
    } catch (error) {
      if (mountedRef.current) console.error('Mission execution error:', error);
    }
  }, [user]);

  const completeBuilding = useCallback(async (item: any) => {
    if (!mountedRef.current) return;
    try {
      const { data: existingBuilding } = await supabase
        .from('buildings')
        .select('level')
        .eq('planet_id', item.planet_id)
        .eq('building_type', item.building_type)
        .maybeSingle();

      const newLevel = (existingBuilding?.level || 0) + 1;

      if (existingBuilding) {
        await supabase
          .from('buildings')
          .update({ level: newLevel, updated_at: new Date().toISOString() })
          .eq('planet_id', item.planet_id)
          .eq('building_type', item.building_type);
      } else {
        await supabase
          .from('buildings')
          .insert({
            planet_id: item.planet_id,
            player_id: user!.id,
            building_type: item.building_type,
            level: 1,
            created_at: new Date().toISOString()
          });
      }

      await supabase
        .from('building_queue')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', item.id);

      await supabase.from('notifications').insert({
        player_id: user!.id,
        type: 'building_complete',
        title: 'Building Complete',
        message: `${item.building_type} Level ${newLevel} completed!`,
        icon: 'ri-building-2-line',
        created_at: new Date().toISOString()
      });
    } catch (error) {
      if (mountedRef.current) console.error('Error completing building:', error);
    }
  }, [user]);

  const completeResearch = useCallback(async (item: any) => {
    if (!mountedRef.current) return;
    try {
      const { data: existingTech } = await supabase
        .from('technologies')
        .select('level')
        .eq('player_id', user!.id)
        .eq('technology_id', item.technology_id)
        .maybeSingle();

      const newLevel = (existingTech?.level || 0) + 1;

      if (existingTech) {
        await supabase
          .from('technologies')
          .update({ level: newLevel, updated_at: new Date().toISOString() })
          .eq('player_id', user!.id)
          .eq('technology_id', item.technology_id);
      } else {
        await supabase
          .from('technologies')
          .insert({
            player_id: user!.id,
            technology_id: item.technology_id,
            level: 1,
            created_at: new Date().toISOString()
          });
      }

      await supabase
        .from('research_projects')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', item.id);

      await supabase.from('notifications').insert({
        player_id: user!.id,
        type: 'research_complete',
        title: 'Research Complete',
        message: `${item.technology_id} Level ${newLevel} research completed!`,
        icon: 'ri-flask-line',
        created_at: new Date().toISOString()
      });
    } catch (error) {
      if (mountedRef.current) console.error('Error completing research:', error);
    }
  }, [user]);

  useEffect(() => {
    mountedRef.current = true;
    intervalsRef.current = [];

    if (!user) return;

    calculateProduction();

    const productionInterval = setInterval(() => {
      if (mountedRef.current) calculateProduction();
    }, PRODUCTION_INTERVAL);
    intervalsRef.current.push(productionInterval);

    const fleetInterval = setInterval(() => {
      if (mountedRef.current) processFleetMovements();
    }, FLEET_CHECK_INTERVAL);
    intervalsRef.current.push(fleetInterval);

    const buildingInterval = setInterval(() => {
      if (mountedRef.current) processBuildingQueue();
    }, BUILDING_CHECK_INTERVAL);
    intervalsRef.current.push(buildingInterval);

    const researchInterval = setInterval(() => {
      if (mountedRef.current) processResearchQueue();
    }, RESEARCH_CHECK_INTERVAL);
    intervalsRef.current.push(researchInterval);

    return () => {
      mountedRef.current = false;
      intervalsRef.current.forEach(interval => {
        if (interval) clearInterval(interval);
      });
      intervalsRef.current = [];
      isCalculatingRef.current = false;
      isProcessingRef.current = false;
      isBuildingProcessingRef.current = false;
      isResearchProcessingRef.current = false;
    };
  }, [user, calculateProduction, processFleetMovements, processBuildingQueue, processResearchQueue]);

  return {
    calculateProduction,
    processFleetMovements,
    processBuildingQueue,
    processResearchQueue
  };
}
