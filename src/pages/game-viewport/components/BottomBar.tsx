import { useViewport } from '../../../components/feature/ViewportControls';
import { useCameraState, type CameraLevel } from './camera/CameraStateProvider';
import { useSelection } from './selection/SelectionContext';

export default function BottomBar() {
  const { viewport, setViewport } = useViewport();
  const { level, setLevel, setTarget } = useCameraState();
  const { selected, clear } = useSelection();

  const handleLevelUp = () => {
    const levels: CameraLevel[] = ['galaxy', 'system', 'planet'];
    const idx = levels.indexOf(level);
    if (idx < levels.length - 1) {
      setLevel(levels[idx + 1]);
      clear();
    }
  };

  const handleLevelDown = () => {
    const levels: CameraLevel[] = ['galaxy', 'system', 'planet'];
    const idx = levels.indexOf(level);
    if (idx > 0) {
      setLevel(levels[idx - 1]);
      setTarget(null);
    }
  };

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center px-3"
      style={{
        height: 36,
        background: 'rgba(5,7,10,0.9)',
        borderTop: '1px solid rgba(30,42,54,0.6)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Left: Level navigation */}
      <div className="flex items-center gap-1.5" style={{ width: 190 }}>
        <button
          onClick={handleLevelDown}
          className="w-6 h-6 flex items-center justify-center rounded transition-all hover:bg-white/5 disabled:opacity-30"
          style={{ color: '#5a6577' }}
          disabled={level === 'galaxy'}
        >
          <i className="ri-zoom-out-line text-xs"></i>
        </button>
        <span className="text-2xs font-bold uppercase tracking-wider" style={{ color: '#38bdf8', fontSize: 9 }}>
          {level}
        </span>
        <button
          onClick={handleLevelUp}
          className="w-6 h-6 flex items-center justify-center rounded transition-all hover:bg-white/5 disabled:opacity-30"
          style={{ color: '#5a6577' }}
          disabled={level === 'planet'}
        >
          <i className="ri-zoom-in-line text-xs"></i>
        </button>

        <div className="w-px h-4 mx-1" style={{ background: '#1e2a36' }} />

        {/* Entity count */}
        <span className="text-2xs" style={{ color: '#5a6577', fontSize: 9 }}>
          {selected ? `${selected.type}: ${selected.label}` : 'No selection'}
        </span>
      </div>

      {/* Center: Speed controls */}
      <div className="flex-1 flex items-center justify-center gap-1">
        <button
          onClick={() => setViewport({ paused: !viewport.paused })}
          className="w-6 h-6 flex items-center justify-center rounded transition-all hover:bg-white/5"
          style={{
            color: viewport.paused ? '#f87171' : '#5bc0be',
            border: `1px solid ${viewport.paused ? 'rgba(248,113,113,0.25)' : 'rgba(91,192,190,0.2)'}`,
          }}
          title={viewport.paused ? 'Resume' : 'Pause'}
        >
          <i className={`${viewport.paused ? 'ri-play-line' : 'ri-pause-line'} text-xs`}></i>
        </button>
        {[1, 2, 3, 4].map((s) => (
          <button
            key={s}
            onClick={() => setViewport({ speed: s as 1 | 2 | 3 | 4, paused: false })}
            className="w-6 h-6 flex items-center justify-center rounded text-2xs font-bold transition-all"
            style={{
              color: viewport.speed === s && !viewport.paused ? '#e2c044' : '#5a6577',
              background: viewport.speed === s && !viewport.paused ? 'rgba(226,192,68,0.12)' : 'transparent',
              border: viewport.speed === s && !viewport.paused ? '1px solid rgba(226,192,68,0.25)' : '1px solid transparent',
            }}
          >
            {s}x
          </button>
        ))}

        <div className="w-px h-4 mx-1" style={{ background: '#1e2a36' }} />

        <span className="text-2xs font-mono" style={{ color: '#5a6577', fontSize: 9 }}>
          Zoom: {Math.round(viewport.zoom * 100)}%
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1" style={{ width: 190, justifyContent: 'flex-end' }}>
        <button
          onClick={() => { setLevel('galaxy'); setTarget(null); clear(); setViewport({ zoom: 1 }); }}
          className="flex items-center gap-1 px-2 py-1 rounded text-2xs transition-all hover:bg-white/5"
          style={{ color: '#5a6577', fontSize: 9 }}
        >
          <i className="ri-home-4-line text-xs"></i>
          <span className="hidden sm:block">Reset</span>
        </button>
        <button
          onClick={() => setViewport({ zoom: Math.max(0.3, viewport.zoom - 0.2) })}
          className="w-6 h-6 flex items-center justify-center rounded transition-all hover:bg-white/5"
          style={{ color: '#5a6577' }}
        >
          <i className="ri-subtract-line text-xs"></i>
        </button>
        <span className="text-2xs font-mono w-8 text-center" style={{ color: '#8892aa', fontSize: 10 }}>
          {Math.round(viewport.zoom * 100)}%
        </span>
        <button
          onClick={() => setViewport({ zoom: Math.min(3, viewport.zoom + 0.2) })}
          className="w-6 h-6 flex items-center justify-center rounded transition-all hover:bg-white/5"
          style={{ color: '#5a6577' }}
        >
          <i className="ri-add-line text-xs"></i>
        </button>
      </div>
    </footer>
  );
}
