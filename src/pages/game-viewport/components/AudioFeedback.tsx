import { useEffect, useRef } from 'react';
import { useAudio } from '../../../engine';
import { useCameraState } from './camera/CameraStateProvider';
import { useSelection } from './selection/SelectionContext';
import { useViewport } from '../../../components/feature/ViewportControls';

export default function AudioFeedback() {
  const { play } = useAudio();
  const { level } = useCameraState();
  const { selected } = useSelection();
  const { viewport } = useViewport();

  const prevLevel = useRef(level);
  const prevSelection = useRef(selected);
  const prevPaused = useRef(viewport.paused);
  const prevSpeed = useRef(viewport.speed);

  useEffect(() => {
    if (prevLevel.current !== level) {
      play('ui_zoom', { category: 'ui', volume: 0.35 });
      prevLevel.current = level;
    }
  }, [level, play]);

  useEffect(() => {
    if (prevSelection.current !== selected) {
      if (prevSelection.current !== null && selected === null) {
        play('ui_deselect', { category: 'ui', volume: 0.25 });
      } else if (selected !== null) {
        play('ui_select', { category: 'ui', volume: 0.4 });
      }
      prevSelection.current = selected;
    }
  }, [selected, play]);

  useEffect(() => {
    if (prevPaused.current !== viewport.paused) {
      play(viewport.paused ? 'ui_pause' : 'ui_resume', { category: 'ui', volume: 0.3 });
      prevPaused.current = viewport.paused;
    }
  }, [viewport.paused, play]);

  useEffect(() => {
    if (prevSpeed.current !== viewport.speed) {
      play('ui_speed', { category: 'ui', volume: 0.2 });
      prevSpeed.current = viewport.speed;
    }
  }, [viewport.speed, play]);

  return null;
}
