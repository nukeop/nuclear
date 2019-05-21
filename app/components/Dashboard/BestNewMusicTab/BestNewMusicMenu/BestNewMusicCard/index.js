import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

import TrackPopupContainer from '../../../../../containers/TrackPopupContainer';

const BestNewMusicCard = props => {
  const {
    item,
    onClick,
    withPopupMenu
  } = props;

  const track = {
    artist: {
      name: item.artist
    },
    name: item.title
  };

  const card = () => (
    <div
      className={styles.best_new_music_card}
      onClick={onClick}
    >
      <div className={styles.card_thumbnail}>
        <img alt={item.title} src={item.thumbnail} />
      </div>
      <div className={styles.card_info}>
        <div className={styles.card_title}>
          {item.title}
        </div>
        <div className={styles.card_artist}>
          {item.artist}
        </div>
      </div>
    </div>
  );

  return withPopupMenu ? (
    <TrackPopupContainer
      trigger={card()}
      track={track}
      artist={item.artist}
      title={item.title}
      thumb={item.thumbnail}
    />
  ) : card();
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
  item: bestNewItemShape,
  onClick: PropTypes.func,
  withPopupMenu: PropTypes.bool
};

BestNewMusicCard.defaultProps = {
  withPopupMenu: false
};

export default BestNewMusicCard;
