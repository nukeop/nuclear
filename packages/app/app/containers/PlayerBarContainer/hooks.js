import Sound from 'react-hifi';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { formatDuration } from '@nuclear/ui';

import * as playerActions from '../../actions/player';
import * as queueActions from '../../actions/queue';
import { playerSelectors } from '../../selectors/player';
import { queue as queueSelector } from '../../selectors/queue';
import { useCallback } from 'react';

export const useSeekbarProps = () => {
  const dispatch = useDispatch();
  const queue = useSelector(queueSelector);
  const seek = useSelector(playerSelectors.seek);
  const playbackProgress = useSelector(playerSelectors.playbackProgress);
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

  const seekCallback = useCallback(
    (place) => dispatch(playerActions.updateSeek(place)),
    [dispatch]
  );

  return {
    queue,
    timePlayed: formatDuration(seek),
    timeToEnd: formatDuration(timeToEnd),
    fill: playbackProgress,
    seek: seekCallback
  };
};

export const usePlayerControlsProps = () => {
  const dispatch = useDispatch();
  const queue = useSelector(queueSelector);
  const playbackStatus = useSelector(playerSelectors.playbackStatus);
  const playbackStreamLoading = useSelector(playerSelectors.playbackStreamLoading);

  const couldPlay = queue.queueItems.length > 0;
  const couldForward = couldPlay && queue.currentSong + 1 < queue.queueItems.length;
  const couldBack = couldPlay && queue.currentSong > 0;

  const togglePlay = useCallback(
    () => dispatch(playerActions.togglePlayback(playbackStatus)),
    [dispatch, playbackStatus]
  );

  const goForward = useCallback(
    () => dispatch(queueActions.nextSong()),
    [dispatch]
  );

  const goBack = useCallback(
    () => dispatch(queueActions.previousSong()),
    [dispatch]
  );

  return {
    goBackDisabled: !couldBack,
    goForwardDisabled: !couldForward,
    playDisabled: !couldPlay,
    isPlaying: playbackStatus === Sound.status.PLAYING,
    isLoading: playbackStreamLoading,
    togglePlay,
    goForward,
    goBack
  };
};

export const useTrackInfoProps = () => {
  const queue = useSelector(queueSelector);
  const currentSong = _.get(queue.queueItems, queue.currentSong);

  const track = _.get(currentSong, 'name');
  const artist = _.get(currentSong, 'artist');
  const cover = _.get(currentSong, 'thumbnail');

  return {
    track,
    artist,
    cover
  };
};
