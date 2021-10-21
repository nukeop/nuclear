import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon } from 'semantic-ui-react';
import { compose, withHandlers } from 'recompose';
import _ from 'lodash';

import Loader from '../Loader';
import common from '../../common.scss';
import styles from './styles.scss';

import artPlaceholder from '../../../resources/media/art_placeholder.png';
import { getTrackArtist, getTrackTitle } from '../../utils';

export const QueueItem = ({
  isLoading,
  isCurrent,
  isCompact,
  track,
  duration,
  error,

  handleRemoveFromQueue,
  handleSelectSong
}) => (
  <div
    className={cx(
      common.nuclear,
      styles.queue_item,
      { [`${styles.current_song}`]: isCurrent },
      { [`${styles.error}`]: Boolean(error) },
      { [`${styles.compact}`]: isCompact }
    )}
    onDoubleClick={handleSelectSong}
  >
    <div className={styles.thumbnail}>
      {
        isLoading
          ? <Loader type='small' />
          : <img src={_.defaultTo(track.thumbnail, artPlaceholder)} />
      }

      <div
        className={styles.thumbnail_overlay}
        onClick={handleRemoveFromQueue}
      >
        <Icon name='trash alternate outline' size={isCompact ? 'large' : 'big'} />
      </div>
    </div>

    {
      !error && 
      <>
        <div className={styles.item_info_container}>
          <div className={styles.name_container}>
            {getTrackTitle(track)}
          </div>
          <div className={styles.artist_container}>
            {getTrackArtist(track)}
          </div>
        </div>

        <div className={styles.item_duration_container}>
          <div className={styles.item_duration}>
            {duration}
          </div>
        </div>
      </>
    }

    {
      Boolean(error) &&
        <div className={styles.error_overlay}>
          <div className={styles.error_message}>{error.message}</div>
          <div className={styles.error_details}>{error.details}</div>
        </div>
    }
  </div>
);

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
  error: PropTypes.oneOf([
    PropTypes.bool,
    PropTypes.shape({
      message: PropTypes.string,
      details: PropTypes.string
    })
  ])
};

export const enhance = compose(
  withHandlers({
    handleRemoveFromQueue: ({ removeFromQueue, track, resetPlayer }) => () => {
      removeFromQueue(track);
      if (resetPlayer) {
        resetPlayer();
      }
    },
    handleSelectSong: ({ selectSong, index }) => () => selectSong(index)
  })
);

export default enhance(QueueItem);
