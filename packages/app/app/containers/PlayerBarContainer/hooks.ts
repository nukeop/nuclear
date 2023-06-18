import { useCallback, useEffect } from 'react';
import Sound from 'react-hifi';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import _, { isEmpty } from 'lodash';
import { getTrackArtist } from '@nuclear/ui';
import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic';

import { normalizeTrack } from '../../utils';
import settingsConst from '../../constants/settings';
import { artistInfoSearchByName } from '../../actions/search';
import * as playerActions from '../../actions/player';
import * as queueActions from '../../actions/queue';
import * as settingsActions from '../../actions/settings';
import * as favoritesActions from '../../actions/favorites';
import { favoritesSelectors } from '../../selectors/favorites';
import { playerSelectors } from '../../selectors/player';
import { queue as queueSelector } from '../../selectors/queue';
import { settingsSelector } from '../../selectors/settings';
import { getFavoriteTrack } from '../../selectors/favorites';
import { QueueItem } from '../../reducers/queue';

export const useSeekbarProps = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation('seekbar');
  const queue = useSelector(queueSelector);
  const seek: number = useSelector(playerSelectors.seek);
  const playbackProgress: number = useSelector(playerSelectors.playbackProgress);
  const currentTrackStream = queue.queueItems[queue.currentSong]?.streams?.[0];
  const currentTrackDuration: number | undefined = currentTrackStream?.duration;
  const timeToEnd = currentTrackDuration - seek;

  const seekCallback = useCallback(
    (place) => dispatch(playerActions.updateSeek(place)),
    [dispatch]
  );

  const settings = useSelector(settingsSelector);
  const allowSkipSegment = settings.skipSponsorblock ?? true;

  const skipSegments = currentTrackStream?.skipSegments ?? [];

  return {
    queue,
    skipSegments,
    allowSkipSegment,
    timeToEnd: currentTrackDuration === 0 ? t('live') : timeToEnd,
    timePlayed: currentTrackDuration === 0 ? t('live') : seek,
    fill: playbackProgress,
    seek: seekCallback,
    segmentPopupMessage: t('segment-popup')
  };
};

export const usePlayerControlsProps = () => {
  const dispatch = useDispatch();
  const queue = useSelector(queueSelector);
  const settings = useSelector(settingsSelector);
  const playbackStatus = useSelector(playerSelectors.playbackStatus);
  const currentTrack = queue?.queueItems[queue.currentSong];
  const currentTrackStream = currentTrack?.streams?.[0];
  const playbackStreamLoading: boolean = useSelector(playerSelectors.playbackStreamLoading);
  const seek = useSelector(playerSelectors.seek);
  const favoriteTracks = useSelector(favoritesSelectors.tracks);

  const couldPlay = queue.queueItems.length > 0;
  const couldForward = couldPlay && queue.currentSong + 1 < queue.queueItems.length;
  const couldBack = couldPlay;
  const goBackThreshold = ((
    settings.skipSponsorblock && 
      currentTrackStream?.skipSegments?.find(segment => segment.startTime === 0)?.endTime) 
    ?? 0) + 3;

  const togglePlay = useCallback(
    () => dispatch(playerActions.togglePlayback(playbackStatus, false)),
    [dispatch, playbackStatus]
  );

  const goForward = useCallback(
    () => dispatch(queueActions.nextSong()),
    [dispatch]
  );

  const goBack = useCallback(
    () => {
      if (seek > goBackThreshold){
        dispatch(playerActions.updateSeek(0));
      } else if (queue.currentSong === 0) {
        dispatch(playerActions.resetPlayer());
      } else {
        dispatch(queueActions.previousSong());
      }
    },
    [dispatch, seek, goBackThreshold]
  );

  return {
    goBackDisabled: !couldBack,
    goForwardDisabled: !couldForward,
    playDisabled: !couldPlay,
    isPlaying: playbackStatus === Sound.status.PLAYING,
    isLoading: currentTrack?.loading || playbackStreamLoading,
    togglePlay,
    goForward,
    goBack
  };
};

export const useTrackInfoProps = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const queue = useSelector(queueSelector);
  const hasTracks = queue.queueItems.length > 0;
  const currentSong = _.get(queue.queueItems, queue.currentSong);

  const track = currentSong?.name;
  const artist = getTrackArtist(currentSong);
  const cover = currentSong?.thumbnail;

  const favorite = useSelector(s => getFavoriteTrack(s, artist, track));
  const isFavorite = !_.isNil(favorite);
  const addToFavorites = useCallback(
    () => dispatch(favoritesActions.addFavoriteTrack(normalizeTrack(currentSong))),
    [dispatch, currentSong]
  );
  const removeFromFavorites = useCallback(
    () => dispatch(favoritesActions.removeFavoriteTrack(favorite)),
    [dispatch, favorite]
  );

  const onTrackClick = useCallback(
    () => {},
    []
  );

  const onArtistClick = useCallback(
    () => dispatch(artistInfoSearchByName(artist, history)),
    [dispatch, artist, history]
  );

  return {
    track,
    artist,
    onTrackClick,
    onArtistClick,
    cover,
    hasTracks,
    isFavorite,
    addToFavorites,
    removeFromFavorites
  };
};

