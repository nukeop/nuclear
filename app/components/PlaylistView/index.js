import React from 'react';
import _ from 'lodash';
import {
  Button,
  Icon
} from 'semantic-ui-react';

import InputDialog from '../InputDialog';
import ContextPopup from '../ContextPopup';
import PopupButton from '../ContextPopup/PopupButton';
import TrackRow from '../TrackRow';
import artPlaceholder from '../../../resources/media/art_placeholder.png';

import styles from './styles.scss';

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

  deletePlaylist(playlist) {
    const {
      history,
      deletePlaylist
    } = this.props;
    
    deletePlaylist(playlist.id);
    history.push('/playlists');
  }

  renamePlaylist(playlist, name) {
    const updatedPlaylist = _.cloneDeep(playlist);
    updatedPlaylist.name = name;
    this.props.updatePlaylist(updatedPlaylist);
  }

  renderOptions (trigger, playlist) {
    return (
      <ContextPopup
        trigger={trigger}
        artist={null}
        title={playlist.name}
        thumb={_.get(playlist, 'tracks[0].thumbnail', artPlaceholder)}
      >
        <PopupButton
          onClick={() =>
            this.deletePlaylist(this.props.playlist)
          }
          ariaLabel='Delete this playlist'
          icon='trash'
          label='Delete this playlist'
        />           
      </ContextPopup>
    );
  }

  renderPlayButton () {
    const {
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
        <Icon name='play' /> Play
      </a>
    );
  }

  renderPlaylistInfo () {
    let { playlist } = this.props;
    let popupTrigger = (
      <a href='#' className={styles.more_button}>
        <Icon name='ellipsis horizontal' />
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
          <label className={styles.playlist_header_label}>Playlist</label>
          <div className={styles.playlist_name}>
            { playlist.name }
            <InputDialog
              header={<h4>Input new playlist name:</h4>}
              placeholder='Playlist name...'
              accept='Rename'
              initialString={ playlist.name }
              onAccept={
                name => this.renamePlaylist(playlist, name)
              }
              trigger={
                <Button
                  basic
                  aria-label='Rename this playlist'
                  icon='pencil'
                />
              }
            />
          </div>
          <div className={styles.playlist_buttons}>
            { this.renderPlayButton() }
            { this.renderOptions(popupTrigger, playlist) }
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
            <Icon name='image' />
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
    const { playlist } = this.props;
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
