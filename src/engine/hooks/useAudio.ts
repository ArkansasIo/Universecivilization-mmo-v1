import { useCallback, useRef, useEffect } from 'react';
import { useEngine } from '../EngineProvider';
import { type AudioCategory, type AudioPlayOptions } from '../types';

export function useAudio() {
  const engine = useEngine();
  const activeIds = useRef<Set<string>>(new Set());

  const play = useCallback((bufferId: string, options?: AudioPlayOptions): string | null => {
    if (!engine?.audio) return null;
    engine.audio.resume();
    const id = engine.audio.play(bufferId, options);
    if (id) activeIds.current.add(id);
    return id;
  }, [engine]);

  const stop = useCallback((playId: string) => {
    engine?.audio.stop(playId);
    activeIds.current.delete(playId);
  }, [engine]);

  const stopAll = useCallback((category?: AudioCategory) => {
    engine?.audio.stopAll(category);
    if (!category) activeIds.current.clear();
  }, [engine]);

  const load = useCallback(async (id: string, url: string) => {
    if (!engine?.audio) return;
    await engine.audio.loadBuffer(id, url);
  }, [engine]);

  const setVolume = useCallback((category: AudioCategory, volume: number) => {
    engine?.audio.setVolume(category, volume);
  }, [engine]);

  const mute = useCallback((category: AudioCategory, muted: boolean) => {
    engine?.audio.muteCategory(category, muted);
  }, [engine]);

  useEffect(() => {
    return () => {
      activeIds.current.forEach((id) => engine?.audio.stop(id));
      activeIds.current.clear();
    };
  }, [engine]);

  return { play, stop, stopAll, load, setVolume, mute };
}

export function useAudioBuffer(id: string, url: string) {
  const engine = useEngine();
  const loaded = useRef(false);

  useEffect(() => {
    if (!engine?.audio || !url || loaded.current) return;
    loaded.current = true;
    engine.audio.loadBuffer(id, url).catch(() => {});
  }, [engine, id, url]);
}
