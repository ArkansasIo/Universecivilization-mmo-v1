import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { allBlueprints } from '@/data/blueprints';
import type { Blueprint } from '@/data/blueprints/types';

export type BlueprintJobType = 'manufacturing' | 'research_me' | 'research_te' | 'copying' | 'invention';
export type BlueprintJobStatus = 'in_progress' | 'completed' | 'failed' | 'cancelled';

export interface BlueprintJob {
  id: string;
  player_id: string;
  blueprint_id: string;
  blueprint_name: string;
  job_type: BlueprintJobType;
  quantity: number;
  runs: number;
  research_level: number;
  progress: number;
  started_at: string;
  completion_time: string;
  status: BlueprintJobStatus;
  target_material_efficiency: number | null;
  target_time_efficiency: number | null;
  invention_chance: number | null;
  copy_runs: number | null;
  materials_cost: { name: string; quantity: number }[];
  output_item: any;
}

export interface BlueprintResearchState {
  blueprintId: string;
  materialEfficiency: number;
  timeEfficiency: number;
}

// EVE-style job duration formulas
function getManufacturingTime(bp: Blueprint, quantity: number): number {
  const teMultiplier = 1 - (bp.timeEfficiency / 100) * 0.01;
  return Math.floor(bp.productionTime * quantity * teMultiplier);
}

function getResearchTime(bp: Blueprint, type: 'ME' | 'TE', currentLevel: number): number {
  const baseTime = type === 'ME' ? 7200 : 5400;
  const levelMultiplier = Math.pow(2, currentLevel);
  return Math.floor(baseTime * levelMultiplier * (bp.tier / 10 + 0.5));
}

function getCopyTime(bp: Blueprint, runs: number): number {
  const basePerRun = bp.productionTime * 0.8;
  return Math.floor(basePerRun * runs);
}

