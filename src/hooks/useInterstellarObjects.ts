import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface InterstellarObject {
  id: string;
  universeId: string;
  galaxyId: string;
  name: string;
  type: 'asteroid' | 'nebula' | 'black_hole' | 'wormhole' | 'pulsar' | 'quasar' | 'supernova' | 'comet' | 'space_station' | 'derelict_ship';
  coordinates: { x: number; y: number; z: number };
  size: 'tiny' | 'small' | 'medium' | 'large' | 'massive';
  dangerLevel: number; // 1-10
  resources: {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    darkMatter?: number;
    antimatter?: number;
    exoticMatter?: number;
  };
  discovered: boolean;
  scanned: boolean;
  harvestable: boolean;
  remainingResources: number; // percentage
  specialProperties?: string[];
  discoveredBy?: string;
  discoveredAt?: Date;
  lastHarvestedAt?: Date;
}

export interface CosmicPhenomenon {
  id: string;
  universeId: string;
  type: 'supernova_remnant' | 'gamma_ray_burst' | 'gravitational_wave' | 'dark_matter_cloud' | 'antimatter_storm' | 'temporal_anomaly';
  name: string;
  coordinates: { x: number; y: number; z: number };
  intensity: number; // 1-100
  radius: number; // affected area
  duration: number; // minutes remaining
  effects: {
    type: 'damage' | 'boost' | 'disruption' | 'mutation';
    value: number;
    description: string;
  }[];
  active: boolean;
  startedAt: Date;
  endsAt: Date;
}

export interface ExplorationMission {
  id: string;
  playerId: string;
  targetId: string;
  targetType: 'object' | 'phenomenon' | 'sector';
  missionType: 'scan' | 'harvest' | 'investigate' | 'salvage';
  fleetId: string;
  status: 'traveling' | 'exploring' | 'returning' | 'completed' | 'failed';
  progress: number; // 0-100
  startedAt: Date;
  estimatedCompletion: Date;
  rewards?: {
    resources?: any;
    experience?: number;
    discoveries?: string[];
  };
}

export interface SpaceAnomalies {
  id: string;
  universeId: string;
  type: 'time_dilation' | 'spatial_rift' | 'energy_vortex' | 'quantum_fluctuation' | 'dimensional_tear';
  name: string;
  coordinates: { x: number; y: number; z: number };
  stability: number; // 0-100
  researchValue: number;
  investigated: boolean;
  investigatedBy?: string;
  findings?: {
    technology?: string;
    blueprint?: string;
    artifact?: string;
    knowledge?: string;
  };
}

// Pure helper functions — moved outside component to avoid exhaustive-deps issues
function generateObjectName(type: string, index: number): string {
  const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'];
  const suffixes = ['Prime', 'Secundus', 'Tertius', 'Major', 'Minor', 'Nova', 'Vetus'];
  
  const typeNames: Record<string, string> = {
    asteroid: 'Asteroid',
    nebula: 'Nebula',
    black_hole: 'Black Hole',
    wormhole: 'Wormhole',
    pulsar: 'Pulsar',
    quasar: 'Quasar',
    supernova: 'Supernova',
    comet: 'Comet',
    space_station: 'Station',
    derelict_ship: 'Derelict'
  };

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return `${prefix} ${typeNames[type]} ${suffix}-${index + 1}`;
}

function generatePhenomenonName(type: string, index: number): string {
  const names: Record<string, string[]> = {
    supernova_remnant: ['Crab', 'Veil', 'Cassiopeia', 'Tycho', 'Kepler'],
    gamma_ray_burst: ['Swift', 'Fermi', 'HETE', 'BeppoSAX', 'INTEGRAL'],
    gravitational_wave: ['LIGO', 'Virgo', 'KAGRA', 'GEO', 'TAMA'],
    dark_matter_cloud: ['Shadow', 'Phantom', 'Void', 'Abyss', 'Eclipse'],
    antimatter_storm: ['Annihilation', 'Positron', 'Antiproton', 'Inverse', 'Mirror'],
    temporal_anomaly: ['Chronos', 'Paradox', 'Causality', 'Timeline', 'Epoch']
  };

  const nameList = names[type] || ['Unknown'];
  const name = nameList[Math.floor(Math.random() * nameList.length)];
  
  return `${name} Event ${index + 1}`;
}

