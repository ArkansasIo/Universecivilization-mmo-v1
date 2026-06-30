import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { type StarData } from '../scene/galaxyData';

interface TradeRouteData {
  id: string;
  sourceStarId: string;
  targetStarId: string;
  color: string;
  volume: number;
}

interface TradeRoute3DProps {
  routes: TradeRouteData[];
  starMap: Map<string, StarData>;
  visible: boolean;
}

function RouteLine({ route, a, b }: { route: TradeRouteData; a: THREE.Vector3; b: THREE.Vector3 }) {
  const lineRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);

  const pulsePos = useMemo(() => {
    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.y += 0.5;
    const segments = 30;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const p = quadraticBezier(a, mid, b, t);
      pts.push(p);
    }
    return { points: pts, mid };
  }, [a, b]);

  useFrame((_, delta) => {
    progressRef.current += delta * 0.3;
    if (progressRef.current > 1) progressRef.current -= 1;
  });

  const color = new THREE.Color(route.color);

  return (
    <group>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(pulsePos.points.flatMap(p => [p.x, p.y, p.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={route.color} transparent opacity={0.15} depthWrite={false} />
      </line>
    </group>
  );
}

function quadraticBezier(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, t: number): THREE.Vector3 {
  const mt = 1 - t;
  return new THREE.Vector3(
    mt * mt * a.x + 2 * mt * t * b.x + t * t * c.x,
    mt * mt * a.y + 2 * mt * t * b.y + t * t * c.y,
    mt * mt * a.z + 2 * mt * t * b.z + t * t * c.z,
  );
}

export default function TradeRoute3D({ routes, starMap, visible }: TradeRoute3DProps) {
  const routeElements = useMemo(() => {
    if (!visible) return null;
    return routes.map((route) => {
      const sourceStar = starMap.get(route.sourceStarId);
      const targetStar = starMap.get(route.targetStarId);
      if (!sourceStar || !targetStar) return null;
      return (
        <RouteLine
          key={route.id}
          route={route}
          a={sourceStar.position}
          b={targetStar.position}
        />
      );
    });
  }, [routes, starMap, visible]);

  if (!visible) return null;

  return <group>{routeElements}</group>;
}
