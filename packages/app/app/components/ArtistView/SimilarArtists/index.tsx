import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './styles.scss';

type SimilarArtistsProps = {
  artists: {
    name: string;
    thumbnail: string;
  }[];

  artistInfoSearchByName: (artistName: any) => Promise<void>;
}

const SimilarArtists: React.FC<SimilarArtistsProps> = ({
  artists,
  artistInfoSearchByName
}) => {

  const handleClickOnArtist = (artistName) => {
    artistInfoSearchByName(artistName);
  };
 
  const { t } = useTranslation('artist');
  return (
    <div className={styles.similar_artists_container}>
      <div className={styles.header}>
        { t('similar') }
      </div>
      {
        artists.map((artist, index) => {
          return (
            <div key={index} onClick={() => {
              handleClickOnArtist(artist.name);
            }} className={styles.artist_row}>
              <img src={artist.thumbnail} />
              <div>{artist.name}</div>
            </div>
          );
        })
      }
    </div>
  ); 
};

export default SimilarArtists;
