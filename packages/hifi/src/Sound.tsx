import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useRef,
  useState,
} from 'react';

import { useAudioContext } from './hooks/useAudioContext';
import { useAudioElementSource } from './hooks/useAudioElementSource';
import { useAudioEvents } from './hooks/useAudioEvents';
import { useAudioLoader } from './hooks/useAudioLoader';
import { useAudioSeek } from './hooks/useAudioSeek';
import { useHlsSource } from './hooks/useHlsSource';
import { useMseSource } from './hooks/useMseSource';
import { usePlaybackStatus } from './hooks/usePlaybackStatus';
import { SoundProps } from './types';

export const Sound: React.FC<SoundProps> = ({
  src,
  status,
  seek,
  preload = 'auto',
  crossOrigin = '',
  onTimeUpdate,
  onEnd,
  onLoadStart,
  onCanPlay,
  onError,
  children,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const context = useAudioContext();
  const { source } = useAudioElementSource(audioRef, context);
  const isReady = !!source;
  const [canPlay, setCanPlay] = useState(false);

  usePlaybackStatus(audioRef, status, context, isReady, canPlay);
  useAudioSeek(audioRef, seek, isReady);
  useAudioLoader(audioRef, src, isReady);
  useHlsSource(audioRef, src, isReady);
  useMseSource(audioRef, src, isReady);

  const handleCanPlay = useCallback(() => {
    setCanPlay(true);
    onCanPlay?.();
  }, [onCanPlay]);

  const handleLoadStart = useCallback(() => {
    setCanPlay(false);
    onLoadStart?.();
  }, [onLoadStart]);

  const { handleTimeUpdate, handleError } = useAudioEvents({
    onTimeUpdate,
    onError,
  });

  return (
    <>
      <audio
        ref={audioRef}
        hidden
        preload={preload}
        crossOrigin={crossOrigin}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnd}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
      />
      {isReady &&
        context &&
        children &&
        Children.map(children, (child, idx) =>
          isValidElement(child)
            ? cloneElement(
                child as React.ReactElement<Record<string, unknown>>,
                {
                  audioContext: context,
                  previousNode: idx === 0 ? (source ?? undefined) : undefined,
                },
              )
            : child,
        )}
    </>
  );
};
