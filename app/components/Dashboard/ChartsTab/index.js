import React from 'react';
import { Tab } from 'semantic-ui-react';
import FontAwesome from 'react-fontawesome';

import TrackRow from '../../TrackRow';

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
            <thead>
              <tr>
                <th>
                  <FontAwesome name='image' />
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
                  displayCover
                  displayArtist
                  displayPlayCount
                  withFavorites
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
