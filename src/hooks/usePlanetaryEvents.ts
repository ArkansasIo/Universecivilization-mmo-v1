import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface PlanetaryEvent {
  id: string;
  planet_id: string;
  player_id: string;
  event_type: string;
  event_name: string;
  event_description: string;
  effects: any;
  duration_hours: number;
  is_active: boolean;
  choices: any[];
  player_choice?: string;
  started_at: string;
  ends_at: string;
  resolved_at?: string;
  created_at: string;
}

const EVENT_TEMPLATES = [
  {
    type: 'meteor_shower',
    name: 'Meteor Shower',
    description: 'A meteor shower is approaching your planet! You can either evacuate or mine the meteors for resources.',
    choices: [
      { id: 'evacuate', label: 'Evacuate Citizens', effect: { happiness: -10, metal: 0 } },
      { id: 'mine', label: 'Mine the Meteors', effect: { happiness: -5, metal: 5000 } },
    ],
    duration: 12,
  },
  {
    type: 'solar_flare',
    name: 'Solar Flare',
    description: 'A massive solar flare is disrupting your energy production. Shield your facilities or harvest the energy.',
    choices: [
      { id: 'shield', label: 'Activate Shields', effect: { energy_production: -20, damage: 0 } },
      { id: 'harvest', label: 'Harvest Energy', effect: { energy_production: 50, damage: 10 } },
    ],
    duration: 6,
  },
  {
    type: 'alien_artifact',
    name: 'Alien Artifact Discovery',
    description: 'Your scientists have discovered an ancient alien artifact. Study it or sell it on the black market.',
    choices: [
      { id: 'study', label: 'Study the Artifact', effect: { research_points: 1000 } },
      { id: 'sell', label: 'Sell on Black Market', effect: { dark_matter: 100 } },
    ],
    duration: 24,
  },
  {
    type: 'pirate_raid',
    name: 'Pirate Raid',
    description: 'Pirates are attacking your planet! Defend with your fleet or pay them off.',
    choices: [
      { id: 'defend', label: 'Defend the Planet', effect: { fleet_damage: 20, resources_lost: 0 } },
      { id: 'pay', label: 'Pay the Pirates', effect: { fleet_damage: 0, metal: -3000, crystal: -2000 } },
    ],
    duration: 3,
  },
  {
    type: 'resource_discovery',
    name: 'Resource Discovery',
    description: 'Your miners have found a rich resource deposit! Choose which resource to focus on.',
    choices: [
      { id: 'metal', label: 'Mine Metal', effect: { metal: 10000 } },
      { id: 'crystal', label: 'Mine Crystal', effect: { crystal: 7000 } },
      { id: 'deuterium', label: 'Extract Deuterium', effect: { deuterium: 5000 } },
    ],
    duration: 18,
  },
  {
    type: 'festival',
    name: 'Planetary Festival',
    description: 'Your citizens want to celebrate! Host a festival or focus on production.',
    choices: [
      { id: 'celebrate', label: 'Host Festival', effect: { happiness: 20, production: -10 } },
      { id: 'work', label: 'Continue Working', effect: { happiness: -10, production: 15 } },
    ],
    duration: 12,
  },
];

export const usePlanetaryEvents = () => {
  const [events, setEvents] = useState<PlanetaryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('planetary_events')
        .select('*')
        .eq('player_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching planetary events:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomEvent = async (planetId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
      const endsAt = new Date(Date.now() + template.duration * 60 * 60 * 1000);

      const { data, error } = await supabase
        .from('planetary_events')
        .insert({
          planet_id: planetId,
          player_id: user.id,
          event_type: template.type,
          event_name: template.name,
          event_description: template.description,
          effects: {},
          duration_hours: template.duration,
          choices: template.choices,
          ends_at: endsAt.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      await fetchEvents();
      return { success: true, event: data };
    } catch (error) {
      console.error('Error generating event:', error);
      return { success: false, error };
    }
  };

  const makeChoice = async (eventId: string, choiceId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: event } = await supabase
        .from('planetary_events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (!event) throw new Error('Event not found');

      const choice = event.choices.find((c: any) => c.id === choiceId);
      if (!choice) throw new Error('Invalid choice');

      // Apply effects
      if (choice.effect.metal) {
        await supabase.rpc('increment_resources', {
          p_player_id: user.id,
          p_metal: choice.effect.metal,
          p_crystal: 0,
          p_deuterium: 0,
        });
      }

      if (choice.effect.crystal) {
        await supabase.rpc('increment_resources', {
          p_player_id: user.id,
          p_metal: 0,
          p_crystal: choice.effect.crystal,
          p_deuterium: 0,
        });
      }

      if (choice.effect.deuterium) {
        await supabase.rpc('increment_resources', {
          p_player_id: user.id,
          p_metal: 0,
          p_crystal: 0,
          p_deuterium: choice.effect.deuterium,
        });
      }

      // Update event
      const { error } = await supabase
        .from('planetary_events')
        .update({
          player_choice: choiceId,
          effects: choice.effect,
          is_active: false,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', eventId);

      if (error) throw error;

      await fetchEvents();
      return { success: true, effects: choice.effect };
    } catch (error) {
      console.error('Error making choice:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    generateRandomEvent,
    makeChoice,
    refreshEvents: fetchEvents,
  };
};
