import React, { useCallback } from 'react';
import cx from 'classnames';
import { Icon } from 'semantic-ui-react';
import { isEmpty } from 'lodash';

import Loader from '../Loader';
import common from '../../common.scss';
import styles from './styles.scss';

import artPlaceholder from '../../../resources/media/art_placeholder.png';
import { getThumbnail, getTrackArtist, getTrackTitle } from '../../utils';
import { Track } from '../../types';
import Img from 'react-image';

export type QueueItemProps = {
  isCurrent: boolean;
  isCompact: boolean;
  track: Track;
  duration: string;
  streamLookupRetries: number;
  streamLookupRetriesLimit: number;
  onSelect: () => void;
  onRemove: () => void;
};

export const QueueItem: React.FC<QueueItemProps> = ({
  isCurrent,
  isCompact,
  track,
  duration,
  streamLookupRetries,
  streamLookupRetriesLimit,
  onRemove,
  onSelect
}) => {
  return (
    <div
      className={cx(
        common.nuclear,
        styles.queue_item,
        { [`${styles.current_song}`]: isCurrent },
        { [`${styles.error}`]: Boolean(track.error) },
        { [`${styles.compact}`]: isCompact }
      )}
      onDoubleClick={onSelect}
    >
      <div className={styles.thumbnail}>
        {track.loading
          ? <Loader type='small' className={isCompact && styles.compact_loader} />
          : (
            <Img               
              src={getThumbnail(track) ?? artPlaceholder}
              unloader={<img src={artPlaceholder}/>}
            />
          )}

        <div
          data-testid='queue-item-remove'
          className={styles.thumbnail_overlay}
          onClick={onRemove}
        >
          <Icon name='trash alternate outline' size={isCompact ? 'large' : 'big'} />
        </div>
      </div>

      {
        !track.error &&
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
        streamLookupRetries > 0 &&
        streamLookupRetries < streamLookupRetriesLimit &&
        <div className={styles.retry_overlay}>
          <div className={styles.retry_message}>
            {`Retrying stream lookup (${streamLookupRetries}/${streamLookupRetriesLimit})`}
          </div>
        </div>
      }

      {
        streamLookupRetries >= streamLookupRetriesLimit &&
        <div className={styles.error_overlay}>
          <div className={styles.error_icon}>
            <Icon name='lock' size='big' />
          </div>
          <div className={styles.error_message}>Failed to load stream.</div>
        </div>
      }
    </div>
  );
};

export default QueueItem;
