import { useState } from 'react';

const OFFSET_STEP_MS = 100;

export const useLyricsOffset = () => {
  const [offsetMs, setOffsetMs] = useState(0);

  return {
    offsetMs,
    showEarlier: () => setOffsetMs((current) => current - OFFSET_STEP_MS),
    showLater: () => setOffsetMs((current) => current + OFFSET_STEP_MS),
  };
};
