import React from 'react';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import ContextPopup from '../ContextPopup';
import TrackRow from '../TrackRow';

import Spacer from '../Spacer';
import artPlaceholder from '../../../resources/media/art_placeholder.png';

import styles from './styles.scss';

import { withRouter } from 'react-router-dom';


class PlaylistView extends React.Component {
  constructor(props) {
    super(props);
  }

  addPlaylistToQueue (
    musicSources,
    playlist,
    addTracks,
    selectSong,
    startPlayback
  ) {
    addTracks(musicSources, playlist.tracks);
    selectSong(0);
    startPlayback();
  }

  deletePlaylist(
    playlist,
    deletePlaylist,
    history
  ){
    deletePlaylist(playlist.name);
    history.push('/playlists');
  }

  renderOptions (trigger, playlist) {
    return (
      <ContextPopup
        trigger={trigger}
        artist={null}
        title={playlist.name}
        thumb={_.get(playlist, 'tracks[0].thumbnail', artPlaceholder)}
      >
        <div />
      </ContextPopup>
    );
  }

  renderPlayButton () {
    let {
      playlist,
      addTracks,
      musicSources,
      selectSong,
      startPlayback
    } = this.props;
    return (
      <a
        href='#'
        className={styles.play_button}
        onClick={() =>
          this.addPlaylistToQueue(
            musicSources,
            playlist,
            addTracks,
            selectSong,
            startPlayback
          )
        }
      >
        <FontAwesome name='play' /> Play
      </a>
    );
  }

  renderDeleteButton () {
    let {
      playlist,
      deletePlaylist
    } = this.props;
    const Button = withRouter(({ history }) => (
      <a
        href='#'
        className={styles.delete_button}
        onClick={() =>
          this.deletePlaylist(
            playlist,
            deletePlaylist,
            history
          )
        }
      >
        <FontAwesome name='trash-o' /> Delete
      </a>
    ));
    return (
      <Button/>
    );
  }

  renderPlaylistInfo () {
    let { playlist } = this.props;
    let popupTrigger = (
      <a href='#' className={styles.more_button}>
        <FontAwesome name='ellipsis-h' />
      </a>
    );
    return (
      <div className={styles.playlist_info}>
        <div>
          <img
            className={styles.playlist_thumbnail}
            src={_.get(playlist, 'tracks[0].thumbnail', '')}
          />
        </div>
        <div className={styles.playlist_header}>
          <div className={styles.playlist_name}>{playlist.name}</div>
          <Spacer />
          <div className={styles.playlist_buttons}>
            {this.renderPlayButton()}
            {this.renderDeleteButton()}
            {this.renderOptions(popupTrigger, playlist)}
          </div>
        </div>
      </div>
    );
  }

  renderPlaylistTracksHeader () {
    return (
      <thead>
        <tr>
          <th>
            <FontAwesome name='photo' />
          </th>
          <th>Artist</th>
          <th>Title</th>
        </tr>
      </thead>);
  }

  renderTrack (track, index) {
    const newTrack = _.cloneDeep(track);
    _.set(newTrack, 'artist.name', newTrack.artist);
    _.set(newTrack, 'image[0][\'#text\']', newTrack.thumbnail);
    
    return (< TrackRow
      key={'playlist-track-row-' + index}
      track={newTrack}
      index={'playlist-track-' + index}
      displayCover
      displayArtist
    />
    );
  }

  render () {
    let { playlist } = this.props;
    return (
      <div className={styles.playlist_view_container}>
        <div className={styles.playlist}>
          {this.renderPlaylistInfo()}
          <div className={styles.playlist_tracks}>
            <table>
              {this.renderPlaylistTracksHeader()}
              <tbody>
                {playlist.tracks.map((track, index) => this.renderTrack(track, index))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default PlaylistView;
