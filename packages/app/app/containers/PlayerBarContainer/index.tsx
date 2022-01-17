import React from 'react';
import { PlayerBar } from '@nuclear/ui';

import { 
  usePlayerControlsProps,
  useSeekbarProps,
  useTrackDurationProp,
  useTrackInfoProps,
  useVolumeControlsProps
} from './hooks';


const PlayerBarContainer = () => {
  const seekbarProps = useSeekbarProps();
  const playerControlsProps = usePlayerControlsProps();
  const trackInfoProps = useTrackInfoProps();
  const volumeControlsProps = useVolumeControlsProps();
  const trackDurationProp = useTrackDurationProp();

  return (
    <PlayerBar
      {...seekbarProps}
      {...playerControlsProps}
      {...trackInfoProps}
      {...volumeControlsProps}
      {...trackDurationProp}
    />
  );
};

export default PlayerBarContainer;
