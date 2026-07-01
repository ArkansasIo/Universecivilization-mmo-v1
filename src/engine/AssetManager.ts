import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { type AssetType, type EngineEvent } from './types';

type AssetEntry = {
  type: AssetType;
  data: unknown;
  refCount: number;
  loaded: boolean;
  error?: string;
};

type ProgressCallback = (loaded: number, total: number, url: string) => void;
type EventCallback = (event: EngineEvent) => void;

export class AssetManager {
  private cache = new Map<string, AssetEntry>();
  private loadingManager: THREE.LoadingManager;
  private gltfLoader: GLTFLoader;
  private textureLoader: THREE.TextureLoader;
  private audioLoader = new THREE.AudioLoader();
  private fileLoader = new THREE.FileLoader();
  private loadQueue: string[] = [];
  private loading = new Set<string>();
  private onProgress: ProgressCallback | null = null;
  private onEvent: EventCallback | null = null;
  private totalAssets = 0;
  private loadedAssets = 0;

  constructor() {
    this.loadingManager = new THREE.LoadingManager();
    this.gltfLoader = new GLTFLoader(this.loadingManager);
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    this.gltfLoader.setDRACOLoader(dracoLoader);

    this.loadingManager.onProgress = (url, loaded, total) => {
      this.onProgress?.(loaded, total, url);
    };
  }

  setOnProgress(cb: ProgressCallback) { this.onProgress = cb; }
  setOnEvent(cb: EventCallback) { this.onEvent = cb; }

  private emit(type: EngineEvent['type'], payload?: unknown) {
    this.onEvent?.({ type, payload, timestamp: Date.now() });
  }

  get total() { return this.totalAssets; }
  get loaded() { return this.loadedAssets; }
  get progress(): number {
    return this.totalAssets === 0 ? 1 : this.loadedAssets / this.totalAssets;
  }

  getCached(id: string) { return this.cache.get(id)?.data ?? null; }

  isLoaded(id: string): boolean {
    return this.cache.get(id)?.loaded === true;
  }

  preloadGLTF(id: string, url: string): Promise<THREE.Group> {
    return this.load(id, 'gltf', url, () =>
      new Promise((resolve, reject) => {
        this.gltfLoader.load(url, (gltf) => resolve(gltf.scene || gltf), undefined, reject);
      })
    ) as Promise<THREE.Group>;
  }

  preloadTexture(id: string, url: string): Promise<THREE.Texture> {
    return this.load(id, 'texture', url, () =>
      new Promise((resolve, reject) => {
        this.textureLoader.load(url, resolve, undefined, reject);
      })
    ) as Promise<THREE.Texture>;
  }

  preloadAudio(id: string, url: string): Promise<AudioBuffer> {
    return this.load(id, 'audio', url, () =>
      new Promise((resolve, reject) => {
        this.audioLoader.load(url, resolve, undefined, reject);
      })
    ) as Promise<AudioBuffer>;
  }

  preloadJSON<T = unknown>(id: string, url: string): Promise<T> {
    return this.load(id, 'json', url, () =>
      new Promise((resolve, reject) => {
        this.fileLoader.load(url, (data) => {
          try { resolve(JSON.parse(typeof data === 'string' ? data : new TextDecoder().decode(data))); }
          catch { reject(new Error('Failed to parse JSON')); }
        }, undefined, reject);
      })
    ) as Promise<T>;
  }

  private async load(id: string, type: AssetType, url: string, loader: () => Promise<unknown>): Promise<unknown> {
    const existing = this.cache.get(id);
    if (existing) {
      if (existing.loaded) return existing.data;
      if (this.loading.has(id)) {
        return new Promise((resolve) => {
          const check = () => {
            const entry = this.cache.get(id);
            if (entry?.loaded) resolve(entry.data);
            else setTimeout(check, 100);
          };
          check();
        });
      }
    }

    this.totalAssets++;
    this.loading.add(id);
    this.cache.set(id, { type, data: null, refCount: 0, loaded: false });

    try {
      const data = await loader();
      this.cache.set(id, { type, data, refCount: 0, loaded: true });
      this.loadedAssets++;
      this.loading.delete(id);
      this.emit('asset:loaded', { id, type });
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.cache.set(id, { type, data: null, refCount: 0, loaded: false, error: msg });
      this.loading.delete(id);
      this.emit('asset:error', { id, type, error: msg });
      throw err;
    }
  }

  createPlaceholderGeometry(shape: 'box' | 'sphere' | 'cylinder' = 'box'): THREE.BufferGeometry {
    switch (shape) {
      case 'sphere': return new THREE.SphereGeometry(1, 16, 16);
      case 'cylinder': return new THREE.CylinderGeometry(1, 1, 2, 16);
      default: return new THREE.BoxGeometry(1, 1, 1);
    }
  }

  createPlaceholderMaterial(color = '#ff00ff', wireframe = false): THREE.Material {
    return new THREE.MeshStandardMaterial({ color, wireframe, roughness: 0.5, metalness: 0.5 });
  }

  createPlaceholderGroup(id: string): THREE.Group {
    const group = new THREE.Group();
    group.name = `placeholder_${id}`;
    const geo = this.createPlaceholderGeometry('box');
    const mat = this.createPlaceholderMaterial('#ff00ff', true);
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);
    return group;
  }

  release(id: string) {
    const entry = this.cache.get(id);
    if (!entry) return;
    entry.refCount--;
    if (entry.refCount <= 0) {
      if (entry.data instanceof THREE.Texture) entry.data.dispose();
      if (entry.data instanceof THREE.BufferGeometry) entry.data.dispose();
      if (entry.data instanceof THREE.Material) entry.data.dispose();
      this.cache.delete(id);
    }
  }

  retain(id: string) {
    const entry = this.cache.get(id);
    if (entry) entry.refCount++;
  }

  clear() {
    for (const [id, entry] of this.cache) {
      if (entry.data instanceof THREE.Texture) entry.data.dispose();
      if (entry.data instanceof THREE.BufferGeometry) entry.data.dispose();
      if (entry.data instanceof THREE.Material) entry.data.dispose();
    }
    this.cache.clear();
    this.totalAssets = 0;
    this.loadedAssets = 0;
  }
}
