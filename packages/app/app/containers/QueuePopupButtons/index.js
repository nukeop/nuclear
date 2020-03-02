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
import { normalizeTrack } from '../../utils';

const QueuePopupButtons = ({
  // track,
  withPlayNow,
  withAddToFavorites,
  withAddToDownloads,
  handlePlayNow,
  handleAddFavorite,
  handleAddToDownloads
}) => (
  <>
    {withPlayNow && (
      <PopupButton
        onClick={handlePlayNow}
        ariaLabel='Play this track now'
        icon='play'
        label='Play now'
      />
    )}
    {withAddToFavorites && (
      <PopupButton
        onClick={handleAddFavorite}
        ariaLabel='Add this track to favorites'
        icon='star'
        label='Add to favorites'
      />
    )}
    {withAddToDownloads && (
      <PopupButton
        onClick={handleAddToDownloads}
        ariaLabel='Download this track'
        icon='download'
        label='Download'
      />
    )}
  </>
);

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

QueuePopupButtons.propTypes = {
  track: PropTypes.object,
  index: PropTypes.number,
  queueActions: PropTypes.shape({
    selectSong: PropTypes.func
  }),
  streamProviders: PropTypes.array,

  withAddToQueue: PropTypes.bool,
  withPlayNow: PropTypes.bool,
  withAddToFavorites: PropTypes.bool,
  withAddToDownloads: PropTypes.bool
};

QueuePopupButtons.defaultProps = {
  queueActions: {},
  streamProviders: [],

  withAddToQueue: true,
  withPlayNow: true,
  withAddToFavorites: true,
  withAddToDownloads: true
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handlePlayNow: ({ index, queueActions }) => () => {
      if (Number.isInteger(index)) {
        queueActions.selectSong(index);
      }
    },
    handleAddFavorite: ({
      track,
      settings,
      favoritesActions,
      toastActions
    }) => () => {
      const normalizedTrack = normalizeTrack(track);
      favoritesActions.addFavoriteTrack(normalizedTrack);
      toastActions.info(
        'Favorite track added',
        `${track.artist} - ${track.name} has been added to favorites.`,
        <img src={getThumbnail(normalizedTrack)} />,
        settings
      );
    },
    handleAddToDownloads: ({
      track,
      settings,
      downloadsActions,
      toastActions,
      streamProviders
    }) => () => {
      const normalizedTrack = normalizeTrack(track);
      const clonedTrack = safeAddUuid(normalizedTrack);
      ipcRenderer.send('start-download', clonedTrack);
      downloadsActions.addToDownloads(streamProviders, clonedTrack);
      toastActions.info(
        'Track added to downloads',
        `${track.artist} - ${track.name} has been added to downloads.`,
        <img src={getThumbnail(normalizedTrack)} />,
        settings
      );
    }
  })
)(QueuePopupButtons);
