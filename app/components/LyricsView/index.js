import React from 'react';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';
import Header from '../Header';

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
      <Header>
        {track.name} by {track.artist}
      </Header>

    );
  }

  renderNoSelectedTrack () {
    return (
      <div className={styles.empty_state}>
        <FontAwesome name='music'/>
        <h2>Nothing is playing.</h2>
        <div>Add some music to the queue to display the lyrics here!</div>
      </div>
    );
  }

  render () {
    let track = this.props.track;
    
    return (
      <div className={styles.lyrics_view}>
        {
          track === null &&
            this.renderNoSelectedTrack()
        }
        {
          track !== null &&
            this.renderLyricsHeader()
        }
        {
          track !== null &&
            this.renderLyrics()
        }
      </div >
    );
  }
}

export default LyricsView;
