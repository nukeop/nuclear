import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import common from '../../common.scss';
import styles from './styles.scss';

const handleClick = (seek, queue) => {
  return event => {
    let percent = (event.pageX - event.target.offsetLeft)/document.body.clientWidth;
    let duration = queue.queueItems[queue.currentSong].streams[0].duration;
    seek(percent * duration * 1000);
  };
};

const Seekbar = props => {
  return (
    <div
      className={cx(
        common.nuclear,
        styles.seekbar_container
      )}
      onClick={handleClick(props.seek, props.queue)}
    >
      <div
        style={{width: props.fill}}
        className={cx(
          common.nuclear,
          styles.seekbar_fill
        )}
      />
    </div>
  );
};

Seekbar.propTypes = {
  fill: PropTypes.string,
  seek: PropTypes.func,
  queue: PropTypes.object
};

export default Seekbar;
