import React from 'react';

import TracksResults from '../TracksResults';
import FontAwesome from 'react-fontawesome';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';
import _ from 'lodash';

import styles from './styles.scss';

class PlaylistResults extends React.Component {
  constructor(props) {
    super(props);
  }

  addTrack (track) {
    if (typeof track !== 'undefined') {
      this.props.addToQueue(this.props.musicSources, {
        artist: track.artist,
        name: track.name,
        thumbnail: _.get(track, 'image[1][\'#text\']', artPlaceholder)
      });
    }
  }
  renderAddAllButton (tracks) {
    return (tracks.length > 0 ? <a
      key='add-all-tracks-to-queue'
      href='#'
      onClick={() => {
        tracks
          .map(track => {
            this.addTrack(track);
          });
      }}
      className={styles.add_button}
      aria-label='Add all tracks to queue'
    >
      <FontAwesome name='plus' /> Add all
    </a> : null
    );
  }

  renderLoading () {
    return (<div>Loading... <FontAwesome name='spinner' pulse /></div>);
  }

  renderResults () {
    return (<div>
      {this.renderAddAllButton(this.props.playlistSearchResults.info)}
      <TracksResults
        addToQueue={this.props.addToQueue}
        tracks={this.props.playlistSearchResults.info}
        limit='100'
        musicSources={this.props.musicSources}
      /></div>);
  }

  renderNoResult () {
    return (<div>No result</div>);
  }
  render () {
    return (
      this.props.playlistSearchStarted ? ((this.props.playlistSearchStarted.length > 0 && typeof this.props.playlistSearchResults.info === 'undefined') ? this.renderLoading() : this.renderResults()) : this.renderNoResult()
    );
  }
}

export default PlaylistResults;
