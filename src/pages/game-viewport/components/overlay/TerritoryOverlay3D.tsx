import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { type EmpireData, type StarData } from '../scene/galaxyData';

interface TerritoryOverlay3DProps {
  empires: EmpireData[];
  stars: StarData[];
  visible: boolean;
}

function TerritoryCloud({ empire, stars }: { empire: EmpireData; stars: StarData[] }) {
  const ref = useRef<THREE.Points>(null);
  const color = new THREE.Color(empire.color);

  const systemPositions = useMemo(() => {
    return empire.systems
      .map(id => stars.find(s => s.id === id))
      .filter((s): s is StarData => s !== undefined)
      .map(s => s.position);
  }, [empire.systems, stars]);

  const particleData = useMemo(() => {
    if (systemPositions.length === 0) return { positions: new Float32Array(), colors: new Float32Array() };

    const particlesPerSystem = 40;
    const total = systemPositions.length * particlesPerSystem;
    const pos = new Float32Array(total * 3);
    const col = new Float32Array(total * 3);

    for (let si = 0; si < systemPositions.length; si++) {
      const p = systemPositions[si];
      for (let pi = 0; pi < particlesPerSystem; pi++) {
        const idx = (si * particlesPerSystem + pi) * 3;
        const r = Math.random() * 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[idx] = p.x + r * Math.sin(phi) * Math.cos(theta);
        pos[idx + 1] = p.y + r * Math.sin(phi) * Math.sin(theta) * 0.5;
        pos[idx + 2] = p.z + r * Math.cos(phi);
        const c = color.clone().multiplyScalar(0.3 + Math.random() * 0.7);
        col[idx] = c.r; col[idx + 1] = c.g; col[idx + 2] = c.b;
      }
    }
    return { positions: pos, colors: col };
  }, [systemPositions, empire.color]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.003;
  });

  if (particleData.positions.length === 0) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particleData.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[particleData.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.2}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function EmpireBorderLine({ a, b, color }: { a: THREE.Vector3; b: THREE.Vector3; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const points = useMemo(() => {
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const length = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dz, dx);
    return { mid, length, angle };
  }, [a, b]);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y += Math.sin(performance.now() * 0.003) * 0.002;
    }
  });

  return (
    <mesh
      ref={ref}
      position={[points.mid.x, points.mid.y, points.mid.z]}
      rotation={[0, -points.angle, 0]}
    >
      <planeGeometry args={[points.length, 0.03]} />
      <meshBasicMaterial color={color} transparent opacity={0.25} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

export default function TerritoryOverlay3D({ empires, stars, visible }: TerritoryOverlay3DProps) {
  const borderLines = useMemo(() => {
    if (!visible) return [];
    const lines: { a: THREE.Vector3; b: THREE.Vector3; color: string }[] = [];
    for (const emp of empires) {
      const positions = emp.systems
        .map(id => stars.find(s => s.id === id))
        .filter((s): s is StarData => s !== undefined)
        .map(s => s.position);
      for (let i = 0; i < positions.length - 1; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const dist = positions[i].distanceTo(positions[j]);
          if (dist < 20) {
            lines.push({ a: positions[i], b: positions[j], color: emp.color });
          }
        }
      }
    }
    return lines;
  }, [empires, stars, visible]);

  if (!visible) return null;

  return (
    <group>
      {empires.map((emp) => (
        <TerritoryCloud key={emp.id} empire={emp} stars={stars} />
      ))}
      {borderLines.map((line, i) => (
        <EmpireBorderLine key={i} a={line.a} b={line.b} color={line.color} />
      ))}
    </group>
  );
}
