import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import { Dropdown, Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import styles from './styles.scss';

const addTrackToPlaylist = (updatePlaylist, playlist, track) => {
  if (track.name) {
    playlist.tracks.push(track);
    updatePlaylist(playlist);
  }
};

const addFavoriteTrackFromQueue = (addFavoriteTrack, track) => {
  if (track.name) {
    addFavoriteTrack({
      artist: {
        name: track.artist
      },
      name: track.name,
      image: [
        {
          '#text': track.thumbnail
        }
      ]
    });
  }
};

const QueueMenuMore = ({
  clearQueue,
  savePlaylistDialog,
  addFavoriteTrack,
  addToDownloads,
  updatePlaylist,
  playlists,
  currentItem
}) => {
  const { t } = useTranslation('queue');

  return (
    <Dropdown item icon='ellipsis vertical' className={styles.queue_menu_more}>
      <Dropdown.Menu>
        <Dropdown.Header>{t('header')}</Dropdown.Header>
        <Dropdown.Item onClick={clearQueue}>
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
          onClick={() =>
            addFavoriteTrackFromQueue(addFavoriteTrack, currentItem)
          }
        >
          <Icon name='star' />
          {t('favorite-add')}
        </Dropdown.Item>
        <Dropdown.Item onClick={() => addToDownloads(currentItem)}>
          <Icon name='download' />
          {t('download')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

QueueMenuMore.propTypes = {
  clearQueue: PropTypes.func,
  addFavoriteTrack: PropTypes.func,
  addToDownloads: PropTypes.func,
  updatePlaylist: PropTypes.func,
  savePlaylistDialog: PropTypes.node,
  playlists: PropTypes.array,
  currentItem: PropTypes.object
};

QueueMenuMore.defaultProps = {
  clearQueue: () => {},
  addFavoriteTrack: () => {},
  addToDownloads: () => {},
  updatePlaylist: () => {},
  savePlaylistDialog: null,
  playlists: [],
  currentItem: {}
};

export default QueueMenuMore;
