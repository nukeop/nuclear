import React from 'react';
import { Tab } from 'semantic-ui-react';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';
import numeral from 'numeral';

import styles from './styles.scss';

class ChartsTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    return (
      <Tab.Pane attached={false}>
        <div className={styles.popular_tracks_container}>
          <h3>Top Tracks from LastFm.</h3>
          {this.props.topTracks.map((track, i) => {
            return (
              <div key={'toptrack-' + i} className={styles.track_row}>
                <img src={track.image[0]['#text'] || artPlaceholder} />
                <div className={styles.popular_track_name}>{track.name}</div>
                <div className={styles.popular_track_artist}>
                  {track.artist.name}
                </div>
                <div className={styles.playcount}>
                  {numeral(track.playcount).format('0,0')} plays
                </div>
              </div>
            );
          })}
          {console.log(this.props.topTracks)}
        </div>
      </Tab.Pane>
    );
  }
}

export default ChartsTab;
