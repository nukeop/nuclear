import type { FC, PropsWithChildren } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import { LoggerProvider, Sound, SoundError, Volume } from '@nuclearplayer/hifi';
import type { TFunction } from '@nuclearplayer/i18n';
import { useTranslation } from '@nuclearplayer/i18n';
import { usePlatform } from '@nuclearplayer/ui';

import { useCoreSetting } from '../hooks/useCoreSetting';
import { eventBus } from '../services/eventBus';
import { Logger } from '../services/logger';
import { useQueueStore } from '../stores/queueStore';
import { useSoundStore } from '../stores/soundStore';
import { errorMessage } from '../utils/errorMessage';

// WebKitGTK's Web Audio GStreamer pipeline is hardcoded to 44100 Hz, which
// causes silent audio over Bluetooth A2DP (PipeWire sinks expect 48000 Hz).
// Forcing the AudioContext to 48000 Hz on Linux avoids the mismatch.
const LINUX_SAMPLE_RATE_HZ = 48000;

const describePlaybackError = (error: Error, t: TFunction): string => {
  if (error instanceof SoundError) {
    return t(`errors.hifi.${error.code}`, { details: error.details });
  }
  return errorMessage(error);
};

export const SoundProvider: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation('streaming');
  const { src, status, seek } = useSoundStore();
  const [crossfadeMs] = useCoreSetting<number>('playback.crossfadeMs');
  const preload: HTMLAudioElement['preload'] = 'auto';
  const crossOrigin = '' as const;
  const [volume01] = useCoreSetting<number>('playback.volume');
  const [muted] = useCoreSetting<boolean>('playback.muted');
  const volumePercent = muted ? 0 : Math.round((volume01 ?? 1) * 100);
  const platform = usePlatform();
  const sampleRate = platform === 'linux' ? LINUX_SAMPLE_RATE_HZ : undefined;

  useEffect(() => {
    LoggerProvider.init(Logger.streaming);
  }, []);

  useEffect(() => {
    if (crossfadeMs !== undefined) {
      useSoundStore.getState().setCrossfadeMs(crossfadeMs);
    }
  }, [crossfadeMs]);

  const startedItemId = useRef<string | null>(null);

  useEffect(() => {
    const isResumingMidTrack = src?.startPositionSeconds !== undefined;
    if (!isResumingMidTrack) {
      startedItemId.current = null;
    }
  }, [src]);

  const handleTimeUpdate = useCallback(
    ({ position, duration }: { position: number; duration: number }) => {
      useSoundStore.getState().updatePlayback(position, duration);
    },
    [],
  );

  const handleEnd = useCallback(() => {
    const currentTrack = useQueueStore.getState().getCurrentItem()?.track;
    if (currentTrack) {
      eventBus.emit('trackFinished', currentTrack);
    }

    useQueueStore.getState().advanceOnTrackEnd();
  }, []);

  const handleCanPlay = useCallback(() => {
    const currentItem = useQueueStore.getState().getCurrentItem();
    if (currentItem) {
      useQueueStore
        .getState()
        .updateItemState(currentItem.id, { status: 'success' });
      if (startedItemId.current !== currentItem.id) {
        startedItemId.current = currentItem.id;
        eventBus.emit('trackStarted', currentItem.track);
      }
    }
  }, []);

  const handleSourceInvalid = useCallback(() => {
    const currentTrack = useQueueStore.getState().getCurrentItem()?.track;
    if (currentTrack) {
      eventBus.emit('streamSourceInvalid', currentTrack);
    }
  }, []);

  const handleError = useCallback(
    (error: Error) => {
      const message = describePlaybackError(error, t);
      Logger.streaming.error(`Playback error: ${message}`);

      const currentItem = useQueueStore.getState().getCurrentItem();
      if (currentItem) {
        useQueueStore
          .getState()
          .updateItemState(currentItem.id, { status: 'error', error: message });
      }
    },
    [t],
  );

  return (
    <>
      {src && (
        <Sound
          src={src}
          status={status}
          seek={seek}
          volume={volumePercent}
          sampleRate={sampleRate}
          preload={preload}
          crossOrigin={crossOrigin}
          onTimeUpdate={handleTimeUpdate}
          onEnd={handleEnd}
          onCanPlay={handleCanPlay}
          onError={handleError}
          onSourceInvalid={handleSourceInvalid}
        >
          <Volume value={volumePercent} />
        </Sound>
      )}
      {children}
    </>
  );
};
