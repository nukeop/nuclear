import React, { useCallback, useRef, useEffect } from 'react';
import cx from 'classnames';

import common from '../../common.scss';
import styles from './styles.scss';

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
  queue: { queueItems: QueueItem[] };
  height?: string,
  skipSegment?: Segment[],
  timePlayed?: number
};

const Seekbar: React.FC<SeekbarProps> = ({
  children,
  fill,
  seek,
  queue,
  height,
  skipSegment,
  timePlayed
}) => {
  const hasMounted = useRef(false);
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
    } else {
      if (skipSegment && skipSegment.length && timePlayed) {
        for (const segment of skipSegment) {
          if (timePlayed >= segment.startTime && timePlayed <= segment.endTime) {
            seek(segment.endTime);
          }
        }
      }
    }
  }, [timePlayed])

  const handleClick = useCallback((seek, queue) => {
    return event => {
      const percent = (event.pageX - event.target.offsetLeft) / document.body.clientWidth;
      const duration = queue.queueItems[queue.currentSong].streams[0].duration;
      seek(percent * duration);
    };
  }, []);

  return (
    <div
      className={cx(
        common.nuclear,
        styles.seekbar
      )}
      onClick={handleClick(seek, queue)}
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
      </div>
    </div>
  );
};

export default Seekbar;
