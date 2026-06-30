import { useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { type CameraLevel } from '../camera/cameraTypes';
import { type StarData, type PlanetData, type EmpireData } from './galaxyData';

interface AdaptiveLabels3DProps {
  stars: StarData[];
  planets: PlanetData[];
  empires: EmpireData[];
  starMap: Map<string, StarData>;
  cameraLevel: CameraLevel;
}

export default function AdaptiveLabels3D({ stars, starMap, cameraLevel }: AdaptiveLabels3DProps) {
  const showStarNames = cameraLevel === 'galaxy' || cameraLevel === 'system';
  const showPlanetNames = cameraLevel === 'planet';
  const showSystemDetail = cameraLevel === 'system' || cameraLevel === 'planet';

  const starLabels = useMemo(() => {
    if (!showStarNames) return null;

    return stars.map((star) => {
      const label = showSystemDetail
        ? `${star.name}${star.faction ? ` · ${star.faction}` : ''}`
        : star.name;

      return (
        <Html key={star.id} position={star.position} center distanceFactor={cameraLevel === 'galaxy' ? 60 : 25}>
          <div
            style={{
              color: star.faction ? star.factionColor : '#aabbcc',
              fontSize: cameraLevel === 'galaxy' ? '9px' : '10px',
              fontFamily: 'monospace',
              fontWeight: 600,
              textShadow: '0 0 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.7)',
              background: 'rgba(0,0,0,0.4)',
              padding: '2px 6px',
              borderRadius: '3px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {label}
          </div>
        </Html>
      );
    });
  }, [stars, showStarNames, showSystemDetail, cameraLevel]);

  return <>{starLabels}</>;
}
