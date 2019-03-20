import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { bestNewItemShape } from '..';

import styles from './styles.scss';

const BestNewMusicContent = props => {
  const { item } = props;

  if (item === null) {
    return null;
  }
  
  return (
    <div className={styles.best_new_music_content}>
      <div className={styles.review_header}>
        <div className={styles.thumbnail}>
          <img alt={ item.title } src={ item.thumbnail }/>
        </div>
        <div className={styles.review_headings}>
          <div className={styles.artist}>{ item.artist }</div>
          <div className={styles.title}>{ item.title }</div>
        </div>
        <div className={styles.score}>
          <div className={styles.score_box}>
            { item.score }
          </div>
        </div>
      </div>
      {
        item.review.split('\n').map(i => {
          return (
            <p key={'item-' + i} className={styles.paragraph}>
              {i}
            </p>
          );
        })
      }
    </div>
  );
};

BestNewMusicContent.propTypes = {
  item: bestNewItemShape
};

BestNewMusicContent.defaultProps = {
  item: null
};

export default BestNewMusicContent;
