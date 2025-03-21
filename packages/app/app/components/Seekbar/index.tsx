import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const Seekbar = ({ seek, queue, fill, children }) => {
  const handleClick = useCallback(event => {
    const percent = (event.pageX - event.target.offsetLeft) / document.body.clientWidth;
    const duration = queue.queueItems[queue.currentTrack].streams?.[0]?.duration;

    seek(percent * duration);
  }, [queue.queueItems, queue.currentTrack, seek]);

  return (
    <div onClick={handleClick} className={styles.seekbar_container}>
      <div style={{ width: fill }} className={styles.seekbar_fill} />
      {children || <div className={styles.seekbar_placeholder}>00:00</div>}
    </div>
  );
};

Seekbar.propTypes = {
  seek: PropTypes.func,
  queue: PropTypes.shape({
    currentTrack: PropTypes.number,
    queueItems: PropTypes.array
  }),
  fill: PropTypes.string,
  children: PropTypes.node
};

Seekbar.defaultProps = {
  seek: () => { },
  queue: {},
  fill: '0%',
  children: null
};

export default Seekbar;
