import React from 'react';
import { PlayerBar } from '@nuclear/ui';

import { 
  usePlayerControlsProps,
  useSeekbarProps,
  useTrackInfoProps
} from './hooks';

const PlayerBarContainer = () => {
  const seekbarProps = useSeekbarProps();
  const playerControlsProps = usePlayerControlsProps();
  const trackInfoProps = useTrackInfoProps();

  return (
    <PlayerBar
      {...seekbarProps}
      {...playerControlsProps}
      {...trackInfoProps}
      renderTrackDuration
      volume={60}
      seek={null}
      playOptions={[
        { icon: 'repeat', enabled: false },
        { icon: 'magic' },
        { icon: 'random', enabled: false }
      ]}
    />
  );
};

export default PlayerBarContainer;
