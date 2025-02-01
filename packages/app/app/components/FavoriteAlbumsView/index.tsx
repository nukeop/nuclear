import React from 'react';
import _ from 'lodash';
import { withRouter, RouteComponentProps } from 'react-router';
import { Icon, Segment } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import AlbumList from '../AlbumList';
import Header from '../Header';

import styles from './styles.scss';

type Tracklist = { 
  uuid:string;
  artist: { name: string };
  title: string;
  duration: number;
  }

type Album = {
  id: string;
  title: string;
  thumb: string;
  coverImage: string;
  artists: { name:string } [];
  images: Array<string>;
  genres: Array<string>;
  tracklist: Array<Tracklist>
}

type ReleaseTypeProps = 'master' | 'release'

type FavoriteAlbumsViewProps = {
  albums: Array<Album>;
  removeFavoriteAlbum: React.MouseEventHandler;
  albumInfoSearch: (albumId: string, releaseType: ReleaseTypeProps, release: string) => Promise<void>;
  history:RouteComponentProps['history']
}

const EmptyState = () => {
  const { t } = useTranslation('favorite-albums');
  return (
    <div className={styles.empty_state}>
      <Icon.Group>
        <Icon name='star' />
        <Icon corner name='dot circle' />
      </Icon.Group>
      <h2>{t('empty')}</h2>
      <div>{t('empty-help')}</div>
    </div>
  );
};

const FavoriteAlbumsView:React.FC<FavoriteAlbumsViewProps & RouteComponentProps > = ({
  albums,
  removeFavoriteAlbum,
  albumInfoSearch,
  history
}) => {
  const { t } = useTranslation('favorite-albums');
  return (
    <div className={styles.favorite_albums_view}>
      {
        _.isEmpty(albums) &&
          <EmptyState />
      }
      {
        !_.isEmpty(albums) &&
          <>
            <Header>
              {t('header')}
            </Header>
            <Segment className={styles.favorite_albums_segment}>
              <AlbumList
                albums={albums}
                albumInfoSearch={albumInfoSearch}
                history={history}
                removeFavoriteAlbum={removeFavoriteAlbum}
              />
            </Segment>
          </>
      }
    </div>
  );
};

export default withRouter(FavoriteAlbumsView);
