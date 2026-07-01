import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TerritoryData {
  id: string;
  empireName: string;
  color: string;
  systems: { position: [number, number, number]; name: string }[];
  opacity?: number;
}

interface TerritoryMesh3DProps {
  territories: TerritoryData[];
}

function TerritoryCloud({ territory }: { territory: TerritoryData }) {
  const ref = useRef<THREE.Points>(null);
  const color = new THREE.Color(territory.color);

  const particleData = useMemo(() => {
    if (territory.systems.length === 0) return { positions: new Float32Array(), colors: new Float32Array() };

    const systems = territory.systems;
    const particlesPerSystem = 60;
    const total = systems.length * particlesPerSystem;
    const pos = new Float32Array(total * 3);
    const col = new Float32Array(total * 3);

    for (let si = 0; si < systems.length; si++) {
      const [cx, cy, cz] = systems[si].position;
      for (let pi = 0; pi < particlesPerSystem; pi++) {
        const idx = (si * particlesPerSystem + pi) * 3;
        const r = Math.random() * 2.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[idx] = cx + r * Math.sin(phi) * Math.cos(theta);
        pos[idx + 1] = cy + r * Math.sin(phi) * Math.sin(theta) * 0.5;
        pos[idx + 2] = cz + r * Math.cos(phi);
        const c = color.clone().multiplyScalar(0.4 + Math.random() * 0.6);
        col[idx] = c.r; col[idx + 1] = c.g; col[idx + 2] = c.b;
      }
    }
    return { positions: pos, colors: col };
  }, [territory.systems, territory.color]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.005;
  });

  if (particleData.positions.length === 0) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particleData.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[particleData.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        sizeAttenuation
        transparent
        opacity={territory.opacity ?? 0.25}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function TerritoryBorderLine({ a, b, color }: { a: [number, number, number]; b: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const points = useMemo(() => {
    const mid: [number, number, number] = [
      (a[0] + b[0]) / 2,
      (a[1] + b[1]) / 2,
      (a[2] + b[2]) / 2,
    ];
    const dx = b[0] - a[0];
    const dz = b[2] - a[2];
    const length = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dz, dx);
    return { mid, length, angle };
  }, [a, b]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(performance.now() * 0.003) * 0.002;
    }
  });

  return (
    <mesh
      ref={ref}
      position={[points.mid[0], points.mid[1], points.mid[2]]}
      rotation={[0, -points.angle, 0]}
    >
      <planeGeometry args={[points.length, 0.04]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

export default function TerritoryMesh3D({ territories }: TerritoryMesh3DProps) {
  const borderLines = useMemo(() => {
    const lines: { a: [number, number, number]; b: [number, number, number]; color: string }[] = [];
    for (const t of territories) {
      const systems = t.systems;
      for (let i = 0; i < systems.length - 1; i++) {
        for (let j = i + 1; j < systems.length; j++) {
          const dx = systems[i].position[0] - systems[j].position[0];
          const dz = systems[i].position[2] - systems[j].position[2];
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < 15) {
            lines.push({ a: systems[i].position, b: systems[j].position, color: t.color });
          }
        }
      }
    }
    return lines;
  }, [territories]);

  return (
    <group>
      {territories.map((t) => (
        <TerritoryCloud key={t.id} territory={t} />
      ))}
      {borderLines.map((line, i) => (
        <TerritoryBorderLine key={i} a={line.a} b={line.b} color={line.color} />
      ))}
    </group>
  );
}

export type { TerritoryData, TerritoryMesh3DProps };
