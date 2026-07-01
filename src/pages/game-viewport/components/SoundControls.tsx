import { useCallback, useEffect, useRef, useState } from 'react';
import { useEngine, useAudio, useMusic } from '../../../engine';
import type { AudioCategory } from '../../../engine';

const CATEGORIES: { key: AudioCategory; label: string; icon: string; color: string }[] = [
  { key: 'sfx', label: 'SFX', icon: 'ri-volume-up-line', color: '#f87171' },
  { key: 'ui', label: 'UI', icon: 'ri-smartphone-line', color: '#38bdf8' },
  { key: 'ambient', label: 'Ambient', icon: 'ri-leaf-line', color: '#4ade80' },
  { key: 'voice', label: 'Voice', icon: 'ri-voiceprint-line', color: '#a78bfa' },
  { key: 'music', label: 'Music', icon: 'ri-music-line', color: '#fbbf24' },
];

export default function SoundControls({ open, onClose }: { open: boolean; onClose: () => void }) {
  const engine = useEngine();
  const { setVolume, mute, stopAll } = useAudio();
  const music = useMusic();
  const panelRef = useRef<HTMLDivElement>(null);

  const [masterVol, setMasterVol] = useState(0.8);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) && !(e.target as HTMLElement).closest('.sound-controls-trigger')) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open, onClose]);

  const handleMasterChange = useCallback((vol: number) => {
    setMasterVol(vol);
    engine?.audio.setMasterVolume(vol);
  }, [engine]);

  const handleCategoryVolume = useCallback((category: AudioCategory, vol: number) => {
    setVolume(category, vol);
  }, [setVolume]);

  const handleMute = useCallback((category: AudioCategory, muted: boolean) => {
    mute(category, muted);
  }, [mute]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-1 w-64 rounded-lg overflow-hidden z-50"
      style={{ background: '#0d131a', border: '1px solid #1e2a36' }}
    >
      <div className="px-3 py-2 border-b" style={{ borderColor: 'rgba(30,42,54,0.4)' }}>
        <div className="text-2xs font-bold tracking-wider" style={{ color: '#5a6577', fontSize: 9 }}>
          SOUND SETTINGS
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Master volume */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold" style={{ color: '#8892aa' }}>Master</span>
            <span className="text-2xs font-mono" style={{ color: '#5a6577' }}>{Math.round(masterVol * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={masterVol}
            onChange={(e) => handleMasterChange(parseFloat(e.target.value))}
            className="w-full h-1 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(90deg, #38bdf8 ${masterVol * 100}%, #1e2a36 ${masterVol * 100}%)`,
              outline: 'none',
            }}
          />
        </div>

        {/* Category volumes */}
        {CATEGORIES.map((cat) => (
          <div key={cat.key}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <i className={`${cat.icon} text-xs`} style={{ color: cat.color }}></i>
                <span className="text-xs" style={{ color: '#8892aa' }}>{cat.label}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-2xs font-mono" style={{ color: '#5a6577' }}>
                  {Math.round((engine?.audio.getVolume(cat.key) ?? 0.5) * 100)}%
                </span>
                <button
                  onClick={() => handleMute(cat.key, !engine?.audio.isMuted(cat.key))}
                  className="w-4 h-4 flex items-center justify-center rounded transition-all hover:bg-white/10"
                  style={{ color: engine?.audio.isMuted(cat.key) ? '#f87171' : '#5a6577' }}
                  title={engine?.audio.isMuted(cat.key) ? 'Unmute' : 'Mute'}
                >
                  <i className={`${engine?.audio.isMuted(cat.key) ? 'ri-volume-mute-line' : 'ri-volume-up-line'} text-2xs`}></i>
                </button>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={engine?.audio.getVolume(cat.key) ?? 0.5}
              onChange={(e) => handleCategoryVolume(cat.key, parseFloat(e.target.value))}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(90deg, ${cat.color} ${(engine?.audio.getVolume(cat.key) ?? 0.5) * 100}%, #1e2a36 ${(engine?.audio.getVolume(cat.key) ?? 0.5) * 100}%)`,
                outline: 'none',
              }}
            />
          </div>
        ))}

        {/* Music section */}
        {music.currentTrack && (
          <div className="pt-1 border-t" style={{ borderColor: 'rgba(30,42,54,0.4)' }}>
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="text-2xs truncate" style={{ color: '#5a6577', fontSize: 9 }}>NOW PLAYING</div>
                <div className="text-xs truncate" style={{ color: '#fbbf24' }}>{music.currentTrack}</div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => music.isPlaying ? music.pause() : music.resume()}
                  className="w-6 h-6 flex items-center justify-center rounded transition-all hover:bg-white/10"
                  style={{ color: '#fbbf24' }}
                >
                  <i className={`${music.isPlaying ? 'ri-pause-line' : 'ri-play-line'} text-xs`}></i>
                </button>
                <button
                  onClick={() => music.stop()}
                  className="w-6 h-6 flex items-center justify-center rounded transition-all hover:bg-white/10"
                  style={{ color: '#f87171' }}
                  title="Stop"
                >
                  <i className="ri-stop-line text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
