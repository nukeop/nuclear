import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useAudioContext } from './hooks/useAudioContext';
import { useAudioElementSource } from './hooks/useAudioElementSource';
import { AudioSource, SoundProps } from './types';

const DEFAULT_CROSSFADE_MS = 0;

export const CrossfadeSound: React.FC<
  SoundProps & {
    crossfadeMs?: number;
  }
> = ({
  src,
  status,
  seek,
  crossfadeMs = DEFAULT_CROSSFADE_MS,
  preload = 'auto',
  crossOrigin = '',
  onTimeUpdate,
  onEnd,
  onLoadStart,
  onError,
  children,
}) => {
  const audioRefA = useRef<HTMLAudioElement | null>(null);
  const audioRefB = useRef<HTMLAudioElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const context = useAudioContext();
  const { source: sourceA } = useAudioElementSource(audioRefA, context);
  const { source: sourceB } = useAudioElementSource(audioRefB, context);
  const isReady = !!sourceA && !!sourceB;

  const prevSrc = useRef<AudioSource>(src);

  const adapters = useMemo(
    () =>
      [
        {
          id: 0,
          ref: audioRefA,
          source: sourceA,
        },
        {
          id: 1,
          ref: audioRefB,
          source: sourceB,
        },
      ] as const,
    [sourceA, sourceB],
  );

  const current = adapters[activeIndex];
  const next = adapters[1 - activeIndex];

  useEffect(() => {
    if (!isReady) {
      return;
    }
    const audio = current.ref.current;
    const inactiveAudio = next.ref.current;
    if (!audio) {
      return;
    }
    switch (status) {
      case 'playing': {
        context?.resume();
        audio.play();
        break;
      }
      case 'paused': {
        audio.pause();
        inactiveAudio?.pause();
        break;
      }
      case 'stopped': {
        audio.pause();
        audio.currentTime = 0;
        inactiveAudio?.pause();
        if (inactiveAudio) {
          inactiveAudio.currentTime = 0;
        }
        break;
      }
    }
  }, [status, isReady, activeIndex, context, next.ref]);

  const lastSeekRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (!isReady) {
      return;
    }
    const audio = current.ref.current;
    if (!audio || seek == null) {
      return;
    }

    const currentTime = audio.currentTime;
    const seekDelta = Math.abs(seek - currentTime);

    if (lastSeekRef.current !== seek && seekDelta > 0.5) {
      audio.currentTime = seek;
    }
    lastSeekRef.current = seek;
  }, [seek, isReady, activeIndex]);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (src === prevSrc.current) {
      return;
    }
    const nextIndex = 1 - activeIndex;
    if (crossfadeMs === 0) {
      setActiveIndex(nextIndex);
      prevSrc.current = src;
      return;
    }
    const currentAudio = current.ref.current;
    const nextAudio = next.ref.current;
    if (!currentAudio || !nextAudio || !context) {
      return;
    }
    nextAudio.load();
    nextAudio.play();
    setTimeout(() => {
      setActiveIndex(nextIndex);
      if (currentAudio) {
        currentAudio.pause();
      }
      prevSrc.current = src;
    }, crossfadeMs);
  }, [src, crossfadeMs, isReady, activeIndex, context]);

  const handleTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLAudioElement>) => {
      if (onTimeUpdate) {
        const el = e.currentTarget;
        onTimeUpdate({ position: el.currentTime, duration: el.duration });
      }
    },
    [onTimeUpdate],
  );

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLAudioElement>) => {
      if (onError) {
        const el = e.currentTarget as HTMLAudioElement & {
          error: MediaError | null;
        };
        onError(new Error(el.error?.message || 'Unknown audio error'));
      }
    },
    [onError],
  );

  return (
    <>
      {[adapters[0], adapters[1]].map((adapter) => (
        <audio
          key={adapter.id}
          ref={adapter.ref}
          hidden
          preload={preload}
          crossOrigin={crossOrigin}
          data-is-active={activeIndex === adapter.id}
          onTimeUpdate={handleTimeUpdate}
          onEnded={onEnd}
          onLoadStart={onLoadStart}
          onError={handleError}
        >
          <source
            src={activeIndex === adapter.id ? prevSrc.current.url : src.url}
          />
        </audio>
      ))}
      {isReady &&
        context &&
        children &&
        Children.map(children, (child, idx) =>
          isValidElement(child)
            ? cloneElement(
                child as React.ReactElement<Record<string, unknown>>,
                {
                  audioContext: context,
                  previousNode:
                    idx === 0 ? (current.source ?? undefined) : undefined,
                },
              )
            : child,
        )}
    </>
  );
};
