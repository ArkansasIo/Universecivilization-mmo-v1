import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRegisteredTexture } from '../../../../engine';
import { type StarData } from './galaxyData';

interface FleetData {
  id: string;
  name: string;
  userId: string;
  status: string;
  originStarId: string;
  destinationStarId: string | null;
  missionType: string | null;
  arrivalTime: string | null;
}

interface FleetMarker3DProps {
  fleets: FleetData[];
  starMap: Map<string, StarData>;
  isOwnFleet: (fleet: FleetData) => boolean;
  onClick?: (fleet: FleetData) => void;
  isSelected?: boolean;
}

function FleetIcon({ fleet, starMap, isOwn, onClick }: { fleet: FleetData; starMap: Map<string, StarData>; isOwn: boolean; onClick?: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const originStar = starMap.get(fleet.originStarId);
  const { data: fleetTexture } = useRegisteredTexture('texture.fleet.emissive');

  const position = useMemo(() => {
    if (!originStar) return new THREE.Vector3(0, 0, 0);
    const dest = fleet.destinationStarId ? starMap.get(fleet.destinationStarId) : null;
    if (dest && fleet.status === 'moving') {
      return dest.position.clone().add(originStar.position).multiplyScalar(0.5);
    }
    return originStar.position.clone();
  }, [fleet, originStar, starMap]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 1.5;
      groupRef.current.position.y += Math.sin(performance.now() * 0.005) * 0.003;
    }
  });

  if (!originStar) return null;

  const color = isOwn ? '#38bdf8' : '#f87171';

  return (
    <group ref={groupRef} position={[position.x, position.y + 1, position.z]} onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
      <mesh>
        <coneGeometry args={[0.15, 0.3, 4]} />
        <meshBasicMaterial color={color} map={fleetTexture ?? null} />
      </mesh>
      <mesh position={[0, -0.25, 0]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

export default function FleetMarker3D({ fleets, starMap, isOwnFleet, onClick }: FleetMarker3DProps) {
  if (fleets.length === 0) return null;

  return (
    <group>
      {fleets.map((fleet) => (
        <FleetIcon
          key={fleet.id}
          fleet={fleet}
          starMap={starMap}
          isOwn={isOwnFleet(fleet)}
          onClick={() => onClick?.(fleet)}
        />
      ))}
    </group>
  );
}
