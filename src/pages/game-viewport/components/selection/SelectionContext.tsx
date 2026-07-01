import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import * as THREE from 'three';

export type SelectableType = 'star' | 'planet' | 'fleet' | 'empire' | null;

export interface Selection {
  type: NonNullable<SelectableType>;
  id: string;
  label: string;
  position: THREE.Vector3;
  data?: Record<string, unknown>;
}

interface SelectionContextValue {
  selected: Selection | null;
  select: (sel: Selection | null) => void;
  clear: () => void;
}

const SelectionContext = createContext<SelectionContextValue>({
  selected: null,
  select: () => {},
  clear: () => {},
});

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Selection | null>(null);

  const select = useCallback((sel: Selection | null) => setSelected(sel), []);
  const clear = useCallback(() => setSelected(null), []);

  return (
    <SelectionContext.Provider value={{ selected, select, clear }}>
      {children}
    </SelectionContext.Provider>
  );
}

export const useSelection = () => useContext(SelectionContext);
