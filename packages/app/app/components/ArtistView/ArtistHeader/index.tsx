import React from 'react';

import ArtistTags from '../ArtistTags';
import styles from '../styles.scss';
import { ArtistDetailsState } from '../../../reducers/search';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';
import { Icon } from 'semantic-ui-react';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';

type ArtistHeaderProps = {
isOnTour: boolean;
isFavorite: boolean;
artist: ArtistDetailsState;
removeFavoriteArtist: React.MouseEventHandler;
  addFavoriteArtist: React.MouseEventHandler;
}

export const ArtistHeader: React.FC<ArtistHeaderProps> = ({
  isOnTour,
  isFavorite,
  artist,
  removeFavoriteArtist,
  addFavoriteArtist
}) => {
  const { t }= useTranslation('artist');
  return <div className={styles.artist_header_overlay}>
    <div className={styles.artist_header_container}>
      {
        artist.images &&
        <div
          className={styles.artist_avatar}
          style={{
            background: `url('${get(artist, 'images[1]', artPlaceholder)
            }')`,
            backgroundRepeat: 'noRepeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
      }

      <div className={styles.artist_name_container}>
        <div className={styles.artist_name_line}>
          <h1>{artist.name}</h1>
          {
            isOnTour &&
            <span
              className={styles.on_tour}
            >
              { t('tour') }
            </span>
          }

          <a
            href='#'
            className={styles.artist_favorites_button_wrap}
            data-testid='add-remove-favorite'
            onClick={
              isFavorite
                ? removeFavoriteArtist
                : addFavoriteArtist
            }
          >
            <Icon
              name={isFavorite ? 'heart' : 'heart outline'}
              size='big'
            />
          </a>
        </div>

        <ArtistTags
          tags={artist.tags}
        />
      </div>
    </div>
  </div>;
};
