import React, { useCallback } from 'react';

import styles from './styles.scss';

const TrackInfo = ({ track, artist, artistInfoSearchByName, history }) => {
  const handleInfoSearch = useCallback(() => {
    artistInfoSearchByName(artist, history);
  }, [artist, artistInfoSearchByName, history]);

  return (
    <div className={styles.track_info_container}>
      <div className={styles.track_name}>{track}</div>
      <a onClick={handleInfoSearch} href='#'>
        <div className={styles.artist_name}>{artist}</div>
      </a>
    </div>
  );
};

export default TrackInfo;
