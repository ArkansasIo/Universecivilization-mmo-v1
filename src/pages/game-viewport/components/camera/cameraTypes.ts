import * as THREE from 'three';

export type CameraLevel = 'galaxy' | 'system' | 'planet';

export interface CameraState {
  level: CameraLevel;
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
  zoom: number;
}

export interface CameraTarget {
  type: 'galaxy' | 'star' | 'planet' | 'fleet';
  id: string;
  position: THREE.Vector3;
  label: string;
}

export const LEVEL_CONFIG: Record<CameraLevel, { distance: number; height: number; fov: number }> = {
  galaxy: { distance: 100, height: 50, fov: 60 },
  system: { distance: 25, height: 12, fov: 45 },
  planet: { distance: 5, height: 3, fov: 35 },
};
