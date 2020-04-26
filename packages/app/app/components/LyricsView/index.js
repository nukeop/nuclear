import React from 'react';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import LyricsHeader from './LyricsHeader';

import styles from './styles.scss';

export class LyricsView extends React.Component {
  constructor(props) {
    super(props);
  }

  renderLyrics () {
    const lyrics = this.props.lyrics;
    let lyricsStr = _.get(lyrics, 'lyricsSearchResults', '');
    lyricsStr = _.get(lyricsStr, 'type', '');
    if (lyricsStr === '') {
      lyricsStr = this.props.t('not-found');
    }
    return (
      <div className={styles.lyrics_text}>
        {lyricsStr}
      </div>);
  }

  renderLyricsHeader () {
    const track = this.props.track;
    return (
      <LyricsHeader
        name={track.name}
        artist={track.artist}
      />
    );
  }

  renderNoSelectedTrack () {
    return (
      <div className={styles.empty_state}>
        <FontAwesome name='music'/>
        <h2>{this.props.t('empty')}</h2>
        <div>{this.props.t('empty-help')}</div>
      </div>
    );
  }

  render () {
    const track = this.props.track;
    
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


export default withTranslation('lyrics')(LyricsView);
