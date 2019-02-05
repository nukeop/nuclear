import React from 'react';

import TracksResults from '../TracksResults';

import styles from './styles.scss';

class PlaylistResults extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      this.props.playlistSearchStarted ? ((this.props.playlistSearchStarted.length > 0 && typeof this.props.playlistSearchResults.info === 'undefined') ? <div>Loading...</div> : (<TracksResults
        addToQueue={this.props.addToQueue}
              tracks={this.props.playlistSearchResults.info}
        limit='100'
        musicSources={this.props.musicSources}
       />)) : <div>No result</div>
    );
  }
}

export default PlaylistResults;
