import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { PlayerBar } from '@nuclearplayer/ui';

import { useQueueStore } from '../../stores/queue/queueStore';
import { useSoundStore } from '../../stores/soundStore';

export const ConnectedSeekBar: FC = () => {
  const currentItem = useQueueStore((s) => s.getCurrentItem());
  const { seek, duration, seekTo } = useSoundStore(
    useShallow((s) => ({
      seek: s.seek,
      duration: s.duration,
      seekTo: s.seekTo,
    })),
  );

  const safePosition = Number.isFinite(seek) ? seek : 0;
  const safeDuration = Number.isFinite(duration) ? duration : 0;
  const progress = safeDuration > 0 ? (safePosition / safeDuration) * 100 : 0;
  const remaining = safeDuration - safePosition;

  const handleSeek = (percent: number) => {
    if (duration > 0) {
      seekTo((percent / 100) * duration);
    }
  };

  return (
    <PlayerBar.SeekBar
      progress={progress}
      elapsedSeconds={safePosition}
      remainingSeconds={remaining}
      isLoading={currentItem?.status === 'loading'}
      onSeek={handleSeek}
    />
  );
};
