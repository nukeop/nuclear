import { useEffect, useState } from 'react';

const TICK_MS = 50;

export const useSimulatedPlayback = (durationMs: number) => {
  const [positionMs, setPositionMs] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setPositionMs((position) => (position + TICK_MS) % durationMs),
      TICK_MS,
    );
    return () => clearInterval(interval);
  }, [durationMs]);

  return positionMs;
};
