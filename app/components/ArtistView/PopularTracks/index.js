import React from 'react';
import FontAwesome from 'react-fontawesome';
import numeral from 'numeral';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';
import ContextPopup from '../../ContextPopup';

import styles from './styles.scss';

class PopularTracks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };
  }

  toggleExpand() {
    this.setState(prevState => {
      return { expanded: !prevState.expanded };
    });
  }

  addToQueue(artist, track) {
    this.props.addToQueue(this.props.musicSources, {
      artist: artist.name,
      name: track.name,
      thumbnail: track.image[0]['#text'] || artPlaceholder
    });
  }

  renderPopup(key, artist, track, contents) {
    return (
      <ContextPopup
        key={key}
        trigger={
          <div className={styles.track_row}>
            <img src={track.image[0]['#text'] || artPlaceholder} />
            <div className={styles.popular_track_name}>{track.name}</div>
            <div className={styles.playcount}>
              {numeral(track.playcount).format('0,0')} plays
            </div>
          </div>
        }
        artist={artist.name}
        title={track.name}
        thumb={track.image[0]['#text'] || artPlaceholder}
      >
        {contents}
      </ContextPopup>
    );
  }

  renderAddTrackToQueueButton(track, index, artist) {
    return (
      <a
        key={'add-track-' + index}
        href='#'
        onClick={() => this.addToQueue(artist, track)}
        className={styles.add_button}
        aria-label='Add track to queue'
      >
        <FontAwesome name='plus' /> Add to queue
      </a>
    );
  }

  renderPlayTrackButton(track, index) {
    let { artist, selectSong, startPlayback, clearQueue } = this.props;

    return (
      <a
        key={'play-track-' + index}
        href='#'
        onClick={() => {
          clearQueue();
          this.addToQueue(artist, track);
          selectSong(0);
          startPlayback();
          console.log(startPlayback())
        }}
        className={styles.add_button}
        aria-label='Play this track now'
      >
        <FontAwesome name='play' /> Play now
      </a>
    );
  }

  render() {
    let { artist, tracks } = this.props;

    return (
      <div className={styles.popular_tracks_container}>
        <div className={styles.header}>Popular tracks:</div>
        <a
          key='add-all-tracks-to-queue'
          href='#'
          onClick={() => {
            tracks.track
              .slice(0, this.state.expanded ? 15 : 5)
              .map((track, index) => {
                this.addToQueue(artist, track);
              });
          }}
          className={styles.add_button}
          aria-label='Add all tracks to queue'
        >
          <FontAwesome name='plus' /> Add all
        </a>
        {tracks.track
          .slice(0, this.state.expanded ? 15 : 5)
          .map((track, index) => {
            let popupContents = [
              this.renderAddTrackToQueueButton(track, index, artist),
              this.renderPlayTrackButton(track, index)
            ];
            return this.renderPopup(index, artist, track, popupContents);
          })}
        <div className='expand_button' onClick={this.toggleExpand.bind(this)}>
          <FontAwesome
            name={this.state.expanded ? 'angle-double-up' : 'angle-double-down'}
          />
        </div>
      </div>
    );
  }
}

export default PopularTracks;
