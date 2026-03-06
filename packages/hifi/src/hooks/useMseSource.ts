import { RefObject, useEffect, useRef } from 'react';

import { AudioSource } from '../types';

const MSE_MIME_TYPE = 'audio/mp4; codecs="mp4a.40.2"';

export const useMseSource = (
  audioRef: RefObject<HTMLAudioElement | null>,
  src: AudioSource,
  isReady: boolean,
) => {
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!isReady || !audio || src.protocol !== 'mse') {
      return;
    }

    const abortController = new AbortController();
    const mediaSource = new MediaSource();
    const objectUrl = URL.createObjectURL(mediaSource);
    objectUrlRef.current = objectUrl;
    audio.src = objectUrl;

    mediaSource.addEventListener('sourceopen', () => {
      const sourceBuffer = mediaSource.addSourceBuffer(MSE_MIME_TYPE);

      fetch(src.url, { signal: abortController.signal })
        .then((response) => response.arrayBuffer())
        .then((data) => {
          sourceBuffer.appendBuffer(data);
          sourceBuffer.addEventListener('updateend', () => {
            if (mediaSource.readyState === 'open') {
              mediaSource.endOfStream();
            }
          }, { once: true });
        })
        .catch(() => {
          if (abortController.signal.aborted) {
            return;
          }
          if (mediaSource.readyState === 'open') {
            mediaSource.endOfStream('network');
          }
        });
    }, { once: true });

    return () => {
      abortController.abort();
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [src.url, src.protocol, isReady, audioRef]);
};
