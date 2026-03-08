import { RefObject, useEffect, useState } from 'react';

export const useAudioElementSource = (
  audioRef: RefObject<HTMLAudioElement | null>,
  context: AudioContext | null,
) => {
  const [source, setSource] = useState<MediaElementAudioSourceNode | null>(
    null,
  );

  useEffect(() => {
    if (!context || !audioRef.current) {
      return;
    }

    const audioSource = context.createMediaElementSource(audioRef.current);
    setSource(audioSource);

    return () => {
      audioSource.disconnect();
    };
  }, [context, audioRef]);

  return { source };
};
