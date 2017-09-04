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
      </div>
    );

  }
}

export default PopularTracks;
