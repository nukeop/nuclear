import React from 'react';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import ContextPopup from '../ContextPopup';
import TrackRow from '../TrackRow';

import Spacer from '../Spacer';
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
                {playlist.tracks.map((track, index) => {
                  _.set(track, 'artist.name', track.artist);
                  _.set(track, 'image[0][\'#text\']', track.thumbnail);
                  return (< TrackRow
                    key={'playlist-track-row-' + index}
                    track={track}
                    index={'playlist-track-' + index}
                    clearQueue={this.props.clearQueue}
                    addToQueue={this.props.addToQueue}
                    startPlayback={this.props.startPlayback}
                    selectSong={this.props.selectSong}
                    musicSources={this.props.musicSources}
                    displayCover={true}
                    displayArtist={true}
                    displayDuration={false}
                    displayPlayCount={false}
                  />
                  );
                })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default PlaylistView;
