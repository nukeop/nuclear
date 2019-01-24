import React from 'react';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';

import Card from '../../Card';
import PlaylistResults from '../PlaylistResults'
import TracksResults from '../TracksResults'

import styles from './styles.scss';

class AllResults extends React.Component {
  constructor(props) {
    super(props);
  }
  renderResults (collection, onClick) {
    return collection.slice(0, 5).map((el, i) => {
      return (
        <Card
          small
          header={el.title}
          image={el.thumb || artPlaceholder}
          onClick={() => onClick(el.id, el.type)}
          key={'item-' + i}
        />
      );
    });
  }

  renderTracks (arr = [], limit = 5) {
    return (<TracksResults
      addToQueue={this.props.addToQueue}
      tracks={arr}
      limit='5'
      musicSources={this.props.musicSources}
    />)
  }

  renderPlaylistSection () {
    return (
      <div className={styles.column}>
        <h3>Playlist</h3>
        <div className={styles.row}>
          <PlaylistResults
            playlistSearchStarted={this.props.playlistSearchStarted}
            playlistSearchResults={this.props.playlistSearchResults}
            addToQueue={this.props.addToQueue}
            musicSources={this.props.musicSources}
          ></PlaylistResults>
        </div>
      </div>)
  }

  renderArtistsSection () {
    return (<div className={styles.column}>
      <h3>Artists</h3>
      <div className={styles.row}>
        {this.renderResults(
          this.props.artistSearchResults,
          this.props.artistInfoSearch
        )}
      </div>
    </div>)
  }

  renderAlbumsSection () {
    return (<div className={styles.column}>
      <h3>Albums</h3>
      <div className={styles.row}>
        {this.renderResults(
          this.props.albumSearchResults,
          this.props.albumInfoSearch
        )}
      </div>
    </div>)
  }

  renderTracksSection () {
    return (<div className={styles.column}>
      <h3>Tracks</h3>
      <div className={styles.row}>
        {this.renderTracks(this.props.trackSearchResults.info)}
      </div>
    </div>)
  }

  render () {
    if (
      this.props.artistSearchResults.length <= 0 &&
      this.props.albumSearchResults.length <= 0 &&
      this.props.trackSearchResults.length <= 0
    ) {
      return <div>Nothing found.</div>;
    }

    return (
      <div className={styles.all_results_container}>
        {this.renderArtistsSection()}
        {this.renderAlbumsSection()}
        {this.renderTracksSection()}
        {this.renderPlaylistSection()}
      </div>
    );
  }
}

export default AllResults;
