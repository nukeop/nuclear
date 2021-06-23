import React from 'react';
import _ from 'lodash';
import { Icon, Segment } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import ArtistList from '../ArtistList';
import Header from '../Header';

import styles from './styles.scss';

const EmptyState = () => {
  const { t } = useTranslation('favorite-artists');
  return (
    <div className={styles.empty_state}>
      <Icon.Group>
        <Icon name='star' />
        <Icon corner name='user' />
      </Icon.Group>
      <h2>{t('empty')}</h2>
      <div>{t('empty-help')}</div>
    </div>
  );
};

type FavoriteArtistsViewProps = {
  artists: { id: string, name: string } [];
  artistInfoSearch: (artistId: any, artist: any) => Promise<void>;
  removeFavoriteArtist: React.MouseEventHandler;
}

export const FavoriteArtistsView: React.FC<FavoriteArtistsViewProps> = ({
  artists,
  artistInfoSearch,
  removeFavoriteArtist
}) => {
  const { t } = useTranslation('favorite-artists');
  return (
    <div className={styles.favorite_artists_view}>
      {
        _.isEmpty(artists) &&
          <EmptyState />
      }
      {
        !_.isEmpty(artists) &&
          <>
            <Header>
              {t('header')}
            </Header>
            <Segment className={styles.favorite_artists_segment}>
              <ArtistList
                artists={artists}
                artistInfoSearch={artistInfoSearch}
                removeFavoriteArtist={removeFavoriteArtist}
              />
            </Segment>
          </>
      }
    </div>
  );
};

export default FavoriteArtistsView;
