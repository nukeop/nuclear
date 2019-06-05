import React, { useCallback } from 'react';

import styles from './styles.scss';

const Seekbar = ({ seek, queue, fill }) => {
  const handleClick = useCallback(event => {
    const percent = (event.pageX - event.target.offsetLeft)/document.body.clientWidth;
    const duration = queue.queueItems[queue.currentSong].streams[0].duration;

    seek(percent * duration);
  }, [seek, queue.queueItems]);

  return (
    <div onClick={handleClick} className={styles.seekbar_container}>
      <div style={{width: fill}} className={styles.seekbar_fill} />
    </div>
  );
};

export default Seekbar;
