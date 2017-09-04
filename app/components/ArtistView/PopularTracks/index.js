import React from 'react';

import styles from './styles.scss';

class PopularTracks extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.tracks);
    return (
      <div className={styles.popular_tracks_container}>
        <div className={styles.header}>
          Popular tracks:
        </div>
        {
          this.props.tracks.track.map(track => {
            return (
              <div className={styles.track_row}>
                <img src={track.image[0]['#text']} />
                <div>{track.name}</div>
                <div>{track.playcount}</div>

              </div>
            )
          })
        }
      </div>
    );

  }
}

export default PopularTracks;
