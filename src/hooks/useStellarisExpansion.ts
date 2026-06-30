import { useState, useCallback, useEffect, useRef } from 'react';

export type StarbaseLevel = 'outpost' | 'starport' | 'starhold' | 'star_fortress' | 'citadel';

export interface Starbase {
  id: string;
  systemId: string;
  systemName: string;
  level: StarbaseLevel;
  hp: number;
  maxHp: number;
  shield: number;
  maxShield: number;
  defensePlatforms: number;
  squadrons: number;
  modules: string[];
  constructionTime: number;
  constructionProgress: number;
  isConstructing: boolean;
  upkeep: number;
}

export interface ClaimedSystem {
  systemId: string;
  systemName: string;
  starbase: Starbase | null;
  influenceCost: number;
  claimedAt: number;
  isBorderSystem: boolean;
  contested: boolean;
}

export interface TerritoryBorder {
  id: string;
  empireId: string;
  empireName: string;
  empireColor: string;
  systems: string[];
  borderStrength: number;
  color: string;
}

const STARBASE_UPGRADE_COSTS: Record<StarbaseLevel, { influence: number; alloys: number; time: number }> = {
  outpost: { influence: 75, alloys: 0, time: 0 },
  starport: { influence: 100, alloys: 200, time: 30000 },
  starhold: { influence: 150, alloys: 500, time: 60000 },
  star_fortress: { influence: 250, alloys: 1200, time: 120000 },
  citadel: { influence: 500, alloys: 3000, time: 240000 },
};

const STARBASE_STATS: Record<StarbaseLevel, { hp: number; shield: number; defensePlatforms: number; squadrons: number; upkeep: number }> = {
  outpost: { hp: 500, shield: 200, defensePlatforms: 0, squadrons: 0, upkeep: 1 },
  starport: { hp: 1500, shield: 500, defensePlatforms: 2, squadrons: 3, upkeep: 3 },
  starhold: { hp: 3000, shield: 1200, defensePlatforms: 5, squadrons: 8, upkeep: 6 },
  star_fortress: { hp: 6000, shield: 2500, defensePlatforms: 10, squadrons: 16, upkeep: 12 },
  citadel: { hp: 12000, shield: 5000, defensePlatforms: 20, squadrons: 30, upkeep: 25 },
};

const LEVEL_ORDER: StarbaseLevel[] = ['outpost', 'starport', 'starhold', 'star_fortress', 'citadel'];

export function getNextLevel(current: StarbaseLevel): StarbaseLevel | null {
  const idx = LEVEL_ORDER.indexOf(current);
  if (idx >= LEVEL_ORDER.length - 1) return null;
  return LEVEL_ORDER[idx + 1];
}

export function getStarbaseLevelIndex(level: StarbaseLevel): number {
  return LEVEL_ORDER.indexOf(level);
}

