import { useRef, useMemo, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { type CameraLevel, type CameraTarget, LEVEL_CONFIG } from './cameraTypes';

interface CameraControllerProps {
  level: CameraLevel;
  target: CameraTarget | null;
  onLevelChange: (level: CameraLevel) => void;
}

const TRANSITION_DURATION = 1.2;

export default function CameraController({ level, target, onLevelChange }: CameraControllerProps) {
  const { camera, gl } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;
  const stateRef = useRef({
    progress: 1,
    startPos: new THREE.Vector3(),
    endPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    startFov: 60,
    endFov: 60,
    isTransitioning: false,
    orbitTheta: 0,
    orbitPhi: Math.PI / 4,
    orbitRadius: 100,
    level: level as CameraLevel,
  });
  const currentTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const mouseRef = useRef({ x: 0, y: 0, button: -1 });
  const isOrbitingRef = useRef(false);

  useEffect(() => {
    const canvas = gl.domElement;
    const onMouseDown = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, button: e.button };
      if (e.button === 2) isOrbitingRef.current = true;
    };
    const onMouseUp = () => { isOrbitingRef.current = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isOrbitingRef.current) return;
      const dx = e.clientX - mouseRef.current.x;
      const dy = e.clientY - mouseRef.current.y;
      mouseRef.current = { x: e.clientX, y: e.clientY, button: -1 };
      const s = level === 'galaxy' ? 0.008 : 0.012;
      stateRef.current.orbitTheta -= dx * s;
      stateRef.current.orbitPhi = Math.max(0.1, Math.min(Math.PI / 2.2, stateRef.current.orbitPhi + dy * s));
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const s = stateRef.current;
      const cfg = LEVEL_CONFIG[level];
      const minR = level === 'galaxy' ? 30 : (level === 'system' ? 8 : 2);
      const maxR = level === 'galaxy' ? 250 : (level === 'system' ? 60 : 15);
      s.orbitRadius = Math.max(minR, Math.min(maxR, s.orbitRadius + e.deltaY * 0.08));
    };
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [gl, level]);

  const startTransition = useCallback((newLevel: CameraLevel, newTarget: THREE.Vector3) => {
    const s = stateRef.current;
    s.startPos.copy(camera.position);
    s.startTarget.copy(currentTargetRef.current);
    s.startFov = perspectiveCamera.fov;
    s.progress = 0;
    s.isTransitioning = true;
    s.level = newLevel;
    currentTargetRef.current.copy(newTarget);

    const cfg = LEVEL_CONFIG[newLevel];
    s.orbitRadius = cfg.distance;
    s.orbitPhi = Math.PI / 4;
    s.orbitTheta = 0;
    const endPos = new THREE.Vector3(
      newTarget.x + cfg.distance * Math.sin(Math.PI / 4) * Math.cos(0),
      newTarget.y + cfg.height,
      newTarget.z + cfg.distance * Math.sin(Math.PI / 4) * Math.sin(0),
    );
    s.endPos.copy(endPos);
    s.endTarget.copy(newTarget);
    s.endFov = cfg.fov;
  }, [camera, perspectiveCamera]);

  useEffect(() => {
    if (target) {
      startTransition(level, target.position);
    }
  }, [level, target, startTransition]);

  useFrame((_, delta) => {
    const s = stateRef.current;

    if (s.isTransitioning) {
      s.progress += delta / TRANSITION_DURATION;
      if (s.progress >= 1) {
        s.progress = 1;
        s.isTransitioning = false;
      }
      const t = smoothstep(s.progress);
      camera.position.lerpVectors(s.startPos, s.endPos, t);
      currentTargetRef.current.lerpVectors(s.startTarget, s.endTarget, t);
      perspectiveCamera.fov = s.startFov + (s.endFov - s.startFov) * t;
      camera.lookAt(currentTargetRef.current);
      perspectiveCamera.updateProjectionMatrix();
      return;
    }

    const targetPt = currentTargetRef.current;
    const theta = s.orbitTheta;
    const phi = s.orbitPhi;
    const r = s.orbitRadius;

    const desired = new THREE.Vector3(
      targetPt.x + r * Math.sin(phi) * Math.cos(theta),
      targetPt.y + r * Math.cos(phi),
      targetPt.z + r * Math.sin(phi) * Math.sin(theta),
    );

    camera.position.lerp(desired, 0.08);
    currentTargetRef.current.lerp(targetPt, 0.08);
    camera.lookAt(currentTargetRef.current);
    perspectiveCamera.updateProjectionMatrix();
  });

  return null;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}
