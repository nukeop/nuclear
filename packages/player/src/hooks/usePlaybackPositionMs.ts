import { useEffect, useState } from 'react';

import { secondsToMs } from '../utils/time';

export const usePlaybackPositionMs = (
  seekSeconds: number,
  isAdvancing: boolean,
) => {
  const [elapsed, setElapsed] = useState({ seekSeconds, ms: 0 });

  useEffect(() => {
    if (!isAdvancing) {
      return;
    }
    const startedAt = performance.now();
    const tick = () => {
      setElapsed({ seekSeconds, ms: performance.now() - startedAt });
      frame = requestAnimationFrame(tick);
    };
    let frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seekSeconds, isAdvancing]);

  const elapsedMs =
    isAdvancing && elapsed.seekSeconds === seekSeconds ? elapsed.ms : 0;

  return secondsToMs(seekSeconds) + elapsedMs;
};
