import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withHandlers } from 'recompose';
import { ipcRenderer } from 'electron';
import { PopupButton, getThumbnail } from '@nuclear/ui';

import * as DownloadsActions from '../../actions/downloads';
import * as QueueActions from '../../actions/queue';
import * as FavoritesActions from '../../actions/favorites';
import * as ToastActions from '../../actions/toasts';
import { safeAddUuid } from '../../actions/helpers';

const getTrackItem = track => ({
  artist: track.artist.name,
  name: track.name,
  thumbnail: getThumbnail(track)
});

const TrackPopupButtons = ({
  // track,
  withAddToQueue,
  withPlayNow,
  withAddToFavorites,
  withAddToDownloads,
  handleAddToQueue,
  handlePlayNow,
  handleAddFavorite,
  handleAddToDownloads
}) => (
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
        icon='star'
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

const mapStateToProps = (state, { track }) => ({
  streamProviders: track.local
    ? _.filter(state.plugin.plugins.streamProviders, {sourceName: 'Local'})
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

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withHandlers({
    handleAddToQueue: ({ track, queueActions, streamProviders }) => () =>
      queueActions.addToQueue(streamProviders, getTrackItem(track)),
    handlePlayNow: ({ track, queueActions, streamProviders }) => () => queueActions.playTrack(streamProviders, getTrackItem(track)),
    handleAddFavorite: ({ track, settings, favoritesActions, toastActions }) => () => {
      favoritesActions.addFavoriteTrack(track);
      toastActions.info(
        'Favorite track added',
        `${track.artist.name} - ${track.name} has been added to favorites.`,
        <img src={getThumbnail(track)} />,
        settings
      );
    },
    handleAddToDownloads: ({ track, settings, downloadsActions, toastActions, streamProviders }) => () => {
      const clonedTrack = safeAddUuid(track);
      ipcRenderer.send('start-download', clonedTrack);
      downloadsActions.addToDownloads(streamProviders, clonedTrack);
      toastActions.info(
        'Track added to downloads',
        `${track.artist.name} - ${track.name} has been added to downloads.`,
        <img src={getThumbnail(track)} />,
        settings
      );
    }
  })
)(TrackPopupButtons);
