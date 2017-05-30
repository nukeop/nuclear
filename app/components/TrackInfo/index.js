import React from 'react';

import styles from './styles.css';

class TrackInfo extends React.Component {

  render() {
    return (
      <div className={styles.track_info_container}>
        <div className={styles.track_name}>{this.props.track}</div>
        <div className={styles.artist_name}>{this.props.artist}</div>
      </div>
    );
  }
}

export default TrackInfo;
