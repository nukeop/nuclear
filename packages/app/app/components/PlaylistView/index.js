import React from 'react';
import _ from 'lodash';
import {
  Button,
  Icon
} from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import { ContextPopup, PopupButton } from '@nuclear/ui';

import InputDialog from '../InputDialog';
import TrackRow from '../TrackRow';
import artPlaceholder from '../../../resources/media/art_placeholder.png';

import styles from './styles.scss';

@withTranslation('playlists')
class PlaylistView extends React.Component {
  constructor(props) {
    super(props);
  }

  async playAll (playlist) {
    this.props.clearQueue();
    await this.props.addTracks(playlist.tracks);
    this.props.selectSong(0);
    this.props.startPlayback();
  }

  removeTrack(playlist, trackToRemove) {
    const newPlaylist = _.cloneDeep(playlist);
    newPlaylist.tracks = _.filter(newPlaylist.tracks, track => track.uuid !== trackToRemove.uuid);
    this.props.updatePlaylist(newPlaylist);
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

  renderOptions (
    trigger,
    playlist
  ) {
    return (
      <ContextPopup
        trigger={trigger}
        artist={null}
        title={playlist.name}
        thumb={_.get(playlist, 'tracks[0].thumbnail', artPlaceholder)}
      >
        <PopupButton
          onClick={() =>
            this.props.addTracks(this.props.streamProviders, playlist.tracks)
          }
          ariaLabel={this.props.t('queue')}
          icon='plus'
          label={this.props.t('queue')}
        />
        <PopupButton
          onClick={() =>
            this.deletePlaylist(this.props.playlist)
          }
          ariaLabel={this.props.t('delete')}
          icon='trash'
          label={this.props.t('delete')}
        />
      </ContextPopup>
    );
  }

  renderPlayButton (playlist) {
    return (
      <a
        href='#'
        className={styles.play_button}
        onClick={async () =>
          await this.playAll(playlist, this.props.streamProviders)
        }
      >
        <Icon name='play' /> Play
      </a>
    );
  }

  renderPlaylistInfo (playlist) {
    const popupTrigger = (
      <a href='#' className={styles.more_button}>
        <Icon name='ellipsis horizontal' />
      </a>
    );

    return (
      <div className={styles.playlist_info}>
        <div>
          <img
            className={styles.playlist_thumbnail}
            src={_.get(playlist, 'tracks[0].thumbnail', artPlaceholder)}
          />
        </div>
        <div className={styles.playlist_header}>
          <label className={styles.playlist_header_label}>Playlist</label>
          <div className={styles.playlist_name}>
            { playlist.name }
            <InputDialog
              header={<h4>Input new playlist name:</h4>}
              placeholder={this.props.t('dialog-placeholder')}
              accept='Rename'
              initialString={playlist.name}
              onAccept={
                name => this.renamePlaylist(playlist, name)
              }
              trigger={
                <Button
                  basic
                  aria-label={this.props.t('rename')}
                  icon='pencil'
                />
              }
            />
          </div>
          <div className={styles.playlist_buttons}>
            { this.renderPlayButton(playlist) }
            { this.renderOptions(
              popupTrigger,
              playlist
            )
            }
          </div>
        </div>
      </div>
    );
  }

  renderPlaylistTracksHeader () {
    return (
      <thead>
        <tr>
          <th/>
          <th>
            <Icon name='image outline' />
          </th>
          <th>{this.props.t('artist')}</th>
          <th>{this.props.t('title')}</th>
        </tr>
      </thead>);
  }

  renderTrack (track, index) {
    const newTrack = _.cloneDeep(track);
    _.set(newTrack, 'artist.name', newTrack.artist);
    _.set(newTrack, 'image[0][\'#text\']', newTrack.thumbnail);

    return (
      < TrackRow
        key={'playlist-track-row-' + index}
        track={newTrack}
        index={'playlist-track-' + index}
        displayCover
        displayArtist
        withDeleteButton
        onDelete={e => {
          e.stopPropagation();
          this.removeTrack(this.props.playlist, track);
        }}
      />
    );
  }

  render () {
    const { playlist } = this.props;
    return (
      <div className={styles.playlist_view_container}>
        <div className={styles.playlist}>
          {this.renderPlaylistInfo(playlist)}
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
