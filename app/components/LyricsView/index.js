import React from 'react';
import _ from 'lodash';

import styles from './styles.scss';

class LyricsView extends React.Component {
  constructor(props) {
    super(props);
  }

  renderLyrics () {
    let lyrics = this.props.lyrics;
    let lyricsStr = _.get(lyrics, 'lyricsSearchResults', '');
    lyricsStr = _.get(lyricsStr, 'type', '');
    if (lyricsStr === '') {
      lyricsStr = 'No lyrics were found for this song.';
    }
    return (<div className={styles.lyrics_text}>{lyricsStr}</div>);
  }

  renderLyricsHeader () {
    let track = this.props.track;
    return (
      <div className={styles.lyrics_header_overlay}>
        <div className={styles.lyrics_header_container}>
          <div className={styles.lyrics_artist_name_container} >
            <h1>{track.name} by {track.artist}</h1>
          </div>
        </div>
      </div>
    );
  }

  renderNoSelectedTrack () {
    return (<h1>Play a track from the queue to get the lyrics here</h1>);
  }

  render () {
    let track = this.props.track;
    if (track === null) {
      { this.renderNoSelectedTrack(); }
    }
    return (
      <div>
        {this.renderLyricsHeader()}
        {this.renderLyrics()}
      </div >
    );
  }
}

export default LyricsView;
