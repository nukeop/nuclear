import React from 'react';
import { PlayerBar } from '@nuclear/ui';

import { 
  usePlayerControlsProps,
  useSeekbarProps,
  useTrackInfoProps,
  useVolumeControlsProps
} from './hooks';

const PlayerBarContainer = () => {
  const seekbarProps = useSeekbarProps();
  const playerControlsProps = usePlayerControlsProps();
  const trackInfoProps = useTrackInfoProps();
  const volumeControlsProps = useVolumeControlsProps();

  return (
    <PlayerBar
      {...seekbarProps}
      {...playerControlsProps}
      {...trackInfoProps}
      {...volumeControlsProps}
      renderTrackDuration
    />
  );
};

export default PlayerBarContainer;
