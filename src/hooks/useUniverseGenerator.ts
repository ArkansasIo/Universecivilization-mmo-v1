
import { useState, useCallback, useMemo } from 'react';
import {
  UniverseSeed,
  StarSystem,
  generateStarSystem,
  universeSeeds,
  SeededRandom
} from '../data/universeSeeds';

export interface Galaxy {
  id: string;
  name: string;
  coordinates: { x: number; y: number; z: number };
  starSystems: StarSystem[];
  type: 'spiral' | 'elliptical' | 'irregular' | 'barred-spiral';
  size: number;
  age: number;
}

export function useUniverseGenerator() {
  const [selectedUniverse, setSelectedUniverse] = useState<UniverseSeed | null>(null);
  const [generatedGalaxies, setGeneratedGalaxies] = useState<Galaxy[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Generate galaxy name
  const generateGalaxyName = useCallback((seed: number, index: number): string => {
    const rng = new SeededRandom(seed + index * 10000);
    const prefixes = [
      'Andromeda', 'Triangulum', 'Whirlpool', 'Sombrero', 'Pinwheel', 'Cartwheel',
      'Sunflower', 'Tadpole', 'Antennae', 'Black Eye', 'Cigar', 'Fireworks',
      'Sculptor', 'Phoenix', 'Fornax', 'Centaurus', 'Virgo', 'Coma', 'Perseus',
      'Hydra', 'Pegasus', 'Draco', 'Ursa', 'Cygnus', 'Aquila', 'Lyra', 'Orion',
      'Cassiopeia', 'Sagittarius', 'Scorpius', 'Leo', 'Gemini', 'Taurus', 'Aries',
      'Cancer', 'Capricorn', 'Aquarius', 'Pisces', 'Libra', 'Ophiuchus'
    ];
    
    const suffixes = [
      'Cluster', 'Expanse', 'Realm', 'Domain', 'Sector', 'Quadrant', 'Region',
      'Territory', 'Zone', 'Nebula', 'Complex', 'Formation', 'Assembly', 'Group'
    ];
    
    const prefix = rng.choice(prefixes);
    const suffix = rng.choice(suffixes);
    const number = rng.nextInt(1, 9999);
    
    const format = rng.nextInt(1, 4);
    switch (format) {
      case 1: return `${prefix} ${suffix}`;
      case 2: return `${prefix}-${number}`;
      case 3: return `${prefix} ${suffix} ${number}`;
      default: return `${prefix} Galaxy`;
    }
  }, []);

  // Generate a single galaxy
  const generateGalaxy = useCallback((universeSeed: number, galaxyIndex: number, systemCount: number): Galaxy => {
    const rng = new SeededRandom(universeSeed + galaxyIndex * 10000);
    
    const galaxyTypes: Array<'spiral' | 'elliptical' | 'irregular' | 'barred-spiral'> = [
      'spiral', 'elliptical', 'irregular', 'barred-spiral'
    ];
    
    const starSystems: StarSystem[] = [];
    const systemsToGenerate = Math.min(systemCount, 100); // Limit per galaxy for performance
    
    for (let i = 0; i < systemsToGenerate; i++) {
      const systemSeed = universeSeed + galaxyIndex * 10000 + i;
      starSystems.push(generateStarSystem(systemSeed, systemSeed));
    }
    
    return {
      id: `galaxy-${galaxyIndex}`,
      name: generateGalaxyName(universeSeed, galaxyIndex),
      coordinates: {
        x: rng.nextInt(-100000, 100000),
        y: rng.nextInt(-100000, 100000),
        z: rng.nextInt(-10000, 10000)
      },
      starSystems,
      type: rng.choice(galaxyTypes),
      size: rng.nextInt(50000, 200000),
      age: rng.nextInt(1000, 13000)
    };
  }, [generateGalaxyName]);

  // Generate universe
  const generateUniverse = useCallback(async (universe: UniverseSeed, galaxyCount: number = 10) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setSelectedUniverse(universe);
    
    const galaxies: Galaxy[] = [];
    const systemsPerGalaxy = Math.floor(universe.starSystemCount / galaxyCount);
    
    try {
      // Generate galaxies in batches to avoid blocking UI
      for (let i = 0; i < galaxyCount; i++) {
        await new Promise(resolve => setTimeout(resolve, 10)); // Allow UI to update
        
        const galaxy = generateGalaxy(universe.seed, i, systemsPerGalaxy);
        galaxies.push(galaxy);
        
        setGenerationProgress(((i + 1) / galaxyCount) * 100);
      }
      
      setGeneratedGalaxies(galaxies);
    } catch (error) {
      console.error('Error generating universe:', error);
      setGeneratedGalaxies([]);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(100);
    }
  }, [generateGalaxy]);

  // Get star system by coordinates
  const getStarSystemByCoordinates = useCallback((x: number, y: number, z: number): StarSystem | null => {
    try {
      for (const galaxy of generatedGalaxies) {
        for (const system of galaxy.starSystems) {
          const distance = Math.sqrt(
            Math.pow(system.coordinates.x - x, 2) +
            Math.pow(system.coordinates.y - y, 2) +
            Math.pow(system.coordinates.z - z, 2)
          );
          
          if (distance < 10) {
            return system;
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting star system by coordinates:', error);
      return null;
    }
  }, [generatedGalaxies]);

  // Get nearby star systems
  const getNearbyStarSystems = useCallback((x: number, y: number, z: number, radius: number): StarSystem[] => {
    try {
      const nearby: StarSystem[] = [];
      
      for (const galaxy of generatedGalaxies) {
        for (const system of galaxy.starSystems) {
          const distance = Math.sqrt(
            Math.pow(system.coordinates.x - x, 2) +
            Math.pow(system.coordinates.y - y, 2) +
            Math.pow(system.coordinates.z - z, 2)
          );
          
          if (distance <= radius) {
            nearby.push(system);
          }
        }
      }
      
      return nearby.sort((a, b) => {
        const distA = Math.sqrt(
          Math.pow(a.coordinates.x - x, 2) +
          Math.pow(a.coordinates.y - y, 2) +
          Math.pow(a.coordinates.z - z, 2)
        );
        const distB = Math.sqrt(
          Math.pow(b.coordinates.x - x, 2) +
          Math.pow(b.coordinates.y - y, 2) +
          Math.pow(b.coordinates.z - z, 2)
        );
        return distA - distB;
      });
    } catch (error) {
      console.error('Error getting nearby star systems:', error);
      return [];
    }
  }, [generatedGalaxies]);

  // Calculate total statistics
  const universeStats = useMemo(() => {
    if (!selectedUniverse || generatedGalaxies.length === 0) {
      return null;
    }
    
    try {
      let totalStarSystems = 0;
      let totalPlanets = 0;
      let totalMoons = 0;
      let totalAnomalies = 0;
      let habitablePlanets = 0;
      let resourceRichPlanets = 0;
      
      for (const galaxy of generatedGalaxies) {
        totalStarSystems += galaxy.starSystems.length;
        
        for (const system of galaxy.starSystems) {
          totalPlanets += system.planets.length;
          totalAnomalies += system.anomalies.length;
          
          for (const planet of system.planets) {
            totalMoons += planet.moons.length;
            
            if (planet.habitability > 0.5) {
              habitablePlanets++;
            }
            
            const totalResources = 
              planet.resources.metal +
              planet.resources.crystal +
              planet.resources.deuterium +
              planet.resources.darkMatter +
              planet.resources.exoticMatter;
            
            if (totalResources > 500000) {
              resourceRichPlanets++;
            }
          }
        }
      }
      
      return {
        galaxies: generatedGalaxies.length,
        starSystems: totalStarSystems,
        planets: totalPlanets,
        moons: totalMoons,
        anomalies: totalAnomalies,
        habitablePlanets,
        resourceRichPlanets
      };
    } catch (error) {
      console.error('Error calculating universe stats:', error);
      return null;
    }
  }, [selectedUniverse, generatedGalaxies]);

  // Search for star systems by name
  const searchStarSystems = useCallback((query: string): StarSystem[] => {
    try {
      const results: StarSystem[] = [];
      const lowerQuery = query.toLowerCase();
      
      for (const galaxy of generatedGalaxies) {
        for (const system of galaxy.starSystems) {
          if (system.name.toLowerCase().includes(lowerQuery)) {
            results.push(system);
          }
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error searching star systems:', error);
      return [];
    }
  }, [generatedGalaxies]);

  // Get random star system
  const getRandomStarSystem = useCallback((): StarSystem | null => {
    try {
      if (generatedGalaxies.length === 0) return null;
      
      const randomGalaxy = generatedGalaxies[Math.floor(Math.random() * generatedGalaxies.length)];
      if (randomGalaxy.starSystems.length === 0) return null;
      
      return randomGalaxy.starSystems[Math.floor(Math.random() * randomGalaxy.starSystems.length)];
    } catch (error) {
      console.error('Error getting random star system:', error);
      return null;
    }
  }, [generatedGalaxies]);

  return {
    // State
    selectedUniverse,
    generatedGalaxies,
    isGenerating,
    generationProgress,
    universeStats,
    
    // Actions
    generateUniverse,
    setSelectedUniverse,
    getStarSystemByCoordinates,
    getNearbyStarSystems,
    searchStarSystems,
    getRandomStarSystem,
    
    // Available universes
    availableUniverses: universeSeeds
  };
}