function generateAnomalyName(type: string, index: number): string {
  const names: Record<string, string[]> = {
    time_dilation: ['Temporal Flux', 'Time Warp', 'Chronological Distortion'],
    spatial_rift: ['Space Tear', 'Dimensional Crack', 'Reality Breach'],
    energy_vortex: ['Power Maelstrom', 'Energy Cyclone', 'Plasma Whirlpool'],
    quantum_fluctuation: ['Quantum Foam', 'Probability Wave', 'Uncertainty Field'],
    dimensional_tear: ['Reality Rip', 'Multiverse Gateway', 'Dimensional Breach']
  };

  const nameList = names[type] || ['Unknown Anomaly'];
  const name = nameList[Math.floor(Math.random() * nameList.length)];
  
  return `${name} ${index + 1}`;
}

function generatePhenomenonEffects(type: string, intensity: number) {
  const effectTemplates: Record<string, any[]> = {
    supernova_remnant: [
      { type: 'damage', value: intensity * 10, description: 'Radiation damage to ships' },
      { type: 'boost', value: intensity * 5, description: 'Energy production boost' }
    ],
    gamma_ray_burst: [
      { type: 'damage', value: intensity * 15, description: 'Severe radiation damage' },
      { type: 'disruption', value: intensity * 8, description: 'Communication interference' }
    ],
    gravitational_wave: [
      { type: 'disruption', value: intensity * 6, description: 'Navigation disruption' },
      { type: 'mutation', value: intensity * 3, description: 'Temporal effects' }
    ],
    dark_matter_cloud: [
      { type: 'boost', value: intensity * 10, description: 'Dark matter harvesting bonus' },
      { type: 'disruption', value: intensity * 4, description: 'Sensor interference' }
    ],
    antimatter_storm: [
      { type: 'damage', value: intensity * 12, description: 'Matter-antimatter reactions' },
      { type: 'boost', value: intensity * 8, description: 'Antimatter collection bonus' }
    ],
    temporal_anomaly: [
      { type: 'mutation', value: intensity * 10, description: 'Time dilation effects' },
      { type: 'boost', value: intensity * 5, description: 'Research speed increase' }
    ]
  };

  return effectTemplates[type] || [];
}

function generateAnomalyFindings(type: string) {
  const findings: Record<string, any> = {
    time_dilation: {
      technology: 'Temporal Manipulation',
      knowledge: 'Understanding of time-space continuum'
    },
    spatial_rift: {
      blueprint: 'Dimensional Drive',
      knowledge: 'Multiverse theory insights'
    },
    energy_vortex: {
      technology: 'Zero-Point Energy Extraction',
      knowledge: 'Advanced energy physics'
    },
    quantum_fluctuation: {
      artifact: 'Quantum Stabilizer',
      knowledge: 'Quantum mechanics mastery'
    },
    dimensional_tear: {
      blueprint: 'Interdimensional Gateway',
      technology: 'Reality Manipulation'
    }
  };

  return findings[type] || { knowledge: 'Unknown scientific data' };
}

