import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type CameraLevel, type CameraTarget } from './cameraTypes';
export type { CameraLevel, CameraTarget } from './cameraTypes';

interface CameraContextValue {
  level: CameraLevel;
  target: CameraTarget | null;
  setLevel: (level: CameraLevel) => void;
  setTarget: (target: CameraTarget | null) => void;
  focusOn: (target: CameraTarget) => void;
}

const CameraContext = createContext<CameraContextValue>({
  level: 'galaxy',
  target: null,
  setLevel: () => {},
  setTarget: () => {},
  focusOn: () => {},
});

export function CameraStateProvider({ children }: { children: ReactNode }) {
  const [level, setLevel] = useState<CameraLevel>('galaxy');
  const [target, setTarget] = useState<CameraTarget | null>(null);

  const focusOn = useCallback((t: CameraTarget) => {
    setTarget(t);
    if (t.type === 'star') setLevel('system');
    else if (t.type === 'planet') setLevel('planet');
    else setLevel('galaxy');
  }, []);

  return (
    <CameraContext.Provider value={{ level, target, setLevel, setTarget, focusOn }}>
      {children}
    </CameraContext.Provider>
  );
}

export const useCameraState = () => useContext(CameraContext);
