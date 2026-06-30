import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ProductionRates {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
  energyConsumption: number;
}

interface StorageCapacity {
  metal: number;
  crystal: number;
  deuterium: number;
}

interface ResearchBonuses {
  metalBonus: number;
  crystalBonus: number;
  deuteriumBonus: number;
  energyBonus: number;
}

export function useRealTimeProduction() {
  const { user } = useAuth();
  const [productionRates, setProductionRates] = useState<ProductionRates>({
    metal: 0,
    crystal: 0,
    deuterium: 0,
    energy: 0,
    energyConsumption: 0
  });
  const [storageCapacity, setStorageCapacity] = useState<StorageCapacity>({
    metal: 10000,
    crystal: 10000,
    deuterium: 10000
  });
  const [currentResources, setCurrentResources] = useState({
    metal: 0,
    crystal: 0,
    deuterium: 0,
    energy: 0
  });
  const [researchBonuses, setResearchBonuses] = useState<ResearchBonuses>({
    metalBonus: 0,
    crystalBonus: 0,
    deuteriumBonus: 0,
    energyBonus: 0
  });
  const [isProducing, setIsProducing] = useState(false);
  const lastUpdateRef = useRef<number>(Date.now());
  const isUpdatingRef = useRef(false);
  const mountedRef = useRef(true);

  // Calculate research bonuses
  const calculateResearchBonuses = useCallback(async () => {
    if (!user) return;

    try {
      const { data: research } = await supabase
        .from('research')
        .select('technology_id, level')
        .eq('player_id', user.id);

      if (!research) return;

      const bonuses: ResearchBonuses = {
        metalBonus: 0,
        crystalBonus: 0,
        deuteriumBonus: 0,
        energyBonus: 0
      };

      research.forEach(tech => {
        const level = tech.level || 0;
        switch (tech.technology_id) {
          case 'plasma_technology':
            bonuses.metalBonus += level * 1; // 1% per level
            bonuses.crystalBonus += level * 0.66;
            bonuses.deuteriumBonus += level * 0.33;
            break;
          case 'energy_technology':
            bonuses.energyBonus += level * 2; // 2% per level
            break;
          case 'mining_efficiency':
            bonuses.metalBonus += level * 2;
            bonuses.crystalBonus += level * 2;
            break;
          case 'deuterium_synthesis':
            bonuses.deuteriumBonus += level * 3;
            break;
        }
      });

      setResearchBonuses(bonuses);
    } catch (error) {
      console.error('Error calculating research bonuses:', error);
    }
  }, [user]);

  // Calculate production rates based on buildings
  const calculateProductionRates = useCallback(async () => {
    if (!user || !mountedRef.current) return;

    try {
      const { data: buildings } = await supabase
        .from('buildings')
        .select('building_type, level')
        .eq('player_id', user.id);

      if (!buildings) {
        setIsProducing(false);
        return;
      }

      const buildingsMap: Record<string, number> = {};
      buildings.forEach(b => {
        buildingsMap[b.building_type] = (buildingsMap[b.building_type] || 0) + (b.level || 0);
      });

      // Base production calculations with exponential growth
      const metalMineLevel = buildingsMap.metal_mine || 0;
      const crystalMineLevel = buildingsMap.crystal_mine || 0;
      const deuteriumLevel = buildingsMap.deuterium_synthesizer || 0;
      const solarPlantLevel = buildingsMap.solar_plant || 0;
      const fusionReactorLevel = buildingsMap.fusion_reactor || 0;

      // Base production per hour
      const baseMetalProd = Math.floor(metalMineLevel * 30 * Math.pow(1.1, metalMineLevel));
      const baseCrystalProd = Math.floor(crystalMineLevel * 20 * Math.pow(1.1, crystalMineLevel));
      const baseDeuteriumProd = Math.floor(deuteriumLevel * 10 * Math.pow(1.1, deuteriumLevel));
      
      // Apply research bonuses
      const metalProd = Math.floor(baseMetalProd * (1 + researchBonuses.metalBonus / 100));
      const crystalProd = Math.floor(baseCrystalProd * (1 + researchBonuses.crystalBonus / 100));
      const deuteriumProd = Math.floor(baseDeuteriumProd * (1 + researchBonuses.deuteriumBonus / 100));
      
      // Energy production
      const baseSolarEnergy = Math.floor(solarPlantLevel * 20 * Math.pow(1.05, solarPlantLevel));
      const baseFusionEnergy = Math.floor(fusionReactorLevel * 50 * Math.pow(1.05, fusionReactorLevel));
      const solarEnergy = Math.floor(baseSolarEnergy * (1 + researchBonuses.energyBonus / 100));
      const fusionEnergy = Math.floor(baseFusionEnergy * (1 + researchBonuses.energyBonus / 100));

      // Energy consumption
      const energyConsumption = Math.floor(
        metalMineLevel * 10 * Math.pow(1.1, metalMineLevel) +
        crystalMineLevel * 10 * Math.pow(1.1, crystalMineLevel) +
        deuteriumLevel * 20 * Math.pow(1.1, deuteriumLevel)
      );

      const totalEnergy = solarEnergy + fusionEnergy;

      setProductionRates({
        metal: metalProd,
        crystal: crystalProd,
        deuterium: deuteriumProd,
        energy: totalEnergy,
        energyConsumption
      });

      // Calculate storage capacity
      const metalStorageLevel = buildingsMap.metal_storage || 0;
      const crystalStorageLevel = buildingsMap.crystal_storage || 0;
      const deuteriumTankLevel = buildingsMap.deuterium_tank || 0;

      setStorageCapacity({
        metal: 10000 * Math.pow(2, metalStorageLevel),
        crystal: 10000 * Math.pow(2, crystalStorageLevel),
        deuterium: 10000 * Math.pow(2, deuteriumTankLevel)
      });

      setIsProducing(metalProd > 0 || crystalProd > 0 || deuteriumProd > 0);
    } catch (error) {
      console.error('Error calculating production:', error);
      setIsProducing(false);
    }
  }, [user, researchBonuses]);

  // Real-time resource accumulation (updates every second)
  useEffect(() => {
    if (!user || !isProducing || !mountedRef.current) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateRef.current) / 1000; // seconds
      lastUpdateRef.current = now;

      setCurrentResources(prev => {
        // Calculate energy efficiency
        const energyEfficiency = productionRates.energy >= productionRates.energyConsumption 
          ? 1 
          : Math.max(0, productionRates.energy / productionRates.energyConsumption);

        // Calculate resource gains per second
        const metalGain = (productionRates.metal / 3600) * deltaTime * energyEfficiency;
        const crystalGain = (productionRates.crystal / 3600) * deltaTime * energyEfficiency;
        const deuteriumGain = (productionRates.deuterium / 3600) * deltaTime * energyEfficiency;

        // Apply storage limits
        const newMetal = Math.min(storageCapacity.metal, Math.max(0, prev.metal + metalGain));
        const newCrystal = Math.min(storageCapacity.crystal, Math.max(0, prev.crystal + crystalGain));
        const newDeuterium = Math.min(storageCapacity.deuterium, Math.max(0, prev.deuterium + deuteriumGain));

        return {
          metal: newMetal,
          crystal: newCrystal,
          deuterium: newDeuterium,
          energy: productionRates.energy
        };
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [user, isProducing, productionRates, storageCapacity]);

  // Sync with database every 10 seconds
  useEffect(() => {
    if (!user || !isProducing || !mountedRef.current) return;

    const syncInterval = setInterval(async () => {
      if (isUpdatingRef.current) return;
      isUpdatingRef.current = true;

      try {
        // Check if resources exist
        const { data: existing } = await supabase
          .from('resources')
          .select('id')
          .eq('player_id', user.id)
          .maybeSingle();

        if (existing) {
          // Update existing resources
          await supabase
            .from('resources')
            .update({
              metal: Math.floor(currentResources.metal),
              crystal: Math.floor(currentResources.crystal),
              deuterium: Math.floor(currentResources.deuterium),
              energy: currentResources.energy,
              updated_at: new Date().toISOString()
            })
            .eq('player_id', user.id);
        } else {
          // Create new resource record
          await supabase
            .from('resources')
            .insert({
              player_id: user.id,
              metal: Math.floor(currentResources.metal),
              crystal: Math.floor(currentResources.crystal),
              deuterium: Math.floor(currentResources.deuterium),
              energy: currentResources.energy,
              dark_matter: 0,
              created_at: new Date().toISOString()
            });
        }
      } catch (error) {
        console.error('Error syncing resources:', error);
      } finally {
        isUpdatingRef.current = false;
      }
    }, 10000); // Sync every 10 seconds

    return () => clearInterval(syncInterval);
  }, [user, isProducing, currentResources]);

  // Load initial resources and calculate production
  useEffect(() => {
    mountedRef.current = true;

    if (!user) return;

    const initialize = async () => {
      try {
        // Load current resources
        const { data: resourceData } = await supabase
          .from('resources')
          .select('*')
          .eq('player_id', user.id)
          .maybeSingle();

        if (resourceData && mountedRef.current) {
          setCurrentResources({
            metal: resourceData.metal || 0,
            crystal: resourceData.crystal || 0,
            deuterium: resourceData.deuterium || 0,
            energy: resourceData.energy || 0
          });
        } else if (mountedRef.current) {
          // Initialize with starting resources
          const { data: newData } = await supabase
            .from('resources')
            .insert({
              player_id: user.id,
              metal: 500,
              crystal: 300,
              deuterium: 100,
              energy: 0,
              dark_matter: 0,
              created_at: new Date().toISOString()
            })
            .select()
            .single();

          if (newData && mountedRef.current) {
            setCurrentResources({
              metal: newData.metal || 500,
              crystal: newData.crystal || 300,
              deuterium: newData.deuterium || 100,
              energy: newData.energy || 0
            });
          }
        }

        // Calculate research bonuses and production rates
        await calculateResearchBonuses();
        await calculateProductionRates();
      } catch (error) {
        console.error('Error initializing production:', error);
      }
    };

    initialize();

    return () => {
      mountedRef.current = false;
    };
  }, [user, calculateResearchBonuses, calculateProductionRates]);

  // Recalculate production when research bonuses change
  useEffect(() => {
    if (user && mountedRef.current) {
      calculateProductionRates();
    }
  }, [researchBonuses, calculateProductionRates, user]);

  return {
    productionRates,
    storageCapacity,
    currentResources,
    researchBonuses,
    isProducing,
    energyEfficiency: productionRates.energyConsumption > 0
      ? Math.min(100, Math.floor((productionRates.energy / productionRates.energyConsumption) * 100))
      : 100,
    storagePercentage: {
      metal: storageCapacity.metal > 0 ? Math.floor((currentResources.metal / storageCapacity.metal) * 100) : 0,
      crystal: storageCapacity.crystal > 0 ? Math.floor((currentResources.crystal / storageCapacity.crystal) * 100) : 0,
      deuterium: storageCapacity.deuterium > 0 ? Math.floor((currentResources.deuterium / storageCapacity.deuterium) * 100) : 0
    },
    recalculate: calculateProductionRates,
    refreshBonuses: calculateResearchBonuses
  };
}