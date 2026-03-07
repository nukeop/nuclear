import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { PlayerBar } from '@nuclearplayer/ui';

import { useQueueStore } from '../../stores/queueStore';
import { useSoundStore } from '../../stores/soundStore';

export const ConnectedControls: FC = () => {
  const {
    shuffleEnabled,
    repeatMode,
    goToNext,
    goToPrevious,
    setShuffleEnabled,
    setRepeatMode,
  } = useQueueStore(
    useShallow((s) => ({
      shuffleEnabled: s.shuffleEnabled,
      repeatMode: s.repeatMode,
      goToNext: s.goToNext,
      goToPrevious: s.goToPrevious,
      setShuffleEnabled: s.setShuffleEnabled,
      setRepeatMode: s.setRepeatMode,
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
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  return (
    <PlayerBar.Controls
      isPlaying={status === 'playing'}
      isShuffleActive={shuffleEnabled}
      repeatMode={repeatMode}
      onPlayPause={toggle}
      onNext={goToNext}
      onPrevious={goToPrevious}
      onShuffleToggle={handleToggleShuffle}
      onRepeatToggle={handleToggleRepeat}
    />
  );
};
