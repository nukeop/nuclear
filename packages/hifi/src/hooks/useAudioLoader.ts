import { RefObject, useEffect, useRef } from 'react';

import { AudioSource } from '../types';

export const useAudioLoader = (
  audioRef: RefObject<HTMLAudioElement | null>,
  src: AudioSource,
) => {
  const prevUrl = useRef<string | null>(null);

  useEffect(() => {
    if (src.protocol === 'hls' || src.protocol === 'mse') {
      return;
    }

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (src.url !== prevUrl.current) {
      if (src.mimeType) {
        audio.removeAttribute('src');
        audio.replaceChildren(createSourceElement(src.url, src.mimeType));
      } else {
        audio.replaceChildren();
        audio.src = src.url;
      }
      audio.load();
      prevUrl.current = src.url;
    }
  }, [src, audioRef]);
};

const createSourceElement = (url: string, mimeType: string) => {
  const source = document.createElement('source');
  source.src = url;
  source.type = mimeType;
  return source;
};
