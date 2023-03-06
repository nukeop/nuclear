import React from 'react';
import { Icon } from 'semantic-ui-react';
import { createLastFMLink } from '../../../../../utils';
import styles from './styles.scss';
import { PitchforkAlbum, PitchforkTrack } from '../../../../../actions/dashboard';
import { Setting, Track } from '@nuclear/core';
import { removeFavoriteTrack, addFavoriteTrack } from '../../../../../actions/favorites';
import { info } from '../../../../../actions/toasts';

type BestNewMusicCardProps = {
  item: PitchforkAlbum;
  onClick: (activeItem: PitchforkAlbum | PitchforkTrack) => void;
  withFavoriteButton?: boolean;
  actions?: {
    removeFavoriteTrack: typeof removeFavoriteTrack;
    addFavoriteTrack: typeof addFavoriteTrack;
    info: typeof info;
  };
  favoriteTrack?: Track;
  settings?: Setting[];
}

type ToFavoriteTrackArgs = {
  artist: string;
  title: string;
  thumbnail: string;
}

type ToFavoriteTrackReturn = {
  name: string;
  artist: {
    name: String;
  },
  url: string;
  image : 
    {'#text': string, size: string}[] 
}

const toFavoriteTrack = ({ artist, title, thumbnail }: ToFavoriteTrackArgs): ToFavoriteTrackReturn => {
  const url = createLastFMLink(artist, name);

  return {
    name: title,
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
};

const FavoriteIcon = ({ isFavorite, onClick, dataTestId }) =>
  <Icon
    data-testid={dataTestId}
    className={styles.card_favorite}
    name={isFavorite ? 'star' : 'star outline'}
    size='large'
    onClick={onClick}
  />;

const BestNewMusicCard: React.FC<BestNewMusicCardProps> = ({
  item,
  onClick,
  withFavoriteButton,
  favoriteTrack,
  actions,
  settings
}) => {
  const { artist, title, thumbnail } = item;

  const handleClick = () => {
    onClick(item);
  };

  return (
    <div
      className={styles.best_new_music_card}
      onClick={handleClick}
    >
      <div className={styles.card_thumbnail}>
        <img alt={title} src={thumbnail} />
      </div>
      <div className={styles.card_info}>
        <div className={styles.card_title_row}>
          <div className={styles.card_title} data-testid={`best-new-music-card-title-${title}`}>
            {title}
          </div>
          {withFavoriteButton && <FavoriteIcon
            dataTestId={`favorite-icon-${artist}-${title}`}
            isFavorite={!!favoriteTrack}
            onClick={e => {
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
        <div className={styles.card_artist} data-testid={`best-new-music-card-artist-${item.artist}`}>
          {item.artist}
        </div>
      </div>
    </div>
  );
};

export default BestNewMusicCard;
