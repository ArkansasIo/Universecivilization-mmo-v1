import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetConfig {
  name: string;
  radius: number;
  orbitRadius: number;
  color: string;
  speed: number;
  hasRing?: boolean;
  ringColor?: string;
  ringSize?: number;
  type: 'terran' | 'gas' | 'ice' | 'desert' | 'ocean' | 'lava' | 'barren';
}

interface SystemView3DProps {
  position: [number, number, number];
  starColor: string;
  starGlow: string;
  planets: PlanetConfig[];
  starType: string;
  onClose?: () => void;
}

const PLANET_COLORS: Record<string, string> = {
  terran: '#4ade80', gas: '#fbbf24', ice: '#60a5fa',
  desert: '#fb923c', ocean: '#22d3ee', lava: '#f87171', barren: '#9ca3af',
};

function Ring({ planetRadius, ringSize, color }: { planetRadius: number; ringSize: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.2;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI * 0.4, 0, 0]}>
      <ringGeometry args={[planetRadius * 1.4, planetRadius * 1.4 + ringSize, 48]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function Planet({ config }: { config: PlanetConfig }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Line>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  const orbitPoints = useMemo(() => {
    const segments = 64;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(
        Math.cos(theta) * config.orbitRadius,
        0,
        Math.sin(theta) * config.orbitRadius,
      ));
    }
    return pts;
  }, [config.orbitRadius]);

  const color = config.color || PLANET_COLORS[config.type] || '#9ca3af';

  useFrame((_, delta) => {
    if (groupRef.current) {
      angleRef.current += delta * config.speed;
      groupRef.current.position.x = Math.cos(angleRef.current) * config.orbitRadius;
      groupRef.current.position.z = Math.sin(angleRef.current) * config.orbitRadius;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group>
      <line ref={orbitRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(orbitPoints.flatMap(p => [p.x, p.y, p.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.15} depthWrite={false} />
      </line>

      <group ref={groupRef}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[config.radius, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} roughness={0.7} metalness={0.1} />
        </mesh>
        {config.hasRing && (
          <Ring planetRadius={config.radius} ringSize={config.ringSize || 0.3} color={config.ringColor || color} />
        )}
      </group>
    </group>
  );
}

function AsteroidBelt({ orbitRadius, width, count, color }: { orbitRadius: number; width: number; count: number; color: string }) {
  const ref = useRef<THREE.Group>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = orbitRadius + (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * 0.3;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, [orbitRadius, width, count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05;
  });

  return (
    <group ref={ref}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.04} color={color} transparent opacity={0.6} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}

export default function SystemView3D({
  position, starColor, starGlow, planets, starType, onClose,
}: SystemView3DProps) {
  const starRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (starRef.current) starRef.current.rotation.y += delta * 0.1;
    if (glowRef.current) {
      const s = 1 + Math.sin(performance.now() * 0.002) * 0.05;
      glowRef.current.scale.setScalar(s);
    }
  });

  const isBlackHole = starType === 'black_hole';
  const asteroidBelt = useMemo(() => {
    if (planets.length < 3) return null;
    const innerOrbit = planets[2]?.orbitRadius || 6;
    return { orbitRadius: innerOrbit, width: 1.5, count: 800, color: starColor };
  }, [planets, starColor]);

  return (
    <group position={position}>
      {!isBlackHole && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial color={starGlow} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}

      <mesh ref={starRef}>
        <sphereGeometry args={[isBlackHole ? 0.4 : 0.25, isBlackHole ? 32 : 16, 16]} />
        <meshStandardMaterial
          color={starColor}
          emissive={starColor}
          emissiveIntensity={isBlackHole ? 0 : 2.5}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {asteroidBelt && (
        <AsteroidBelt
          orbitRadius={asteroidBelt.orbitRadius}
          width={asteroidBelt.width}
          count={asteroidBelt.count}
          color={starColor}
        />
      )}

      {planets.map((p, i) => (
        <Planet key={i} config={p} />
      ))}

      {onClose && (
        <Html position={[0, -2.5, 0]} center distanceFactor={30}>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-all hover:scale-105"
            style={{ background: 'rgba(2,4,12,0.85)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
          >
            <i className="ri-close-line mr-1"></i>Close System View
          </button>
        </Html>
      )}
    </group>
  );
}

export type { PlanetConfig, SystemView3DProps };
