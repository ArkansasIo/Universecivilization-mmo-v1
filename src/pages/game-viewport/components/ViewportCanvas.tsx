import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import CameraController from './camera/CameraController';
import { useCameraState } from './camera/CameraStateProvider';
import GalaxyScene from './scene/GalaxyScene';

function SceneContent() {
  const { level, target, setLevel } = useCameraState();

  return (
    <>
      <GalaxyScene />
      <CameraController level={level} target={target} onLevelChange={setLevel} />
    </>
  );
}

export default function ViewportCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 50, 100], fov: 60, near: 0.5, far: 500 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: '#05070a' }}
      onCreated={({ gl }) => {
        gl.setClearColor('#05070a');
      }}
    >
      <EffectComposer>
        <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} intensity={0.4} />
        <Vignette eskil={false} offset={0.3} darkness={0.6} />
      </EffectComposer>
      <SceneContent />
    </Canvas>
  );
}
