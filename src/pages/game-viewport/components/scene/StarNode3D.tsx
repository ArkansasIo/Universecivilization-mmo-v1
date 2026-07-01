import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRegisteredTexture } from '../../../../engine';
import { type StarData } from './galaxyData';

interface StarNode3DProps {
  star: StarData;
  onClick: (star: StarData) => void;
  isSelected: boolean;
}

export default function StarNode3D({ star, onClick, isSelected }: StarNode3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const spriteRef = useRef<THREE.Sprite>(null);
  const { data: registeredGlowTexture } = useRegisteredTexture('texture.star.glow');

  const proceduralGlowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.6)');
    gradient.addColorStop(0.5, `rgba(${star.color.r * 255},${star.color.g * 255},${star.color.b * 255},0.3)`);
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, [star.color]);

  const glowTexture = registeredGlowTexture ?? proceduralGlowTexture;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  const scale = star.radius * 2;
  const isBH = star.starType === 'black_hole';
  const isNeutron = star.starType === 'neutron';

  return (
    <group
      position={star.position}
      onClick={(e) => { e.stopPropagation(); onClick(star); }}
    >
      {/* Star sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[scale, 16, 16]} />
        <meshBasicMaterial
          color={isBH ? '#000000' : star.color}
          transparent={isBH}
          opacity={isBH ? 0.8 : 1}
        />
      </mesh>

      {/* Black hole accretion disk */}
      {isBH && (
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <ringGeometry args={[scale * 1.5, scale * 3, 32]} />
          <meshBasicMaterial color="#440066" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Neutron star beam */}
      {isNeutron && (
        <mesh>
          <coneGeometry args={[0.1, scale * 4, 8]} />
          <meshBasicMaterial color="#88ddff" transparent opacity={0.3} />
        </mesh>
      )}

      {/* Glow sprite */}
      <sprite ref={spriteRef} scale={[scale * 6, scale * 6, 1]}>
        <spriteMaterial map={glowTexture} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>

      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[scale * 1.8, scale * 2.2, 32]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Faction border ring */}
      {star.faction && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[scale * 2.5, scale * 2.8, 32]} />
          <meshBasicMaterial color={star.factionColor} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
