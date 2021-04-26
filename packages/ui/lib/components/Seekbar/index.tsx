import React, { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';

import common from '../../common.scss';
import styles from './styles.scss';
import { Popup } from 'semantic-ui-react';

type QueueItem = {
  streams: { duration: number }[];
};
type Segment = {
  startTime: number;
  endTime: number;
  category: string;
};

export type SeekbarProps = {
  children?: React.ReactNode;
  fill: number;
  seek: (arg0: number) => void;
  queue: {
    queueItems: QueueItem[];
    currentSong?: number;
  };
  height?: string;
  skipSegments?: Segment[];
  timePlayed?: number;
  segmentPopupMessage: string;
};

const Seekbar: React.FC<SeekbarProps> = ({
  children,
  fill,
  seek,
  queue,
  height,
  skipSegments=[],
  timePlayed,
  segmentPopupMessage
}) => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
    } else if (skipSegments && skipSegments.length && timePlayed) {
      for (const segment of skipSegments) {
        if (timePlayed >= segment.startTime && timePlayed <= segment.endTime) {
          seek(segment.endTime);
        }
      }
    }
  }, [hasMounted, seek, skipSegments, timePlayed]);
  const duration = queue?.queueItems[queue.currentSong]?.streams?.[0]?.duration;

  const handleClick = useCallback((seek) => {
    return event => {
      const percent = (event.pageX - event.target.offsetLeft) / document.body.clientWidth;
      seek(percent * duration);
    };
  }, [duration]);

  return (
    <div
      className={cx(
        common.nuclear,
        styles.seekbar
      )}
      onClick={handleClick(seek)}
      style={{ height }}
    >
      <div
        style={{ width: `${fill}%` }}
        className={cx(
          common.nuclear,
          styles.seekbar_progress
        )}
      >
        {children}
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
