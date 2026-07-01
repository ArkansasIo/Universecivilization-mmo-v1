import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { AssetManager } from './AssetManager';
import { AudioManager } from './AudioManager';
import { MusicManager } from './MusicManager';
import { type EngineState } from './types';

interface GameEngine {
  assets: AssetManager;
  audio: AudioManager;
  music: MusicManager;
  initialized: boolean;
  state: EngineState;
  init: () => Promise<void>;
  dispose: () => void;
}

const EngineContext = createContext<GameEngine | null>(null);

let globalEngine: GameEngine | null = null;

function createEngine(): GameEngine {
  const assetManager = new AssetManager();
  const audioManager = new AudioManager();
  const musicManager = new MusicManager();

  const engine: GameEngine = {
    assets: assetManager,
    audio: audioManager,
    music: musicManager,
    initialized: false,
    state: {
      initialized: false,
      assetCount: 0,
      assetsLoaded: 0,
      audioContextState: 'closed',
      musicPlaying: false,
      currentTrack: null,
    },

    init: async () => {
      if (engine.initialized) return;

      audioManager.init();
      audioManager.resume();

      musicManager.init(audioManager['ctx']!);

      const audioCtx = audioManager['ctx']!;
      const onUserGesture = () => {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        document.removeEventListener('click', onUserGesture);
        document.removeEventListener('touchstart', onUserGesture);
        document.removeEventListener('keydown', onUserGesture);
      };
      document.addEventListener('click', onUserGesture);
      document.addEventListener('touchstart', onUserGesture);
      document.addEventListener('keydown', onUserGesture);

      engine.initialized = true;
      engine.state.initialized = true;
    },

    dispose: () => {
      audioManager.dispose();
      musicManager.dispose();
      assetManager.clear();
      engine.initialized = false;
      engine.state.initialized = false;
    },
  };

  const updateState = () => {
    engine.state = {
      initialized: engine.initialized,
      assetCount: engine.assets.total,
      assetsLoaded: engine.assets.loaded,
      audioContextState: engine.audio.contextState,
      musicPlaying: engine.music['state']?.playing ?? false,
      currentTrack: engine.music.currentTrackId,
    };
  };

  assetManager.setOnEvent(() => updateState());
  audioManager.setOnEvent(() => updateState());
  musicManager.setOnEvent(() => updateState());

  return engine;
}

export function EngineProvider({ children }: { children: ReactNode }) {
  const [engine, setEngine] = useState<GameEngine | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const eng = globalEngine || createEngine();
    globalEngine = eng;
    setEngine(eng);

    eng.init();

    return () => {
      // Don't dispose on unmount — engine survives hot reloads
    };
  }, []);

  return (
    <EngineContext.Provider value={engine}>
      {children}
    </EngineContext.Provider>
  );
}

export function useEngine(): GameEngine | null {
  return useContext(EngineContext);
}

export function getEngine(): GameEngine | null {
  return globalEngine;
}

export { type GameEngine };
