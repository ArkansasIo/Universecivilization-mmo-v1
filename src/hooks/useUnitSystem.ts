import { useState, useCallback, useEffect, useRef } from 'react';
import type { UnitDefinition, TrainingQueueEntry, EmpirePersonnel, PersonnelPool, UnitCategory } from '../data/units/types';
import { ALL_UNITS, personnelPools as initialPools, trainingTracks } from '../data/units';

// ═══════════════════════════════════════════════════════════
// UNIT SYSTEM GAME LOGIC HOOK
// ═══════════════════════════════════════════════════════════

interface UnitSystemState {
  units: UnitDefinition[];
  personnelPools: PersonnelPool[];
  trainingQueue: TrainingQueueEntry[];
  empirePersonnel: EmpirePersonnel;
  notifications: string[];
}

interface TrainUnitsParams {
  unitId: string;
  count: number;
}

interface DeployUnitsParams {
  unitId: string;
  count: number;
  destination: string;
}

// ─── Stat Level-Up Formulas ────────────────────────────────
function calculateStatAtLevel(base: number, level: number, tier: number): number {
  const levelBonus = 1 + (level - 1) * 0.08;
  const tierBonus = 1 + (tier - 1) * 0.12;
  return Math.floor(base * levelBonus * tierBonus);
}

// ─── XP required per level ────────────────────────────────
function xpRequiredForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.45, level - 1));
}

// ─── Training time calculator ─────────────────────────────
function parseTrainingTime(timeStr: string): number {
  const lower = timeStr.toLowerCase();
  if (lower.includes('second')) return parseInt(lower) * 1000;
  if (lower.includes('minute')) return parseInt(lower) * 60 * 1000;
  if (lower.includes('hour')) return parseFloat(lower) * 60 * 60 * 1000;
  if (lower.includes('day')) return parseFloat(lower) * 24 * 60 * 60 * 1000;
  if (lower.includes('week')) return parseFloat(lower) * 7 * 24 * 60 * 60 * 1000;
  if (lower.includes('month')) return parseFloat(lower) * 30 * 24 * 60 * 60 * 1000;
  if (lower.includes('year')) return parseFloat(lower) * 365 * 24 * 60 * 60 * 1000;
  return 60 * 1000;
}

// ─── Power Rating ─────────────────────────────────────────
export function calculateUnitPower(unit: UnitDefinition): number {
  const combatScore = unit.stats.combat * 2 + unit.stats.defense * 1.5 + unit.stats.speed;
  const workScore = unit.stats.efficiency + unit.stats.productivity + unit.stats.intelligence;
  const govScore = unit.stats.loyalty * 2 + unit.stats.discipline;
  const tierMult = 1 + (unit.tier - 1) * 0.2;
  const rarityMults: Record<string, number> = {
    Common: 1, Uncommon: 1.5, Rare: 2.5, Epic: 4, Legendary: 7, Mythic: 12, Transcendent: 20
  };
  const rarityMult = rarityMults[unit.rarity] || 1;
  return Math.floor((combatScore + workScore + govScore) * tierMult * rarityMult * (unit.level / 10));
}

// ─── Empire Summary ───────────────────────────────────────
function computeEmpirePersonnel(units: UnitDefinition[], pools: PersonnelPool[]): EmpirePersonnel {
  const total = units.reduce((s, u) => s + u.available, 0)
    + pools.reduce((s, p) => s + p.currentCount, 0);

  const civilian = units.filter(u => u.category === 'civilian').reduce((s, u) => s + u.available, 0);
  const military = units.filter(u => u.category === 'military').reduce((s, u) => s + u.available, 0);
  const government = units.filter(u => u.category === 'government').reduce((s, u) => s + u.available, 0);
  const untrained = pools.filter(p => p.status === 'untrained').reduce((s, p) => s + p.currentCount, 0);
  const inTraining = pools.filter(p => p.status === 'in-training').reduce((s, p) => s + p.currentCount, 0);
  const deployed = units.filter(u => u.status === 'deployed').reduce((s, u) => s + u.available, 0);
  const injured = units.filter(u => u.status === 'injured').reduce((s, u) => s + u.available, 0);

  const totalCombatPower = units.reduce((s, u) => s + (u.stats.combat * u.available), 0);
  const totalProductivity = units.reduce((s, u) => s + (u.stats.productivity * u.available), 0);
  const dailyFoodUpkeep = units.reduce((s, u) => s + (u.upkeep.food * u.available), 0);
  const dailyCreditUpkeep = units.reduce((s, u) => s + (u.upkeep.credits * u.available), 0);
  const moraleAverage = units.length > 0
    ? Math.floor(units.reduce((s, u) => s + u.stats.morale, 0) / units.length)
    : 0;

  return {
    total, civilian, military, government, untrained, inTraining,
    deployed, injured, totalCombatPower, totalProductivity,
    dailyFoodUpkeep, dailyCreditUpkeep, moraleAverage
  };
}

