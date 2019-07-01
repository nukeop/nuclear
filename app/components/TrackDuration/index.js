import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const TrackDuration = ({ timePlayed, timeToEnd }) => {
  return (
    <div className={styles.track_duration}>
      <div className={styles.time_played}>
        { timePlayed }
      </div>
      <div className={styles.time_to_end}>
        { timeToEnd }
      </div>
    </div>
  );
};

TrackDuration.propTypes = {
  timePlayed: PropTypes.string,
  timeToEnd: PropTypes.string
};

TrackDuration.defaultProps = {
  timePlayed: '',
  timeToEnd: ''
};

export default TrackDuration;
