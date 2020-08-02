import React from 'react';
import { MiniPlayer } from '@nuclear/ui';

import {
  usePlayerControlsProps,
  useSeekbarProps,
  useTrackInfoProps,
  useVolumeControlsProps
} from '../PlayerBarContainer/hooks';
import { useMiniPlayerSettings } from './hooks';

const MiniPlayerContainer: React.FC = () => {
  const seekbarProps = useSeekbarProps();
  const playerControlsProps = usePlayerControlsProps();
  const trackInfoProps = useTrackInfoProps();
  const volumeControlsProps = useVolumeControlsProps();

  const {
    isMiniPlayerEnabled,
    toggleMiniPlayer
  } = useMiniPlayerSettings();

  console.log({isMiniPlayerEnabled})

  return <MiniPlayer
    {...seekbarProps}
    {...playerControlsProps}
    {...trackInfoProps}
    {...volumeControlsProps}
    onDisableMiniPlayer={toggleMiniPlayer}
    style={{
      zIndex: isMiniPlayerEnabled && 1000
    }}
  />
};

export default MiniPlayerContainer;