// ─── Training Speed Multipliers ───────────────────────────
function getTrainingSpeedMultiplier(category: UnitCategory): number {
  // In a real implementation this would read from research/buildings
  return 1.0;
}

// ─── Main Hook ────────────────────────────────────────────
export function useUnitSystem() {
  const [units, setUnits] = useState<UnitDefinition[]>(() => ALL_UNITS);
  const [pools, setPools] = useState<PersonnelPool[]>(() => initialPools);
  const [trainingQueue, setTrainingQueue] = useState<TrainingQueueEntry[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | UnitCategory>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Computed Empire Stats ──────────────────────────────
  const empirePersonnel = computeEmpirePersonnel(units, pools);

  // ─── Filtered Units ─────────────────────────────────────
  const filteredUnits = units.filter(unit => {
    const catMatch = selectedCategory === 'all' || unit.category === selectedCategory;
    const secMatch = selectedSector === 'all' || unit.sector === selectedSector;
    const qMatch = searchQuery === '' ||
      unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.jobType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.sector.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && secMatch && qMatch;
  });

  // ─── Train Units ────────────────────────────────────────
  const trainUnits = useCallback(({ unitId, count }: TrainUnitsParams) => {
    const unit = units.find(u => u.id === unitId);
    if (!unit || count <= 0) return { success: false, message: 'Unit not found' };

    // Find appropriate pool
    const pool = pools.find(p => p.category === unit.category && p.status === 'untrained');
    if (!pool || pool.availableForTraining < count) {
      return { success: false, message: `Not enough untrained ${unit.category} personnel (need ${count}, have ${pool?.availableForTraining ?? 0})` };
    }

    const trainingMs = parseTrainingTime(unit.requirements.time) * getTrainingSpeedMultiplier(unit.category);
    const now = new Date();
    const completesAt = new Date(now.getTime() + trainingMs);

    // Deduct from pool
    setPools(prev => prev.map(p =>
      p.id === pool.id
        ? { ...p, availableForTraining: p.availableForTraining - count, currentCount: p.currentCount - count }
        : p
    ));

    // Add to training queue
    const entry: TrainingQueueEntry = {
      unitId,
      unitName: unit.name,
      count,
      startedAt: now,
      completesAt,
      progress: 0,
      phase: 1
    };
    setTrainingQueue(prev => [...prev, entry]);

    addNotification(`Training ${count} ${unit.name} — est. ${unit.requirements.time}`);
    return { success: true, message: `Started training ${count} ${unit.name}` };
  }, [units, pools]);

  // ─── Cancel Training ────────────────────────────────────
  const cancelTraining = useCallback((queueIndex: number) => {
    setTrainingQueue(prev => {
      const entry = prev[queueIndex];
      if (!entry) return prev;
      const unit = units.find(u => u.id === entry.unitId);
      if (unit) {
        // Return personnel to untrained pool
        setPools(pp => pp.map(p =>
          p.category === unit.category && p.status === 'untrained'
            ? { ...p, availableForTraining: p.availableForTraining + entry.count, currentCount: p.currentCount + entry.count }
            : p
        ));
      }
      return prev.filter((_, i) => i !== queueIndex);
    });
  }, [units]);

  // ─── Deploy Unit ────────────────────────────────────────
  const deployUnit = useCallback(({ unitId, count, destination }: DeployUnitsParams) => {
    setUnits(prev => prev.map(u => {
      if (u.id !== unitId) return u;
      if (u.available < count) return u;
      return { ...u, available: u.available - count, status: 'deployed' };
    }));
    addNotification(`Deployed ${count} units to ${destination}`);
  }, []);

  // ─── Recall Unit ────────────────────────────────────────
  const recallUnit = useCallback((unitId: string, count: number) => {
    setUnits(prev => prev.map(u => {
      if (u.id !== unitId) return u;
      return { ...u, available: u.available + count, status: 'trained' };
    }));
    addNotification(`${count} units recalled`);
  }, []);

  // ─── Level Up Unit ──────────────────────────────────────
  const levelUpUnit = useCallback((unitId: string) => {
    setUnits(prev => prev.map(u => {
      if (u.id !== unitId) return u;
      if (u.experience < u.maxExperience) return u;
      const newLevel = Math.min(u.level + 1, u.maxLevel);
      const newMaxExp = xpRequiredForLevel(newLevel);
      return {
        ...u,
        level: newLevel,
        experience: 0,
        maxExperience: newMaxExp,
        stats: {
          ...u.stats,
          combat: calculateStatAtLevel(u.stats.combat, newLevel, u.tier),
          defense: calculateStatAtLevel(u.stats.defense, newLevel, u.tier),
          efficiency: calculateStatAtLevel(u.stats.efficiency, newLevel, u.tier),
          productivity: calculateStatAtLevel(u.stats.productivity, newLevel, u.tier),
          intelligence: calculateStatAtLevel(u.stats.intelligence, newLevel, u.tier),
        }
      };
    }));
  }, []);

  // ─── Add XP to Unit ─────────────────────────────────────
  const addExperience = useCallback((unitId: string, xp: number) => {
    setUnits(prev => prev.map(u => {
      if (u.id !== unitId) return u;
      const newExp = Math.min(u.experience + xp, u.maxExperience);
      return { ...u, experience: newExp };
    }));
  }, []);

  // ─── Heal Units ─────────────────────────────────────────
  const healUnits = useCallback((unitId: string) => {
    setUnits(prev => prev.map(u =>
      u.id === unitId ? { ...u, status: 'resting', stats: { ...u.stats, health: u.stats.maxHealth } } : u
    ));
  }, []);

  // ─── Boost Morale ───────────────────────────────────────
  const boostMorale = useCallback((unitId: string, amount: number) => {
    setUnits(prev => prev.map(u => {
      if (u.id !== unitId) return u;
      const newMorale = Math.min(u.stats.morale + amount, u.stats.maxMorale);
      return { ...u, stats: { ...u.stats, morale: newMorale } };
    }));
  }, []);

  // ─── Training Queue Tick ─────────────────────────────────
  useEffect(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      const now = new Date();
      setTrainingQueue(prev => {
        const completed: TrainingQueueEntry[] = [];
        const remaining = prev.map(entry => {
          const total = entry.completesAt.getTime() - entry.startedAt.getTime();
          const elapsed = now.getTime() - entry.startedAt.getTime();
          const progress = Math.min((elapsed / total) * 100, 100);

          if (progress >= 100) {
            completed.push(entry);
            return null;
          }
          return { ...entry, progress };
        }).filter(Boolean) as TrainingQueueEntry[];

        // Deliver completed units
        if (completed.length > 0) {
          completed.forEach(entry => {
            setUnits(uu => uu.map(u =>
              u.id === entry.unitId
                ? { ...u, available: u.available + entry.count, status: 'trained' }
                : u
            ));
            addNotification(`Training complete: ${entry.count}× ${entry.unitName} ready!`);
          });
        }

        return remaining;
      });
    }, 2000);

    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, []);

  // ─── Population Growth Tick ──────────────────────────────
  useEffect(() => {
    const growthInterval = setInterval(() => {
      setPools(prev => prev.map(p =>
        p.status === 'untrained'
          ? {
              ...p,
              currentCount: Math.min(p.currentCount + p.growthRate, p.maxCount),
              availableForTraining: Math.min(p.availableForTraining + p.growthRate, p.maxCount)
            }
          : p
      ));
    }, 60000); // Every minute

    return () => clearInterval(growthInterval);
  }, []);

  // ─── Notifications ───────────────────────────────────────
  function addNotification(msg: string) {
    setNotifications(prev => [msg, ...prev.slice(0, 9)]);
  }

  const clearNotification = useCallback((idx: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== idx));
  }, []);

  // ─── Get all unique sectors ───────────────────────────────
  const allSectors = Array.from(new Set(ALL_UNITS.map(u => u.sector))).sort();

  // ─── Training track lookup ────────────────────────────────
  const getTrainingTrack = useCallback((unitId: string) => {
    const unit = units.find(u => u.id === unitId);
    if (!unit) return null;
    return trainingTracks.find(t =>
      t.category === unit.category &&
      t.sector === unit.sector
    ) || null;
  }, [units]);

  // ─── Stats helpers ────────────────────────────────────────
  const getUnitPower = useCallback((unitId: string): number => {
    const unit = units.find(u => u.id === unitId);
    return unit ? calculateUnitPower(unit) : 0;
  }, [units]);

  const getEmpireTotalPower = useCallback((): number => {
    return units.reduce((sum, u) => sum + calculateUnitPower(u) * u.available, 0);
  }, [units]);

  const getTrainingQueueProgress = useCallback((entry: TrainingQueueEntry): number => {
    const now = new Date().getTime();
    const start = entry.startedAt.getTime();
    const end = entry.completesAt.getTime();
    return Math.min(((now - start) / (end - start)) * 100, 100);
  }, []);

  const getTimeRemaining = useCallback((entry: TrainingQueueEntry): string => {
    const remaining = Math.max(0, entry.completesAt.getTime() - Date.now());
    const d = Math.floor(remaining / 86400000);
    const h = Math.floor((remaining % 86400000) / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }, []);

  return {
    // State
    units,
    filteredUnits,
    pools,
    trainingQueue,
    empirePersonnel,
    notifications,
    allSectors,
    // Filters
    selectedCategory,
    setSelectedCategory,
    selectedSector,
    setSelectedSector,
    searchQuery,
    setSearchQuery,
    // Actions
    trainUnits,
    cancelTraining,
    deployUnit,
    recallUnit,
    levelUpUnit,
    addExperience,
    healUnits,
    boostMorale,
    clearNotification,
    getTrainingTrack,
    getUnitPower,
    getEmpireTotalPower,
    getTrainingQueueProgress,
    getTimeRemaining,
    // Data
    trainingTracks
  };
}
