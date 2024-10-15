import React, { useCallback } from 'react';
import cx from 'classnames';
import { Icon } from 'semantic-ui-react';
import { isEmpty } from 'lodash';

import Loader from '../Loader';
import common from '../../common.scss';
import styles from './styles.scss';

import artPlaceholder from '../../../resources/media/art_placeholder.png';
import { getTrackArtists, getTrackTitle } from '../../utils';
import { Track } from '../../types';
import Img from 'react-image';


export type QueueItemProps = {
  isCurrent: boolean;
  isCompact: boolean;
  track: Track;
  duration: string;
  onSelect: () => void;
  onRemove: () => void;
};

const isErrorWithMessage = (error: any): error is { message: string; details: string } => {
  return Boolean(error) && Boolean(error.message);
};

export const QueueItem: React.FC<QueueItemProps> = ({
  isCurrent,
  isCompact,
  track,
  duration,
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
          : <Img 
              src={track.thumbnail ?? artPlaceholder}
              unloader={<img src={artPlaceholder}/>}
            />}

        <div
          data-testid='queue-item-remove'
          className={styles.thumbnail_overlay}
          onClick={onRemove}
        >
          <Icon name='trash alternate outline' size={isCompact ? 'large' : 'big'} />
        </div>
      </div>

      {!track.error &&
      <>
        <div className={styles.item_info_container}>
          <div className={styles.name_container}>
            {getTrackTitle(track)}
          </div>
          <div className={styles.artist_container}>
            {getTrackArtists(track)?.[0]}
          </div>
        </div>

        {!track.loading &&
              !isEmpty(track.streams) &&
              <div className={styles.item_duration_container}>
                <div className={styles.item_duration}>
                  {duration}
                </div>
              </div>}
      </>}

      {
        isErrorWithMessage(track.error) &&
        !isCompact &&
        <div className={styles.error_overlay}>
          <div className={styles.error_message}>{track.error.message}</div>
        </div>
      }
    </div>
  );
};

export default QueueItem;
