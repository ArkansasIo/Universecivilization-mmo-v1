import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useEngine } from '../EngineProvider';
import { getEngineAsset, type EngineAssetId } from '../registry';

type AssetResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  progress: number;
};

export function useAsset(id: EngineAssetId | string) {
  const asset = getEngineAsset(id);

  return {
    asset,
    id,
    url: asset?.url ?? '',
    isProcedural: !asset?.url || asset.type === 'procedural',
    fallback: asset?.fallback ?? 'none',
  };
}

export function useRegisteredTexture(id: EngineAssetId | string): AssetResult<THREE.Texture> {
  const asset = getEngineAsset(id);
  return useTexture(id, asset?.url ?? '');
}

export function useRegisteredGLTF(id: EngineAssetId | string): AssetResult<THREE.Group> {
  const asset = getEngineAsset(id);
  return useGLTF(id, asset?.url ?? '');
}

export function useGLTF(id: string, url: string): AssetResult<THREE.Group> {
  const engine = useEngine();
  const [result, setResult] = useState<AssetResult<THREE.Group>>({
    data: null, loading: true, error: null, progress: 0,
  });
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (!engine || !url) {
      setResult({ data: null, loading: false, error: 'Engine not ready', progress: 0 });
      return;
    }

    const cached = engine.assets.getCached(id);
    if (cached) {
      setResult({ data: cached as THREE.Group, loading: false, error: null, progress: 1 });
      return;
    }

    setResult({ data: null, loading: true, error: null, progress: 0 });

    engine.assets.preloadGLTF(id, url)
      .then((data) => {
        if (mountedRef.current) {
          setResult({ data, loading: false, error: null, progress: 1 });
        }
      })
      .catch((err) => {
        if (mountedRef.current) {
          const placeholder = engine.assets.createPlaceholderGroup(id);
          setResult({ data: placeholder, loading: false, error: String(err), progress: 1 });
        }
      });

    return () => { mountedRef.current = false; };
  }, [engine, id, url]);

  return result;
}

export function useTexture(id: string, url: string): AssetResult<THREE.Texture> {
  const engine = useEngine();
  const [result, setResult] = useState<AssetResult<THREE.Texture>>({
    data: null, loading: true, error: null, progress: 0,
  });
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (!engine || !url) {
      setResult({ data: null, loading: false, error: 'Engine not ready', progress: 0 });
      return;
    }

    const cached = engine.assets.getCached(id);
    if (cached) {
      setResult({ data: cached as THREE.Texture, loading: false, error: null, progress: 1 });
      return;
    }

    setResult({ data: null, loading: true, error: null, progress: 0 });

    engine.assets.preloadTexture(id, url)
      .then((data) => {
        if (mountedRef.current) {
          setResult({ data, loading: false, error: null, progress: 1 });
        }
      })
      .catch((err) => {
        if (mountedRef.current) {
          setResult({ data: null, loading: false, error: String(err), progress: 1 });
        }
      });

    return () => { mountedRef.current = false; };
  }, [engine, id, url]);

  return result;
}
