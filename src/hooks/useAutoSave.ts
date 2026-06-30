import { useEffect, useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface GameState {
  resources: {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    darkMatter: number;
  };
  buildings: any[];
  research: any[];
  ships: any[];
  fleets: any[];
  credits: number;
  level: number;
}

export const useAutoSave = (gameState: GameState, interval: number = 30000) => {
  const { user } = useAuth();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const saveGameState = useCallback(async () => {
    if (!user || isSaving) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      // Save resources
      const { error: resourceError } = await supabase
        .from('resources')
        .upsert({
          player_id: user.id,
          metal: gameState.resources.metal,
          crystal: gameState.resources.crystal,
          deuterium: gameState.resources.deuterium,
          energy: gameState.resources.energy,
          dark_matter: gameState.resources.darkMatter,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'player_id' });

      if (resourceError) throw resourceError;

      // Update player data
      const { error: playerError } = await supabase
        .from('players')
        .update({
          credits: gameState.credits,
          level: gameState.level,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (playerError) throw playerError;

      // Save buildings
      if (gameState.buildings.length > 0) {
        const buildingsToSave = gameState.buildings.map(building => ({
          player_id: user.id,
          building_type: building.type,
          level: building.level,
          planet_id: building.planetId || 'homeworld',
          status: building.status || 'active',
          completion_time: building.completionTime || null,
          updated_at: new Date().toISOString(),
        }));

        const { error: buildingError } = await supabase
          .from('buildings')
          .upsert(buildingsToSave, { 
            onConflict: 'player_id,building_type,planet_id' 
          });

        if (buildingError) throw buildingError;
      }

      // Save research
      if (gameState.research.length > 0) {
        const researchToSave = gameState.research.map(tech => ({
          player_id: user.id,
          technology_id: tech.id,
          level: tech.level,
          status: tech.status || 'completed',
          completion_time: tech.completionTime || null,
          updated_at: new Date().toISOString(),
        }));

        const { error: researchError } = await supabase
          .from('research')
          .upsert(researchToSave, { 
            onConflict: 'player_id,technology_id' 
          });

        if (researchError) throw researchError;
      }

      // Save ships
      if (gameState.ships.length > 0) {
        const shipsToSave = gameState.ships.map(ship => ({
          player_id: user.id,
          ship_type: ship.type,
          quantity: ship.quantity,
          location: ship.location || 'homeworld',
          status: ship.status || 'idle',
          updated_at: new Date().toISOString(),
        }));

        const { error: shipError } = await supabase
          .from('ships')
          .upsert(shipsToSave, { 
            onConflict: 'player_id,ship_type,location' 
          });

        if (shipError) throw shipError;
      }

      // Save fleets
      if (gameState.fleets.length > 0) {
        const fleetsToSave = gameState.fleets.map(fleet => ({
          player_id: user.id,
          fleet_name: fleet.name,
          mission_type: fleet.missionType,
          origin: fleet.origin,
          destination: fleet.destination,
          arrival_time: fleet.arrivalTime,
          return_time: fleet.returnTime,
          status: fleet.status,
          ships: fleet.ships,
          updated_at: new Date().toISOString(),
        }));

        const { error: fleetError } = await supabase
          .from('fleets')
          .upsert(fleetsToSave, { 
            onConflict: 'player_id,fleet_name' 
          });

        if (fleetError) throw fleetError;
      }

      setLastSaved(new Date());
      console.log('✅ Game saved successfully');
    } catch (error: any) {
      console.error('❌ Auto-save error:', error);
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  }, [user, gameState, isSaving]);

  // Auto-save interval
  useEffect(() => {
    if (!user) return;

    const intervalId = setInterval(() => {
      saveGameState();
    }, interval);

    return () => clearInterval(intervalId);
  }, [user, saveGameState, interval]);

  // Save on page unload
  useEffect(() => {
    if (!user) return;

    const handleBeforeUnload = () => {
      saveGameState();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user, saveGameState]);

  // Manual save function
  const manualSave = useCallback(() => {
    saveGameState();
  }, [saveGameState]);

  return {
    lastSaved,
    isSaving,
    saveError,
    manualSave,
  };
};
