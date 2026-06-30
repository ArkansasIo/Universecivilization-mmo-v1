import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { MEGASTRUCTURE_DATA, calculateMegastructureProgress, getNextConstructionStage } from '../data/megastructures';

interface PlayerMegastructure {
  id: string;
  player_id: string;
  megastructure_id: string;
  location: string;
  tier: number;
  construction_progress: number;
  is_complete: boolean;
  current_stage: number;
  stage_progress: number;
  active_effects: {
    energyProduction?: number;
    researchBonus?: number;
    productionBonus?: number;
    populationCapacity?: number;
    defenseBonus?: number;
    tradeBonus?: number;
    storageBonus?: number;
  };
  last_updated: string;
}

export function useMegastructureManager() {
  const { user } = useAuth();
  const [megastructures, setMegastructures] = useState<PlayerMegastructure[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMegastructures = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('megastructures')
        .select('*')
        .eq('player_id', user.id);

      if (error) throw error;
      setMegastructures(data || []);
    } catch (error) {
      console.error('Error loading megastructures:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadMegastructures();

    if (!user) return;

    const channel = supabase
      .channel('megastructure-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'megastructures',
          filter: `player_id=eq.${user.id}`
        },
        () => {
          loadMegastructures();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadMegastructures]);

  const startConstruction = async (megastructureId: string, location: string) => {
    if (!user) throw new Error('User not authenticated');

    const template = MEGASTRUCTURE_DATA.find(m => m.id === megastructureId);
    if (!template) throw new Error('Megastructure template not found');

    try {
      const { data, error } = await supabase.from('megastructures').insert({
        player_id: user.id,
        megastructure_id: megastructureId,
        location,
        tier: 1,
        construction_progress: 0,
        is_complete: false,
        current_stage: 1,
        stage_progress: 0,
        active_effects: {},
        last_updated: new Date().toISOString()
      }).select().single();

      if (error) throw error;
      await loadMegastructures();
      return data;
    } catch (error) {
      console.error('Error starting construction:', error);
      throw error;
    }
  };

  const continueConstruction = async (megastructureId: string, _resources: {
    metal: number;
    crystal: number;
    deuterium: number;
    darkMatter?: number;
  }) => {
    const playerMega = megastructures.find(m => m.id === megastructureId);
    if (!playerMega) return;

    const template = MEGASTRUCTURE_DATA.find(m => m.id === playerMega.megastructure_id);
    if (!template) return;

    const nextStage = getNextConstructionStage(template);
    if (!nextStage) {
      await completeMegastructure(megastructureId);
      return;
    }

    try {
      const progressIncrease = 10;
      const newStageProgress = Math.min(100, playerMega.stage_progress + progressIncrease);
      const newCurrentStage = newStageProgress >= 100 ? playerMega.current_stage + 1 : playerMega.current_stage;
      const newConstructionProgress = calculateMegastructureProgress(template);

      const { error } = await supabase
        .from('megastructures')
        .update({
          stage_progress: newStageProgress >= 100 ? 0 : newStageProgress,
          current_stage: newCurrentStage,
          construction_progress: newConstructionProgress,
          last_updated: new Date().toISOString()
        })
        .eq('id', megastructureId);

      if (error) throw error;
      await loadMegastructures();
    } catch (error) {
      console.error('Error continuing construction:', error);
      throw error;
    }
  };

  const completeMegastructure = async (megastructureId: string) => {
    const playerMega = megastructures.find(m => m.id === megastructureId);
    if (!playerMega) return;

    const template = MEGASTRUCTURE_DATA.find(m => m.id === playerMega.megastructure_id);
    if (!template) return;

    try {
      const { error } = await supabase
        .from('megastructures')
        .update({
          is_complete: true,
          construction_progress: 100,
          active_effects: template.effects,
          last_updated: new Date().toISOString()
        })
        .eq('id', megastructureId);

      if (error) throw error;
      await loadMegastructures();
    } catch (error) {
      console.error('Error completing megastructure:', error);
      throw error;
    }
  };

  const upgradeTier = async (megastructureId: string) => {
    const playerMega = megastructures.find(m => m.id === megastructureId);
    if (!playerMega || !playerMega.is_complete) return;

    const template = MEGASTRUCTURE_DATA.find(m => m.id === playerMega.megastructure_id);
    if (!template || playerMega.tier >= template.maxTier) return;

    try {
      const newTier = playerMega.tier + 1;
      const effectMultiplier = 1.5;

      const upgradedEffects = Object.entries(playerMega.active_effects).reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'number' ? Math.floor(value * effectMultiplier) : value;
        return acc;
      }, {} as typeof playerMega.active_effects);

      const { error } = await supabase
        .from('megastructures')
        .update({
          tier: newTier,
          active_effects: upgradedEffects,
          last_updated: new Date().toISOString()
        })
        .eq('id', megastructureId);

      if (error) throw error;
      await loadMegastructures();
    } catch (error) {
      console.error('Error upgrading tier:', error);
      throw error;
    }
  };

  const calculateTotalBonuses = () => {
    return megastructures
      .filter(m => m.is_complete)
      .reduce((totals, mega) => {
        Object.entries(mega.active_effects).forEach(([key, value]) => {
          if (typeof value === 'number') {
            totals[key] = (totals[key] || 0) + value;
          }
        });
        return totals;
      }, {} as Record<string, number>);
  };

  return {
    megastructures,
    loading,
    startConstruction,
    continueConstruction,
    completeMegastructure,
    upgradeTier,
    calculateTotalBonuses,
    loadMegastructures
  };
}
