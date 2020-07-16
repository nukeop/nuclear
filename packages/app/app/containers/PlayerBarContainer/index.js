import React from 'react';
import { useSelector /* useDispatch*/ } from 'react-redux';
import Sound from 'react-hifi';
import { PlayerBar } from '@nuclear/ui';

// import * as PlayerActions from '../../actions/player';
import { playerSelectors } from '../../selectors/player';
import { useSeekbarProps } from './hooks';

const PlayerBarContainer = () => {
  // const dispatch = useDispatch();
  const playbackProgress = useSelector(playerSelectors.playbackProgress);
  const playbackStatus = useSelector(playerSelectors.playbackStatus);
  const playbackStreamLoading = useSelector(playerSelectors.playbackStreamLoading);
  
  const seekbarProps = useSeekbarProps();

  return (
    <PlayerBar
      {...seekbarProps}
      renderTrackDuration
      fill={playbackProgress}
      track='Test song'
      artist='Test artist'
      volume={60}
      seek={null}
      playOptions={[
        { icon: 'repeat', enabled: false },
        { icon: 'magic' },
        { icon: 'random', enabled: false }
      ]}
      isPlaying={playbackStatus === Sound.status.PLAYING}
      isLoading={playbackStreamLoading}
    />
  );
};

export default PlayerBarContainer;
