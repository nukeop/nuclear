import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import logger from 'electron-timber';
import _ from 'lodash';


import { removeQuotes, createLastFMLink } from '../../../../../utils';
import { favoriteTrackShape, favoriteAlbumShape } from '../../../../../constants/propTypes';
import ItemType from '../../../../../constants/itemType';
import { findAlbum, releaseInfo } from '../../../../../rest/Discogs';

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

function getReleaseInfo({ artist, title }) {
  let masterId;
  return findAlbum(artist, title)
    .then(findResponse => findResponse.json())
    .then(findResults => {
      if (_.isEmpty(findResults) || _.isEmpty(findResults.results)) {
        return null;
      }

      return findResults.results[0].master_id;
    })
    .then(id => {
      if (!id) {
        throw Error(`No release was found for given search criteria. Artist: ${artist}, ablum: ${title}`);
      }

      masterId = id;
      return releaseInfo(masterId, 'master');
    })
    .then(releaseResponse => releaseResponse.json())
    .catch(error => {
      logger.error(error);

      throw error;
    });
}

function showSuccessInfo(action, item, settings, type) {
  const { artist, title, thumbnail } = item;
  action(
    `Favorite ${type} added`,
    `${artist} - ${title} has been added to favorites.`,
    <img src={thumbnail} />,
    settings
  );
}

const FavoriteIcon = ({ isFavorite, onClick }) =>
  <Icon
    className={styles.card_favorite}
    name={isFavorite ? 'star' : 'star outline'}
    size='large'
    onClick={onClick}
  />;

const BestNewMusicCard = ({
  actions,
  item,
  favoriteItem,
  onClick,
  settings,
  type
}) => {
  const { artist, title, thumbnail } = item;

  const handleFavoriteIconClick = useCallback((e) => {
    e.stopPropagation();

    if (favoriteItem) {
      const removeAction = type === ItemType.ALBUM
        ? actions.removeFavoriteAlbum
        : actions.removeFavoriteTrack;

      removeAction(favoriteItem);
    } else {
      if (type === ItemType.TRACK) {
        actions.addFavoriteTrack(toFavoriteTrack(item));
        showSuccessInfo(actions.info, item, settings, type);
      }

      if (type === ItemType.ALBUM) {
        getReleaseInfo(item)
          .then(releaseItem => {
            actions.addFavoriteAlbum(releaseItem);
            showSuccessInfo(actions.info, item, settings, type);
          })
          .catch(() => {
            actions.info(
              `Failed to add ${artist} - ${title} to favorites`,
              'Probably album is not available at Discogs database',
              <img src={thumbnail} />,
              settings
            );
          });
      }
    }
  }, [favoriteItem, type, actions, item, artist, title, thumbnail, settings]);

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
          <FavoriteIcon isFavorite={!!favoriteItem} onClick={handleFavoriteIconClick} />
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
    addFavoriteAlbum: PropTypes.func,
    addFavoriteTrack: PropTypes.func,
    remoteFavoriteAlbum: PropTypes.func,
    removeFavoriteTrack: PropTypes.func,
    info: PropTypes.func
  }),
  item: bestNewItemShape,
  favoriteItem: PropTypes.oneOfType([favoriteTrackShape, favoriteAlbumShape]),
  onClick: PropTypes.func,
  settings: PropTypes.object,
  type: PropTypes.oneOf([ItemType.TRACK, ItemType.ALBUM]).isRequired
};

BestNewMusicCard.defaultProps = {
  actions: {},
  item: null,
  favoriteItem: null,
  onClick: () => { },
  settings: {}
};

export default BestNewMusicCard;
