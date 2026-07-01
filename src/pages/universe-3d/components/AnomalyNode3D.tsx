import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { StellarisAnomaly, AnomalyCategory, AnomalyDifficulty } from '@/hooks/useStellarisAnomalies';

interface AnomalyNode3DProps {
  anomaly: StellarisAnomaly;
  getCategoryColor: (cat: AnomalyCategory) => string;
  getDifficultyColor: (diff: AnomalyDifficulty) => string;
  onInvestigate?: (anomalyId: string) => void;
}

const ANOMALY_ICONS: Record<AnomalyCategory, string> = {
  precursor: 'ri-flask-line',
  spatial: 'ri-planet-line',
  biological: 'ri-seedling-line',
  technological: 'ri-microchip-line',
  gravitational: 'ri-contrast-2-line',
  temporal: 'ri-time-line',
  psionic: 'ri-brain-line',
  cosmic: 'ri-star-line',
};

function AnomalyPulseRing({ color, status }: { color: string; status: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    pulseRef.current += delta;
    const s = 1 + Math.sin(pulseRef.current * 2) * 0.3;
    ref.current.scale.setScalar(s);
    (ref.current.material as THREE.MeshBasicMaterial).opacity =
      0.3 + Math.sin(pulseRef.current * 2.5) * 0.2;
  });

  if (status === 'completed' || status === 'failed') return null;

  return (
    <mesh ref={ref}>
      <ringGeometry args={[0.3, 0.4, 24]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

export default function AnomalyNode3D({
  anomaly, getCategoryColor, getDifficultyColor, onInvestigate,
}: AnomalyNode3DProps) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const color = getCategoryColor(anomaly.category);

  const statusColor = useMemo(() => {
    switch (anomaly.status) {
      case 'discovered': return '#60a5fa';
      case 'investigating': return '#fbbf24';
      case 'completed': return '#4ade80';
      case 'failed': return '#f87171';
      default: return '#6b7280';
    }
  }, [anomaly.status]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y += Math.sin(performance.now() * 0.004) * 0.002;
    }
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.5;
      coreRef.current.rotation.y += delta * 0.8;
    }
  });

  const pos = [anomaly.position.x, anomaly.position.y, anomaly.position.z] as const;

  return (
    <group ref={groupRef} position={pos}>
      <AnomalyPulseRing color={color} status={anomaly.status} />

      <mesh
        ref={coreRef}
        onClick={(e) => { e.stopPropagation(); onInvestigate?.(anomaly.id); }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <octahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={2}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      {hovered && (
        <Html position={[0, 0.4, 0]} center distanceFactor={40}>
          <div
            className="px-3 py-2 rounded-xl text-xs min-w-[200px]"
            style={{ background: 'rgba(2,4,12,0.95)', border: `1px solid ${color}50`, backdropFilter: 'blur(8px)' }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: statusColor }}></span>
              <p className="font-bold text-white">{anomaly.name}</p>
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded capitalize"
                style={{ background: `${getDifficultyColor(anomaly.difficulty)}20`, color: getDifficultyColor(anomaly.difficulty) }}>
                {anomaly.difficulty}
              </span>
            </div>
            <p className="text-gray-400 mb-1.5">{anomaly.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded capitalize"
                style={{ background: `${color}20`, color }}>
                <i className={`${ANOMALY_ICONS[anomaly.category]} mr-1`}></i>
                {anomaly.category}
              </span>
              <span className="text-gray-500 text-[10px]">{anomaly.systemName}</span>
            </div>
            {anomaly.status === 'completed' && anomaly.outcome && (
              <div className="mt-2 pt-2 border-t border-white/10">
                <p className="text-green-400 text-[10px]">
                  <i className="ri-check-line mr-1"></i>{anomaly.outcome.description}
                </p>
              </div>
            )}
            {anomaly.status === 'discovered' && (
              <button
                onClick={(e) => { e.stopPropagation(); onInvestigate?.(anomaly.id); }}
                className="mt-2 w-full py-1 rounded text-[10px] font-semibold cursor-pointer transition-all hover:scale-105"
                style={{ background: `${color}30`, border: `1px solid ${color}60`, color }}
              >
                <i className="ri-search-line mr-1"></i>Investigate Anomaly
              </button>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

export type { AnomalyNode3DProps };
