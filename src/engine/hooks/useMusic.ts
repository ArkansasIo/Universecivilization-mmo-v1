import { useState, useEffect, useCallback } from 'react';
import { useEngine } from '../EngineProvider';
import { type MusicPlaylist, type MusicTrack } from '../types';

export function useMusic() {
  const engine = useEngine();
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);

  useEffect(() => {
    if (!engine?.music) return;
    setCurrentTrack(engine.music.currentTrackId);
    setIsPlaying(engine.music['state']?.playing ?? false);
    setVolumeState(engine.music.volume);

    const check = setInterval(() => {
      setCurrentTrack(engine.music.currentTrackId);
      setIsPlaying(engine.music['state']?.playing ?? false);
    }, 500);

    return () => clearInterval(check);
  }, [engine]);

  const playPlaylist = useCallback(async (playlistId: string, startIndex?: number) => {
    await engine?.music.playPlaylist(playlistId, startIndex);
  }, [engine]);

  const playTrack = useCallback(async (trackId: string) => {
    await engine?.music.playTrack(trackId);
  }, [engine]);

  const stop = useCallback(() => {
    engine?.music.stop();
  }, [engine]);

  const pause = useCallback(() => {
    engine?.music.pause();
  }, [engine]);

  const resume = useCallback(() => {
    engine?.music.resume();
  }, [engine]);

  const next = useCallback(() => {
    engine?.music.next();
  }, [engine]);

  const previous = useCallback(() => {
    engine?.music.previous();
  }, [engine]);

  const setVolume = useCallback((vol: number) => {
    engine?.music.setVolume(vol);
    setVolumeState(vol);
  }, [engine]);

  const registerTrack = useCallback((track: MusicTrack) => {
    engine?.music.registerTrack(track);
  }, [engine]);

  const registerPlaylist = useCallback((playlist: MusicPlaylist) => {
    engine?.music.registerPlaylist(playlist);
  }, [engine]);

  return {
    currentTrack, isPlaying, volume,
    playPlaylist, playTrack, stop, pause, resume, next, previous,
    setVolume, registerTrack, registerPlaylist,
  };
}
