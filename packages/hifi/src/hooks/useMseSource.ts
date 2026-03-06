import { RefObject, useEffect, useRef } from 'react';

import { AudioSource } from '../types';

const MSE_MIME_TYPE = 'audio/mp4; codecs="mp4a.40.2"';

const pumpStream = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  sourceBuffer: SourceBuffer,
  mediaSource: MediaSource,
  signal: AbortSignal,
) => {
  const appendAndWait = (chunk: Uint8Array): Promise<void> =>
    new Promise((resolve, reject) => {
      sourceBuffer.addEventListener('updateend', () => resolve(), {
        once: true,
      });
      sourceBuffer.addEventListener('error', () => reject(), { once: true });
      sourceBuffer.appendBuffer(chunk as unknown as BufferSource);
    });

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (signal.aborted) {
      return;
    }

    const { done, value } = await reader.read();
    if (done) {
      if (mediaSource.readyState === 'open') {
        mediaSource.endOfStream();
      }
      return;
    }

    await appendAndWait(value);
  }
};

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

    mediaSource.addEventListener(
      'sourceopen',
      () => {
        const sourceBuffer = mediaSource.addSourceBuffer(MSE_MIME_TYPE);

        fetch(src.url, { signal: abortController.signal })
          .then((response) => {
            const reader = response.body!.getReader();
            return pumpStream(reader, sourceBuffer, mediaSource, abortController.signal);
          })
          .catch(() => {
            if (abortController.signal.aborted) {
              return;
            }
            if (mediaSource.readyState === 'open') {
              mediaSource.endOfStream('network');
            }
          });
      },
      { once: true },
    );

    return () => {
      abortController.abort();
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [src.url, src.protocol, isReady, audioRef]);
};
