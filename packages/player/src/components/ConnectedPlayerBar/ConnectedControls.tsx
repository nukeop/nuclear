import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useTranslation } from '@nuclearplayer/i18n';
import { RepeatMode } from '@nuclearplayer/plugin-sdk';
import { PlayerBar } from '@nuclearplayer/ui';

import { useCoreSetting } from '../../hooks/useCoreSetting';
import { useQueueStore } from '../../stores/queueStore';
import { useSoundStore } from '../../stores/soundStore';

export const ConnectedControls: FC = () => {
  const { t } = useTranslation('playerBar');
  const [shuffleEnabled, setShuffleEnabled] =
    useCoreSetting<boolean>('playback.shuffle');
  const [repeatMode, setRepeatMode] =
    useCoreSetting<RepeatMode>('playback.repeat');
  const [discoveryEnabled, setDiscoveryEnabled] =
    useCoreSetting<boolean>('playback.discovery');

  const { goToNext, goToPrevious } = useQueueStore(
    useShallow((state) => ({
      goToNext: state.goToNext,
      goToPrevious: state.goToPrevious,
    })),
  );
  const { status, toggle } = useSoundStore(
    useShallow((state) => ({
      status: state.status,
      toggle: state.toggle,
    })),
  );

  const handleToggleShuffle = () => {
    setShuffleEnabled(!shuffleEnabled);
  };

  const handleToggleDiscovery = () => {
    setDiscoveryEnabled(!discoveryEnabled);
  };

  const handleToggleRepeat = () => {
    const modes: Array<RepeatMode> = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode ?? 'off');
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  return (
    <PlayerBar.Controls
      isPlaying={status === 'playing'}
      isShuffleActive={Boolean(shuffleEnabled)}
      repeatMode={repeatMode ?? 'off'}
      onPlayPause={toggle}
      onNext={goToNext}
      onPrevious={goToPrevious}
      onShuffleToggle={handleToggleShuffle}
      onRepeatToggle={handleToggleRepeat}
      isDiscoveryActive={!!discoveryEnabled}
      onDiscoveryToggle={handleToggleDiscovery}
      labels={{
        shuffleOn: t('shuffleOn'),
        shuffleOff: t('shuffleOff'),
        repeatOff: t('repeatOff'),
        repeatAll: t('repeatAll'),
        repeatOne: t('repeatOne'),
        discoveryOn: t('discoveryOn'),
        discoveryOff: t('discoveryOff'),
      }}
    />
  );
};
