import React from 'react';
import PropTypes from 'prop-types';

import { bestNewItemShape } from '..';

import styles from './styles.scss';

const BestNewMusicContent = props => {
  const { item } = props;

  if (item === null) {
    return null;
  }
  
  return (
    <div className={styles.best_new_music_content}>
      {
        item.review
      }
    </div>
  );
}

BestNewMusicContent.propTypes = {
  item: bestNewItemShape
};

BestNewMusicContent.defaultProps = {
  item: null
};

export default BestNewMusicContent;
