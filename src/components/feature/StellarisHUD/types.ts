export type StellarisPanel =
  | 'empire'
  | 'planets'
  | 'fleets'
  | 'technology'
  | 'diplomacy'
  | 'espionage'
  | 'traditions'
  | 'leaders'
  | null;

export type StellarisModal =
  | 'starbases'
  | 'construction'
  | 'science'
  | 'shipdesigner'
  | 'megastructures'
  | 'alerts'
  | 'events'
  | 'victory'
  | 'settings'
  | 'colonize'
  | 'survey'
  | 'attack'
  | 'trade'
  | 'federation'
  | 'relics'
  | 'achievements'
  | null;

export interface StellarisHUDState {
  activePanel: StellarisPanel;
  activeModal: StellarisModal;
  setPanel: (p: StellarisPanel) => void;
  setModal: (m: StellarisModal) => void;
}
