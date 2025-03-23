import React, { useCallback } from 'react';
import cx from 'classnames';
import { Icon } from 'semantic-ui-react';
import { has, isEmpty } from 'lodash';

import Loader from '../Loader';
import common from '../../common.scss';
import styles from './styles.scss';

import artPlaceholder from '../../../resources/media/art_placeholder.png';
import { getThumbnail, getTrackArtist, getTrackTitle } from '../../utils';
import { Track } from '../../types';
import Img from 'react-image';

type QueueItemStrings = {
  locked: string
}

export type QueueItemProps = {
  isCurrent: boolean;
  isCompact: boolean;
  track: Track;
  duration: string;
  streamLookupRetries: number;
  streamLookupRetriesLimit: number;
  onSelect: () => void;
  onRemove: () => void;
  onReload: () => void;
  strings: QueueItemStrings;
};

const isErrorWithMessage = (error: Track['error']): error is { message: string; details: string } => {
  return Boolean(error) && has(error, 'message') && Boolean(error.message);
};

export const QueueItem: React.FC<QueueItemProps> = ({
  isCurrent,
  isCompact,
  track,
  duration,
  streamLookupRetries,
  streamLookupRetriesLimit,
  onRemove,
  onSelect,
  onReload,
  strings
}) => {
  const isLocked = streamLookupRetries >= streamLookupRetriesLimit;

  return (
    <div
      className={cx(
        common.nuclear,
        styles.queue_item,
        { [`${styles.current_track}`]: isCurrent },
        { [`${styles.error}`]: Boolean(track.error) },
        { [`${styles.locked}`]: isLocked },
        { [`${styles.compact}`]: isCompact }
      )}
      onDoubleClick={onSelect}
      onClick={isLocked && onReload}
    >
      <div className={styles.thumbnail}>
        {
          track.loading && 
          <Loader type='small' className={isCompact && styles.compact_loader} />
        }

        {
          isLocked && 
          <div className={styles.lock}>
            <Icon name='lock' size={isCompact ? 'small' : 'big'} className={styles.lock_icon} />
          </div>
        }

        {
          !track.loading && !isLocked &&
          <Img               
            src={getThumbnail(track) ?? artPlaceholder}
            unloader={<img src={artPlaceholder}/>}
          />
        } 

        <div
          data-testid='queue-item-remove'
          className={styles.thumbnail_overlay}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
        >
          <Icon name='trash alternate outline' size={isCompact ? 'large' : 'big'} />
        </div>
      </div>

      {
        !track.error && !isLocked && !isCompact &&
        <>
          <div className={styles.item_info_container}>
            <div className={styles.name_container}>
              {getTrackTitle(track)}
            </div>
            <div className={styles.artist_container}>
              {getTrackArtist(track)}
            </div>
          </div>

          {
            !track.loading &&
            !isLocked &&
              !isEmpty(track.streams) &&
              <div className={styles.item_duration_container}>
                <div className={styles.item_duration}>
                  {duration}
                </div>
              </div>
          }
        </>
      }

      {
        isErrorWithMessage(track.error) && !isCompact && <div className={styles.error_overlay}>
          <div className={styles.error_message}>{track.error && track.error.message}</div>
        </div>
      }

      {
        isLocked && !isCompact &&
        <div className={styles.error_overlay}>
          <div className={styles.error_message}>
            {strings.locked}
          </div>
        </div>
      }
    </div>
  );
};

export default QueueItem;
