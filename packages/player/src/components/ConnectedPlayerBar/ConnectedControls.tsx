import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { PlayerBar } from '@nuclearplayer/ui';

import { useCoreSetting } from '../../hooks/useCoreSetting';
import { useQueueStore } from '../../stores/queueStore';
import { useSoundStore } from '../../stores/soundStore';

export const ConnectedControls: FC = () => {
  const [shuffleEnabled, setShuffleEnabled] =
    useCoreSetting<boolean>('playback.shuffle');
  const [repeatMode, setRepeatMode] = useCoreSetting<string>('playback.repeat');

  const { goToNext, goToPrevious } = useQueueStore(
    useShallow((s) => ({
      goToNext: s.goToNext,
      goToPrevious: s.goToPrevious,
    })),
  );
  const { status, toggle } = useSoundStore(
    useShallow((s) => ({
      status: s.status,
      toggle: s.toggle,
    })),
  );

  const handleToggleShuffle = () => {
    setShuffleEnabled(!shuffleEnabled);
  };

  const handleToggleRepeat = () => {
    const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(
      (repeatMode ?? 'off') as 'off' | 'all' | 'one',
    );
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  return (
    <PlayerBar.Controls
      isPlaying={status === 'playing'}
      isShuffleActive={!!shuffleEnabled}
      repeatMode={(repeatMode as 'off' | 'all' | 'one') ?? 'off'}
      onPlayPause={toggle}
      onNext={goToNext}
      onPrevious={goToPrevious}
      onShuffleToggle={handleToggleShuffle}
      onRepeatToggle={handleToggleRepeat}
    />
  );
};
