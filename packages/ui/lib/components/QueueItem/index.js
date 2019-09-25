import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import 'boxicons/css/boxicons.min.css';

import Loader from '../Loader';
import common from '../../common.scss';
import styles from './styles.scss';

const QueueItem = props => {
  let {
    isLoading,
    isCurrent,
    index,
    track,
    duration,
    selectSong,
    removeFromQueue
  } = props;
  
  return (
    <div
      className={cx(
        common.nuclear,
        styles.queue_item,
        {[`${styles.current_song}`]: isCurrent}
      )}
      onDoubleClick={() => selectSong(index)}
    >
      <div className={styles.thumbnail}>
        {
          isLoading
            ? <Loader type='small' />
            : <img src={track.thumbnail} />
        }

        <div
          className={styles.thumbnail_overlay}
          onClick={() => removeFromQueue(index)}
        >
          <i className='bx bx-trash bx-sm' />
        </div>
      </div>

      <div className={styles.item_info_container}>
        <div className={styles.name_container}>
          {track.name}
        </div>
        <div className={styles.artist_container}>
          {track.artist}
        </div>
      </div>

      <div className={styles.item_duration_container}>
        <div className={styles.item_duration}>
          { duration }
        </div>
      </div>
    </div>
  );
};

QueueItem.propTypes = {
  isLoading: PropTypes.bool,
  isCurrent: PropTypes.bool,
  track: PropTypes.shape({
    thumbnail: PropTypes.string,
    name: PropTypes.string,
    artist: PropTypes.string
  }),
  index: PropTypes.number,
  duration: PropTypes.string,
  selectSong: PropTypes.func,
  removeFromQueue: PropTypes.func
};

export default QueueItem;
