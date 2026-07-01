import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface CraftingRecipe {
  id: string;
  name: string;
  category: 'weapon' | 'armor' | 'module' | 'consumable' | 'blueprint' | 'artifact';
  tier: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  description: string;
  crafting_time: number; // in seconds
  required_materials: Array<{
    material_id: string;
    material_name: string;
    quantity: number;
  }>;
  required_resources: {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    dark_matter?: number;
  };
  required_level: number;
  required_technology?: string;
  output_item: {
    type: string;
    id: string;
    name: string;
    quantity: number;
  };
  success_rate: number;
  unlocked: boolean;
}

export interface CraftingQueue {
  id: string;
  player_id: string;
  recipe_id: string;
  recipe_name: string;
  quantity: number;
  progress: number;
  started_at: string;
  completion_time: string;
  status: 'in_progress' | 'completed' | 'failed' | 'cancelled';
}

export interface Material {
  id: string;
  name: string;
  type: 'ore' | 'component' | 'essence' | 'fragment' | 'catalyst';
  rarity: string;
  description: string;
  quantity: number;
  max_stack: number;
}

export const useCrafting = (playerId: string) => {
  const [recipes, setRecipes] = useState<CraftingRecipe[]>([]);
  const [craftingQueue, setCraftingQueue] = useState<CraftingQueue[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (playerId) {
      loadCraftingData();
      
      // Update queue progress every 5 seconds
      const interval = setInterval(updateQueueProgress, 5000);
      return () => clearInterval(interval);
    }
  }, [playerId, loadCraftingData, updateQueueProgress]);

  const loadCraftingData = useCallback(async () => {
    try {
      setLoading(true);

      // Load available recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from('crafting_recipes')
        .select('*')
        .order('tier', { ascending: true });

      if (recipesError) throw recipesError;

      // Load crafting queue
      const { data: queueData, error: queueError } = await supabase
        .from('crafting_queue')
        .select('*')
        .eq('player_id', playerId)
        .in('status', ['in_progress', 'completed'])
        .order('started_at', { ascending: true });

      if (queueError) throw queueError;

      // Load player's materials
      const { data: materialsData, error: materialsError } = await supabase
        .from('crafting_materials')
        .select('*')
        .eq('player_id', playerId);

      if (materialsError) throw materialsError;

      setRecipes(recipesData || []);
      setCraftingQueue(queueData || []);
      setMaterials(materialsData || []);
    } catch (error) {
      console.error('Error loading crafting data:', error);
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  const updateQueueProgress = useCallback(async () => {
    try {
      const { data: queueData, error } = await supabase
        .from('crafting_queue')
        .select('*')
        .eq('player_id', playerId)
        .eq('status', 'in_progress');

      if (error) throw error;

      const now = new Date();
      const updates: any[] = [];

      queueData?.forEach(item => {
        const completionTime = new Date(item.completion_time);
        if (now >= completionTime) {
          updates.push({
            id: item.id,
            status: 'completed',
            progress: 100
          });
        } else {
          const startTime = new Date(item.started_at);
          const totalTime = completionTime.getTime() - startTime.getTime();
          const elapsed = now.getTime() - startTime.getTime();
          const progress = Math.min(100, (elapsed / totalTime) * 100);
          
          updates.push({
            id: item.id,
            progress: Math.floor(progress)
          });
        }
      });

      // Update all items
      for (const update of updates) {
        await supabase
          .from('crafting_queue')
          .update({ 
            status: update.status || 'in_progress',
            progress: update.progress 
          })
          .eq('id', update.id);
      }

      await loadCraftingData();
    } catch (error) {
      console.error('Error updating queue progress:', error);
    }
  }, [playerId]);

  const startCrafting = async (recipeId: string, quantity: number = 1) => {
    try {
      const recipe = recipes.find(r => r.id === recipeId);
      if (!recipe) return { success: false, error: 'Recipe not found' };

      if (!recipe.unlocked) {
        return { success: false, error: 'Recipe not unlocked' };
      }

      // Check materials
      for (const material of recipe.required_materials) {
        const playerMaterial = materials.find(m => m.id === material.material_id);
        if (!playerMaterial || playerMaterial.quantity < material.quantity * quantity) {
          return { success: false, error: `Insufficient ${material.material_name}` };
        }
      }

      // Check resources
      const { data: resources, error: resourceError } = await supabase
        .from('player_resources')
        .select('metal, crystal, deuterium, dark_matter')
        .eq('player_id', playerId)
        .maybeSingle();

      if (resourceError) throw resourceError;

      const res = resources || { metal: 0, crystal: 0, deuterium: 0, dark_matter: 0 };
      if (
        (recipe.required_resources.metal && res.metal < recipe.required_resources.metal * quantity) ||
        (recipe.required_resources.crystal && res.crystal < recipe.required_resources.crystal * quantity) ||
        (recipe.required_resources.deuterium && res.deuterium < recipe.required_resources.deuterium * quantity) ||
        (recipe.required_resources.dark_matter && (res.dark_matter || 0) < recipe.required_resources.dark_matter * quantity)
      ) {
        return { success: false, error: 'Insufficient resources' };
      }

      // Deduct materials
      for (const material of recipe.required_materials) {
        const playerMaterial = materials.find(m => m.id === material.material_id);
        if (playerMaterial) {
          await supabase
            .from('crafting_materials')
            .update({ quantity: playerMaterial.quantity - material.quantity * quantity })
            .eq('id', playerMaterial.id);
        }
      }

      // Deduct resources
      await supabase
        .from('player_resources')
        .update({
          metal: res.metal - (recipe.required_resources.metal || 0) * quantity,
          crystal: res.crystal - (recipe.required_resources.crystal || 0) * quantity,
          deuterium: res.deuterium - (recipe.required_resources.deuterium || 0) * quantity,
          dark_matter: (res.dark_matter || 0) - (recipe.required_resources.dark_matter || 0) * quantity
        })
        .eq('player_id', playerId);

      // Add to crafting queue
      const startTime = new Date();
      const completionTime = new Date(startTime.getTime() + recipe.crafting_time * 1000 * quantity);

      const { error: queueError } = await supabase
        .from('crafting_queue')
        .insert({
          player_id: playerId,
          recipe_id: recipeId,
          recipe_name: recipe.name,
          quantity,
          progress: 0,
          started_at: startTime.toISOString(),
          completion_time: completionTime.toISOString(),
          status: 'in_progress'
        });

      if (queueError) throw queueError;

      await loadCraftingData();
      return { success: true };
    } catch (error) {
      console.error('Error starting crafting:', error);
      return { success: false, error };
    }
  };

  const claimCraftedItem = async (queueId: string) => {
    try {
      const queueItem = craftingQueue.find(q => q.id === queueId);
      if (!queueItem) return { success: false, error: 'Queue item not found' };

      if (queueItem.status !== 'completed') {
        return { success: false, error: 'Item not ready yet' };
      }

      const recipe = recipes.find(r => r.id === queueItem.recipe_id);
      if (!recipe) return { success: false, error: 'Recipe not found' };

      // Success rate check
      const success = Math.random() * 100 <= recipe.success_rate;

      if (success) {
        // Add crafted item to player's inventory
        // Implementation depends on item type
        await addItemToInventory(recipe.output_item, queueItem.quantity);
      }

      // Remove from queue
      await supabase
        .from('crafting_queue')
        .delete()
        .eq('id', queueId);

      await loadCraftingData();
      return { success: true, crafted: success };
    } catch (error) {
      console.error('Error claiming crafted item:', error);
      return { success: false, error };
    }
  };

  const addItemToInventory = async (item: any, _quantity: number) => {
    // Implementation depends on item type
    switch (item.type) {
      case 'weapon':
      case 'armor':
      case 'module':
        // Add to equipment inventory
        break;
      case 'consumable':
        // Add to consumables inventory
        break;
      case 'blueprint':
        // Unlock blueprint
        break;
      case 'artifact':
        // Add to artifacts collection
        break;
    }
  };

  const cancelCrafting = async (queueId: string) => {
    try {
      const queueItem = craftingQueue.find(q => q.id === queueId);
      if (!queueItem) return { success: false, error: 'Queue item not found' };

      // Refund 50% of materials and resources
      const recipe = recipes.find(r => r.id === queueItem.recipe_id);
      if (recipe) {
        // Refund materials
        for (const material of recipe.required_materials) {
          const refundAmount = Math.floor(material.quantity * queueItem.quantity * 0.5);
          const playerMaterial = materials.find(m => m.id === material.material_id);
          
          if (playerMaterial) {
            await supabase
              .from('crafting_materials')
              .update({ quantity: playerMaterial.quantity + refundAmount })
              .eq('id', playerMaterial.id);
          }
        }

        // Refund resources
        const { data: resources } = await supabase
          .from('player_resources')
          .select('*')
          .eq('player_id', playerId)
          .maybeSingle();

        if (resources) {
          await supabase
            .from('player_resources')
            .update({
              metal: resources.metal + Math.floor((recipe.required_resources.metal || 0) * queueItem.quantity * 0.5),
              crystal: resources.crystal + Math.floor((recipe.required_resources.crystal || 0) * queueItem.quantity * 0.5),
              deuterium: resources.deuterium + Math.floor((recipe.required_resources.deuterium || 0) * queueItem.quantity * 0.5),
              dark_matter: (resources.dark_matter || 0) + Math.floor((recipe.required_resources.dark_matter || 0) * queueItem.quantity * 0.5)
            })
            .eq('player_id', playerId);
        }
      }

      // Remove from queue
      await supabase
        .from('crafting_queue')
        .delete()
        .eq('id', queueId);

      await loadCraftingData();
      return { success: true };
    } catch (error) {
      console.error('Error cancelling crafting:', error);
      return { success: false, error };
    }
  };

  const speedUpCrafting = async (queueId: string, darkMatterCost: number) => {
    try {
      const { data: resources, error: resourceError } = await supabase
        .from('player_resources')
        .select('dark_matter')
        .eq('player_id', playerId)
        .maybeSingle();

      if (resourceError) throw resourceError;

      const dm = resources?.dark_matter || 0;
      if (dm < darkMatterCost) {
        return { success: false, error: 'Insufficient dark matter' };
      }

      // Deduct dark matter
      await supabase
        .from('player_resources')
        .update({ dark_matter: dm - darkMatterCost })
        .eq('player_id', playerId);

      // Complete crafting instantly
      await supabase
        .from('crafting_queue')
        .update({ 
          status: 'completed',
          progress: 100,
          completion_time: new Date().toISOString()
        })
        .eq('id', queueId);

      await loadCraftingData();
      return { success: true };
    } catch (error) {
      console.error('Error speeding up crafting:', error);
      return { success: false, error };
    }
  };

  const canCraft = (recipeId: string, quantity: number = 1) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe || !recipe.unlocked) return false;

    // Check materials
    for (const material of recipe.required_materials) {
      const playerMaterial = materials.find(m => m.id === material.material_id);
      if (!playerMaterial || playerMaterial.quantity < material.quantity * quantity) {
        return false;
      }
    }

    return true;
  };

  return {
    recipes,
    craftingQueue,
    materials,
    loading,
    startCrafting,
    claimCraftedItem,
    cancelCrafting,
    speedUpCrafting,
    canCraft,
    reload: loadCraftingData
  };
};