import React from 'react';
import PropTypes from 'prop-types';

import { bestNewItemShape } from '..';

import styles from './styles.scss';

const BestNewMusicCard = props => {
  const {
    item,
    onClick
  } = props;
  
  return (
    <div
      className={styles.best_new_music_card}
      onClick={ onClick }
    >
      <div className={styles.card_thumbnail}>
        <img alt={item.title} src={item.thumbnail}/>
      </div>
      <div className={styles.card_info}>
        <div className={styles.card_title}>
          { item.title }
        </div>
        <div className={styles.card_artist}>
          { item.artist }
        </div>
      </div>
    </div>
  );
}

BestNewMusicCard.propTypes = {
  item: bestNewItemShape,
  onClick: PropTypes.func
};

export default BestNewMusicCard;
