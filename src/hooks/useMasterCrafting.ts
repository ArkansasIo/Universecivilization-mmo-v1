import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { craftingItems, CraftingItem } from '../data/craftingItems';
import { craftingMaterials } from '../data/craftingMaterials';

export interface CraftingQueue {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  startTime: Date;
  endTime: Date;
  progress: number;
  status: 'crafting' | 'completed' | 'cancelled';
}

export interface PlayerMaterial {
  materialId: string;
  materialName: string;
  quantity: number;
}

export interface CraftingSkill {
  skillName: string;
  level: number;
  experience: number;
  nextLevelXP: number;
}

interface CraftingMaterial {
  id: string;
  name: string;
  quantity: number;
  icon: string;
}

export const useMasterCrafting = (playerId: string) => {
  const [craftingQueue, setCraftingQueue] = useState<CraftingQueue[]>([]);
  const [materials, setMaterials] = useState<CraftingMaterial[]>([]);
  const [craftingSkills, setCraftingSkills] = useState<CraftingSkill[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize crafting skills
  const initializeSkills = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('master_crafting_skills')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading skills:', error);
        // If table doesn't exist, initialize with default skills
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          const defaultSkills: CraftingSkill[] = [
            { skillName: 'Weaponsmithing', level: 1, experience: 0, nextLevelXP: 100 },
            { skillName: 'Armorsmithing', level: 1, experience: 0, nextLevelXP: 100 },
            { skillName: 'Engineering', level: 1, experience: 0, nextLevelXP: 100 },
            { skillName: 'Alchemy', level: 1, experience: 0, nextLevelXP: 100 },
            { skillName: 'Enchanting', level: 1, experience: 0, nextLevelXP: 100 }
          ];
          setCraftingSkills(defaultSkills);
          return;
        }
        throw error;
      }

      if (data && data.length > 0) {
        const loadedSkills: CraftingSkill[] = data.map(s => ({
          skillName: s.skill_name,
          level: s.level,
          experience: s.experience,
          nextLevelXP: s.level * 100
        }));
        setCraftingSkills(loadedSkills);
      } else {
        // Initialize default skills if none exist
        const defaultSkills: CraftingSkill[] = [
          { skillName: 'Weaponsmithing', level: 1, experience: 0, nextLevelXP: 100 },
          { skillName: 'Armorsmithing', level: 1, experience: 0, nextLevelXP: 100 },
          { skillName: 'Engineering', level: 1, experience: 0, nextLevelXP: 100 },
          { skillName: 'Alchemy', level: 1, experience: 0, nextLevelXP: 100 },
          { skillName: 'Enchanting', level: 1, experience: 0, nextLevelXP: 100 }
        ];
        setCraftingSkills(defaultSkills);

        // Save default skills to database
        for (const skill of defaultSkills) {
          await supabase.from('master_crafting_skills').insert({
            user_id: user.id,
            skill_name: skill.skillName,
            level: skill.level,
            experience: skill.experience
          });
        }
      }
    } catch (error: any) {
      console.error('Error initializing skills:', error);
      // Set default skills on error
      const defaultSkills: CraftingSkill[] = [
        { skillName: 'Weaponsmithing', level: 1, experience: 0, nextLevelXP: 100 },
        { skillName: 'Armorsmithing', level: 1, experience: 0, nextLevelXP: 100 },
        { skillName: 'Engineering', level: 1, experience: 0, nextLevelXP: 100 },
        { skillName: 'Alchemy', level: 1, experience: 0, nextLevelXP: 100 },
        { skillName: 'Enchanting', level: 1, experience: 0, nextLevelXP: 100 }
      ];
      setCraftingSkills(defaultSkills);
    }
  };

  // Load player materials
  const loadMaterials = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('master_crafting_materials')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading materials:', error);
        // If table doesn't exist, initialize with default materials
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          const defaultMaterials: CraftingMaterial[] = [
            { id: 'metal', name: 'Metal', quantity: 10000, icon: 'ri-copper-coin-line' },
            { id: 'crystal', name: 'Crystal', quantity: 5000, icon: 'ri-vip-diamond-line' },
            { id: 'deuterium', name: 'Deuterium', quantity: 2000, icon: 'ri-drop-line' },
            { id: 'rare_ore', name: 'Rare Ore', quantity: 100, icon: 'ri-treasure-map-line' },
            { id: 'exotic_matter', name: 'Exotic Matter', quantity: 50, icon: 'ri-magic-line' },
            { id: 'dark_energy', name: 'Dark Energy', quantity: 25, icon: 'ri-flashlight-line' }
          ];
          setMaterials(defaultMaterials);
          return;
        }
        throw error;
      }

      if (data && data.length > 0) {
        const loadedMaterials: CraftingMaterial[] = data.map(m => ({
          id: m.material_id,
          name: m.material_name,
          quantity: m.quantity,
          icon: getMaterialIcon(m.material_id)
        }));
        setMaterials(loadedMaterials);
      } else {
        // Initialize default materials if none exist
        const defaultMaterials: CraftingMaterial[] = [
          { id: 'metal', name: 'Metal', quantity: 10000, icon: 'ri-copper-coin-line' },
          { id: 'crystal', name: 'Crystal', quantity: 5000, icon: 'ri-vip-diamond-line' },
          { id: 'deuterium', name: 'Deuterium', quantity: 2000, icon: 'ri-drop-line' },
          { id: 'rare_ore', name: 'Rare Ore', quantity: 100, icon: 'ri-treasure-map-line' },
          { id: 'exotic_matter', name: 'Exotic Matter', quantity: 50, icon: 'ri-magic-line' },
          { id: 'dark_energy', name: 'Dark Energy', quantity: 25, icon: 'ri-flashlight-line' }
        ];
        setMaterials(defaultMaterials);

        // Save default materials to database
        for (const material of defaultMaterials) {
          await supabase.from('master_crafting_materials').insert({
            user_id: user.id,
            material_id: material.id,
            material_name: material.name,
            quantity: material.quantity
          });
        }
      }
    } catch (error: any) {
      console.error('Error loading materials:', error);
      // Set default materials on error
      const defaultMaterials: CraftingMaterial[] = [
        { id: 'metal', name: 'Metal', quantity: 10000, icon: 'ri-copper-coin-line' },
        { id: 'crystal', name: 'Crystal', quantity: 5000, icon: 'ri-vip-diamond-line' },
        { id: 'deuterium', name: 'Deuterium', quantity: 2000, icon: 'ri-drop-line' },
        { id: 'rare_ore', name: 'Rare Ore', quantity: 100, icon: 'ri-treasure-map-line' },
        { id: 'exotic_matter', name: 'Exotic Matter', quantity: 50, icon: 'ri-magic-line' },
        { id: 'dark_energy', name: 'Dark Energy', quantity: 25, icon: 'ri-flashlight-line' }
      ];
      setMaterials(defaultMaterials);
    }
  };

  // Load crafting queue
  const loadCraftingQueue = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('master_crafting_queue')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'in_progress');

      if (error) {
        console.error('Error loading crafting queue:', error);
        // If table doesn't exist, just set empty queue
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          setCraftingQueue([]);
          return;
        }
        throw error;
      }

      if (data) {
        setCraftingQueue(data.map(q => ({
          id: q.id,
          itemId: q.item_id,
          itemName: q.item_name,
          quantity: q.quantity,
          startTime: new Date(q.start_time),
          endTime: new Date(q.end_time),
          progress: q.progress,
          status: q.status
        })));
      }
    } catch (error: any) {
      console.error('Error loading crafting queue:', error);
      // Set empty queue on error to prevent UI issues
      setCraftingQueue([]);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([
        initializeSkills(),
        loadMaterials(),
        loadCraftingQueue()
      ]);
      setLoading(false);
    };

    init();

    // Update crafting progress every second
    const interval = setInterval(() => {
      updateCraftingProgress();
    }, 1000);

    return () => clearInterval(interval);
  }, [playerId]);

  // Update crafting progress
  const updateCraftingProgress = () => {
    setCraftingQueue(prev => prev.map(item => {
      if (item.status === 'crafting') {
        const now = new Date();
        const totalTime = item.endTime.getTime() - item.startTime.getTime();
        const elapsed = now.getTime() - item.startTime.getTime();
        const progress = Math.min(100, (elapsed / totalTime) * 100);

        if (progress >= 100) {
          return { ...item, progress: 100, status: 'completed' as const };
        }

        return { ...item, progress };
      }
      return item;
    }));
  };

  // Start crafting an item
  const startCrafting = async (itemId: string, quantity: number = 1) => {
    try {
      const item = craftingItems.find(i => i.id === itemId);
      if (!item) throw new Error('Item not found');

      // Check skill requirements
      if (item.requiredSkill) {
        const skill = craftingSkills.find(s => s.skillName === item.requiredSkill);
        if (!skill || skill.level < (item.requiredSkillLevel || 0)) {
          throw new Error(`Requires ${item.requiredSkill} level ${item.requiredSkillLevel}`);
        }
      }

      // Check materials
      for (const mat of item.materials) {
        const playerMat = materials.find(m => m.id === mat.id);
        if (!playerMat || playerMat.quantity < mat.amount * quantity) {
          throw new Error(`Insufficient ${mat.name}`);
        }
      }

      // Deduct materials
      for (const mat of item.materials) {
        await updateMaterialQuantity(mat.id, -mat.amount * quantity);
      }

      // Add to crafting queue
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + item.craftingTime * 1000 * quantity);

      const { data, error } = await supabase
        .from('crafting_queue')
        .insert({
          player_id: playerId,
          item_id: itemId,
          item_name: item.name,
          quantity,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          progress: 0,
          status: 'crafting'
        })
        .select()
        .single();

      if (error) throw error;

      await loadCraftingQueue();
      return { success: true, message: `Started crafting ${item.name}` };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  // Speed up crafting with dark matter
  const speedUpCrafting = async (queueId: string, darkMatterCost: number) => {
    try {
      const { error } = await supabase
        .from('crafting_queue')
        .update({
          status: 'completed',
          progress: 100,
          end_time: new Date().toISOString()
        })
        .eq('id', queueId);

      if (error) throw error;

      await loadCraftingQueue();
      return { success: true, message: 'Crafting completed instantly!' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  // Claim completed item
  const claimCraftedItem = async (queueId: string) => {
    try {
      const queueItem = craftingQueue.find(q => q.id === queueId);
      if (!queueItem || queueItem.status !== 'completed') {
        throw new Error('Item not ready to claim');
      }

      const item = craftingItems.find(i => i.id === queueItem.itemId);
      if (!item) throw new Error('Item not found');

      // Add item to inventory
      const { error: invError } = await supabase
        .from('player_inventory')
        .insert({
          player_id: playerId,
          item_id: item.id,
          item_name: item.name,
          item_type: item.type,
          quantity: queueItem.quantity,
          rarity: item.rarity
        });

      if (invError) throw invError;

      // Remove from queue
      const { error: queueError } = await supabase
        .from('crafting_queue')
        .delete()
        .eq('id', queueId);

      if (queueError) throw queueError;

      // Add skill experience
      if (item.requiredSkill) {
        await addSkillExperience(item.requiredSkill, item.tier * 100);
      }

      await loadCraftingQueue();
      return { success: true, message: `Claimed ${queueItem.quantity}x ${item.name}!` };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  // Cancel crafting
  const cancelCrafting = async (queueId: string) => {
    try {
      const queueItem = craftingQueue.find(q => q.id === queueId);
      if (!queueItem) throw new Error('Queue item not found');

      const item = craftingItems.find(i => i.id === queueItem.itemId);
      if (!item) throw new Error('Item not found');

      // Refund 50% of materials
      for (const mat of item.materials) {
        await updateMaterialQuantity(mat.id, Math.floor(mat.amount * queueItem.quantity * 0.5));
      }

      // Remove from queue
      const { error } = await supabase
        .from('crafting_queue')
        .delete()
        .eq('id', queueId);

      if (error) throw error;

      await loadCraftingQueue();
      return { success: true, message: 'Crafting cancelled, 50% materials refunded' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  // Add material
  const addMaterial = async (materialId: string, amount: number) => {
    await updateMaterialQuantity(materialId, amount);
  };

  // Update material quantity
  const updateMaterialQuantity = async (materialId: string, change: number) => {
    try {
      const material = craftingMaterials.find(m => m.id === materialId);
      if (!material) throw new Error('Material not found');

      const existing = materials.find(m => m.id === materialId);

      if (existing) {
        const newQuantity = Math.max(0, existing.quantity + change);
        
        const { error } = await supabase
          .from('crafting_materials')
          .update({ quantity: newQuantity })
          .eq('player_id', playerId)
          .eq('material_id', materialId);

        if (error) throw error;
      } else if (change > 0) {
        const { error } = await supabase
          .from('crafting_materials')
          .insert({
            player_id: playerId,
            material_id: materialId,
            material_name: material.name,
            quantity: change
          });

        if (error) throw error;
      }

      await loadMaterials();
    } catch (error) {
      console.error('Error updating material:', error);
    }
  };

  // Add skill experience
  const addSkillExperience = async (skillName: string, xp: number) => {
    setCraftingSkills(prev => prev.map(skill => {
      if (skill.skillName === skillName) {
        const newXP = skill.experience + xp;
        const newLevel = Math.floor(newXP / skill.nextLevelXP) + 1;
        const nextLevelXP = newLevel * 1000;

        return {
          ...skill,
          experience: newXP,
          level: Math.max(skill.level, newLevel),
          nextLevelXP
        };
      }
      return skill;
    }));
  };

  // Get craftable items
  const getCraftableItems = () => {
    return craftingItems.filter(item => {
      // Check skill requirements
      if (item.requiredSkill) {
        const skill = craftingSkills.find(s => s.skillName === item.requiredSkill);
        if (!skill || skill.level < (item.requiredSkillLevel || 0)) {
          return false;
        }
      }

      // Check if player has materials
      const hasMaterials = item.materials.every(mat => {
        const playerMat = materials.find(m => m.id === mat.id);
        return playerMat && playerMat.quantity >= mat.amount;
      });

      return hasMaterials;
    });
  };

  // Dismantle item for materials
  const dismantleItem = async (itemId: string) => {
    try {
      const item = craftingItems.find(i => i.id === itemId);
      if (!item) throw new Error('Item not found');

      // Return 25% of materials
      for (const mat of item.materials) {
        await updateMaterialQuantity(mat.id, Math.floor(mat.amount * 0.25));
      }

      return { success: true, message: `Dismantled ${item.name}, received materials` };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const getMaterialIcon = (materialId: string): string => {
    const iconMap: Record<string, string> = {
      metal: 'ri-copper-coin-line',
      crystal: 'ri-vip-diamond-line',
      deuterium: 'ri-drop-line',
      rare_ore: 'ri-treasure-map-line',
      exotic_matter: 'ri-magic-line',
      dark_energy: 'ri-flashlight-line'
    };
    return iconMap[materialId] || 'ri-box-3-line';
  };

  return {
    craftingQueue,
    materials,
    craftingSkills,
    loading,
    startCrafting,
    speedUpCrafting,
    claimCraftedItem,
    cancelCrafting,
    addMaterial,
    getCraftableItems,
    dismantleItem,
    craftingItems,
    craftingMaterials
  };
};
