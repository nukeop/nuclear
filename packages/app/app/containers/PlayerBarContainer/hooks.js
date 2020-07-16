import { formatDuration } from '@nuclear/ui';
import { useSelector } from 'react-redux';

import { playerSelectors } from '../../selectors/player';
import { queue as queueSelector } from '../../selectors/queue';

export const useSeekbarProps = () => {
  const queue = useSelector(queueSelector);
  const seek = useSelector(playerSelectors.seek);
  const currentTrackStream = _.head(
    _.get(
      queue.queueItems[queue.currentSong],
      'streams'
    )
  );

  const currentTrackDuration = _.get(
    currentTrackStream,
    'duration'
  );

  const timeToEnd = currentTrackDuration - seek;

  return {
    queue,
    timePlayed: formatDuration(seek),
    timeToEnd: formatDuration(timeToEnd)
  };
};

