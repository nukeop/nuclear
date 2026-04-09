import type { FC, PropsWithChildren } from 'react';
import { useCallback, useEffect } from 'react';

import { Sound, Volume } from '@nuclearplayer/hifi';

import { useCoreSetting } from '../hooks/useCoreSetting';
import { eventBus } from '../services/eventBus';
import { Logger } from '../services/logger';
import { useQueueStore } from '../stores/queueStore';
import { useSoundStore } from '../stores/soundStore';
import { resolveErrorMessage } from '../utils/logging';

export const SoundProvider: FC<PropsWithChildren> = ({ children }) => {
  const { src, status, seek } = useSoundStore();
  const [crossfadeMs] = useCoreSetting<number>('playback.crossfadeMs');
  const preload: HTMLAudioElement['preload'] = 'auto';
  const crossOrigin = '' as const;
  const [volume01] = useCoreSetting<number>('playback.volume');
  const [muted] = useCoreSetting<boolean>('playback.muted');
  const volumePercent = muted ? 0 : Math.round((volume01 ?? 1) * 100);

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
