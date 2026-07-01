import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function StarPoints({ count = 6000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 50 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const brightness = 0.3 + Math.random() * 0.7;
      const tint = Math.random();
      if (tint < 0.1) {
        col[i * 3] = brightness; col[i * 3 + 1] = brightness * 0.8; col[i * 3 + 2] = brightness * 0.6;
      } else if (tint < 0.2) {
        col[i * 3] = brightness * 0.7; col[i * 3 + 1] = brightness * 0.8; col[i * 3 + 2] = brightness;
      } else {
        col[i * 3] = brightness; col[i * 3 + 1] = brightness; col[i * 3 + 2] = brightness;
      }
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.005;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.4}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function NebulaClouds() {
  const clouds = useMemo(() => {
    const result: { pos: [number, number, number]; color: string; scale: number }[] = [];
    for (let i = 0; i < 8; i++) {
      result.push({
        pos: [
          (Math.random() - 0.5) * 150,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 150 - 50,
        ],
        color: ['#4a0080', '#001a80', '#800020', '#00804a', '#804a00'][Math.floor(Math.random() * 5)],
        scale: 30 + Math.random() * 60,
      });
    }
    return result;
  }, []);

  return (
    <group>
      {clouds.map((c, i) => (
        <mesh key={i} position={c.pos}>
          <sphereGeometry args={[c.scale, 16, 16]} />
          <meshBasicMaterial
            color={c.color}
            transparent
            opacity={0.04}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function StarField() {
  return (
    <Canvas
      camera={{ position: [0, 0, 80], fov: 60, near: 0.1, far: 500 }}
      gl={{ antialias: false, alpha: false }}
      style={{ background: '#05070a' }}
    >
      <StarPoints count={8000} />
      <NebulaClouds />
    </Canvas>
  );
}