function getInventionTime(bp: Blueprint): number {
  return Math.floor(bp.productionTime * 1.5);
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function getBlueprintById(id: string): Blueprint | undefined {
  return allBlueprints.find(bp => bp.id === id);
}

export function useBlueprintSystem(playerId: string) {
  const [jobs, setJobs] = useState<BlueprintJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedJobs, setCompletedJobs] = useState<BlueprintJob[]>([]);
  const [inventionResults, setInventionResults] = useState<{ jobId: string; success: boolean; outputName?: string }[]>([]);

  // Load jobs from DB
  const loadJobs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('blueprint_jobs')
        .select('*')
        .eq('player_id', playerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const all: BlueprintJob[] = (data || []).map((j: any) => ({
        ...j,
        materials_cost: j.materials_cost || [],
        output_item: j.output_item || null,
      }));

      setJobs(all.filter(j => j.status === 'in_progress'));
      setCompletedJobs(all.filter(j => j.status === 'completed'));
    } catch (err) {
      console.error('Error loading blueprint jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    if (playerId) {
      loadJobs();
      const interval = setInterval(() => checkJobProgress(), 5000);
      return () => clearInterval(interval);
    }
  }, [playerId, loadJobs, checkJobProgress]);

  // Auto-check job progress
  const checkJobProgress = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('blueprint_jobs')
        .select('*')
        .eq('player_id', playerId)
        .eq('status', 'in_progress');

      if (error || !data) return;

      const now = new Date();
      const updated: any[] = [];

      for (const job of data) {
        const completionTime = new Date(job.completion_time);
        const startTime = new Date(job.started_at);
        const totalMs = completionTime.getTime() - startTime.getTime();
        const elapsedMs = now.getTime() - startTime.getTime();
        const progress = totalMs > 0 ? Math.min(100, Math.floor((elapsedMs / totalMs) * 100)) : 100;
        const isComplete = now >= completionTime;

        if (isComplete) {
          updated.push({ id: job.id, progress: 100, status: 'completed' });
        } else if (progress !== Math.floor(job.progress)) {
          updated.push({ id: job.id, progress });
        }
      }

      if (updated.length > 0) {
        for (const u of updated) {
          await supabase
            .from('blueprint_jobs')
            .update(u)
            .eq('id', u.id);
        }
        await loadJobs();
      }
    } catch (err) {
      console.error('Error checking job progress:', err);
    }
  }, [playerId, loadJobs]);

  // Start manufacturing
  const startManufacturing = useCallback(async (blueprintId: string, quantity: number = 1): Promise<{ success: boolean; error?: string }> => {
    const bp = getBlueprintById(blueprintId);
    if (!bp) return { success: false, error: 'Blueprint not found' };

    if (bp.runs !== 'Unlimited' && bp.runs < quantity) {
      return { success: false, error: 'Not enough runs on blueprint' };
    }

    const duration = getManufacturingTime(bp, quantity);
    const startTime = new Date();
    const completionTime = new Date(startTime.getTime() + duration * 1000);

    const { error } = await supabase
      .from('blueprint_jobs')
      .insert({
        player_id: playerId,
        blueprint_id: bp.id,
        blueprint_name: bp.name,
        job_type: 'manufacturing',
        quantity,
        runs: 1,
        progress: 0,
        started_at: startTime.toISOString(),
        completion_time: completionTime.toISOString(),
        status: 'in_progress',
        materials_cost: bp.materials.map(m => ({ name: m.name, quantity: m.quantity * quantity })),
        output_item: { type: bp.category, id: bp.id, name: bp.name, quantity: bp.outputQuantity * quantity },
      });

    if (error) return { success: false, error: error.message };

    await loadJobs();
    return { success: true };
  }, [playerId, loadJobs]);

  // Start research
  const startResearch = useCallback(async (blueprintId: string, researchType: 'ME' | 'TE'): Promise<{ success: boolean; error?: string }> => {
    const bp = getBlueprintById(blueprintId);
    if (!bp) return { success: false, error: 'Blueprint not found' };
    if (bp.type !== 'BPO') return { success: false, error: 'Only BPOs can be researched' };
    if (!bp.canResearch) return { success: false, error: 'This blueprint cannot be researched' };

    const currentLevel = researchType === 'ME' ? bp.materialEfficiency : bp.timeEfficiency;
    const maxLevel = researchType === 'ME' ? bp.maxME : bp.maxTE;

    // EVE-style: research reduces waste up to max
    if (researchType === 'ME' && currentLevel >= maxLevel) return { success: false, error: 'Max ME reached' };
    if (researchType === 'TE' && currentLevel >= maxLevel) return { success: false, error: 'Max TE reached' };

    const duration = getResearchTime(bp, researchType, currentLevel / 2);
    const startTime = new Date();
    const completionTime = new Date(startTime.getTime() + duration * 1000);

    const { error } = await supabase
      .from('blueprint_jobs')
      .insert({
        player_id: playerId,
        blueprint_id: bp.id,
        blueprint_name: bp.name,
        job_type: researchType === 'ME' ? 'research_me' : 'research_te',
        quantity: 1,
        runs: 1,
        research_level: currentLevel,
        progress: 0,
        started_at: startTime.toISOString(),
        completion_time: completionTime.toISOString(),
        status: 'in_progress',
        target_material_efficiency: researchType === 'ME' ? Math.min(currentLevel + 1, maxLevel) : null,
        target_time_efficiency: researchType === 'TE' ? Math.min(currentLevel + 2, maxLevel) : null,
      });

    if (error) return { success: false, error: error.message };

    await loadJobs();
    return { success: true };
  }, [playerId, loadJobs]);

  // Start copying
  const startCopying = useCallback(async (blueprintId: string, runs: number = 10): Promise<{ success: boolean; error?: string }> => {
    const bp = getBlueprintById(blueprintId);
    if (!bp) return { success: false, error: 'Blueprint not found' };
    if (bp.type !== 'BPO') return { success: false, error: 'Only BPOs can be copied' };
    if (!bp.canCopy) return { success: false, error: 'This blueprint cannot be copied' };

    const duration = getCopyTime(bp, runs);
    const startTime = new Date();
    const completionTime = new Date(startTime.getTime() + duration * 1000);

    const { error } = await supabase
      .from('blueprint_jobs')
      .insert({
        player_id: playerId,
        blueprint_id: bp.id,
        blueprint_name: bp.name,
        job_type: 'copying',
        quantity: 1,
        runs: 1,
        progress: 0,
        started_at: startTime.toISOString(),
        completion_time: completionTime.toISOString(),
        status: 'in_progress',
        copy_runs: runs,
        output_item: { type: 'BPC', name: `${bp.name} (Copy)`, runs },
      });

    if (error) return { success: false, error: error.message };

    await loadJobs();
    return { success: true };
  }, [playerId, loadJobs]);

  // Start invention
  const startInvention = useCallback(async (blueprintId: string): Promise<{ success: boolean; error?: string }> => {
    const bp = getBlueprintById(blueprintId);
    if (!bp) return { success: false, error: 'Blueprint not found' };
    if (!bp.canInvent) return { success: false, error: 'This blueprint cannot be invented' };

    const duration = getInventionTime(bp);
    const startTime = new Date();
    const completionTime = new Date(startTime.getTime() + duration * 1000);

    const { error } = await supabase
      .from('blueprint_jobs')
      .insert({
        player_id: playerId,
        blueprint_id: bp.id,
        blueprint_name: bp.name,
        job_type: 'invention',
        quantity: 1,
        runs: 1,
        progress: 0,
        started_at: startTime.toISOString(),
        completion_time: completionTime.toISOString(),
        status: 'in_progress',
        invention_chance: bp.inventionChance || 28,
      });

    if (error) return { success: false, error: error.message };

    await loadJobs();
    return { success: true };
  }, [playerId, loadJobs]);

  // Claim completed job
  const claimJob = useCallback(async (jobId: string): Promise<{ success: boolean; data?: any }> => {
    try {
      const job = [...jobs, ...completedJobs].find(j => j.id === jobId);
      if (!job) return { success: false };

      if (job.status !== 'completed') {
        return { success: false };
      }

      let result: any = null;

      if (job.job_type === 'invention') {
        // Roll for invention success
        const roll = Math.random() * 100;
        const success = roll <= (job.invention_chance || 28);
        result = {
          type: 'invention',
          success,
          blueprintName: job.blueprint_name,
          outputName: success ? `${job.blueprint_name} Tech II BPC` : null,
        };
        setInventionResults(prev => [...prev, { jobId, success, outputName: result.outputName }]);
      } else if (job.job_type === 'copying') {
        result = {
          type: 'copying',
          blueprintName: job.blueprint_name,
          runs: job.copy_runs,
          outputName: `${job.blueprint_name} (Copy)`,
        };
      } else if (job.job_type === 'research_me' || job.job_type === 'research_te') {
        result = {
          type: 'research',
          researchType: job.job_type === 'research_me' ? 'ME' : 'TE',
          blueprintName: job.blueprint_name,
          newLevel: job.job_type === 'research_me' ? job.target_material_efficiency : job.target_time_efficiency,
        };
      } else {
        result = {
          type: 'manufacturing',
          blueprintName: job.blueprint_name,
          quantity: job.quantity,
          output: job.output_item,
        };
      }

      // Mark as claimed by deleting
      await supabase.from('blueprint_jobs').delete().eq('id', jobId);
      await loadJobs();

      return { success: true, data: result };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, [jobs, completedJobs, loadJobs]);

  // Cancel job
  const cancelJob = useCallback(async (jobId: string): Promise<{ success: boolean }> => {
    try {
      await supabase
        .from('blueprint_jobs')
        .update({ status: 'cancelled' })
        .eq('id', jobId);

      await loadJobs();
      return { success: true };
    } catch {
      return { success: false };
    }
  }, [loadJobs]);

  // Speed up job with dark matter
  const speedUpJob = useCallback(async (jobId: string, darkMatterCost: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: resources } = await supabase
        .from('player_resources')
        .select('dark_matter')
        .eq('player_id', playerId)
        .single();

      if (!resources || resources.dark_matter < darkMatterCost) {
        return { success: false, error: 'Insufficient dark matter' };
      }

      await supabase
        .from('player_resources')
        .update({ dark_matter: resources.dark_matter - darkMatterCost })
        .eq('player_id', playerId);

      await supabase
        .from('blueprint_jobs')
        .update({ status: 'completed', progress: 100, completion_time: new Date().toISOString() })
        .eq('id', jobId);

      await loadJobs();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, [playerId, loadJobs]);

  // Get active manufacturing slots
  const getActiveSlots = useCallback(() => {
    return jobs.filter(j => j.status === 'in_progress').length;
  }, [jobs]);

  const maxSlots = 5;

  return {
    jobs,
    completedJobs,
    inventionResults,
    loading,
    maxSlots,
    startManufacturing,
    startResearch,
    startCopying,
    startInvention,
    claimJob,
    cancelJob,
    speedUpJob,
    getActiveSlots,
    getManufacturingTime,
    getResearchTime,
    getCopyTime,
    getInventionTime,
    formatTime,
    reload: loadJobs,
  };
}