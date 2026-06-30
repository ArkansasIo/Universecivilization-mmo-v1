import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRegisteredTexture } from '../../../../engine';

interface Planet3DProps {
  radius: number;
  color: THREE.Color;
  orbitRadius: number;
  orbitSpeed: number;
  onClick: () => void;
  isSelected: boolean;
}

export default function Planet3D({ radius, color, orbitRadius, orbitSpeed, onClick, isSelected }: Planet3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);
  const { data: surfaceTexture } = useRegisteredTexture('texture.planet.surface');

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    angleRef.current += delta * orbitSpeed;
    groupRef.current.position.set(
      Math.cos(angleRef.current) * orbitRadius,
      0,
      Math.sin(angleRef.current) * orbitRadius,
    );
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.01, orbitRadius + 0.01, 32]} />
        <meshBasicMaterial color="#444466" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      <mesh onClick={(e) => { e.stopPropagation(); onClick(); }}>
        <sphereGeometry args={[radius, 12, 12]} />
        <meshStandardMaterial
          color={color}
          map={surfaceTexture ?? null}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[radius * 1.15, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} depthWrite={false} />
      </mesh>

      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.8, radius * 2.2, 16]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
