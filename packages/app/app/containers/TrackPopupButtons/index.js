import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PopupButton, getThumbnail, getTrackItem, getTrackTitle, getTrackArtist } from '@nuclear/ui';

import * as DownloadsActions from '../../actions/downloads';
import * as QueueActions from '../../actions/queue';
import * as FavoritesActions from '../../actions/favorites';
import * as ToastActions from '../../actions/toasts';
import { safeAddUuid } from '../../actions/helpers';

const TrackPopupButtons = ({
  track,
  queueActions,
  favoritesActions,
  toastActions,
  downloadsActions,
  streamProviders,
  settings,

  withAddToQueue,
  withPlayNow,
  withAddToFavorites,
  withAddToDownloads
}) => {

  const title = getTrackTitle(track);
  const artist = getTrackArtist(track);

  const handleAddToQueue = useCallback(() => 
    queueActions.addToQueue(getTrackItem(track)),
  [queueActions, track]
  );
  const handlePlayNow = useCallback(() => 
    queueActions.playTrack(streamProviders, getTrackItem(track)),
  [queueActions, streamProviders, track]
  );
  const handleAddFavorite = useCallback(() => {
    favoritesActions.addFavoriteTrack(track);
    toastActions.info(
      'Favorite track added',
      `${artist} - ${title} has been added to favorites.`,
      <img src={getThumbnail(track)} />,
      settings
    );
  },
  [favoritesActions, track, toastActions, artist, title, settings]
  );
  const handleAddToDownloads = useCallback(() => {
    const clonedTrack = safeAddUuid(track);
    downloadsActions.addToDownloads(streamProviders, clonedTrack);
    toastActions.info(
      'Track added to downloads',
      `${artist} - ${title} has been added to downloads.`,
      <img src={getThumbnail(track)} />,
      settings
    );
  },
  [artist, downloadsActions, settings, streamProviders, title, toastActions, track]
  );

  return (
    <>
      {
        withAddToQueue &&
        <PopupButton
          onClick={handleAddToQueue}
          ariaLabel='Add track to queue'
          icon='plus'
          label='Add to queue'
        />
      }
      {
        withPlayNow &&
        <PopupButton
          onClick={handlePlayNow}
          ariaLabel='Play this track now'
          icon='play'
          label='Play now'
        />
      }
      {
        withAddToFavorites &&
        <PopupButton
          onClick={handleAddFavorite}
          ariaLabel='Add this track to favorites'
          icon='heart'
          label='Add to favorites'
        />
      }
      {
        withAddToDownloads &&
        <PopupButton
          onClick={handleAddToDownloads}
          ariaLabel='Download this track'
          icon='download'
          label='Download'
        />
      }
    </>
  );
};

const mapStateToProps = (state, { track }) => ({
  streamProviders: track.local
    ? _.filter(state.plugin.plugins.streamProviders, { sourceName: 'Local' })
    : state.plugin.plugins.streamProviders,
  settings: state.settings
});

const mapDispatchToProps = dispatch => ({
  downloadsActions: bindActionCreators(DownloadsActions, dispatch),
  queueActions: bindActionCreators(QueueActions, dispatch),
  favoritesActions: bindActionCreators(FavoritesActions, dispatch),
  toastActions: bindActionCreators(ToastActions, dispatch)
});

TrackPopupButtons.propTypes = {
  track: PropTypes.object,
  queueActions: PropTypes.shape({
    addToQueue: PropTypes.func,
    clearQueue: PropTypes.func
  }),
  streamProviders: PropTypes.array,

  withAddToQueue: PropTypes.bool,
  withPlayNow: PropTypes.bool,
  withAddToFavorites: PropTypes.bool,
  withAddToDownloads: PropTypes.bool
};

TrackPopupButtons.defaultProps = {
  queueActions: {},
  streamProviders: [],

  withAddToQueue: true,
  withPlayNow: true,
  withAddToFavorites: true,
  withAddToDownloads: true
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPopupButtons);
