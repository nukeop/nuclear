import React, { useCallback } from 'react';
import cx from 'classnames';
import { Icon } from 'semantic-ui-react';
import { isEmpty } from 'lodash';

import Loader from '../Loader';
import common from '../../common.scss';
import styles from './styles.scss';

import artPlaceholder from '../../../resources/media/art_placeholder.png';
import { getTrackArtist, getTrackTitle } from '../../utils';
import { Track } from '../../types';

export type QueueItemProps = {
  isLoading: boolean;
  isCurrent: boolean;
  isCompact: boolean;
  track: Track;
  index: number;
  duration: string;
  selectSong: (index: number) => void;
  removeFromQueue: (track: {}) => void;
  resetPlayer: () => void;
  error: boolean | {
    message: string;
    details: string;
  };
};

const isErrorWithMessage = (error: any): error is { message: string; details: string } => {
  return Boolean(error) && Boolean(error.message);
};

export const QueueItem: React.FC<QueueItemProps> = ({
  isLoading,
  isCurrent,
  isCompact,
  index,
  track,
  duration,
  error,
  resetPlayer,
  removeFromQueue,
  selectSong
}) => {
  const handleRemoveFromQueue = useCallback(() => {
    removeFromQueue(track);
    if (resetPlayer) {
      resetPlayer();
    }
  }, [removeFromQueue, track, resetPlayer]);
  const handleSelectSong = useCallback(() => selectSong(index), [selectSong, index]);
  return (
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
        {isLoading
          ? <Loader type='small' className={isCompact && styles.compact_loader} />
          : <img src={track.thumbnail ?? artPlaceholder} />}

        <div
          className={styles.thumbnail_overlay}
          onClick={handleRemoveFromQueue}
        >
          <Icon name='trash alternate outline' size={isCompact ? 'large' : 'big'} />
        </div>
      </div>

      {!error &&
      <>
        <div className={styles.item_info_container}>
          <div className={styles.name_container}>
            {getTrackTitle(track)}
          </div>
          <div className={styles.artist_container}>
            {getTrackArtist(track)}
          </div>
        </div>

        {!isLoading &&
              !isEmpty(track.streams) &&
              <div className={styles.item_duration_container}>
                <div className={styles.item_duration}>
                  {duration}
                </div>
              </div>}
      </>}

      {
        isErrorWithMessage(error) &&
        !isCompact &&
        <div className={styles.error_overlay}>
          <div className={styles.error_message}>{error.message}</div>
          <div className={styles.error_details}>{error.details}</div>
        </div>
      }
    </div>
  );
};

export default QueueItem;
