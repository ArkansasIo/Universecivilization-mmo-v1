import { useState, useEffect, useCallback } from 'react';

export interface PopulationData {
  locationId: string;
  locationName: string;
  locationType: 'planet' | 'moon' | 'starbase' | 'moonbase' | 'station' | 'colony';
  population: number;
  maxPopulation: number;
  growthRate: number;
  happiness: number;
  food: number;
  foodConsumption: number;
  foodProduction: number;
  water: number;
  waterConsumption: number;
  waterProduction: number;
  oxygen: number;
  oxygenConsumption: number;
  oxygenProduction: number;
  energy: number;
  energyConsumption: number;
  energyProduction: number;
  housing: number;
  housingCapacity: number;
  employment: number;
  jobs: number;
  morale: number;
  health: number;
  education: number;
  security: number;
  pollution: number;
  crime: number;
  culture: number;
  technology: number;
  specialization?: string;
  specializationLevel: number;
  specializationBonus: number;
}

export interface PopulationEvent {
  id: string;
  type: 'birth' | 'death' | 'migration' | 'disaster' | 'prosperity' | 'disease' | 'celebration';
  message: string;
  impact: number;
  timestamp: Date;
}

const MOCK_POPULATIONS: PopulationData[] = [
  {
    locationId: 'planet_1',
    locationName: 'Solaris Prime',
    locationType: 'planet',
    population: 4820000,
    maxPopulation: 10000000,
    growthRate: 0.012,
    happiness: 82,
    food: 980000,
    foodConsumption: 482000,
    foodProduction: 620000,
    water: 1450000,
    waterConsumption: 723000,
    waterProduction: 850000,
    oxygen: 2100000,
    oxygenConsumption: 241000,
    oxygenProduction: 350000,
    energy: 3200000,
    energyConsumption: 964000,
    energyProduction: 1200000,
    housing: 4820000,
    housingCapacity: 6000000,
    employment: 3374000,
    jobs: 3856000,
    morale: 78,
    health: 85,
    education: 74,
    security: 80,
    pollution: 22,
    crime: 15,
    culture: 70,
    technology: 80,
    specialization: 'research',
    specializationLevel: 3,
    specializationBonus: 30,
  },
  {
    locationId: 'planet_2',
    locationName: 'Kerath IV',
    locationType: 'planet',
    population: 2350000,
    maxPopulation: 5000000,
    growthRate: 0.008,
    happiness: 71,
    food: 540000,
    foodConsumption: 235000,
    foodProduction: 280000,
    water: 720000,
    waterConsumption: 352500,
    waterProduction: 400000,
    oxygen: 950000,
    oxygenConsumption: 117500,
    oxygenProduction: 140000,
    energy: 1600000,
    energyConsumption: 470000,
    energyProduction: 520000,
    housing: 2350000,
    housingCapacity: 3000000,
    employment: 1645000,
    jobs: 1880000,
    morale: 65,
    health: 72,
    education: 68,
    security: 74,
    pollution: 38,
    crime: 28,
    culture: 58,
    technology: 65,
    specialization: 'industrial',
    specializationLevel: 2,
    specializationBonus: 20,
  },
  {
    locationId: 'moon_1',
    locationName: 'Luna Station',
    locationType: 'moon',
    population: 340000,
    maxPopulation: 1000000,
    growthRate: 0.005,
    happiness: 76,
    food: 120000,
    foodConsumption: 34000,
    foodProduction: 45000,
    water: 200000,
    waterConsumption: 51000,
    waterProduction: 65000,
    oxygen: 350000,
    oxygenConsumption: 17000,
    oxygenProduction: 25000,
    energy: 480000,
    energyConsumption: 68000,
    energyProduction: 90000,
    housing: 340000,
    housingCapacity: 500000,
    employment: 238000,
    jobs: 272000,
    morale: 70,
    health: 78,
    education: 80,
    security: 85,
    pollution: 10,
    crime: 8,
    culture: 65,
    technology: 88,
    specialization: 'mining',
    specializationLevel: 2,
    specializationBonus: 20,
  },
  {
    locationId: 'starbase_1',
    locationName: 'Orion Starbase',
    locationType: 'starbase',
    population: 128000,
    maxPopulation: 500000,
    growthRate: 0.003,
    happiness: 88,
    food: 50000,
    foodConsumption: 12800,
    foodProduction: 18000,
    water: 80000,
    waterConsumption: 19200,
    waterProduction: 25000,
    oxygen: 140000,
    oxygenConsumption: 6400,
    oxygenProduction: 9000,
    energy: 220000,
    energyConsumption: 25600,
    energyProduction: 35000,
    housing: 128000,
    housingCapacity: 200000,
    employment: 115200,
    jobs: 128000,
    morale: 88,
    health: 92,
    education: 85,
    security: 96,
    pollution: 5,
    crime: 3,
    culture: 55,
    technology: 92,
    specialization: 'military',
    specializationLevel: 4,
    specializationBonus: 40,
  },
  {
    locationId: 'colony_1',
    locationName: 'Vora Prime Colony',
    locationType: 'colony',
    population: 52000,
    maxPopulation: 150000,
    growthRate: 0.018,
    happiness: 64,
    food: 18000,
    foodConsumption: 5200,
    foodProduction: 7500,
    water: 28000,
    waterConsumption: 7800,
    waterProduction: 10000,
    oxygen: 45000,
    oxygenConsumption: 2600,
    oxygenProduction: 3500,
    energy: 35000,
    energyConsumption: 10400,
    energyProduction: 12000,
    housing: 52000,
    housingCapacity: 70000,
    employment: 31200,
    jobs: 36400,
    morale: 58,
    health: 65,
    education: 55,
    security: 62,
    pollution: 18,
    crime: 22,
    culture: 45,
    technology: 50,
    specializationLevel: 0,
    specializationBonus: 0,
  },
];

