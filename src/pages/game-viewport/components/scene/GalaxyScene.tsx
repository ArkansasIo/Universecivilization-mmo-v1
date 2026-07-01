import { useMemo, useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import StarNode3D from './StarNode3D';
import Hyperlane3D from './Hyperlane3D';
import Planet3D from './Planet3D';
import AdaptiveLabels3D from './AdaptiveLabels3D';
import FleetMarker3D from './FleetMarker3D';
import TerritoryOverlay3D from '../overlay/TerritoryOverlay3D';
import TradeRoute3D from '../overlay/TradeRoute3D';
import { FogOverlay3D } from '../fow/FogOfWarProvider';
import { useGalaxyData } from '../../hooks/useGalaxyData';
import { useCameraState } from '../camera/CameraStateProvider';
import { useSelection, type Selection } from '../selection/SelectionContext';
import type { StarData, PlanetData } from './galaxyData';

export default function GalaxyScene() {
  const { data, loading } = useGalaxyData();
  const { focusOn, level } = useCameraState();
  const { selected, select } = useSelection();
  const groupRef = useRef<THREE.Group>(null);

  const starMap = useMemo(() => {
    const m = new Map<string, StarData>();
    data.stars.forEach((s) => m.set(s.id, s));
    return m;
  }, [data.stars]);

  const planetMap = useMemo(() => {
    const m = new Map<string, PlanetData>();
    data.planets.forEach((p) => m.set(p.id, p));
    return m;
  }, [data.planets]);

  const handleStarClick = useCallback((star: StarData) => {
    const sel: Selection = {
      type: 'star',
      id: star.id,
      label: star.name,
      position: star.position.clone(),
      data: { starType: star.starType, planets: star.planets, faction: star.faction },
    };
    select(sel);
    focusOn({ type: 'star', id: star.id, position: star.position.clone(), label: star.name });
  }, [select, focusOn]);

  const handlePlanetClick = useCallback((planetId: string) => {
    const planet = planetMap.get(planetId);
    const star = planet ? starMap.get(planet.starId) : undefined;
    if (!planet || !star) return;
    const worldPos = star.position.clone();
    const sel: Selection = {
      type: 'planet',
      id: planet.id,
      label: planet.name,
      position: worldPos,
      data: { planetType: planet.type, starId: planet.starId },
    };
    select(sel);
    focusOn({ type: 'planet', id: planet.id, position: worldPos, label: planet.name });
  }, [planetMap, starMap, select, focusOn]);

  const handleFleetClick = useCallback((fleet: any) => {
    const star = starMap.get(fleet.originStarId);
    if (!star) return;
    const sel: Selection = {
      type: 'fleet',
      id: fleet.id,
      label: fleet.name,
      position: star.position.clone(),
      data: { status: fleet.status, missionType: fleet.missionType },
    };
    select(sel);
  }, [starMap, select]);

  const handleEmptyClick = useCallback(() => {
    select(null);
  }, [select]);

  const { gl } = useThree();

  const showOverlays = level === 'galaxy';
  const showLabels = level !== 'planet';
  const showFog = level !== 'planet';

  return (
    <group ref={groupRef}>
      {/* Hyperlane network */}
      <Hyperlane3D hyperlanes={data.hyperlanes} stars={data.stars} />

      {/* Star nodes */}
      {data.stars.map((star) => (
        <StarNode3D
          key={star.id}
          star={star}
          onClick={handleStarClick}
          isSelected={selected?.id === star.id}
        />
      ))}

      {/* Planets grouped by star */}
      {data.planets.map((planet) => {
        const star = starMap.get(planet.starId);
        if (!star) return null;
        return (
          <group key={planet.id} position={star.position}>
            <Planet3D
              radius={planet.radius}
              color={planet.color}
              orbitRadius={planet.orbitRadius}
              orbitSpeed={planet.orbitSpeed}
              onClick={() => handlePlanetClick(planet.id)}
              isSelected={selected?.id === planet.id}
            />
          </group>
        );
      })}

      {/* Adaptive labels */}
      {showLabels && (
        <AdaptiveLabels3D
          stars={data.stars}
          planets={data.planets}
          empires={data.empires}
          starMap={starMap}
          cameraLevel={level}
        />
      )}

      {/* Fleet markers from live data */}
      <FleetMarker3D
        fleets={[]}
        starMap={starMap}
        isOwnFleet={() => false}
        onClick={handleFleetClick}
      />

      {/* Empire territory overlay at galaxy level */}
      <TerritoryOverlay3D
        empires={data.empires}
        stars={data.stars}
        visible={showOverlays}
      />

      {/* Trade routes overlay at galaxy level */}
      <TradeRoute3D
        routes={[]}
        starMap={starMap}
        visible={showOverlays}
      />

      {/* Fog of war overlay for unexplored systems */}
      {showFog && (
        <FogOverlay3D stars={data.stars} cameraLevel={level} cameraPosition={new THREE.Vector3()} />
      )}

      {/* Click on empty space */}
      <mesh visible={false} onClick={handleEmptyClick}>
        <planeGeometry args={[500, 500]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Ambient light for planet shading */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[50, 80, 50]} intensity={0.4} />
    </group>
  );
}
