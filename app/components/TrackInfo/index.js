import React from 'react';

import styles from './styles.scss';

class TrackInfo extends React.Component {

  render() {
    let {
      track,
      artist,
      artistInfoSearchByName,
      history
    } = this.props;
    return (
      <div className={styles.track_info_container}>
        <div className={styles.track_name}>{track}</div>
        <a
          onClick={() => artistInfoSearchByName(artist, history)}
          href='#'
        >
          <div className={styles.artist_name}>
            {artist}
          </div>
        </a>
      </div>
    );
  }
}

export default TrackInfo;
