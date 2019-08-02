import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';
import { Icon } from 'semantic-ui-react';

const BestNewMusicCard = ({
  item,
  isFavorite,
  onClick,
  withFavoriteButton
} ) => {

  return (
    <div
      className={styles.best_new_music_card}
      onClick={onClick}
    >
      <div className={styles.card_thumbnail}>
        <img alt={item.title} src={item.thumbnail} />
      </div>
      <div className={styles.card_info}>
        <div className={styles.card_title_row}>
          <div className={styles.card_title}>
            {item.title}
          </div>
          {withFavoriteButton && isFavorite && <Icon className={styles.card_favorite} name='star' size='large' />}
        </div>
        <div className={styles.card_artist}>
          {item.artist}
        </div>
      </div>
    </div>
  );
};

export const bestNewItemShape = PropTypes.shape({
  abstract: PropTypes.string,
  artist: PropTypes.string,
  genres: PropTypes.arrayOf(PropTypes.string),
  review: PropTypes.string,
  reviewUrl: PropTypes.string,
  score: PropTypes.string,
  thumbnail: PropTypes.string,
  title: PropTypes.string
});

BestNewMusicCard.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    artist: PropTypes.string,
    thumbnail: PropTypes.string
  }),
  isFavorite: PropTypes.bool,
  onClick: PropTypes.func,
  withFavoriteButton: PropTypes.bool
};

BestNewMusicCard.defaultProps = {
  item: null,
  isFavorite: false,
  onClick: () => { },
  withFavoriteButton: false
};

export default BestNewMusicCard;
