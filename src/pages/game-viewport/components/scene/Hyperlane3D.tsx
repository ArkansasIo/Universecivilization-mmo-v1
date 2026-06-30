import { useMemo } from 'react';
import * as THREE from 'three';
import { type HyperlaneData, type StarData } from './galaxyData';

interface Hyperlane3DProps {
  hyperlanes: HyperlaneData[];
  stars: StarData[];
}

export default function Hyperlane3D({ hyperlanes, stars }: Hyperlane3DProps) {
  const starMap = useMemo(() => {
    const m = new Map<string, StarData>();
    stars.forEach((s) => m.set(s.id, s));
    return m;
  }, [stars]);

  const geometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];

    hyperlanes.forEach((hl) => {
      const a = starMap.get(hl.source);
      const b = starMap.get(hl.target);
      if (!a || !b) return;

      const mid = a.position.clone().add(b.position).multiplyScalar(0.5);
      mid.y += 1;

      const segments = 20;
      for (let i = 0; i < segments; i++) {
        const t0 = i / segments;
        const t1 = (i + 1) / segments;

        const p0 = quadraticBezier(a.position, mid, b.position, t0);
        const p1 = quadraticBezier(a.position, mid, b.position, t1);

        positions.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);

        const c = new THREE.Color(a.factionColor || '#444466');
        colors.push(c.r, c.g, c.b, c.r, c.g, c.b);
      }
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, [hyperlanes, starMap]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial vertexColors transparent opacity={0.15} depthWrite={false} />
    </lineSegments>
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
