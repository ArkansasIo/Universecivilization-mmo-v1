import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface EspionageMission {
  id: string;
  target_id: string;
  target_name: string;
  mission_type: 'spy' | 'sabotage' | 'steal';
  status: 'active' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  result?: {
    success: boolean;
    data?: any;
    detected: boolean;
  };
}

export function useEspionage() {
  const { user } = useAuth();
  const [missions, setMissions] = useState<EspionageMission[]>([]);
  const [activeMissions, setActiveMissions] = useState<EspionageMission[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMissions = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('espionage_missions')
        .select(`
          *,
          profiles:target_id (username)
        `)
        .eq('player_id', user.id)
        .order('started_at', { ascending: false })
        .limit(50);

      if (error && error.code !== 'PGRST116') throw error;

      const missionsList: EspionageMission[] = (data || []).map(mission => ({
        id: mission.id,
        target_id: mission.target_id,
        target_name: (mission.profiles as any)?.username || 'Unknown',
        mission_type: mission.mission_type,
        status: mission.status,
        started_at: mission.started_at,
        completed_at: mission.completed_at,
        result: mission.result
      }));

      setMissions(missionsList);
      setActiveMissions(missionsList.filter(m => m.status === 'active'));
    } catch (error) {
      console.error('Error loading espionage missions:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadMissions();
  }, [loadMissions]);

  const startMission = async (
    targetId: string,
    missionType: 'spy' | 'sabotage' | 'steal'
  ) => {
    if (!user) return false;

    try {
      // Calculate mission duration based on type
      const durations = {
        spy: 300, // 5 minutes
        sabotage: 600, // 10 minutes
        steal: 900 // 15 minutes
      };

      const duration = durations[missionType];
      const completedAt = new Date(Date.now() + duration * 1000);

      await supabase.from('espionage_missions').insert({
        player_id: user.id,
        target_id: targetId,
        mission_type: missionType,
        status: 'active',
        started_at: new Date().toISOString(),
        completed_at: completedAt.toISOString()
      });

      await loadMissions();
      return true;
    } catch (error) {
      console.error('Error starting espionage mission:', error);
      return false;
    }
  };

  const completeMission = async (missionId: string) => {
    if (!user) return;

    try {
      const mission = missions.find(m => m.id === missionId);
      if (!mission) return;

      // Calculate success chance (simplified)
      const successChance = 0.7;
      const detectionChance = 0.3;
      const success = Math.random() < successChance;
      const detected = Math.random() < detectionChance;

      const result: any = { success, detected };

      if (success) {
        if (mission.mission_type === 'spy') {
          // Get target resources
          const { data: targetResources } = await supabase
            .from('player_resources')
            .select('*')
            .eq('user_id', mission.target_id)
            .maybeSingle();

          result.data = {
            resources: targetResources,
            timestamp: new Date().toISOString()
          };
        } else if (mission.mission_type === 'steal') {
          // Steal resources
          const { data: targetResources } = await supabase
            .from('player_resources')
            .select('*')
            .eq('user_id', mission.target_id)
            .maybeSingle();

          if (targetResources) {
            const stolenAmount = {
              metal: Math.floor((targetResources.metal || 0) * 0.1),
              crystal: Math.floor((targetResources.crystal || 0) * 0.1),
              deuterium: Math.floor((targetResources.deuterium || 0) * 0.1)
            };

            // Deduct from target
            await supabase
              .from('player_resources')
              .update({
                metal: (targetResources.metal || 0) - stolenAmount.metal,
                crystal: (targetResources.crystal || 0) - stolenAmount.crystal,
                deuterium: (targetResources.deuterium || 0) - stolenAmount.deuterium
              })
              .eq('user_id', mission.target_id);

            // Add to player
            const { data: playerResources } = await supabase
              .from('player_resources')
              .select('*')
              .eq('user_id', user.id)
              .maybeSingle();

            if (playerResources) {
              await supabase
                .from('player_resources')
                .update({
                  metal: (playerResources.metal || 0) + stolenAmount.metal,
                  crystal: (playerResources.crystal || 0) + stolenAmount.crystal,
                  deuterium: (playerResources.deuterium || 0) + stolenAmount.deuterium
                })
                .eq('user_id', user.id);
            }

            result.data = { stolen: stolenAmount };
          }
        } else if (mission.mission_type === 'sabotage') {
          // Damage random building
          const { data: targetBuildings } = await supabase
            .from('buildings')
            .select('*')
            .eq('player_id', mission.target_id)
            .limit(1);

          if (targetBuildings && targetBuildings.length > 0) {
            const building = targetBuildings[0];
            await supabase
              .from('buildings')
              .update({
                level: Math.max(1, building.level - 1)
              })
              .eq('id', building.id);

            result.data = {
              damaged_building: building.building_type,
              level_reduced: 1
            };
          }
        }
      }

      // Update mission
      await supabase
        .from('espionage_missions')
        .update({
          status: success ? 'completed' : 'failed',
          result
        })
        .eq('id', missionId);

      // Notify target if detected
      if (detected) {
        await supabase.from('notifications').insert({
          player_id: mission.target_id,
          notification_type: 'espionage',
          title: 'Espionage Detected!',
          message: `An espionage mission was detected targeting your empire.`,
          read: false
        });
      }

      await loadMissions();
    } catch (error) {
      console.error('Error completing mission:', error);
    }
  };

  const cancelMission = async (missionId: string) => {
    if (!user) return false;

    try {
      await supabase
        .from('espionage_missions')
        .update({ status: 'failed' })
        .eq('id', missionId)
        .eq('player_id', user.id);

      await loadMissions();
      return true;
    } catch (error) {
      console.error('Error canceling mission:', error);
      return false;
    }
  };

  return {
    missions,
    activeMissions,
    loading,
    startMission,
    completeMission,
    cancelMission,
    reload: loadMissions
  };
}
