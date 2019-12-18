import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import { Dropdown, Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { compose, withHandlers, defaultProps } from 'recompose';
import { sendPaused } from '../../../../mpris';
import styles from './styles.scss';

const addTrackToPlaylist = (updatePlaylist, playlist, track) => {
  if (track.name) {
    playlist.tracks.push(track);
    updatePlaylist(playlist);
  }
};

export const QueueMenuMore = ({
  disabled,
  savePlaylistDialog,
  updatePlaylist,
  playlists,
  currentItem,
  handleAddToDownloads,
  handleAddFavoriteTrack,
  handleClearClick
}) => {
  const { t } = useTranslation('queue');

  return (
    <Dropdown item icon='ellipsis vertical' className={styles.queue_menu_more} disabled={disabled}>
      <Dropdown.Menu>
        <Dropdown.Header>{t('header')}</Dropdown.Header>
        <Dropdown.Item onClick={handleClearClick}>
          <Icon name='trash' />
          {t('clear')}
        </Dropdown.Item>
        {savePlaylistDialog}
        <Dropdown.Divider />

        <Dropdown.Header>{t('header-track')}</Dropdown.Header>
        <Dropdown.Item>
          <Dropdown text={t('playlist-add')} className='left'>
            <Dropdown.Menu className={cx('left', styles.playlists_menu)}>
              {_.map(playlists, (playlist, i) => {
                return (
                  <Dropdown.Item
                    key={i}
                    onClick={() =>
                      addTrackToPlaylist(updatePlaylist, playlist, currentItem)
                    }
                  >
                    <Icon name='music' />
                    {playlist.name}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        </Dropdown.Item>
        <Dropdown.Item
          onClick={handleAddFavoriteTrack}
        >
          <Icon name='star' />
          {t('favorite-add')}
        </Dropdown.Item>
        <Dropdown.Item onClick={handleAddToDownloads}>
          <Icon name='download' />
          {t('download')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

QueueMenuMore.propTypes = {
  disabled: PropTypes.bool,
  clearQueue: PropTypes.func,
  resetPlayer: PropTypes.func,
  addFavoriteTrack: PropTypes.func,
  addToDownloads: PropTypes.func,
  updatePlaylist: PropTypes.func,
  savePlaylistDialog: PropTypes.node,
  playlists: PropTypes.array,
  currentItem: PropTypes.object
};

QueueMenuMore.defaultProps = {
  disabled: true,
  clearQueue: () => {},
  resetPlayer: () => {},
  addFavoriteTrack: () => {},
  addToDownloads: () => {},
  updatePlaylist: () => {},
  savePlaylistDialog: null,
  playlists: [],
  currentItem: {}
};

export const enhance = compose(
  defaultProps({ sendPaused }),
  withHandlers({
    handleAddToDownloads: ({addToDownloads, currentItem}) => () => addToDownloads(currentItem),
    handleAddFavoriteTrack: ({addFavoriteTrack, currentItem}) => () => {
      if (currentItem.name) {
        addFavoriteTrack({
          artist: {
            name: currentItem.artist
          },
          name: currentItem.name,
          image: [
            {
              '#text': currentItem.thumbnail
            }
          ]
        });
      }
    },
    handleClearClick: ({clearQueue, resetPlayer, sendPaused}) => () => {
      clearQueue();
      resetPlayer(sendPaused);
    }
  })
);

export default enhance(QueueMenuMore);
