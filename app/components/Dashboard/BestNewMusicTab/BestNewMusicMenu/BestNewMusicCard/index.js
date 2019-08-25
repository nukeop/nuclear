import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import { removeQuotes, createLastFMLink } from '../../../../../utils';
import { favoriteTrackShape } from '../../../../../constants/propTypes';
import styles from './styles.scss';

function toFavoriteTrack({ artist, title, thumbnail }) {
  const name = removeQuotes(title);
  const url = createLastFMLink(artist, name);

  return {
    name,
    artist: {
      name: artist
    },
    url,
    image: ['small', 'medium'].map(size =>
      ({
        '#text': thumbnail,
        size
      }))
  };
}

const FavoriteIcon = ({ isFavorite, onClick }) =>
  <Icon
    className={styles.card_favorite}
    name='star'
    size='large' onClick={onClick}
    disabled={!isFavorite}
  />;

const BestNewMusicCard = ({
  actions,
  item,
  favoriteTrack,
  onClick,
  settings,
  withFavoriteButton
}) => {
  const { artist, title, thumbnail } = item;

  return (
    <div
      className={styles.best_new_music_card}
      onClick={onClick}
    >
      <div className={styles.card_thumbnail}>
        <img alt={title} src={thumbnail} />
      </div>
      <div className={styles.card_info}>
        <div className={styles.card_title_row}>
          <div className={styles.card_title}>
            {title}
          </div>
          {withFavoriteButton && <FavoriteIcon isFavorite={!!favoriteTrack} onClick={e => {
            e.stopPropagation();

            if (favoriteTrack) {
              actions.removeFavoriteTrack(favoriteTrack);
            } else {
              actions.addFavoriteTrack(toFavoriteTrack(item));
              actions.info(
                'Favorite track added',
                `${artist} - ${title} has been added to favorites.`,
                <img src={thumbnail} />,
                settings
              );
            }
          }} />}
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
  actions: PropTypes.shape({
    addFavoriteTrack: PropTypes.func,
    removeFavoriteTrack: PropTypes.func,
    info: PropTypes.func
  }),
  item: bestNewItemShape,
  favoriteTrack: favoriteTrackShape,
  onClick: PropTypes.func,
  settings: PropTypes.object,
  withFavoriteButton: PropTypes.bool
};

BestNewMusicCard.defaultProps = {
  actions: {},
  item: null,
  favoriteTrack: null,
  onClick: () => { },
  settings: {},
  withFavoriteButton: false
};

export default BestNewMusicCard;
