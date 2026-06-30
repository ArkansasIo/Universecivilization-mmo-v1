import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Colony {
  id: string;
  planet_id: string;
  planet_name: string;
  coordinates: string;
  planet_type: string;
  size: number;
  temperature: number;
  population: number;
  max_population: number;
  buildings: Record<string, number>;
  production: {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
  };
}

export function useColonyManagement() {
  const { user } = useAuth();
  const [colonies, setColonies] = useState<Colony[]>([]);
  const [selectedColony, setSelectedColony] = useState<Colony | null>(null);
  const [loading, setLoading] = useState(true);

  const loadColonies = useCallback(async () => {
    if (!user) return;

    try {
      const { data: planets, error } = await supabase
        .from('planets')
        .select('*')
        .eq('owner_id', user.id);

      if (error && error.code !== 'PGRST116') throw error;

      const coloniesList: Colony[] = await Promise.all(
        (planets || []).map(async (planet) => {
          // Load buildings for this planet
          const { data: buildings } = await supabase
            .from('buildings')
            .select('*')
            .eq('player_id', user.id)
            .eq('planet_id', planet.id);

          const buildingLevels: Record<string, number> = {};
          buildings?.forEach(b => {
            buildingLevels[b.building_type] = b.level;
          });

          // Load population
          const { data: popData } = await supabase
            .from('population_data')
            .select('*')
            .eq('planet_id', planet.id)
            .maybeSingle();

          return {
            id: planet.id,
            planet_id: planet.id,
            planet_name: planet.name,
            coordinates: planet.coordinates,
            planet_type: planet.planet_type || 'terrestrial',
            size: planet.size || 100,
            temperature: planet.temperature || 20,
            population: popData?.population || 0,
            max_population: popData?.max_population || 1000,
            buildings: buildingLevels,
            production: {
              metal: calculateProduction('metal', buildingLevels),
              crystal: calculateProduction('crystal', buildingLevels),
              deuterium: calculateProduction('deuterium', buildingLevels),
              energy: calculateProduction('energy', buildingLevels)
            }
          };
        })
      );

      setColonies(coloniesList);
      if (coloniesList.length > 0 && !selectedColony) {
        setSelectedColony(coloniesList[0]);
      }
    } catch (error) {
      console.error('Error loading colonies:', error);
    } finally {
      setLoading(false);
    }
  }, [user, selectedColony]);

  useEffect(() => {
    loadColonies();
  }, [loadColonies]);

  const calculateProduction = (resourceType: string, buildings: Record<string, number>): number => {
    const baseProduction = 30;
    const mineLevel = buildings[`${resourceType}_mine`] || 0;
    return Math.floor(baseProduction * Math.pow(1.1, mineLevel));
  };

  const colonizePlanet = async (
    planetName: string,
    coordinates: string,
    planetType: string
  ) => {
    if (!user) return false;

    try {
      // Create planet
      const { data: newPlanet, error } = await supabase
        .from('planets')
        .insert({
          owner_id: user.id,
          name: planetName,
          coordinates,
          planet_type: planetType,
          size: Math.floor(Math.random() * 100) + 100,
          temperature: Math.floor(Math.random() * 100) - 50
        })
        .select()
        .single();

      if (error) throw error;

      // Initialize population
      await supabase.from('population_data').insert({
        planet_id: newPlanet.id,
        population: 100,
        max_population: 1000,
        growth_rate: 1.02,
        happiness: 100
      });

      // Add starter buildings
      const starterBuildings = [
        { building_type: 'metal_mine', level: 1 },
        { building_type: 'crystal_mine', level: 1 },
        { building_type: 'solar_plant', level: 1 }
      ];

      await supabase.from('buildings').insert(
        starterBuildings.map(b => ({
          player_id: user.id,
          planet_id: newPlanet.id,
          ...b
        }))
      );

      await loadColonies();
      return true;
    } catch (error) {
      console.error('Error colonizing planet:', error);
      return false;
    }
  };

  const abandonColony = async (colonyId: string) => {
    if (!user) return false;

    try {
      // Delete all buildings
      await supabase
        .from('buildings')
        .delete()
        .eq('planet_id', colonyId);

      // Delete population data
      await supabase
        .from('population_data')
        .delete()
        .eq('planet_id', colonyId);

      // Delete planet
      await supabase
        .from('planets')
        .delete()
        .eq('id', colonyId)
        .eq('owner_id', user.id);

      await loadColonies();
      return true;
    } catch (error) {
      console.error('Error abandoning colony:', error);
      return false;
    }
  };

  const selectColony = (colony: Colony) => {
    setSelectedColony(colony);
  };

  const updateColonyName = async (colonyId: string, newName: string) => {
    if (!user) return false;

    try {
      await supabase
        .from('planets')
        .update({ name: newName })
        .eq('id', colonyId)
        .eq('owner_id', user.id);

      await loadColonies();
      return true;
    } catch (error) {
      console.error('Error updating colony name:', error);
      return false;
    }
  };

  return {
    colonies,
    selectedColony,
    loading,
    colonizePlanet,
    abandonColony,
    selectColony,
    updateColonyName,
    reload: loadColonies
  };
}