function generateInterstellarObjects(universeId: string, count: number = 100): InterstellarObject[] {
    const objectTypes: InterstellarObject['type'][] = [
      'asteroid', 'nebula', 'black_hole', 'wormhole', 'pulsar', 
      'quasar', 'supernova', 'comet', 'space_station', 'derelict_ship'
    ];
    
    const sizes: InterstellarObject['size'][] = ['tiny', 'small', 'medium', 'large', 'massive'];
    
    const specialProperties = [
      'Rich in rare minerals',
      'Ancient technology detected',
      'Unstable energy readings',
      'Gravitational anomaly',
      'Temporal distortion',
      'Exotic matter signature',
      'Alien artifacts present',
      'Radiation hazard',
      'Magnetic field interference',
      'Quantum entanglement detected'
    ];

    return Array.from({ length: count }, (_, i) => {
      const type = objectTypes[Math.floor(Math.random() * objectTypes.length)];
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const dangerLevel = Math.floor(Math.random() * 10) + 1;
      
      const resources: InterstellarObject['resources'] = {};
      
      // Different object types have different resources
      if (type === 'asteroid') {
        resources.metal = Math.floor(Math.random() * 1000000) + 100000;
        resources.crystal = Math.floor(Math.random() * 500000) + 50000;
      } else if (type === 'nebula') {
        resources.deuterium = Math.floor(Math.random() * 800000) + 100000;
        resources.exoticMatter = Math.floor(Math.random() * 10000) + 1000;
      } else if (type === 'black_hole') {
        resources.darkMatter = Math.floor(Math.random() * 50000) + 5000;
        resources.antimatter = Math.floor(Math.random() * 20000) + 2000;
      } else if (type === 'derelict_ship') {
        resources.metal = Math.floor(Math.random() * 200000) + 20000;
        resources.crystal = Math.floor(Math.random() * 100000) + 10000;
      }

      return {
        id: `object-${universeId}-${i}`,
        universeId,
        galaxyId: `galaxy-${Math.floor(Math.random() * 8) + 1}`,
        name: generateObjectName(type, i),
        type,
        coordinates: {
          x: Math.floor(Math.random() * 10000),
          y: Math.floor(Math.random() * 10000),
          z: Math.floor(Math.random() * 1000)
        },
        size,
        dangerLevel,
        resources,
        discovered: Math.random() > 0.7,
        scanned: Math.random() > 0.85,
        harvestable: ['asteroid', 'nebula', 'derelict_ship', 'comet'].includes(type),
        remainingResources: Math.floor(Math.random() * 100) + 1,
        specialProperties: Math.random() > 0.6 ? [
          specialProperties[Math.floor(Math.random() * specialProperties.length)]
        ] : undefined
      };
    });
  };

function generateCosmicPhenomena(universeId: string, count: number = 20): CosmicPhenomenon[] {
  const types: CosmicPhenomenon['type'][] = [
    'supernova_remnant', 'gamma_ray_burst', 'gravitational_wave',
    'dark_matter_cloud', 'antimatter_storm', 'temporal_anomaly'
  ];

  return Array.from({ length: count }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const intensity = Math.floor(Math.random() * 100) + 1;
    const duration = Math.floor(Math.random() * 1440) + 60;
    const startedAt = new Date();
    const endsAt = new Date(startedAt.getTime() + duration * 60000);

    const effects = generatePhenomenonEffects(type, intensity);

    return {
      id: `phenomenon-${universeId}-${i}`,
      universeId,
      type,
      name: generatePhenomenonName(type, i),
      coordinates: {
        x: Math.floor(Math.random() * 10000),
        y: Math.floor(Math.random() * 10000),
        z: Math.floor(Math.random() * 1000)
      },
      intensity,
      radius: Math.floor(Math.random() * 500) + 100,
      duration,
      effects,
      active: Math.random() > 0.3,
      startedAt,
      endsAt
    };
  });
}

function generateSpaceAnomalies(universeId: string, count: number = 30): SpaceAnomalies[] {
  const types: SpaceAnomalies['type'][] = [
    'time_dilation', 'spatial_rift', 'energy_vortex',
    'quantum_fluctuation', 'dimensional_tear'
  ];

  return Array.from({ length: count }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const investigated = Math.random() > 0.8;

    return {
      id: `anomaly-${universeId}-${i}`,
      universeId,
      type,
      name: generateAnomalyName(type, i),
      coordinates: {
        x: Math.floor(Math.random() * 10000),
        y: Math.floor(Math.random() * 10000),
        z: Math.floor(Math.random() * 1000)
      },
      stability: Math.floor(Math.random() * 100) + 1,
      researchValue: Math.floor(Math.random() * 10000) + 1000,
      investigated,
      findings: investigated ? generateAnomalyFindings(type) : undefined
    };
  });
}

