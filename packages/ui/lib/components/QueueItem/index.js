import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon } from 'semantic-ui-react';
import { compose, withHandlers } from 'recompose';

import Loader from '../Loader';
import common from '../../common.scss';
import styles from './styles.scss';

const QueueItem = props => {
  let {
    isLoading,
    isCurrent,
    isCompact,
    track,
    duration,

    handleRemoveFromQueue,
    handleSelectSong
  } = props;

  return (
    <div
      className={cx(
        common.nuclear,
        styles.queue_item,
        {[`${styles.current_song}`]: isCurrent},
        {[`${styles.compact}`]: isCompact}
      )}
      onDoubleClick={handleSelectSong}
    >
      <div className={styles.thumbnail}>
        {
          isLoading
            ? <Loader type='small' />
            : <img src={track.thumbnail} />
        }

        <div
          className={styles.thumbnail_overlay}
          onClick={handleRemoveFromQueue}
        >
          <Icon name='trash alternate outline' size='big' />
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
  isCompact: PropTypes.bool,
  track: PropTypes.shape({
    thumbnail: PropTypes.string,
    name: PropTypes.string,
    artist: PropTypes.string
  }),
  index: PropTypes.number, // eslint-disable-line
  duration: PropTypes.string,
  selectSong: PropTypes.func, //eslint-disable-line
  removeFromQueue: PropTypes.func, //eslint-disable-line
  resetPlayer: PropTypes.func, //eslint-disable-line
  sendPaused: PropTypes.func //eslint-disable-line
};

export default compose(
  withHandlers({
    handleRemoveFromQueue: ({removeFromQueue, track, resetPlayer, sendPaused}) => () => {
      removeFromQueue(track);
      if (resetPlayer) { 
        resetPlayer(sendPaused); 
      }
    },
    handleSelectSong: ({selectSong, index}) => () => selectSong(index)
  })
)(QueueItem);
