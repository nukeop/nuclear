import React, { useCallback } from 'react';
import cx from 'classnames';

import common from '../../common.scss';
import styles from './styles.scss';

type QueueItem = {
  streams: { duration: number }[];
};

export type SeekbarProps = {
  children?: React.ReactNode;
  fill: number;
  seek: (arg0: number) => void;
  queue: { queueItems: QueueItem[] };
  height?: string
};

const Seekbar: React.FC<SeekbarProps> = ({
  children,
  fill,
  seek,
  queue,
  height
}) => {

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
