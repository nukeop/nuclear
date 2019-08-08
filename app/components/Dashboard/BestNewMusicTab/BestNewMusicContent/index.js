import React from 'react';
import PropTypes from 'prop-types';

import { bestNewItemShape } from '../BestNewMusicMenu/BestNewMusicCard';

import styles from './styles.scss';

const BestNewMusicContent = ({
  item,
  albumInfoSearchByName,
  artistInfoSearchByName,
  history
}) => {
  if (item === null) {
    return null;
  }

  return (
    <div className={styles.best_new_music_content}>
      <div className={styles.review_header}>
        <div className={styles.thumbnail}>
          <img alt={item.title} src={item.thumbnail} />
        </div>
        <div className={styles.review_headings}>
          <div
            className={styles.artist}
            onClick={() => artistInfoSearchByName(item.artist, history)}
          >
            {item.artist}
          </div>
          <div
            className={styles.title}
            onClick={() => albumInfoSearchByName(item.title + ' ' + item.artist, history)}
          >
            {item.title}
          </div>
        </div>
        {
          item.score &&
          <div className={styles.score}>
            <div className={styles.score_box}>
              {item.score}
            </div>
          </div>
        }
      </div>
      {
        item.review.split('\n').map((paragraph, i) => {
          return (
            <p key={'item-' + i} className={styles.paragraph}>
              {paragraph}
            </p>
          );
        })
      }
    </div>
  );
};

BestNewMusicContent.propTypes = {
  item: bestNewItemShape,
  artistInfoSearchByName: PropTypes.func,
  albumInfoSearchByName: PropTypes.func,
  history: PropTypes.object
};

BestNewMusicContent.defaultProps = {
  item: null,
  artistInfoSearchByName: () => { },
  albumInfoSearchByName: () => { },
  history: {}
};

export default BestNewMusicContent;
