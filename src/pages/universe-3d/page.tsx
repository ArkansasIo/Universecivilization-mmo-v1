import { useState, useRef, useMemo, useCallback, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Html, PerspectiveCamera, Line } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { supabase } from '@/lib/supabase';
import * as THREE from 'three';

// ────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────
interface GalaxyData {
  id: string;
  name: string;
  type: 'spiral' | 'elliptical' | 'irregular' | 'barred-spiral';
  position: [number, number, number];
  color: string;
  arms: number;
  size: number;
  starCount: string;
  planets: string;
  faction: string;
  factionColor: string;
  explored: string;
  dangerLevel: number;
  resources: string[];
}

interface SystemNode {
  id: string;
  name: string;
  position: [number, number, number];
  starType: 'G' | 'K' | 'M' | 'F' | 'A' | 'B' | 'O' | 'red_giant' | 'blue_giant' | 'neutron' | 'black_hole';
  planets: number;
  habitable: number;
  faction: string | null;
  factionColor: string;
}

// ────────────────────────────────────────────────────────────
// FLEET MARKER DATA TYPE
// ────────────────────────────────────────────────────────────
interface FleetPosition {
  id: number;
  name: string;
  mission: string;
  destGalaxy: number;
  destSystem: number;
  destPlanet: number;
  totalShips: number;
  position3d: [number, number, number];
  progress: number; // 0-1 travel progress
}

const MISSION_COLORS: Record<string, string> = {
  attack: '#f87171', harvest: '#4ade80', colonize: '#60a5fa',
  spy: '#a78bfa', transport: '#fbbf24', explore: '#34d399',
};
const MISSION_ICONS: Record<string, string> = {
  attack: 'ri-sword-line', harvest: 'ri-recycle-line', colonize: 'ri-flag-line',
  spy: 'ri-eye-line', transport: 'ri-ship-line', explore: 'ri-compass-3-line',
};

// ────────────────────────────────────────────────────────────
// CINEMATIC AUTO-TOUR CAMERA
// ────────────────────────────────────────────────────────────
function CinematicCamera({
  active,
  onComplete,
  onInterrupt,
}: {
  active: boolean;
  onComplete: () => void;
  onInterrupt: () => void;
}) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);
  const progressRef = useRef(0);
  const startTimeRef = useRef(0);
  const startPosRef = useRef(new THREE.Vector3());
  const startTargetRef = useRef(new THREE.Vector3());
  const totalDurationRef = useRef(45); // seconds

  const waypoints = useMemo(() => {
    const wp: { pos: THREE.Vector3; lookAt: THREE.Vector3; pause: number }[] = [
      // 1. Start high, looking down at all galaxies
      { pos: new THREE.Vector3(0, 60, 80), lookAt: new THREE.Vector3(0, 0, -5), pause: 0 },
      // 2. Sweep right toward Andromeda
      { pos: new THREE.Vector3(-30, 25, -40), lookAt: new THREE.Vector3(-25, 5, -30), pause: 3 },
      // 3. Fly through Andromeda toward Milky Way
      { pos: new THREE.Vector3(5, -2, -25), lookAt: new THREE.Vector3(20, -8, -20), pause: 3 },
      // 4. Rise above Orion Frontier
      { pos: new THREE.Vector3(15, 35, -50), lookAt: new THREE.Vector3(15, 25, -40), pause: 2 },
      // 5. Dive through Triangulum
      { pos: new THREE.Vector3(-15, -15, 20), lookAt: new THREE.Vector3(-20, -12, 15), pause: 3 },
      // 6. Sweep to Draco Void
      { pos: new THREE.Vector3(-40, -25, -5), lookAt: new THREE.Vector3(-35, -20, -10), pause: 3 },
      // 7. Rise to Centaurus
      { pos: new THREE.Vector3(35, 20, -40), lookAt: new THREE.Vector3(30, 15, -35), pause: 3 },
      // 8. Fly to Phoenix Nebula
      { pos: new THREE.Vector3(5, 30, 30), lookAt: new THREE.Vector3(5, 20, 25), pause: 3 },
      // 9. End at Pegasus Reach, looking back
      { pos: new THREE.Vector3(-10, -35, 40), lookAt: new THREE.Vector3(-5, -30, 30), pause: 0 },
    ];
    return wp;
  }, []);

  const totalWaypointTime = waypoints.reduce((sum, w) => sum + w.pause + 4, 0); // ~4s travel + pause per segment

  useEffect(() => {
    if (!active) return;
    progressRef.current = 0;
    startTimeRef.current = performance.now() / 1000;
    const wp0 = waypoints[0];
    startPosRef.current.copy(wp0.pos);
    startTargetRef.current.copy(wp0.lookAt);
    
    camera.position.copy(wp0.pos);
    camera.lookAt(wp0.lookAt);
    totalDurationRef.current = totalWaypointTime;
  }, [active, camera, waypoints, totalWaypointTime]);

  useFrame(() => {
    if (!active) return;

    const elapsed = performance.now() / 1000 - startTimeRef.current;
    const progress = Math.min(elapsed / totalDurationRef.current, 1);
    progressRef.current = progress;

    // Find current waypoint segment
    let accumulatedTime = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      const segmentDuration = 4; // travel time per segment
      const segStart = accumulatedTime / totalDurationRef.current;
      accumulatedTime += segmentDuration + waypoints[i].pause;
      const segEnd = accumulatedTime / totalDurationRef.current;

      if (progress >= segStart && progress < segEnd) {
        // In this travel segment
        const travelStart = (accumulatedTime - segmentDuration - waypoints[i].pause) / totalDurationRef.current;
        const t = (progress - travelStart) / (segmentDuration / totalDurationRef.current);
        const tEased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad

        const from = waypoints[i];
        const to = waypoints[i + 1];
        camera.position.lerpVectors(from.pos, to.pos, tEased);

        const lookTarget = new THREE.Vector3().lerpVectors(from.lookAt, to.lookAt, tEased);
        camera.lookAt(lookTarget);
        return;
      }
    }

    // At end
    if (progress >= 1) {
      const last = waypoints[waypoints.length - 1];
      camera.position.copy(last.pos);
      camera.lookAt(last.lookAt);
      onComplete();
    }
  });

  // Listen for user interaction to interrupt
  useEffect(() => {
    if (!active) return;
    const domElement = gl.domElement;

    const interrupt = () => {
      onInterrupt();
    };

    domElement.addEventListener('pointerdown', interrupt, { once: true });
    domElement.addEventListener('wheel', interrupt, { once: true });

    return () => {
      domElement.removeEventListener('pointerdown', interrupt);
      domElement.removeEventListener('wheel', interrupt);
    };
  }, [active, gl, onInterrupt]);

  return null;
}

