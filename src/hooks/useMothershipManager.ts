import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { MOTHERSHIP_DATA } from '../data/motherships';

interface PlayerMothership {
  id: string;
  player_id: string;
  mothership_id: string;
  level: number;
  experience: number;
  location: string;
  status: 'active' | 'docked' | 'repairing' | 'upgrading';
  current_health: number;
  current_shields: number;
  current_energy: number;
  hangar_contents: {
    fighters: number;
    bombers: number;
    shuttles: number;
  };
  active_abilities: string[];
  last_maintenance: string;
}

export function useMothershipManager() {
  const { user } = useAuth();
  const [motherships, setMotherships] = useState<PlayerMothership[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMotherships = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('motherships')
        .select('*')
        .eq('player_id', user.id);

      if (error) throw error;
      setMotherships(data || []);
    } catch (error) {
      console.error('Error loading motherships:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadMotherships();

    if (!user) return;

    const channel = supabase
      .channel('mothership-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'motherships',
          filter: `player_id=eq.${user.id}`
        },
        () => {
          loadMotherships();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadMotherships]);

  const buildMothership = async (mothershipId: string) => {
    if (!user) throw new Error('User not authenticated');

    const template = MOTHERSHIP_DATA.find(m => m.id === mothershipId);
    if (!template) throw new Error('Mothership template not found');

    try {
      const { data, error } = await supabase.from('motherships').insert({
        player_id: user.id,
        mothership_id: mothershipId,
        level: 1,
        experience: 0,
        location: '[1:1:1]',
        status: 'docked',
        current_health: template.stats.maxHealth,
        current_shields: template.stats.maxShield,
        current_energy: template.stats.maxEnergy,
        hangar_contents: {
          fighters: 0,
          bombers: 0,
          shuttles: 0
        },
        active_abilities: [],
        last_maintenance: new Date().toISOString()
      }).select().single();

      if (error) throw error;
      await loadMotherships();
      return data;
    } catch (error) {
      console.error('Error building mothership:', error);
      throw error;
    }
  };

  const upgradeMothership = async (mothershipId: string) => {
    const mothership = motherships.find(m => m.id === mothershipId);
    if (!mothership) return;

    const template = MOTHERSHIP_DATA.find(m => m.id === mothership.mothership_id);
    if (!template || mothership.level >= template.maxLevel) return;

    try {
      const newLevel = mothership.level + 1;
      const statMultiplier = 1.05;

      const { error } = await supabase
        .from('motherships')
        .update({
          level: newLevel,
          current_health: Math.floor(mothership.current_health * statMultiplier),
          current_shields: Math.floor(mothership.current_shields * statMultiplier),
          current_energy: Math.floor(mothership.current_energy * statMultiplier)
        })
        .eq('id', mothershipId);

      if (error) throw error;
      await loadMotherships();
    } catch (error) {
      console.error('Error upgrading mothership:', error);
      throw error;
    }
  };

  const activateAbility = async (mothershipId: string, abilityName: string) => {
    const mothership = motherships.find(m => m.id === mothershipId);
    if (!mothership) return;

    try {
      const activeAbilities = [...mothership.active_abilities, abilityName];

      const { error } = await supabase
        .from('motherships')
        .update({ active_abilities: activeAbilities })
        .eq('id', mothershipId);

      if (error) throw error;
      await loadMotherships();
    } catch (error) {
      console.error('Error activating ability:', error);
      throw error;
    }
  };

  const repairMothership = async (mothershipId: string) => {
    const mothership = motherships.find(m => m.id === mothershipId);
    if (!mothership) return;

    const template = MOTHERSHIP_DATA.find(m => m.id === mothership.mothership_id);
    if (!template) return;

    try {
      const { error } = await supabase
        .from('motherships')
        .update({
          status: 'repairing',
          current_health: template.stats.maxHealth,
          current_shields: template.stats.maxShield,
          current_energy: template.stats.maxEnergy,
          last_maintenance: new Date().toISOString()
        })
        .eq('id', mothershipId);

      if (error) throw error;
      await loadMotherships();
    } catch (error) {
      console.error('Error repairing mothership:', error);
      throw error;
    }
  };

  const deployFighters = async (mothershipId: string, count: number) => {
    const mothership = motherships.find(m => m.id === mothershipId);
    if (!mothership) return;

    const template = MOTHERSHIP_DATA.find(m => m.id === mothership.mothership_id);
    if (!template) return;

    const currentFighters = mothership.hangar_contents.fighters;
    if (currentFighters + count > template.hangarCapacity) {
      throw new Error('Hangar capacity exceeded');
    }

    try {
      const { error } = await supabase
        .from('motherships')
        .update({
          hangar_contents: {
            ...mothership.hangar_contents,
            fighters: currentFighters + count
          }
        })
        .eq('id', mothershipId);

      if (error) throw error;
      await loadMotherships();
    } catch (error) {
      console.error('Error deploying fighters:', error);
      throw error;
    }
  };

  return {
    motherships,
    loading,
    buildMothership,
    upgradeMothership,
    activateAbility,
    repairMothership,
    deployFighters,
    loadMotherships
  };
}
