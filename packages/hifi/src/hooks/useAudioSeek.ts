import { RefObject, useEffect, useRef } from 'react';

export const useAudioSeek = (
  audioRef: RefObject<HTMLAudioElement | null>,
  seek: number | undefined,
) => {
  const lastSeekRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || seek == null) {
      return;
    }

    const currentTime = audio.currentTime;
    const seekDelta = Math.abs(seek - currentTime);

    if (lastSeekRef.current !== seek && seekDelta > 0.5) {
      audio.currentTime = seek;
    }
    lastSeekRef.current = seek;
  }, [seek, audioRef]);
};
