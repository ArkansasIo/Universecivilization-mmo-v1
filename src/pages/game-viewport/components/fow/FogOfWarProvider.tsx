import { createContext, useContext, useState, useCallback, useMemo, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { type StarData } from '../scene/galaxyData';
import { type CameraLevel } from '../camera/cameraTypes';

interface FogOfWarContextType {
  exploredSystems: Set<string>;
  visibleSystems: Set<string>;
  exploreSystem: (starId: string) => void;
  isExplored: (starId: string) => boolean;
  isVisible: (starId: string) => boolean;
  sensorRange: number;
  setSensorRange: (range: number) => void;
}

const FogContext = createContext<FogOfWarContextType>({
  exploredSystems: new Set(),
  visibleSystems: new Set(),
  exploreSystem: () => {},
  isExplored: () => false,
  isVisible: () => false,
  sensorRange: 35,
  setSensorRange: () => {},
});

export function FogOfWarProvider({ children }: { children: ReactNode }) {
  const [exploredSystems, setExplored] = useState<Set<string>>(new Set());
  const [visibleSystems, setVisible] = useState<Set<string>>(new Set());
  const [sensorRange, setSensorRange] = useState(35);

  const exploreSystem = useCallback((starId: string) => {
    setExplored(prev => {
      if (prev.has(starId)) return prev;
      const next = new Set(prev);
      next.add(starId);
      return next;
    });
  }, []);

  const isExplored = useCallback((starId: string) => exploredSystems.has(starId), [exploredSystems]);
  const isVisible = useCallback((starId: string) => visibleSystems.has(starId), [visibleSystems]);

  return (
    <FogContext.Provider value={{ exploredSystems, visibleSystems, exploreSystem, isExplored, isVisible, sensorRange, setSensorRange }}>
      {children}
    </FogContext.Provider>
  );
}

export const useFogOfWar = () => useContext(FogContext);

interface FogOverlay3DProps {
  stars: StarData[];
  cameraLevel: CameraLevel;
  cameraPosition: THREE.Vector3;
}

export function FogOverlay3D({ stars, cameraLevel, cameraPosition }: FogOverlay3DProps) {
  const { exploredSystems, sensorRange } = useFogOfWar();
  const fogRef = useRef<THREE.Mesh>(null);
  const fogPositionsRef = useRef<Float32Array>(new Float32Array());

  const positions = useMemo(() => {
    const unseenStars = stars.filter(s => !exploredSystems.has(s.id));
    if (unseenStars.length === 0) return null;

    const totalParticles = unseenStars.length * 40;
    const pos = new Float32Array(totalParticles * 3);

    for (let si = 0; si < unseenStars.length; si++) {
      const star = unseenStars[si];
      for (let pi = 0; pi < 40; pi++) {
        const idx = (si * 40 + pi) * 3;
        const r = star.radius * 3 + Math.random() * 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[idx] = star.position.x + r * Math.sin(phi) * Math.cos(theta);
        pos[idx + 1] = star.position.y + r * Math.sin(phi) * Math.sin(theta) * 0.5;
        pos[idx + 2] = star.position.z + r * Math.cos(phi);
      }
    }

    fogPositionsRef.current = pos;
    return pos;
  }, [stars, exploredSystems]);

  if (!positions || cameraLevel === 'planet') return null;

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        color="#111122"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
