import * as THREE from 'three';

export interface StarData {
  id: string;
  name: string;
  position: THREE.Vector3;
  color: THREE.Color;
  radius: number;
  starType: string;
  planets: number;
  faction: string | null;
  factionColor: string;
}

export interface HyperlaneData {
  source: string;
  target: string;
}

export interface PlanetData {
  id: string;
  name: string;
  starId: string;
  orbitRadius: number;
  orbitSpeed: number;
  radius: number;
  color: THREE.Color;
  type: string;
}

export interface EmpireData {
  id: string;
  name: string;
  color: string;
  systems: string[];
}

export interface GalaxySceneData {
  stars: StarData[];
  hyperlanes: HyperlaneData[];
  planets: PlanetData[];
  empires: EmpireData[];
}

const STAR_NAMES = [
  'Sol Prime', 'Arcturus Gate', 'Rigel Alpha', 'Nova Station', 'Void Nexus',
  'Zeta Orionis', 'Crimson Deep', 'Azure Haven', 'Kepler\'s Reach', 'Tyriax',
  'Helios Crown', 'Draco\'s Eye', 'Fenrir', 'Aetheris', 'Nyx',
  'Oberon\'s Wake', 'Calypso', 'Pandora\'s Star', 'Hyperion', 'Chronos Depth',
];

const STAR_TYPES = ['O', 'B', 'A', 'F', 'G', 'K', 'M', 'red_giant', 'blue_giant', 'neutron', 'black_hole'] as const;
const PLANET_TYPES = ['terrestrial', 'gas_giant', 'ice_giant', 'desert', 'ocean', 'lava', 'barren'] as const;
const COLORS = ['#4a90d9', '#e2c044', '#f87171', '#5bc0be', '#a78bfa', '#34d399', '#fb923c', '#f472b6'];
const EMPIRE_NAMES = ['U-E-Dominions', 'Crimson Pact', 'Azure Alliance', 'Void Collective', 'Golden Concord'];

const STAR_TYPE_COLORS: Record<string, string> = {
  O: '#9bb0ff', B: '#aac4ff', A: '#dae8ff', F: '#fff4e0',
  G: '#ffd868', K: '#ffb56b', M: '#ff8866',
  red_giant: '#ff4444', blue_giant: '#4488ff', neutron: '#88ddff', black_hole: '#440066',
};

export function generateGalaxyData(): GalaxySceneData {
  const stars: StarData[] = [];
  const hyperlanes: HyperlaneData[] = [];
  const planets: PlanetData[] = [];
  const empires: EmpireData[] = [];

  const starCount = 30;
  const clusterCenters = [
    new THREE.Vector3(-30, 0, -20),
    new THREE.Vector3(25, 0, -30),
    new THREE.Vector3(-20, 0, 25),
    new THREE.Vector3(35, 0, 15),
    new THREE.Vector3(0, 0, 0),
  ];

  let planetCounter = 0;

  for (let i = 0; i < starCount; i++) {
    const cluster = clusterCenters[i % clusterCenters.length];
    const offset = new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 20,
    );
    const pos = cluster.clone().add(offset);
    const starType = STAR_TYPES[Math.floor(Math.random() * STAR_TYPES.length)];
    const starColor = new THREE.Color(STAR_TYPE_COLORS[starType] || '#ffffff');
    const radius = starType === 'black_hole' ? 0.8 : (starType === 'neutron' ? 0.5 : 0.3 + Math.random() * 0.5);
    const planetCount = Math.floor(Math.random() * 5) + 1;

    stars.push({
      id: `star_${i}`,
      name: STAR_NAMES[i % STAR_NAMES.length],
      position: pos,
      color: starColor,
      radius,
      starType,
      planets: planetCount,
      faction: null,
      factionColor: '#ffffff',
    });

    for (let j = 0; j < planetCount; j++) {
      planets.push({
        id: `planet_${planetCounter}`,
        name: `${STAR_NAMES[i % STAR_NAMES.length]} ${String.fromCharCode(97 + j).toUpperCase()}`,
        starId: `star_${i}`,
        orbitRadius: 1.5 + j * 1.2 + Math.random() * 0.5,
        orbitSpeed: 0.2 + Math.random() * 0.3,
        radius: 0.08 + Math.random() * 0.15,
        color: new THREE.Color(COLORS[Math.floor(Math.random() * COLORS.length)]),
        type: PLANET_TYPES[Math.floor(Math.random() * PLANET_TYPES.length)],
      });
      planetCounter++;
    }
  }

  const hyperlaneCount = Math.floor(starCount * 1.3);
  for (let i = 0; i < hyperlaneCount; i++) {
    const si = Math.floor(Math.random() * starCount);
    let sj = Math.floor(Math.random() * starCount);
    if (sj === si) sj = (si + 1) % starCount;
    const a = stars[si].position;
    const b = stars[sj].position;
    if (a.distanceTo(b) < 35 && !hyperlanes.some(h => h.source === stars[sj].id && h.target === stars[si].id)) {
      hyperlanes.push({ source: stars[si].id, target: stars[sj].id });
    }
  }

  EMPIRE_NAMES.forEach((name, ei) => {
    const color = COLORS[ei % COLORS.length];
    const owned: string[] = [];
    stars.forEach((s, idx) => {
      if (idx % EMPIRE_NAMES.length === ei) {
        s.faction = name;
        s.factionColor = color;
        owned.push(s.id);
      }
    });
    empires.push({ id: `empire_${ei}`, name, color, systems: owned });
  });

  return { stars, hyperlanes, planets, empires };
}