export function useStellarisExpansion() {
  const [influence, setInfluence] = useState(500);
  const [maxInfluence, setMaxInfluence] = useState(1000);
  const [influencePerTick, setInfluencePerTick] = useState(2);
  const [claimedSystems, setClaimedSystems] = useState<ClaimedSystem[]>([]);
  const [territoryBorders, setTerritoryBorders] = useState<TerritoryBorder[]>([]);
  const [constructionQueue, setConstructionQueue] = useState<Starbase[]>([]);
  const tickRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    tickRef.current = setInterval(() => {
      setInfluence(prev => Math.min(prev + influencePerTick, maxInfluence));
    }, 5000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [influencePerTick, maxInfluence]);

  useEffect(() => {
    if (constructionQueue.length === 0) return;
    const interval = setInterval(() => {
      setConstructionQueue(prev => {
        const updated = prev.map(s => ({
          ...s,
          constructionProgress: Math.min(s.constructionProgress + 1000, s.constructionTime),
        }));
        const completed = updated.filter(s => s.constructionProgress >= s.constructionTime);
        if (completed.length > 0) {
          setClaimedSystems(prevClaimed => prevClaimed.map(cs => {
            const match = completed.find(c => c.systemId === cs.systemId);
            if (!match) return cs;
            return { ...cs, starbase: { ...match, isConstructing: false, constructionProgress: match.constructionTime } };
          }));
          setTerritoryBorders(prev => prev.map(tb => ({
            ...tb,
            borderStrength: tb.borderStrength + completed.reduce((sum, c) => {
              const stats = STARBASE_STATS[c.level];
              return sum + stats.hp / 100;
            }, 0),
          })));
        }
        return updated.filter(s => s.constructionProgress < s.constructionTime);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [constructionQueue.length]);

  const claimSystem = useCallback((systemId: string, systemName: string, isBorder: boolean) => {
    const cost = isBorder ? 150 : 75;
    if (influence < cost) return false;
    if (claimedSystems.find(s => s.systemId === systemId)) return false;

    setInfluence(prev => prev - cost);
    const newClaim: ClaimedSystem = {
      systemId, systemName, starbase: null,
      influenceCost: cost, claimedAt: Date.now(),
      isBorderSystem: isBorder, contested: false,
    };
    setClaimedSystems(prev => [...prev, newClaim]);
    return true;
  }, [influence, claimedSystems]);

  const buildStarbase = useCallback((systemId: string, systemName: string, level: StarbaseLevel = 'outpost') => {
    const cost = STARBASE_UPGRADE_COSTS[level];
    if (influence < cost.influence) return false;
    if (cost.alloys > 0) return false;

    const existing = claimedSystems.find(s => s.systemId === systemId);
    if (existing?.starbase) return false;

    setInfluence(prev => prev - cost.influence);
    const stats = STARBASE_STATS[level];
    const newStarbase: Starbase = {
      id: `starbase-${systemId}-${Date.now()}`,
      systemId, systemName, level,
      hp: stats.hp, maxHp: stats.hp,
      shield: stats.shield, maxShield: stats.shield,
      defensePlatforms: stats.defensePlatforms,
      squadrons: stats.squadrons,
      modules: [],
      constructionTime: cost.time || 1,
      constructionProgress: 0,
      isConstructing: cost.time > 0,
      upkeep: stats.upkeep,
    };

    if (cost.time > 0) {
      setConstructionQueue(prev => [...prev, newStarbase]);
    }

    setClaimedSystems(prev => prev.map(cs => {
      if (cs.systemId !== systemId) return cs;
      return { ...cs, starbase: newStarbase };
    }));

    return true;
  }, [influence, claimedSystems]);

  const upgradeStarbase = useCallback((systemId: string) => {
    const claim = claimedSystems.find(s => s.systemId === systemId);
    if (!claim?.starbase) return false;
    const next = getNextLevel(claim.starbase.level);
    if (!next) return false;

    const cost = STARBASE_UPGRADE_COSTS[next];
    if (influence < cost.influence) return false;

    setInfluence(prev => prev - cost.influence);
    const stats = STARBASE_STATS[next];
    const upgraded: Starbase = {
      ...claim.starbase,
      level: next, hp: stats.hp, maxHp: stats.hp,
      shield: stats.shield, maxShield: stats.shield,
      defensePlatforms: stats.defensePlatforms,
      squadrons: stats.squadrons,
      constructionTime: cost.time || 1,
      constructionProgress: 0,
      isConstructing: cost.time > 0,
      upkeep: stats.upkeep,
    };

    if (cost.time > 0) {
      setConstructionQueue(prev => [...prev, upgraded]);
    }

    setClaimedSystems(prev => prev.map(cs => {
      if (cs.systemId !== systemId) return cs;
      return { ...cs, starbase: upgraded };
    }));

    return true;
  }, [influence, claimedSystems]);

  const abandonSystem = useCallback((systemId: string) => {
    setClaimedSystems(prev => prev.filter(s => s.systemId !== systemId));
    setInfluence(prev => Math.min(prev + 25, maxInfluence));
  }, [maxInfluence]);

  const setBorderContested = useCallback((systemId: string, contested: boolean) => {
    setClaimedSystems(prev => prev.map(s => {
      if (s.systemId !== systemId) return s;
      return { ...s, contested };
    }));
  }, []);

  const addTerritoryBorder = useCallback((border: TerritoryBorder) => {
    setTerritoryBorders(prev => {
      if (prev.find(b => b.id === border.id)) return prev;
      return [...prev, border];
    });
  }, []);

  return {
    influence, maxInfluence, influencePerTick,
    claimedSystems, territoryBorders, constructionQueue,
    claimSystem, buildStarbase, upgradeStarbase, abandonSystem,
    setBorderContested, addTerritoryBorder,
  };
}
