import Sound from 'react-hifi';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';

import { normalizeTrack } from '../../utils';
import settingsConst from '../../constants/settings';
import * as searchActions from '../../actions/search';
import * as playerActions from '../../actions/player';
import * as queueActions from '../../actions/queue';
import * as settingsActions from '../../actions/settings';
import * as favoritesActions from '../../actions/favorites';
import { playerSelectors } from '../../selectors/player';
import { queue as queueSelector } from '../../selectors/queue';
import { settingsSelector } from '../../selectors/settings';
import { getFavoriteTrack } from '../../selectors/favorites';
import { useCallback } from 'react';
import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic';

export const useSeekbarProps = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation('seekbar');
  const queue = useSelector(queueSelector);
  const seek: number = useSelector(playerSelectors.seek);
  const playbackProgress: number = useSelector(playerSelectors.playbackProgress);
  const currentTrackStream = _.head(
    _.get(
      queue.queueItems[queue.currentSong],
      'streams'
    )
  );
  const currentTrackDuration: number = _.get(
    currentTrackStream,
    'duration'
  );
  const timeToEnd = currentTrackDuration - seek;

  const seekCallback = useCallback(
    (place) => dispatch(playerActions.updateSeek(place)),
    [dispatch]
  );
 
  const skipSegments = _.get(
    currentTrackStream,
    'skipSegments',
    []
  );

  return {
    queue,
    skipSegments,
    timeToEnd,
    timePlayed: seek,
    fill: playbackProgress,
    seek: seekCallback,
    segmentPopupMessage: t('segment-popup')
  };
};

export const usePlayerControlsProps = () => {
  const dispatch = useDispatch();
  const queue = useSelector(queueSelector);
  const playbackStatus = useSelector(playerSelectors.playbackStatus);
  const playbackStreamLoading: boolean = useSelector(playerSelectors.playbackStreamLoading);
  const seek = useSelector(playerSelectors.seek);

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
    () => {
      if (seek > 3){
        dispatch(playerActions.updateSeek(0));
      } else {
        dispatch(queueActions.previousSong());
      }
    },
    [dispatch, seek]
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
  const dispatch = useDispatch();
  const history = useHistory();
  const queue = useSelector(queueSelector);
  const hasTracks = queue.queueItems.length > 0;
  const currentSong = _.get(queue.queueItems, queue.currentSong);

  const track = _.get(currentSong, 'name');
  const artist = _.get(currentSong, 'artist');
  const cover = _.get(currentSong, 'thumbnail');

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
    () => dispatch(searchActions.artistInfoSearchByName(artist, history)),
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

export const useVolumeControlsProps = () => {
  const { t } = useTranslation('option-control');
  const dispatch = useDispatch();
  const volume: number = useSelector(playerSelectors.volume);
  const isMuted: boolean = useSelector(playerSelectors.muted);
  const settings = useSelector(settingsSelector);

  const toggleOption = useCallback(
    (option, state) => dispatch(settingsActions.toggleOption(option, state)), [dispatch]
  );

  const playOptions = [
    {
      name: t('loop'),
      icon: 'repeat' as SemanticICONS,
      enabled: _.get(settings, 'loopAfterQueueEnd'),
      onToggle: useToggleOptionCallback(toggleOption, 'loopAfterQueueEnd', settings)
    },
    {
      name: t('shuffle'),
      icon: 'random' as SemanticICONS,
      enabled: _.get(settings, 'shuffleQueue'),
      onToggle: useToggleOptionCallback(toggleOption, 'shuffleQueue', settings)
    },
    {
      name: t('autoradio'),
      icon: 'magic' as SemanticICONS,
      enabled: _.get(settings, 'autoradio'),
      onToggle: useToggleOptionCallback(toggleOption, 'autoradio', settings)
    },
    {
      name: t('mini-player'),
      icon: 'compress' as SemanticICONS,
      enabled: _.get(settings, 'miniPlayer'),
      onToggle: useToggleOptionCallback(toggleOption, 'miniPlayer', settings)
    }
  ];

  const updateVolume = useCallback(
    (value) => dispatch(playerActions.updateVolume(value)),
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
    playOptions
  };
};
