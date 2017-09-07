import React from 'react';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';

import styles from './styles.scss';

class PopularTracks extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.popular_tracks_container}>
        <div className={styles.header}>
          Popular tracks:
        </div>
        {
          this.props.tracks.track.slice(0, 5).map(track => {
            return (
              <div className={styles.track_row}>
                <img src={track.image[0]['#text'] || artPlaceholder} />
                <div>{track.name}</div>
              </div>
            )
          })
        }
      </div>
    );

  }
}

export default PopularTracks;
