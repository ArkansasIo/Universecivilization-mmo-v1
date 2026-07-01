import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PlayerProgression {
  level: number;
  experience: number;
  experienceToNext: number;
  prestige: number;
  skillPoints: number;
  title: string;
  rank: string;
}

interface LevelReward {
  credits: number;
  darkMatter: number;
  skillPoints: number;
  unlocks: string[];
}

export function usePlayerProgression() {
  const { user } = useAuth();
  const [progression, setProgression] = useState<PlayerProgression>({
    level: 1,
    experience: 0,
    experienceToNext: 1000,
    prestige: 0,
    skillPoints: 0,
    title: 'Novice Explorer',
    rank: 'E'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProgression();
    }
  }, [user, loadProgression]);

  const loadProgression = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const expToNext = calculateExperienceToNext(data.level || 1);
        setProgression({
          level: data.level || 1,
          experience: data.experience || 0,
          experienceToNext: expToNext,
          prestige: data.prestige || 0,
          skillPoints: data.skill_points || 0,
          title: data.title || 'Novice Explorer',
          rank: data.rank || 'E'
        });
      }
    } catch (error) {
      console.error('Error loading progression:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const calculateExperienceToNext = (level: number): number => {
    return Math.floor(1000 * Math.pow(1.5, level - 1));
  };

  const addExperience = async (amount: number) => {
    if (!user) return;

    try {
      let newExp = progression.experience + amount;
      let newLevel = progression.level;
      let newSkillPoints = progression.skillPoints;
      let leveledUp = false;

      // Check for level ups
      while (newExp >= progression.experienceToNext) {
        newExp -= progression.experienceToNext;
        newLevel++;
        newSkillPoints += 3;
        leveledUp = true;

        // Grant level rewards
        await grantLevelRewards(newLevel);
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          level: newLevel,
          experience: newExp,
          skill_points: newSkillPoints,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      await loadProgression();

      return { leveledUp, newLevel };
    } catch (error) {
      console.error('Error adding experience:', error);
      return { leveledUp: false, newLevel: progression.level };
    }
  };

  const grantLevelRewards = async (level: number) => {
    if (!user) return;

    const rewards = calculateLevelRewards(level);

    try {
      // Add credits and dark matter
      const { data: resources } = await supabase
        .from('player_resources')
        .select('*')
        .eq('player_id', user.id)
        .maybeSingle();

      if (resources) {
        await supabase
          .from('player_resources')
          .update({
            dark_matter: (resources.dark_matter || 0) + rewards.darkMatter
          })
          .eq('player_id', user.id);
      }

      // Log rewards
      console.log(`Level ${level} rewards:`, rewards);
    } catch (error) {
      console.error('Error granting level rewards:', error);
    }
  };

  const calculateLevelRewards = (level: number): LevelReward => {
    const baseCredits = 1000;
    const baseDarkMatter = 10;

    return {
      credits: Math.floor(baseCredits * Math.pow(1.2, level)),
      darkMatter: Math.floor(baseDarkMatter * Math.pow(1.1, level)),
      skillPoints: 3,
      unlocks: getUnlocksForLevel(level)
    };
  };

  const getUnlocksForLevel = (level: number): string[] => {
    const unlocks: string[] = [];

    if (level === 5) unlocks.push('Advanced Research');
    if (level === 10) unlocks.push('Fleet Formations');
    if (level === 15) unlocks.push('Alliance Wars');
    if (level === 20) unlocks.push('Motherships');
    if (level === 25) unlocks.push('Megastructures');
    if (level === 30) unlocks.push('World Bosses');
    if (level === 40) unlocks.push('Dimensional Travel');
    if (level === 50) unlocks.push('Reality Manipulation');

    return unlocks;
  };

  const addPrestige = async (amount: number) => {
    if (!user) return;

    try {
      const newPrestige = progression.prestige + amount;

      const { error } = await supabase
        .from('profiles')
        .update({
          prestige: newPrestige,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      await loadProgression();
    } catch (error) {
      console.error('Error adding prestige:', error);
    }
  };

  const spendSkillPoints = async (amount: number) => {
    if (!user || progression.skillPoints < amount) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          skill_points: progression.skillPoints - amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      await loadProgression();
      return true;
    } catch (error) {
      console.error('Error spending skill points:', error);
      return false;
    }
  };

  return {
    progression,
    loading,
    addExperience,
    addPrestige,
    spendSkillPoints,
    reload: loadProgression
  };
}