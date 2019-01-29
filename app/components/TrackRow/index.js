import React from 'react';
import numeral from 'numeral';
import FontAwesome from 'react-fontawesome';
import artPlaceholder from '../../../resources/media/art_placeholder.png';
import ContextPopup from '../ContextPopup';

import styles from './styles.scss';

class TrackRow extends React.Component {
  renderAddTrackToQueueButton(track, index, artist, addToQueue, musicSources) {
    return (
      <a
        key={'add-track-' + index}
        href='#'
        onClick={() =>
          addToQueue(musicSources, {
            artist: artist.name,
            name: track.name,
            thumbnail: track.image[0]['#text'] || artPlaceholder
          })
        }
        className={styles.add_button}
        aria-label='Add track to queue'
      >
        <FontAwesome name='plus' /> Add to queue
      </a>
    );
  }

  renderPlayTrackButton(
    index,
    track,
    artist,
    clearQueue,
    addToQueue,
    selectSong,
    startPlayback,
    musicSources
  ) {
    return (
      <a
        key={'play-track-' + index}
        href='#'
        onClick={() => {
          clearQueue();
          addToQueue(musicSources, {
            artist: artist.name,
            name: track.name,
            thumbnail: track.image[0]['#text'] || artPlaceholder
          });
          selectSong(0);
          startPlayback();
        }}
        className={styles.add_button}
        aria-label='Play this track now'
      >
        <FontAwesome name='play' /> Play now
      </a>
    );
  }

  render() {
    let {
      index,
      track,
      artist,
      clearQueue,
      addToQueue,
      selectSong,
      startPlayback,
      musicSources
    } = this.props;

    let popupContents = [
      this.renderAddTrackToQueueButton(
        track,
        index,
        artist,
        addToQueue,
        musicSources
      ),
      this.renderPlayTrackButton(
        index,
        track,
        artist,
        clearQueue,
        addToQueue,
        selectSong,
        startPlayback,
        musicSources
      )
    ];
    return (
      <ContextPopup
        key={'track-' + index}
        trigger={
          <div className={styles.track_row}>
            <img src={track.image[0]['#text'] || artPlaceholder} />
            <div className={styles.row_track_name}>{track.name}</div>
            <div className={styles.playcount}>
              {numeral(track.playcount).format('0,0')} plays
            </div>
          </div>
        }
        artist={artist.name}
        title={track.name}
        thumb={track.image[0]['#text'] || artPlaceholder}
      >
        {popupContents}
      </ContextPopup>
    );
  }
}

export default TrackRow;
