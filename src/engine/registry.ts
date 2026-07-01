import { createDevSoundDataUri, type DevSoundName } from './devAudio';
import { type AssetType } from './types';

export type EngineAssetKind = AssetType | 'procedural';

export interface EngineAssetManifestItem {
  id: string;
  type: EngineAssetKind;
  url?: string;
  required?: boolean;
  preload?: boolean;
  description: string;
  fallback: 'procedural-star' | 'procedural-planet' | 'procedural-fleet' | 'none';
}

function svgTextureDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const texture = {
  starGlow: svgTextureDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <defs>
        <radialGradient id="g">
          <stop offset="0" stop-color="#ffffff" stop-opacity="1"/>
          <stop offset=".28" stop-color="#9ee7ff" stop-opacity=".8"/>
          <stop offset=".62" stop-color="#38bdf8" stop-opacity=".25"/>
          <stop offset="1" stop-color="#38bdf8" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="128" height="128" fill="url(#g)"/>
    </svg>
  `),
  planetSurface: svgTextureDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <rect width="128" height="128" fill="#8aa4b8"/>
      <path d="M8 32c24-18 39 2 62-10 19-10 34-2 50 10v26c-25 7-41-8-61 2-21 11-35 8-51-2z" fill="#d9e2e8" opacity=".48"/>
      <path d="M0 88c22-10 45 8 67-4 23-13 42-5 61 6v38H0z" fill="#3d5364" opacity=".45"/>
    </svg>
  `),
  fleetEmissive: svgTextureDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" fill="#020617"/>
      <path d="M32 5 48 52 32 44 16 52z" fill="#38bdf8"/>
      <path d="M32 13 39 42 32 38 25 42z" fill="#e0f2fe"/>
    </svg>
  `),
};

const devSound = (name: DevSoundName) => createDevSoundDataUri(name);

export const ENGINE_ASSET_MANIFEST = [
  {
    id: 'texture.star.glow',
    type: 'texture',
    url: texture.starGlow,
    preload: true,
    required: false,
    description: 'Soft additive star glow texture.',
    fallback: 'procedural-star',
  },
  {
    id: 'texture.planet.surface',
    type: 'texture',
    url: texture.planetSurface,
    preload: true,
    required: false,
    description: 'Neutral planet surface texture.',
    fallback: 'procedural-planet',
  },
  {
    id: 'texture.fleet.emissive',
    type: 'texture',
    url: texture.fleetEmissive,
    preload: true,
    required: false,
    description: 'Fleet marker emissive texture.',
    fallback: 'procedural-fleet',
  },
  {
    id: 'model.star.node',
    type: 'procedural',
    preload: false,
    required: false,
    description: 'Star node model slot. Uses procedural geometry in dev.',
    fallback: 'procedural-star',
  },
  {
    id: 'model.planet.body',
    type: 'procedural',
    preload: false,
    required: false,
    description: 'Planet model slot. Uses procedural sphere geometry in dev.',
    fallback: 'procedural-planet',
  },
  {
    id: 'model.fleet.marker',
    type: 'procedural',
    preload: false,
    required: false,
    description: 'Fleet marker model slot. Uses procedural cone geometry in dev.',
    fallback: 'procedural-fleet',
  },
  {
    id: 'audio.ui.ping',
    type: 'audio',
    url: devSound('uiPing'),
    preload: true,
    required: false,
    description: 'Generated UI ping for local development.',
    fallback: 'none',
  },
  {
    id: 'audio.ui.select',
    type: 'audio',
    url: devSound('select'),
    preload: true,
    required: false,
    description: 'Generated selection sound for local development.',
    fallback: 'none',
  },
] as const satisfies readonly EngineAssetManifestItem[];

export type EngineAssetId = (typeof ENGINE_ASSET_MANIFEST)[number]['id'];

export const PRELOAD_ENGINE_ASSETS = ENGINE_ASSET_MANIFEST.filter(
  (asset) => asset.preload,
);

export function getEngineAsset(id: EngineAssetId | string): EngineAssetManifestItem | undefined {
  return ENGINE_ASSET_MANIFEST.find((asset) => asset.id === id);
}
