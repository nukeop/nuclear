import { useState } from 'react';

const OFFSET_STEP_MS = 100;

export const useLyricsOffset = (trackId: string | undefined) => {
  const [offset, setOffset] = useState({ trackId, ms: 0 });
  const offsetMs = offset.trackId === trackId ? offset.ms : 0;
  const shiftBy = (stepMs: number) =>
    setOffset({ trackId, ms: offsetMs + stepMs });

  return {
    offsetMs,
    showEarlier: () => shiftBy(-OFFSET_STEP_MS),
    showLater: () => shiftBy(OFFSET_STEP_MS),
  };
};
