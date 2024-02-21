import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withHandlers } from 'recompose';
import { Icon, Dropdown } from 'semantic-ui-react';
import { PopupButton, PopupDropdown, getThumbnail } from '@nuclear/ui';

import * as DownloadsActions from '../../actions/downloads';
import * as QueueActions from '../../actions/queue';
import * as FavoritesActions from '../../actions/favorites';
import * as ToastActions from '../../actions/toasts';
import * as PlaylistsActions from '../../actions/playlists';
import * as BlacklistActions from '../../actions/blacklist';
import { safeAddUuid } from '../../actions/helpers';
import { normalizeTrack } from '../../utils';
import { addTrackToPlaylist } from '../../components/PlayQueue/QueueMenu/QueueMenuMore';

const QueuePopupButtons = ({
  // track,
  playlists,
  withPlayNow,
  withAddToFavorites,
  withAddToDownloads,
  withAddToPlaylist,
  withAddToBlacklist,
  handlePlayNow,
  handleAddFavorite,
  handleAddToDownloads,
  handleAddToPlaylist,
  handleAddToBlacklist
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
    {withAddToPlaylist && Boolean(playlists.length) && (
      <PopupDropdown text='Add to playlist' direction='left'>
        {_.map(playlists, (playlist, i) => {
          return (
            <Dropdown.Item
              key={i}
              onClick={() => handleAddToPlaylist(playlist)}
            >
              <Icon name='music' />
              {playlist.name}
            </Dropdown.Item>
          );
        })}
      </PopupDropdown>
    )}
    {withAddToFavorites && (
      <PopupButton
        onClick={handleAddFavorite}
        ariaLabel='Add this track to favorites'
        icon='star'
        data-testid='queue-popup-favorite'
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
    {withAddToBlacklist && (
      <PopupButton
        onClick={handleAddToBlacklist}
        ariaLabel='Blacklist this track'
        icon='lock'
        label='Blacklist'
      />
    )}
  </>
);

const mapStateToProps = (state, { track }) => {
  return ({
    streamProviders: track.local
      ? _.filter(state.plugin.plugins.streamProviders, { sourceName: 'Local' })
      : state.plugin.plugins.streamProviders,
    settings: state.settings,
    playlists: state.playlists.localPlaylists.data
  });
};

const mapDispatchToProps = dispatch => ({
  downloadsActions: bindActionCreators(DownloadsActions, dispatch),
  queueActions: bindActionCreators(QueueActions, dispatch),
  favoritesActions: bindActionCreators(FavoritesActions, dispatch),
  blacklistActions: bindActionCreators(BlacklistActions, dispatch),
  playlistsActions: bindActionCreators(PlaylistsActions, dispatch),
  toastActions: bindActionCreators(ToastActions, dispatch)
});

QueuePopupButtons.propTypes = {
  track: PropTypes.object,
  index: PropTypes.number,
  queueActions: PropTypes.shape({
    selectSong: PropTypes.func
  }),
  playlistsActions: PropTypes.shape({
    updatePlaylist: PropTypes.func
  }),
  streamProviders: PropTypes.array,

  withPlayNow: PropTypes.bool,
  withAddToFavorites: PropTypes.bool,
  withAddToDownloads: PropTypes.bool,
  withAddToPlaylist: PropTypes.bool,
  withAddToBlacklist: PropTypes.bool
};

QueuePopupButtons.defaultProps = {
  queueActions: {},
  playlistsActions: {},
  streamProviders: [],

  withAddToPlaylist: true,
  withPlayNow: true,
  withAddToFavorites: true,
  withAddToDownloads: true,
  withAddToBlacklist: true
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
    handleAddToBlacklist: ({
      track,
      settings,
      blacklistActions,
      toastActions
    }) => () => {
      const normalizedTrack = normalizeTrack(track);
      blacklistActions.addToBlacklist(normalizedTrack);
      toastActions.info(
        'Track added to blacklist',
        `${track.artist} - ${track.name} has been added to blacklist.`,
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
      downloadsActions.addToDownloads(streamProviders, clonedTrack);
      toastActions.info(
        'Track added to downloads',
        `${track.artist} - ${track.name} has been added to downloads.`,
        <img src={getThumbnail(normalizedTrack)} />,
        settings
      );
    },
    handleAddToPlaylist: ({
      playlistsActions: { updatePlaylist},
      toastActions,
      settings,
      track
    }) => (playlist) => {
      addTrackToPlaylist(updatePlaylist, playlist, track);
      toastActions.info(
        'Track added to playlist',
        `${track.artist} - ${track.name} has been added to playlist ${playlist.name}.`,
        <img src={getThumbnail(normalizeTrack(track))} />,
        settings
      );
    }
  })
)(QueuePopupButtons);
