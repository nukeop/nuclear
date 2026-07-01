import type { FC, PropsWithChildren } from 'react';
import { useCallback, useEffect } from 'react';

import { Sound, Volume } from '@nuclearplayer/hifi';
import { usePlatform } from '@nuclearplayer/ui';

import { useCoreSetting } from '../hooks/useCoreSetting';
import { eventBus } from '../services/eventBus';
import { Logger } from '../services/logger';
import { useQueueStore } from '../stores/queueStore';
import { useSoundStore } from '../stores/soundStore';
import { resolveErrorMessage } from '../utils/logging';

// WebKitGTK's Web Audio GStreamer pipeline is hardcoded to 44100 Hz, which
// causes silent audio over Bluetooth A2DP (PipeWire sinks expect 48000 Hz).
// Forcing the AudioContext to 48000 Hz on Linux avoids the mismatch.
const LINUX_SAMPLE_RATE_HZ = 48000;

export const SoundProvider: FC<PropsWithChildren> = ({ children }) => {
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
    if (crossfadeMs !== undefined) {
      useSoundStore.getState().setCrossfadeMs(crossfadeMs);
    }
  }, [crossfadeMs]);

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
      eventBus.emit('trackStarted', currentItem.track);
    }
  }, []);

  const handleError = useCallback((error: Error) => {
    const message = resolveErrorMessage(error);
    Logger.streaming.error(`Playback error: ${message}`);

    const currentItem = useQueueStore.getState().getCurrentItem();
    if (currentItem) {
      useQueueStore
        .getState()
        .updateItemState(currentItem.id, { status: 'error', error: message });
    }
  }, []);

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
        >
          <Volume value={volumePercent} />
        </Sound>
      )}
      {children}
    </>
  );
};
