import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withHandlers, withProps } from 'recompose';
import { TrackPopup, getTrackItem } from '@nuclear/ui';

import * as DownloadsActions from '../../actions/downloads';
import * as FavoritesActions from '../../actions/favorites';
import * as PlayerActions from '../../actions/player';
import * as QueueActions from '../../actions/queue';
import * as ToastActions from '../../actions/toasts';
import * as PlaylistsActions from '../../actions/playlists';
import { safeAddUuid } from '../../actions/helpers';
import { addTrackToPlaylist } from '../../components/PlayQueue/QueueMenu/QueueMenuMore';
import { getTrackArtist } from '@nuclear/ui/lib';

function mapStateToProps (state, { track }) {
  return {
    streamProviders: track.local
      ? state.plugin.plugins.streamProviders.filter(({ sourceName }) => {
        return sourceName === 'Local';
      })
      : state.plugin.plugins.streamProviders,
    settings: state.settings,
    playlists: state.playlists.playlists
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(
      {
        ...DownloadsActions,
        ...FavoritesActions,
        ...QueueActions,
        ...PlayerActions,
        ...ToastActions,
        ...PlaylistsActions
      },
      dispatch
    )
  };
}

const TrackPopupContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withProps(({ track }) => ({
    trackItem: getTrackItem(track)
  })),
  withHandlers({
    onAddToQueue: ({ actions, trackItem }) => () => actions.addToQueue(trackItem),
    onPlayNow: ({ actions, streamProviders, trackItem }) => () => actions.playTrack(streamProviders, trackItem),
    onAddToFavorites: ({ actions, track, thumb, settings }) => () => {
      actions.addFavoriteTrack(track);
      actions.info(
        'Favorite track added',
        `${getTrackArtist(track)} - ${track.name} has been added to favorites.`,
        <img src={thumb} />,
        settings
      );
    },
    onAddToDownloads: ({ actions, streamProviders, trackItem, thumb, settings}) => () => {
      const clonedTrack = {...safeAddUuid(trackItem)};
      actions.addToDownloads(streamProviders, clonedTrack);
      actions.info(
        'Track added to downloads',
        `${getTrackArtist(clonedTrack)} - ${clonedTrack.name} has been added to downloads.`,
        <img src={thumb} />,
        settings
      );
    },
    onAddToPlaylist: ({ actions, settings, track, thumb}) => (playlist) => {
      const clonedTrack = {...safeAddUuid(track)};
      addTrackToPlaylist(actions.updatePlaylist, playlist, clonedTrack);
      actions.info(
        'Track added to playlist',
        `${getTrackArtist(clonedTrack)} - ${clonedTrack.name} has been added to playlist ${playlist.name}.`,
        <img src={thumb} />,
        settings
      );
    }
  })
)(TrackPopup);

TrackPopupContainer.propTypes = {
  trigger: PropTypes.node,
  track: PropTypes.object,
  artist: PropTypes.string,
  title: PropTypes.string,
  thumb: PropTypes.string,
  playlists: PropTypes.array,
  actions: PropTypes.shape({
    addToQueue: PropTypes.func,
    clearQueue: PropTypes.func,
    selectSong: PropTypes.func,
    startPlayback: PropTypes.func,
    updatePlaylist: PropTypes.func,
    addToDownloads: PropTypes.func
  }),
  streamProviders: PropTypes.array,
  settings: PropTypes.object,

  withAddToQueue: PropTypes.bool,
  withPlayNow: PropTypes.bool,
  withAddToFavorites: PropTypes.bool,
  withAddToPlaylist: PropTypes.bool,
  withAddToDownloads: PropTypes.bool
};

TrackPopupContainer.defaultProps = {
  trigger: null,
  track: {},
  artist: '',
  title: '',
  thumb: null,
  playlists: [],
  actions: {},
  streamProviders: [],
  settings: {},

  withAddToQueue: true,
  withPlayNow: true,
  withAddToFavorites: true,
  withAddToPlaylist: true,
  withAddToDownloads: true
};

export default TrackPopupContainer;
