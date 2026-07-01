import { useState, useEffect, useCallback, useRef } from 'react';
import * as THREE from 'three';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { generateGalaxyData, type GalaxySceneData, type StarData, type PlanetData, type HyperlaneData, type EmpireData } from '../components/scene/galaxyData';

const EMPIRE_COLORS = ['#4a90d9', '#e2c044', '#f87171', '#5bc0be', '#a78bfa', '#34d399', '#fb923c', '#f472b6'];
const STAR_TYPES = ['O', 'B', 'A', 'F', 'G', 'K', 'M', 'red_giant', 'blue_giant', 'neutron', 'black_hole'] as const;
const STAR_TYPE_COLORS: Record<string, string> = {
  O: '#9bb0ff', B: '#aac4ff', A: '#dae8ff', F: '#fff4e0',
  G: '#ffd868', K: '#ffb56b', M: '#ff8866',
  red_giant: '#ff4444', blue_giant: '#4488ff', neutron: '#88ddff', black_hole: '#440066',
};

interface DbPlanet {
  id: string;
  user_id: string;
  name: string;
  coordinates: string;
  metal: number;
  crystal: number;
  deuterium: number;
  is_main: boolean;
}

interface DbProfile {
  id: string;
  username: string;
  level: number;
}

interface DbFleet {
  id: string;
  user_id: string;
  name: string;
  status: string;
  origin_planet_id: string;
  destination_planet_id: string | null;
  mission_type: string | null;
  arrival_time: string | null;
  return_time: string | null;
}

function parseCoordinates(coords: string): { galaxy: number; system: number; planet: number } | null {
  const parts = coords.split(':').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  return { galaxy: parts[0], system: parts[1], planet: parts[2] };
}

function coordsToPosition(galaxy: number, system: number): THREE.Vector3 {
  return new THREE.Vector3(
    (galaxy - 5) * 35 + (Math.random() - 0.5) * 5,
    (Math.random() - 0.5) * 4,
    (system - 250) * 0.35 + (Math.random() - 0.5) * 3,
  );
}

export function useGalaxyData() {
  const { user } = useAuth();
  const [data, setData] = useState<GalaxySceneData>(() => generateGalaxyData());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const buildGalaxyData = useCallback(async () => {
    try {
      const [planetResult, profileResult, fleetResult] = await Promise.all([
        supabase.from('planets').select('*'),
        supabase.from('profiles').select('id, username, level'),
        supabase.from('fleets').select('*'),
      ]);

      if (!mountedRef.current) return;

      if (planetResult.error) throw planetResult.error;

      const dbPlanets: DbPlanet[] = planetResult.data || [];
      const dbProfiles: DbProfile[] = profileResult.data || [];
      const dbFleets: DbFleet[] = fleetResult.data || [];

      if (dbPlanets.length === 0) {
        setData(generateGalaxyData());
        setLoading(false);
        return;
      }

      const systemMap = new Map<string, { galaxy: number; system: number; planets: DbPlanet[] }>();

      for (const p of dbPlanets) {
        const parsed = parseCoordinates(p.coordinates);
        if (!parsed) continue;
        const key = `${parsed.galaxy}-${parsed.system}`;
        if (!systemMap.has(key)) {
          systemMap.set(key, { galaxy: parsed.galaxy, system: parsed.system, planets: [] });
        }
        systemMap.get(key)!.planets.push(p);
      }

      const profileMap = new Map<string, DbProfile>();
      for (const p of dbProfiles) profileMap.set(p.id, p);

      const empireMap = new Map<string, { name: string; color: string; userIds: Set<string> }>();

      const stars: StarData[] = [];
      const planets: PlanetData[] = [];
      const hyperlanes: HyperlaneData[] = [];
      const empires: EmpireData[] = [];

      let starIdx = 0;
      let planetIdx = 0;

      for (const [key, entry] of systemMap) {
        const pos = coordsToPosition(entry.galaxy, entry.system);
        const starType = STAR_TYPES[Math.floor(Math.random() * STAR_TYPES.length)];
        const starColor = new THREE.Color(STAR_TYPE_COLORS[starType] || '#ffffff');
        const starRadius = starType === 'black_hole' ? 0.8 : (starType === 'neutron' ? 0.5 : 0.3 + Math.random() * 0.5);

        const ownerIds = new Set(entry.planets.map(p => p.user_id));
        const primaryOwner = ownerIds.values().next().value;
        const profile = primaryOwner ? profileMap.get(primaryOwner) : undefined;
        const factionName = profile?.username || null;

        if (factionName && primaryOwner) {
          if (!empireMap.has(factionName)) {
            const color = EMPIRE_COLORS[empireMap.size % EMPIRE_COLORS.length];
            empireMap.set(factionName, { name: factionName, color, userIds: new Set() });
          }
          empireMap.get(factionName)!.userIds.add(primaryOwner);
        }

        const factionColor = factionName ? empireMap.get(factionName)?.color || '#ffffff' : '#ffffff';

        const starId = `star_${starIdx}`;
        stars.push({
          id: starId,
          name: `${profile?.username || 'System'} ${entry.galaxy}:${entry.system}`,
          position: pos,
          color: starColor,
          radius: starRadius,
          starType,
          planets: entry.planets.length,
          faction: factionName,
          factionColor,
        });

        for (let j = 0; j < entry.planets.length; j++) {
          const dbp = entry.planets[j];
          const orbitRadius = 1.5 + j * 1.2;
          const orbitSpeed = 0.2 + Math.random() * 0.3;
          const planetRadius = 0.08 + Math.random() * 0.15;
          const pColor = new THREE.Color(dbp.is_main ? '#4ade80' : EMPIRE_COLORS[j % EMPIRE_COLORS.length]);

          planets.push({
            id: `planet_${planetIdx}`,
            name: dbp.name,
            starId,
            orbitRadius,
            orbitSpeed,
            radius: planetRadius,
            color: pColor,
            type: 'terrestrial',
          });
          planetIdx++;
        }

        starIdx++;
      }

      const starArray = stars;
      const hyperlaneCount = Math.floor(starArray.length * 1.3);
      for (let i = 0; i < hyperlaneCount; i++) {
        const si = Math.floor(Math.random() * starArray.length);
        let sj = Math.floor(Math.random() * starArray.length);
        if (sj === si) sj = (si + 1) % starArray.length;
        const a = starArray[si].position;
        const b = starArray[sj].position;
        if (a.distanceTo(b) < 45 && !hyperlanes.some(h => h.source === starArray[sj].id && h.target === starArray[si].id)) {
          hyperlanes.push({ source: starArray[si].id, target: starArray[sj].id });
        }
      }

      for (const [name, emp] of empireMap) {
        const owned: string[] = [];
        starArray.forEach(s => {
          if (s.faction === name) owned.push(s.id);
        });
        empires.push({ id: `empire_${empireMap.size}`, name, color: emp.color, systems: owned });
      }

      setData({ stars, hyperlanes, planets, empires });
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching galaxy data:', err);
      if (mountedRef.current) {
        setData(generateGalaxyData());
        setError('Failed to load from database; using procedural data');
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    buildGalaxyData();

    const channel = supabase
      .channel('galaxy-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'planets' }, () => {
        if (mountedRef.current) buildGalaxyData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fleets' }, () => {
        if (mountedRef.current) buildGalaxyData();
      })
      .subscribe();

    return () => {
      mountedRef.current = false;
      supabase.removeChannel(channel);
    };
  }, [buildGalaxyData]);

  return { data, loading, error, refetch: buildGalaxyData };
}
