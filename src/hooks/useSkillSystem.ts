import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Skill {
  id: string;
  name: string;
  category: 'Combat' | 'Economic' | 'Research' | 'Exploration' | 'Diplomatic';
  description: string;
  icon: string;
  maxLevel: number;
  currentLevel: number;
  costPerLevel: number;
  effects: {
    type: string;
    value: number;
    perLevel: number;
  }[];
}

interface PlayerSkills {
  [skillId: string]: number;
}

export function useSkillSystem() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [playerSkills, setPlayerSkills] = useState<PlayerSkills>({});
  const [loading, setLoading] = useState(true);

  const AVAILABLE_SKILLS: Skill[] = [
    {
      id: 'combat_mastery',
      name: 'Combat Mastery',
      category: 'Combat',
      description: 'Increases fleet attack power',
      icon: 'ri-sword-line',
      maxLevel: 50,
      currentLevel: 0,
      costPerLevel: 1,
      effects: [
        { type: 'fleet_attack', value: 2, perLevel: 2 }
      ]
    },
    {
      id: 'defensive_tactics',
      name: 'Defensive Tactics',
      category: 'Combat',
      description: 'Increases fleet defense and shield strength',
      icon: 'ri-shield-line',
      maxLevel: 50,
      currentLevel: 0,
      costPerLevel: 1,
      effects: [
        { type: 'fleet_defense', value: 2, perLevel: 2 },
        { type: 'shield_strength', value: 1, perLevel: 1 }
      ]
    },
    {
      id: 'resource_efficiency',
      name: 'Resource Efficiency',
      category: 'Economic',
      description: 'Increases resource production',
      icon: 'ri-database-line',
      maxLevel: 50,
      currentLevel: 0,
      costPerLevel: 1,
      effects: [
        { type: 'metal_production', value: 3, perLevel: 3 },
        { type: 'crystal_production', value: 3, perLevel: 3 },
        { type: 'deuterium_production', value: 3, perLevel: 3 }
      ]
    },
    {
      id: 'trade_expertise',
      name: 'Trade Expertise',
      category: 'Economic',
      description: 'Reduces marketplace fees and increases trade profits',
      icon: 'ri-exchange-line',
      maxLevel: 30,
      currentLevel: 0,
      costPerLevel: 1,
      effects: [
        { type: 'trade_fee_reduction', value: 2, perLevel: 2 },
        { type: 'trade_profit', value: 3, perLevel: 3 }
      ]
    },
    {
      id: 'research_speed',
      name: 'Research Speed',
      category: 'Research',
      description: 'Reduces research time',
      icon: 'ri-flask-line',
      maxLevel: 50,
      currentLevel: 0,
      costPerLevel: 1,
      effects: [
        { type: 'research_time_reduction', value: 2, perLevel: 2 }
      ]
    },
    {
      id: 'construction_speed',
      name: 'Construction Speed',
      category: 'Economic',
      description: 'Reduces building and ship construction time',
      icon: 'ri-building-line',
      maxLevel: 50,
      currentLevel: 0,
      costPerLevel: 1,
      effects: [
        { type: 'build_time_reduction', value: 2, perLevel: 2 },
        { type: 'ship_build_time_reduction', value: 2, perLevel: 2 }
      ]
    },
    {
      id: 'exploration_mastery',
      name: 'Exploration Mastery',
      category: 'Exploration',
      description: 'Increases expedition rewards and discovery chances',
      icon: 'ri-compass-line',
      maxLevel: 40,
      currentLevel: 0,
      costPerLevel: 1,
      effects: [
        { type: 'expedition_rewards', value: 5, perLevel: 5 },
        { type: 'discovery_chance', value: 3, perLevel: 3 }
      ]
    },
    {
      id: 'fleet_capacity',
      name: 'Fleet Capacity',
      category: 'Combat',
      description: 'Increases maximum fleet size',
      icon: 'ri-rocket-line',
      maxLevel: 50,
      currentLevel: 0,
      costPerLevel: 2,
      effects: [
        { type: 'max_fleet_size', value: 5, perLevel: 5 }
      ]
    },
    {
      id: 'espionage_mastery',
      name: 'Espionage Mastery',
      category: 'Exploration',
      description: 'Improves spy mission success rate',
      icon: 'ri-user-search-line',
      maxLevel: 40,
      currentLevel: 0,
      costPerLevel: 1,
      effects: [
        { type: 'spy_success_rate', value: 3, perLevel: 3 },
        { type: 'counter_espionage', value: 2, perLevel: 2 }
      ]
    },
    {
      id: 'diplomatic_influence',
      name: 'Diplomatic Influence',
      category: 'Diplomatic',
      description: 'Improves alliance benefits and diplomatic relations',
      icon: 'ri-team-line',
      maxLevel: 30,
      currentLevel: 0,
      costPerLevel: 1,
      effects: [
        { type: 'alliance_bonus', value: 2, perLevel: 2 },
        { type: 'diplomatic_success', value: 3, perLevel: 3 }
      ]
    },
    {
      id: 'energy_mastery',
      name: 'Energy Mastery',
      category: 'Research',
      description: 'Increases energy production and efficiency',
      icon: 'ri-flashlight-line',
      maxLevel: 50,
      currentLevel: 0,
      costPerLevel: 1,
      effects: [
        { type: 'energy_production', value: 4, perLevel: 4 },
        { type: 'energy_efficiency', value: 2, perLevel: 2 }
      ]
    },
    {
      id: 'colonization_expert',
      name: 'Colonization Expert',
      category: 'Exploration',
      description: 'Reduces colonization costs and increases colony efficiency',
      icon: 'ri-planet-line',
      maxLevel: 30,
      currentLevel: 0,
      costPerLevel: 2,
      effects: [
        { type: 'colonization_cost_reduction', value: 5, perLevel: 5 },
        { type: 'colony_production', value: 3, perLevel: 3 }
      ]
    }
  ];

  useEffect(() => {
    if (user) {
      loadPlayerSkills();
    }
  }, [user]);

  const loadPlayerSkills = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('player_skills')
        .select('*')
        .eq('player_id', user.id);

      if (error && error.code !== 'PGRST116') throw error;

      const skillsMap: PlayerSkills = {};
      if (data) {
        data.forEach(skill => {
          skillsMap[skill.skill_id] = skill.level;
        });
      }

      setPlayerSkills(skillsMap);

      // Update skills with current levels
      const updatedSkills = AVAILABLE_SKILLS.map(skill => ({
        ...skill,
        currentLevel: skillsMap[skill.id] || 0
      }));

      setSkills(updatedSkills);
    } catch (error) {
      console.error('Error loading player skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const upgradeSkill = async (skillId: string, skillPointsAvailable: number) => {
    if (!user) return { success: false, message: 'Not authenticated' };

    const skill = skills.find(s => s.id === skillId);
    if (!skill) return { success: false, message: 'Skill not found' };

    const currentLevel = playerSkills[skillId] || 0;
    if (currentLevel >= skill.maxLevel) {
      return { success: false, message: 'Skill already at max level' };
    }

    if (skillPointsAvailable < skill.costPerLevel) {
      return { success: false, message: 'Not enough skill points' };
    }

    try {
      const newLevel = currentLevel + 1;

      // Check if skill exists
      const { data: existing } = await supabase
        .from('player_skills')
        .select('*')
        .eq('player_id', user.id)
        .eq('skill_id', skillId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('player_skills')
          .update({
            level: newLevel,
            updated_at: new Date().toISOString()
          })
          .eq('player_id', user.id)
          .eq('skill_id', skillId);
      } else {
        await supabase
          .from('player_skills')
          .insert({
            player_id: user.id,
            skill_id: skillId,
            level: newLevel
          });
      }

      await loadPlayerSkills();

      return {
        success: true,
        message: `${skill.name} upgraded to level ${newLevel}!`,
        pointsSpent: skill.costPerLevel
      };
    } catch (error) {
      console.error('Error upgrading skill:', error);
      return { success: false, message: 'Failed to upgrade skill' };
    }
  };

  const getSkillBonus = (skillId: string, effectType: string): number => {
    const currentLevel = playerSkills[skillId] || 0;
    const skill = AVAILABLE_SKILLS.find(s => s.id === skillId);
    
    if (!skill) return 0;

    const effect = skill.effects.find(e => e.type === effectType);
    if (!effect) return 0;

    return effect.value + (effect.perLevel * currentLevel);
  };

  const getTotalBonus = (effectType: string): number => {
    let total = 0;
    Object.keys(playerSkills).forEach(skillId => {
      total += getSkillBonus(skillId, effectType);
    });
    return total;
  };

  return {
    skills,
    playerSkills,
    loading,
    upgradeSkill,
    getSkillBonus,
    getTotalBonus,
    reload: loadPlayerSkills
  };
}