export const useToggleOptionCallback = (
  toggleOption,
  name,
  settings
) => useCallback(
  () => toggleOption(
    _.find(settingsConst, { name }),
    settings
  ),
  [name, settings, toggleOption]
);

export const useTrackDurationProp = () => { 
  const settings = useSelector(settingsSelector);
  const trackDurationSetting = _.get(settings, 'trackDuration', false);
  return {
    'renderTrackDuration': trackDurationSetting
  };
};

export const useVolumeControlsProps = () => {
  const { t } = useTranslation('option-control');
  const dispatch = useDispatch();
  const volume: number = useSelector(playerSelectors.volume);
  const isMuted: boolean = useSelector(playerSelectors.muted);
  const settings = useSelector(settingsSelector);

  // ADDED BY MISH GH
  const playbackRate: number = useSelector(playerSelectors.playbackRate);
  const isPlaybackRateOpen = _.get(settings, 'rate');

  const toggleOption = useCallback(
    (option, state) => dispatch(settingsActions.toggleOption(option, state)), [dispatch]
  );

  const playOptions = [
    // ADDED BY MISH GH
    {
      // name: t('rate'),
      name: 'Rate',
      dataTestId: 'rate-play-option',
      icon: 'heartbeat' as SemanticICONS,
      enabled: _.get(settings, 'rate'),
      onToggle: useToggleOptionCallback(toggleOption, 'rate', settings)
    },
    // END
    {
      name: t('loop'),
      dataTestId: 'loop-play-option',
      icon: 'repeat' as SemanticICONS,
      enabled: _.get(settings, 'loopAfterQueueEnd'),
      onToggle: useToggleOptionCallback(toggleOption, 'loopAfterQueueEnd', settings)
    },
    {
      name: t('shuffle'),
      dataTestId: 'shuffle-play-option',
      icon: 'random' as SemanticICONS,
      enabled: _.get(settings, 'shuffleQueue'),
      onToggle: useToggleOptionCallback(toggleOption, 'shuffleQueue', settings)
    },
    {
      name: t('autoradio'),
      dataTestId: 'autoradio-play-option',
      icon: 'magic' as SemanticICONS,
      enabled: _.get(settings, 'autoradio'),
      onToggle: useToggleOptionCallback(toggleOption, 'autoradio', settings)
    },
    {
      name: t('mini-player'),
      dataTestId: 'mini-player-play-option',
      icon: 'compress' as SemanticICONS,
      enabled: _.get(settings, 'miniPlayer'),
      onToggle: useToggleOptionCallback(toggleOption, 'miniPlayer', settings)
    }
  ];

  const updateVolume = useCallback(
    (value) => dispatch(playerActions.updateVolume(value, false)),
    [dispatch]
  );

  // ADDED BY MISH GH 
  const updatePlaybackRate = useCallback(
    (rate) => dispatch(playerActions.updatePlaybackRate(rate)),
    [dispatch]
  );

  const toggleMute = useCallback(
    () => dispatch(playerActions.toggleMute(!isMuted)),
    [dispatch, isMuted]
  );

  return {
    volume,
    updateVolume,
    isMuted,
    toggleMute,
    playOptions,
    // ADDED BY MISH GH 
    updatePlaybackRate,
    playbackRate,
    isPlaybackRateOpen
  };
};

export const useStreamLookup = () => {
  const dispatch = useDispatch();
  const queue = useSelector(queueSelector);

  useEffect(() => {
    const isStreamLoading = Boolean(queue.queueItems.find((item) => item.loading));

    if (!isStreamLoading) {
      const currentSong: QueueItem = queue.queueItems[queue.currentSong];

      if (currentSong && isEmpty(currentSong.streams)) {
        dispatch(queueActions.findStreamsForTrack(queue.currentSong));
        return;
      }
    
      const nextTrackWithNoStream = (queue.queueItems as QueueItem[]).findIndex((item) => isEmpty(item.streams));
    
      if (nextTrackWithNoStream !== -1) {
        dispatch(queueActions.findStreamsForTrack(nextTrackWithNoStream));
      }
    }
  }, [queue]);
};
