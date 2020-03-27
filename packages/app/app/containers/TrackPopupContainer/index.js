import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withHandlers, withProps } from 'recompose';
import { TrackPopup } from '@nuclear/ui';

import * as DownloadsActions from '../../actions/downloads';
import * as FavoritesActions from '../../actions/favorites';
import * as PlayerActions from '../../actions/player';
import * as QueueActions from '../../actions/queue';
import * as ToastActions from '../../actions/toasts';
import { safeAddUuid } from '../../actions/helpers';

function mapStateToProps (state, { track }) {
  return {
    streamProviders: track.local
      ? state.plugin.plugins.streamProviders.filter(({ sourceName }) => {
        return sourceName === 'Local';
      })
      : state.plugin.plugins.streamProviders,
    settings: state.settings
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
        ...ToastActions
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
  withProps(({ artist, track, title, thumb }) => ({
    trackItem: {
      artist,
      name: title,
      thumbnail: thumb,
      local: track.local,
      streams: track.streams
    }
  })),
  withHandlers({
    onAddToQueue: ({ actions, streamProviders, trackItem }) => () => actions.addToQueue(streamProviders, trackItem),
    onPlayNow: ({ actions, streamProviders, trackItem }) => () => actions.playTrack(streamProviders, trackItem),
    onAddToFavorites: ({ actions, track, artist, title, thumb, settings }) => () => {
      actions.addFavoriteTrack(track);
      actions.info(
        'Favorite track added',
        `${artist} - ${title} has been added to favorites.`,
        <img src={thumb} />,
        settings
      );
    },
    onAddToDownloads: ({ actions, streamProviders, track, artist, title, thumb, settings}) => () => {
      const clonedTrack = safeAddUuid(track);
      actions.addToDownloads(streamProviders, clonedTrack);
      actions.info(
        'Track added to downloads',
        `${artist} - ${title} has been added to downloads.`,
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
  actions: PropTypes.shape({
    addToQueue: PropTypes.func,
    clearQueue: PropTypes.func,
    selectSong: PropTypes.func,
    startPlayback: PropTypes.func,
    addToDownloads: PropTypes.func
  }),
  streamProviders: PropTypes.array,
  settings: PropTypes.object,

  withAddToQueue: PropTypes.bool,
  withPlayNow: PropTypes.bool,
  withAddToFavorites: PropTypes.bool,
  withAddToDownloads: PropTypes.bool
};

TrackPopupContainer.defaultProps = {
  trigger: null,
  track: {},
  artist: '',
  title: '',
  thumb: '',
  actions: {},
  streamProviders: [],
  settings: {},

  withAddToQueue: true,
  withPlayNow: true,
  withAddToFavorites: true,
  withAddToDownloads: true
};

export default TrackPopupContainer;
