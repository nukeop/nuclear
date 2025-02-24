import React, { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';

import common from '../../common.scss';
import styles from './styles.scss';
import { Popup } from 'semantic-ui-react';

type QueueItem = {
  loading?: boolean;
  streams?: { duration?: number }[];
};

type Segment = {
  startTime: number;
  endTime: number;
  category: string;
};

export type SeekbarProps = {
  isLoading?: boolean;
  fill: number;
  seek: (arg0: number) => void;
  queue: {
    queueItems: QueueItem[];
    currentTrack?: number;
  };
  height?: string;
  skipSegments?: Segment[];
  allowSkipSegment?: boolean;
  timePlayed?: any;
  segmentPopupMessage: string;
};

const Seekbar: React.FC<SeekbarProps> = ({
  children,
  isLoading,
  fill,
  seek,
  queue,
  height,
  skipSegments = [],
  allowSkipSegment,
  timePlayed,
  segmentPopupMessage
}) => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
    } else if (allowSkipSegment && skipSegments && skipSegments.length && timePlayed) {
      for (const segment of skipSegments) {
        if (timePlayed >= segment.startTime && timePlayed <= segment.endTime) {
          seek(segment.endTime);
        }
      }
    }
  }, [hasMounted, seek, skipSegments, timePlayed, allowSkipSegment]);

  const duration = queue?.queueItems[queue.currentTrack]?.streams?.[0]?.duration;

  const handleClick = useCallback((seek) => {
    return event => {
      const percent = (event.pageX - event.target.offsetLeft) / document.body.clientWidth;
      seek(percent * duration);
    };
  }, [duration]);

  return (
    <div
      data-testid='seekbar'
      className={cx(
        common.nuclear,
        styles.seekbar,
        isLoading ? 'loading' : ''
      )}
      onClick={handleClick(seek)}
      style={{ height }}
    >
      <div
        data-testid='seekbar-fill'
        style={{ width: `${isLoading ? 0 : fill}%` }}
        className={cx(
          common.nuclear,
          styles.seekbar_progress
        )}
      >
        {!isLoading && children}
        {skipSegments.map((segment, index) => <Popup
          key={index}
          className={styles.seekbar_popup}
          trigger={
            <div
              className={styles.seekbar_segment}
              style={{
                width: `${(segment.endTime - segment.startTime) / duration * 100}%`,
                left: `${segment.startTime / duration * 100}%`
              }}
            />
          }
          content={segmentPopupMessage}
          position='top center'
          on='hover'
        />)
        }
      </div>
    </div>
  );
};

export default Seekbar;
