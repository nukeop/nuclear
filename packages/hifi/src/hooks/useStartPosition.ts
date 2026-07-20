import { RefObject, useEffect } from 'react';

import { AudioSource } from '../types';

export const useStartPosition = (
  audioRef: RefObject<HTMLAudioElement | null>,
  src: AudioSource,
) => {
  const { url, startPositionSeconds } = src;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || startPositionSeconds === undefined) {
      return;
    }

    const applyStartPosition = () => {
      audio.currentTime = startPositionSeconds;
    };

    audio.addEventListener('loadedmetadata', applyStartPosition, {
      once: true,
    });
    return () => {
      audio.removeEventListener('loadedmetadata', applyStartPosition);
    };
  }, [url, startPositionSeconds, audioRef]);
};
