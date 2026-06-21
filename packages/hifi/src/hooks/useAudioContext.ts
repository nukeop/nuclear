import { useEffect, useState } from 'react';

const PREFERRED_SAMPLE_RATE = 48000;

export const useAudioContext = () => {
  const [context, setContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    const ctx = new AudioContext({
      latencyHint: 'playback',
      sampleRate: PREFERRED_SAMPLE_RATE,
    });
    setContext(ctx);

    return () => {
      ctx.close();
    };
  }, []);

  return context;
};
