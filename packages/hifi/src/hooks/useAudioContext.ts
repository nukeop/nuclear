import { useEffect, useState } from 'react';

export const useAudioContext = (sampleRate?: number) => {
  const [context, setContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    const ctx = new AudioContext({ latencyHint: 'playback', sampleRate });
    setContext(ctx);

    return () => {
      ctx.close();
    };
  }, [sampleRate]);

  return context;
};
