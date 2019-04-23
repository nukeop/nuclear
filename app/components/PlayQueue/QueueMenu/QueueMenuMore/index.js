import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import {
  Dropdown,
  Icon,
  Menu
} from 'semantic-ui-react';

import styles from './styles.scss';

const addTrackToPlaylist = () => {

};

const addFavoriteTrackFromQueue = (addFavoriteTrack, track) => {
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
};

const QueueMenuMore = props => {
  const {
    clearQueue,
    savePlaylistDialog,
    addFavoriteTrack,
    updatePlaylist,
    playlists,
    currentItem
  } = props;
  
  return (
    <Dropdown
      item
      icon='ellipsis vertical'
      className={ styles.queue_menu_more }>
      <Dropdown.Menu>
        <Dropdown.Header>
          Queue
        </Dropdown.Header>
        <Dropdown.Item onClick={ clearQueue }>
          <Icon name='trash'/>
          Clear queue
        </Dropdown.Item>
        { savePlaylistDialog }
        <Dropdown.Divider />
        
        <Dropdown.Header>
          Current track
        </Dropdown.Header>
        <Dropdown.Item>
          <Dropdown text='Add to playlist' className='left'>
            <Dropdown.Menu className={ cx('left', styles.playlists_menu) }>
              {
                _.map(playlists, playlist => {
                  return (
                    <Dropdown.Item onClick={ () => updatePlaylist(playlist) }>
                      <Icon name='music'/>
                      { playlist.name }
                    </Dropdown.Item>
                  );
                })
              }
            </Dropdown.Menu>
          </Dropdown>
        </Dropdown.Item>
        <Dropdown.Item onClick={
          () => addFavoriteTrackFromQueue(addFavoriteTrack, currentItem)
        }>
          <Icon name='star'/>
          Add to favorites
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

QueueMenuMore.propTypes = {
  clearQueue: PropTypes.func,
  addFavoriteTrack: PropTypes.func,
  updatePlaylist: PropTypes.func,
  savePlaylistDialog: PropTypes.node,
  playlists: PropTypes.array,
  currentItem: PropTypes.object
};

QueueMenuMore.defaultProps = {
  clearQueue: () => {},
  addFavoriteTrack: () => {},
  updatePlaylist: () => {},
  savePlaylistDialog: null,
  playlists: [],
  currentItem: {}
};

export default QueueMenuMore;