export const useInterstellarObjects = () => {
  const [objects, setObjects] = useState<InterstellarObject[]>([]);
  const [phenomena, setPhenomena] = useState<CosmicPhenomenon[]>([]);
  const [missions, setMissions] = useState<ExplorationMission[]>([]);
  const [anomalies, setAnomalies] = useState<SpaceAnomalies[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUniverse, setCurrentUniverse] = useState('universe-alpha');

  // Initialize objects for current universe
  useEffect(() => {
    const initializeObjects = () => {
      setLoading(true);
      
      const universeObjects = generateInterstellarObjects(currentUniverse, 150);
      const universePhenomena = generateCosmicPhenomena(currentUniverse, 25);
      const universeAnomalies = generateSpaceAnomalies(currentUniverse, 40);
      
      setObjects(universeObjects);
      setPhenomena(universePhenomena);
      setAnomalies(universeAnomalies);
      
      setLoading(false);
    };

    initializeObjects();
  }, [currentUniverse]);

  // Start exploration mission
  const startExplorationMission = async (
    targetId: string,
    targetType: 'object' | 'phenomenon' | 'sector',
    missionType: 'scan' | 'harvest' | 'investigate' | 'salvage',
    fleetId: string
  ): Promise<ExplorationMission> => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    const duration = Math.floor(Math.random() * 60) + 30; // 30-90 minutes
    const startedAt = new Date();
    const estimatedCompletion = new Date(startedAt.getTime() + duration * 60000);

    const mission: ExplorationMission = {
      id: `mission-${Date.now()}`,
      playerId: user.id,
      targetId,
      targetType,
      missionType,
      fleetId,
      status: 'traveling',
      progress: 0,
      startedAt,
      estimatedCompletion
    };

    setMissions(prev => [...prev, mission]);
    return mission;
  };

  // Scan interstellar object
  const scanObject = async (objectId: string): Promise<InterstellarObject> => {
    const object = objects.find(o => o.id === objectId);
    if (!object) throw new Error('Object not found');

    const updatedObject = {
      ...object,
      scanned: true,
      discovered: true
    };

    setObjects(prev => prev.map(o => o.id === objectId ? updatedObject : o));
    return updatedObject;
  };

  // Harvest resources from object
  const harvestResources = async (objectId: string, _fleetId: string): Promise<any> => {
    const object = objects.find(o => o.id === objectId);
    if (!object) throw new Error('Object not found');
    if (!object.harvestable) throw new Error('Object is not harvestable');

    const harvestAmount = Math.floor(object.remainingResources * 0.1); // Harvest 10% per operation
    const resources: any = {};

    Object.entries(object.resources).forEach(([key, value]) => {
      if (value) {
        resources[key] = Math.floor(value * harvestAmount / 100);
      }
    });

    const updatedObject = {
      ...object,
      remainingResources: Math.max(0, object.remainingResources - harvestAmount),
      lastHarvestedAt: new Date()
    };

    setObjects(prev => prev.map(o => o.id === objectId ? updatedObject : o));

    return {
      resources,
      remainingResources: updatedObject.remainingResources
    };
  };

  // Investigate anomaly
  const investigateAnomaly = async (anomalyId: string): Promise<SpaceAnomalies> => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    const anomaly = anomalies.find(a => a.id === anomalyId);
    if (!anomaly) throw new Error('Anomaly not found');

    const findings = generateAnomalyFindings(anomaly.type);

    const updatedAnomaly = {
      ...anomaly,
      investigated: true,
      investigatedBy: user.id,
      findings
    };

    setAnomalies(prev => prev.map(a => a.id === anomalyId ? updatedAnomaly : a));
    return updatedAnomaly;
  };

  // Get objects by type
  const getObjectsByType = (type: InterstellarObject['type']) => {
    return objects.filter(o => o.type === type);
  };

  // Get objects by galaxy
  const getObjectsByGalaxy = (galaxyId: string) => {
    return objects.filter(o => o.galaxyId === galaxyId);
  };

  // Get active phenomena
  const getActivePhenomena = () => {
    return phenomena.filter(p => p.active && new Date(p.endsAt) > new Date());
  };

  // Get uninvestigated anomalies
  const getUninvestigatedAnomalies = () => {
    return anomalies.filter(a => !a.investigated);
  };

  // Get harvestable objects
  const getHarvestableObjects = () => {
    return objects.filter(o => o.harvestable && o.remainingResources > 0);
  };

  return {
    objects,
    phenomena,
    missions,
    anomalies,
    loading,
    currentUniverse,
    setCurrentUniverse,
    startExplorationMission,
    scanObject,
    harvestResources,
    investigateAnomaly,
    getObjectsByType,
    getObjectsByGalaxy,
    getActivePhenomena,
    getUninvestigatedAnomalies,
    getHarvestableObjects
  };
};