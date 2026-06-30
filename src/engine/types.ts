export type AssetType = 'gltf' | 'texture' | 'audio' | 'json';

export interface AssetRecord {
  id: string;
  type: AssetType;
  url: string;
  data: unknown;
  loaded: boolean;
  error?: string;
}

export type AudioCategory = 'sfx' | 'ui' | 'ambient' | 'voice' | 'music';

export interface AudioPlayOptions {
  volume?: number;
  loop?: boolean;
  rate?: number;
  spatial?: boolean;
  position?: [number, number, number];
  category?: AudioCategory;
}

export interface AudioTrack {
  id: string;
  buffer: AudioBuffer;
  duration: number;
}

export interface MusicTrack {
  id: string;
  url: string;
  title: string;
  duration: number;
  genre?: string;
  bpm?: number;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  shuffle: boolean;
  loop: boolean;
}

export interface EngineState {
  initialized: boolean;
  assetCount: number;
  assetsLoaded: number;
  audioContextState: AudioContextState;
  musicPlaying: boolean;
  currentTrack: string | null;
}

export type EngineEventType =
  | 'asset:loaded'
  | 'asset:error'
  | 'asset:progress'
  | 'audio:play'
  | 'audio:stop'
  | 'music:trackChange'
  | 'music:play'
  | 'music:stop'
  | 'engine:ready'
  | 'engine:error';

export interface EngineEvent {
  type: EngineEventType;
  payload?: unknown;
  timestamp: number;
}
