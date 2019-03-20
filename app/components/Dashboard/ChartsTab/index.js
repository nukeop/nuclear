import React from 'react';
import { Tab } from 'semantic-ui-react';
import TrackRow from '../../TrackRow';
import FontAwesome from 'react-fontawesome';


import styles from './styles.scss';

class ChartsTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <Tab.Pane attached={false}>
        <div className={styles.popular_tracks_container}>
          <h3>Top Tracks from LastFm.</h3>
          <table>
            <thead className={styles.popular_tracks_header}>
              <tr>
                <th>
                  <FontAwesome name='' />
                </th>
                <th>Artist</th>
                <th>Title</th>
                <th>Playcounts</th>
              </tr>
              <tr />
            </thead>
            <tbody>
              {this.props.topTracks.map((track, index) => {
                return <TrackRow
                  key={'popular-track-row-' + index}
                  track={track}
                  index={'popular-track-' + index}
                  clearQueue={this.props.clearQueue}
                  addToQueue={this.props.addToQueue}
                  startPlayback={this.props.startPlayback}
                  selectSong={this.props.selectSong}
                  musicSources={this.props.musicSources}
                  displayCover
                  displayArtist
                  displayPlayCount
                />;
              })}
            </tbody>
          </table>
        </div>
      </Tab.Pane>
    );
  }
}

export default ChartsTab;