const MOCK_EVENTS: PopulationEvent[] = [
  {
    id: 'evt_1',
    type: 'prosperity',
    message: 'Solaris Prime experiences an economic boom! Population surges.',
    impact: 12,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 'evt_2',
    type: 'birth',
    message: 'High birth rates recorded across Kerath IV settlements.',
    impact: 8,
    timestamp: new Date(Date.now() - 1000 * 60 * 18),
  },
  {
    id: 'evt_3',
    type: 'migration',
    message: '4,200 citizens migrate from Vora Prime Colony to Luna Station.',
    impact: -5,
    timestamp: new Date(Date.now() - 1000 * 60 * 42),
  },
  {
    id: 'evt_4',
    type: 'celebration',
    message: 'Orion Starbase celebrates its 10th anniversary. Morale +15.',
    impact: 15,
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
  },
  {
    id: 'evt_5',
    type: 'disease',
    message: 'Minor flu outbreak contained on Kerath IV. Health -4.',
    impact: -4,
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
  },
];

export const usePopulationSystem = (_playerId: string) => {
  const [populations, setPopulations] = useState<PopulationData[]>(MOCK_POPULATIONS);
  const [events, setEvents] = useState<PopulationEvent[]>(MOCK_EVENTS);
  const [loading, setLoading] = useState(true);

  const [locationTypes] = useState([
    { type: 'planet', name: 'Planet', icon: '🌍', baseCapacity: 10000000, description: 'Large terrestrial world with atmosphere' },
    { type: 'moon', name: 'Moon', icon: '🌙', baseCapacity: 1000000, description: 'Natural satellite orbiting a planet' },
    { type: 'starbase', name: 'Starbase', icon: '🛰️', baseCapacity: 500000, description: 'Military space station' },
    { type: 'moonbase', name: 'Moon Base', icon: '🏗️', baseCapacity: 250000, description: 'Lunar surface facility' },
    { type: 'space_station', name: 'Space Station', icon: '🛸', baseCapacity: 100000, description: 'Orbital habitat and trading hub' },
    { type: 'colony', name: 'Colony', icon: '🏘️', baseCapacity: 50000, description: 'Frontier settlement' },
    { type: 'asteroid_base', name: 'Asteroid Base', icon: '☄️', baseCapacity: 25000, description: 'Mining facility on asteroid' },
    { type: 'orbital_habitat', name: 'Orbital Habitat', icon: '🔆', baseCapacity: 75000, description: 'Rotating space habitat' },
    { type: 'deep_space_outpost', name: 'Deep Space Outpost', icon: '🌌', baseCapacity: 10000, description: 'Remote exploration base' },
    { type: 'dyson_sphere', name: 'Dyson Sphere', icon: '⭐', baseCapacity: 100000000, description: 'Megastructure around a star' },
  ]);

  const [specializations] = useState([
    { type: 'mining', name: 'Mining Hub', icon: '⛏️', description: 'Specialized in resource extraction', bonuses: { resourceProduction: 50, pollution: 30 } },
    { type: 'research', name: 'Research Center', icon: '🔬', description: 'Advanced scientific facilities', bonuses: { technology: 50, education: 30 } },
    { type: 'military', name: 'Military Base', icon: '⚔️', description: 'Fortified defense installation', bonuses: { security: 50, crime: -30 } },
    { type: 'agriculture', name: 'Agricultural World', icon: '🌾', description: 'Food production paradise', bonuses: { foodProduction: 100, health: 20 } },
    { type: 'industrial', name: 'Industrial Complex', icon: '🏭', description: 'Manufacturing powerhouse', bonuses: { production: 50, pollution: 40 } },
    { type: 'commercial', name: 'Trade Hub', icon: '💼', description: 'Economic center', bonuses: { credits: 50, culture: 20 } },
    { type: 'tourism', name: 'Tourist Destination', icon: '🎭', description: 'Entertainment and leisure', bonuses: { happiness: 30, culture: 40 } },
    { type: 'diplomatic', name: 'Diplomatic Center', icon: '🤝', description: 'Interstellar relations hub', bonuses: { culture: 50, happiness: 20 } },
  ]);

  useEffect(() => {
    // Simulate loading delay
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  // Periodic population simulation
  const updatePopulations = useCallback(() => {
    setPopulations(prev => prev.map(pop => {
      const foodNeeded = pop.population * 0.0001;
      const waterNeeded = pop.population * 0.00015;
      const oxygenNeeded = pop.population * 0.00005;
      const energyNeeded = pop.population * 0.0002;

      let happiness = 100;
      if (pop.food < foodNeeded) happiness -= 30;
      if (pop.water < waterNeeded) happiness -= 40;
      if (pop.oxygen < oxygenNeeded) happiness -= 50;
      if (pop.energy < energyNeeded) happiness -= 20;
      if (pop.housing < pop.population * 0.8) happiness -= 15;
      happiness = Math.max(0, Math.min(100, happiness + (pop.happiness - 100) * 0.1));

      let growthRate = 0;
      if (happiness > 70) {
        growthRate = (happiness / 100) * 0.002;
      } else if (happiness < 30) {
        growthRate = -0.001;
      }

      const newPop = Math.max(0, Math.min(pop.maxPopulation, pop.population + Math.floor(pop.population * growthRate)));

      return {
        ...pop,
        population: newPop,
        happiness: Math.round(happiness),
        growthRate,
      };
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(updatePopulations, 10000);
    return () => clearInterval(interval);
  }, [updatePopulations]);

  const addLocation = (
    locationName: string,
    locationType: PopulationData['locationType'],
    initialPopulation: number = 1000
  ) => {
    const newLoc: PopulationData = {
      locationId: `${locationType}_${Date.now()}`,
      locationName,
      locationType,
      population: initialPopulation,
      maxPopulation: initialPopulation * 10,
      growthRate: 0.01,
      happiness: 75,
      food: 10000,
      foodConsumption: initialPopulation * 0.1,
      foodProduction: initialPopulation * 0.15,
      water: 15000,
      waterConsumption: initialPopulation * 0.15,
      waterProduction: initialPopulation * 0.2,
      oxygen: 20000,
      oxygenConsumption: initialPopulation * 0.05,
      oxygenProduction: initialPopulation * 0.1,
      energy: 25000,
      energyConsumption: initialPopulation * 0.2,
      energyProduction: initialPopulation * 0.3,
      housing: initialPopulation,
      housingCapacity: Math.floor(initialPopulation * 1.5),
      employment: Math.floor(initialPopulation * 0.7),
      jobs: Math.floor(initialPopulation * 0.8),
      morale: 75,
      health: 80,
      education: 70,
      security: 75,
      pollution: 10,
      crime: 10,
      culture: 50,
      technology: 50,
      specializationLevel: 0,
      specializationBonus: 0,
    };
    setPopulations(prev => [...prev, newLoc]);

    const event: PopulationEvent = {
      id: `evt_${Date.now()}`,
      type: 'migration',
      message: `New ${locationType} "${locationName}" established with ${initialPopulation.toLocaleString()} colonists.`,
      impact: 5,
      timestamp: new Date(),
    };
    setEvents(prev => [event, ...prev.slice(0, 19)]);

    return { success: true, message: `Added ${locationName}` };
  };

  const upgradeInfrastructure = (
    locationId: string,
    type: 'housing' | 'food' | 'water' | 'oxygen' | 'energy'
  ) => {
    setPopulations(prev => prev.map(p => {
      if (p.locationId !== locationId) return p;
      switch (type) {
        case 'housing': return { ...p, housingCapacity: Math.floor(p.housingCapacity * 1.2) };
        case 'food': return { ...p, foodProduction: Math.floor(p.foodProduction * 1.3) };
        case 'water': return { ...p, waterProduction: Math.floor(p.waterProduction * 1.3) };
        case 'oxygen': return { ...p, oxygenProduction: Math.floor(p.oxygenProduction * 1.3) };
        case 'energy': return { ...p, energyProduction: Math.floor(p.energyProduction * 1.3) };
        default: return p;
      }
    }));
    return { success: true, message: `Upgraded ${type} infrastructure` };
  };

  const transferPopulation = (fromLocationId: string, toLocationId: string, amount: number) => {
    const from = populations.find(p => p.locationId === fromLocationId);
    const to = populations.find(p => p.locationId === toLocationId);

    if (!from || !to) return { success: false, message: 'Location not found' };
    if (from.population < amount) return { success: false, message: 'Insufficient population' };
    if (to.population + amount > to.maxPopulation) return { success: false, message: 'Destination at max capacity' };

    setPopulations(prev => prev.map(p => {
      if (p.locationId === fromLocationId) return { ...p, population: p.population - amount };
      if (p.locationId === toLocationId) return { ...p, population: p.population + amount };
      return p;
    }));

    const event: PopulationEvent = {
      id: `evt_${Date.now()}`,
      type: 'migration',
      message: `${amount.toLocaleString()} citizens migrated from ${from.locationName} to ${to.locationName}.`,
      impact: 0,
      timestamp: new Date(),
    };
    setEvents(prev => [event, ...prev.slice(0, 19)]);

    return { success: true, message: `Transferred ${amount} population` };
  };

  const addResources = (
    locationId: string,
    resourceType: 'food' | 'water' | 'oxygen' | 'energy',
    amount: number
  ) => {
    setPopulations(prev => prev.map(p => {
      if (p.locationId !== locationId) return p;
      return { ...p, [resourceType]: p[resourceType] + amount };
    }));
    return { success: true, message: `Added ${amount} ${resourceType}` };
  };

  const setSpecialization = (locationId: string, specialization: string) => {
    setPopulations(prev => prev.map(p => {
      if (p.locationId !== locationId) return p;
      return { ...p, specialization, specializationLevel: 1, specializationBonus: 10 };
    }));
    return { success: true };
  };

  const upgradeSpecialization = (locationId: string) => {
    const location = populations.find(l => l.locationId === locationId);
    if (!location || !location.specialization) return { success: false, error: 'No specialization set' };

    const newLevel = location.specializationLevel + 1;
    const newBonus = newLevel * 10;

    setPopulations(prev => prev.map(p => {
      if (p.locationId !== locationId) return p;
      return { ...p, specializationLevel: newLevel, specializationBonus: newBonus };
    }));
    return { success: true, newLevel, newBonus };
  };

  const reducePollution = (locationId: string, amount: number) => {
    setPopulations(prev => prev.map(p => {
      if (p.locationId !== locationId) return p;
      return { ...p, pollution: Math.max(0, p.pollution - amount) };
    }));
    return { success: true };
  };

  const improveSecurity = (locationId: string) => {
    setPopulations(prev => prev.map(p => {
      if (p.locationId !== locationId) return p;
      return { ...p, security: Math.min(100, p.security + 10), crime: Math.max(0, p.crime - 10) };
    }));
    return { success: true };
  };

  const boostCulture = (locationId: string) => {
    setPopulations(prev => prev.map(p => {
      if (p.locationId !== locationId) return p;
      return { ...p, culture: Math.min(100, p.culture + 10), happiness: Math.min(100, p.happiness + 5) };
    }));
    return { success: true };
  };

  const getSpecializationInfo = (type: string) => specializations.find(s => s.type === type);
  const getLocationTypeInfo = (type: string) => locationTypes.find(t => t.type === type);
  const getTotalPopulation = () => populations.reduce((sum, pop) => sum + pop.population, 0);
  const getAverageHappiness = () => {
    if (populations.length === 0) return 0;
    return Math.round(populations.reduce((sum, pop) => sum + pop.happiness, 0) / populations.length);
  };

  return {
    populations,
    events,
    loading,
    locationTypes,
    specializations,
    addLocation,
    upgradeInfrastructure,
    transferPopulation,
    addResources,
    getTotalPopulation,
    getAverageHappiness,
    updatePopulations,
    setSpecialization,
    upgradeSpecialization,
    reducePollution,
    improveSecurity,
    boostCulture,
    getSpecializationInfo,
    getLocationTypeInfo,
  };
};
