import { useEffect, useMemo, useState, type ReactNode } from 'react';
import PageLoading from '../components/PageLoading';
import { useEngine } from './EngineProvider';
import { PRELOAD_ENGINE_ASSETS, type EngineAssetManifestItem } from './registry';

interface EnginePreloaderProps {
  children: ReactNode;
  minDurationMs?: number;
}

interface PreloadState {
  total: number;
  loaded: number;
  current: string;
  ready: boolean;
  errors: string[];
}

function loadAsset(engine: NonNullable<ReturnType<typeof useEngine>>, asset: EngineAssetManifestItem) {
  if (!asset.url) return Promise.resolve(null);

  switch (asset.type) {
    case 'texture':
      return engine.assets.preloadTexture(asset.id, asset.url);
    case 'gltf':
      return engine.assets.preloadGLTF(asset.id, asset.url);
    case 'audio':
      return engine.assets.preloadAudio(asset.id, asset.url).then((buffer) => {
        engine.audio.registerBuffer(asset.id, buffer);
        return buffer;
      });
    case 'json':
      return engine.assets.preloadJSON(asset.id, asset.url);
    default:
      return Promise.resolve(null);
  }
}

export default function EnginePreloader({ children, minDurationMs = 650 }: EnginePreloaderProps) {
  const engine = useEngine();
  const assets = useMemo(() => PRELOAD_ENGINE_ASSETS, []);
  const [state, setState] = useState<PreloadState>({
    total: assets.length,
    loaded: 0,
    current: 'Preparing engine',
    ready: false,
    errors: [],
  });

  useEffect(() => {
    if (!engine) return;

    let cancelled = false;
    const startedAt = Date.now();

    async function preload() {
      setState((prev) => ({ ...prev, total: assets.length, current: 'Preparing engine', ready: false }));

      for (const asset of assets) {
        if (cancelled) return;
        setState((prev) => ({ ...prev, current: asset.description }));

        try {
          await loadAsset(engine, asset);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          if (asset.required) {
            setState((prev) => ({ ...prev, errors: [...prev.errors, `${asset.id}: ${message}`] }));
          }
        } finally {
          if (!cancelled) {
            setState((prev) => ({ ...prev, loaded: Math.min(prev.loaded + 1, assets.length) }));
          }
        }
      }

      const elapsed = Date.now() - startedAt;
      const delay = Math.max(0, minDurationMs - elapsed);
      window.setTimeout(() => {
        if (!cancelled) {
          setState((prev) => ({ ...prev, current: 'Ready', ready: true }));
        }
      }, delay);
    }

    preload();

    return () => {
      cancelled = true;
    };
  }, [assets, engine, minDurationMs]);

  const progress = state.total === 0 ? 100 : Math.round((state.loaded / state.total) * 100);

  if (!engine || !state.ready) {
    return (
      <PageLoading
        message={`Loading engine assets ${progress}%`}
        subtitle={state.current}
        messageClassName="font-heading"
        className="min-h-screen bg-[#05070a] text-[#d4a853]"
      >
        <div className="flex w-72 max-w-[70vw] flex-col items-center gap-3">
          <div className="h-2 w-full overflow-hidden rounded bg-white/10">
            <div
              className="h-full rounded bg-[#d4a853] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#5a6577]">
            {state.loaded}/{state.total} assets
          </span>
        </div>
      </PageLoading>
    );
  }

  return <>{children}</>;
}
