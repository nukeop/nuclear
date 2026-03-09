import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
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
import { Destination } from './plugins/Destination';
import { SoundProps } from './types';

const PROTOCOLS_WITHOUT_WEB_AUDIO = new Set(['mse', 'hls']);

export const Sound: React.FC<SoundProps> = ({
  src,
  status,
  seek,
  volume,
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
  const [audioNodes, setAudioNodes] = useState<AudioNode[]>([]);

  useEffect(() => {
    if (source) {
      setAudioNodes([source]);
    } else {
      setAudioNodes([]);
    }
  }, [source]);

  useEffect(() => {
    if (!source || !context) {
      return;
    }

    if (!children) {
      source.connect(context.destination);
      return () => {
        source.disconnect();
      };
    }
  }, [source, context, children]);

  usePlaybackStatus(audioRef, status, context, isReady, canPlay);
  useAudioSeek(audioRef, seek, isReady);
  useAudioLoader(audioRef, src, isReady);
  useHlsSource(audioRef, src, isReady);
  useMseSource(audioRef, src, isReady);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || volume === undefined) {
      return;
    }

    if (PROTOCOLS_WITHOUT_WEB_AUDIO.has(src.protocol)) {
      audio.volume = Math.max(0, Math.min(1, volume / 100));
    }
  }, [volume, src.protocol]);

  const handleRegisterPlugin = useCallback((node: AudioNode) => {
    setAudioNodes((prev) => [...prev, node]);
  }, []);

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

  const childArray = children
    ? Children.toArray(children).filter(isValidElement)
    : [];

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
      {isReady && context && childArray.length > 0 && (
        <>
          {childArray.map((child, idx) =>
            cloneElement(child as React.ReactElement<Record<string, unknown>>, {
              key: idx,
              audioContext: context,
              previousNode: audioNodes[idx],
              onRegister: handleRegisterPlugin,
            }),
          )}
          <Destination
            key="destination"
            audioContext={context}
            previousNode={audioNodes[childArray.length]}
          />
        </>
      )}
    </>
  );
};
