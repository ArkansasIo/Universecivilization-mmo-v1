import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface FleetFormation {
  id: string;
  player_id: string;
  formation_name: string;
  formation_type: 'aggressive' | 'defensive' | 'balanced' | 'flanking' | 'turtle' | 'swarm';
  ship_positions: any;
  bonuses: {
    attack: number;
    defense: number;
    speed: number;
  };
  is_default: boolean;
  description: string;
  created_at: string;
  updated_at: string;
}

const FORMATION_TEMPLATES = [
  {
    type: 'aggressive',
    name: 'Aggressive Formation',
    description: 'All ships focus on maximum firepower. +30% attack, -10% defense',
    bonuses: { attack: 30, defense: -10, speed: 0 },
  },
  {
    type: 'defensive',
    name: 'Defensive Formation',
    description: 'Ships form a protective shield. +40% defense, -15% attack',
    bonuses: { attack: -15, defense: 40, speed: -5 },
  },
  {
    type: 'balanced',
    name: 'Balanced Formation',
    description: 'Equal focus on offense and defense. +10% attack, +10% defense',
    bonuses: { attack: 10, defense: 10, speed: 0 },
  },
  {
    type: 'flanking',
    name: 'Flanking Formation',
    description: 'Fast ships attack from the sides. +20% attack, +15% speed, -20% defense',
    bonuses: { attack: 20, defense: -20, speed: 15 },
  },
  {
    type: 'turtle',
    name: 'Turtle Formation',
    description: 'Maximum protection at the cost of mobility. +50% defense, -30% speed',
    bonuses: { attack: 0, defense: 50, speed: -30 },
  },
  {
    type: 'swarm',
    name: 'Swarm Formation',
    description: 'Overwhelming numbers with speed. +25% speed, +15% attack, -15% defense',
    bonuses: { attack: 15, defense: -15, speed: 25 },
  },
];

export const useFleetFormations = () => {
  const [formations, setFormations] = useState<FleetFormation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFormations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('fleet_formations')
        .select('*')
        .eq('player_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFormations(data || []);
    } catch (error) {
      console.error('Error fetching formations:', error);
    } finally {
      setLoading(false);
    }
  };

  const createFormation = async (formationType: string, customName?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const template = FORMATION_TEMPLATES.find(t => t.type === formationType);
      if (!template) throw new Error('Invalid formation type');

      const { data, error } = await supabase
        .from('fleet_formations')
        .insert({
          player_id: user.id,
          formation_name: customName || template.name,
          formation_type: formationType,
          ship_positions: {},
          bonuses: template.bonuses,
          description: template.description,
          is_default: false,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchFormations();
      return { success: true, formation: data };
    } catch (error) {
      console.error('Error creating formation:', error);
      return { success: false, error };
    }
  };

  const setDefaultFormation = async (formationId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Unset all default formations
      await supabase
        .from('fleet_formations')
        .update({ is_default: false })
        .eq('player_id', user.id);

      // Set new default
      const { error } = await supabase
        .from('fleet_formations')
        .update({ is_default: true })
        .eq('id', formationId);

      if (error) throw error;

      await fetchFormations();
      return { success: true };
    } catch (error) {
      console.error('Error setting default formation:', error);
      return { success: false, error };
    }
  };

  const deleteFormation = async (formationId: string) => {
    try {
      const { error } = await supabase
        .from('fleet_formations')
        .delete()
        .eq('id', formationId);

      if (error) throw error;

      await fetchFormations();
      return { success: true };
    } catch (error) {
      console.error('Error deleting formation:', error);
      return { success: false, error };
    }
  };

  const updateFormation = async (
    formationId: string,
    updates: Partial<FleetFormation>
  ) => {
    try {
      const { error } = await supabase
        .from('fleet_formations')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', formationId);

      if (error) throw error;

      await fetchFormations();
      return { success: true };
    } catch (error) {
      console.error('Error updating formation:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  return {
    formations,
    loading,
    formationTemplates: FORMATION_TEMPLATES,
    createFormation,
    setDefaultFormation,
    deleteFormation,
    updateFormation,
    refreshFormations: fetchFormations,
  };
};
