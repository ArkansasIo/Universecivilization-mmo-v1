import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type AnomalyCategory =
  | 'precursor' | 'spatial' | 'biological' | 'technological'
  | 'gravitational' | 'temporal' | 'psionic' | 'cosmic';

export type AnomalyDifficulty = 'trivial' | 'easy' | 'moderate' | 'hard' | 'extreme';

export type AnomalyOutcomeType =
  | 'resources_bonus' | 'tech_discovery' | 'ship_boost'
  | 'pop_growth' | 'negative_event' | 'permanent_buff'
  | 'artifact' | 'fleet_spawn' | 'territory_claim';

export interface AnomalyOutcome {
  type: AnomalyOutcomeType;
  label: string;
  description: string;
  effect: Record<string, number>;
  successChance: number;
}

export interface AnomalyBranch {
  id: string;
  label: string;
  description: string;
  requiredSkill?: string;
  successChance: number;
  outcomes: AnomalyOutcome[];
}

export interface StellarisAnomaly {
  id: string;
  name: string;
  description: string;
  category: AnomalyCategory;
  difficulty: AnomalyDifficulty;
  position: { x: number; y: number; z: number };
  systemId: string;
  systemName: string;
  starType: string;
  branches: AnomalyBranch[];
  investigationTime: number;
  discovered_at: string;
  discovered_by: string;
  status: 'undiscovered' | 'discovered' | 'investigating' | 'completed' | 'failed';
  selectedBranchId: string | null;
  outcome: AnomalyOutcome | null;
  resultLog: string[];
}

const ANOMALY_NAMES = [
  'Ancient Signal', 'Gravitational Distortion', 'Warp Trail Echo',
  'Subspace Rift', 'Precursor Beacon', 'Dyson Swarm Remnant',
  'Alien Megalith', 'Quantium Flux', 'Neutron Star Echo',
  'Void Crystal Formation', 'Temporal Anomaly', 'Psionic Resonance',
  'Biological Contamination', 'Drifting Derelict',
  'Nanite Swarm Cluster', 'Hyperspace Eddy', 'Singularity Core Remnant',
];

const CATEGORIES: AnomalyCategory[] = [
  'precursor', 'spatial', 'biological', 'technological',
  'gravitational', 'temporal', 'psionic', 'cosmic',
];

const DIFFICULTIES: AnomalyDifficulty[] = ['trivial', 'easy', 'moderate', 'hard', 'extreme'];

function generateBranches(anomaly: Partial<StellarisAnomaly>): AnomalyBranch[] {
  const branches: AnomalyBranch[] = [
    {
      id: `${anomaly.id}-safe`,
      label: 'Cautious Investigation',
      description: 'Methodical analysis prioritizing safety over speed. Lower risk, moderate rewards.',
      successChance: 0.85,
      outcomes: [
        { type: 'resources_bonus', label: 'Resource Cache', description: 'Found resource deposits', effect: { minerals: 500, energy: 300 }, successChance: 0.6 },
        { type: 'tech_discovery', label: 'Tech Insight', description: 'Partial technology breakthrough', effect: { research: 200 }, successChance: 0.3 },
        { type: 'negative_event', label: 'Minor Hazard', description: 'Ship damage from unexpected energy surge', effect: { shipDamage: 15 }, successChance: 0.1 },
      ],
    },
    {
      id: `${anomaly.id}-aggressive`,
      label: 'Aggressive Probe',
      description: 'Direct approach with maximum data gathering. High risk, high reward.',
      successChance: 0.55,
      outcomes: [
        { type: 'permanent_buff', label: 'Permanent Discovery', description: 'Unlocked a permanent bonus for your empire', effect: { energyOutputBoost: 5 }, successChance: 0.25 },
        { type: 'artifact', label: 'Ancient Artifact', description: 'Retrieved a powerful relic', effect: { artifactPower: 100 }, successChance: 0.25 },
        { type: 'fleet_spawn', label: 'Hostile Response', description: 'Activated defense drones', effect: { enemyShips: 5 }, successChance: 0.3 },
        { type: 'negative_event', label: 'Catastrophic Failure', description: 'Anomaly collapses, losing ship', effect: { shipLoss: 1 }, successChance: 0.2 },
      ],
    },
    {
      id: `${anomaly.id}-scientific`,
      label: 'Deep Scan Analysis',
      description: 'Extended scan using all scientific instruments. Takes longer but yields data-rich results.',
      successChance: 0.7,
      outcomes: [
        { type: 'tech_discovery', label: 'Major Breakthrough', description: 'Full technology unlock progress', effect: { research: 800 }, successChance: 0.35 },
        { type: 'territory_claim', label: 'Territory Advantage', description: 'Gain permanent influence in this sector', effect: { influence: 200 }, successChance: 0.3 },
        { type: 'pop_growth', label: 'Population Insight', description: 'Habitability data improves colony growth', effect: { popGrowth: 15 }, successChance: 0.2 },
        { type: 'negative_event', label: 'Sensor Backlash', description: 'Psionic feedback damages sensors', effect: { sensorDamage: 30 }, successChance: 0.15 },
      ],
    },
  ];
  return branches;
}

