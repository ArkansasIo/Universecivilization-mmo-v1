import * as THREE from 'three';
import { type AudioCategory, type AudioPlayOptions, type AudioTrack, type EngineEvent } from './types';

type PoolEntry = {
  source: AudioBufferSourceNode;
  gain: GainNode;
  panner: PannerNode | null;
  category: AudioCategory;
  id: string;
  active: boolean;
};

type EventCallback = (event: EngineEvent) => void;

const DEFAULT_VOLUMES: Record<AudioCategory, number> = {
  sfx: 0.8,
  ui: 0.6,
  ambient: 0.4,
  voice: 0.9,
  music: 0.5,
};

export class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private categoryGains = new Map<AudioCategory, GainNode>();
  private categoryMutes = new Map<AudioCategory, boolean>();
  private pool: PoolEntry[] = [];
  private poolSize = 32;
  private loadedBuffers = new Map<string, AudioBuffer>();
  private listener: THREE.AudioListener | null = null;
  private onEvent: EventCallback | null = null;
  private volumes: Record<AudioCategory, number> = { ...DEFAULT_VOLUMES };
  private _initialized = false;

  get initialized() { return this._initialized; }
  get contextState() { return this.ctx?.state ?? 'closed'; }

  setOnEvent(cb: EventCallback) { this.onEvent = cb; }

  private emit(type: EngineEvent['type'], payload?: unknown) {
    this.onEvent?.({ type, payload, timestamp: Date.now() });
  }

  init() {
    if (this._initialized) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.value = 0.8;

    const categories: AudioCategory[] = ['sfx', 'ui', 'ambient', 'voice', 'music'];
    for (const cat of categories) {
      const gain = this.ctx.createGain();
      gain.gain.value = this.volumes[cat];
      gain.connect(this.masterGain!);
      this.categoryGains.set(cat, gain);
      this.categoryMutes.set(cat, false);
    }

    this._initialized = true;
    this.emit('engine:ready', { system: 'audio' });
  }

  resume() {
    if (this.ctx?.state === 'suspended') this.ctx.resume();
  }

  setThreeListener(listener: THREE.AudioListener) {
    this.listener = listener;
  }

  async loadBuffer(id: string, url: string): Promise<AudioBuffer> {
    if (this.loadedBuffers.has(id)) return this.loadedBuffers.get(id)!;
    if (!this.ctx) this.init();

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.ctx!.decodeAudioData(arrayBuffer);
    this.loadedBuffers.set(id, audioBuffer);
    return audioBuffer;
  }

  registerBuffer(id: string, buffer: AudioBuffer) {
    this.loadedBuffers.set(id, buffer);
  }

  play(id: string, options: AudioPlayOptions = {}): string | null {
    if (!this.ctx || !this.masterGain) return null;

    const buffer = typeof id === 'string' ? this.loadedBuffers.get(id) : null;
    if (!buffer) {
      console.warn(`[AudioManager] Buffer not found: ${id}`);
      return null;
    }

    const category = options.category ?? 'sfx';
    const catGain = this.categoryGains.get(category);
    if (!catGain || this.categoryMutes.get(category)) return null;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = options.loop ?? false;
    source.playbackRate.value = options.rate ?? 1;

    const gainNode = this.ctx.createGain();
    gainNode.gain.value = options.volume ?? 1;

    let panner: PannerNode | null = null;

    if (options.spatial && options.position) {
      panner = this.ctx.createPanner();
      panner.panningModel = 'HRTF';
      panner.distanceModel = 'inverse';
      panner.refDistance = 10;
      panner.maxDistance = 100;
      panner.rolloffFactor = 1.5;
      panner.positionX.value = options.position[0];
      panner.positionY.value = options.position[1];
      panner.positionZ.value = options.position[2];
      source.connect(gainNode);
      gainNode.connect(panner);
      panner.connect(catGain);
    } else {
      source.connect(gainNode);
      gainNode.connect(catGain);
    }

    source.start(0);

    const playId = `${id}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    const entry: PoolEntry = {
      source, gain: gainNode, panner, category, id: playId, active: true,
    };

    this.pool.push(entry);
    this.trimPool();

    source.onended = () => {
      entry.active = false;
      this.emit('audio:stop', { id: playId, bufferId: id });
    };

    this.emit('audio:play', { id: playId, bufferId: id, category, spatial: !!panner });
    return playId;
  }

  stop(playId: string) {
    const entry = this.pool.find(e => e.id === playId && e.active);
    if (!entry) return;
    try { entry.source.stop(); } catch { /* already stopped */ }
    entry.active = false;
  }

  stopAll(category?: AudioCategory) {
    for (const entry of this.pool) {
      if (!entry.active) continue;
      if (category && entry.category !== category) continue;
      try { entry.source.stop(); } catch { /* already stopped */ }
      entry.active = false;
    }
  }

  updateSpatialPosition(playId: string, position: [number, number, number]) {
    const entry = this.pool.find(e => e.id === playId && e.active);
    if (!entry?.panner) return;
    entry.panner.positionX.value = position[0];
    entry.panner.positionY.value = position[1];
    entry.panner.positionZ.value = position[2];
  }

  setVolume(category: AudioCategory, volume: number) {
    this.volumes[category] = Math.max(0, Math.min(1, volume));
    const gain = this.categoryGains.get(category);
    if (gain) gain.gain.value = this.volumes[category];
  }

  getVolume(category: AudioCategory): number {
    return this.volumes[category];
  }

  setMasterVolume(volume: number) {
    if (this.masterGain) this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
  }

  muteCategory(category: AudioCategory, muted: boolean) {
    this.categoryMutes.set(category, muted);
    const gain = this.categoryGains.get(category);
    if (gain) gain.gain.value = muted ? 0 : this.volumes[category];
  }

  isMuted(category: AudioCategory): boolean {
    return this.categoryMutes.get(category) ?? false;
  }

  private trimPool() {
    if (this.pool.length <= this.poolSize) return;
    const active = this.pool.filter(e => e.active);
    const inactive = this.pool.filter(e => !e.active);
    this.pool = [...active, ...inactive.slice(-(this.poolSize - active.length))];
  }

  dispose() {
    for (const entry of this.pool) {
      if (entry.active) { try { entry.source.stop(); } catch { /* okay */ } }
    }
    this.pool = [];
    this.loadedBuffers.clear();
    this.categoryGains.clear();
    this.categoryMutes.clear();
    if (this.ctx) this.ctx.close();
    this.ctx = null;
    this.masterGain = null;
    this._initialized = false;
  }
}
