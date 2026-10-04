import { useEffect, useState } from 'react';

import { useSoundStore } from '../../../stores/soundStore';
import { secondsToMs } from '../../../utils/time';

export const usePlaybackPositionMs = () => {
  const seekSeconds = useSoundStore((state) => state.seek);
  const isPlaying = useSoundStore((state) => state.status === 'playing');
  const [elapsed, setElapsed] = useState({ seekSeconds, ms: 0 });

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    const startedAt = performance.now();
    const tick = () => {
      setElapsed({ seekSeconds, ms: performance.now() - startedAt });
      frame = requestAnimationFrame(tick);
    };
    let frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seekSeconds, isPlaying]);

  const elapsedMs =
    isPlaying && elapsed.seekSeconds === seekSeconds ? elapsed.ms : 0;

  return secondsToMs(seekSeconds) + elapsedMs;
};