export function generateAnomaly(
  id: string,
  systemId: string,
  systemName: string,
  starType: string,
  position3d: { x: number; y: number; z: number },
): StellarisAnomaly {
  const name = ANOMALY_NAMES[Math.floor(Math.random() * ANOMALY_NAMES.length)];
  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const difficulty = DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)];

  const anomaly: Partial<StellarisAnomaly> = {
    id, name, category, difficulty, systemId, systemName, starType,
    status: 'undiscovered' as const,
  };

  return {
    id, name,
    description: `A mysterious ${category} anomaly detected near ${systemName}. Requires investigation to determine its nature and potential value.`,
    category, difficulty,
    position: position3d,
    systemId, systemName, starType,
    branches: generateBranches(anomaly),
    investigationTime: (difficulty === 'trivial' ? 10 : difficulty === 'easy' ? 20 : difficulty === 'moderate' ? 40 : difficulty === 'hard' ? 60 : 120) * 1000,
    discovered_at: new Date().toISOString(),
    discovered_by: 'player',
    status: 'undiscovered',
    selectedBranchId: null,
    outcome: null,
    resultLog: [],
  };
}

export function useStellarisAnomalies() {
  const [anomalies, setAnomalies] = useState<StellarisAnomaly[]>([]);
  const [investigating, setInvestigating] = useState<string | null>(null);
  const [investigationProgress, setInvestigationProgress] = useState(0);

  useEffect(() => {
    if (!investigating) {
      setInvestigationProgress(0);
      return;
    }

    const anomaly = anomalies.find(a => a.id === investigating);
    if (!anomaly || anomaly.status !== 'investigating') return;

    const startTime = Date.now();
    const duration = anomaly.investigationTime;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setInvestigationProgress(progress);

      if (progress >= 1) {
        clearInterval(interval);
        setInvestigating(null);

        setAnomalies(prev => prev.map(a => {
          if (a.id !== investigating) return a;
          const branch = a.branches.find(b => b.id === a.selectedBranchId);
          if (!branch) return { ...a, status: 'failed' as const };
          const rolled = Math.random();
          let cumulative = 0;
          const selectedOutcome = branch.outcomes.find(o => {
            cumulative += o.successChance;
            return rolled < cumulative;
          }) || branch.outcomes[0];
          const success = Math.random() < branch.successChance;
          return {
            ...a,
            status: success ? 'completed' as const : 'failed' as const,
            outcome: selectedOutcome,
            resultLog: [
              ...a.resultLog,
              success
                ? `Investigation complete. Outcome: ${selectedOutcome.description}`
                : `Investigation failed. The anomaly was too complex.`,
            ],
          };
        }));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [investigating, anomalies]);

  const discoverAnomaly = useCallback((seed: Partial<StellarisAnomaly>) => {
    const newAnomaly = generateAnomaly(
      seed.id || `anomaly-${Date.now()}`,
      seed.systemId || 'unknown',
      seed.systemName || 'Unknown System',
      seed.starType || 'G',
      seed.position || { x: 0, y: 0, z: 0 },
    );
    setAnomalies(prev => {
      if (prev.find(a => a.id === newAnomaly.id)) return prev;
      return [...prev, { ...newAnomaly, status: 'discovered' as const }];
    });
    return newAnomaly;
  }, []);

  const startInvestigation = useCallback((anomalyId: string, branchId: string) => {
    setAnomalies(prev => prev.map(a => {
      if (a.id !== anomalyId) return a;
      return { ...a, status: 'investigating' as const, selectedBranchId: branchId };
    }));
    setInvestigating(anomalyId);
    setInvestigationProgress(0);
  }, []);

  const getAnomalyColor = useCallback((category: AnomalyCategory) => {
    const colors: Record<AnomalyCategory, string> = {
      precursor: '#a78bfa', spatial: '#60a5fa', biological: '#34d399',
      technological: '#fbbf24', gravitational: '#f472b6', temporal: '#22d3ee',
      psionic: '#c084fc', cosmic: '#fb923c',
    };
    return colors[category];
  }, []);

  const getDifficultyColor = useCallback((diff: AnomalyDifficulty) => {
    const colors: Record<AnomalyDifficulty, string> = {
      trivial: '#4ade80', easy: '#22d3ee', moderate: '#fbbf24',
      hard: '#fb923c', extreme: '#f87171',
    };
    return colors[diff];
  }, []);

  return {
    anomalies,
    investigating,
    investigationProgress,
    discoverAnomaly,
    startInvestigation,
    getAnomalyColor,
    getDifficultyColor,
  };
}
