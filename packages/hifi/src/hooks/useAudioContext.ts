import { useEffect, useState } from 'react';

export const useAudioContext = () => {
  const [context, setContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    const ctx = new AudioContext({ latencyHint: 'playback' });
    setContext(ctx);

    return () => {
      ctx.close();
    };
  }, []);

  return context;
};
