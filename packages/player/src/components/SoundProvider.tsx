import type { FC, PropsWithChildren } from 'react';
import { useCallback, useEffect } from 'react';

import { Sound, Volume } from '@nuclearplayer/hifi';

import { useStreamResolution } from '../hooks/useStreamResolution';
import { useQueueStore } from '../stores/queueStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useSoundStore } from '../stores/soundStore';

export const SoundProvider: FC<PropsWithChildren> = ({ children }) => {
  useStreamResolution();
  const { src, status, seek } = useSoundStore();
  const getValue = useSettingsStore((s) => s.getValue);
  const crossfadeMs = getValue('core.playback.crossfadeMs') as number;
  const preload: HTMLAudioElement['preload'] = 'auto';
  const crossOrigin = '' as const;
  const volume01 = (getValue('core.playback.volume') as number) ?? 1;
  const muted = (getValue('core.playback.muted') as boolean) ?? false;
  const volumePercent = muted ? 0 : Math.round(volume01 * 100);

  useEffect(() => {
    const { setCrossfadeMs } = useSoundStore.getState();
    setCrossfadeMs(crossfadeMs);
  }, [crossfadeMs]);

  const handleTimeUpdate = useCallback(
    ({ position, duration }: { position: number; duration: number }) => {
      useSoundStore.getState().updatePlayback(position, duration);
    },
    [],
  );

  const handleEnd = useCallback(() => {
    useQueueStore.getState().goToNext();
  }, []);

  const handleCanPlay = useCallback(() => {
    const currentItem = useQueueStore.getState().getCurrentItem();
    if (currentItem) {
      useQueueStore
        .getState()
        .updateItemState(currentItem.id, { status: 'success' });
    }
  }, []);

  return (
    <>
      {src && (
        <Sound
          src={src}
          status={status}
          seek={seek}
          preload={preload}
          crossOrigin={crossOrigin}
          onTimeUpdate={handleTimeUpdate}
          onEnd={handleEnd}
          onCanPlay={handleCanPlay}
        >
          <Volume value={volumePercent} />
        </Sound>
      )}
      {children}
    </>
  );
};
