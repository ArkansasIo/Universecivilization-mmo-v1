import { useMemo } from 'react';
import { type CameraLevel } from '../camera/cameraTypes';
import { type StarData, type PlanetData } from './galaxyData';

interface SystemViewWrapper3DProps {
  star: StarData | null;
  planets: PlanetData[];
  cameraLevel: CameraLevel;
}

export default function SystemViewWrapper3D({ star, cameraLevel }: SystemViewWrapper3DProps) {
  if (!star || cameraLevel === 'galaxy') return null;

  const isSystemLevel = cameraLevel === 'system';
  const isPlanetLevel = cameraLevel === 'planet';

  return null;
}
