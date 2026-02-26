import { Children, cloneElement, isValidElement, useRef } from 'react';

import { useAudioContext } from './hooks/useAudioContext';
import { useAudioElementSource } from './hooks/useAudioElementSource';
import { useAudioEvents } from './hooks/useAudioEvents';
import { useAudioLoader } from './hooks/useAudioLoader';
import { useAudioSeek } from './hooks/useAudioSeek';
import { useHlsSource } from './hooks/useHlsSource';
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
  const { source, gain } = useAudioElementSource(audioRef, context);
  const isReady = !!source && !!gain;

  usePlaybackStatus(audioRef, status, context, isReady);
  useAudioSeek(audioRef, seek, isReady);
  useAudioLoader(audioRef, src, status, isReady);
  useHlsSource(audioRef, src, isReady);

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
        onLoadStart={onLoadStart}
        onCanPlay={onCanPlay}
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
