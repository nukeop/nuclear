import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withHandlers } from 'recompose';
import { Icon, Dropdown } from 'semantic-ui-react';
import { PopupButton, PopupDropdown, getThumbnail } from '@nuclear/ui';
import { withTranslation } from 'react-i18next';

import * as DownloadsActions from '../../actions/downloads';
import * as QueueActions from '../../actions/queue';
import * as FavoritesActions from '../../actions/favorites';
import * as ToastActions from '../../actions/toasts';
import * as PlaylistsActions from '../../actions/playlists';
import { safeAddUuid } from '../../actions/helpers';
import { normalizeTrack } from '../../utils';
import { addTrackToPlaylist } from '../../components/PlayQueue/QueueMenu/QueueMenuMore';

const QueuePopupButtons = ({
  playlists,
  withPlayNow,
  withAddToFavorites,
  withAddToDownloads,
  withAddToPlaylist,
  handlePlayNow,
  handleAddFavorite,
  handleAddToDownloads,
  handleAddToPlaylist,
  t
}) => (
  <>
    {withPlayNow && (
      <PopupButton
        onClick={handlePlayNow}
        ariaLabel='Play this track now'
        icon='play'
        label={t('play-now')}
      />
    )}
    {withAddToPlaylist && Boolean(playlists.length) && (
      <PopupDropdown text={t('playlist-add')} direction='left'>
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
        icon='heart'
        data-testid='queue-popup-favorite'
        label={t('favorite-add')}
      />
    )}
    {withAddToDownloads && (
      <PopupButton
        onClick={handleAddToDownloads}
        ariaLabel='Download this track'
        icon='download'
        label={t('download')}
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
  withAddToPlaylist: PropTypes.bool
};

QueuePopupButtons.defaultProps = {
  queueActions: {},
  playlistsActions: {},
  streamProviders: [],

  withAddToPlaylist: true,
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
        `${track.artists?.[0]} - ${track.name} has been added to favorites.`,
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
        `${track.artists?.[0]} - ${track.name} has been added to downloads.`,
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
        `${track.artists?.[0]} - ${track.name} has been added to playlist ${playlist.name}.`,
        <img src={getThumbnail(normalizeTrack(track))} />,
        settings
      );
    }
  }),
  withTranslation('queue')
)(QueuePopupButtons);