// ────────────────────────────────────────────────────────────
// FLEET 3D MARKER
// ────────────────────────────────────────────────────────────
function FleetMarker3D({ fleet, onClick }: { fleet: FleetPosition; onClick: (f: FleetPosition) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const color = MISSION_COLORS[fleet.mission] || '#fbbf24';
  const icon = MISSION_ICONS[fleet.mission] || 'ri-ship-line';

  useFrame((_, delta) => {
    if (pulseRef.current) {
      const s = 1 + Math.sin(performance.now() * 0.004) * 0.3;
      pulseRef.current.scale.setScalar(s);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.3 + Math.sin(performance.now() * 0.005) * 0.2;
    }
    // Subtle bobbing
    if (groupRef.current) {
      groupRef.current.position.y += Math.sin(performance.now() * 0.003 + fleet.id) * 0.001;
    }
  });

  return (
    <group ref={groupRef} position={fleet.position3d}>
      {/* Pulse ring */}
      <mesh ref={pulseRef}>
        <ringGeometry args={[0.5, 0.65, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Core marker */}
      <mesh
        onClick={(e) => { e.stopPropagation(); onClick(fleet); }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} roughness={0.2} metalness={0.5} />
      </mesh>

      {/* Direction indicator */}
      <mesh position={[0, 0.45, 0]}>
        <coneGeometry args={[0.12, 0.3, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} roughness={0.3} />
      </mesh>

      {/* Label on hover */}
      {hovered && (
        <Html position={[0, 0.7, 0]} center distanceFactor={50}>
          <div className="px-2 py-1 rounded text-xs whitespace-nowrap" style={{ background: 'rgba(2,4,12,0.9)', border: `1px solid ${color}50` }}>
            <p className="font-bold text-white flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }}></span>
              {fleet.name}
            </p>
            <p className="text-gray-400 mt-0.5">
              <i className={`${icon} mr-1`}></i>
              {fleet.mission} · {fleet.totalShips} ships
            </p>
            <div className="mt-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-1 rounded-full transition-all" style={{ width: `${Math.round(fleet.progress * 100)}%`, background: color }} />
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// ────────────────────────────────────────────────────────────
// FLEET MARKERS CONTAINER
// ────────────────────────────────────────────────────────────
function FleetMarkers({ onClick }: { onClick: (f: FleetPosition) => void }) {
  const [fleets, setFleets] = useState<FleetPosition[]>([]);

  // Map DB galaxy index (1-8) to our 3D positions
  const galaxyPositions = useMemo(() => {
    const map = new Map<number, [number, number, number]>();
    GALAXIES.forEach((g, i) => map.set(i + 1, g.position));
    return map;
  }, []);

  useEffect(() => {
    const fetchFleets = async () => {
      const { data, error } = await supabase
        .from('fleets')
        .select('id, name, mission, status, dest_galaxy, dest_system, dest_planet, total_ships, departure_time, arrival_time')
        .eq('status', 'moving')
        .order('arrival_time', { ascending: true })
        .limit(20);

      if (error || !data) return;

      const now = Date.now();
      const positions: FleetPosition[] = data.map((f: any) => {
        const gIdx = (f.dest_galaxy || 1);
        const basePos = galaxyPositions.get(gIdx) || [0, 0, 0];

        // Offset based on dest_system to spread multiple fleets around the galaxy
        const sysOffset = ((f.dest_system || 100) % 37) * 0.4;
        const planetOffset = ((f.dest_planet || 1) % 13) * 0.25;
        const angle = ((f.dest_system || 100) * 0.618) * Math.PI * 2;
        const radius = 2 + sysOffset * 0.3;

        const pos3d: [number, number, number] = [
          basePos[0] + Math.cos(angle) * radius,
          basePos[1] + (planetOffset - 1.5) * 0.6,
          basePos[2] + Math.sin(angle) * radius,
        ];

        // Calculate travel progress
        const depTime = f.departure_time ? new Date(f.departure_time).getTime() : now - 3600000;
        const arrTime = f.arrival_time ? new Date(f.arrival_time).getTime() : now + 3600000;
        const progress = Math.max(0, Math.min(1, (now - depTime) / (arrTime - depTime)));

        return {
          id: f.id,
          name: f.name || 'Unknown Fleet',
          mission: f.mission || 'transport',
          destGalaxy: f.dest_galaxy || 1,
          destSystem: f.dest_system || 100,
          destPlanet: f.dest_planet || 1,
          totalShips: f.total_ships || 0,
          position3d: pos3d,
          progress,
        };
      });

      setFleets(positions);
    };

    fetchFleets();
    // Refresh every 15 seconds
    const interval = setInterval(fetchFleets, 15000);
    return () => clearInterval(interval);
  }, [galaxyPositions]);

  return (
    <>
      {fleets.map((f) => (
        <FleetMarker3D key={f.id} fleet={f} onClick={onClick} />
      ))}
    </>
  );
}

// ────────────────────────────────────────────────────────────
// GALAXY DATA
// ────────────────────────────────────────────────────────────
const GALAXIES: GalaxyData[] = [
  {
    id: 'g1', name: 'Andromeda Prime', type: 'spiral', position: [-25, 5, -30],
    color: '#4488ff', arms: 4, size: 16,
    starCount: '5,000,000', planets: '25,000', faction: 'Stellar Empire',
    factionColor: '#f87171', explored: '45%', dangerLevel: 4,
    resources: ['Metal', 'Crystal', 'Deuterium'],
  },
  {
    id: 'g2', name: 'Milky Way Nexus', type: 'barred-spiral', position: [20, -8, -20],
    color: '#ffaa44', arms: 5, size: 18,
    starCount: '4,500,000', planets: '22,500', faction: 'Void Collective',
    factionColor: '#a78bfa', explored: '62%', dangerLevel: 3,
    resources: ['Metal', 'Crystal', 'Dark Matter'],
  },
  {
    id: 'g3', name: 'Triangulum Expanse', type: 'spiral', position: [-20, -12, 15],
    color: '#44ccff', arms: 3, size: 12,
    starCount: '3,800,000', planets: '19,000', faction: 'Iron Federation',
    factionColor: '#60a5fa', explored: '38%', dangerLevel: 6,
    resources: ['Crystal', 'Antimatter', 'Exotic Matter'],
  },
  {
    id: 'g4', name: 'Centaurus Cluster', type: 'elliptical', position: [30, 15, -35],
    color: '#ffcc44', arms: 0, size: 20,
    starCount: '5,200,000', planets: '26,000', faction: 'Merchant Guild',
    factionColor: '#fbbf24', explored: '28%', dangerLevel: 7,
    resources: ['Deuterium', 'Dark Matter', 'Antimatter'],
  },
  {
    id: 'g5', name: 'Phoenix Nebula', type: 'irregular', position: [5, 20, 25],
    color: '#ff6688', arms: 0, size: 10,
    starCount: '2,900,000', planets: '14,500', faction: 'Nomad Clans',
    factionColor: '#34d399', explored: '71%', dangerLevel: 5,
    resources: ['Metal', 'Deuterium', 'Exotic Matter'],
  },
  {
    id: 'g6', name: 'Draco Void', type: 'spiral', position: [-35, -20, -10],
    color: '#8844ff', arms: 6, size: 14,
    starCount: '4,100,000', planets: '20,500', faction: 'Shadow Syndicate',
    factionColor: '#f472b6', explored: '19%', dangerLevel: 9,
    resources: ['Dark Matter', 'Antimatter', 'Void Crystals'],
  },
  {
    id: 'g7', name: 'Orion Frontier', type: 'barred-spiral', position: [15, 25, -40],
    color: '#ff8844', arms: 4, size: 15,
    starCount: '4,700,000', planets: '23,500', faction: 'Celestial Order',
    factionColor: '#38bdf8', explored: '54%', dangerLevel: 4,
    resources: ['Metal', 'Crystal', 'Deuterium'],
  },
  {
    id: 'g8', name: 'Pegasus Reach', type: 'spiral', position: [-5, -30, 30],
    color: '#44ff88', arms: 3, size: 11,
    starCount: '3,300,000', planets: '16,500', faction: 'Free Worlds',
    factionColor: '#a3e635', explored: '42%', dangerLevel: 6,
    resources: ['Crystal', 'Dark Matter', 'Exotic Matter'],
  },
];

// ────────────────────────────────────────────────────────────
// STAR TYPE CONFIG
// ────────────────────────────────────────────────────────────
const STAR_COLORS: Record<string, string> = {
  G: '#ffe066', K: '#ffb347', M: '#ff6666', F: '#fffde7', A: '#e0e8ff',
  B: '#90caf9', O: '#4fc3f7', red_giant: '#ff4500', blue_giant: '#00b4d8',
  neutron: '#adb5bd', black_hole: '#000000',
};
const STAR_GLOW: Record<string, string> = {
  G: '#ffd000', K: '#ff8c00', M: '#ff3333', F: '#ffffcc', A: '#b0c4ff',
  B: '#42a5f5', O: '#0288d1', red_giant: '#cc2200', blue_giant: '#0077b6',
  neutron: '#6c757d', black_hole: '#ff8c00',
};

// ────────────────────────────────────────────────────────────
// DEEP SPACE STARFIELD (background)
// ────────────────────────────────────────────────────────────
function DeepSpaceStarfield() {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors, sizes } = useMemo(() => {
    const count = 8000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const starPalette = [
      new THREE.Color('#ffffff'), new THREE.Color('#ffe8c0'),
      new THREE.Color('#c0d8ff'), new THREE.Color('#ffd0d0'),
      new THREE.Color('#d0ffd8'), new THREE.Color('#e8d0ff'),
    ];
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 200;
      pos[i3 + 1] = (Math.random() - 0.5) * 200;
      pos[i3 + 2] = (Math.random() - 0.5) * 200;
      const c = starPalette[Math.floor(Math.random() * starPalette.length)];
      col[i3] = c.r; col[i3 + 1] = c.g; col[i3 + 2] = c.b;
      siz[i] = Math.random() * 0.15 + 0.02;
    }
    return { positions: pos, colors: col, sizes: siz };
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial size={0.12} vertexColors sizeAttenuation transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// ────────────────────────────────────────────────────────────
// SPIRAL GALAXY PARTICLE SYSTEM
// ────────────────────────────────────────────────────────────
function SpiralGalaxy({ data, onClick }: { data: GalaxyData; onClick: (g: GalaxyData) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const galaxyColor = new THREE.Color(data.color);

  const { armParticles, bulgeParticles, haloParticles } = useMemo(() => {
    if (data.type === 'elliptical') {
      // Elliptical: dense sphere of particles with slight flattening
      const count = 6000;
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const siz = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const r = Math.pow(Math.random(), 0.6) * data.size;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[i3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4;
        pos[i3 + 2] = r * Math.cos(phi);
        const mix = r / data.size;
        const c = new THREE.Color().lerpColors(
          new THREE.Color('#fff4cc'), galaxyColor, mix * 0.6
        );
        col[i3] = c.r; col[i3 + 1] = c.g; col[i3 + 2] = c.b;
        siz[i] = (1 - mix) * 0.25 + 0.04;
      }
      return { armParticles: null, bulgeParticles: { pos, col, siz }, haloParticles: null };
    }

    if (data.type === 'irregular') {
      // Irregular: scattered blob
      const count = 4000;
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const siz = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const r = Math.random() * data.size;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const spreadX = (Math.random() - 0.5) * data.size * 0.6;
        const spreadY = (Math.random() - 0.5) * data.size * 0.3;
        pos[i3] = r * Math.sin(phi) * Math.cos(theta) + spreadX;
        pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4 + spreadY;
        pos[i3 + 2] = r * Math.cos(phi);
        const c = new THREE.Color().lerpColors(
          new THREE.Color('#fff4e0'), galaxyColor, Math.random() * 0.5
        );
        col[i3] = c.r; col[i3 + 1] = c.g; col[i3 + 2] = c.b;
        siz[i] = Math.random() * 0.2 + 0.03;
      }
      return { armParticles: null, bulgeParticles: { pos, col, siz }, haloParticles: null };
    }

    // Spiral / Barred-Spiral
    const armCount = data.arms;
    const particlesPerArm = 2000;
    const totalArmParticles = armCount * particlesPerArm;
    const armPos = new Float32Array(totalArmParticles * 3);
    const armCol = new Float32Array(totalArmParticles * 3);
    const armSiz = new Float32Array(totalArmParticles);

    const barLength = data.type === 'barred-spiral' ? data.size * 0.3 : 0;

    for (let arm = 0; arm < armCount; arm++) {
      const armAngle = (arm / armCount) * Math.PI * 2;
      const base = arm * particlesPerArm;

      for (let j = 0; j < particlesPerArm; j++) {
        const idx = (base + j) * 3;
        const t = j / particlesPerArm;
        const radius = t * data.size;
        const spiralAngle = armAngle + t * Math.PI * 2.5;
        const scatter = (1 - t) * 0.3 + Math.random() * 0.7;

        let px = Math.cos(spiralAngle) * radius + (Math.random() - 0.5) * scatter * data.size * 0.15;
        let py = (Math.random() - 0.5) * scatter * 0.06 * data.size;
        let pz = Math.sin(spiralAngle) * radius + (Math.random() - 0.5) * scatter * data.size * 0.15;

        // Bar for barred-spiral
        if (barLength > 0 && t < 0.3) {
          const barT = t / 0.3;
          px = Math.cos(armAngle) * barLength * barT + (Math.random() - 0.5) * 0.8;
          pz = Math.sin(armAngle) * barLength * barT + (Math.random() - 0.5) * 0.8;
        }

        armPos[idx] = px;
        armPos[idx + 1] = py;
        armPos[idx + 2] = pz;

        const c = new THREE.Color().lerpColors(
          new THREE.Color('#fff4cc'),
          galaxyColor,
          t * 0.7
        );
        armCol[idx] = c.r; armCol[idx + 1] = c.g; armCol[idx + 2] = c.b;
        armSiz[base + j] = (1 - t * 0.7) * 0.18 + 0.03;
      }
    }

    // Bulge
    const bulgeCount = 1500;
    const bulgePos = new Float32Array(bulgeCount * 3);
    const bulgeCol = new Float32Array(bulgeCount * 3);
    const bulgeSiz = new Float32Array(bulgeCount);
    for (let i = 0; i < bulgeCount; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 2) * data.size * 0.35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      bulgePos[i3] = r * Math.sin(phi) * Math.cos(theta);
      bulgePos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.3;
      bulgePos[i3 + 2] = r * Math.cos(phi);
      const c = new THREE.Color().lerpColors(
        new THREE.Color('#ffffff'), galaxyColor, r / (data.size * 0.35) * 0.4
      );
      bulgeCol[i3] = c.r; bulgeCol[i3 + 1] = c.g; bulgeCol[i3 + 2] = c.b;
      bulgeSiz[i] = Math.random() * 0.2 + 0.05;
    }

    // Halo
    const haloCount = 800;
    const haloPos = new Float32Array(haloCount * 3);
    const haloCol = new Float32Array(haloCount * 3);
    const haloSiz = new Float32Array(haloCount);
    for (let i = 0; i < haloCount; i++) {
      const i3 = i * 3;
      const r = data.size * 0.6 + Math.random() * data.size * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      haloPos[i3] = r * Math.sin(phi) * Math.cos(theta);
      haloPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.15;
      haloPos[i3 + 2] = r * Math.cos(phi);
      const c = galaxyColor.clone().multiplyScalar(0.5 + Math.random() * 0.3);
      haloCol[i3] = c.r; haloCol[i3 + 1] = c.g; haloCol[i3 + 2] = c.b;
      haloSiz[i] = Math.random() * 0.06 + 0.01;
    }

    return {
      armParticles: { pos: armPos, col: armCol, siz: armSiz },
      bulgeParticles: { pos: bulgePos, col: bulgeCol, siz: bulgeSiz },
      haloParticles: { pos: haloPos, col: haloCol, siz: haloSiz },
    };
  }, [data]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.015;
  });

  const makePoints = (particles: { pos: Float32Array; col: Float32Array; siz: Float32Array } | null, size: number, key: string) => {
    if (!particles) return null;
    return (
      <points key={key}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles.pos, 3]} />
          <bufferAttribute attach="attributes-color" args={[particles.col, 3]} />
        </bufferGeometry>
        <pointsMaterial size={size} vertexColors sizeAttenuation transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    );
  };

  return (
    <group ref={groupRef} position={data.position}>
      {/* Main star particles */}
      {makePoints(armParticles, 0.25, 'arms')}
      {makePoints(bulgeParticles, 0.18, 'bulge')}
      {makePoints(haloParticles, 0.08, 'halo')}

      {/* Central glow */}
      <mesh>
        <sphereGeometry args={[data.size * 0.15, 32, 32]} />
        <meshBasicMaterial color={data.color} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Name label */}
      <Html position={[0, data.size * 0.6, 0]} center distanceFactor={80} occlude={false}>
        <div
          className="flex flex-col items-center cursor-pointer select-none group"
          onClick={(e) => { e.stopPropagation(); onClick(data); }}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <p className={`text-xs font-bold whitespace-nowrap transition-all ${hovered ? 'text-white text-sm' : 'text-gray-300'}`}
            style={{ textShadow: hovered ? `0 0 10px ${data.color}, 0 0 20px ${data.color}` : 'none' }}>
            {data.name}
          </p>
          <p className="text-xs opacity-60" style={{ color: data.color }}>
            {data.type.replace('-', ' ')}
          </p>
        </div>
      </Html>
    </group>
  );
}

// ────────────────────────────────────────────────────────────
// NEBULA CLOUD
// ────────────────────────────────────────────────────────────
function NebulaCloud({ position, color, size }: { position: [number, number, number]; color: string; size: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const count = 1200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const base = new THREE.Color(color);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 1.5) * size;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);
      const c = base.clone().multiplyScalar(0.3 + Math.random() * 0.7);
      col[i3] = c.r; col[i3 + 1] = c.g; col[i3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, [color, size]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.003;
      ref.current.rotation.z += delta * 0.005;
    }
  });

  return (
    <points ref={ref} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.5} vertexColors sizeAttenuation transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// ────────────────────────────────────────────────────────────
// SYSTEM NODE (clickable star)
// ────────────────────────────────────────────────────────────
function SystemNode({ node, onClick }: { node: SystemNode; onClick: (n: SystemNode) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const color = STAR_COLORS[node.starType] || '#ffffff';
  const glow = STAR_GLOW[node.starType] || '#ffd000';

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  const isBlackHole = node.starType === 'black_hole';

  return (
    <group position={node.position}>
      {/* Glow sphere */}
      {!isBlackHole && (
        <mesh>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color={glow} transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}

      {/* Star surface */}
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(node); }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[isBlackHole ? 0.25 : 0.18, isBlackHole ? 32 : 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isBlackHole ? 0 : 2}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Hover ring */}
      {hovered && (
        <mesh>
          <ringGeometry args={[0.32, 0.38, 32]} />
          <meshBasicMaterial color={glow} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Name */}
      {hovered && (
        <Html position={[0, 0.5, 0]} center distanceFactor={60}>
          <div className="bg-black/80 px-2 py-1 rounded text-xs whitespace-nowrap border border-white/10">
            <p className="text-white font-bold">{node.name}</p>
            <p className="text-gray-400">{node.planets} planets · {node.habitable} habitable</p>
            {node.faction && <p style={{ color: node.factionColor }} className="text-xs">{node.faction}</p>}
          </div>
        </Html>
      )}
    </group>
  );
}

// ────────────────────────────────────────────────────────────
// SCENE CONTENT
// ────────────────────────────────────────────────────────────
function SceneContent({
  onSelectGalaxy,
  onSelectSystem,
  onSelectFleet,
  tourActive,
  onTourComplete,
  onTourInterrupt,
}: {
  onSelectGalaxy: (g: GalaxyData) => void;
  onSelectSystem: (s: SystemNode) => void;
  onSelectFleet: (f: FleetPosition) => void;
  tourActive: boolean;
  onTourComplete: () => void;
  onTourInterrupt: () => void;
}) {
  const nebulae = useMemo(() => [
    { position: [10, 15, -20] as [number, number, number], color: '#6610f2', size: 12 },
    { position: [-30, -10, 10] as [number, number, number], color: '#0d6efd', size: 10 },
    { position: [25, -20, -15] as [number, number, number], color: '#d63384', size: 8 },
    { position: [-15, 25, 20] as [number, number, number], color: '#20c997', size: 11 },
    { position: [0, -30, -35] as [number, number, number], color: '#fd7e14', size: 9 },
    { position: [40, 5, 10] as [number, number, number], color: '#6f42c1', size: 7 },
  ], []);

  const systemNodes: SystemNode[] = useMemo(() => [
    // Some key systems around the galaxies
    { id: 's1', name: 'Sol Prime', position: [18, -5, -18], starType: 'G', planets: 8, habitable: 1, faction: 'Void Collective', factionColor: '#a78bfa' },
    { id: 's2', name: 'Arcturus Gate', position: [-22, 7, -28], starType: 'red_giant', planets: 12, habitable: 3, faction: 'Stellar Empire', factionColor: '#f87171' },
    { id: 's3', name: 'Rigel Alpha', position: [-18, -10, 17], starType: 'blue_giant', planets: 6, habitable: 0, faction: 'Iron Federation', factionColor: '#60a5fa' },
    { id: 's4', name: 'Nova Station', position: [28, 17, -33], starType: 'neutron', planets: 2, habitable: 0, faction: 'Merchant Guild', factionColor: '#fbbf24' },
    { id: 's5', name: 'Void Nexus', position: [-33, -18, -8], starType: 'black_hole', planets: 1, habitable: 0, faction: 'Shadow Syndicate', factionColor: '#f472b6' },
    { id: 's6', name: 'Zeta Orionis', position: [13, 27, -38], starType: 'O', planets: 15, habitable: 5, faction: 'Celestial Order', factionColor: '#38bdf8' },
    { id: 's7', name: 'Crimson Deep', position: [7, 22, 27], starType: 'M', planets: 4, habitable: 0, faction: 'Nomad Clans', factionColor: '#34d399' },
    { id: 's8', name: 'Vega Station', position: [-3, -28, 32], starType: 'A', planets: 10, habitable: 2, faction: 'Free Worlds', factionColor: '#a3e635' },
    { id: 's9', name: 'Trading Post X', position: [-28, -22, -13], starType: 'K', planets: 7, habitable: 1, faction: null, factionColor: '#ffffff' },
    { id: 's10', name: 'Deep Space 7', position: [35, -8, -22], starType: 'F', planets: 3, habitable: 0, faction: null, factionColor: '#ffffff' },
  ], []);

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.1} />

      {/* Deep space background */}
      <DeepSpaceStarfield />

      {/* Nebula clouds */}
      {nebulae.map((n, i) => (
        <NebulaCloud key={i} position={n.position} color={n.color} size={n.size} />
      ))}

      {/* Galaxies */}
      {GALAXIES.map((g) => (
        <SpiralGalaxy key={g.id} data={g} onClick={onSelectGalaxy} />
      ))}

      {/* System nodes */}
      {systemNodes.map((s) => (
        <SystemNode key={s.id} node={s} onClick={onSelectSystem} />
      ))}

      {/* Fleet markers from live DB data */}
      <FleetMarkers onClick={onSelectFleet} />

      {/* Cinematic auto-tour camera */}
      <CinematicCamera active={tourActive} onComplete={onTourComplete} onInterrupt={onTourInterrupt} />

      {/* Post-processing for UE5-like bloom */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={1.2} radius={0.8} mipmapBlur />
        <Vignette darkness={0.5} offset={0.1} />
        <Noise opacity={0.015} />
      </EffectComposer>
    </>
  );
}

// ────────────────────────────────────────────────────────────
// LOADING SCREEN
// ────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-xl font-bold text-white mb-2">Initializing Universe Renderer</p>
        <p className="text-gray-400 text-sm">Loading 3D assets, particle systems, and shaders...</p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// GALAXY INFO PANEL (UI overlay)
// ────────────────────────────────────────────────────────────
function GalaxyInfoPanel({ galaxy, onClose, onTravelZoom }: { galaxy: GalaxyData; onClose: () => void; onTravelZoom: (g: GalaxyData) => void }) {
  return (
    <div className="absolute top-20 right-4 z-20 w-72 rounded-xl overflow-hidden"
      style={{ background: 'rgba(2,4,12,0.95)', border: `1px solid ${galaxy.factionColor}40`, backdropFilter: 'blur(12px)' }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: galaxy.color, boxShadow: `0 0 8px ${galaxy.color}` }}></div>
          <h3 className="text-sm font-bold text-white">{galaxy.name}</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
          <i className="ri-close-line text-sm"></i>
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-0.5 rounded capitalize" style={{ background: `${galaxy.color}20`, color: galaxy.color }}>
            {galaxy.type.replace('-', ' ')}
          </span>
          {galaxy.faction && (
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${galaxy.factionColor}20`, color: galaxy.factionColor }}>
              {galaxy.faction}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { label: 'Stars', val: galaxy.starCount, color: 'text-white' },
            { label: 'Planets', val: galaxy.planets, color: 'text-green-400' },
            { label: 'Explored', val: galaxy.explored, color: 'text-cyan-400' },
            { label: 'Danger', val: `${galaxy.dangerLevel}/10`, color: galaxy.dangerLevel > 6 ? 'text-red-400' : 'text-amber-400' },
          ].map(r => (
            <div key={r.label} className="flex justify-between">
              <span className="text-gray-500">{r.label}</span>
              <span className={`font-semibold ${r.color}`}>{r.val}</span>
            </div>
          ))}
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1.5">Resources</p>
          <div className="flex flex-wrap gap-1">
            {galaxy.resources.map((r, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: '#ccc' }}>
                {r}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-white/5">
          <button
            onClick={() => onTravelZoom(galaxy)}
            className="w-full py-2 rounded-lg text-xs font-bold text-white whitespace-nowrap cursor-pointer transition-all hover:scale-[1.02]"
            style={{ background: `linear-gradient(135deg, ${galaxy.color}, ${galaxy.factionColor})` }}>
            <i className="ri-rocket-line mr-1.5"></i>Travel to {galaxy.name}
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// FLEET INFO PANEL
// ────────────────────────────────────────────────────────────
function FleetInfoPanel({ fleet, onClose }: { fleet: FleetPosition; onClose: () => void }) {
  const color = MISSION_COLORS[fleet.mission] || '#fbbf24';
  const icon = MISSION_ICONS[fleet.mission] || 'ri-ship-line';

  return (
    <div className="absolute top-20 right-4 z-20 w-64 rounded-xl overflow-hidden"
      style={{ background: 'rgba(2,4,12,0.95)', border: `1px solid ${color}40`, backdropFilter: 'blur(12px)' }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }}></div>
          <h3 className="text-sm font-bold text-white">{fleet.name}</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
          <i className="ri-close-line text-sm"></i>
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded capitalize" style={{ background: `${color}20`, color }}>
            <i className={`${icon} mr-1`}></i>{fleet.mission}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { label: 'Ships', val: fleet.totalShips.toLocaleString(), color: 'text-white' },
            { label: 'Dest Galaxy', val: `#${fleet.destGalaxy}`, color: 'text-cyan-400' },
            { label: 'Dest System', val: fleet.destSystem, color: 'text-amber-400' },
            { label: 'Progress', val: `${Math.round(fleet.progress * 100)}%`, color: 'text-green-400' },
          ].map(r => (
            <div key={r.label} className="flex justify-between">
              <span className="text-gray-500">{r.label}</span>
              <span className={`font-semibold ${r.color}`}>{r.val}</span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-1.5 rounded-full transition-all" style={{ width: `${Math.round(fleet.progress * 100)}%`, background: color }} />
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// ZOOM TRANSITION OVERLAY
// ────────────────────────────────────────────────────────────
function ZoomTransitionOverlay({ galaxyName, progress }: { galaxyName: string; progress: number }) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
      style={{
        background: `radial-gradient(ellipse at center, rgba(0,0,0,${0.3 + progress * 0.6}) 0%, rgba(0,0,0,${0.7 + progress * 0.3}) 100%)`,
      }}>
      <div className="text-center" style={{ opacity: progress > 0.3 ? 1 : 0, transition: 'opacity 0.3s' }}>
        <div className="inline-block w-12 h-12 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"
          style={{ borderWidth: 3 }}></div>
        <p className="text-xl font-black text-white tracking-wider">Jumping to {galaxyName}</p>
        <p className="text-sm text-cyan-400 mt-1">Initiating warp drive...</p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// CONTROLS HINT
// ────────────────────────────────────────────────────────────
function ControlsHint() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="absolute bottom-6 left-6 z-20 rounded-lg p-3 text-xs"
      style={{ background: 'rgba(2,4,12,0.85)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 uppercase tracking-wider font-semibold">Controls</p>
        <button onClick={() => setDismissed(true)} className="text-gray-500 hover:text-white cursor-pointer">
          <i className="ri-close-line"></i>
        </button>
      </div>
      <div className="space-y-1" style={{ color: 'rgba(0,212,255,0.6)' }}>
        <div><span className="text-white">🖱 Drag</span> — Rotate view</div>
        <div><span className="text-white">🖱 Scroll</span> — Zoom in/out</div>
        <div><span className="text-white">🖱 Right-drag</span> — Pan</div>
        <div><span className="text-white">Click galaxy</span> — View details</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────────────────────────
export default function Universe3DPage() {
  const navigate = useNavigate();
  const [selectedGalaxy, setSelectedGalaxy] = useState<GalaxyData | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<SystemNode | null>(null);
  const [selectedFleet, setSelectedFleet] = useState<FleetPosition | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Tour state
  const [tourActive, setTourActive] = useState(true); // auto-start on load
  const [tourCompleted, setTourCompleted] = useState(false);

  // Zoom transition state
  const [zoomTarget, setZoomTarget] = useState<GalaxyData | null>(null);
  const [zoomProgress, setZoomProgress] = useState(0);
  const zoomStartRef = useRef(0);
  const zoomAnimRef = useRef<number>(0);

  const handleSelectGalaxy = useCallback((g: GalaxyData) => {
    setSelectedGalaxy(g);
    setSelectedSystem(null);
    setSelectedFleet(null);
  }, []);

  const handleSelectSystem = useCallback((s: SystemNode) => {
    setSelectedSystem(s);
    setSelectedGalaxy(null);
    setSelectedFleet(null);
  }, []);

  const handleSelectFleet = useCallback((f: FleetPosition) => {
    setSelectedFleet(f);
    setSelectedGalaxy(null);
    setSelectedSystem(null);
  }, []);

  // ── Tour handlers ──────────────────────────────────────────
  const handleTourComplete = useCallback(() => {
    setTourActive(false);
    setTourCompleted(true);
  }, []);

  const handleTourInterrupt = useCallback(() => {
    setTourActive(false);
    // Don't mark as completed so user can replay
  }, []);

  const handleStartTour = useCallback(() => {
    setTourActive(true);
    setTourCompleted(false);
  }, []);

  // ── Zoom transition handler ────────────────────────────────
  const handleTravelZoom = useCallback((galaxy: GalaxyData) => {
    setZoomTarget(galaxy);
    setZoomProgress(0);
    zoomStartRef.current = performance.now();

    const animate = () => {
      const elapsed = (performance.now() - zoomStartRef.current) / 1000;
      const duration = 2.5; // seconds
      const p = Math.min(elapsed / duration, 1);
      // Ease-in-out
      const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      setZoomProgress(eased);

      if (p < 1) {
        zoomAnimRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete — navigate to galaxy map
        setZoomTarget(null);
        setZoomProgress(0);
        navigate(`/galaxy-map`);
      }
    };

    zoomAnimRef.current = requestAnimationFrame(animate);
  }, [navigate]);

  // Cleanup zoom animation on unmount
  useEffect(() => {
    return () => {
      if (zoomAnimRef.current) cancelAnimationFrame(zoomAnimRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-full" style={{ height: 'calc(100vh - 96px)', background: '#000' }}>
      {/* Loading overlay */}
      {loading && <LoadingScreen />}

      {/* Zoom transition overlay */}
      {zoomTarget && <ZoomTransitionOverlay galaxyName={zoomTarget.name} progress={zoomProgress} />}

      {/* 3D Canvas */}
      <Canvas
        className="absolute inset-0"
        style={{ background: '#000108' }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onCreated={() => setTimeout(() => setLoading(false), 1500)}
        camera={{ position: [0, 60, 80], fov: 55, near: 0.5, far: 300 }}
      >
        <Suspense fallback={null}>
          <SceneContent
            onSelectGalaxy={handleSelectGalaxy}
            onSelectSystem={handleSelectSystem}
            onSelectFleet={handleSelectFleet}
            tourActive={tourActive}
            onTourComplete={handleTourComplete}
            onTourInterrupt={handleTourInterrupt}
          />
          {!tourActive && (
            <OrbitControls
              enableDamping
              dampingFactor={0.08}
              minDistance={8}
              maxDistance={120}
              maxPolarAngle={Math.PI * 0.75}
              target={[0, 0, 0]}
            />
          )}
        </Suspense>
      </Canvas>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3"
        style={{ background: 'linear-gradient(180deg, rgba(2,4,12,0.95) 0%, transparent 100%)' }}>
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-black text-white tracking-wider">
            <i className="ri-global-line mr-2 text-cyan-400"></i>
            3D Universe Explorer
          </h1>
          <div className="h-4 w-px bg-white/10"></div>
          <span className="text-xs text-gray-400">{GALAXIES.length} Galaxies · Real-time 3D Render</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Tour button */}
          <button
            onClick={handleStartTour}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              tourActive ? 'opacity-50 pointer-events-none' : ''
            }`}
            style={{
              background: tourActive
                ? 'rgba(0,212,255,0.1)'
                : 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(114,9,183,0.2))',
              border: '1px solid rgba(0,212,255,0.3)',
              color: tourActive ? '#666' : '#00d4ff',
            }}
          >
            <i className={`${tourActive ? 'ri-film-line animate-pulse' : 'ri-film-line'} mr-1`}></i>
            {tourActive ? 'Touring...' : tourCompleted ? 'Replay Tour' : 'Start Tour'}
          </button>

          {/* Galaxy quick-nav */}
          <div className="flex gap-1">
            {GALAXIES.map((g) => (
              <button
                key={g.id}
                onClick={() => handleSelectGalaxy(g)}
                className="w-6 h-6 rounded-full border-2 transition-all cursor-pointer"
                style={{
                  background: selectedGalaxy?.id === g.id ? g.color : 'transparent',
                  borderColor: g.color,
                  boxShadow: selectedGalaxy?.id === g.id ? `0 0 10px ${g.color}` : 'none',
                }}
                title={g.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Info panels */}
      {selectedGalaxy && (
        <GalaxyInfoPanel galaxy={selectedGalaxy} onClose={() => setSelectedGalaxy(null)} onTravelZoom={handleTravelZoom} />
      )}
      {selectedSystem && (
        <div className="absolute top-20 right-4 z-20 w-64 rounded-xl overflow-hidden"
          style={{ background: 'rgba(2,4,12,0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-sm font-bold text-white">{selectedSystem.name}</h3>
            <button onClick={() => setSelectedSystem(null)} className="text-gray-400 hover:text-white cursor-pointer">
              <i className="ri-close-line text-sm"></i>
            </button>
          </div>
          <div className="p-4 space-y-2 text-xs">
            {[
              { label: 'Star Type', val: selectedSystem.starType.replace('_', ' '), color: STAR_COLORS[selectedSystem.starType] },
              { label: 'Planets', val: selectedSystem.planets, color: '#4ade80' },
              { label: 'Habitable', val: selectedSystem.habitable, color: '#22d3ee' },
            ].map(r => (
              <div key={r.label} className="flex justify-between">
                <span className="text-gray-500">{r.label}</span>
                <span className="font-semibold" style={{ color: r.color }}>{r.val}</span>
              </div>
            ))}
            {selectedSystem.faction && (
              <div className="pt-2 mt-2 border-t border-white/5">
                <button className="w-full py-1.5 rounded text-xs font-semibold text-white whitespace-nowrap cursor-pointer"
                  style={{ background: `${selectedSystem.factionColor}30`, border: `1px solid ${selectedSystem.factionColor}60` }}>
                  <i className="ri-rocket-line mr-1"></i>Travel to System
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {selectedFleet && (
        <FleetInfoPanel fleet={selectedFleet} onClose={() => setSelectedFleet(null)} />
      )}

      {/* Tour progress bar */}
      {tourActive && (
        <div className="absolute bottom-0 left-0 right-0 z-20 h-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="h-1 transition-all duration-500"
            style={{
              width: '100%',
              background: 'linear-gradient(90deg, #00d4ff, #7209b7, #f72585)',
              animation: 'tourProgress 30s linear forwards',
            }} />
        </div>
      )}

      {/* Bottom controls */}
      <ControlsHint />
      {tourActive && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 rounded-full px-4 py-2 text-xs"
          style={{ background: 'rgba(2,4,12,0.85)', border: '1px solid rgba(0,212,255,0.2)' }}>
          <p className="text-cyan-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Cinematic tour in progress — click or scroll to take control
          </p>
        </div>
      )}

      <div className="absolute bottom-6 right-6 z-20 text-xs text-gray-500">
        {tourActive
          ? 'Cinematic Tour'
          : 'Click & drag to explore'}
      </div>
    </div>
  );
}