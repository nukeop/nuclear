import { RefObject, useEffect, useRef } from 'react';

import { AudioSource, SoundStatus } from '../types';

export const useAudioLoader = (
  audioRef: RefObject<HTMLAudioElement | null>,
  src: AudioSource,
  status: SoundStatus,
  isReady: boolean,
) => {
  const prevUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (src.protocol === 'hls') {
      return;
    }

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (src.url !== prevUrl.current) {
      audio.src = src.url;
      audio.load();
      prevUrl.current = src.url;

      if (status === 'playing') {
        audio.play();
      }
    }
  }, [src, status, isReady, audioRef]);
};
