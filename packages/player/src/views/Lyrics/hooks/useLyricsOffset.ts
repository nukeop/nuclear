import { useState } from 'react';

export const useLyricsOffset = () => {
  const [offsetMs, setOffsetMs] = useState(0);

  return {
    offsetMs,
    showEarlier: () => setOffsetMs((offset) => offset - 100),
    showLater: () => setOffsetMs((offset) => offset + 100),
  };
};
